# H-final acceptance v2 — `profit-margin-stardew`

- **审计时间：** 2026-09-23 21:27:14 CST（Asia/Shanghai，UTC+08:00）
- **Worktree：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **Branch / HEAD：** `博客` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`
- **类型：** G0/G2 与 E-page 结算后的最终只读接受检查
- **唯一写入：** 本报告 `docs/blog-ops/profit-margin-stardew/H-final-acceptance-v2.md`
- **总判定：** **FAIL**；不能写成双语页面交付 PASS，也不能外推为生产/部署/收录通过。

## 1. 结论摘要

五道门按“目标范围”分类如下：

| 门 | 结果 | 结论 |
|---|---|---|
| G0 handoff/media | **FAIL** | 双语 handoff、C/body hash、figure token、实际媒体格式/尺寸/体积大多一致；但 `advanced-options.avif` 的 SHA-256 在 G0/G2 报告中与当前真实文件不一致，属于目标范围内的报告/证据不一致。 |
| G2 assembly | **PASS** | 目标 identity、双语 copy、registry、显式文章组件、`llms.txt`、目标测试夹具和静态文件均存在；没有修改 shared shell、共享 route、配置或部署边界，也没有新增 FAQPage。 |
| 验证证据 | **PASS*** | G2 的目标断言通过，typecheck/build 通过；两个 aggregate Vitest 命令均为 exit 1，但失败项是已知既有 blog-index/collection baseline，单列如下，未包装成通过。 |
| E-page | **FAIL** | EGo 本地 EN/ZH 证据矩阵为 PASS 8 / FAIL 6 / UNVERIFIED 2；JSON-LD、`og:locale`、cover 优先级和 EN lazy figure 有目标范围问题。 |
| 当前树边界 | **PASS** | `git diff --check` 通过；tracked diff 为 G2 allowlist，E worker 除 `E-page-review-v2.md` 外未发现额外文件；没有 commit、push 或 deploy。 |

`*` Gate 3 的“PASS”只表示目标范围证据可结算，不表示仓库 aggregate suite exit 0。五门计数为 **PASS 3 / FAIL 2 / UNVERIFIED 0**；E-page 内部 16 个 locale-contract 单元另计为 **PASS 8 / FAIL 6 / UNVERIFIED 2**。由于存在目标范围 FAIL，最终结论保持 FAIL。

## 2. 读取范围与边界

已读取：

- 当前仓库 `AGENTS.md`；
- `G0-handoff-media.md`、`G2-page-assembly.md`、`E-page-review-v2.md`；
- `handoff-en.md`、`handoff-zh.md`、`F-en-lock.md`、`F-zh-lock.md`；
- `project-interface-spec.md`；
- 当前绑定版本的 `D-en-final-check-v2.md`、`D-zh-final-check-v9.md`、`E-en-final-review-v2.md`、`E-zh-final-review-v9.md`、`E-en-title-review.md`、`E-zh-title-review.md`；
- 当前源码、测试、媒体、静态产物、package scripts 和实际 Git 状态。

本报告没有修改源码、正文、媒体、handoff、既有报告、配置、package/lock、`next-env.d.ts` 或生成产物；没有启动浏览器、重跑 G2 测试、提交、推送、部署或写外部服务。EGo 页面证据直接采用 `E-page-review-v2.md`，不把其未验证项改写成 PASS。

## 3. G0 handoff/media：**FAIL**

### 3.1 Handoff、C source 与 body 的当前回读

只读 Python JSON-fence/body/hash 检查 exit `0`。两份 handoff 均成功解析；body 为 NFC/UTF-8，去除后的 reader body 不含页面级 H1，两个 figure token 各出现一次，`faq=null`，schema 明确为 Article 且 `doNotEmitFAQPage=true`。

| Locale | handoff SHA-256 | C source 实际 SHA-256 | bodyHash 实际/声明 | body bytes | source/body 绑定 |
|---|---|---|---|---:|---|
| `en` | `7166bf4992acfd89f86558633cc9229ed464f35301b2949ee4dc9581887b56fc` | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | `e8f60a6a657cd63d37b52475c98c3616a83d7f9ac3e8c5c9f292af4fa6ba0c22` | 14,526 | PASS |
| `zh-CN` | `6e451011d6e3e5347b57d5848a076272a64d1a36b632b591c83906ac93f70570` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` | `1546b07e33e89e2d2c86edf9e17e9a8bb535fc67ecbef31197a550cbcb4e9881` | 12,342 | PASS |

锁定的 D/E/F 绑定与当前 C 也一致：EN 使用 `ab5d9e...7068aa`，ZH 使用 `0db262...f59a699`；D-en v2、D-zh v9、E-en v2、E-zh v9、E-en title review、E-zh title review 均只作为对应 hash 的内容/题文证据，不外推为页面或生产证据。

### 3.2 实际媒体元数据、大小与 hash

实际命令：`sha256sum`、`wc -c`、`file`、`webpinfo`、`ffprobe`，均从本 worktree 读取。六个文件均存在；WebP 为 lossy VP8/`Chunk VP8`，AVIF 为 AV1，尺寸均为 `1672×941`，WebP/AVIF 同 stem，字节预算均满足 G0 记录的 cover `≤1.25 MiB`、figure `≤400 KiB`。

| Asset | WebP bytes / SHA-256 | AVIF bytes / SHA-256 | 实际格式/尺寸 |
|---|---:|---:|---|
| cover | 63,114 / `1a82f3663672b2562ddb0899f70270b3f2e105257d4ebd7952c14c191c57bd37` | 11,367 / `3db4b799d15f0e4352e1d7fb4a6f289502693435947ca9feced779bb66d646fd` | VP8 lossy / AV1，1672×941 |
| `fig-01-price-boundary` | 61,624 / `aa1de6af629621b2161ceb73c1ab1b24926cb9699d52d0cb869f2fc713d481e6` | 15,942 / `68ee809d4d9a90e48b5c8e4db7a649113d39eb75b5cfe7f80ac9a82863bfe195` | VP8 lossy / AV1，1672×941 |
| `fig-02-advanced-options-path` | 46,466 / `f6d79ba75c190637d73a2768dafc67ecd8a5a05b3a3b5b07df28b62f7f4cc524` | 12,313 / `a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a` | VP8 lossy / AV1，1672×941 |

### 3.3 目标范围失败：G0/G2 报告中的 AVIF hash 不一致

当前真实 `profit-margin-stardew-advanced-options.avif` SHA-256 为：

```text
a9a8ac87426fc27d5b8d71bfc356450153ed225ec26f53106c1fa88e90f6136a
```

但 `G0-handoff-media.md:20` 与 `G2-page-assembly.md:33` 均记录为：

```text
a9a8ac87426fc27d5b8d71bfc35606c1fa88e90f6136a
```

因此，媒体文件本身的存在、格式、尺寸、体积和 WebP/AVIF sibling contract 可通过；但是“媒体与报告保持一致”的 G0 门不能判 PASS。未修复该报告或媒体问题。

## 4. G2 page assembly：**PASS**

只读回读确认：

- `src/blog/blog-post-identities.ts` 已追加 `profit-margin-stardew`；
- `src/blog/blog-copy.ts` 有 `/profit-margin-stardew` 与 `/zh/profit-margin-stardew`；
- `src/blog/blog-post-registry.tsx` 有 EN/ZH 两个目标 registry 条目和 `ProfitMarginStardewEnglishArticle` / `ProfitMarginStardewChineseArticle`；
- 两个显式文章 Server Component、`public/llms.txt`、目标 identity/registry/content/media/route 测试均存在；
- `out/profit-margin-stardew.html` 与 `out/zh/profit-margin-stardew.html` 存在，分别为 84,422 与 88,147 bytes；两个 HTML 都是正确 locale、恰好一个 H1、一个 Article JSON-LD、包含 cover/两个 figures、且没有 `FAQPage`；
- `out/llms.txt`、`out/sitemap.xml`、`out/robots.txt` 存在，目标双语路径出现在 llms/sitemap 静态产物中；
- `rg -n -e 'FAQPage'` 对两个文章模块和两个目标 HTML 均为 exit `1`（预期无匹配）；
- `git diff --name-only -- app src/components src/i18n src/seo` 无输出，shared shell、共享 dynamic route、metadata/structured-data helper 没有 tracked diff；package/config/lock/`next-env.d.ts` 也没有当前 status 变化。

G2 记录的 scope 保持：没有新建第二套 route，没有修改 shared shell/route/deploy/commit 边界，没有执行生产 smoke、live HTTP、部署、commit、push 或外部写入。G0 hash typo 另在 Gate 1 记录，不把它静默归为浏览器或 baseline 问题。

## 5. 验证证据：**PASS***（target-scope / aggregate baseline 另计）

以下是 G2 已实际记录的命令、退出码和结果；本 H 没有为避免生成/增量写入而重跑这些命令。

| 检查 | 命令 | Exit | 真实结果 | 范围归类 |
|---|---|---:|---|---|
| TypeScript | `pnpm typecheck` | 0 | `tsc --noEmit` passed | 目标/仓库检查 PASS |
| G2 focused Vitest | `pnpm exec vitest run tests/blog/profit-margin-stardew-identity.test.ts tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-direct-reader-voice.test.tsx tests/blog/blog-sources.test.tsx tests/blog/blog-article-content.test.tsx tests/assets/blog-cover-images.test.ts tests/assets/public-avif-assets.test.ts tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts` | 1 | 11 files passed、1 failed；90 passed、2 failed（92 total）。目标 identity/registry/home/direct-reader/sources/article-content/media/route/canonical/metadata/目标 paired article-route assertions passed | aggregate exit 1；2 项是既有 baseline |
| Static build | `NEXT_TELEMETRY_DISABLED=1 pnpm build` | 0 | Next 16.3.0 Turbopack 编译、TypeScript、静态生成均完成；`56/56`；每个 locale 的 dynamic route 列出 20 个注册文章路径；目标 HTML readback 通过 | PASS |
| Static/export Vitest | `pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/removed-public-pages.test.ts` | 1 | 4 files passed、1 failed；17 passed、1 failed（18 total）。`sitemap-robots`、`llms`、`static-routes`、`removed-public-pages` passed；目标 fixture 文件存在且目标静态 HTML 已读回 | aggregate exit 1；1 项是既有 baseline |

### 已知 baseline 与目标范围分界

- focused Vitest 的既有失败为 `tests/routes/blog-routes.test.tsx` EN line 53、ZH line 93：旧 blog index 断言仍要求 `/how-to-earn-money-stardew` 与 `/zh/how-to-earn-money-stardew`。G2 未通过改动目标页面或无关旧断言来掩盖它。
- static/export Vitest 的既有失败为 `tests/routes/static-public-pages.test.ts` line 2050：旧 `/blog` collection 断言要求 `/blog/how-to-earn-money-stardew-cover.webp`。G2 保留该既有失败；目标静态 fixture 位于后续 allowlisted test 区域，aggregate 在该 baseline assertion 处失败。
- 上述 3 个失败不是 `profit-margin-stardew` 目标断言失败；但命令的真实退出码仍是 `1`，不能在报告中写成仓库测试全绿。

## 6. E-page 本地 EGo：**FAIL**

证据来源：`E-page-review-v2.md`。该报告记录 EGo Browser / Ego Lite、TaskSpace `42`、目标 worktree listener `http://localhost:3013`（PID `55218`，cwd 为本 worktree），EN/ZH 均由 `page.fetch()` 返回 HTTP 200。该本地 listener 已按报告停止；没有重开浏览器，也没有访问 production。

E-page 总矩阵为 **PASS 8 / FAIL 6 / UNVERIFIED 2**（8 contracts × 2 locales）：

| Contract | EN | zh-CN | 真实证据摘要 |
|---|---|---|---|
| HTTP 200、`document.lang` | PASS | PASS | 两条目标 route fetch 200；`lang=en` / `lang=zh-CN`。 |
| locked title/description、一个可见 H1、无 body H1 | PASS | PASS | Title/description 与 F/handoff 一致；各 DOM 一个可见 H1，body 从 H2/H3 继续。 |
| Article JSON-LD、无 FAQPage | **FAIL** | **FAIL** | 各有一个 Article、无 FAQPage，但均缺少任务要求的 `datePublished`、`author`、`image`。 |
| reader body、list/table/CTA/Sources、无内部 marker | PASS | PASS | 本地 DOM 读到正文、三张表、planner CTA、内链、Sources；marker scan false。 |
| cover、两张 body image、resource、loading、alt/caption | **FAIL** | **FAIL** | 六个 WebP/AVIF 资源均 200，alt/figure lazy 基本存在；但 cover `fetchPriority=auto` 而非 high。EN 最终 desktop 还记录 price-boundary `complete=false`、`naturalWidth=0`、`currentSrc=""`；ZH 两张 body figure 在滚动后加载。 |
| canonical/hreflang/OG/Twitter/locale、EN/ZH pairing | **FAIL** | **FAIL** | canonical、hreflang、OG URL/type/image、Twitter 和语言切换均匹配；两页都缺少 `meta[property="og:locale"]`。本地证据不代表 configured public origin 已部署。 |
| mobile tables、无横向 overflow、键盘 focus、CTA/内链、alt/headings | PASS | PASS | 390×844 时 `documentElement.scrollWidth=390`、三张表在内容框内；Tab/click 到 planner 和文章内链。 |
| deployment/CDN/index/production | UNVERIFIED | UNVERIFIED | 明确在 E-page 范围外；没有 production HTTP、CDN、部署、收录或搜索结论。 |

### E-page 目标失败复现摘要

1. 解析 `script[type="application/ld+json"]`：EN/ZH 均只有 `@context`、`@type`、`headline`、`description`、`url`、`inLanguage`、`isPartOf`，没有 `datePublished`、`author`、`image`。
2. `document.querySelector('meta[property="og:locale"]')?.content ?? null`：EN/ZH 都是 `null`。
3. cover DOM 为 eager（`loading=auto`），但 `fetchPriority=auto`，不满足 high-priority contract。
4. EN desktop 最终 scroll 后，`img[src*="profit-margin-stardew-price-boundary"]` 为 `complete=false`、`naturalWidth=0`、`currentSrc=""`；直接请求对应 WebP/AVIF 虽然各为 200，这不能替代实际页面显示证据。

这些均是目标页面验收问题，不是 G2 的三项已知 baseline；本报告不修复。

## 7. 当前树边界与 Git 证据：**PASS**

### 7.1 实际状态

实际命令结果：

```text
pwd=/Users/wusir/orca/workspaces/stardew planner/博客
branch=博客
HEAD=6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c
git diff --check: exit 0, no output
```

`git diff --name-only` 的 18 个 tracked paths 为：

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

这些 tracked paths 与 G2 的 allowlist 一致。当前 untracked target source/media/test 也只落在 G2 allowlist；脚本检查“untracked outside target docs/media/article/test roots”无输出。`docs/blog-ops/profit-margin-stardew/` 中的 A-F、G0/G2、旧 H、handoff 和 spec 是本轮之前已经存在的报告包；本次没有修改它们。

### 7.2 E worker 边界、提交与部署

- `E-page-review-v2.md` 是 E-page 报告本身；未发现 E worker 除该报告之外新增或修改文件。
- 目标源/测试/媒体的 mtime 均早于 G2 report；E-page report mtime 为 `2026-09-23 20:34:36`，没有出现 E 之后的 app/shared shell/config/package/lock/`next-env.d.ts` 变化。
- 本任务没有 commit、push、deploy、数据库写入、外部服务写入；HEAD 仍为 `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`。这只说明本地/本任务未执行这些操作，不是 production 状态证明。

## 8. 目标 FAIL、既有 baseline、UNVERIFIED 清单

### 目标范围 FAIL（必须阻止整体 PASS）

1. `G0-handoff-media.md:20` 与 `G2-page-assembly.md:33` 的 `advanced-options.avif` SHA-256 均错误/不完整，和当前真实文件不一致。
2. EN/ZH Article JSON-LD 均缺少任务要求的 `datePublished`、`author`、`image`。
3. EN/ZH `og:locale` 均缺失。
4. EN/ZH cover `fetchPriority=auto`，不满足 high-priority contract。
5. EN 最终本地 desktop 的 price-boundary lazy figure 未完成且 `currentSrc` 为空，不能接受为“实际显示全部三图”。

### 既有 baseline（不归因于目标页面、但命令 exit 仍为 1）

- `tests/routes/blog-routes.test.tsx` 的旧 EN/ZH blog-index 两项；
- `tests/routes/static-public-pages.test.ts` 的旧 collection-cover 一项。

### UNVERIFIED（不能外推）

- production/live HTTP、CDN/cache、deployment/publish version；
- production sitemap/robots/llms；
- Google indexing、Search Console、SERP、AI Overview、ranking、rich results、CTR；
- 用户最终审阅；
- E-page contract 8 的 EN/ZH deployment/CDN/index/production 状态。

## 9. 最终建议

暂不把该双语文章标记为可发布 PASS，也不要据此部署或声称已上线/已收录。后续应在获得独立写入授权后，先校正并重新验证 AVIF hash 证据，再处理 E-page 已复现的 JSON-LD 字段、`og:locale`、cover priority 和 EN lazy figure 问题；修复后重新执行独立 EGo 页面验收以及受影响的 G0/G2 证据结算。本报告只报告事实，没有修复任何问题。
