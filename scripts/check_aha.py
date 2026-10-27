"""Verify Chapter III against isolated browser fixtures; no provider calls or writes."""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4175')
args = parser.parse_args()
base = args.url.rstrip('/')
out = Path('.local/evidence/aha')
out.mkdir(parents=True, exist_ok=True)
photo = '/assets/stone-hall-daylight-reference.jpg'
items = [dict(id=str(i), name=f'旧日记忆 {i}', status='ready', mode='world',
              created_at=1720000000, photo_url=photo, world_assets={'splat_url': '/fixture.spz'})
         for i in range(3)]
items += [dict(id='pending', status='generating', model_url='/no.glb'),
          dict(id='archive', status='photo', photo_url=photo),
          dict(id='four', status='ready', mode='fourview', model_url='/no.glb'),
          dict(id='experiment', status='ready', experimental=True, model_url='/no.glb')]
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1440, 'height':1000}, reduced_motion='reduce')
    errors, writes = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('request', lambda r: writes.append(r.url) if r.method != 'GET' else None)
    page.route('**/api/memories', lambda r: r.fulfill(json={'items':items}))
    page.route('**/world/**', lambda r: r.fulfill(body='<p>Saved world fixture</p>', content_type='text/html'))
    page.goto(base+'/aha/')
    page.wait_for_function('document.body.dataset.phase === "delivered"')
    assert '3 段' in page.locator('#pool-note').inner_text()
    page.screenshot(path=str(out/'desktop.png'))
    seen = []
    for i in range(7):
        page.locator('#parcel').click()
        page.locator('#reveal').wait_for(state='visible')
        seen.append(page.locator('#memory-name').inner_text())
        page.locator('#viewer-content iframe').wait_for()
        assert page.locator('#view-3d').get_attribute('aria-pressed') == 'true'
        assert page.locator('#viewer-content img').count() == 0
        if i == 0:
            page.locator('#viewer-content iframe').wait_for()
            page.locator('#view-photo').click()
            page.locator('#viewer-content img').wait_for()
            assert page.locator('#view-photo').get_attribute('aria-pressed') == 'true'
            page.locator('#view-3d').click()
            page.locator('#viewer-content iframe').wait_for()
        if i < 6:
            page.locator('#another').click()
            page.wait_for_function('document.body.dataset.phase === "delivered"')
    assert len(set(seen[:3])) == len(set(seen[3:6])) == 3, seen
    assert all(a != b for a,b in zip(seen,seen[1:])), seen
    page.keyboard.press('Escape')
    page.wait_for_function('document.querySelector("#viewer-content").children.length === 0')
    page.wait_for_function('document.activeElement === document.querySelector("#receive")')
    page.set_viewport_size({'width':390, 'height':844})
    page.locator('#receive').click()
    page.wait_for_function('document.body.dataset.phase === "delivered"')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(out/'mobile.png'), full_page=True)
    page.locator('#parcel').click()
    page.locator('#reveal').wait_for(state='visible')
    page.screenshot(path=str(out/'mobile-reveal.png'))
    page.unroute('**/api/memories')
    page.route('**/api/memories', lambda r: r.fulfill(json={'items':[]}))
    page.reload()
    page.wait_for_function('document.body.dataset.phase === "empty"')
    assert page.locator('#empty-link').is_visible()
    assert page.locator('#receive').is_hidden()
    page.unroute('**/api/memories')
    page.route('**/api/memories', lambda r: r.fulfill(status=503, json={}))
    page.reload()
    page.wait_for_function('document.body.dataset.phase === "error"')
    page.unroute('**/api/memories')
    page.route('**/api/memories', lambda r: r.fulfill(json={'items':items[:1]}))
    page.locator('#receive').click()
    page.wait_for_function('document.body.dataset.phase === "delivered"')
    page.locator('#parcel').click()
    page.locator('#reveal').wait_for(state='visible')
    assert page.locator('#another').is_hidden()
    assert not errors, errors
    assert not writes, writes
    browser.close()
    print('Passed: shuffle cycles, no adjacent repeats, filtering, saved viewer, keyboard, mobile, empty/error/retry/single-memory states; no writes.')
