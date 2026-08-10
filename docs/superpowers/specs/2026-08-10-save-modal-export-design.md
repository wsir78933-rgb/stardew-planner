# Save Modal Usability and Export Verification Design

## Goal

Repair the React planner Save modal so local project management and export actions are readable, usable, and verifiable on desktop and 390px-wide mobile Web. The modal must use the homepage's existing light green visual system without changing the homepage, canvas, catalog, toolbar, or other editor layout.

## User Scenarios

1. Save the current map to the active local project.
2. Create, open, rename, duplicate, export, or delete a local project.
3. Import a project JSON file.
4. Export the current map as a standard or high-resolution PNG.
5. Save the current map thumbnail to browser storage.
6. Switch between Local projects, Import Game Save, and Farm Summary without losing the existing behavior.

## Scope

### Included

- Save-modal-only layout and visual styling.
- A structured local-project section, project cards, export cards, notices, and errors.
- A destructive-action confirmation implemented with the already-installed Radix AlertDialog primitive.
- A shared, narrow browser-file-download interface used by JSON and PNG downloads.
- Targeted component, style-contract, download-contract, type, build, regression, and browser checks.

### Excluded

- Homepage, canvas, catalog, menu, toolbar, and sidebar layout changes.
- Project repository format or browser-storage behavior changes.
- Screenshot rendering, resolution, or watermark changes.
- Game-save parsing or Farm Summary behavior changes.
- New dependencies, deployment, Cloudflare changes, staging, commits, or pushes.
- Unrelated existing changes in `src/components/planner-canvas.tsx`, `tests/components/planner-canvas.test.ts`, and `docs/superpowers/plans/2026-08-10-selected-placement-strong-tint.md`.

## Interface Design

### Modal shell

`EditorModal` adds the modifier `editor-modal--save-panel` only when `modalId === "save-panel"`. The modifier widens this modal within viewport limits while leaving every other editor modal unchanged.

The existing outer modal keyboard handler only handles key events whose DOM target is physically contained by its own modal element. This containment guard preserves the existing outer Escape and Tab behavior while allowing a portalled Radix AlertDialog to own keyboard interaction without closing or refocusing the underlying Save modal.

### Save branches

The existing Local projects, Import Game Save, and Farm Summary buttons remain the only branches. They are presented as one segmented navigation row. The active button continues to use the existing `aria-pressed` state and receives the existing lime accent. `PlannerSaveModalLoader` already owns the branch state and the required class name, so this file's logic does not change; CSS styles its existing markup.

### Local projects

The current project and map appear in a pale-green status card. The Save, New project, and Import JSON actions form an equal-width primary action group on desktop and a vertical group on narrow screens.

Each saved project renders as a separate white card containing:

- project title;
- browser-local, human-readable updated date and time;
- Current status when applicable;
- Open, Rename, Duplicate, Export JSON, and Delete actions.

The list scrolls inside the modal when it exceeds the available height. Project actions wrap without overlapping or shrinking their labels.

The timestamp formatter validates the stored timestamp and fails fast with the offending value when it is invalid. It uses the browser locale and never renders the raw ISO separator or trailing `Z` shown in the broken interface.

### Export and thumbnail sections

`PlannerSaveModalContent` adds one layout wrapper around its existing children. Screenshot export and thumbnail storage render as two secondary cards in a two-column desktop grid and a one-column mobile stack. No action is renamed or moved to another branch.

### Delete confirmation

The uncontrolled modeless `<dialog open>` is replaced by the installed Radix AlertDialog primitive. The dialog states the exact project name, keeps Delete project as the destructive action, and keeps Keep project as cancellation. Radix owns focus transfer, Escape handling, and focus restoration. The outer `EditorModal` DOM-containment guard ignores keyboard events originating in the portalled confirmation layer. The visual overlay is scoped above the Save modal and uses the existing homepage colors without animation.

## Visual System

The Save modal reuses the existing `.planner-editor-shell` tokens:

- `--bg-deep: #fdfff8` for the modal content background;
- `--bg-surface: #ffffff` for cards;
- `--bg-raised: #f1f7e7` for secondary surfaces;
- `--border-subtle: #242a22` for borders;
- `--accent: #759d1c` for focus;
- `#c9fb45` for the single primary accent;
- `--text` and `--text-dim` for hierarchy;
- `#b13a28` only for destructive actions and errors.

Spacing uses the existing `--lk-*` scale. No gradients, glow effects, new animation, or new color tokens are introduced.

## Responsive Behavior

At widths above 640px:

- the Save modal is wider than the generic modal but remains within 90vw;
- primary actions use three columns;
- project summary and actions may share space when content permits;
- screenshot and thumbnail cards use two columns.

At widths up to 640px:

- the modal remains within `calc(100vw - 1rem)` and `calc(100dvh - 1rem)`;
- primary actions stack vertically;
- project cards use a single-column reading order;
- project actions use a wrapping grid with controls at least 44px high;
- export cards stack vertically;
- no rule changes canvas, catalog, toolbar, or homepage geometry.

## Download Architecture

A new `src/projects/browser-file-download.ts` module has one responsibility: download a provided Blob with a validated filename through a narrow browser platform interface.

The module:

1. validates the Blob and filename at the boundary;
2. creates an object URL;
3. creates and configures a hidden download anchor;
4. appends, clicks, and removes the anchor;
5. schedules object URL revocation;
6. fails fast with the offending filename or value when required browser capabilities are unavailable.

`LocalProjectPanel` remains responsible for serializing a project and constructing the JSON Blob. `MapImageExportPanel` remains responsible for capturing and validating the PNG Blob. Both call the shared download interface instead of duplicating browser DOM operations.

No repository, screenshot renderer, or storage module reaches into the download module's internals.

## Error Handling

- Known project and screenshot errors remain adjacent to their originating controls.
- Unknown screenshot and thumbnail errors continue to propagate rather than being silently converted.
- Download boundary errors name the invalid filename, Blob value, or missing browser capability.
- Delete confirmation never removes a project until the user activates the explicit destructive action.

## Test-Driven Implementation

The implementation begins with tests that fail because the layout contract, AlertDialog structure, and shared download module do not yet exist.

### Automated checks

- Style contract asserts required Save-only selectors and responsive rules.
- Component markup/source contracts assert the Save modifier, content wrapper, export grouping, and AlertDialog structure.
- Modal keyboard tests assert that the outer focus trap ignores portalled targets while retaining its current behavior for contained targets.
- Timestamp tests assert a human-readable value and fail-fast handling for an invalid stored timestamp.
- Download contract uses an injected fake browser platform to assert Blob identity, filename, object URL creation, append-click-remove order, and delayed URL revocation without adding a DOM dependency.
- Existing project filename, screenshot filename, component, persistence, and modal tests remain green.
- Run targeted Vitest, `pnpm typecheck`, `pnpm build`, full Vitest, and `git diff --check`.

### Browser acceptance

At desktop and 390px width:

- all three Save branches are readable and selectable;
- project cards and actions do not overlap or overflow;
- Screenshot, Screenshot (HQ), and Save thumbnail remain visible;
- Delete opens a centered confirmation layer and cancellation restores the Save modal;
- Export JSON produces the expected `.json` download;
- Screenshot and Screenshot (HQ) each produce a `.png` download;
- the canvas, catalog, toolbar, and homepage layout remain unchanged.

If the configured local browser cannot reach the local server, that limitation is reported explicitly and browser acceptance is not claimed as passed.

## Files Expected to Change

- `app/globals.css`
- `src/components/editor-modal.tsx`
- `src/components/planner-save-modal-content.tsx`
- `src/components/local-project-panel.tsx`
- `src/components/map-image-export-panel.tsx`
- `src/projects/browser-file-download.ts`
- focused component, style-contract, and download-contract tests

`src/components/planner-save-modal-loader.tsx` is deliberately not an expected production change: its existing branch state, accessibility attributes, error states, and `planner-save-modal-loader__branches` styling hook already satisfy the design boundary.

No other production module is in scope unless a verified compile or test failure proves a direct dependency and the user approves the expansion.
