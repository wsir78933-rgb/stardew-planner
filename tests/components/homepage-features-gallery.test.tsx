import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  assertHomepageFeaturesGalleryInput,
  HomepageFeaturesGallery,
  homepageFeaturesGalleryImages,
} from "../../src/components/homepage-features-gallery";

describe("HomepageFeaturesGallery", () => {
  it("renders every supplied image source without changing the image ratio", () => {
    const markup = renderToStaticMarkup(
      createElement(HomepageFeaturesGallery, {
        alt: "Meadowlands farm layouts",
        images: homepageFeaturesGalleryImages,
      }),
    );

    expect(markup).toContain("data-homepage-features-gallery");
    expect(markup).toContain("data-homepage-features-gallery-image");

    for (const image of homepageFeaturesGalleryImages) {
      expect(markup).toContain(`src="${image.src}"`);
    }
  });

  it("fails fast when there are no supplied images", () => {
    expect(() =>
      assertHomepageFeaturesGalleryInput({
        alt: "Meadowlands farm layouts",
        images: [],
      }),
    ).toThrow(/non-empty array/);
  });
});
