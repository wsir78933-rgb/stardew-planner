# Truthful Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one stable Website identity, enrich localized page entities, and
attach real farm-preview images without inventing authorship, dates, ratings,
or commercial fields.

**Architecture:** Existing JSON-LD generators remain the only construction
boundary. Inputs gain an explicit `PublicLocale` and optional verified image;
all route call sites pass those values. The English root emits the Website
entity, while both localized WebApplications and page entities reference the
same stable Website ID.

**Tech Stack:** TypeScript, React, Next.js static export, JSON-LD, Schema.org,
Vitest.

## Global Constraints

- Work in the current workspace; do not create a worktree.
- Do not stage, commit, push, deploy, install dependencies, or modify
  Cloudflare.
- Do not change visible content, layout, metadata title/description,
  canonical, hreflang, robots, sitemap, or routing.
- All eight blog URLs remain `noindex, follow` and remain in the exact 34-URL
  sitemap.
- Do not add `author`, `reviewedBy`, `datePublished`, `dateModified`,
  `aggregateRating`, `review`, `offers`, `price`, `priceCurrency`, or an
  unverified publisher identity.
- Apply high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise
  naming. Every generator behavior starts with a focused failing test.

---

### Task 1: Extend the JSON-LD generator interface

**Files:**
- Modify: `src/seo/page-structured-data.ts`
- Modify: `tests/seo/page-structured-data.test.ts`

**Interfaces:**
- Produces: `createWebSiteStructuredData()` and locale-aware existing
  generator inputs
- Consumes: `PublicLocale`, canonical pathname, and optional image pathname

- [ ] **Step 1: Write Website and localized-entity RED tests**

Add literal expectations for:

```ts
expect(createWebSiteStructuredData()).toEqual({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://stardewvalleyplanner.art/#website",
  name: "Stardew Valley Planner",
  url: "https://stardewvalleyplanner.art",
  inLanguage: ["en", "zh-CN"],
});
```

Update the WebApplication fixture with `locale: "en"` and assert its exact
`@id`, `inLanguage`, `isPartOf`, `isAccessibleForFree: true`, and
`browserRequirements`. Update Article and CollectionPage fixtures with locale
and assert their language and Website relationship. Add an Article fixture
with an image pathname and expect an absolute HTTPS URL.

- [ ] **Step 2: Add the permanent negative RED contract**

For every generated entity, assert absence of the forbidden fields listed in
Global Constraints. For an Article without `imagePathname`, assert no `image`
property. This catches automatic fabrication or globally attaching an
unrelated image.

- [ ] **Step 3: Run RED**

```bash
pnpm exec vitest run tests/seo/page-structured-data.test.ts --no-file-parallelism
```

Expected: FAIL because the new Website generator and required locale/image
inputs do not exist.

- [ ] **Step 4: Implement minimal shared fields**

Add:

```ts
const publicWebsiteId = `${publicSiteUrl.toString()}#website`;

function createLocalizedCreativeWorkFields(locale: PublicLocale) {
  return {
    inLanguage: locale,
    isPartOf: { "@id": publicWebsiteId },
  } as const;
}
```

Because `publicSiteUrl.toString()` retains the root slash, the ID must be
exactly `https://stardewvalleyplanner.art/#website`. Keep this function
private and responsible only for the two shared fields.

Implement `createWebSiteStructuredData()` with the exact Task 1 literal.
Extend input types with required `locale: PublicLocale`; Article alone accepts
optional `imagePathname?: string` and canonicalizes it through
`createCanonicalUrl`.

WebApplication additionally emits:

```ts
"@id": `${createCanonicalUrl(input.pathname)}#webapplication`,
isAccessibleForFree: true,
browserRequirements: "Requires a modern web browser with JavaScript enabled.",
```

Do not add `operatingSystem` or `applicationCategory`.

- [ ] **Step 5: Run generator GREEN**

```bash
pnpm exec vitest run tests/seo/page-structured-data.test.ts --no-file-parallelism
```

Expected: the generator test passes; TypeScript call sites may still fail until
Task 2 supplies the new required locale.

### Task 2: Connect homepage Website and WebApplication entities

**Files:**
- Modify: `app/(en)/page.tsx`
- Modify: `app/zh/page.tsx`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interfaces:**
- Consumes: Task 1 generators
- Produces: one Website on `/`, one WebApplication on each localized homepage

- [ ] **Step 1: Write homepage JSON-LD RED assertions**

Update the static-page test parser to return every `application/ld+json`
script, not only the first. Assert the English homepage contains exactly one
Website and one WebApplication, the Chinese homepage contains exactly one
WebApplication and no competing Website, and both applications reference
`https://stardewvalleyplanner.art/#website`.

- [ ] **Step 2: Run RED**

```bash
pnpm exec vitest run tests/routes/static-public-pages.test.ts --no-file-parallelism
```

Expected: FAIL because the English homepage lacks Website and the applications
lack the new relationship fields.

- [ ] **Step 3: Connect the homepage entities**

English page:

```tsx
<JsonLdScript structuredData={createWebSiteStructuredData()} />
<JsonLdScript
  structuredData={createWebApplicationStructuredData({
    locale: "en",
    name: "Stardew Valley Farm Planner",
    description: plannerStructuredDataDescription,
    pathname: "/",
  })}
/>
```

Chinese page keeps one script but passes `locale: "zh-CN"`. Do not modify
visible components or metadata.

- [ ] **Step 4: Build before artifact GREEN**

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run tests/routes/static-public-pages.test.ts --no-file-parallelism
```

Expected: build and focused artifact test pass.

### Task 3: Localize existing page entities and add farm images

**Files:**
- Modify: all 12 existing Article/CollectionPage call-site files reported by
  `rg -l 'create(Article|CollectionPage)StructuredData' app`
- Modify: `app/(en)/farm/[type]/page.tsx`
- Modify: `app/zh/farm/[type]/page.tsx`
- Modify: relevant route tests

**Interfaces:**
- Consumes: required `locale` and public WebP `farmGuide.previewSource`
- Produces: localized existing entities and 16 farm Article image URLs

- [ ] **Step 1: Write route-level RED expectations**

For representative English and Chinese Article/CollectionPage routes, assert
the generator result has literal `inLanguage` and Website `@id`. For every
official farm and both locales, assert Article `image` equals the absolute URL
formed from the visible `farmGuide.previewSource`.

- [ ] **Step 2: Run RED**

```bash
pnpm exec vitest run tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts --no-file-parallelism
```

Expected: FAIL on missing locale inputs and farm image.

- [ ] **Step 3: Supply locale at every existing call site**

Pass literal `locale: "en"` or `locale: "zh-CN"` in every Article and
CollectionPage input. Do not derive locale from pathname and do not introduce a
route wrapper.

For farm pages only, add:

```ts
imagePathname: farmGuide.previewSource,
```

The Chinese page uses the same visible preview asset, so it passes the same
verified public pathname with `locale: "zh-CN"`.

- [ ] **Step 4: Run call-site GREEN**

```bash
pnpm typecheck
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run tests/seo/page-structured-data.test.ts tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts --no-file-parallelism
```

Expected: exit `0`.

### Task 4: Static contract and full SEO regression

**Files:**
- Modify only tests required to express the approved contract
- Update outside Git: SDD report and ledger

**Interfaces:**
- Consumes: built `out/`
- Produces: final JSON-LD, robots, and sitemap evidence

- [ ] **Step 1: Parse every exported JSON-LD script**

Run a Node audit over all `out/**/*.html`. It must `JSON.parse` every JSON-LD
script and fail with the HTML path plus script index on malformed output. Check
all schema URLs and IDs are absolute HTTPS URLs.

- [ ] **Step 2: Re-run indexability invariants**

```bash
pnpm exec vitest run tests/routes/sitemap-robots.test.ts tests/routes/public-route-metadata.test.ts tests/routes/static-public-pages.test.ts tests/scripts/production-seo-smoke.test.mjs --no-file-parallelism
```

Expected: 8 blog pages remain `noindex, follow`; sitemap remains exactly 34
unique URLs and includes all 8 blog URLs.

- [ ] **Step 3: Run complete repository verification**

```bash
pnpm typecheck
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run --no-file-parallelism
git diff --check
```

Expected: all commands exit `0`. Restore only build-generated
`next-env.d.ts` noise if present. Do not commit.
