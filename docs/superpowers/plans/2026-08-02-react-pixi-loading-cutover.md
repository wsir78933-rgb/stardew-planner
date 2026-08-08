# React/Pixi Loading and SEO-Safe Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use strict TDD and
> `superpowers:verification-before-completion`. Do not switch the default
> runtime until every gate in this plan passes.

**Goal:** Remove the verified startup waterfall, avoid loading editor-heavy
resources in server HTML, and make the accepted React/Pixi runtime the sole
default homepage editor without SEO or Core Web Vitals regression.

**Architecture:** A resource coordinator begins independent startup promises
in parallel and caches in-flight requests per page lifecycle. Catalog data is
loaded by visible category. A fail-fast runtime selector chooses one dynamic
host before importing either implementation. Performance marks define real
interactivity and a built-output script enforces the approved medians.

**Tech Stack:** React/Next dynamic imports, browser Performance API, Pixi.js,
Vitest, built static `out/`, browser/CDP measurement.

## Constraints

- Do not add initial HTML modulepreload for Pixi, TMX, catalog, or frozen
  runtime assets.
- Do not change metadata, canonical, JSON-LD, public copy, sitemap, robots,
  `next.config.ts`, or hosting/deployment cache settings.
- Never mount or download both runtimes in one page load.
- Do not mark interactive based on a timeout or mere canvas visibility.
- A failed project read must not clear or overwrite localStorage.

### Task 1: Ordered performance marks and startup status

**Files:**

- Create: `src/performance/editor-performance-marks.ts`
- Create: `src/components/planner-startup-status.tsx`
- Create: `tests/performance/editor-performance-marks.test.ts`
- Create: `tests/components/planner-startup-status.test.tsx`

- [x] Write RED tests for the eight approved mark names, duplicate suppression,
  strict dependency ordering for `editor:interactive`, unavailable Performance
  API, loading status, explicit error/retry, and no stale accessible loading
  text after interactivity.
- [x] Implement a focused marker port and discriminated startup state. Only
  expected missing browser APIs may no-op; ordering errors must throw with all
  missing marks.
- [x] Enforce this production responsibility table in tests and interfaces:
  `ReactPlannerHost` writes `island-mounted`; coordinator completions write
  project/Pixi/fetch/parse marks; `PlannerCanvas` writes textures-ready after
  every required tilesheet succeeds, canvas-mounted after Pixi/map/camera
  listeners are ready, and interactive only after basic place/select/erase/
  undo/redo callbacks are live. Validate every predecessor transition, not
  only the final interactive transition.
- [x] Run focused tests and typecheck.

### Task 2: Parallel resource coordinator

**Files:**

- Create: `src/resources/default-map-resource.ts`
- Create: `src/resources/planner-resource-coordinator.ts`
- Create: `src/planner/planner-workspace-bootstrap.ts`
- Create: `tests/resources/planner-resource-coordinator.test.ts`
- Create: `tests/planner/planner-workspace-bootstrap.test.ts`
- Modify: `src/components/planner-canvas.tsx`

- [x] Write RED tests proving Pixi import, default TMX fetch, canonical project
  read, and preferences read all start before any await; same map/season
  requests share one in-flight promise; different seasons do not; failures
  name map/season/URL/status; stale generations cannot commit.
- [x] Extract current pure TMX fetch/parse validation into the default-map
  resource module without changing map semantics.
- [x] Implement the page-lifetime coordinator. A failed promise is removed
  from the cache so an explicit retry can start a fresh request.
- [x] Start the four independent operations in one `Promise.all` in the
  standalone workspace bootstrap factory, emit marks from actual completions,
  and define the prepared resource value consumed by Canvas.
- [x] This task is the sole owner of the `PlannerCanvas` prepared-resource
  contract. Add ready/interactivity callbacks plus stale-generation and full
  Pixi/listener cleanup tests here. Later workspace tasks only consume it.
- [x] Run coordinator, bootstrap, Canvas tests, and typecheck. Do not reference
  the later `PlannerWorkspace` module from this task.

### Task 3: Visible-category catalog loading

**Files:**

- Create: `src/catalog/catalog-category-loader.ts`
- Create: `tests/catalog/catalog-category-loader.test.ts`
- Modify: `src/catalog/catalog-schema.ts`
- Modify: `src/catalog/index.ts`
- Modify: `src/catalog/building-placement-metadata-loader.ts`
- Modify: `src/components/item-catalog-panel.tsx`
- Modify: `tests/components/item-catalog-panel.test.tsx`

- [x] Write RED tests for the approved minimum dependency closure: buildings
  requests only `Buildings.json`; crops starts `Crops.json` and `Objects.json`
  in parallel because existing names depend on `HarvestItemId`; placeables
  starts `BigCraftables.json`, `Objects.json`, `Fences.json`,
  `FloorsAndPaths.json`, `Furniture.json`, and `FruitTrees.json` in parallel;
  decor requests no JSON because its current items are static resource clumps;
  inactive categories are not requested; category/dataset errors identify
  both; invalid schema does not become empty.
- [x] Share the Buildings dataset promise with placement metadata. Keep the
  existing all-catalog loader for other callers.
- [x] Make the panel consume explicit category load state while preserving its
  grid, search, tabs, roles, keyboard behavior, and visual classes.
- [x] Start non-critical prefetch only after `editor:interactive` using
  `scheduler.postTask` when available or one yielding zero-delay task.
- [x] Run catalog/panel/workspace tests and typecheck.

### Task 4: Single-runtime selector and React host

**Files:**

- Create: `src/components/editor-runtime-selector.tsx`
- Create: `src/components/react-planner-host.tsx`
- Create: `tests/components/editor-runtime-selector.test.tsx`
- Create: `tests/components/react-planner-host.test.tsx`
- Modify: `src/components/homepage-planner-workspace.tsx`
- Modify: `app/globals.css`
- Modify: `tests/routes/planner-editor-page.test.tsx`
- Modify: `tests/reference-runtime/reference-runtime-delivery.test.ts`

- [ ] Write RED tests for explicit `?plannerRuntime=react|reference`, unknown
  value fallback, duplicate/conflicting value fail-fast, one loader call, one
  root, and an SSR loading host with existing reserved geometry.
- [ ] Make `HomepagePlannerWorkspace` server-render the fixed
  `section[data-homepage-workspace]`, reserve-height wrapper, and accessible
  startup status. The client selector replaces only the wrapper's island.
- [ ] Implement a pure query resolver and client selector. Determine the
  runtime before dynamic import. Keep the default `reference` during work.
- [ ] Export one `loadSelectedPlannerRuntime(kind)` that executes exactly one
  branch-local `import()` after query resolution. Do not declare two top-level
  `dynamic()` hosts because Next may preload both chunks.
- [ ] Browser network tests prove React mode never requests frozen bootstrap or
  `/_app/immutable/**`, and reference mode never requests React workspace or
  Pixi chunks.
- [ ] Run selector, route, delivery tests and typecheck.

### Task 5: Static SEO and bundle delivery gate

**Files:**

- Create: `tests/routes/react-planner-static-delivery.test.tsx`
- Modify only selector fallback after every preceding gate passes:
  `src/components/editor-runtime-selector.tsx`

- [ ] Add RED tests that the static homepage retains its H1, product content,
  FAQ, navigation, metadata/canonical-related shell, and reserved workspace;
  it contains no Pixi, catalog URL, TMX URL, frozen root, or bootstrap script.
- [ ] Build and assert `out/index.html` has no heavy editor reference and the
  default client manifest/path does not request frozen bootstrap/assets.
- [ ] Confirm all complete workspace parity suites pass.
- [ ] Change only the selector fallback from `reference` to `react`.
- [ ] Re-run route/delivery/full tests, typecheck, build, and diff check. If any
  gate fails, restore default reference without deleting either runtime.

### Task 6: Built-output performance and browser acceptance

**Files:**

- Create: `scripts/measure-editor-performance.mjs`
- Create: `tests/performance/editor-performance-measurement-contract.test.ts`
- Create: `docs/verification/2026-08-02-react-pixi-editor-acceptance.md`

- [ ] Write RED tests for CLI validation, at least three samples, sorted median,
  missing marks, forbidden old-runtime requests, and non-zero exit on threshold
  failure.
- [ ] Add an environment RED case: if `globalThis.WebSocket` or another needed
  built-in CDP API is absent, exit before navigation with the exact Node
  version and missing API name. Do not assume the package's minimum Node
  version provides every browser-client API.
- [ ] Implement the measurement script with Node's built-in fetch/WebSocket
  against `--cdp-http-url http://127.0.0.1:9333`; do not add a dependency.
  Fail fast unless a debuggable browser target can be created. Output every
  sample, median, marks, LCP, CLS, supported INP, and long-task count.
- [ ] Run `pnpm build`, then `pnpm exec serve out --listen 3000`. The CLI is
  `node scripts/measure-editor-performance.mjs --base-url http://127.0.0.1:3000 --cdp-http-url http://127.0.0.1:9333 --runtime react --viewport desktop|mobile --cache cold|warm --samples 3`.
  Use CDP Network/Emulation/Performance domains to set viewport, Fast 4G
  profile, cache state, request collection, and user timing. Measure matched
  reference/react profiles at least
  three times for desktop cold, mobile Fast 4G cold, and warm cache.
- [ ] Enforce: desktop cold median <=1500 ms; mobile Fast 4G cold median <=2500
  ms; warm median <=800 ms; no measurable LCP/INP/CLS regression.
- [ ] Use the local browser/CDP path to execute the complete desktop, compact,
  and mobile interaction matrix. INP `null` is not a pass; perform a real
  interaction and record a supported event timing or report the blocker.
- [ ] Record exact commands, samples, screenshots, request checks, feature
  matrix, and failures in the acceptance document.
- [ ] Final commands:

```bash
pnpm build
pnpm exec vitest run
pnpm typecheck
git diff --check
```

Do not claim completion if any feature, storage, static delivery, visual,
browser, or performance gate is missing or failed.
