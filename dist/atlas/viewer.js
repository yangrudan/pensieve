import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
let destroy=()=>{},sequence=0;
export function clearViewer(){sequence++;destroy();destroy=()=>{};document.querySelector('#viewer-content').replaceChildren();document.querySelector('#viewer-content').dataset.loaded='false';}
export async function showView(memory,mode){
 clearViewer();const seq=sequence,host=document.querySelector('#viewer-content'),status=document.querySelector('#viewer-status');status.textContent='';
 document.querySelector('#view-photo').setAttribute('aria-pressed',String(mode==='photo'));document.querySelector('#view-3d').setAttribute('aria-pressed',String(mode==='3d'));
 if(mode==='photo'){const img=new Image();img.src=memory.photo_url;img.alt=memory.name;host.append(img);status.textContent='保留那一刻最初的样子';return;}
 if(memory.mode==='world'){const frame=document.createElement('iframe');frame.src=`/world/?id=${memory.id}&embed=1`;frame.title=`空间记忆：${memory.name}`;frame.allowFullscreen=true;host.append(frame);status.textContent='拖动环顾空间 · 单张照片的不可见区域由 AI 补全';return;}
 status.textContent='正在打开已保存的立体记忆…';
 const render=new THREE.WebGLRenderer({alpha:true,antialias:true});render.setPixelRatio(Math.min(devicePixelRatio,1.6));render.toneMapping=THREE.ACESFilmicToneMapping;render.toneMappingExposure=1.15;host.append(render.domElement);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.01,100);camera.position.set(3,1.7,4);const controls=new OrbitControls(camera,render.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=1;controls.maxDistance=12;scene.add(new THREE.HemisphereLight(0xe3e9ff,0x635964,2.8));const light=new THREE.DirectionalLight(0xffe9cc,3);light.position.set(3,6,4);scene.add(light);const rim=new THREE.DirectionalLight(0xa4c9ff,2);rim.position.set(-4,2,-3);scene.add(rim);
 let alive=true,model,frame;const resize=()=>{if(!alive)return;const {width,height}=host.getBoundingClientRect();render.setSize(width,height);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(host);resize();
 const release=obj=>obj?.traverse(n=>{n.geometry?.dispose();for(const m of (Array.isArray(n.material)?n.material:[n.material])){if(!m)continue;for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}});
 destroy=()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release(model);render.dispose();};
 try{const result=await new GLTFLoader().loadAsync(memory.model_url);if(seq!==sequence||!alive){release(result.scene);return;}model=result.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=2.6/Math.max(size.x,size.y,size.z,.001);model.scale.multiplyScalar(scale);model.position.sub(center.multiplyScalar(scale));scene.add(model);host.dataset.loaded='true';status.textContent='拖动旋转 · 滚轮 / 双指缩放';function draw(){if(!alive)return;controls.update();render.render(scene,camera);frame=requestAnimationFrame(draw);}draw();}catch{if(seq===sequence)status.textContent='模型暂时无法加载，可以切回原照片。';}
}
