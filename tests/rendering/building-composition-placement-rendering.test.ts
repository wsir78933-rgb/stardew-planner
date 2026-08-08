import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  type CatalogItem,
  type CatalogSeason,
} from "../../src/catalog";
import {
  createPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../../src/rendering/placement-rendering";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";

async function loadLockedBuildingCatalog(): Promise<readonly CatalogItem[]> {
  const rawBuildings = JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data/Buildings.json"),
    "utf8",
  )) as unknown;

  return createBuildingCatalogFromDataset(
    rawBuildings,
    catalogDatasetUrls.buildings,
  ).items;
}

function getRequiredBuildingCatalogItem(
  catalogItems: readonly CatalogItem[],
  buildingId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((item) =>
    item.id === `building:${buildingId}`
  );
  if (catalogItem === undefined) {
    throw new Error(`Expected locked building catalog item ${JSON.stringify(buildingId)}.`);
  }
  return catalogItem;
}

function renderBuilding(
  catalogItem: CatalogItem,
  season: CatalogSeason = "spring",
  pathItems: readonly PlacementItem[] = [],
  paintColors?: Readonly<{ color1: string; color2: string; color3: string }>,
): readonly PlacementRenderEntry[] {
  const pathCatalogItem: CatalogItem = {
    id: "floor:1",
    name: "Wood Floor",
    category: "floor",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
  };
  return createPlacementRenderEntries(
    {
      ...createEmptyPlacementSnapshot(),
      buildings: [{
        instanceId: 1,
        buildingId: catalogItem.id.slice("building:".length),
        x: 2,
        y: 3,
        ...(paintColors === undefined ? {} : { paintColors }),
      }],
      items: pathItems,
      nextBuildingId: 2,
      nextItemId: pathItems.length + 1,
    },
    pathItems.length === 0 ? [catalogItem] : [catalogItem, pathCatalogItem],
    season,
  );
}

function summarizeLayer(entry: PlacementRenderEntry) {
  return {
    layerId: entry.layerId,
    frame: entry.frame,
    pixelGeometry: entry.pixelGeometry,
    textureLocalPath: entry.textureLocalPath,
    zIndex: entry.zIndex,
  };
}

function expectedPixelGeometry(positionX: number, positionY: number) {
  return {
    anchorX: 0,
    anchorY: 0,
    horizontalScale: 1,
    positionX,
    positionY,
  };
}

function createExpectedShadowLayers(
  width: number,
  positionY: number,
  zIndex: number,
) {
  return Array.from({ length: width }, (_, columnIndex) => ({
    layerId: columnIndex === 0
      ? "Shadow_left"
      : columnIndex === width - 1
        ? "Shadow_right"
        : `Shadow_mid_${String(columnIndex)}`,
    frame: {
      x: columnIndex === 0 ? 656 : columnIndex === width - 1 ? 688 : 672,
      y: 394,
      width: 16,
      height: 16,
    },
    pixelGeometry: expectedPixelGeometry(32 + columnIndex * 16, positionY),
    textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
    zIndex,
  }));
}

describe("frozen building placement composition", () => {
  it("renders Coop, Shipping Bin, Greenhouse, Farmhouse, and Junimo Hut in exact frozen layer order and geometry", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const coopLayers = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Coop"),
    ).map(summarizeLayer);
    expect(coopLayers).toEqual([
      ...createExpectedShadowLayers(6, 96, 10.5),
      {
        layerId: "Base",
        frame: { x: 0, y: 0, width: 96, height: 112 },
        pixelGeometry: expectedPixelGeometry(32, -16),
        textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
        zIndex: 10.5,
      },
      {
        layerId: "Default_AnimalDoor",
        frame: { x: 0, y: 112, width: 16, height: 16 },
        pixelGeometry: expectedPixelGeometry(64, 80),
        textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
        zIndex: 10.5,
      },
    ]);

    const shippingBinLayers = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Shipping Bin"),
    ).map(summarizeLayer);
    expect(shippingBinLayers).toEqual([
      ...createExpectedShadowLayers(2, 64, 6.5),
      {
        layerId: "Base",
        frame: null,
        pixelGeometry: expectedPixelGeometry(32, 32),
        textureLocalPath: "/game-assets/1.6.15/buildings/Shipping Bin.png",
        zIndex: 6.5,
      },
      {
        layerId: "ShippingBinLid",
        frame: { x: 134, y: 226, width: 30, height: 25 },
        pixelGeometry: expectedPixelGeometry(33, 25),
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
        zIndex: 6.5,
      },
    ]);

    const greenhouseLayers = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Greenhouse"),
    ).map(summarizeLayer);
    expect(greenhouseLayers).toEqual([
      {
        layerId: "GreenhouseShadow",
        frame: { x: 112, y: 144, width: 128, height: 144 },
        pixelGeometry: expectedPixelGeometry(16, 48),
        textureLocalPath: "/game-assets/1.6.15/buildings/Greenhouse.png",
        zIndex: 0.05,
      },
      {
        layerId: "Base",
        frame: { x: 0, y: 160, width: 112, height: 160 },
        pixelGeometry: expectedPixelGeometry(32, -16),
        textureLocalPath: "/game-assets/1.6.15/buildings/Greenhouse.png",
        zIndex: 16.5,
      },
      ...Array.from({ length: 3 }, (_, columnIndex) => ({
        layerId: `GreenhouseEntrance_top_${String(columnIndex)}`,
        frame: { x: 192, y: 512, width: 16, height: 16 },
        pixelGeometry: expectedPixelGeometry(64 + columnIndex * 16, 144),
        textureLocalPath: "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png",
        zIndex: 16.5,
      })),
      ...Array.from({ length: 3 }, (_, columnIndex) => ({
        layerId: `GreenhouseEntrance_bottom_${String(columnIndex)}`,
        frame: { x: 208, y: 528, width: 16, height: 16 },
        pixelGeometry: expectedPixelGeometry(64 + columnIndex * 16, 160),
        textureLocalPath: "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png",
        zIndex: 16.5,
      })),
    ]);

    const farmhouseLayers = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Farmhouse"),
    ).map(summarizeLayer);
    expect(farmhouseLayers).toEqual([
      ...createExpectedShadowLayers(9, 128, 10.5),
      {
        layerId: "Base",
        frame: { x: 0, y: 0, width: 160, height: 144 },
        pixelGeometry: expectedPixelGeometry(16, -14),
        textureLocalPath: "/game-assets/1.6.15/buildings/houses.png",
        zIndex: 10.5,
      },
      {
        layerId: "Default_Mailbox",
        frame: { x: 0, y: 0, width: 16, height: 32 },
        pixelGeometry: expectedPixelGeometry(162, 98),
        textureLocalPath: "/game-assets/1.6.15/buildings/houses.png",
        zIndex: 10.5,
      },
      {
        layerId: "Mailbox",
        frame: { x: 0, y: 0, width: 16, height: 32 },
        pixelGeometry: expectedPixelGeometry(178, 96),
        textureLocalPath: "/game-assets/1.6.15/buildings/Mailbox.png",
        zIndex: 15,
      },
    ]);

    const junimoLayers = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Junimo Hut"),
      "fall",
    ).map(summarizeLayer);
    expect(junimoLayers).toEqual([
      ...createExpectedShadowLayers(3, 80, 8.5),
      {
        layerId: "Base",
        frame: { x: 96, y: 0, width: 48, height: 64 },
        pixelGeometry: expectedPixelGeometry(32, 16),
        textureLocalPath: "/game-assets/1.6.15/buildings/Junimo Hut.png",
        zIndex: 8.5,
      },
    ]);
  });

  it("assigns frozen z to every layer for all 49 buildings, including detached exceptions", async () => {
    const catalogItems = await loadLockedBuildingCatalog();

    for (const catalogItem of catalogItems) {
      const renderingMetadata = catalogItem.renderingMetadata;
      if (renderingMetadata?.kind !== "building-multilayer") {
        expect.fail(`Missing building composition for ${catalogItem.id}.`);
      }
      const expectedBuildingZ =
        (3 + catalogItem.tileSize.height - renderingMetadata.sortTileOffset) * 2 - 1.5;

      for (const entry of renderBuilding(catalogItem)) {
        const expectedZ = entry.layerId === "GreenhouseShadow"
          ? 0.05
          : catalogItem.id.startsWith("building:Farmhouse") && entry.layerId === "Mailbox"
            ? 15
            : expectedBuildingZ;
        expect(
          { buildingId: catalogItem.id, layerId: entry.layerId, zIndex: entry.zIndex },
        ).toEqual({
          buildingId: catalogItem.id,
          layerId: entry.layerId,
          zIndex: expectedZ,
        });
      }
    }
  });

  it("switches the Junimo Hut base frame across all four frozen seasons", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const junimoHut = getRequiredBuildingCatalogItem(catalogItems, "Junimo Hut");
    const baseFrameBySeason = Object.fromEntries(
      (["spring", "summer", "fall", "winter"] as const).map((season) => [
        season,
        renderBuilding(junimoHut, season).find((entry) => entry.layerId === "Base")?.frame,
      ]),
    );

    expect(baseFrameBySeason).toEqual({
      spring: { x: 0, y: 0, width: 48, height: 64 },
      summer: { x: 48, y: 0, width: 48, height: 64 },
      fall: { x: 96, y: 0, width: 48, height: 64 },
      winter: { x: 144, y: 0, width: 48, height: 64 },
    });
  });

  it("hides only the Greenhouse entrance tile occupied by a path", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const pathItem: PlacementItem = {
      instanceId: 1,
      itemId: "floor:1",
      x: 4,
      y: 9,
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
    };

    const layerIds = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Greenhouse"),
      "spring",
      [pathItem],
    ).map((entry) => entry.layerId);

    expect(layerIds).not.toContain("GreenhouseEntrance_top_0");
    expect(layerIds).toContain("GreenhouseEntrance_top_1");
    expect(layerIds).toContain("GreenhouseEntrance_bottom_0");
  });

  it("paints only same-texture Farmhouse layers and leaves cursor and explicit Mailbox layers unpainted", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const entries = renderBuilding(
      getRequiredBuildingCatalogItem(catalogItems, "Farmhouse"),
      "spring",
      [],
      { color1: "#112233", color2: "#445566", color3: "#778899" },
    );
    const paintedLayerIds = entries
      .filter((entry) => entry.buildingPaint !== undefined)
      .map((entry) => entry.layerId);

    expect(paintedLayerIds).toEqual(["Base", "Default_Mailbox"]);
    expect(entries.find((entry) => entry.layerId === "Base")?.buildingPaint)
      .toEqual({
        colors: { color1: "#112233", color2: "#445566", color3: "#778899" },
        paintMaskLocalPath: "/game-assets/1.6.15/buildings/houses_PaintMask.png",
      });
    expect(entries.find((entry) => entry.layerId === "Shadow_left")?.buildingPaint)
      .toBeUndefined();
    expect(entries.find((entry) => entry.layerId === "Mailbox")?.buildingPaint)
      .toBeUndefined();
  });

  it("fails fast instead of falling back when building composition metadata is missing or corrupt", () => {
    const missingMetadataCatalogItem: CatalogItem = {
      id: "building:Coop",
      name: "Coop",
      category: "building",
      tileSize: { width: 6, height: 3 },
      textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 96, height: 112 },
      allowedTools: ["cursor", "multi-select", "erase"],
    };
    const corruptMetadataCatalogItem = {
      ...missingMetadataCatalogItem,
      renderingMetadata: {
        buildingId: "Coop",
        kind: "building-multilayer",
        layers: [],
        sortTileOffset: 0,
      },
    } as CatalogItem;
    const createSingleBuildingSnapshot = () => ({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Coop", x: 2, y: 3 }],
      nextBuildingId: 2,
    });

    expect(() => createPlacementRenderEntries(
      createSingleBuildingSnapshot(),
      [missingMetadataCatalogItem],
    )).toThrow('building "Coop" requires frozen building composition metadata');
    expect(() => createPlacementRenderEntries(
      createSingleBuildingSnapshot(),
      [corruptMetadataCatalogItem],
    )).toThrow('Building multilayer rendering metadata "Coop" layers must be a non-empty array');
  });
});
