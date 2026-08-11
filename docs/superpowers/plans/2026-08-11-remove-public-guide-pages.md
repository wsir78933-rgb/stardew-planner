# Remove Public Guide Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the English and Chinese farm comparison, mods, and all eight official farm guide pages without changing any planner farm type, map, asset, selector, or query parameter behavior.

**Architecture:** Delete the page-level routes and derive the remaining canonical, localized, Sitemap, navigation, and discovery contracts from the smaller public route registry. Remove every internal link to the deleted pages while leaving planner-owned map catalogs and editor code untouched. Verify the boundary from both static export artifacts and planner-focused regression tests.

**Tech Stack:** Next.js 16.3 static export, React 19, TypeScript 5.9, Vitest 3.2, pnpm 10.

## Global Constraints

- Delete exactly 20 public routes: `/farm-comparison`, `/mods`, all eight `/farm/<type>` guides, and their `/zh` equivalents.
- Do not modify planner farm types, map catalogs, editor components, map assets, or `farmType` query behavior.
- Remove every navigation, footer, homepage, blog, discovery, metadata, and structured-data link to the deleted routes.
- Deleted routes must not be exported and must resolve through the existing static 404 behavior.
- The final Sitemap must contain exactly 14 URLs.
- Preserve the original checkout's uncommitted changes by working only in this isolated worktree.
- Do not commit, push, deploy, or change Cloudflare.

---

### Task 1: Lock the removed-route contract with failing tests

**Files:**
- Modify: `tests/i18n/public-route-registry.test.ts`
- Modify: `tests/routes/static-routes.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`
- Modify: `tests/routes/llms.test.ts`
- Modify: `tests/components/site-footer.test.tsx`
- Modify: `tests/homepage/homepage-farm-guide-links.test.tsx`
- Modify: `tests/routes/planner-editor-page.test.tsx`

**Interfaces:**
- Consumes: current route registry, static export artifacts, navigation/footer rendering, and planner farm options.
- Produces: literal expectations for 8 canonical content identities, 14 Sitemap URLs, zero deleted HTML files, zero deleted public links, and unchanged planner farm support.

- [ ] Update literal route and artifact expectations to the confirmed smaller public surface.
- [ ] Run the affected tests and verify they fail because the 20 pages and their links still exist.
- [ ] Keep the planner assertion at all eight official farm types so accidental editor removal fails independently.

### Task 2: Remove page routes and public route identities

**Files:**
- Delete: `app/(en)/farm-comparison/page.tsx`
- Delete: `app/zh/farm-comparison/page.tsx`
- Delete: `app/(en)/mods/page.tsx`
- Delete: `app/zh/mods/page.tsx`
- Delete: `app/(en)/farm/[type]/page.tsx`
- Delete: `app/zh/farm/[type]/page.tsx`
- Modify: `src/i18n/public-route-registry.ts`

**Interfaces:**
- Consumes: blog identities, legal pages, contact route, and locale path rules.
- Produces: `canonicalPublicPaths` with only `/`, legal/contact, blog indexes, and two article slugs; `indexableCanonicalPublicPaths` with contact excluded.

- [ ] Remove the page files so Next.js no longer owns any targeted route.
- [ ] Remove comparison, mods, and farm guide identities from the canonical route registry.
- [ ] Run route-registry and metadata-focused tests until the smaller contract passes.

### Task 3: Remove internal discovery paths without touching the planner

**Files:**
- Modify: `src/reference/public-navigation.ts`
- Modify: `src/site-footer/site-footer-content.ts`
- Modify: `src/components/homepage-content.tsx`
- Delete: `src/components/homepage-farm-guide-links.tsx`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `src/blog/articles/carpenter-stardew.en.tsx`
- Modify: `src/blog/articles/carpenter-stardew.zh.tsx`
- Modify: `src/blog/articles/where-is-robin-stardew-valley.en.tsx`
- Modify: `src/blog/articles/where-is-robin-stardew-valley.zh.tsx`
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: localized home, blog, legal, and contact routes.
- Produces: public navigation and prose with no links to any deleted page.

- [ ] Remove comparison/mods navigation and footer items.
- [ ] Remove the homepage guide section because every destination is deleted.
- [ ] Rewrite article sentences minimally so they point only to the planner or surviving articles.
- [ ] Remove all 20 deleted URLs from `llms.txt`.
- [ ] Scan source and rendered output for deleted internal hrefs.

### Task 4: Align static, SEO, and delivery contracts

**Files:**
- Modify: `scripts/production-seo-smoke-contract.mjs`
- Modify: route, metadata, structured-data, Sitemap, LLMS, navigation, footer, homepage, blog, and static export tests that enumerate deleted pages.
- Preserve: `src/maps/map-catalog.ts`, planner/editor components, public map assets, and planner tests except for assertions proving the boundary.

**Interfaces:**
- Consumes: the final 16 public HTML route list and 14 indexable route list.
- Produces: build/test contracts that reject reintroduction of any deleted public page without rejecting planner support for the same farm types.

- [ ] Update only tests and scripts whose public route expectations changed.
- [ ] Run affected Vitest files until green.
- [ ] Run `pnpm typecheck` and fix only page-removal type fallout.

### Task 5: Build and verify the final artifact

**Files:**
- Verify: `out/sitemap.xml`
- Verify: `out/**/*.html`
- Verify: generated `next-env.d.ts` is restored to its tracked form.

**Interfaces:**
- Consumes: the production static export.
- Produces: evidence that 20 routes are absent, 14 Sitemap URLs remain, all surviving internal links resolve, and planner support is unchanged.

- [ ] Run `NEXT_TELEMETRY_DISABLED=1 pnpm build`.
- [ ] Run affected tests, full Vitest, and `pnpm typecheck`.
- [ ] Parse `out/sitemap.xml` and assert exactly 14 URLs with no deleted path.
- [ ] Assert no targeted English or Chinese HTML artifact exists.
- [ ] Crawl every surviving internal anchor against the exported artifacts.
- [ ] Run planner-focused tests that cover all eight farm options and `farmType` state.
- [ ] Run an independent code and regression review; do not commit or push.
