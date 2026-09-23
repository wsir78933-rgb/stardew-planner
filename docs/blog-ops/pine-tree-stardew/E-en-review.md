# E-en 独立事实、引用、SEOTruth、22 条鉴文与可读性审核：`pine-tree-stardew`

## 1. 审核身份、范围与版本绑定

- **角色：** Agent E-en；独立执行 en-US 候选的事实、公开引用归属、SEOTruth、完整 22 条鉴文、形式指纹、重复、可读性与媒体边界审核。本报告只报告问题、证据和结论，不修改 C。
- **E worker provenance：** task `task_7e26f4e63d41`，dispatch `ctx_d5ab3311ce04`，terminal `term_d8573258-005f-457e-9c39-a73a2ffaf4f9`。
- **审核日期：** 2026-09-22（Asia/Shanghai）。
- **唯一允许写入：** `docs/blog-ops/pine-tree-stardew/E-en-review.md`。未修改 C/D/A/B/spec、source、public、tests、package、媒体、Git、commit、push、deploy 或外部服务。
- **完整读取输入：** 当前 `C-en-draft.md`、`A-en-research.md`、`A-en-supplement.md`、`B-en-layout.md`、`A-media-plan.md`、`project-interface-spec.md`、最新 `D-en-check.md`、旧 `E-en-review.md`；V7 `执行入口.md`、`01-统一工作流.md`、`02-内容生产与质量门.md`、`03-博客页面生成整合.md`、`04-公开交接与页面装配.md`、`参考规则/事实核验与公开引用.md`、`参考规则/22条鉴文规则.md`、`参考规则/标题与描述规则.md`、`参考规则/七罪引擎.md`、`脚本/正文计数.py`。
- **当前 C raw SHA-256（本报告绑定版本）：** `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`。
- **最新 D-en report SHA-256：** `6101561558b3c6690f10fe0861d441cb7048c6526c797a9bbb7160469a220888`。
- **旧结论作废：** 旧 E/D 及 A-en-supplement 中记录的 `ce80bcb77dba1f01f07d5a446c857d97d39ba8f7b8acb3dacc9142b2cd0b3ad3` 版本均不代替本轮审核；旧 E 文件写入前实际 hash 为 `b6f7ca25c37b1cc3e5af87148ba8e9556100f52b6cbe71eed7b68d687d4219fd`。
- **Reader-body boundary：** `C:7–190`；`C:1–5` 为编辑头，`C:6` 为空，`C:191–196` 为 Editor notes，均不属于读者正文。`C:179–190` 的 `Sources` 是合法公开来源模块，纳入链接/ResearchTrace 审核但不计入 reader-bound 机械 2000。
- **失效规则：** C 的任何字节变化（包括措辞、链接、图位、caption）都会使本报告失效；必须重算 C raw hash，并由 D 全量重跑三门、E 复核受影响项和当前完整 22 项。

### V7 输入 hash

| V7 文件 | SHA-256 |
|---|---|
| `执行入口.md` | `7c4ffb4fcf388f5dcc4da46a5bf593182976ed34b78fde02823b333d45041814` |
| `01-统一工作流.md` | `4617c08d2f5b25e4cbac747415703e5494d8b489657079bad2e72eb3fe7e8eec` |
| `02-内容生产与质量门.md` | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` |
| `03-博客页面生成整合.md` | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` |
| `04-公开交接与页面装配.md` | `31c73c23f0825b0291d6ed4224a57cbeb8b01b5e4502d2091724d999ba225d9c` |
| `参考规则/事实核验与公开引用.md` | `56f2d6ea29ae9a0e9384355a9ee368f29676f1d5e45013f81a5bd250b218f2ad` |
| `参考规则/22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ef2181c475ddddd48da54428976d9f573a1` |
| `参考规则/标题与描述规则.md` | `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710` |
| `参考规则/七罪引擎.md` | `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3` |
| `脚本/正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |

## 2. 执行结论

**E-en 内容/事实结论：PASS（仅绑定当前 C raw hash `b847…`）。** 当前修复已正确拆开 C:58 的 Pine Tar 三地点直接归属、Pine Tree 的泛 outside-farm 职责，以及 C:99 的 Tree Fertilizer 通用机制与 Pine Tree 五天结果；没有范围内事实 blocker。该 PASS 不等于 PublicBlogHandoff、页面、媒体、最终 SEO 表面、build、deploy 或用户终审通过。

| 审核面 | 结论 | 证据/边界 |
|---|---|---|
| 唯一 ReaderTask、结构、读者价值 | **PASS** | 保持 `Pine Cone → Pine Tree → Pine Tar` 的 identify → plant → diagnose → grow → tap/use 单一链；H2 顺序与 B-en 一致。 |
| 事实与公开 URL 支持 | **PASS** | 关键页面独立 HTTP/正文回读；C:58/C:99 的来源职责符合当前公开页面正文。 |
| PublicReference `id/label/url/appliesTo/{quote, occurrence}` | **UNVERIFIED** | 当前 C 只有描述性 Markdown 链接和 Sources，没有随同 C hash 冻结的完整 map；Sources 不能代替 occurrence ledger。 |
| V7 22 条鉴文 | **PASS（22/22）** | 逐条独立复核，均无需退回 C 的修辞/结构 blocker；真实媒体缺失另列。 |
| 六类形式指纹、FAQ、CTA、作者/过程残留 | **PASS** | reader boundary 的私有路径、流程标记、FAQ、closing-H2、重复 CTA 均未命中；合法 Sources 保留。 |
| 可读性 | **PASS（有轻微 polish 机会）** | 读者正文诊断 `2360` prose words、`146` sentences、平均 `16.16`、最大 `39`；7 句超过 35 words，但仍可读且为规则+边界合并句。 |
| 图文教学文本结构 | **PASS** | Fig 1 `C:19–23`、Fig 2 `C:72–74` 的职责、alt/caption 和反误读边界符合 B/A。 |
| 六个实际媒体文件 | **UNVERIFIED** | 封面、两张正文 WebP、三个同名 AVIF 全部缺失；不能因图位存在伪造 PASS。 |
| 机械 2000 words | **PASS（仅机械）** | reader-bound `2478 >= 2000`；V7 输出仍要求独立语义审核。 |
| SEOTruth | **UNVERIFIED** | 主关键词和唯一 ReaderTask 已确认；最终 Title/H1/Description 尚未锁定，不能把工作题或 H2 当最终 SEO 表面。 |
| 页面 / browser / build / deploy | **UNVERIFIED / NOT RUN** | 任务明确不要求 UI/ego-browser；未运行本地页面、build、deploy，也不作页面完成声明。 |
| 用户终审 | **PENDING** | 必须在真实现有网站完整页面上另行进行；当前不代表用户已看过或批准。 |

## 3. 任务、结构与范围

- **Primary keyword：** `pine tree stardew`，`locale=en`、`country=US`，来自 A/B 输入，不伪称已由正文密度证明排名。
- **唯一 ReaderTask：** 帮助 en-US 玩家正确识别 Pine Cone → Pine Tree → Pine Tar，取得并种下 Pine Cone，诊断 stage-4 邻格阻塞，区分未施肥与施肥后的成长边界，仅在 Pine 成熟后安装 normal/Heavy Tapper，最后用已核验的 Pine Tar 用途决定保留/砍除。
- **H2 顺序：** `C:9,25,62,87,121,146`，依次对应 identify、plant、stage-4 diagnosis、growth choice、Tapper/Winter、use/keep decision；没有新 FAQ H2 或 generic closing H2。
- **开头：** `C:7` 在第一个 H2 前给出对象链、有效未锄地、无需浇水、stage-4 八邻格、5 nights/2 days 和 Winter 生产。
- **结尾：** `C:167–177` 是执行检查清单，不是祝福或新搜索意图。
- **范围保护：** 没有发布固定未施肥成熟倒计时、跨树收益排名、Pine physical footprint、Pine Green Rain 转化，亦没有 `/\#planner` 正文 CTA；`C:23` 只有不带链接的 layout-tool 边界说明。

## 4. 独立公开 URL 回读

### 4.1 HTTP 状态命令

实际执行的只读命令为（退出码 `0`）：

```sh
for u in \
  https://wiki.stardewvalley.net/Pine_Tree \
  https://wiki.stardewvalley.net/Pine_Cone \
  https://wiki.stardewvalley.net/Trees \
  https://wiki.stardewvalley.net/Pine_Tar \
  https://wiki.stardewvalley.net/Tapper \
  https://wiki.stardewvalley.net/Tree_Fertilizer \
  https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/ \
  https://stardewvalleyplanner.art/ \
  https://stardewvalleyplanner.art/stardew-valley-trees \
  https://stardewvalleyplanner.art/pine-tree-stardew \
  https://stardewvalleyplanner.art/zh/pine-tree-stardew; do
  curl -L --max-time 30 --silent --show-error -o /dev/null \
    -w 'http=%{http_code}\tfinal=%{url_effective}\tbytes=%{size_download}\n' "$u"
done
```

| URL | 回读结果 | 用途/边界 |
|---|---|---|
| `https://wiki.stardewvalley.net/Pine_Tree` | HTTP 200，33557 bytes，标题 `Pine Tree - Stardew Valley Wiki` | Pine Cone → Pine Tree、Pine Tar 5 days/Heavy 2 days、泛 outside-farm interaction、施肥五天和 24-day median；未找到三地点组合。 |
| `https://wiki.stardewvalley.net/Pine_Cone` | HTTP 200，56149 bytes，标题 `Pine Cone - Stardew Valley Wiki` | Pine Cone 获取、valid/tillable un-tilled planting、20% growth、约 18-day median；与其他页的成长统计冲突保留。 |
| `https://wiki.stardewvalley.net/Trees` | HTTP 200，93819 bytes，标题 `Trees - Stardew Valley Wiki` | 八邻格 stage-4、施肥通用行为、20%/Winter/map exceptions、普通树泛位置/交互限制、24/38/55 统计。 |
| `https://wiki.stardewvalley.net/Pine_Tar` | HTTP 200，55553 bytes，标题 `Pine Tar - Stardew Valley Wiki` | 直接列出 Cindersap Forest、Railroad、Carpenter’s Shop 周围；5/2 days、100g/125g、用途与 Tapper 生产。 |
| `https://wiki.stardewvalley.net/Tapper` | HTTP 200，60826 bytes，标题 `Tapper - Stardew Valley Wiki` | Pine Tar 5 nights、Heavy Tapper 机制、Winter production、Foraging Level 4 recipe/placement。 |
| `https://wiki.stardewvalley.net/Tree_Fertilizer` | HTTP 200，47374 bytes，标题 `Tree Fertilizer - Stardew Valley Wiki` | 只能施于已种下 wild-tree seed/sapling、通用阶段推进、末阶段两晚、冬季成长、fruit-tree/Tea Bush 排除。 |
| `https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/` | HTTP 200，69694 bytes，官方标题 | `You can no longer plant trees in town.`、`You can no longer plant trees in the beach farm tunnel.`；原文还含 `tapper (foraging 3→4)`。不当作 Pine 百科。 |
| `https://stardewvalleyplanner.art/` | HTTP 200，86622 bytes | 只支持工具存在/布局能力边界；不支持游戏成长、Tapper 计时或 Pine Tar 计算。 |
| `https://stardewvalleyplanner.art/stardew-valley-trees` | HTTP 200，101999 bytes | 只支持站内通用树布局文章/工具上下文；不替代 Pine 游戏规则来源。 |
| `https://stardewvalleyplanner.art/pine-tree-stardew` | HTTP 404，4414 bytes | 目标英文生产路由当前不存在；不作页面完成声明。 |
| `https://stardewvalleyplanner.art/zh/pine-tree-stardew` | HTTP 404，4414 bytes | 目标中文生产路由当前不存在；本 E 不审中文页面。 |

### 4.2 正文可见内容关键回读

使用 `curl -L ... | python3` 去除 `script/style/noscript` 后读取可见文本，退出码 `0`。关键回读如下：

- Pine Tree：`A Pine Tree is a common Tree that grows from a Pine Cone`；`If fertilized, this takes five days (even in Winter)`；`Pine Trees outside the farm, but not in Pelican Town, can also be tapped or chopped down.`
- Pine Cone：`Cones can be planted in tillable ground outside The Farm. The ground must be un-tilled to plant the seed.`；`A pine cone has approximately a 20% chance...`；`The median time to maturity is about 18 days...`。
- Trees：`a seedling will never grow past stage 4 if there is a mature tree in any of its eight adjacent tiles`；`Fertilized seeds and seedlings will grow even in Winter`；普通树在 Desert/Ginger Island 之外未施肥冬季不成长；泛位置包含 Cindersap Forest、The Mountain、Railroad 等。
- Pine Tar：`Pine Tar can be obtained by tapping Pine Trees ... e.g., in Cindersap Forest, the Railroad, around the Carpenter's Shop`；处理时间 5 days 或 Heavy Tapper 2 days。
- Tree Fertilizer：`already been planted, not on an unplanted tile`；`Most fertilized trees advance one stage...`；`It does not speed up growth of Fruit Trees or Tea Bushes`。
- Tapper：可见正文有 Pine Tar `5 Nights`、Heavy Tapper recipe/“works twice as fast”以及 Pine 树上的 Winter 继续生产。

## 5. 重点事实与来源归属复核

### 5.1 C:58 三地点、Pine Tree 泛职责

当前 C:58 原句：

> You can also encounter Pine Trees growing naturally outside the farm. The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supports the general outside-farm interaction, while the [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) gives examples such as Cindersap Forest, the Railroad, and around the Carpenter’s Shop. The broader [Trees reference](https://wiki.stardewvalley.net/Trees) lists additional common-tree locations, but it also records interaction limits: some town trees are scenery, and trees west of the river cannot be chopped or tapped even though they can be shaken.

独立回读结果：

- Pine Tree 正文中 `Cindersap Forest=false`、`the Railroad=false`、`Carpenter's Shop=false`、`Carpenter’s Shop=false`；它支持 Pine 的泛 outside-farm interaction，但不能独立承担三地点组合。
- Pine Tar 正文中三者均为 `true`，并在同一自然 Pine 句中直接列出三地点；因此三地点的 PublicReference 直接归属 **Pine Tar**，当前 C:58 已正确实现。
- Trees 正文支持 Cindersap Forest、Railroad 等普通树泛位置，以及 Town west of river “cannot be chopped down or tapped, but can be shaken for a seed”；当前 C:58 的 Trees link 只承担泛位置与交互限制，没有把 Carpenter’s Shop 归给 Trees。
- **非 blocker wording note：** `some town trees are scenery` 不是 Trees 页的逐字表达；官方 changelog 说许多 town trees 是 tree objects 但不能被砍，Trees 页直接表达的是 west-of-river 交互限制。若 C 后续因其他原因重新打开，建议把该短语收窄为可直接定位的 interaction-limit wording 或绑定官方来源；本轮不改 C，且不影响三地点/Pine Tree/Trees 三方职责的正确性。

**C:58 结论：事实与近邻来源归属 PASS；PublicReference quote/occurrence 仍未冻结。**

### 5.2 C:99 通用施肥机制与 Pine 五天双来源边界

当前 C:99 原句：

> Tree Fertilizer is for an already planted wild-tree seed or sapling. Apply it to the planted Pine; do not treat it as a pre-plant seed coating, and do not use it as a fruit-tree growth rule. The [Tree Fertilizer reference](https://wiki.stardewvalley.net/Tree_Fertilizer) says it advances most wild trees one stage each night, with the final stage taking two nights. Under that documented behavior, the [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) says a normal Pine can mature in five days, even in Winter.

独立回读结果：

- Tree Fertilizer 页直接支持“已种下后施肥”、大多数 wild trees 每晚推进一阶段、末阶段两晚、冬季可成长，并明确 fruit trees/Tea Bushes 不适用。
- Pine Tree 页直接支持 Pine-specific 的 `five days (even in Winter)`；不能只把 `normal Pine` 五天归给 Tree Fertilizer 通用页。
- 当前 C:99 的 Tree Fertilizer link 紧邻通用机制，Pine Tree link 紧邻 Pine-specific 五天结果，符合双来源边界。
- 五天只表示已施肥的普通 Pine 路径；不能扩大成未施肥固定成熟倒计时，也不能扩大到果树、Tea Bush、Mahogany 或 Mystic。

**C:99 结论：事实与双来源职责 PASS；PublicReference quote/occurrence 仍未冻结。**

## 6. 事实 / PublicReference 审核表

下表是对当前 C 的独立事实审计。`近邻` 表示当前 Markdown 链接或相邻正文位置；它不是最终冻结的 `quote/occurrence` map。所有 URL 均为本轮实际打开并回读的公开 URL。

| ID / C 位置 | Claim（当前正文主张） | PublicReference URL | 近邻 | 边界 / 结论 |
|---|---|---|---|---|
| F-01 `C:7,13,15–17` | Pine Cone → common Pine Tree → mature Pine + Tapper → Pine Tar；不是 fruit-tree sapling path。 | Pine Tree；Pine Cone；Pine Tar；Tapper | `C:7` 4 个链接；`C:13` Pine Cone/Pine Tree；`C:17` Pine Tar/Tapper | 对象链和成熟门槛有支持；未声称购买 sapling。**PASS**。 |
| F-02 `C:27–39` | Pine Cone 获取：摇/砍 Pine、农场成熟树挖取、Garbage Cans、Woodskip pond population 9 的 1–5 个、Traveling Cart 100g–1,000g；Foraging 1 的摇/砍时序区别。 | Pine Cone；Trees | `C:29` Pine Cone page；`C:37` Trees page | 获取列表服务主任务；Traveling Cart 明确是 conditional；没有扩成 Pine Cone recipe/trade encyclopedia。**PASS**。 |
| F-03 `C:41–52` | 种在游戏接受的有效、未锄地；普通树苗不需每日浇水；周围无需全部清空但成熟邻树仍可能阻塞。 | Pine Cone；Trees | `C:43` Pine Cone；`C:45` Trees | “valid” 保留条件；不承诺 plant anywhere，不把 common-tree 规则扩成 fruit-tree 3×3。**PASS**。 |
| F-04 `C:54` | 1.6 禁止在 town 和 Beach Farm tunnel 种树。 | Official 1.6 changelog | 官方 link 直接在该句后 | 只作地图限制背景；不扩大成完整 Pine 百科或 1.6.15 逐事实保证。**PASS**。 |
| F-05 `C:56–60,144` | 农场外可遇到自然 Pine；三地点示例归 Pine Tar；Trees 负责泛普通树位置/交互限制。 | Pine Tree；Pine Tar；Trees | `C:58` 三个职责分开的 links；`C:144` Pine Tree/Pine Tar/Tapper | 三地点直接 Pine Tar；Pine Tree 只承担泛 outside-farm；Trees 承担泛位置和限制。`scenery` 用词为非 blocker wording note。**PASS**。 |
| F-06 `C:62–85` | stage 4 停滞时检查中心周围全部八邻格；成熟邻树阻塞；一格间距只是布局建议。 | Trees | `C:66` 八邻格；`C:85` Trees | 八邻格是规则；one-tile gap 没有被写成 Pine footprint 或 fruit-tree 3×3。**PASS**。 |
| F-07 `C:87–95` | 未施肥普通树 Spring/Summer/Fall 每晚 20% 推进、stage 4 更久；普通 Winter 和 Desert/Ginger Island 例外。 | Trees | `C:91`、`C:93` Trees | 保留季节/map 条件；未发布固定成熟日。**PASS**。 |
| F-08 `C:97–106` | Tree Fertilizer 必须在种下后施用；通用阶段行为与末阶段两晚；normal Pine 施肥路径五天、包括 Winter。 | Tree Fertilizer；Pine Tree | `C:99` 两个 link 分别紧邻通用/特定 claim | 通用机制与 Pine-specific 五天职责拆开；不是未施肥倒计时，不适用于 fruit tree/Tea Bush。**PASS**。 |
| F-09 `C:108–119` | Pine Tree/Pine Cone/Trees 的未施肥成长统计冲突，不压成一个保证。 | Pine Tree；Pine Cone；Trees | `C:110` 三个直接 links | 18/24/38/55 只作为冲突说明，未被写成保证。**PASS**。 |
| F-10 `C:121–138` | 成熟 Pine 上 normal Tapper 5 nights，Heavy Tapper 2 days；生产时间不等于树成熟时间；normal Tapper recipe 为 Foraging 4。 | Tapper；Pine Tar；Official 1.6 changelog | `C:125` Tapper；`C:127` changelog + Tapper；`C:138` Pine Tar + Tapper | interval、成熟门槛、recipe-level change 来源相符；Heavy Tapper 不是 growth modifier。**PASS**。 |
| F-11 `C:140–145` | Pine Tapper 冬季继续生产；自然树仍受地图交互限制。 | Pine Tree；Pine Tar；Tapper | `C:142` 三个 links；`C:144` boundary | Winter production 与 mature Pine 区分清楚；不保证所有可见 town tree 可 tap。**PASS**。 |
| F-12 `C:146–159` | Pine Tar 用途：Loom、Speed-Gro、Rain Totem、Exotic Foraging Bundle、Floppy Beanie、Woodskip request。 | Pine Tar | `C:150` Pine Tar page | 只选与 keep/tap 决策相关的用途；未扩成完整配方百科。**PASS**。 |
| F-13 `C:161–165` | Pine Tar 100g base、Tapper Profession 125g、无 Artisan bonus；单价不是跨树收益排名。 | Pine Tar | `C:163` Pine Tar page | 价格是 item value；没有回答 “most profitable tree”，也没有伪造同条件比较。**PASS**。 |
| F-14 `C:23,60` | layout tool 可帮助预留/规划空间；站内 general-tree guide 是可选上下文。 | `https://stardewvalleyplanner.art/`；`https://stardewvalleyplanner.art/stardew-valley-trees` | `C:23` 无链接工具边界；`C:60` 1 个站内链接 | 只作布局上下文，不声称成长、Tapper、Pine Tar simulation；不是 planner-first CTA。**PASS**。 |

### PublicReference freeze 状态

当前 C 中没有 `PublicReference`、`id`、`appliesTo`、`versionNote`、`quote`、`occurrence` 或 `bodyHash` 字段（扫描退出码 `0`）。当前 Markdown 链接统计为：**45 个 Markdown URL links = 43 个正文/来源 public-site links + 2 个正文图位路径**；目标 public/site destinations 为 8 个。URL 出现次数为 Pine Tree `7`、Pine Cone `6`、Trees `10`、Pine Tar `7`、Tapper `7`、Tree Fertilizer `2`、official changelog `3`、站内 general tree `1`，另有两个图位路径各 `1`。这些只是链接计数，**不是** V7 的 occurrence。

因此 PublicReference 仍为 **UNVERIFIED**。F 或后续交接必须在最终 normalized body hash 上全量冻结至少：

- `wiki-pine-tree`：Pine identity、泛 outside-farm interaction、Pine-specific fertilized five-day claim；
- `wiki-pine-tar`：Cindersap Forest / Railroad / Carpenter’s Shop 三地点、Pine Tar production/use/value；
- `wiki-tree-fertilizer`：已种下后施肥、通用阶段推进、末阶段两晚和 Winter；
- `wiki-trees`：八邻格、普通树泛位置/交互、未施肥概率与 map exceptions；
- `wiki-pine-cone`、`wiki-tapper`、`official-1-6-changelog` 的各自 appliesTo 与版本边界。

每项的 `quote` 必须是最终 C 正文的精确原文片段，`occurrence` 必须按规范化正文从 1 开始重新计数。不得沿用 `ce80…` 的旧定位，也不能只修一项 occurrence。

## 7. V7 22 条鉴文逐条结论

以下均绑定当前 C raw hash `b847…` 和 reader boundary `C:7–190`。这是内容/风格鉴文；实际媒体存在性、最终 SEO 表面和页面状态在其他章节单独判定。

| # | 结果 | 位置/原句 | 独立判断 |
|---:|---|---|---|
| 1 | **PASS** | `C:45–54,78–85,91–95` | 保留会改变种植/成长决策的地图、季节、邻格例外；没有大量无关假想反驳。 |
| 2 | **PASS** | `C:27–177` | 获取、种植、排错、成长、Tapper、用途都推进唯一 Pine 链；没有把 PAA/相关搜索全部灌入正文。 |
| 3 | **PASS** | `C:31–35` 列表、`C:103–106` 表、`C:167–177` checklist | 三种组织形式承担不同查询/执行职责，没有只换词的相邻排比。 |
| 4 | **PASS** | `C:13,45,70,101,131` | 对比/让步均绑定 common-vs-fruit、邻格、布局、成长和 Tapper 条件，没有重复机械模板。 |
| 5 | **PASS** | 全文稳定使用 Pine Cone/Pine Tree/Pine Tar/normal Tapper/Heavy Tapper | 正式术语保持一致，没有为躲重复而乱换名称。 |
| 6 | **PASS** | `C:7–177` | 没有虚构第一人称经历或情绪曲线；平静教程语气与体裁匹配。 |
| 7 | **PASS** | `C:47–52,68–85` | 说的是具体错误和可观察检查，没有无来源的“所有人都以为”。 |
| 8 | **PASS** | `C:13,45,60,70,101,131,159` | “not X” 用于明确 common/fruit、footprint、growth、Tapper/use 边界，不构成高密度表演。 |
| 9 | **PASS** | `C:35,91–95,108–119` | Traveling Cart 条件、Winter/map exception、成长统计冲突均明确标注；已核实事实没有被人为弱化。 |
| 10 | **PASS** | `C:34–37,91,99,110,125,131,163` | 百分比、天数、价格、等级和 median 都有公开来源或明确冲突边界；无虚构实测数字。 |
| 11 | **PASS** | `C:7–177` | 没有“我曾失败/我学到”等脆弱经历。 |
| 12 | **PASS** | `C:62–119,167–177` | checklist 保留八邻格、地图/季节、施肥、成熟、Tapper 类型等前提，不是假万能步骤。 |
| 13 | **PASS** | `C:119,159,165` | 判断句解释 false date、keep/tap 和 ranking 的具体决策后果，没有每段升华。 |
| 14 | **PASS** | `C:27–177` | 列表、表格、解释、排错和判断节奏有功能差异，不是随机拆句凑“真人感”。 |
| 15 | **PASS** | `C:66–85,110–119` | 结论来自 Trees/Pine 页面与可观察邻格/冲突，而非感觉或直觉。 |
| 16 | **PASS** | `C:7` | 首三句直接给对象链、种植条件、诊断、生产间隔和下一步。 |
| 17 | **PASS** | `C:7,13,17,29,37,43,45,54,58,66,85,91,93,99,110,125,127,138,142,150,163` | 链接总体紧邻事实；C:58 的职责拆分和 C:99 的双来源已修复；冻结 map 仍另列 UNVERIFIED。 |
| 18 | **PASS** | `C:7–177` | normal/Heavy Tapper、Pine Tree/Pine Tar 等概念不混淆。 |
| 19 | **PASS** | 全文手读 | en-US 表达自然直接，没有中文句式迁移或翻译腔。 |
| 20 | **PASS（文本层）** | `C:19–23,72–74` | 图注明确是 explanatory illustration、不是 gameplay screenshot；实际资产缺失不被本条伪造为存在。 |
| 21 | **PASS** | `C:167–177` | 结尾是可执行检查，不是 generic blessing/motivational slogan。 |
| 22 | **PASS** | `C:161–165` | 价值讨论回到具体 keep/tap 和 comparison boundary，没有宏大命题。 |

**22 条结算：PASS 22 项，FAIL 0 项，UNVERIFIED 0 项。** 这不覆盖 PublicReference freeze、实际六媒体、最终 Title/H1/Description、页面或用户终审。

## 8. 形式指纹、污染、FAQ/CTA、作者过程与重复

### 8.1 ResearchTrace / 过程残留

对 `C:7–190` 扫描私有路径与流程标记，修正后的 probe 退出码 `0`，真实输出：

```text
private_paths=[]
process_markers=[]
reddit=[]
faq=[]
closing_h2=[]
recipe_trade=[]
```

旧的第一次 marker probe 因审计脚本 tuple unpacking 错误退出码 `1`，未用于结论；立即修正后再次执行并取得上述退出码 `0`。正文没有 `SERP`、`PAA`、`AI Overview`、`V7`、`agent`、内部路径、`PublicReference`、`occurrence` 等编辑过程标记；`Sources` 是合法公开来源模块，不应按关键词误杀。

### 8.2 FAQ、CTA、作者与内部字段

- **FAQ：PASS / not required。** reader boundary 没有 FAQ heading/token；B/spec 没有要求独立 FAQ，新增会重复 H2。
- **Planner CTA：PASS at body scope。** `C:23` 是无链接的可选 layout-tool 边界说明，`C:60` 是一条 general-tree 内链；没有 `/#planner` CTA，也没有 simulator/growth/timer/output claim。
- **Author/date/read time/metadata：未写入 reader body，正确保持未知。** 它们属于 handoff/page 字段，不能自行补造。
- **禁止扩项：PASS。** C 只提到“most profitable”作为未解决边界、Pine physical footprint 作为排除边界和 disputed growth days 作为冲突边界；没有新增排名、固定未施肥成熟日、Pine footprint、Green Rain 转化或 planner 正文 CTA。

### 8.3 Repetition

独立 block probe（`C:7–178`、Sources 前；移除 headings、Figure caption、链接 URL、table separator；保留 alt/正文信息；近重复阈值 `0.78`）退出码 `0`：

```text
reader_boundary=C:7-C:178 before Sources
qualifying_prose_blocks=45
exact_duplicate_groups=[]
near_duplicate_pairs_at_ratio>=0.78=[]
duplicate_long_sentences=[]
repetition_probe_exit=0
```

**Repetition：PASS。** 对象名的必要重复、表格与最终 checklist 的不同查询职责不构成重复 blocker。

### 8.4 六类形式指纹

独立 fingerprint probe 退出码 `0`：

- 破折号/短横线：仅见价格范围、列表分隔和 Sources 说明，未见过密装饰用法；**PASS**。
- 粗体：集中在对象链、边界和 checklist 标签；**PASS**。
- 装饰符号：只见必要的对象链 `→`；**PASS**。
- 助手残留：`[]`；**PASS**。
- 填充短语：`[]`；**PASS**。
- 泛泛积极结尾：无祝福/宏大收束；**PASS**。

## 9. 可读性与机械长度

### 9.1 可读性诊断

只读 Python diagnostic 取 `C:7–178`，排除 H2/H3、Markdown 图、Figure caption、表格行、空行和 URL，保留可见英文正文；退出码 `0`，输出：

```text
prose_words=2360
prose_sentences=146
avg_sentence_words=16.16
median_sentence_words=15.5
max_sentence_words=39
over_35_words=7
long_sentence_lengths=39,38,36,37,36,37,38
Flesch_RE_heuristic=62.9
Flesch_Kincaid_grade_heuristic=8.5
readability_exit=0
```

手读结论：**PASS（轻微 polish opportunity，不是 blocker）**。较长句位于 `C:7,37,58,60,91,142,165`，均是在同一句中绑定规则和边界；若 C 因其他授权原因重开，可局部拆句，但不得借可读性名义添加事实、CTA 或扩大范围。

### 9.2 V7 机械计数

V7 whole-file diagnostic（只排除 `Sources`，包含 C 编辑头/Editor notes，非验收值）退出码 `0`：`mechanical_units=2695`，raw hash `b847…`。

reader-bound 命令为：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py <(python3 - <<'PY'
from pathlib import Path
lines = Path('docs/blog-ops/pine-tree-stardew/C-en-draft.md').read_text(encoding='utf-8').splitlines()[6:190]
out = []
for line in lines:
    if line.strip() == '## Sources':
        break
    if line.lstrip().startswith('*Figure:'):
        continue
    out.append(line)
print('\n'.join(out))
PY
) --locale en
```

退出码 `0`，真实 JSON 核心输出：

```json
{
  "mechanical_units": 2478,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "omitted_line_counts": {
    "headings": 21,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 72,
    "frontmatter": 0
  },
  "sha256_raw": "4f659861040b6ca6a24b40f0ca6076ccf921e862d41e7b8f22b865a3a9d03a61",
  "sha256_nfc_lf": "4f659861040b6ca6a24b40f0ca6076ccf921e862d41e7b8f22b865a3a9d03a61"
}
```

`4f6598…` 是派生的计数输入 hash，不是 C raw hash。机械 Length **PASS only**；不证明语义长度、PublicReference、媒体、SEO 或页面。

## 10. 图文与实际媒体

### 10.1 文字图位

- **Fig 1 `C:19–23`：PASS。** 位于对象链之后、详细 Tapper timing 之前；alt/caption 说明 Pine Cone → planted common-tree stages → mature Pine + Tapper/Pine Tar，并明确是 explanatory illustration、不是 gameplay screenshot、不展示固定成长倒计时。
- **Fig 2 `C:72–74`：PASS。** 紧邻八邻格 stage-4 诊断；alt/caption 说明中心树苗、八邻格、成熟阻塞邻树和实用间隔，并明确 one-tile gap 不是 fruit-tree 3-by-3 clearance/Pine footprint。
- **Cover 不计作正文教学图。** 符合 V7/B/A-media-plan。

### 10.2 六个实际文件

实际存在性命令退出码 `0`，真实输出：

```text
MISSING public/blog/pine-tree-stardew-cover.webp
MISSING public/blog/pine-tree-stardew-cover.avif
MISSING public/blog/illustrations/pine-tree-seed-to-tar.webp
MISSING public/blog/illustrations/pine-tree-seed-to-tar.avif
MISSING public/blog/illustrations/pine-tree-stage-four-neighbor.webp
MISSING public/blog/illustrations/pine-tree-stage-four-neighbor.avif
media_presence_command_exit=0
```

实际媒体结论必须是 **UNVERIFIED**，不是 PASS。缺文件不能证明 `1672×941`、lossy `VP8 `、封面 `≤1.25 MiB`、正文图 `≤400 KiB`、同 stem AVIF、授权/署名、真实画面、alt/caption 一致、HTTP 200 或 rendered visibility。A-media 计划和 Markdown 图位不能替代实际资产回读。

## 11. SEOTruth

| Surface | 结果 | 独立证据/边界 |
|---|---|---|
| Primary keyword | **PASS as input** | A/B 锁定 `pine tree stardew`、`locale=en`、`country=US`；精确词在 C 编辑头，不把 keyword density 当 V7 门槛。 |
| 唯一 ReaderTask | **PASS** | 正文执行 identify → plant → diagnose → growth choice → mature Tapper → use/keep 单链。 |
| Title | **UNVERIFIED / not locked** | C 明确不是最终 Title；无 `PublicBlogHandoff` 或最终 SEO 字段。 |
| H1 | **UNVERIFIED / not locked** | 当前 C 只有工作 H2，不代表页面 H1。 |
| Description | **UNVERIFIED / not locked** | 没有最终 Description，不能批准 snippet promise。 |
| FAQ/FAQPage | **PASS at content boundary / downstream not run** | 正文不需要 FAQ；未生成 FAQPage schema，也不作页面声明。 |
| OG/canonical/schema/author/date/slug page binding | **UNVERIFIED downstream** | 未运行 page/build/browser；project spec 禁止猜测这些字段。 |

F 若进入锁稿，必须先在同一 `b847…` 候选上完成 D/E 通过，再按标题与描述规则生成候选并交 E 题文复核。任何 Title/H1/Description 都不得新增固定未施肥成熟日、收益排名、Pine footprint、Green Rain 转化或 planner 能力承诺。

## 12. 页面、build、deploy、用户终审状态

- **页面状态：UNVERIFIED / downstream。** 生产英文和中文目标 URL 的本轮 HTTP readback 均为 404；没有页面装配证据。
- **Browser/ego-browser：NOT RUN / 不属于本任务验收。** 不以 Markdown、URL status 或 source 检查代替真实页面验收。
- **Build/typecheck/test：NOT RUN。** 本任务只审内容材料和公开来源，不运行会生成 `out`/Next artifacts 的命令。
- **Deploy/production write：NOT RUN / 未授权。** 没有部署、commit、push、数据库或外部服务写入。
- **用户终审：PENDING。** 只有真实现有网站的完整文章页面完成桌面/移动页面审核后，才提供给用户终审；本报告不代表用户批准。

## 13. 版本、命令与 Git 边界回执

### 13.1 核心命令回执

| 命令/检查 | 退出码 | 真实关键结果 |
|---|---:|---|
| `shasum -a 256 C/A/B/A-media/spec/D/old-E` | `0` | 当前 C `b847…`；最新 D `610156…`；旧 E `b6f7…`；输入 hash 已在第 1 节/本地回执中核对。 |
| `shasum -a 256` V7 入口、01/02/03/04、事实引用、22 规则、标题描述、七罪、计数脚本 | `0` | 与第 1 节 V7 hash 表一致。 |
| `curl -L ...` 11 个公开 URL 状态循环 | `0` | 9 个资料/站内 URL HTTP 200；英文/中文目标 URL HTTP 404。 |
| 公开页面可见正文 `curl | python3` 回读 | `0` | Pine Tree/Pine Tar/Trees/Tree Fertilizer/Tapper/官方 changelog 关键片段已回读。 |
| C `PublicReference/quote/occurrence` 扫描 | `0` | 空；当前没有冻结 map。 |
| 纠正后的 ResearchTrace/FAQ/closing-H2/recipe-trade probe | `0` | 所有列表 `[]`。 |
| 初次 marker probe（脚本 tuple unpacking 错误） | `1` | 未用于结论；随后以修正 probe 退出码 `0` 重跑。 |
| 形式指纹 probe | `0` | 助手残留/填充短语/装饰符号命中为空；必要粗体、箭头和来源破折号保留。 |
| Repetition block probe | `0` | 45 qualifying blocks；exact/near/long duplicate 均为空。 |
| 可读性 Python diagnostic | `0` | `2360` words、`146` sentences、Flesch heuristic `62.9`、grade `8.5`。 |
| V7 whole-file counter | `0` | `2695`，仅诊断值。 |
| V7 reader-bound counter | `0` | `2478`，mechanical floor PASS。 |
| 六文件 media presence loop | `0` | 六个计划文件全部 `MISSING`；结论保持 UNVERIFIED。 |

### 13.2 写入前后 Git 边界

- 写入前 `git status --short --untracked-files=all` 退出码 `0`：目标目录已有 14 个 untracked 文件（A-en research/supplement、A-media、A/B/C/D/E en/zh、spec），没有额外目标外路径。
- 写入前 `git diff --stat -- docs/blog-ops/pine-tree-stardew`、`git diff --name-status -- docs/blog-ops/pine-tree-stardew`、`git diff --check -- docs/blog-ops/pine-tree-stardew` 均退出码 `0`；目标目录整体是 untracked baseline，普通 diff 无输出不代表文件不存在。
- 本轮唯一覆盖的是 `docs/blog-ops/pine-tree-stardew/E-en-review.md`；没有 stage、reset、clean、commit、push 或其他 Git 写入。
- 最终验收必须再次确认：目标目录仍只有允许的 14 个 untracked 路径、C/D/A/B/spec/media 等保护文件 hash 不变、`git diff --check` 无空白诊断；`git diff --no-index --check /dev/null E-en-review.md` 对 untracked 文件预期返回 `1`，只要无 whitespace diagnostic 就不算失败。

## 14. Final E-en state

绑定当前 C raw SHA-256 `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`：

- **E-en 内容/事实/引用归属：PASS。** C:58 和 C:99 的当前修复经公开 URL 正文回读成立；无范围内事实 blocker。
- **22 条鉴文：PASS 22/22。**
- **ReaderTask / structure / repetition / readability：PASS。** 可读性只有轻微局部 polish 机会，不是 blocker。
- **PublicReference quote/occurrence freeze：UNVERIFIED。** 必须在最终 normalized body hash 上全量冻结，不能沿用 `ce80…`。
- **Mechanical 2000 words：PASS，仅机械，reader-bound `2478`。**
- **Textual figure teaching：PASS；实际六媒体：UNVERIFIED，全部缺失。**
- **SEOTruth：UNVERIFIED。** 主关键词/唯一 ReaderTask PASS；最终 Title/H1/Description 未锁定。
- **页面/browser/build/deploy：NOT RUN / NOT CLAIMED；目标生产 EN/ZH 路由当前 HTTP 404。**
- **用户终审：PENDING。**

F 可把本报告作为当前 C 版本的 E 内容审核证据继续处理，但不得把本报告直接当作已冻结 PublicBlogHandoff、页面成品、媒体通过、部署完成或用户批准。

## 15. 最终写回验收回执

本节记录报告写入后的真实只读回执；保护文件 hash 与第 1 节绑定值一致。

```text
C-en-draft.md             b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819
D-en-check.md             6101561558b3c6690f10fe0861d441cb7048c6526c797a9bbb7160469a220888
A-en-research.md          177356682880fbd950a484bb0ba4ca1a6063a80cc698d4ce52305c547383c5b5
A-en-supplement.md        d45a7690d1e22e2269f82ac07b0db57aaff4198df7514cf872b5cac38469f5f0
B-en-layout.md            6f9f7a1420d1e7a0a83c327ee7611aec327396d21653ae7098db99792b504c62
A-media-plan.md           34feee6056dc7bcf877526e90eb92c7711c44dd97903e82b3645f5be381c8202
project-interface-spec.md 055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f
```

- 上述 hash 命令退出码：`0`。
- `test -s docs/blog-ops/pine-tree-stardew/E-en-review.md`：退出码 `0`，报告非空。
- `awk '/[[:blank:]]$/{...}' E-en-review.md`：退出码 `0`，无尾空格。
- `git status --short --untracked-files=all`：退出码 `0`，仍只有目标目录既有的 14 个 untracked 文件，未新增目标外路径：

```text
?? docs/blog-ops/pine-tree-stardew/A-en-research.md
?? docs/blog-ops/pine-tree-stardew/A-en-supplement.md
?? docs/blog-ops/pine-tree-stardew/A-media-plan.md
?? docs/blog-ops/pine-tree-stardew/A-zh-research.md
?? docs/blog-ops/pine-tree-stardew/A-zh-supplement.md
?? docs/blog-ops/pine-tree-stardew/B-en-layout.md
?? docs/blog-ops/pine-tree-stardew/B-zh-layout.md
?? docs/blog-ops/pine-tree-stardew/C-en-draft.md
?? docs/blog-ops/pine-tree-stardew/C-zh-draft.md
?? docs/blog-ops/pine-tree-stardew/D-en-check.md
?? docs/blog-ops/pine-tree-stardew/D-zh-check.md
?? docs/blog-ops/pine-tree-stardew/E-en-review.md
?? docs/blog-ops/pine-tree-stardew/E-zh-review.md
?? docs/blog-ops/pine-tree-stardew/project-interface-spec.md
```

- `git diff --check -- docs/blog-ops/pine-tree-stardew`：退出码 `0`，无空白诊断。
- `git diff --no-index --check /dev/null docs/blog-ops/pine-tree-stardew/E-en-review.md`：退出码 `1`，这是 `/dev/null` 与 untracked 报告的预期内容差异码；无 whitespace diagnostic，不是质量 FAIL。
- 保护文件与当前 C/D hash 未漂移；没有 stage、reset、clean、commit、push、deploy 或外部写入。

第一次 post-write checkpoint 的 E 报告 hash 为 `6c2cdade14db04440e2104ad5119efc340f8ecf8946b886309eaf2ada98a6d7d`；随后只追加本节真实回执，因此最终报告字节 hash 必然不同，不能把该 checkpoint 当作最终 E 文件 hash。
