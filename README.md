# 冥想盆 · The Pensieve

选择照片 → 魔杖银丝注入水面 → 触碰水面 → 生成并观看 AHOLO Lux3D 模型。

## 运行

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
# 在启动环境中配置 AHOLO_KEY，或使用下面的隐藏输入方式
.venv/bin/python server.py --prompt-key
```

打开 http://localhost:4174 。服务仅监听本机，API key 只保留在服务端进程内存中，不写入文件、不返回浏览器。重启时需重新提供环境变量或隐藏输入。

## 使用

1. 选择照片，点击「注入记忆」。这一步不上传照片，也不消耗生成额度。
2. 触碰水面，进入「3D 记忆」。点击「生成 3D 记忆 · 使用 1 次额度」才上传当前照片。
3. 使用官方 Asset + Lux3D SDK：G1、50,000 面、GLB。服务异步查询并下载模型，浏览器可以离开。
4. 生成完成后可拖动旋转、滚轮/双指缩放，随时切回原照片。
5. 重新打开网页会恢复已提交的记忆；单纯本地注入、未提交生成的照片刷新后清空。

单张图生成的是 AI 补全的物体模型，不保证复原看不到的背面，也不是整张生活场景的真实 3D 扫描。主体清楚、遮挡少的照片更适合 Lux3D。整室漫游需另接 World/3DGS。

## 额度与数据

- 本轮最多 10 次提交预留，状态保存在 `.runtime/state.json`。不要删除该文件来重置计数。
- 同样照片规范化后按 SHA-256 去重；重复触摸和查看不重新生成。
- 单任务执行，不自动重试生成 POST。提交结果不明时停止并提示控制台核对。
- 上传失败等情况也保守占用一次本地预留，因此界面次数是提交尝试上限，不是平台实际账单。
- 查询/下载失败可继续查询已有任务，不创建新的任务。
- 只上传当前主动生成的照片，发送前压缩到最长边 2048 并去除 EXIF。生成照片和模型保存在本机 `.runtime/`，该目录不应提交 Git。
- 服务向浏览器提供照片/模型缓存，平台生成结果 URL 不直接依赖其两小时有效期。
- 不包含账户余额计费查询；平台实际收费以 AHOLO 控制台为准。

## 验证

```sh
.venv/bin/python -m unittest -v test_server
node --check dist/app.js
node --check dist/memory3d.js
```

额度、去重、并发与请求校验测试使用隔离临时目录和模拟任务，不调用 AHOLO。

## World 空间验证

官方 World SDK 1.4.0 已接入。服务端 `/api/memories` 支持 `mode: "world"`，与 Lux3D 共用 10 次预算；同图在不同模式下独立缓存。当前网页默认生成按钮仍调用 Lux3D，不会自动判断照片类型。

World 验证页面：http://localhost:4174/world/ ，支持实际 3DGS 环顾/微移、生成全景图、原照片对比。World 记忆在冥想盆中也可打开对应入口。微移没有角色/墙体碰撞，不能作为真实行走结果。

World 数据保存在 `.runtime/<memory-id>/`，包括空间 SPZ 或 PLY、全景 JPG（若返回）、provider-result.json。官方 Viewer 1.11.0 存在 `dist/vendor/aholo/`。
