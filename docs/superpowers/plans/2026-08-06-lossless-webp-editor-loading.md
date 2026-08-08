# Lossless WebP Editor Loading Implementation Plan

> Execution note: work in the existing dirty workspace because the React rebuild is not committed. Do not create commits, push, deploy, or modify Hermes.

**Goal:** Reduce the React editor's initial texture transfer and remove catalog-thumbnail competition before `editor:interactive`, without changing layout, component structure, or decoded material pixels.

**Architecture:** Keep the locked PNG assets as source-of-truth. Generate four derived lossless WebP files in `public/planner-textures/initial/`, route only the verified startup PNG paths through one resolver, and make both map and placement texture loaders use the resolved URL. Gate catalog thumbnail URLs and image decoding on the existing workspace lifecycle status.

**Constraints:** High cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, precise naming. No new runtime dependency. Every code change starts with a focused failing test.

---

## Task 1: Lock the derived lossless WebP contract

**Files:**
- Modify: `tests/rendering/initial-planner-texture-path.test.ts`
- Modify: `src/rendering/initial-planner-texture-path.ts`
- Create: `public/planner-textures/initial/spring_outdoorsTileSheet.webp`
- Create: `public/planner-textures/initial/spring_outdoorsTileSheet2.webp`
- Create: `public/planner-textures/initial/springobjects.webp`
- Create: `public/planner-textures/initial/Cursors.webp`
- Create: `scripts/verify-initial-planner-texture-webp.mjs`

1. Add resolver tests for exactly four PNG-to-WebP mappings, unchanged non-candidates, and invalid input rejection.
2. Run the focused test and confirm it fails because the resolver still returns PNG paths.
3. Add the smallest static mapping in the resolver.
4. Generate the four WebP files with `cwebp -lossless -exact -m 6`.
5. Add a fail-fast standalone verifier that checks source/output existence, dimensions, alpha, lossless format, smaller byte size, and decoded RGBA equality. It requires the locally installed `webpinfo` and `ffmpeg` commands, and is intentionally not invoked by the default Vitest suite.
6. Run the focused resolver test, then separately run `node scripts/verify-initial-planner-texture-webp.mjs`; confirm both pass.

## Task 2: Reuse the resolved startup texture in placement rendering

**Files:**
- Modify: `tests/components/planner-canvas.test.ts`
- Modify: `src/components/planner-canvas.tsx`

1. Add a test proving a placement layer that names `spring_outdoorsTileSheet.png` loads and caches the mapped WebP URL.
2. Run the focused test and confirm it fails because placement loading bypasses the resolver.
3. Resolve the locked local path once and use that resolved URL for both the placement texture cache key and `Assets.load` source.
4. Run the focused Canvas tests and confirm they pass.

## Task 3: Defer catalog thumbnails until the existing interactive boundary

**Files:**
- Modify: `tests/components/planner-workspace-layout.test.tsx`
- Modify: `tests/components/item-catalog-panel.test.tsx`
- Modify: `src/components/planner-workspace.tsx`
- Modify: `src/components/item-catalog-panel.tsx`

1. Add tests proving `loading` and `ready` pass `shouldLoadThumbnails=false`, while `interactive` passes `true`.
2. Extend the catalog test so interior-decor thumbnail DOM remains stable while both background image URLs are omitted before interaction and restored afterward.
3. Run the focused tests and confirm the new assertions fail for the intended reasons.
4. Pass the existing runtime status through the prepared workspace boundary and derive the thumbnail boolean from it.
5. Add the missing interior-decor thumbnail gate without changing DOM, classes, dimensions, or layout.
6. Run the focused tests and confirm they pass.

## Task 4: Review and full verification

1. Have an independent subagent review only the files changed by Tasks 1-3 for scope, correctness, regression risk, and compliance with the approved coding rules.
2. Run `pnpm exec vitest run tests --testTimeout=15000`.
3. Separately run `node scripts/verify-initial-planner-texture-webp.mjs`; this full acceptance check requires local `webpinfo` and `ffmpeg` and does not run inside Vitest.
4. Run `NEXT_TELEMETRY_DISABLED=1 pnpm build`.
5. Run `pnpm typecheck` after the build completes.
6. Run `git diff --check`.
7. Serve the production build and use Ego to capture three desktop cold, three desktop warm, and three mobile Fast 4G runs. Record lifecycle marks, resource count, transferred bytes, startup PNG/WebP requests, and `Cursors.png` timing/encoded bytes.
8. Compare against the recorded baseline without claiming success unless the current measurements support it.

## Explicitly Out of Scope

- Layout, component hierarchy, visual styling, sprite frames, and original PNG assets.
- Non-startup WebP conversion, other tiny startup PNGs, catalog JSON prefetch, and runtime WebP fallback logic.
- Existing unrelated buttons, performance-mark semantics, unrelated tests, and unrelated dirty-worktree files.
- Commit, push, deployment, Hermes changes, or dependency installation.
