# Project interface spec: add one bilingual blog post (`pine-tree-stardew`)

This is the ProjectInterfaceSpec for a later page-assembly task. It describes the existing Stardew Valley Planner project surface and the bounded future write set for one English + Simplified Chinese blog identity; it is not an article brief, public handoff, AssemblyManifest, preview, deployment record, or article body.

**Evidence date:** 2026-09-22 (Asia/Shanghai).

The requested slug is locked to `pine-tree-stardew`. The current checkout has no matching article module, registry entry, public article asset, handoff, or target-specific test. Therefore the target title, H1, description, topic, author, read time, body, source links, FAQ text, figure names, captions, alt text, dimensions beyond the existing project contract, hashes, and dates are not supplied here; a later assembler must bind them from a valid `PublicBlogHandoff` and actual media files instead of guessing.

## Project and evidence status

| Item | Verified value |
|---|---|
| Current checkout | `/Users/wusir/orca/workspaces/stardew planner/博客二` |
| Branch / evidence HEAD | `博客二` / `6fa063ed8b41d25f6feb1bcf78d5a3509eedaa6c` |
| Production origin configured by source | `https://stardewvalleyplanner.art` (`src/seo/public-site-url.ts:1-38`) |
| Package manager | `pnpm 10.22.0`; `package.json` `packageManager` is `pnpm@10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c` |
| Node engine | `>=20.9.0` |
| Next.js | `16.3.0` |
| Router | App Router; shared dynamic article routes are `app/(en)/[slug]/page.tsx` and `app/zh/[slug]/page.tsx` |
| Output mode | Static export: `next.config.ts:3-10` sets `output: "export"` |
| Image optimizer | Disabled for export: `next.config.ts:5` sets `images: { unoptimized: true }` |
| Public locales | `en` and `zh-CN` (`src/i18n/public-locale.ts:1-3`) |
| Chinese URL prefix | `/zh`, not `/zh-CN` (`src/i18n/public-route-registry.ts:61-73`) |
| Local development address | `http://127.0.0.1:3003` |
| Local dev command | `pnpm dev`, which delegates to `scripts/dev.sh` |
| Current listener observed | None on TCP 3003 during this read-only inspection |
| Current `out` directory observed | Absent during this read-only inspection |
| Current `node_modules` observed | Absent in this checkout during this read-only inspection; no build/typecheck/Vitest was run |
| Initial worktree state | Clean except for this new target spec after the write; no source/public/tests files were changed |

A source/config observation is not proof of a running local server, production deployment, CDN state, indexing, or Google rich-result eligibility.

### Live examples read without target writes

On 2026-09-22, production readback returned HTTP 200 for these existing article routes:

- `https://stardewvalleyplanner.art/summer-crops-stardew`
- `https://stardewvalleyplanner.art/zh/summer-crops-stardew`
- `https://stardewvalleyplanner.art/fall-crops-stardew`
- `https://stardewvalleyplanner.art/zh/fall-crops-stardew`

The readback showed the existing route shape: a no-trailing-slash canonical link, one page-level H1, one `Article` JSON-LD script, a 1672×941 non-lazy cover image, and 1672×941 in-body figures with `loading="lazy"`. The two target production paths were also read: `/pine-tree-stardew` and `/zh/pine-tree-stardew` both returned HTTP 404, so this spec does not claim a live target page.

## Governing V7 assembly rules

This spec was prepared after reading:

- `/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md` §五 `page-ready/project-write`, §六 `媒体`, and §七 `验证范围`;
- `/Users/wusir/Desktop/博客-V7修订版/04-公开交接与页面装配.md` sections `唯一公开交接`, `正文和主张的锁定`, `公开引用的装配规则`, `AssemblyManifest`, and `写页授权和验收`.

The implications for this project are:

1. A later assembly consumes one valid `PublicBlogHandoff` plus this verified interface spec plus actual project media. It does not recreate an internal `PageIntegrationRequest`, research snapshot, SERP/PAA dump, private path, prompt, or internal brief.
2. The handoff must contain the locked bilingual body/AST and deterministic `bodyHash`, SEO fields, public references, public requirements, and integrity data. This interface spec must not be copied into the public handoff.
3. The assembler binds fields to the handoff and existing project interfaces; it does not rewrite, summarize, translate, or silently fill missing title, author, date, URL, source, FAQ, or media values.
4. Existing route, registry, i18n, layout, navigation, and media components are reused. No temporary HTML, separate demo site, Markdown-as-page, or parallel route tree can stand in for the real article page.
5. V7 requires a finished illustrated post to have reader-useful in-body visual content in addition to the cover. A cover-only page, placeholder figure, or media list not rendered in the body is incomplete. Exact figure count and content remain handoff-controlled.
6. The first-render cover follows the existing LCP behavior; non-LCP figures are lazy. Desktop/mobile page review is separate from source checks, static build, live-origin readback, deployment, and user approval.
7. A later `WritePageGrant` must be scoped to this local project, the two requested locales, and this one target page. Deployment, external writes, commit, push, or production changes are not implied.

The later implementation must preserve high cohesion, low coupling, SRP, KISS, Fail Fast with concrete received values, YAGNI, and precise names. Existing project conventions take precedence over a new abstraction.

## URL, locale, and dynamic-route contract

### Public URL pairs

| Locale | Locale value in code | Article pathname | Blog index |
|---|---|---|---|
| English | `en` | `/pine-tree-stardew` | `/blog` |
| Simplified Chinese | `zh-CN` | `/zh/pine-tree-stardew` | `/zh/blog` |

Canonical public pathnames have no trailing slash except `/`. `createCanonicalUrl` in `src/seo/public-site-url.ts:40-66` rejects a non-root trailing slash, query, fragment, repeated leading slash, or backslash. The identity module intentionally exposes trailing-slash strings for registry comparisons:

- canonical English URL: `/pine-tree-stardew`
- identity English value: `/pine-tree-stardew/`
- canonical Chinese URL: `/zh/pine-tree-stardew`
- identity Chinese value: `/zh/pine-tree-stardew/`

Do not use `/zh-CN/pine-tree-stardew`, `/pine-tree-stardew/`, or `/zh/pine-tree-stardew/` as public canonical pathnames.

### Current occupied slugs

`src/blog/blog-post-identities.ts:1-21` is the current oldest-to-newest publishing order:

1. `carpenter-stardew`
2. `where-is-robin-stardew-valley`
3. `stardew-valley-npc`
4. `stardew-valley-town-map`
5. `where-is-stardew-valley-located`
6. `stardew-valley-expanded-bachelors-and-bachelorettes`
7. `sprinkler-stardew`
8. `glasshouse-stardew-valley`
9. `oak-tree-stardew`
10. `stardew-valley-trees`
11. `maple-tree-stardew`
12. `best-spring-crop-stardew`
13. `how-to-earn-money-stardew`
14. `rancher-or-tiller-stardew`
15. `summer-crops-stardew`
16. `fall-crops-stardew`
17. `do-you-have-to-water-trees-stardew`
18. `how-to-level-up-farming-stardew`
19. `last-day-to-plant-stardew`

Append `pine-tree-stardew` as item 20. Do not replace or reorder an occupied slug. The English and `zh-CN` registry arrays in `src/blog/blog-post-registry.tsx:78-654` must have the same index order.

`src/blog/blog-home-state.ts:4-7,126-160` reverses canonical registry order for latest cards, defaults to six visible posts, and paginates the first qualifying topic at 12 posts per page. If the target uses the current default topic, the post-registration newest-six order is expected to begin:

1. `pine-tree-stardew`
2. `last-day-to-plant-stardew`
3. `how-to-level-up-farming-stardew`
4. `do-you-have-to-water-trees-stardew`
5. `fall-crops-stardew`
6. `summer-crops-stardew`

The exact target topic is a handoff field; do not invent a different topic merely to force a carousel result.

### Derived route counts

These values were recounted from current source and current test fixtures, not copied from the older `fall-crops-stardew` or `summer-crops-stardew` specs:

| Derived collection | Current source value | After registering item 20 |
|---|---:|---:|
| `blogPostSlugs` | 19 | 20 |
| `blogPostCanonicalPaths` (English + Chinese identity paths) | 38 | 40 |
| `canonicalPublicPaths` | 25 | 26 |
| localized public route entries | 50 | 52 |
| indexable/sitemap route entries | 48 | 50 |
| `tests/routes/static-routes.test.ts` expected static files | 50 | 52 |

After a successful build, the two new static files are expected to be `out/pine-tree-stardew.html` and `out/zh/pine-tree-stardew.html`. The current checkout has no `out` directory, so this is a build contract, not current output evidence.

**Pre-existing test-drift note:** `tests/routes/removed-public-pages.test.ts:77-92` currently hardcodes 24 canonical, 48 localized, 46 indexable, and 46 sitemap URLs, while current source derives 25, 50, and 48 respectively. A later article implementation must reconcile this stale fixture to the source-derived values and then add the target transition; this documentation task does not repair that test. `tests/scripts/production-seo-smoke-contract.mjs:1-18,137-146` is also an older independent contract: it declares 16 canonical pathnames and asserts 32 public HTML / 30 sitemap paths, not the current source-derived route set. `pnpm seo:smoke` therefore cannot be reported as complete target coverage until that separate contract is brought current under an explicitly authorized scope.

### Existing route files

The shared route files are:

- `app/(en)/[slug]/page.tsx:24-28,44-78`
- `app/zh/[slug]/page.tsx:27-31,47-85`

Both routes already:

- return `blogPostSlugs.map((slug) => ({ slug }))` from `generateStaticParams`;
- set `dynamicParams = false`;
- accept `params` as `Promise<{ slug: string }>` and `await` it;
- validate with `isBlogPostSlug` and resolve with `getBlogPostBySlug`;
- call `notFound()` for an unknown or missing post;
- call `createPublicPageMetadata` with localized title/description, `openGraphType: "article"`, the registered cover path, and `{ index: true, follow: true }`;
- render `PublicPageShell`, `BlogArticleContent`, and one `Article` JSON-LD script.

Registering the slug is sufficient for routing. Do **not** create `app/pine-tree-stardew/page.tsx`, `app/zh/pine-tree-stardew/page.tsx`, or any other per-article App Router page. Do not edit either shared route for a normal article.

`next.config.ts:3-10` uses static export and does not set `trailingSlash: true`; after a successful build the dynamic route files therefore use the `.html` form above. When implementing against an installed Next.js checkout, re-read the local Next guide files under `node_modules/next/dist/docs/` for this Next 16.3.0 version before code changes.

`src/blog/blog-copy.ts:97-144` is typed as a locale-by-slug record. Add both target entries:

```ts
// en
"pine-tree-stardew": "/pine-tree-stardew",

// zh-CN
"pine-tree-stardew": "/zh/pine-tree-stardew",
```

`getLocalizedBlogPostHref` at `src/blog/blog-copy.ts:161-174` fails fast when either locale/slug pair is absent. A one-sided route is not an acceptable partial state.

## Reusable public exports and types

Use existing public interfaces rather than reaching into registry internals:

| Module | Current public contract |
|---|---|
| `src/blog/blog-post-identities.ts:1-35` | `blogPostSlugs`, `BlogPostSlug`, `blogPostCanonicalPaths`, `isBlogPostSlug` |
| `src/blog/blog-post-registry.tsx:55-76,738-812` | `BlogPostMeta`, `LocalizedBlogPost`, `validateBlogPostRegistry`, `getAllBlogPosts`, `getAllBlogPostMeta`, `getBlogPostBySlug`; identity exports are re-exported |
| `src/blog/blog-copy.ts:4-31,151-199` | `BlogCopy`, `getBlogCopy`, `getLocalizedBlogPostHref`, `getLocalizedBlogArchiveHref`, `formatBlogReadTime` |
| `src/blog/blog-home-state.ts:7-28,69-200` | `topicArticlesPageSize`, blog home state/search helpers, latest-post reversal and pagination |
| `src/i18n/public-route-registry.ts:12-103` | `PublicCanonicalPath`, route entry types, `canonicalPublicPaths`, `indexableCanonicalPublicPaths`, localized-path and language-alternate helpers |
| `src/seo/public-site-url.ts:1-66` | `publicSiteUrl`, `createCanonicalUrl` |
| `src/seo/page-metadata.ts:12-56` | `PublicPageMetadataInput`, `createPublicPageMetadata` |
| `src/seo/page-structured-data.ts:15-21,39-90` | `ArticleStructuredDataInput`, `serializeJsonLd`, `createArticleStructuredData` |
| `src/components/public-picture.tsx:8-47` | `PublicPictureProperties`, `createPublicAvifSource`, `PublicPicture` |
| `src/components/blog/blog-article-content.tsx:7-41` | Shared article header/body shell and page-level H1 |
| `src/components/blog/blog-faq-list.tsx:7-89` | `BlogFaqItem`, `BlogFaqList`, fail-fast FAQ validation |
| `src/components/blog/blog-sources.tsx:21-85` | `BlogSourceItem`, `BlogSources`; it also inserts the existing planner CTA |
| `src/components/blog/blog-planner-cta.tsx:11-67` | Sources-heading locale mapping and localized planner CTA |

Do not expose private research IDs, body hashes, prompts, private filesystem paths, or internal registry state through these public interfaces.

## Registry and article-module contract

### `BlogPostMeta`

`BlogPostMeta` is defined at `src/blog/blog-post-registry.tsx:55-67`:

- `slug`: the `BlogPostSlug` value `pine-tree-stardew`;
- `title` and `description`: non-empty localized values from the handoff;
- `topic`: non-empty localized value from the handoff; current registry convention is `Stardew Valley Guides` / `星露谷物语指南`, but the spec does not lock the target value;
- `author`: non-empty localized value from the handoff; current registry convention is `Stardew Valley Planner Team` / `星露谷规划器团队`, but the spec does not authorize inventing a target byline;
- `readTimeMinutes`: a positive integer;
- `coverImage.src`: a non-empty public `.webp` path;
- `coverImage.alt`: a meaningful trimmed description of the actual picture; the validator at `src/blog/blog-post-registry.tsx:672-680` requires at least 8 characters;
- `featured`: an explicit boolean, not an inferred value;
- `Content`: a function returning the localized article body.

The validator at `src/blog/blog-post-registry.tsx:682-785` rejects unsupported locale keys, missing arrays, unknown/duplicate/misordered slugs, blank strings, non-positive or fractional read times, invalid cover objects, short cover alts, and non-function `Content` with concrete received values. Do not wrap or swallow these errors.

The planned precise export names are:

- `PineTreeStardewEnglishArticle`
- `PineTreeStardewChineseArticle`

These are future interfaces, not evidence that the files exist now. Create two independent Server Component modules:

- `src/blog/articles/pine-tree-stardew.en.tsx`
- `src/blog/articles/pine-tree-stardew.zh.tsx`

The registry edit is append-only for this target: import both functions; append one English object after `last-day-to-plant-stardew`; append the Chinese object at the matching index; leave existing article objects untouched; let `validateBlogPostRegistry` fail fast on bad order, duplicates, missing locales, invalid metadata, or non-function content.

The exact target title, description, read time, cover path, cover alt, topic, author, featured flag, body, FAQ, source list, and media bindings remain unconfirmed until handoff validation. This spec contains no target article facts or copy.

### Article body shape

Follow the existing independent article modules, especially the current crop modules, without copying their article text:

- Begin with `<article><p>…</p>`; the shared `BlogArticleContent` supplies the page-level `<h1>` from `post.title`.
- Do not put `<h1>` in either body module.
- Use semantic `<h2>`/`<h3>` headings and the existing table wrapper for wide data tables:

```tsx
<div aria-label="<handoff-locked table label>" className="blog-table-scroll" role="region" tabIndex={0}>
  <table className="blog-data-table">
    <thead>…</thead>
    <tbody>…</tbody>
  </table>
</div>
```

- Use raw `<a href="…">` links, not `next/link`.
- Do not put author/SEO narration, internal research notes, prompts, Search intent, Target keyword, Content brief, `[confirm:`, `[待确认：`, `本文将`, or other internal markers in the body. `tests/blog/blog-article-content.test.tsx:30-85` and `tests/blog/blog-direct-reader-voice.test.tsx:112-190` enforce related negative contracts.
- Do not link removed public pages (`/farm-comparison`, `/mods`, `/farm/`, or their `/zh` forms).
- Use `BlogYouTubeVideo` only if the validated handoff explicitly requires a video; never add a raw YouTube iframe.

### FAQ contract

`BlogFaqList` is a client component but article modules remain Server Components and render it as a child. Its public item type is `BlogFaqItem` at `src/components/blog/blog-faq-list.tsx:7-10`:

```ts
export type BlogFaqItem = Readonly<{
  question: string;
  answer: ReactNode;
}>;
```

If the handoff requires an on-page FAQ:

- render it under a localized `<h2>FAQ</h2>` or `<h2>常见问题</h2>` (or the exact locked heading);
- pass a non-empty array;
- give every item a non-blank question and a non-null/non-undefined/non-false/non-blank answer, normally a `<p>`;
- do not add FAQ content merely to fill a module.

`tests/blog/blog-faq-list.test.tsx:6-88` covers the generic fail-fast behavior. This is visible page FAQ content, not FAQPage JSON-LD.

### Sources and planner CTA contract

`BlogSources` at `src/components/blog/blog-sources.tsx:21-85` accepts:

```ts
export type BlogSourceItem = Readonly<{
  href: string;
  label: string;
  note?: string;
}>;
```

Source items must be public, handoff-verified links with descriptive labels, optional notes, exact order, and any handoff-locked `checkedLabel`. Do not infer or invent URLs, dates, version notes, or source labels. The heading must map through `getBlogPlannerCtaLocaleFromSourcesHeading` (`src/components/blog/blog-planner-cta.tsx:11-36`): `Sources` for English, or `来源` / `资料来源` for Chinese.

`BlogSources` renders `BlogPlannerCta` before the source section. `tests/blog/blog-planner-cta.test.tsx:57-88` requires exactly one localized CTA for every registered article, after the FAQ when an FAQ exists and before the Sources section. The planner path is `/#planner` for `en` and `/zh#planner` for `zh-CN`; do not use `/zh/#planner`, and do not put `blog-planner-link` on external wiki links.

`tests/blog/blog-sources.test.tsx` compares each article's source href, label, optional note, heading, checked label, and order. Add exact target fixtures only after the handoff supplies them.

## Metadata, canonical, language alternates, JSON-LD, sitemap, and `llms.txt`

### Article metadata

`app/(en)/[slug]/page.tsx:44-57` and `app/zh/[slug]/page.tsx:47-62` pass the localized registry fields to `createPublicPageMetadata`:

- `title`: `post.title`;
- `description`: `post.description`;
- `openGraphType`: `"article"`;
- `socialImagePath`: `post.coverImage.src`;
- `robots`: `{ index: true, follow: true }`.

`createPublicPageMetadata` at `src/seo/page-metadata.ts:26-56` supplies:

- localized canonical URL;
- `en`, `zh-CN`, and `x-default` language alternates, with x-default equal to the English URL;
- Open Graph title, description, `type: "article"`, URL, and absolute cover image;
- Twitter `summary` card with the same image;
- the supplied robots value.

Do not hand-write a second metadata object or invent dates, bylines, or canonical paths. `tests/routes/public-route-metadata.test.ts:113-165` loops every registered slug and checks paired metadata, canonical URLs, language alternates, article type, cover image, and index/follow robots; it should normally need no target-specific hardcoded edit.

### Article JSON-LD

The dynamic routes call `createArticleStructuredData` at `app/(en)/[slug]/page.tsx:68-75` and `app/zh/[slug]/page.tsx:75-82` with headline, description, pathname, and locale. The current emitted object from `src/seo/page-structured-data.ts:77-90` is:

- `@context: "https://schema.org"`;
- `@type: "Article"`;
- `headline`, `description`, canonical `url`;
- `inLanguage` (`en` or `zh-CN`);
- `isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" }`.

The route does not pass `imagePathname`, so article JSON-LD does not currently emit an image. Do not add `author`, `datePublished`, `dateModified`, `publisher`, `BlogPosting`, `FAQPage`, `QAPage`, or other invented fields. `tests/seo/page-structured-data.test.ts:17-130` forbids the relevant identity fields, and `tests/routes/static-public-pages.test.ts:1881-2008` uses `articleOnlySchema: true` for article fixtures and rejects `BlogPosting`, `FAQPage`, and `QAPage`.

### Sitemap, robots, and `llms.txt`

- `app/sitemap.ts:5-10` consumes `getLocalizedIndexablePublicRouteEntries`; do not add a per-article sitemap branch.
- `app/robots.ts:4-13` supplies the current robots contract; contact remains noindex and excluded from sitemap entries.
- Add the target to sitemap outputs by registering the slug, not by editing `app/sitemap.ts`.
- `public/llms.txt` is the source file copied to `out/llms.txt` by static export. Later add only the verified English and Chinese public links and descriptions from the handoff; do not write guessed target title or description text.
- `tests/routes/llms.test.ts` requires exact target link/content assertions after the handoff is available.

## Media and rendering contract

### `PublicPicture`

Article cover and body figures use `src/components/public-picture.tsx:17-47`, not `next/image` and not raw `<img>` in new article modules. `PublicPicture`:

- requires a non-empty `.webp` `src`;
- derives a same-stem `.avif` source using `createPublicAvifSource`;
- renders `<picture>` with an AVIF source and native WebP `<img>` fallback;
- accepts normal image properties including `width`, `height`, `decoding`, `loading`, and data attributes.

Wrap an in-body figure in the existing `<figure className="blog-article-media">` pattern and provide a reader-facing `<figcaption>` from the handoff. Alt must describe the actual picture rather than stuff keywords.

### Dimensions, format, and budgets

Current project tests establish these contracts:

| Asset | Required dimensions | Format / budget |
|---|---:|---|
| Article cover | 1672 × 941 | lossy VP8 WebP (`RIFF` / `WEBP` / `VP8 `), ≤ `1.25 * 1024 * 1024` bytes, ~16:9 |
| In-body figure | 1672 × 941 | lossy VP8 WebP, ≤ `400 * 1024` bytes, ~16:9 |
| Video poster, only if handoff requires video | 1280 × 720 | WebP, ≤ `100 * 1024` bytes |

`tests/assets/blog-cover-images.test.ts:390-399,411-500,516-616` reads the WebP bytes directly, rejects VP8L/VP8X by requiring the VP8 chunk, checks dimensions/aspect/bytes, and checks cover/figure loading behavior. The article cover receives `width=1672` and `height=941` without `loading="lazy"`; in-body figures use `width=1672`, `height=941`, `decoding="async"`, and `loading="lazy"` unless a verified above-the-fold handoff requirement changes that.

The current public image scan is 70 WebP files plus 70 same-stem AVIF files under `public/homepage` and `public/blog`; `public/public-previews/1.6.15` separately contains 29 WebP preview files with no AVIF derivatives. `tests/assets/public-avif-assets.test.ts:5-10,52-81` enforces this split. Every newly added public article WebP must have a non-empty AVIF sibling; after assembly the expected opaque WebP count is the current 70 plus the actual number of new target WebP files, not a guessed fixed count. The existing `public/blog/carpenter-stardew-cover.png` is a legacy file; do not add a new target PNG.

The public article asset roots are:

- `public/blog/` for covers;
- `public/blog/illustrations/` for in-body figures;
- `public/blog/video-posters/` for optional video posters.

The conventional cover stem is normally `{slug}-cover`, but the exact target asset filename, figure count, dimensions, byte sizes, alt, captions, attribution, and licensing/usage status remain unconfirmed until handoff and actual file validation. Do not create a guessed filename, placeholder asset, or cover-only article.

## Bounded future file map

The following is descriptive only and is not permission for the current task. The current task's hard write boundary is exactly one file: `docs/blog-ops/pine-tree-stardew/project-interface-spec.md`.

### Future create set, subject to handoff and scoped grant

| Planned path | Purpose | State |
|---|---|---|
| `src/blog/articles/pine-tree-stardew.en.tsx` | English article body | Planned; body and exact media slots unconfirmed |
| `src/blog/articles/pine-tree-stardew.zh.tsx` | Simplified Chinese article body | Planned; body and exact media slots unconfirmed |
| `public/blog/<locked cover stem>.webp` | Shared article cover | Filename and asset unconfirmed |
| `public/blog/<locked cover stem>.avif` | Cover AVIF sibling | Required for the locked cover WebP |
| `public/blog/illustrations/<locked figure stem>.webp` | In-body figure(s) | Count and names unconfirmed |
| `public/blog/illustrations/<locked figure stem>.avif` | Figure AVIF sibling(s) | Required for each figure WebP |
| `public/blog/video-posters/<locked poster stem>.webp` | Optional video poster | Only if explicitly required by handoff |
| `public/blog/video-posters/<locked poster stem>.avif` | Optional poster AVIF sibling | Required if that poster is added |
| `tests/blog/pine-tree-stardew-identity.test.ts` | Paired identity, file, and locked-angle regression | Planned |

Angle-bracket path placeholders are not literal filenames. Do not create them.

### Future edit set, subject to handoff and scoped grant

| Path | Required target change |
|---|---|
| `src/blog/blog-post-identities.ts` | Append `pine-tree-stardew` at item 20 |
| `src/blog/blog-copy.ts` | Add both localized target paths |
| `src/blog/blog-post-registry.tsx` | Import both article modules and append both metadata entries at matching index |
| `public/llms.txt` | Add only verified bilingual target links/descriptions |
| `tests/blog/blog-post-registry.test.ts` | Update 20-slug order, 40 identity paths, complete registry fixture, target metadata index, cover maps, and order/count assertions |
| `tests/blog/blog-home-state.test.ts` | Update total count, newest-six order, topic-page expectations, and any target carousel fixture affected by the final topic |
| `tests/blog/blog-direct-reader-voice.test.tsx` | Add both target article components to the direct-reader fixture so generic narration scans them |
| `tests/blog/blog-sources.test.tsx` | Add exact target source href/label/note/order/heading/checked-label fixtures from handoff |
| `tests/blog/blog-article-content.test.tsx` | Only add a target-specific fixture if the locked article needs a contract already represented here; otherwise run as regression |
| `tests/blog/blog-faq-list.test.tsx` | Generic FAQ regression only; no target edit unless a distinct shared contract is introduced (not expected) |
| `tests/blog/blog-planner-cta.test.tsx` | Generic loop already covers every registry article; normally run without a target-specific fixture edit |
| `tests/i18n/public-route-registry.test.ts` | Add both target path assertions and update 25→26, 50→52, 48→50 derived counts |
| `tests/seo/canonical-public-routes.test.ts` | Add target canonical path and update 25→26 |
| `tests/routes/blog-routes.test.tsx` | Add English/Chinese index href assertions and a paired target metadata/H1 block |
| `tests/routes/static-routes.test.ts` | Add `pine-tree-stardew.html` and `zh/pine-tree-stardew.html` to the expected static files (50→52 total) |
| `tests/routes/static-public-pages.test.ts` | Add English/Chinese article fixtures with `articleOnlySchema: true`, handoff metadata, cover images, locked body phrases, and required hrefs |
| `tests/routes/removed-public-pages.test.ts` | Reconcile its pre-existing stale 24/48/46/46 hardcodes to current source and then the target counts 26/52/50/50 |
| `tests/routes/sitemap-robots.test.ts` | Add the two target blog pathnames to the explicit list (42→44 blog pathnames); source-derived sitemap count becomes 50 |
| `tests/routes/llms.test.ts` | Add exact target bilingual link/content assertions from handoff |
| `tests/assets/blog-cover-images.test.ts` | Add target cover and exact figure/media expectations using actual files and bytes |
| `tests/assets/public-avif-assets.test.ts` | Update the opaque WebP count from actual added files; verify every new WebP has a non-empty AVIF sibling |

The following files derive from the identity/registry and should remain untouched for a normal new post:

- `app/(en)/[slug]/page.tsx`
- `app/zh/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `src/i18n/public-route-registry.ts`
- `src/seo/page-metadata.ts`
- `src/seo/page-structured-data.ts`
- `src/components/blog/blog-article-content.tsx`
- `src/components/blog/blog-faq-list.tsx`
- `src/components/blog/blog-sources.tsx`
- `src/components/blog/blog-planner-cta.tsx`
- `src/components/blog/article-card.tsx`

`tests/routes/public-route-metadata.test.ts` loops `blogPostSlugs` and should be run as a regression; do not add a target-specific hardcoded loop unless a verified new assertion is required. Do not edit existing article modules, occupied assets, CSS, package files, lockfiles, AGENTS/CLAUDE instructions, `docs/seo/cluster-plan.json`, the V7 source docs, or unrelated documents as a substitute for the handoff.

### Hard write boundary for this dispatched task

For this dispatched read-only interface-research task, the only allowed repository write is:

- `docs/blog-ops/pine-tree-stardew/project-interface-spec.md`

`app`, `src`, `public`, `tests`, `scripts`, `package.json`, lockfiles, generated output, screenshots, temporary HTML, all existing article docs, and all unrelated docs are forbidden write targets. No source, public asset, test, route, handoff, commit, push, deployment, or external service write is authorized here.

## Exact commands and verification contract for later implementation

### Existing package scripts

These values were read from `package.json`:

| Purpose | Command | Contract |
|---|---|---|
| Development | `pnpm dev` | Delegates to `scripts/dev.sh`, which frees TCP 3003 and runs `next dev --port 3003` |
| Static build | `pnpm build` | Runs `next build` and creates static output; it may write `out`/Next artifacts |
| Static serving | `pnpm start` | Runs `serve out`; this script does not declare a project-specific port |
| Type check | `pnpm typecheck` | Runs `tsc --noEmit` |
| Full test wrapper | `pnpm test` | `vitest`; `pretest` runs `NEXT_TELEMETRY_DISABLED=1 pnpm build` first |
| Focused tests | `pnpm exec vitest run <test files>` | No-build explicit Vitest invocation |
| Production SEO smoke | `pnpm seo:smoke` | External HTTPS readback; currently limited by stale `scripts/production-seo-smoke-contract.mjs` |
| Asset sync | `pnpm assets:sync` | Not needed for article assembly; may write assets and is outside this spec |

Do **not** use `pnpm test` for the focused source check because it invokes the build wrapper first. A focused Vitest pass is not a full build or full test pass.

### Source-level focused checks (after the future source/test/media edits)

```sh
pnpm typecheck

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

`blog-cover-images.test.ts` reads `public/blog` directly. `public-route-metadata.test.ts` and `blog-routes.test.tsx` render the shared route modules directly and do not prove static `out` output.

### Static-export checks (build first)

```sh
NEXT_TELEMETRY_DISABLED=1 pnpm build

pnpm exec vitest run \
  tests/routes/sitemap-robots.test.ts \
  tests/routes/llms.test.ts \
  tests/routes/static-routes.test.ts \
  tests/routes/static-public-pages.test.ts \
  tests/routes/removed-public-pages.test.ts
```

Inspect the actual generated files separately:

- `out/pine-tree-stardew.html`
- `out/zh/pine-tree-stardew.html`
- `out/llms.txt`
- `out/sitemap.xml`
- `out/robots.txt`

A local build proves only local static output. It does not prove deployment, CDN cache state, indexing, or live production state.

### Current SEO smoke limitation

The available command is:

```sh
pnpm seo:smoke
```

It calls `scripts/production-seo-smoke.mjs --origin https://stardewvalleyplanner.art`, which reads the independent contract in `scripts/production-seo-smoke-contract.mjs`. That contract currently declares an older 16-canonical-path subset and asserts 32 public HTML / 30 sitemap pathnames, while current source derives 25 canonical paths, 50 localized route entries, and 48 indexable entries. Do not report this command as complete `pine-tree-stardew` coverage until that separate contract is reconciled under an explicitly authorized scope.

## Local development and browser acceptance

`scripts/dev.sh:1-9` defines `DEV_PORT=3003`, calls `free-listen-port.sh`, and runs `next dev --port 3003`. The free-port helper kills whatever is already listening on 3003, so before a later browser run:

1. Inspect `lsof -nP -iTCP:3003 -sTCP:LISTEN` and verify any listener belongs to this checkout.
2. Reuse a healthy server for this checkout if one is already serving 3003; do not start a second `pnpm dev` unnecessarily.
3. If a new server is authorized, start `pnpm dev` and retain actual PID/log evidence.
4. Use the local ego-browser when available for real route evidence; do not substitute a temporary HTML file or claim browser proof from source checks.

Open these real local routes after the target is assembled:

- `http://127.0.0.1:3003/pine-tree-stardew`
- `http://127.0.0.1:3003/zh/pine-tree-stardew`
- `http://127.0.0.1:3003/blog`
- `http://127.0.0.1:3003/zh/blog`

For both article locales, at desktop and mobile viewports, a later independent page review should check:

- HTTP 200 and a real article route, not a fallback/404;
- `<html lang="en">` / `<html lang="zh-CN">`;
- exactly one page-level H1 supplied by the registry;
- localized title, description, topic, author, read time, cover, body, source list, checked label, FAQ (if in handoff), planner CTA, internal links, and language switch all match the handoff;
- body contains no private paths, prompts, research snapshots, internal IDs, or pollution markers;
- tables use the existing horizontal-scroll treatment without viewport overflow;
- cover is visible on first render and not lazy; non-LCP figures are visible, correctly cropped, and lazy;
- every visible image has the locked alt/caption and 200 responses for AVIF/WebP sources;
- canonical, `en`/`zh-CN`/`x-default` alternates, robots, and one `Article` JSON-LD match the project contract;
- no `FAQPage`/`BlogPosting` JSON-LD is introduced;
- navigation, footer, typography, focus behavior, language links, and responsive layout match the existing public shell;
- no unexpected runtime or console error is introduced.

Browser proof is local page proof only. It must be reported separately from source tests, static build, production readback, deployment, indexing, and user approval.

## Stop conditions and unresolved target fields

Return to the content/interface owner instead of guessing if any of these are missing or contradictory:

| Item | Required confirmation |
|---|---|
| `PublicBlogHandoff` | Valid bilingual handoff with locked body/AST, deterministic `bodyHash`, SEO, public references, public requirements, and integrity data |
| Title/H1/description/topic/author/read time | Exact localized values from handoff or an explicitly approved existing project field |
| Cover | Actual project WebP, same-stem AVIF, 1672×941 VP8 bytes, budget, alt, crop, attribution, and usage status |
| In-body figures | Exact count, filenames, WebP/AVIF siblings, dimensions, bytes, alt, captions, attribution, and usage status |
| Video | Whether one is required; poster/provider data if so |
| Body structure | H2/H3/table/FAQ/source/CTA/link slots and exact text |
| Source references | Exact href, labels, notes, order, and checked/date label |
| JSON-LD additions | Do not infer anything beyond the current `Article` contract; FAQPage requires separate authorized interface work and is not implied by on-page FAQ |
| Locale/country interpretation | Handoff's explicit locale/country meaning for each public version |
| WritePageGrant | Explicit scope for this project, locales, and target page |
| Local server/browser state | Re-check immediately before later QA; current inspection found no listener and no `out` |
| Live production state | Separate authorized external readback; current target production paths are 404 |
| SEO smoke contract | Separate reconciliation because its current hardcodes are stale |

Do not make a “best effort” page from guessed metadata, source URLs, or media. V7 assembly keeps content, interface, page review, user approval, and deployment states distinct.

## Read-only verification log

Completed before this documentation write:

- confirmed current checkout, branch, HEAD, clean baseline, and target path absence;
- read `AGENTS.md` / `CLAUDE.md`;
- read V7 `03-博客页面生成整合.md` §五–§七 and `04-公开交接与页面装配.md`;
- read the current `profit-margin-stardew` ProjectInterfaceSpec as the up-to-date existing spec pattern and independently rechecked its source-sensitive values in this checkout;
- inspected `package.json`, `next.config.ts`, `src/blog` identities/registry/copy/home state, dynamic routes, i18n route registry, metadata, JSON-LD, article shell, public picture, FAQ, sources, planner CTA, sitemap, robots, and dev script;
- inspected current blog/article tests, static-route tests, sitemap/robots/llms tests, public-page metadata/JSON-LD tests, image/AVIF tests, and production SEO smoke contract;
- counted current 19 slugs, 38 identity paths, 25 canonical paths, 50 localized entries, 48 indexable entries, 50 expected static files, 70 opaque WebP files, 70 AVIF derivatives, and 29 preview WebP files;
- read live production examples and confirmed the two target production routes currently return 404;
- confirmed no local listener on TCP 3003, no `out` directory, and no `node_modules` directory in this checkout.

Not run because this task is limited to read-only inspection plus one documentation write:

- `pnpm build`;
- `pnpm typecheck`;
- `pnpm test` or Vitest;
- `pnpm dev` or `pnpm start`;
- local ego-browser/browser QA;
- `pnpm seo:smoke`;
- asset sync, deployment, commit, push, or any external write.
