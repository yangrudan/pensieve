// Shared local place data. Saving labels never starts a generation task.
let token;
export async function atlasRequest(body){
 const options=body?{method:'POST',headers:{'Content-Type':'application/json','X-Pensieve-Token':token||((await (await fetch('/api/session')).json()).token)},body:JSON.stringify(body)}:{};
 if(body)token=options.headers['X-Pensieve-Token'];
 const r=await fetch('/api/atlas',{...options,signal:AbortSignal.timeout(20000)});const data=await r.json();if(!r.ok)throw Error(data.error||'地点暂时无法保存');return data;
}
export function photoData(m){const c=document.createElement('canvas'),s=Math.min(1,2048/Math.max(m.img.width,m.img.height));c.width=Math.max(1,Math.round(m.img.width*s));c.height=Math.max(1,Math.round(m.img.height*s));c.getContext('2d').drawImage(m.img,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.9).split(',')[1];}
let current,version=0;
export async function showMemoryPlaces(m){
 const host=document.querySelector('#memory-places');if(!host)return;current=m;const seq=++version;host.replaceChildren();
 const details=document.createElement('details');details.className='place-picker';const summary=document.createElement('summary');summary.textContent='◇ 为记忆标记地点';details.append(summary);host.append(details);
 try{const data=await atlasRequest();if(seq!==version)return;const key=m.id||m.archive_id,selected=data.assignments[key]||[];
 const panel=document.createElement('div');panel.className='place-picker-panel';const note=document.createElement('p');note.textContent='这段记忆属于哪里？可选择多个地点。';panel.append(note);
 const list=document.createElement('div');list.className='place-picker-options';panel.append(list);
 const refresh=()=>{const labels=data.places.filter(p=>selected.includes(p.id));summary.textContent=labels.length?'◇ '+labels.map(p=>p.name).join(' · '):'◇ 为记忆标记地点';};refresh();
 for(const place of data.places){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=place.id;input.checked=selected.includes(place.id);const dot=document.createElement('i');dot.style.background=place.color;label.append(input,dot,document.createTextNode(place.name));list.append(label);}
 const status=document.createElement('p');status.className='place-save-status';status.setAttribute('role','status');status.textContent=m.id||m.archive_id?'标签保存在这台电脑':'保存地点时会将原照片收藏在本机，不消耗生成额度。';
 const save=document.createElement('button');save.type='button';save.textContent='保存地点';save.onclick=async()=>{save.disabled=true;try{const ids=[...list.querySelectorAll('input:checked')].map(x=>x.value),body={action:'tag',memory_id:m.id||m.archive_id,place_ids:ids};if(!body.memory_id){body.image=photoData(m);body.name=m.name;}const result=await atlasRequest(body);if(!m.id)m.archive_id=result.memory_id;selected.splice(0,selected.length,...ids);if(current===m){refresh();status.textContent='地点已保存 · 第二章可以找到这段记忆';} }catch(e){if(current===m)status.textContent=e.message;}finally{save.disabled=false;}};
 const link=document.createElement('a');link.href='/atlas/';link.textContent='前往第二章 ↗';panel.append(status,save,link);details.append(panel);
 }catch{if(seq===version)summary.textContent='地点暂未连接，重新打开记忆可重试';}
}
