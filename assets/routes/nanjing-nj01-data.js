// nanjing-nj01: GCJ-02 references and illustration pixels are stored separately.
export const NJ01_ROUTE = {
  "id": "nanjing-nj01-qinhuai-day",
  "city": "南京",
  "region": "中国",
  "place": "中国 · 南京",
  "flag": "cn",
  "title": "城门入秦淮，街巷慢慢逛",
  "days": 1,
  "tags": [
    "城墙",
    "街巷",
    "秦淮河",
    "小吃",
    "城市",
    "美食"
  ],
  "theme": "nanjing",
  "image": "./assets/routes/nanjing-nj01-map-illustrated-v1.webp",
  "accent": "#d6815b",
  "intro": "从中华门城堡走到老门东，再到夫子庙与秦淮河边收尾；场馆、游船和用餐都按兴趣自选。",
  "quote": "上午从中华门看瓮城和城墙，午后走进老门东的小巷。把傍晚留给秦淮河，两段步行都不长，吃饭和进馆可以慢慢安排。",
  "map": {
    "kind": "city-garden",
    "maxZoom": 1.25,
    "route": "M 465 645 L 449 678 C 540 694 653 719 766 741 C 824 753 885 758 928 748 C 950 722 961 685 966 645 L 982 557 M 982 557 C 987 516 994 468 1001 419 C 1008 371 1017 325 1020 290",
    "roads": [],
    "contours": [],
    "points": [
      {
        "name": "中华门城堡",
        "x": 333.73,
        "y": 462.67,
        "color": "#d6815b",
        "role": "start",
        "labelSide": "left",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": true
      },
      {
        "name": "老门东",
        "x": 704.78,
        "y": 399.55,
        "color": "#67a78a",
        "role": null,
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      },
      {
        "name": "夫子庙 · 秦淮河",
        "x": 732.06,
        "y": 208.02,
        "color": "#d7a456",
        "role": "end",
        "labelSide": "right",
        "labelY": "above",
        "mobileHide": false,
        "hideCardLabel": false
      }
    ]
  },
  "storyArtwork": {
    "image": "./assets/routes/nanjing-nj01-map-illustrated-v1.webp",
    "width": 1672,
    "height": 941,
    "route": "M 465 645 L 449 678 C 540 694 653 719 766 741 C 824 753 885 758 928 748 C 950 722 961 685 966 645 L 982 557 M 982 557 C 987 516 994 468 1001 419 C 1008 371 1017 325 1020 290",
    "markers": [
      {
        "name": "中华门城堡",
        "poiId": "B00190AMPR",
        "x": 465,
        "y": 645,
        "color": "#d6815b",
        "labelPlacement": "above-left",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      },
      {
        "name": "老门东",
        "poiId": "B0FFFF28YI",
        "x": 982,
        "y": 557,
        "color": "#67a78a",
        "labelPlacement": "above-right",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      },
      {
        "name": "夫子庙 · 秦淮河",
        "poiId": "B0FFLGYL8B",
        "x": 1020,
        "y": 290,
        "color": "#d7a456",
        "labelPlacement": "above-right",
        "coordinateStatus": "visual-anchor-on-generated-artwork"
      }
    ],
    "reference": {
      "coordinateSystem": "GCJ-02",
      "verifiedAt": "2026-10-13",
      "points": [
        {
          "name": "中华门城堡",
          "poiId": "B00190AMPR",
          "address": "中华路",
          "type": "风景名胜;风景名胜;国家级景点",
          "coordinate": [
            118.781821,
            32.0128
          ],
          "entrance": [
            118.782548,
            32.013181
          ],
          "poiName": "中华门",
          "routeCoordinate": [
            118.782548,
            32.013181
          ],
          "url": "https://ditu.amap.com/place/B00190AMPR",
          "endpointNote": "高德入口或公开观赏位置；未实测门禁及通行"
        },
        {
          "name": "老门东",
          "poiId": "B0FFFF28YI",
          "address": "箍桶巷与剪子巷交汇处",
          "type": "风景名胜;风景名胜;风景名胜",
          "coordinate": [
            118.787898,
            32.012777
          ],
          "entrance": [
            118.787936,
            32.012937
          ],
          "poiName": "老门东牌坊",
          "routeCoordinate": [
            118.787936,
            32.012937
          ],
          "url": "https://ditu.amap.com/place/B0FFFF28YI",
          "endpointNote": "高德入口或公开观赏位置；未实测门禁及通行"
        },
        {
          "name": "夫子庙 / 秦淮河",
          "poiId": "B0FFLGYL8B",
          "address": "夫子庙步行街与琵琶街交叉口北100米",
          "type": "风景名胜;风景名胜相关;旅游景点",
          "coordinate": [
            118.789371,
            32.019829
          ],
          "entrance": null,
          "poiName": "秦淮河-泮池(贡院街)",
          "routeCoordinate": [
            118.789371,
            32.019829
          ],
          "url": "https://ditu.amap.com/place/B0FFLGYL8B",
          "endpointNote": "高德入口或公开观赏位置；未实测门禁及通行"
        }
      ],
      "archive": "./assets/routes/nanjing-nj01-amap-reference.json",
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
    "city",
    "river"
  ],
  "story": [
    {
      "day": 1,
      "time": "上午",
      "title": "中华门城堡 · 从城门开始",
      "body": "先在中华门城堡一带看城门与城墙。若计划登城或入馆，先核对官方当日售票、预约和开放安排；也可以只把城门周边作为路线起点。"
    },
    {
      "day": 1,
      "time": "午后",
      "title": "老门东 · 沿街巷慢逛",
      "body": "从老门东牌坊一带进入街区，留些时间给巷子、店铺和小吃。展览、体验、餐饮与文创各自消费，不必把每个项目排满。"
    },
    {
      "day": 1,
      "time": "傍晚",
      "title": "夫子庙与秦淮河 · 夜色收尾",
      "body": "傍晚转到夫子庙和秦淮河一带散步。游船、场馆或其他收费体验按当日售票与班次另行安排；想轻松走走也可以随时结束。"
    }
  ],
  "guideSources": [
    {
      "label": "小红书 · 中华门到老门东步行体验（作者记录）",
      "url": "https://www.xiaohongshu.com/explore/6a3e6dd9000000000f005b2d"
    },
    {
      "label": "小红书 · 老门东与夫子庙路线体验（作者记录）",
      "url": "https://www.xiaohongshu.com/explore/6a859bcf000000003302c4c9"
    },
    {
      "label": "高德 · 中华门",
      "url": "https://ditu.amap.com/place/B00190AMPR"
    },
    {
      "label": "高德 · 老门东牌坊",
      "url": "https://ditu.amap.com/place/B0FFFF28YI"
    },
    {
      "label": "高德 · 秦淮河泮池",
      "url": "https://ditu.amap.com/place/B0FFLGYL8B"
    }
  ]
};

export const NJ01_JOURNEY = {
  "eyebrow": "NANJING · NJ-01",
  "duration": "1 日 · 早到晚可拆分",
  "distance": "约 1.5 km（入口间步行参考）",
  "stopTimes": [
    "上午",
    "午后",
    "傍晚"
  ],
  "stopTags": [
    [
      "城墙",
      "城门",
      "可选入馆"
    ],
    [
      "老城南",
      "街巷",
      "小吃"
    ],
    [
      "秦淮河",
      "夫子庙",
      "夜景"
    ]
  ],
  "previewImages": [
    "./assets/routes/nj01-reference-photos/stop-1-zhonghuamen-07.webp",
    "./assets/routes/nj01-reference-photos/stop-2-laomendong-13.webp",
    "./assets/routes/nj01-reference-photos/stop-3-qinhuai-13.webp"
  ],
  "stopAccess": [
    {
      "heading": "门票与预约",
      "value": "中华门城墙官方页面列出日间登城票参考 ¥50，常规开放 8:30–17:00；具体票务与临时调整出发前看官网。路线从城门周边开始，不默认包含付费入场。"
    },
    {
      "heading": "街区消费",
      "value": "老门东公共街区可步行游览；店铺、展览、体验和文创分别消费，具体营业以现场信息为准。"
    },
    {
      "heading": "夫子庙预约与游船",
      "value": "夫子庙街区重点时段有预约要求，节假日及暑期时段安排以秦淮区公告为准；游船与独立场馆另行购票或预约，不默认包含。"
    }
  ],
  "legs": [
    {
      "from": "中华门城堡",
      "to": "老门东",
      "recommendedMode": "walk",
      "recommendation": "距离较短，步行衔接街景更方便",
      "straightLineDistance": "约 510 m",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 8 分钟",
          "distance": "约 569 m",
          "path": "M 465 645 L 449 678 C 540 694 653 719 766 741 C 824 753 885 758 928 748 C 950 722 961 685 966 645 L 982 557",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "入口间机算，不含景区内游览、临时停留和排队"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 4 分钟",
          "distance": "约 947 m",
          "path": "M 465 645 L 449 678 C 540 694 653 719 766 741 C 824 753 885 758 928 748 C 950 722 961 685 966 645 L 982 557",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "按周边可骑行道路查询，另留找车/停车时间；步行街按现场规则推行"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 17 分钟",
          "distance": "约 1.03 km",
          "path": "M 465 645 L 449 678 C 540 694 653 719 766 741 C 824 753 885 758 928 748 C 950 722 961 685 966 645 L 982 557",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "含步行接驳；候车和当日班次另行确认"
        }
      }
    },
    {
      "from": "老门东",
      "to": "夫子庙 · 秦淮河",
      "recommendedMode": "walk",
      "recommendation": "距离较短，步行衔接街景更方便",
      "straightLineDistance": "约 780 m",
      "options": {
        "walk": {
          "label": "步行",
          "duration": "约 12 分钟",
          "distance": "约 883 m",
          "path": "M 982 557 C 987 516 994 468 1001 419 C 1008 371 1017 325 1020 290",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "入口间机算，不含景区内游览、临时停留和排队"
        },
        "cycle": {
          "label": "骑行",
          "duration": "约 6 分钟",
          "distance": "约 1.40 km",
          "path": "M 982 557 C 987 516 994 468 1001 419 C 1008 371 1017 325 1020 290",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "按周边可骑行道路查询，另留找车/停车时间；步行街按现场规则推行"
        },
        "transit": {
          "label": "公交 / 地铁",
          "duration": "约 22 分钟",
          "distance": "约 1.24 km",
          "path": "M 982 557 C 987 516 994 468 1001 419 C 1008 371 1017 325 1020 290",
          "source": "高德入口间路线查询",
          "queriedAt": "2026-10-13",
          "detail": "含步行接驳；候车和当日班次另行确认"
        }
      }
    }
  ],
  "practical": [
    [
      "路线节奏",
      "中华门城堡 → 老门东 → 夫子庙与秦淮河；登城、进馆和游船按兴趣另选。"
    ],
    [
      "预约与消费",
      "门票、预约及场馆安排以官方当日信息为准；餐饮、饮品、游船和体验项目单独消费。"
    ],
    [
      "交通参考",
      "入口间步行合计约 1.5 公里；景区内游览、街巷绕行与用餐另计。时间为查询参考，不是实测或实时导航。"
    ],
    [
      "地图说明",
      "点位依据高德 GCJ-02 核对；插画路线沿可见道路示意，不能替代实时导航。"
    ]
  ],
  "photoCandidates": {
    "中华门城堡": [
      {
        "title": "中华门城堡 · 城门内侧",
        "image": "./assets/routes/nj01-reference-photos/stop-1-zhonghuamen-06.webp",
        "source": "https://www.xiaohongshu.com/explore/69fab244000000003601e1c6",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "中华门城堡 · 门洞与游人",
        "image": "./assets/routes/nj01-reference-photos/stop-1-zhonghuamen-07.webp",
        "source": "https://www.xiaohongshu.com/explore/69fab244000000003601e1c6",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "中华门城堡 · 城墙与拱门",
        "image": "./assets/routes/nj01-reference-photos/stop-1-zhonghuamen-09.webp",
        "source": "https://www.xiaohongshu.com/explore/69fab244000000003601e1c6",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      }
    ],
    "老门东": [
      {
        "title": "老门东 · 街区屋顶与街巷",
        "image": "./assets/routes/nj01-reference-photos/stop-2-laomendong-02.webp",
        "source": "https://www.xiaohongshu.com/explore/69f765cf0000000037037bfc",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "老门东 · 街巷人流",
        "image": "./assets/routes/nj01-reference-photos/stop-2-laomendong-13.webp",
        "source": "https://www.xiaohongshu.com/explore/69f765cf0000000037037bfc",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "老门东 · 街区牌坊",
        "image": "./assets/routes/nj01-reference-photos/stop-2-laomendong-18.webp",
        "source": "https://www.xiaohongshu.com/explore/69f765cf0000000037037bfc",
        "artist": "壹丁",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      }
    ],
    "夫子庙 · 秦淮河": [
      {
        "title": "秦淮河 · 夫子庙夜景",
        "image": "./assets/routes/nj01-reference-photos/stop-3-fuzimiao-12.webp",
        "source": "https://www.xiaohongshu.com/explore/69f31e10000000003601e08f",
        "artist": "潘潘拜托啦",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "秦淮河 · 河岸夜色",
        "image": "./assets/routes/nj01-reference-photos/stop-3-qinhuai-13.webp",
        "source": "https://www.xiaohongshu.com/explore/69f31e10000000003601e08f",
        "artist": "潘潘拜托啦",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      },
      {
        "title": "夫子庙 · 临河街景",
        "image": "./assets/routes/nj01-reference-photos/stop-3-qinhuai-15.webp",
        "source": "https://www.xiaohongshu.com/explore/69f31e10000000003601e08f",
        "artist": "潘潘拜托啦",
        "creditLabel": "笔记作者",
        "license": "小红书网页照片 · 路线参考，转载许可未确认"
      }
    ]
  },
  "photoIntro": "从中华门的城墙翻到老门东街巷，再看秦淮夜色。翻完一站会继续进入下一站，点击照片可放大。",
  "photoEmptyText": "这个地点的实景照片待补充",
  "diningIntro": "老门东的小吃可按胃口挑选。下面是三家餐饮参考，其中鸡鸣汤包有实拍菜单板；人均以平台用户反馈为参考，当前菜单与消费以门店为准。",
  "dining": [
    {
      "area": "老门东 · 三条营",
      "cuisine": "汤包与南京小吃",
      "name": "鸡鸣汤包（老门东店）",
      "address": "江苏省南京市秦淮区夫子庙街道三条营68-101号",
      "dishes": "创意汤包、鸭血粉丝汤、鸡汤馄饨、萝卜丝端子。",
      "price": "平台参考人均 ¥28",
      "source": "携程",
      "url": "https://you.ctrip.com/food/nanjing9/15477719.html",
      "perPerson": {
        "value": 28,
        "currency": "CNY",
        "source": "携程",
        "url": "https://you.ctrip.com/food/nanjing9/15477719.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "displayNote": "平台参考人均来自用户反馈，不是固定套餐或当前菜单价；具体点餐以门店当日菜单为准。",
      "note": "携程页面将 ¥28 标为用户反馈平台参考人均；不将旧菜单单品价折算为人均。探店图中的菜单板仅供菜品辨认，当前菜单与价格以店内为准。",
      "photos": [
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiming-menu-01.webp",
          "title": "鸡鸣汤包 · 门店菜单板（一）",
          "kind": "menu",
          "source": "小红书 · 鸡鸣汤包探店",
          "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d",
          "credit": "楠楠子吃南京"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiming-menu-02.webp",
          "title": "鸡鸣汤包 · 门店菜单板（二）",
          "kind": "menu",
          "source": "小红书 · 鸡鸣汤包探店",
          "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d",
          "credit": "楠楠子吃南京"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiming-dumplings.webp",
          "title": "鸡鸣汤包 · 汤包实拍",
          "kind": "dish",
          "source": "小红书 · 鸡鸣汤包探店",
          "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d",
          "credit": "楠楠子吃南京"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiming-radish-cake.webp",
          "title": "鸡鸣汤包 · 萝卜丝端子",
          "kind": "dish",
          "source": "小红书 · 鸡鸣汤包探店",
          "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d",
          "credit": "楠楠子吃南京"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiming-shopfront.webp",
          "title": "鸡鸣汤包 · 老门东门头",
          "kind": "environment",
          "source": "小红书 · 鸡鸣汤包探店",
          "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d",
          "credit": "楠楠子吃南京"
        }
      ]
    },
    {
      "area": "老门东 · 三条营",
      "cuisine": "清真南京小吃",
      "name": "清真蒋有记（老门东店）",
      "address": "三条营49号（携程门店页地址；细分铺号未核）",
      "dishes": "南京小吃；到店按当日菜单选择。",
      "price": "平台参考人均 ¥26",
      "source": "携程",
      "url": "https://you.ctrip.com/food/nanjing9/12501082.html",
      "perPerson": {
        "value": 26,
        "currency": "CNY",
        "source": "携程",
        "url": "https://you.ctrip.com/food/nanjing9/12501082.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "displayNote": "平台参考人均来自用户反馈，不是固定套餐或当前菜单价；具体点餐以门店当日菜单为准。",
      "note": "携程页面将 ¥26 标为用户反馈平台参考人均；地址只确认到三条营49号，未补写历史细分铺号。",
      "photos": [
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiang-store-01.webp",
          "title": "蒋有记 · 门头与用餐人流（作者实拍）",
          "kind": "environment",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/6abf8b3c0000000015009fdc",
          "credit": "小番薯的夏天"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiang-store-02.webp",
          "title": "蒋有记 · 店铺外观（作者实拍）",
          "kind": "environment",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/6abf8b3c0000000015009fdc",
          "credit": "小番薯的夏天"
        },
        {
          "image": "./assets/routes/nj01-reference-photos/dining-jiang-reference-02.webp",
          "title": "蒋有记 · 牛肉锅贴与门头（作者配图）",
          "kind": "reference",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/69402fd7000000001e00c401",
          "credit": "鲨鱼辣椒"
        }
      ]
    },
    {
      "area": "老门东 · 三条营",
      "cuisine": "南京传统糕点",
      "name": "陆氏梅花糕",
      "address": "三条营49号（携程门店页地址；细分铺号未核）",
      "dishes": "梅花糕；以到店当日供应为准。",
      "price": "平台参考人均 ¥11",
      "source": "携程",
      "url": "https://you.ctrip.com/food/nanjing9/15486745.html",
      "perPerson": {
        "value": 11,
        "currency": "CNY",
        "source": "携程",
        "url": "https://you.ctrip.com/food/nanjing9/15486745.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "displayNote": "平台参考人均来自用户反馈，不是单个糕点的当前售价；具体供应和价格以门店为准。",
      "note": "携程页面将 ¥11 标为用户反馈平台参考人均；地址只确认到三条营49号，未补写历史细分铺号。",
      "photos": [
        {
          "image": "./assets/routes/nj01-reference-photos/dining-lu-reference-11.webp",
          "title": "陆氏梅花糕 · 门头与糕点（作者配图）",
          "kind": "reference",
          "source": "小红书 · 作者记录",
          "url": "https://www.xiaohongshu.com/explore/69402fd7000000001e00c401",
          "credit": "鲨鱼辣椒"
        }
      ]
    }
  ],
  "sources": [
    {
      "label": "小红书 · 中华门照片参考（壹丁）",
      "url": "https://www.xiaohongshu.com/explore/69fab244000000003601e1c6"
    },
    {
      "label": "小红书 · 老门东照片参考（壹丁）",
      "url": "https://www.xiaohongshu.com/explore/69f765cf0000000037037bfc"
    },
    {
      "label": "小红书 · 夫子庙与秦淮河照片参考（潘潘拜托啦）",
      "url": "https://www.xiaohongshu.com/explore/69f31e10000000003601e08f"
    },
    {
      "label": "小红书 · 鸡鸣汤包探店照片（楠楠子吃南京）",
      "url": "https://www.xiaohongshu.com/explore/69e18ce7000000002301796d"
    },
    {
      "label": "携程 · 鸡鸣汤包（老门东店）门店与平台人均",
      "url": "https://you.ctrip.com/food/nanjing9/15477719.html"
    },
    {
      "label": "携程 · 清真蒋有记（老门东店）门店与平台人均",
      "url": "https://you.ctrip.com/food/nanjing9/12501082.html"
    },
    {
      "label": "携程 · 陆氏梅花糕门店与平台人均",
      "url": "https://you.ctrip.com/food/nanjing9/15486745.html"
    },
    {
      "label": "南京城墙 · 中华门登城票务",
      "url": "https://njcitywall.cn/all-detail/detail1?parent=wlfw&cmsId=6837d8244f33ab1684ff3b4e"
    },
    {
      "label": "南京城墙 · 开放时间",
      "url": "https://njcitywall.cn/all-detail/detail1?parent=wlfw&cmsId=6837d8044f33ab1684ff3b49"
    },
    {
      "label": "秦淮区 · 老门东历史文化街区",
      "url": "http://www.njqh.gov.cn/dmqh/yzqh/lmdlswhjq/"
    },
    {
      "label": "秦淮区 · 夫子庙街区重点时段预约安排",
      "url": "http://www.njqh.gov.cn/qhqrmzf/202602/t20260204_5786908.html"
    }
  ],
  "labelPlacements": [
    "above-left",
    "above-right",
    "above-right"
  ],
  "diningNote": "携程人均为平台用户反馈参考，不是固定套餐或当前菜单价；鸡鸣汤包菜单板照片仅供菜品辨认。三条营两家地址只核到总门牌，细分铺号待核。",
  "dataSupplement": {
    "updatedAt": "2026-10-13",
    "collectedSourceNotes": 13,
    "sourceNotes": 8,
    "sourceNoteIds": [
      "6a3e6dd9000000000f005b2d",
      "6a859bcf000000003302c4c9",
      "69fab244000000003601e1c6",
      "69f765cf0000000037037bfc",
      "69f31e10000000003601e08f",
      "69e18ce7000000002301796d",
      "6abf8b3c0000000015009fdc",
      "69402fd7000000001e00c401"
    ],
    "selectedPhotoCount": 18,
    "landmarkPhotoCount": 9,
    "diningPhotoCount": 9,
    "pendingDiningPhotoCount": 0,
    "diningReferenceCount": 3,
    "routeCoordinateStatus": "AMap GCJ-02 queried; artwork anchors visually calibrated; not on-foot verified",
    "missing": [
      "中华门当日临时安排及是否需提前预约待核；不采用已到期的限时优惠",
      "秦淮河照片的具体桥、楼阁与机位身份待独立核实",
      "鸡鸣现行菜单、蒋有记和陆氏的独立餐品图与价牌、细分铺号及营业待补"
    ]
  }
};
