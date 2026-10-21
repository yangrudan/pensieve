const $=s=>document.querySelector(s);let selected='stone-hall-reference-v1',mode='input',index=0,items=[],shown='';
function render(){const m=items.find(x=>x.case===selected),source=selected==='stone-hall-reference-v1',count=source?1:(m?.input_count||24),gallery=$('#inputs');
 const notes={'stone-hall-reference-v1':'已验证：大厅氛围能够展开，细节比原概念图柔和，不可见区域由 AI 补全。','stone-hall-multiview-v1':'质量未通过：接口已返回，但实际 3D 出现明显拉伸和漂浮色块，尚不适合作为第二章的正式场景。','stone-hall-multiview-v2':'质量未通过：局部匹配改善，但实际 3D 仍残缺、塌缩，多相机位置检查未恢复出可用大厅。'};$('#assessment').textContent=notes[selected]||'';
 $('#tab-world').disabled=m?.status!=='ready';$('#tab-input').setAttribute('aria-pressed',String(mode==='input'));$('#tab-world').setAttribute('aria-pressed',String(mode==='world'));
 const elapsed=m?Math.floor(Date.now()/1000-m.created_at):0;$('#task-state').textContent=m?`${m.message} · ${Math.floor(elapsed/60)} 分 ${elapsed%60} 秒`:'视角已准备，任务尚未提交';
 const signature=`${selected}:${mode}:${index}:${m?.status||'none'}`;
 if(shown!==signature){shown=signature;const stage=$('#stage');stage.replaceChildren();
  if(mode==='world'&&m?.status==='ready'){const frame=document.createElement('iframe');frame.src=`/world/?id=${m.id}&experiment=1&embed=1`;frame.title=m.name;frame.allowFullscreen=true;stage.append(frame);$('#caption').textContent='AHOLO 实际返回的 3DGS · 拖动环顾，滚轮或方向键有限微移 · 无碰撞体';}
  else{const img=new Image();img.src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(index).padStart(2,'0')}.jpg`}`;img.alt=source?'魔法石大厅 AI 概念图':`同一三维大厅的第 ${index+1} 个相机视角`;img.onerror=()=>{const notice=document.createElement('div');notice.className='waiting';notice.textContent='这组视角正在本地准备，稍后刷新即可查看。';stage.replaceChildren(notice);};stage.append(img);$('#caption').textContent=source?'输入：AI 生成的魔法大厅概念图。空间尚未拍到的部分将由 World 补全。':`输入 ${String(index+1).padStart(2,'0')} / ${count}：同一几何场景的相机位移视角；与单图组并非相同素材，不能当作只改变视图数量的严格对照。`;}
 }
 if(gallery.dataset.key!==`${selected}:${count}`){gallery.dataset.key=`${selected}:${count}`;gallery.replaceChildren();for(let i=0;i<count;i++){const button=document.createElement('button'),img=new Image();img.src=`/lab-inputs/${selected}/${source?'reference.jpg':`view-${String(i).padStart(2,'0')}.jpg`}`;img.alt='';img.loading='lazy';button.append(img,document.createTextNode(source?'概念图':`视角 ${String(i+1).padStart(2,'0')}`));button.onclick=()=>{index=i;mode='input';render();};gallery.append(button);}}
 [...gallery.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(mode==='input'&&i===index)));
}
for(const button of document.querySelectorAll('[data-case]'))button.onclick=()=>{selected=button.dataset.case;mode='input';index=0;document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();};
$('#tab-input').onclick=()=>{mode='input';render();};$('#tab-world').onclick=()=>{mode='world';render();};
async function poll(){try{const r=await fetch('/api/experiments',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error();const data=await r.json();items=data.items;$('#budget').textContent=`本轮 ${data.attempts} / ${data.limit} 次`;render();}catch{$('#task-state').textContent='实验状态暂未连接，稍后自动重试';}finally{setTimeout(poll,12000);}}poll();
