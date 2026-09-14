# PublicBlogHandoff（zh-CN）— title_passed，已冻结

- type: `PublicBlogHandoff`
- 状态: **title_passed**（`freezePublicBlogHandoff`。E 题文复核 PASS，必须修改 0）
- 角色: Agent F-zh。题文通过由 E 签署，见 `E-zh-title-review.md`
- lockVersion: `2026-09-14-zh-fall-crops-lock-1`
- locale / country: `zh-CN` / `CN`
- bodyHash: `c514fd6e4f13e11f1efcf3879a814db43a89c5e0d61c3a2ed27731e54f85b4b6`
- 锁文件: `docs/blog-ops/fall-crops-stardew/locked/zh-body.txt`（与下方 JSON `body` 字节一致）
- 计数: mechanical_units **5025**（zh-CN 汉字，已 exclude FAQ / 来源 / 常见问题），≥2000
- D 正文: PASS；E 正文: PASS；E 题文: PASS；用户终审: 尚未进行（等网站成品页）
- 公开引用来自 C 文末 `PublicReference`，quote 均在锁定正文，occurrence=1
- 冻结未改锁定正文、hash、Title、H1、Description、slug。未写入 `src/` 或 `public/`。JSON-LD 保持 Article，不要 FAQPage

下方 JSON 是本交接对象。`body` 为锁定读者正文（Markdown，含 H2/H3、FAQ、来源与正文链接），NFC，UTF-8，LF。

```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "title_passed",
  "frozen": true,
  "lockVersion": "2026-09-14-zh-fall-crops-lock-1",
  "locale": "zh-CN",
  "country": "CN",
  "body": "秋 1 先用镰刀清掉非当季枯株；夏 28 还在地里的玉米不枯。皮埃尔秋 1 就卖蔓越莓、南瓜、葡萄种子，秋 16 [星露谷展览会](https://zh.stardewvalleywiki.com/星露谷展览会)不是种子摊。只种浇得完的格：日均高不等于今年买得到、浇得完，也不要把一季总净利和日均合成另一个「最赚」。\n\n每个季节 28 天。下面用同一套口径比室外作物：普通品质，不计肥料、农耕人、农业学家，蔓越莓每次按 2 个计价，那 10% 额外浆果不进日均。门槛写成条件：喷壶还浇不完、巴士还没通、洋蓟皮埃尔还没上架、旅行货车秋冬特殊商品不是稀有种子、小桶还没解锁，都只用来划掉今年种不成的行。\n\n## 秋天种哪几种：先看货架、年份和浇水\n\n先问三件事，再去皮埃尔掏钱。今年货架上实际有哪些种子？巴士通了没有、旅行货车现在卖的是哪一季特价？今晚喷壶还能浇几格？日均高的行，这三问里任何一问卡住，就先从表上划掉。\n\n### 秋 1 先清枯株\n\n[中文维基「农作物」](https://zh.stardewvalleywiki.com/农作物)写：每季第 1 天，不在当季的室外作物枯死，留下枯株；枯株占着已耕地，用镰刀清。[玉米](https://zh.stardewvalleywiki.com/玉米)是多季作物：夏 28 还在地里，任何生长阶段秋 1 都继续长，肥料也不在秋 1 消失。巨大作物跨季不枯，清田时不要把还活着的巨大植株当成枯株砍掉。\n\n秋 1 建议按这个顺序做：\n\n1. 先走田里一圈，枯株用镰刀清掉；玉米和巨大作物留下。\n2. 数今晚还能浇完几格，只给这些格买种子。格子锄出来却浇不到，当晚不算生长。\n3. 皮埃尔秋 1 就卖蔓越莓、南瓜、葡萄。不要把秋 1 空着，等秋 16 展览会来买主力种子。\n4. 要巨大南瓜，先锁一块 3×3，洒水器不要放进这九格。\n5. 要种葡萄，先留过人能走的过道，再下架子。\n\n[农作物](https://zh.stardewvalleywiki.com/农作物)的生长时间写明：生长天数不含播种当天，并假定播种当天浇了水。缺水一天只停长，植株不会因此枯死。秋 1 种下、当天浇水的 13 天作物，秋 14 才能收。\n\n浇水是这季的硬上限。第一年喷壶常常还没升完，体力见底就停。只种今晚浇得完的格子，不要把田先铺到浇不完。[怎么赚钱](/zh/how-to-earn-money-stardew)把秋天写成：这批收成现在卖掉，还是把钱锁进下一道门槛；不要用日均把某一种判成唯一赢家。\n\n[皮埃尔的杂货店](https://zh.stardewvalleywiki.com/皮埃尔的杂货店)秋季当季货架，第一年能直接买到的是：茄子 20 金、玉米 150 金、南瓜 100 金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200 金、[玫瑰仙子](https://zh.stardewvalleywiki.com/玫瑰仙子) 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金。营业 09:00–17:00，周三关门（收集包全完成或小镇钥匙除外）。洋蓟 30 金从第 2 年秋才可买，不要塞进秋 1 默认购物清单。甜菜、西蓝花、稀有种子、上古水果都不在这份货架上。\n\n秋 16 [星露谷展览会](https://zh.stardewvalleywiki.com/星露谷展览会) 09:00–15:00 进镇，村民房子和商店当天上锁；离开场景则节日结束、送回农舍 22:00，星星币节日后清零。它不是春季蛋节那种能买主力种子的摊位。\n\n茶水间[秋季作物收集包](https://zh.stardewvalleywiki.com/收集包)要玉米、茄子、南瓜、山药各 1 个，奖励蜂房 1 个。交包各留一株即可。\n\n打造[野生秋季种子](https://zh.stardewvalleywiki.com/秋季种子)成熟后随机变成黑莓、普通蘑菇、榛子、野梅，不是皮埃尔货架选型。\n\n春天那块室外田怎么选，对象季节不同，看[星露谷春天种什么](/zh/best-spring-crop-stardew)。夏天怎么选看[星露谷夏天种什么](/zh/summer-crops-stardew)。温室 10×12 不受室外换季枯株那套约束，室内怎么排看[星露谷物语温室](/zh/glasshouse-stardew-valley)，不要把上古水果按秋 1 室外作物来买。\n\n## 同一套日均口径下的秋季作物比较\n\n日均来自[农作物「每日收益」](https://zh.stardewvalleywiki.com/农作物)，不是某份存档的出货箱。口径固定如下，表里的行才能横比：\n\n- 普通品质。\n- 不计肥料、农耕人、农业学家。\n- 公式：（最大收获量 × 销售单价 − 种子价格）÷ 生长天数。\n- 多次收获的生长天数 = 第一次成熟 +（次数 − 1）× 再生间隔。\n- 额外收获一般不计。蔓越莓销售单价 = 2 × 75 金；每次另有 10% 更多（平均 +0.11）不进 18.89。\n- 种子价默认皮埃尔；甜菜按绿洲 20 金。Joja 更贵的行，表上日均不能当成你的实际成本。向日葵是例外：Joja 125 金比皮埃尔 200 金便宜。\n\n[农作物](https://zh.stardewvalleywiki.com/农作物)给蔓越莓的示例：最大收获量 5；销售单价 = 2 × 75 = 150；种子 240；生长天数 = 7 + ((5 − 1) × 5) = 27；每日收益 =（5 × 150 − 240）/ 27 = 18.89。南瓜按单周期：（320 − 100）/ 13 = 16.92。西蓝花只用农作物公式：8 + (5 − 1) × 4 = 24 天，（5 × 70 − 0）/ 24 ≈ 14.58。[秋季](https://zh.stardewvalleywiki.com/秋季)表把西蓝花日均印成 ≈12.96，分母 27 与农作物公式 24 天不一致。比日均时用表上的 ≈14.58，不用秋季表 12.96，也不在 12.96 和 14.58 之间折中。\n\n向日葵日均 −15.00：皮埃尔种子 200 金、花 80 金，现卖日均是负的，别当这季主力。宝石甜莓 83.33 可以拿来比，但不是秋 1 默认货架；今年没这粒种子就整行跳过。\n\n「最晚播种」不是维基字段。算法：季节 28 天减去生长天数，要求秋 28 当天能收这一次成熟；播种当天浇水，不用生长激素。漏浇一天，日期往后推一天，秋 28 就收不着。多次收获行里的最晚播种，只保证第一次成熟赶在秋 28；要按维基「每季最多次」收满，须秋 1。蔓越莓要 5 次，须秋 1，收日 8 / 13 / 18 / 23 / 28。南瓜单次最晚秋 15；两茬须更早，日期见下图，标推算。宝石甜莓无肥料最晚秋 4；专页写高级生长激素可到秋 10，那是肥料口径，不与默认推算混用。\n\n| 作物 | 种子来源与价格 | 生长 / 再生 | 普通售价 | 维基日均 | 第一年门槛 | 最晚播种（推算） |\n| --- | --- | --- | --- | --- | --- | --- |\n| [蔓越莓](https://zh.stardewvalleywiki.com/蔓越莓) | 皮埃尔 240 金，Joja 300 金 | 7 天，之后每 5 天，每季最多 5 次；每次 2 个 | 75 金 × 2 个 | ≈18.89 | 秋 1 皮埃尔有货 | 5 次须秋 1 |\n| [南瓜](https://zh.stardewvalleywiki.com/南瓜) | 皮埃尔 100 金，Joja 125 金 | 13 天，单次，每季最多 2 次 | 320 金 | 16.92 | 秋 1 皮埃尔有货；可巨大 | 秋 15（单次）；两茬须更早 |\n| [葡萄](https://zh.stardewvalleywiki.com/葡萄) | 皮埃尔 60 金，Joja 75 金 | 10 天，之后每 3 天，每季最多 6 次 | 80 金 | 16.8 | 秋 1 皮埃尔有货；架子挡路 | 首次秋 18；6 次须秋 1 |\n| [洋蓟](https://zh.stardewvalleywiki.com/洋蓟) | 皮埃尔 30 金（第 2 年秋起） | 8 天，单次，每季最多 3 次 | 160 金 | 16.25 | 第一年皮埃尔不卖 | 秋 20 |\n| [甜菜](https://zh.stardewvalleywiki.com/甜菜) | 绿洲 20 金；皮埃尔秋季货架无此行 | 6 天，单次，每季最多 4 次 | 100 金 | 13.33 | 须巴士进沙漠 | 秋 22 |\n| [西蓝花](https://zh.stardewvalleywiki.com/西蓝花) | 皮埃尔、Joja、旅行货车不出售；公式按种子 0 金 | 8 天，之后每 4 天，每季最多 5 次 | 70 金 | ≈14.58 | 1.6 加入；商店不卖 | 首次秋 20 |\n| [茄子](https://zh.stardewvalleywiki.com/茄子) | 皮埃尔 20 金，Joja 25 金 | 5 天，之后每 5 天，每季最多 5 次 | 60 金 | ≈11.2 | 秋 1 皮埃尔有货；收集包要 1 个 | 首次秋 23；5 次须秋 1 |\n| [苋菜](https://zh.stardewvalleywiki.com/苋菜) | 皮埃尔 70 金，Joja 87 金 | 7 天，单次，每季最多 3 次 | 150 金 | 11.43 | 秋 1 皮埃尔有货；镰刀收 | 秋 21 |\n| [山药](https://zh.stardewvalleywiki.com/山药) | 皮埃尔 60 金，Joja 75 金 | 10 天，单次，每季最多 2 次 | 160 金 | 10.00 | 秋 1 皮埃尔有货；收集包要 1 个 | 秋 18 |\n| [小白菜](https://zh.stardewvalleywiki.com/小白菜) | 皮埃尔 50 金，Joja 62 金 | 4 天，单次，每季最多 6 次 | 80 金 | 7.50 | 秋 1 皮埃尔有货 | 秋 24 |\n| [玫瑰仙子](https://zh.stardewvalleywiki.com/玫瑰仙子) | 皮埃尔 200 金，Joja 250 金 | 12 天，单次，每季最多 2 次 | 290 金 | 7.50 | 秋 1 皮埃尔有货 | 秋 16 |\n| [小麦](https://zh.stardewvalleywiki.com/小麦) | 皮埃尔 10 金，Joja 12 金 | 4 天，单次；秋季最多 6 次 | 25 金 | 3.75 | 秋 1 皮埃尔有货；镰刀收 | 秋 24 |\n| [玉米](https://zh.stardewvalleywiki.com/玉米) | 皮埃尔 150 金，Joja 187 金 | 14 天，之后每 4 天；仅秋最多 4 次 | 50 金 | 仅秋 ≈1.92 | 秋 1 皮埃尔有货；夏 28 留在地里则秋 1 继续 | 首次秋 14；要 4 次须更早 |\n| [向日葵](https://zh.stardewvalleywiki.com/向日葵) | 皮埃尔 200 金，Joja 125 金 | 8 天，单次，每季最多 3 次 | 80 金 | −15.00 | 秋 1 有货，日均为负 | 秋 20 |\n| [宝石甜莓](https://zh.stardewvalleywiki.com/宝石甜莓) | 稀有种子：旅行货车春夏特殊商品 1,000 金；皮埃尔与 Joja 不卖 | 24 天，单次，每季最多 1 次 | 3,000 金 | 83.33 | 不是秋 1 默认货架 | 秋 4（无肥料） |\n\n玉米跨夏秋日均 ≈7.41，必须带「夏秋都种」这个条件，不能写成只种秋天的日均。向日葵 Joja 种子 125 金比皮埃尔便宜，是维基写明的事实；按同一口径 (80 − 125) / 8 = −5.625，这是按公式算的分析，不是秋季表印出来的字段。秋季表日均仍是 −15.00。收获另得 0–2 粒种子，日均公式一般不计这笔。\n\n怎么读：先看「第一年门槛」，今年买不到或去不了的行整行跳过，再在剩下的行里比日均、浇水和格子形状。不要先被宝石甜莓 83.33 吸走，再发现秋 1 皮埃尔和秋季货车特价都没有稀有种子。向日葵皮埃尔 200 金种子、普通售价 80 金，杂货店日均 −15.00，买它不是为了靠卖花把这季日均做高。\n\n对着下面这张秋季 28 天日历看：蔓越莓秋 1 种下才可能按维基最大收获量收 5 次，收日 8、13、18、23、28；南瓜单次 13 天，两茬推算秋 1 种、秋 14 收，当天再种、秋 27 收；只赶一茬则最晚秋 15。漏浇一天，这些日子往后移。这是日历示意图，不是游戏截图。\n\n![蔓越莓秋 1 种才可能满 5 次，收日 8、13、18、23、28；南瓜两茬推算秋 1 种、秋 14 收，当天再种、秋 27 收；只赶一茬最晚秋 15。漏浇则后移。这是日历示意图，不是游戏截图。](/blog/illustrations/fall-crop-occupancy-calendar-zh.webp)\n\n蔓越莓是一株占满季；南瓜是收了才能腾格再种。南瓜两茬日期是推算，不是维基字段。\n\n秋 16 以后还想补种：先看表上最晚播种列。小白菜和小麦秋 24、茄子第一次成熟秋 23、甜菜秋 22、苋菜秋 21，仍可能赶在秋 28 收一茬。蔓越莓若拖过秋 1，就不要再按「能收 5 次」去买一大包种子。南瓜秋 15 只保证普通收成；要两茬，须更早下种、收了当天再播。\n\n## 蔓越莓、南瓜、葡萄按场景选\n\n皮埃尔秋 1 同时卖这三种时，不要问「唯一最赚钱的是哪一种」。问的是：这季要多次现卖、要巨大作物，还是鲜卖并先留架子过道。三种可以分块种，不要在同一块 3×3 里混。\n\n### 多次现卖：蔓越莓\n\n[蔓越莓种子](https://zh.stardewvalleywiki.com/蔓越莓种子)皮埃尔 240 金、Joja 300 金。[蔓越莓](https://zh.stardewvalleywiki.com/蔓越莓) 7 天成熟，之后每 5 天再收。每次 2 个，另有 10% 概率更多（平均 +0.11）；普通售价 75 金。维基日均 ≈18.89，按每次 2 个普通品质来算，那 10% 不进日均。\n\n肥料不要按「两个浆果一起抬品质」来买。初级肥料和高级肥料只作用于每次收获的第一个浆果，另外那个仍按普通规则走。想靠肥料把整株蔓越莓都变成金星，会高估这季现卖。\n\n要按维基最大收获量收 5 次，须秋 1 下种，收日 8、13、18、23、28。秋 1 种下占的是整季那一格，中间腾不出来改种南瓜。地很小、喷壶还在初级，先数格子再买种子，不要按 18.89 一次买到浇不完。蔓越莓不是架子，人可以在植株之间走。\n\n### 单次、可巨大：南瓜\n\n[南瓜种子](https://zh.stardewvalleywiki.com/南瓜种子)皮埃尔 100 金、Joja 125 金。[南瓜](https://zh.stardewvalleywiki.com/南瓜) 13 天，普通品质 320 金，维基日均 16.92，按（320 − 100）/ 13 这一周期来算。它是秋季可巨大的那种作物，也是茶水间秋季作物收集包要的 1 个。秋 16 展览会买不到南瓜种子。\n\n日均 16.92，低于蔓越莓 ≈18.89。选南瓜不是因为它现卖赢过蔓越莓，而是：你愿意留 3×3 赌巨大作物；你想收一茬腾格再种第二茬；收集包要 1 个。巨大外观、九格资格和洒水器占格见下一节。秋 1 种下，13 天后秋 14 熟。要换现金，熟了就收；要巨大，熟了也留着，继续浇左上角。\n\n推算最晚秋 15 下种，秋 28 能收普通南瓜。秋 15 只保证普通收成；成熟当天几乎没有时间再滚巨大作物那 1%。要赌巨大，秋 1 就要把九格种上，让它在秋 14 熟，后面的日子继续浇。要两茬，推算秋 1 种、秋 14 收，当天再种、秋 27 收；漏浇则后移。\n\n第一年常常还没小桶。没解锁时南瓜按鲜卖 320 金看，不要拿尚未造好的机器去和蔓越莓比「谁是秋天赢家」。秋天这批收成现在卖掉，还是锁进罐头瓶或小桶，看[怎么赚钱](/zh/how-to-earn-money-stardew)。\n\n### 鲜卖、架子过道：葡萄\n\n[葡萄种子](https://zh.stardewvalleywiki.com/葡萄种子)皮埃尔 60 金、Joja 75 金。[葡萄](https://zh.stardewvalleywiki.com/葡萄) 10 天成熟，之后每 3 天再收，每季最多 6 次，普通售价 80 金，维基日均 16.8。这 16.8 用的是田里种出来的葡萄，不是路边采的。\n\n[农作物](https://zh.stardewvalleywiki.com/农作物)把葡萄列为棚架作物。葡萄任意生长阶段都不能走过去，枯了才能穿。两行葡萄贴死，收割那天人会堵在田中间。先留过道：两行架子夹一条空路，走到每一株，再考虑铺第三行。空路不是浪费，是收割资格。\n\n秋季种植的葡萄受农耕人；夏季采集的葡萄不受。不要把路边采的葡萄当成这行日均 16.8。要按维基最大收获量收 6 次，须秋 1 下种；第一次成熟最晚秋 18，只保证秋 28 能收这一次。\n\n对着下面这张格子图看：两行架子夹一条空路，才能走到每一株；任意生长阶段人都不能从葡萄植株上走过去。\n\n![两行葡萄架子夹一条空路才能走到每一株；空路不是浪费，是收割资格。任意生长阶段不能从植株上走过去，枯了才能穿。](/blog/illustrations/fall-grape-walk-zh.webp)\n\n[茄子](https://zh.stardewvalleywiki.com/茄子)皮埃尔 20 金，收集包要 1 个，留一株即可，不是蔓越莓的替代主力。[山药](https://zh.stardewvalleywiki.com/山药)皮埃尔 60 金，同样交包留一株。[苋菜](https://zh.stardewvalleywiki.com/苋菜)要用镰刀收。[小白菜](https://zh.stardewvalleywiki.com/小白菜) 4 天、小麦 4 天，用来填最晚播种列里靠后的空格。[玫瑰仙子](https://zh.stardewvalleywiki.com/玫瑰仙子)皮埃尔 200 金，日均 7.50；蜂房蜂蜜基础价提到 680，不当成这季室外现卖主力。\n\n## 巨大南瓜按 3×3 排，洒水器不要占九格\n\n秋季能长成巨大作物的是南瓜。蔓越莓、葡萄、茄子不会变巨大。要巨大南瓜，必须留 3×3 九格同种南瓜，不要摆成一排，也不要在九格里塞蔓越莓、葡萄或洒水器。\n\n[农作物·巨大作物](https://zh.stardewvalleywiki.com/农作物)写：种植在 3×3 地块上的花椰菜、甜瓜、南瓜、霜瓜以及齐瓜可随机组合成一个巨大作物。每天开始时，只要任意一个 3×3 作物网格（包括重叠的）中的左上角作物已完全成熟并浇水，且所有组成作物皆为同一类型，该网格就有 1% 概率长成巨大作物。巨大作物出现那天，并非一定要网格内其他 8 株作物也完全成熟。使用任意斧头收获时，巨大作物将掉落 15 到 21 个普通品质的物品。巨大作物不会像其它作物一样在季节变化时枯萎。巨大作物无法在温室内和姜岛上种出，也无法通过使用花盆长成。\n\n洒水器占一格，那一格就不能种南瓜。喷头放进 3×3，九格就不是同种，巨大作物没有资格。第一年多半还在用手浇：九格都留给南瓜，喷头放到 3×3 外面。覆盖圈可以探进南瓜田，机身仍要在九格之外。怎么对覆盖，看[星露谷洒水器](/zh/sprinkler-stardew)，不要在九格正中心插一根当装饰。\n\n对着下面这张格子图看四件事：九格同种南瓜才有巨大资格；洒水器占其中一格则无资格；左上角那株须成熟且浇过水；目录里 Giant Pumpkin 外观不等于这九格已经具备资格。\n\n![九格同种南瓜才有巨大资格；洒水器占一格则无资格；左上角须成熟且浇水；Giant Pumpkin 外观不等于九格资格。](/blog/illustrations/fall-pumpkin-3x3-zh.webp)\n\n重叠的 3×3 各自滚 1%。这不保证更快长出巨大南瓜，只说明资格格可以重叠。先保证至少一块完整九格，比先铺三排却被喷头占格更重要。每天 1% 不是规划器能掷出来的；田里九格对齐只是资格。要滚每天 1%，须在秋 14 熟后继续留着浇左上角。温室 10×12 排得再整齐，巨大作物也形成不了，室内布局看[星露谷物语温室](/zh/glasshouse-stardew-valley)。\n\n需要对九格时，可打开[农场规划器](/zh#planner)目录。中文页搜索框里写着 “Search...”，按钮写着 “Search catalog”，条目用英文名。实测搜「南瓜」「蔓越莓」「巨大南瓜」「西兰花」匹配 0 条；搜英文 Pumpkin 得到 Pumpkin 1×1 与 Giant Pumpkin 3×3，Cranberries、Broccoli、Giant Pumpkin 也能命中。排 3×3 资格用普通 Pumpkin 九格；Giant Pumpkin 只对照巨大外观，不能代替九格种子。规划器能摆作物和巨大外观，也能切春夏秋冬、看洒水器占没占格；它不算金币、不浇水、不掷每天 1%。画布上能放下九格，不等于今晚喷壶浇得完。\n\n## 洋蓟、甜菜、西蓝花、宝石甜莓不是第一年默认货架\n\n日均表上最高的几行，第一年常常买不到种子。把它们当「秋天默认种这些」会空手而归。下面这些行从默认田里拿掉，并不妨碍巴士通了、第二年货架开了、种子挖到了以后再种。\n\n[洋蓟](https://zh.stardewvalleywiki.com/洋蓟)种子第二年秋季起才在皮埃尔卖，30 金。8 天，普通 160 金，日均 16.25，低于南瓜 16.92，高于葡萄 16.8。第一年皮埃尔货架没有它。第一年混合种子秋季可能变成洋蓟种子，那不是默认货架。第一年秋 1 不要按 16.25 去皮埃尔找洋蓟种子。\n\n[甜菜](https://zh.stardewvalleywiki.com/甜菜)种子只在[绿洲](https://zh.stardewvalleywiki.com/绿洲)卖 20 金，秋天播种 6 天成熟，普通 100 金，日均 13.33。皮埃尔秋季货架无此行。[沙漠](https://zh.stardewvalleywiki.com/沙漠)要先修好巴士才能进：完成金库收集包，或用 Joja 社区发展申请书 40,000 金买「公共汽车」。绿洲 9:00–23:50，桑迪经营；秋 15 桑迪生日，13:00 后停业。巴士未通，甜菜整行跳过。\n\n[西蓝花](https://zh.stardewvalleywiki.com/西蓝花)是条目名；日常也有人写西兰花，柜台和维基条目仍是西蓝花。1.6 加入。[西蓝花种子](https://zh.stardewvalleywiki.com/西蓝花种子)皮埃尔、Joja、旅行货车都不出售。8 天，每 4 天再生，普通 70 金，日均只用 ≈14.58。来源包括挖绿色斑点、矿井木箱木桶、兑奖机、浣熊等；多数来源只在夏 21–秋 20。挖到了就种，没挖到不要等，更不要按 14.58 预留一整片空地。\n\n[稀有种子](https://zh.stardewvalleywiki.com/稀有种子)皮埃尔和 Joja 不卖。[旅行货车](https://zh.stardewvalleywiki.com/旅行货车)特殊商品里的稀有种子只在春、夏以 1,000 金出现（100%，1 个或 5 个）。秋冬特殊商品表是珍奇乌鸦、咖啡豆，不是稀有种子。普通商品 1.26% 为 600–1,000 金、不限季节，两种不会同时出现，这不是货架。描述写「需要一个季度」，实际 24 天。[宝石甜莓](https://zh.stardewvalleywiki.com/宝石甜莓)普通售价 3,000 金，日均 83.33。秋季表把 1,000 金印在秋季行上，读者若秋 1 去货车当默认货会落空。无肥料最晚秋 4 下种；那粒种子今年没买到，整行跳过。\n\n[上古水果](https://zh.stardewvalleywiki.com/上古水果)不是秋 1 默认室外田。[上古种子](https://zh.stardewvalleywiki.com/上古种子)皮埃尔和 Joja 不卖。上古种子专页历史写 1.6.3 起旅行货车不再出售；农作物特殊作物节仍写旅行货车 100–1,000 金。这两行都在，不另编一个第三价格。种子来自打造古物「古代种子」并捐赠博物馆。28 天成熟，之后每 7 天；春夏秋能长，不能花盆，能进温室。秋 1 室外种下，无肥料时首次成熟落到冬 1，冬季不是合法季。温室 10×12 怎么排，看[星露谷物语温室](/zh/glasshouse-stardew-valley)。\n\n玉米夏秋都能长。14 天，每 4 天。仅算秋季日均 ≈1.92，低于小白菜 7.50；跨夏秋 ≈7.41，仍低于蔓越莓 ≈18.89。夏 28 还在地里则秋 1 继续长，肥料不在秋 1 消失。不要把 7.41 当成「只种秋天」的日均。这是占格选择，不是秋季日均赢家。向日葵夏秋可种，收获 0 到 2 粒种子，皮埃尔日均 −15.00，表上已经是负的；卖花赚不回那 200 金种子。\n\n下种前核这五件事：\n\n1. 秋 1 枯株清了没有；玉米和巨大作物有没有被误砍。\n2. 这季真正下地的名单：今年买得到、今晚浇得完。蔓越莓现卖、南瓜九格、葡萄过道，各占哪一块。\n3. 最晚播种标在日历上没有。蔓越莓要 5 次须秋 1；南瓜普通收成最晚秋 15，两茬须更早；葡萄首次最晚秋 18，6 次须秋 1。漏浇往后推。\n4. 要巨大南瓜：九格是否同种，洒水器是否在九格外，左上角熟了以后是否继续浇。\n5. 哪些行今年跳过：洋蓟（第二年皮埃尔）、甜菜（巴士/绿洲）、西蓝花（挖到才有）、宝石甜莓（不是秋 1 默认货架）、上古水果（不是秋 1 默认室外田）、向日葵（日均为负）。玉米若只种秋天，按 ≈1.92 看，不要按跨夏秋 ≈7.41 下单。南瓜若没有小桶，按鲜卖 320 金和日均 16.92 看。\n\n核完这五条，这季室外种哪几种、最晚哪天下种、九格和过道怎么留，就可以下地。不要把维基全表抄进种子篮。\n\n## FAQ\n\n**第一年秋天种什么？秋 1 皮埃尔默认卖哪些种子？**\n\n第一年皮埃尔秋季货架没有洋蓟：茄子 20 金、玉米 150 金、南瓜 100 金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200 金、玫瑰仙子 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金。营业 09:00–17:00，周三关门。甜菜、西蓝花、稀有种子、上古水果不在这份默认购物清单里。\n\n**宝石甜莓日均约 83.33，秋 1 能在皮埃尔或旅行货车当默认货买到吗？**\n\n不能。皮埃尔和 Joja 不卖稀有种子。旅行货车特殊商品里的稀有种子只在春、夏以 1,000 金出现。秋冬特殊商品不是这粒。普通商品 1.26% 为 600–1,000 金、不限季节，不是货架。\n\n**蔓越莓日均约 18.89 把每次 10% 额外浆果算进去了吗？要收满 5 次必须哪天种？**\n\n没有。18.89 按每次 2 个计价，10% 不进。生长天数 27。秋 1 种，收日 8、13、18、23、28。初级和高级肥料只作用每次第一个浆果。\n\n**南瓜和蔓越莓哪个更赚？能把一季总净利和日均合成「秋季最赚钱」吗？**\n\n不能合成。同一口径下蔓越莓 ≈18.89，南瓜 16.92。选南瓜是因为巨大、两茬占格或交包，不是因为鲜卖日均更高。\n\n**秋 16 星露谷展览会能买南瓜或蔓越莓种子吗？**\n\n不能。那天商店上锁。星露谷展览会不是蛋节那种种子摊。节日名是星露谷展览会。\n\n**规划器搜中文「南瓜」「蔓越莓」有条目吗？它能算秋季日均吗？**\n\n没有。实测中文「南瓜」「蔓越莓」匹配 0 条。搜英文 Pumpkin、Cranberries、Giant Pumpkin。规划器不算金币、不浇水、不掷每天 1%。\n\n## 来源\n\n2026-09-14 对照下方星露谷中文维基。日均按农作物「每日收益」：普通品质，不计肥料、农耕人、农业学家。最晚播种由 28 减生长天数推算，不是维基字段。规划器不算金币、不浇水、不掷每天 1%。\n\n- [星露谷物语官方中文维基：农作物](https://zh.stardewvalleywiki.com/农作物)\n- [星露谷物语官方中文维基：秋季](https://zh.stardewvalleywiki.com/秋季)\n- [星露谷物语官方中文维基：皮埃尔的杂货店](https://zh.stardewvalleywiki.com/皮埃尔的杂货店)\n- [星露谷物语官方中文维基：南瓜](https://zh.stardewvalleywiki.com/南瓜)\n- [星露谷物语官方中文维基：南瓜种子](https://zh.stardewvalleywiki.com/南瓜种子)\n- [星露谷物语官方中文维基：蔓越莓](https://zh.stardewvalleywiki.com/蔓越莓)\n- [星露谷物语官方中文维基：蔓越莓种子](https://zh.stardewvalleywiki.com/蔓越莓种子)\n- [星露谷物语官方中文维基：葡萄](https://zh.stardewvalleywiki.com/葡萄)\n- [星露谷物语官方中文维基：葡萄种子](https://zh.stardewvalleywiki.com/葡萄种子)\n- [星露谷物语官方中文维基：玫瑰仙子](https://zh.stardewvalleywiki.com/玫瑰仙子)\n- [星露谷物语官方中文维基：洋蓟](https://zh.stardewvalleywiki.com/洋蓟)\n- [星露谷物语官方中文维基：甜菜](https://zh.stardewvalleywiki.com/甜菜)\n- [星露谷物语官方中文维基：绿洲](https://zh.stardewvalleywiki.com/绿洲)\n- [星露谷物语官方中文维基：沙漠](https://zh.stardewvalleywiki.com/沙漠)\n- [星露谷物语官方中文维基：西蓝花](https://zh.stardewvalleywiki.com/西蓝花)\n- [星露谷物语官方中文维基：西蓝花种子](https://zh.stardewvalleywiki.com/西蓝花种子)\n- [星露谷物语官方中文维基：稀有种子](https://zh.stardewvalleywiki.com/稀有种子)\n- [星露谷物语官方中文维基：宝石甜莓](https://zh.stardewvalleywiki.com/宝石甜莓)\n- [星露谷物语官方中文维基：上古水果](https://zh.stardewvalleywiki.com/上古水果)\n- [星露谷物语官方中文维基：上古种子](https://zh.stardewvalleywiki.com/上古种子)\n- [星露谷物语官方中文维基：玉米](https://zh.stardewvalleywiki.com/玉米)\n- [星露谷物语官方中文维基：向日葵](https://zh.stardewvalleywiki.com/向日葵)\n- [星露谷物语官方中文维基：向日葵种子](https://zh.stardewvalleywiki.com/向日葵种子)\n- [星露谷物语官方中文维基：旅行货车](https://zh.stardewvalleywiki.com/旅行货车)\n- [星露谷物语官方中文维基：星露谷展览会](https://zh.stardewvalleywiki.com/星露谷展览会)\n- [星露谷物语官方中文维基：收集包](https://zh.stardewvalleywiki.com/收集包)\n- [星露谷物语官方中文维基：秋季种子](https://zh.stardewvalleywiki.com/秋季种子)\n- [星露谷物语官方中文维基：苋菜](https://zh.stardewvalleywiki.com/苋菜)\n- [星露谷物语官方中文维基：茄子](https://zh.stardewvalleywiki.com/茄子)\n- [星露谷物语官方中文维基：山药](https://zh.stardewvalleywiki.com/山药)\n- [星露谷物语官方中文维基：小白菜](https://zh.stardewvalleywiki.com/小白菜)\n- [星露谷物语官方中文维基：小麦](https://zh.stardewvalleywiki.com/小麦)\n- [本站：春天种什么](/zh/best-spring-crop-stardew)\n- [本站：夏天种什么](/zh/summer-crops-stardew)\n- [本站：第一年怎么赚钱](/zh/how-to-earn-money-stardew)\n- [本站：温室布局](/zh/glasshouse-stardew-valley)\n- [本站：洒水器](/zh/sprinkler-stardew)\n- [本站：农场规划器](/zh#planner)",
  "bodyHash": "c514fd6e4f13e11f1efcf3879a814db43a89c5e0d61c3a2ed27731e54f85b4b6",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 29165,
  "seo": {
    "title": "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
    "h1": "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
    "description": "现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道。第一年没有洋蓟；甜菜要巴士。宝石甜莓 83.33 不是秋 1 默认货架。",
    "slug": "fall-crops-stardew",
    "faq": [
      {
        "question": "第一年秋天种什么？秋 1 皮埃尔默认卖哪些种子？",
        "answer": "第一年皮埃尔秋季货架没有洋蓟：茄子 20 金、玉米 150 金、南瓜 100 金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200 金、玫瑰仙子 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金。营业 09:00–17:00，周三关门。甜菜、西蓝花、稀有种子、上古水果不在这份默认购物清单里。"
      },
      {
        "question": "宝石甜莓日均约 83.33，秋 1 能在皮埃尔或旅行货车当默认货买到吗？",
        "answer": "不能。皮埃尔和 Joja 不卖稀有种子。旅行货车特殊商品里的稀有种子只在春、夏以 1,000 金出现。秋冬特殊商品不是这粒。普通商品 1.26% 为 600–1,000 金、不限季节，不是货架。"
      },
      {
        "question": "蔓越莓日均约 18.89 把每次 10% 额外浆果算进去了吗？要收满 5 次必须哪天种？",
        "answer": "没有。18.89 按每次 2 个计价，10% 不进。生长天数 27。秋 1 种，收日 8、13、18、23、28。初级和高级肥料只作用每次第一个浆果。"
      },
      {
        "question": "南瓜和蔓越莓哪个更赚？能把一季总净利和日均合成「秋季最赚钱」吗？",
        "answer": "不能合成。同一口径下蔓越莓 ≈18.89，南瓜 16.92。选南瓜是因为巨大、两茬占格或交包，不是因为鲜卖日均更高。"
      },
      {
        "question": "秋 16 星露谷展览会能买南瓜或蔓越莓种子吗？",
        "answer": "不能。那天商店上锁。星露谷展览会不是蛋节那种种子摊。节日名是星露谷展览会。"
      },
      {
        "question": "规划器搜中文「南瓜」「蔓越莓」有条目吗？它能算秋季日均吗？",
        "answer": "没有。实测中文「南瓜」「蔓越莓」匹配 0 条。搜英文 Pumpkin、Cranberries、Giant Pumpkin。规划器不算金币、不浇水、不掷每天 1%。"
      }
    ],
    "schema": {
      "@type": "Article",
      "doNotEmitFAQPage": true
    },
    "og": {
      "title": "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
      "description": "现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道。第一年没有洋蓟；甜菜要巴士。宝石甜莓 83.33 不是秋 1 默认货架。",
      "openGraphType": "article",
      "image": "pending_media"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-crops",
      "label": "星露谷物语官方中文维基：农作物",
      "url": "https://zh.stardewvalleywiki.com/农作物",
      "appliesTo": [
        {
          "quote": "每季第 1 天，不在当季的室外作物枯死，留下枯株；枯株占着已耕地，用镰刀清",
          "occurrence": 1
        },
        {
          "quote": "生长天数不含播种当天，并假定播种当天浇了水",
          "occurrence": 1
        },
        {
          "quote": "不计肥料、农耕人、农业学家，蔓越莓每次按 2 个计价",
          "occurrence": 1
        },
        {
          "quote": "每日收益 =（5 × 150 − 240）/ 27 = 18.89",
          "occurrence": 1
        },
        {
          "quote": "初级肥料和高级肥料只作用于每次收获的第一个浆果",
          "occurrence": 1
        },
        {
          "quote": "葡萄任意生长阶段都不能走过去，枯了才能穿",
          "occurrence": 1
        },
        {
          "quote": "左上角作物已完全成熟并浇水",
          "occurrence": 1
        },
        {
          "quote": "该网格就有 1% 概率长成巨大作物",
          "occurrence": 1
        },
        {
          "quote": "使用任意斧头收获时，巨大作物将掉落 15 到 21 个普通品质的物品",
          "occurrence": 1
        },
        {
          "quote": "巨大作物无法在温室内和姜岛上种出，也无法通过使用花盆长成",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-fall",
      "label": "星露谷物语官方中文维基：秋季",
      "url": "https://zh.stardewvalleywiki.com/秋季",
      "appliesTo": [
        {
          "quote": "表把西蓝花日均印成 ≈12.96，分母 27 与农作物公式 24 天不一致",
          "occurrence": 1
        },
        {
          "quote": "比日均时用表上的 ≈14.58，不用秋季表 12.96，也不在 12.96 和 14.58 之间折中",
          "occurrence": 1
        },
        {
          "quote": "向日葵日均 −15.00：皮埃尔种子 200 金、花 80 金",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pierre",
      "label": "星露谷物语官方中文维基：皮埃尔的杂货店",
      "url": "https://zh.stardewvalleywiki.com/皮埃尔的杂货店",
      "appliesTo": [
        {
          "quote": "茄子 20 金、玉米 150 金、南瓜 100 金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200 金、[玫瑰仙子](https://zh.stardewvalleywiki.com/玫瑰仙子) 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金",
          "occurrence": 1
        },
        {
          "quote": "营业 09:00–17:00，周三关门（收集包全完成或小镇钥匙除外）",
          "occurrence": 1
        },
        {
          "quote": "洋蓟 30 金从第 2 年秋才可买",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pumpkin",
      "label": "星露谷物语官方中文维基：南瓜",
      "url": "https://zh.stardewvalleywiki.com/南瓜",
      "appliesTo": [
        {
          "quote": "13 天，普通品质 320 金，维基日均 16.92",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pumpkin-seed",
      "label": "星露谷物语官方中文维基：南瓜种子",
      "url": "https://zh.stardewvalleywiki.com/南瓜种子",
      "appliesTo": [
        {
          "quote": "皮埃尔 100 金、Joja 125 金",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-cranberry",
      "label": "星露谷物语官方中文维基：蔓越莓",
      "url": "https://zh.stardewvalleywiki.com/蔓越莓",
      "appliesTo": [
        {
          "quote": "7 天成熟，之后每 5 天再收",
          "occurrence": 1
        },
        {
          "quote": "每次 2 个，另有 10% 概率更多（平均 +0.11）",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-cranberry-seed",
      "label": "星露谷物语官方中文维基：蔓越莓种子",
      "url": "https://zh.stardewvalleywiki.com/蔓越莓种子",
      "appliesTo": [
        {
          "quote": "皮埃尔 240 金、Joja 300 金",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-grape",
      "label": "星露谷物语官方中文维基：葡萄",
      "url": "https://zh.stardewvalleywiki.com/葡萄",
      "appliesTo": [
        {
          "quote": "10 天成熟，之后每 3 天再收，每季最多 6 次，普通售价 80 金，维基日均 16.8",
          "occurrence": 1
        },
        {
          "quote": "秋季种植的葡萄受农耕人；夏季采集的葡萄不受",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-grape-seed",
      "label": "星露谷物语官方中文维基：葡萄种子",
      "url": "https://zh.stardewvalleywiki.com/葡萄种子",
      "appliesTo": [
        {
          "quote": "皮埃尔 60 金、Joja 75 金",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-fairy",
      "label": "星露谷物语官方中文维基：玫瑰仙子",
      "url": "https://zh.stardewvalleywiki.com/玫瑰仙子",
      "appliesTo": [
        {
          "quote": "皮埃尔 200 金，日均 7.50；蜂房蜂蜜基础价提到 680",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-artichoke",
      "label": "星露谷物语官方中文维基：洋蓟",
      "url": "https://zh.stardewvalleywiki.com/洋蓟",
      "appliesTo": [
        {
          "quote": "种子第二年秋季起才在皮埃尔卖，30 金",
          "occurrence": 1
        },
        {
          "quote": "8 天，普通 160 金，日均 16.25",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-beet",
      "label": "星露谷物语官方中文维基：甜菜",
      "url": "https://zh.stardewvalleywiki.com/甜菜",
      "appliesTo": [
        {
          "quote": "种子只在[绿洲](https://zh.stardewvalleywiki.com/绿洲)卖 20 金，秋天播种 6 天成熟",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-oasis",
      "label": "星露谷物语官方中文维基：绿洲",
      "url": "https://zh.stardewvalleywiki.com/绿洲",
      "appliesTo": [
        {
          "quote": "绿洲 9:00–23:50，桑迪经营；秋 15 桑迪生日，13:00 后停业",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-desert",
      "label": "星露谷物语官方中文维基：沙漠",
      "url": "https://zh.stardewvalleywiki.com/沙漠",
      "appliesTo": [
        {
          "quote": "完成金库收集包，或用 Joja 社区发展申请书 40,000 金买「公共汽车」",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-broccoli",
      "label": "星露谷物语官方中文维基：西蓝花",
      "url": "https://zh.stardewvalleywiki.com/西蓝花",
      "appliesTo": [
        {
          "quote": "是条目名；日常也有人写西兰花",
          "occurrence": 1
        },
        {
          "quote": "柜台和维基条目仍是西蓝花。1.6 加入",
          "occurrence": 1
        },
        {
          "quote": "日均只用 ≈14.58",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-broccoli-seed",
      "label": "星露谷物语官方中文维基：西蓝花种子",
      "url": "https://zh.stardewvalleywiki.com/西蓝花种子",
      "appliesTo": [
        {
          "quote": "皮埃尔、Joja、旅行货车都不出售",
          "occurrence": 1
        },
        {
          "quote": "多数来源只在夏 21–秋 20",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-rare-seed",
      "label": "星露谷物语官方中文维基：稀有种子",
      "url": "https://zh.stardewvalleywiki.com/稀有种子",
      "appliesTo": [
        {
          "quote": "特殊商品里的稀有种子只在春、夏以 1,000 金出现（100%，1 个或 5 个）",
          "occurrence": 1
        },
        {
          "quote": "普通商品 1.26% 为 600–1,000 金、不限季节，两种不会同时出现，这不是货架",
          "occurrence": 1
        },
        {
          "quote": "描述写「需要一个季度」，实际 24 天",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-sweet-gem",
      "label": "星露谷物语官方中文维基：宝石甜莓",
      "url": "https://zh.stardewvalleywiki.com/宝石甜莓",
      "appliesTo": [
        {
          "quote": "普通售价 3,000 金，日均 83.33",
          "occurrence": 1
        },
        {
          "quote": "宝石甜莓 83.33 可以拿来比，但不是秋 1 默认货架",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-cart",
      "label": "星露谷物语官方中文维基：旅行货车",
      "url": "https://zh.stardewvalleywiki.com/旅行货车",
      "appliesTo": [
        {
          "quote": "秋冬特殊商品表是珍奇乌鸦、咖啡豆，不是稀有种子",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-ancient",
      "label": "星露谷物语官方中文维基：上古水果",
      "url": "https://zh.stardewvalleywiki.com/上古水果",
      "appliesTo": [
        {
          "quote": "[上古水果](https://zh.stardewvalleywiki.com/上古水果)不是秋 1 默认室外田",
          "occurrence": 1
        },
        {
          "quote": "28 天成熟，之后每 7 天",
          "occurrence": 1
        },
        {
          "quote": "秋 1 室外种下，无肥料时首次成熟落到冬 1",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-ancient-seed",
      "label": "星露谷物语官方中文维基：上古种子",
      "url": "https://zh.stardewvalleywiki.com/上古种子",
      "appliesTo": [
        {
          "quote": "上古种子专页历史写 1.6.3 起旅行货车不再出售；农作物特殊作物节仍写旅行货车 100–1,000 金",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-corn",
      "label": "星露谷物语官方中文维基：玉米",
      "url": "https://zh.stardewvalleywiki.com/玉米",
      "appliesTo": [
        {
          "quote": "夏 28 还在地里，任何生长阶段秋 1 都继续长，肥料也不在秋 1 消失",
          "occurrence": 1
        },
        {
          "quote": "仅算秋季日均 ≈1.92",
          "occurrence": 1
        },
        {
          "quote": "低于小白菜 7.50；跨夏秋 ≈7.41，仍低于蔓越莓 ≈18.89",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-sunflower-seed",
      "label": "星露谷物语官方中文维基：向日葵种子",
      "url": "https://zh.stardewvalleywiki.com/向日葵种子",
      "appliesTo": [
        {
          "quote": "向日葵 Joja 种子 125 金比皮埃尔便宜，是维基写明的事实",
          "occurrence": 1
        },
        {
          "quote": "收获另得 0–2 粒种子",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-fair",
      "label": "星露谷物语官方中文维基：星露谷展览会",
      "url": "https://zh.stardewvalleywiki.com/星露谷展览会",
      "appliesTo": [
        {
          "quote": "09:00–15:00 进镇，村民房子和商店当天上锁",
          "occurrence": 1
        },
        {
          "quote": "离开场景则节日结束、送回农舍 22:00，星星币节日后清零",
          "occurrence": 1
        },
        {
          "quote": "它不是春季蛋节那种能买主力种子的摊位",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-bundles",
      "label": "星露谷物语官方中文维基：收集包",
      "url": "https://zh.stardewvalleywiki.com/收集包",
      "appliesTo": [
        {
          "quote": "要玉米、茄子、南瓜、山药各 1 个，奖励蜂房 1 个",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-fall-seeds",
      "label": "星露谷物语官方中文维基：秋季种子",
      "url": "https://zh.stardewvalleywiki.com/秋季种子",
      "appliesTo": [
        {
          "quote": "成熟后随机变成黑莓、普通蘑菇、榛子、野梅，不是皮埃尔货架选型",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "site-planner-zh",
      "label": "星露谷农场规划器（简体中文）",
      "url": "https://stardewvalleyplanner.art/zh",
      "appliesTo": [
        {
          "quote": "实测搜「南瓜」「蔓越莓」「巨大南瓜」「西兰花」匹配 0 条",
          "occurrence": 1
        },
        {
          "quote": "搜英文 Pumpkin 得到 Pumpkin 1×1 与 Giant Pumpkin 3×3",
          "occurrence": 1
        },
        {
          "quote": "它不算金币、不浇水、不掷每天 1%",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。目录语言沿用 2026-09-14 中文首页实测。"
    },
    {
      "id": "site-spring-zh",
      "label": "本站：春天种什么",
      "url": "https://stardewvalleyplanner.art/zh/best-spring-crop-stardew",
      "appliesTo": [
        {
          "quote": "春天那块室外田怎么选，对象季节不同",
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
          "quote": "夏天怎么选看",
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
          "quote": "这批收成现在卖掉，还是把钱锁进下一道门槛",
          "occurrence": 1
        },
        {
          "quote": "没解锁时南瓜按鲜卖 320 金看",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "site-greenhouse-zh",
      "label": "本站：温室布局",
      "url": "https://stardewvalleyplanner.art/zh/glasshouse-stardew-valley",
      "appliesTo": [
        {
          "quote": "温室 10×12 不受室外换季枯株那套约束",
          "occurrence": 1
        }
      ],
      "versionNote": "本站页面，不是维基。"
    },
    {
      "id": "wiki-amaranth",
      "label": "星露谷物语官方中文维基：苋菜",
      "url": "https://zh.stardewvalleywiki.com/苋菜",
      "appliesTo": [
        {
          "quote": "皮埃尔 70 金，Joja 87 金",
          "occurrence": 1
        }
      ]
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "fall-crops-stardew",
      "zhPath": "/zh/fall-crops-stardew",
      "enPath": "/fall-crops-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "doNotOccupy": [
        "best-fall-crops-stardew",
        "summer-crops-stardew",
        "best-spring-crop-stardew"
      ]
    },
    "registry": {
      "titleEqualsH1": true,
      "author": "星露谷规划器团队",
      "topic": "星露谷物语指南",
      "featured": true,
      "readTimeMinutes": 19,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "articleModuleExport": "FallCropsStardewChineseArticle",
      "articleModulePath": "src/blog/articles/fall-crops-stardew.zh.tsx"
    },
    "sources": {
      "heading": "来源",
      "checkedLabel": "2026-09-14 对照下方星露谷中文维基。日均按农作物「每日收益」：普通品质，不计肥料、农耕人、农业学家。最晚播种由 28 减生长天数推算，不是维基字段。规划器不算金币、不浇水、不掷每天 1%。",
      "itemOrder": [
        "wiki-crops",
        "wiki-fall",
        "wiki-pierre",
        "wiki-pumpkin",
        "wiki-pumpkin-seed",
        "wiki-cranberry",
        "wiki-cranberry-seed",
        "wiki-grape",
        "wiki-grape-seed",
        "wiki-fairy",
        "wiki-artichoke",
        "wiki-beet",
        "wiki-oasis",
        "wiki-desert",
        "wiki-broccoli",
        "wiki-broccoli-seed",
        "wiki-rare-seed",
        "wiki-sweet-gem",
        "wiki-ancient",
        "wiki-ancient-seed",
        "wiki-corn",
        "wiki-sunflower",
        "wiki-sunflower-seed",
        "wiki-cart",
        "wiki-fair",
        "wiki-bundles",
        "wiki-fall-seeds",
        "wiki-amaranth",
        "wiki-eggplant",
        "wiki-yam",
        "wiki-bok-choy",
        "wiki-wheat",
        "site-spring-zh",
        "site-summer-zh",
        "site-money-zh",
        "site-greenhouse-zh",
        "site-sprinkler-zh",
        "site-planner-zh"
      ],
      "items": [
        {
          "id": "wiki-crops",
          "href": "https://zh.stardewvalleywiki.com/农作物",
          "label": "星露谷物语官方中文维基：农作物"
        },
        {
          "id": "wiki-fall",
          "href": "https://zh.stardewvalleywiki.com/秋季",
          "label": "星露谷物语官方中文维基：秋季"
        },
        {
          "id": "wiki-pierre",
          "href": "https://zh.stardewvalleywiki.com/皮埃尔的杂货店",
          "label": "星露谷物语官方中文维基：皮埃尔的杂货店"
        },
        {
          "id": "wiki-pumpkin",
          "href": "https://zh.stardewvalleywiki.com/南瓜",
          "label": "星露谷物语官方中文维基：南瓜"
        },
        {
          "id": "wiki-pumpkin-seed",
          "href": "https://zh.stardewvalleywiki.com/南瓜种子",
          "label": "星露谷物语官方中文维基：南瓜种子"
        },
        {
          "id": "wiki-cranberry",
          "href": "https://zh.stardewvalleywiki.com/蔓越莓",
          "label": "星露谷物语官方中文维基：蔓越莓"
        },
        {
          "id": "wiki-cranberry-seed",
          "href": "https://zh.stardewvalleywiki.com/蔓越莓种子",
          "label": "星露谷物语官方中文维基：蔓越莓种子"
        },
        {
          "id": "wiki-grape",
          "href": "https://zh.stardewvalleywiki.com/葡萄",
          "label": "星露谷物语官方中文维基：葡萄"
        },
        {
          "id": "wiki-grape-seed",
          "href": "https://zh.stardewvalleywiki.com/葡萄种子",
          "label": "星露谷物语官方中文维基：葡萄种子"
        },
        {
          "id": "wiki-fairy",
          "href": "https://zh.stardewvalleywiki.com/玫瑰仙子",
          "label": "星露谷物语官方中文维基：玫瑰仙子"
        },
        {
          "id": "wiki-artichoke",
          "href": "https://zh.stardewvalleywiki.com/洋蓟",
          "label": "星露谷物语官方中文维基：洋蓟"
        },
        {
          "id": "wiki-beet",
          "href": "https://zh.stardewvalleywiki.com/甜菜",
          "label": "星露谷物语官方中文维基：甜菜"
        },
        {
          "id": "wiki-oasis",
          "href": "https://zh.stardewvalleywiki.com/绿洲",
          "label": "星露谷物语官方中文维基：绿洲"
        },
        {
          "id": "wiki-desert",
          "href": "https://zh.stardewvalleywiki.com/沙漠",
          "label": "星露谷物语官方中文维基：沙漠"
        },
        {
          "id": "wiki-broccoli",
          "href": "https://zh.stardewvalleywiki.com/西蓝花",
          "label": "星露谷物语官方中文维基：西蓝花"
        },
        {
          "id": "wiki-broccoli-seed",
          "href": "https://zh.stardewvalleywiki.com/西蓝花种子",
          "label": "星露谷物语官方中文维基：西蓝花种子"
        },
        {
          "id": "wiki-rare-seed",
          "href": "https://zh.stardewvalleywiki.com/稀有种子",
          "label": "星露谷物语官方中文维基：稀有种子"
        },
        {
          "id": "wiki-sweet-gem",
          "href": "https://zh.stardewvalleywiki.com/宝石甜莓",
          "label": "星露谷物语官方中文维基：宝石甜莓"
        },
        {
          "id": "wiki-ancient",
          "href": "https://zh.stardewvalleywiki.com/上古水果",
          "label": "星露谷物语官方中文维基：上古水果"
        },
        {
          "id": "wiki-ancient-seed",
          "href": "https://zh.stardewvalleywiki.com/上古种子",
          "label": "星露谷物语官方中文维基：上古种子"
        },
        {
          "id": "wiki-corn",
          "href": "https://zh.stardewvalleywiki.com/玉米",
          "label": "星露谷物语官方中文维基：玉米"
        },
        {
          "id": "wiki-sunflower",
          "href": "https://zh.stardewvalleywiki.com/向日葵",
          "label": "星露谷物语官方中文维基：向日葵"
        },
        {
          "id": "wiki-sunflower-seed",
          "href": "https://zh.stardewvalleywiki.com/向日葵种子",
          "label": "星露谷物语官方中文维基：向日葵种子"
        },
        {
          "id": "wiki-cart",
          "href": "https://zh.stardewvalleywiki.com/旅行货车",
          "label": "星露谷物语官方中文维基：旅行货车"
        },
        {
          "id": "wiki-fair",
          "href": "https://zh.stardewvalleywiki.com/星露谷展览会",
          "label": "星露谷物语官方中文维基：星露谷展览会"
        },
        {
          "id": "wiki-bundles",
          "href": "https://zh.stardewvalleywiki.com/收集包",
          "label": "星露谷物语官方中文维基：收集包"
        },
        {
          "id": "wiki-fall-seeds",
          "href": "https://zh.stardewvalleywiki.com/秋季种子",
          "label": "星露谷物语官方中文维基：秋季种子"
        },
        {
          "id": "wiki-amaranth",
          "href": "https://zh.stardewvalleywiki.com/苋菜",
          "label": "星露谷物语官方中文维基：苋菜"
        },
        {
          "id": "wiki-eggplant",
          "href": "https://zh.stardewvalleywiki.com/茄子",
          "label": "星露谷物语官方中文维基：茄子"
        },
        {
          "id": "wiki-yam",
          "href": "https://zh.stardewvalleywiki.com/山药",
          "label": "星露谷物语官方中文维基：山药"
        },
        {
          "id": "wiki-bok-choy",
          "href": "https://zh.stardewvalleywiki.com/小白菜",
          "label": "星露谷物语官方中文维基：小白菜"
        },
        {
          "id": "wiki-wheat",
          "href": "https://zh.stardewvalleywiki.com/小麦",
          "label": "星露谷物语官方中文维基：小麦"
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
          "id": "site-money-zh",
          "href": "/zh/how-to-earn-money-stardew",
          "label": "本站：第一年怎么赚钱"
        },
        {
          "id": "site-greenhouse-zh",
          "href": "/zh/glasshouse-stardew-valley",
          "label": "本站：温室布局"
        },
        {
          "id": "site-sprinkler-zh",
          "href": "/zh/sprinkler-stardew",
          "label": "本站：洒水器"
        },
        {
          "id": "site-planner-zh",
          "href": "/zh#planner",
          "label": "本站：农场规划器"
        }
      ]
    },
    "faq": {
      "heading": "FAQ",
      "component": "BlogFaqList",
      "items": [
        {
          "question": "第一年秋天种什么？秋 1 皮埃尔默认卖哪些种子？",
          "answer": "第一年皮埃尔秋季货架没有洋蓟：茄子 20 金、玉米 150 金、南瓜 100 金、小白菜 50 金、山药 60 金、蔓越莓 240 金、向日葵 200 金、玫瑰仙子 200 金、苋菜 70 金、葡萄 60 金、小麦 10 金。营业 09:00–17:00，周三关门。甜菜、西蓝花、稀有种子、上古水果不在这份默认购物清单里。"
        },
        {
          "question": "宝石甜莓日均约 83.33，秋 1 能在皮埃尔或旅行货车当默认货买到吗？",
          "answer": "不能。皮埃尔和 Joja 不卖稀有种子。旅行货车特殊商品里的稀有种子只在春、夏以 1,000 金出现。秋冬特殊商品不是这粒。普通商品 1.26% 为 600–1,000 金、不限季节，不是货架。"
        },
        {
          "question": "蔓越莓日均约 18.89 把每次 10% 额外浆果算进去了吗？要收满 5 次必须哪天种？",
          "answer": "没有。18.89 按每次 2 个计价，10% 不进。生长天数 27。秋 1 种，收日 8、13、18、23、28。初级和高级肥料只作用每次第一个浆果。"
        },
        {
          "question": "南瓜和蔓越莓哪个更赚？能把一季总净利和日均合成「秋季最赚钱」吗？",
          "answer": "不能合成。同一口径下蔓越莓 ≈18.89，南瓜 16.92。选南瓜是因为巨大、两茬占格或交包，不是因为鲜卖日均更高。"
        },
        {
          "question": "秋 16 星露谷展览会能买南瓜或蔓越莓种子吗？",
          "answer": "不能。那天商店上锁。星露谷展览会不是蛋节那种种子摊。节日名是星露谷展览会。"
        },
        {
          "question": "规划器搜中文「南瓜」「蔓越莓」有条目吗？它能算秋季日均吗？",
          "answer": "没有。实测中文「南瓜」「蔓越莓」匹配 0 条。搜英文 Pumpkin、Cranberries、Giant Pumpkin。规划器不算金币、不浇水、不掷每天 1%。"
        }
      ]
    },
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "existingBodyLinks": [
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
          "href": "/zh/glasshouse-stardew-valley",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh/sprinkler-stardew",
          "className": "blog-planner-link"
        },
        {
          "href": "/zh#planner",
          "className": "blog-planner-link"
        }
      ],
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/fall-crops-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "页首封面，不能代替正文图",
      "altStatus": "pending_media",
      "altDirection": "描述实际封面画：秋季室外田与作物选择主题。禁止把日均、最晚播种或 3×3 数字写进封面。trimmed length ≥ 8。"
    },
    "figures": [
      {
        "id": "figure-1-fall-occupancy-calendar",
        "assemblyToken": "FIGURE1_CONTROLLED_DIAGRAM",
        "src": "/blog/illustrations/fall-crop-occupancy-calendar-zh.webp",
        "placement": "H2「同一套日均口径下的秋季作物比较」表后",
        "type": "可控绘图的秋季 28 天日历示意图。禁止用生成图冒充游戏截图、维基表或精确布局证据。",
        "compositionNote": "读者要看出：蔓越莓秋 1 种下占整季，收日 8/13/18/23/28 才可能满 5 次；南瓜单次 13 天，两茬推算秋 1→秋 14 收、当天再种→秋 27 收；只赶一茬最晚秋 15；漏浇后移。图注已写推算，不是维基字段。不要画斧头敲击。不要画春季花椰菜/草莓或夏季蓝莓/甜瓜。",
        "alt": "蔓越莓秋 1 种才可能满 5 次，收日 8、13、18、23、28；南瓜两茬推算秋 1 种、秋 14 收，当天再种、秋 27 收；只赶一茬最晚秋 15。漏浇则后移。这是日历示意图，不是游戏截图。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-2-fall-grape-walk",
        "assemblyToken": "FIGURE2_CONTROLLED_GRID",
        "src": "/blog/illustrations/fall-grape-walk-zh.webp",
        "placement": "H3「鲜卖、架子过道：葡萄」",
        "type": "精确格子示意图，可控绘图。禁止用生成图冒充游戏截图。",
        "compositionNote": "两行架子夹一条空路才能走到每一株；任意生长阶段不能从植株上走过去，枯了才能穿。必须能数格子。",
        "alt": "两行葡萄架子夹一条空路才能走到每一株；空路不是浪费，是收割资格。任意生长阶段不能从植株上走过去，枯了才能穿。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      },
      {
        "id": "figure-3-fall-pumpkin-3x3",
        "assemblyToken": "FIGURE3_CONTROLLED_GRID",
        "src": "/blog/illustrations/fall-pumpkin-3x3-zh.webp",
        "placement": "H2「巨大南瓜按 3×3 排，洒水器不要占九格」",
        "type": "精确格子示意图，可控绘图。禁止用生成图冒充游戏截图。",
        "compositionNote": "九格同种南瓜才有巨大资格；洒水器占一格则无资格；左上角须成熟且浇水；Giant Pumpkin 外观 ≠ 九格资格。不要在九格里画蔓越莓或葡萄。不要画斧头敲击次数。",
        "alt": "九格同种南瓜才有巨大资格；洒水器占一格则无资格；左上角须成熟且浇水；Giant Pumpkin 外观不等于九格资格。",
        "width": 1672,
        "height": 941,
        "loading": "lazy"
      }
    ],
    "doNotWritePageUntilTitleReviewPass": false
  },
  "integrity": {
    "bodyHash": "c514fd6e4f13e11f1efcf3879a814db43a89c5e0d61c3a2ed27731e54f85b4b6",
    "length": {
      "locale": "zh-CN",
      "mechanical_units": 5025,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "userReview": "not_started",
    "frozen": true,
    "status": "title_passed",
    "freezePublicBlogHandoff": true
  }
}
```
