# C-zh 写作交接（不是读者标题）

角色：Agent C-zh（只写作）。不执行 D 的三门，不签发通过，不用七罪写 Title / H1 / Description，不改 `src/` / `public/`。用户锁定 slug：`how-to-level-up-farming-stardew`。locale=`zh-CN`。输入：`A-zh-facts.md` / `A-zh-research.md`（核验日 2026-09-20）、`B-zh-layout.md`。读者正文从下一节起，到「编辑附录」之前。

耕种经验来自收获作物、照顾动物，以及阅读[星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)；[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)写明，使用锄头和喷壶不会获得耕种经验。五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点；经验值立即增加，升级弹窗要睡觉后才出现。银星、金星、铱星不加额外经验；一株一次收出多个产物，只给第一个。

当前等级在暂停菜单的技能列表里看。下面先分清哪些动作真的加耕种经验，再用单株点数和累计表估离 5 级、10 级还差多少，最后睡觉核对弹窗和配方。

## 哪些动作加耕种经验，哪些日常农活其实不加

把田浇完、锄完、种子都按下，技能条仍可能一格不动。不是游戏坏了，是这些动作本身就不给耕种经验。先用下面两栏对照今天下午做过的事，再去数株数。

### 会加：收获、照顾动物、读年历

[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)把来源写成这几类：收获农作物；爱抚动物；挤牛奶或羊奶；剪羊毛；在鸡舍或畜棚采集蛋、鸭毛、动物毛、兔子的脚；阅读星露谷年历或星之书。

作物这边，经验在**收获**时进账，不在把种子放进土里时进账。动物这边，抚摸、挤奶、剪毛、捡起鸡舍或畜棚里的动物产品，每次 5 点耕种经验。挤奶用的是挤奶桶。8 级才解锁的小桶是酿造设备，不能拿来挤奶。

书这边：[星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)写「阅读即可获得 250 点耕种经验」。耕种页把星之书和年历并列成来源。英文 [Farming](https://stardewvalleywiki.com/Farming) 把 Almanac 和 Book Of Stars 写成同一句 250 Farming XP。

两条例外要单独记。农场上由野生种子种出的作物，收获时是 3 点耕种经验加 2 点采集经验，不是把整株都算给耕种。猪找到的松露给采集经验，没有耕种经验；松露不要拿来估耕种缺口。

### 不加：锄地、浇水、种植本身、砍树

[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)写：「使用锄头和喷壶不会获得经验。」把格子锄出来、把水浇上、把种子点进土里，这三步本身都不加耕种经验。有的攻略把浇水和种植也写成能升级，按官方技能页，那两步推不动耕种条。

砍树加的是采集，不是耕种。你下午把一整片树砍光，耕种条不会因此往上走。

对照图把加和不加拆成两栏。指着自己刚做完的事看：收土豆、摸牛、挤奶、捡蛋、读年历，加；挥锄、浇水、下种、砍树、捡松露，不加。这是动作对照图，不是农场平面图，也不是技能菜单截图。

![一侧是收获作物、摸动物或挤奶剪毛捡蛋、读年历，这些加耕种经验；另一侧是锄地、浇水、把种子放进土里、砍树、捡松露，这些不加。这是动作对照示意图，不是游戏截图。](/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp)

开局常见的空转是：每天把眼前的田都浇完，以为喷壶次数能把耕种推上去。喷壶熟练度会随耕种等级涨，但浇水这一下经验是 0。这些格子真正进账的时点，是植株成熟后你把作物收起来。

## 一株收一次给多少：公式、品质、一次多收

同一场收获，不要按地上堆了多少个、也不要按银星金星自己加倍。[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)经验值段给出公式 `XP=||16*ln(0.018*PRICE + 1)||`，PRICE 是作物基础售价。品质星不加额外经验：普通、银星、金星、铱星，这一株的耕种经验相同。

现行规则下，用镰刀收割也给耕种经验。下面这张表摘自耕种页春、夏、秋表，只用来估「这场收获加了几点」，不是按季节把经验高的作物排成该种什么。若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)。

| 作物 | 单次耕种经验 | 估算时要注意 |
| --- | --- | --- |
| 咖啡豆 | 4 | 短周期，单次很低 |
| 防风草 | 8 | 下面株数表的基准作物 |
| 啤酒花 | 6 | 多次收，仍按每次 6 点估 |
| 土豆 | 14 | 额外产量只算第一个 |
| 草莓 | 18 | 按株估，不按果个数 |
| 蓝莓 | 10 | 只算第一个产物 |
| 花椰菜 | 23 | 0 到 1 级约 5 株 |
| 甜瓜 | 27 | 单次，按株计 |
| 杨桃 | 43 | 单次点数高，不表示这季该优先种它 |
| 蔓越莓 | 14 | 只算第一个产物 |
| 南瓜 | 31 | 单次，按株计 |
| 宝石甜莓 | 64 | 表上单次最高的一档，仍是一株一次 |

估算示例：今天下午收了 20 株防风草，按表是 20 × 8 = 160 点，立刻进经验条。若同一天还摸了 4 只鸡，再加 4 × 5 = 20 点。读过一本星露谷年历，再加 250 点。这三笔可以加在一起，去对照下一节的累计表。这是按维基单次点数做的算术，不是某份存档实测。

### 一次收多个为什么经验不翻倍

蓝莓、蔓越莓、土豆多结，地上会同时出现好几个。经验只给第一个产物，不多倍。蓝莓这一株是 10 点，不是 10 乘浆果数；蔓越莓这一株是 14 点，同样不按果个数翻。土豆主薯之外再掉出来的那些，不再另给一份 14 点。

草莓 18、南瓜 31 看起来比防风草 8 高，可蓝莓和蔓越莓这种一次多收的作物，不能按「收了一堆」去乘。估缺口时用上表单次点数，不要看篮子有多满。

示意图里同一株蓝莓掉出多个浆果，经验只记一笔 10 点。不要把果堆画成有多高经验就有多高。这是规则示意图，不是收获数字截图。

![同一株蓝莓一次收出多个浆果，耕种经验只记第一个，这一株是 10 点，不按浆果个数翻倍。这是规则示意图，不是游戏收获截图。](/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp)

## 到 5 级和 10 级要多少经验，中间会碰到哪些配方

[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)五系共用同一张表，5 级 2150 点，10 级一共 15000 点。10 级不是在 9 级之后再另要 15000。每升一级，锄头和喷壶熟练度 +1。

### 1 到 10 级累计经验（和只用防风草要收多少）

累计是从 0 加到这一级的总和。已经过了某一档，只用「下一档累计减去当前累计」估缺口，不要每次都从 0 重新乘。

| 目标等级 | 累计经验 | 只用防风草约需株数 |
| --- | --- | --- |
| 1 | 100 | 13 |
| 2 | 380 | 48 |
| 3 | 770 | 97 |
| 4 | 1300 | 163 |
| 5 | 2150 | 269 |
| 6 | 3300 | 413 |
| 7 | 4800 | 600 |
| 8 | 6900 | 863 |
| 9 | 10000 | 1250 |
| 10 | 15000 | 1875 |

防风草株数来自[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)「要种多少防风草」表，口径是只收防风草、每株 8 点。从 0 到 1 级约 13 个防风草、8 个土豆或 5 个花椰菜；从 0 到 2 级约 48 个防风草、28 个土豆或 17 个花椰菜。更往后的等级用防风草株数表，或用土豆 14 点、花椰菜 23 点去除累计差，表上没有把这两样收到 5 级、10 级的株数。

还在 0 级、这季只收防风草：大约 13 株过 1 级，48 株过 2 级，269 株过 5 级，1875 株过 10 级。若已经过了 2 级（累计 380），离 5 级还差 2150 − 380 = 1770 点；用一株防风草 8 点去除这个差，不要再拿 269 当剩余量。蓝莓按株计 10 点，不能把一株上的多个浆果加成 20 或 30 再去除。

对着下面这张梯子看 5 级 2150、8 级 6900、9 级 10000、10 级 15000，以及 2 / 4 / 5 / 6 / 8 / 9 级旁边的配方或弹窗名称。用它判断当前在哪一档、下一档是多少。

![耕种 1 到 10 级累计梯子，标出 5 级 2150、8 级 6900、9 级 10000、10 级 15000；2 级洒水器、4 级罐头瓶、5 级职业弹窗、6 级优质洒水器、8 级小桶、9 级种子生产器和铱制洒水器。这是等级示意图，不是技能菜单截图。](/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp)

### 2 / 4 / 5 / 6 / 8 / 9 级解锁什么

[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)技能表把门闩写在对应等级上。经验够了、睡过觉、当天结束并存过档，配方才到手。

| 等级 | 解锁 |
| --- | --- |
| 2 | 洒水器 |
| 4 | 罐头瓶 |
| 5 | 职业弹窗：畜牧人或农耕人 |
| 6 | 优质洒水器 |
| 8 | 小桶 |
| 9 | 种子生产器、铱制洒水器 |
| 10 | 第二职业：畜牧人接鸡舍大师或牧羊人，农耕人接工匠或农业学家 |

2 / 6 / 9 级配方到手后怎么摆，看[星露谷洒水器](/zh/sprinkler-stardew)。4 级罐头瓶、8 级小桶是加工门槛；这批货现在卖掉还是锁进机器，看[第一年怎么赚钱](/zh/how-to-earn-money-stardew)。小桶不是挤奶工具。

5 级官方名是畜牧人（畜产品 +20%）和农耕人（农作产品 +10%）。10 级被 5 级锁死：选了畜牧人，只在鸡舍大师和牧羊人里再选；选了农耕人，只在工匠和农业学家里再选。怎么选、20% 和 10% 乘的是哪一类货，看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。弹窗出现当晚先睡觉，白天技能栏里选不了。

## 经验已经加上了，为什么还没升级弹窗

收获或照顾的当下，经验条可以已经涨了，升级窗口仍要等到睡觉。[耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)写：经验值立即增加，升级在睡觉后结算。[技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)还写：每天第一次升级某技能会提示「你有些事情想在今天结束的时候考虑一下」；新解锁配方要当天结束、自动存档后才到手。不是经验要睡觉才入账。

收了一下午却看不到升级时，按这个顺序分流，不要先认定规则失效：

1. 今天下午做的是浇水、锄地、种植、砍树或捡松露：这些本来就不给耕种经验，技能条不会因它们而动。
2. 收的是蓝莓、土豆或蔓越莓，却按个数或品质星自己加倍：实际只记了第一个产物，累计可能还没到下一档。
3. 对照上一节累计表：5 级要 2150，10 级要 15000。经验条涨了但没过下一档，就不会弹。
4. 累计已经够了，还没睡觉：经验已经在，弹窗和配方要等当天结束。看到那句提示，先把今天该收的收完再睡，不要在白天技能栏里找职业按钮。

开局第一周把喷壶浇到没体力，晚上看不到耕种升级，多半停在第 1 条。蓝莓田收了满篮、只按「收了很多」估，却还在 4 级，多半停在第 2 或第 3 条。技能条已经顶到 5 级格、白天没有弹窗，走第 4 条。

今天先核三件事：这场动作加不加；对照累计表还差多少；睡觉后看弹窗和配方有没有到手。5 级若弹出畜牧人和农耕人，点[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)再选。

## FAQ

**浇水、锄地、把种子种下去，能升耕种吗？**

不能。锄头和喷壶本身不加耕种经验。作物经验在收获时给，不在浇水、锄地或下种时给。

**蓝莓、土豆、蔓越莓一次收一堆，经验会按个数翻倍吗？**

不会。一次收获多个产物，只给第一个。蓝莓一株 10 点，蔓越莓一株 14 点，都是单次，不按浆果数乘。

**耕种 5 级、10 级分别要多少经验？只用防风草要收多少？**

5 级累计 2150 点，约 269 株防风草；10 级累计 15000 点，约 1875 株防风草。这是从 0 收到这一级的总和。

**收获了很多为什么还不升级？**

先看这场动作加不加、有没有把蓝莓或蔓越莓按个数加倍，再对照累计表够不够下一档。经验是立刻加上的；升级弹窗和配方要睡觉、当天结束并存档后才出现。

**耕种 5 级选畜牧人还是农耕人？10 级选什么？**

5 级官方名是畜牧人和农耕人。选畜牧人，10 级只在鸡舍大师和牧羊人里再选；选农耕人，10 级只在工匠和农业学家里再选。详细对比看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)。

## 来源

2026-09-20 对照下方星露谷官方中文维基。经验规则以官方中文维基为准；年历 250 来自年历页；规划器不算耕种经验。作物单次经验摘自耕种页表，不是某份存档实测。

- [星露谷物语官方中文维基：耕种](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn)
- [星露谷物语官方中文维基：技能](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn)
- [星露谷物语官方中文维基：星露谷年历](https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn)
- [星露谷物语英文维基：Farming](https://stardewvalleywiki.com/Farming)
- [星露谷物语英文维基：Skills](https://stardewvalleywiki.com/Skills)
- [星露谷物语英文维基：Stardew Valley Almanac](https://stardewvalleywiki.com/Stardew_Valley_Almanac)
- [本站：农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)
- [本站：星露谷洒水器](/zh/sprinkler-stardew)
- [本站：第一年怎么赚钱](/zh/how-to-earn-money-stardew)
- [本站：春天种什么](/zh/best-spring-crop-stardew)
- [本站：夏天种什么](/zh/summer-crops-stardew)
- [本站：秋季作物](/zh/fall-crops-stardew)
- [本站：农场规划器（简体中文首页）](/zh)

## 编辑附录（不是读者正文）

C-zh 候选稿。未执行 D 三门，未签发通过，未写 Title / H1 / Description。未改 `src/` / `public/`。未把英文稿译成中文成稿。未读 C-en。图文件尚未绘制，正文已嵌入三处图位与图注；绘制说明见 `C-zh-figures.md`。

### PublicReference

定位用读者正文精确片段。occurrence 从 1 起，按本稿「读者正文」（角色头之后，到本附录标题之前）计数。引用 ID 不进入读者正文。

- id: `wiki-farming-zh`
  - label: 星露谷物语官方中文维基：耕种
  - url: https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn
  - appliesTo:
    - quote: "收获农作物；爱抚动物；挤牛奶或羊奶；剪羊毛；在鸡舍或畜棚采集蛋、鸭毛、动物毛、兔子的脚；阅读星露谷年历或星之书"
      occurrence: 1
    - quote: "抚摸、挤奶、剪毛、捡起鸡舍或畜棚里的动物产品，每次 5 点耕种经验"
      occurrence: 1
    - quote: "农场上由野生种子种出的作物，收获时是 3 点耕种经验加 2 点采集经验"
      occurrence: 1
    - quote: "猪找到的松露给采集经验，没有耕种经验"
      occurrence: 1
    - quote: "公式 `XP=||16*ln(0.018*PRICE + 1)||`，PRICE 是作物基础售价"
      occurrence: 1
    - quote: "品质星不加额外经验"
      occurrence: 1
    - quote: "蓝莓这一株是 10 点，不是 10 乘浆果数；蔓越莓这一株是 14 点"
      occurrence: 1
    - quote: "用镰刀收割也给耕种经验"
      occurrence: 1
    - quote: "从 0 到 1 级约 13 个防风草、8 个土豆或 5 个花椰菜；从 0 到 2 级约 48 个防风草、28 个土豆或 17 个花椰菜"
      occurrence: 1
    - quote: "经验值立即增加，升级在睡觉后结算"
      occurrence: 1

- id: `wiki-skills-zh`
  - label: 星露谷物语官方中文维基：技能
  - url: https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn
  - appliesTo:
    - quote: "使用锄头和喷壶不会获得耕种经验"
      occurrence: 1
    - quote: "五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点"
      occurrence: 1
    - quote: "使用锄头和喷壶不会获得经验。"
      occurrence: 1
    - quote: "每天第一次升级某技能会提示「你有些事情想在今天结束的时候考虑一下」"
      occurrence: 1
    - quote: "新解锁配方要当天结束、自动存档后才到手"
      occurrence: 1
    - quote: "每升一级，锄头和喷壶熟练度 +1"
      occurrence: 1

- id: `wiki-almanac-zh`
  - label: 星露谷物语官方中文维基：星露谷年历
  - url: https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn
  - appliesTo:
    - quote: "阅读即可获得 250 点耕种经验"
      occurrence: 1

- id: `wiki-farming-en`
  - label: Stardew Valley Wiki: Farming
  - url: https://stardewvalleywiki.com/Farming
  - appliesTo:
    - quote: "英文 [Farming](https://stardewvalleywiki.com/Farming) 把 Almanac 和 Book Of Stars 写成同一句 250 Farming XP"
      occurrence: 1

- id: `wiki-skills-en`
  - label: Stardew Valley Wiki: Skills
  - url: https://stardewvalleywiki.com/Skills
  - appliesTo:
    - quote: "五系技能同一张累计表：5 级 2150 点，10 级一共 15000 点"
      occurrence: 1

- id: `wiki-almanac-en`
  - label: Stardew Valley Wiki: Stardew Valley Almanac
  - url: https://stardewvalleywiki.com/Stardew_Valley_Almanac
  - appliesTo:
    - quote: "阅读即可获得 250 点耕种经验"
      occurrence: 1

- id: `site-rancher-zh`
  - label: 本站：农耕人还是畜牧人
  - url: https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew
  - appliesTo:
    - quote: "怎么选、20% 和 10% 乘的是哪一类货，看[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)"
      occurrence: 1
    - quote: "5 级若弹出畜牧人和农耕人，点[农耕人还是畜牧人](/zh/rancher-or-tiller-stardew)再选"
      occurrence: 1

- id: `site-sprinkler-zh`
  - label: 本站：星露谷洒水器
  - url: https://stardewvalleyplanner.art/zh/sprinkler-stardew
  - appliesTo:
    - quote: "2 / 6 / 9 级配方到手后怎么摆，看[星露谷洒水器](/zh/sprinkler-stardew)"
      occurrence: 1

- id: `site-money-zh`
  - label: 本站：第一年怎么赚钱
  - url: https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew
  - appliesTo:
    - quote: "4 级罐头瓶、8 级小桶是加工门槛；这批货现在卖掉还是锁进机器，看[第一年怎么赚钱](/zh/how-to-earn-money-stardew)"
      occurrence: 1

- id: `site-spring-zh`
  - label: 本站：春天种什么
  - url: https://stardewvalleyplanner.art/zh/best-spring-crop-stardew
  - appliesTo:
    - quote: "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)"
      occurrence: 1

- id: `site-summer-zh`
  - label: 本站：夏天种什么
  - url: https://stardewvalleyplanner.art/zh/summer-crops-stardew
  - appliesTo:
    - quote: "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)"
      occurrence: 1

- id: `site-fall-zh`
  - label: 本站：秋季作物
  - url: https://stardewvalleyplanner.art/zh/fall-crops-stardew
  - appliesTo:
    - quote: "若问的是春天、夏天、秋天哪种更赚钱，那是金币口径，看[春天种什么](/zh/best-spring-crop-stardew)、[夏天种什么](/zh/summer-crops-stardew)、[秋季作物](/zh/fall-crops-stardew)"
      occurrence: 1

- id: `site-home-zh`
  - label: 本站：农场规划器（简体中文首页）
  - url: https://stardewvalleyplanner.art/zh
  - appliesTo:
    - quote: "规划器不算耕种经验"
      occurrence: 1

未列入公开引用、数字不进事实：灰机「浇水/耕种可升级」、灰机 12 个防风草、灰机蓝莓 14 / 蔓越莓 19、灰机野生种子 0+7、灰机经验睡觉后才结算、TapTap「种植和收割都能提供经验」、百度经验「购买小桶挤奶」、biligame 野生种子 3+3 与「四舍五入」口径、Bilibili 逐帧 XP、查询 1 第 6/8/10 未打开正文。

### 图位说明

封面不能代替正文图。三张正文图均为可控绘图示意图，禁止冒充游戏技能栏截图、维基表或实测经验条。图中文字只许 A 已核验的动作名、作物名与 XP 数字。绘制约束见 `C-zh-figures.md`。

1. `/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp`  
   落在「不加：锄地、浇水、种植本身、砍树」。读者要能指着今天下午的动作说加或不加。

2. `/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp`  
   落在「一次收多个为什么经验不翻倍」。同一株多个产物，经验只记一次；蓝莓标 10。

3. `/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp`  
   落在累计表之后、解锁表之前。至少标 5=2150、8=6900、9=10000、10=15000，以及 2/4/5/6/8/9 门闩名称。

### 因未取得而拒绝写的点

- 中文「星之书」专页 250：专页未打开；正文只写耕种页把它和年历并列，点数只把 250 绑在年历页；英文 Farming 并列句标明对照。
- PAA：未取得，FAQ 只用 B 规定的 5 题。
- 查询 1 第 6、8、10 正文数字：未打开，不引用。
- Bilibili 逐帧作物 XP：未做。
- 向日葵 XP：中文页 14，代码未开，表中不列入。
- 土豆/花椰菜收到 5 级或 10 级的株数：A 只给 0→1、0→2，禁止用公式自推。
- 精确中国区 Google 前五：页脚无法确定位置，正文不声称。
- 游戏内存档收获计数或「我们测过」。
- 规划器经验计算器：已打开页未见；来源句写「规划器不算耕种经验」，正文不写「先打开规划器再升级」。
- 游戏补丁号 1.6.15：不写成维基页脚。镰刀句只保留现行规则给经验，不写版本史专节。
- 畜牧人/农耕人售价对照表、洒水器覆盖格、温室 10×12、季节日均金币总榜、全技能升级。
