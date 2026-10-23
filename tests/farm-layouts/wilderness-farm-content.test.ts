import { readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createCatalogCategoryLoader } from "../../src/catalog/catalog-category-loader";
import type { CatalogJsonResponse } from "../../src/catalog/catalog-types";
import {
  getFeaturedWildernessFarmCase,
  getWildernessFarmPageCopy,
  wildernessFarmCanonicalPath,
} from "../../src/farm-layouts/wilderness-farm-content";
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

const repositoryRoot = resolve(import.meta.dirname, "../..");
const wildernessImagePublicDirectory = "/farm-layouts/wilderness/images/";
const wildernessProjectPublicDirectory = "/farm-layouts/wilderness/projects/";
const expectedPreviewDimensions = { width: 1600, height: 1300 } as const;
const expectedOriginalDimensions = { width: 2560, height: 2080 } as const;
const expectedWildernessCaseIds = [
  "forest-integrated-village",
  "forest-shed-courts",
  "summer-mushroom-garden",
  "circular-crop-ring",
  "stone-grid-fish-ponds",
  "fenced-shed-village",
  "autumn-symmetry",
] as const;
const expectedSourceStems = [
  "stardew-valley-wilderness-farm-layout-01-y7-forest-integrated-village",
  "stardew-valley-wilderness-farm-layout-02-y4-lush-forest-shed-battery",
  "stardew-valley-wilderness-farm-layout-03-y8-summer-mushroom-enchanted",
  "stardew-valley-wilderness-farm-layout-04-circular-crop-ring-planner",
  "stardew-valley-wilderness-farm-layout-05-y3-summer-stone-grid-fishponds",
  "stardew-valley-wilderness-farm-layout-06-y3-spring-fenced-shed-village",
  "stardew-valley-wilderness-farm-layout-07-y4-fall-perfection-symmetry",
] as const;
const jpegStartOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function resolveWildernessPublicAsset(publicPath: string): string {
  const isWildernessImage = publicPath.startsWith(wildernessImagePublicDirectory);
  const isWildernessProject = publicPath.startsWith(wildernessProjectPublicDirectory);
  if (
    !publicPath.startsWith("/")
    || publicPath.startsWith("//")
    || publicPath.split("/").includes("..")
    || (!isWildernessImage && !isWildernessProject)
  ) {
    throw new Error(
      `Wilderness Farm asset path must stay in its public image or project directory; received ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(repositoryRoot, "public", publicPath.slice(1));
}

function readPublicCatalogDataset(datasetUrl: string): Promise<CatalogJsonResponse> {
  if (!datasetUrl.startsWith("/game-assets/") || datasetUrl.split("/").includes("..")) {
    throw new Error(
      `Wilderness Farm catalog URL must stay inside /game-assets/; received ${JSON.stringify(datasetUrl)}.`,
    );
  }

  const datasetText = readFileSync(
    resolve(repositoryRoot, "public", datasetUrl.slice(1)),
    "utf8",
  );
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(JSON.parse(datasetText) as unknown),
  });
}

function requireChineseTranslation(
  fieldName: string,
  englishText: string,
  chineseText: string,
): void {
  if (chineseText.trim() === "") {
    throw new Error(`Chinese Wilderness Farm field ${fieldName} is empty.`);
  }
  if (chineseText === englishText) {
    throw new Error(
      `Chinese Wilderness Farm field ${fieldName} still matches English value ${JSON.stringify(englishText)}.`,
    );
  }
  if (!/\p{Script=Han}/u.test(chineseText)) {
    throw new Error(
      `Chinese Wilderness Farm field ${fieldName} has no Han characters; received ${JSON.stringify(chineseText)}.`,
    );
  }
}

function requireProjectStateArray(
  projectState: Record<string, ReferenceJsonValue>,
  stateKey: string,
  projectHref: string,
): readonly unknown[] {
  const stateValue = projectState[stateKey];
  if (!Array.isArray(stateValue)) {
    throw new Error(
      `Wilderness Farm project ${projectHref} state.${stateKey} must be an array; received ${JSON.stringify(stateValue)}.`,
    );
  }
  return stateValue;
}

function readJpegDimensions(
  jpegBytes: Buffer,
  jpegPath: string,
): Readonly<{ width: number; height: number }> {
  if (jpegBytes.subarray(0, 3).toString("hex") !== "ffd8ff") {
    throw new Error(
      `Expected a JPEG signature at ${jpegPath}; received ${jpegBytes.subarray(0, 3).toString("hex")}.`,
    );
  }

  let markerOffset = 2;
  while (markerOffset < jpegBytes.length) {
    if (jpegBytes[markerOffset] !== 0xff) {
      throw new Error(
        `Expected a JPEG marker at ${jpegPath} byte ${markerOffset}; received ${String(jpegBytes[markerOffset])}.`,
      );
    }
    while (jpegBytes[markerOffset] === 0xff) markerOffset += 1;
    const marker = jpegBytes[markerOffset];
    if (marker === undefined || marker === 0xda || marker === 0xd9) break;
    const segmentLength = jpegBytes.readUInt16BE(markerOffset + 1);
    if (jpegStartOfFrameMarkers.has(marker)) {
      return {
        height: jpegBytes.readUInt16BE(markerOffset + 4),
        width: jpegBytes.readUInt16BE(markerOffset + 6),
      };
    }
    markerOffset += segmentLength + 1;
  }

  throw new Error(
    `JPEG dimensions are missing before image data in ${jpegPath}; received ${jpegBytes.length} bytes.`,
  );
}

function readWebpDimensions(
  webpBytes: Buffer,
  webpPath: string,
): Readonly<{ width: number; height: number }> {
  const chunkType = webpBytes.toString("ascii", 12, 16);
  if (
    webpBytes.toString("ascii", 0, 4) !== "RIFF"
    || webpBytes.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error(
      `Expected RIFF/WEBP signatures at ${webpPath}; received ${webpBytes.toString("ascii", 0, 12)}.`,
    );
  }

  if (chunkType === "VP8 ") {
    const frameMarker = webpBytes.subarray(23, 26).toString("hex");
    if (frameMarker !== "9d012a") {
      throw new Error(
        `Expected a VP8 frame marker at ${webpPath}; received ${frameMarker}.`,
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
        `Expected a VP8L signature at ${webpPath}; received ${String(webpBytes[20])}.`,
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
    `Unsupported WebP image chunk at ${webpPath}; received ${JSON.stringify(chunkType)}.`,
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
  const imagePropertiesOffset = avifBytes.indexOf(Buffer.from("ispe"));
  if (imagePropertiesOffset < 0 || imagePropertiesOffset + 16 > avifBytes.length) {
    throw new Error(
      `AVIF dimensions are missing or truncated at ${avifPath}; received ispe offset ${imagePropertiesOffset} and ${avifBytes.length} bytes.`,
    );
  }

  return {
    width: avifBytes.readUInt32BE(imagePropertiesOffset + 8),
    height: avifBytes.readUInt32BE(imagePropertiesOffset + 12),
  };
}

describe("Wilderness Farm page content and project assets", () => {
  it("keeps seven bilingual layouts in source order and features case 01", () => {
    const englishCopy = getWildernessFarmPageCopy("en");
    const chineseCopy = getWildernessFarmPageCopy("zh-CN");
    const englishFeaturedCase = getFeaturedWildernessFarmCase("en");
    const chineseFeaturedCase = getFeaturedWildernessFarmCase("zh-CN");

    expect(wildernessFarmCanonicalPath).toBe(
      "/stardew-valley-wilderness-farm-layout",
    );
    expect(englishCopy.cases.map(({ id }) => id)).toEqual(expectedWildernessCaseIds);
    expect(chineseCopy.cases.map(({ id }) => id)).toEqual(expectedWildernessCaseIds);
    expect(englishCopy.cases).toHaveLength(7);
    expect(chineseCopy.cases).toHaveLength(7);
    expect(englishFeaturedCase).toMatchObject(englishCopy.cases[0]!);
    expect(chineseFeaturedCase).toMatchObject(chineseCopy.cases[0]!);
    expect(englishFeaturedCase.id).toBe("forest-integrated-village");
    expect(chineseFeaturedCase.id).toBe("forest-integrated-village");
    expect(chineseCopy.title).not.toBe(englishCopy.title);
    expect(chineseCopy.description).not.toBe(englishCopy.description);

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      const expectedStem = expectedSourceStems[caseIndex];
      if (chineseCase === undefined || expectedStem === undefined) {
        throw new Error(
          `Wilderness Farm case at index ${caseIndex} is missing its translation or source stem; received ${JSON.stringify({ chineseCase, expectedStem })}.`,
        );
      }

      expect(englishCase.imageSrc).toBe(`${wildernessImagePublicDirectory}${expectedStem}.webp`);
      expect(englishCase.imageOriginalSrc).toBe(`${wildernessImagePublicDirectory}${expectedStem}.jpg`);
      expect(englishCase.projectHref).toBe(`${wildernessProjectPublicDirectory}${expectedStem}.json`);
      expect(chineseCase.id).toBe(englishCase.id);
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(chineseCase.title).not.toBe(englishCase.title);
      expect(chineseCase.summary).not.toBe(englishCase.summary);
      expect(englishCase.imageWidth).toBe(expectedPreviewDimensions.width);
      expect(englishCase.imageHeight).toBe(expectedPreviewDimensions.height);
    }

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(localizedCopy.howToSteps).toHaveLength(3);
      expect(localizedCopy.howToSteps.map(({ number }) => number)).toEqual([
        "01",
        "02",
        "03",
      ]);
      expect(localizedCopy.faqs.length).toBeGreaterThan(0);
      expect(localizedCopy.cases.every(({ title, summary, imageAlt }) =>
        title.trim() !== "" && summary.trim() !== "" && imageAlt.trim() !== "",
      )).toBe(true);
    }

  });

  it("keeps the Chinese visible copy translated", () => {
    const englishCopy = getWildernessFarmPageCopy("en");
    const chineseCopy = getWildernessFarmPageCopy("zh-CN");
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
      requireChineseTranslation(fieldName, englishText, chineseText);
    }
    for (const [paragraphIndex, englishParagraph] of englishCopy.whatIsParagraphs.entries()) {
      const chineseParagraph = chineseCopy.whatIsParagraphs[paragraphIndex];
      if (chineseParagraph === undefined) {
        throw new Error(
          `Wilderness Farm Chinese what-is paragraph ${paragraphIndex} is missing; received ${chineseCopy.whatIsParagraphs.length} paragraphs.`,
        );
      }
      requireChineseTranslation(
        `whatIsParagraphs[${paragraphIndex}]`,
        englishParagraph,
        chineseParagraph,
      );
    }
    for (const [stepIndex, englishStep] of englishCopy.howToSteps.entries()) {
      const chineseStep = chineseCopy.howToSteps[stepIndex];
      if (chineseStep === undefined) {
        throw new Error(
          `Wilderness Farm Chinese how-to step ${stepIndex} is missing; received ${chineseCopy.howToSteps.length} steps.`,
        );
      }
      requireChineseTranslation(`howToSteps[${stepIndex}].title`, englishStep.title, chineseStep.title);
      requireChineseTranslation(`howToSteps[${stepIndex}].body`, englishStep.body, chineseStep.body);
    }
    expect(chineseCopy.faqs).toHaveLength(englishCopy.faqs.length);
    for (const [faqIndex, englishFaq] of englishCopy.faqs.entries()) {
      const chineseFaq = chineseCopy.faqs[faqIndex];
      if (chineseFaq === undefined) {
        throw new Error(
          `Wilderness Farm Chinese FAQ ${faqIndex} is missing; received ${chineseCopy.faqs.length} FAQs.`,
        );
      }
      requireChineseTranslation(`faqs[${faqIndex}].question`, englishFaq.question, chineseFaq.question);
      requireChineseTranslation(`faqs[${faqIndex}].answer`, englishFaq.answer, chineseFaq.answer);
    }
    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Wilderness Farm Chinese case ${englishCase.id} at index ${caseIndex} is missing; received ${chineseCopy.cases.length} cases.`,
        );
      }
      requireChineseTranslation(`cases[${englishCase.id}].title`, englishCase.title, chineseCase.title);
      requireChineseTranslation(`cases[${englishCase.id}].summary`, englishCase.summary, chineseCase.summary);
      requireChineseTranslation(`cases[${englishCase.id}].imageAlt`, englishCase.imageAlt, chineseCase.imageAlt);
    }
  });

  it("rejects unsupported locales with the received value", () => {
    expect(() => getWildernessFarmPageCopy("fr" as never)).toThrow("fr");
    expect(() => getFeaturedWildernessFarmCase("fr" as never)).toThrow("fr");
  });

  it("keeps source-named images at equal preview dimensions and imports all seven projects", async () => {
    const englishCopy = getWildernessFarmPageCopy("en");
    const publicImageDirectory = resolve(repositoryRoot, "public", wildernessImagePublicDirectory.slice(1));
    const publicProjectDirectory = resolve(repositoryRoot, "public", wildernessProjectPublicDirectory.slice(1));
    const expectedImageFiles = expectedSourceStems.flatMap((sourceStem) => [
      `${sourceStem}.avif`,
      `${sourceStem}.jpg`,
      `${sourceStem}.webp`,
    ]).sort();
    const expectedProjectFiles = expectedSourceStems.map((sourceStem) => `${sourceStem}.json`).sort();
    const actualImageFiles = readdirSync(publicImageDirectory).sort();
    const actualProjectFiles = readdirSync(publicProjectDirectory).sort();
    const catalogLoader = createCatalogCategoryLoader(readPublicCatalogDataset);
    const importedProjectIds: string[] = [];
    const importedMapIds: string[] = [];

    expect(actualImageFiles).toEqual(expectedImageFiles);
    expect(actualProjectFiles).toEqual(expectedProjectFiles);

    for (const [caseIndex, wildernessCase] of englishCopy.cases.entries()) {
      const sourceStem = expectedSourceStems[caseIndex];
      if (sourceStem === undefined) {
        throw new Error(
          `Wilderness Farm source stem is missing at case index ${caseIndex}; received ${JSON.stringify(expectedSourceStems)}.`,
        );
      }
      const originalImagePath = resolveWildernessPublicAsset(wildernessCase.imageOriginalSrc);
      const previewImagePath = resolveWildernessPublicAsset(wildernessCase.imageSrc);
      const avifImagePath = resolveWildernessPublicAsset(wildernessCase.imageSrc.replace(/\.webp$/u, ".avif"));
      const projectJsonPath = resolveWildernessPublicAsset(wildernessCase.projectHref);
      const originalImageBytes = readFileSync(originalImagePath);
      const previewImageBytes = readFileSync(previewImagePath);
      const avifImageBytes = readFileSync(avifImagePath);
      const serializedProjectDocument = readFileSync(projectJsonPath, "utf8");
      const parsedProjectDocument = parseReferenceProjectDocument(serializedProjectDocument);
      const validatedProjectDocument = validateReferenceProjectDocument(
        JSON.parse(serializedProjectDocument) as unknown,
      );

      expect(basename(originalImagePath)).toBe(`${sourceStem}.jpg`);
      expect(readJpegDimensions(originalImageBytes, originalImagePath)).toEqual(expectedOriginalDimensions);
      expect(readWebpDimensions(previewImageBytes, previewImagePath)).toEqual(expectedPreviewDimensions);
      expect(readAvifDimensions(avifImageBytes, avifImagePath)).toEqual(expectedPreviewDimensions);
      expect(parsedProjectDocument).toEqual(validatedProjectDocument);
      expect(validatedProjectDocument.projects).toHaveLength(1);

      const storedProject = validatedProjectDocument.projects[0];
      if (storedProject === undefined) {
        throw new Error(
          `Wilderness Farm project ${wildernessCase.projectHref} is missing its only stored project after validation; received ${validatedProjectDocument.projects.length} projects.`,
        );
      }
      importedProjectIds.push(storedProject.id);
      expect(storedProject.project.maps).toHaveLength(1);
      const projectMap = storedProject.project.maps[0];
      if (projectMap === undefined) {
        throw new Error(
          `Wilderness Farm project ${wildernessCase.projectHref} is missing its only map; received ${storedProject.project.maps.length} maps.`,
        );
      }
      importedMapIds.push(projectMap.id);
      expect(projectMap.mapFile).toBe("Farm_Combat.tmx");
      expect(getPlannerMapIdForMapFile(projectMap.mapFile)).toBe("wilderness");
      expect(storedProject.project.activeMapId).toBe(projectMap.id);

      const activeSession = prepareReferenceProjectActiveSession(storedProject);
      if (activeSession === null) {
        throw new Error(
          `Wilderness Farm project ${wildernessCase.projectHref} did not prepare an active session; received activeMapId ${JSON.stringify(storedProject.project.activeMapId)}.`,
        );
      }
      expect(activeSession.mapId).toBe(projectMap.id);
      expect(activeSession.sourceMap.mapFile).toBe("Farm_Combat.tmx");
      expect(activeSession.placementSnapshot.buildings).toHaveLength(
        requireProjectStateArray(projectMap.state, "buildings", wildernessCase.projectHref).length,
      );
      expect(activeSession.placementSnapshot.crops).toHaveLength(
        requireProjectStateArray(projectMap.state, "crops", wildernessCase.projectHref).length,
      );
      expect(activeSession.placementSnapshot.items).toHaveLength(
        requireProjectStateArray(projectMap.state, "items", wildernessCase.projectHref).length,
      );

      const requiredCategories = getRequiredPlacementCatalogCategories(activeSession.placementSnapshot);
      if (requiredCategories.length === 0) {
        throw new Error(
          `Wilderness Farm project ${wildernessCase.projectHref} requires no planner catalog categories; received ${JSON.stringify(requiredCategories)}.`,
        );
      }
      const loadedCatalogs = await Promise.all(
        requiredCategories.map((category) => catalogLoader.loadCategory(category)),
      );
      const catalogAnalysis = analyzeRequiredPlacementCatalog(
        activeSession.placementSnapshot,
        loadedCatalogs.flatMap((catalog) => catalog.items),
      );
      expect(catalogAnalysis, `Catalog compatibility for ${wildernessCase.projectHref}`).toEqual({
        kind: "ready",
      });
    }

    expect(importedProjectIds).toHaveLength(7);
    expect(new Set(importedProjectIds).size).toBe(7);
    expect(importedMapIds).toHaveLength(7);
    expect(new Set(importedMapIds).size).toBe(7);
    expect(readFileSync(resolve(repositoryRoot, "public/game-assets/1.6.15/maps/Farm_Combat.tmx")).length).toBeGreaterThan(0);
    expect(readFileSync(resolve(repositoryRoot, "public/game-assets/1.6.15/maps/previews/Farm_Combat.png")).length).toBeGreaterThan(0);
  });
});
