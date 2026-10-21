"""Local-only Pensieve server. Credentials stay in process memory."""
from __future__ import annotations
import argparse, base64, getpass, hashlib, io, json, os, secrets, threading, time, urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from PIL import Image, ImageOps
from manycore.aholo_sdk_core import AholoClientConfig
from manycore.aholo_sdk_asset import create_asset_client
from manycore.aholo_sdk_lux3d import create_lux3d_client
from manycore.aholo_sdk_world import create_world_client

ROOT = Path(__file__).resolve().parent
DATA = ROOT / '.runtime'
LIMIT = 10
LOCK = threading.RLock()
ACTIVE: set[str] = set()
KEY = ''
TOKEN = secrets.token_urlsafe(32)
PORT = 4174
STATE = {'attempts': 0, 'memories': {}}

def save():
    DATA.mkdir(mode=0o700, exist_ok=True)
    temp = DATA / 'state.tmp'
    temp.write_text(json.dumps(STATE, ensure_ascii=False, indent=2))
    temp.replace(DATA / 'state.json')

def update(mid, **values):
    with LOCK:
        STATE['memories'][mid].update(values)
        save()

def public(m):
    return {k: v for k, v in m.items() if k in {'id','name','status','message','task_id','created_at','model_url','photo_url','version','source','mode','world_id','world_assets','progress','completed_at'}}

def clients():
    config = AholoClientConfig(api_key=KEY, region='cn')
    return create_asset_client(config), create_lux3d_client(config)

def safe_error(exc):
    name = type(exc).__name__
    if 'Authentication' in name: return 'AHOLO 鉴权失败，请检查服务端密钥。'
    if 'RateLimit' in name: return 'AHOLO 请求受限，请稍后查询已有任务。'
    return 'AHOLO 请求未完成。已保留任务记录，不会自动重新生成。'

def download_glb(url, mid):
    if urlsplit(url).scheme != 'https': raise ValueError('Non-HTTPS output')
    target = DATA / f'{mid}.glb'
    temp = target.with_suffix('.part')
    with urllib.request.urlopen(url, timeout=90) as response, temp.open('wb') as out:
        total = 0
        while chunk := response.read(1024 * 1024):
            total += len(chunk)
            if total > 200 * 1024 * 1024: raise ValueError('Model exceeds 200 MB')
            out.write(chunk)
    with temp.open('rb') as f:
        if f.read(4) != b'glTF':
            temp.unlink(missing_ok=True)
            raise ValueError('Output is not GLB')
    temp.replace(target)

def work(mid, create=False):
    try:
        with LOCK: mode = STATE['memories'][mid].get('mode','lux3d')
        if mode == 'world':
            work_world(mid, create)
            return
        asset, lux = clients()
        with LOCK: m = dict(STATE['memories'][mid])
        if create:
            # No automatic generation retry. Reserve before any provider request.
            uploaded = asset.upload_file(str(DATA / f'{mid}.jpg'))
            update(mid, status='submitting', message='照片已上传，正在提交 3D 生成任务')
            task_id = lux.img_to_3d.create(img=uploaded.url, version='G1', face_count=50000, output_format=['zip','glb'], ai_predict_size=False)
            update(mid, task_id=task_id, status='generating', message='AHOLO 正在生成 3D 记忆，可离开后再回来')
        else:
            task_id = m.get('task_id')
            if not task_id: return
        deadline = time.monotonic() + 3600
        failures = 0
        while time.monotonic() < deadline:
            try:
                result = lux.tasks.retrieve(task_id)
                failures = 0
            except Exception:
                failures += 1
                if failures >= 5:
                    update(mid, status='paused', message='查询暂时中断，点击继续查询即可，不会重新扣生成额度')
                    return
                time.sleep(min(15 * failures, 60))
                continue
            status = result.get('status')
            if status in (4, 6):
                update(mid, status='failed', message='AHOLO 生成失败或已取消；未自动重试')
                return
            if status == 3:
                urls = [o.get('content', '') for o in result.get('outputs', [])]
                url = next((u for u in urls if urlsplit(u).path.lower().endswith('.glb')), None)
                # G1's documented output order is ZIP, then GLB.
                if not url and len(urls) > 1 and urls[1].startswith('https://'): url = urls[1]
                if not url:
                    update(mid, status='failed', message='任务已完成，但未返回可用的 GLB 模型')
                    return
                update(mid, status='caching', message='3D 已生成，正在保存到本地')
                try: download_glb(url, mid)
                except Exception:
                    update(mid, status='paused', message='模型下载暂未完成，可继续查询并重新下载，不会重新生成')
                    return
                update(mid, status='ready', model_url=f'/models/{mid}.glb', message='AHOLO 3D 记忆已就绪')
                return
            update(mid, status='generating', message='AHOLO 正在生成 3D 记忆，可离开后再回来')
            time.sleep(12)
        update(mid, status='paused', message='生成仍未结束，稍后点击继续查询，不会重新生成')
    except Exception as exc:
        with LOCK: m = STATE['memories'][mid]
        if m.get('task_id') or m.get('world_id'):
            update(mid, status='paused', message=safe_error(exc))
        else:
            # A lost create response may have created a billable task. Never retry it.
            status = 'uncertain' if m['status'] == 'submitting' else 'failed'
            message = '提交结果不确定，请到 AHOLO 控制台核对；为防止重复扣费，未自动重试' if status == 'uncertain' else safe_error(exc)
            update(mid, status=status, message=message)
        print('Provider operation stopped:', type(exc).__name__, flush=True)
    finally:
        with LOCK: ACTIVE.discard(mid)

def start(mid, create=False):
    with LOCK:
        if mid in ACTIVE: return
        ACTIVE.add(mid)
        threading.Thread(target=work, args=(mid, create), daemon=True).start()


def cache_world_file(url, target, max_bytes=300*1024*1024):
    if urlsplit(url).scheme!='https':raise ValueError('Invalid world asset URL')
    target.parent.mkdir(exist_ok=True)
    temp=target.with_suffix('.part')
    with urllib.request.urlopen(url,timeout=120) as response,temp.open('wb') as out:
        count=0
        while chunk:=response.read(1024*1024):
            count+=len(chunk)
            if count>max_bytes:raise ValueError('World asset exceeds local limit')
            out.write(chunk)
    temp.replace(target)

def work_world(mid, create=False):
    config=AholoClientConfig(api_key=KEY,region='cn')
    world=create_world_client(config)
    with LOCK:m=dict(STATE['memories'][mid])
    if create:
        image=create_asset_client(config).upload_file(str(DATA/f'{mid}.jpg'))
        update(mid,status='submitting',message='照片已上传，正在提交 World 空间生成')
        op=world.generations.create(name=m['name'],resources=[{'type':'image','url':image.url}],prompt='根据参考照片生成一个自然真实的室内空间，尽量保留可见墙面、木质餐桌、椅子、地板、门和原有光线。不额外添加人物。')
        world_id=op['worldId']
        update(mid,world_id=world_id,status='generating',message='World 正在生成记忆空间，可离开后回来')
    else:world_id=m['world_id']
    deadline=time.monotonic()+3600
    failures=0
    while time.monotonic()<deadline:
        try:detail=world.retrieve(world_id);failures=0
        except Exception:
            failures+=1
            if failures>=5:
                update(mid,status='paused',message='World 查询暂时中断，可继续查询已有任务')
                return
            time.sleep(min(failures*12,45));continue
        status=detail.get('status')
        if status in ('FAILED','CANCELED','TIMEOUT','REJECTED'):
            update(mid,status='failed',message=f'World 任务结束：{status}；没有自动重新生成')
            return
        if status=='SUCCEEDED':
            update(mid,status='caching',message='空间已生成，正在保存 3DGS 资源到本地')
            assets=detail.get('assets') or {};urls=(assets.get('splats') or {}).get('urls') or {}
            folder=DATA/mid;folder.mkdir(exist_ok=True)
            local={}
            for key,filename in [('spzPath','space.spz'),('plyPath','space.ply')]:
                if urls.get(key):
                    try:
                        cache_world_file(urls[key],folder/filename)
                        local['splat_url']=f'/world-assets/{mid}/{filename}'
                        local['format']=filename.split('.')[-1]
                        break
                    except Exception:continue
            pano=(assets.get('imagery') or {}).get('panoUrl')
            if pano:
                try:
                    cache_world_file(pano,folder/'panorama.jpg',50*1024*1024)
                    local['panorama_url']=f'/world-assets/{mid}/panorama.jpg'
                except Exception:pass
            local['up_axis']=(assets.get('semanticsMetadata') or {}).get('upAxis')
            # Persist provider response locally for inspection, never return signed URLs to the UI.
            (folder/'provider-result.json').write_text(json.dumps(detail,ensure_ascii=False,indent=2))
            if not local.get('splat_url'):
                update(mid,status='paused',world_assets=local,message='生成结束，但 3DGS 下载未完成，可继续查询已有空间')
                return
            update(mid,status='ready',progress=1,completed_at=time.time(),world_assets=local,message='World 记忆空间已就绪')
            return
        update(mid,status='generating',progress=detail.get('progress'),message=f'World 正在生成记忆空间（{status}）')
        time.sleep(12)
    update(mid,status='paused',message='World 仍未完成，可稍后继续查询同一任务')

def prepare_image(encoded):
    data = base64.b64decode(encoded, validate=True)
    if len(data) > 12 * 1024 * 1024: raise ValueError('照片过大，请选择小于 12MB 的照片')
    with Image.open(io.BytesIO(data)) as image:
        if image.width * image.height > 30_000_000: raise ValueError('照片分辨率过大')
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((2048, 2048))
        out = io.BytesIO(); image.save(out, format='JPEG', quality=90)
    return out.getvalue()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory=str(ROOT / 'dist'), **kwargs)
    def log_message(self, fmt, *args):
        # Never log request bodies, credentials, or signed provider URLs.
        pass
    def json_response(self, value, status=200):
        data = json.dumps(value, ensure_ascii=False).encode()
        self.send_response(status); self.send_header('Content-Type', 'application/json; charset=utf-8'); self.send_header('Cache-Control','no-store'); self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)
    def valid_host(self): return self.headers.get('Host') in (f'localhost:{PORT}',f'127.0.0.1:{PORT}')
    def do_GET(self):
        if not self.valid_host(): return self.json_response({'error':'Invalid host'},403)
        path = urlsplit(self.path).path
        if path == '/api/session':
            with LOCK: return self.json_response({'configured':bool(KEY),'token':TOKEN,'attempts':STATE['attempts'],'limit':LIMIT})
        if path == '/api/memories':
            with LOCK: return self.json_response({'items':[public(m) for m in STATE['memories'].values()],'attempts':STATE['attempts'],'limit':LIMIT})
        if path.startswith('/world-assets/'):
            parts=path.split('/')
            if len(parts)!=4:return self.json_response({'error':'Not found'},404)
            mid,filename=parts[2:]
            if len(mid)!=64 or any(c not in '0123456789abcdef' for c in mid) or filename not in ('space.spz','space.ply','panorama.jpg'):
                return self.json_response({'error':'Not found'},404)
            file=DATA/mid/filename
            if not file.is_file():return self.json_response({'error':'Not found'},404)
            self.send_response(200);self.send_header('Content-Type','image/jpeg' if filename.endswith('.jpg') else 'application/octet-stream');self.send_header('Content-Length',str(file.stat().st_size));self.send_header('Cache-Control','private, max-age=3600');self.end_headers()
            with file.open('rb') as f:
                while chunk:=f.read(1024*1024):self.wfile.write(chunk)
            return
        if path.startswith('/models/') or path.startswith('/photos/'):
            filename = path.rsplit('/',1)[-1]
            ext = '.glb' if path.startswith('/models/') else '.jpg'
            mid = filename.removesuffix(ext)
            if len(mid)!=64 or any(c not in '0123456789abcdef' for c in mid) or filename != mid+ext:
                return self.json_response({'error':'Not found'},404)
            file = DATA / filename
            if not file.is_file(): return self.json_response({'error':'Not found'},404)
            self.send_response(200);self.send_header('Content-Type','model/gltf-binary' if ext=='.glb' else 'image/jpeg');self.send_header('Content-Length',str(file.stat().st_size));self.send_header('Cache-Control','private, max-age=3600');self.end_headers()
            with file.open('rb') as f:
                while chunk:=f.read(1024*1024):self.wfile.write(chunk)
            return
        if path.startswith('/api/'): return self.json_response({'error':'Not found'},404)
        return super().do_GET()
    def do_POST(self):
        if not self.valid_host() or self.headers.get('X-Pensieve-Token') != TOKEN:
            return self.json_response({'error':'请刷新页面后重试'},403)
        origin = self.headers.get('Origin')
        if origin and origin not in (f'http://localhost:{PORT}',f'http://127.0.0.1:{PORT}'):
            return self.json_response({'error':'Invalid origin'},403)
        if not KEY: return self.json_response({'error':'服务端尚未配置 AHOLO_KEY'},503)
        path = urlsplit(self.path).path
        if path.startswith('/api/resume/'):
            mid=path.rsplit('/',1)[-1]
            with LOCK:
                m=STATE['memories'].get(mid)
                if not m or not (m.get('task_id') or m.get('world_id')):return self.json_response({'error':'无可恢复任务'},404)
                if m['status']=='ready':return self.json_response(public(m))
                if ACTIVE and mid not in ACTIVE:return self.json_response({'error':'请等待当前任务完成'},409)
                start(mid)
                return self.json_response(public(m))
        if path!='/api/memories': return self.json_response({'error':'Not found'},404)
        try:
            length=int(self.headers.get('Content-Length','0'))
            if not 0<length<18*1024*1024:raise ValueError('照片大小超限')
            body=json.loads(self.rfile.read(length))
            data=prepare_image(body['image'])
            mode=body.get('mode','lux3d')
            if mode not in ('lux3d','world'):raise ValueError('Unknown mode')
            mid=hashlib.sha256((b'world-v1:' if mode=='world' else b'')+data).hexdigest()
            with LOCK:
                if mid in STATE['memories']: return self.json_response(public(STATE['memories'][mid]))
                if ACTIVE:return self.json_response({'error':'已有记忆正在生成，请等待完成后再提交下一张'},409)
                if STATE['attempts']>=LIMIT:return self.json_response({'error':'已达到本轮 10 次生成上限'},429)
                (DATA/f'{mid}.jpg').write_bytes(data)
                m={'id':mid,'name':str(body.get('name','记忆照片'))[:120],'created_at':time.time(),'status':'uploading','message':'正在将这张照片发送到 AHOLO','photo_url':f'/photos/{mid}.jpg','version':'G1','source':'AHOLO Lux3D'}
                if mode=='world':m.update(mode='world',source='AHOLO World',version='Spatial Gen')
                STATE['attempts']+=1;STATE['memories'][mid]=m;save();start(mid,True)
                return self.json_response(public(m),202)
        except (ValueError,KeyError,TypeError,OSError,Image.DecompressionBombError):return self.json_response({'error':'无法读取照片，请选择 JPG、PNG 或 WebP'},400)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=4174);parser.add_argument('--prompt-key',action='store_true');args=parser.parse_args();PORT=args.port
    KEY=os.getenv('AHOLO_KEY') or os.getenv('AHOLO_API_KEY') or ''
    if args.prompt_key and not KEY:KEY=getpass.getpass('AHOLO key (hidden): ')
    DATA.mkdir(mode=0o700,exist_ok=True)
    if (DATA/'state.json').exists():STATE=json.loads((DATA/'state.json').read_text())
    for mid,m in STATE['memories'].items():
        if (m.get('task_id') or m.get('world_id')) and m['status'] in ('generating','caching','paused'):start(mid)
        elif m['status'] in ('uploading','submitting'):
            m.update(status='uncertain',message='上次服务中断，未自动重新提交，请核对 AHOLO 控制台')
    save()
    print(f'Pensieve: http://localhost:{PORT} | AHOLO configured: {bool(KEY)} | attempts: {STATE["attempts"]}/{LIMIT}',flush=True)
    ThreadingHTTPServer(('127.0.0.1',PORT),Handler).serve_forever()
