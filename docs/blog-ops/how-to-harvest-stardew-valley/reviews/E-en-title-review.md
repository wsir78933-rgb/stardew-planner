# Review Report: English Title, H1 & SEO Independent Review

- **Role**: E (Independent Reviewer / 独立审核)
- **Date**: 2026-10-13
- **Target Keyword**: `how to harvest stardew valley`
- **Reviewed File**: `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json`
- **Reviewed SEO SHA-256**: `056c12d29a69df38ce475e151fd081764fd29fa71f37fd6c690ed90c832c3ce7`
- **Locked Body File**: `docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md`
- **Locked Body SHA-256**: `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
- **Public References File**: `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-public-references.json`
- **Public References SHA-256**: `2a1739dad9e9e51943e9b0dde64a886eb80cbbdfca97fe5927ec055ddd2f678e`
- **Target Locale & Country**: `en` (US)
- **Reviewer Terminal Handle**: `term_d0dab364-a2b6-4afe-9abb-09e92f9f38cd`
- **Coordinator Terminal Handle**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **Task ID**: `task_d5524a3aec59`
- **Dispatch ID**: `ctx_3c5536bf3ab2`
- **Review Verdict**: **PASS (完全通过，附装配元数据与封面 Alt 提示)**

---

## 1. 独立性与锁定基准核对

1. **角色独立性**:
   - 角色 E 独立于 F（锁稿与标题）、C（写作）、D（写后检查）、T（翻译）、M（媒体）及主协调者。
   - E 对 F 提交的 10 个候选标题生成与筛选过程进行了独立复核，重算了 `en-seo.json` 与锁定正文的 SHA-256 哈希值。
2. **版本一致性**:
   - `locked/en-body.md` 的 SHA-256 与 E 在正文独立审核中批准的哈希值 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101` 完全一致，未篡改任何字节。
   - `writing/en-figure.svg` 哈希为 `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661`，与正文完全对齐。

---

## 2. 题文兑现与 SEO 真实性审核 (SEOTruth)

### 2.1 最终选定标题与 H1
- **Title**: `How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe`
- **H1**: `How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe`
- **单字段与渲染一致性**:
  - 本项目 `BlogPostMeta` 规范使用单一 `title` 字段，前端组件将其渲染为文档页面唯一 H1，`titleEqualsH1` 设为 `true`，无字段分裂。
- **搜索意图与题文兑现 (SEOTruth)**:
  - 核心关键词：准确包含主意图关键词 `how to harvest in stardew valley`。
  - 承诺兑现：副标题直接点出文章最具操作价值的分类断言——防风草直接右键收获，而甘蓝等特定作物需要挥动镰刀。正文第 1 段和第 1、2 节对这两项操作提供了详尽无误的操作指导与键位说明。
  - 无夸大承诺：标题未出现“最快升级”、“最佳赚金路线”、“终极自动化”等正文未承诺的内容，客观、克制且具吸引力。

### 2.2 最近 3 篇英文去套路检查
复核 `src/blog/blog-post-registry.tsx` 中最新发布的三篇英文博客标题：
1. `what-to-grow-in-greenhouse-stardew`: `What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting`（套路：`Choose by A, B, and C`）
2. `stardew-fruit`: `Stardew Fruit: Find Its Source Before Buying Seeds`（套路：`Find X before Y`）
3. `oak-tree-vs-maple-stardew`: `Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree`（套路：`A or B names the thing`）

- **判定**: 当前选定标题 `How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe` 完全规避了上述三种句式模板，采用具体作物操作对照，去套路核查合格。

### 2.3 元描述 (Meta Description) 审核
- **Description 内容**:
  `Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back.`
- **核查判定**:
  - 长度适中（228 字符 / 41 词），精炼覆盖了 PC 按键（右键/X）、五种镰刀作物、生长天数计算法则（排除播种当天）以及缺水顺延机制。
  - 所有表述均在锁定正文中有直接、准确的事实支撑，无第二搜索意图扩散，SEO 真实性判定通过。

---

## 3. 公开引用 (Public References) 独立验证

- **引用清单文件**: `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-public-references.json`
- **引用项总数**: 18 条
- **正文精确锚定核对**:
  - 通过自动化程序对 `locked/en-body.md` 进行全文检索，全部 18 条引用的 `appliesTo.quote` 均在规范化正文中**唯一精确匹配（occurrence = 1）**。
  - 覆盖了 Steam 社区防风草讨论、论坛 X 键映射、维基按键表、作物种植说明、基础镰刀、黄金镰刀、铱金镰刀、1.6.9 官方变更日志、防风草生长时间、温室规则以及本站关联指南。
  - 未泄漏任何内部检索过程、私有 Token、抓取缓存或 operation-store 路径。

---

## 4. 媒体资产视觉与 Alt 独立核验

独立读取了 M 角色光栅化产出的候选图片（`media/en-figure-candidate.png` 与 `media/cover-candidate.png`）：

1. **正文信息图 (`en-figure-candidate.png`)**:
   - 尺寸: 1672 × 941
   - 视觉质量: 文本清晰锐利，层级明确，布局与几何卡片结构工整。
   - 22 处文字节点与 `en-media.json` 严格一致，准确传达了手摘（Right-Click/X）、镰刀（Left-Click/C/Iridium 1.6）、巨型作物（斧头3击/15-21）、支架阻挡及第28天枯萎机制。
   - 正文 `figcaption` 以合规的 `Schematic:` 开头，无自我解说编辑腔。
2. **封面图 (`cover-candidate.png`) 与 Alt 判别**:
   - 视觉内容真实判别:
     - 左侧为种植绿叶蔬菜的耕地与一箱橙色块根作物（防风草/胡萝卜）；
     - 中间绘有三只大南瓜，南瓜右侧放置了一把**长柄楔形利刃工具（视觉呈现为斧头/扁铲 Axe/Spade）**；
     - 右侧为黄色麦穗、一把带有半圆形弧刃的长柄镰刀（Scythe）、木制葡萄/啤酒花支架（Trellis）以及带有玻璃天窗的农舍/温室建筑。
   - **Alt 文本微调提示**:
     - `en-seo.json` 中 Cover Alt 现为：`"Illustration of a farm: leafy crops in tilled soil beside a crate of orange roots, three pumpkins and a hoe, rows of yellow stalks with a scythe and a vine trellis, and a brown-roofed building with plants in its windows."`
     - 画面中三只南瓜旁边的工具实际上是用于收获巨型南瓜的**斧头 (axe)**，而非锄头 (hoe)。建议在后续 PublicBlogHandoff 冻结及页面装配时，将 Alt 文本中的 `three pumpkins and a hoe` 修正为 `three pumpkins and an axe`（中文译文对应调整为“三只南瓜与一把斧头”），以保证图文细节与游戏机制完全吻合。

---

## 5. 项目装配必要元数据提示 (Assembly Prerequisites)

- 本站 `src/blog/blog-post-registry.tsx` 的 `BlogPostMeta` 规范要求必须包含 `readTimeMinutes: number` 与 `featured: boolean`。
- 当前短文纯正文词数为 1326 词，按常规英文阅读速度（约 200–220 wpm）估算，`readTimeMinutes` 建议设为 `6`，`featured` 设为 `false`。
- 本报告已将此项前置提示给协调者与组页角色，在生成公开交接与页面注册表时务必补齐，不得作为缺失字段阻碍装配。

---

## 6. 审核结论与后续流程推进

1. **审核结论**: **PASS (英文题文与 SEO 完全通过)**
2. **当前批准字段摘要**:
   - `title` / `h1`: `How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe`
   - `description`: `Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back.`
   - `slug`: `how-to-harvest-stardew-valley`
   - `bodyHash`: `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
   - `seoHash`: `056c12d29a69df38ce475e151fd081764fd29fa71f37fd6c690ed90c832c3ce7`
3. **下一步执行**:
   - 发送状态消息至协调者，确认 E-title 审核通过。
   - 执行 `orca orchestration ask` 阻塞等待独立翻译 Agent T 产出中文译文（正文、SEO、图注、alt、图中文字）。
