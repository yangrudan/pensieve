# World 接入与空间验证

当前已接入 World 单图空间生成、后台查询和本地 3DGS/全景缓存。独立验证入口为 http://localhost:4174/world/ 。冥想盆中已生成的 World 记忆直接嵌入空间查看器。生成前由用户选择「物件 / 空间」，没有自动分类。World 由独立的 Aholo Viewer 加载。

## 推荐的第一阶段

单张室内照片 → Asset 上传 → World generations.create → 持久化 worldId → 查询 SUCCEEDED → 缓存空间资源 → 触碰水面打开 Aholo Viewer。

界面已有「物件 / 空间」选择，目前只做空间内环顾和有限移动。不要把没有碰撞体的相机飞行称为可行走漫游。

## 服务端

安装官方 `manycore-aholo-sdk-world`。继续使用 AHOLO_KEY 和国内区配置。下面是调用关系示例；应用实际调用会先进行额度预留和去重：

```python
import os
from manycore.aholo_sdk_core import AholoClientConfig
from manycore.aholo_sdk_asset import create_asset_client
from manycore.aholo_sdk_world import create_world_client

config = AholoClientConfig(api_key=os.environ["AHOLO_KEY"], region="cn")
asset = create_asset_client(config)
world = create_world_client(config)
image = asset.upload_file("room.jpg")
operation = world.generations.create(
    name="记忆中的房间",
    resources=[{"type": "image", "url": image.url}],
    prompt="根据参考照片生成室内空间，尽量保持可见家具、布局和光线",
)
# 立即保存 operation["worldId"]；恢复时只查询此 ID，不重新 create。
detail = world.wait_for(operation["worldId"])
urls = detail.get("assets", {}).get("splats", {}).get("urls", {})
```

REST 对应 `POST /world/v1/generations`、`GET /world/v1/{worldId}`。鉴权为 Authorization 直接放 API key，无 Bearer 前缀。

World 状态为 PENDING / PREPROCESSING / RUNNING / SUCCEEDED / FAILED / CANCELED / TIMEOUT / REJECTED。不能复用 Lux3D 的数字状态映射。

接口可能返回 `assets.splats.urls` 下的 `plyPath`、`spzPath`、`lodMetaPath`，具体字段可用性以实际任务为准；生成空间还可能提供 `assets.imagery.panoUrl`。缓存资产，并依据实际格式选择 Viewer 加载器。按 `assets.semanticsMetadata.upAxis` 处理坐标朝向，不要硬编码某个示例的 -Y up。

## 前端

使用 `@manycore/aholo-viewer`。建议新增独立的空间查看模块，按需加载；保留当前 Three.js 石盆和 GLB 物件查看器。切换空间时停止旧渲染并释放 GPU 资源。

基本关系是 createViewer → 读取与解析 3DGS 资源 → createSplat → viewer.getScene().add → setCamera → viewer.render。官方快速开始演示 SOG；World 返回其他格式时必须选择对应解析类型，不能只是改文件扩展名。

若使用 LoD，需要同步元数据引用的资源并保留相对路径；单个 GLB 那样只缓存一个文件不够。移动端要限制像素比与数据规模。

## 第二阶段：真正行走

3DGS 是高斯场，没有可直接用于角色碰撞的实体墙。用 splat-transform 的 Voxel 任务生成体素碰撞数据，或生成 collision.glb，再接入地面检测、角色胶囊体和行走控制。先确定生成场景质量，再投入此步骤。

## 额度

与 Lux3D 共用同一个 10 次总预算、单任务锁、任务持久化和不自动重试创建的规则。缓存键必须包含模式与参数（例如 world-v1 + prompt + image hash），避免照片相同时错用已有 GLB。接入 World 不代表已验证单次费用，实际费用以平台为准。

## 边界

World generation 支持文字、最多一张图片或图文。室内较成熟，室外为 Beta。单图不可见部分由 AI 补全，不保证忠实还原。真实空间 reconstruction 需要至少 20 张多视角图片或合规视频素材；它不是单图生成接口。

官方参考：
- https://labs.aholo3d.cn/api-docs/sdk/python
- https://labs.aholo3d.cn/api-docs/openapi.json
- https://aholojs.dev/zh-CN/manual/getting-started/
- https://aholojs.dev/zh-CN/manual/physics-collision/
