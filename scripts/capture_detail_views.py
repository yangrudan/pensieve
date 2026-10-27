"""Capture one detailed, fixed daylight hall. No API calls or quota changes."""
import argparse,base64,io,json,math
from pathlib import Path
from PIL import Image,TiffImagePlugin
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:4174')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
folder=root/'.local/world-lab/stone-hall-detail-v1'
folder.mkdir(parents=True,exist_ok=True)
if (folder/'manifest.json').exists():raise SystemExit('Dataset already exists. Preserve submitted input; use a new case for changes.')
width,height,total=1600,1000,80
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(args.url+'/atlas/detail/?capture=1',wait_until='domcontentloaded')
    page.wait_for_function('window.sceneReady===true',timeout=120000)
    assert page.locator('canvas').get_attribute('data-crystals')=='5'
    assert page.locator('canvas').get_attribute('data-plinths')=='5'
    poses=[]
    for i in range(total):
        result=page.evaluate('''i=>{const pose=detailHall.pose(i);return {pose,image:document.querySelector('canvas').toDataURL('image/jpeg',.96).split(',')[1]};}''',i)
        pose=result['pose'];poses.append(pose)
        exif=Image.Exif();exif[271]='PENSIEVE';exif[272]='Virtual 36x22.5mm sensor'
        focal=22.5/(2*math.tan(math.radians(pose['fov']/2)))
        exif[34665]={37386:TiffImagePlugin.IFDRational(focal),41989:round(focal*math.hypot(36,24)/math.hypot(36,22.5)),40962:width,40963:height,40961:1}
        with Image.open(io.BytesIO(base64.b64decode(result['image']))) as image:
            image.save(folder/f'view-{i:02d}.jpg',quality=96,exif=exif)
        print(f'Captured detailed input {i+1}/{total}',flush=True)
    if errors:raise RuntimeError(str(errors))
    browser.close()
(folder/'camera-poses.json').write_text(json.dumps(poses,indent=2))
manifest={'name':'日光大厅 · 80视角雕刻与材质细节重建','method':'reconstruction','images':[f'view-{i:02d}.jpg' for i in range(total)],'task_quality':'high','require_geometry_check':True,'intrinsics':poses[0]['intrinsics'],'image_size':[width,height],'virtual_sensor_mm':[36,22.5],'scene_provenance':'One fixed high-detail synthetic Gothic hall. Exactly five gems, five carved plinths, one hollow carved basin. Bevelled paving, real arched windows, mouldings, PBR limestone and faceted gems; transmission is disabled only in calibration captures to avoid view-dependent refractive correspondences. Interactive source keeps transmission. AI-created diffuse limestone texture. Static lighting, 80 translated 4.5-degree camera poses; not a real photographic scan.'}
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Detailed dataset prepared. No generation request made.',flush=True)
