# G-page assembly — `profit-margin-stardew`

- **日期：** 2026-09-23（Asia/Shanghai）
- **工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **状态：** **BLOCKED — stop condition**
- **范围：** 仅检查并记录本次双语页面装配前置条件；没有写入源码、正文、媒体、测试、配置、依赖、数据库或外部服务。

## 1. 结论

本次未装配 `profit-margin-stardew`。C 正文、D/E 正文门和 F 锁稿的绑定 hash 已重新读取并通过，但当前目标目录没有有效的双语 `PublicBlogHandoff`，也没有可读回且已绑定的 cover/Figure 1/Figure 2 WebP+AVIF、尺寸、alt/caption、归属或使用授权字段；按照 `project-interface-spec.md:468–489`，不能猜测 metadata、路径、媒体或授权，也不能创建 cover-only 或无媒体半成品。

本次唯一新增文件是本报告；没有修改下列装配目标：

- `src/blog/articles/profit-margin-stardew.en.tsx`
- `src/blog/articles/profit-margin-stardew.zh.tsx`
- `src/blog/blog-post-identities.ts`
- `src/blog/blog-copy.ts`
- `src/blog/blog-post-registry.tsx`
- `public/llms.txt`
- 任何 target-specific test 或 `public/` media

## 2. 已读取的约束与输入

在作出 stop 判断前，已读取：

- `AGENTS.md`
- `docs/blog-ops/profit-margin-stardew/project-interface-spec.md`
- `docs/blog-ops/profit-margin-stardew/F-en-lock.md`
- `docs/blog-ops/profit-margin-stardew/F-zh-lock.md`
- `docs/blog-ops/profit-margin-stardew/E-en-title-review.md`
- `docs/blog-ops/profit-margin-stardew/E-zh-title-review.md`
- `docs/blog-ops/profit-margin-stardew/C-en-draft.md`
- `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- 本地 Next.js 16.3.0 指南：
  - `node_modules/next/dist/docs/01-app/02-guides/migrating/app-router-migration.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`
  - `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/public-folder.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`

已落实的接口结论：现有动态 `[slug]` 路由、`generateStaticParams`、`dynamicParams = false`、static export、`BlogPostMeta`/localized registry、`BlogCopy`、`PublicPicture` 和共享页面壳均不应另建一套；若前置条件齐全，slug 应作为第 20 项追加，canonical 应为 `/profit-margin-stardew` 与 `/zh/profit-margin-stardew`，而不是把 identity 的尾随 `/` 值当作 canonical。

## 3. 版本绑定回读

### 3.1 C 正文 hash

| 输入 | 实际 SHA-256 | F 锁定值 | 结果 |
|---|---|---|---|
| `C-en-draft.md` | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | PASS |
| `C-zh-draft.md` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` | PASS |

### 3.2 读取到的锁定 SEO 值（未写入 registry）

- EN Title：`Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change`
- EN Description：`Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.`
- zh-CN Title：`Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选`
- zh-CN Description：`Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。`

F 报告仍明确把这些值限定为 editorial lock；它们不是已装配的 metadata、H1、OG、Twitter 或 Article JSON-LD 证据。

### 3.3 输入报告 hash

| 输入 | SHA-256 |
|---|---|
| `F-en-lock.md` | `07165f9c6f47d97dd7390b0898899c8a163fd10ce7c7ec62dbd30e6d83eb2509` |
| `F-zh-lock.md` | `dd0898035bfc90d97f9646019d07a2870cd663d788c2fcb693450c667a005a73` |
| `D-en-final-check-v2.md` | `0f4e37d9e1f4819aa83f0e24b21ebd39f066645718dd75b8bd46e8eac7d8bfa6` |
| `D-zh-final-check-v9.md` | `c04ce9b8963020d34924ec1ab1f2e7290419d9efafd33ac62069e986c563b31f` |
| `E-en-final-review-v2.md` | `acce76e45f7c640dde576f50f85069f92bbd14494651023294a9f4e30d864999` |
| `E-zh-final-review-v9.md` | `e20c690b82fb7f7e16513fac80bf85c5db000fea29bf526ffc226c7123388daa` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |

## 4. 阻塞证据

### 4.1 PublicBlogHandoff 缺失

- `find docs/blog-ops/profit-margin-stardew -maxdepth 1 -type f \( -iname '*handoff*' -o -iname '*manifest*' -o -iname '*assembly*' \) -print | sort`：无输出；exit `0`（目录扫描完成，匹配集合为空）。
- `project-interface-spec.md:31–39, 216–229, 468–489` 要求每个 locale 的有效 handoff、bodyHash/integrity、精确 SEO/locale/country、public references、page slots、媒体和 usage 状态；它明确禁止用内部 brief、研究报告或猜测替代 handoff。
- `F-en-lock.md:110–119` 和 `F-zh-lock.md:107–117` 明确将 PublicBlogHandoff/bodyHash 交接、页面 assembly 与实际媒体保留为下游未验证项。

C 文档里的 `fig-01-price-boundary` 与 `fig-02-advanced-options-path` 只是正文语义图位 ID、alt/caption 和来源边界，不是实际 public asset binding；不能把它们变成文件名或占位图。

### 4.2 真实目标媒体/授权字段缺失

- `find public -type f \( -iname '*profit*' -o -iname '*margin*' -o -iname '*fig-01*' -o -iname '*fig-02*' -o -iname '*advanced-options*' -o -iname '*price-boundary*' \) -print | sort`：无输出；exit `0`（扫描完成，匹配集合为空）。
- 只读 Python audit 输出：`target_media_name_candidates=[]`、`public: target_reference_files=[]`、`src: target_reference_files=[]`。
- 没有可读回的 target cover、Figure 1、Figure 2 绑定，也没有 WebP/AVIF 同 stem、1672×941、字节预算、alt/caption、attribution/licensing/usage 状态。现有其他文章图片不能在没有 handoff 的情况下被复制或猜作目标媒体。
- `project-interface-spec.md:261–301` 要求使用 `PublicPicture`、真实 WebP+AVIF sibling、真实尺寸/预算和 cover/inline loading contract；`project-interface-spec.md:330` 明确禁止 placeholder asset、guessed filename 和 cover-only article。

### 4.3 当前服务器状态

- `lsof -nP -iTCP:3003 -sTCP:LISTEN`：无输出；exit `1`，因此本次没有可记录的 3003 listener/PID/cwd/port。
- 未启动开发服务器；没有浏览器/Ego Browser、live HTTP、部署或外部写入。

## 5. 本次命令与结果

| 命令/检查 | 退出码 | 结果 |
|---|---:|---|
| `pwd` | 0 | PASS；目标工作树正确 |
| `git status --short --branch` | 0 | PASS；分支 `博客`；目标 docs 目录为已有 untracked baseline，未归因于本报告以外的源码改动 |
| `shasum -a 256 C-en-draft.md C-zh-draft.md` | 0 | PASS；hash 与 F 锁定值一致 |
| Python hash/缺失字段 audit | 0 | PASS；两份 C hash match=True；handoff/assembly candidates=[]；target media candidates=[]；public/src target refs=[] |
| `git diff --check`（写报告前） | 0 | PASS；无 tracked whitespace diagnostic |
| `lsof -nP -iTCP:3003 -sTCP:LISTEN` | 1 | EXPECTED EMPTY；没有 listener |
| `test ! -e docs/blog-ops/profit-margin-stardew/G-page-assembly.md` | 0 | PASS；报告写入前不存在 |

## 6. 未运行及原因

由于 stop condition 在 handoff/media 前置条件阶段已经触发，以下命令没有运行，不能宣称任何通过：

- `pnpm typecheck`
- spec focused Vitest：
  `pnpm exec vitest run tests/blog/profit-margin-stardew-identity.test.ts tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-direct-reader-voice.test.tsx tests/blog/blog-sources.test.tsx tests/blog/blog-article-content.test.tsx tests/assets/blog-cover-images.test.ts tests/assets/public-avif-assets.test.ts tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts`
- static-export：`NEXT_TELEMETRY_DISABLED=1 pnpm build`
- static suites：`pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/removed-public-pages.test.ts`
- build output readback：`out/profit-margin-stardew.html`、`out/zh/profit-margin-stardew.html`、`out/llms.txt`、`out/sitemap.xml`、`out/robots.txt`
- server route checks and browser/Ego Browser acceptance
- live HTTP, deployment, production/CDN, indexing or external service writes

这些均为 **UNVERIFIED / NOT RUN**，不是 PASS，也不是 target failure。

## 7. 下一步解阻条件

只有在 content/interface owner 提供并允许读回以下内容后，才能重新派发页面装配：

1. 有效的双语 `PublicBlogHandoff`，包含当前 C SHA/bodyHash、精确锁定 SEO 字段、locale/country、正文/AST、public source links、page slots、integrity 和 required schema/CTA/internal-link 信息；
2. 实际 target cover 与两张语义图位所需的 public media binding（若 handoff 要求），包括 WebP、同 stem AVIF、尺寸/字节、alt/caption、attribution 和 licensing/usage；
3. 明确的 target-specific tests 或可读回的现有测试契约；
4. 重新检查当前 worktree/server 状态后，才可运行 spec 要求的 typecheck、focused tests、build 和静态输出检查；浏览器证据仍由独立 E-page worker 负责。

在这些条件满足前，本报告结论保持 **BLOCKED**；不创建 article module，不注册 slug，不写 copy/llms，不复制无关媒体，不提交、不推送、不部署。

## 8. Post-write report hygiene

本文件是本次唯一新增文件。写入后实际回读如下：

| 检查 | 退出码 | 关键输出/结果 |
|---|---:|---|
| `git diff --check` | 0 | 无输出；PASS |
| `git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/G-page-assembly.md` | 1（预期） | 无 whitespace diagnostic；exit 1 仅因目标是 untracked 文件 |
| Python UTF-8/NFC/LF/BOM/NUL/trailing-whitespace 检查 | 0 | `utf8_strict=True`, `nfc=True`, `lf_only=True`, `no_bom=True`, `no_nul=True`, `no_trailing_whitespace=True`, `ends_with_lf=True`, `hygiene_pass=True` |
| `git status --short --untracked-files=all -- docs/blog-ops/profit-margin-stardew/G-page-assembly.md` | 0 | `?? docs/blog-ops/profit-margin-stardew/G-page-assembly.md` |
| target allowlist `git diff --name-only -- ...` | 0 | 无输出；tracked source/media/test 文件均未改动 |

这些检查只证明本报告文件卫生和写入边界，不证明页面装配、构建、媒体或路由通过。
