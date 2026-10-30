"""Browser integration checks for the hybrid hall.

Requires a local server and Playwright. Tag writes are intercepted in the
browser and use fixture data; user memories and provider quotas are unchanged.
"""
import json,io,time
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4174');args=parser.parse_args()
BASE=args.url.rstrip('/');out=Path(__file__).resolve().parents[1]/'.local/evidence/hybrid';out.mkdir(parents=True,exist_ok=True)
fixture={'places':[{'id':'home','name':'家','color':'#8fc6ab'},{'id':'work','name':'工作室','color':'#ab8fc6'},{'id':'journey','name':'旅途中','color':'#c6b48f'},{'id':'garden','name':'花园','color':'#c68f9d'},{'id':'hometown','name':'故乡','color':'#8fb4c6'}],'assignments':{'fixture-memory':['work']},'archives':[{'id':'fixture-memory','name':'测试记忆','photo_url':'/assets/stone-hall-daylight-reference.jpg','mode':'photo','status':'photo'}]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader']);page=b.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1,reduced_motion='reduce');errors=[];posts=[];panos=[];splats=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 crystal_glbs=[]
 page.on('request',lambda r:panos.append(r.url) if r.url.endswith('/panorama.jpg') else splats.append(r.url) if r.url.endswith('/space.spz') else crystal_glbs.append(r.url) if '/crystal-models/' in r.url else None)
 def atlas(route):
  if route.request.method=='POST':
   data=route.request.post_data_json;assert data['action']=='tag';assert data['memory_id']=='fixture-memory';posts.append(data);fixture['assignments'][data['memory_id']]=data['place_ids']
  route.fulfill(json=fixture)
 page.route('**/api/atlas',atlas);page.route('**/api/memories',lambda r:r.fulfill(json={'items':[],'attempts':11,'limit':40}))
 page.goto(BASE+'/atlas/',wait_until='domcontentloaded');page.wait_for_function('document.querySelector("#atlas-scene").dataset.aholoEnvironment==="moon"',timeout=60000);page.locator('#atlas-scene[data-ready=true][data-rendered=true]').wait_for(timeout=30000);page.wait_for_timeout(1200)
 assert page.locator('.stone-label').count()==5;assert page.locator('#atlas-scene').get_attribute('data-stone-count')=='5'
 first=int(page.locator('#atlas-scene').get_attribute('data-frame-count'));page.wait_for_timeout(900);last=int(page.locator('#atlas-scene').get_attribute('data-frame-count'));assert last-first<=2,(first,last)
 assert not posts;assert not splats
 # Click actual crystal pixels, avoiding the HTML labels, to exercise mesh raycasting.
 im=Image.open(io.BytesIO(page.screenshot())).convert('RGB');pixels=im.load();coords=[]
 for y in range(300,510,2):
  for x in range(145,330,2):
   r,g,blue=pixels[x,y]
   if g>r*1.25 and blue>r*1.1 and g>70 and g>blue*1.03:coords.append((x,y))
 assert len(coords)>100
 x=sum(a for a,_ in coords)/len(coords);y=sum(a for _,a in coords)/len(coords);page.mouse.click(x,y)
 page.locator('#place-panel').wait_for(state='visible');assert page.locator('#place-panel').get_attribute('data-place-id')=='home';assert page.locator('.empty-memory').count()==1
 page.locator('#hall-add-memory').click();page.locator('#hall-assign-list input').wait_for();page.locator('#hall-assign-list input').check();page.locator('#hall-save-assign').click();page.locator('#hall-assign').wait_for(state='hidden');page.locator('.memory-card').wait_for();assert set(fixture['assignments']['fixture-memory'])=={'home','work'}
 page.locator('.memory-card').click();page.locator('#memory-dialog').wait_for(state='visible');assert page.locator('#viewer-content img').get_attribute('src')=='/assets/stone-hall-daylight-reference.jpg';page.locator('#close-memory').click()
 page.locator('#hall-add-memory').click();page.locator('#hall-assign-list input').wait_for();page.locator('#hall-assign-list input').uncheck();page.locator('#hall-save-assign').click();page.locator('#hall-assign').wait_for(state='hidden');page.locator('.empty-memory').wait_for();assert fixture['assignments']['fixture-memory']==['work']
 # The Lux3D viewer is opt-in: the hall never fetched a crystal GLB, and opening one loads exactly one.
 assert not crystal_glbs,crystal_glbs
 page.locator('#open-lux').click();page.locator('#lux-dialog').wait_for(state='visible');page.wait_for_function('document.querySelector("#lux-content").dataset.loaded==="true"',timeout=90000)
 assert len(crystal_glbs)==1 and page.locator('#lux-title').inner_text().startswith('家');page.locator('#close-lux').click();page.wait_for_function('document.querySelectorAll("#lux-content canvas").length===0',timeout=3000)
 page.locator('#close-place').click();page.locator('#hall-mood').click();page.wait_for_function('document.querySelector("#atlas-scene").dataset.aholoEnvironment==="day"',timeout=60000);page.locator('#hall-mood').click();page.wait_for_function('document.querySelector("#atlas-scene").dataset.aholoEnvironment==="moon"');assert len(panos)==2,panos;assert not splats
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(800)
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('.stone-label:not([hidden])').count()==5
 positions=page.locator('.stone-label').evaluate_all('(es)=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}))');assert all(200<v['y']<550 for v in positions),positions
 page.screenshot(path=str(out/'mobile-verified.png'));page.locator('#place-rail button').first.click();assert page.locator('.hall-tools').is_hidden();page.screenshot(path=str(out/'mobile-place-verified.png'));assert not errors,errors
 assert len(posts)==2
 print({'mesh_click':True,'add_and_remove_memory_preserves_other_place':True,'idle_frame_delta':last-first,'panorama_fetches':len(panos),'SPZ_fetches':len(splats),'visible_mobile_labels':len(positions),'errors':errors},flush=True)
 # The old URL must forward to the single hall page, and the island overview must be gone.
 page.goto(BASE+'/atlas/hybrid/',wait_until='domcontentloaded');page.wait_for_url(BASE+'/atlas/');page.wait_for_function('document.querySelectorAll(".stone-label").length===5')
 links=page.locator('.chapters a').evaluate_all('(es)=>es.map(e=>[e.getAttribute("href"),e.getAttribute("aria-current")])');assert links==[['/pensieve/',None],['/atlas/','page'],['/aha/',None]],links;assert page.locator('.hall-tools a[href="/atlas/lab/"]').count()==1;assert page.locator('.chapters').inner_text().replace('\n','')[:8]!=''
 assert page.locator('#overview').inner_text().strip()=='回到水池前';assert '俯瞰' not in page.content();assert not errors,errors
 print('Legacy /atlas/hybrid/ forwards to the hall; no island overview; no real memory data changed.',flush=True);b.close()
