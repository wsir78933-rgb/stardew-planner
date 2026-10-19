import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  createFarmSummary,
  createFarmSummaryCsvFile,
} from "../../src/projects/farm-summary";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

const catalogItems: readonly CatalogItem[] = [
  {
    id: "building:Coop",
    name: "Coop",
    category: "building",
    tileSize: { width: 6, height: 3 },
    textureLocalPath: "/game-assets/buildings/Coop.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 96, height: 48 },
    allowedTools: ["cursor"],
  },
  {
    id: "crop:Parsnip",
    name: "Parsnip",
    category: "crop",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/crops.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  },
  {
    id: "object:900",
    name: 'Artisan "Tea"',
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/springobjects.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  },
  {
    id: "floor:stone",
    name: "Stone Path",
    category: "floor",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/flooring.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  },
  {
    id: "fence:wood",
    name: "Wood Fence",
    category: "fence",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/fence.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  },
];

const standardFarmSummaryMapContext = {
  baseMapId: "standard",
  displayName: "Standard Farm",
  season: "spring",
} as const;

describe("farm summary", () => {
  it("groups unlocked placement snapshot records with source-compatible categories", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Coop", x: 3, y: 4 }],
      crops: [{ cropId: "crop:Parsnip", x: 1, y: 2 }],
      items: [
        createSummaryItem(1, "object:900", "item"),
        createSummaryItem(2, "object:900", "item"),
        createSummaryItem(3, "floor:stone", "path"),
        createSummaryItem(4, "fence:wood", "fence"),
        createSummaryItem(5, "wildtree_maple", "item"),
        { ...createSummaryItem(6, "object:900", "item"), locked: true },
      ],
      nextBuildingId: 2,
      nextItemId: 7,
    };

    expect(
      createFarmSummary(
        placementSnapshot,
        catalogItems,
        standardFarmSummaryMapContext,
      ),
    ).toEqual({
      mapContext: standardFarmSummaryMapContext,
      rows: [
        { category: "Buildings", count: 1, name: "Coop" },
        { category: "Crops", count: 1, name: "Parsnip" },
        { category: "Fences", count: 1, name: "Wood Fence" },
        { category: "Items", count: 2, name: 'Artisan "Tea"' },
        { category: "Paths", count: 1, name: "Stone Path" },
        { category: "Trees", count: 1, name: "Wildtree Maple" },
      ],
      totalItems: 7,
    });
  });

  it.each([
    [
      { baseMapId: "", displayName: "Standard Farm", season: "spring" },
      'Farm summary map context baseMapId must be a non-empty string; received "".',
    ],
    [
      { baseMapId: "standard", displayName: "", season: "spring" },
      'Farm summary map context displayName must be a non-empty string; received "".',
    ],
    [
      { baseMapId: "standard", displayName: "Standard Farm", season: "monsoon" },
      'Farm summary map context season must be one of "spring", "summer", "fall", "winter"; received "monsoon".',
    ],
  ])("rejects invalid map context %j", (mapContext, errorMessage) => {
    expect(() =>
      createFarmSummary(
        createEmptyPlacementSnapshot(),
        catalogItems,
        mapContext as never,
      ),
    ).toThrow(errorMessage);
  });

  it("exports source-compatible quoted CSV rows and a dated filename", () => {
    expect(
      createFarmSummaryCsvFile(
        [
          { category: "Items", count: 2, name: 'Artisan "Tea"' },
          { category: "Paths", count: 1, name: "Stone Path" },
        ],
        "2026-07-26",
      ),
    ).toEqual({
      filename: "farm-summary-2026-07-26.csv",
      mimeType: "text/csv",
      contents:
        'Category,Item,Count\nItems,"Artisan ""Tea""",2\nPaths,"Stone Path",1',
    });
  });

  it("keeps omitted, English, and Chinese summaries on the historical English rows", () => {
    const placementSnapshot = createHistoricalPlacementSnapshot();
    const omittedSummary = createFarmSummary(
      placementSnapshot,
      catalogItems,
      standardFarmSummaryMapContext,
    );

    expect(
      createFarmSummary(
        placementSnapshot,
        catalogItems,
        standardFarmSummaryMapContext,
        "en",
      ),
    ).toEqual(omittedSummary);
    expect(
      createFarmSummary(
        placementSnapshot,
        catalogItems,
        standardFarmSummaryMapContext,
        "zh",
      ),
    ).toEqual(omittedSummary);
    expect(
      createFarmSummaryCsvFile(
        [
          { category: "Items", count: 2, name: 'Artisan "Tea"' },
          { category: "Paths", count: 1, name: "Stone Path" },
        ],
        "2026-07-26",
        "zh",
      ).contents,
    ).toBe(
      'Category,Item,Count\nItems,"Artisan ""Tea""",2\nPaths,"Stone Path",1',
    );
  });

  it("translates Russian summary rows and the CSV header without changing inputs or counts", () => {
    const placementSnapshot = createRussianPlacementSnapshot();
    const russianCatalogItems = createRussianCatalogItems();
    const snapshotBefore = JSON.stringify(placementSnapshot);
    const catalogBefore = JSON.stringify(russianCatalogItems);
    const mapContextBefore = JSON.stringify(standardFarmSummaryMapContext);
    const englishSummary = createFarmSummary(
      placementSnapshot,
      russianCatalogItems,
      standardFarmSummaryMapContext,
    );
    const russianSummary = createFarmSummary(
      placementSnapshot,
      russianCatalogItems,
      standardFarmSummaryMapContext,
      "ru",
    );
    const russianCsvFile = createFarmSummaryCsvFile(
      russianSummary.rows,
      "2026-07-26",
      "ru",
    );

    expect(JSON.stringify(placementSnapshot)).toBe(snapshotBefore);
    expect(JSON.stringify(russianCatalogItems)).toBe(catalogBefore);
    expect(JSON.stringify(standardFarmSummaryMapContext)).toBe(mapContextBefore);
    expect(russianSummary.mapContext).toEqual(standardFarmSummaryMapContext);
    expect(russianSummary.totalItems).toBe(englishSummary.totalItems);
    expect(russianSummary.totalItems).toBe(11);
    expect(russianSummary.rows.map((row) => row.count).sort((left, right) => left - right)).toEqual(
      englishSummary.rows.map((row) => row.count).sort((left, right) => left - right),
    );
    expect(russianSummary.rows).toEqual(expect.arrayContaining([
      { category: "Постройки", count: 1, name: "Птичник" },
      { category: "Постройки", count: 1, name: "Неизвестный предмет: MissingBuilding" },
      { category: "Культуры", count: 1, name: "Пастернак" },
      { category: "Мебель", count: 2, name: "Дубовый стул" },
      { category: "Предметы", count: 1, name: "Обои 0" },
      { category: "Предметы", count: 1, name: "Пол 3" },
      { category: "Предметы", count: 1, name: "Неизвестный предмет: object:not_in_catalog" },
      { category: "Дорожки", count: 1, name: "Деревянная дорожка" },
      { category: "Заборы", count: 1, name: "Деревянный забор" },
      { category: "Деревья", count: 1, name: "Дуб" },
    ]));
    expect(russianSummary.rows).toHaveLength(10);
    expectFarmSummaryRowsSorted(russianSummary.rows);
    expect(russianCsvFile.filename).toBe("farm-summary-2026-07-26.csv");
    expect(russianCsvFile.contents.startsWith("Категория,Предмет,Количество\n")).toBe(true);
    expect(russianCsvFile.contents).toContain('Мебель,"Дубовый стул",2');
    expect(russianCsvFile.contents).toContain("Предметы,\"Неизвестный предмет: object:not_in_catalog\",1");
  });

  it("keeps Russian CSV quoting and rejects an unknown summary locale", () => {
    expect(
      createFarmSummaryCsvFile(
        [{ category: "Предметы", count: 2, name: 'Ремесленный "Чай"' }],
        "2026-07-26",
        "ru",
      ),
    ).toEqual({
      filename: "farm-summary-2026-07-26.csv",
      mimeType: "text/csv",
      contents: 'Категория,Предмет,Количество\nПредметы,"Ремесленный ""Чай""",2',
    });
    expect(() =>
      createFarmSummary(
        createEmptyPlacementSnapshot(),
        [],
        standardFarmSummaryMapContext,
        "de" as never,
      ),
    ).toThrow(
      'Farm summary locale must be "en", "zh", or "ru"; received "de".',
    );
    expect(() =>
      createFarmSummaryCsvFile([], "2026-07-26", "nope" as never),
    ).toThrow(
      'Farm summary locale must be "en", "zh", or "ru"; received "nope".',
    );
  });

  it("fails when a known catalog item has no Russian display name", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createSummaryItem(1, "object:390", "item")],
      nextItemId: 2,
    };

    expect(() =>
      createFarmSummary(
        placementSnapshot,
        [
          {
            id: "object:390",
            name: "Stone",
            category: "placeable",
            tileSize: { width: 1, height: 1 },
            textureLocalPath: "/game-assets/springobjects.png",
            sprite: { kind: "sprite-index", index: 0 },
            allowedTools: ["cursor"],
          },
        ],
        standardFarmSummaryMapContext,
        "ru",
      ),
    ).toThrow('Catalog item ID "object:390" has no Russian display name.');
  });
});

function createHistoricalPlacementSnapshot() {
  return {
    ...createEmptyPlacementSnapshot(),
    buildings: [{ instanceId: 1, buildingId: "Coop", x: 3, y: 4 }],
    crops: [{ cropId: "crop:Parsnip", x: 1, y: 2 }],
    items: [
      createSummaryItem(1, "object:900", "item"),
      createSummaryItem(2, "object:900", "item"),
      createSummaryItem(3, "floor:stone", "path"),
      createSummaryItem(4, "fence:wood", "fence"),
      createSummaryItem(5, "wildtree_maple", "item"),
      { ...createSummaryItem(6, "object:900", "item"), locked: true },
    ],
    nextBuildingId: 2,
    nextItemId: 7,
  };
}

function createRussianCatalogItems(): readonly CatalogItem[] {
  return [
    createSummaryCatalogItem("building:Coop", "Coop", "building"),
    createSummaryCatalogItem("crop:472", "Parsnip", "crop"),
    createSummaryCatalogItem("furniture_0", "Oak Chair", "decor"),
    createSummaryCatalogItem("wp_0", "Wallpaper 0", "decor", "wallpaper"),
    createSummaryCatalogItem("flooring_3", "Flooring 3", "decor", "flooring"),
    createSummaryCatalogItem("floor:6", "Wood Path", "floor"),
    createSummaryCatalogItem("fence:322", "Wood Fence", "fence"),
    createSummaryCatalogItem("wildtree_1", "Oak Tree", "placeable"),
  ];
}

function createRussianPlacementSnapshot() {
  return {
    ...createEmptyPlacementSnapshot(),
    buildings: [
      { instanceId: 1, buildingId: "Coop", x: 3, y: 4 },
      { instanceId: 2, buildingId: "MissingBuilding", x: 8, y: 8 },
    ],
    crops: [{ cropId: "crop:472", x: 1, y: 2 }],
    items: [
      createSummaryItem(1, "furniture_0", "item"),
      createSummaryItem(2, "furniture_0", "item"),
      { ...createSummaryItem(3, "furniture_0", "item"), locked: true },
      createSummaryItem(4, "wp_0", "item"),
      createSummaryItem(5, "flooring_3", "item"),
      createSummaryItem(6, "floor:6", "path"),
      createSummaryItem(7, "fence:322", "fence"),
      createSummaryItem(8, "wildtree_1", "item"),
      createSummaryItem(9, "object:not_in_catalog", "item"),
    ],
    nextBuildingId: 3,
    nextItemId: 10,
  };
}

function createSummaryCatalogItem(
  id: string,
  name: string,
  category: CatalogItem["category"],
  interiorDecorKind?: "wallpaper" | "flooring",
): CatalogItem {
  return {
    id,
    name,
    category,
    ...(interiorDecorKind === undefined ? {} : { interiorDecorKind }),
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  };
}

function expectFarmSummaryRowsSorted(
  rows: readonly { category: string; count: number }[],
): void {
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const previousRow = rows[rowIndex - 1];
    const currentRow = rows[rowIndex];
    const categoryOrder = previousRow.category.localeCompare(currentRow.category);
    if (categoryOrder > 0 || (categoryOrder === 0 && previousRow.count < currentRow.count)) {
      throw new Error(
        `Farm summary rows are not sorted at index ${String(rowIndex)}; received ${JSON.stringify(rows)}.`,
      );
    }
  }
}

function createSummaryItem(
  instanceId: number,
  itemId: string,
  layer: "item" | "path" | "fence",
) {
  return {
    instanceId,
    itemId,
    x: instanceId,
    y: 0,
    layer,
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  } as const;
}
