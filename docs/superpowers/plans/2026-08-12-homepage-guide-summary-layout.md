# Homepage guide summary layout

## Scope

Apply the approved guide-section wireframe to the existing bilingual homepage.
Keep the page title, metadata description, H1, hero copy, planner entry, and
existing visual language unchanged.

## Implementation

1. Add a failing server-rendered homepage contract that requires a concise guide
   summary, four collapsed workflow cards, and collapsed detail groups while
   retaining the full localized guide content in the HTML.
2. Restructure only `HomepagePlanningGuide` around semantic native `details`
   elements. Keep every existing bilingual guide paragraph in the rendered DOM.
3. Extend only the guide's scoped CSS: summary/figure at the top, four cards on
   wide screens, two cards at medium widths, one card on mobile, and native
   disclosure styling consistent with existing borders, colors, and type.
4. Replace the existing public WebP with the inspected image-generation output
   at the same public path and intrinsic dimensions.
5. Run focused tests, typecheck, static build, diff check, and Ego desktop and
   mobile acceptance for `/` and `/zh`.

## Non-goals

- No page metadata, title, description, H1, Hero, planner runtime, routes, or
  global design-system changes.
- No new dependency, commit, staging, deployment, or source-copy rewrite.
