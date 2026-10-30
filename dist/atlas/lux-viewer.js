import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { CRYSTAL_MODELS } from './crystal-lab/catalog.js?v=20261022-1';
import { createCrystalEnvironment,createLuxCrystalMaterial,LUX_GRADE } from './hybrid/crystal.js?v=20261029-6';

// Shows the real AHOLO Lux3D G1 crystal that was generated for a place's shape. It is loaded only when
// the viewer is opened, so the hall itself never downloads or decodes these models.
export function luxDesignFor(shape){return CRYSTAL_MODELS.find(item=>item.shape===shape)||null;}

export function openLuxViewer(host,{shape,color},status){
 const design=luxDesignFor(shape);host.replaceChildren();host.dataset.loaded='false';
 if(!design){status.textContent='这个地点暂时没有对应的 AHOLO 水晶模型。';return ()=>{};}
 status.textContent='正在读取 AHOLO Lux3D 水晶…';
 let alive=true,frame=0,model=null,dirty=true;
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.transmissionResolutionScale=.5;
 host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,40);
 const environment=createCrystalEnvironment(renderer);scene.environment=environment.texture;
 scene.add(new THREE.HemisphereLight(0xdceaf2,0x2b3340,1.2));
 const key=new THREE.DirectionalLight(0xffe9c8,2.4);key.position.set(2.5,5,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x9ecbff,1.6);rim.position.set(-3,2,-3);scene.add(rim);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enablePan=false;controls.enableDamping=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 controls.minDistance=2.6;controls.maxDistance=8;controls.target.set(0,1.3,0);camera.position.set(-1.6,1.9,5.2);controls.update();
 controls.addEventListener('change',()=>dirty=true);
 // The stage is a soft pool of light behind the crystal; no board or plinth geometry is added.
 const glow=document.createElement('canvas');glow.width=glow.height=256;
 const g=glow.getContext('2d'),radial=g.createRadialGradient(128,128,4,128,128,128);radial.addColorStop(0,color+'55');radial.addColorStop(1,color+'00');g.fillStyle=radial;g.fillRect(0,0,256,256);
 const glowTexture=new THREE.CanvasTexture(glow);glowTexture.colorSpace=THREE.SRGBColorSpace;
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));halo.scale.set(5.5,5.5,1);halo.position.set(0,1.4,-1.2);scene.add(halo);
 const resize=()=>{if(!alive)return;const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<520?46:36;camera.updateProjectionMatrix();dirty=true;};
 const observer=new ResizeObserver(resize);observer.observe(host);resize();
 const release=()=>{model?.traverse(n=>{if(n.isMesh){n.geometry.dispose();const m=n.material;for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}});};
 new GLTFLoader().loadAsync(`/crystal-models/${design.model_id}.glb`).then(async gltf=>{
  if(!alive)return;let mesh;gltf.scene.traverse(n=>{if(!mesh&&n.isMesh)mesh=n;});if(!mesh)throw Error('mesh');
  mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox,k=2.6/(box.max.y-box.min.y);
  const base=mesh.material;mesh.material=createLuxCrystalMaterial(base,color,environment.texture,{scale:k,glow:.12,grade:LUX_GRADE[shape]});
  mesh.scale.setScalar(k);mesh.position.set(-(box.min.x+box.max.x)/2*k,-box.min.y*k,-(box.min.z+box.max.z)/2*k);
  const holder=new THREE.Group();holder.add(mesh);holder.rotation.y=.4;model=holder;scene.add(holder);
  try{await renderer.compileAsync(scene,camera);}catch{}
  if(!alive)return;host.dataset.loaded='true';host.dataset.luxModel=design.model_id;dirty=true;
  status.textContent='AHOLO Lux3D G1 文生 3D · 拖动旋转 · 滚轮 / 双指缩放';
 }).catch(()=>{if(alive)status.textContent='水晶模型暂时无法读取。';});
 function draw(){if(!alive)return;frame=requestAnimationFrame(draw);if(controls.update())dirty=true;if(!dirty)return;dirty=false;renderer.render(scene,camera);host.dataset.frames=String((Number(host.dataset.frames)||0)+1);}
 draw();
 return ()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release();glowTexture.dispose();halo.material.dispose();environment.dispose();renderer.dispose();host.replaceChildren();};
}
