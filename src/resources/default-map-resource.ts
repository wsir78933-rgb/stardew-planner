import {
  farmhouse2Composite,
  getPlannerMapById,
  gingerIslandOverlays,
  spouseRoomLayouts,
} from "../maps/map-catalog";
import {
  composeMapTileOverlays,
  type MapTileCompositionOptions,
} from "../maps/map-tile-composition";
import {
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import {
  createMapRenderingContract,
  type MapRenderingContract,
} from "../rendering/map-rendering-contract";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import { parseTmxMap } from "../tmx/parse-tmx-map";
import type { TmxMap } from "../tmx/tmx-types";

const localGameAssetRoot = "/game-assets/1.6.15/";

export type DefaultMapRequest = Readonly<{
  mapId: string;
  season: TilesheetSeason;
  mapRenderOptions: MapRenderOptions;
}>;

export type PreparedDefaultMap = Readonly<{
  mapId: string;
  season: TilesheetSeason;
  parsedMap: TmxMap;
  renderingContract: MapRenderingContract;
}>;

export type MapAssetResponse = Readonly<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

export type DefaultMapResourcePorts = Readonly<{
  fetchMapAsset?: (assetUrl: string) => Promise<MapAssetResponse>;
  parseMapXml?: (mapXml: string) => Promise<TmxMap>;
  onMapFetched?: () => void;
  onMapParsed?: () => void;
}>;

export async function loadPreparedDefaultMap(
  request: DefaultMapRequest,
  ports: DefaultMapResourcePorts = {},
): Promise<PreparedDefaultMap> {
  const normalizedRequest = normalizeDefaultMapRequest(request);
  assertDefaultMapResourcePorts(ports);
  const fetchMapAsset = ports.fetchMapAsset ?? fetch;
  const parseMapXml = ports.parseMapXml ?? parseTmxMap;
  const primaryMapUrl = getLocalMapAssetPath(
    normalizedRequest.mapId,
    normalizedRequest.mapRenderOptions,
  );
  const primaryMapXml = await loadMapXml(
    normalizedRequest.mapId,
    normalizedRequest.season,
    primaryMapUrl,
    fetchMapAsset,
  );
  ports.onMapFetched?.();
  const parsedMap = await loadPlannerMap(
    normalizedRequest,
    primaryMapXml,
    primaryMapUrl,
    fetchMapAsset,
    parseMapXml,
  );
  ports.onMapParsed?.();

  return {
    mapId: normalizedRequest.mapId,
    season: normalizedRequest.season,
    parsedMap,
    renderingContract: createMapRenderingContract({
      mapId: normalizedRequest.mapId,
      parsedMap,
      requestedSeason: normalizedRequest.season,
    }),
  };
}

export function getDefaultMapRequestCacheKey(request: DefaultMapRequest): string {
  const normalizedRequest = normalizeDefaultMapRequest(request);
  return JSON.stringify({
    mapId: normalizedRequest.mapId,
    season: normalizedRequest.season,
    mapRenderOptions: normalizedRequest.mapRenderOptions,
  });
}

function normalizeDefaultMapRequest(request: DefaultMapRequest): DefaultMapRequest {
  if (typeof request !== "object" || request === null) {
    throw new TypeError(`Default map request must be an object; received ${describeValue(request)}.`);
  }
  if (typeof request.mapId !== "string" || request.mapId.length === 0) {
    throw new TypeError(`Default map request mapId must be a non-empty string; received ${describeValue(request.mapId)}.`);
  }
  if (typeof request.season !== "string") {
    throw new TypeError(`Default map request season must be a string; received ${describeValue(request.season)}.`);
  }
  getPlannerMapById(request.mapId);
  return { ...request, mapRenderOptions: restoreMapRenderOptions(request.mapRenderOptions) };
}

function getLocalMapAssetPath(mapId: string, mapRenderOptions: MapRenderOptions): string {
  const plannerMap = getPlannerMapById(mapId);
  const mapFile = mapId === "farmhouse-2" && mapRenderOptions.farmhouse2.marriageMapEnabled
    ? farmhouse2Composite.marriageMapFile
    : plannerMap.mapFile;
  return `${localGameAssetRoot}${plannerMap.modId ? `mods/${plannerMap.modId}/${mapFile}` : `maps/${mapFile}`}`;
}

async function loadMapXml(
  mapId: string,
  season: TilesheetSeason,
  mapAssetUrl: string,
  fetchMapAsset: (assetUrl: string) => Promise<MapAssetResponse>,
): Promise<string> {
  let mapResponse: MapAssetResponse;
  try {
    mapResponse = await fetchMapAsset(mapAssetUrl);
  } catch (caughtError) {
    throw createMapResourceError(
      "fetch",
      mapId,
      season,
      mapAssetUrl,
      caughtError,
    );
  }
  if (typeof mapResponse !== "object" || mapResponse === null) {
    throw new TypeError(
      `Map fetch response for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} at URL ${JSON.stringify(mapAssetUrl)} must be an object; received ${describeValue(mapResponse)}.`,
    );
  }
  assertMapAssetResponse(
    mapResponse,
    mapId,
    season,
    mapAssetUrl,
  );
  if (!mapResponse.ok) {
    throw new Error(`Could not load local TMX asset ${JSON.stringify(mapAssetUrl)} for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)}. Received HTTP status ${mapResponse.status}.`);
  }
  let mapXml: string;
  try {
    mapXml = await mapResponse.text();
  } catch (caughtError) {
    throw createMapResourceError(
      "response text",
      mapId,
      season,
      mapAssetUrl,
      caughtError,
    );
  }
  if (typeof mapXml !== "string") {
    throw new TypeError(
      `Map response text for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} at URL ${JSON.stringify(mapAssetUrl)} must be a string; received ${describeValue(mapXml)}.`,
    );
  }
  if (mapXml.length === 0) {
    throw new Error(`Local TMX asset ${JSON.stringify(mapAssetUrl)} for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} is empty.`);
  }
  return mapXml;
}

function assertMapAssetResponse(
  mapResponse: MapAssetResponse,
  mapId: string,
  season: TilesheetSeason,
  mapAssetUrl: string,
): void {
  const responseRecord = mapResponse as Record<string, unknown>;
  for (const [fieldName, fieldValue, isValid] of [
    ["ok", responseRecord.ok, typeof responseRecord.ok === "boolean"],
    [
      "status",
      responseRecord.status,
      typeof responseRecord.status === "number" &&
        Number.isFinite(responseRecord.status) &&
        Number.isInteger(responseRecord.status) &&
        responseRecord.status >= 100 &&
        responseRecord.status <= 599,
    ],
    ["text", responseRecord.text, typeof responseRecord.text === "function"],
  ] as const) {
    if (!isValid) {
      throw new TypeError(
        `Map fetch response ${fieldName} for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} at URL ${JSON.stringify(mapAssetUrl)} is invalid; received ${describeValue(fieldValue)}.`,
      );
    }
  }
}

async function loadPlannerMap(
  request: DefaultMapRequest,
  mapXml: string,
  mapAssetUrl: string,
  fetchMapAsset: (assetUrl: string) => Promise<MapAssetResponse>,
  parseMapXml: (mapXml: string) => Promise<TmxMap>,
): Promise<TmxMap> {
  const parsedMap = await parseMapXmlWithContext(
    request.mapId,
    request.season,
    mapAssetUrl,
    mapXml,
    parseMapXml,
  );
  if (request.mapId === "ginger-island") {
    const overlays = await Promise.all(gingerIslandOverlays.filter((overlay) => request.mapRenderOptions.gingerIslandOverlayIds.includes(overlay.id)).map(async (overlay) => ({
      ...overlay,
      map: await loadMapTileOverlay(
        request,
        overlay.id,
        overlay.mapFile,
        fetchMapAsset,
        parseMapXml,
      ),
    })));
    return composeMapTileOverlays(parsedMap, overlays);
  }
  if (request.mapId !== "farmhouse-2") return parsedMap;
  const overlays = await Promise.all(
    getFarmhouse2MapTileOverlays(request.mapRenderOptions).map(
      async (overlay) => ({
        ...overlay,
        map: await loadMapTileOverlay(
          request,
          overlay.id,
          overlay.mapFile,
          fetchMapAsset,
          parseMapXml,
        ),
      }),
    ),
  );
  return composeMapTileOverlays(parsedMap, overlays, getMapTileCompositionOptions(request.mapId));
}

export function getMapTileCompositionOptions(
  mapId: string,
): MapTileCompositionOptions | undefined {
  return mapId === "farmhouse-2" ? { includeTileDataProperties: true } : undefined;
}

function getFarmhouse2MapTileOverlays(mapRenderOptions: MapRenderOptions) {
  const selectedRenovations = new Set(mapRenderOptions.farmhouse2.renovationIds);
  const selectedSpouseRoom = mapRenderOptions.farmhouse2.spouseId === null
    ? null
    : spouseRoomLayouts.find(
      (layout) => layout.spouseId === mapRenderOptions.farmhouse2.spouseId,
    );
  if (selectedSpouseRoom === undefined) {
    throw new Error(`Farmhouse 2 spouse room ${JSON.stringify(mapRenderOptions.farmhouse2.spouseId)} is unavailable in the locked map catalog.`);
  }
  return [
    ...farmhouse2Composite.renovations.filter((renovation) =>
      selectedRenovations.has(renovation.id),
    ),
    ...(selectedSpouseRoom === null
      ? []
      : [{
        id: `spouse-${selectedSpouseRoom.spouseId}`,
        mapFile: farmhouse2Composite.spouseRoomMapFile,
        sourceCrop: selectedSpouseRoom.sourceCrop,
        target: selectedSpouseRoom.target,
      }]),
  ];
}

async function loadMapTileOverlay(
  request: DefaultMapRequest,
  overlayId: string,
  mapFile: string,
  fetchMapAsset: (assetUrl: string) => Promise<MapAssetResponse>,
  parseMapXml: (mapXml: string) => Promise<TmxMap>,
): Promise<TmxMap> {
  if (!/^[A-Za-z0-9_ -]+\.tmx$/.test(mapFile)) {
    throw new Error(`Map tile overlay ${JSON.stringify(overlayId)} for mapId ${JSON.stringify(request.mapId)} must use a safe .tmx filename; received ${JSON.stringify(mapFile)}.`);
  }
  const overlayMapUrl = `${localGameAssetRoot}maps/${mapFile}`;
  const overlayMapXml = await loadMapXml(
    `${request.mapId}:${overlayId}`,
    request.season,
    overlayMapUrl,
    fetchMapAsset,
  );
  return parseMapXmlWithContext(
    `${request.mapId}:${overlayId}`,
    request.season,
    overlayMapUrl,
    overlayMapXml,
    parseMapXml,
  );
}

async function parseMapXmlWithContext(
  mapId: string,
  season: TilesheetSeason,
  mapAssetUrl: string,
  mapXml: string,
  parseMapXml: (mapXml: string) => Promise<TmxMap>,
): Promise<TmxMap> {
  try {
    return await parseMapXml(mapXml);
  } catch (caughtError) {
    throw createMapResourceError(
      "parse",
      mapId,
      season,
      mapAssetUrl,
      caughtError,
    );
  }
}

function assertDefaultMapResourcePorts(ports: DefaultMapResourcePorts): void {
  for (const [portName, port] of Object.entries(ports)) {
    if (port !== undefined && typeof port !== "function") {
      throw new TypeError(
        `Default map resource port ${portName} must be a function; received ${describeValue(port)}.`,
      );
    }
  }
}

function createMapResourceError(
  operationName: string,
  mapId: string,
  season: TilesheetSeason,
  mapAssetUrl: string,
  caughtError: unknown,
): Error {
  return new Error(
    `Could not ${operationName} local TMX asset for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)} at URL ${JSON.stringify(mapAssetUrl)}: ${describeCaughtError(caughtError)}.`,
    { cause: caughtError },
  );
}

function describeCaughtError(caughtError: unknown): string {
  return caughtError instanceof Error
    ? caughtError.message
    : describeValue(caughtError);
}

function describeValue(value: unknown): string {
  try { return JSON.stringify(value) ?? String(value); } catch { return Object.prototype.toString.call(value); }
}
