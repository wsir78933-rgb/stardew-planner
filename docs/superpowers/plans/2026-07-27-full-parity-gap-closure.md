# Stardew Planner full parity gap closure

> **Execution note:** Apply this plan in small TDD work packages. The authorised
> scope is the fixed StardewPlan snapshot, with only account, payment, cloud,
> sharing and feedback features removed.

**Goal:** Close the verified public-site and planner gaps that still prevent
claiming functional parity with the fixed reference snapshot.

**Architecture:** Keep the editor client-only and static. Put each new domain
rule behind a focused exported function, then let `app/page.tsx` coordinate the
rule with React state. Persist only domain state already owned by the local
project snapshot. Do not add remote APIs, service layers, or speculative
extension points.

**Tech stack:** Next.js static export, React, TypeScript, PixiJS, existing
localStorage project store and local asset lock.

---

## Work package 1: Reference UI and keyboard guidance

**Files:**
- Modify: `src/editor/editor-view-state.ts`
- Modify: `src/components/editor-menu-bar.tsx`
- Modify: `src/components/item-catalog-panel.tsx`
- Modify: `src/components/editor-modal.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/editor/editor-view-state.test.ts`
- Test: `tests/components/editor-modal.test.tsx`
- Test: `tests/components/item-catalog-panel.test.tsx`

1. Add failing tests for the new modal IDs and reference shortcut/help content.
2. Add focused modal IDs for Help, Keyboard Shortcuts and What's New.
3. Add the original-reference Help entry point to the catalog surface and a
   Keyboard Shortcuts entry point in that same workflow.
4. Render static local reference content; exclude Feedback and Support.
5. Add styles that preserve the current responsive modal shell.
6. Run focused tests and typecheck.

## Work package 2: Accurate selection traversal and X-ray

**Files:**
- Modify: `src/editor/editor-selection-controller.ts`
- Modify: `src/editor/editor-display-options.ts`
- Modify: `src/editor/browser-editor-preferences.ts`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `app/page.tsx`
- Test: `tests/editor/editor-selection-controller.test.ts`
- Test: `tests/editor/editor-display-options.test.ts`
- Test: `tests/editor/browser-editor-preferences.test.ts`
- Test: `tests/components/planner-canvas.test.ts`

1. Add failing selection tests for same-tile cyclic selection and wrap-around.
2. Extend the controller input with the current selection only; avoid hidden
   editor state dependencies.
3. Add hold-Space page coordination that matches the reference interaction;
   do not persist transient X-ray state.
4. In Pixi, make X-ray a reversible rendering-only opacity change that never
   mutates placement or export state.
5. Run focused tests and typecheck.

## Work package 3: Local project map parity

**Files:**
- Modify: `src/projects/local-project-store.ts`
- Modify: `src/projects/local-project-editor-actions.ts`
- Modify: `src/components/project-map-instance-panel.tsx`
- Modify: `src/components/editor-modal.tsx`
- Modify: `app/page.tsx`
- Test: `tests/projects/local-project-store.test.ts`
- Test: `tests/projects/local-project-editor-actions.test.ts`
- Test: `tests/components/project-map-instance-panel.test.tsx`
- Test: `tests/components/editor-modal.test.tsx`

1. Add failing store tests for copying and moving an existing map instance to
   another local project, including source retention/removal and invalid IDs.
2. Implement focused store operations atomically using the existing validation
   boundary.
3. Add project map controls with an explicit destination project selection.
4. Give the map picker the locked preview image and preserve category grouping.
5. Run focused tests and typecheck.

## Work package 4: Building paint data, persistence and rendering

**Files:**
- Add: `src/paint/building-paint.ts`
- Modify: `src/placement/placement-snapshot.ts`
- Modify: `src/editor/editor-selection-controller.ts`
- Modify: `src/rendering/placement-rendering.ts`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `src/components/selection-inspector.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/paint/building-paint.test.ts`
- Test: `tests/placement/placement-snapshot.test.ts`
- Test: `tests/editor/editor-selection-controller.test.ts`
- Test: `tests/rendering/placement-rendering.test.ts`
- Test: `tests/components/selection-inspector.test.tsx`

1. Add parser tests against the locked `PaintData.json`, including malformed
   values and exact invalid-value errors.
2. Model optional building paint colours in the existing building snapshot and
   keep older local JSON valid without implicit data loss.
3. Add a focused selection-controller operation that can only paint supported
   buildings, then uses ordinary placement history for undo/redo.
4. Render colours through the locked building paint mask assets; preserve the
   base sprite and make paint omission a no-op.
5. Add small inspector controls for the paintable channels; save/restore via
   the current project snapshot and JSON path.
6. Run focused tests and typecheck.

## Work package 5: Static page and final parity verification

**Files:**
- Modify: `app/farm-comparison/page.tsx`
- Modify: `app/farm/[type]/page.tsx`
- Modify: `app/mods/page.tsx`
- Modify: `src/components/mod-map-card-grid.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/routes/static-routes.test.ts`
- Test: `tests/components/farm-comparison-content.test.tsx`
- Test: `tests/components/farm-guide-content.test.tsx`
- Test: `tests/components/mod-map-card-grid.test.tsx`

1. Add failing assertions for the verified original labels, card actions and
   only the intentionally rewritten local privacy/terms text.
2. Align the public routes with the frozen source structure and retain links
   only where they exist in the reference or are required by the local-only
   replacement.
3. Run all unit tests, `pnpm typecheck`, and `pnpm build`.
4. Start the static export and verify the planner, map picker, project maps,
   Help, shortcuts, X-ray, Paint, JSON persistence, desktop and 390px mobile
   states through the local browser.

## Executed verification

- Completed work packages 1–4: reference help panels, cyclic selection,
  hold-Space X-ray, local cross-project map copy/move, map previews and
  locked PaintData/PaintMask building paint are implemented.
- `pnpm test --run`: 67 files and 545 tests passed.
- `pnpm typecheck` and `pnpm build` passed; the production build exported all
  retained public routes.
- Local browser verification at desktop and 390px mobile widths covered the
  canvas, 48 map previews, Help content, four map groups, local project
  creation, building paint commit/undo and responsive controls.
