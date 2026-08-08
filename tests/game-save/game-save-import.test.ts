import { describe, expect, it } from "vitest";
import {
  createHoeDirtCatalogItem,
  type CatalogItem,
} from "../../src/catalog";
import {
  createImportedGameSaveState,
  GameSaveImportError,
  type ParsedStardewGameSave,
} from "../../src/game-save/game-save-import";

const catalogItems: readonly CatalogItem[] = [
  createCatalogItem("building:Barn", "building", { width: 7, height: 4 }),
  createCatalogItem("building:Fish Pond", "building", { width: 5, height: 5 }),
  createCatalogItem("object:390", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:12", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:130", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:232", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:BigChest", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:BigStoneChest", "placeable", { width: 1, height: 1 }),
  createCatalogItem("fence:298", "fence", { width: 1, height: 1 }),
  createCatalogItem("crop:24", "crop", { width: 1, height: 1 }),
  createCatalogItem("floor:1", "floor", { width: 1, height: 1 }),
  createHoeDirtCatalogItem(),
  createCatalogItem("wildtree_1", "placeable", { width: 1, height: 1 }),
  createCatalogItem("fruittree_633", "placeable", { width: 1, height: 1 }),
  createCatalogItem("clump_600", "decor", { width: 2, height: 2 }),
];

function createCatalogItem(
  id: string,
  category: CatalogItem["category"],
  tileSize: CatalogItem["tileSize"],
): CatalogItem {
  return {
    id,
    name: id,
    category,
    tileSize,
    textureLocalPath: "/game-assets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
  };
}

function createParsedGameSave(): ParsedStardewGameSave {
  return {
    buildings: [{ buildingType: "Barn", x: 10, y: 12 }],
    crops: [
      { hoeDirtState: 1, isDead: false, seedIndex: "24", x: 4, y: 6 },
      { hoeDirtState: 0, isDead: false, seedIndex: null, x: 5, y: 6 },
      { hoeDirtState: 1, isDead: false, seedIndex: null, x: 6, y: 6 },
      { hoeDirtState: 7, isDead: false, seedIndex: null, x: 7, y: 6 },
    ],
    farmName: "Junimo",
    floorings: [{ whichFloor: "1", x: 8, y: 2 }],
    objects: [
      {
        heldObjectId: "915",
        isBigCraftable: false,
        itemId: "390",
        flipped: true,
        tintColor: "#123456",
        x: 3,
        y: 5,
      },
      {
        heldObjectId: null,
        isBigCraftable: true,
        itemId: "12",
        flipped: false,
        tintColor: "#ffffff",
        x: 6,
        y: 7,
      },
      {
        heldObjectId: null,
        isBigCraftable: false,
        itemId: "298",
        flipped: false,
        tintColor: "#ffffff",
        x: 9,
        y: 10,
      },
    ],
    resourceClumps: [{ parentSheetIndex: 600, x: 14, y: 15 }],
    season: "summer",
    trees: [
      {
        flipped: true,
        growthStage: 4,
        hasMoss: true,
        kind: "wild-tree",
        stump: false,
        treeType: "1",
        x: 1,
        y: 2,
      },
      {
        flipped: true,
        growthStage: 3,
        kind: "fruit-tree",
        stump: false,
        treeId: "633",
        x: 2,
        y: 3,
      },
      {
        flipped: false,
        growthStage: 5,
        hasMoss: false,
        kind: "wild-tree",
        stump: false,
        treeType: "1",
        x: 3,
        y: 4,
      },
      {
        flipped: false,
        growthStage: 4,
        kind: "fruit-tree",
        stump: false,
        treeId: "633",
        x: 4,
        y: 5,
      },
      {
        flipped: false,
        growthStage: 5,
        hasMoss: false,
        kind: "wild-tree",
        stump: true,
        treeType: "1",
        x: 5,
        y: 6,
      },
      {
        flipped: false,
        growthStage: 4,
        kind: "fruit-tree",
        stump: true,
        treeId: "633",
        x: 6,
        y: 7,
      },
    ],
    unmappedEntries: [{ kind: "mod", sourceId: "mod:lantern" }],
    whichFarm: "0",
  };
}

describe("game save import", () => {
  it("imports the exact paintable chest IDs and preserves arbitrary saved player colors", () => {
    const importedGameSave = createImportedGameSaveState({
      ...createParsedGameSave(),
      objects: [
        { flipped: false, heldObjectId: null, isBigCraftable: true, itemId: "130", tintColor: "#123abc", x: 1, y: 1 },
        { flipped: false, heldObjectId: null, isBigCraftable: true, itemId: "232", tintColor: "#ffffff", x: 2, y: 2 },
        { flipped: false, heldObjectId: null, isBigCraftable: true, itemId: "BigChest", tintColor: "#fefefe", x: 3, y: 3 },
        { flipped: false, heldObjectId: null, isBigCraftable: true, itemId: "BigStoneChest", tintColor: "#abcdef", x: 4, y: 4 },
      ],
    }, catalogItems);

    expect(importedGameSave.placementSnapshot.items.slice(0, 4).map((item) => [item.itemId, item.tintColor])).toEqual([
      ["big-craftable:130", "#123abc"],
      ["big-craftable:232", "#ffffff"],
      ["big-craftable:BigChest", "#fefefe"],
      ["big-craftable:BigStoneChest", "#abcdef"],
    ]);
  });

  it("maps source-supported game-save entries into a current unsaved farm state", () => {
    expect(
      createImportedGameSaveState(createParsedGameSave(), catalogItems),
    ).toEqual({
      farmName: "Junimo",
      mapId: "standard",
      placementSnapshot: {
        buildings: [{ buildingId: "Barn", instanceId: 1, x: 10, y: 12 }],
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
        items: [
          {
            bedType: null,
            flipped: true,
            footprint: { height: 1, width: 1 },
            instanceId: 1,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "object:390",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#123456",
            variant: 1,
            x: 3,
            y: 5,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 2,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "big-craftable:12",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 6,
            y: 7,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 3,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "fence:298",
            layer: "fence",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 9,
            y: 10,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 4,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "floor:1",
            layer: "path",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 8,
            y: 2,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 5,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "hoedirt",
            layer: "path",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 5,
            y: 6,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 6,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "hoedirt",
            layer: "path",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 1,
            x: 6,
            y: 6,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 7,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "hoedirt",
            layer: "path",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 7,
            y: 6,
          },
          {
            bedType: null,
            flipped: true,
            footprint: { height: 1, width: 1 },
            growthStage: 4,
            instanceId: 8,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "wildtree_1",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 1,
            x: 1,
            y: 2,
          },
          {
            bedType: null,
            flipped: true,
            footprint: { height: 1, width: 1 },
            growthStage: 3,
            instanceId: 9,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "fruittree_633",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 2,
            y: 3,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 10,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "wildtree_1",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 3,
            y: 4,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 1, width: 1 },
            instanceId: 11,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "fruittree_633",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 4,
            y: 5,
          },
          {
            bedType: null,
            flipped: false,
            footprint: { height: 2, width: 2 },
            instanceId: 12,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "clump_600",
            layer: "item",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 14,
            y: 15,
          },
        ],
        nextBuildingId: 2,
        nextItemId: 13,
      },
      season: "summer",
      unmappedEntries: [{ kind: "mod", sourceId: "mod:lantern" }],
    });
  });

  it("imports Fish Pond nettingStyle verbatim and leaves a missing value absent", () => {
    const parsedGameSave = createParsedGameSave();
    const importedGameSave = createImportedGameSaveState(
      {
        ...parsedGameSave,
        buildings: [
          { buildingType: "Fish Pond", nettingStyle: -5, x: 2, y: 3 },
          { buildingType: "Barn", x: 10, y: 12 },
        ],
      },
      catalogItems,
    );

    expect(importedGameSave.placementSnapshot.buildings).toEqual([
      {
        buildingId: "Fish Pond",
        instanceId: 1,
        variant: -5,
        x: 2,
        y: 3,
      },
      { buildingId: "Barn", instanceId: 2, x: 10, y: 12 },
    ]);
  });

  it("reports unavailable catalog IDs instead of putting them into the renderable snapshot", () => {
    const parsedGameSave = createParsedGameSave();
    const gameSaveWithUnknownObject: ParsedStardewGameSave = {
      ...parsedGameSave,
      objects: [
        ...parsedGameSave.objects,
        {
          heldObjectId: null,
          isBigCraftable: false,
          itemId: "9999",
          flipped: false,
          tintColor: "#ffffff",
          x: 20,
          y: 21,
        },
      ],
    };
    const importedGameSaveState = createImportedGameSaveState(
      gameSaveWithUnknownObject,
      catalogItems,
    );

    expect(importedGameSaveState.placementSnapshot.items).toHaveLength(12);
    expect(importedGameSaveState.unmappedEntries).toContainEqual({
      kind: "object",
      sourceId: "object:9999",
    });
  });

  it("reports missing wild/fruit tree catalog IDs without reordering mapped trees", () => {
    const parsedGameSave = createParsedGameSave();
    const importedGameSaveState = createImportedGameSaveState(
      {
        ...parsedGameSave,
        trees: [
          ...parsedGameSave.trees,
          {
            flipped: false,
            growthStage: 2,
            hasMoss: false,
            kind: "wild-tree",
            stump: false,
            treeType: "999",
            x: 20,
            y: 21,
          },
          {
            flipped: false,
            growthStage: 1,
            kind: "fruit-tree",
            stump: false,
            treeId: "999",
            x: 22,
            y: 23,
          },
        ],
      },
      catalogItems,
    );

    expect(importedGameSaveState.placementSnapshot.items.map(
      (placementItem) => placementItem.itemId,
    )).toEqual([
      "object:390",
      "big-craftable:12",
      "fence:298",
      "floor:1",
      "hoedirt",
      "hoedirt",
      "hoedirt",
      "wildtree_1",
      "fruittree_633",
      "wildtree_1",
      "fruittree_633",
      "clump_600",
    ]);
    expect(importedGameSaveState.unmappedEntries.slice(-2)).toEqual([
      { kind: "tree", sourceId: "wildtree_999" },
      { kind: "fruit-tree", sourceId: "fruittree_999" },
    ]);
  });

  it("reports every empty HoeDirt when its exact catalog item is unavailable", () => {
    const importedGameSaveState = createImportedGameSaveState(
      createParsedGameSave(),
      catalogItems.filter((catalogItem) => catalogItem.id !== "hoedirt"),
    );

    expect(importedGameSaveState.placementSnapshot.items.map(
      (placementItem) => placementItem.itemId,
    )).not.toContain("hoedirt");
    expect(importedGameSaveState.unmappedEntries.filter(
      (unmappedEntry) => unmappedEntry.kind === "hoe-dirt",
    )).toEqual([
      { kind: "hoe-dirt", sourceId: "hoedirt" },
      { kind: "hoe-dirt", sourceId: "hoedirt" },
      { kind: "hoe-dirt", sourceId: "hoedirt" },
    ]);
  });

  it("fails fast for an unsupported farm type", () => {
    expect(() =>
      createImportedGameSaveState(
        { ...createParsedGameSave(), whichFarm: "unknown-mod-farm" },
        catalogItems,
      ),
    ).toThrow('Game save farm type is unsupported: "unknown-mod-farm"');
  });

  it("fails fast with a concrete field path for malformed saved entries", () => {
    const malformedParsedGameSave = {
      ...createParsedGameSave(),
      objects: [null],
    } as unknown as ParsedStardewGameSave;

    expect(() =>
      createImportedGameSaveState(malformedParsedGameSave, catalogItems),
    ).toThrow(
      'Game save import field "objects[0]" must be a non-null object; received null.',
    );
  });

  it.each([
    [
      "trees array",
      { trees: undefined },
      'Game save import field "trees" must be an array; received undefined.',
    ],
    [
      "tree growth stage",
      {
        trees: [{
          ...createParsedGameSave().trees[0],
          growthStage: -1,
        }],
      },
      'Game save import field "trees[0].growthStage" must be a non-negative safe integer; received -1.',
    ],
    [
      "fruit tree ID",
      {
        trees: [{
          ...createParsedGameSave().trees[1],
          treeId: "",
        }],
      },
      'Game save import field "trees[0].treeId" must be a non-empty string; received "".',
    ],
    [
      "HoeDirt state",
      {
        crops: [{
          ...createParsedGameSave().crops[1],
          hoeDirtState: 1.5,
        }],
      },
      'Game save import field "crops[0].hoeDirtState" must be a safe integer; received 1.5.',
    ],
  ])("fails fast at the parsed %s boundary", (_caseName, invalidFields, errorMessage) => {
    expect(() =>
      createImportedGameSaveState(
        { ...createParsedGameSave(), ...invalidFields } as ParsedStardewGameSave,
        catalogItems,
      ),
    ).toThrow(errorMessage);
  });

  it("uses the explicit user-input error type for unsupported save values", () => {
    expect(() =>
      createImportedGameSaveState(
        { ...createParsedGameSave(), whichFarm: "unknown-mod-farm" },
        catalogItems,
      ),
    ).toThrow(GameSaveImportError);
  });
});
