import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CircularTestimonials,
  calculateCircularTestimonialsGap,
  getCircularImageStyle,
} from "../../src/components/circular-testimonials";

const previousLabel = "Previous testimonial";
const nextLabel = "Next testimonial";
const testimonials = [
  {
    alt: "First farm layout",
    designation: "Beach farm",
    name: "Plan the map first",
    quote: "Choose the map before placing anything.",
    src: "/homepage/why-choose/beach-decorative-machooo.webp",
  },
  {
    alt: "Second farm layout",
    designation: "Four Corners farm",
    name: "Keep routes open",
    quote: "Leave the walking route before the decor.",
    src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
  },
  {
    alt: "Third farm layout",
    designation: "Standard farm",
    name: "Check coverage",
    quote: "Use the coverage view while you place buildings.",
    src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
  },
] as const;

describe("CircularTestimonials", () => {
  it("renders the circular media stack, active copy, all image sources, and controls", () => {
    const markup = renderToStaticMarkup(
      createElement(CircularTestimonials, {
        nextLabel,
        previousLabel: previousLabel,
        testimonials,
      }),
    );

    expect(markup).toContain("data-circular-testimonials");
    expect(markup).toContain("data-circular-testimonials-stage");
    expect(markup).toContain("data-circular-testimonials-copy");
    expect(markup).toContain(`aria-label="${previousLabel}"`);
    expect(markup).toContain(`aria-label="${nextLabel}"`);
    expect(markup).toContain(testimonials[0].quote);

    for (const testimonial of testimonials) {
      expect(markup).toContain(`src="${testimonial.src}"`);
      expect(markup).toContain(`alt="${testimonial.alt}"`);
    }
  });

  it("fails fast when the testimonial list is empty", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(CircularTestimonials, {
          nextLabel,
          previousLabel,
          testimonials: [],
        }),
      ),
    ).toThrow(/length=0/);
  });

  it("keeps the supplied image stack within a responsive gap range", () => {
    expect(calculateCircularTestimonialsGap(360)).toBe(28);
    expect(calculateCircularTestimonialsGap(1456)).toBe(86);

    const activeImageStyle = getCircularImageStyle({
      activeIndex: 0,
      containerWidth: 375,
      index: 0,
      testimonialsLength: testimonials.length,
    });
    expect(activeImageStyle.transform).toContain("scale(1)");
    expect(activeImageStyle.transform).not.toContain("object-cover");
  });
});
