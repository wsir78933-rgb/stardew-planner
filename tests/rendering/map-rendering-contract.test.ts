import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  assertLocalGameAssetPath,
  createMapRenderingContract,
  isLocalRenderingTileset,
  type RenderingTileset,
} from "../../src/rendering/map-rendering-contract";
import { createMapWaterTilePositions } from "../../src/rendering/map-water-animation";
import { getBaseTileGid } from "../../src/tmx/decode-tile-layer-data";
import { plannerMaps } from "../../src/maps/map-catalog";
import { parseTmxMap } from "../../src/tmx/parse-tmx-map";

const gameAssetsRootDirectory = path.join(
  process.cwd(),
  "public/game-assets/1.6.15",
);

const localAssetRoot = "/game-assets/1.6.15/";

async function parseLockedMap(relativePath: string) {
  const mapXml = await readFile(
    path.join(gameAssetsRootDirectory, relativePath),
    "utf8",
  );

  return parseTmxMap(mapXml);
}

function getLocalAssetPaths(
  renderingTilesets: readonly RenderingTileset[],
): string[] {
  return renderingTilesets
    .filter(isLocalRenderingTileset)
    .map((renderingTileset) => renderingTileset.assetPath);
}

function getPlannerMapAssetPath(plannerMap: (typeof plannerMaps)[number]): string {
  if (!("modId" in plannerMap)) {
    return `maps/${plannerMap.mapFile}`;
  }

  return `mods/${plannerMap.modId}/${plannerMap.mapFile}`;
}

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("createMapRenderingContract", () => {
  it("keeps Farm tilesets and visible layers in TMX order with manifest-backed local paths", async () => {
    const parsedFarmMap = await parseLockedMap("maps/Farm.tmx");
    const farmContract = createMapRenderingContract({
      mapId: "standard",
      parsedMap: parsedFarmMap,
      requestedSeason: "spring",
    });

    expect(farmContract.visibleTileLayers.map((layer) => layer.name)).toEqual([
      "Back",
      "Buildings",
      "Front",
      "AlwaysFront",
      "AlwaysFront2",
    ]);
    expect(parsedFarmMap.tileLayers.map((layer) => layer.name)).toContain("Paths");
    const localFarmAssetPaths = getLocalAssetPaths(farmContract.tilesets);

    expect(localFarmAssetPaths).toEqual([
      `${localAssetRoot}tilesheets/spring_outdoorTileSheet_extra.png`,
      `${localAssetRoot}tilesheets/paths.png`,
      `${localAssetRoot}tilesheets/spring_outdoorsTileSheet.png`,
      `${localAssetRoot}tilesheets/spring_outdoorsTileSheet2.png`,
    ]);
    expect(farmContract.tilesets[0]).toMatchObject({
      firstGid: 1,
      tileWidth: 16,
      tileHeight: 16,
      imageWidth: 128,
      imageHeight: 128,
    });
    expect(
      localFarmAssetPaths.every((assetPath) =>
        assetPath.startsWith(localAssetRoot),
      ),
    ).toBe(true);
    const animatedTileset = parsedFarmMap.tilesets[2];

    expect(animatedTileset).toBeDefined();
    expect(animatedTileset?.tileAnimations?.get(208)).toEqual([
      { tileId: 208, durationMilliseconds: 1000 },
      { tileId: 1207, durationMilliseconds: 1000 },
    ]);
    expect(farmContract.tileAnimationsByGid.get((animatedTileset?.firstGid ?? 0) + 208)).toEqual({
      frames: [
        { gid: (animatedTileset?.firstGid ?? 0) + 208, durationMilliseconds: 1000 },
        { gid: (animatedTileset?.firstGid ?? 0) + 1207, durationMilliseconds: 1000 },
      ],
      durationMilliseconds: 2000,
    });
    expect(farmContract.waterTileGids.has((animatedTileset?.firstGid ?? 0) + 209)).toBe(true);
  });

  it("uses the parsed map SeasonOverride instead of the requested season", async () => {
    const islandContract = createMapRenderingContract({
      mapId: "ginger-island",
      parsedMap: await parseLockedMap("maps/Island_W.tmx"),
      requestedSeason: "winter",
    });

    expect(islandContract.effectiveSeason).toBe("summer");
    expect(
      getLocalAssetPaths(islandContract.tilesets),
    ).toContain(`${localAssetRoot}tilesheets/summer_outdoorsTileSheet.png`);
  });

  it("treats empty and false Water values as false and accepts other non-empty values", async () => {
    const parsedFarmMap = await parseLockedMap("maps/Farm.tmx");
    const firstTileset = parsedFarmMap.tilesets[0];
    expect(firstTileset).toBeDefined();
    if (firstTileset === undefined || firstTileset.tileCount < 5) {
      throw new Error("Farm TMX must have a first tileset with at least five tiles.");
    }

    const tileProperties = new Map(firstTileset.tileProperties);
    tileProperties.set(0, { Buildable: "T" });
    tileProperties.set(1, { Water: "" });
    tileProperties.set(2, { Water: "FALSE" });
    tileProperties.set(3, { Water: "F" });
    tileProperties.set(4, { Water: "t" });
    tileProperties.set(5, { Water: "True" });
    const parsedFarmMapWithWaterValues = {
      ...parsedFarmMap,
      tilesets: [
        { ...firstTileset, tileProperties },
        ...parsedFarmMap.tilesets.slice(1),
      ],
    };
    const farmContract = createMapRenderingContract({
      mapId: "standard",
      parsedMap: parsedFarmMapWithWaterValues,
      requestedSeason: "spring",
    });

    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 0)).toBe(false);
    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 1)).toBe(false);
    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 2)).toBe(false);
    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 3)).toBe(false);
    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 4)).toBe(true);
    expect(farmContract.waterTileGids.has(firstTileset.firstGid + 5)).toBe(true);
  });

  it("recognizes Grandpa's lowercase t marker but collects water only from Back", async () => {
    const parsedGrandpasMap = await parseLockedMap(
      "mods/flashshifter.GrandpasFarm/GrandpasFarm.tmx",
    );
    const grandpasContract = createMapRenderingContract({
      mapId: "grandpas",
      parsedMap: parsedGrandpasMap,
      requestedSeason: "spring",
    });
    const markerX = 7;
    const markerY = 92;
    const backLayer = grandpasContract.visibleTileLayers.find(
      (layer) => layer.name === "Back",
    );
    const alwaysFrontLayer = grandpasContract.visibleTileLayers.find(
      (layer) => layer.name === "AlwaysFront",
    );

    expect(backLayer).toBeDefined();
    expect(alwaysFrontLayer).toBeDefined();
    if (backLayer === undefined || alwaysFrontLayer === undefined) {
      throw new Error("Grandpa's Farm must contain Back and AlwaysFront layers.");
    }

    const markerIndex = markerY * alwaysFrontLayer.width + markerX;
    const frontMarkerGid = getBaseTileGid(alwaysFrontLayer.rawGids[markerIndex] ?? 0);
    const backGid = getBaseTileGid(backLayer.rawGids[markerIndex] ?? 0);
    const waterTilePositions = createMapWaterTilePositions(grandpasContract);

    expect(frontMarkerGid).toBe(11908);
    expect(grandpasContract.waterTileGids.has(frontMarkerGid)).toBe(true);
    expect(grandpasContract.waterTileGids.has(backGid)).toBe(false);
    expect(
      waterTilePositions.some(
        (waterTilePosition) =>
          waterTilePosition.tileX === markerX && waterTilePosition.tileY === markerY,
      ),
    ).toBe(false);
    expect(
      waterTilePositions.every(
        (waterTilePosition) =>
          grandpasContract.visibleTileLayers[waterTilePosition.layerIndex]?.name === "Back",
      ),
    ).toBe(true);
  });

  it("omits the known hidden Paths layer without changing the remaining XML order", async () => {
    const meadowlandsContract = createMapRenderingContract({
      mapId: "more-lively-meadowlands",
      parsedMap: await parseLockedMap(
        "mods/aimon111.morelivelymeadowlandsfarm/more-lively-meadowlands.tmx",
      ),
      requestedSeason: "spring",
    });

    expect(
      meadowlandsContract.visibleTileLayers.some(
        (layer) => layer.name === "Paths",
      ),
    ).toBe(false);
    expect(meadowlandsContract.visibleTileLayers.map((layer) => layer.name)).toEqual(
      [
        "Back",
        "Back1",
        "Back2",
        "Buildings",
        "Buildings1",
        "Buildings2",
        "Buildings3",
        "Front",
        "AlwaysFront",
        "AlwaysFront1",
        "AlwaysFront2",
        "AlwaysFront3",
        "AlwaysFront4",
      ],
    );
  });

  it("resolves Waterfall Forest Mod tilesheets and its known seasonal spring fallbacks", async () => {
    const waterfallForestContract = createMapRenderingContract({
      mapId: "waterfall-forest",
      parsedMap: await parseLockedMap(
        "mods/archibaldtk.waterfallforestfarm/waterfall-forest.tmx",
      ),
      requestedSeason: "fall",
    });

    expect(
      waterfallForestContract.tilesets.find(
        (tileset) => tileset.source === "spring_daisyextras.png",
      ),
    ).toMatchObject({
      assetPath:
        `${localAssetRoot}mods/archibaldtk.waterfallforestfarm/spring_daisyextras.png`,
      usedSpringFallback: true,
    });
    expect(
      waterfallForestContract.tilesets.find(
        (tileset) => tileset.source === "spring_ATK_AToMS_EXground.png",
      ),
    ).toMatchObject({
      assetPath:
        `${localAssetRoot}mods/archibaldtk.waterfallforestfarm/spring_ATK_AToMS_EXground.png`,
      usedSpringFallback: true,
    });
    expect(
      waterfallForestContract.tilesets.find(
        (tileset) => tileset.source === "spring_town.png",
      ),
    ).toMatchObject({
      assetPath: `${localAssetRoot}tilesheets/fall_town.png`,
      usedSpringFallback: false,
    });
  });

  it.each(["spring", "summer", "fall", "winter"] as const)(
    "creates the Capitalist Dream 2 contract in %s with only its confirmed unavailable tileset marked",
    async (requestedSeason) => {
      const capitalistDreamTwoContract = createMapRenderingContract({
        mapId: "capitalist-dream-2",
        parsedMap: await parseLockedMap(
          "mods/daisyniko.capitalistdreamfarm2/capitalist-dream-2.tmx",
        ),
        requestedSeason,
      });

      const unavailableTilesets = capitalistDreamTwoContract.tilesets.filter(
        (tileset) => "knownUnavailable" in tileset,
      );
      const availableTilesets = capitalistDreamTwoContract.tilesets.filter(
        (tileset) => !("knownUnavailable" in tileset),
      );

      expect(unavailableTilesets).toEqual([
        expect.objectContaining({
          source: "DesertTiles.png",
          knownUnavailable: {
            outputPath:
              "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
            reason:
              "The locked Stardew Planner 1.6.15 source returned HTTP 404 for this required tilesheet.",
          },
        }),
      ]);
      expect(
        unavailableTilesets[0] && "assetPath" in unavailableTilesets[0],
      ).toBe(false);
      expect(availableTilesets).toHaveLength(9);
      expect(
        availableTilesets
          .filter(isLocalRenderingTileset)
          .every((tileset) => tileset.assetPath.startsWith(localAssetRoot)),
      ).toBe(true);
    },
  );

  it.each(["spring", "summer", "fall", "winter"] as const)(
    "retains local asset paths for every available map tileset in %s",
    async (requestedSeason) => {
      const renderingContracts = await Promise.all(
        plannerMaps.map(async (plannerMap) =>
          createMapRenderingContract({
            mapId: plannerMap.id,
            parsedMap: await parseLockedMap(getPlannerMapAssetPath(plannerMap)),
            requestedSeason,
          }),
        ),
      );
      const allTilesets = renderingContracts.flatMap(
        (renderingContract) => renderingContract.tilesets,
      );
      const unavailableTilesets = allTilesets.filter(
        (tileset) => "knownUnavailable" in tileset,
      );
      const availableTilesets = allTilesets.filter(
        (tileset) => !("knownUnavailable" in tileset),
      );

      expect(unavailableTilesets).toEqual([
        expect.objectContaining({
          source: "DesertTiles.png",
          knownUnavailable: {
            outputPath:
              "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
            reason:
              "The locked Stardew Planner 1.6.15 source returned HTTP 404 for this required tilesheet.",
          },
        }),
      ]);
      expect(
        availableTilesets
          .filter(isLocalRenderingTileset)
          .every((tileset) => tileset.assetPath.startsWith(localAssetRoot)),
      ).toBe(true);
    },
  );

  it("retains spouseRooms layer dimensions instead of replacing them with map dimensions", async () => {
    const parsedSpouseRoomsMap = await parseLockedMap("maps/spouseRooms.tmx");
    const spouseRoomsContract = createMapRenderingContract({
      mapId: "farmhouse-2",
      parsedMap: parsedSpouseRoomsMap,
      requestedSeason: "spring",
    });

    expect(
      parsedSpouseRoomsMap.tileLayers.find(
        (layer) => layer.name === "Paths",
      ),
    ).toMatchObject({
      width: 100,
      height: 25,
    });
    expect(
      spouseRoomsContract.visibleTileLayers.some((layer) => layer.name === "Paths"),
    ).toBe(false);
  });

  it("fails fast for invalid request map IDs and seasons", async () => {
    const parsedFarmMap = await parseLockedMap("maps/Farm.tmx");

    expect(() =>
      createMapRenderingContract({
        mapId: "missing-map",
        parsedMap: parsedFarmMap,
        requestedSeason: "spring",
      }),
    ).toThrow("missing-map");
    expect(() =>
      createMapRenderingContract({
        mapId: "standard",
        parsedMap: parsedFarmMap,
        requestedSeason: "autumn" as never,
      }),
    ).toThrow("autumn");
  });
});

describe("assertLocalGameAssetPath", () => {
  it("rejects any non-local URL or unsafe local path with the exact path value", () => {
    expect(() =>
      assertLocalGameAssetPath("https://assets.stardewplan.com/assets/1.6.15/tilesheets/paths.png"),
    ).toThrow("https://assets.stardewplan.com/assets/1.6.15/tilesheets/paths.png");
    expect(() =>
      assertLocalGameAssetPath("/game-assets/1.6.15/tilesheets/../paths.png"),
    ).toThrow("/game-assets/1.6.15/tilesheets/../paths.png");
  });
});
