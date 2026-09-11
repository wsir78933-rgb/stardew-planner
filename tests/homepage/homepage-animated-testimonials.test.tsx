import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomepageAnimatedTestimonials } from "../../src/components/homepage-animated-testimonials";

const previousFarmLayoutLabel = "Previous fixture farm layout";
const nextFarmLayoutLabel = "Next fixture farm layout";

const firstFarmLayoutSlide = {
  quote: "North field fixture quote.",
  name: "Ada Fixture",
  designation: "Standard farm",
  src: "/test-fixtures/north-field.webp",
  imageAlt: "North field fixture layout",
} as const;

const secondFarmLayoutSlide = {
  quote: "South field fixture quote.",
  name: "Ben Fixture",
  designation: "Beach farm",
  src: "/test-fixtures/south-field.webp",
  imageAlt: "South field fixture layout",
} as const;

const validFarmLayoutSlides = [firstFarmLayoutSlide, secondFarmLayoutSlide];

describe("HomepageAnimatedTestimonials", () => {
  it("renders the first active slide and both navigation labels", () => {
    const testimonialsMarkup = renderToStaticMarkup(
      createElement(HomepageAnimatedTestimonials, {
        testimonials: validFarmLayoutSlides,
        previousLabel: previousFarmLayoutLabel,
        nextLabel: nextFarmLayoutLabel,
      }),
    );

    expect(testimonialsMarkup).toContain("data-homepage-animated-testimonials");
    expect(testimonialsMarkup).toContain(firstFarmLayoutSlide.name);
    expect(testimonialsMarkup).toContain(firstFarmLayoutSlide.quote);
    expect(testimonialsMarkup).toContain(firstFarmLayoutSlide.imageAlt);
    expect(testimonialsMarkup).toContain(`src="${firstFarmLayoutSlide.src}"`);
    expect(testimonialsMarkup).toContain(`aria-label="${previousFarmLayoutLabel}"`);
    expect(testimonialsMarkup).toContain(`aria-label="${nextFarmLayoutLabel}"`);
  });

  it("rejects an empty testimonials list with the received length", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepageAnimatedTestimonials, {
          testimonials: [],
          previousLabel: previousFarmLayoutLabel,
          nextLabel: nextFarmLayoutLabel,
        }),
      ),
    ).toThrow(/length=0/);
  });

  it("rejects a blank previous label with the received value", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepageAnimatedTestimonials, {
          testimonials: validFarmLayoutSlides,
          previousLabel: "",
          nextLabel: nextFarmLayoutLabel,
        }),
      ),
    ).toThrow('""');
  });

  it("rejects a slide with an empty src with the received value", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(HomepageAnimatedTestimonials, {
          testimonials: [
            {
              ...firstFarmLayoutSlide,
              src: "",
            },
            secondFarmLayoutSlide,
          ],
          previousLabel: previousFarmLayoutLabel,
          nextLabel: nextFarmLayoutLabel,
        }),
      ),
    ).toThrow('""');
  });
});
