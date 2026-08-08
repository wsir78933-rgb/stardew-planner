# Contact Form and Email Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual noindex Contact form that securely delivers approved visitor messages to the operator's daily inbox through Cloudflare.

**Architecture:** Static Next pages render a client form and call the same-origin Worker path. The Worker performs the only dynamic work: request validation, Turnstile Siteverify validation, and Email Sending dispatch through a fixed configuration boundary.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript, Vitest, Cloudflare Worker, Cloudflare Turnstile, Cloudflare Email Sending.

## Global Constraints

- Do not place a contact POST handler under `app/api`; static export supports only static GET Route Handlers.
- `/contact` and `/zh/contact` have page-level `noindex` but must not appear in `sitemap.xml`.
- Use original Contact copy and the supplied screenshot's general visual tokens only; do not copy its branding or source copy.
- No secret, personal inbox address, API token, or Turnstile secret may be committed, logged, or sent to the browser.
- Preserve all pre-existing dirty working-tree changes. No Git staging, commit, push, reset, checkout, cleanup, Cloudflare dashboard action, or deploy is authorized.
- Full test baseline has four pre-existing failing files; scope verification is limited to Contact tests, typecheck, and build.

---

### Task 1: Route and indexability boundary

**Files:**
- Modify: `src/i18n/public-route-registry.ts`
- Modify: `app/sitemap.ts`
- Create: `app/(en)/contact/page.tsx`
- Create: `app/zh/contact/page.tsx`
- Test: `tests/i18n/public-route-registry.test.ts`
- Test: `tests/routes/sitemap-robots.test.ts`
- Test: `tests/routes/public-route-metadata.test.ts`
- Test: `tests/routes/static-routes.test.ts`
- Test: `tests/routes/static-public-pages.test.ts`

**Interfaces:**
- Produces `PublicCanonicalPath` support for `/contact` and a separate indexable localized-entry function consumed only by the sitemap.
- Produces two static page modules whose metadata has `robots.index === false`.

- [ ] Write route, metadata, static-export, and sitemap-exclusion assertions before creating the pages.
- [ ] Run the focused tests and verify they fail because Contact routes and indexability boundaries do not exist.
- [ ] Add the minimal route type and split sitemap entries from all localized routes.
- [ ] Add two noindex page modules using `PublicPageShell` and existing metadata helpers.
- [ ] Re-run the focused tests and verify they pass.

### Task 2: Contact page content, form, and footer

**Files:**
- Create: `src/contact/contact-page-copy.ts`
- Create: `src/contact/contact-request-validation.ts`
- Create: `src/components/contact-form.tsx`
- Modify: `src/site-footer/site-footer-content.ts`
- Modify: `src/i18n/public-page-content.ts`
- Modify: `src/homepage/homepage-copy.ts`
- Modify: `app/globals.css`
- Test: `tests/contact/contact-page-copy.test.ts`
- Test: `tests/contact/contact-request-validation.test.ts`
- Test: `tests/components/contact-form.test.tsx`
- Test: `tests/components/site-footer.test.tsx`
- Test: `tests/components/public-page-shell.test.tsx`

**Interfaces:**
- `getContactPageCopy(locale)` returns localized title, labels, validation copy, request-status copy, and privacy-link copy.
- `validateContactRequest(value)` returns an exact valid normalized request or field-specific validation errors.
- `ContactForm({ copy, turnstileSiteKey })` owns browser form state and submits only validated data to `/api/contact`.

- [ ] Write failing copy, validation, static-form-markup, and footer-link tests.
- [ ] Run them and verify the missing modules/fields fail the intended assertions.
- [ ] Implement only the requested copy, native form semantics, client validation, invisible Turnstile integration, submit states, and screenshot-derived scoped CSS.
- [ ] Add Contact to the existing Legal footer group without adding a fourth group.
- [ ] Re-run focused tests and verify all pass.

### Task 3: Secure Cloudflare Worker boundary

**Files:**
- Create: `workers/contact-worker.ts`
- Create: `wrangler.jsonc`
- Test: `tests/workers/contact-worker.test.ts`

**Interfaces:**
- `handleContactRequest(request, environment, dependencies)` returns a `Response` and is the unit-testable Worker boundary.
- `ContactWorkerEnvironment` contains a `CONTACT_EMAIL.send()` binding plus only the required Secret/variable names.

- [ ] Write failing Worker tests for method/origin/content-type/schema rejection, Turnstile failure, hostname/action mismatch, upstream failure, and one approved send.
- [ ] Run the test and verify it fails because the Worker module does not exist.
- [ ] Implement strict POST handling, 16 KiB request cap, schema validation, server-side Siteverify validation, fixed plain-text email construction, and generic JSON error responses.
- [ ] Add a non-secret Wrangler configuration that restricts the sender address and routes only `/api/contact*`; do not insert a recipient address or secret.
- [ ] Re-run Worker tests and verify all pass.

### Task 4: Legal disclosure and route contract documentation

**Files:**
- Modify: `src/legal/legal-page-copy.ts`
- Modify: `src/reference/route-state-manifest.ts`
- Modify: `docs/reference/route-state-matrix.md`
- Test: `tests/legal/legal-page-copy.test.ts`
- Test: `tests/reference/route-state.test.ts`

**Interfaces:**
- Legal copy names the Contact data purpose, Cloudflare delivery, and 90-day maximum retention in both locales.
- The route-state contract knows the two new public Contact routes without asserting runtime behavior outside their static page shell.

- [ ] Write failing legal and route-contract tests for the agreed collection, delivery, and retention disclosures.
- [ ] Run them and verify they fail before copy/manifest changes.
- [ ] Implement only the approved disclosure and exact new route entries.
- [ ] Re-run focused tests and verify all pass.

### Task 5: Integration verification and review

**Files:**
- Verify only the files above plus the two design/plan documents.

- [ ] Run every focused Contact, routing, footer, legal, and Worker test together.
- [ ] Run `pnpm typecheck` and `pnpm build`.
- [ ] Serve `out/`, inspect `/contact` and `/zh/contact` at desktop and mobile width, and verify fields, keyboard focus, `noindex`, footer links, and sitemap exclusion.
- [ ] Compare `git diff --check` and `git status --short` to the recorded baseline; do not alter the user's existing dirty files beyond the approved minimal CSS append.
- [ ] Report the known full-suite baseline failures separately; do not repair them.
