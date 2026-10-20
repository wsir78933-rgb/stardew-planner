import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  fishFarmCanonicalPath,
  getFeaturedFishFarmCase,
  getFishFarmPageCopy,
} from "../../src/farm-layouts/fish-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");
const expectedFishFarmCaseIds = [
  "roe-pond-grid",
  "island-zones",
  "fishing-village",
  "central-crop-island",
  "southwest-livestock",
  "riverside-retreat",
] as const;
const expectedFishFarmProjectTitles = [
  "Roe Empire",
  "Island Zones",
  "Fishing Village",
  "Big Island Crops",
  "River Ranch",
  "Scenic River",
] as const;

function resolvePublicAsset(publicPath: string): string {
  if (!publicPath.startsWith("/") || publicPath.startsWith("//")) {
    throw new Error(
      `Fish Farm public asset path must start with one slash. Received: ${JSON.stringify(publicPath)}.`,
    );
  }

  const relativeAssetPath = publicPath.slice(1);
  if (relativeAssetPath.split("/").includes("..")) {
    throw new Error(
      `Fish Farm public asset path must stay inside public/. Received: ${JSON.stringify(publicPath)}.`,
    );
  }

  return resolve(projectRoot, "public", relativeAssetPath);
}

function readPngDimensions(imageBytes: Buffer, imagePath: string) {
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!imageBytes.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error(
      `Fish Farm original image must contain a PNG signature. Received: ${JSON.stringify(imagePath)}.`,
    );
  }
  if (imageBytes.length < 24 || imageBytes.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(
      `Fish Farm PNG image is missing a complete IHDR header. Received: ${JSON.stringify(imagePath)}.`,
    );
  }

  return {
    width: imageBytes.readUInt32BE(16),
    height: imageBytes.readUInt32BE(20),
  };
}

describe("Fish Farm page content and project files", () => {
  it("provides complete English and Simplified Chinese page copy", () => {
    const englishCopy = getFishFarmPageCopy("en");
    const chineseCopy = getFishFarmPageCopy("zh-CN");

    expect(fishFarmCanonicalPath).toBe("/stardew-valley-fish-farm-layout");
    expect(englishCopy.title.trim()).not.toBe("");
    expect(chineseCopy.title.trim()).not.toBe("");
    expect(englishCopy.description.trim()).not.toBe("");
    expect(chineseCopy.description.trim()).not.toBe("");
    expect(englishCopy.intro.trim()).not.toBe("");
    expect(chineseCopy.intro.trim()).not.toBe("");

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.whatIsHeading.trim()).not.toBe("");
      expect(localizedCopy.whatIsParagraphs).toHaveLength(2);
      expect(localizedCopy.whatIsParagraphs.every((paragraph) => paragraph.trim() !== "")).toBe(true);
      expect(localizedCopy.howToHeading.trim()).not.toBe("");
      expect(localizedCopy.howToSteps.map((step) => step.number)).toEqual(["01", "02", "03"]);
      expect(
        localizedCopy.howToSteps.every(
          (step) => step.title.trim() !== "" && step.body.trim() !== "",
        ),
      ).toBe(true);
      expect(localizedCopy.faqHeading.trim()).not.toBe("");
      expect(localizedCopy.faqDescription.trim()).not.toBe("");
      expect(localizedCopy.faqs.length).toBeGreaterThan(0);
      expect(
        localizedCopy.faqs.every(
          (faq) => faq.question.trim() !== "" && faq.answer.trim() !== "",
        ),
      ).toBe(true);
    }

    expect(chineseCopy.whatIsHeading).not.toBe(englishCopy.whatIsHeading);
    expect(chineseCopy.howToHeading).not.toBe(englishCopy.howToHeading);
    expect(chineseCopy.faqHeading).not.toBe(englishCopy.faqHeading);
  });

  it("keeps the six case identifiers in order and features case 02 in both locales", () => {
    const englishCopy = getFishFarmPageCopy("en");
    const chineseCopy = getFishFarmPageCopy("zh-CN");
    const englishFeaturedCase = getFeaturedFishFarmCase("en");
    const chineseFeaturedCase = getFeaturedFishFarmCase("zh-CN");

    expect(englishCopy.cases.map((farmCase) => farmCase.id)).toEqual(expectedFishFarmCaseIds);
    expect(chineseCopy.cases.map((farmCase) => farmCase.id)).toEqual(expectedFishFarmCaseIds);
    expect(englishFeaturedCase.id).toBe("island-zones");
    expect(chineseFeaturedCase.id).toBe("island-zones");
    expect(englishFeaturedCase.imageSrc).toBe(englishCopy.cases[1]?.imageSrc);
    expect(chineseFeaturedCase.imageSrc).toBe(chineseCopy.cases[1]?.imageSrc);
    expect(englishFeaturedCase.projectHref).toBe(englishCopy.cases[1]?.projectHref);
    expect(chineseFeaturedCase.projectHref).toBe(chineseCopy.cases[1]?.projectHref);
    expect(new Set(englishCopy.cases.map((farmCase) => farmCase.projectHref)).size).toBe(6);

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      expect(chineseCase).toBeDefined();
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(2560);
      expect(englishCase.imageHeight).toBe(2080);
      expect(chineseCase.imageWidth).toBe(englishCase.imageWidth);
      expect(chineseCase.imageHeight).toBe(englishCase.imageHeight);

      const expectedProjectNumber = String(caseIndex + 1).padStart(2, "0");
      expect(englishCase.projectHref).toBe(
        `/farm-layouts/fish/projects/stardew-valley-fish-farm-layout-${expectedProjectNumber}.json`,
      );
      const optimizedImagePath = resolvePublicAsset(englishCase.imageSrc);
      const originalImagePath = resolvePublicAsset(englishCase.imageOriginalSrc);
      const avifImagePath = resolvePublicAsset(englishCase.imageSrc.replace(/\.webp$/, ".avif"));
      const projectJsonPath = resolvePublicAsset(englishCase.projectHref);
      const optimizedImageBytes = readFileSync(optimizedImagePath);
      const originalImageBytes = readFileSync(originalImagePath);
      const avifImageBytes = readFileSync(avifImagePath);

      expect(englishCase.imageSrc.endsWith(".webp")).toBe(true);
      expect(englishCase.imageOriginalSrc.endsWith(".png")).toBe(true);
      expect(englishCase.projectHref.endsWith(".json")).toBe(true);
      expect(statSync(optimizedImagePath).size).toBeGreaterThan(0);
      expect(statSync(originalImagePath).size).toBeGreaterThan(0);
      expect(statSync(avifImagePath).size).toBeGreaterThan(0);
      expect(optimizedImageBytes.toString("ascii", 0, 4)).toBe("RIFF");
      expect(optimizedImageBytes.toString("ascii", 8, 12)).toBe("WEBP");
      expect(avifImageBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(readPngDimensions(originalImageBytes, originalImagePath)).toEqual({
        width: 2560,
        height: 2080,
      });
      expect(englishCase.imageWidth).toBe(2560);
      expect(englishCase.imageHeight).toBe(2080);

      const serializedProjectDocument = readFileSync(projectJsonPath, "utf8");
      const parsedProjectDocument = parseReferenceProjectDocument(serializedProjectDocument);
      const validatedProjectDocument = validateReferenceProjectDocument(
        JSON.parse(serializedProjectDocument) as unknown,
      );

      expect(parsedProjectDocument).toEqual(validatedProjectDocument);
      expect(validatedProjectDocument.projects).toHaveLength(1);
      expect(validatedProjectDocument.projects[0]?.project.projectName).toBe(
        expectedFishFarmProjectTitles[caseIndex],
      );
      expect(validatedProjectDocument.projects[0]?.project.maps).toHaveLength(1);
      expect(validatedProjectDocument.projects[0]?.project.maps[0]?.mapFile).toBe(
        "Farm_Fishing.tmx",
      );
    }
  });
});
