# Static Public-Page SEO Design

## Goal

Make the existing English public information pages discoverable and readable
without JavaScript while preserving the homepage planner and its frozen
Svelte/Pixi runtime.

## Confirmed Decisions

- The production origin is `https://stardewvalleyplanner.art`.
- Canonical URLs do not use a trailing slash.
- The public route set remains 13 canonical pages: `/`, `/farm-comparison`,
  `/mods`, `/privacy`, `/terms`, and the eight official `/farm/[type]` pages.
- Chinese remains a client-side interface preference. This work does not add
  localized URLs or `hreflang` entries.
- Public routes retain Privacy and Terms as static pages. They are not deleted.
- Deployment-provider configuration for HTTPS redirects, response headers,
  CDN compression, and caching is outside this repository change.

## Scope and Boundaries

The homepage remains the only route that mounts `ReferenceRuntimeHost`. The
frozen delivery assets in `public/_app/**` and `public/reference-runtime/**`,
the runtime bootstrap, and the homepage planner behavior are not changed.

The current homepage visual work in `app/globals.css` and
`tests/homepage/homepage-style-contract.test.ts` is user-owned work on `main`.
Implementation happens in an isolated worktree created from committed `main`,
so it must neither overwrite nor recreate those uncommitted changes.

## Chosen Architecture

### Static page composition

`PublicPageShell` is a Server Component with one responsibility: render the
shared public-page frame. It receives `children`, renders the brand link,
`PublicNavigation`, a `main` landmark, and the common footer. It owns a
`data-public-page-shell` scope used by public-page CSS, including a scrollable
viewport so the existing global `body` overflow rule cannot clip page content.

Each route owns its own page header, page-specific data lookup, and metadata:

- `/farm-comparison` renders its header and `FarmComparisonContent`.
- `/mods` renders its header and `ModMapCardGrid`.
- `/farm/[type]` validates the static parameter, resolves one official farm,
  and renders `FarmGuideContent` with its sibling guides.
- `/privacy` and `/terms` render a new `LegalPageContent` from structured,
  local TypeScript data.

The existing comparison, Mods, and farm-guide components remain responsible
only for their content body. The comparison and Mods route headers supply the
`h1` that those components intentionally do not own. Every public page must
render exactly one `h1` in its build output.

### Content and visual contract

`LegalDocument` data is moved from the current local-only wording in
`sync-reference-runtime.ts` into a dedicated native data module. It contains a
document title, last-updated text, and typed sections. `LegalPageContent`
renders it without importing the frozen runtime. The old frozen-runtime
replacement remains unchanged because it still protects the homepage runtime
from displaying obsolete online-product wording.

Public-page CSS is added under `[data-public-page-shell]`. It defines the page
frame, navigation, headers, cards, tables, legal sections, responsive rules,
and `:focus-visible` states. It does not change homepage-scoped selectors.
Public card and hero image containers use a stable `aspect-ratio` and
`object-fit: contain`, reserving layout space before images load. This fixes
the required CLS boundary without duplicating intrinsic dimensions throughout
the current reference data.

### URL and metadata contract

A small site configuration module owns the only production origin. It exports
a validated URL with no path, query, or fragment. Metadata and discovery code
consume that module rather than repeating the origin string.

Each canonical public route has a static title, description, and absolute
canonical URL. Dynamic farm metadata is derived only after validating the farm
type against `officialFarmTypes`. The root layout provides the shared
`metadataBase`, default title template, favicon, and basic Open Graph defaults;
routes provide their unique metadata. Planner query URLs such as
`/?farmType=standard` canonicalize to `/` and are excluded from the sitemap.

`app/robots.ts` allows normal crawlers and points at the absolute sitemap URL.
`app/sitemap.ts` derives its eight farm URLs from `officialFarmTypes`; it adds
only the 13 canonical URLs and never manually duplicates the farm list.

### Structured data

Server-rendered JSON-LD is generated only from visible local content:

- Homepage: `WebApplication`.
- Farm comparison: `Article`.
- Mods: `CollectionPage`.
- Farm guides: `Article` and `BreadcrumbList`.

Privacy and Terms have no JSON-LD requirement. The JSON serializer escapes
`<` to prevent a `</script>` sequence from ending its script element. It does
not invent social images, authors, prices, ratings, offers, or organization
claims not visible on the page.

## Failure Handling

- Invalid site configuration throws a message containing the received URL.
- An unsupported farm type continues to call `notFound()` before metadata or
  content generation.
- Legal rendering accepts only the typed local `LegalDocument` structure; no
  runtime text extraction or silent fallback is permitted.

## Verification Contract

New tests are written before implementation. Component tests cover the public
shell, legal content, metadata builder, and JSON-LD escaping. One dedicated
static-public-page build-artifact test builds once, then checks all 13 output
pages for a unique `h1`, public navigation, core text, title, description,
absolute canonical, required JSON-LD, and no bailout, runtime root, or
bootstrap script. It also checks `robots.txt` and `sitemap.xml` for exactly the
canonical URL set.

The verification sequence is serial: build, targeted tests, full test suite,
typecheck, production build, artifact assertions, `git diff --check`, then
HTTP and desktop/mobile browser checks for comparison, one farm guide, Mods,
Privacy, and Terms. The initial baseline established that the existing full
suite requires a pre-existing `out/` directory, so it is always preceded by a
production build in this worktree.

## Non-Goals

- No new planner route and no planner runtime refactor.
- No indexed Chinese URL architecture or translation project.
- No deployment-provider response-header, TLS, redirect, CDN, compression, or
  cache configuration.
- No IndexNow submission workflow.
