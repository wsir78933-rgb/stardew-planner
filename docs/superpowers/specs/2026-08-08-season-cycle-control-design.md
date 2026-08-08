# Season Cycle Control Design

## Goal

Replace the season selection dialog with a direct action on the existing season icon. Each click advances exactly one season in this loop:

`spring -> summer -> fall -> winter -> spring`

The current season remains exposed through the icon button's accessible label, for example `Season: summer`.

## Interaction

- Clicking the season icon changes the season immediately.
- The click never opens a dialog.
- The other editor-menu controls continue opening their existing dialogs.
- Compact and desktop editor layouts use the same season-cycle behavior.

## Architecture and data flow

1. A pure editor-state function computes the next season from the existing ordered `editorSeasons` tuple.
2. A dedicated workspace reducer action requests one cycle without exposing state internals to the component.
3. `EditorMenuBar` communicates through an `onCycleSeason` callback for the season control and keeps `onOpenModal` for dialog controls.
4. The existing season-selection state path updates map resources, project state, and the canvas. No rendering or asset contract changes.

The obsolete `season-picker` modal ID, modal content, styles, and tests are removed so the project does not retain an unreachable four-button dialog.

## Error handling

The next-season function validates its input through the existing editor-season boundary and fails immediately with the invalid value. No exception is caught or ignored.

## Scope boundaries

This change does not alter map or season assets, canvas rendering, editor layout, other menu controls, persistence formats, project import behavior, or the mobile Menu layering fix.

## Verification

- Unit-test all four transitions and an invalid input.
- Reducer-test the cycle action.
- Component-test the season control interface and absence of the season dialog path.
- Run related tests, typecheck, build, and `git diff --check`.
- In desktop and 320px browser viewports, click repeatedly and verify the accessible season label follows the loop, the map texture changes, and no dialog appears.
