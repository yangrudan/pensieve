"""Prepare a repeatable reference case from the committed generated artwork."""
from pathlib import Path
import json,shutil
root=Path(__file__).resolve().parents[1];folder=root/'.local/world-lab/stone-hall-reference-v1';folder.mkdir(parents=True,exist_ok=True)
shutil.copyfile(root/'dist/assets/stone-hall-reference.jpg',folder/'reference.jpg')
manifest={'name':'魔法石之境 · 单图生成对照','method':'generation','images':['reference.jpg'],'prompt':'一个真实尺度的哥特式记忆魔法大厅。严格保留参考图可见的石柱、尖拱窗、地板、中央圆形浅池和五颗不同颜色的水晶及其石台。翡翠绿、紫晶、琥珀金、玫瑰粉和冰蓝水晶各一个，彼此独立。地面连续平整，围绕水池有宽阔通道。保持月光、少量暖色灯笼、石材与金属细节。保持原图空间结构，不添加人物，不复制水晶或水池，不新增楼层和多余房间。不可见区域简洁连贯。'}
(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Prepared reference image; no API request was made.')
