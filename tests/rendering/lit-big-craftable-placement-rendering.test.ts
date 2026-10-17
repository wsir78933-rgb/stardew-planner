import { describe, expect, it } from "vitest";
import { resolveLocalGameAssetPath } from "../../src/assets/local-game-asset-path";
import {
  getLockedLitBigCraftableRenderingMetadata,
  type CatalogItem,
} from "../../src/catalog";
import { createNightLightRenderDescriptors } from "../../src/night-lights/night-light-rendering";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";
import { createLitBigCraftablePlacementRenderLayers } from "../../src/rendering/lit-big-craftable-placement-rendering";

const lockedLitBigCraftableRecordIds = [
  "143",
  "144",
  "145",
  "146",
  "147",
  "148",
  "149",
  "150",
  "151",
  "278",
] as const;

function createLockedLitBigCraftableCatalogItem(recordId: string): CatalogItem {
  const renderingMetadata = getLockedLitBigCraftableRenderingMetadata(recordId);
  if (renderingMetadata === undefined) {
    throw new Error(
      `Locked lit BigCraftable record ${recordId} has no rendering metadata.`,
    );
  }
  const recordNumber = Number(recordId);
  if (!Number.isInteger(recordNumber)) {
    throw new Error(
      `Locked lit BigCraftable record ${recordId} is not an integer.`,
    );
  }

  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: `big-craftable:${recordId}`,
    name: `Lit ${recordId}`,
    nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
    renderingMetadata,
    sprite: { kind: "sprite-index", index: recordNumber },
    textureLocalPath: resolveLocalGameAssetPath("tilesheets/craftables.png"),
    tileSize: { width: 1, height: 2 },
  };
}

function createPlacementItem(
  itemId: string,
  variant: number,
  nightLightState?: "off",
): PlacementItem {
  return {
    bedType: null,
    flipped: false,
    footprint: { width: 1, height: 1 },
    instanceId: 1,
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId,
    layer: "item",
    locked: false,
    rotation: 0,
    tintColor: "#ffffff",
    variant,
    x: 1,
    y: 1,
    ...(nightLightState === undefined ? {} : { nightLightState }),
  };
}

function readPlacementLayerCount(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): number {
  const layers = createLitBigCraftablePlacementRenderLayers(
    catalogItem,
    placementItem,
    { x: 0, y: 0, width: 16, height: 32 },
  );
  if (layers === null) {
    throw new Error(
      `Lit BigCraftable ${catalogItem.id} did not create placement layers for variant ${String(placementItem.variant)}.`,
    );
  }
  return layers.length;
}

function readNightLightCount(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): number {
  return createNightLightRenderDescriptors({
    catalogItems: [catalogItem],
    isNightMode: true,
    placementSnapshot: {
      ...createEmptyPlacementSnapshot(),
      items: [placementItem],
      nextItemId: 2,
    },
    tileHeight: 16,
    tileWidth: 16,
  }).length;
}

describe("lit BigCraftable placement rendering", () => {
  it("keeps the body only when variant is unlit or a legacy night light is off", () => {
    for (const recordId of lockedLitBigCraftableRecordIds) {
      const catalogItem = createLockedLitBigCraftableCatalogItem(recordId);
      if (catalogItem.renderingMetadata?.kind !== "lit-big-craftable") {
        throw new Error(
          `Locked lit BigCraftable ${catalogItem.id} is missing flame metadata.`,
        );
      }
      const litLayerCount = catalogItem.renderingMetadata.flameLayers.length + 2;
      const litItem = createPlacementItem(catalogItem.id, 0);
      const unlitItem = createPlacementItem(catalogItem.id, 1);
      const legacyOffItem = createPlacementItem(catalogItem.id, 0, "off");

      expect(readPlacementLayerCount(catalogItem, litItem), recordId).toBe(litLayerCount);
      expect(readNightLightCount(catalogItem, litItem), recordId).toBe(1);
      expect(readPlacementLayerCount(catalogItem, unlitItem), recordId).toBe(1);
      expect(readNightLightCount(catalogItem, unlitItem), recordId).toBe(0);
      expect(readPlacementLayerCount(catalogItem, legacyOffItem), recordId).toBe(1);
      expect(readNightLightCount(catalogItem, legacyOffItem), recordId).toBe(0);
    }
  });
});
