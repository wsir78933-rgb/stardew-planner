# H-final acceptance v3 — `profit-margin-stardew`（按 approved V7 interface contract）

- **结算日期：** 2026-09-23（Asia/Shanghai）
- **工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **分支 / HEAD：** `博客` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`
- **类型：** G0/G2 装配、EGo 本地页面审查与 AVIF 证据修正后的最终只读结算
- **本文件唯一写入：** `docs/blog-ops/profit-margin-stardew/H-final-acceptance-v3.md`

## 1. 最终结论与计数

### 1.1 五道批准契约门

| 门 | 结果 | 结算判断 |
|---|---|---|
| G0 handoff/media | **PASS** | 两份 handoff、C/body hash、figure token、六个媒体文件、格式/尺寸/大小/sibling 合约均与当前读回一致；G0/G2 的 `advanced-options.avif` 完整 SHA-256 已修正。 |
| G2 page assembly | **PASS** | 目标 identity、双语 copy、registry、显式 EN/ZH article modules、`llms.txt`、目标测试和静态目标文件均存在；没有 route/shared-shell/deploy/commit 边界漂移，也没有 FAQPage。 |
| 验证证据 | **PASS（目标-specific）** | G2 的 typecheck/build 为真实 exit 0；两组 Vitest aggregate exit 1 的 3 个失败断言均为既有 blog-index/collection baseline，单列，不包装成全绿。 |
| EGo local page evidence | **PASS（按批准接口重分类）** | 批准的本地页面事实全部通过；EN price-boundary lazy image 的最终浏览器观察保留为 UNVERIFIED；`og:locale` 与 `fetchPriority=high` 是既有 shared-contract follow-up，不是本关键词目标 FAIL。 |
| 当前树边界 | **PASS** | `git diff --check` exit 0；tracked diff 与 G2 allowlist 一致；E/H/R1 没有在源码、测试、媒体之外留下额外修改；无 commit、push、deploy。 |

**批准五门计数：PASS 5 / FAIL 0 / UNVERIFIED 0。**

这意味着：**目标页面装配 PASS**，但仅表示本关键词双语页面在批准的 V7 project-interface contract 下完成并有本地/静态证据；不表示生产上线、CDN 回源、搜索收录、排名或用户终审通过。

### 1.2 证据层计数与非目标边界

- **EGo 批准接口的 16 个 locale-contract 单元：PASS 13 / FAIL 0 / UNVERIFIED 3。** 3 个 UNVERIFIED 为 EN 价格边界图的最终 lazy 浏览器显示观察 1 项，以及 EN/ZH production/deployment/CDN/indexing 2 项。
- **aggregate baseline：FAIL 3 个既有断言。** focused suite 2 项旧 blog-index 断言，static/export suite 1 项旧 `/blog` collection-cover 断言；它们不是 `profit-margin-stardew` 目标断言失败。
- `og:locale`（EN/ZH 各缺失）与 cover `fetchPriority=high`（EN/ZH 均为 `auto`）是既有 shared-shell/shared-contract follow-up，**不计入批准五门 FAIL，也不修改本关键词页面**。

## 2. 适用契约和历史报告纠正

`project-interface-spec.md` 的批准接口明确规定：

- Article JSON-LD 只有 `headline`、`description`、canonical `url`、`inLanguage`、`isPartOf`（连同标准 `@context` / `@type`）；当前接口明确**没有** `author`、`datePublished`、`publisher`、`BlogPosting` 或 `FAQPage`，不得在没有独立接口变更时新增。
- `createPublicPageMetadata` 的批准字段包括 canonical、`en`/`zh-CN`/`x-default` alternates、OG title/description/type/url/image、Twitter summary fields 和 robots；不要求 `og:locale`。
- 共享 `BlogArticleContent` cover 的批准要求是非 lazy/LCP；不要求 `fetchPriority=high`。
- in-body figures 使用 `PublicPicture`，尺寸 `1672×941`、`decoding="async"`、`loading="lazy"`；不能因为浏览器一次 lazy 观察未稳定复现就擅自改成 eager。

`H-final-acceptance-v2.md` 是按额外严格 E 矩阵生成的历史报告：它把未获批准的 `datePublished`/`author`/`image`、`og:locale`、`fetchPriority=high` 和 EN lazy 观察一并记为目标 FAIL。v3 按当前项目文档纠正这些分类，**不修改 v2**；v2 的历史错误值仍保留在 v2 的历史复盘段中，仅作审计轨迹。

## 3. G0 handoff/media：PASS

### 3.1 当前 handoff、C source、reader body 回读

独立 Python JSON-fence/body/hash readback exit `0`；两份 handoff 均可解析。当前实际值如下：

| Locale | Handoff SHA-256 | C raw SHA-256 | Reader body SHA-256 | Body bytes | Figure tokens |
|---|---|---|---|---:|---:|
| `en` | `7166bf4992acfd89f86558633cc9229ed464f35301b2949ee4dc9581887b56fc` | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | `e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22` | 14,526 | each 1 |
| `zh-CN` | `6e451011d6e3e5347b57d5848a076272a64d1a36b632b591c83906ac93f70570` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` | `1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881` | 12,342 | each 1 |

读回还确认：

- handoff `body` 与从当前 C 文件移除首个 standalone Markdown H1 及其紧随空行后的 reader body **逐字节一致**；声明的 `bodyHash`/`bodyByteLength` 与重算一致。
- 两份 body 均为 NFC、UTF-8、LF、无 BOM、无 NUL、末尾 LF；`faq=null`，schema 为 Article 且 `doNotEmitFAQPage=true`。
- `fig-01-price-boundary` 与 `fig-02-advanced-options-path` 在每份 body 各出现一次；无内部 marker、私有路径、任务/worker/dispatch 信息进入公开 handoff 字段。

### 3.2 六个媒体文件的完整当前 hash、格式、尺寸和 sibling

本次实际执行 `sha256sum` exit `0`；以下为完整 AVIF hash，不使用报告中的截短值：

| Asset | Bytes | SHA-256 | 实际格式/尺寸 | sibling/预算 |
|---|---:|---|---|---|
| `public/blog/profit-margin-stardew-cover.webp` | 63,114 | `1a82f3663672b2562ddb0899f70270b3f2e105257d4ebd7952c14c191c57bd37` | lossy VP8 / 1672×941 | AVIF 同 stem；cover ≤1.25 MiB |
| `public/blog/profit-margin-stardew-cover.avif` | 11,367 | `3db4b799d15f0e4352e1d7fb4a6f289502693435947ca9feced779bb66d646fd` | AV1 / 1672×941 | 与 cover WebP 同 stem |
| `public/blog/illustrations/profit-margin-stardew-price-boundary.webp` | 61,624 | `aa1de6af629621b2161ceb73c1ab1b24926cb9699d52d0cb869f2fc713d481e6` | lossy VP8 / 1672×941 | AVIF 同 stem；figure ≤400 KiB |
| `public/blog/illustrations/profit-margin-stardew-price-boundary.avif` | 15,942 | `68ee809d4d9a90e48b5c8e4db7a649113d39eb75b5cfe7f80ac9a82863bfe195` | AV1 / 1672×941 | 与 figure WebP 同 stem |
| `public/blog/illustrations/profit-margin-stardew-advanced-options.webp` | 46,466 | `f6d79ba75c190637d73a2768dafc67ecd8a5a05b3a3b5b07df28b62f7f4cc524` | lossy VP8 / 1672×941 | AVIF 同 stem；figure ≤400 KiB |
| `public/blog/illustrations/profit-margin-stardew-advanced-options.avif` | 12,313 | `a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a` | AV1 / 1672×941 | 与 figure WebP 同 stem |

`webpinfo` 实际报告三份 WebP 均为 `Chunk VP8`、`Format: Lossy (1)`；`ffprobe` 实际报告三份 AVIF 均为 `codec_name=av1`、`width=1672`、`height=941`。

### 3.3 G0/G2 AVIF 证据修正回读

- 当前 `G0-handoff-media.md:20` 与 `G2-page-assembly.md:33` 均记录完整正确值：`a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a`。
- 旧错误值 `a9a8ac87426fc27d5b8d71bfc35606c1fa88e90f6136a` 在当前 G0/G2 中均为 0 命中；G0/G2 当前报告 hash 分别为 `57ee5c85648c3646ebc121ddc696fd32a5d304d9b43984f32437b6ad09fd774b` 与 `35d07a930461662ea9754b3f9d2d20d2fbb4a5af76472a1ee6bab6a38f2c170c`。
- 该旧错误值仍出现在未修改的历史 `H-final-acceptance-v2.md` 说明段，这是历史 FAIL 的证据，不是当前 G0/G2 的值；按任务要求保留 v2，不做清理或覆盖。

**G0 结论：PASS。** 当前媒体文件本身、handoff 绑定和 G0/G2 证据三者一致；没有发现目标媒体、C/body hash 或 figure token 漂移。

## 4. G2 page assembly：PASS

当前源文件和静态文件独立回读确认：

- `src/blog/blog-post-identities.ts` 的 `profit-margin-stardew` 为第 20 个、末尾追加；没有替换或重排既有 19 个 slug。
- `src/blog/blog-copy.ts` 同时存在 `/profit-margin-stardew` 与 `/zh/profit-margin-stardew`。
- `src/blog/blog-post-registry.tsx` 同时存在 EN/ZH registry 条目、锁定 title/description/topic/author/read time/cover alt/`featured: true`，以及 `ProfitMarginStardewEnglishArticle` / `ProfitMarginStardewChineseArticle`。
- `src/blog/articles/profit-margin-stardew.en.tsx` 与 `.zh.tsx` 均是显式 Server Component：body 从 H2 开始，不渲染 page H1；两个 figure 均使用 `PublicPicture`、`1672×941`、`decoding="async"`、`loading="lazy"`；无 FAQ section 或 `FAQPage`。
- `public/llms.txt` 有且仅有已锁定的双语公开链接/描述；`out/llms.txt` 和 `out/sitemap.xml` 均含目标双语路径。
- `tests/blog/profit-margin-stardew-identity.test.ts` 与 G2 allowlist 中的 registry/home/direct-reader/sources/media/route/canonical/sitemap/static/llms assertions 均存在。
- 当前静态目标文件存在：`out/profit-margin-stardew.html` 为 84,422 bytes，`out/zh/profit-margin-stardew.html` 为 88,147 bytes。独立静态 HTML readback exit `0`：EN/ZH 各为正确 `lang`、恰好一个 H1、恰好一个 Article JSON-LD、Article key 集合正好为 `@context`/`@type`/`headline`/`description`/`url`/`inLanguage`/`isPartOf`，含 cover 与两张 figures，且无 `FAQPage`。

没有创建 `app/profit-margin-stardew/page.tsx` 或 `app/zh/profit-margin-stardew/page.tsx`；没有修改共享 `[slug]` route、`PublicPageShell`、`BlogArticleContent`、`createPublicPageMetadata` 或 `createArticleStructuredData`。这是符合项目接口的 registry-driven assembly，不是 shared-shell 改造。

## 5. 验证证据：PASS（目标-specific）与 aggregate baseline 分列

以下退出码和通过/失败数来自 G2 已实际执行的命令；本 v3 没有重跑 typecheck/Vitest/build，避免重新生成 `.next`/`out` 或增量产物。E-page 报告也明确引用这些 G2 结果为 prior evidence。

| Check | 实际命令 | Exit | 实际结果 | 归类 |
|---|---|---:|---|---|
| TypeScript | `pnpm typecheck` | **0** | `tsc --noEmit` passed | PASS |
| Focused Vitest | `pnpm exec vitest run tests/blog/profit-margin-stardew-identity.test.ts tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-direct-reader-voice.test.tsx tests/blog/blog-sources.test.tsx tests/blog/blog-article-content.test.tsx tests/assets/blog-cover-images.test.ts tests/assets/public-avif-assets.test.ts tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts` | **1** | **11 files passed, 1 failed；90 passed, 2 failed（92 total）** | aggregate baseline |
| Static build | `NEXT_TELEMETRY_DISABLED=1 pnpm build` | **0** | Next.js 16.3.0 Turbopack compiled; TypeScript completed; static generation **56/56**; each locale had 20 article paths | PASS |
| Static/export Vitest | `pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/removed-public-pages.test.ts` | **1** | **4 files passed, 1 failed；17 passed, 1 failed（18 total）** | aggregate baseline |

Aggregate baseline 的 3 个失败断言具体为：

1. `tests/routes/blog-routes.test.tsx` EN line 53：旧 index 断言仍要求 `/how-to-earn-money-stardew`。
2. `tests/routes/blog-routes.test.tsx` ZH line 93：旧 index 断言仍要求 `/zh/how-to-earn-money-stardew`。
3. `tests/routes/static-public-pages.test.ts` line 2050：旧 `/blog` collection 断言仍要求 `/blog/how-to-earn-money-stardew-cover.webp`。

目标 identity、registry、home-state、direct-reader、sources、article-content、cover/media、public-route、canonical、metadata、目标 paired article route、sitemap/robots、llms、static-route、removed-page 和目标静态 fixture 均由 G2 记录为通过；上述 3 项不归因于本关键词目标，不能把 aggregate exit 1 改写成全绿。

## 6. EGo local page evidence：按批准 contract reconciliation

本节只读取 `E-page-review-v2.md` 的 EGo 事实，不重启服务器、不重开浏览器。E-page 的实际环境是本工作树 `http://localhost:3013`、EGo Browser/Ego Lite、TaskSpace 42；EN/ZH `page.fetch()` 均返回 200，且 `lang` 分别为 `en` / `zh-CN`。

### 6.1 批准接口逐项结算

| Approved check | EN | zh-CN | v3 结算 |
|---|---|---|---|
| HTTP 200、locale、正确本地目标 route | PASS | PASS | PASS |
| locked title/description、一个可见 H1、无 body H1 | PASS | PASS | PASS |
| Article-only JSON-LD、批准字段、无 FAQPage | PASS | PASS | PASS |
| reader body、Sources、CTA、内链、无 handoff/hash/figure marker | PASS | PASS | PASS |
| 资源 200、cover 非 lazy、alt/caption、in-body figures lazy | PASS | PASS | **EN lazy display evidence UNVERIFIED**（见下） |
| canonical、hreflang、OG/Twitter approved fields、语言切换 | PASS | PASS | PASS |
| 390×844 无横向滚动、focus、CTA/内链点击、heading/alt | PASS | PASS | PASS |
| production/deployment/CDN/indexing | UNVERIFIED | UNVERIFIED | UNVERIFIED（范围外） |

Article JSON-LD 的 v3 判定依据当前静态 HTML 与批准 spec：两页各有一个 Article，key 集合正好是 `@context`、`@type`、`headline`、`description`、`url`、`inLanguage`、`isPartOf`，没有 `FAQPage`。E-page v2 将缺少 `datePublished`、`author`、`image` 判为 FAIL，是额外严格矩阵，不适用于本项目批准接口。

### 6.2 EN lazy item：保留 UNVERIFIED，不猜测、不改 eager

E-page v2 的最终 EN desktop scroll 记录：

- `price-boundary` figure 的 `loading=lazy`；
- `complete=false`、`naturalWidth=0`、`naturalHeight=0`、`currentSrc=""`；
- 同次观察中 advanced-options figure 加载为 AVIF 1672×941；
- 对应 WebP/AVIF 资源请求各返回 200；
- ZH 最终滚动加载了 cover 和两张 body figures；
- 没有 source fix，也没有把该 figure 擅自改成 eager。

因此该项是**浏览器观察 UNVERIFIED**，不是目标源码/媒体契约 FAIL；代码和资源契约已经满足 `PublicPicture`、尺寸、async、lazy、AVIF sibling 要求。后续如需复测，应另行授权并重新运行独立 EGo，不在本报告中改实现。

### 6.3 Shared-shell follow-ups：明确记录但不升级为本关键词目标 FAIL

- `meta[property="og:locale"]`：EN/ZH 均为 `null`。`createPublicPageMetadata` 批准输入/输出契约不含该字段，因此这是既有 shared metadata gap/follow-up，不是本关键词页面的失败门。
- cover `fetchPriority`：EN/ZH 均为 `auto`；cover 同时为非 lazy/eager，符合批准的 LCP contract。批准 spec 没有 `fetchPriority=high` 要求，因此这是既有 shared cover follow-up，不修改本关键词页面。

## 7. 当前树边界：PASS

### 7.1 实际 Git 状态

实际读回：

```text
pwd=/Users/wusir/orca/workspaces/stardew planner/博客
branch=博客
HEAD=6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c
git diff --check: exit 0, no output
```

`git diff --name-only` 的 18 个 tracked paths 全部属于 G2 allowlist：

```text
public/llms.txt
src/blog/blog-copy.ts
src/blog/blog-post-identities.ts
src/blog/blog-post-registry.tsx
tests/assets/blog-cover-images.test.ts
tests/assets/public-avif-assets.test.ts
tests/blog/blog-direct-reader-voice.test.tsx
tests/blog/blog-home-state.test.ts
tests/blog/blog-post-registry.test.ts
tests/blog/blog-sources.test.tsx
tests/i18n/public-route-registry.test.ts
tests/routes/blog-routes.test.tsx
tests/routes/llms.test.ts
tests/routes/removed-public-pages.test.ts
tests/routes/sitemap-robots.test.ts
tests/routes/static-public-pages.test.ts
tests/routes/static-routes.test.ts
tests/seo/canonical-public-routes.test.ts
```

当前 untracked target source/media/article/test 也只落在 G2 allowlist；`docs/blog-ops/profit-margin-stardew/` 是既有 A–F、G0/G2、E/H、handoff/spec 审计包，本文件是本次唯一新增报告。

### 7.2 E/H/R1 范围回读

- E-page report、H-final-acceptance、H-final-acceptance-v2 均是 docs 报告文件；当前 tracked diff 中没有 `app/`、`src/components/`、`src/i18n/`、`src/seo/`、package/lock/config 或 `next-env.d.ts`。
- 目标源码/测试/媒体的当前 mtime 均早于 E-page report（E-page `20:34:36`）；H-v2 为 `21:29:28`，修正后的 G0/G2 为 `21:32:29`。结合当前 tracked/untracked status，未发现 E/H/R1 在 G2 allowlist 之外修改源码、测试或媒体的证据。
- 当前 HEAD 仍为 E/G2/H-v2 记录的 `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`；本次没有执行 commit、push、deploy，也没有写外部服务。`origin/博客` 不存在，不能据此声称远端同步。
- 本 v3 文件自身 readback：strict UTF-8/NFC/LF、无 BOM/NUL/尾随空白，exit `0`；`git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/H-final-acceptance-v3.md` 无诊断、exit `1`（未跟踪新文件的预期 no-index 状态）。

## 8. 生产与外部状态边界

以下均为 **UNVERIFIED**，不得从本地 PASS 外推：

- production route / live HTTP / CDN cache；
- deployment、发布版本和托管静态输出；
- production sitemap、robots、`llms.txt`；
- Google indexing、Search Console、SERP、AI Overview、rich results、ranking、CTR；
- 用户最终终审。

## 9. Final handoff judgment

**目标页面装配 PASS（按 approved V7 interface contract）。**

批准范围内没有目标源码、媒体、C/body hash、figure token 或写入范围漂移；G0/G2 的完整 AVIF hash 已与实际文件一致；目标页面有 G2 source/static evidence 和 EGo 本地事实证据。EN lazy figure 的一次最终浏览器显示观察保持 **UNVERIFIED**；`og:locale` 和 `fetchPriority=high` 保持为非目标 shared-shell follow-up；aggregate baseline 的 3 个失败断言另列，不能包装为仓库全绿。该结论不是生产上线、收录、排名或用户批准结论。

本报告没有修改源码、测试、媒体、handoff、G0/G2/E/H 既有报告、配置、package/lock、`next-env.d.ts`、生成产物、数据库或外部服务；没有提交、推送、部署或删除/覆盖文件。
