// Visual review of cached outputs, independent of API task completion.
export const reviews={
 'stone-hall-multiview-v3':{label:'结构初检通过 · 细节待提升',summary:'72视角高质量重建已返回真实3DGS。已检查正面、左右及前移0.6、背面和四向环顾：大厅与水池成形，五色水晶及五个底座保持对应，所查视角未发现额外白色水晶或明显拉伸碎片。石材和部分边缘仍有模糊；未接入正式世界或记忆地点。',structure:'初检通过：所查位置空间完整，五颗水晶、五个底座与一个水池未见增生',detail:'待提升：部分石材、轮廓边缘及细小装饰仍有模糊'},
 'stone-hall-daylight-v1':{label:'未通过 · 侧移异常与物件增生',summary:'正面明亮、房间轮廓较清楚，但出现额外的白色近景水晶，侧移更明显，背面也补出额外水晶；石材细节仍模糊。仅用于对比，不接入正式世界。',structure:'未通过：侧移出现异常近景；背面补出额外水晶',detail:'未通过：石材与水晶细节仍糊化'},
 'stone-hall-reference-v1':{label:'未通过 · 仅氛围预览',summary:'大厅可打开，但细节模糊、背面由 AI 补全；尚未达到可承载记忆地点的世界标准。',structure:'局部可见，完整空间待验证',detail:'未通过：细节模糊、魔法石位置有变化'},
 'stone-hall-multiview-v1':{label:'未通过 · 结构失真',summary:'模型存在拉伸和漂浮色块，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：拉伸、漂浮',detail:'未通过：无法辨认完整大厅'},
 'stone-hall-multiview-v2':{label:'未通过 · 结构残缺',summary:'修正输入后模型仍残缺、塌缩，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：残缺、塌缩',detail:'未通过：无法辨认完整大厅'}
};
export function reviewFor(memory){return reviews[memory?.case]||null;}
