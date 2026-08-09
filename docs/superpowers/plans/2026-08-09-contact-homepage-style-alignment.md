# Contact Page Homepage Style Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Contact-only black/gold presentation with the current homepage visual system on both localized Contact routes without changing form behavior.

**Architecture:** Keep the existing `PublicPageShell`, shared Contact components, and request flow unchanged. Establish the failure through the rendered page's computed styles, then replace only the final Contact style block in `app/globals.css` with homepage-derived colors, borders, radii, focus states, and responsive layout rules.

**Tech Stack:** Next.js 16.3 App Router static export, React 19, TypeScript 5.9, Tailwind CSS 4 global stylesheet, Vitest 3.2.

## Global Constraints

- Modify only the approved design/plan documents and the Contact-specific block in `app/globals.css`.
- Keep `/contact` and `/zh/contact` DOM, copy, metadata, fields, validation, Turnstile integration, request endpoint, and feedback behavior unchanged.
- Reuse exact homepage tokens: `#fdfff8`, `#1c211b`, `#52604e`, `#f1f7e7`, `#ffffff`, `#c9fb45`, `#d4ff61`, and `#759d1c`.
- Preserve the compact `60rem` Contact header/form width, desktop two-column Name/Email row, mobile one-column row, and `12rem` resizable textarea.
- Add no dependency, asset, JavaScript animation, API, environment variable, deployment change, or unrelated refactor.
- Do not modify an Obsidian Mermaid diagram.
- Do not stage, commit, push, deploy, or change external configuration.
- A fresh build from this checkout is required; the existing port 3002 server belongs to another `/private/tmp` worktree and is invalid verification evidence.

---

### Task 1: Establish the rendered Contact failure

**Files:**
- Verify: `app/globals.css`

**Interfaces:**
- Consumes: the current checkout served by Next.js development mode.
- Produces: browser-computed evidence that the current Contact surface fails the approved homepage palette, title visibility, and component geometry.

- [ ] **Step 1: Start this checkout on verified local port 4174**

```bash
lsof -nP -iTCP:4174 -sTCP:LISTEN
pnpm exec next dev -p 4174
```

- [ ] **Step 2: Verify the failure through computed styles at `/contact`**

Evaluate the rendered shell, title, form, input, and submit button. The red check requires all homepage expectations and reports every mismatch:

```js
const failures = [];
if (getComputedStyle(document.querySelector("[data-public-page-shell]")).color !== "rgb(28, 33, 27)") failures.push("shell foreground");
if (getComputedStyle(document.querySelector(".contact-page-title")).position === "absolute") failures.push("visible title");
if (getComputedStyle(document.querySelector(".contact-form")).backgroundColor !== "rgb(241, 247, 231)") failures.push("form surface");
if (getComputedStyle(document.querySelector(".contact-form-submit")).backgroundColor !== "rgb(201, 251, 69)") failures.push("submit fill");
if (failures.length > 0) throw new Error(`Contact homepage style mismatches: ${failures.join(", ")}`);
```

Expected: FAIL with mismatches for the shell foreground, hidden title, form surface, and submit fill.

---

### Task 2: Replace only the Contact presentation block

**Files:**
- Modify: `app/globals.css:2426-2610`
- Verify: `tests/contact/contact-form.test.tsx`

**Interfaces:**
- Consumes: existing class names from `src/contact/contact-page-content.tsx` and `src/contact/contact-form.tsx`.
- Produces: light homepage-aligned Contact presentation shared by `/contact` and `/zh/contact`.

- [ ] **Step 1: Read the installed Next.js 16 App Router CSS guide before editing**

Run:

```bash
sed -n '1,260p' node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
```

Expected: confirms that global styles remain appropriate for existing globally scoped class selectors imported by the App Router layout.

- [ ] **Step 2: Replace the Contact-only dark shell overrides**

Use the existing homepage background atmosphere exactly on the Contact public shell:

```css
[data-public-page-shell]:has(.contact-page-content) {
  background:
    radial-gradient(
      ellipse 80rem 52rem at -22rem -8rem,
      rgb(201 251 69 / 56%) 0%,
      rgb(226 255 173 / 42%) 40%,
      rgb(245 255 231 / 20%) 65%,
      rgb(253 255 248 / 0%) 84%
    ),
    radial-gradient(
      ellipse 80rem 52rem at calc(100% + 22rem) -8rem,
      rgb(201 251 69 / 56%) 0%,
      rgb(226 255 173 / 42%) 40%,
      rgb(245 255 231 / 20%) 65%,
      rgb(253 255 248 / 0%) 84%
    ),
    #fdfff8;
  color: #1c211b;
}
```

Delete the Contact-only header, navigation, language switcher, footer, and `main` dark-color overrides so `PublicPageShell` supplies its normal light structure.

- [ ] **Step 3: Implement the visible header hierarchy and compact light form**

Set these exact presentation boundaries in the existing Contact selectors:

```css
.contact-page-content {
  color: #1c211b;
}

.contact-page-header,
.contact-form {
  margin-inline: auto;
  max-width: 60rem;
}

.contact-page-title {
  color: #1c211b;
  font-size: clamp(3rem, 5.6vw, 5.25rem);
  letter-spacing: -0.055em;
  line-height: 0.94;
  margin: 0.75rem 0 1.25rem;
  max-width: 13ch;
  text-wrap: balance;
}

.contact-form {
  background: #f1f7e7;
  border: 1px solid rgb(36 42 34 / 72%);
  border-radius: 0.5rem;
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2rem);
}
```

Apply `#ffffff` inputs, `#1c211b` labels/text, `#52604e` muted copy, `0.45rem` input/button radii, `#759d1c` focus treatment, `#c9fb45` submit fill, `#d4ff61` submit hover fill, and the homepage hard offset button shadow. Keep the existing icon, `4rem` input minimum, `12rem` textarea minimum, `resize: vertical`, feedback placement, and sub-200ms local transitions.

- [ ] **Step 4: Preserve the responsive contract**

At `max-width: 700px`, keep:

```css
.contact-form-name-email {
  grid-template-columns: 1fr;
}

.contact-form-submit {
  width: 100%;
}
```

Use the same `0.5rem` form radius at mobile width, reduce only padding/gaps, and do not add a Contact-only navigation rule.

- [ ] **Step 5: Re-run the browser style check and existing Contact form test**

Run:

```bash
pnpm exec vitest run tests/contact/contact-form.test.tsx
```

Expected: the browser-computed style check reports no mismatch and the existing Contact form test passes.

---

### Task 3: Verify the fresh static build and rendered pages

**Files:**
- Verify: `app/globals.css`
- Verify: `docs/superpowers/specs/2026-08-09-contact-homepage-style-alignment-design.md`
- Verify: `docs/superpowers/plans/2026-08-09-contact-homepage-style-alignment.md`

**Interfaces:**
- Consumes: the completed Contact CSS and current static-export configuration.
- Produces: evidence that both locales render correctly from this checkout at desktop and mobile widths.

- [ ] **Step 1: Run static and type verification**

Run:

```bash
pnpm typecheck
pnpm build
git diff --check
```

Expected: all commands exit successfully.

- [ ] **Step 2: Serve the freshly built `out/` directory on a verified unused port**

Verify that port 4174 is unused, then run the existing static server from this checkout. Do not reuse port 3002.

```bash
lsof -nP -iTCP:4174 -sTCP:LISTEN
pnpm exec serve out --listen tcp://127.0.0.1:4174
```

Expected: `lsof` returns no listener before startup, then the server reports `http://127.0.0.1:4174` rooted in this checkout's newly generated `out/` directory. If port 4174 is already occupied, stop and select one explicit unused port before starting the server.

- [ ] **Step 3: Inspect both locales in the browser**

At desktop width and `390x844`, inspect `/contact` and `/zh/contact` and verify:

- warm off-white/lime homepage atmosphere;
- visible localized `h1`;
- light form surface and lime submit action;
- two desktop columns and one mobile column;
- textarea resizing remains enabled;
- keyboard focus is visible;
- `document.documentElement.scrollWidth === document.documentElement.clientWidth` at 390px;
- no black/gold Contact theme remains;
- header and footer retain their shared public-page structure.

- [ ] **Step 4: Inspect browser logs and final repository scope**

Run or inspect:

```bash
git status --short
git diff --check
git diff -- app/globals.css docs/superpowers/specs/2026-08-09-contact-homepage-style-alignment-design.md docs/superpowers/plans/2026-08-09-contact-homepage-style-alignment.md
```

Expected: no new browser errors caused by Contact, no whitespace errors, and no changed file outside the approved three-file scope.

## Execution mode

Execute inline in the current session because the user authorized continued implementation and did not request subagent delegation. Do not create a worktree or commit.
