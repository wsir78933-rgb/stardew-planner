# Local Project Map-Instances Implementation Plan

> **For agentic workers:** Execute task by task with `superpowers:subagent-driven-development`. Tests must go red before implementation for every data or UI contract.

**Goal:** Retain the original multi-map project experience locally: a project can contain multiple independently named instances of the same base map, including isolated placements, seasons, render options, undo history, JSON export/import, and browser-local migration from v1 projects.

**Architecture:** Project storage owns persisted map instances. Editor actions translate an active map instance into the existing base-map editor state. `app/page.tsx` owns only runtime state keyed by instance ID. Pixi and `map-catalog` continue receiving a base map ID; they must never receive instance IDs. Components request mutations through callbacks and never access browser storage.

**Compatibility and safety:** Read v2 first; if absent, parse and validate the complete v1 collection, migrate it in memory, and write v2 while preserving v1 as a non-destructive backup. On a write failure leave v1 untouched. Import accepts v1 and v2 but always persists/exports v2. No backend, account, sync, share, or new dependency.

### Task 1: Define and validate the v2 project schema

**Files:**

- Modify: `src/projects/project-schema.ts`
- Test: `tests/projects/project-schema.test.ts` (create if no focused schema test exists)

- [x] Add failing validation tests for a valid v2 map instance, duplicate instance IDs, invalid base map ID, blank/uncanonical instance name, empty instance list, and invalid active instance.
- [x] Add v1-to-v2 migration tests for one and multiple legacy base maps, including the correct active instance.
- [x] Implement explicit v1 types/parsers and v2 validation/migration functions. `mapInstances` is a non-empty record keyed by one safe instance ID; each value contains only `baseMapId`, `name`, and `state`, so identity has one canonical location. A v2 project contains `activeMapInstanceId`.
- [x] Run the schema tests and typecheck.

### Task 2: Migrate browser-local storage and provide instance store operations

**Files:**

- Modify: `src/projects/local-project-store.ts`
- Test: `tests/projects/local-project-store.test.ts`

- [x] Add failing store tests: auto-migrate legacy v1 only after a successful v2 write, create two `standard` instances with isolated state, duplicate/rename/switch/delete an instance, reject deletion of the last instance, retry colliding instance IDs, and accept a v1 import while exporting v2.
- [x] Implement only the required methods: `saveMapInstanceState`, `createMapInstance`, `duplicateMapInstance`, `renameMapInstance`, `deleteMapInstance`, and `switchActiveMapInstance`. Inject instance-ID generation for deterministic tests.
- [x] Run focused store/schema tests and typecheck.

### Task 3: Restore editor state by active map instance

**Files:**

- Modify: `src/projects/local-project-editor-actions.ts`
- Modify: `app/page.tsx`
- Test: `tests/projects/local-project-editor-actions.test.ts`
- Test: focused route/state test if one exists

- [x] Add failing action tests proving active instance state restores its `baseMapId`, season, placements, and options; prove two same-base instances remain isolated.
- [x] Change action interfaces to take an explicit map instance ID. Rename ambiguous `mapId` fields to `baseMapId` where they reach the map renderer.
- [x] Change page runtime history/render-option dictionaries to use instance IDs; use a namespaced scratch key for non-project editing. Preserve game-save import as a scratch flow.
- [x] Run focused tests and typecheck.

### Task 4: Expose instance operations in the existing Map modal

**Files:**

- Add: `src/components/project-map-instance-panel.tsx`
- Modify: `src/components/editor-modal.tsx`
- Modify: `app/page.tsx`
- Modify: `src/components/local-project-panel.tsx`
- Test: `tests/components/project-map-instance-panel.test.tsx`
- Test: existing local project / editor modal component tests

- [x] Add failing static component tests for a project-map list (Open, Rename, Duplicate, Delete) and the Add map catalog, including a current-instance indicator and no online-flow text.
- [x] Implement the presentational panel with callbacks only. In a local project, selecting a catalog map creates a new instance instead of overwriting a base-map entry; without a project, retain direct map selection.
- [x] Show active instance name and map count in the project panel; keep project CRUD intact.
- [x] Run focused component tests and typecheck.

### Task 5: Review and verify the migration end to end

- [ ] Request independent read-only review focused on data-loss, stale instance-key state, import validation, and excluded online features. Resolve P0/P1 findings. (Attempt blocked by the collaboration runtime's `agent thread limit reached`; no reviewer was started.)
- [x] Run `pnpm test --run`, then `pnpm typecheck`, then `pnpm build` serially.
- [ ] Browser/local-storage check after build: create two Standard Farm instances with different placements, switch, refresh, export/import, and confirm isolation. Wait until Pixi sets `aria-busy=false`; report any alert rather than guessing. (Attempt blocked because the browser connector returned `No browser is available`.)

## Non-goals

- Cross-project map moving/copying beyond existing project duplication.
- New map editing/rendering APIs, database migration, cloud sync, or arbitrary custom map files.
- A separate project-management page.
