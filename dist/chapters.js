// One definition of the chapter order and labels, shared by every chapter page.
// The theme word is the primary label; the chapter's own name is the small print.
(()=>{
 const host=document.querySelector('nav[data-chapters]');if(!host)return;
 const here=location.pathname.replace(/index\.html$/,'');
 const chapters=[['/pensieve/','I','珍藏','冥想盆'],['/atlas/','II','归属','记忆大厅'],['/aha/','III','重逢','归燕']];
 host.append(...chapters.map(([href,mark,word,name])=>{
  const a=document.createElement('a'),b=document.createElement('b'),small=document.createElement('small');
  a.href=href;a.title=`第${mark}章 · ${name}`;b.textContent=mark;small.textContent=name;a.append(b,word,small);
  if(href===here)a.setAttribute('aria-current','page');return a;
 }));
})();
