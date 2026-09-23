# E-en title/SEO 独立复核：`pine-tree-stardew`

## 1. 结论摘要

**最终结论：PASS（仅限当前锁定正文的 Title/H1/Description/slug 题文复核；页面、实时 SERP 展示和用户终审不作通过声明）。**

本结论绑定以下两个确定性摘要，任何锁定正文或四个 SEO 字段的字节变化都会使本结论失效：

- `locked/en-body.txt` body SHA-256：`3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1`
- SEO surface SHA-256：`68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7`
  - 计算输入为排序后的紧凑 JSON：`{"description":"Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.","h1":"Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar","slug":"pine-tree-stardew","title":"Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar"}`

**不可替代的未完成项：** 本次没有重新取得 Title 在当前 Google SERP 中的实际显示、截断或改写结果；目标生产路由在既有记录中仍为 404，未装配页面。因此“SERP/title display check”和“live metadata/page binding”均明确标为 **UNVERIFIED**，没有用源代码或旧 SERP 观察冒充实时页面证据。

## 2. 审核身份、范围与输入绑定

- **角色：** E-en title reviewer；只读审核并唯一写入本文件，不修改标题、正文、引用、source、public、tests、package、媒体、页面或部署。
- **审核日期：** 2026-09-22（Asia/Shanghai）。
- **主关键词 / 地区：** `pine tree stardew` / `en-US` / `US`。
- **原始范围：** A-en 将该词记录为 informational/how-to hybrid：识别 Pine Cone → Pine Tree → Pine Tar，获取/种植、stage 4 邻格排错、未施肥与 Tree Fertilizer 边界、成熟后 Tapper/Pine Tar 以及必要用途；不扩成跨树利润排行、所有树百科或 planner 功能页。
- **正文版本：** C raw SHA-256 `b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`；F 锁定报告 SHA-256 `dce34099009e6a285f6c1b2fd2c867d80c3a8471211fd0a7c0c14c4492d3063d`。
- **D/E 前置版本：** D `6101561558b3c6690f10fe0861d441cb7048c6526c797a9bbb7160469a220888`；内容 E `bd4844e6d2f9fe38e7b30e0a77b15ebf5ba505f2da2b44138a10e0e0ac44fd89`；二者均绑定同一 C raw hash。前置内容 E 的 SEOTruth 在标题生成前保持 UNVERIFIED，本报告不把旧结论倒写成标题通过。
- **V7 规则：** `参考规则/标题与描述规则.md` SHA-256 `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710`；`参考规则/七罪引擎.md` SHA-256 `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3`；公开交接规则 SHA-256 `31c73c23f0825b0291d6ed4224a57cbeb8b01b5e4502d2091724d999ba225d9c`。

## 3. F-en 锁定的最终 SEO 表面

| 字段 | 当前锁定值 | 字符数 | 审核状态 |
|---|---|---:|---|
| Title | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | 54 | **PASS** |
| H1 | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | 54 | **PASS** |
| Description | `Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.` | 161 | **PASS（源/契约层）** |
| Slug | `pine-tree-stardew` | 17 | **PASS（项目契约层）** |
| Locale / country | `en` / `US` | — | **PASS（输入一致）** |

字符数按 Python `len()` 计算；当前四个值均为 ASCII，因此字符数与 UTF-8 字节数相同。F 记录的 Title/H1 `54`、Description `161` 与本次独立重算一致。

## 4. 逐字段 SEOTruth 审核

### 4.1 Title：PASS

- **主词识别：** `Pine Tree Stardew Valley` 保留 `pine tree stardew` 的连续词序，并自然补出游戏全名；没有堆叠 `Pine Cone`、`Pine Tar`、`guide` 等同义词。
- **具体承诺：** `Fix Stage 4` 对应锁定正文 H2 与八邻格诊断（body lines 56–64）；`Tap Pine Tar` 对应成熟 Pine + Tapper 输出（lines 9–11、115–138）。
- **题文边界：** 标题没有承诺一个固定未施肥成熟日、最快/最佳树、跨树收益排名、Pine 物理 footprint、Green Rain 转化或 planner 自动模拟；这些被正文明确保留为条件或未解决边界。
- **长度：** 54 字符；当前项目没有 title 截断/后缀逻辑，现有同站英文 Title 实际范围包含 58、67、70、82、85 等值，54 不构成模板长度 blocker。
- **夸大检查：** 未命中 `best`、`fastest`、`easiest`、`guaranteed`、`profitable`、`all` 等无来源最高级或保证词。

### 4.2 H1：PASS

H1 与 Title 字节相同。项目的 `BlogArticleContent` 以 `post.title` 渲染页面级 H1，English route 的 metadata、OG、Twitter 与 Article headline 也从同一 `post.title` 输入；因此该锁定值满足 `Title = H1 = visible page heading = social headline` 的源接口身份要求。页面尚未装配，运行时 DOM 回读仍为 **UNVERIFIED**。

### 4.3 Description：PASS（源/契约层）

Description 的每一项都能在锁定正文中找到可执行支持：

- `Plant a Pine Cone on valid, untilled ground`：body lines 1、35–48；
- `skip watering`：lines 1、39–46、165；
- `inspect all eight neighbors at stage 4`：lines 1、56–79、166；
- `use a normal or Heavy Tapper only after the Pine matures`：lines 1、9–11、115–132、169–170。

它是一个完整但受条件约束的摘要，没有把五夜/两天误写成树苗成熟时间，也没有添加利润、排名或页面能力承诺。161 字符在本项目现有 Description 实际范围内；项目 metadata helper 将输入原样传到 `description`、OG description 和 Twitter description，未发现本地硬编码 155/160 上限。Google 端实际 snippet 选取、截断或改写未在本任务重新取得，保持 **UNVERIFIED**。

### 4.4 Slug：PASS（项目契约层；运行时绑定未验证）

`pine-tree-stardew` 与 `project-interface-spec.md` 锁定的目标 slug 完全一致，lowercase + hyphen 可读，未临场改动既有 URL。当前 checkout 仍未注册该 article identity/registry entry，目标 English production path 的既有回读为 404；因此“该 slug 已被页面实际绑定”是 **UNVERIFIED**，不是本字段的失败。装配时必须使用 English `/pine-tree-stardew` 与 Chinese `/zh/pine-tree-stardew` 的既有路由契约，不应改成 `/zh-CN/...` 或带 trailing slash 的 canonical。

## 5. 一个主意图与题文兑现

### 5.1 主意图结论：PASS

标题看似有两个动词，但它们是同一 Pine Tree how-to 链的连续动作，而不是两个独立搜索意图：

`Pine Cone → Pine Tree → stage-4 diagnosis → mature Pine → Tapper → Pine Tar/use decision`。

锁定正文从开头直接给出该链（line 1），并按 identify、plant、stage-4 diagnosis、growth choice、Tapper/Winter、use/keep 展开；`Fix Stage 4` 是核心故障排错，`Tap Pine Tar` 是成熟后的目标产出。它没有把 PAA 中未核验的“most profitable tree”变成标题承诺，也没有把相邻 Maple/Oak、fruit-tree 3×3 或 planner 功能另立为第二主任务。

### 5.2 题文兑现表

| 标题/描述表面 | 正文精确证据 | 结论 |
|---|---|---|
| Pine Tree / Stardew Valley | lines 1、3–11；Pine Cone → Pine Tree → Pine Tar 关系 | PASS |
| Fix Stage 4 | lines 56–64、70–79、166；八个邻格、对角线和可执行修复 | PASS |
| Tap Pine Tar | lines 9–11、115–138、163、169–170；成熟门槛、normal/Heavy Tapper、Winter production | PASS |
| valid, untilled ground | lines 1、35–48、164 | PASS |
| skip watering | lines 1、39–46、165 | PASS |
| no fixed growth promise | lines 81–113、168；18/24/38/55 冲突保留 | PASS / protective boundary |
| no unsourced superlative | Title/Description 中无最高级、最快、收益排名或保证词 | PASS |

## 6. 七罪引擎、停留与适配独立复核

### 6.1 机制与停留证据：PASS

- **标题机制：** 结论前置（直接亮出 `Fix Stage 4` 与 `Tap Pine Tar`）；不是只贴公式，两个结果均指向正文可执行段落。
- **停留要素：**
  - **异常：** `stage 4` 是读者可观察的卡住状态，body lines 56–62 明确给出成熟邻树阻塞规则；
  - **捷径：** `Fix` 与 `skip watering` 指向先查八邻格、不要把作物浇水习惯带入普通树；
  - **终结/结果：** `Tap Pine Tar` 点明成熟后的实际产出，但没有伪造收益或“best”结论。
- **人性驱动：** 主要落在 **愤怒**（解决“为什么卡在 stage 4”）和 **懒惰**（少走无效浇水、先做八邻格检查）；这是正文真实问题，不是凭空制造焦虑。**贪婪**没有被用于标题，因为正文明确拒绝利润排行；不要求七类驱动全部出现。
- **适配检查：** 标题不含数字；方法、对象、结果和情绪均比对正文，未发现标题比正文更强的承诺。Description 同步通过，未偷偷补入正文没有的条件或结果。

### 6.2 最近三篇同站同语标题去套路：PASS（但保留近邻说明）

从当前 source registry 读取的目标之前最近三篇 English titles（不是实时 SERP title）：

1. `src/blog/blog-post-registry.tsx:321–325` — `Do You Have to Water Trees in Stardew Valley? Check Stage 4 and the Fruit-Tree 3×3`
2. `src/blog/blog-post-registry.tsx:337–341` — `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150`
3. `src/blog/blog-post-registry.tsx:353–356` — `Last Day to Plant in Stardew Valley: Parsnips by Spring 24`

新标题与第 1 篇共享 `Stardew Valley`、tree/stage-4 语境，且都用具体动作而非泛泛“guide”；这是主题邻近，不是同一标题套路。新标题改为 Pine-specific 对象、成熟后 Pine Tar 结果和故障修复，不复制“问题句 + Check Stage 4 + fruit-tree 3×3”，也没有重复最近两篇的数字反差或截止日期结构。因此去套路检查 **PASS**，但不得把该 source-registry 对照写成实时 SERP 去套路证明。

## 7. PublicReference 对齐复核

### 7.1 绑定和 quote/occurrence：PASS

独立读取 F 第 5 节的 8 个 `PublicReference` 行，并在 NFC `locked/en-body.txt` 中重算 19 个 quote。19/19 quote 均精确存在且 occurrence 均为 `1`；body hash 与 F 声明的 `3b53cbcd…` 一致。复核结果如下：

| PublicReference | 覆盖边界 | quote 对齐 |
|---|---|---|
| `wiki-pine-tree` | Pine identity、泛 outside-farm interaction、Pine-specific fertilized five-day claim | 3/3，均 1 次 |
| `wiki-pine-cone` | Pine Cone sources、planting condition | 2/2，均 1 次 |
| `wiki-trees` | 八邻格 stage 4、普通树季节概率、Desert/Ginger Island 例外、泛位置/交互限制 | 4/4，均 1 次 |
| `wiki-pine-tar` | 三地点、用途、item values | 3/3，均 1 次 |
| `wiki-tapper` | normal Pine 五夜、两类 Tapper interval 说明 | 2/2，均 1 次 |
| `wiki-tree-fertilizer` | 已种下后施肥、通用阶段推进/末阶段两晚 | 2/2，均 1 次 |
| `official-1-6-changelog` | town/Beach Farm tunnel planting limits、recipe-level change | 2/2，均 1 次 |
| `site-stardew-valley-trees` | 站内 common-tree / fruit-tree planning distinction | 1/1，均 1 次 |

`site-stardew-valley-trees` 的 body link 使用相对路径 `(/stardew-valley-trees)`，与 PublicReference 的绝对 URL `https://stardewvalleyplanner.art/stardew-valley-trees` 指向同一公开页面；不构成错链。标题主张所依赖的 stage-4 与成熟后 Tapper/Pine Tar 事实均落在上述已映射的正文段落中。

### 7.2 来源支持与保留边界：PASS

- Pine Tar 三地点仍由 `wiki-pine-tar` 承担；没有把 Carpenter’s Shop 误归给 `wiki-pine-tree` 或 `wiki-trees`。
- Pine Tree 只承担泛 outside-farm 与 Pine-specific five-day；Tree Fertilizer 只承担已种下后的通用机制；没有把通用五天倒计时扩大成未施肥固定成熟日。
- Trees 只承担八邻格、普通树成长/地图限制及泛位置；没有把 Pine 误写成果树 3×3 或 Pine physical footprint。
- Official changelog 只作 1.6 planting/recipe context；没有用它证明 Pine Green Rain 转化。
- PublicReference map 是编辑交接证据，不等于页面已经装配或链接目标当前可访问；页面状态仍按下节单列。

## 8. 模板、身份与下游状态边界

### 已通过的源/契约层

- `BlogPostMeta.title` 是非空字符串；Title/H1 可由同一 `post.title` 稳定投影。
- `createPublicPageMetadata` 原样输出 `title`、`description`，并把相同值用于 OG/Twitter；没有品牌后缀或隐式改写需要在本阶段另造版本。
- English route 的 canonical path 由 slug 生成；目标 slug 符合 ProjectInterfaceSpec 的 `/pine-tree-stardew` identity。
- Title 54、Description 161 与现有 source registry 的长度分布兼容；没有发现本项目的硬长度 validator。

### 保持 UNVERIFIED 的下游检查

- Google 当前 Title link 是否显示完整、截断或改写：**UNVERIFIED**；本轮未重跑 SERP。
- 目标页面实际 `<title>`、H1、meta description、OG/Twitter、Article JSON-LD、canonical/hreflang：**UNVERIFIED**；目标路径既有回读为 404，页面尚未装配。
- slug 是否已进入当前 registry/build/export：**UNVERIFIED / NOT DONE**；本审核只确认目标契约，不代替 G 的页面装配。
- 页面、build、deploy、用户终审：**NOT RUN / PENDING**，不在本任务范围内。

## 9. 最终验收

**E-en title/SEO review：PASS，绑定 bodyHash `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1` 与 SEO surface hash `68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7`。**

- Title：PASS
- H1：PASS
- Description：PASS（源/契约层；实时 snippet display UNVERIFIED）
- slug：PASS（项目契约层；运行时 page binding UNVERIFIED）
- 一个主意图：PASS
- 七罪机制、停留、适配：PASS
- 无来源最高级/收益/固定成熟日：PASS
- 最近三篇 source-registry 去套路：PASS
- PublicReference quote/occurrence：PASS（19/19，均 occurrence 1）
- 当前 Google SERP Title 展示/截断/改写：**UNVERIFIED**
- 真实页面 metadata/browser/build/deploy/user approval：**UNVERIFIED / NOT RUN**

后续若 F 修改任一 Title/H1/Description/slug，必须重算 SEO surface hash 后重新交 E；若锁定正文任一字节变化，必须重算 body hash，并按 V7 回到受影响的 D/E/F 环节。
