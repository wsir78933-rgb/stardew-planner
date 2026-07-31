# Safe bilingual public pages design

## Goal

Add Chinese public discovery pages at `/zh` while preserving the current
English planner, all existing browser-local project data, and the user's
uncommitted homepage styling work. English and Chinese equivalents must be
discoverable through canonical URLs, `hreflang`, and a single sitemap.

## Scope

### Routes

The public route identities are the English root path and its Chinese `/zh`
counterpart:

| Identity | English URL | Chinese URL |
| --- | --- | --- |
| Planner introduction | `/` | `/zh` |
| Farm comparison | `/farm-comparison` | `/zh/farm-comparison` |
| Mods | `/mods` | `/zh/mods` |
| Each official farm type | `/farm/<type>` | `/zh/farm/<type>` |

`<type>` is one of `standard`, `riverland`, `forest`, `hilltop`,
`wilderness`, `four-corners`, `beach`, or `meadowlands`. This produces 11
English URLs and 11 Chinese URLs, for 22 sitemap entries. There is no `/en`
URL: English remains at the root paths.

The `/privacy` and `/terms` routes are removed. They are removed from public
navigation, route metadata, structured data, the sitemap, tests, native legal
content, and static output. Static export consequently serves those removed
paths as 404s; this change intentionally adds no redirect or replacement.

### Planner and browser-local data

The English `/` route continues to render the current `PlannerHomepage` and
its existing reference runtime host. No project-schema, local-storage,
thumbnail, catalog-mapping, or migration code from `codex/bilingual-seo-port`
is imported or changed.

The Chinese `/zh` route is a server-rendered Chinese introduction page, not a
second planner. Its primary CTA opens the English planner at `/`. Chinese farm
pages retain their selected map in planner CTAs through `/?farmType=<type>`.
No Chinese public page reads or writes browser-local project data.

### Localization boundary

Localization is limited to public static pages. A small typed public-locale
module owns locale IDs, locale paths, route pairs, navigation labels, page
copy, and localized metadata inputs. Static server components consume that
module directly. Do not introduce `next-intl`, a client locale provider, or
the branch's native `PlannerWorkspace`; those broaden the work into editor
localization and project migration.

Existing English root routes remain the implementation for English pages.
Chinese routes reuse common static-page components where their data shape is
the same, with explicit localized copy at the component boundary. Any styling
is scoped under `[data-public-page-shell]`; `body.stardew-homepage` and all
reference runtime assets remain unchanged.

## SEO architecture

One locale-aware public-route registry is the source of truth for all
indexable paths. It derives:

- each page's absolute canonical URL;
- the paired `alternates.languages` values for `en`, `zh-CN`, and
  `x-default` (the English URL);
- the 22 URLs in `sitemap.xml`;
- static-artifact expectations.

Every English and Chinese equivalent has its own canonical. The English root
planner and Chinese root introduction are treated as language equivalents
because both are entry points to the same farm-planning product; the Chinese
page's CTA identifies the preserved English planner interface. Existing safe
JSON-LD serialization remains the only JSON-LD serialization path. JSON-LD
continues to describe visible page content and does not add social images,
authors, ratings, offers, or `sameAs` values.

`robots.txt` continues to allow all crawlers and points to the absolute
`/sitemap.xml` URL. It does not list route URLs independently.

## Implementation units

1. Replace the single-language public route registry with locale-aware route
   pairs while retaining a clear English-path accessor for existing routes.
   Add behavior tests for path pairing, canonical URLs, and language
   alternates.
2. Add typed Chinese public copy and a server-rendered Chinese public shell,
   navigation, planner-introduction page, farm comparison page, Mods page,
   and farm-guide pages. Keep `PlannerHomepage` exclusively on `/`.
3. Update English public route metadata to emit alternates, add the `/zh`
   routes, and derive sitemap/robots from the shared registry.
4. Remove the legal routes, legal content, legal navigation entries, and their
   tests. Replace the old 13-page static contract with a 22-page bilingual
   static contract that explicitly proves the removed paths are absent.

## Error handling and compatibility

Farm route parameters remain generated only from `officialFarmTypes` with
`dynamicParams = false`; unknown farm types call `notFound()`. URL helpers
remain fail-fast: malformed site configuration, external paths, backslashes,
queries, fragments, and trailing slashes are rejected with diagnostics that
include the received value where applicable.

The current main worktree's uncommitted changes to `app/globals.css` and
`tests/homepage/homepage-style-contract.test.ts` are outside this branch and
must remain untouched when this work is eventually integrated.

## Acceptance criteria

- `/` still mounts the existing English planner and `/zh` contains no planner
  runtime host.
- All 22 indexable static files have one visible `h1`, a precise description,
  their absolute canonical, and `en`/`zh-CN`/`x-default` alternates.
- `out/sitemap.xml` contains exactly the 22 locale-aware URLs; `robots.txt`
  references it; no legal URL appears in either artifact.
- `/privacy` and `/terms` are absent from the navigation and static output.
- The frozen runtime, all project-data code, and `body.stardew-homepage` are
  unchanged by this branch.
- TDD tests cover the route registry, localized metadata, static artifacts,
  and Chinese planner CTAs before corresponding production changes.
- `pnpm typecheck`, production build, full tests, diff check, local HTTP
  checks, and desktop/mobile browser checks pass.
