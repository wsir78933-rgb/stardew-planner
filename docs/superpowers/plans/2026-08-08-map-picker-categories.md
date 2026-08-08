# Categorized Map Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace both combined map lists with one shared, competitor-matching categorized map picker while leaving the editor's base structure unchanged.

**Architecture:** A focused `PlannerMapPicker` component owns category derivation, filtering, accessible tab interaction, and map-card rendering. `EditorModal` and `ProjectMapInstancePanel` communicate with it only through typed props and their existing callbacks, so map-switching and project-add behavior remain outside the picker.

**Tech Stack:** React 19, TypeScript, Vitest, server-side static markup tests, existing CSS tokens, Next.js 16 build.

## Global Constraints

- Top-level tabs are exactly `Farm`, `Interiors`, `Exteriors`, `Community`, in that order.
- `Community` has exactly `Farms` and `Interiors` second-level tabs, in that order.
- Only the active category's cards are rendered.
- A known selected map initializes the matching top-level and community tab; no selected map initializes `Farm`; an unknown non-null id fails fast.
- The normal `Choose map` dialog and active-project `Add map` section use the same component and category rules.
- Do not change editor canvas, toolbar, menu bar, map catalog data, persistence, project data model, map rendering, or configuration behavior.
- Preserve unrelated existing changes in `app/globals.css` and `tests/components/planner-workspace-layout.test.ts` exactly.
- Add no dependency and perform no Git stage, commit, push, reset, checkout, or cleanup operation.
- Follow high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise naming.

---

### Task 1: Shared categorized map picker and both integrations

**Files:**
- Create: `src/components/planner-map-picker.tsx`
- Modify: `src/components/editor-modal.tsx:13-18,72-91,201-214,316-353`
- Modify: `src/components/project-map-instance-panel.tsx:1-13,194-208`
- Modify: `app/globals.css:1961-1985`
- Create: `tests/components/planner-map-picker.test.tsx`
- Modify: `tests/components/editor-shell.test.tsx:98-126`
- Modify: `tests/components/project-map-instance-panel.test.tsx:1-149`

**Interfaces:**
- Consumes: `PlannerMap`, `PlannerMapCategory`, `getPlannerMapById`, and caller-owned selection callbacks.
- Produces: `PlannerMapPicker({ maps, selectedMapId, onMapSelect, mapIdDataAttribute })`, `getInitialPlannerMapPickerState(selectedMapId)`, and `getNextPlannerMapTab(currentTab, pressedKey)` with exact typed return values defined in the failing tests before implementation.

- [ ] **Step 1: Write focused failing behavior tests**

  Create `tests/components/planner-map-picker.test.tsx` with literal expectations that prove:
  - `standard` initializes `Farm`; `farmhouse-2` initializes `Interiors`; `bus-stop` initializes `Exteriors`; `sve-winery` initializes `Community` / `Farms`; and `sve-grandpas-shed-2` initializes `Community` / `Interiors`.
  - `null` initializes `Farm`, while an unknown non-null id throws an error containing the invalid value.
  - Static rendering has four top-level tabs in the approved order, one top-level tabpanel, and only the nine `farm` cards for the default state.
  - Rendering a community-farm selection produces the two approved community tabs and only the 18 `community-farm` cards; a community-interior selection produces only the three `community-interior` cards.
  - The supplied data-attribute name appears on cards so both callers retain their established selectors.
  - `ArrowLeft`, `ArrowRight`, `Home`, and `End` return the literal expected next tabs; unrelated keys return `null`.

- [ ] **Step 2: Run the new test and verify RED**

  Run: `pnpm vitest run tests/components/planner-map-picker.test.tsx`

  Expected: FAIL because `src/components/planner-map-picker.tsx` and its exports do not exist.

- [ ] **Step 3: Implement the minimal shared component**

  Create a client component with these direct responsibilities only:
  - Define typed top-level and community tab ids and ordered label/filter definitions.
  - Derive initial state from `selectedMapId` using `getPlannerMapById` for fail-fast validation.
  - Render real tablists, roving tab indexes, associated tabpanels, and only the active category cards.
  - Move focus after keyboard navigation; throw a descriptive error containing the tab id if its ref is unavailable.
  - Call `onMapSelect(plannerMap.id)` without embedding switch/add/close logic.
  - Render existing preview URLs from `previewOutputPath` and preserve decorative-image semantics.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run: `pnpm vitest run tests/components/planner-map-picker.test.tsx`

  Expected: PASS with pristine output.

- [ ] **Step 5: Change existing integration tests first and verify RED**

  Update `tests/components/editor-shell.test.tsx` to require the shared tab UI, a selected `Farm` tab, exactly nine active farm cards, and absence of a representative non-farm card while retaining dialog/configuration assertions.

  Update `tests/components/project-map-instance-panel.test.tsx` fixtures to use complete `PlannerMap` objects and require the categorized tab UI plus `data-project-add-map-id` cards, without weakening assertions for current marker, transfer destination, rename/open/duplicate/copy/move/delete, and empty-project behavior.

  Run: `pnpm vitest run tests/components/editor-shell.test.tsx tests/components/project-map-instance-panel.test.tsx`

  Expected: FAIL because both callers still render their old map lists.

- [ ] **Step 6: Integrate the shared component**

  In `EditorModal`, remove `mapGroupDefinitions`, the local `MapPicker`, and unused map-catalog imports. Render `PlannerMapPicker` with `plannerMaps`, `selectedMapId`, `onMapChange`, and `data-editor-map-id`.

  In `ProjectMapInstancePanel`, change `mapChoices` to `readonly PlannerMap[]` and replace only the existing add-map grid with `PlannerMapPicker` using `selectedMapId={null}`, `onAddMap`, and `data-project-add-map-id`. Preserve the project list and all action handlers.

- [ ] **Step 7: Run integration tests and verify GREEN**

  Run: `pnpm vitest run tests/components/planner-map-picker.test.tsx tests/components/editor-shell.test.tsx tests/components/project-map-instance-panel.test.tsx tests/editor/editor-view-state.test.ts tests/components/planner-workspace.projects.integration.test.ts`

  Expected: PASS with pristine output.

- [ ] **Step 8: Add the scoped competitor-matching styles**

  Add only `.planner-editor-shell`-scoped rules for:
  - a 600 px map-picker modal modifier capped at 90 vw,
  - full-width top tabs with a green active underline,
  - compact community sub-tabs with a filled active state,
  - one scrollable active tabpanel and the existing three-column grid,
  - visible keyboard focus and `minmax(0, 1fr)` columns to prevent narrow-screen overflow.

  Do not edit or reorder the pre-existing season-picker and mobile menu rules in the dirty CSS file.

- [ ] **Step 9: Verify automated regression coverage**

  Run:
  - `pnpm vitest run tests/components/planner-map-picker.test.tsx tests/components/editor-shell.test.tsx tests/components/project-map-instance-panel.test.tsx tests/editor/editor-view-state.test.ts tests/components/planner-workspace.projects.integration.test.ts tests/components/planner-workspace-layout.test.ts`
  - `pnpm typecheck`
  - `pnpm build`

  Expected: all commands exit 0 with no TypeScript, test, or build errors.

- [ ] **Step 10: Verify the real UI with the local CDP browser**

  Confirm at desktop width and 390 px:
  - opening `Choose map` on representative maps selects the matching category,
  - switching all four top tabs and both Community sub-tabs shows only their maps,
  - card selection still switches/closes through the existing callback path,
  - an active project's `Add map` shows the same categorized picker and adds the selected map,
  - `Escape`, close, focus movement, focus visibility, three-column layout, panel scrolling, and zero horizontal overflow all work.

- [ ] **Step 11: Self-review scope and worktree preservation**

  Compare `git status --short` and focused diffs against the initial state. Confirm only the seven planned implementation/test files plus these design/plan documents changed, the user's existing CSS/test edits remain intact, and no Git commit or index mutation occurred.
