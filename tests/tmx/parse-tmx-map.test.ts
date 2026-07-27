import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getBaseTileGid, tiledFlipFlags } from "../../src/tmx/decode-tile-layer-data";
import { parseTmxMap } from "../../src/tmx/parse-tmx-map";

const gameAssetsRootDirectory = path.join(
  process.cwd(),
  "public/game-assets/1.6.15",
);

async function readTmxFile(relativePath: string): Promise<string> {
  return readFile(path.join(gameAssetsRootDirectory, relativePath), "utf8");
}

async function listTmxFiles(directoryPath: string): Promise<string[]> {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    directoryEntries.map(async (directoryEntry) => {
      const entryPath = path.join(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return listTmxFiles(entryPath);
      }

      return directoryEntry.name.endsWith(".tmx") ? [entryPath] : [];
    }),
  );

  return nestedFiles.flat();
}

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("parseTmxMap", () => {
  it("parses the Farm CSV map with ordered layers, map properties, and inline tilesets", async () => {
    const parsedFarmMap = await parseTmxMap(await readTmxFile("maps/Farm.tmx"));

    expect(parsedFarmMap).toMatchObject({
      width: 80,
      height: 65,
      tileWidth: 16,
      tileHeight: 16,
      properties: {
        Outdoors: "T",
      },
    });
    expect(parsedFarmMap.tileLayers.map((tileLayer) => tileLayer.name)).toEqual([
      "Back",
      "Buildings",
      "Paths",
      "Front",
      "AlwaysFront",
      "AlwaysFront2",
    ]);
    expect(parsedFarmMap.tileLayers[0]?.rawGids).toHaveLength(80 * 65);
    expect(parsedFarmMap.tilesets[0]).toMatchObject({
      firstGid: 1,
      tileCount: 64,
      imageSource: "spring_outdoorTileSheet_extra",
    });
    expect(parsedFarmMap.tilesets[0]?.tileProperties.get(0)).toMatchObject({
      Buildable: "True",
      CanPlantTrees: "T",
    });
    expect(parsedFarmMap.tilesets[0]?.tileProperties.get(2)).toMatchObject({
      Buildable: "True",
      Diggable: "T",
    });
    const flippedFirstTileLocalId =
      getBaseTileGid(tiledFlipFlags.horizontal + 1) - (parsedFarmMap.tilesets[0]?.firstGid ?? 0);

    expect(parsedFarmMap.tilesets[0]?.tileProperties.get(flippedFirstTileLocalId)).toMatchObject({
      Buildable: "True",
    });
    expect(parsedFarmMap.objectLayers.map((objectLayer) => objectLayer.name)).toEqual([
      "Back",
      "Buildings",
      "Paths",
      "Front",
      "AlwaysFront",
      "AlwaysFront2",
    ]);
    expect(parsedFarmMap.tileDataProperties.get("Back:69,10")).toEqual({
      Buildable: "f",
    });
  });

  it("expands FarmHouse TileData objects into per-tile property entries", async () => {
    const parsedFarmHouseMap = await parseTmxMap(await readTmxFile("maps/FarmHouse2.tmx"));

    expect(parsedFarmHouseMap.tileDataProperties.get("Back:16,11")).toEqual({
      WallID: "UpperRoom",
    });
  });

  it("keeps TileData object layers intact while later TileData properties override earlier values", async () => {
    const overlappingTileDataXml = `
      <map orientation="orthogonal" infinite="0" width="2" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
        </tileset>
        <objectgroup name="Back">
          <object name="TileData" x="0" y="0" width="32" height="16">
            <properties><property name="Buildable" value="T" /></properties>
          </object>
          <object name="TileData" x="16" y="0" width="16" height="16">
            <properties><property name="Buildable" value="f" /><property name="Diggable" value="T" /></properties>
          </object>
          <object name="Other" x="0" y="0" width="16" height="16" />
        </objectgroup>
      </map>`;

    const parsedMap = await parseTmxMap(overlappingTileDataXml);

    expect(parsedMap.objectLayers[0]?.objects).toHaveLength(3);
    expect(parsedMap.tileDataProperties.get("Back:0,0")).toEqual({ Buildable: "T" });
    expect(parsedMap.tileDataProperties.get("Back:1,0")).toEqual({
      Buildable: "f",
      Diggable: "T",
    });
  });

  it("merges duplicate inline tile IDs by document order and rejects malformed metadata", async () => {
    const duplicateTileIdXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
          <tile id="0"><properties><property name="Buildable" value="T" /></properties></tile>
          <tile id="0"><properties><property name="Buildable" value="f" /><property name="Diggable" value="T" /></properties></tile>
        </tileset>
      </map>`;
    const negativeTileIdXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
          <tile id="-1" />
        </tileset>
      </map>`;
    const unknownTileChildXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
          <tile id="0"><unsupported value="source-value" /></tile>
        </tileset>
      </map>`;
    const invalidTileDataShapeXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <objectgroup name="Back"><object name="TileData" x="1" y="0" width="16" height="16" /></objectgroup>
      </map>`;

    await expect(parseTmxMap(duplicateTileIdXml)).resolves.toMatchObject({
      tilesets: [
        {
          tileProperties: new Map([
            [0, { Buildable: "f", Diggable: "T" }],
          ]),
        },
      ],
    });
    await expect(parseTmxMap(negativeTileIdXml)).rejects.toThrow('"-1"');
    await expect(parseTmxMap(unknownTileChildXml)).rejects.toThrow('"unsupported"');
    await expect(parseTmxMap(invalidTileDataShapeXml)).rejects.toThrow('"x" value "1"');
  });

  it.each([
    [
      "mods/collingbe.seabreezefarmmapislandfarm/sea-breeze-island.tmx",
      "untitled tile sheet2",
      { Water: "T" },
    ],
    [
      "mods/draylon.everfarm/everfarm.tmx",
      "z_untitled tile sheet2",
      { Water: "T" },
    ],
  ])(
    "keeps out-of-declared-range metadata for %s without expanding the GID range",
    async (mapPath, tilesetName, expectedTileProperties) => {
      const parsedMap = await parseTmxMap(await readTmxFile(mapPath));
      const parsedTileset = parsedMap.tilesets.find((tileset) => tileset.name === tilesetName);

      expect(parsedTileset?.tileCount).toBe(1317);
      expect(parsedTileset?.tileProperties.get(1818)).toEqual(expectedTileProperties);
    },
  );

  it("does not let out-of-declared-range metadata expand valid layer GIDs", async () => {
    const outOfRangeMetadataXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
          <tile id="1"><properties><property name="Buildable" value="T" /></properties></tile>
        </tileset>
        <layer name="Invalid GID" width="1" height="1"><data encoding="csv">2</data></layer>
      </map>`;

    await expect(parseTmxMap(outOfRangeMetadataXml)).rejects.toThrow('base GID "2"');
  });

  it.each([
    ["y", "1", '"y" value "1"'],
    ["width", "0", 'positive "width" value; received "0"'],
    ["height", "0", 'positive "height" value; received "0"'],
  ])(
    "rejects TileData objects with invalid %s value %s",
    async (attributeName, attributeValue, expectedErrorText) => {
      const tileDataObjectAttributes = {
        x: "0",
        y: "0",
        width: "16",
        height: "16",
        [attributeName]: attributeValue,
      };
      const invalidTileDataXml = `
        <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
          <objectgroup name="Back">
            <object name="TileData" x="${tileDataObjectAttributes.x}" y="${tileDataObjectAttributes.y}" width="${tileDataObjectAttributes.width}" height="${tileDataObjectAttributes.height}" />
          </objectgroup>
        </map>`;

      await expect(parseTmxMap(invalidTileDataXml)).rejects.toThrow(expectedErrorText);
    },
  );

  it("decompresses a real Mod base64 zlib map", async () => {
    const parsedModMap = await parseTmxMap(
      await readTmxFile(
        "mods/aimon111.aimonssmallforestfarm/aimon-s-small-forest.tmx",
      ),
    );

    expect(parsedModMap).toMatchObject({
      width: 82,
      height: 44,
    });
    expect(parsedModMap.tileLayers).toHaveLength(15);
    expect(parsedModMap.tileLayers[0]?.rawGids).toHaveLength(82 * 44);
  });

  it("uses each spouseRooms layer's own dimensions instead of map dimensions", async () => {
    const parsedSpouseRoomsMap = await parseTmxMap(
      await readTmxFile("maps/spouseRooms.tmx"),
    );
    const pathsLayer = parsedSpouseRoomsMap.tileLayers.find(
      (tileLayer) => tileLayer.name === "Paths",
    );

    expect(pathsLayer).toMatchObject({
      width: 100,
      height: 25,
    });
    expect(pathsLayer?.rawGids).toHaveLength(100 * 25);
  });

  it.each(["maps/IslandFarmHouse.tmx", "maps/Island_W.tmx"])(
    "preserves the summer season override for %s",
    async (mapPath) => {
      const parsedIslandMap = await parseTmxMap(await readTmxFile(mapPath));

      expect(parsedIslandMap.properties.SeasonOverride).toBe("summer");
    },
  );

  it("preserves the one known hidden Paths layer", async () => {
    const parsedMeadowlandsMap = await parseTmxMap(
      await readTmxFile(
        "mods/aimon111.morelivelymeadowlandsfarm/more-lively-meadowlands.tmx",
      ),
    );
    const hiddenPathsLayer = parsedMeadowlandsMap.tileLayers.find(
      (tileLayer) => tileLayer.name === "Paths",
    );

    expect(hiddenPathsLayer?.visible).toBe(false);
  });

  it("preserves horizontal, vertical, and diagonal flip flags from Waterfall Forest", async () => {
    const parsedWaterfallForestMap = await parseTmxMap(
      await readTmxFile(
        "mods/archibaldtk.waterfallforestfarm/waterfall-forest.tmx",
      ),
    );
    const rawFlaggedGid = 3_758_097_014;
    const waterfallLayerGids = parsedWaterfallForestMap.tileLayers.flatMap(
      (tileLayer) => Array.from(tileLayer.rawGids),
    );

    expect(waterfallLayerGids).toContain(rawFlaggedGid);
    expect((rawFlaggedGid & tiledFlipFlags.horizontal) >>> 0).toBe(
      tiledFlipFlags.horizontal,
    );
    expect((rawFlaggedGid & tiledFlipFlags.vertical) >>> 0).toBe(
      tiledFlipFlags.vertical,
    );
    expect((rawFlaggedGid & tiledFlipFlags.diagonal) >>> 0).toBe(
      tiledFlipFlags.diagonal,
    );
    expect(getBaseTileGid(rawFlaggedGid)).toBe(630);
  });

  it("rejects unsupported map structures with the source value that caused the failure", async () => {
    const externalTilesetXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" source="external.tsx" />
      </map>`;

    await expect(parseTmxMap(externalTilesetXml)).rejects.toThrow("external.tsx");
  });

  it("rejects an out-of-range GID with its raw value", async () => {
    const invalidGidXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
        </tileset>
        <layer name="Bad GID" width="1" height="1"><data encoding="csv">2</data></layer>
      </map>`;

    await expect(parseTmxMap(invalidGidXml)).rejects.toThrow("2");
  });

  it("rejects unsupported layer encoding with its raw value", async () => {
    const unsupportedEncodingXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <tileset firstgid="1" name="single" tilewidth="16" tileheight="16" tilecount="1" columns="1">
          <image source="single-tile" width="16" height="16" />
        </tileset>
        <layer name="Unsupported layer" width="1" height="1"><data encoding="xml">1</data></layer>
      </map>`;

    await expect(parseTmxMap(unsupportedEncodingXml)).rejects.toThrow("xml");
  });

  it("rejects an unknown direct child element in a tile layer with the layer name and tag", async () => {
    const unsupportedLayerChildXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <layer name="Protected layer" width="1" height="1">
          <unknown value="survives" />
          <data encoding="csv">0</data>
        </layer>
      </map>`;

    await expect(parseTmxMap(unsupportedLayerChildXml)).rejects.toThrow(
      'TMX layer "Protected layer" has unsupported direct child element "unknown".',
    );
  });

  it("rejects a tile layer with more than one direct data element", async () => {
    const duplicateDataXml = `
      <map orientation="orthogonal" infinite="0" width="1" height="1" tilewidth="16" tileheight="16">
        <layer name="Duplicate data" width="1" height="1">
          <data encoding="csv">0</data>
          <data encoding="csv">0</data>
        </layer>
      </map>`;

    await expect(parseTmxMap(duplicateDataXml)).rejects.toThrow(
      'TMX layer "Duplicate data" must have exactly one data element; received 2.',
    );
  });

  it("parses all 64 locked TMX maps", async () => {
    const tmxFilePaths = await listTmxFiles(gameAssetsRootDirectory);
    const parsedMaps = await Promise.all(
      tmxFilePaths.map(async (tmxFilePath) => parseTmxMap(await readFile(tmxFilePath, "utf8"))),
    );

    expect(tmxFilePaths).toHaveLength(64);
    expect(parsedMaps).toHaveLength(64);
    expect(parsedMaps.every((parsedMap) => parsedMap.tileWidth === 16)).toBe(true);
    expect(parsedMaps.every((parsedMap) => parsedMap.tileHeight === 16)).toBe(true);
  });
});
