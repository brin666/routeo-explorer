// CD-01: supplied references and verified geographic data are kept separate.
export const CD01_ROUTE = {
  "id": "chengdu-cd01-city-day",
  "city": "成都",
  "region": "中国",
  "place": "中国 · 成都",
  "flag": "cn",
  "title": "红墙茶馆到熊猫街区",
  "days": 1,
  "tags": [
    "三国",
    "茶馆",
    "城市",
    "美食"
  ],
  "theme": "chengdu",
  "image": "./assets/routes/chengdu-cd01-map-illustrated-v1.webp",
  "accent": "#dc9659",
  "intro": "上午逛武侯祠，中午坐进人民公园茶馆，下午沿春熙路走到 IFS 与太古里。",
  "quote": "上午看红墙竹影，中午坐下来喝茶。下午换到春熙路一带，沿着步行街去看 IFS 熊猫，最后在太古里安排晚餐。",
  "map": {
    "kind": "city-garden",
    "maxZoom": 1.25,
    "route": "M 204.55 441.6 L 207.42 456.67 C 251.2 471.75 294.98 470.31 338.76 451.65 C 363.88 428.68 382.54 399.98 400.48 368.4 L 439.23 310.98 C 467.22 265.05 490.91 229.88 513.16 191.84 C 533.25 160.26 545.45 133.71 551.2 107.15 L 556.22 43.28 C 537.56 22.46 521.77 9.55 498.09 3.09 L 470.81 22.46 C 456.46 38.25 441.39 56.91 424.88 66.24 M 424.88 66.24 C 439.23 61.94 457.89 44.0 470.81 22.46 L 498.09 3.09 C 570.57 -6.24 643.78 -7.68 719.14 -1.22 C 772.25 8.83 814.59 33.95 841.87 60.5 L 868.42 89.93 M 868.42 89.93 L 878.47 115.05 C 892.11 127.25 920.81 127.25 936.6 117.2 L 961.72 105.0 L 983.25 111.46 M 983.25 111.46 L 983.97 137.3 C 984.69 157.39 987.56 170.31 1001.91 182.51 L 1034.21 194.0 L 1047.85 214.09",
    "roads": [],
    "contours": [],
    "points": [
      {
        "name": "武侯祠",
        "x": 204.55,
        "y": 441.6,
        "color": "#de845b",
        "role": "start",
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": true
      },
      {
        "name": "人民公园",
        "x": 424.88,
        "y": 66.24,
        "color": "#5ba98c",
        "role": null,
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": true,
        "hideCardLabel": false
      },
      {
        "name": "春熙路",
        "x": 868.42,
        "y": 89.93,
        "color": "#6aa1c0",
        "role": null,
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": true,
        "hideCardLabel": false
      },
      {
        "name": "IFS 熊猫",
        "x": 983.25,
        "y": 111.46,
        "color": "#e0a34f",
        "role": null,
        "labelSide": "left",
        "labelY": "above",
        "mobileHide": true,
        "hideCardLabel": false
      },
      {
        "name": "太古里",
        "x": 1047.85,
        "y": 214.09,
        "color": "#889ab0",
        "role": "end",
        "labelSide": "left",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      }
    ]
  },
  "storyArtwork": {
    "image": "./assets/routes/chengdu-cd01-map-illustrated-v1.webp",
    "width": 1672,
    "height": 941,
    "route": "M 285 835 L 289 856 C 350 877 411 875 472 849 C 507 817 533 777 558 733 L 612 653 C 651 589 684 540 715 487 C 743 443 760 406 768 369 L 775 280 C 749 251 727 233 694 224 L 656 251 C 636 273 615 299 592 312 M 592 312 C 612 306 638 281 656 251 L 694 224 C 795 211 897 209 1002 218 C 1076 232 1135 267 1173 304 L 1210 345 M 1210 345 L 1224 380 C 1243 397 1283 397 1305 383 L 1340 366 L 1370 375 M 1370 375 L 1371 411 C 1372 439 1376 457 1396 474 L 1441 490 L 1460 518",
    "markers": [
      {
        "name": "武侯祠",
        "poiId": "B001C07VJ2",
        "x": 285,
        "y": 835,
        "color": "#de845b",
        "labelPlacement": "above-right"
      },
      {
        "name": "人民公园",
        "poiId": "B001C7X8QA",
        "x": 592,
        "y": 312,
        "color": "#5ba98c",
        "labelPlacement": "above-left"
      },
      {
        "name": "春熙路",
        "poiId": "B001C8RQLM",
        "x": 1210,
        "y": 345,
        "color": "#6aa1c0",
        "labelPlacement": "above-left"
      },
      {
        "name": "IFS 熊猫",
        "poiId": "B0L2RCN7OZ",
        "x": 1370,
        "y": 375,
        "color": "#e0a34f",
        "labelPlacement": "above-right"
      },
      {
        "name": "太古里",
        "poiId": "B0FFF6X49V",
        "x": 1460,
        "y": 518,
        "color": "#889ab0",
        "labelPlacement": "below-right"
      }
    ],
    "reference": {
      "coordinateSystem": "GCJ-02",
      "verifiedAt": "2026-10-13",
      "points": [
        {
          "name": "武侯祠",
          "poiName": "成都武侯祠博物馆",
          "poiId": "B001C07VJ2",
          "address": "武侯祠大街231号",
          "coordinate": [
            104.047992,
            30.646168
          ],
          "routeCoordinate": [
            104.049375,
            30.644575
          ],
          "url": "https://ditu.amap.com/place/B001C07VJ2",
          "endpointNote": "转场起点采用高德南门 POI B001C80IRJ"
        },
        {
          "name": "人民公园",
          "poiName": "人民公园",
          "poiId": "B001C7X8QA",
          "address": "小南街8号(人民公园地铁站B口步行250米)",
          "coordinate": [
            104.057641,
            30.65699
          ],
          "routeCoordinate": [
            104.058854,
            30.657759
          ],
          "url": "https://ditu.amap.com/place/B001C7X8QA",
          "endpointNote": "转场采用高德提供的入口位置；缺省时使用 POI 中心"
        },
        {
          "name": "春熙路",
          "poiName": "春熙路步行街",
          "poiId": "B001C8RQLM",
          "address": "春熙路街道",
          "coordinate": [
            104.077774,
            30.655544
          ],
          "routeCoordinate": [
            104.0786,
            30.657882
          ],
          "url": "https://ditu.amap.com/place/B001C8RQLM",
          "endpointNote": "转场采用高德提供的入口位置；缺省时使用 POI 中心"
        },
        {
          "name": "IFS 熊猫",
          "poiName": "成都国际金融中心",
          "poiId": "B0L2RCN7OZ",
          "address": "红星路三段1号(春熙路地铁站出入口旁)",
          "coordinate": [
            104.081503,
            30.654764
          ],
          "routeCoordinate": [
            104.081832,
            30.65457
          ],
          "url": "https://ditu.amap.com/place/B0L2RCN7OZ",
          "endpointNote": "转场采用高德提供的入口位置；缺省时使用 POI 中心"
        },
        {
          "name": "太古里",
          "poiName": "成都太古里",
          "poiId": "B0FFF6X49V",
          "address": "中纱帽街8号",
          "coordinate": [
            104.083809,
            30.653358
          ],
          "routeCoordinate": [
            104.08155,
            30.65276
          ],
          "url": "https://ditu.amap.com/place/B0FFF6X49V",
          "endpointNote": "转场采用高德提供的入口位置；缺省时使用 POI 中心"
        }
      ],
      "archive": "./assets/routes/chengdu-cd01-amap-reference.json",
      "illustratedRouteStatus": "视觉示意；真实转场查询与插画路线分开保存"
    },
    "sourceDetailSize": {
      "width": 1672,
      "height": 941
    },
    "rasterSize": {
      "width": 1672,
      "height": 941
    }
  },
  "snapshots": [
    "city",
    "garden"
  ],
  "story": [
    {
      "day": 1,
      "time": "09:30",
      "title": "武侯祠 · 红墙竹影",
      "body": "上午留两小时看主展区，再沿红墙和竹林走一段。拍照遇到人多时先参观，返回再看；入馆按官方预约时段安排。"
    },
    {
      "day": 1,
      "time": "12:00",
      "title": "人民公园 · 坐下来喝茶",
      "body": "中午在公园附近用餐，下午坐进鹤鸣茶社歇一会儿。盖碗茶、湖边散步都可以按自己的节奏安排，茶饮和体验项目另外消费。"
    },
    {
      "day": 1,
      "time": "15:00",
      "title": "春熙路 · 沿步行街闲逛",
      "body": "从春熙路北段开始逛街，沿步行街向 IFS 方向走。先看街区和店铺，给路口过街与临时停留留出时间。"
    },
    {
      "day": 1,
      "time": "16:00",
      "title": "IFS 熊猫 · 看爬墙熊猫",
      "body": "先在商场外看爬墙熊猫，再按现场L7导视前往七层雕塑庭院，看熊猫正面与平台视角。屋顶开放、活动和排队按当天安排。"
    },
    {
      "day": 1,
      "time": "17:00",
      "title": "太古里 · 街区里收尾",
      "body": "最后走进太古里的街区，在店铺、庭院和街角之间慢慢逛。晚餐可在附近挑面食、钵钵鸡或烤鱼，按当天菜单和分店营业安排。"
    }
  ],
  "guideSources": [
    {
      "label": "成都武侯祠博物馆 · 票务信息",
      "url": "https://www.wuhouci.net.cn/pwxx"
    },
    {
      "label": "武侯祠 · 官方预约购票",
      "url": "https://whpww.cdwuhouci.cn/login"
    },
    {
      "label": "成都 IFS 官方网站",
      "url": "https://www.cdifs.cn/"
    },
    {
      "label": "小红书 · 成都市区三站懒人版（作者经验）",
      "url": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8"
    },
    {
      "label": "高德 · 武侯祠",
      "url": "https://ditu.amap.com/place/B001C07VJ2"
    },
    {
      "label": "高德 · 人民公园",
      "url": "https://ditu.amap.com/place/B001C7X8QA"
    },
    {
      "label": "高德 · 春熙路",
      "url": "https://ditu.amap.com/place/B001C8RQLM"
    },
    {
      "label": "高德 · IFS 熊猫",
      "url": "https://ditu.amap.com/place/B0L2RCN7OZ"
    },
    {
      "label": "高德 · 太古里",
      "url": "https://ditu.amap.com/place/B0FFF6X49V"
    }
  ]
};

export const CD01_JOURNEY = {
  "eyebrow": "CHENGDU · CD-01",
  "duration": "1 日",
  "distance": "约 5.4 km（步行查询参考）",
  "stopTimes": [
    "09:30",
    "12:00",
    "15:00",
    "16:00",
    "17:00"
  ],
  "stopTags": [
    [
      "三国",
      "红墙",
      "竹林"
    ],
    [
      "鹤鸣茶社",
      "湖边",
      "休息"
    ],
    [
      "步行街",
      "商圈",
      "逛街"
    ],
    [
      "熊猫地标",
      "建筑",
      "拍照"
    ],
    [
      "开放街区",
      "庭院",
      "晚餐"
    ]
  ],
  "previewImages": [
    "./assets/routes/cd01-reference-photos/stop-1-photo-02.webp",
    "./assets/routes/cd01-reference-photos/supp-20261013-09.webp",
    "./assets/routes/cd01-reference-photos/supp-20261013-01.webp",
    "./assets/routes/cd01-reference-photos/supp-20261013-ifs-panda.webp",
    "./assets/routes/cd01-reference-photos/supp-20261013-05.webp"
  ],
  "stopAccess": [
    {
      "heading": "门票与预约",
      "value": "文物区全价 ¥50，半价 ¥25；官方实名预约购票，预售14天内门票。常规9:00–18:00，17:00停止入馆；优惠资格与临时调整查看官方公告（2026-10-13核对）。"
    },
    {
      "heading": "门票与消费",
      "value": "本次以公园散步与茶社休息为主；茶饮、采耳等单独消费。具体项目价格和公园当日安排待补充核对。"
    },
    {
      "heading": "街区游览",
      "value": "本次安排公共步行街外部游览；店铺营业、展览和体验项目按各自安排。"
    },
    {
      "heading": "熊猫与上楼指引",
      "value": "熊猫正面观赏点在IFS七层雕塑庭院。官网到达页面列商场10:00–22:00，屋顶独立开放与临时限流请另看现场安排。可从一层入口按L7导视寻找可达七层的电梯；具体电梯位置参考游客图文，到店以现场指引为准。"
    },
    {
      "heading": "街区游览",
      "value": "本次以开放街区散步为主；商户、展览及街区内场馆按各自票务和开放安排。"
    }
  ],
  "legs": [
    {
      "from": "武侯祠",
      "to": "人民公园",
      "recommendedMode": "cycle",
      "recommendation": "骑行约13分钟；转场后把体力留给公园。也可选步行或公交。",
      "straightLineDistance": "约 1.52 km",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 28 分钟",
          "distance": "约 2.07 km",
          "detail": "高德查询参考；以所选入口之间的路线计时。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 285 835 L 289 856 C 350 877 411 875 472 849 C 507 817 533 777 558 733 L 612 653 C 651 589 684 540 715 487 C 743 443 760 406 768 369 L 775 280 C 749 251 727 233 694 224 L 656 251 C 636 273 615 299 592 312"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 36 分钟",
          "distance": "约 2.62 km",
          "detail": "步行192米到达武侯祠站；乘坐57路(智星二路中--火车北站公交站(蓉北商贸大道口))途径3站到达东城根南街站；步行314米到达目的地；班次和实时等候另核对。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 285 835 L 289 856 C 350 877 411 875 472 849 C 507 817 533 777 558 733 L 612 653 C 651 589 684 540 715 487 C 743 443 760 406 768 369 L 775 280 C 749 251 727 233 694 224 L 656 251 C 636 273 615 299 592 312"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 14 分钟",
          "distance": "约 3.26 km",
          "detail": "不含找车、解锁和停车时间；步行街内遵守现场骑行管理。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 285 835 L 289 856 C 350 877 411 875 472 849 C 507 817 533 777 558 733 L 612 653 C 651 589 684 540 715 487 C 743 443 760 406 768 369 L 775 280 C 749 251 727 233 694 224 L 656 251 C 636 273 615 299 592 312"
        }
      }
    },
    {
      "from": "人民公园",
      "to": "春熙路",
      "recommendedMode": "transit",
      "recommendation": "公交到春熙路北段，减少下午转场步行；骑行也是备选。",
      "straightLineDistance": "约 1.93 km",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 27 分钟",
          "distance": "约 1.96 km",
          "detail": "高德查询参考；以所选入口之间的路线计时。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 592 312 C 612 306 638 281 656 251 L 694 224 C 795 211 897 209 1002 218 C 1076 232 1135 267 1173 304 L 1210 345"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 12 分钟",
          "distance": "约 2.00 km",
          "detail": "步行122米到达人民公园(蜀都大道)；乘坐58路(万家湾公交站--五桂桥公交站)途径0站到达春熙路步行街北；步行26米到达目的地；班次和实时等候另核对。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 592 312 C 612 306 638 281 656 251 L 694 224 C 795 211 897 209 1002 218 C 1076 232 1135 267 1173 304 L 1210 345"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 8 分钟",
          "distance": "约 1.97 km",
          "detail": "不含找车、解锁和停车时间；步行街内遵守现场骑行管理。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 592 312 C 612 306 638 281 656 251 L 694 224 C 795 211 897 209 1002 218 C 1076 232 1135 267 1173 304 L 1210 345"
        }
      }
    },
    {
      "from": "春熙路",
      "to": "IFS 熊猫",
      "recommendedMode": "walk",
      "recommendation": "进入商圈后步行串联，途中留意路口与人流。",
      "straightLineDistance": "约 367 m",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 13 分钟",
          "distance": "约 959 m",
          "detail": "高德查询参考；以所选入口之间的路线计时。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 1210 345 L 1224 380 C 1243 397 1283 397 1305 383 L 1340 366 L 1370 375"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 18 分钟",
          "distance": "约 1.29 km",
          "detail": "步行26米到达春熙路步行街北；乘坐58路(万家湾公交站--五桂桥公交站)途径0站到达大慈寺站；步行612米到达目的地；班次和实时等候另核对。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 1210 345 L 1224 380 C 1243 397 1283 397 1305 383 L 1340 366 L 1370 375"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 4 分钟",
          "distance": "约 994 m",
          "detail": "不含找车、解锁和停车时间；步行街内遵守现场骑行管理。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 1210 345 L 1224 380 C 1243 397 1283 397 1305 383 L 1340 366 L 1370 375"
        }
      }
    },
    {
      "from": "IFS 熊猫",
      "to": "太古里",
      "recommendedMode": "walk",
      "recommendation": "相邻街区步行连接；本次未取得可用公共交通方案。",
      "straightLineDistance": "约 270 m",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 6 分钟",
          "distance": "约 430 m",
          "detail": "高德查询参考；以所选入口之间的路线计时。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 1370 375 L 1371 411 C 1372 439 1376 457 1396 474 L 1441 490 L 1460 518"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 2 分钟",
          "distance": "约 450 m",
          "detail": "不含找车、解锁和停车时间；步行街内遵守现场骑行管理。",
          "source": "AMap JS API 2.0",
          "queriedAt": "2026-10-13",
          "path": "M 1370 375 L 1371 411 C 1372 439 1376 457 1396 474 L 1441 490 L 1460 518"
        }
      }
    }
  ],
  "practical": [
    [
      "参考时间",
      "时间线是可调整的一日游初稿；预留午餐、茶馆休息与晚餐，具体出行日期尚未确定。"
    ],
    [
      "交通参考",
      "数据于2026-10-13通过高德查询；入口之间的步行参考合计约5.4公里，园内与逛街距离另计。骑行需另留找车和停车时间。"
    ],
    [
      "地图说明",
      "插画保留地理关系并适度放大地标；虚线沿画面道路讲解站点顺序，实际导航请打开高德。"
    ],
    [
      "照片与餐饮",
      "五站均有实景照片；鹤鸣的两版同名茶价牌存在差异，现价待核。餐饮菜单与个人消费记录分别参考。"
    ]
  ],
  "photoCandidates": {
    "武侯祠": [
      {
        "title": "武侯祠 · 汉昭烈庙入口",
        "image": "./assets/routes/cd01-reference-photos/stop-1-photo-02.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "武侯祠 · 红墙月洞门与竹林",
        "image": "./assets/routes/cd01-reference-photos/stop-1-photo-03.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "武侯祠 · 红墙竹影与游人",
        "image": "./assets/routes/cd01-reference-photos/stop-1-photo-04.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "武侯祠 · 门头牌匾",
        "image": "./assets/routes/cd01-reference-photos/stop-1-entrance-sign.webp",
        "source": "https://www.xiaohongshu.com/explore/6a805972000000002402563e",
        "artist": "倔强的小狮子8by",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      }
    ],
    "人民公园": [
      {
        "title": "人民公园 · 湖面游船与两岸绿植",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-09.webp",
        "source": "https://www.xiaohongshu.com/explore/6ac72011000000001801b837",
        "artist": "Haisea",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "4天前 四川",
        "sourceDescription": "湖面游船与两岸绿植；地点依作者正文，非茶社饮茶特写",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 临湖步道与树荫",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-10.webp",
        "source": "https://www.xiaohongshu.com/explore/6ac72011000000001801b837",
        "artist": "Haisea",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "4天前 四川",
        "sourceDescription": "临湖步道、岸边生活与树荫；地点依作者正文",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 林荫园路与绿地",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-11.webp",
        "source": "https://www.xiaohongshu.com/explore/6ac72011000000001801b837",
        "artist": "Haisea",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "4天前 四川",
        "sourceDescription": "林荫园路与绿地；地点依作者正文",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 木构亭廊与园路",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-12.webp",
        "source": "https://www.xiaohongshu.com/explore/6ac72011000000001801b837",
        "artist": "Haisea",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "4天前 四川",
        "sourceDescription": "木构亭廊与开阔园路；地点依作者正文",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 石拱桥与湖面倒影",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-13.webp",
        "source": "https://www.xiaohongshu.com/explore/6a5e41070000000011018541",
        "artist": "晓景",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "07-20",
        "sourceDescription": "石拱桥、湖面倒影和岸边树林；地点依作者标题",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 辛亥秋保路死事纪念碑",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-14.webp",
        "source": "https://www.xiaohongshu.com/explore/6a5e41070000000011018541",
        "artist": "晓景",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "07-20",
        "sourceDescription": "辛亥保路纪念碑，碑体字样可辨，园林环境为主体",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "人民公园 · 鹤鸣茶社树荫茶座",
        "image": "./assets/routes/cd01-reference-photos/stop-2-photo-05.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "人民公园 · 百年鹤鸣茶社招牌",
        "image": "./assets/routes/cd01-reference-photos/stop-2-heming-roof.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "人民公园 · 鹤鸣牌匾与竹椅茶座",
        "image": "./assets/routes/cd01-reference-photos/stop-2-heming-seating.webp",
        "source": "https://www.xiaohongshu.com/explore/6ac60628000000001c00eade",
        "artist": "三克游拍成都",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      }
    ],
    "春熙路": [
      {
        "title": "春熙路 · 步行街纵深与街景",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-01.webp",
        "source": "https://www.xiaohongshu.com/explore/6a042dcb0000000007023040",
        "artist": "鸽子offices",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "05-13",
        "sourceDescription": "步行街纵向街景；地点按作者说明，未独立GPS定位",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "春熙路 · 凤祥楼钟楼立面",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-02.webp",
        "source": "https://www.xiaohongshu.com/explore/6a042dcb0000000007023040",
        "artist": "鸽子offices",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "05-13",
        "sourceDescription": "凤祥楼钟楼立面，招牌可读；道路名仍按作者说明，未独立GPS定位",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "春熙路 · 商业街与人流",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-03.webp",
        "source": "https://www.xiaohongshu.com/explore/6abe43350000000018005e6a",
        "artist": "眼泪珠珠",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "10-01 四川",
        "sourceDescription": "街道与商业立面；作者明确自述摄于2026/09/30",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "春熙路 · 铭牌、浮雕与花坛",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-04.webp",
        "source": "https://www.xiaohongshu.com/explore/6abe43350000000018005e6a",
        "artist": "眼泪珠珠",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "10-01 四川",
        "sourceDescription": "春熙路铭牌及路边设施；可读路名，作者自述摄于2026/09/30",
        "checkedAt": "2026-10-13"
      }
    ],
    "IFS 熊猫": [
      {
        "title": "IFS 熊猫 · 正面与平台倒影",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-ifs-panda.webp",
        "source": "https://www.xiaohongshu.com/explore/6a534f2d000000000f006ec4",
        "artist": "HuiYi",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认"
      },
      {
        "title": "IFS 熊猫 · 外立面与街景",
        "image": "./assets/routes/cd01-reference-photos/stop-4-photo-01.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "IFS 熊猫 · 屋顶熊猫与周边楼群",
        "image": "./assets/routes/cd01-reference-photos/stop-4-photo-08.webp",
        "source": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8",
        "artist": "AAA专业饼干打孔造姐",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      },
      {
        "title": "IFS 熊猫 · 屋顶花园远景（作者加字）",
        "image": "./assets/routes/cd01-reference-photos/stop-4-roof-garden.webp",
        "source": "https://www.xiaohongshu.com/explore/6a9025f70000000025039618",
        "artist": "励志迪",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地方案参考，转载许可未确认"
      }
    ],
    "太古里": [
      {
        "title": "太古里 · LOEWE门头与石板街道",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-05.webp",
        "source": "https://www.xiaohongshu.com/explore/69f3fea5000000003502fafe",
        "artist": "HHH",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "05-01",
        "sourceDescription": "LOEWE建筑与石板街道；以作者所述位置结合招牌/街区形态，不声称GPS核验",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "太古里 · LV立面与灰瓦屋顶",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-06.webp",
        "source": "https://www.xiaohongshu.com/explore/6abfd8a5000000001c02db8a",
        "artist": "马国强硬笔",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "10-03 四川",
        "sourceDescription": "LV沿街立面和灰瓦街区；位置依作者标题",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "太古里 · 夜间步行街与公共空间",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-07.webp",
        "source": "https://www.xiaohongshu.com/explore/6abfd8a5000000001c02db8a",
        "artist": "马国强硬笔",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "10-03 四川",
        "sourceDescription": "步行街景、建筑与公共空间；位置依作者标题",
        "checkedAt": "2026-10-13"
      },
      {
        "title": "太古里 · HERMÈS临街建筑",
        "image": "./assets/routes/cd01-reference-photos/supp-20261013-08.webp",
        "source": "https://www.xiaohongshu.com/explore/6abfd8a5000000001c02db8a",
        "artist": "马国强硬笔",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 本地参考，使用状态未确认",
        "sourceNoteDate": "10-03 四川",
        "sourceDescription": "HERMES门店建筑与夜间公共空间；位置依作者标题",
        "visualCorrection": "原索引标注夜间，但图片天空明亮；页面标题不标时段。",
        "checkedAt": "2026-10-13"
      }
    ]
  },
  "photoIntro": "从武侯祠翻到人民公园、春熙路、IFS和太古里。翻完一站自动进入下一站，下方可看不同作者的参考笔记。",
  "photoEmptyText": "这个地点的实景照片待补充",
  "diningIntro": "人民公园可以留一段喝茶的时间。逛完春熙路和太古里，再从面食、钵钵鸡或烤鱼里选一顿。下面附门店线索和原始记录，未确认的现价、营业与等位信息会写明。",
  "dining": [
    {
      "id": "cd01-heming",
      "area": "人民公园 · 茶歇",
      "cuisine": "盖碗茶",
      "name": "鹤鸣茶社",
      "address": "人民公园内",
      "dishes": "盖碗红茶、绿茶，适合留一段坐下来喝茶的时间。",
      "perPerson": {
        "value": null,
        "values": [
          20,
          25
        ],
        "currency": "CNY",
        "unit": "杯",
        "source": "小红书价牌",
        "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
        "status": "tea-menu-conflict",
        "checkedAt": "2026-10-13"
      },
      "price": "来源价牌：鹤鸣有机红茶 ¥20/杯或 ¥25/杯，现价待核",
      "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
      "source": "小红书价牌记录",
      "displayNote": "两版价牌写的是同名有机红茶，分别为20元和25元/杯；生效时间、适用茶座和现价待确认。",
      "note": "20元与25元价牌都写“鹤鸣有机红茶”，同为每杯价格；不能用不同茶款解释差异。两版均无明确拍摄/生效年，25元版作者注明9.25涨价后但未标年。标题2026.10.10的新笔记实际未见可读价牌，不能作为现价证据。旧游客自述20元/人为个人消费记录，与价牌杯价分开。",
      "photos": [
        {
          "title": "鹤鸣有机红茶 · 20元版来源价牌（现价待核）",
          "kind": "menu",
          "image": "./assets/routes/dining-reference-photos/cd01-heming-price20-20261013.webp",
          "source": "小红书价牌记录",
          "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
          "credit": "竹子不卷了",
          "recordNote": "页面日期不能代表菜单拍摄或生效日期，现价未确认",
          "usage": "本地参考，使用状态未确认",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "鹤鸣有机红茶 · 25元版来源价牌（现价待核）",
          "kind": "menu",
          "source": "小红书",
          "credit": "200度",
          "recordNote": "照片注明9.25涨价后，年份未显示，不代表现价",
          "image": "./assets/routes/dining-reference-photos/cd01-heming-1.webp",
          "url": "https://www.xiaohongshu.com/explore/6ab5e73200000000180060cb",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "鹤鸣有机红茶 · 20元版手卡（现价待核）",
          "kind": "menu",
          "image": "./assets/routes/dining-reference-photos/cd01-heming-card20-20261013.webp",
          "source": "小红书价牌记录",
          "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
          "credit": "竹子不卷了",
          "recordNote": "页面日期不能代表菜单拍摄或生效日期，现价未确认",
          "usage": "本地参考，使用状态未确认",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "盖碗红茶实拍",
          "kind": "dish",
          "source": "小红书",
          "credit": "竹子不卷了",
          "image": "./assets/routes/dining-reference-photos/cd01-heming-2.webp",
          "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "盖碗茶具与红茶包装",
          "kind": "environment",
          "source": "小红书",
          "credit": "竹子不卷了",
          "image": "./assets/routes/dining-reference-photos/cd01-heming-3.webp",
          "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "cd01-zili",
      "area": "春熙路商圈 · 华兴东街",
      "cuisine": "面食",
      "name": "华兴街自力面店",
      "address": "华兴东街63号",
      "dishes": "素椒杂酱面、红烧牛肉面。按一两、二两、三两选份量。",
      "perPerson": {
        "value": 17,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥17（携程）",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html",
      "source": "携程",
      "displayNote": "适合单人简餐，份量不同，价格也会变化。",
      "note": "携程精确分店平台人均17元，2026-10-13核对。首张菜单来自2025-01-18小红书探店照片，旧单品价格不替代平台人均或当日菜单。 补充笔记显示09-27但未标年；新旧照片中牛肉面一/二/三两为12/15/17元、杂酱面为10/13/15元，均是单碗规格价，不能推算当前人均或称2026最新菜单。",
      "photos": [
        {
          "title": "自力面店 · 补充墙面菜单（现价待核）",
          "kind": "menu",
          "image": "./assets/routes/dining-reference-photos/cd01-zili-menu-supp-20261013.webp",
          "source": "小红书价牌记录",
          "url": "https://www.xiaohongshu.com/explore/6ab8cc38000000001402f83b",
          "credit": "不吃葱",
          "recordNote": "页面日期不能代表菜单拍摄或生效日期，现价未确认",
          "usage": "本地参考，使用状态未确认",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "参考菜单实拍",
          "kind": "menu",
          "source": "小红书",
          "credit": "小熊猫",
          "recordedAt": "2025-01-18",
          "image": "./assets/routes/dining-reference-photos/cd01-zili-1.webp",
          "url": "https://www.xiaohongshu.com/explore/678b72f6000000001901a388",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "拌面实拍",
          "kind": "dish",
          "image": "./assets/routes/dining-reference-photos/cd01-zili-2.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/01008120008g142f39AA4_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "牛肉面实拍",
          "kind": "dish",
          "image": "./assets/routes/dining-reference-photos/cd01-zili-3.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0101012000933qggy0560_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "夹起拌面实拍",
          "kind": "dish",
          "image": "./assets/routes/dining-reference-photos/cd01-zili-4.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0104e12000933ouav340F_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "cd01-yepopo",
      "area": "太古里周边 · 油篓街",
      "cuisine": "钵钵鸡",
      "name": "嘉州叶婆婆钵钵鸡（太古里店）",
      "address": "油篓街68号",
      "dishes": "红油钵钵鸡、藤椒钵钵鸡，搭配薄饼或甜品。",
      "perPerson": {
        "value": 49,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/22404248.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥49（携程）",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/22404248.html",
      "source": "携程",
      "displayNote": "按签子选食材，消费随种类和数量变化。",
      "note": "携程太古里分店人均49元，2026-10-13核对；图片来自该分店相册，未取得当前完整菜单。",
      "photos": [
        {
          "title": "红油钵钵鸡串串特写",
          "kind": "dish",
          "credit": "肉球球大白",
          "image": "./assets/routes/dining-reference-photos/cd01-yepopo-1.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/22404248.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/01A32120008qpbnmj28FA_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "莲藕钵钵鸡实拍",
          "kind": "dish",
          "image": "./assets/routes/dining-reference-photos/cd01-yepopo-2.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/22404248.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/100c1a0000018w0q0898F_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "冰粉实拍",
          "kind": "dish",
          "credit": "leana走四方",
          "image": "./assets/routes/dining-reference-photos/cd01-yepopo-3.jpg",
          "source": "携程",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/22404248.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/1me2c12000caoc6izD5FF_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "门店与餐品参考图",
          "kind": "reference",
          "source": "小红书",
          "credit": "我不中了😑",
          "recordNote": "介绍拼图，不是菜单；可见日期09-25未显示年份",
          "image": "./assets/routes/dining-reference-photos/cd01-yepopo-4.webp",
          "url": "https://www.xiaohongshu.com/explore/6ab60819000000001b02cee4",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "cd01-kaojiang",
      "area": "春熙路商圈 · 香槟广场",
      "cuisine": "麻辣烤鱼",
      "name": "烤匠麻辣烤鱼（春熙路店）",
      "address": "东大街97号香槟广场1幢3层317–318号",
      "dishes": "麻辣烤鱼、黑豆花。适合多人分食，点单前确认辣度。",
      "perPerson": {
        "value": 92,
        "currency": "CNY",
        "source": "携程",
        "url": "https://you.ctrip.com/food/104/5714679.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥92（携程）",
      "url": "https://you.ctrip.com/food/104/5714679.html",
      "source": "携程",
      "displayNote": "此店在香槟广场，注意与群光广场分店区分。",
      "note": "携程春熙路分店人均92元，来自用户反馈，2026-10-13核对。三张图关联该店2022-02-03作者蓝莓奶油冻的外带点评，不认作当前菜单。",
      "photos": [
        {
          "title": "外带烤鱼与豆花实拍",
          "kind": "dish",
          "credit": "蓝莓奶油冻",
          "recordedAt": "2022-02-03",
          "image": "./assets/routes/dining-reference-photos/cd01-kaojiang-1.jpg",
          "source": "携程",
          "url": "https://you.ctrip.com/food/104/5714679.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0103z120009agksvnD81F_W_640_10000.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "豆花特写",
          "kind": "dish",
          "credit": "蓝莓奶油冻",
          "recordedAt": "2022-02-03",
          "image": "./assets/routes/dining-reference-photos/cd01-kaojiang-2.jpg",
          "source": "携程",
          "url": "https://you.ctrip.com/food/104/5714679.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/01059120009aglxxc8BB9_W_640_10000.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "烤鱼肉特写",
          "kind": "dish",
          "credit": "蓝莓奶油冻",
          "recordedAt": "2022-02-03",
          "image": "./assets/routes/dining-reference-photos/cd01-kaojiang-3.jpg",
          "source": "携程",
          "url": "https://you.ctrip.com/food/104/5714679.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0104m120009aghriy1727_W_640_10000.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "香槟广场门店与餐品参考图",
          "kind": "reference",
          "source": "小红书",
          "credit": "我不中了😑",
          "recordNote": "作者称香槟广场店，与当前春熙路店地址对应；介绍拼图，不是菜单",
          "image": "./assets/routes/dining-reference-photos/cd01-kaojiang-4.webp",
          "url": "https://www.xiaohongshu.com/explore/6ab60819000000001b02cee4",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    }
  ],
  "sources": [
    {
      "label": "成都武侯祠博物馆 · 票务信息",
      "url": "https://www.wuhouci.net.cn/pwxx"
    },
    {
      "label": "武侯祠 · 官方预约购票",
      "url": "https://whpww.cdwuhouci.cn/login"
    },
    {
      "label": "成都 IFS 官方网站",
      "url": "https://www.cdifs.cn/"
    },
    {
      "label": "小红书 · 成都市区三站懒人版（作者经验）",
      "url": "https://www.xiaohongshu.com/explore/69f8bb27000000001a02c6a8"
    },
    {
      "label": "高德 · 武侯祠",
      "url": "https://ditu.amap.com/place/B001C07VJ2"
    },
    {
      "label": "高德 · 人民公园",
      "url": "https://ditu.amap.com/place/B001C7X8QA"
    },
    {
      "label": "高德 · 春熙路",
      "url": "https://ditu.amap.com/place/B001C8RQLM"
    },
    {
      "label": "高德 · IFS 熊猫",
      "url": "https://ditu.amap.com/place/B0L2RCN7OZ"
    },
    {
      "label": "高德 · 太古里",
      "url": "https://ditu.amap.com/place/B0FFF6X49V"
    },
    {
      "label": "小红书 · 春熙路餐饮合集（门店线索，推广迹象待核）",
      "url": "https://www.xiaohongshu.com/explore/6ab60819000000001b02cee4"
    },
    {
      "label": "小红书 · 自力面店2025菜单照片",
      "url": "https://www.xiaohongshu.com/explore/678b72f6000000001901a388"
    },
    {
      "label": "小红书 · 鹤鸣茶社20元版价牌记录",
      "url": "https://www.xiaohongshu.com/explore/6ac3d103000000001a025759"
    },
    {
      "label": "携程 · 华兴街自力面店地址对照",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/104/5233627.html"
    },
    {
      "label": "携程 · 嘉州叶婆婆太古里店地址对照",
      "url": "https://us.trip.com/restaurant/china/chengdu/detail/ye-po-po-taikooli-branch-56563314/"
    },
    {
      "label": "成都IFS · 熊猫七层雕塑庭院",
      "url": "https://www.cdifs.cn/zh/giant-panda"
    },
    {
      "label": "成都IFS · 到达方式与商场营业时间",
      "url": "https://www.cdifs.cn/zh/how-to-get-here-sharp"
    }
  ],
  "labelPlacements": [
    "above-right",
    "above-left",
    "above-left",
    "above-right",
    "below-right"
  ],
  "diningNote": "茶价、单品单价与一餐人均分别列出；2025年菜单和游客消费记录只供参考。选店后再核对当日菜单、门牌与等位情况。",
  "dataSupplement": {
    "updatedAt": "2026-10-13",
    "sourceNotes": 17,
    "originalCollectionWebImages": 142,
    "originalCollection": "CD-01_成都市区一日游",
    "sourceNotesScope": "当前采用照片与参考笔记的去重笔记数；不代表补充包全部采集笔记数",
    "selectedPhotoCount": 43,
    "diningReferenceCount": 4,
    "missing": [
      "鹤鸣同名20/25价牌的生效年份、茶座适用范围和现价",
      "自力补图拍摄年份与当期菜单",
      "叶婆婆太古里与烤匠香槟广场的现行分店菜单",
      "IFS屋顶独立开放、当前电梯与无障碍路径",
      "人民公园当前官方开放与入园说明"
    ],
    "networkReference": "新增路网为WGS84；现有高德点位为GCJ-02，两段路网参考没有替换现有入口交通查询。",
    "landmarkPhotoCount": 25,
    "diningPhotoCount": 18,
    "sourceNoteIds": [
      "69f8bb27000000001a02c6a8",
      "6a805972000000002402563e",
      "6ac72011000000001801b837",
      "6a5e41070000000011018541",
      "6ac60628000000001c00eade",
      "6a042dcb0000000007023040",
      "6abe43350000000018005e6a",
      "6a534f2d000000000f006ec4",
      "6a9025f70000000025039618",
      "69f3fea5000000003502fafe",
      "6abfd8a5000000001c02db8a",
      "6ac3d103000000001a025759",
      "6ab5e73200000000180060cb",
      "6ab8cc38000000001402f83b",
      "678b72f6000000001901a388",
      "6ab60819000000001b02cee4",
      "6ac12d390000000018004244"
    ]
  }
};
