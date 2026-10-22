"""Fixed text-to-3D crystal designs; shared quota and idempotency live in server."""
import hashlib
import json
import time

CASE='emerald-quartz-lux-v1'
PROMPT='''A single exquisite emerald green magical quartz crystal, isolated standalone object.
One upright six-sided crystal prism with a slightly asymmetric pointed crown, crisp polished facets,
fine beveled edges, transparent emerald green gemstone appearance, subtle natural internal striations.
The main body is tall and slender with a clear hexagonal cross section and a narrow lower termination.
Solid coherent watertight gemstone geometry, refined natural crystal proportions, physically based material.
Only the gemstone: no pedestal, no stand, no floor, no room, no surrounding rocks, no companion crystals,
no floating particles, no light rays, no letters or symbols. Product-quality 3D asset.'''

FINISH='''Polished transparent gemstone appearance with high optical clarity, crisp planar facets and fine beveled edges.
Clean translucent color with only sparse fine inclusions; no dark mottling or painted light rays.
Real three-dimensional thickness and coherent solid gemstone geometry, refined physically based material.
Only the gemstone, isolated standalone 3D object: no pedestal, stand, floor, background, room, surrounding rocks,
letters, symbols, particles or added light sources. Product-quality 3D asset.'''
CATALOG=[
    {'case':CASE,'key':'emerald','name':'翡翠长晶','place_id':'home','color':'#73ddbe','shape':'quartz','face_count':50000,'prompt':PROMPT},
    {'case':'amethyst-cluster-lux-v1','key':'amethyst','name':'紫晶簇','place_id':'work','color':'#9ca5ff','shape':'cluster','face_count':20000,'prompt':'''A single violet amethyst crystal cluster with exactly three connected quartz prisms.
A tall upright central six-sided crystal, a shorter outward-leaning left crystal and a small right crystal,
all joined at a compact natural crystalline base. Three distinct pointed crowns and unequal heights.
Wide branching silhouette, elegant asymmetry, light violet amethyst color. '''+FINISH},
    {'case':'amber-diamond-lux-v1','key':'amber','name':'琥珀切钻','place_id':'journey','color':'#edbc77','shape':'diamond','face_count':20000,'prompt':'''A single brilliant-cut octagonal amber gemstone, wide and relatively squat.
Flat octagonal table at the top, sloped crown facets, a broad octagonal girdle and a deep faceted pavilion
ending in one bottom point. Clearly a cut jewel rather than a long quartz prism. Warm honey gold color.
Symmetrical eight-sided diamond-cut silhouette with real volume. '''+FINISH},
    {'case':'rose-heart-lux-v1','key':'rose','name':'蔷薇心晶','place_id':'garden','color':'#e998bb','shape':'heart','face_count':20000,'prompt':'''A single thick three-dimensional heart-cut pink rose-quartz gemstone.
Two rounded faceted upper lobes, a distinct central notch, tapering sides and one pointed lower tip.
A full deep faceted back pavilion gives the jewel substantial thickness; not a flat plaque or thin cutout.
Clearly recognizable heart silhouette from the front, delicate blush pink color, elegant jewel proportions. '''+FINISH},
    {'case':'ice-doublepoint-lux-v1','key':'ice','name':'冰蓝双尖','place_id':'hometown','color':'#78c9ed','shape':'ice','face_count':20000,'prompt':'''A single elongated pale ice-blue double-terminated crystal.
Slender eight-sided prism with a long sharp pyramidal point at BOTH ends, upright main axis.
The upper and lower pointed terminations are clearly visible; no flat base.
Symmetrical spear-like crystal, narrow waist, crisp long facets and icy light blue color. '''+FINISH},
]

def prototype(case):
    item=next((item for item in CATALOG if item['case']==case),None)
    if not item:raise ValueError('未知的水晶造型')
    settings={'case':case,'prompt':item['prompt'],'version':'G1','face_count':item['face_count'],'method':'text_to_3d'}
    mid=hashlib.sha256(json.dumps(settings,sort_keys=True).encode()).hexdigest()
    return mid,{**settings,**{key:item[key] for key in ('key','name','place_id','color','shape')}}

def verify_rejected_retry(item,history,known_ids,now=None):
    """Operator-observed BusinessError only; reconcile a complete provider list."""
    now=time.time() if now is None else now
    if item.get('status')!='uncertain' or item.get('task_id') or item.get('retry_count',0):return False
    if now-item.get('created_at',now)<60:return False
    entries=history.get('items',[]);total=history.get('total')
    if not isinstance(total,int) or total>len(entries):return False
    for task in entries:
        created=task.get('created');task_id=task.get('taskId')
        if not isinstance(created,(int,float)) or not task_id:return False
        seconds=created/1000 if created>100_000_000_000 else created
        if seconds>=item['created_at']-5 and str(task_id) not in known_ids:return False
    return True
