import { expect, it } from "vitest";
import {
  createLatestArticlesScrollOptions,
  getLatestArticlesCarouselState,
} from "../../src/components/blog/latest-articles-carousel-controls";

it.each([
  [
    "no overflow within the one-pixel tolerance",
    { clientWidth: 300, scrollLeft: 0, scrollWidth: 301 },
    { hasOverflow: false, isAtEnd: true, isAtStart: true },
  ],
  [
    "the start within the one-pixel tolerance",
    { clientWidth: 300, scrollLeft: 1, scrollWidth: 900 },
    { hasOverflow: true, isAtEnd: false, isAtStart: true },
  ],
  [
    "the middle",
    { clientWidth: 300, scrollLeft: 300, scrollWidth: 900 },
    { hasOverflow: true, isAtEnd: false, isAtStart: false },
  ],
  [
    "the end within the one-pixel tolerance",
    { clientWidth: 300, scrollLeft: 599, scrollWidth: 900 },
    { hasOverflow: true, isAtEnd: true, isAtStart: false },
  ],
] as const)("derives carousel state at %s", (_description, measurements, expectedState) => {
  expect(getLatestArticlesCarouselState(measurements)).toEqual(expectedState);
});

it.each([
  ["the previous screen", 360, -1, false, { behavior: "smooth", left: -360 }],
  ["the next screen", 360, 1, false, { behavior: "smooth", left: 360 }],
  ["reduced motion", 360, 1, true, { behavior: "auto", left: 360 }],
] as const)(
  "creates scroll options for %s",
  (_description, clientWidth, direction, prefersReducedMotion, expectedOptions) => {
    expect(
      createLatestArticlesScrollOptions(
        clientWidth,
        direction,
        prefersReducedMotion,
      ),
    ).toEqual(expectedOptions);
  },
);
