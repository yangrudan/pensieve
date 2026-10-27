import {createDetailHall} from './scene.js?v=20261027-final';
const canvas=document.querySelector('canvas'),params=new URLSearchParams(location.search),capture=params.get('capture')==='1';
try{
 const hall=await createDetailHall(canvas,{capture});window.detailHall=hall;window.sceneReady=true;canvas.dataset.crystals=String(hall.crystals.length);canvas.dataset.plinths=String(hall.plinths.length);canvas.dataset.basins='1';
 let selected=0,mode='overview';
 const sync=()=>{document.querySelectorAll('button[data-gem]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.gem===selected)));document.querySelectorAll('button[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.focus===mode)));hall.focus(mode,selected);canvas.dataset.focus=mode;canvas.dataset.gem=String(selected);document.querySelector('.note').textContent='拖动环顾 · 滚轮 / 双指缩放 · 点击部位查看细节';};
 document.querySelectorAll('button[data-gem]').forEach(b=>b.onclick=()=>{selected=+b.dataset.gem;mode='crystal';sync();});document.querySelectorAll('button[data-focus]').forEach(b=>b.onclick=()=>{mode=b.dataset.focus;sync();});
 if(capture){document.querySelector('.panel').hidden=true;document.querySelector('.note').hidden=true;hall.pose(0);}else sync();
 addEventListener('resize',()=>hall.resize());addEventListener('pagehide',()=>hall.dispose());addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
}catch(e){document.querySelector('.note').textContent='场景暂未打开，请使用支持 WebGL 的浏览器重试。';throw e;}
