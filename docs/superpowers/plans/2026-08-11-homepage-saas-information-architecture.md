# Homepage SaaS Information Architecture Implementation Plan

> **For agentic workers:** Use test-driven development. Do not modify metadata or copy.

**Goal:** Reframe the existing homepage as a product-led SaaS landing page while preserving its current visual language and all text.

**Architecture:** Keep the frozen planner runtime outside the Hero. Add structural hooks only around the Hero content and planner workspace, then use route-scoped CSS to create a deliberate product narrative: value proposition, live product surface, and supporting guide.

## Global Constraints

- Preserve Title, Description, H1, Hero copy, localized copy, planner behavior, runtime assets, colors, typography, button treatment, and existing visual style.
- Modify only homepage structural hooks, homepage-scoped CSS, and direct route/style tests.
- Do not change editor, save, modal, or other user-owned dirty changes; do not stage, commit, push, reset, or clean.

### Task 1: Add product-stage structure and preserve copy contract

**Files:**
- Modify: `src/components/homepage-content.tsx`
- Modify: `src/components/homepage-planner-workspace.tsx`
- Modify: `tests/routes/planner-editor-page.test.tsx`

- [ ] Add failing SSR assertions for `data-homepage-hero-content` and `data-homepage-product-stage` while retaining the existing rendered H1 and Hero copy assertions.
- [ ] Run `pnpm vitest run tests/routes/planner-editor-page.test.tsx` and verify the expected failure.
- [ ] Add only structural wrappers/attributes around existing elements; do not alter text or runtime placement.
- [ ] Re-run the route test and verify it passes.

### Task 2: Style the product narrative with existing design tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/homepage/homepage-style-contract.test.ts`

- [ ] Add a failing style contract for the Hero content container and product-stage frame using the current homepage scope.
- [ ] Run `pnpm vitest run tests/homepage/homepage-style-contract.test.ts` and verify the expected failure.
- [ ] Add scoped layout rules only: a contained Hero value block, product-stage framing for the existing workspace, and mobile single-column behavior using existing variables and border/button language.
- [ ] Re-run the style test and verify it passes.

### Task 3: Validate unchanged content and responsive product flow

- [ ] Run `pnpm vitest run tests/routes/planner-editor-page.test.tsx tests/routes/chinese-public-routes.test.tsx tests/homepage/homepage-style-contract.test.ts`.
- [ ] Run `pnpm typecheck && pnpm build`.
- [ ] Use Ego browser on `/` and `/zh` at desktop and 390px: verify one unchanged H1, Hero before product stage, planner still opens, guide follows the workspace, and no horizontal overflow.
