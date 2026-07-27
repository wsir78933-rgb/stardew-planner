import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  applyInteriorDecorToMap,
  getInteriorDecorTargetAtTile,
} from "../../src/interior-decor/interior-decor-rendering";
import { tiledFlipFlags } from "../../src/tmx/decode-tile-layer-data";
import { parseTmxMap } from "../../src/tmx/parse-tmx-map";
import type { TmxMap, TmxProperties } from "../../src/tmx/tmx-types";

const gameAssetsRootDirectory = path.join(
  process.cwd(),
  "public/game-assets/1.6.15",
);

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

async function parseLockedMap(relativeMapPath: string): Promise<TmxMap> {
  const mapXml = await readFile(
    path.join(gameAssetsRootDirectory, relativeMapPath),
    "utf8",
  );

  return parseTmxMap(mapXml);
}

function readTileGid(
  parsedMap: TmxMap,
  layerName: string,
  tileX: number,
  tileY: number,
): number {
  const tileLayer = parsedMap.tileLayers.find(
    (candidateTileLayer) => candidateTileLayer.name === layerName,
  );

  if (tileLayer === undefined) {
    throw new Error(`Expected TMX layer ${JSON.stringify(layerName)} to exist.`);
  }

  const rawGid = tileLayer.rawGids[tileY * tileLayer.width + tileX];

  if (rawGid === undefined) {
    throw new Error(
      `Expected TMX layer ${JSON.stringify(layerName)} to contain tile ${String(tileX)},${String(tileY)}.`,
    );
  }

  return rawGid;
}

describe("interior decor rendering", () => {
  it("finds FarmHouse2 UpperRoom through a Back WallID tile", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");

    expect(
      getInteriorDecorTargetAtTile(farmHouseTwo, "wallpaper", { x: 16, y: 11 }),
    ).toBe("UpperRoom");
  });

  it("does not expose a wallpaper target for a non-WallID tile", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");

    expect(
      getInteriorDecorTargetAtTile(farmHouseTwo, "wallpaper", { x: 0, y: 0 }),
    ).toBeNull();
  });

  it("uses all three wallpaper rows across Back and Buildings without mutating FarmHouse2", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");
    const originalBackTile = readTileGid(farmHouseTwo, "Back", 16, 11);
    const originalBuildingsTile = readTileGid(farmHouseTwo, "Buildings", 16, 13);

    const decoratedMap = applyInteriorDecorToMap(farmHouseTwo, {
      wallpapers: { UpperRoom: "17" },
      floors: {},
    });

    expect(readTileGid(decoratedMap, "Back", 16, 11)).toBe(2490);
    expect(readTileGid(decoratedMap, "Back", 16, 12)).toBe(2506);
    expect(readTileGid(decoratedMap, "Buildings", 16, 13)).toBe(2522);
    expect(readTileGid(farmHouseTwo, "Back", 16, 11)).toBe(originalBackTile);
    expect(readTileGid(farmHouseTwo, "Buildings", 16, 13)).toBe(originalBuildingsTile);
  });

  it("inserts only the required extended tilesets and uses x/y parity for MoreFloors", async () => {
    const shed = await parseLockedMap("maps/Shed.tmx");

    const decoratedMap = applyInteriorDecorToMap(shed, {
      wallpapers: {},
      floors: { Floor: "MoreFloors:0" },
    });

    expect(readTileGid(decoratedMap, "Back", 1, 3)).not.toBe(
      readTileGid(decoratedMap, "Back", 2, 3),
    );
    expect(decoratedMap.tilesets.find((tileset) => tileset.name === "floors_2"))
      .toMatchObject({
        tileCount: 64,
        columns: 16,
        imageSource: "floors_2",
        imageWidth: 256,
        imageHeight: 64,
      });
    expect(decoratedMap.tilesets.some((tileset) => tileset.name === "wallpapers_2"))
      .toBe(false);
  });

  it("extends the local standard tileset to the locked 688 tiles when a standard floor needs it", async () => {
    const shed = await parseLockedMap("maps/Shed.tmx");

    const decoratedMap = applyInteriorDecorToMap(shed, {
      wallpapers: {},
      floors: { Floor: "87" },
    });

    expect(
      decoratedMap.tilesets.find(
        (tileset) => tileset.name === "walls_and_floors",
      ),
    ).toMatchObject({
      tileCount: 688,
      columns: 16,
      imageSource: "walls_and_floors",
      imageWidth: 256,
      imageHeight: 688,
    });
  });

  it("rejects saved wallpaper and flooring targets that do not exist in the current map", async () => {
    const shed = await parseLockedMap("maps/Shed.tmx");

    expect(() =>
      applyInteriorDecorToMap(shed, {
        wallpapers: { MissingWallTarget: "17" },
        floors: {},
      }),
    ).toThrow("MissingWallTarget");
    expect(() =>
      applyInteriorDecorToMap(shed, {
        wallpapers: {},
        floors: { MissingFloorTarget: "MoreFloors:8" },
      }),
    ).toThrow("MissingFloorTarget");
  });

  it("fails with the malformed Back TileData key and WallID value", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");
    const invalidTileDataProperties = new Map(farmHouseTwo.tileDataProperties);

    invalidTileDataProperties.set(
      "Back:invalid-coordinate",
      { WallID: 17 as unknown as string } satisfies TmxProperties,
    );

    const invalidMap: TmxMap = {
      ...farmHouseTwo,
      tileDataProperties: invalidTileDataProperties,
    };

    expect(() =>
      getInteriorDecorTargetAtTile(invalidMap, "wallpaper", { x: 16, y: 11 }),
    ).toThrow("Back:invalid-coordinate");
    expect(() =>
      getInteriorDecorTargetAtTile(invalidMap, "wallpaper", { x: 16, y: 11 }),
    ).toThrow("17");
  });

  it("fails with an out-of-bounds Back TileData key and its WallID value", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");
    const invalidTileDataProperties = new Map(farmHouseTwo.tileDataProperties);

    invalidTileDataProperties.set(
      `Back:${String(farmHouseTwo.width)},11`,
      { WallID: "out-of-bounds-wall" } satisfies TmxProperties,
    );

    const invalidMap: TmxMap = {
      ...farmHouseTwo,
      tileDataProperties: invalidTileDataProperties,
    };

    expect(() =>
      getInteriorDecorTargetAtTile(invalidMap, "wallpaper", { x: 16, y: 11 }),
    ).toThrow(`Back:${String(farmHouseTwo.width)},11`);
    expect(() =>
      getInteriorDecorTargetAtTile(invalidMap, "wallpaper", { x: 16, y: 11 }),
    ).toThrow("out-of-bounds-wall");
  });

  it("does not expose a wallpaper target when all three tiles only contain a flip flag", async () => {
    const farmHouseTwo = await parseLockedMap("maps/FarmHouse2.tmx");
    const tileDataProperties = new Map(farmHouseTwo.tileDataProperties);
    tileDataProperties.set(
      "Back:0,0",
      { WallID: "flag-only-wall" } satisfies TmxProperties,
    );
    const tileLayers = farmHouseTwo.tileLayers.map((tileLayer) => ({
      ...tileLayer,
      rawGids: new Uint32Array(tileLayer.rawGids),
    }));
    const backLayer = tileLayers.find((tileLayer) => tileLayer.name === "Back");
    const buildingsLayer = tileLayers.find(
      (tileLayer) => tileLayer.name === "Buildings",
    );

    if (backLayer === undefined || buildingsLayer === undefined) {
      throw new Error("FarmHouse2 must contain Back and Buildings tile layers.");
    }

    backLayer.rawGids[0] = tiledFlipFlags.horizontal;
    backLayer.rawGids[backLayer.width] = tiledFlipFlags.horizontal;
    buildingsLayer.rawGids[buildingsLayer.width * 2] = tiledFlipFlags.horizontal;

    const flagOnlyMap: TmxMap = {
      ...farmHouseTwo,
      tileLayers,
      tileDataProperties,
    };

    expect(
      getInteriorDecorTargetAtTile(flagOnlyMap, "wallpaper", { x: 0, y: 0 }),
    ).toBeNull();
  });
});
