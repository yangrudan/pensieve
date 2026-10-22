"""Prepare the daylight single-image case locally; never submits an API task."""
from pathlib import Path
import json, shutil
root=Path(__file__).resolve().parents[1]
folder=root/'.local/world-lab/stone-hall-daylight-v1'
folder.mkdir(parents=True,exist_ok=True)
shutil.copyfile(root/'dist/assets/stone-hall-daylight-reference.jpg',folder/'reference.jpg')
manifest={'name': '魔法石之境 · 日光清晰度验证', 'method': 'generation', 'images': ['reference.jpg'], 'prompt': 'A physically coherent human-scale stone memory sanctuary. Preserve the reference photograph geometry, the single round low basin, the five separate stone plinths and exactly five distinct emerald green, violet, amber gold, rose pink and ice blue crystals in their original positions. Maintain sharp matte limestone texture and continuous patterned stone floor, clear room corners, diffuse daylight, balanced exposure and wide unobstructed walkways. One enclosed room only. Unseen space is simple, continuous and consistent with the visible room. Deep focus. No people, fog, bloom, floating objects, duplicated pools, duplicated crystals, mirrors, added rooms or extra floors. Water is still and dark, not a mirror.', 'scene_provenance': 'AI generated architectural reference for single-image World generation, diffuse daylight and matte surfaces. Not a scanned real place.'}
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Prepared daylight input; no API request was made.')
