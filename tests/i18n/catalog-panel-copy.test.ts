import { describe, expect, it } from "vitest";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";
import { getCatalogPanelCopy } from "../../src/i18n/catalog-panel-copy";

const catalogPanelFilterLabelIds = [
  "animal",
  "production",
  "storage",
  "utility",
  "luxury",
  "cabins",
  "structures",
  "spring",
  "summer",
  "fall",
  "winter",
  "multi-season",
  "giant-crops",
  "saplings",
  "wild-trees",
  "fruit-trees",
  "machines",
  "chairs",
  "benches",
  "couches",
  "cushions",
  "armchairs",
  "tables",
  "long-tables",
  "bookcases",
  "dressers",
  "beds",
  "fireplaces",
  "rugs",
  "tvs",
  "fish-tanks",
  "functional",
  "plants",
  "paintings",
  "wall-hangings",
  "windows-doors",
  "large-decor",
  "small-decor",
  "special",
  "wallpaper",
  "flooring",
  "bushes",
  "other",
] as const;

const catalogPanelVariantLabels = [
  "Normal",
  "Moss",
  "No Fruit",
  "Fruit",
  "Net 1",
  "Net 2",
  "Net 3",
  "None",
  "Dry",
  "Watered",
  "Base",
  "Pressure",
  "Enricher",
  "Lit",
  "Unlit",
] as const;

describe("catalog panel copy", () => {
  it("provides English labels and keeps catalog item names unchanged", () => {
    const englishCopy = getCatalogPanelCopy("en");

    expect(englishCopy.catalogLabel).toBe("Item catalog");
    expect(englishCopy.filterItems).toBe("Filter items");
    expect(englishCopy.searchAllItems).toBe("Search all items");
    expect(englishCopy.placingItem("Oak Chair")).toBe("Placing Oak Chair");
    expect(englishCopy.placeItemHint).toBe("Click to place · Esc to cancel");
    expect(englishCopy.fillingItem("Oak Chair")).toBe("Filling Oak Chair");
    expect(englishCopy.fillItemHint).toBe("Drag to fill · Esc to cancel");
    expect(englishCopy.sceneAvailabilityReason("indoor-only")).toBe(
      "This item can only be placed indoors.",
    );
    expect(englishCopy.sceneAvailabilityReason("outdoor-only")).toBe(
      "This item can only be placed outdoors.",
    );
    expect(englishCopy.unavailableGroup(3)).toBe("3 items can't be placed here");
    expect(englishCopy.unavailableGroup(1)).toBe("1 item can't be placed here");
    expect(englishCopy.unavailableGroup(3, true)).toBe(
      "3 results can't be placed here",
    );
    expect(englishCopy.rotate).toBe("Rotate");
    expect(englishCopy.variant).toBe("Variant");
    expect(englishCopy.cancelPlacement).toBe("Cancel placement (Esc)");
    expect(englishCopy.categories).toEqual({
      buildings: "Buildings",
      crops: "Crops",
      trees: "Trees",
      equipment: "Equipment",
      paths: "Fences & Paths",
      lighting: "Lighting",
      furniture: "Furniture",
      decor: "Decor",
    });
    expect(englishCopy.filterLabels).toMatchObject({
      animal: "Animals",
      utility: "Utility",
      flooring: "Flooring",
      "giant-crops": "Giant crops",
      "windows-doors": "Windows & Doors",
      wallpaper: "Wallpaper",
      cushions: "Cushions",
      bushes: "Bushes",
    });
    expect(Object.keys(englishCopy.filterLabels).sort()).toEqual(
      [...catalogPanelFilterLabelIds].sort(),
    );
    expect(englishCopy.selectItem("Keg", 1, 1)).toBe(
      "Select Keg, 1 by 1 tiles",
    );
    expect(englishCopy.cycleVariant("Chair", "Carved")).toBe(
      "Cycle Chair variant, current Carved",
    );
    expect(Object.keys(englishCopy.variantLabels).sort()).toEqual(
      [...catalogPanelVariantLabels].sort(),
    );
    expect(englishCopy.variantLabels).toMatchObject({
      Normal: "Normal",
      Moss: "Moss",
      "No Fruit": "No Fruit",
      Fruit: "Fruit",
      "Net 1": "Net 1",
      "Net 2": "Net 2",
      "Net 3": "Net 3",
      None: "None",
      Dry: "Dry",
      Watered: "Watered",
      Base: "Base",
      Pressure: "Pressure",
      Enricher: "Enricher",
      Lit: "Lit",
      Unlit: "Unlit",
    });
  });

  it("provides Chinese controls and filter labels", () => {
    const chineseCopy = getCatalogPanelCopy("zh-CN");

    expect(chineseCopy.brand).toBe("Stardew Planner");
    expect(chineseCopy.filterItems).toBe("筛选物品");
    expect(chineseCopy.all).toBe("全部");
    expect(chineseCopy.placingItem("Oak Chair")).toBe("正在放置Oak Chair");
    expect(chineseCopy.placeItemHint).toBe("点击放置 · 按 Esc 取消");
    expect(chineseCopy.fillingItem("Oak Chair")).toBe("正在填充Oak Chair");
    expect(chineseCopy.fillItemHint).toBe("拖动填充 · 按 Esc 取消");
    expect(chineseCopy.sceneAvailabilityReason("indoor-only")).toBe(
      "该物品只能放置在室内。",
    );
    expect(chineseCopy.sceneAvailabilityReason("outdoor-only")).toBe(
      "该物品只能放置在室外。",
    );
    expect(chineseCopy.unavailableGroup(3)).toBe("3 件物品不能放置在这里");
    expect(chineseCopy.unavailableGroup(3, true)).toBe(
      "3 个搜索结果不能放置在这里",
    );
    expect(chineseCopy.rotate).toBe("旋转");
    expect(chineseCopy.variant).toBe("变体");
    expect(chineseCopy.cancelPlacement).toBe("取消放置（Esc）");
    expect(chineseCopy.gridView).toBe("网格视图");
    expect(chineseCopy.listView).toBe("列表视图");
    expect(chineseCopy.categories.paths).toBe("围栏与道路");
    expect(chineseCopy.filterLabels).toMatchObject({
      animal: "动物",
      utility: "实用设施",
      flooring: "地板",
      "giant-crops": "巨型作物",
      "windows-doors": "门窗",
      wallpaper: "墙纸",
      cushions: "垫子",
      bushes: "灌木",
    });
    expect(Object.keys(chineseCopy.filterLabels).sort()).toEqual(
      [...catalogPanelFilterLabelIds].sort(),
    );
    expect(chineseCopy.selectItem("Keg", 2, 1)).toBe(
      "选择Keg，占地 2 × 1 格",
    );
    expect(chineseCopy.cycleVariant("Chair", "Carved")).toBe(
      "切换Chair外观，当前为Carved",
    );
    expect(Object.keys(chineseCopy.variantLabels).sort()).toEqual(
      [...catalogPanelVariantLabels].sort(),
    );
    expect(chineseCopy.variantLabels).toEqual({
      Normal: "普通",
      Moss: "苔藓",
      "No Fruit": "无果",
      Fruit: "有果",
      "Net 1": "网 1",
      "Net 2": "网 2",
      "Net 3": "网 3",
      None: "无网",
      Dry: "未浇水",
      Watered: "已浇水",
      Base: "基础",
      Pressure: "加压喷头",
      Enricher: "施肥器",
      Lit: "已点燃",
      Unlit: "未点燃",
    });
  });

  it("rejects a locale outside the supported set and includes its value", () => {
    expect(() => getCatalogPanelCopy("fr" as HomepageLocale)).toThrow(
      'Unsupported catalog-panel locale. Received: "fr".',
    );
  });

  it("rejects invalid unavailable-group arguments with their values", () => {
    const englishCopy = getCatalogPanelCopy("en");

    expect(() => englishCopy.unavailableGroup(-1)).toThrow(
      "Unavailable catalog item count must be a non-negative integer; received -1.",
    );
    expect(() => englishCopy.unavailableGroup(1.5)).toThrow(
      "Unavailable catalog item count must be a non-negative integer; received 1.5.",
    );
    expect(() =>
      englishCopy.unavailableGroup(1, "true" as unknown as boolean),
    ).toThrow(
      'Unavailable catalog search flag must be a boolean; received "true".',
    );
  });
});
