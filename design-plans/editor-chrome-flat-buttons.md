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

## Final acceptance

- The implementation is limited to `app/globals.css`; its final SHA-256 is `98698d6538f7007cade7badc07fff26df0a1b3ba219cf1571ce551da6ddd620f`. Header and toolbar states report `box-shadow: none`; existing dimensions, selected colors, focus outline and tooltip shadow remain. No dialog, homepage, map-picker or scrollbar source was changed.
- `pnpm typecheck` exited 0 for both browser and Worker TypeScript projects. The focused Vitest command exited 0 with 7 files and 78/78 tests passing. `pnpm build` exited 0 and generated all 68/68 static pages. `git diff --check` exited 0.
- The Impeccable detector exited 2 with eight global warnings at lines 109, 1270, 2255, 3272, 3481, 3512, 3916 and 3917. These are outside the changed editor-chrome region; the detector result is not a clean pass.
- Fresh production output was served at `127.0.0.1:3007` with the final stylesheet loaded. Desktop at 1440×1000 verified 21 measured nodes with unchanged x/width/height and scroll-normalized geometry. The captured scroll position changed from 1142 to 1135.5, matching the uniform 6.5px raw y offset. Mobile at 390×844 verified all 22 measured nodes with zero geometry deltas and no horizontal overflow. All ten direct topbar entry points opened and closed; the five mobile Menu options were sampled, tool/Zoom state was restored, Undo/Redo remained disabled, focus and settled tooltip checks passed, and the Menu returned collapsed. Evidence: [desktop JSON](./topbar-toolbar-final-desktop.json), [desktop screenshot](./topbar-toolbar-final-desktop.png), [mobile JSON](./topbar-toolbar-final-mobile.json), [mobile screenshot](./topbar-toolbar-final-mobile.png).
- A separate read-only homepage viewport diagnostic found no change between the top and `#farm-cases`: `innerWidth` stayed 1440 and html/body client width, scroll width and right edge stayed 1434. After emulation cleared, the native viewport reported 1512×762 with a 1506px visual viewport; `cacheDisabled` was restored to `false`. No additional white edge was reproduced, so this work does not claim to identify or fix one. Evidence: [homepage viewport diagnostic](./homepage-scrollbar-observation.json) and [screenshot](./homepage-scrollbar-observation-desktop.png).
- TaskSpace 131 cleanup is complete: device metrics were cleared, the preview returned to `127.0.0.1:3007/#planner` at 1512×762 / DPR 2 with navigation and toolbar present, `p1` was kept, and no managed spaces were closed. Receipt: [cleanup JSON](./editor-chrome-preview-cleanup.json).
- The check log captured baseline HEAD `d5b6874`; current HEAD later advanced to `bbc7ebc` through a concurrent external commit. This worker did not create a commit. No deployment was performed. Evidence: [check log](./editor-chrome-flat-checks.log).
