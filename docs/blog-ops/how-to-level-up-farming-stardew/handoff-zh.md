# PublicBlogHandoff（zh-CN）— title_passed，已冻结

- type: `PublicBlogHandoff`
- 状态: **title_passed**（`freezePublicBlogHandoff`。E 题文复核 PASS，必须修改 0）
- 角色: Agent F-zh。题文通过由 E 签署，见 `E-zh-title-review.md`
- lockVersion: `2026-09-20-zh-how-to-level-up-farming-lock-1`
- locale / country: `zh-CN` / `CN`
- bodyHash: `d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27`
- 锁文件: `locked/zh-body.txt`（与下方 JSON `body` 字节一致）
- 计数: mechanical_units **2336**（zh-CN 汉字，已 exclude FAQ / 来源 / 常见问题），≥2000
- D 正文: PASS；E 正文: PASS；E 题文: PASS；用户终审: 尚未进行（content-only，等网站成品页）
- 公开引用来自 C 文末 PublicReference，quote 均在锁定正文，occurrence=1
- 冻结未改锁定正文、hash、Title、H1、Description、slug。未写入 `src/`、`app/` 或 `public/`。JSON-LD 保持 Article，不要 FAQPage

下方 JSON 是本交接对象。`body` 为锁定读者正文（Markdown，含 H2/H3、FAQ、来源与正文链接），NFC，UTF-8，LF。公开字段不含检索日志。

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-20-zh-how-to-level-up-farming-lock-1",
  "locale": "zh-CN",
  "country": "CN",
  "body": "耕种经验来自收获作物、照顾动物，以及阅读[星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)；[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)写明，使用锄头和喷壶不会获得耕种经验。五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点；经验值立即增加，升级弹窗要睡觉后才出现。银星、金星、铱星不加额外经验；一株一次收出多个产物，只给第一个。\n\n当前等级在暂停菜单的技能列表里看。下面先分清哪些动作真的加耕种经验，再用单株点数和累计表估离 5 级、10 级还差多少，最后睡觉核对弹窗和配方。\n\n## 哪些动作加耕种经验，哪些日常农活其实不加\n\n把田浇完、锄完、种子都按下，技能条仍可能一格不动。不是游戏坏了，是这些动作本身就不给耕种经验。先用下面两栏对照今天下午做过的事，再去数株数。\n\n### 会加：收获、照顾动物、读年历\n\n[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)把来源写成这几类：收获农作物；爱抚动物；挤牛奶或羊奶；剪羊毛；在鸡舍或畜棚采集蛋、鸭毛、动物毛、兔子的脚；阅读星露谷年历或星之书。\n\n作物这边，经验在**收获**时进账，不在把种子放进土里时进账。动物这边，抚摸、挤奶、剪毛、捡起鸡舍或畜棚里的动物产品，每次 5 点耕种经验。挤奶用的是挤奶桶。8 级才解锁的小桶是酿造设备，不能拿来挤奶。\n\n书这边：[星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)写「阅读即可获得 250 点耕种经验」。耕种页把星之书和年历并列成来源。英文 [Farming](https://stardewvalleywiki.com/Farming) 把 Almanac 和 Book Of Stars 写成同一句 250 Farming XP。\n\n两条例外要单独记。农场上由野生种子种出的作物，收获时是 3 点耕种经验加 2 点采集经验，不是把整株都算给耕种。猪找到的松露给采集经验，没有耕种经验；松露不要拿来估耕种缺口。\n\n### 不加：锄地、浇水、种植本身、砍树\n\n[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)写：「使用锄头和喷壶不会获得经验。」把格子锄出来、把水浇上、把种子点进土里，这三步本身都不加耕种经验。有的攻略把浇水和种植也写成能升级，按官方技能页，那两步推不动耕种条。\n\n砍树加的是采集，不是耕种。你下午把一整片树砍光，耕种条不会因此往上走。\n\n对照图把加和不加拆成两栏。指着自己刚做完的事看：收土豆、摸牛、挤奶、捡蛋、读年历，加；挥锄、浇水、下种、砍树、捡松露，不加。这是动作对照图，不是农场平面图，也不是技能菜单截图。\n\n![一侧是收获作物、摸动物或挤奶剪毛捡蛋、读年历，这些加耕种经验；另一侧是锄地、浇水、把种子放进土里、砍树、捡松露，这些不加。这是动作对照示意图，不是游戏截图。](/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp)\n\n开局常见的空转是：每天把眼前的田都浇完，以为喷壶次数能把耕种推上去。喷壶熟练度会随耕种等级涨，但浇水这一下经验是 0。这些格子真正进账的时点，是植株成熟后你把作物收起来。\n\n## 一株收一次给多少：公式、品质、一次多收\n\n同一场收获，不要按地上堆了多少个、也不要按银星金星自己加倍。[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)经验值段给出公式 `XP=||16*ln(0.018*PRICE + 1)||`，PRICE 是作物基础售价。品质星不加额外经验：普通、银星、金星、铱星，这一株的耕种经验相同。\n\n现行规则下，用镰刀收割也给耕种经验。下面这张表摘自耕种页春、夏、秋表，只用来估「这场收获加了几点」，不是按季节把经验高的作物排成该种什么。若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)。\n\n| 作物 | 单次耕种经验 | 估算时要注意 |\n| --- | --- | --- |\n| 咖啡豆 | 4 | 短周期，单次很低 |\n| 防风草 | 8 | 下面株数表的基准作物 |\n| 啤酒花 | 6 | 多次收，仍按每次 6 点估 |\n| 土豆 | 14 | 额外产量只算第一个 |\n| 草莓 | 18 | 按株估，不按果个数 |\n| 蓝莓 | 10 | 只算第一个产物 |\n| 花椰菜 | 23 | 0 到 1 级约 5 株 |\n| 甜瓜 | 27 | 单次，按株计 |\n| 杨桃 | 43 | 单次点数高，不表示这季该优先种它 |\n| 蔓越莓 | 14 | 只算第一个产物 |\n| 南瓜 | 31 | 单次，按株计 |\n| 宝石甜莓 | 64 | 表上单次最高的一档，仍是一株一次 |\n\n估算示例：今天下午收了 20 株防风草，按表是 20 × 8 = 160 点，立刻进经验条。若同一天还摸了 4 只鸡，再加 4 × 5 = 20 点。读过一本星露谷年历，再加 250 点。这三笔可以加在一起，去对照下一节的累计表。这是按维基单次点数做的算术，不是某份存档实测。\n\n### 一次收多个为什么经验不翻倍\n\n蓝莓、蔓越莓、土豆多结，地上会同时出现好几个。经验只给第一个产物，不多倍。蓝莓这一株是 10 点，不是 10 乘浆果数；蔓越莓这一株是 14 点，同样不按果个数翻。土豆主薯之外再掉出来的那些，不再另给一份 14 点。\n\n草莓 18、南瓜 31 看起来比防风草 8 高，可蓝莓和蔓越莓这种一次多收的作物，不能按「收了一堆」去乘。估缺口时用上表单次点数，不要看篮子有多满。\n\n示意图里同一株蓝莓掉出多个浆果，经验只记一笔 10 点。不要把果堆画成有多高经验就有多高。这是规则示意图，不是收获数字截图。\n\n![同一株蓝莓一次收出多个浆果，耕种经验只记第一个，这一株是 10 点，不按浆果个数翻倍。这是规则示意图，不是游戏收获截图。](/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp)\n\n## 到 5 级和 10 级要多少经验，中间会碰到哪些配方\n\n[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)五系共用同一张表，5 级 2150 点，10 级一共 15000 点。10 级不是在 9 级之后再另要 15000。每升一级，锄头和喷壶熟练度 +1。\n\n### 1 到 10 级累计经验（和只用防风草要收多少）\n\n累计是从 0 加到这一级的总和。已经过了某一档，只用「下一档累计减去当前累计」估缺口，不要每次都从 0 重新乘。\n\n| 目标等级 | 累计经验 | 只用防风草约需株数 |\n| --- | --- | --- |\n| 1 | 100 | 13 |\n| 2 | 380 | 48 |\n| 3 | 770 | 97 |\n| 4 | 1300 | 163 |\n| 5 | 2150 | 269 |\n| 6 | 3300 | 413 |\n| 7 | 4800 | 600 |\n| 8 | 6900 | 863 |\n| 9 | 10000 | 1250 |\n| 10 | 15000 | 1875 |\n\n防风草株数来自[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)「要种多少防风草」表，口径是只收防风草、每株 8 点。从 0 到 1 级约 13 个防风草、8 个土豆或 5 个花椰菜；从 0 到 2 级约 48 个防风草、28 个土豆或 17 个花椰菜。更往后的等级用防风草株数表，或用土豆 14 点、花椰菜 23 点去除累计差，表上没有把这两样收到 5 级、10 级的株数。\n\n还在 0 级、这季只收防风草：大约 13 株过 1 级，48 株过 2 级，269 株过 5 级，1875 株过 10 级。若已经过了 2 级（累计 380），离 5 级还差 2150 − 380 = 1770 点；用一株防风草 8 点去除这个差，不要再拿 269 当剩余量。蓝莓按株计 10 点，不能把一株上的多个浆果加成 20 或 30 再去除。\n\n对着下面这张梯子看 5 级 2150、8 级 6900、9 级 10000、10 级 15000，以及 2 / 4 / 5 / 6 / 8 / 9 级旁边的配方或弹窗名称。用它判断当前在哪一档、下一档是多少。\n\n![耕种 1 到 10 级累计梯子，标出 5 级 2150、8 级 6900、9 级 10000、10 级 15000；2 级洒水器、4 级罐头瓶、5 级职业弹窗、6 级优质洒水器、8 级小桶、9 级种子生产器和铱制洒水器。这是等级示意图，不是技能菜单截图。](/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp)\n\n### 2 / 4 / 5 / 6 / 8 / 9 级解锁什么\n\n[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)技能表把门闩写在对应等级上。经验够了、睡过觉、当天结束并存过档，配方才到手。\n\n| 等级 | 解锁 |\n| --- | --- |\n| 2 | 洒水器 |\n| 4 | 罐头瓶 |\n| 5 | 职业弹窗：畜牧人或农耕人 |\n| 6 | 优质洒水器 |\n| 8 | 小桶 |\n| 9 | 种子生产器、铱制洒水器 |\n| 10 | 第二职业：畜牧人接鸡舍大师或牧羊人，农耕人接工匠或农业学家 |\n\n2 / 6 / 9 级配方到手后怎么摆，看[星露谷洒水器](/zh/sprinkler-stardew)。4 级罐头瓶、8 级小桶是加工门槛；这批货现在卖掉还是锁进机器，看[第一年怎么赚钱](/zh/how-to-earn-money-stardew)。小桶不是挤奶工具。\n\n5 级官方名是畜牧人（畜产品 +20%）和农耕人（农作产品 +10%）。10 级被 5 级锁死：选了畜牧人，只在鸡舍大师和牧羊人里再选；选了农耕人，只在工匠和农业学家里再选。怎么选、20% 和 10% 乘的是哪一类货，看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。弹窗出现当晚先睡觉，白天技能栏里选不了。\n\n## 经验已经加上了，为什么还没升级弹窗\n\n收获或照顾的当下，经验条可以已经涨了，升级窗口仍要等到睡觉。[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)写：经验值立即增加，升级在睡觉后结算。[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)还写：每天第一次升级某技能会提示「你有些事情想在今天结束的时候考虑一下」；新解锁配方要当天结束、自动存档后才到手。不是经验要睡觉才入账。\n\n收了一下午却看不到升级时，按这个顺序分流，不要先认定规则失效：\n\n1. 今天下午做的是浇水、锄地、种植、砍树或捡松露：这些本来就不给耕种经验，技能条不会因它们而动。\n2. 收的是蓝莓、土豆或蔓越莓，却按个数或品质星自己加倍：实际只记了第一个产物，累计可能还没到下一档。\n3. 对照上一节累计表：5 级要 2150，10 级要 15000。经验条涨了但没过下一档，就不会弹。\n4. 累计已经够了，还没睡觉：经验已经在，弹窗和配方要等当天结束。看到那句提示，先把今天该收的收完再睡，不要在白天技能栏里找职业按钮。\n\n开局第一周把喷壶浇到没体力，晚上看不到耕种升级，多半停在第 1 条。蓝莓田收了满篮、只按「收了很多」估，却还在 4 级，多半停在第 2 或第 3 条。技能条已经顶到 5 级格、白天没有弹窗，走第 4 条。\n\n今天先核三件事：这场动作加不加；对照累计表还差多少；睡觉后看弹窗和配方有没有到手。5 级若弹出畜牧人和农耕人，点[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)再选。\n\n## FAQ\n\n**浇水、锄地、把种子种下去，能升耕种吗？**\n\n不能。锄头和喷壶本身不加耕种经验。作物经验在收获时给，不在浇水、锄地或下种时给。\n\n**蓝莓、土豆、蔓越莓一次收一堆，经验会按个数翻倍吗？**\n\n不会。一次收获多个产物，只给第一个。蓝莓一株 10 点，蔓越莓一株 14 点，都是单次，不按浆果数乘。\n\n**耕种 5 级、10 级分别要多少经验？只用防风草要收多少？**\n\n5 级累计 2150 点，约 269 株防风草；10 级累计 15000 点，约 1875 株防风草。这是从 0 收到这一级的总和。\n\n**收获了很多为什么还不升级？**\n\n先看这场动作加不加、有没有把蓝莓或蔓越莓按个数加倍，再对照累计表够不够下一档。经验是立刻加上的；升级弹窗和配方要睡觉、当天结束并存档后才出现。\n\n**耕种 5 级选畜牧人还是农耕人？10 级选什么？**\n\n5 级官方名是畜牧人和农耕人。选畜牧人，10 级只在鸡舍大师和牧羊人里再选；选农耕人，10 级只在工匠和农业学家里再选。详细对比看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。\n\n## 来源\n\n2026-09-20 对照下方星露谷官方中文维基。经验规则以官方中文维基为准；年历 250 来自年历页；规划器不算耕种经验。作物单次经验摘自耕种页表，不是某份存档实测。\n\n- [星露谷物语官方中文维基：耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)\n- [星露谷物语官方中文维基：技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)\n- [星露谷物语官方中文维基：星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)\n- [星露谷物语英文维基：Farming](https://stardewvalleywiki.com/Farming)\n- [星露谷物语英文维基：Skills](https://stardewvalleywiki.com/Skills)\n- [星露谷物语英文维基：Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac)\n- [本站：农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)\n- [本站：星露谷洒水器](/zh/sprinkler-stardew)\n- [本站：第一年怎么赚钱](/zh/how-to-earn-money-stardew)\n- [本站：春天种什么](/zh/best-spring-crop-stardew)\n- [本站：夏天种什么](/zh/summer-crops-stardew)\n- [本站：秋季作物](/zh/fall-crops-stardew)\n- [本站：农场规划器（简体中文首页）](/zh)",
  "bodyHash": "d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 14141,
  "seo": {
    "title": "星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150",
    "h1": "星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150",
    "description": "收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。",
    "slug": "how-to-level-up-farming-stardew",
    "faq": [
      {
        "question": "浇水、锄地、把种子种下去，能升耕种吗？",
        "answer": "不能。锄头和喷壶本身不加耕种经验。作物经验在收获时给，不在浇水、锄地或下种时给。"
      },
      {
        "question": "蓝莓、土豆、蔓越莓一次收一堆，经验会按个数翻倍吗？",
        "answer": "不会。一次收获多个产物，只给第一个。蓝莓一株 10 点，蔓越莓一株 14 点，都是单次，不按浆果数乘。"
      },
      {
        "question": "耕种 5 级、10 级分别要多少经验？只用防风草要收多少？",
        "answer": "5 级累计 2150 点，约 269 株防风草；10 级累计 15000 点，约 1875 株防风草。这是从 0 收到这一级的总和。"
      },
      {
        "question": "收获了很多为什么还不升级？",
        "answer": "先看这场动作加不加、有没有把蓝莓或蔓越莓按个数加倍，再对照累计表够不够下一档。经验是立刻加上的；升级弹窗和配方要睡觉、当天结束并存档后才出现。"
      },
      {
        "question": "耕种 5 级选畜牧人还是农耕人？10 级选什么？",
        "answer": "5 级官方名是畜牧人和农耕人。选畜牧人，10 级只在鸡舍大师和牧羊人里再选；选农耕人，10 级只在工匠和农业学家里再选。详细对比看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。"
      }
    ],
    "schema": {
      "@type": "Article",
      "doNotEmitFAQPage": true
    },
    "og": {
      "title": "星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150",
      "description": "收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。",
      "openGraphType": "article",
      "image": "pending_media"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-farming-zh",
      "label": "星露谷物语官方中文维基：耕种",
      "url": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn",
      "appliesTo": [
        {
          "quote": "收获农作物；爱抚动物；挤牛奶或羊奶；剪羊毛；在鸡舍或畜棚采集蛋、鸭毛、动物毛、兔子的脚；阅读星露谷年历或星之书",
          "occurrence": 1
        },
        {
          "quote": "抚摸、挤奶、剪毛、捡起鸡舍或畜棚里的动物产品，每次 5 点耕种经验",
          "occurrence": 1
        },
        {
          "quote": "农场上由野生种子种出的作物，收获时是 3 点耕种经验加 2 点采集经验",
          "occurrence": 1
        },
        {
          "quote": "猪找到的松露给采集经验，没有耕种经验",
          "occurrence": 1
        },
        {
          "quote": "公式 `XP=||16*ln(0.018*PRICE + 1)||`，PRICE 是作物基础售价",
          "occurrence": 1
        },
        {
          "quote": "品质星不加额外经验",
          "occurrence": 1
        },
        {
          "quote": "蓝莓这一株是 10 点，不是 10 乘浆果数；蔓越莓这一株是 14 点",
          "occurrence": 1
        },
        {
          "quote": "用镰刀收割也给耕种经验",
          "occurrence": 1
        },
        {
          "quote": "从 0 到 1 级约 13 个防风草、8 个土豆或 5 个花椰菜；从 0 到 2 级约 48 个防风草、28 个土豆或 17 个花椰菜",
          "occurrence": 1
        },
        {
          "quote": "经验值立即增加，升级在睡觉后结算",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-skills-zh",
      "label": "星露谷物语官方中文维基：技能",
      "url": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn",
      "appliesTo": [
        {
          "quote": "使用锄头和喷壶不会获得耕种经验",
          "occurrence": 1
        },
        {
          "quote": "五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点",
          "occurrence": 1
        },
        {
          "quote": "使用锄头和喷壶不会获得经验。",
          "occurrence": 1
        },
        {
          "quote": "每天第一次升级某技能会提示「你有些事情想在今天结束的时候考虑一下」",
          "occurrence": 1
        },
        {
          "quote": "新解锁配方要当天结束、自动存档后才到手",
          "occurrence": 1
        },
        {
          "quote": "每升一级，锄头和喷壶熟练度 +1",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-almanac-zh",
      "label": "星露谷物语官方中文维基：星露谷年历",
      "url": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn",
      "appliesTo": [
        {
          "quote": "阅读即可获得 250 点耕种经验",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-farming-en",
      "label": "Stardew Valley Wiki: Farming",
      "url": "https://stardewvalleywiki.com/Farming",
      "appliesTo": [
        {
          "quote": "英文 [Farming](https://stardewvalleywiki.com/Farming) 把 Almanac 和 Book Of Stars 写成同一句 250 Farming XP",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-skills-en",
      "label": "Stardew Valley Wiki: Skills",
      "url": "https://stardewvalleywiki.com/Skills",
      "appliesTo": [
        {
          "quote": "五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-almanac-en",
      "label": "Stardew Valley Wiki: Stardew Valley Almanac",
      "url": "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
      "appliesTo": [
        {
          "quote": "阅读即可获得 250 点耕种经验",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "site-rancher-zh",
      "label": "本站：农耕人还是畜牧人",
      "url": "https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew",
      "appliesTo": [
        {
          "quote": "怎么选、20% 和 10% 乘的是哪一类货，看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)",
          "occurrence": 1
        },
        {
          "quote": "5 级若弹出畜牧人和农耕人，点[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)再选",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-sprinkler-zh",
      "label": "本站：星露谷洒水器",
      "url": "https://stardewvalleyplanner.art/zh/sprinkler-stardew",
      "appliesTo": [
        {
          "quote": "2 / 6 / 9 级配方到手后怎么摆，看[星露谷洒水器](/zh/sprinkler-stardew)",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-money-zh",
      "label": "本站：第一年怎么赚钱",
      "url": "https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew",
      "appliesTo": [
        {
          "quote": "4 级罐头瓶、8 级小桶是加工门槛；这批货现在卖掉还是锁进机器，看[第一年怎么赚钱](/zh/how-to-earn-money-stardew)",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-spring-zh",
      "label": "本站：春天种什么",
      "url": "https://stardewvalleyplanner.art/zh/best-spring-crop-stardew",
      "appliesTo": [
        {
          "quote": "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-summer-zh",
      "label": "本站：夏天种什么",
      "url": "https://stardewvalleyplanner.art/zh/summer-crops-stardew",
      "appliesTo": [
        {
          "quote": "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-fall-zh",
      "label": "本站：秋季作物",
      "url": "https://stardewvalleyplanner.art/zh/fall-crops-stardew",
      "appliesTo": [
        {
          "quote": "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-home-zh",
      "label": "本站：农场规划器（简体中文首页）",
      "url": "https://stardewvalleyplanner.art/zh",
      "appliesTo": [
        {
          "quote": "规划器不算耕种经验",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "how-to-level-up-farming-stardew",
      "zhPath": "/zh/how-to-level-up-farming-stardew",
      "enPath": "/how-to-level-up-farming-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "doNotOccupy": [
        "rancher-or-tiller-stardew",
        "sprinkler-stardew",
        "how-to-earn-money-stardew",
        "best-spring-crop-stardew",
        "summer-crops-stardew",
        "fall-crops-stardew"
      ]
    },
    "registry": {
      "titleEqualsH1": true,
      "author": "星露谷规划器团队",
      "topic": "星露谷物语指南",
      "featured": true,
      "readTimeMinutes": 9,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "articleModuleExport": "HowToLevelUpFarmingStardewChineseArticle",
      "articleModulePath": "src/blog/articles/how-to-level-up-farming-stardew.zh.tsx"
    },
    "sources": {
      "heading": "来源",
      "checkedLabel": "2026-09-20 对照下方星露谷官方中文维基。经验规则以官方中文维基为准；年历 250 来自年历页；规划器不算耕种经验。作物单次经验摘自耕种页表，不是某份存档实测。",
      "itemOrder": [
        "wiki-farming-zh",
        "wiki-skills-zh",
        "wiki-almanac-zh",
        "wiki-farming-en",
        "wiki-skills-en",
        "wiki-almanac-en",
        "site-rancher-zh",
        "site-sprinkler-zh",
        "site-money-zh",
        "site-spring-zh",
        "site-summer-zh",
        "site-fall-zh",
        "site-home-zh"
      ],
      "items": [
        {
          "id": "wiki-farming-zh",
          "href": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn",
          "label": "星露谷物语官方中文维基：耕种"
        },
        {
          "id": "wiki-skills-zh",
          "href": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn",
          "label": "星露谷物语官方中文维基：技能"
        },
        {
          "id": "wiki-almanac-zh",
          "href": "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn",
          "label": "星露谷物语官方中文维基：星露谷年历"
        },
        {
          "id": "wiki-farming-en",
          "href": "https://stardewvalleywiki.com/Farming",
          "label": "星露谷物语英文维基：Farming"
        },
        {
          "id": "wiki-skills-en",
          "href": "https://stardewvalleywiki.com/Skills",
          "label": "星露谷物语英文维基：Skills"
        },
        {
          "id": "wiki-almanac-en",
          "href": "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
          "label": "星露谷物语英文维基：Stardew Valley Almanac"
        },
        {
          "id": "site-rancher-zh",
          "href": "/zh/rancher-or-tiller-stardew",
          "label": "本站：农耕人还是畜牧人"
        },
        {
          "id": "site-sprinkler-zh",
          "href": "/zh/sprinkler-stardew",
          "label": "本站：星露谷洒水器"
        },
        {
          "id": "site-money-zh",
          "href": "/zh/how-to-earn-money-stardew",
          "label": "本站：第一年怎么赚钱"
        },
        {
          "id": "site-spring-zh",
          "href": "/zh/best-spring-crop-stardew",
          "label": "本站：春天种什么"
        },
        {
          "id": "site-summer-zh",
          "href": "/zh/summer-crops-stardew",
          "label": "本站：夏天种什么"
        },
        {
          "id": "site-fall-zh",
          "href": "/zh/fall-crops-stardew",
          "label": "本站：秋季作物"
        },
        {
          "id": "site-home-zh",
          "href": "/zh",
          "label": "本站：农场规划器（简体中文首页）"
        }
      ]
    },
    "faq": {
      "heading": "FAQ",
      "component": "BlogFaqList",
      "items": [
        {
          "question": "浇水、锄地、把种子种下去，能升耕种吗？",
          "answer": "不能。锄头和喷壶本身不加耕种经验。作物经验在收获时给，不在浇水、锄地或下种时给。"
        },
        {
          "question": "蓝莓、土豆、蔓越莓一次收一堆，经验会按个数翻倍吗？",
          "answer": "不会。一次收获多个产物，只给第一个。蓝莓一株 10 点，蔓越莓一株 14 点，都是单次，不按浆果数乘。"
        },
        {
          "question": "耕种 5 级、10 级分别要多少经验？只用防风草要收多少？",
          "answer": "5 级累计 2150 点，约 269 株防风草；10 级累计 15000 点，约 1875 株防风草。这是从 0 收到这一级的总和。"
        },
        {
          "question": "收获了很多为什么还不升级？",
          "answer": "先看这场动作加不加、有没有把蓝莓或蔓越莓按个数加倍，再对照累计表够不够下一档。经验是立刻加上的；升级弹窗和配方要睡觉、当天结束并存档后才出现。"
        },
        {
          "question": "耕种 5 级选畜牧人还是农耕人？10 级选什么？",
          "answer": "5 级官方名是畜牧人和农耕人。选畜牧人，10 级只在鸡舍大师和牧羊人里再选；选农耕人，10 级只在工匠和农业学家里再选。详细对比看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。"
        }
      ]
    },
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
        {
          "href": "/zh/rancher-or-tiller-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/sprinkler-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/how-to-earn-money-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/best-spring-crop-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/summer-crops-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/fall-crops-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh",
          "className": "blog-planner-link"
        }
      ],
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/how-to-level-up-farming-stardew-cover-zh.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "页首封面，不能代替正文图",
      "altStatus": "pending_media",
      "altDirection": "描述实际封面画：耕种技能在升，不是 5 级职业分叉，也不是洒水布局。禁止把 2150/15000 或假经验条数字写进封面。trimmed length ≥ 8。"
    },
    "figures": [
      {
        "id": "figure-1-add-or-not",
        "assemblyToken": "FIGURE1_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp",
        "placement": "H3「不加：锄地、浇水、种植本身、砍树」对照段之后",
        "type": "可控绘图两栏动作对照图。禁止用生成图冒充游戏截图或技能菜单。",
        "compositionNote": "左栏加：收获作物、爱抚动物、挤奶、剪羊毛、捡蛋/鸭毛/动物毛/兔子的脚、读星露谷年历（可标 250）。右栏不加：锄地、浇水、把种子放进土里、砍树、捡松露。必须能完成加/不加判断。不要画职业分叉或洒水器覆盖。",
        "alt": "一侧是收获作物、摸动物或挤奶剪毛捡蛋、读年历，这些加耕种经验；另一侧是锄地、浇水、把种子放进土里、砍树、捡松露，这些不加。这是动作对照示意图，不是游戏截图。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-2-first-product",
        "assemblyToken": "FIGURE2_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp",
        "placement": "H3「一次收多个为什么经验不翻倍」",
        "type": "可控绘图示意图。禁止用生成图冒充游戏收获截图。",
        "compositionNote": "同一株蓝莓多个浆果，经验只标一笔 10。不要按果堆高度递增。蔓越莓若出镜只许标 14。",
        "alt": "同一株蓝莓一次收出多个浆果，耕种经验只记第一个，这一株是 10 点，不按浆果个数翻倍。这是规则示意图，不是游戏收获截图。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-3-level-ladder",
        "assemblyToken": "FIGURE3_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp",
        "placement": "累计表之后、解锁表之前",
        "type": "可控绘图等级梯子。禁止冒充技能菜单截图。",
        "compositionNote": "至少标 5=2150、8=6900、9=10000、10=15000；门闩只写名称：2 洒水器、4 罐头瓶、5 职业弹窗、6 优质洒水器、8 小桶、9 种子生产器和铱制洒水器。不要画职业分叉土路或洒水器覆盖。",
        "alt": "耕种 1 到 10 级累计梯子，标出 5 级 2150、8 级 6900、9 级 10000、10 级 15000；2 级洒水器、4 级罐头瓶、5 级职业弹窗、6 级优质洒水器、8 级小桶、9 级种子生产器和铱制洒水器。这是等级示意图，不是技能菜单截图。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      }
    ],
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27",
    "length": {
      "locale": "zh-CN",
      "mechanical_units": 2336,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "userReview": "not_started",
    "frozen": true,
    "status": "title_passed",
    "freezePublicBlogHandoff": true,
    "contentOnly": true
  }
}
```
