# B-en layout task card: summer crops stardew

Role: Agent B-en (layout only). Not article body. Not Title / H1 / Description / slug. Not page assembly.  
Input: `docs/blog-ops/summer-crops-stardew/A-en-research.md` (research date 2026-09-13).  
Parallel pattern only: `src/blog/articles/best-spring-crop-stardew.en.tsx` (method: outdoor occupancy + wiki gold/day + access gates). Do not copy Spring facts, festival, strawberries, cauliflower, or that page’s H1.  
New article. Do not rewrite `/best-spring-crop-stardew`.

C writes English body from this card + A’s verified facts. These fields are editorial. Do not paste field names, “this is not that article,” SERP ranks, or factory process into reader-facing text (including H2/H3, tables, alt, captions, source labels).

Working H2/H3 below are editorial headings for C. F generates Title/H1 after lock. Do not run 七罪 here.

---

## 1. 主关键词、locale、country

| 项 | 值 |
|---|---|
| 主关键词 | **summer crops stardew** |
| locale | `en` |
| country | `US`（任务输入；A 取得的是 `hl=en&gl=us&pws=0` Google，页脚 New York NY） |
| 站点 | https://stardewvalleyplanner.art/ |
| 模式 | 新英文文。不占用 `best-spring-crop-stardew`。slug 由 F/G 定，B 不锁。 |
| 工作题（仅编辑定位） | Outdoor summer crop rank by wiki gold/day, gated by Year 1 / Oasis / Year 2 |

---

## 2. 主导搜索意图（已选定）

**选定 I2，确认 A 的推荐，不改写。**

读者要完成的事：在**同一套 gold 口径**下给户外 Summer 作物排序，并用 **Year 1 Pierre / Oasis Starfruit / Year 2 Red Cabbage** 作为**同一张排序表上的条件**，决定这一季每一格种什么。

不是 I1 纯名录（“夏天能种什么”）单独成篇；I1 的 Summer 表是完成本排序的**必需子问题**。  
不是 I3 单独的 Year 1 赚钱/浇水日程。  
不是 I4 Community Center Summer Crops Bundle 清单。  
不是 I5 keg / Pale Ale / 酒的加工排序。  
不是温室 10×12、Ginger Island 全年床。

H1/Title 不得写成温室布局、Year 1 今早金币循环、或 Community Center bundle。F 锁题时遵守同一边界。

### 搜索依据（只引用 A 已打开的 SERP，不编 PAA 答案）

A 打开的当地 SERP（2026-09-13，ego-browser，`html lang=en`）：

1. 主查询 `summer crops stardew`  
   `https://www.google.com/search?q=summer+crops+stardew&hl=en&gl=us&pws=0&num=10`  
   自然结果 #1 是 wiki Summer（I1 名录形态）。同页可见 related：`Best summer crops Stardew Valley`、`Summer crops Stardew Valley profit`、`Stardew Valley best summer crop year 1`、`Summer crops stardew year 2`、`Summer crops stardew year 1`。  
   可见 PAA **问题**（手风琴未展开，禁止把 AI Overview 当 PAA 答案）：  
   - What is the most profitable crop for summer in Stardew Valley?  
   - What are the best vegetables to grow in Stardew Valley during the summer?  
   - What are the summer crops in Stardew Valley?  
   - What is the most profitable crop to grow during the summer?

2. 相关查询 `best summer crops stardew valley`（同 locale 参数）  
   自然结果把 Reddit `Best summer crop?`、官方论坛 `Best Crops per season`、Chucklefish Year 1 帖、Shockbyte listicle 排在 wiki Summer 之前。  
   Related 再出现：`Stardew Valley best summer crop year 1`、`Stardew Valley best Summer crop year 2`、`Most profitable Summer crops Stardew Valley`。  
   PAA 问题含 `Which summer crop is most profitable?`。Query 2 另有 `How to make the most money in summer in Stardew Valley?` — 那是 I5/金币循环形态，**不收进本篇主意图或 FAQ**。

3. 已打开样本的形态  
   - R2 Reddit：有没有“一个 best”；评论拆 Starfruit（desert）vs Blueberries（no desert）vs Hops（Pale Ale）vs Melons。  
   - R4 论坛：Summer 的 “most profitable” 随 kegs/jars 与 Tiller 变；Lew Zealand 把 Starfruit（desert）、Red Cabbage（Year 2）、Blueberry、Melon（Year 1）放在同一比较里。  
   - R5 Shockbyte：ranked summer crops，并写 Year 1 vs Oasis；其表是 **season-total raw profit**，不是 wiki gold/day。  
   - R1 wiki Summer：提供同口径 gold/day 表，但未把 Year 1 / desert 写成种植计划。

**为何不选 I1 做主意图：** 主查询 wiki 第一，但 related 与 PAA 已把任务推进到 “best / most profitable / year 1 / year 2”。只做名录会重复 wiki，完不成“种哪个”。I1 表必须留下，作为排序材料。  
**为何不把 I3 升成主意图：** Year 1 是条件，不是整篇变成 Pierre-only 攻略。升成 I3 会与现页 `/how-to-earn-money-stardew` 的夏日金币/浇水任务撞车，也会丢掉 related 里的 Year 2 与 Oasis。  
**为何 I4/I5 不进 H1、不进独立 H2：** related 有 bundle；forums/Shockbyte 有 artisan。A 未打开 Keg/Jar 页；bundle 已有 wiki 清单。二者是别的 URL。

### 最强证据（给 C/E，不写进正文）

同一排序任务同时被 (a) ranking 查询的论坛+listicle 形态、(b) related 的 year 1 / year 2 / profit、(c) PAA 的 most profitable 问题、(d) 打开的 wiki gold/day 表 支撑。条件列必须进同一张表，否则会变成 Shockbyte 那种无门控排行，或 wiki 那种无名录计划。

---

## 3. ReaderTask

**已有条件**

- 在玩星露谷户外农场，季节是 Summer（28 天日历；春作物 Summer 1 枯死，见 A K1）。  
- 可能是 Year 1（Pierre 夏季柜台，沙漠巴士未修）或更晚（Oasis / Year 2 Pierre 有 Red Cabbage）。  
- 知道要“种最赚的”，但不一定知道 wiki gold/day 的假设，也不一定知道 hops 占路、melon 3×3 占九格。  
- 浇水工具以喷壶为主的 Year 1 玩家，或已有喷头的更晚存档。不要求先会用本站规划器。

**要完成的动作**

1. 用 **Crops 页 wiki gold/day**（无肥料、无 Tiller、无 Agriculturist；种植当日浇水；生长不含种植当日）给户外夏季作物排序。  
2. 在同一排序上读三道门：今早能不能在 Pierre 买到；巴士/Oasis 开了没有；是不是 Year 2 Red Cabbage。  
3. 用占用（regrow、trellis 挡路、melon giant 3×3、派生 last-plant）决定每一格实际种哪个，而不是只抄表头第一名。  
4. 喷壶能浇多少格，就买多少种子（约束，不重写金币循环）。

**完成标志**（验收用，不写成对读者的围栏句）

读者能指出：在无沙漠 Year 1，表上最高的户外 gold/day 不是 Starfruit；有 Oasis 时 Starfruit 的 wiki gold/day 口径是什么；Year 2 的 Red Cabbage 怎么进同一张表；蓝莓/甜瓜/啤酒花在同一块田上为何不能按同一占用假设并列第一。能读出 melon last-plant 16、starfruit last-plant 15 是派生数，不是 wiki 专有名词。不会把 Shockbyte 的 Starfruit 700g season-total 说成 wiki ≈26.92g/day。

**范围边界**（选材控制；禁止正文写“本文不讨论…”）

做：户外 Summer 作物排序；wiki gold/day 假设写在表注；Year 1 / Oasis / Year 2 门控；占用与派生 last-plant；hops 挡路 vs melon 3×3 vs blueberry 行；1.6 squash 的 0g 是公式输入不是 Pierre 标价；向现有春季文、金币文、温室文、喷头文做一句内链。

不做（不设独立 H2，不写进 H1）：

- Community Center / Summer Crops Bundle / Quality Crops / Dye 清单与奖励流程（I4）  
- Keg / Jar / dehydrator 产能、Pale Ale 酿造时间、酒的排序（I5；Keg 页未打开）  
- Year 1 今早买背包/铜喷壶/种子金循环（现页 `/how-to-earn-money-stardew`）  
- 温室 10×12、Ancient Fruit 终局酒、Ginger Island 全年床（现页 `/glasshouse-stardew-valley`）  
- 春季草莓/花椰菜/Egg Festival（现页 `/best-spring-crop-stardew`）  
- SVE、Joja 夏季种子价（Pierre 表第二列是 Out of season，A 未打开 JojaMart）  
- 规划器计算 gold/day、last-plant、giant 1%（工具做不到）

Bundle 四件（Tomato, Hot Pepper, Blueberry, Melon）最多在点名这些作物时作同位语，不展开奖励。Hops 的 Pale Ale **卖价**可用 Hops infobox artisan base 300g（A K7）；不得写 keg 时长或“加工后 hops 超过 blueberry”的排序，除非未来 A 打开 Keg 页并改布局。

---

## 4. 文章类型

**对比 / 选型**（不是教程）。

信息顺序按质量门选型表：

1. 选型条件（年、商店门、浇水格、gold/day 口径）  
2. 同条件比较（一张表：gold/day + 种子来源）  
3. 分场景选择（Year 1 无沙漠；Oasis 已开；Year 2 Red Cabbage；同一床上的占用分叉）  
4. 不适用（Sunflower 负 gold/day；Corn 只算夏季很差；Squash 不能当 Pierre 田；Ancient Fruit 不是当季户外收成）

不要写成“准备种子 → 锄地 → 浇水 → 收获”教程。春季文的方法（占用 + 门控 + 表）可平行；春季作物与节日不可平行复制。

---

## 5. 必需子问题（删节测试）

只留删掉后主任务完不成的项。Related / PAA / 竞品目录不是必须全覆盖的清单。

| 子问题 | 落点 | 删掉？ |
|---|---|---|
| 用哪一套 gold 口径？无肥料、无 Tiller；不是 Shockbyte 整季毛利。Starfruit wiki ≈26.92 与 2×(750−400)=700 不是同一指标（A A4）。 | 开篇 + H2-1 表注 | 不能删 |
| 夏天能种哪些（I1 表），以及每行的种子价、生长/再生、max harvests、wiki gold/day？ | H2-2 表 | 不能删（I1 作为排序材料） |
| 今早谁卖：Pierre Year 1 清单 vs Oasis Starfruit 400g vs Pierre Year 2 Red Cabbage vs Squash 不以金价卖？ | 同一张表的来源列 + H2-1 | 不能删 |
| 无沙漠 Year 1：Blueberry 20.8 vs Melon 14.17 vs Hops 13.52 原始 gold/day，以及占用分叉？ | H2-3 | 不能删 |
| 巴士修好后 Starfruit：Oasis 400g、13 天、last-plant 15、Vault 42500g 或 Joja 巴士 40000g、车票 500g？ | H2-4 | 不能删 |
| Year 2 Red Cabbage：Pierre 100g、9 天、≈17.78g/day，如何进同一张表？ | H2-4 | 不能删 |
| 派生 last-plant（单收作物 A1）与 Summer 1 蓝莓/啤酒花日历（A2/A3），以免 Fall 1 枯死？ | H2-2 或 H2-5 表 | 不能删 |
| 同一床：hops trellis 挡走、melon 3×3 giant（左上成熟且浇水、九格同种）、blueberry 行，三者如何抢格？ | H2-3 + 图 2 | 不能删 |
| 喷壶格数限制买种数量（只作约束，不写金币循环）？ | H2-1 一句 + 内链金币文 | 不能删（否则 Year 1 场景不可执行） |
| 哪些看起来像“夏日作物”但不该当默认户外第一：Sunflower −15g、Corn 夏季-only ≈1.92、Squash 0g 公式、Coffee 来源不定、Ancient Fruit 28 天跨季？ | H2-5 | 不能删 |

**明确不收为子问题 / 不设节**

- Summer Crops Bundle 步骤与 Quality Sprinkler 奖励流程  
- “How to make the most money in summer” 的 keg/酒数学  
- 温室/岛上全年床怎么排  
- 规划器逐步点击教程  
- Joja 种子价、PAA 手风琴答案、未打开的 GameRant / Out of Games / Steam 帖 / Stardew Profits

---

## 6. H2/H3 计划（工作标题，不是最终 Title/H1）

开篇无 H2。前三句必须落到选型答案：没有单一 best outdoor summer crop；Starfruit 要 Oasis；Year 1 Pierre 是 blueberry / melon / hops 的占用选择；Year 2 把 Red Cabbage 放进同一张 gold/day 表。第三句指向表：先看你今早能买什么，再看 wiki gold/day。禁止科技腔、禁止 SERP 日志、禁止先卖焦虑。B 不写这三句正文。

### H2-1. Best outdoor summer crop depends on year, the shop you can open, and the tiles you can water

回答选型条件。

- Year 1 Summer 1 = Pierre 夏季柜台（A K4）。Starfruit 不在 Pierre/Joja（A K8/K9）。Red Cabbage 是 Pierre Year 2+，Year 1 只有 Traveling Cart / Skull Cavern 等旁路（A K13），不要写成 Year 1 默认田。  
- Oasis：Sandy 9am–11:50pm；Starfruit Seeds **400g**（优先引 Starfruit Seeds 页，Oasis 页脚较旧，A 缺口 9）。巴士未修则进不了沙漠：Vault 四金包 42,500g **或** Joja Bus Repair 40,000g；车票 500g，Pam 10am–5pm（A K11/K12）。Year 1 Starfruit 是**通路**问题，不是 Pierre 忘了进货。  
- 浇水格是 Year 1 种植上限。一句内链 `/how-to-earn-money-stardew`。不要重讲背包、铜喷壶、今早花销。  
- Wiki gold/day 来自 Crops 页公式与假设（A 文首 gold/day 段 + K2/K3）。生长不含种植当日；当天未浇水不长也不死。Blueberry 的 3 颗已计入 Summer 表 `50g (x3)`；番茄 5%、辣椒 3%、蓝莓额外 2% **不得**再加进 gold/day（A 缺口 10）。  
- 禁止把 Shockbyte 整季毛利与 wiki gold/day 写在同一句里当同一排名。

本 H2 不要大表；条件讲清后立刻让读者进入 H2-2 的表。

### H2-2. Rank the outdoor summer field on one gold/day table, with access on the same rows

I1 名录 + I2 排序。一张表，不要拆成“能种什么”和“什么最赚”两张重复表。

表列（C 落实，数字只许用 A K2/K3/K4 及对应作物页）：

| Crop | Seed source and price | Grow / regrow | Wiki max harvests (no fertilizer, no Agriculturist) | Wiki gold/day (no fertilizer, no Tiller) | Access / occupancy |
|---|---|---|---|---|---|

行（Summer wiki 单收 + 多收，按 gold/day 降序便于选型，不要按 wiki 原表字母序凑目录）：

- Starfruit — Oasis 400g / 13d / max 2 / ≈26.92g — 巴士+Oasis  
- Blueberry — Pierre 80g / 13 then 4 / max 4 / 20.8g — Year 1 柜台；A2：夏 1 种则 14/18/22/26  
- Red Cabbage — Pierre 100g Year 2+ / 9d / max 3 / ≈17.78g  
- Melon — Pierre 80g / 12d / max 2 / ≈14.17g — giant 候选  
- Hops — Pierre 60g trellis / 11 then 1 / max 17 / ≈13.52g — 活着不能穿行；A3：夏 1 种则第 12 天首收、17 次  
- Summer Squash — 公式种子 0g / 6 then 3 / max 8 / ≈13.33g — **不以金价在 Pierre/Joja/cart 出售**（A K24）  
- Hot Pepper — Pierre 40g / 5 then 3 / max 8 / ≈10.77g  
- Tomato — Pierre 50g / 11 then 4 / max 5 / ≈9.26g  
- Radish — Pierre 40g / 6d / max 4 / ≈8.33g  
- Corn — Pierre 150g / 14 then 4 / Summer 4 或两季 11 / 夏季-only ≈1.92g，两季 ≈7.41g — 夏 28 种可进秋（A K14）  
- Poppy — Pierre 100g / 7d / max 3 / ≈5.71g  
- Summer Spangle — Pierre 50g / 8d / max 3 / 5g  
- Wheat — Pierre 10g / 4d / Summer 6 或两季 13 / 3.75g  
- Sunflower — Pierre 200g / 8d / 夏 3 或夏+秋 6 / **−15g**  
- Coffee Bean — 来源不是 Pierre 夏柜台；gold/day 随来源变（K3）；Traveling Cart 特价 2,500g 与 100–1,000g 标准价不可混（K23）

表注必须写清：Crops 页假设；max harvests 无肥料无 Agriculturist；Squash 0g 不是商店标价；Starfruit 的 ≈26.92 是单周期 `(750−400)/13`，不是整季利润。

表下用三个问题读表（平行春季文方法，不抄春季作物）：今早买得到吗？种植当日和之后浇得到吗？这格在你还想种第二茬甜瓜 / 留 3×3 / 收 hops 的那个早晨是否仍被占用？

派生 last-plant 可作第二张小表（单收用 A1：Wheat 24、Radish 22、Poppy 21、Sunflower 20、Red Cabbage 19、Melon 16、Starfruit 15）。Wiki **没有** “last plant day” 这个专名；正文必须标 derived：`28 − grow days`，收在 Summer 28，不含种植日，无 Speed-Gro，种植日已浇水。其他作物若用同一公式，同样标 derived。Blueberry/Hops 的“夏 1 种满 max harvests”用 A2/A3，不要另编未核验的“四收最晚种植日”除非用公开公式当场写出算术。

图 1 放在本 H2：占用日历（见下）。

### H2-3. Year 1 with no desert: blueberries, melons, and hops on different tiles

分场景：related 与 forums 的 Year 1 / no desert 条件。

- **H3. Blueberries occupy the tile through the late-month picks**  
  Pierre 80g；13 天然后每 4 天；3 颗；卖 50/62/75/100g；肥料品质只作用于第一颗（K5）。夏 1 种、每日浇、无加速：14/18/22/26 共 4 次（A2）。Wiki gold/day 20.8g。这是无沙漠 Year 1 表上最高的 Pierre 户外数字。低维护多收是 forums/Shockbyte 的说法；本篇用占用+gold/day 支撑，不编 PAA 答案。

- **H3. Melons are a 12-day crop and the summer giant**  
  Pierre 80g；12 天；250/312/375/500g；五种 giant 之一（K6）。Wiki ≈14.17g；max 2。派生 last-plant 16。Giant：3×3；每晨每个重叠 3×3 1%；**左上**已成熟且浇水且九格同种；15–21 普通品质；三斧；温室/花盆/姜岛不能形成；giant 换季不枯（Crops 页，与春季方法相同，作物换成 Melon）。占九格直到你收或砍。Quality Sprinkler 若占中心格，该格不是甜瓜 — 只写这一句占用，喷头档位内链 `/sprinkler-stardew`，不要重写 4/8/24 覆盖教程。

- **H3. Hops pay 17 picks and block walking**  
  Pierre 60g；11 天然后每天；活着任何阶段不能穿行（K7）。夏 1 种：第 12 天首收，收到 28，17 次（A3）。原始 wiki gold/day ≈13.52g，**低于**蓝莓。Infobox artisan Pale Ale base 300g（Artisan 420g）可作一句：加工是另一比较，本表不排酒。禁止 keg 时长、禁止“有桶 hops 就是第一”。布局：单行或双行+走道，不要围住 melon 3×3 或挡住斧路。

本 H2 结尾给出可执行分叉（列表，不是新 H2）：喷壶 Year 1 无沙漠 — 多数格蓝莓；你愿意连续浇九格并接受占用 — 一块 melon 3×3；有走道且接受 trellis — hops 一行。不要写成 Community Center 清单。

### H2-4. After the bus, and in Year 2: Starfruit and Red Cabbage join the same ranking

- **H3. Starfruit at Oasis, 400g a seed**  
  13 天；750/937/1125/1500g；wiki ≈26.92g 为表上最高户外 gold/day（K2/K8）。种子：Oasis 400g；Cart 600–1,000g；Gunther 捐 15 个给一粒；Seed Maker；Skull 宝箱 5–20（K9）。Luau 一颗 3,000g 是旁注，不另开节。派生 last-plant 15。没有巴士就不要把 Starfruit 写进 Year 1 默认购物单。

- **H3. Red Cabbage is a Year 2 Pierre seed**  
  9 天；260g；≈17.78g；介于蓝莓与甜瓜之间（K2/K13）。Year 1 默认田不写它。Dye Bundle 身份最多同位语，不写 Shockbyte “保证 Year 1 社区中心” — A 未核验。

场景收束：巴士已开且浇得起 13 天 — Starfruit 在**同一口径**下排第一；Year 2 无沙漠 — Red Cabbage 进入 Pierre 表，仍低于蓝莓的 20.8g；两者都不能取消 hops 挡路或 melon 九格占用。

### H2-5. Last plant days, and crops that lose the outdoor rank

不适用情况 + last-plant 执行检查。

- 单收 A1 表；晚于 melon 16 / starfruit 15 买到的种子，会在 Fall 1 以未完成阶段枯死（春作物 Summer 1 枯的同一规则，季节换成秋）。  
- Sunflower wiki gold/day 为负，因为种子 200g（K20）。  
- Corn 只算夏季 ≈1.92g；夏+秋 ≈7.41g；夏 28 种可进秋并保留脚下肥料（K14）。不要把它当夏季 gold/day 赢家。  
- Summer Squash 13.33g 看起来接近 hops，但种子不以金价卖（K24）。  
- Coffee：春+夏；春已种的咖啡夏 1 不枯，占住你本想改种夏作物的格（K23）。不要把 2,500g 特价写成 Year 1 默认。  
- Ancient Fruit：28 天然后每 7 天；夏 1 种则下一季第 1 天才首收（K21）。一句内链 `/glasshouse-stardew-valley`。不要开温室布局节。  
- Wheat / Radish / Poppy / Spangle / Pepper / Tomato 留在 H2-2 表里供对照；本 H2 只处理“为什么它们不是排序第一”和 last-plant，不写礼物/蜂房/油的新任务。Poppy 蜂房蜜 380g vs 普通蜜 100g（K19）若写，只作一句，不改主排序。

### H2-6. Put hops, a melon 3-by-3, and blueberry rows on one bed without sharing walking tiles

空间关系，服务占用选型，不是规划器教程，不是喷头专文。

读者必须能在图上指出：hops 行 + 走道；九格 melon（左上要浇）；蓝莓矩形不与九格重叠；机器/稻草人格不是甜瓜格。

可选用有序列表（锄 3×3、九格全 melon、hops 不围九格、蓝莓在能走到的矩形）。不要加“打开规划器第一步…”作为主步骤。规划器若出现，只在本 H2 末可选一句（见工具关联）。

**不要设的 H2**

- Sketch the summer bed in the planner（春季文有；本意图没有“用规划器”需求）  
- Summer Crops Bundle  
- Pale Ale / wine math  
- Greenhouse / Ginger Island layout  
- How to earn gold this morning  
- FAQ 不是必需 H2。若 C 加 FAQ：只许用正文已有事实回答与 I2 同任务的问题（most profitable under conditions；desert 没有时谁第一；melon/starfruit last-plant 是派生）。不要把 Query 2 的 “How to make the most money in summer” 做成 FAQ 去展开 I5。F 锁后才处理 FAQ 模块；B 不写答案正文。

**内链（自然一句，现有 URL only）**

- `/best-spring-crop-stardew` 上一季户外占用  
- `/how-to-earn-money-stardew` 喷壶/金币约束  
- `/glasshouse-stardew-valley` 全年床 / Ancient Fruit  
- `/sprinkler-stardew` 喷头占格  
- `/` 或 `/#planner` 仅当工具关联那一句  
- 作物数字链到 A 已打开的 wiki 页（Summer、Crops、各作物、Pierre Summer Stock、Oasis/Starfruit Seeds、Desert/Bus、Bundles 仅当同位语需要）

---

## 7. 图文位置

封面不算正文图文完成。精确布局必须是**可控绘图**（格子示意图），禁止生成式“截图”冒充游戏画面或规划器界面。表格承担精确数字；图承担日历占用与空间走位。

| ID | 读者必须看见什么 | 类型 | 事实来源（A） | 落点 | 图注职责 |
|---|---|---|---|---|---|
| Cover | 户外夏季田：可辨认的蓝莓行、甜瓜块、啤酒花架，不是温室、不是社区中心板。不在封面写最终 Title。 | 封面图；可控插画或授权素材。不是游戏假截图。 | 选题识别，不承载精确数字 | 页首 LCP（G 装配） | alt 描述画面，不堆关键词 |
| Fig 1 | 一张 Summer 1–28 日历：蓝莓收 14/18/22/26；hops 第 12 天首收后每日直到 28（17 次）；melon 12 天、派生 last-plant 16；starfruit 13 天、派生 last-plant 15。读者能读出“哪天这格仍被占用”。 | **示意图 / 日历格**（可控绘图）。不是截图。 | A2、A3、A1、K2、K3、K5、K7；日历 1–28 来自 wiki 季节表 | H2-2 表之后、读表三问附近 | caption 写清：夏 1 种、每日浇、无 Speed-Gro；last-plant 为派生 |
| Fig 2 | 同一块床的格子图：北或一侧 **hops 一行 + 至少一格走道**；一块 **melon 3×3**，左上格可识别；一块 **blueberry 矩形** 不与九格重叠；九格内无喷头/稻草人。读者能判断走不到的 hops 围栏是错的。 | **示意网格**（可控绘图，格可数）。不是生成式截图，也不是未核验的规划器截图。 | K7 挡路；Crops giant 规则 + K6 Melon；K5 蓝莓非 trellis；九格必须同种 | H2-3 分叉之后，H2-6 主解释 | caption：占用图，不是 1% giant 已触发；规划器若未验证 hops 挡路，不要写“工具里不能穿过” |

**表（不是图，但与图一起完成主任务）**

| 表 | 读者用途 | 来源 | 落点 |
|---|---|---|---|
| 主排序表 | 同口径比较 + 门控 | K2–K4、K8–K10、K13、K23–K24 | H2-2 |
| 派生 last-plant 小表 | 单收最晚种植日 | A1 + 公式声明 | H2-2 或 H2-5 |

不需要的图：社区中心板、keg 流程图、温室 10×12、巴士修理金币循环、规划器 UI 截图（A 未练 palette，缺口 12）。

工作文件名（G 绑定，slug 未锁）：

- `public/blog/illustrations/summer-crop-occupancy-calendar.webp`  
- `public/blog/illustrations/summer-hops-melon-blueberry-bed.webp`  
- 封面 `public/blog/{slug}-cover.webp`

图中文字只许用已核验名与数。不要在图里写 Shockbyte 700g。

---

## 8. 工具关联（独立字段）

**弱可选，不是主意图，不设 H2。**

搜索意图是户外夏季作物排序，不是“用规划器种夏天”。不得为了产品把规划器需求并进 I2。

| 项 | 值 |
|---|---|
| 是否必需 | 否。示意图 Fig 2 已能完成占用判断。 |
| 自然位置 | 仅 H2-6 末可选一句：若要按自己的农场地图摆同一 3×3 与 hops 行，可打开首页并把季节切到 Summer。 |
| 已核验工具事实 | T1：8 种农场 + 姜岛；可摆建筑/作物；季节含夏；喷头/稻草人覆盖；项目留在浏览器。**不算** gold/day、last-plant、giant 1%。 |
| 禁止声称 | 规划器替你排序；规划器模拟生长/浇水/巴士；规划器里 hops 挡行走（未验证）。 |
| 若写进正文 | 链 `/` 或 `/#planner`；English 目录名未在本次 A 会话点开 palette — 不要列出未核验的 catalog id。需要规划器截图或 “hops is a walk-block in the tool” → **退A**，不要用春季文或源码脑补。 |

默认交付可以没有规划器段。空工具关联合格。

---

## 9. 可核对信息增益（对 A 已打开样本，不是“比前五更全”）

打开样本已有：wiki 全表+gold/day；“有沙漠 Starfruit 否则蓝莓”；hops-if-kegs；Year 1 论坛配种；Shockbyte **整季毛利**排行。

| 增益 | 材料落点 | 依据 | 读者如何用 |
|---|---|---|---|
| 占用不是排行榜：第二茬甜瓜、giant 九格、hops 走道会改谁该种 | H2-3、H2-6、Fig 1–2 | Crops trellis/giant；A2/A3 日历 | 在图上指出冲突格再买种 |
| 门控与 gold/day 同一张表：Pierre Year 1 / Oasis 400g+巴士 / Year 2 卷心菜 / squash 不以金价卖 | H2-2 表 Access 列 | K4、K9–K13、K24 | 今早买不到的行不能当默认第一 |
| 表注钉死 wiki 假设，拆开 Shockbyte 700g vs wiki ≈26.92 | H2-1、H2-2 表注 | A4 vs K2 | 不把两种指标合成一个“最赚” |
| 派生 last-plant（melon 16、starfruit 15 等） | H2-2/H2-5 小表 | A1；wiki 未命名 | 晚买的种子不在 Fall 1 枯成未完成阶段 |
| 喷壶格数当 Year 1 株数上限 | H2-1 一句 | 金币文已有道德；本篇当约束 | 不把排行第一买到浇不到的格 |

不是本篇增益（留给别的 URL）：keg 吞吐、Pantry 全流程、温室 10×12、Ancient Fruit 酒、SVE。

---

## 10. 关键公开来源（仅 A 已打开且本布局会用到的）

核验日 2026-09-13。C 的主张必须能点回这些页；不要用未打开的 GameRant、Out of Games、Steam、Stardew Profits、Keg、JojaMart、Scarecrow 专页。

| 用途 | URL |
|---|---|
| 季节表、gold/day 行、春作物 Summer 1 枯 | https://stardewvalleywiki.com/Summer |
| gold/day 公式与假设、trellis、giant 1% 左上 | https://stardewvalleywiki.com/Crops |
| Pierre 夏季柜台与 Year 2 卷心菜 | https://stardewvalleywiki.com/Pierre%27s_General_Store |
| 各作物页 | https://stardewvalleywiki.com/Blueberry · Melon · Hops · Starfruit · Red_Cabbage · Corn · Tomato · Hot_Pepper · Radish · Wheat · Poppy · Sunflower · Ancient_Fruit · Coffee_Bean · Summer_Squash · Summer_Squash_Seeds |
| Starfruit 种子 400g（优于较旧 Oasis 页脚） | https://stardewvalleywiki.com/Starfruit_Seeds |
| Oasis 营业与固定货（Starfruit 价仍以 Seeds 页为准） | https://stardewvalleywiki.com/Oasis |
| 沙漠锁、巴士、车票 | https://stardewvalleywiki.com/The_Desert · https://stardewvalleywiki.com/Bus_Stop |
| Vault 42,500g | https://stardewvalleywiki.com/Bundles |
| 本站规划器能力边界 | https://stardewvalleyplanner.art/ |

Shockbyte、Reddit、Chucklefish、官方论坛是 **SERP 形态证据**，不是数字来源。正文不要把论坛卖价（如 2019 melon 230g）当现行事实。

站内冲突页（只内链，不改写）：`/best-spring-crop-stardew`、`/how-to-earn-money-stardew`、`/glasshouse-stardew-valley`、`/sprinkler-stardew`。

---

## 11. C 写作约束（给 C，不是读者文案）

- 选型文：条件 → 同表比较 → 场景 → 不适用。开篇三句内给条件化答案。  
- 数字只来自第 10 节来源与 A 事实表。派生 last-plant 必须标 derived。  
- 禁止复制春季文的草莓、Egg Festival、花椰菜、土豆、防风草情节。  
- 禁止 Joja 夏季价、keg 时长、未展开的 PAA 答案、Shockbyte 700g 当 wiki gold/day。  
- 禁止 silent fail：缺数就不要写该主张，退回第 12 节，不要用记忆补。  
- 稻草人 15 株/17×17 范围：**本次 A 未打开 Scarecrow 页**。不要抄春季文那段数字。只需：占格的稻草人/喷头不是甜瓜格（giant 九格同种）。  
- 长度门槛 2000 英文词由 F 计；只在 I2 内写判断、表、占用例子，不要靠 I4/I5 凑字。  
- 不要输出 Title/H1/slug/FAQ 定稿。

---

## 12. 退A补查（布局需要但 A 没有的事实；B 不编）

本卡**可以**在不补查的情况下让 C 写完 I2：数字与门控已在 A 事实表。下列项只有在 C/G 想写它们时才阻塞。

| ID | 缺口 | 为何可能需要 | 本卡怎么处理 | 若要写进正文，A 必须打开 |
|---|---|---|---|---|
| G1 | 规划器目录作物名、hops 在工具里是否挡走 | 规划器截图或“工具里不能穿过 hops” | 不要求规划器图；Fig 2 用 wiki 挡路做示意格 | 应用内 palette / 实际摆 hops |
| G2 | Keg / Jar 加工时间与公式 | forums 把 hops+Pale Ale 排到蓝莓之上 | 本篇不排加工；只允许 Hops infobox 300g 一句 | Keg、Preserves Jar 页 |
| G3 | Scarecrow 15 株与范围数字 | 春季文有；夏床图若写稻草人覆盖 | 不写 15/范围；只写占格 | Scarecrow wiki |
| G4 | JojaMart 夏季种子价 | Pierre 表第二列不是 Joja | 只用 Pierre in-season | JojaMart 页 |
| G5 | Quality Sprinkler 覆盖与中心占格的专页数字 | melon 3×3 vs 喷头 | 只写机器格不是作物；细节内链喷头文 | 若要写 8 格覆盖等，核 Sprinkler 页或现喷头文已锁事实 |
| G6 | PAA 手风琴答案 | 不可当读者问答来源 | 只用可见**问题**判断意图 | 若要用 Google 答案文本，须实际展开 |
| G7 | GameRant / Out of Games / Steam Year 1 帖 / Stardew Profits | 在 SERP 未打开 | 不引用其数字或结构 | 对应 URL |
| G8 | Shockbyte “Year 1 CC 保证卷心菜” | 未在 wiki 见到 | 不写 | Red Cabbage / Bundles 能支撑的句子 |
| G9 | Island Trader 库存 | 岛上不是本意图 | 不写 | Island Trader 页 |

**不退A、C 不得发明的：** 把 I4/I5/温室写进 H1；把季节毛利与 wiki gold/day 混成一个第一名；给规划器加 gold 计算。

---

## 13. 交 C 清单

1. 读本卡 + `A-en-research.md` 事实表。  
2. 写英文正文：开篇 + H2-1…H2-6 + 两张表 + Fig 1–2 的实质 figcaption（锁前入稿）。  
3. 公开引用绑到具体主张。  
4. 不写 Title/H1；不改 `src/` / `public/`。  
5. 缺 G1–G9 中要使用的事实 → 停，退A，不要用记忆补。
