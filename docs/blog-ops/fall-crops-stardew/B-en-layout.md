# B-en layout task card: fall-crops-stardew

Role: Agent B-en (layout only). Not article body. Not Title / H1 / Description. Not page assembly. Not 七罪.  
Does not rewrite A’s facts. Does not invent numbers A marked 未取得.  
Input: `docs/blog-ops/fall-crops-stardew/A-en-research.md` (research date 2026-09-14).  
Parallel METHOD only: `src/blog/articles/best-spring-crop-stardew.en.tsx` and `summer-crops-stardew.en.tsx` (outdoor occupancy + wiki gold/day + access on the same table). Do not copy Spring/Summer facts, festivals, Starfruit, Red Cabbage, or those pages’ H1s.  
New article. Do not rewrite `/best-spring-crop-stardew` or `/summer-crops-stardew`.

C writes English body from this card + A’s verified facts. These fields are editorial. Do not paste field names, “this is not that article,” SERP ranks, factory process, or 未取得 lists into reader-facing text (including H2/H3, tables, alt, captions, source labels, FAQ).

Working H2/H3 below are editorial headings for C. F generates Title/H1/Description after lock. Do not run 七罪 here.

User-locked slug (record; do not invent another): **`fall-crops-stardew`**.

User decided the finished article has a visible FAQ + 文末来源. JSON-LD stays **Article** (or the project’s Article/BlogPosting), **not FAQPage**.

---

## 1. 主关键词、locale、country、slug

| 项 | 值 |
|---|---|
| 主关键词 | **stardew fall crops** |
| locale | `en` |
| country | `US`（任务输入；A 取得的是 `hl=en&gl=us&pws=0&num=10` Google，页脚 New York / New York NY，Results are not personalized） |
| 站点 | https://stardewvalleyplanner.art/ |
| 模式 | 新英文文。不占用 `best-spring-crop-stardew` 或 `summer-crops-stardew`。 |
| **User-locked slug** | **`fall-crops-stardew`**（A 记录 live URL 404；不在 `blogPostSlugs`。B 不另造 slug。） |
| 工作题（仅编辑定位） | Outdoor fall crop rank by wiki gold/day, with Year 1 Pierre / Oasis beet / Year 2 artichoke / cart Rare Seed as conditions on the same table |

---

## 2. 主导搜索意图（已选定）

**选定 I2，确认 A 的推荐，不改写。**

读者要完成的事：在**同一套 wiki gold/day 口径**下给户外 **Fall** 作物排序，并把 **Year 1 Pierre / Oasis beet / Year 2 artichoke / Traveling Cart Rare Seed** 写成**同一张排序表上的条件**，再按占用决定这一季每一格种什么。

I1 的 Fall 表是完成本排序的**必需子问题**，不是单独成篇的名录。  
I3 的 Year 1 Pierre 通路是条件，不是整篇变成「Year 1 今早金币/浇水攻略」。  
不是 I4 Fall Crops Bundle 清单。  
不是 I5 keg/jar（pumpkin juice vs cranberry processing）。  
不是温室 Ancient Fruit 全年床、SVE 作物、冬季作物、「how to earn money this morning」。

H1/Title 不得写成 Bundle walkthrough、加工排序、温室布局、Year 1 今早金币循环、SVE、或 winter crop。F 锁题时遵守同一边界。

### 为何是 I2（只引用 A 已打开的 SERP，不编 PAA 答案）

A 打开的当地 SERP（2026-09-14，ego-browser 任务空间 `fall-crops-stardew-serp-en`，`html lang=en`）：

1. 主查询 `stardew fall crops`  
   `https://www.google.com/search?q=stardew+fall+crops&hl=en&gl=us&pws=0&num=10`  
   自然结果 #1 是 wiki Fall（I1 名录形态）。#2 Reddit「What are the best crops to plant during the fall?」；#3 官方论坛 favorite fall crop；#4 YouTube Year One；#5 TikTok ranking。  
   同页 related（可见，非编造）：`Best fall crops Stardew Valley`、`Stardew Valley best fall crop year 1`、`Stardew fall crops most profitable`、`Stardew Valley best fall crop year 2`、`Stardew fall crops list`、`Fall Crops Bundle Stardew`。  
   可见 PAA **问题**（手风琴未展开；禁止把 AI Overview 当 PAA 答案）：  
   - What is the most profitable crop in fall Stardew Valley?  
   - What crops can be grown in fall in Stardew Valley?  
   - What's the most profitable crop in fall?  
   - What are the best plants to plant in Stardew Valley during the fall?

2. 相关查询 `best fall crops stardew valley`（同 locale 参数）  
   A 记录 **intent shift**：ranking 查询把 Reddit 排在 wiki Fall 之前。  
   Related 再出现 year 1 / year 2 / most profitable / late game。  
   PAA 问题含 `What is the best seed to grow in Stardew Valley during the fall?`、`What is the most profitable fall crop?`。另有 `What is the best thing to do in fall in Stardew Valley?` — 过宽，**不收进主意图或 FAQ**。

3. 相关查询 `stardew valley fall crops`  
   形态与 query 1 同类：wiki + Reddit `1f5l3xr` + forums + Year One 视频。PAA 另有 winter crop 问句 — **冬季不进本篇**。

4. 已打开样本的形态  
   - R1 wiki Fall：同口径 gold/day 表 + 种子价/生长/max harvests；**没有**把 Year 1 / Oasis / Year 2 / cart 写成种植计划。  
   - R2 Reddit（已打开）：pumpkin vs cranberry vs 夏季已种的 corn；无 gold/day 表、无 last-plant、无布局图。  
   - R3 官方论坛：favorite（利润 / 外观 / artisan）；Jooshimus 把 pumpkin keg vs cranberry raw 放进比较 — keg 页未打开，不得升成主意图。  
   - R4/R5 视频：Year One 标题与 ranking caption；**未取逐字稿**，不得引用其 gold/day。

**为何不选 I1 做主意图：** 主查询 wiki 第一，但 related 与 PAA 已把任务推进到 best / most profitable / year 1 / year 2。只做名录会重复 wiki，完不成「种哪个」。I1 表必须留下，作为排序材料。  
**为何不把 I3 升成主意图：** Year 1 是条件。升成 Pierre-only 会丢掉 related 的 year 2，也会丢掉同一张表上的 Oasis beet 与 cart Rare Seed；并与现页 `/how-to-earn-money-stardew` 的 Fall 金币 H2 撞车。  
**为何 I4/I5/温室/SVE/冬季不进 H1、不进独立 H2：** related 有 Bundle 与 SVE；forums 有 artisan；PAA 有 winter 与 “best thing to do in fall”。A 未打开 Bundles / Keg / Oasis 专页 / Traveling Cart 专页 / SVE 作物。用户已排除这些作主意图。确有后续价值时用一句内链，不展开。

### 最强证据（给 C/E，不写进正文）

同一排序任务同时被 (a) ranking 查询 Reddit-first 形态、(b) related 的 year 1 / year 2 / most profitable、(c) PAA 的 most profitable / best plants / best seed、(d) 打开的 wiki gold/day 表 支撑。条件列必须进同一张表，否则会变成未打开 listicle 那种无门控排行，或 wiki 那种无名录计划。

---

## 3. ReaderTask

**已有条件**

- 在玩星露谷户外农场，季节是 Fall（第三季，28 天日历；不在季作物 Winter 1 枯死，见 A K1/K14）。  
- 可能是 Year 1（Pierre Fall 柜台；Artichoke 还没上架）或更晚（Year 2 artichoke；能买到标了 Oasis: 20g 的 beet；手里有或没有 Rare Seed）。  
- 知道要 “best / most profitable”，但不一定知道 wiki gold/day 的假设，也不一定知道 grape trellis 挡路、pumpkin 3×3 占九格、cranberry 格会占到月末。  
- 浇水工具以喷壶为主的 Year 1 玩家，或已有喷头的更晚存档。不要求先会用本站规划器。

**要完成的动作**

1. 用 **Crops 页 wiki gold/day**（无肥料、无 Tiller、无 Agriculturist；种植当日浇水；生长不含种植当日）给户外秋季作物排序。  
2. 在同一排序上读门控：今早 Pierre Year 1 能不能买；是不是 Year 2 artichoke；Fall 表上 beet 是否只能走 **Oasis: 20g** 标签；Rare Seed 是否来自 Traveling Cart 1,000g。  
3. 用占用（cranberry 收日、pumpkin 13 天一轮、grape trellis 走位、pumpkin giant 3×3、派生 last-plant）决定每一格实际种哪个，而不是只抄表头第一名。  
4. 喷壶能浇多少格，就买多少种子（约束，不重写金币循环）。

**完成标志**（验收用，不写成对读者的围栏句）

读者能指出：无 Rare Seed、无 Oasis、Year 1 时，表上最高的户外 gold/day 不是 Sweet Gem，也不是 artichoke；Year 1 Pierre 上 cranberry ≈18.89g 高于 pumpkin 单周期 ≈16.92g 与 grape 16.8g；pumpkin 的 16.92 不是两轮整季利润，不能与 cranberry 18.89 混成同一个「整季最赚」；Sweet Gem ≈83.33g 需要 Cart Rare Seed 1,000g，不是 Year 1 Pierre 默认包；artichoke 16.25g 是 Year 2 Pierre；beet 是 Oasis: 20g 标签，不是 Pierre Fall_Stock；sunflower 是 −15g；corn 只算 Fall ≈1.92g。能读出 pumpkin last-plant 15、fairy rose 16、sweet gem 4 是派生数 `28 − grow days`，不是 wiki 专有名词。能在图上看出 cranberry 收日与 pumpkin 轮次如何抢同一格，以及 grape 走道与 pumpkin 3×3 如何抢格。

**范围边界**（选材控制；禁止正文写“本文不讨论…”）

做：户外 Fall 作物排序；wiki gold/day 假设写在表注；Year 1 Pierre / Oasis: 20g beet / Year 2 artichoke / cart Rare Seed 门控写在同一张表；占用与派生 last-plant；grape 挡路 vs pumpkin 3×3 vs cranberry 行；向现有春季文、夏季文、金币文、温室文、喷头文做一句内链。

不做（不设独立 H2，不写进 H1）：

- Community Center / Fall Crops Bundle / Quality Crops 清单与奖励流程（I4；Bundles 页未打开。Pumpkin infobox 若点名 Bundle 用途，最多同位语）  
- Keg / Jar 产能、pumpkin juice vs cranberry 加工排序（I5；Keg 页未打开）  
- Year 1 今早买背包/铜喷壶/种子金循环（现页 `/how-to-earn-money-stardew`）  
- 温室 10×12、Ancient Fruit 终局酒、Ginger Island 全年床（现页 `/glasshouse-stardew-valley`）  
- 春季草莓/花椰菜/Egg Festival；夏季 Starfruit/蓝莓/啤酒花排行（现页 spring / summer）  
- SVE 秋季作物；冬季作物  
- Oasis / Sandy **营业时间**、巴士修理金币合计、车票价（Oasis / Desert / Bus / Vault 页 **未打开**；不得用夏季文数字填秋）  
- Traveling Cart **时刻表**、Night Market、Fair **商店内容**、Broccoli Seeds **来源清单**、Pierre **周三关门/社区中心例外**（均 未取得）  
- 规划器计算 gold/day、last-plant、giant 1%（工具做不到）

---

## 4. 文章类型

**对比 / 选型**（不是教程）。

信息顺序按质量门选型表：

1. 选型条件（年、商店门、浇水格、gold/day 口径）  
2. 同条件比较（一张表：gold/day + 种子来源/门控）  
3. 分场景选择（Year 1 Pierre cranberry / pumpkin / grape 占用分叉；Year 2 artichoke；Oasis beet 标签；cart Rare Seed）  
4. 不适用（Sunflower −15g；Corn Fall-only ≈1.92g；Broccoli N/A 不是 Pierre 0g；Ancient Fruit 不是当季户外收成；Sweet Gem 不是 Year 1 Pierre 默认）

不要写成“准备种子 → 锄地 → 浇水 → 收获”教程。春/夏文的方法（占用 + 门控 + 表）可平行；春/夏作物、节日、Starfruit 巴士金不可平行复制。

---

## 5. 必需子问题（删节测试）

只留删掉后主任务完不成的项。Related / PAA / 竞品目录不是必须全覆盖的清单。

| 子问题 | 落点 | 删掉？ |
|---|---|---|
| 用哪一套 gold 口径？无肥料、无 Tiller；cranberry 18.89 已含 2 颗，**不得**再加 10% extra；pumpkin 单周期 ≈16.92 与两轮季节合计不是同一指标（A K5/K6/A3）。 | 开篇 + H2-1 表注 | 不能删 |
| 秋天能种哪些（I1 表），以及每行的种子价、生长/再生、max harvests、wiki gold/day？ | H2-2 表 | 不能删（I1 作为排序材料） |
| 今早谁卖：Pierre Year 1 vs Year 2 artichoke 30g vs Oasis: 20g beet vs Cart Rare Seed 1,000g vs Broccoli N/A？ | 同一张表的来源列 + H2-1 / H2-4 | 不能删 |
| Year 1 无 Cart/无 Oasis：Cranberry ≈18.89 vs Pumpkin ≈16.92 vs Grape 16.8 的占用分叉？ | H2-3 | 不能删 |
| Year 2 artichoke 如何进同一张表（16.25g，仍低于 cranberry 18.89）？ | H2-4 | 不能删 |
| Beet 只使用 Fall 表 **Oasis: 20g** 标签，不写未打开的营业/巴士金？ | H2-2 行 + H2-4 一句 | 不能删（否则会把 beet 写成 Pierre 或编造沙漠门） |
| Sweet Gem / Rare Seed 1,000g、24 天、≈83.33g，不是 Year 1 Pierre 默认？ | H2-2 行 + H2-4 | 不能删（否则表头第一名被误当成今早购物单） |
| 派生 last-plant（单收 A1：pumpkin 15、fairy rose 16、sweet gem 4 等）以免 Winter 1 枯死？ | H2-2 或 H2-5 小表 | 不能删 |
| 同一床：grape trellis 挡走、pumpkin 3×3 giant、cranberry 行，三者如何抢格？ | H2-3 + 图 2 | 不能删 |
| Cranberry Fall 1 种的收日 8/13/18/23/28 与 pumpkin 13 天一轮如何抢同一格？ | H2-3 + 图 1 | 不能删 |
| 喷壶格数限制买种数量（只作约束，不写金币循环）？ | H2-1 一句 + 内链金币文 | 不能删（否则 Year 1 场景不可执行） |
| 哪些看起来像秋作物但不该当默认户外第一：Sunflower −15g、Corn Fall-only ≈1.92g、Broccoli N/A≠Pierre 0g、Ancient Fruit 28 天跨季？ | H2-5 | 不能删 |

**明确不收为子问题 / 不设节**

- Fall Crops Bundle 步骤与奖励  
- “pumpkin vs cranberry in kegs/jars” 加工数学  
- 温室/岛上全年床怎么排  
- 规划器逐步点击教程  
- Oasis 营业时间 / 巴士修理金 / 车票  
- Traveling Cart 周五周日时刻、Night Market、Fair 商店、Broccoli Seeds 来源列表  
- Pierre 周三例外  
- PAA 手风琴答案、未打开的 Query 2 Reddit / Steam / Out of Games / IGN / Shockbyte / Fandom / Stardew Profits  
- Winter crop、SVE crops、Fairy Rose 蜂房专页数字

---

## 6. H2/H3 计划（工作标题，不是最终 Title/H1）

开篇无 H2。前三句必须落到选型答案：没有单一 best outdoor fall crop；Year 1 Pierre 是 cranberry / pumpkin / grape 的占用选择；Year 2 artichoke、Oasis beet、cart Rare Seed 是**同一张 gold/day 表上的条件**。第三句指向表：先看你今早能买什么，再看 wiki gold/day，再看这格是否还被占用。禁止科技腔、禁止 SERP 日志、禁止先卖焦虑。B 不写这三句正文。

### H2-1. Best outdoor fall crop depends on year, the shop you can open, and the tiles you can water

回答选型条件。

- Year 1 Fall 1 = Pierre Fall 柜台（A K12）。Artichoke Seeds **year 2+**。Beet、Broccoli、Rare Seed、Ancient Seeds **不在** Pierre Fall_Stock。  
- Pierre 柜台：多数日子 **9am** 开、**5pm** 关柜；可进店到 **9pm** 但不能在 5pm 后买卖（A 从 Pierre 页前几段抽出）。**禁止**写周三关门 / 社区中心例外（未在抽出段落中）。  
- Oasis beet：只用 Fall 表标签 **Oasis: 20g**。禁止写 Sandy 营业时间、巴士修理合计、车票、Pam 时刻（均 未取得；也禁止从夏季文抄过来）。  
- Rare Seed / Sweet Gem：Crops 页 Traveling Cart **1,000g**（脚注极少 600g）；春夏可买、秋冬少见（K11）。禁止写 Cart 周五/周日时刻、禁止 Night Market 门。  
- 浇水格是 Year 1 种植上限。一句内链 `/how-to-earn-money-stardew`。不要重讲背包、铜喷壶、今早花销。  
- Wiki gold/day 来自 Crops 页公式与假设（A 文首 gold/day 段 + K2/K5）。生长不含种植当日；当天未浇水不长也不死。Cranberries 的 2 颗已计入 Fall 表与 18.89 例题；**10% extra berries 不得再加进 18.89**（K5/K6）。  
- 禁止把季节合计（例如 5×150−240 的 cranberry 季节净额）与 wiki gold/day 写在同一句里当同一排名（A3）。Out of Games SERP snippet 未打开，不得当来源。

本 H2 不要大表；条件讲清后立刻让读者进入 H2-2 的表。

### H2-2. Rank the outdoor fall field on one gold/day table, with access on the same rows

I1 名录 + I2 排序。一张表，不要拆成“能种什么”和“什么最赚”两张重复表。

表列（C 落实，数字只许用 A K3/K4/K12 及已打开的 Crops 小节）：

| Crop | Seed source and price | Grow / regrow | Wiki max harvests (no fertilizer, no Agriculturist) | Wiki gold/day (no fertilizer, no Tiller) | Access / occupancy |
|---|---|---|---|---|---|

行（Fall wiki 单收 + 多收，按 gold/day 降序便于选型，不要按 wiki 原表字母序凑目录）。C 必须把门控写在 Access 列，避免第一行被当成今早合法：

- Sweet Gem Berry — Traveling Cart 1,000g / 24d / max 1 / ≈83.33g — **不是 Pierre 默认**；派生 last-plant 4  
- Ancient Fruit — 公式按 artifact 免费种子 / 28 then 7 / 三季脚注 / ≈57.14g* — 不是 Fall-only 户外收成  
- Cranberries — Pierre 240g / 7 then 5 / max 5 / ≈18.89g — Year 1 Pierre；每收 2 颗已计入；10% extra **不在** gold/day；A2：Fall 1 种则 8/13/18/23/28  
- Pumpkin — Pierre 100g / 13d / max 2 / ≈16.92g — Year 1 Pierre；giant 候选；≈16.92 是单周期 `(320−100)/13`，不是两轮季节利润；派生 last-plant 15  
- Grape — Pierre Grape Starter 60g / 10 then 3 / max 6 / 16.8g — Year 1 Pierre；活着不能穿行  
- Artichoke — Pierre 30g **year 2+** / 8d / max 3 / 16.25g — 不是 Year 1 Pierre 默认  
- Broccoli — N/A / 8 then 4 / max 5 / ≈14.58g — 公式把种子当 0；**不是** “Pierre sells for 0g”；不在 Pierre Fall_Stock；来源清单 未取得，禁止编 raccoon/seed spot  
- Beet — **Oasis: 20g** / 6d / max 4 / ≈13.33g — 不在 Pierre Fall_Stock；不要补营业/巴士金  
- Amaranth — Pierre 70g / 7d / max 3 / ≈11.43g — Year 1 Pierre；Pierre 描述 scythe  
- Eggplant — Pierre 20g / 5 then 5 / max 5 / 11.2g — Year 1 Pierre  
- Yam — Pierre 60g / 10d / max 2 / 10g — Year 1 Pierre  
- Fairy Rose — Pierre Fairy Seeds 200g / 12d / max 2 / 7.5g — 花；蜂房页未打开，不排蜜  
- Bok Choy — Pierre 50g / 4d / max 6 / 7.5g — 短周期  
- Wheat — Pierre 10g / 4d / Fall 6 或 Summer+Fall 13 / 3.75g  
- Corn — Pierre 150g / 14 then 4 / Fall 4 或 Summer+Fall 11 / Fall-only ≈1.92g，两季 ≈7.41g — 夏季已种可进秋（K14）  
- Sunflower — Pierre 200g / 8d / Fall 3 或两季 6 / **−15g**

表注必须写清：Crops 页假设；max harvests 无肥料无 Agriculturist；Broccoli N/A 不是商店 0g；Pumpkin ≈16.92 是单周期；Cranberry 18.89 含 2 颗、不含 10% extra；Sweet Gem 脚注按 1,000g。

Joja 价（Cranberry 300g / Pumpkin 125g / Grape 75g）若写，只能标来自已打开 Crops infobox，不得写成打开了 JojaMart 页。Pierre 表第二列是 **Out of season**，不是 Joja。

表下用三个问题读表（平行春/夏方法，不抄春/夏作物）：今早买得到吗？种植当日和之后浇得到吗？这格在你还想收下一茬 cranberry / 种第二轮 pumpkin / 留 3×3 / 走过 grape 的那个早晨是否仍被占用？

派生 last-plant 作第二张小表（单收用 A1：Bok Choy 24；Wheat 24；Beet 22；Amaranth 21；Artichoke 20；Sunflower 20；Yam 18；Fairy Rose 16；Pumpkin 15；Sweet Gem Berry 4）。Wiki **没有** “last plant day” 这个专名；正文必须标 derived：`28 − grow days`，收在 Fall 28，不含种植日，无 Speed-Gro，种植日已浇水。Cranberry/Grape 不要另编未核验的「五收/六收最晚种植日」，除非用公开公式当场写出算术。Fall 1 种满 cranberry max 5 用 A2。

图 1 放在本 H2：占用日历（见下）。

### H2-3. Year 1 Pierre: cranberries, pumpkins, and grapes occupy different tiles

分场景：related 的 Year 1 与已打开 Reddit 的 cranberry vs pumpkin。无 Cart Rare Seed、无 Oasis beet、无 Year 2 artichoke 时，不要把表头 Sweet Gem 抄进购物单。

- **H3. Cranberries occupy the tile through the late-month picks**  
  Pierre 240g（Crops infobox Joja 300g 可作旁注）。7 天然后每 5 天。每收 2 颗；卖 75 / 93 / 112 / 150g（K6）。Wiki gold/day ≈18.89g，Crops 页例题：`(5 × 150 − 240) / 27`。Fall 1 种、每日浇、无加速：8 / 13 / 18 / 23 / 28 共 5 次（A2）。这是 Year 1 Pierre 户外表上最高的 gold/day。10% extra **不在**该格。

- **H3. Pumpkins are a 13-day crop and the fall giant**  
  Pierre 100g。13 天；320 / 400 / 480 / 640g；不可食用（K7）。Wiki ≈16.92g 是 `(320 − 100) / 13` 一周期。Max harvests 2 是另一指标，禁止与 18.89 混称季节利润（A3）。派生 last-plant 15。Giant：花椰菜/甜瓜/**南瓜**等 3×3；每晨每个重叠 3×3 1%；**左上**已成熟且浇水且九格同种；15–21 普通品质；任意斧三下；温室/花盆/姜岛不能形成；giant 换季不枯（Crops Giant Crops）。占九格直到你收或砍。喷头若占中心格，该格不是南瓜 — 只写这一句占用，档位内链 `/sprinkler-stardew`，不要重写 4/8/24。Scarecrow 15 株/范围：**本次 A 未打开 Scarecrow 页**，不要抄春季文数字。

- **H3. Grapes pay six picks and block walking**  
  Pierre Grape Starter 60g。10 天然后每 3 天；max 6；16.8g（K4/K8）。活着任何阶段不能穿行（K15；trellis 作物 Green Bean、Hops、**Grape**）。布局：单行或双行+走道，不要围住 pumpkin 3×3 或挡住浇水/斧路。禁止把 Summer Foraging Bundle / Vincent 喜爱礼物写成户外 gold 排序依据。

本 H2 结尾给出可执行分叉（列表，不是新 H2）：喷壶 Year 1 Pierre — 多数格 cranberry；你愿意连续占 13 天并接受九格 — 一块 pumpkin 3×3；有走道且接受 trellis — grape 一行。不要写成 Community Center 清单，不要写 keg 谁赢。

### H2-4. Year 2 artichoke, Oasis beet, and cart Rare Seed join the same ranking

门控行如何进入**同一张表**。禁止为了对称夏季文而补巴士金或 Cart 时刻表。

- **H3. Artichoke is a Year 2 Pierre seed**  
  Pierre 30g；8 天；160g；wiki 16.25g（K3/K12）。Year 1 默认田不写它。它低于 cranberry 18.89，高于 eggplant 11.2。Year 2 不能取消 grape 挡路或 pumpkin 九格占用。

- **H3. Beet is Oasis: 20g on the Fall table**  
  6 天；100g；≈13.33g；max 4（K3）。不在 Pierre Fall_Stock。正文只许用 **Oasis: 20g** 这个已打开标签。买得到则它是合法行；买不到则不要当 Year 1 Pierre 默认。禁止营业时间、巴士金、沙漠解锁流程。

- **H3. Sweet Gem Berry needs a Rare Seed, not a Pierre packet**  
  24 天；一收；卖 3,000 / 3,750 / 4,500 / 6,000g；wiki ≈83.33g* 按 1,000g（K11）。Fall 表种子 Traveling Cart: 1,000g。脚注极少 600g。春夏 Cart 可遇、秋冬少见 — 仅用 K11 这句话，不写时刻表。派生 last-plant 4。Cannoli 换 Stardrop 最多一句，不另开节。没有 Rare Seed 就不要把 83.33 写成 Year 1 默认第一。

Broccoli 不在本 H2 当「能打开的门」：来源页未打开。放到 H2-5。

场景收束：Year 1 Pierre — cranberry 口径第一，pumpkin/grape 是占用分叉；Year 2 — artichoke 进 Pierre 表，仍低于 cranberry 18.89；有 Oasis 标签的 beet 进表，不是 Pierre 货架；有 1,000g Rare Seed 时 Sweet Gem 在**同一口径**下数字最高，仍受 24 天与 last-plant 4 约束。

### H2-5. Last plant days, and crops that lose the outdoor rank

不适用情况 + last-plant 执行检查。

- 单收 A1 表；晚于 pumpkin 15 / fairy rose 16 / sweet gem 4 买到的种子，会在 Winter 1 以未完成阶段枯死（K14）。  
- Sunflower wiki gold/day **−15g**，因为种子 200g vs 卖 80g（K3）。Pierre 仍卖它。想种花可以种；不要按 gold/day 表头去填格。  
- Corn 只算 Fall ≈1.92g；Summer+Fall ≈7.41g。夏季已种、仍在季则 Fall 1 不枯（K14）。不要当秋季 gold/day 赢家。一句内链 `/summer-crops-stardew`（上一季户外占用），不要重排名夏作物。  
- Broccoli ≈14.58g 看起来接近 beet，但 Fall 表种子 **N/A**，公式按 0 计；不是 Pierre 0g 标价。禁止编来源清单。  
- Ancient Fruit：28 天然后每 7 天；gold/day 脚注是三季免费种子（K10）。一句内链 `/glasshouse-stardew-valley`。不要开温室布局节。  
- Fairy Rose 7.5g / 200g 种子。蜂房页未打开，不改主排序。  
- Wheat / Bok Choy / Yam / Amaranth / Eggplant 留在 H2-2 表里供对照；本 H2 只处理「为什么它们不是排序第一」和 last-plant，不写礼物/油/蜂房新任务。

### H2-6. Put grapes, a pumpkin 3-by-3, and cranberry rows on one bed without sharing walking tiles

空间关系，服务占用选型，不是规划器教程，不是喷头专文。

读者必须能在图上指出：grape 行 + 走道；九格 pumpkin（左上要浇）；cranberry 矩形不与九格重叠、不坐在 trellis 墙后面；九格内无喷头/稻草人。

可选用有序列表（锄 3×3、九格全 pumpkin、grape 不围九格、cranberry 在能走到的矩形）。不要加“打开规划器第一步…”作为主步骤。规划器若出现，只在本 H2 末可选一句（见工具关联）。

### H2-7. FAQ

用户要求成品有 FAQ + 文末来源。FAQ 是读者短问，**不是第二张排序表**，不承担整节 H2-2/H2-3 的工作。答案只许用 A 已核验事实；不得新增 未取得。可见 FAQ 模块；**JSON-LD 仍为 Article，不是 FAQPage**（F/G 装配时遵守）。B 不写 FAQ 答案正文；C 按下列问题写短答。

**不要设的 H2**

- Sketch the fall bed in the planner（春季文有独立 H2；本意图没有「用规划器」需求）  
- Fall Crops Bundle walkthrough  
- Keg / jar pumpkin vs cranberry  
- Greenhouse / Ancient Fruit year-round  
- How to earn gold this morning  
- SVE fall crops / winter crops  
- Fair / Spirit’s Eve / Night Market 购物

**内链（自然一句，现有 URL only）**

- `/best-spring-crop-stardew` 上一季户外占用方法  
- `/summer-crops-stardew` 上一季户外占用方法（corn 跨季时）  
- `/how-to-earn-money-stardew` 喷壶/金币约束  
- `/glasshouse-stardew-valley` 全年床 / Ancient Fruit  
- `/sprinkler-stardew` 喷头占格  
- `/` 或 `/#planner` 仅当工具关联那一句  
- 作物数字链到第 11 节公开来源（Fall、Crops 已打开小节、Pierre Fall Stock）。**不要**把未打开的独立作物页 `/Cranberries`、`/Pumpkin` 等写成「已打开来源」。Crops 页已打开的 hash（`#Cranberries` `#Pumpkin` `#Grape` `#Broccoli` `#Ancient_Fruit` `#Sweet_Gem_Berry` `#Gold_per_Day` `#Giant_Crops` `#Trellis_Crops` `#End_of_Season` `#Grow_Times`）可用。

---

## 7. 图文位置

封面不算正文图文完成。精确布局必须是**可控绘图**（格子示意图），禁止生成式「游戏截图」或未核验的规划器界面冒充精确证据。表格承担精确数字；图承担日历占用与空间走位。

读者必须看见占用：**cranberry 收日 vs pumpkin 轮次**（日历），以及 **grape trellis 走道格 vs pumpkin 3×3**（网格）。只出封面不合格。

| ID | 读者必须看见什么（教什么，不是文件名） | 类型 | 事实来源（A） | 落点 | 图注职责 |
|---|---|---|---|---|---|
| Cover | 户外秋田识别：可辨认的 cranberry 行、pumpkin 块、grape 架。不是温室、不是社区中心板、不是冬季雪田。不在封面写最终 Title。 | 封面图；可控插画或授权素材。不是游戏假截图。 | 选题识别，不承载精确数字 | 页首 LCP（G 装配） | alt 描述画面，不堆关键词 |
| Fig 1 | 一张 Fall 1–28 日历，同一格两种占用对照：cranberry 收 8/13/18/23/28，所以 Fall 14 早晨这格仍被占着；pumpkin 13 天一轮、派生 last-plant 15。读者能读出「哪天这格仍被占用」，而不是谁的 gold/day 更大。 | **示意图 / 日历格**（可控绘图）。不是截图。 | A2、A1 pumpkin 15、K3/K4、K13/K14；日历 1–28 来自季节长度 | H2-2 表之后、读表三问附近 | caption：Fall 1 种、每日浇、无 Speed-Gro；last-plant 为派生 `28 − grow days`；18.89 与 16.92 不要写进图当季节合计 |
| Fig 2 | 同一块床的格子图：一侧 **grape 一行 + 至少一格走道**；一块 **pumpkin 3×3**，左上格可识别；一块 **cranberry 矩形** 不与九格重叠、不在 trellis 墙后；九格内无喷头/稻草人。读者能判断走不到的 grape 围栏是错的。 | **示意网格**（可控绘图，格可数）。不是生成式截图，也不是未核验的规划器截图。 | K15 挡路；Crops giant 规则 + K7 Pumpkin；K6 cranberry 非 trellis；九格必须同种 | H2-3 分叉之后，H2-6 主解释 | caption：占用图，不是 1% giant 已触发；规划器未验证 grape 挡路，不要写「工具里不能穿过」 |

Grape 若要画进 Fig 1 日历，必须当场用 K8+K13 标 derived（Fall 1 种、10 天首收则 Fall 11，然后每 3 天）。不是 A 已编号的 A2。Fig 2 已承担 grape **走道**；日历上的 grape 行可选，不可替代 Fig 2。

**表（不是图，但与图一起完成主任务）**

| 表 | 读者用途 | 来源 | 落点 |
|---|---|---|---|
| 主排序表 | 同口径比较 + 门控 | K3、K4、K12、K6–K11 | H2-2 |
| 派生 last-plant 小表 | 单收最晚种植日 | A1 + 公式声明 | H2-2 或 H2-5 |

不需要的图：社区中心板、keg 流程图、温室 10×12、巴士修理金币循环、Fair 摊位、规划器 UI 截图（A 未练 palette，未取得 15）、「游戏照片」冒充 3×3 规则。

工作文件名（G 绑定；slug 已锁为 `fall-crops-stardew`）：

- `public/blog/illustrations/fall-crop-occupancy-calendar.webp`  
- `public/blog/illustrations/fall-grape-pumpkin-cranberry-bed.webp`  
- 封面 `public/blog/fall-crops-stardew-cover.webp`

图中文字只许用已核验名与数。不要在图里写未打开 listicle 的 510g/440g 季节合计。

正文图位数：**2** 张服务主意图的示意图 + 1 张封面。封面不够。

---

## 8. 工具关联（独立字段）

**弱可选，不是主意图，不设 H2。**

搜索意图是户外秋季作物排序，不是「用规划器种秋天」。不得为了产品把规划器需求并进 I2。

| 项 | 值 |
|---|---|
| 是否必需 | 否。示意图 Fig 2 已能完成占用判断。 |
| 自然位置 | 仅 H2-6 末可选一句：若要按自己的农场地图摆同一 3×3 与 grape 行，可打开首页并把季节切到 Fall。 |
| 已核验工具事实 | T1–T5：8 种农场 + 姜岛；可摆建筑/作物；季节含 **fall**；喷头/稻草人/Bee House/Junimo 覆盖；项目留在浏览器。**不算** gold/day、last-plant、giant 1%。 |
| 禁止声称 | 规划器替你排序；规划器模拟生长/浇水/商店；规划器里 grape 挡行走（未验证 palette）。 |
| 若写进正文 | 链 `/` 或 `/#planner`；English 目录名未在本次 A 会话点开 palette — 不要列出未核验的 catalog id。需要规划器截图或 “grape is a walk-block in the tool” → **退A**，不要用春/夏文或源码脑补。 |

默认交付可以没有规划器段。空工具关联合格。工具**不计算** gold/day。

---

## 9. 可核对信息增益（对 A 已打开样本 + 本站春/夏页，不是「比前五更全」）

打开 SERP 样本已有：wiki Fall 全表+gold/day；Reddit cranberry vs pumpkin vs 夏季玉米；论坛 pumpkin/keg vs cranberry raw vs Fairy Rose 外观；Year 1 YouTube 标题；TikTok ranking caption。

本站已有、本篇不得复述为新发现：

- `/best-spring-crop-stardew`：春季占用 + wiki gold/day + Egg Festival 草莓 + giant cauliflower  
- `/summer-crops-stardew`：夏季占用 + Pierre vs Oasis Starfruit vs Year 2 Red Cabbage + hops trellis + giant melon  
- `/how-to-earn-money-stardew`：Year 1 金币循环；Fall H2 列出 Pierre 种子价，**不**排 gold/day、不写 last-plant、不画 pumpkin 3×3 / grape 走道  
- `/glasshouse-stardew-valley`：室内 10×12

本篇相对春/夏页的新增（必须落到材料，作物换成秋）：

| 增益 | 材料落点 | 依据 | 读者如何用 |
|---|---|---|---|
| 占用不是排行榜：cranberry 收日 8/13/18/23/28 vs pumpkin 13 天一轮 vs grape 走道 vs pumpkin 3×3 | H2-3、H2-6、Fig 1–2 | A2、K7/K15、Giant Crops | 在图上指出冲突格再买种 |
| 门控与 gold/day 同一张表：Year 1 Pierre cranberry/pumpkin/grape；Year 2 artichoke 30g；Oasis: 20g beet；Cart Rare Seed 1,000g；Broccoli N/A | H2-2 Access 列、H2-4 | K3、K4、K11、K12 | 今早买不到的行不能当默认第一 |
| 表注钉死 wiki 假设：18.89 含 2 颗、不含 10%；pumpkin 16.92 是单周期不是季节合计 | H2-1、H2-2 表注 | K5、K6、A3 | 不把两种指标合成一个「最赚」 |
| 派生 last-plant（pumpkin 15、fairy rose 16、sweet gem 4 等） | H2-2/H2-5 小表 | A1；wiki 未命名 | 晚买的种子不在 Winter 1 枯成未完成阶段 |
| 喷壶格数当 Year 1 株数上限 | H2-1 一句 | 金币文已有道德；本篇当约束 | 不把排行第一买到浇不到的格 |

不是本篇增益（留给别的 URL）：keg 吞吐、Fall Crops Bundle 全流程、温室 10×12、Ancient Fruit 酒、SVE、冬季。

---

## 10. 计划 FAQ（3–6；成品要有；不是第二张排序表）

来源：A 已见 PAA **问题**与 related，以及已打开 R2 的读者问法。手风琴答案未展开，不得把 Overview 当答案。每题短答，不重复整节 H2。C 只许用列出的 A 事实。

| # | 问题（读者问法） | 来自 | 答案只许用的 A 事实（B 不写正文） | 禁止 |
|---|---|---|---|---|
| 1 | What is the most profitable crop in fall in Stardew Valley? | PAA query 1 / query 3 | 没有单一答案。口径=Crops gold/day，无肥料无 Tiller。Year 1 Pierre：cranberry ≈18.89。Pumpkin 单周期 ≈16.92 不是季节合计。Grape 16.8 且挡路。Sweet Gem ≈83.33 要 Cart Rare Seed 1,000g，不是 Pierre 默认。Artichoke 16.25 是 Year 2。 | 不得贴第二张排序表；不得写 keg 赢家；不得写 510g 当 wiki gold/day |
| 2 | What is the best fall crop in Year 1? | related `best fall crop year 1` | Year 1 Pierre：cranberry 240g ≈18.89 是该柜台最高 gold/day；pumpkin/grape 是占用分叉。Artichoke 尚未上架。Beet 是 Oasis: 20g 不是 Pierre。Sweet Gem 不是 Pierre 包。 | 不得写成「永远种 cranberry」而不提占用 |
| 3 | What is the best fall crop in Year 2? | related `best fall crop year 2` | Artichoke 进 Pierre（30g，16.25g），仍低于 cranberry 18.89。Year 2 不取消 trellis 或 3×3 占用。Sweet Gem 仍取决于 Rare Seed，不取决于年。 | 不得把 Year 2 写成 Ancient Fruit 终局（温室页） |
| 4 | What is the best seed to grow in fall? | PAA query 2 `best seed` | 种子价 ≠ gold/day。Wheat 10g 只有 3.75g/day。Cranberry Seeds 240g 对应 ≈18.89。Sunflower 200g 是 −15g/day。Rare Seed 1,000g 对应 ≈83.33 且 24 天。 | 不得变成价目表重印 H2-2 |
| 5 | Are cranberries or pumpkins better in fall? | 已打开 R2 问法 + related most profitable | 同口径：cranberry ≈18.89 多收占格到 28；pumpkin ≈16.92 是 13 天一轮并可 3×3 giant。不要把两轮南瓜季节合计和 18.89 比。加工页未打开，不判 keg。 | 不得展开 keg/jar；不得当整节 H2-3 缩写成长文 |

FAQ 共 **5** 题。不要加 winter、Bundle 流程、SVE、「best thing to do in fall」、规划器是否算 gold/day（规划器边界放 H2-6 可选句，PAA 未问）。

文末来源：`BlogSources` 一类模块，条目用第 11 节 URL。checkedLabel 须写明：wiki gold/day 无肥料无 Tiller；last-plant 为派生 `28 − grow days`；规划器不算 gold/day。

---

## 11. 公开来源（C 必须作为正文内链保留；来自 A PublicReference / fact IDs）

核验日 2026-09-14。C 的主张必须能点回这些已打开页。不要用未打开的 Oasis、Traveling Cart、Rare Seed 专页、Broccoli Seeds、Bundles、Fair、Night Market、JojaMart、Keg、Bee House、独立作物 item URL。

| id | 用途 | URL | 支撑的 fact IDs |
|---|---|---|---|
| wiki-fall | 季节、Fall 作物表（种子价、生长、max harvests、gold/day 行、Oasis: 20g、N/A broccoli、Cart 1,000g Sweet Gem、Artichoke year 2+ 引言） | https://stardewvalleywiki.com/Fall | K1–K4、K16 仅节日日期若提及 |
| wiki-crops | 生长规则、换季枯死、trellis、Ancient Fruit / Sweet Gem / Cranberries / Pumpkin / Grape / Broccoli 小节 | https://stardewvalleywiki.com/Crops | K6–K11、K13–K15 |
| wiki-crops-gold | 公式、假设、cranberry 18.89 例题 | https://stardewvalleywiki.com/Crops#Gold_per_Day | K5 |
| wiki-crops-giant | pumpkin 3×3、1%、左上、15–21、三斧、换季不枯、温室/花盆/岛不可 | https://stardewvalleywiki.com/Crops#Giant_Crops | Giant 段 |
| wiki-pierre | 店小时（9am–5pm 柜；可进到 9pm） | https://stardewvalleywiki.com/Pierre%27s_General_Store | K12 小时 |
| wiki-pierre-fall | Fall Stock 价与 artichoke year 2+；beet/broccoli/rare/ancient 不在表内 | https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock | K12 |
| planner-home | 工具能力边界（若写 H2-6 那一句） | https://stardewvalleyplanner.art/ | T1–T5 |
| planner-spring | 上一季户外方法内链 | https://stardewvalleyplanner.art/best-spring-crop-stardew | T7 |
| planner-summer | 上一季户外方法内链 | https://stardewvalleyplanner.art/summer-crops-stardew | T8 |
| planner-money | 喷壶/金币约束内链 | https://stardewvalleyplanner.art/how-to-earn-money-stardew | T9 |
| planner-greenhouse | Ancient Fruit / 室内床一句内链 | https://stardewvalleyplanner.art/glasshouse-stardew-valley | T10 |

Reddit、官方论坛、YouTube、TikTok、Out of Games 是 **SERP 形态证据**，不是数字来源。未引用则不要列为 PublicReference。

Crops hash 可用（已打开小节）：`#Cranberries` `#Pumpkin` `#Grape` `#Broccoli` `#Ancient_Fruit` `#Sweet_Gem_Berry` `#Trellis_Crops` `#End_of_Season` `#Grow_Times` `#Giant_Crops` `#Gold_per_Day`。

禁止在正文当已打开来源：`/Oasis`、`/Traveling_Cart`、`/Rare_Seed`、`/Broccoli_Seeds`、`/Bundles`、`/Night_Market`、`/Stardew_Valley_Fair`、`/JojaMart`、`/Keg`、独立 `/Cranberries` 等 item 页。

---

## 12. C 写作约束（给 C，不是读者文案）

- 选型文：条件 → 同表比较 → 场景 → 不适用。开篇三句内给条件化答案。  
- 数字只来自第 11 节来源与 A 事实表。派生 last-plant 必须标 derived：`28 − grow days`。  
- **Wiki gold/day 假设**（必须出现在表注附近）：无肥料、无品质、无 Tiller、无 Agriculturist；种植当日已浇水；`((Max Harvests × Sell Price per Harvest) − Seed Price) / Growing Days`；`Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)`；除土豆外不计 extra（秋无土豆）；Cranberries 用每收颗数 × 卖价。  
- **不要把 extra cranberry 10% 加进 18.89。**  
- **不要把季节合计与 gold/day 混在一句当同一排名。** Pumpkin ≈16.92 是单周期；两轮是不同指标。  
- **Sweet Gem 不是 Year 1 Pierre 默认。**  
- **Sunflower −15g** 必须按 wiki 单元格写，不要改成正数。  
- **Corn Fall-only ≈1.92g**；两季 ≈7.41g 另说。  
- Broccoli N/A ≠ Pierre 卖 0g。  
- Beet 只写 Oasis: 20g。禁止 Oasis 小时、巴士金、车票。  
- 禁止 Pierre 周三例外、Night Market、Fair 商店内容、Cart 时刻表、Broccoli 来源列表。  
- 禁止复制春季文的草莓、Egg Festival、花椰菜；禁止复制夏季文的 Starfruit 400g、Vault 42,500g、Red Cabbage、hops/Pale Ale。  
- 禁止 silent fail：缺数就不要写该主张，退回第 13 节，不要用记忆或夏季文补秋的沙漠门。  
- 稻草人 15 株/17×17：**本次 A 未打开 Scarecrow 页**。不写。只需：占格的稻草人/喷头不是南瓜格。  
- 长度门槛 2000 英文词由 F 计；只在 I2 内写判断、表、占用例子，不要靠 I4/I5/温室凑字。  
- 不要输出 Title/H1/slug/七罪。Slug 已锁 `fall-crops-stardew`。  
- FAQ 5 题短答；JSON-LD 不标 FAQPage。文末来源用第 11 节。  
- 图位 Fig 1–2 的实质 figcaption 锁前入稿。

---

## 13. 退A补查（布局需要但 A 没有的事实；B 不编）

本卡**可以**在不补查的情况下让 C 写完 I2：数字与门控已在 A 事实表（beet 用 Fall 表标签；Cart 用 Crops Sweet Gem 小节）。下列项只有在 C/G 想写它们时才阻塞。

| ID | 缺口 | 为何可能需要 | 本卡怎么处理 | 若要写进正文，A 必须打开 |
|---|---|---|---|---|
| G1 | Oasis / Sandy 小时、库存全文、巴士修理金、车票 | 把 beet 写成「修好巴士之后的田」 | 只写 Oasis: 20g；不写沙漠解锁流程 | Oasis、Desert、Bus Stop、Bundles Vault |
| G2 | Traveling Cart 时刻表与价格带 | 「周五去买 Rare Seed」 | 只用 K11：1,000g、极少 600g、春夏可遇秋冬少见 | Traveling Cart、Rare Seed 页 |
| G3 | Broccoli Seeds 来源清单 | 把 14.58g 写成可执行购物 | N/A + 公式 0；不写来源 | Broccoli Seeds 页 |
| G4 | Night Market / Fair 商店 | 把 Rare Seed 或种子写成节日货 | 不写。Fair 只存在 Fall 16 日期，若提及不得写货单 | Fair、Night Market 页 |
| G5 | Pierre 周三 / 社区中心例外 | 抄其他文的营业例外 | 只用已抽出的 9am–5pm 柜 / 可进到 9pm | Pierre 页含该例外的段落 |
| G6 | 独立作物 item 页 | 想链 `/Pumpkin` 等 | 链 Fall 表 + Crops hash | 对应 item URL |
| G7 | Keg / Jar 时间与公式 | forums 的 pumpkin 加工 > cranberry | 本篇不排加工 | Keg、Preserves Jar 页 |
| G8 | Bee House / Fairy Rose 蜜 | 把花排到 cranberry 之上 | 不改主排序 | Bee House 页 |
| G9 | 规划器目录名、grape 在工具里是否挡走 | 规划器截图或「工具里不能穿过 grape」 | 不要求规划器图；Fig 2 用 wiki 挡路做示意格 | 应用内 palette / 实际摆 grape |
| G10 | Scarecrow 15 株与范围 | 秋床图写稻草人覆盖 | 不写 15/范围；只写占格 | Scarecrow wiki |
| G11 | PAA 手风琴答案 | 当读者问答来源 | 只用可见**问题** | 实际展开手风琴 |
| G12 | Query 2 Reddit `1c7cx04`、Steam、Out of Games、IGN、Shockbyte、Fandom Fall、Stardew Profits | 当结构或数字来源 | 不引用 | 对应 URL |

**不退A、C 不得发明的：** 把 I4/I5/温室/SVE/冬季写进 H1；把季节毛利与 wiki gold/day 混成一个第一名；把 extra 10% 加进 18.89；给规划器加 gold 计算；把 Broccoli N/A 写成 Pierre 0g；用夏季文的巴士金填秋季 beet。

---

## 14. 交 C 清单

1. 读本卡 + `A-en-research.md` 事实表。  
2. 写英文正文：开篇 + H2-1…H2-6 + FAQ（5 题）+ 两张表 + Fig 1–2 的实质 figcaption（锁前入稿）+ 文末来源。  
3. 公开引用绑到具体主张（第 11 节）。  
4. 不写 Title/H1；不改 slug（已锁 `fall-crops-stardew`）；不改 `src/` / `public/`。  
5. JSON-LD 保持 Article，不是 FAQPage。  
6. 缺 G1–G12 中要使用的事实 → 停，退A，不要用记忆补。
