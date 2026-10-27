export function bestView(memory){
 if(memory?.case==='stone-hall-multiview-v3')return {eye:[-4.6,0,1.8],yaw:0,pitch:-.4,fov:80,hint:'已定位大厅总览 · 五颗水晶与一个水池 · 拖动环顾，方向键微移'};
 if(memory?.case==='stone-hall-multiview-v1')return toward([26,12,20],[-1,-22,-1],65,'已展示重建全貌。模型本身存在拉伸，视角调整无法修复。');
 if(memory?.case==='stone-hall-multiview-v2')return toward([14,-4,10],[0,14,0],65,'已展示重建全貌。模型本身残缺，无法恢复成完整大厅。');
 if(memory?.case==='stone-hall-reference-v1')return {eye:[0,0,.15],yaw:Math.PI-.1,pitch:-.08,fov:78,hint:'已定位到水池与魔法石前方 · 拖动可以环顾'};
 return {eye:[0,0,0],yaw:Math.PI,pitch:0,fov:70,hint:'已回到空间的初始观察位置'};
}
function toward(eye,target,fov,hint){const d=target.map((v,i)=>v-eye[i]);return {eye,yaw:Math.atan2(d[1],d[0]),pitch:Math.atan2(d[2],Math.hypot(d[0],d[1])),fov,hint};}
// Preserve the horizontal coverage of the checked landscape overview on narrow screens.
export function overviewFov(baseFov,aspect){
 return Math.min(130,2*Math.atan(Math.tan(baseFov*Math.PI/360)*Math.max(1,1.5/Math.max(aspect,.35)))*180/Math.PI);
}
export function renderScale(width,height,dpr,moving=false,detail=false){
 const density=Math.max(1,dpr),area=Math.max(1,width*height);
 if(detail&&!moving)return Math.min(density,2,Math.sqrt(4000000/area))/density;
 const budget=moving?420000:850000;
 return Math.min(moving?.7:1,Math.sqrt(budget/area))/density;
}
