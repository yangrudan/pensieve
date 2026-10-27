import * as THREE from '../../vendor/three.module.js';
import { OrbitControls } from '../../vendor/OrbitControls.js';
import {mergeGeometries} from '../../vendor/BufferGeometryUtils.js';
import {createCrystalEnvironment} from '../hybrid/crystal.js';

// Detailed source geometry, kept distinct from cached AHOLO reconstruction.
export async function createDetailHall(canvas,{capture=false}={}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:capture});
 renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#c4d7de');
 const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.08,80);
 const tex=await new THREE.TextureLoader().loadAsync('/assets/limestone-detail-v1.webp');tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const map=tex.clone();map.repeat.set(1.2,1.8);
 const stone=new THREE.MeshStandardMaterial({map,color:'#e3d8bf',roughness:.9,bumpMap:map,bumpScale:.025});
 const carving=new THREE.MeshStandardMaterial({map:tex,color:'#d4c7ae',roughness:.83,bumpMap:tex,bumpScale:.018});
 const trim=new THREE.MeshStandardMaterial({map:tex,color:'#b9ad97',roughness:.85});
 const dark=new THREE.MeshStandardMaterial({color:'#514d42',roughness:.9});
 const brass=new THREE.MeshStandardMaterial({color:'#a58a48',metalness:.6,roughness:.35});
 const blue=new THREE.MeshStandardMaterial({color:'#102f48',roughness:.94});
 const mesh=(geo,mat,parent=scene,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const box=(w,h,d,mat,parent,x=0,y=0,z=0)=>mesh(new THREE.BoxGeometry(w,h,d),mat,parent,x,y,z);
 const tube=(points,r,mat,parent=scene)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(12,points.length*2),r,5,false),mat,parent);
 const ring=(r,t,y,mat,parent=scene)=>{const m=mesh(new THREE.TorusGeometry(r,t,8,96),mat,parent,0,y,0);m.rotation.x=-Math.PI/2;return m;};
 const beveled=(w,h,d,mat,parent,x,y,z,r=.035)=>{const shape=new THREE.Shape();shape.moveTo(-w/2+r,-d/2);shape.lineTo(w/2-r,-d/2);shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);shape.lineTo(w/2,d/2-r);shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);shape.lineTo(-w/2+r,d/2);shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);shape.lineTo(-w/2,-d/2+r);shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const m=mesh(new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelThickness:r,bevelSize:r,bevelSegments:2,steps:1}),mat,parent,x,y,z);m.rotation.x=-Math.PI/2;return m;};
 function arch(width,height,bottom=0){const s=new THREE.Shape(),hw=width/2,shoulder=bottom+height-width*.8;s.moveTo(-hw,bottom);s.lineTo(hw,bottom);s.lineTo(hw,shoulder);s.bezierCurveTo(hw,shoulder+width*.4,width*.22,bottom+height,0,bottom+height);s.bezierCurveTo(-width*.22,bottom+height,-hw,shoulder+width*.4,-hw,shoulder);s.closePath();return s;}
 function archLine(width,height,bottom,depth,parent,mat=carving,r=.035){const hw=width/2,shoulder=bottom+height-width*.8,pts=[new THREE.Vector3(-hw,bottom,depth),new THREE.Vector3(-hw,shoulder,depth)];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector3(-hw*(1-t),shoulder+(height+bottom-shoulder)*Math.sin(t*Math.PI/2),depth));}for(let i=1;i<=12;i++){const t=i/12;pts.push(new THREE.Vector3(hw*t,bottom+height-(height+bottom-shoulder)*(1-Math.cos(t*Math.PI/2)),depth));}pts.push(new THREE.Vector3(hw,bottom,depth));tube(pts,r,mat,parent);}
 const floor=new THREE.Group();floor.name='paving';scene.add(floor);
 const colors=['#c1bba9','#d0c7b1','#b4b1a5','#d9d0bb','#bfb7a5'];
 const floorMaterials=colors.map(color=>new THREE.MeshStandardMaterial({map:tex,color,roughness:.92,bumpMap:tex,bumpScale:.018}));
 for(let x=-8;x<=8;x++)for(let z=-8;z<=8;z++){
  if(Math.hypot(x*.88,z*.88)>7.65)continue;
  const m=floorMaterials[((x*13+z*7)%5+5)%5],tile=beveled(.855,.055,.855,m,floor,x*.88,-.075,z*.88,.012),uv=tile.geometry.attributes.uv;
  const ox=((x*17+z*11)%31+31)/31,oy=((z*19-x*3)%29+29)/29;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.55+ox,uv.getY(i)*.55+oy);
 }
 for(const r of [2.25,2.36,4.8,4.88])ring(r,.012,.004,brass);
 const wallRadius=7.35,width=6.14,height=8.25,windows=[1,3,4,5,7];
 const skyCanvas=document.createElement('canvas');skyCanvas.width=1024;skyCanvas.height=512;const sky=skyCanvas.getContext('2d'),gradient=sky.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#83b1cf');gradient.addColorStop(.6,'#e9eee3');gradient.addColorStop(1,'#868f78');sky.fillStyle=gradient;sky.fillRect(0,0,1024,512);sky.fillStyle='#b3c2c1';sky.beginPath();sky.moveTo(0,350);for(let i=0;i<=24;i++)sky.lineTo(i/24*1024,190+Math.sin(i*1.7)*28+Math.cos(i*.65)*25);sky.lineTo(1024,512);sky.lineTo(0,512);sky.fill();
 const skyTex=new THREE.CanvasTexture(skyCanvas);skyTex.colorSpace=THREE.SRGBColorSpace;skyTex.mapping=THREE.EquirectangularReflectionMapping;
 const pmrem=new THREE.PMREMGenerator(renderer),env=pmrem.fromEquirectangular(skyTex);scene.environment=env.texture;scene.environmentIntensity=.55;const gemEnvironment=createCrystalEnvironment(renderer);
 const backdrop=mesh(new THREE.SphereGeometry(35,48,20),new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide}));backdrop.castShadow=backdrop.receiveShadow=false;
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,g=new THREE.Group();g.position.set(Math.sin(a)*wallRadius,0,Math.cos(a)*wallRadius);g.rotation.y=a;scene.add(g);
  const shape=new THREE.Shape();shape.moveTo(-width/2,0);shape.lineTo(width/2,0);shape.lineTo(width/2,height);shape.lineTo(-width/2,height);shape.closePath();
  const hasWindow=windows.includes(i),ww=i===4?2.65:1.8,wh=i===4?5.6:4.9,wb=i===4?1.9:2.3;
  if(hasWindow){const hole=new THREE.Path(arch(ww,wh,wb).getPoints(48));shape.holes.push(hole);}
  const wall=mesh(new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:false}),stone,g);wall.position.z=-.04;
  for(const y of [.16,1.28,7.8]){box(width,.12,.2,carving,g,0,y,-.19);box(width,.04,.3,trim,g,0,y+.11,-.22);}
  for(let row=0;row<12;row++){const y=.35+row*.61;for(let col=-3;col<=3;col++){const x=col*.95+(row%2)*.45;if(Math.abs(x)>width/2-.1)continue;if(hasWindow&&Math.abs(x)<ww/2+.15&&y>wb-.1&&y<wb+wh)continue;box(.012,.58,.009,trim,g,x,y,-.047);}}
  for(const x of [-2.88,2.88]){
   mesh(new THREE.CylinderGeometry(.145,.19,7.65,16),carving,g,x,3.83,-.18);
   for(const y of [.14,.28,1.3,7.35,7.6])mesh(new THREE.CylinderGeometry(.27,.28,.11,16),trim,g,x,y,-.18);
   for(let j=0;j<7;j++){const t=j/7*Math.PI*2;const leaf=mesh(new THREE.SphereGeometry(.1,8,5),carving,g,x+Math.cos(t)*.18,7.49+Math.sin(t*2)*.035,-.18+Math.sin(t)*.18);leaf.scale.set(.55,1.8,.8);}
  }
  if(hasWindow){
   for(const offset of [0,.105,.21])archLine(ww+offset,wh+offset*.45,wb-offset*.25,-.14-offset*.35,g,carving,.045);
   beveled(ww+.46,.12,.58,carving,g,0,wb-.09,-.2);
   for(const xx of [-ww/4,ww/4])box(.045,wh-ww*.7,.09,carving,g,xx,wb+(wh-ww*.7)/2,-.19);
   for(const yy of [wb+wh*.29,wb+wh*.58])box(ww,.045,.09,carving,g,0,yy,-.19);
   const cy=wb+wh-ww*.7;for(let j=0;j<4;j++){const t=j*Math.PI/2;mesh(new THREE.TorusGeometry(ww*.12,.026,6,28),carving,g,Math.cos(t)*ww*.13,cy+Math.sin(t)*ww*.13,-.2);}
  }
  if(i===2){mesh(new THREE.ExtrudeGeometry(arch(1.95,3.65,.15),{depth:.12,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2}),new THREE.MeshStandardMaterial({color:'#563c29',roughness:.8}),g,0,0,-.12);for(let x=-.8;x<=.8;x+=.2)box(.013,2.55,.025,dark,g,x,1.45,-.27);archLine(2.2,3.95,.02,-.3,g,carving,.1);for(const y of [.75,2.25])box(1.7,.1,.035,brass,g,0,y,-.29);mesh(new THREE.TorusGeometry(.1,.022,8,32),brass,g,.57,1.6,-.33);}
  if(i===4)for(const x of [-2.15,2.15]){box(.75,2.55,.025,blue,g,x,4,-.16);box(.85,.06,.11,brass,g,x,5.32,-.22);for(let j=0;j<7;j++){const t=j/7*Math.PI*2;tube([new THREE.Vector3(x+Math.cos(t)*.24,4+Math.sin(t)*.6,-.19),new THREE.Vector3(x+Math.cos(t+2)*.24,4+Math.sin(t+2)*.6,-.19)],.012,brass,g);}}
  if(i%2===0)for(const x of [-1.65,1.65]){box(.11,.36,.1,brass,g,x,2.5,-.18);mesh(new THREE.CylinderGeometry(.065,.09,.27,10),new THREE.MeshStandardMaterial({color:'#ffe3a3',emissive:'#ffbd58',emissiveIntensity:1.5}),g,x,2.78,-.34);if(i===4){const light=new THREE.PointLight('#ffce8d',2.5,2.6,2);light.position.set(x,2.8,-.5);g.add(light);}}
  const rib=[];for(let j=0;j<=20;j++){const t=j/20*Math.PI/2;rib.push(new THREE.Vector3(Math.sin(a)*Math.cos(t)*7.45,7.75+Math.sin(t)*2.5,Math.cos(a)*Math.cos(t)*7.45));}tube(rib,.065,carving);
 }
 const ceiling=mesh(new THREE.SphereGeometry(7.65,48,20,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({map:tex,color:'#ddd4bf',side:THREE.BackSide,roughness:1}),scene,0,7.72,0);ceiling.scale.y=.34;
 const basin=new THREE.Group();basin.name='carved-basin';basin.position.z=.65;scene.add(basin);
 const profile=[[1.75,.03],[1.9,.08],[1.93,.18],[1.81,.25],[1.81,.72],[1.92,.78],[1.95,.89],[1.91,.99],[1.58,.99],[1.55,.88],[1.55,.28],[0,.28]].map(([r,y])=>new THREE.Vector2(r,y));
 mesh(new THREE.LatheGeometry(profile,128),stone,basin);
 for(const [r,y,t] of [[1.92,.15,.018],[1.82,.3,.022],[1.82,.68,.022],[1.93,.85,.023],[1.93,.96,.018]])ring(r,t,y,carving,basin);
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2,g=new THREE.Group();g.position.set(Math.sin(a)*1.82,.31,Math.cos(a)*1.82);g.rotation.y=a;basin.add(g);archLine(.31,.32,0,.02,g,trim,.022);const leaf=mesh(new THREE.SphereGeometry(.05,8,5),carving,g,0,.1,.035);leaf.scale.set(.65,1.6,.45);}
 const water=mesh(new THREE.CircleGeometry(1.55,96),new THREE.MeshPhysicalMaterial({color:'#123d48',metalness:.13,roughness:.2,clearcoat:.7}),basin,0,.77,0);water.rotation.x=-Math.PI/2;water.castShadow=false;
 const positions=[[-3.65,0,-.7],[-2.1,0,-2.8],[0,0,-3.55],[2.1,0,-2.8],[3.65,0,-.7]],gemColors=['#229a70','#7847ab','#e6a71e','#de7c99','#55a5d6'];
 const crystals=[],plinths=[];
 function gemGeometry(index){const verts=[],rings=[[.04,.25],[.15,.43],[.58,.51],[.88,.37],[1.23,.035]],n=10;const points=rings.map(([y,r],row)=>Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2+(row%2)*.09;return new THREE.Vector3(Math.sin(a)*r*(1+.05*Math.sin(i*7+index)),y,Math.cos(a)*r);}));const tri=(a,b,c)=>verts.push(...a.toArray(),...c.toArray(),...b.toArray());for(let row=0;row<points.length-1;row++)for(let i=0;i<n;i++){const j=(i+1)%n;tri(points[row][i],points[row+1][i],points[row][j]);tri(points[row+1][i],points[row+1][j],points[row][j]);}for(let i=0;i<n;i++){const j=(i+1)%n;tri(points.at(-1)[i],new THREE.Vector3(0,1.3,0),points.at(-1)[j]);tri(points[0][j],new THREE.Vector3(0,.04,0),points[0][i]);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.computeVertexNormals();const uvs=[];for(let j=0;j<verts.length;j+=9){const us=[0,3,6].map(k=>Math.atan2(verts[j+k],verts[j+k+2])/(2*Math.PI)+.5),wrap=Math.max(...us)-Math.min(...us)>.5;for(let k=0;k<3;k++)uvs.push(us[k]+(wrap&&us[k]<.5?1:0),verts[j+k*3+1]/1.3);}geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));return geo;}
 const gemCanvas=document.createElement('canvas');gemCanvas.width=gemCanvas.height=1024;const gx=gemCanvas.getContext('2d');gx.fillStyle='#eeeeee';gx.fillRect(0,0,1024,1024);let gemSeed=823;const random=()=>{gemSeed=(gemSeed*1664525+1013904223)>>>0;return gemSeed/4294967296;};for(let i=0;i<100;i++){let x=random()*1024,y=random()*1024;gx.strokeStyle=`rgba(${i%3===0?'140,150,150':'255,255,255'},${.08+random()*.22})`;gx.lineWidth=.5+random()*1.0;gx.beginPath();gx.moveTo(x,y);for(let j=0;j<4;j++){x+=random()*50-25;y+=random()*70-35;gx.lineTo(x,y);}gx.stroke();}for(let i=0;i<2500;i++){gx.fillStyle=`rgba(255,255,255,${random()*.25})`;gx.fillRect(random()*1024,random()*1024,random()*1.5,.5+random());}const gemMap=new THREE.CanvasTexture(gemCanvas);gemMap.colorSpace=THREE.SRGBColorSpace;gemMap.wrapS=THREE.RepeatWrapping;gemMap.anisotropy=8;
 positions.forEach(([x,y,z],i)=>{
  const g=new THREE.Group();g.name=`carved-plinth-${i+1}`;g.position.set(x,y,z);g.rotation.y=-Math.atan2(x,5-z)*.25;scene.add(g);plinths.push(g);
  beveled(1.15,.13,1.15,trim,g,0,.03,0,.035);beveled(1.0,.12,1.0,carving,g,0,.19,0,.025);beveled(.79,.96,.79,stone,g,0,.31,0,.025);beveled(1.03,.11,1.03,carving,g,0,1.28,0,.025);beveled(1.15,.095,1.15,stone,g,0,1.42,0,.03);
  for(let face=0;face<4;face++){const f=new THREE.Group();f.rotation.y=face*Math.PI/2;g.add(f);box(.63,.78,.018,trim,f,0,.82,.407);box(.54,.69,.02,stone,f,0,.82,.423);archLine(.43,.54,.52,.45,f,carving,.027);mesh(new THREE.TorusGeometry(.11,.018,6,32),carving,f,0,.91,.45);for(let j=0;j<i+3;j++){const a=j/(i+3)*Math.PI*2;const leaf=mesh(new THREE.SphereGeometry(.045,8,5),carving,f,Math.sin(a)*.09,.91+Math.cos(a)*.09,.47);leaf.scale.set(.55,1.6,.55);leaf.rotation.z=-a;}}
  const material=new THREE.MeshPhysicalMaterial({color:new THREE.Color(gemColors[i]).lerp(new THREE.Color('white'),.58),map:gemMap,bumpMap:gemMap,bumpScale:.003,metalness:0,roughness:.07,transmission:.8,thickness:.45,ior:1.6,clearcoat:1,clearcoatRoughness:.025,attenuationColor:new THREE.Color(gemColors[i]),attenuationDistance:6,envMap:gemEnvironment.texture,envMapIntensity:1.8});
  if(capture){material.transmission=0;material.roughness=.22;material.clearcoat=.35;material.color.set(gemColors[i]).lerp(new THREE.Color('white'),.12);}
  const gem=mesh(gemGeometry(i),material,scene,x,1.49,z);gem.name=`detail-crystal-${i+1}`;gem.userData.color=gemColors[i];gem.rotation.y=i*.37;crystals.push(gem);
 });
 const sun=new THREE.DirectionalLight('#fff0d4',3.4);sun.position.set(-4,9,-7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;scene.add(sun);
 const fill=new THREE.DirectionalLight('#c7e3f2',.6);fill.position.set(6,5,4);scene.add(fill);scene.add(new THREE.HemisphereLight('#e8f1f4','#8b7f67',.5));
 // Merge static carved stone by material. Detail stays geometric; camera changes
 // no longer redraw thousands of individual pieces or regenerate static shadows.
 scene.updateMatrixWorld(true);const supports=plinths.map(g=>new THREE.Box3().setFromObject(g));const batches=new Map(),originals=[];
 scene.traverse(n=>{if(!n.isMesh||n===backdrop||n===water||crystals.includes(n))return;let geometry=n.geometry.clone().applyMatrix4(n.matrixWorld);if(geometry.index)geometry=geometry.toNonIndexed();if(!batches.has(n.material))batches.set(n.material,[]);batches.get(n.material).push(geometry);originals.push(n);});
 for(const n of originals){n.removeFromParent();n.geometry.dispose();}
 for(const [material,geometries] of batches){const combined=mergeGeometries(geometries,false);if(!combined)throw Error('Static geometry merge failed');mesh(combined,material);for(const g of geometries)g.dispose();}
 renderer.shadowMap.needsUpdate=true;
 let controls,frame=0,currentMode='overview',currentIndex=0;
 function render(){renderer.render(scene,camera);canvas.dataset.rendered='true';}
 function requestDraw(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;render();});}
 function finishView(){if(controls)requestDraw();else render();}
 const fitFov=base=>Math.min(125,2*Math.atan(Math.tan(base*Math.PI/360)*Math.max(1,1.3/camera.aspect))*180/Math.PI);
 const closeFov=base=>camera.aspect<1?2*Math.atan(Math.tan(35*Math.PI/360)/camera.aspect)*180/Math.PI:base;
 function overview(){currentMode='overview';camera.position.set(0,3.1,6.45);camera.lookAt(0,1.1,-.6);camera.fov=fitFov(58);camera.updateProjectionMatrix();if(controls){controls.target.set(0,1.1,-.6);controls.update();}finishView();}
 function focus(kind,index=0){currentMode=kind;currentIndex=index;if(kind==='overview'){overview();return;}const point=kind==='basin'?new THREE.Vector3(0,.55,2.48):kind==='carving'?new THREE.Vector3(positions[index][0],.85,positions[index][2]):crystals[index].position.clone().add(new THREE.Vector3(0,.6,0));camera.position.copy(point).add(kind==='basin'?new THREE.Vector3(.65,.5,1.5):new THREE.Vector3(1.5,.7,1.9));camera.lookAt(point);camera.fov=closeFov(kind==='basin'?45:40);camera.updateProjectionMatrix();if(controls){controls.target.copy(point);controls.update();}finishView();}
 function pose(i,total=80){const a=i/total*Math.PI*2,r=6.2+.15*Math.sin(a*3);camera.position.set(Math.sin(a)*r,2.1+.18*Math.sin(a*2),Math.cos(a)*r);camera.lookAt(0,1.4,-.55);camera.fov=68;camera.updateMatrixWorld();camera.updateProjectionMatrix();render();const fy=innerHeight/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));return {index:i,position:camera.position.toArray(),target:[0,1.4,-.55],fov:camera.fov,width:innerWidth,height:innerHeight,intrinsics:{fx:fy,fy,cx:innerWidth/2,cy:innerHeight/2},matrixWorld:camera.matrixWorld.toArray()};}
 if(!capture){controls=new OrbitControls(camera,canvas);controls.enableDamping=false;controls.enablePan=true;controls.minDistance=.8;controls.maxDistance=13;controls.maxPolarAngle=1.54;controls.addEventListener('change',requestDraw);}
 overview();
 return {scene,camera,renderer,crystals,plinths,supports,basin,pose,focus,render,resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;if(currentMode==='overview')camera.fov=fitFov(58);else camera.fov=closeFov(currentMode==='basin'?45:40);camera.updateProjectionMatrix();finishView();},dispose(){cancelAnimationFrame(frame);controls?.dispose();const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(n=>{if(n.geometry)geometries.add(n.geometry);if(n.material)for(const m of Array.isArray(n.material)?n.material:[n.material])materials.add(m);});for(const m of materials){for(const v of Object.values(m))if(v?.isTexture)textures.add(v);m.dispose();}for(const g of geometries)g.dispose();for(const t of textures)t.dispose();renderer.dispose();renderer.forceContextLoss();env.dispose();gemEnvironment.dispose();pmrem.dispose();}};
}
