import { describe, expect, it } from "vitest";
import { createDefaultCropGrowthForm } from "@/src/tools-pages/crop-growth-form";
import { projectCropGrowthForm } from "@/src/tools-pages/crop-harvest-calendar";
import { createDefaultCropProfitForm } from "@/src/tools-pages/crop-profit-form";
import {
  createGrowthCalendarCopy,
  createProfitTopFiveCopy,
} from "@/src/tools-pages/planting-tool-copy";
import { loadPurchasableFieldCrops } from "@/src/tools-pages/purchasable-field-crops";
import { rankCropProfitForm } from "@/src/tools-pages/season-crop-ranking";

const crops = loadPurchasableFieldCrops();

describe("planting tool copy", () => {
  it("copies profit assumptions, costs, route, harvest dates, and raw-sale amounts in both languages", () => {
    const form = {
      ...createDefaultCropProfitForm(),
      plantingDay: 8,
      tileCount: 12,
      fertilizerCostPerTile: 5,
    };
    const ranking = rankCropProfitForm(form);
    const englishCopy = createProfitTopFiveCopy(ranking, form, crops, "en");
    const chineseCopy = createProfitTopFiveCopy(ranking, form, crops, "zh-CN");

    expect(englishCopy).toContain("Spring 8, Farm year 1, Tile count 12");
    expect(englishCopy).toContain("Fertilizer cost per tile: 5");
    expect(englishCopy).toContain("Daily gold per tile is averaged over the remaining days through day 28.");
    expect(englishCopy).toContain("First harvest:");
    expect(englishCopy).toContain("Seed cost:");
    expect(englishCopy).toContain("Processed units:");
    expect(englishCopy).toContain("Sold raw:");
    expect(englishCopy).not.toContain("Remaining raw:");

    expect(chineseCopy).toContain("春 8, 农场年份 1, 种植格数 12");
    expect(chineseCopy).toContain("每格肥料成本: 5");
    expect(chineseCopy).toContain("已加工数量:");
    expect(chineseCopy).toContain("直接出售原料:");
    expect(chineseCopy).not.toContain("剩余原料:");
  });

  it("copies watering conditions and labels only actual year rollover dates", () => {
    const ordinaryForm = {
      ...createDefaultCropGrowthForm("strawberry"),
      plantingDay: 13,
      missedWateringDays: 2,
    };
    const ordinaryCopy = createGrowthCalendarCopy(
      ordinaryForm,
      projectCropGrowthForm(ordinaryForm),
      crops,
      "en",
    );

    expect(ordinaryCopy).toContain("Missed watering days: 2");
    expect(ordinaryCopy).toContain("Spring 23");
    expect(ordinaryCopy).not.toContain("same year");
    expect(ordinaryCopy).not.toContain("(next year)");

    const rolloverForm = {
      ...createDefaultCropGrowthForm("strawberry"),
      season: "winter" as const,
      plantingDay: 28,
      location: "greenhouse" as const,
      missedWateringDays: 2,
    };
    const englishRolloverCopy = createGrowthCalendarCopy(
      rolloverForm,
      projectCropGrowthForm(rolloverForm),
      crops,
      "en",
    );
    const chineseRolloverCopy = createGrowthCalendarCopy(
      rolloverForm,
      projectCropGrowthForm(rolloverForm),
      crops,
      "zh-CN",
    );

    expect(englishRolloverCopy).toContain("Spring 10 (next year)");
    expect(englishRolloverCopy).toContain("Spring (next year):");
    expect(englishRolloverCopy).toContain("Missed watering days: 2");
    expect(chineseRolloverCopy).toContain("次年");
    expect(chineseRolloverCopy).toContain("每次种植漏浇水: 2");
  });
});
