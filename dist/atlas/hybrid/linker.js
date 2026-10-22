import {atlasRequest} from '../../places.js';

// All writes require a user click; opening the scene never changes memory tags.
export function setupMemoryLinker(setPaused){
 const $=s=>document.querySelector(s),dialog=$('#hall-assign');let placeId=null,opening=0,saving=false;
 $('#hall-add-memory').onclick=async()=>{
  placeId=$('#place-panel').dataset.placeId;const seq=++opening;dialog.showModal();setPaused(true);
  $('#hall-assign-list').replaceChildren();$('#hall-assign-status').textContent='正在读取已收藏的记忆…';$('#hall-save-assign').disabled=true;
  try{
   const [atlas,response]=await Promise.all([atlasRequest(),fetch('/api/memories',{signal:AbortSignal.timeout(15000)})]);if(!response.ok)throw Error('记忆暂未读取成功');const result=await response.json();if(seq!==opening||!dialog.open)return;
   const place=atlas.places.find(p=>p.id===placeId);if(!place)throw Error('这处地点已不存在');$('#hall-assign-title').textContent=`放入「${place.name}」`;
   const memories=[...result.items.filter(m=>m.mode!=='fourview'),...atlas.archives],list=$('#hall-assign-list');
   for(const memory of memories){const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.value=memory.id;box.checked=(atlas.assignments[memory.id]||[]).includes(placeId);box.dataset.initial=String(box.checked);const photo=new Image();photo.src=memory.photo_url;photo.alt='';photo.loading='lazy';const text=document.createElement('span');text.textContent=memory.name;label.append(box,photo,text);list.append(label);}
   $('#hall-assign-status').textContent=memories.length?'选择后保存，魔法石会显示对应记忆。':'还没有已收藏的记忆，请先在第一章收藏照片。';$('#hall-save-assign').disabled=!memories.length;
  }catch(e){if(seq===opening&&dialog.open)$('#hall-assign-status').textContent=e.message;}
 };
 $('#hall-close-assign').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{opening++;setPaused(false);});
 dialog.addEventListener('cancel',e=>{if(saving)e.preventDefault();});
 $('#hall-save-assign').onclick=async()=>{
  const targetPlace=placeId,button=$('#hall-save-assign');saving=true;button.disabled=true;$('#hall-close-assign').disabled=true;let wrote=false;
  try{
   const changed=[...document.querySelectorAll('#hall-assign-list input')].filter(b=>String(b.checked)!==b.dataset.initial),latest=await atlasRequest();
   for(const box of changed){const current=latest.assignments[box.value]||[],ids=box.checked?[...new Set([...current,targetPlace])]:current.filter(id=>id!==targetPlace);const result=await atlasRequest({action:'tag',memory_id:box.value,place_ids:ids});latest.assignments=result.assignments;box.dataset.initial=String(box.checked);wrote=true;}
   dialog.close();
  }catch(e){$('#hall-assign-status').textContent='部分操作未完成，可重试：'+e.message;}
  finally{saving=false;button.disabled=false;$('#hall-close-assign').disabled=false;if(wrote)dispatchEvent(new Event('pensieve-atlas-updated'));}
 };
}
