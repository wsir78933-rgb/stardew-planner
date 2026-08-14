# Default Farm First-Screen Readiness Design

## Goal

When a user opens the planner, make the complete default Farm map and a large, immediately useful Buildings selection available before secondary maps, catalog categories, analytics, and non-core UI work.

## User scenario

On a cold mobile or desktop visit, the user sees the complete standard spring Farm, the toolbar, and the Buildings sidebar. The user can drag or zoom the map, choose a building from the sidebar, and place it immediately. The current viewport of Buildings thumbnails and the next scroll-length are ready before lower-priority catalog thumbnail work. Other maps are only loaded when the user selects or enables them.

## Confirmed scope

- Prioritize the default Farm TMX, its visible tile layers, Pixi initialization, resource-clump texture, and default placement textures. The full Farm must remain visually complete.
- Treat the Buildings dataset and the four default Farm building textures as first-screen dependencies, so catalog metadata does not begin after the map bootstrap has already completed.
- Load Buildings thumbnails in two priority regions: thumbnails in the actual sidebar viewport and thumbnails within one additional viewport below it. All remaining Buildings thumbnails load only when they become visible.
- Load GA and Clarity only after the existing `editor:interactive` boundary. Other public routes retain their existing analytics behavior.
- Keep other maps, inactive catalog categories, offscreen thumbnails beyond the priority region, dialogs, import/export, and settings out of the first-screen dependency path.

## Non-goals

- Do not change project persistence, map data formats, map artwork, toolbar behavior, visual styling, or the existing catalog selection and placement interfaces.
- Do not replace the complete-map renderer with viewport culling, RenderTexture baking, ParticleContainer, or another rendering architecture in this change.
- Do not preload every Buildings thumbnail, every catalog category, or every map.
- Do not add a dependency, a worktree, a deployment, a push, or a commit.

## Design

### 1. Measure the first-screen pipeline before optimizing it

Extend the existing editor performance marks around the current startup boundaries: the dynamic workspace becomes ready, the Buildings dataset becomes ready, Pixi initialization completes, initial textures start and end, map-container construction starts and ends, and initial placements finish. The existing `editor:interactive` mark remains the map-interaction boundary.

The new marks are diagnostics, not user-visible state. They identify whether the current mobile Fast 4G delay is in downloading/decode, Pixi initialization, or synchronous construction of the complete Farm's tile sprites. They also make each subsequent optimization falsifiable.

### 2. Make Buildings data a first-screen bootstrap dependency

The planner bootstrap already owns the parallel startup boundary for Pixi, the requested default map, local projects, and preferences. It will additionally begin the Buildings dataset load in that same controlled `Promise.all`.

The prepared workspace exposes the completed Buildings catalog through its existing catalog-consumption path rather than a second request. The canvas and sidebar therefore share the existing category-loader promise and continue to fail fast if `Buildings.json` is malformed or unavailable. This removes the current post-bootstrap data waterfall without introducing background fire-and-forget work.

### 3. Prioritize a large, bounded set of Buildings thumbnails

`BuildingCatalogThumbnail` gains a small visibility boundary that owns only thumbnail start eligibility. It accepts the existing interactive gate and observes its card relative to the actual `.item-grid` sidebar scroll container. After the map is interactive, it starts image loading for cards in the viewport plus one `.item-grid` viewport-sized root margin below it. A card that has entered this priority region stays eligible, so it never re-downloads while scrolling back.

The fallback when `IntersectionObserver` is unavailable is explicit: once the map is interactive, the existing thumbnail loading behavior is used so thumbnails do not remain blank. The fallback does not catch or hide image/drawing errors.

Thumbnail source images are shared by resolved asset path across Building cards. A rejected source promise is removed from the cache so a later card can retry and the original failure remains visible. Catalog loading, button selection, map placement, and the thumbnail drawing implementation retain their current responsibilities. Thumbnail visibility is only a scheduling decision.

### 4. Defer analytics only for planner entry routes

Move GA and Clarity out of the root layouts' unconditional `afterInteractive` path. A small client-side planner-entry analytics component waits for the existing `editor:interactive` boundary, then mounts the same GA and Clarity scripts exactly once. Non-planner public routes continue to use the current analytics component immediately, so their tracking behavior is unchanged.

This intentionally changes planner-entry measurement: a visit that leaves before the Farm and prioritized Buildings region are ready is not recorded by GA/Clarity. That trade-off is approved because it avoids competing third-party downloads during the user-visible editor startup.

### 5. Preserve on-demand maps and complete-Farm rendering

Do not alter the default-map resolver's selected-map behavior. Standard Farm startup continues to request only its own TMX and required visible tilesets; Farmhouse and Ginger Island remain conditional requests. Do not skip or cull visible Farm layers. The complete Farm, default placements, map export, and layer order must remain pixel-equivalent.

## Module boundaries

- `planner-workspace-bootstrap`: owns concurrent first-screen resource preparation and returns validated prepared resources.
- `planner-workspace` and catalog loader interfaces: consume prepared Buildings data without knowing whether it arrived from startup or a later category request.
- `item-catalog-panel`: owns card rendering; its thumbnail child owns only visibility-based image start scheduling.
- planner-entry analytics component: owns delayed third-party script mounting; layouts choose immediate analytics for non-planner public routes and delayed analytics for planner entry routes.
- `editor-performance-marks`: owns mark names and mark validation only.

## Error handling

- Keep strict parsing of `Buildings.json`; surface its existing error through the planner startup boundary.
- Reject invalid visibility-scheduling input immediately with a value-specific error where a new public helper requires validation.
- Do not catch errors merely to continue loading. Image or canvas drawing failures continue through existing error reporting.

## Acceptance criteria

1. On a fresh default planner load, the complete standard spring Farm, toolbar, Buildings selection controls, and current-sidebar-plus-one-viewport Buildings thumbnail region become available before inactive category thumbnails and analytics requests.
2. The user can select a prioritized Building and place it on the complete Farm immediately after `editor:interactive`.
3. Standard Farm startup requests its default map and Buildings dataset once each; inactive catalog datasets and other map TMX files are absent until the user selects a relevant feature.
4. GA and Clarity requests on `/` and `/zh` begin only after `editor:interactive`; non-planner public routes retain their current analytics timing.
5. The full Farm's visible output, default placements, pan/zoom, and 1x/HQ screenshot export remain unchanged.
6. Regression evidence includes focused tests, `pnpm typecheck`, a production build, the full suite with any pre-existing unrelated failure reported separately, and a new isolated Ego Lite task space verifying the real selection-and-placement path.
7. Mobile Fast 4G cold and warm measurements report the expanded phase marks and are compared with the current four-mode baseline. The existing 2.5-second mobile threshold remains the gate; a result above it is reported as a failure, not treated as success.

## Risks and mitigations

- Prioritized thumbnail images can compete with map resources. They begin only after the map's existing interaction gate, while the Buildings JSON is fetched during bootstrap so metadata does not create a later waterfall.
- Delayed analytics loses very-short planner-entry sessions. The user explicitly approved that trade-off; analytics for non-planner routes is unchanged.
- Complete-map sprite construction may still dominate mobile startup. Marks are added first; no renderer architecture change is made without evidence that this phase is the bottleneck.
- The active main tree contains unrelated blog edits. This work must not modify, stage, revert, or test-edit those paths.
