import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProcessingToolRouteCopy } from "../../src/i18n/processing-tool-route-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  getProcessingToolDefinition,
  getProcessingToolHref,
  PROCESSING_TOOL_IDS,
  type ProcessingToolId,
} from "../../src/tools-pages/processing/processing-tool-definition";

const expectedEnglishCopy: Readonly<
  Record<
    ProcessingToolId,
    Readonly<{
      title: string;
      description: string;
      heroHeading: string;
      actionLabel: string;
    }>
  >
> = {
  "basic-processing-profit": {
    title: "Stardew Valley Profit Calculator — Raw vs Artisan Goods",
    description:
      "Use this Stardew Valley profit calculator to compare artisan goods profit across Kegs, Jars and Dehydrators against selling the same ingredients raw.",
    heroHeading: "Stardew Valley Profit Calculator",
    actionLabel: "Compare processing profit",
  },
  "machine-comparison": {
    title: "Stardew Valley Keg vs Jar vs Dehydrator Calculator",
    description:
      "Compare your crop stack with this Stardew Valley Keg vs Jar vs Dehydrator calculator. Check added profit, processing time, capacity and leftovers.",
    heroHeading: "Stardew Valley Keg vs Jar vs Dehydrator Calculator",
    actionLabel: "Compare machine routes",
  },
  "keg-processing": {
    title: "Stardew Valley Keg Calculator — Profit, Time & Capacity",
    description:
      "Use the Stardew Valley Keg calculator to compare keg profit, processing time and keg capacity. Check finished batches and raw leftovers by your deadline.",
    heroHeading: "Stardew Valley Keg Calculator",
    actionLabel: "Calculate Keg profit",
  },
  "preserves-jar-processing": {
    title: "Stardew Valley Preserves Jar Calculator: What to Put in Jars",
    description:
      "Use the Stardew Valley preserves jar calculator to decide what to put in jars. Compare jelly and pickles profit, batch times and remaining ingredients.",
    heroHeading: "Stardew Valley Preserves Jar Calculator",
    actionLabel: "Calculate jar profit",
  },
  "dehydrator-processing": {
    title: "Stardew Valley Dehydrator Calculator — Batch Profit",
    description:
      "Use the Stardew Valley dehydrator calculator to compare batch profit for dried fruit, dried mushrooms and raisins, including capacity and five-item remainders.",
    heroHeading: "Stardew Valley Dehydrator Calculator",
    actionLabel: "Calculate batch profit",
  },
  "keg-ingredient-ranking": {
    title: "Stardew Valley Keg Price List — What to Put in Kegs",
    description:
      "Browse the Stardew Valley keg price list to choose what to put in kegs. Use the keg input calculator to check added value, batch times and your actual stock.",
    heroHeading: "Stardew Valley Keg Price List",
    actionLabel: "View the Keg price list",
  },
  "cask-aging": {
    title: "Stardew Valley Wine Aging Time Calculator — Finish Dates",
    description:
      "How long does wine take to age? Use the wine aging calculator to compare silver, gold and iridium targets, collection dates, added value and Cask capacity.",
    heroHeading: "Stardew Valley Wine Aging Time Calculator",
    actionLabel: "Calculate wine aging time",
  },
};

const expectedChineseMetadata: Readonly<
  Record<
    ProcessingToolId,
    Readonly<{
      title: string;
      description: string;
      heroHeading: string;
      actionLabel: string;
    }>
  >
> = {
  "basic-processing-profit": {
    title: "星露谷物语加工收益计算器",
    description: "比较同一批作物直接出售、Keg、罐头瓶和烘干机加工后的收益。",
    heroHeading: "星露谷物语\n加工收益计算器",
    actionLabel: "比较加工收益",
  },
  "machine-comparison": {
    title: "星露谷物语加工机器比较计算器",
    description: "比较 Keg、罐头瓶和烘干机的加工结果、周期与未加工原料。",
    heroHeading: "星露谷物语\n三机加工对比计算器",
    actionLabel: "比较三种机器",
  },
  "keg-processing": {
    title: "星露谷物语 Keg 加工计算器",
    description: "估算星露谷作物经 Keg 加工后的结果、周期和加工增值。",
    heroHeading: "星露谷物语\nKeg 加工计算器",
    actionLabel: "计算 Keg 加工收益",
  },
  "preserves-jar-processing": {
    title: "星露谷物语罐头瓶加工计算器",
    description: "估算同一批作物经罐头瓶加工后的结果、周期和加工增值。",
    heroHeading: "星露谷物语\n罐头瓶加工计算器",
    actionLabel: "计算罐头瓶加工收益",
  },
  "dehydrator-processing": {
    title: "星露谷物语烘干机加工计算器",
    description: "估算星露谷作物使用烘干机后的产出、批次数量和加工增值。",
    heroHeading: "星露谷物语\n烘干机加工计算器",
    actionLabel: "计算烘干批次收益",
  },
  "keg-ingredient-ranking": {
    title: "星露谷物语 Keg 原料收益排行",
    description: "按单件增值或机器周期增值比较适合 Keg 加工的原料。",
    heroHeading: "星露谷物语\nKeg 原料价格清单",
    actionLabel: "查看 Keg 原料价格",
  },
  "cask-aging": {
    title: "星露谷物语酒窖陈酿计算器",
    description: "估算成品酒的剩余陈酿时间、收取日期和本轮陈酿增值。",
    heroHeading: "星露谷物语\n葡萄酒陈酿时间计算器",
    actionLabel: "计算葡萄酒陈酿时间",
  },
};

const llmsEnglishToolLabels: Readonly<Record<ProcessingToolId, string>> = {
  "basic-processing-profit": "Basic processing profit",
  "machine-comparison": "Three-machine comparison",
  "keg-processing": "Keg processing",
  "preserves-jar-processing": "Preserves jar processing",
  "dehydrator-processing": "Dehydrator processing",
  "keg-ingredient-ranking": "Keg ingredient ranking",
  "cask-aging": "Cellar aging",
};

function getHeroHeading(locale: PublicLocale, toolId: ProcessingToolId): string {
  const hero = getProcessingToolRouteCopy(locale, toolId).hero;
  const secondLine = `${hero.accent}${locale === "en" ? " " : ""}${hero.titleAfter}`;
  return `${hero.titleBefore}${locale === "en" ? " " : "\n"}${secondLine}`;
}

describe("processing tool route copy", () => {
  it("keeps approved English metadata exact and within search display limits", () => {
    for (const toolId of PROCESSING_TOOL_IDS) {
      const routeCopy = getProcessingToolRouteCopy("en", toolId);
      const expectedCopy = expectedEnglishCopy[toolId];

      expect(routeCopy.metaTitle).toBe(expectedCopy.title);
      expect(routeCopy.metaDescription).toBe(expectedCopy.description);
      expect(routeCopy.metaTitle.length).toBeLessThanOrEqual(60);
      expect(routeCopy.metaDescription.length).toBeLessThanOrEqual(160);
      expect(routeCopy.hero.description).toBe(expectedCopy.description);
      expect(routeCopy.hero.actionLabel).toBe(expectedCopy.actionLabel);
      expect(getHeroHeading("en", toolId)).toBe(expectedCopy.heroHeading);
    }
  });

  it("preserves Chinese metadata and provides complete bilingual hero fields", () => {
    const locales: readonly PublicLocale[] = ["en", "zh-CN"];

    for (const locale of locales) {
      for (const toolId of PROCESSING_TOOL_IDS) {
        const routeCopy = getProcessingToolRouteCopy(locale, toolId);
        const heroFields = [
          routeCopy.hero.titleBefore,
          routeCopy.hero.accent,
          routeCopy.hero.titleAfter,
          routeCopy.hero.description,
          routeCopy.hero.actionLabel,
        ];

        expect(heroFields.every((heroField) => heroField.trim().length > 0)).toBe(true);
      }
    }

    for (const toolId of PROCESSING_TOOL_IDS) {
      const routeCopy = getProcessingToolRouteCopy("zh-CN", toolId);
      const expectedCopy = expectedChineseMetadata[toolId];

      expect(routeCopy.metaTitle).toBe(expectedCopy.title);
      expect(routeCopy.metaDescription).toBe(expectedCopy.description);
      expect(routeCopy.hero.description).toBe(expectedCopy.description);
      expect(routeCopy.hero.actionLabel).toBe(expectedCopy.actionLabel);
      expect(getHeroHeading("zh-CN", toolId)).toBe(expectedCopy.heroHeading);
    }
  });

  it("keeps each English llms index entry aligned with its public route copy", () => {
    const llmsText = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");

    for (const toolId of PROCESSING_TOOL_IDS) {
      const routeCopy = getProcessingToolRouteCopy("en", toolId);
      const canonicalPath = getProcessingToolDefinition(toolId).canonicalPath;
      const expectedEntry = `- [${llmsEnglishToolLabels[toolId]}](https://stardewvalleyplanner.art${getProcessingToolHref("en", toolId)}): ${routeCopy.metaDescription}`;

      expect(expectedEntry).toContain(canonicalPath);
      expect(llmsText).toContain(expectedEntry);
    }
  });
});
