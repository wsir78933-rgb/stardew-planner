# Case-study arrow stability review

This is an independent, source-only review of the current arrow-stability diff. No source files were changed by the reviewer.

## Findings

No source-level blocker was found in the scoped changes.

- The opt-in `reserveCopyHeight` defaults to `false` and is validated as a boolean in `src/components/circular-testimonials.tsx`. `HomepageCaseStudySections` supplies it for every case-study group. The homepage copy type fixes the case-study list at three entries; both English and Chinese definitions provide those three groups.
- When opted in, the hidden copy map includes every testimonial, including the active one. The active copy and hidden-copy container share the same grid cell, and the hidden items share one cell inside their grid. This covers the tallest copy even while `AnimatePresence` is between active items in `mode="wait"`.
- Source-level line-breaking inputs match: active and hidden quotes use `splitCircularTestimonialQuote`, the same `canAnimateQuoteWords && !prefersReducedMotion` condition, and the same `circular-testimonial-word` class. Name, designation, and quote elements share the same data selectors and inline colors/font sizes. The reserved grid rules are outside media queries, while desktop/mobile layout rules remain intact. No fixed-height guess was added. This supports stable controls at each current viewport width, but does not prove browser pixel coordinates.
- The hidden duplicate copy is `visibility: hidden`; every duplicated item also has `aria-hidden="true"`. It contains only text elements, not focusable controls. The active quote remains the only `aria-live` copy. The new SSR tests assert the hidden-item count, default-off behavior, and `aria-hidden` markup.
- Why Choose and Features do not pass the new prop. Their default remains false, and the new reservation CSS is scoped to `section[data-homepage-case-study-group]`, so it does not match those sections.
- The case-study hover lift rule was removed and the control transition now covers only background color. Button size, focus outline, hover-color state, and React click handlers remain unchanged in the reviewed diff.

## Scope and verification limits

The arrow-related source diff is confined to `app/globals.css`, `src/components/circular-testimonials.tsx`, `src/components/homepage-case-study-sections.tsx`, and `tests/components/circular-testimonials.test.tsx`, all within the approved scope. Other button-family CSS in `app/globals.css` belongs to the earlier approved dialog-button work. Concurrent cloud-sync test changes were not part of this review.

I did not run tests, a browser page, typecheck, or build. The changed component tests are static-render assertions; they do not measure actual control coordinates across cases, locales, or breakpoints. To verify that remaining behavior, open the English and Chinese homepages at desktop 1440px and mobile 390px, inspect each of `#farm-cases`, `#farm-cases-2`, and `#farm-cases-3`, and compare the Previous/Next `getBoundingClientRect().top` values before and after settled Next/Previous transitions and hover. The expected result is unchanged arrow tops for each group and locale.
