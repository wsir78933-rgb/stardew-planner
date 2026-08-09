# Bilingual Mod Map Content Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or execute each task inline with an explicit RED/GREEN checkpoint. Do not stage, commit, push, or deploy.

**Goal:** Rewrite the indexed English and Simplified Chinese `/mods` collection pages so all 21 supported community maps have verified, useful selection guidance instead of one-line descriptions.

**Architecture:** Keep the App Router pages as static Server Components. Extend the existing mod-card content boundary with explicit map kind, summary, best-fit guidance, planning note, and public source URL; keep locale-specific prose behind `getLocalizedModFarmCards(locale)`. Render the 18 farm maps and 3 SVE interiors as two semantic sections through the existing `ModMapCardGrid` component.

**Tech Stack:** Next.js 16.3.0 App Router static export, React 19.2.8 Server Components, TypeScript 5.9 strict mode, Vitest 3.2.4, existing global CSS design tokens.

## Global Constraints

- Preserve `/mods` and `/zh/mods`, all 21 map IDs, preview images, author names, planner query links, and canonical language alternates.
- English targets `Stardew Valley farm map mods`; Chinese targets `星露谷物语农场地图 Mod` naturally, without keyword stuffing.
- Separate 18 `community-farm` entries from 3 `community-interior` entries.
- Every entry must expose a verified summary, a clearly framed best-fit recommendation, a planner-specific note, and a source link.
- Public facts must come from author pages, Nexus Mods, SVE Wiki, or another attributable primary page. Inferences must be worded as planning guidance, not official Mod claims.
- Do not claim first-hand play experience, current compatibility, performance, installation behavior, or version support unless a current primary source confirms it.
- Use the existing public-page visual system. Add only route-scoped selectors needed for grouping and structured card copy.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.
- Use TDD for every behavior change. Tests must exercise rendered output or public functions with hand-derived expectations.
- Run Humanizer after factual drafting and preserve every verified fact during the final prose pass.
- Do not stage, commit, push, deploy, install dependencies, modify unrelated blog work, or change planner runtime behavior.

---

### Task 1: Structured localized Mod content contract

**Files:**

- Modify: `src/reference/mod-farm-cards.ts`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `tests/i18n/public-page-content.test.ts`

**Interfaces:**

- `ModFarmCard` produces `mapKind: "farm" | "interior"`, `description`, `bestFor`, `planningNote`, and `sourceHref` in addition to the preserved identity, author, and preview fields.
- `getLocalizedModFarmCards(locale)` returns all 21 items in canonical map-catalog order with complete locale-appropriate fields.

- [ ] Write tests asserting 21 complete localized cards, exactly 18 farms and 3 interiors, non-empty structured fields, valid HTTPS source URLs, preserved IDs, and meaningful EN/ZH content.
- [ ] Run `pnpm exec vitest run tests/i18n/public-page-content.test.ts` and verify RED because the structured fields and map kinds do not exist.
- [ ] Add the smallest typed content contract and verified English/Chinese copy needed to satisfy the tests.
- [ ] Rerun the same test and verify GREEN.

### Task 2: Semantic grouped card rendering

**Files:**

- Modify: `src/components/mod-map-card-grid.tsx`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `tests/components/public-farm-pages.test.tsx`

**Interfaces:**

- `ModMapCardGrid({ locale })` renders one farm section and one interior section.
- Every card renders its summary, best-fit guidance, planning note, source link, and preserved planner CTA with localized visible labels.

- [ ] Write static-render tests asserting two localized section headings, 18/3 grouped card counts, semantic labels, source links, and preserved `?farmType=` planner links.
- [ ] Run `pnpm exec vitest run tests/components/public-farm-pages.test.tsx` and verify RED because grouping and structured fields are absent.
- [ ] Implement grouping with simple `filter` calls and localized labels; do not introduce client state or a generic rendering framework.
- [ ] Rerun the same test and verify GREEN.

### Task 3: Bilingual H1, metadata, introduction, and collection schema

**Files:**

- Modify: `app/(en)/mods/page.tsx`
- Modify: `app/zh/mods/page.tsx`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interfaces:**

- English metadata title: `Stardew Valley Farm Map Mods | Stardew Planner`.
- English H1: `Stardew Valley Farm Map Mods and SVE Interiors`.
- Chinese metadata title: `星露谷物语农场地图 Mod | 星露谷规划器`.
- Chinese H1: `星露谷物语农场地图 Mod 与 SVE 室内地图`.
- Both page introductions explain what is supported, what the planner does, and that the planner does not install or reproduce every Mod-specific mechanic.
- Existing canonical, hreflang, Open Graph, Twitter, and CollectionPage behavior remains intact.

- [ ] Update metadata/static-output tests first with exact hand-checked titles, descriptions, H1s, and indexability expectations.
- [ ] Run the two route test files and verify RED against the current generic metadata and introduction.
- [ ] Implement the exact bilingual metadata, H1, introduction, and matching CollectionPage name/description.
- [ ] Rerun the route tests and verify GREEN.

### Task 4: Route-scoped presentation and Humanizer pass

**Files:**

- Modify: `app/globals.css`
- Modify: the Task 1 locale content files only when the Humanizer audit finds a concrete prose pattern.

- [ ] Add the minimum public-shell-scoped selectors for section spacing, card detail labels, source link placement, and readable paragraph rhythm on desktop and mobile.
- [ ] Audit all 42 localized card bodies for AI patterns, repeated sentence stems, mechanical three-part lists, promotional adjectives, and unsupported certainty.
- [ ] Rewrite only flagged sentences while preserving source-backed meaning and planner guidance.
- [ ] Rerun Tasks 1–3 tests after the prose pass.

### Task 5: Verification

**Files:** No new production files.

- [ ] Run `pnpm typecheck`.
- [ ] Run the focused content, component, metadata, and static-output tests.
- [ ] Run `NEXT_TELEMETRY_DISABLED=1 pnpm build` and verify both localized static pages are emitted.
- [ ] Serve `out/` locally and verify `/mods` and `/zh/mods` in the browser at desktop and 390px mobile widths.
- [ ] Verify both groups, all card links, no horizontal overflow, no console errors, and preserved planner navigation.
- [ ] Run `git diff --check` and inspect `git status --short` to keep unrelated dirty-worktree files untouched.
