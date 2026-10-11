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
    expect(englishCopy.searchAllItems).toBe("Search all items");
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
    expect(chineseCopy.all).toBe("全部");
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
});
