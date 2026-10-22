import * as THREE from '../../vendor/three.module.js';

// Separate vertices preserve the cut faces. Counter-clockwise winding points
// out of the solid, so Fresnel reflection and refraction use the outside normal.
export function createCrystalGeometry(){
 const corners=[],vertices=[];
 for(let i=0;i<6;i++){
  const a=i*Math.PI/3;
  corners.push(new THREE.Vector3(Math.sin(a),0,Math.cos(a)));
 }
 // Thin bevels give the edges a distinct reflection instead of painting a glow.
 const contour=[];
 for(let i=0;i<6;i++){
  contour.push(corners[i].clone().lerp(corners[(i+5)%6],.085),corners[i].clone().lerp(corners[(i+1)%6],.085));
 }
 const rings=[[.05,.43],[.15,.45],[1.12,.5],[1.23,.43],[1.8,.08]].map(([y,r])=>contour.map(p=>new THREE.Vector3(p.x*r,y,p.z*r)));
 const top=new THREE.Vector3(.02,1.92,-.02),bottom=new THREE.Vector3(0,-.2,0);
 const tri=(a,b,c)=>vertices.push(...a.toArray(),...c.toArray(),...b.toArray());
 for(let row=0;row<rings.length-1;row++)for(let i=0;i<12;i++){
  const next=(i+1)%12,a=rings[row][i],b=rings[row+1][i],c=rings[row][next],d=rings[row+1][next];
  tri(a,b,c);tri(b,d,c);
 }
 for(let i=0;i<12;i++){const next=(i+1)%12;tri(rings.at(-1)[i],top,rings.at(-1)[next]);tri(rings[0][next],bottom,rings[0][i]);}
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

export function createCrystal(color,environment,geometry){
 const group=new THREE.Group(),shell=new THREE.Mesh(geometry,createCrystalMaterial(color,environment));
 shell.castShadow=false;group.add(shell);
 // An inset cut core gives the refraction a colored structure to reveal.
 // This is an artistic layered gem, not a caustic / multi-bounce ray tracer.
 const coreMaterial=new THREE.MeshPhysicalMaterial({color:new THREE.Color(color).offsetHSL(0,.12,-.16),metalness:.08,roughness:.13,clearcoat:1,clearcoatRoughness:.04,envMap:environment,envMapIntensity:.7});
 const core=new THREE.Mesh(geometry,coreMaterial);core.scale.set(.57,.8,.57);core.position.y=.16;core.rotation.y=Math.PI/6;core.castShadow=false;group.add(core);
 return group;
}
