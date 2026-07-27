import { getBaseTileGid, tiledFlipFlags } from "../tmx/decode-tile-layer-data";
import type {
  TmxMap,
  TmxProperties,
  TmxTileLayer,
  TmxTileset,
} from "../tmx/tmx-types";

export type MapTileOverlay = Readonly<{
  id: string;
  map: TmxMap;
  sourceCrop: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  target: Readonly<{
    x: number;
    y: number;
  }>;
}>;

export type MapTileCompositionOptions = Readonly<{
  includeTileDataProperties?: boolean;
}>;

const tiledFlipFlagMask =
  tiledFlipFlags.horizontal | tiledFlipFlags.vertical | tiledFlipFlags.diagonal;

export function composeMapTileOverlays(
  baseMap: TmxMap,
  mapTileOverlays: readonly MapTileOverlay[],
  compositionOptions?: MapTileCompositionOptions,
): TmxMap {
  assertTmxMap(baseMap, "base map");
  const includeTileDataProperties = readIncludeTileDataProperties(
    compositionOptions,
  );

  if (!Array.isArray(mapTileOverlays)) {
    throw new TypeError(
      `Map tile overlays must be an array; received ${describeValue(mapTileOverlays)}.`,
    );
  }

  const compositeTilesets = [...baseMap.tilesets];
  const compositeTileLayers = baseMap.tileLayers.map(cloneTileLayer);
  const compositeTileDataProperties = new Map(baseMap.tileDataProperties);

  for (const mapTileOverlay of mapTileOverlays) {
    assertMapTileOverlay(mapTileOverlay, baseMap);
    const overlayGidRemapping = createOverlayGidRemapping(
      compositeTilesets,
      mapTileOverlay.map.tilesets,
      mapTileOverlay.id,
    );

    applyOverlayLayers(
      compositeTileLayers,
      mapTileOverlay,
      overlayGidRemapping,
      baseMap.width,
      baseMap.height,
    );

    if (includeTileDataProperties) {
      mergeOverlayTileDataProperties(
        compositeTileDataProperties,
        mapTileOverlay,
        baseMap,
      );
    }
  }

  return {
    ...baseMap,
    tilesets: compositeTilesets,
    tileLayers: compositeTileLayers,
    tileDataProperties: compositeTileDataProperties,
  };
}

function cloneTileLayer(tileLayer: TmxTileLayer): TmxTileLayer {
  return {
    ...tileLayer,
    rawGids: new Uint32Array(tileLayer.rawGids),
  };
}

function readIncludeTileDataProperties(
  compositionOptions: MapTileCompositionOptions | undefined,
): boolean {
  if (compositionOptions === undefined) {
    return false;
  }

  if (typeof compositionOptions !== "object" || compositionOptions === null) {
    throw new TypeError(
      `Map tile composition options must be an object when supplied; received ${describeValue(compositionOptions)}.`,
    );
  }

  const { includeTileDataProperties } = compositionOptions;

  if (
    includeTileDataProperties !== undefined &&
    typeof includeTileDataProperties !== "boolean"
  ) {
    throw new TypeError(
      `Map tile composition option "includeTileDataProperties" must be boolean when supplied; received ${describeValue(includeTileDataProperties)}.`,
    );
  }

  return includeTileDataProperties ?? false;
}

function assertMapTileOverlay(
  mapTileOverlay: MapTileOverlay,
  baseMap: TmxMap,
): void {
  if (typeof mapTileOverlay !== "object" || mapTileOverlay === null) {
    throw new TypeError(
      `Map tile overlay must be a non-null object; received ${describeValue(mapTileOverlay)}.`,
    );
  }

  if (typeof mapTileOverlay.id !== "string" || mapTileOverlay.id.length === 0) {
    throw new TypeError(
      `Map tile overlay ID must be a non-empty string; received ${describeValue(mapTileOverlay.id)}.`,
    );
  }

  assertTmxMap(mapTileOverlay.map, `overlay ${JSON.stringify(mapTileOverlay.id)} map`);
  assertCropAndTargetFit(mapTileOverlay, baseMap);

  if (
    mapTileOverlay.map.tileWidth !== baseMap.tileWidth ||
    mapTileOverlay.map.tileHeight !== baseMap.tileHeight
  ) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} tile size ${String(mapTileOverlay.map.tileWidth)}x${String(mapTileOverlay.map.tileHeight)} does not match base map tile size ${String(baseMap.tileWidth)}x${String(baseMap.tileHeight)}.`,
    );
  }
}

function assertTmxMap(value: unknown, label: string): asserts value is TmxMap {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Map tile composition ${label} must be a non-null TmxMap; received ${describeValue(value)}.`,
    );
  }

  const map = value as TmxMap;

  for (const [fieldName, fieldValue] of [
    ["width", map.width],
    ["height", map.height],
    ["tileWidth", map.tileWidth],
    ["tileHeight", map.tileHeight],
  ] as const) {
    if (!Number.isSafeInteger(fieldValue) || fieldValue <= 0) {
      throw new TypeError(
        `Map tile composition ${label} field ${JSON.stringify(fieldName)} must be a positive safe integer; received ${describeValue(fieldValue)}.`,
      );
    }
  }

  if (!Array.isArray(map.tilesets) || !Array.isArray(map.tileLayers)) {
    throw new TypeError(
      `Map tile composition ${label} must contain tilesets and tileLayers arrays; received tilesets ${describeValue(map.tilesets)} and tileLayers ${describeValue(map.tileLayers)}.`,
    );
  }
}

function assertCropAndTargetFit(
  mapTileOverlay: MapTileOverlay,
  baseMap: TmxMap,
): void {
  const { sourceCrop, target } = mapTileOverlay;

  for (const [fieldName, fieldValue] of [
    ["sourceCrop.x", sourceCrop?.x],
    ["sourceCrop.y", sourceCrop?.y],
    ["sourceCrop.width", sourceCrop?.width],
    ["sourceCrop.height", sourceCrop?.height],
    ["target.x", target?.x],
    ["target.y", target?.y],
  ] as const) {
    if (!Number.isSafeInteger(fieldValue) || fieldValue < 0) {
      throw new TypeError(
        `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} field ${JSON.stringify(fieldName)} must be a non-negative safe integer; received ${describeValue(fieldValue)}.`,
      );
    }
  }

  if (sourceCrop.width === 0 || sourceCrop.height === 0) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} source crop dimensions must be positive; received ${String(sourceCrop.width)}x${String(sourceCrop.height)}.`,
    );
  }

  if (
    sourceCrop.x + sourceCrop.width > mapTileOverlay.map.width ||
    sourceCrop.y + sourceCrop.height > mapTileOverlay.map.height
  ) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} source crop exceeds its map dimensions ${String(mapTileOverlay.map.width)}x${String(mapTileOverlay.map.height)}.`,
    );
  }

  if (
    target.x + sourceCrop.width > baseMap.width ||
    target.y + sourceCrop.height > baseMap.height
  ) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} target crop exceeds base map dimensions ${String(baseMap.width)}x${String(baseMap.height)}.`,
    );
  }
}

function createOverlayGidRemapping(
  compositeTilesets: TmxTileset[],
  overlayTilesets: readonly TmxTileset[],
  overlayId: string,
): ReadonlyMap<number, number> {
  const firstGidByOverlayFirstGid = new Map<number, number>();

  for (const overlayTileset of overlayTilesets) {
    const matchingCompositeTileset = compositeTilesets.find(
      (compositeTileset) =>
        compositeTileset.imageSource === overlayTileset.imageSource &&
        compositeTileset.tileWidth === overlayTileset.tileWidth &&
        compositeTileset.tileHeight === overlayTileset.tileHeight &&
        compositeTileset.columns === overlayTileset.columns &&
        compositeTileset.tileCount >= overlayTileset.tileCount,
    );

    if (matchingCompositeTileset !== undefined) {
      firstGidByOverlayFirstGid.set(
        overlayTileset.firstGid,
        matchingCompositeTileset.firstGid,
      );
      continue;
    }

    const nextFirstGid = getNextTilesetFirstGid(compositeTilesets);
    compositeTilesets.push({ ...overlayTileset, firstGid: nextFirstGid });
    firstGidByOverlayFirstGid.set(overlayTileset.firstGid, nextFirstGid);
  }

  if (firstGidByOverlayFirstGid.size !== overlayTilesets.length) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} could not create a GID remapping for every tileset.`,
    );
  }

  return firstGidByOverlayFirstGid;
}

function getNextTilesetFirstGid(tilesets: readonly TmxTileset[]): number {
  const lastTileset = tilesets.at(-1);

  if (lastTileset === undefined) {
    return 1;
  }

  return lastTileset.firstGid + lastTileset.tileCount;
}

function applyOverlayLayers(
  compositeTileLayers: TmxTileLayer[],
  mapTileOverlay: MapTileOverlay,
  overlayGidRemapping: ReadonlyMap<number, number>,
  baseMapWidth: number,
  baseMapHeight: number,
): void {
  for (const overlayTileLayer of mapTileOverlay.map.tileLayers) {
    const compositeTileLayer = getOrCreateCompositeTileLayer(
      compositeTileLayers,
      overlayTileLayer,
      baseMapWidth,
      baseMapHeight,
    );

    copyOverlayTileLayerCrop(
      compositeTileLayer,
      overlayTileLayer,
      mapTileOverlay,
      overlayGidRemapping,
    );
  }
}

function mergeOverlayTileDataProperties(
  compositeTileDataProperties: Map<string, TmxProperties>,
  mapTileOverlay: MapTileOverlay,
  baseMap: TmxMap,
): void {
  for (const [sourceTileDataKey, sourceTileDataProperties] of mapTileOverlay.map.tileDataProperties) {
    assertTileDataProperties(
      sourceTileDataProperties,
      sourceTileDataKey,
      mapTileOverlay.id,
    );
    const sourceTileDataCoordinates = readTileDataCoordinates(
      sourceTileDataKey,
      sourceTileDataProperties,
      mapTileOverlay.id,
    );

    if (!isWithinSourceCrop(sourceTileDataCoordinates, mapTileOverlay.sourceCrop)) {
      continue;
    }

    const targetTileDataCoordinates = {
      x:
        mapTileOverlay.target.x +
        sourceTileDataCoordinates.x -
        mapTileOverlay.sourceCrop.x,
      y:
        mapTileOverlay.target.y +
        sourceTileDataCoordinates.y -
        mapTileOverlay.sourceCrop.y,
    };
    assertTargetTileDataCoordinates(
      targetTileDataCoordinates,
      sourceTileDataKey,
      sourceTileDataProperties,
      mapTileOverlay.id,
      baseMap,
    );

    const targetTileDataKey = `${sourceTileDataCoordinates.layerName}:${String(targetTileDataCoordinates.x)},${String(targetTileDataCoordinates.y)}`;
    const existingTargetTileDataProperties =
      compositeTileDataProperties.get(targetTileDataKey) ?? {};

    compositeTileDataProperties.set(targetTileDataKey, {
      ...existingTargetTileDataProperties,
      ...sourceTileDataProperties,
    });
  }
}

function assertTileDataProperties(
  rawTileDataProperties: unknown,
  sourceTileDataKey: string,
  overlayId: string,
): asserts rawTileDataProperties is TmxProperties {
  if (
    typeof rawTileDataProperties !== "object" ||
    rawTileDataProperties === null ||
    Array.isArray(rawTileDataProperties) ||
    !isPlainTileDataPropertiesRecord(rawTileDataProperties)
  ) {
    throw new TypeError(
      `Map tile overlay ${JSON.stringify(overlayId)} has TileData key ${JSON.stringify(sourceTileDataKey)} with invalid properties ${describeValue(rawTileDataProperties)}.`,
    );
  }

  for (const [propertyName, propertyValue] of Object.entries(rawTileDataProperties)) {
    if (typeof propertyValue !== "string") {
      throw new TypeError(
        `Map tile overlay ${JSON.stringify(overlayId)} has TileData key ${JSON.stringify(sourceTileDataKey)} with non-string property ${JSON.stringify(propertyName)} value ${describeValue(propertyValue)}.`,
      );
    }
  }
}

function isPlainTileDataPropertiesRecord(
  tileDataProperties: object,
): boolean {
  const recordPrototype = Object.getPrototypeOf(tileDataProperties);

  return recordPrototype === Object.prototype || recordPrototype === null;
}

function readTileDataCoordinates(
  sourceTileDataKey: string,
  sourceTileDataProperties: TmxProperties,
  overlayId: string,
): Readonly<{ layerName: string; x: number; y: number }> {
  const tileDataKeyMatch = /^(.+):(\d+),(\d+)$/.exec(sourceTileDataKey);

  if (tileDataKeyMatch === null) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} has malformed TileData key ${JSON.stringify(sourceTileDataKey)} with properties ${describeTileDataProperties(sourceTileDataProperties)}.`,
    );
  }

  const [, layerName, rawX, rawY] = tileDataKeyMatch;
  const x = Number(rawX);
  const y = Number(rawY);

  if (
    layerName === undefined ||
    rawX === undefined ||
    rawY === undefined ||
    !Number.isSafeInteger(x) ||
    !Number.isSafeInteger(y)
  ) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} has TileData key ${JSON.stringify(sourceTileDataKey)} with unsafe coordinates and properties ${describeTileDataProperties(sourceTileDataProperties)}.`,
    );
  }

  return { layerName, x, y };
}

function isWithinSourceCrop(
  tileCoordinates: Readonly<{ x: number; y: number }>,
  sourceCrop: MapTileOverlay["sourceCrop"],
): boolean {
  return (
    tileCoordinates.x >= sourceCrop.x &&
    tileCoordinates.x < sourceCrop.x + sourceCrop.width &&
    tileCoordinates.y >= sourceCrop.y &&
    tileCoordinates.y < sourceCrop.y + sourceCrop.height
  );
}

function assertTargetTileDataCoordinates(
  targetTileDataCoordinates: Readonly<{ x: number; y: number }>,
  sourceTileDataKey: string,
  sourceTileDataProperties: TmxProperties,
  overlayId: string,
  baseMap: TmxMap,
): void {
  if (
    targetTileDataCoordinates.x < 0 ||
    targetTileDataCoordinates.x >= baseMap.width ||
    targetTileDataCoordinates.y < 0 ||
    targetTileDataCoordinates.y >= baseMap.height
  ) {
    throw new RangeError(
      `Map tile overlay ${JSON.stringify(overlayId)} translates TileData key ${JSON.stringify(sourceTileDataKey)} with properties ${describeTileDataProperties(sourceTileDataProperties)} outside base map dimensions ${String(baseMap.width)}x${String(baseMap.height)}.`,
    );
  }
}

function getOrCreateCompositeTileLayer(
  compositeTileLayers: TmxTileLayer[],
  overlayTileLayer: TmxTileLayer,
  baseMapWidth: number,
  baseMapHeight: number,
): TmxTileLayer {
  const existingTileLayer = compositeTileLayers.find(
    (compositeTileLayer) => compositeTileLayer.name === overlayTileLayer.name,
  );

  if (existingTileLayer !== undefined) {
    return existingTileLayer;
  }

  const createdTileLayer: TmxTileLayer = {
    ...overlayTileLayer,
    width: baseMapWidth,
    height: baseMapHeight,
    rawGids: new Uint32Array(baseMapWidth * baseMapHeight),
  };
  compositeTileLayers.push(createdTileLayer);
  return createdTileLayer;
}

function copyOverlayTileLayerCrop(
  compositeTileLayer: TmxTileLayer,
  overlayTileLayer: TmxTileLayer,
  mapTileOverlay: MapTileOverlay,
  overlayGidRemapping: ReadonlyMap<number, number>,
): void {
  const { sourceCrop, target } = mapTileOverlay;

  for (let cropY = 0; cropY < sourceCrop.height; cropY += 1) {
    for (let cropX = 0; cropX < sourceCrop.width; cropX += 1) {
      const overlayTileIndex =
        (sourceCrop.y + cropY) * overlayTileLayer.width + sourceCrop.x + cropX;
      const compositeTileIndex =
        (target.y + cropY) * compositeTileLayer.width + target.x + cropX;
      const overlayRawGid = overlayTileLayer.rawGids[overlayTileIndex];

      if (overlayRawGid === undefined || compositeTileIndex >= compositeTileLayer.rawGids.length) {
        throw new Error(
          `Map tile overlay ${JSON.stringify(mapTileOverlay.id)} has an unavailable tile index while copying layer ${JSON.stringify(overlayTileLayer.name)}.`,
        );
      }

      if (overlayRawGid === 0) {
        continue;
      }

      compositeTileLayer.rawGids[compositeTileIndex] = remapOverlayRawGid(
        overlayRawGid,
        mapTileOverlay.map.tilesets,
        overlayGidRemapping,
        mapTileOverlay.id,
      );
    }
  }
}

function remapOverlayRawGid(
  overlayRawGid: number,
  overlayTilesets: readonly TmxTileset[],
  overlayGidRemapping: ReadonlyMap<number, number>,
  overlayId: string,
): number {
  const baseGid = getBaseTileGid(overlayRawGid);
  const sourceTileset = overlayTilesets.find(
    (overlayTileset) =>
      baseGid >= overlayTileset.firstGid &&
      baseGid < overlayTileset.firstGid + overlayTileset.tileCount,
  );

  if (sourceTileset === undefined) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} raw GID ${String(overlayRawGid)} does not belong to any overlay tileset.`,
    );
  }

  const targetFirstGid = overlayGidRemapping.get(sourceTileset.firstGid);

  if (targetFirstGid === undefined) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} has no remapped first GID for source tileset ${JSON.stringify(sourceTileset.imageSource)}.`,
    );
  }

  const remappedBaseGid = targetFirstGid + baseGid - sourceTileset.firstGid;
  const flipFlags = overlayRawGid & tiledFlipFlagMask;

  return (flipFlags | remappedBaseGid) >>> 0;
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return `[array length ${String(value.length)}]`;
  }

  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

function describeTileDataProperties(tileDataProperties: TmxProperties): string {
  return JSON.stringify(tileDataProperties);
}
