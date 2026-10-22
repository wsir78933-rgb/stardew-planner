import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createCatalogCategoryLoader } from "../../src/catalog/catalog-category-loader";
import type { CatalogJsonResponse } from "../../src/catalog/catalog-types";
import {
  getIridiumSprinklerLayoutPageCopy,
  iridiumSprinklerLayoutCanonicalPath,
} from "../../src/farm-layouts/iridium-sprinkler-layout-content";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { createSprinklerCoverageTiles } from "../../src/rendering/sprinkler-placement-rendering";
import {
  analyzeRequiredPlacementCatalog,
  getRequiredPlacementCatalogCategories,
} from "../../src/planner/planner-workspace-required-catalog";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";
import {
  prepareReferenceProjectActiveSession,
} from "../../src/reference-runtime/use-reference-project-workspace";

const projectRoot = resolve(import.meta.dirname, "../..");
const publicImageDirectory = "/farm-layouts/iridium-sprinkler/images";
const publicProjectDirectory = "/farm-layouts/iridium-sprinkler/projects";
const expectedPreviewDimensions = { width: 1600, height: 1300 } as const;
const expectedOriginalDimensions = { width: 2560, height: 2080 } as const;
const expectedIridiumSprinklerCaseIds = [
  "01-iridium-5x5-grid",
  "02-iridium-farm-patches-paths-scarecrows",
  "03-scarecrow-radius-iridium",
  "04-greenhouse-6-iridium-116",
  "05-greenhouse-4-iridium-pressure-118",
  "06-iridium-pressure-7x7-outdoor",
  "07-junimo-hut-iridium-5x5",
] as const;
const expectedIridiumSprinklerCases = {
  "01-iridium-5x5-grid": {
    sprinklerCount: 16,
    pressureNozzleCount: 0,
    cropCount: 384,
  },
  "02-iridium-farm-patches-paths-scarecrows": {
    sprinklerCount: 8,
    pressureNozzleCount: 0,
    cropCount: 192,
  },
  "03-scarecrow-radius-iridium": {
    sprinklerCount: 8,
    pressureNozzleCount: 0,
    cropCount: 147,
  },
  "04-greenhouse-6-iridium-116": {
    sprinklerCount: 6,
    pressureNozzleCount: 0,
    cropCount: 116,
  },
  "05-greenhouse-4-iridium-pressure-118": {
    sprinklerCount: 4,
    pressureNozzleCount: 4,
    cropCount: 118,
  },
  "06-iridium-pressure-7x7-outdoor": {
    sprinklerCount: 4,
    pressureNozzleCount: 4,
    cropCount: 192,
  },
  "07-junimo-hut-iridium-5x5": {
    sprinklerCount: 8,
    pressureNozzleCount: 0,
    cropCount: 192,
  },
} as const;
const jpegStartOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function resolveIridiumPublicAsset(publicPath: string): string {
  if (
    !publicPath.startsWith("/") ||
    publicPath.startsWith("//") ||
    publicPath.split("/").includes("..") ||
    (!publicPath.startsWith(`${publicImageDirectory}/`) &&
      !publicPath.startsWith(`${publicProjectDirectory}/`))
  ) {
    throw new Error(
      `Iridium layout asset path must stay in its public image or project directory; received ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(projectRoot, "public", publicPath.slice(1));
}

function readIridiumJpegDimensions(
  jpegBytes: Buffer,
  jpegPath: string,
): Readonly<{ width: number; height: number }> {
  if (!jpegBytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    throw new Error(
      `Expected a JPEG signature at ${jpegPath}; received ${jpegBytes.subarray(0, 3).toString("hex")}.`,
    );
  }

  let markerOffset = 2;
  while (markerOffset < jpegBytes.length) {
    if (jpegBytes[markerOffset] !== 0xff) {
      throw new Error(
        `Expected a JPEG marker at byte ${markerOffset} in ${jpegPath}; received ${String(jpegBytes[markerOffset])}.`,
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

function readIridiumWebpDimensions(
  webpBytes: Buffer,
  webpPath: string,
): Readonly<{ width: number; height: number }> {
  const chunkType = webpBytes.toString("ascii", 12, 16);
  if (
    webpBytes.toString("ascii", 0, 4) !== "RIFF" ||
    webpBytes.toString("ascii", 8, 12) !== "WEBP" ||
    chunkType !== "VP8 " ||
    webpBytes.subarray(23, 26).toString("hex") !== "9d012a"
  ) {
    throw new Error(
      `Expected a lossy VP8 WebP image at ${webpPath}; received ${JSON.stringify({ chunkType, signature: webpBytes.toString("ascii", 0, 12) })}.`,
    );
  }

  return {
    width: webpBytes.readUInt16LE(26) & 0x3fff,
    height: webpBytes.readUInt16LE(28) & 0x3fff,
  };
}

function readIridiumAvifDimensions(
  avifBytes: Buffer,
  avifPath: string,
): Readonly<{ width: number; height: number }> {
  if (!avifBytes.includes(Buffer.from("ftypavif"))) {
    throw new Error(
      `Expected an AVIF file brand at ${avifPath}; received ${avifBytes.subarray(0, 16).toString("hex")}.`,
    );
  }

  const imagePropertiesIndex = avifBytes.indexOf(Buffer.from("ispe"));
  if (imagePropertiesIndex < 0 || imagePropertiesIndex + 16 > avifBytes.length) {
    throw new Error(
      `AVIF dimensions are missing or truncated at ${avifPath}; received ispe index ${imagePropertiesIndex} and ${avifBytes.length} bytes.`,
    );
  }

  return {
    width: avifBytes.readUInt32BE(imagePropertiesIndex + 8),
    height: avifBytes.readUInt32BE(imagePropertiesIndex + 12),
  };
}

function getIridiumSprinklerBodyText(
  pageCopy: ReturnType<typeof getIridiumSprinklerLayoutPageCopy>,
): string {
  if (pageCopy.cases.length !== expectedIridiumSprinklerCaseIds.length) {
    throw new Error(
      `Cannot measure Iridium Sprinkler keyword density without ${expectedIridiumSprinklerCaseIds.length} cases; received ${pageCopy.cases.length}.`,
    );
  }

  return [
    pageCopy.title,
    pageCopy.intro,
    pageCopy.browseLabel,
    pageCopy.openPlannerLabel,
    pageCopy.categoryLabel,
    pageCopy.cover.caption,
    pageCopy.casesHeading,
    pageCopy.casesDescription,
    ...pageCopy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
      pageCopy.downloadProjectLabel,
    ]),
    pageCopy.whatIsHeading,
    ...pageCopy.whatIsParagraphs,
    pageCopy.howToEyebrow,
    pageCopy.howToHeading,
    ...pageCopy.howToSteps.flatMap((step) => [step.number, step.title, step.body]),
    pageCopy.openPlannerLabel,
    pageCopy.faqEyebrow,
    pageCopy.faqHeading,
    pageCopy.faqDescription,
    ...pageCopy.faqs.flatMap((faq) => [faq.question, faq.answer]),
    pageCopy.ctaHeading,
    pageCopy.ctaDescription,
    pageCopy.ctaButtonLabel,
  ]
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
}

function readPublicIridiumCatalogDataset(
  datasetUrl: string,
): Promise<CatalogJsonResponse> {
  if (!datasetUrl.startsWith("/game-assets/")) {
    throw new Error(
      `Catalog dataset URL must start with /game-assets/; received ${JSON.stringify(datasetUrl)}.`,
    );
  }
  if (datasetUrl.split("/").includes("..")) {
    throw new Error(
      `Catalog dataset URL must stay inside /game-assets/; received ${JSON.stringify(datasetUrl)}.`,
    );
  }

  const datasetPath = resolve(projectRoot, "public", datasetUrl.slice(1));
  const datasetText = readFileSync(datasetPath, "utf8");
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(JSON.parse(datasetText) as unknown),
  });
}

describe("Iridium Sprinkler Layout page content", () => {
  it("keeps seven localized layouts and uses case 01 as the cover", () => {
    const englishCopy = getIridiumSprinklerLayoutPageCopy("en");
    const chineseCopy = getIridiumSprinklerLayoutPageCopy("zh-CN");

    expect(iridiumSprinklerLayoutCanonicalPath).toBe(
      "/stardew-valley-iridium-sprinkler-layout",
    );
    expect(englishCopy.cases.map(({ id }) => id)).toEqual(
      expectedIridiumSprinklerCaseIds,
    );
    expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
      expectedIridiumSprinklerCaseIds,
    );
    expect(englishCopy.cover.imageSrc).toBe(englishCopy.cases[0]?.imageSrc);
    expect(englishCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cases[0]?.imageOriginalSrc,
    );
    expect(chineseCopy.cover.imageSrc).toBe(englishCopy.cover.imageSrc);
    expect(chineseCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cover.imageOriginalSrc,
    );
    expect(englishCopy.cases).toHaveLength(7);
    expect(chineseCopy.cases).toHaveLength(7);

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Chinese Iridium case at index ${caseIndex} for ${englishCase.id}; received ${JSON.stringify(chineseCopy.cases.map(({ id }) => id))}.`,
        );
      }

      expect(chineseCase.id).toBe(englishCase.id);
      expect(chineseCase.title).not.toBe(englishCase.title);
      expect(chineseCase.summary).not.toBe(englishCase.summary);
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(expectedPreviewDimensions.width);
      expect(englishCase.imageHeight).toBe(expectedPreviewDimensions.height);
    }

    for (const caseIndex of [3, 4] as const) {
      const englishCase = englishCopy.cases[caseIndex];
      const chineseCase = chineseCopy.cases[caseIndex];
      if (englishCase === undefined || chineseCase === undefined) {
        throw new Error(
          `Greenhouse reference cases 04 and 05 are missing at index ${caseIndex}; received ${JSON.stringify(englishCopy.cases.map(({ id }) => id))}.`,
        );
      }
      expect(englishCase.summary).toContain("Standard Farm ground");
      expect(englishCase.title).toContain("Greenhouse Reference");
      expect(englishCase.summary).toMatch(/not (?:inside|indoors)/u);
      expect(chineseCase.title).toContain("温室参考示意");
      expect(chineseCase.summary).toContain("标准农场空地");
      expect(chineseCase.summary).toMatch(/(?:不在|不是).*温室室内/u);
    }
  });

  it("keeps the English singular keyword density between two and three percent", () => {
    const bodyText = getIridiumSprinklerBodyText(
      getIridiumSprinklerLayoutPageCopy("en"),
    );
    const bodyWordCount = [
      ...new Intl.Segmenter("en", { granularity: "word" }).segment(bodyText),
    ].filter((segment) => segment.isWordLike).length;
    const exactSingularMentions = [
      ...bodyText.matchAll(/\biridium sprinkler layout\b/giu),
    ].length;
    const densityPercent = (exactSingularMentions / bodyWordCount) * 100;
    const densityReport = `${exactSingularMentions} exact singular mentions / ${bodyWordCount} body words = ${densityPercent}%`;

    expect(bodyWordCount, densityReport).toBeGreaterThan(0);
    expect(exactSingularMentions, densityReport).toBeGreaterThan(0);
    expect(densityPercent, densityReport).toBeGreaterThanOrEqual(2);
    expect(densityPercent, densityReport).toBeLessThanOrEqual(3);
  });

  it("ships dimension-matched originals and previews for all seven case images", () => {
    const imageFiles = readdirSync(
      resolve(projectRoot, "public", publicImageDirectory.slice(1)),
    ).sort();
    const expectedImageFiles = expectedIridiumSprinklerCaseIds
      .flatMap((caseId) => [`${caseId}.avif`, `${caseId}.jpg`, `${caseId}.webp`])
      .sort();

    expect(imageFiles).toEqual(expectedImageFiles);

    for (const caseId of expectedIridiumSprinklerCaseIds) {
      const layoutCase = getIridiumSprinklerLayoutPageCopy("en").cases.find(
        ({ id }) => id === caseId,
      );
      if (layoutCase === undefined) {
        throw new Error(
          `Missing Iridium image case ${caseId}; received ${JSON.stringify(getIridiumSprinklerLayoutPageCopy("en").cases.map(({ id }) => id))}.`,
        );
      }

      const originalPath = resolveIridiumPublicAsset(layoutCase.imageOriginalSrc);
      const webpPath = resolveIridiumPublicAsset(layoutCase.imageSrc);
      const avifPath = resolveIridiumPublicAsset(
        layoutCase.imageSrc.replace(/\.webp$/u, ".avif"),
      );
      const originalBytes = readFileSync(originalPath);
      const webpBytes = readFileSync(webpPath);
      const avifBytes = readFileSync(avifPath);

      expect(readIridiumJpegDimensions(originalBytes, originalPath)).toEqual(
        expectedOriginalDimensions,
      );
      expect(readIridiumWebpDimensions(webpBytes, webpPath)).toEqual(
        expectedPreviewDimensions,
      );
      expect(readIridiumAvifDimensions(avifBytes, avifPath)).toEqual(
        expectedPreviewDimensions,
      );
    }
  });

  it("validates, imports, and catalog-checks every project and its crop coverage", async () => {
    const englishCopy = getIridiumSprinklerLayoutPageCopy("en");
    const projectFiles = readdirSync(
      resolve(projectRoot, "public", publicProjectDirectory.slice(1)),
    ).sort();
    const expectedProjectFiles = [...expectedIridiumSprinklerCaseIds]
      .map((caseId) => `${caseId}.json`)
      .sort();
    const catalogLoader = createCatalogCategoryLoader(
      readPublicIridiumCatalogDataset,
    );

    expect(projectFiles).toEqual(expectedProjectFiles);

    for (const layoutCase of englishCopy.cases) {
      const projectPath = resolveIridiumPublicAsset(layoutCase.projectHref);
      const serializedProject = readFileSync(projectPath, "utf8");
      const parsedProject = parseReferenceProjectDocument(serializedProject);
      const validatedProject = validateReferenceProjectDocument(
        JSON.parse(serializedProject) as unknown,
      );
      expect(parsedProject).toEqual(validatedProject);
      expect(validatedProject.projects).toHaveLength(1);

      const storedProject = validatedProject.projects[0];
      if (storedProject === undefined) {
        throw new Error(
          `Validated project ${layoutCase.projectHref} is missing its only project; received ${validatedProject.projects.length} projects.`,
        );
      }
      expect(storedProject.project.maps).toHaveLength(1);

      const projectMap = storedProject.project.maps[0];
      if (projectMap === undefined) {
        throw new Error(
          `Validated project ${layoutCase.projectHref} is missing its only map; received ${storedProject.project.maps.length} maps.`,
        );
      }
      expect(projectMap.mapFile).toBe("Farm.tmx");
      expect(storedProject.project.activeMapId).toBe(projectMap.id);

      const activeSession = prepareReferenceProjectActiveSession(storedProject);
      if (activeSession === null) {
        throw new Error(
          `Project ${layoutCase.projectHref} did not open an active session; received activeMapId ${JSON.stringify(storedProject.project.activeMapId)}.`,
        );
      }

      const expectedIridiumCaseCounts =
        expectedIridiumSprinklerCases[
          layoutCase.id as keyof typeof expectedIridiumSprinklerCases
        ];
      if (expectedIridiumCaseCounts === undefined) {
        throw new Error(
          `Missing Iridium case expectations for ${layoutCase.id}; received ${JSON.stringify(Object.keys(expectedIridiumSprinklerCases))}.`,
        );
      }
      const iridiumSprinklers = activeSession.placementSnapshot.items.filter(
        ({ itemId }) => itemId === "object:645",
      );
      const pressureNozzles = iridiumSprinklers.filter(({ variant }) => variant === 1);

      expect(activeSession.mapId).toBe(projectMap.id);
      expect(activeSession.sourceMap.mapFile).toBe("Farm.tmx");
      expect(iridiumSprinklers).toHaveLength(
        expectedIridiumCaseCounts.sprinklerCount,
      );
      expect(pressureNozzles).toHaveLength(
        expectedIridiumCaseCounts.pressureNozzleCount,
      );
      expect(activeSession.placementSnapshot.crops).toHaveLength(
        expectedIridiumCaseCounts.cropCount,
      );

      const coveredCropCoordinates = new Set(
        iridiumSprinklers.flatMap((sprinkler) => {
          const coverageTiles = createSprinklerCoverageTiles(sprinkler);
          if (coverageTiles === null) {
            throw new Error(
              `Iridium sprinkler ${JSON.stringify(sprinkler.instanceId)} in ${layoutCase.id} produced no coverage; received itemId ${JSON.stringify(sprinkler.itemId)}.`,
            );
          }
          const expectedCoverageCount = sprinkler.variant === 1 ? 48 : 24;
          expect(coverageTiles).toHaveLength(expectedCoverageCount);
          return coverageTiles.map(({ x, y }) => `${x},${y}`);
        }),
      );
      const uncoveredCrops = activeSession.placementSnapshot.crops.filter(
        ({ x, y }) => !coveredCropCoordinates.has(`${x},${y}`),
      );
      expect(
        uncoveredCrops,
        `Every crop in ${layoutCase.id} must be inside at least one saved Iridium Sprinkler coverage area; received ${uncoveredCrops.length} uncovered crops.`,
      ).toEqual([]);

      const requiredCategories = getRequiredPlacementCatalogCategories(
        activeSession.placementSnapshot,
      );
      if (requiredCategories.length === 0) {
        throw new Error(
          `Project ${layoutCase.id} has no required catalog categories; received ${JSON.stringify(requiredCategories)}.`,
        );
      }
      const loadedCatalogs = await Promise.all(
        requiredCategories.map((category) => catalogLoader.loadCategory(category)),
      );
      const catalogAnalysis = analyzeRequiredPlacementCatalog(
        activeSession.placementSnapshot,
        loadedCatalogs.flatMap((catalog) => catalog.items),
      );
      expect(catalogAnalysis, `Catalog analysis for ${layoutCase.id}`).toEqual({
        kind: "ready",
      });
    }
  });

  it("rejects an unsupported locale with the received value", () => {
    expect(() => getIridiumSprinklerLayoutPageCopy("fr" as PublicLocale)).toThrow(
      "Unsupported Iridium Sprinkler Layout page locale: \"fr\".",
    );
  });
});
