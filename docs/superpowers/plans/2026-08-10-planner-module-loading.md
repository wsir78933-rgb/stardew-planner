# Planner Module Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Test whether starting the existing `PlannerWorkspace` dynamic import
at host-module evaluation removes an editor-loading waterfall without changing
layout, behavior, or other resources.

**Architecture:** A small injectable loader factory starts one module Promise,
immediately observes rejection without replacing the Promise, and supplies the
named component to the existing `next/dynamic` boundary. A fresh production
baseline and an identical post-change profile determine whether the experiment
is retained or reverted.

**Tech Stack:** Next.js 16.3, React 19, TypeScript, Vitest, static export,
Ego Browser CDP, and the exported measurement contracts in
`scripts/measure-editor-performance.mjs`.

## Global Constraints

- Work in the current workspace; do not create a worktree.
- Do not stage, commit, push, deploy, install dependencies, or modify
  Cloudflare.
- Do not modify CSS, DOM structure, editor copy, interaction semantics, Pixi,
  TMX, texture loading, map loading, or public-page behavior.
- Perform every browser measurement and browser acceptance check in the one
  Ego Browser task space named `stardew planner performance acceptance`. Do
  not start, reuse, terminate, or inspect a Google Chrome remote-debugging
  process.
- Apply high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise
  naming. Do not use generic names such as `data`, `temp`, `helper`, `util`, or
  `manager`.
- Write and run the focused failing test before production code.
- Retain the experiment only when the mobile cold median is both below the
  fresh baseline and no greater than `2500 ms`, with all other existing
  profile thresholds passing.

---

### Task 1: Record the current production baseline

**Files:**
- Read: `scripts/measure-editor-performance.mjs`
- Create outside Git: the task report in this plan's ignored SDD workspace

**Interfaces:**
- Consumes: existing production static export and measurement CLI
- Produces: four baseline JSON outputs and exact medians for Task 3

- [ ] **Step 1: Confirm the workspace boundary**

Run:

```bash
git status --short
git rev-parse --short HEAD
```

Expected: only the approved untracked specification/plan documents are
present; no worktree, branch, commit, or source mutation is performed.

- [ ] **Step 2: Build the current source before any loader edit**

Run:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Expected: exit `0` and a complete `out/` static export. Record any generated
`next-env.d.ts` change so it can be restored after final verification.

- [ ] **Step 3: Start the static server and select the Ego task space**

Run the static server on `4173` and save only its task-owned process identifier:

```bash
pnpm exec serve out --listen tcp://127.0.0.1:4173
```

Select or create the one Ego task space for this goal. All later Ego heredocs
must resume the returned numeric task-space identifier:

```bash
ego-browser nodejs <<'EOF'
const task = await useOrCreateTaskSpace('stardew planner performance acceptance')
await openOrReuseTab('http://127.0.0.1:4173/?plannerRuntime=react', {
  wait: true,
  timeout: 20,
})
cliLog(JSON.stringify({ taskSpaceId: task.id, page: await pageInfo() }))
EOF
```

Expected: the page title is the planner homepage and the task space is
agent-owned. If Ego reports that the user controls the task space, stop and
request explicit continuation; do not seize control.

- [ ] **Step 4: Capture the four baseline profiles**

Use `ego-browser nodejs <<'EOF' ... EOF`; do not create a browser automation
file. The heredoc must resume the numeric task-space identifier from Step 3
and import these existing public contracts from
`scripts/measure-editor-performance.mjs`:

```js
import {
  FAST_4G_NETWORK_CONDITIONS,
  REQUIRED_EDITOR_PERFORMANCE_MARKS,
  calculateSortedMedian,
  findForbiddenRuntimeRequests,
  findMissingEditorPerformanceMarks,
} from './scripts/measure-editor-performance.mjs'
```

Keep the Ego orchestration small and single-purpose:

1. `configureEgoMeasurement(viewportKind, cacheMode)` calls
   `Emulation.setDeviceMetricsOverride`, `Network.setCacheDisabled`, optional
   `Network.clearBrowserCache`, and the exact exported Fast 4G conditions for
   mobile cold. Other profiles disable throttling. It returns the exact CDP
   method/parameter records it applied; do not report only the requested
   profile labels.
2. `readInteractiveSample()` navigates to
   `http://127.0.0.1:4173/?plannerRuntime=react`, polls user-timing marks for at
   most 15 seconds, and returns the marks plus
   `performance.getEntriesByType('resource').map(entry => entry.name)`.
3. `measureProfile(viewportKind, cacheMode)` performs one unrecorded warm-up
   for warm profiles, then exactly three recorded samples. It fails fast when
   a required mark is absent or
   `findForbiddenRuntimeRequests('react', resourceUrls)` is non-empty. Its
   result includes the applied CDP records, whether a warm-up ran, the warm-up
   completion timestamp, and the three samples.
4. The main body runs, in order: mobile cold, mobile warm, desktop cold,
   desktop warm. It prints only one JSON object through `cliLog`, containing
   the unedited samples and `calculateSortedMedian` result for each profile.

After the four profiles, use Ego's visual workflow to capture one desktop and
one 390x844 mobile screenshot, click the visible planner canvas, and verify a
second screenshot or page-state readback. This is an acceptance check only;
do not alter any layout.

Expected: all three samples per profile contain every required lifecycle mark,
including `editor:interactive`; resource auditing reports no React request for
the frozen reference runtime; and the canvas remains visible and interactive.
Save the exact Ego JSON and screenshot paths in the SDD report.

Do not complete or close the Ego task space in this task. Task 3 must resume
the same numeric task-space identifier for the post-change comparison. If an
earlier run already completed the task space, record that protocol failure,
create one replacement with the same goal name because the original is no
longer available, repeat the full baseline in that replacement, and keep the
replacement open.

### Task 2: Reuse one PlannerWorkspace import Promise

**Files:**
- Modify: `tests/components/react-planner-host.test.tsx`
- Modify: `src/components/react-planner-host.tsx`

**Interfaces:**
- Consumes: `Promise<typeof import("./planner-workspace")>`
- Produces:
  `createPlannerWorkspaceModuleLoader(importPlannerWorkspace): () => Promise<PlannerWorkspaceComponent>`

- [ ] **Step 1: Add the import-start and reuse RED test**

Add a test with a hand-controlled module Promise. It must prove the production
change that would break the contract: delaying `importPlannerWorkspace()`
until the returned loader is invoked, or invoking it more than once.

```tsx
it("starts one PlannerWorkspace import per host-module startup and reuses it", async () => {
  let importCallCount = 0;
  let resolvePlannerWorkspaceModule!: (
    module: typeof import("../../src/components/planner-workspace")
  ) => void;
  const plannerWorkspaceModulePromise = new Promise<
    typeof import("../../src/components/planner-workspace")
  >((resolve) => {
    resolvePlannerWorkspaceModule = resolve;
  });
  const loadPlannerWorkspace = createPlannerWorkspaceModuleLoader(() => {
    importCallCount += 1;
    return plannerWorkspaceModulePromise;
  });

  expect(importCallCount).toBe(1);
  const firstComponentPromise = loadPlannerWorkspace();
  const secondComponentPromise = loadPlannerWorkspace();
  resolvePlannerWorkspaceModule(await import("../../src/components/planner-workspace"));

  expect(await firstComponentPromise).toBe(PlannerWorkspace);
  expect(await secondComponentPromise).toBe(PlannerWorkspace);
  expect(importCallCount).toBe(1);
});
```

Use the actual exported component from the real module; do not assert only on
a mock call.

- [ ] **Step 2: Run RED**

Run:

```bash
pnpm exec vitest run tests/components/react-planner-host.test.tsx --no-file-parallelism
```

Expected: FAIL because `createPlannerWorkspaceModuleLoader` does not exist.

- [ ] **Step 3: Add the rejection-propagation RED test**

```tsx
it("keeps the original PlannerWorkspace import rejection observable", async () => {
  const importFailure = new Error("planner workspace import failed");
  const loadPlannerWorkspace = createPlannerWorkspaceModuleLoader(() =>
    Promise.reject(importFailure),
  );

  await expect(loadPlannerWorkspace()).rejects.toBe(importFailure);
});
```

This catches replacing the original rejected Promise with a fulfilled observer
Promise. Run the focused command again and confirm the intended missing-export
failure remains.

- [ ] **Step 4: Implement the minimal loader factory**

Add precise module-local types and this behavior:

```tsx
type PlannerWorkspaceModule = typeof import("./planner-workspace");
type ImportPlannerWorkspace = () => Promise<PlannerWorkspaceModule>;

export function createPlannerWorkspaceModuleLoader(
  importPlannerWorkspace: ImportPlannerWorkspace,
) {
  const plannerWorkspaceModulePromise = importPlannerWorkspace();
  void plannerWorkspaceModulePromise.catch(() => undefined);

  return () =>
    plannerWorkspaceModulePromise.then(
      ({ PlannerWorkspace: LoadedPlannerWorkspace }) => LoadedPlannerWorkspace,
    );
}
```

The attached rejection observer prevents an early `unhandledrejection`; the
returned loader still derives from the original rejected Promise and therefore
surfaces the same failure.

Connect the existing dynamic boundary exactly once:

```tsx
const PlannerWorkspace = dynamic(
  createPlannerWorkspaceModuleLoader(() => import("./planner-workspace")),
  { ssr: false },
);
```

Do not change `ReactPlannerHost`, its effect, marks, state, or JSX.

- [ ] **Step 5: Run GREEN and focused regression**

Run:

```bash
pnpm exec vitest run tests/components/react-planner-host.test.tsx --no-file-parallelism
pnpm typecheck
git diff --check
```

Expected: all commands exit `0`.

### Task 3: Measure, retain, or revert the experiment

**Files:**
- Modify only if accepted: the two Task 2 files
- Update outside Git: the SDD task report and ledger

**Interfaces:**
- Consumes: Task 1 medians and Task 2 working tree
- Produces: an accepted two-file diff or a clean Task 2 revert

- [ ] **Step 1: Rebuild the experiment**

Run:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Restart only the task-owned static server so it serves the new `out/`.

- [ ] **Step 2: Run the four acceptance profiles**

Repeat Task 1's Ego measurement heredoc without changing viewport, throttling,
cache, sample count, order, task space, or measurement expressions. Apply the
existing thresholds from `EDITOR_INTERACTIVE_THRESHOLDS`; the mobile-cold
contract is `2500 ms`. Save the unedited Ego JSON separately from the baseline.

- [ ] **Step 3: Apply the evidence gate**

Keep Task 2 only if mobile cold passes `2500 ms`, improves over the Task 1
mobile-cold median, all marks exist, and the other three profiles pass their
existing thresholds. Otherwise use `apply_patch` to remove only the Task 2
test and production changes, rerun the original focused test, and record the
failed experiment. Do not implement a second performance strategy.

- [ ] **Step 4: Stop only the task-owned server and report**

Stop the saved static-server process identifier. Preserve every unrelated
browser process. Keep the Ego task space for the final public-page/browser
acceptance tasks in the other two approved plans; do not complete it here.
Preserve the unedited sample outputs and decision in the report. Do not commit.
