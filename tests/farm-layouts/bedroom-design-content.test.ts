import { describe, expect, it } from "vitest";
import {
  bedroomDesignCanonicalPath,
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
  type BedroomDesignCase,
} from "../../src/farm-layouts/bedroom-design-content";

const expectedBedroomDesignCaseIds = [
  "02-stardew-valley-bedroom-design-emily-ocean-aquarium",
  "03-stardew-valley-bedroom-design-penny-spouse-suite",
  "04-stardew-valley-bedroom-design-cozy-kids-loft",
  "05-stardew-valley-bedroom-design-attic-cozy",
  "06-stardew-valley-bedroom-design-cottagecore-kids",
  "07-stardew-valley-bedroom-design-wizard-junimo-bedroom",
] as const;

function expectBedroomDesignAssetPaths(
  bedroomCase: BedroomDesignCase,
): void {
  expect(bedroomCase.imageSrc).toBe(
    `/farm-layouts/bedroom-design/images/${bedroomCase.id}.webp`,
  );
  expect(bedroomCase.imageOriginalSrc).toBe(
    `/farm-layouts/bedroom-design/images/${bedroomCase.id}.jpg`,
  );
  expect(bedroomCase.projectHref).toBe(
    `/farm-layouts/bedroom-design/projects/${bedroomCase.id}.json`,
  );
  expect(bedroomCase.imageWidth).toBe(2240);
  expect(bedroomCase.imageHeight).toBe(1472);
}

describe("bedroom design page copy", () => {
  it("keeps the featured cover separate from the six bilingual cases", () => {
    expect(bedroomDesignCanonicalPath).toBe(
      "/stardew-valley-bedroom-design",
    );

    for (const locale of ["en", "zh-CN"] as const) {
      const pageCopy = getBedroomDesignPageCopy(locale);
      const featuredCase = getFeaturedBedroomDesignCase(locale);

      expect(pageCopy.title).toBe(
        locale === "en"
          ? "Stardew Valley Bedroom Design"
          : "星露谷物语卧室设计",
      );
      expect(pageCopy.heading).toBe(pageCopy.title);
      expect(pageCopy.categoryLabel).toBe(
        locale === "en" ? "Buildings & Interiors" : "建筑与室内",
      );
      expect(featuredCase.id).toBe(
        "01-stardew-valley-bedroom-design-warm-red-classic",
      );
      expect(pageCopy.cases.map(({ id }) => id)).toEqual(
        expectedBedroomDesignCaseIds,
      );
      expect(pageCopy.cases).toHaveLength(6);
      expect(pageCopy.cases.some(({ id }) => id === featuredCase.id)).toBe(
        false,
      );
      expectBedroomDesignAssetPaths(featuredCase);

      for (const bedroomCase of pageCopy.cases) {
        expectBedroomDesignAssetPaths(bedroomCase);
        expect(bedroomCase.title.trim()).not.toBe("");
        expect(bedroomCase.summary.trim()).not.toBe("");
        expect(bedroomCase.imageAlt.trim()).not.toBe("");
      }
    }
  });

  it("rejects unsupported locales with the received value", () => {
    expect(() => getBedroomDesignPageCopy("fr" as never)).toThrow(
      'Unsupported Bedroom Design page locale: "fr".',
    );
    expect(() => getFeaturedBedroomDesignCase("fr" as never)).toThrow(
      'Unsupported Bedroom Design page locale: "fr".',
    );
  });
});
