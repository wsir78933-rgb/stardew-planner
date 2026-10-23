import type { CatalogItem } from "../catalog";
import type { AnimationCatalog, AnimationClothingDefinition } from "../animations/animation-catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderEntry,
  PlacementRenderFrame,
} from "./placement-rendering";

const placementTilePixelSize = 16;
const prismaticDurationMilliseconds = 1500;
const prismaticColors = [
  [255, 0, 0],
  [255, 120, 0],
  [255, 217, 0],
  [0, 255, 0],
  [0, 255, 255],
  [238, 130, 238],
] as const;
const mannequinBodyFrameWidth = 16;
const mannequinBodyFrameHeight = 32;
const mannequinBodyAtlasWidth = 96;
const shirtAtlasWidth = 128;
const pantsSpriteStride = 192;
const pantsSpriteRowStride = 688;

type PlacementFurnitureAnimationResult = Readonly<{
  baseFrame?: Exclude<PlacementRenderFrame, null>;
  baseTextureLocalPath?: string;
  basePixelGeometry?: PlacementPixelGeometry;
  overlays: readonly PlacementRenderEntry[];
}>;

type OverlaySpriteOptions = Readonly<{
  animation?: PlacementRenderEntry["animation"];
  frame: Exclude<PlacementRenderFrame, null>;
  layerId: string;
  opacity?: number;
  positionX: number;
  positionY: number;
  horizontalScale?: 1 | -1;
  tintColor?: string;
  textureLocalPath: string;
}>;

export function createPlacementFurnitureAnimationEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): PlacementFurnitureAnimationResult {
  const tankEntries = createAquariumTankEntries(catalogItem, placementItem, baseRenderEntry, animationCatalog);
  const mannequinResult = createMannequinClothingEntries(catalogItem, placementItem, baseRenderEntry, animationCatalog);
  return {
    ...mannequinResult,
    overlays: [...tankEntries, ...mannequinResult.overlays],
  };
}

function createAquariumTankEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const fishControl = animationCatalog.controlsByCatalogItemId[catalogItem.id]
    ?.find((control) => control.kind === "multiSelect" && control.key === "tankFish");
  if (fishControl === undefined) {
    if (placementItem.animationOptions?.tankFish === undefined) {
      return [];
    }
    throw new TypeError(`Furniture item ${JSON.stringify(catalogItem.id)} has tankFish selections but no aquarium control definition.`);
  }
  const tankFish = placementItem.animationOptions?.tankFish ?? [];
  const allowedFishIds = new Set(fishControl.choices.map((choice) => choice.id));
  for (const fishId of tankFish) {
    if (!allowedFishIds.has(fishId)) {
      throw new TypeError(`Furniture item ${JSON.stringify(catalogItem.id)} has unsupported tankFish ID ${JSON.stringify(fishId)}.`);
    }
  }
  const baseFrame = requireBaseFrame(catalogItem, placementItem, baseRenderEntry);
  const basePosition = getFurnitureTopLeft(placementItem, baseRenderEntry, baseFrame);
  const interior = getAquariumInterior(catalogItem.id, baseFrame);
  const selectedFish = tankFish.map((fishId) => {
    const fishDefinition = animationCatalog.aquariumFishById[fishId];
    if (fishDefinition === undefined) {
      throw new TypeError(`Furniture item ${JSON.stringify(catalogItem.id)} has unknown tankFish ID ${JSON.stringify(fishId)}.`);
    }
    return fishDefinition;
  });
  const fishEntries = selectedFish.flatMap((fishDefinition, fishIndex) =>
    createAquariumFishEntries(
      catalogItem,
      placementItem,
      baseRenderEntry,
      fishDefinition,
      fishIndex,
      selectedFish.length,
      basePosition.positionX + interior.x,
      basePosition.positionY + interior.y,
      interior.width,
      interior.height,
      animationCatalog,
    ),
  );
  const bubbleEntries = createAquariumBubbleEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
    selectedFish.length,
    basePosition.positionX + interior.x,
    basePosition.positionY + interior.y,
    interior.width,
    interior.height,
    animationCatalog,
  );
  const glassEntry = createAquariumGlassEntry(catalogItem, placementItem, baseRenderEntry, baseFrame, basePosition);
  return [...fishEntries, ...bubbleEntries, glassEntry];
}

function createAquariumFishEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  fishDefinition: AnimationCatalog["aquariumFishById"][string],
  fishIndex: number,
  selectedFishCount: number,
  interiorX: number,
  interiorY: number,
  interiorWidth: number,
  interiorHeight: number,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const atlas = animationCatalog.aquariumFishAtlas;
  const segmentWidth = atlas.segmentWidthBySimulationType[fishDefinition.simType];
  const segmentCount = Math.floor(atlas.frameWidth / segmentWidth);
  const baseX = getBoundedFishCoordinate(
    fishIndex,
    selectedFishCount,
    interiorX,
    interiorWidth,
    segmentCount * segmentWidth * atlas.scaleFactor,
  );
  const baseY = getBoundedFishCoordinate(
    fishIndex + 1,
    selectedFishCount,
    interiorY,
    interiorHeight,
    atlas.frameHeight * atlas.scaleFactor,
  );
  const frameSequence = fishDefinition.idleAnimation?.length === 0 || fishDefinition.idleAnimation === null
    ? [fishDefinition.idleFrame]
    : fishDefinition.idleAnimation;
  if (frameSequence === null || frameSequence.length === 0) {
    throw new Error(`Aquarium fish ${JSON.stringify(fishDefinition.id)} has no idle frame sequence.`);
  }
  const stableFrameSequence = frameSequence;
  const facingLeft = fishIndex % 2 === 1;
  return Array.from({ length: segmentCount }, (_, segmentIndex) => {
    const firstFrameIndex = stableFrameSequence[0];
    if (firstFrameIndex === undefined) {
      throw new Error(`Aquarium fish ${JSON.stringify(fishDefinition.id)} has an empty frame sequence.`);
    }
    const firstFrame = getAquariumFishSegmentFrame(firstFrameIndex, segmentIndex, segmentWidth, atlas);
    const segmentX = baseX + segmentIndex * segmentWidth * atlas.scaleFactor;
    const facingScale = facingLeft ? -atlas.scaleFactor : atlas.scaleFactor;
    const phaseOffset = fishIndex * 1.7 + segmentIndex * 0.2;
    return createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
      animation: {
        kind: "sprite-motion",
        frames: stableFrameSequence.map((frameIndex) =>
          getAquariumFishSegmentFrame(frameIndex, segmentIndex, segmentWidth, atlas),
        ),
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds, catalogItem.id);
          const sequenceIndex = Math.floor(currentTimeMilliseconds / 125) % stableFrameSequence.length;
          const frameIndex = stableFrameSequence[sequenceIndex];
          if (frameIndex === undefined) {
            throw new Error(`Aquarium fish ${JSON.stringify(fishDefinition.id)} frame sequence lost index ${String(sequenceIndex)}.`);
          }
          const wiggle = Math.sin(segmentIndex * 20 + currentTimeMilliseconds / 40 + phaseOffset) * (segmentWidth < 24 ? 0.7 : 0.2);
          const bob = fishDefinition.simType === "ground" || fishDefinition.simType === "crawl" || fishDefinition.simType === "static" || fishDefinition.simType === "eel"
            ? 0
            : Math.sin(currentTimeMilliseconds / 800 + fishIndex) * 1.5;
          const xTravel = fishDefinition.simType === "static" || fishDefinition.simType === "ground" || fishDefinition.simType === "crawl"
            ? 0
            : Math.sin(currentTimeMilliseconds / 1700 + phaseOffset) * Math.max(0, interiorWidth / 2 - segmentCount * segmentWidth * atlas.scaleFactor / 2 - 1);
          const yTravel = fishDefinition.simType === "static" || fishDefinition.simType === "ground" || fishDefinition.simType === "crawl"
            ? 0
            : Math.sin(currentTimeMilliseconds / 2300 + phaseOffset) * Math.max(0, interiorHeight / 2 - atlas.frameHeight * atlas.scaleFactor / 2 - 1);
          return {
            frameIndex: sequenceIndex,
            positionX: segmentX + xTravel,
            positionY: baseY + yTravel + bob + wiggle,
            scaleX: facingScale,
            scaleY: atlas.scaleFactor,
            rotationRadians: fishDefinition.simType === "float" || fishDefinition.simType === "cephalopod"
              ? Math.max(-0.5, Math.min(0.5, Math.sin(currentTimeMilliseconds / 1100 + phaseOffset) * 0.25))
              : 0,
          };
        },
      },
      frame: firstFrame,
      layerId: `tank-fish-${String(fishIndex)}-${String(segmentIndex)}`,
      opacity: 1,
      positionX: segmentX,
      positionY: baseY,
      horizontalScale: facingLeft ? -1 : 1,
      textureLocalPath: atlas.textureLocalPath,
    });
  });
}

function createAquariumBubbleEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  selectedFishCount: number,
  interiorX: number,
  interiorY: number,
  interiorWidth: number,
  interiorHeight: number,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (selectedFishCount === 0) {
    return [];
  }
  const atlas = animationCatalog.aquariumFishAtlas;
  const bubbleFrame = { x: 0, y: 240, width: 16, height: 16 };
  const bubbleCount = Math.min(3, selectedFishCount);
  return Array.from({ length: bubbleCount }, (_, bubbleIndex) => {
    const startX = interiorX + Math.max(1, interiorWidth * (bubbleIndex + 1) / (bubbleCount + 1));
    const startY = interiorY + interiorHeight - 1;
    const cycleMilliseconds = 1800 + bubbleIndex * 350;
    return createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
      animation: {
        kind: "sprite-motion",
        frames: [bubbleFrame],
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds, catalogItem.id);
          const phase = modulo(currentTimeMilliseconds + bubbleIndex * 450, cycleMilliseconds);
          const progress = phase / cycleMilliseconds;
          return {
            positionX: startX + Math.sin(phase / 370 + bubbleIndex) * Math.min(2, interiorWidth / 8),
            positionY: startY - progress * Math.max(0, interiorHeight - bubbleFrame.height * 0.25),
            opacity: Math.sin(Math.PI * progress) * 0.75,
            scaleX: 0.25 + progress * 0.35,
            scaleY: 0.25 + progress * 0.35,
            visible: progress < 0.94,
          };
        },
      },
      frame: bubbleFrame,
      layerId: `tank-bubble-${String(bubbleIndex)}`,
      opacity: 0.75,
      positionX: startX,
      positionY: startY,
      textureLocalPath: atlas.textureLocalPath,
    });
  });
}

function createAquariumGlassEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  baseFrame: Exclude<PlacementRenderFrame, null>,
  basePosition: Readonly<{ positionX: number; positionY: number }>,
): PlacementRenderEntry {
  return createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
    frame: { ...baseFrame, x: baseFrame.x + baseFrame.width },
    layerId: "tank-glass",
    positionX: basePosition.positionX,
    positionY: basePosition.positionY,
    textureLocalPath: catalogItem.textureLocalPath,
  });
}

function getAquariumInterior(
  catalogItemId: string,
  baseFrame: Exclude<PlacementRenderFrame, null>,
): Readonly<{ x: number; y: number; width: number; height: number }> {
  const x = catalogItemId === "furniture_CCFishTank" ? 7 : 1;
  const width = catalogItemId === "furniture_CCFishTank"
    ? baseFrame.width - 21
    : baseFrame.width - 2;
  const height = baseFrame.height - 23;
  if (width <= 0 || height <= 0) {
    throw new RangeError(`Aquarium tank ${JSON.stringify(catalogItemId)} base frame ${String(baseFrame.width)}x${String(baseFrame.height)} leaves no fish interior.`);
  }
  return { x, y: 16, width, height };
}

function getAquariumFishSegmentFrame(
  aquariumFishFrameIndex: number,
  segmentIndex: number,
  segmentWidth: number,
  atlas: AnimationCatalog["aquariumFishAtlas"],
): Exclude<PlacementRenderFrame, null> {
  if (!Number.isSafeInteger(aquariumFishFrameIndex) || aquariumFishFrameIndex < 0) {
    throw new RangeError(`Aquarium fish frame index must be a non-negative integer; received ${String(aquariumFishFrameIndex)}.`);
  }
  const segmentCount = atlas.frameWidth / segmentWidth;
  if (!Number.isSafeInteger(segmentIndex) || segmentIndex < 0 || segmentIndex >= segmentCount) {
    throw new RangeError(`Aquarium fish segment index must be below ${String(segmentCount)}; received ${String(segmentIndex)}.`);
  }
  const sourceColumn = aquariumFishFrameIndex % atlas.columns;
  const sourceRow = Math.floor(aquariumFishFrameIndex / atlas.columns);
  return {
    x: sourceColumn * atlas.frameWidth + segmentIndex * segmentWidth,
    y: sourceRow * atlas.rowStride,
    width: segmentWidth,
    height: atlas.frameHeight,
  };
}

function createMannequinClothingEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): PlacementFurnitureAnimationResult {
  const mannequin = animationCatalog.mannequinsById[catalogItem.id];
  if (mannequin === undefined) {
    if (placementItem.animationOptions?.hatId !== undefined || placementItem.animationOptions?.shirtId !== undefined || placementItem.animationOptions?.pantsId !== undefined) {
      throw new TypeError(`Furniture item ${JSON.stringify(catalogItem.id)} has clothing selections but is not a supported mannequin.`);
    }
    return { overlays: [] };
  }
  const direction = getMannequinDirection(placementItem.animationOptions?.spriteState);
  const bodyFrame = getMannequinBodyFrame(direction);
  const baseX = placementItem.x * placementTilePixelSize;
  const baseY = placementItem.y * placementTilePixelSize + (mannequin.isMale ? -20 : -21);
  const pantsEntries = createMannequinPantsEntry(catalogItem, placementItem, baseRenderEntry, animationCatalog, mannequin.isMale, direction, baseX, baseY);
  const shirtEntries = createMannequinShirtEntries(catalogItem, placementItem, baseRenderEntry, animationCatalog, direction, baseX, baseY, mannequin.isMale);
  const hatEntries = createMannequinHatEntry(catalogItem, placementItem, baseRenderEntry, animationCatalog, direction, baseX, baseY, mannequin.isMale);
  const armsEntry = createMannequinArmsEntry(catalogItem, placementItem, baseRenderEntry, mannequin.textureLocalPath, direction, bodyFrame, baseX, baseY);
  const overlays = direction === 2
    ? [...pantsEntries, ...shirtEntries, armsEntry, ...hatEntries]
    : [...pantsEntries, ...shirtEntries, ...hatEntries, armsEntry];
  return {
    baseFrame: bodyFrame,
    baseTextureLocalPath: mannequin.textureLocalPath,
    basePixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: direction === 3 ? -1 : 1,
      positionX: baseX,
      positionY: baseY,
    },
    overlays,
  };
}

function createMannequinArmsEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  textureLocalPath: string,
  direction: 0 | 1 | 2 | 3,
  baseFrame: Exclude<PlacementRenderFrame, null>,
  baseX: number,
  baseY: number,
): PlacementRenderEntry {
  return createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
    frame: { ...baseFrame, x: baseFrame.x + mannequinBodyAtlasWidth },
    layerId: "mannequin-arms",
    positionX: baseX,
    positionY: baseY,
    horizontalScale: direction === 3 ? -1 : 1,
    textureLocalPath,
  });
}

function createMannequinPantsEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
  isMale: boolean,
  direction: 0 | 1 | 2 | 3,
  baseX: number,
  baseY: number,
): readonly PlacementRenderEntry[] {
  const pantsId = placementItem.animationOptions?.pantsId;
  if (pantsId === undefined) {
    return [];
  }
  const clothing = requireClothingDefinition(animationCatalog, "pants", pantsId, catalogItem.id);
  const bodyFrame = getMannequinBodyFrame(direction);
  const frame = {
    x: bodyFrame.x + (clothing.spriteIndex % 10) * pantsSpriteStride + (isMale ? 0 : 96),
    y: bodyFrame.y + Math.floor(clothing.spriteIndex / 10) * pantsSpriteRowStride,
    width: mannequinBodyFrameWidth,
    height: mannequinBodyFrameHeight,
  };
  return [createClothingEntry(catalogItem, placementItem, baseRenderEntry, clothing, frame, "mannequin-pants", baseX, baseY, false, direction === 3 ? -1 : 1)];
}

function createMannequinShirtEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
  direction: 0 | 1 | 2 | 3,
  baseX: number,
  baseY: number,
  isMale: boolean,
): readonly PlacementRenderEntry[] {
  const shirtId = placementItem.animationOptions?.shirtId;
  if (shirtId === undefined) {
    return [];
  }
  const clothing = requireClothingDefinition(animationCatalog, "shirt", shirtId, catalogItem.id);
  const shirtSource = getShirtFrame(clothing.spriteIndex, direction);
  const verticalOffset = direction === 0 ? 56 : 60;
  const positionX = baseX + 4;
  const positionY = baseY + (verticalOffset + (isMale ? 0 : 4)) / 4;
  const shirtBaseFrame = { ...shirtSource, width: 8, height: 8 };
  const shirtDyeFrame = { ...shirtBaseFrame, x: shirtBaseFrame.x + shirtAtlasWidth };
  const tintColor = getClothingTintColor(clothing);
  return [
    createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
      frame: shirtBaseFrame,
      layerId: "mannequin-shirt",
      positionX,
      positionY,
      textureLocalPath: clothing.dyeTextureLocalPath ?? clothing.textureLocalPath,
    }),
    createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
      animation: clothing.isPrismatic ? createPrismaticTintAnimation(shirtDyeFrame) : undefined,
      frame: shirtDyeFrame,
      layerId: "mannequin-shirt-dye",
      positionX,
      positionY,
      tintColor: clothing.isPrismatic ? getPrismaticTintColor(0) : tintColor,
      textureLocalPath: clothing.textureLocalPath,
    }),
  ];
}

function createMannequinHatEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
  direction: 0 | 1 | 2 | 3,
  baseX: number,
  baseY: number,
  isMale: boolean,
): readonly PlacementRenderEntry[] {
  const hatId = placementItem.animationOptions?.hatId;
  if (hatId === undefined) {
    return [];
  }
  const clothing = requireClothingDefinition(animationCatalog, "hat", hatId, catalogItem.id);
  const frame = getHatFrame(clothing.spriteIndex, direction);
  const bodyFrameIndex = getMannequinDirectionFrame(direction);
  const fy = bodyFrameIndex === 0 || bodyFrameIndex === 6 ? 1 : 0;
  const flip = direction === 3;
  const positionX = baseX + (-8 + (flip ? -1 : 1) * fy * 4) / 4;
  const positionY = baseY + (-16 + fy * 4 + 4 + (isMale ? 0 : 4)) / 4;
  return [createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
    animation: clothing.isPrismatic ? createPrismaticTintAnimation(frame) : undefined,
    frame,
    layerId: "mannequin-hat",
    positionX,
    positionY,
    tintColor: clothing.isPrismatic ? getPrismaticTintColor(0) : undefined,
    textureLocalPath: clothing.textureLocalPath,
  })];
}

function createClothingEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  clothing: AnimationClothingDefinition,
  frame: Exclude<PlacementRenderFrame, null>,
  layerId: string,
  baseX: number,
  baseY: number,
  isPrismatic: boolean,
  horizontalScale: 1 | -1 = 1,
): PlacementRenderEntry {
  return createFurnitureOverlayEntry(catalogItem, placementItem, baseRenderEntry, {
    animation: isPrismatic || clothing.isPrismatic ? createPrismaticTintAnimation(frame) : undefined,
    frame,
    layerId,
    positionX: baseX,
    positionY: baseY,
    horizontalScale,
    tintColor: clothing.isPrismatic ? getPrismaticTintColor(0) : getClothingTintColor(clothing),
    textureLocalPath: clothing.textureLocalPath,
  });
}

function createPrismaticTintAnimation(
  frame: Exclude<PlacementRenderFrame, null>,
): NonNullable<PlacementRenderEntry["animation"]> {
  return {
    kind: "sprite-motion",
    frames: [frame],
    sample: (currentTimeMilliseconds) => ({
      tintColor: getPrismaticTintColor(currentTimeMilliseconds),
    }),
  };
}

function getPrismaticTintColor(currentTimeMilliseconds: number): string {
  assertAnimationTime(currentTimeMilliseconds, "prismatic clothing");
  const colorPosition = currentTimeMilliseconds / prismaticDurationMilliseconds;
  const colorIndex = Math.floor(colorPosition) % prismaticColors.length;
  const nextColorIndex = (colorIndex + 1) % prismaticColors.length;
  const progress = colorPosition % 1;
  const color = prismaticColors[colorIndex];
  const nextColor = prismaticColors[nextColorIndex];
  if (color === undefined || nextColor === undefined) {
    throw new Error(`Prismatic clothing color table is missing color index ${String(colorIndex)}.`);
  }
  const channelHex = color.map((value, channelIndex) => {
    const nextValue = nextColor[channelIndex];
    if (nextValue === undefined) {
      throw new Error(`Prismatic clothing color ${String(nextColorIndex)} is missing channel ${String(channelIndex)}.`);
    }
    return Math.max(0, Math.min(255, Math.floor(value + progress * (nextValue - value))))
      .toString(16)
      .padStart(2, "0");
  }).join("");
  return `#${channelHex}`;
}

function createFurnitureOverlayEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  options: OverlaySpriteOptions,
): PlacementRenderEntry {
  return {
    ...(options.animation === undefined ? {} : { animation: options.animation }),
    catalogItem,
    effectiveFootprint: placementItem.footprint,
    frame: options.frame,
    key: `item:${String(placementItem.instanceId)}`,
    layerId: options.layerId,
    ...(options.opacity === undefined ? {} : { opacity: options.opacity }),
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: options.horizontalScale ?? 1,
      positionX: options.positionX,
      positionY: options.positionY,
      ...(options.layerId.startsWith("tank-fish-") ? { uniformScale: 0.75 } : {}),
    },
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: false,
    textureLocalPath: options.textureLocalPath,
    tileX: placementItem.x,
    tileY: placementItem.y,
    ...(options.tintColor === undefined ? {} : { tintColor: options.tintColor }),
    zIndex: baseRenderEntry.zIndex ?? getItemFallbackZIndex(placementItem),
  };
}

function requireBaseFrame(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
): Exclude<PlacementRenderFrame, null> {
  if (baseRenderEntry.frame === null) {
    throw new Error(`Furniture animation for ${JSON.stringify(catalogItem.id)} instanceId ${String(placementItem.instanceId)} requires a non-empty base frame.`);
  }
  if (baseRenderEntry.frame.width <= 0 || baseRenderEntry.frame.height <= 0) {
    throw new RangeError(`Furniture animation for ${JSON.stringify(catalogItem.id)} instanceId ${String(placementItem.instanceId)} requires positive base frame dimensions; received ${String(baseRenderEntry.frame.width)}x${String(baseRenderEntry.frame.height)}.`);
  }
  return baseRenderEntry.frame;
}

function getFurnitureTopLeft(
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  baseFrame: Exclude<PlacementRenderFrame, null>,
): Readonly<{ positionX: number; positionY: number }> {
  if (baseRenderEntry.pixelGeometry !== undefined) {
    return {
      positionX: baseRenderEntry.pixelGeometry.positionX,
      positionY: baseRenderEntry.pixelGeometry.positionY,
    };
  }
  return {
    positionX: placementItem.x * placementTilePixelSize,
    positionY: (placementItem.y + placementItem.footprint.height) * placementTilePixelSize - baseFrame.height,
  };
}

function getBoundedFishCoordinate(
  fishIndex: number,
  fishCount: number,
  interiorStart: number,
  interiorSize: number,
  fishSize: number,
): number {
  const maximumOffset = Math.max(0, interiorSize - fishSize);
  const stepCount = Math.max(1, fishCount);
  return interiorStart + Math.max(0, Math.min(maximumOffset, maximumOffset * (fishIndex % stepCount + 0.5) / stepCount));
}

function requireClothingDefinition(
  animationCatalog: AnimationCatalog,
  category: AnimationClothingDefinition["category"],
  clothingId: string,
  catalogItemId: string,
): AnimationClothingDefinition {
  const clothing = animationCatalog.clothingById[`${category}:${clothingId}`];
  if (clothing === undefined) {
    throw new TypeError(`Furniture item ${JSON.stringify(catalogItemId)} has unknown ${category} ID ${JSON.stringify(clothingId)}.`);
  }
  if (clothing.category !== category) {
    throw new TypeError(`Furniture item ${JSON.stringify(catalogItemId)} ${category} ID ${JSON.stringify(clothingId)} resolves to category ${JSON.stringify(clothing.category)}.`);
  }
  return clothing;
}

function getClothingTintColor(clothing: AnimationClothingDefinition): string {
  const tintColor = clothing.defaultColor ?? 0xffffff;
  if (!Number.isSafeInteger(tintColor) || tintColor < 0 || tintColor > 0xffffff) {
    throw new RangeError(`Clothing ${JSON.stringify(clothing.id)} defaultColor must be a 24-bit integer; received ${String(tintColor)}.`);
  }
  return `#${tintColor.toString(16).padStart(6, "0")}`;
}

function getMannequinDirection(spriteState: string | undefined): 0 | 1 | 2 | 3 {
  if (spriteState === undefined || spriteState === "front") {
    return 2;
  }
  switch (spriteState) {
    case "back":
      return 0;
    case "right":
      return 1;
    case "left":
      return 3;
    default:
      throw new TypeError(`Mannequin spriteState must be front, back, left, or right; received ${JSON.stringify(spriteState)}.`);
  }
}

function getMannequinDirectionFrame(direction: 0 | 1 | 2 | 3): 0 | 6 | 12 {
  switch (direction) {
    case 0:
      return 12;
    case 1:
    case 3:
      return 6;
    case 2:
      return 0;
  }
}

function getMannequinBodyFrame(direction: 0 | 1 | 2 | 3): Exclude<PlacementRenderFrame, null> {
  const frameIndex = getMannequinDirectionFrame(direction);
  return {
    x: frameIndex % (mannequinBodyAtlasWidth / mannequinBodyFrameWidth) * mannequinBodyFrameWidth,
    y: Math.floor(frameIndex / (mannequinBodyAtlasWidth / mannequinBodyFrameWidth)) * mannequinBodyFrameHeight,
    width: mannequinBodyFrameWidth,
    height: mannequinBodyFrameHeight,
  };
}

function getShirtFrame(spriteIndex: number, direction: 0 | 1 | 2 | 3): Readonly<{ x: number; y: number }> {
  const rowOffsetByDirection: Readonly<Record<0 | 1 | 2 | 3, number>> = {
    0: 24,
    1: 8,
    2: 0,
    3: 16,
  };
  return {
    x: spriteIndex * 8 % shirtAtlasWidth,
    y: Math.floor(spriteIndex * 8 / shirtAtlasWidth) * mannequinBodyFrameHeight + rowOffsetByDirection[direction],
  };
}

function getHatFrame(spriteIndex: number, direction: 0 | 1 | 2 | 3): Exclude<PlacementRenderFrame, null> {
  const hatDirection = direction === 0 ? 3 : direction === 2 ? 0 : direction === 3 ? 2 : 1;
  return {
    x: spriteIndex * 20 % 240,
    y: Math.floor(spriteIndex * 20 / 240) * 80 + hatDirection * 20,
    width: 20,
    height: 20,
  };
}

function assertAnimationTime(currentTimeMilliseconds: number, animationLabel: string): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    throw new RangeError(`${animationLabel} animation time must be a finite non-negative number; received ${String(currentTimeMilliseconds)}.`);
  }
}

function getItemFallbackZIndex(placementItem: PlacementItem): number {
  return (placementItem.y + placementItem.footprint.height) * 2;
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
