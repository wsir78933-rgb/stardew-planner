import type {
  CatalogFruitTreeRenderingMetadata,
  CatalogItem,
  CatalogSeason,
  CatalogWildTreeRenderingMetadata,
} from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";

const lockedTilePixelSize = 16;
const fruitTreeRowPixelHeight = 80;
const springObjectsTextureLocalPath =
  "/game-assets/1.6.15/sprites/springobjects.png";
const leafyTreeShadowTextureLocalPath =
  "/game-assets/1.6.15/terrain/tree_shadow.png";
const nonleafyTreeShadowTextureLocalPath =
  "/game-assets/1.6.15/terrain/tree_shadow_nonleafy.png";

export type TreePlacementRenderFrame = Readonly<{
  height: number;
  width: number;
  x: number;
  y: number;
}> | null;

export type TreePlacementPixelGeometry = Readonly<{
  anchorX: number;
  anchorY: number;
  horizontalMirrorCenterX?: number;
  horizontalScale: 1 | -1;
  positionX: number;
  positionY: number;
}>;

export type TreePlacementRenderLayer = Readonly<{
  frame: TreePlacementRenderFrame;
  pixelGeometry: TreePlacementPixelGeometry;
  shouldApplySelectionTint: boolean;
  textureLocalPath: string;
}>;

type CreateTreePlacementRenderLayersInput = Readonly<{
  catalogItem: CatalogItem;
  mapId: string;
  placementItem: PlacementItem;
  season: CatalogSeason;
}>;

export function createTreePlacementRenderLayers({
  catalogItem,
  mapId,
  placementItem,
  season,
}: CreateTreePlacementRenderLayersInput): readonly TreePlacementRenderLayer[] | null {
  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind === "wild-tree") {
    return createWildTreePlacementRenderLayers(
      renderingMetadata,
      placementItem,
      season,
    );
  }
  if (renderingMetadata?.kind === "fruit-tree") {
    return createFruitTreePlacementRenderLayers(
      catalogItem,
      renderingMetadata,
      placementItem,
      season,
      mapId === "greenhouse",
    );
  }

  return null;
}

function createWildTreePlacementRenderLayers(
  renderingMetadata: CatalogWildTreeRenderingMetadata,
  placementItem: PlacementItem,
  season: CatalogSeason,
): readonly TreePlacementRenderLayer[] {
  const textureLocalPath = renderingMetadata.seasonalTextureLocalPaths[season];
  if (placementItem.growthStage !== undefined && placementItem.growthStage < 5) {
    const youngTreeFrame = getYoungWildTreeFrame(placementItem.growthStage);
    return [
      {
        frame: youngTreeFrame,
        pixelGeometry: createPlacementMirroredPixelGeometry(
          placementItem,
          placementItem.x * lockedTilePixelSize,
          placementItem.y * lockedTilePixelSize
            + lockedTilePixelSize
            - youngTreeFrame.height,
        ),
        shouldApplySelectionTint: true,
        textureLocalPath,
      },
    ];
  }

  const isWinterStump =
    renderingMetadata.isStumpInWinter && season === "winter";
  const mossFrameOffset =
    placementItem.variant === 1 && season !== "winter" ? 96 : 0;
  const trunkLayer: TreePlacementRenderLayer = {
    frame: { height: 32, width: 16, x: 32 + mossFrameOffset, y: 96 },
    pixelGeometry: createPlacementMirroredPixelGeometry(
      placementItem,
      placementItem.x * lockedTilePixelSize,
      placementItem.y * lockedTilePixelSize - 16,
    ),
    shouldApplySelectionTint: true,
    textureLocalPath,
  };
  if (isWinterStump) return [trunkLayer];

  const shadowTextureLocalPath = renderingMetadata.leafySeasons[season]
    ? leafyTreeShadowTextureLocalPath
    : nonleafyTreeShadowTextureLocalPath;

  return [
    {
      frame: null,
      pixelGeometry: createPlacementMirroredPixelGeometry(
        placementItem,
        placementItem.x * lockedTilePixelSize - 12.75,
        placementItem.y * lockedTilePixelSize - 4,
      ),
      shouldApplySelectionTint: false,
      textureLocalPath: shadowTextureLocalPath,
    },
    trunkLayer,
    {
      frame: { height: 96, width: 48, x: mossFrameOffset, y: 0 },
      pixelGeometry: createPlacementMirroredPixelGeometry(
        placementItem,
        placementItem.x * lockedTilePixelSize - 16,
        placementItem.y * lockedTilePixelSize - 80,
      ),
      shouldApplySelectionTint: true,
      textureLocalPath,
    },
  ];
}

function getYoungWildTreeFrame(growthStage: number): Exclude<
  TreePlacementRenderFrame,
  null
> {
  if (growthStage === 0) {
    return { height: 16, width: 16, x: 32, y: 128 };
  }
  if (growthStage === 1) {
    return { height: 16, width: 16, x: 0, y: 128 };
  }
  if (growthStage === 2) {
    return { height: 16, width: 16, x: 16, y: 128 };
  }
  return { height: 32, width: 16, x: 0, y: 96 };
}

function createFruitTreePlacementRenderLayers(
  catalogItem: CatalogItem,
  renderingMetadata: CatalogFruitTreeRenderingMetadata,
  placementItem: PlacementItem,
  season: CatalogSeason,
  isGreenhouse: boolean,
): readonly TreePlacementRenderLayer[] {
  const textureRow = getFruitTreeTextureRow(catalogItem);
  if (placementItem.growthStage !== undefined && placementItem.growthStage < 4) {
    return [
      {
        frame: {
          height: 80,
          width: 48,
          x: placementItem.growthStage * 48,
          y: textureRow * fruitTreeRowPixelHeight,
        },
        pixelGeometry: {
          anchorX: placementItem.flipped ? 1 : 0.5,
          anchorY: 1,
          horizontalScale: placementItem.flipped ? -1 : 1,
          positionX: placementItem.x * lockedTilePixelSize + 8,
          positionY: placementItem.y * lockedTilePixelSize + 16,
        },
        shouldApplySelectionTint: true,
        textureLocalPath: catalogItem.textureLocalPath,
      },
    ];
  }

  const appearanceSeason = isGreenhouse ? "summer" : season;
  const seasonalFrameOffset = getFruitTreeSeasonIndex(appearanceSeason);
  const seasonalFrameX = (12 + seasonalFrameOffset * 3) * 16;
  const treeLayers: TreePlacementRenderLayer[] = [
    createMatureFruitTreeLayer(
      placementItem,
      catalogItem.textureLocalPath,
      { height: 16, width: 48, x: seasonalFrameX, y: textureRow * 80 + 64 },
      placementItem.x * 16 - 16,
      placementItem.y * 16,
    ),
    createMatureFruitTreeLayer(
      placementItem,
      catalogItem.textureLocalPath,
      { height: 32, width: 48, x: 384, y: textureRow * 80 + 48 },
      placementItem.x * 16 - 16,
      placementItem.y * 16 - 16,
    ),
    createMatureFruitTreeLayer(
      placementItem,
      catalogItem.textureLocalPath,
      { height: 64, width: 48, x: seasonalFrameX, y: textureRow * 80 },
      placementItem.x * 16 - 16,
      placementItem.y * 16 - 64,
    ),
  ];
  const canShowFruit =
    isGreenhouse || renderingMetadata.fruitSeasons.includes(season);
  if (placementItem.variant !== 1 || !canShowFruit) return treeLayers;

  return [
    ...treeLayers,
    ...createFruitLayers(renderingMetadata, placementItem),
  ];
}

function createMatureFruitTreeLayer(
  placementItem: PlacementItem,
  textureLocalPath: string,
  frame: Exclude<TreePlacementRenderFrame, null>,
  positionX: number,
  positionY: number,
): TreePlacementRenderLayer {
  return {
    frame,
    pixelGeometry: createPlacementMirroredPixelGeometry(
      placementItem,
      positionX,
      positionY,
    ),
    shouldApplySelectionTint: true,
    textureLocalPath,
  };
}

function createFruitLayers(
  renderingMetadata: CatalogFruitTreeRenderingMetadata,
  placementItem: PlacementItem,
): readonly TreePlacementRenderLayer[] {
  const treeX = placementItem.x;
  const firstX = (treeX * 200) % 64 / 2;
  const firstY = treeX % 64 / 3;
  const secondY = (treeX * 232) % 64 / 3;
  const thirdOffset = (treeX * 200) % 64 / 3;
  const fruitFrame = {
    height: 16,
    width: 16,
    x: renderingMetadata.fruitSprite.x,
    y: renderingMetadata.fruitSprite.y,
  };

  return [
    createFruitLayer(
      fruitFrame,
      (treeX * 64 - 64 + firstX) / 4,
      (placementItem.y * 64 - 192 - firstY) / 4,
      false,
    ),
    createFruitLayer(
      fruitFrame,
      (treeX * 64 + 32) / 4,
      (placementItem.y * 64 - 256 + secondY) / 4,
      false,
    ),
    createFruitLayer(
      fruitFrame,
      (treeX * 64 + thirdOffset) / 4,
      (placementItem.y * 64 - 160 + thirdOffset) / 4,
      true,
    ),
  ];
}

function createFruitLayer(
  frame: Exclude<TreePlacementRenderFrame, null>,
  positionX: number,
  positionY: number,
  isIntrinsicallyFlipped: boolean,
): TreePlacementRenderLayer {
  return {
    frame,
    pixelGeometry: {
      anchorX: isIntrinsicallyFlipped ? 1 : 0,
      anchorY: 0,
      horizontalScale: isIntrinsicallyFlipped ? -1 : 1,
      positionX,
      positionY,
    },
    shouldApplySelectionTint: true,
    textureLocalPath: springObjectsTextureLocalPath,
  };
}

function createPlacementMirroredPixelGeometry(
  placementItem: PlacementItem,
  positionX: number,
  positionY: number,
): TreePlacementPixelGeometry {
  if (!placementItem.flipped) {
    return {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX,
      positionY,
    };
  }

  return {
    anchorX: 1,
    anchorY: 0,
    horizontalMirrorCenterX:
      placementItem.x * lockedTilePixelSize + lockedTilePixelSize / 2,
    horizontalScale: -1,
    positionX,
    positionY,
  };
}

function getFruitTreeTextureRow(catalogItem: CatalogItem): number {
  if (
    catalogItem.sprite.kind !== "source-rect"
    || !Number.isSafeInteger(catalogItem.sprite.y / fruitTreeRowPixelHeight)
  ) {
    throw new TypeError(
      `Fruit-tree catalog item ${JSON.stringify(catalogItem.id)} sprite y must be a multiple of ${String(fruitTreeRowPixelHeight)}; received ${JSON.stringify(catalogItem.sprite)}.`,
    );
  }

  return catalogItem.sprite.y / fruitTreeRowPixelHeight;
}

function getFruitTreeSeasonIndex(season: CatalogSeason): number {
  if (season === "summer") return 1;
  if (season === "fall") return 2;
  if (season === "winter") return 3;
  return 0;
}
