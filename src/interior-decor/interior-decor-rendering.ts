import {
  restoreInteriorDecorState,
  type InteriorDecorKind,
  type InteriorDecorState,
} from "./interior-decor-state";
import { getBaseTileGid } from "../tmx/decode-tile-layer-data";
import type { TmxMap, TmxProperties, TmxTileLayer, TmxTileset } from "../tmx/tmx-types";

export type InteriorDecorTileCoordinates = Readonly<{
  x: number;
  y: number;
}>;

type InteriorDecorTile = InteriorDecorTileCoordinates &
  Readonly<{
    row?: 0 | 1 | 2;
  }>;

type InteriorDecorTilesByTargetId = ReadonlyMap<
  string,
  readonly InteriorDecorTile[]
>;

const standardInteriorTilesetSource = "walls_and_floors";
const additionalWallpaperTilesetSource = "wallpapers_2";
const additionalFlooringTilesetSource = "floors_2";
type AdditionalInteriorTilesetSource =
  | typeof additionalWallpaperTilesetSource
  | typeof additionalFlooringTilesetSource;
type InteriorDecorTilesetSource =
  | typeof standardInteriorTilesetSource
  | AdditionalInteriorTilesetSource;
type MutableDecoratedTmxMap = Omit<TmxMap, "tilesets" | "tileLayers"> & {
  tilesets: TmxTileset[];
  tileLayers: TmxTileLayer[];
};
const interiorDecorTilesetSources = new Set([
  standardInteriorTilesetSource,
  additionalWallpaperTilesetSource,
  additionalFlooringTilesetSource,
]);
const standardInteriorTilesetDimensions = {
  columns: 16,
  height: 688,
  tileCount: 688,
  width: 256,
} as const;
const additionalWallpaperTilesetDimensions = {
  columns: 16,
  height: 96,
  tileCount: 96,
  width: 256,
} as const;
const additionalFlooringTilesetDimensions = {
  columns: 16,
  height: 64,
  tileCount: 64,
  width: 256,
} as const;

export function getInteriorDecorTargetAtTile(
  parsedMap: TmxMap,
  interiorDecorKind: InteriorDecorKind,
  tileCoordinates: InteriorDecorTileCoordinates,
): string | null {
  assertInteriorDecorKind(interiorDecorKind);
  assertTileCoordinates(tileCoordinates);

  const interiorDecorTilesByTargetId = interiorDecorKind === "wallpaper"
    ? createWallpaperTilesByTargetId(parsedMap)
    : createFlooringTilesByTargetId(parsedMap);

  for (const [targetId, interiorDecorTiles] of interiorDecorTilesByTargetId) {
    if (
      interiorDecorTiles.some(
        (interiorDecorTile) =>
          interiorDecorTile.x === tileCoordinates.x &&
          interiorDecorTile.y === tileCoordinates.y,
      )
    ) {
      return targetId;
    }
  }

  return null;
}

export function applyInteriorDecorToMap(
  parsedMap: TmxMap,
  rawInteriorDecorState: InteriorDecorState,
): TmxMap {
  const interiorDecorState = restoreInteriorDecorState(rawInteriorDecorState);
  const decoratedMap = cloneTmxMap(parsedMap);
  const wallpaperTilesByTargetId = createWallpaperTilesByTargetId(decoratedMap);
  const flooringTilesByTargetId = createFlooringTilesByTargetId(decoratedMap);

  applyWallpapers(decoratedMap, wallpaperTilesByTargetId, interiorDecorState);
  applyFlooring(decoratedMap, flooringTilesByTargetId, interiorDecorState);

  return decoratedMap;
}

function applyWallpapers(
  decoratedMap: MutableDecoratedTmxMap,
  wallpaperTilesByTargetId: InteriorDecorTilesByTargetId,
  interiorDecorState: InteriorDecorState,
): void {
  for (const [targetId, patternId] of Object.entries(interiorDecorState.wallpapers)) {
    const interiorDecorTiles = wallpaperTilesByTargetId.get(targetId);

    if (interiorDecorTiles === undefined) {
      throw new Error(
        `Cannot apply wallpaper pattern ${JSON.stringify(patternId)} because target ${JSON.stringify(targetId)} does not exist in the current map.`,
      );
    }

    const wallpaperTilesetFirstGid = getInteriorDecorTilesetFirstGid(
      decoratedMap,
      patternId,
      "wallpaper",
    );
    const wallpaperTileOffsets = getWallpaperTileOffsets(patternId);
    const backLayer = getRequiredTileLayer(decoratedMap, "Back");
    const buildingsLayer = getRequiredTileLayer(decoratedMap, "Buildings");

    for (const interiorDecorTile of interiorDecorTiles) {
      if (interiorDecorTile.row === undefined) {
        throw new Error(
          `Wallpaper target ${JSON.stringify(targetId)} has tile ${formatTileCoordinates(interiorDecorTile)} without a wallpaper row.`,
        );
      }

      const targetLayer = interiorDecorTile.row <= 1 ? backLayer : buildingsLayer;
      const tileIndex = getTileIndex(targetLayer, interiorDecorTile);
      targetLayer.rawGids[tileIndex] =
        wallpaperTilesetFirstGid + wallpaperTileOffsets[interiorDecorTile.row];
    }
  }
}

function applyFlooring(
  decoratedMap: MutableDecoratedTmxMap,
  flooringTilesByTargetId: InteriorDecorTilesByTargetId,
  interiorDecorState: InteriorDecorState,
): void {
  const backLayer = getRequiredTileLayer(decoratedMap, "Back");

  for (const [targetId, patternId] of Object.entries(interiorDecorState.floors)) {
    const interiorDecorTiles = flooringTilesByTargetId.get(targetId);

    if (interiorDecorTiles === undefined) {
      throw new Error(
        `Cannot apply flooring pattern ${JSON.stringify(patternId)} because target ${JSON.stringify(targetId)} does not exist in the current map.`,
      );
    }

    const flooringTilesetFirstGid = getInteriorDecorTilesetFirstGid(
      decoratedMap,
      patternId,
      "flooring",
    );
    const flooringTileOffsets = getFlooringTileOffsets(patternId);

    for (const interiorDecorTile of interiorDecorTiles) {
      const tileIndex = getTileIndex(backLayer, interiorDecorTile);
      const flooringTileOffset = getFlooringTileOffset(
        interiorDecorTile,
        flooringTileOffsets,
      );

      backLayer.rawGids[tileIndex] = flooringTilesetFirstGid + flooringTileOffset;
    }
  }
}

function createWallpaperTilesByTargetId(parsedMap: TmxMap): InteriorDecorTilesByTargetId {
  const backLayer = getTileLayer(parsedMap, "Back");
  const buildingsLayer = getTileLayer(parsedMap, "Buildings");

  if (backLayer === null || buildingsLayer === null) {
    return new Map();
  }

  const wallpaperTilesByTargetId = new Map<string, InteriorDecorTile[]>();

  for (const [tileDataKey, tileDataProperties] of parsedMap.tileDataProperties) {
    if (!tileDataKey.startsWith("Back:") || !Object.hasOwn(tileDataProperties, "WallID")) {
      continue;
    }

    const wallAnchor = readTileDataCoordinates(tileDataKey, tileDataProperties, "WallID");
    const wallId = readInteriorDecorTargetId(
      tileDataProperties.WallID,
      tileDataKey,
      "WallID",
    );
    const bottomWallpaperTileY = wallAnchor.y + 2;

    if (
      wallAnchor.x < 0 ||
      wallAnchor.x >= parsedMap.width ||
      wallAnchor.y < 0 ||
      bottomWallpaperTileY >= parsedMap.height
    ) {
      throw new RangeError(
        `Interior decor WallID at TileData key ${JSON.stringify(tileDataKey)} with value ${describeValue(wallId)} spans outside map dimensions ${String(parsedMap.width)}x${String(parsedMap.height)}.`,
      );
    }

    if (getBaseTileGid(getLayerTileGid(buildingsLayer, wallAnchor.x, bottomWallpaperTileY)) === 0) {
      continue;
    }

    const wallpaperTiles = wallpaperTilesByTargetId.get(wallId) ?? [];

    for (const wallpaperRow of [0, 1, 2] as const) {
      const wallpaperTile = { x: wallAnchor.x, y: wallAnchor.y + wallpaperRow };
      const sourceLayer = wallpaperRow <= 1 ? backLayer : buildingsLayer;

      if (getBaseTileGid(getLayerTileGid(sourceLayer, wallpaperTile.x, wallpaperTile.y)) === 0) {
        continue;
      }

      wallpaperTiles.push({ ...wallpaperTile, row: wallpaperRow });
    }

    wallpaperTilesByTargetId.set(wallId, wallpaperTiles);
  }

  return wallpaperTilesByTargetId;
}

function createFlooringTilesByTargetId(parsedMap: TmxMap): InteriorDecorTilesByTargetId {
  const backLayer = getTileLayer(parsedMap, "Back");
  const buildingsLayer = getTileLayer(parsedMap, "Buildings");

  if (backLayer === null) {
    return new Map();
  }

  const flooringTilesByTargetId = new Map<string, InteriorDecorTile[]>();

  for (const [tileDataKey, tileDataProperties] of parsedMap.tileDataProperties) {
    if (!tileDataKey.startsWith("Back:") || !Object.hasOwn(tileDataProperties, "FloorID")) {
      continue;
    }

    const floorTile = readTileDataCoordinates(tileDataKey, tileDataProperties, "FloorID");
    const floorId = readInteriorDecorTargetId(
      tileDataProperties.FloorID,
      tileDataKey,
      "FloorID",
    );

    if (Object.hasOwn(tileDataProperties, "WallID")) {
      readInteriorDecorTargetId(tileDataProperties.WallID, tileDataKey, "WallID");
      const bottomWallpaperTileY = floorTile.y + 2;

      if (
        buildingsLayer !== null &&
        bottomWallpaperTileY < parsedMap.height &&
        getLayerTileGid(buildingsLayer, floorTile.x, bottomWallpaperTileY) !== 0
      ) {
        continue;
      }
    }

    const backLayerTileGid = getLayerTileGid(backLayer, floorTile.x, floorTile.y);

    if (
      backLayerTileGid === 0 ||
      !isInteriorDecorTileGid(parsedMap.tilesets, backLayerTileGid)
    ) {
      continue;
    }

    const flooringTiles = flooringTilesByTargetId.get(floorId) ?? [];
    flooringTiles.push(floorTile);
    flooringTilesByTargetId.set(floorId, flooringTiles);
  }

  return flooringTilesByTargetId;
}

function getInteriorDecorTilesetFirstGid(
  decoratedMap: MutableDecoratedTmxMap,
  patternId: string,
  interiorDecorKind: InteriorDecorKind,
): number {
  const tilesetSource = getTilesetSourceForPattern(patternId, interiorDecorKind);

  if (tilesetSource === standardInteriorTilesetSource) {
    return ensureStandardInteriorTileset(decoratedMap);
  }

  return ensureAdditionalInteriorTileset(decoratedMap, tilesetSource);
}

function getTilesetSourceForPattern(
  patternId: string,
  interiorDecorKind: InteriorDecorKind,
): InteriorDecorTilesetSource {
  if (interiorDecorKind === "wallpaper") {
    return patternId.startsWith("MoreWalls:")
      ? additionalWallpaperTilesetSource
      : standardInteriorTilesetSource;
  }

  return patternId.startsWith("MoreFloors:")
    ? additionalFlooringTilesetSource
    : standardInteriorTilesetSource;
}

function ensureStandardInteriorTileset(decoratedMap: MutableDecoratedTmxMap): number {
  const tilesetIndex = decoratedMap.tilesets.findIndex(
    (tileset) => tileset.imageSource === standardInteriorTilesetSource,
  );

  if (tilesetIndex === -1) {
    throw new Error(
      `Interior decor requires tileset ${JSON.stringify(standardInteriorTilesetSource)}, but map has tilesets ${describeTilesetSources(decoratedMap.tilesets)}.`,
    );
  }

  const currentTileset = decoratedMap.tilesets[tilesetIndex];

  if (currentTileset === undefined) {
    throw new Error(`Interior decor tileset index ${String(tilesetIndex)} is unavailable.`);
  }

  const expandedTileset: TmxTileset = {
    ...currentTileset,
    columns: standardInteriorTilesetDimensions.columns,
    imageHeight: standardInteriorTilesetDimensions.height,
    imageWidth: standardInteriorTilesetDimensions.width,
    tileCount: standardInteriorTilesetDimensions.tileCount,
  };
  const tilesets = [...decoratedMap.tilesets];
  tilesets[tilesetIndex] = expandedTileset;
  decoratedMap.tilesets = tilesets;

  return expandedTileset.firstGid;
}

function ensureAdditionalInteriorTileset(
  decoratedMap: MutableDecoratedTmxMap,
  tilesetSource: AdditionalInteriorTilesetSource,
): number {
  const existingTileset = decoratedMap.tilesets.find(
    (tileset) => tileset.imageSource === tilesetSource,
  );

  if (existingTileset !== undefined) {
    return existingTileset.firstGid;
  }

  const tilesetDimensions = tilesetSource === additionalWallpaperTilesetSource
    ? additionalWallpaperTilesetDimensions
    : additionalFlooringTilesetDimensions;
  const tilesetFirstGid = getNextTilesetFirstGid(decoratedMap.tilesets);
  const additionalTileset: TmxTileset = {
    firstGid: tilesetFirstGid,
    name: tilesetSource,
    tileWidth: 16,
    tileHeight: 16,
    tileCount: tilesetDimensions.tileCount,
    columns: tilesetDimensions.columns,
    imageSource: tilesetSource,
    imageWidth: tilesetDimensions.width,
    imageHeight: tilesetDimensions.height,
    properties: {},
    tileProperties: new Map(),
  };

  decoratedMap.tilesets = [...decoratedMap.tilesets, additionalTileset];
  return additionalTileset.firstGid;
}

function getWallpaperTileOffsets(patternId: string): readonly [number, number, number] {
  const patternIndex = getPatternIndex(patternId);
  const firstWallpaperTileOffset =
    Math.floor(patternIndex / 16) * 16 * 3 + (patternIndex % 16);

  return [
    firstWallpaperTileOffset,
    firstWallpaperTileOffset + 16,
    firstWallpaperTileOffset + 32,
  ];
}

function getFlooringTileOffsets(
  patternId: string,
): readonly [number, number, number, number] {
  const patternIndex = getPatternIndex(patternId);
  const flooringStartTileOffset = patternId.startsWith("MoreFloors:") ? 0 : 336;
  const firstFlooringTileOffset =
    patternIndex * 2 + Math.floor(patternIndex / 8) * 16 + flooringStartTileOffset;

  return [
    firstFlooringTileOffset,
    firstFlooringTileOffset + 1,
    firstFlooringTileOffset + 16,
    firstFlooringTileOffset + 17,
  ];
}

function getPatternIndex(patternId: string): number {
  const numericPatternId = patternId.includes(":")
    ? patternId.slice(patternId.indexOf(":") + 1)
    : patternId;
  const patternIndex = Number(numericPatternId);

  if (!Number.isSafeInteger(patternIndex) || patternIndex < 0) {
    throw new RangeError(
      `Interior decor pattern ID must contain a non-negative integer; received ${JSON.stringify(patternId)}.`,
    );
  }

  return patternIndex;
}

function getFlooringTileOffset(
  tileCoordinates: InteriorDecorTileCoordinates,
  flooringTileOffsets: readonly [number, number, number, number],
): number {
  if (tileCoordinates.x % 2 === 0) {
    return tileCoordinates.y % 2 === 0
      ? flooringTileOffsets[0]
      : flooringTileOffsets[2];
  }

  return tileCoordinates.y % 2 === 0
    ? flooringTileOffsets[1]
    : flooringTileOffsets[3];
}

function cloneTmxMap(parsedMap: TmxMap): MutableDecoratedTmxMap {
  return {
    ...parsedMap,
    tilesets: parsedMap.tilesets.map((tileset) => ({ ...tileset })),
    tileLayers: parsedMap.tileLayers.map((tileLayer) => ({
      ...tileLayer,
      rawGids: new Uint32Array(tileLayer.rawGids),
    })),
    tileDataProperties: new Map(parsedMap.tileDataProperties),
  };
}

function getTileLayer(parsedMap: TmxMap, layerName: string): TmxTileLayer | null {
  return parsedMap.tileLayers.find((tileLayer) => tileLayer.name === layerName) ?? null;
}

function getRequiredTileLayer(parsedMap: TmxMap, layerName: string): TmxTileLayer {
  const tileLayer = getTileLayer(parsedMap, layerName);

  if (tileLayer === null) {
    throw new Error(`Interior decor requires TMX layer ${JSON.stringify(layerName)}.`);
  }

  return tileLayer;
}

function readTileDataCoordinates(
  tileDataKey: string,
  tileDataProperties: TmxProperties,
  targetPropertyName: "WallID" | "FloorID",
): InteriorDecorTileCoordinates {
  const keyMatch = /^Back:(-?\d+),(-?\d+)$/.exec(tileDataKey);

  if (keyMatch === null) {
    throw new Error(
      `Interior decor TileData key ${JSON.stringify(tileDataKey)} with ${targetPropertyName} value ${describeValue(tileDataProperties[targetPropertyName])} must match "Back:<x>,<y>".`,
    );
  }

  const [, rawX, rawY] = keyMatch;
  const x = Number(rawX);
  const y = Number(rawY);

  if (!Number.isSafeInteger(x) || !Number.isSafeInteger(y)) {
    throw new Error(
      `Interior decor TileData key ${JSON.stringify(tileDataKey)} with ${targetPropertyName} value ${describeValue(tileDataProperties[targetPropertyName])} must contain safe integer coordinates.`,
    );
  }

  return { x, y };
}

function readInteriorDecorTargetId(
  rawTargetId: unknown,
  tileDataKey: string,
  targetPropertyName: "WallID" | "FloorID",
): string {
  if (typeof rawTargetId !== "string" || rawTargetId.length === 0) {
    throw new TypeError(
      `Interior decor ${targetPropertyName} at TileData key ${JSON.stringify(tileDataKey)} must be a non-empty string; received ${describeValue(rawTargetId)}.`,
    );
  }

  return rawTargetId;
}

function getLayerTileGid(tileLayer: TmxTileLayer, x: number, y: number): number {
  const tileIndex = getTileIndex(tileLayer, { x, y });
  const tileGid = tileLayer.rawGids[tileIndex];

  if (tileGid === undefined) {
    throw new Error(
      `TMX layer ${JSON.stringify(tileLayer.name)} has no tile at ${String(x)},${String(y)}.`,
    );
  }

  return tileGid;
}

function getTileIndex(tileLayer: TmxTileLayer, tileCoordinates: InteriorDecorTileCoordinates): number {
  if (
    tileCoordinates.x < 0 ||
    tileCoordinates.x >= tileLayer.width ||
    tileCoordinates.y < 0 ||
    tileCoordinates.y >= tileLayer.height
  ) {
    throw new RangeError(
      `TMX layer ${JSON.stringify(tileLayer.name)} does not contain tile ${formatTileCoordinates(tileCoordinates)} for dimensions ${String(tileLayer.width)}x${String(tileLayer.height)}.`,
    );
  }

  return tileCoordinates.y * tileLayer.width + tileCoordinates.x;
}

function isInteriorDecorTileGid(tilesets: readonly TmxTileset[], rawGid: number): boolean {
  const baseGid = getBaseTileGid(rawGid);

  return tilesets.some(
    (tileset) =>
      interiorDecorTilesetSources.has(tileset.imageSource) &&
      baseGid >= tileset.firstGid &&
      baseGid < tileset.firstGid + tileset.tileCount,
  );
}

function getNextTilesetFirstGid(tilesets: readonly TmxTileset[]): number {
  const lastExclusiveTileGid = tilesets.reduce(
    (maximumExclusiveTileGid, tileset) =>
      Math.max(maximumExclusiveTileGid, tileset.firstGid + tileset.tileCount),
    1,
  );

  return lastExclusiveTileGid;
}

function assertInteriorDecorKind(
  interiorDecorKind: unknown,
): asserts interiorDecorKind is InteriorDecorKind {
  if (interiorDecorKind !== "wallpaper" && interiorDecorKind !== "flooring") {
    throw new TypeError(
      `Interior decor kind must be "wallpaper" or "flooring"; received ${describeValue(interiorDecorKind)}.`,
    );
  }
}

function assertTileCoordinates(
  tileCoordinates: InteriorDecorTileCoordinates,
): void {
  if (
    typeof tileCoordinates !== "object" ||
    tileCoordinates === null ||
    !Number.isSafeInteger(tileCoordinates.x) ||
    !Number.isSafeInteger(tileCoordinates.y)
  ) {
    throw new TypeError(
      `Interior decor tile coordinates must contain safe integer x/y values; received ${describeValue(tileCoordinates)}.`,
    );
  }
}

function describeTilesetSources(tilesets: readonly TmxTileset[]): string {
  return JSON.stringify(tilesets.map((tileset) => tileset.imageSource));
}

function formatTileCoordinates(tileCoordinates: InteriorDecorTileCoordinates): string {
  return `${String(tileCoordinates.x)},${String(tileCoordinates.y)}`;
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean" || value === null) {
    return String(value);
  }

  return JSON.stringify(value);
}
