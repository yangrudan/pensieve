// A small "back to the map" link for every page below the home page. One definition, injected by script,
// so each page only needs a single <script> tag. Skipped in iframes and in screenshot/embed modes.
(()=>{
 const q=new URLSearchParams(location.search);
 if(location.pathname==='/'||window.top!==window||q.get('embed')==='1'||q.get('capture')==='1'||document.querySelector('.home-link'))return;
 const css=document.createElement('style');
 css.textContent=`.home-link{position:fixed;left:14px;bottom:14px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:8px 15px 8px 12px;border-radius:20px;text-decoration:none;color:#33210f;font:15px/1 'Ma Shan Zheng','AR PL UKai CN','KaiTi','STKaiti','Noto Serif SC',serif;letter-spacing:.18em;background:radial-gradient(ellipse at 40% 30%,#efddae,#d8bb85);border:1px solid #6b4a1f88;box-shadow:0 6px 20px #000a,inset 0 0 12px #8a5a2a66;transition:transform .2s,box-shadow .2s,filter .2s}
.home-link i{font-style:normal;font-size:13px;color:#7d2b1f}
.home-link:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 10px 26px #000c,inset 0 0 12px #8a5a2a66}
.home-link:focus-visible{outline:2px solid #e3c98f;outline-offset:3px}
@media(max-width:560px){.home-link{left:10px;bottom:10px;padding:7px 12px 7px 10px;font-size:14px}}
@media print{.home-link{display:none}}
@media(prefers-reduced-motion:reduce){.home-link{transition:none}}`;
 const a=document.createElement('a');
 a.className='home-link';a.href='/';a.setAttribute('aria-label','回到主页（旧日巡游图）');a.title='回到主页';
 a.innerHTML='<i aria-hidden="true">✧</i>回到地图';
 const mount=()=>{document.head.append(css);document.body.append(a);};
 document.body?mount():document.addEventListener('DOMContentLoaded',mount,{once:true});
})();
