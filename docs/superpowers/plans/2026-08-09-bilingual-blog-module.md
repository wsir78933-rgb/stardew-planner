# Bilingual Blog Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. The controller owns orchestration and independent review. Workers must not commit, stage, push, deploy, or edit the original `main` checkout.

**Goal:** Add an English and Simplified Chinese static blog module with two researched articles, root-level canonical article URLs, original cover illustrations, archive/search/topic behavior, accessible table of contents, and complete static SEO discovery.

**Architecture:** The blog domain lives under `src/blog/` and exposes validated post identities, localized metadata, pure query/pagination functions, and article components through explicit interfaces. Next.js App Router pages remain thin composition layers: `/blog` and `/blog/archive` are fixed routes, while the approved English root `app/(en)/[slug]` and Chinese `app/zh/[slug]` routes enumerate only the two registered slugs with `generateStaticParams()` and reject everything else with `dynamicParams = false`. Existing public-route, metadata, sitemap, `llms.txt`, shell, and frozen planner-runtime boundaries remain intact.

**Tech Stack:** Next.js 16.3.0 App Router static export, React 19.2.8, TypeScript 5.9 strict mode, Tailwind CSS 4 via the existing global stylesheet, Vitest 3.2.4, built-in image generation for original bitmap cover assets.

## Global Constraints

- English URLs have no `/en` prefix.
- English article canonicals are `/carpenter-stardew` and `/where-is-robin-stardew-valley`; Chinese counterparts add only `/zh`.
- Blog hubs are `/blog`, `/blog/archive`, `/zh/blog`, and `/zh/blog/archive`.
- Do not add Blog to the existing top navigation or footer navigation.
- Use local TypeScript/TSX content only. Do not add CMS, database, MDX, Markdown parser, content API, authentication, comments, subscriptions, tags, or unrelated infrastructure.
- Use original project-owned cover illustrations. Do not copy Hotjar, Kitchen, Stardew Valley game art, competitor screenshots, trademarks, or protected assets.
- Treat Stardew Valley 1.6.15 as the factual publication baseline. Link factual claims to the official Stardew Valley Wiki or developer release source; do not invent prices, schedules, tool capabilities, or version facts.
- Follow high cohesion, low coupling, single responsibility, interface boundaries, KISS, Fail Fast, YAGNI, and precise names. Do not use names such as `data`, `temp`, `helper`, `util`, or `manager`.
- Write a failing behavior test and observe the expected failure before each production behavior. Tests must exercise real functions/components and use hand-derived expectations.
- Preserve the two unrelated baseline failures in `tests/homepage/homepage-style-contract.test.ts` and `tests/routes/public-page-style-contract.test.ts`; do not edit their product area.
- Do not commit, stage, push, deploy, modify Feishu, or change the main checkout during isolated worktree implementation.

---

### Task 1: Blog identities, validation, filtering, and pagination

**Files:**

- Create: `src/blog/blog-post-identities.ts`
- Create: `src/blog/blog-post-registry.tsx`
- Create: `src/blog/blog-home-state.ts`
- Create: `src/blog/blog-archive-state.ts`
- Create: `tests/blog/blog-post-registry.test.ts`
- Create: `tests/blog/blog-home-state.test.ts`
- Create: `tests/blog/blog-archive-state.test.ts`

**Interfaces:**

- Produce `blogPostSlugs`, `BlogPostSlug`, `blogPostCanonicalPaths`, and `isBlogPostSlug(value)`.
- Produce `BlogPostMeta`, `LocalizedBlogPost`, `validateBlogPostRegistry(posts)`, `getAllBlogPosts(locale)`, and `getBlogPostBySlug(locale, slug)`.
- Produce `getBlogHomeState(posts, searchParameters)`, `buildBlogHomeHref(locale, searchParameters)`, `filterBlogPostsByTitle(posts, query)`, `paginateBlogPosts(posts, page, pageSize)`, and `getBlogArchiveState(posts, pageParameter)`.
- Locale values are the existing `PublicLocale` union: `"en" | "zh-CN"`.

- [ ] **Step 1: Write registry tests that fail because the blog modules do not exist**

  Cover the exact two slugs, paired EN/ZH metadata, canonical array order, required non-empty strings, positive integer read time, meaningful cover alt text, missing localization, and duplicate slug. Every validation error must contain the rejected slug or field value.

- [ ] **Step 2: Run the registry test and verify RED**

  Run: `pnpm vitest --run tests/blog/blog-post-registry.test.ts`

  Expected: FAIL because `src/blog/blog-post-registry.tsx` is missing.

- [ ] **Step 3: Implement the smallest validated registry boundary**

  Use these exact slugs in this order:

  ```ts
  export const blogPostSlugs = [
    "carpenter-stardew",
    "where-is-robin-stardew-valley",
  ] as const;
  ```

  Each post exposes `slug`, `title`, `description`, `topic`, `author`, `readTimeMinutes`, `coverImage`, `featured`, and `Content`. The registry order is the only canonical order. Both posts are featured; use `Stardew Valley Planner Team` for English author copy and `星露谷规划器团队` for Chinese.

- [ ] **Step 4: Run the registry test and verify GREEN**

  Run: `pnpm vitest --run tests/blog/blog-post-registry.test.ts`

  Expected: PASS with zero warnings.

- [ ] **Step 5: Write home/archive state tests and verify RED**

  Cover 0 and 2 real posts, unknown topic, case-insensitive title search, invalid `visible`, four same-topic fixtures, more than six matching fixtures, query preservation in links, canonical order, and archive sizes 0/1/9/10/18/19 with page counts 0/1/1/2/2/3.

  Run: `pnpm vitest --run tests/blog/blog-home-state.test.ts tests/blog/blog-archive-state.test.ts`

  Expected: FAIL because state functions do not exist.

- [ ] **Step 6: Implement pure state functions and verify GREEN**

  Normalize `visible` to 6 unless it is a positive integer; normalize invalid archive pages to page 1 and over-large pages to the final page. Only serialize non-empty `q`, non-empty `topic`, and non-default `visible`. No function may sort posts or mutate its input.

  Run: `pnpm vitest --run tests/blog/blog-home-state.test.ts tests/blog/blog-archive-state.test.ts tests/blog/blog-post-registry.test.ts`

  Expected: PASS.

### Task 2: Bilingual article content and factual source boundary

**Files:**

- Create: `src/blog/articles/carpenter-stardew.en.tsx`
- Create: `src/blog/articles/carpenter-stardew.zh.tsx`
- Create: `src/blog/articles/where-is-robin-stardew-valley.en.tsx`
- Create: `src/blog/articles/where-is-robin-stardew-valley.zh.tsx`
- Create: `tests/blog/blog-article-content.test.tsx`
- Modify: `src/blog/blog-post-registry.tsx`

**Interfaces:**

- Produce one React Server Component per article/locale pair.
- Every body accepts no props, contains semantic `h2`/`h3` sections, exposes factual source links, and leaves the unique `h1` to the article page shell.
- The registry binds each locale to its matching component without importing component internals elsewhere.

- [ ] **Step 1: Write render tests and verify RED**

  Hand-check that each component renders substantial locale-appropriate prose, no internal `h1`, the 1.6.15 version boundary, official Wiki source links, a natural planner CTA, and valid internal links. Assert EN/ZH section-count parity for each slug and reject the misspelled supporting keyword `robin locati0n stardew` from visible copy.

  Run: `pnpm vitest --run tests/blog/blog-article-content.test.tsx`

  Expected: FAIL because article components are missing.

- [ ] **Step 2: Draft the English carpenter article and its Chinese counterpart**

  English H1 metadata: `Carpenter in Stardew Valley: Robin's Shop, Hours, and Building Services`.

  Cover the direct answer, 24 Mountain Road, regular 09:00–17:00 service window, Tuesday/rain and Friday 16:00 boundaries, shop-versus-house distinction, construction/upgrade services, planning before ordering, and a concise closure checklist. Do not reproduce a complete inventory or cost table.

- [ ] **Step 3: Draft the English Robin-location article and its Chinese counterpart**

  English H1 metadata: `Where Is Robin in Stardew Valley? Location, Hours, and Schedule`.

  Open with the direct location answer, then present a deterministic “why Robin is missing” sequence covering construction, rain, Tuesday, Friday after 16:00, and special days. Keep relationship gifts and biography outside scope. Link the planner CTA to `/` or `/zh`, farm comparison to the localized comparison route, and Meadowlands guidance to the localized farm route.

- [ ] **Step 4: Run content tests and verify GREEN**

  Run: `pnpm vitest --run tests/blog/blog-article-content.test.tsx tests/blog/blog-post-registry.test.ts`

  Expected: PASS.

### Task 3: Blog presentation components and accessible client behavior

**Files:**

- Create: `src/blog/blog-copy.ts`
- Create: `src/blog/table-of-contents-state.ts`
- Create: `src/components/blog/article-card.tsx`
- Create: `src/components/blog/article-grid.tsx`
- Create: `src/components/blog/blog-landing-hero.tsx`
- Create: `src/components/blog/blog-discovery-controls.tsx`
- Create: `src/components/blog/blog-index-content.tsx`
- Create: `src/components/blog/blog-archive-content.tsx`
- Create: `src/components/blog/blog-article-content.tsx`
- Create: `src/components/blog/table-of-contents.tsx`
- Create: `src/components/blog/topic-carousel-controls.tsx`
- Create: `src/components/blog/blog-error.tsx`
- Create: `tests/blog/blog-components.test.tsx`
- Create: `tests/blog/table-of-contents-state.test.ts`

**Interfaces:**

- Server components receive computed state and localized copy through explicit props; they do not read URL state or registry internals.
- `createUniqueHeadingAnchors(headings)` returns stable anchors with `-2`, `-3` suffixes for duplicates.
- `TableOfContents` and `TopicCarouselControls` are the only client components.
- Every article card links through the existing localized route interface, not string concatenation in the component.

- [ ] **Step 1: Write component and heading-anchor tests and verify RED**

  Render real components to static markup. Assert one page-level `h1`, semantic links, localized labels, GET search controls, current-page pagination semantics, no empty carousel controls, and unique duplicate-heading anchors.

  Run: `pnpm vitest --run tests/blog/blog-components.test.tsx tests/blog/table-of-contents-state.test.ts`

  Expected: FAIL because components are missing.

- [ ] **Step 2: Implement the pure heading-anchor state and shared cards/grids**

  Slugify lowercase Unicode-aware heading text, collapse separator runs, use `section` when text has no usable characters, and suffix duplicates deterministically.

- [ ] **Step 3: Implement index, archive, article, TOC, carousel, and error presentation**

  Keep all URL/business state in Task 1 functions. The client TOC may query only the current article element for `h2,h3`, assign the precomputed unique IDs, update the current entry through `IntersectionObserver`, and remove its observer on cleanup. The carousel controls only scroll their received track element.

- [ ] **Step 4: Run component tests and verify GREEN**

  Run: `pnpm vitest --run tests/blog/blog-components.test.tsx tests/blog/table-of-contents-state.test.ts tests/blog/blog-home-state.test.ts tests/blog/blog-archive-state.test.ts`

  Expected: PASS.

### Task 4: App Router pages, public identities, metadata, sitemap, and LLM discovery

**Files:**

- Create: `app/(en)/blog/page.tsx`
- Create: `app/(en)/blog/archive/page.tsx`
- Create: `app/(en)/blog/error.tsx`
- Create: `app/(en)/[slug]/page.tsx`
- Create: `app/(en)/[slug]/error.tsx`
- Create: `app/zh/blog/page.tsx`
- Create: `app/zh/blog/archive/page.tsx`
- Create: `app/zh/blog/error.tsx`
- Create: `app/zh/[slug]/page.tsx`
- Create: `app/zh/[slug]/error.tsx`
- Modify: `src/i18n/public-route-registry.ts`
- Modify: `src/seo/page-metadata.ts`
- Modify: `public/llms.txt`
- Modify: `tests/i18n/public-route-registry.test.ts`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/llms.test.ts`
- Create: `tests/routes/blog-routes.test.tsx`

**Interfaces:**

- `canonicalPublicPaths` includes `/blog`, `/blog/archive`, `/carpenter-stardew`, and `/where-is-robin-stardew-valley` without changing navigation entries.
- English and Chinese dynamic pages both return exactly `blogPostSlugs.map((slug) => ({ slug }))`, export `dynamicParams = false`, validate `params.slug`, call `notFound()` for unknown values, and use the registered localized article.
- Page metadata uses the localized post title/description, canonical, paired `en`/`zh-CN`/`x-default` alternates, `openGraph.type = "article"`, and each post’s own cover image.

- [ ] **Step 1: Extend route/metadata tests first and verify RED**

  Assert 18 canonical identities, 36 localized routes, 34 indexable routes, exact root article URLs with no `/en`, paired alternates, exact static params, `dynamicParams = false`, and no new top-navigation entry.

  Run: `pnpm vitest --run tests/i18n/public-route-registry.test.ts tests/routes/public-route-metadata.test.ts tests/routes/blog-routes.test.tsx tests/routes/llms.test.ts`

  Expected: FAIL because routes are not registered and pages do not exist.

- [ ] **Step 2: Implement public identities and metadata cover-image support**

  Extend `PublicPageMetadataInput` with optional `socialImagePath`; resolve it against `publicSiteUrl`, and retain the existing shared social image when omitted. Do not change existing page outputs.

- [ ] **Step 3: Implement thin EN/ZH page modules**

  Blog pages compute registry/query state and delegate rendering. Root dynamic pages validate the exact slug before lookup. Use `PublicPageShell` for language switching and existing site shell semantics; do not add a Blog item to the navigation copy.

- [ ] **Step 4: Update `llms.txt` and run route tests GREEN**

  Add all eight localized blog URLs under their existing language sections with concise descriptions.

  Run: `pnpm vitest --run tests/i18n/public-route-registry.test.ts tests/routes/public-route-metadata.test.ts tests/routes/blog-routes.test.tsx tests/routes/llms.test.ts`

  Expected: PASS.

### Task 4.5: Static-export URL state bridge for approved discovery behavior

**Reason for correction:**

Next static export emits one HTML/RSC payload per pathname and does not rerender a Server
Component for `?q=`, `?topic=`, `?visible=`, or `?page=` after deployment. The approved
search, topic filtering, load-more, and archive pagination therefore require a minimal
client boundary that derives existing Task 1 state from `window.location.search` after
hydration. This is a correction to the original technical plan, not a new product feature.

**Scope:**

- Add one precise browser-location subscription hook and two client entry components: one
  for the blog index and one for the archive.
- Pass only serializable `BlogPostMeta` records across the client boundary; never pass the
  article `Content` function.
- Reuse `getBlogHomeState`, `getBlogArchiveState`, and existing link builders. Standard GET
  forms and links remain the navigation interface; do not add a state library or router
  abstraction.
- Update only the four EN/ZH index/archive route modules and the minimum shared blog types,
  components, and tests required by this boundary.
- Preserve static export, canonical URLs, server-rendered base content, JSON-LD, and all
  Task 4 SEO behavior.

**Verification:**

- Prove query-string parsing and serializable post projection with focused tests.
- Run all Task 1-4 focused blog/route tests, `pnpm typecheck`, and `pnpm build`.
- Browser acceptance later verifies reload behavior for EN/ZH search/topic state and URL
  persistence; archive pagination receives focused synthetic-state coverage because this
  release contains only two posts.

### Task 5: Original cover illustrations and scoped responsive styling

**Files:**

- Create: `public/blog/carpenter-stardew-cover.png`
- Create: `public/blog/where-is-robin-stardew-valley-cover.png`
- Modify: `app/globals.css`
- Create: `tests/assets/blog-cover-images.test.ts`
- Create: `tests/routes/blog-style-contract.test.ts`

**Interfaces:**

- Both cover images are landscape, contain no text, watermark, copied game sprites, copied character likeness, or third-party branding, and remain readable when cropped with `object-fit: cover`.
- All CSS is scoped under `[data-blog-page]` or `[data-blog-article]`; no blog rule may target the planner runtime root or generic global element selectors.

- [ ] **Step 1: Write asset/style tests and verify RED**

  Assert both named files exist, are decodable PNG images with equal dimensions and landscape aspect ratio, and each required blog viewport contract is expressed under the blog scope: 1 column below 768px, 2 columns at 768–1023px, 3 columns at 1024px+, sticky desktop TOC, visible focus states, and no horizontal overflow rule.

  Run: `pnpm vitest --run tests/assets/blog-cover-images.test.ts tests/routes/blog-style-contract.test.ts`

  Expected: FAIL because assets/styles do not exist.

- [ ] **Step 2: Generate the two original illustrations with the built-in image tool**

  Carpenter cover prompt: an original editorial illustration of a warm timber carpenter workshop beneath pine-covered mountains, tools and blueprint table in the foreground, generous clean composition, earthy green/ochre palette, no person likeness, no game sprites, no logos, no text, no watermark.

  Robin-location cover prompt: an original editorial landscape showing a clear winding path from a small farm edge through a village toward a mountain carpenter workshop, readable destination composition, earthy green/blue palette, no copied map, no game sprites, no logos, no text, no watermark.

  Save selected final outputs at the exact project paths above and inspect both before using them.

- [ ] **Step 3: Add scoped responsive CSS and verify GREEN**

  Follow the approved Hotjar-style content hierarchy and Kitchen-style whitespace without copying assets or branded tokens. Use the spec’s 390, 768, 1024, and 1440px acceptance widths.

  Run: `pnpm vitest --run tests/assets/blog-cover-images.test.ts tests/routes/blog-style-contract.test.ts tests/blog/blog-components.test.tsx`

  Expected: PASS.

### Task 6: Static export regression coverage and browser acceptance

**Files:**

- Modify: `tests/routes/static-routes.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`
- Modify: `tests/routes/sitemap-robots.test.ts`
- Restore after builds if changed: `next-env.d.ts`
- Create inside the plan’s ignored SDD workspace: browser evidence and final review report files only.

**Interfaces:**

- Expected static artifacts add `blog.html`, `blog/archive.html`, both English root article HTML files, and all four Chinese counterparts.
- Sitemap contains exactly 34 indexable localized URLs, no query strings, and all eight blog URLs.
- Static blog pages contain the correct first `<html lang>`, one `h1`, canonical, paired alternates, article/collection JSON-LD, original image path/alt text, and no eager reference-runtime bootstrap.

- [ ] **Step 1: Extend static artifact tests and verify RED**

  Run: `pnpm build && pnpm vitest --run tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts`

  Expected before page integration is complete: FAIL on missing blog artifacts. If previous tasks already produced the artifacts, prove the regression test by temporarily checking it against a deliberately nonexistent literal in the test, observe RED, then restore the approved literal before GREEN.

- [ ] **Step 2: Complete only the missing route/SEO integration required for GREEN**

  Do not edit the two baseline footer test areas. Restore `next-env.d.ts` to the repository’s pre-build imports after every production build so generated path churn is not part of the diff.

- [ ] **Step 3: Run focused and full automated verification**

  Run in order:

  ```bash
  pnpm typecheck
  pnpm build
  pnpm vitest --run tests/blog tests/routes/blog-routes.test.tsx tests/routes/blog-style-contract.test.ts tests/assets/blog-cover-images.test.ts tests/i18n/public-route-registry.test.ts tests/routes/public-route-metadata.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts tests/routes/llms.test.ts
  pnpm test --run
  git diff --check
  ```

  The focused suite must pass. The full suite may contain only the two recorded footer baseline failures and no blog/new failures.

- [ ] **Step 4: Run local production browser acceptance**

  Serve `out/` with the project’s existing `pnpm start` command on a verified free port. Check `/blog`, `/blog/archive`, both English articles, `/zh/blog`, `/zh/blog/archive`, both Chinese articles, and an unknown root slug. At 390, 768, 1024, and 1440px verify no horizontal overflow, correct grid columns, one `h1`, image aspect ratio, keyboard focus, search/filter links, archive pagination behavior, TOC anchor navigation/current state, language switching, console errors, hydration warnings, and the absence of planner-runtime interception.

- [ ] **Step 5: Run independent whole-branch review**

  Review the complete diff against this plan and the approved reference blog module specification. Any Critical or Important finding gets one subagent fix wave and one scoped re-review. Do not commit or push after review.

### Task 7: Temporary blog `noindex, follow` metadata

**Approved behavior:**

- Add `robots: { index: false, follow: true }` to all eight localized blog URLs: both blog indexes, both archives, and all four localized article pages.
- Keep all eight URLs in the sitemap exactly as requested.
- Preserve canonical URLs, language alternates, Open Graph, Twitter metadata, JSON-LD, `llms.txt`, navigation, footer, and planner behavior.

**Files:**

- Modify: `src/seo/page-metadata.ts`
- Modify: `app/(en)/blog/page.tsx`
- Modify: `app/(en)/blog/archive/page.tsx`
- Modify: `app/(en)/[slug]/page.tsx`
- Modify: `app/zh/blog/page.tsx`
- Modify: `app/zh/blog/archive/page.tsx`
- Modify: `app/zh/[slug]/page.tsx`
- Modify: `tests/seo/page-metadata.test.ts`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interface:**

- `PublicPageMetadataInput` gains one optional `robots` field using the Next.js `Metadata["robots"]` type.
- `createPublicPageMetadata` copies that field to the returned metadata without deriving route policy internally.
- Every blog route opts in explicitly with the same immutable `blogRobots` value; existing non-blog callers omit it and retain their current metadata.

- [x] **Step 1: Write failing metadata and static-output tests**

  Assert that the metadata factory preserves an explicit `{ index: false, follow: true }` value, all six route modules that generate the eight localized outputs return it, and final blog HTML contains `<meta name="robots" content="noindex, follow">`. Retain the existing sitemap assertions unchanged.

  Run: `pnpm vitest --run tests/seo/page-metadata.test.ts tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts`

  Expected: FAIL because blog metadata has no robots directive.

- [x] **Step 2: Add the minimal metadata input and explicit blog opt-ins**

  Add the optional typed field to the existing metadata factory and pass the shared `blogRobots` value from each blog page module. Do not infer noindex from pathname and do not add a second metadata abstraction.

- [x] **Step 3: Verify focused behavior and production output**

  Run in order:

  ```bash
  pnpm vitest --run tests/seo/page-metadata.test.ts tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts
  pnpm typecheck
  pnpm build
  git diff --check
  ```

  Expected: focused tests, typecheck, and build pass; sitemap remains unchanged; all eight generated blog HTML files contain `noindex, follow`; non-blog public pages do not gain the directive.

- [x] **Step 4: Refresh local preview and inspect representative EN/ZH routes**

  Restart the static server on `localhost:3001`, then verify `/blog`, `/carpenter-stardew`, `/zh/blog`, and `/zh/where-is-robin-stardew-valley` expose the robots directive while a non-blog public page does not.

  Do not stage, commit, push, or deploy.
