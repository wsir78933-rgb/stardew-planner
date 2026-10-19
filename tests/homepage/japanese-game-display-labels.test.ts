import { readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  catalogSidebarCategories,
  createBuildingCatalogFromDataset,
  createCropCatalogFromDatasets,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  getCatalogSidebarItems,
  selectCatalogSidebarPlaceableItems,
  type CatalogItem,
} from "../../src/catalog";
import { getCatalogSidebarDisplayName } from "../../src/catalog/catalog-sidebar-model";
import {
  readLocalizedCatalogItemLabel,
  readSelectionEntityDisplayName,
} from "../../src/homepage/japanese-game-display-labels";

const catalogDatasetFileNameByKey = {
  buildings: "Buildings.json",
  crops: "Crops.json",
  bigCraftables: "BigCraftables.json",
  objects: "Objects.json",
  fences: "Fences.json",
  floorsAndPaths: "FloorsAndPaths.json",
  furniture: "Furniture.json",
  fruitTrees: "FruitTrees.json",
} satisfies Record<keyof typeof catalogDatasetUrls, string>;

const plannerDescriptionLabelByEnglishName = {
  "Small Bush": "茂み（小）",
  "Medium Bush": "茂み（中）",
  "Large Bush": "茂み（大）",
  "Tilled Dirt": "耕した土",
};

const loadedCatalogJapaneseNameById = {
  "big-craftable:26": "木のイス",
  "big-craftable:27": "木のイス 2",
  "big-craftable:28": "スケルトンの模型",
  "big-craftable:29": "オベリスク",
  "big-craftable:64": "本棚",
  "big-craftable:65": "高級なテーブル",
  "big-craftable:66": "とても古いテーブル",
  "big-craftable:67": "とても古いスツール",
  "big-craftable:68": "大きな古時計",
  "big-craftable:69": "クマちゃんの時計",
  "big-craftable:70": "デッドツリー",
  "big-craftable:72": "ロングトーチ",
  "big-craftable:73": "儀式用マスク",
  "big-craftable:74": "たき火",
  "big-craftable:75": "ボンゴ",
  "big-craftable:76": "装飾用ヤリ",
  "big-craftable:84": "邪悪な像 2",
  "big-craftable:98": "からっぽのカプセル",
  "big-craftable:106": "カメラ",
  "big-craftable:111": "はなやかな水差し",
  "big-craftable:155": "??HMTGF??",
  "big-craftable:161": "??ピンキーレモン??",
  "big-craftable:162": "??フロッグモン??",
  "big-craftable:221": "アイテム用の台座",
} as const;

let sidebarCatalogItems: readonly CatalogItem[] = [];
let visibleCatalogDisplayNames: readonly string[] = [];

describe("Japanese catalog display labels", () => {
  beforeAll(async () => {
    sidebarCatalogItems = await readSidebarCatalogItems();
    visibleCatalogDisplayNames = readVisibleCatalogDisplayNames(sidebarCatalogItems);
  });

  it("covers every visible catalog display name and leaves English and Chinese unchanged", () => {
    expect(visibleCatalogDisplayNames).toHaveLength(1121);
    expect(visibleCatalogDisplayNames).toEqual([...visibleCatalogDisplayNames].sort());

    for (const displayName of visibleCatalogDisplayNames) {
      expect(readLocalizedCatalogItemLabel("en", displayName)).toBe(displayName);
      expect(readLocalizedCatalogItemLabel("zh-CN", displayName)).toBe(displayName);
      expect(readLocalizedCatalogItemLabel("ja", displayName).length).toBeGreaterThan(0);
    }
  });

  it("uses the sourced Japanese name for real catalog items", () => {
    expect(readLocalizedCatalogItemLabel("ja", "Parsnip")).toBe("パースニップ");
    expect(readLocalizedCatalogItemLabel("ja", "Oak Chair")).toBe("オーク材のイス");
    expect(readLocalizedCatalogItemLabel("ja", "Coop")).toBe("小屋");
    expect(readLocalizedCatalogItemLabel("ja", "Grape")).toBe("ブドウ");
    expect(readLocalizedCatalogItemLabel("ja", "Rarecrow 2")).toBe("レアなカカシ 2");
    expect(readLocalizedCatalogItemLabel("ja", "Mannequin (Male)")).toBe("マネキン（男性）");
    expect(readLocalizedCatalogItemLabel("ja", "Wallpaper 0")).toBe("壁紙 0");
    expect(readLocalizedCatalogItemLabel("ja", "Wallpaper MoreWalls:0")).toBe("壁紙 MoreWalls:0");
    expect(readLocalizedCatalogItemLabel("ja", "Flooring 0")).toBe("床 0");
    expect(readLocalizedCatalogItemLabel("ja", "Flooring MoreFloors:0")).toBe("床 MoreFloors:0");

    for (const [englishName, japaneseName] of Object.entries(plannerDescriptionLabelByEnglishName)) {
      expect(visibleCatalogDisplayNames).toContain(englishName);
      expect(readLocalizedCatalogItemLabel("ja", englishName)).toBe(japaneseName);
    }
  });

  it("rejects blank display names and unknown Japanese names with the received value", () => {
    expect(() => readLocalizedCatalogItemLabel("en", "")).toThrow(
      'Catalog display name must be a non-empty string. Received: "".',
    );
    expect(() => readLocalizedCatalogItemLabel("zh-CN", "   ")).toThrow(
      'Catalog display name must be a non-empty string. Received: "   ".',
    );
    expect(() => readLocalizedCatalogItemLabel("ja", "")).toThrow(
      'Catalog display name must be a non-empty string. Received: "".',
    );
    expect(readLocalizedCatalogItemLabel("en", "Not A Catalog Item")).toBe("Not A Catalog Item");
    expect(readLocalizedCatalogItemLabel("zh-CN", "Not A Catalog Item")).toBe("Not A Catalog Item");
    expect(() => readLocalizedCatalogItemLabel("ja", "Not A Catalog Item")).toThrow(
      'Japanese catalog display name is missing for "Not A Catalog Item". Received: "Not A Catalog Item".',
    );
  });

  it("rejects inherited object names that are not catalog labels", () => {
    const inheritedCatalogNames = [
      "constructor",
      "__proto__",
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
    ];

    for (const inheritedCatalogName of inheritedCatalogNames) {
      expect(readLocalizedCatalogItemLabel("en", inheritedCatalogName)).toBe(inheritedCatalogName);
      expect(readLocalizedCatalogItemLabel("zh-CN", inheritedCatalogName)).toBe(inheritedCatalogName);
      expect(() => readLocalizedCatalogItemLabel("ja", inheritedCatalogName)).toThrow(
        `Japanese catalog display name is missing for ${JSON.stringify(inheritedCatalogName)}. Received: ${JSON.stringify(inheritedCatalogName)}.`,
      );
    }
  });

  it("keeps the label module off the catalog reference table", async () => {
    const moduleSource = await readFile(
      path.join(process.cwd(), "src/homepage/japanese-game-display-labels.ts"),
      "utf8",
    );

    expect(moduleSource).not.toContain("catalog-sidebar-reference");
    expect(moduleSource).toContain("export function readLocalizedCatalogItemLabel");
    expect(moduleSource).toContain("export function readSelectionEntityDisplayName");
  });

  it("localizes selected building, item, and crop titles from public display names", () => {
    const fishPond = requireSidebarCatalogItem("building:Fish Pond");
    const chest = requireSidebarCatalogItem("big-craftable:130");
    const parsnip = requireSidebarCatalogItem("crop:472");
    const rarecrow = requireSidebarCatalogItem("big-craftable:113");
    const painting = requireSidebarCatalogItem("furniture_JojaColaPainting");
    const suffixedOakTree: CatalogItem = {
      id: "placeable:oak-tree-normal-source",
      name: "Oak Tree (Normal)",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/test.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      allowedTools: ["cursor", "erase"],
    };

    expect(fishPond.name).toBe("Fish Pond");
    expect(getCatalogSidebarDisplayName(fishPond)).toBe("Fish Pond");
    expect(readSelectionEntityDisplayName("ja", fishPond.name, getCatalogSidebarDisplayName(fishPond))).toBe("魚のいる池");
    expect(readSelectionEntityDisplayName("en", fishPond.name, getCatalogSidebarDisplayName(fishPond))).toBe("Fish Pond");
    expect(readSelectionEntityDisplayName("zh", fishPond.name, getCatalogSidebarDisplayName(fishPond))).toBe("Fish Pond");

    expect(chest.name).toBe("Chest");
    expect(getCatalogSidebarDisplayName(chest)).toBe("Chest");
    expect(readSelectionEntityDisplayName("ja", chest.name, getCatalogSidebarDisplayName(chest))).toBe("箱");
    expect(readSelectionEntityDisplayName("en", chest.name, getCatalogSidebarDisplayName(chest))).toBe("Chest");
    expect(readSelectionEntityDisplayName("zh", chest.name, getCatalogSidebarDisplayName(chest))).toBe("Chest");

    expect(getCatalogSidebarDisplayName(parsnip)).toBe("Parsnip");
    expect(readSelectionEntityDisplayName("ja", parsnip.name, getCatalogSidebarDisplayName(parsnip))).toBe("パースニップ");
    expect(readSelectionEntityDisplayName("en", parsnip.name, getCatalogSidebarDisplayName(parsnip))).toBe(parsnip.name);
    expect(readSelectionEntityDisplayName("zh", parsnip.name, getCatalogSidebarDisplayName(parsnip))).toBe(parsnip.name);

    expect(rarecrow.name).toBe("Rarecrow");
    expect(getCatalogSidebarDisplayName(rarecrow)).toBe("Rarecrow 2");
    expect(readLocalizedCatalogItemLabel("ja", rarecrow.name)).toBe("レアなカカシ");
    expect(readSelectionEntityDisplayName("ja", rarecrow.name, getCatalogSidebarDisplayName(rarecrow))).toBe("レアなカカシ 2");
    expect(readSelectionEntityDisplayName("en", rarecrow.name, getCatalogSidebarDisplayName(rarecrow))).toBe("Rarecrow");
    expect(readSelectionEntityDisplayName("zh", rarecrow.name, getCatalogSidebarDisplayName(rarecrow))).toBe("Rarecrow");

    expect(painting.name).toBe("JojaColaPainting");
    expect(getCatalogSidebarDisplayName(painting)).toBe("Joja Cola Painting");
    expect(() => readLocalizedCatalogItemLabel("ja", painting.name)).toThrow(
      'Japanese catalog display name is missing for "JojaColaPainting". Received: "JojaColaPainting".',
    );
    expect(readSelectionEntityDisplayName("ja", painting.name, getCatalogSidebarDisplayName(painting))).toBe("Jojaコーラの絵");
    expect(readSelectionEntityDisplayName("en", painting.name, getCatalogSidebarDisplayName(painting))).toBe("JojaColaPainting");

    expect(getCatalogSidebarDisplayName(suffixedOakTree)).toBe("Oak Tree");
    expect(() => readLocalizedCatalogItemLabel("ja", suffixedOakTree.name)).toThrow(
      'Japanese catalog display name is missing for "Oak Tree (Normal)". Received: "Oak Tree (Normal)".',
    );
    expect(readSelectionEntityDisplayName("ja", suffixedOakTree.name)).toBe("Oak Tree (Normal)");
    expect(readSelectionEntityDisplayName(
      "ja",
      suffixedOakTree.name,
      getCatalogSidebarDisplayName(suffixedOakTree),
    )).toBe("オークの木");

    expect(readSelectionEntityDisplayName("ja", "My Custom Shed")).toBe("My Custom Shed");
    expect(readSelectionEntityDisplayName("en", "My Custom Shed")).toBe("My Custom Shed");
    expect(readSelectionEntityDisplayName("zh", "My Custom Shed")).toBe("My Custom Shed");
    expect(readSelectionEntityDisplayName("ja", "building:Fish Pond")).toBe("building:Fish Pond");
    expect(() => readSelectionEntityDisplayName("ja", "")).toThrow(
      'Catalog display name must be a non-empty string. Received: "".',
    );
    expect(() => readSelectionEntityDisplayName("zh", "   ")).toThrow(
      'Catalog display name must be a non-empty string. Received: "   ".',
    );
    expect(() => readSelectionEntityDisplayName("en", "Fish Pond", "   ")).toThrow(
      'Catalog display name must be a non-empty string. Received: "   ".',
    );
  });

  it("translates every loaded catalog display name and throws for an unknown resolved name", () => {
    for (const catalogItem of sidebarCatalogItems) {
      const displayName = getCatalogSidebarDisplayName(catalogItem);
      const japaneseName = readLocalizedCatalogItemLabel("ja", displayName);
      expect(japaneseName.length).toBeGreaterThan(0);
      expect(readSelectionEntityDisplayName("ja", catalogItem.name, displayName)).toBe(japaneseName);
      expect(readSelectionEntityDisplayName("en", catalogItem.name, displayName)).toBe(catalogItem.name);
      expect(readSelectionEntityDisplayName("zh", catalogItem.name, displayName)).toBe(catalogItem.name);
    }

    expect(readLocalizedCatalogItemLabel("ja", "Wicked Statue")).toBe("邪悪な像");
    expect(readLocalizedCatalogItemLabel("ja", "Fish Pond")).toBe("魚のいる池");
    expect(readLocalizedCatalogItemLabel("ja", "Chest")).toBe("箱");
    expect(readLocalizedCatalogItemLabel("ja", "Parsnip")).toBe("パースニップ");
    expect(readLocalizedCatalogItemLabel("ja", "Rarecrow 2")).toBe("レアなカカシ 2");

    for (const [itemId, japaneseName] of Object.entries(loadedCatalogJapaneseNameById)) {
      const catalogItem = requireSidebarCatalogItem(itemId);
      const displayName = getCatalogSidebarDisplayName(catalogItem);
      expect(readSelectionEntityDisplayName("ja", catalogItem.name, displayName)).toBe(japaneseName);
      expect(readSelectionEntityDisplayName("en", catalogItem.name, displayName)).toBe(catalogItem.name);
      expect(readSelectionEntityDisplayName("zh", catalogItem.name, displayName)).toBe(catalogItem.name);
    }

    const woodChair2 = requireSidebarCatalogItem("big-craftable:27");
    const wickedStatue2 = requireSidebarCatalogItem("big-craftable:84");
    expect(woodChair2.name).toBe("Wood Chair 2");
    expect(getCatalogSidebarDisplayName(woodChair2)).toBe("Wood Chair 2");
    expect(wickedStatue2.name).toBe("Wicked Statue 2");
    expect(getCatalogSidebarDisplayName(wickedStatue2)).toBe("Wicked Statue 2");

    expect(() => readSelectionEntityDisplayName("ja", "Tall Torch", "Not A Catalog Display")).toThrow(
      'Japanese catalog display name is missing for "Not A Catalog Display". Received: "Not A Catalog Display".',
    );
    expect(() => readSelectionEntityDisplayName("ja", "Oak Tree (Normal)", "Oak Tree (Normal)")).toThrow(
      'Japanese catalog display name is missing for "Oak Tree (Normal)". Received: "Oak Tree (Normal)".',
    );
  });
});

async function readSidebarCatalogItems(): Promise<readonly CatalogItem[]> {
  const buildings = await readCatalogDataset("buildings");
  const crops = await readCatalogDataset("crops");
  const bigCraftables = await readCatalogDataset("bigCraftables");
  const objects = await readCatalogDataset("objects");
  const fences = await readCatalogDataset("fences");
  const floorsAndPaths = await readCatalogDataset("floorsAndPaths");
  const furniture = await readCatalogDataset("furniture");
  const fruitTrees = await readCatalogDataset("fruitTrees");
  const buildingCatalog = createBuildingCatalogFromDataset(
    buildings,
    catalogDatasetUrls.buildings,
  );
  const cropCatalog = createCropCatalogFromDatasets(
    crops,
    objects,
    catalogDatasetUrls.crops,
    catalogDatasetUrls.objects,
  );
  const placeableCatalog = createPlaceableCatalogFromDatasets(
    bigCraftables,
    objects,
    fences,
    floorsAndPaths,
    furniture,
    fruitTrees,
    catalogDatasetUrls,
  );
  const decorCatalog = createDecorCatalogFromDataset(
    furniture,
    catalogDatasetUrls.furniture,
    bigCraftables,
    catalogDatasetUrls.bigCraftables,
  );
  const catalogItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of [
    ...buildingCatalog.items,
    ...cropCatalog.items,
    ...selectCatalogSidebarPlaceableItems(placeableCatalog.items),
    ...decorCatalog.items,
  ]) {
    addUniqueCatalogItem(catalogItemsById, catalogItem);
  }

  return [...catalogItemsById.values()];
}

async function readCatalogDataset(
  datasetName: keyof typeof catalogDatasetUrls,
): Promise<unknown> {
  const datasetText = await readFile(
    path.join(
      process.cwd(),
      "public/game-assets/1.6.15/data",
      catalogDatasetFileNameByKey[datasetName],
    ),
    "utf8",
  );
  const parsedDataset: unknown = JSON.parse(datasetText);
  return parsedDataset;
}

function readVisibleCatalogDisplayNames(
  catalogItems: readonly CatalogItem[],
): readonly string[] {
  const displayNames = new Set<string>();

  for (const category of catalogSidebarCategories) {
    for (const catalogItem of getCatalogSidebarItems(catalogItems, category, "", "all")) {
      displayNames.add(getCatalogSidebarDisplayName(catalogItem));
    }
  }

  return [...displayNames].sort();
}

function requireSidebarCatalogItem(itemId: string): CatalogItem {
  const catalogItem = sidebarCatalogItems.find((candidate) => candidate.id === itemId);
  if (catalogItem === undefined) {
    throw new Error(`Sidebar catalog is missing ${JSON.stringify(itemId)}.`);
  }
  return catalogItem;
}

function addUniqueCatalogItem(
  catalogItemsById: Map<string, CatalogItem>,
  catalogItem: CatalogItem,
): void {
  const existingCatalogItem = catalogItemsById.get(catalogItem.id);
  if (existingCatalogItem === undefined) {
    catalogItemsById.set(catalogItem.id, catalogItem);
    return;
  }
  if (
    existingCatalogItem.category !== catalogItem.category ||
    existingCatalogItem.name !== catalogItem.name
  ) {
    throw new Error(
      `Catalog id ${JSON.stringify(catalogItem.id)} was loaded twice with different contents. ` +
        `Received: ${JSON.stringify(existingCatalogItem.name)} / ${existingCatalogItem.category} ` +
        `and ${JSON.stringify(catalogItem.name)} / ${catalogItem.category}.`,
    );
  }
}
