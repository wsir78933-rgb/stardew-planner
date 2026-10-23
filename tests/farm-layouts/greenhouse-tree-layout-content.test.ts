import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getGreenhouseTreeLayoutPageCopy,
  greenhouseTreeLayoutCanonicalPath,
  type GreenhouseTreeLayoutPageCopy,
} from "../../src/farm-layouts/greenhouse-tree-layout-content";
import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
  type ReferenceLocalProjectDocument,
  type ReferenceProjectMap,
  type ReferenceStoredProject,
} from "../../src/reference-runtime/local-project-api";

const greenhouseTreeLayoutCaseStems = [
  "02-fruit-tree-layout-greenhouse-stardew",
  "03-stardew-greenhouse-tree-layout-seasonal",
  "04-stardew-greenhouse-tree-layout-mature-ring",
  "05-stardew-greenhouse-tree-layout-planting-order",
  "06-stardew-greenhouse-tree-layout-spring",
  "07-fruit-tree-layout-greenhouse-stardew-fall",
] as const;

const greenhouseTreeLayoutProjectDirectory = join(
  process.cwd(),
  "public",
  "farm-layouts",
  "greenhouse-tree",
  "projects",
);

const greenhouseTreeLayoutExpectedProjects = [
  {
    stem: greenhouseTreeLayoutCaseStems[0],
    season: "summer",
    treeCounts: {
      fruittree_628: 3,
      fruittree_629: 3,
      fruittree_630: 3,
      fruittree_631: 3,
      fruittree_632: 3,
      fruittree_633: 3,
    },
    cropCounts: { "crop:486": 116 },
    sprinklerCounts: { "object:621": 12, "object:645": 4 },
  },
  {
    stem: greenhouseTreeLayoutCaseStems[1],
    season: "summer",
    treeCounts: {
      fruittree_628: 3,
      fruittree_629: 3,
      fruittree_630: 2,
      fruittree_631: 2,
      fruittree_632: 2,
      fruittree_633: 2,
    },
    cropCounts: { "crop:481": 116 },
    sprinklerCounts: { "object:621": 12, "object:645": 4 },
  },
  {
    stem: greenhouseTreeLayoutCaseStems[2],
    season: "summer",
    treeCounts: { fruittree_835: 5, fruittree_69: 4 },
    cropCounts: { "crop:499": 111 },
    sprinklerCounts: { "object:645": 4 },
  },
  {
    stem: greenhouseTreeLayoutCaseStems[3],
    season: "summer",
    treeCounts: { fruittree_69: 14, fruittree_835: 4 },
    cropCounts: { "crop:499": 119 },
    sprinklerCounts: { "object:645": 6 },
  },
  {
    stem: greenhouseTreeLayoutCaseStems[4],
    season: "summer",
    treeCounts: {
      fruittree_628: 2,
      fruittree_629: 2,
      fruittree_630: 2,
      fruittree_631: 2,
      fruittree_632: 2,
      fruittree_633: 2,
    },
    cropCounts: { "crop:479": 58, "crop:493": 58 },
    sprinklerCounts: { "object:645": 6 },
  },
  {
    stem: greenhouseTreeLayoutCaseStems[5],
    season: "fall",
    treeCounts: {
      fruittree_628: 3,
      fruittree_629: 3,
      fruittree_630: 2,
      fruittree_631: 2,
      fruittree_632: 2,
      fruittree_633: 2,
      fruittree_69: 2,
      fruittree_835: 2,
    },
    cropCounts: { "crop:488": 57, "crop:493": 57 },
    sprinklerCounts: { "object:645": 6 },
  },
] as const;

function getVisibleGreenhouseTreeLayoutText(
  copy: GreenhouseTreeLayoutPageCopy,
): string {
  return [
    copy.title,
    copy.intro,
    copy.categoryLabel,
    copy.browseLabel,
    copy.openPlannerLabel,
    copy.openPlannerLabel,
    copy.casesHeading,
    copy.casesDescription,
    copy.cover.caption,
    ...copy.cases.flatMap((layoutCase) => [
      layoutCase.title,
      layoutCase.summary,
      copy.downloadProjectLabel,
    ]),
    copy.whatIsHeading,
    ...copy.whatIsParagraphs,
    copy.howToEyebrow,
    copy.howToHeading,
    ...copy.howToSteps.flatMap((step) => [
      step.number,
      step.title,
      step.body,
    ]),
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

function countGreenhouseTreeLayoutKeywordMentions(
  visibleText: string,
  locale: "en" | "zh-CN",
): number {
  if (locale === "en") {
    return [...visibleText.matchAll(/\bstardew greenhouse tree layout\b/giu)]
      .length;
  }

  return visibleText.split("星露谷物语温室果树布局").length - 1;
}

function countVisibleGreenhouseTreeLayoutWords(
  visibleText: string,
  locale: "en" | "zh-CN",
): number {
  return [
    ...new Intl.Segmenter(locale, { granularity: "word" }).segment(visibleText),
  ].filter((segment) => segment.isWordLike).length;
}

function expectGreenhouseTreeLayoutKeywordDensity(
  copy: GreenhouseTreeLayoutPageCopy,
  locale: "en" | "zh-CN",
): void {
  const visibleText = getVisibleGreenhouseTreeLayoutText(copy);
  const keywordMentions = countGreenhouseTreeLayoutKeywordMentions(
    visibleText,
    locale,
  );
  const visibleWordCount = countVisibleGreenhouseTreeLayoutWords(
    visibleText,
    locale,
  );
  const densityPercent = (keywordMentions / visibleWordCount) * 100;

  if (densityPercent < 2 || densityPercent > 3) {
    throw new Error(
      `Greenhouse Tree Layout keyword density for ${locale} must be 2% to 3%; received ${keywordMentions}/${visibleWordCount} = ${densityPercent.toFixed(4)}%.`,
    );
  }
}

function requireReferenceProjectRecords(
  value: ReferenceJsonValue | undefined,
  fieldPath: string,
): readonly Record<string, ReferenceJsonValue>[] {
  if (!Array.isArray(value)) {
    throw new Error(
      `Greenhouse project ${fieldPath} must be an array; received ${JSON.stringify(value)}.`,
    );
  }

  return value.map((recordValue, recordIndex) => {
    if (
      recordValue === null
      || typeof recordValue !== "object"
      || Array.isArray(recordValue)
    ) {
      throw new Error(
        `Greenhouse project ${fieldPath}[${recordIndex}] must be an object; received ${JSON.stringify(recordValue)}.`,
      );
    }

    return recordValue;
  });
}

function requireReferenceProjectString(
  record: Record<string, ReferenceJsonValue>,
  fieldName: string,
  recordPath: string,
): string {
  const fieldValue = record[fieldName];
  if (typeof fieldValue !== "string" || fieldValue.length === 0) {
    throw new Error(
      `Greenhouse project ${recordPath}.${fieldName} must be a non-empty string; received ${JSON.stringify(fieldValue)}.`,
    );
  }

  return fieldValue;
}

function countReferenceProjectRecordsByStringField(
  records: readonly Record<string, ReferenceJsonValue>[],
  fieldName: string,
  recordsPath: string,
): Readonly<Record<string, number>> {
  const recordCounts: Record<string, number> = {};

  for (const [recordIndex, record] of records.entries()) {
    const fieldValue = requireReferenceProjectString(
      record,
      fieldName,
      `${recordsPath}[${recordIndex}]`,
    );
    recordCounts[fieldValue] = (recordCounts[fieldValue] ?? 0) + 1;
  }

  return recordCounts;
}

function requireSingleGreenhouseTreeLayoutProject(
  projectDocument: ReferenceLocalProjectDocument,
  projectPath: string,
): ReferenceStoredProject {
  if (projectDocument.projects.length !== 1) {
    throw new Error(
      `Greenhouse project ${projectPath} must contain one project; received ${projectDocument.projects.length}.`,
    );
  }

  const storedProject = projectDocument.projects[0];
  if (storedProject === undefined) {
    throw new Error(
      `Greenhouse project ${projectPath} is missing projects[0].`,
    );
  }

  return storedProject;
}

function requireSingleGreenhouseTreeLayoutMap(
  storedProject: ReferenceStoredProject,
  projectPath: string,
): ReferenceProjectMap {
  if (storedProject.project.maps.length !== 1) {
    throw new Error(
      `Greenhouse project ${projectPath} must contain one map; received ${storedProject.project.maps.length}.`,
    );
  }

  const projectMap = storedProject.project.maps[0];
  if (projectMap === undefined) {
    throw new Error(`Greenhouse project ${projectPath} is missing maps[0].`);
  }

  return projectMap;
}

function readGreenhouseTreeLayoutProjectMap(
  stem: string,
): Readonly<{ projectMap: ReferenceProjectMap; projectPath: string }> {
  const projectPath = join(greenhouseTreeLayoutProjectDirectory, `${stem}.json`);
  if (!existsSync(projectPath)) {
    throw new Error(`Missing greenhouse tree layout project at ${projectPath}.`);
  }

  const serializedProject = readFileSync(projectPath, "utf8");
  const parsedProjectDocument = parseReferenceProjectDocument(serializedProject);
  const validatedProjectDocument = validateReferenceProjectDocument(
    JSON.parse(serializedProject) as unknown,
  );
  expect(parsedProjectDocument).toEqual(validatedProjectDocument);

  const storedProject = requireSingleGreenhouseTreeLayoutProject(
    validatedProjectDocument,
    projectPath,
  );
  return {
    projectMap: requireSingleGreenhouseTreeLayoutMap(storedProject, projectPath),
    projectPath,
  };
}

describe("greenhouse tree layout page copy", () => {
  it("exports the greenhouse category, one cover, and six downloadable cases", () => {
    expect(greenhouseTreeLayoutCanonicalPath).toBe(
      "/stardew-greenhouse-tree-layout",
    );

    for (const locale of ["en", "zh-CN"] as const) {
      const copy = getGreenhouseTreeLayoutPageCopy(locale);
      expect(copy.categoryLabel).toBe(
        locale === "en" ? "Greenhouse Layouts" : "温室布局",
      );
      expect(copy.cover.imageSrc).toBe(
        "/farm-layouts/greenhouse-tree/images/01-stardew-greenhouse-tree-layout.webp",
      );
      expect(copy.cover.imageOriginalSrc).toBe(copy.cover.imageSrc);
      expect(copy.cover.imageWidth).toBe(640);
      expect(copy.cover.imageHeight).toBe(768);
      expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
        greenhouseTreeLayoutCaseStems,
      );
      expect(copy.cases).toHaveLength(6);
      expect(copy.whatIsParagraphs).toHaveLength(2);
      expect(copy.howToSteps).toHaveLength(3);
      expect(copy.faqs).toHaveLength(5);

      for (const layoutCase of copy.cases) {
        expect(layoutCase.imageSrc).toBe(
          `/farm-layouts/greenhouse-tree/images/${layoutCase.id}.webp`,
        );
        expect(layoutCase.imageOriginalSrc).toBe(layoutCase.imageSrc);
        expect(layoutCase.projectHref).toBe(
          `/farm-layouts/greenhouse-tree/projects/${layoutCase.id}.json`,
        );
        expect(layoutCase.imageWidth).toBe(640);
        expect(layoutCase.imageHeight).toBe(768);
      }
    }
  });

  it("keeps the exact English and Chinese focus keyword density within 2% to 3%", () => {
    expectGreenhouseTreeLayoutKeywordDensity(
      getGreenhouseTreeLayoutPageCopy("en"),
      "en",
    );
    expectGreenhouseTreeLayoutKeywordDensity(
      getGreenhouseTreeLayoutPageCopy("zh-CN"),
      "zh-CN",
    );
  });

  it("matches all six case descriptions to the actual Greenhouse project files", () => {
    for (const expectedProject of greenhouseTreeLayoutExpectedProjects) {
      const { projectMap, projectPath } = readGreenhouseTreeLayoutProjectMap(
        expectedProject.stem,
      );
      expect(projectMap.mapFile).toBe("Greenhouse.tmx");
      expect(projectMap.season).toBe(expectedProject.season);

      const projectItemRecords = requireReferenceProjectRecords(
        projectMap.state.items,
        "state.items",
      );
      const fruitTreeCounts = countReferenceProjectRecordsByStringField(
        projectItemRecords.filter((itemRecord, itemIndex) => {
          const itemId = requireReferenceProjectString(
            itemRecord,
            "itemId",
            `state.items[${itemIndex}]`,
          );
          return itemId.startsWith("fruittree_");
        }),
        "itemId",
        "state.items",
      );
      const sprinklerCounts = countReferenceProjectRecordsByStringField(
        projectItemRecords.filter((itemRecord, itemIndex) => {
          const itemId = requireReferenceProjectString(
            itemRecord,
            "itemId",
            `state.items[${itemIndex}]`,
          );
          return itemId === "object:621" || itemId === "object:645";
        }),
        "itemId",
        "state.items",
      );
      const cropCounts = countReferenceProjectRecordsByStringField(
        requireReferenceProjectRecords(projectMap.state.crops, "state.crops"),
        "cropId",
        "state.crops",
      );

      expect(fruitTreeCounts, projectPath).toEqual(expectedProject.treeCounts);
      expect(cropCounts, projectPath).toEqual(expectedProject.cropCounts);
      expect(sprinklerCounts, projectPath).toEqual(
        expectedProject.sprinklerCounts,
      );
    }
  });
});
