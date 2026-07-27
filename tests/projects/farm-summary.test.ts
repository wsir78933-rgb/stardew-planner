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
        { catalogId: "building:Coop", category: "Buildings", count: 1, name: "Coop" },
        { catalogId: "crop:Parsnip", category: "Crops", count: 1, name: "Parsnip" },
        { catalogId: "fence:wood", category: "Fences", count: 1, name: "Wood Fence" },
        { catalogId: "object:900", category: "Items", count: 2, name: 'Artisan "Tea"' },
        { catalogId: "floor:stone", category: "Paths", count: 1, name: "Stone Path" },
        { catalogId: "wildtree_maple", category: "Trees", count: 1, name: "Wildtree Maple" },
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
});

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
