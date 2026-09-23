# E-page browser review v2 — `profit-margin-stardew`

- Review time: **2026-09-23 20:32 CST (Asia/Shanghai, UTC+08:00)**
- Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客`
- Branch / inspected HEAD: `博客` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c`
- Scope: local, read-only page acceptance for English and Simplified Chinese routes. This report is the only file created by this review.
- Browser: local **EGo Browser / Ego Lite**, TaskSpace `42`; no Codex built-in browser and no production-site navigation were used.
- Overall matrix (8 contracts × 2 locales): **PASS 8 / FAIL 6 / UNVERIFIED 2**.

## Server identity and local-origin evidence

Port `3003` was not reused or touched. Initial readback showed PID `44913` listening there with cwd `/Users/wusir/Desktop/开发项目集合/stardew planner`, which is a different checkout. After coordinator authorization, this review started the target checkout with:

```sh
pnpm exec next dev --port 3013
```

Observed server evidence:

- origin: `http://localhost:3013`
- listener: PID `55218`, `next-server (v16.3.0)`, TCP `*:3013`
- listener cwd from `lsof -a -p 55218 -d cwd -Fn`: `/Users/wusir/orca/workspaces/stardew planner/博客`
- startup output: `Next.js 16.3.0 (Turbopack)`, `Ready in 307ms`
- EGo `page.fetch()` returned `200`, `ok: true` for both target URLs.

Only the review-owned port `3013` process was stopped at the end. The pre-existing `3003` listener was not killed or replaced.

## Browser evidence inventory

EGo used desktop `1512×982` and mobile `390×844` device metrics. Browser artifacts created outside the repository:

- `/tmp/profit-margin-en-desktop.png`
- `/tmp/profit-margin-zh-desktop.png`
- `/tmp/profit-margin-en-mobile.png`
- `/tmp/profit-margin-zh-mobile.png`
- `/tmp/profit-margin-mobile-evidence.txt`
- `/tmp/profit-margin-final-browser-evidence.txt`

The EGo CLI reported an available update (`current 0.5.1.11`); it was **not** installed because upgrades were not authorized.

## Acceptance matrix

| # | Contract | EN | zh-CN | Browser result and evidence |
|---:|---|---|---|---|
| 1 | Local access, HTTP 200, `document.lang` | **PASS** | **PASS** | `page.fetch()` returned 200 for `/profit-margin-stardew` and `/zh/profit-margin-stardew`; DOM returned `lang=en` and `lang=zh-CN`. |
| 2 | Locked title/description; one visible H1 equal to locked title; no body H1 | **PASS** | **PASS** | EN title/H1: `Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change`; EN description exactly matched F/handoff. ZH title/H1: `Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选`; ZH description exactly matched F/handoff. Each DOM contained exactly one visible `h1`; article headings continued at H2/H3. |
| 3 | Article-only JSON-LD with required actual fields; no FAQPage | **FAIL** | **FAIL** | Each page emitted exactly one `Article` and no `FAQPage`, with correct `headline`, `description`, `url`, `inLanguage`, and `isPartOf`. However, both schemas omitted the task-required `datePublished`, `author`, and `image` fields. |
| 4 | Reader body, prose/list/table/CTA/Sources; no internal handoff markers | **PASS** | **PASS** | Real localized prose, lists, three tables, planner CTA, article internal link, visible `Sources`, and Wiki source links were read from the browser DOM. Scans were false for `PublicBlogHandoff`, `sourceDraftHash`, `bodyHash`, `fig-01`, `fig-02`, `G0`, and `G2`. |
| 5 | Cover + two body images; resources; loading priority; alt/caption | **FAIL** | **FAIL** | All six WebP/AVIF URLs returned 200 with correct `image/webp` or `image/avif` content type. Cover selected AVIF, was complete at 1672×941, had locked non-empty alt, and was not lazy (`loading=auto`), but `fetchPriority=auto`, not high. Both body images had `loading=lazy` and locked alt/caption. ZH loaded both after scrolling. In the final EN desktop run, the price-boundary lazy image remained `complete=false`, `naturalWidth=0`, `currentSrc=""` while the advanced-options image loaded; therefore actual display of all three EN images is not accepted despite direct resource 200. |
| 6 | canonical/hreflang/OG/Twitter URL and locale; EN/ZH route pairing | **FAIL** | **FAIL** | Canonical, `en`/`zh-CN`/`x-default` hreflang, OG URL/type/image, Twitter card/title/description/image, and visible language-switch links matched the paired public routes. Both pages lacked `meta[property="og:locale"]` (`null`), so the requested locale contract is incomplete. Canonical/OG URLs intentionally used the configured public origin; this local review does not claim those production URLs are deployed. |
| 7 | Mobile tables/no horizontal overflow; keyboard focus; clickable CTA/internal link; alt/headings | **PASS** | **PASS** | At 390×844, `documentElement.scrollWidth=390` and `body.scrollWidth=390`. All three article tables fit within the 356px content width (`right=373`, viewport 390) without page overflow. Real Tab presses reached links including planner/source/footer links. Real EGo clicks navigated CTA to `/#planner` and `/zh#planner`, and article links to `/how-to-earn-money-stardew` and `/zh/how-to-earn-money-stardew`. Article image alts were non-empty; heading sequence was H1→H2/H3. |
| 8 | Deployment/CDN/index/production claims | **UNVERIFIED** | **UNVERIFIED** | Outside task scope. No deployment, CDN, search-index, production HTTP, or live SEO conclusion is made. |

## Per-URL and viewport readback

### English — `http://localhost:3013/profit-margin-stardew`

**Desktop 1512×982**

- HTTP/page: 200 via browser fetch; URL remained the local target route.
- Metadata/H1: exact locked title and description; one H1 equal to title.
- Schema: one `Article`; no FAQPage; missing `datePublished`, `author`, `image` (**FAIL reproduction below**).
- Media: cover loaded as local AVIF, 1672×941. Advanced-options figure loaded after browser scroll. Price-boundary figure did not complete in the final desktop scroll run, although both its WebP and AVIF requests independently returned 200.
- Content: complete reader-facing article, tables, CTA, Sources, Wiki links, no internal handoff/hash/figure tokens.
- Screenshot: `/tmp/profit-margin-en-desktop.png`.

**Mobile 390×844**

- No page-level horizontal scroll (`390 == 390`); all three tables stayed within the content box.
- CTA and internal links existed as focusable anchors; Tab traversal produced real focused-link evidence.
- Full-page screenshot: `/tmp/profit-margin-en-mobile.png`.

### Simplified Chinese — `http://localhost:3013/zh/profit-margin-stardew`

**Desktop 1512×982**

- HTTP/page: 200 via browser fetch; `lang=zh-CN`.
- Metadata/H1: exact locked title and description; one H1 equal to title.
- Schema: one `Article`; no FAQPage; missing `datePublished`, `author`, `image` (**FAIL reproduction below**).
- Media: cover and both figures loaded as local AVIF after scrolling, each 1672×941; body figures were lazy. Locked Chinese alt/captions were present.
- Content: complete reader-facing Chinese article, lists/tables/CTA/Sources, four expected source targets, no internal handoff/hash/figure tokens.
- Screenshot: `/tmp/profit-margin-zh-desktop.png`.

**Mobile 390×844**

- No page-level horizontal scroll (`390 == 390`); all three tables stayed within the content box.
- Real CTA click reached `http://localhost:3013/zh#planner`; real article-link click reached `http://localhost:3013/zh/how-to-earn-money-stardew`.
- Full-page screenshot: `/tmp/profit-margin-zh-mobile.png`.

## Resource response evidence

The following browser-origin requests each returned `200`:

| Resource | WebP | AVIF |
|---|---:|---:|
| `/blog/profit-margin-stardew-cover` | 59,669 bytes, `image/webp` | 10,775 bytes, `image/avif` |
| `/blog/illustrations/profit-margin-stardew-price-boundary` | 58,347 bytes, `image/webp` | 15,131 bytes, `image/avif` |
| `/blog/illustrations/profit-margin-stardew-advanced-options` | 44,151 bytes, `image/webp` | 11,662 bytes, `image/avif` |

Chromium selected AVIF through each `<picture>` when the image loaded. The native fallback `img src` values were the corresponding WebP paths; no `srcset` attribute was present on the `img` elements because format selection came from `<source>`.

## Failure reproduction

### A. JSON-LD required fields missing — EN and zh-CN

1. Start this checkout locally on an unoccupied port.
2. Open either target route in EGo Browser.
3. Read and parse `script[type="application/ld+json"]`.
4. Observe one `Article`, but no `datePublished`, `author`, or `image` keys.

Observed EN keys: `@context`, `@type`, `headline`, `description`, `url`, `inLanguage`, `isPartOf`. ZH had the same key set.

### B. Open Graph locale missing — EN and zh-CN

1. Open either local target route.
2. Evaluate `document.querySelector('meta[property="og:locale"]')?.content ?? null`.
3. Observed result: `null` on both pages.

### C. Cover is eager but not high priority — EN and zh-CN

1. Read the article cover `img.loading` and `img.fetchPriority`.
2. Observed `loading="auto"` and `fetchPriority="auto"` on both pages.
3. This proves the cover is not lazy, but does not satisfy the explicit high-priority requirement.

### D. EN price-boundary figure did not display in final browser scroll

1. Open `/profit-margin-stardew` in the desktop EGo viewport.
2. Scroll the `img[src*="profit-margin-stardew-price-boundary"]` element into view and wait 700ms.
3. Read the image state: `loading="lazy"`, `complete=false`, `naturalWidth=0`, `naturalHeight=0`, `currentSrc=""`.
4. Control evidence: the next advanced-options figure loaded as AVIF at 1672×941, and direct browser requests for both price-boundary formats returned 200. No source fix was attempted.

## Boundary from G2 build/test evidence

This E-page review did **not** rerun typecheck, Vitest, or build; doing so was unnecessary for the browser-only task and could write generated/incremental artifacts. The following are prior G2 results, not new E-page results:

- `pnpm typecheck`: exit 0.
- Focused Vitest: exit 1; 11 files passed / 1 failed, 90 tests passed / 2 failed. G2 classifies the two failures in existing blog-index expectations as unrelated baseline failures.
- `NEXT_TELEMETRY_DISABLED=1 pnpm build`: exit 0; static generation 56/56.
- Static/export Vitest: exit 1; 4 files passed / 1 failed, 17 tests passed / 1 failed. G2 classifies the existing `/blog` collection expectation as unrelated baseline.

Those source/static results do not override the browser FAIL items above. Conversely, local browser evidence does not prove deployment, CDN behavior, production HTTP, indexing, or search-engine eligibility.
