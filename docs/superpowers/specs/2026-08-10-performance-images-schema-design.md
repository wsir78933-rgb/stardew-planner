# Performance, Public Images, and Structured Data Design

## Decision

Implement the approved repository-only optimization in three independent,
evidence-gated parts:

1. remove the avoidable `ReactPlannerHost` to `PlannerWorkspace` dynamic-module
   waterfall without changing component output, CSS, or editor behavior;
2. serve lossless WebP derivatives for the public farm-guide,
   farm-comparison, and Mod-card previews while keeping the editor and source
   game assets on their existing PNG paths;
3. enrich existing JSON-LD only with values that are already verifiable in the
   repository.

Cloudflare remains outside this implementation. It is handled only after the
repository work passes its local production-build acceptance, and only under a
separate external-change authorization.

## Goal and success criteria

The goal is to reduce initial editor waiting and public-page image transfer,
while improving structured-data meaning without changing any visible desktop
layout or inventing SEO facts.

The work succeeds only when all of the following are true:

- the desktop editor has the same component structure, geometry, controls,
  interactions, and rendered appearance;
- no new CSS or responsive-layout rule is introduced;
- the `PlannerWorkspace` scheduling experiment improves the current-worktree
  mobile Fast 4G cold-start median and satisfies the existing `2500 ms`
  threshold without regressing the existing desktop or warm profiles;
- all 29 public preview derivatives decode to the same dimensions and RGBA
  pixels as their source PNGs;
- the 29 derivative files remain below the measured source total of
  `4,096,433` bytes, with the read-only feasibility run establishing an
  expected lossless WebP total near `1,290,098` bytes;
- `/farm/[type]`, `/farm-comparison`, and `/mods` preserve their current layout
  and alt text while requesting the public WebP derivatives;
- every emitted JSON-LD script parses, uses absolute canonical HTTPS URLs, and
  contains only values backed by route, locale, copy, or preview registries;
- all eight blog URLs remain `noindex, follow` and remain present in the exact
  34-URL sitemap;
- focused tests, typecheck, production build, full regression tests, static
  artifact checks, and browser acceptance all pass.

## Scope boundaries

### In scope

- `src/components/react-planner-host.tsx` and its focused tests;
- a dedicated public-preview path containing 8 official-farm and 21 Mod-map
  lossless WebP derivatives;
- the public-content preview-source boundary and relevant public-page image
  markup;
- the structured-data generators and the route call sites that supply locale
  or verified farm-preview data;
- focused asset, route, and structured-data contract tests;
- local production-build performance and browser validation.

### Out of scope

- `app/globals.css` or any other layout/style file;
- editor resource paths, synchronized source PNGs, game textures, TMX files,
  Pixi preloading, or speculative texture prefetching;
- blog-cover lossy conversion, responsive blog variants, or social-image
  format changes;
- fabricated author, reviewer, publication date, modification date, rating,
  review, publisher identity, price, or offer fields;
- new schema for Contact, Privacy, or Terms pages;
- analytics, privacy-policy, content, canonical, hreflang, robots, sitemap, or
  route-indexability changes;
- dependency installation, Git staging/commit/push, deployment, or Cloudflare
  modification.

## Part 1: editor module-loading experiment

### Verified current boundary

`ReactPlannerHost` defines `PlannerWorkspace` through `next/dynamic`. The
loader currently starts after the host is mounted and the component is
rendered. The host also waits for its effect to construct the startup value
before rendering that dynamic component.

The experiment is limited to starting the existing
`import("./planner-workspace")` once when the host module is evaluated and
giving `next/dynamic` a loader that reuses that exact Promise. It does not
preload Pixi, maps, TMX, textures, or catalog images.

### Interface and error behavior

A small module-local function owns creation of the reusable module loader. Its
input is an injectable `importPlannerWorkspace` function for tests. Its output
is the named-component loader consumed by `next/dynamic`.

The function must:

- invoke the import exactly once for one host-module startup;
- return the same underlying module Promise to every loader invocation;
- select the existing named `PlannerWorkspace` export;
- preserve import rejection so the existing dynamic-component failure path
  still receives the original error;
- avoid a catch-and-ignore fallback or a second hidden import.

The production `ReactPlannerHost` effect, state initialization, performance
marks, props, and rendered JSX remain otherwise unchanged.

### Performance gate

Before editing the loader, create a fresh production build and record the
current-worktree baseline with the existing measurement script. Use the same
browser, static server, CDP endpoint, viewport, throttling, cache mode, and
sample count for the post-change run.

Required acceptance runs:

- mobile cold, Fast 4G, 3 samples;
- mobile warm, 3 samples;
- desktop cold, 3 samples;
- desktop warm, 3 samples.

The experiment is retained only when:

- all required editor marks are present;
- the mobile cold median is no greater than `2500 ms`;
- the mobile cold median is lower than the fresh baseline median;
- warm and desktop profiles do not exceed their existing script thresholds;
- the editor reaches interactive state and its primary controls still work.

If any condition fails, revert only this experiment. Do not automatically move
to default-map/TMX prefetching; report the measured result and stop this part.

## Part 2: lossless public preview images

### Source and derivative separation

The editor remains bound to each `PlannerMap.previewOutputPath` under
`/game-assets/1.6.15/`. Those source PNG paths are also retained for asset
synchronization and runtime compatibility.

Public SEO pages receive an independent `publicPreviewSource` derived from the
same approved preview path. The derivative lives outside the synchronized
`game-assets` tree so `assets:sync` cannot overwrite or delete it.

The mapping is deterministic and narrow:

```text
game-assets/1.6.15/<previewOutputPath>.png
    -> public-previews/1.6.15/<previewOutputPath>.webp
```

Only the 8 official farm previews and 21 Mod-card previews used by public pages
are generated. Other map-picker and editor previews are not copied or changed.

### Encoding contract

Each derivative must be encoded with exact lossless WebP. Generation fails
immediately when a source path is missing, is not a PNG, or cannot be decoded.

Verification compares every source/derivative pair for:

- width and height;
- decoded RGBA byte equality;
- alpha preservation;
- valid lossless WebP container;
- derivative byte count lower than its source, unless an explicitly reported
  exception is approved before keeping it.

The derived image files are versioned static artifacts. No new runtime or npm
dependency is introduced.

### Markup behavior

- farm-comparison and Mod-card images retain `loading="lazy"` and add
  `decoding="async"`;
- farm-guide hero images keep eager browser discovery and receive
  `fetchPriority="high"` only if the fresh production trace identifies that
  exact image as the LCP resource and the before/after trace improves or does
  not regress LCP;
- alt text, class names, DOM order, image display dimensions, CSS aspect
  ratios, and surrounding layout remain unchanged;
- no `next/image` migration is introduced because the project is a static
  export with image optimization disabled and the current public paths are
  registry-driven.

## Part 3: truthful structured data

### Site entity

The English root homepage emits one `WebSite` entity:

- `@context: "https://schema.org"`;
- `@type: "WebSite"`;
- stable `@id: "https://stardewvalleyplanner.art/#website"`;
- verified site `name` and canonical root `url`;
- `inLanguage: ["en", "zh-CN"]`.

The Chinese homepage does not create a competing Website identity. Its
application entity references the same stable Website `@id`.

### Web application entities

Both localized homepages keep `WebApplication` and add:

- a locale-specific stable `@id` based on the canonical page URL;
- `inLanguage` from the existing `PublicLocale` mapping;
- `isPartOf: { "@id": websiteId }`;
- `isAccessibleForFree: true`, backed by the visible free-tool copy and the
  lack of a paid access gate;
- `browserRequirements` with a narrow, truthful browser/JavaScript
  requirement.

Do not use `operatingSystem: "Web browser"`; Schema.org defines
`operatingSystem` for actual operating systems and provides
`browserRequirements` specifically for Web applications.

### Existing page entities

Existing `Article` and `CollectionPage` generators gain an explicit locale
input and emit the corresponding BCP 47 `inLanguage`. They may reference the
stable Website `@id` through `isPartOf`.

Official farm-guide Article entities additionally use the exact public preview
derivative as an absolute HTTPS `image` URL. The image is already visible on
the marked-up page and represents that farm guide.

BreadcrumbList item positions, names, and URLs remain unchanged.

### Permanent negative contract

Tests must reject accidental addition of repository-unverified values,
including:

- `author` or `reviewedBy`;
- `datePublished` or `dateModified`;
- `aggregateRating`, `review`, or interaction counts;
- `offers`, `price`, or `priceCurrency`;
- a publisher Person or Organization that has no corresponding verified
  visible identity.

The existing blog Article/CollectionPage entities may receive only the generic
locale/site relationship fields. Their robots and sitemap contracts do not
change.

## Test-driven implementation order

1. Record the fresh production performance and browser baseline before source
   changes.
2. Add focused failing tests for the reusable PlannerWorkspace module loader.
3. Implement the loader and run the four performance profiles; retain or
   revert it according to the gate.
4. Add failing asset/markup tests for public WebP paths, exact pair counts,
   loading behavior, and byte budgets.
5. Generate and independently verify the 29 lossless derivatives, then connect
   only the public preview-source boundary.
6. Add failing structured-data tests for Website identity, localized
   application/page entities, farm images, and forbidden invented fields.
7. Implement the schema changes through the existing generator interfaces and
   route call sites.
8. Run focused tests, typecheck, production build, full tests, static-artifact
   checks, and browser acceptance.
9. Restore build-generated `next-env.d.ts` noise if the build changes only its
   generated reference.
10. Report repository results. Cloudflare remains a later, separately
    authorized stage.

## Browser and artifact acceptance

Use the production static export, not the development server, for final
acceptance.

Desktop and `390x844` browser checks cover:

- `/` editor mount, interactivity, controls, and geometry;
- `/farm/standard` hero image, copy, links, and screenshot;
- `/farm-comparison` card images, lazy loading, and screenshot;
- `/mods` card images, lazy loading, and screenshot;
- absence of horizontal overflow or new layout shift.

Static artifact checks cover:

- all JSON-LD scripts parse from exported HTML;
- the root contains exactly one Website and one WebApplication;
- the Chinese root references the same Website identity;
- all 16 farm pages contain Article image URLs that match their visible WebP
  preview;
- all eight blog pages remain `noindex, follow`;
- sitemap has exactly 34 unique URLs and still contains all eight blog URLs.

## Cloudflare handoff

Only after the repository phase passes should the existing Cloudflare runbook
be used. HTTPS redirect, headers, edge caching, and production smoke failures
remain external configuration work. This design does not log in, deploy, or
change Cloudflare.
