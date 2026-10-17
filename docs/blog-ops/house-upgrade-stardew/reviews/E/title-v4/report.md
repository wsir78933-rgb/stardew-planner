# E 独立复核：house upgrade stardew 英文题文与 SEOTruth 审核报告（v4 终审）

审核门：**PASS**。问题数：**0**。

后续状态声明：译文（Role T）、页面装配（Role G）、真实页面 DOM、SERP 展示与用户终审均处于 **pending**；生产部署处于 **not-deployed**。本报告通过结论严格且仅限于当前锁定英文正文对应的 Title / H1 / Description / slug / OG 题文真实性核验，不代替后续阶段签署通过。

---

## 一、审核身份、授权与输入哈希绑定

- **审核角色**：E（独立题文与 SEOTruth 审核）。独立执行，与 A、B、C、D、F、T、G 及协调者均不相同。
- **任务 ID**：`task_652d18e6b9fc`
- **Dispatch ID**：`ctx_34986df99cbf`
- **终端 Handle**：`term_2fb61edc-2643-47a6-993f-adec12d2f2e7`
- **协调者 Handle**：`term_661abce7-55fd-4570-8bf5-970c0451dd23`
- **协调者输入确认与授权**：已收到协调者消息 `msg_c2b398dd294c` 与 `msg_7a8448256a28`，确认英文锁稿 `lock/en/body.md` SHA-256 为 `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`，SEO 候选文件 `seo/en/seo-candidate.json` SHA-256 为 `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58`，合格字数 1085 经官方计数器实读通过；本角色 E 仅接收前置输入状态，不以 F 候选选择理由或作者自评代替判断，独立开展全量 SEOTruth 审核。
- **体裁与意图**：教程与升级指南。主关键词 `house upgrade stardew`。语言与地区：英文，美国国家级（US/en）。单主意图：农舍各档材料与费用投入、单任务准备路径、房间用途与后续装修的区别。
- **双确定性绑定哈希**（任何正文或表面字段字节变动均使本结论失效）：
  - **锁定正文 SHA-256**：`f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`（对应 `lock/en/body.md` 与 `content/en/draft-v4.md`，10,046 字节，NFC/LF/UTF-8）
  - **SEO 表面紧凑 JSON SHA-256**：`7efcec963346a418ced31f5f181e37486a7e20fdbda20c9e379db79ba4505ac1`
    - 计算输入为排序后的紧凑 JSON：`{"description":"The first farmhouse upgrade is 10,000g and 450 Wood, the second is 65,000g and 100 Hardwood, and the third is 100,000g. In 1.6 the second payment replaced 50,000g and 150 Hardwood. Each upgrade takes three days. After the second upgrade, a renovation is a separate order and finishes immediately.","h1":"House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier","slug":"house-upgrade-stardew","title":"House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier"}`

### 输入文件校验汇总表（`shasum -a 256` 退出码均 `0`）

| 文件路径 | SHA256 Checksum | 绑定说明与状态 |
|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | 审核对象锁定正文（与 draft-v4 同字节） |
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | D 三门与 E 鉴文已通过正文原稿 |
| `docs/blog-ops/house-upgrade-stardew/lock/en/lock-record.json` | `b5bb88478dd133b02d8e68733e24fefb2a179b3ed200042d1e7e94cb2bf5edb3` | F 英文锁稿技术记录 |
| `docs/blog-ops/house-upgrade-stardew/lock/en/length-report.md` | `e2b0a69287bddd541fcf6370a4ea0757015a815d5fc67f6e96a38ea1ede18793` | 官方字数验收报告（合格计数 1085） |
| `docs/blog-ops/house-upgrade-stardew/seo/en/seo-candidate.json` | `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58` | 待审核选定 SEO 表面 |
| `docs/blog-ops/house-upgrade-stardew/seo/en/title-candidates.md` | `f2ab571ed4fd873e4d166158e5f11eaa2641a1f2ae0e1eb2d760f9bf998fde94` | F 创作过程 10 方向记录（仅作比对） |
| `docs/blog-ops/house-upgrade-stardew/handoff/pending-en/public-blog-handoff.en.json` | `ae2b45c95090433c3538f8f6eec617dc1b03739ea3782c643ce3c3ab05afaf36` | 待冻结公开交接候选 |
| `/Users/wusir/Desktop/博客-V7修订版/参考规则/标题与描述规则.md` | `8bcbefa889e3db9c73ed34b8cb05df0f7ecda33e5ea28ab982607f95d959f99d` | V7 标题与描述规则基准 |
| `/Users/wusir/Desktop/博客-V7修订版/参考规则/七罪引擎.md` | `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3` | V7 七罪引擎生成与质检规范 |
| `/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md` | `193a4287bac554215059af2dd319ee1c895488371cde81bfe758c79c5cd75c17` | V7 流程与角色边界 |
| `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` | `ff3145fe73c929b23cafe893f19f5a6f1b370ef2de7be8e1556b22d03c8a992f` | V7 质量门与正文计数门槛 |
| `/Users/wusir/Desktop/博客-V7修订版/04-公开交接与页面装配.md` | `976de586c2bf9e5a06b3783320c403e8a9eb2bc63467a8e9d884dffcebbe3005` | V7 锁稿交接与装配规则 |

---

## 二、选定 SEO 表面核查汇总

| 字段 | 当前选定值 | 字符数 (ASCII) | 审核结论 | 对应页面/模板映射机制 |
|---|---|---:|---|---|
| **Title** | `House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier` | 67 | **PASS** | 传给 `createPublicPageMetadata` 作为页面 `<title>` |
| **H1** | `House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier` | 67 | **PASS** | `BlogArticleContent` 直接渲染 `<h1>{post.title}</h1>` |
| **OG Title** | `House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier` | 67 | **PASS** | `createPublicPageMetadata` 原样映射至 `openGraph.title` 与 `twitter.title` |
| **Description** | `The first farmhouse upgrade is 10,000g and 450 Wood, the second is 65,000g and 100 Hardwood, and the third is 100,000g. In 1.6 the second payment replaced 50,000g and 150 Hardwood. Each upgrade takes three days. After the second upgrade, a renovation is a separate order and finishes immediately.` | 296 | **PASS** | 传给 `<meta name="description">`、OG/Twitter description 及文章摘要段落 |
| **Slug** | `house-upgrade-stardew` | 21 | **PASS** | 契约路由匹配，未发生命名冲突；页面尚未装配 |
| **Locale / Country** | `en` / `US` | — | **PASS** | 与 SERP 观察及前置研究地区一致 |

---

## 三、逐字段 SEOTruth 独立审核与正文精确支撑

### 3.1 Title：PASS

- **主词完整性与自然度**：标题以 `House Upgrade Stardew:` 开头，完全覆盖目标主关键词 `house upgrade stardew` 的连续词序，冒号后自然展开具体事实，无机械堆砌同义词（如未堆叠 `farmhouse`、`Robin`、`cost`、`guide`）。
- **具体承诺与正文兑现**：
  - `65,000g and 100 Hardwood` 对应锁定正文第 1 行（`65,000g and 100 Hardwood for the second`）、第 8 行费用表（`| 2 | 65,000g ... | 100 Hardwood ... | 3 |`）、第 11 行（`moved from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood`）以及第 37 行（`10,000g + 65,000g = 75,000g, with 450 Wood and 100 Hardwood`）。
  - `the Second Tier` 准确指代农舍第二档升级（即由 1 级农舍升级至带婴儿房的 2 级状态），对应正文第 55 行的 `pay the gold and materials for your next tier`。
- **边界与禁令控制**：
  - 没有把 3 档工期笼统合并为“3 天完工”。
  - 没有将总支出（如 14,500g 或 32,500g）混淆为木材单价。
  - 没有复活已在 v4 删除的“付款日起算”或“付款当天房间状态”。
  - 未包含任何绝对化无例外营业禁令。
  - 严密规避 `best`、`fastest`、`easiest`、`guaranteed` 等无来源最高级或夸大形容词。
- **长度与显示**：67 字符（纯 ASCII），符合英语可读性与主流 SERP 展示习惯；项目既有英文文章 Title 长度跨越 54 至 85 字符，67 字符在正常标准区间内，且项目无硬编码截断逻辑。

### 3.2 H1 与 OG Title：PASS

- H1 与 Title 字符逐字相同（67 字符）。
- 经代码审查 `app/(en)/[slug]/page.tsx`、`app/(en)/layout.tsx` 与 `src/components/blog/blog-article-content.tsx`：
  - 页面级标题 `<h1>` 由 `BlogArticleContent` 取用 `post.title` 渲染；
  - 元数据通过 `createPublicPageMetadata` 处理，将 `post.title` 赋予 `title`、`openGraph.title` 与 `twitter.title`；
  - 根布局 `layout.tsx` 中 `metadata.title` 为纯文本 `"Stardew Valley Farm Planner"`，不存在 `title.template`，因此不会追加任何品牌后缀；
  - 满足 `Title = H1 = OG Title = Twitter Title` 的确定性一致性要求。

### 3.3 Description：PASS

Description 全文 296 字符（纯 ASCII），由 4 个完整、严谨且受严格条件约束的陈述句构成，逐句在锁定正文中得到 100% 精确支撑：

1. **承诺句 1**：`The first farmhouse upgrade is 10,000g and 450 Wood, the second is 65,000g and 100 Hardwood, and the third is 100,000g.`
   - **正文精确支持**：
     - 正文第 1 行：`Robin charges 10,000g and 450 Wood for the first farmhouse upgrade, 65,000g and 100 Hardwood for the second, and 100,000g for the third`
     - 正文第 7–9 行费用表：第 1 档 `10,000g` 与 `450 Wood`；第 2 档 `65,000g` 与 `100 Hardwood`；第 3 档 `100,000g`。
2. **承诺句 2**：`In 1.6 the second payment replaced 50,000g and 150 Hardwood.`
   - **正文精确支持**：
     - 正文第 11 行：`In 1.6 the second house upgrade moved from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood ([Version History](https://stardewvalleywiki.com/Version_History)).`
3. **承诺句 3**：`Each upgrade takes three days.`
   - **正文精确支持**：
     - 正文第 1 行：`Each upgrade takes three days ([Carpenter's Shop](https://stardewvalleywiki.com/Carpenter%27s_Shop)).`
     - 正文第 7–9 行：费用表中每一档单独标注 `3` 天工期。
     - **核查判定**：明确使用 `Each upgrade`，准确表述为“每档升级耗时 3 天”，彻底排除了“三档共需 3 天”的歧义合并。
4. **承诺句 4**：`After the second upgrade, a renovation is a separate order and finishes immediately.`
   - **正文精确支持**：
     - 正文第 67 行：`After the second farmhouse upgrade, Robin offers house renovations. You order one and it finishes immediately.`
     - 正文第 71 行：明确将升级（`Choose the third upgrade's row when you want the cellar`）与装修（`Choose Remove Crib or Add Dining Room when you want those changes`）界定为不同的独立操作。

- **长度与项目适配判定**：
  - 描述长度为 296 字符。经查阅 `src/blog/blog-post-registry.tsx`，现有已发布英文文章的 description 广泛存在 215、224、234、241、245、253 字符等长段落；
  - 协调者指令明确要求“不机械套160字符规则”；
  - 该描述承担着文章摘要段落（`p.blog-article-description`）的功能，完整闭环了三档升级费用、1.6 关键版本变动、单档工期以及升级与装修的分界，没有任何废话或未核验承诺，判定为合格。

### 3.4 Slug：PASS

- `house-upgrade-stardew` 与任务要求、`ProjectInterfaceSpec.md`（第 86 行）及统一工作流契约完全吻合。
- 经查 `src/blog/blog-post-identities.ts`，当前 `blogPostSlugs` 尚未包含该 slug，不存在任何命名冲突。
- **未验证项保留**：目标生产路由 `https://stardewvalleyplanner.art/house-upgrade-stardew` 在本地工作树仍未装配代码，当前请求为 404，本报告明确将其标记为 **UNVERIFIED / PENDING**，不以契约一致伪造部署完成。

---

## 四、七罪引擎与停留机制独立复核

对照 `/Users/wusir/Desktop/博客-V7修订版/参考规则/七罪引擎.md` 与 `标题与描述规则.md` 逐条判定：

### 4.1 机制归类与停留要素

- **核心机制**：**结论前置**（直接给出 2 级升级的最新价格与材料结论），兼具**反差数字**（亮出 65,000g 与 100 Hardwood）。
- **停留要素**：
  - **金钱**：明确标明 `65,000g`，读者直观了解金币投入门槛；
  - **异常**：在 1.6 版本更新中，2 级农舍由过去的 `50,000g + 150 Hardwood` 调整为 `65,000g + 100 Hardwood`（金币增加 1.5 万，硬木减少 50 根）。老玩家或查阅了旧攻略的玩家在看到这一数字组合时会立即产生“与旧认知不符”的疑虑并停下确认。
- **人性驱动**：
  - **傲慢**（以为自己完全了解旧版价格，被新版本实际变动打停）；
  - **懒惰**（希望一眼获取权威确切账单，避免买错木材或携带不足金币导致往返浪费）。

### 4.2 两道生死质检

1. **停留检查**：
   - *读者刷到会停吗？* **会**。目标读者搜索 `house upgrade stardew` 主要是为了规划农舍升级材料与预算。标题直接点名最容易记错的第二档当前版本实际投入（65,000g 与 100 硬木），形成强烈的信息差和注意力停留点，正文第 1 行与第 11 行完全接得住。
2. **适配检查**：
   - 标题中涉及的数字（65,000g、100 Hardwood）100% 存在于锁定正文；
   - 结果完全属实，符合 1.6 官方维基版本记录；
   - 点名对象为农舍升级的筹备者；
   - 承诺的事项在正文第一段及费用表格中完整展开；
   - 情绪平静克制，无任何惊悚夸大或煽动性词汇。

---

## 五、同站最近 3 篇同语标题去套路独立复核

经独立读取 `src/blog/blog-post-registry.tsx`（L456–L468 及前文）与 `src/blog/blog-home-state.ts`，当前英文注册表末尾（首页最新倒序呈现）的最近 3 篇已注册英文标题为：

1. `How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe`（句式：How-to + 工具方式并列 `by Hand, Scythe, or Axe`）
2. `Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree`（句式：X vs Y 命名对比 + 机制冒号展开）
3. `Stardew Fruit: Find Its Source Before Buying Seeds`（句式：短名词 + 警示行动 `Find X Before Y`）

### 去套路判定：PASS

- 本篇选定标题为：`House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier`。
- 结构特征：`[核心主词]: [关键投入与版本数字] for [阶段对象]`。
- 对比结果：
  - 未使用 `How to ... by ... or ...` 的方法列举句式；
  - 未使用 `X vs Y` 的并列对比套路；
  - 未使用 `Find X Before Buying Y` 的条件祈使结构；
  - 亦未使用其他旧文常见的 `What to Grow ...` 或 `Do You Have to ...` 疑问句式。
- 结论：去套路检查 **PASS**。句式独立，结构自然，无同站模板碰撞。

---

## 六、元身份与公开需求独立核查

依据既有代码仓库、`interface/ProjectInterfaceSpec.md` 及 `handoff/pending-en/public-blog-handoff.en.json` 核对公开元身份字段：

1. **作者（author）**：
   - 声明值：`Stardew Valley Planner Team`；
   - 证据来源：`src/blog/blog-post-registry.tsx` 第 461 行等现有全部英文文章的统一作者常量，`ProjectInterfaceSpec.md` 第 115 行亦明确确认该常量。符合项目模板规范。
2. **发布日期与核验日期（publishedAt / verifiedAt）**：
   - `publishedAt`：`null`（文章尚未发布，禁止凭空伪造虚假上线日期）；
   - `verifiedAt`：`2026-10-16T09:08:17+08:00`（严格绑定 F 实际生成技术锁稿的本地系统时间，仅代表技术锁创建时刻，绝不冒充发布日期）。
3. **目标 Canonical URL**：
   - 契约路径：`https://stardewvalleyplanner.art/house-upgrade-stardew`；
   - 状态明确：当前未装配页面，服务器不提供生产访问；严禁将未上线的 URL 宣称为已部署。
4. **FAQ 与 CTA 状态**：
   - `faq`：`null`。锁定正文未设立独立 FAQ 区块，按规则不强制新增；
   - `articleSpecificCta`：`null`。本篇不含特定定制工具槽位，装配阶段将直接使用全站通用的 `BlogPlannerCta` 并挂载于 `BlogSources` 前，符合组件规范。
5. **配套媒体资源（figures）**：
   - 封面图：`public/blog/house-upgrade-stardew-cover.webp`（1672×941，WebP SHA `c9309a...`，AVIF SHA `f9c086...`）；
   - 正文图 1：`public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp`（1672×941，WebP SHA `c73b05...`，AVIF SHA `8654ef...`）；
   - 正文图 2：`public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp`（1672×941，WebP SHA `040b07...`，AVIF SHA `1cff7e...`）；
   - 媒体图位及随文 Schematic 图注在锁定正文中完整保留，alt 描述均超过 8 字符，符合注册表强校验门槛。

---

## 七、修订预算与生命周期状态

- **总修订预算控制**：按照 V7 统一规范，整篇文章（含正文及译文返修）总修订预算上限为 3 轮。
  - 本关键词已执行完成第 1 至第 3 轮修改与提交；
  - 当前状态：`used: 3, remaining: 0, includesTranslationRework: true`；
  - 剩余预算为 0，不能通过切换任务、阶段或 Agent 重置。
- **正文质量与稳定性**：锁定正文 hash 保持 `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`，正文与 SEO 表面未发现实质事实错误，不触发退回修改，符合预算用尽下的合格收敛状态。
- **生命周期交接状态表**：

| 阶段 / 角色 | 状态 | 责任角色 | 说明 |
|---|---|---|---|
| 英文正文技术锁 (F) | **LOCKED** | Role F | SHA-256 `f343aee1...`，合格字数 1085 |
| 英文题文与 SEOTruth (E) | **PASS** | Role E | 本报告通过（问题数 0） |
| 中文译文制作 (T) | **PENDING** | Role T | 待翻译已锁定正文与已审 SEO 文字 |
| 译文正文与题文审核 (E) | **PENDING** | Role E | 待 Role T 提交后独立复核 |
| 双语公开交接冻结 (F) | **PENDING** | Role F | 待中文审查通过后双语一同冻结 |
| 本地页面装配 (G) | **PENDING** | Role G | 待交接冻结后装配现有 Next.js 页面 |
| 页面审查与真实浏览器 (E) | **PENDING** | Role E | 待页面装配后使用本地 ego-browser 验证 |
| 用户成品终审 | **PENDING** | 用户 | 最终完整页面呈现终审 |
| 生产部署 | **NOT-DEPLOYED** | 运维 / 发布 | 未部署上线 |

---

## 八、真实命令执行与验证日志

所有核验命令均在 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 下真实执行，完整输出记录于同目录 `checks.log`：

1. `orca orchestration check --terminal term_2fb61edc-2643-47a6-993f-adec12d2f2e7 --json`（exitCode 0）
2. `shasum -a 256` 校验锁定正文、草稿、锁记录、字数报告、SEO候选、公开交接及 V7 流程包文件（exitCode 0）
3. `diff -u docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md docs/blog-ops/house-upgrade-stardew/lock/en/body.md`（exitCode 0，完全一致）
4. `PYTHONDONTWRITEBYTECODE=1 python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en`：
   - `docs/blog-ops/house-upgrade-stardew/lock/en/body.md`（mechanical_units: 1138, exitCode 0）
   - `docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md`（mechanical_units: 1085, qualifiedUnits >= 1000 严格合格, exitCode 0）
5. Python SEO 表面紧凑 JSON 排序与 SHA-256 计算（hash `7efcec963346a418ced31f5f181e37486a7e20fdbda20c9e379db79ba4505ac1`, exitCode 0）
6. Python 正文精确 quote 出现次数核验（8 项引用全部匹配, exitCode 0）
7. Python 禁令及最高级排除扫描（全部通过, exitCode 0）

---

## 九、审核结论

**PASS**（问题数：0）。

选定标题 `House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier` 及对应 Description、H1、OG Title 和 slug 满足 V7 工作流与 SEOTruth 独立审核要求。英文题文已具备进入后续中文翻译（Role T）的完整技术条件。
