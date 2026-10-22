import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getSprinklerLayoutPageCopy,
  sprinklerLayoutCanonicalPath,
  type SprinklerLayoutCase,
  type SprinklerLayoutCover,
  type SprinklerLayoutPageCopy,
} from "../../src/farm-layouts/sprinkler-layout-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
  type ReferenceProjectMap,
  type ReferenceStoredProject,
} from "../../src/reference-runtime/local-project-api";
import type { PublicLocale } from "../../src/i18n/public-locale";

const sprinklerLayoutPublicRoot = join(
  process.cwd(),
  "public",
  "farm-layouts",
  "sprinkler",
);
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";
const sprinklerLayoutCaseStems = [
  "01-basic-knights-move-staggered",
  "02-quality-3x3-grid",
  "03-iridium-5x5-grid",
  "04-scarecrow-radius-quality",
  "05-scarecrow-radius-iridium",
  "06-greenhouse-6-iridium-116",
] as const;
const sprinklerLayoutImageStems = [
  sprinklerLayoutCoverStem,
  ...sprinklerLayoutCaseStems,
] as const;

type SprinklerLayoutCaseStem = (typeof sprinklerLayoutCaseStems)[number];

type SprinklerLayoutCaseExpectation = Readonly<{
  projectId: string;
  mapId: string;
  nextItemId: number;
  itemIdCounts: Readonly<Record<string, number>>;
  cropIdCounts: Readonly<Record<string, number>>;
  scarecrowTiles: readonly string[];
  englishSummaryParts: readonly string[];
  chineseSummaryParts: readonly string[];
}>;

const sprinklerLayoutCaseExpectations: Readonly<
  Record<SprinklerLayoutCaseStem, SprinklerLayoutCaseExpectation>
> = {
  "01-basic-knights-move-staggered": {
    projectId: "01basicknightsmovestaggered",
    mapId: "01basicknightsmovestaggeredmap",
    nextItemId: 26,
    itemIdCounts: { "object:599": 25 },
    cropIdCounts: { "crop:479": 92 },
    scarecrowTiles: [],
    englishSummaryParts: [
      "25 basic sprinklers",
      "92 melons",
      "knight move",
      "8 tiles",
    ],
    chineseSummaryParts: ["25 个普通洒水器", "92 株甜瓜", "8 格"],
  },
  "02-quality-3x3-grid": {
    projectId: "02quality3x3grid",
    mapId: "02quality3x3gridmap",
    nextItemId: 26,
    itemIdCounts: { "object:621": 25 },
    cropIdCounts: { "crop:481": 200 },
    scarecrowTiles: [],
    englishSummaryParts: [
      "25 quality sprinklers",
      "200 blueberries",
      "15 by 15",
      "3 tiles apart",
    ],
    chineseSummaryParts: ["25 个优质洒水器", "200 株蓝莓", "15×15", "3 格"],
  },
  "03-iridium-5x5-grid": {
    projectId: "03iridium5x5grid",
    mapId: "03iridium5x5gridmap",
    nextItemId: 17,
    itemIdCounts: { "object:645": 16 },
    cropIdCounts: { "crop:486": 384 },
    scarecrowTiles: [],
    englishSummaryParts: [
      "16 iridium sprinklers",
      "384 starfruit",
      "20 by 20",
      "5 tiles apart",
    ],
    chineseSummaryParts: ["16 个铱金洒水器", "384 株杨桃", "20×20", "5 格"],
  },
  "04-scarecrow-radius-quality": {
    projectId: "04scarecrowradiusquality",
    mapId: "04scarecrowradiusqualitymap",
    nextItemId: 22,
    itemIdCounts: { "big-craftable:8": 1, "object:621": 20 },
    cropIdCounts: { "crop:479": 148 },
    scarecrowTiles: ["36,36"],
    englishSummaryParts: [
      "20 quality sprinklers",
      "148 melons",
      "(36, 36)",
      "12 tiles",
    ],
    chineseSummaryParts: ["20 个优质洒水器", "148 株甜瓜", "(36, 36)", "12 格"],
  },
  "05-scarecrow-radius-iridium": {
    projectId: "05scarecrowradiusiridium",
    mapId: "05scarecrowradiusiridiummap",
    nextItemId: 10,
    itemIdCounts: { "big-craftable:8": 1, "object:645": 8 },
    cropIdCounts: { "crop:486": 147 },
    scarecrowTiles: ["36,36"],
    englishSummaryParts: [
      "8 iridium sprinklers",
      "147 starfruit",
      "(36, 36)",
      "45 tiles",
    ],
    chineseSummaryParts: ["8 个铱金洒水器", "147 株杨桃", "(36, 36)", "45 格"],
  },
  "06-greenhouse-6-iridium-116": {
    projectId: "06greenhouse6iridium116",
    mapId: "06greenhouse6iridium116map",
    nextItemId: 55,
    itemIdCounts: { "floor:6": 48, "object:645": 6 },
    cropIdCounts: { "crop:486": 116 },
    scarecrowTiles: [],
    englishSummaryParts: [
      "greenhouse reference drawn on the Standard Farm",
      "not the greenhouse interior",
      "12 by 10",
      "116 starfruit",
      "6 iridium sprinklers",
      "28 tiles",
    ],
    chineseSummaryParts: [
      "标准农场上的温室参考示意",
      "不是温室室内地图",
      "12×10",
      "116 株杨桃",
      "6 个铱金洒水器",
      "28 格",
    ],
  },
};

const unpublishedClaimPattern =
  /\b(?:best|optimal|percent|percentage|reddit|upvote|authors?)\b|%|最佳|最优|百分比|作者|点赞|无缝|无乌鸦|gapless|17\s*[x×]\s*17|Farm\.tmx|Greenhouse\.tmx|fully covered|fully protected|保护|半径|\bradius\b|\bcircle\b/iu;

function isSprinklerLayoutCaseStem(
  caseId: string,
): caseId is SprinklerLayoutCaseStem {
  return Object.hasOwn(sprinklerLayoutCaseExpectations, caseId);
}

function getSprinklerLayoutBodyText(copy: SprinklerLayoutPageCopy): string {
  if (copy.cases.length !== sprinklerLayoutCaseStems.length) {
    throw new Error(
      `Cannot measure sprinkler layout keyword density without ${sprinklerLayoutCaseStems.length} cases. Received ${copy.cases.length} cases.`,
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
  ]
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
}

function countSprinklerLayoutKeywordMentions(
  bodyText: string,
  locale: PublicLocale,
): number {
  if (locale === "en") {
    return [
      ...bodyText.matchAll(/\bstardew valley sprinkler layout\b/giu),
    ].length;
  }

  if (locale === "zh-CN") {
    return bodyText.split("星露谷物语洒水器布局").length - 1;
  }

  throw new Error(
    `Cannot count sprinkler layout keywords for locale ${String(locale)}.`,
  );
}

function countSprinklerLayoutWords(
  bodyText: string,
  locale: PublicLocale,
): number {
  return [
    ...new Intl.Segmenter(locale, { granularity: "word" }).segment(bodyText),
  ].filter((segment) => segment.isWordLike).length;
}

function getSprinklerLayoutProse(copy: SprinklerLayoutPageCopy): string {
  return [
    copy.title,
    copy.metaTitle,
    copy.description,
    copy.intro,
    copy.categoryLabel,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.casesHeading,
    copy.casesDescription,
    copy.ctaHeading,
    copy.ctaDescription,
    copy.ctaButtonLabel,
    copy.whatIsHeading,
    ...copy.whatIsParagraphs,
    copy.enlargeImageLabel,
    copy.closeImageLabel,
    copy.downloadProjectLabel,
    copy.howToEyebrow,
    copy.howToHeading,
    ...copy.howToSteps.flatMap((step) => [step.title, step.body]),
    copy.faqEyebrow,
    copy.faqHeading,
    copy.faqDescription,
    ...copy.faqs.flatMap((faq) => [faq.question, faq.answer]),
    copy.cover.caption,
    copy.cover.imageAlt,
    ...copy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
      layoutCase.imageAlt,
    ]),
  ].join("\n");
}

function readSprinklerLayoutObject(
  value: ReferenceJsonValue,
  valueLabel: string,
): { [propertyName: string]: ReferenceJsonValue } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(
      `${valueLabel} must be an object; received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function readSprinklerLayoutString(
  value: ReferenceJsonValue,
  propertyName: string,
  valueLabel: string,
): string {
  const record = readSprinklerLayoutObject(value, valueLabel);
  const propertyValue = record[propertyName];
  if (typeof propertyValue !== "string") {
    throw new Error(
      `${valueLabel} is missing string ${propertyName}; received ${JSON.stringify(propertyValue)}.`,
    );
  }

  return propertyValue;
}

function readSprinklerLayoutNumber(
  value: ReferenceJsonValue,
  propertyName: string,
  valueLabel: string,
): number {
  const record = readSprinklerLayoutObject(value, valueLabel);
  const propertyValue = record[propertyName];
  if (typeof propertyValue !== "number") {
    throw new Error(
      `${valueLabel} is missing number ${propertyName}; received ${JSON.stringify(propertyValue)}.`,
    );
  }

  return propertyValue;
}

function countSprinklerLayoutIds(
  entries: ReferenceJsonValue,
  idPropertyName: string,
  entriesLabel: string,
): Record<string, number> {
  if (!Array.isArray(entries)) {
    throw new Error(
      `${entriesLabel} must be an array; received ${JSON.stringify(entries)}.`,
    );
  }

  const idCounts: Record<string, number> = {};
  for (const [entryIndex, entry] of entries.entries()) {
    const entryId = readSprinklerLayoutString(
      entry,
      idPropertyName,
      `${entriesLabel}[${entryIndex}]`,
    );
    idCounts[entryId] = (idCounts[entryId] ?? 0) + 1;
  }

  return idCounts;
}

function readScarecrowTiles(
  items: ReferenceJsonValue,
  projectStem: string,
): string[] {
  if (!Array.isArray(items)) {
    throw new Error(
      `state.items in ${projectStem} must be an array; received ${JSON.stringify(items)}.`,
    );
  }

  const scarecrowTiles: string[] = [];
  for (const [itemIndex, item] of items.entries()) {
    const itemLabel = `${projectStem} item ${itemIndex}`;
    const itemId = readSprinklerLayoutString(item, "itemId", itemLabel);
    if (itemId !== "big-craftable:8") {
      continue;
    }

    const x = readSprinklerLayoutNumber(item, "x", itemLabel);
    const y = readSprinklerLayoutNumber(item, "y", itemLabel);
    scarecrowTiles.push(`${x},${y}`);
  }

  return scarecrowTiles.sort();
}

function readSprinklerPublicProject(stem: string): Readonly<{
  storedProject: ReferenceStoredProject;
  projectMap: ReferenceProjectMap;
}> {
  const projectPath = join(sprinklerLayoutPublicRoot, "projects", `${stem}.json`);
  if (!existsSync(projectPath)) {
    throw new Error(`Missing sprinkler public project at ${projectPath}.`);
  }

  const serializedProjectDocument = readFileSync(projectPath, "utf8");
  const parsedProjectDocument = parseReferenceProjectDocument(
    serializedProjectDocument,
  );
  const validatedProjectDocument = validateReferenceProjectDocument(
    JSON.parse(serializedProjectDocument) as unknown,
  );
  expect(parsedProjectDocument).toEqual(validatedProjectDocument);
  if (validatedProjectDocument.projects.length !== 1) {
    throw new Error(
      `Sprinkler public project ${projectPath} must contain 1 project; received ${validatedProjectDocument.projects.length}.`,
    );
  }

  const storedProject = validatedProjectDocument.projects[0];
  if (storedProject === undefined) {
    throw new Error(
      `Sprinkler public project ${projectPath} is missing project 0.`,
    );
  }
  if (storedProject.project.maps.length !== 1) {
    throw new Error(
      `Sprinkler public project ${projectPath} must contain 1 map; received ${storedProject.project.maps.length}.`,
    );
  }

  const projectMap = storedProject.project.maps[0];
  if (projectMap === undefined) {
    throw new Error(
      `Sprinkler public project ${projectPath} is missing map 0.`,
    );
  }

  return { storedProject, projectMap };
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

function listSprinklerPublicFiles(directoryName: "images" | "projects"): string[] {
  const directoryPath = join(sprinklerLayoutPublicRoot, directoryName);
  if (!existsSync(directoryPath)) {
    throw new Error(
      `Missing sprinkler public ${directoryName} directory at ${directoryPath}.`,
    );
  }

  return readdirSync(directoryPath).sort();
}

function expectSprinklerLayoutImage(
  image: SprinklerLayoutCover | SprinklerLayoutCase,
  stem: string,
): void {
  expect(image.imageSrc).toBe(
    `/farm-layouts/sprinkler/images/${stem}.webp`,
  );
  expect(image.imageOriginalSrc).toBe(
    `/farm-layouts/sprinkler/images/${stem}-full.webp`,
  );
  expect(image.imageWidth).toBe(1600);
  expect(image.imageHeight).toBe(1300);
  expect(image.imageAlt.trim()).not.toBe("");
}

describe("Sprinkler layout page copy", () => {
  it("keeps six cases and a separate cover for both locales", () => {
    const englishCopy = getSprinklerLayoutPageCopy("en");
    const chineseCopy = getSprinklerLayoutPageCopy("zh-CN");
    const contentSource = readFileSync(
      join(process.cwd(), "src/farm-layouts/sprinkler-layout-content.ts"),
      "utf8",
    );

    expect(sprinklerLayoutCanonicalPath).toBe(
      "/stardew-valley-sprinkler-layout",
    );
    expect(englishCopy.cases.map((layoutCase) => layoutCase.id)).toEqual([
      ...sprinklerLayoutCaseStems,
    ]);
    expect(chineseCopy.cases.map((layoutCase) => layoutCase.id)).toEqual([
      ...sprinklerLayoutCaseStems,
    ]);
    expect(englishCopy.cases).toHaveLength(6);
    expect(chineseCopy.cases).toHaveLength(6);
    expect(Object.hasOwn(englishCopy.cover, "projectHref")).toBe(false);
    expect(Object.hasOwn(chineseCopy.cover, "projectHref")).toBe(false);
    expectSprinklerLayoutImage(englishCopy.cover, sprinklerLayoutCoverStem);
    expect(chineseCopy.cover.imageSrc).toBe(englishCopy.cover.imageSrc);
    expect(chineseCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cover.imageOriginalSrc,
    );
    expect(chineseCopy.cover.imageAlt).not.toBe(englishCopy.cover.imageAlt);
    expect(chineseCopy.cover.caption).not.toBe(englishCopy.cover.caption);
    expect(englishCopy.cover.caption).toContain("72 melons");
    expect(chineseCopy.cover.caption).toContain("72 株甜瓜");
    expect(contentSource).not.toContain("Farm.tmx");
    expect(contentSource).not.toContain("Greenhouse.tmx");
    expect(getSprinklerLayoutProse(englishCopy)).not.toMatch(
      unpublishedClaimPattern,
    );
    expect(getSprinklerLayoutProse(chineseCopy)).not.toMatch(
      unpublishedClaimPattern,
    );

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(
        localizedCopy.whatIsParagraphs.every(
          (paragraph) => paragraph.trim() !== "",
        ),
      ).toBe(true);
      expect(localizedCopy.howToSteps.map((step) => step.number)).toEqual([
        "01",
        "02",
        "03",
      ]);
      expect(localizedCopy.faqs).toHaveLength(5);
      expect(localizedCopy.cases.map((layoutCase) => layoutCase.id)).not.toContain(
        sprinklerLayoutCoverStem,
      );
    }

    expect(englishCopy.howToSteps[1]?.body).toContain("Library → Import JSON");
    expect(englishCopy.ctaDescription).toContain("Library → Import JSON");
    expect(englishCopy.faqs[4]?.answer).toContain(
      "The JSON is a planner project, not a game save.",
    );
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目 → 导入 JSON");
    expect(chineseCopy.ctaDescription).toContain("本地项目 → 导入 JSON");
    expect(chineseCopy.faqs[4]?.answer).toContain("不是游戏存档");
    expect(englishCopy.cases[5]?.summary).toContain(
      "greenhouse reference drawn on the Standard Farm",
    );
    expect(englishCopy.faqs[2]?.answer).toContain(
      "greenhouse reference drawn on the Standard Farm",
    );
    expect(chineseCopy.cases[5]?.summary).toContain(
      "标准农场上的温室参考示意",
    );
    expect(chineseCopy.faqs[2]?.answer).toContain("标准农场上的温室参考示意");

    for (const [caseIndex, caseStem] of sprinklerLayoutCaseStems.entries()) {
      if (!isSprinklerLayoutCaseStem(caseStem)) {
        throw new Error(
          `Missing sprinkler layout expectation for ${String(caseStem)}.`,
        );
      }

      const englishCase = englishCopy.cases[caseIndex];
      const chineseCase = chineseCopy.cases[caseIndex];
      const caseExpectation = sprinklerLayoutCaseExpectations[caseStem];
      if (englishCase === undefined || chineseCase === undefined) {
        throw new Error(
          `Missing localized sprinkler layout case at index ${caseIndex} for ${caseStem}.`,
        );
      }

      expect(englishCase.id).toBe(caseStem);
      expect(chineseCase.id).toBe(caseStem);
      expectSprinklerLayoutImage(englishCase, caseStem);
      expect(englishCase.projectHref).toBe(
        `/farm-layouts/sprinkler/projects/${caseStem}.json`,
      );
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(chineseCase.imageWidth).toBe(englishCase.imageWidth);
      expect(chineseCase.imageHeight).toBe(englishCase.imageHeight);
      expect(chineseCase.title).not.toBe(englishCase.title);
      expect(chineseCase.summary).not.toBe(englishCase.summary);
      expect(chineseCase.imageAlt).not.toBe(englishCase.imageAlt);
      expect(englishCase.projectHref).not.toContain(sprinklerLayoutCoverStem);
      for (const summaryPart of caseExpectation.englishSummaryParts) {
        expect(englishCase.summary).toContain(summaryPart);
      }
      for (const summaryPart of caseExpectation.chineseSummaryParts) {
        expect(chineseCase.summary).toContain(summaryPart);
      }
    }
  });

  it("rejects an unsupported locale before returning copy", () => {
    expect(() => getSprinklerLayoutPageCopy("ja" as PublicLocale)).toThrow(
      "Unsupported Sprinkler Layout page locale: ja.",
    );
  });

  it("keeps visible copy keyword density between two and three percent", () => {
    const densityReports = (["en", "zh-CN"] as const).map((locale) => {
      const localizedCopy = getSprinklerLayoutPageCopy(locale);
      const bodyText = getSprinklerLayoutBodyText(localizedCopy);
      const wordCount = countSprinklerLayoutWords(bodyText, locale);
      const keywordMentions = countSprinklerLayoutKeywordMentions(
        bodyText,
        locale,
      );
      if (wordCount <= 0) {
        throw new Error(
          `Sprinkler layout keyword density for ${locale} received ${wordCount} words.`,
        );
      }

      return {
        locale,
        wordCount,
        keywordMentions,
        densityPercent: (keywordMentions / wordCount) * 100,
      };
    });
    const densitySummary = densityReports
      .map(
        (report) =>
          `${report.locale}: ${report.densityPercent}% (${report.keywordMentions} mentions / ${report.wordCount} words)`,
      )
      .join("; ");
    const outOfRangeReport = densityReports.find(
      (report) => !(report.densityPercent >= 2 && report.densityPercent <= 3),
    );
    if (outOfRangeReport !== undefined) {
      throw new Error(
        `Sprinkler layout keyword density must stay between 2% and 3%. Received ${densitySummary}.`,
      );
    }

    expect(densitySummary).toContain("mentions");
  });
});

describe("Sprinkler layout public assets", () => {
  it("matches six projects and seven image sets under the public sprinkler paths", () => {
    const imageFiles = listSprinklerPublicFiles("images");
    const projectFiles = listSprinklerPublicFiles("projects");
    const expectedImageFiles = sprinklerLayoutImageStems
      .flatMap((stem) => [`${stem}.avif`, `${stem}.webp`, `${stem}-full.webp`])
      .sort();
    const expectedProjectFiles = sprinklerLayoutCaseStems.map(
      (stem) => `${stem}.json`,
    );

    expect(imageFiles).toEqual(expectedImageFiles);
    expect(projectFiles).toEqual(expectedProjectFiles);
    expect(projectFiles).not.toContain(`${sprinklerLayoutCoverStem}.json`);
    expect(imageFiles).toHaveLength(21);
    expect(projectFiles).toHaveLength(6);

    for (const stem of sprinklerLayoutImageStems) {
      const previewImagePath = join(
        sprinklerLayoutPublicRoot,
        "images",
        `${stem}.webp`,
      );
      const fullImagePath = join(
        sprinklerLayoutPublicRoot,
        "images",
        `${stem}-full.webp`,
      );
      const avifImagePath = join(
        sprinklerLayoutPublicRoot,
        "images",
        `${stem}.avif`,
      );
      const previewImageBytes = readFileSync(previewImagePath);
      const fullImageBytes = readFileSync(fullImagePath);
      const avifImageBytes = readFileSync(avifImagePath);

      expect(getWebpDimensions(previewImageBytes, previewImagePath)).toEqual({
        width: 1600,
        height: 1300,
      });
      expect(getWebpDimensions(fullImageBytes, fullImagePath)).toEqual({
        width: 2560,
        height: 2080,
      });
      expect(getAvifDimensions(avifImageBytes, avifImagePath)).toEqual({
        width: 1600,
        height: 1300,
      });
      expect(statSync(previewImagePath).size).toBeGreaterThan(0);
      expect(statSync(fullImagePath).size).toBeGreaterThan(0);
      expect(statSync(avifImagePath).size).toBeGreaterThan(0);
    }

    for (const stem of sprinklerLayoutCaseStems) {
      const caseExpectation = sprinklerLayoutCaseExpectations[stem];
      const { storedProject, projectMap } = readSprinklerPublicProject(stem);
      if (!Object.hasOwn(projectMap.state, "items")) {
        throw new Error(`Missing state.items in ${stem}.`);
      }
      if (!Object.hasOwn(projectMap.state, "crops")) {
        throw new Error(`Missing state.crops in ${stem}.`);
      }
      if (!Object.hasOwn(projectMap.state, "buildings")) {
        throw new Error(`Missing state.buildings in ${stem}.`);
      }

      expect(storedProject.id).toBe(caseExpectation.projectId);
      expect(storedProject.project.version).toBe(4);
      expect(storedProject.project.gameVersion).toBe("1.6.15");
      expect(storedProject.project.activeMapId).toBe(caseExpectation.mapId);
      expect(projectMap.id).toBe(caseExpectation.mapId);
      expect(projectMap.mapFile).toBe("Farm.tmx");
      expect(projectMap.label).toBe("Standard Farm");
      expect(projectMap.season).toBe("summer");
      expect(readSprinklerLayoutNumber(
        projectMap.state as ReferenceJsonValue,
        "nextItemId",
        `${stem} state`,
      )).toBe(caseExpectation.nextItemId);
      expect(readSprinklerLayoutNumber(
        projectMap.state as ReferenceJsonValue,
        "nextBuildingId",
        `${stem} state`,
      )).toBe(4);
      expect(
        countSprinklerLayoutIds(
          projectMap.state.items,
          "itemId",
          `${stem} items`,
        ),
      ).toEqual(caseExpectation.itemIdCounts);
      expect(
        countSprinklerLayoutIds(
          projectMap.state.crops,
          "cropId",
          `${stem} crops`,
        ),
      ).toEqual(caseExpectation.cropIdCounts);
      expect(
        countSprinklerLayoutIds(
          projectMap.state.buildings,
          "buildingId",
          `${stem} buildings`,
        ),
      ).toEqual({
        Farmhouse: 1,
        "Pet Bowl": 1,
        "Shipping Bin": 1,
      });
      expect(readScarecrowTiles(projectMap.state.items, stem)).toEqual([
        ...caseExpectation.scarecrowTiles,
      ]);
    }
  });
});
