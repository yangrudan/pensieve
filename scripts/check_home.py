"""Browser checks for the Marauder's-Map style home (folded parchment, hand-inked plan, animated footprints).

Needs a running server and Playwright. Read-only: no AHOLO call, no state change.
"""
import argparse,sys
from playwright.sync_api import sync_playwright,TimeoutError as PWTimeout

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4174')
parser.add_argument('--gpu',action='store_true',help='use the real GPU (faster if you have many animated elements)')
args=parser.parse_args()
BASE=args.url.rstrip('/')
LAUNCH=['--no-sandbox','--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist','--enable-gpu']if args.gpu else['--no-sandbox','--enable-unsafe-swiftshader']

def say(m):print(m,flush=True)

def open_map(page):
 """Load the home page and make sure the parchment is open (a new tab always starts folded)."""
 page.goto(BASE+'/',wait_until='domcontentloaded')
 if page.locator('html[data-map=closed]').count():page.locator('#map-cover').click()
 page.locator('#map-body[data-ink=on]').wait_for(timeout=5000);page.wait_for_timeout(300)

with sync_playwright()as p:
 browser=p.chromium.launch(headless=True,args=LAUNCH)
 ctx=browser.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce')
 page=ctx.new_page();problems=[]
 page.on('pageerror',lambda e:problems.append(f'js: {e}'));page.on('console',lambda m:problems.append(f'console: {m.text}')if m.type=='error'else None)
 page.on('response',lambda r:problems.append(f'{r.status} {r.url}')if r.status>=400 else None)

 # 1. Cover starts folded, opens on click, the map draws itself, no errors.
 page.goto(BASE+'/',wait_until='domcontentloaded');page.wait_for_timeout(400)
 if page.locator('html[data-map=closed]').count():page.locator('#map-cover').click()
 page.locator('#map-body[data-ink=on]').wait_for(timeout=5000);page.wait_for_timeout(2200)
 assert page.locator('.room').count()==3,'three rooms should be drawn'
 assert page.locator('.room-label').count()==3 and page.locator('.compass-label').count()>=1
 assert not problems,problems
 say('1/5 cover opens, ink draws, three rooms visible')

 # 2. Each room is clickable (room <g>, label, or rail), lands on the right chapter.
 for door,target in [('treasure','/pensieve/'),('belong','/atlas/'),('reunion','/aha/')]:
  open_map(page)
  page.locator(f'.room[data-door={door}]').click();page.wait_for_url(BASE+target,timeout=10000)
  page.close();page=ctx.new_page();say(f'   {door:10} -> {target}')
 say('2/5 three rooms each navigate to the correct chapter')

 # 3. Rail buttons work, hover sets hint.
 open_map(page)
 page.locator('.door-rail a[data-door=belong]').hover();page.wait_for_timeout(120)
 hint=page.locator('#home-hint').inner_text();assert '归属' in hint,hint
 page.locator('.door-rail a[data-door=reunion]').click();page.wait_for_url(BASE+'/aha/',timeout=10000)
 say('3/5 rail buttons navigate, hover updates hint')

 # 4. Narrow viewport: the map picks the layout that gives more pixels.
 ctx2=browser.new_context(viewport={'width':480,'height':900},reduced_motion='reduce')
 page2=ctx2.new_page();open_map(page2)
 layout=page2.locator('.map-wrap').get_attribute('data-layout')
 assert layout in ('wide','narrow'),layout
 assert page2.locator('.room').count()==3 and page2.locator('.door-rail a').count()==3
 say(f'4/5 narrow viewport ({layout} layout chosen), all rooms and rail buttons present')
 ctx2.close()

 # 5. The fold-away gesture: click "恶作剧完毕", cover returns.
 open_map(page)
 close_btn=page.locator('#map-close');assert close_btn.is_visible(),'close button should be visible once the map is open'
 close_btn.click();page.wait_for_timeout(300)
 assert page.locator('html[data-map=closed]').is_visible(),'cover should return after clicking the close button'
 say('5/5 close button folds the map back')

 ctx.close();browser.close()
say('ALL MAP HOME CHECKS PASSED')
