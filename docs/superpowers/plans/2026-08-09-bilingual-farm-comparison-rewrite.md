# Bilingual Farm Comparison Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the English and Chinese farm comparison pages into source-backed decision guides for all eight official Stardew Valley farm maps without changing their URLs or planner behavior.

**Architecture:** Keep stable map IDs, previews, tile counts, and individual farm-guide content in `official-farm-guides.ts`. Add comparison-page-specific English content in a focused reference module, compose Chinese translations through the existing public-page localization boundary, and keep the React component responsible only for rendering the localized data. Route metadata and visible introductions come from one bilingual page-copy source.

**Tech Stack:** Next.js 16.3.0 App Router, React 19 server components, TypeScript 5.9, Vitest 3.2, static export, route-scoped global CSS.

## Global Constraints

- Preserve `/farm-comparison` and `/zh/farm-comparison`, their canonical URLs, hreflang pairs, indexing behavior, and `Article` JSON-LD type.
- Preserve all official farm IDs, map preview paths, tile counts, planner query parameters, and individual `/farm/[type]` page behavior.
- Rewrite English and Chinese together, including Meta title, Meta description, H1, visible introduction, quick recommendations, comparison table, and all eight cards.
- Use verifiable public facts. Recommendations must be tied to map geometry or documented mechanics and must not claim personal play experience.
- Do not render SERP analysis, editorial notes, author instructions, AI commentary, or source-research explanations on the page.
- Run the final English and Chinese copy through the Humanizer rules without changing factual meaning.
- Reuse the existing farm preview images. Do not add an infographic or YouTube video.
- Add no dependencies. Do not stage, commit, push, deploy, or modify unrelated dirty-worktree files.
- Add only `.farm-comparison-*` CSS selectors so the Mod cards and individual farm guides do not change.

---

### Task 1: Lock the bilingual comparison contract with failing tests

**Files:**
- Modify: `tests/components/public-farm-pages.test.tsx`
- Modify: `tests/i18n/public-page-content.test.ts`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interfaces:**
- Consumes: existing `FarmComparisonContent`, `getPublicPageCopy`, route metadata exports, and static export expectations.
- Produces: observable requirements for eight structured cards, quick recommendations, bilingual metadata, stable links, and static output.

- [ ] **Step 1: Add component expectations for the new decision content**

Assert that English and Chinese output each contain six recommendation entries, eight card summaries, eight `Best for` labels, eight trade-off labels, eight planning notes, eight guide links, eight planner links, and a visible public source link. Keep the existing assertions for IDs, previews, tile counts, guide URLs, and localized planner URLs.

- [ ] **Step 2: Add localization expectations for all eight comparison cards**

Assert that `getLocalizedOfficialFarmComparisonCards("en")` and `getLocalizedOfficialFarmComparisonCards("zh-CN")` each return eight entries in `officialFarmTypes` order, preserve stable facts, and provide non-empty `summary`, `bestFor`, `tradeoff`, `planningNote`, and `knownFor` text.

- [ ] **Step 3: Update exact metadata and static-page expectations**

Use these exact values:

```text
EN Meta title: Stardew Valley Farm Types: Compare All 8 Maps
EN H1: Which Stardew Valley Farm Type Should You Choose?
EN description: Compare all 8 Stardew Valley farm types by usable space, unique resources, and layout trade-offs. Find the right map for crops, fishing, animals, co-op, or a challenge run.

ZH Meta title: 星露谷物语农场类型对比：8 种地图怎么选
ZH H1: 星露谷物语 8 种农场怎么选？
ZH description: 对比《星露谷物语》8 种农场地图的可用空间、独特资源与布局取舍，快速找到适合作物、钓鱼、畜牧、多人联机或挑战玩法的农场。
```

- [ ] **Step 4: Run the targeted tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/public-farm-pages.test.tsx tests/i18n/public-page-content.test.ts tests/routes/public-route-metadata.test.ts
```

Expected: failures for missing comparison content fields, new headings, and new metadata values.

### Task 2: Add comparison-specific English and Chinese content

**Files:**
- Create: `src/reference/official-farm-comparison-content.ts`
- Modify: `src/i18n/public-page-content.ts`

**Interfaces:**
- Consumes: `OfficialFarmGuide`, `OfficialFarmType`, `officialFarmTypes`, and `officialFarmGuides`.
- Produces: `OfficialFarmComparisonCard`, `getOfficialFarmComparisonCards()`, and `getLocalizedOfficialFarmComparisonCards(locale)`.

- [ ] **Step 1: Define a comparison-only content record**

Create a typed `Record<OfficialFarmType, OfficialFarmComparisonText>` with `summary`, `bestFor`, `tradeoff`, `planningNote`, `knownFor`, and a short `facts` list. Compose it with the stable guide facts instead of copying IDs, previews, versions, or tile counts.

- [ ] **Step 2: Add the Chinese comparison record and localized composer**

Use the same exact farm ID union. Fail fast with the farm ID if a localized record is missing. Keep stable stats and previews from the official guide data.

- [ ] **Step 3: Add bilingual page and recommendation copy**

Add `farmComparisonMetaTitle`, a separate visible introduction, six play-style recommendations, the no-universal-best note, method/source copy, card labels, and guide-action copy to `PublicPageCopy`. Use one official public source URL: `https://wiki.stardewvalley.net/Farm_Maps`.

- [ ] **Step 4: Run localization tests and verify GREEN for the content layer**

Run:

```bash
pnpm exec vitest run tests/i18n/public-page-content.test.ts
```

Expected: all localization and structured-content tests pass.

### Task 3: Render the decision guide and update route metadata

**Files:**
- Modify: `src/components/farm-comparison-content.tsx`
- Modify: `app/(en)/farm-comparison/page.tsx`
- Modify: `app/zh/farm-comparison/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: localized comparison cards and `PublicPageCopy` fields from Task 2.
- Produces: static English and Chinese pages with recommendations, table, method note, structured cards, guide links, and planner actions.

- [ ] **Step 1: Render quick recommendations before the table**

Each recommendation links to the corresponding card anchor and uses a localized heading and sentence. End the section with the visible statement that there is no universal best map.

- [ ] **Step 2: Render the comparison table from explicit `knownFor` content**

Keep the tile-count and version columns. Replace the implicit `features[0]` summary with the dedicated `knownFor` field.

- [ ] **Step 3: Render all eight structured cards**

For each card render its summary, stable stats, best-for recommendation, trade-off, planning note, concise verified facts, localized guide link, and localized planner CTA. Keep lazy-loaded local previews.

- [ ] **Step 4: Render the data-method and source section**

Explain that tile counts compare supported map geometry and that progress, tools, and settings can change in-game conditions. Link the source with normal anchor text intended for players, not editorial commentary.

- [ ] **Step 5: Update both route metadata and visible headers**

Read English and Chinese page values through `getPublicPageCopy(locale)`. Feed the exact Meta title and description into `createPublicPageMetadata`, and feed the visible H1 plus description into the existing `Article` JSON-LD builder.

- [ ] **Step 6: Add route-scoped responsive styles**

Add only `.farm-comparison-*` selectors for recommendation cards, structured card details, action rows, and method copy. Preserve the existing two-column card grid and mobile single-column layout.

- [ ] **Step 7: Run component and metadata tests and verify GREEN**

Run:

```bash
pnpm exec vitest run tests/components/public-farm-pages.test.tsx tests/i18n/public-page-content.test.ts tests/routes/public-route-metadata.test.ts
```

Expected: all targeted component, localization, and metadata tests pass.

### Task 4: Humanize, build, and verify the exported pages

**Files:**
- Modify if required by the audit: `src/reference/official-farm-comparison-content.ts`
- Modify if required by the audit: `src/i18n/public-page-content.ts`
- Verify: `out/farm-comparison.html`
- Verify: `out/zh/farm-comparison.html`

**Interfaces:**
- Consumes: the complete bilingual page from Task 3.
- Produces: final source-backed copy and fresh verification evidence.

- [ ] **Step 1: Run the Humanizer audit on visible copy**

Remove generic promotion, fake significance, repeated three-item rhythms, synonym cycling, em-dash-heavy phrasing, filler transitions, and chatbot artifacts. Preserve every number, map mechanic, limitation, and recommendation basis.

- [ ] **Step 2: Scan for prohibited author-facing residue**

Check the exported page text for `SERP`, `SEO analysis`, `editorial`, `author note`, `AI`, `prompt`, `给作者`, `分析说明`, `写作说明`, and `人工智能`. Player-facing words such as `source` and `data` remain allowed.

- [ ] **Step 3: Run static and type verification**

Run:

```bash
pnpm typecheck
pnpm exec vitest run tests/components/public-farm-pages.test.tsx tests/i18n/public-page-content.test.ts tests/routes/public-route-metadata.test.ts
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run tests/routes/static-public-pages.test.ts tests/routes/static-routes.test.ts
git diff --check
```

Expected: zero type errors, zero test failures, a successful 40-page static export, and no whitespace errors.

- [ ] **Step 4: Verify the built pages in a browser**

Run the static server and inspect `/farm-comparison` and `/zh/farm-comparison` at desktop width and 390px. Confirm the quick picks, table scroll, eight cards, source link, guide links, planner links, no page-level horizontal overflow, and an empty browser console.

- [ ] **Step 5: Review the final diff without staging or committing**

Confirm that the diff contains only the approved comparison-page files plus the plan and tests, while preserving all pre-existing user changes.
