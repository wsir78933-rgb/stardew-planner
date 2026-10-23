import { getBaseTileGid } from "../tmx/decode-tile-layer-data";
import type {
  MapRenderingContract,
  RenderingTileLayer,
} from "./map-rendering-contract";
import type { TilesheetSeason } from "./tilesheet-asset-resolver";

const waterAnimationFrameCount = 10;
const waterAnimationFrameDurationMilliseconds = 200;
const waterScrollPixelsPerMillisecond = 0.006;
const waterScrollSourceStepPixels = 4;
const waterAtlasFrameSizePixels = 64;

export type WaterSurfaceSourceRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type WaterSurfaceAnimationFrame = Readonly<{
  index: number;
  durationMilliseconds: number;
  sourceRectsByFlip: readonly [
    WaterSurfaceSourceRect,
    WaterSurfaceSourceRect,
  ];
}>;

export type MapWaterTilePosition = Readonly<{
  tileX: number;
  tileY: number;
  layerIndex: number;
  parity: 0 | 1;
  isTopTile: boolean;
  isBottomTile: boolean;
}>;

export type MapWaterSurfaceFrameState = Readonly<{
  frameIndex: number;
  phaseIndex: 0 | 1;
  textureRect: WaterSurfaceSourceRect;
  fillTextureRect: WaterSurfaceSourceRect | null;
  tileOffsetY: number;
  fillOffsetY: number;
  fillVisible: boolean;
}>;

export type MapWaterAnimationUpdate = Readonly<{
  update(currentTimeMilliseconds: number): boolean;
}>;

export function getMapWaterSeasonTint(season: TilesheetSeason): number {
  switch (season) {
    case "spring":
      return 0x78c8ff;
    case "summer":
      return 0x3cf0ff;
    case "fall":
      return 0xff82c8;
    case "winter":
      return 0x8250ff;
    default:
      throw new TypeError(
        `Map water season must be spring, summer, fall, or winter; received ${describeValue(season)}.`,
      );
  }
}

export function createMapWaterTilePositions(
  mapRenderingContract: MapRenderingContract,
): readonly MapWaterTilePosition[] {
  validateMapWaterRenderingContract(mapRenderingContract);

  const backLayerIndex = mapRenderingContract.visibleTileLayers.findIndex(
    (renderingTileLayer) => renderingTileLayer.name === "Back",
  );
  if (backLayerIndex === -1) {
    return [];
  }

  const backLayer = mapRenderingContract.visibleTileLayers[backLayerIndex];
  if (backLayer === undefined) {
    throw new Error(
      `Map water layer index ${backLayerIndex} is unavailable for mapId ${JSON.stringify(mapRenderingContract.mapId)}.`,
    );
  }

  const waterLayerIndexByCoordinate = new Map<string, number>();
  collectWaterTileLayerPositions(
    backLayer,
    backLayerIndex,
    mapRenderingContract.waterTileGids,
    waterLayerIndexByCoordinate,
  );

  const waterTilePositions = [...waterLayerIndexByCoordinate.entries()].map(
    ([coordinateKey, layerIndex]) => {
      const [tileXText, tileYText] = coordinateKey.split(":");
      const tileX = Number(tileXText);
      const tileY = Number(tileYText);
      const hasWaterAbove = waterLayerIndexByCoordinate.has(`${tileX}:${tileY - 1}`);
      const hasWaterBelow = waterLayerIndexByCoordinate.has(`${tileX}:${tileY + 1}`);

      return {
        tileX,
        tileY,
        layerIndex,
        parity: ((tileX + tileY) % 2) as 0 | 1,
        isTopTile: !hasWaterAbove,
        isBottomTile: !hasWaterBelow,
      };
    },
  );

  return waterTilePositions.sort(
    (firstTile, secondTile) =>
      firstTile.layerIndex - secondTile.layerIndex ||
      firstTile.tileY - secondTile.tileY ||
      firstTile.tileX - secondTile.tileX,
  );
}

export function getMapWaterOverlayInsertionIndex(
  mapRenderingContract: MapRenderingContract,
): number {
  validateMapWaterRenderingContract(mapRenderingContract);

  const buildingsLayerIndex = mapRenderingContract.visibleTileLayers.findIndex(
    (renderingTileLayer) => renderingTileLayer.name.startsWith("Buildings"),
  );
  if (buildingsLayerIndex !== -1) {
    return buildingsLayerIndex;
  }

  const alwaysFrontLayerIndex = mapRenderingContract.visibleTileLayers.findIndex(
    (renderingTileLayer) => renderingTileLayer.name.startsWith("AlwaysFront"),
  );
  return alwaysFrontLayerIndex === -1
    ? mapRenderingContract.visibleTileLayers.length
    : alwaysFrontLayerIndex;
}

export function getMapWaterSurfaceFrameState(
  waterTilePosition: MapWaterTilePosition,
  waterSurfaceFrames: readonly WaterSurfaceAnimationFrame[],
  currentTimeMilliseconds: number,
  tileHeight: number,
): MapWaterSurfaceFrameState {
  validateWaterTilePosition(waterTilePosition);
  validateWaterSurfaceFrames(waterSurfaceFrames);
  validateCurrentTime(currentTimeMilliseconds);
  validatePositiveFiniteNumber(tileHeight, "tileHeight");

  return getMapWaterSurfaceFrameStateUnchecked(
    waterTilePosition,
    waterSurfaceFrames,
    currentTimeMilliseconds,
    tileHeight,
  );
}

export function createMapWaterAnimationUpdate(
  waterTilePositions: readonly MapWaterTilePosition[],
  waterSurfaceFrames: readonly WaterSurfaceAnimationFrame[],
  tileHeight: number,
  applyFrameState: (
    waterTilePosition: MapWaterTilePosition,
    frameState: MapWaterSurfaceFrameState,
  ) => void,
  mapId: string,
): MapWaterAnimationUpdate {
  if (!Array.isArray(waterTilePositions)) {
    throw new TypeError(
      `Map water animation tile positions must be an array for mapId ${JSON.stringify(mapId)}; received ${describeValue(waterTilePositions)}.`,
    );
  }
  for (const waterTilePosition of waterTilePositions) {
    validateWaterTilePosition(waterTilePosition);
  }
  validateWaterSurfaceFrames(waterSurfaceFrames);
  validatePositiveFiniteNumber(tileHeight, "tileHeight");
  if (typeof applyFrameState !== "function") {
    throw new TypeError(
      `Map water animation callback must be a function for mapId ${JSON.stringify(mapId)}; received ${describeValue(applyFrameState)}.`,
    );
  }
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Map water animation mapId must be a non-empty string; received ${describeValue(mapId)}.`,
    );
  }

  const waterTilePositionsByStyle = groupWaterTilePositions(waterTilePositions);
  const previousFrameStateKeyByStyle = new Map<string, string>();

  return {
    update(currentTimeMilliseconds): boolean {
      validateCurrentTime(currentTimeMilliseconds);
      let didChangeWaterSurface = false;

      for (const [styleKey, tilesInStyle] of waterTilePositionsByStyle) {
        const firstWaterTilePosition = tilesInStyle[0];
        if (firstWaterTilePosition === undefined) {
          throw new Error(
            `Map water animation style ${JSON.stringify(styleKey)} has no tile positions for mapId ${JSON.stringify(mapId)}.`,
          );
        }

        const frameState = getMapWaterSurfaceFrameStateUnchecked(
          firstWaterTilePosition,
          waterSurfaceFrames,
          currentTimeMilliseconds,
          tileHeight,
        );
        const frameStateKey = getFrameStateKey(frameState);
        if (previousFrameStateKeyByStyle.get(styleKey) === frameStateKey) {
          continue;
        }

        previousFrameStateKeyByStyle.set(styleKey, frameStateKey);
        for (const waterTilePosition of tilesInStyle) {
          applyFrameState(waterTilePosition, frameState);
        }
        didChangeWaterSurface = true;
      }

      return didChangeWaterSurface;
    },
  };
}

function collectWaterTileLayerPositions(
  renderingTileLayer: RenderingTileLayer,
  layerIndex: number,
  waterTileGids: ReadonlySet<number>,
  waterLayerIndexByCoordinate: Map<string, number>,
): void {
  for (let tileIndex = 0; tileIndex < renderingTileLayer.rawGids.length; tileIndex += 1) {
    const tileGid = getBaseTileGid(renderingTileLayer.rawGids[tileIndex] ?? 0);
    if (!waterTileGids.has(tileGid)) {
      continue;
    }

    const tileX = tileIndex % renderingTileLayer.width;
    const tileY = Math.floor(tileIndex / renderingTileLayer.width);
    const coordinateKey = `${tileX}:${tileY}`;
    waterLayerIndexByCoordinate.set(coordinateKey, layerIndex);
  }
}

function getMapWaterSurfaceFrameStateUnchecked(
  waterTilePosition: MapWaterTilePosition,
  waterSurfaceFrames: readonly WaterSurfaceAnimationFrame[],
  currentTimeMilliseconds: number,
  tileHeight: number,
): MapWaterSurfaceFrameState {
  const frameIndex = Math.floor(
    currentTimeMilliseconds / waterAnimationFrameDurationMilliseconds,
  ) % waterAnimationFrameCount;
  const waterSurfaceFrame = waterSurfaceFrames[frameIndex];
  if (waterSurfaceFrame === undefined) {
    throw new Error(
      `Map water animation frame ${frameIndex} is unavailable at ${currentTimeMilliseconds}ms.`,
    );
  }

  const scrollPixels = getWaterScrollPixels(currentTimeMilliseconds);
  const flip = getWaterFlip(currentTimeMilliseconds);
  const phaseIndex = ((waterTilePosition.parity + flip) % 2) as 0 | 1;
  const baseTextureRect = waterSurfaceFrame.sourceRectsByFlip[phaseIndex];
  const fillPhaseIndex = ((waterTilePosition.parity + 1 + flip) % 2) as 0 | 1;
  const fillBaseTextureRect = waterSurfaceFrame.sourceRectsByFlip[fillPhaseIndex];
  const pixelsToMapScale = tileHeight / waterAtlasFrameSizePixels;
  const textureRect = waterTilePosition.isTopTile
    ? {
      ...baseTextureRect,
      y: baseTextureRect.y + scrollPixels,
      height: baseTextureRect.height - scrollPixels,
    }
    : baseTextureRect;
  const fillVisible = waterTilePosition.isBottomTile && scrollPixels > 0;

  return {
    frameIndex: waterSurfaceFrame.index,
    phaseIndex,
    textureRect,
    fillTextureRect: fillVisible
      ? { ...fillBaseTextureRect, height: scrollPixels }
      : null,
    tileOffsetY: waterTilePosition.isTopTile
      ? 0
      : -scrollPixels * pixelsToMapScale,
    fillOffsetY: tileHeight - scrollPixels * pixelsToMapScale,
    fillVisible,
  };
}

function groupWaterTilePositions(
  waterTilePositions: readonly MapWaterTilePosition[],
): ReadonlyMap<string, readonly MapWaterTilePosition[]> {
  const waterTilePositionsByStyle = new Map<string, MapWaterTilePosition[]>();
  for (const waterTilePosition of waterTilePositions) {
    const styleKey = `${waterTilePosition.parity}:${waterTilePosition.isTopTile ? 1 : 0}:${waterTilePosition.isBottomTile ? 1 : 0}`;
    const tilesInStyle = waterTilePositionsByStyle.get(styleKey) ?? [];
    tilesInStyle.push(waterTilePosition);
    waterTilePositionsByStyle.set(styleKey, tilesInStyle);
  }

  return waterTilePositionsByStyle;
}

function getWaterScrollPixels(currentTimeMilliseconds: number): number {
  const scrollProgressPixels =
    (currentTimeMilliseconds * waterScrollPixelsPerMillisecond) % waterAtlasFrameSizePixels;
  return Math.floor(scrollProgressPixels / waterScrollSourceStepPixels) * waterScrollSourceStepPixels;
}

function getWaterFlip(currentTimeMilliseconds: number): 0 | 1 {
  return Math.floor(
    currentTimeMilliseconds * waterScrollPixelsPerMillisecond / waterAtlasFrameSizePixels,
  ) % 2 as 0 | 1;
}

function getFrameStateKey(frameState: MapWaterSurfaceFrameState): string {
  const textureRect = frameState.textureRect;
  const fillTextureRect = frameState.fillTextureRect;
  return [
    frameState.frameIndex,
    frameState.phaseIndex,
    textureRect.x,
    textureRect.y,
    textureRect.width,
    textureRect.height,
    fillTextureRect?.x ?? "none",
    fillTextureRect?.y ?? "none",
    fillTextureRect?.width ?? "none",
    fillTextureRect?.height ?? "none",
    frameState.tileOffsetY,
    frameState.fillOffsetY,
    frameState.fillVisible,
  ].join(":");
}

function validateMapWaterRenderingContract(
  mapRenderingContract: MapRenderingContract,
): void {
  if (typeof mapRenderingContract !== "object" || mapRenderingContract === null) {
    throw new TypeError(
      `Map water rendering contract must be a non-null object; received ${describeValue(mapRenderingContract)}.`,
    );
  }
  if (typeof mapRenderingContract.mapId !== "string" || mapRenderingContract.mapId.length === 0) {
    throw new TypeError(
      `Map water rendering contract mapId must be a non-empty string; received ${describeValue(mapRenderingContract.mapId)}.`,
    );
  }
  if (!Array.isArray(mapRenderingContract.visibleTileLayers)) {
    throw new TypeError(
      `Map water rendering contract visibleTileLayers must be an array for mapId ${JSON.stringify(mapRenderingContract.mapId)}; received ${describeValue(mapRenderingContract.visibleTileLayers)}.`,
    );
  }
  if (!(mapRenderingContract.waterTileGids instanceof Set)) {
    throw new TypeError(
      `Map water rendering contract waterTileGids must be a Set for mapId ${JSON.stringify(mapRenderingContract.mapId)}; received ${describeValue(mapRenderingContract.waterTileGids)}.`,
    );
  }
}

function validateWaterTilePosition(waterTilePosition: MapWaterTilePosition): void {
  if (typeof waterTilePosition !== "object" || waterTilePosition === null) {
    throw new TypeError(
      `Map water tile position must be a non-null object; received ${describeValue(waterTilePosition)}.`,
    );
  }
  for (const [coordinateName, coordinateValue] of [
    ["tileX", waterTilePosition.tileX],
    ["tileY", waterTilePosition.tileY],
    ["layerIndex", waterTilePosition.layerIndex],
  ] as const) {
    if (!Number.isSafeInteger(coordinateValue) || coordinateValue < 0) {
      throw new RangeError(
        `Map water tile ${coordinateName} must be a non-negative safe integer; received ${describeValue(coordinateValue)}.`,
      );
    }
  }
  if (waterTilePosition.parity !== 0 && waterTilePosition.parity !== 1) {
    throw new TypeError(
      `Map water tile parity must be 0 or 1; received ${describeValue(waterTilePosition.parity)}.`,
    );
  }
  if (typeof waterTilePosition.isTopTile !== "boolean" || typeof waterTilePosition.isBottomTile !== "boolean") {
    throw new TypeError(
      `Map water tile edge flags must be booleans; received top ${describeValue(waterTilePosition.isTopTile)} and bottom ${describeValue(waterTilePosition.isBottomTile)}.`,
    );
  }
}

function validateWaterSurfaceFrames(
  waterSurfaceFrames: readonly WaterSurfaceAnimationFrame[],
): void {
  if (!Array.isArray(waterSurfaceFrames) || waterSurfaceFrames.length !== waterAnimationFrameCount) {
    throw new RangeError(
      `Map water animation must contain exactly ${waterAnimationFrameCount} frames; received ${describeValue(waterSurfaceFrames)}.`,
    );
  }

  for (const [frameIndex, waterSurfaceFrame] of waterSurfaceFrames.entries()) {
    if (
      typeof waterSurfaceFrame !== "object" ||
      waterSurfaceFrame === null ||
      waterSurfaceFrame.index !== frameIndex ||
      !Number.isSafeInteger(waterSurfaceFrame.durationMilliseconds) ||
      waterSurfaceFrame.durationMilliseconds !== waterAnimationFrameDurationMilliseconds ||
      !Array.isArray(waterSurfaceFrame.sourceRectsByFlip) ||
      waterSurfaceFrame.sourceRectsByFlip.length !== 2
    ) {
      throw new TypeError(
        `Map water animation frame ${frameIndex} must have index ${frameIndex}, duration ${waterAnimationFrameDurationMilliseconds}ms, and two source rectangles; received ${describeValue(waterSurfaceFrame)}.`,
      );
    }
    for (const [flipIndex, sourceRect] of waterSurfaceFrame.sourceRectsByFlip.entries()) {
      if (
        typeof sourceRect !== "object" ||
        sourceRect === null ||
        !Number.isSafeInteger(sourceRect.x) ||
        sourceRect.x !== frameIndex * waterAtlasFrameSizePixels ||
        !Number.isSafeInteger(sourceRect.y) ||
        sourceRect.y !== 2064 + flipIndex * 128 ||
        sourceRect.width !== waterAtlasFrameSizePixels ||
        sourceRect.height !== waterAtlasFrameSizePixels
      ) {
        throw new TypeError(
          `Map water animation frame ${frameIndex} flip ${flipIndex} must use the verified 64x64 Cursors water rect; received ${describeValue(sourceRect)}.`,
        );
      }
    }
  }
}

function validateCurrentTime(currentTimeMilliseconds: number): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    throw new TypeError(
      `Map water animation time must be a finite non-negative number of milliseconds; received ${describeValue(currentTimeMilliseconds)}.`,
    );
  }
}

function validatePositiveFiniteNumber(value: number, valueName: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(
      `Map water animation ${valueName} must be positive and finite; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  try {
    const serializedValue = JSON.stringify(value);
    if (serializedValue !== undefined) {
      return serializedValue;
    }
  } catch {
    // Fall through for values such as circular objects.
  }

  return String(value);
}
