# Map Picker Categories Design

## Goal

Match the competitor's map-selection information architecture without changing the editor's base structure. Both places that choose a map must use the same categorized picker so the catalog is no longer presented as one long combined list.

## Approved behavior

- Show four top-level tabs in this exact order: `Farm`, `Interiors`, `Exteriors`, `Community`.
- Render only the maps for the active top-level tab.
- Within `Community`, show two second-level tabs in this exact order: `Farms`, `Interiors`.
- When the current map is known, open the picker on the tab containing that map. A community map also selects the matching community second-level tab.
- When no current map exists, default to `Farm`.
- Use the same categorized picker in the normal `Choose map` dialog and the active project's `Add map` section.
- Preserve the existing three-column preview-card grid and selected-card treatment.
- Selecting a card continues to call the existing callback; the surrounding editor remains responsible for switching or adding the map and closing the dialog.

## Scope

### In scope

- A focused shared React component that owns map-category state, filtering, tab semantics, and map cards.
- Integration into `EditorModal` and `ProjectMapInstancePanel` through public props/callbacks only.
- Local modal/picker CSS that matches the competitor's tab hierarchy and keeps the existing editor theme.
- Focused unit/static-render tests, integration assertions, type checking, production build, and browser acceptance.

### Out of scope

- Editor canvas, toolbar, menu bar, season picker, item catalog, persistence, project data model, or map resource/catalog content.
- Adding, removing, or reclassifying maps in `map-catalog.ts`.
- New dependencies, external services, database/configuration changes, or deployment.
- Git staging, commits, pushes, or pull requests.

## Component boundary

Create `src/components/planner-map-picker.tsx` as the single owner of category presentation. It consumes a complete `readonly PlannerMap[]`, an optional selected map id, a selection callback, and the data-attribute name required by the caller. It does not know whether a selection means "switch map" or "add map".

`EditorModal` supplies `plannerMaps`, the current selected map id, and `onMapChange`. `ProjectMapInstancePanel` supplies its existing `mapChoices`, no selected map id, and `onAddMap`. Neither caller duplicates category filters or tab state.

## Category model

The UI groups existing `PlannerMapCategory` values as follows:

| UI tab | Catalog categories |
| --- | --- |
| Farm | `farm` |
| Interiors | `interior` |
| Exteriors | `exterior` |
| Community / Farms | `community-farm` |
| Community / Interiors | `community-interior` |

Unknown non-null selected map ids fail fast through the catalog lookup rather than silently selecting an unrelated tab.

## Interaction and accessibility

- Both tab levels use native `button` elements with `role="tab"`, `aria-selected`, roving `tabIndex`, `aria-controls`, and corresponding `role="tabpanel"` relationships.
- `ArrowLeft`, `ArrowRight`, `Home`, and `End` change the active tab and move focus, following the editor's existing item-catalog convention.
- Active cards keep `aria-pressed`; preview images remain decorative because the visible map name labels the button.
- Existing dialog `Escape`, focus trap, close button, and focus restoration remain unchanged.
- Focus indicators must remain visible and the 390 px layout must not create horizontal overflow.

## Visual behavior

- Top tabs span the picker width and use a bottom border with a green active underline, matching the competitor.
- Community sub-tabs are compact controls below the top tabs, with a filled active state.
- The active category panel alone scrolls when necessary; the dialog remains within viewport height.
- The map picker dialog may use the competitor's 600 px target width, capped by the existing 90 vw mobile constraint. Other editor modals retain their current width.

## Verification

- Focused tests prove default and selected-map category derivation, exact tab semantics/order, map counts per group, community subdivision, and keyboard navigation.
- Editor modal tests prove only the active group is rendered and configuration controls remain present.
- Project panel tests prove existing project actions remain and `Add map` uses the shared categorized picker.
- Run focused Vitest files, then `pnpm typecheck`, the relevant/full test command as practical, and `pnpm build`.
- Use the local CDP browser to verify desktop and 390 px behavior, both entry points, tab switching, community sub-tabs, card selection, dialog close/Escape, and lack of horizontal overflow.

## Worktree protection

The current shared `main` worktree already contains unrelated user changes in `app/globals.css` and `tests/components/planner-workspace-layout.test.ts`. This implementation must preserve them exactly. No stage, commit, push, reset, checkout, or cleanup operation is authorized.
