# 苏州地图插画 v2

- 生成方式：以内置 ImageGen 编辑旧底图。
- 编辑目标：`suzhou-map-redrawn.png`。
- 风格参考：`beijing-map-illustrated-v2.webp`。
- 结构依据：`suzhou-map-structure-v2.svg/png`。
- 结果：`suzhou-map-redrawn-v2.png`（1536 × 1024），展示文件为同名 WebP。

## 复用提示词

```text
Edit the supplied Suzhou illustrated map. Preserve its north-up bird's-eye canal-town composition, landmark locations, canal network, bridges, white walls, dark tiled roofs, gardens and natural irregular street pattern. Use the Beijing v2 reference only for its crisp, detailed hand-painted map rendering and warm palette.

Remove every existing route stroke, dashed line, numbered marker, pin, label, and baked-in UI element. Reconstruct the underlying streets, waterways, bridges, trees, courtyards, and rooftops naturally where those overlays were removed. Do not move or redesign the recognizable Suzhou garden and neighborhood landmarks. Keep the original crop and aspect ratio, and retain enough open street/canal-side paths for a thin route overlay to be added later by the website.

Make the result read as a detailed overhead city map, not a scenic postcard. Preserve varied block shapes and winding lanes; do not create a rigid grid. No text, no route, no dots, no labels, no numbers, no icons, no border, no watermark.
```

插画点位以 `routes-data.js` 中的 `storyArtwork.markers` 为准；路线和点标由页面绘制。
