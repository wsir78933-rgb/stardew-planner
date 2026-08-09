# Toolbar Mutually Exclusive Toggle Design

## Status and replacement rule

This is the final, approved behavior for the editor toolbar. It replaces the
independent Cursor/Zoom state and double-highlight contract in
`docs/superpowers/specs/2026-08-09-cursor-zoom-selected-highlight-design.md`
and its paired plan. The older documents are retained only as history; their
requirements to preserve `isWheelZoomEnabled`, allow Cursor and Zoom to be
active together, or treat Zoom as an independent toggle must not be
implemented.

The implementation starts from worktree commit
`241a322ab5cd88eb90bc8e9ee6422914387a2514`.

## Current evidence

- `src/editor/editor-view-state.ts:6-11` defines the single `EditorTool`
  value domain as `cursor`, `multi-select`, `fill`, and `erase`; its view
  state at lines 38-45 requires exactly one `EditorTool`.
- `src/planner/planner-workspace-state.ts:61-78` and `:80-145` carry that
  non-null `tool` through the reducer and `select-tool` action. Undo and redo
  at `:288-302` only change placement history and clear placement selection.
- `src/planner/planner-workspace-editing-controller.ts:55-68` accepts only an
  `EditorTool` for canvas click and rectangle transitions. Its click dispatcher
  at `:131-145` already returns an unchanged transition for every tool other
  than Cursor and Erase; its rectangle dispatcher at `:164-194` does the same
  outside Multi-select, Fill, and Erase.
- `src/components/editor-toolbar.tsx:16-24` exposes the non-null `tool` plus
  a separate `wheelZoomEnabled` state and `onWheelZoomToggle` callback.
  The Zoom button at `:103-122` is therefore not a normal tool selection.
- `src/components/planner-workspace.tsx:541-545` owns
  `isWheelZoomEnabled`; `:700-711` already routes ordinary tool choices
  through `handleOrdinaryToolChange`, which cancels interior decor and a
  pending duplicate before it dispatches the selected tool. The toolbar and
  canvas receive the separate Zoom state at `:745-761` and `:795-800`.
- `src/components/planner-workspace.tsx:820-828` gives rectangle tools first
  priority, then gives an existing placement selection `move-selected` mode.
  Without an explicit null/Zoom branch, a no-tool state with a selection would
  incorrectly enter move-selected mode.
- `src/components/planner-canvas.tsx:3492-3512` only captures wheel input
  when `wheelZoomEnabled` is true. Its normal navigate path still calls the
  workspace click handler, so controller no-op handling is required in
  addition to pointer-mode selection.
- `app/globals.css:1921-1939` already has the requested red selected rules
  for Cursor, Zoom, Multi-select, and Erase. Each is after the generic hover
  rule, so a true `aria-pressed` state retains the red appearance on hover.

## Final behavior

Cursor, Multi-select, Erase, and Zoom form one mutually exclusive visible
selection group. The underlying tool domain also continues to contain hidden
Fill, so all tool choices are represented by one state value rather than by
parallel booleans.

- The initial state remains `tool: "cursor"`.
- Clicking an unselected visible tool selects that tool and deselects every
  other visible tool.
- Clicking the currently selected visible tool dispatches `null`; the result is
  a no-tool state with no visible selected button.
- There is no previous-tool memory, hidden selected state, fallback selection,
  or automatic restoration when a tool is deselected.
- Zoom is the `"zoom"` member of `EditorTool`, not a second state machine.
  Zoom is selected only when `tool === "zoom"`.
- Selecting Zoom enables wheel zoom. Selecting any other tool or deselecting
  Zoom disables wheel zoom immediately because the canvas derives it from the
  one tool value.
- Selecting Zoom, including selecting it after an interior-decor or pending-
  duplicate interaction, goes through `handleOrdinaryToolChange`. The existing
  cancellation of interior decor and pending duplicate therefore applies to
  Zoom and to its subsequent `null` toggle-off action.
- Selecting Cursor still clears a pending ordinary catalog item, exactly as it
  does today. Selecting Multi-select, Fill, Erase, Zoom, or `null` retains the
  existing catalog-selection behavior; the change must not introduce a new
  catalog-clearing rule for those values.
- Undo and Redo remain placement-history actions. They do not select, clear,
  restore, or otherwise derive the tool state.

## State invariants

1. `EditorTool` is the sole string-value domain and includes `"zoom"`.
2. Every tool-selection boundary stores and accepts `EditorTool | null`.
   `null` means no tool is selected; it is not an invalid value and it is not a
   special hidden tool.
3. `PlannerWorkspaceState.tool`, `EditorViewState.tool`, the reducer
   `select-tool` action, `EditorToolbar.tool`, and editing-controller tool
   inputs use the same nullable type.
4. At most one visible toolbar button has `aria-pressed="true"`; when the
   state is `null`, none do.
5. `PlannerCanvas.wheelZoomEnabled` is exactly `tool === "zoom"`. No
   `isWheelZoomEnabled`, setter, wheel-toggle prop, or wheel-toggle callback
   remains in the workspace/toolbar path.
6. Click and rectangle transitions for `null` and `"zoom"` return the exact
   input placement-history reference and selected-placement-key reference.
   They create no history entry, selection change, catalog action, placement,
   erase, fill, or rectangle selection.
7. In the workspace, `null` and `"zoom"` take precedence over placement
   selection and resolve to `pointerInteractionMode: "navigate"`. They cannot
   enter `"move-selected"` or `"rectangle"` mode merely because a placement
   remains selected.
8. Invalid non-null tool values still fail fast with the received value. The
   relaxation is only for the explicit `null` state; it must not become a
   permissive unknown-value path.

## Architecture

The single source of truth is `tool: EditorTool | null` in editor view state
and planner workspace reducer state. Add `"zoom"` to `editorTools`, retain
`"cursor"` as the initial value, and make `selectEditorTool` and its validation
accept `null` while retaining strict validation for non-null values.

`EditorToolbar` becomes a controlled presentation component with only
`tool: EditorTool | null` and
`onToolChange: (tool: EditorTool | null) => void` for selection. Each ordinary
tool button emits its tool value when unselected and `null` when selected. The
existing Zoom button keeps its DOM position, class, label text, data marker,
and displayed `Zoom` text, but derives both `aria-pressed` and its click
payload from the same controlled tool value.

`PlannerWorkspace` remains the orchestration boundary. It derives wheel zoom
from its reducer state, passes every selection including Zoom through
`handleOrdinaryToolChange`, and gives null/Zoom navigation priority. The
editing controller is the no-op boundary for map click and rectangle input;
it accepts the nullable type, validates it, then returns the existing
unchanged transition for null/Zoom without adding parallel modes or state.

No new generic selection abstraction, state reducer, callback, persistence
field, effect, or future-tool layer is required.

## No-op and interaction boundary

The no-tool state intentionally permits camera navigation but no editing.

- A canvas click in `null` or `"zoom"` reaches the existing click callback but
  returns an unchanged editing transition.
- A rectangle gesture in either state is not configured because both resolve
  to `navigate`; if a rectangle input reaches the controller directly, it is
  also unchanged.
- A placement selection that exists before deselection is not draggable in
  null/Zoom because navigation wins over `move-selected` mode.
- Wheel input is prevented and changes camera scale only for `"zoom"`; it is
  ignored by the canvas zoom handler after Zoom is deselected or another tool
  is selected.
- Existing validation of malformed editing input, map coordinates, and
  mismatched catalog-item/presentation-choice pairs remains in force. A
  no-op applies to valid input and must not silently absorb invalid boundary
  data.

## Visual contract

No CSS, layout, size, spacing, grouping, rounding, icon, label, shortcut,
focus, disabled, or responsive rule changes are required.

The existing selected selectors are the visual source of truth and must remain
unchanged:

```css
.planner-editor-shell .tool-btn.cursor[aria-pressed="true"]
.planner-editor-shell .tool-btn.reference-runtime-wheel-zoom-button[aria-pressed="true"]
.planner-editor-shell .tool-btn.multi-select[aria-pressed="true"]
.planner-editor-shell .tool-btn.erase
```

Every selected visible button uses `background: rgb(177 58 40 / 15%)` and
`color: #b13a28`. Because each rule follows the generic hover rule, hovering a
selected Cursor, Multi-select, Erase, or Zoom button preserves the same red
background and foreground. A `null` state makes none of these selectors match.

## Scope

Implementation is limited to these product files and their direct tests:

- `src/editor/editor-view-state.ts`
- `src/planner/planner-workspace-state.ts`
- `src/planner/planner-workspace-editing-controller.ts`
- `src/components/editor-toolbar.tsx`
- `src/components/planner-workspace.tsx`
- `tests/editor/editor-view-state.test.ts`
- `tests/planner/planner-workspace-state.test.ts`
- `tests/components/planner-workspace.editing.integration.test.tsx`
- `tests/components/editor-controls.test.tsx`

The implementation verifies integration with existing `app/globals.css` and
the existing `PlannerCanvas` wheel/pointer contract but does not modify either
file.

## Non-scope

- No product, test, CSS, configuration, dependency, persistence, or reference-
  runtime change belongs to this documentation commit.
- Do not change Fill availability, its hidden rendering, its controller
  behavior, or its existing tool value.
- Do not change catalog selection semantics other than typing the existing
  selection helper to receive null; Cursor remains the only value that clears
  the ordinary catalog selection.
- Do not add a tool history stack, restore a previously selected tool, make
  undo/redo control tools, or persist an additional selection flag.
- Do not modify `PlannerCanvas`, camera-control internals, reference-runtime
  wheel-zoom behavior, or their tests.
- Do not alter styles, colors, CSS selector ordering, DOM layout, class names,
  icons, visible text, labels, button dimensions, keyboard shortcuts, or
  unrelated editor behavior.

## Acceptance

### Automated acceptance

- The editor view-state and workspace reducer accept `"zoom"` and `null`,
  retain Cursor as initial state, and preserve the selected tool across Undo
  and Redo.
- Valid `null`/`"zoom"` controller click and rectangle inputs return the
  original history and selection references. Existing Cursor, Multi-select,
  Fill, and Erase tests continue to pass.
- The toolbar renders one true `aria-pressed` member for each selected visible
  tool and zero when `tool` is null. No state can render Cursor and Zoom true
  together.
- Zoom markup retains the existing
  `reference-runtime-wheel-zoom-button` class and
  `data-reference-runtime-wheel-zoom-button="true"`; it no longer receives
  `wheelZoomEnabled` or `onWheelZoomToggle` props.
- The current red CSS rules remain the source of visual behavior and are
  asserted without modifying `app/globals.css`.
- Typecheck, production build, full test suite, and whitespace checks pass.

### Browser acceptance

At the local editor route, verify the initial Cursor state, each visible
tool's select/deselect cycle, and the `null` state. At every checkpoint,
inspect `aria-pressed` rather than inferring selection from color alone.

1. On load, Cursor is the only true button; Multi-select, Erase, and Zoom are
   false. The Cursor red state remains red on hover.
2. Click Multi-select, Erase, and Zoom in turn. Each becomes the only true
   button, all other visible members become false, and its selected hover
   remains red. Zoom keeps the existing `Zoom` text and red selected style.
3. Click each currently selected member a second time. All visible members
   become false. No previous tool reappears.
4. With null selected, click and drag the canvas. No placement, erase,
   rectangle selection, or selected-item move occurs; camera navigation still
   works. Wheel input does not change the camera zoom.
5. Select Zoom, dispatch wheel input over the canvas, and observe camera zoom
   change. Select another tool or click Zoom again to reach null, repeat the
   wheel input, and observe that camera zoom no longer changes.
6. Start an ordinary interior-decor choice and separately arm a duplicate of a
   selected placement through the existing UI. Select Zoom in each case. The
   existing ordinary-tool cancellation path clears the decor interaction and
   pending duplicate; the following canvas click performs no decor application
   or duplicate placement.
7. Invoke Undo and Redo after a placement-history edit. Their existing history
   behavior is unchanged and the currently selected tool (including null or
   Zoom) remains unchanged.

## Specification self-review

- Coverage: current evidence, final behavior, source-of-truth architecture,
  state invariants, null/Zoom no-op boundary, visual reuse, scope, exclusions,
  automated checks, browser checks, and historical-plan replacement are all
  explicit.
- Consistency: the one nullable tool value drives toolbar selection, wheel
  zoom, controller no-ops, and pointer priority; there is no second selection
  boolean or history restore path.
- Scope: the product file list is the approved minimum, and existing CSS and
  PlannerCanvas contracts are verified rather than expanded.
- Ambiguity: `null` preserves existing catalog behavior except where the
  current Cursor path has already cleared it before emitting null; no other
  tool-specific catalog rule is introduced.
