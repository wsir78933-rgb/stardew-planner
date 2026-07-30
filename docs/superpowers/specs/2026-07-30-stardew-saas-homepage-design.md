# Stardew Planner SaaS Homepage Design

## Status

Approved design. Implementation is in progress.

## Goal

Keep the existing English frozen planner editor functional on `/`, while turning the surrounding route into a bilingual SaaS-style homepage. The homepage uses the supplied Brainfish page as its visual-component reference: pale lime and white canvas, fine dark borders, compact navigation, a left-aligned sans hero with serif italic emphasis, lime outlined actions, and editorial content sections. It must not copy Brainfish branding, copy, imagery, data, source code, or assets.

## Product boundaries

- `/` remains the planner homepage. No `/planner` route is added.
- The existing frozen Svelte/Pixi editor remains the only planner implementation in this change.
- The editor remains English. Homepage copy supports English and Simplified Chinese.
- The editor's behavior, its bootstrap module, its frozen bundles, game assets, local-project API, and local browser projects are out of scope.
- Existing local browser projects are not migrated, changed, or read by this work.
- Other public routes continue to use `ReferenceRuntimeHost` and must retain their current presentation and behavior.
- The existing user change in `next-env.d.ts` is not touched.

## Page structure

1. **Compact navigation**
   - Product name, in-page links, locale switcher, and one primary action.
   - The primary action scrolls to the planner workspace.
2. **Hero**
   - A short, game-planning-specific value proposition.
   - One supporting sentence and one primary action.
   - No fabricated customer numbers, testimonials, security claims, integrations, or product results.
3. **Planner workspace**
   - A short bilingual heading and description in the marketing page's readable container.
   - The real frozen editor immediately follows as an unwrapped sibling inside its own adaptive-height application container and continues to own its own controls and canvas.
   - The workspace contains its own frozen fixed controls; it never contains or overlays navigation, hero, capability, or FAQ content.
4. **Capability narrative**
   - Three concise sections built only from confirmed product capabilities: plan, map, and adjust.
   - Content describes existing behavior rather than promising unimplemented product features.
5. **FAQ and footer**
   - FAQ covers browser-local storage, game-asset attribution, and how to start using the planner.
   - Footer links only to routes already available in the application.

## Visual direction

- Use Brainfish's light visual language: a white/pale-lime foundation, fine dark outlines, a lime primary action, compact navigation, left-aligned editorial typography, and a serif italic headline emphasis.
- The marketing page uses generous whitespace, readable asymmetric compositions, and restrained borders and shadows rather than dark cards or glass effects.
- The frozen editor stays information-dense and functional. The homepage may harmonize its outer surface, adjacent workspace context, and safe top-level colors, but must not apply decorative blur, nonessential motion, or visual effects that reduce canvas clarity.
- Motion is limited to `transform` and `opacity`, has a `prefers-reduced-motion` fallback, and never gates access to content or planner controls.

## Component boundaries

### `PlannerHomepage`

Owns homepage information architecture and receives localized copy plus the current locale. It does not read or write browser storage and does not know editor internals.

### `HomepageLocaleController`

Owns the selected homepage locale, validation of the stored locale preference, writing the preference, and synchronizing `html[lang]` and the document title. It exposes a small locale interface to the homepage presentation.

### `HomepageScrollController`

Owns the homepage-only document scroll mode. On mount it applies a unique body class that enables normal page scrolling; on cleanup it removes that class. It does not style or initialize the frozen editor.

### `PlannerHomepageWorkspace`

Renders the localized workspace copy and the existing `ReferenceRuntimeHost`. The copy wrapper and the editor host are direct siblings so the editor does not inherit the marketing content width constraint.

### Homepage UI primitives

Use the smallest required shadcn/ui primitives for the locale switcher and FAQ disclosure. Keep application-specific sections as ordinary React components with explicit props.

## Homepage i18n contract

- Supported locales are exactly `en` and `zh-CN`.
- Homepage copy is a typed dictionary keyed by a finite union of homepage copy keys. Missing locale keys fail tests.
- The locale preference uses a dedicated homepage key and does not enter project JSON or editor state.
- A persisted locale value is valid only when it is exactly `en` or `zh-CN`. Any other value is discarded and the safe English default is used.
- The language switcher updates visible homepage copy, `html[lang]`, and the document title without reinitializing the editor.
- The editor's English strings, item names, tooltips, and internal dialogs are explicitly excluded from this i18n contract.

## Frozen editor integration and styling

- `ReferenceRuntimeHost` keeps its current client-only, `ssr: false` boundary and still mounts exactly one `#reference-runtime-root`.
- Homepage-only overrides live in the existing local override stylesheet but are gated by the unique homepage body class and `#reference-runtime-root`.
- The overrides make the runtime root a positioned, transformed containing block so frozen fixed controls stay within the independent editor container; they may change safe surface properties such as surrounding background, top-level container framing, border color, shadow, and editor-adjacent spacing.
- The overrides must not rename, hide, change the event behavior of, or otherwise alter retained editor controls. The only positioning boundary change is containing the frozen fixed controls inside the independent editor container.
- No file under `public/_app/immutable/**` is modified. `bootstrap.mjs` and the local project API are not modified.

## Styling and dependencies

- Enable the already-installed Tailwind CSS v4 using the supported Next.js integration.
- Initialize shadcn/ui and add only primitives required by the approved homepage: Button, Accordion, and a locale-switch control.
- Do not introduce a second component library, animation library, state store, or i18n framework.
- Keep editor-specific CSS separate from homepage presentation rules. All new selectors use a `stardew-homepage-` prefix or Tailwind utilities to avoid collisions with frozen runtime classes.

## Error handling

- Locale parsing rejects unknown values at the browser-storage boundary and restores the safe English default.
- Homepage copy lookup rejects missing locale keys in tests rather than falling back silently.
- The existing frozen runtime remains responsible for its own startup failures and planner behavior. The homepage must not catch or hide those failures.

## Verification

1. Add tests for locale validation, translation completeness, and the static homepage structure.
2. Preserve the contract that the static HTML for `/` does not contain `#reference-runtime-root` or `bootstrap.mjs`.
3. Verify after hydration that one runtime root and one bootstrap module exist.
4. Run relevant homepage, reference-runtime, route, and frozen-asset delivery tests, then `pnpm typecheck` and `pnpm build`.
5. In a production static preview, verify English and Simplified Chinese homepage copy, locale persistence, anchor navigation, keyboard focus, desktop and mobile layouts, and planner actions including map interaction, menu opening, undo, and local saving.
6. Verify other public routes still render their frozen runtime without homepage-specific scrolling or visual overrides.

## Acceptance criteria

- `/` reads as a polished SaaS product homepage in either supported homepage language.
- The language switcher never changes planner state or restarts the frozen editor.
- The English editor remains usable on desktop and mobile within the new page flow.
- No fabricated claims or copied Brainfish assets appear in the application.
- No frozen editor bundle, bootstrap module, game asset, or unrelated route is changed.
