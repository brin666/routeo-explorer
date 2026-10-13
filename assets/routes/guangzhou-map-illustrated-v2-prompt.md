# 广州西关地图插画 v2

- 生成方式：以内置 ImageGen 生成底图。
- 风格参考：`suzhou-map-redrawn-v2.webp`、`beijing-map-illustrated-v2.webp`；仅参考高细节斜俯视手绘地图表现，不复制它们的地标和街区。
- 空间参考：广州四个 POI 的相对位置与珠江、沙面岛的地理关系；最终插画坐标记录在 `routes-data.js` 的 `storyArtwork.markers`。
- 结果：`guangzhou-map-illustrated-v2.png`（1672 × 941）。
- 页面叠加：路线、地点名称与时间由网页图层绘制；底图本身不含文字、路线或标点。

## 复用提示词

```text
Create a wide, north-up illustrated map of central Guangzhou's historic Liwan/Xiguan area connecting Sacred Heart Cathedral, Shamian Island, Yongqingfang, and Shangxiajiu. Use the supplied Suzhou and Beijing images only as style references: match their rich, handcrafted, high-detail miniature city-map rendering, elevated oblique bird's-eye view, warm cream roads, dense varied roofs, lush trees, textured teal water and soft daylight. Do not copy their cities or landmarks.

Show the Pearl River in the lower part of the frame and Shamian as a distinct long green island in the river with old low-rise buildings, leafy avenues and waterfront promenades. North of the river, show a dense irregular old-city street fabric with varied urban parcels, winding streets, Lingnan arcade streets, Xiguan houses, courtyards, small gardens and many smaller buildings. Place Yongqingfang west of Shangxiajiu, Shamian south of both, and Sacred Heart Cathedral farther east as a prominent Gothic stone church with twin spires. Keep all four areas naturally connected as one continuous city map, with rich detail across the whole canvas and no rigid grid.

Landscape 16:9, north at top, full-bleed map artwork. Background only: no route line, no dashed line, no pins, no markers, no place labels, no numbers, no text, no UI, no legend, no border, no watermark. Avoid uniform square blocks, repeated rooftops, flat vector shapes, simplistic diagrams, photographic realism, and unrelated famous landmarks.
```

路线的 POI 经纬度仍按 AMap GCJ-02 单独记录。插画坐标用于把交互点落到对应街区；插画路线用于表达点位关系，不替代实时导航。
