import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import {
  getQualitySprinklerLayoutPageCopy,
  qualitySprinklerLayoutCanonicalPath,
  type QualitySprinklerLayoutPageCopy,
} from "../../src/farm-layouts/quality-sprinkler-layout-content";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
  type ReferenceLocalProjectDocument,
  type ReferenceProject,
  type ReferenceProjectMap,
  type ReferenceStoredProject,
} from "../../src/reference-runtime/local-project-api";
import { createSprinklerCoverageTiles } from "../../src/rendering/sprinkler-placement-rendering";

const qualitySprinklerLayoutCaseStems = [
  "02-quality-clean-patchwork",
  "03-scarecrow-radius-quality",
  "04-quality-simple-grid-edge-scarecrows",
  "05-quality-lines-scarecrow-gaps",
  "06-quality-pressure-5x5-outdoor",
  "07-greenhouse-16-quality-108",
] as const;

const qualitySprinklerLayoutCase06ProjectPath = join(
  process.cwd(),
  "public",
  "farm-layouts",
  "quality-sprinkler",
  "projects",
  "06-quality-pressure-5x5-outdoor.json",
);

type QualitySprinklerGridCoordinate = Readonly<{ x: number; y: number }>;

function getVisibleQualitySprinklerLayoutText(
  copy: QualitySprinklerLayoutPageCopy,
): string {
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
    ...copy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
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

function countQualitySprinklerLayoutKeywordMentions(
  visibleText: string,
  locale: PublicLocale,
): number {
  if (locale === "en") {
    return [...visibleText.matchAll(/\bquality sprinkler layout\b/giu)].length;
  }

  if (locale === "zh-CN") {
    return visibleText.split("优质洒水器布局").length - 1;
  }

  throw new Error(
    `Cannot count quality sprinkler layout keywords for locale ${JSON.stringify(locale)}.`,
  );
}

function countVisibleQualitySprinklerLayoutWords(
  visibleText: string,
  locale: PublicLocale,
): number {
  return [
    ...new Intl.Segmenter(locale, { granularity: "word" }).segment(visibleText),
  ].filter((segment) => segment.isWordLike).length;
}

function expectQualitySprinklerLayoutKeywordDensity(
  copy: QualitySprinklerLayoutPageCopy,
  locale: PublicLocale,
): void {
  const visibleText = getVisibleQualitySprinklerLayoutText(copy);
  const keywordMentions = countQualitySprinklerLayoutKeywordMentions(
    visibleText,
    locale,
  );
  const visibleWordCount = countVisibleQualitySprinklerLayoutWords(
    visibleText,
    locale,
  );
  const densityPercent = (keywordMentions / visibleWordCount) * 100;

  if (densityPercent < 2 || densityPercent > 3) {
    throw new Error(
      `Quality Sprinkler Layout keyword density for ${locale} must be 2% to 3%; received ${keywordMentions}/${visibleWordCount} = ${densityPercent.toFixed(4)}%.`,
    );
  }
}

function readQualitySprinklerCase06ProjectDocument():
  ReferenceLocalProjectDocument {
  if (!existsSync(qualitySprinklerLayoutCase06ProjectPath)) {
    throw new Error(
      `Missing Quality Sprinkler case 06 project at ${qualitySprinklerLayoutCase06ProjectPath}.`,
    );
  }

  const serializedProject = readFileSync(
    qualitySprinklerLayoutCase06ProjectPath,
    "utf8",
  );
  const parsedProjectDocument = parseReferenceProjectDocument(serializedProject);
  const validatedProjectDocument = validateReferenceProjectDocument(
    JSON.parse(serializedProject) as unknown,
  );
  expect(parsedProjectDocument).toEqual(validatedProjectDocument);
  return validatedProjectDocument;
}

function requireSingleQualitySprinklerCase06Project(
  projectDocument: ReferenceLocalProjectDocument,
): ReferenceStoredProject {
  if (projectDocument.projects.length !== 1) {
    throw new Error(
      `Quality Sprinkler case 06 project must contain exactly 1 project; received ${projectDocument.projects.length}.`,
    );
  }

  const storedProject = projectDocument.projects[0];
  if (storedProject === undefined) {
    throw new Error(
      `Quality Sprinkler case 06 project is missing project 0 at ${qualitySprinklerLayoutCase06ProjectPath}.`,
    );
  }

  return storedProject;
}

function requireSingleQualitySprinklerCase06Map(
  project: ReferenceProject,
): ReferenceProjectMap {
  if (project.maps.length !== 1) {
    throw new Error(
      `Quality Sprinkler case 06 project must contain exactly 1 map; received ${project.maps.length}.`,
    );
  }

  const projectMap = project.maps[0];
  if (projectMap === undefined) {
    throw new Error(
      `Quality Sprinkler case 06 project is missing map 0 at ${qualitySprinklerLayoutCase06ProjectPath}.`,
    );
  }

  return projectMap;
}

function readQualitySprinklerLayoutCase06Project(): Readonly<{
  project: ReferenceProject;
  projectMap: ReferenceProjectMap;
}> {
  const projectDocument = readQualitySprinklerCase06ProjectDocument();
  const storedProject = requireSingleQualitySprinklerCase06Project(
    projectDocument,
  );
  const projectMap = requireSingleQualitySprinklerCase06Map(
    storedProject.project,
  );

  return { project: storedProject.project, projectMap };
}

function readQualitySprinklerLayoutCase06Records(
  recordArrayValue: ReferenceJsonValue | undefined,
  recordArrayPath: string,
): readonly Record<string, ReferenceJsonValue>[] {
  if (!Array.isArray(recordArrayValue)) {
    throw new Error(
      `Quality Sprinkler case 06 ${recordArrayPath} must be an array; received ${JSON.stringify(recordArrayValue)}.`,
    );
  }

  return recordArrayValue.map((recordValue, recordIndex) => {
    if (
      recordValue === null
      || typeof recordValue !== "object"
      || Array.isArray(recordValue)
    ) {
      throw new Error(
        `Quality Sprinkler case 06 ${recordArrayPath}[${recordIndex}] must be an object; received ${JSON.stringify(recordValue)}.`,
      );
    }

    return recordValue;
  });
}

function readQualitySprinklerLayoutCase06String(
  record: Record<string, ReferenceJsonValue>,
  fieldName: string,
  recordPath: string,
): string {
  const fieldValue = record[fieldName];
  if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) {
    throw new Error(
      `Quality Sprinkler case 06 ${recordPath}.${fieldName} must be a non-empty string; received ${JSON.stringify(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function readQualitySprinklerLayoutCase06Number(
  record: Record<string, ReferenceJsonValue>,
  fieldName: string,
  recordPath: string,
): number {
  const fieldValue = record[fieldName];
  if (typeof fieldValue !== "number" || !Number.isInteger(fieldValue)) {
    throw new Error(
      `Quality Sprinkler case 06 ${recordPath}.${fieldName} must be an integer; received ${JSON.stringify(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function createQualitySprinklerCoveragePlacementItem(
  sprinklerRecord: Record<string, ReferenceJsonValue>,
  sprinklerIndex: number,
): PlacementItem {
  const sprinklerPath = `state.items quality sprinkler ${sprinklerIndex}`;

  return {
    instanceId: sprinklerIndex + 1,
    itemId: readQualitySprinklerLayoutCase06String(
      sprinklerRecord,
      "itemId",
      sprinklerPath,
    ),
    x: readQualitySprinklerLayoutCase06Number(
      sprinklerRecord,
      "x",
      sprinklerPath,
    ),
    y: readQualitySprinklerLayoutCase06Number(
      sprinklerRecord,
      "y",
      sprinklerPath,
    ),
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: readQualitySprinklerLayoutCase06Number(
      sprinklerRecord,
      "variant",
      sprinklerPath,
    ),
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function readQualitySprinklerLayoutCase06CropCoordinates(
  cropRecords: readonly Record<string, ReferenceJsonValue>[],
): readonly QualitySprinklerGridCoordinate[] {
  return cropRecords.map((cropRecord, cropIndex) => {
    const cropPath = `state.crops[${cropIndex}]`;
    const cropId = readQualitySprinklerLayoutCase06String(
      cropRecord,
      "cropId",
      cropPath,
    );
    if (cropId !== "crop:486") {
      throw new Error(
        `Quality Sprinkler case 06 ${cropPath}.cropId must be crop:486; received ${JSON.stringify(cropId)}.`,
      );
    }

    return {
      x: readQualitySprinklerLayoutCase06Number(cropRecord, "x", cropPath),
      y: readQualitySprinklerLayoutCase06Number(cropRecord, "y", cropPath),
    };
  });
}

function qualitySprinklerCoordinateKey(
  coordinate: QualitySprinklerGridCoordinate,
): string {
  return `${coordinate.x},${coordinate.y}`;
}

describe("quality sprinkler layout page copy", () => {
  it("exports the planting-layout route and one cover with six ordered cases", () => {
    expect(qualitySprinklerLayoutCanonicalPath).toBe(
      "/stardew-valley-quality-sprinkler-layout",
    );

    for (const locale of ["en", "zh-CN"] as const) {
      const copy = getQualitySprinklerLayoutPageCopy(locale);
      expect(copy.categoryLabel).toBe(
        locale === "en" ? "Planting Layouts" : "种植布局",
      );
      expect(copy.cover.imageSrc).toBe(
        "/farm-layouts/quality-sprinkler/images/01-quality-3x3-grid.webp",
      );
      expect(copy.cover.imageOriginalSrc).toBe(
        "/farm-layouts/quality-sprinkler/images/01-quality-3x3-grid-full.webp",
      );
      expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
        qualitySprinklerLayoutCaseStems,
      );
      expect(copy.cases).toHaveLength(6);
      expect(copy.whatIsParagraphs).toHaveLength(2);
      expect(copy.howToSteps).toHaveLength(3);
      expect(copy.faqs).toHaveLength(5);

      for (const layoutCase of copy.cases) {
        expect(layoutCase.imageSrc).toBe(
          `/farm-layouts/quality-sprinkler/images/${layoutCase.id}.webp`,
        );
        expect(layoutCase.imageOriginalSrc).toBe(
          `/farm-layouts/quality-sprinkler/images/${layoutCase.id}-full.webp`,
        );
        expect(layoutCase.projectHref).toBe(
          `/farm-layouts/quality-sprinkler/projects/${layoutCase.id}.json`,
        );
        expect(layoutCase.imageWidth).toBe(1600);
        expect(layoutCase.imageHeight).toBe(1300);
      }
    }
  });

  it("states verified crop counts, sprinkler ranges, and map caveats", () => {
    const englishCopy = getQualitySprinklerLayoutPageCopy("en");
    const chineseCopy = getQualitySprinklerLayoutPageCopy("zh-CN");
    const englishSummaries = englishCopy.cases.map(
      (layoutCase) => layoutCase.summary,
    );
    const chineseSummaries = chineseCopy.cases.map(
      (layoutCase) => layoutCase.summary,
    );

    expect(englishCopy.whatIsParagraphs[0]).toContain(
      "eight surrounding tiles in a 3 by 3 square",
    );
    expect(englishCopy.whatIsParagraphs[0]).toContain(
      "24 surrounding tiles in a 5 by 5 square",
    );
    expect(chineseCopy.whatIsParagraphs[0]).toContain("3×3 格中的 8 格");
    expect(chineseCopy.whatIsParagraphs[0]).toContain("5×5 格中的 24 格");
    expect(chineseCopy.whatIsParagraphs[0]).toContain(
      "未安装加压喷头的优质洒水器",
    );
    expect(chineseCopy.whatIsParagraphs[0]).toContain("安装加压喷头后");

    expect(englishSummaries[0]).toContain("32 Quality Sprinklers");
    expect(englishSummaries[0]).toContain("256 crops");
    expect(englishSummaries[0]).toContain(
      "96 blueberries, 96 melons, 32 hot peppers, and 32 starfruit",
    );
    expect(englishSummaries[0]).toContain("112 Wood Path");
    expect(englishSummaries[1]).toContain(
      "20 Quality Sprinklers and 148 melons",
    );
    expect(englishSummaries[1]).toContain("no path tiles");
    expect(englishSummaries[2]).toContain(
      "25 Quality Sprinklers and 200 blueberries",
    );
    expect(englishSummaries[2]).toContain("Eight scarecrows");
    expect(englishSummaries[3]).toContain("28 Quality Sprinklers water 197 melons");
    expect(englishSummaries[4]).toContain(
      "Four Quality Sprinklers equipped with Pressure Nozzles",
    );
    expect(englishSummaries[4]).toContain(
      "5 by 5 square of 24 surrounding tiles",
    );
    expect(englishSummaries[4]).toContain("96 plants total");
    expect(englishSummaries[4]).toContain("A scarecrow stands at (35, 35)");
    expect(englishSummaries[4]).toContain("one-tile-wide bare-ground cross lane");
    expect(englishSummaries[4]).toContain("without floor tiles");
    expect(englishSummaries[4]).not.toMatch(/wood path|wood floor/iu);
    expect(englishCopy.cases[4]?.imageAlt).toContain(
      "one-tile-wide bare-ground cross lane",
    );
    expect(englishCopy.faqs[2]?.answer).toContain(
      "one-tile-wide bare-ground cross lane",
    );
    expect(englishCopy.faqs[2]?.answer).not.toMatch(/wood path|wood floor/iu);
    expect(englishSummaries[5]).toContain("16 Quality Sprinklers");
    expect(englishSummaries[5]).toContain("4 by 4 grid");
    expect(englishSummaries[5]).toContain("48 Wood Path tiles");
    expect(englishSummaries[5]).toContain("not an indoor greenhouse map");

    expect(chineseSummaries[0]).toContain("32 个优质洒水器");
    expect(chineseSummaries[0]).toContain("256 个作物位置");
    expect(chineseSummaries[0]).toContain(
      "蓝莓、甜瓜各 96 格，辣椒和杨桃各 32 格",
    );
    expect(chineseSummaries[1]).toContain(
      "20 个优质洒水器和 148 株甜瓜",
    );
    expect(chineseSummaries[2]).toContain(
      "25 个优质洒水器和 200 株蓝莓",
    );
    expect(chineseSummaries[3]).toContain(
      "28 个优质洒水器为 197 株甜瓜供水",
    );
    expect(chineseSummaries[4]).toContain(
      "4 个安装加压喷头的优质洒水器",
    );
    expect(chineseSummaries[4]).toContain("每个喷头覆盖 5×5 范围内的 24 格");
    expect(chineseSummaries[4]).toContain(
      "四块共种植 96 株杨桃，每块 24 株",
    );
    expect(chineseSummaries[4]).toContain("稻草人位于 (35, 35)");
    expect(chineseSummaries[4]).toContain("一格宽的裸地十字通道");
    expect(chineseSummaries[4]).toContain("不铺地砖");
    expect(chineseSummaries[4]).not.toContain("木路径");
    expect(chineseCopy.cases[4]?.title).toBe("加压喷头与四块优质洒水器田");
    expect(chineseCopy.cases[4]?.imageAlt).toContain("一格宽的裸地十字通道");
    expect(chineseCopy.cases[4]?.imageAlt).toContain("加压喷头");
    expect(chineseCopy.faqs[2]?.answer).toContain("一格宽的裸地十字通道");
    expect(chineseCopy.faqs[2]?.question).toBe("户外加压喷头案例展示了什么？");
    expect(JSON.stringify(chineseCopy)).not.toContain("喷嘴");
    expect(chineseCopy.faqs[2]?.answer).not.toContain("木路径");
    expect(chineseSummaries[5]).toContain(
      "16 个优质洒水器组成 4×4 方阵",
    );
    expect(chineseSummaries[5]).toContain("为 108 株蓝莓供水");
    expect(chineseSummaries[5]).toContain("标准农场室外");
    expect(chineseSummaries[5]).toContain("不是温室室内地图");
  });

  it("keeps visible English keyword density between 2% and 3%", () => {
    expectQualitySprinklerLayoutKeywordDensity(
      getQualitySprinklerLayoutPageCopy("en"),
      "en",
    );
  });

  it("keeps all 96 starfruit tiles covered by the exported Pressure Nozzle sprinklers", () => {
    const { project, projectMap } = readQualitySprinklerLayoutCase06Project();
    const effectiveSeason = projectMap.season ?? project.season;
    expect(projectMap.label).toBe("Standard Farm");
    expect(projectMap.mapFile).toBe("Farm.tmx");
    expect(effectiveSeason).toBe("summer");

    const projectItemRecords = readQualitySprinklerLayoutCase06Records(
      projectMap.state.items,
      "state.items",
    );
    const floorItemIds = projectItemRecords
      .map((itemRecord, itemIndex) =>
        readQualitySprinklerLayoutCase06String(
          itemRecord,
          "itemId",
          `state.items[${itemIndex}]`,
        ),
      )
      .filter((itemId) => itemId.startsWith("floor:"));
    if (floorItemIds.length > 0) {
      throw new Error(
        `Quality Sprinkler case 06 must leave the cross lane as bare ground without floor tiles; received ${JSON.stringify(floorItemIds)}.`,
      );
    }

    const qualitySprinklerRecords = projectItemRecords.filter(
      (itemRecord, itemIndex) =>
        readQualitySprinklerLayoutCase06String(
          itemRecord,
          "itemId",
          `state.items[${itemIndex}]`,
        ) === "object:621",
    );
    expect(qualitySprinklerRecords).toHaveLength(4);

    const qualitySprinklerPlacementItems = qualitySprinklerRecords.map(
      createQualitySprinklerCoveragePlacementItem,
    );
    const qualitySprinklerVariants = qualitySprinklerPlacementItems.map(
      (sprinklerPlacementItem) => sprinklerPlacementItem.variant,
    );
    if (
      qualitySprinklerVariants.some((sprinklerVariant) => sprinklerVariant !== 1)
    ) {
      throw new Error(
        `Quality Sprinkler case 06 must enable Pressure Nozzle variant 1 on all four sprinklers; received variants ${JSON.stringify(qualitySprinklerVariants)}.`,
      );
    }

    const qualitySprinklerCoordinateKeys = qualitySprinklerPlacementItems
      .map((sprinklerPlacementItem) =>
        qualitySprinklerCoordinateKey(sprinklerPlacementItem),
      )
      .sort();
    const expectedQualitySprinklerCoordinateKeys = [
      "32,32",
      "32,38",
      "38,32",
      "38,38",
    ];
    if (
      JSON.stringify(qualitySprinklerCoordinateKeys)
      !== JSON.stringify(expectedQualitySprinklerCoordinateKeys)
    ) {
      throw new Error(
        `Quality Sprinkler case 06 must keep sprinkler coordinates ${JSON.stringify(expectedQualitySprinklerCoordinateKeys)}; received ${JSON.stringify(qualitySprinklerCoordinateKeys)}.`,
      );
    }

    const scarecrowRecords = projectItemRecords.filter(
      (itemRecord, itemIndex) =>
        readQualitySprinklerLayoutCase06String(
          itemRecord,
          "itemId",
          `state.items[${itemIndex}]`,
        ) === "big-craftable:8",
    );
    expect(scarecrowRecords).toHaveLength(1);
    const scarecrowRecord = scarecrowRecords[0];
    if (scarecrowRecord === undefined) {
      throw new Error(
        `Quality Sprinkler case 06 is missing scarecrow record 0; received ${JSON.stringify(scarecrowRecords)}.`,
      );
    }
    expect({
      x: readQualitySprinklerLayoutCase06Number(
        scarecrowRecord,
        "x",
        "state.items scarecrow",
      ),
      y: readQualitySprinklerLayoutCase06Number(
        scarecrowRecord,
        "y",
        "state.items scarecrow",
      ),
    }).toEqual({ x: 35, y: 35 });

    const projectCropRecords = readQualitySprinklerLayoutCase06Records(
      projectMap.state.crops,
      "state.crops",
    );
    expect(projectCropRecords).toHaveLength(96);
    const starfruitCoordinates = readQualitySprinklerLayoutCase06CropCoordinates(
      projectCropRecords,
    );
    const starfruitCoordinateKeys = starfruitCoordinates.map(
      qualitySprinklerCoordinateKey,
    );
    const uniqueStarfruitCoordinateKeys = new Set(starfruitCoordinateKeys);
    expect(uniqueStarfruitCoordinateKeys.size).toBe(96);

    const sprinklerCoverageCoordinates = qualitySprinklerPlacementItems.flatMap(
      (sprinklerPlacementItem) => {
        const sprinklerCoverageTiles = createSprinklerCoverageTiles(
          sprinklerPlacementItem,
        );
        if (sprinklerCoverageTiles === null) {
          throw new Error(
            `Expected Quality Sprinkler coverage for item ${JSON.stringify(sprinklerPlacementItem)}; received null.`,
          );
        }
        expect(sprinklerCoverageTiles).toHaveLength(24);
        return sprinklerCoverageTiles;
      },
    );
    const sprinklerCoverageCoordinateKeys = new Set(
      sprinklerCoverageCoordinates.map(qualitySprinklerCoordinateKey),
    );
    const uncoveredStarfruitCoordinateKeys = starfruitCoordinateKeys.filter(
      (coordinateKey) => !sprinklerCoverageCoordinateKeys.has(coordinateKey),
    );
    const sprinklerCoverageWithoutStarfruitKeys = [
      ...sprinklerCoverageCoordinateKeys,
    ].filter((coordinateKey) => !uniqueStarfruitCoordinateKeys.has(coordinateKey));

    expect(uncoveredStarfruitCoordinateKeys).toEqual([]);
    expect(sprinklerCoverageWithoutStarfruitKeys).toEqual([]);
  });

  it("keeps visible Chinese keyword density between 2% and 3%", () => {
    expectQualitySprinklerLayoutKeywordDensity(
      getQualitySprinklerLayoutPageCopy("zh-CN"),
      "zh-CN",
    );
  });

  it("does not count metadata or image alt text as visible body words", () => {
    const englishCopy = getQualitySprinklerLayoutPageCopy("en");
    const englishCopyWithNonVisibleKeywords: QualitySprinklerLayoutPageCopy = {
      ...englishCopy,
      metaTitle: "quality sprinkler layout ".repeat(30),
      description: "quality sprinkler layout ".repeat(30),
      cover: {
        ...englishCopy.cover,
        imageAlt: "quality sprinkler layout ".repeat(30),
      },
      cases: englishCopy.cases.map((layoutCase) => ({
        ...layoutCase,
        imageAlt: "quality sprinkler layout ".repeat(30),
      })),
    };

    expect(getVisibleQualitySprinklerLayoutText(englishCopyWithNonVisibleKeywords))
      .toBe(getVisibleQualitySprinklerLayoutText(englishCopy));
  });

  it("rejects an unsupported locale with the received value", () => {
    expect(() =>
      getQualitySprinklerLayoutPageCopy("fr" as PublicLocale),
    ).toThrow('Unsupported Quality Sprinkler Layout page locale: "fr".');
  });
});
