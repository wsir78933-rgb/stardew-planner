import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
} from "../../src/catalog";
import {
  applyEditorFill,
} from "../../src/editor/editor-fill-controller";
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
    allowedTools: ["cursor", "fill"],
    ...catalogItem,
  };
}

function createPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      crabPot: false,
    })),
  };
}

function createBlockedPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: false,
      diggable: false,
      passable: false,
      treePlantable: false,
      treePlantableOnDirt: false,
      crabPot: false,
    })),
  };
}

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {};
}

describe("applyEditorFill", () => {
  it("fills a floor rectangle atomically as one undoable history entry", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 4 });
    expect(fillResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 0, y: 0 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 1, y: 0 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 0, y: 1 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 1, y: 1 }),
    ]);
  });

  it("fills only a fence perimeter and keeps the source history unchanged when any tile is invalid", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fenceResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "fence:322", category: "fence" }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 2, y: 2 },
      mapPlacementGrid: createPlacementGrid(3, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fenceResult).toMatchObject({ applied: true, placedTileCount: 8 });
    expect(fenceResult.placementHistory.currentState.items).not.toContainEqual(
      expect.objectContaining({ x: 1, y: 1 }),
    );

    const invalidFillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 0 },
      mapPlacementGrid: createPlacementGrid(3, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(invalidFillResult).toMatchObject({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "outside-map", tile: { x: 3, y: 0 } },
    });
  });

  it("fills a complete standard farm-sized rectangle instead of rejecting a valid 5,200-tile gesture", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 79, y: 64 },
      mapPlacementGrid: createPlacementGrid(80, 65),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 5200 });
    expect(fillResult.placementHistory.currentState.items).toHaveLength(5200);
  });

  it("uses the enabled free-placement preference for every tile in a fill", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createBlockedPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
  });
});
