"""Fixed text-to-3D prototype; provider submission stays behind server quota guards."""
import hashlib
import json

CASE='emerald-quartz-lux-v1'
PROMPT='''A single exquisite emerald green magical quartz crystal, isolated standalone object.
One upright six-sided crystal prism with a slightly asymmetric pointed crown, crisp polished facets,
fine beveled edges, transparent emerald green gemstone appearance, subtle natural internal striations.
The main body is tall and slender with a clear hexagonal cross section and a narrow lower termination.
Solid coherent watertight gemstone geometry, refined natural crystal proportions, physically based material.
Only the gemstone: no pedestal, no stand, no floor, no room, no surrounding rocks, no companion crystals,
no floating particles, no light rays, no letters or symbols. Product-quality 3D asset.'''

def prototype(case):
    if case!=CASE:raise ValueError('先检查第一颗水晶样品；其余四颗尚未开放提交')
    settings={'case':CASE,'prompt':PROMPT,'version':'G1','face_count':50000,'method':'text_to_3d'}
    mid=hashlib.sha256(json.dumps(settings,sort_keys=True).encode()).hexdigest()
    return mid,settings
