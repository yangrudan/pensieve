"""Publish local trial evidence only; never expose provider credentials or call APIs."""
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT/'.local/cloud-hybrid'
DEST = ROOT/'dist/atlas/cloud-lab'


def publish():
    state = json.loads((SOURCE/'trial-state.json').read_text())
    review_path = SOURCE/'quality-review.json'
    review = json.loads(review_path.read_text()) if review_path.exists() else {'verdict': '尚未完成云端画面评审', 'notes': []}
    (DEST/'frames').mkdir(parents=True, exist_ok=True)
    cards = []
    names = {'overview': '全景', 'crystal-texture-close': '水晶与纹理近景', 'lateral': '侧向视角'}
    captures = {item['name']: item for item in state.get('captures', [])}
    for name, label in names.items():
        images = []
        for prefix, extension, caption in [('', 'jpg', '云端 Mesh + 3DGS 实际回传'), ('local-', 'png', '本地几何对照 · 光照不同')]:
            filename = prefix+name+'.'+extension
            source = SOURCE/('frames' if not prefix else '')/filename
            if source.is_file():
                shutil.copyfile(source, DEST/'frames'/filename)
                images.append(f'<figure><a href="frames/{filename}" target="_blank" rel="noopener"><img src="frames/{filename}" alt="{label}：{caption}" loading="lazy"></a><figcaption>{caption} · 点击看原图</figcaption></figure>')
        capture = captures.get(name)
        metric = ''
        if capture:
            width, height = capture['dimensions']
            metric = f'<p class="metric">云端回传 {int(width)} × {int(height)} · 本次取图收到 {int(capture["frames_received"])} 帧。静态取图记录不等于交互帧率。</p>'
        cards.append(f'<section><h2>{label}</h2><div class="comparison">'+(''.join(images) or '<p>尚未取得图片。</p>')+'</div>'+metric+'</section>')
    notes = ''.join('<li>'+html.escape(str(note))+'</li>' for note in review.get('notes', []))
    cleanup = state.get('cleanup', {}).get('confirmed', False)
    session_count = int(state.get('sessions_created', 0))
    release = '已收到释放确认' if cleanup else ('尚未创建渲染会话' if not session_count else '尚未确认释放，需要核对')
    content = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>云端混合渲染实测 · 魔法石之境</title>
<style>:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#10191d;color:#e6eeee}body{max-width:1450px;margin:auto;padding:30px 24px 70px}a{color:#91e3cd}header{max-width:950px}h1{font-size:clamp(28px,4vw,45px);font-weight:550}h2{font-size:23px}p,li{line-height:1.8;color:#bbcccc}.verdict{border-left:3px solid #dabb7d;padding:12px 20px;background:#1c272b;color:#f1dcaf}.comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}section{margin-top:38px}figure{margin:0;background:#1b2429;border:1px solid #344247;border-radius:10px;overflow:hidden}img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#080c10}figcaption{padding:12px 16px;color:#bfcece}.metric{font-size:13px}nav{display:flex;gap:22px;flex-wrap:wrap}footer{margin-top:40px;color:#a4b8b8}@media(max-width:760px){.comparison{grid-template-columns:1fr}body{padding:20px 16px}}</style>
<header><nav><a href="/atlas/crystal-lab/">新版水晶近景 ↗</a><a href="/atlas/">记忆大厅</a><a href="/atlas/lab/">World 生成实验</a></nav><h1>云端 Mesh × 3DGS 实测</h1><p>保存的试验画面，不是持续运行的云端会话。上部建筑来自已有 AHOLO World 的空间裁剪；五色水晶、水池和石座使用固定 Mesh。AI 增强关闭。</p>'''
    content += '<p class="verdict">'+html.escape(review['verdict'])+'</p>'
    content += '<ul>'+notes+'</ul>' if notes else ''
    content += f'<p>本次创建渲染会话：{session_count} · {release}。未新增 World / Lux3D 模型生成。</p></header>'
    content += ''.join(cards)+'<footer>本地与云端光照不同。对照用于检查几何、纹理和空间组合，不能据此直接比较渲染器性能。</footer></html>'
    (DEST/'index.html').write_text(content)
    print('Published http://localhost:4174/atlas/cloud-lab/')


if __name__ == '__main__':
    publish()
