"""Browser checks of the detailed native hall. No provider calls or state writes."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4174');args=parser.parse_args()
out=Path('.local/evidence/daylight-detail');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1280,'height':850},device_scale_factor=1)
    page.set_default_timeout(90000)
    errors,writes=[],[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('request',lambda request:writes.append(request.url) if request.method!='GET' else None)
    page.goto(args.url.rstrip('/')+'/atlas/detail/',wait_until='domcontentloaded')
    page.locator('canvas[data-rendered=true]').wait_for(timeout=150000)
    counts=page.locator('canvas').evaluate('(e)=>[e.dataset.crystals,e.dataset.plinths,e.dataset.basins]')
    assert counts==['5','5','1'],counts
    optical=page.evaluate('''()=>detailHall.crystals.map((gem,i)=>{const p=gem.geometry.attributes.position,n=gem.geometry.attributes.normal;let inward=0;for(let j=0;j<p.count;j+=3){const x=(p.getX(j)+p.getX(j+1)+p.getX(j+2))/3,y=(p.getY(j)+p.getY(j+1)+p.getY(j+2))/3-.65,z=(p.getZ(j)+p.getZ(j+1)+p.getZ(j+2))/3;if(x*n.getX(j)+y*n.getY(j)+z*n.getZ(j)<-.01)inward++;}gem.geometry.computeBoundingBox();return {inward,supportDelta:gem.position.y+gem.geometry.boundingBox.min.y-detailHall.supports[i].max.y,transmission:gem.material.transmission};})''')
    assert all(x['inward']==0 for x in optical),optical
    assert all(-.04<=x['supportDelta']<=.02 for x in optical),optical
    assert all(x['transmission']>.5 for x in optical),optical
    page.screenshot(path=str(out/'overview-verified.png'))
    for i in range(5):
        page.locator(f'button[data-gem="{i}"]').click()
        assert page.locator('canvas').get_attribute('data-gem')==str(i)
        assert page.locator('canvas').get_attribute('data-focus')=='crystal'
    for kind in ['carving','basin']:
        page.locator(f'button[data-focus="{kind}"]').click()
        assert page.locator('canvas').get_attribute('data-focus')==kind
        page.screenshot(path=str(out/(kind+'-verified.png')))
    page.locator('button[data-focus="overview"]').click()
    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(800)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert page.evaluate('detailHall.camera.fov>100')
    page.screenshot(path=str(out/'mobile-verified.png'))
    page.get_by_role('button',name='冰蓝',exact=True).click()
    assert page.locator('canvas').get_attribute('data-gem')=='4'
    page.screenshot(path=str(out/'mobile-crystal-verified.png'))
    assert not errors,errors
    assert not writes,writes
    print('Passed: 5 gems/5 plinths/1 basin; outward normals; supported gems; transmission; all five focus controls; carving/basin closeups; portrait overview; no errors or writes.',flush=True)
    browser.close()
