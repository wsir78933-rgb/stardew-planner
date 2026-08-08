import type { CatalogItem, CatalogSeason, CatalogSourceRect } from "../catalog";
import { getSeasonalPlaceableFrame } from "../catalog";
import type { PlacementItem } from "../placement/placement-snapshot";

type GrassPlacementPixelGeometry = Readonly<{
  anchorX: 0.5;
  anchorY: 0.875;
  horizontalScale: 1 | -1;
  positionX: number;
  positionY: number;
}>;

export type GrassPlacementRenderLayer = Readonly<{
  frame: Readonly<{
    height: number;
    width: number;
    x: number;
    y: number;
  }>;
  layerId: string;
  pixelGeometry: GrassPlacementPixelGeometry;
  shouldApplySelectionTint: true;
  textureLocalPath: string;
  zIndex: number;
}>;

const grassCatalogItemIds = new Set(["grass_1", "grass_7"]);
const deterministicSeedSalt = 25_214_903_917;
const positiveIntegerMask = 0x7fff_ffff;

export function createGrassPlacementRenderLayers(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  season: CatalogSeason,
): readonly GrassPlacementRenderLayer[] | null {
  if (!grassCatalogItemIds.has(catalogItem.id)) {
    return null;
  }
  if (!placementItem.isGrass) {
    throw new Error(
      `Grass placement ${JSON.stringify(catalogItem.id)} must have isGrass=true; received false.`,
    );
  }

  const seasonalFrame = getSeasonalPlaceableFrame(catalogItem, season);
  const renderingMetadata = catalogItem.renderingMetadata;
  if (
    seasonalFrame === null ||
    renderingMetadata?.kind !== "seasonal-placeable" ||
    renderingMetadata.composition !== "grass-clumps"
  ) {
    throw new Error(
      `Grass placement ${JSON.stringify(catalogItem.id)} requires grass-clumps seasonal rendering metadata.`,
    );
  }

  const deterministicSeed = (
    (placementItem.x * 7 + placementItem.y * 11 + placementItem.x * placementItem.y * 31)
    ^ deterministicSeedSalt
  ) >>> 0;

  return Array.from({ length: 4 }, (_, clumpIndex) =>
    createGrassClumpRenderLayer(
      catalogItem,
      placementItem,
      seasonalFrame,
      deterministicSeed,
      clumpIndex,
    )
  );
}

function createGrassClumpRenderLayer(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  seasonalFrame: CatalogSourceRect,
  deterministicSeed: number,
  clumpIndex: number,
): GrassPlacementRenderLayer {
  const frameSeed = (deterministicSeed + clumpIndex * 3_571) & positiveIntegerMask;
  const xSeed = (deterministicSeed + clumpIndex * 7_127 + 1) & positiveIntegerMask;
  const ySeed = (deterministicSeed + clumpIndex * 4_519 + 2) & positiveIntegerMask;
  const frameColumn = frameSeed % 3;
  const jitterX = xSeed % 5 - 2;
  const jitterY = ySeed % 5 - 2;
  const isHorizontallyFlipped =
    ((deterministicSeed + clumpIndex * 9_311) & 1) === 0;
  const positionX = placementItem.x * 16
    + (clumpIndex % 2) * 8
    + jitterX
    + 6.5;
  const positionY = placementItem.y * 16
    + Math.floor(clumpIndex / 2) * 8
    + jitterY
    + 10;

  return {
    frame: {
      x: frameColumn * 15,
      y: seasonalFrame.y,
      width: 15,
      height: 20,
    },
    layerId: `GrassClump_${String(clumpIndex)}`,
    pixelGeometry: {
      anchorX: 0.5,
      anchorY: 0.875,
      horizontalScale: isHorizontallyFlipped ? -1 : 1,
      positionX,
      positionY,
    },
    shouldApplySelectionTint: true,
    textureLocalPath: catalogItem.textureLocalPath,
    zIndex: positionY / 16 * 2 - 1 + 0.01,
  };
}
