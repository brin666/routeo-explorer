# Routeo 插画路线图 SOP

这份 SOP 用于维护原有广州、成都 CD-01、南京 NJ-01、西安 XA-01，以及20261013批次的20城路线。页面展示的是可缩放的路线插画，不是导航地图；高德资料只用于校准地理关系。插画路径标为视觉示意，高德节点与交通数据单独归档。

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
- 故事地图由 `storyArtwork` 提供底图、路线和点位。首页卡片直接使用生成的 `storyArtwork.image`，不叠加地点标签、点标或路线；悬停时间轴作为独立网页层呈现。
- 高德真实经纬度采用 `GCJ-02` 单独归档，不能写入插画画布的 `x/y` 字段。画布锚点是视觉位置，不是经纬度。

## 共用交互与动画

- 第一幕和第二幕展示干净底图与逐个出现的地标点，不显示路径虚线。
- 第三幕启动后，通过共享 Remotion composition 按站点分段绘制虚线；到达每站时停顿，动画完成后整条路线保留。行程一览可在后续继续开合。
- 所有路线共用 `route-map.js` 与 `remotion/route-path-motion.jsx`，不为单城复制动画或相机逻辑。
- 实景照片按景点顺序组成连续卡片堆。跨景点翻页时沿用同一组照片与动画；没有照片的景点自动跳过，手动选择时显示待补状态。地点、作者来源和缩略图随当前照片更新。
- 实景照片区采用“上方照片、下方参考笔记”：照片保留作者与原始来源入口，许可/使用状态保存在资料数据中，不放在照片主界面。下方按当前景点汇总完整笔记，以公开笔记 ID 去重，并标明当前照片来自哪一篇；额外攻略来源不冒充该照片的出处。
- 采集按景点覆盖选择多位博主的独立记录，优先补不同角度、时段和体验。找不到可确定地点的第二位作者照片时保留真实缺口，不强行凑图；标题、正文、原始图片与作者一一对应，原始来源不可因改版丢失。
- 餐饮卡片展示具体分店、人均消费和价格来源，采集日期与历史记录保留在数据及 Agent 提示词中。茶饮消费与正餐人均分别标注，不能用其它分店或演出套餐的价格代替。
- 餐饮图库按菜单/价牌、餐品、环境、参考配图排序；没有菜单时只提示餐品照片。桌面悬停预览，点击打开图库，支持缩略图、翻页、旋转和关闭；切换页签或关闭行程面板时同步收起预览与图库。
- Remotion Player 就绪后才能 seek。播放器加载失败时不应让站点动画回调报错；路线动画仍须经过实际的站点锚点。
- 用户滚轮/双指缩放、拖动、选择地标或开合行程一览时，地图视角可以变化，但虚线动画要继续；线路和标点必须随底图保持对齐。
- 地图目前沿用轻度放大的上限 `1.25×`，源图尺寸记录在各路线数据中。4K WebP 若由重采样得到，不能增加原始细节。

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

### 20261013 批次的可重复导入

- 本地制作工作目录：`D:\routeo\tools\batch20`，保存三份已审读 `plans-*.json`、地理归档与采集前后快照；原始素材不搬走，也不执行素材目录的脚本。
- `assets/routes/batch20/` 按城市保存结构 SVG/PNG、layout、生成提示词、原生 PNG、展示 WebP、成图校准、POI/交通归档、采用记录与页面数据。
- 每城独立生成图片。结构图决定相对位置，广州现有地图仅决定画风；不得让风格参考中的河流、地标或城市布局被复制到新城。
- `*-calibration-v1.json` 保存真实源图尺寸、成图 `markers`、`route` 与 `segmentPaths`。生成后逐图检查，不直接照抄草图坐标；各段穿过相邻标点，并沿可见道路或桥梁走。
- 只把同时存在展示图和完整校准的城市注册到 `assets/routes/batch20-data.js`。原四条保留，旧mock路线继续不出现在首页；城市筛选根据活动路线自动生成。
- 作者原线、明确当天段和整理后的删减版分别保留。在行程页注明路线依据，建议钟点与作者时段分开，并写入复制给 Agent 的内容。
- 实景只采用可辨认地点的照片，暂无图片时显示待补和参考笔记，悬停不使用插画冒充实景。人均、菜单、预约不够时保持待补；无有效时长/距离的交通选项不展示。
- 窄屏仍用全覆盖底图，初始视野靠近第一站，保证至少能看到起点；支持拖动、缩放及回到起点，不缩到图外露白。

本批次完成选图与校准后，使用项目内导入器更新数据、图片副本和逐景点交接单：

```powershell
node scripts/import-20261013-city-batch.mjs --materials "D:\小红书数据采集\20城市一日路线_20261013" --workdir "D:\routeo\tools\batch20"
```

导入器消费人工审读后的计划和校准，不替代资料审读或图片生成。未来另一批城市应先建立独立批次与稳定路线 ID，再沿用同一数据契约，避免覆盖本批次。

制作结束后重新扫描原采集目录，与初始快照比较文件大小、修改时间及路线分析哈希。对新增正文、照片、路线身份或来源分类逐项审读后再导入；只有汇总核验文件更新时记录更新范围，不将其算作新增实景。采用与剩余缺口见 `handoffs/2026-10-13-batch20-missing-materials.md`。

### 资料收集分工

用户提供图文攻略正文、全部配图、作者、日期、来源链接，以及地标照片和餐饮分店线索。攻略篇数按信息覆盖与交叉核对需要调整；不以固定数量作为开始制作的硬性门槛。

制作方负责通过高德核对 POI 身份、地理关系、入口与相邻站点交通。用户无需另行准备地图截图。真实查询数据与插画画布坐标分开保存，生成后再按可见地标重新校准路线。

照片与餐饮资料暂未齐时，可以先交付地图预览并保留明确的待补状态；不编造餐饮价格、店铺或预约规则。当地公开网页图片仅作参考，使用权限未确认的照片保存在本地忽略目录，发布前另行处理。

餐饮资料统一写入 `assets/routes/dining-data.js`：每家店的 `perPerson` 保存金额、来源、原始链接和核对日期；`photos[]` 保存图片、类型、标题、出处与署名。价格和图片分别核对，不把菜单单品价格当成人均消费。优先找可识别店名或分店地址的菜单，保留原图水印，不能把其它门店或泛用餐品图当作该分店实拍。

### 每个景点完成后的资料交接

每完成一个景点的制作或资料更新，都向用户附上该景点的缺失资料清单，并给出可直接转交给另一个 Agent 的任务文本。批量交付时逐景点列出，不能只给整条路线一句“资料待补”。没有必补项时明确写“无必补项”，可选优化单列。

- 写明城市、路线 ID、景点名称；餐饮写到具体分店与地址。
- 先列已采用的照片数量与内容、已核对信息，再列缺口，避免重复采集。
- 区分“尚未找到”“已有但过旧/不清晰/未核实”和“可选优化”；注明它影响照片墙、地图地标、餐饮图库或实用信息中的哪一处。
- 按优先级说明具体要找什么、建议数量或角度、可以接受的证据。地图 POI 与交通查询由制作方处理，不把已经核对的坐标再次交给用户采集。
- 返回资料应包含原图文件或可打开的原图链接、图片说明、景点/分店身份、原始来源页、作者/署名与拍摄或发布日期（未知写未知）。价格、开放与预约信息附原始证据，不能把查找当天当成拍摄日期。
- 在项目 `handoffs/` 中保存当次清单；下一次收到资料后更新已补项及剩余项。回复中给出文件地址和最优先的缺口。

转交提示词采用以下结构：

```text
请为 Routeo 的【城市 / 路线 ID / 景点或具体分店】补齐以下资料。
已采用：……（避免重复搜集）
必补：……（逐项说明用途、缺口、数量/角度或证据要求）
待核实：……（已有资料的时效、清晰度或身份问题）
可选优化：……
请只收集本清单所列资料，优先给可打开的原始来源和本地原图。
每项记录景点/分店、资料说明、来源页、作者、拍摄/发布日期、文件名。
价格请区分平台人均、菜单单价、个人消费及套餐；找不到写未找到，不推测。
保留原始证据与图片水印，不修改项目代码。按景点和分店分别整理后交回。
```

CD-01 示例：`assets/routes/chengdu-cd01-amap-reference.json` 保存高德查询；`chengdu-cd01-map-structure-v1.svg/png` 保存草图；`chengdu-cd01-map-calibration.json` 保存插画锚点；`chengdu-cd01-data.js` 提供路线页面数据。

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

## 早期五城示例归档

以下五条示例已经从活动路线列表移除，表格保留其绘图记录作为风格与校准参考。表中 `x/y` 是实际底图像素坐标，不是地理坐标。除杭州 POI 记录外，表内路线都未归档高德步行节点，仍属于视觉示意。

| 城市 | 底图源 / 展示图 | 画布锚点（按行程顺序） | 地理校准状态 |
| --- | --- | --- | --- |
| 苏州 | `suzhou-map-redrawn-v2.png` / `.webp`，`1536 × 1024` | 拙政园 `(275,220)`；苏州博物馆 `(508,285)`；平江路 `(1030,730)`；耦园 `(1308,677)` | 新底图已去除烘焙路线和点标；步行线为视觉示意 |
| 杭州 | `hangzhou-map-illustrated-v7.png` / `.webp`，`1672 × 941` | 断桥 `(1425,200)`；平湖秋月 `(1150,190)`；苏堤 `(770,790)`；雷峰塔 `(1100,580)` | POI 坐标已记录；三段高德步行节点待归档 |
| 南京 | `nanjing-map-illustrated-v1.png` / `.webp`，`1672 × 941` | 总统府 `(360,180)`；六朝博物馆 `(650,250)`；老门东 `(1080,650)`；夫子庙/秦淮河 `(1460,700)` | 地标位置和步行线为插画校准稿，待高德核对 |
| 成都 | `chengdu-map-illustrated-v1.png` / `.webp`，`1672 × 941` | 人民公园 `(360,285)`；宽窄巷子 `(675,255)`；武侯祠 `(1115,625)`；锦里 `(1325,650)` | 地标位置和步行线为插画校准稿，待高德核对 |
| 北京 | `beijing-map-illustrated-v2-source.png` / `.webp`，`1672 × 941` | 天安门 `(835,800)`；故宫 `(835,493)`；景山 `(820,174)`；北海 `(335,176)` | v2 保留真实中轴、周边胡同改为不规则街区；路线待高德核对 |

各城结构草图位于 `assets/routes/{city}-map-structure-v*.svg/png`。底图生成提示词和版本记录放在同目录的 `*-prompt.md`。当前生成源图为 `1536 × 1024` 或 `1672 × 941`；展示 WebP 放大至匹配比例的 4K 尺寸，重采样只改善显示文件采样，不增加源图细节。

## 交付验收清单

### 增量补齐资料的接入

20261013批次01沿用已定稿地图，只追加已核实的照片、分店和参考字段：

1. 先按路线ID与景点/分店对照旧清单，识别已有、待复用、已补齐和仍待核。别名需要明确映射，不能靠模糊匹配合并不同实体。
2. 照片先核地点身份与原文件；历史封闸图只作资料，题名石等身份细节不冒充大景。重复图按原文件SHA256或既有资产地址去重。菜单优先排序但注明未知版本，不把品牌稿当分店现行菜单。
3. 景点信息按字段采用。只有对应本地原文引用能匹配的参考字段才进入说明；历史优惠、临时公告和当日库存分开。把来源与未核项同时交给复制提示词。
4. 使用高德真实POI或明确命名的地理编码入口。近日楼采用南门兴趣点参考，不能把附近店铺坐标贴给城楼；真实路线节点与插画路径仍分开保存。
5. 用独立数据补丁叠加基础路线，保留原图、三幕、点位层和虚线。跑完补丁导入后生成最新采用索引与逐景点缺口，旧清单保留作历史快照。

本批实现：`scripts/import-20261013-batch01-dining.mjs`、`scripts/import-20261013-batch01-materials.mjs`、`scripts/report-20261013-batch01-adoption.mjs`，按此顺序运行。新批次可复用字段处理与接入方式，但需要独立批次名及明确的主线/分店匹配，不能直接覆盖本批记录。

- POI 名称、行程顺序、已核实经纬度和视觉锚点一一对应；缺少资料时明确标注待核。
- 底图可读作城市地图，地标周围街区有变化；底图本身没有路线、点标、文字或水印。
- 结构草图、生成 PNG、提示词、展示 WebP 和尺寸记录都已归档。
- `storyArtwork.width/height`、SVG 路线和全部 marker 使用同一坐标系；逐个确认路径穿过每个点位中心。
- 第一/二幕无虚线；第三幕虚线逐站绘制，动画结束后保留；移动地图时路线、点标与底图对齐。
- 检查桌面与手机的裁切、标签碰撞、地图缩放上限、拖动边界、回到全图，以及行程一览再次打开。
- 检查普通播放、动画前/动画中手动缩放、减少动态偏好；Remotion bundle 与 JSX 源码保持同步。
