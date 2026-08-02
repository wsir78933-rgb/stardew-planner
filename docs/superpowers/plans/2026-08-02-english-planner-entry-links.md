# English Planner Entry Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every cross-page Planner entry open `/` in English, without adding `/#planner`, while preserving same-page homepage scrolling links.

**Architecture:** The shared Footer builder separates fixed editor-home destinations from localized content-page destinations. Public navigation/shell entry links use the fixed editor root, while `PlannerHomepage` keeps locale state only for the current mount and never restores or persists it.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest.

## Global Constraints

- Do not change `/zh` page content, editor runtime, route registry, SEO metadata, sitemap, legal pages, CSS, or same-page homepage `href="#planner"` controls.
- Do not introduce `/#planner` anywhere in production source.
- Preserve localized farm comparison, mods, Privacy, and Terms destinations.
- Do not stage, commit, push, deploy, or modify Hermes.
- Follow high cohesion, low coupling, SRP, KISS, Fail Fast, YAGNI, and precise naming.

---

### Task 1: Correct shared cross-page Planner destinations

**Files:**
- Modify: `src/site-footer/site-footer-content.ts`
- Modify: `src/components/public-navigation.tsx`
- Modify: `src/components/public-page-shell.tsx`
- Test: `tests/components/site-footer.test.tsx`
- Test: `tests/components/public-page-shell.test.tsx`

**Interfaces:**
- Consumes: `getLocalizedPublicPath(locale, canonicalPath)` for localized content routes.
- Produces: Footer, public navigation, and public brand Planner entry links that use `/`.

- [ ] **Step 1: Write failing destination tests**

Change the Chinese Footer assertions to require:

```tsx
expect(footerMarkup).toContain('href="/">Planner home</a>');
expect(footerMarkup).toContain('href="/#capabilities"');
expect(footerMarkup).toContain('href="/#faq"');
expect(footerMarkup).not.toContain('href="/zh">Planner home</a>');
expect(footerMarkup).not.toContain('/#planner');
```

Extend the public shell tests so the Chinese rendered shell contains a brand link and Planner navigation link to `/`, while its localized farm comparison, mods, Privacy, and Terms links remain under `/zh`.

- [ ] **Step 2: Run tests and verify Red**

Run:

```text
pnpm vitest run tests/components/site-footer.test.tsx tests/components/public-page-shell.test.tsx
```

Expected: FAIL because Chinese Planner/brand destinations currently resolve to `/zh`, and Chinese Footer section anchors currently resolve below `/zh`.

- [ ] **Step 3: Implement the destination distinction**

In `createSiteFooterContent`, use a fixed `editorHomepagePath = "/"` for Planner, capabilities, and FAQ links. Continue calling `getLocalizedPublicPath` for farm comparison, mods, Privacy, and Terms.

In `PublicNavigation`, use `/` when `navigationItem.path === "/"`; localize every other navigation item as before. In `PublicPageShell`, set the brand destination to `/` while leaving the language switcher and canonical counterpart behavior unchanged.

- [ ] **Step 4: Run tests and verify Green**

Run the same focused command. Expected: both test files pass.

### Task 2: Make homepage locale transient and English-first

**Files:**
- Modify: `src/components/planner-homepage.tsx`
- Modify: `src/homepage/homepage-locale.ts`
- Modify: `tests/homepage/homepage-locale.test.ts`
- Test: `tests/routes/planner-editor-page.test.tsx`

**Interfaces:**
- Consumes: `DEFAULT_HOMEPAGE_LOCALE` and `HomepageLocale`.
- Produces: a homepage that starts in English on every mount and keeps manual locale changes only in component state.

- [ ] **Step 1: Write failing locale-boundary tests**

Update the locale tests to require `DEFAULT_HOMEPAGE_LOCALE === "en"` and require the locale module to expose no storage key, stored-locale reader, or locale persistence writer. This module-interface assertion protects the explicit no-persistence boundary without grepping implementation text. Extend the editor page test to prove its initial static output remains English and that same-page `href="#planner"` controls still exist.

- [ ] **Step 2: Run tests and verify Red**

Run:

```text
pnpm vitest run tests/homepage/homepage-locale.test.ts tests/routes/planner-editor-page.test.tsx
```

Expected: FAIL because the locale module still exposes the storage key, stored-locale reader, and persistence writer.

- [ ] **Step 3: Remove locale persistence from the homepage boundary**

Delete the storage key and storage read/write functions from `homepage-locale.ts`. Remove their imports and effects from `PlannerHomepage`. Keep `useState(DEFAULT_HOMEPAGE_LOCALE)`, the current-page locale switcher, and the effect that updates `document.documentElement.lang`.

- [ ] **Step 4: Run tests and verify Green**

Run the same focused command. Expected: both test files pass.

### Task 3: Address final-review entry-link findings

**Files:**
- Modify: `src/components/farm-guide-content.tsx`
- Modify: `src/components/public-navigation.tsx`
- Test: `tests/components/public-farm-pages.test.tsx`
- Test: `tests/components/public-page-shell.test.tsx`

- [ ] **Step 1: Write failing behavior tests**

Require the Chinese farm-guide breadcrumb brand link to use `/`. Require the Chinese `/zh` Planner navigation link to omit `aria-current="page"`, while the English `/` Planner navigation link retains it.

- [ ] **Step 2: Run tests and verify Red**

```text
pnpm vitest run tests/components/public-farm-pages.test.tsx tests/components/public-page-shell.test.tsx
```

Expected: FAIL because the Chinese farm-guide brand link currently uses `/zh`, and the Chinese Planner item is incorrectly marked current.

- [ ] **Step 3: Implement the narrow fixes**

Use `/` for the farm-guide breadcrumb brand. In `PublicNavigation`, derive each final destination before rendering and compare that destination with the localized current route when assigning `aria-current`.

- [ ] **Step 4: Run tests and verify Green**

Run the same focused command. Expected: both test files pass.

### Task 4: Whole-change verification

**Files:**
- Verify all Task 1-3 files.

- [ ] **Step 1: Run serial automated verification**

```text
pnpm test --run
pnpm typecheck
pnpm build
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Verify the running app**

Open `/`, switch the current page to Chinese, reload `/`, and confirm the homepage starts in English again. From `/zh`, `/zh/farm-comparison`, `/zh/privacy`, and `/zh/terms`, verify the brand, Planner navigation, Footer Planner link, and Chinese introduction CTA open `/` without `#planner`. Confirm homepage-local `#planner` buttons still scroll within the homepage.
