# Pixi Editor Core Plan

**Goal:** Replace the static planner placeholder with a browser-only Pixi editor that faithfully renders every locked TMX map, offers the original desktop/mobile editor shell, and establishes a small fail-fast state boundary for later local project and placement features.

**Confirmed evidence:** All 64 TMX files are finite 16px orthogonal maps with inline tilesets, 382 tile layers (CSV or base64/zlib), and no external TSX. Tile layers render in XML order; `Front*` layers need depth-aware handling later. Nine Mod maps contain Tiled H/V/D flags. Two maps explicitly force summer tilesheets. The locked asset mirror currently has 336 files plus the lock file; all are hash verified. `freecactuses.png` is a confirmed upstream 404 and must never be requested.

## Task 1: Parse and validate local TMX files

**Files:**

- Create `src/tmx/tmx-types.ts`
- Create `src/tmx/parse-tmx-map.ts`
- Create `src/tmx/decode-tile-layer-data.ts`
- Create `tests/tmx/parse-tmx-map.test.ts`

**Interfaces:**

- `parseTmxMap(xmlText)` returns map dimensions, string properties, inline tilesets, ordered tile layers, and object layers.
- `decodeTileLayerData` supports only observed `csv` and `base64`/`zlib` encodings and returns `Uint32Array` raw GIDs.
- Parsing preserves raw Tiled flip flags; it does not pretend that a flagged GID is a base GID.

**Steps:**

1. Write failing tests for Farm CSV data, a compressed Mod map, the layer-size exception in `spouseRooms`, summer override, hidden Paths, and flipped Mod gids.
2. Implement narrow XML/property/value readers using browser `DOMParser`; throw errors that include malformed source values, layer names, dimensions, and unsupported encodings.
3. Decode compressed layer data with browser `DecompressionStream('deflate')`; fail explicitly when the browser does not provide it.
4. Validate tile-layer GID counts against the layer's own dimensions, and validate every non-zero base GID against an inline tileset range.
5. Run parser tests, all tests, and TypeScript checks.

## Task 2: Render map tiles through Pixi

**Files:**

- Create `src/rendering/pixi-map-renderer.ts`
- Create `src/rendering/map-rendering-contract.ts`
- Create `src/components/planner-canvas.tsx`
- Modify `app/page.tsx`
- Create `tests/rendering/map-rendering-contract.test.ts`

**Interfaces:**

- `createMapRenderingContract` resolves each inline tileset through `resolveTilesheetAsset`; it contains only manifest-backed local URLs.
- `PlannerCanvas` owns the Pixi application lifecycle, creates a pixel-art renderer, renders ordered visible tile layers, and destroys all Pixi resources on unmount.
- The first render supports normal tiles and every observed H/V/D transform; unsupported transforms throw with the GID and tileset source.

**Steps:**

1. Write contract tests before renderer implementation: Farm uses local paths, Island season overrides, missing tile assets reject, and all tileset URLs start with the local game-asset root.
2. Create a client-only canvas component with nearest-neighbor scale, `roundPixels`, `antialias: false`, and a stopped ticker/explicit render as in the original public bundle.
3. Render visible tile layers in original XML order. Preserve layer dimensions and opacity; skip hidden layers. Add focused handling for Front/AlwaysFront ordering only after base map parity is verified.
4. Add a loading/error state that surfaces the exact map ID and asset path; no silent blank canvas.
5. Build, typecheck, unit-test, and verify Farm, Island, a compressed Mod map, and `spouseRooms` in a real local browser.

## Task 3: Recreate the editor frame and camera

**Files:**

- Create `src/components/editor-toolbar.tsx`
- Create `src/components/editor-menu-bar.tsx`
- Create `src/components/item-catalog-panel.tsx`
- Create `src/components/editor-modal.tsx`
- Create `src/editor/editor-view-state.ts`
- Modify `app/globals.css`
- Modify `app/page.tsx`

**Interfaces:**

- View state has only explicit `season`, `mapId`, `tool`, `catalogCategory`, `panelPosition`, and modal IDs.
- Canvas camera input is exposed through a small interface: fit, zoom around pointer, pan, and reset-on-map-switch.
- UI components receive state and callbacks; they do not call Pixi internals directly.

**Steps:**

1. Write state tests for valid season/map/tool transitions and the compact-layout media rule.
2. Rebuild the top central toolbar, upper-right menu, and item panel with the verified green tokens and desktop/compact/mobile breakpoints. Exclude all removed online/account/share/support controls completely.
3. Implement original camera fit/limits, pointer-anchored wheel zoom, drag pan, two-touch pinch, and documented keyboard shortcuts.
4. Implement Map, Season, View, Save, Settings, Help and local Projects modal structures; controls may be disabled only when their corresponding later local action is not yet implemented, never because of account/premium status.
5. Browser-check desktop 1440×900 and mobile 390×844 against the verified structural constraints.

## Task 4: Establish placement and local project foundations

**Files:**

- Create `src/editor/placement-state.ts`
- Create `src/editor/placement-validation.ts`
- Create `src/projects/local-project-store.ts`
- Create `src/projects/project-schema.ts`
- Create corresponding tests

**Steps:**

1. Begin only after the visible TMX renderer and frame are verified.
2. Keep placement decisions pure and validate boundaries/map tile properties before changing editor state.
3. Keep project storage behind a browser-local interface; validate imported JSON before writing it to local storage.
4. Implement one category at a time with undo/redo tests before exposing it in the catalog.

## Completion gates

- No runtime request points to `stardewplan.com` or `assets.stardewplan.com`.
- Parser and rendering contracts cover all observed TMX encodings and asset resolver branches.
- Every visible map failure contains the map/tileset value that caused it.
- Desktop and mobile editor frame retains original visual structure while excluding all confirmed removed online features.
