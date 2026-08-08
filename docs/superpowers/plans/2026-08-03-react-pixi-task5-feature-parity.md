# React/Pixi Task 5 Feature-Parity Plan

## Decision rule

For every implementation choice, use this order:

1. stable and simple;
2. stable;
3. simple.

This rule selects the implementation method. It does not reduce the confirmed
functional-parity scope.

## Verified frozen-runtime boundaries

- Weather remains disabled because the frozen editor also disables it.
- `locked` remains a protected source/entity property. The frozen editor has no
  user-facing lock or unlock control, so this project must not invent one.
- Interior wallpaper/flooring, hold-Space X-ray, item/building variants, item
  flipping, rug overlap, bed clearance, and table-held-item behavior are active
  frozen-editor behaviors and remain in scope.

## Task 5A: Existing-port composition

### Scope

- Compose the existing `InteriorDecorPanel`, interior-decor history controller,
  and `PlannerCanvas` ports in `PlannerWorkspace`.
- Selecting decor clears ordinary catalog placement, duplicate placement, and
  placement selection. Escape cancels the active decor pattern.
- Applying decor commits to the existing placement history; it must not create a
  second history or persistence path.
- A rejected wall/floor click must leave history unchanged and expose a concise,
  accessible message containing the rejected map and decor kind.
- Add transient hold-Space X-ray with keydown, keyup, and window-blur reset.
  Ignore editable targets and never persist X-ray state.
- Add a real local-resource smoke matrix for every `plannerMaps` entry across
  spring, summer, fall, and winter. A failure must identify the exact map and
  season.

### Boundaries

- Reuse existing domain/controller modules; do not duplicate their logic inside
  React components.
- Use plain functions and a small keyboard-listener port; do not add classes or
  framework dependencies.
- Do not change catalog variant metadata, placement validation, furniture
  semantics, CSS geometry, route selection, SEO, frozen assets, or persistence
  formats in this subtask.

### Verification

- Focused RED/GREEN tests for workspace decor composition and X-ray keyboard
  behavior.
- Interior-decor controller/panel and PlannerCanvas focused tests.
- Exact map/season local-resource matrix.
- `pnpm typecheck` and `git diff --check`.

## Task 5B: Catalog presentation choices

After 5A review is clean, expose the frozen editor's verified placement
rotation, variant, and flip choices and pass them through the existing
catalog-to-placement boundary. Do not include rug, bed, or table collision
semantics in this subtask.

### Verified frozen behavior

- Pending placement `Q` cycles rotations first, then tree variant `0/1`, then
  other variants. A furniture rotation also changes the pending footprint.
- Selected placement `Q` cycles tree variants first, then other variants, then
  rotations. A rotation is accepted only when its rotated footprint passes the
  existing placement validation.
- Catalog controls expose only capabilities present on the item: rotate,
  labeled variant cycle, and flip.
- Furniture uses the `Rotations` count already present in the locked furniture
  dataset. Tree flip/variant sets, object variants, BigCraftable Lit/Unlit,
  hoedirt Dry/Watered, and Fish Pond net variants must match the audited frozen
  ID sets exactly.
- Existing opaque building fields remain lossless. React only projects and
  writes a numeric building variant when the building has a verified variant
  capability.

### 5B1: Domain capability and transition contract

- Add one immutable catalog presentation-capability contract containing only
  verified rotation footprints, labeled variants/render descriptors, and flip
  support.
- Add small pure functions that validate a pending choice and calculate the
  frozen next choice for pending and selected contexts.
- Fail fast on unsupported or out-of-range values with the catalog item ID and
  received value in the error.
- Populate capabilities in catalog loaders; UI and controllers must not contain
  item-ID special cases.

### 5B2: Item controls, placement, selection, and rendering

- Make the item catalog controls controlled by `PlannerWorkspace`; remember
  each item's validated choice by item ID, matching the frozen catalog's
  rotation/variant/flip maps. Clearing active placement keeps those choices.
- Pass the validated choice through the workspace editing interface into the
  existing placement controller. Do not let React components create placement
  snapshot objects directly.
- Preserve selected-placement priority when both a catalog item and an existing
  placement are present. Otherwise `Q` follows the pending-placement priority.
- Render the verified variant and flip results, and keep furniture rotation
  footprint, collision, undo/redo, duplicate, export, and import consistent.

### 5B3: Fish Pond building variants

- Add the verified four Fish Pond variants (`Net 1`, `Net 2`, `Net 3`, `None`)
  to the building catalog and placement boundary.
- Extend the placement building snapshot with an optional validated numeric
  variant. Old snapshots without it remain valid and behave as variant `0`.
- When a source building contains an unsupported opaque variant value, retain
  it in the source envelope unless the user explicitly selects a supported
  Fish Pond variant.
- Rendering, undo/redo, duplicate, canonical import/export, and catalog labels
  must use the same building-variant descriptor.

### Task 5B verification

- RED/GREEN focused tests for catalog capability construction, choice
  validation, both `Q` priority orders, catalog accessibility, and placement
  boundary propagation.
- Visual resolver tests for every audited variant family and furniture
  rotation/flip.
- Snapshot and canonical round-trip tests, including old building snapshots and
  opaque source building variants.
- Focused integration tests, then `pnpm typecheck`, relevant suites,
  `pnpm build`, and `git diff --check`.

## Task 5D: Frozen furniture placement semantics

After 5B review is clean, implement and test frozen rug overlap, bed foot-side
clearance, and table-held-item behavior across place, move, copy, erase, render,
undo/redo, and canonical persistence. This is last because it has the largest
regression surface.

### Task 5D-1: Rugs

The joint frozen/runtime audit selected rugs first under the stable-and-simple
priority. Rugs require no new snapshot field or UI branch. Implement only their
dataset-derived classification, bidirectional overlap rule, exact item z-order,
and visually highest click/erase targeting. Keep beds and table-held items out
of this closed loop. See the dedicated rug design and implementation plan dated
2026-08-04.

Status: complete. Final verification passed 140 test files and 1329 tests,
typecheck, production build, and diff check. Independent P0-P2 review is clean.

### Task 5D-2: Beds

Status: complete. The frozen audit confirmed that no snapshot field or new
interaction is required. Beds use dataset-derived typed metadata, collision
masks, exit clearance, frozen row-zero/reverse-exit ordering, and the confirmed
Fill behavior described in the dedicated bed design and implementation plan
dated 2026-08-04. Final verification passed 141 test files and 1353 tests,
typecheck, production build, and diff check. Independent P0-P2 review is clean.

### Task 5D-3: Tables and held items

Status: complete. The React editor uses a non-recursive nested held-item model
with a lossless reference-project projection back to the frozen top-level child
plus `heldItemId` format. New placement accepts only eligible one-tile furniture
on an empty ordinary table; loaded long-table relationships remain compatible.
Selection, move, Q, copy, Delete, erase, tint/night state, undo/redo, canonical
ID mapping, and frozen parent-centered Pixi rendering are implemented without
adding child occupancy or a Canvas special branch.

Final verification passed the 11-file focused chain with 315 tests and the full
suite with 142 files and 1426 tests, plus typecheck, production build, and diff
check. Task-level and final cross-module P0-P2 reviews are clean. Browser/CDP
verification was unavailable because the configured browser runtime exposed no
browser backends; selector work remains intentionally unstarted.
