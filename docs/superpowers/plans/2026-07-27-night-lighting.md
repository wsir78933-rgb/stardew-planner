# Verified Night Lighting Plan

**Goal:** Make Night Mode render and control verified placed light sources locally, with lighting state preserved in placement snapshots, undo/redo, local projects, and JSON import/export.

**Architecture:** The catalog translates only version-locked game light metadata into an optional `nightLight` descriptor. Placement items retain an optional `nightLightState: "off"`; absent means illuminated for backward compatibility. The selection controller owns Light/Extinguish history commands. The canvas builds pure descriptors from the current snapshot and catalog and draws the dark overlay plus a bounded, deterministic light opening. The inspector only exposes control for a single recognized light source.

**Verified source scope:** derive normal sources from locked Objects/BigCraftables `ContextTags` containing `light_source`, BigCraftables `IsLamp: true`, and parsed Furniture types `lamp`, `torch`, `sconce`, `fireplace`; supplement this locked data with explicit known IDs for `object:746` (Jack-O-Lantern), `furniture_1369` (Decorative Lantern), and `furniture_1440` (Tree of the Winter Star). Keep unavailable `CCFishTank` unsupported rather than claiming it works. Do not infer light source status from display names.

**Constraints:** Do not add shaders, occlusion, map ambient-light simulation, remote resources, or a new project format. Invalid light metadata/state, a non-light selection, locked item, stale key, or malformed catalog must fail with the offending value. A failed toggle never mutates history. During daytime Night Mode is off and descriptors are not rendered; source state can still be configured.

### Task 1: Carry locked night-light metadata through the catalog

- Modify: `src/catalog/catalog-types.ts`
- Modify: `src/catalog/catalog-schema.ts`
- Modify: `src/catalog/furniture.ts`
- Add: `src/night-lights/locked-night-light-definitions.ts`
- Test: focused catalog tests

- [x] Add failing catalog assertions for tag/type/explicit-ID recognition and an unsupported item.
- [x] Add a small immutable descriptor (`radiusInTiles`, `color`) and a single locked-ID definition module; reject invalid descriptors at module boundary.
- [x] Extend only applicable catalog constructors; retain source-derived catalog failures.
- [x] Run catalog tests and typecheck.

### Task 2: Persist and toggle one selected light source

- Modify: `src/placement/placement-snapshot.ts`
- Modify: `src/editor/editor-selection-controller.ts`
- Test: placement snapshot and controller tests

- [x] Add failing compatibility tests: omitted state restores as lit, only literal `"off"` is accepted, and snapshot replacement round-trips state.
- [x] Add failing controller tests for extinguish/light actions: one history commit, no mutation for invalid/non-light/locked/stale selection.
- [x] Implement optional `nightLightState` and a selection command that uses catalog-derived light eligibility and existing history replacement.
- [x] Run focused tests and typecheck.

### Task 3: Render deterministic light openings over Night Mode

- Modify: `src/components/planner-canvas.tsx`
- Add: `src/night-lights/night-light-rendering.ts`
- Test: night-light rendering unit tests and planner canvas tests

- [x] Add failing descriptor tests for off states, unknown catalog IDs, bad radius, and tile-to-pixel positioning.
- [x] Implement a pure descriptor function and use it in the existing night overlay creation. Draw a bounded radial opening/light shape after the dark base overlay without changing placement render order.
- [x] Run focused rendering tests and typecheck.

### Task 4: Expose Light/Extinguish in the single selection inspector

- Modify: `src/components/selection-inspector.tsx`
- Modify: `app/page.tsx`
- Test: selection inspector and editor shell tests

- [x] Add failing assertions for a recognized single item’s Extinguish/Light control and absence on non-light/multiple selections.
- [x] Route actions through the controller; preserve existing tint/copy/rotate/delete controls.
- [x] Run focused tests and typecheck.

### Task 5: Review and verify

- [x] Attempt an independent read-only review focused on catalog eligibility, snapshot compatibility, history integrity, and render coordinates. The request was blocked by the active agent thread limit; no independent review evidence is claimed.
- [x] Run `pnpm test --run`, `pnpm typecheck`, and `pnpm build` serially.
- [x] Browser-check availability. The in-app browser returned `Browser is not available: iab`, so no Pixi UI check or alert inspection was possible.
