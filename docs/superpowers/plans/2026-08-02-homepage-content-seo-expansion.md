# Homepage Content SEO Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` to execute this plan task by task.
> Every implementation task uses a fresh implementer followed by read-only
> specification and code-quality review. Do not commit.

**Goal:** Expand the existing `/` homepage for the keyword
`stardew valley planner` with verified English and Simplified Chinese content,
official farm-guide discovery links, accurate footer labels, and exact homepage
metadata while preserving the interactive planner and every pre-existing dirty
working-tree change.

**Architecture:** Keep `PlannerHomepage` as the locale-state owner and
`HomepageContent` as the composition boundary. Extend the existing typed
`HomepageCopy` contract, add one focused `HomepageFarmGuideLinks` component
that consumes the existing farm/localization/route interfaces, and keep all
new presentation inside the current homepage CSS scope. Change only the
English root route metadata; do not change the shared metadata factory or the
standalone `/zh` route.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 5.9, CSS,
Vitest 3, frozen Svelte/Pixi planner runtime, in-app browser CDP.

## Global Constraints

- Work in the approved current checkout on `main`; do not create a branch or
  worktree.
- Treat the exact captured dirty tree as protected user-owned baseline.
- Baseline evidence is stored under
  `.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/`:
  - `git-status-before.txt`
  - `tracked-diff-before.patch`
  - `untracked-files-before.txt`
  - `baseline-sha256.txt`
- Do not stage, commit, stash, reset, clean, push, deploy, install dependencies,
  modify lockfiles, or reformat unrelated files.
- Do not modify `public/_app/immutable/**`, `public/reference-runtime/**`,
  `src/components/homepage-planner-workspace.tsx`,
  `src/seo/page-metadata.ts`, `app/zh/**`, planner storage, planner controls,
  structured-data factories, route registries, or farm-guide source records.
- Production edits are limited to:
  - `app/(en)/page.tsx`
  - `app/globals.css`
  - `src/components/homepage-content.tsx`
  - `src/components/homepage-farm-guide-links.tsx`
  - `src/homepage/homepage-copy.ts`
- Test edits are limited to:
  - `tests/fixtures/browser/minimal-stardew-save.xml`
  - `tests/homepage/homepage-copy.test.ts`
  - `tests/homepage/homepage-farm-guide-links.test.tsx`
  - `tests/homepage/homepage-style-contract.test.ts`
  - `tests/routes/planner-editor-page.test.tsx`
  - `tests/routes/public-route-metadata.test.ts`
  - `tests/routes/static-public-pages.test.ts`
- Keep `/` as the interactive planner route. Keep the current client-side
  language mode on `/`. Do not turn `/zh` into a planner route.
- Use existing public interfaces only:
  `officialFarmTypes`, `getLocalizedOfficialFarmGuide()`, and
  `getLocalizedPublicPath()`.
- Use high cohesion, low coupling, single responsibility, explicit interfaces,
  KISS, Fail Fast, YAGNI, and precise names. Do not introduce classes, strategy
  objects, state containers, or generic abstractions.
- Never catch an exception that cannot be handled. Never silently ignore an
  error.
- Follow TDD: write behavior assertions, run and record RED, implement the
  minimum change, then run and record GREEN.
- Apply text changes with `apply_patch`.
- Before and after each task, record `git status --short` and file-scoped diffs
  under the ignored SDD evidence directory. A read-only reviewer compares the
  task's before/after diff to `tracked-diff-before.patch` and confirms that no
  baseline hunk or untracked path disappeared.
- For baseline files outside the task's authorized file list, verify their
  entries from `baseline-sha256.txt` still match. For authorized files already
  dirty at baseline, compare the current file directly with the task's saved
  pre-task copy/diff and review only the new delta.
- A failed import or user-approved screenshot interaction preflight stops the
  entire task before any production-content file is edited. Do not weaken or
  silently omit claims.

---

### Task 1: Prove game-save import and screenshot interactions in a fresh build

**Files:**

- Create: `tests/fixtures/browser/minimal-stardew-save.xml`
- Create ignored evidence only under:
  `.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/preflight/`
- Do not modify any production file.

**Interfaces:**

- Consumes: visible frozen-runtime controls `Import Game Save`, `Screenshot`,
  and `Screenshot (HQ)` from a fresh static export.
- Produces: a repeatable evidence report proving the exact claims allowed by
  the approved design. The screenshot gate proves browser download events and
  success feedback, not file format, filename, size, or byte content.

- [ ] **Step 1: Add the exact upload fixture**

Create the approved fixture verbatim:

```xml
<SaveGame xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <whichFarm>0</whichFarm>
  <currentSeason>summer</currentSeason>
  <player><farmName>Junimo</farmName></player>
  <locations>
    <GameLocation>
      <name>Farm</name>
      <buildings>
        <Building><buildingType>Barn</buildingType><tileX>10</tileX><tileY>12</tileY></Building>
      </buildings>
      <objects></objects>
      <terrainFeatures></terrainFeatures>
      <resourceClumps></resourceClumps>
      <largeTerrainFeatures></largeTerrainFeatures>
      <furniture></furniture>
    </GameLocation>
  </locations>
</SaveGame>
```

- [ ] **Step 2: Build and serve the baseline without development HMR**

Run:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec serve out --listen 4173
```

Before starting the server, fail if TCP port `4173` is already occupied. Do
not kill an unrelated process. Require `http://127.0.0.1:4173/` to return 200.

- [ ] **Step 3: Select the browser and record the clean-load baseline**

Follow `browser:control-in-app-browser`. Because the target URL is known and
the user did not select a browser family, select with
`getForUrl("http://127.0.0.1:4173/")`, read that browser's complete
documentation once, then reuse the same binding.

Cold-load `/` and wait for exactly one
`#reference-runtime-root[data-reference-runtime-initialized="true"]`. Fail if
that selector's count is not exactly one before recording the console baseline
or interacting with any planner control. Then record every console
warning/error as a fingerprint of:

```text
level | exact message text | occurrence count
```

Any second runtime root, initialization timeout, page error, or navigation
failure stops the task.

- [ ] **Step 4: Verify real save import**

Upload `tests/fixtures/browser/minimal-stardew-save.xml` through the visible
`Import Game Save` file input. Require exactly one visible
`.map-switch-overlay`, require its text to contain exact `Junimo Farm`, and
require it not to contain an import-failure message. Require post-import
warning/error fingerprints and counts not to exceed the clean-load baseline.

- [ ] **Step 5: Verify both screenshot interactions**

Use the documented `tab.playwright.waitForEvent("download")` API. Immediately
before clicking `Screenshot`, register one isolated download-event wait. Require
that click to produce exactly one event and one visible `Screenshot saved`
success notification. Then register a new isolated wait immediately before
clicking `Screenshot (HQ)` and require one additional event and one visible
`Screenshot saved` success notification.

Require exactly two download events in total. Require post-download
warning/error fingerprints and occurrence counts not to exceed the clean-load
baseline. Do not inspect or claim a suggested filename, persisted path, file
size, file bytes, PNG signature, or output format.

- [ ] **Step 6: Write and independently review the evidence**

Record the build command/result, served path, URL, fixture path, runtime-root
count, overlay text, the two exact screenshot button labels, the download-event
count and visible success notification for each click, and console fingerprints
before/after in `preflight/report.md`. Explicitly record that filename, path,
size, bytes, signature, and output format were not verified. Stop the server
cleanly after evidence capture.

A read-only reviewer must return `READY` before Task 2. Any failed assertion
ends implementation and is reported to the user without content changes.

---

### Task 2: Add failing homepage content, localization, link, and style contracts

**Files:**

- Modify: `tests/homepage/homepage-copy.test.ts`
- Create: `tests/homepage/homepage-farm-guide-links.test.tsx`
- Modify: `tests/homepage/homepage-style-contract.test.ts`
- Modify: `tests/routes/planner-editor-page.test.tsx`
- Modify: `tests/routes/public-route-metadata.test.ts`
- Modify: `tests/routes/static-public-pages.test.ts`

**Interfaces:**

- Consumes: approved copy and route outcomes from the design specification.
- Produces: implementation-independent tests over public copy, rendered markup,
  localized links, scoped styles, route metadata, and built HTML.

- [ ] **Step 1: Extend the bilingual copy contract**

In `tests/homepage/homepage-copy.test.ts`, retain locale/key parity checks and
add assertions that both locales have three capability items, five FAQ items,
`farmGuides`, and `trust`. Assert the exact approved H1 fragments, footer labels,
and experimental import/screenshot limitations.

Representative assertions:

```ts
expect(homepageCopyByLocale.en.hero).toMatchObject({
  headlineBefore: "Stardew Valley ",
  headlineEmphasis: "Planner",
  headlineAfter: " for Every Farm Layout",
});
expect(homepageCopyByLocale["zh-CN"].faq.items).toHaveLength(5);
expect(homepageCopyByLocale.en.footer.moddedFarmsLinkLabel).toBe(
  "Modded farms",
);
expect(homepageCopyByLocale["zh-CN"].footer.moddedFarmsLinkLabel).toBe(
  "模组农场",
);
```

- [ ] **Step 2: Add focused farm-link component tests**

Create `tests/homepage/homepage-farm-guide-links.test.tsx`. Render the real
component with `renderToStaticMarkup()` for `en` and `zh-CN`; derive expected
farm destinations from `officialFarmTypes` instead of duplicating them.

Require each locale to render:

- one comparison link;
- exactly eight `data-homepage-farm-guide-link` anchors;
- localized farm titles from `getLocalizedOfficialFarmGuide()`;
- English destinations `/farm-comparison` and `/farm/<type>`;
- Chinese destinations `/zh/farm-comparison` and `/zh/farm/<type>`.

- [ ] **Step 3: Extend real homepage render assertions**

In `tests/routes/planner-editor-page.test.tsx`, render the real `PlannerPage`
and require:

```ts
expect(plannerPageMarkup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
expect(plannerPageMarkup).toContain(
  "Stardew Valley <em data-homepage-hero-emphasis=\"true\">Planner</em> for Every Farm Layout",
);
expect(plannerPageMarkup.match(/<details>/g)).toHaveLength(5);
expect(plannerPageMarkup.match(/data-homepage-farm-guide-link=/g)).toHaveLength(8);
expect(plannerPageMarkup).toContain("About this planner");
```

Keep every existing frozen-runtime exclusion assertion.

- [ ] **Step 4: Add exact route metadata assertions**

In `tests/routes/public-route-metadata.test.ts`, assert only the English root
metadata changes:

```ts
expect(plannerMetadata).toMatchObject({
  title: "Stardew Valley Planner – Interactive Farm Layout Tool",
  description:
    "Plan all 8 Stardew Valley farm types in your browser. Place buildings and crops, switch seasons, check coverage, and import game saves.",
});
```

Preserve canonical, language-alternate, Open Graph image, and Twitter image
assertions. Do not change the `/zh` page metadata expectations.

- [ ] **Step 5: Add scoped responsive-style assertions**

In `tests/homepage/homepage-style-contract.test.ts`, require a farm-link grid
under `body:has(> [data-homepage-shell])`, four columns on desktop, one column
inside the existing `@media (max-width: 700px)` block, and no unscoped
`[data-homepage-farm-guide-links]` selector.

- [ ] **Step 6: Update built-artifact expectations**

Change only the `/` entry and `index.html` branch in
`tests/routes/static-public-pages.test.ts` to require the approved title,
description, H1, three capability descriptions, five FAQ answers, trust
statement, one `/farm-comparison` link, eight `/farm/<type>` links, and the
`Modded farms` `/mods` link. Preserve all other 21 page expectations.

- [ ] **Step 7: Run and record RED**

Run:

```bash
pnpm exec vitest run \
  tests/homepage/homepage-copy.test.ts \
  tests/homepage/homepage-farm-guide-links.test.tsx \
  tests/homepage/homepage-style-contract.test.ts \
  tests/routes/planner-editor-page.test.tsx \
  tests/routes/public-route-metadata.test.ts \
  tests/routes/static-public-pages.test.ts
```

Expected: failures identify the missing copy fields/component, old three-item
FAQ, old root metadata/H1, absent farm links/trust section, and missing scoped
farm-link styles. Failures unrelated to these approved changes stop the task.

- [ ] **Step 8: Review test quality before implementation**

A fresh read-only reviewer verifies that tests assert public behavior, derive
farm paths from the existing source of truth, preserve route exclusions, and
do not test private implementation details or weaken baseline assertions.

---

### Task 3: Implement the minimum typed bilingual homepage expansion

**Files:**

- Modify: `src/homepage/homepage-copy.ts`
- Create: `src/components/homepage-farm-guide-links.tsx`
- Modify: `src/components/homepage-content.tsx`
- Modify: `app/(en)/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**

- `PlannerHomepage` remains the only locale-state owner.
- `HomepageContent` receives `HomepageCopy`, `HomepageLocale`, the locale
  callback, and the planner node; it only composes sections.
- `HomepageFarmGuideLinks` receives the current locale and
  `HomepageCopy["farmGuides"]`; it owns only official farm-link rendering.
- Farm names and destinations come only from existing public interfaces.

- [ ] **Step 1: Extend `HomepageCopy` without adding abstractions**

Add:

```ts
farmGuides: Readonly<{
  heading: string;
  description: string;
  comparisonLinkLabel: string;
}>;
trust: Readonly<{
  heading: string;
  description: string;
}>;
```

Expand the FAQ tuple to five entries and rename
`footer.farmGuidesLinkLabel` to `footer.moddedFarmsLinkLabel`. Replace the
English and Simplified Chinese values with the exact approved copy from the
design specification. Do not introduce fallback copy or locale conditionals.

- [ ] **Step 2: Add one farm-guide discovery component**

Create `src/components/homepage-farm-guide-links.tsx` with one exported
component and no state:

```tsx
type HomepageFarmGuideLinksProps = Readonly<{
  copy: HomepageCopy["farmGuides"];
  currentLocale: HomepageLocale;
}>;

export function HomepageFarmGuideLinks({
  copy,
  currentLocale,
}: HomepageFarmGuideLinksProps) {
  return (
    <section data-homepage-farm-guides id="farm-guides">
      <h2 id="homepage-farm-guides-heading">{copy.heading}</h2>
      <p>{copy.description}</p>
      <a
        data-homepage-farm-comparison-link
        href={getLocalizedPublicPath(currentLocale, "/farm-comparison")}
      >
        {copy.comparisonLinkLabel}
      </a>
      <div data-homepage-farm-guide-links>
        {officialFarmTypes.map((farmType) => {
          const farmGuide = getLocalizedOfficialFarmGuide(
            currentLocale,
            farmType,
          );

          return (
            <a
              data-homepage-farm-guide-link
              href={getLocalizedPublicPath(
                currentLocale,
                `/farm/${farmType}`,
              )}
              key={farmType}
            >
              {farmGuide.title}
            </a>
          );
        })}
      </div>
    </section>
  );
}
```

Use the exact existing imports. Do not duplicate the farm list, manually prefix
`/zh`, or read another component's state.

- [ ] **Step 3: Compose the approved homepage order**

In `HomepageContent`, render `HomepageFarmGuideLinks` after capabilities and
before FAQ. Render a semantic trust section after FAQ. Localize both footer
destinations through `getLocalizedPublicPath()`:

```tsx
<a href={getLocalizedPublicPath(currentLocale, "/farm-comparison")}>
  {copy.footer.farmComparisonLinkLabel}
</a>
<a href={getLocalizedPublicPath(currentLocale, "/mods")}>
  {copy.footer.moddedFarmsLinkLabel}
</a>
```

Do not change the planner workspace node, locale-switch callback, header
behavior, FAQ disclosure behavior, or component state.

- [ ] **Step 4: Change only English root metadata**

In `app/(en)/page.tsx`, use the exact approved metadata title and description.
Preserve the current structured-data factory call and its current product name;
do not change shared metadata interfaces or `/zh` metadata. If the existing
shared description constant would otherwise alter structured data, split it
into precisely named route-metadata and structured-data description constants
rather than silently changing schema content.

- [ ] **Step 5: Add only scoped farm/trust presentation**

In `app/globals.css`, add selectors prefixed by
`body:has(> [data-homepage-shell])` for:

- farm-section supporting copy;
- comparison CTA;
- `data-homepage-farm-guide-links` four-column desktop grid;
- farm link border/padding/focus/hover treatment;
- trust section border and readable measure;
- one-column farm grid in the existing `max-width: 700px` media query.

Reuse current CSS variables and border colors. Do not restyle the planner,
header, hero, capability cards, FAQ, footer, or public-page styles.

- [ ] **Step 6: Run targeted GREEN checks**

Run:

```bash
pnpm exec vitest run \
  tests/homepage/homepage-copy.test.ts \
  tests/homepage/homepage-farm-guide-links.test.tsx \
  tests/homepage/homepage-style-contract.test.ts \
  tests/routes/planner-editor-page.test.tsx \
  tests/routes/public-route-metadata.test.ts
pnpm typecheck
```

Expected: every named test and typecheck pass. Do not run the stale static
artifact test until Task 4 rebuilds `out/`.

- [ ] **Step 7: Review implementation before rebuilding**

The implementer reports exact files and RED/GREEN results. A fresh spec reviewer
checks copy accuracy, section order, claim limitations, and localized routes. A
separate code-quality reviewer checks cohesion, interfaces, naming, baseline
preservation, and absence of unnecessary abstractions. Both must return READY.

---

### Task 4: Rebuild and verify crawler-visible output

**Files:**

- No production edits unless a verified Task 3 defect enters the approved fix
  loop.
- `out/` is generated and ignored.
- Evidence is written only under the ignored SDD directory.

- [ ] **Step 1: Build the static export**

Run:

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Expected: exit 0 with `/` and all existing public routes exported.

- [ ] **Step 2: Verify exact homepage artifact content**

Run:

```bash
pnpm exec vitest run tests/routes/static-public-pages.test.ts
```

Additionally inspect `out/index.html` and require:

- exact approved `<title>` and meta description;
- exactly one H1 containing the approved English heading;
- all three approved capability descriptions;
- five closed FAQ disclosures and their answers;
- one farm-comparison destination and eight official farm-guide destinations;
- the trust statement and `Modded farms` `/mods` footer link;
- one client-render bailout boundary for the frozen planner;
- no second `reference-runtime-root` and no iframe.

- [ ] **Step 3: Run the full automated gate serially**

```bash
pnpm typecheck
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run
git diff --check
```

Expected: every command exits 0. Record the exact Vitest file/test counts and
build route results. If a command fails, report and diagnose before editing.

- [ ] **Step 4: Verify protected baseline scope**

Record current status and task-scoped diffs. Verify all non-authorized baseline
hash entries still pass and all 12 baseline untracked paths still exist. For
the authorized files that were already dirty at baseline—`app/globals.css`,
`src/components/homepage-content.tsx`,
`tests/homepage/homepage-style-contract.test.ts`,
`tests/routes/planner-editor-page.test.tsx`,
`tests/routes/public-route-metadata.test.ts`, and
`tests/routes/static-public-pages.test.ts`—compare their new delta against
task-specific pre-task copies/diffs. A read-only reviewer must confirm no prior
hunk was removed or reformatted.

---

### Task 5: Real-browser bilingual and regression acceptance

**Files:**

- No production edits unless a verified regression enters one scoped fix wave.
- Store screenshots and the final report only under the ignored SDD directory.

- [ ] **Step 1: Serve the fresh export and cold-load desktop `/`**

Serve `out/` on an unoccupied local port without HMR and reuse the documented
browser binding. At desktop size, require:

- exactly one H1 and one initialized runtime root;
- visible hero, workspace, three capability cards, farm section, five FAQ
  disclosures, trust section, and footer;
- one `/farm-comparison`, eight `/farm/<type>`, and one `/mods` footer link;
- no horizontal overflow and no blocked planner interaction;
- FAQ pointer and keyboard Enter/Space toggling works;
- console warning/error fingerprints do not exceed the Task 1 baseline.

- [ ] **Step 2: Verify the `zh-CN` client mode**

Switch through the visible locale control. Require:

- document language `zh-CN`;
- the exact approved Chinese H1 and equivalent sections;
- exactly one `/zh/farm-comparison` link;
- exactly eight `/zh/farm/<type>` links derived from `officialFarmTypes`;
- one footer `/zh/mods` link labeled `模组农场`;
- five Chinese FAQ disclosures;
- the planner remains mounted exactly once and usable.

- [ ] **Step 3: Verify `390×844` and keyboard access**

At `390×844`, require one-column farm links, no horizontal overflow, readable
text, visible focus, keyboard-reachable comparison/farm/footer links, and an
unblocked planner viewport.

- [ ] **Step 4: Verify route isolation**

Cold-load `/farm-comparison`, `/farm/standard`, and `/mods`. Require that they
render their existing public-page shell, do not inherit homepage-only farm/trust
styles, and do not mount the frozen planner runtime.

- [ ] **Step 5: Final independent review**

Dispatch fresh read-only reviewers for:

1. specification compliance and SEO claim accuracy;
2. code quality and architectural constraints;
3. regression/test evidence and protected-baseline preservation.

Any verified Critical or Important finding enters one narrow fix wave followed
by the relevant targeted tests and re-review. The controller must not silently
fix, ignore, or downgrade a finding.

- [ ] **Step 6: Report without committing**

Report exact files changed, browser evidence, build/typecheck/Vitest results,
preserved baseline status, and any residual limitation. Do not stage or commit.

---

### Task 6: Explicit FAQ keyboard fallback and final acceptance

**Files:**

- Create: `src/homepage/faq-disclosure-keyboard.ts`
- Create: `tests/homepage/faq-disclosure-keyboard.test.ts`
- Modify: `src/components/homepage-content.tsx`
- Store evidence only under:
  `.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/`

**Interfaces:**

- Consumes: a keyboard event whose `key`, `preventDefault`, and
  `currentTarget.parentElement` match the React summary-event boundary.
- Produces: exported `handleFaqSummaryKeyDown(event)` for
  `HomepageContent`; accepted keys toggle the owning `DETAILS` element once.

- [ ] **Step 1: Write the failing keyboard behavior test**

Add table-driven tests with literal expectations proving:

```ts
Enter -> prevents default and opens a closed DETAILS element
" " -> prevents default and closes an open DETAILS element
ArrowDown -> does not prevent default and does not change open state
Enter with parent tag DIV -> throws an error containing "DIV"
Enter with no parent -> throws an error containing "null"
```

The test must import the production handler and mutate only a small in-memory
event boundary; it must not grep source text or assert a mock call as the final
behavior.

- [ ] **Step 2: Run the new test and verify RED**

```bash
pnpm exec vitest run tests/homepage/faq-disclosure-keyboard.test.ts
```

Expected: FAIL because `src/homepage/faq-disclosure-keyboard.ts` does not yet
exist. Save the exact failure in the task report before writing production
code.

- [ ] **Step 3: Implement the minimal plain-function handler**

Create one focused module with:

```ts
export function handleFaqSummaryKeyDown(event: FaqSummaryKeyboardEvent): void
```

The function ignores non-activation keys. For `Enter` or `" "`, it calls
`preventDefault()`, validates the parent tag is exactly `DETAILS`, and toggles
its `open` attribute once. The thrown validation error must include the
observed tag name (`DIV` or `null`). Do not add a class, state store, generic
keyboard framework, dependency, or pointer handler.

- [ ] **Step 4: Connect the public handler to FAQ summaries**

Import `handleFaqSummaryKeyDown` in `HomepageContent` and pass it directly as
the `onKeyDown` prop of each rendered FAQ `<summary>`. Do not modify FAQ copy,
markup hierarchy, pointer handling, styling, or other homepage sections.

- [ ] **Step 5: Verify GREEN and targeted regression tests**

```bash
pnpm exec vitest run \
  tests/homepage/faq-disclosure-keyboard.test.ts \
  tests/routes/planner-editor-page.test.tsx \
  tests/routes/static-public-pages.test.ts
pnpm typecheck
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 6: Write the task report without committing**

Record the RED failure, changed files, GREEN commands, exact test counts,
typecheck result, diff-check result, and self-review in
`.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/task-6-report.md`.
Do not stage or commit.

---

### Task 7: Fresh browser acceptance and final review

**Files:**

- No production or test edits unless a verified regression enters one scoped
  fix wave.
- Store browser and reviewer evidence only under:
  `.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/`

**Interfaces:**

- Consumes: the reviewed Task 6 handler, current homepage content interfaces,
  and the existing static-export/build commands.
- Produces: fresh browser acceptance evidence and three final reviewer verdicts.

- [ ] **Step 1: Build and prove pointer/Enter/Space behavior**

```bash
NEXT_TELEMETRY_DISABLED=1 pnpm build
```

Serve the fresh export without HMR. On desktop `/`, prove the first FAQ starts
closed, opens by pointer, closes by pointer, opens by `Enter`, and closes by
`Space`. Re-run the approved English/Chinese, `390×844`, planner-root, overflow,
link-localization, console, and public-route-isolation checks from Task 5.

- [ ] **Step 2: Run full verification**

```bash
pnpm exec vitest run
pnpm typecheck
git diff --check
```

Record exact file/test counts, build routes, typecheck result, and diff-check
result in the Task 7 evidence report.

- [ ] **Step 3: Run independent final reviews**

Dispatch fresh read-only reviewers for specification/SEO, code quality, and
regression/baseline preservation. Persist their verdicts and the browser report
under this plan's ignored SDD directory. Do not stage, commit, push, or deploy.

---

### Task 8: Resolve confirmed final-review blockers

**Files:**

- Modify: `src/components/planner-homepage.tsx`
- Modify: `public/reference-runtime/local-only-overrides.css`
- Modify: `tests/reference-runtime/local-only-overrides.test.ts`
- Store evidence only under:
  `.superpowers/sdd/2026-08-02-homepage-content-seo-expansion/`

**Interfaces:**

- The homepage locale effect owns only the root `lang` attribute and persisted
  locale; route metadata remains the sole owner of the document title.
- Homepage-only enabled sidebar anchors consume existing frozen-runtime color
  tokens directly; the runtime root does not redefine shared text variables.

- [ ] **Step 1: Record RED evidence**

Use the already reproduced browser failure for the locale-title regression.
Change the focused sidebar contract test first, then run it against the old CSS
and record its expected failure.

- [ ] **Step 2: Implement the minimum fixes**

Remove the client `document.title` assignment and its copy-derived effect
dependency. Remove the three root text-token aliases. Set only enabled sidebar
links to `var(--text)` and their hover state to `var(--text-bright)`. Do not
change disabled rows or any unrelated runtime selector.

- [ ] **Step 3: Verify the focused fix**

```bash
pnpm exec vitest run \
  tests/reference-runtime/local-only-overrides.test.ts \
  tests/routes/planner-editor-page.test.tsx \
  tests/seo/page-metadata.test.ts
pnpm typecheck
git diff --check
```

- [ ] **Step 4: Rebuild and prove browser behavior**

Build a fresh static export. Verify the exact title before and after an
English-Chinese-English locale round trip. Verify enabled sidebar links are
readable, disabled rows retain their original treatment, and representative
non-sidebar runtime text does not receive a homepage root token override.

- [ ] **Step 5: Re-review and complete the full gate**

Run the full Vitest suite, type checking, build, and diff check with fresh
output. Dispatch an independent scoped reviewer for both fixes and complete the
requirement-by-requirement audit. Do not stage, commit, push, or deploy.
