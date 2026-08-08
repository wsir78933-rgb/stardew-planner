# React/Pixi Rug Semantics Implementation Plan

## Scope

Implement only the frozen rug family. Do not implement beds, table-held items,
new UI controls, Fill, snapshot fields, Game Save furniture import, SEO, route,
or frozen-bundle changes.

## Task 1: Lock the collision contract

- Add failing placement-validation tests for both rug/ordinary placement
  orders, rug/rug intersection, ordinary/ordinary regression, rotated rug
  footprints, and unchanged map/crop/building/path rules.
- Add the smallest candidate-specific item occupancy function.
- Keep map validation before occupancy and keep free placement behavior intact.

## Task 2: Share frozen item z-order

- Add failing pure tests for path `0.1`, rug `0.2`, and ordinary footprint-bottom
  z-order, including invalid received values.
- Add one placement-domain z-order function.
- Use the function in render entries, single-tile selection ordering, and
  single-tile erase targeting.
- Preserve stable order for equal z values and preserve rectangle behavior.

## Task 3: Enforce Type-derived rendering metadata

- Add failing rendering tests for rug z-order, ordinary/path z-order, stable
  key/tint, a non-rug Type negative case, and a persisted/catalog `isRug`
  mismatch.
- Validate furniture `isRug` against its `furnitureType` and validate persisted
  `isRug` against the catalog classification at the rendering boundary.
- Apply the same base item z-index to every visual layer sharing an item key.

## Task 4: Prove controller and persistence closure

- Add or extend focused tests for place, move, duplicate/copy, Q rotation,
  undo/redo, single/rectangle selection, single/rectangle erase, and lack of
  Fill on a real dataset rug.
- Re-run existing snapshot, local project, and reference adapter round-trip
  tests covering `isRug` and footprint preservation.
- Do not add Game Save furniture behavior; verify the existing unmapped boundary
  remains unchanged.

## Task 5: Verify and review

- Run focused suites after each GREEN step.
- Run the official Vitest command, typecheck, build, and `git diff --check`.
- Request an independent P0-P2 review of the rug-only diff.
- Record exact results in the Task 5 feature-parity plan and stop before beds or
  tables.

## Completion record

- Collision RED reproduced both missing bidirectional overlap behavior and the
  incorrect rug/fence rejection. The candidate-specific occupancy GREEN keeps
  rug/rug and ordinary/ordinary blocked.
- Z/target RED reproduced missing z values, rug-first click/erase mistakes, and
  absent Type/isRug mismatch errors. The shared placement z-order GREEN is used
  by rendering, single-tile selection, and single-tile erase; rectangle paths
  are unchanged.
- Independent review found one P1: free placement accepted `isRug: true` on a
  path or fence candidate. A second RED/GREEN added the candidate-boundary
  semantic check before free-placement early return. Independent re-review
  closed the finding and returned a clean P0/P1/P2 verdict.
- Focused controller/catalog suite: 7 files, 127 tests passed.
- Snapshot/history/reference/Game Save boundary suite: 7 files, 155 tests
  passed.
- Final official suite: 140 files, 1329 tests passed.
- `pnpm typecheck`, `pnpm build`, and `git diff --check` passed. The build
  generated all 30 static pages.
- Hermes CDP production smoke loaded the current frozen default runtime with 50
  canvases and no page or console error. The React `PlannerWorkspace` is not yet
  mounted on a public route, so React rug click/erase behavior is proven by the
  controller/render/integration suites until the later cutover task.
- No commit, push, deployment, dependency installation, frozen-runtime change,
  or external write was performed.
