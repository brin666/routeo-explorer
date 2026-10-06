# 南京旧城地图插画 v1

- 生成方式：以内置 ImageGen 生成底图。
- 空间参考：`nanjing-map-structure-v1.svg/png`，按编号顺序表达总统府、六朝博物馆、老门东、夫子庙/秦淮河及街道走向。
- 结果：`nanjing-map-illustrated-v1.png`（1672 × 941），展示 WebP 为 3840 × 2160 重采样文件。

## 复用提示词

```text
Create a detailed north-up bird's-eye illustrated map of Nanjing's old city for an interactive walking itinerary. Use the supplied numbered structure sketch as the exact spatial guide. Preserve the four-stop order and their relative locations: the Presidential Palace in the upper-left/north area, Six Dynasties Museum nearby to its east, Laomendong in the lower central-south area, and Confucius Temple beside the Qinhuai River farther southeast.

Show the city as a readable map with irregular historic blocks, broad main roads, narrow winding lanes, courtyards, small tree gardens, wall fragments, and a recognizable Qinhuai river edge. Give each district a different block rhythm; do not fill the entire canvas with repeated equal squares. Keep the landmark compounds distinct but integrated into the city fabric. Use detailed hand-painted 2.5D overhead map rendering, warm ivory streets, varied grey and ochre roofs, leafy greens, and soft daylight.

Landscape 16:9, north at top. Leave walkable street corridors visible between the landmark anchors. The structure sketch determines layout; do not invent a new scenic viewpoint or move the stops.

Background only: no route line, no dashed path, no pins, no numbered markers, no place labels, no text, no UI, no legend, and no watermark.
```

最终插画锚点以 `routes-data.js` 的南京 `storyArtwork.markers` 为准；当前步行线是视觉示意，尚无已归档的高德步行节点。
