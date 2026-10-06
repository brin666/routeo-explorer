# 成都慢行地图插画 v1

- 生成方式：以内置 ImageGen 生成底图。
- 空间参考：`chengdu-map-structure-v1.svg/png`，明确人民公园、宽窄巷子、武侯祠、锦里和连接街道。
- 风格参考：`beijing-map-illustrated-v2.webp`，仅参考地图绘制细节与暖色街道质感。
- 结果：`chengdu-map-illustrated-v1.png`（1672 × 941），展示 WebP 为 3840 × 2160 重采样文件。

## 复用提示词

```text
Create a polished, highly legible north-up bird's-eye illustrated city map for a Chengdu walking route. Use the numbered structure sketch as the exact spatial layout and landmark guide; use the Beijing reference only for detailed 2.5D illustrated map rendering, warm cream roads, rich small-scale city texture, and natural asymmetric blocks.

Show People's Park as a large lush park in the upper-left area, Kuanzhai Alley as a historic courtyard and lane district nearby toward the upper-middle-left, Wuhou Shrine as a traditional temple complex in the lower-middle-right, and Jinli as a narrow traditional pedestrian street directly adjacent to the east/southeast of Wuhou Shrine. Fill the rest with believable, varied Chengdu urban blocks, curving side streets, tree-lined avenues, small courtyards, pocket gardens, and textured roof patterns. Avoid repetitive grid squares.

Keep the city plan readable at a glance, with broad light-colored roads separating irregular blocks. Use crisp fine details, soft daylight, and balanced warm streets, leafy greens, and roof colors. The result must read as an overhead map rather than a cinematic landscape. Preserve the stop order and relative positions in the sketch.

Background only: no text, route line, dashed path, pins, labels, numbers, legend, UI, or watermark.
```

最终插画锚点以 `routes-data.js` 的成都 `storyArtwork.markers` 为准；当前步行线是视觉示意，尚无已归档的高德步行节点。
