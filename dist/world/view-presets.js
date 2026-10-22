export function bestView(memory){
 if(memory?.case==='stone-hall-multiview-v1')return toward([26,12,20],[-1,-22,-1],65,'已展示重建全貌。模型本身存在拉伸，视角调整无法修复。');
 if(memory?.case==='stone-hall-multiview-v2')return toward([14,-4,10],[0,14,0],65,'已展示重建全貌。模型本身残缺，无法恢复成完整大厅。');
 if(memory?.case==='stone-hall-reference-v1')return {eye:[0,0,.15],yaw:Math.PI-.1,pitch:-.08,fov:78,hint:'已定位到水池与魔法石前方 · 拖动可以环顾'};
 return {eye:[0,0,0],yaw:Math.PI,pitch:0,fov:70,hint:'已回到空间的初始观察位置'};
}
function toward(eye,target,fov,hint){const d=target.map((v,i)=>v-eye[i]);return {eye,yaw:Math.atan2(d[1],d[0]),pitch:Math.atan2(d[2],Math.hypot(d[0],d[1])),fov,hint};}
export function renderScale(width,height,dpr,moving=false){
 const budget=moving?420000:850000;
 return Math.min(moving?.7:1,Math.sqrt(budget/Math.max(1,width*height)))/Math.max(1,dpr);
}
