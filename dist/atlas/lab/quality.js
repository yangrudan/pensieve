// Visual review of cached outputs, independent of API task completion.
export const reviews={
 'stone-hall-daylight-v1':{label:'未通过 · 侧移异常与物件增生',summary:'正面明亮、房间轮廓较清楚，但出现额外的白色近景水晶，侧移更明显，背面也补出额外水晶；石材细节仍模糊。仅用于对比，不接入正式世界。',structure:'未通过：侧移出现异常近景；背面补出额外水晶',detail:'未通过：石材与水晶细节仍糊化'},
 'stone-hall-reference-v1':{label:'未通过 · 仅氛围预览',summary:'大厅可打开，但细节模糊、背面由 AI 补全；尚未达到可承载记忆地点的世界标准。',structure:'局部可见，完整空间待验证',detail:'未通过：细节模糊、魔法石位置有变化'},
 'stone-hall-multiview-v1':{label:'未通过 · 结构失真',summary:'模型存在拉伸和漂浮色块，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：拉伸、漂浮',detail:'未通过：无法辨认完整大厅'},
 'stone-hall-multiview-v2':{label:'未通过 · 结构残缺',summary:'修正输入后模型仍残缺、塌缩，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：残缺、塌缩',detail:'未通过：无法辨认完整大厅'}
};
export function reviewFor(memory){return reviews[memory?.case]||null;}
