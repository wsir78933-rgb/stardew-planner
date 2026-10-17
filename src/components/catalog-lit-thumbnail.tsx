"use client";

import type { CSSProperties } from "react";
import {
  validateCatalogItemPresentationChoice,
  type CatalogItem,
  type CatalogLitBigCraftableRenderingMetadata,
  type CatalogPresentationChoice,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import { fireAnimationFrames } from "../rendering/fire-rendering-primitives";
import {
  createLitBigCraftablePlacementRenderLayers,
  type LitBigCraftablePlacementRenderLayer,
} from "../rendering/lit-big-craftable-placement-rendering";
import type { PlacementRenderFrame } from "../rendering/placement-rendering";
import { resolvePlannerTextureFrame } from "../rendering/planner-texture-frame-resolution";

const lockedLitBodyFrame = { height: 32, width: 16 } as const;
const staticFireFrame = fireAnimationFrames[0];

type CatalogLitThumbnailProperties = Readonly<{
  bodyStyle: CSSProperties;
  catalogItem: CatalogItem;
  presentationChoice: CatalogPresentationChoice;
  shouldLoadThumbnail: boolean;
  thumbnailClassName: string;
}>;

export function CatalogLitThumbnail({
  bodyStyle,
  catalogItem,
  presentationChoice,
  shouldLoadThumbnail,
  thumbnailClassName,
}: CatalogLitThumbnailProperties) {
  if (typeof shouldLoadThumbnail !== "boolean") {
    throw new TypeError(
      `Catalog lit thumbnail loading flag for ${JSON.stringify(catalogItem.id)} must be a boolean; received ${JSON.stringify(shouldLoadThumbnail)}.`,
    );
  }
  if (typeof thumbnailClassName !== "string" || thumbnailClassName.length === 0) {
    throw new TypeError(
      `Catalog lit thumbnail class for ${JSON.stringify(catalogItem.id)} must be a non-empty string; received ${JSON.stringify(thumbnailClassName)}.`,
    );
  }

  const validatedChoice = validateCatalogItemPresentationChoice(
    catalogItem,
    presentationChoice,
  );
  const renderingMetadata = readLitBigCraftableRenderingMetadata(catalogItem);
  const bodyWidth = readThumbnailPixelSize(bodyStyle.width, "width", catalogItem.id);
  const bodyHeight = readThumbnailPixelSize(bodyStyle.height, "height", catalogItem.id);
  const flameStyles = createCatalogLitFlameStyles({
    bodyHeight,
    bodyWidth,
    catalogItem,
    renderingMetadata,
    shouldLoadThumbnail,
    variant: validatedChoice.variant,
  });

  return (
    <span
      className={`catalog-lit-thumbnail ${thumbnailClassName}`}
      style={{
        display: "block",
        height: bodyHeight,
        overflow: "visible",
        position: "relative",
        width: bodyWidth,
      }}
    >
      <span
        className="catalog-lit-thumbnail__body"
        style={{
          ...bodyStyle,
          backgroundRepeat: "no-repeat",
          display: "block",
          height: "100%",
          imageRendering: "pixelated",
          width: "100%",
        }}
      />
      {flameStyles.map((flameStyle, flameIndex) => (
        <span
          className="catalog-lit-thumbnail__flame"
          key={`${catalogItem.id}:flame:${String(flameIndex)}`}
          style={flameStyle}
        />
      ))}
    </span>
  );
}

function createCatalogLitFlameStyles(input: Readonly<{
  bodyHeight: number;
  bodyWidth: number;
  catalogItem: CatalogItem;
  renderingMetadata: CatalogLitBigCraftableRenderingMetadata;
  shouldLoadThumbnail: boolean;
  variant: number;
}>): readonly CSSProperties[] {
  if (staticFireFrame === undefined) {
    throw new Error("Static fire animation frame 0 is missing.");
  }
  if (input.renderingMetadata.flameLayers.length === 0) {
    throw new Error(
      `Lit BigCraftable catalog item ${JSON.stringify(input.catalogItem.id)} has no flame layers; received ${JSON.stringify(input.renderingMetadata)}.`,
    );
  }

  const renderLayers = createLitBigCraftablePlacementRenderLayers(
    input.catalogItem,
    createLitThumbnailPlacementItem(input.catalogItem, input.variant),
    createLitThumbnailBaseFrame(input.catalogItem),
  );
  if (renderLayers === null) {
    throw new Error(
      `Lit thumbnail for ${JSON.stringify(input.catalogItem.id)} produced no placement layers.`,
    );
  }

  const baseLayer = renderLayers[0];
  if (baseLayer === undefined || baseLayer.textureLocalPath !== undefined) {
    throw new Error(
      `Lit thumbnail for ${JSON.stringify(input.catalogItem.id)} is missing its body layer; received ${JSON.stringify(renderLayers)}.`,
    );
  }

  const bodyScale = readUniformThumbnailScale(
    input.catalogItem.id,
    input.bodyWidth,
    input.bodyHeight,
    baseLayer.frame,
  );
  const flameLayers = renderLayers.filter(isStaticFireLayer);
  assertFlameLayerCount(
    input.catalogItem.id,
    input.variant,
    input.renderingMetadata.flameLayers.length,
    flameLayers.length,
  );

  return flameLayers.map((flameLayer) =>
    createFlameStyle(
      input.catalogItem.id,
      flameLayer,
      baseLayer,
      bodyScale,
      input.shouldLoadThumbnail,
    )
  );
}

function createFlameStyle(
  catalogItemId: string,
  flameLayer: LitBigCraftablePlacementRenderLayer,
  baseLayer: LitBigCraftablePlacementRenderLayer,
  bodyScale: number,
  shouldLoadThumbnail: boolean,
): CSSProperties {
  if (staticFireFrame === undefined) {
    throw new Error("Static fire animation frame 0 is missing.");
  }
  const flameFrame = flameLayer.frame;
  if (flameFrame === null) {
    throw new Error(
      `Lit thumbnail flame frame for ${JSON.stringify(catalogItemId)} is missing.`,
    );
  }
  if (flameLayer.textureLocalPath === undefined) {
    throw new Error(
      `Lit thumbnail flame layer for ${JSON.stringify(catalogItemId)} is missing a texture path; received ${JSON.stringify(flameLayer)}.`,
    );
  }
  assertFlameAnchor(catalogItemId, flameLayer);

  const resolvedFlame = resolvePlannerTextureFrame(
    flameLayer.textureLocalPath,
    flameFrame,
  );
  if (
    resolvedFlame.resolvedFrame === null
    || resolvedFlame.resolvedFrame.x !== flameFrame.x
    || resolvedFlame.resolvedFrame.y !== flameFrame.y
    || resolvedFlame.resolvedFrame.width !== flameFrame.width
    || resolvedFlame.resolvedFrame.height !== flameFrame.height
  ) {
    throw new Error(
      `Lit thumbnail flame frame for ${JSON.stringify(catalogItemId)} must keep the source crop ${JSON.stringify(flameFrame)}; received ${JSON.stringify(resolvedFlame)}.`,
    );
  }

  const uniformScale = flameLayer.pixelGeometry.uniformScale ?? 1;
  if (!Number.isFinite(uniformScale) || uniformScale <= 0) {
    throw new Error(
      `Lit thumbnail flame scale for ${JSON.stringify(catalogItemId)} must be a positive finite number; received ${JSON.stringify(flameLayer.pixelGeometry.uniformScale)}.`,
    );
  }

  return {
    ...(shouldLoadThumbnail
      ? {
          backgroundImage: `url(${JSON.stringify(resolvedFlame.resolvedAssetPath)})`,
        }
      : {}),
    backgroundPosition: `-${String(flameFrame.x)}px -${String(flameFrame.y)}px`,
    backgroundRepeat: "no-repeat",
    display: "block",
    height: flameFrame.height,
    imageRendering: "pixelated",
    left: (flameLayer.pixelGeometry.positionX - baseLayer.pixelGeometry.positionX) * bodyScale,
    pointerEvents: "none",
    position: "absolute",
    top: (flameLayer.pixelGeometry.positionY - baseLayer.pixelGeometry.positionY) * bodyScale,
    transform: `scale(${String(uniformScale * bodyScale)})`,
    transformOrigin: "top left",
    width: flameFrame.width,
  };
}

function assertFlameAnchor(
  catalogItemId: string,
  flameLayer: LitBigCraftablePlacementRenderLayer,
): void {
  const pixelGeometry = flameLayer.pixelGeometry;
  if (
    pixelGeometry.anchorX !== 0
    || pixelGeometry.anchorY !== 0
    || pixelGeometry.horizontalScale !== 1
  ) {
    throw new Error(
      `Lit thumbnail flame anchor for ${JSON.stringify(catalogItemId)} must be the top-left at horizontal scale 1; received ${JSON.stringify(pixelGeometry)}.`,
    );
  }
}

function assertFlameLayerCount(
  catalogItemId: string,
  variant: number,
  declaredFlameCount: number,
  renderedFlameCount: number,
): void {
  const expectedFlameCount = variant === 0 ? declaredFlameCount : 0;
  if (renderedFlameCount !== expectedFlameCount) {
    throw new Error(
      `Lit thumbnail for ${JSON.stringify(catalogItemId)} variant ${String(variant)} must draw ${String(expectedFlameCount)} static flame layers; received ${String(renderedFlameCount)}.`,
    );
  }
}

function isStaticFireLayer(
  renderLayer: LitBigCraftablePlacementRenderLayer,
): boolean {
  if (staticFireFrame === undefined) {
    throw new Error("Static fire animation frame 0 is missing.");
  }
  const frame = renderLayer.frame;
  return frame !== null
    && frame.x === staticFireFrame.x
    && frame.y === staticFireFrame.y
    && frame.width === staticFireFrame.width
    && frame.height === staticFireFrame.height;
}

function readLitBigCraftableRenderingMetadata(
  catalogItem: CatalogItem,
): CatalogLitBigCraftableRenderingMetadata {
  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "lit-big-craftable") {
    throw new TypeError(
      `Catalog lit thumbnail requires lit-big-craftable metadata for ${JSON.stringify(catalogItem.id)}; received ${JSON.stringify(renderingMetadata)}.`,
    );
  }
  return renderingMetadata;
}

function readUniformThumbnailScale(
  catalogItemId: string,
  bodyWidth: number,
  bodyHeight: number,
  baseFrame: PlacementRenderFrame,
): number {
  if (
    baseFrame === null
    || baseFrame.width !== lockedLitBodyFrame.width
    || baseFrame.height !== lockedLitBodyFrame.height
  ) {
    throw new Error(
      `Lit thumbnail body frame for ${JSON.stringify(catalogItemId)} must be ${String(lockedLitBodyFrame.width)} by ${String(lockedLitBodyFrame.height)}; received ${JSON.stringify(baseFrame)}.`,
    );
  }

  const scaleX = bodyWidth / baseFrame.width;
  const scaleY = bodyHeight / baseFrame.height;
  if (scaleX !== scaleY) {
    throw new Error(
      `Lit thumbnail body scale for ${JSON.stringify(catalogItemId)} must be uniform; received width ${String(bodyWidth)} and height ${String(bodyHeight)}.`,
    );
  }
  return scaleX;
}

function readThumbnailPixelSize(
  pixelSize: CSSProperties["width"],
  edgeName: "width" | "height",
  catalogItemId: string,
): number {
  if (typeof pixelSize !== "number" || !Number.isFinite(pixelSize) || pixelSize <= 0) {
    throw new TypeError(
      `Lit thumbnail body ${edgeName} for ${JSON.stringify(catalogItemId)} must be a positive finite number; received ${JSON.stringify(pixelSize)}.`,
    );
  }
  return pixelSize;
}

function createLitThumbnailPlacementItem(
  catalogItem: CatalogItem,
  variant: number,
): PlacementItem {
  return {
    bedType: null,
    flipped: false,
    footprint: { height: 1, width: 1 },
    instanceId: 0,
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId: catalogItem.id,
    layer: "item",
    locked: false,
    rotation: 0,
    tintColor: "#ffffff",
    variant,
    x: 0,
    y: 0,
  };
}

function createLitThumbnailBaseFrame(catalogItem: CatalogItem): PlacementRenderFrame {
  if (catalogItem.sprite.kind !== "sprite-index") {
    return null;
  }

  return {
    height: lockedLitBodyFrame.height,
    width: lockedLitBodyFrame.width,
    x: (catalogItem.sprite.index % 8) * lockedLitBodyFrame.width,
    y: Math.floor(catalogItem.sprite.index / 8) * lockedLitBodyFrame.height,
  };
}
