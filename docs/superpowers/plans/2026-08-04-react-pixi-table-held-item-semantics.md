# React/Pixi Table Held-Item Semantics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce the frozen editor's table held-item behavior with a non-recursive nested React snapshot model and lossless reference-project projection.

**Architecture:** `PlacementItem.heldItem` is the only operational relationship in the React editor. The nested child retains a globally unique numeric instance ID but never enters the top-level item array, occupancy index, or map collision. The reference adapter is the only layer that converts between this canonical nested representation and the frozen top-level child plus `heldItemId` pointer envelope; unresolved legacy strings remain opaque.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Pixi.js 8, Vitest 3.

## Global Constraints

- Preserve current user-visible features, visual positions, and existing data compatibility.
- New attachment accepts only exact 1x1, `layer=item`, non-wall catalog furniture onto an empty ordinary table; long tables and occupied tables reject without swapping.
- 1x1 rugs and 1x1 tables may be held. Beds, wall furniture, non-furniture, path, and fence placements may not.
- `PlacementHeldItem` is explicit and non-recursive. `heldItem` and deprecated opaque `heldItemId` are mutually exclusive.
- All top-level and nested item instance IDs are unique; `nextItemId` is greater than every one of them.
- Reject invalid snapshot/reference relationships before identifier allocation or history commit, with parent/child IDs and received values in the error.
- Do not expand Game Save furniture mapping, change SEO/default routes, edit the frozen runtime, install dependencies, start selector work, commit, push, or deploy.
- Use high cohesion, low coupling, single responsibility, KISS, Fail Fast, YAGNI, and precise names.

---

### Task 1: Canonical nested snapshot contract

**Files:**
- Modify: `src/placement/placement-snapshot.ts`
- Create: `src/placement/table-held-item-semantics.ts`
- Test: `tests/placement/placement-snapshot.test.ts`
- Test: `tests/placement/table-held-item-semantics.test.ts`

**Interfaces:**
- Produces: `PlacementHeldItem`, `findPlacementItemOrHeldItem`, `replacePlacementItemOrHeldItem`, `deletePlacementItemOrHeldItem`, and attachment-domain validation helpers.
- Consumes: existing placement item fields and catalog furniture metadata without ID allowlists.

- [x] Write tests proving strict nested-field validation, mutual exclusion, non-recursion, 1x1/layer semantics, unique parent/child IDs, monotonic `nextItemId`, deep cloning, parent cascade, child-only delete, and legacy opaque `heldItemId` preservation.
- [x] Run `pnpm exec vitest run tests/placement/placement-snapshot.test.ts tests/placement/table-held-item-semantics.test.ts --testTimeout=15000` and verify the new assertions fail for the missing contract.
- [x] Implement the smallest pure snapshot and held-item helpers that satisfy those tests; keep held children out of `PlacementState.itemIndex`.
- [x] Re-run the two focused files and keep all assertions green.

### Task 2: Lossless reference projection

**Files:**
- Modify: `src/reference-runtime/reference-project-editor-adapter.ts`
- Test: `tests/reference-runtime/reference-project-editor-adapter.test.ts`
- Test: `tests/reference-runtime/reference-project-compatibility.integration.test.ts`

**Interfaces:**
- Consumes: canonical nested held-item snapshot contract from Task 1.
- Produces: resolved pointer projection on open and stable expansion on save while retaining both source envelopes and canonical IDs.

- [x] Write open tests for resolved parent/child nesting and removal from the top-level snapshot, plus Fail Fast self/cycle/multi-parent/non-table/ineligible/nested relations.
- [x] Write save tests for original order and opaque-envelope preservation, edited relations, deleted children, newly attached child safe `iN` allocation, dangling string preservation, and no-op map round trip.
- [x] Run the two reference test files and verify the missing projection assertions fail.
- [x] Extend the session mapping with explicit source item order/envelope information and implement deterministic projection/expansion without catalog-ID tables.
- [x] Re-run the focused reference tests and snapshot tests.

### Task 3: Placement attachment and history

**Files:**
- Modify: `src/placement/placement-snapshot.ts`
- Test: `tests/placement/table-held-item-semantics.test.ts`
- Modify: `src/editor/editor-placement-controller.ts`
- Modify: `src/planner/planner-workspace-editing-controller.ts`
- Test: `tests/editor/editor-placement-controller.test.ts`
- Test: `tests/components/planner-workspace.editing.integration.test.tsx`

**Interfaces:**
- Consumes: catalog furniture metadata and attachment helpers from Task 1.
- Produces: a dedicated `attach-held-item` snapshot action that alone allocates the child ID, plus cursor placement that attaches an eligible pending furniture item to the topmost empty ordinary table at the clicked tile, commits exactly one history state, and retains frozen pending-selection behavior.

- [x] Write tests for table-footprint hit detection, ordinary-table-only targeting, accepted 1x1 rug/table, every rejection family, occupied no-swap, overlapping long-table early rejection, one history entry, monotonic ID, unchanged pending catalog choice, empty selection after success, and clicked-tile child coordinates.
- [x] Run the focused placement/workspace files and verify expected RED failures.
- [x] Implement the dedicated action with structural validation before ID allocation, then target detection and the attachment-first branch before normal map/collision validation. React and workspace code must not allocate or predict IDs.
- [x] Re-run focused placement/workspace tests.

### Task 4: Selection, move, Q, copy, delete, and erase

**Files:**
- Modify: `src/editor/editor-selection-controller.ts`
- Modify: `src/editor/editor-erase-controller.ts`
- Test: `tests/editor/editor-selection-controller.test.ts`
- Test: `tests/editor/editor-erase-controller.test.ts`
- Test: `tests/placement/placement-history.test.ts`

**Interfaces:**
- Consumes: nested child lookup/replace/delete helpers from Task 1.
- Produces: child key `item:<numeric-id>` as a first-class selection identity without top-level occupancy.

- [x] Write tests for parent and derived-child stable keys, child-topmost single click, frozen rectangle membership, child drag moving its parent and resetting child coordinates to the parent origin, child-only Delete without ID reuse, erase-parent cascade, child Q without map collision while retaining a legal 1x1 footprint, parent Q relocation/relink, parent copy without child, child copy as an ordinary pending copy using child catalog/presentation state, atomic failed move/copy/Q behavior, pointer-cancel no mutation, and undo/redo exactness.
- [x] Run the three focused files and verify the new behavior fails.
- [x] Route item-key resolution through the public held-item interface; keep nested children out of occupancy/itemIndex; implement each operation with one history commit or no mutation.
- [x] Re-run focused selection/erase/history tests.

### Task 5: Parent/child rendering and Pixi selection keys

**Files:**
- Modify: `src/rendering/placement-rendering.ts`
- Modify: `src/components/planner-canvas.tsx`
- Test: `tests/rendering/placement-rendering.test.ts`
- Test: `tests/components/planner-canvas.test.ts`

**Interfaces:**
- Consumes: validated nested child and existing catalog furniture render metadata.
- Produces: parent entry plus nested child entry centered on the table, child z-index `parent + 0.001`, stable child selection key, and no child occupancy contribution.

- [x] Write exact frame/pixel-center/z/key/tint/click-selection tests for ordinary tables and loaded long-table relations, including resource cleanup and table/rug/bed regressions.
- [x] Run focused rendering/canvas tests and verify expected RED failures.
- [x] Add a held-child render-entry path using existing item frame selection while intentionally matching the frozen held-sprite tint behavior.
- [x] Re-run focused rendering/canvas tests.

### Task 6: Documentation, independent review, and official verification

**Files:**
- Modify: `docs/superpowers/plans/2026-08-03-react-pixi-task5-feature-parity.md`
- Modify: this plan's completion record.

- [x] Run all focused table/reference/editor/rendering tests together and record file/test totals.
- [x] Dispatch independent correctness/regression review for P0-P2 findings and verify every reported issue before changing code.
- [x] Run `pnpm exec vitest run tests --testTimeout=15000`.
- [x] Run `pnpm typecheck`.
- [x] Run `pnpm build`.
- [x] Run `git diff --check` and inspect `git diff --stat` plus scoped diffs for unrelated changes.
- [x] Record exact results and remaining verified frozen-runtime gaps; stop before selector work.

## Completion record

Completed in the user-owned workspace on 2026-08-04 without installing
dependencies, committing, pushing, deploying, editing the frozen runtime, or
starting selector work.

- Focused table/reference/editor/rendering chain: 11 files, 315 tests passed.
- Full suite: 142 files, 1426 tests passed.
- `pnpm typecheck`, `pnpm build`, and `git diff --check`: passed.
- Task-level independent reviews and the final cross-module review: APPROVED,
  with no remaining verified P0-P2 findings.
- Browser/CDP verification could not run because the configured browser runtime
  reported no available browser backends. This is a verification limitation,
  not a claimed passing result.
- Remaining verified scope boundary: selector work is intentionally not
  started. No verified gap remains in the confirmed table attachment,
  selection, history, reference projection, or parent/child rendering scope.
  The separate frozen-runtime families below remain outside this implementation.

## Read-only remaining frozen-runtime gap audit

This audit was completed after the table implementation without changing any
of the listed families. It compares the checked-in frozen runtime at
`public/_app/immutable/chunks/CUwsdp_r.js` with the current React/Pixi modules.
Only behavior demonstrated by both sides' source was retained as a gap.

| Family | Current status and user-visible result | Data / placement / rendering / UI / import boundary | Smallest recommended independent stage |
| --- | --- | --- | --- |
| Crab Pot (`object_710` / React `object:710`) | **Partial; user-visible placement and position mismatch.** The React map grid already calculates the frozen water-corridor and adjacent-passable `crabPot` capability, but item validation still requires ordinary `passable`. The frozen renderer also applies a water-edge pixel offset; React uses the default item position. | Data: catalog object exists. Placement: `src/placement/map-placement-grids.ts` produces `crabPot`, but `src/placement/placement-validation.ts` does not consume it. Rendering: no Crab Pot offset resolver. UI: the ordinary catalog entry is sufficient. Import: Farm objects import through the generic object path. | **Priority 1.** Add one exact Crab Pot placement requirement, consume `capabilities.crabPot`, and add the frozen pure pixel-offset resolver with focused place/move/copy/import/render tests. This is the smallest stage that is both stable and simple. |
| Generic object shadow allowlist | **Missing; user-visible shadow mismatch.** Frozen runtime draws `sprites/shadow.png` at alpha `0.5`, centered at tile `x + 8`, `y + 13.75`, before the item sprite for exactly 30 unique IDs. React has tree/sprinkler-specific shadows but no resolver for this object set. | Verified frozen IDs: `object_599`, `object_621`, `object_645`, `object_16`, `object_18`, `object_20`, `object_22`, `object_396`, `object_398`, `object_402`, `object_404`, `object_406`, `object_408`, `object_410`, `object_283`, `object_412`, `object_414`, `object_416`, `object_372`, `object_718`, `object_719`, `object_723`, `object_392`, `object_393`, `object_394`, `object_397`, `object_152`, `object_153`, `object_463`, `object_464`. Count: 30 entries, 30 unique, 0 duplicates. Placement/UI/import: no special behavior required. Rendering: missing exact allowlist layer. | Add a locked `object:*` allowlist plus one pure shadow-layer resolver and focused render/Canvas tests. No snapshot or UI changes are needed. |
| Gate (`object_325` / React `fence:325`) | **Partial; user-visible connectivity and tool mismatch.** React loads Gate through the generic fence catalog and generic fence path. Frozen runtime excludes Gate from Fill and renders dedicated `Fence1.png` pieces selected from adjacent fence and gate tiles; React has neither Gate-specific adjacency layers nor the frozen Fill exclusion. | Data: both `Objects.json` and `Fences.json` contain ID `325`. Placement: current fence path has no Gate rule. Rendering: missing the dedicated multi-piece gate resolver. UI: Fill is exposed by the generic fence catalog but frozen excludes Gate. Import: Game Save `fenceObjectIds` omits `325`, so a saved Gate becomes `object:325` instead of the Gate/fence semantic item. | Add exact Gate metadata for ID `325`, a pure adjacency render resolver, Fill exclusion, and an import mapping regression. Do not generalize into a new fence framework. |
| Fireplace / Torch flame visuals | **Partial; user-visible flame animation mismatch.** React loads fireplace/torch furniture, places and renders its base sprite, recognizes it as a Night light, and exposes Light/Extinguish. Frozen runtime additionally renders locked animated flame layers for furniture fireplace IDs `1792`, `1794`, `1796`, `1798`, `1800`, `1866`, `DesertFireplace`, `JojaFireplace`, `WizardFireplace`, `JunimoFireplace`, `RetroFireplace`; furniture torch IDs `2331`, `2397`, `2398`; object Torch `93`; and the verified lit big-craftable sets. | Data/night UI: complete for type recognition and top-level light state. Placement: ordinary furniture/object placement is present. Rendering: furniture fireplace/torch and object Torch lack the frozen flame-layer resolver; the existing lit-big-craftable resolver covers only its own audited family. Import: object Torch imports; Farm furniture is deliberately recorded as unmapped and remains outside the confirmed Game Save scope. | Extract the already locked flame frame/offset/period table into a pure visual resolver for only the verified IDs, then add render/Canvas animation tests. Keep Game Save furniture expansion separate. |
| Paintable chests (`130`, `232`, `BigChest`, `BigStoneChest`) | **Partial; user-visible paint control and sprite composition mismatch.** Frozen runtime gates Paint to these four IDs, offers its fixed palette, and tints only the chest body while drawing the lock and lid untinted. React exposes a generic HTML color input for every selected item and tints the whole default sprite. | Data: chest IDs exist, but React discards the `swappable_chest` capability. Placement: ordinary item path is sufficient. Rendering: missing body/lock/lid layer composition. UI: wrong eligibility and control type. Persistence/import: `tintColor` is preserved, and Game Save `playerChoiceColor` imports through the generic object path. | Add one exact chest capability and pure body/lock/lid layer table, gate the existing paint action to it, and replace the generic all-item tint exposure with focused tests. Do not add inventory/container behavior. |
| Windows and Night | **Night complete; Windows partial with user-visible placement/overlay mismatch.** React recognizes furniture `window` and `wallMounted`, but `wallMounted` is not consumed by ordinary placement validation. Frozen runtime permits wall-mounted items only on interior wall targets and draws a daytime Cursors window overlay that disappears in Night Mode. React renders the base window sprite only. | Data: furniture type and wall-mounted metadata exist. Placement: missing wall target/snap consumption. Rendering: missing exact daytime window overlay; Night overlay and top-level light descriptors are implemented. UI: no separate window control is required. Import: Farm furniture remains intentionally unmapped. Frozen held children are excluded from the top-level render/light pass and are drawn only by the table child branch, so the absence of a held-child light descriptor in React is **not** a frozen-parity gap. | First lock the interior wall target/snap contract from frozen maps, then consume the existing `wallMounted` flag and add the exact daytime overlay. Keep general interior-editor expansion and furniture import out of this stage. |

Recommended execution order under **stable and simple > stable only > simple
only**: Crab Pot first, then the 30-ID shadow layer. Gate, flame visuals,
paintable chests, and Windows each require a separate confirmed stage because
they change a distinct render or placement contract. No selector stage should
start implicitly.
