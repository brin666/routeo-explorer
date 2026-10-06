# Routeo 插画路线图 SOP

这份 SOP 用于维护现有五城路线，并制作新的城市路线图。页面展示的是可缩放的路线插画，不是导航地图；高德资料只用于校准地理关系。没有存档高德步行节点时，路线一律标注为视觉示意。

## 设计规范

- 地图采用北向俯视的 16:9 城市地图构图。画面要同时读出地标、道路、街区与自然边界，避免只像一张单点景观海报。
- 先画结构草图，再生成完整底图。草图明确每个景点、周边街区类型、道路走向、河流/公园，以及站点顺序；它是生成图的空间依据。
- 普通街区大小、角度、道路疏密要有变化。只在现实本身规整的宫城或中轴区域保留规整布局；其它区域避免重复方格。
- 插画底图不内嵌路线、点标、地名、文字或 UI。它们由网页矢量层和 HTML 独立绘制，便于校准和缩放。
- 统一使用 Routeo 的细节丰富、自然不规则、暖色道路与绿地的俯视插画风格；可以用北京 v2 作风格参考，但每个城市的结构草图才决定空间布局。

## 数据与画布约定

- `storyArtwork.width/height` 是插画坐标画布，也是 `route` 和 `markers[].x/y` 的坐标系。不可把展示 WebP 的 3840 像素尺寸误当成点位坐标系。
- `storyArtwork.route` 是页面叠加的 SVG 路径，必须从第一站出发，按行程顺序穿过每个 `markers[]` 点位中心。路径可以简化，但不能绕过点位或明显穿过不可通行的水域/建筑。
- 每个 marker 带 `name`；地点有高德 POI 时同时记录 `poiId`，以便和地点资料一一对应。 marker 的颜色和标签位置由前端叠加。
- `sourceDetailSize` 记录生成原图的实际像素；`rasterSize` 记录展示文件尺寸。放大清晰度按原图计算，即使展示 WebP 已放大到 4K，也不能称为原生 4K 细节。
- 当前五城故事地图都由 `storyArtwork` 提供底图、路线和点位。探索卡片的旧地图数据可以保留，但不能作为故事页的点位坐标来源。
- 高德真实经纬度采用 `GCJ-02` 单独归档，不能写入插画画布的 `x/y` 字段。画布锚点是视觉位置，不是经纬度。

## 共用交互与动画

- 第一幕和第二幕展示干净底图与逐个出现的地标点，不显示路径虚线。
- 第三幕启动后，通过共享 Remotion composition 按站点分段绘制虚线；到达每站时停顿，动画完成后整条路线保留。行程一览可在后续继续开合。
- 所有路线共用 `route-map.js` 与 `remotion/route-path-motion.jsx`，不为单城复制动画或相机逻辑。
- Remotion Player 就绪后才能 seek。播放器加载失败时不应让站点动画回调报错；路线动画仍须经过实际的站点锚点。
- 用户滚轮/双指缩放、拖动、选择地标或开合行程一览时，地图视角可以变化，但虚线动画要继续；线路和标点必须随底图保持对齐。
- 五城目前将最大地图缩放设为 `1.25×`（苏州原图为 `1536 × 1024`，其余插画为 `1672 × 941`）。这是轻度放大范围；4K WebP 是重采样展示文件，不能增加原始细节。

## 高德核对流程

1. 按城市和景点名核对 POI 身份，保存 POI ID、名称、经纬度、坐标系和可查看链接。
2. 步行行程按相邻景点分别查询。将每段 AMap 步行结果的 `WalkStep.path` 节点保存为 `[经度, 纬度]`，并记录起点和终点。
3. 对照真实步行线确定道路、桥、堤岸和主要转折。把需要表达的点投影到结构草图及插画，再为网页路线做简化。
4. 路线节点未保存前，`walkingSegments[].status` 保持 `pending`，前端插画路线描述为“视觉示意”，不宣称是高德导航线。
5. API Key 和安全密钥留在本地环境变量，不写入路线数据、提示词或仓库。

高德参考链接：[JS API Walking](https://lbs.amap.com/api/maps-javascript-api/reference/route/walking) · [Web 服务步行路线](https://lbs.amap.com/api/webservice/guide/api/direction)。

### 杭州已存档的 POI 参考

以下 POI 的 GCJ-02 坐标已记录，三段实际步行节点仍待补充。

| 景点 | POI ID | 坐标 `lng, lat` |
| --- | --- | --- |
| 断桥残雪 | [B023B01EE6](https://ditu.amap.com/place/B023B01EE6) | `120.151347, 30.258151` |
| 平湖秋月 | [B023B024F8](https://ditu.amap.com/place/B023B024F8) | `120.146210, 30.252038` |
| 苏堤春晓 | [B023B02070](https://ditu.amap.com/place/B023B02070) | `120.137960, 30.243880` |
| 雷峰塔 | [B023B09LKR](https://ditu.amap.com/place/B023B09LKR) | `120.148849, 30.230934` |

## 新路线制作流程

1. **填写路线输入。** 确认城市、站点顺序、POI 身份、步行方式及资料来源；未确认项标 `pending`，不猜坐标或距离。
2. **制作结构草图。** 使用 `1200 × 675` 逻辑画布，标北向、河流/湖泊/公园、主次道路、地标轮廓、站点编号和路线走向。普通街区要有不同大小和方向。
3. **先审草图关系。** 确认站点顺序与地理方位；让每个站点锚点落在可辨认的景点或入口附近，路线沿道路/桥梁/堤岸走。草图不合理时先修草图。
4. **按草图生成底图。** 把结构草图作为唯一空间布局参考，把北京 v2 作为可选的画风参考。明确无文字、无路线、无点标、无水印；输出后检查是否仍然读得像地图。
5. **校准插画坐标。** 对照生成图逐站记录实际像素锚点，写入 `storyArtwork.markers`。不要只照抄草图百分比；图像模型可能让地标发生偏移。
6. **绘制路线。** 有已归档高德节点时按节点简化；没有时制作视觉示意线。路径的每一段终点必须与对应 marker 重合，转折尽量沿可见道路或步道。
7. **导出与接入。** 保留结构 SVG/PNG 和生成源 PNG；另导出 WebP 展示图。记录源图与展示图尺寸，再更新 `routes-data.js` 和 prompt 记录。
8. **逐城验收。** 桌面与窄屏查看底图裁切、点标/标签和线的重合、行程一览开合、手动缩放/拖动、第三幕完整播放及减少动态偏好。

### 通用地图生成提示词

将花括号部分替换为该城市的内容，并把“结构草图”作为第一张参考图：

```text
Create a detailed north-up bird's-eye illustrated city map for an interactive walking itinerary.
Use reference image 1 as the spatial source of truth. Preserve the relative position and order of its numbered landmark anchors, the water/park boundaries, and the road corridors. Do not move the landmarks to improve composition.
Show {CITY} with these distinct places: {LANDMARKS_AND_RELATIVE_POSITIONS}. Surround them with varied, believable urban fabric: irregular blocks, changing street widths and directions, courtyards, small parks, trees, and recognizable roads. Avoid a repeated square grid except where the real historic plan is intentionally regular.
Use an elegant, finely detailed 2.5D hand-painted overhead map style, warm cream roads, varied roofs, rich but balanced greens, and soft daylight. Keep the overall city plan readable as a map rather than a single scenic postcard.
Landscape 16:9 composition, north at the top. Keep enough clear road and walkway surface around the landmark anchors for a thin route overlay and labels.
Background only: no route line, no dashed path, no pins, no numbers, no labels, no text, no legend, no UI, and no watermark.
Avoid empty margins, repetitive blocks, a cinematic horizon, heavy perspective tilt, and oversized scenery that hides the street network.
```

若再用北京 v2 作风格参考，需在提示词中说清：草图决定空间布局；北京图只决定渲染风格，不复制北京宫城或中轴。

### 路线输入模板

```yaml
routeId: city-theme-walk
city: 城市名
title: 行程标题
orientation: north-up
canvas: 1200x675
stops:
  - order: 1
    name: 景点名称
    poiId: 高德 POI ID 或 pending
    coordinateSystem: GCJ-02
    coordinate: [经度, 纬度] # 未核实填 pending
    mapAnchor: [x, y] # 插画坐标，草图及生成图复核后填写
walkingSegments:
  - from: 景点 A
    to: 景点 B
    status: verified | visual-draft | pending
    nodes: [] # 仅保存真实高德节点，格式为 [经度, 纬度]
assets:
  sketch: assets/routes/{city}-map-structure-vN.svg
  source: assets/routes/{city}-map-illustrated-vN.png
  prompt: assets/routes/{city}-map-illustrated-vN-prompt.md
  display: assets/routes/{city}-map-illustrated-vN.webp
```

## 五城当前版本

所有路线均使用全屏插画画布和共享第三幕动画。表中 `x/y` 是实际底图像素坐标，不是地理坐标。除杭州 POI 记录外，表内路线都未归档高德步行节点，仍属于视觉示意。

| 城市 | 底图源 / 展示图 | 画布锚点（按行程顺序） | 地理校准状态 |
| --- | --- | --- | --- |
| 苏州 | `suzhou-map-redrawn-v2.png` / `.webp`，`1536 × 1024` | 拙政园 `(275,220)`；苏州博物馆 `(508,285)`；平江路 `(1030,730)`；耦园 `(1308,677)` | 新底图已去除烘焙路线和点标；步行线为视觉示意 |
| 杭州 | `hangzhou-map-illustrated-v7.png` / `.webp`，`1672 × 941` | 断桥 `(1425,200)`；平湖秋月 `(1150,190)`；苏堤 `(770,790)`；雷峰塔 `(1100,580)` | POI 坐标已记录；三段高德步行节点待归档 |
| 南京 | `nanjing-map-illustrated-v1.png` / `.webp`，`1672 × 941` | 总统府 `(360,180)`；六朝博物馆 `(650,250)`；老门东 `(1080,650)`；夫子庙/秦淮河 `(1460,700)` | 地标位置和步行线为插画校准稿，待高德核对 |
| 成都 | `chengdu-map-illustrated-v1.png` / `.webp`，`1672 × 941` | 人民公园 `(360,285)`；宽窄巷子 `(675,255)`；武侯祠 `(1115,625)`；锦里 `(1325,650)` | 地标位置和步行线为插画校准稿，待高德核对 |
| 北京 | `beijing-map-illustrated-v2-source.png` / `.webp`，`1672 × 941` | 天安门 `(835,800)`；故宫 `(835,493)`；景山 `(820,174)`；北海 `(335,176)` | v2 保留真实中轴、周边胡同改为不规则街区；路线待高德核对 |

各城结构草图位于 `assets/routes/{city}-map-structure-v*.svg/png`。底图生成提示词和版本记录放在同目录的 `*-prompt.md`。当前生成源图为 `1536 × 1024` 或 `1672 × 941`；展示 WebP 放大至匹配比例的 4K 尺寸，重采样只改善显示文件采样，不增加源图细节。

## 交付验收清单

- POI 名称、行程顺序、已核实经纬度和视觉锚点一一对应；缺少资料时明确标注待核。
- 底图可读作城市地图，地标周围街区有变化；底图本身没有路线、点标、文字或水印。
- 结构草图、生成 PNG、提示词、展示 WebP 和尺寸记录都已归档。
- `storyArtwork.width/height`、SVG 路线和全部 marker 使用同一坐标系；逐个确认路径穿过每个点位中心。
- 第一/二幕无虚线；第三幕虚线逐站绘制，动画结束后保留；移动地图时路线、点标与底图对齐。
- 检查桌面与手机的裁切、标签碰撞、地图缩放上限、拖动边界、回到全图，以及行程一览再次打开。
- 检查普通播放、动画前/动画中手动缩放、减少动态偏好；Remotion bundle 与 JSX 源码保持同步。
