"""Render PROJECT_REPORT.md as an illustrated HTML report and shareable PDF.

Needs Markdown, Playwright and Chromium. Never calls project generation APIs.
"""
from pathlib import Path
import html,re,sys
try:
    import markdown
except ImportError:
    sys.path.insert(0,'/tmp/pensieve-report-tools')
    import markdown
from markdown.extensions.toc import slugify_unicode
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'dist/report'
source=(ROOT/'PROJECT_REPORT.md').read_text()
converter=markdown.Markdown(extensions=['tables','toc','fenced_code','sane_lists'],extension_configs={'toc':{'slugify':slugify_unicode,'toc_depth':'2-3'}})
body=converter.convert(source)
body=re.sub(r'<h1[^>]*>.*?</h1>','',body,count=1,flags=re.S)
body=re.sub(r'<h2[^>]*>让每一段念念不忘.*?</h2>','',body,count=1,flags=re.S)
body=re.sub(r'<p><strong>The Pensieve · 项目报告</strong>.*?</p>','',body,count=1,flags=re.S)
body=re.sub(r'<blockquote>\s*<p>记忆让我们每个人与众不同，也给予我们感动与力量。</p>\s*</blockquote>','',body,count=1)
body=re.sub(r'<p><img[^>]*src="dist/report/assets/cover.webp"[^>]*/></p>\s*<p><em>.*?</em></p>','',body,count=1,flags=re.S)
body=body.replace('dist/report/assets/','assets/')
body=re.sub(r'<p>(<img[^>]+/>)</p>\s*<p><em>(.*?)</em></p>',r'<figure>\1<figcaption>\2</figcaption></figure>',body,flags=re.S)
def repo_link(match):
    url=match.group(1)
    if url.startswith(('http:','https:','#')):return match.group(0)
    if url.endswith('.md'):return 'href="https://github.com/yangrudan/pensieve/blob/main/'+html.escape(url,quote=True)+'"'
    return match.group(0)
body=re.sub(r'href="([^"]+)"',repo_link,body)
toc=converter.toc
for anchor in re.findall(r'href="#([^"]+)"',toc):
    if 'id="'+anchor+'"' not in body:
        toc=re.sub(r'<li><a href="#'+re.escape(anchor)+r'">[^<]*</a></li>','',toc)
css='''
:root{--ink:#233d37;--muted:#687970;--gold:#a18a5b;--line:#d9d6c7;--paper:#fcfaf4;--sans:'Noto Sans CJK SC','Microsoft YaHei',sans-serif;--serif:'Noto Serif CJK SC','Songti SC',serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#eceae1;color:var(--ink);font:15px/1.95 var(--serif)}a{color:#567961;text-underline-offset:4px;overflow-wrap:anywhere}a:hover{color:#9a793f}.screenbar{max-width:1220px;margin:22px auto;padding:0 28px;display:flex;justify-content:space-between;font:11px/1.7 var(--sans);color:var(--muted);letter-spacing:1px}.screenbar a{color:inherit}.screenbar{flex-wrap:wrap;gap:12px}.download-links{display:flex;gap:14px;flex-wrap:wrap}.sheet{max-width:1220px;margin:0 auto 50px;background:var(--paper);box-shadow:0 12px 70px #1d382317}.cover{padding:70px 78px 56px;border-bottom:1px solid var(--line)}.kicker{font:10px/1.8 var(--sans);letter-spacing:3px;color:var(--gold)}.cover h1{font:500 62px/1.35 var(--serif);letter-spacing:10px;margin:20px 0 12px}.subtitle{font:20px/1.8 var(--serif);letter-spacing:2px;color:#4b655b}.meta{margin-top:20px;font:10px/1.8 var(--sans);color:var(--muted)}.cover img{display:block;width:100%;height:auto;margin:32px 0 25px;border-radius:2px}.cover-image-note{font:9px/1.8 var(--sans);color:var(--muted);margin-top:-16px}.cover-quote{font:21px/1.85 var(--serif);color:#546b5e;max-width:800px;margin:18px 0}.cover-copy{font-size:13px;line-height:2;color:var(--muted);max-width:790px}.pillars{display:flex;gap:0;margin-top:28px;border-top:1px solid var(--line);padding-top:20px}.pillars span{flex:1;font:12px/1.8 var(--serif);letter-spacing:3px}.pillars small{display:block;font:8px/1.8 var(--sans);color:var(--gold);letter-spacing:1.3px}.content{display:grid;grid-template-columns:210px minmax(0,1fr);gap:45px;padding:52px 60px 76px}.contents{font:10px/1.8 var(--sans);position:sticky;top:25px;align-self:start;color:var(--muted);max-height:92vh;overflow:auto}.contents>p{font-size:9px;letter-spacing:3px;color:var(--gold)}.contents ul{list-style:none;padding-left:0}.contents ul ul{padding-left:10px;margin:7px 0 12px}.contents li{margin:6px 0}.contents a{color:inherit;text-decoration:none}.contents a:hover{color:var(--gold)}article{min-width:0}article>p:first-child{margin-top:0}article p{margin:0 0 17px;text-align:justify}h2{font:500 25px/1.65 var(--serif);margin:46px 0 24px;padding-top:18px;border-top:1px solid var(--line);letter-spacing:1px}h3{font:500 17px/1.7 var(--serif);margin:29px 0 16px;color:#567260}strong{font-weight:650}blockquote{margin:22px 0;padding:14px 22px;border-left:3px solid var(--gold);background:#f0f0e6;color:#52695c}blockquote p{margin:0}table{width:100%;border-collapse:collapse;margin:24px 0 28px;font:11px/1.85 var(--sans)}th{background:#e9eee5;color:#385747;font-weight:500;text-align:left}td,th{padding:11px 12px;border-bottom:1px solid var(--line);vertical-align:top;overflow-wrap:anywhere}figure{margin:30px 0 32px;break-inside:avoid}figure img{display:block;width:100%;height:auto;border:1px solid #a0ad9b22}figcaption{font:10px/1.85 var(--sans);color:var(--muted);margin-top:10px;text-align:left}code{font:11px/1.7 ui-monospace,monospace;background:#e9ece1;padding:2px 5px;border-radius:3px;overflow-wrap:anywhere}ul,ol{padding-left:22px;margin:18px 0 24px}li{margin:9px 0}.footer{padding:18px 60px 35px;border-top:1px solid var(--line);font:9px/1.8 var(--sans);color:var(--muted);letter-spacing:1px}@media(max-width:850px){body{font-size:14px}.screenbar{padding:0 18px}.cover{padding:40px 26px}.cover h1{font-size:45px}.subtitle{font-size:17px}.cover-quote{font-size:18px}.content{display:block;padding:26px 24px 45px}.contents{display:none}.footer{padding:18px 24px}table{font-size:10px}td,th{padding:8px 6px}h2{font-size:21px}.pillars span{font-size:10px;letter-spacing:1px}}
@media print{@page{size:A4}html{scroll-behavior:auto}body{background:white;font-size:10.5pt;line-height:1.85;color:#24362e}.screenbar,.contents{display:none!important}.sheet{margin:0;max-width:none;background:white;box-shadow:none}.cover{padding:6mm 0 0;min-height:245mm;border:0;break-after:page}.kicker{font-size:8pt}.cover h1{font-size:43pt;letter-spacing:7pt;margin:10mm 0 4mm}.subtitle{font-size:15pt}.meta{font-size:8pt;margin-top:5mm}.cover img{margin:9mm 0 7mm;width:100%;height:94mm;object-fit:cover}.cover-quote{font-size:16pt;line-height:1.8;margin:6mm 0}.cover-copy{font-size:9.5pt;line-height:1.9}.pillars{margin-top:8mm;padding-top:5mm}.pillars span{font-size:10pt}.pillars small{font-size:6pt}.content{display:block;padding:0}h2{font-size:18pt;margin:10mm 0 5mm;padding-top:5mm;break-after:avoid}h3{font-size:12pt;margin:7mm 0 3.5mm;break-after:avoid}article p{margin-bottom:4mm;orphans:3;widows:3}table{font-size:8pt;line-height:1.7;margin:5mm 0 6mm}thead{display:table-header-group}tr{break-inside:avoid}td,th{padding:2.5mm 2mm}figure{margin:6mm 0;break-inside:avoid}figure img{max-height:112mm;object-fit:contain}figcaption{font-size:7.7pt;line-height:1.8;margin-top:2.5mm}blockquote{padding:3mm 5mm;margin:5mm 0}ul,ol{margin:4mm 0 5mm}li{margin:2mm 0}code{font-size:8pt}.footer{margin-top:10mm;padding:4mm 0 0;font-size:7.5pt}a{color:#3e6c55;text-decoration:none}}
'''
cover='''<section class="cover"><div class="kicker">A PLACE FOR MEMORY / PROJECT REPORT</div><h1>记忆之处</h1><div class="subtitle">让每一段念念不忘，都有一处可以归来</div><div class="meta">THE PENSIEVE · 创意、交互、生成资产与调试过程<br>基于 v0.6.0-daylight-detail · 2026年10月28日</div><img src="assets/cover.webp" alt="冥想盆氛围底图，AI图像生成"><div class="cover-image-note">AI生成的室内氛围底图 · 水面与银丝由程序另行渲染</div><p class="cover-quote">记忆让我们每个人与众不同，<br>也给予我们感动与力量。</p><p class="cover-copy">把一张照片交给水面，为它找到一颗守护记忆的水晶。日后，或许有一只燕子，会衔着花，替你捎回那段时光。</p><div class="pillars"><span>缘起<small>I / 珍藏</small></span><span>汇聚<small>II / 归属</small></span><span>重逢<small>III / 唤回</small></span><span>探索<small>＋1 / 世界实验</small></span></div></section>'''
page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>记忆之处 · 项目报告</title><style>'+css+'</style></head><body><nav class="screenbar"><span>记忆之处 / THE PENSIEVE</span><div class="download-links"><a href="记忆之处-项目报告.docx">Word ↗</a><a href="记忆之处-项目报告.md">Markdown ↗</a><a href="记忆之处-项目报告-兼容版.pdf">兼容版 PDF ↗</a><a href="记忆之处-项目报告.pdf">原版 PDF ↗</a></div></nav><main class="sheet">'+cover+'<div class="content"><aside class="contents"><p>阅读目录</p>'+toc+'</aside><article>'+body+'</article></div><footer class="footer">记忆之处 · 基于已实现功能与实际实验记录 · 私人记忆照片未包含在本报告中</footer></main></body></html>'
(OUT/'index.html').write_text(page)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
    tab=browser.new_page(viewport={'width':1440,'height':1100},device_scale_factor=1)
    tab.goto((OUT/'index.html').as_uri(),wait_until='load')
    tab.evaluate('document.fonts.ready')
    missing=tab.locator('img').evaluate_all('(images)=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute("src"))')
    if missing:raise RuntimeError('Missing report images: '+str(missing))
    assert tab.locator('article h2').count()>=10
    broken=tab.locator('a[href^="#"]').evaluate_all('(links)=>links.filter(a=>!document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)))).map(a=>a.getAttribute("href"))')
    assert not broken,broken
    tab.screenshot(path=str(OUT/'preview.png'))
    tab.pdf(path=str(OUT/'记忆之处-项目报告.pdf'),format='A4',print_background=True,display_header_footer=True,header_template='<div style="font-size:8px;width:100%;padding:0 17mm;color:#8b948b;font-family:sans-serif;letter-spacing:1px;">THE PENSIEVE / PROJECT REPORT</div>',footer_template='<div style="font-size:8px;width:100%;padding:0 17mm;display:flex;justify-content:space-between;color:#8b948b;font-family:sans-serif;"><span>2026 · 10 · 28</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',margin={'top':'18mm','bottom':'18mm','left':'17mm','right':'17mm'},outline=True,tagged=True)
    tab.set_viewport_size({'width':390,'height':844})
    assert tab.evaluate('document.documentElement.scrollWidth<=innerWidth')
    browser.close()
print('Rendered HTML and PDF with',len(re.findall(r'<figure>',body)),'captioned figures.')
