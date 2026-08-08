# React/Pixi Workspace Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` and strict TDD. The historical
> branch is read-only evidence; port only code proven compatible with current
> APIs and the canonical repository.

**Goal:** Compose the existing React/Pixi domain modules into a complete editor
with the frozen editor's current feature, visual, responsive, and interaction
contract.

**Architecture:** A pure reducer owns serializable UI/workspace state. The
workspace component only orchestrates existing controllers, panels, modal
boundaries, repository operations, and Canvas ports. `PlannerCanvas` retains
exclusive ownership of Pixi internals and lifecycle.

**Tech Stack:** React, TypeScript, Pixi.js, existing editor/placement/map/
project/catalog modules, Vitest/jsdom.

## Constraints

- Do not use `LocalProjectStoreV2` or historical migration code.
- Preserve existing component DOM class contracts and control positions.
- Do not add Redux, Zustand, query libraries, or a new UI/i18n layer.
- Unknown reducer actions and invalid repository/resource state fail fast.
- Keyboard shortcuts must ignore input, textarea, and contenteditable targets.

### Task 1: Workspace reducer, state hook, and invariants

**Files:**

- Create: `src/planner/planner-workspace-state.ts`
- Create: `src/planner/use-planner-workspace-state.ts`
- Create: `tests/planner/planner-workspace-state.test.ts`
- Create: `tests/planner/use-planner-workspace-state.test.tsx`
- Modify: `src/placement/placement-history.ts`
- Modify: `tests/placement/placement-history.test.ts`

- [x] Compare the historical reducer with current `editor-view-state`,
  display/behavior options, render options, and placement history APIs.
- [x] Write RED tests for map/season/tool/category/panel/modal/menu/display/
  behavior/render transitions, selection clearing, history reset, undo/redo
  boundaries, canonical active project/map identity, runtime loading/error,
  and unknown actions.
- [x] Narrow-port only compatible reducer behavior and add the three required
  runtime/canonical identity fields. Do not port locale or V2 project fields.
- [x] Implement the state hook as the single owner of reducer dispatch,
  selection/history transitions, and keyboard shortcut lifecycle.
- [x] Run focused tests and typecheck.

### Task 2: Canonical project workspace hook

**Files:**

- Create: `src/reference-runtime/use-reference-project-workspace.ts`
- Create: `tests/reference-runtime/use-reference-project-workspace.test.tsx`

- [x] Write RED lifecycle/error tests for repository refresh, open, save,
  duplicate project, import remapping, map transfer, and active map changes.
- [x] Implement the hook as the only workspace layer that talks to the
  canonical repository/adapter. It must not touch Canvas or Pixi refs.
- [x] Add a staged static dependency test proving the Task 2 hook does not
  import V2 store/schema/editor-actions or migration modules. Extend the gate
  to the workspace/host in Task 3 and the canonical project panels in Task 4
  when those files are created or migrated.
- [x] Run focused hook/repository tests and typecheck.

### Task 3: Initial workspace shell and basic editing loop

**Files:**

- Create: `src/components/planner-workspace.tsx`
- Create: `tests/components/planner-workspace.test.tsx`
- Create: `tests/components/planner-workspace.editing.integration.test.tsx`

- [ ] Write RED tests that loading reserves the current workspace geometry,
  success renders menu/toolbar/catalog/canvas, error shows an alert without
  touching storage, and Canvas readiness controls the interactive state.
- [ ] Wire cursor/place/select/move/nudge/duplicate/rotate/fill/erase/delete,
  undo/redo, map/season, zoom/pan, overlays, behavior/display options, current
  selection inspector, and basic keyboard shortcuts through existing modules.
- [ ] Keep event handlers small and named by operation. The component's main
  body only composes hooks, handlers, Canvas props, and panels.
- [ ] Add the Standard Farm interaction RED/GREEN path through save/reload.
- [ ] Run focused workspace/component/controller tests and typecheck.

### Task 4: Projects, maps, import/export, and summaries

**Files:**

- Modify: `src/components/planner-workspace.tsx`
- Modify: `src/components/local-project-panel.tsx`
- Modify: `src/components/project-map-instance-panel.tsx`
- Create: `src/projects/reference-project-export-file.ts`
- Create: `src/components/planner-save-modal-content.tsx`
- Create: `src/components/planner-game-save-modal-content.tsx`
- Create: `src/components/planner-farm-summary-modal-content.tsx`
- Create: `tests/components/planner-workspace.projects.integration.test.tsx`
- Modify focused component tests for the two panel interfaces.

- [ ] Write RED tests for project create/open/duplicate/rename/delete/import/export and
  map create/open/rename/duplicate/delete/copy/move, active-map persistence,
  thumbnails, standard/high-quality screenshots, game-save XML plus unmapped
  feedback, and farm summary in current map/season context.
- [ ] Adapt panel props to canonical reference summaries without changing DOM
  classes, labels, button order, modal flow, or keyboard behavior.
- [ ] Remove panel imports of V2 summary and `local-project-editor-actions`;
  use the focused reference export-file module instead.
- [ ] Wire the canonical repository and reversible adapter. Each UI operation
  calls one repository method; components never manipulate localStorage.
- [ ] Lazy-load the three unopened heavy modal-content modules only after their
  modal ID opens. Add delivery tests using a unique module marker to prove they
  are absent from the initial client chunk and requested only on open.
- [ ] Run project, import/export, screenshot, summary, component, and workspace
  integration suites.

### Task 5: Advanced properties, interiors, and all maps

**Files:**

- Modify: `src/components/planner-workspace.tsx`
- Modify only when a verified prop gap exists: current inspector/interior/map
  configuration components and their focused tests.
- Create: `tests/components/planner-workspace.feature-parity.integration.test.tsx`

- [ ] Write RED coverage for paint, tint, light/night, variant, lock, rug,
  table, bed, wallpaper/floor, Ginger Island, farmhouse configuration, every
  current overlay, touch/pinch/joystick, and the verified map/season matrix.
- [ ] Connect existing ports and controller functions. Do not recreate domain
  logic inside React components.
- [ ] Add a matrix smoke test that reports the exact map/season on resource or
  rendering contract failure.
- [ ] Run feature-parity integration tests and related unit tests.

#### Task 5A completion: existing ports, interiors, X-ray, and map matrix

- [x] Composed the existing interior-decor panel, controller, shared placement
  history, and Canvas apply/reject ports without adding a second persistence
  path.
- [x] Made decor selection exclusive with ordinary catalog, tool, map picker,
  and canonical project-map Open actions; Escape and Cancel leave history
  unchanged.
- [x] Added transient hold-Space X-ray with editable/modifier guards, default
  scroll prevention, keyup/blur reset, listener rollback, and no reducer or
  persistence fields.
- [x] Added a strict local `plannerMaps` by four-season resource matrix with
  exact failure context, safe local paths, exact returned identities, and
  non-empty rendering layers/tilesets.
- [x] Final focused verification passed 10 files / 73 tests, the production
  build passed with 30 static pages, `pnpm typecheck` passed, and independent
  final specification review returned Clean.

Task 5B (catalog rotation/variant/flip) and Task 5C (rug/bed/table-held-item
semantics) remain before Task 5 can be marked complete.

### Task 6: Visual and responsive parity contract

**Files:**

- Modify only editor-related selectors: `app/globals.css`
- Modify: `tests/routes/public-page-style-contract.test.ts`
- Create: `tests/components/planner-workspace-layout.test.tsx`
- Create: `docs/verification/2026-08-02-react-pixi-editor-baseline.md`

- [ ] Inventory the current frozen workspace geometry at 1440x900, 1024x768,
  and 390x844 before CSS edits. Save screenshots under
  `docs/verification/assets/react-pixi-baseline/{desktop,compact,mobile}.png`
  and record menu/toolbar/catalog/canvas/modal bounding rectangles, tab order,
  minimum hit targets, and `scrollWidth === clientWidth` in the baseline file.
- [ ] Add RED layout/contract assertions for control presence/order, reserved
  height, side panels, modal geometry, focus order, hit targets, and no
  horizontal overflow.
- [ ] Implement the smallest editor-scoped CSS rules required by the already
  existing React class names. Do not change public content styling.
- [ ] Serve a built `out/`, capture matching screenshots, and compare geometry
  and interactions. Record verified deviations instead of hiding them.
- [ ] Run all workspace suites, typecheck, build, and diff check.
