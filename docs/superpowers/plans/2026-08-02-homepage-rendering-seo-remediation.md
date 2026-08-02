# Homepage Rendering and SEO Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the homepage's hydration-dependent first-frame styling, render FAQ answers in initial HTML, and publish one original 1200×630 social image across all 22 canonical static pages.

**Architecture:** Use the server-rendered `data-homepage-shell` direct child as the only homepage CSS scope, native `details` disclosures for FAQ content, and the existing shared metadata factory for the single social image. Preserve the frozen client-only planner boundary and every unrelated dirty working-tree change.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 5.9, CSS, Vitest 3, SVG, PNG, macOS `sips`, Hermes CDP.

## Global Constraints

- Work in the approved current checkout on `main`; do not create a branch or worktree.
- Do not commit, stage, push, deploy, install dependencies, or modify lockfiles.
- Preserve all pre-existing dirty changes, especially wheel-mode declarations in `public/reference-runtime/local-only-overrides.css` and their tests.
- Do not modify `public/_app/immutable/**`, `public/reference-runtime/bootstrap.mjs`, `public/reference-runtime/wheel-zoom-mode-toggle.mjs`, `ReferenceRuntimeHost`, planner storage, planner controls, or route structure.
- Keep `ReferenceRuntimeHost` client-only with `ssr: false`; keep the planner on `/`.
- Keep the frozen runtime's `planner-active` state behavior; migrate only its homepage scope.
- Use high cohesion, low coupling, single-responsibility functions, explicit interfaces, KISS, Fail Fast, YAGNI, and precise names. Do not introduce names such as `data`, `temp`, `helper`, `util`, or `manager`.
- Do not catch exceptions that the caller cannot handle. Never silently ignore an error.
- Use TDD for every behavior: write the test, run it and record the expected failure, implement the minimum change, then rerun and record the passing result.
- Use `apply_patch` for text-file changes. The only binary-producing command allowed is the approved SVG-to-PNG export.
- Do not use game screenshots, game characters, game logos, or game-derived artwork in the social image.

---

### Task 1: Hydration-independent homepage scope and native FAQ

**Files:**
- Modify: `tests/homepage/homepage-style-contract.test.ts`
- Modify: `tests/reference-runtime/local-only-overrides.test.ts`
- Modify: `tests/routes/public-page-style-contract.test.ts`
- Modify: `tests/routes/planner-editor-page.test.tsx`
- Modify: `tests/routes/static-public-pages.test.ts`
- Modify: `src/components/homepage-planner-workspace.tsx`
- Modify: `src/components/homepage-content.tsx`
- Modify: `app/globals.css`
- Modify: `public/reference-runtime/local-only-overrides.css`

**Interfaces:**
- Consumes: the direct body child `<div data-homepage-shell>` emitted by `PlannerHomepage` and `HomepageCopy.faq.items`.
- Produces: CSS scoped by `body:has(> [data-homepage-shell])`; native closed-by-default `details` elements whose answers are present in static markup.

- [ ] **Step 1: Add failing first-frame and isolation contracts**

Update the existing style tests to require the structural scope and reject the hydration-only scope. Preserve all assertions that protect the wheel-mode size and spacing declarations.

```ts
const homepageBodyScope = "body:has(> [data-homepage-shell])";

expect(styles).toContain(homepageBodyScope);
expect(styles).toContain(`${homepageBodyScope}.planner-active`);
expect(styles).not.toContain("body.stardew-homepage");
expect(overrides).toContain(`${homepageBodyScope} #reference-runtime-root`);
expect(overrides).not.toContain("body.stardew-homepage");
```

In `tests/routes/public-page-style-contract.test.ts`, keep the public-style isolation assertion and update the homepage fixture to the new scope:

```ts
expect(existingHomepageStyles).toContain(
  "  body:has(> [data-homepage-shell]) [data-homepage-capability-number] {\n    margin-bottom: 2rem;\n  }",
);
expect(publicStyleBlock).not.toContain("body:has(> [data-homepage-shell])");
```

- [ ] **Step 2: Add a failing static FAQ behavior test**

Extend `tests/routes/planner-editor-page.test.tsx` using the existing real `PlannerPage` render. Derive expected answers from `homepageCopyByLocale.en` and assert actual disclosure markup:

```tsx
const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

expect(plannerPageMarkup.match(/<details>/g)).toHaveLength(3);
expect(plannerPageMarkup.match(/<summary>/g)).toHaveLength(3);
expect(plannerPageMarkup).not.toContain("<details open");

for (const faqItem of homepageCopyByLocale.en.faq.items) {
  expect(plannerPageMarkup).toContain(faqItem.question);
  expect(plannerPageMarkup).toContain(faqItem.answer);
}
```

Add the three literal English answers to the `index.html` branch in `tests/routes/static-public-pages.test.ts` so the build artifact, not only React rendering, is protected.

- [ ] **Step 3: Run the targeted tests and record RED**

Run:

```bash
pnpm exec vitest run \
  tests/homepage/homepage-style-contract.test.ts \
  tests/reference-runtime/local-only-overrides.test.ts \
  tests/routes/public-page-style-contract.test.ts \
  tests/routes/planner-editor-page.test.tsx \
  tests/routes/static-public-pages.test.ts
```

Expected: failures name the missing structural CSS scope, remaining `body.stardew-homepage` selectors, missing native `details` markup, and absent FAQ answers in the current prebuilt `out/index.html`.

- [ ] **Step 4: Remove the homepage body-class effect**

Make `HomepagePlannerWorkspace` a render-only component. Keep its client boundary and planner host unchanged:

```tsx
"use client";

import { ReferenceRuntimeHost } from "./reference-runtime-host";

export function HomepagePlannerWorkspace() {
  return (
    <section data-homepage-workspace id="planner">
      <ReferenceRuntimeHost />
    </section>
  );
}
```

- [ ] **Step 5: Migrate only the homepage CSS scope**

In the homepage block of `app/globals.css`, mechanically replace every `body.stardew-homepage` prefix with `body:has(> [data-homepage-shell])`. The runtime state must become:

```css
body:has(> [data-homepage-shell]).planner-active {
  /* preserve the existing declarations verbatim */
}
```

In `public/reference-runtime/local-only-overrides.css`, replace only the ten shared scope prefixes:

```css
body:has(> [data-homepage-shell]) #reference-runtime-root
```

Do not alter any declaration, media query, wheel-mode attribute selector, dimension, spacing value, transition, or ordering.

- [ ] **Step 6: Replace the FAQ accordion with native disclosures**

Remove only the Accordion imports from `HomepageContent`. Keep the UI accordion module and dependency untouched. Render:

```tsx
<div data-homepage-faq-list>
  {copy.faq.items.map((faqItem, faqIndex) => (
    <details key={`faq-${faqIndex}`}>
      <summary>{faqItem.question}</summary>
      <p>{faqItem.answer}</p>
    </details>
  ))}
</div>
```

Replace only the FAQ accordion selectors in `app/globals.css` with scoped `details`, `summary`, and answer rules. Preserve the existing border, typography, spacing, and color values; add a visible `:focus-visible` outline for `summary`. Do not add React state or JavaScript event handling.

- [ ] **Step 7: Rebuild and record GREEN**

Run serially:

```bash
pnpm exec vitest run \
  tests/homepage/homepage-style-contract.test.ts \
  tests/reference-runtime/local-only-overrides.test.ts \
  tests/routes/public-page-style-contract.test.ts \
  tests/routes/planner-editor-page.test.tsx
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run tests/routes/static-public-pages.test.ts
```

Expected: every named test passes, the production build exits 0, and the rebuilt homepage artifact contains all FAQ answers.

- [ ] **Step 8: Review Task 1 before continuing**

The implementer writes a report containing the RED and GREEN commands and outputs, exact files changed, preservation checks for wheel-mode CSS, and self-review. A fresh reviewer must return both spec-compliance and code-quality verdicts before Task 2 starts.

---

### Task 2: Deterministic social card and shared metadata

**Files:**
- Create: `tests/assets/social-image.test.ts`
- Modify: `tests/seo/page-metadata.test.ts`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`
- Create: `public/social-images/stardew-valley-farm-planner.svg`
- Create: `public/social-images/stardew-valley-farm-planner.png`
- Modify: `src/seo/page-metadata.ts`

**Interfaces:**
- Consumes: the validated exported `publicSiteUrl` origin and the existing `createPublicPageMetadata()` route interface.
- Produces: `https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png` in both social metadata channels for all 22 pages, plus a static 1200×630 PNG.

- [ ] **Step 1: Add failing metadata tests**

Define the literal expected URL in the tests:

```ts
const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

expect(metadata.openGraph).toMatchObject({
  images: [expectedSocialImageUrl],
});
expect(metadata.twitter).toMatchObject({
  images: [expectedSocialImageUrl],
});
```

Extend the existing localized route loops in `tests/routes/public-route-metadata.test.ts` so all 3 English fixed pages, 8 English farms, 3 Chinese fixed pages, and 8 Chinese farms prove they inherit the same URL without adding an image parameter to route calls.

- [ ] **Step 2: Add a failing asset delivery test**

Create `tests/assets/social-image.test.ts`. Keep the PNG parser test-local and fail fast with received values:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function readPngDimensions(pngFilePath: string) {
  const pngBytes = readFileSync(pngFilePath);

  if (!pngBytes.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`Social image must be a PNG. Received file: ${pngFilePath}.`);
  }
  if (pngBytes.subarray(12, 16).toString("ascii") !== "IHDR") {
    throw new Error(`Social image PNG must begin with IHDR. Received file: ${pngFilePath}.`);
  }

  return {
    width: pngBytes.readUInt32BE(16),
    height: pngBytes.readUInt32BE(20),
  };
}

test("delivers the approved 1200 by 630 social image", () => {
  const pngFilePath = resolve(
    process.cwd(),
    "public/social-images/stardew-valley-farm-planner.png",
  );
  const dimensions = readPngDimensions(pngFilePath);

  expect(
    dimensions,
    `Expected ${pngFilePath} to be 1200x630; received ${dimensions.width}x${dimensions.height}.`,
  ).toEqual({ width: 1200, height: 630 });
});
```

Extend `tests/routes/static-public-pages.test.ts` so every entry in `staticPublicPageExpectations` contains exact `og:image` and `twitter:image` tags and `out/social-images/stardew-valley-farm-planner.png` exists.

- [ ] **Step 3: Run the targeted tests and record RED**

Run:

```bash
pnpm exec vitest run \
  tests/seo/page-metadata.test.ts \
  tests/routes/public-route-metadata.test.ts \
  tests/assets/social-image.test.ts \
  tests/routes/static-public-pages.test.ts
```

Expected: metadata assertions fail because images are absent, the asset test fails because the PNG does not exist, and the current build artifact lacks both image tags.

- [ ] **Step 4: Add the original editable SVG source**

Create a 1200×630 SVG using only original rectangles, lines, paths, circles, gradients, and exact existing copy. Required text is:

```text
Interactive farm planning
Stardew Valley Farm Planner
Plan Stardew Valley farm layouts in your browser with an interactive map.
stardewvalleyplanner.art
```

Required palette is `#141e17`, `#fdfff8`, `#c9fb45`, `#242a22`, and `#5d6659`. The right side uses an abstract farm-planning grid and route line; it must not embed raster images or reference external assets.

- [ ] **Step 5: Export and verify the PNG**

Run the approved local converter:

```bash
/usr/bin/sips -s format png -z 630 1200 \
  public/social-images/stardew-valley-farm-planner.svg \
  --out public/social-images/stardew-valley-farm-planner.png
/usr/bin/sips -g pixelWidth -g pixelHeight \
  public/social-images/stardew-valley-farm-planner.png
```

Expected dimensions: `pixelWidth: 1200`, `pixelHeight: 630`. Visually inspect the resulting PNG before it is referenced by metadata; reject clipped, incorrect, illegible, or game-derived content.

- [ ] **Step 6: Add the shared metadata image**

Keep `PublicPageMetadataInput` unchanged. Import the existing validated public origin and add one private constant without misusing the canonical-URL function for an asset:

```ts
const sharedSocialImageUrl = new URL(
  "/social-images/stardew-valley-farm-planner.png",
  publicSiteUrl,
).toString();
```

Add the same one-element array to both channels:

```ts
openGraph: {
  title: input.title,
  description: input.description,
  type: openGraphType,
  url: canonicalUrl,
  images: [sharedSocialImageUrl],
},
twitter: {
  card: "summary",
  title: input.title,
  description: input.description,
  images: [sharedSocialImageUrl],
},
```

Do not change the route modules or add per-page image configuration.

- [ ] **Step 7: Rebuild and record GREEN**

Run serially:

```bash
pnpm exec vitest run \
  tests/seo/page-metadata.test.ts \
  tests/routes/public-route-metadata.test.ts \
  tests/assets/social-image.test.ts
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run tests/routes/static-public-pages.test.ts
```

Expected: all targeted tests pass; all 22 static pages contain both absolute image tags; the static export copies the PNG.

- [ ] **Step 8: Review Task 2 before continuing**

The implementer writes a report containing RED/GREEN evidence, the exact SVG-to-PNG command, received dimensions, files changed, visual inspection result, and self-review. A fresh reviewer must return both spec-compliance and code-quality verdicts before final verification.

---

### Task 3: Full regression and Hermes CDP acceptance

**Files:**
- No production file changes unless a verified Task 1 or Task 2 regression requires the approved fix loop.
- Create only ignored SDD evidence under this plan's `.superpowers/sdd/` workspace.

**Interfaces:**
- Consumes: completed and reviewed Task 1 and Task 2 working-tree changes.
- Produces: fresh full-suite, build, typecheck, artifact-count, visual, interaction, and route-isolation evidence.

- [ ] **Step 1: Run the serial automated verification gate**

```bash
pnpm typecheck
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run
git diff --check
```

Expected: every command exits 0. Record exact test-file and test counts from Vitest.

- [ ] **Step 2: Verify generated metadata counts**

```bash
test "$(rg -l --glob '*.html' 'property="og:image"' out | wc -l | tr -d ' ')" = "22"
test "$(rg -l --glob '*.html' 'name="twitter:image"' out | wc -l | tr -d ' ')" = "22"
/usr/bin/sips -g pixelWidth -g pixelHeight out/social-images/stardew-valley-farm-planner.png
```

Expected: both shell assertions exit 0 and the exported PNG is 1200×630.

- [ ] **Step 3: Use Hermes CDP for cold-load homepage acceptance**

Serve the fresh `out/` build without HMR. Through real CDP input and screenshots, verify:

- the first captured homepage frame already uses the light homepage background and intended typography;
- `body` has no `stardew-homepage` class and the homepage is vertically scrollable;
- all three FAQ disclosures are initially closed, expand with pointer input, and toggle with keyboard Enter/Space;
- the planner initializes exactly one runtime root and remains usable;
- the wheel-mode toolbar control remains aligned and operational;
- the browser console has no new errors or warnings;
- desktop and 390×844 layouts have no horizontal overflow.

- [ ] **Step 4: Verify route isolation**

Cold-load `/farm-comparison`, `/mods`, `/farm/standard`, `/zh`, and `/zh/farm-comparison`. Confirm none inherits homepage-only background/scroll/FAQ styles and no non-homepage route mounts the reference runtime.

- [ ] **Step 5: Inspect the final scope and request whole-change review**

Use `git status --short`, file-scoped diffs, and the initial dirty-state record to distinguish this plan's files from user-owned changes. Confirm no immutable runtime, bootstrap, wheel module, lockfile, route structure, or unrelated document changed. Dispatch one fresh final reviewer over this plan's complete review package. Any verified Critical or Important finding enters one subagent fix wave and one scoped re-review; the controller must not silently fix or discard it.

- [ ] **Step 6: Report without committing**

Report exact verification results, modified/created files, preserved unrelated dirty changes, social image path and final appearance, and any residual limitation. Do not stage or commit.
