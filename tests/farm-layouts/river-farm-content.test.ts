import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getRiverFarmPageCopy,
  riverFarmCanonicalPath,
  type RiverFarmCase,
  type RiverFarmCover,
  type RiverFarmPageCopy,
} from "../../src/farm-layouts/river-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
  type ReferenceProjectMap,
} from "../../src/reference-runtime/local-project-api";
import type { PublicLocale } from "../../src/i18n/public-locale";

const riverFarmPublicRoot = join(
  process.cwd(),
  "public",
  "farm-layouts",
  "river",
);
const riverFarmLayoutStems = [
  "stardew-valley-river-farm-layout-01-namsai-summer-island-specialization",
  "stardew-valley-river-farm-layout-02-spring-perfection-island-zones",
  "stardew-valley-river-farm-layout-03-y6-fall-perfection-pumpkin-hub",
  "stardew-valley-river-farm-layout-04-stardewplan-beauty-trellis",
  "stardew-valley-river-farm-layout-05-y6-fall-rustic-shed-village",
  "stardew-valley-river-farm-layout-06-y12-summer-ranch-center",
  "stardew-valley-river-farm-layout-07-y5-fall-purple-paint-town",
] as const;
const expectedRiverFarmCaseIds = riverFarmLayoutStems.map((stem) =>
  stem.slice("stardew-valley-river-farm-layout-".length),
);
const expectedFishPondCountByCaseId = {
  "01-namsai-summer-island-specialization": 4,
  "02-spring-perfection-island-zones": 5,
  "03-y6-fall-perfection-pumpkin-hub": 4,
  "04-stardewplan-beauty-trellis": 3,
  "05-y6-fall-rustic-shed-village": 1,
  "06-y12-summer-ranch-center": 4,
  "07-y5-fall-purple-paint-town": 5,
} as const;
const expectedFishPondPhraseByCaseId = {
  en: {
    "01-namsai-summer-island-specialization": "four Fish Ponds",
    "02-spring-perfection-island-zones": "five Fish Ponds",
    "03-y6-fall-perfection-pumpkin-hub": "four Fish Ponds",
    "04-stardewplan-beauty-trellis": "three Fish Ponds",
    "05-y6-fall-rustic-shed-village": "one Fish Pond",
    "06-y12-summer-ranch-center": "four Fish Ponds",
    "07-y5-fall-purple-paint-town": "five Fish Ponds",
  },
  "zh-CN": {
    "01-namsai-summer-island-specialization": "四座鱼塘",
    "02-spring-perfection-island-zones": "五座鱼塘",
    "03-y6-fall-perfection-pumpkin-hub": "四座鱼塘",
    "04-stardewplan-beauty-trellis": "三座鱼塘",
    "05-y6-fall-rustic-shed-village": "一座鱼塘",
    "06-y12-summer-ranch-center": "四座鱼塘",
    "07-y5-fall-purple-paint-town": "五座鱼塘",
  },
} as const;
const unpublishedClaimPattern =
  /reddit|upvote|namsai|100%|perfection|\bY(?:5|6|12)\b|year\s+\d+|作者|点赞/iu;

type RiverFarmCaseId = keyof typeof expectedFishPondCountByCaseId;

function isRiverFarmCaseId(caseId: string): caseId is RiverFarmCaseId {
  return Object.hasOwn(expectedFishPondCountByCaseId, caseId);
}

type RiverFarmImage = Readonly<{
  id: string;
  imageSrc: string;
  imageOriginalSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
}>;

function getRiverFarmBodyText(copy: RiverFarmPageCopy): string {
  if (copy.cases.length === 0) {
    throw new Error(
      `Cannot measure River Farm keyword density without cases. Received ${copy.cases.length} cases.`,
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

function countRiverFarmKeywordMentions(
  bodyText: string,
  locale: "en" | "zh-CN",
): number {
  if (locale === "en") {
    return [...bodyText.matchAll(/\bstardew valley river farm layout\b/giu)]
      .length;
  }

  return bodyText.split("星露谷物语河流农场布局").length - 1;
}

function countRiverFarmWords(bodyText: string, locale: "en" | "zh-CN"): number {
  return [...new Intl.Segmenter(locale, { granularity: "word" }).segment(bodyText)]
    .filter((segment) => segment.isWordLike).length;
}

function getRiverFarmImages(
  cover: RiverFarmCover,
  cases: readonly RiverFarmCase[],
): readonly RiverFarmImage[] {
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

function getRiverFarmProse(copy: RiverFarmPageCopy): string {
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
    ...copy.cases.flatMap((farmCase) => [
      farmCase.title,
      farmCase.summary,
      farmCase.imageAlt,
    ]),
  ].join("\n");
}

function readRiverFarmPublicProjectMap(stem: string): ReferenceProjectMap {
  const projectPath = join(riverFarmPublicRoot, "projects", `${stem}.json`);
  if (!existsSync(projectPath)) {
    throw new Error(`Missing River Farm public project at ${projectPath}.`);
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
      `River Farm public project ${projectPath} must contain 1 project; received ${validatedProjectDocument.projects.length}.`,
    );
  }

  const storedProject = validatedProjectDocument.projects[0];
  if (storedProject === undefined) {
    throw new Error(
      `River Farm public project ${projectPath} is missing project 0.`,
    );
  }
  if (storedProject.project.maps.length !== 1) {
    throw new Error(
      `River Farm public project ${projectPath} must contain 1 map; received ${storedProject.project.maps.length}.`,
    );
  }

  const riverFarmMap = storedProject.project.maps[0];
  if (riverFarmMap === undefined) {
    throw new Error(
      `River Farm public project ${projectPath} is missing map 0.`,
    );
  }

  return riverFarmMap;
}

type RiverFarmPublicImageFiles = Readonly<{
  previewImagePath: string;
  fullImagePath: string;
  avifImagePath: string;
  previewImageBytes: Buffer;
  fullImageBytes: Buffer;
  avifImageBytes: Buffer;
}>;

function readRiverFarmPublicImages(stem: string): RiverFarmPublicImageFiles {
  const previewImagePath = join(riverFarmPublicRoot, "images", `${stem}.webp`);
  const fullImagePath = join(
    riverFarmPublicRoot,
    "images",
    `${stem}-full.webp`,
  );
  const avifImagePath = join(riverFarmPublicRoot, "images", `${stem}.avif`);
  if (!existsSync(previewImagePath)) {
    throw new Error(`Missing River Farm preview WebP at ${previewImagePath}.`);
  }
  if (!existsSync(fullImagePath)) {
    throw new Error(`Missing River Farm full WebP at ${fullImagePath}.`);
  }
  if (!existsSync(avifImagePath)) {
    throw new Error(`Missing River Farm preview AVIF at ${avifImagePath}.`);
  }

  return {
    previewImagePath,
    fullImagePath,
    avifImagePath,
    previewImageBytes: readFileSync(previewImagePath),
    fullImageBytes: readFileSync(fullImagePath),
    avifImageBytes: readFileSync(avifImagePath),
  };
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

function countFishPonds(
  buildings: ReferenceJsonValue,
  projectStem: string,
): number {
  if (!Array.isArray(buildings)) {
    throw new Error(
      `state.buildings in ${projectStem} must be an array; received ${JSON.stringify(buildings)}.`,
    );
  }

  let fishPondCount = 0;
  for (const [buildingIndex, building] of buildings.entries()) {
    if (typeof building !== "object" || building === null || Array.isArray(building)) {
      throw new Error(
        `Building ${buildingIndex} in ${projectStem} must be an object; received ${JSON.stringify(building)}.`,
      );
    }
    if (typeof building.buildingId !== "string") {
      throw new Error(
        `Building ${buildingIndex} in ${projectStem} is missing string buildingId; received ${JSON.stringify(building.buildingId)}.`,
      );
    }
    if (building.buildingId === "Fish Pond") {
      fishPondCount += 1;
    }
  }

  return fishPondCount;
}

describe("River Farm page content and public projects", () => {
  it("keeps seven localized cases and reuses case 01 as the cover", () => {
    const englishCopy = getRiverFarmPageCopy("en");
    const chineseCopy = getRiverFarmPageCopy("zh-CN");

    expect(riverFarmCanonicalPath).toBe("/stardew-valley-river-farm-layout");
    expect(expectedRiverFarmCaseIds).toEqual([
      "01-namsai-summer-island-specialization",
      "02-spring-perfection-island-zones",
      "03-y6-fall-perfection-pumpkin-hub",
      "04-stardewplan-beauty-trellis",
      "05-y6-fall-rustic-shed-village",
      "06-y12-summer-ranch-center",
      "07-y5-fall-purple-paint-town",
    ]);
    expect(englishCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedRiverFarmCaseIds,
    );
    expect(chineseCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      expectedRiverFarmCaseIds,
    );
    expect(englishCopy.cases).toHaveLength(7);
    expect(chineseCopy.cases).toHaveLength(7);
    expect(englishCopy.cover.imageSrc).toBe(englishCopy.cases[0]?.imageSrc);
    expect(englishCopy.cover.imageOriginalSrc).toBe(
      englishCopy.cases[0]?.imageOriginalSrc,
    );
    expect(englishCopy.cover.imageSrc).toBe(chineseCopy.cover.imageSrc);
    expect(englishCopy.cover.imageOriginalSrc).toBe(
      chineseCopy.cover.imageOriginalSrc,
    );
    expect(englishCopy.cover.imageSrc).toContain(
      "01-namsai-summer-island-specialization",
    );
    expect(englishCopy.cover.imageWidth).toBe(1600);
    expect(englishCopy.cover.imageHeight).toBe(1300);
    expect(chineseCopy.cover.imageWidth).toBe(1600);
    expect(chineseCopy.cover.imageHeight).toBe(1300);
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

    expect(englishCopy.howToSteps[1]?.body).toContain("Library → Import JSON");
    expect(englishCopy.faqs[3]?.answer).toContain(
      "The JSON is a planner project, not a game save.",
    );
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目 → 导入 JSON");
    expect(chineseCopy.faqs[3]?.answer).toContain("不是游戏存档");
    expect(getRiverFarmProse(englishCopy)).not.toMatch(unpublishedClaimPattern);
    expect(getRiverFarmProse(chineseCopy)).not.toMatch(unpublishedClaimPattern);
  });

  it("rejects an unsupported locale before returning copy", () => {
    expect(() => getRiverFarmPageCopy("ja" as PublicLocale)).toThrow(
      "Unsupported River Farm page locale: ja.",
    );
  });

  it("keeps visible copy keyword density between two and three percent", () => {
    const densityReports = (["en", "zh-CN"] as const).map((locale) => {
      const localizedCopy = getRiverFarmPageCopy(locale);
      const bodyText = getRiverFarmBodyText(localizedCopy);
      const wordCount = countRiverFarmWords(bodyText, locale);
      const keywordMentions = countRiverFarmKeywordMentions(bodyText, locale);
      if (wordCount <= 0) {
        throw new Error(
          `River Farm keyword density for ${locale} received ${wordCount} words.`,
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
        `River Farm keyword density must stay between 2% and 3%. Received ${densitySummary}.`,
      );
    }
  });

  it("matches seven case paths to Riverland public projects and image files", () => {
    const englishCopy = getRiverFarmPageCopy("en");
    const chineseCopy = getRiverFarmPageCopy("zh-CN");

    for (const [caseIndex, stem] of riverFarmLayoutStems.entries()) {
      const caseId = expectedRiverFarmCaseIds[caseIndex];
      if (caseId === undefined || !isRiverFarmCaseId(caseId)) {
        throw new Error(
          `Missing expected River Farm case id at index ${caseIndex}. Received ${String(caseId)}.`,
        );
      }

      const englishCase = englishCopy.cases[caseIndex];
      const chineseCase = chineseCopy.cases[caseIndex];
      if (englishCase === undefined || chineseCase === undefined) {
        throw new Error(
          `Missing localized River Farm case at index ${caseIndex} for ${caseId}.`,
        );
      }

      expect(englishCase.id).toBe(caseId);
      expect(chineseCase.id).toBe(caseId);
      expect(englishCase.imageSrc).toBe(`/farm-layouts/river/images/${stem}.webp`);
      expect(englishCase.imageSrc.replace(/\.webp$/u, ".avif")).toBe(
        `/farm-layouts/river/images/${stem}.avif`,
      );
      expect(englishCase.imageOriginalSrc).toBe(
        `/farm-layouts/river/images/${stem}-full.webp`,
      );
      expect(englishCase.projectHref).toBe(
        `/farm-layouts/river/projects/${stem}.json`,
      );
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(1600);
      expect(englishCase.imageHeight).toBe(1300);
      expect(chineseCase.imageWidth).toBe(1600);
      expect(chineseCase.imageHeight).toBe(1300);
      expect(englishCase.imageAlt.trim()).not.toBe("");
      expect(chineseCase.imageAlt.trim()).not.toBe("");
      expect(chineseCase.imageAlt).not.toBe(englishCase.imageAlt);
      expect(chineseCase.title).not.toBe(englishCase.title);
      expect(chineseCase.summary).not.toBe(englishCase.summary);
      expect(englishCase.summary.toLowerCase()).toContain(
        expectedFishPondPhraseByCaseId.en[caseId].toLowerCase(),
      );
      expect(chineseCase.summary).toContain(
        expectedFishPondPhraseByCaseId["zh-CN"][caseId],
      );

      const publicImages = readRiverFarmPublicImages(stem);
      expect(publicImages.previewImagePath).toBe(
        join(process.cwd(), "public", englishCase.imageSrc.slice(1)),
      );
      expect(publicImages.fullImagePath).toBe(
        join(process.cwd(), "public", englishCase.imageOriginalSrc.slice(1)),
      );
      expect(publicImages.avifImagePath).toBe(
        join(
          process.cwd(),
          "public",
          englishCase.imageSrc.replace(/\.webp$/u, ".avif").slice(1),
        ),
      );
      expect(
        getWebpDimensions(
          publicImages.previewImageBytes,
          publicImages.previewImagePath,
        ),
      ).toEqual({
        width: 1600,
        height: 1300,
      });
      expect(
        getWebpDimensions(
          publicImages.fullImageBytes,
          publicImages.fullImagePath,
        ),
      ).toEqual({
        width: 2560,
        height: 2080,
      });
      expect(
        getAvifDimensions(
          publicImages.avifImageBytes,
          publicImages.avifImagePath,
        ),
      ).toEqual({
        width: 1600,
        height: 1300,
      });
      expect(statSync(publicImages.previewImagePath).size).toBeGreaterThan(0);
      expect(statSync(publicImages.fullImagePath).size).toBeGreaterThan(0);
      expect(statSync(publicImages.avifImagePath).size).toBeGreaterThan(0);

      const publicProjectPath = join(
        riverFarmPublicRoot,
        "projects",
        `${stem}.json`,
      );
      expect(
        join(process.cwd(), "public", englishCase.projectHref.slice(1)),
      ).toBe(publicProjectPath);
      const riverFarmMap = readRiverFarmPublicProjectMap(stem);
      expect(riverFarmMap.mapFile).toBe("Farm_Fishing.tmx");
      expect(riverFarmMap.label).toBe("Riverland Farm");
      if (!Object.hasOwn(riverFarmMap.state, "items")) {
        throw new Error(`Missing state.items in ${stem}.`);
      }
      if (Object.hasOwn(riverFarmMap.state, "placedItems")) {
        throw new Error(
          `Unexpected state.placedItems in ${stem}; items belong in state.items.`,
        );
      }
      if (!Array.isArray(riverFarmMap.state.items)) {
        throw new Error(
          `state.items in ${stem} must be an array; received ${JSON.stringify(riverFarmMap.state.items)}.`,
        );
      }

      const fishPondCount = countFishPonds(riverFarmMap.state.buildings, stem);
      expect(fishPondCount).toBe(expectedFishPondCountByCaseId[caseId]);
    }

    const coverImage = getRiverFarmImages(
      englishCopy.cover,
      englishCopy.cases,
    )[0];
    if (coverImage === undefined) {
      throw new Error("Missing River Farm cover image.");
    }
    expect(coverImage.imageSrc).toBe(englishCopy.cases[0]?.imageSrc);
    expect(coverImage.id).toBe("cover");
  });
});
