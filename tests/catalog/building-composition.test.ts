import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  createBuildingPlacementMetadata,
  getBuildingThumbnailCompositionLayers,
  type CatalogBuildingMultilayerLayer,
  type CatalogItem,
  type CatalogSeason,
  type CatalogSourceRect,
} from "../../src/catalog";
import { isBuildingPaintable } from "../../src/paint/building-paint";

type ExpectedBuildingComposition = readonly [
  buildingId: string,
  layerCount: number,
  sortTileOffset: number,
  baseFrame: readonly [number, number, number, number],
  paintMaskFilename: string | null,
  seasonalBaseFrameXs: readonly number[] | null,
];

const expectedBuildingCompositionManifest: readonly ExpectedBuildingComposition[] = [
  ["Coop", 8, 0, [0, 0, 96, 112], null, null],
  ["Big Coop", 8, 0, [0, 0, 96, 112], null, null],
  ["Deluxe Coop", 8, 0, [0, 0, 96, 112], "Deluxe Coop_PaintMask.png", null],
  ["Barn", 10, 0, [0, 0, 112, 112], null, null],
  ["Big Barn", 10, 0, [0, 0, 112, 112], null, null],
  ["Deluxe Barn", 10, 0, [0, 0, 112, 112], "Deluxe Barn_PaintMask.png", null],
  ["Slime Hutch", 8, 0, [0, 0, 112, 112], null, null],
  ["Mill", 6, 0, [0, 0, 64, 128], null, null],
  ["Fish Pond", 29, 4.5, [0, 0, 80, 80], null, null],
  ["Shed", 8, 0, [0, 0, 0, 0], null, null],
  ["Big Shed", 8, 0, [0, 0, 0, 0], "Big Shed_PaintMask.png", null],
  ["Silo", 4, 0, [0, 0, 0, 0], null, null],
  ["Well", 4, 0, [0, 0, 0, 0], null, null],
  ["Stable", 5, 1, [0, 0, 0, 0], "Stable_PaintMask.png", null],
  ["Shipping Bin", 4, 0, [0, 0, 0, 0], null, null],
  ["Junimo Hut", 4, 0, [0, 0, 48, 64], null, [0, 48, 96, 144]],
  ["Pet Bowl", 2, 1, [32, 0, 32, 32], null, null],
  ["Stone Pet Bowl", 2, 1, [32, 0, 32, 32], null, null],
  ["Hay Pet Bowl", 2, 1, [32, 0, 32, 32], null, null],
  ["Earth Obelisk", 4, 0, [0, 0, 0, 0], null, null],
  ["Water Obelisk", 4, 0, [0, 0, 0, 0], null, null],
  ["Desert Obelisk", 4, 0, [0, 0, 0, 0], null, null],
  ["Island Obelisk", 4, 0, [0, 0, 0, 0], null, null],
  ["Gold Clock", 4, 0, [0, 0, 0, 0], null, null],
  ["Cabin", 6, 1, [0, 0, 80, 112], null, null],
  ["Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Cabin_2", 1, 1, [160, 0, 80, 112], null, null],
  ["Plank Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Plank Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Plank Cabin_2", 1, 1, [160, 0, 80, 112], "Plank Cabin_PaintMask.png", null],
  ["Log Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Log Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Log Cabin_2", 1, 1, [160, 0, 80, 112], "Log Cabin_PaintMask.png", null],
  ["Neighbor Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Neighbor Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Neighbor Cabin_2", 1, 1, [160, 0, 80, 112], "Neighbor Cabin_PaintMask.png", null],
  ["Rustic Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Rustic Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Rustic Cabin_2", 1, 1, [160, 0, 80, 112], "Rustic Cabin_PaintMask.png", null],
  ["Beach Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Beach Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Beach Cabin_2", 1, 1, [160, 0, 80, 112], "Beach Cabin_PaintMask.png", null],
  ["Trailer Cabin", 1, 1, [0, 0, 80, 112], null, null],
  ["Trailer Cabin_1", 1, 1, [80, 0, 80, 112], null, null],
  ["Trailer Cabin_2", 1, 1, [160, 0, 80, 112], "Trailer Cabin_PaintMask.png", null],
  ["Farmhouse", 12, 2, [0, 0, 160, 144], "houses_PaintMask.png", null],
  ["Farmhouse_1", 3, 2, [0, 144, 160, 144], "houses_PaintMask.png", null],
  ["Farmhouse_2", 3, 2, [0, 288, 160, 144], "houses_PaintMask.png", null],
  ["Greenhouse", 8, 0, [0, 160, 112, 160], null, null],
];

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

function summarizeBaseFrame(
  baseLayer: CatalogBuildingMultilayerLayer | undefined,
): readonly [number, number, number, number] | null {
  if (baseLayer === undefined) {
    return null;
  }
  return [
    baseLayer.frame.x,
    baseLayer.frame.y,
    baseLayer.frame.width,
    baseLayer.frame.height,
  ];
}

describe("frozen building composition contract", () => {
  it("projects all 49 frozen building IDs through one complete composition manifest", async () => {
    const catalogItems = await loadLockedBuildingCatalog();

    const actualManifest = catalogItems.map((catalogItem) => {
      const renderingMetadata = catalogItem.renderingMetadata?.kind === "building-multilayer"
        ? catalogItem.renderingMetadata
        : undefined;
      const baseLayer = renderingMetadata?.layers.find((layer) =>
        layer.id === "Base" || layer.id === "FishPondBase"
      );
      const metadataRecord = renderingMetadata as unknown as Readonly<Record<string, unknown>> | undefined;
      const paintMaskLocalPath = typeof metadataRecord?.paintMaskLocalPath === "string"
        ? metadataRecord.paintMaskLocalPath
        : null;
      const seasonalFrames = baseLayer === undefined
        ? undefined
        : (baseLayer as unknown as Readonly<Record<string, unknown>>).seasonalFrames as
          | Readonly<Record<CatalogSeason, CatalogSourceRect>>
          | undefined;

      return [
        catalogItem.id.slice("building:".length),
        renderingMetadata?.layers.length ?? 0,
        renderingMetadata?.sortTileOffset ?? null,
        summarizeBaseFrame(baseLayer),
        paintMaskLocalPath?.split("/").pop() ?? null,
        seasonalFrames === undefined
          ? null
          : ["spring", "summer", "fall", "winter"].map(
              (season) => seasonalFrames[season as CatalogSeason].x,
            ),
      ];
    });

    expect(actualManifest).toEqual(expectedBuildingCompositionManifest);
    expect(actualManifest).toHaveLength(49);
  });

  it("projects placement metadata for all 49 FI building IDs from their frozen base contracts", async () => {
    const rawBuildings = JSON.parse(await readFile(
      path.join(process.cwd(), "public/game-assets/1.6.15/data/Buildings.json"),
      "utf8",
    )) as unknown;
    const metadataById = createBuildingPlacementMetadata(rawBuildings);

    expect(Object.keys(metadataById).sort()).toEqual(
      expectedBuildingCompositionManifest.map(([buildingId]) => buildingId).sort(),
    );
    for (const upgradeNumber of [1, 2]) {
      expect(metadataById[`Farmhouse_${String(upgradeNumber)}`]).toEqual(
        metadataById.Farmhouse,
      );
      expect(metadataById[`Cabin_${String(upgradeNumber)}`]).toEqual(
        metadataById.Cabin,
      );
      for (const cabinSkinId of [
        "Plank Cabin",
        "Log Cabin",
        "Neighbor Cabin",
        "Rustic Cabin",
        "Beach Cabin",
        "Trailer Cabin",
      ]) {
        expect(metadataById[`${cabinSkinId}_${String(upgradeNumber)}`]).toEqual(
          metadataById.Cabin,
        );
      }
    }
    expect(metadataById["Stone Pet Bowl"]).toEqual(metadataById["Pet Bowl"]);
    expect(metadataById["Hay Pet Bowl"]).toEqual(metadataById["Pet Bowl"]);
  });

  it("matches the frozen 13-ID building paint eligibility boundary", () => {
    const paintableBuildingIds = expectedBuildingCompositionManifest
      .filter(([, , , , paintMaskFilename]) => paintMaskFilename !== null)
      .map(([buildingId]) => buildingId);
    const allBuildingIds = expectedBuildingCompositionManifest.map(([buildingId]) => buildingId);

    expect(allBuildingIds.filter(isBuildingPaintable)).toEqual(
      paintableBuildingIds,
    );
  });

  it("retains the frozen PaintData regions with the composition paint mask", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const deluxeCoop = catalogItems.find((catalogItem) =>
      catalogItem.id === "building:Deluxe Coop"
    );
    const renderingMetadata = deluxeCoop?.renderingMetadata as unknown as
      | Readonly<Record<string, unknown>>
      | undefined;

    expect(renderingMetadata?.paintMaskLocalPath).toBe(
      "/game-assets/1.6.15/buildings/Deluxe Coop_PaintMask.png",
    );
    expect(renderingMetadata?.paintRegions).toEqual([
      { id: "color1", label: "Building", minimumLight: -25, maximumLight: 0 },
      { id: "color2", label: "Roof", minimumLight: -15, maximumLight: 5 },
      { id: "color3", label: "Trim", minimumLight: -25, maximumLight: 0 },
    ]);
  });

  it("derives catalog-card layers from the same Canvas composition objects", async () => {
    const catalogModule = await import("../../src/catalog");
    const getBuildingThumbnailCompositionLayers = (
      catalogModule as unknown as Readonly<Record<string, unknown>>
    ).getBuildingThumbnailCompositionLayers;

    expect(getBuildingThumbnailCompositionLayers).toBeTypeOf("function");
    if (typeof getBuildingThumbnailCompositionLayers !== "function") {
      return;
    }

    const catalogItems = await loadLockedBuildingCatalog();
    const selectThumbnailLayers = getBuildingThumbnailCompositionLayers as (
      catalogItem: CatalogItem,
      season: CatalogSeason,
      variant: number,
    ) => readonly Readonly<{
      frame: CatalogSourceRect;
      layer: CatalogBuildingMultilayerLayer;
    }>[];
    const expectedThumbnailLayerIds = {
      Coop: ["Base", "Default_AnimalDoor"],
      Farmhouse: ["Base", "Default_Mailbox", "Mailbox"],
      "Fish Pond": ["FishPondWater", "FishPondBase", "FishPondNetting"],
    } as const;

    for (const [buildingId, expectedLayerIds] of Object.entries(
      expectedThumbnailLayerIds,
    )) {
      const catalogItem = catalogItems.find((item) =>
        item.id === `building:${buildingId}`
      );
      if (catalogItem === undefined) {
        throw new Error(`Expected locked building catalog item ${JSON.stringify(buildingId)}.`);
      }
      const renderingMetadata = catalogItem.renderingMetadata;
      if (renderingMetadata?.kind !== "building-multilayer") {
        throw new Error(`Expected building composition metadata for ${JSON.stringify(buildingId)}.`);
      }
      const thumbnailLayers = selectThumbnailLayers(catalogItem, "spring", 0);

      expect(thumbnailLayers.map(({ layer }) => layer.id)).toEqual(
        expectedLayerIds,
      );
      expect(thumbnailLayers.every(({ layer }) =>
        renderingMetadata.layers.includes(layer)
      )).toBe(true);
      expect(catalogItem).not.toHaveProperty("buildingThumbnailLayers");
    }
  });

  it("locks the only catalog thumbnail Cursor layer to the Shipping Bin lid source frame", async () => {
    const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
    const catalogItems = await loadLockedBuildingCatalog();
    const cursorThumbnailLayers = catalogItems.flatMap((catalogItem) =>
      getBuildingThumbnailCompositionLayers(catalogItem, "spring", 0).flatMap(
        ({ frame, layer }) => (
          (layer.textureLocalPath ?? catalogItem.textureLocalPath) === cursorTextureLocalPath
            ? [{ catalogItemId: catalogItem.id, frame, layerId: layer.id }]
            : []
        ),
      )
    );

    expect(cursorThumbnailLayers).toEqual([
      {
        catalogItemId: "building:Shipping Bin",
        layerId: "ShippingBinLid",
        frame: { kind: "source-rect", x: 134, y: 226, width: 30, height: 25 },
      },
    ]);
  });
});
