# Safe Bilingual Public Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Add Chinese /zh public discovery pages with paired SEO alternates while preserving the English reference-runtime planner and browser-local projects.

**Architecture:** A typed locale-aware route registry maps 11 locale-neutral public identities to English root paths and Chinese /zh paths. Existing public components accept an explicit locale and canonical identity; Chinese pages remain static server components and link to the existing English planner instead of importing the bilingual branch's native planner or migration code.

**Tech Stack:** Next.js App Router static export, React server components, TypeScript, Vitest, existing public CSS, JSON-LD helpers.

## Global Constraints

- Work only on codex/bilingual-safe-public in /private/tmp/stardew-planner-bilingual-safe.8qT1yK; never edit the dirty main worktree.
- Formal origin is exactly https://stardewvalleyplanner.art; canonical URLs never have a trailing slash.
- Supported locales are exactly en and zh-CN; English uses root paths and Chinese uses /zh; never create /en URLs.
- Every locale pair exposes en, zh-CN, and x-default alternates; x-default is the English absolute URL.
- Index exactly 22 routes: English /, /farm-comparison, /mods, and 8 official farms; the same identities under /zh.
- Remove /privacy and /terms completely: routes, navigation, legal data/components/tests, canonical registry, sitemap and static assertions. Removed static-export paths intentionally return 404; add neither redirect nor replacement.
- Keep PlannerHomepage and its reference runtime exclusively on English /. /zh is static and must contain no ReferenceRuntimeHost, reference-runtime-root, or bootstrap script.
- Do not modify public/_app/**, public/reference-runtime/**, src/reference-runtime/sync-reference-runtime.ts, src/projects/**, planner project data, migrations, or editor components.
- Do not import next-intl, PlannerWorkspace, local-storage migration code, or any client locale provider. Do not change package.json, pnpm-lock.yaml, or vitest.config.ts.
- Preserve body.stardew-homepage and html, body values. Any new layout CSS stays below [data-public-page-shell].
- Reuse verified Chinese farm and mod wording from codex/bilingual-seo-port:src/i18n/public-content.ts. For public navigation, headings, descriptions, and CTAs only, copy selected existing strings from codex/bilingual-seo-port:messages/zh-CN.json, the version-controlled text payload consumed by that branch's src/i18n/messages.ts. These are static source materials only: do not import next-intl, a message provider, a locale provider, or client locale code; do not invent game facts or marketing claims.
- Follow TDD. A test must be observed failing for the intended missing behavior before its production implementation is written.
- Each task is implemented and reviewed by different agents. Commit task changes on this isolated branch only; never stage/commit unrelated work.

---

### Task 1: Locale route registry and localized metadata contract

**Files:**
- Create: src/i18n/public-locale.ts
- Create: src/i18n/public-route-registry.ts
- Modify: src/seo/canonical-public-routes.ts
- Modify: src/seo/page-metadata.ts
- Create: tests/i18n/public-route-registry.test.ts
- Modify: tests/seo/canonical-public-routes.test.ts
- Modify: tests/seo/page-metadata.test.ts

**Interfaces:**
- Consumes: officialFarmTypes and createCanonicalUrl.
- Produces: PublicLocale, publicLocales, PublicCanonicalPath, canonicalPublicPaths, getLocalizedPublicPath(locale, canonicalPath), getLocalizedPublicRouteEntries(), createPublicLanguageAlternates(canonicalPath), and locale-aware createPublicPageMetadata.
- Later tasks use canonical identities such as /farm/standard; no component hardcodes a /zh prefix.

- [ ] **Step 1: Write the failing route registry and metadata tests**

~~~ts
import { expect, it } from "vitest";
import {
  canonicalPublicPaths,
  createPublicLanguageAlternates,
  getLocalizedPublicPath,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("maps public identities to Chinese paths without legal routes", () => {
  expect(canonicalPublicPaths).toHaveLength(11);
  expect(canonicalPublicPaths).not.toContain("/privacy");
  expect(canonicalPublicPaths).not.toContain("/terms");
  expect(getLocalizedPublicPath("en", "/farm/standard")).toBe("/farm/standard");
  expect(getLocalizedPublicPath("zh-CN", "/farm/standard")).toBe("/zh/farm/standard");
  expect(getLocalizedPublicRouteEntries()).toHaveLength(22);
});

it("returns absolute paired language alternates", () => {
  expect(createPublicLanguageAlternates("/mods")).toEqual({
    en: "https://stardewvalleyplanner.art/mods",
    "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
    "x-default": "https://stardewvalleyplanner.art/mods",
  });
});
~~~

Also add a metadata assertion using locale zh-CN and canonical identity /mods. It must assert the Chinese canonical and all three alternates using literal expected URLs.

- [ ] **Step 2: Verify RED**

Run: pnpm vitest run tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/seo/page-metadata.test.ts

Expected: FAIL because locale registry exports and locale-aware metadata do not exist, and current canonical routes still contain legal paths.

- [ ] **Step 3: Implement the minimal route and metadata boundary**

~~~ts
export const publicLocales = ["en", "zh-CN"] as const;
export type PublicLocale = (typeof publicLocales)[number];

export function getLocalizedPublicPath(
  locale: PublicLocale,
  canonicalPath: PublicCanonicalPath,
): string {
  return locale === "en" ? canonicalPath : "/zh" + canonicalPath;
}
~~~

Build canonicalPublicPaths from /, /farm-comparison, /mods, and the 8 official farm identities only. Validate locale and identity inputs with errors that include received values. getLocalizedPublicRouteEntries() returns exactly one { locale, canonicalPath, pathname } entry for every locale/identity pair. createPublicLanguageAlternates() calls createCanonicalUrl() for each locale-derived pathname.

Extend PublicPageMetadataInput with locale?: PublicLocale, defaulting to en. Interpret pathname as the locale-neutral identity, use its locale-derived pathname for canonical/OpenGraph URL, and populate alternates.languages from the registry. Keep title, description, OpenGraph type, and Twitter behavior.

- [ ] **Step 4: Verify GREEN and check scope**

Run: pnpm vitest run tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts tests/seo/page-metadata.test.ts

Expected: PASS.

Run: pnpm typecheck

Expected: PASS.

Run: git diff --check

Expected: no output.

- [ ] **Step 5: Commit only Task 1 files**

~~~bash
git add src/i18n/public-locale.ts src/i18n/public-route-registry.ts \
  src/seo/canonical-public-routes.ts src/seo/page-metadata.ts \
  tests/i18n/public-route-registry.test.ts \
  tests/seo/canonical-public-routes.test.ts tests/seo/page-metadata.test.ts
git commit -m "feat: add locale-aware public route metadata"
~~~

### Task 2: Localized public content, shell, and static components

**Files:**
- Create: src/i18n/public-page-content.ts
- Create: src/components/chinese-planner-introduction.tsx
- Modify: src/reference/public-navigation.ts
- Modify: src/components/public-navigation.tsx
- Modify: src/components/public-page-shell.tsx
- Modify: src/components/farm-comparison-content.tsx
- Modify: src/components/mod-map-card-grid.tsx
- Modify: src/components/farm-guide-content.tsx
- Modify: app/farm-comparison/page.tsx
- Modify: app/mods/page.tsx
- Modify: app/farm/[type]/page.tsx
- Modify: app/privacy/page.tsx
- Modify: app/terms/page.tsx
- Modify: app/globals.css
- Create: tests/i18n/public-page-content.test.ts
- Modify: tests/components/public-page-shell.test.tsx
- Modify: tests/components/public-farm-pages.test.tsx

**Interfaces:**
- Consumes: Task 1 PublicLocale, PublicCanonicalPath, and getLocalizedPublicPath.
- Produces: getLocalizedOfficialFarmGuide, getLocalizedModFarmCards, getPublicPageCopy, PublicPageShell({ locale, canonicalPath, children }), and locale-aware public content components.
- This task wires the existing English information routes with explicit locale and locale-neutral canonical identities. Task 3 supplies the parallel Chinese routes.

- [ ] **Step 1: Write failing localized content and shell tests**

~~~tsx
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ChinesePlannerIntroduction } from "../../src/components/chinese-planner-introduction";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { getLocalizedOfficialFarmGuide } from "../../src/i18n/public-page-content";

it("renders Chinese navigation and a static English-planner CTA", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="zh-CN"><ChinesePlannerIntroduction /></PublicPageShell>,
  );
  expect(markup).toContain('aria-label="公共导航"');
  expect(markup).toContain('href="/"');
  expect(markup).toContain("开始规划");
  expect(markup).not.toContain("reference-runtime-root");
});

it("uses verified Chinese farm copy but retains the map id", () => {
  const guide = getLocalizedOfficialFarmGuide("zh-CN", "standard");
  expect(guide.title).toBe("标准农场");
  expect(guide.id).toBe("standard");
  expect(guide.features[0]).toContain("63 × 31");
});
~~~

Extend the public component contract to assert Chinese comparison/farm links use /zh/farm/... and planning CTAs use /?farmType=<id>, while English output retains root-path links.

- [ ] **Step 2: Verify RED**

Run: pnpm vitest run tests/i18n/public-page-content.test.ts tests/components/public-page-shell.test.tsx tests/components/public-farm-pages.test.tsx

Expected: FAIL because locale-aware props, Chinese content, and Chinese introduction do not exist.

- [ ] **Step 3: Implement locale-aware static content**

Copy verified public farm/mod translations from codex/bilingual-seo-port:src/i18n/public-content.ts into public-page-content.ts. Copy selected existing Chinese public UI strings only from codex/bilingual-seo-port:messages/zh-CN.json, the static payload used by that branch's messages.ts. Do not import the branch's planner-map, message-provider, locale-provider, project, migration, next-intl, or client dependencies.

~~~ts
export function getLocalizedOfficialFarmGuide(
  locale: PublicLocale,
  farmType: OfficialFarmType,
): OfficialFarmGuide;

export function getLocalizedModFarmCards(
  locale: PublicLocale,
): readonly ModFarmCard[];
~~~

Both functions throw received-value diagnostics for missing source records. getPublicPageCopy(locale) supplies navigation labels, page headings/descriptions, Chinese root copy, CTA labels, breadcrumb labels, and the locale counterpart label. It contains no privacy/terms entry.

PublicPageShell receives a required locale and explicit canonicalPath, derives brand, navigation, and language-counterpart links through Task 1, and retains data-public-page-shell. PublicNavigation receives the same arguments and has no legal links. The retiring English-only legal routes pass locale en with no language counterpart until Task 4 deletes them; they must not cause a default locale or root canonical identity. Add only scoped language-switcher CSS below [data-public-page-shell] if readable header wrapping requires it.

Extend FarmComparisonContent, ModMapCardGrid, and FarmGuideContent with a required locale prop. Wire every existing English information route with locale en and its canonical identity in the same atomic change. Obtain localized guide/card text, derive public detail links via getLocalizedPublicPath, and always direct planning CTAs to English / with the existing farmType query. Keep map dimensions, preview assets, farm IDs, and numeric stats unchanged.

ChinesePlannerIntroduction renders exactly one Chinese h1, says the editing interface opens in English, and renders a primary link to /. It imports no planner/runtime module.

- [ ] **Step 4: Verify GREEN and style isolation**

Run: pnpm vitest run tests/i18n/public-page-content.test.ts tests/components/public-page-shell.test.tsx tests/components/public-farm-pages.test.tsx tests/routes/public-page-style-contract.test.ts

Expected: PASS.

Run: pnpm typecheck

Expected: PASS.

Run: git diff --check

Expected: no output.

- [ ] **Step 5: Commit only Task 2 files**

~~~bash
git add src/i18n/public-page-content.ts src/components/chinese-planner-introduction.tsx \
  src/reference/public-navigation.ts src/components/public-navigation.tsx \
  src/components/public-page-shell.tsx src/components/farm-comparison-content.tsx \
  src/components/mod-map-card-grid.tsx src/components/farm-guide-content.tsx \
  app/farm-comparison/page.tsx app/mods/page.tsx 'app/farm/[type]/page.tsx' \
  app/privacy/page.tsx app/terms/page.tsx \
  app/globals.css tests/i18n/public-page-content.test.ts \
  tests/components/public-page-shell.test.tsx tests/components/public-farm-pages.test.tsx
git commit -m "feat: localize static public page content"
~~~

### Task 3: English and Chinese route entry points with paired SEO

**Files:**
- Modify: app/page.tsx
- Create: app/zh/page.tsx
- Create: app/zh/farm-comparison/page.tsx
- Create: app/zh/mods/page.tsx
- Create: app/zh/farm/[type]/page.tsx
- Modify: tests/routes/public-route-metadata.test.ts
- Create: tests/routes/chinese-public-routes.test.tsx

**Interfaces:**
- Consumes: Task 1 route/metadata helpers and Task 2 locale-aware shell/content.
- Produces: 11 English and 11 Chinese route renderers. English / remains the only route that imports PlannerHomepage.
- Task 4 builds and verifies their static artifacts.

- [ ] **Step 1: Write failing Chinese-route and paired-metadata tests**

~~~tsx
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ChinesePlannerPage, { metadata as chinesePlannerMetadata } from "../../app/zh/page";

it("renders a Chinese static introduction that links to the English planner", () => {
  const markup = renderToStaticMarkup(<ChinesePlannerPage />);
  expect(markup).toContain("星露谷物语农场规划器");
  expect(markup).toContain('href="/"');
  expect(markup).not.toContain("reference-runtime-root");
});

it("assigns Chinese root canonical and both language alternates", () => {
  expect(chinesePlannerMetadata.alternates).toMatchObject({
    canonical: "https://stardewvalleyplanner.art/zh",
    languages: {
      en: "https://stardewvalleyplanner.art/",
      "zh-CN": "https://stardewvalleyplanner.art/zh",
      "x-default": "https://stardewvalleyplanner.art/",
    },
  });
});
~~~

Extend metadata tests to assert all English routes publish paired language alternates and all eight Chinese farm metadata results canonicalize to /zh/farm/<type>.

- [ ] **Step 2: Verify RED**

Run: pnpm vitest run tests/routes/chinese-public-routes.test.tsx tests/routes/public-route-metadata.test.ts

Expected: FAIL because /zh route modules and locale-aware route metadata are absent.

- [ ] **Step 3: Implement route modules without planner migration**

Keep app/page.tsx importing PlannerHomepage exactly as its only runtime component; pass locale en to its metadata builder. The existing English information routes already pass explicit locale and canonical identities from Task 2; do not modify them again.

Create Chinese routes with the official farm static-params list and dynamicParams = false. Chinese generateMetadata calls createPublicPageMetadata with locale zh-CN and the locale-neutral canonical identity. Use localized visible Article, CollectionPage, and breadcrumb JSON-LD. Unknown types call notFound().

~~~tsx
export default function ChinesePlannerPage() {
  return (
    <PublicPageShell canonicalPath="/" locale="zh-CN">
      <ChinesePlannerIntroduction />
    </PublicPageShell>
  );
}
~~~

Do not import PlannerHomepage, ReferenceRuntimeHost, PlannerWorkspace, or project-store modules from app/zh/**.

- [ ] **Step 4: Verify GREEN**

Run: pnpm vitest run tests/routes/chinese-public-routes.test.tsx tests/routes/public-route-metadata.test.ts

Expected: PASS.

Run: pnpm typecheck

Expected: PASS.

Run: git diff --check

Expected: no output.

- [ ] **Step 5: Commit only Task 3 files**

~~~bash
git add app/page.tsx app/zh/page.tsx app/zh/farm-comparison/page.tsx \
  app/zh/mods/page.tsx app/zh/farm/[type]/page.tsx \
  tests/routes/public-route-metadata.test.ts tests/routes/chinese-public-routes.test.tsx
git commit -m "feat: add static Chinese public routes"
~~~

### Task 4: Remove legal pages and generate the bilingual discovery contract

**Files:**
- Delete: app/privacy/page.tsx
- Delete: app/terms/page.tsx
- Delete: src/components/legal-page-content.tsx
- Delete: src/reference/legal-pages.ts
- Delete: tests/components/legal-page-content.test.tsx
- Delete: tests/reference/legal-pages.test.ts
- Modify: app/sitemap.ts
- Modify: tests/routes/sitemap-robots.test.ts
- Modify: tests/routes/static-public-pages.test.ts
- Modify: tests/routes/static-routes.test.ts
- Modify: tests/routes/public-page-style-contract.test.ts

**Interfaces:**
- Consumes: Task 1 getLocalizedPublicRouteEntries() and existing URL helper.
- Produces: a 22-entry sitemap/static contract with no legal output.
- Final tests read prebuilt out and never invoke a build.

- [ ] **Step 1: Write failing bilingual discovery and removal tests**

~~~ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedPublicRouteEntries } from "../../src/i18n/public-route-registry";

it("exports locale-aware URLs without legal paths", () => {
  const sitemap = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
  expect((sitemap.match(/<loc>/g) ?? [])).toHaveLength(22);
  expect(sitemap).not.toContain("/privacy");
  expect(sitemap).not.toContain("/terms");
  expect(getLocalizedPublicRouteEntries()).toHaveLength(22);
});

it("does not export deleted legal artifacts", () => {
  expect(() => readFileSync(join(process.cwd(), "out", "privacy.html"))).toThrow();
  expect(() => readFileSync(join(process.cwd(), "out", "terms.html"))).toThrow();
});
~~~

Expand static expectations to use literal English and Chinese title, description, canonical, alternate-link, and h1 values for all 22 entries. Assert no information artifact contains a runtime host or bailout marker. Keep / separately asserted as the one allowed planner runtime artifact and assert zh.html has no runtime marker.

- [ ] **Step 2: Build and verify RED**

Run: NEXT_TELEMETRY_DISABLED=1 pnpm build

Run: pnpm vitest run tests/routes/sitemap-robots.test.ts tests/routes/static-public-pages.test.ts tests/routes/static-routes.test.ts

Expected: FAIL because the current build emits legal files and only 13 sitemap URLs.

- [ ] **Step 3: Implement cleanup and discovery output**

Delete the six legal-only files through a patch. Public navigation is already made legal-free by Task 2; assert that boundary rather than modifying it again. Make app/sitemap.ts map getLocalizedPublicRouteEntries() to { url: createCanonicalUrl(pathname) }. Do not add lastModified, duplicate route lists, or query-string URLs.

Update static route and style contracts for the 22-page locale-aware output and continue proving no body.stardew-homepage text changed. Remove old legal assertions and add artifact nonexistence checks for the two deleted files.

- [ ] **Step 4: Verify GREEN and full repository contract**

Run in order:

1. pnpm typecheck
2. NEXT_TELEMETRY_DISABLED=1 pnpm build
3. pnpm test -- --run
4. pnpm vitest run tests/routes/sitemap-robots.test.ts tests/routes/static-public-pages.test.ts tests/routes/static-routes.test.ts
5. git diff --check

Expected: every command passes. The production route report shows English root/public pages, /zh plus 10 children, robots.txt, and sitemap.xml, with no privacy or terms route.

- [ ] **Step 5: Commit only Task 4 files**

~~~bash
git add -u app/privacy/page.tsx app/terms/page.tsx \
  src/components/legal-page-content.tsx src/reference/legal-pages.ts \
  tests/components/legal-page-content.test.tsx tests/reference/legal-pages.test.ts
git add app/sitemap.ts tests/routes/sitemap-robots.test.ts \
  tests/routes/static-public-pages.test.ts tests/routes/static-routes.test.ts \
  tests/routes/public-page-style-contract.test.ts
git commit -m "feat: publish bilingual static discovery pages"
~~~

### Task 5: Local HTTP and browser acceptance

**Files:**
- Modify: none unless a browser check exposes a reproducible defect. A defect first receives a failing automated regression test in its owning task area.

**Interfaces:**
- Consumes: final static out generated by Task 4.
- Produces: evidence that static delivery, language alternates, responsive layout, and runtime boundaries work as designed.

- [ ] **Step 1: Start final static server**

Run: pnpm exec serve out -l 4173

Expected: local static server accepts connections from the isolated worktree.

- [ ] **Step 2: Verify HTTP statuses and removed paths**

Verify 200 for /, /zh, /farm-comparison, /zh/farm-comparison, /farm/standard, /zh/farm/standard, /mods, /zh/mods, /robots.txt, and /sitemap.xml. Verify 404 for /privacy, /terms, /zh/privacy, and a fabricated path.

- [ ] **Step 3: Inspect browser behavior at desktop and 390×844**

Inspect /, /zh, /farm-comparison, /zh/farm-comparison, /mods, /zh/mods, /farm/standard, and /zh/farm/standard. Confirm visible localized navigation, no horizontal page overflow, readable public shell scrolling, matching canonical/alternate links, and no console errors. Click Chinese root and Chinese farm CTAs to confirm they open English / and /?farmType=standard respectively. Confirm only English / contains the planner runtime marker.

- [ ] **Step 4: Stop the server and record results**

Expected: server stops cleanly; no source changes are made. If an observed defect requires code, write a failing test before any fix and return to its owning task's review loop.
