import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  frontierFarmCanonicalPath,
  getFrontierFarmPageCopy,
  type FrontierFarmCase,
  type FrontierFarmCover,
  type FrontierFarmPageCopy,
} from "../../src/farm-layouts/frontier-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedFrontierFarmCaseIds = [
  "02-cottagecore-terraces",
  "03-west-animals-east-crops",
  "04-tapper-honey-barn",
  "05-junimo-village",
  "06-ranch-ancient-fruit",
  "07-nine-fish-ponds",
] as const;

type FrontierFarmImage = Readonly<{
  id: string;
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}>;

function getFrontierFarmBodyText(copy: FrontierFarmPageCopy): string {
  if (copy.cases.length === 0) {
    throw new Error(
      `Cannot measure Frontier Farm keyword density without cases. Received ${copy.cases.length} cases.`,
    );
  }

  return [
    copy.title,
    copy.intro,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.categoryLabel,
    copy.cover.caption,
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
  ]
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
}

function countFrontierFarmKeywordMentions(
  bodyText: string,
  locale: "en" | "zh-CN",
): number {
  const keyword =
    locale === "en"
      ? "stardew valley frontier farm layout"
      : "星露谷物语边境农场布局";

  if (locale === "en") {
    return [...bodyText.matchAll(/\bstardew valley frontier farm layout\b/giu)]
      .length;
  }

  return bodyText.split(keyword).length - 1;
}

function getFrontierFarmImages(
  cover: FrontierFarmCover,
  cases: readonly FrontierFarmCase[],
): readonly FrontierFarmImage[] {
  return [
    {
      id: "cover",
      imageSrc: cover.imageSrc,
      imageOriginalSrc: cover.imageOriginalSrc,
      imageAlt: cover.imageAlt,
      imageWidth: cover.imageWidth,
      imageHeight: cover.imageHeight,
    },
    ...cases.map((farmCase) => ({
      id: farmCase.id,
      imageSrc: farmCase.imageSrc,
      imageOriginalSrc: farmCase.imageOriginalSrc,
      imageAlt: farmCase.imageAlt,
      imageWidth: farmCase.imageWidth,
      imageHeight: farmCase.imageHeight,
    })),
  ];
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

describe("Frontier Farm page content and projects", () => {
  it("keeps six localized cases and a separate cover in the public contract", () => {
    const englishCopy = getFrontierFarmPageCopy("en");
    const chineseCopy = getFrontierFarmPageCopy("zh-CN");

    expect(frontierFarmCanonicalPath).toBe(
      "/stardew-valley-frontier-farm-layout",
    );
    expect(englishCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedFrontierFarmCaseIds,
    );
    expect(chineseCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedFrontierFarmCaseIds,
    );
    expect(englishCopy.cases).toHaveLength(6);
    expect(chineseCopy.cases).toHaveLength(6);
    expect(englishCopy.cover.imageSrc).toContain("01-dual-bank-junimo-river");
    expect(englishCopy.cover.imageSrc).toBe(chineseCopy.cover.imageSrc);
    expect(englishCopy.cover.imageOriginalSrc).toBe(
      chineseCopy.cover.imageOriginalSrc,
    );
    expect(englishCopy.cover.imageWidth).toBe(1920);
    expect(englishCopy.cover.imageHeight).toBe(800);
    expect(chineseCopy.cover.imageWidth).toBe(1920);
    expect(chineseCopy.cover.imageHeight).toBe(800);
    expect(englishCopy.cover.caption.trim()).not.toBe("");
    expect(chineseCopy.cover.caption.trim()).not.toBe("");
    expect(chineseCopy.cover.imageAlt).not.toBe(englishCopy.cover.imageAlt);
    expect(chineseCopy.cover.caption).not.toBe(englishCopy.cover.caption);

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

    expect(englishCopy.intro).toContain("optional map");
    expect(englishCopy.intro).toContain("base game's eight farm maps");
    expect(englishCopy.howToSteps[1]?.body).toContain("Library");
    expect(englishCopy.howToSteps[1]?.body).toContain("Import JSON");
    expect(chineseCopy.intro).toContain("原版八种农场地图");
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目");
    expect(chineseCopy.howToSteps[1]?.body).toContain("导入 JSON");
  });

  it("keeps visible copy keyword density between two and three percent", () => {
    for (const locale of ["en", "zh-CN"] as const) {
      const localizedCopy = getFrontierFarmPageCopy(locale);
      const bodyText = getFrontierFarmBodyText(localizedCopy);
      const wordCount = [
        ...new Intl.Segmenter(locale, { granularity: "word" }).segment(bodyText),
      ].filter((segment) => segment.isWordLike).length;
      const keywordMentions = countFrontierFarmKeywordMentions(bodyText, locale);
      const densityPercent = (keywordMentions / wordCount) * 100;

      expect(wordCount).toBeGreaterThan(0);
      expect(densityPercent).toBeGreaterThanOrEqual(2);
      expect(densityPercent).toBeLessThanOrEqual(3);
    }
  });

  it("serves seven cover and case image sets and validates six real projects", () => {
    const englishCopy = getFrontierFarmPageCopy("en");
    const chineseCopy = getFrontierFarmPageCopy("zh-CN");

    for (const [imageIndex, farmImage] of getFrontierFarmImages(
      englishCopy.cover,
      englishCopy.cases,
    ).entries()) {
      const chineseImage = getFrontierFarmImages(
        chineseCopy.cover,
        chineseCopy.cases,
      )[imageIndex];
      if (chineseImage === undefined) {
        throw new Error(
          `Missing Simplified Chinese Frontier Farm image at index ${imageIndex} for ${farmImage.id}.`,
        );
      }

      expect(chineseImage.imageSrc).toBe(farmImage.imageSrc);
      expect(chineseImage.imageOriginalSrc).toBe(farmImage.imageOriginalSrc);
      expect(chineseImage.id).toBe(farmImage.id);
      expect(chineseImage.imageAlt).not.toBe(farmImage.imageAlt);
      expect(farmImage.imageWidth).toBe(1920);
      expect(farmImage.imageHeight).toBe(800);

      const relativePreviewPath = farmImage.imageSrc.slice(1);
      const relativeFullImagePath = farmImage.imageOriginalSrc.slice(1);
      const relativeAvifPath = relativePreviewPath.replace(/\.webp$/u, ".avif");
      const previewImagePath = resolve(projectRoot, "public", relativePreviewPath);
      const fullImagePath = resolve(projectRoot, "public", relativeFullImagePath);
      const avifImagePath = resolve(projectRoot, "public", relativeAvifPath);
      const previewImageBytes = readFileSync(previewImagePath);
      const fullImageBytes = readFileSync(fullImagePath);
      const avifImageBytes = readFileSync(avifImagePath);

      expect(getWebpDimensions(previewImageBytes, previewImagePath)).toEqual({
        width: 1920,
        height: 800,
      });
      expect(getWebpDimensions(fullImageBytes, fullImagePath)).toEqual({
        width: 4992,
        height: 2080,
      });
      expect(getAvifDimensions(avifImageBytes, avifImagePath)).toEqual({
        width: 1920,
        height: 800,
      });
      expect(statSync(previewImagePath).size).toBeGreaterThan(0);
      expect(statSync(fullImagePath).size).toBeGreaterThan(0);
      expect(statSync(avifImagePath).size).toBeGreaterThan(0);

      if (farmImage.id === "cover") {
        const coverProjectHref = `${farmImage.imageSrc
          .replace("/images/", "/projects/")
          .replace(/\.webp$/u, ".json")}`;
        expect(
          existsSync(resolve(projectRoot, "public", coverProjectHref.slice(1))),
        ).toBe(false);
        continue;
      }

      const frontierFarmCase = englishCopy.cases.find(
        (layoutCase) => layoutCase.id === farmImage.id,
      );
      if (frontierFarmCase === undefined) {
        throw new Error(
          `Missing English Frontier Farm case for image ${JSON.stringify(farmImage.id)}.`,
        );
      }

      const chineseFarmCase = chineseCopy.cases.find(
        (layoutCase) => layoutCase.id === farmImage.id,
      );
      if (chineseFarmCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Frontier Farm case for image ${JSON.stringify(farmImage.id)}.`,
        );
      }

      expect(chineseFarmCase.projectHref).toBe(frontierFarmCase.projectHref);
      expect(chineseFarmCase.title.trim()).not.toBe("");
      expect(chineseFarmCase.summary.trim()).not.toBe("");
      expect(chineseFarmCase.title).not.toBe(frontierFarmCase.title);
      expect(chineseFarmCase.summary).not.toBe(frontierFarmCase.summary);
      const relativeProjectPath = frontierFarmCase.projectHref.slice(1);
      const projectPath = resolve(projectRoot, "public", relativeProjectPath);
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
        "FrontierFarm.tmx",
      );
      expect(validatedProjectDocument.projects[0].project.maps[0].label).toBe(
        "Frontier Farm",
      );
    }
  });
});
