import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  createImportedGameSaveState,
  GameSaveImportError,
  type ParsedStardewGameSave,
} from "../../src/game-save/game-save-import";

const catalogItems: readonly CatalogItem[] = [
  createCatalogItem("building:Barn", "building", { width: 7, height: 4 }),
  createCatalogItem("object:390", "placeable", { width: 1, height: 1 }),
  createCatalogItem("big-craftable:12", "placeable", { width: 1, height: 1 }),
  createCatalogItem("fence:298", "fence", { width: 1, height: 1 }),
  createCatalogItem("crop:24", "crop", { width: 1, height: 1 }),
  createCatalogItem("floor:1", "floor", { width: 1, height: 1 }),
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
    crops: [{ isDead: false, seedIndex: "24", x: 4, y: 6 }],
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
    unmappedEntries: [
      { kind: "tree", sourceId: "wildtree_1" },
    ],
    whichFarm: "0",
  };
}

describe("game save import", () => {
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
            footprint: { height: 2, width: 2 },
            instanceId: 5,
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
        nextItemId: 6,
      },
      season: "summer",
      unmappedEntries: [{ kind: "tree", sourceId: "wildtree_1" }],
    });
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

    expect(importedGameSaveState.placementSnapshot.items).toHaveLength(5);
    expect(importedGameSaveState.unmappedEntries).toContainEqual({
      kind: "object",
      sourceId: "object:9999",
    });
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

  it("uses the explicit user-input error type for unsupported save values", () => {
    expect(() =>
      createImportedGameSaveState(
        { ...createParsedGameSave(), whichFarm: "unknown-mod-farm" },
        catalogItems,
      ),
    ).toThrow(GameSaveImportError);
  });
});
