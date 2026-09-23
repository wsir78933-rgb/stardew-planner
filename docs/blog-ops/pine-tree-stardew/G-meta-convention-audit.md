# G-META-CONVENTION-AUDIT：`pine-tree-stardew` 中文 metadata 约定审计

- **审计日期：** 2026-09-22（Asia/Shanghai）
- **任务性质：** 只读 metadata resolution audit；本文件是本 dispatch 唯一允许写入的文件。
- **目标：** 独立核对当前 registry/source contract、全部现有双语 entries、锁定 EN/ZH 正文、当前 `PublicBlogHandoff` 和 V7 规则，判断 `pine-tree-stardew` 的 `zh-CN topic`、`featured`、`readTimeMinutes` 是否能由显式项目约定或确定性公式解析。
- **不做：** 不改 handoff、source、registry、identity、copy、article module、test、asset 或其他 docs；不把历史报告自报当作当前状态；不把频率当作授权。

## 1. 结论先行与状态语义

### 1.1 严格结论

| 目标字段 | 当前可观察的约定/输入 | `pine-tree-stardew` 的 ZH 结论 | 下一动作 |
|---|---|---|---|
| `topic` | ProjectInterfaceSpec 明确写出当前双语 convention：`Stardew Valley Guides` / `星露谷物语指南`；19/19 现有 ZH entries 也使用后者 | **UNRESOLVED（约定已验证，目标授权未解决）**。当前 ZH handoff 的结构化 registry 字段仍为 `topic: null`。Spec 同时明确“当前 convention 不锁 target value”，所以不能把观察到的 convention 静默写入目标 | PublicBlogHandoff/content owner 最小决策：确认本目标采用 `星露谷物语指南`，或给出另一个明确的本地化 topic |
| `featured` | 当前 38 个 entries 全为 `true`；没有 source default、validator fallback、V7 默认值或字段计算器 | **UNRESOLVED**。全量 `true` 是已有数据分布，不是可执行 convention；validator 要求显式 boolean | PublicBlogHandoff/content owner 为 EN 与 ZH 分别提供显式 `true`/`false` |
| `readTimeMinutes` | source 只要求正整数；`formatBlogReadTime` 只做正整数校验和模板替换；没有读取正文、字数、字符数或 WPM 的公式 | **UNRESOLVED**。当前 EN/ZH handoff 均为 `null`；现有双语 pairs 有相同也有不同分钟数，正文长度与分钟数还存在反例 | PublicBlogHandoff/content owner 为 EN 与 ZH 分别提供明确正整数；若要公式，先授权并把公式写入 project contract |

### 1.2 单独处理 user-authorized team-author decision

本任务不重新决定作者，也不把作者推导成其他字段。当前结构化 `PublicBlogHandoff` JSON 已有用户授权的团队作者输入：

- EN `author`: `Stardew Valley Planner Team`（`handoff-en.md:194-202`，当前 fenced JSON）
- ZH `author`: `星露谷规划器团队`（`handoff-zh.md:226-234`，当前 fenced JSON）

这两个值与 source registry 19/19 entries 及 registry test 的既有团队作者一致，但它们**不**推出 ZH topic、featured 或 read time。当前 handoff 的人类可读摘要与 `blockedReasons` 仍写着 `author=null`（EN `:10,367,525`；ZH `:10,409,567`），与当前结构化 JSON 冲突；因此作者决定可作为**独立已授权输入**记录，但 handoff owner 仍需消除该文档漂移后才能称为 ready。当前 handoff 仍明确 `status=blocked`、`ready=false`、`frozen=false`。

### 1.3 状态定义

- **VERIFIED：** 当前结构化文件或 source 明确给出值；不需要从另一语言、另一篇文章或正文长度推断。它只证明输入/合同值，不证明 target 已注册、页面已 build 或已部署。
- **UNRESOLVED：** 必填目标字段为 `null`、缺失，或只有未授权的历史分布/ convention；现在填值会越过 handoff 授权边界。
- **UNVERIFIED：** 应由 source/runtime 绑定证明的事实目前没有对应 source entry 或没有运行该验证，例如目标尚未加入 identity/registry。
- **DRIFT：** 同一 handoff 的不同层级字段互相矛盾；不吞掉矛盾，也不把一处旧摘要当成另一处新结构化值的覆盖。

## 2. Source contracts：没有默认填充，也没有 metadata 计算器

### 2.1 Registry 类型与 validator

当前 `src/blog/blog-post-registry.tsx`（raw SHA-256 `f3b350c07705164562e5c7919ffae1968b1d268a7f28a99456a26df336724ffd`）的实际 contract：

- `:55-67` 的 `BlogPostMeta` 必填 `slug`、`title`、`description`、`topic`、`author`、`readTimeMinutes`、`coverImage`、`featured`。
- `:69-72` 的 `LocalizedBlogPost` 还要求 `Content` function。
- `:660-680` 的字符串/封面 alt 检查是 fail-fast；`:682-736` 的 `assertValidLocalizedBlogPost` 要求非空 `topic`/`author`，`readTimeMinutes` 是正整数，`featured` 是 boolean；收到非法值时把具体值写进 Error，没有 default。
- `:738-785` 要求每个 public locale 有数组、slug 合法、顺序正确、无重复且不缺失；`:793` 启动时直接调用 `validateBlogPostRegistry(blogPostsByLocale)`。
- `src/blog/blog-post-identities.ts:1-35`（raw SHA-256 `be6cdf465126189167dc2517e326c1d1840114b0a55aa7a88a2144a64f6f4f87`）当前只有 19 个 slug，未包含 `pine-tree-stardew`。
- `src/blog/blog-copy.ts:97-144`（raw SHA-256 `e2a6af61c7c2473dc317e803384faf061b3f97f08d39741f867d2b363dc84eee`）的 EN/ZH localized path record 也未包含目标；`:161-174` 对缺失 locale/slug 直接抛错。
- `src/i18n/public-locale.ts:1-3`（raw SHA-256 `dbe1c245cb65fddefbb0d82085914e8e97170f635f088e8f8a045a956a704f0b`）只定义 `en` 与 `zh-CN`。

当前目标 article modules 已作为 shared checkout 的未跟踪文件存在，但它们不是 registry 证据：

- `src/blog/articles/pine-tree-stardew.en.tsx`：574 行、27,073 bytes，SHA-256 `5b61738990dac239d34eb3d7898270929ae6c47ccacb2e9168923a4d6e233bc7`。
- `src/blog/articles/pine-tree-stardew.zh.tsx`：268 行、16,621 bytes，SHA-256 `27bbf27a39f964f7d4c83fc28bf620d12faecf028e310f4cb55262fc646508fe`。
- 对 `src/blog/blog-post-registry.tsx`、`src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts` 执行目标搜索没有命中（`rg` exit **1，预期未命中**）。因此当前 target source binding 是 **UNVERIFIED / NOT REGISTERED**，不能由 article module 存在反推 metadata 已完成。

### 2.2 read time 不是显示层自动计算

`src/blog/blog-copy.ts:193-199` 的 `formatBlogReadTime(copy, minutes)` 只检查 `Number.isSafeInteger(minutes) && minutes > 0`，然后把输入整数替换进 EN `{minutes} min read` 或 ZH `阅读约 {minutes} 分钟`；没有正文读取、WPM、中文字符速率、四舍五入或 default。页面也直接消费 registry 值：

- `src/components/blog/blog-article-content.tsx:18-31`（SHA-256 `f8ede42d678068ea46eb8648040a3418ce595e5c796fad6e8284919af08ae2cb`）直接渲染 `post.topic`、`post.author`、`post.readTimeMinutes`。
- `src/components/blog/article-card.tsx:39-57`（SHA-256 `7d19e06ccd5ee89a04cce1fbe01dc6b04caf2ba565c5875a8b481704cd2be26f`）同样直接渲染 topic、author、read time。
- `src/blog/blog-home-state.ts:34-47,140-148`（SHA-256 `0953a277225d9db3cb069082696c85e106fe1367b18220a20a2e9ad4de9ed53c`）只按字符串 topic 分组/过滤，没有为未知 topic 选择 fallback。

Repository-wide reference search（排除 `node_modules/.git/.next/out`）显示 `readTimeMinutes`/`formatBlogReadTime` 的生产引用只有 registry、blog-copy、card、article header；scripts 中没有 read-time calculator。V7 目录的搜索也没有 WPM/字符速率公式；可执行规则是“缺字段退回 owner，不由 assembler 临场创作”。

### 2.3 Test fixture 不是生产默认

`tests/blog/blog-post-registry.test.ts`（raw SHA-256 `940d9d3360bd62014ce8b1b3254274e2412e457c987eb3d993ae4d9cfb4213a1`）的 `:35-52` 为测试工厂：`author`、`readTimeMinutes: 5`、`featured: true` 是造 fixture 的默认，不能提升为 runtime default。`:117-128` 只断言当前生产 entries 的 author 全为两种团队名、featured 全为 `true`；它没有声明未来文章默认值或 read-time 公式。`:569-583` 只测试 0 与 2.5 被 validator 拒绝。

## 3. V7 metadata / handoff 规则

### 3.1 V7 规则原文对应的可执行边界

- `/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md`（SHA-256 `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400`）`:39-57` 要求锁正文后的 Title/H1/Description/slug、真实 Article identity/URL/图片等 metadata；`:57` 明确未知作者、未来日期和虚构 URL 不得补造。
- 同文件 `:61-73` 要求 G 沿用现有接口、消费同一 `PublicBlogHandoff`，缺 project/interface 能力时如实记录。
- 同文件 `:87-99` 区分 source/build/browser/page/user review；任何一个验证层不能替代另一个。
- `/Users/wusir/Desktop/博客-V7修订版/04-公开交接与页面装配.md`（SHA-256 `31c73c23f0825b0291d6ed4224a57cbeb8b01b5e4502d2091724d999ba225d9c`）`:11-20` 把 `seo`、`publicRequirements`、`integrity` 定义为公开交接字段；`:23-29` 要求正文与 body hash 绑定；`:53-60` 明确 AssemblyManifest 消费“合格 handoff + ProjectInterfaceSpec + 实际媒体”，缺字段时返回 owner，assembler 不临场创作。
- 同文件 `:61-73` 要求 WritePageGrant、source/build/browser/page/user 状态分开记录。
- `/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md`（SHA-256 `2bf97935b775b1a6f5db792590216ef2181c475ddddd48da54428976d9f573a1`）原始 hash 在本次命令中已读取；其 `:50` 维持独立审阅、正文版本/hash 和用户终审分离。本段只引用其角色/锁定边界，不把鉴文结果当 metadata 值。

### 3.2 ProjectInterfaceSpec 对本目标的更窄要求

`docs/blog-ops/pine-tree-stardew/project-interface-spec.md`（SHA-256 `055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f`）的关键行：

- `:194-206`：`topic`/`author` 是 handoff 的非空本地化值；`readTimeMinutes` 是正整数；`featured` 必须是显式 boolean；validator 不吞错。
- `:198` 写出当前 registry convention 为 `Stardew Valley Guides` / `星露谷物语指南`，但同一句明确“the spec does not lock the target value”。
- `:218-220`：target registry append-only；精确 topic、author、read time、featured、正文和媒体在 handoff validation 前未确认。
- `:541-556`：缺字段或矛盾时返回 content/interface owner；`:546` 要求 Title/H1/description/topic/author/read time 使用 handoff 精确值或明确批准的 existing project field。

因此，`星露谷物语指南` 是**可引用、可验证的现有 convention**，不是在 ZH handoff 仍为 `null` 时可自动写入的 target value。

## 4. 当前 handoff 与锁定正文的实际回读

### 4.1 结构化 handoff 状态

本审计重新解析了两份 fenced JSON，而非沿用旧报告摘要；当前 raw SHA-256 如下：

- `handoff-en.md`：`0dde799b1bdf43bd8297f7fa139281f4f07be67c889afe8ace28c2a142c6d313`
- `handoff-zh.md`：`31bbbf7c8f749657c8d356923f1a068030ddcf4f0b4007ab7e200bdeffabbb60`

| JSON `publicRequirements.registry` | EN | ZH |
|---|---|---|
| `topic` | `Stardew Valley Guides` | `null` |
| `author` | `Stardew Valley Planner Team` | `星露谷规划器团队` |
| `featured` | `null` | `null` |
| `readTimeMinutes` | `null` | `null` |
| `titleEqualsH1` | `true` | `true` |
| `status` | `blocked_missing_public_metadata` | `blocked_missing_public_metadata` |

外层两份记录当前均为 `status=blocked`、`ready=false`、`frozen=false`。人类可读摘要/`blockedReasons` 仍把 author 写成 null，构成 handoff **DRIFT**；本审计把结构化 registry 字段标为独立作者输入，但不把 handoff 宣称 ready。

当前 body receipts：

- EN locked body：19815 bytes、184 行、SHA-256 `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1`；文件 raw SHA-256 与 body hash 相同，因为该文件本身就是 locked body。
- ZH locked body：12155 bytes、101 行、SHA-256 `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690`；同上。

当前 target modules 的存在、locked body bytes/hash 和 media receipt 都不能替代 registry binding；本 audit 不运行 build/browser/deploy。

## 5. 全部现有 localized entries：topic / featured / read time

以下是从当前 `getAllBlogPosts("en")` 与 `getAllBlogPosts("zh-CN")` 真实回读的 19×2 entries；不是从频率推断。`en`/`zh-CN` 顺序相同，source 仍以 `blogPostSlugs` 为 canonical order。

| slug | EN topic | ZH topic | EN featured | ZH featured | EN min | ZH min |
|---|---|---|---:|---:|---:|---:|
| `carpenter-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 8 | 8 |
| `where-is-robin-stardew-valley` | Stardew Valley Guides | 星露谷物语指南 | true | true | 8 | 8 |
| `stardew-valley-npc` | Stardew Valley Guides | 星露谷物语指南 | true | true | 10 | 10 |
| `stardew-valley-town-map` | Stardew Valley Guides | 星露谷物语指南 | true | true | 6 | 6 |
| `where-is-stardew-valley-located` | Stardew Valley Guides | 星露谷物语指南 | true | true | 11 | 11 |
| `stardew-valley-expanded-bachelors-and-bachelorettes` | Stardew Valley Guides | 星露谷物语指南 | true | true | 12 | 12 |
| `sprinkler-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 14 | 13 |
| `glasshouse-stardew-valley` | Stardew Valley Guides | 星露谷物语指南 | true | true | 11 | 11 |
| `oak-tree-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 12 | 12 |
| `stardew-valley-trees` | Stardew Valley Guides | 星露谷物语指南 | true | true | 12 | 13 |
| `maple-tree-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 14 | 14 |
| `best-spring-crop-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 14 | 14 |
| `how-to-earn-money-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 16 | 16 |
| `rancher-or-tiller-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 11 | 9 |
| `summer-crops-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 16 | 16 |
| `fall-crops-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 19 | 19 |
| `do-you-have-to-water-trees-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 14 | 17 |
| `how-to-level-up-farming-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 16 | 14 |
| `last-day-to-plant-stardew` | Stardew Valley Guides | 星露谷物语指南 | true | true | 15 | 16 |

全量集合：

- EN topics：1 unique = `Stardew Valley Guides`；ZH topics：1 unique = `星露谷物语指南`。
- EN authors：1 unique = `Stardew Valley Planner Team`；ZH authors：1 unique = `星露谷规划器团队`。
- `featured`：38/38 为 `true`。
- `readTimeMinutes`：38 个值，集合 `{6,8,9,10,11,12,13,14,15,16,17,19}`，不是常量。
- 已有 bilingual pairs 的 read time 不总相同：`sprinkler` 14/13、`stardew-valley-trees` 12/13、`rancher-or-tiller` 11/9、`do-you-have-to-water-trees` 14/17、`how-to-level-up-farming` 16/14、`last-day-to-plant` 15/16。

## 6. 正文长度与 read-time 的可复算审计

### 6.1 计数定义

这是审计探针的计数，不是项目新增公式：

1. 对每个现有 `Content` 通过 `renderToStaticMarkup(React.createElement(post.Content))` 得到 HTML。
2. 删除 HTML tags、HTML 空白实体并压缩 whitespace，得到 reader text；`readerTextChars` 为 JS 字符长度。
3. EN `asciiWords` 使用 `/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g` 计数。
4. ZH `cjkChars` 使用 `/[\u3400-\u9fff]/g` 计数；同时保留 reader text 总字符数。
5. source module bytes 用 `Buffer.byteLength(file, "utf8")`；target locked body bytes/lines 用文件真实 UTF-8 bytes/LF 行数。

### 6.2 现有 19×2 entries 的 rendered-text metrics

| slug | EN min / ASCII words / text chars | ZH min / CJK chars / text chars |
|---|---:|---:|
| `carpenter-stardew` | 8 / 2916 / 17255 | 8 / 2942 / 3548 |
| `where-is-robin-stardew-valley` | 8 / 2917 / 17160 | 8 / 2961 / 3703 |
| `stardew-valley-npc` | 10 / 2937 / 17929 | 10 / 2800 / 4090 |
| `stardew-valley-town-map` | 6 / 1312 / 7563 | 6 / 2230 / 2786 |
| `where-is-stardew-valley-located` | 11 / 2171 / 13034 | 11 / 2509 / 3080 |
| `stardew-valley-expanded-bachelors-and-bachelorettes` | 12 / 2245 / 13845 | 12 / 2375 / 3283 |
| `sprinkler-stardew` | 14 / 3305 / 18918 | 13 / 4599 / 5798 |
| `glasshouse-stardew-valley` | 11 / 2301 / 13628 | 11 / 2554 / 3211 |
| `oak-tree-stardew` | 12 / 4358 / 23752 | 12 / 4661 / 5894 |
| `stardew-valley-trees` | 12 / 2289 / 12458 | 13 / 2565 / 3193 |
| `maple-tree-stardew` | 14 / 4337 / 23554 | 14 / 4795 / 6536 |
| `best-spring-crop-stardew` | 14 / 5094 / 28059 | 14 / 4312 / 6135 |
| `how-to-earn-money-stardew` | 16 / 5420 / 29279 | 16 / 4938 / 7155 |
| `rancher-or-tiller-stardew` | 11 / 2605 / 14906 | 9 / 3068 / 4324 |
| `summer-crops-stardew` | 16 / 4141 / 22027 | 16 / 4825 / 7065 |
| `fall-crops-stardew` | 19 / 1764 / 9326 | 19 / 2629 / 4082 |
| `do-you-have-to-water-trees-stardew` | 14 / 2383 / 13499 | 17 / 3578 / 4325 |
| `how-to-level-up-farming-stardew` | 16 / 3375 / 18489 | 14 / 3161 / 4596 |
| `last-day-to-plant-stardew` | 15 / 2710 / 15044 | 16 / 4394 / 6596 |

### 6.3 Concrete counterexamples; no deterministic read-time formula

- EN `fall-crops-stardew`: **1,764 words → 19 min**; EN `how-to-earn-money-stardew`: **5,420 words → 16 min**. More rendered words can have a lower declared time.
- EN `carpenter-stardew`: **2,916 words → 8 min**; EN `stardew-valley-npc`: **2,937 words → 10 min**. A 21-word difference maps to a 2-minute difference.
- EN `oak-tree-stardew`: **4,358 words → 12 min**; EN `maple-tree-stardew`: **4,337 words → 14 min**. Nearly equal word counts do not resolve to one value.
- ZH `fall-crops-stardew`: **2,629 CJK chars → 19 min**; ZH `how-to-earn-money-stardew`: **4,938 CJK chars → 16 min**. More Chinese characters can have a lower declared time.
- ZH `sprinkler-stardew`: **4,599 CJK chars → 13 min**; ZH `stardew-valley-trees`: **2,565 CJK chars → 13 min**. Same declared time spans a large length difference.
- ZH `rancher-or-tiller-stardew`: **3,068 CJK chars → 9 min**; ZH `do-you-have-to-water-trees-stardew`: **3,578 CJK chars → 17 min**. A modest count difference is not enough to recover a formula.

Target locked bodies are also not a formula input supplied by the project: EN is 19,815 bytes/184 lines and ZH is 12,155 bytes/101 lines, with the body hashes in §4. The target source modules render 17,108 EN reader-text chars / 2,911 ASCII words and 3,685 ZH reader-text chars / 2,867 CJK chars, but no `readTimeMinutes` exists anywhere in those modules or handoffs. These metrics support **UNRESOLVED**, not a guessed minute value.

## 7. Strict field matrix for the next owner

| Field | EN current structured handoff | ZH current structured handoff | Source/convention status | Target status |
|---|---|---|---|---|
| `topic` | `Stardew Valley Guides` | `null` | Documented convention is `Stardew Valley Guides` ↔ `星露谷物语指南`; no runtime default | EN **VERIFIED** as explicit handoff input; ZH **UNRESOLVED** until convention is explicitly approved for this target |
| `author` *(separate user decision)* | `Stardew Valley Planner Team` | `星露谷规划器团队` | Structured handoff values and current source/test convention agree; prose/blocker summaries are stale | **VERIFIED structured input + DRIFT**; not used to derive any requested field |
| `featured` | `null` | `null` | 38/38 historical entries true, but no default/formula and validator requires boolean | **UNRESOLVED** for both locales |
| `readTimeMinutes` | `null` | `null` | Positive integer only; no formula/default; rendered-length counterexamples | **UNRESOLVED** for both locales |
| `slug` | `pine-tree-stardew` | `pine-tree-stardew` | Handoff/spec explicit; identities/copy/registry target absent | **VERIFIED handoff input; UNVERIFIED source binding** |
| `title`/`h1`/`description` | Explicit locked SEO values | Explicit locked SEO values | Handoff/title review explicit; page projection not run | **VERIFIED input; UNVERIFIED page binding** |

### 7.1 What is and is not resolved

- **Resolved without inference:** the separately authorized team-author pair; EN topic; both locales' slug/title/H1/description as handoff inputs; existing locale IDs; locked body hashes/lengths.
- **Not resolved:** ZH target topic authorization, both `featured` booleans, both read-time integers.
- **Not proven by this audit:** source registration, route generation, build, typecheck, tests, browser, deploy, production/indexing, user page review.
- **Out-of-scope concurrent paths left untouched:** existing `G-metadata-resolution.md`, `G-assets-receipt.md`, other target docs, six public media files, and the two untracked article modules. Their presence is recorded only as shared-checkout state.

## 8. Concrete next owner and minimal remaining decision

**Next owner: PublicBlogHandoff/content-metadata owner.** Do not send this to the page assembler as if fields were complete.

1. Keep the separately authorized author pair, but reconcile the stale prose/`blockedReasons` `author=null` text with the structured JSON.
2. Make one minimal ZH topic decision: approve the documented convention `星露谷物语指南`, or provide a different localized topic. The audit does not select between them.
3. Set explicit `featured` booleans for EN and ZH. The observed all-`true` history is evidence of current state only, not authorization.
4. Set explicit positive `readTimeMinutes` for EN and ZH, or first add an approved deterministic formula to the project contract and handoff. Do not use source bytes, line count, rendered characters, CJK count, title length, or another locale as an implicit formula.
5. Rehash the updated handoffs and preserve locked body/SEO/media receipts. Only after a valid ready handoff may the page assembler bind registry/identity/routes under its separate write authorization.

The smallest unresolved user decision is therefore: **confirm ZH topic (`星露谷物语指南` or another exact value), provide EN/ZH featured booleans, and provide EN/ZH read-time integers (or authorize a new formula contract).** No further decision about the team author is needed for this audit, but the handoff drift must be repaired by its owner.

## 9. Commands, exact results, exit codes

All commands below were run read-only except the final report write. No build, typecheck, Vitest, dev server, browser, deploy, commit, push, external service write, or secret access was performed.

| Command | Exact result | Exit |
|---|---|---:|
| `git status --short --branch` | Branch `博客二`; shared checkout already had untracked target docs, media and article modules; no tracked source change attributed to this dispatch | 0 |
| `test -e docs/blog-ops/pine-tree-stardew/G-meta-convention-audit.md` | `ABSENT` before this report write | 0 |
| `shasum -a 256 src/blog/blog-post-registry.tsx src/blog/blog-post-identities.ts src/blog/blog-copy.ts src/i18n/public-locale.ts src/blog/blog-home-state.ts src/components/blog/blog-article-content.tsx src/components/blog/article-card.tsx tests/blog/blog-post-registry.test.ts` | Returned hashes recorded in §§2 and 4; all reads successful | 0 |
| `nl -ba src/blog/blog-post-registry.tsx | sed -n '55,67p;656,809p'` | Read types, validator, order, locale and no-default behavior | 0 |
| `rg -n 'pine-tree-stardew' src/blog/blog-post-registry.tsx src/blog/blog-post-identities.ts src/blog/blog-copy.ts` | No target registration/path/identity match; expected absence | 1 |
| `pnpm exec tsx -e 'import { getAllBlogPosts } from "./src/blog/blog-post-registry"; const en=getAllBlogPosts("en"), zh=getAllBlogPosts("zh-CN"); console.log(JSON.stringify({enCount:en.length,zhCount:zh.length,enTopics:[...new Set(en.map(p=>p.topic))],zhTopics:[...new Set(zh.map(p=>p.topic))],enAuthors:[...new Set(en.map(p=>p.author))],zhAuthors:[...new Set(zh.map(p=>p.author))],enFeatured:[...new Set(en.map(p=>p.featured))],zhFeatured:[...new Set(zh.map(p=>p.featured))],rows:en.map((p,i)=>({slug:p.slug,enTopic:p.topic,zhTopic:zh[i].topic,enFeatured:p.featured,zhFeatured:zh[i].featured,enRead:p.readTimeMinutes,zhRead:zh[i].readTimeMinutes}))},null,2))'` | 19 EN + 19 ZH; topic/author/featured sets and full rows recorded in §5 | 0 |
| `rg -l 'readTimeMinutes\\|formatBlogReadTime'` with generated/vendor dirs excluded | Production references are registry, blog-copy, article card/header; no scripts calculator; V7 search found no WPM/character formula | 0 |
| `python3` fenced-JSON parser for `handoff-en.md`/`handoff-zh.md` | Parsed both records; returned current structured registry values, blocked/ready/frozen state, body bytes/hash and raw hashes in §4 | 0 |
| `shasum -a 256 docs/blog-ops/pine-tree-stardew/handoff-en.md docs/blog-ops/pine-tree-stardew/handoff-zh.md docs/blog-ops/pine-tree-stardew/locked/en-body.txt docs/blog-ops/pine-tree-stardew/locked/zh-body.txt src/blog/articles/pine-tree-stardew.en.tsx src/blog/articles/pine-tree-stardew.zh.tsx` | Returned current handoff/body/module hashes recorded in §§2 and 4 | 0 |
| `wc -l -c src/blog/articles/pine-tree-stardew.en.tsx src/blog/articles/pine-tree-stardew.zh.tsx docs/blog-ops/pine-tree-stardew/locked/en-body.txt docs/blog-ops/pine-tree-stardew/locked/zh-body.txt` | Modules: EN 574/27073, ZH 268/16621; locked bodies: EN 184/19815, ZH 101/12155 | 0 |
| `pnpm exec tsx /tmp/pine-meta-metrics.ts` (absolute dependency imports; output JSON used for §6) | Rendered all 38 existing Content functions plus both target modules; metrics table and counterexamples reproduced | 0 |
| `git diff --check` | No whitespace diagnostics after report write | 0 |
| `awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/G-meta-convention-audit.md` | No trailing whitespace | 0 |
| `test -s docs/blog-ops/pine-tree-stardew/G-meta-convention-audit.md && wc -l -c docs/blog-ops/pine-tree-stardew/G-meta-convention-audit.md` | Non-empty report; post-write size recorded by coordinator readback | 0 |

## 10. Write boundary

- **This dispatch wrote only:** `docs/blog-ops/pine-tree-stardew/G-meta-convention-audit.md`.
- **This dispatch did not write:** handoffs, `G-metadata-resolution.md`, `G-assets-receipt.md`, project spec, source registry/identity/copy, article modules, tests, assets, package/lockfiles, generated output, git refs, external services, or secrets.
- Hashes in this report are evidence of the files read at audit time; the report intentionally does not self-hash.
