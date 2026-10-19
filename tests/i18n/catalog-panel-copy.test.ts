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
  "special-items",
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
      special: "Special",
      "special-items": "Special items",
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
      special: "特殊物品",
      "special-items": "Special items",
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

  it("provides Russian categories, search, errors, and dynamic labels", () => {
    const russianCopy = getCatalogPanelCopy("ru");

    expect(russianCopy.catalogLabel).toBe("Каталог предметов");
    expect(russianCopy.browseItems).toBe("Обзор предметов");
    expect(russianCopy.searchAllItems).toBe("Искать среди всех предметов");
    expect(russianCopy.searchResults).toBe("Результаты поиска");
    expect(russianCopy.clearSearch).toBe("Очистить поиск");
    expect(russianCopy.categories).toEqual({
      buildings: "Постройки",
      crops: "Культуры",
      trees: "Деревья",
      equipment: "Оборудование",
      paths: "Заборы и дорожки",
      lighting: "Освещение",
      furniture: "Мебель",
      decor: "Декор",
    });
    expect(russianCopy.filterLabels.spring).toBe("Весна");
    expect(russianCopy.filterLabels.machines).toBe("Машины");
    expect(russianCopy.filterLabels.flooring).toBe("Полы");
    expect(russianCopy.filterLabels.special).toBe("Особые");
    expect(russianCopy.filterLabels["special-items"]).toBe("Особые");
    expect(russianCopy.filterLabels["special-items"]).not.toBe("Special items");
    expect(russianCopy.variantLabels.Lit).toBe("Зажжено");
    expect(russianCopy.variantLabels.Watered).toBe("Полито");
    expect(russianCopy.placingItem("Oak Chair")).toBe("Размещение: Oak Chair");
    expect(russianCopy.fillingItem("Oak Chair")).toBe("Заполнение: Oak Chair");
    expect(russianCopy.placeItemHint).toBe(
      "Нажмите, чтобы разместить · Esc — отмена",
    );
    expect(russianCopy.selectItem("Keg", 2, 1)).toBe("Выбрать Keg, 2 × 1 клеток");
    expect(russianCopy.cycleVariant("Chair", "Carved")).toBe(
      "Сменить вариант «Chair», сейчас: Carved",
    );
    expect(russianCopy.sceneAvailabilityReason("indoor-only")).toBe(
      "Этот предмет можно разместить только в помещении.",
    );
    expect(russianCopy.sceneAvailabilityReason("outdoor-only")).toBe(
      "Этот предмет можно разместить только на улице.",
    );
    expect(russianCopy.unavailableGroup(1)).toBe(
      "1 предмет нельзя разместить здесь",
    );
    expect(russianCopy.unavailableGroup(2)).toBe(
      "2 предмета нельзя разместить здесь",
    );
    expect(russianCopy.unavailableGroup(5)).toBe(
      "5 предметов нельзя разместить здесь",
    );
    expect(russianCopy.unavailableGroup(3, true)).toBe(
      "3 результата нельзя разместить здесь",
    );
    expect(russianCopy.loadFailed).toBe("Не удалось загрузить предметы.");
    expect(russianCopy.loading).toBe("Загрузка предметов…");
    expect(russianCopy.noResults).toBe("Предметы не найдены.");
    expect(russianCopy.placingItem("Oak Chair")).not.toContain("Placing");
    expect(russianCopy.placingItem("Oak Chair")).not.toContain("正在放置");
    expect(russianCopy.searchAllItems).not.toBe("Search all items");
    expect(russianCopy.searchAllItems).not.toBe("搜索全部物品");
    expect(russianCopy.categories.crops).not.toBe("Crops");
    expect(russianCopy.categories.crops).not.toBe("作物");
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

  it("provides Japanese controls without translating caller-supplied item names", () => {
    const japaneseCopy = getCatalogPanelCopy("ja" as HomepageLocale);
    const englishCopy = getCatalogPanelCopy("en");
    const chineseCopy = getCatalogPanelCopy("zh-CN");

    expect(collectCopyKeyPaths(japaneseCopy)).toEqual(collectCopyKeyPaths(englishCopy));
    expect(japaneseCopy.brand).toBe("Stardew Planner");
    expect(japaneseCopy.catalogLabel).toBe("アイテムカタログ");
    expect(japaneseCopy.filterItems).toBe("アイテムを絞り込む");
    expect(japaneseCopy.all).toBe("すべて");
    expect(japaneseCopy.placingItem("Oak Chair")).toBe("「Oak Chair」を配置しています");
    expect(japaneseCopy.fillingItem("Oak Chair")).toBe("「Oak Chair」を塗りつぶしています");
    expect(japaneseCopy.placeItemHint).toBe("クリックして配置 · Escでキャンセル");
    expect(japaneseCopy.fillItemHint).toBe("ドラッグして塗りつぶす · Escでキャンセル");
    expect(japaneseCopy.sceneAvailabilityReason("indoor-only")).toBe(
      "このアイテムは屋内にのみ配置できます。",
    );
    expect(japaneseCopy.sceneAvailabilityReason("outdoor-only")).toBe(
      "このアイテムは屋外にのみ配置できます。",
    );
    expect(japaneseCopy.unavailableGroup(1)).toBe("ここには置けないアイテムが1件あります");
    expect(japaneseCopy.unavailableGroup(3, true)).toBe(
      "ここには置けない検索結果が3件あります",
    );
    expect(japaneseCopy.unavailableGroup(3)).not.toBe(englishCopy.unavailableGroup(3));
    expect(japaneseCopy.unavailableGroup(3)).not.toBe(chineseCopy.unavailableGroup(3));
    expect(japaneseCopy.categories).toEqual({
      buildings: "建物",
      crops: "作物",
      trees: "樹木",
      equipment: "設備",
      paths: "柵と小道",
      lighting: "照明",
      furniture: "家具",
      decor: "装飾",
    });
    expect(Object.keys(japaneseCopy.filterLabels).sort()).toEqual(
      [...catalogPanelFilterLabelIds].sort(),
    );
    expect(japaneseCopy.filterLabels).toMatchObject({
      spring: "春",
      summer: "夏",
      fall: "秋",
      winter: "冬",
      "giant-crops": "巨大な作物",
      "fruit-trees": "果樹",
      saplings: "苗木",
      "wild-trees": "野生の木",
      machines: "加工設備",
      flooring: "フローリング",
      wallpaper: "壁紙",
    });
    for (const filterLabelId of catalogPanelFilterLabelIds) {
      expect(japaneseCopy.filterLabels[filterLabelId]).not.toBe(
        englishCopy.filterLabels[filterLabelId],
      );
      expect(japaneseCopy.filterLabels[filterLabelId]?.length).toBeGreaterThan(0);
    }
    expect(japaneseCopy.selectItem("Keg", 2, 1)).toBe(
      "「Keg」を選択します。2×1マス",
    );
    expect(japaneseCopy.cycleVariant("Chair", "Carved")).toBe(
      "「Chair」のバリエーションを切り替えます。現在はCarvedです",
    );
    expect(japaneseCopy.variantLabels).toEqual({
      Normal: "通常",
      Moss: "コケ",
      "No Fruit": "実なし",
      Fruit: "実あり",
      "Net 1": "網 1",
      "Net 2": "網 2",
      "Net 3": "網 3",
      None: "網なし",
      Dry: "未水やり",
      Watered: "水やり済み",
      Base: "基本",
      Pressure: "圧力ノズル",
      Enricher: "エンリッチ施肥装置",
      Lit: "点灯",
      Unlit: "消灯",
    });
    expect(() => japaneseCopy.unavailableGroup(-2)).toThrow(
      "Unavailable catalog item count must be a non-negative integer; received -2.",
    );
    expect(() =>
      japaneseCopy.sceneAvailabilityReason("roof" as "indoor-only"),
    ).toThrow('Unsupported catalog scene availability. Received: "roof".');
  });
});

function collectCopyKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const keyPaths: string[] = [];
  for (const key of Object.keys(value).sort()) {
    const keyPath = prefix.length === 0 ? key : `${prefix}.${key}`;
    keyPaths.push(keyPath);
    const child = (value as Record<string, unknown>)[key];
    if (typeof child === "object" && child !== null) {
      keyPaths.push(...collectCopyKeyPaths(child, keyPath));
    }
  }
  return keyPaths;
}
