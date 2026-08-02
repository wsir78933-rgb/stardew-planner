# Public Page Native Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every non-home public content page use the browser document as its vertical scroll container while preserving the homepage planner's current layout and wheel behavior.

**Architecture:** Remove the document-wide `height: 100%; overflow: hidden` baseline. Keep planner containment at the existing homepage runtime root and canvas event boundary. Let `PublicPageShell` grow with its content by replacing its fixed viewport height and inner vertical scrolling with `min-height: 100dvh` and horizontal clipping only.

**Tech Stack:** Next.js 16, React 19, CSS, Vitest, TypeScript.

## Global Constraints

- Modify only `app/globals.css` and `tests/routes/public-page-style-contract.test.ts`.
- Do not modify homepage components, planner runtime files, wheel handlers, copy, SEO, routes, dependencies, or generated assets.
- Preserve homepage scrolling and planner wheel behavior exactly as currently observed.
- Public pages must scroll through `document.scrollingElement`; `[data-public-page-shell]` must not be a fixed-height vertical scroll container.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.
- Do not commit, stage, or overwrite unrelated dirty-worktree changes.

---

### Task 1: Move public content scrolling back to the document

**Files:**
- Modify: `tests/routes/public-page-style-contract.test.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing `[data-public-page-shell]` marker rendered by `PublicPageShell`.
- Produces: a CSS contract in which the document grows naturally and public shells have `min-height: 100dvh` without `height: 100dvh` or `overflow-y: auto`.

- [ ] **Step 1: Write the failing regression test**

Update the first style-contract test so it extracts the initial `html, body` rule and the `[data-public-page-shell]` rule. Assert that the root rule does not contain `height: 100%` or `overflow: hidden`; assert that the public shell contains `min-height: 100dvh` and `overflow-x: clip`; assert that it does not contain `height: 100dvh` or `overflow-y: auto`. Retain the existing responsive, image-ratio, and focus assertions.

- [ ] **Step 2: Verify the regression test fails for the old architecture**

Run:

```bash
pnpm vitest run tests/routes/public-page-style-contract.test.ts
```

Expected: FAIL because the current root rule contains `height: 100%` and `overflow: hidden`, and the current public shell uses `height: 100dvh` plus `overflow-y: auto`.

- [ ] **Step 3: Implement the minimal CSS change**

In the initial `html, body` rule, preserve the background and margin but remove the fixed height and global overflow lock. Add a separate `body { min-height: 100vh; }` baseline if needed for short pages. In `[data-public-page-shell]`, replace `height: 100dvh`, `overflow-x: hidden`, and `overflow-y: auto` with `min-height: 100dvh` and `overflow-x: clip`. Do not change any homepage-scoped or planner-runtime rules.

- [ ] **Step 4: Verify the targeted test passes**

Run:

```bash
pnpm vitest run tests/routes/public-page-style-contract.test.ts
```

Expected: PASS.

- [ ] **Step 5: Verify the affected route contracts**

Run:

```bash
pnpm vitest run tests/routes/public-page-style-contract.test.ts tests/components/public-page-shell.test.tsx tests/routes/static-public-pages.test.ts
```

Expected: PASS with zero failed tests.

- [ ] **Step 6: Report without committing**

Return the exact files changed, the RED and GREEN command outputs, and a concise self-review against every Global Constraint. Do not stage or commit.
