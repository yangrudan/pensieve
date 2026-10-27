import { OrbitControls } from '../../vendor/OrbitControls.js';
const room=window.sanctuary,canvas=document.querySelector('canvas');
const toolbar=document.createElement('div');toolbar.className='inspect-toolbar';toolbar.innerHTML='<strong>固定结构对照 · 五颗魔法石</strong><span>原生三维几何，可旋转与缩放；用于检查新重建输入，不是云端重建结果。</span><div><button data-view="0">正面</button><button data-view="18">左侧</button><button data-view="36">背面</button><button data-view="54">右侧</button></div><small role="status"></small>';document.body.append(toolbar);
const controls=new OrbitControls(room.camera,canvas);controls.target.set(0,1.5,0);controls.enablePan=false;controls.enableDamping=false;controls.minDistance=3;controls.maxDistance=9;controls.minPolarAngle=.35;controls.maxPolarAngle=1.65;
const crystals=[];room.scene.traverse(n=>{if(n.name.startsWith('memory-crystal-'))crystals.push({id:n.name,position:n.position.toArray()});});
window.inspection={crystals,kind:'source-mesh',variant:'v3'};canvas.dataset.crystalCount=String(crystals.length);canvas.dataset.source='mesh';
function draw(){room.renderer.render(room.scene,room.camera);canvas.dataset.rendered='true';}
controls.addEventListener('change',draw);
for(const button of toolbar.querySelectorAll('button'))button.onclick=()=>{room.pose(Number(button.dataset.view),72);controls.update();draw();};
addEventListener('resize',()=>{room.renderer.setSize(innerWidth,innerHeight);room.camera.aspect=innerWidth/innerHeight;room.camera.updateProjectionMatrix();draw();});
toolbar.querySelector('small').textContent=`${crystals.length} 颗固定水晶 · 拖动旋转 · 双指 / 滚轮缩放`;controls.update();draw();
addEventListener('pagehide',()=>{controls.dispose();room.renderer.dispose();});
