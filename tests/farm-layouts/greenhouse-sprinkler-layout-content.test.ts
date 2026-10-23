import { describe, expect, it } from "vitest";
import {
  getGreenhouseSprinklerLayoutPageCopy,
  greenhouseSprinklerLayoutCanonicalPath,
  type GreenhouseSprinklerLayoutPageCopy,
} from "../../src/farm-layouts/greenhouse-sprinkler-layout-content";

const greenhouseSprinklerLayoutCaseStems = [
  "02-greenhouse-iridium-sprinkler-layout",
  "03-stardew-valley-greenhouse-layout-quality-sprinklers",
  "04-best-sprinkler-layout-stardew-valley-greenhouse",
  "05-optimal-sprinkler-layout-stardew-greenhouse",
  "06-greenhouse-sprinkler-layout-stardew-mixed",
  "07-greenhouse-sprinkler-layout-stardew-symmetry",
] as const;

function getVisibleGreenhouseSprinklerLayoutText(
  copy: GreenhouseSprinklerLayoutPageCopy,
): string {
  return [
    copy.title,
    copy.intro,
    copy.categoryLabel,
    copy.browseLabel,
    copy.openPlannerLabel,
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

function countGreenhouseSprinklerLayoutKeywordMentions(
  visibleText: string,
  locale: "en" | "zh-CN",
): number {
  if (locale === "en") {
    return [
      ...visibleText.matchAll(/\bgreenhouse sprinkler layout stardew\b/giu),
    ].length;
  }

  return visibleText.split("星露谷物语温室洒水器布局").length - 1;
}

function countVisibleGreenhouseSprinklerLayoutWords(
  visibleText: string,
  locale: "en" | "zh-CN",
): number {
  return [
    ...new Intl.Segmenter(locale, { granularity: "word" }).segment(visibleText),
  ].filter((segment) => segment.isWordLike).length;
}

function getGreenhouseSprinklerLayoutKeywordDensity(
  copy: GreenhouseSprinklerLayoutPageCopy,
  locale: "en" | "zh-CN",
): Readonly<{ keywordMentions: number; visibleWordCount: number; densityPercent: number }> {
  const visibleText = getVisibleGreenhouseSprinklerLayoutText(copy);
  const keywordMentions = countGreenhouseSprinklerLayoutKeywordMentions(
    visibleText,
    locale,
  );
  const visibleWordCount = countVisibleGreenhouseSprinklerLayoutWords(
    visibleText,
    locale,
  );

  return {
    keywordMentions,
    visibleWordCount,
    densityPercent: (keywordMentions / visibleWordCount) * 100,
  };
}

describe("greenhouse sprinkler layout page copy", () => {
  it("exports one cover and six bilingual case paths with matching image and project stems", () => {
    expect(greenhouseSprinklerLayoutCanonicalPath).toBe(
      "/greenhouse-sprinkler-layout-stardew",
    );

    for (const locale of ["en", "zh-CN"] as const) {
      const copy = getGreenhouseSprinklerLayoutPageCopy(locale);
      expect(copy.categoryLabel).toBe(
        locale === "en" ? "Greenhouse Layouts" : "温室布局",
      );
      expect(copy.cover.imageSrc).toBe(
        "/farm-layouts/greenhouse-sprinkler/images/01-greenhouse-sprinkler-layout-stardew.webp",
      );
      expect(copy.cover.imageOriginalSrc).toBe(copy.cover.imageSrc);
      expect(copy.cover.imageWidth).toBe(640);
      expect(copy.cover.imageHeight).toBe(768);
      expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
        greenhouseSprinklerLayoutCaseStems,
      );
      expect(copy.cases).toHaveLength(6);
      expect(copy.whatIsParagraphs).toHaveLength(2);
      expect(copy.howToSteps).toHaveLength(3);
      expect(copy.faqs).toHaveLength(5);

      for (const layoutCase of copy.cases) {
        expect(layoutCase.imageSrc).toBe(
          `/farm-layouts/greenhouse-sprinkler/images/${layoutCase.id}.webp`,
        );
        expect(layoutCase.imageOriginalSrc).toBe(layoutCase.imageSrc);
        expect(layoutCase.projectHref).toBe(
          `/farm-layouts/greenhouse-sprinkler/projects/${layoutCase.id}.json`,
        );
        expect(layoutCase.imageWidth).toBe(640);
        expect(layoutCase.imageHeight).toBe(768);
      }
    }
  });

  it("reports the sprinkler coverage limits verified for the saved projects", () => {
    const englishCases = getGreenhouseSprinklerLayoutPageCopy("en").cases;
    const chineseCases = getGreenhouseSprinklerLayoutPageCopy("zh-CN").cases;

    expect(englishCases[0]?.summary).toContain("All 116 crop tiles");
    expect(englishCases[1]?.summary).toContain("20 of its 116 crop tiles");
    expect(englishCases[2]?.summary).toContain("All 104 crops");
    expect(englishCases[3]?.summary).toContain("45 of the 119 crop tiles");
    expect(englishCases[3]?.title).toContain("119-Crop");
    expect(englishCases[4]?.summary).toContain("16 of the 116 crop tiles");
    expect(englishCases[5]?.summary).toContain("All 116 crop tiles");
    expect(englishCases[3]?.summary).toContain(
      "No Pressure Nozzle is fitted",
    );

    expect(chineseCases[0]?.summary).toContain("116 格作物都能被浇到");
    expect(chineseCases[1]?.summary).toContain("中央两列共 20 格作物未覆盖");
    expect(chineseCases[2]?.summary).toContain("104 格作物都能被浇到");
    expect(chineseCases[3]?.summary).toContain("有 45 格超出浇水范围");
    expect(chineseCases[3]?.title).toBe("119株高密度方案：45格需补浇");
    expect(chineseCases[4]?.summary).toContain("中央两列共 16 格作物未覆盖");
    expect(chineseCases[5]?.summary).toContain("116 格作物都能被浇到");
    expect(chineseCases[3]?.summary).toContain("没有安装加压喷头");

    expect(
      getGreenhouseSprinklerLayoutPageCopy("en").faqs[2]?.question,
    ).toContain("119-crop plan");
    expect(
      getGreenhouseSprinklerLayoutPageCopy("zh-CN").faqs[2]?.question,
    ).toContain("119 株方案");
  });

  it("keeps the exact English and Simplified Chinese focus keyword density within 2% to 3%", () => {
    for (const locale of ["en", "zh-CN"] as const) {
      const density = getGreenhouseSprinklerLayoutKeywordDensity(
        getGreenhouseSprinklerLayoutPageCopy(locale),
        locale,
      );

      if (density.densityPercent < 2 || density.densityPercent > 3) {
        throw new Error(
          `Greenhouse Sprinkler Layout keyword density for ${locale} must be 2% to 3%; received ${density.keywordMentions}/${density.visibleWordCount} = ${density.densityPercent.toFixed(4)}%.`,
        );
      }
    }
  });
});
