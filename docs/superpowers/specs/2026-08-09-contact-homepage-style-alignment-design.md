# Contact Page Homepage Style Alignment Design

## Goal

Align the English and Chinese Contact pages with the current homepage visual system while preserving the existing public-page shell and all Contact form behavior.

## Approved direction

- Keep `PublicPageShell`, its navigation structure, and the shared site footer.
- Replace the Contact-only near-black and gold theme with the homepage palette and component treatment.
- Use the homepage as the visual source of truth: warm off-white background, deep green foreground, muted green secondary text, lime primary action, thin dark borders, restrained radii, and the existing Arial/Helvetica typography.
- Keep the Contact page focused and compact rather than recreating the homepage's full promotional hero.

This design supersedes only the visual requirements in `2026-08-08-contact-email-worker-design.md` and `2026-08-09-contact-compact-layout-design.md`. Their routing, security, privacy, form behavior, and compact-layout requirements remain unchanged.

## Scope

- Modify the Contact-specific rules in `app/globals.css`.
- Apply the same presentation to `/contact` and `/zh/contact` through their shared Contact components.
- Keep the existing DOM, copy, form fields, validation, Turnstile integration, submission endpoint, status messages, page metadata, and footer links unchanged.
- Add no dependency, asset, animation, API change, environment variable, deployment change, or unrelated refactor.

## Evidence-derived visual contract

Reference: the current homepage and shared public-page CSS in `app/globals.css`.

Evidence quality: exact local CSS values.

| Role | Source value or pattern | Contact application |
| --- | --- | --- |
| Page background | `#fdfff8` with restrained lime radial atmosphere on the homepage | Warm off-white Contact surface with the same subtle lime atmosphere |
| Primary text | `#1c211b` | Title, labels, navigation, and primary content |
| Muted text | `#52604e` / homepage muted green | Description, placeholder, privacy notice, and idle status |
| Primary action | `#c9fb45` with dark border and hard offset shadow | Submit button, including the homepage hover treatment |
| Secondary surface | `#f1f7e7` | Form panel or restrained supporting surface |
| Borders | Thin dark green rules with reduced opacity | Header, footer, form, and input boundaries |
| Radius | Approximately `0.45rem` to `0.5rem` | Form panel, inputs, textarea, and button; no pills or oversized card radius |
| Focus | Existing green ring `#759d1c` | Inputs, textarea, and submit action |
| Typography | Arial/Helvetica; tightly set large homepage headings | Visible Contact `h1`, standard labels, and readable body copy |

## Page composition

1. The shared public header remains the first page element and returns to its light public-page treatment.
2. The Contact header becomes a visible content hierarchy:
   - the existing eyebrow remains a small supporting label;
   - the existing localized `h1` is visible and uses the homepage heading scale and tight hierarchy;
   - the description uses muted green text and a readable line length.
3. The form remains centered and compact, with a maximum width consistent with the current 60rem compact-layout limit.
4. Name and Email remain a two-column row above 700px and stack at or below 700px.
5. The Message textarea remains approximately 12rem tall initially and vertically resizable.
6. The shared footer follows immediately after the Contact main area using its normal light public-page treatment.

## Component treatment

- Form panel: homepage secondary surface `#f1f7e7`, one-pixel dark-green border, small radius, no panel gradient, glow, or inset shadow.
- Inputs and textarea: white `#ffffff` fill, thin border, small radius, existing font, at least the existing touch-target height, and green focus ring.
- Submit button: lime fill, dark border, small radius, homepage-style hard offset shadow, existing send icon, and no pill shape.
- Feedback: keep success and error messages adjacent to the submit action; use accessible green/red colors that remain legible on the light surface.
- Motion: add no new animation. Retain only brief local hover/focus feedback already established by the homepage.

## Responsive behavior

- Desktop: centered form, two-column Name/Email row, visible title, and no oversized empty regions.
- Mobile at 700px and below: one-column fields, full-width submit button, reduced but comfortable padding, and no horizontal overflow.
- Preserve the shared public header and footer mobile behavior; do not introduce a Contact-only navigation pattern.

## Risks and boundaries

- Contact currently uses `:has(.contact-page-content)` overrides that recolor the whole public shell. Those overrides must be removed or rewritten narrowly so no dark-theme value leaks into the header or footer.
- The current local server on port 3002 belongs to a different `/private/tmp` worktree and is not valid verification evidence for this checkout. Verification must build and serve this checkout's fresh `out/` directory.
- Do not modify the existing Contact form logic to achieve presentation changes.
- Do not change any non-Contact public route.

## Acceptance criteria

1. `/contact` and `/zh/contact` use the homepage palette and component language with no remaining black/gold Contact theme.
2. The localized Contact title is visibly rendered and forms a clear hierarchy with the eyebrow and description.
3. The public navigation and footer remain structurally unchanged and use their normal light treatment.
4. Name and Email are side by side on desktop and stacked on mobile; the textarea remains vertically resizable.
5. Inputs, textarea, and submit button have visible keyboard focus states; disabled, success, and error states remain legible.
6. There is no horizontal overflow at a 390px viewport.
7. Contact tests, TypeScript checking, production build, and fresh browser checks for both locales pass.

## Verification

- Run the focused Contact form test.
- Run `pnpm typecheck`.
- Run `pnpm build`.
- Serve this checkout's freshly generated `out/` directory on a verified unused local port.
- Inspect `/contact` and `/zh/contact` at desktop and 390px mobile widths, including focus states and horizontal overflow.
- Run `git diff --check` and confirm the final diff is limited to the approved design document and Contact styling files.

## Git boundary

No commit, push, deployment, or external configuration change is authorized.
