// xian-xa01: GCJ-02 references and illustration pixels are stored separately.
export const XA01_ROUTE = {
  "id": "xian-xa01-qujiang-day",
  "city": "西安",
  "region": "中国",
  "place": "中国 · 西安",
  "flag": "cn",
  "title": "雁塔入夜，走到不夜城",
  "days": 1,
  "tags": [
    "大雁塔",
    "曲江",
    "夜游",
    "唐风街景",
    "城市",
    "美食"
  ],
  "theme": "xian",
  "image": "./assets/routes/xian-xa01-map-illustrated-v1.webp",
  "accent": "#b76649",
  "intro": "主线从大雁塔南广场走到大唐不夜城。想多逛一处园林，可以下午先去大唐芙蓉园；只看夜景则直接从南广场开始。",
  "quote": "先选要不要加一段园林，再从雁塔南广场开始夜游。门票、演出、吃饭和购物分别安排，具体开放与场次按出发当天确认。",
  "map": {
    "kind": "city-garden",
    "maxZoom": 1.25,
    "route": "M 930 445 C 900 444 862 434 834 414 C 808 394 787 368 755 354 C 700 330 628 326 555 317 M 555 317 C 554 425 550 546 548 655 C 547 726 546 791 545 846",
    "roads": [],
    "contours": [],
    "points": [
      {
        "name": "大唐芙蓉园（可选）",
        "x": 667.46,
        "y": 319.21,
        "color": "#b76649",
        "role": "start",
        "labelSide": "left",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      },
      {
        "name": "大雁塔南广场",
        "x": 398.33,
        "y": 227.39,
        "color": "#d0a456",
        "role": null,
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      },
      {
        "name": "大唐不夜城 · 开元广场",
        "x": 391.15,
        "y": 606.85,
        "color": "#648f86",
        "role": "end",
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      }
    ]
  },
  "storyArtwork": {
    "image": "./assets/routes/xian-xa01-map-illustrated-v1.webp",
    "width": 1672,
    "height": 941,
    "route": "M 930 445 C 900 444 862 434 834 414 C 808 394 787 368 755 354 C 700 330 628 326 555 317 M 555 317 C 554 425 550 546 548 655 C 547 726 546 791 545 846",
    "markers": [
      {
        "name": "大唐芙蓉园（可选）",
        "poiId": "B001D092BB",
        "x": 930,
        "y": 445,
        "color": "#b76649",
        "labelPlacement": "above-right",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      },
      {
        "name": "大雁塔南广场",
        "poiId": "B001D12PCJ",
        "x": 555,
        "y": 317,
        "color": "#d0a456",
        "labelPlacement": "above-left",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      },
      {
        "name": "大唐不夜城 · 开元广场",
        "poiId": "B001D0VVLI",
        "x": 545,
        "y": 846,
        "color": "#648f86",
        "labelPlacement": "above-right",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      }
    ],
    "reference": {
      "coordinateSystem": "GCJ-02",
      "verifiedAt": "2026-10-13",
      "points": [
        {
          "name": "大唐芙蓉园",
          "poiId": "B001D092BB",
          "address": "曲江新区芙蓉西路99号",
          "type": "风景名胜;风景名胜;国家级景点",
          "coordinate": [
            108.97436,
            34.212717
          ],
          "entrance": [
            108.96971,
            34.212799
          ],
          "poiName": "大唐芙蓉园",
          "routeCoordinate": [
            108.96971,
            34.212799
          ],
          "url": "https://ditu.amap.com/place/B001D092BB",
          "endpointNote": "高德景区入口位置，邻近御苑门西门；真实开放仍以现场安排为准"
        },
        {
          "name": "大雁塔南广场",
          "poiId": "B001D12PCJ",
          "address": "慈恩路大悦城旁边",
          "type": "风景名胜;公园广场;公园广场",
          "coordinate": [
            108.964202,
            34.215872
          ],
          "entrance": [
            108.964385,
            34.215368
          ],
          "poiName": "大雁塔南广场",
          "routeCoordinate": [
            108.964385,
            34.215368
          ],
          "url": "https://ditu.amap.com/place/B001D12PCJ",
          "endpointNote": "高德入口或公开观赏位置；未实测门禁及通行"
        },
        {
          "name": "大唐不夜城",
          "poiId": "B001D0VVLI",
          "address": "雁塔南路428号大唐不夜城内(南侧)",
          "type": "风景名胜;公园广场;城市广场",
          "coordinate": [
            108.964156,
            34.204818
          ],
          "entrance": [
            108.964007,
            34.20408
          ],
          "poiName": "开元广场",
          "routeCoordinate": [
            108.964156,
            34.204818
          ],
          "url": "https://ditu.amap.com/place/B001D0VVLI",
          "endpointNote": "不夜城南端开元广场作为结束代表点"
        }
      ],
      "archive": "./assets/routes/xian-xa01-amap-reference.json",
      "illustratedRouteStatus": "道路视觉示意；高德真实转场节点单独归档，插画路径不作逐点导航投影"
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
    "garden",
    "night"
  ],
  "story": [
    {
      "day": 1,
      "time": "下午 · 可选",
      "title": "大唐芙蓉园 · 加一段园林前奏",
      "body": "如果想把园林安排进当天，可在下午先逛大唐芙蓉园，再前往大雁塔一带；这段是可选前置，不去也可以直接开始夜游。门票当日有效，票价、开放时段和演出场次按购票当天官方信息确认。"
    },
    {
      "day": 1,
      "time": "傍晚",
      "title": "大雁塔南广场 · 从雁塔一带起步",
      "body": "傍晚到大雁塔南广场走走，留意周边人流与当天安排。路线以广场外部观景为主；若要入塔或进入独立收费区域，另行查看官方售票与预约信息。"
    },
    {
      "day": 1,
      "time": "夜间",
      "title": "大唐不夜城 · 走到开元广场",
      "body": "从雁塔南广场转入大唐不夜城步行街，按体力和现场人流走到开元广场收尾。演出、店铺消费和单独收费项目分别确认，实际开放与场次以当天信息为准。"
    }
  ],
  "guideSources": [
    {
      "label": "小红书 · 大唐芙蓉园入口与园内实景（作者记录）",
      "url": "https://www.xiaohongshu.com/explore/69f02234000000003700cc77"
    },
    {
      "label": "小红书 · 大雁塔夜游体验（作者记录）",
      "url": "https://www.xiaohongshu.com/explore/6a82c6c700000000270228d1"
    },
    {
      "label": "小红书 · 大唐不夜城夜景（作者记录）",
      "url": "https://www.xiaohongshu.com/explore/69ad79af000000002202f84a"
    },
    {
      "label": "高德 · 大唐芙蓉园",
      "url": "https://ditu.amap.com/place/B001D092BB"
    },
    {
      "label": "高德 · 大雁塔南广场",
      "url": "https://ditu.amap.com/place/B001D12PCJ"
    },
    {
      "label": "高德 · 开元广场",
      "url": "https://ditu.amap.com/place/B001D0VVLI"
    }
  ]
};

export const XA01_JOURNEY = {
  "eyebrow": "XI'AN · XA-01",
  "duration": "下午夜游 · 园区可选前置",
  "distance": "约 2.3 km（入口间步行参考）",
  "stopTimes": [
    "下午 · 可选",
    "傍晚",
    "夜间"
  ],
  "stopTags": [
    [
      "园林",
      "可选前置",
      "独立票务"
    ],
    [
      "大雁塔",
      "南广场",
      "夜游起点"
    ],
    [
      "步行街",
      "夜景",
      "开元广场终点"
    ]
  ],
  "previewImages": [
    "./assets/routes/xa01-reference-photos/stop-1-furongyuan-01.webp",
    "./assets/routes/xa01-reference-photos/stop-2-dayanta-04.webp",
    "./assets/routes/xa01-reference-photos/stop-3-datang-night-17.webp"
  ],
  "stopAccess": [
    {
      "heading": "园区门票与开放",
      "value": "大唐芙蓉园是可选前置段；官网票务页说明门票当日有效。票价、开放时段和演出安排按购票当天官方信息确认。"
    },
    {
      "heading": "广场与入塔",
      "value": "本路线在大雁塔南广场安排外部步行观景；如计划入塔或进入独立收费区域，票务与预约按官方当日信息另查。"
    },
    {
      "heading": "夜游与消费",
      "value": "大唐不夜城以步行街夜游为主；演出场次、临时调整以当天发布为准。餐饮、购物和需单独购票项目分别消费，不默认包含。"
    }
  ],
  "legs": [
    {
      "from": "大唐芙蓉园（可选）",
      "to": "大雁塔南广场",
      "recommendedMode": "walk",
      "recommendation": "距离较短，步行衔接街景更方便",
      "straightLineDistance": "约 570 m",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 15 分钟",
          "distance": "约 1.08 km",
          "path": "M 930 445 C 900 444 862 434 834 414 C 808 394 787 368 755 354 C 700 330 628 326 555 317",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "入口间机算，不含景区内游览、临时停留和排队"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 7 分钟",
          "distance": "约 1.62 km",
          "path": "M 930 445 C 900 444 862 434 834 414 C 808 394 787 368 755 354 C 700 330 628 326 555 317",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "按周边可骑行道路查询，另留找车/停车时间；步行街按现场规则推行"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 27 分钟",
          "distance": "约 1.58 km",
          "path": "M 930 445 C 900 444 862 434 834 414 C 808 394 787 368 755 354 C 700 330 628 326 555 317",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "含步行接驳；候车和当日班次另行确认"
        }
      }
    },
    {
      "from": "大雁塔南广场",
      "to": "大唐不夜城 · 开元广场",
      "recommendedMode": "walk",
      "recommendation": "沿不夜城步行街向南逛，骑行方案走外围道路",
      "straightLineDistance": "约 1.17 km",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 17 分钟",
          "distance": "约 1.22 km",
          "path": "M 555 317 C 554 425 550 546 548 655 C 547 726 546 791 545 846",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "入口间机算，不含景区内游览、临时停留和排队"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 8 分钟",
          "distance": "约 1.96 km",
          "path": "M 555 317 C 554 425 550 546 548 655 C 547 726 546 791 545 846",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "按周边可骑行道路查询，另留找车/停车时间；步行街按现场规则推行"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 28 分钟",
          "distance": "约 2.11 km",
          "path": "M 555 317 C 554 425 550 546 548 655 C 547 726 546 791 545 846",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "含步行接驳；候车和当日班次另行确认"
        }
      }
    }
  ],
  "practical": [
    [
      "夜游主线",
      "大雁塔南广场 → 大唐不夜城 → 开元广场；这是下午夜游安排，不是已核实的完整一日导航。"
    ],
    [
      "可选前置",
      "大唐芙蓉园可放在下午作为前置段；也可跳过，直接从雁塔南广场开始。园区入园与演出另按官方当日信息确认。"
    ],
    [
      "门票与消费",
      "园区门票当日有效；当前票价、开放时段和演出场次待出发日核对。餐饮、购物及单独收费项目不计入路线。"
    ],
    [
      "交通参考",
      "入口间步行合计约 2.3 公里；景区内游览、街巷绕行与用餐另计。时间为查询参考，不是实测或实时导航。"
    ],
    [
      "地图说明",
      "点位依据高德 GCJ-02 核对；插画路线沿可见道路示意，不能替代实时导航。"
    ]
  ],
  "photoCandidates": {
    "大唐芙蓉园（可选）": [
      {
        "title": "大唐芙蓉园 · 御苑门（西门）入口",
        "image": "./assets/routes/xa01-reference-photos/stop-1-furongyuan-01.webp",
        "source": "https://www.xiaohongshu.com/explore/69f02234000000003700cc77",
        "artist": "OliveOyl",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大唐芙蓉园 · 紫云楼实景",
        "image": "./assets/routes/xa01-reference-photos/stop-1-furongyuan-03.webp",
        "source": "https://www.xiaohongshu.com/explore/69f02234000000003700cc77",
        "artist": "OliveOyl",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大唐芙蓉园 · 园林石刻实景",
        "image": "./assets/routes/xa01-reference-photos/stop-1-furongyuan-04.webp",
        "source": "https://www.xiaohongshu.com/explore/69f02234000000003700cc77",
        "artist": "OliveOyl",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      }
    ],
    "大雁塔南广场": [
      {
        "title": "大雁塔 · 夜游视角（一）",
        "image": "./assets/routes/xa01-reference-photos/stop-2-dayanta-03.webp",
        "source": "https://www.xiaohongshu.com/explore/6a82c6c700000000270228d1",
        "artist": "白白白白白",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大雁塔 · 夜游视角（二）",
        "image": "./assets/routes/xa01-reference-photos/stop-2-dayanta-04.webp",
        "source": "https://www.xiaohongshu.com/explore/6a82c6c700000000270228d1",
        "artist": "白白白白白",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大雁塔 · 夜游视角（三）",
        "image": "./assets/routes/xa01-reference-photos/stop-2-dayanta-05.webp",
        "source": "https://www.xiaohongshu.com/explore/6a82c6c700000000270228d1",
        "artist": "白白白白白",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      }
    ],
    "大唐不夜城 · 开元广场": [
      {
        "title": "大唐不夜城 · 夜间街景（一）",
        "image": "./assets/routes/xa01-reference-photos/stop-3-datang-night-13.webp",
        "source": "https://www.xiaohongshu.com/explore/69ad79af000000002202f84a",
        "artist": "行走的梵高",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大唐不夜城 · 夜间街景（二）",
        "image": "./assets/routes/xa01-reference-photos/stop-3-datang-night-17.webp",
        "source": "https://www.xiaohongshu.com/explore/69ad79af000000002202f84a",
        "artist": "行走的梵高",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      },
      {
        "title": "大唐不夜城 · 古诗词街景",
        "image": "./assets/routes/xa01-reference-photos/stop-3-poetry-street-08.webp",
        "source": "https://www.xiaohongshu.com/explore/6a52468c0000000021016880",
        "artist": "钱来钱来钱从四面八方来",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，保留原图水印，转载许可未确认"
      }
    ]
  },
  "photoIntro": "先看园林与雁塔，再翻到不夜城的夜色。翻完一站会进入下一站，点击照片可放大。",
  "photoEmptyText": "这个地点的实景照片待补充",
  "diningIntro": "大悦城有两家作者记录的餐饮线索可作选择。人均尚无可靠核实，菜品描述来自作者体验；到店前再看当日菜单和营业信息。",
  "dining": [
    {
      "area": "大雁塔 · 大悦城4F餐饮北区",
      "cuisine": "陕菜",
      "name": "八百里秦川·陕菜小馆（大悦城店）",
      "address": "雁塔区大悦城4F餐饮北区（作者记录：近大雁塔观景平台）",
      "dishes": "葫芦鸡、米皮。",
      "price": "人均待核实",
      "source": "小红书 · 作者记录",
      "url": "https://www.xiaohongshu.com/explore/69bbb52c000000001d018f10",
      "perPerson": {
        "value": null,
        "currency": "CNY",
        "source": "",
        "url": "",
        "status": "unknown"
      },
      "displayNote": "可作为大悦城内的陕菜用餐备选；当前菜单、价格和营业情况待补齐。",
      "note": "原作者未给出金额或人均，未用双人餐记录推算。",
      "photos": [
        {
          "image": "./assets/routes/xa01-reference-photos/dining-babaili-dish-02.webp",
          "title": "八百里秦川 · 葫芦鸡与陕菜",
          "kind": "dish",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/69bbb52c000000001d018f10",
          "credit": "小熊饼干🍪"
        },
        {
          "image": "./assets/routes/xa01-reference-photos/dining-babaili-dish-04.webp",
          "title": "八百里秦川 · 米皮",
          "kind": "dish",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/69bbb52c000000001d018f10",
          "credit": "小熊饼干🍪"
        }
      ]
    },
    {
      "area": "大雁塔 · 大悦城3楼",
      "cuisine": "广式点心",
      "name": "悦得闲广式点心茶楼（大悦城店）",
      "address": "大悦城3楼（作者记录）",
      "dishes": "金沙海虾红米肠、百合酱蒸凤爪、荔湾艇仔粥。",
      "price": "人均待核实",
      "source": "小红书 · 作者记录",
      "url": "https://www.xiaohongshu.com/explore/6a28f8fa0000000035026f4d",
      "perPerson": {
        "value": null,
        "currency": "CNY",
        "source": "",
        "url": "",
        "status": "unknown"
      },
      "displayNote": "想换成广式点心，可在这家店挑选；当前菜单、价格和营业情况待补齐。",
      "note": "原作者未给出金额或人均，未用单人点餐记录推算。",
      "photos": [
        {
          "image": "./assets/routes/xa01-reference-photos/dining-yuedexian-dish-01.webp",
          "title": "悦得闲 · 广式点心",
          "kind": "dish",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/6a28f8fa0000000035026f4d",
          "credit": "Blake 图"
        },
        {
          "image": "./assets/routes/xa01-reference-photos/dining-yuedexian-dish-03.webp",
          "title": "悦得闲 · 点心与粥品",
          "kind": "dish",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/6a28f8fa0000000035026f4d",
          "credit": "Blake 图"
        }
      ]
    }
  ],
  "pendingDining": [
    {
      "status": "store-identity-unverified",
      "area": "大雁塔 · 大悦城4层（作者记录）",
      "name": "KC 韩餐线索（待补）",
      "address": "大悦城4层；完整品牌名和门牌待核",
      "dishes": "作者提到芝士排骨、烤五花肉、炸鸡和雪冰。",
      "perPerson": {
        "value": null,
        "currency": "CNY",
        "source": "人均待核实",
        "url": "",
        "status": "unknown"
      },
      "source": "小红书 · 作者简称 KC；配图招牌显示 KCOOKING，身份待核",
      "url": "https://www.xiaohongshu.com/explore/69eb14b5000000001f031801",
      "photos": [
        {
          "image": "./assets/routes/xa01-reference-photos/dining-kc-dish-02.webp",
          "title": "KC 餐饮线索 · 菜品实拍",
          "kind": "dish",
          "source": "小红书 · 待核线索",
          "url": "https://www.xiaohongshu.com/explore/69eb14b5000000001f031801",
          "credit": "Joker派大星"
        },
        {
          "image": "./assets/routes/xa01-reference-photos/dining-kc-dish-05.webp",
          "title": "KC 餐饮线索 · 菜品实拍",
          "kind": "dish",
          "source": "小红书 · 待核线索",
          "url": "https://www.xiaohongshu.com/explore/69eb14b5000000001f031801",
          "credit": "Joker派大星"
        },
        {
          "image": "./assets/routes/xa01-reference-photos/dining-kc-dish-07.webp",
          "title": "KC 餐饮线索 · 菜品实拍",
          "kind": "dish",
          "source": "小红书 · 待核线索",
          "url": "https://www.xiaohongshu.com/explore/69eb14b5000000001f031801",
          "credit": "Joker派大星"
        }
      ]
    }
  ],
  "sources": [
    {
      "label": "大唐芙蓉园 · 官方票务页",
      "url": "https://www.tangparadise.cn/ticket.html"
    },
    {
      "label": "小红书 · 大唐芙蓉园实景参考（OliveOyl）",
      "url": "https://www.xiaohongshu.com/explore/69f02234000000003700cc77"
    },
    {
      "label": "小红书 · 大雁塔夜游体验（白白白白白）",
      "url": "https://www.xiaohongshu.com/explore/6a82c6c700000000270228d1"
    },
    {
      "label": "小红书 · 大唐不夜城夜景（行走的梵高）",
      "url": "https://www.xiaohongshu.com/explore/69ad79af000000002202f84a"
    },
    {
      "label": "小红书 · 大唐不夜城古诗词街实景",
      "url": "https://www.xiaohongshu.com/explore/6a52468c0000000021016880"
    },
    {
      "label": "小红书 · 八百里秦川探店记录",
      "url": "https://www.xiaohongshu.com/explore/69bbb52c000000001d018f10"
    },
    {
      "label": "小红书 · 悦得闲点心体验记录",
      "url": "https://www.xiaohongshu.com/explore/6a28f8fa0000000035026f4d"
    },
    {
      "label": "高德 · 大唐芙蓉园",
      "url": "https://ditu.amap.com/place/B001D092BB"
    },
    {
      "label": "高德 · 大雁塔南广场",
      "url": "https://ditu.amap.com/place/B001D12PCJ"
    },
    {
      "label": "高德 · 开元广场",
      "url": "https://ditu.amap.com/place/B001D0VVLI"
    }
  ],
  "labelPlacements": [
    "above-right",
    "above-left",
    "above-right"
  ],
  "diningNote": "两家大悦城餐饮均未核实人均；“KC”仅保留在待补线索，配图招牌不足以确认完整品牌身份。",
  "dataSupplement": {
    "updatedAt": "2026-10-13",
    "collectedSourceNotes": 13,
    "sourceNotes": 7,
    "sourceNoteIds": [
      "69f02234000000003700cc77",
      "6a82c6c700000000270228d1",
      "69ad79af000000002202f84a",
      "6a52468c0000000021016880",
      "69bbb52c000000001d018f10",
      "6a28f8fa0000000035026f4d",
      "69eb14b5000000001f031801"
    ],
    "selectedPhotoCount": 13,
    "landmarkPhotoCount": 9,
    "diningPhotoCount": 4,
    "pendingDiningPhotoCount": 3,
    "diningReferenceCount": 2,
    "routeCoordinateStatus": "AMap GCJ-02 queried; artwork anchors visually calibrated; not on-foot verified",
    "missing": [
      "芙蓉园所选票种、当日入园时段和演出包含范围待核",
      "两家大悦城餐饮的唯一分店、平台人均、现行菜单与营业待核",
      "诗词灯街与雕塑照片的具体机位、当日演出和临时管控待核",
      "KCOOKING只保留为待补线索，不进入推荐卡片"
    ]
  }
};
