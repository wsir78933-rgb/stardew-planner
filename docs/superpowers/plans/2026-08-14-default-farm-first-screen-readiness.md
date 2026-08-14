# Default Farm First-Screen Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the complete default Farm and a large priority region of Buildings thumbnails directly usable before secondary maps, inactive categories, and planner-entry analytics compete for resources.

**Architecture:** Keep complete-Farm rendering intact. First instrument the existing startup path; then warm the shared Buildings catalog promise inside the bootstrap boundary, schedule only the sidebar viewport plus one additional viewport of Building thumbnails after the map becomes interactive, and move planner-entry analytics behind that interaction boundary. Each piece communicates through explicit callback or loader interfaces instead of reaching into another module's internals.

**Tech Stack:** Next.js 16 static export, React, TypeScript, PixiJS, Vitest, local Ego Lite.

## Global Constraints

- Work directly on `main`; do not create a worktree.
- Preserve and do not touch `src/blog/articles/where-is-robin-stardew-valley.en.tsx`, `src/blog/articles/where-is-robin-stardew-valley.zh.tsx`, or `tests/blog/blog-article-content.test.tsx`.
- Do not add dependencies, change persistence, alter map data/artwork, change the complete Farm renderer, push, deploy, stage, or commit.
- Preserve Farmhouse/Ginger Island on-demand loading and every visible layer of the standard Farm.
- Initial Buildings priority is the visible sidebar region plus one measured sidebar-height below it, not every Building card.
- GA and Clarity may begin only after the planner map reaches its existing interaction boundary; non-planner public pages retain existing analytics timing.
- Apply TDD: each production behavior begins with a focused test that fails for the missing behavior, then receives the smallest passing implementation.
- Keep functions single-purpose, use exact names, fail fast at new boundaries, and do not silently swallow failures.

---

### Task 1: Add falsifiable startup phase marks

**Files:**
- Modify: `src/performance/editor-performance-marks.ts`
- Modify: `src/components/react-planner-host.tsx`
- Modify: `src/components/planner-canvas.tsx`
- Modify: `scripts/measure-editor-performance.mjs`
- Modify: `tests/performance/editor-performance-marks.test.ts`
- Modify: `tests/performance/editor-performance-measurement-contract.test.ts`
- Modify: `tests/components/react-planner-host.test.tsx`

**Interfaces:**
- Consumes: `EditorPerformanceMarker.mark(markName)` and the existing startup marks.
- Produces: ordered diagnostic marks for workspace availability, Pixi application initialization, initial-texture start, and map-container start/end.
- Produces: performance CLI output that includes every approved mark duration without weakening the existing threshold gate.

- [ ] **Step 1: Write failing mark-contract tests**

Add each new name to the expected ordered array and ownership map before adding it to production code. Add predecessor assertions proving that a map-container mark cannot be written before required textures and that Pixi application initialization cannot be written before the Pixi module is ready.

```ts
expect(EDITOR_PERFORMANCE_MARKS).toContain("editor:map-container-ready");
expect(() => marker.mark("editor:pixi-application-ready")).toThrow(
  /editor:pixi-application-ready.*editor:pixi-module-ready/s,
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run tests/performance/editor-performance-marks.test.ts --no-file-parallelism
```

Expected: failure because the new mark names and predecessor rules are absent.

- [ ] **Step 3: Add ordered diagnostic marks at their owning boundaries**

Add only explicit mark constants and predecessor rules in `editor-performance-marks.ts`. Mark workspace availability from `ReactPlannerHost`, and Pixi application initialization and map-container construction from `PlannerCanvas`. Retain every existing mark and its current owner.

```ts
performanceMarker.mark("editor:initial-textures-started");
const { resourceClumpTilesheetTexture, tilesheetTextures } =
  await loadPlannerCanvasInitialTextures(
    pixi,
    renderingContract.tilesets,
    resolvedInitialPlacementTextureEntries,
    placementTexturePromisesByResolvedUrl,
  );
performanceMarker.mark("editor:required-textures-ready");
performanceMarker.mark("editor:map-container-started");
const mapContainerCreationResult = createMapContainer(
  pixi,
  renderingContract,
  tilesheetTextures,
);
performanceMarker.mark("editor:map-container-ready");
```

Use only marks that correspond to code boundaries already present; do not add timers, retries, or new loading state.

- [ ] **Step 4: Make the measurement CLI expose the phase evidence**

Extend the CLI's approved-mark validation and result serialization to include the new marks. A missing approved mark must remain a value-specific error.

```js
const markDurationsByName = Object.fromEntries(
  EDITOR_PERFORMANCE_MARKS.map((markName) => [
    markName,
    getRequiredPerformanceMarkDuration(entries, markName),
  ]),
);
```

- [ ] **Step 5: Run focused tests and typecheck**

Run:

```bash
pnpm exec vitest run tests/performance/editor-performance-marks.test.ts tests/performance/editor-performance-measurement-contract.test.ts tests/components/react-planner-host.test.tsx --no-file-parallelism
pnpm typecheck
```

Expected: all targeted tests pass and TypeScript reports no errors.

### Task 2: Warm the shared Buildings catalog during default-map bootstrap

**Files:**
- Modify: `src/planner/planner-workspace-bootstrap.ts`
- Modify: `src/catalog/catalog-category-loader.ts`
- Modify: `src/performance/editor-performance-marks.ts`
- Modify: `scripts/measure-editor-performance.mjs`
- Modify: `tests/planner/planner-workspace-bootstrap.test.ts`
- Modify: `tests/catalog/catalog-category-loader.test.ts`
- Modify: `tests/performance/editor-performance-marks.test.ts`
- Modify: `tests/performance/editor-performance-measurement-contract.test.ts`

**Interfaces:**
- Consumes: `CatalogCategoryLoader.loadCategory("buildings")` through its public loader interface.
- Produces: a completed shared Buildings category promise by the time the default workspace is prepared, with one request and one strict catalog projection.
- Depends on: Task 1's `editor:workspace-module-ready` mark.

- [ ] **Step 1: Write failing bootstrap tests**

Inject a deferred `loadInitialBuildingsCatalog` port into the browser bootstrap factory. Assert that Pixi, map, project, preferences, and Buildings all start before the first await; assert that a rejected Buildings loader rejects the bootstrap and that the result cannot be prepared before it resolves. Add a catalog-loader test proving the same Buildings category call returns the cached promise and invokes its projection once; add a mark test proving Buildings marks as soon as it resolves even while a different bootstrap promise remains pending.

```ts
expect(startedOperations).toEqual([
  "pixi",
  "map",
  "project",
  "preferences",
  "buildings",
]);
await expect(bootstrapPromise).rejects.toThrow("Buildings catalog");
expect(categoryLoader.loadCategory("buildings")).toBe(
  categoryLoader.loadCategory("buildings"),
);
```

- [ ] **Step 2: Run the focused bootstrap test and verify RED**

Run:

```bash
pnpm exec vitest run tests/planner/planner-workspace-bootstrap.test.ts --no-file-parallelism
```

Expected: failure because browser bootstrap has no Buildings loader port or parallel dependency.

- [ ] **Step 3: Add the narrow loader port and await it with existing bootstrap dependencies**

Add a category-promise cache inside the existing `CatalogCategoryLoader`: its non-async `loadCategory` function returns the same stored promise for a category, and removes only that promise if it rejects. Use the existing `loadCatalogCategory("buildings")` public API as the browser default. Start its promise beside the four existing startup promises and include it in the same `Promise.all`. Add `editor:buildings-dataset-ready` with `editor:workspace-module-ready` as its required predecessor. Mark from the Buildings promise resolution chain, not after the other four promises. Do not perform a second fetch or a fire-and-forget prefetch.

```ts
const buildingsCatalogPromise = input.loadInitialBuildingsCatalog().then((catalog) => {
  performanceMarker?.mark("editor:buildings-dataset-ready");
  return catalog;
});
const [pixi, preparedMap, projectState, preferences, buildingsCatalog] = await Promise.all([
  pixiPromise,
  mapPromise,
  projectStatePromise,
  preferencesPromise,
  buildingsCatalogPromise,
]);
void buildingsCatalog;
```

The completed catalog remains owned by the existing singleton category loader; later sidebar calls reuse the cached category promise, while placement metadata reuses the cached raw Buildings dataset promise. Add the approved Buildings mark to the measurement CLI's required mark list and mark-contract test.

- [ ] **Step 4: Run focused regression tests and typecheck**

Run:

```bash
pnpm exec vitest run tests/planner/planner-workspace-bootstrap.test.ts tests/catalog/catalog-category-loader.test.ts tests/performance/editor-performance-marks.test.ts tests/performance/editor-performance-measurement-contract.test.ts --no-file-parallelism
pnpm typecheck
```

Expected: initial startup starts Buildings once in parallel; malformed or failed data rejects with the existing concrete error; no type errors.

### Task 3: Schedule and share priority Buildings thumbnails

**Files:**
- Create: `src/components/building-thumbnail-visibility.ts`
- Modify: `src/components/item-catalog-panel.tsx`
- Modify: `tests/components/item-catalog-panel.test.tsx`
- Create: `tests/components/building-thumbnail-visibility.test.ts`

**Interfaces:**
- Consumes: `shouldLoadThumbnail: boolean`, an `HTMLCanvasElement` ref, the `.item-grid` scroll-root ref, and browser `IntersectionObserver` availability.
- Produces: `useBuildingThumbnailLoadEligibility(...) => boolean`, which opens after map interaction only for the sidebar viewport plus one viewport-height below it; it stays open for a card after first entry.
- Produces: `loadBuildingThumbnailImages(...)` with an image promise shared by resolved asset path and cleared after rejection.
- Depends on: Task 2's completed Buildings dataset and existing `runtimeStatus === "interactive"` gate.

- [ ] **Step 1: Write failing unit tests**

Test the visibility policy as a pure input contract and test a thumbnail image loader built with a fake image constructor: identical resolved paths across calls create one image; a rejected path is removed from the loader cache; the non-interactive gate never requests an image.

```ts
expect(createBuildingThumbnailObserverOptions()).toEqual({
  root: itemGridElement,
  rootMargin: `0px 0px ${String(itemGridElement.clientHeight)}px 0px`,
  threshold: 0,
});
await expect(loadBuildingThumbnailImages([
  "/tilesheets/a.png",
  "/tilesheets/a.png",
])).resolves.toBeInstanceOf(Map);
```

- [ ] **Step 2: Run focused thumbnail tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/item-catalog-panel.test.tsx tests/components/building-thumbnail-visibility.test.ts --no-file-parallelism
```

Expected: failure because no visibility policy module or cross-card image cache exists.

- [ ] **Step 3: Implement the minimal visibility hook and shared image loader**

Create one small hook that observes the thumbnail canvas after `shouldLoadThumbnail` becomes true. It receives the actual `.item-grid` scroll-root ref and uses that element as the observer root. It derives a pixel bottom root margin from `itemGridElement.clientHeight`, so one extra priority screen is based on sidebar height rather than width. It returns false before interaction, true forever after that thumbnail intersects the scrollport or its measured one-scrollport-height lower margin, and true immediately when `IntersectionObserver` is unavailable. Disconnect the observer during cleanup.

```ts
export function createBuildingThumbnailObserverOptions(): IntersectionObserverInit {
  return {
    root: null,
    rootMargin: "0px 0px 100% 0px",
    threshold: 0,
  };
}
```

Make `BuildingCatalogThumbnail` use that returned boolean before obtaining a canvas context or loading images. Keep all existing composition, frame, and draw code unchanged. Add `createBuildingThumbnailImageLoader(createBuildingThumbnailImage)` so the production module owns one loader and tests obtain an isolated loader. Store image promises by resolved path; remove only the rejected promise and rethrow the original value with the existing item-specific context.

Add a mounted component test with attached canvas and item-grid refs plus a fake global `IntersectionObserver`: it must receive the actual item-grid root and a pixel root margin derived from a non-square grid height, observe the canvas once, set eligibility when the callback reports an intersection in the extra margin, disconnect during cleanup, and return the fallback eligibility when no constructor is available. Recreate the observer when a subsequent render supplies a changed grid height.

- [ ] **Step 4: Run focused tests and typecheck**

Run:

```bash
pnpm exec vitest run tests/components/item-catalog-panel.test.tsx tests/components/building-thumbnail-visibility.test.ts --no-file-parallelism
pnpm typecheck
```

Expected: all thumbnail contract tests pass; existing pre-interactive behavior stays unchanged.

### Task 4: Defer planner-entry analytics until the map is interactive

**Files:**
- Create: `src/components/public-analytics.tsx`
- Create: `src/components/planner-entry-readiness.ts`
- Modify: `app/(en)/layout.tsx`
- Modify: `app/zh/layout.tsx`
- Modify: `src/components/react-planner-host.tsx`
- Modify: `src/components/planner-workspace.tsx`
- Create: `tests/components/public-analytics.test.tsx`
- Modify: `tests/components/react-planner-host.test.tsx`
- Modify: `tests/routes/planner-editor-page.test.tsx`

**Interfaces:**
- Consumes: `markPlannerEntryInteractive()` from `planner-entry-readiness` after the existing canvas interactive callback.
- Produces: `PublicAnalytics`, rendered by both layouts, which loads GA/Clarity immediately for non-planner paths and only after planner readiness for `/` and `/zh`.
- Depends on: Task 3's map-interaction gate; it does not wait for offscreen thumbnail work.

- [ ] **Step 1: Write failing analytics and readiness tests**

Test path classification and readiness subscription with no browser globals. Test that planner-entry analytics render no third-party script before `markPlannerEntryInteractive()`, then render each script once after it. Test that a non-planner path renders current analytics immediately.

```ts
expect(isPlannerEntryPath("/")).toBe(true);
expect(isPlannerEntryPath("/zh")).toBe(true);
expect(isPlannerEntryPath("/privacy")).toBe(false);
```

- [ ] **Step 2: Run focused analytics tests and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/public-analytics.test.tsx tests/components/react-planner-host.test.tsx tests/routes/planner-editor-page.test.tsx --no-file-parallelism
```

Expected: failure because layouts mount third-party scripts unconditionally and no planner readiness interface exists.

- [ ] **Step 3: Add a durable readiness interface and route-aware analytics component**

Keep the readiness module narrowly responsible for an in-memory completed flag and subscriptions. It must return the current completion state to a late subscriber, so analytics cannot miss a readiness signal during hydration. Let the layouts render `PublicAnalytics`; remove the duplicate inline scripts.

```ts
export function markPlannerEntryInteractive(): void {
  plannerEntryInteractive = true;
  for (const listener of readinessListeners) listener();
}

export function subscribeToPlannerEntryReadiness(listener: () => void): () => void {
  readinessListeners.add(listener);
  return () => readinessListeners.delete(listener);
}
```

Call the interface through a generic `onInteractive` callback from the planner host/workspace boundary after the current `editor:interactive` mark. Do not import analytics code into `PlannerCanvas`.

- [ ] **Step 4: Run focused tests and typecheck**

Run:

```bash
pnpm exec vitest run tests/components/public-analytics.test.tsx tests/components/react-planner-host.test.tsx tests/routes/planner-editor-page.test.tsx --no-file-parallelism
pnpm typecheck
```

Expected: planner entries delay GA/Clarity; non-planner routes retain their current scripts; no type errors.

### Task 5: Verify the first-screen contract in the real browser and final build

**Files:**
- Modify only if an acceptance test exposes a defect in Tasks 1-4.
- Test: existing focused tests from Tasks 1-4.

**Interfaces:**
- Consumes: first-screen marks, bootstrap Buildings loader, thumbnail eligibility, and planner-entry analytics readiness from Tasks 1-4.
- Produces: reproducible current-baseline versus post-change evidence without treating a failed performance gate as success.

- [ ] **Step 1: Build the static export**

Run:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm exec next build --webpack
```

Expected: production build succeeds. Record any generated `next-env.d.ts` drift separately and do not overwrite user work.

- [ ] **Step 2: Run the full suite after the build**

Run:

```bash
pnpm exec vitest run --no-file-parallelism
```

Expected: all tests pass except an already-known unrelated 404 stylesheet-path assertion, if it still reproduces. Do not change that test in this task.

- [ ] **Step 3: Verify the real default planner with a new Ego Lite task space**

Start a fresh local static server and a fresh agent-owned Ego Lite task space. At mobile 390×844 Fast 4G and desktop dimensions, verify:

```text
1. the complete standard Farm is visible;
2. no Farmhouse or Ginger Island TMX request occurs;
3. Buildings.json occurs once;
4. the current sidebar region and one lower screen of Building thumbnails draw;
5. Coop can be selected and placed on the Farm;
6. GA and Clarity do not request before editor:interactive;
7. GA and Clarity request after planner readiness;
8. no old frozen runtime resource is requested.
```

Close the task space with `keep:false` and stop only the task-owned server.

- [ ] **Step 4: Run four-mode performance measurement and final hygiene checks**

Run the existing performance CLI for desktop/mobile × cold/warm with three samples per mode against the fresh static server. Compare medians and expanded phase marks to the recorded baseline. Then run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only planned performance files, the two planning documents, and the pre-existing user blog files are modified. Report every performance threshold result truthfully.
