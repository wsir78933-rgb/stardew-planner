# F-en 锁稿、计数、标题与临时公开交接

核对日期：2026-09-26（Asia/Shanghai）  
角色：F-en；范围：`stardew valley speed gro`、英文 `content-only`。本记录只覆盖本任务目录内的英文 F 产物，不装配网站，不修改 `src`、`public`、`package.json`、AGENTS、WORKLOG，不安装依赖、不提交/推送/部署、不处理密钥或外部写入。

## 进入锁稿阶段的门槛

本阶段只在当前同一版本通过后开始：

- `reviews/D-en-r1.md` 的 ResearchTrace、ReaderValue、Repetition 三门均为 **PASS**。
- `reviews/E-en-r1.md` 的独立鉴文、事实、公开引用、22 条规则、图解语义与窄屏/桌面渲染复核均为 **PASS**；E 明确把正式 SEO、网站装配和用户终审留作后续。
- `reviews/media-en-r1.md` 的英文两张 SVG 在 1440px 和 390px 的实际 `file://` 渲染均为 **PASS**；`reviews/media-en-r1-binding.md` 说明当前媒体清单的真实 hash 是完整 64 位值，旧 M 表格少写的末尾 `0` 不作为绑定值。

D、E、M 报告绑定并由本轮对实际文件字节直接复算的值如下；每个值均为 64 位小写十六进制：

| 材料 | 当前 SHA-256 |
| --- | --- |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

D-en-r1 与 E-en-r1 对正文、清单和两张 SVG 的当前绑定一致，媒体截图也逐字节匹配 M-en-r1；没有触发退回。英文正文的 source-based 日期、阶段向量、`ceil(baseDays × effective modifier)`、首次生长与固定 regrowth 的边界均保持原审稿内容，F 没有改写 C 稿。

## 正文锁定与长度门

### 逐字节锁定

源稿：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md`  
锁定稿：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md`

`cmp -s '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md'` 退出码 `0`；两者均为 `19454` 字节，锁定稿末尾保留 LF。锁定稿 SHA-256 为 `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`。

NFC/LF 规范化没有改变字节：随包脚本输出 `sha256_raw` 与 `sha256_nfc_lf` 同为 `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`。

### 机械计数

随包脚本命令：

```sh
python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' --locale en '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md'
```

退出码：`0`。真实输出的关键值：`mechanical_units=2391`、`required_floor=2000`、`meets_mechanical_floor=true`，`semantic_qualification=requires_independent_review`。

独立合格计数另外去除了：2 个完整 `<figure>...</figure>` 块（因此同时排除 `img` 的 `alt` 与 `figcaption`）、来源清单章节（本稿不存在）、标题、代码围栏、表格分隔线和 URL；保留正常正文、表格数据单元格、列表与必要的正文方法说明。独立命令退出码 `0`，真实结果为：`figure_blocks_removed=2`、`source_sections_present=false`、`qualified_units=2283`、`required_floor=2000`、`meets_floor=true`。这项独立计数仍不替代 D/E 的语义审查。

## 图文资产锁定

正文中的两条原始相对链接均为 `../assets/en/...`；从 `final/en/` 解析后指向 `final/assets/en/`，未改正文链接。每个副本均通过 `cmp` 退出码 `0`，并用程序重新计算：

| 锁定资产 | 源资产 | `cmp` | SHA-256 |
| --- | --- | ---: | --- |
| `final/assets/en/speed-gro-melon-stage-days.svg` | `assets/en/speed-gro-melon-stage-days.svg` | `0` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `final/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `0` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

`xmllint --noout` 对两张锁定 SVG 的退出码为 `0`；`file` 对两张锁定 SVG 的退出码为 `0`，均识别为 `SVG Scalable Vector Graphics image`。媒体尺寸分别为 `390×1070` 和 `390×1250`，与 M-en-r1 的实际渲染绑定一致。

## 正文承诺抽取与标题生成

### 核心承诺

- 读者实际得到：用作物、播种日、可用肥料档位和季节期限，把 growth modifier 转换成首次收获日期，再判断它是否改变单收获、重种或额外 regrowth 收获的日程。
- 最大已核验结果：百分比标签不是直接的日历天数折扣；Parsnip 中 Speed-Gro 与 Deluxe 同为 Spring 4，而 Spring 13 播种的 Strawberry 中 Speed-Gro 把第三次收获带入 Spring 28；后续 regrowth 仍为 4 天。
- 本稿独有的讲解：`ceil(baseDays × effective modifier)` 后按 whole stage-days 分配，再与作物自己的 regrowth 字段分开比较。
- 不能承诺：普适“最佳”肥料、普适利润/ROI、所有作物的固定节省天数、游戏实测、美国个性化排名、免费/最快/保证额外收益，或未经审核的页面/用户批准。

### 自由生成的 10 个候选（先生成，未按公式配额）

候选顺序和各自描述方向如下；描述只使用正文已有的 stage days、first harvest、fixed regrowth 与 season-plan 承诺。

1. **Compare Stardew Valley Speed-Gro Harvest Dates, Not Percentages** — Compare Speed-Gro, Deluxe, and Hyper by stage days, first harvest dates, and fixed regrowth intervals. Learn when a tier changes your crop calendar.
2. **Stardew Valley Speed-Gro: Compare Harvest Dates, Not Percentages** — Use the crop's stage vector and planting day to see whether a higher tier changes your season plan or reaches the same date as a lower tier.
3. **One Saved Day Can Add a Strawberry Harvest—If the Calendar Agrees** — A Spring 13 Strawberry example shows why first growth and fixed four-day regrowth must be calculated separately before choosing fertilizer.
4. **Stardew Valley Speed-Gro: The Tier Difference Depends on the Crop** — See why Parsnip can flatten Speed-Gro and Deluxe to the same harvest date, while Melon exposes more stage-day separation.
5. **Before You Craft Hyper Speed-Gro, Run This Crop-Calendar Check** — Compare accessible tiers against a stated harvest deadline, then keep regrowth and personal cost inputs separate from the date calculation.
6. **Speed-Gro Does Not Shorten Regrowth—Here Is the Date That Matters** — Learn what fertilizer can change at first growth, how to calculate whole stage-day reductions, and when an earlier harvest changes a season outcome.
7. **The 10%, 25%, and 33% Trap in Stardew Valley Speed-Gro** — Those labels feed a stage-day calculation rather than subtracting the same percentage from calendar days. Compare the resulting first harvest dates.
8. **Planting Day Decides Whether Speed-Gro Is Worth Using** — Set a crop, planting day, season deadline, and available tier, then check whether the first harvest changes a replant or extra-harvest branch.
9. **A Faster First Harvest Is Not Always a Better Speed-Gro Choice** — The guide compares Speed-Gro, Deluxe, and Hyper without declaring a universal best tier, using stage vectors and crop-calendar examples.
10. **Speed-Gro, Deluxe, or Hyper? Choose the Lowest Tier That Changes the Plan** — Use the crop's stage data, accessible tiers, and fixed regrowth interval to choose only when the calendar outcome changes.

### 候选分类、停留/适配检查与淘汰

| # | 归类机制 | 停留要素与人性驱动 | 停留检查 | 适配检查与处置 |
| ---: | --- | --- | --- | --- |
| 1 | 结论前置 | 冲突（百分比与日期）+ 捷径；懒惰驱动 | 目标读者会因“别看百分比，先看日期”的具体反差停留 | 正文第 1、31、54、81、152–154 行完整兑现；PASS，选定。 |
| 2 | 结论前置 | 冲突；金钱/懒惰驱动 | “先算日期再花材料”是具体选择点 | 正文支持 higher/lower tier 的同日比较；与 #1 的承诺重复，且冒号形式接近最近标题套路；淘汰。 |
| 3 | 反差数字 | 异常 + 终结（Spring 29 出季）；贪婪/懒惰驱动 | “一天差距带来第三次收获”有明确日历信息差 | 只由 Spring 13 Strawberry 例子支持，标题缺少主关键词且容易被读成普遍保证；淘汰。 |
| 4 | 结论前置 | 异常；窥探/好奇驱动 | Parsnip 与 Melon 的对照是可核对的反常识 | 正文兑现，但“差异取决于作物”较宽，停留点弱于 #1；淘汰。 |
| 5 | 损失进入 | 冲突 + 捷径；懒惰/机会成本驱动 | “先做 crop-calendar check”指向明确动作 | Hyper 的可用性、截止日和个人成本输入均有边界；但点名 Hyper 会缩窄主意图，淘汰。 |
| 6 | 自我颠覆 | 冲突；好奇/懒惰驱动 | 直接打断“肥料缩短所有间隔”的常见误解 | 正文完整支持，但“Here Is the Date”不如 #1 直接回答主搜索词；淘汰。 |
| 7 | 自我颠覆 | 异常 + 冲突；愤怒/好奇驱动 | 10/25/33% 与实际日历的落差可停留 | “Trap”比正文语气更强，且可能制造无依据焦虑；淘汰。 |
| 8 | 结论前置 | 捷径；懒惰驱动 | 播种日是实际决定输入 | “Decides”过度绝对，正文还要求 crop、tier、deadline 和 location；淘汰。 |
| 9 | 自我颠覆 | 冲突；懒惰/机会成本驱动 | 先收获更快不等于计划更好 | 正文支持条件性判断，但 “better” 未给出统一价值函数；淘汰。 |
| 10 | 结论前置 | 捷径 + 冲突；懒惰驱动 | 直接给出最低档位选择规则 | 正文第 81、152 行支持，但标题缺少 Stardew Valley，且问句/多项列举与近期标题结构更接近；淘汰。 |

### 最近 3 篇标题套路检查

站点上下文的 live 英文 DOM 观察（只作标题形式核对，不把旧正文当素材）为：

| 公共页面 | 实际标题 |
| --- | --- |
| `https://stardewvalleyplanner.art/carpenter-stardew` | Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades |
| `https://stardewvalleyplanner.art/where-is-robin-stardew-valley` | Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions |
| `https://stardewvalleyplanner.art/fall-crops-stardew` | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |

三篇近期标题的可见套路是“主题后接冒号和功能清单”“问句后接功能清单”“价格数字钩子”。候选 #2、#4、#10 的冒号/问句或多项列举更接近该结构；#7 的数字钩子又带有正文不需要的焦虑。最终 #1 采用动词开头的具体对照，不用冒号、问句、价格/收益数字或 `best`/`fastest`/`tested` 承诺，同时保留自然主关键词 `Stardew Valley Speed-Gro`。

### 两道标题检查与最终表面

- **停留检查：PASS。** “Compare ... Not Percentages”给出可识别的冲突和明确的信息差：同一百分比标签不直接等于同样的日历天数，正文用 Parsnip、Melon 和 Strawberry 三个受限例子兑现。
- **适配检查：PASS。** Title/H1 没有数字、价格、收益、平台效果或普遍最佳承诺；Description 中的三档名称、stage days、first harvest dates 和 fixed regrowth 均可在正文第 13–15、31、45–58、95–120 行及第 23、89、120、127 行找到。

最终 Title：`Compare Stardew Valley Speed-Gro Harvest Dates, Not Percentages`  
最终 H1：`Compare Stardew Valley Speed-Gro Harvest Dates, Not Percentages`  
最终 Description：`Compare Speed-Gro, Deluxe, and Hyper by stage days, first harvest dates, and fixed regrowth intervals. Learn when a tier changes your crop calendar.`

表面记录在 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/seo.json`；Title 63 个字符，Description 148 个字符。身份元数据没有编造作者、日期、测试经历、排名、收益或权限。

## 标题/描述承诺映射

| 表面承诺 | 正文兑现位置 | 结论 |
| --- | --- | --- |
| Compare harvest dates | 第 1、45–58、71–89、95–120、147–154 行 | 有计算输入、首次收获日期、季节分支和可执行选择。 |
| Not percentages | 第 1、9、31、54、81、154 行 | 明确 modifier 不是直接日历折扣，并解释 whole stage-day 与取整。 |
| Speed-Gro / Deluxe / Hyper | 第 13–19、79、95–107、111–120 行 | 三档和 Agriculturist 的适用边界、access 与示例均有正文依据。 |
| Stage days | 第 31–41、45–58、150 行及 Figure 1 | 公式、阶段向量、整日分配和图解对齐。 |
| First harvest dates | 第 45–58、95–120 行及两张图 | Parsnip、Melon、Strawberry 日期均标明 source-based calculation 和假设。 |
| Fixed regrowth intervals | 第 1、23–25、89、120、127、139、148、154 行及 Figure 2 | 明确肥料只影响 first growth/first harvest，不把 4 天缩成 3.6 天。 |
| When a tier changes your crop calendar | 第 71–89、107、120、152–154 行 | 选择条件是日历分支变化，不宣称普适 ROI 或最佳档位。 |

## 公开引用与临时交接

`final/en/public-references.json` 绑定正文 SHA-256 `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`，覆盖正文中的 13 个唯一公开 HTTPS URL，包含 17 个 `{quote, occurrence}` 精确定位。Node 校验器退出码 `0`，真实输出为 `bodyUrls=13`、`referenceCount=13`、`quoteBindings=17`、`missing=[]`、`extra=[]`、`forbiddenPublicTokens=[]`，并检查了每个 quote 在规范化正文中存在、occurrence 合法、hash 长度为 64。

公开来源 URL（与正文/图解主张对应）为：

- <https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english>
- <https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/>
- <https://stardewvalleywiki.com/Speed-Gro?oldid=190630>
- <https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196>
- <https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377>
- <https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411>
- <https://stardewvalleywiki.com/Parsnip?oldid=191123>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>

`final/en/handoff.provisional.json` 只使用公共 canonical URL 和 `body.md`、`seo.json`、`public-references.json`、`assets/en/...svg` 相对资源路径，不带研究日志、内部报告路径、角色记录、canary 或私有访问信息。它的真实状态是：`status=provisional-pending-independent-seo-review`、`userApproval=pending`、`assembly=not-applicable`；没有将技术锁定写成最终 SEO PASS、页面完成或用户批准。

## 地区、隔离与范围边界

- 研究输入记录 `locale=en, country=US`，但精确美国个性化 SERP 地理仍为 **UNVERIFIED**；这不是美国排名或需求已验证的声明。
- 当前任务是英文 content-only，不生成中文 F 产物，不装配现有网站，不称为网站成品。
- 逻辑文件范围遵守本任务目录；底层操作系统 ACL/容器权限隔离没有独立测试，仍为 **UNVERIFIED**。
- 用户终审未进行，故保持 `pending`；生产部署也未进行。

## 本次新增文件清单

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/seo.json`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/public-references.json`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.provisional.json`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-melon-stage-days.svg`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-strawberry-regrowth-calendar.svg`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-en.md`

未修改源正文、媒体清单、源 SVG、旧审核报告、中文材料或网站代码。
