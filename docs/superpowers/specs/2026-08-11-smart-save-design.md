# One-click Smart Save Design

## Goal

Make `Save to this device` persist the current canvas on first use. A user must not need to understand projects, project maps, or canonical sessions before saving.

## Approved behavior

- If the selected planner map already has a matching active canonical project map, save the current placement snapshot and season through the existing `saveOpenMap` path.
- If there is no active project, create `Untitled Project`, add the currently selected planner map, and save the current placement snapshot in the same user action.
- If an active project exists but is empty, reuse it, add the currently selected planner map, and save the current placement snapshot. Do not create a duplicate project.
- If controller state contains a non-empty, non-canonical active project/session combination, fail fast with the project ID, map ID, and selected planner map ID. Do not guess which stored map may be overwritten.
- A successful first save must make the created project and map available to the existing project list, JSON export, thumbnail, and later saves.
- The empty-project message must explain that saving creates an `Untitled Project` and stores the current map.

## Architecture

The orchestration remains in `planner-workspace-persistence-runtime.ts`, which already owns save decisions. It communicates only through the public `ReferenceProjectWorkspaceController` interface.

The main save function only coordinates these focused steps:

1. Resolve an already-current canonical session.
2. Resolve or create an empty target project.
3. Create the selected planner map using catalog metadata.
4. Read the controller's synchronously committed state and require the expected active session.
5. Save the current placement snapshot and season.

The controller's `getState()` result is the source of truth between mutations. The flow must not wait for a React re-render to discover the created project or map IDs.

## Failure behavior

- Unknown controller, repository, or storage errors propagate unchanged to the existing action error boundary; they are never swallowed.
- If project creation succeeds but map creation fails, the empty project remains available for a retry. The retry reuses it instead of creating another project.
- If map creation succeeds but snapshot saving fails, the map remains available and the in-memory canvas is not reset. The error is shown and the user can retry.
- No compensating rollback or new cross-repository transaction is added; the existing mutations remain individually validated and recoverable.

## Scope

Expected production changes:

- `src/planner/planner-workspace-persistence-runtime.ts`
- `src/components/use-planner-workspace-persistence-controls.ts` only if its public typing must follow the runtime interface
- `src/components/local-project-panel.tsx` for truthful empty-state guidance

Expected tests:

- `tests/components/planner-workspace.projects.integration.test.ts`
- `tests/components/local-project-panel.test.tsx`
- any focused runtime test only when the integration file cannot exercise a required failure boundary cleanly

Out of scope:

- homepage or canvas layout and rendering
- storage schema and JSON/PNG formats
- frozen files under `public/reference-runtime`
- browser-extension hydration attributes
- new dependencies, rollback infrastructure, project naming UI, or speculative abstractions

## Acceptance

- Starting with no projects, place a visible object and click `Save to this device` once.
- The Save panel shows `Untitled Project` and the selected map, with a success notice.
- Exported project JSON contains that project's current map and the placed object.
- A subsequent save updates the same project map without creating another project or map.
- Existing canonical project-map saves continue to work.
- Focused tests, the full test suite, typecheck, build, desktop browser acceptance, and 390 px browser acceptance pass.

