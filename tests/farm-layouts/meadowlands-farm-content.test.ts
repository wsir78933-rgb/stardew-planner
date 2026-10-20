import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getMeadowlandsFarmPageCopy } from "../../src/farm-layouts/meadowlands-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedMeadowlandsCaseIds = [
  "01-starter-coop-mayo-lane",
  "02-blue-grass-pasture-ring",
  "03-southwest-compact-crops",
  "04-housefront-garden-well",
  "05-northwest-greenhouse",
  "06-north-bridge-silos",
  "07-east-barns-west-sheds",
  "08-clock-hub-twin-pastures",
  "09-riverside-fish-ponds",
  "10-late-barns-cellar",
] as const;

function getMeadowlandsBodyText(
  copy: ReturnType<typeof getMeadowlandsFarmPageCopy>,
): string {
  const firstMeadowlandsCase = copy.cases[0];
  if (firstMeadowlandsCase === undefined) {
    throw new Error(
      `Cannot measure Meadowlands keyword density without a case. Received ${copy.cases.length} cases.`,
    );
  }

  return [
    copy.title,
    copy.intro,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.categoryLabel,
    firstMeadowlandsCase.title,
    copy.whatIsHeading,
    ...copy.whatIsParagraphs,
    copy.casesHeading,
    copy.casesDescription,
    ...copy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
      copy.downloadProjectLabel,
    ]),
    copy.howToEyebrow,
    copy.howToHeading,
    ...copy.howToSteps.flatMap((step) => [step.number, step.title, step.body]),
    copy.openPlannerLabel,
    copy.faqEyebrow,
    copy.faqHeading,
    copy.faqDescription,
    ...copy.faqs.flatMap((faq) => [faq.question, faq.answer]),
    copy.ctaHeading,
    copy.ctaDescription,
    copy.ctaButtonLabel,
  ].join("\n");
}

function countMeadowlandsKeywordMentions(
  bodyText: string,
  locale: "en" | "zh-CN",
): number {
  const keyword =
    locale === "en" ? "meadowlands farm layout" : "星露谷物语草原农场布局";

  if (locale === "en") {
    return [...bodyText.matchAll(/\bmeadowlands farm layout\b/giu)].length;
  }

  return bodyText.split(keyword).length - 1;
}

describe("Meadowlands Farm page content and projects", () => {
  it("keeps ten cases aligned across English and Simplified Chinese", () => {
    const englishCopy = getMeadowlandsFarmPageCopy("en");
    const chineseCopy = getMeadowlandsFarmPageCopy("zh-CN");

    expect(englishCopy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedMeadowlandsCaseIds,
    );
    expect(chineseCopy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedMeadowlandsCaseIds,
    );
    expect(englishCopy.whatIsParagraphs).toHaveLength(2);
    expect(chineseCopy.whatIsParagraphs).toHaveLength(2);
    expect(englishCopy.howToSteps.map((step) => step.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
    expect(chineseCopy.howToSteps.map((step) => step.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
    expect(englishCopy.faqs.length).toBeGreaterThanOrEqual(4);
    expect(chineseCopy.faqs.length).toBe(englishCopy.faqs.length);
    expect(englishCopy.howToSteps[1]?.body).toContain("Library");
    expect(englishCopy.howToSteps[1]?.body).toContain("Import JSON");
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目");
    expect(chineseCopy.howToSteps[1]?.body).toContain("导入 JSON");

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      expect(chineseCase).toBeDefined();
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(1600);
      expect(englishCase.imageHeight).toBe(1200);
      expect(chineseCase.imageWidth).toBe(1600);
      expect(chineseCase.imageHeight).toBe(1200);
    }
  });

  it("keeps the exact keyword density between two and three percent", () => {
    for (const locale of ["en", "zh-CN"] as const) {
      const copy = getMeadowlandsFarmPageCopy(locale);
      const normalizedBodyText = getMeadowlandsBodyText(copy)
        .replace(/\s+/gu, " ")
        .trim();
      const wordCount = [
        ...new Intl.Segmenter(locale, { granularity: "word" }).segment(
          normalizedBodyText,
        ),
      ].filter((segment) => segment.isWordLike).length;
      const keywordMentions = countMeadowlandsKeywordMentions(
        normalizedBodyText,
        locale,
      );
      const densityPercent = (keywordMentions / wordCount) * 100;

      expect(wordCount).toBeGreaterThan(0);
      expect(densityPercent).toBeGreaterThanOrEqual(2);
      expect(densityPercent).toBeLessThanOrEqual(3);
    }
  });

  it("serves original and optimized images and validates every real planner project", () => {
    const englishCopy = getMeadowlandsFarmPageCopy("en");
    const chineseCopy = getMeadowlandsFarmPageCopy("zh-CN");

    for (const layoutCase of englishCopy.cases) {
      const relativeWebpPath = layoutCase.imageSrc.slice(1);
      const relativeJpegPath = layoutCase.imageOriginalSrc.slice(1);
      const relativeAvifPath = relativeWebpPath.replace(/\.webp$/u, ".avif");
      const relativeProjectPath = layoutCase.projectHref.slice(1);
      const webpPath = resolve(projectRoot, "public", relativeWebpPath);
      const jpegPath = resolve(projectRoot, "public", relativeJpegPath);
      const avifPath = resolve(projectRoot, "public", relativeAvifPath);
      const projectPath = resolve(projectRoot, "public", relativeProjectPath);
      const webpBytes = readFileSync(webpPath);
      const jpegBytes = readFileSync(jpegPath);
      const avifBytes = readFileSync(avifPath);

      expect(webpBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(jpegBytes.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
      expect(avifBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(statSync(webpPath).size).toBeGreaterThan(0);
      expect(statSync(jpegPath).size).toBeGreaterThan(0);
      expect(statSync(avifPath).size).toBeGreaterThan(0);
      expect(existsSync(projectPath)).toBe(true);

      const serializedProjectDocument = readFileSync(projectPath, "utf8");
      const parsedProjectDocument = parseReferenceProjectDocument(
        serializedProjectDocument,
      );
      const validatedProjectDocument = validateReferenceProjectDocument(
        JSON.parse(serializedProjectDocument) as unknown,
      );

      expect(parsedProjectDocument).toEqual(validatedProjectDocument);
      expect(validatedProjectDocument.projects).toHaveLength(1);
      expect(validatedProjectDocument.projects[0].project.maps).toHaveLength(1);
      expect(validatedProjectDocument.projects[0].project.maps[0].mapFile).toBe(
        "Farm_Ranching.tmx",
      );
      expect(validatedProjectDocument.projects[0].project.maps[0].label).toBe(
        "Meadowlands Farm",
      );
    }

    expect(chineseCopy.cases.map((layoutCase) => layoutCase.projectHref)).toEqual(
      englishCopy.cases.map((layoutCase) => layoutCase.projectHref),
    );
  });
});
