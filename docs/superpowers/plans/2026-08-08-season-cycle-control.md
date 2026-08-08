# Season Cycle Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing season icon advance `spring -> summer -> fall -> winter -> spring` on every click without opening a season dialog.

**Architecture:** Keep season ordering and validation in editor view state, expose one `cycle-season` workspace action, and give `EditorMenuBar` a dedicated `onCycleSeason` interface. Remove the obsolete season modal branch and its four-button CSS while preserving the existing season-selection state path used by imports and other exact-season consumers.

**Tech Stack:** TypeScript, React 19, Next.js 16, Vitest, Pixi-backed planner runtime.

## Global Constraints

- Preserve every map, texture, sprite, and asset path exactly.
- Preserve editor layout, other menu actions, persistence formats, and the mobile `.menu-bar { z-index: 26; }` fix.
- Use ordinary functions and discriminated unions; do not add classes, strategy objects, dependencies, or speculative abstractions.
- Validate invalid seasons at the editor-state boundary and include the invalid value in the thrown error.
- Do not catch or silently ignore errors.
- Do not stage, commit, or push.

---

### Task 1: Add the season-cycle state transition

**Files:**
- Modify: `src/editor/editor-view-state.ts`
- Modify: `src/planner/planner-workspace-state.ts`
- Test: `tests/editor/editor-view-state.test.ts`
- Test: `tests/planner/planner-workspace-state.test.ts`

**Interfaces:**
- Consumes: `editorSeasons`, `TilesheetSeason`, `selectWorkspaceSeason(...)`.
- Produces: `getNextEditorSeason(season: TilesheetSeason): TilesheetSeason` and `PlannerWorkspaceAction` variant `{ type: "cycle-season" }`.

- [ ] **Step 1: Write failing editor-state tests**

Add direct expectations for every transition and invalid input:

```ts
expect(getNextEditorSeason("spring")).toBe("summer");
expect(getNextEditorSeason("summer")).toBe("fall");
expect(getNextEditorSeason("fall")).toBe("winter");
expect(getNextEditorSeason("winter")).toBe("spring");
expect(() => getNextEditorSeason("monsoon" as never)).toThrow("monsoon");
```

- [ ] **Step 2: Run the editor-state test and confirm RED**

Run: `pnpm exec vitest run tests/editor/editor-view-state.test.ts`

Expected: FAIL because `getNextEditorSeason` is not exported.

- [ ] **Step 3: Implement the pure transition**

Use the ordered tuple as the single source of truth and validate before indexing:

```ts
export function getNextEditorSeason(season: TilesheetSeason): TilesheetSeason {
  validateEditorSeason(season);
  const seasonIndex = editorSeasons.indexOf(season);
  return editorSeasons[(seasonIndex + 1) % editorSeasons.length];
}
```

- [ ] **Step 4: Add a failing workspace reducer test**

Cycle four times from the initial state and assert `summer`, `fall`, `winter`, then `spring`, with `modalId` remaining `null`.

- [ ] **Step 5: Run the workspace-state test and confirm RED**

Run: `pnpm exec vitest run tests/planner/planner-workspace-state.test.ts`

Expected: FAIL because `cycle-season` is not a recognized action.

- [ ] **Step 6: Implement the reducer action**

Add `{ type: "cycle-season" }` to `PlannerWorkspaceAction` and route it through the existing state boundary:

```ts
case "cycle-season":
  return selectWorkspaceSeason(
    plannerWorkspaceState,
    getNextEditorSeason(plannerWorkspaceState.season),
  );
```

- [ ] **Step 7: Run both state test files and confirm GREEN**

Run: `pnpm exec vitest run tests/editor/editor-view-state.test.ts tests/planner/planner-workspace-state.test.ts`

Expected: all tests pass.

---

### Task 2: Convert the season icon to a direct action and remove the dialog

**Files:**
- Modify: `src/components/editor-menu-bar.tsx`
- Modify: `src/components/planner-workspace.tsx`
- Modify: `src/components/editor-modal.tsx`
- Modify: `src/editor/editor-view-state.ts`
- Modify: `app/globals.css`
- Test: `tests/components/editor-shell.test.tsx`
- Test: `tests/components/editor-modal.test.tsx`
- Test: `tests/components/planner-workspace-layout.test.ts`
- Test: `tests/editor/editor-view-state.test.ts`

**Interfaces:**
- Consumes: workspace action `{ type: "cycle-season" }` from Task 1.
- Produces: `EditorMenuBar` callback `onCycleSeason: () => void`; the remaining modal controls continue using `onOpenModal(modalId)`.

- [ ] **Step 1: Write failing component and modal-contract tests**

Update the menu render test to provide `onCycleSeason`, keep `aria-label="Season: spring"`, and assert the season button does not advertise `aria-haspopup="dialog"` or `aria-expanded`. Remove `season-picker` from the expected modal IDs. Replace the four-button CSS contract with an assertion that `.editor-modal__season-picker` no longer exists while the mobile `z-index: 26` rule remains.

- [ ] **Step 2: Run component tests and confirm RED**

Run:

```bash
pnpm exec vitest run \
  tests/components/editor-shell.test.tsx \
  tests/components/editor-modal.test.tsx \
  tests/components/planner-workspace-layout.test.ts \
  tests/editor/editor-view-state.test.ts
```

Expected: failures because the season control still opens a dialog and the obsolete modal/CSS still exist.

- [ ] **Step 3: Implement a discriminated menu-control action**

Represent the season control as a direct action and the other controls as modal actions. The click branch must remain explicit:

```ts
if (editorMenuControl.action === "cycle-season") {
  onCycleSeason();
} else {
  onOpenModal(editorMenuControl.modalId);
}
```

Both branches collapse the compact menu. Only modal controls receive `aria-haspopup="dialog"` and `aria-expanded`.

- [ ] **Step 4: Connect the workspace interface**

Pass:

```tsx
onCycleSeason={() =>
  plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
    type: "cycle-season",
  })
}
```

Keep the existing exact `select-season` reducer action for imports and other consumers.

- [ ] **Step 5: Remove the obsolete dialog surface**

Remove `season-picker` from `editorModalIds`, delete the `EditorModal` season branch, `SeasonPicker`, its now-unused properties/imports, its label branch, the three `.editor-modal__season-picker` CSS rules, and their old layout assertions. Do not change any other modal.

- [ ] **Step 6: Run the component/state test group and confirm GREEN**

Run the command from Step 2.

Expected: all tests pass.

---

### Task 3: Integration and browser acceptance

**Files:**
- Test only; no new production files unless a verified failure requires returning to Task 1 or Task 2.

**Interfaces:**
- Consumes: public button label `Season: <season>` and existing planner rendering behavior.
- Produces: verification evidence only.

- [ ] **Step 1: Run focused integration tests**

Run:

```bash
pnpm exec vitest run \
  tests/components/editor-shell.test.tsx \
  tests/components/editor-modal.test.tsx \
  tests/components/planner-workspace-layout.test.ts \
  tests/components/planner-workspace.editing.integration.test.tsx \
  tests/editor/editor-view-state.test.ts \
  tests/planner/planner-workspace-state.test.ts
```

- [ ] **Step 2: Run quality gates**

Run `pnpm typecheck`, `pnpm build`, and `git diff --check`. If `next build` rewrites `next-env.d.ts`, restore that generated non-feature diff before handoff.

- [ ] **Step 3: Verify desktop behavior in the local browser**

At `http://localhost:3000/?plannerRuntime=react`, click the season icon five times and verify labels `summer`, `fall`, `winter`, `spring`, `summer`; confirm `.editor-modal__backdrop` remains absent and the rendered map changes with the season.

- [ ] **Step 4: Verify 320px behavior**

At 320px width, confirm Menu remains clickable, repeat the season loop, and confirm no dialog or console error appears. Reset the temporary viewport afterward.

- [ ] **Step 5: Independent review**

Review scope, state correctness, component accessibility, removal completeness, regression risk, and test evidence. Reject any change to assets, rendering layout, persistence formats, unrelated components, or the mobile Menu layering rule.
