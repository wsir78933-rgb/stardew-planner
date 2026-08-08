# Map Picker Label Typography Design

## Goal

Reduce only the map-card title typography so it visually matches the scale shown in the user-provided stardewplan.com reference.

## Confirmed Design

- Map-card title font size: `14px`.
- Map-card title line height: `20px`.
- Keep the existing font family, font weight, color, alignment, wrapping behavior, and wording.
- Scope the selector to the title `span` inside `.planner-editor-shell .editor-modal__map-grid` buttons.

## Scope

Modify only:

- `app/globals.css`: add the scoped title typography rule.
- `tests/components/planner-map-picker-layout.test.ts`: lock the two confirmed typography values with a regression test.

Do not modify map images, source assets, card dimensions, grid columns, spacing, modal dimensions, tabs, component markup, or interaction behavior.

## Acceptance Criteria

1. Every map-card title in the map picker computes to `14px` font size and `20px` line height.
2. Long labels continue to wrap naturally inside the existing card width.
3. Images, cards, grid layout, modal layout, tabs, and interactions remain unchanged.
4. The focused regression test, TypeScript check, production build, and browser verification succeed.
5. No files outside the two scoped implementation/test files are changed by this task, excluding this approved design and plan documentation.

