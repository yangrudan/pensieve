import * as THREE from '../../vendor/three.module.js';
import { OrbitControls } from '../../vendor/OrbitControls.js';
import { setupMemoryLinker } from './linker.js?v=20261022-3';
import { createCrystalGeometry,createCrystalEnvironment,createCrystal,CRYSTAL_SHAPES,crystalShapeForPlace } from './crystal.js?v=20261022-4';

// Mesh owns all navigable structure and clickable landmarks. Cached AHOLO
// panoramas provide environmental illumination, never duplicate GS geometry.
export function createRealm(onSelect){
 const $=s=>document.querySelector(s),canvas=$('#atlas-scene'),labels=$('#stone-labels');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let renderer,dirty=true;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}
 catch{$('#hall-status').textContent='设备暂不支持三维显示，仍可在下方选择地点';setupMemoryLinker(()=>{});$('#hall-mood').disabled=true;$('#hall-help').onclick=()=>$('#hall-about').showModal();$('#hall-close-about').onclick=()=>$('#hall-about').close();return {setPlaces(){},focus(){},setPaused(){}};}
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 renderer.transmissionResolutionScale=.5;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x101d30);scene.fog=new THREE.Fog(0x101d30,24,62);
 const camera=new THREE.PerspectiveCamera(55,1,.1,95),controls=new OrbitControls(camera,canvas);
 controls.enableDamping=true;controls.dampingFactor=.075;controls.enablePan=false;controls.minDistance=3.8;controls.maxDistance=17;
 controls.minPolarAngle=.52;controls.maxPolarAngle=1.47;controls.rotateSpeed=.38;controls.zoomSpeed=.55;
 const ambient=new THREE.HemisphereLight(0xaecbe5,0x343341,2.3);scene.add(ambient);
 const moon=new THREE.DirectionalLight(0xb5d9ff,3.4);moon.position.set(-8,12,-7);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-15;moon.shadow.camera.right=15;moon.shadow.camera.top=15;moon.shadow.camera.bottom=-15;moon.shadow.normalBias=.035;scene.add(moon);
 const warm=new THREE.PointLight(0xffc98a,70,32,2);warm.position.set(0,6,5);scene.add(warm);
 const loader=new THREE.TextureLoader(),stone=new THREE.MeshStandardMaterial({color:0x93958f,roughness:.93}),darkStone=new THREE.MeshStandardMaterial({color:0x313b49,roughness:.72,metalness:.15}),gold=new THREE.MeshStandardMaterial({color:0xc9ab72,metalness:.72,roughness:.32});
 loader.load('/assets/limestone-albedo.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1.5,2);t.anisotropy=4;stone.map=t;stone.bumpMap=t;stone.bumpScale=.06;stone.needsUpdate=true;dirty=true;});
 const floorMat=new THREE.MeshStandardMaterial({color:0xb8bcc3,roughness:.82,metalness:.1});
 loader.load('/assets/stone-floor-unique.webp',t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;floorMat.map=t;floorMat.needsUpdate=true;dirty=true;});
 const mesh=(geometry,material,parent=scene,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const ring=(radius,tube,y,material=gold,parent=scene)=>{const m=mesh(new THREE.TorusGeometry(radius,tube,8,96),material,parent,0,y,0);m.rotation.x=-Math.PI/2;return m;};
 const floor=mesh(new THREE.CircleGeometry(14.2,96),floorMat);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
 for(const r of [3.2,3.35,6.9,10.8,13.3])ring(r,.018,.012);
 const pedestalFoot=new THREE.CylinderGeometry(.82,.91,.17,8),pedestalBody=new THREE.CylinderGeometry(.63,.72,1.02,8),pedestalCap=new THREE.CylinderGeometry(.86,.8,.16,8);
 // Room walls have actual arched openings rather than a painted room backdrop.
 const wallRadius=13.65,segments=12,width=7.1,height=11.2;
 const windowShape=new THREE.Shape();windowShape.moveTo(-.95,2.6);windowShape.lineTo(.95,2.6);windowShape.lineTo(.95,6.4);windowShape.quadraticCurveTo(.95,7.5,0,8.3);windowShape.quadraticCurveTo(-.95,7.5,-.95,6.4);windowShape.closePath();
 const glass=new THREE.MeshPhysicalMaterial({color:0xa3c5dc,metalness:.12,roughness:.25,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false});
 const windows=[],lanterns=[];
 for(let i=0;i<segments;i++){
  const a=i/segments*Math.PI*2,group=new THREE.Group();group.position.set(Math.sin(a)*wallRadius,0,Math.cos(a)*wallRadius);group.rotation.y=a;scene.add(group);
  const shape=new THREE.Shape();shape.moveTo(-width/2,0);shape.lineTo(width/2,0);shape.lineTo(width/2,height);shape.lineTo(-width/2,height);shape.closePath();
  const hole=new THREE.Path();hole.moveTo(-.95,2.6);hole.lineTo(-.95,6.4);hole.quadraticCurveTo(-.95,7.5,0,8.3);hole.quadraticCurveTo(.95,7.5,.95,6.4);hole.lineTo(.95,2.6);hole.closePath();shape.holes.push(hole);
  const wall=mesh(new THREE.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:false}),stone,group);wall.position.z=-.1;
  const pane=mesh(new THREE.ShapeGeometry(windowShape),glass,group,0,0,-.05);pane.castShadow=false;windows.push(pane);
  for(const x of [-1.1,1.1])mesh(new THREE.CylinderGeometry(.11,.15,4,10),gold,group,x,4.5,-.28);
  const arch=[];for(let j=0;j<=32;j++){const f=j/32;arch.push(new THREE.Vector3(Math.cos(f*Math.PI)*1.07,6.35+Math.sin(f*Math.PI)*1.9,-.25));}
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arch),36,.11,6,false),darkStone,group);
  for(const x of [-width/2,width/2]){mesh(new THREE.CylinderGeometry(.23,.32,10.5,12),stone,group,x,5.25,-.3);for(const y of [.2,.5,9.8,10.3])mesh(new THREE.CylinderGeometry(.4,.4,.18,12),darkStone,group,x,y,-.3);}
  mesh(new THREE.BoxGeometry(width,.18,.25),darkStone,group,0,1.7,-.28);
  if(i%2===0){const lampMat=new THREE.MeshStandardMaterial({color:0xffd3a0,emissive:0xffb75b,emissiveIntensity:2});const lamp=mesh(new THREE.CylinderGeometry(.12,.14,.42,8),lampMat,group,2.2,3.3,-.45);lamp.castShadow=false;lanterns.push(lamp);mesh(new THREE.BoxGeometry(.08,.25,.5),gold,group,2.2,3.04,-.23);}
  const rib=[];for(let j=0;j<=24;j++){const t=j/24*Math.PI/2;rib.push(new THREE.Vector3(Math.sin(a)*Math.cos(t)*13.6,10.45+Math.sin(t)*4.3,Math.cos(a)*Math.cos(t)*13.6));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rib),28,.07,5,false),darkStone);
 }
 const ceiling=mesh(new THREE.SphereGeometry(14.05,48,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x344458,side:THREE.BackSide,roughness:1}),scene,0,10.4,0);ceiling.scale.y=.31;
 const backdrop=mesh(new THREE.SphereGeometry(57,48,24),new THREE.MeshBasicMaterial({color:0x15283e,side:THREE.BackSide,depthWrite:false,fog:false}));backdrop.castShadow=false;backdrop.receiveShadow=false;backdrop.rotation.y=-Math.PI/2;
 // The basin has a hollow rim, an opaque bowl, and a separate animated surface.
 const basin=new THREE.Group();basin.position.z=.8;scene.add(basin);
 mesh(new THREE.CylinderGeometry(2.6,2.78,.2,64),darkStone,basin,0,.1,0);
 const rimShape=new THREE.Shape();rimShape.absarc(0,0,2.52,0,Math.PI*2,false);const rimHole=new THREE.Path();rimHole.absarc(0,0,2.15,0,Math.PI*2,true);rimShape.holes.push(rimHole);
 const rim=mesh(new THREE.ExtrudeGeometry(rimShape,{depth:.67,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:48}),stone,basin,0,.18,0);rim.rotation.x=-Math.PI/2;
 ring(2.46,.033,.88,gold,basin);ring(2.56,.024,.24,gold,basin);
 const waterMaterial=new THREE.MeshPhysicalMaterial({color:0x173f4c,metalness:.48,roughness:.2,clearcoat:.9,envMapIntensity:1.4});
 const water=mesh(new THREE.CircleGeometry(2.14,72),waterMaterial,basin,0,.76,0);water.rotation.x=-Math.PI/2;water.castShadow=false;
 const rippleMaterial=new THREE.MeshBasicMaterial({color:0xa2ded4,transparent:true,opacity:.18,depthWrite:false});const ripples=[];for(const r of [.6,1.15,1.75])ripples.push(ring(r,.006,.77,rippleMaterial,basin));
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const rune=mesh(new THREE.BoxGeometry(.024,.012,.15),gold,basin,Math.sin(a)*2.34,.91,Math.cos(a)*2.34);rune.rotation.y=a;}
 let nodes=[],nodeRoot=new THREE.Group(),animation=null,focused=null,paused=false,disposed=false,active=false,settleTimer,mood='moon',moodSeq=0;
 scene.add(nodeRoot);const environmentCache=new Map(),pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();
 function status(message){$('#hall-status').textContent=message;}
 async function loadMood(next){
  mood=next;dirty=true;const seq=++moodSeq;$('#hall-mood').textContent=next==='moon'?'☾ 月光':'☀ 日光';$('#hall-mood').setAttribute('aria-pressed',String(next==='day'));status('正在读取本地 AHOLO 光景…');
  ambient.color.set(next==='moon'?0xaecbe5:0xe2e7de);ambient.intensity=next==='moon'?2.3:2.8;moon.color.set(next==='moon'?0xb5d9ff:0xffe9c7);renderer.toneMappingExposure=next==='moon'?1.15:1.25;
  try{
   let cached=environmentCache.get(next);
   if(!cached){const r=await fetch('/api/experiments',{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error();const j=await r.json();const source=j.items.find(x=>x.case===(next==='moon'?'stone-hall-reference-v1':'stone-hall-daylight-v1')&&x.status==='ready');if(!source?.world_assets?.panorama_url)throw Error();
    const texture=await loader.loadAsync(source.world_assets.panorama_url);if(disposed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.mapping=THREE.EquirectangularReflectionMapping;
    const lightCanvas=document.createElement('canvas');lightCanvas.width=1024;lightCanvas.height=512;const lightContext=lightCanvas.getContext('2d');lightContext.filter='blur(9px)';lightContext.drawImage(texture.image,0,0,1024,512);const lightTexture=new THREE.CanvasTexture(lightCanvas);lightTexture.colorSpace=THREE.SRGBColorSpace;lightTexture.mapping=THREE.EquirectangularReflectionMapping;cached={texture:lightTexture,target:pmrem.fromEquirectangular(lightTexture)};texture.dispose();environmentCache.set(next,cached);
   }
   if(seq!==moodSeq||disposed)return;scene.environment=cached.target.texture;backdrop.material.map=cached.texture;backdrop.material.color.setHex(0x8293a7);backdrop.material.needsUpdate=true;dirty=true;
   canvas.dataset.aholoEnvironment=next;status('AHOLO 光景已接入 · 结构与地点固定');
  }catch{if(seq===moodSeq&&!disposed)status('光景暂未读到 · 可继续探索大厅和记忆');}
 }
 $('#hall-mood').onclick=()=>loadMood(mood==='moon'?'day':'moon');
 $('#hall-help').onclick=()=>{$('#hall-about').showModal();setPaused(true);};$('#hall-close-about').onclick=()=>$('#hall-about').close();$('#hall-about').addEventListener('close',()=>setPaused(false));
 const glowCanvas=document.createElement('canvas');glowCanvas.width=128;glowCanvas.height=128;const ctx=glowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'#ffffffaa');gradient.addColorStop(.25,'#ffffff33');gradient.addColorStop(1,'#ffffff00');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const glowMap=new THREE.CanvasTexture(glowCanvas);
 function position(i){const positions=[[-6,0,1],[-3.5,0,-3.2],[0,0,-5],[3.5,0,-3.2],[6,0,1]];if(i<5)return new THREE.Vector3(...positions[i]);const a=(i-5)/7*Math.PI*1.65+.55;return new THREE.Vector3(Math.sin(a)*10,0,Math.cos(a)*10);}
 const gemGeometries=Object.fromEntries(CRYSTAL_SHAPES.map(shape=>[shape,createCrystalGeometry(shape)])),sharedGeometry=new Set([...Object.values(gemGeometries),pedestalFoot,pedestalBody,pedestalCap]),crystalEnvironment=createCrystalEnvironment(renderer);
 function clearNodes(){nodeRoot.traverse(n=>{if(n.material)for(const material of Array.isArray(n.material)?n.material:[n.material])if(![stone,darkStone,gold].includes(material))material.dispose();if(n.geometry&&!sharedGeometry.has(n.geometry))n.geometry.dispose();});scene.remove(nodeRoot);nodeRoot=new THREE.Group();scene.add(nodeRoot);nodes=[];labels.replaceChildren();}
 function setPlaces(places,counts){
  clearNodes();places.forEach((place,i)=>{const pos=position(i),group=new THREE.Group();group.position.copy(pos);nodeRoot.add(group);
   mesh(pedestalFoot,darkStone,group,0,.12,0);mesh(pedestalBody,stone,group,0,.7,0);mesh(pedestalCap,gold,group,0,1.29,0);
   const gemGroup=new THREE.Group();gemGroup.position.y=1.5;gemGroup.userData.placeId=place.id;group.add(gemGroup);
   const shape=crystalShapeForPlace(place.id),gem=createCrystal(place.color,crystalEnvironment.texture,gemGeometries[shape],shape);gemGroup.add(gem);gem.rotation.y=shape==='heart'?.12:i*.42;
   const aura=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:place.color,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false}));aura.position.y=2.15;aura.scale.set(2.7,2.7,1);group.add(aura);
   const marker=ring(.9,.025,.03,new THREE.MeshBasicMaterial({color:place.color,transparent:true,opacity:.6}),group);
   const symbol=mesh(new THREE.TorusGeometry(.24,.012,5,32),gold,group,0,.73,.715);symbol.rotation.y=.05;
   const label=document.createElement('button');label.className='stone-label';label.style.setProperty('--stone',place.color);label.setAttribute('aria-label',`打开${place.name}的记忆`);label.setAttribute('aria-pressed',String(place.id===focused));label.dataset.place=place.id;label.dataset.shape=shape;
   const title=document.createElement('strong');title.textContent=place.name;const count=document.createElement('small');count.textContent=`${counts[place.id]||0} 段记忆`;label.append(title,count);label.onclick=()=>onSelect(place.id);labels.append(label);
   nodes.push({id:place.id,pos,group,gemGroup,aura,marker,label});
  });canvas.dataset.stoneCount=String(nodes.length);canvas.dataset.ready='true';dirty=true;renderer.shadowMap.needsUpdate=true;
 }
 const fullPosition=()=>new THREE.Vector3(0,innerWidth<761?9.8:4.2,innerWidth<761?12.6:12.7);
 function focus(id){
  focused=id;dirty=true;const node=nodes.find(x=>x.id===id),mobile=innerWidth<761;nodes.forEach(n=>n.label.setAttribute('aria-pressed',String(n.id===id)));
  const target=node?node.pos.clone().add(new THREE.Vector3(0,mobile?-.2:1.5,0)):new THREE.Vector3(0,mobile?.2:1.4,-.7);
  const destination=node?node.pos.clone().add(new THREE.Vector3(node.pos.x>0?-2.5:2.5,mobile?4.8:3.1,7.5)):fullPosition();
  // Keep the complete orbit inside the actual room and above its floor.
  destination.y=Math.max(1.7,destination.y);const radius=Math.hypot(destination.x,destination.z);if(radius>12.8){destination.x*=12.8/radius;destination.z*=12.8/radius;}
  animation={time:performance.now(),from:camera.position.clone(),to:destination,targetFrom:controls.target.clone(),targetTo:target};if(reduced){camera.position.copy(destination);controls.target.copy(target);animation=null;}
 }
 function setPaused(value){paused=value;dirty=true;controls.enabled=!value;labels.hidden=value;}
 function scale(){dirty=true;const budget=active?550000:1150000;renderer.setPixelRatio(Math.min(devicePixelRatio,1.6,Math.sqrt(budget/(innerWidth*innerHeight))));renderer.setSize(innerWidth,innerHeight,false);}
 let wasMobile=innerWidth<761;function resize(){dirty=true;scale();camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<761?104:55;camera.updateProjectionMatrix();if(wasMobile!==(innerWidth<761)){wasMobile=innerWidth<761;focus(focused);if(animation){camera.position.copy(animation.to);controls.target.copy(animation.targetTo);animation=null;}}}
 controls.addEventListener('change',()=>dirty=true);
 setupMemoryLinker(setPaused);
 controls.addEventListener('start',()=>{animation=null;active=true;clearTimeout(settleTimer);scale();});controls.addEventListener('end',()=>{settleTimer=setTimeout(()=>{active=false;scale();dirty=true;},180);});
 let down;canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(paused||!down)return;const start=down;down=null;if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>7)return;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2),camera);const hits=ray.intersectObjects(nodes.map(n=>n.gemGroup),true);if(hits.length){let object=hits[0].object;while(object&&!object.userData.placeId)object=object.parent;if(object)onSelect(object.userData.placeId);}});canvas.addEventListener('pointercancel',()=>down=null);
 addEventListener('resize',resize);resize();camera.position.copy(fullPosition());controls.target.set(0,innerWidth<761?.2:1.4,-.7);controls.update();loadMood('moon');
 const projected=new THREE.Vector3();let raf=0;
 function frame(now){raf=requestAnimationFrame(frame);if(disposed||paused||document.hidden)return;const t=now*.001;
  if(animation){dirty=true;const f=Math.min(1,(now-animation.time)/850),ease=f*f*(3-2*f);camera.position.lerpVectors(animation.from,animation.to,ease);controls.target.lerpVectors(animation.targetFrom,animation.targetTo,ease);if(f===1)animation=null;}
  if(controls.update())dirty=true;if(!dirty)return;dirty=false;const radius=Math.hypot(camera.position.x,camera.position.z);if(radius>13){camera.position.x*=13/radius;camera.position.z*=13/radius;}camera.position.y=Math.max(1.2,Math.min(10,camera.position.y));
  if(!reduced){ripples.forEach((r,i)=>{const s=.9+Math.sin(t*.7+i*2)*.07;r.scale.set(s,s,1);});waterMaterial.roughness=.2+Math.sin(t*.5)*.025;}
  camera.updateMatrixWorld();
  for(const n of nodes){n.marker.material.opacity=focused===n.id?.95:.5;n.aura.material.opacity=(focused===n.id?.18:.10)+(reduced?0:Math.sin(t*.8)*.015);
   projected.copy(n.pos);projected.y=1.05;projected.project(camera);n.label.style.left=`${(projected.x*.5+.5)*innerWidth}px`;n.label.style.top=`${(-projected.y*.5+.5)*innerHeight}px`;n.label.hidden=projected.z< -1||projected.z>1||Math.abs(projected.x)>1||Math.abs(projected.y)>1;
  }
  renderer.render(scene,camera);canvas.dataset.rendered='true';canvas.dataset.frameCount=String((Number(canvas.dataset.frameCount)||0)+1);
 }
 raf=requestAnimationFrame(frame);
 addEventListener('pagehide',()=>{disposed=true;moodSeq++;cancelAnimationFrame(raf);clearTimeout(settleTimer);controls.dispose();environmentCache.forEach(x=>{x.texture.dispose();x.target.dispose();});pmrem.dispose();crystalEnvironment.dispose();scene.traverse(n=>{n.geometry?.dispose();if(n.material)for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose();});glowMap.dispose();renderer.dispose();});
 addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
 return {setPlaces,focus,setPaused};
}
