# CD-01 成都插画地图 v1

- 日期：2026-10-13。
- 生成：内置 imagegen；原生源图 1672 × 941，展示 WebP 同尺寸，没有将重采样描述为原生 4K。
- 空间参考：AMap JS API 2.0 查询的五个 POI、相邻地点步行节点和内部地图总览。
- 结构参考：chengdu-cd01-map-structure-v1.svg / .png。
- 风格参考：广州 guangzhou-map-illustrated-v2.png。
- 地标外观参考：用户资料包中的武侯祠红墙竹林与 IFS 爬墙熊猫照片。
- 底图无文字、标点、路线；网站通过共享 Remotion 和 HTML 图层叠加。
- 地标在生成后按可见入口重新校准。插画连接线属于视觉示意；它们与真实经纬度节点分开归档，不用于实时导航。

## 生成提示词

```text
Create ONE finished high-detail illustrated city map for Routeo's CD-01 Chengdu one-day route. Landscape 16:9, full bleed. Use maximum available native resolution and crisp small architectural detail.
REFERENCE ROLES: image 1 is the annotated geographic STRUCTURE sketch and determines spatial layout, image 2 is Guangzhou's accepted rendering STYLE only, image 3 is an official AMap geographic overview used to understand street corridors and waterways, image 4 is a Wuhou Shrine red-wall/bamboo appearance reference, image 5 is the actual IFS climbing-panda architecture appearance reference.
CRITICAL SPATIAL LOCK: north at the top. Wuhou Shrine temple/garden compound centered at 14.5% image width, 76% height. People's Park and He Ming teahouse centered at 34.1%,30.8%. Chunxi pedestrian street at 74.9%,36.8%. IFS mall / climbing panda at 82.5%,40.1%. Taikoo Li low-rise shopping district at 87.1%,46%. Preserve the WEST-to-EAST spacing and the north/south relationships of these five sites. People's Park is NORTH-EAST of Wuhou Shrine. IFS is EAST of Chunxi street. Taikoo Li is SOUTH-EAST of IFS. Do not rearrange landmarks for a prettier poster. Draw complete urban surroundings around them, not isolated floating icons.
The cream road corridor from Wuhou Shrine northeast up Wenweng Road toward the park, and the east-west Renmin West / East / Zongfu road across the central-north part of the map must remain readable. Keep the southwest-to-southeast Jinjiang river as a narrow, teal urban river below the park and below the modern shopping area, with bridges at streets that cross it. Wuhou compound is south of the river's southwest bend, not on an island. Use the actual map for those relationships.
RENDERING: match image 2's warm hand-painted miniature-city illustration, clear map-like elevated oblique overhead view, textured foliage, cream streets, delicate sunlight, fine roofs and small courtyards. Show authentic mixed Chengdu urban fabric: varied low-rise historic lanes, mid-rise residential buildings, occasional taller contemporary office blocks, irregular parcels, tree-lined boulevards, small squares. No repeated square grid or cookie-cutter blocks. No skyline, mountains, horizon, cinematic panorama, glossy game terrain, flat vector diagram, cartoon infographic.
Distinct landmark rendering: Wuhou Shrine has grey-tiled temple roofs, brick red enclosure walls, dense bamboo and old trees, courtyards and a small moon gate. People's Park is a coherent green urban park with a small lake, winding paths and a timber teahouse with wicker chairs. Chunxi Road is a busy pedestrian retail corridor. IFS is a recognizably MODERN light stone/glass shopping podium with an unmistakable white-and-black panda CLIMBING its exterior facade (as image 5); slim office towers can appear but must not obscure the nearby map. Taikoo Li is a distinguishable cluster of grey-tiled low-rise contemporary shops and courtyards with a compact historic temple retained in the district. This should read as a map of today's Chengdu, not an entirely ancient town.
Leave visible ground and streets at all five landmark anchors so the website can later place small interactive dots and thin dashed paths. Keep landmarks recognizable at normal screen size without giant monuments dominating the map.
BACKGROUND ART ONLY. Remove EVERY label, number, UI element, caption, pin, circle, marker and itinerary-colored line from the sketch and AMap reference. Absolutely no text, no logos (including IFS lettering), no baked-in route, no dashed path, no glowing line, no border, no compass, no watermark. Roads are part of the city drawing, not colored navigation overlays. No decorative blank margins.
```

