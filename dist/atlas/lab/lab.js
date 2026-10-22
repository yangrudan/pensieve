const $=s=>document.querySelector(s);
let selected='stone-hall-reference-v1',mode='input',worldMode='space',index=0,items=[],frame=null,frameCase='',image=null;
const notes={'stone-hall-reference-v1':'大厅氛围可查看，细节比概念图柔和。点击「最佳视角」可直接定位到水池前方；卡顿时可用「流畅全景」。','stone-hall-multiview-v1':'质量未通过：模型本身存在拉伸和漂浮色块。「最佳视角」仅展示全貌，无法修复重建。','stone-hall-multiview-v2':'质量未通过：模型仍残缺、塌缩。「最佳视角」仅展示全貌，无法恢复完整大厅。'};
function command(type,extra={}){frame?.contentWindow?.postMessage({type,...extra},location.origin);}
function disposeFrame(){if(frame){frame.src='about:blank';frame.remove();}frame=null;frameCase='';}
function render(){
 const m=items.find(x=>x.case===selected),source=selected==='stone-hall-reference-v1',count=source?1:(m?.input_count||24),gallery=$('#inputs'),stage=$('#stage');
 $('#assessment').textContent=notes[selected]||'';$('#tab-world').disabled=m?.status!=='ready';$('#best-view').disabled=m?.status!=='ready';$('#pano-preview').disabled=m?.status!=='ready'||!m?.world_assets?.panorama_url;
 $('#tab-input').setAttribute('aria-pressed',String(mode==='input'));$('#tab-world').setAttribute('aria-pressed',String(mode==='world'&&worldMode==='space'));$('#pano-preview').setAttribute('aria-pressed',String(mode==='world'&&worldMode==='pano'));
 const elapsed=m?Math.floor((m.completed_at||Date.now()/1000)-m.created_at):0;$('#task-state').textContent=m?`${m.status==='ready'?'任务已完成':m.message} · 耗时 ${Math.floor(elapsed/60)} 分 ${elapsed%60} 秒`:'视角正在准备';
 if(frameCase&&frameCase!==selected)disposeFrame();
 if(!image){image=new Image();stage.append(image);image.onerror=()=>$('#caption').textContent='这张视角暂未读取成功，请稍后切换重试。';}
 const showWorld=mode==='world'&&m?.status==='ready';image.hidden=showWorld;
 if(showWorld){
  if(!frame){
   const created=document.createElement('iframe');frame=created;frameCase=selected;created.dataset.case=selected;created.src=`/world/?id=${m.id}&experiment=1&embed=1${worldMode==='pano'?'&view=pano':''}`;created.title=m.name;created.allowFullscreen=true;
   created.onload=()=>{if(frame!==created)return;command('pensieve-world-visibility',{visible:mode==='world'});command('pensieve-world-mode',{mode:worldMode});};stage.append(created);
  }
  frame.hidden=false;command('pensieve-world-visibility',{visible:true});command('pensieve-world-mode',{mode:worldMode});
  $('#caption').textContent=worldMode==='pano'?'流畅全景 · 拖动环顾，不能改变拍摄位置。切换「AHOLO 3D 世界」可查看真实 3DGS。':'AHOLO 实际返回的 3DGS · 已自动定位最佳视角 · 拖动环顾；同一实验内切换输入图不会重复解析模型。';
 }else{
  if(frame){command('pensieve-world-visibility',{visible:false});frame.hidden=true;}
  const src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(index).padStart(2,'0')}.jpg`}`;if(image.getAttribute('src')!==src)image.src=src;
  image.alt=source?'魔法大厅 AI 概念图':`第 ${index+1} 个相机视角`;$('#caption').textContent=source?'输入概念图。点击「最佳视角」直接打开已生成大厅。':`输入 ${index+1} / ${count}：同一三维大厅的相机位移视角，生成结果需以实际画面判断。`;
 }
 if(gallery.dataset.key!==`${selected}:${count}`){gallery.dataset.key=`${selected}:${count}`;gallery.replaceChildren();for(let i=0;i<count;i++){const b=document.createElement('button'),img=new Image();img.src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(i).padStart(2,'0')}.jpg`}`;img.alt='';img.loading='lazy';b.append(img,document.createTextNode(source?'概念图':`视角 ${String(i+1).padStart(2,'0')}`));b.onclick=()=>{index=i;mode='input';render();};gallery.append(b);}}
 [...gallery.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(mode==='input'&&i===index)));
}
for(const b of document.querySelectorAll('[data-case]'))b.onclick=()=>{if(selected!==b.dataset.case){disposeFrame();selected=b.dataset.case;mode='input';worldMode='space';index=0;}document.querySelectorAll('[data-case]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();};
$('#tab-input').onclick=()=>{mode='input';render();};$('#tab-world').onclick=()=>{mode='world';worldMode='space';render();};
$('#pano-preview').onclick=()=>{mode='world';worldMode='pano';render();};
$('#best-view').onclick=()=>{mode='world';worldMode='space';render();command('pensieve-best-view');};
addEventListener('pagehide',disposeFrame);addEventListener('pageshow',e=>{if(e.persisted)render();});
async function poll(){let pending=true;try{const r=await fetch('/api/experiments',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();const d=await r.json();items=d.items;$('#budget').textContent=`本轮 ${d.attempts} / ${d.limit} 次`;pending=items.some(x=>!['ready','failed','uncertain','paused'].includes(x.status));render();}catch{$('#task-state').textContent='状态暂未连接，稍后自动重试';}finally{if(pending)setTimeout(poll,12000);}}poll();
