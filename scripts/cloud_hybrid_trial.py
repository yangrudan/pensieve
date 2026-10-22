"""One bounded cloud Mesh + 3DGS trial; all create operations are explicit.

No API keys or streaming credentials are written to disk. Uncertain asset
submissions are never retried automatically. Stream cleanup runs in finally
and from an independent five-minute watchdog.
"""
from __future__ import annotations
import argparse,base64,getpass,io,json,logging,math,os,re,threading,time,uuid
from pathlib import Path
from manycore.aholo_sdk_core import AholoClientConfig,create_gateway_client
from manycore.aholo_sdk_asset import create_asset_client
from PIL import Image,ImageStat

ROOT=Path(__file__).resolve().parents[1]
FOLDER=ROOT/'.local/cloud-hybrid'
STATE_FILE=FOLDER/'trial-state.json'
logging.disable(logging.CRITICAL)
SAVE_LOCK=threading.RLock()

def save(state):
    with SAVE_LOCK:
        FOLDER.mkdir(parents=True,exist_ok=True)
        temp=STATE_FILE.with_suffix('.tmp');temp.write_text(json.dumps(state,ensure_ascii=False,indent=2));temp.chmod(0o600);temp.replace(STATE_FILE)

def safe_error(exc,key=''):
    text=str(exc).replace(key,'[REDACTED]') if key else str(exc)
    text=re.sub(r'(?:https?|wss?)://\S+','[URL]',text)
    return {'type':type(exc).__name__,'http_status':getattr(exc,'status_code',None),'message':text[:800]}

def redact(value,key=''):
    if isinstance(value,dict):return {k:redact(v,key) for k,v in value.items() if not any(x in k.lower() for x in ('token','authorization','password','secret'))}
    if isinstance(value,list):return [redact(v,key) for v in value]
    if isinstance(value,str):return re.sub(r'(?:https?|wss?)://\S+','[URL]',value.replace(key,'[REDACTED]') if key else value)
    return value

def unwrap(reply):
    for _ in range(3):
        if isinstance(reply,dict) and 'c' in reply:
            if str(reply['c'])!='0':raise RuntimeError('Provider business error c='+str(reply['c'])+': '+str(reply.get('m')))
            reply=reply.get('d');continue
        if isinstance(reply,dict) and 'success' in reply:
            if not reply['success']:raise RuntimeError('Provider rejected operation: '+str(reply.get('errorMsg')))
            reply=reply.get('data');continue
        return reply
    return reply

def query_existing_assets(client,state):
    """Read-only provider requests; never upload, create, or retry an asset."""
    assets=state.get('assets',{})
    for name in ('mesh','gs'):
        item=assets.get(name,{})
        if item.get('mesh_id'):continue
        if not item.get('task_id'):raise RuntimeError('No known '+name+' task ID; status query cannot submit assets.')
        raw=client.gateway_request(method='GET',path='/rendercloud/v1/mesh-upload-process/task/get',query={'taskid':item['task_id']})
        detail=unwrap(raw)
        if not isinstance(detail,dict):raise RuntimeError('Unexpected asset query response')
        item['last_status']=detail.get('status');item['last_checked_at']=time.time();item['provider_status_reply']=redact(raw,getattr(client,'api_key',''))
        if detail.get('status')==3:
            outputs=detail.get('outputs') or []
            if not outputs or not outputs[0].get('content'):raise RuntimeError('Asset succeeded without mesh ID')
            item['mesh_id']=outputs[0]['content']
        if detail.get('status')==4:item['failed']=True
        save(state);print('Existing asset status:',name,item['last_status'],flush=True)
    state['assets_ready']=all(assets.get(name,{}).get('mesh_id') for name in ('mesh','gs'))
    save(state)
    return state['assets_ready']

def prepare_assets(client,asset,state,retry_uncertain=None):
    # The flag is an operator action, NOT authorization. Obtain user approval
    # before running it when an earlier task might already exist.
    assets=state.setdefault('assets',{})
    for name,file in [('mesh',FOLDER/'crystal-bench.glb'),('gs',FOLDER/'upper-architecture.ply')]:
        item=assets.setdefault(name,{'file':file.name})
        if item.get('mesh_id'):continue
        if not item.get('task_id'):
            if item.get('submitting'):
                if retry_uncertain!=name:raise RuntimeError('Previous asset submission uncertain; requires explicit approval before one retry.')
                item['uncertain_previous_submission']=True;item['approved_operator_retry']=True
            print('Uploading prepared',name,flush=True)
            uploaded=asset.upload_file(str(file))
            item['submitting']=True;state['asset_submission_attempts']=state.get('asset_submission_attempts',0)+1;save(state)
            raw=client.gateway_request(method='POST',path='/rendercloud/v1/mesh-upload-process/task/create',body={'originMeshUrl':uploaded.url,'fastUpload':False})
            item['provider_create_reply']=redact(raw,getattr(client,'api_key',''));save(state)
            try:value=unwrap(raw)
            except RuntimeError:item['submitting']=False;item['rejected']=True;save(state);raise
            task_id=value.get('taskId') if isinstance(value,dict) else value
            if not isinstance(task_id,(int,str)) or not str(task_id).isdigit():raise RuntimeError('Asset response has no usable task ID; response retained for inspection.')
            item['task_id']=task_id;item['submitting']=False;save(state);print('Asset task created:',name,task_id,flush=True)
        deadline=time.monotonic()+900;previous=None
        while time.monotonic()<deadline:
            raw=client.gateway_request(method='GET',path='/rendercloud/v1/mesh-upload-process/task/get',query={'taskid':item['task_id']})
            detail=unwrap(raw)
            if not isinstance(detail,dict):raise RuntimeError('Unexpected asset query response')
            status=detail.get('status')
            if status!=previous:
                item['last_status']=status;item['provider_status_reply']=redact(raw,getattr(client,'api_key',''));save(state)
                print('Asset status:',name,status,flush=True);previous=status
            if status==3:
                outputs=detail.get('outputs') or []
                if not outputs or not outputs[0].get('content'):raise RuntimeError('Asset succeeded without mesh ID')
                item['mesh_id']=outputs[0]['content'];save(state);break
            if status==4:item['failed']=True;save(state);raise RuntimeError('Provider asset processing failed for '+name)
            time.sleep(5)
        else:raise TimeoutError('Asset processing exceeded 15 minutes; not resubmitted.')
    state['assets_ready']=True;state.pop('last_error',None);save(state);print('Both assets parsed; no render session created yet.',flush=True)

def matrix(rows):
    if len(rows)!=4 or any(len(r)!=4 or not all(math.isfinite(x) for x in r) for r in rows):raise ValueError('Invalid transform matrix')
    return '('+', '.join('('+', '.join(f'{x:.9g}' for x in row)+')' for row in rows)+')'

def camera_rows(values):
    # Three.js Y-up meters / column-major -> cloud Z-up millimeters / row vector.
    if len(values)!=16:raise ValueError('Camera transform must have 16 values')
    rows=[[values[i],-values[i+2],values[i+1],0] for i in (0,4,8)]
    rows.append([values[12]*1000,-values[14]*1000,values[13]*1000,1]);return rows

def camera_prim(view,over=False):
    verb='over' if over else 'def'
    return f'''{verb} "Cameras" {{ {verb} Camera "MainCamera" {{
 token projection = "perspective"
 float2 clippingRange = (50, 150000)
 float focalLength = 23.052
 float horizontalAperture = 42.666667
 float verticalAperture = 24
 float fStop = 0
 matrix4d xformOp:transform = {matrix(camera_rows(view['camera']))}
 uniform token[] xformOpOrder = ["xformOp:transform"]
 }} }}'''

def scene_text(state,view,mesh_scale=1000,gs_scale=1600):
    mids=[state['assets'][k]['mesh_id'] for k in ('mesh','gs')]
    if any(not re.fullmatch(r'[a-zA-Z0-9_-]{5,100}',x) for x in mids):raise ValueError('Invalid mesh ID')
    ms=matrix([[mesh_scale,0,0,0],[0,0,mesh_scale,0],[0,-mesh_scale,0,0],[0,0,0,1]])
    gs=matrix([[0,-gs_scale,0,0],[gs_scale,0,0,0],[0,0,gs_scale,0],[0,-8200,2720,1]])
    return f'''#usda 1.0
(defaultPrim = "World")
def Xform "World" {{
 def Xform "FixedMesh" {{
  matrix4d xformOp:transform = {ms}
  uniform token[] xformOpOrder = ["xformOp:transform"]
  def Mesh "Geom" (payload = @manycore:/mesh/{mids[0]}@</mesh>) {{}}
 }}
 def Xform "Atmosphere" {{
  matrix4d xformOp:transform = {gs}
  uniform token[] xformOpOrder = ["xformOp:transform"]
  def ParticleField3DGaussianSplat "GS" (payload = @manycore:/mesh/{mids[1]}@</GaussianSplatData>) {{}}
 }}
 {camera_prim(view)}
 def Xform "Lights" {{
  def SphereLight "Key" {{
   color3f inputs:color = (1, 0.94, 0.84)
   float inputs:intensity = 8
   float inputs:radius = 1300
   bool inputs:normalize = false
   matrix4d xformOp:transform = ((1,0,0,0),(0,1,0,0),(0,0,1,0),(0,-2500,6500,1))
   uniform token[] xformOpOrder = ["xformOp:transform"]
  }}
  def SphereLight "Fill" {{
   color3f inputs:color = (0.73, 0.84, 1)
   float inputs:intensity = 4
   float inputs:radius = 1000
   bool inputs:normalize = false
   matrix4d xformOp:transform = ((1,0,0,0),(0,1,0,0),(0,0,1,0),(-4000,-4500,3500,1))
   uniform token[] xformOpOrder = ["xformOp:transform"]
  }}
 }}
}}
def Scope "Render" {{ def RenderSettings "Main" {{
 rel camera = </World/Cameras/MainCamera>
 int2 resolution = (1280, 720)
 custom float3 manycore:environment:giIntensity = (1.2, 1.2, 1.2)
}} }}
'''

def close_session(client,state):
    sid=state.get('session_id')
    if not sid:return
    result=unwrap(client.gateway_request(method='DELETE',path='/rendercloud/v1/streams/'+sid))
    state['cleanup']={'confirmed':isinstance(result,dict) and isinstance(result.get('closed'),bool),'result':result,'at':time.time()};save(state)
    print('Session release confirmed:',state['cleanup']['confirmed'],flush=True)

def capture(ws,label,state,wait_seconds=20):
    if not re.fullmatch(r'[a-z0-9-]{1,50}',label):raise ValueError('Invalid image label')
    folder=FOLDER/'frames';folder.mkdir(exist_ok=True);started=time.monotonic();first=None;last=None;count=0;first_latency=None
    while time.monotonic()-started<wait_seconds:
        try:message=ws.recv(timeout=1)
        except TimeoutError:
            if last is not None and time.monotonic()-first>4:break
            continue
        if isinstance(message,str):
            event=json.loads(message);code=str(event.get('code',''))
            state.setdefault('stream_events',[]).append({'code':code,'at':time.time()});save(state)
            if code in ('1000','1001','1003','2001','2002'):raise RuntimeError('Cloud streaming status '+code)
            continue
        with Image.open(io.BytesIO(message)) as image:image.verify()
        if first is None:first=time.monotonic();first_latency=first-started;(folder/(label+'-first.jpg')).write_bytes(message)
        last=message;count+=1
        if time.monotonic()-first>6:break
    if last is None:raise TimeoutError('No JPEG frame received for '+label)
    path=folder/(label+'.jpg');path.write_bytes(last)
    with Image.open(path) as image:dimensions=list(image.size);deviation=ImageStat.Stat(image.convert('L')).stddev[0]
    record={'name':label,'dimensions':dimensions,'frames_received':count,'first_frame_seconds':round(first_latency,3),'bytes':len(last),'luminance_stddev':round(deviation,2)}
    state.setdefault('captures',[]).append(record);save(state);print('FRAME_READY:',json.dumps(record),flush=True)

def run_stream(client,state,review_seconds=0):
    if not state.get('assets_ready'):raise RuntimeError('Both parsed asset IDs are required before creating a GPU session.')
    if state.get('session_create_attempts') or state.get('session_id'):raise RuntimeError('This trial already attempted one stream; no automatic second session.')
    from websockets.sync.client import connect
    from urllib.parse import quote
    views=json.loads((FOLDER/'geometry.json').read_text())['views'];usd=scene_text(state,views[0]);(FOLDER/'scene.usda').write_text(usd)
    state['session_request_id']='pensieve-cloud-'+uuid.uuid4().hex;state['session_create_attempts']=1;state['session_submitting']=True;save(state)
    ws=None;timer=None;lock=threading.Lock()
    def cleanup():
        nonlocal ws
        with lock:
            if state.get('cleanup',{}).get('confirmed'):return
            if ws is not None:
                try:ws.close()
                except Exception:pass
            for _ in range(3):
                try:close_session(client,state);return
                except Exception as exc:state['cleanup_error']=safe_error(exc,getattr(client,'api_key',''));save(state);time.sleep(1)
    try:
        op=unwrap(client.gateway_request(method='POST',path='/rendercloud/v1/streams',body={'requestId':state['session_request_id'],'usdContent':base64.b64encode(usd.encode()).decode(),'settings':{'autoEnhanceAI':False}}))
        if not isinstance(op,dict) or not op.get('operationId'):raise RuntimeError('Stream response missing operation ID; do not recreate blindly.')
        state['session_id']=str(op['operationId']);state['sessions_created']=1;state['session_submitting']=False;state['session_started_at']=time.time();save(state)
        timer=threading.Timer(300,cleanup);timer.daemon=True;timer.start();print('One cloud session created; cleanup watchdog scheduled at 300 seconds.',flush=True)
        deadline=time.monotonic()+120;result=None
        while time.monotonic()<deadline:
            op=unwrap(client.gateway_request(method='POST',path='/rendercloud/v1/streams',body={'operationId':state['session_id']}))
            if op.get('error'):raise RuntimeError('Cloud session initialization failed: '+str(op['error']))
            candidate=op.get('result') or {};state['stream_status']=candidate.get('status','INITIALIZING');save(state)
            if candidate.get('status')=='ACTIVE':result=candidate;break
            time.sleep(2)
        if result is None:raise TimeoutError('Cloud session did not become ACTIVE within 120 seconds.')
        host=result['host']
        if not re.fullmatch(r'[a-zA-Z0-9.-]+(?::[0-9]+)?',host):raise ValueError('Unexpected WebSocket host')
        url='wss://'+host+'/streaming/ws/session?nid='+quote(result['nodeId'],safe='')+'&token='+quote(result['token'],safe='')
        ws=connect(url,proxy=None,max_size=20*1024*1024,open_timeout=15,close_timeout=3)
        ws.send(json.dumps({'type':3,'slaveInit':{'masterStreamingId':result['streamId'],'receiveImage':True}}));result=None
        capture(ws,views[0]['name'],state)
        if review_seconds:
            print('OVERVIEW_REVIEW: waiting',review_seconds,'seconds before remaining views; no new session will be created.',flush=True)
            time.sleep(review_seconds)
        for view in views[1:]:
            patch='#usda 1.0\nover "World" { '+camera_prim(view,over=True)+' }'
            unwrap(client.gateway_request(method='POST',path='/rendercloud/v1/streams/'+state['session_id']+':push',body={'requestId':uuid.uuid4().hex,'usdContent':base64.b64encode(patch.encode()).decode()}))
            capture(ws,view['name'],state)
        state['render_test_completed']=True;save(state)
    finally:
        cleanup()
        if timer:timer.cancel()

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['assets','status','stream','close'],required=True);parser.add_argument('--retry-uncertain-asset',choices=['mesh','gs']);parser.add_argument('--review-seconds',type=int,choices=range(0,61),default=0);args=parser.parse_args()
    key=os.getenv('AHOLO_KEY') or getpass.getpass('AHOLO key (hidden): ')
    state=json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else {'trial':'cloud-hybrid-v1','created_at':time.time(),'assets':{},'sessions_created':0}
    client=create_gateway_client(AholoClientConfig(api_key=key,region='cn',timeout_ms=45000))
    try:
        if args.phase=='assets':prepare_assets(client,create_asset_client(AholoClientConfig(api_key=key,region='cn',timeout_ms=45000)),state,args.retry_uncertain_asset)
        elif args.phase=='status':query_existing_assets(client,state)
        elif args.phase=='stream':run_stream(client,state,args.review_seconds)
        else:close_session(client,state)
    except BaseException as exc:
        error=safe_error(exc,key);state['last_error']=error;save(state);print('TRIAL ERROR:',json.dumps(error,ensure_ascii=False),flush=True)
        raise SystemExit(1)
    finally:client.close();key=None

if __name__=='__main__':main()
