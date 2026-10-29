"""Export the report as portable Markdown and an editable Word document."""
from pathlib import Path
import io,re
from bs4 import BeautifulSoup,NavigableString,Tag
from PIL import Image
from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'dist/report'
text=(ROOT/'PROJECT_REPORT.md').read_text(encoding='utf-8')
portable=text.replace('dist/report/assets/','assets/')
def local_links(m):
    label,target=m.groups()
    if target.startswith(('http://','https://','#','assets/')):return m.group(0)
    return '['+label+'](../../'+target+')'
portable=re.sub(r'(?<!!)\[([^\]]+)\]\(([^)]+)\)',local_links,portable)
(OUT/'记忆之处-项目报告.md').write_text(portable,encoding='utf-8')

soup=BeautifulSoup((OUT/'index.html').read_text(encoding='utf-8'),'html.parser')
doc=Document();section=doc.sections[0]
section.page_width=Inches(8.27);section.page_height=Inches(11.69)
section.top_margin=Inches(.72);section.bottom_margin=Inches(.72)
section.left_margin=Inches(.7);section.right_margin=Inches(.7)
WIDTH=6.87

def style_font(style,east='Noto Serif CJK SC',latin='Calibri',size=10.5):
    style.font.name=latin;style.font.size=Pt(size)
    pr=style.element.get_or_add_rPr()
    fonts=pr.find(qn('w:rFonts'))
    if fonts is None:fonts=OxmlElement('w:rFonts');pr.insert(0,fonts)
    for key,value in [('ascii',latin),('hAnsi',latin),('eastAsia',east),('cs',latin)]:fonts.set(qn('w:'+key),value)
    lang=pr.find(qn('w:lang'))
    if lang is None:lang=OxmlElement('w:lang');pr.append(lang)
    lang.set(qn('w:val'),'zh-CN');lang.set(qn('w:eastAsia'),'zh-CN')

for name in ['Normal','Body Text','Quote','Caption','List Bullet','List Number']:
    style_font(doc.styles[name])
for name,size in [('Title',36),('Subtitle',15),('Heading 1',18),('Heading 2',13),('Heading 3',11)]:
    style_font(doc.styles[name],'Noto Sans CJK SC',size=size)
    doc.styles[name].font.color.rgb=RGBColor.from_string('294B3D')
    doc.styles[name].paragraph_format.keep_with_next=True
normal=doc.styles['Normal'].paragraph_format
normal.line_spacing=1.65;normal.space_after=Pt(8)
doc.styles['Caption'].font.size=Pt(8.5)
doc.styles['Caption'].font.color.rgb=RGBColor.from_string('63786B')
doc.styles['Caption'].paragraph_format.line_spacing=1.35

# Set the document-wide script defaults as well as each paragraph style.
settings=doc.settings.element
language=OxmlElement('w:themeFontLang');language.set(qn('w:val'),'zh-CN');language.set(qn('w:eastAsia'),'zh-CN')
old=settings.find(qn('w:themeFontLang'))
if old is not None:settings.remove(old)
settings.append(language)
doc.core_properties.title='记忆之处 · 项目报告'
doc.core_properties.subject='创意、交互、生成资产与调试过程'
doc.core_properties.author='记忆之处'
doc.core_properties.language='zh-CN'

def add_link(paragraph,label,url):
    rel=paragraph.part.relate_to(url,RT.HYPERLINK,is_external=True)
    link=OxmlElement('w:hyperlink');link.set(qn('r:id'),rel)
    run=OxmlElement('w:r');pr=OxmlElement('w:rPr')
    fonts=OxmlElement('w:rFonts');fonts.set(qn('w:ascii'),'Calibri');fonts.set(qn('w:hAnsi'),'Calibri');fonts.set(qn('w:eastAsia'),'Noto Serif CJK SC');pr.append(fonts)
    color=OxmlElement('w:color');color.set(qn('w:val'),'456F55');pr.append(color)
    run.append(pr);node=OxmlElement('w:t');node.text=label;run.append(node);link.append(run);paragraph._p.append(link)

def inline(paragraph,node,bold=False,italic=False):
    if isinstance(node,NavigableString):
        run=paragraph.add_run(str(node));run.bold=bold;run.italic=italic;return
    if not isinstance(node,Tag):return
    if node.name=='br':paragraph.add_run().add_break();return
    if node.name=='a':add_link(paragraph,node.get_text(),node.get('href',''));return
    for child in node.children:inline(paragraph,child,bold or node.name in ('strong','b'),italic or node.name in ('em','i'))

def picture(src):
    file=OUT/src
    with Image.open(file) as image:
        ratio=image.width/image.height
        width=min(WIDTH,4.25*ratio)
        if image.format=='WEBP':
            buffer=io.BytesIO();image.convert('RGB').save(buffer,format='PNG');buffer.seek(0);file=buffer
        paragraph=doc.add_paragraph();paragraph.alignment=WD_ALIGN_PARAGRAPH.CENTER
        paragraph.paragraph_format.keep_with_next=True
        paragraph.paragraph_format.space_before=Pt(9);paragraph.paragraph_format.space_after=Pt(4)
        paragraph.add_run().add_picture(str(file) if isinstance(file,Path) else file,width=Inches(width))

def caption(text):
    p=doc.add_paragraph(text,style='Caption');p.paragraph_format.keep_with_next=False
    return p

cover=soup.select_one('.cover')
doc.add_paragraph(cover.select_one('.kicker').get_text(),style='Caption')
doc.add_paragraph('记忆之处',style='Title')
doc.add_paragraph(cover.select_one('.subtitle').get_text(),style='Subtitle')
doc.add_paragraph(cover.select_one('.meta').get_text('\n'),style='Caption')
picture(cover.img['src']);caption(cover.select_one('.cover-image-note').get_text())
p=doc.add_paragraph(cover.select_one('.cover-quote').get_text('\n'),style='Quote')
p.paragraph_format.space_before=Pt(12);p.paragraph_format.space_after=Pt(12)
doc.add_paragraph(cover.select_one('.cover-copy').get_text())
doc.add_paragraph('缘起 · 珍藏     汇聚 · 归属     重逢 · 唤回     ＋1 · 世界实验',style='Caption')
doc.add_page_break()

for block in soup.article.children:
    if not isinstance(block,Tag):continue
    if block.name in ('h1','h2','h3'):
        heading=doc.add_heading(block.get_text(),level={'h1':1,'h2':1,'h3':2}[block.name]);continue
    if block.name=='p':
        p=doc.add_paragraph();inline(p,block)
    elif block.name=='blockquote':
        for item in block.find_all('p',recursive=False):
            p=doc.add_paragraph(style='Quote');inline(p,item)
    elif block.name in ('ul','ol'):
        for item in block.find_all('li',recursive=False):
            p=doc.add_paragraph(style='List Bullet' if block.name=='ul' else 'List Number');inline(p,item)
    elif block.name=='figure':
        picture(block.img['src'])
        if block.figcaption:caption(block.figcaption.get_text())
    elif block.name=='table':
        rows=block.find_all('tr');columns=max(len(row.find_all(['td','th'],recursive=False)) for row in rows)
        table=doc.add_table(rows=0,cols=columns);table.style='Table Grid'
        for i,row in enumerate(rows):
            cells=table.add_row().cells
            for cell,content in zip(cells,row.find_all(['td','th'],recursive=False)):
                p=cell.paragraphs[0];inline(p,content,bold=i==0)
                p.paragraph_format.line_spacing=1.35;p.paragraph_format.space_after=Pt(3)
                for run in p.runs:run.font.size=Pt(8.5)
                if i==0:
                    shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E9EEE5');cell._tc.get_or_add_tcPr().append(shade)
            properties=table.rows[-1]._tr.get_or_add_trPr()
            keep=OxmlElement('w:cantSplit');properties.append(keep)
            if i==0:properties.append(OxmlElement('w:tblHeader'))
        doc.add_paragraph().paragraph_format.space_after=Pt(2)

header=section.header.paragraphs[0];header.text='记忆之处 / THE PENSIEVE · 项目报告';header.style='Caption'
footer=section.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT
footer.add_run('2026 · 10 · 28     ')
for field_name in ['PAGE','NUMPAGES']:
    if field_name=='NUMPAGES':footer.add_run(' / ')
    field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),field_name);footer._p.append(field)
for run in footer.runs:run.font.size=Pt(8)
file=OUT/'记忆之处-项目报告.docx';doc.save(file)
print('Exported:',file.name,'and 记忆之处-项目报告.md')
