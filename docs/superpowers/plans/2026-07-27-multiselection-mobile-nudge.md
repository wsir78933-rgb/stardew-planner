# Multi-selection Inspector and Mobile Nudge Plan

**Goal:** Finish the already-supported multi-selection workflow without changing placement persistence: show a safe group inspector, permit group deletion, and make the mobile joystick nudge the current selection rather than pan the camera.

**Architecture:** Keep all placement mutations in `editor-selection-controller`. A small selection-summary query supplies presentational data. `PlannerJoystick` reports intent; `PlannerCanvas` bridges intent to the page callback; the page calls the existing all-or-nothing `moveSelectedPlacements` controller. No new map-state or project schema fields.

**Constraints:** A multiple selection must never expose Copy or Rotate. A nudge validation failure must leave history untouched and surface the existing placement status. If no selection exists, the joystick must retain its camera-pan behavior. No backend, online feature, or dependency.

### Task 1: Add a validated multi-selection summary

- Modify: `src/editor/editor-selection-controller.ts`
- Test: `tests/editor/editor-selection-controller.test.ts`

- [ ] Write failing cases for empty, mixed, duplicate, and stale selection keys.
- [ ] Add `getPlacementSelectionSummary` that validates all selected keys and returns only a count.
- [ ] Run targeted controller tests and typecheck.

### Task 2: Render distinct single and multiple inspectors

- Modify: `src/components/selection-inspector.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/selection-inspector.test.tsx` (add if absent)

- [ ] Write failing SSR assertions: a multi selection says its count and has only Dismiss/Delete; a single selection retains Rotate/Copy/Delete.
- [ ] Implement a discriminated presentational prop union and select it in the page using selection count.
- [ ] Run focused tests and typecheck.

### Task 3: Make joystick arrows nudge an active selection

- Modify: `src/components/planner-joystick.tsx`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/planner-joystick.test.tsx`
- Test: `tests/editor/editor-selection-controller.test.ts`

- [ ] Write failing tests for selection-aware joystick accessible names and a one-tile group nudge that commits once; verify a rejected move preserves history.
- [ ] Add an optional `onNudge` interface. When supplied, buttons report move-selection intent; otherwise preserve pan intent.
- [ ] Let the page pass nudge only with a non-empty selection and delegate to `moveSelectedPlacements` with a unit tile delta.
- [ ] Run focused tests and typecheck.

### Task 4: Verify and review

- [ ] Request independent read-only review focused on controller validation, no accidental camera-pan fallback, and accessibility labels; resolve P0/P1.
- [ ] Run `pnpm test --run`, `pnpm typecheck`, and `pnpm build` serially.
