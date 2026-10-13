// Spend records preserve price units and conflicting menu versions.
export const DINING_BY_ROUTE = {
  "chengdu-cd01-city-day": [
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
  "guangzhou-xiguan-walk": [
    {
      "id": "gz-qiaomei",
      "name": "侨美食家(沙面总店)",
      "address": "广州市沙面南街52号（白天鹅宾馆斜对面）",
      "area": "沙面岛周边",
      "cuisine": "粤菜",
      "dishes": "红烧乳鸽、黄鳝炒饭与广式点心。",
      "displayNote": "适合坐下来用餐，点单前确认份量。",
      "perPerson": {
        "value": 121,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥121（携程）",
      "source": "携程",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
      "note": "对应分店的携程平台参考人均，2026-10-13核对；照片为门店相册参考，菜单与供应以当日为准。",
      "photos": [
        {
          "title": "非遗红烧乳鸽",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-qiaomei-1.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0102f12000ero8gd4C439.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "台山黄鳝炒饭",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-qiaomei-2.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0102d12000ernzua3DFFB.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "垂涎欲滴酥",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-qiaomei-3.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0101c12000ero1bstCEF9.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "沙面总店外观",
          "kind": "environment",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-qiaomei-4.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/5323731.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/100q0e00000075sslC4E3_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "gz-aponiuza",
      "name": "阿婆牛杂·广府非遗地标美食(永庆坊店)",
      "address": "恩宁路75号（永庆食集内）",
      "area": "永庆坊 · 永庆食集",
      "cuisine": "牛杂小吃",
      "dishes": "招牌牛杂、萝卜面筋牛杂、牛筋丸。",
      "displayNote": "适合逛街途中按食量点一份。",
      "perPerson": {
        "value": 30,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥30（携程）",
      "source": "携程",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html",
      "note": "对应分店的携程平台参考人均，2026-10-13核对；照片为门店相册参考，菜单与供应以当日为准。",
      "photos": [
        {
          "title": "牛杂近景",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-aponiuza-1.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/1me6c12000r7kldn4E097_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "牛杂杯实拍拼图",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-aponiuza-2.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/1me5s12000sa0fzr21C37_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "永庆坊店店内墙面",
          "kind": "environment",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-aponiuza-3.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/118725522.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/1me1o12000sa0lcb19A0F_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "gz-nanxin",
      "name": "南信牛奶甜品专家",
      "address": "广州市第十甫路47号",
      "area": "上下九 · 第十甫路",
      "cuisine": "广式糖水",
      "dishes": "双皮奶、姜撞奶、红豆双皮。",
      "displayNote": "甜品休息备选，也供应部分咸味小吃。",
      "perPerson": {
        "value": 30,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/4927086.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥30（携程）",
      "source": "携程",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/4927086.html",
      "note": "对应分店的携程平台参考人均，2026-10-13核对；照片为门店相册参考，菜单与供应以当日为准。 首张菜单照片未明确拍摄日期，原图横向，不认作最新菜单。",
      "photos": [
        {
          "title": "南信牛奶甜品专家纸质菜单",
          "kind": "menu",
          "rotation": 270,
          "credit": "Meet Guangzhou / 携程对应门店图库",
          "visuallyChecked": true,
          "source": "Meet Guangzhou（携程图片）",
          "image": "./assets/routes/dining-reference-photos/gz-nanxin-1.jpg",
          "url": "https://meetguangzhou.com/cn/food/nanxinniunaitianpin",
          "originalImage": "https://ak-d.tripcdn.com/images/1mh6h12000ba55g980EEA.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "南信双皮奶",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-nanxin-2.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/4927086.html",
          "originalImage": "https://ak-d.tripcdn.com/images/100m0b0000005yqt97D7D.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "南信姜撞奶",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-nanxin-3.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/4927086.html",
          "originalImage": "https://ak-d.tripcdn.com/images/10050b0000005yr3nEC03.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "红豆双皮",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-nanxin-4.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/152/4927086.html",
          "originalImage": "https://ak-d.tripcdn.com/images/0105812000epzhpnl74D4.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    },
    {
      "id": "gz-taotaoju",
      "name": "陶陶居酒家(第十甫路总店)",
      "address": "广州市第十甫路20号",
      "area": "上下九 · 第十甫路",
      "cuisine": "粤菜与早茶",
      "dishes": "大虾饺、百年烧鹅、榴莲天鹅酥。",
      "displayNote": "多人分点品尝，预留用餐与等位时间。",
      "perPerson": {
        "value": 103,
        "currency": "CNY",
        "source": "携程",
        "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
        "status": "platform-average",
        "checkedAt": "2026-10-13"
      },
      "price": "参考人均 ¥103（携程）",
      "source": "携程",
      "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
      "note": "对应分店的携程平台参考人均，2026-10-13核对；照片为门店相册参考，菜单与供应以当日为准。",
      "photos": [
        {
          "title": "陶陶居大虾饺",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-taotaoju-1.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0104n120009uiv4c32245.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "百年烧鹅",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-taotaoju-2.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0102e12000fj4qxou20C5.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "鲜果榴莲天鹅酥",
          "kind": "dish",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-taotaoju-3.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/0102112000eric8jy884C.jpg",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        },
        {
          "title": "第十甫路总店餐厅环境",
          "kind": "environment",
          "credit": "携程对应门店图库",
          "visuallyChecked": true,
          "source": "携程",
          "image": "./assets/routes/dining-reference-photos/gz-taotaoju-4.jpg",
          "url": "https://gs.ctrip.com/html5/you/foods/fooddetail/554/444058.html",
          "originalImage": "https://dimg04.c-ctrip.com/images/01A4p12000964zqow3E70_D_750_450_Q90.jpg?proc=autoorient",
          "usage": "本地参考，公开使用权限待核对",
          "checkedAt": "2026-10-13"
        }
      ]
    }
  ]
};
