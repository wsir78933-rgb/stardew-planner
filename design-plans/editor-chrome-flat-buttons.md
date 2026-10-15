# Complete the editor chrome button cleanup

The user's original request was to handle the other buttons together. The previous pass incorrectly excluded the header and editing toolbar. This follow-up completes the red-boxed areas from the user's screenshot. Baseline HEAD: d5b6874d0d12ad8f53b2217a32bfc9c0f62e488c; worktree was clean.

## Scope and result

- Header utilities: Help, Keyboard shortcuts, Feedback.
- Project context: Library and the current map-name button.
- Header options: Ambience, Farm Settings, Map, View, Settings; mobile Menu toggle.
- Bottom toolbar: Select, Multi, Fill, Erase, Zoom, Undo, Redo; toolbar surface.
- Remove raised/inset shadows throughout rest, hover, press, expanded, selected and disabled states. Preserve existing dimensions, layout, labels, icons, colors, tooltips, focus and callbacks.
- Do not change dialogs, item catalog, canvas behavior, homepage carousel, dependencies, authentication, migration, commits or deployment.

## Minimal implementation

Only app/globals.css may change. On the exact `.planner-editor-shell .editor-menu-bar` and `.planner-editor-shell .editor-toolbar` roots, override the existing `--planner-neo-raised-shadow` and `--planner-neo-inset-shadow` values to `none`. This uses the existing scoped CSS interface and covers the more specific state rules without new state-by-state overrides. Restore the toolbar's existing one-pixel border color with `--border-subtle`; keep its border width and style. Do not add button borders or alter geometry. Map-name rest stays transparent, and its existing expanded green background stays intact. Tooltip pseudo-element shadows are intentionally preserved.

## Ownership and verification

- Root coordinates and accepts the result; implement_flat_switches is the only product writer. toggle_review reviews the actual source diff independently. button_checks runs commands. button_browser_qa owns the single follow-up TaskSpace 131 / p1 and verifies both sizes serially.
- All coding tasks explicitly require high cohesion/low coupling, single responsibility, public interfaces, KISS, Fail Fast with concrete offending values and no swallowed errors, YAGNI, precise naming, and no unrelated refactor.
- Existing focused tests: editor-controls, editor-shell, planner-workspace-layout, editor-modal-content-style-contract, editor-modal-viewport-style-contract, save-modal-style-contract.
- Run both typechecks, focused tests, production build, diff check and one Impeccable detector pass. Preserve raw command results and source hashes.
- Browser baseline and final acceptance: static out on 127.0.0.1:3007, confirmed process/cwd and asset provenance; desktop 1440x1000 and mobile 390x844, with viewport reapplied each invocation. No injected QA styles.
- Verify all 18 button nodes and the toolbar surface, including menu expansion, tool selection/restoration, zoom toggle, disabled history actions, keyboard focus/press and tooltip. Check button geometry and horizontal overflow. Do not submit feedback, authenticate, upload or change a map. Close each dialog before opening another; read mobile Menu's current expanded state.
- One combined browser inspection round, with at most one repair confirmation if it reveals a scoped defect. Root reads real logs/JSON/screenshots before accepting; no source-only or agent-status claim substitutes for runtime proof.
