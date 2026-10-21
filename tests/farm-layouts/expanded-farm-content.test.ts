import { readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  expandedFarmCanonicalPath,
  getExpandedFarmPageCopy,
  getFeaturedExpandedFarmCase,
} from "../../src/farm-layouts/expanded-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedExpandedFarmCaseIds = [
  "if2r-clover-crop-hub",
  "grandpas-naturalistic-forest",
  "if2r-functional-blend",
  "grandpas-dense-industrial",
  "grandpas-purple-symmetrical",
  "grandpas-winery-spiral-honey",
  "grandpas-summer-fish-battery",
] as const;

const expectedExpandedFarmImageDimensionsById = {
  "if2r-clover-crop-hub": { width: 3200, height: 3062 },
  "grandpas-naturalistic-forest": { width: 3200, height: 2125 },
  "if2r-functional-blend": { width: 3200, height: 3062 },
  "grandpas-dense-industrial": { width: 3200, height: 2125 },
  "grandpas-purple-symmetrical": { width: 3200, height: 2125 },
  "grandpas-winery-spiral-honey": { width: 3200, height: 2125 },
  "grandpas-summer-fish-battery": { width: 3200, height: 2125 },
} as const;
const expectedExpandedFarmMapFiles = [
  "IF2R.tmx",
  "GrandpasFarm.tmx",
  "IF2R.tmx",
  "GrandpasFarm.tmx",
  "GrandpasFarm.tmx",
  "GrandpasFarm.tmx",
  "GrandpasFarm.tmx",
] as const;

function resolvePublicAsset(publicPath: string): string {
  if (
    !publicPath.startsWith("/") ||
    publicPath.startsWith("//") ||
    publicPath.split("/").includes("..")
  ) {
    throw new Error(
      `Expanded Farm public asset path must stay inside public/. Received: ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(projectRoot, "public", publicPath.slice(1));
}

describe("Expanded Farm page content and project assets", () => {
  it("keeps seven bilingual layouts in source order and features case 01", () => {
    const englishCopy = getExpandedFarmPageCopy("en");
    const chineseCopy = getExpandedFarmPageCopy("zh-CN");
    const englishFeaturedCase = getFeaturedExpandedFarmCase("en");
    const chineseFeaturedCase = getFeaturedExpandedFarmCase("zh-CN");

    expect(expandedFarmCanonicalPath).toBe(
      "/stardew-valley-expanded-farm-layout",
    );
    expect(englishCopy.cases.map(({ id }) => id)).toEqual(
      expectedExpandedFarmCaseIds,
    );
    expect(chineseCopy.cases.map(({ id }) => id)).toEqual(
      expectedExpandedFarmCaseIds,
    );
    expect(new Set(englishCopy.cases.map(({ projectHref }) => projectHref)).size)
      .toBe(7);
    expect(
      new Set(englishCopy.cases.map(({ imageOriginalSrc }) => imageOriginalSrc)).size,
    ).toBe(7);
    expect(englishFeaturedCase.id).toBe("if2r-clover-crop-hub");
    expect(chineseFeaturedCase.id).toBe("if2r-clover-crop-hub");
    expect(englishFeaturedCase).toMatchObject(englishCopy.cases[0]);
    expect(chineseFeaturedCase).toMatchObject(chineseCopy.cases[0]);
    expect(chineseCopy.title).not.toBe(englishCopy.title);
    expect(chineseCopy.description).not.toBe(englishCopy.description);

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.title.trim()).not.toBe("");
      expect(localizedCopy.metaTitle.trim()).not.toBe("");
      expect(localizedCopy.description.trim()).not.toBe("");
      expect(localizedCopy.intro.trim()).not.toBe("");
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(localizedCopy.howToSteps).toHaveLength(3);
      expect(localizedCopy.faqs.length).toBeGreaterThan(0);
      expect(
        localizedCopy.cases.every(
          ({ title, summary, imageAlt }) =>
            title.trim() !== "" && summary.trim() !== "" && imageAlt.trim() !== "",
        ),
      ).toBe(true);
    }

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      if (chineseCase === undefined) {
        throw new Error(
          `Missing Simplified Chinese Expanded Farm case at index ${caseIndex} for id ${englishCase.id}.`,
        );
      }

      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
    }
  });

  it("serves each original image and validates its matching planner project", () => {
    const englishCopy = getExpandedFarmPageCopy("en");

    for (const [caseIndex, farmCase] of englishCopy.cases.entries()) {
      const expectedDimensions =
        expectedExpandedFarmImageDimensionsById[
          farmCase.id as keyof typeof expectedExpandedFarmImageDimensionsById
        ];
      if (expectedDimensions === undefined) {
        throw new Error(
          `Missing verified Expanded Farm image dimensions for case ${JSON.stringify(farmCase.id)}.`,
        );
      }

      expect(farmCase.imageOriginalSrc.endsWith(".jpg")).toBe(true);
      expect(farmCase.imageSrc.endsWith(".webp")).toBe(true);
      expect(farmCase.projectHref.endsWith(".json")).toBe(true);
      expect(farmCase.imageWidth).toBe(expectedDimensions.width);
      expect(farmCase.imageHeight).toBe(expectedDimensions.height);
      expect(
        basename(farmCase.imageOriginalSrc, extname(farmCase.imageOriginalSrc)),
      ).toBe(basename(farmCase.projectHref, extname(farmCase.projectHref)));

      const originalImagePath = resolvePublicAsset(farmCase.imageOriginalSrc);
      const previewImagePath = resolvePublicAsset(farmCase.imageSrc);
      const avifImagePath = resolvePublicAsset(
        farmCase.imageSrc.replace(/\.webp$/u, ".avif"),
      );
      const projectJsonPath = resolvePublicAsset(farmCase.projectHref);
      const originalImageBytes = readFileSync(originalImagePath);
      const previewImageBytes = readFileSync(previewImagePath);
      const avifImageBytes = readFileSync(avifImagePath);
      const serializedProjectDocument = readFileSync(projectJsonPath, "utf8");
      const parsedProjectDocument = parseReferenceProjectDocument(
        serializedProjectDocument,
      );
      const validatedProjectDocument = validateReferenceProjectDocument(
        JSON.parse(serializedProjectDocument) as unknown,
      );

      expect(originalImageBytes.length).toBeGreaterThan(3);
      expect(originalImageBytes.subarray(0, 3)).toEqual(
        Buffer.from([0xff, 0xd8, 0xff]),
      );
      expect(previewImageBytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
      expect(previewImageBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(avifImageBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(parsedProjectDocument).toEqual(validatedProjectDocument);
      expect(validatedProjectDocument.projects).toHaveLength(1);
      expect(validatedProjectDocument.projects[0]?.title.trim()).not.toBe("");
      const projectMaps = validatedProjectDocument.projects[0]?.project.maps;
      expect(projectMaps).toHaveLength(1);
      expect(projectMaps?.[0]?.mapFile).toBe(
        expectedExpandedFarmMapFiles[caseIndex],
      );
      expect(validatedProjectDocument.projects[0]?.project.activeMapId).toBe(
        projectMaps?.[0]?.id,
      );
    }
  });

  it("rejects unsupported locales with the received value", () => {
    expect(() => getExpandedFarmPageCopy("fr" as never)).toThrow("fr");
    expect(() => getFeaturedExpandedFarmCase("fr" as never)).toThrow("fr");
  });
});
