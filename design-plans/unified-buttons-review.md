# Unified dialog buttons review

Static CSS review of the `app/globals.css` diff after `CSS_READY`.

## Result

The 41 added CSS lines stay within the approved button families. They do not change shared modal, toolbar, map-picker, or item-catalog button rules. Existing flat switch-row rules remain intact.

## Cascade and states

- **Rest:** The new scoped family selectors set `--bg-surface`, `--border-subtle`, and no shadow. Their specificity ties the broad `.planner-editor-shell .editor-modal button` rest/raised selectors; the new declarations appear later, so they win. The summary action selector ties the modal rule and also appears later (`app/globals.css:4001-4026, 5406-5414`).
- **Hover:** Each family uses `--bg-raised` and `--border-subtle` only when enabled. The selected-state block follows the hover block at equal specificity, so a selected item stays green on hover (`app/globals.css:5415-5430`).
- **Selected:** `aria-pressed="true"` choices use `--accent-muted`, `--accent` border, and no shadow. The new selector ties the general modal pressed rule and appears later; for Library branches it outranks the earlier fluorescent `#c9fb45` rule (`app/globals.css:3679, 4120, 5423-5430`). The summary action is omitted from this block and has no persistent selected state in its component (`src/components/farm-summary-panel.tsx:40-53`).
- **Active:** Scoped `:active:not(:disabled)` rules tie the broad modal active rule and occur later, so the inset shadow is removed without touching other modal actions (`app/globals.css:4119, 5431-5437`). Selection callbacks change the `aria-pressed` state; the summary action opens its detail modal.
- **Disabled:** Scoped disabled rules tie the broad modal disabled shadow rule and occur later. They leave the existing disabled opacity/cursor declarations untouched (`app/globals.css:2675-2677, 4148-4157, 5438-5446`). Current markup for these families does not declare disabled controls.

## Scope and preserved behavior

The selectors cover only `.planner-save-modal-loader__branches`, `.editor-config-chips`, `.editor-config-segmented`, `.editor-config-seasons`, and the direct summary-card action. The segmented family also serves View catalog position and Settings cursor controls, as named in the approved plan. No selector includes `.editor-modal button` broadly, `.tab-icon`, item-catalog controls, menu buttons, toolbar buttons, or map-picker controls.

The existing `:focus-visible` outline rule is unchanged (`app/globals.css:2680-2684`). The 44px mobile minimum-height rule for config choices is unchanged (`app/globals.css:5510-5515`). No width, height, padding, gap, radius, or responsive declarations change. Workspace `box-sizing: border-box` keeps the new one-pixel borders inside the existing outer boxes (`app/globals.css:2659-2662`); segmented buttons previously reset to `border: 0`, so their inner content area becomes 2px narrower. Circular season geometry remains defined at `app/globals.css:5396-5397`. The earlier flat switch-row declarations remain at `app/globals.css:5381-5386`.

## Verification boundary

This review inspected the real CSS diff and source cascade only. It did not run tests, build, or browser validation; runtime visual acceptance remains with the coordinator's planned checks.
