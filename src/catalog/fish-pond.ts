import type {
  CatalogBuildingMultilayerLayer,
  CatalogBuildingMultilayerRenderingMetadata,
  CatalogPresentationCapabilities,
  CatalogSourceRect,
} from "./catalog-types";

const fishPondBuildingId = "Fish Pond";
const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";

export const fishPondWaterColors = Object.freeze([
  { label: "Default", value: 3_964_566 },
  { label: "Lava Eel", value: 16_391_710 },
  { label: "Void Salmon", value: 7_869_550 },
  { label: "Slimejack", value: 3_997_500 },
  { label: "Super Cucumber", value: 9_856_200 },
  { label: "Glacier Fish", value: 6_615_260 },
  { label: "Ms. Angler", value: 16_742_600 },
  { label: "Angler", value: 16_742_400 },
  { label: "Mutant Carp", value: 3_333_220 },
  { label: "Crimson Fish", value: 15_091_310 },
  { label: "Legend", value: 2_659_890 },
  { label: "Legendary", value: 9_843_410 },
]);

const fishPondPresentationCapabilities: CatalogPresentationCapabilities = {
  canFlip: false,
  rotation: null,
  variantCycle: { count: 4, family: "generic" },
  visibleVariants: ["Net 1", "Net 2", "Net 3", "None"].map(
    (label, variant) => ({
      label,
      renderDescriptor: { kind: "variant-index", variant },
      value: variant,
    }),
  ),
};

export function createFishPondCatalogProperties(
  buildingId: string,
  buildingTextureLocalPath: string,
): Readonly<{
  presentationCapabilities?: CatalogPresentationCapabilities;
  renderingMetadata?: CatalogBuildingMultilayerRenderingMetadata;
  sprite?: CatalogSourceRect;
}> {
  if (buildingId !== fishPondBuildingId) {
    return {};
  }

  return {
    presentationCapabilities: fishPondPresentationCapabilities,
    renderingMetadata: {
      buildingId: fishPondBuildingId,
      kind: "building-multilayer",
      layers: createFishPondLayers(buildingTextureLocalPath),
      sortTileOffset: 4.5,
      waterColors: fishPondWaterColors,
    },
    sprite: createSourceRect(0, 0, 80, 80),
  };
}

function createFishPondLayers(
  buildingTextureLocalPath: string,
): readonly CatalogBuildingMultilayerLayer[] {
  return [
    {
      frame: createSourceRect(0, 80, 80, 80),
      id: "FishPondWater",
      offsetX: 0,
      offsetY: 0,
      textureLocalPath: buildingTextureLocalPath,
      tint: { kind: "water-color-or-fixed", fixedColor: 3_964_566 },
    },
    ...createFishPondWaterTileLayers(),
    ...createFishPondShadowLayers(),
    {
      frame: createSourceRect(0, 0, 80, 80),
      id: "FishPondBase",
      offsetX: 0,
      offsetY: 0,
      textureLocalPath: buildingTextureLocalPath,
    },
    {
      frame: createSourceRect(16, 160, 48, 7),
      hideWhenWaterColorDefined: true,
      id: "FishPondBubbles",
      offsetX: 16,
      offsetY: 11,
      textureLocalPath: buildingTextureLocalPath,
    },
    {
      frame: createSourceRect(80, 0, 80, 48),
      id: "FishPondNetting",
      offsetX: 0,
      offsetY: -32,
      textureLocalPath: buildingTextureLocalPath,
      variantFrames: [
        createSourceRect(80, 0, 80, 48),
        createSourceRect(80, 48, 80, 48),
        createSourceRect(80, 96, 80, 48),
        null,
      ],
    },
  ];
}

function createFishPondWaterTileLayers(): readonly CatalogBuildingMultilayerLayer[] {
  return Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 4 }, (_, columnIndex) => ({
      frame: createSourceRect(
        0,
        2064 + ((rowIndex + columnIndex) % 2 === 0 ? 0 : 128),
        64,
        rowIndex === 4 ? 32 : 64,
      ),
      id: `FishPondWaterTile_${String(rowIndex)}_${String(columnIndex)}`,
      offsetX: columnIndex * 16 + 8,
      offsetY: rowIndex * 16 + 8,
      opacity: 0.5,
      scale: 0.25,
      textureLocalPath: cursorTextureLocalPath,
      tint: {
        kind: "water-color-or-season" as const,
        seasonalColors: {
          spring: 7_915_775,
          summer: 3_993_855,
          fall: 16_745_160,
          winter: 8_540_415,
        },
      },
    })),
  ).flat();
}

function createFishPondShadowLayers(): readonly CatalogBuildingMultilayerLayer[] {
  return Array.from({ length: 5 }, (_, columnIndex) => ({
    frame: createSourceRect(
      columnIndex === 0 ? 656 : columnIndex === 4 ? 688 : 672,
      394,
      16,
      16,
    ),
    id: columnIndex === 0
      ? "Shadow_left"
      : columnIndex === 4
        ? "Shadow_right"
        : `Shadow_mid_${String(columnIndex)}`,
    offsetX: columnIndex * 16,
    offsetY: 80,
    textureLocalPath: cursorTextureLocalPath,
  }));
}

function createSourceRect(
  x: number,
  y: number,
  width: number,
  height: number,
): CatalogSourceRect {
  return { kind: "source-rect", x, y, width, height };
}
