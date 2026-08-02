# Homepage Rendering and SEO Remediation Design

## Status

Approved on 2026-08-02. Implementation has not started.

## Goal

Fix the three locally verified homepage and technical SEO defects without
changing the frozen planner runtime:

1. The homepage must render with its intended styles on the first static frame,
   before React hydration.
2. FAQ answers must exist in the initial static HTML while remaining visually
   collapsed by default.
3. Every canonical public page must expose one valid Open Graph and Twitter
   image using an original 1200 by 630 brand card.

## Confirmed Decisions

- Use the smallest native implementation rather than an inline bootstrap script
  or route-layout refactor.
- Keep the existing client-only Svelte/Pixi planner boundary.
- Keep the planner on `/`; do not add a `/planner` route.
- Use the existing server-rendered `data-homepage-shell` marker as the homepage
  styling boundary.
- Replace the FAQ accordion with native `details` and `summary` elements.
- Create an original brand card with the existing dark-green, cream, and lime
  visual language, an abstract farm-planning grid, and no game screenshot,
  character, logo, or game-derived artwork.
- Reuse the existing SEO title and description on the brand card. Do not invent
  new marketing claims.
- Keep an editable SVG source and a 1200 by 630 PNG delivery asset.
- Add feature regression coverage and verify all 22 static public pages.
- Do not install dependencies, deploy, push, or create a commit.

## Scope and Boundaries

The change is limited to homepage presentation structure, homepage-scoped CSS,
FAQ markup, the shared metadata builder, the new social image assets, and tests
that prove those behaviors.

The frozen Svelte/Pixi implementation and files under
`public/_app/immutable/**` remain unchanged. `ReferenceRuntimeHost` keeps its
current client-only, `ssr: false` boundary. The planner bootstrap behavior,
local project storage, planner controls, wheel-mode feature, and editor state
are outside this design.

The working tree already contains unrelated user-owned changes, including the
wheel-mode work and desktop-gutter design files. Implementation must make only
surgical edits and preserve every unrelated diff.

## Chosen Architecture

### Hydration-independent homepage styling

The static homepage already renders a direct body child marked with
`data-homepage-shell`. Homepage selectors currently gated by
`body.stardew-homepage` will instead use the route-local structural selector:

```css
body:has(> [data-homepage-shell])
```

This selector matches as soon as the HTML element exists and does not wait for
React effects. Public routes without that direct child do not receive homepage
styles. The corresponding body-class `useEffect` is removed because it no
longer owns any required behavior.

Only selectors that currently depend on the homepage body class are migrated.
Existing design variables, editor-specific selectors, wheel-mode selectors,
and unrelated body states remain intact. No inline script or duplicated route
configuration is introduced.

### Static and accessible FAQ disclosure

The homepage FAQ is rendered as one native `details` element per question with
the question in `summary` and the answer as normal child content. The elements
do not use `open` initially, so the visual behavior remains collapsed by
default while every answer stays in the static HTML.

FAQ styling targets the homepage FAQ's own classes and native disclosure
states. It preserves the existing borders, typography, spacing, hover/focus
feedback, and visible expansion affordance. The browser owns keyboard and
disclosure behavior, so no React state, event adapter, or dependency is added.

### Deterministic social image asset

The social image is authored as a deterministic SVG because the design requires
simple geometry and exact text. It is exported to a 1200 by 630 PNG for broad
social-preview compatibility. The SVG contains only original shapes, an
abstract planning grid/path motif, existing site colors, and the existing site
title and description.

The editable SVG and exported PNG live under a dedicated public social-image
directory. Export verification fails if the PNG dimensions are not exactly
1200 by 630. The PNG is the URL consumed by metadata; the SVG is retained only
as the maintainable source.

### Shared metadata image contract

The existing metadata factory remains the single public interface for page
metadata. It adds one absolute image URL to both `openGraph.images` and
`twitter.images`, using the existing validated production origin. Route files
continue to supply their own title, description, canonical, and locale data;
they do not duplicate the social image configuration.

All 22 canonical static pages inherit the same approved brand card. No
page-specific image abstraction is added because the current requirement has
only one image.

## Component Responsibilities

- `HomepagePlannerWorkspace` renders the homepage workspace boundary and no
  longer mutates global body state.
- `HomepageContent` renders FAQ content using native disclosure markup; it does
  not manage open-state logic.
- Homepage CSS owns only homepage presentation and the stable structural route
  scope.
- The metadata factory owns the absolute shared social image declarations.
- The SVG source owns the editable visual; the PNG owns delivery compatibility.

## Failure Handling

- Existing metadata URL validation continues to fail fast on an invalid
  production origin. Social image URL construction uses that validated value
  and has no fallback origin.
- Metadata tests require a non-empty absolute HTTPS image URL in both Open Graph
  and Twitter output.
- Asset verification reports the received PNG width and height when either
  dimension is incorrect.
- FAQ content continues to come from the typed homepage copy. Missing copy is
  not caught or silently replaced.
- No exception is caught unless the caller can handle it meaningfully.

## Testing Strategy

Tests are added before implementation changes.

1. Homepage style contracts prove the static shell selector owns homepage
   styles and that no hydration-added homepage body class is required.
2. Homepage structure tests prove each FAQ question and answer is represented by
   native disclosure markup.
3. Metadata tests prove both social-image fields contain the approved absolute
   PNG URL.
4. Static-route artifact tests prove all 22 generated HTML pages contain
   `og:image` and `twitter:image` and that homepage FAQ answers appear in the
   initial output.
5. Asset tests prove the PNG exists and is exactly 1200 by 630.

Verification runs in this order:

1. Targeted red tests before implementation.
2. Targeted tests after each narrow change.
3. TypeScript checking.
4. Production build.
5. Full test suite against fresh build output.
6. `git diff --check` and a scope review of the dirty working tree.
7. Hermes CDP cold-load checks for the homepage first frame, FAQ pointer and
   keyboard interaction, planner startup, browser console, and representative
   non-homepage route isolation.

## Acceptance Criteria

- A cold homepage load never shows the verified unstyled dark-text frame.
- Homepage appearance does not depend on a post-hydration body-class mutation.
- FAQ answers are present in initial HTML and disclosures remain collapsed by
  default and keyboard accessible.
- Every one of the 22 public static pages contains valid Open Graph and Twitter
  image metadata referencing the same absolute PNG URL.
- The social PNG is exactly 1200 by 630, uses approved original brand visuals,
  contains correct existing copy, and contains no game-derived artwork.
- The planner still initializes and operates through its existing client-only
  boundary.
- Other public routes do not inherit homepage-only styles.
- No unrelated working-tree change is overwritten or reformatted.

## Non-Goals

- Rewriting the planner as a server-rendered component.
- Removing the intentional client-only planner boundary.
- Changing planner controls, wheel behavior, storage, or runtime delivery.
- Creating page-specific social images.
- Changing canonical, hreflang, sitemap, robots, or structured-data strategy.
- Configuring deployment redirects, headers, CDN caching, or production CrUX
  monitoring.
- Broad homepage redesign or unrelated CSS cleanup.
