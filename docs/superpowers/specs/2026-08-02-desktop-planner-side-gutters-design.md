# Desktop Planner Side Gutters Design

## Goal

Give the homepage planner measured horizontal breathing room on desktop displays while retaining the full-width mobile editing surface.

## Scope

- Apply a responsive horizontal inset to the homepage workspace only when the viewport is wider than 700px.
- Keep the runtime root, map, catalog, editor toolbar, height, and mobile layout unchanged.
- Preserve the existing responsive maximum inset of 3rem used by the homepage header.

## Design

The existing `[data-homepage-workspace]` section remains the sole layout owner. Its desktop rule will use `padding-inline: clamp(1.25rem, 3vw, 3rem)` so the space grows modestly with viewport width and stops at 48px per side. The existing mobile rule continues to override this with `padding-inline: 0` at `max-width: 700px`.

The corresponding style-contract test will assert the desktop and mobile values, retain the no-`max-width` guard, and keep the existing viewport-height contract.

## Verification

- Run the focused homepage style-contract test.
- Run TypeScript checking and `git diff --check`.
- Build the static export and inspect the planner at a desktop viewport plus a 390px-wide mobile viewport; confirm desktop gutters, a full-width mobile editor, no horizontal overflow, and a usable map.
