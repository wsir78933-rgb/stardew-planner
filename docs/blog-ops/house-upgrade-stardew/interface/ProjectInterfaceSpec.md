# Project interface spec: house-upgrade-stardew

Pre-assembly verification for one future bilingual article. This file does not contain the article, titles, descriptions, figures, or styles. Those stay unconfirmed until a locked handoff arrives. No product source, test, package, or rule file was edited.

Evidence date: 2026-10-15 (Asia/Shanghai). Checkout: `/Users/wusir/orca/workspaces/stardew planner/博客-2`, branch `博客-2`, HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`.

Command logs and the gate table are in `docs/blog-ops/house-upgrade-stardew/interface/baseline/`.

## Narrow future write list

Future page assembly may write only these paths. Anything else is outside this contract and must be reported before it is touched.

Article and registry:

1. `src/blog/articles/house-upgrade-stardew.en.tsx` (new)
2. `src/blog/articles/house-upgrade-stardew.zh.tsx` (new)
3. `src/blog/blog-post-identities.ts` — append the slug once, at the end
4. `src/blog/blog-post-registry.tsx` — import both components and add both locale records at the same index
5. `src/blog/blog-copy.ts` — add the two localized hrefs only

Public copy and media:

6. `public/llms.txt` — one English bullet and one Chinese bullet
7. `public/blog/house-upgrade-stardew-cover.webp`
8. `public/blog/house-upgrade-stardew-cover.avif`
9. `public/blog/illustrations/<locked-figure-stem>.webp` and the same-stem `.avif` for each locked figure
10. `public/blog/video-posters/<locked-poster-stem>.webp` and `.avif` only if a locked poster exists

Focused tests that are green today and fail if the slug is appended without them:

11. `tests/blog/blog-post-registry.test.ts`
12. `tests/blog/blog-home-state.test.ts`
13. `tests/i18n/public-route-registry.test.ts`
14. `tests/seo/canonical-public-routes.test.ts`
15. `tests/routes/removed-public-pages.test.ts`
16. `tests/routes/blog-routes.test.tsx`
17. `tests/blog/house-upgrade-stardew-identity.test.ts` (new; follow `tests/blog/what-to-grow-in-greenhouse-stardew-identity.test.tsx`)

`src/assets` is not on this list. `src/assets/source-manifest.ts` and `src/assets/sync-assets.ts` have no blog paths. Article images are public URL strings, not asset-manifest imports.

## Do not write

These already follow `blogPostSlugs` or are shared UI. Editing them is out of scope:

- `app/(en)/[slug]/page.tsx`
- `app/zh/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `src/i18n/public-route-registry.ts`
- `src/seo/page-metadata.ts`
- `src/seo/page-structured-data.ts`
- `src/seo/public-site-url.ts`
- `src/components/**`
- `app/globals.css`
- `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `AGENTS.md`, `CLAUDE.md`
- `tests/routes/sitemap-robots.test.ts` (count is derived; its extra pathname list is a subset)
- `tests/routes/static-routes.test.ts` (checks a non-exhaustive file list; a new HTML file does not fail it)
- `tests/routes/llms.test.ts` (the loop already demands every indexable URL; the test file does not need a new assertion)

Do not edit the main checkout or `/Users/wusir/Desktop/开发项目集合/stardew planner-worktrees/博客`. Do not edit `docs/blog-ops/house-upgrade-stardew/research/` or `control/`.

## Out of scope, already failing

Reported only. Not fixed.

- `public/llms.txt` has no English or Chinese `stardew-fruit` URL, while the slug is already registered. `tests/routes/llms.test.ts` fails on `](https://stardewvalleyplanner.art/stardew-fruit)` before it can accept a new house-upgrade line. A correct house-upgrade bullet does not turn that test green.
- `tests/assets/public-avif-assets.test.ts` expects 81 WebP files and the tree has 102. New article WebP files increase 102; they do not repair 81.
- Pine identity, article-content, and sources tests disagree with the current Pine Chinese phrase and English checked label.
- `tests/routes/static-public-pages.test.ts` expects a `how-to-earn-money-stardew` cover on `/blog`. That cover is not in the latest 6 or carousel page 1. The same file also fails a homepage section-order assertion and a 404 CSS path assertion on the webpack export.

## Route, metadata, sitemap

Current registry length is 25 slugs. Counts below are the current values, then the value after one appended slug.

| Surface | Current | After one appended slug |
|---|---:|---:|
| `canonicalPublicPaths` | 31 | 32 |
| localized route entries | 62 | 64 |
| indexable route entries | 60 | 62 |
| sitemap `<loc>` | 60 | 62 |

Fixed public paths are `/`, `/privacy`, `/terms`, `/contact`. Blog index paths are `/blog` and `/blog/archive`. Each slug adds `/${slug}`. Contact is the only noindex path. Locales are `en` and `zh-CN`. Chinese path prefix is `/zh`, not `/zh-CN`.

Future public URLs, with no trailing slash:

- English: `https://stardewvalleyplanner.art/house-upgrade-stardew`
- Chinese: `https://stardewvalleyplanner.art/zh/house-upgrade-stardew`
- Static files from `output: "export"` and no `trailingSlash`: `out/house-upgrade-stardew.html` and `out/zh/house-upgrade-stardew.html`

Identity strings are different and keep the trailing slash: `/house-upgrade-stardew/` and `/zh/house-upgrade-stardew/`. `createCanonicalUrl` rejects a non-root trailing slash.

Both article routes already exist as dynamic pages:

- `app/(en)/[slug]/page.tsx`, locale `en`
- `app/zh/[slug]/page.tsx`, locale `zh-CN`

Each exports `generateStaticParams()` from `blogPostSlugs` and `dynamicParams = false`. `params` is awaited. Unknown slugs call `notFound()`. Metadata uses `createPublicPageMetadata` with `openGraphType: "article"`, `socialImagePath: post.coverImage.src`, and `robots: { index: true, follow: true }`.

`createPublicLanguageAlternates` emits `en`, `zh-CN`, and `x-default`. `x-default` is the English URL. Next writes those keys as `hreflang`.

`app/sitemap.ts` maps `getLocalizedIndexablePublicRouteEntries()` through `createCanonicalUrl`. No `lastmod`. `app/robots.ts` allows `/` and points at `https://stardewvalleyplanner.art/sitemap.xml`.

Article JSON-LD is `createArticleStructuredData`. The English page passes pathname `/${slug}`. The Chinese page passes `getLocalizedPublicPath`. Neither page passes `imagePathname`, so the Article object has no `image` field. Open Graph and Twitter images are the absolute cover URL.

`public/llms.txt` is hand-copied into `out/llms.txt` by the static export. `tests/routes/llms.test.ts` reads `out/llms.txt` and requires `](${canonicalUrl})` for every indexable route. New bullets must use the locked title and description; this spec does not invent them.

## Registry contract

Append `"house-upgrade-stardew"` as the last `blogPostSlugs` entry. `validateBlogPostRegistry` requires both `en` and `zh-CN` arrays to follow that exact order, with no missing or duplicate slug.

Each record needs non-empty `title`, `description`, `topic`, and `author`; integer `readTimeMinutes` greater than 0; `coverImage.src`; `coverImage.alt` of at least 8 characters; boolean `featured`; and a function `Content`.

Observed constants on every current post:

- English author `Stardew Valley Planner Team`, topic `Stardew Valley Guides`
- Chinese author `星露谷规划器团队`, topic `星露谷物语指南`
- `featured` is not implied by order. English `stardew-fruit` is `false` and Chinese `stardew-fruit` is `true`. `how-to-harvest-stardew-valley` is `false` in both. The locked handoff must choose the two booleans. The registry test hardcodes both arrays.

`blog-copy.ts` `localizedBlogPostPaths` is `Record<BlogPostSlug, string>` for each locale. Missing keys fail `pnpm typecheck`. Href values are `/house-upgrade-stardew` and `/zh/house-upgrade-stardew`. Do not change the shared `BlogCopy` strings.

Homepage order is the registry reversed. Latest visible count is 6. Topic carousel page size is 12 and uses canonical order, not reversed order. One slug appended at the end changes the latest 6 from:

`how-to-harvest-stardew-valley`, `oak-tree-vs-maple-stardew`, `stardew-fruit`, `what-to-grow-in-greenhouse-stardew`, `profit-margin-stardew`, `pine-tree-stardew`

to:

`house-upgrade-stardew`, `how-to-harvest-stardew-valley`, `oak-tree-vs-maple-stardew`, `stardew-fruit`, `what-to-grow-in-greenhouse-stardew`, `profit-margin-stardew`

`pine-tree-stardew` leaves the index. Carousel page 3 changes from only the harvest slug to the harvest slug plus `house-upgrade-stardew`. Page count stays 3. `totalPostCount` changes from 25 to 26. Archive page size is 9; page count stays 3. Spotlight cards stay the first two canonical posts.

## Body template

The page shell renders one `h1` from `post.title`. The article component must not render `h1`. Current articles export a function that returns `<article>` and use `h2` and `h3`. `TableOfContents` is a client component: it reads `h2, h3` inside `#blog-article-${slug}` after hydration and assigns anchors there. Static HTML does not need those ids.

`BlogSources` is the footer contract. Its `heading` must be exactly `Sources`, `来源`, or `资料来源`. The component renders `BlogPlannerCta` and then `<section class="blog-sources">`. `tests/blog/blog-planner-cta.test.tsx` walks every registered post and requires exactly one CTA, with the sources section after it. If a `blog-faq-list` exists, the CTA must follow it. Put `BlogFaqList` before `BlogSources` when a FAQ is locked. Do not mount a second `BlogPlannerCta`.

In-article figures use `figure.blog-article-media` and `PublicPicture`. Existing classes in `app/globals.css` already cover that figure, scrollable tables (`.blog-table-scroll`), and the header cover. Do not add CSS.

`PublicPicture` requires a `src` ending in `.webp` and emits a sibling `.avif` source. A missing or empty AVIF fails `createPublicAvifSource` or `tests/assets/public-avif-assets.test.ts` once that length assertion is updated. The component is not `next/image`. `next.config.ts` sets `images.unoptimized: true`. Static export docs reject the default image optimizer.

## Images and LCP

Header cover, rendered by `BlogArticleContent`, is the article LCP candidate:

- `PublicPicture` with `post.coverImage.src`
- attributes `width={1672}` and `height={941}`
- no `loading` attribute, so the browser default is eager
- no `fetchPriority` prop exists on `PublicPicture`
- CSS `[data-blog-article] > header > .public-picture img` sets `width: 100%`, `object-fit: cover`, and `aspect-ratio: 16 / 9`
- an earlier rule also sets `height: 100%` on the same selector

Cards use the same 1672×941 attributes with `loading="lazy"`. In-article figures in current articles use 1672×941, `decoding="async"`, and `loading="lazy"`. The CTA image is separate: `/homepage/cases/farm-case-01.webp`, 1280×1040, `loading="lazy"`.

`tests/assets/blog-cover-images.test.ts` checks a listed subset, not every current cover. Its cover byte ceiling is 1.25 MiB and its VP8 reader rejects a non-VP8 payload. Per-article figure ceilings in that file are 400 KiB. A new identity test should assert the locked files exist, are WebP plus AVIF, and match the dimensions the components hardcode. This round did not invent figure stems.

## Next.js notes read locally

Guides under `node_modules/next/dist/docs` at Next 16.3.0:

- App Router pages are Server Components by default. `generateStaticParams` replaces `getStaticPaths`.
- Dynamic `params` is a Promise and is awaited in both slug pages.
- `dynamicParams = false` returns 404 for slugs outside `generateStaticParams`.
- Static export requires `generateStaticParams` and rejects `dynamicParams: true`. Without `trailingSlash`, the HTML file is `out/<slug>.html`.
- `public/blog/name.webp` is served as `/blog/name.webp`.
- `generateMetadata` is a Server Component API and can set title, description, canonical, languages, Open Graph, and robots.
- `node_modules/next/dist/server/lib/generate-agent-files.js` rewrites `AGENTS.md` and `CLAUDE.md` from dev. Do not run `next dev` while those files must stay untouched.

## Baseline gates

| Gate | Exit | Meaning for the next G pass |
|---|---:|---|
| `pnpm typecheck` | 0 | Must stay 0 |
| `pnpm build` | 1 | Turbopack rejects the external `node_modules` symlink. Not a product failure |
| `pnpm exec next build --webpack` | 0 | Usable static export under the current symlink grant |
| blog interface Vitest | 1 | 8 failed, 237 passed, 245 tests. Historical failures stay historical |

Do not run `pnpm test`. `pretest` builds again.

## Environment

One `node_modules` symlink points at the main project. Lockfile sha256 matches. No install. Details, port inventory, and the two dirty trees that must stay untouched are in `baseline/environment.txt`.

`scripts/dev.sh` kills listeners on port 3003. PID 34931 is `next-server` for the other 博客 worktree on that port. This task did not start a server and did not signal any process.

## Instructions for later E

E reviews the assembled pages. This G pass did not open a browser and did not judge content.

1. Read `/Users/wusir/.mirasim/skills/ego-browser/SKILL.md` and use `ego-browser nodejs`. One `taskSpace` for the review. Use page `p1`.
2. Do not run `pnpm dev` or `scripts/dev.sh` in this worktree. That script frees port 3003 with TERM and then KILL. Confirm the port with `lsof -nP -iTCP:3003 -sTCP:LISTEN` first.
3. Serve this worktree only. After `pnpm exec next build --webpack`, run `pnpm exec serve out -l <free-port>` on a port `lsof` shows as unused. Alternatively run `pnpm exec next dev --webpack --port <free-port>` without `free-listen-port.sh`.
4. Open `http://127.0.0.1:<port>/house-upgrade-stardew` and `http://127.0.0.1:<port>/zh/house-upgrade-stardew`. Reuse `p1` with `goto`. Print `page.info()` and a snapshot. Use a screenshot for figure readability.
5. The skill has no viewport method. Set size with `page.cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile })`, then confirm with `page.info()`. Prior local article checks in this repo used 1280×800 and 390×844.
6. Check one `h1`, canonical, `hreflang` `en` / `zh-CN` / `x-default`, the language-switch href, eager cover versus lazy figures, and that AVIF plus WebP requests succeed. Heading anchors appear after hydration because the TOC is a client effect.
7. Do not use `https://stardewvalleyplanner.art` as the acceptance server. Close with `task.finish({ keep: [] })` when the review is done.

## This round stopped before assembly

No article module, registry entry, copy href, llms bullet, media file, or product test was added for `house-upgrade-stardew`.
