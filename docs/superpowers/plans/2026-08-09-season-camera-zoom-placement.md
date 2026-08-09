# Season Camera Retention and Zoom Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the current camera across same-map season reloads and allow selected catalog items to be placed while Zoom remains active.

**Architecture:** A planner-owned camera retention interface survives the prepared canvas unmount and restores state only for the same map ID. Zoom placement reuses the existing cursor placement operation only when a catalog item exists, while leaving toolbar state and wheel zoom behavior unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, PixiJS 8, Vitest.

## Global Constraints

- Preserve zoom and pan only across same-map season changes; changing maps resets to fit-to-viewport.
- Zoom remains the only highlighted tool and wheel zoom remains enabled while selected catalog items can preview and place.
- Zoom without a selected catalog item must not select or place map content.
- Do not change UI styles, toolbar mutual exclusion, resource loading, persistence schemas, dependencies, or unrelated behavior.
- Use high cohesion, low coupling, single-responsibility functions, KISS, Fail Fast, YAGNI, and precise names.
- Write a failing test before production code and verify the expected failure.

---

### Task 1: Retain the camera across same-map canvas reloads

**Files:**
- Create: `src/planner/planner-camera-state-retention.ts`
- Create: `tests/planner/planner-camera-state-retention.test.ts`
- Modify: `src/components/planner-workspace.tsx`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `tests/components/planner-canvas.test.ts`

**Interfaces:**
- Produces: `PlannerCameraStateRetention` with `read(mapId: string): CameraState | null` and `write(mapId: string, cameraState: CameraState): void`.
- Produces: `createPlannerCameraStateRetention(): PlannerCameraStateRetention`.
- Consumes: existing `CameraState`, `createInitialCameraState`, and `clampCameraPosition`.

- [ ] **Step 1: Write failing retention tests**

Add tests proving a state written for `standard` is returned for `standard`, returns `null` for `beach`, and is replaced after writing a `beach` state. Use literal camera states such as `{ positionX: 120, positionY: -40, zoom: 1.25 }`.

- [ ] **Step 2: Run the retention test and verify RED**

Run: `pnpm exec vitest run tests/planner/planner-camera-state-retention.test.ts`

Expected: FAIL because the retention module does not exist.

- [ ] **Step 3: Implement the minimal retention interface**

Use a closure-backed ordinary object, not a class. Store only one map identity and camera state. Return `null` when the requested map ID differs.

- [ ] **Step 4: Run the retention test and verify GREEN**

Run: `pnpm exec vitest run tests/planner/planner-camera-state-retention.test.ts`

Expected: PASS.

- [ ] **Step 5: Write failing canvas/workspace wiring tests**

Extend `tests/components/planner-canvas.test.ts` with behavior-level tests showing that camera initialization uses a retained same-map state and writes committed zoom/pan changes back through the retention interface. The production mutation caught is replacing retained initialization with unconditional `createInitialCameraState` or omitting retention writes.

- [ ] **Step 6: Run the canvas test and verify RED**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts`

Expected: FAIL because `PlannerCanvas` has no camera retention input or restoration path.

- [ ] **Step 7: Wire retention through the surviving workspace boundary**

Create one retention instance in `PlannerWorkspaceRenderedBoundary` with `useRef`, pass it through `PreparedPlannerWorkspaceContent`, and provide it to `PlannerCanvas`. In the canvas lifecycle, initialize from `retention.read(mapId)` when available, clamp it to current geometry, and call `retention.write(mapId, cameraState)` whenever resize, joystick pan, pointer pan, or wheel zoom commits a camera state.

- [ ] **Step 8: Run focused camera tests and verify GREEN**

Run: `pnpm exec vitest run tests/planner/planner-camera-state-retention.test.ts tests/components/planner-canvas.test.ts`

Expected: PASS.

- [ ] **Step 9: Commit Task 1**

Run:

```bash
git add src/planner/planner-camera-state-retention.ts src/components/planner-workspace.tsx src/components/planner-canvas.tsx tests/planner/planner-camera-state-retention.test.ts tests/components/planner-canvas.test.ts
git commit -m "fix: preserve camera across season changes"
```

---

### Task 2: Allow catalog placement while Zoom remains active

**Files:**
- Modify: `src/components/planner-workspace.tsx`
- Modify: `src/planner/planner-workspace-editing-controller.ts`
- Modify: `tests/components/planner-workspace.editing.integration.test.tsx`

**Interfaces:**
- Consumes: existing `createWorkspaceCatalogPlacementPreviewInput`.
- Consumes: existing `applyPlannerWorkspaceMapTileClick` and cursor placement operation.
- Preserves: `getPlannerCanvasInteractionProperties({ tool: "zoom" })` returns navigation mode with wheel zoom enabled.

- [ ] **Step 1: Write failing Zoom placement tests**

Add independent tests proving:

1. `createWorkspaceCatalogPlacementPreviewInput` returns the same concrete preview input for `zoom` as for `cursor` when a catalog item is selected.
2. `applyPlannerWorkspaceMapTileClick` with `tool: "zoom"` places the selected catalog item.
3. The same Zoom click with `selectedCatalogItem: null` returns an unchanged transition and does not select an existing placement.
4. Zoom still resolves to `{ pointerInteractionMode: "navigate", wheelZoomEnabled: true }`.

- [ ] **Step 2: Run the editing integration test and verify RED**

Run: `pnpm exec vitest run tests/components/planner-workspace.editing.integration.test.tsx`

Expected: FAIL on Zoom preview and placement because current production code accepts only `cursor`.

- [ ] **Step 3: Implement the minimal Zoom placement routing**

Permit `zoom` in `createWorkspaceCatalogPlacementPreviewInput`. In `applyPlannerWorkspaceMapTileClick`, call the existing cursor tile-click operation when the tool is `zoom` and `selectedCatalogItem` is non-null. Leave Zoom clicks unchanged when no catalog item is selected. Do not add a second placement implementation or alter toolbar state.

- [ ] **Step 4: Run the editing integration test and verify GREEN**

Run: `pnpm exec vitest run tests/components/planner-workspace.editing.integration.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run the combined focused regression suite**

Run: `pnpm exec vitest run tests/planner/planner-camera-state-retention.test.ts tests/components/planner-canvas.test.ts tests/components/planner-workspace.editing.integration.test.tsx tests/components/editor-controls.test.tsx`

Expected: PASS with toolbar mutual exclusion unchanged.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/components/planner-workspace.tsx src/planner/planner-workspace-editing-controller.ts tests/components/planner-workspace.editing.integration.test.tsx
git commit -m "fix: allow placement while zoom is active"
```

---

### Task 3: Verify the complete interaction contract

**Files:**
- Verify only: source, tests, generated build output, and local browser page.

**Interfaces:**
- Consumes: Task 1 camera retention and Task 2 Zoom placement behavior.
- Produces: verification evidence only; no new feature surface.

- [ ] **Step 1: Run static verification**

Run:

```bash
git diff --check
pnpm typecheck
pnpm build
```

Expected: all commands exit successfully.

- [ ] **Step 2: Run the full test command**

Run: `pnpm test -- --run`

Expected: all task-related tests pass; report any pre-existing unrelated baseline failures exactly rather than claiming a fully green suite.

- [ ] **Step 3: Verify the rendered interaction in a browser**

On the local built/dev page:

1. Select Zoom, zoom and pan, switch season, and confirm zoom plus pan are unchanged.
2. Select a catalog item while Zoom remains highlighted, confirm its preview appears, click the map, and confirm placement succeeds.
3. Confirm wheel zoom still changes the camera while Zoom remains selected.
4. Switch to another map and confirm its camera starts fit-to-viewport.
5. Confirm no console errors.

- [ ] **Step 4: Record verification without expanding scope**

Do not change unrelated UI, tests, styles, or known baseline failures discovered during verification.

