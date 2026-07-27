import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
} from "../../src/catalog";
import {
  applyEditorCursorPlacement,
} from "../../src/editor/editor-placement-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import { createPlacementHistory } from "../../src/placement/placement-history";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

function createCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id" | "category">,
): CatalogItem {
  return {
    name: catalogItem.id,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
    ...catalogItem,
  };
}

function createPlacementGrid(
  tileCapabilities: Readonly<{
    buildable: boolean;
    diggable: boolean;
    passable: boolean;
  }> = { buildable: true, diggable: true, passable: true },
): MapPlacementGrid {
  return {
    width: 1,
    height: 1,
    capabilitiesByTile: [
      {
        ...tileCapabilities,
        treePlantable: false,
        treePlantableOnDirt: false,
        crabPot: false,
      },
    ],
  };
}

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {
    Barn: {
      size: { width: 1, height: 1 },
      collisionMap: [[{ requiresBuildable: true }]],
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
  };
}

function createPlacementInput(
  selectedCatalogItem: CatalogItem | null,
  overrides: Partial<Parameters<typeof applyEditorCursorPlacement>[0]> = {},
) {
  return {
    selectedCatalogItem,
    cursorTile: { x: 0, y: 0 },
    mapPlacementGrid: createPlacementGrid(),
    buildingMetadataById: createBuildingMetadataById(),
    placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    ...overrides,
  };
}

describe("applyEditorCursorPlacement", () => {
  it("commits one history snapshot after placing supported building and crop catalog items", () => {
    const buildingHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const buildingResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "building:Barn", category: "building" }), {
        placementHistory: buildingHistory,
      }),
    );

    expect(buildingResult).toMatchObject({ applied: true, validation: { valid: true } });
    expect(buildingResult.placementHistory.undoStates).toEqual([
      buildingHistory.currentState,
    ]);
    expect(buildingResult.placementHistory.currentState.buildings).toEqual([
      { instanceId: 1, buildingId: "Barn", x: 0, y: 0 },
    ]);

    const cropHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const cropResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory: cropHistory,
      }),
    );

    expect(cropResult).toMatchObject({ applied: true, validation: { valid: true } });
    expect(cropResult.placementHistory.undoStates).toEqual([cropHistory.currentState]);
    expect(cropResult.placementHistory.currentState.crops).toEqual([
      { cropId: "crop:24", x: 0, y: 0 },
    ]);
  });

  it("creates path and fence items with their validation layers and stable defaults", () => {
    const floorResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "floor:13", category: "floor" })),
    );
    const fenceResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "fence:322", category: "fence" })),
    );

    expect(floorResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            {
              instanceId: 1,
              itemId: "floor:13",
              x: 0,
              y: 0,
              layer: "path",
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
            },
          ],
        },
      },
    });
    expect(fenceResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: { items: [expect.objectContaining({ itemId: "fence:322", layer: "fence" })] },
      },
    });
  });

  it("returns the validator rejection and retains the exact history when placement is invalid", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const result = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory,
        mapPlacementGrid: createPlacementGrid({
          buildable: true,
          diggable: false,
          passable: true,
        }),
      }),
    );

    expect(result).toEqual({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "not-diggable", tile: { x: 0, y: 0 } },
    });
  });

  it("commits a placement when freePlacement bypasses the validator's normal rules", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const result = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory,
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid({
          buildable: false,
          diggable: false,
          passable: false,
        }),
      }),
    );

    expect(result).toMatchObject({
      applied: true,
      validation: { valid: true },
      placementHistory: {
        undoStates: [placementHistory.currentState],
        currentState: { crops: [{ cropId: "crop:24", x: 0, y: 0 }] },
      },
    });
  });

  it("returns a clear unapplied result for no selection and commits ordinary catalog items", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    expect(
      applyEditorCursorPlacement(
        createPlacementInput(null, { placementHistory }),
      ),
    ).toEqual({
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    });
    expect(
      applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: "object:390", category: "placeable" }),
          { placementHistory },
        ),
      ),
    ).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({ itemId: "object:390", layer: "item" })],
        },
      },
    });
  });

  it("places version-locked furniture and tree catalog IDs with their catalog metadata", () => {
    const furnitureResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({
          id: "furniture_724",
          category: "placeable",
          renderingMetadata: {
            kind: "furniture",
            furnitureType: "table",
            indoors: true,
            outdoors: true,
            rotationSprites: undefined,
            rotationTileSizes: undefined,
            wallMounted: false,
            isRug: false,
            isTable: true,
            isLongTable: false,
            bedType: null,
            compositeSprite: null,
          },
        }),
        { freePlacement: true },
      ),
    );

    expect(furnitureResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({
              itemId: "furniture_724",
              isLongTable: false,
              isRug: false,
              isTable: true,
              bedType: null,
            }),
          ],
        },
      },
    });

    for (const catalogItemId of ["fruittree_628", "wildtree_1"]) {
      const treeResult = applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: catalogItemId, category: "placeable" }),
          { freePlacement: true },
        ),
      );

      expect(treeResult).toMatchObject({
        applied: true,
        placementHistory: {
          currentState: {
            items: [expect.objectContaining({ itemId: catalogItemId })],
          },
        },
      });
    }
  });

  it("preserves the two-by-two footprint when placing a resource clump decor item", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({
          id: "clump_602",
          category: "decor",
          tileSize: { width: 2, height: 2 },
        }),
        { placementHistory, freePlacement: true },
      ),
    );

    expect(placementResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({
              footprint: { width: 2, height: 2 },
              itemId: "clump_602",
            }),
          ],
        },
      },
    });
  });

  it("rejects building catalog IDs that cannot be converted to metadata IDs", () => {
    expect(() =>
      applyEditorCursorPlacement(
        createPlacementInput(createCatalogItem({ id: "Barn", category: "building" })),
      ),
    ).toThrow(
      'Editor placement building catalog ID must match "building:<metadata ID>"; received "Barn".',
    );
  });

  it("rejects unknown building metadata IDs even when free placement is enabled", () => {
    expect(() =>
      applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: "building:Ghost", category: "building" }),
          { freePlacement: true },
        ),
      ),
    ).toThrow('unknown building metadata ID "Ghost"');
  });
});
