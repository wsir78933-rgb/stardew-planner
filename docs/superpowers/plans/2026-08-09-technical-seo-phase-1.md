# Technical SEO Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all eight bilingual blog URLs `noindex, follow` while retaining all eight in the 34-URL sitemap, add a deterministic production SEO smoke tool, and document the unexecuted Cloudflare actions.

**Architecture:** Keep the existing route registry and sitemap production path unchanged, because it already retains all eight blog URLs. Change only article metadata, isolate the production contract from the smoke runner, inject `fetch` in unit tests, and keep the Cloudflare runbook separate from the existing contact Worker.

**Tech Stack:** Next.js 16.3 static export, React 19, TypeScript 5.9, Node.js ESM, Vitest 3, Cloudflare Workers static assets.

## Global Constraints

- All eight blog URLs must emit `noindex, follow` and must remain in sitemap.xml; sitemap count stays exactly 34.
- Preserve blog canonical, en/zh-CN/x-default hreflang, Open Graph, Twitter metadata, JSON-LD, routes, content, and crawlability.
- Do not add a robots.txt Disallow for blog paths.
- The production smoke command must not run as part of normal `pnpm test` and must not mutate production or Cloudflare.
- Add no dependencies. Do not modify the existing contact Worker or frozen reference runtime.
- Do not commit, push, deploy, or change Cloudflare.
- Use high cohesion, low coupling, single-responsibility functions, KISS, Fail Fast, YAGNI, and precise names.
- Write a failing test before production code and verify the expected failure.

---

### Task 1: Lock the eight-page blog noindex and sitemap exception contract

**Files:**
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/sitemap-robots.test.ts`
- Modify: `app/(en)/[slug]/page.tsx`
- Modify: `app/zh/[slug]/page.tsx`

**Interfaces:**
- Consumes: existing `generateMetadata()` and `createPublicPageMetadata()` interfaces.
- Preserves: `getLocalizedIndexablePublicRouteEntries()` returns 34 entries and sitemap contains all eight blog paths.
- Produces: every article `generateMetadata()` returns `robots: { index: false, follow: true }`.

- [ ] **Step 1: Write the failing metadata contract**

Change the two existing article expectations to the literal value:

```ts
robots: { index: false, follow: true },
```

Keep the existing literal canonical, language alternate, Open Graph and Twitter assertions.

- [ ] **Step 2: Run metadata test and verify RED**

Run: `pnpm exec vitest run tests/routes/public-route-metadata.test.ts`

Expected: FAIL because both article routes still return `index: true`.

- [ ] **Step 3: Implement the minimal metadata change**

In each article route, change only:

```ts
robots: { index: false, follow: true },
```

Do not introduce a new policy abstraction or alter other metadata fields.

- [ ] **Step 4: Run metadata test and verify GREEN**

Run: `pnpm exec vitest run tests/routes/public-route-metadata.test.ts`

Expected: PASS.

- [ ] **Step 5: Make the sitemap exception explicit**

Rename `expectedBlogSitemapPathnames` to `expectedNoindexBlogSitemapPathnames` and use a test name that says the sitemap intentionally retains noindex blog URLs. Keep literal assertions for 34 URLs and all eight blog `<loc>` values.

- [ ] **Step 6: Run the focused route contract**

Run:

```bash
pnpm exec vitest run tests/routes/public-route-metadata.test.ts tests/routes/sitemap-robots.test.ts tests/i18n/public-route-registry.test.ts
```

Expected: PASS.

---

### Task 2: Add the deterministic production SEO smoke tool

**Files:**
- Create: `scripts/production-seo-smoke-contract.mjs`
- Create: `scripts/production-seo-smoke.mjs`
- Create: `tests/scripts/production-seo-smoke.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `parseProductionSeoSmokeArguments(argumentValues)`.
- Produces: `runProductionSeoSmoke({ fetchResponse, origin })` returning a readonly summary on success and throwing immediately on the first failed network or contract check.
- Produces: contract exports for all 36 public HTML path contracts, the 34 sitemap pathnames, eight noindex blog pathnames, two noindex Contact pathnames, missing-page probe, and required security header names.
- Consumes: injected `fetchResponse(input, init)` compatible with built-in `fetch`.

- [ ] **Step 1: Write failing argument and contract tests**

Tests must independently assert:

```ts
expect(parseProductionSeoSmokeArguments([
  "--origin",
  "https://stardewvalleyplanner.art",
])).toEqual({ origin: "https://stardewvalleyplanner.art" });

expect(expectedSitemapPathnames).toHaveLength(34);
expect(expectedNoindexBlogPathnames).toEqual([
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
  "/zh/blog",
  "/zh/blog/archive",
  "/zh/carpenter-stardew",
  "/zh/where-is-robin-stardew-valley",
]);
```

Also reject missing, duplicate, unknown, HTTP, query, fragment, credentials and non-root origin values. Each error includes the received argument values.

- [ ] **Step 2: Run the script test and verify RED**

Run: `pnpm exec vitest run tests/scripts/production-seo-smoke.test.mjs`

Expected: FAIL because the two production modules do not exist.

- [ ] **Step 3: Implement CLI parsing and the static contract**

Use ordinary exported functions and readonly arrays. Derive localized paths from literal canonical identities inside the contract module; reject invalid internal path values immediately. Do not import TypeScript runtime modules or add a class.

- [ ] **Step 4: Run argument and contract tests and verify GREEN**

Run: `pnpm exec vitest run tests/scripts/production-seo-smoke.test.mjs`

Expected: the argument/contract cases pass; later runner cases may still fail because the runner is incomplete.

- [ ] **Step 5: Write failing HTTP and HTML checks**

Using a deterministic injected fetch implementation, assert:

- `http://.../farm/standard?seo_https_probe=1` returns one 301/308 hop preserving path and query.
- all 36 public HTML URLs return 200 and `text/html`.
- canonical and en/zh-CN/x-default hreflang match literal expected URLs.
- all eight blog pages contain `noindex, follow`.
- both Contact pages contain `noindex, follow` and remain absent from sitemap.
- `/robots.txt` is text and declares the absolute sitemap URL.
- `/sitemap.xml` is XML and its unique `<loc>` set exactly equals all 34 contract URLs, including the eight noindex blog URLs and excluding Contact.
- the missing-page probe returns `404`, `text/html`, and noindex HTML rather than JSON.

- [ ] **Step 6: Implement single-responsibility response checks**

Use focused functions with precise names, for example:

```js
assertExpectedStatus(requestUrl, response, expectedStatus)
assertExpectedContentType(requestUrl, response, expectedMediaType)
readSingleHtmlAttribute(requestUrl, html, elementPattern, attributeName)
assertExpectedCanonical(requestUrl, html, expectedCanonicalUrl)
assertExpectedLanguageAlternates(requestUrl, html, expectedAlternates)
readSitemapLocationValues(sitemapUrl, sitemapXml)
```

Every thrown error must include the request URL, expected check and actual value. Do not catch unknown exceptions.

- [ ] **Step 7: Write failing security-header and cache checks**

Assert HTTPS HTML responses require HSTS, CSP or CSP Report-Only, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and frame protection. Parse one same-origin hashed `/_next/static/` CSS or JS URL from the homepage and require a positive `max-age` response.

- [ ] **Step 8: Complete orchestration and CLI behavior**

`runProductionSeoSmoke()` coordinates the focused checks and returns counts. The direct-execution guard parses `process.argv`, prints a JSON success summary, and lets failures reject with a nonzero process exit. Add:

```json
"seo:smoke": "node scripts/production-seo-smoke.mjs --origin https://stardewvalleyplanner.art"
```

Do not add the production command to `pretest`, `test`, or `build`.

- [ ] **Step 9: Run the complete deterministic test**

Run: `pnpm exec vitest run tests/scripts/production-seo-smoke.test.mjs`

Expected: PASS without network access.

---

### Task 3: Add the Cloudflare technical SEO runbook

**Files:**
- Create: `docs/seo/cloudflare-technical-seo-runbook.md`

**Interfaces:**
- Consumes: current static export, contact Worker route, 404 artifact and production smoke command.
- Produces: human-only external configuration and verification checklist; no executable production mutation.

- [ ] **Step 1: Document the hard boundary and current architecture**

State that `wrangler.jsonc` remains the Contact Worker for `/api/contact*`; a full-site static deployment is a separate deployment unit. State that this task does not log in, deploy or modify Cloudflare.

- [ ] **Step 2: Document the ordered external operations**

Include these sections in order:

1. SSL/TLS mode precheck and Always Use HTTPS single-hop redirect.
2. Response Header Transform Rules using Set, HSTS only after HTTPS is stable.
3. CSP Report-Only/Log based on measured GA, Clarity, Turnstile and YouTube traffic before enforcement.
4. Static assets configuration with `assets.directory: "./out"`, `html_handling: "auto-trailing-slash"`, and `not_found_handling: "404-page"` in a separate full-site deployment.
5. Cache Rules/Cache Response Rules, distinguishing browser headers from edge cache; no invented HTML TTL.
6. Rollback and evidence-recording template.

- [ ] **Step 3: Include copyable verification commands**

Commands cover HTTP single hop with query preservation, security response headers, `/farm/standard`, `/zh/farm/standard`, trailing slash, `/robots.txt`, `/sitemap.xml`, HTML 404, and repeated hashed asset requests.

- [ ] **Step 4: Review the prose against repository evidence**

Expected: no statement claims Cloudflare was changed; no instruction expands the Contact Worker; every production success criterion has a command.

---

### Task 4: Verify and independently review Phase 1

**Files:**
- Verify only: source, tests, build output, production smoke output and documentation.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: evidence only; no scope expansion.

- [ ] **Step 1: Run static verification**

Run:

```bash
git diff --check
pnpm typecheck
pnpm build
pnpm exec vitest run tests/routes/public-route-metadata.test.ts tests/routes/sitemap-robots.test.ts tests/i18n/public-route-registry.test.ts tests/scripts/production-seo-smoke.test.mjs
```

Expected: all pass.

- [ ] **Step 2: Verify generated artifacts**

Check all eight built blog HTML files for `noindex, follow`, self canonical and three hreflang values. Check `out/sitemap.xml` has exactly 34 unique `<loc>` values including all eight blog URLs.

- [ ] **Step 3: Run the full regression**

Run: `pnpm test -- --run`

Expected: full suite passes. If an unrelated baseline fails, report exact evidence and do not mislabel the suite green.

- [ ] **Step 4: Run the production smoke command**

Run: `pnpm seo:smoke`

Expected: record the real current result. Cloudflare failures remain checklist items and do not authorize external changes.

- [ ] **Step 5: Dispatch independent whole-diff review**

Reviewer verifies exact user contract, test quality, error boundaries, no hidden network in normal tests, no dependency changes, no Contact Worker expansion, and no unrelated edits.

- [ ] **Step 6: Prepare Phase 2 baseline**

After Phase 1 review is clean, inspect the current build and existing CDP performance scripts, then write the exact Phase 2 plan from measured evidence before changing performance or mobile CSS.
