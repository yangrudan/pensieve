"""Render 24 legacy or 72 corrected views of one fixed synthetic hall; no cloud calls."""
from pathlib import Path
import argparse, json, io, math
from PIL import Image, TiffImagePlugin
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4174')
parser.add_argument('--variant',choices=['v1','v2','v3'],default='v1')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
folder=root/f'.local/world-lab/stone-hall-multiview-{args.variant}'
folder.mkdir(parents=True,exist_ok=True)
total=72 if args.variant=='v3' else 24
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1280,'height':960},device_scale_factor=1)
    page.goto(args.url+'/atlas/capture/?variant='+args.variant,wait_until='domcontentloaded')
    page.wait_for_function('window.sceneReady===true',timeout=90000)
    poses=[]
    for i in range(total):
        pose=page.evaluate('(i)=>window.sanctuary.pose(i)',i)
        poses.append(pose)
        if args.variant in ('v2','v3'):
            raw=page.locator('canvas').screenshot(type='png',timeout=60000)
            focal=27/(2*math.tan(math.radians(pose['fov']/2)))
            equivalent=round(focal*math.hypot(36,24)/math.hypot(36,27)) if args.variant=='v3' else 17
            exif=Image.Exif()
            exif[271]='PENSIEVE'
            exif[272]='Virtual 36x27mm sensor'
            exif[34665]={37386:TiffImagePlugin.IFDRational(focal),41989:equivalent,40962:1280,40963:960,40961:1}
            with Image.open(io.BytesIO(raw)) as image:
                image.convert('RGB').save(folder/f'view-{i:02d}.jpg',quality=95,exif=exif)
        else:
            page.locator('canvas').screenshot(path=str(folder/f'view-{i:02d}.jpg'),type='jpeg',quality=95,timeout=60000)
        print(f'Captured {i+1}/{total}',flush=True)
    browser.close()
(folder/'camera-poses.json').write_text(json.dumps(poses,indent=2))
manifest={'name':'魔法石之境 · 24 视角重建','method':'reconstruction',
          'images':[f'view-{i:02d}.jpg' for i in range(total)],'task_quality':'normal',
          'scene_provenance':'One deterministic Three.js scene, generated limestone texture, fixed geometry and illumination, translated cameras on a complete loop. Synthetic render dataset, not real photographs.'}
if args.variant=='v2':
    manifest['name']='魔法石之境 · 修正纹理与镜头的24视角重建'
    manifest['scene_provenance']+=' Unique non-repeating floor atlas and focal-length EXIF; reduced specular materials.'
if args.variant=='v3':
    manifest.update(name='魔法石之境 · 72视角几何验证',task_quality='high',require_geometry_check=True,
        scene_provenance='One fixed synthetic mesh, exactly five named crystals. Dense 5-degree camera steps, diffuse-only materials, distinct wall textures. Ground truth camera matrices and pinhole intrinsics saved locally. Not a real photographic scan.',
        intrinsics=poses[0]['intrinsics'],image_size=[1280,960],virtual_sensor_mm=[36,27],
        baseline_max_m=max(math.dist(poses[i]['position'],poses[(i+1)%len(poses)]['position']) for i in range(len(poses))))
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Dataset complete:',folder,flush=True)
