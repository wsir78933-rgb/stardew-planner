import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getBeachFarmPageCopy } from "../../src/farm-layouts/beach-farm-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "../../src/reference-runtime/local-project-api";

const projectRoot = resolve(import.meta.dirname, "../..");

describe("Beach Farm page content and projects", () => {
  it("provides localized What is copy instead of a case navigation label", () => {
    const englishCopy = getBeachFarmPageCopy("en");
    const chineseCopy = getBeachFarmPageCopy("zh-CN");

    expect("caseNavigationLabel" in englishCopy).toBe(false);
    expect("caseNavigationLabel" in chineseCopy).toBe(false);
    expect(englishCopy.whatIsHeading).toBe("What is a Beach Farm layout?");
    expect(chineseCopy.whatIsHeading).toBe("什么是海滩农场布局？");
    expect(englishCopy.whatIsParagraphs).toHaveLength(2);
    expect(chineseCopy.whatIsParagraphs).toHaveLength(2);
    expect(
      englishCopy.whatIsParagraphs.every((paragraph) => paragraph.trim() !== ""),
    ).toBe(true);
    expect(
      chineseCopy.whatIsParagraphs.every((paragraph) => paragraph.trim() !== ""),
    ).toBe(true);
  });

  it("provides three numbered how-to steps and FAQ introductions in both locales", () => {
    const englishCopy = getBeachFarmPageCopy("en");
    const chineseCopy = getBeachFarmPageCopy("zh-CN");
    const expectedStepNumbers = ["01", "02", "03"];

    for (const localizedCopy of [englishCopy, chineseCopy]) {
      expect(localizedCopy.howToHeading.trim()).not.toBe("");
      expect(localizedCopy.howToEyebrow.trim()).not.toBe("");
      expect(localizedCopy.howToSteps).toHaveLength(3);
      expect(localizedCopy.howToSteps.map((step) => step.number)).toEqual(
        expectedStepNumbers,
      );
      expect(
        localizedCopy.howToSteps.every(
          (step) => step.title.trim() !== "" && step.body.trim() !== "",
        ),
      ).toBe(true);
      expect(localizedCopy.faqEyebrow.trim()).not.toBe("");
      expect(localizedCopy.faqHeading.trim()).not.toBe("");
      expect(localizedCopy.faqDescription.trim()).not.toBe("");
    }

    expect(englishCopy.howToSteps[1]?.body).toContain("Library");
    expect(chineseCopy.howToSteps[1]?.body).toContain("本地项目");
    expect(chineseCopy.howToSteps[1]?.body).toContain("导入 JSON");
  });

  it("keeps nine localized cases aligned and supplies each full-size image and download", () => {
    const englishCopy = getBeachFarmPageCopy("en");
    const chineseCopy = getBeachFarmPageCopy("zh-CN");

    expect(englishCopy.cases).toHaveLength(9);
    expect(chineseCopy.cases.map((farmCase) => farmCase.id)).toEqual(
      englishCopy.cases.map((farmCase) => farmCase.id),
    );

    for (const [caseIndex, englishCase] of englishCopy.cases.entries()) {
      const chineseCase = chineseCopy.cases[caseIndex];
      expect(chineseCase).toBeDefined();
      expect(chineseCase.imageSrc).toBe(englishCase.imageSrc);
      expect(chineseCase.imageOriginalSrc).toBe(englishCase.imageOriginalSrc);
      expect(chineseCase.projectHref).toBe(englishCase.projectHref);
      expect(englishCase.imageWidth).toBe(1600);
      expect(englishCase.imageHeight).toBe(1600);
      expect(chineseCase.imageWidth).toBe(englishCase.imageWidth);
      expect(chineseCase.imageHeight).toBe(englishCase.imageHeight);

      const relativeImagePath = englishCase.imageSrc.slice(1);
      const relativeOriginalImagePath = englishCase.imageOriginalSrc.slice(1);
      const relativeAvifPath = relativeImagePath.replace(/\.webp$/, ".avif");
      const relativeProjectPath = englishCase.projectHref.slice(1);
      const imageBytes = readFileSync(
        resolve(projectRoot, "public", relativeImagePath),
      );
      const originalImageBytes = readFileSync(
        resolve(projectRoot, "public", relativeOriginalImagePath),
      );
      const avifBytes = readFileSync(
        resolve(projectRoot, "public", relativeAvifPath),
      );

      expect(imageBytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
      expect(originalImageBytes.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
      expect(avifBytes.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(
        statSync(resolve(projectRoot, "public", relativeImagePath)).size,
      ).toBeGreaterThan(0);
      expect(
        statSync(resolve(projectRoot, "public", relativeOriginalImagePath)).size,
      ).toBeGreaterThan(0);
      expect(
        statSync(resolve(projectRoot, "public", relativeAvifPath)).size,
      ).toBeGreaterThan(0);
      expect(
        existsSync(resolve(projectRoot, "public", relativeProjectPath)),
      ).toBe(true);

      const serializedProjectDocument = readFileSync(
        resolve(projectRoot, "public", relativeProjectPath),
        "utf8",
      );
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
        "Farm_Island.tmx",
      );
      expect(validatedProjectDocument.projects[0].project.maps[0].label).toBe(
        "Beach Farm",
      );
    }
  });
});
