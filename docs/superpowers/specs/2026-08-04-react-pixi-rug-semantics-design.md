# React/Pixi Rug Semantics Design

## Decision

Implement rugs as the first furniture-semantics family. This is the smallest
independent closed loop that matches the frozen editor without adding a
snapshot field or a new interaction.

The selection order is:

1. stable and simple;
2. stable;
3. simple.

Beds remain separate because they require top-row passability exceptions,
single/double-bed exit clearance, and reverse blocking around double beds.
Table-held items remain separate because they require a parent-child action
contract across placement, move, delete, duplicate, rotation, rendering, and
click targeting.

## Verified dataset contract

Furniture classification comes only from the locked `Furniture.json` `Type`
field. The catalog loader derives `isRug` from `Type === "rug"`; placement and
rendering code must not contain rug ID tables.

The locked dataset contains 82 rugs. Their exact placement-footprint groups
are:

- `3x2`, one rotation: `1228`;
- `3x2/2x3`, two rotations: `1451`, `1456`, `1461`, `1618`, `1623`,
  `1664`, `1737`, `1902`, `1909`, `1964`, `1978`, `2488`, `JojaRug`,
  `SwirlRug`, `JunimoMat`, `RetroRug`;
- `2x2`, one rotation: `1628`, `1742`, `1777`, `SquareJojaRug`, `RuneRug`,
  `SquareJunimoRug`, `RetroSquareRug`;
- `2x1/1x2`, two rotations: `1755`;
- `1x1`, one rotation: `2637` through `2652`, `GrayJojaCushion`,
  `JojaCushion`, `WizardCushion`, `DarkWizardCushion`, `JunimoCushion`,
  `DarkJunimoCushion`, `RetroCushion`, `DarkRetroCushion`, `BlueCushion`,
  `YellowCushion`, `GreenCushion`, `RedCushion`, `BrownCushion`,
  `BlackCushion`, `SixPackRings`, `GreenBottle`, `AluminumCan`, `BlueBottle`,
  `Wrapper`, `SpilledBeverage`, `MessyShirt`, `MessyShorts`;
- `6x4`, one rotation: `2742`;
- `4x3`, one rotation: `2784`, `2790`, `2794`, `2798`, `2802`, `JunimoRug`,
  `LargeRetroRug`;
- `5x4`, one rotation: `2870`, `2875`;
- `3x3`, one rotation: `SandyRug`, `CircularJunimoRug`;
- `4x3/3x4`, two rotations: `DesertRug`;
- `5x3`, one rotation: `LargeJojaRug`, `StarryMoonRug`;
- `2x1`, one rotation: `SmallJojaRug`, `SmallJunimoMat`, `RetroMat`;
- `4x4`, one rotation: `StoneFlooring`.

The current catalog already derives these exact rotation footprints from the
dataset. The renderer and collision validator consume the persisted footprint;
they must not recalculate it from an ID.

## Deferred-family audit inventory

Beds also need no new snapshot field, but their verified behavior is not an
independent simple rule. Exact records and footprints are:

- Type `bed`, `2x3`, one rotation: `2048`, `2176`, `BluePinstripeBed`,
  `MidnightBeachBed`;
- Type `bed double`, `3x3`, one rotation: `2052`, `2058`, `2064`, `2070`,
  `2180`, `2186`, `2192`, `2496`, `2502`, `2508`, `2514`,
  `BluePinstripeDoubleBed`, `JojaBed`, `WizardBed`, `JunimoBed`, `RetroBed`,
  `MidnightBeachDoubleBed`;
- Type `bed child`, `2x3`, one rotation: `2076`.

The frozen validator exempts a bed's first footprint row from passability,
requires one clear side exit for a single bed, requires the left exit for a
double bed, and prevents ordinary furniture from occupying the double-bed exit.
Rugs count as clear for those exit checks. That cross-family behavior is why
beds are deferred.

Tables already have a persisted optional `heldItemId`, but the relation is not
implemented as a safe action chain. Exact table records and footprints are:

- Type `table`, `2x1/1x2`, two rotations: `724`, `727`, `JojaCoffeeTable`,
  `GrayJojaCoffeeTable`;
- Type `table`, `2x2`, one rotation: `1120`, `1122`, `1124`, `1126`, `1128`,
  `1130`, `1132`, `1134`, `1136`, `1138`, `1140`, `1142`, `1144`, `1146`,
  `1148`, `1150`, `1216`, `1218`, `1220`, `1222`, `1224`, `1226`,
  `DesertTable`, `JojaTable`, `WizardTable`, `JunimoTable`, `RetroTable`;
- Type `table`, `1x1/1x1`, two rotations: `1391`, `1393`, `1395`, `1397`,
  `DesertEndTable`, `JojaEndTable`, `GrayJojaEndTable`, `WizardEndTable`,
  `JunimoEndTable`, `RetroEndTable`;
- Type `table`, `1x1`, one rotation: `1399`, `1400`, `1401`;
- Type `long table`, `5x2/2x4`, two rotations: `800`, `807`, `814`, `821`,
  `BountifulDiningTable`.

The frozen relation is `table.heldItemId -> child item`. Only a one-tile
furniture item can be dropped; the target normal table must be vacant. A long
table is rendered as capable of holding its existing child but is not a new
drop target. Move, cancel, delete, group move, Q, click redirection, and z-order
all operate on the parent-child pair. Game Save furniture import does not
provide this pair. Tables therefore require a later relational action contract
and are excluded from this rug implementation.

## Frozen behavior

- A rug candidate still obeys map bounds, passability, crop, and building
  rules.
- A rug may overlap an ordinary item regardless of which one was placed first.
- An ordinary item may overlap an existing rug.
- A rug may not overlap another rug. Any intersecting tile in the full,
  rotation-aware footprint rejects placement as `occupied-by-item`.
- Ordinary item versus ordinary item remains invalid.
- Paths remain non-blocking beneath furniture. Rug semantics do not add Fill to
  furniture tools.
- Item render z-order is path `0.1`, rug `0.2`, otherwise
  `(tileY + footprint.height) * 2 - 1`.
- Single-tile selection and erase target the visually highest unlocked item, so
  an ordinary item above a rug is selected or erased first. Rectangle selection
  and rectangle erase continue to include every intersecting unlocked item.

## Data and validation boundaries

No snapshot or reference-envelope field is added. `isRug`, rotation,
footprint, history, local save/load, and canonical import/export already round
trip.

At the rendering boundary, the persisted `isRug` value must agree with the
catalog's dataset-derived furniture metadata. A mismatch fails immediately and
reports the item ID, catalog Type, expected flag, and received flag. Placement
validation continues to validate the snapshot-carried boolean because it does
not receive the catalog.

## Module boundaries

- A small placement-domain function owns item z-order. Rendering, selection,
  and erase use that public function.
- Placement validation owns overlap policy and applies it through its existing
  candidate validation interface.
- Catalog parsing remains the only source of furniture Type classification.
- React components do not contain rug IDs, collision rules, or z-order rules.

## Verification

- Strict RED/GREEN tests for bidirectional rug/ordinary overlap, rug/rug
  rejection, ordinary/ordinary regression, rotated footprints, terrain,
  crop/building/path preservation, and invalid flags.
- Controller tests for placement, move, duplicate/copy, rotation, selection,
  erase, and history behavior.
- Rendering tests for exact z-order, stable shared keys and selection tint, and
  catalog/persisted metadata mismatch.
- Existing snapshot, local persistence, and reference compatibility suites.
- Focused tests, official Vitest suite, typecheck, build, and diff check.
