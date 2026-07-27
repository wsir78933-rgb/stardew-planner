# Stardew Planner i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a real English-default and Simplified-Chinese `/zh` static site, with a native React planner, static SEO metadata, and a strict non-destructive local-project migration.

**Architecture:** Keep `output: "export"` and make language an explicit build-time input. The bare-English route group and physical `zh` route tree render shared locale-aware screens through small public interfaces. Keep gameplay identifiers and state schema locale-free; render translated display values at the UI boundary. Migrate the frozen runtime's storage only through a pure converter and one atomic V2 storage write.

**Tech Stack:** Next.js 16 App Router static export, React 19, TypeScript, next-intl 4, Vitest, Pixi 8, pnpm.

## Global Constraints

- The canonical host is exactly `https://stardewvalleyplanner.art`.
- English routes are unprefixed; Simplified Chinese uses only `/zh`; never generate `/en`.
- Keep `output: "export"`; do not add proxy, middleware, redirects, rewrites, cookies, request locale detection, `defineRouting`, `createMiddleware`, `pathnames`, or `next-intl/navigation`.
- `next-intl` is restricted to explicit messages, `NextIntlClientProvider`, `useTranslations`, and explicit `createTranslator` calls.
- Preserve stable IDs, `mapFile`, TMX, sprites, asset paths, catalog JSON schemas, and user-entered project/map names exactly.
- Frozen runtime files and locked assets remain in the repository, but no production route may start the frozen runtime bootstrap.
- The frozen key `stardewplan-reference-local-projects-v1` is read-only. A migration writes only `stardew-planner.local-projects.v2`, exactly once after all conversions and V2 validation succeed.
- Any field that cannot be represented losslessly rejects the whole frozen-project collection; no truncation, dropping fields, guessing, partial writes, or source-key mutation.
- Each function has one responsibility; modules communicate through exported types/functions; invalid boundary values throw errors containing the received value.
- Use strict red-green-refactor TDD. Do not commit, push, or deploy in this task.

---

## File structure and ownership

| Area | Files | Responsibility |
| --- | --- | --- |
| Locale contract | `src/i18n/locales.ts`, `localized-path.ts`, `messages.ts`, `static-locale-provider.tsx` | Explicit locales, validated messages, safe URL conversion, provider boundary. |
| Locale UI | `localized-link.tsx`, `language-switcher.tsx`, `page-metadata.ts`, `content.ts` | Navigation, language switch, metadata and display-copy interfaces. |
| Public screens | `src/components/public-page-layout.tsx`, locale-aware `farm-*`, `mod-*`, `public-navigation`, `legal-content` | Render public content without parsing routes or reading storage. |
| Planner | `src/components/planner-workspace.tsx`, `src/planner/*` | Coordinate existing canvas/controllers/panels and local project lifecycle. |
| Migration | `src/projects/reference-local-project-catalog-mapping.ts`, `reference-local-project-migration.ts`, `reference-local-project-storage-migration.ts` | Version-locked mapping manifest, pure frozen-to-V2 conversion and atomic browser-storage orchestration. |
| Static routes | `app/(en)/**`, `app/zh/**`, `app/robots.ts`, `app/sitemap.ts` | Physical static output and explicit per-locale metadata. |

## Required execution order

Execute numbered tasks strictly in this order: 1, 2, 3, 4, 5, 6, 7, 8, 9. Task 8 is intentionally documented before Tasks 4–7 because its route-file inventory is the primary route reference; it must not be dispatched until Tasks 4–7 are complete.

### Task 1: Install next-intl and establish explicit locale primitives

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`
- Create: `messages/en.json`, `messages/zh-CN.json`
- Create: `src/i18n/locales.ts`, `src/i18n/messages.ts`, `src/i18n/localized-path.ts`, `src/i18n/static-locale-provider.tsx`
- Test: `tests/i18n/locales.test.ts`, `tests/i18n/localized-path.test.ts`, `tests/i18n/messages.test.ts`

**Interfaces:**
- Produces `SiteLocale = "en" | "zh-CN"`, `getLocalizedPath(locale, canonicalPath, search?, hash?)`, `getCanonicalPath(locale, localizedPath)`, `getSiteMessages(locale)`, and `StaticLocaleProvider`.
- Consumes only literal canonical paths beginning with `/`; it must not import App Router modules or storage modules.

- [ ] **Step 1: Write failing path and message-key tests**

```ts
expect(getLocalizedPath("en", "/farm/standard", "farmType=beach", "map")).toBe(
  "/farm/standard?farmType=beach#map",
);
expect(getLocalizedPath("zh-CN", "/")).toBe("/zh");
expect(() => getLocalizedPath("zh-CN", "farm/standard")).toThrow(
  'canonical path "farm/standard" must start with "/"',
);
expect(getMessageKeyPaths(enMessages)).toEqual(getMessageKeyPaths(zhMessages));
```

- [ ] **Step 2: Run the i18n tests and confirm they fail because the modules do not exist**

Run: `pnpm test --run tests/i18n/locales.test.ts tests/i18n/localized-path.test.ts tests/i18n/messages.test.ts`

- [ ] **Step 3: Add the dependency and smallest locale/message implementation**

Run: `pnpm add next-intl@^4.13.4`

```ts
export const siteLocales = ["en", "zh-CN"] as const;
export function getLocalizedPath(locale: SiteLocale, canonicalPath: string, search = "", hash = ""): string {
  assertCanonicalPath(canonicalPath);
  const localizedPath = locale === "en" ? canonicalPath : canonicalPath === "/" ? "/zh" : `/zh${canonicalPath}`;
  return `${localizedPath}${normalizeSearch(search)}${normalizeHash(hash)}`;
}
```

`messages.ts` must deep-compare leaf-key paths, reject non-string leaves, and return the JSON for the explicit locale. `StaticLocaleProvider` must call `<NextIntlClientProvider locale={locale} messages={messages}>` with caller-supplied values.

- [ ] **Step 4: Re-run the i18n tests and typecheck**

Run: `pnpm test --run tests/i18n/locales.test.ts tests/i18n/localized-path.test.ts tests/i18n/messages.test.ts && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- package.json pnpm-lock.yaml messages src/i18n tests/i18n`

### Task 2: Add locale-aware links, language switching, and deterministic SEO metadata

**Files:**
- Create: `src/i18n/localized-link.tsx`, `src/i18n/language-switcher.tsx`, `src/i18n/page-metadata.ts`
- Test: `tests/i18n/localized-link.test.tsx`, `tests/i18n/language-switcher.test.tsx`, `tests/i18n/page-metadata.test.ts`

**Interfaces:**
- Consumes Task 1's `SiteLocale`, messages and path functions.
- Produces `<LocalizedLink locale canonicalPath search? hash?>`, `<LanguageSwitcher locale canonicalPath search? hash?>`, and `createPageMetadata({locale, canonicalPath, titleKey, descriptionKey})`.

- [ ] **Step 1: Write failing behavior tests**

```tsx
render(<LanguageSwitcher locale="zh-CN" canonicalPath="/farm/standard" search="farmType=beach" />);
expect(screen.getByRole("link", {name: /English/i})).toHaveAttribute(
  "href", "/farm/standard?farmType=beach",
);

expect(createPageMetadata({locale: "zh-CN", canonicalPath: "/mods", titleKey: "seo.mods.title", descriptionKey: "seo.mods.description"}).alternates?.canonical)
  .toBe("https://stardewvalleyplanner.art/zh/mods");
```

- [ ] **Step 2: Run the focused tests and confirm they fail because components/functions are absent**

Run: `pnpm test --run tests/i18n/localized-link.test.tsx tests/i18n/language-switcher.test.tsx tests/i18n/page-metadata.test.ts`

- [ ] **Step 3: Implement the UI and metadata boundary**

```ts
export function createPageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteSiteUrl(getLocalizedPath(input.locale, input.canonicalPath));
  const alternateUrls = getAlternateUrls(input.canonicalPath);
  return {
    title: translate(input.locale, input.titleKey),
    description: translate(input.locale, input.descriptionKey),
    alternates: {canonical: canonicalUrl, languages: alternateUrls},
    openGraph: {url: canonicalUrl, title: translate(input.locale, input.titleKey)},
  };
}
```

The language switcher must render a normal `next/link` URL from `getLocalizedPath`; it must not infer locale from the request.

- [ ] **Step 4: Run the focused tests and typecheck**

Run: `pnpm test --run tests/i18n/localized-link.test.tsx tests/i18n/language-switcher.test.tsx tests/i18n/page-metadata.test.ts && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/i18n tests/i18n`

### Task 3: Provide translated display data and locale-aware public components

**Files:**
- Create: `src/i18n/public-content.ts`, `src/components/public-page-layout.tsx`, `src/components/legal-content.tsx`
- Modify: `src/components/public-navigation.tsx`, `src/components/farm-comparison-content.tsx`, `src/components/farm-guide-content.tsx`, `src/components/mod-map-card-grid.tsx`
- Test: `tests/i18n/public-content.test.ts`, `tests/components/public-farm-pages.test.tsx`, `tests/components/public-navigation.test.tsx`, `tests/components/legal-content.test.tsx`

**Interfaces:**
- Consumes `SiteLocale`, `LocalizedLink`, `LanguageSwitcher`, fixed map/reference IDs, and Task 1 message lookup.
- Produces `getLocalizedOfficialFarmGuide(locale, farmType)`, `getLocalizedModFarmCards(locale)`, `getLocalizedPlannerMapName(locale, mapId)`, and public components accepting an explicit `locale` prop.

- [ ] **Step 1: Write failing public-content tests**

```tsx
render(<FarmGuideContent locale="zh-CN" farmType="standard" />);
expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("标准农场");
expect(screen.getByRole("link", {name: /规划此农场/i})).toHaveAttribute("href", "/zh?farmType=standard");

expect(getLocalizedPlannerMapName("zh-CN", "standard")).toBe("标准农场");
expect(getPlannerMapById("standard").mapFile).toBe("Farm.tmx");
```

- [ ] **Step 2: Run the public component tests and confirm the new locale prop/content functions are missing**

Run: `pnpm test --run tests/i18n/public-content.test.ts tests/components/public-farm-pages.test.tsx tests/components/public-navigation.test.tsx tests/components/legal-content.test.tsx`

- [ ] **Step 3: Implement display adapters and explicit-locale rendering**

Keep `officialFarmGuides`, `plannerMaps`, and mod IDs as English domain data. Put translated prose, labels, accessible names, and legal paragraphs in the messages/public-content adapter. Replace every public root-relative `<a>` with `LocalizedLink`, passing a canonical path and explicit locale.

- [ ] **Step 4: Re-run the public component tests and typecheck**

Run: `pnpm test --run tests/i18n/public-content.test.ts tests/components/public-farm-pages.test.tsx tests/components/public-navigation.test.tsx tests/components/legal-content.test.tsx && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/components src/i18n tests/components tests/i18n`

### Task 8: Convert App Router output to physical English and Chinese static route trees

**Files:**
- Delete: `app/layout.tsx`, `app/page.tsx`, `app/farm-comparison/page.tsx`, `app/farm/[type]/page.tsx`, `app/mods/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`
- Create: `app/(en)/layout.tsx`, `app/(en)/page.tsx`, `app/(en)/farm-comparison/page.tsx`, `app/(en)/farm/[type]/page.tsx`, `app/(en)/mods/page.tsx`, `app/(en)/privacy/page.tsx`, `app/(en)/terms/page.tsx`
- Create: matching `app/zh/**` files, `app/robots.ts`, `app/sitemap.ts`
- Modify: `tests/routes/static-routes.test.ts`, `tests/routes/planner-editor-page.test.tsx`
- Create: `tests/routes/locale-routes.test.ts`, `tests/routes/seo-metadata.test.ts`, `tests/routes/sitemap-robots.test.ts`

**Interfaces:**
- Consumes public components and metadata from Tasks 1–3 plus the native localized planner from Tasks 6–7.
- Produces static English paths and `/zh` paths, with `generateStaticParams()` for the eight official farm types in each locale tree.

- [ ] **Step 1: Write failing output and metadata tests**

```ts
expect(readStaticPageHtml("zh.html")).toContain('<html lang="zh-CN"');
expect(readStaticPageHtml("zh/farm/standard.html")).toContain("标准农场");
expect(existsSync(join(process.cwd(), "out", "en.html"))).toBe(false);
expect(readSitemapUrls()).toHaveLength(26);
expect(readStaticPageHtml("farm/standard.html")).not.toContain("reference-runtime/bootstrap.mjs");
```

- [ ] **Step 2: Run the route tests and confirm that `/zh` output and native markup are absent**

Run: `pnpm test --run tests/routes/locale-routes.test.ts tests/routes/seo-metadata.test.ts tests/routes/sitemap-robots.test.ts tests/routes/static-routes.test.ts`

- [ ] **Step 3: Implement the two explicit route trees**

Each locale tree must use one root layout:

```tsx
export default function ChineseRootLayout({children}: Readonly<{children: ReactNode}>) {
  return <html lang="zh-CN"><body><StaticLocaleProvider locale="zh-CN">{children}</StaticLocaleProvider></body></html>;
}
```

Each page calls `createPageMetadata` with a literal locale and canonical path. `sitemap.ts` iterates the 13 canonical paths and two `SiteLocale` values, emitting language alternates `en`, `zh-CN`, and `x-default` (English). `robots.ts` sets `host` and `sitemap` to the canonical apex URLs.

- [ ] **Step 4: Re-run focused route tests, then build**

Run: `pnpm test --run tests/routes/locale-routes.test.ts tests/routes/seo-metadata.test.ts tests/routes/sitemap-robots.test.ts tests/routes/static-routes.test.ts && pnpm build`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- app tests/routes`

### Task 4: Implement strict frozen-runtime to V2 project conversion

**Files:**
- Create: `src/projects/reference-local-project-catalog-mapping.ts`
- Create: `src/projects/reference-local-project-migration.ts`
- Test: `tests/projects/reference-local-project-migration.test.ts`
- Test: `tests/projects/reference-local-project-catalog-mapping.test.ts`
- Modify only when required for exported validation helpers: `src/projects/project-schema.ts`

**Interfaces:**
- Produces `referenceLocalProjectStorageKey`, `migrateReferenceLocalProjectCollection(serializedSource): StoredLocalProjectCollectionV2`, and `ReferenceProjectMigrationError`.
- Consumes frozen JSON only as `unknown`, a version-locked source-to-target catalog mapping manifest, map/catalog lookup interfaces, `validateStoredLocalProjectCollectionV2`, and no browser APIs.

- [ ] **Step 1: Write failing pure migration tests with literal frozen fixtures**

```ts
expect(migrateReferenceLocalProjectCollection(validFrozenCollection)).toMatchObject({
  formatVersion: 2,
  projects: [{id: "farm-001", activeMapInstanceId: "12", mapInstances: {"12": {baseMapId: "standard"}}}],
});
expect(() => migrateReferenceLocalProjectCollection(collectionWithBuildingWaterColor)).toThrow(
  'projects[0].maps[0].state.buildings[0].waterColor',
);
expect(() => migrateReferenceLocalProjectCollection(collectionWithUnknownMapFile)).toThrow('Unknown source mapFile "NotAMap.tmx"');
```

- [ ] **Step 2: Run migration tests and confirm failure because the converter is absent**

Run: `pnpm test --run tests/projects/reference-local-project-migration.test.ts`

- [ ] **Step 3: Implement parse, convert, and validate functions separately**

```ts
export function migrateReferenceLocalProjectCollection(serializedSource: string): StoredLocalProjectCollectionV2 {
  const sourceCollection = parseReferenceLocalProjectCollection(serializedSource);
  const convertedProjects = sourceCollection.projects.map(convertReferenceProject);
  return validateStoredLocalProjectCollectionV2({formatVersion: 2, projects: convertedProjects});
}
```

Use focused functions for source schema assertion, map-file resolution, snapshot conversion, catalog ID conversion, decor conversion, renovation conversion, and HSL-to-lowercase-hex paint conversion. `reference-local-project-catalog-mapping.ts` is the only source-to-target ID boundary: it exports literal, version-locked mappings for every source map and catalog entry context that has double evidence in the locked frozen runtime and locked destination catalog, plus a lookup that rejects missing source IDs with the actual category and ID. Do not derive mappings from a string prefix at conversion time. The converter additionally verifies every mapped target ID against the destination catalog contract. Reject unsupported `waterColor`, `variant`, `locked`, held items, thumbnails, unknown extension fields, invalid timestamps, overlong names, empty projects, unknown map files, missing V2-required item fields, and invalid renovations with the precise source path/value.

- [ ] **Step 4: Add rejection and conversion coverage, then run tests and typecheck**

Run: `pnpm test --run tests/projects/reference-local-project-migration.test.ts && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/projects/project-schema.ts src/projects/reference-local-project-migration.ts tests/projects/reference-local-project-migration.test.ts`

### Task 5: Add atomic browser storage orchestration for the strict migration

**Files:**
- Create: `src/projects/reference-local-project-storage-migration.ts`
- Modify: `src/projects/local-project-store.ts`
- Test: `tests/projects/reference-local-project-storage-migration.test.ts`, `tests/projects/local-project-store.test.ts`

**Interfaces:**
- Consumes Task 4 converter and `LocalProjectStorageAdapter`.
- Produces `migrateReferenceProjectsIfNeeded(storage): ReferenceStorageMigrationResult`; return `"existing-v2" | "migrated" | "no-source"`, and throw migration/write errors unchanged.

- [ ] **Step 1: Write failing atomicity tests**

```ts
expect(migrateReferenceProjectsIfNeeded(storageWithExistingV2)).toEqual({status: "existing-v2"});
expect(storageWithExistingV2.getItem(referenceLocalProjectStorageKey)).toBe(originalFrozenJson);

expect(() => migrateReferenceProjectsIfNeeded(storageWhereSecondProjectIsInvalid)).toThrow('projects[1]');
expect(storageWhereSecondProjectIsInvalid.getItem(localProjectV2StorageKey)).toBeNull();
expect(storageWhereSecondProjectIsInvalid.getItem(referenceLocalProjectStorageKey)).toBe(originalFrozenJson);
```

- [ ] **Step 2: Run the storage migration tests and confirm failure because orchestration is absent**

Run: `pnpm test --run tests/projects/reference-local-project-storage-migration.test.ts tests/projects/local-project-store.test.ts`

- [ ] **Step 3: Implement the single-write storage boundary**

```ts
export function migrateReferenceProjectsIfNeeded(storage: LocalProjectStorageAdapter): ReferenceStorageMigrationResult {
  const existingV2 = storage.getItem(localProjectV2StorageKey);
  if (existingV2 !== null) return {status: "existing-v2"};
  const serializedSource = storage.getItem(referenceLocalProjectStorageKey);
  if (serializedSource === null) return {status: "no-source"};
  const migratedCollection = migrateReferenceLocalProjectCollection(serializedSource);
  storage.setItem(localProjectV2StorageKey, JSON.stringify(migratedCollection));
  return {status: "migrated"};
}
```

Do not catch a conversion or write exception. Do not call `removeItem` or `setItem` for the frozen key.

- [ ] **Step 4: Re-run tests and typecheck**

Run: `pnpm test --run tests/projects/reference-local-project-storage-migration.test.ts tests/projects/local-project-store.test.ts && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/projects tests/projects`

### Task 6: Build the native PlannerWorkspace orchestration boundary

**Files:**
- Create: `src/components/planner-workspace.tsx`, `src/planner/planner-workspace-state.ts`, `src/planner/planner-error-message.ts`
- Modify: `src/components/planner-canvas.tsx`, `src/components/editor-modal.tsx`, `src/components/local-project-panel.tsx`, `src/components/project-map-instance-panel.tsx`
- Test: `tests/components/planner-workspace.test.tsx`, `tests/planner/planner-workspace-state.test.ts`, `tests/planner/planner-error-message.test.ts`

**Interfaces:**
- Consumes existing editor controllers, `PlannerCanvas` callbacks, Task 5 migration result, and `LocalProjectStoreV2` only through exported types.
- Produces `<PlannerWorkspace locale initialMapId?>`; planner state reducers return immutable state and do not access React, storage, or routes.

- [ ] **Step 1: Write failing workspace-state and UI integration tests**

```tsx
render(<PlannerWorkspace locale="zh-CN" initialMapId="standard" />);
expect(screen.getByRole("button", {name: /地图/i})).toBeInTheDocument();
expect(screen.getByText("标准农场")).toBeInTheDocument();

expect(reducePlannerWorkspaceState(initialPlannerWorkspaceState, {type: "select-map", mapId: "beach"}).selectedMapId).toBe("beach");
expect(() => reducePlannerWorkspaceState(initialPlannerWorkspaceState, {type: "select-map", mapId: "unknown"})).toThrow('unknown');
```

- [ ] **Step 2: Run the focused workspace tests and confirm the native entry point is absent**

Run: `pnpm test --run tests/components/planner-workspace.test.tsx tests/planner/planner-workspace-state.test.ts tests/planner/planner-error-message.test.ts`

- [ ] **Step 3: Implement only coordination state and compose existing domain modules**

The workspace owns React state for selected map/season/tool/modal/selection/history/display options and canvas references. It calls existing controller functions for placement, fill, erase, selection and history; it never reimplements their rules. Start Task 5 migration before creating/opening the V2 store, surface known migration errors through `getLocalizedPlannerErrorMessage`, and rethrow unknown errors.

- [ ] **Step 4: Extend tests for map selection, project lifecycle and localized known-error output**

Run: `pnpm test --run tests/components/planner-workspace.test.tsx tests/planner/planner-workspace-state.test.ts tests/planner/planner-error-message.test.ts && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/components src/planner tests/components tests/planner`

### Task 7: Localize native planner controls, panels, labels, and notifications

**Files:**
- Modify: `src/components/editor-menu-bar.tsx`, `src/components/editor-toolbar.tsx`, `src/components/editor-modal.tsx`, `src/components/map-configuration-panel.tsx`, `src/components/item-catalog-panel.tsx`, `src/components/selection-inspector.tsx`, `src/components/local-project-panel.tsx`, `src/components/project-map-instance-panel.tsx`, `src/components/interior-decor-panel.tsx`, `src/components/farm-summary-*`, `src/components/map-image-export-panel.tsx`, `src/components/game-save-import-panel.tsx`
- Create: `src/i18n/catalog-display.ts`
- Test: `tests/i18n/catalog-display.test.ts`, affected `tests/components/*.test.tsx`

**Interfaces:**
- Consumes `useTranslations` only in client components and explicit locale display-adapter input for catalog/map names.
- Produces localized presentation while all controller payloads retain original IDs/state.

- [ ] **Step 1: Write failing representative control/panel tests**

```tsx
render(<EditorToolbar locale="zh-CN" {...toolbarProperties} />);
expect(screen.getByRole("button", {name: "撤销"})).toBeEnabled();
expect(screen.getByRole("button", {name: "Undo"})).not.toBeInTheDocument();

expect(getCatalogDisplayName("zh-CN", "building:Coop")).toBe("鸡舍");
expect(createPlacementRequest("building:Coop").catalogId).toBe("building:Coop");
```

- [ ] **Step 2: Run the affected component tests and confirm they fail on the new locale contract**

Run: `pnpm test --run tests/i18n/catalog-display.test.ts tests/components/editor-shell.test.tsx tests/components/item-catalog-panel.test.tsx tests/components/local-project-panel.test.tsx tests/components/project-map-instance-panel.test.tsx tests/components/selection-inspector.test.tsx`

- [ ] **Step 3: Add narrow translation props/hooks and catalog display adapters**

Replace hard-coded user-facing strings, aria labels, tooltips, confirmation text, and known operation errors. Keep each component's existing controller callbacks; do not give a panel storage access or URL parsing. Pass `locale` only at component boundaries that need identifier-to-display conversion.

- [ ] **Step 4: Re-run all modified component tests and typecheck**

Run: `pnpm test --run tests/components/editor-shell.test.tsx tests/components/item-catalog-panel.test.tsx tests/components/local-project-panel.test.tsx tests/components/project-map-instance-panel.test.tsx tests/components/selection-inspector.test.tsx tests/components/interior-decor-panel.test.tsx tests/components/farm-summary-panel.test.tsx tests/components/game-save-import-panel.test.tsx tests/components/map-image-export-panel.test.tsx && pnpm typecheck`

- [ ] **Step 5: Inspect the task diff**

Run: `git diff --check && git diff -- src/components src/i18n tests/components tests/i18n`

### Task 9: Finish route replacement, remove production frozen bootstrap assertions, and run static regression coverage

**Files:**
- Modify: `tests/components/reference-runtime-host.test.tsx`, `tests/reference-runtime/reference-runtime-delivery.test.ts`, `tests/reference-runtime/reference-runtime-visual-contract.test.ts`, `tests/routes/static-routes.test.ts`, `tests/routes/planner-editor-page.test.tsx`
- Create: `tests/routes/native-planner-routes.test.tsx`, `tests/routes/static-export-i18n.test.ts`
- Do not delete: `src/components/reference-runtime-host.tsx`, `src/reference-runtime/**`, `public/reference-runtime/**`, `public/_app/**`

**Interfaces:**
- Consumes Tasks 6–8.
- Produces route-level tests proving pages render native React planner/public output and frozen runtime assets are retained but not bootstrapped.

- [ ] **Step 1: Write failing native-route/static-export assertions**

```ts
expect(readStaticPageHtml("index.html")).toContain("data-planner-workspace");
expect(readStaticPageHtml("zh.html")).toContain("data-planner-workspace");
expect(readStaticPageHtml("index.html")).not.toContain("/reference-runtime/bootstrap.mjs");
expect(readStaticPageHtml("zh/farm/standard.html")).toContain('hreflang="zh-CN"');
expect(existsSync(join(process.cwd(), "public", "reference-runtime", "bootstrap.mjs"))).toBe(true);
```

- [ ] **Step 2: Run focused native/static tests and confirm they fail before updating old frozen-runtime expectations**

Run: `pnpm test --run tests/routes/native-planner-routes.test.tsx tests/routes/static-export-i18n.test.ts tests/routes/static-routes.test.ts tests/components/reference-runtime-host.test.tsx`

- [ ] **Step 3: Replace only production-route expectations**

Keep tests that validate frozen assets as a retained fixture. Remove only assertions that production pages must render `ReferenceRuntimeHost` or execute the bootstrap. Add semantic native planner/public UI assertions for English and Chinese.

- [ ] **Step 4: Run full automated verification**

Run: `pnpm typecheck && pnpm test --run && pnpm build`

- [ ] **Step 5: Perform browser verification against the generated static site**

Run: `pnpm start`

Check `/`, `/zh`, `/farm/standard`, `/zh/farm/standard`; toggle language while retaining `?farmType=beach`; create/open/save a local project; check an unsupported frozen project leaves the V2 key absent; inspect canonical and hreflang tags. Record the actual URLs and results in the task report.

- [ ] **Step 6: Inspect the full branch diff without committing**

Run: `git diff --check && git status --short && git diff --stat`

## Coverage review

- URL/SEO/static-export requirements: Tasks 1, 2, 8, and 9.
- Full public Chinese content and all English preservation: Task 3.
- Strict frozen local-project conversion and atomicity: Tasks 4 and 5.
- Native React replacement and planner behavior: Tasks 6 through 9.
- Stable assets/IDs/schema and no frozen-runtime deletion: global constraints plus Tasks 3, 4, and 9.
