# React/Pixi Bed Semantics Design

## Decision

Implement only the frozen bed family after rugs. Tables and held items remain
excluded. The implementation uses the existing snapshot `bedType`, rotation,
and footprint fields, so it adds no persistence field and no new interaction
mode.

The frozen editor exposes Fill for placeables but omits `bedType` on filled
beds. This implementation keeps the user-visible Fill capability while fixing
that omission: every cursor or Fill placement receives the catalog's
dataset-derived bed type. This is the confirmed minimum extension because
removing Fill would reduce functional parity and persisting an untyped bed
would break collision correctness.

## Verified dataset contract

Furniture classification comes only from the locked `Furniture.json` `Type`
field. Placement, Fill, rendering, and React components must not contain bed ID
tables.

The exact records are:

- Type `bed`: `2048`, `2176`, `BluePinstripeBed`, `MidnightBeachBed`;
- Type `bed double`: `2052`, `2058`, `2064`, `2070`, `2180`, `2186`, `2192`,
  `2496`, `2502`, `2508`, `2514`, `BluePinstripeDoubleBed`, `JojaBed`,
  `WizardBed`, `JunimoBed`, `RetroBed`, `MidnightBeachDoubleBed`;
- Type `bed child`: `2076`.

Every record has exactly one rotation. Single and child beds use a `2x4`
sprite with a `2x3` placement footprint. Double beds use a `3x4` sprite with a
`3x3` placement footprint. Rendering therefore overhangs the footprint by one
tile above the placement origin while click, erase, selection, and z-order use
the full placement footprint.

## Frozen collision contract

The bed placement footprint has two different roles:

- full footprint: map bounds, ordinary item/fence overlap, and building
  overlap;
- terrain collision mask: every footprint tile except row zero. The masked
  tiles require passability and reject crop or building additional-placement
  occupancy. Row zero keeps the frozen exemption.

Existing double beds reserve exactly one exit tile at `(bed.x - 1, bed.y + 1)`.
A later `layer=item` ordinary item, grass, single bed, double bed, or child bed
may not cover that tile. A rug may cover it; fences and paths remain allowed.
The frozen bed-row-zero exemption also skips this reverse-exit check, so a
later bed may cover the exit with its sprite-overhang row. Moving the same
double bed excludes its own exit reservation.

Candidate exit clearance is:

- double: the left exit `(x - 1, y + 1)` must be free;
- single: at least one of left `(x - 1, y + 1)` or right
  `(x + footprint.width, y + 1)` must be free;
- child: no exit-clearance tile.

For exit checks, no item/fence is free, and a rug is also free. Candidate bed
footprints otherwise reject ordinary items and fences across the full
footprint but ignore rugs and grass, matching the frozen overlap filter. Paths
remain non-blocking.

Validation order is stable and explicit:

1. validate the candidate bed type, rotation, footprint, and collision mask;
2. visit footprint cells in row-major order and check map bounds on every cell;
3. skip the remaining per-cell checks for row zero;
4. on each non-row-zero cell, check passability, then existing double-bed exit
   reservation, then terrain/crop occupancy;
5. check the candidate bed's own exit clearance;
6. check full-footprint item/fence overlap;
7. check full-footprint building overlap.

Existing non-bed furniture and Task 5D-1 rug rules must not change.

## Fill contract

Beds expose `fill` through dataset-derived furniture metadata. Other ordinary
furniture remains non-fillable.

Bed Fill tiles the selected rectangle by the active bed footprint, using the
top-left corner of each complete footprint as a candidate origin. Each
candidate is validated against the placements accepted earlier in the same
gesture. Invalid candidates are skipped; valid candidates are committed as one
history entry. Every created item has the exact catalog `bedType`; `null` or
`undefined` is invalid for a bed.

If the rectangle contains no complete bed footprint, Fill reports zero
placements and returns the source history unchanged. If it contains candidate
origins but every candidate is rejected, the source history remains unchanged
and the result reports the first concrete placement rejection. Fill reuses
cursor placement and placement validation interfaces; React components contain
no bed type branch.

## Data, rendering, and interaction boundaries

- Snapshot `bedType` is narrowed to `single | double | child | null` and fails
  fast on every other received value.
- Catalog furniture Type determines the expected bed type.
- Rendering fails fast if furniture Type, catalog `bedType`, placement
  `bedType`, rotation, or footprint disagree.
- Generic full-footprint selection, click, erase, move, duplicate, Q, z-order,
  undo, redo, local save/load, and reference round-trip remain the public
  action paths.
- Bed records have one rotation and no variant, so pending and selected Q are
  no-ops and must not add history.
- Game Save `<furniture>` remains explicitly unmapped; this task does not add
  XML furniture import.

## Module boundaries

- A small placement-domain module owns typed bed metadata, collision masks,
  and exit coordinates as pure functions.
- Placement validation consumes those functions through its existing public
  candidate interface.
- Catalog parsing is the only source of Type classification and Fill
  capability.
- Fill owns rectangle enumeration and atomic history composition, not bed
  collision rules.
- Rendering owns catalog-versus-placement consistency checks, not collision.

## Verification

- Strict RED/GREEN tests for every bed type, invalid type/rotation/footprint/
  mask, top-row exemption, lower-row terrain, crop, building, item, fence,
  path, grass, and rug behavior.
- Bidirectional exit tests: placing a bed beside existing blockers and placing
  later candidates over an existing double-bed exit.
- Move self-exclusion, duplicate, copy, Q no-op, click, erase, z-order,
  rendering overhang, undo/redo, Fill skip, and zero-footprint no-op.
- Snapshot, local persistence, reference compatibility, and Game Save boundary
  tests.
- Focused suites, official Vitest suite, typecheck, production build, diff
  check, and independent P0-P2 review.
