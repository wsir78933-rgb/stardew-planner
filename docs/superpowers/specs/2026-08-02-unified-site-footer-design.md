# Unified Site Footer Design

## Goal

Give the homepage and every public content page one responsive, localized Footer with the information hierarchy of the approved reference: a product identity block, decorative social icons, grouped routes, and copyright information.

## Scope

- Replace the homepage Footer in `src/components/homepage-content.tsx`.
- Replace the shared public-page Footer in `src/components/public-page-shell.tsx`.
- Add exactly one shared presentation component and one shared content-construction module.
- Add the `react-icons` package for the four approved brand icons.
- Update only Footer-related copy, styles, and tests.
- Add bilingual Privacy and Terms public pages, following the user's approved scope expansion.

## Non-goals

- Do not add social profile URLs, placeholder `#` links, click handlers, or keyboard-focusable disabled controls.
- Do not change the planner runtime, public navigation entries, or reference-runtime files.
- Do not rewrite unrelated uncommitted homepage or CSS work.

## Information Architecture

The Footer has a left identity column and three route groups.

- Identity: localized product name, browser-local planner description, and four decorative Instagram, Facebook, Twitter, and LinkedIn icons.
- Planner: planner home, farm comparison, modded farms.
- Explore: how-it-works and FAQ anchors on the localized homepage.
- Legal: privacy policy and terms of service.
- Bottom row: localized copyright text.

Every route is generated through `getLocalizedPublicPath`. The public route registry, language alternates, sitemap, and static-export tests include the legal routes. Social icons are `aria-hidden` spans, not links or buttons.

## Legal Page Content

Privacy and Terms reuse only product facts already present in the repository: no account or sign-in; browser-local projects; no cloud sync, share links, payments, memberships, or supporter features; no product analytics or tracking services; no sign-in cookies; and user-controlled JSON import/export. The new pages must stay concise and factual. They must not add a contact claim, a data-retention promise, a legal-jurisdiction term, or an unsupported compliance claim.

## Architecture

`src/site-footer/site-footer-content.ts` owns the route-independent content types and resolves every localized Footer path from a localized Footer copy object. `src/components/site-footer.tsx` consumes that resolved content and renders markup only. Homepage and public-page components construct the resolved data through that interface and do not duplicate Footer route construction.

`src/legal/legal-page-copy.ts` owns bilingual legal disclosure data. `src/components/legal-page-content.tsx` renders legal content from that data, and four small route modules select locale and document metadata. The route registry remains the source of truth for all public page identity.

CSS is scoped with `data-site-footer` attributes. It uses the current project palette and typeface, does not add animations or gradients, and switches from the desktop identity-plus-columns layout to one column below 700px.

## Validation

- A component test verifies localized route construction, three link groups, and decorative non-link social icons.
- Homepage, public-shell, route-registry, sitemap, and static-export tests verify the shared Footer and legal pages in English and Chinese.
- Run targeted Vitest files, `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- Inspect the local development server at desktop width and 390px width, including real Footer destinations.

## Constraints

- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming.
- Keep the existing dirty worktree intact outside the authorized Footer files.
- Treat legal route, legal copy, legal component, and legal-page files as authorized Footer support files.
- Do not stage, commit, push, deploy, or modify Hermes.
