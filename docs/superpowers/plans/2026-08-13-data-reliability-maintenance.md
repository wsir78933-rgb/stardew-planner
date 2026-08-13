# Data Reliability and Maintainability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent invalid project writes and stale map saves, persist editor preferences, establish repeatable quality evidence, and make one focused Canvas responsibility extraction without changing reference-runtime behavior.

**Architecture:** Keep browser persistence behind the existing repository and workspace-controller interfaces. Validate an import or duplicate all the way through editor-session preparation before a transaction writes; carry an expected project timestamp only through the current-map save path and reject mismatches before `setItem`. Extract only the screenshot exporter through an explicit Pixi port, while retaining lifecycle ownership in `PlannerCanvas`.

**Tech Stack:** Next.js 16 static export, React, TypeScript strict mode, Vitest, PixiJS, pnpm.

## Global Constraints

- Work only in `/private/tmp/stardew-planner-data-reliability-maintenance` on `codex/data-reliability-maintenance`; do not modify the source checkout.
- Do not commit, push, deploy, install new dependencies, change Cloudflare, or change the frozen reference runtime or its `/assets/` tree.
- Use TDD: add each regression test first and observe its expected failure before production code.
- Preserve existing user data: no storage-clearing UI or automatic deletion is in scope.
- Do not set a thumbnail size limit or migrate storage to IndexedDB.
- Conflict detection applies only to saving the current map: stale saves must fail before storage writes and name the project plus expected/actual revision values.
- Performance work must not assert an unmeasured bottleneck. Reuse the current CDP measurement script, add a package command only, and report CDP unavailability as unverified.
- Use small functions, explicit interfaces, concrete names, fail-fast validation, and no speculative abstraction.

---

### Task 1: Establish the worktree quality baseline

**Files:**
- Modify only if a real, reproducible failure requires a minimal fix: the failing source/test file(s), `package.json`, and `pnpm-lock.yaml`.

**Interfaces:**
- Consumes: existing package scripts, locked pnpm dependencies, Vitest configuration.
- Produces: command-by-command baseline results and a categorized list of reproducible failures.

- [ ] **Step 1: Install the locked dependency graph in the worktree**

Run: `pnpm install --frozen-lockfile`

Expected: exit 0, with no changes to `package.json` or `pnpm-lock.yaml`.

- [ ] **Step 2: Run isolated static checks**

Run: `pnpm typecheck`

Expected: record exit status separately from tests and build.

- [ ] **Step 3: Run the full test suite without the package pretest build hook**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm exec vitest run --no-file-parallelism`

Expected: record every failure with its test file and error; do not classify build failures as test failures.

- [ ] **Step 4: Run the static-export build independently**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm build`

Expected: record export outcome and inspect `git diff -- next-env.d.ts` before any follow-up action.

- [ ] **Step 5: Audit direct dependency paths**

Run: `pnpm audit --prod --json` and `pnpm outdated --format json`.

Expected: only a confirmed production advisory with a compatible minimal update can change `package.json` or `pnpm-lock.yaml`; “outdated” alone is not a change request.

### Task 2: Validate project session representability before persistence and reject stale map saves

**Files:**
- Modify: `src/reference-runtime/reference-project-repository.ts`
- Modify: `src/reference-runtime/use-reference-project-workspace.ts`
- Modify: `src/reference-runtime/reference-project-editor-adapter.ts` only if its existing public session-preparation function cannot be consumed without reaching into an implementation detail.
- Test: `tests/reference-runtime/use-reference-project-workspace.test.tsx`
- Test: `tests/reference-runtime/reference-project-repository.test.ts`

**Interfaces:**
- Consumes: repository transaction callback, existing editor-session adapter, `ReferenceProjectWorkspaceController.saveOpenMap`.
- Produces: a public, narrow preflight callback that accepts a candidate project and either returns a prepared active-map session or throws; `saveOpenMap` passes the active project revision as its expected value.

- [ ] **Step 1: Write failing workspace tests for rejected imports and duplicates**

Add cases that use the real repository with memory storage and an adapter-rejected map/decor candidate. Assert the operation rejects, `setItem` is never called, and the existing workspace state remains unchanged.

- [ ] **Step 2: Run only the new preflight tests**

Run: `pnpm exec vitest run tests/reference-runtime/use-reference-project-workspace.test.tsx`

Expected: FAIL because import/duplicate currently persist before session preparation.

- [ ] **Step 3: Add the narrow preflight interface and minimal implementation**

Prepare the candidate active-map session before calling the repository write operation. Pass the prepared result into the post-write state update without recomputing it. Do not change project JSON schemas or introduce a second storage layer.

- [ ] **Step 4: Write failing stale-current-map save coverage**

Create a saved project, capture its revision in one controller, apply an external repository update that changes the same project revision, then save through the stale controller. Assert the error names project ID, expected revision, and actual revision; assert zero stale writes and unchanged external content.

- [ ] **Step 5: Add the expected-revision guard at the repository transaction boundary**

Accept an expected revision only for `saveOpenMap`. Read and validate the current document, compare the target project revision before mutation, throw a specific conflict error on mismatch, then retain the existing single-write transaction path for matching revisions.

- [ ] **Step 6: Verify targeted repository and workspace tests**

Run: `pnpm exec vitest run tests/reference-runtime/reference-project-repository.test.ts tests/reference-runtime/use-reference-project-workspace.test.tsx`

Expected: PASS.

### Task 3: Persist user-changed editor preferences without changing storage recovery behavior

**Files:**
- Modify: `src/planner/planner-workspace-bootstrap.ts`
- Modify: `src/components/planner-workspace.tsx`
- Create: `src/components/planner-workspace-preference-persistence.ts`
- Test: `tests/components/planner-workspace.test.tsx`
- Test: `tests/editor/browser-editor-preferences.test.ts`

**Interfaces:**
- Consumes: `EditorPreferences`, existing browser preference store’s `save` method, restored initial preferences.
- Produces: `createPlannerWorkspacePreferencePersistence({ savePreferences, initialPreferences })`, which saves only user changes after the initial restored value is applied.

- [ ] **Step 1: Write failing preference persistence tests**

Test that initial restore performs no write, one user preference change saves the exact strict preference record, a remount reads it back, and a storage write error reaches the existing user-visible error path.

- [ ] **Step 2: Run the focused tests**

Run: `pnpm exec vitest run tests/components/planner-workspace.test.tsx tests/editor/browser-editor-preferences.test.ts`

Expected: FAIL because production workspace code has no preference save path.

- [ ] **Step 3: Pass a save-only port from bootstrap and persist changes after restore**

Expose only `(preferences: EditorPreferences) => void` to the workspace. The persistence module compares the restored initial value before invoking the port; it does not read browser storage or handle unrelated workspace state.

- [ ] **Step 4: Verify focused behavior**

Run: `pnpm exec vitest run tests/components/planner-workspace.test.tsx tests/editor/browser-editor-preferences.test.ts`

Expected: PASS.

### Task 4: Make the existing editor measurement callable and extract Canvas screenshot export

**Files:**
- Modify: `package.json`
- Modify: `src/components/planner-canvas.tsx`
- Create: `src/components/planner-canvas-map-image-exporter.ts`
- Test: `tests/components/planner-canvas.test.ts`
- Test: `tests/components/planner-canvas-placement-animation.test.ts`
- Test: `tests/performance/editor-performance-measurement-contract.test.ts`

**Interfaces:**
- Consumes: the existing `measure-editor-performance.mjs` CLI and the existing Canvas screenshot methods.
- Produces: `performance:editor` package command and an explicit `MapImageExporter` factory that receives only Pixi renderer/container ports and returns existing screenshot methods.

- [ ] **Step 1: Write focused failing tests for the new module export and package command**

Move one existing screenshot behavior assertion to import the new exporter module; add a package-script contract assertion for `performance:editor` pointing to the existing measurement script.

- [ ] **Step 2: Run focused Canvas and measurement tests**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-canvas-placement-animation.test.ts tests/performance/editor-performance-measurement-contract.test.ts`

Expected: FAIL because the exporter module and package command do not exist.

- [ ] **Step 3: Extract only screenshot export responsibilities**

Move canvas screenshot capture, overlay visibility restoration, PNG creation, watermark creation, and explicit canvas validation into the exporter module. Keep renderer/container lifetime and React refs in `PlannerCanvas`; preserve exported errors and output behavior.

- [ ] **Step 4: Add the package command without creating a CI job or new browser dependency**

Set `performance:editor` to invoke the existing measurement script. Do not set size thresholds or claim performance results without a working static server and CDP endpoint.

- [ ] **Step 5: Verify focused behavior**

Run: `pnpm exec vitest run tests/components/planner-canvas.test.ts tests/components/planner-canvas-placement-animation.test.ts tests/performance/editor-performance-measurement-contract.test.ts`

Expected: PASS.

### Task 5: Remove one source of React-runtime asset-path and flame-rendering duplication

**Files:**
- Create: `src/assets/game-asset-path.ts`
- Create: `src/rendering/fire-animation-frames.ts`
- Modify only React-runtime source consumers selected by search, not `public/reference-runtime/**`.
- Modify: `src/rendering/furniture-fire-placement-rendering.ts`
- Modify: `src/rendering/lit-big-craftable-placement-rendering.ts`
- Test: `tests/rendering/furniture-fire-placement-rendering.test.ts`
- Test: `tests/rendering/lit-big-craftable-placement-rendering.test.ts`
- Test: `tests/assets/game-asset-path.test.ts`

**Interfaces:**
- Produces: `gameAssetRoot`, `createGameAssetPath(relativePath)`, and shared read-only flame/glow frame definitions.
- Consumes: existing React planner asset URLs and renderer-specific geometry definitions.

- [ ] **Step 1: Write failing path-validation and shared-frame behavior tests**

Assert valid relative paths receive the versioned React asset root; empty, absolute, backslash, and parent-directory input throws a value-specific error. Assert both rendering modules retain current frame ordering and position offsets through the shared definition.

- [ ] **Step 2: Run the focused path and rendering tests**

Run: `pnpm exec vitest run tests/assets/game-asset-path.test.ts tests/rendering/furniture-fire-placement-rendering.test.ts tests/rendering/lit-big-craftable-placement-rendering.test.ts`

Expected: FAIL because shared interfaces do not exist.

- [ ] **Step 3: Add small source-only interfaces and migrate selected React runtime consumers**

Use the path builder at source construction boundaries. Do not rewrite test fixture literals, static filesystem paths, or frozen runtime `/assets/` paths. Keep renderer-specific validation and geometry local.

- [ ] **Step 4: Verify focused behavior**

Run: `pnpm exec vitest run tests/assets/game-asset-path.test.ts tests/rendering/furniture-fire-placement-rendering.test.ts tests/rendering/lit-big-craftable-placement-rendering.test.ts`

Expected: PASS.

### Task 6: Repair only verified baseline failures and perform final verification

**Files:**
- Modify: only exact source/test/configuration files implicated by the Task 1 evidence.

**Interfaces:**
- Consumes: the Task 1 command logs and all completed task regression tests.
- Produces: a final evidence table distinguishing test, build, environment, and advisory results.

- [ ] **Step 1: Reproduce each remaining failure in its smallest command**

Run the individual failing test or build path before changing it. If it does not reproduce, record it as environment-dependent and do not change source for it.

- [ ] **Step 2: Add a failing regression test for each real code defect**

Make each test name describe the user-visible or contract behavior. Do not change assertions merely to accept an incorrect implementation.

- [ ] **Step 3: Apply the smallest compatible fix and re-run its focused test**

Avoid adding coverage frameworks, E2E frameworks, CI providers, or unrelated version upgrades.

- [ ] **Step 4: Run complete verification**

Run: `pnpm typecheck`, `NEXT_TELEMETRY_DISABLED=1 pnpm exec vitest run --no-file-parallelism`, `NEXT_TELEMETRY_DISABLED=1 pnpm build`, and all focused regression tests. Re-run `pnpm audit --prod --json` if a production dependency changed. Inspect `git diff --check` and `git diff -- next-env.d.ts`.

- [ ] **Step 5: Attempt the existing measurement command only with an available local static server and CDP endpoint**

Run: `pnpm performance:editor ...` using the script’s documented arguments. If no eligible CDP endpoint is available, record the performance result as unverified rather than a pass.
