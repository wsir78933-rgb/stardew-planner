# R-final-current-audit：`pine-tree-stardew` 当前集成终审

- **审计日期：** 2026-09-23（Asia/Shanghai）
- **工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客二`
- **分支 / HEAD：** `博客二` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`
- **任务性质：** 只读当前状态集成审计；本文件是本 Dispatch 唯一允许写入的文件。
- **明确未做：** 未修改源码、测试、媒体、handoff、registry、配置、依赖或其他报告；未提交、推送、部署、删除监听器、处理密钥或执行外部写入。
- **状态语义：** `PASS` 只覆盖对应证据范围；`FAIL` 只归属于明确失败的目标或基线；`UNVERIFIED` 表示没有当前证据，不能推断为 PASS。

## 1. 结论先行

### 1.1 目标范围结论

**`pine-tree-stardew` 当前源代码、双语 registry、metadata、文章模块、媒体、静态产物和目标 focused checks：PASS。** 当前 EN/ZH 页面已经进入 source registry，目标双语路径、canonical/hreflang、Article-only JSON-LD、CTA、cover/两张正文图和 `llms.txt`/sitemap 静态入口均有当前证据。

**目标页面本地 EGo 桌面/移动复核：PASS（时间限定证据）。** 2026-09-23 的 EN/ZH EGo 终审均在目标工作树的真实 `127.0.0.1:3003` 运行时上完成；目标页范围内未发现 FAIL。当前审计开始时端口 3003 已无 listener，因此不能把旧 listener 继续写成“现在仍在线”的 HTTP 证据；当前即时 HTTP 状态为 **UNVERIFIED**，见第 7 节。

### 1.2 整体仓库与发布边界

**仓库 aggregate：NOT GREEN。** 当前目标相关 focused 断言通过，但更宽的源 focused suite 有 2 个旧博客索引断言失败，静态 suite 有 1 个旧 cover fixture 失败；同日 `pnpm test` 还记录 1 个与 Pine 无关的 local planner resource-smoke timeout。上述失败均不属于 Pine 目标缺陷，也未在本审计中修复。

**共享 shell：FAIL（范围外/基线问题）。** EN EGo 移动复核在 `390×844` 发现公共 header 的品牌 link 是空的圆角 pill：DOM 中有可访问品牌文字，但 link 宽度为 `26px`，其 `/favicon.png` 子图 computed width 为 `0px`。该现象同样出现在无关的 `/blog`，所以归类为共享 public shell 问题，不归因于 Pine 文章，不在本次范围内修复。

**部署、生产、CDN、索引、用户终审：UNVERIFIED。** 本审计没有 commit、push 或 deploy；不能声称已发布。`pnpm seo:smoke` 的同日只读记录因生产响应缺失 `strict-transport-security` 以退出码 `1` 停止，未形成目标生产路由证据。

## 2. 工作树边界与当前状态

### 2.1 真实工作树身份

命令：

```sh
pwd
# /Users/wusir/orca/workspaces/stardew planner/博客二

git rev-parse --show-toplevel
# /Users/wusir/orca/workspaces/stardew planner/博客二

git branch --show-current
# 博客二

git rev-parse HEAD
# 6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c
```

以上读取退出码均为 `0`。`git status --short --branch --untracked-files=all` 退出码为 `0`，在本 Dispatch 写报告前观察到：

- 19 个 tracked modified 路径（包括当前 Pine assembly 的 identities/copy/registry、测试及 `public/llms.txt`，也包括其他既有 dirty 状态）；
- 44 个 untracked 路径，其中 35 个在 `docs/blog-ops/pine-tree-stardew/`、6 个 Pine 媒体、2 个文章模块和 1 个 Pine identity test；
- 这些 dirty/untracked 状态在本审计开始前已存在，不作为本 Dispatch 的修改结果。

`git diff --check` 退出码 `0`，无 whitespace 诊断。当前目标改动仍未提交；本审计未执行 commit、push 或任何 Git 写命令。

### 2.2 package scripts

`package.json` 当前相关 scripts：

```text
build:     next build
start:     serve out
test:      vitest
pretest:   NEXT_TELEMETRY_DISABLED=1 pnpm build
typecheck: tsc --noEmit
seo:smoke: node scripts/production-seo-smoke.mjs --origin https://stardewvalleyplanner.art
```

仓库没有 lint script。本报告把 typecheck、focused Vitest、完整 test、build、静态产物、浏览器和外部生产 smoke 分开计分。

## 3. 当前正文、hash、qualified length 与 handoff

### 3.1 当前 locked body 与 handoff 绑定

对当前两份 handoff fenced JSON 和 locked body 执行只读 Python 比对，退出码 `0`：

| locale | locked body bytes / lines | locked body SHA-256 | handoff raw SHA-256 | body_equal | V7 qualified mechanical units |
|---|---:|---|---|---|---:|
| `en` | `19,815 / 184` | `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1` | `78206ca73d712295856ba4feb262f09f860edcc4c26699b9b8a0e5365862d001` | `True` | `2,478` |
| `zh-CN` | `12,155 / 101` | `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690` | `9e8dbe2b70cbcdbebff47ba85799e88adc3876e901816fd77658306373939f6b` | `True` | `2,491` |

当前 C 候选正文 hash 也已回读：EN `C-en-draft.md`=`b8474861a29bc106b5190bbb6452ae29536ddc868c75b1e508e0db22a0727819`，ZH `C-zh-draft.md`=`b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2`。D/E/F 内容证据只绑定这些具体版本，不回收旧 C hash 的结论。

qualified length 使用 V7 `脚本/正文计数.py`，并按锁稿命令剔除图注、`Sources`/`来源`（ZH 还剔除 `常见问题`），两条命令均退出码 `0`：

```text
EN: mechanical_units=2478, required_floor=2000, meets_mechanical_floor=true
    derived count-input sha256=4f659861040b6ca6a24b40f0ca6076ccf921e862d41e7b8f22b865a3a9d03a61
ZH: mechanical_units=2491, required_floor=2000, meets_mechanical_floor=true
    derived count-input sha256=d2d022740f6403f5f80ef84a51a91b4e3fe682f1556385952aaeca088d447cd3
```

这两个 `PASS` 是机械 floor，不等同于语义门、页面、部署或用户终审。

### 3.2 内容门与历史 BLOCKED 报告边界

当前 D/E/F 文件的绑定值为：

- D-en：raw SHA-256 `6101561558b3c6690f10fe0861d441cb7048c6526c797a9bbb7160469a220888`，ResearchTrace / ReaderValue / Repetition = `PASS`，绑定 EN C hash `b847…`；
- D-zh：raw SHA-256 `afc3f2e0bdf8f396a32b6b3f5aaceb60a8a62bf3f249491c6cae2460ae682127`，三门 = `PASS`，绑定 ZH C hash `b92…`；
- E-en body review：raw SHA-256 `bd4844e6d2f9fe38e7b30e0a77b15ebf5ba505f2da2b44138a10e0e0ac44fd89`，内容/事实与 22 项鉴文 = `PASS`；
- E-zh body review：raw SHA-256 `1975e831e004849f20f386ad1dfe737024cc7c74787b6382ea06ae33d0a07968`，正文事实、引用与可读性 = `PASS`；
- E-en title review：`PASS`，body hash `3b53…`，SEO surface hash `68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7`；
- E-zh title review：题文层 `PASS`，body hash `d548…`，SEO tuple hash `2e2e2bdb32b9ad6c5ed8b06e50003c748b3f7b41b429cff44dcfec06649933c8`。

D-en/D-zh 早期报告中的“六个媒体缺失 / UNVERIFIED”只适用于它们各自 2026-09-22 的输入时点，不是当前媒体结论。当前媒体已由本审计第 5 节重新读取。`R-final-blocked-audit-v2.md`、`R-static-precheck.md`、`G-metadata-resolution.md`、`G-meta-convention-audit.md` 和早期 `R-media-review.md` 的 BLOCKED/NOT REGISTERED 结论均不作为当前整体结论；它们只保留为边界历史。

### 3.3 最终 metadata：值、授权与依据

当前 registry runtime 读取命令 `pnpm exec tsx -e 'getAllBlogPosts(...)'` 退出码 `0`，输出确认两种 locale 均有目标 post。最终值如下：

| 字段 | EN (`en`) | ZH (`zh-CN`) | 当前依据 |
|---|---|---|---|
| `slug` | `pine-tree-stardew` | `pine-tree-stardew` | `src/blog/blog-post-identities.ts:21`；双语 handoff route `handoff-en.md:190-192` / `handoff-zh.md:220-224` |
| public path | `/pine-tree-stardew` | `/zh/pine-tree-stardew` | `src/blog/blog-copy.ts:121,144`；route tests/static output |
| `title` = `H1` | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | `星露谷松树种植先看格子，不浇水也不能随便种` | handoff registry `titleEqualsH1=true`；current target route/static/browser readback |
| `description` | `Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.` | `松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。` | handoff SEO fields；current static/browser readback |
| `topic` | `Stardew Valley Guides` | `星露谷物语指南` | current handoff JSON `handoff-en.md:196`, `handoff-zh.md:228`; localized convention rationale at `handoff-en.md:347`, `handoff-zh.md:389` |
| `author` | `Stardew Valley Planner Team` | `星露谷规划器团队` | **用户已授权的团队作者**；current rationale explicitly says “authorized team author” at `handoff-en.md:348` / `handoff-zh.md:390` |
| `featured` | `true` | `true` | explicit editorial decision, not runtime default, at `handoff-en.md:349` / `handoff-zh.md:391`; registry validator requires explicit boolean |
| `readTimeMinutes` | `12` | `13` | explicit editorial estimates, not a formula: EN anchored to `stardew-valley-trees` EN `12` and comparable rendered lengths (`handoff-en.md:350`); ZH anchored to the localized guide `13` and comparable rendered lengths (`handoff-zh.md:392`) |
| `coverImage.src` | `/blog/pine-tree-stardew-cover.webp` | same | current registry and media receipt |
| `coverImage.alt` | `Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground.` | `松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。` | current registry/handoff/media visual binding |
| `Content` | `PineTreeStardewEnglishArticle` | `PineTreeStardewChineseArticle` | named public module exports imported by registry |

The current handoffs are `ready=true`, `frozen=true`, registry `status=complete`, and `blockedReasons=[]`. Their embedded `pageBinding=UNVERIFIED`, `integrity.build=NOT_RUN`, `deployment=NOT_RUN`, and `userReview=not_started` are explicit handoff scope boundaries; later current page/build evidence is recorded independently below and does not rewrite those handoff records.

### 3.4 Registry and route counts

Current `tsx` runtime readback exited `0`:

```text
slugCount=20
lastSlug=pine-tree-stardew
canonicalIdentityCount=40
canonicalPublicPathCount=26
localizedRouteCount=52
indexableLocalizedRouteCount=50
EN target post=present
ZH target post=present
```

This proves current source registration and ordered bilingual route identity. It is separate from deployment.

## 4. Article modules, CTA, JSON-LD boundary and source/body contract

Current module SHA-256:

```text
src/blog/articles/pine-tree-stardew.en.tsx
  5b61738990dac239d34eb3d7898270929ae6c47ccacb2e9168923a4d6e233bc7
src/blog/articles/pine-tree-stardew.zh.tsx
  27bbf27a39f964f7d4c83fc28bf620d12faecf028e310f4cb55262fc646508fe
```

The current read-only SSR/module probe (rerun after an initial stdin-wrapper interop mistake) exited `0`:

```text
EN: h1=0, FAQ/FAQPage residue=0, JSON-LD=0, Sources heading=present,
    planner CTA /#planner count=1, two figure paths, table wrappers=2
ZH: h1=0, FAQ/FAQPage residue=0, JSON-LD=0, 来源 heading=present,
    planner CTA /zh#planner count=1, two figure paths, table wrappers=2
```

The first equivalent `pnpm exec tsx` stdin probe exited `1` with:

```text
SyntaxError: The requested module './src/blog/articles/pine-tree-stardew.zh'
does not provide an export named 'PineTreeStardewChineseArticle'
```

That was a tsx stdin/CJS interop wrapper failure, not a source conclusion; the exact module imports were rerun with `pnpm exec tsx -e` and passed. Target Vitest rendering and static output independently pass.

Current source/body review also confirms:

- EN body links `36/36` and ZH body links `25/25` match the locked/handoff bindings;
- each module starts with an article paragraph and renders no page-level H1;
- each locale has exactly two in-body `PublicPicture` figures at `1672×941`, `loading="lazy"`, `decoding="async"`;
- EN CTA is `/#planner`, ZH CTA is `/zh#planner`;
- source panels are `Sources` / `来源`, with no FAQ, research process, handoff, private path, iframe or JSON-LD residue.

## 5. Media current readback

The following six actual files were read directly. `test -s`, `stat`, `shasum`, `file`, WebP `webpinfo`, and Pillow AVIF/WebP decode all succeeded (overall media probe exit `0`). All images are RGB `1672×941`; WebP files are lossy VP8 with `No error detected.`; each AVIF has `ftypavif` and Pillow decodes it as AVIF.

| role | path | bytes | SHA-256 | format / dimensions | result |
|---|---|---:|---|---|---|
| cover WebP | `public/blog/pine-tree-stardew-cover.webp` | 32,094 | `4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517` | WebP VP8 lossy, `1672×941` | **PASS** |
| cover AVIF | `public/blog/pine-tree-stardew-cover.avif` | 19,430 | `6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1` | AVIF RGB, `1672×941` | **PASS** |
| figure 1 WebP | `public/blog/illustrations/pine-tree-seed-to-tar.webp` | 23,214 | `42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d` | WebP VP8 lossy, `1672×941` | **PASS** |
| figure 1 AVIF | `public/blog/illustrations/pine-tree-seed-to-tar.avif` | 17,100 | `bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544` | AVIF RGB, `1672×941` | **PASS** |
| figure 2 WebP | `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` | 20,746 | `1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5` | WebP VP8 lossy, `1672×941` | **PASS** |
| figure 2 AVIF | `public/blog/illustrations/pine-tree-stage-four-neighbor.avif` | 15,994 | `60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0` | AVIF RGB, `1672×941` | **PASS** |

`G-assets-receipt.md` current raw SHA-256 is `05aa4119c97c658ee8480159e5d05633b8331a190b4fdb69256e5b9d27e975c1`. Its six-file table matches the direct facts above, but its header/embedded status predates final metadata/registry assembly and still describes a historical page blocker. The current media `PASS` above is from direct file/hash/decode readback, not from that stale status text.

## 6. Typecheck, focused/full tests and build

### 6.1 Typecheck

Current no-write command:

```sh
pnpm exec tsc --noEmit --incremental false --pretty false
```

Exit code `0`, no diagnostics. The same-day current final static report also recorded `pnpm typecheck` exit code `0` (`R-static-final-verification.md`, 2026-09-23).

### 6.2 Target-only focused Vitest

Command:

```sh
pnpm exec vitest run \
  tests/blog/pine-tree-stardew-identity.test.ts \
  tests/blog/blog-article-content.test.tsx \
  tests/routes/blog-routes.test.tsx \
  -t 'Pine Tree|new paired article routes|sourced English and Chinese Pine Tree|registers the shared Pine Tree|exposes the locked'
```

Exit code `0`:

```text
Test Files  3 passed (3)
Tests       5 passed | 22 skipped (27)
```

Target media command:

```sh
pnpm exec vitest run \
  tests/assets/blog-cover-images.test.ts \
  tests/assets/public-avif-assets.test.ts \
  -t 'Pine Tree guide|AVIF derivatives'
```

Exit code `0`:

```text
Test Files  2 passed (2)
Tests       3 passed | 11 skipped (14)
```

### 6.3 Broader source-focused suite

Command: the 14-file source-focused selection from the project interface spec, including registry, body, source, route, metadata, asset and target identity contracts.

Exit code `1`:

```text
Test Files  1 failed | 13 passed (14)
Tests       2 failed | 105 passed (107)
```

Both failures are in `tests/routes/blog-routes.test.tsx` and require old `/how-to-earn-money-stardew` / `/zh/how-to-earn-money-stardew` index links at lines `53` and `93`. The target paired Pine route test passes; this is a stale index baseline, not a Pine route failure.

### 6.4 Static route suite

Command:

```sh
pnpm exec vitest run \
  tests/routes/sitemap-robots.test.ts \
  tests/routes/llms.test.ts \
  tests/routes/static-routes.test.ts \
  tests/routes/static-public-pages.test.ts \
  tests/routes/removed-public-pages.test.ts
```

Exit code `1`:

```text
Test Files  1 failed | 4 passed (5)
Tests       1 failed | 17 passed (18)
```

The only failure is `tests/routes/static-public-pages.test.ts`: its broad legacy blog-card expectation still requires `/blog/how-to-earn-money-stardew-cover.webp` and the old `Sunrise farm ... general store` alt. The Pine EN/ZH static fixtures and generated target artifacts pass.

### 6.5 Full package test

The same-day current final validation recorded the package command below after its pretest build:

```sh
pnpm test
```

Exit code `1`:

```text
Test Files  3 failed | 232 passed (235)
Tests       4 failed | 2160 passed (2164)
```

Failures:

1. two stale EN/ZH blog-index assertions in `tests/routes/blog-routes.test.tsx` for old article links;
2. one stale broad legacy cover assertion in `tests/routes/static-public-pages.test.ts`;
3. one unrelated `tests/resources/local-planner-resource-smoke.test.ts` 5,000 ms timeout.

The package pretest build passed. No failing test was modified in this audit.

### 6.6 Static build and direct `out/` readback

Same-day current validation:

```sh
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Exit code `0`; Next.js `16.3.0` compiled, TypeScript completed, and static generation completed `56/56` pages. The current direct static readback script (no file writes) also exited `0`:

```text
PASS en out/pine-tree-stardew.html bytes=115846 sha256=1018f6b9a9491de7fbbff5db11dbbdd12ccba2ff448c73ee7711439a1354b83a title=1 h1=1 lang=en canonical=1 alternates=3 jsonld=Article cover=1 figures=2
PASS zh-CN out/zh/pine-tree-stardew.html bytes=102791 sha256=c99501cd390497e7d6da154103a6370f97035e8c02a09de51c0b6cfecce767cb title=1 h1=1 lang=zh-CN canonical=1 alternates=3 jsonld=Article cover=1 figures=2
PASS out/llms.txt bytes=14025 sha256=8ada6066a7fcc2245397717300c3ac3c4ba3cb595fcff2548d81532e568d145e target-lines=2
PASS out/sitemap.xml bytes=4107 sha256=031b46e1a6250176021d35baafde766c44c744ccd7379034cc7bd7c84f7f527b loc-count=50 target-locs=2
PASS out/robots.txt bytes=78 sha256=99a0db718d89f47c2f3ba955170fd3a31ab880c25fe81fa37feb15bad3013d0b sitemap-url=present
```

The static HTML assertions confirm for both pages:

- exactly one page H1;
- localized title, description, `lang`, canonical and three alternates (`en`, `zh-CN`, `x-default`);
- exactly one JSON-LD script with `@type=Article`; no `FAQPage`, `BlogPosting`, `QAPage` or `BreadcrumbList` marker;
- one eager cover and two lazy/async body figures, with WebP fallback and AVIF sibling paths;
- both target lines in `out/llms.txt` and both target locations in a 50-entry sitemap.

This is local static artifact evidence only. It is not production or deployment evidence.

## 7. EN/ZH EGo page review and current HTTP boundary

### 7.1 Time-bounded EGo evidence

The following same-day reports were read directly and their target source/module hashes match the current checkout:

- `E-en-page-final-review.md` raw SHA-256 `6b97eccaba9e9908f56af5a00ea5d0d16ea5d20ebc9e4c1024aa09640359e238`;
- `E-zh-page-final-review.md` raw SHA-256 `63195bbb317c0a0702af73c065ccc2152940e596d03015c249264b93a93ae248`.

Their actual local EGo evidence was:

| page | local route/status at review time | viewport evidence | result |
|---|---|---|---|
| EN | `/pine-tree-stardew`, HTTP `200`, `133882` bytes | `1440×900` and `390×844`; cover plus two lazy figures, table containment, navigation, language switch, CTA and source links | **PASS** |
| ZH | `/zh/pine-tree-stardew`, HTTP `200`, `119446` bytes | `1440×900` and `390×844`; Chinese title/body/byline/source/figures, table containment, language switch and localized CTA | **PASS** |

Both reviews independently read title/H1/description, canonical, `en`/`zh-CN`/`x-default` alternates, one Article JSON-LD, no article FAQ/research residue, image natural size `1672×941`, no page-level horizontal overflow, and real EGo language-switch clicks. EN also verified the target latest card and relevant internal/external links; ZH verified the Chinese index and localized navigation.

### 7.2 Shared shell mobile FAIL

EN EGo at `390×844` recorded on both `/pine-tree-stardew` and unrelated `/blog`:

```text
brand link accessible text: Stardew Valley Farm Planner
brand link rect: left=20, top=17.59375, width=26, height=46
child /favicon.png: complete=true, naturalWidth=64, naturalHeight=64
child image rect: left=33, top=26.59375, width=0, height=28
```

The screenshot showed a blank rounded brand pill instead of the expected icon/text. Because `/blog` reproduces the same failure, this is a **shared public-shell/baseline FAIL**, not a Pine article integration FAIL. No shared shell repair was authorized or performed. The target article remains target-specific PASS in both EGo reviews.

### 7.3 Current listener and HTTP readback

`G-runtime-evidence.md` raw SHA-256 is `dca13ee2a0c28b41876fa99eb6620fac5f08fb00bf2da08f5adaa68f4ae8e556`; it records an earlier verified chain `pnpm dev 96016 → next 96054 → listener 96068`, all with the target cwd. The current audit independently rechecked the port instead of treating that historical PID chain as live. At the start of this current audit, the following read-only checks returned no 3003 listener rows:

```sh
lsof -nP -iTCP:3003 -sTCP:LISTEN
# no output
```

The process list contained only unrelated/launcher `pnpm dev` rows and no verified `next-server` listener chain. The direct Node `fetch()` wrapper caught each request error and printed `TypeError: fetch failed` for `/pine-tree-stardew`, `/zh/pine-tree-stardew`, `/blog` and `/zh/blog`; the wrapper itself exited `0`, while all four request results were failed. Therefore:

- historical same-day EGo/browser evidence = **PASS**, time-bounded to the listener/PID/cwd chain recorded in the E reports;
- current listener/HTTP availability at this audit instant = **UNVERIFIED**;
- no listener was started, stopped or deleted by this audit.

## 8. Production/deployment boundary

- No deployment, commit or push was performed by this audit or represented as complete.
- `pnpm seo:smoke` same-day read-only record exited `1` at the production security-header gate: `Expected security header strict-transport-security. Actual value: null.` It did not prove target production routes.
- Handoff integrity fields still intentionally say `page=UNVERIFIED`, `build=NOT_RUN`, `deployment=NOT_RUN`, `userReview=not_started`; those are handoff-era non-claims, not permission to claim production after the local build.
- Local `out/` HTML, local EGo, and a build cannot prove deployment, CDN state, indexing or production availability.

**Deployment status: UNVERIFIED / no deployment claim. User final review: UNVERIFIED / not started.**

## 9. Final acceptance matrix

| area | status | current evidence / boundary |
|---|---|---|
| EN/ZH locked body hash and handoff equality | **PASS** | current Python comparison exit `0`; exact body hashes/bytes above |
| D/E/F content/title gates | **PASS (scoped)** | current bound reports pass; qualified lengths are mechanical only |
| title/H1/description/slug | **PASS** | current registry, handoff and static/browser readback agree |
| topic/author/featured/readTimeMinutes | **PASS** | explicit final values; user-authorized team authors; rationale recorded in current handoffs |
| identity/copy/registry/localized routes | **PASS** | 20 slugs, 40 identity paths, target present in both locales; target tests pass |
| article modules/CTA/source/residue | **PASS** | current SSR probe and target article/source suites pass |
| six local media files | **PASS** | direct existence/hash/format/dimension/decode probe exit `0` |
| target focused Vitest | **PASS** | 5/5 target route/body tests and 3/3 target media tests pass |
| typecheck | **PASS** | no-incremental typecheck exit `0`; same-day package typecheck exit `0` |
| repository build | **PASS** | `pnpm build` exit `0`, `56/56` generation |
| target static HTML/llms/sitemap/robots | **PASS** | current direct readback exit `0`; exact hashes above |
| broader source-focused suite | **FAIL (baseline)** | 2 stale old-link assertions; target Pine assertions pass |
| static route suite | **FAIL (baseline)** | 1 stale legacy cover/alt assertion; target fixtures pass |
| full `pnpm test` | **FAIL (baseline)** | 4 failures in 3 files; no Pine target failure |
| EN local EGo page | **PASS (time-bounded)** | same-day EGo desktop/mobile/local route evidence |
| ZH local EGo page | **PASS (time-bounded)** | same-day EGo desktop/mobile/local route evidence |
| shared mobile public brand pill | **FAIL (out-of-scope baseline)** | empty pill / favicon computed width 0 at 390×844, reproduced on `/blog` |
| current listener/HTTP | **UNVERIFIED** | no current 3003 listener; fetch failed; no listener changed |
| deployment/production/indexing/CDN | **UNVERIFIED** | no deploy; SEO smoke stopped at missing HSTS |
| user final approval | **UNVERIFIED** | handoffs still `userReview=not_started` |

## 10. Verification and write settlement

Read-only commands executed in this Dispatch and their exit codes:

```text
orca orchestration check                         0 (multiple checkpoints, no follow-up)
git status --short --branch --untracked-files=all 0
git diff --check                                 0
registry/route tsx readback                      0
handoff/body/hash Python comparison              0
V7 EN qualified count                             0 (2478)
V7 ZH qualified count                             0 (2491)
current media stat/hash/file/Pillow probe         0
current target Vitest                             0 (5 passed)
current target media Vitest                       0 (3 passed)
current broader source-focused Vitest             1 (2 stale baseline failures)
current static suite                              1 (1 stale baseline failure)
current static out/HTML readback                  0
same-day pnpm typecheck                           0 (R-static-final-verification)
same-day NEXT_TELEMETRY_DISABLED=1 pnpm build     0 (R-static-final-verification; 56/56)
same-day pnpm test                                1 (R-static-final-verification; 4 baseline failures)
same-day pnpm seo:smoke                            1 (missing strict-transport-security)
current HTTP fetch without listener               wrapper exit `0`; 4/4 requests failed with `TypeError: fetch failed` (current HTTP UNVERIFIED)
```

Only this report path was written by this Dispatch:

```text
docs/blog-ops/pine-tree-stardew/R-final-current-audit.md
```

No source, test, media, handoff, registry, config, generated artifact, listener, Git history, deployment or external state was changed.
