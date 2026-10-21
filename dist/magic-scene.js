// Code-drawn scene effects: no remote assets, no generation calls.
export function createMagicScene({THREE, scene, camera, reduced}) {
  function glowTexture() {
    const c=document.createElement('canvas');c.width=c.height=128;
    const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);
    r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,'rgba(225,255,248,.8)');r.addColorStop(.42,'rgba(170,235,238,.18)');r.addColorStop(1,'rgba(140,230,240,0)');g.fillStyle=r;g.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(c);
  }
  const glow=glowTexture();
  function sprite(color,size,opacity=.5){const m=new THREE.SpriteMaterial({map:glow,color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending});const o=new THREE.Sprite(m);o.scale.set(size,size,1);scene.add(o);return o;}
  const candles=[];
  const wax=new THREE.MeshStandardMaterial({color:0xcab184,emissive:0x714b27,emissiveIntensity:.16,roughness:.85});
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2, radius=3.4+(i%3)*.45;
    const group=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.055,.065,.34+(i%3)*.08,12),wax);group.add(body);
    const flame=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),new THREE.MeshBasicMaterial({color:0xffdeb0}));flame.scale.y=2;flame.position.y=.24;group.add(flame);
    group.position.set((i%4-1.5)*1.8,3.2+Math.floor(i/4)*1.05+(i%2)*.2,-2.8-(i%3)*.25);scene.add(group);
    const halo=sprite(0xffc784,.65,.48);candles.push({group,halo,y:group.position.y,phase:i*1.7});
  }
  const warm=new THREE.PointLight(0xffc794,5,9);warm.position.set(-2,3,1);scene.add(warm);
  const runes=new THREE.Group();runes.position.y=1.98;scene.add(runes);
  for(let i=0;i<28;i++){
    const a=i/28*Math.PI*2,r=2.03;const points=[-.025,0,-.065,-.025,0,.065,-.025,0,.015,.04,0,-.035,-.025,0,-.025,.035,0,.04];
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    const line=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0x9bc8c5,transparent:true,opacity:.35,blending:THREE.AdditiveBlending}));line.position.set(Math.cos(a)*r,0,Math.sin(a)*r);line.rotation.y=-a;line.rotation.z=i%3*.3;runes.add(line);
  }
  const mist=[];
  for(let i=0;i<10;i++){const s=sprite(0x9acbd5,1.2,.045);mist.push({s,phase:i*.63});}
  const orb=sprite(0xdafff3,.32,0);orb.position.set(.65,3.7,.25);
  const orbCore=new THREE.Mesh(new THREE.SphereGeometry(.035,12,12),new THREE.MeshBasicMaterial({color:0xdcfff2}));orbCore.visible=false;scene.add(orbCore);
  const ribbons=[];
  for(let j=0;j<4;j++){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(120*3),3));const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:j%2?0x9be1e3:0xe4fff9,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(line);ribbons.push(line);}
  const n=220,points=new Float32Array(n*3),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(points,3));const dust=new THREE.Points(geometry,new THREE.PointsMaterial({map:glow,color:0xb9eee3,size:.09,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dust);
  return {
    update(t,{pourProgress=null,hasSelection=false,dive=0}){
      const motion=reduced?0:t;
      candles.forEach(({group,halo,y,phase})=>{group.position.y=y+Math.sin(motion*.65+phase)*.09;group.rotation.z=Math.sin(motion*.3+phase)*.035;halo.position.copy(group.position).add(new THREE.Vector3(0,.24,0));halo.material.opacity=.32+Math.sin(motion*3+phase)*.06;});
      runes.rotation.y=motion*.035;runes.position.y=1.98+Math.sin(motion*.4)*.015+dive*.25;
      const power=pourProgress===null?0:Math.sin(pourProgress*Math.PI);
      runes.children.forEach(r=>r.material.opacity=.22+power*.65+dive*.3);
      mist.forEach(({s,phase})=>{const a=phase+motion*.12;s.position.set(Math.cos(a)*1.3,2.06+Math.sin(a*2+motion*.3)*.07,Math.sin(a)*1.3);s.scale.set(1.1+Math.sin(a)*.18,.42,1);s.material.opacity=.055+power*.045+dive*.15;});
      orb.material.opacity=hasSelection?.75:0;orb.position.y=3.75+Math.sin(motion*1.6)*.05;orbCore.visible=hasSelection;orbCore.position.copy(orb.position);
      ribbons.forEach((line,j)=>{line.material.opacity=power*(j===0?.9:.45);const p=line.geometry.attributes.position.array;for(let i=0;i<120;i++){const q=i/119;const a=q*15-motion*3+j*1.7,r=.018+q*q*.22;p[i*3]=.65*(1-q)+Math.sin(a)*r;p[i*3+1]=3.75-q*1.88+Math.sin(a*2)*.015;p[i*3+2]=.25*(1-q)+Math.cos(a)*r;}line.geometry.attributes.position.needsUpdate=true;});
      for(let i=0;i<n;i++){const phase=i/n*Math.PI*2,a=phase+motion*.065;const radius=.6+(i%7)*.21;points[i*3]=Math.cos(a)*radius;points[i*3+1]=2.03+((i*.017+motion*.025)%1)*1.1;points[i*3+2]=Math.sin(a)*radius;}geometry.attributes.position.needsUpdate=true;dust.material.opacity=.3+power*.45+dive*.5;
    }
  };
}
