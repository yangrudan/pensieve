# 冥想盆 · The Pensieve

选择照片 → 魔杖银丝注入水面 → 触碰水面潜入记忆 → 查看原片或 AHOLO 立体结果。

## 运行

```sh
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
# 在启动环境中配置 AHOLO_KEY，或使用下面的隐藏输入方式
.venv/bin/python server.py --prompt-key
```

打开 http://localhost:4174 。服务仅监听本机，API key 只保留在服务端进程内存中，不写入文件、不返回浏览器。重启时需重新提供环境变量或隐藏输入。

## 使用

1. 选择照片，点击「注入记忆」。银丝、涟漪和可选音效完成注入；这一步不上传照片、不消耗生成额度。
2. 触碰水面，镜头潜入后立即查看原照片。选择「立体记忆」可手动选择「物件 / 空间」，确认生成才上传照片。
3. 物件默认 Lux3D G1、50,000 面、GLB；空间使用 World。后台异步查询并缓存结果，浏览器可以离开。
4. 物件支持旋转和缩放；空间直接进入嵌入的 3DGS 视图，并保留全景及原片对比。退出会释放查看器。
5. 首页记忆碎片可切换已保存结果。仅本地注入、未提交生成的照片刷新后清空。

单图生成会补全不可见部分，不能保证忠实还原。物件应选择轮廓清楚、背景简单的单主体照片；空间建议先清理人物。目前没有自动分类或自动去人物。

## 混合实验 · 记忆大厅

入口：http://localhost:4174/atlas/hybrid/ 。固定 Mesh 大厅、水池与魔法石，复用 AHOLO 本地全景作为环境照明和窗景。点击魔法石后可将已有记忆放入对应地点；不自动修改标签，不新增生成调用。它尚未使用云端 3DGS 与 Mesh 同帧渲染。实现边界与检查见 [HYBRID_HALL.md](HYBRID_HALL.md)。

## 第二章 · 星石之境

入口：http://localhost:4174/atlas/ 。第二章是独立的 Three.js 世界，不替换第一章。

- 默认有家、工作室、旅途中、花园、故乡五颗不同颜色的魔法石，可新增地点（最多 12 个），也可编辑地点名称与颜色。
- 在第一章打开任意记忆，点击「为记忆标记地点」，选择一个或多个地点后保存。
- 未生成模型的照片在保存标签时会归档到本机；刷新后仍可在第一章找到。不会提交 AHOLO，不占用生成额度。
- 在第二章点击魔法石或底部地点按钮，可查看关联的记忆。支持原照片、已有 GLB 和 World 空间；没有记忆的地点会提示如何收藏。
- 地点和关联存入 `.runtime/state.json`，照片仍在 `.runtime/`。本地照片之后生成模型时会自动迁移地点标签。
- 第二章支持拖动环顾、缩放、地点镜头聚焦，以及手机上的地点面板。它是用于组织记忆的虚构世界，不是 AHOLO 生成的真实地点重建。

## 版本管理

- `v0.1.0`：原始可运行版本快照；`v0.2.0`：魔法场景、潜入过渡、记忆碎片、空间内嵌及四视图研究路线。
- `v0.3.0`：新增第二章星石之境、地点管理、跨章节记忆标签与本地原片归档。
- 本地 Git 管理；私人照片、生成模型、实验记录和密钥不进入仓库。
- 场景背景由内置图像生成工具制作，已转为本地 WebP；完整提示词在 [memory-chamber-prompt.txt](dist/assets/memory-chamber-prompt.txt)。实时水面、银丝、烛光及符文由 Three.js 渲染。
- [AHOLO 探索结果与边界](AHOLO_EXPLORATION.md)：记录早期 7 / 10 次提交，含去人物空间和四视图物件实测。

## 额度与数据

- 本轮累计最多 40 次提交预留（用户已将上限由 10 次提升至 40 次），状态保存在 `.runtime/state.json`。不要删除该文件来重置计数。
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

官方 World SDK 1.4.0 已接入。服务端 `/api/memories` 支持 `mode: "world"`，与 Lux3D 共用 40 次预算；同图在不同模式下独立缓存。网页提供「物件 / 空间」手动选择，不会自动判断照片类型。

World 验证页面：http://localhost:4174/world/ ，支持实际 3DGS 环顾/微移、生成全景图、原照片对比。World 记忆在冥想盆中直接嵌入空间查看器。微移没有角色/墙体碰撞，不能作为真实行走结果。

World 数据保存在 `.runtime/<memory-id>/`，包括空间 SPZ 或 PLY、全景 JPG（若返回）、provider-result.json。官方 Viewer 1.11.0 存在 `dist/vendor/aholo/`。

## 魔法石之境 · World 实验

实验前版本为 `20ea00d` / `v0.3.0`，检查点 `checkpoint-before-world-experiments`。实验在 `feat/aholo-stone-world` 分支，第一章的场景与仪式没有替换。

实验页：http://localhost:4174/atlas/lab/ 。实验包括一张 AI 概念图的 World generation、一个固定三维大厅的 24 个重叠相机视角的 World reconstruction，以及修正纹理与焦距信息后的第二轮重建。两组不是只改变图片数量的严格对照；合成视角也不是真实地点拍摄。

原始输入准备命令（不调用 AHOLO）：

```sh
.venv/bin/python scripts/prepare_world_reference.py
# 需另行安装 Playwright 及其 Chromium 浏览器，仅用于本地采集
.venv/bin/python scripts/capture_world_views.py
.venv/bin/python scripts/capture_world_views.py --variant v2
```

实验创建端点 `POST /api/experiments` 接收本机预先准备的 case 名称，读取 `.local/world-lab/<case>/manifest.json`。提交前校验图片数量、文件内容和唯一性；与记忆生成共用 40 次累计上限。同一输入哈希复用任务，不自动重试创建。最多并行两个实验，个人记忆任务仍受原有单任务规则约束。

实验不加入 `/api/memories` 的个人记忆列表，也不修改地点标签。结果通过 `/world/?id=<id>&experiment=1` 查看；查看与查询不创建新任务。

生成图像及完整提示词：[stone-world-prompts.md](dist/assets/stone-world-prompts.md)。私有运行状态、24 张输入图、相机位姿和平台返回仍不提交 Git。

实际返回与质量评估：[WORLD_EXPERIMENTS.md](WORLD_EXPERIMENTS.md)。

### Mac mini / 多机器查看实验

四组 AI 大厅实验现随私密仓库保存于 `shared/world-lab/`（约 45 MB）。另一台机器执行 `git pull --ff-only` 并重启 Python 服务后，可直接打开 `/atlas/lab/`。无需重新生成，也不要复制覆盖 `.runtime/state.json`。

服务端将这些已完成实验作为只读资源加载，保留本机生成的记忆、地点标签与额度计数；同 ID 或同 case 的本机实验优先。个人照片和模型仍不提交 Git，不会自动跨机器同步。资源范围与加载规则见 [共享实验说明](shared/world-lab/README.md)。


### 世界查看器的最佳视角与流畅预览

实验页可直接点击「最佳视角」打开并定位大厅；拖动后再次点击即可回到预设位置。两个未通过质量检查的重建结果会定位到全貌，不会把残缺模型描述成完整大厅。

同一实验内切换输入图与 3D 会复用查看器，隐藏时暂停渲染。3D 渲染不再随高像素密度设备放大，静止时约限制在 85 万像素、拖动时约 42 万像素，并限制请求绘制频率。单图版另有「流畅全景」，可快速环顾，不下载或解析 SPZ；全景不能改变拍摄位置。

已用高像素密度浏览器验证一键定位、拖动后复位、单次 SPZ 加载、查看器复用及手机布局；这些操作不新增 AHOLO 任务。
