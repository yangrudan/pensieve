"""Capture report illustrations with isolated demo data, never private memories."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
import sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT))
from atlas_store import DEFAULT_PLACES
OUT=ROOT/'dist/report/assets'
fixture={'places':DEFAULT_PLACES,'assignments':{},'archives':[]}
index=json.loads((ROOT/'shared/world-lab/index.json').read_text())
source=next(x for x in index['items'] if x['case']=='stone-hall-detail-v1')
demo={**source,'experimental':False,'name':'演示记忆 · 日光大厅'}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1,reduced_motion='reduce')
    errors=[];writes=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    def intercept(route):
        request=route.request
        if request.method!='GET':writes.append(request.url);route.abort();return
        path=request.url.split('?',1)[0].rsplit('/',1)[-1]
        if path=='session':route.fulfill(json={'configured':False,'token':'isolated-report-demo','attempts':19,'limit':40})
        elif path=='atlas':route.fulfill(json=fixture)
        elif path=='memories':route.fulfill(json={'items':[demo] if '/aha/' in page.url else [],'attempts':19,'limit':40})
        elif path=='experiments':route.fulfill(json={'items':index['items'],'attempts':19,'limit':40})
        else:route.abort()
    page.route('**/api/**',intercept)
    page.goto('http://127.0.0.1:4174/',wait_until='domcontentloaded')
    page.wait_for_timeout(2200);page.screenshot(path=str(OUT/'chapter-1.png'));print('Captured chapter 1',flush=True)
    page.goto('http://127.0.0.1:4174/atlas/',wait_until='domcontentloaded')
    page.locator('#atlas-scene[data-ready=true]').wait_for(timeout=120000)
    page.wait_for_timeout(1000);page.screenshot(path=str(OUT/'chapter-2.png'));print('Captured chapter 2',flush=True)
    page.goto('http://127.0.0.1:4174/aha/',wait_until='domcontentloaded')
    page.wait_for_function('document.body.dataset.phase==="delivered"',timeout=30000)
    page.screenshot(path=str(OUT/'chapter-3.png'));print('Captured chapter 3 demo',flush=True)
    assert not writes,writes
    assert not errors,errors
    browser.close()
