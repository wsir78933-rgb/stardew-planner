# R-STATIC-FINAL-RETRY: `pine-tree-stardew`

**Run date:** 2026-09-23 (Asia/Shanghai)

**Mode:** read-only final validation after the Pine Tree metadata, registry, source, test, and media assembly. This run wrote only this report. It did not edit source, tests, public assets, handoffs, registry, package files, lockfiles, or instructions; no browser, deploy, commit, push, or external write was performed.

## Executive result

**Target-specific static validation: PASS. Repository aggregate: NOT GREEN.** `pnpm typecheck`, the target-specific article/route/media probes, `NEXT_TELEMETRY_DISABLED=1 pnpm build`, and direct `out/` readback all pass for the English and Simplified Chinese `pine-tree-stardew` page pair. The exact broader suites still expose unrelated stale assertions for `how-to-earn-money-stardew`, and the full package test also has one unrelated local planner resource-smoke timeout; these were reported without repair.

The local build is evidence of generated static artifacts only. It does not prove browser behavior, deployment, CDN state, production target availability, indexing, or global test green. `pnpm seo:smoke` was run read-only and failed at the production security-header contract before target route coverage.

## 1. Runtime and worktree boundary

**Observed runtime:**

```text
node v24.18.0
pnpm 10.22.0
Next.js 16.3.0
```

The package declares Node `>=20.9.0` and `pnpm@10.22.0`.

The pre-validation `git status --short` already contained the Pine assembly changes and other dirty files. The post-validation `git status --short` and `git diff --name-only` showed the same pre-existing tracked paths; `.next/` and `out/` are ignored. No source/test/asset/handoff/registry path was added or changed by this validation run. The only repository write from this run is:

```text
docs/blog-ops/pine-tree-stardew/R-static-final-verification.md
```

## 2. Typecheck and source-level focused checks

### 2.1 Typecheck

**Command:**

```sh
pnpm typecheck
```

**Exit code:** `0`

**Observed:** `tsc --noEmit` completed without diagnostics.

### 2.2 Exact ProjectInterfaceSpec source-focused command

**Command:**

```sh
pnpm exec vitest run \
  tests/blog/pine-tree-stardew-identity.test.ts \
  tests/blog/blog-post-registry.test.ts \
  tests/blog/blog-home-state.test.ts \
  tests/blog/blog-direct-reader-voice.test.tsx \
  tests/blog/blog-sources.test.tsx \
  tests/blog/blog-faq-list.test.tsx \
  tests/blog/blog-planner-cta.test.tsx \
  tests/blog/blog-article-content.test.tsx \
  tests/assets/blog-cover-images.test.ts \
  tests/assets/public-avif-assets.test.ts \
  tests/i18n/public-route-registry.test.ts \
  tests/seo/canonical-public-routes.test.ts \
  tests/routes/blog-routes.test.tsx \
  tests/routes/public-route-metadata.test.ts
```

**Exit code:** `1`

```text
Test Files  1 failed | 13 passed (14)
Tests       2 failed | 105 passed (107)
```

Both failures are in `tests/routes/blog-routes.test.tsx` and expect the old index markup to contain:

```text
href="/how-to-earn-money-stardew"
href="/zh/how-to-earn-money-stardew"
```

The rendered current blog indexes do not contain those links in the asserted listing. The same file's target test, `renders the paired Pine Tree article routes with locked metadata and one page-level heading`, passed. No assertion or source was repaired.

### 2.3 Target-only route/article probe

**Command:**

```sh
pnpm exec vitest run \
  tests/blog/pine-tree-stardew-identity.test.ts \
  tests/blog/blog-article-content.test.tsx \
  tests/routes/blog-routes.test.tsx \
  -t 'Pine Tree|new paired article routes|sourced English and Chinese Pine Tree|registers the shared Pine Tree|exposes the locked'
```

**Exit code:** `0`

```text
Test Files  3 passed (3)
Tests       5 passed | 22 skipped (27)
```

This proves the target identity, locked EN/ZH article angle, target body contract, and paired dynamic route rendering under the current source. It is not a claim that the stale broader index assertions are fixed.

### 2.4 Target media/AVIF probe

**Command:**

```sh
pnpm exec vitest run \
  tests/assets/blog-cover-images.test.ts \
  tests/assets/public-avif-assets.test.ts \
  -t 'Pine Tree guide|AVIF derivatives'
```

**Exit code:** `0`

```text
Test Files  2 passed (2)
Tests       3 passed | 11 skipped (14)
```

The target cover and two in-body WebPs are VP8 WebP, `1672x941`, and each has a non-empty same-stem AVIF sibling. The target WebP/AVIF byte sizes observed in `public/` are:

| Asset | WebP | AVIF |
|---|---:|---:|
| `pine-tree-stardew-cover` | 32,094 | 19,430 |
| `pine-tree-seed-to-tar` | 23,214 | 17,100 |
| `pine-tree-stage-four-neighbor` | 20,746 | 15,994 |

## 3. Build and exact static-export suite

### 3.1 Static build

**Command:**

```sh
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

**Exit code:** `0`

**Observed:** compile passed, TypeScript passed, and static page generation completed `56/56`. The route table contains the shared root and `/zh/[slug]` SSG route families; the target-specific generated files were confirmed separately below.

### 3.2 Exact ProjectInterfaceSpec static checks

**Command:**

```sh
pnpm exec vitest run \
  tests/routes/sitemap-robots.test.ts \
  tests/routes/llms.test.ts \
  tests/routes/static-routes.test.ts \
  tests/routes/static-public-pages.test.ts \
  tests/routes/removed-public-pages.test.ts
```

**Exit code:** `1`

```text
Test Files  1 failed | 4 passed (5)
Tests       1 failed | 17 passed (18)
```

The only failure is `tests/routes/static-public-pages.test.ts` and is an old blog-index fixture requiring `/blog/how-to-earn-money-stardew-cover.webp` with the old `Sunrise farm ... general store` alt text. The same static run passed sitemap/robots, `llms.txt`, static route enumeration, and removed-page checks. No test fixture was changed.

## 4. Generated `out/` readback

**Readback command:** an inline `python3` assertion probe read the generated HTML, text, sitemap, and robots artifacts without writing files. It asserted both target HTML files, one H1 per page, localized canonical and alternates, one `Article` JSON-LD object, no `BlogPosting`/`FAQPage`/`QAPage`, cover eager behavior, two lazy AVIF-backed figures, exact bilingual `llms.txt` lines, 50 sitemap `<loc>` values with both target URLs, no contact/query sitemap locations, and the absolute robots sitemap URL.

**Exit code:** `0`

```text
PASS out/pine-tree-stardew.html bytes=115846 sha256=1018f6b9a9491de7fbbff5db11dbbdd12ccba2ff448c73ee7711439a1354b83a h1=1 cover=1 figures=2 article-jsonld=1
PASS out/zh/pine-tree-stardew.html bytes=102791 sha256=c99501cd390497e7d6da154103a6370f97035e8c02a09de51c0b6cfecce767cb h1=1 cover=1 figures=2 article-jsonld=1
PASS out/llms.txt bytes=14025 sha256=8ada6066a7fcc2245397717300c3ac3c4ba3cb595fcff2548d81532e568d145e target-lines=2
PASS out/sitemap.xml bytes=4107 sha256=031b46e1a6250176021d35baafde766c44c744ccd7379034cc7bd7c84f7f527b loc-count=50 target-locs=2
PASS out/robots.txt bytes=78 sha256=99a0db718d89f47c2f3ba955170fd3a31ab880c25fe81fa37feb15bad3013d0b
PASS generated target artifact set: 4 files present (2 HTML + 2 text)
```

The generated target media set under `out/blog/` also contains the cover plus both WebP/AVIF figure pairs. The target HTML readback confirms:

- English `lang="en"`, Chinese `lang="zh-CN"`;
- canonical URLs `/pine-tree-stardew` and `/zh/pine-tree-stardew` without trailing slash;
- `en`, `zh-CN`, and `x-default` alternates bound to the paired URLs;
- one page-level H1 and one `Article` JSON-LD object per page;
- one non-lazy `1672x941` cover and two `1672x941` lazy/async in-body figures per page;
- exact target English/Chinese `llms.txt` lines and both target sitemap locations;
- robots points to `https://stardewvalleyplanner.art/sitemap.xml`.

Local static output is not production or browser evidence.

## 5. Full package script and fixed-baseline checks

### 5.1 Full package test script

**Command:**

```sh
pnpm test
```

This invoked the package `pretest` build first; the build passed. The Vitest run then exited `1`:

```text
Test Files  3 failed | 232 passed (235)
Tests       4 failed | 2160 passed (2164)
```

The four failures were:

1. `tests/routes/blog-routes.test.tsx` English index assertion for `/how-to-earn-money-stardew`;
2. `tests/routes/blog-routes.test.tsx` Chinese index assertion for `/zh/how-to-earn-money-stardew`;
3. `tests/routes/static-public-pages.test.ts` old `how-to-earn-money-stardew` cover/alt assertion;
4. `tests/resources/local-planner-resource-smoke.test.ts` map/season matrix timeout at the existing `5000ms` test timeout.

The Pine-specific identity, body, media, registry, route, metadata, sitemap, and static artifact checks passed in the same run. These failures were not repaired.

### 5.2 Fixed baseline contract checks

**Command:**

```sh
pnpm exec vitest run \
  tests/scripts/production-seo-smoke.test.mjs \
  tests/routes/removed-public-pages.test.ts
```

**Exit code:** `0`

```text
Test Files  2 passed (2)
Tests       65 passed (65)
```

### 5.3 Production SEO smoke limitation

**Command:**

```sh
pnpm seo:smoke
```

**Exit code:** `1`

The read-only HTTPS smoke stopped at the production origin because the response lacked the required `strict-transport-security` header:

```text
Expected security header strict-transport-security. Actual value: null.
```

The source contract is also an older fixed 16-canonical / 32-public-HTML / 30-sitemap subset, as documented in the ProjectInterfaceSpec. This command therefore supplies no target production route proof and is not reported as target coverage.

## 6. Final settlement

- **Target source/typecheck:** PASS.
- **Target article/route/media focused probes:** PASS.
- **Local build:** PASS.
- **Target `out/` HTML, `llms.txt`, sitemap, robots readback:** PASS.
- **Exact static suite:** PARTIAL; one unrelated stale `how-to-earn-money` fixture fails.
- **Full `pnpm test`:** FAIL; the same three stale/index failures plus one unrelated resource-smoke timeout.
- **Production/live state:** UNVERIFIED; `pnpm seo:smoke` failed its security-header gate, and no browser/deploy/live target assertion was performed.

No global-green, browser, deployment, indexing, CDN, or production-target claim is made. No source/test/asset/registry/handoff repair was performed.
