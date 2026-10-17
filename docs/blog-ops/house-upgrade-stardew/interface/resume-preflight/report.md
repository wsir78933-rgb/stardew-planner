# Resume preflight: house-upgrade-stardew

Role G interface check for a future bilingual assembly. This file does not assemble the article, and it does not record a new typecheck, build, lint, or test PASS.

Checked at 2026-10-16 07:35:53 +0800. Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客-2`. Branch `博客-2`. HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`, the same commit as `interface/ProjectInterfaceSpec.md` (2026-10-15).

`git status --short --branch` printed only:

- `?? docs/blog-ops/house-upgrade-stardew/`
- `?? node_modules`

No product source, test, package, or rule file was edited. Command evidence is in `checks.log` beside this file.

The 2026-10-15 interface contract still matches the current route, metadata, registry, picture, and CSS code. The deltas are the listener on port 3003, the measured candidate rasters, the current draft hash, and the exact test assertions that a later append must change.

## Versions and symlink

`node_modules` is a symlink to `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`. `ls -ld` on that target exited 0; it is a directory.

| Check | Result | Exit |
|---|---|---:|
| `node -v` | v24.18.0 | 0 |
| `pnpm -v` | 10.22.0 | 0 |
| `node_modules/next` | 16.3.0 | 0 |
| `node_modules/react` and `react-dom` | 19.2.8 | 0 |
| `node_modules/typescript` | 5.9.3 | 0 |
| `node_modules/vitest` | 3.2.4 | 0 |
| `node_modules/serve` | 14.2.6 | 0 |
| `node_modules/.bin/serve` executable | present | 0 |
| `pnpm exec serve --help` | documents `-l` / `--listen` and `--no-port-switching` | 0 |

`package.json` agrees: `engines.node` is `>=20.9.0`, `packageManager` is `pnpm@10.22.0`, `next` is `16.3.0`, `serve` is `14.2.6`. Scripts: `dev` is `sh scripts/dev.sh`, `build` is `next build`, `start` is `serve out`, `pretest` is `pnpm build`, `typecheck` is `tsc --noEmit`.

`next.config.ts` sets `output: "export"` and `images: { unoptimized: true }`. It does not set `trailingSlash`.

`AGENTS.md` still says this Next version differs from training data and points at `node_modules/next/dist/docs/`. The notes below were read from that tree at Next 16.3.0:

- `01-app/03-api-reference/04-functions/generate-static-params.md`: `params` is a Promise and is awaited.
- `01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`: `false` returns 404 for a segment that `generateStaticParams` did not emit. `true` is the default and generates at request time.
- `01-app/02-guides/static-exports.md`: static export rejects `dynamicParams: true`, a dynamic route without `generateStaticParams()`, and Image Optimization with the default loader. With `trailingSlash` left false, the example output is `out/blog/post-1.html`.
- `01-app/03-api-reference/03-file-conventions/public-folder.md`: `public/avatars/me.png` is served as `/avatars/me.png`.
- `01-app/03-api-reference/04-functions/generate-metadata.md`: `alternates.languages` keys are written as `hreflang`.

`node_modules/next/dist/server/lib/generate-agent-files.js` rewrites `AGENTS.md` and `CLAUDE.md` from `next dev`. A later assembly must not run `next dev` or `scripts/dev.sh`.

## Slug is unregistered

`house-upgrade-stardew` is absent from `src/`, `public/`, and `tests/`. These paths are absent:

- `src/blog/articles/house-upgrade-stardew.en.tsx`
- `src/blog/articles/house-upgrade-stardew.zh.tsx`
- `public/blog/house-upgrade-stardew-cover.webp` and `.avif`
- `public/blog/house-upgrade-stardew-cover-zh.webp` and `.avif`
- `public/blog/illustrations/house-upgrade-stardew/`
- `out/house-upgrade-stardew.html`

`src/blog/blog-post-identities.ts` has 25 slugs. The last entry is `how-to-harvest-stardew-valley`. `public/llms.txt` has no `house-upgrade-stardew` line and no `stardew-fruit` line.

## Routes, title, and H1

The dynamic pages already exist and already follow `blogPostSlugs`:

- `app/(en)/[slug]/page.tsx`, locale `en`
- `app/zh/[slug]/page.tsx`, locale `zh-CN`

Each exports `generateStaticParams()` from `blogPostSlugs`, sets `dynamicParams = false`, awaits `params`, and calls `notFound()` for an unknown slug. Do not edit either page.

Future public URLs, with no trailing slash:

- English: `https://stardewvalleyplanner.art/house-upgrade-stardew`
- Chinese: `https://stardewvalleyplanner.art/zh/house-upgrade-stardew`
- Static files: `out/house-upgrade-stardew.html` and `out/zh/house-upgrade-stardew.html`

Identity strings keep the trailing slash: `/house-upgrade-stardew/` and `/zh/house-upgrade-stardew/`. `createCanonicalUrl` in `src/seo/public-site-url.ts` throws when a non-root pathname ends with `/`.

`blog-copy.ts` `localizedBlogPostPaths` is `Record<BlogPostSlug, string>` per locale. The future hrefs are `/house-upgrade-stardew` and `/zh/house-upgrade-stardew`. A missing key fails `pnpm typecheck`. Do not change the shared `BlogCopy` strings.

Title and H1 are the same registry field. Both slug pages pass `title: post.title` to `createPublicPageMetadata`. `BlogArticleContent` renders one `<h1>{post.title}</h1>` in the header. The article component must not render `h1`. This preflight does not choose the locked title, description, or `featured` booleans.

## Metadata, canonical, and hreflang

`createPublicPageMetadata` sets `alternates.canonical` from `createCanonicalUrl(getLocalizedPublicPath(...))` and `alternates.languages` from `createPublicLanguageAlternates`. That function returns `en`, `zh-CN`, and `x-default`. `x-default` is the English URL. Next writes those keys as `hreflang`.

Both pages pass `openGraphType: "article"`, `socialImagePath: post.coverImage.src`, and `robots: { index: true, follow: true }`.

`createArticleStructuredData` adds `image` only when `imagePathname` is passed. Neither slug page passes it, so the Article object has no `image` field. Open Graph and Twitter images are the absolute cover URL.

`app/sitemap.ts` maps `getLocalizedIndexablePublicRouteEntries()` through `createCanonicalUrl`. It sets no `lastmod`. `src/seo/canonical-public-routes.ts` re-exports `canonicalPublicPaths`.

Fixed paths are `/`, `/privacy`, `/terms`, `/contact`. Blog index paths are `/blog` and `/blog/archive`. Contact is the only noindex path. The Chinese prefix is `/zh`, not `/zh-CN`.

| Surface | Current | After one slug appended at the end |
|---|---:|---:|
| `blogPostSlugs` | 25 | 26 |
| `canonicalPublicPaths` | 31 | 32 |
| localized route entries | 62 | 64 |
| indexable route entries | 60 | 62 |
| sitemap `<loc>` | 60 | 62 |
| `totalPostCount` | 25 | 26 |
| latest visible posts | 6 | 6 |
| topic carousel pages | 3 | 3 |
| archive pages | 3 | 3 |

Homepage order is the registry reversed, then sliced to `defaultVisiblePostCount` 6. Topic carousel page size is 12 and uses canonical order. Archive page size is 9. `ceil(26/12)` and `ceil(26/9)` both stay 3.

Latest 6 after the append:

`house-upgrade-stardew`, `how-to-harvest-stardew-valley`, `oak-tree-vs-maple-stardew`, `stardew-fruit`, `what-to-grow-in-greenhouse-stardew`, `profit-margin-stardew`

`pine-tree-stardew` leaves that list. It is slug index 19, so it is also outside carousel page 1 (the first 12). Carousel page 3 changes from only `how-to-harvest-stardew-valley` to that slug plus `house-upgrade-stardew`.

`validateBlogPostRegistry` requires both `en` and `zh-CN` arrays to follow `blogPostSlugs` exactly, with no missing or duplicate slug. `featured` is a boolean the locked handoff must choose. The registry test hardcodes both arrays. Current posts do not share one featured value: the test file asserts the two arrays separately.

## Images

`PublicPicture` requires `src` to end in `.webp` and emits the sibling `.avif`. A bad source throws `TypeError` with the received string. The header call in `BlogArticleContent` is `width={1672}` `height={941}` and does not pass `loading` or `fetchPriority`. Cards use the same dimensions with `loading="lazy"`. Current in-article figures use 1672×941, `decoding="async"`, and `loading="lazy"`. The component is not `next/image`.

`sips` on the six candidate files exited 0. Each file is 1672×941. WebP format is `webp`; AVIF format is `avif`.

| Candidate file | Bytes |
|---|---:|
| `media-production/en/house-upgrade-stardew-cover.webp` | 72418 |
| `media-production/en/house-upgrade-stardew-cover.avif` | 39621 |
| `media-production/en/tier-rooms.en.webp` | 70092 |
| `media-production/en/tier-rooms.en.avif` | 38764 |
| `media-production/en/upgrade-or-renovation.en.webp` | 68194 |
| `media-production/en/upgrade-or-renovation.en.avif` | 36133 |

Those files stay under `docs/blog-ops/house-upgrade-stardew/media-production/en/`. They are not in `public/`. `provenance.json` status is `candidate_asset_bound_to_writer_submission`. They are not an approved public asset.

Current public WebP count, from `find`, is 75 under `public/blog` plus 27 under `public/homepage`, total 102. AVIF counts match those two directories. `tests/assets/public-avif-assets.test.ts` still expects length 81. Copying new WebP files increases 102. It does not make 81 true. That test file stays off the write list.

`tests/assets/blog-cover-images.test.ts` checks a listed subset. Its cover ceiling is `1.25 * 1024 * 1024` bytes. Its per-figure ceiling is `400 * 1024` bytes. The three candidate WebP files are under both ceilings. That measurement is not a test run, and the files are not in the listed subset.

### Hashes

| File | SHA-256 at this check |
|---|---|
| `content/en/draft-v3.md` | `417e1f72a0fcb7a3a30190936fe2a04f6dfb921a405b8bf98bccec7cd3c75d46` |
| `content/en/media-text.en.json` | `966c4e0b76f25c7489b187712c58ae1d33b3cc3a3eebf04c7efbaa3a51508588` |
| `content/en/writer-submission.json` | `7c9cd2414e3b7d70d789ee37f5c066dfac1e544c2aad8bc25954996d5305deec` |
| `media-production/en/provenance.json` | `4849463e179846c47da8136c4356fdb8327975841f965ce90ba801a753b8a9f5` |

`draft-v3.md` matches `writer-submission.json` `transition.bodySha256` and the `bodySha256` field inside the current `media-text.en.json`. `shasum` exited 0.

`provenance.json` `inputs.bodyDraftSha256` is `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628`. That is not the current draft. `provenance.json` `inputs.mediaTextEnSha256` is `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415`. That is not the current media-text file. The current media-text still names the same three English public paths and the same `inImageText` lines. Its file hash changed because other fields changed, including `bodySha256`.

`writer-submission.json` records `mechanical_units` 855, `required_floor` 1000, `meets_mechanical_floor` false, and `lengthClass` `below_floor`, for this same draft hash. This preflight did not re-run `正文计数.py`. Round 2 is in progress. Future G must not assemble from this intermediate draft or from the provenance body hash.

### Chinese cover paths stay reserved

`layout/media-plan.json` already names the Chinese pair. Later assembly keeps these paths. The files are absent today:

- `/blog/house-upgrade-stardew-cover-zh.webp`
- `/blog/house-upgrade-stardew-cover-zh.avif`
- `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp`
- `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif`
- `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp`
- `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif`

English public targets, also absent from `public/`:

- `/blog/house-upgrade-stardew-cover.webp` and `.avif`
- `/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` and `.avif`
- `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` and `.avif`

If a later approved handoff copies all six WebP files, the public blog-plus-homepage WebP count goes from 102 to 108. Copying only the three English pairs would make it 105. The Chinese rasters do not exist yet, so 108 is the planned full set.

Wiki and Steam rasters stay rejected. `media-plan.json` `rejectionReason` says the site-use basis is unknown, and `media-research/provenance.md` quotes the wiki line that the asset "is freely usable on this wiki." That sentence is not permission for this site. Do not copy these into `public/`:

- `media-research/originals/house-indoors-tier-2.png`
- `media-research/originals/house-indoors-tier-3.png`
- `media-research/originals/cellar-inside.png`
- `media-research/originals/carpenters-shop-interior.png`
- `media-research/originals/house-tier-1-starter.png`
- `media-research/originals/house-tier-2-exterior.png`
- `media-research/originals/house-tier-3-exterior.png`
- `media-research/originals/robin-building.png`
- `media-research/inspected/steam-robin-menu.png`

## CSS already covers tables and figures

Do not edit `app/globals.css`.

- `[data-blog-article] .blog-table-scroll` starts at line 1935, with focus and wrap rules after it.
- `[data-blog-article] .blog-article-media` starts at line 2027. Its `img` rule sets `aspect-ratio: 16 / 9`, `object-fit: cover`, and `width: 100%`.
- `[data-blog-article] > header > .public-picture img` at line 1525 sets `height: 100%`, `object-fit: cover`, and `width: 100%`.
- The same selector at line 1639 adds `aspect-ratio: 16 / 9`. Both rules apply to the header cover.
- `[data-blog-article] > header > h1` is at line 1628.

`BlogSources` still accepts only the headings `Sources`, `来源`, and `资料来源`, then renders `BlogPlannerCta` before `<section class="blog-sources">`. Put `BlogFaqList` before `BlogSources` when a FAQ is locked. Do not mount a second CTA.

## Tests whose counts or sets must change

These passed in the 2026-10-15 blog Vitest log and fail if the slug is appended without the matching edits. This preflight did not re-run them.

1. `tests/blog/blog-post-registry.test.ts` — `expect(blogPostSlugs).toEqual(expectedSlugs)` at line 74. The same file has exact canonical-path arrays, cover maps, and both `featured` arrays. Append the slug, both trailing-slash identity paths, both cover sources, and the two booleans from the locked handoff.
2. `tests/blog/blog-home-state.test.ts` — newest-6 array at lines 52–59, `totalPostCount` 25 at line 60, and carousel page 3 at lines 104–106 (only `how-to-harvest-stardew-valley`). Page 2's twelve-slug list stays the same because those indexes do not move.
3. `tests/i18n/public-route-registry.test.ts` — lengths 31, 62, and 60 at lines 11, 169, and 170. The `arrayContaining` list at line 231 is a subset and already omits `what-to-grow-in-greenhouse-stardew`. The length assertions are the ones that must change to 32, 64, and 62.
4. `tests/seo/canonical-public-routes.test.ts` — `toHaveLength(31)` at line 33. Its `arrayContaining` list already omits `stardew-fruit` and `what-to-grow-in-greenhouse-stardew`, so the required edit is the length, to 32.
5. `tests/routes/removed-public-pages.test.ts` — lengths 31, 62, and 60 at lines 77–79, and sitemap `<loc>` count 60 at line 92. That last assertion reads `out/sitemap.xml`. It can pass only after a new webpack export.
6. `tests/routes/blog-routes.test.tsx` — English index `href="/pine-tree-stardew"` at line 55 and Chinese `href="/zh/pine-tree-stardew"` at line 92. After the append, Pine leaves the latest 6 and is not on carousel page 1, so those two index strings disappear.
7. `tests/blog/house-upgrade-stardew-identity.test.tsx` — new. Follow `tests/blog/what-to-grow-in-greenhouse-stardew-identity.test.tsx`. Assert the locked public files exist, each WebP has its AVIF sibling, and the dimensions are 1672×941.

`public/llms.txt` needs one English bullet and one Chinese bullet, using the locked title and description. `tests/routes/llms.test.ts` already loops every indexable URL at line 145 and reads `out/llms.txt`. The test file does not need a new assertion. The existing `out/llms.txt` is dated 2026-10-15 21:55:49. `grep -c` printed 0 for `stardew-fruit` and 0 for `house-upgrade-stardew`. A correct house-upgrade bullet does not make that test green while `stardew-fruit` is absent. Do not add the fruit lines in this article's assembly.

`tests/routes/sitemap-robots.test.ts` derives its `<loc>` count from `getLocalizedIndexablePublicRouteEntries()`. Its hardcoded pathname list is a subset and already omits `stardew-fruit` and `how-to-harvest-stardew-valley`. The test file does not need a new line. The rebuilt `out/sitemap.xml` must contain the new URLs.

`tests/routes/static-routes.test.ts` loops `expectedStaticPageFiles` and reads those files. The list already omits `stardew-fruit.html` and `how-to-harvest-stardew-valley.html`. A new HTML file does not fail it. Do not add the new file to that list.

## Historical failures, unchanged

The 2026-10-15 blog Vitest log is the only measured result: exit 1, 8 failed, 237 passed, 245 tests. This preflight did not re-run it and does not call that result a current PASS.

1. `tests/assets/public-avif-assets.test.ts`: expected WebP length 81. The tree now has 102.
2. `tests/blog/pine-tree-stardew-identity.test.ts`: Chinese body phrase.
3. `tests/blog/blog-article-content.test.tsx`: same Pine phrase.
4. `tests/blog/blog-sources.test.tsx`: English Pine checked-label text.
5. `tests/routes/llms.test.ts`: `out/llms.txt` has no `stardew-fruit` URL. The slug is already registered.
6. `tests/routes/static-public-pages.test.ts`: `/blog` HTML does not contain the expected `how-to-earn-money-stardew` cover, because that cover is outside the latest 6 and carousel page 1.
7. Same file, homepage section-order assertion, observed on the webpack `out/`.
8. Same file, 404 stylesheet assertion expects `/_next/static/chunks/*.css`; the webpack 404 HTML uses a `/_next/static/css/` file.

The 2026-10-15 gates, not re-run here:

| Gate | Exit | Meaning |
|---|---:|---|
| `pnpm typecheck` | 0 | Later assembly must leave this at 0 |
| `pnpm build` | 1 | Turbopack rejects the external `node_modules` symlink |
| `pnpm exec next build --webpack` | 0 | The static export this worktree can produce |
| blog interface Vitest | 1 | 8 failed, 237 passed |

`pnpm test` is still the wrong command. `pretest` runs `pnpm build` again.

## Narrow future write list

Future assembly may write only these paths, and only after a locked bilingual handoff. Anything else is outside this contract.

Article and registry:

1. `src/blog/articles/house-upgrade-stardew.en.tsx` (new)
2. `src/blog/articles/house-upgrade-stardew.zh.tsx` (new)
3. `src/blog/blog-post-identities.ts` — append the slug once, at the end
4. `src/blog/blog-post-registry.tsx` — import both components and add both locale records at that index
5. `src/blog/blog-copy.ts` — add the two localized hrefs only

Public copy and media:

6. `public/llms.txt` — one English bullet and one Chinese bullet
7. `public/blog/house-upgrade-stardew-cover.webp` and `.avif`
8. `public/blog/house-upgrade-stardew-cover-zh.webp` and `.avif`
9. `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` and `.avif`
10. `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp` and `.avif`
11. `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` and `.avif`
12. `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp` and `.avif`

Tests:

13. `tests/blog/blog-post-registry.test.ts`
14. `tests/blog/blog-home-state.test.ts`
15. `tests/i18n/public-route-registry.test.ts`
16. `tests/seo/canonical-public-routes.test.ts`
17. `tests/routes/removed-public-pages.test.ts`
18. `tests/routes/blog-routes.test.tsx`
19. `tests/blog/house-upgrade-stardew-identity.test.tsx` (new)

`src/assets` stays off this list. Article images are public URL strings.

## Do not write

- `app/(en)/[slug]/page.tsx`
- `app/zh/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `src/i18n/public-route-registry.ts`
- `src/seo/page-metadata.ts`
- `src/seo/page-structured-data.ts`
- `src/seo/public-site-url.ts`
- `src/seo/canonical-public-routes.ts`
- `src/components/**`
- `app/globals.css`
- `package.json`, `pnpm-lock.yaml`, `next.config.ts`, `AGENTS.md`, `CLAUDE.md`
- `tests/routes/sitemap-robots.test.ts`
- `tests/routes/static-routes.test.ts`
- `tests/routes/llms.test.ts`
- `tests/assets/public-avif-assets.test.ts`
- `tests/assets/blog-cover-images.test.ts`
- Pine identity, article-content, and sources tests
- `tests/routes/static-public-pages.test.ts`
- the main checkout or `/Users/wusir/Desktop/开发项目集合/stardew planner-worktrees/博客`
- `docs/blog-ops/house-upgrade-stardew/research/` or `control/`
- any wiki or Steam PNG listed above

## Services

Read at 2026-10-16 07:35. This task did not start or signal a process.

`scripts/dev.sh` sets `DEV_PORT=3003` and runs `scripts/free-listen-port.sh`. That script sends `CONT`, then `TERM`, then `KILL` to listeners on the port. Do not run `pnpm dev` or `scripts/dev.sh` in this worktree.

Port 3003 is in use. PID 88483 is `next-server (v16.3.0)`, cwd `/Users/wusir/Desktop/开发项目集合/stardew planner`, listening on `*:3003`. That is the main checkout, not this worktree. The 2026-10-15 note of PID 34931 is not the current listener.

Other listeners seen on 3000–3007 belong to other projects, including `serve` of the main checkout `out/` on `127.0.0.1:3007` (PID 15566). A later preview must run `lsof -nP -iTCP -sTCP:LISTEN` again and pick a port that is free at that moment. Do not reserve one now.

After `pnpm exec next build --webpack`, start the already installed serve with an explicit free port and no port switching:

`pnpm exec serve out -l tcp://127.0.0.1:<free-port> --no-port-switching --no-clipboard`

`serve --help` says the default listen address is `0.0.0.0:3000`, and 3000 was occupied at this check. `--no-port-switching` refuses a taken port.

## Instructions for later E

E reviews the assembled pages. This preflight did not open a browser and did not judge the draft.

1. Read `/Users/wusir/.claude/skills/ego-browser/SKILL.md`. `/Users/wusir/.mirasim/skills/ego-browser/SKILL.md` also exists. Use `ego-browser nodejs`. One `taskSpace`. Use page `p1`.
2. Confirm the listen ports again. Do not run `scripts/dev.sh`. Serve only this worktree's new `out/` on a port `lsof` shows as unused.
3. Open `http://127.0.0.1:<port>/house-upgrade-stardew` and `http://127.0.0.1:<port>/zh/house-upgrade-stardew`. Reuse `p1` with `goto`. Print `page.info()` and a snapshot.
4. The skill has no viewport method. Set size with `page.cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile })`, then confirm with `page.info()`. Desktop is 1280×800 with `mobile: false`. Mobile is 390×844 with `mobile: true`.
5. Save screenshots with `page.screenshot({ path })` before `task.finish`. `finish({ keep: [] })` closes agent pages. It does not write image files. Retain these files under `docs/blog-ops/house-upgrade-stardew/reviews/E/screenshots/`:
   - `en-desktop-1280x800.png`
   - `en-mobile-390x844.png`
   - `zh-desktop-1280x800.png`
   - `zh-mobile-390x844.png`
   - one scrolled body-figure shot per locale when the first shot crops `tier-rooms` or `upgrade-or-renovation`
6. Check one `h1`, canonical, `hreflang` `en` / `zh-CN` / `x-default`, the language-switch href, eager cover versus lazy figures, and that the AVIF and WebP requests succeed. Heading anchors appear after hydration because the TOC is a client effect.
7. Do not use `https://stardewvalleyplanner.art` as the acceptance server.

## This round stopped before assembly

No article module, registry entry, copy href, llms bullet, public media file, or product test was added. The current English draft remains an in-progress round-2 file below the recorded 1000-unit floor. Chinese cover and figure files are reserved and absent. The three English rasters remain unapproved candidates.
