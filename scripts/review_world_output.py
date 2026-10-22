"""Capture cached World output from several positions for human review.

Read-only: never creates or resumes an AHOLO task. A capture completing is NOT a
visual quality pass. Inspect the images before updating the quality review.
"""
import argparse,json,time,urllib.request
from pathlib import Path
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--case',required=True)
parser.add_argument('--url',default='http://127.0.0.1:4174')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
base=args.url.rstrip('/')
with urllib.request.urlopen(base+'/api/experiments',timeout=20) as response:
    record=next((x for x in json.load(response)['items'] if x['case']==args.case),None)
if not record or record['status']!='ready':
    raise SystemExit('Output is not ready. No generation request was made.')
folder=root/'.local/world-lab'/record['case']/'review'
folder.mkdir(parents=True,exist_ok=True)
report={'case':record['case'],'id':record['id'],'world_id':record.get('world_id'),
        'visual_quality':'not_automatically_assessed','views':[],'errors':[]}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1280,'height':850},device_scale_factor=1,reduced_motion='reduce')
    page.on('pageerror',lambda error:report['errors'].append(str(error)))
    page.goto(base+'/world/?id='+record['id']+'&experiment=1&embed=1',wait_until='domcontentloaded')
    page.locator('#space[data-loaded=true]').wait_for(timeout=120000)
    page.locator('#waiting').wait_for(state='hidden',timeout=30000)
    space=page.locator('#space')
    def capture(name):
        page.wait_for_timeout(900)
        space.screenshot(path=str(folder/(name+'.png')))
        report['views'].append({'name':name,'eye':json.loads(space.get_attribute('data-eye')),'yaw':float(space.get_attribute('data-yaw'))})
        print('Captured',name,flush=True)
    def reset():
        page.locator('#best-view').click();page.locator('#best-view').blur()
    def move(key,steps):
        for _ in range(steps):page.keyboard.press(key)
    capture('front')
    move('ArrowLeft',6);capture('left-0.6')
    reset();move('ArrowRight',6);capture('right-0.6')
    reset();move('ArrowUp',6);capture('forward-0.6')
    reset();page.mouse.move(180,425);page.mouse.down();page.mouse.move(965,425,steps=20);page.mouse.up();capture('back')
    report['canvas']=page.locator('#space canvas').evaluate('(c)=>({width:c.width,height:c.height})')
    browser.close()
with urllib.request.urlopen(base+record['photo_url'],timeout=20) as response:
    (folder/'input.jpg').write_bytes(response.read())
images=[('INPUT (not the output)','input.jpg')]+[(v['name'],v['name']+'.png') for v in report['views']]
sheet=Image.new('RGB',(1536,900),'#091318');draw=ImageDraw.Draw(sheet)
for i,(label,file) in enumerate(images):
    with Image.open(folder/file) as image:
        image.thumbnail((512,410));x=i%3*512;y=i//3*450
        sheet.paste(image,(x+(512-image.width)//2,y));draw.text((x+12,y+420),label,fill='#e1dbc6')
sheet.save(folder/'contact-sheet.jpg',quality=95)
(folder/'capture-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Saved evidence to',folder,flush=True)
if report['errors']:raise SystemExit('Viewer errors detected; inspect capture-report.json.')
