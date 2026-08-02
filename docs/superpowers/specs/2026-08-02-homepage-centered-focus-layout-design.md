# Homepage Centered-Focus Layout Design

## Status

User selected layout option C on 2026-08-02. This specification is ready for
user review. Product-source implementation is not yet authorized.

Written against commit `36714dc42736ff9500bf316d819d43a1d5451a3a` and the
protected dirty working tree present on 2026-08-02.

## Goal

Correct the visually unbalanced horizontal composition in two existing
homepage sections without changing the site's typography, visual identity,
copy, or section order:

1. Center the existing homepage hero content so its narrow text column reads as
   intentional centered focus instead of content accumulated on the left side
   of a wide viewport.
2. Center and narrow the existing `About this planner` / `关于这个规划器`
   section so its separators and short copy do not span a mostly empty wide
   container.

The two sections remain in their current, separate positions on the page. They
must not be moved together, wrapped in a shared container, or made adjacent.

## User Decisions

- Use option C, `Centered focus`.
- Preserve the existing fonts, type scale, colors, borders, button treatment,
  wording, and overall visual style.
- Do not add a product preview, illustration, fact list, card grid, or other
  content to occupy the right side.
- Keep the hero at the top of the homepage before the planner workspace.
- Keep the trust section after the FAQ and before the footer.
- Improve each section independently; do not create any visual or structural
  relationship between them.

## Evidence Chain

- Audited surface: hydrated homepage `/`, in both English and Simplified
  Chinese homepage modes.
- Rendered evidence: the user-provided 1920-pixel-wide screenshots show a hero
  whose headline, supporting copy, and action all occupy the left side while
  the right side remains empty; the trust section uses wide horizontal rules
  while its heading and paragraph occupy only the left side.
- Runtime owner: `src/components/homepage-content.tsx` renders the hero at lines
  48-59 and the trust section at lines 89-92.
- Section-order contract: `HomepageContent` renders the hero before
  `plannerWorkspace`; it renders the trust section after the FAQ and before the
  footer. That order is valid and must remain unchanged.
- Style owner: the homepage-scoped rules in `app/globals.css` currently keep the
  hero children left-aligned and give the trust section a `1280px` maximum
  width while its paragraph is limited to `44rem`.
- Existing design identity: `app/globals.css` owns the pale background, dark
  hairline borders, lime action, sans/serif heading combination, type scale,
  and homepage spacing rhythm. These are not defects and remain unchanged.
- Uncertainty: final optical balance must be checked at real desktop and mobile
  viewport sizes because static CSS assertions cannot prove rendered visual
  balance or text wrapping.

## Design Decision

Use the existing width constraints as centered reading columns instead of
introducing a second column or adding visual content.

The hero becomes a vertically stacked, center-aligned composition. Its eyebrow,
headline, supporting paragraph, and primary action keep their current content,
font styles, sizes, and vertical order. Existing `h1` and paragraph maximum
widths remain the wrapping owners; centering makes the whitespace symmetrical.
The hero owner receives exactly `display: flex`, `flex-direction: column`,
`align-items: center`, and `text-align: center`; no child wrapper is added.

The trust section becomes an independent centered explanation strip with a
maximum outer width of `48rem`. Its top and bottom borders therefore terminate
around the content instead of crossing the full `1280px` homepage container.
Its heading and paragraph are centered, and the paragraph remains a readable
narrow measure. Its responsive width is exactly
`calc(100% - clamp(2.5rem, 6vw, 6rem))`, producing equal side gutters without
adding a new breakpoint.

No shared layout, shared wrapper, positional linkage, or adjacent placement is
introduced between the hero and trust sections.

## Design Language

- Audited surface: homepage marketing shell around the planner workspace.
- Design sources: current rendered homepage, user screenshots, approved option
  C mockup, homepage-scoped CSS in `app/globals.css`, and the current
  `HomepageContent` composition.
- Documented decisions: pale lime/white surface, fine dark borders, lime primary
  action, left-to-right editorial hierarchy, and restrained decoration remain
  in force. Option C changes only the two selected sections' alignment and
  content width.
- Governing owners and consumers: `HomepageContent` supplies the structure;
  homepage-scoped rules in `app/globals.css` supply the presentation; English
  and Simplified Chinese homepage modes consume the same structure and styles.
- Explicit exceptions: the planner workspace, capability section, farm-guide
  section, FAQ, header, and footer are outside this layout change.

## Reuse

- Reuse the existing `[data-homepage-hero]`, `[data-homepage-eyebrow]`,
  `[data-homepage-primary-action]`, and `[data-homepage-trust]` owners.
- Reuse the existing homepage tokens `--foreground`, `--muted-foreground`,
  `--primary`, `--background`, and the existing border color expressions.
- Reuse the current headline width and responsive font-size rules rather than
  creating a new typography scale.
- Reuse the current `700px` mobile breakpoint.
- No new component, primitive, wrapper, image, icon, dependency, or content
  field is required.

## Component and Layout Behavior

### Homepage Hero

- Preserve its current position before `plannerWorkspace`.
- Preserve the DOM order: eyebrow, `h1`, supporting paragraph, primary action.
- Center the existing children as one vertical stack using the hero's existing
  section owner.
- Center-align the text.
- Keep the current headline font size, line height, emphasis font, and desktop
  and mobile maximum-width behavior.
- Keep the supporting paragraph's current type treatment and `37rem` maximum
  width.
- Keep the current vertical padding and primary-action appearance.
- Keep the existing hero glow and page background unchanged unless browser
  verification proves the current glow physically obscures the centered text.
  If that happens, stop and request a new design decision instead of moving it
  automatically.

### Trust Section

- Preserve its current position after the FAQ and before the footer.
- Preserve the DOM order: heading followed by description.
- Keep the section independent from the hero.
- Limit the complete bordered strip to a centered `48rem` maximum width.
- Set the strip width to
  `calc(100% - clamp(2.5rem, 6vw, 6rem))` so its borders retain equal responsive
  side gutters and do not touch the mobile viewport edges.
- Use `padding-inline: 0` on this strip so the width owner and border endpoints
  remain deterministic; retain its current responsive block padding.
- Center-align the heading and paragraph.
- Center the existing paragraph measure within the strip.
- Preserve the existing heading font size, copy, text color, border color, and
  vertical padding.

### Responsive Behavior

- Desktop validation viewports: `1440x900` and `1920x1080`.
- Mobile validation viewports: `390x844` and `430x932`.
- English and Simplified Chinese must use the same layout rules.
- The centered hero must not cause horizontal scrolling, clipping, or overlap
  with the header or planner workspace.
- The trust strip must retain visible side gutters at mobile widths.
- Text may wrap naturally according to the current localized copy. No manual
  `<br>` elements or locale-specific CSS exceptions may be added.

## Files and Responsibilities

1. `app/globals.css`
   - Change only the homepage-scoped hero and trust layout declarations.
   - Preserve all unrelated homepage rules and all public-page styles.
2. `tests/homepage/homepage-style-contract.test.ts`
   - Add or update narrow contract assertions for the centered hero and bounded
     trust strip.
   - Preserve the existing workspace, background, glow, and farm-guide tests.

`src/components/homepage-content.tsx` is a read-only structural reference for
this task. The approved design requires no JSX change and no section reorder.

## Protected Dirty-Tree Boundary

Both authorized implementation files already contain user-owned uncommitted
changes. The implementation must:

- patch their current contents narrowly;
- inspect the relevant pre-change diff before editing;
- preserve every pre-existing hunk outside the exact hero/trust declarations
  and their direct tests;
- never reset, restore, stash, reformat wholesale, or replace either file;
- stop if satisfying the design requires editing another product file.

No commit, push, deployment, dependency installation, or lockfile change is
authorized.

## Validation

### Repository Checks

Run these commands against the implemented dirty working tree:

```bash
pnpm vitest run tests/homepage/homepage-style-contract.test.ts tests/homepage/homepage-copy.test.ts tests/routes/planner-editor-page.test.tsx
pnpm typecheck
pnpm build
```

Expected result: every command exits with status `0` and no existing test is
removed or weakened to obtain a pass.

### Browser Checks

Use the local Hermes CDP browser against a fresh production static export:

1. Load `/` at `1440x900` and `1920x1080` in English.
2. Confirm the hero's text and action form one centered composition with
   symmetrical surrounding whitespace.
3. Navigate through the real page and confirm the planner workspace remains
   directly after the hero.
4. Confirm the trust section remains after the FAQ and before the footer.
5. Confirm the trust borders span only the centered strip rather than the wide
   page container.
6. Switch to Simplified Chinese and repeat the desktop checks.
7. Repeat at `390x844` and `430x932` for both locales.
8. Confirm there is no horizontal overflow and that `#planner`,
   `#capabilities`, and `#faq` anchor navigation still reaches the same
   sections.

### Acceptance Criteria

- At desktop widths, neither selected section reads as a left-aligned text
  block stranded inside a much wider empty container.
- The hero and trust section remain separated by all of their current
  intervening page content.
- No section is moved, duplicated, combined, or wrapped together.
- Fonts, font sizes, colors, copy, component treatments, and section order are
  unchanged.
- English and Simplified Chinese render without clipping or unintended manual
  line breaks.
- Mobile retains comfortable side gutters and has no horizontal overflow.
- Planner behavior and unrelated homepage sections remain unchanged.

## Stop Conditions

Stop and request user confirmation if any of the following occurs:

- the hero or trust section would need to move in the DOM;
- the two sections would need a shared wrapper or shared layout owner;
- a new image, illustration, fact list, copy field, or component appears
  necessary;
- a font size, font family, color, button, or visual-style change appears
  necessary;
- an authorized file's current dirty diff conflicts with the narrow change;
- implementation needs to touch the planner runtime, another homepage section,
  another route, or any file not listed above;
- the existing hero glow materially conflicts with centered content.

## Design Documentation

No `DESIGN.md` change is required. This specification is the task-local design
record.
