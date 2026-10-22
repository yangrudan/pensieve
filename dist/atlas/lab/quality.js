// Visual review of cached outputs, independent of API task completion.
export const reviews={
 'stone-hall-reference-v1':{label:'未通过 · 仅氛围预览',summary:'大厅可打开，但细节模糊、背面由 AI 补全；尚未达到可承载记忆地点的世界标准。',structure:'局部可见，完整空间待验证',detail:'未通过：细节模糊、魔法石位置有变化'},
 'stone-hall-multiview-v1':{label:'未通过 · 结构失真',summary:'模型存在拉伸和漂浮色块，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：拉伸、漂浮',detail:'未通过：无法辨认完整大厅'},
 'stone-hall-multiview-v2':{label:'未通过 · 结构残缺',summary:'修正输入后模型仍残缺、塌缩，不能作为正式世界。推荐视角只能展示全貌。',structure:'未通过：残缺、塌缩',detail:'未通过：无法辨认完整大厅'}
};
export function reviewFor(memory){return reviews[memory?.case]||null;}
