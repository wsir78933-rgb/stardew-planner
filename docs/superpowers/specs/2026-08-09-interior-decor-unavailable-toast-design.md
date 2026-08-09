# Interior Decor Unavailable Feedback Design

## Goal

Restore the original editor interaction for wallpaper and flooring that cannot be used on the current map, without changing the current editor visual style.

## Confirmed behavior

- When the current map does not support interior decor, selecting a wallpaper shows `Wallpaper can only be applied inside.`
- When the current map does not support interior decor, selecting flooring shows `Flooring can only be applied inside.`
- A rejected catalog selection does not activate the wallpaper or flooring pattern.
- Interior maps keep the existing wallpaper and flooring selection and application behavior.
- Invalid target clicks inside a supported interior map keep the existing rejection message behavior, but the message uses the same visible notification surface.
- Notifications respect the existing `showToasts` behavior option and clear automatically after a short interval.

## Implementation boundaries

- Reuse the existing interior-decor support predicate and rejection-message state.
- Keep decision logic in the interior-decor controls module and UI coordination in the planner workspace.
- Use the current editor CSS variables, typography, borders, and spacing for the notification. The yellow styling in the reference screenshot is not a visual requirement.
- Do not change catalog content, thumbnails, map data, placement rules, editor layout, homepage styling, or other notification behavior.

## Accessibility

- Render the visible notification with `role="status"` and `aria-live="polite"`.
- Do not move keyboard focus when the notification appears.
- Do not rely on color alone to communicate the warning.

## Verification

- Unit-test the unsupported-map decision and exact wallpaper/flooring messages.
- Component-test notification rendering, `showToasts`, and automatic clearing.
- Run related Vitest suites, `pnpm typecheck`, and `pnpm build`.
- In `localhost:3002`, verify that selecting wallpaper and flooring on the outdoor farm shows the notification without activating the item, while an interior map still allows selection.
