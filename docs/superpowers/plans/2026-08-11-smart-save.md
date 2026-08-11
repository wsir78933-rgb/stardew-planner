# One-click Smart Save Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make one click on `Save to this device` create any missing project/map and persist the current canvas without changing storage or export formats.

**Architecture:** Extend the existing persistence runtime's narrow controller interface with the public mutations and `getState()` needed for orchestration. Keep canonical saves on their existing path; create only the missing empty project/map, validate the controller state after each synchronous mutation, and save the existing placement snapshot.

**Tech Stack:** TypeScript, React 19, Next.js 16, Vitest, existing reference project controller/repository.

## Global Constraints

- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming.
- Use only public controller interfaces; do not access repository internals from components or the persistence runtime.
- Do not add dependencies, change the storage schema, change JSON/PNG formats, or edit `public/reference-runtime`.
- Do not modify homepage layout, canvas rendering, toolbar layout, or unrelated dirty files.
- Do not catch unknown errors unless the existing UI boundary can present them; never silently fail.
- Use TDD: every production behavior must first be observed failing for the expected reason.
- Do not stage, commit, push, deploy, or install dependencies.

---

### Task 1: Implement one-click smart save

**Files:**

- Modify: `src/planner/planner-workspace-persistence-runtime.ts`
- Modify only if required by typing: `src/components/use-planner-workspace-persistence-controls.ts`
- Modify: `src/components/local-project-panel.tsx`
- Modify: `tests/components/planner-workspace.projects.integration.test.ts`
- Modify: `tests/components/local-project-panel.test.tsx`
- Test only if needed: `tests/planner/planner-workspace-persistence-runtime.test.ts`

**Interfaces:**

- Consumes: public `ReferenceProjectWorkspaceController` methods `createProject`, `createMap`, `getPlannerMapIdForMapFile`, `getState`, and `saveOpenMap`.
- Produces: unchanged `PlannerWorkspacePersistenceRuntime.saveCurrentMap(): void` for UI callers.
- Produces: successful first save creates `Untitled Project`, one selected-map instance, and saves the current `placementHistory.currentState` plus season.

- [x] **Step 1: Add RED integration coverage for first save**

Add a real controller/repository test starting with no projects and a non-empty placement snapshot. Assert the exported project JSON contains one project, one current selected map, and the exact hand-authored placed item/building/crop values after one save.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm exec vitest run tests/components/planner-workspace.projects.integration.test.ts --no-file-parallelism
```

Expected: the new case fails because the current implementation throws when project ID and map ID are `null`.

- [x] **Step 3: Implement the minimal orchestration**

Keep the public UI callback unchanged. In the persistence runtime:

1. Save directly when `getCurrentCanonicalSession` succeeds.
2. Otherwise read `workspaceController.getState()`.
3. Create `Untitled Project` only when `activeProject` is `null`.
4. Require the resulting project to be empty and without an active session.
5. Resolve the selected planner map through `getPlannerMapById`, create it, and read controller state again.
6. Require an active session whose project and map file match the created project and selected planner map.
7. Call `saveOpenMap` with the original current placement snapshot and season.

Each private function must have one clear responsibility and errors must include received project/map/planner-map values.

- [x] **Step 4: Verify GREEN and add boundary cases one RED/GREEN cycle at a time**

Cover:

- active empty project is reused rather than duplicated;
- existing canonical session saves without creating anything;
- a Forest Farm selection creates the correct map file and label;
- map creation failure propagates, leaves the empty project recoverable, and retry does not duplicate the project;
- an unexpected non-empty non-canonical project/session fails before overwriting stored content;
- a second save after state synchronization updates the same map.

- [x] **Step 5: Make the empty-state copy truthful**

Change the no-project guidance to state that saving creates an `Untitled Project` and saves the current map. Update its component test; do not add a new modal or control.

- [x] **Step 6: Run focused verification**

```bash
pnpm exec vitest run tests/components/planner-workspace.projects.integration.test.ts tests/components/local-project-panel.test.tsx tests/components/planner-save-modal-content.test.tsx tests/reference-runtime/use-reference-project-workspace.test.tsx --no-file-parallelism
pnpm typecheck
git diff --check
```

- [x] **Step 7: Self-review**

Confirm no duplicated project/map mutation logic, no repository-internal access, no swallowed errors, no new dependencies, and no modifications outside the approved file list.

---

### Task 2: Independent verification and browser acceptance

**Files:**

- No production changes expected.
- Append evidence to the task's SDD report workspace.

- [x] **Step 1: Run automated regression**

```bash
pnpm typecheck
pnpm build
pnpm exec vitest run --no-file-parallelism
git diff --check
```

Restore build-generated `next-env.d.ts` noise to its pre-task state afterward; do not rerun build after restoration.

- [x] **Step 2: Verify the initial browser flow**

On a clean browser project state, place one visible object, open Save, click `Save to this device` once, and confirm the UI shows `Untitled Project`, the selected map, and a success notice.

- [x] **Step 3: Verify persisted export behavior**

Export the new project JSON through the UI and parse the downloaded file. Confirm it contains one selected-map entry and the placed object. Save again and confirm no duplicate project or map appears.

- [x] **Step 4: Verify responsive behavior**

At 390 px, confirm the Save panel has no horizontal overflow and the one-click save path remains reachable. Confirm the homepage/canvas/toolbar geometry did not change.

- [x] **Step 5: Final review**

Run an independent correctness and regression review against the approved design, including failure propagation and dirty-worktree boundaries.
