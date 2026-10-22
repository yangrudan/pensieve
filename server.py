"""Local-only Pensieve server. Credentials stay in process memory."""
from __future__ import annotations
import argparse, base64, getpass, hashlib, io, json, os, re, secrets, threading, time, urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from PIL import Image, ImageOps
import atlas_store
import world_lab
import crystal_lab
from manycore.aholo_sdk_core import AholoClientConfig
from manycore.aholo_sdk_asset import create_asset_client
from manycore.aholo_sdk_lux3d import create_lux3d_client
from manycore.aholo_sdk_world import create_world_client

ROOT = Path(__file__).resolve().parent
DATA = ROOT / '.runtime'
LIMIT = 40  # User-authorized cumulative generation submission limit
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
    return {k: v for k, v in m.items() if k in {'id','name','status','message','task_id','created_at','model_url','photo_url','version','source','mode','world_id','world_assets','progress','completed_at','views','view_source_id','face_count','experimental','case','world_method','input_count'}}

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
        if mode == 'fourview':
            work_fourview(mid, create)
            return
        if mode == 'world':
            work_world(mid, create)
            return
        asset, lux = clients()
        with LOCK: m = dict(STATE['memories'][mid])
        if create:
            # No automatic generation retry. Reserve before any provider request.
            if m.get('generation_method')=='text_to_3d':
                update(mid,status='submitting',message='正在向 AHOLO Lux3D 提交水晶造型生成')
                task_id=lux.text_to_3d.create(prompt=m['prompt'],version='G1',face_count=m.get('face_count',50000),output_format=['zip','glb'],ai_predict_size=False)
            elif mode == 'multiview':
                update(mid,status='submitting',message='正在提交四视图 3D 生成任务')
                source = m['view_source_id']
                images = [asset.upload_file(str(DATA/source/f'view-{i}.jpg')).url for i in range(4)]
                task_id = lux.img_to_3d.create(imgs=images, version='G1', face_count=200000, output_format=['zip','glb'], ai_predict_size=False)
            else:
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
        detail=str(exc).replace(KEY,'[REDACTED]') if KEY else str(exc)
        detail=re.sub(r'https?://\S+','[URL]',detail)
        update(mid,provider_error_type=type(exc).__name__,provider_error_code=getattr(exc,'cmd_code',None),provider_error_message=detail[:500])
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



def work_fourview(mid, create=False):
    asset,lux=clients()
    with LOCK:m=dict(STATE['memories'][mid])
    if create:
        image=asset.upload_file(str(DATA/f'{mid}.jpg'))
        update(mid,status='submitting',message='正在生成摆件的四个视角')
        task_id=lux.image_to_four_view.create(img=image.url,prompt='只选择照片左侧戴黄色帽子的白色柯基纸雕摆件，移除右侧的棕色摆件和全部杂乱背景。准确保留左侧摆件的黄色帽子、白色身体、面部表情、短腿、纸片层叠材质与轮廓比例。生成该同一只摆件的四视图，完整主体，干净浅灰背景，视角之间形状和材质保持一致，不增加人物或其他物体。')
        update(mid,status='generating',task_id=task_id,message='AHOLO 正在生成四视图；这是合成视角，不是真实多角度照片')
    else:task_id=m['task_id']
    result=lux.tasks.wait_for(task_id,interval_ms=12000,timeout_ms=1800000)
    content=(result.get('outputs') or [{}])[0].get('content','[]')
    urls=json.loads(content)
    if not isinstance(urls,list) or len(urls)!=4:raise ValueError('Expected four views')
    folder=DATA/mid;folder.mkdir(exist_ok=True);views=[]
    for i,url in enumerate(urls):
        if urlsplit(url).scheme!='https':raise ValueError('Invalid view URL')
        with urllib.request.urlopen(url,timeout=60) as response:
            data=response.read(20*1024*1024)
        with Image.open(io.BytesIO(data)) as image:image.convert('RGB').save(folder/f'view-{i}.jpg',quality=95)
        views.append(f'/world-assets/{mid}/view-{i}.jpg')
    update(mid,status='ready',views=views,completed_at=time.time(),message='四视图已生成，待检查后决定是否建模')

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
        asset=create_asset_client(config)
        if m.get('experimental'):
            manifest,files,expected_id=world_lab.load_case(ROOT,m['case'])
            if expected_id!=mid:raise ValueError('Input changed after reservation')
            resources=[]
            for i,file in enumerate(files):
                uploaded=asset.upload_file(str(file));resources.append({'type':'image','url':uploaded.url})
                update(mid,message=f'已上传 {i+1} / {len(files)} 个视角')
            update(mid,status='submitting',message='视角已上传，正在提交 World 实验')
            if manifest['method']=='reconstruction':
                op=world.reconstructions.create(name=m['name'],resources=resources,task_quality=manifest.get('task_quality','normal'),scene='space',use_mask=False)
            else:op=world.generations.create(name=m['name'],resources=resources,prompt=manifest.get('prompt','一个真实尺度的魔法石大厅，无人物'))
        else:
            image=asset.upload_file(str(DATA/f'{mid}.jpg'))
            update(mid,status='submitting',message='照片已上传，正在提交 World 空间生成')
            op=world.generations.create(name=m['name'],resources=[{'type':'image','url':image.url}],prompt='根据参考照片生成一个自然真实的室内空间，尽量保持可见墙面、地板、门窗、家具的位置、数量、材质和原有光线。不要添加人物，不要复制已有家具或增加额外门窗。不可见区域保持简洁并与照片连贯。')
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
            folder=DATA/mid;folder.mkdir(exist_ok=True)
            (folder/'provider-failure.json').write_text(json.dumps(detail,ensure_ascii=False,indent=2))
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
        action='重建' if m.get('world_method')=='reconstruction' else '生成'
        update(mid,status='generating',progress=detail.get('progress'),message=f'World 正在{action}记忆空间（{status}）')
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
        if path == '/api/experiments':
            with LOCK:return self.json_response({'items':[public(m) for m in STATE['memories'].values() if m.get('experimental')],'attempts':STATE['attempts'],'limit':LIMIT})
        if path.startswith('/lab-inputs/'):
            parts=path.split('/')
            try:
                if len(parts)!=4:raise ValueError()
                file=world_lab.input_file(ROOT,parts[2],parts[3])
                if file is None:raise ValueError()
                content=file.read_bytes();self.send_response(200);self.send_header('Content-Type','image/png' if file.suffix=='.png' else 'image/webp' if file.suffix=='.webp' else 'image/jpeg');self.send_header('Content-Length',str(len(content)));self.end_headers();self.wfile.write(content);return
            except (ValueError,OSError,TypeError,KeyError):return self.json_response({'error':'Not found'},404)
        if path == '/api/atlas':
            with LOCK: return self.json_response(atlas_store.snapshot(STATE))
        if path == '/api/memories':
            with LOCK: return self.json_response({'items':[public(m) for m in STATE['memories'].values() if not m.get('experimental')],'attempts':STATE['attempts'],'limit':LIMIT})
        if path.startswith('/world-assets/'):
            parts=path.split('/')
            if len(parts)!=4:return self.json_response({'error':'Not found'},404)
            mid,filename=parts[2:]
            if len(mid)!=64 or any(c not in '0123456789abcdef' for c in mid) or filename not in ('space.spz','space.ply','panorama.jpg','view-0.jpg','view-1.jpg','view-2.jpg','view-3.jpg'):
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
        path = urlsplit(self.path).path
        if path == '/api/atlas':
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<18*1024*1024:raise ValueError('内容大小超限')
                body=json.loads(self.rfile.read(length))
                with LOCK:
                    result=atlas_store.mutate(STATE,body,DATA,prepare_image);save()
                return self.json_response(result)
            except (ValueError,TypeError,KeyError,AttributeError,Image.DecompressionBombError) as exc:
                return self.json_response({'error':str(exc) if isinstance(exc,ValueError) else '无法保存，请检查输入'},400)
            except OSError:return self.json_response({'error':'本地保存失败，请重试'},500)
        if not KEY: return self.json_response({'error':'服务端尚未配置 AHOLO_KEY'},503)
        if path == '/api/crystal-experiments':
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<1024:raise ValueError('实验请求大小无效')
                body=json.loads(self.rfile.read(length));mid,settings=crystal_lab.prototype(body.get('case'))
                if body.get('retry_business_rejection') is True:
                    with LOCK:
                        previous=STATE['memories'].get(mid,{})
                        if ACTIVE or body.get('observed_error_type')!='BusinessError':return self.json_response({'error':'重提需要已核对的业务拒绝，且没有运行中的生成'},409)
                        known={str(m['task_id']) for m in STATE['memories'].values() if m.get('task_id')}
                    try:
                        _,lux=clients();history=lux.tasks.list(page=1,page_size=100)
                    except Exception:return self.json_response({'error':'暂时无法核对任务历史，未重提'},503)
                    if not crystal_lab.verify_rejected_retry(previous,history,known):return self.json_response({'error':'任务历史不足以排除重复任务，不重提'},409)
                    with LOCK:
                        if ACTIVE or not crystal_lab.verify_rejected_retry(STATE['memories'].get(mid,{}),history,known):return self.json_response({'error':'任务状态变化，未重提'},409)
                        if STATE['attempts']>=LIMIT:return self.json_response({'error':'生成次数已达上限'},429)
                        item=STATE['memories'][mid]
                        item.setdefault('submission_history',[]).append({'status':item['status'],'created_at':item['created_at'],'observed_error_type':'BusinessError','history_total':history['total'],'checked_at':time.time()})
                        item.update(retry_count=1,status='submitting',message='业务拒绝已核对；完整任务历史未发现遗留任务，手动重提一次')
                        STATE['attempts']+=1;save();start(mid,True)
                    return self.json_response(public(item),202)
                with LOCK:
                    if mid in STATE['memories']:return self.json_response(public(STATE['memories'][mid]))
                    if any(not STATE['memories'].get(i,{}).get('experimental') for i in ACTIVE) or len(ACTIVE)>=2:return self.json_response({'error':'请等待当前任务完成'},409)
                    if STATE['attempts']>=LIMIT:return self.json_response({'error':f'已达到本轮 {LIMIT} 次生成上限'},429)
                    m={'id':mid,'experimental':True,'case':settings['case'],'mode':'lux3d','generation_method':'text_to_3d','prompt':settings['prompt'],'name':settings['name']+' · Lux3D','source':'AHOLO Lux3D · 文生 3D','version':'G1','face_count':settings['face_count'],'created_at':time.time(),'status':'submitting','message':'已预留一次生成额度，准备提交水晶样品'}
                    STATE['attempts']+=1;STATE['memories'][mid]=m;save();start(mid,True)
                return self.json_response(public(m),202)
            except (ValueError,KeyError,TypeError):return self.json_response({'error':'水晶实验请求无效，未提交生成'},400)
        if path == '/api/experiments':
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<4096:raise ValueError('实验请求大小超限')
                body=json.loads(self.rfile.read(length));case=body.get('case')
                manifest,files,mid=world_lab.load_case(ROOT,case)
                with LOCK:
                    if mid in STATE['memories']:return self.json_response(public(STATE['memories'][mid]))
                    if any(not STATE['memories'].get(i,{}).get('experimental') for i in ACTIVE) or len(ACTIVE)>=2:return self.json_response({'error':'请等待当前任务完成'},409)
                    if STATE['attempts']>=LIMIT:return self.json_response({'error':f'已达到本轮 {LIMIT} 次生成上限'},429)
                    m={'id':mid,'case':case,'experimental':True,'mode':'world','world_method':manifest['method'],'input_count':len(files),'name':manifest.get('name',case),'source':'AHOLO World','version':'Reconstruction' if manifest['method']=='reconstruction' else 'Spatial Gen','created_at':time.time(),'status':'uploading','message':'正在上传实验视角','photo_url':f'/lab-inputs/{case}/{files[0].name}'}
                    STATE['attempts']+=1;STATE['memories'][mid]=m;save();start(mid,True)
                return self.json_response(public(m),202)
            except (ValueError,KeyError,TypeError,OSError,AttributeError,Image.DecompressionBombError):return self.json_response({'error':'实验图片集不完整或无效，未提交生成'},400)
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
            if mode not in ('lux3d','world','fourview','multiview'):raise ValueError('Unknown mode')
            source_id=body.get('view_source_id')
            if mode=='multiview':
                with LOCK:source=STATE['memories'].get(source_id)
                if not source or source.get('mode')!='fourview' or source.get('status')!='ready':raise ValueError('Four views not ready')
                if len(source.get('views',[]))!=4 or not all((DATA/source_id/f'view-{i}.jpg').is_file() for i in range(4)):raise ValueError('Four view cache missing')
            prefix={'lux3d':b'','world':b'world-v1:','fourview':b'fourview-isolate-v1:','multiview':f'multiview-g1-v1:{source_id}:'.encode()}[mode]
            mid=hashlib.sha256(prefix+data).hexdigest()
            with LOCK:
                if mid in STATE['memories']:
                    atlas_store.migrate_archive(STATE,body.get('archive_id'),mid);save()
                    return self.json_response(public(STATE['memories'][mid]))
                if ACTIVE:return self.json_response({'error':'已有记忆正在生成，请等待完成后再提交下一张'},409)
                if STATE['attempts']>=LIMIT:return self.json_response({'error':f'已达到本轮 {LIMIT} 次生成上限'},429)
                (DATA/f'{mid}.jpg').write_bytes(data)
                m={'id':mid,'name':str(body.get('name','记忆照片'))[:120],'created_at':time.time(),'status':'uploading','message':'正在将这张照片发送到 AHOLO','photo_url':f'/photos/{mid}.jpg','version':'G1','source':'AHOLO Lux3D'}
                if mode=='world':m.update(mode='world',source='AHOLO World',version='Spatial Gen')
                elif mode=='fourview':m.update(mode='fourview',source='AHOLO 四视图',version='Four View')
                elif mode=='multiview':m.update(mode='multiview',source='AHOLO Lux3D · 四视图建模',version='G1',view_source_id=source_id,face_count=200000)
                STATE['attempts']+=1;STATE['memories'][mid]=m;atlas_store.migrate_archive(STATE,body.get('archive_id'),mid);save();start(mid,True)
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
