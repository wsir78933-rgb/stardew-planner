# Contact Page Compact Layout Design

## Goal

Make the English and Chinese Contact pages easier to scan and complete on a desktop viewport while preserving their established dark surface, gold submit action, rounded fields, bilingual routing, and form behavior.

## Scope

- Adjust only Contact page presentation in `app/globals.css` and the Message textarea's initial row count in `src/contact/contact-form.tsx`.
- Keep the Name and Email fields in two columns above 700px and one column at or below 700px.
- Keep all field names, client validation, Turnstile configuration, request submission, success/error states, page metadata, and privacy copy unchanged.
- Do not alter the public page shell, footer, other public routes, Cloudflare settings, or Worker code.

## Evidence-Derived Visual Contract

Reference: user-provided live `/contact` screenshot.

Evidence quality: mixed — current CSS values plus screenshot observation.

| Concern | Current evidence | Compact target |
| --- | --- | --- |
| Content width | CSS `max-width: 94rem`; screenshot shows excessive lateral empty space | `max-width: 60rem` for the header, form, and Contact footer boundary |
| Top/bottom rhythm | CSS padding reaches `8.25rem` top and `9rem` bottom | desktop vertical padding clamps from `3rem` to `5rem`; mobile retains comfortable padding |
| Form card | Existing dark gradient, hairline border, large rounded corners | preserve colors and treatment; cap desktop radius at `2rem`, reduce padding to at most `2rem` |
| Field density | CSS input minimum is `5.55rem`; label and field gaps are oversized | fields start at `4rem`, label gap `0.625rem`, two-column gutter `1.25rem` |
| Message area | CSS minimum is `19rem`; JSX requests 10 rows | set `rows={6}` and a `12rem` minimum height so the button is near the form body |
| Typography | Existing uppercase, widely tracked eyebrow and muted description | retain eyebrow styling; use the existing colors at a smaller desktop scale, and apply balanced/prettier wrapping only to visible descriptive text |
| Primary action | Existing gold pill is the sole accent | preserve color and icon; use a `3.75rem` minimum height and existing focus/hover behavior |

## Responsive Behavior

- At widths over 700px, use the compact two-column layout with a 960px maximum content width.
- At widths of 700px or below, retain the existing one-column layout; reduce Message's default minimum height from 15rem to 12rem without reducing touch targets below 4rem.
- Textareas remain manually vertically resizable; no animation or new interaction is introduced.

## Acceptance Criteria

1. On a 1440px desktop viewport, the Contact form is centered, no wider than 960px, and its primary action is visible without the previous oversized blank region.
2. The initial Message input is approximately 192px high on desktop and mobile while remaining vertically resizable.
3. Name and Email remain side-by-side on desktop and stack on mobile.
4. Input focus, disabled state, Turnstile rendering, submit behavior, noindex metadata, and English/Chinese content remain unchanged.
5. A focused Contact test suite, typecheck, production build, and visual browser check pass.
