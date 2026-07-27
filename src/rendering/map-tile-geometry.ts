import type {
  RenderingTileLayer,
  RenderingTileset,
} from "./map-rendering-contract";
import { getBaseTileGid, tiledFlipFlags } from "../tmx/decode-tile-layer-data";

export type TiledTileTransform = Readonly<{
  baseGid: number;
  rotationRadians: number;
  scaleX: -1 | 1;
  scaleY: -1 | 1;
}>;

export type LayerTileGeometryRequest = Readonly<{
  mapId: string;
  mapTileWidth: number;
  mapTileHeight: number;
  layer: RenderingTileLayer;
  tileIndex: number;
  tilesets: readonly RenderingTileset[];
}>;

export type LayerTileGeometryResolverRequest = Readonly<
  Omit<LayerTileGeometryRequest, "tileIndex">
>;

export type LayerTileGeometry = Readonly<{
  positionX: number;
  positionY: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  tilesetIndex: number;
  transform: TiledTileTransform;
}>;

export type LayerTileGeometryResolver = Readonly<{
  resolveTile(tileIndex: number): LayerTileGeometry | null;
}>;

type ValidatedTileset = Readonly<{
  firstGid: number;
  tileWidth: number;
  tileHeight: number;
  tileCount: number;
  columns: number;
  imageWidth: number;
  imageHeight: number;
  index: number;
}>;

type CachedTileFrame = Readonly<{
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  tilesetIndex: number;
}>;

export function decodeTiledTileTransform(rawGid: number): TiledTileTransform {
  validateRawGid(rawGid);

  const horizontalFlip = hasTiledFlipFlag(rawGid, tiledFlipFlags.horizontal);
  const verticalFlip = hasTiledFlipFlag(rawGid, tiledFlipFlags.vertical);
  const diagonalFlip = hasTiledFlipFlag(rawGid, tiledFlipFlags.diagonal);

  if (!diagonalFlip) {
    return {
      baseGid: getBaseTileGid(rawGid),
      rotationRadians: 0,
      scaleX: horizontalFlip ? -1 : 1,
      scaleY: verticalFlip ? -1 : 1,
    };
  }

  return createDiagonalTileTransform(rawGid, horizontalFlip, verticalFlip);
}

export function resolveLayerTileGeometry(
  layerTileGeometryRequest: LayerTileGeometryRequest,
): LayerTileGeometry | null {
  return createLayerTileGeometryResolver(layerTileGeometryRequest).resolveTile(
    layerTileGeometryRequest.tileIndex,
  );
}

export function createLayerTileGeometryResolver(
  layerTileGeometryResolverRequest: LayerTileGeometryResolverRequest,
): LayerTileGeometryResolver {
  validateLayerTileGeometryResolverRequest(layerTileGeometryResolverRequest);

  const {
    mapId,
    mapTileWidth,
    mapTileHeight,
    layer,
    tilesets,
  } = layerTileGeometryResolverRequest;
  const validatedTilesets = createValidatedTilesets(tilesets, mapId);
  const cachedTileFramesByBaseGid = createCachedTileFramesByBaseGid(
    layer.rawGids,
    validatedTilesets,
    mapId,
    layer.name,
  );
  const layerName = layer.name;
  const layerWidth = layer.width;
  const rawGids = layer.rawGids;

  return {
    resolveTile(tileIndex: number): LayerTileGeometry | null {
      validateTileIndex(tileIndex, rawGids.length, layerName, mapId);

      const rawGid = rawGids[tileIndex];
      const transform = decodeTiledTileTransform(rawGid);

      if (transform.baseGid === 0) {
        return null;
      }

      const cachedTileFrame = cachedTileFramesByBaseGid.get(transform.baseGid);

      if (cachedTileFrame === undefined) {
        throw new RangeError(
          `Layer tile geometry base GID ${transform.baseGid} in layer ${formatValue(layerName)} is unavailable in the validated tileset lookup for mapId ${formatValue(mapId)}.`,
        );
      }

      const cellCoordinates = getLayerCellCoordinates(tileIndex, layerWidth);

      return {
        positionX: cellCoordinates.x * mapTileWidth,
        positionY: cellCoordinates.y * mapTileHeight,
        frameX: cachedTileFrame.frameX,
        frameY: cachedTileFrame.frameY,
        frameWidth: cachedTileFrame.frameWidth,
        frameHeight: cachedTileFrame.frameHeight,
        tilesetIndex: cachedTileFrame.tilesetIndex,
        transform,
      };
    },
  };
}

function createDiagonalTileTransform(
  rawGid: number,
  horizontalFlip: boolean,
  verticalFlip: boolean,
): TiledTileTransform {
  if (!horizontalFlip && !verticalFlip) {
    return {
      baseGid: getBaseTileGid(rawGid),
      rotationRadians: Math.PI / 2,
      scaleX: 1,
      scaleY: -1,
    };
  }

  if (horizontalFlip && !verticalFlip) {
    return {
      baseGid: getBaseTileGid(rawGid),
      rotationRadians: Math.PI / 2,
      scaleX: 1,
      scaleY: 1,
    };
  }

  if (!horizontalFlip && verticalFlip) {
    return {
      baseGid: getBaseTileGid(rawGid),
      rotationRadians: -Math.PI / 2,
      scaleX: 1,
      scaleY: 1,
    };
  }

  return {
    baseGid: getBaseTileGid(rawGid),
    rotationRadians: -Math.PI / 2,
    scaleX: 1,
    scaleY: -1,
  };
}

function validateLayerTileGeometryResolverRequest(
  layerTileGeometryResolverRequest: LayerTileGeometryResolverRequest,
): void {
  if (
    typeof layerTileGeometryResolverRequest !== "object" ||
    layerTileGeometryResolverRequest === null
  ) {
    throw new TypeError(
      `Layer tile geometry resolver request must be a non-null object. Received request: ${formatValue(layerTileGeometryResolverRequest)}.`,
    );
  }

  const { mapId, mapTileWidth, mapTileHeight, layer, tilesets } =
    layerTileGeometryResolverRequest;

  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Layer tile geometry mapId must be a non-empty string. Received mapId: ${formatValue(mapId)}.`,
    );
  }

  validatePositiveInteger(mapTileWidth, "mapTileWidth", mapId);
  validatePositiveInteger(mapTileHeight, "mapTileHeight", mapId);
  validateTileLayer(layer, mapId);

  if (!Array.isArray(tilesets)) {
    throw new TypeError(
      `Layer tile geometry tilesets must be an array for mapId ${formatValue(mapId)}. Received tilesets: ${formatValue(tilesets)}.`,
    );
  }

}

function createValidatedTilesets(
  tilesets: readonly RenderingTileset[],
  mapId: string,
): readonly ValidatedTileset[] {
  return tilesets.map((tileset, tilesetIndex) => {
    validateTileset(tileset, tilesetIndex, mapId);

    return {
      firstGid: tileset.firstGid,
      tileWidth: tileset.tileWidth,
      tileHeight: tileset.tileHeight,
      tileCount: tileset.tileCount,
      columns: tileset.columns,
      imageWidth: tileset.imageWidth,
      imageHeight: tileset.imageHeight,
      index: tilesetIndex,
    };
  });
}

function createCachedTileFramesByBaseGid(
  rawGids: Uint32Array,
  validatedTilesets: readonly ValidatedTileset[],
  mapId: string,
  layerName: string,
): ReadonlyMap<number, CachedTileFrame> {
  const cachedTileFramesByBaseGid = new Map<number, CachedTileFrame>();

  for (const rawGid of rawGids) {
    const baseGid = getBaseTileGid(rawGid);

    if (baseGid === 0 || cachedTileFramesByBaseGid.has(baseGid)) {
      continue;
    }

    const tilesetMatch = findValidatedTilesetMatch(
      baseGid,
      validatedTilesets,
      mapId,
      layerName,
    );
    const tilesetLocalTileId = baseGid - tilesetMatch.tileset.firstGid;
    const tileFrame = getTilesetTileFrame(
      tilesetMatch.tileset,
      tilesetLocalTileId,
      mapId,
      layerName,
    );

    cachedTileFramesByBaseGid.set(baseGid, {
      frameX: tileFrame.x,
      frameY: tileFrame.y,
      frameWidth: tilesetMatch.tileset.tileWidth,
      frameHeight: tilesetMatch.tileset.tileHeight,
      tilesetIndex: tilesetMatch.tileset.index,
    });
  }

  return cachedTileFramesByBaseGid;
}

function validateTileLayer(layer: RenderingTileLayer, mapId: string): void {
  if (typeof layer !== "object" || layer === null) {
    throw new TypeError(
      `Layer tile geometry layer must be a non-null object for mapId ${formatValue(mapId)}. Received layer: ${formatValue(layer)}.`,
    );
  }

  if (typeof layer.name !== "string" || layer.name.length === 0) {
    throw new TypeError(
      `Layer tile geometry layer.name must be a non-empty string for mapId ${formatValue(mapId)}. Received layer.name: ${formatValue(layer.name)}.`,
    );
  }

  validatePositiveInteger(layer.width, "layer.width", mapId);
  validatePositiveInteger(layer.height, "layer.height", mapId);

  if (!(layer.rawGids instanceof Uint32Array)) {
    throw new TypeError(
      `Layer tile geometry layer.rawGids must be a Uint32Array for mapId ${formatValue(mapId)} and layer ${formatValue(layer.name)}. Received layer.rawGids: ${formatValue(layer.rawGids)}.`,
    );
  }

  const expectedGidCount = layer.width * layer.height;

  if (layer.rawGids.length !== expectedGidCount) {
    throw new RangeError(
      `Layer tile geometry layer ${formatValue(layer.name)} has ${layer.rawGids.length} GIDs for dimensions ${layer.width}x${layer.height} on mapId ${formatValue(mapId)}; expected ${expectedGidCount}.`,
    );
  }
}

function validateTileset(
  tileset: RenderingTileset,
  tilesetIndex: number,
  mapId: string,
): void {
  if (typeof tileset !== "object" || tileset === null) {
    throw new TypeError(
      `Layer tile geometry tileset at index ${tilesetIndex} must be a non-null object for mapId ${formatValue(mapId)}. Received tileset: ${formatValue(tileset)}.`,
    );
  }

  validatePositiveInteger(tileset.firstGid, `tilesets[${tilesetIndex}].firstGid`, mapId);
  validatePositiveInteger(tileset.tileWidth, `tilesets[${tilesetIndex}].tileWidth`, mapId);
  validatePositiveInteger(tileset.tileHeight, `tilesets[${tilesetIndex}].tileHeight`, mapId);
  validatePositiveInteger(tileset.tileCount, `tilesets[${tilesetIndex}].tileCount`, mapId);
  validatePositiveInteger(tileset.columns, `tilesets[${tilesetIndex}].columns`, mapId);
  validatePositiveInteger(tileset.imageWidth, `tilesets[${tilesetIndex}].imageWidth`, mapId);
  validatePositiveInteger(tileset.imageHeight, `tilesets[${tilesetIndex}].imageHeight`, mapId);
}

function findValidatedTilesetMatch(
  baseGid: number,
  validatedTilesets: readonly ValidatedTileset[],
  mapId: string,
  layerName: string,
): Readonly<{ tileset: ValidatedTileset }> {
  for (
    let tilesetIndex = validatedTilesets.length - 1;
    tilesetIndex >= 0;
    tilesetIndex -= 1
  ) {
    const tileset = validatedTilesets[tilesetIndex];
    const tilesetEndGid = tileset.firstGid + tileset.tileCount;

    if (baseGid >= tileset.firstGid && baseGid < tilesetEndGid) {
      return { tileset };
    }
  }

  throw new RangeError(
    `Layer tile geometry base GID ${baseGid} in layer ${formatValue(layerName)} is outside every tileset for mapId ${formatValue(mapId)}.`,
  );
}

function getLayerCellCoordinates(
  tileIndex: number,
  layerWidth: number,
): Readonly<{ x: number; y: number }> {
  return {
    x: tileIndex % layerWidth,
    y: Math.floor(tileIndex / layerWidth),
  };
}

function getTilesetTileFrame(
  tileset: ValidatedTileset,
  tilesetLocalTileId: number,
  mapId: string,
  layerName: string,
): Readonly<{ x: number; y: number }> {
  const frameX = (tilesetLocalTileId % tileset.columns) * tileset.tileWidth;
  const frameY = Math.floor(tilesetLocalTileId / tileset.columns) * tileset.tileHeight;

  if (
    frameX + tileset.tileWidth > tileset.imageWidth ||
    frameY + tileset.tileHeight > tileset.imageHeight
  ) {
    throw new RangeError(
      `Layer tile geometry local tile ID ${tilesetLocalTileId} in layer ${formatValue(layerName)} resolves outside tileset image ${tileset.imageWidth}x${tileset.imageHeight} for mapId ${formatValue(mapId)}. Received frame: ${frameX}x${frameY} with tile size ${tileset.tileWidth}x${tileset.tileHeight}.`,
    );
  }

  return { x: frameX, y: frameY };
}

function validateTileIndex(
  tileIndex: number,
  rawGidCount: number,
  layerName: string,
  mapId: string,
): void {
  if (!Number.isInteger(tileIndex) || tileIndex < 0) {
    throw new RangeError(
      `Layer tile geometry tileIndex must be a non-negative integer for mapId ${formatValue(mapId)}. Received tileIndex: ${formatValue(tileIndex)}.`,
    );
  }

  if (tileIndex >= rawGidCount) {
    throw new RangeError(
      `Layer tile geometry tileIndex ${tileIndex} is outside layer ${formatValue(layerName)} with ${rawGidCount} GIDs for mapId ${formatValue(mapId)}.`,
    );
  }
}

function hasTiledFlipFlag(rawGid: number, flipFlag: number): boolean {
  return (rawGid & flipFlag) !== 0;
}

function validateRawGid(rawGid: number): void {
  if (!Number.isInteger(rawGid) || rawGid < 0 || rawGid > 0xffffffff) {
    throw new RangeError(
      `Tiled raw GID must be an unsigned 32-bit integer. Received rawGid: ${formatValue(rawGid)}.`,
    );
  }
}

function validatePositiveInteger(
  value: unknown,
  fieldName: string,
  mapId: string,
): void {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new TypeError(
      `Layer tile geometry ${fieldName} must be a positive integer for mapId ${formatValue(mapId)}. Received ${fieldName}: ${formatValue(value)}.`,
    );
  }
}

function formatValue(value: unknown): string {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}
