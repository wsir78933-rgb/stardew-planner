import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createCatalogCategoryLoader } from "../../src/catalog/catalog-category-loader";
import type { CatalogJsonResponse } from "../../src/catalog/catalog-types";
import {
  fruitTreeLayoutCanonicalPath,
  getFruitTreeLayoutPageCopy,
} from "../../src/farm-layouts/fruit-tree-layout-content";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  analyzeRequiredPlacementCatalog,
  getRequiredPlacementCatalogCategories,
} from "../../src/planner/planner-workspace-required-catalog";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";
import { prepareReferenceProjectActiveSession } from "../../src/reference-runtime/use-reference-project-workspace";

const projectRoot = resolve(import.meta.dirname, "../..");
const publicImageDirectory = "/farm-layouts/fruit-tree/images";
const publicProjectDirectory = "/farm-layouts/fruit-tree/projects";
const expectedPreviewDimensions = { width: 1600, height: 1300 } as const;
const expectedOriginalDimensions = { width: 2560, height: 2080 } as const;
const expectedFruitTreeCaseIds = [
  "01-greenhouse-18-optimal-wiki",
  "02-outdoor-orchard-3x3-grid",
  "03-greenhouse-two-of-each",
  "04-outdoor-seasonal-fruit-rows",
  "05-mature-orchard-path-packed",
  "06-orchard-beehive-gaps",
  "07-farmhouse-adjacent-fruit-border",
] as const;
const expectedFruitTreeCountsByCase = {
  "01-greenhouse-18-optimal-wiki": {
    fruittree_628: 3,
    fruittree_629: 3,
    fruittree_630: 3,
    fruittree_631: 3,
    fruittree_632: 3,
    fruittree_633: 3,
  },
  "02-outdoor-orchard-3x3-grid": {
    fruittree_628: 11,
    fruittree_629: 11,
    fruittree_630: 11,
    fruittree_631: 11,
    fruittree_632: 10,
    fruittree_633: 10,
  },
  "03-greenhouse-two-of-each": {
    fruittree_628: 2,
    fruittree_629: 2,
    fruittree_630: 4,
    fruittree_631: 4,
    fruittree_632: 2,
    fruittree_633: 4,
  },
  "04-outdoor-seasonal-fruit-rows": {
    fruittree_628: 12,
    fruittree_629: 9,
    fruittree_630: 12,
    fruittree_631: 9,
    fruittree_632: 12,
    fruittree_633: 9,
  },
  "05-mature-orchard-path-packed": {
    fruittree_628: 10,
    fruittree_629: 10,
    fruittree_630: 9,
    fruittree_631: 9,
    fruittree_632: 9,
    fruittree_633: 9,
  },
  "06-orchard-beehive-gaps": {
    fruittree_628: 6,
    fruittree_629: 6,
    fruittree_630: 6,
    fruittree_631: 6,
    fruittree_632: 6,
    fruittree_633: 6,
  },
  "07-farmhouse-adjacent-fruit-border": {
    fruittree_628: 6,
    fruittree_629: 6,
    fruittree_630: 6,
    fruittree_631: 5,
    fruittree_632: 5,
    fruittree_633: 5,
  },
} as const;
const expectedFruitTreeCatalogNames = {
  fruittree_628: "Cherry Tree",
  fruittree_629: "Apricot Tree",
  fruittree_630: "Orange Tree",
  fruittree_631: "Peach Tree",
  fruittree_632: "Pomegranate Tree",
  fruittree_633: "Apple Tree",
} as const;
const jpegStartOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function resolveFruitTreePublicAsset(publicPath: string): string {
  const isFruitTreeImage = publicPath.startsWith(`${publicImageDirectory}/`);
  const isFruitTreeProject = publicPath.startsWith(`${publicProjectDirectory}/`);
  if (
    !publicPath.startsWith("/") ||
    publicPath.startsWith("//") ||
    publicPath.split("/").includes("..") ||
    (!isFruitTreeImage && !isFruitTreeProject)
  ) {
    throw new Error(
      `Fruit Tree Layout asset path must stay in its public image or project directory; received ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(projectRoot, "public", publicPath.slice(1));
}

function readFruitTreeJpegDimensions(
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

function readFruitTreeWebpDimensions(
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

function readFruitTreeAvifDimensions(
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

function getFruitTreeLayoutBodyText(
  pageCopy: ReturnType<typeof getFruitTreeLayoutPageCopy>,
): string {
  if (pageCopy.cases.length !== expectedFruitTreeCaseIds.length) {
    throw new Error(
      `Cannot measure Fruit Tree Layout keyword density without ${expectedFruitTreeCaseIds.length} cases; received ${pageCopy.cases.length}.`,
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
    ...pageCopy.howToSteps.flatMap((step) => [
      step.number,
      step.title,
      step.body,
    ]),
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

function readPublicFruitTreeCatalogDataset(
  datasetUrl: string,
): Promise<CatalogJsonResponse> {
  if (
    !datasetUrl.startsWith("/game-assets/1.6.15/data/") ||
    datasetUrl.split("/").includes("..")
  ) {
    throw new Error(
      `Catalog dataset URL must stay inside /game-assets/1.6.15/data/; received ${JSON.stringify(datasetUrl)}.`,
    );
  }

  const datasetPath = resolve(projectRoot, "public", datasetUrl.slice(1));
  const serializedDataset = readFileSync(datasetPath, "utf8");
  const parsedDataset = JSON.parse(serializedDataset) as unknown;
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(parsedDataset),
  });
}

describe("Fruit Tree Layout page content and source projects", () => {
  it("keeps all seven localized cases and uses the greenhouse case 01 as the cover", () => {
    const englishCopy = getFruitTreeLayoutPageCopy("en");
    const chineseCopy = getFruitTreeLayoutPageCopy("zh-CN");

    expect(fruitTreeLayoutCanonicalPath).toBe(
      "/stardew-valley-fruit-tree-layout",
    );
    expect(englishCopy.cases.map(({ id }) => id)).toEqual(
      expectedFruitTreeCaseIds,
    );
    expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
      expectedFruitTreeCaseIds,
    );
    expect(englishCopy.cases).toHaveLength(7);
    expect(chineseCopy.cases).toHaveLength(7);
    expect(englishCopy.cover.imageSrc).toBe(englishCopy.cases[0]?.imageSrc);
    expect(englishCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cases[0]?.imageOriginalSrc,
    );
    expect(chineseCopy.cover.imageSrc).toBe(englishCopy.cover.imageSrc);
    expect(chineseCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cover.imageOriginalSrc,
    );

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Chinese Fruit Tree Layout case is missing at index ${caseIndex}; received ${JSON.stringify(chineseCopy.cases.map(({ id }) => id))}.`,
        );
      }

      expect(chineseCase.id).toBe(englishCase.id);
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(expectedPreviewDimensions.width);
      expect(englishCase.imageHeight).toBe(expectedPreviewDimensions.height);
    }

    for (const greenhouseCaseIndex of [0, 2] as const) {
      const englishCase = englishCopy.cases[greenhouseCaseIndex];
      const chineseCase = chineseCopy.cases[greenhouseCaseIndex];
      if (englishCase === undefined || chineseCase === undefined) {
        throw new Error(
          `Greenhouse reference case is missing at index ${greenhouseCaseIndex}; received ${JSON.stringify(englishCopy.cases.map(({ id }) => id))}.`,
        );
      }

      const englishGreenhouseCaseCopy = [
        englishCase.title,
        englishCase.summary,
        englishCase.imageAlt,
      ].join(" ");
      expect(englishGreenhouseCaseCopy).toMatch(/greenhouse/iu);
      expect(englishGreenhouseCaseCopy).toMatch(/Standard Farm ground/u);
      expect(englishGreenhouseCaseCopy).toMatch(/mock-?up|reference/iu);
      expect(englishGreenhouseCaseCopy).toMatch(
        /not in the Greenhouse|on Standard Farm ground/iu,
      );
      expect(englishCase.summary).toMatch(/before planting/iu);
      expect(englishCase.summary).toMatch(/adjust/iu);
      expect(englishCase.summary).toMatch(/spacing/iu);
      expect(englishCase.summary).toMatch(/clear/iu);
      expect(englishCase.summary).toMatch(/paths/iu);
      expect(englishCase.summary).toMatch(/flooring/iu);
      expect(chineseCase.title).toMatch(/温室.*参考示意/u);
      expect(chineseCase.summary).toContain("标准农场空地");
      expect(chineseCase.summary).toMatch(/不是.*室内/u);
      expect(chineseCase.summary).toMatch(/种植前/u);
      expect(chineseCase.summary).toMatch(/调整/u);
      expect(chineseCase.summary).toMatch(/树距/u);
      expect(chineseCase.summary).toMatch(/清除/u);
      expect(chineseCase.summary).toMatch(/路径/u);
      expect(chineseCase.summary).toMatch(/地板/u);
    }
  });

  it("keeps the English exact phrase density between two and three percent", () => {
    const bodyText = getFruitTreeLayoutBodyText(
      getFruitTreeLayoutPageCopy("en"),
    );
    const bodyWordCount = [
      ...new Intl.Segmenter("en", { granularity: "word" }).segment(bodyText),
    ].filter((segment) => segment.isWordLike).length;
    const exactKeywordMentions = [
      ...bodyText.matchAll(/\bfruit tree layout stardew valley\b/giu),
    ].length;
    const densityPercent = (exactKeywordMentions / bodyWordCount) * 100;
    const densityReport = `${exactKeywordMentions} exact keyword mentions / ${bodyWordCount} body words = ${densityPercent}%`;

    expect(bodyWordCount, densityReport).toBeGreaterThan(0);
    expect(exactKeywordMentions, densityReport).toBeGreaterThan(0);
    expect(densityPercent, densityReport).toBeGreaterThanOrEqual(2);
    expect(densityPercent, densityReport).toBeLessThanOrEqual(3);
  });

  it("ships dimension-matched originals and previews for each case image", () => {
    const imageDirectoryPath = resolve(
      projectRoot,
      "public",
      publicImageDirectory.slice(1),
    );
    const actualImageFileNames = readdirSync(imageDirectoryPath).sort();
    const expectedImageFileNames = expectedFruitTreeCaseIds
      .flatMap((caseId) => [`${caseId}.avif`, `${caseId}.jpg`, `${caseId}.webp`])
      .sort();
    const englishCopy = getFruitTreeLayoutPageCopy("en");

    expect(actualImageFileNames).toEqual(expectedImageFileNames);
    expect(englishCopy.cover.imageWidth).toBe(expectedPreviewDimensions.width);
    expect(englishCopy.cover.imageHeight).toBe(expectedPreviewDimensions.height);

    for (const caseId of expectedFruitTreeCaseIds) {
      const layoutCase = englishCopy.cases.find(({ id }) => id === caseId);
      if (layoutCase === undefined) {
        throw new Error(
          `Missing Fruit Tree Layout image case ${caseId}; received ${JSON.stringify(englishCopy.cases.map(({ id }) => id))}.`,
        );
      }

      const originalPath = resolveFruitTreePublicAsset(
        layoutCase.imageOriginalSrc,
      );
      const webpPath = resolveFruitTreePublicAsset(layoutCase.imageSrc);
      const avifPath = resolveFruitTreePublicAsset(
        layoutCase.imageSrc.replace(/\.webp$/u, ".avif"),
      );

      expect(
        readFruitTreeJpegDimensions(readFileSync(originalPath), originalPath),
      ).toEqual(expectedOriginalDimensions);
      expect(
        readFruitTreeWebpDimensions(readFileSync(webpPath), webpPath),
      ).toEqual(expectedPreviewDimensions);
      expect(
        readFruitTreeAvifDimensions(readFileSync(avifPath), avifPath),
      ).toEqual(expectedPreviewDimensions);
    }
  });

  it("opens all seven Standard Farm projects and resolves every saved fruit tree in the real catalog", async () => {
    const englishCopy = getFruitTreeLayoutPageCopy("en");
    const projectDirectoryPath = resolve(
      projectRoot,
      "public",
      publicProjectDirectory.slice(1),
    );
    const actualProjectFileNames = readdirSync(projectDirectoryPath).sort();
    const expectedProjectFileNames = expectedFruitTreeCaseIds
      .map((caseId) => `${caseId}.json`)
      .sort();
    const catalogLoader = createCatalogCategoryLoader(
      readPublicFruitTreeCatalogDataset,
    );
    const placeablesCatalog = await catalogLoader.loadCategory("placeables");
    const fruitTreeCatalogItemsById = new Map(
      placeablesCatalog.items
        .filter(({ id }) => Object.hasOwn(expectedFruitTreeCatalogNames, id))
        .map((catalogItem) => [catalogItem.id, catalogItem] as const),
    );

    expect(actualProjectFileNames).toEqual(expectedProjectFileNames);
    for (const [itemId, expectedName] of Object.entries(
      expectedFruitTreeCatalogNames,
    )) {
      const catalogItem = fruitTreeCatalogItemsById.get(itemId);
      if (catalogItem === undefined) {
        throw new Error(
          `Fruit Tree Layout requires catalog item ${itemId}; received ${JSON.stringify([...fruitTreeCatalogItemsById.keys()])}.`,
        );
      }

      expect(catalogItem.name).toBe(expectedName);
      expect(catalogItem.renderingMetadata?.kind).toBe("fruit-tree");
    }

    for (const layoutCase of englishCopy.cases) {
      const projectPath = resolveFruitTreePublicAsset(layoutCase.projectHref);
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
          `Validated Fruit Tree Layout project ${layoutCase.projectHref} is missing its only project; received ${validatedProject.projects.length} projects.`,
        );
      }
      expect(storedProject.project.maps).toHaveLength(1);

      const projectMap = storedProject.project.maps[0];
      if (projectMap === undefined) {
        throw new Error(
          `Fruit Tree Layout project ${layoutCase.projectHref} is missing its only map; received ${storedProject.project.maps.length} maps.`,
        );
      }
      expect(projectMap.mapFile).toBe("Farm.tmx");
      expect(storedProject.project.activeMapId).toBe(projectMap.id);

      const activeSession = prepareReferenceProjectActiveSession(storedProject);
      if (activeSession === null) {
        throw new Error(
          `Fruit Tree Layout project ${layoutCase.projectHref} did not open an active session; received activeMapId ${JSON.stringify(storedProject.project.activeMapId)}.`,
        );
      }

      const expectedCounts =
        expectedFruitTreeCountsByCase[
          layoutCase.id as keyof typeof expectedFruitTreeCountsByCase
        ];
      if (expectedCounts === undefined) {
        throw new Error(
          `Missing fruit-tree count expectations for ${layoutCase.id}; received ${JSON.stringify(Object.keys(expectedFruitTreeCountsByCase))}.`,
        );
      }

      const fruitTreePlacements = activeSession.placementSnapshot.items.filter(
        ({ itemId }) => itemId.startsWith("fruittree_"),
      );
      const actualCounts = Object.fromEntries(
        fruitTreePlacements
          .reduce((counts, { itemId }) => {
            counts.set(itemId, (counts.get(itemId) ?? 0) + 1);
            return counts;
          }, new Map<string, number>())
          .entries(),
      );
      const sortedActualCounts = Object.fromEntries(
        Object.entries(actualCounts).sort(([leftItemId], [rightItemId]) =>
          leftItemId.localeCompare(rightItemId),
        ),
      );
      const requiredCategories = getRequiredPlacementCatalogCategories(
        activeSession.placementSnapshot,
      );
      const requiredCatalogs = await Promise.all(
        requiredCategories.map((category) => catalogLoader.loadCategory(category)),
      );
      const catalogAnalysis = analyzeRequiredPlacementCatalog(
        activeSession.placementSnapshot,
        requiredCatalogs.flatMap(({ items }) => items),
      );

      expect(
        Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
      ).toBe(fruitTreePlacements.length);
      expect(sortedActualCounts).toEqual(expectedCounts);
      expect(activeSession.sourceMap.mapFile).toBe("Farm.tmx");
      expect(catalogAnalysis, `Catalog analysis for ${layoutCase.id}`).toEqual({
        kind: "ready",
      });

      if (layoutCase.id === "02-outdoor-orchard-3x3-grid") {
        const overlappingFruitTreePairs = fruitTreePlacements.flatMap(
          (treePlacement, treeIndex) =>
            fruitTreePlacements
              .slice(treeIndex + 1)
              .filter(
                (otherTreePlacement) =>
                  Math.abs(treePlacement.x - otherTreePlacement.x) <= 2 &&
                  Math.abs(treePlacement.y - otherTreePlacement.y) <= 2,
              )
              .map((otherTreePlacement) => ({
                firstTree: [
                  treePlacement.itemId,
                  treePlacement.x,
                  treePlacement.y,
                ],
                secondTree: [
                  otherTreePlacement.itemId,
                  otherTreePlacement.x,
                  otherTreePlacement.y,
                ],
              })),
        );
        const blockedTreeGrowthSpaces = fruitTreePlacements.flatMap(
          (treePlacement) =>
            activeSession.placementSnapshot.items
              .filter(
                (otherPlacement) =>
                  !otherPlacement.itemId.startsWith("fruittree_") &&
                  Math.abs(treePlacement.x - otherPlacement.x) <= 1 &&
                  Math.abs(treePlacement.y - otherPlacement.y) <= 1,
              )
              .map((otherPlacement) => ({
                tree: [treePlacement.itemId, treePlacement.x, treePlacement.y],
                blocker: [
                  otherPlacement.itemId,
                  otherPlacement.x,
                  otherPlacement.y,
                ],
              })),
        );
        const cropsInTreeGrowthSpaces = fruitTreePlacements.flatMap(
          (treePlacement) =>
            activeSession.placementSnapshot.crops
              .filter(
                (cropPlacement) =>
                  Math.abs(treePlacement.x - cropPlacement.x) <= 1 &&
                  Math.abs(treePlacement.y - cropPlacement.y) <= 1,
              )
              .map((cropPlacement) => ({
                tree: [treePlacement.itemId, treePlacement.x, treePlacement.y],
                crop: [cropPlacement.x, cropPlacement.y],
              })),
        );

        expect(
          overlappingFruitTreePairs,
          `Case 02 fruit trees must keep their 3×3 growing areas apart; received ${JSON.stringify(overlappingFruitTreePairs)}.`,
        ).toEqual([]);
        expect(
          blockedTreeGrowthSpaces,
          `Case 02 must leave objects outside each fruit tree's 3×3 growing area; received ${JSON.stringify(blockedTreeGrowthSpaces)}.`,
        ).toEqual([]);
        expect(
          cropsInTreeGrowthSpaces,
          `Case 02 must leave crops outside each fruit tree's 3×3 growing area; received ${JSON.stringify(cropsInTreeGrowthSpaces)}.`,
        ).toEqual([]);
      }
    }
  });

  it("rejects an unsupported locale with the received value", () => {
    expect(() => getFruitTreeLayoutPageCopy("fr" as PublicLocale)).toThrow(
      'Unsupported Fruit Tree Layout page locale: "fr".',
    );
  });
});
