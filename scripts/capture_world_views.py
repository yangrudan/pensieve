"""Render 24 overlapping translated camera views of one static synthetic hall."""
from pathlib import Path
import argparse,json,io,math
from PIL import Image,TiffImagePlugin
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4174');parser.add_argument('--variant',choices=['v1','v2'],default='v1');args=parser.parse_args()
root=Path(__file__).resolve().parents[1];folder=root/f'.local/world-lab/stone-hall-multiview-{args.variant}';folder.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1280,'height':960},device_scale_factor=1)
    page.goto(args.url+'/atlas/capture/?variant='+args.variant,wait_until='domcontentloaded');page.wait_for_function('window.sceneReady===true',timeout=90000)
    poses=[]
    for i in range(24):
        poses.append(page.evaluate('(i)=>window.sanctuary.pose(i)',i))
        if args.variant=='v2':
            raw=page.locator('canvas').screenshot(type='png',timeout=60000)
            exif=Image.Exif();exif[271]='PENSIEVE';exif[272]='Virtual 36mm sensor';exif[34665]={37386:TiffImagePlugin.IFDRational(27/(2*math.tan(math.radians(78/2)))),41989:17,40962:1280,40963:960,40961:1}
            with Image.open(io.BytesIO(raw)) as image:image.convert('RGB').save(folder/f'view-{i:02d}.jpg',quality=95,exif=exif)
        else:page.locator('canvas').screenshot(path=str(folder/f'view-{i:02d}.jpg'),type='jpeg',quality=95,timeout=60000)
        print(f'Captured {i+1}/24',flush=True)
    browser.close()
(folder/'camera-poses.json').write_text(json.dumps(poses,indent=2))
manifest={'name':'魔法石之境 · 24 视角重建','method':'reconstruction','images':[f'view-{i:02d}.jpg' for i in range(24)],'task_quality':'normal','scene_provenance':'One deterministic Three.js scene, generated limestone texture, fixed geometry and illumination, translated cameras on a complete loop. Synthetic render dataset, not real photographs.'}
if args.variant=='v2':
    manifest['name']='魔法石之境 · 修正纹理与镜头的24视角重建'
    manifest['scene_provenance']+=' Unique non-repeating floor atlas and focal-length EXIF; reduced specular materials.'
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Dataset complete:',folder,flush=True)
