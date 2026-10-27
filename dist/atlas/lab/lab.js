import {reviewFor} from './quality.js?v=20261027-daylight-detail-final';
const $=s=>document.querySelector(s);
const initialParams=new URLSearchParams(location.search),initialCase=initialParams.get('case');
let selected=document.querySelector(`[data-case="${CSS.escape(initialCase||'')}"]`)?initialCase:'stone-hall-detail-v1',mode=(['space','pano'].includes(initialParams.get('view'))||(!initialParams.has('view')&&['stone-hall-multiview-v3','stone-hall-detail-v1'].includes(selected)))?'world':'input',worldMode=initialParams.get('view')==='pano'?'pano':'space',index=0,items=[],frame=null,frameCase='',image=null;
let pendingBest=false,requestId=0,feedbackTimer;
function feedback(text){$('#view-feedback').textContent=text;}
function sendBest(){if(pendingBest)command('pensieve-best-view',{requestId});}
function command(type,extra={}){frame?.contentWindow?.postMessage({type,...extra},location.origin);}
function disposeFrame(){if(frame){frame.src='about:blank';frame.remove();}frame=null;frameCase='';pendingBest=false;clearTimeout(feedbackTimer);}
function render(){
 document.querySelectorAll('.experiment[data-case]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.case===selected)));
 const m=items.find(x=>x.case===selected),source=m?.world_method==='generation'||['stone-hall-reference-v1','stone-hall-daylight-v1'].includes(selected),count=source?1:(m?.input_count||24),gallery=$('#inputs'),stage=$('#stage');
 if(m?.status==='ready'&&worldMode==='pano'&&!m.world_assets?.panorama_url)worldMode='space';
 const review=reviewFor(m||{case:selected});$('#assessment').textContent=review?.summary||'';$('#quality-status').textContent=`本地初审：${review?.label||'待验收'}`;$('#quality-structure').textContent=review?.structure||'待验收';$('#quality-detail').textContent=review?.detail||'待验收';$('#tab-world').disabled=m?.status!=='ready';$('#best-view').disabled=m?.status!=='ready';$('#pano-preview').disabled=m?.status!=='ready'||!m?.world_assets?.panorama_url;
 $('#tab-input').setAttribute('aria-pressed',String(mode==='input'));$('#tab-world').setAttribute('aria-pressed',String(mode==='world'&&worldMode==='space'));$('#pano-preview').setAttribute('aria-pressed',String(mode==='world'&&worldMode==='pano'));
 const elapsed=m?Math.round((m.completed_at||Date.now()/1000)-m.created_at):0;$('#task-state').textContent=m?`${m.status==='ready'?`接口已完成 · ${review?.label||'质量待验收'}`:m.message} · 耗时 ${Math.floor(elapsed/60)} 分 ${elapsed%60} 秒`:'视角正在准备';
 if(frameCase&&frameCase!==selected)disposeFrame();
 if(!image){image=new Image();stage.append(image);image.onerror=()=>$('#caption').textContent='这张视角暂未读取成功，请稍后切换重试。';}
 const showWorld=mode==='world'&&m?.status==='ready';image.hidden=showWorld;
 if(showWorld){
  if(!frame){
   const created=document.createElement('iframe');frame=created;frameCase=selected;created.dataset.case=selected;created.src=`/world/?id=${m.id}&experiment=1&embed=1&v=20261027-daylight-detail-final${worldMode==='pano'?'&view=pano':''}`;created.title=m.name;created.allowFullscreen=true;
   created.onload=()=>{if(frame!==created)return;command('pensieve-world-visibility',{visible:mode==='world'});command('pensieve-world-mode',{mode:worldMode});sendBest();};stage.append(created);
  }
  frame.hidden=false;command('pensieve-world-visibility',{visible:true});command('pensieve-world-mode',{mode:worldMode});
  $('#caption').textContent=worldMode==='pano'?'流畅全景 · 拖动环顾，不能改变拍摄位置。切换「AHOLO 3D 世界」可查看真实 3DGS。':`AHOLO 实际返回的 3DGS · ${review?.label||'质量待验收'} · 拖动环顾。`;
 }else{
  if(frame){command('pensieve-world-visibility',{visible:false});frame.hidden=true;}
  const src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(index).padStart(2,'0')}.jpg`}`;if(image.getAttribute('src')!==src)image.src=src;
  image.alt=source?'魔法大厅 AI 概念图':`第 ${index+1} 个相机视角`;$('#caption').textContent=source?'输入概念图。点击「定位推荐视角」打开实验大厅。':`输入 ${index+1} / ${count}：同一三维大厅的相机位移视角，生成结果需以实际画面判断。`;
 }
 if(gallery.dataset.key!==`${selected}:${count}`){gallery.dataset.key=`${selected}:${count}`;gallery.replaceChildren();for(let i=0;i<count;i++){const b=document.createElement('button'),img=new Image();img.src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(i).padStart(2,'0')}.jpg`}`;img.alt='';img.loading='lazy';b.append(img,document.createTextNode(source?'概念图':`视角 ${String(i+1).padStart(2,'0')}`));b.onclick=()=>{index=i;mode='input';render();};gallery.append(b);}}
 [...gallery.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(mode==='input'&&i===index)));
}
for(const b of document.querySelectorAll('[data-case]'))b.onclick=()=>{if(selected!==b.dataset.case){disposeFrame();feedback('已切换实验，选择查看方式。');selected=b.dataset.case;mode='input';worldMode='space';index=0;}document.querySelectorAll('[data-case]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();};
$('#tab-input').onclick=()=>{pendingBest=false;clearTimeout(feedbackTimer);feedback('正在查看输入图像。');mode='input';render();};$('#tab-world').onclick=()=>{mode='world';worldMode='space';render();};
$('#pano-preview').onclick=()=>{pendingBest=false;clearTimeout(feedbackTimer);feedback('全景仅支持环顾，不代表三维空间通过验收。');mode='world';worldMode='pano';render();};
$('#best-view').onclick=()=>{
 mode='world';worldMode='space';render();pendingBest=true;requestId++;
 feedback('正在打开模型并定位… 首次加载需要解析本地文件。');sendBest();
 $('#stage').scrollIntoView({block:'center',behavior:'instant'});
 clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>{if(pendingBest)feedback('模型仍在加载，定位指令已保留；加载完成后自动定位。可先使用流畅全景。');},15000);
};
addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==frame?.contentWindow)return;
 if(e.data?.type==='pensieve-world-ready')sendBest();
 if(e.data?.type==='pensieve-best-view-applied'&&e.data.requestId===requestId&&pendingBest){pendingBest=false;clearTimeout(feedbackTimer);feedback(`✓ 已定位推荐视角。${reviewFor({case:selected})?.label||'质量待验收'}。`);}
 if(e.data?.type==='pensieve-world-error'){pendingBest=false;clearTimeout(feedbackTimer);feedback('模型打开失败，未完成定位。可以重试或查看输入图像。');}
});
addEventListener('pagehide',disposeFrame);addEventListener('pageshow',e=>{if(e.persisted)render();});
async function poll(){let pending=true;try{const r=await fetch('/api/experiments',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();const d=await r.json();items=d.items;if(!initialCase&&!items.some(x=>x.case===selected)){selected=items.some(x=>x.case==='stone-hall-multiview-v3')?'stone-hall-multiview-v3':'stone-hall-daylight-v1';}$('#budget').textContent=`本轮 ${d.attempts} / ${d.limit} 次`;pending=items.some(x=>!['ready','failed','uncertain','paused'].includes(x.status));render();}catch{$('#task-state').textContent='状态暂未连接，稍后自动重试';}finally{if(pending)setTimeout(poll,12000);}}document.querySelectorAll('[data-case]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.case===selected)));poll();
