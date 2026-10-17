# Editor chrome flat-style review

## Review state

Preflight source review and the `CSS_READY` source-diff review are complete. No product files were edited; browser, test, and build acceptance remain separate gates.

## Authorized review boundary

Review only the `app/globals.css` changes for editor header controls and the bottom editing toolbar. Keep the review within the existing editor chrome: Help, Keyboard Shortcuts, Feedback, Library, current map name, all five editor menu controls, the compact mobile Menu trigger and its menu controls, toolbar buttons, and the toolbar shell. Exclude editor modal content, catalog/map controls, the homepage arrow fix, and unrelated global controls.

## Source-backed coverage matrix

| Surface | Existing owner and state | Final diff checks |
| --- | --- | --- |
| Header utility buttons | `EditorMenuBar` renders Help, Keyboard Shortcuts, and Feedback as `.menu-btn.editor-menu-bar__utility-button`; each reflects its open modal with `aria-expanded` (`src/components/editor-menu-bar.tsx:113-120, 174-195`). | Flat normal, hover, active, and expanded button shadow without changing sizing, labels, callbacks, or state attributes. |
| Library and current map | Library and map name are separate menu buttons; map name carries a dynamic label and map modal state (`src/components/editor-menu-bar.tsx:202-237`). | Preserve the map-name transparent treatment and ellipsis geometry while idle; when expanded, retain its existing accent background. Both states must lose the button shadow. |
| Top-right controls and compact mobile Menu | Five modal buttons expose `aria-expanded`; the compact Menu trigger exposes its own `aria-expanded`/`aria-controls`, while `data-expanded` reveals the controlled group (`src/components/editor-menu-bar.tsx:240-269`). | Cover normal, hover, active, expanded, and disabled rules without changing open/close behavior or mobile visibility/layout. |
| Toolbar buttons | Four tool buttons expose `aria-pressed`, tool-specific classes, and availability-based `disabled`; zoom is pressed-state driven; undo/redo are disabled when unavailable (`src/components/editor-toolbar.tsx:110-132, 143-185, 192-217`). | Remove raised/inset button shadows for normal, hover, active, pressed, and disabled states while retaining each existing color/state signal and control geometry. |
| Toolbar shell and tooltip | `.toolbar-wrapper` contains `.toolbar.editor-toolbar`; tool and zoom buttons expose `data-tooltip` (`src/components/editor-toolbar.tsx:136-162`). | Flatten the toolbar shell shadow only. Keep tooltip `::after` shadow and hover/focus-visible appearance intact. |

## Cascade baseline and priority risks

- Base menu/tool behavior and pressed colors are at `app/globals.css:3571-3603`. The shared neo raised-shadow group covers `.menu-bar`, `.toolbar`, `.menu-btn`, and `.tool-btn` at `3974-4026`; active, expanded, and pressed states receive inset shadows at `4089-4141`; disabled menu/tool buttons receive raised shadows at `4145-4157`.
- The editor header layout and button states are further specified at `app/globals.css:5298-5335`. The map-name rule sets `background: transparent; box-shadow: none` at `5323`, while `.editor-menu-bar .menu-btn[aria-expanded="true"]` at `5318` supplies its existing expanded accent background. The mobile map-name rule is at `5484`.
- The bottom toolbar shell and button dimensions are defined at `app/globals.css:5340-5350`; mobile widths/heights and touch controls are defined at `5496-5510`. Preserve these geometry and placement declarations.
- Tooltip pseudo-elements have their own shadow at `app/globals.css:5351-5359`. Any flat rule must target button elements and toolbar shell only, not `::after`.
- The mobile menu group is positioned and shown by `app/globals.css:5486-5492`; visual changes must not alter its `data-expanded` visibility or scroll sizing.

## Agreed implementation boundary

The parent approved a CSS-only approach scoped to the existing `.editor-menu-bar` and `.editor-toolbar` roots: locally override the existing raised/inset shadow tokens to `none`, preserve state colors and geometry, and restore the toolbar's existing border color without adding border width. The map name stays transparent at rest and keeps its existing accent background while expanded. Final review must confirm the inherited token values reach only these roots and descendants and do not alter tooltip pseudo-element shadows, modal surfaces, or other editor controls.

## Existing test coverage

- `tests/components/editor-controls.test.tsx:74-127` checks English and Chinese header labels and modal wiring.
- `tests/components/editor-controls.test.tsx:351-365` checks tooltip content and hover/focus-visible hooks.
- `tests/components/editor-controls.test.tsx:580-651` checks selected Multi-select/Cursor colors remain after the generic hover rule and rejects broad pressed selectors.
- `tests/components/editor-shell.test.tsx:40-66, 104-128` checks toolbar control count, selected/disabled attributes, and header controls.
- These tests verify markup/state and selected color cascade; they do not verify rendered shadows or geometry. CSS/source review does not replace browser acceptance, tests, or build evidence.

## Final review checklist for `CSS_READY`

1. Every authorized header and toolbar button family is covered; no unrelated buttons or components are swept in.
2. The flattened rule wins over normal, hover, `:active`, `.active`, `[aria-expanded="true"]`, `[aria-pressed="true"]`, and `:disabled` neo shadow declarations for the targeted controls.
3. The map name stays transparent while idle; its expanded accent background remains intact. Both states are shadow-free, and width/flex/ellipsis declarations remain intact.
4. The toolbar shell shadow is flattened while the tooltip pseudo-element shadow remains.
5. Button sizes, shell layout, toolbar placement, mobile Menu behavior, focus-visible treatment, and state colors remain intact; earlier dialog-button and homepage-arrow regions are unchanged.
6. Any finding will identify its exact selector/line evidence and a concrete verification path. Browser geometry, tests, and build remain separate gates owned by the parent/QA.

## `CSS_READY` source review

**Outcome: no source-level findings in the reviewed CSS diff.**

- `git diff -- app/globals.css` adds the two shadow-token overrides only to `.planner-editor-shell .editor-menu-bar` and `.planner-editor-shell .editor-toolbar` (`app/globals.css:5293-5297`). No broad selector or unrelated surface was added. The root shell is not selected.
- The raised declarations at `app/globals.css:4026, 4157, 5317` and inset declarations at `4141, 5318` resolve through those inherited local token values for the header and toolbar descendants. Thus hover/active/expanded/pressed/disabled states keep their existing backgrounds and colors while both raised and inset shadows resolve to `none`.
- The map-name idle background remains `transparent` at `app/globals.css:5323`; the expanded button keeps its existing accent background at `5318`. The new rules only override shadow tokens, so neither background state is changed.
- The toolbar's original 1px border is declared at `app/globals.css:3610`; its color is made transparent by the shared rule at `4065`. The diff adds only `border-color: var(--border-subtle)` to the existing toolbar rule at `5343`, retaining the existing width and box sizing.
- Tooltip shadow remains the literal `box-shadow: 0 6px 16px rgb(0 0 0 / 30%)` on the `::after` pseudo-element at `app/globals.css:5352`; the token overrides do not affect it. `EditorMenuBar`, `EditorToolbar`, and `EditorModal` are sibling elements in the workspace fragment (`src/components/planner-workspace.tsx:1172-1206, 1308`), so modal surfaces are outside the overridden roots and retain the shell's original tokens.
- The diff leaves button geometry, header/menu positioning, mobile visibility, toolbar placement, selected colors, focus rules, and behavior declarations unchanged. No component, test, configuration, or dependency file is part of this CSS diff.

The reviewer did not run tests, build, or browser checks. This source review does not verify computed styles or pixel geometry; parent/QA runtime and test evidence remains required.
