import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createCatalogCategoryLoader } from "../../src/catalog/catalog-category-loader";
import type { CatalogJsonResponse } from "../../src/catalog/catalog-types";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
  hilltopFarmCanonicalPath,
  type HilltopFarmPageCopy,
} from "../../src/farm-layouts/hilltop-farm-content";
import {
  analyzeRequiredPlacementCatalog,
  getRequiredPlacementCatalogCategories,
} from "../../src/planner/planner-workspace-required-catalog";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
} from "../../src/reference-runtime/local-project-api";
import {
  getPlannerMapIdForMapFile,
  prepareReferenceProjectActiveSession,
} from "../../src/reference-runtime/use-reference-project-workspace";

const projectRoot = resolve(import.meta.dirname, "../..");
const hilltopImageDirectory = "/farm-layouts/hilltop/images/";
const hilltopProjectDirectory = "/farm-layouts/hilltop/projects/";
const expectedHilltopImageSize = { width: 2560, height: 2080 } as const;
const expectedHilltopFarmCaseIds = [
  "naturalistic-village",
  "victorian-homestead",
  "peak-to-ranch",
  "sprinkler-forest",
  "urbanized-paths",
  "quarry-ranch",
  "heart-apiary",
] as const;
const jpegStartOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function resolvePublicAsset(publicPath: string): string {
  if (
    !publicPath.startsWith("/")
    || publicPath.startsWith("//")
    || publicPath.split("/").includes("..")
  ) {
    throw new Error(
      `Hilltop Farm public asset path must stay inside public/. Received: ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(projectRoot, "public", publicPath.slice(1));
}

function readPublicCatalogDataset(datasetUrl: string): Promise<CatalogJsonResponse> {
  if (!datasetUrl.startsWith("/game-assets/")) {
    throw new Error(
      `Catalog dataset URL must start with /game-assets/. Received: ${JSON.stringify(datasetUrl)}.`,
    );
  }

  const datasetText = readFileSync(resolvePublicAsset(datasetUrl), "utf8");
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(JSON.parse(datasetText) as unknown),
  });
}

function getHilltopBodyText(copy: HilltopFarmPageCopy): string {
  const featuredCase = copy.cases[0];
  if (featuredCase === undefined) {
    throw new Error(
      `Cannot measure Hilltop Farm keyword density without a case. Received ${copy.cases.length} cases.`,
    );
  }

  return [
    copy.title,
    copy.intro,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.categoryLabel,
    featuredCase.title,
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

function countHilltopFarmLayoutMentions(bodyText: string): number {
  return [...bodyText.matchAll(/\bhilltop farm layout\b/giu)].length;
}

function requireChineseHilltopTranslation(
  fieldName: string,
  englishText: string,
  chineseText: string,
): void {
  if (chineseText.trim() === "") {
    throw new Error(`Chinese Hilltop Farm field ${fieldName} is empty.`);
  }
  if (chineseText === englishText) {
    throw new Error(
      `Chinese Hilltop Farm field ${fieldName} still matches the English text ${JSON.stringify(englishText)}.`,
    );
  }
  if (!/\p{Script=Han}/u.test(chineseText)) {
    throw new Error(
      `Chinese Hilltop Farm field ${fieldName} has no Han characters. Received: ${JSON.stringify(chineseText)}.`,
    );
  }
}

function readJpegDimensions(
  jpegBytes: Buffer,
  jpegPath: string,
): Readonly<{ width: number; height: number }> {
  if (
    jpegBytes.length < 4
    || jpegBytes[0] !== 0xff
    || jpegBytes[1] !== 0xd8
  ) {
    throw new Error(
      `Expected a JPEG SOI marker at ${jpegPath}; received ${jpegBytes.subarray(0, 4).toString("hex")}.`,
    );
  }

  let offset = 2;
  while (offset + 3 < jpegBytes.length) {
    if (jpegBytes[offset] !== 0xff) {
      throw new Error(
        `Expected a JPEG marker at ${jpegPath} offset ${offset}; received 0x${jpegBytes[offset]?.toString(16)}.`,
      );
    }
    while (jpegBytes[offset] === 0xff) {
      offset += 1;
    }

    const marker = jpegBytes[offset];
    offset += 1;
    if (marker === undefined || marker === 0xd8 || marker === 0xd9 || marker === 0xda) {
      break;
    }
    if (offset + 1 >= jpegBytes.length) {
      throw new Error(
        `JPEG marker length is truncated at ${jpegPath} offset ${offset}.`,
      );
    }

    const segmentLength = jpegBytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > jpegBytes.length) {
      throw new Error(
        `JPEG segment length ${segmentLength} does not fit at ${jpegPath} offset ${offset}; file length ${jpegBytes.length}.`,
      );
    }
    if (jpegStartOfFrameMarkers.has(marker)) {
      return {
        height: jpegBytes.readUInt16BE(offset + 3),
        width: jpegBytes.readUInt16BE(offset + 5),
      };
    }

    offset += segmentLength;
  }

  throw new Error(
    `JPEG start-of-frame marker is missing at ${jpegPath}; received ${jpegBytes.length} bytes.`,
  );
}

function readWebpDimensions(
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
  const chunkType = webpBytes.subarray(12, 16).toString("ascii");
  if (riffSignature !== "RIFF" || webpSignature !== "WEBP") {
    throw new Error(
      `Expected RIFF/WEBP signatures at ${webpPath}; received ${riffSignature}/${webpSignature}.`,
    );
  }

  if (chunkType === "VP8 ") {
    const frameStartCode = webpBytes.subarray(23, 26);
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

  if (chunkType === "VP8L") {
    if (webpBytes[20] !== 0x2f) {
      throw new Error(
        `Expected a VP8L signature at ${webpPath}; received 0x${webpBytes[20]?.toString(16)}.`,
      );
    }
    const packedDimensions = webpBytes.readUInt32LE(21);
    return {
      width: (packedDimensions & 0x3fff) + 1,
      height: ((packedDimensions >> 14) & 0x3fff) + 1,
    };
  }

  if (chunkType === "VP8X") {
    return {
      width: 1 + webpBytes[24]! + (webpBytes[25]! << 8) + (webpBytes[26]! << 16),
      height: 1 + webpBytes[27]! + (webpBytes[28]! << 8) + (webpBytes[29]! << 16),
    };
  }

  throw new Error(
    `Unsupported WebP chunk ${JSON.stringify(chunkType)} at ${webpPath}.`,
  );
}

function readAvifDimensions(
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

function requireStateArray(
  state: Record<string, ReferenceJsonValue>,
  fieldName: string,
  projectHref: string,
): readonly unknown[] {
  const fieldValue = state[fieldName];
  if (!Array.isArray(fieldValue)) {
    const receivedKind = fieldValue === null ? "null" : typeof fieldValue;
    throw new Error(
      `Hilltop project ${projectHref} state.${fieldName} must be an array. Received: ${receivedKind}.`,
    );
  }

  return fieldValue;
}

describe("Hilltop Farm page content and project assets", () => {
  it("keeps seven bilingual layouts in source order and features case 01", () => {
    const englishCopy = getHilltopFarmPageCopy("en");
    const chineseCopy = getHilltopFarmPageCopy("zh-CN");
    const englishFeaturedCase = getFeaturedHilltopFarmCase("en");
    const chineseFeaturedCase = getFeaturedHilltopFarmCase("zh-CN");

    expect(hilltopFarmCanonicalPath).toBe(
      "/stardew-valley-hilltop-farm-layout",
    );
    expect(englishCopy.cases.map(({ id }) => id)).toEqual(
      expectedHilltopFarmCaseIds,
    );
    expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
      expectedHilltopFarmCaseIds,
    );
    expect(new Set(englishCopy.cases.map(({ projectHref }) => projectHref)).size)
      .toBe(7);
    expect(
      new Set(englishCopy.cases.map(({ imageOriginalSrc }) => imageOriginalSrc)).size,
    ).toBe(7);
    expect(englishFeaturedCase.id).toBe("naturalistic-village");
    expect(chineseFeaturedCase.id).toBe("naturalistic-village");
    expect(englishFeaturedCase).toMatchObject(englishCopy.cases[0]!);
    expect(chineseFeaturedCase).toMatchObject(chineseCopy.cases[0]!);
    expect(chineseCopy.title).not.toBe(englishCopy.title);
    expect(chineseCopy.description).not.toBe(englishCopy.description);

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.title.trim()).not.toBe("");
      expect(localizedCopy.metaTitle.trim()).not.toBe("");
      expect(localizedCopy.metaTitle).not.toBe(localizedCopy.title);
      expect(localizedCopy.description.trim()).not.toBe("");
      expect(localizedCopy.intro.trim()).not.toBe("");
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(localizedCopy.howToSteps).toHaveLength(3);
      expect(localizedCopy.howToSteps.map((step) => step.number)).toEqual([
        "01",
        "02",
        "03",
      ]);
      expect(localizedCopy.faqs.length).toBeGreaterThan(0);
      expect(
        localizedCopy.cases.every(
          ({ title, summary, imageAlt }) =>
            title.trim() !== "" && summary.trim() !== "" && imageAlt.trim() !== "",
        ),
      ).toBe(true);
    }

    expect(englishCopy.howToSteps[1]?.body).toContain("Library");
    expect(englishCopy.howToSteps[1]?.body).toContain("Import JSON");
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目");
    expect(chineseCopy.howToSteps[1]?.body).toContain("导入 JSON");

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Hilltop Farm case at index ${caseIndex} for id ${englishCase.id}.`,
        );
      }

      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(chineseCase.title).not.toBe(englishCase.title);
      expect(chineseCase.summary).not.toBe(englishCase.summary);
    }
  });

  it("keeps the exact English phrase density between two and three percent", () => {
    const normalizedBodyText = getHilltopBodyText(getHilltopFarmPageCopy("en"))
      .replace(/\s+/gu, " ")
      .trim();
    const wordCount = [
      ...new Intl.Segmenter("en", { granularity: "word" }).segment(
        normalizedBodyText,
      ),
    ].filter((segment) => segment.isWordLike).length;
    const phraseMentions = countHilltopFarmLayoutMentions(normalizedBodyText);
    const densityPercent = (phraseMentions / wordCount) * 100;
    const densityDetail = `hilltop farm layout mentions=${phraseMentions}, body words=${wordCount}, density=${densityPercent}`;

    expect(wordCount, densityDetail).toBeGreaterThan(0);
    expect(phraseMentions, densityDetail).toBeGreaterThan(0);
    expect(densityPercent, densityDetail).toBeGreaterThanOrEqual(2);
    expect(densityPercent, densityDetail).toBeLessThanOrEqual(3);
  });

  it("translates the visible Simplified Chinese copy without a density target", () => {
    const englishCopy = getHilltopFarmPageCopy("en");
    const chineseCopy = getHilltopFarmPageCopy("zh-CN");
    const translatedFields: ReadonlyArray<readonly [string, string, string]> = [
      ["title", englishCopy.title, chineseCopy.title],
      ["metaTitle", englishCopy.metaTitle, chineseCopy.metaTitle],
      ["description", englishCopy.description, chineseCopy.description],
      ["intro", englishCopy.intro, chineseCopy.intro],
      ["categoryLabel", englishCopy.categoryLabel, chineseCopy.categoryLabel],
      ["browseLabel", englishCopy.browseLabel, chineseCopy.browseLabel],
      ["openPlannerLabel", englishCopy.openPlannerLabel, chineseCopy.openPlannerLabel],
      ["casesHeading", englishCopy.casesHeading, chineseCopy.casesHeading],
      ["casesDescription", englishCopy.casesDescription, chineseCopy.casesDescription],
      ["ctaHeading", englishCopy.ctaHeading, chineseCopy.ctaHeading],
      ["ctaDescription", englishCopy.ctaDescription, chineseCopy.ctaDescription],
      ["ctaButtonLabel", englishCopy.ctaButtonLabel, chineseCopy.ctaButtonLabel],
      ["whatIsHeading", englishCopy.whatIsHeading, chineseCopy.whatIsHeading],
      ["downloadProjectLabel", englishCopy.downloadProjectLabel, chineseCopy.downloadProjectLabel],
      ["enlargeImageLabel", englishCopy.enlargeImageLabel, chineseCopy.enlargeImageLabel],
      ["closeImageLabel", englishCopy.closeImageLabel, chineseCopy.closeImageLabel],
      ["howToEyebrow", englishCopy.howToEyebrow, chineseCopy.howToEyebrow],
      ["howToHeading", englishCopy.howToHeading, chineseCopy.howToHeading],
      ["faqEyebrow", englishCopy.faqEyebrow, chineseCopy.faqEyebrow],
      ["faqHeading", englishCopy.faqHeading, chineseCopy.faqHeading],
      ["faqDescription", englishCopy.faqDescription, chineseCopy.faqDescription],
    ];

    for (const [fieldName, englishText, chineseText] of translatedFields) {
      requireChineseHilltopTranslation(fieldName, englishText, chineseText);
    }
    for (const [paragraphIndex, englishParagraph] of englishCopy.whatIsParagraphs.entries()) {
      const chineseParagraph = chineseCopy.whatIsParagraphs[paragraphIndex];
      if (chineseParagraph === undefined) {
        throw new Error(
          `Missing Simplified Chinese Hilltop Farm what-is paragraph at index ${paragraphIndex}.`,
        );
      }
      requireChineseHilltopTranslation(
        `whatIsParagraphs[${paragraphIndex}]`,
        englishParagraph,
        chineseParagraph,
      );
    }
    for (const [stepIndex, englishStep] of englishCopy.howToSteps.entries()) {
      const chineseStep = chineseCopy.howToSteps[stepIndex];
      if (chineseStep === undefined) {
        throw new Error(
          `Missing Simplified Chinese Hilltop Farm how-to step at index ${stepIndex}.`,
        );
      }
      requireChineseHilltopTranslation(
        `howToSteps[${stepIndex}].title`,
        englishStep.title,
        chineseStep.title,
      );
      requireChineseHilltopTranslation(
        `howToSteps[${stepIndex}].body`,
        englishStep.body,
        chineseStep.body,
      );
    }
    expect(chineseCopy.faqs).toHaveLength(englishCopy.faqs.length);
    for (const [faqIndex, englishFaq] of englishCopy.faqs.entries()) {
      const chineseFaq = chineseCopy.faqs[faqIndex];
      if (chineseFaq === undefined) {
        throw new Error(
          `Missing Simplified Chinese Hilltop Farm FAQ at index ${faqIndex}.`,
        );
      }
      requireChineseHilltopTranslation(
        `faqs[${faqIndex}].question`,
        englishFaq.question,
        chineseFaq.question,
      );
      requireChineseHilltopTranslation(
        `faqs[${faqIndex}].answer`,
        englishFaq.answer,
        chineseFaq.answer,
      );
    }
    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Hilltop Farm case at index ${caseIndex} for id ${englishCase.id}.`,
        );
      }
      requireChineseHilltopTranslation(
        `cases[${englishCase.id}].title`,
        englishCase.title,
        chineseCase.title,
      );
      requireChineseHilltopTranslation(
        `cases[${englishCase.id}].summary`,
        englishCase.summary,
        chineseCase.summary,
      );
      requireChineseHilltopTranslation(
        `cases[${englishCase.id}].imageAlt`,
        englishCase.imageAlt,
        chineseCase.imageAlt,
      );
    }
  });

  it("validates each public project through the planner catalog and opens its session", async () => {
    const englishCopy = getHilltopFarmPageCopy("en");
    const categoryLoader = createCatalogCategoryLoader(readPublicCatalogDataset);

    for (const [caseIndex, farmCase] of englishCopy.cases.entries()) {
      const sequenceNumber = String(caseIndex + 1).padStart(2, "0");
      const assetBasename = basename(farmCase.projectHref, extname(farmCase.projectHref));
      if (!assetBasename.includes(`-${sequenceNumber}-`) || !assetBasename.includes(farmCase.id)) {
        throw new Error(
          `Hilltop case ${farmCase.id} at index ${caseIndex} must use public basename with -${sequenceNumber}- and its id. Received: ${JSON.stringify(assetBasename)}.`,
        );
      }
      expect(farmCase.imageSrc).toBe(`${hilltopImageDirectory}${assetBasename}.webp`);
      expect(farmCase.imageOriginalSrc).toBe(`${hilltopImageDirectory}${assetBasename}.jpg`);
      expect(farmCase.projectHref).toBe(`${hilltopProjectDirectory}${assetBasename}.json`);
      expect(farmCase.imageWidth).toBe(expectedHilltopImageSize.width);
      expect(farmCase.imageHeight).toBe(expectedHilltopImageSize.height);

      const jpegPath = resolvePublicAsset(farmCase.imageOriginalSrc);
      const webpPath = resolvePublicAsset(farmCase.imageSrc);
      const avifPath = resolvePublicAsset(farmCase.imageSrc.replace(/\.webp$/u, ".avif"));
      const projectJsonPath = resolvePublicAsset(farmCase.projectHref);
      const jpegBytes = readFileSync(jpegPath);
      const webpBytes = readFileSync(webpPath);
      const avifBytes = readFileSync(avifPath);
      const serializedProjectDocument = readFileSync(projectJsonPath, "utf8");
      const parsedProjectDocument = parseReferenceProjectDocument(
        serializedProjectDocument,
      );
      const validatedProjectDocument = validateReferenceProjectDocument(
        JSON.parse(serializedProjectDocument) as unknown,
      );

      expect(jpegBytes.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]));
      expect(readJpegDimensions(jpegBytes, jpegPath)).toEqual(expectedHilltopImageSize);
      expect(webpBytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(webpBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(readWebpDimensions(webpBytes, webpPath)).toEqual(expectedHilltopImageSize);
      expect(avifBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(readAvifDimensions(avifBytes, avifPath)).toEqual(expectedHilltopImageSize);
      expect(parsedProjectDocument).toEqual(validatedProjectDocument);
      expect(validatedProjectDocument.projects).toHaveLength(1);

      const storedProject = validatedProjectDocument.projects[0];
      if (storedProject === undefined) {
        throw new Error(
          `Hilltop project ${farmCase.projectHref} is missing its only stored project after validation.`,
        );
      }
      expect(storedProject.project.maps).toHaveLength(1);
      const projectMap = storedProject.project.maps[0];
      if (projectMap === undefined) {
        throw new Error(
          `Hilltop project ${farmCase.projectHref} is missing its only map after validation.`,
        );
      }
      expect(projectMap.mapFile).toBe("Farm_Mining.tmx");
      expect(getPlannerMapIdForMapFile(projectMap.mapFile)).toBe("hilltop");
      expect(storedProject.project.activeMapId).toBe(projectMap.id);

      const activeSession = prepareReferenceProjectActiveSession(storedProject);
      if (activeSession === null) {
        throw new Error(
          `Hilltop project ${farmCase.projectHref} did not prepare an active session. Received activeMapId ${JSON.stringify(storedProject.project.activeMapId)}.`,
        );
      }
      expect(activeSession.mapId).toBe(projectMap.id);
      expect(activeSession.sourceMap.mapFile).toBe("Farm_Mining.tmx");
      expect(activeSession.placementSnapshot.buildings).toHaveLength(
        requireStateArray(projectMap.state, "buildings", farmCase.projectHref).length,
      );
      expect(activeSession.placementSnapshot.crops).toHaveLength(
        requireStateArray(projectMap.state, "crops", farmCase.projectHref).length,
      );
      expect(activeSession.placementSnapshot.items).toHaveLength(
        requireStateArray(projectMap.state, "items", farmCase.projectHref).length,
      );

      const requiredCategories = getRequiredPlacementCatalogCategories(
        activeSession.placementSnapshot,
      );
      if (requiredCategories.length === 0) {
        throw new Error(
          `Hilltop project ${farmCase.projectHref} prepared a session with no required catalog categories.`,
        );
      }
      const loadedCatalogs = await Promise.all(
        requiredCategories.map((category) => categoryLoader.loadCategory(category)),
      );
      const catalogAnalysis = analyzeRequiredPlacementCatalog(
        activeSession.placementSnapshot,
        loadedCatalogs.flatMap((catalog) => catalog.items),
      );
      if (catalogAnalysis.kind !== "ready") {
        throw new Error(
          `Hilltop project ${farmCase.projectHref} is not ready for its required planner catalog. Received: ${JSON.stringify(catalogAnalysis)}.`,
        );
      }
    }
  }, 60_000);

  it("rejects unsupported locales with the received value", () => {
    expect(() => getHilltopFarmPageCopy("fr" as never)).toThrow("fr");
    expect(() => getFeaturedHilltopFarmCase("fr" as never)).toThrow("fr");
  });
});
