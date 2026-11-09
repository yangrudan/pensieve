import * as THREE from '../../vendor/three.module.js';
import { OrbitControls } from '../../vendor/OrbitControls.js';
import { createCrystalGeometry,createCrystalEnvironment,createCrystal,CRYSTAL_SHAPES } from '../hybrid/crystal.js?v=20261029-6';
import { watchGeneratedCrystal } from './generated.js?v=20261029-6';

function start(){
 const canvas=document.querySelector('#crystal-scene'),stage=canvas.parentElement,status=document.querySelector('#preview-status');
 const aholoMode=new URLSearchParams(location.search).get('source')==='aholo';
 let releaseGenerated=()=>{};
 if(aholoMode){
  document.querySelector('h1').textContent='AHOLO 魔法水晶';
  document.querySelector('#shape-description').textContent='五种独立造型，逐颗读取 AHOLO 返回的模型。';
  document.querySelector('.swatches').hidden=true;document.querySelector('#material-tools').hidden=false;document.querySelector('#clarity-tools').hidden=false;document.querySelector('#api-stones').hidden=false;
  document.querySelector('.note').textContent='造型来源：AHOLO Lux3D。正在读取已有任务。';
  document.querySelector('#color-name').textContent='正在读取水晶模型';
 }
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}
 catch{status.textContent='此设备暂不支持三维预览，请尝试其他浏览器。';document.querySelector('#reset').disabled=true;return;}
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.transmissionResolutionScale=.5;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#0b171b');scene.fog=new THREE.Fog('#0b171b',9,23);
 let studioBackdrop;
 if(aholoMode){
  // Continuous studio backdrop lights transmission without adding a board mesh.
  const backdrop=document.createElement('canvas');backdrop.width=512;backdrop.height=512;
  const context=backdrop.getContext('2d'),gradient=context.createRadialGradient(256,220,20,256,250,355);
  gradient.addColorStop(0,'#738482');gradient.addColorStop(.55,'#34474b');gradient.addColorStop(1,'#0b171b');
  context.fillStyle=gradient;context.fillRect(0,0,512,512);
  studioBackdrop=new THREE.CanvasTexture(backdrop);studioBackdrop.colorSpace=THREE.SRGBColorSpace;scene.background=studioBackdrop;
 }
 const camera=new THREE.PerspectiveCamera(38,1,.1,35),controls=new OrbitControls(camera,canvas);
 controls.enablePan=false;controls.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.minDistance=3.4;controls.maxDistance=8;controls.minPolarAngle=.48;controls.maxPolarAngle=1.58;
 const environment=createCrystalEnvironment(renderer);scene.environment=environment.texture;
 scene.add(new THREE.HemisphereLight(0xd9edf0,0x233331,.8));
 const key=new THREE.DirectionalLight(0xffe9c8,2.0);key.position.set(2,5,4);scene.add(key);
 const fill=new THREE.DirectionalLight(0x99d7ee,1.3);fill.position.set(-3,3,-2);scene.add(fill);
 const geometries=Object.fromEntries(CRYSTAL_SHAPES.map(shape=>[shape,createCrystalGeometry(shape)]));
 const stone=new THREE.MeshStandardMaterial({color:0x788782,roughness:.8});
 const brass=new THREE.MeshStandardMaterial({color:0x9e8151,metalness:.85,roughness:.23,envMapIntensity:.6});
 function part(g,m,y){const mesh=new THREE.Mesh(g,m);mesh.position.y=y;scene.add(mesh);return mesh;}
 part(new THREE.CylinderGeometry(.88,.95,.12,48),brass,.06);
 part(new THREE.CylinderGeometry(.67,.76,.68,48),stone,.46);
 part(new THREE.CylinderGeometry(.8,.75,.13,48),brass,.86);
 const floor=part(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:0x172725,metalness:.15,roughness:.5}),-.01);floor.rotation.x=-Math.PI/2;floor.visible=!aholoMode;
 const loader=new THREE.TextureLoader();loader.load('/assets/limestone-albedo.webp',texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2,1);stone.map=texture;stone.needsUpdate=true;dirty=true;});
 let crystal,dirty=true,disposed=false,frameId;
 const colors=[['青玉','#8fc6ab'],['薰衣草','#ab8fc6'],['琥珀','#c6b48f'],['玫瑰','#c68f9d'],['雾蓝','#8fb4c6']];
 const swatches=document.querySelector('.swatches');
 function select(index){
  if(crystal){scene.remove(crystal);crystal.traverse(node=>node.material?.dispose());}
  const shape=CRYSTAL_SHAPES[index];crystal=createCrystal(colors[index][1],environment.texture,geometries[shape],shape);canvas.dataset.shape=shape;canvas.dataset.source='procedural-mesh';crystal.position.y=1.02;crystal.rotation.y=.18;scene.add(crystal);
  document.querySelector('#color-name').textContent=colors[index][0]+' · '+['六棱长晶','三峰晶簇','八角切钻','蔷薇心晶','冰蓝双尖'][index];canvas.dataset.color=colors[index][1];
  [...swatches.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));dirty=true;
 }
 colors.forEach(([name,color],index)=>{const button=document.createElement('button');button.style.setProperty('--color',color);button.setAttribute('aria-label',name);button.title=name;button.onclick=()=>select(index);swatches.append(button);});
 function reset(){camera.position.set(-2.5,3.0,5.8);controls.target.set(0,1.65,0);controls.update();dirty=true;}
 document.querySelector('#reset').onclick=reset;controls.addEventListener('change',()=>dirty=true);
 function resize(){const {width,height}=stage.getBoundingClientRect();camera.aspect=width/height;camera.fov=width<500?44:38;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.5,Math.sqrt(800000/(width*height))));renderer.setSize(width,height,false);dirty=true;}
 const observer=new ResizeObserver(resize);observer.observe(stage);if(aholoMode)releaseGenerated=watchGeneratedCrystal({scene,environment:environment.texture,canvas,changed:()=>dirty=true,status});else select(0);resize();reset();
 function frame(){frameId=requestAnimationFrame(frame);if(disposed||document.hidden)return;controls.update();if(!dirty)return;dirty=false;renderer.render(scene,camera);canvas.dataset.ready='true';canvas.dataset.frames=String(Number(canvas.dataset.frames||0)+1);if(!aholoMode)status.textContent='拖动旋转 · 滚轮或双指缩放';}
 frame();
 addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frameId);observer.disconnect();controls.dispose();releaseGenerated();studioBackdrop?.dispose();environment.dispose();const usedGeometries=new Set(Object.values(geometries)),materials=new Set();scene.traverse(node=>{if(node.geometry)usedGeometries.add(node.geometry);if(node.material)materials.add(node.material);});usedGeometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});renderer.dispose();});
 addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}
start();
