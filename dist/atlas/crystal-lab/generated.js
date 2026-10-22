import * as THREE from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';
import { createCrystalMaterial } from '../hybrid/crystal.js?v=20261022-4';

// Read-only job polling. Opening this page never starts or resumes generation.
export function watchGeneratedCrystal({scene,environment,canvas,changed,status}){
 const caseName='emerald-quartz-lux-v1',originals=new Map(),polished=new Map();
 let alive=true,timer,model;
 const originalButton=document.querySelector('#material-original'),polishedButton=document.querySelector('#material-polished');
 const label=document.querySelector('#color-name'),note=document.querySelector('.note');
 const release=root=>{const geometries=new Set(),materials=new Set(),textures=new Set();root?.traverse(n=>{if(n.geometry)geometries.add(n.geometry);for(const m of Array.isArray(n.material)?n.material:[n.material])if(m){materials.add(m);for(const value of Object.values(m))if(value?.isTexture&&value!==environment)textures.add(value);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());};
 function material(mode){
  for(const [mesh,original] of originals){
   if(mode==='original')mesh.material=original;
   else{
    if(!polished.has(mesh)){
     const finish=base=>{
      const next=createCrystalMaterial('#73ddbe',environment);
      next.map=base.map||null;if(base.color)next.color.copy(base.color);
      next.normalMap=base.normalMap||null;if(base.normalScale)next.normalScale.copy(base.normalScale);
      next.transmission=.18;next.thickness=.45;next.roughness=.075;next.attenuationDistance=2;next.side=base.side;
      return next;
     };
     polished.set(mesh,Array.isArray(original)?original.map(finish):finish(original));
    }
    mesh.material=polished.get(mesh);
   }
  }
  originalButton.setAttribute('aria-pressed',String(mode==='original'));polishedButton.setAttribute('aria-pressed',String(mode==='polished'));
  canvas.dataset.materialSource=mode==='original'?'aholo-original':'browser-polished';
  status.textContent=mode==='original'?'AHOLO 原材质 · 拖动检查真实模型':'保留 AHOLO 原色贴图 + 本地光泽调整 · 拖动比较';changed();
 }
 originalButton.onclick=()=>material('original');polishedButton.onclick=()=>material('polished');
 async function poll(){
  if(!alive)return;
  try{
   const response=await fetch('/api/experiments',{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('status');
   const data=await response.json(),job=data.items.find(item=>item.case===caseName);
   canvas.dataset.source='aholo-lux3d';canvas.dataset.jobStatus=job?.status||'not-submitted';
   if(!job){status.textContent='尚未提交样品；打开页面不会自动生成。';return;}
   label.textContent='翡翠水晶 · Lux3D G1';
   note.textContent=`造型来源：AHOLO Lux3D 文生 3D。任务 ${job.task_id||'提交中'}，累计 ${data.attempts} / ${data.limit} 次。当前仅试一颗，其余四颗未提交。`;
   if(job.status!=='ready'){
    status.textContent=job.message||'AHOLO 正在生成首颗样品…';
    if(['failed','uncertain','paused'].includes(job.status))return;
    timer=setTimeout(poll,12000);return;
   }
   const expected='/models/'+job.id+'.glb';if(job.model_url!==expected||!/^[a-f0-9]{64}$/.test(job.id))throw Error('model');
   status.textContent='正在读取已保存的 AHOLO GLB…';
   const result=await new GLTFLoader().loadAsync(expected);
   if(!alive){release(result.scene);return;}
   model=result.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),extent=Math.max(size.x,size.y,size.z);
   if(!Number.isFinite(extent)||extent<=0)throw Error('bounds');
   const scale=2.12/extent;model.scale.multiplyScalar(scale);model.position.set(-center.x*scale,1.02-box.min.y*scale,-center.z*scale);
   model.traverse(mesh=>{if(mesh.isMesh){originals.set(mesh,mesh.material);mesh.castShadow=false;}});
   scene.add(model);note.textContent+=' 本地初审：轮廓与纹理可用，真实通透材质仍需打磨。';canvas.dataset.modelLoaded='true';canvas.dataset.modelId=job.id;
   originalButton.disabled=false;polishedButton.disabled=false;material('original');
  }catch{if(alive){status.textContent='样品暂时无法读取；稍后查询同一个任务，不会重新生成。';timer=setTimeout(poll,12000);}}
 }
 poll();
 return ()=>{alive=false;clearTimeout(timer);for(const [mesh,original] of originals)mesh.material=original;for(const value of polished.values())for(const m of Array.isArray(value)?value:[value])m.dispose();if(model){scene.remove(model);release(model);}};
}
