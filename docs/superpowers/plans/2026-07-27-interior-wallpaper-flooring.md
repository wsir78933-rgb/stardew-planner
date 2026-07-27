# Interior Wallpaper and Flooring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduce StardewPlan's interior wallpaper and flooring selection, per-room application, rendering, undo/redo, local project persistence, and JSON import/export using only the locked 1.6.15 assets.

**Architecture:** Keep interior decor as an optional, validated `interiorDecor` value on the existing `PlacementSnapshot`, so every existing placement operation preserves it and one history stream undoes decor and placement changes in their actual order. A pure interior-decor module will validate the 235 locked pattern IDs and transform a parsed TMX map by applying patterns only to tile regions derived from `WallID` and `FloorID`. `PlannerCanvas` loads that transformed map before it creates its rendering contract, and emits a validated room/floor target when the user clicks while a pattern is active.

**Tech Stack:** Next.js, React, TypeScript, Vitest, PixiJS, locked Stardew Valley 1.6.15 TMX/PNG assets.

## Global Constraints

- Mirror the verified public StardewPlan behavior: 112 standard wallpapers, 26 MoreWalls wallpapers, 88 standard floors, and 9 MoreFloors floors.
- Use only local locked assets: `walls_and_floors.png`, `wallpapers_2.png`, and `floors_2.png`; do not fetch a runtime resource.
- Preserve legacy snapshots that omit `interiorDecor`; reject malformed or unknown decor values with the offending value in the error.
- Only target TMX `Back:*` TileData regions with `WallID` or `FloorID`; never infer a selectable room from its display name or raw map ID.
- Apply wall tiles with the original three-row `Back`/`Buildings` mapping and flooring with the original parity mapping.
- Do not add a second undo stack, remote state, account behavior, new dependency, or a broad editor rewrite.
- Every production behavior change is preceded by a focused failing test and then the smallest implementation needed to pass it.

---

### Task 1: Add a strict, backward-compatible interior-decor snapshot value

**Files:**
- Create: `src/interior-decor/interior-decor-state.ts`
- Modify: `src/placement/placement-snapshot.ts`
- Test: `tests/interior-decor/interior-decor-state.test.ts`
- Test: `tests/placement/placement-snapshot.test.ts`

**Interfaces:**
- Produces `InteriorDecorKind`, `InteriorDecorPattern`, `InteriorDecorState`, `createEmptyInteriorDecorState`, `restoreInteriorDecorState`, `setInteriorDecorPattern`, and `getInteriorDecorPattern`.
- Produces `replacePlacementSnapshotInteriorDecor(placementSnapshot, interiorDecorState): PlacementSnapshot`.
- Consumers receive `PlacementSnapshot["interiorDecor"]` as an optional value; absence means no chosen interior decor.

- [x] **Step 1: Write failing state tests**

```ts
it("accepts each locked wallpaper and flooring namespace", () => {
  expect(restoreInteriorDecorState({ wallpapers: { Bedroom: "111" }, floors: { Floor: "MoreFloors:8" } })).toEqual({
    wallpapers: { Bedroom: "111" },
    floors: { Floor: "MoreFloors:8" },
  });
});

it("rejects a wallpaper ID in the flooring record", () => {
  expect(() => restoreInteriorDecorState({ wallpapers: {}, floors: { Floor: "MoreWalls:0" } })).toThrow("MoreWalls:0");
});
```

- [x] **Step 2: Run the state test to verify it fails**

Run: `pnpm test --run tests/interior-decor/interior-decor-state.test.ts`

Expected: FAIL because the module and functions do not exist.

- [x] **Step 3: Implement the minimal validated state module**

```ts
export type InteriorDecorKind = "wallpaper" | "flooring";
export type InteriorDecorState = Readonly<{
  wallpapers: Readonly<Record<string, string>>;
  floors: Readonly<Record<string, string>>;
}>;

export function setInteriorDecorPattern(
  interiorDecorState: InteriorDecorState,
  kind: InteriorDecorKind,
  targetId: string,
  patternId: string,
): InteriorDecorState;
```

Validate non-empty target IDs, exactly `0..111` / `MoreWalls:0..25` for wallpapers, and exactly `0..87` / `MoreFloors:0..8` for floors. Clone records at the boundary and never silently drop a malformed key or pattern.

- [x] **Step 4: Add snapshot boundary RED tests**

```ts
it("restores a legacy snapshot without interior decor", () => {
  expect(restorePlacementSnapshot(createLegacySnapshot())).not.toHaveProperty("interiorDecor");
});

it("preserves valid interior decor through persistent snapshot cloning", () => {
  expect(createPersistentPlacementSnapshot(snapshotWithDecor).interiorDecor).toEqual(snapshotWithDecor.interiorDecor);
});
```

- [x] **Step 5: Extend only the snapshot boundary and run focused checks**

Allow optional `interiorDecor` in the snapshot schema, validate it through `restoreInteriorDecorState`, and include it only when supplied. All existing snapshot actions already spread the snapshot, so they retain this field without operation-specific branches.

Run: `pnpm test --run tests/interior-decor/interior-decor-state.test.ts tests/placement/placement-snapshot.test.ts`

Expected: PASS.

### Task 2: Reproduce original TMX wall/floor targeting and tile replacement

**Files:**
- Create: `src/interior-decor/interior-decor-rendering.ts`
- Test: `tests/interior-decor/interior-decor-rendering.test.ts`
- Test: `tests/tmx/parse-tmx-map.test.ts`
- Test: `tests/rendering/map-rendering-contract.test.ts`

**Interfaces:**
- Consumes `TmxMap` and `InteriorDecorState`.
- Produces `getInteriorDecorTargetAtTile(parsedMap, kind, tile): string | null` and `applyInteriorDecorToMap(parsedMap, interiorDecorState): TmxMap`.
- The returned map is a clone: caller-owned map layers and tilesets are never mutated.

- [x] **Step 1: Write failing real-TMX targeting tests**

```ts
it("finds FarmHouse2 UpperRoom through a WallID tile", async () => {
  const map = await parseTmxMap(await readTmxFile("maps/FarmHouse2.tmx"));
  expect(getInteriorDecorTargetAtTile(map, "wallpaper", { x: 16, y: 11 })).toBe("UpperRoom");
});

it("does not expose a wall target for a non-WallID tile", async () => {
  const map = await parseTmxMap(await readTmxFile("maps/FarmHouse2.tmx"));
  expect(getInteriorDecorTargetAtTile(map, "wallpaper", { x: 0, y: 0 })).toBeNull();
});
```

- [x] **Step 2: Run the targeting test to verify it fails**

Run: `pnpm test --run tests/interior-decor/interior-decor-rendering.test.ts`

Expected: FAIL because the targeting/rendering module does not exist.

- [x] **Step 3: Implement pure target extraction and pattern tile indices**

Use `parsedMap.tileDataProperties` keys beginning with `Back:`. For walls, exactly mirror the original three-row eligibility: require the third row's Buildings tile, write rows 0–1 only when Back has a tile, and write row 2 only when Buildings has a tile. For floors, retain only original interior floor tiles and use checkerboard parity. Encode the original index formulas:

```ts
const wallpaperRows = [index, index + 16, index + 32] as const;
const flooringTiles = [topLeft, topRight, bottomLeft, bottomRight] as const;
```

Add `walls_and_floors` with its locked 688-tile 256×688 dimensions when needed; append `wallpapers_2` and `floors_2` only when a selected pattern requires them. Do not alter original map dimensions, non-decor tiles, or map properties.

- [x] **Step 4: Add RED tests for the exact map transformation**

```ts
it("uses all three wallpaper rows across Back and Buildings", async () => {
  const decoratedMap = applyInteriorDecorToMap(farmHouse2, { wallpapers: { UpperRoom: "17" }, floors: {} });
  expect(readTileGid(decoratedMap, "Back", 16, 11)).toBe(expectedFirstWallpaperGid);
  expect(readTileGid(decoratedMap, "Buildings", 16, 13)).toBe(expectedThirdWallpaperGid);
});

it("uses x/y parity for MoreFloors", async () => {
  const decoratedMap = applyInteriorDecorToMap(shed, { wallpapers: {}, floors: { Floor: "MoreFloors:0" } });
  expect(readTileGid(decoratedMap, "Back", 1, 3)).not.toBe(readTileGid(decoratedMap, "Back", 2, 3));
});
```

- [x] **Step 5: Implement the minimum clone-and-replace logic**

Clone only `tilesets` and every `rawGids` array that can be changed. Use the exact rendering asset names accepted by the current tilesheet resolver. Validate `WallID`/`FloorID` structure before using it; invalid tile/tileset state throws with its raw key/value.

- [x] **Step 6: Run the focused renderer suite**

Run: `pnpm test --run tests/interior-decor/interior-decor-rendering.test.ts tests/tmx/parse-tmx-map.test.ts tests/rendering/map-rendering-contract.test.ts`

Expected: PASS.

### Task 3: Preserve renovation TileData when composing Farmhouse 2 maps

**Files:**
- Modify: `src/maps/map-tile-composition.ts`
- Test: `tests/maps/map-tile-composition.test.ts`

**Interfaces:**
- `composeMapTileOverlays(baseMap, overlays)` continues to return a `TmxMap`.
- It additionally returns a correctly merged `tileDataProperties` map, with each selected overlay's crop translated into base-map target coordinates.

- [x] **Step 1: Write a failing composition test**

```ts
it("translates cropped overlay WallID TileData to the target map coordinate", () => {
  const composedMap = composeMapTileOverlays(baseMap, [overlayWithWallId]);
  expect(composedMap.tileDataProperties.get("Back:12,8")).toEqual({ WallID: "Corner" });
});
```

- [x] **Step 2: Run it to verify RED**

Run: `pnpm test --run tests/maps/map-tile-composition.test.ts`

Expected: FAIL because the current composition keeps base-map TileData unchanged.

- [x] **Step 3: Implement translated TileData merge**

Start with a new `Map(baseMap.tileDataProperties)`. For every overlay TileData key in an included source crop, calculate the base target coordinate and merge its properties in overlay application order. Reject coordinates outside the already-validated target crop rather than silently writing them.

- [x] **Step 4: Verify green**

Run: `pnpm test --run tests/maps/map-tile-composition.test.ts tests/interior-decor/interior-decor-rendering.test.ts`

Expected: PASS.

### Task 4: Add the verified interior-decor catalog and selection panel

**Files:**
- Create: `src/interior-decor/interior-decor-catalog.ts`
- Create: `src/components/interior-decor-panel.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/interior-decor/interior-decor-catalog.test.ts`
- Test: `tests/components/interior-decor-panel.test.tsx`
- Test: `tests/routes/planner-editor-page.test.tsx`

**Interfaces:**
- Produces `interiorWallpaperPatterns`, `interiorFlooringPatterns`, and `isInteriorDecorSupportedMapId(mapId)`.
- `InteriorDecorPanel` receives `mapId`, `selectedPattern`, and `onPatternSelect`; it has no rendering or storage side effect.
- `PlannerPage` owns the transient selected pattern and cancels normal item placement before selecting decor.

- [x] **Step 1: Write failing catalog and component tests**

```tsx
it("lists every locked wallpaper and flooring pattern", () => {
  expect(interiorWallpaperPatterns).toHaveLength(138);
  expect(interiorFlooringPatterns).toHaveLength(97);
});

it("does not render interior decor controls on a map without verified WallID/FloorID support", () => {
  render(<InteriorDecorPanel mapId="standard" selectedPattern={null} onPatternSelect={noop} />);
  expect(screen.queryByLabelText("Interior decor")).toBeNull();
});
```

- [x] **Step 2: Run tests to verify RED**

Run: `pnpm test --run tests/interior-decor/interior-decor-catalog.test.ts tests/components/interior-decor-panel.test.tsx`

Expected: FAIL because the catalog and panel do not exist.

- [x] **Step 3: Implement the small panel**

Use the locked sprite sources and original preview geometry. Offer two accessible tabs, `Wallpapers` and `Flooring`, a selected state, and a `Cancel interior decor` button. Render it only for the six verified base map IDs: `farmhouse-0`, `farmhouse-1`, `farmhouse-2`, `shed`, `big-shed`, and `island-farmhouse`.

- [x] **Step 4: Wire selection into the page and verify green**

On selection clear ordinary catalog placement and selected entities, set cursor mode, and expose a concise status instruction. Escape cancels the pattern before other selection handling.

Run: `pnpm test --run tests/interior-decor/interior-decor-catalog.test.ts tests/components/interior-decor-panel.test.tsx tests/routes/planner-editor-page.test.tsx`

Expected: PASS.

### Task 5: Render selected decor, apply it on click, and retain shared undo/redo

**Files:**
- Modify: `src/components/planner-canvas.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/planner-canvas.test.ts`
- Test: `tests/routes/planner-editor-page.test.tsx`
- Test: `tests/placement/placement-history.test.ts`

**Interfaces:**
- `PlannerCanvas` receives optional `activeInteriorDecorPattern`, `interiorDecorState`, `onInteriorDecorApply`, and `onInteriorDecorRejected`.
- `onInteriorDecorApply(kind, targetId, patternId)` is emitted only after the current parsed TMX confirms the clicked coordinate belongs to that target.
- Page applies `setInteriorDecorPattern` by replacing `PlacementSnapshot.interiorDecor` and commits it with the existing placement history helper.

- [x] **Step 1: Write a failing canvas interaction test**

```ts
it("emits the verified WallID rather than normal placement when wallpaper selection is active", () => {
  // Arrange a parsed FarmHouse map and click its Bedroom wall cell.
  expect(onInteriorDecorApply).toHaveBeenCalledWith("wallpaper", "Bedroom", "0");
  expect(onMapTileClick).not.toHaveBeenCalled();
});
```

- [x] **Step 2: Run it to verify RED**

Run: `pnpm test --run tests/components/planner-canvas.test.ts`

Expected: FAIL because the canvas does not accept or dispatch interior decor selection.

- [x] **Step 3: Apply decor before the rendering contract**

After all selected map overlays are composed, call `applyInteriorDecorToMap`. Add the resulting selected decor to the canvas effect dependencies so an undo/redo or selection application rebuilds the correct local Pixi map. The camera handler must route a valid decor click exclusively to `onInteriorDecorApply`; an invalid click routes to the rejection callback and must not change state.

- [x] **Step 4: Write failing page-history tests**

```ts
it("undoes a wallpaper change with the same history control used by placements", () => {
  const nextSnapshot = replacePlacementSnapshotInteriorDecor(emptySnapshot, { wallpapers: { Bedroom: "0" }, floors: {} });
  const history = commitPlacementHistory(createPlacementHistory(emptySnapshot), nextSnapshot);
  expect(undoPlacementHistory(history).currentState.interiorDecor).toBeUndefined();
});
```

- [x] **Step 5: Implement page application and status behavior**

Use the existing `updatePlacementHistory`, selection clearing, toolbar undo/redo wiring, and project save path. Never create a parallel history. A rejected wall/floor click must leave history unchanged and show whether the active pattern requires a wall or floor target.

- [x] **Step 6: Verify focused behavior**

Run: `pnpm test --run tests/components/planner-canvas.test.ts tests/routes/planner-editor-page.test.tsx tests/placement/placement-history.test.ts`

Expected: PASS.

### Task 6: Verify local project, JSON, rendering, and responsive behavior

**Files:**
- Modify: `src/projects/local-project-editor-actions.ts` only if its existing snapshot boundary test exposes a missing pass-through
- Test: `tests/projects/local-project-editor-actions.test.ts`
- Test: `tests/projects/local-project-store.test.ts`
- Test: `tests/components/item-catalog-panel.test.tsx`
- Modify: `docs/superpowers/plans/2026-07-27-interior-wallpaper-flooring.md`

**Interfaces:**
- No project-schema version change is permitted: decor persists inside the existing validated map `placementSnapshot`.

- [x] **Step 1: Add failing persistence tests**

```ts
it("saves and restores selected interior decor through a v2 map instance", () => {
  const savedState = createProjectMapState("spring", snapshotWithInteriorDecor);
  expect(getPlacementSnapshotForLocalProjectMapInstance(project, "map-shed")?.interiorDecor).toEqual(snapshotWithInteriorDecor.interiorDecor);
});
```

- [x] **Step 2: Run persistence tests to verify RED if a pass-through is missing**

Run: `pnpm test --run tests/projects/local-project-editor-actions.test.ts tests/projects/local-project-store.test.ts`

Expected: PASS only after every existing snapshot serialization path preserves validated decor. If it already passes before a production edit, do not add redundant production code.

- [x] **Step 3: Run full automated validation**

Run serially:

```bash
pnpm test --run
pnpm typecheck
pnpm build
```

Expected: all tests pass, typecheck exits 0, and the static build generates every route.

- [x] **Step 4: Browser validation when an in-app browser is available**

Build/serve a fresh output, wait for the canvas `aria-busy="false"`, then validate desktop and 390px-mobile flows: select wallpaper, apply to a Farmhouse room, select flooring, undo/redo both, save locally, reload, export/import JSON, and confirm independent map instances retain different decor. If the browser is unavailable, record that exact limitation rather than claiming visual verification.

- [x] **Step 5: Record verification evidence**

## Actual execution evidence (2026-07-27)

- Task 4: catalog, panel, and page selection began with failing import/function tests, then passed after implementation. The final independent accessibility review found no P0-P2 issues. It verified the locked 138 wallpaper and 97 flooring choices, the six supported maps, source-rect preview clipping, ARIA tab wiring, keyboard roving-tab navigation, and preservation of regular Fill selections.
- Task 5: canvas click dispatch, shared placement-history updates, and map reload revision were covered by focused tests. The original canvas-dispatch test failed before its exported click handler existed; it now verifies a valid `WallID` application and an invalid target rejection. `PlacementHistory` now has explicit decor undo/redo coverage. Independent review found and the implementation fixed one P2: a saved target absent from the current map now fails fast with kind, pattern ID, and target ID instead of being silently ignored. Final Task 5 re-review was clean.
- Task 6: local v2 project actions, storage export/import, and two map-instance isolation each have explicit decor-state regression coverage. The existing snapshot boundary already serialized valid decor correctly, so no redundant persistence production code was added.
- Browser validation used the built production output at `http://localhost:3000/`: canvas readiness was `aria-busy="false"`; the Farmhouse selected Wallpaper 0 and Flooring 0 each applied to the verified Bedroom target; both undo/redo cycles were exercised; the saved local project was reloaded and opened with its wallpaper state restored. At 390×844 the map camera controls, catalog, interior tabs, accessible selected states, and Flooring 0 selection were visible and usable. The actual download/file-picker controls were not triggered in-browser; their JSON export/import and multi-instance boundaries are covered by the local automated tests above.
- Final automated validation (after all code and test changes): `pnpm test --run` — 64 files / 531 tests passed; `pnpm typecheck` — passed; `pnpm build` — passed and generated all 15 static pages.
- The workspace remains intentionally uncommitted because it is not a Git repository.

Update this plan with actual RED/GREEN command evidence, final command counts, browser availability/result, and the fact that the directory is not a Git repository if that remains true.
