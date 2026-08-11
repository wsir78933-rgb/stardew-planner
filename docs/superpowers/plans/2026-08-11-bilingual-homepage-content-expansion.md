# Bilingual Homepage Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SSR-rendered, task-focused English and Chinese homepage planning guidance with one original supporting illustration, while retaining current metadata, H1, and planner behavior.

**Architecture:** Keep all locale-specific copy in `HomepageCopy`; render it through one small server component that only owns the guide markup. `HomepageContent` remains the page compositor. The guide uses a static public WebP through a native `<img>` because the site is exported statically and has no custom Next image loader.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, Vitest, CSS, imagegen WebP asset.

## Global Constraints

- Preserve both route metadata definitions and the existing unique H1 exactly.
- Extend the existing EN and `zh-CN` i18n record symmetrically; do not hard-code locale text in JSX.
- Do not reset, format, stage, commit, or alter user-owned dirty changes outside this feature.
- Keep guide copy task-oriented: farm map choice, fixed terrain, functional zones, large placements, walk routes, and gradual refinement.
- Do not claim competitor-specific functionality or introduce unrelated guides about gifts, profits, mining, fishing, or mods.
- Add one original pixel-art WebP in `public/homepage/` with precise localized alt text; do not use game screenshots or copied game assets.
- Verify static HTML includes the new visible copy and image in both `/` and `/zh` exports.

---

### Task 1: Define bilingual guide content and its contract

**Files:**
- Modify: `src/homepage/homepage-copy.ts`
- Modify: `tests/homepage/homepage-copy.test.ts`

**Interfaces:**
- Produces: `HomepageCopy.planningGuide`, containing `heading`, `intro`, `workflowHeading`, four `steps`, `playStylesHeading`, three `playStyles`, `evolutionHeading`, `evolutionParagraphs`, `imageAlt`, and `imageCaption` for each locale.
- Consumes: existing `HomepageLocale` and `HomepageCopy` record contract.

- [ ] **Step 1: Write failing copy-contract assertions**

```ts
expect(homepageCopyByLocale.en.planningGuide.steps).toHaveLength(4);
expect(homepageCopyByLocale["zh-CN"].planningGuide.steps).toHaveLength(4);
expect(homepageCopyByLocale.en.planningGuide.heading).toContain("Stardew Valley Planner");
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `pnpm vitest run tests/homepage/homepage-copy.test.ts`

Expected: FAIL because `planningGuide` does not exist.

- [ ] **Step 3: Add the minimal typed bilingual copy model**

```ts
type HomepagePlanningGuideCopy = Readonly<{
  heading: string;
  intro: readonly string[];
  workflowHeading: string;
  steps: readonly [HomepagePlanningStepCopy, HomepagePlanningStepCopy, HomepagePlanningStepCopy, HomepagePlanningStepCopy];
  playStylesHeading: string;
  playStyles: readonly [HomepagePlanningPlayStyleCopy, HomepagePlanningPlayStyleCopy, HomepagePlanningPlayStyleCopy];
  evolutionHeading: string;
  evolutionParagraphs: readonly [string, string];
  imageAlt: string;
  imageCaption: string;
}>;
```

Populate equivalent English and Chinese task-focused text; retain all current copy values unchanged unless a test already requires the user-owned values.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `pnpm vitest run tests/homepage/homepage-copy.test.ts`

Expected: PASS.

### Task 2: Render an accessible SSR planning guide

**Files:**
- Create: `src/components/homepage-planning-guide.tsx`
- Modify: `src/components/homepage-content.tsx`
- Modify: `tests/routes/planner-editor-page.test.tsx`
- Modify: `tests/routes/chinese-public-routes.test.tsx`

**Interfaces:**
- Consumes: `HomepageCopy["planningGuide"]`.
- Produces: `HomepagePlanningGuide`, a server-safe component that renders `<section id="planning-guide">`, one H2, H3 subsections, a semantic ordered workflow, and a `<figure>` with the static image path.

- [ ] **Step 1: Write failing EN and ZH route assertions**

```ts
expect(renderedEnglishPage).toContain("How to Plan a Stardew Valley Farm Layout");
expect(renderedEnglishPage).toContain('src="/homepage/stardew-valley-planner-layout.webp"');
expect(renderedChinesePage).toContain("如何规划星露谷农场布局");
```

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `pnpm vitest run tests/routes/planner-editor-page.test.tsx tests/routes/chinese-public-routes.test.tsx`

Expected: FAIL because the guide section and image are absent.

- [ ] **Step 3: Implement the guide component and compose it after the planner workspace**

```tsx
export function HomepagePlanningGuide({ copy }: HomepagePlanningGuideProps) {
  return <section id="planning-guide" data-homepage-planning-guide>...</section>;
}
```

Use `loading="lazy"`, `decoding="async"`, explicit `width` and `height`, localized `alt`, and a visible `figcaption`. Pass `copy.planningGuide` from `HomepageContent`; do not change the H1, metadata, or planner workspace.

- [ ] **Step 4: Run the focused tests to verify they pass**

Run: `pnpm vitest run tests/routes/planner-editor-page.test.tsx tests/routes/chinese-public-routes.test.tsx`

Expected: PASS.

### Task 3: Add the original responsive illustration and scoped layout styles

**Files:**
- Create: `public/homepage/stardew-valley-planner-layout.webp`
- Modify: `app/globals.css`
- Modify: `tests/homepage/homepage-style-contract.test.ts` when the file exists; otherwise add focused style assertions to the closest homepage style test.

**Interfaces:**
- Consumes: static image path `/homepage/stardew-valley-planner-layout.webp` and guide data attributes.
- Produces: a responsive, non-LCP figure that preserves intrinsic ratio and keeps long localized copy readable.

- [ ] **Step 1: Write the failing style contract**

```ts
expect(homepageStyles).toContain('[data-homepage-planning-guide] figure');
expect(homepageStyles).toContain('[data-homepage-planning-guide] img');
```

- [ ] **Step 2: Run the focused style test to verify it fails**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts`

Expected: FAIL because guide-specific CSS selectors are absent.

- [ ] **Step 3: Generate and validate the final WebP, then add scoped CSS**

Generate one original 16:9 pixel-art farm-planning scene with functional zones, paths, buildings, and non-textual coverage overlays. Inspect it before copying to `public/homepage/stardew-valley-planner-layout.webp`. Add only guide-scoped styles for readable line length, a two-column desktop section, figure border/radius, intrinsic responsive image behavior, and a single-column mobile breakpoint.

- [ ] **Step 4: Run the focused style test to verify it passes**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts`

Expected: PASS.

### Task 4: Verify static delivery, type safety, and browser behavior

**Files:**
- Modify only test assertions if an assertion reveals a direct mismatch with the confirmed contract.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: validation evidence that both homepages contain SSR copy and the local static image without changing planner behavior.

- [ ] **Step 1: Run the focused homepage and static-delivery suite**

Run: `pnpm vitest run tests/homepage/homepage-copy.test.ts tests/routes/planner-editor-page.test.tsx tests/routes/chinese-public-routes.test.tsx tests/homepage/homepage-style-contract.test.ts tests/routes/react-planner-static-delivery.test.ts tests/routes/static-public-pages.test.ts`

Expected: PASS.

- [ ] **Step 2: Run type checking and production export**

Run: `pnpm typecheck && pnpm build`

Expected: both commands exit 0; exported `/out/index.html` and `/out/zh/index.html` contain localized guide text and `/homepage/stardew-valley-planner-layout.webp`.

- [ ] **Step 3: Browser-verify both static routes**

Run a local static server for `out/` and inspect `/` and `/zh` with Ego browser at desktop and 390 px mobile widths.

Expected: one visible H1 per page, localized guide and image render after the planner workspace, no horizontal overflow, image has meaningful localized alt text, and the planner still opens.

- [ ] **Step 4: Report the exact validation results without staging, committing, or deploying**

