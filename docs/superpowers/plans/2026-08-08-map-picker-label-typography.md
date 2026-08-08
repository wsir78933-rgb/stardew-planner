# Map Picker Label Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the user-approved competitor-scale map-card title typography without changing any map picker layout, asset, or interaction.

**Architecture:** Add one narrowly scoped CSS rule to the existing map picker style block. Protect the exact values with the existing CSS contract test so no component interface or markup change is required.

**Tech Stack:** CSS, Vitest, TypeScript, Next.js 16

## Global Constraints

- Map-card title font size must be exactly `14px`.
- Map-card title line height must be exactly `20px`.
- Keep existing font family, font weight, color, alignment, wrapping behavior, wording, assets, dimensions, grid, spacing, modal, tabs, markup, and interactions unchanged.
- Preserve all pre-existing and concurrent worktree changes.
- Do not stage, commit, push, install dependencies, or modify files outside the task scope.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.

---

### Task 1: Scope Map Card Title Typography

**Files:**
- Modify: `tests/components/planner-map-picker-layout.test.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing `.planner-editor-shell .editor-modal__map-grid button span` markup contract.
- Produces: a scoped CSS typography contract with no JavaScript or component API changes.

- [ ] **Step 1: Write the failing regression test**

Add a focused test that reads `app/globals.css` and requires the scoped title selector to contain both exact declarations:

```ts
it("uses the approved compact typography for map card titles", () => {
  const plannerStyles = readPlannerStyles();

  expect(plannerStyles).toMatch(
    /\.planner-editor-shell \.editor-modal__map-grid button span\s*\{[^}]*font-size:\s*14px;[^}]*line-height:\s*20px;/s,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm vitest run tests/components/planner-map-picker-layout.test.ts
```

Expected: the new typography test fails because the scoped CSS rule does not exist.

- [ ] **Step 3: Add the minimal scoped CSS rule**

Add immediately after the existing map-grid button rule:

```css
.planner-editor-shell .editor-modal__map-grid button span { font-size: 14px; line-height: 20px; }
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm vitest run tests/components/planner-map-picker-layout.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Run static and production verification**

Run:

```bash
pnpm typecheck
pnpm build
git diff --check -- app/globals.css tests/components/planner-map-picker-layout.test.ts
```

Expected: every command exits with status `0`.

- [ ] **Step 6: Verify the result in the local browser**

Open the map picker and verify at the same desktop viewport:

- a short title and a long two-line title both compute to `14px / 20px`;
- long labels remain readable and contained;
- card images, dimensions, grid, spacing, modal, tabs, and interactions remain unchanged.

- [ ] **Step 7: Review the exact task diff**

Confirm the task changed only the two scoped files and the approved documentation, preserved concurrent work, and introduced no unrelated style changes. Do not stage or commit.

