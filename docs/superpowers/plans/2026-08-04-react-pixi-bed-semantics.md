# React/Pixi Bed Semantics Implementation Plan

## Scope

Implement only Task 5D-2 Beds. Do not implement tables/held items, edit the
frozen runtime, change the default route, or add a persistence field.

## Step 1: Freeze the typed bed contract

- Add placement-domain tests for `single`, `double`, and `child` collision
  masks and exit coordinates.
- Add Fail Fast tests for invalid type, rotation, footprint, and mask values.
- Implement small pure functions with no catalog IDs.

## Step 2: Implement exact bidirectional validation

- Add candidate-bed tests for row-zero exemption and lower-row passability,
  terrain, crop, building, item, fence, grass, path, and rug behavior.
- Add exit-clearance tests for single, double, and child beds.
- Add reverse tests for later `layer=item` ordinary items/grass/beds, rug
  exemption, and allowed fence/path placement at an existing double-bed exit.
- Add move-self-exclusion tests.
- Route the rules through `validatePlacement` without changing ordinary or rug
  behavior.

## Step 3: Close catalog, Fill, rendering, and controls

- Test exact dataset-derived bed families, one-rotation footprints, sprite
  rectangles, Fill allowlist, and negative ordinary furniture cases.
- Extend Fill to tile complete bed footprints, skip rejected candidates, retain
  accurate `bedType`, and commit one undoable history entry.
- Test cursor placement, duplicate/copy/move, selected and pending Q no-op,
  click/erase, z-order, and bed rendering overhang.
- Fail Fast when catalog Type, catalog bed metadata, placement bed metadata,
  rotation, or footprint disagree.

## Step 4: Persistence and boundary closure

- Narrow snapshot bed values without adding a field.
- Test old non-bed snapshots, bed save/load, undo/redo, reference adapter and
  repository round trips.
- Preserve the verified Game Save boundary: furniture beds remain unmapped.

## Step 5: Review and official verification

- Run focused tests while developing.
- Run the exact official suite:
  `pnpm exec vitest run tests --testTimeout=15000`.
- Run `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- Request an independent P0-P2 review, fix verified findings, and rerun every
  official verification command.
- Record the final command results here and in the Task 5 plan. Stop before
  Tables/held-item.

## Completion record

Complete on 2026-08-04.

- Exact catalog contract: 4 single, 17 double, and 1 child bed, with no bed ID
  table in placement validation, rendering, or React code.
- Focused Beds/Reference/Game Save verification:
  `14` files and `306` tests passed.
- Independent final P0-P2 review: no findings; the reviewer reran `7` files
  and `159` tests successfully.
- Official suite:
  `pnpm exec vitest run tests --testTimeout=15000` passed `141` files and
  `1353` tests.
- `pnpm typecheck` passed.
- `pnpm build` passed and generated all `30` static/SSG pages.
- `git diff --check` passed.
- Game Save furniture remains explicitly unmapped. Tables/held items, frozen
  runtime, default routes, SEO, deployment, commit, and push were not changed
  by Task 5D-2.
