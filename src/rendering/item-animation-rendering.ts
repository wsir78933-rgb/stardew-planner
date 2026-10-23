import type { CatalogItem } from "../catalog";
import type { AnimationCatalog, AnimationChoice } from "../animations/animation-catalog";
import type { PlacementItem } from "../placement/placement-snapshot";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderEntry,
  PlacementRenderFrame,
} from "./placement-rendering";
import { createPlacementFurnitureAnimationEntries } from "./furniture-animation-rendering";

const tilePixelSize = 16;
const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const springObjectsTextureLocalPath = "/game-assets/1.6.15/tilesheets/springobjects.png";
const craftablesTextureSuffix = "/tilesheets/craftables.png";
const machineWobbleRawIds = new Set([
  "9", "12", "13", "15", "16", "17", "19", "20", "21", "24", "25",
  "90", "101", "114", "127", "128", "154", "156", "158", "160", "163",
  "182", "254", "265", "280", "BaitMaker", "Dehydrator", "HeavyFurnace",
  "FishSmoker", "Anvil", "DeluxeWormBin",
]);
const particleMachineRawIds = new Set(["12", "15", "19", "158", "13", "HeavyFurnace"]);
const machineParticleRollIntervalMilliseconds = 7000;
const machineParticleTickMilliseconds = 1000 / 60;
const machinePuffAlphaDecreasePerTick = 0.005;
const machinePuffAlpha = 191 / 255;

export type PlacementItemAnimationResult = Readonly<{
  baseAnimation?: PlacementRenderAnimation;
  baseFrame?: PlacementRenderFrame;
  basePixelGeometry?: PlacementPixelGeometry;
  baseTextureLocalPath?: string;
  overlays: readonly PlacementRenderEntry[];
}>;

export function createPlacementItemAnimationResult(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
  mapPlacementGrid?: MapPlacementGrid,
): PlacementItemAnimationResult {
  const overlays: PlacementRenderEntry[] = [];
  const baseFrame = resolveMachineSpriteStateFrame(
    catalogItem,
    placementItem,
    baseRenderEntry.frame,
    animationCatalog,
  );
  const machineStateId = placementItem.animationOptions?.spriteState;
  const machineWobble = createMachineWobbleAnimation(
    catalogItem,
    placementItem,
    baseFrame ?? baseRenderEntry.frame,
    machineStateId,
    baseRenderEntry,
  );

  overlays.push(...createReadyProductBubbleEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
    animationCatalog,
  ));
  overlays.push(...createMachineParticleEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
    animationCatalog,
  ));
  overlays.push(...createAutoPetterArmEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
  ));
  overlays.push(...createLoomWheelEntries(catalogItem, placementItem, baseRenderEntry));
  overlays.push(...createCaskStarEntries(catalogItem, placementItem, baseRenderEntry));
  overlays.push(...createScarecrowHatEntries(catalogItem, placementItem, baseRenderEntry, animationCatalog));
  overlays.push(...createCauldronBubbleEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
    animationCatalog,
  ));
  const furnitureAnimationResult = createPlacementFurnitureAnimationEntries(
    catalogItem,
    placementItem,
    baseRenderEntry,
    animationCatalog,
  );
  overlays.push(...furnitureAnimationResult.overlays);

  const crabPot = createCrabPotAnimation(
    catalogItem,
    placementItem,
    baseRenderEntry,
    mapPlacementGrid,
    animationCatalog,
  );

  return {
    ...(machineWobble ?? crabPot?.baseAnimation) === undefined
      ? {}
      : { baseAnimation: machineWobble ?? crabPot?.baseAnimation },
    ...(baseFrame === undefined ? {} : { baseFrame }),
    ...(furnitureAnimationResult.baseFrame === undefined ? {} : { baseFrame: furnitureAnimationResult.baseFrame }),
    ...(furnitureAnimationResult.baseTextureLocalPath === undefined
      ? {}
      : { baseTextureLocalPath: furnitureAnimationResult.baseTextureLocalPath }),
    ...(furnitureAnimationResult.basePixelGeometry === undefined
      ? {}
      : { basePixelGeometry: furnitureAnimationResult.basePixelGeometry }),
    overlays: [...overlays, ...(crabPot?.rippleEntry === undefined ? [] : [crabPot.rippleEntry])],
  };
}

function resolveMachineSpriteStateFrame(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseFrame: PlacementRenderFrame,
  animationCatalog: AnimationCatalog,
): PlacementRenderFrame | undefined {
  const machineState = animationCatalog.machineStatesById[catalogItem.id];
  const stateId = placementItem.animationOptions?.spriteState;
  if (machineState === undefined || stateId === undefined) {
    return undefined;
  }

  const selectedState = machineState.choices.find((choice) => choice.id === stateId);
  if (selectedState === undefined) {
    throw new TypeError(
      `Placement animation state ${JSON.stringify(stateId)} is not available for catalog item ${JSON.stringify(catalogItem.id)}.`,
    );
  }

  const frameOffset = readMachineStateFrameOffset(selectedState);
  if (frameOffset === 0) {
    return undefined;
  }
  if (
    catalogItem.sprite.kind !== "sprite-index" ||
    !catalogItem.textureLocalPath.endsWith(craftablesTextureSuffix)
  ) {
    throw new Error(
      `Placement animation state ${JSON.stringify(stateId)} for catalog item ${JSON.stringify(catalogItem.id)} has frame offset ${String(frameOffset)} but does not use a craftables sprite index.`,
    );
  }

  const spriteIndex = catalogItem.sprite.index + frameOffset;
  return {
    x: (spriteIndex % 8) * 16,
    y: Math.floor(spriteIndex / 8) * 32,
    width: 16,
    height: 32,
  };
}

function readMachineStateFrameOffset(choice: Readonly<Record<string, unknown>>): number {
  const rawFrameOffset = choice.frameOffset;
  if (rawFrameOffset === undefined) {
    return 0;
  }
  if (!Number.isSafeInteger(rawFrameOffset) || (rawFrameOffset as number) < 0) {
    throw new TypeError(
      `Animation catalog state frameOffset must be a non-negative safe integer; received ${JSON.stringify(rawFrameOffset)}.`,
    );
  }
  return rawFrameOffset as number;
}

function createMachineWobbleAnimation(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  frame: PlacementRenderFrame,
  stateId: string | undefined,
  baseRenderEntry: PlacementRenderEntry,
): PlacementRenderAnimation | undefined {
  const rawMachineId = getBigCraftableRawId(catalogItem.id);
  if (rawMachineId === null || !machineWobbleRawIds.has(rawMachineId) || frame === null || rawMachineId === "17") {
    return undefined;
  }
  if (!shouldMachineWobble(rawMachineId, stateId)) {
    return undefined;
  }

  return {
    kind: "sprite-motion",
    frames: [frame],
    sample: (currentTimeMilliseconds) => {
      assertAnimationTime(currentTimeMilliseconds);
      const currentTick = Math.floor(currentTimeMilliseconds / (1000 / 60));
      if (rawMachineId === "17") {
        return { rotationRadians: modulo(getLoomInitialRotation(placementItem.instanceId) + currentTick * 0.04, Math.PI * 2) };
      }
      const phase = getMachineWobblePhase(placementItem.instanceId);
      const wobbleState = advanceMachineWobble(phase, currentTick);
      const horizontalExpansion = Math.abs(wobbleState.horizontal - 5);
      const verticalExpansion = Math.abs(wobbleState.vertical - 5);
      const geometry = baseRenderEntry.pixelGeometry ?? {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: placementItem.x * tilePixelSize,
        positionY: placementItem.y * tilePixelSize,
      };
      const baseScale = geometry.uniformScale ?? 1;
      const signedBaseScaleX = baseScale * geometry.horizontalScale;
      const baseScaleY = baseScale;
      const baseWidth = frame.width * Math.abs(signedBaseScaleX);
      const baseHeight = frame.height * baseScaleY;
      if (baseWidth <= 0 || baseHeight <= 0) {
        throw new RangeError(`Machine wobble for ${JSON.stringify(catalogItem.id)} requires positive sprite dimensions; received ${String(baseWidth)}x${String(baseHeight)}.`);
      }
      return {
        positionX: geometry.positionX - horizontalExpansion / 2,
        positionY: geometry.positionY - verticalExpansion / 2,
        scaleX: Math.sign(signedBaseScaleX) * (baseWidth + horizontalExpansion) / frame.width,
        scaleY: (baseHeight + verticalExpansion / 2) / frame.height,
      };
    },
  };
}

function getMachineWobblePhase(instanceId: number): Readonly<{ horizontal: number; vertical: number }> {
  const random = createSeededRandom(hashAnimationSeed(`wobble:item_${String(instanceId)}`));
  return { horizontal: random() * 10, vertical: random() * 10 };
}

function getLoomInitialRotation(instanceId: number): number {
  const random = createSeededRandom(hashAnimationSeed(`wobble:item_${String(instanceId)}`));
  random();
  random();
  return random() * Math.PI * 2;
}

function advanceMachineWobble(
  phase: Readonly<{ horizontal: number; vertical: number }>,
  tick: number,
): Readonly<{ horizontal: number; vertical: number }> {
  let horizontal = phase.horizontal;
  let vertical = phase.vertical;
  const ticksToReplay = tick % 100;
  for (let index = 0; index < ticksToReplay; index += 1) {
    horizontal -= 0.1;
    if (horizontal <= 0) {
      horizontal = 10;
    }
    vertical += 0.1;
    if (vertical >= 10) {
      vertical = 0;
    }
  }
  return { horizontal, vertical };
}

function hashAnimationSeed(value: string): number {
  let seed = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    seed ^= value.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function createSeededRandom(initialSeed: number): () => number {
  let seed = initialSeed >>> 0;
  return () => {
    seed = (seed + 1831565813) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shouldMachineWobble(rawMachineId: string, stateId: string | undefined): boolean {
  if (stateId === undefined) {
    return false;
  }
  if (rawMachineId === "163") {
    return stateId === "silver" || stateId === "gold";
  }
  if (rawMachineId === "101" || rawMachineId === "254" || rawMachineId === "156") {
    return true;
  }
  return stateId === "working";
}

function createReadyProductBubbleEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const readyProductId = placementItem.animationOptions?.readyProduct;
  if (readyProductId === undefined || placementItem.animationOptions?.spriteState === "working") {
    return [];
  }

  const validOutput = animationCatalog.machineOutputsById[catalogItem.id]
    ?.find((choice) => choice.id === readyProductId);
  if (validOutput === undefined) {
    throw new TypeError(`Machine ${JSON.stringify(catalogItem.id)} has unknown readyProduct ID ${JSON.stringify(readyProductId)}.`);
  }
  const productFrame = getAnimationChoiceFrame(validOutput, catalogItem.id, readyProductId);
  const productTextureLocalPath = requireAnimationChoiceTexture(validOutput, catalogItem.id, readyProductId);
  const itemPosition = getItemGroupPosition(placementItem, baseRenderEntry);
  const itemLeft = itemPosition.positionX;
  const itemTop = itemPosition.positionY;
  const bubbleFrame = { x: 141, y: 465, width: 20, height: 24 };
  const entries = [
    createOverlayEntry(baseRenderEntry, {
      animation: createVerticalBobMotion(bubbleFrame, itemLeft - 2, itemTop - 28),
      frame: bubbleFrame,
      layerId: "ready-product-bubble",
      opacity: 0.75,
      pixelGeometry: createPixelGeometry(itemLeft - 2, itemTop - 28),
      textureLocalPath: cursorTextureLocalPath,
      zIndexOffset: 0.01,
    }),
    createOverlayEntry(baseRenderEntry, {
      animation: createVerticalBobMotion(productFrame, itemLeft, itemTop - 26),
      frame: productFrame,
      layerId: "ready-product-icon",
      opacity: 0.75,
      pixelGeometry: createPixelGeometry(itemLeft, itemTop - 26),
      textureLocalPath: productTextureLocalPath,
      zIndexOffset: 0.02,
    }),
  ];
  if (validOutput.colorOverlay === true && validOutput.overlaySourceRect !== undefined && validOutput.dyeColor !== undefined) {
    const overlayFrame = getAnimationChoiceFrame({ ...validOutput, sourceRect: validOutput.overlaySourceRect }, catalogItem.id, readyProductId);
    entries.push(createOverlayEntry(baseRenderEntry, {
      animation: createVerticalBobMotion(overlayFrame, itemLeft, itemTop - 26),
      frame: overlayFrame,
      layerId: "ready-product-color-overlay",
      opacity: 0.75,
      pixelGeometry: createPixelGeometry(itemLeft, itemTop - 26),
      textureLocalPath: productTextureLocalPath,
      tintColor: formatTintColor(validOutput.dyeColor),
      zIndexOffset: 0.021,
    }));
  }
  return entries;
}

function createMachineParticleEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const rawMachineId = getBigCraftableRawId(catalogItem.id);
  if (
    rawMachineId === null ||
    !particleMachineRawIds.has(rawMachineId) ||
    placementItem.animationOptions?.spriteState !== "working"
  ) {
    return [];
  }

  const particleDefinition = getMachineParticleDefinition(
    rawMachineId,
    placementItem.animationOptions.readyProduct,
  );
  if (particleDefinition === null) {
    return [];
  }
  const particleFrames = horizontalFrames(particleDefinition.frame, particleDefinition.frameCount);
  const firstFrame = particleFrames[0];
  if (firstFrame === undefined) {
    throw new Error(`Machine particle frame list for ${JSON.stringify(catalogItem.id)} is empty.`);
  }
  const baseGeometry = baseRenderEntry.pixelGeometry ?? createPixelGeometry(
    placementItem.x * tilePixelSize,
    placementItem.y * tilePixelSize,
  );
  const particleLifetimeMilliseconds = Math.min(
    particleDefinition.loops * particleDefinition.frameCount * particleDefinition.frameDurationMilliseconds,
    machineParticleTickMilliseconds / machinePuffAlphaDecreasePerTick,
  );
  return particleDefinition.tintColors.map((tintColor, tintIndex) => createOverlayEntry(baseRenderEntry, {
    animation: {
      kind: "sprite-motion",
      frames: particleFrames,
      sample: (currentTimeMilliseconds) => {
        assertAnimationTime(currentTimeMilliseconds);
        const rollBucket = Math.floor(currentTimeMilliseconds / machineParticleRollIntervalMilliseconds);
        const age = modulo(currentTimeMilliseconds, machineParticleRollIntervalMilliseconds);
        const rolled = rollBucket > 0 && didMachineParticleRoll(
          placementItem.instanceId,
          rollBucket,
          particleDefinition.chance,
        );
        const frameIndex = Math.floor(age / particleDefinition.frameDurationMilliseconds) % particleFrames.length;
        const alpha = particleDefinition.initialAlpha * (
          1 - machinePuffAlphaDecreasePerTick * age / machineParticleTickMilliseconds
        );
        const visible = rolled && age < particleLifetimeMilliseconds && alpha > 0;
        return {
          frameIndex: visible ? frameIndex : 0,
          opacity: visible ? alpha : 0,
          positionX: baseGeometry.positionX + particleDefinition.offsetX,
          positionY: baseGeometry.positionY + particleDefinition.offsetY,
          visible,
        };
      },
    },
    frame: firstFrame,
    layerId: `machine-puff-${String(tintIndex)}`,
    opacity: particleDefinition.initialAlpha,
    pixelGeometry: createPixelGeometry(
      baseGeometry.positionX + particleDefinition.offsetX,
      baseGeometry.positionY + particleDefinition.offsetY,
      0,
      0,
      particleDefinition.scale,
    ),
    textureLocalPath: cursorTextureLocalPath,
    tintColor,
    zIndexOffset: 0.02 + tintIndex * 0.001,
  }))
}

type MachineParticleDefinition = Readonly<{
  chance: number;
  frame: Readonly<{ x: number; y: number; width: number; height: number }>;
  frameCount: number;
  frameDurationMilliseconds: number;
  initialAlpha: number;
  loops: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  tintColors: readonly string[];
}>;

function getMachineParticleDefinition(
  rawMachineId: string,
  readyProductId: string | undefined,
): MachineParticleDefinition | null {
  if (rawMachineId === "12") {
    const dyeColors: Readonly<Record<string, number>> = {
      "348": 11316411,
      "350": 12566463,
      "346": 12566272,
    };
    const productTint = readyProductId === undefined ? undefined : dyeColors[readyProductId];
    return {
      chance: 0.33,
      frame: { x: 256, y: 1856, width: 64, height: 128 },
      frameCount: 6,
      frameDurationMilliseconds: 80,
      initialAlpha: machinePuffAlpha,
      loops: 999999,
      offsetX: 0,
      offsetY: -32,
      scale: 0.25,
      tintColors: productTint === undefined
        ? [formatTintColor(8289918)]
        : [formatTintColor(productTint), formatTintColor(8289918)],
    };
  }
  if (rawMachineId === "15") {
    const productTint = readyProductId === "344"
      ? 8495788
      : readyProductId === "342"
        ? 12566463
        : undefined;
    return productTint === undefined ? null : {
      chance: 0.33,
      frame: { x: 256, y: 1856, width: 64, height: 128 },
      frameCount: 6,
      frameDurationMilliseconds: 80,
      initialAlpha: machinePuffAlpha,
      loops: 999999,
      offsetX: 0,
      offsetY: -32,
      scale: 0.25,
      tintColors: [formatTintColor(productTint)],
    };
  }
  if (rawMachineId === "19" || rawMachineId === "158") {
    return {
      chance: 0.33,
      frame: { x: 256, y: 1856, width: 64, height: 128 },
      frameCount: 6,
      frameDurationMilliseconds: 80,
      initialAlpha: 1,
      loops: 999999,
      offsetX: 0,
      offsetY: -32,
      scale: 0.25,
      tintColors: [rawMachineId === "19" ? "#ffff00" : "#00ff00"],
    };
  }
  if (rawMachineId === "13" || rawMachineId === "HeavyFurnace") {
    return {
      chance: 0.165,
      frame: { x: 0, y: 1920, width: 64, height: 64 },
      frameCount: 4,
      frameDurationMilliseconds: 50,
      initialAlpha: 1,
      loops: 10,
      offsetX: 0,
      offsetY: rawMachineId === "HeavyFurnace" ? -10 : -4,
      scale: 0.25,
      tintColors: ["#ffffff"],
    };
  }
  return null;
}

function didMachineParticleRoll(
  instanceId: number,
  rollBucket: number,
  chance: number,
): boolean {
  if (!Number.isFinite(rollBucket) || !Number.isInteger(rollBucket) || rollBucket < 1) {
    throw new RangeError(`Machine particle roll bucket must be a positive finite integer; received ${String(rollBucket)}.`);
  }
  const random = createSeededRandom(
    hashAnimationSeed(`item_${String(instanceId)}:machine-puff:${String(rollBucket)}`),
  );
  return random() < chance;
}

function formatTintColor(tintColor: number): string {
  return `#${tintColor.toString(16).padStart(6, "0")}`;
}

function createAutoPetterArmEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
): readonly PlacementRenderEntry[] {
  if (catalogItem.id !== "big-craftable:272" || catalogItem.sprite.kind !== "sprite-index") {
    return [];
  }
  const baseFrame = createCraftablesFrame(catalogItem.sprite.index);
  const armFrame = { ...baseFrame, y: baseFrame.y + 64 };
  const basePosition = getItemGroupPosition(placementItem, baseRenderEntry);
  return [createOverlayEntry(baseRenderEntry, {
    animation: {
      kind: "sprite-motion",
      frames: [armFrame],
      sample: (currentTimeMilliseconds) => {
        assertAnimationTime(currentTimeMilliseconds);
        const currentTick = Math.floor(currentTimeMilliseconds / (1000 / 60));
        return { rotationRadians: modulo(currentTick * (-1.5 / 60), Math.PI * 2) };
      },
    },
    frame: armFrame,
    layerId: "auto-petter-arm",
    pixelGeometry: {
      anchorX: 7.5 / 16,
      anchorY: 15.5 / 32,
      horizontalScale: 1,
      positionX: basePosition.positionX + 8.5,
      positionY: basePosition.positionY + 12,
    },
    textureLocalPath: catalogItem.textureLocalPath,
    zIndexOffset: 0,
  })];
}

function createLoomWheelEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
): readonly PlacementRenderEntry[] {
  if (catalogItem.id !== "big-craftable:17" || placementItem.animationOptions?.spriteState !== "working") {
    return [];
  }
  const spriteIndex = 435;
  const wheelFrame = {
    x: (spriteIndex % 24) * 16,
    y: Math.floor(spriteIndex / 24) * 16,
    width: 16,
    height: 16,
  };
  const basePosition = getItemGroupPosition(placementItem, baseRenderEntry);
  return [createOverlayEntry(baseRenderEntry, {
    animation: {
      kind: "sprite-motion",
      frames: [wheelFrame],
      sample: (currentTimeMilliseconds) => {
        assertAnimationTime(currentTimeMilliseconds);
        const currentTick = Math.floor(currentTimeMilliseconds / machineParticleTickMilliseconds);
        return {
          rotationRadians: modulo(
            getLoomInitialRotation(placementItem.instanceId) + currentTick * 0.04,
            Math.PI * 2,
          ),
        };
      },
    },
    frame: wheelFrame,
    layerId: "loom-wheel",
    pixelGeometry: {
      anchorX: 0.5,
      anchorY: 0.5,
      horizontalScale: 1,
      positionX: basePosition.positionX + 8,
      positionY: basePosition.positionY,
    },
    textureLocalPath: springObjectsTextureLocalPath,
    zIndexOffset: 0,
  })];
}

function createCaskStarEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
): readonly PlacementRenderEntry[] {
  if (catalogItem.id !== "big-craftable:163") {
    return [];
  }
  const frameByState: Readonly<Record<string, Readonly<{ x: number; y: number; width: number; height: number }>>> = {
    silver: { x: 338, y: 400, width: 8, height: 8 },
    gold: { x: 346, y: 400, width: 8, height: 8 },
    iridium: { x: 346, y: 392, width: 8, height: 8 },
  };
  const spriteState = placementItem.animationOptions?.spriteState;
  const frame = spriteState === undefined ? undefined : frameByState[spriteState];
  if (frame === undefined) {
    return [];
  }
  const basePosition = getItemGroupPosition(placementItem, baseRenderEntry);
  return [createOverlayEntry(baseRenderEntry, {
    frame,
    layerId: "cask-quality-star",
    opacity: 0.95,
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: basePosition.positionX + 6,
      positionY: basePosition.positionY + 2,
      uniformScale: 0.5,
    },
    textureLocalPath: cursorTextureLocalPath,
    zIndexOffset: 0,
  })];
}

function createScarecrowHatEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (catalogItem.id !== "big-craftable:126") {
    return [];
  }
  const hatId = placementItem.animationOptions?.hatId;
  if (hatId === undefined) {
    return [];
  }
  const hat = animationCatalog.clothingById[`hat:${hatId}`];
  if (hat === undefined || hat.category !== "hat") {
    throw new TypeError(`Scarecrow ${JSON.stringify(catalogItem.id)} has unknown hat ID ${JSON.stringify(hatId)}.`);
  }
  const frame = getHatSourceFrame(hat.spriteIndex, 2);
  const basePosition = getItemGroupPosition(placementItem, baseRenderEntry);
  return [createOverlayEntry(baseRenderEntry, {
    animation: hat.isPrismatic ? createPrismaticTintMotion(frame) : undefined,
    frame,
    layerId: "scarecrow-hat",
    pixelGeometry: createPixelGeometry(basePosition.positionX - 3, basePosition.positionY - 22),
    textureLocalPath: hat.textureLocalPath,
    zIndexOffset: 0,
  })];
}

function createPrismaticTintMotion(
  frame: Exclude<PlacementRenderFrame, null>,
): PlacementRenderAnimation {
  return {
    kind: "sprite-motion",
    frames: [frame],
    sample: (currentTimeMilliseconds) => {
      assertAnimationTime(currentTimeMilliseconds);
      return { tintColor: getPrismaticTintColor(currentTimeMilliseconds) };
    },
  };
}

function getPrismaticTintColor(currentTimeMilliseconds: number): string {
  const colors = [
    [255, 0, 0], [255, 120, 0], [255, 217, 0],
    [0, 255, 0], [0, 255, 255], [238, 130, 238],
  ] as const;
  const colorPosition = currentTimeMilliseconds / 1500;
  const currentIndex = Math.floor(colorPosition) % colors.length;
  const nextIndex = (currentIndex + 1) % colors.length;
  const progress = colorPosition % 1;
  const color = colors[currentIndex];
  const nextColor = colors[nextIndex];
  if (color === undefined || nextColor === undefined) {
    throw new Error(`Prismatic color table is missing index ${String(currentIndex)}.`);
  }
  const channels = color.map((channel, channelIndex) => {
    const nextChannel = nextColor[channelIndex];
    if (nextChannel === undefined) {
      throw new Error(`Prismatic color ${String(nextIndex)} is missing channel ${String(channelIndex)}.`);
    }
    return Math.floor(channel + progress * (nextChannel - channel)).toString(16).padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

function getHatSourceFrame(
  spriteIndex: number,
  direction: 0 | 1 | 2 | 3,
): Exclude<PlacementRenderFrame, null> {
  const hatRow = direction === 0 ? 3 : direction === 2 ? 0 : direction === 3 ? 2 : 1;
  return {
    x: spriteIndex * 20 % 240,
    y: Math.floor(spriteIndex * 20 / 240) * 80 + hatRow * 20,
    width: 20,
    height: 20,
  };
}

function createCauldronBubbleEntries(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (catalogItem.id !== "furniture_Cauldron" || placementItem.variant === 1) {
    return [];
  }
  const bubbles = animationCatalog.bubbles;
  const frame = bubbles.puffFrame;
  const baseX = placementItem.x * tilePixelSize + bubbles.offsetX;
  const baseY = placementItem.y * tilePixelSize + bubbles.offsetY;
  const repeatingBubbleCount = Math.ceil(
    bubbles.lifetimeSeconds * 1000 / bubbles.particleIntervalMilliseconds,
  );
  const getParticleRandom = (index: number) => getCauldronParticleRandom(placementItem.instanceId, index);
  const initialPlumeEntries = Array.from({ length: bubbles.firstPlumeCount }, (_, bubbleIndex) => {
    const particleRandom = getParticleRandom(bubbleIndex);
    const initialVelocity = -0.5 - bubbleIndex * 0.2;
    return createOverlayEntry(baseRenderEntry, {
      animation: createCauldronBubbleMotion(
        frame,
        baseX,
        baseY,
        () => particleRandom,
        0,
        initialVelocity / 4,
        0.001 - initialVelocity / 300,
        0,
        bubbles.lifetimeSeconds * 1000,
        bubbles.initialOpacity,
      ),
      frame,
      layerId: `cauldron-bubble-initial-${String(bubbleIndex)}`,
      pixelGeometry: createPixelGeometry(
        baseX + particleRandom.randomX / 4 + frame.width * 0.75 / 2,
        baseY + particleRandom.randomY / 4 + frame.height * 0.75 / 2,
        0.5,
        0.5,
      ),
      textureLocalPath: bubbles.textureLocalPath,
      tintColor: bubbles.tintColor,
      zIndexOffset: bubbles.zIndexOffset + bubbleIndex * 0.0001,
    });
  });
  const repeatingPlumePeriod = repeatingBubbleCount * bubbles.particleIntervalMilliseconds;
  const repeatingPlumeEntries = Array.from({ length: repeatingBubbleCount }, (_, bubbleIndex) => {
    const firstSpawnMilliseconds = (bubbleIndex + 1) * bubbles.particleIntervalMilliseconds;
    const firstRandomIndex = bubbles.firstPlumeCount + bubbleIndex;
    const firstRandom = getParticleRandom(firstRandomIndex);
    return createOverlayEntry(baseRenderEntry, {
      animation: createCauldronBubbleMotion(
        frame,
        baseX,
        baseY,
        (cycle) => getParticleRandom(firstRandomIndex + cycle * repeatingBubbleCount),
        firstSpawnMilliseconds,
        -0.125,
        bubbles.opacityDecreasePerTick,
        0,
        bubbles.lifetimeSeconds * 1000,
        bubbles.initialOpacity,
        repeatingPlumePeriod,
      ),
      frame,
      layerId: `cauldron-bubble-repeat-${String(bubbleIndex)}`,
      pixelGeometry: createPixelGeometry(
        baseX + firstRandom.randomX / 4 + frame.width * 0.75 / 2,
        baseY + firstRandom.randomY / 4 + frame.height * 0.75 / 2,
        0.5,
        0.5,
      ),
      textureLocalPath: bubbles.textureLocalPath,
      tintColor: bubbles.tintColor,
      zIndexOffset: bubbles.zIndexOffset + 0.002 + bubbleIndex * 0.0001,
    });
  });
  return [...initialPlumeEntries, ...repeatingPlumeEntries];
}

function createCrabPotAnimation(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
  mapPlacementGrid: MapPlacementGrid | undefined,
  animationCatalog: AnimationCatalog,
): Readonly<{
  baseAnimation: PlacementRenderAnimation;
  rippleEntry?: PlacementRenderEntry;
}> | undefined {
  if (catalogItem.renderingMetadata?.kind !== "crab-pot" || mapPlacementGrid === undefined || baseRenderEntry.frame === null) {
    return undefined;
  }
  assertMapGrid(mapPlacementGrid);
  if (!isCrabPotWaterPlacement(placementItem, mapPlacementGrid)) {
    return undefined;
  }
  const baseGeometry = baseRenderEntry.pixelGeometry ?? createPixelGeometry(
    placementItem.x * tilePixelSize,
    placementItem.y * tilePixelSize,
  );
  const frame = baseRenderEntry.frame;
  const baseAnimation: PlacementRenderAnimation = {
      kind: "sprite-motion",
      frames: [frame],
      sample: (currentTimeMilliseconds) => {
        assertAnimationTime(currentTimeMilliseconds);
        const bob = (Math.sin(currentTimeMilliseconds / 500 + placementItem.x * 64) * 8 + 8) / 4;
        return { positionX: baseGeometry.positionX, positionY: baseGeometry.positionY + bob };
      },
    };
  const rippleEntry = createCrabPotRippleEntry(
    baseRenderEntry,
    placementItem,
    animationCatalog,
  );
  return { baseAnimation, ...(rippleEntry === undefined ? {} : { rippleEntry }) };
}

function createCrabPotRippleEntry(
  baseRenderEntry: PlacementRenderEntry,
  placementItem: PlacementItem,
  animationCatalog: AnimationCatalog,
): PlacementRenderEntry | undefined {
  if (animationCatalog.crabPot.frames.length !== 8) {
    throw new Error(`Animation catalog crab pot ripple requires eight frames; received ${String(animationCatalog.crabPot.frames.length)}.`);
  }
  const firstFrame = animationCatalog.crabPot.frames[0];
  if (firstFrame === undefined) {
    throw new Error("Animation catalog crab pot ripple frame list is empty.");
  }
  const rippleFrames = animationCatalog.crabPot.frames.map(({ x, y, width, height }) => ({ x, y, width, height }));
  const cycleDurationMilliseconds = Math.PI * 1000;
  const phaseOffset = placementItem.x * 64;
  const firstLowPhase = Math.PI + Math.asin((8 - 0.35) / 8);
  const firstSpawnMilliseconds = modulo(
    (firstLowPhase - modulo(phaseOffset, Math.PI * 2)) * 500,
    cycleDurationMilliseconds,
  );
  const positionX = placementItem.x * tilePixelSize + 1;
  const positionY = placementItem.y * tilePixelSize + 8;
  return createOverlayEntry(baseRenderEntry, {
    animation: {
      kind: "sprite-motion",
      frames: rippleFrames,
      sample: (currentTimeMilliseconds) => {
        assertAnimationTime(currentTimeMilliseconds);
        const age = modulo(currentTimeMilliseconds - firstSpawnMilliseconds, cycleDurationMilliseconds);
        const visible = age < 1200;
        return {
          frameIndex: Math.min(7, Math.floor(age / 150)),
          opacity: Math.max(0, 1 - 0.01 * age / (1000 / 60)),
          positionX,
          positionY,
          scaleX: 0.1875,
          scaleY: 0.1875,
          visible,
        };
      },
    },
    frame: firstFrame,
    layerId: "crab-pot-ripple",
    pixelGeometry: createPixelGeometry(positionX, positionY),
    textureLocalPath: animationCatalog.crabPot.textureLocalPath,
    zIndexOffset: 0.01,
  });
}

function isCrabPotWaterPlacement(
  placementItem: PlacementItem,
  mapPlacementGrid: MapPlacementGrid,
): boolean {
  const index = placementItem.y * mapPlacementGrid.width + placementItem.x;
  return mapPlacementGrid.capabilitiesByTile[index]?.water === true;
}

function createVerticalBobMotion(
  frame: Exclude<PlacementRenderFrame, null>,
  positionX: number,
  positionY: number,
): PlacementRenderAnimation {
  return {
    kind: "sprite-motion",
    frames: [frame],
    sample: (currentTimeMilliseconds) => {
      assertAnimationTime(currentTimeMilliseconds);
      const bubbleOffset = Math.round(Math.sin(currentTimeMilliseconds / 250) * 100) / 100;
      return {
        positionX,
        positionY: positionY + bubbleOffset,
      };
    },
  };
}

function createCauldronBubbleMotion(
  frame: Exclude<PlacementRenderFrame, null>,
  baseX: number,
  baseY: number,
  getParticleRandom: (cycle: number) => CauldronParticleRandom,
  firstSpawnMilliseconds: number,
  motionY: number,
  fadePerTick: number,
  rotationChange: number,
  lifetimeMilliseconds: number,
  initialOpacity: number,
  repeatPeriodMilliseconds?: number,
): PlacementRenderAnimation {
  return {
    kind: "sprite-motion",
    frames: [frame],
    sample: (currentTimeMilliseconds) => {
      assertAnimationTime(currentTimeMilliseconds);
      const elapsedMilliseconds = currentTimeMilliseconds - firstSpawnMilliseconds;
      const age = repeatPeriodMilliseconds === undefined
        ? elapsedMilliseconds
        : modulo(elapsedMilliseconds, repeatPeriodMilliseconds);
      const cycle = repeatPeriodMilliseconds === undefined
        ? 0
        : Math.max(0, Math.floor(elapsedMilliseconds / repeatPeriodMilliseconds));
      const particleRandom = getParticleRandom(cycle);
      const ageTicks = age / (1000 / 60);
      const opacity = initialOpacity - ageTicks * fadePerTick;
      const visible = elapsedMilliseconds >= 0 && opacity > 0 && age < lifetimeMilliseconds;
      return {
        opacity: Math.max(0, opacity),
        positionX: baseX + particleRandom.randomX / 4 + frame.width * 0.75 / 2,
        positionY: baseY + particleRandom.randomY / 4 + frame.height * 0.75 / 2 + ageTicks * motionY,
        rotationRadians: particleRandom.rotationRadians + ageTicks * rotationChange,
        scaleX: 0.75 + ageTicks * 0.0025,
        scaleY: 0.75 + ageTicks * 0.0025,
        visible,
      };
    },
  };
}

type CauldronParticleRandom = Readonly<{
  randomX: number;
  randomY: number;
  rotationRadians: number;
}>;

function getCauldronParticleRandom(instanceId: number, index: number): CauldronParticleRandom {
  if (!Number.isFinite(index) || !Number.isInteger(index) || index < 0) {
    throw new RangeError(`Cauldron particle random index must be a non-negative finite integer; received ${String(index)}.`);
  }
  const random = createSeededRandom(
    hashAnimationSeed(`item_${String(instanceId)}:cauldron-bubble:${String(index)}`),
  );
  return {
    randomX: Math.floor(random() * 33) - 12,
    randomY: Math.floor(random() * 16),
    rotationRadians: (Math.floor(random() * 11) - 5) * (Math.PI / 256),
  };
}

function horizontalFrames(
  firstFrame: Readonly<{ x: number; y: number; width: number; height: number }>,
  frameCount: number,
): readonly Exclude<PlacementRenderFrame, null>[] {
  return Array.from({ length: frameCount }, (_, frameIndex) => ({
    ...firstFrame,
    x: firstFrame.x + frameIndex * firstFrame.width,
  }));
}

function getAnimationChoiceFrame(
  animationChoice: AnimationChoice,
  machineCatalogItemId: string,
  productId: string,
): Exclude<PlacementRenderFrame, null> {
  const frame = animationChoice.sourceRect;
  if (frame === undefined) {
    throw new Error(`Machine ${JSON.stringify(machineCatalogItemId)} output ${JSON.stringify(productId)} has no locked product source rectangle.`);
  }
  if (
    !Number.isSafeInteger(frame.x) || frame.x < 0 ||
    !Number.isSafeInteger(frame.y) || frame.y < 0 ||
    !Number.isSafeInteger(frame.width) || frame.width <= 0 ||
    !Number.isSafeInteger(frame.height) || frame.height <= 0
  ) {
    throw new RangeError(`Machine ${JSON.stringify(machineCatalogItemId)} output ${JSON.stringify(productId)} has invalid source rectangle ${JSON.stringify(frame)}.`);
  }
  return { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
}

function requireAnimationChoiceTexture(
  animationChoice: AnimationChoice,
  machineCatalogItemId: string,
  productId: string,
): string {
  if (animationChoice.textureLocalPath === undefined || animationChoice.textureLocalPath.trim() === "") {
    throw new Error(`Machine ${JSON.stringify(machineCatalogItemId)} output ${JSON.stringify(productId)} has no locked product texture path.`);
  }
  return animationChoice.textureLocalPath;
}

function createCraftablesFrame(spriteIndex: number): Exclude<PlacementRenderFrame, null> {
  return { x: (spriteIndex % 8) * 16, y: Math.floor(spriteIndex / 8) * 32, width: 16, height: 32 };
}

function createOverlayEntry(
  baseRenderEntry: PlacementRenderEntry,
  options: Readonly<{
    animation?: PlacementRenderAnimation;
    frame: Exclude<PlacementRenderFrame, null>;
    layerId: string;
    opacity?: number;
    pixelGeometry: PlacementPixelGeometry;
    textureLocalPath: string;
    tintColor?: string;
    zIndexOffset: number;
  }>,
): PlacementRenderEntry {
  return {
    ...baseRenderEntry,
    animation: options.animation,
    frame: options.frame,
    layerId: options.layerId,
    ...(options.opacity === undefined ? {} : { opacity: options.opacity }),
    pixelGeometry: options.pixelGeometry,
    textureLocalPath: options.textureLocalPath,
    ...(options.tintColor === undefined ? {} : { tintColor: options.tintColor }),
    zIndex: (baseRenderEntry.zIndex ?? (baseRenderEntry.tileY + 1) * 2) + options.zIndexOffset,
  };
}

function createPixelGeometry(
  positionX: number,
  positionY: number,
  anchorX = 0,
  anchorY = 0,
  uniformScale?: number,
): PlacementPixelGeometry {
  return {
    anchorX,
    anchorY,
    horizontalScale: 1,
    positionX,
    positionY,
    ...(uniformScale === undefined ? {} : { uniformScale }),
  };
}

function getItemGroupPosition(
  placementItem: PlacementItem,
  baseRenderEntry: PlacementRenderEntry,
): Readonly<{ positionX: number; positionY: number }> {
  if (baseRenderEntry.pixelGeometry !== undefined) {
    return {
      positionX: baseRenderEntry.pixelGeometry.positionX,
      positionY: baseRenderEntry.pixelGeometry.positionY,
    };
  }
  return {
    positionX: placementItem.x * tilePixelSize,
    positionY: placementItem.y * tilePixelSize,
  };
}

function getBigCraftableRawId(catalogItemId: string): string | null {
  if (!catalogItemId.startsWith("big-craftable:")) {
    return null;
  }
  return catalogItemId.slice("big-craftable:".length);
}

function assertAnimationTime(currentTimeMilliseconds: number): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    throw new RangeError(
      `Placement animation time must be a finite non-negative number; received ${String(currentTimeMilliseconds)}.`,
    );
  }
}

function assertMapGrid(mapPlacementGrid: MapPlacementGrid): void {
  if (!Number.isSafeInteger(mapPlacementGrid.width) || mapPlacementGrid.width <= 0 || !Number.isSafeInteger(mapPlacementGrid.height) || mapPlacementGrid.height <= 0) {
    throw new TypeError(
      `Placement animation map grid dimensions must be positive safe integers; received ${String(mapPlacementGrid.width)}x${String(mapPlacementGrid.height)}.`,
    );
  }
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
