import { getPlannerMapById } from "../maps/map-catalog";
import type { TmxMap, TmxTileLayer, TmxTileset } from "../tmx/tmx-types";
import {
  isKnownUnavailableTilesheetAsset,
  resolveTilesheetAsset,
  type TilesheetSeason,
} from "./tilesheet-asset-resolver";

const localGameAssetRoot = "/game-assets/1.6.15/";

const supportedSeasons = ["spring", "summer", "fall", "winter"] as const;

export type MapRenderingContractRequest = Readonly<{
  mapId: string;
  parsedMap: TmxMap;
  requestedSeason: TilesheetSeason;
}>;

type RenderingTilesetDetails = Readonly<{
  source: string;
  firstGid: number;
  tileWidth: number;
  tileHeight: number;
  imageWidth: number;
  imageHeight: number;
  columns: number;
  tileCount: number;
}>;

export type LocalRenderingTileset = Readonly<
  RenderingTilesetDetails & {
    assetPath: string;
    usedSpringFallback: boolean;
    knownUnavailable?: never;
  }
>;

export type KnownUnavailableRenderingTileset = Readonly<
  RenderingTilesetDetails & {
    assetPath?: never;
    usedSpringFallback?: never;
    knownUnavailable: Readonly<{
      outputPath: string;
      reason: string;
    }>;
  }
>;

export type RenderingTileset =
  | LocalRenderingTileset
  | KnownUnavailableRenderingTileset;

export function isKnownUnavailableRenderingTileset(
  renderingTileset: RenderingTileset,
): renderingTileset is KnownUnavailableRenderingTileset {
  return "knownUnavailable" in renderingTileset;
}

export function isLocalRenderingTileset(
  renderingTileset: RenderingTileset,
): renderingTileset is LocalRenderingTileset {
  return !isKnownUnavailableRenderingTileset(renderingTileset);
}

export type RenderingTileLayer = Readonly<{
  name: string;
  width: number;
  height: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  rawGids: Uint32Array;
}>;

export type MapRenderingContract = Readonly<{
  mapId: string;
  modId: string | null;
  requestedSeason: TilesheetSeason;
  effectiveSeason: TilesheetSeason;
  mapWidth: number;
  mapHeight: number;
  tileWidth: number;
  tileHeight: number;
  tilesets: readonly RenderingTileset[];
  visibleTileLayers: readonly RenderingTileLayer[];
}>;

function createRenderingTileset(
  tileset: TmxTileset,
  effectiveSeason: TilesheetSeason,
  modId: string | null,
): RenderingTileset {
  const resolvedTilesheetAsset = resolveTilesheetAsset({
    tilesetSource: tileset.imageSource,
    season: effectiveSeason,
    modId,
  });

  const renderingTilesetDetails: RenderingTilesetDetails = {
    source: tileset.imageSource,
    firstGid: tileset.firstGid,
    tileWidth: tileset.tileWidth,
    tileHeight: tileset.tileHeight,
    imageWidth: tileset.imageWidth,
    imageHeight: tileset.imageHeight,
    columns: tileset.columns,
    tileCount: tileset.tileCount,
  };

  if (isKnownUnavailableTilesheetAsset(resolvedTilesheetAsset)) {
    return {
      ...renderingTilesetDetails,
      knownUnavailable: resolvedTilesheetAsset.knownUnavailable,
    };
  }

  assertLocalGameAssetPath(resolvedTilesheetAsset.localPath);

  return {
    ...renderingTilesetDetails,
    assetPath: resolvedTilesheetAsset.localPath,
    usedSpringFallback: resolvedTilesheetAsset.usedSpringFallback,
  };
}

export function createMapRenderingContract(
  mapRenderingContractRequest: MapRenderingContractRequest,
): MapRenderingContract {
  validateMapRenderingContractRequest(mapRenderingContractRequest);

  const plannerMap = getPlannerMapById(mapRenderingContractRequest.mapId);
  const modId = plannerMap.modId ?? null;
  const effectiveSeason = resolveEffectiveSeason(
    mapRenderingContractRequest.parsedMap,
    mapRenderingContractRequest.requestedSeason,
    mapRenderingContractRequest.mapId,
  );

  return {
    mapId: mapRenderingContractRequest.mapId,
    modId,
    requestedSeason: mapRenderingContractRequest.requestedSeason,
    effectiveSeason,
    mapWidth: mapRenderingContractRequest.parsedMap.width,
    mapHeight: mapRenderingContractRequest.parsedMap.height,
    tileWidth: mapRenderingContractRequest.parsedMap.tileWidth,
    tileHeight: mapRenderingContractRequest.parsedMap.tileHeight,
    tilesets: mapRenderingContractRequest.parsedMap.tilesets.map((tileset) =>
      createRenderingTileset(
        tileset,
        effectiveSeason,
        modId,
      ),
    ),
    visibleTileLayers: mapRenderingContractRequest.parsedMap.tileLayers
      .filter((tileLayer) => tileLayer.visible && tileLayer.name !== "Paths")
      .map(createRenderingTileLayer),
  };
}

export function assertLocalGameAssetPath(assetPath: string): void {
  if (!isSafeLocalGameAssetPath(assetPath)) {
    throw new Error(
      `Rendering asset path must be a local game asset under "${localGameAssetRoot}". Received asset path: ${formatValue(assetPath)}.`,
    );
  }
}

function validateMapRenderingContractRequest(
  mapRenderingContractRequest: MapRenderingContractRequest,
): void {
  if (!isRecord(mapRenderingContractRequest)) {
    throw new TypeError(
      `Map rendering contract request must be a non-null object. Received: ${formatValue(mapRenderingContractRequest)}.`,
    );
  }

  const { mapId, parsedMap, requestedSeason } = mapRenderingContractRequest;

  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Map rendering contract mapId must be a non-empty string. Received mapId: ${formatValue(mapId)}.`,
    );
  }

  if (!isTilesheetSeason(requestedSeason)) {
    throw new TypeError(
      `Map rendering contract requestedSeason must be one of ${supportedSeasons.join(", ")}. Received requestedSeason: ${formatValue(requestedSeason)} for mapId: ${formatValue(mapId)}.`,
    );
  }

  validateParsedTmxMap(parsedMap, mapId);
}

function validateParsedTmxMap(parsedMap: TmxMap, mapId: string): void {
  if (!isRecord(parsedMap)) {
    throw new TypeError(
      `Map rendering contract parsedMap must be a non-null object for mapId ${formatValue(mapId)}. Received parsedMap: ${formatValue(parsedMap)}.`,
    );
  }

  validatePositiveInteger(parsedMap.width, "parsedMap.width", mapId);
  validatePositiveInteger(parsedMap.height, "parsedMap.height", mapId);
  validatePositiveInteger(parsedMap.tileWidth, "parsedMap.tileWidth", mapId);
  validatePositiveInteger(parsedMap.tileHeight, "parsedMap.tileHeight", mapId);

  if (!isRecord(parsedMap.properties)) {
    throw new TypeError(
      `Map rendering contract parsedMap.properties must be an object for mapId ${formatValue(mapId)}. Received properties: ${formatValue(parsedMap.properties)}.`,
    );
  }

  if (!Array.isArray(parsedMap.tilesets)) {
    throw new TypeError(
      `Map rendering contract parsedMap.tilesets must be an array for mapId ${formatValue(mapId)}. Received tilesets: ${formatValue(parsedMap.tilesets)}.`,
    );
  }

  if (!Array.isArray(parsedMap.tileLayers)) {
    throw new TypeError(
      `Map rendering contract parsedMap.tileLayers must be an array for mapId ${formatValue(mapId)}. Received tileLayers: ${formatValue(parsedMap.tileLayers)}.`,
    );
  }
}

function resolveEffectiveSeason(
  parsedMap: TmxMap,
  requestedSeason: TilesheetSeason,
  mapId: string,
): TilesheetSeason {
  const seasonOverride = parsedMap.properties.SeasonOverride;

  if (seasonOverride === undefined) {
    return requestedSeason;
  }

  if (!isTilesheetSeason(seasonOverride)) {
    throw new Error(
      `Map SeasonOverride must be one of ${supportedSeasons.join(", ")} for mapId ${formatValue(mapId)}. Received SeasonOverride: ${formatValue(seasonOverride)}.`,
    );
  }

  return seasonOverride;
}

function createRenderingTileLayer(tileLayer: TmxTileLayer): RenderingTileLayer {
  return {
    name: tileLayer.name,
    width: tileLayer.width,
    height: tileLayer.height,
    opacity: tileLayer.opacity,
    offsetX: tileLayer.offsetX,
    offsetY: tileLayer.offsetY,
    rawGids: tileLayer.rawGids,
  };
}

function isTilesheetSeason(value: unknown): value is TilesheetSeason {
  return (
    typeof value === "string" &&
    supportedSeasons.includes(value as TilesheetSeason)
  );
}

function isSafeLocalGameAssetPath(assetPath: unknown): assetPath is string {
  if (
    typeof assetPath !== "string" ||
    !assetPath.startsWith(localGameAssetRoot)
  ) {
    return false;
  }

  const outputPath = assetPath.slice(localGameAssetRoot.length);

  if (outputPath.length === 0 || outputPath.includes("\\") || outputPath.includes("?") || outputPath.includes("#")) {
    return false;
  }

  return outputPath.split("/").every(
    (pathSegment) =>
      pathSegment.length > 0 && pathSegment !== "." && pathSegment !== "..",
  );
}

function validatePositiveInteger(
  value: unknown,
  fieldName: string,
  mapId: string,
): void {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new TypeError(
      `Map rendering contract ${fieldName} must be a positive integer for mapId ${formatValue(mapId)}. Received ${fieldName}: ${formatValue(value)}.`,
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatValue(value: unknown): string {
  return typeof value === "string" ? `"${value}"` : String(value);
}
