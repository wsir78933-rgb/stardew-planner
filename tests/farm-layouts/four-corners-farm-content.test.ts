import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getFourCornersFarmPageCopy,
  type FourCornersFarmPageCopy,
} from "../../src/farm-layouts/four-corners-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedFourCornersFarmCaseIds = [
  "01-formal-garden",
  "02-mushroom-village",
  "03-themed-quadrants",
  "04-twelve-fish-ponds",
  "05-bees-and-animals",
  "06-junimo-columns",
  "07-clock-garden",
] as const;

function getFourCornersFarmBodyText(
  copy: FourCornersFarmPageCopy,
): string {
  const firstFourCornersFarmCase = copy.cases[0];
  if (firstFourCornersFarmCase === undefined) {
    throw new Error(
      `Cannot measure Four Corners Farm keyword density without a case. Received ${copy.cases.length} cases.`,
    );
  }

  return [
    copy.title,
    copy.intro,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.categoryLabel,
    firstFourCornersFarmCase.title,
    copy.whatIsHeading,
    ...copy.whatIsParagraphs,
    copy.casesHeading,
    copy.casesDescription,
    ...copy.cases.flatMap((farmCase) => [
      farmCase.title,
      farmCase.summary,
      copy.downloadProjectLabel,
    ]),
    copy.howToEyebrow,
    copy.howToHeading,
    ...copy.howToSteps.flatMap((step) => [
      step.number,
      step.title,
      step.body,
    ]),
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

function countFourCornersFarmKeywordMentions(
  bodyText: string,
  locale: "en" | "zh-CN",
): number {
  if (locale === "en") {
    return [
      ...bodyText.matchAll(
        /\bstardew valley four corners farm layout\b/giu,
      ),
    ].length;
  }

  return bodyText.split("星露谷物语四角农场布局").length - 1;
}

function getWebpDimensions(
  webpBytes: Buffer,
  webpPath: string,
): Readonly<{ width: number; height: number }> {
  if (webpBytes.length < 30) {
    throw new Error(
      `WebP image is too short to contain dimensions at ${webpPath}; received ${webpBytes.length} bytes.`,
    );
  }

  const riffSignature = webpBytes.subarray(0, 4).toString("ascii");
  const webpSignature = webpBytes.subarray(8, 12).toString("ascii");
  const imageChunkType = webpBytes.subarray(12, 16).toString("ascii");
  const frameStartCode = webpBytes.subarray(23, 26);

  if (riffSignature !== "RIFF" || webpSignature !== "WEBP") {
    throw new Error(
      `Expected RIFF/WEBP signatures at ${webpPath}; received ${riffSignature}/${webpSignature}.`,
    );
  }
  if (imageChunkType !== "VP8 ") {
    throw new Error(
      `Expected a VP8 image chunk at ${webpPath}; received ${imageChunkType}.`,
    );
  }
  if (!frameStartCode.equals(Buffer.from([0x9d, 0x01, 0x2a]))) {
    throw new Error(
      `Expected a VP8 key-frame marker at ${webpPath}; received ${frameStartCode.toString("hex")}.`,
    );
  }

  return {
    width: webpBytes.readUInt16LE(26) & 0x3fff,
    height: webpBytes.readUInt16LE(28) & 0x3fff,
  };
}

function getAvifDimensions(
  avifBytes: Buffer,
  avifPath: string,
): Readonly<{ width: number; height: number }> {
  if (!avifBytes.includes(Buffer.from("ftypavif"))) {
    throw new Error(
      `Expected an AVIF file brand at ${avifPath}; received ${avifBytes.subarray(0, 16).toString("hex")}.`,
    );
  }

  const imagePropertiesIndex = avifBytes.indexOf(Buffer.from("ispe"));
  if (imagePropertiesIndex < 0) {
    throw new Error(
      `AVIF image properties are missing at ${avifPath}; received ${avifBytes.length} bytes without an ispe box.`,
    );
  }

  const dimensionsEndIndex = imagePropertiesIndex + 16;
  if (dimensionsEndIndex > avifBytes.length) {
    throw new Error(
      `AVIF image properties are truncated at ${avifPath}; ispe index ${imagePropertiesIndex}, file length ${avifBytes.length}.`,
    );
  }

  return {
    width: avifBytes.readUInt32BE(imagePropertiesIndex + 8),
    height: avifBytes.readUInt32BE(imagePropertiesIndex + 12),
  };
}

describe("Four Corners Farm page content and projects", () => {
  it("keeps seven cases aligned across English and Simplified Chinese", () => {
    const englishCopy = getFourCornersFarmPageCopy("en");
    const chineseCopy = getFourCornersFarmPageCopy("zh-CN");

    expect(englishCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedFourCornersFarmCaseIds,
    );
    expect(chineseCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedFourCornersFarmCaseIds,
    );

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(
        localizedCopy.whatIsParagraphs.every((paragraph) => paragraph.trim() !== ""),
      ).toBe(true);
      expect(localizedCopy.howToSteps.map((step) => step.number)).toEqual([
        "01",
        "02",
        "03",
      ]);
      expect(localizedCopy.faqs.length).toBeGreaterThanOrEqual(4);
      expect(localizedCopy.faqs.length).toBeLessThanOrEqual(5);
    }

    expect(englishCopy.howToSteps[1]?.body).toContain("Library");
    expect(englishCopy.howToSteps[1]?.body).toContain("Import JSON");
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目");
    expect(chineseCopy.howToSteps[1]?.body).toContain("导入 JSON");

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Four Corners Farm case at index ${caseIndex} for id ${englishCase.id}.`,
        );
      }

      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(1600);
      expect(englishCase.imageHeight).toBe(1600);
      expect(chineseCase.imageWidth).toBe(1600);
      expect(chineseCase.imageHeight).toBe(1600);
    }
  });

  it("keeps the exact keyword density between two and three percent", () => {
    for (const locale of ["en", "zh-CN"] as const) {
      const localizedCopy = getFourCornersFarmPageCopy(locale);
      const normalizedBodyText = getFourCornersFarmBodyText(localizedCopy)
        .replace(/\s+/gu, " ")
        .trim();
      const wordCount = [
        ...new Intl.Segmenter(locale, { granularity: "word" }).segment(
          normalizedBodyText,
        ),
      ].filter((segment) => segment.isWordLike).length;
      const keywordMentions = countFourCornersFarmKeywordMentions(
        normalizedBodyText,
        locale,
      );
      const densityPercent = (keywordMentions / wordCount) * 100;

      expect(wordCount).toBeGreaterThan(0);
      expect(densityPercent).toBeGreaterThanOrEqual(2);
      expect(densityPercent).toBeLessThanOrEqual(3);
    }
  });

  it("describes the bee and animal buildings in their pictured quadrants", () => {
    const englishBeeCase = getFourCornersFarmPageCopy("en").cases.find(
      (farmCase) => farmCase.id === "05-bees-and-animals",
    );
    const chineseBeeCase = getFourCornersFarmPageCopy("zh-CN").cases.find(
      (farmCase) => farmCase.id === "05-bees-and-animals",
    );

    if (englishBeeCase === undefined || chineseBeeCase === undefined) {
      throw new Error(
        `Expected the 05-bees-and-animals case in both locales; received English=${JSON.stringify(englishBeeCase?.id)} and Simplified Chinese=${JSON.stringify(chineseBeeCase?.id)}.`,
      );
    }

    expect(englishBeeCase.summary).toContain("northeast");
    expect(englishBeeCase.summary).toContain("northwest");
    expect(englishBeeCase.summary).toContain("southeast");
    expect(englishBeeCase.imageAlt).toContain("northeast");
    expect(englishBeeCase.imageAlt).toContain("northwest");
    expect(englishBeeCase.imageAlt).toContain("southeast");
    expect(chineseBeeCase.summary).toContain("东北");
    expect(chineseBeeCase.summary).toContain("西北");
    expect(chineseBeeCase.summary).toContain("东南");
    expect(chineseBeeCase.imageAlt).toContain("东北");
    expect(chineseBeeCase.imageAlt).toContain("西北");
    expect(chineseBeeCase.imageAlt).toContain("东南");
  });

  it("serves WebP and AVIF images and validates every real planner project", () => {
    const englishCopy = getFourCornersFarmPageCopy("en");
    const chineseCopy = getFourCornersFarmPageCopy("zh-CN");

    for (const [caseIndex, farmCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Four Corners Farm case at index ${caseIndex} for id ${farmCase.id}.`,
        );
      }

      const relativePreviewPath = farmCase.imageSrc.slice(1);
      const relativeFullImagePath = farmCase.imageOriginalSrc.slice(1);
      const relativeAvifPath = relativePreviewPath.replace(/\.webp$/u, ".avif");
      const relativeProjectPath = farmCase.projectHref.slice(1);
      const previewImagePath = resolve(projectRoot, "public", relativePreviewPath);
      const fullImagePath = resolve(projectRoot, "public", relativeFullImagePath);
      const avifImagePath = resolve(projectRoot, "public", relativeAvifPath);
      const projectPath = resolve(projectRoot, "public", relativeProjectPath);
      const previewImageBytes = readFileSync(previewImagePath);
      const fullImageBytes = readFileSync(fullImagePath);
      const avifImageBytes = readFileSync(avifImagePath);

      expect(previewImageBytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(previewImageBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(fullImageBytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(fullImageBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(avifImageBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(getWebpDimensions(previewImageBytes, previewImagePath)).toEqual({
        width: 1600,
        height: 1600,
      });
      expect(getWebpDimensions(fullImageBytes, fullImagePath)).toEqual({
        width: 2560,
        height: 2560,
      });
      expect(getAvifDimensions(avifImageBytes, avifImagePath)).toEqual({
        width: 1600,
        height: 1600,
      });
      expect(statSync(previewImagePath).size).toBeGreaterThan(0);
      expect(statSync(fullImagePath).size).toBeGreaterThan(0);
      expect(statSync(avifImagePath).size).toBeGreaterThan(0);
      expect(fullImageBytes.length).toBeGreaterThan(previewImageBytes.length);

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
      expect(
        validatedProjectDocument.projects[0].project.maps[0].mapFile,
      ).toBe("Farm_FourCorners.tmx");
      expect(validatedProjectDocument.projects[0].project.maps[0].label).toBe(
        "Four Corners Farm",
      );
      expect(chineseCase.projectHref).toBe(farmCase.projectHref);
    }
  });
});
