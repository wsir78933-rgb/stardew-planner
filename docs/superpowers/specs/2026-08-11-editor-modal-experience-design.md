# Editor Modal Experience Redesign

## Goal

Redesign the editor's Save, View, Settings, and Help & Info modal content so it is clear, readable, responsive, and visually consistent with the current homepage without changing the editor's storage, rendering, or behavior contracts.

## Verified problem

The shared modal frame is styled, but several rendered content owners have no scoped CSS: game-save import, farm-summary entry/detail, View sections/options, Settings sections/options, and Help content descendants. The browser therefore renders native file input chrome, adjacent default-flow buttons, repeated headings without hierarchy, and dense unstructured text.

The following controls are not functionally duplicated. Their labels are ambiguous because a navigation label and an action label currently match:

- `Import Game Save` tab versus its file-selection trigger.
- `Farm Summary` tab versus its detail-dialog trigger.
- `Resource Clumps` section heading versus its toggle.

## Approved design

### Save

- Preserve the three existing Save branches and their lazy-loading behavior.
- Wrap Import Game Save and Farm Summary branch bodies in the existing `planner-save-modal-content` owner used by Local projects.
- Present game-save import as an upload card with explanatory copy, a `Choose save file` action, an importing filename/status, and the existing inline error boundary.
- Preserve the Farm Summary trigger and nested detail dialog. Add an inline preview containing the current map name, season, and placed-item count. Rename the trigger to `View detailed summary`.
- Restyle the nested Farm Summary dialog with readable metadata, category cards, aligned counts, and the existing Export CSV action.

### View

- Keep all existing button handlers and `aria-pressed` state.
- Present Overlays, Map Overlays, Appearance, Map Objects, Unavailable, and Catalog Position as separate cards.
- Rename the existing `Display` group containing Night Mode to `Appearance`.
- Rename the Resource Clumps section to `Map Objects` and its toggle to `Show resource clumps`.
- Rename the disabled Weather section to `Unavailable`; keep Weather disabled and visibly marked unavailable.
- Show visual On/Off status without replacing the existing accessible pressed-button semantics.

### Settings

- Preserve Mobile, Notifications, Interface, Placement, Community, and legal-link behavior.
- Present each section as a consistent card and expose visual On/Off state from existing `aria-pressed` values.
- Keep Free Placement confirmation and its warning next to the triggering control.
- Keep Manage Mods disabled and visibly marked unavailable.
- Rename `Joja Stuff` to `Legal` and place Privacy Policy and Terms of Service in a dedicated link row.

### Help & Info

- Preserve the existing Features, Good to Know, and Maps copy.
- Present the three sections as readable information cards with restored list markers, spacing, line height, and constrained reading width.

### Shared visual language

- Reuse the editor/homepage theme variables already defined in `app/globals.css`: surface backgrounds, dark borders/text, rounded corners, and the lime active accent.
- Do not add gradients, glow effects, animation, dependencies, or a new design system.
- Keep the modal header visible while the content scrolls.
- At 390 px, keep the modal and all controls inside the viewport, prevent horizontal document overflow, and give interactive modal content controls a minimum 44 px touch target. This includes the styled file trigger and Legal links, not only buttons.

## Architecture and responsibilities

- `app/globals.css` owns presentation under the existing `.planner-editor-shell` scope. Rules are grouped by Save branch content, View/Settings modifiers, the Help-only modifier, nested Farm Summary, and the 640 px breakpoint. Generic modal, Map picker, Keyboard Shortcuts, and What's New presentation is not changed.
- `PlannerGameSaveModalContent` owns the Save-branch body wrapper. `GameSaveImportControl` owns import copy and transient filename status.
- `PlannerFarmSummaryModalContent` owns the Save-branch body wrapper. `FarmSummaryPanel` owns the summary preview and detail-dialog trigger because it already computes the summary.
- `EditorModal` retains modal state and handlers. It adds narrow `editor-modal--view-panel`, `editor-modal--settings-panel`, and `editor-modal--help-info` modifier classes so content scrolling and descendant rules cannot affect Map picker, Keyboard Shortcuts, or What's New. Only user-facing group/action labels change; no new state abstraction is introduced.
- Existing controller, storage, export, import, placement, and rendering interfaces remain unchanged.

## Error behavior

- Preserve the existing known game-save error display and unknown-error rethrow behavior.
- Preserve Farm Summary CSV error presentation and download behavior.
- Preserve Free Placement confirmation and cancellation behavior.
- Disabled Weather and Manage Mods remain non-interactive.

## Scope

Expected production files:

- `app/globals.css`
- `src/components/planner-game-save-modal-content.tsx`
- `src/components/game-save-import-panel.tsx`
- `src/components/planner-farm-summary-modal-content.tsx`
- `src/components/farm-summary-panel.tsx`
- `src/components/editor-modal.tsx`

Expected test files:

- `tests/components/save-modal-style-contract.test.ts`
- `tests/components/planner-game-save-modal-content.test.tsx`
- `tests/components/planner-farm-summary-modal-content.test.tsx`
- `tests/components/farm-summary-panel.test.tsx`
- `tests/components/editor-modal.test.tsx`
- `tests/components/editor-shell.test.tsx`
- a focused editor-modal content style contract test if the existing Save contract cannot express non-Save surfaces clearly

Out of scope:

- Homepage, canvas, catalog, toolbar, and editor geometry.
- Storage schema, JSON/CSV/PNG formats, map rendering, import parsing, and project lifecycle.
- New dependencies, animation, speculative primitives, localization, or disabled-feature implementation.

## Acceptance

- Desktop and 390 px Save, Import, Farm Summary, View, Settings, and Help content have deliberate spacing, hierarchy, active/disabled states, and no overlapping controls.
- The Farm Summary button still opens the detailed summary and Export CSV remains available.
- Import uses `Choose save file`; Farm Summary uses `View detailed summary`; Resource Clumps uses `Show resource clumps`; repeated Display headings are removed.
- Each dialog remains inside the viewport; `document.documentElement.scrollWidth === clientWidth` at 390 px.
- Existing toggle, file input, nested-dialog, Free Placement, disabled-control, legal-link, focus, and close behavior remains intact.
- Focused tests, typecheck, production build, full tests, desktop browser acceptance, and 390 px browser acceptance pass.
