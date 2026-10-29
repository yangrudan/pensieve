"""Export PDF with TrueType Simplified Chinese outlines for viewer compatibility.

Uses installed Noto CJK fonts and preserves their copyright/license metadata.
The temporary renamed font subsets only change outline representation.
"""
from pathlib import Path
import base64,re,subprocess,tempfile
from bs4 import BeautifulSoup
from fontTools.ttLib import TTFont
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'dist/report'
markup=(OUT/'index.html').read_text(encoding='utf-8')
characters=set(BeautifulSoup(markup,'html.parser').get_text())|set(chr(i) for i in range(32,127))

def font_subset(family,name,path):
    result=subprocess.check_output(['fc-match','-f','%{file}\n%{index}\n',family],text=True).splitlines()
    source=TTFont(result[0],fontNumber=int(result[1] or 0))
    cmap=source.getBestCmap();selected={ord(c):cmap[ord(c)] for c in characters if ord(c) in cmap}
    order=['.notdef']+sorted(set(selected.values())-{'.notdef'})
    glyphset=source.getGlyphSet();glyphs={}
    for glyph_name in order:
        pen=TTGlyphPen(glyphset)
        converted=Cu2QuPen(pen,max_err=1.0,reverse_direction=True)
        glyphset[glyph_name].draw(converted)
        glyphs[glyph_name]=pen.glyph()
    builder=FontBuilder(source['head'].unitsPerEm,isTTF=True)
    builder.setupGlyphOrder(order);builder.setupCharacterMap(selected);builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics({n:source['hmtx'].metrics[n] for n in order})
    builder.setupHorizontalHeader(ascent=source['hhea'].ascent,descent=source['hhea'].descent,lineGap=source['hhea'].lineGap)
    def original_name(number):
        for record in source['name'].names:
            if record.nameID==number:
                try:return record.toUnicode()
                except UnicodeDecodeError:pass
        return ''
    builder.setupNameTable({'familyName':name,'styleName':'Regular','uniqueFontIdentifier':name+'-Report-1',
        'fullName':name+' Regular','psName':name.replace(' ','')+'-Regular','version':'Version 1.0',
        'copyright':original_name(0),'licenseDescription':original_name(13),'licenseInfoURL':original_name(14)})
    old=source['OS/2']
    builder.setupOS2(sTypoAscender=old.sTypoAscender,sTypoDescender=old.sTypoDescender,
        sTypoLineGap=old.sTypoLineGap,usWinAscent=old.usWinAscent,usWinDescent=old.usWinDescent,fsType=old.fsType)
    builder.setupPost();builder.setupMaxp();builder.save(path)
    print(family,'->',len(order),'TrueType glyphs',flush=True)
    return base64.b64encode(Path(path).read_bytes()).decode()

with tempfile.TemporaryDirectory(prefix='pensieve-report-fonts-') as temporary:
    serif=font_subset('Noto Serif CJK SC','Pensieve Report SC',Path(temporary)/'serif.ttf')
    sans=font_subset('Noto Sans CJK SC','Pensieve Report Sans SC',Path(temporary)/'sans.ttf')
    css=f'''@font-face{{font-family:ReportSerifSC;src:url(data:font/ttf;base64,{serif}) format('truetype');font-weight:100 900;}}
    @font-face{{font-family:ReportSansSC;src:url(data:font/ttf;base64,{sans}) format('truetype');font-weight:100 900;}}
    :root{{--serif:ReportSerifSC;--sans:ReportSansSC;}}code{{font-family:ReportSansSC,monospace;}}'''
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1100})
        page.goto((OUT/'index.html').as_uri(),wait_until='load');page.add_style_tag(content=css)
        page.evaluate('document.fonts.ready')
        page.pdf(path=str(OUT/'记忆之处-项目报告-兼容版.pdf'),format='A4',print_background=True,
            display_header_footer=True,header_template='<div style="font-size:8px;padding:0 17mm;color:#8b948b;font-family:sans-serif;">THE PENSIEVE / PROJECT REPORT</div>',
            footer_template='<div style="font-size:8px;width:100%;padding:0 17mm;display:flex;justify-content:space-between;color:#8b948b;font-family:sans-serif;"><span>2026 · 10 · 28</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
            margin={'top':'18mm','bottom':'18mm','left':'17mm','right':'17mm'},outline=True,tagged=True)
        browser.close()
print('Exported compatible PDF with original Simplified Chinese glyph designs.')
