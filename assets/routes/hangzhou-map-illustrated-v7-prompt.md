# 杭州西湖地图插画 v7

- 生成方式：以内置 ImageGen 生成底图。
- 空间参考：`hangzhou-map-structure-v7.svg/png`；草图决定湖岸、堤岸、道路和景点位置。
- 风格参考：`beijing-map-illustrated-v2.webp`；仅参考细节密度、道路配色和俯视手绘质感。
- 结果：`hangzhou-map-illustrated-v7.png`（1672 × 941），展示 WebP 为 3840 × 2160 重采样文件。

## 复用提示词

```text
Create a north-up bird's-eye illustrated map of Hangzhou West Lake for an interactive walking itinerary. Treat the numbered structure sketch as the spatial source of truth. Use the Beijing map reference only for the detailed 2.5D hand-painted rendering, warm cream roads, textured roofs, trees, and legibility; do not copy its palace or street plan.

Show West Lake as the dominant central water shape with clear, walkable banks and causeways. Keep Broken Bridge at the northeast shore, Pinghu Qiuyue on the north shore to its west, Su Causeway as a long tree-lined route across the lake, and Leifeng Pagoda on the south shore. Preserve the order and relative positions from the sketch. Add varied small urban blocks around the lake, irregular garden edges, tree clusters, bridges, and paths. Avoid repeated square blocks and keep walkways readable.

Make the whole frame read as a map rather than a single lake landscape. Landscape 16:9, north at top, detailed map-like overhead composition with soft daylight and balanced turquoise, green, and warm ivory. Leave visible road and causeway surfaces near the four landmark anchors for a thin route overlay.

Background only: no route, no dashed line, no pins, no numbered markers, no place labels, no text, no UI, no legend, and no watermark.
```

最终锚点以 `routes-data.js` 的杭州 `storyArtwork.markers` 为准。高德 POI 经纬度在 `map.storyMap.reference.points` 中单独记录，三段步行节点仍待归档。
