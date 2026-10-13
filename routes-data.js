import { GUANGZHOU_PHOTO_CANDIDATES } from "./assets/routes/guangzhou-photo-candidates.js";
import { CD01_ROUTE, CD01_JOURNEY } from "./assets/routes/chengdu-cd01-data.js";
import { NJ01_ROUTE, NJ01_JOURNEY } from "./assets/routes/nanjing-nj01-data.js";
import { XA01_ROUTE, XA01_JOURNEY } from "./assets/routes/xian-xa01-data.js";
import { DINING_BY_ROUTE } from "./assets/routes/dining-data.js";
import { PHOTO_REFERENCES_BY_ROUTE, PHOTO_SUPPLEMENTS_BY_ROUTE } from "./assets/routes/photo-notes-data.js";
import { BATCH20_ROUTES, BATCH20_JOURNEYS } from "./assets/routes/batch20-data.js";
import { applyBatch01Updates } from "./assets/routes/batch01-updates.js";

const ACTIVE_ROUTE_IDS = new Set(["guangzhou-xiguan-walk", "chengdu-cd01-city-day", "nanjing-nj01-qinhuai-day", "xian-xa01-qujiang-day", ...BATCH20_ROUTES.map((route) => route.id)]);

const ROUTE_CATALOG = [
  {
    id: "suzhou-garden-walk", city: "苏州", region: "中国", place: "中国 · 苏州", flag: "cn",
    title: "园林水巷慢行", days: 1, tags: ["园林", "水巷", "城市", "自然"], theme: "suzhou",
    image: "./assets/routes/suzhou.webp", accent: "#e5a153",
    intro: "从园林水院出发，穿过博物馆与旧城水巷，把苏州的一天留给慢慢走。",
    quote: "从一座园林开始，沿着河巷走进姑苏旧城。桥影、白墙和院落之间，留出一段不赶时间的路。",
    map: {
      kind: "city-garden",
      maxZoom: 1.25,
      route: "M 250 238 C 302 225 330 161 430 163 C 520 164 572 248 680 236 C 774 224 813 158 950 134",
      roads: ["M 70 76 C 192 106 207 145 310 134 S 438 49 528 60 S 685 116 761 75 S 926 38 1088 73", "M 110 304 C 213 273 276 296 364 268 S 529 252 594 283 S 736 311 816 260 S 989 220 1120 258", "M 256 20 C 283 87 274 120 240 181 S 221 280 258 347", "M 760 16 C 719 73 734 132 784 168 S 856 261 819 340"],
      contours: ["M 254 53 C 350 20 433 31 471 81 C 500 119 479 148 423 159 C 357 174 329 211 351 246", "M 850 40 C 916 25 1006 45 1031 99 C 1050 143 1007 165 950 167 C 902 168 884 201 917 230", "M 24 173 C 113 136 157 156 168 202 C 177 242 126 262 66 247"],
      points: [
        { name: "拙政园", x: 250, y: 238, role: "start", labelSide: "right", labelY: "above", color: "#e99a51" },
        { name: "苏州博物馆", x: 430, y: 163, labelSide: "right", labelY: "above", mobileHide: true, color: "#668eb0" },
        { name: "平江路", x: 680, y: 236, labelSide: "right", labelY: "below", mobileHide: true, color: "#65ad8b" },
        { name: "耦园", x: 950, y: 134, role: "end", labelSide: "left", labelY: "above", color: "#e5a153" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/suzhou-map-redrawn-v2.webp", width: 1536, height: 1024,
      rasterSize: { width: 3840, height: 2560 },
      sourceDetailSize: { width: 1536, height: 1024 },
      route: "M 275 220 C 350 224 437 274 508 285 C 666 311 800 571 930 680 C 966 708 1000 726 1030 730 C 1113 738 1210 714 1308 677",
      markers: [
        { name: "拙政园", x: 275, y: 220, color: "#e24b50", labelPlacement: "below-right" },
        { name: "苏州博物馆", x: 508, y: 285, color: "#f0a145", labelPlacement: "below-right" },
        { name: "平江路", x: 1030, y: 730, color: "#5ca9df", labelPlacement: "below-left" },
        { name: "耦园", x: 1308, y: 677, color: "#54b99b", labelPlacement: "above-right" }
      ]
    },
    snapshots: ["garden", "city"],
    story: [
      { day: 1, time: "09:00", title: "拙政园 · 从水院开始", body: "先沿着园内水岸慢慢走，看廊桥、亭榭和水面互相借景。按现场动线安排停留，不必急着走完整座园林。" },
      { day: 1, time: "11:00", title: "苏州博物馆 · 看见江南与几何", body: "从古典园林走到相邻的博物馆，留意白墙、灰瓦与光影怎样把现代建筑和姑苏气质连在一起。" },
      { day: 1, time: "13:30", title: "平江路 · 沿河慢行", body: "沿着河埠和桥洞穿过旧城。午饭与停留时间按当天人流调整，让水巷成为下午的主线。" },
      { day: 1, time: "15:30", title: "耦园 · 在小园里收尾", body: "从仓街一带转入园林，看看黄石假山、曲廊与院落之间的层次。停留时长以当日开放安排为准。" }
    ],
    guideSources: [
      { label: "苏州市园林和绿化管理局 · 开放时间", url: "https://ylj.suzhou.gov.cn/szsylj/kfsj/wztt.shtml" },
      { label: "苏州市园林和绿化管理局 · 入园须知", url: "https://ylj.suzhou.gov.cn/szsylj/ryxz/nav_list.shtml" }
    ]
  },
  {
    id: "hangzhou-west-lake-walk", city: "杭州", region: "中国", place: "中国 · 杭州", flag: "cn",
    title: "西湖湖岸慢行", days: 1, tags: ["自然", "西湖", "徒步", "亲子"], theme: "hangzhou",
    image: "./assets/routes/hangzhou-route.webp", accent: "#e9a85c",
    intro: "从湖东走上白堤，再沿苏堤把湖面、柳影与远山串成悠缓的一天。",
    quote: "把时间交给湖岸。走累了就停在树荫下，看一艘船慢慢穿过水面。",
    map: {
      kind: "coast",
      storyImage: "./assets/routes/hangzhou-map-illustrated-v7.webp",
      rasterSize: { width: 3840, height: 2160 }, sourceDetailSize: { width: 1672, height: 941 },
      maxZoom: 1.25,
      route: "M 230 130 C 295 125 385 140 460 155 C 515 170 584 255 652 278 C 748 302 960 247 1092 234",
      storyMap: {
        viewBox: { width: 1200, height: 675 },
        reference: {
          source: "AMap POI detail pages",
          coordinateSystem: "GCJ-02",
          verifiedAt: "2026-10-05",
          walkingRouteStatus: "POI coordinates verified; AMap walking nodes pending; illustrated path is a visual draft",
          points: [
            { name: "断桥残雪", poiId: "B023B01EE6", lng: 120.151347, lat: 30.258151, url: "https://ditu.amap.com/place/B023B01EE6" },
            { name: "平湖秋月", poiId: "B023B024F8", lng: 120.146210, lat: 30.252038, url: "https://ditu.amap.com/place/B023B024F8" },
            { name: "苏堤春晓", poiId: "B023B02070", lng: 120.137960, lat: 30.243880, url: "https://ditu.amap.com/place/B023B02070" },
            { name: "雷峰塔", poiId: "B023B09LKR", lng: 120.148849, lat: 30.230934, url: "https://ditu.amap.com/place/B023B09LKR" }
          ],
          walkingSegments: [
            { fromPoiId: "B023B01EE6", toPoiId: "B023B024F8", status: "pending", nodes: [] },
            { fromPoiId: "B023B024F8", toPoiId: "B023B02070", status: "pending", nodes: [] },
            { fromPoiId: "B023B02070", toPoiId: "B023B09LKR", status: "pending", nodes: [] }
          ]
        },
        route: "M 1023 143 C 961 136 883 126 825 136 C 782 161 691 310 621 458 C 588 518 564 555 553 567 C 614 532 702 459 789 416",
        points: [
          { name: "断桥残雪", poiId: "B023B01EE6", x: 1023, y: 143, role: "start", labelSide: "left", labelY: "above", color: "#e5a251" },
          { name: "平湖秋月", poiId: "B023B024F8", x: 825, y: 136, labelSide: "left", labelY: "below", mobileHide: true, color: "#65a8cf" },
          { name: "苏堤春晓", poiId: "B023B02070", x: 553, y: 566, labelSide: "right", labelY: "below", mobileHide: true, color: "#64aa89" },
          { name: "雷峰塔", poiId: "B023B09LKR", x: 790, y: 416, role: "end", labelSide: "left", labelY: "above", color: "#e9a85c" }
        ]
      },
      water: "M 330 -10 C 286 43 350 83 310 125 C 275 162 325 206 294 248 C 268 283 314 323 280 370 H 765 C 730 328 789 285 749 244 C 716 207 769 163 731 124 C 697 87 757 37 727 -10 Z",
      shoreline: "M 330 -10 C 286 43 350 83 310 125 C 275 162 325 206 294 248 C 268 283 314 323 280 370",
      roads: ["M 30 62 C 164 88 222 65 318 96 S 493 118 585 80 S 799 35 934 77 S 1083 110 1170 70", "M 42 323 C 174 286 232 301 334 273 S 513 256 612 296 S 803 322 902 275 S 1068 237 1172 268", "M 812 7 C 777 61 798 110 846 152 S 886 247 854 354", "M 1050 7 C 1015 68 1025 119 1074 162 S 1100 258 1064 355"],
      contours: ["M 86 115 C 160 91 223 101 239 137 S 208 193 151 184 S 75 207 97 241", "M 887 115 C 942 85 1024 99 1043 141 S 1012 202 959 203 S 888 244 918 278"],
      points: [
        { name: "断桥残雪", x: 230, y: 130, role: "start", labelSide: "right", labelY: "above", color: "#e5a251" },
        { name: "平湖秋月", x: 460, y: 155, labelSide: "right", labelY: "above", mobileHide: true, color: "#65a8cf" },
        { name: "苏堤春晓", x: 652, y: 278, labelSide: "right", labelY: "below", mobileHide: true, color: "#64aa89" },
        { name: "雷峰塔", x: 1092, y: 234, role: "end", labelSide: "left", labelY: "above", color: "#e9a85c" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/hangzhou-map-illustrated-v7.webp",
      width: 1672, height: 941,
      rasterSize: { width: 3840, height: 2160 },
      sourceDetailSize: { width: 1672, height: 941 },
      route: "M 1425 200 C 1340 190 1230 176 1150 190 C 1090 224 963 432 865 638 C 820 723 786 774 770 790 C 856 742 978 640 1100 580",
      markers: [
        { name: "断桥残雪", poiId: "B023B01EE6", x: 1425, y: 200, color: "#e5a251", labelPlacement: "below-left" },
        { name: "平湖秋月", poiId: "B023B024F8", x: 1150, y: 190, color: "#65a8cf", labelPlacement: "below-left" },
        { name: "苏堤春晓", poiId: "B023B02070", x: 770, y: 790, color: "#64aa89", labelPlacement: "above-right" },
        { name: "雷峰塔", poiId: "B023B09LKR", x: 1100, y: 580, color: "#e9a85c", labelPlacement: "below-right" }
      ]
    },
    snapshots: ["lake", "garden"],
    story: [
      { day: 1, time: "08:30", title: "断桥残雪 · 从湖东出发", body: "清晨先到湖东岸，沿湖边步道看城市慢慢醒来。断桥是西湖东岸的地标，游览时按现场人流选择停留位置。" },
      { day: 1, time: "10:00", title: "平湖秋月 · 沿白堤看湖景", body: "从白堤一侧望向湖心与远山，遇到人多时可以放慢脚步，把时间留给沿岸的树影和水面。" },
      { day: 1, time: "13:00", title: "苏堤春晓 · 湖上慢行", body: "沿苏堤穿过水面与柳荫，按体力在途中休息。也可留意当天的游船、观光接驳与天气信息。" },
      { day: 1, time: "16:00", title: "雷峰塔 · 以南山收尾", body: "傍晚转到湖的南侧看夕照与塔影。塔内参观和登塔安排以景区当日公告为准。" }
    ]
  },
  {
    id: "nanjing-old-city-walk", city: "南京", region: "中国", place: "中国 · 南京", flag: "cn",
    title: "民国街巷到秦淮夜色", days: 1, tags: ["历史", "城市", "美食", "街巷"], theme: "nanjing",
    image: "./assets/routes/nanjing-route.webp", accent: "#d99b61",
    intro: "从总统府周边的近代建筑出发，穿过老城街巷，在秦淮河边结束一天。",
    quote: "南京的层次藏在街巷之间：一段旧墙、一处庭院，再到夜色里的秦淮河。",
    map: {
      kind: "city-garden",
      maxZoom: 1.25,
      route: "M 220 155 C 290 111 364 98 430 129 C 508 167 567 210 656 223 C 743 236 776 177 838 163 C 899 149 936 178 988 205",
      roads: ["M 30 59 C 147 82 237 69 320 103 S 475 158 576 118 S 742 63 839 92 S 1030 133 1167 79", "M 22 305 C 150 274 226 290 329 264 S 513 238 600 277 S 788 306 893 269 S 1052 225 1170 260", "M 261 9 C 228 69 243 117 289 159 S 325 260 292 350", "M 733 6 C 696 67 711 120 762 162 S 795 269 762 353"],
      contours: ["M 65 121 C 145 95 207 106 222 142 S 186 198 126 188 S 54 213 80 249", "M 888 89 C 949 71 1014 99 1020 139 S 970 190 923 180 S 869 217 898 252"],
      points: [
        { name: "总统府", x: 220, y: 155, role: "start", labelSide: "right", labelY: "above", color: "#dd9d5d" },
        { name: "六朝博物馆", x: 430, y: 129, labelSide: "right", labelY: "above", mobileHide: true, color: "#6d9bb6" },
        { name: "老门东", x: 838, y: 163, labelSide: "right", labelY: "above", mobileHide: true, color: "#64aa87" },
        { name: "夫子庙·秦淮河", x: 988, y: 205, role: "end", labelSide: "left", labelY: "below", color: "#df8a63" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/nanjing-map-illustrated-v1.webp",
      width: 1672, height: 941,
      rasterSize: { width: 3840, height: 2160 },
      sourceDetailSize: { width: 1672, height: 941 },
      route: "M 360 180 C 460 183 552 216 650 250 C 779 295 923 475 1080 650 C 1184 677 1320 690 1460 700",
      markers: [
        { name: "总统府", x: 360, y: 180, color: "#dd9d5d", labelPlacement: "below-right" },
        { name: "六朝博物馆", x: 650, y: 250, color: "#6d9bb6", labelPlacement: "below-left" },
        { name: "老门东", x: 1080, y: 650, color: "#64aa87", labelPlacement: "above-left" },
        { name: "夫子庙·秦淮河", x: 1460, y: 700, color: "#df8a63", labelPlacement: "above-left" }
      ]
    },
    snapshots: ["city", "river"],
    story: [
      { day: 1, time: "09:00", title: "总统府 · 走进近代南京", body: "从长江路上的历史建筑群开始，按预约时段入园。馆区内容较多，建议预留充足参观时间。" },
      { day: 1, time: "11:30", title: "六朝博物馆 · 回望金陵旧事", body: "在城市中心继续看南京的古都线索。展览安排与入馆方式出发前查看馆方公告。" },
      { day: 1, time: "15:30", title: "老门东 · 在巷子里歇脚", body: "下午转到老城南，走走街巷、院落和城墙一带。小吃与店铺营业情况以现场为准。" },
      { day: 1, time: "18:00", title: "夫子庙·秦淮河 · 看灯影入水", body: "傍晚沿秦淮河慢行，找一处临水位置结束行程。节假日客流较大，回程交通建议提前安排。" }
    ]
  },
  {
    id: "chengdu-city-slow-walk", city: "成都", region: "中国", place: "中国 · 成都", flag: "cn",
    title: "茶馆街巷慢慢逛", days: 1, tags: ["美食", "茶馆", "城市", "轻松游"], theme: "chengdu",
    image: "./assets/routes/chengdu-route.webp", accent: "#d69658",
    intro: "从人民公园的茶香开始，串起老街、武侯祠与锦里的一日闲逛。",
    quote: "成都不必赶着打卡。坐一会儿、吃一点，再沿树荫和老街慢慢走。",
    map: {
      kind: "city-garden",
      maxZoom: 1.25,
      route: "M 225 190 C 300 166 362 111 457 104 C 553 98 596 166 681 205 C 765 243 808 221 866 184 C 923 148 957 162 1001 179",
      roads: ["M 25 65 C 143 86 219 58 311 92 S 474 141 571 97 S 749 47 845 83 S 1039 126 1171 72", "M 19 304 C 150 273 239 298 341 261 S 508 228 602 269 S 794 319 899 272 S 1063 232 1176 265", "M 278 8 C 243 71 257 120 306 164 S 341 264 307 354", "M 744 7 C 708 69 719 121 772 166 S 806 267 771 355"],
      contours: ["M 84 128 C 152 98 215 111 227 147 S 183 204 126 194 S 65 222 94 258", "M 875 93 C 936 72 1003 101 1008 143 S 963 193 918 185 S 869 224 902 260"],
      points: [
        { name: "人民公园", x: 225, y: 190, role: "start", labelSide: "right", labelY: "above", color: "#69a57f" },
        { name: "宽窄巷子", x: 457, y: 104, labelSide: "right", labelY: "above", mobileHide: true, color: "#d7a65d" },
        { name: "武侯祠", x: 866, y: 184, labelSide: "left", labelY: "above", mobileHide: true, color: "#d35f54" },
        { name: "锦里", x: 1001, y: 179, role: "end", labelSide: "left", labelY: "below", color: "#d8a24f" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/chengdu-map-illustrated-v1.webp",
      width: 1672, height: 941,
      rasterSize: { width: 3840, height: 2160 },
      sourceDetailSize: { width: 1672, height: 941 },
      route: "M 360 285 C 449 249 555 240 675 255 C 796 293 937 465 1115 625 C 1183 647 1255 650 1325 650",
      markers: [
        { name: "人民公园", x: 360, y: 285, color: "#69a57f", labelPlacement: "below-right" },
        { name: "宽窄巷子", x: 675, y: 255, color: "#d7a65d", labelPlacement: "below-right" },
        { name: "武侯祠", x: 1115, y: 625, color: "#d35f54", labelPlacement: "above-left" },
        { name: "锦里", x: 1325, y: 650, color: "#d8a24f", labelPlacement: "below-left" }
      ]
    },
    snapshots: ["garden", "street"],
    story: [
      { day: 1, time: "09:00", title: "人民公园 · 从一杯茶开始", body: "上午在公园找一处茶馆坐下，看成都人熟悉的慢生活。茶馆座位和消费方式以现场为准。" },
      { day: 1, time: "11:00", title: "宽窄巷子 · 看老街的日常", body: "沿街巷看看院落、店铺和城市更新后的空间。午餐可以在附近选择，避开最拥挤的时段。" },
      { day: 1, time: "14:30", title: "武侯祠 · 走进三国故事", body: "下午安排博物馆参观，馆区较适合慢看。门票需要通过官方渠道预约购买，出发前核对开放公告。" },
      { day: 1, time: "17:00", title: "锦里 · 用川味收尾", body: "从武侯祠旁步入锦里街区，逛巷子、尝小吃。节庆期间客流与街区安排会变化，留意现场提示。" }
    ]
  },
  {
    id: "beijing-imperial-axis-walk", city: "北京", region: "中国", place: "中国 · 北京", flag: "cn",
    title: "中轴古建一日漫步", days: 1, tags: ["历史", "古建", "城市", "亲子"], theme: "beijing",
    image: "./assets/routes/beijing-route.webp", accent: "#d66b52",
    intro: "沿着故宫、景山与北海一带慢行，把北京的中轴与皇家园林放在同一天里看。",
    quote: "从红墙金瓦走到树影湖面，在城市最厚重的历史之间留一段慢下来的时间。",
    map: {
      kind: "city-garden",
      maxZoom: 1.25,
      route: "M 818 315 C 818 279 818 250 818 216 L 818 155 C 818 132 815 111 811 88 C 765 84 719 85 674 91 C 638 96 611 108 592 129 C 566 159 542 177 506 180 C 467 183 438 165 400 145",
      roads: ["M 25 55 C 158 76 229 52 322 88 S 483 139 582 98 S 759 44 852 82 S 1040 126 1170 70", "M 20 311 C 154 282 241 302 337 270 S 510 235 607 272 S 798 317 895 279 S 1062 238 1172 267", "M 282 7 C 246 72 262 122 309 165 S 345 263 311 355", "M 759 6 C 721 70 734 122 786 166 S 818 267 784 354"],
      contours: ["M 77 117 C 151 89 213 103 227 141 S 189 197 132 186 S 63 214 90 251", "M 885 104 C 949 81 1012 110 1018 151 S 970 198 924 188 S 872 226 904 264"],
      points: [
        { name: "天安门广场", x: 818, y: 315, role: "start", labelSide: "left", labelY: "above", color: "#d85f52" },
        { name: "故宫博物院", x: 818, y: 216, labelSide: "right", labelY: "below", mobileHide: true, color: "#e2a750" },
        { name: "景山公园", x: 811, y: 88, labelSide: "right", labelY: "above", mobileHide: true, color: "#67a67f" },
        { name: "北海公园", x: 400, y: 145, role: "end", labelSide: "left", labelY: "below", color: "#63aabd" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/beijing-map-illustrated-v2.webp",
      width: 1672,
      height: 941,
      rasterSize: { width: 3840, height: 2160 },
      sourceDetailSize: { width: 1672, height: 941 },
      route: "M 835 800 C 835 768 835 728 835 688 L 835 580 C 835 548 835 520 835 493 L 835 293 C 835 247 828 201 820 174 C 771 169 720 170 673 178 C 635 184 603 199 580 228 C 556 257 540 278 506 280 C 464 282 424 264 392 235 C 367 211 351 182 335 176",
      markers: [
        { name: "天安门广场", x: 835, y: 800, color: "#d85f52", labelPlacement: "above-right" },
        { name: "故宫博物院", x: 835, y: 493, color: "#e2a750", labelPlacement: "below-right" },
        { name: "景山公园", x: 820, y: 174, color: "#67a67f", labelPlacement: "above-right" },
        { name: "北海公园", x: 335, y: 176, color: "#63aabd", labelPlacement: "below-left" }
      ]
    },
    snapshots: ["palace", "lake"],
    story: [
      { day: 1, time: "08:00", title: "天安门广场 · 从城市中轴启程", body: "按当天预约和安检要求入场，预留排队时间。广场管理安排可能调整，出发前先查看官方公告。" },
      { day: 1, time: "09:30", title: "故宫博物院 · 穿过红墙与宫门", body: "按预约时段从指定入口入院，沿中轴线参观并给展厅留出时间。故宫门票需通过官方渠道预约。" },
      { day: 1, time: "15:30", title: "景山公园 · 登高回望宫城", body: "从故宫北侧前往景山，沿园路上行到万春亭一带俯瞰中轴。公园分季节调整开放时间，出发前核对公告。" },
      { day: 1, time: "17:00", title: "北海公园 · 在湖边结束一天", body: "最后转到北海一带散步，看白塔与湖面渐入傍晚。园内路线、门票和开放时间以官方当日信息为准。" }
    ]
  },
  {
    id: "guangzhou-xiguan-walk", city: "广州", region: "中国", place: "中国 · 广州", flag: "cn",
    title: "石室圣心到西关烟火", days: 1, tags: ["骑楼", "珠江", "美食", "Citywalk"], theme: "guangzhou",
    image: "./assets/routes/guangzhou-map-illustrated-v2.png", accent: "#d88958",
    intro: "从石室圣心大教堂出发，过珠江到沙面，再穿进永庆坊与上下九的西关街巷。",
    quote: "从石室的尖顶走向珠江，再沿着骑楼和旧巷，把一整天留给广州的街头烟火。",
    map: {
      kind: "city-garden", maxZoom: 2.2,
      route: "M 1000 205 C 970 260 925 276 875 306 C 820 340 784 395 754 448 C 713 516 664 540 620 560 C 560 527 531 476 495 432 C 458 385 405 354 355 321 C 408 300 460 291 517 302 C 580 314 623 340 681 330",
      roads: [
        "M 30 110 C 200 120 310 96 420 130 S 630 162 770 124 S 980 86 1170 123",
        "M 20 300 C 185 270 285 302 402 283 S 603 244 725 277 S 930 320 1175 272",
        "M 30 486 C 190 450 298 477 414 454 S 610 424 750 455 S 960 487 1175 440",
        "M 172 5 C 160 100 184 155 164 249 S 145 416 171 535",
        "M 390 0 C 362 96 385 152 405 243 S 416 407 390 550",
        "M 630 0 C 602 91 624 160 650 242 S 656 400 628 548",
        "M 870 0 C 858 90 878 166 901 245 S 906 407 882 550",
        "M 1090 0 C 1080 104 1108 163 1124 245 S 1120 416 1094 546"
      ],
      contours: [
        "M 72 175 C 132 131 208 145 225 187 S 190 245 127 237 S 72 278 100 311",
        "M 466 180 C 529 139 601 157 613 198 S 576 251 523 246 S 464 276 487 312",
        "M 919 142 C 984 116 1054 142 1064 184 S 1021 239 968 230 S 907 265 937 299"
      ],
      points: [
        { name: "石室圣心大教堂", x: 990, y: 205, role: "start", labelSide: "left", labelY: "above", color: "#d85c50" },
        { name: "沙面岛", x: 585, y: 414, labelSide: "left", labelY: "below", color: "#69aa91" },
        { name: "永庆坊", x: 310, y: 198, labelSide: "right", labelY: "above", color: "#e9a251" },
        { name: "上下九步行街", x: 535, y: 211, role: "end", labelSide: "right", labelY: "below", color: "#6c9fbd" }
      ]
    },
    storyArtwork: {
      image: "./assets/routes/guangzhou-map-illustrated-v2.png", width: 1672, height: 941,
      reference: {
        source: "AMap JSAPI POI coordinates; GCJ-02",
        verifiedAt: "2026-10-07",
        routeGeometry: "Illustrated street paths anchored to the verified POI coordinates; use the linked route planner for turn-by-turn navigation.",
        markers: [
          { name: "石室圣心大教堂", poiId: "B00140UHIZ", lng: 113.260262, lat: 23.114589, x: 1360, y: 280, url: "https://ditu.amap.com/place/B00140UHIZ" },
          { name: "沙面岛", poiId: "B00140CG67", lng: 113.247702, lat: 23.107332, x: 855, y: 720, url: "https://ditu.amap.com/place/B00140CG67" },
          { name: "永庆坊", poiId: "B0IUPDSJHU", lng: 113.237495, lat: 23.114821, x: 395, y: 330, url: "https://ditu.amap.com/place/B0IUPDSJHU" },
          { name: "上下九步行街", poiId: "B00140TXAL", lng: 113.247072, lat: 23.114287, x: 805, y: 340, url: "https://ditu.amap.com/place/B00140TXAL" }
        ]
      },
      markers: [
        { name: "石室圣心大教堂", poiId: "B00140UHIZ", x: 1360, y: 280, color: "#d85c50", labelPlacement: "below-left" },
        { name: "沙面岛", poiId: "B00140CG67", x: 855, y: 720, color: "#69aa91", labelPlacement: "above-left" },
        { name: "永庆坊", poiId: "B0IUPDSJHU", x: 395, y: 330, color: "#e9a251", labelPlacement: "below-right" },
        { name: "上下九步行街", poiId: "B00140TXAL", x: 805, y: 340, color: "#6c9fbd", labelPlacement: "below-right" }
      ]
    },
    snapshots: ["river", "street"],
    story: [
      { day: 1, time: "09:00", title: "石室圣心大教堂 · 从城市尖顶出发", body: "先在一德路周边看石室的双尖塔与花岗岩立面。以外观和周边街区为主；若想进堂内，先确认当日礼拜安排与访客规则。" },
      { day: 1, time: "11:00", title: "沙面岛 · 沿树荫走到珠江边", body: "过桥进入沙面，在百年古树与近代建筑之间慢慢走。街区适合步行；骑行和停放请留意重点区域管理提示。" },
      { day: 1, time: "13:30", title: "永庆坊 · 走进西关旧巷", body: "从恩宁路一带看骑楼、趟栊门和旧街巷。午餐可在这里安排；想进粤剧艺术博物馆，另核对闭馆日与现场活动。" },
      { day: 1, time: "16:00", title: "上下九步行街 · 用老字号收尾", body: "沿第十甫路看骑楼街景，选一家茶楼或糖水铺歇脚。热门门店可能排队，晚餐和返程时间留出弹性。" }
    ],
    guideSources: [
      { label: "广州市政府 · 西关 Citywalk 指引（沙面、永庆坊全天开放信息）", url: "https://www.gz.gov.cn/zt/jrshts/2026n/nwzgz/nwgz/content/post_10686807.html" },
      { label: "荔湾区政府 · 粤剧艺术博物馆开放时间", url: "https://www.lw.gov.cn/ywb/fw/ly/whss/content/post_9105819.html" },
      { label: "越秀区政府 · 圣心大教堂介绍与地址", url: "https://www.yuexiu.gov.cn/zjyx/yxjd/zjwh/content/post_8665100.html" },
      { label: "荔湾区政府 · 沙面重点区域非机动车管理提示", url: "https://www.lw.gov.cn/gzlwsmj/gkmlpt/content/10/10079/post_10079405.html" }
    ]
  }
];

ROUTE_CATALOG.push(CD01_ROUTE, NJ01_ROUTE, XA01_ROUTE, ...BATCH20_ROUTES);

export const ROUTES = ROUTE_CATALOG.filter((route) => ACTIVE_ROUTE_IDS.has(route.id));

const JOURNEY_CATALOG = {
  ...BATCH20_JOURNEYS,
  "chengdu-cd01-city-day": CD01_JOURNEY,
  "nanjing-nj01-qinhuai-day": NJ01_JOURNEY,
  "xian-xa01-qujiang-day": XA01_JOURNEY,
  "suzhou-garden-walk": {
    eyebrow: "SUZHOU · GARDEN WALK", duration: "1 日", distance: "约 5 km",
    labelPlacements: ["above-right", "below-left", "below-right", "above-right"],
    stopTimes: ["09:00", "11:00", "13:30", "15:30"],
    stopTags: [["古典园林", "水景", "借景"], ["建筑", "江南", "庭院"], ["水巷", "老街", "慢行"], ["园林", "假山", "曲廊"]],
    previewImages: ["./assets/routes/stops/suzhou-zhuozhengyuan.webp", "./assets/routes/stops/suzhou-museum.webp", "./assets/routes/stops/suzhou-pingjiang-road.webp", "./assets/routes/stops/suzhou-ouyuan.webp"],
    legs: [{ mode: "步行", duration: "约 8 分钟", distance: "约 350 m" }, { mode: "步行", duration: "约 22 分钟", distance: "约 1.6 km" }, { mode: "步行", duration: "约 15 分钟", distance: "约 900 m" }],
    practical: [["适合季节", "春秋适合慢行；水巷与园林体验会随天气变化"], ["建议节奏", "园林和博物馆多留停留时间，中午在平江路附近休息"], ["出发前", "核对园林、博物馆的预约与开放安排"]],
    sources: ROUTES[0].guideSources
  },
  "hangzhou-west-lake-walk": {
    eyebrow: "HANGZHOU · WEST LAKE", duration: "1 日", distance: "约 7 km（示意）",
    stopTimes: ["08:30", "10:00", "13:00", "16:00"],
    stopTags: [["湖岸", "晨景", "慢行"], ["白堤", "远山", "水景"], ["苏堤", "柳荫", "步行"], ["夕照", "塔影", "湖景"]],
    previewPositions: ["18%", "38%", "64%", "84%"],
    legs: [{ mode: "步行", duration: "约 20 分钟", distance: "约 1.4 km" }, { mode: "步行", duration: "约 55 分钟", distance: "约 3.8 km" }, { mode: "步行", duration: "约 30 分钟", distance: "约 1.8 km" }],
    practical: [["适合季节", "春秋较适合长距离湖岸步行；夏季注意高温和补水"], ["建议节奏", "按体力分段休息，也可关注当天开放的游船与观光接驳"], ["出发前", "核对景区公告、游船安排与雷峰塔入园信息"]],
    sources: [{ label: "西湖风景名胜区官网", url: "https://westlake.hangzhou.gov.cn/" }]
  },
  "nanjing-old-city-walk": {
    eyebrow: "NANJING · OLD CITY", duration: "1 日", distance: "约 6 km（示意）",
    stopTimes: ["09:00", "11:30", "15:30", "18:00"],
    stopTags: [["近代史", "建筑", "预约"], ["六朝", "展览", "城市"], ["老城南", "街巷", "小吃"], ["秦淮河", "夜景", "晚餐"]],
    previewPositions: ["18%", "39%", "72%", "88%"],
    legs: [{ mode: "步行", duration: "约 10 分钟", distance: "约 700 m" }, { mode: "地铁 / 公交", duration: "约 25 分钟", distance: "约 4 km" }, { mode: "步行", duration: "约 20 分钟", distance: "约 1.3 km" }],
    practical: [["适合季节", "春秋适合串联室内展馆与户外街区"], ["建议节奏", "把总统府与博物馆安排在上午，午后转向老城南"], ["出发前", "总统府按预约时段入园；确认周一闭馆与当天交通"]],
    sources: [{ label: "南京总统府官网", url: "https://www.njztf.cn/index.html" }, { label: "南京市文旅局", url: "https://wlj.nanjing.gov.cn/" }]
  },
  "chengdu-city-slow-walk": {
    eyebrow: "CHENGDU · SLOW CITY", duration: "1 日", distance: "约 7 km（示意）",
    stopTimes: ["09:00", "11:00", "14:30", "17:00"],
    stopTags: [["人民公园", "茶馆", "休息"], ["老街", "院落", "闲逛"], ["三国", "博物馆", "预约"], ["川味", "夜游", "街巷"]],
    previewPositions: ["16%", "40%", "75%", "91%"],
    legs: [{ mode: "步行", duration: "约 18 分钟", distance: "约 1.4 km" }, { mode: "地铁 / 公交", duration: "约 25 分钟", distance: "约 4 km" }, { mode: "步行", duration: "约 5 分钟", distance: "约 300 m" }],
    practical: [["适合季节", "春秋步行体感较舒适；夏季安排室内休息并及时补水"], ["建议节奏", "把茶馆与午餐留出弹性，武侯祠后接锦里散步"], ["出发前", "武侯祠门票通过官方渠道预约，确认当日开放时间"]],
    sources: [{ label: "成都武侯祠票务信息", url: "https://www.wuhouci.net.cn/pwxx" }, { label: "锦里街区介绍", url: "https://www.cdjinli.com/about/intro/" }]
  },
  "beijing-imperial-axis-walk": {
    eyebrow: "BEIJING · IMPERIAL AXIS", duration: "1 日", distance: "约 8 km（示意）",
    stopTimes: ["08:00", "09:30", "15:30", "17:00"],
    stopTags: [["中轴线", "广场", "安检"], ["故宫", "宫殿", "预约"], ["万春亭", "俯瞰", "园林"], ["北海", "白塔", "湖岸"]],
    previewPositions: ["14%", "45%", "67%", "90%"],
    legs: [{ mode: "步行", duration: "约 15 分钟", distance: "约 1 km" }, { mode: "步行", duration: "约 20 分钟", distance: "约 1.4 km" }, { mode: "步行", duration: "约 25 分钟", distance: "约 1.7 km" }],
    practical: [["适合季节", "春秋适合长距离步行；夏季防晒，冬季留意风寒"], ["建议节奏", "故宫预留半天以上，之后再去景山与北海，不必赶行程"], ["出发前", "故宫需实名预约；核对天安门广场与公园的当日入场安排"]],
    sources: [{ label: "天安门广场预约服务", url: "https://yuyue2026.tamgw.beijing.gov.cn/web/index.html#/index" }, { label: "故宫博物院参观指南", url: "https://www.dpm.org.cn/Visit.html" }, { label: "北京市景山公园指南", url: "https://english.beijing.gov.cn/specials/parktours/guidevisitors/jingshanpark/" }]
  },
  "guangzhou-xiguan-walk": {
    eyebrow: "GUANGZHOU · XIGUAN CITYWALK", duration: "1 日", distance: "约 4.8 km（步行参考）",
    stopTimes: ["09:00", "11:00", "13:30", "16:00"],
    stopTags: [["哥特式建筑", "一德路", "城市地标"], ["珠江", "百年古树", "近代建筑"], ["骑楼", "西关大屋", "粤剧"], ["第十甫路", "老字号", "糖水"]],
    previewImages: [
      GUANGZHOU_PHOTO_CANDIDATES["圣心大教堂"][0].image,
      GUANGZHOU_PHOTO_CANDIDATES["沙面岛"][0].image,
      GUANGZHOU_PHOTO_CANDIDATES["永庆坊"][0].image,
      GUANGZHOU_PHOTO_CANDIDATES["上下九"][0].image
    ],
    stopAccess: [
      { heading: "门票与预约", value: "路线默认看建筑外观。内堂游客参观时段、个人预约和普通拍照规定暂未确认，请以“石室圣心大教堂”公众号或现场当日须知为准。弥撒、团体活动与游客参观分别安排；已结束的国庆广场时段不能当作日常内堂开放时间。" },
      { heading: "门票与预约", value: "沙面公共街区开放时间为全天；当前官方介绍未列街区统一购票或预约要求。岛内场馆、商业设施按各自公告执行。" },
      { heading: "门票与预约", value: "永庆坊街区开放时间为全天；当前官方介绍未列街区统一购票或预约要求。若参观粤剧艺术博物馆：9:00–21:00，20:30停止入场，周一闭馆（节假日除外）；票务和预约以馆方当日通知为准。" },
      { heading: "门票与预约", value: "以上下九公共步行街为主，当前路线不包含需购票入场的景点。街区活动、店铺与临时展览安排以现场公告为准。" }
    ],
    legs: [
      {
        from: "石室圣心大教堂", to: "沙面岛", recommendedMode: "walk", recommendation: "沿珠江步行入岛，体验更连贯",
        options: {
          walk: { label: "步行", duration: "约 26 分钟", distance: "约 1.97 km", path: "M 1360 280 C 1305 344 1240 392 1198 442 C 1150 496 1114 530 1077 570 C 1030 620 970 658 918 687 C 899 700 877 714 855 720" },
          transit: { label: "公交 / 地铁", duration: "约 29 分钟", distance: "约 2.07 km", detail: "含站点接驳步行，按班次调整", path: "M 1360 280 C 1352 351 1306 405 1264 451 C 1221 497 1200 545 1165 590 C 1125 640 1068 682 1016 704 C 954 730 908 719 855 720" },
          cycle: { label: "骑行", duration: "约 10 分钟", distance: "约 2.53 km", detail: "沙面重点区域按现场管理推行/停放", path: "M 1360 280 C 1380 345 1330 397 1285 430 C 1220 478 1162 507 1122 556 C 1080 609 1076 662 1015 694 C 956 723 902 727 855 720" }
        }
      },
      {
        from: "沙面岛", to: "永庆坊", recommendedMode: "walk", recommendation: "步行穿过西关街巷更顺路",
        options: {
          walk: { label: "步行", duration: "约 23 分钟", distance: "约 1.76 km", path: "M 855 720 C 818 675 790 635 783 589 C 778 553 742 518 704 493 C 661 460 630 425 594 397 C 547 365 485 339 395 330" },
          transit: { label: "公交 / 地铁", duration: "约 37 分钟", distance: "约 3.72 km", detail: "含进出站与步行接驳，按班次调整", path: "M 855 720 C 824 679 793 637 773 591 C 744 526 720 479 681 432 C 642 385 602 357 546 343 C 489 328 441 323 395 330" },
          cycle: { label: "骑行", duration: "约 12 分钟", distance: "约 3.05 km", detail: "沙面重点区域请按管理要求推行", path: "M 855 720 C 800 673 777 631 735 602 C 690 571 665 522 628 475 C 587 423 535 384 484 362 C 448 347 416 338 395 330" }
        }
      },
      {
        from: "永庆坊", to: "上下九步行街", recommendedMode: "walk", recommendation: "一公里左右，步行最省心",
        options: {
          walk: { label: "步行", duration: "约 14 分钟", distance: "约 1.06 km", path: "M 395 330 C 440 299 492 300 548 326 C 600 350 650 365 695 350 C 730 338 766 331 805 340" },
          transit: { label: "公交 / 地铁", duration: "约 28 分钟", distance: "约 1.58 km", detail: "含候车与站点接驳步行", path: "M 395 330 C 452 292 511 296 566 320 C 616 341 654 357 700 358 C 742 358 776 347 805 340" },
          cycle: { label: "骑行", duration: "约 7 分钟", distance: "约 1.75 km", path: "M 395 330 C 445 331 478 355 529 355 C 583 355 619 321 668 320 C 718 319 761 337 805 340" }
        }
      }
    ],
    practical: [
      ["路线节奏", "四个站点由珠江两岸向西关街区串联；建议把进馆参观和用餐作为可伸缩的停留时间。"],
      ["交通参考", "步行是这条 Citywalk 的默认推荐；另可切换公交 / 地铁与骑行。时间和距离为路线查询参考，不含排队、等车和实时路况。"],
      ["骑行提示", "沙面重点区域有非机动车管理要求；进岛后遵守禁行、推行与指定停放提示。"],
      ["地图说明", "点位坐标按 AMap GCJ-02 POI 核对；插画路线用于讲解街区关系，不替代实时导航。"],
      ["照片来源", "每个地点提供 10 张 Wikimedia Commons 候选图，图片详情可查看作者和原始文件页，许可记录保留在资料中。"]
    ],
    dining: [
      { name: "侨美食家（沙面总店）", area: "沙面南街 52 号", cuisine: "粤菜正餐", dishes: "非遗红烧乳鸽、老式菜远炒牛河", price: "参考人均 ¥121", note: "适合把午餐安排在沙面；热门时段可能等位。", source: "携程美食 · 侨美食家（沙面总店）", url: "https://gs.ctrip.com/html5/you/foods/guangzhou152/5323731.html" },
      { name: "阿婆牛杂（永庆坊店）", area: "恩宁路 75 号 · 永庆食集", cuisine: "广府小吃", dishes: "萝卜面筋牛杂、广式牛腩饭", price: "参考人均 ¥30", note: "适合边逛边吃的小份补给；店铺营业时间以门店当天为准。", source: "携程美食 · 阿婆牛杂永庆坊店", url: "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html" },
      { name: "南信牛奶甜品专家", area: "第十甫路 47 号", cuisine: "广式糖水", dishes: "双皮奶、姜撞奶", price: "参考人均 ¥30", note: "适合作为上下九一带的甜品休息；参考价不是固定套餐价。", source: "Meet Guangzhou · 南信牛奶甜品专家", url: "https://meetguangzhou.com/cn/food/nanxinniunaitianpin" },
      { name: "陶陶居酒家（第十甫路总店）", area: "第十甫路 20 号", cuisine: "粤菜 / 早茶", dishes: "大虾饺、百年烧鹅、虾皇烧卖", price: "参考人均 ¥103", note: "老字号热门门店，建议给排队和用餐预留时间。", source: "携程美食 · 陶陶居第十甫路总店", url: "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html" }
    ],
    photoCandidates: {
      ...GUANGZHOU_PHOTO_CANDIDATES,
      "石室圣心大教堂": GUANGZHOU_PHOTO_CANDIDATES["圣心大教堂"],
      "上下九步行街": GUANGZHOU_PHOTO_CANDIDATES["上下九"]
    },
    sources: [
      { label: "广州市政府 · 西关 Citywalk 指引", url: "https://www.gz.gov.cn/zt/jrshts/2026n/nwzgz/nwgz/content/post_10686807.html" },
      { label: "荔湾区政府 · 粤剧艺术博物馆开放时间", url: "https://www.lw.gov.cn/ywb/fw/ly/whss/content/post_9105819.html" },
      { label: "越秀区政府 · 圣心大教堂介绍与地址", url: "https://www.yuexiu.gov.cn/zjyx/yxjd/zjwh/content/post_8665100.html" },
      { label: "本地宝游客须知转述（待堂区确认）", url: "https://news.qq.com/rain/a/20260902A06TQM00" },
      { label: "荔湾区政府 · 沙面重点区域非机动车管理提示", url: "https://www.lw.gov.cn/gzlwsmj/gkmlpt/content/10/10079/post_10079405.html" },
      { label: "携程美食 · 侨美食家（沙面总店）", url: "https://gs.ctrip.com/html5/you/foods/guangzhou152/5323731.html" },
      { label: "携程美食 · 阿婆牛杂永庆坊店", url: "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html" },
      { label: "Meet Guangzhou · 南信牛奶甜品专家", url: "https://meetguangzhou.com/cn/food/nanxinniunaitianpin" },
      { label: "携程美食 · 陶陶居第十甫路总店", url: "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html" }
    ]
  }
};

export const JOURNEYS = Object.fromEntries(
  Object.entries(JOURNEY_CATALOG).filter(([routeId]) => ACTIVE_ROUTE_IDS.has(routeId))
);

for (const [routeId, restaurants] of Object.entries(DINING_BY_ROUTE)) {
  if (!JOURNEYS[routeId]) continue;
  JOURNEYS[routeId].dining = restaurants;
  const sources = JOURNEYS[routeId].sources || [];
  for (const restaurant of restaurants) {
    const url = restaurant.perPerson.url;
    if (url && !sources.some((source) => source.url === url)) sources.push({ label: `${restaurant.name} · ${restaurant.perPerson.source}消费参考`, url });
  }
  JOURNEYS[routeId].sources = sources;
}

for (const [routeId, references] of Object.entries(PHOTO_REFERENCES_BY_ROUTE)) {
  if (JOURNEYS[routeId]) JOURNEYS[routeId].photoReferences = references;
}
for (const [routeId, places] of Object.entries(PHOTO_SUPPLEMENTS_BY_ROUTE)) {
  const journey = JOURNEYS[routeId];
  if (!journey) continue;
  for (const [name, additions] of Object.entries(places)) {
    const candidates = journey.photoCandidates[name] || [];
    journey.photoCandidates[name] = [...candidates, ...additions.filter((photo) => !candidates.some((candidate) => candidate.image === photo.image))];
  }
  if (journey.dataSupplement) {
    journey.dataSupplement.landmarkPhotoCount = Object.values(journey.photoCandidates).reduce((sum, photos) => sum + photos.length, 0);
    journey.dataSupplement.selectedPhotoCount = journey.dataSupplement.landmarkPhotoCount + journey.dataSupplement.diningPhotoCount;
    journey.dataSupplement.sourceNoteIds = [...new Set([...(journey.dataSupplement.sourceNoteIds || []), ...Object.values(journey.photoReferences || {}).flat().map((note) => note.noteId).filter(Boolean)])];
    journey.dataSupplement.sourceNotes = journey.dataSupplement.sourceNoteIds.length;
  }
}

applyBatch01Updates(ROUTES, JOURNEYS);
