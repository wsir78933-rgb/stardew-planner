# Strong Selected Placement Tint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development and superpowers:subagent-driven-development. Do not commit, stage, push, install dependencies, or edit files outside this task.

**Goal:** Make every selected placement render with an immediately visible bright golden-yellow appearance without adding a persistent selection border.

**Architecture:** Keep `selectedPlacementKeys` as the only selection source. Apply the complete selected visual at the existing `createPlacementSprite()` boundary so buildings, crops, decor, ordinary placeables, held items, and every layer sharing the selected placement key use one consistent rule. Reuse Pixi Sprite properties only: the existing golden tint plus additive blending for selected sprites, and normal blending for unselected sprites.

**Tech Stack:** TypeScript, React 19, PixiJS 8.19, Vitest 3.2.

## Global Constraints

- Apply the strengthened visual to every selectable building, crop, decor item, and placeable item, including every rendered layer that shares a selected placement key.
- Selected sprites use the existing golden tint `0xffdf4a` and Pixi blend mode `"add"` so dark artwork visibly brightens.
- Unselected sprites retain their original tint and use Pixi blend mode `"normal"`.
- Do not draw an outline, persistent rectangle, glow, resize handle, toast, or any other selection UI.
- Preserve the existing drag-time marquee preview and its pointer-up cleanup.
- Do not change selection state, hit testing, placement history, move/delete/copy behavior, toolbar UI, layout, catalog UI, assets, dependencies, configuration, persistence, homepage, or SEO.
- Keep the implementation at the existing Sprite creation boundary. Do not add filters, duplicate sprites, containers, abstractions, or per-object special cases.
- Retain `shouldApplySelectionTint` as an existing compatibility field; do not perform an unrelated rendering metadata cleanup.
- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming.
- Do not stage, commit, push, deploy, or install dependencies.

---

### Task 1: Strengthen the selected Sprite appearance

**Files:**
- Modify: `tests/components/planner-canvas.test.ts`
- Modify: `src/components/planner-canvas.tsx`

**Interfaces:**
- Consumes: `createPlacementSprite(..., isSelected: boolean)` and each `PlacementRenderEntry.key` already derived from `selectedPlacementKeys`.
- Produces: selected Pixi sprites with `tint === 0xffdf4a` and `blendMode === "add"`; unselected sprites with their original tint and `blendMode === "normal"`.

- [ ] **Step 1: Write failing behavioral tests**

  In the existing layered placement tests, add a `blendMode = "normal"` property to the Sprite test double. Replace the old shadow exception test with a contract that asserts both layers sharing a selected key use `0xffdf4a` and `"add"`, while an unselected custom-tint layer remains `0x123456` and `"normal"`.

  Update the real multi-layer fixtures so selected sprinkler shadow/base/attachment, daytime window body/overlay, and paintable chest body/lock/lid all expect `0xffdf4a` and `"add"`. These fixtures protect the real families that previously used `shouldApplySelectionTint: false`.

- [ ] **Step 2: Run the focused test and verify RED**

  Run:

  ```bash
  pnpm exec vitest run tests/components/planner-canvas.test.ts
  ```

  Expected: FAIL because selected layers with `shouldApplySelectionTint: false` still retain their original tint and no selected additive blend mode is assigned.

- [ ] **Step 3: Implement the minimal selected visual**

  In `createPlacementSprite()`:

  ```ts
  const placementTintColor = getPlacementSpriteTintColor(
    placementRenderEntry.tintColor,
    isSelected,
  );

  placementSprite.tint = placementTintColor;
  placementSprite.blendMode = isSelected ? "add" : "normal";
  ```

  Do not change the existing function signature, selection state, render-entry builders, or resource ownership.

- [ ] **Step 4: Run the focused test and verify GREEN**

  Run:

  ```bash
  pnpm exec vitest run tests/components/planner-canvas.test.ts
  ```

  Expected: all planner-canvas tests pass with no warnings.

- [ ] **Step 5: Run the related regression bundle**

  Run:

  ```bash
  pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-canvas-placement-animation.test.ts tests/rendering/paintable-chest-placement-rendering.test.ts tests/rendering/placement-rendering.test.ts --no-file-parallelism --maxWorkers=1
  pnpm typecheck
  pnpm build
  git diff --check
  ```

  Expected: every command exits successfully. If `next build` rewrites `next-env.d.ts`, preserve the user's existing file content and do not include generated noise in the task diff.

- [ ] **Step 6: Browser acceptance**

  Use the existing local editor and verify at minimum:

  1. Select a red-brown Silo directly. Its full sprite is visibly brighter and golden-yellow.
  2. Select a paintable Chest. Body, lid, and lock read as one selected object rather than retaining the normal custom paint.
  3. Select a crop and an ordinary placeable with a shadow. Every selected object has visible feedback.
  4. Drag-select multiple mixed placements. All selected placements brighten; the drag-time marquee clears after pointer-up and no persistent border remains.
  5. Click blank space or dismiss the selection. Every object returns to its original tint and normal blend mode.
  6. Confirm selection does not move, delete, duplicate, or otherwise mutate placements.

## Plan Self-Review

- Spec coverage: direct click, marquee selection, all placement families, strong golden brightening, deselection restoration, no persistent border, and regression validation are covered.
- Placeholder scan: no TBD, TODO, or unspecified implementation steps remain.
- Type consistency: the plan reuses the existing `isSelected: boolean`, Pixi `Sprite.tint`, and Pixi `Sprite.blendMode` interfaces without adding a parallel state or abstraction.
