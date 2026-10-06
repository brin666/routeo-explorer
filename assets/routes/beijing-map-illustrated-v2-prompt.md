# 北京故事地图 v2 生成记录

- 工具：内置 ImageGen 图片编辑
- 输入底图：`beijing-map-illustrated-v1-source.png`
- 结构草图：`beijing-map-structure-sketch-v2.svg` 与同名 PNG，作为版本规划稿；ImageGen 实际以 v1 底图为唯一图像参考，并在提示词中写入四个锚点关系与街区调整方向。
- 输出源图：`beijing-map-illustrated-v2-source.png`（1672 × 941）
- 页面导出：`beijing-map-illustrated-v2.webp`（3840 × 2160，Lanczos 重采样；源图细节仍为 1672 × 941）

## 使用的提示词

```text
Use case: precise-object-edit
Asset type: version 2 illustrated Beijing route-map background for an interactive tourism map
Input images: Image 1 is the edit target. Preserve its north-up bird's-eye map composition, miniature hand-painted look, overall palette, and attraction placement.
Primary request: Create a new version that makes the city fabric around the landmarks feel varied and lived-in instead of repeating the same square block across the whole image. Change the ordinary surrounding neighborhoods while keeping the major landmarks in their current places.
Scene/backdrop: An illustrated north-up aerial map of central Beijing, 16:9 landscape. Preserve these image-space anchors closely: Beihai Park and its lake/White Pagoda around x=20%, y=20%; Jingshan hill around x=49%, y=19%; the Forbidden City centered around x=50%, y=52%; Tiananmen Square around x=50%, y=85%. Keep the Forbidden City and Tiananmen on the same clear north-south ceremonial axis, with the hill directly north and Beihai lake to the northwest.
Subject: The existing four major attractions, with the surrounding ordinary neighborhoods redrawn as recognizable map territory.
Style/medium: Retain the existing finely rendered illustrated map, miniature architectural detail, soft painted greens and water, warm cream streets, visible roof and courtyard textures. It should still read as a map with roads and blocks from above, not as a landscape postcard.
Composition/framing: Keep the existing overall crop and landmark scale. Around the Forbidden City, Jingshan, and Beihai, replace the uniform checkerboard with Beijing-style Hutong districts: uneven courtyard compounds of varied sizes and shapes, short winding lanes, offset T-junctions, occasional diagonals and narrow passages, small tree-filled courtyards, subtle bends around park walls and lake shore. Let some groups loosely follow the main north-south city axis but let the neighboring blocks break its rigid rhythm. Create distinct local patterns in different parts of the canvas; do not repeat a small set of blocks as a tile.
Lighting/mood: Keep the same soft clear daylight and legibility as the input.
Color palette: Keep the existing restrained warm ivory, brick red, roof ochre, leafy greens, and lake turquoise.
Materials/textures: Preserve the hand-painted rooftops, tree clusters, garden walls and fine street texture. Vary courtyard walls, roof directions, vegetation density, and open spaces so nearby districts do not look copied.
Constraints: Preserve the silhouette and relative position of Beihai lake and island, Jingshan wooded hill, Forbidden City, and Tiananmen Square. Keep the palace as the central dominant compound and Tiananmen as the open space just south of it. Change only the surrounding neighborhood layout and local details; maintain an intelligible overall city map. No route path, no route pins, no place labels, no text, no numbers, no interface, no watermark.
Avoid: repeated equal-size square blocks, a perfect checkerboard, identical courtyard stamps, rigid parallel street rows everywhere, overly chaotic alley spaghetti, extra oversized attractions, relocating or redesigning the four landmarks, photorealism, cinematic horizon, heavy perspective tilt, text or symbols.
```
