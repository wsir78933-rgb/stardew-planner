# English Planner Entry Links Design

## Goal

Every cross-page Planner entry opens the English homepage at `/`. The application must not introduce `/#planner` for cross-page navigation. Every fresh load of `/` starts in English.

## Confirmed behavior

- The shared Footer `Planner` / `规划器` link always uses `/`.
- Public-page header navigation `Planner` / `规划器` always uses `/`.
- The public-page brand link always uses `/`.
- Farm-guide breadcrumb brand links always use `/`.
- The Chinese introduction CTA continues to use `/`.
- Footer `How it works` / `使用方式` uses `/#capabilities` because that section exists only on the English editor homepage.
- Footer `FAQ` / `常见问题` uses `/#faq` for the same reason.
- Farm comparison, modded farms, Privacy, and Terms remain localized through `getLocalizedPublicPath`.
- Existing same-page homepage links using `href="#planner"` remain unchanged.
- The homepage language switcher may change the current rendered page to Chinese, but the selection is not restored after reload or a later visit. Every new homepage load starts with `DEFAULT_HOMEPAGE_LOCALE`, which is `en`.

## Architecture

`createSiteFooterContent` owns the Footer destination distinction: editor-home destinations use the fixed English root while localized content destinations continue through the public route registry. `PublicNavigation` and `PublicPageShell` keep their current presentation responsibilities and use `/` only for Planner/brand entry links. `PlannerHomepage` owns transient locale state and no longer reads from or writes to browser storage.

## Scope

Modify only the shared Footer destination builder, public navigation/shell entry links, farm-guide breadcrumb brand entry, homepage locale persistence boundary, and directly related tests. Do not alter `/zh` page content, editor runtime, legal pages, canonical/hreflang logic, sitemap behavior, CSS, or existing same-page `#planner` controls.

## Acceptance criteria

1. No cross-page production link uses `/#planner`.
2. English and Chinese Footer Planner links are `/`.
3. Chinese Footer `使用方式` and `常见问题` resolve to `/#capabilities` and `/#faq`.
4. Chinese farm comparison, mods, Privacy, and Terms links remain under `/zh`.
5. Public-page Planner navigation and brand links use `/` in both locales.
6. Reloading `/` starts in English even if `stardew-homepage-locale` previously contains `zh-CN`.
7. Existing homepage `href="#planner"` links remain present.
8. Focused tests, typecheck, build, diff check, and browser verification pass.
9. The Chinese `/zh` Planner navigation link is not marked `aria-current="page"`; the English `/` Planner link remains the current page.
