import type {
  CatalogBuildingLayerTint,
  CatalogBuildingMultilayerLayer,
  CatalogBuildingMultilayerRenderingMetadata,
  CatalogItem,
  CatalogSeason,
  CatalogSourceRect,
} from "../catalog";
import { getBuildingCompositionLayerFrame } from "../catalog/building-composition";
import type {
  PlacementBuilding,
  PlacementItem,
} from "../placement/placement-snapshot";
import type { PlacementRenderEntry } from "./placement-rendering";

const renderingTileSize = 16;

export function createBuildingMultilayerPlacementRenderEntries(
  catalogItem: CatalogItem,
  placementBuilding: PlacementBuilding,
  season: CatalogSeason,
  placementItems: readonly PlacementItem[] = [],
): readonly PlacementRenderEntry[] {
  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "building-multilayer") {
    throw new Error(
      `Placement rendering building ${JSON.stringify(placementBuilding.buildingId)} requires frozen building composition metadata.`,
    );
  }

  assertBuildingMultilayerRenderingContract(
    catalogItem,
    placementBuilding,
    renderingMetadata,
  );

  return renderingMetadata.layers.flatMap((layer) => {
    if (
      layer.hideWhenWaterColorDefined === true &&
      placementBuilding.waterColor !== undefined
    ) {
      return [];
    }
    if (isBuildingLayerHiddenByPath(layer, placementBuilding, placementItems)) {
      return [];
    }
    const frame = getBuildingCompositionLayerFrame(
      layer,
      season,
      placementBuilding.variant ?? 0,
    );
    if (frame === null) {
      return [];
    }

    return [createBuildingLayerRenderEntry(
      catalogItem,
      placementBuilding,
      renderingMetadata,
      layer,
      frame,
      season,
    )];
  });
}

function createBuildingLayerRenderEntry(
  catalogItem: CatalogItem,
  placementBuilding: PlacementBuilding,
  renderingMetadata: CatalogBuildingMultilayerRenderingMetadata,
  layer: CatalogBuildingMultilayerLayer,
  frame: CatalogSourceRect,
  season: CatalogSeason,
): PlacementRenderEntry {
  const tintColor = getBuildingLayerTintColor(
    layer.tint,
    placementBuilding.waterColor,
    season,
  );

  return {
    catalogItem,
    effectiveFootprint: catalogItem.tileSize,
    frame: frame.width === 0 && frame.height === 0
      ? null
      : removeSourceRectKind(frame),
    key: `building:${String(placementBuilding.instanceId)}`,
    layerId: layer.id,
    ...(layer.opacity === undefined ? {} : { opacity: layer.opacity }),
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: placementBuilding.x * renderingTileSize + layer.offsetX,
      positionY: placementBuilding.y * renderingTileSize + layer.offsetY,
      ...(layer.scale === undefined ? {} : { uniformScale: layer.scale }),
    },
    rotationQuarterTurns: 0,
    textureLocalPath: layer.textureLocalPath ?? catalogItem.textureLocalPath,
    tileX: placementBuilding.x,
    tileY: placementBuilding.y,
    ...(tintColor === undefined ? {} : { tintColor }),
    zIndex: getBuildingLayerZIndex(
      layer,
      placementBuilding,
      catalogItem,
      renderingMetadata,
    ),
    ...createBuildingLayerPaint(
      catalogItem,
      placementBuilding,
      renderingMetadata,
      layer,
    ),
  };
}

function isBuildingLayerHiddenByPath(
  layer: CatalogBuildingMultilayerLayer,
  placementBuilding: PlacementBuilding,
  placementItems: readonly PlacementItem[],
): boolean {
  const relativeCoordinate = layer.hideWhenPathOccupiedAt;
  if (relativeCoordinate === undefined) {
    return false;
  }

  const targetX = placementBuilding.x + relativeCoordinate.x;
  const targetY = placementBuilding.y + relativeCoordinate.y;
  return placementItems.some((placementItem) =>
    placementItem.layer === "path" &&
    targetX >= placementItem.x &&
    targetX < placementItem.x + placementItem.footprint.width &&
    targetY >= placementItem.y &&
    targetY < placementItem.y + placementItem.footprint.height
  );
}

function getBuildingLayerZIndex(
  layer: CatalogBuildingMultilayerLayer,
  placementBuilding: PlacementBuilding,
  catalogItem: CatalogItem,
  renderingMetadata: CatalogBuildingMultilayerRenderingMetadata,
): number {
  if (layer.zIndexRule === "fixed-greenhouse-shadow") {
    return 0.05;
  }
  if (layer.zIndexRule === "farmhouse-mailbox") {
    return (placementBuilding.y + 5) * 2 - 1;
  }
  return (
    placementBuilding.y + catalogItem.tileSize.height
      - renderingMetadata.sortTileOffset
  ) * 2 - 1.5;
}

function createBuildingLayerPaint(
  catalogItem: CatalogItem,
  placementBuilding: PlacementBuilding,
  renderingMetadata: CatalogBuildingMultilayerRenderingMetadata,
  layer: CatalogBuildingMultilayerLayer,
): Pick<PlacementRenderEntry, "buildingPaint"> {
  if (placementBuilding.paintColors === undefined) {
    return {};
  }
  if (renderingMetadata.paintMaskLocalPath === undefined) {
    throw new Error(
      `Placement rendering building ${describeValue(placementBuilding.buildingId)} has paint colors but no locked paint mask.`,
    );
  }
  const layerTextureLocalPath =
    layer.textureLocalPath ?? catalogItem.textureLocalPath;
  if (layerTextureLocalPath !== catalogItem.textureLocalPath) {
    return {};
  }
  return {
    buildingPaint: {
      colors: placementBuilding.paintColors,
      paintMaskLocalPath: renderingMetadata.paintMaskLocalPath,
    },
  };
}

function getBuildingLayerTintColor(
  tint: CatalogBuildingLayerTint | undefined,
  waterColor: number | undefined,
  season: CatalogSeason,
): string | undefined {
  if (tint === undefined) {
    return undefined;
  }
  if (waterColor !== undefined) {
    return formatRgbColor(waterColor);
  }
  if (tint.kind === "water-color-or-fixed") {
    return formatRgbColor(tint.fixedColor);
  }

  return formatRgbColor(tint.seasonalColors[season]);
}

function formatRgbColor(rgbColor: number): string {
  return `#${rgbColor.toString(16).padStart(6, "0")}`;
}

function removeSourceRectKind(
  sourceRect: CatalogSourceRect,
): Exclude<PlacementRenderEntry["frame"], null> {
  return {
    x: sourceRect.x,
    y: sourceRect.y,
    width: sourceRect.width,
    height: sourceRect.height,
  };
}

function assertBuildingMultilayerRenderingContract(
  catalogItem: CatalogItem,
  placementBuilding: PlacementBuilding,
  renderingMetadata: CatalogBuildingMultilayerRenderingMetadata,
): void {
  if (catalogItem.category !== "building") {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(renderingMetadata.buildingId)} requires a building catalog item; received ${JSON.stringify(catalogItem.id)} with category ${JSON.stringify(catalogItem.category)}.`,
    );
  }
  const expectedCatalogItemId = `building:${renderingMetadata.buildingId}`;
  if (
    catalogItem.id !== expectedCatalogItemId ||
    placementBuilding.buildingId !== renderingMetadata.buildingId
  ) {
    throw new Error(
      `Building multilayer rendering metadata ID ${JSON.stringify(renderingMetadata.buildingId)} must match catalog ID ${JSON.stringify(catalogItem.id)} and placement building ID ${JSON.stringify(placementBuilding.buildingId)}; received expected catalog ID ${JSON.stringify(expectedCatalogItemId)}.`,
    );
  }
  if (!Number.isFinite(renderingMetadata.sortTileOffset)) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(renderingMetadata.buildingId)} sortTileOffset must be finite; received ${describeValue(renderingMetadata.sortTileOffset)}.`,
    );
  }
  if (!Array.isArray(renderingMetadata.layers) || renderingMetadata.layers.length === 0) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(renderingMetadata.buildingId)} layers must be a non-empty array; received ${describeValue(renderingMetadata.layers)}.`,
    );
  }

  const seenLayerIds = new Set<string>();
  for (const [layerIndex, layer] of renderingMetadata.layers.entries()) {
    assertBuildingMultilayerLayer(
      renderingMetadata.buildingId,
      layer,
      layerIndex,
      seenLayerIds,
    );
  }
  if (renderingMetadata.waterColors !== undefined) {
    assertBuildingWaterColors(
      renderingMetadata.buildingId,
      renderingMetadata.waterColors,
    );
  }
  if (
    renderingMetadata.paintMaskLocalPath !== undefined &&
    (typeof renderingMetadata.paintMaskLocalPath !== "string" ||
      renderingMetadata.paintMaskLocalPath.length === 0)
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(renderingMetadata.buildingId)} paintMaskLocalPath must be a non-empty string; received ${describeValue(renderingMetadata.paintMaskLocalPath)}.`,
    );
  }
}

function assertBuildingWaterColors(
  buildingId: string,
  waterColors: readonly Readonly<{ label: string; value: number }>[],
): void {
  if (!Array.isArray(waterColors) || waterColors.length === 0) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} waterColors must be a non-empty array; received ${describeValue(waterColors)}.`,
    );
  }
  const seenWaterColorValues = new Set<number>();
  for (const [waterColorIndex, waterColor] of waterColors.entries()) {
    const fieldPath = `waterColors[${String(waterColorIndex)}]`;
    if (typeof waterColor.label !== "string" || waterColor.label.length === 0) {
      throw new TypeError(
        `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.label must be a non-empty string; received ${describeValue(waterColor.label)}.`,
      );
    }
    assertRgbColor(buildingId, waterColor.value, `${fieldPath}.value`);
    if (seenWaterColorValues.has(waterColor.value)) {
      throw new TypeError(
        `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.value must be unique; received ${describeValue(waterColor.value)}.`,
      );
    }
    seenWaterColorValues.add(waterColor.value);
  }
}

function assertBuildingMultilayerLayer(
  buildingId: string,
  layer: CatalogBuildingMultilayerLayer,
  layerIndex: number,
  seenLayerIds: Set<string>,
): void {
  const fieldPath = `layers[${String(layerIndex)}]`;
  if (typeof layer.id !== "string" || layer.id.length === 0 || seenLayerIds.has(layer.id)) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.id must be a unique non-empty string; received ${describeValue(layer.id)}.`,
    );
  }
  seenLayerIds.add(layer.id);
  assertSourceRect(buildingId, layer.frame, `${fieldPath}.frame`);
  assertFiniteNumber(buildingId, layer.offsetX, `${fieldPath}.offsetX`);
  assertFiniteNumber(buildingId, layer.offsetY, `${fieldPath}.offsetY`);
  if (layer.scale !== undefined && (!Number.isFinite(layer.scale) || layer.scale <= 0)) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.scale must be a positive finite number; received ${describeValue(layer.scale)}.`,
    );
  }
  if (
    layer.opacity !== undefined &&
    (!Number.isFinite(layer.opacity) || layer.opacity < 0 || layer.opacity > 1)
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.opacity must be from 0 through 1; received ${describeValue(layer.opacity)}.`,
    );
  }
  if (
    layer.textureLocalPath !== undefined &&
    (typeof layer.textureLocalPath !== "string" || layer.textureLocalPath.length === 0)
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.textureLocalPath must be a non-empty string; received ${describeValue(layer.textureLocalPath)}.`,
    );
  }
  if (layer.tint !== undefined) {
    assertLayerTint(buildingId, layer.tint, `${fieldPath}.tint`);
  }
  if (layer.variantFrames !== undefined) {
    if (!Array.isArray(layer.variantFrames) || layer.variantFrames.length < 2) {
      throw new TypeError(
        `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.variantFrames must contain at least two frames; received ${describeValue(layer.variantFrames)}.`,
      );
    }
    layer.variantFrames.forEach((variantFrame, variantIndex) => {
      if (variantFrame !== null) {
        assertSourceRect(
          buildingId,
          variantFrame,
          `${fieldPath}.variantFrames[${String(variantIndex)}]`,
        );
      }
    });
  }
  if (layer.seasonalFrames !== undefined) {
    for (const season of ["spring", "summer", "fall", "winter"] as const) {
      assertSourceRect(
        buildingId,
        layer.seasonalFrames[season],
        `${fieldPath}.seasonalFrames.${season}`,
      );
    }
  }
  if (layer.hideWhenPathOccupiedAt !== undefined) {
    assertFiniteNumber(
      buildingId,
      layer.hideWhenPathOccupiedAt.x,
      `${fieldPath}.hideWhenPathOccupiedAt.x`,
    );
    assertFiniteNumber(
      buildingId,
      layer.hideWhenPathOccupiedAt.y,
      `${fieldPath}.hideWhenPathOccupiedAt.y`,
    );
  }
  if (
    layer.zIndexRule !== undefined &&
    layer.zIndexRule !== "fixed-greenhouse-shadow" &&
    layer.zIndexRule !== "farmhouse-mailbox"
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.zIndexRule is unsupported; received ${describeValue(layer.zIndexRule)}.`,
    );
  }
}

function assertLayerTint(
  buildingId: string,
  tint: CatalogBuildingLayerTint,
  fieldPath: string,
): void {
  if (tint.kind === "water-color-or-fixed") {
    assertRgbColor(buildingId, tint.fixedColor, `${fieldPath}.fixedColor`);
    return;
  }
  if (tint.kind !== "water-color-or-season") {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath}.kind is unsupported; received ${describeValue((tint as { kind?: unknown }).kind)}.`,
    );
  }
  for (const season of ["spring", "summer", "fall", "winter"] as const) {
    assertRgbColor(
      buildingId,
      tint.seasonalColors[season],
      `${fieldPath}.seasonalColors.${season}`,
    );
  }
}

function assertRgbColor(
  buildingId: string,
  rgbColor: unknown,
  fieldPath: string,
): void {
  if (
    typeof rgbColor !== "number" ||
    !Number.isInteger(rgbColor) ||
    rgbColor < 0 ||
    rgbColor > 0xffffff
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath} must be an integer from 0 through 16777215; received ${describeValue(rgbColor)}.`,
    );
  }
}

function assertSourceRect(
  buildingId: string,
  sourceRect: CatalogSourceRect,
  fieldPath: string,
): void {
  if (
    sourceRect?.kind !== "source-rect" ||
    !Number.isInteger(sourceRect.x) || sourceRect.x < 0 ||
    !Number.isInteger(sourceRect.y) || sourceRect.y < 0 ||
    !Number.isInteger(sourceRect.width) || sourceRect.width < 0 ||
    !Number.isInteger(sourceRect.height) || sourceRect.height < 0 ||
    ((sourceRect.width === 0) !== (sourceRect.height === 0))
  ) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath} must contain non-negative integer x/y and width/height that are either both zero or both positive; received ${describeValue(sourceRect)}.`,
    );
  }
}

function assertFiniteNumber(
  buildingId: string,
  receivedNumber: unknown,
  fieldPath: string,
): void {
  if (typeof receivedNumber !== "number" || !Number.isFinite(receivedNumber)) {
    throw new TypeError(
      `Building multilayer rendering metadata ${JSON.stringify(buildingId)} ${fieldPath} must be finite; received ${describeValue(receivedNumber)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === undefined) return "undefined";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
