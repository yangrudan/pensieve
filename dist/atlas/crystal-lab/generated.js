import * as THREE from '../../vendor/three.module.js';
import { GLTFLoader } from '../../vendor/GLTFLoader.js';
import { CRYSTAL_MODELS } from './catalog.js?v=20261022-1';
import { createCrystalMaterial } from '../hybrid/crystal.js?v=20261022-4';

// Read-only job polling. Opening this page never starts or resumes generation.
export function watchGeneratedCrystal({scene,environment,canvas,changed,status}){
 const design=CRYSTAL_MODELS.find(item=>item.key===new URLSearchParams(location.search).get('stone'))||CRYSTAL_MODELS[0],caseName=design.case,originals=new Map(),polished=new Map();
 canvas.dataset.stoneKey=design.key;referenceLabel();
 function referenceLabel(){document.querySelector('#request-link').href='./requests/'+design.key+'.json';}
 const choices=document.querySelector('#api-stones');
 for(const item of CRYSTAL_MODELS){const link=document.createElement('a');link.href='?source=aholo&stone='+item.key;link.dataset.stoneKey=item.key;link.style.setProperty('--stone',item.color);link.textContent=item.name;if(item.key===design.key)link.setAttribute('aria-current','page');choices.append(link);}
 let alive=true,timer,model;
 const originalButton=document.querySelector('#material-original'),polishedButton=document.querySelector('#material-polished');
 const clarity=document.querySelector('#crystal-clarity'),clarityValue=document.querySelector('#clarity-value'),referenceToggle=document.querySelector('#transmission-reference');
 const reference=new THREE.Group(),referenceMaterial=new THREE.MeshBasicMaterial({color:0x9bc6b6});
 const lightCanvas=document.createElement('canvas');lightCanvas.width=64;lightCanvas.height=256;
 const context=lightCanvas.getContext('2d'),gradient=context.createLinearGradient(0,0,0,256);
 gradient.addColorStop(0,'#bfd9cc');gradient.addColorStop(.5,'#82b4a5');gradient.addColorStop(1,'#345e5c');context.fillStyle=gradient;context.fillRect(0,0,64,256);
 const lightTexture=new THREE.CanvasTexture(lightCanvas);lightTexture.colorSpace=THREE.SRGBColorSpace;
 const panelMaterial=new THREE.MeshBasicMaterial({map:lightTexture});
 const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.25,2.65),panelMaterial);panel.position.set(0,2.13,-.87);reference.add(panel);
 for(const x of [-.62,-.3,0,.3,.62]){
  const bar=new THREE.Mesh(new THREE.BoxGeometry(.012,2.65,.012),referenceMaterial);bar.position.set(x,2.13,-.85);reference.add(bar);
 }
 for(const y of [.805,3.455]){
  const bar=new THREE.Mesh(new THREE.BoxGeometry(1.25,.012,.012),referenceMaterial);bar.position.set(0,y,-.85);reference.add(bar);
 }
 scene.add(reference);reference.visible=referenceToggle.checked;canvas.dataset.referenceVisible=String(reference.visible);
 referenceToggle.onchange=()=>{reference.visible=referenceToggle.checked;canvas.dataset.referenceVisible=String(reference.visible);changed();};
 const label=document.querySelector('#color-name'),note=document.querySelector('.note');
 const release=root=>{const geometries=new Set(),materials=new Set(),textures=new Set();root?.traverse(n=>{if(n.geometry)geometries.add(n.geometry);for(const m of Array.isArray(n.material)?n.material:[n.material])if(m){materials.add(m);for(const value of Object.values(m))if(value?.isTexture&&value!==environment)textures.add(value);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());};
 function material(mode){
  for(const [mesh,original] of originals){
   if(mode==='original')mesh.material=original;
   else{
    if(!polished.has(mesh)){
     const finish=base=>{
      const next=createCrystalMaterial(design.color,environment);
      next.map=base.map||null;if(base.color)next.color.copy(base.color);
      next.normalMap=base.normalMap||null;if(base.normalScale)next.normalScale.copy(base.normalScale);
      next.transmission=Number(clarity.value)/100;
      const worldScale=mesh.getWorldScale(new THREE.Vector3());
      next.thickness=.32/Math.max(worldScale.x,worldScale.y,worldScale.z,.0001);
      next.ior=1.52;next.roughness=.035;next.clearcoatRoughness=.02;next.attenuationDistance=3.5;next.side=base.side;
      // Keep the API texture as surface detail, while reducing its baked green
      // absorption so transmitted light is not multiplied into near-black.
      next.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n diffuseColor.rgb = mix(vec3(1.0), diffuseColor.rgb, 0.65);');};
      next.customProgramCacheKey=()=> 'aholo-clear-texture-v2';
      return next;
     };
     polished.set(mesh,Array.isArray(original)?original.map(finish):finish(original));
    }
    mesh.material=polished.get(mesh);
   }
  }
  originalButton.setAttribute('aria-pressed',String(mode==='original'));polishedButton.setAttribute('aria-pressed',String(mode==='polished'));
  clarity.disabled=mode==='original';clarityValue.textContent=clarity.value+'%';canvas.dataset.transmission=mode==='original'?'0':String(Number(clarity.value)/100);
  canvas.dataset.materialSource=mode==='original'?'aholo-original':'browser-polished';
  status.textContent=mode==='original'?'AHOLO 原材质 · 拖动检查真实模型':'本地通透材质 · 拖动旋转，观察切面反光';changed();
 }
 clarity.oninput=()=>{for(const value of polished.values())for(const m of Array.isArray(value)?value:[value])m.transmission=Number(clarity.value)/100;clarityValue.textContent=clarity.value+'%';canvas.dataset.transmission=String(Number(clarity.value)/100);changed();};
 originalButton.onclick=()=>material('original');polishedButton.onclick=()=>material('polished');
 async function poll(){
  if(!alive)return;
  try{
   const response=await fetch('/api/experiments',{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('status');
   const data=await response.json(),job=data.items.find(item=>item.case===caseName);
   canvas.dataset.source='aholo-lux3d';canvas.dataset.jobStatus=job?.status||'not-submitted';
   if(!job){status.textContent='尚未提交样品；打开页面不会自动生成。';return;}
   label.textContent=design.name+' · Lux3D G1';
   const completed=CRYSTAL_MODELS.filter(item=>data.items.some(job=>job.case===item.case&&job.status==='ready')).length;
   for(const link of choices.children){const item=CRYSTAL_MODELS.find(item=>item.key===link.dataset.stoneKey);link.dataset.status=data.items.find(job=>job.case===item.case)?.status||'not-submitted';}
   note.textContent=`造型来源：AHOLO Lux3D 文生 3D。任务 ${job.task_id||'提交中'}，累计 ${data.attempts} / ${data.limit} 次。五种造型已完成 ${completed} / 5。`;
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
   scene.add(model);note.textContent+=' 通透效果由浏览器材质调整，原始 GLB 保持不变。';canvas.dataset.modelLoaded='true';canvas.dataset.modelId=job.id;
   originalButton.disabled=false;polishedButton.disabled=false;material('polished');
  }catch{if(alive){status.textContent='样品暂时无法读取；稍后查询同一个任务，不会重新生成。';timer=setTimeout(poll,12000);}}
 }
 poll();
 return ()=>{alive=false;clearTimeout(timer);scene.remove(reference);reference.traverse(n=>n.geometry?.dispose());referenceMaterial.dispose();panelMaterial.dispose();lightTexture.dispose();for(const [mesh,original] of originals)mesh.material=original;for(const value of polished.values())for(const m of Array.isArray(value)?value:[value])m.dispose();if(model){scene.remove(model);release(model);}};
}
