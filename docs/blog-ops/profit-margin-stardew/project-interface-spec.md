# Project interface spec: add one bilingual blog post (profit-margin-stardew)

This document is the interface contract for assembling one English and one Simplified Chinese Stardew Planner blog post. It describes the existing project surface and the bounded future write set; it is not an article brief, a public handoff, an AssemblyManifest, a preview, or deployment evidence.

Evidence date: 2026-09-22 (Asia/Shanghai).

The requested slug is locked to profit-margin-stardew. The current checkout has no matching article module, registry entry, public asset, handoff, or page-specific spec. Therefore titles, descriptions, body content, source links, figure names, dimensions, hashes, and other content facts below are not invented; they remain unconfirmed until a valid PublicBlogHandoff and actual media bindings arrive.

## Project and evidence status

| Item | Verified value |
|---|---|
| Current checkout | /Users/wusir/orca/workspaces/stardew planner/博客 |
| Production origin configured by source | https://stardewvalleyplanner.art |
| Package manager | pnpm 10.22.0; packageManager is pnpm@10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c |
| Node engine | >=20.9.0 |
| Next.js | 16.3.0 |
| Router | App Router |
| Output mode | Static export: output: "export" |
| Image optimizer | Disabled for export: images.unoptimized is true |
| Public locales | en and zh-CN |
| Chinese URL prefix | /zh, not /zh-CN |
| Local development address | http://127.0.0.1:3003 |
| Local dev command | pnpm dev, which delegates to scripts/dev.sh |
| Current listener observed | None on TCP 3003 during read-only inspection |
| Current out directory observed | Not present during read-only inspection |
| Browser/deployment evidence | Not collected in this task |

All values in this file that are labelled current are source/test observations from this checkout. A source URL or configured command is not proof that the deployed site or a live server currently has that state.

## Governing handoff and assembly rules

The inputs for a later page assembly are:

1. A valid PublicBlogHandoff for each locale, with locked UTF-8 body/AST, bodyHash, SEO values, public references, public requirements, and integrity data.
2. This verified ProjectInterfaceSpec.
3. Actual media bindings that resolve to files in the current project and pass the project media checks.

PublicBlogHandoff is the only public content handoff. Do not recreate an internal PageIntegrationRequest, research snapshot, SERP/PAA dump, private path, prompt, or internal brief as a public input. The assembler binds fields to the handoff and existing project interfaces; it does not rewrite, summarize, or silently fill missing content.

The later WritePageGrant must be scoped to this local project, the two requested locales, and the profit-margin-stardew page only. Deployment, external service writes, commit, push, and production changes are not implied by this spec. Missing or contradictory fields must be returned to the content/interface owner rather than guessed.

The implementation must preserve high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise names. Existing project conventions take precedence over a new abstraction.

## Next.js 16 guidance verified in this checkout

The relevant local guides were read under node_modules/next/dist/docs. The following observations are the constraints for a future implementation:

| Local guide | Verified implication |
|---|---|
| 01-app/02-guides/migrating/app-router-migration.md | App Router routes use special page.tsx files; pages are Server Components by default; generateStaticParams replaces getStaticPaths. |
| 01-app/03-api-reference/03-file-conventions/dynamic-routes.md | The existing [slug] segment supplies the slug to the page and metadata functions. In Next 16, params is a Promise and must be awaited. |
| 01-app/03-api-reference/03-file-conventions/page.md | A page is the leaf/public entry and needs a default-exported component; params and searchParams are promise-shaped in this version. |
| 01-app/03-api-reference/04-functions/generate-static-params.md | generateStaticParams returns the complete static parameter list before build for a static export. |
| 01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md | dynamicParams = false makes values not returned by generateStaticParams resolve to 404; the existing article routes already use this. |
| 01-app/02-guides/static-exports.md | output: "export" emits route HTML into out. Dynamic routes need generateStaticParams; dynamicParams = true is unsupported for static export. Without trailingSlash: true, a route such as /profit-margin-stardew is emitted as out/profit-margin-stardew.html. |
| 01-app/03-api-reference/03-file-conventions/public-folder.md | Files under the repository-root public directory are served from URL root, so public/blog/name.webp maps to /blog/name.webp. |
| 01-app/03-api-reference/02-components/image.md | next/image requires image metadata and has current preload semantics; this blog does not use it for article modules. Use the existing PublicPicture contract instead. |
| 01-app/03-api-reference/04-functions/generate-metadata.md | metadata and generateMetadata are Server Component APIs. Dynamic metadata may await params and can provide title, description, canonical alternates, Open Graph, and robots. |

Do not run next dev while editing AGENTS.md or CLAUDE.md in this task. Next's local generate-agent-files implementation confirms that dev can maintain those files; the requested write boundary excludes them.

## URL, locale, and dynamic-route contract

### Public URL pairs

| Locale | Locale value in code | Article pathname | Blog index |
|---|---|---|---|
| English | en | /profit-margin-stardew | /blog |
| Simplified Chinese | zh-CN | /zh/profit-margin-stardew | /zh/blog |

Canonical public pathnames have no trailing slash except /. The identity module intentionally exposes trailing-slash identity strings for registry/path comparisons, so these are different contracts:

- canonical URL: /profit-margin-stardew
- identity value: /profit-margin-stardew/
- canonical Chinese URL: /zh/profit-margin-stardew
- Chinese identity value: /zh/profit-margin-stardew/

The canonical URL is produced by createCanonicalUrl and is rejected when a non-root pathname has a trailing slash, query, fragment, backslash, or repeated slash.

### Current occupied slugs

The current src/blog/blog-post-identities.ts list is ordered oldest to newest:

1. carpenter-stardew
2. where-is-robin-stardew-valley
3. stardew-valley-npc
4. stardew-valley-town-map
5. where-is-stardew-valley-located
6. stardew-valley-expanded-bachelors-and-bachelorettes
7. sprinkler-stardew
8. glasshouse-stardew-valley
9. oak-tree-stardew
10. stardew-valley-trees
11. maple-tree-stardew
12. best-spring-crop-stardew
13. how-to-earn-money-stardew
14. rancher-or-tiller-stardew
15. summer-crops-stardew
16. fall-crops-stardew
17. do-you-have-to-water-trees-stardew
18. how-to-level-up-farming-stardew
19. last-day-to-plant-stardew

profit-margin-stardew must be appended as item 20. It must not replace or reorder an occupied slug. The registry arrays for en and zh-CN must have this same index order.

The home state reverses the registry order for latest cards. If the target is registered, the default six latest cards are expected to begin with:

1. profit-margin-stardew
2. last-day-to-plant-stardew
3. how-to-level-up-farming-stardew
4. do-you-have-to-water-trees-stardew
5. fall-crops-stardew
6. summer-crops-stardew

The existing default visible count is 6 and the topic carousel page size is 12. The target article remains in the same existing topic unless the locked handoff explicitly supplies another topic.

### Existing route files

The shared route files are:

- app/(en)/[slug]/page.tsx
- app/zh/[slug]/page.tsx

Both routes already:

- export generateStaticParams from blogPostSlugs;
- export dynamicParams = false;
- receive params as Promise<{ slug: string }> and await it;
- validate the value with isBlogPostSlug;
- resolve the localized registry entry with getBlogPostBySlug;
- call notFound() for an unknown or missing post;
- call createPublicPageMetadata with the locale, canonical path, article title/description, Open Graph type article, cover social image, and index/follow robots;
- render PublicPageShell, BlogArticleContent, and Article JSON-LD.

Registering the slug is sufficient for routing. Do not create app/profit-margin-stardew/page.tsx or app/zh/profit-margin-stardew/page.tsx, and do not edit either shared route file for a normal article.

src/blog/blog-copy.ts is typed as a locale-by-slug record. The new slug must have both entries: en maps to /profit-margin-stardew and zh-CN maps to /zh/profit-margin-stardew. getLocalizedBlogPostHref fails fast when a locale/slug pair is absent, so a one-sided route is not an acceptable partial state.

### Route count transition

These counts are derived from current source, not from a build:

| Derived collection | Current | After registering item 20 |
|---|---:|---:|
| blogPostSlugs | 19 | 20 |
| blogPostCanonicalPaths (English + Chinese identity paths) | 38 | 40 |
| canonicalPublicPaths | 25 | 26 |
| localized public route entries | 50 | 52 |
| indexable/sitemap route entries | 48 | 50 |
| expected static route files | 50 | 52 |

The exact static files for the target are out/profit-margin-stardew.html and out/zh/profit-margin-stardew.html after a successful build; no out files exist in the current inspection state.

## Reusable public exports and types

The future implementation should use these existing public interfaces instead of reaching into internal registry state:

| Module | Reusable exports and contract |
|---|---|
| src/blog/blog-post-identities.ts | blogPostSlugs, BlogPostSlug, blogPostCanonicalPaths, isBlogPostSlug |
| src/blog/blog-post-registry.tsx | BlogPostMeta, LocalizedBlogPost, validateBlogPostRegistry, getAllBlogPosts, getAllBlogPostMeta, getBlogPostBySlug; also re-exports the identity exports |
| src/blog/blog-copy.ts | BlogCopy, getBlogCopy, getLocalizedBlogPostHref, getLocalizedBlogArchiveHref, formatBlogReadTime |
| src/blog/blog-home-state.ts | BlogHomeSearchParameters, BlogHomeState, topicArticlesPageSize, filterBlogPostsByTitle, paginateBlogPosts, getBlogHomeState, buildBlogHomeHref |
| src/i18n/public-route-registry.ts | PublicCanonicalPath, LocalizedPublicRouteEntry, canonicalPublicPaths, indexableCanonicalPublicPaths, getLocalizedPublicPath, getLocalizedPublicRouteEntries, getLocalizedIndexablePublicRouteEntries, createPublicLanguageAlternates |
| src/seo/public-site-url.ts | publicSiteUrl and createCanonicalUrl |
| src/seo/page-metadata.ts | PublicPageMetadataInput and createPublicPageMetadata |
| src/seo/page-structured-data.ts | ArticleStructuredDataInput, serializeJsonLd, createArticleStructuredData |
| src/components/public-picture.tsx | PublicPictureProperties, createPublicAvifSource, PublicPicture |
| src/components/blog/blog-article-content.tsx | BlogArticleContent, the shared article header/body shell |
| src/components/blog/blog-sources.tsx | BlogSourceItem and BlogSources; source items are public links and the component adds the existing planner CTA |
| src/components/blog/blog-faq-list.tsx | BlogFaqItem and BlogFaqList; use only when the public handoff requires an on-page FAQ |

Do not expose registry internals, private research IDs, body hashes, or internal prompts through these public interfaces.

## Registry and article-module contract

### BlogPostMeta

Each locale entry must provide:

- slug: the BlogPostSlug value profit-margin-stardew;
- title: non-empty localized title from the handoff;
- description: non-empty localized description from the handoff;
- topic: non-empty localized topic, normally the existing Stardew Valley Guides / 星露谷物语指南 convention unless the handoff locks another value;
- author: non-empty localized author, normally the existing Stardew Valley Planner Team / 星露谷规划器团队 convention unless the handoff locks another value;
- readTimeMinutes: a positive integer;
- coverImage.src: a non-empty public path ending in .webp;
- coverImage.alt: a meaningful trimmed alt string; the existing validator requires at least eight characters;
- featured: an explicit boolean consistent with the current registry, not an inferred value.

The current registry uses a separate component for each locale. Planned export names, following the current precise naming convention, are:

- ProfitMarginStardewEnglishArticle
- ProfitMarginStardewChineseArticle

These names are planned interfaces for the future article modules, not evidence that those files currently exist.

Create two independent Server Component modules:

- src/blog/articles/profit-margin-stardew.en.tsx
- src/blog/articles/profit-margin-stardew.zh.tsx

Each module should render only the article body. The shared page shell supplies the page-level H1, title/description header, author, reading time, and cover. Do not add a second H1 in the body. Use semantic H2/H3 headings, existing table wrappers for wide tables, existing internal link conventions, and explicit external source links from the handoff. Do not introduce a markdown runtime, a new article abstraction, or a second page template.

The registry changes must be append-only for this target:

- import the two article functions;
- append the English object after last-day-to-plant-stardew;
- append the Chinese object at the matching index;
- keep all existing article objects byte-for-byte untouched;
- let validateBlogPostRegistry fail fast on a missing locale, bad order, duplicate, invalid metadata, or non-function Content.

The exact title, description, read time, cover path, cover alt, topic, author, and featured flag remain unconfirmed until handoff validation.

### Public handoff fields needed before assembly

For each locale, the handoff must supply or explicitly lock:

- locale and country/language interpretation;
- normalized NFC UTF-8 body or AST and deterministic bodyHash;
- Title, H1, Description, and slug;
- any required FAQ, schema, Open Graph, CTA, internal links, and media text;
- public source references with href, label, optional note, and any checked/date label;
- page slots and required body figures;
- actual asset URLs or local public paths, dimensions, alt text, captions, attribution, and licensing/usage status;
- integrity data sufficient for the consumer to recheck the content.

Do not put raw research snapshots, private filesystem paths, internal IDs, or this ProjectInterfaceSpec into the public handoff. The consumer must recheck the body hash and all public media bindings.

## Metadata, canonical, and structured-data contract

The dynamic route should continue to use createPublicPageMetadata with:

- locale en or zh-CN;
- canonicalPath /profit-margin-stardew;
- the exact localized title and description from BlogPostMeta;
- openGraphType: article;
- socialImagePath equal to the registered cover path;
- robots with index: true and follow: true.

createPublicPageMetadata supplies:

- the localized canonical URL;
- en, zh-CN, and x-default language alternates;
- Open Graph title, description, type, URL, and image;
- Twitter summary card fields;
- the supplied robots value.

The article route currently emits createArticleStructuredData and serializeJsonLd. The current structured data type is Article with headline, description, canonical URL, inLanguage, and isPartOf the public WebSite. The route does not currently emit author, datePublished, publisher, BlogPosting, or FAQPage fields. Do not add a new JSON-LD type unless the validated handoff and a separate project interface change explicitly require it. An on-page BlogFaqList is not evidence that FAQPage JSON-LD should be emitted.

Sitemap and robots are source-derived:

- app/sitemap.ts consumes getLocalizedIndexablePublicRouteEntries;
- app/robots.ts supplies the existing robots contract;
- the new slug must enter these outputs through blogPostSlugs and the route registry;
- contact remains excluded from indexable/sitemap entries.

public/llms.txt is a source document copied into out/llms.txt by the static build. It must receive only the verified English and Chinese public links and descriptions supplied by the handoff. Do not write guessed title or description text.

## Media and rendering contract

### PublicPicture

Article media uses src/components/public-picture.tsx, not next/image. PublicPicture:

- requires src to be a non-empty path ending in .webp;
- derives the sibling .avif path with createPublicAvifSource;
- renders a picture element with an AVIF source and a native img fallback;
- requires a meaningful alt string;
- accepts normal img properties including width, height, decoding, loading, and project data attributes.

Every new public WebP must have a same-stem AVIF sibling. A missing sibling is a broken media contract even when the WebP itself exists.

### Dimensions, format, and budgets

Current tests establish the following project media expectations:

- article cover and in-body figure: 1672 × 941, 16:9;
- the shared article cover contract passes width 1672 and height 941 to the rendered image;
- cover and figure WebP: lossy VP8 WebP with a VP8 chunk, not VP8L or VP8X;
- current cover budget: at most 1.25 MiB;
- current inline figure budget: at most 400 KiB;
- video poster, when used: 1280 × 720 and at most 100 KiB;
- current source scan counts 70 WebP files under public/homepage and public/blog; after this target the expected count is 70 + 1 + n, where n is the number of newly locked in-body WebP figures or posters;
- every WebP under public/homepage and public/blog has a valid AVIF sibling;
- public/public-previews/1.6.15 is a separate preview fixture and must not receive article media.

The current public article asset roots are:

- public/blog
- public/blog/illustrations
- public/blog/video-posters

The repository also contains a legacy carpenter cover PNG; that does not change the current article contract. New target media must use the verified WebP plus same-stem AVIF format unless an explicit project interface change is approved.

The actual target cover, figures, posters, dimensions, byte budgets, alt text, captions, and attribution are unconfirmed until the handoff supplies them and the asset tests are updated.

### Loading and LCP

The shared BlogArticleContent cover is rendered in the article header and is not marked loading="lazy"; it is the LCP candidate and must be available at the first render. In-body figures should use PublicPicture with width and height 1672 and 941, decoding="async", and loading="lazy", unless a verified above-the-fold requirement says otherwise. Do not add lazy loading to the shared cover and do not mark every figure eager.

If the handoff requires a video, use the existing BlogYouTubeVideo component and its lazy poster/click-to-load behavior. Do not add a raw iframe or a new video component. A video is not required for this target unless the handoff contains one.

## Bounded future file map

This section defines the expected page-assembly write set after the user grants a scoped WritePageGrant. It does not authorize those writes in the current task.

### This task

The only allowed write is:

- docs/blog-ops/profit-margin-stardew/project-interface-spec.md

No other file was changed for this spec.

### Future create set, subject to handoff and grant

| Planned path | Purpose | Confirmation state |
|---|---|---|
| src/blog/articles/profit-margin-stardew.en.tsx | English article body | Planned; body and exact media slots unconfirmed |
| src/blog/articles/profit-margin-stardew.zh.tsx | Simplified Chinese article body | Planned; body and exact media slots unconfirmed |
| public/blog/<locked cover stem>.webp | Article cover | Filename and asset unconfirmed |
| public/blog/<locked cover stem>.avif | Cover AVIF sibling | Required when the cover WebP is locked |
| public/blog/illustrations/<locked figure stem>.webp | In-body figure(s), if required | Count and names unconfirmed |
| public/blog/illustrations/<locked figure stem>.avif | Figure AVIF sibling(s) | Required for each figure WebP |
| public/blog/video-posters/<locked poster stem>.webp | Video poster, only if required | Optional and unconfirmed |
| tests/blog/profit-margin-stardew-identity.test.ts | Slug, paired-locale, and locked-angle regression | Planned |

Angle-bracket path placeholders are not literal filenames. Do not create a placeholder asset, a guessed filename, or a cover-only article.

### Future edit set, subject to handoff and grant

| Path | Required change |
|---|---|
| src/blog/blog-post-identities.ts | Append profit-margin-stardew |
| src/blog/blog-copy.ts | Add en /profit-margin-stardew and zh-CN /zh/profit-margin-stardew |
| src/blog/blog-post-registry.tsx | Import both article modules and append both localized metadata entries |
| public/llms.txt | Add only verified bilingual public links/descriptions |
| tests/blog/blog-post-registry.test.ts | Add item 20 metadata, paths, cover, complete fixture, and count/order expectations |
| tests/blog/blog-home-state.test.ts | Update count, carousel, and newest-six expectations |
| tests/blog/blog-direct-reader-voice.test.tsx | Add both article modules to the direct-reader fixture |
| tests/blog/blog-sources.test.tsx | Add exact source href/label/note/order/heading/checked-label expectations |
| tests/blog/blog-article-content.test.tsx | Only if a target-specific shared contract requires a fixture; otherwise regression only |
| tests/i18n/public-route-registry.test.ts | Update canonical/localized/indexable counts and target path assertions |
| tests/seo/canonical-public-routes.test.ts | Add target canonical path and count |
| tests/routes/blog-routes.test.tsx | Add paired index href and metadata assertions |
| tests/routes/static-routes.test.ts | Add the two expected target static HTML files |
| tests/routes/static-public-pages.test.ts | Add both article fixtures with Article-only schema and exact handoff phrases/links |
| tests/routes/removed-public-pages.test.ts | Update the derived canonical/localized/indexable count expectations |
| tests/routes/sitemap-robots.test.ts | Add the two sitemap pathnames and count |
| tests/routes/llms.test.ts | Add exact bilingual target link/content assertions |
| tests/assets/blog-cover-images.test.ts | Add target cover/figure expectations with actual dimensions and budgets |
| tests/assets/public-avif-assets.test.ts | Update expected WebP count based on actual added files and AVIF siblings |

The following files should remain untouched for a normal post because they derive from the identity/registry:

- app/(en)/[slug]/page.tsx
- app/zh/[slug]/page.tsx
- app/sitemap.ts
- app/robots.ts
- src/i18n/public-route-registry.ts
- src/seo/page-metadata.ts
- src/seo/page-structured-data.ts
- src/components/blog/blog-article-content.tsx
- src/components/blog/blog-faq-list.tsx
- src/components/blog/blog-sources.tsx
- src/components/blog/article-card.tsx

tests/routes/public-route-metadata.test.ts already loops over blogPostSlugs and should be run as a regression; it does not need a hardcoded target edit unless a verified new assertion is required.

Do not modify existing article modules, occupied assets, unrelated tests, app layout, CSS, package.json, lockfiles, AGENTS.md, CLAUDE.md, docs/seo/cluster-plan.json, or any other document as a substitute for the target handoff.

### Hard write boundary for this dispatched task

For this dispatched task, even the future create/edit set above is descriptive only. The actual allowlist is exactly the target spec file. app, src, public, package.json, lockfiles, existing article files, tests, scripts, and all unrelated docs are forbidden write targets. Do not create temporary HTML, Markdown previews, screenshot fixtures, build output, or generated route files.

## Commands and verification contract

### Existing package scripts

The following scripts were read from package.json:

| Purpose | Command | State in this task |
|---|---|---|
| Development | pnpm dev | Not run; scripts/dev.sh manages port 3003 |
| Static build | pnpm build | Not run; can create out and Next artifacts |
| Static serving | pnpm start | Not run; serves out with serve and does not specify a project port |
| Type check | pnpm typecheck | Not run; TypeScript incremental metadata may be written |
| Full test wrapper | pnpm test | Not run; pretest invokes pnpm build |
| Focused tests | pnpm exec vitest run <test files> | Not run |
| Production SEO smoke | pnpm seo:smoke | Not run; makes external HTTPS GET requests and uses a stale contract noted below |
| Asset sync | pnpm assets:sync | Not run; not needed and may write assets |

Only read-only inspection commands were run for this task. In particular, no build, typecheck, Vitest, dev server, static server, browser session, external smoke test, asset sync, deployment, or commit was run.

### Focused source/regression checks for a later implementation

After the future source and fixture edits are granted, run the source-level checks without the build wrapper:

    pnpm typecheck

    pnpm exec vitest run tests/blog/profit-margin-stardew-identity.test.ts tests/blog/blog-post-registry.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-direct-reader-voice.test.tsx tests/blog/blog-sources.test.tsx tests/blog/blog-article-content.test.tsx tests/assets/blog-cover-images.test.ts tests/assets/public-avif-assets.test.ts tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/routes/blog-routes.test.tsx tests/routes/public-route-metadata.test.ts

Because pnpm test runs pretest and therefore builds first, use the explicit Vitest command for a no-build focused run. Do not claim a full build or full test from this focused set.

Then run the static-export checks:

    NEXT_TELEMETRY_DISABLED=1 pnpm build

    pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/removed-public-pages.test.ts

Inspect the actual outputs:

- out/profit-margin-stardew.html
- out/zh/profit-margin-stardew.html
- out/llms.txt
- out/sitemap.xml
- out/robots.txt

The build proves local static output only. It does not prove deployment, indexing, CDN cache state, or Google rich-result eligibility.

### SEO smoke limitation

The available command is:

    pnpm seo:smoke

It invokes scripts/production-seo-smoke.mjs against https://stardewvalleyplanner.art. That script checks HTTPS origin behavior, statuses, canonical/hreflang, robots, content types, security headers, sitemap, and a missing-page probe. The read-only inspection found that scripts/production-seo-smoke-contract.mjs still hardcodes an older subset of paths (16 canonical paths / 32 public HTML contracts / 30 sitemap paths) while current source derives 25 canonical paths / 50 localized routes / 48 indexable routes. It also does not know profit-margin-stardew. Therefore this command must not be reported as complete coverage for this target until its contract is separately brought current; that file is outside this task's write boundary.

## Local development and browser acceptance

scripts/dev.sh defines DEV_PORT=3003, frees that port before starting Next, and runs next dev --port 3003. Before a later browser run:

1. Inspect lsof -nP -iTCP:3003 -sTCP:LISTEN and verify the listener belongs to this checkout.
2. If a healthy server for this checkout already serves 3003, reuse it. Starting pnpm dev can terminate an existing listener on that port.
3. If a new server is authorized, start pnpm dev and retain its actual PID/log evidence.
4. Use the local ego-browser for real page evidence, not a temporary HTML file.

Open and record both real article URLs:

- http://127.0.0.1:3003/profit-margin-stardew
- http://127.0.0.1:3003/zh/profit-margin-stardew

Also inspect both blog indexes:

- http://127.0.0.1:3003/blog
- http://127.0.0.1:3003/zh/blog

For desktop and mobile viewport sizes, verify all of the following for both locales:

- HTTP status is 200 and the route is not a fallback or 404;
- html lang is en and zh-CN respectively;
- exactly one page-level H1 is visible;
- title, description, topic, author, read-time, and cover match the locked localized handoff;
- body is complete, readable, and contains no internal IDs, prompts, private paths, or raw research text;
- headings and any Table of Contents links land on the correct sections;
- tables use the existing horizontal-scroll treatment without viewport overflow;
- every visible image loads, has the locked alt/caption, has the correct crop and clarity, and has a 200 response for its AVIF/WebP source;
- the cover is not lazy-loaded; non-LCP figures are lazy-loaded;
- required source links, checked label, FAQ accordion, planner CTA, and internal links match the handoff;
- language switch links to the paired target path;
- navigation, footer, typography, spacing, color, focus states, and responsive layout match the existing public shell;
- no unexpected console/runtime error is introduced.

For the static build, additionally inspect the generated HTML for canonical, hreflang, robots, Article JSON-LD, and absence of accidental trailing-slash canonical URLs. Browser proof is local page proof only and must be reported separately from build, live origin, deployment, and indexing evidence.

## Unconfirmed items and stop conditions

The following are intentionally not resolved by this interface spec:

| Item | Required confirmation |
|---|---|
| PublicBlogHandoff | A valid bilingual handoff with bodyHash and integrity fields |
| Title, H1, description, topic, author, read time | Exact localized values from the handoff |
| Cover path and asset | Actual WebP, AVIF sibling, dimensions, bytes, alt, crop, attribution |
| In-body figures | Exact count, filenames, dimensions, bytes, alt, captions, attribution, and usage rights |
| Video | Whether one is required; poster and provider data if so |
| Body structure | H2/H3/table/FAQ/source/CTA slots and exact text |
| Source references | Exact href, labels, notes, order, and checked/date label |
| Schema additions | Whether the handoff requests anything beyond the current Article JSON-LD; do not infer FAQPage |
| Country/locale wording | The handoff's locale/country interpretation for each public version |
| WritePageGrant | Explicit scope for this project, locales, and target page |
| Current server/browser state | Must be checked immediately before a later QA run |
| Live production state | Requires separate authorized external readback |
| SEO smoke contract | Must be reconciled separately; it is stale and outside this write scope |
| Target canary/negative assertion | No target-specific canary was found in this checkout; add only a verified one |

Stop and return to the content/interface owner if any required field is missing, a media URL is not an actual project asset, a hash does not verify, a locale pair diverges without authorization, or a requested change exceeds the bounded file map. Do not make a “best effort” page from guessed metadata or media.

## Read-only verification log

Read-only checks completed:

- confirmed current working directory and branch;
- confirmed clean initial worktree;
- read AGENTS.md and CLAUDE.md;
- read the two V7 workflow/handoff documents;
- read the local Next.js 16.3.0 guides listed above;
- inspected package.json, next.config.ts, tsconfig.json, and scripts/dev.sh;
- inspected current identities, registry, localized copy, dynamic routes, route registry, metadata, structured data, article shell, picture/source/FAQ components, assets, and relevant tests;
- inspected available SEO smoke scripts/contracts;
- checked that no target-specific handoff/article files were present;
- checked that no listener was active on port 3003.

Not run because this task is limited to read-only checks and a single documentation write:

- pnpm build;
- pnpm typecheck;
- pnpm test or Vitest;
- pnpm dev or pnpm start;
- ego-browser/browser QA;
- pnpm seo:smoke;
- deployment, commit, push, or any external write.
