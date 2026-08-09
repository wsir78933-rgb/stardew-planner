# Season Camera Retention and Zoom Placement Design

## Goal

Fix two editor interaction defects without changing the editor's visual style or mutually exclusive toolbar selection:

1. Preserve zoom and pan while the same map reloads for a season change.
2. Keep Zoom selected and wheel zoom enabled while allowing an already selected catalog item to preview and place on the map.

## Confirmed behavior

- Switching spring, summer, fall, or winter on the same map preserves the complete camera state: zoom and pan.
- Switching to a different map resets the camera to that map's normal fit-to-viewport state.
- Zoom remains the only highlighted toolbar tool while active.
- With Zoom active and a catalog item selected, the item preview appears and a map click places the item.
- With Zoom active and no catalog item selected, a map click remains a navigation no-op; it does not select or place map content.
- Wheel zoom remains enabled throughout Zoom mode.

## Architecture

### Camera retention

Add a small state-retention interface owned by the planner layer. It stores one `{ mapId, cameraState }` snapshot and exposes read/write operations. `PlannerWorkspaceRenderedBoundary`, which survives the temporary loading state during a season change, owns one retention instance and passes it through the prepared workspace to `PlannerCanvas`.

`PlannerCanvas` writes every committed camera change through that interface. During initialization, it reads a retained state only when the retained `mapId` matches the requested map. A same-map seasonal reload restores and clamps that state to the current viewport; a different map receives no retained state and uses `createInitialCameraState`.

This keeps transient camera state out of the persisted project model and avoids React state updates on every wheel or pan event.

### Zoom placement

Keep the existing single `EditorTool` state unchanged. Zoom continues to produce `wheelZoomEnabled: true` and `pointerInteractionMode: "navigate"`.

Allow the catalog placement preview to treat `zoom` like `cursor` only when a catalog item is already selected. At the editing-controller boundary, route a Zoom map click through the existing cursor placement operation only when `selectedCatalogItem` is non-null. Otherwise return the unchanged transition.

No duplicate placement algorithm, new tool state, or simultaneous toolbar highlight is introduced.

## Scope

### Modify

- Planner camera-state retention interface and tests.
- Planner workspace-to-canvas camera retention wiring.
- Planner canvas camera initialization/update path.
- Catalog placement preview eligibility for Zoom.
- Editing-controller Zoom placement routing and tests.

### Do not modify

- Toolbar styling or mutually exclusive selection behavior.
- Season/map asset loading.
- Project persistence or save schema.
- Map-switch initialization behavior.
- Cursor, Multi-select, Erase, Fill, undo, or redo semantics.
- Dependencies, routes, public-page styling, or unrelated code.

## Failure handling

- Existing map/resource identity assertions remain authoritative.
- Camera retention accepts only internal validated map IDs and `CameraState` values; it introduces no external data boundary.
- Unknown tools and invalid editing inputs continue to fail through existing validation.
- No exceptions are caught or silently discarded.

## Testing

- TDD unit tests prove same-map camera restoration and different-map reset.
- Planner canvas tests prove initialization consumes the retained state and camera changes are written back.
- Editing integration tests prove Zoom produces a placement preview, places a selected item, remains unchanged without a selected item, and retains wheel zoom/navigation properties.
- Run focused Vitest files, `pnpm typecheck`, `pnpm build`, and browser verification on the built/local page.
- Browser acceptance: zoom and pan, change season, confirm view is retained; keep Zoom selected, select an item, confirm preview and placement while wheel zoom still works; switch maps and confirm fit-to-viewport reset.

