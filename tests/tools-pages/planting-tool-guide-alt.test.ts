import { expect, it } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  getPlantingToolGuideImageAlt,
  type PlantingToolGuideImageId,
} from "../../src/tools-pages/planting-tool-guide-alt";
import type { PlantingToolId } from "../../src/tools-pages/planting-tool-frame";

const plantingToolGuideImageIds = [
  "case",
  "features-1",
  "features-2",
  "features-3",
  "features-4",
  "features-5",
] as const satisfies readonly PlantingToolGuideImageId[];

const expectedPlantingToolGuideImageAlts = {
  en: {
    "crop-profit": {
      case: "Crop ranking lists Potato first at 4 harvests, 200 expected units, Sell raw, and 8000 net gold, followed by Cauliflower, Green Bean, Kale, and Parsnip, all on Sell raw.",
      "features-1": "Crop ranking lists Potato first at 4 harvests, 200 expected units, Sell raw, and 8000 net gold, followed by Cauliflower, Green Bean, Kale, and Parsnip, all on Sell raw.",
      "features-2": "Seed cost is 8000, fertilizer cost is 800, net gold is 7200, and the route is Sell raw.",
      "features-3": "Processing capacity shows Keg 4, Preserves jar 2, Dehydrator 1, and a processing deadline of Plus 28 days.",
      "features-4": "Crop ranking lists Cauliflower first at 2 harvests, 80 expected units, Keg, and 15520 net gold, then Kale and Potato on Keg, and Green Bean and Parsnip on Preserves jar.",
      "features-5": "The dialog Send this result to the production plan says no plan is saved yet, shows incoming harvest Cauliflower / 40, and highlights Append to the current plan next to Start a new plan and Keep the original plan.",
    },
    "crop-growth": {
      case: "Summary cards show first mature date Fall 6, harvest count 6, and last safe planting day Fall 14, with growth days 14, regrow interval 4, and outdoor harvest deadline Fall 28.",
      "features-1": "Summary cards show first mature date Fall 6, harvest count 6, and last safe planting day Fall 14, with growth days 14, regrow interval 4, and outdoor harvest deadline Fall 28.",
      "features-2": "Summary cards show first mature date Fall 10, harvest count 5, and last safe planting day Fall 10, with growth days 18, regrow interval 4, and outdoor harvest deadline Fall 28.",
      "features-3": "The Location menu is open with Greenhouse checked, listing Outdoors, Greenhouse, and Ginger Island.",
      "features-4": "The Spring harvest calendar marks day 1 as P, days 5, 9, 13, 17, and 21 as R, and day 25 as H.",
      "features-5": "The crop form selects Corn, season Summer, planting day 10, Speed-Gro None, and profession None.",
    },
  },
  "zh-CN": {
    "crop-profit": {
      case: "可种植作物排名中，土豆以 4 次收获、预期数量 200、直接出售和净收益 8000 排在第一，后面是花椰菜、青豆、甘蓝菜和防风草，路线都是直接出售。",
      "features-1": "可种植作物排名中，土豆以 4 次收获、预期数量 200、直接出售和净收益 8000 排在第一，后面是花椰菜、青豆、甘蓝菜和防风草，路线都是直接出售。",
      "features-2": "种子支出是 8000，肥料支出是 800，种植净收益是 7200，路线是直接出售。",
      "features-3": "加工能力中，Keg 为 4，罐头瓶为 2，烘干机为 1，加工截止选择的是再加 28 天。",
      "features-4": "可种植作物排名中，花椰菜以 2 次收获、预期数量 80、Keg 和净收益 15520 排在第一，甘蓝菜和土豆走 Keg，青豆和防风草走罐头瓶。",
      "features-5": "转入生产计划的对话框标题是把这组结果转入生产计划，当前计划还没有已保存的计划，即将转入花椰菜 / 40，高亮的按钮是追加到当前计划，另有作为新计划和保留原计划。",
    },
    "crop-growth": {
      case: "三张卡片分别是首次成熟秋 6、收获次数 6 和最晚安全播种秋 14，下面一行是生长天数 14、再生间隔 4、室外收获截止日秋 28。",
      "features-1": "三张卡片分别是首次成熟秋 6、收获次数 6 和最晚安全播种秋 14，下面一行是生长天数 14、再生间隔 4、室外收获截止日秋 28。",
      "features-2": "三张卡片分别是首次成熟秋 10、收获次数 5 和最晚安全播种秋 10，下面一行是生长天数 18、再生间隔 4、室外收获截止日秋 28。",
      "features-3": "种植地点菜单已展开，温室带有选中标记，选项还有室外和姜岛。",
      "features-4": "按季节排列的收获日历停在春季，第 1 天标为种，第 5、9、13、17 和 21 天标为补，第 25 天标为收。",
      "features-5": "作物选择的是玉米，种植季节是夏，种植日是 10，生长激素和职业都是无。",
    },
  },
} as const satisfies Readonly<
  Record<PublicLocale, Readonly<Record<PlantingToolId, Readonly<Record<PlantingToolGuideImageId, string>>>>>
>;

function sentenceEndingCount(alt: string, locale: PublicLocale): number {
  const ending = locale === "zh-CN" ? "。" : ".";
  return alt.split(ending).length - 1;
}

it("returns one non-empty sentence for every planting guide image", () => {
  const locales = ["en", "zh-CN"] as const satisfies readonly PublicLocale[];
  const tools = ["crop-profit", "crop-growth"] as const satisfies readonly PlantingToolId[];

  for (const locale of locales) {
    for (const tool of tools) {
      for (const imageId of plantingToolGuideImageIds) {
        const alt = getPlantingToolGuideImageAlt(locale, tool, imageId);

        expect(alt).toBe(expectedPlantingToolGuideImageAlts[locale][tool][imageId]);
        expect(alt.trim().length).toBeGreaterThan(0);
        expect(sentenceEndingCount(alt, locale)).toBe(1);
      }
    }
  }
});

it("throws a TypeError that includes the received locale, tool, and image id", () => {
  const unsupportedLocale = "ru" as PublicLocale;
  const unsupportedTool = "processing" as PlantingToolId;
  const unsupportedImageId = "features-6" as PlantingToolGuideImageId;

  expect(() => getPlantingToolGuideImageAlt(unsupportedLocale, "crop-profit", "case")).toThrow(
    new TypeError(
      `Planting tool guide image alt is missing or empty for locale ${JSON.stringify(unsupportedLocale)}, tool ${JSON.stringify("crop-profit")}, and image id ${JSON.stringify("case")}.`,
    ),
  );
  expect(() => getPlantingToolGuideImageAlt("en", unsupportedTool, "features-1")).toThrow(
    new TypeError(
      `Planting tool guide image alt is missing or empty for locale ${JSON.stringify("en")}, tool ${JSON.stringify(unsupportedTool)}, and image id ${JSON.stringify("features-1")}.`,
    ),
  );
  expect(() => getPlantingToolGuideImageAlt("zh-CN", "crop-growth", unsupportedImageId)).toThrow(
    new TypeError(
      `Planting tool guide image alt is missing or empty for locale ${JSON.stringify("zh-CN")}, tool ${JSON.stringify("crop-growth")}, and image id ${JSON.stringify(unsupportedImageId)}.`,
    ),
  );
});
