import { describe, expect, it } from "vitest";

import {
  getHouseDesignPageCopy,
  houseDesignCanonicalPath,
} from "../../src/farm-layouts/house-design-content";
import type { PublicLocale } from "../../src/i18n/public-locale";

const houseDesignCaseStems = [
  "02-stardew-valley-house-design-witch-junimo",
  "03-stardew-valley-house-design-serene-plant-tour",
  "04-stardew-valley-house-design-whimsical-attic-music",
  "05-stardew-valley-house-design-cozy-tea-greenhouse",
  "06-stardew-valley-house-design-italian-grandma-rustic",
  "07-stardew-valley-house-design-wizard-mystic-16",
] as const;

function getVisibleHouseDesignText(
  locale: PublicLocale,
): string {
  const copy = getHouseDesignPageCopy(locale);

  return [
    copy.title,
    copy.intro,
    copy.categoryLabel,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.casesHeading,
    copy.casesDescription,
    copy.cover.caption,
    ...copy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
      copy.downloadProjectLabel,
    ]),
    copy.whatIsHeading,
    ...copy.whatIsParagraphs,
    copy.howToEyebrow,
    copy.howToHeading,
    ...copy.howToSteps.flatMap((step) => [
      step.number,
      step.title,
      step.body,
    ]),
    copy.faqEyebrow,
    copy.faqHeading,
    copy.faqDescription,
    ...copy.faqs.flatMap((faq) => [faq.question, faq.answer]),
    copy.ctaHeading,
    copy.ctaDescription,
    copy.ctaButtonLabel,
  ]
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
}

function countHouseDesignKeywordMentions(
  visibleText: string,
  locale: PublicLocale,
): number {
  if (locale === "en") {
    return [...visibleText.matchAll(/\bstardew valley house design\b/giu)]
      .length;
  }

  return visibleText.split("星露谷物语房屋设计").length - 1;
}

function countVisibleHouseDesignWords(
  visibleText: string,
  locale: PublicLocale,
): number {
  return [
    ...new Intl.Segmenter(locale, { granularity: "word" }).segment(visibleText),
  ].filter((segment) => segment.isWordLike).length;
}

function countChineseCharacters(visibleText: string): number {
  return [...visibleText.matchAll(/[\p{Script=Han}]/gu)].length;
}

describe("house design page copy", () => {
  it("rejects unsupported locale values with the received value", () => {
    expect(() => getHouseDesignPageCopy("fr" as PublicLocale)).toThrow(
      'received "fr".',
    );
  });

  it("exports one cover and six cases with matching source stems", () => {
    expect(houseDesignCanonicalPath).toBe("/stardew-valley-house-design");

    for (const locale of ["en", "zh-CN"] as const) {
      const copy = getHouseDesignPageCopy(locale);
      expect(copy.categoryLabel).toBe(
        locale === "en" ? "Buildings & Interiors" : "建筑与室内",
      );
      expect(copy.cover.imageSrc).toBe(
        "/farm-layouts/house-design/images/01-stardew-valley-house-design-cottagecore-green.webp",
      );
      expect(copy.cover.imageOriginalSrc).toBe(copy.cover.imageSrc);
      expect(copy.cover.imageWidth).toBe(2240);
      expect(copy.cover.imageHeight).toBe(1472);
      expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
        houseDesignCaseStems,
      );
      expect(copy.whatIsParagraphs).toHaveLength(4);
      expect(copy.howToSteps).toHaveLength(3);
      expect(copy.faqs).toHaveLength(5);

      for (const layoutCase of copy.cases) {
        expect(layoutCase.imageSrc).toBe(
          `/farm-layouts/house-design/images/${layoutCase.id}.webp`,
        );
        expect(layoutCase.imageOriginalSrc).toBe(layoutCase.imageSrc);
        expect(layoutCase.projectHref).toBe(
          `/farm-layouts/house-design/projects/${layoutCase.id}.json`,
        );
        expect(layoutCase.imageWidth).toBe(2240);
        expect(layoutCase.imageHeight).toBe(1472);
      }
    }
  });

  it("keeps the published body length and exact focus keyword density in range", () => {
    const densityReports: string[] = [];

    for (const locale of ["en", "zh-CN"] as const) {
      const visibleText = getVisibleHouseDesignText(locale);
      const wordCount = countVisibleHouseDesignWords(visibleText, locale);
      const keywordMentions = countHouseDesignKeywordMentions(
        visibleText,
        locale,
      );
      const densityPercent = (keywordMentions / wordCount) * 100;

      if (locale === "en" && wordCount < 900) {
        throw new Error(
          `House Design English body must contain at least 900 words; received ${wordCount}.`,
        );
      }
      if (locale === "zh-CN" && countChineseCharacters(visibleText) < 900) {
        throw new Error(
          `House Design Chinese body must contain at least 900 Han characters; received ${countChineseCharacters(visibleText)}.`,
        );
      }
      if (densityPercent < 2 || densityPercent > 3) {
        densityReports.push(
          `${locale}: ${keywordMentions}/${wordCount} = ${densityPercent.toFixed(4)}%`,
        );
      }
    }

    if (densityReports.length > 0) {
      throw new Error(
        `House Design keyword density must be 2% to 3%; received ${densityReports.join("; ")}.`,
      );
    }
  });
});
