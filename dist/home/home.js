// Marauder's-Map style home: a folded parchment that opens onto a hand-inked plan of the three chapters.
// Everything is drawn here in SVG. There is no WebGL, no AHOLO call and no API request.
const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const root=document.documentElement,svg=$('#map-svg'),wrap=$('.map-wrap'),mapBody=$('#map-body'),cover=$('#map-cover'),hint=$('#home-hint'),closeBtn=$('#map-close'),stage=$('.stage'),foot=$('.stage-foot');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rail=[...document.querySelectorAll('.door-rail a')];
$('#about-open').onclick=()=>$('#about').showModal();$('#about-close').onclick=()=>$('#about').close();

const DOORS=[
 {id:'treasure',href:'/pensieve/',title:'珍藏',en:'I · 冥想盆',line:'把一张照片交给冥想盆'},
 {id:'belong',href:'/atlas/',title:'归属',en:'II · 记忆大厅',line:'让回忆在水晶里有处可归'},
 {id:'reunion',href:'/aha/',title:'重逢',en:'III · 归燕',line:'等一只燕子送回旧日'},
];
const IDLE_HINT='点一处房间，走进去。';

// ---- Small SVG helpers
const el=(name,attrs,parent,text)=>{const n=document.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs||{}))k.startsWith('--')?n.style.setProperty(k,v):n.setAttribute(k,v);if(text!=null)n.textContent=text;parent?.append(n);return n;};
const circle=(cx,cy,r)=>`M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0z`;
const rect=(x,y,w,h)=>`M${x},${y}h${w}v${h}h${-w}z`;
const octagon=(cx,cy,r)=>'M'+Array.from({length:8},(_,k)=>{const a=(k+.5)/8*Math.PI*2;return `${(cx+Math.cos(a)*r).toFixed(1)},${(cy+Math.sin(a)*r).toFixed(1)}`;}).join('L')+'z';

// Line drawings for the inside of each room, in a local frame about 120 units across, centred on 0,0.
const ART={
 treasure:'<circle r="50"/><circle r="42"/><circle r="27"/><circle r="13" stroke-dasharray="3 3"/><path d="M-10,-14C-20,-34 4,-40 -4,-58M6,-12C14,-32 -6,-44 8,-60M0,-8C-2,-26 14,-30 12,-46"/>',
 belong:'<path d="M0,-58L24,-14L0,48L-24,-14Z"/><path d="M-24,-14H24M0,-58V48" opacity=".6"/><path d="M-44,-12L-30,10L-44,40L-58,10ZM44,-12L58,10L44,40L30,10Z"/><path d="M-70,52H70"/>',
 reunion:'<path d="M-52,4C-30,-6 -6,-4 6,2C16,-18 34,-32 58,-34C46,-20 36,-8 30,6C34,16 40,26 52,36C34,32 24,26 16,16C4,18 -26,16 -52,4Z"/><path d="M-52,4L-62,-6M-52,4L-64,10"/><circle class="solid" cx="-36" cy="1" r="1.8"/>',
};

// Per-layout plan. For each room: `art`=[dy,scale], `name`/`en`=baseline offsets from the room centre.
const PLANS={
 wide:{W:1200,H:760,
  rooms:[
   {id:'treasure',d:circle(205,430,130),cx:205,cy:430,art:[-34,1],name:66,en:94},
   {id:'belong',d:rect(445,250,310,340),cx:600,cy:420,art:[-70,1.25],name:70,en:100},
   {id:'reunion',d:octagon(995,430,140),cx:995,cy:430,art:[-34,1],name:66,en:94},
  ],
  walls:[[335,412,445,412],[335,448,445,448],[755,412,866,412],[755,448,866,448]],
  ghosts:[],
  trails:['M335,430L445,430','M755,430L866,430','M205,560C205,620 160,652 126,676','M600,590C600,640 580,668 560,684','M995,570C995,630 1040,660 1062,694','M126,676C260,650 360,716 560,684S860,650 1062,694'],
  compass:[104,676,34],credit:[600,722]},
 narrow:{W:600,H:860,
  rooms:[
   {id:'treasure',d:circle(300,235,90),cx:300,cy:235,art:[-26,.62],name:36,en:60},
   {id:'belong',d:rect(172,385,256,160),cx:300,cy:465,art:[-36,.6],name:30,en:56},
   {id:'reunion',d:octagon(300,702,92),cx:300,cy:702,art:[-28,.6],name:36,en:60},
  ],
  walls:[[286,325,286,385],[314,325,314,385],[286,545,286,616],[314,545,314,616]],
  ghosts:[],
  trails:['M300,325L300,385','M300,545L300,610','M70,300C90,380 130,420 110,520S70,640 120,740','M530,260C520,350 480,420 500,520S530,640 480,760'],
  compass:[536,812,26],credit:null},
};
// ---- Build the map. Pick whichever layout (wide or narrow) uses more pixels, so the larger one wins.
function pickPlan(){const avail={w:stage.offsetWidth*.94,h:stage.offsetHeight-foot.offsetHeight-40};const wide={w:Math.min(avail.w,avail.h*PLANS.wide.W/PLANS.wide.H),h:Math.min(avail.h,avail.w*PLANS.wide.H/PLANS.wide.W)},narrow={w:Math.min(avail.w,avail.h*PLANS.narrow.W/PLANS.narrow.H),h:Math.min(avail.h,avail.w*PLANS.narrow.H/PLANS.narrow.W)};return wide.w*wide.h>narrow.w*narrow.h?['wide',PLANS.wide,wide]:['narrow',PLANS.narrow,narrow];}
const[mode,plan,dims]=pickPlan();wrap.dataset.layout=mode;wrap.style.width=dims.w+'px';wrap.style.height=dims.h+'px';
svg.setAttribute('viewBox',`0 0 ${plan.W} ${plan.H}`);

// Outer ring + faint star as the compass.
const cmp=el('g',{'class':'compass-ring ink-in','--d':.8},svg);el('circle',{cx:plan.compass[0],cy:plan.compass[1],r:plan.compass[2]},cmp);
const star=el('g',{'class':'compass-star'},cmp);for(let k=0;k<4;k++){const a=k/4*Math.PI*2,r=plan.compass[2]-6,x=plan.compass[0]+Math.cos(a)*r,y=plan.compass[1]+Math.sin(a)*r;el('circle',{cx:x,cy:y,r:.9,opacity:.55},star);}
el('text',{'class':'compass-label',x:plan.compass[0],y:plan.compass[1]+6},cmp,'N');

// Ghost rooms (the windows at the top, for balance).
for(const p of plan.ghosts)el('path',{'class':'rim outer ink-in',d:p,'--d':1},svg);

// Connecting trails: these exist even where there's no corridor (the walker crosses open ground).
for(const[i,t]of plan.trails.entries())el('path',{'class':'trail ink-in',d:t,'--d':1.8+i*.15},svg);

// Corridor walls (only where rooms are physically near each other).
for(const[i,w]of plan.walls.entries())el('line',{'class':'wall ink-in',x1:w[0],y1:w[1],x2:w[2],y2:w[3],'--d':1.6+i*.1},svg);

// Rooms: each has a clickable fill that shows its art on hover, and a frame that draws itself at map-open.
let delaySeq=0;
for(const rm of plan.rooms){
 const door=DOORS.find(d=>d.id===rm.id),g=el('g',{'class':'room','data-door':rm.id,'--d':delaySeq++},svg);
 el('path',{'class':'room-fill',d:rm.d},g);
 el('path',{'class':'room-frame',d:rm.d,pathLength:1},g);
 if(plan.walls.some(w=>Math.hypot(w[0]-rm.cx,w[1]-rm.cy)<50||Math.hypot(w[2]-rm.cx,w[3]-rm.cy)<50))for(const w of plan.walls)if(Math.hypot(w[0]-rm.cx,w[1]-rm.cy)<50||Math.hypot(w[2]-rm.cx,w[3]-rm.cy)<50)el('line',{'class':'room-wall',x1:w[0],y1:w[1],x2:w[2],y2:w[3]},g);
 const artG=el('g',{'class':'room-art ink-in','--d':delaySeq+.6,transform:`translate(${rm.cx},${rm.cy+rm.art[0]}) scale(${rm.art[1]})`},svg);artG.innerHTML=ART[rm.id];
 el('text',{'class':'room-label ink-in',x:rm.cx,y:rm.cy+rm.name,'--d':delaySeq+1.2},svg,door.title);
 el('text',{'class':'room-label-en ink-in',x:rm.cx,y:rm.cy+rm.en,'--d':delaySeq+1.35},svg,door.en);
 g.setAttribute('href',door.href);g.setAttribute('role','link');g.setAttribute('aria-label',`${door.title}：${door.line}`);
 g.addEventListener('click',enterRoom);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterRoom.call(g,e);}});
 g.addEventListener('mouseenter',()=>setActive(rm.id));g.addEventListener('mouseleave',()=>setActive(null));
 g.addEventListener('focus',()=>setActive(rm.id));g.addEventListener('blur',()=>setActive(null));
}
// Faint rim around the halls.
el('path',{'class':'rim ink-in',d:plan.rooms[1].d,'--d':delaySeq+.3},svg);

// Each trail path gains a few footprints that appear and fade in a wave, so something unseen seems to walk the corridor.
const SOLE='M0,-4.6C2.4,-4.6 3.2,-2 2.6,.6C2.2,2.2 1.2,3 0,3C-1.2,3 -2.2,2.2 -2.6,.6C-3.2,-2 -2.4,-4.6 0,-4.6zM0,4.4a1.9,1.9 0 1,0 .01 0z';
for(const[trailIdx,t]of plan.trails.entries()){
 const path=el('path',{d:t,fill:'none'},svg),len=path.getTotalLength(),count=Math.max(2,Math.floor(len/38));
 for(let i=0;i<count;i++){
  const at=(i+.5)/count*len,pt=path.getPointAtLength(at),ahead=path.getPointAtLength(Math.min(len,at+2)),back=path.getPointAtLength(Math.max(0,at-2));
  const ang=Math.atan2(ahead.y-back.y,ahead.x-back.x),side=i%2?1:-1,ox=-Math.sin(ang)*side*5,oy=Math.cos(ang)*side*5;
  el('path',{'class':'print',d:SOLE,transform:`translate(${(pt.x+ox).toFixed(1)},${(pt.y+oy).toFixed(1)}) rotate(${(ang*180/Math.PI+90).toFixed(1)}) scale(1.5)`,style:`animation-delay:${(trailIdx*1.3+i*.42).toFixed(2)}s`},svg);
 }
 path.remove();
}

if(plan.credit){el('text',{'class':'compass-label ink-in',x:plan.credit[0],y:plan.credit[1],'--d':delaySeq+1.8,style:'text-anchor:middle;font-size:10px;opacity:.5'},svg,'记 忆 之 处');}

// ---- Open / close cover
const STORE_KEY='pensieve-map';
let folded=!sessionStorage.getItem(STORE_KEY);if(root.classList.contains('folded'))folded=true;
if(folded){root.dataset.map='closed';hint.textContent='看上去只是一张旧羊皮纸。';}else{root.dataset.map='open';open();}

cover.addEventListener('click',()=>{if(!folded)return;folded=false;sessionStorage.setItem(STORE_KEY,'1');root.dataset.map='opening';open();setTimeout(()=>{root.dataset.map='open';mapBody.focus();},reduced?10:1600);});
closeBtn.addEventListener('click',()=>{if(folded)return;folded=true;sessionStorage.removeItem(STORE_KEY);mapBody.dataset.ink='off';root.dataset.map='closed';closeBtn.hidden=true;hint.textContent='看上去只是一张旧羊皮纸。';});

function open(){mapBody.dataset.ink='on';closeBtn.hidden=false;hint.textContent=IDLE_HINT;mapBody.style.setProperty('--ink-start',(reduced?.05:.8)+'s');}

// ---- Room highlight (shared by the three rooms, the floor rail, and also focus events).
let active=null;
function setActive(id){active=id;for(const g of svg.querySelectorAll('.room'))g.dataset.active=String(g.dataset.door===id);for(const a of rail)a.dataset.active=String(a.dataset.door===id);if(id){const door=DOORS.find(d=>d.id===id);hint.textContent=door?.title+' · '+door?.line;}else{hint.textContent=IDLE_HINT;}}
for(const a of rail){a.addEventListener('mouseenter',()=>setActive(a.dataset.door));a.addEventListener('mouseleave',()=>setActive(null));a.addEventListener('focus',()=>setActive(a.dataset.door));a.addEventListener('blur',()=>setActive(null));}

// ---- Navigation
let leaving=false;const veil=Object.assign(document.createElement('div'),{className:'leave-veil'});document.body.append(veil);
function enterRoom(e){if(leaving)return;if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0&&e.type==='click')return;e.preventDefault();leaving=true;document.body.classList.add('is-leaving');const href=this.getAttribute('href');setTimeout(()=>{location.href=href;},reduced?10:900);}
for(const a of rail)a.addEventListener('click',enterRoom);
addEventListener('pageshow',e=>{if(e.persisted){leaving=false;document.body.classList.remove('is-leaving');}});

// ---- A faint lantern that follows the pointer (only when the map is open).
const wand=$('.wand');
wrap.addEventListener('pointermove',e=>{if(folded||e.pointerType!=='mouse')return;wand.style.left=e.clientX+'px';wand.style.top=e.clientY+'px';wand.style.opacity='1';});
wrap.addEventListener('pointerleave',()=>{wand.style.opacity='0';});

// ---- Floating dust motes
if(!reduced){const motes=$('#motes');for(let i=0;i<16;i++){const m=document.createElement('i');m.style.left=Math.random()*100+'%';m.style.setProperty('--dx',`${Math.random()*80-40}px`);m.style.animationDelay=`${Math.random()*9}s`;m.style.animationDuration=`${10+Math.random()*5}s`;motes.append(m);}}

