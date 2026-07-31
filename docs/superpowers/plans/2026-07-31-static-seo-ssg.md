# Static Public-Page SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render every existing public information route as complete static HTML with correct discovery metadata, while leaving the homepage planner runtime unchanged.

**Architecture:** A small `src/seo/` layer owns the validated production origin, canonical paths, route metadata, and safe JSON-LD serialization. Static route files compose that layer with a public-page shell and native content components; only the homepage keeps `ReferenceRuntimeHost`. Discovery files consume the same canonical path registry, and build-artifact tests verify final `out/` HTML rather than only React markup.

**Tech Stack:** Next.js 16 App Router static export, React 19 Server Components, TypeScript, Vitest, CSS.

## Global Constraints

- Preserve the current 13 canonical English routes and use `https://stardewvalleyplanner.art` without trailing slashes.
- Do not create indexed Chinese routes or `hreflang` entries; the Chinese switch remains a local interface preference.
- Do not import or modify `ReferenceRuntimeHost`, `ReferenceRuntimeClientRoot`, `public/_app/**`, `public/reference-runtime/**`, or `src/reference-runtime/sync-reference-runtime.ts` for public-page rendering.
- Only the homepage planner workspace may mount `ReferenceRuntimeHost`.
- Keep Privacy and Terms as native static pages using the current browser-local product wording.
- Do not overwrite, recreate, or format the user-owned `main` changes to `app/globals.css` and `tests/homepage/homepage-style-contract.test.ts`; this isolated branch starts before those changes.
- No deployment-provider TLS, redirect, response-header, CDN, compression, cache, IndexNow, or social-image work belongs in this change.
- Every new behavior starts with a focused failing test. Never add production code before the associated RED test is observed.
- Run build and artifact checks serially. The existing full test suite requires a pre-existing `out/` directory.
- Do not stage, commit, merge, push, or change the user’s Git history. Source-control writes were not authorized.

---

### Task 1: Create site identity, metadata, and JSON-LD primitives

**Files:**
- Create: `src/seo/public-site-url.ts`
- Create: `src/seo/canonical-public-routes.ts`
- Create: `src/seo/page-metadata.ts`
- Create: `src/seo/page-structured-data.ts`
- Create: `src/components/json-ld-script.tsx`
- Create: `tests/seo/public-site-url.test.ts`
- Create: `tests/seo/canonical-public-routes.test.ts`
- Create: `tests/seo/page-metadata.test.ts`
- Create: `tests/seo/page-structured-data.test.ts`
- Create: `tests/components/json-ld-script.test.tsx`

**Interfaces:**
- Consumes: `officialFarmTypes` from `src/reference/official-farm-guides.ts`.
- Produces: `createPublicSiteUrl(siteUrlValue: string): URL`, `publicSiteUrl`, `createCanonicalUrl(pathname: string): string`, `canonicalPublicPaths`, `createPublicPageMetadata(input): Metadata`, structured-data builders, and `JsonLdScript`.
- Later tasks consume only these public exports; route files must not repeat the domain or construct canonical URLs themselves.

- [ ] **Step 1: Write failing URL and canonical-path tests**

```ts
import { describe, expect, it } from "vitest";
import {
  createCanonicalUrl,
  createPublicSiteUrl,
  publicSiteUrl,
} from "../../src/seo/public-site-url";
import { canonicalPublicPaths } from "../../src/seo/canonical-public-routes";

describe("public site URL", () => {
  it("uses the confirmed HTTPS origin without a path suffix", () => {
    expect(publicSiteUrl.href).toBe("https://stardewvalleyplanner.art/");
    expect(createCanonicalUrl("/farm/standard")).toBe(
      "https://stardewvalleyplanner.art/farm/standard",
    );
  });

  it("rejects a site URL with a path, query, fragment, or non-HTTPS protocol", () => {
    expect(() => createPublicSiteUrl("https://stardewvalleyplanner.art/site"))
      .toThrow("site URL must not include a pathname");
    expect(() => createPublicSiteUrl("http://stardewvalleyplanner.art"))
      .toThrow("site URL must use HTTPS");
  });
});

it("derives eight guide paths without planner query URLs", () => {
  expect(canonicalPublicPaths).toHaveLength(13);
  expect(canonicalPublicPaths).toContain("/farm/meadowlands");
  expect(canonicalPublicPaths).not.toContain("/?farmType=standard");
});
```

- [ ] **Step 2: Run the URL and route tests to verify RED**

Run: `pnpm vitest run tests/seo/public-site-url.test.ts tests/seo/canonical-public-routes.test.ts`

Expected: FAIL because the SEO modules do not exist.

- [ ] **Step 3: Implement the URL and canonical-path modules**

```ts
const configuredPublicSiteUrl = "https://stardewvalleyplanner.art";

export function createPublicSiteUrl(siteUrlValue: string): URL {
  const parsedSiteUrl = new URL(siteUrlValue);

  if (parsedSiteUrl.protocol !== "https:") {
    throw new Error(`Public site URL must use HTTPS. Received: ${JSON.stringify(siteUrlValue)}.`);
  }
  if (parsedSiteUrl.pathname !== "/") {
    throw new Error(`Public site URL must not include a pathname. Received: ${JSON.stringify(siteUrlValue)}.`);
  }
  if (parsedSiteUrl.search !== "" || parsedSiteUrl.hash !== "") {
    throw new Error(`Public site URL must not include a query or fragment. Received: ${JSON.stringify(siteUrlValue)}.`);
  }

  return parsedSiteUrl;
}

export const publicSiteUrl = createPublicSiteUrl(configuredPublicSiteUrl);

export function createCanonicalUrl(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) {
    throw new Error(`Canonical pathname must start with "/" and contain no query or fragment. Received: ${JSON.stringify(pathname)}.`);
  }

  return new URL(pathname, publicSiteUrl).toString().replace(/\/$/, "");
}
```

Create `canonicalPublicPaths` from five fixed non-farm paths plus
`officialFarmTypes.map((farmType) => \`/farm/${farmType}\`)`. Validate at module
initialization that the paths are unique and query/hash-free; a duplicate error
must include the duplicate pathname.

- [ ] **Step 4: Run the URL and route tests to verify GREEN**

Run: `pnpm vitest run tests/seo/public-site-url.test.ts tests/seo/canonical-public-routes.test.ts`

Expected: PASS.

- [ ] **Step 5: Write failing metadata and JSON-LD tests**

```ts
import { expect, it } from "vitest";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { serializeJsonLd } from "../../src/seo/page-structured-data";

it("creates absolute canonical metadata with a route description", () => {
  const metadata = createPublicPageMetadata({
    pathname: "/mods",
    title: "Modded Stardew Valley Farms",
    description: "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  });

  expect(metadata.alternates?.canonical).toBe(
    "https://stardewvalleyplanner.art/mods",
  );
  expect(metadata.description).toBe(
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  );
});

it("escapes a script-closing sequence in JSON-LD", () => {
  expect(serializeJsonLd({ label: "</script><p>unsafe" })).toContain(
    "\\u003c/script>",
  );
});
```

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { JsonLdScript } from "../../src/components/json-ld-script";

it("renders one application JSON-LD script", () => {
  const markup = renderToStaticMarkup(
    <JsonLdScript structuredData={{ "@context": "https://schema.org", "@type": "WebApplication" }} />,
  );

  expect(markup).toContain('type="application/ld+json"');
  expect(markup).toContain("WebApplication");
});
```

- [ ] **Step 6: Run metadata and JSON-LD tests to verify RED**

Run: `pnpm vitest run tests/seo/page-metadata.test.ts tests/seo/page-structured-data.test.ts tests/components/json-ld-script.test.tsx`

Expected: FAIL because the metadata builder, serializer, and component do not exist.

- [ ] **Step 7: Implement metadata and JSON-LD primitives**

```ts
export type PublicPageMetadataInput = Readonly<{
  pathname: string;
  title: string;
  description: string;
  openGraphType?: "article" | "website";
}>;
```

`createPublicPageMetadata` must use `createCanonicalUrl(input.pathname)` once
for `alternates.canonical` and `openGraph.url`; it must set `title`,
`description`, `openGraph.title`, `openGraph.description`, `openGraph.type`,
`twitter.card: "summary"`, `twitter.title`, and `twitter.description`. Do not
add image URLs.

Implement `serializeJsonLd(structuredData: Record<string, unknown>): string`
as `JSON.stringify(structuredData).replaceAll("<", "\\u003c")`. Implement
`JsonLdScript` with one `script` element whose `dangerouslySetInnerHTML` uses
that serializer. Add pure builders named
`createWebApplicationStructuredData`, `createArticleStructuredData`,
`createCollectionPageStructuredData`, and `createBreadcrumbListStructuredData`.
Each accepts explicitly named visible fields and must not create rating, offer,
author, or image fields.

- [ ] **Step 8: Run metadata and JSON-LD tests to verify GREEN**

Run: `pnpm vitest run tests/seo/page-metadata.test.ts tests/seo/page-structured-data.test.ts tests/components/json-ld-script.test.tsx`

Expected: PASS.

- [ ] **Step 9: Check task diff and leave it uncommitted**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

---

### Task 4: Generate crawler-discovery files and verify the complete static contract

**Files:**
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `tests/routes/sitemap-robots.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interfaces:**
- Consumes: Task 1 `canonicalPublicPaths`, `createCanonicalUrl`, and `publicSiteUrl`; Task 3 build output.
- Produces: static `out/robots.txt`, `out/sitemap.xml`, and a full artifact-level contract for the 13 public pages.
- No later task owns another URL list; canonical paths are the sole source of truth.

- [ ] **Step 1: Write failing robots and sitemap tests**

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { canonicalPublicPaths } from "../../src/seo/canonical-public-routes";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("writes robots.txt with the absolute sitemap URL", () => {
  const robotsText = readFileSync(join(process.cwd(), "out", "robots.txt"), "utf8");
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain("Sitemap: https://stardewvalleyplanner.art/sitemap.xml");
});

it("writes exactly the canonical public URLs into sitemap.xml", () => {
  const sitemapText = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
  const sitemapUrlCount = (sitemapText.match(/<loc>/g) ?? []).length;

  expect(sitemapUrlCount).toBe(canonicalPublicPaths.length);
  for (const canonicalPublicPath of canonicalPublicPaths) {
    expect(sitemapText).toContain(`<loc>${createCanonicalUrl(canonicalPublicPath)}</loc>`);
  }
  expect(sitemapText).not.toContain("farmType=");
});
```

- [ ] **Step 2: Build and run discovery tests to verify RED**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm build`

Run: `pnpm vitest run tests/routes/sitemap-robots.test.ts`

Expected: FAIL because `out/robots.txt` and `out/sitemap.xml` do not exist.

- [ ] **Step 3: Implement metadata routes from the canonical registry**

Implement `app/robots.ts` as a Next metadata route that returns `rules` for
all crawlers with `allow: "/"` and uses `createCanonicalUrl("/sitemap.xml")`
for its sitemap. Implement `app/sitemap.ts` as a metadata route mapping every
`canonicalPublicPaths` entry to `{ url: createCanonicalUrl(pathname) }`.
Do not set `lastModified`; this repository has no verified per-route dates.

Extend the static artifact test to assert `out/robots.txt` and
`out/sitemap.xml` exist after the same prebuilt output used for page checks.

- [ ] **Step 4: Build and run discovery tests to verify GREEN**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm build`

Run: `pnpm vitest run tests/routes/sitemap-robots.test.ts tests/routes/static-public-pages.test.ts`

Expected: PASS.

- [ ] **Step 5: Run complete repository verification serially**

Run these commands in this exact order:

1. `pnpm typecheck`
2. `NEXT_TELEMETRY_DISABLED=1 pnpm build`
3. `pnpm test -- --run`
4. `pnpm vitest run tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts`
5. `git diff --check`

Expected: typecheck, full tests, production build, artifact tests, and diff
check all pass. Do not stage or commit.

- [ ] **Step 6: Run local HTTP and browser checks**

Start `pnpm exec serve out -l 4173` in the isolated worktree. Verify HTTP 200
for `/`, `/farm-comparison`, `/farm/standard`, `/mods`, `/privacy`, `/terms`,
`/robots.txt`, and `/sitemap.xml`; verify a fabricated route returns 404.

At desktop and 390×844 widths, inspect `/farm-comparison`, `/farm/standard`,
`/mods`, `/privacy`, and `/terms`. Confirm readable scrolling, visible
navigation, no horizontal page overflow, no bare layout, working planner
links, and no planner runtime or console error on information pages.

- [ ] **Step 7: Check final diff and leave it uncommitted**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

---

### Task 3: Replace public-route runtime hosts with static page output

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/farm-comparison/page.tsx`
- Modify: `app/mods/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/farm/[type]/page.tsx`
- Create: `tests/routes/public-route-metadata.test.ts`
- Create: `tests/routes/static-public-pages.test.ts`

**Interfaces:**
- Consumes: Task 1 metadata and JSON-LD exports; Task 2 shell and legal-content exports; `officialFarmGuides`, `getOfficialFarmGuide`, and `isOfficialFarmType`.
- Produces: 13 SSG pages. None of the 12 information routes import `ReferenceRuntimeHost`.
- Task 4 consumes their generated `out/` files.

- [ ] **Step 1: Write failing route-metadata and static-artifact tests**

`tests/routes/public-route-metadata.test.ts` imports page metadata exports and
asserts exact canonical values:

```ts
expect(farmComparisonMetadata.alternates?.canonical).toBe(
  "https://stardewvalleyplanner.art/farm-comparison",
);
expect(modsMetadata.alternates?.canonical).toBe(
  "https://stardewvalleyplanner.art/mods",
);
expect(await generateMetadata({ params: Promise.resolve({ type: "standard" }) }))
  .toMatchObject({
    alternates: {
      canonical: "https://stardewvalleyplanner.art/farm/standard",
    },
  });
```

`tests/routes/static-public-pages.test.ts` only reads a prebuilt `out/`; it
must not start a build. Define these exact expectations:

```ts
const staticPublicPageExpectations = [
  ["index.html", "Plan a farm", "WebApplication"],
  ["farm-comparison.html", "Stardew Valley Farm Types Compared", "Quick comparison"],
  ["mods.html", "Modded Stardew Valley Farms", "Available community farms"],
  ["privacy.html", "Privacy Policy", "There is no account or sign-in."],
  ["terms.html", "Terms of Service", "There is no account or sign-in."],
  ...officialFarmTypes.map((farmType) => [
    `farm/${farmType}.html`,
    officialFarmGuides[farmType].title,
    "What makes it different",
  ]),
] as const;
```

For each file assert one `<h1`, `aria-label="Public navigation"`, a
`<meta name="description"`, the expected absolute canonical URL, and no
`BAILOUT_TO_CLIENT_SIDE_RENDERING`, `reference-runtime-root`, or
`/reference-runtime/bootstrap.mjs`. The homepage only requires its canonical,
description, and `WebApplication` JSON-LD; the other twelve require public
navigation and no planner runtime strings.

- [ ] **Step 2: Build and run the route tests to verify RED**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm build`

Run: `pnpm vitest run tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts`

Expected: FAIL because metadata exports are absent and 12 information-page
artifacts lack headings, description, canonical metadata, and static text.

- [ ] **Step 3: Implement root defaults and static page routes**

Set root `metadataBase` from `publicSiteUrl`. Keep `/favicon.ico`; use default
description `Plan Stardew Valley farm layouts in your browser with an interactive map.`

Add root-page metadata with pathname `/`, title `Stardew Valley Farm Planner`,
and that exact description. Render `JsonLdScript` next to `PlannerHomepage`
with only `WebApplication` data; do not move the planner runtime.

For each information route, export a named metadata constant and render
`PublicPageShell` around static content. Use these exact headers and descriptions:

| Route | `h1` | Description | JSON-LD |
|---|---|---|---|
| `/farm-comparison` | `Stardew Valley Farm Types Compared` | `Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.` | `Article` |
| `/mods` | `Modded Stardew Valley Farms` | `Browse local planning maps for community-made Stardew Valley farms and interiors.` | `CollectionPage` |
| `/privacy` | supplied by `privacyDocument` | `Learn how this browser-local planner handles projects, preferences, and local data.` | none |
| `/terms` | supplied by `termsDocument` | `Read the terms for this browser-local Stardew Valley farm planning tool.` | none |

The comparison and Mods headers include a one-sentence paragraph matching
their description. Farm routes retain `generateStaticParams` and
`dynamicParams = false`; resolve through `getOfficialFarmGuide`, call
`notFound()` if it returns `undefined`, calculate siblings by filtering
`officialFarmTypes`, and generate metadata with title
`\`${farmGuide.title} | Stardew Valley Farm Planner\`` and description
`\`${farmGuide.title} farm guide. ${farmGuide.bestFor}\``. Render an `Article`
JSON-LD and `BreadcrumbList` JSON-LD using visible farm title and canonical URL.

Remove all `ReferenceRuntimeHost` imports from information routes.

- [ ] **Step 4: Build and run route tests to verify GREEN**

Run: `NEXT_TELEMETRY_DISABLED=1 pnpm build`

Run: `pnpm vitest run tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts`

Expected: PASS.

- [ ] **Step 5: Check task diff and leave it uncommitted**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.

---

### Task 2: Build native public-page structure, legal content, and isolated styling

**Files:**
- Create: `src/components/public-page-shell.tsx`
- Create: `src/components/legal-page-content.tsx`
- Create: `src/reference/legal-pages.ts`
- Modify: `app/globals.css`
- Create: `tests/components/public-page-shell.test.tsx`
- Create: `tests/components/legal-page-content.test.tsx`
- Create: `tests/reference/legal-pages.test.ts`
- Create: `tests/routes/public-page-style-contract.test.ts`

**Interfaces:**
- Consumes: `PublicNavigation` and the existing farm/Mods body component class names.
- Produces: `PublicPageShell({ children: ReactNode })`, `LegalPageContent({ document: LegalDocument })`, `privacyDocument`, and `termsDocument`.
- Later route tasks compose these public exports and never read legal text from `sync-reference-runtime.ts`.

- [ ] **Step 1: Write failing shell and legal-content tests**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { LegalPageContent } from "../../src/components/legal-page-content";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { privacyDocument } from "../../src/reference/legal-pages";

it("renders a shared static navigation frame around route content", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell><h1>Example route</h1></PublicPageShell>,
  );

  expect(markup).toContain('data-public-page-shell="true"');
  expect(markup).toContain('aria-label="Public navigation"');
  expect(markup).toContain("Example route");
  expect(markup).toContain("Privacy");
});

it("renders browser-local privacy sections without obsolete online services", () => {
  const markup = renderToStaticMarkup(<LegalPageContent document={privacyDocument} />);

  expect(markup).toContain("There is no account or sign-in.");
  expect(markup).toContain("Projects stay in this browser.");
  expect(markup).not.toMatch(/Ko-fi|Cloudflare|Plausible/i);
});
```

- [ ] **Step 2: Run the shell and legal-content tests to verify RED**

Run: `pnpm vitest run tests/components/public-page-shell.test.tsx tests/components/legal-page-content.test.tsx tests/reference/legal-pages.test.ts`

Expected: FAIL because the shell, legal data, and legal renderer do not exist.

- [ ] **Step 3: Implement native shell and legal documents**

Use these interfaces exactly:

```ts
export type LegalSection = Readonly<{
  heading: string;
  paragraphs: readonly string[];
}>;

export type LegalDocument = Readonly<{
  title: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
}>;
```

Create `privacyDocument` with `title: "Privacy Policy"`, `lastUpdated:
"Last updated: July 27, 2026"`, and these section/paragraph pairs, in order:

```ts
[
  ["What we collect", "There is no account or sign-in."],
  ["Farm data", "Projects stay in this browser."],
  ["Payments", "There is no cloud sync, share links, payments, memberships, or supporter features."],
  ["Analytics", "This browser-local product does not provide analytics or tracking services."],
  ["Cookies", "This browser-local product does not use sign-in cookies."],
  ["Third parties", "Projects are not sent to a cloud service or shared with third parties."],
  ["Data deletion", "You can delete local data by deleting projects or clearing this site's data in your browser."],
  ["Local use", "JSON import and export happen only when you choose them."],
]
```

Create `termsDocument` with `title: "Terms of Service"`, `lastUpdated:
"Last updated: July 27, 2026"`, and these section/paragraph pairs, in order:

```ts
[
  ["What this is", "Stardew Planner is a browser-local fan-made tool for planning farm layouts in Stardew Valley. Projects stay in this browser. It is not affiliated with or endorsed by ConcernedApe or Stardew Valley."],
  ["Accounts", "There is no account or sign-in."],
  ["Online features", "There is no cloud sync, share links, payments, memberships, or supporter features."],
  ["Your data", "JSON import and export happen only when you choose them. You can delete local data by deleting projects or clearing this site's data in your browser."],
  ["Availability", "The product is provided as-is with no uptime guarantees."],
  ["Game assets", "Stardew Valley game assets are the property of ConcernedApe. They are used here for this fan-made planning tool."],
  ["Local use", "This browser-local product does not provide contact or support features."],
]
```

`PublicPageShell` renders a top-level `<div data-public-page-shell>`, a brand
link to `/`, `PublicNavigation`, a `<main>` around `children`, and a footer
containing `© Stardew Valley Farm Planner`. `LegalPageContent` renders one
`header` containing its `h1` and last-updated paragraph, then one `section`
per document section using an `h2`. Use each unique section heading as its React key.

- [ ] **Step 4: Add scoped CSS and stable image-layout rules**

Append CSS scoped exclusively to `[data-public-page-shell]`. It must set a
light background, `color: #1c211b`, `font-family: Arial, Helvetica, sans-serif`,
`height: 100dvh`, `overflow-y: auto`, and `overflow-x: hidden`. Add concrete
rules for the shell header/navigation/footer, `.public-page-header`,
`.public-breadcrumbs`, `.farm-guide-hero`, `.farm-comparison-card`,
`.farm-comparison-table-scroll`, `.mod-farm-card`, `.public-primary-cta`,
`.public-secondary-cta`, `.legal-page-section`, and image selectors already
used by the three content components. Image containers use a stable
`aspect-ratio`; image selectors use `display: block`, `height: 100%`,
`object-fit: contain`, and `width: 100%`. Add a `max-width: 700px` rule that
collapses the hero/cards to one column and preserves horizontally scrollable
tables. Scoped links require a visible two-pixel `:focus-visible` outline.

Do not alter `body.stardew-homepage` selectors or global `html, body` values.

- [ ] **Step 5: Write and run the public-style contract to verify GREEN**

The style contract reads `app/globals.css` and asserts the public shell scope,
scrolling rule, `aspect-ratio`, mobile breakpoint, and `:focus-visible` rule;
it also asserts the file has not introduced `body.stardew-homepage` changes.

Run: `pnpm vitest run tests/components/public-page-shell.test.tsx tests/components/legal-page-content.test.tsx tests/reference/legal-pages.test.ts tests/routes/public-page-style-contract.test.ts`

Expected: PASS.

- [ ] **Step 6: Check task diff and leave it uncommitted**

Run: `git diff --check`

Expected: no whitespace errors. Do not stage or commit.
