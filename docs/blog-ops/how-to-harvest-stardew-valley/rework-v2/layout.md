# 《星露谷物语收获指南》Rework-V2 独立布局与媒体执行卡 (Layout Action Card)

- **执行角色**：独立布局规划员（Role B / Layout Reworker）
- **协调员终端**：`term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**：`term_69fef97d-d313-497c-8411-5535d023b651`
- **任务 ID**：`task_4032dbddd510`
- **派发上下文**：`ctx_50e96a6d8a78`
- **执行日期**：2026-10-13
- **唯一工作树**：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **下游交接对象**：英文撰写员（Role C）、媒体制作员（Role M）、中文翻译员（Role T）

---

## 1. 任务元数据与边界 (Metadata & Boundaries)

| 字段 | 设定值 | 依据与说明 |
|---|---|---|
| **目标主词 (Target Keyword)** | `how to harvest stardew valley` | 严格保持原有关键词，不改变搜索意图 |
| **文章 URL 路径 (Slug)** | `/how-to-harvest-stardew-valley` | 沿用已有站内路由，不改变已有 URL |
| **文章类型 (Article Type)** | 教程指南 (Actionable Guide) | 以 PC 为主要操作教程，兼顾通用手柄与移动端映射 |
| **英文正文目标字数** | **1,000 – 1,400 英文词** (短文) | 原稿 1326 词已满足短文标准；聚焦核心动作，不注水无依据内容 |
| **中文译文目标** | 依据英文定稿逐段自然翻译 | 采用社区中文维基条目推荐译名，不单独设字数门槛 |
| **本轮允许修改范围** | 仅 `layout.md` 与 `layout/section-manifest.json` | 严禁改动正文、源码、公共媒体、SEO 元数据或旧版评审记录 |

---

## 2. 主意图与读者主任务 (Search Intent & Reader Task)

### 2.1 主搜索意图与主任务
- **搜索意图**：读者想知道在《星露谷物语》中如何判断作物成熟并把它们收下来，区分徒手采摘与镰刀收割，以及处理巨大作物和棚架阻挡。
- **读者主任务**：
  > “读者能准确辨认成熟的农作物形态，以 PC 操作为主（兼顾主机/移动端已核映射）完成单株采摘与连续走动收获，掌握镰刀收割作物名单与 1.6 铱镰刀能力，正确采伐巨大作物并规划棚架通道，快速排除无法收获的常见阻碍。”

### 2.2 严格剔除项 (Explicit Exclusions)
- ❌ **武器战斗属性与伤害数值**：不包含镰刀 1–3、13、20 点攻击力数值。
- ❌ **杂草割草干草概率与小麦掉干草**：不包含割杂草掉干草概率，不包含小麦 40% 掉干草数据。
- ❌ **工具升级与死亡掉落历史**：不讲铁匠铺不可升级历史或 1.4/1.6 死亡掉落规则。
- ❌ **祝尼魔屋与全自动采收**：不展开祝尼魔小屋机制。
- ❌ **巨大作物概率养成教程**：不展开 3×3 每日 1% 形成概率数学模型（仅保留斧头采伐动作）。
- ❌ **机器加工与采集加成**：不包含小桶/罐头瓶/复制晶石机收集历史，不包含 1.6.9 采集者与花盆品质。
- ❌ **未验证断言**：不写“绿色加号光标”、“无动画即未成熟”、“右键是唯一安全键”、“背包同品质判定”等无出处断言。

---

## 3. 篇幅规划与字数预算 (Word Budget & Pacing)

目标总词数控制在 **1,000 – 1,400 英文词**。

```
┌────────────────────────────────────────────────────────────────────────┐
│ Total Target: 1,000 - 1,400 words (Actionable High-Density Tutorial)  │
├────────────────────────────┬──────────────┬────────────────────────────┤
│ Section                    │ Target Words │ Focus                      │
├────────────────────────────┼──────────────┼────────────────────────────┤
│ Intro & Immediate Answer   │ ~100 words   │ Direct controls summary    │
│ H2-1: Recognizing Maturity │ ~250 words   │ Sprite stage & days count  │
│ H2-2: Hand Harvesting      │ ~300 words   │ Single pick & hold-and-walk│
│ H2-3: Scythe Harvesting    │ ~250 words   │ Scythe crop list & 1.6 tool│
│ H2-4: Special Crops        │ ~250 words   │ Giant crops & trellises    │
│ H2-5: Troubleshooting      │ ~200 words   │ Concise blocker fixes      │
└────────────────────────────┴──────────────┴────────────────────────────┘
```

---

## 4. 章节结构与执行大纲 (5 个 H2 核心章节)

大纲控制为 **5 个核心 H2 章节**（严格 `<= 6`），按读者游玩认知顺序展开。

### 【前言】快速解答 (Introduction & Immediate Answer)
- **目标字数**：~100 words
- **读者收获**：前三句直接给出采收口诀：常规蔬菜靠上去按交互键徒手采摘（PC 右键/X）；特定作物（如甘蓝菜、小麦）需手持镰刀挥击；3×3 巨大作物使用斧头。
- **事实支撑**：`FACT-01`, `FACT-03`, `FACT-08`

---

### 【H2-1】如何识别作物是否可以收获 (How to Tell When Crops Are Ready to Harvest)
- **目标字数**：~250 words
- **配图位置**：正文插图 1 (`media-mature-crops`)
- **读者收获**：学会识别作物的最终成熟精灵图，并依据播种日历与浇水规则推算成熟期。

#### H3-1.1: 观察成熟阶段精灵图 (Visual Signs: Identifying the Final Harvest Stage Sprite)
- **操作要点**：
  - 作物经历若干生长阶段（Stages），达到最终“收获阶段”（Harvest Stage）时显示成熟精灵图。
  - **实证示例**：如防风草（第 5 阶段）与南瓜（第 6 阶段），成熟时在耕地上展现完整成熟的作物精灵图外观，此时即可采摘。
  - *写作约束*：严禁笼统概括为“饱满果实”，不写“无动画等于未成熟”，不写“绿色加号”。
- **事实支撑**：`FACT-06`

#### H3-1.2: 计算生长天数与缺水停长 (Calculating Harvest Days and Unwatered Delays)
- **操作要点**：
  - **日历规则**：播种当天不计入生长天数。成熟日 = 播种日 + 种子标称天数（需每日浇水）。
  - **示例**：防风草需 4 天生长，春 1 播种并浇水，每日浇水则在春 5 清晨成熟。
  - **缺水停长**：作物每天需浇水才能推进生长。若某天未浇水，作物不会枯死，但当天停止生长，成熟期顺延 1 天。
- **事实支撑**：`FACT-07`

---

### 【H2-2】如何徒手采摘普通作物 (How to Harvest Standard Crops by Hand)
- **目标字数**：~300 words
- **读者收获**：以 PC 为主掌握单株交互键与连续走动技巧，了解控制台与移动端的通用映射。

#### H3-2.1: 单株采摘按键（以 PC 为主） (Single-Crop Harvesting by Platform)
- **操作要点**：
  - **PC 平台**：站在成熟作物旁，按鼠标右键（Right-Click）或键盘 `X` 键触发 Check/Do Action 采收；左键（Left-Click）与 `C` 键为使用工具/放置物品键。
  - **主机手柄**：对应平台的通用 Check/Do Action 键（Xbox 为 `A`，PlayStation 为 `Cross`，Switch 为 `A`）。
  - **移动端**：使用通用点击交互（Tap to action）；移动端无专属采收按键。
- **事实支撑**：`FACT-01`, `FACT-05`

#### H3-2.2: 连续走动采摘与边收边种 (Rapid Harvesting: The Hold-and-Walk Technique)
- **操作要点**：
  - **PC 走动采摘要诀**：长按鼠标右键并保持鼠标光标远离角色（Forum quote: `hold right click with the mouse not near your character`），在田间走动会自动采收角色脚下地块的成熟作物。键盘 `X` 映射为相同交互键。
  - **边收边种**：如果角色手中持有种子，该长按走动操作在采收脚下地块的同时会自动播种；若手中无种子则正常采收。
- **事实支撑**：`FACT-02`

---

### 【H2-3】如何使用镰刀收割特定作物 (How to Harvest Designated Crops with a Scythe)
- **目标字数**：~250 words
- **读者收获**：明确哪些作物必须用镰刀收割，以及 1.6 铱镰刀对耕地作物的收割能力。

#### H3-3.1: 必须使用镰刀的作物举例 (Crops That Require a Scythe to Harvest)
- **操作要点**：
  - 手持镰刀站在作物旁，按下使用工具键（PC 左键/`C`，手柄工具键，移动端选中镰刀后点击）。
  - **常见核实作物**：甘蓝菜 (Kale)、苋菜 (Amaranth)、小麦 (Wheat)、未碾米 (Unmilled Rice)、纤维种子 (Fiber Seeds)。
  - *写作约束*：作为常见例子呈现，不声明为唯一封闭名单；彻底删除武器伤害数值与割草概率，不写小麦 40% 干草。
- **事实支撑**：`FACT-03`

#### H3-3.2: 1.6 铱镰刀在耕地上的收割能力 (The 1.6 Iridium Scythe on Tilled Soil)
- **操作要点**：
  - 1.6 版本通过耕种精通（Farming Mastery）获得铱镰刀。
  - **耕地收割能力**：铱镰刀可收割其挥击范围内**耕地上种植的任何成熟作物**（grown on tilled soil within swing range），将普通蔬菜也纳入大范围挥镰收割。
- **事实支撑**：`FACT-04`

---

### 【H2-4】特殊作物收获：巨大作物与棚架通道 (Harvesting Special Crops: Giant Crops and Trellises)
- **目标字数**：~250 words
- **配图位置**：正文插图 2 (`media-trellis-paths`)
- **读者收获**：掌握斧头采伐巨大作物的方法，以及规划棚架通道确保每株作物可触及。

#### H3-4.1: 巨大作物的斧头砍伐规则 (Harvesting Giant Crops with an Axe)
- **操作要点**：
  - 3×3 同种作物结合成的巨大作物，必须使用**任意斧头 (Any Axe)** 连续砍击 **3 次**进行采收。
  - 砍破后掉落 **15 到 21 个普通品质**作物。
  - 巨大作物在换季时**不会枯萎**，可按需砍伐。
  - *写作约束*：聚焦收获动作（斧头 3 下、15–21 掉落），不展开负面工具对比或全生长品种。
- **事实支撑**：`FACT-08`

#### H3-4.2: 棚架作物通路规划 (Maintaining Reachable Paths Around Trellis Crops)
- **操作要点**：
  - 棚架作物（青豆 Green Bean、啤酒花 Hops、葡萄 Grape）在活株状态下具有实体碰撞，玩家无法穿行走过（枯死后方可穿行）。
  - **通路规划建议**：收获时角色必须能走到与作物相邻的地块。规划种植时建议采用双行留道或留出人行通道，确保每一株棚架作物都能被靠近采收。
  - *写作约束*：双行留道作为实用建议呈现，不写“严禁 3×3 布局”等强制规则。
- **事实支撑**：`FACT-09`

---

### 【H2-5】排错：常见无法收获问题诊断 (Troubleshooting Harvest Issues)
- **目标字数**：~200 words
- **读者收获**：精简实用的排错指引，对照解决实际卡壳，不重复前文。
- **核心排错点**：
  1. **检查是否因漏浇水而停长**：若作物未到成熟期且无法采摘，检查是否之前有漏浇水导致生长推迟。
  2. **检查工具匹配**：甘蓝菜等作物无法徒手拔取，需改用镰刀；巨大作物需用斧头。
  3. **检查换季枯萎**：换季第 1 天非跨季作物枯萎死亡，枯株需用镰刀清理；季末 28 日应及时采收。
  4. **检查站位与背包空间**：检查是否被棚架作物挡住无法靠近；检查背包物品栏是否全满导致无法拾取。
- **事实支撑**：`FACT-01`, `FACT-03`, `FACT-07`, `FACT-09`, `FACT-10`

---

## 5. 媒体配图规划与资产绑定 (Media Allocation & Recommendations)

*注：以下文件路径为建议 Role M 制作 staging 的参考路径，最终绑定以 M 交付为准。Caption 与 Alt 仅提供语义需求，最终成文由 Role C 撰写，Role T 翻译。*

```
┌────────────────────────────────────────────────────────────────────────┐
│ Visual Media Allocation (Recommendations for Role M & Semantic Needs)  │
├─────────────┬────────────────────────────────┬────────────────────────┤
│ Placement   │ Staging Asset (Recommended)    │ In-Article Role        │
├─────────────┼────────────────────────────────┼────────────────────────┤
│ Cover /     │ how-to-harvest-stardew-valley- │ Article Cover:         │
│ Header      │ cover.webp (.avif)             │ Autumn evening farm,   │
│             │ Source: press-farm-evening.png │ ripe pumpkins & paths  │
├─────────────┼────────────────────────────────┼────────────────────────┤
│ Figure 1    │ how-to-harvest-stardew-valley- │ In H2-1:               │
│ (In-Body)   │ mature-crops.webp (.avif)      │ Detail patch of mature │
│             │ Source: press-farm-evening     │ pumpkins on tilled soil│
├─────────────┼────────────────────────────────┼────────────────────────┤
│ Figure 2    │ how-to-harvest-stardew-valley- │ In H2-4:               │
│ (In-Body)   │ trellis-paths.webp (.avif)     │ Farm walking path      │
│             │ Source: press-multiplayer-2    │ between trellis rows   │
└─────────────┴────────────────────────────────┴────────────────────────┘
```

### 媒体卡 1：文章封面 (Article Cover)
- **建议资源路径**：`public/blog/how-to-harvest-stardew-valley-cover.webp` (及配套 `.avif`)
- **素材来源**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-farm-evening.png`
- **画面要素**：秋季黄昏农场、成熟南瓜田、田埂通道与木质棚架。
- **C 撰写语义要求**：Alt 描述黄昏农场的南瓜田与田间过道；Caption 提示作物沿田间通道成熟分布。

### 媒体卡 2：正文插图 1 - 成熟作物田块 (Figure 1: Mature Crop Patch)
- **建议资源路径**：`public/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` (及配套 `.avif`)
- **素材来源**：`press-farm-evening.png` 成熟南瓜田细节裁剪。
- **插入章节**：`【H2-1】如何识别作物是否可以收获` 节内。
- **C 撰写语义要求**：Alt 描述耕地上排列的成熟南瓜；Caption 说明成熟作物在地表呈现出清晰的最终成熟精灵图。

### 媒体卡 3：正文插图 2 - 棚架通道与田间动线 (Figure 2: Trellis Pathways)
- **建议资源路径**：`public/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` (及配套 `.avif`)
- **素材来源**：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-multiplayer-2.png` 局部重点裁剪。
- **插入章节**：`【H2-4】特殊作物收获：巨大作物与棚架通道` 中 `H3-4.2` 附近。
- **画面要素**：高大木制棚架行中间留有宽阔的人行泥土通道。（*注：实机图左下含 Bok Choy 标识与角色，仅描述画面实景，不可宣称其为按键动作序列*）。
- **C 撰写语义要求**：Alt 描述木质棚架行与作物田之间的人行过道；Caption 解释因活体棚架不可通行，留出通道以便角色触及采收每一株作物。

---

## 6. 写作与翻译指引 (Guidelines for C & T)

### 6.1 写手 Role C 执行要点
1. **纯正读者口吻**：无 5 类编辑腔（不写“根据维基”、“未经验证”、“本文不讨论…”、“示意图不代表…”）。
2. **纯净收获主题**：不涉及战斗攻击力、割草干草率、小麦掉草、机器加工、自动化。
3. **字数范围**：严格控制在 **1,000 – 1,400 英文词**。

### 6.2 翻译 Role T 规范译名对照
| 英文原名 (English) | 推荐规范中文译名 | 严禁使用的旧版/不规范译名 |
|---|---|---|
| **Kale** | **甘蓝菜** | ❌ 羽衣甘蓝 |
| **Powdermelon** | **霜瓜** | ❌ 霜花瓜 |
| **Rice Shoot** | **稻苗** | ❌ 米苗 |
| **Ancient Fruit** | **上古水果** | ❌ 远古水果 |
| **Golden Scythe** | **金色的镰刀** | ❌ 金镰刀 |
| **Quarry Mine** | **采石场矿井** | ❌ 采石场矿洞 |
| **Keg** | **小桶** | ❌ 酿造桶 |
| **Preserves Jar** | **罐头瓶** | ❌ 腌酱桶 |
| **Crystalarium** | **宝石复制机** | ❌ 复制晶石机 |
