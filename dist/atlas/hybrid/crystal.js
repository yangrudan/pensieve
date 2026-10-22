import * as THREE from '../../vendor/three.module.js';

export const CRYSTAL_SHAPES=['quartz','cluster','diamond','heart','ice'];
const PLACE_SHAPES={home:'quartz',work:'cluster',journey:'diamond',garden:'heart',hometown:'ice'};
export function crystalShapeForPlace(id){
 if(PLACE_SHAPES[id])return PLACE_SHAPES[id];
 let hash=0;for(const char of String(id))hash=(hash*31+char.charCodeAt(0))>>>0;
 return CRYSTAL_SHAPES[hash%CRYSTAL_SHAPES.length];
}

// Separate vertices preserve the cut faces. Counter-clockwise winding points
// out of the solid, so Fresnel reflection and refraction use the outside normal.
export function createCrystalGeometry(shape='quartz'){
 if(shape==='heart'){
  const outline=new THREE.Shape();
  const points=[[0,1.5],[-.27,1.83],[-.62,1.78],[-.83,1.45],[-.76,1.06],[0,.05],[.76,1.06],[.83,1.45],[.62,1.78],[.27,1.83]];
  outline.moveTo(...points[0]);for(const point of points.slice(1))outline.lineTo(...point);outline.closePath();
  const geometry=new THREE.ExtrudeGeometry(outline,{depth:.36,bevelEnabled:true,bevelSize:.07,bevelThickness:.06,bevelSegments:1,steps:1});
  geometry.translate(0,0,-.18);geometry.computeVertexNormals();return geometry;
 }
 const sides=shape==='diamond'||shape==='ice'?8:6;
 const profile=shape==='diamond'?[[.12,.16],[.62,.62],[.86,.68],[1.00,.65],[1.53,.35],[1.58,.32]]:shape==='ice'?[[.18,.11],[.6,.31],[1.5,.31],[1.9,.09]]:[[.05,.43],[.15,.45],[1.12,.5],[1.23,.43],[1.8,.08]];
 const corners=[],vertices=[];
 for(let i=0;i<sides;i++){
  const a=i*Math.PI*2/sides;
  corners.push(new THREE.Vector3(Math.sin(a),0,Math.cos(a)));
 }
 // Thin bevels give the edges a distinct reflection instead of painting a glow.
 const contour=[];
 for(let i=0;i<sides;i++){
  contour.push(corners[i].clone().lerp(corners[(i+sides-1)%sides],.085),corners[i].clone().lerp(corners[(i+1)%sides],.085));
 }
 const rings=profile.map(([y,r])=>contour.map(p=>new THREE.Vector3(p.x*r,y,p.z*r)));
 const top=new THREE.Vector3(shape==='quartz'?.02:0,shape==='diamond'?1.58:shape==='ice'?2.12:1.92,shape==='quartz'?-.02:0),bottom=new THREE.Vector3(0,shape==='ice'?-.16:shape==='diamond'?-.08:-.2,0),count=contour.length;
 const tri=(a,b,c)=>vertices.push(...a.toArray(),...c.toArray(),...b.toArray());
 for(let row=0;row<rings.length-1;row++)for(let i=0;i<count;i++){
  const next=(i+1)%count,a=rings[row][i],b=rings[row+1][i],c=rings[row][next],d=rings[row+1][next];
  tri(a,b,c);tri(b,d,c);
 }
 for(let i=0;i<count;i++){const next=(i+1)%count;tri(rings.at(-1)[i],top,rings.at(-1)[next]);tri(rings[0][next],bottom,rings[0][i]);}
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.computeVertexNormals();
 return geometry;
}

// A small, shared HDR reflection rig supplies recognizable light reflections
// even when the cached room panorama is soft. It is never drawn as a backdrop.
export function createCrystalEnvironment(renderer){
 const width=512,height=256,data=new Float32Array(width*height*4);
 const boxes=[
  [.14,.39,.022,.23, [2.0,2.8,3.2]],
  [.40,.30,.07,.045,[3.2,2.8,2.0]],
  [.63,.44,.018,.22,[2.1,2.8,3.5]],
  [.86,.24,.055,.035,[3.0,2.8,2.4]],
 ];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const u=x/width,v=y/height,n=(y*width+x)*4;
  const sky=Math.max(0,1-v*1.4);
  data[n]=.025+sky*.10;data[n+1]=.035+sky*.14;data[n+2]=.055+sky*.21;data[n+3]=1;
  for(const [cx,cy,rx,ry,color] of boxes){
   const dx=Math.min(Math.abs(u-cx),1-Math.abs(u-cx))/rx,dy=Math.abs(v-cy)/ry;
   const strength=Math.exp(-2.5*(dx*dx+dy*dy));
   for(let k=0;k<3;k++)data[n+k]+=color[k]*strength;
  }
 }
 const texture=new THREE.DataTexture(data,width,height,THREE.RGBAFormat,THREE.FloatType);
 texture.mapping=THREE.EquirectangularReflectionMapping;texture.needsUpdate=true;
 const generator=new THREE.PMREMGenerator(renderer),target=generator.fromEquirectangular(texture);
 texture.dispose();generator.dispose();return target;
}

export function createCrystalMaterial(color,environment){
 const tint=new THREE.Color(color);
 return new THREE.MeshPhysicalMaterial({
  color:tint.clone().lerp(new THREE.Color('white'),.12),
  metalness:0,roughness:.045,
  transmission:.84,thickness:.85,ior:1.7,
  attenuationColor:tint,attenuationDistance:1.5,
  clearcoat:1,clearcoatRoughness:.025,
  specularIntensity:1,envMap:environment,envMapIntensity:1.0,
  dispersion:.06,
 });
}

function cutCrystal(color,environment,geometry,shape='quartz'){
 const group=new THREE.Group(),shell=new THREE.Mesh(geometry,createCrystalMaterial(color,environment));
 shell.castShadow=false;group.add(shell);
 // An inset cut core gives the refraction a colored structure to reveal.
 // This is an artistic layered gem, not a caustic / multi-bounce ray tracer.
 const coreMaterial=new THREE.MeshPhysicalMaterial({color:new THREE.Color(color).offsetHSL(0,.12,-.16),metalness:.08,roughness:.13,clearcoat:1,clearcoatRoughness:.04,envMap:environment,envMapIntensity:.7});
 const core=new THREE.Mesh(geometry,coreMaterial);core.scale.set(.57,.8,.57);core.position.y=.16;core.rotation.y=shape==='heart'?0:Math.PI/6;core.castShadow=false;group.add(core);
 return group;
}

export function createCrystal(color,environment,geometry,shape='quartz'){
 const group=new THREE.Group();group.userData.shape=shape;group.userData.source='procedural-mesh';
 const main=cutCrystal(color,environment,geometry,shape);group.add(main);
 if(shape==='cluster'){
  main.scale.set(.7,1,.7);
  const left=cutCrystal(color,environment,geometry);left.scale.set(.5,.66,.5);left.position.set(-.43,.0,.03);left.rotation.z=.26;left.rotation.y=.3;group.add(left);
  const right=cutCrystal(color,environment,geometry);right.scale.set(.42,.5,.42);right.position.set(.4,.01,.15);right.rotation.z=-.3;right.rotation.y=-.2;group.add(right);
 }
 return group;
}
