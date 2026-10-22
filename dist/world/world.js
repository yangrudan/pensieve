import {createViewer,setViewerConfig,PerspectiveCamera,BackgroundMode,Vector3,Color,SplatLoader,SplatUtils} from '../vendor/aholo/index.js';
import * as THREE from '../vendor/three.module.js';
import {bestView,renderScale} from './view-presets.js';
import {reviewFor} from '../atlas/lab/quality.js?v=20261022-daylight-reviewed';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search);
const experiments=params.get('experiment')==='1',requested=params.get('id');
if(params.get('embed')==='1')document.body.classList.add('embedded');
if(experiments){$('#world-back').href='/atlas/lab/';$('#world-back').textContent='← 返回世界实验';}
let m,mode='space',viewer,camera,splat,loading=false,loaded=false,panoRender,panoScene,panoCamera,panoReady=false,panoLoading=false;
let yaw=Math.PI,pitch=0,zUp=true,origin=[0,0,0],eye=[0,0,0],drawTimer=0,dragging=false,visible=true,lastScale=-1,settleTimer;
const inspectionEye=experiments&&params.has('eye')?params.get('eye').split(',').map(Number):null;
let bestRequest=null;
function completeBest(){if(bestRequest===null||!loaded)return;applyBest();if(parent!==window)parent.postMessage({type:'pensieve-best-view-applied',requestId:bestRequest},location.origin);bestRequest=null;}
function waiting(title,message){$('#waiting').hidden=false;$('#title').textContent=title;$('#message').textContent=message;}
function announce(text){$('#view-hint').textContent=text;}
function applyBest(){
 const preset=bestView(m);origin=[...preset.eye];eye=[...origin];yaw=preset.yaw;pitch=preset.pitch;
 if(camera){camera.fov=preset.fov;camera.updateProjectionMatrix();}
 if(panoCamera){panoCamera.fov=preset.fov;panoCamera.updateProjectionMatrix();}
 $('#space').dataset.view='best';announce(preset.hint);look();drawPano();
}
async function poll(){
 let pending=true;
 try{
  const r=await fetch(experiments?'/api/experiments':'/api/memories',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();const j=await r.json();
  $('#budget').textContent=`本轮 ${j.attempts} / ${j.limit} 次`;const worlds=j.items.filter(x=>x.mode==='world');m=requested?worlds.find(x=>x.id===requested):worlds.at(-1);
  const selection=$('#world-version');if(selection.options.length!==worlds.length)selection.replaceChildren(...worlds.map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.name;return o;}));
  if(!m){waiting('还没有空间记忆','此入口仅展示已生成的 World 空间。');return;}selection.value=m.id;
  $('#boundary-note').textContent=m.world_method==='reconstruction'?`由 ${m.input_count} 张合成场景视角重建。此实验的模型残缺或失真，最佳视角仅用于观察全貌。`:'单图不可见部分由 AI 补全，细节可能模糊。当前没有墙体碰撞。';
  $('#method-label').textContent=m.world_method==='reconstruction'?`RECONSTRUCTION · ${m.input_count} 视角重建`:'SPATIAL GEN · 单图生成';
  $('#world-title').textContent=m.name.replace(/^World 验证 · /,'');$('#reference').src=m.photo_url;$('#original').src=m.photo_url;$('#status').textContent=reviewFor(m)?.label||m.message;
  $('#preprocess-link').hidden=!['48bc169d57e89f8d9824364daacc180aac77d44dce852d493cac09da1093b06d','f898314586bfba751edeff2f1676002169f0a95052819eefc2fd90f3c6188d88'].includes(m.id);
  $('#details').textContent=m.world_id?`World ID：${m.world_id}`:'';const a=m.world_assets||{};$('#tab-pano').disabled=!a.panorama_url;$('#best-view').disabled=m.status!=='ready';
  for(const [key,id] of [['splat_url','download-splat'],['panorama_url','download-pano']])if(a[key]){$('#'+id).href=a[key];$('#'+id).hidden=false;}
  if(m.status==='ready'){
   pending=false;if(m.completed_at){const sec=Math.round(m.completed_at-m.created_at);$('#details').textContent+=` · 耗时 ${Math.floor(sec/60)} 分 ${sec%60} 秒`;}
   if(mode==='space')loadSpace();else if(mode==='pano')loadPano();else $('#waiting').hidden=true;
  }else{
   if(mode!=='original')waiting('空间正在展开',m.message);const sec=Math.floor(Date.now()/1000-m.created_at);$('#elapsed').textContent=`已等待 ${Math.floor(sec/60)} 分 ${sec%60} 秒 · 自动查询，不重新生成`;
   if(['failed','paused','uncertain'].includes(m.status)){waiting('空间任务暂未完成',m.message);pending=false;}
  }
 }catch{if(!loaded)waiting('正在重新连接','暂时无法读取已有任务，稍后自动重试。');}
 finally{if(pending)setTimeout(poll,12000);}
}
function look(){
 if(!camera)return;camera.position.set(...eye);const c=Math.cos(pitch),d=zUp?new Vector3(c*Math.cos(yaw),c*Math.sin(yaw),Math.sin(pitch)):new Vector3(c*Math.sin(yaw),Math.sin(pitch),-c*Math.cos(yaw));
 camera.lookAt(new Vector3(eye[0]+d.x,eye[1]+d.y,eye[2]+d.z));camera.updateMatrixWorld();viewer?.setCamera(camera);requestDraw();
 $('#space').dataset.eye=JSON.stringify(eye);$('#space').dataset.yaw=String(yaw);
}
function updateScale(){if(!viewer)return;const b=$('#space').getBoundingClientRect();if(!b.width||!b.height)return;const scale=renderScale(b.width,b.height,devicePixelRatio,dragging);if(Math.abs(scale-lastScale)>.015){lastScale=scale;setViewerConfig(viewer,{pixelRatio:scale});$('#space').dataset.renderScale=String(scale);}}
function requestDraw(){
 if(!viewer||mode!=='space'||!visible||document.hidden){viewer?.pause();return;}
 if(drawTimer)return;
 drawTimer=requestAnimationFrame(()=>{drawTimer=0;if(!viewer||mode!=='space'||!visible||document.hidden)return;const b=$('#space').getBoundingClientRect();if(!b.width||!b.height)return;viewer.resume();updateScale();viewer.render();});
}
function size(){
 if(viewer&&camera){const b=$('#space').getBoundingClientRect();if(b.width&&b.height){camera.aspect=b.width/b.height;camera.updateProjectionMatrix();updateScale();viewer.resize();viewer.setCamera(camera);requestDraw();}}
 if(panoRender&&panoCamera){const b=$('#pano').getBoundingClientRect();if(b.width&&b.height){panoRender.setSize(b.width,b.height);panoCamera.aspect=b.width/b.height;panoCamera.updateProjectionMatrix();drawPano();}}
}
async function loadSpace(){
 if(loaded||loading)return;loading=true;waiting('正在打开 3D 世界','首次需要解析本地模型；完成后切换输入图不会重复加载。');
 try{
  viewer=createViewer('memory-world',$('#space'),{antialiasing:false,preserveDrawingBuffer:false});updateScale();
  camera=new PerspectiveCamera(78,1,.02,500);const a=m.world_assets;zUp=a.up_axis==='Z';camera.up.set(0,zUp?0:1,zUp?1:0);
  const r=await fetch(a.splat_url);if(!r.ok)throw Error('本地 3DGS 文件读取失败');const data=await SplatLoader.parseSplatData(a.format==='spz'?SplatLoader.SplatFileType.SPZ:SplatLoader.SplatFileType.PLY,new Uint8Array(await r.arrayBuffer()),SplatLoader.SplatPackType.Compressed);
  splat=await SplatUtils.createSplat(data);viewer.getScene().add(splat);
  setViewerConfig(viewer,{pipeline:{Background:{background:{active:BackgroundMode.BasicBackground,basic:{color:new Color(.02,.035,.04)}},ground:{enabled:false}},Splatting:{enabled:true},TAA:{enabled:false}}});viewer.requestRenderHandler=requestDraw;
  applyBest();if(inspectionEye?.length===3&&inspectionEye.every(x=>Number.isFinite(x)&&Math.abs(x)<200)){origin=[...inspectionEye];eye=[...origin];const y=Number(params.get('yaw'));if(params.has('yaw')&&Number.isFinite(y))yaw=y;look();}
  size();loaded=true;$('#space').dataset.loaded='true';requestDraw();
  // Let the first asynchronous splat sort settle before exposing a black frame.
  await Promise.race([viewer.waitForRenderOver(250),new Promise(resolve=>setTimeout(resolve,3500))]);
  if(mode==='space'){$('#waiting').hidden=true;$('#controls').hidden=false;}
  $('#elapsed').textContent='';completeBest();if(parent!==window)parent.postMessage({type:'pensieve-world-ready'},location.origin);
 }catch(e){if(parent!==window)parent.postMessage({type:'pensieve-world-error'},location.origin);viewer?.destroy();viewer=null;loaded=false;delete $('#space').dataset.loaded;lastScale=-1;if(mode==='space')waiting('3D 空间暂未打开',e.message||'可先切到流畅全景查看。');}finally{loading=false;}
}
function drawPano(){if(!panoReady||mode!=='pano'||!visible||document.hidden)return;const c=Math.cos(pitch);panoCamera.lookAt(c*Math.sin(yaw-Math.PI/2),Math.sin(pitch),-c*Math.cos(yaw-Math.PI/2));panoRender.render(panoScene,panoCamera);}
async function loadPano(){
 if(panoReady||panoLoading)return;panoLoading=true;waiting('正在打开流畅全景','全景适合快速环顾；它不能改变拍摄位置。');
 try{
  panoRender=new THREE.WebGLRenderer({antialias:false});panoRender.setPixelRatio(Math.min(devicePixelRatio,1));$('#pano').append(panoRender.domElement);panoScene=new THREE.Scene();panoCamera=new THREE.PerspectiveCamera(78,1,.1,100);
  const texture=await new THREE.TextureLoader().loadAsync(m.world_assets.panorama_url);texture.colorSpace=THREE.SRGBColorSpace;panoScene.add(new THREE.Mesh(new THREE.SphereGeometry(20,48,24),new THREE.MeshBasicMaterial({map:texture,side:THREE.BackSide})));
  panoReady=true;applyBest();size();if(mode==='pano'){$('#waiting').hidden=true;$('#controls').textContent='拖动环顾 · 全景模式，不支持位置移动';$('#controls').hidden=false;}
 }catch{panoRender?.dispose();panoRender=null;$('#pano').replaceChildren();if(mode==='pano')waiting('全景暂未打开','可以下载本地全景文件查看。');}finally{panoLoading=false;}
}
function switchMode(next){
 if(next==='pano'&&m&&!m.world_assets?.panorama_url)return;mode=next;
 for(const n of ['space','pano','original']){$('#'+n).hidden=n!==mode;$('#tab-'+n).classList.toggle('active',n===mode);}
 $('#controls').hidden=true;if(mode!=='space')viewer?.pause();
 if(mode==='original'){$('#waiting').hidden=true;return;}
 if(!m||m.status!=='ready'){waiting('空间正在展开',m?.message||'正在读取…');return;}
 if(mode==='space'){if(!loaded)loadSpace();else{$('#waiting').hidden=true;$('#controls').hidden=false;$('#controls').textContent='拖动环顾 · 滚轮微移 · 无碰撞';size();requestDraw();}}
 else if(!panoReady)loadPano();else{$('#waiting').hidden=true;$('#controls').hidden=false;$('#controls').textContent='拖动环顾 · 全景模式，不支持位置移动';size();drawPano();}
}
for(const n of ['space','pano','original'])$('#tab-'+n).onclick=()=>switchMode(n);
$('#best-view').onclick=applyBest;$('#reset').onclick=applyBest;
let prevX=0,prevY=0;
for(const el of [$('#space'),$('#pano')]){
 el.addEventListener('pointerdown',e=>{dragging=true;prevX=e.clientX;prevY=e.clientY;el.setPointerCapture(e.pointerId);updateScale();});
 const stop=()=>{dragging=false;clearTimeout(settleTimer);settleTimer=setTimeout(()=>{updateScale();requestDraw();},200);};el.addEventListener('pointerup',stop);el.addEventListener('pointercancel',stop);
 el.addEventListener('pointermove',e=>{if(!dragging)return;yaw-=(e.clientX-prevX)*.004;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-prevY)*.004));prevX=e.clientX;prevY=e.clientY;$('#space').dataset.view='manual';mode==='space'?look():drawPano();});
 el.addEventListener('wheel',e=>{e.preventDefault();if(mode!=='space'||!loaded)return;move(Math.max(-.15,Math.min(.15,-e.deltaY*.001)),0);},{passive:false});
}
function move(forward,side){const a=zUp?[Math.cos(yaw)*forward-Math.sin(yaw)*side,Math.sin(yaw)*forward+Math.cos(yaw)*side,0]:[Math.sin(yaw)*forward+Math.cos(yaw)*side,0,-Math.cos(yaw)*forward+Math.sin(yaw)*side];eye=eye.map((v,i)=>Math.max(origin[i]-1.5,Math.min(origin[i]+1.5,v+a[i])));$('#space').dataset.view='manual';look();}
addEventListener('keydown',e=>{if(!loaded||mode!=='space'||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)||e.target.matches('select,input'))return;e.preventDefault();move(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0,e.key==='ArrowLeft'?-.1:e.key==='ArrowRight'?.1:0);});
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||parent===window)return;
 if(e.data?.type==='pensieve-best-view'){bestRequest=e.data.requestId;switchMode('space');if(loaded&&!loading)completeBest();}
 if(e.data?.type==='pensieve-world-mode'&&['space','pano'].includes(e.data.mode))switchMode(e.data.mode);
 if(e.data?.type==='pensieve-world-visibility'){visible=e.data.visible===true;if(!visible)viewer?.pause();else{size();requestDraw();drawPano();}}
});
new ResizeObserver(size).observe($('#space'));addEventListener('resize',size);addEventListener('visibilitychange',()=>{if(document.hidden)viewer?.pause();else{requestDraw();drawPano();}});
addEventListener('pagehide',()=>{cancelAnimationFrame(drawTimer);clearTimeout(settleTimer);viewer?.destroy();panoScene?.traverse(n=>{n.geometry?.dispose();n.material?.map?.dispose();n.material?.dispose();});panoRender?.dispose();});
addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
$('#world-version').onchange=e=>location.href='/world/?id='+encodeURIComponent(e.target.value)+(experiments?'&experiment=1':'');
if(params.get('view')==='pano')switchMode('pano');poll();
