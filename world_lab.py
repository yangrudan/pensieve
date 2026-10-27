"""Validated local image sets for World experiments. No API calls here."""
import hashlib, json, re, math
from pathlib import Path
from PIL import Image

def case_folder(root, case):
    if not isinstance(case,str) or not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,63}',case):raise ValueError('实验名称无效')
    base=(root/'.local/world-lab').resolve();folder=(base/case).resolve()
    if folder.parent!=base:raise ValueError('实验目录无效')
    if not folder.exists():
        base=(root/'shared/world-lab/inputs').resolve();folder=(base/case).resolve()
        if folder.parent!=base:raise ValueError('实验目录无效')
    return folder

def bundled_items(root):
    """Read-only published experiments; never merge into personal state/quota."""
    index=root/'shared/world-lab/index.json'
    if not index.is_file():return []
    items=json.loads(index.read_text())['items']
    return [m for m in items if m.get('experimental') is True and m.get('mode')=='world'
            and m.get('status')=='ready' and re.fullmatch(r'[a-f0-9]{64}',m.get('id',''))]

def bundled_asset(root, mid, filename):
    item=next((m for m in bundled_items(root) if m['id']==mid),None)
    if not item:return None
    expected=f'/world-assets/{mid}/{filename}'
    if expected not in item.get('world_assets',{}).values():return None
    folder=(root/'shared/world-lab/assets'/mid).resolve();file=(folder/filename).resolve()
    return file if file.parent==folder and file.is_file() else None

def input_file(root, case, name):
    folder=case_folder(root,case);manifest=json.loads((folder/'manifest.json').read_text())
    if Path(name).name!=name or name not in manifest.get('images',[]):raise ValueError('视角不存在')
    file=folder/name
    if file.resolve().parent!=folder or file.suffix.lower() not in ('.jpg','.jpeg','.png','.webp') or file.stat().st_size>12*1024*1024:raise ValueError('视角文件无效')
    return file

def load_case(root, case):
    folder=case_folder(root,case)
    manifest=json.loads((folder/'manifest.json').read_text())
    images=manifest.get('images',[]);method=manifest.get('method')
    if method not in ('generation','reconstruction'):raise ValueError('实验方法无效')
    if not isinstance(images,list) or not (len(images)==1 if method=='generation' else 20<=len(images)<=80):raise ValueError('生成需要 1 张图；重建需要 20 至 80 张图')
    if len(set(images))!=len(images):raise ValueError('视角文件不能重复')
    digest=hashlib.sha256(json.dumps(manifest,sort_keys=True,ensure_ascii=False).encode())
    paths=[];hashes=set()
    for name in images:
        if not isinstance(name,str) or Path(name).name!=name or Path(name).suffix.lower() not in ('.jpg','.jpeg','.png','.webp'):raise ValueError('视角文件无效')
        file=folder/name
        if file.resolve().parent!=folder or file.stat().st_size>12*1024*1024:raise ValueError('视角文件无效或过大')
        with Image.open(file) as im:
            if im.width*im.height>30_000_000:raise ValueError('视角分辨率过大')
            im.verify()
        data=file.read_bytes();h=hashlib.sha256(data).hexdigest()
        if h in hashes:raise ValueError('重建图片必须是不同视角，不能重复同图')
        hashes.add(h);digest.update(data);paths.append(file)
    quality=manifest.get('task_quality','normal')
    if quality not in ('low','normal','high'):raise ValueError('重建质量无效')
    if manifest.get('require_geometry_check'):
        if method!='reconstruction':raise ValueError('几何预检仅用于多图重建')
        report=json.loads((folder/'geometry-check.json').read_text())
        summary=report.get('summary',{})
        limits={'min_inliers':(40,float('inf')),'max_rotation_error_deg':(0,2),
                'max_translation_direction_error_deg':(0,15),'rotation_loop_drift_deg':(0,5)}
        if summary.get('local_geometry_pass') is not True or summary.get('failed_pairs')!=0 or summary.get('checked_pairs')!=len(paths):raise ValueError('相机几何预检未通过')
        for key,(low,high) in limits.items():
            value=summary.get(key)
            if not isinstance(value,(int,float)) or not math.isfinite(value) or not low<=value<=high:raise ValueError('相机几何误差超限')
        expected={file.name:hashlib.sha256(file.read_bytes()).hexdigest() for file in paths}
        if report.get('image_hashes')!=expected or report.get('poses_hash')!=hashlib.sha256((folder/'camera-poses.json').read_bytes()).hexdigest():raise ValueError('输入已变化，请重新做几何预检')
    return manifest,paths,digest.hexdigest()
