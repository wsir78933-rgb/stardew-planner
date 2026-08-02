# Homepage language dropdown design

## Goal

Replace the two always-visible homepage language buttons with one compact dropdown trigger that always displays `Language ▾`. The menu lists available languages without marking the current language, switches immediately when an option is selected, and can grow as homepage locales are added.

## Scope

- Update `HomepageLocaleSwitcher` only for the dropdown interaction.
- Update the homepage header styles that currently target the two-button language group.
- Update focused component and style contract tests.
- Preserve the existing locale state, local-storage persistence, localized copy, routes, SEO, and all non-language header controls.
- Add no project dependency and do not change the frozen planner runtime.

## Component design

`HomepageLocaleSwitcher` remains the public component interface. Internally it owns only its disclosure state and focus behavior.

- A native `button` is the trigger.
- The visible trigger text is always `Language`; a decorative down chevron is hidden from assistive technology.
- The trigger exposes `aria-expanded` and `aria-controls`, while its accessible label continues to use the localized `label` prop.
- The panel is a plain `ul` containing native option buttons. It does not use `role="menu"`, so it does not claim an unimplemented application-menu keyboard model.
- Opening leaves focus on the trigger. Tab reaches the language buttons in document order.
- Selecting a language calls `onLocaleChange`, closes the panel, and returns focus to the trigger.
- Escape closes the panel and returns focus to the trigger. A pointer event outside closes the panel without stealing focus from the clicked control.
- The panel does not highlight, check, disable, or otherwise mark the current language.

## Locale data

Build the rendered options from `HOMEPAGE_LOCALES` plus a `Record<HomepageLocale, string>` label map. Adding a new locale therefore requires a label at compile time and automatically adds the option to this component.

## Visual design

- Preserve the existing homepage border color, rounded corners, typography, muted text, and pale surface.
- Replace the current two-button capsule with one compact trigger.
- Position the menu below and right-aligned to the trigger, with a solid surface, border, small radius, and restrained shadow.
- Give each option a full-width click target and visible hover/focus treatment.
- Keep the existing mobile header layout; the new control consumes less horizontal space than the current pair.

## Validation

- TDD focused component/style tests: fixed trigger text, two current options, no pressed/current marker, dropdown accessibility attributes, locale list derived from the locale registry, and scoped styling.
- TypeScript typecheck.
- Production build and full test suite.
- Browser checks at desktop and mobile widths for open/close, selection, Escape, outside click, keyboard focus, visual alignment, locale persistence, and no horizontal overflow.
