# G-META-RESOLVE：`pine-tree-stardew` registry metadata contract audit

- **审计日期：** 2026-09-22（Asia/Shanghai）
- **模式：** 只读合同审计；本文件是本轮唯一允许写入的文件。
- **目标：** 在不猜测、不复制其他文章值的前提下，判断 `pine-tree-stardew` 的双语 registry metadata 哪些可由当前 public contracts / handoff / title review 明确绑定。
- **总体结论：** **BLOCKED。** Title/H1/Description/slug 以及 English `topic` 有明确输入；`zh-CN topic`、两种语言的 author、featured、readTimeMinutes、cover alt 仍未解决。目标尚未进入 source registry，article modules 仍不存在；媒体在初始读取时缺失、随后在本轮中出现为 checkout 外部新增的未跟踪文件，媒体回执/授权/alt/page binding 仍未完成，因此本报告不声称页面可装配或已完成。

## 1. 判定语义与证据边界

本报告只使用当前 checkout 的源码、测试/类型合同、`project-interface-spec.md`、当前 EN/ZH `PublicBlogHandoff`、当前 EN/ZH title reviews，以及锁定正文文件。状态严格按以下语义使用：

- **VERIFIED：** 当前材料明确给出该值，且不需要从别的文章推断；这只证明输入/合同值，不自动证明 source registry、页面、构建或生产绑定。
- **UNRESOLVED：** 当前材料把必填值留空、写成 `null` 或未提供；任何填值都会越过本审计范围或构成猜测。
- **UNVERIFIED：** 合同/预期可以描述，但当前 checkout 没有实际 source/artifact/runtime 证据，例如未注册的 slug、缺失媒体或尚未生成的 `Content` 函数。

`BlogPostMeta` 没有 `date`、`publishedAt`、`updatedAt` 或 country 字段；不要为这些不存在于当前 registry public type 的字段增设值。`Content` 是 `LocalizedBlogPost` 的必填函数，但它是实现绑定，不是可从 metadata 猜出的字段。

## 2. 当前 source contracts（真实路径、行号、hash）

### 2.1 Registry 类型与 fail-fast validator

- `src/blog/blog-post-registry.tsx:55-67` 定义必填 `BlogPostMeta`：`slug`、`title`、`description`、`topic`、`author`、`readTimeMinutes`、`coverImage.src`、`coverImage.alt`、`featured`；`src/blog/blog-post-registry.tsx:69-72` 再要求 `LocalizedBlogPost.Content` 函数。
- `src/blog/blog-post-registry.tsx:682-736` 的 validator 要求非空 title/description/topic/author，`readTimeMinutes` 为正整数，cover 为对象且 alt 至少 8 个字符，`featured` 必须是 boolean，`Content` 必须是 function；错误会带收到的值，不存在默认填充。
- `src/blog/blog-post-registry.tsx:738-785` 还要求每个 public locale 有数组、slug 合法、顺序正确、无重复且不缺失；`validateBlogPostRegistry(blogPostsByLocale)` 在 `:793` 启动时执行。
- 文件 raw SHA-256：`f3b350c07705164562e5c7919ffae1968b1d268a7f28a99456a26df336724ffd`。

### 2.2 Identity、localized paths 与当前目标缺口

- `src/blog/blog-post-identities.ts:1-21` 当前只有 19 个 slug，末项是 `last-day-to-plant-stardew`；`src/blog/blog-post-identities.ts:23-35` 的 `BlogPostSlug` / `isBlogPostSlug` 只接受该数组值。
- `src/blog/blog-copy.ts:97-144` 的 EN/ZH path record 当前也没有 `pine-tree-stardew`；`getLocalizedBlogPostHref` 在 `:161-174` 对缺失 locale/slug 直接抛错。
- 当前文件 hashes：
  - `src/blog/blog-post-identities.ts` → `be6cdf465126189167dc2517e326c1d1840114b0a55aa7a88a2144a64f6f4f87`
  - `src/blog/blog-copy.ts` → `e2a6af61c7c2473dc317e803384faf061b3f97f08d39741f867d2b363dc84eee`
- 目标文章模块 `src/blog/articles/pine-tree-stardew.en.tsx` / `.zh.tsx` 当前不存在。初始只读检查时目标 cover/figure WebP 与 AVIF 均缺失；报告写入后再次读取发现 6 个对应 `public/` 文件已作为未跟踪文件出现。该外部状态不是本 worker 创建或修改的，后文单独记录其只读格式/尺寸证据。

### 2.3 页面投影合同

- `src/components/blog/blog-article-content.tsx:18-31` 用 `post.topic`、`post.title`、`post.description`、`post.author`、`post.readTimeMinutes` 和 `post.coverImage.{src,alt}` 渲染文章头部/H1/可见 metadata/封面；文件 hash `f8ede42d678068ea46eb8648040a3418ce595e5c796fad6e8284919af08ae2cb`。
- `src/components/blog/article-card.tsx:39-57` 同样直接使用 topic、author、read time、cover alt/src；文件 hash `7d19e06ccd5ee89a04cce1fbe01dc6b04caf2ba565c5875a8b481704cd2be26f`。
- `src/seo/page-metadata.ts:12-20,26-56` 的 input 要求 locale/canonicalPath/title/description；`:39-53` 将 title/description 原样投影到 metadata、OG、Twitter；文件 hash `ed717ed7941551768b74d761d3f2e390d38b330cae9f8523742003835e1796af`。
- `app/(en)/[slug]/page.tsx:24-57,60-75` 与 `app/zh/[slug]/page.tsx:27-62,65-84` 都先从 `blogPostSlugs` / registry resolve，再生成 metadata 与 Article JSON-LD；目标未注册时不能产生目标页面。两个 route 文件 hash 分别为 `908f306a46273af550d7cea9bcb64e5fe77515be3ae82830aabbcd695ba479be`、`60e01dcc06ea170b15b4faf2dff1143db0ff7eb3602b76c8a947a0b83db40a12`。
- `src/i18n/public-locale.ts:1-3` 只定义 `en` 和 `zh-CN`；hash 未改变且当前值为 `publicLocales = ["en", "zh-CN"]`。

### 2.4 现有双语 entries 不是默认值

只读扫描 `src/blog/blog-post-registry.tsx` 的 38 个现有 entries 得到：

```text
topic count=38 unique=['Stardew Valley Guides', '星露谷物语指南']
author count=38 unique=['Stardew Valley Planner Team', '星露谷规划器团队']
readTimeMinutes count=38 unique=['10','11','12','13','14','15','16','17','19','6','8','9']
featured count=38 unique=['true']
```

`tests/blog/blog-post-registry.test.ts:117-128` 只断言当前已有 entries 的 author/featured 值；它没有声明默认 author 或默认 `featured`。`readTimeMinutes` 在现有 entries 中明确变化，不能从同站文章复制或从正文 byte/line 数推算。`src/blog/blog-copy.ts:193-199` 的 `formatBlogReadTime` 只验证调用时传入的正整数并格式化显示，不提供计算公式或 default。

## 3. 当前 handoff/title evidence（值、行号、hash）

### 3.1 EN handoff

- `docs/blog-ops/pine-tree-stardew/handoff-en.md:1-11` 明确 `PublicBlogHandoff` 是 **BLOCKED**、`ready=false`；blocker 是 required page metadata 和 final media receipts 未提供。
- `handoff-en.md:32-35` 的 SEO 值为：
  - title / h1：`Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar`
  - description：`Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.`
  - slug：`pine-tree-stardew`
- `handoff-en.md:186-203` 的 `publicRequirements.registry` 明确给出 `titleEqualsH1=true`、`topic="Stardew Valley Guides"`，但 `author=null`、`featured=null`、`readTimeMinutes=null`，并标记 `status="blocked_missing_public_metadata"`。
- `handoff-en.md:258-266` 给出 cover path `/blog/pine-tree-stardew-cover.webp`、`1672×941`、`VP8 WebP`，但 `alt=null`、`altStatus="pending_media"`、`assetStatus="missing"`。
- `handoff-en.md:15-22` 的 locale/country 是 `en` / `US`；`handoff-en.md:6` 的锁定 body bytes/hash 是 `19815` / `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1`。
- handoff-en raw SHA-256：`be15025f8f23c43d636ac47d025988397ff7426f17c163e241532bbeff2f66f8`。
- `E-en-title-review.md:25-35` 独立复核同一 Title/H1/Description/slug；`E-en-title-review.md:155-167` 明确该 PASS 仅限题文/契约层，source registry、真实页面、build、browser、deploy 均未验证。E-en body hash 为 `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1`，SEO surface hash 为 `68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7`；该 review raw SHA-256 为 `4779e439505064a04b3bafcf9eebdf42a03d7b03c459ec145ee6c89ff7750a5c`。

### 3.2 ZH handoff

- `docs/blog-ops/pine-tree-stardew/handoff-zh.md:1-11` 同样明确 `PublicBlogHandoff` 为 **BLOCKED**、`ready=false`。
- `handoff-zh.md:33-36` 的 SEO 值为：
  - title / h1：`星露谷松树种植先看格子，不浇水也不能随便种`
  - description：`松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。`
  - slug：`pine-tree-stardew`
- `handoff-zh.md:226-234` 的 `publicRequirements.registry` 明确 `topic=null`、`author=null`、`featured=null`、`readTimeMinutes=null`，状态为 `blocked_missing_public_metadata`；因此不能把现有 `星露谷物语指南` convention 当成已授权的 ZH topic。
- `handoff-zh.md:300-308` 的 cover path/尺寸/格式与 EN 相同，但 `alt=null`、`altStatus="pending_media"`、`assetStatus="missing"`。
- `handoff-zh.md:15-24` 的 locale/country 是 `zh-CN` / `CN`；`handoff-zh.md:6` 的锁定 body bytes/hash 是 `12155` / `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690`。
- handoff-zh raw SHA-256：`cca6ce0f07aef19e24d02aed814ac841131a5fcf11d94169bf8290c995b770b0`。
- `E-zh-title-review.md:37-49` 独立复核同一四字段；`E-zh-title-review.md:154-189` 明确 source registry、真实页面 metadata、browser/build/test/deploy、媒体实际文件均未验证。ZH body hash 为 `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690`，四字段 tuple hash 为 `2e2e2bdb32b9ad6c5ed8b06e50003c748b3f7b41b429cff44dcfec06649933c8`；该 review raw SHA-256 为 `f24b75859dbd6dde7fab493f397879e963634e8149e7e78a385a6b4c17022fbb`。

### 3.3 ProjectInterfaceSpec / media boundary

- `docs/blog-ops/pine-tree-stardew/project-interface-spec.md:190-206` 定义了上述 registry required fields：topic/author 必须是 handoff 的非空本地化值，read time 为正整数，cover alt 是真实图片的有意义描述，featured 必须显式 boolean。
- `project-interface-spec.md:208-220` 说明 `PineTreeStardewEnglishArticle` / `PineTreeStardewChineseArticle` 只是未来接口；精确 title、description、read time、cover path、cover alt、topic、author、featured、body/media bindings 在 handoff validation 前未确认。当前 spec raw SHA-256：`055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f`。
- 当前 handoff 已补出 EN topic、双语 SEO 和 cover path，但仍明确 BLOCKED；以下 field matrix 以**当前 handoff 的显式值优先**，同时保留 source registration / asset / runtime 的 UNVERIFIED 边界。
- `A-media-plan.md:19-23,32-38,72-87` 要求封面 alt 描述实际画面；该文件在其 2026-09-22 证据时点记录目标封面和 Pine 图尚未生成。A-media raw SHA-256：`34feee6056dc7bcf877526e90eb92c7711c44dd97903e82b3645f5be381c8202`。本轮后续只读回读发现文件已出现，但不能由此补造 cover alt、授权或 handoff receipt。

## 4. Required registry metadata resolution matrix

`en` 与 `zh-CN` 的值分列；没有从另一语言、另一篇文章或正文长度推断。

| Registry field | EN (`en`) | ZH (`zh-CN`) | 判定与真实依据 |
|---|---|---|---|
| `slug` | `pine-tree-stardew` | `pine-tree-stardew` | **VERIFIED（契约值）**：handoff SEO 与 `publicRequirements.route` 都显式给出；`project-interface-spec.md:63-79,105` 锁定 `/pine-tree-stardew` 与 `/zh/pine-tree-stardew`。**UNVERIFIED（source/runtime binding）**：当前 identities/copy/registry 没有该值。 |
| `title` | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | `星露谷松树种植先看格子，不浇水也不能随便种` | **VERIFIED（handoff/title review）**：handoff `seo.title`/`seo.h1` 与 E review 字段表一致；`titleEqualsH1=true`。**UNVERIFIED（页面投影）**：目标尚未注册。 |
| `description` | `Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.` | `松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。` | **VERIFIED（handoff/title review）**：两份 handoff `seo.description` 明确给出。**UNVERIFIED（页面投影）**：route/registry 尚未绑定。 |
| `topic` | `Stardew Valley Guides` | `null` | EN **VERIFIED（当前 handoff 显式值）**：`handoff-en.md:194-203`。ZH **UNRESOLVED**：`handoff-zh.md:226-234` 显式为 `null`；不能复制现有 `星露谷物语指南` 或从 EN 翻译推断。整体双语 registry 仍被 ZH 阻塞。 |
| `author` | `null` | `null` | **UNRESOLVED**：两份 handoff 都显式 `null`。虽然现有 entries 使用 `Stardew Valley Planner Team` / `星露谷规划器团队`，source 没有默认 author，且 spec 明确不授权猜测 byline。 |
| `readTimeMinutes` | `null` | `null` | **UNRESOLVED**：两份 handoff 都显式 `null`。source 只要求正整数；现有值实际为 6–19 且多值变化，`formatBlogReadTime` 只有输入校验/格式化，没有计算或默认。 |
| `coverImage.src` | `/blog/pine-tree-stardew-cover.webp` | `/blog/pine-tree-stardew-cover.webp` | **VERIFIED（handoff path）**：EN `:258-266`、ZH `:300-308`。**UNVERIFIED（handoff/artifact receipt）**：初始读取时 WebP/AVIF 均缺失；随后只读回读发现 6 个媒体文件已出现并通过基本 `file`/`webpinfo`/AVIF magic/size checks，但它们是本 worker 范围外的未跟踪状态，尚无 handoff receipt、授权、页面绑定或 cover alt。 |
| `coverImage.alt` | `null` | `null` | **UNRESOLVED**：EN/ZH cover 均 `alt=null`、`altStatus=pending_media`；inline figure alt（EN `handoff-en.md:268-286`、ZH `handoff-zh.md:310-328`）描述的是两张不同正文图，不能充当封面 alt。封面文件不存在，也不能从不存在的画面发明描述。 |
| `featured` | `null` | `null` | **UNRESOLVED**：两份 handoff 都显式 `null`。当前 38 entries 全是 `true` 只是已有数据分布，不是 type/default；registry validator 要求显式 boolean。 |
| `Content` | locked body 已有 hash，但 source function/module 缺失 | locked body 已有 hash，但 source function/module 缺失 | **UNVERIFIED（implementation binding）**：registry 要求 function；计划模块名在 `project-interface-spec.md:208-218`，实际 `.en.tsx` / `.zh.tsx` 不存在。EN body SHA `3b53cbcd…99a8c1`、ZH body SHA `d5483df4…ca690` 只证明锁定正文 bytes，不证明 source module。 |
| locale / country（非 `BlogPostMeta` 字段） | `en` / `US` | `zh-CN` / `CN` | **VERIFIED（handoff/input）**：handoff 头部及 JSON 明确给出；source locale contract 只承认 `en` / `zh-CN`。country 不应新增到 registry metadata。 |
| FAQ（非 `BlogPostMeta` 字段） | `null` | `null` | **VERIFIED（optional handoff state）**：两份 handoff 明确无 FAQ heading/items；不需要为 registry 猜 FAQ。 |

## 5. 明确阻塞项（不能通过现有 entries 补齐）

1. **ZH topic：** 当前 EN handoff 有 `Stardew Valley Guides`，ZH handoff 是 `null`；现有 `星露谷物语指南` 只能作为历史 convention，不能作为本目标的授权值。
2. **Author（双语）：** 当前 handoff 没有 byline；不能因为现有 38 entries 都使用团队名称就复制。
3. **Featured（双语）：** 当前 handoff 没有显式 boolean；不能因为现有 38 entries 都为 `true` 就默认 true。
4. **Read time（双语）：** 当前 handoff 没有正整数；没有 contract formula，且现有 source 值变化，不能由 body bytes/line count、Title 或其他文章反推。
5. **Cover alt（双语）：** 当前 handoff 明确 null/pending_media；必须等待实际 cover 文件并用真实画面写 alt。正文 figure alt 不能复用。
6. **Source registration：** target slug 当前不在 identities、blog-copy 或 registry；没有 `BlogPostSlug` 类型值，也没有 paired route binding。这个是 **UNVERIFIED / NOT REGISTERED**，不应被 title review PASS 覆盖。
7. **Content modules / media：** locked bodies 存在且 hash 可回读，但目标 article functions 仍不存在。六个媒体文件在本轮后续读回中已存在并通过基础格式/尺寸/字节检查，但其出现属于 checkout 外部未跟踪状态；handoff receipt、授权/署名、cover alt、source/page binding 仍缺失，不能声称页面可 build 或可浏览器验收。

## 6. Concrete next-owner recommendation

**下一责任人：PublicBlogHandoff / page-metadata owner（不是当前 G page assembler）。** 请先在同一 V7 交接中明确并重新 hash 绑定：

1. 为 `en` 与 `zh-CN` 分别写入经过授权的 `topic`、`author`、`featured`、正整数 `readTimeMinutes`；至少补齐当前 EN/ ZH handoff 的 `null` 字段，不能引用本报告或其他文章作为默认。
2. 对现有共享 cover 和两张正文图完成责任归属与正式 media receipt；本轮后续回读已证明 3 个 WebP 为 `1672×941`、lossy `VP8 ` 且 3 个 AVIF 有 `ftypavif`，但这只是文件事实，不替代授权/署名/页面绑定。随后根据真实 cover 画面回填 cover alt；不能把两个正文 figure alt 代替 cover alt。
3. 更新双语 `PublicBlogHandoff` 为可供装配者消费的 ready/validated 记录，并保留新的 body/SEO/media hashes。若正文或四个 SEO 字段变化，按 E review 要求重算对应 hash。
4. handoff 完成后，**页面 assembler/G owner** 才可在明确 WritePageGrant 下创建两个 article modules、追加 slug/paths、绑定 registry，并运行 spec 中列出的 typecheck/focused tests/build；这些是后续写入任务，不在本审计中执行。

在上述交接完成前，最小安全结论是：`slug/title/description` 可作为候选输入，EN `topic` 可作为 handoff 显式输入；其余 blocked fields 不得静默补齐。

## 7. Read-only commands and real exit codes

以下均为本轮真实执行；没有 build、typecheck、Vitest、dev server、browser、deployment、commit、push、外部写入或 secret 访问。

| 命令/检查 | 真实结果 | exit code |
|---|---|---:|
| `git status --short --branch` | 初始分支 `博客二`；目标目录在写入前已经是 untracked baseline | 0 |
| `find docs/blog-ops/pine-tree-stardew -type f -print \| sort` | 写入前 22 个文件；`G-metadata-resolution.md` 不存在 | 0 |
| `nl -ba` 回读 `src/blog/blog-post-registry.tsx`、`src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts`、route/SEO/component contracts | 成功读取真实行号和字段规则 | 0 |
| `rg -n 'pine-tree-stardew' src/blog/blog-post-registry.tsx src/blog/blog-post-identities.ts src/blog/blog-copy.ts` | 当前 source target 无命中 | 1（预期未命中） |
| `rg -n 'pine-tree-stardew' app tests public` | 当前 app/tests/public target 无命中 | 1（预期未命中） |
| target article/cover/AVIF `test -e` loop（初始读取） | 目标 EN/ZH modules、cover WebP/AVIF 均 `MISSING` | 0（wrapper 已收集缺失状态） |
| 后续 `stat`/`file`/`webpinfo`/`xxd`/`shasum` 回读 6 个外部新增媒体 | 3 WebP 均 `1672×941`、lossy `VP8 `；3 AVIF 均有 `ftypavif`；实际大小/hash 见本节后注；article modules 仍 `MISSING` | 0（每项工具调用成功） |
| Python fenced-JSON parse of `handoff-en.md` / `handoff-zh.md` | 成功解析；输出两种 locale、SEO、registry nulls、cover pending/missing；raw hashes `be15025f…66f8` / `cca6ce0f…70b0` | 0 |
| Python regex scan of current registry values | `topic` 38/2 locales；`author` 38/2 locales；`readTimeMinutes` 38 个且多值；`featured` 38 个全为 `true` | 0 |
| `shasum -a 256` source/contracts/handoffs/title reviews/locked bodies | 成功输出本报告记录的全部 raw/body hashes | 0 |
| `test -d node_modules/next/dist/docs` | 本 checkout 没有安装该 Next docs 目录；本只读任务未运行 build/typecheck/test | 0（if-wrapper 输出 absent） |

## 8. Post-write scope checks

本报告创建前的 docs snapshot 有 22 个文件。后续共享 checkout 的 docs 目录又出现两个新增路径：本报告 `G-metadata-resolution.md`，以及范围外的 `G-assets-receipt.md`；完整 `git status` 还显示 6 个 `public/blog` 媒体 untracked 路径。后两类路径在初始缺失检查后于本轮外部出现；本 worker 只创建/更新本报告，未创建、未修改、未 stage `G-assets-receipt.md` 或 6 个 public assets，故将它们作为范围外状态报告而非本报告 diff。以下检查不把 untracked 目录的普通 `git diff` 空输出误报为“无文件”：

- `test -s docs/blog-ops/pine-tree-stardew/G-metadata-resolution.md`：必须为 0。
- `awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/G-metadata-resolution.md`：必须无尾空格且为 0。
- `git diff --check`：必须为 0。
- `git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/G-metadata-resolution.md`：新 untracked 文件预期返回 1；只要无 whitespace diagnostic 即通过该检查。
- 写后 `find ... | sort` 与写前 snapshot 对比：本 worker 预期新增 `docs/blog-ops/pine-tree-stardew/G-metadata-resolution.md`；若共享 checkout 同时出现其他 worker 的 `G-assets-receipt.md` 或 public assets，只报告并保持原样，不将其归入本 worker 写入。

### 8.1 本轮后续媒体只读回读（范围外状态）

以下值来自报告写入后、未修改文件的只读命令；它们不改变 metadata unresolved 结论，也不代表授权、页面绑定或部署：

- `public/blog/pine-tree-stardew-cover.webp`: 32,094 bytes; SHA-256 `4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6514`; `file`/`webpinfo` 均为 `1672×941`, lossy `VP8 `。
- `public/blog/pine-tree-stardew-cover.avif`: 19,430 bytes; SHA-256 `6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1`; header `ftypavif`。
- `public/blog/illustrations/pine-tree-seed-to-tar.webp`: 23,214 bytes; SHA-256 `42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d`; `file`/`webpinfo` 均为 `1672×941`, lossy `VP8 `。
- `public/blog/illustrations/pine-tree-seed-to-tar.avif`: 17,100 bytes; SHA-256 `bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544`; header `ftypavif`。
- `public/blog/illustrations/pine-tree-stage-four-neighbor.webp`: 20,746 bytes; SHA-256 `1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5`; `file`/`webpinfo` 均为 `1672×941`, lossy `VP8 `。
- `public/blog/illustrations/pine-tree-stage-four-neighbor.avif`: 15,994 bytes; SHA-256 `60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0`; header `ftypavif`。

`comm -13 /tmp/pine-tree-stardew-files-before.txt /tmp/pine-tree-stardew-files-after3.txt` 的 docs-only diff 输出两个路径：`G-metadata-resolution.md` 与范围外 `G-assets-receipt.md`；本 worker 只拥有前者。完整 status 中的 6 个 public assets 同样是独立范围外变更，已保持原样。
