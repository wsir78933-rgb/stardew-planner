import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import { createMapPlacementGrid } from "../../src/placement/map-placement-grids";
import { isLocalRenderingTileset } from "../../src/rendering/map-rendering-contract";
import { loadPreparedDefaultMap } from "../../src/resources/default-map-resource";
import type { PreparedDefaultMap } from "../../src/resources/default-map-resource";
import type { TilesheetSeason } from "../../src/rendering/tilesheet-asset-resolver";

const localGameAssetUrlPrefix = "/game-assets/1.6.15/";
const newlyAddedExteriorMapIds = [
  "ginger-island-north",
  "ginger-island-south",
  "ginger-island-south-east",
  "ginger-island-east",
  "railroad",
  "backwoods",
  "secret-woods",
  "summit",
  "pelican-town",
  "cindersap-forest",
  "mountain",
  "pelican-beach",
  "calico-desert",
] as const;
const exteriorMapSeasons = ["spring", "summer", "fall", "winter"] as const;
const mapPlacementCapabilityFields = [
  "buildable",
  "crabPot",
  "diggable",
  "fruitTreePlantable",
  "fruitTreesRestricted",
  "noFurniture",
  "objectPlaceable",
  "passable",
  "treePlantable",
  "treePlantableOnDirt",
  "wall",
  "water",
] as const;

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("new exterior map resources", () => {
  it("loads each added map in all four seasons with complete placement layers and grids", async () => {
    const mapRenderOptions = createInitialMapRenderOptions();

    for (const mapId of newlyAddedExteriorMapIds) {
      for (const season of exteriorMapSeasons) {
        const preparedMap = await loadPreparedDefaultMap(
          { mapId, mapRenderOptions, season },
          { fetchMapAsset: fetchLocalGameAsset },
        );

        expect(preparedMap.mapId, `${mapId} ${season} prepared map`).toBe(mapId);
        expect(preparedMap.season, `${mapId} ${season} season`).toBe(season);
        expect(
          preparedMap.renderingContract.tilesets.length,
          `${mapId} ${season} tileset count`,
        ).toBeGreaterThan(0);
        assertRenderingTilesetFilesExist(preparedMap, mapId, season);

        const backLayers = preparedMap.parsedMap.tileLayers.filter(
          (tileLayer) => tileLayer.name === "Back",
        );
        const buildingsLayers = preparedMap.parsedMap.tileLayers.filter(
          (tileLayer) => tileLayer.name === "Buildings",
        );

        expect(backLayers, `${mapId} ${season} Back layer count`).toHaveLength(1);
        expect(buildingsLayers, `${mapId} ${season} Buildings layer count`).toHaveLength(1);

        const backLayer = backLayers[0];
        const buildingsLayer = buildingsLayers[0];
        if (backLayer === undefined || buildingsLayer === undefined) {
          throw new Error(
            `Exterior map ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} is missing its unique Back or Buildings layer.`,
          );
        }

        const mapTileCount = preparedMap.parsedMap.width * preparedMap.parsedMap.height;
        for (const tileLayer of [backLayer, buildingsLayer]) {
          expect(tileLayer.width, `${mapId} ${season} ${tileLayer.name} width`).toBe(
            preparedMap.parsedMap.width,
          );
          expect(tileLayer.height, `${mapId} ${season} ${tileLayer.name} height`).toBe(
            preparedMap.parsedMap.height,
          );
          expect(tileLayer.offsetX, `${mapId} ${season} ${tileLayer.name} x offset`).toBe(
            0,
          );
          expect(tileLayer.offsetY, `${mapId} ${season} ${tileLayer.name} y offset`).toBe(
            0,
          );
          expect(tileLayer.rawGids.length, `${mapId} ${season} ${tileLayer.name} tile count`).toBe(
            mapTileCount,
          );
        }

        if (season === "spring") {
          assertPlacementGridMatchesMap(preparedMap, mapId);
        }
      }
    }
  });
});

function assertRenderingTilesetFilesExist(
  preparedMap: PreparedDefaultMap,
  mapId: string,
  season: TilesheetSeason,
): void {
  for (const renderingTileset of preparedMap.renderingContract.tilesets) {
    if (!isLocalRenderingTileset(renderingTileset)) {
      throw new Error(
        `Exterior map ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} has unavailable tileset ${JSON.stringify(renderingTileset.knownUnavailable.outputPath)}: ${renderingTileset.knownUnavailable.reason}.`,
      );
    }

    const tilesetFilePath = getLocalGameAssetFilePath(renderingTileset.assetPath);
    if (!existsSync(tilesetFilePath)) {
      throw new Error(
        `Exterior map ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} requires missing tileset file ${JSON.stringify(tilesetFilePath)} from asset path ${JSON.stringify(renderingTileset.assetPath)}.`,
      );
    }
  }
}

function assertPlacementGridMatchesMap(
  preparedMap: PreparedDefaultMap,
  mapId: string,
): void {
  const placementGrid = createMapPlacementGrid(preparedMap.parsedMap);
  const mapTileCount = preparedMap.parsedMap.width * preparedMap.parsedMap.height;
  const firstTileCapabilities = placementGrid.capabilitiesByTile[0];

  expect(placementGrid.width, `${mapId} placement grid width`).toBe(
    preparedMap.parsedMap.width,
  );
  expect(placementGrid.height, `${mapId} placement grid height`).toBe(
    preparedMap.parsedMap.height,
  );
  expect(placementGrid.capabilitiesByTile, `${mapId} placement grid tile count`).toHaveLength(
    mapTileCount,
  );

  if (firstTileCapabilities === undefined) {
    throw new Error(
      `Exterior map ${JSON.stringify(mapId)} produced no placement capabilities for its first tile.`,
    );
  }

  expect(Object.keys(firstTileCapabilities).sort(), `${mapId} placement capability fields`).toEqual(
    [...mapPlacementCapabilityFields].sort(),
  );
  expect(
    Object.values(firstTileCapabilities).every(
      (capabilityValue) => typeof capabilityValue === "boolean",
    ),
    `${mapId} placement capability values`,
  ).toBe(true);
}

async function fetchLocalGameAsset(assetUrl: string) {
  const localAssetFilePath = getLocalGameAssetFilePath(assetUrl);
  return {
    ok: true,
    status: 200,
    text: () => readFile(localAssetFilePath, "utf8"),
  };
}

function getLocalGameAssetFilePath(assetUrl: string): string {
  if (
    !assetUrl.startsWith(localGameAssetUrlPrefix) ||
    assetUrl.split("/").includes("..")
  ) {
    throw new Error(
      `Exterior map resource test only accepts local game asset paths under ${JSON.stringify(localGameAssetUrlPrefix)}; received ${JSON.stringify(assetUrl)}.`,
    );
  }

  return join(process.cwd(), "public", assetUrl.slice(1));
}
