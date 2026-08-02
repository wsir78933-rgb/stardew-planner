# Unified Site Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render one localized, responsive Footer on homepage and public pages, including working bilingual Privacy and Terms pages.

**Architecture:** `site-footer-content.ts` resolves typed, localized Footer data and `SiteFooter` renders it. `legal-page-copy.ts` owns product-factual legal copy and `LegalPageContent` renders it. The public route registry includes every exported public route, including Privacy and Terms.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, CSS, `react-icons`.

## Global Constraints

- Use one `SiteFooter` presentation component and one `createSiteFooterContent` route-data function.
- Use `getLocalizedPublicPath` for every Footer destination; add `/privacy` and `/terms` to the public route registry before resolving legal links.
- Social icons are `aria-hidden` spans with no `href`, button, click handler, tab stop, or accessible name.
- Add `react-icons` as the only dependency and use its Instagram, Facebook, Twitter, and LinkedIn brand icons.
- Legal copy may state only existing product facts: browser-local projects, no account/sign-in/cloud sync/share links/payments/memberships/supporter features, no product analytics/tracking, no sign-in cookies, and user-controlled import/export.
- Do not modify `public/reference-runtime`, planner logic, public navigation entries, or unrelated dirty files.
- Do not stage, commit, push, deploy, or modify Hermes.

---

### Task 1: Footer interface, route identity, and presentation component

**Files:**
- Create: `src/site-footer/site-footer-content.ts`
- Create: `src/components/site-footer.tsx`
- Create: `tests/components/site-footer.test.tsx`
- Modify: `src/i18n/public-route-registry.ts`
- Modify: `tests/i18n/public-route-registry.test.ts`
- Modify: `tests/seo/canonical-public-routes.test.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produce `SiteFooterCopy`, `SiteFooterContent`, and `createSiteFooterContent(footerCopy, locale)`.
- Produce `SiteFooter({ content }: { content: SiteFooterContent })`.
- Extend `PublicCanonicalPath` with `"/privacy"` and `"/terms"`.

- [ ] **Step 1: Write failing tests for legal path identity and Footer output**

```tsx
expect(getLocalizedPublicPath("zh-CN", "/privacy")).toBe("/zh/privacy");
expect(getLocalizedPublicPath("zh-CN", "/terms")).toBe("/zh/terms");
expect(footerMarkup).toContain('data-site-footer="true"');
expect(footerMarkup).toContain('href="/zh/privacy"');
expect(footerMarkup).toContain("Stardew Valley Farm Planner");
expect(footerMarkup).toContain("© Stardew Valley Farm Planner");
expect(footerMarkup.match(/aria-hidden="true"/g)).toHaveLength(4);
```

- [ ] **Step 2: Run targeted tests and observe expected failures**

Run: `pnpm vitest run tests/components/site-footer.test.tsx tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts`

Expected: FAIL because legal routes are not registered and the Footer lacks its approved identity/copyright structure.

- [ ] **Step 3: Implement the smallest typed shared Footer**

`SiteFooterCopy` contains identity, Planner, Explore, and Legal labels. `SiteFooterContent` contains `identity` plus exactly three `sections`. `createSiteFooterContent` resolves `/`, `/farm-comparison`, `/mods`, `/privacy`, `/terms`, `/#capabilities`, and `/#faq` through `getLocalizedPublicPath`. `SiteFooter` renders a `data-site-footer` wrapper, an identity block, three link groups, four decorative icon spans, and a copyright row. Define one explicit `SiteFooterLinkGroup` type rather than indexing the `planner` property type.

- [ ] **Step 4: Run targeted tests and observe passing output**

Run: `pnpm vitest run tests/components/site-footer.test.tsx tests/i18n/public-route-registry.test.ts tests/seo/canonical-public-routes.test.ts`

Expected: PASS.

### Task 2: Bilingual Privacy and Terms pages

**Files:**
- Create: `src/legal/legal-page-copy.ts`
- Create: `src/components/legal-page-content.tsx`
- Create: `app/(en)/privacy/page.tsx`
- Create: `app/(en)/terms/page.tsx`
- Create: `app/zh/privacy/page.tsx`
- Create: `app/zh/terms/page.tsx`
- Create: `tests/legal/legal-page-copy.test.ts`
- Modify: `tests/routes/static-routes.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`
- Modify: `tests/routes/sitemap-robots.test.ts`

**Interfaces:**
- Produce `getLegalPageCopy(locale, legalPageKind)` and `LegalPageContent({ copy })`.
- Consume `PublicPageShell`, `createPublicPageMetadata`, and the legal paths from Task 1.

- [ ] **Step 1: Write failing legal-page tests**

```tsx
expect(getLegalPageCopy("en", "privacy").title).toBe("Privacy Policy");
expect(getLegalPageCopy("zh-CN", "terms").title).toBe("服务条款");
expect(getLegalPageCopy("en", "privacy").sections).toContainEqual(
  expect.objectContaining({ heading: "Farm data" }),
);
```

Update static-route and sitemap expectations so `/privacy`, `/terms`, `/zh/privacy`, and `/zh/terms` are expected artifacts and sitemap entries.

- [ ] **Step 2: Run the targeted tests and observe expected failures**

Run: `pnpm vitest run tests/legal/legal-page-copy.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts`

Expected: FAIL because legal page modules and static artifacts do not exist.

- [ ] **Step 3: Implement factual legal copy and four route modules**

The English Privacy sections are `What we collect`, `Farm data`, `Online features`, `Analytics`, `Cookies`, `Third parties`, `Data deletion`, and `Local use`. The English Terms sections are `What this is`, `Accounts`, `Online features`, `Your data`, `Availability`, `Game assets`, and `Local use`. Provide accurate Chinese equivalents. Each route module renders `PublicPageShell` with its legal canonical path and `LegalPageContent`, and declares locale-appropriate `createPublicPageMetadata` values.

- [ ] **Step 4: Run the targeted tests and observe passing output**

Run: `pnpm vitest run tests/legal/legal-page-copy.test.ts tests/routes/static-routes.test.ts tests/routes/static-public-pages.test.ts tests/routes/sitemap-robots.test.ts`

Expected: PASS after the required static build is available.

### Task 3: Bilingual copy and homepage/public-page Footer integration

**Files:**
- Modify: `src/homepage/homepage-copy.ts`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `src/components/homepage-content.tsx`
- Modify: `src/components/public-page-shell.tsx`
- Modify: `tests/routes/planner-editor-page.test.tsx`
- Modify: `tests/components/public-page-shell.test.tsx`
- Modify: `tests/homepage/homepage-copy.test.ts`

**Interfaces:**
- Consume `SiteFooterCopy`, `createSiteFooterContent`, and `SiteFooter` from Task 1.
- Produce the same Footer markup for homepage and public page shells in English and Chinese.

- [ ] **Step 1: Write failing integration tests**

```tsx
expect(homepageMarkup).toContain('data-site-footer="true"');
expect(homepageMarkup).toContain('href="/terms"');
expect(chineseHomepageMarkup).toContain('href="/zh/terms"');
expect(publicShellMarkup).toContain('data-site-footer="true"');
expect(publicShellMarkup).toContain('href="/privacy"');
```

- [ ] **Step 2: Run the integration tests and observe expected failures**

Run: `pnpm vitest run tests/routes/planner-editor-page.test.tsx tests/components/public-page-shell.test.tsx tests/homepage/homepage-copy.test.ts`

Expected: FAIL because existing callers still render their old Footer markup.

- [ ] **Step 3: Add exact bilingual Footer copy and replace only Footer nodes**

English labels: `Planner`, `Explore`, `Legal`, `Planner`, `Farm comparison`, `Modded farms`, `How it works`, `FAQ`, `Privacy Policy`, `Terms of Service`. Chinese labels: `规划器`, `探索`, `法律`, `规划器`, `农场对比`, `模组农场`, `使用方式`, `常见问题`, `隐私政策`, `服务条款`. Both copies use the product's localized brand name, browser-local planner description, and existing copyright text.

- [ ] **Step 4: Run the integration tests and observe passing output**

Run: `pnpm vitest run tests/routes/planner-editor-page.test.tsx tests/components/public-page-shell.test.tsx tests/homepage/homepage-copy.test.ts`

Expected: PASS.

### Task 4: Footer responsive visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/homepage/homepage-style-contract.test.ts`
- Modify: `tests/routes/public-page-style-contract.test.ts`

**Interfaces:**
- Consume the `data-site-footer`, `data-site-footer-identity`, `data-site-footer-sections`, and `data-site-footer-social-icons` attributes from Task 1.
- Produce a desktop identity-plus-three-groups layout and a one-column mobile layout.

- [ ] **Step 1: Write failing CSS contract assertions**

```ts
expect(globalStyles).toContain("[data-site-footer]");
expect(globalStyles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
expect(globalStyles).toContain("[data-site-footer-sections]");
```

- [ ] **Step 2: Run style tests and observe expected failures**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts tests/routes/public-page-style-contract.test.ts`

Expected: FAIL because site Footer styles do not exist.

- [ ] **Step 3: Add attribute-scoped Footer CSS**

Use the current palette and font, no gradients and no animation. Render the reference-inspired bounded desktop layout with left identity column, three link groups, a top border, and bottom copyright row. At 700px and below, stack the identity and sections without horizontal overflow.

- [ ] **Step 4: Run style tests and observe passing output**

Run: `pnpm vitest run tests/homepage/homepage-style-contract.test.ts tests/routes/public-page-style-contract.test.ts`

Expected: PASS.

### Task 5: Whole-change verification

**Files:**
- Verify: all Task 1–4 files

- [ ] **Step 1: Run serial automated verification**

Run: `pnpm test --run && pnpm typecheck && pnpm build && git diff --check`

Expected: every command exits 0.

- [ ] **Step 2: Inspect built pages at desktop and mobile width**

Serve `out/` locally and inspect `/`, `/zh`, `/farm-comparison`, `/zh/farm-comparison`, `/privacy`, `/zh/privacy`, `/terms`, and `/zh/terms`. Confirm localized Footer links, visible legal page content, no horizontal overflow at 390px, and non-focusable social icons.
