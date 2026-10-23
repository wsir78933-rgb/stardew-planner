import type { CatalogItem } from "../catalog";
import type { AnimationBuildingDefinition, AnimationCatalog } from "../animations/animation-catalog";
import type { PlacementBuilding, PlacementItem } from "../placement/placement-snapshot";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderEntry,
  PlacementRenderFrame,
} from "./placement-rendering";

const tilePixelSize = 16;
const cursorTextureLocalPath = "/game-assets/1.6.15/sprites/Cursors.png";
const cursor16TextureLocalPath = "/game-assets/1.6.15/tilesheets/Cursors_1_6.png";
const springObjectsTextureSuffix = "/tilesheets/springobjects.png";
const waterFrameDurationMilliseconds = 200;
const waterScrollPixelsPerMillisecond = 0.006;
const waterScrollSourceStepPixels = 4;
const waterAtlasFrameSizePixels = 64;
const clockTickMilliseconds = 1000 / 60;
const chimneyFadePerTick = 0.002;
const chimneyInitialOpacity = 0.75;
const chimneyRisePerTick = -0.5 / 4;
const chimneyDriftAccelerationPerTickSquared = 0.002 / 4;
const chimneyInitialScale = 2 / 4;
const chimneyScaleChangePerTick = 0.02 / 4;
const chimneyRotationStepRadians = Math.PI / 256;
const goldClockStartGameTime = 610;
const goldClockDayMilliseconds = 7000;
const goldClockWrapStart = 360;
const goldClockWrapDuration = 1200;

export function animateFishPondWaterEntries(
  building: PlacementBuilding,
  buildingEntries: readonly PlacementRenderEntry[],
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (building.buildingId !== "Fish Pond") {
    return buildingEntries;
  }
  return buildingEntries.flatMap((entry) => {
    const layerMatch = /^FishPondWaterTile_(\d+)_(\d+)$/.exec(entry.layerId ?? "");
    if (layerMatch === null) {
      if (entry.layerId !== "FishPondBubbles" || entry.pixelGeometry === undefined || entry.frame === null) {
        return [entry];
      }
      const bubblePosition = entry.pixelGeometry;
      return [{
        ...entry,
        animation: {
          kind: "sprite-motion" as const,
          frames: [entry.frame],
          sample: (currentTimeMilliseconds: number) => {
            assertAnimationTime(currentTimeMilliseconds);
            const verticalOffset = currentTimeMilliseconds % 2500 < 1250 ? 1 : 0;
            return { positionY: bubblePosition.positionY + verticalOffset };
          },
        },
      }];
    }
    if (entry.frame === null || entry.pixelGeometry === undefined) {
      throw new Error(`Fish Pond water layer ${JSON.stringify(entry.layerId)} requires a frame and pixel geometry.`);
    }
    const rowIndex = Number(layerMatch[1]);
    const columnIndex = Number(layerMatch[2]);
    if (!Number.isSafeInteger(rowIndex) || !Number.isSafeInteger(columnIndex)) {
      throw new TypeError(`Fish Pond water layer ${JSON.stringify(entry.layerId)} must include integer row and column coordinates.`);
    }
    if (animationCatalog.waterSurface.frames.length !== 10) {
      throw new Error(`Fish Pond water requires ten shared animation frames; received ${String(animationCatalog.waterSurface.frames.length)}.`);
    }
    const frames = createFishPondWaterFrames(
      animationCatalog.waterSurface.frames,
      rowIndex,
      columnIndex,
    );
    const firstFrame = frames[0];
    if (firstFrame === undefined || frames.length !== 320) {
      throw new Error(`Fish Pond water layer ${JSON.stringify(entry.layerId)} requires 320 scroll/flip frames; received ${String(frames.length)}.`);
    }
    const waterPosition = entry.pixelGeometry;
    return {
      ...entry,
      animation: {
        kind: "sprite-motion",
        frames,
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds);
          const state = getSharedPondWaterState(currentTimeMilliseconds);
          const frameIndex = state.waterIndex * 32 + state.scrollStepIndex * 2 + state.waterFlip;
          return {
            frameIndex,
            positionY: waterPosition.positionY + (rowIndex === 0 ? 0 : -state.scrollPixels / 4),
          };
        },
      },
      frame: firstFrame,
    };
  });
}

function createFishPondWaterFrames(
  waterFrames: AnimationCatalog["waterSurface"]["frames"],
  rowIndex: number,
  columnIndex: number,
): readonly Exclude<PlacementRenderFrame, null>[] {
  const frames: Exclude<PlacementRenderFrame, null>[] = [];
  for (let waterIndex = 0; waterIndex < 10; waterIndex += 1) {
    const waterFrame = waterFrames[waterIndex];
    if (waterFrame === undefined) {
      throw new Error(`Fish Pond water animation is missing shared water frame ${String(waterIndex)}.`);
    }
    for (let scrollStepIndex = 0; scrollStepIndex < 16; scrollStepIndex += 1) {
      const scrollPixels = scrollStepIndex * waterScrollSourceStepPixels;
      for (let waterFlip = 0; waterFlip < 2; waterFlip += 1) {
        const parity = (rowIndex + columnIndex + waterFlip) % 2;
        const sourceRect = waterFrame.sourceRectsByFlip[parity];
        const sourceY = rowIndex === 0 ? sourceRect.y + scrollPixels : sourceRect.y;
        const requestedHeight = rowIndex === 0
          ? waterAtlasFrameSizePixels - scrollPixels
          : rowIndex === 4
            ? 32 + scrollPixels - 5
            : waterAtlasFrameSizePixels;
        if (requestedHeight <= 0) {
          throw new RangeError(`Fish Pond water layer row ${String(rowIndex)} column ${String(columnIndex)} has no valid atlas pixels at y=${String(sourceY)}.`);
        }
        frames.push({ x: sourceRect.x, y: sourceY, width: sourceRect.width, height: requestedHeight });
      }
    }
  }
  return frames;
}

function getSharedPondWaterState(currentTimeMilliseconds: number): Readonly<{
  waterIndex: number;
  scrollPixels: number;
  scrollStepIndex: number;
  waterFlip: 0 | 1;
}> {
  const scrollPosition = currentTimeMilliseconds * waterScrollPixelsPerMillisecond;
  const scrollPixels = Math.floor(scrollPosition % waterAtlasFrameSizePixels / waterScrollSourceStepPixels) * waterScrollSourceStepPixels;
  return {
    waterIndex: Math.floor(currentTimeMilliseconds / waterFrameDurationMilliseconds) % 10,
    scrollPixels,
    scrollStepIndex: scrollPixels / waterScrollSourceStepPixels,
    waterFlip: Math.floor(scrollPosition / waterAtlasFrameSizePixels) % 2 as 0 | 1,
  };
}

export function createPlacementBuildingAnimationEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const definition = animationCatalog.buildingAnimationsById[`building:${building.buildingId}`];
  if (definition === undefined) {
    return [];
  }
  switch (definition.kind) {
    case "chimney-smoke":
      return createChimneySmokeEntries(building, catalogItem, buildingEntries, definition, animationCatalog);
    case "mill":
      return createMillAnimationEntries(building, catalogItem, buildingEntries, definition, animationCatalog);
    case "fish-pond":
      return createFishPondEntries(building, catalogItem, buildingEntries, animationCatalog);
    case "gold-clock":
      return createGoldClockEntries(building, catalogItem, buildingEntries);
    case "stable-horse":
    case "junimo-hut":
    case "pet-bowl":
      return [];
    default:
      return assertNeverBuildingDefinition(definition);
  }
}

function createChimneySmokeEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
  definition: Extract<AnimationBuildingDefinition, { kind: "chimney-smoke" }>,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (building.animationOptions?.fireplaceLit !== true) {
    return [];
  }
  const baseEntry = getBuildingBaseEntry(building, buildingEntries);
  const basePosition = getBuildingBasePosition(building, baseEntry);
  const baseX = basePosition.positionX + definition.chimneyPosition.x - 2;
  const baseY = basePosition.positionY + definition.chimneyPosition.y - 3;
  const baseZIndex = getBuildingFrontZIndex(buildingEntries, building);
  const smoke = animationCatalog.smoke;
  const frame = smoke.puffFrame;
  const plumeInterval = smoke.particleIntervalMilliseconds;
  const plumePeriod = plumeInterval * smoke.firstPlumeCount;
  return Array.from({ length: smoke.firstPlumeCount }, (_, plumeIndex) => {
    const particleFrame = { ...frame };
    const phaseOffset = plumeIndex * plumeInterval;
    return createBuildingOverlayEntry(catalogItem, building, {
      animation: {
        kind: "sprite-motion",
        frames: [particleFrame],
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds);
          const firstSpawnMilliseconds = plumeInterval + phaseOffset;
          const elapsedMilliseconds = currentTimeMilliseconds - firstSpawnMilliseconds;
          const age = modulo(elapsedMilliseconds, plumePeriod);
          const opacity = Math.max(0, chimneyInitialOpacity - chimneyFadePerTick * age / clockTickMilliseconds);
          const visible = elapsedMilliseconds >= 0
            && age < smoke.lifetimeSeconds * 1000
            && opacity > 0;
          const ageTicks = age / clockTickMilliseconds;
          const drift = chimneyDriftAccelerationPerTickSquared * ageTicks * (ageTicks - 1) / 2;
          const scale = chimneyInitialScale + chimneyScaleChangePerTick * ageTicks;
          const centerOffset = frame.width / 2 * scale;
          const rotationStep = getChimneyRotationStep(building.instanceId, plumeIndex);
          return {
            opacity,
            positionX: baseX + drift + centerOffset,
            positionY: baseY + chimneyRisePerTick * ageTicks + centerOffset,
            rotationRadians: rotationStep * chimneyRotationStepRadians * ageTicks,
            scaleX: scale,
            scaleY: scale,
            visible,
          };
        },
      },
      frame: particleFrame,
      layerId: `chimney-smoke-${String(plumeIndex)}`,
      pixelGeometry: createPixelGeometry(baseX, baseY, smoke.anchorX, smoke.anchorY),
      textureLocalPath: smoke.textureLocalPath,
      tintColor: definition.tintColor,
      zIndex: baseZIndex + 0.01 + plumeIndex * 0.001,
    });
  });
}

function createMillAnimationEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
  definition: Extract<AnimationBuildingDefinition, { kind: "mill" }>,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const baseZIndex = getBuildingFrontZIndex(buildingEntries, building);
  const layerEntries = definition.layers.flatMap((layer) => {
    if (layer.onlyDrawIfChestHasContents === "Input" && building.animationOptions?.millLoaded !== true) {
      return [];
    }
    if (layer.frameCount <= 0 || layer.frameDurationMilliseconds <= 0) {
      throw new Error(`Mill draw layer ${JSON.stringify(layer.id)} has invalid frame count or duration.`);
    }
    const frames = Array.from({ length: layer.frameCount }, (_, frameIndex) => {
      const column = layer.framesPerRow > 0 ? frameIndex % layer.framesPerRow : frameIndex;
      const row = layer.framesPerRow > 0 ? Math.floor(frameIndex / layer.framesPerRow) : 0;
      return {
        x: layer.sourceRect.x + column * layer.sourceRect.width,
        y: layer.sourceRect.y + row * layer.sourceRect.height,
        width: layer.sourceRect.width,
        height: layer.sourceRect.height,
      };
    });
    const frame = frames[0];
    if (frame === undefined) {
      throw new Error(`Mill draw layer ${JSON.stringify(layer.id)} has no first frame.`);
    }
    return [createBuildingOverlayEntry(catalogItem, building, {
      animation: {
        kind: "frame-cycle",
        frames,
        frameDurationMilliseconds: layer.frameDurationMilliseconds,
        timeOffsetMilliseconds: 0,
      },
      frame,
      layerId: `mill-${layer.id}`,
      pixelGeometry: createPixelGeometry(
        building.x * tilePixelSize + layer.drawPositionX,
        building.y * tilePixelSize + layer.drawPositionY,
      ),
      textureLocalPath: definition.textureLocalPath,
      zIndex: baseZIndex + 0.01,
    })];
  });
  return [
    ...layerEntries,
    ...createMillOutputEntries(building, catalogItem, buildingEntries, definition, animationCatalog),
  ];
}

function createMillOutputEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
  definition: Extract<AnimationBuildingDefinition, { kind: "mill" }>,
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  if (building.animationOptions?.millOutput !== true) {
    return [];
  }
  const productId = building.animationOptions.millProduct ?? definition.defaultOutputProductId;
  const productChoice = definition.outputChoices.find((choice) => choice.id === productId);
  if (productChoice === undefined) {
    throw new TypeError(`Mill instanceId ${String(building.instanceId)} has unknown millProduct ID ${JSON.stringify(productId)}.`);
  }
  const productFrame = requireAnimationChoiceFrame(productChoice, catalogItem.id, productId);
  const productTextureLocalPath = requireAnimationChoiceTexture(productChoice, catalogItem.id, productId);
  const bubble = definition.chestBubble;
  const bubbleX = building.x * tilePixelSize + bubble.displayTileX * tilePixelSize;
  const bubbleY = building.y * tilePixelSize
    + (bubble.displayTileY - 1 - bubble.displayHeight) * tilePixelSize;
  const baseZIndex = getBuildingFrontZIndex(buildingEntries, building);
  const bubbleFrame = bubble.sourceRect;
  const entries: PlacementRenderEntry[] = [
    createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(bubbleFrame, bubbleX, bubbleY),
      frame: bubbleFrame,
      layerId: "mill-output-bubble",
      pixelGeometry: createPixelGeometry(bubbleX, bubbleY),
      textureLocalPath: bubble.textureLocalPath,
      opacity: bubble.opacity,
      zIndex: baseZIndex + 0.02,
    }),
    createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(productFrame, bubbleX + 1, bubbleY),
      frame: productFrame,
      layerId: "mill-output-product",
      pixelGeometry: createPixelGeometry(bubbleX + 1, bubbleY),
      textureLocalPath: productTextureLocalPath,
      opacity: bubble.opacity,
      zIndex: baseZIndex + 0.03,
    }),
  ];
  if (productChoice.colorOverlay === true && productChoice.overlaySourceRect !== undefined && productChoice.dyeColor !== undefined) {
    const overlayFrame = requireAnimationChoiceFrame(
      { ...productChoice, sourceRect: productChoice.overlaySourceRect },
      catalogItem.id,
      productId,
    );
    entries.push(createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(overlayFrame, bubbleX + 1, bubbleY),
      frame: overlayFrame,
      layerId: "mill-output-product-color-overlay",
      pixelGeometry: createPixelGeometry(bubbleX + 1, bubbleY),
      textureLocalPath: productTextureLocalPath,
      tintColor: formatTintColor(productChoice.dyeColor),
      opacity: bubble.opacity,
      zIndex: baseZIndex + 0.031,
    }));
  }
  return entries;
}

function createFishPondEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
  animationCatalog: AnimationCatalog,
): readonly PlacementRenderEntry[] {
  const fishId = building.animationOptions?.fishId;
  if (fishId === undefined) {
    return [];
  }
  const fishDefinition = animationCatalog.pondFishById[fishId];
  if (fishDefinition === undefined) {
    throw new TypeError(`Fish Pond building instanceId ${String(building.instanceId)} has unknown fishId ${JSON.stringify(fishId)}.`);
  }
  const fishFrame = requirePondFishFrame(fishDefinition, building);
  const fishTextureLocalPath = requirePondFishTexture(fishDefinition, building);
  const rawPopulation = building.animationOptions?.population ?? 0;
  if (!Number.isSafeInteger(rawPopulation) || rawPopulation < 0) {
    throw new TypeError(`Fish Pond population must be a non-negative safe integer; received ${String(rawPopulation)}.`);
  }
  if (rawPopulation > fishDefinition.maxPopulation) {
    throw new RangeError(`Fish Pond population for fish ${JSON.stringify(fishId)} must not exceed ${String(fishDefinition.maxPopulation)}; received ${String(rawPopulation)}.`);
  }
  const population = rawPopulation;
  const baseZIndex = getBuildingFrontZIndex(buildingEntries, building);
  const pondBaseEntry = getBuildingBaseEntry(building, buildingEntries);
  const pondBasePosition = getBuildingBasePosition(building, pondBaseEntry);
  const entries: PlacementRenderEntry[] = [];
  for (let fishIndex = 0; fishIndex < population; fishIndex += 1) {
    const initialX = pondBasePosition.positionX + 16 + ((fishIndex * 23) % 32);
    const initialY = pondBasePosition.positionY + 32 + ((fishIndex * 11) % 20);
    const flipDirection = fishIndex % 2 === 0 ? 1 : -1;
    entries.push(createBuildingOverlayEntry(catalogItem, building, {
      animation: {
        kind: "sprite-motion",
        frames: [fishFrame],
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds);
          const phase = currentTimeMilliseconds / 1350 + fishIndex * 1.7;
          const horizontalOffset = Math.sin(phase) * 8;
          const verticalOffset = Math.sin(phase * 0.7) * 4;
          return {
            positionX: initialX + horizontalOffset,
            positionY: initialY + verticalOffset,
            scaleX: flipDirection * 0.75,
            scaleY: 0.75,
            zIndex: baseZIndex + (initialY + verticalOffset) / 1000,
          };
        },
      },
      frame: fishFrame,
      layerId: `pond-fish-${String(fishIndex)}`,
      pixelGeometry: createPixelGeometry(initialX, initialY, 0.5, 0.5),
      textureLocalPath: fishTextureLocalPath,
      zIndex: baseZIndex + fishIndex * 0.001,
    }));
  }
  entries.push(...createPondProduceEntries(
    building,
    catalogItem,
    baseZIndex,
    fishDefinition.produce,
    pondBasePosition,
  ));
  return entries;
}

function createPondProduceEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  baseZIndex: number,
  produceChoices: AnimationCatalog["pondFishById"][string]["produce"],
  pondBasePosition: PlacementPixelGeometry,
): readonly PlacementRenderEntry[] {
  const selectedProduceId = building.animationOptions?.produce;
  if (selectedProduceId === undefined) {
    return [];
  }
  const population = building.animationOptions?.population ?? 0;
  const produceChoice = produceChoices.find((choice) => choice.id === selectedProduceId);
  if (produceChoice === undefined) {
    throw new TypeError(`Fish Pond instanceId ${String(building.instanceId)} has unknown produce ID ${JSON.stringify(selectedProduceId)}.`);
  }
  if (produceChoice.requiredPopulation > population) {
    return [];
  }
  const productFrame = requireAnimationChoiceFrame(produceChoice, catalogItem.id, selectedProduceId);
  const productTextureLocalPath = requireAnimationChoiceTexture(produceChoice, catalogItem.id, selectedProduceId);
  const itemLeft = pondBasePosition.positionX;
  const itemTop = pondBasePosition.positionY;
  const bubbleFrame = { x: 141, y: 465, width: 20, height: 24 };
  const entries: PlacementRenderEntry[] = [
    createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(bubbleFrame, itemLeft + 64, itemTop + 32),
      frame: bubbleFrame,
      layerId: "pond-produce-bubble",
      pixelGeometry: createPixelGeometry(itemLeft + 64, itemTop + 32),
      textureLocalPath: cursorTextureLocalPath,
      opacity: 0.75,
      zIndex: baseZIndex + 0.02,
    }),
    createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(productFrame, itemLeft + 66, itemTop + 33),
      frame: productFrame,
      layerId: "pond-produce-icon",
      pixelGeometry: createPixelGeometry(itemLeft + 66, itemTop + 33),
      textureLocalPath: productTextureLocalPath,
      opacity: 0.75,
      zIndex: baseZIndex + 0.03,
    }),
  ];
  if (
    produceChoice.colorOverlay === true
    && produceChoice.overlaySourceRect !== undefined
    && produceChoice.dyeColor !== undefined
  ) {
    const overlayFrame = requireAnimationChoiceFrame(
      { ...produceChoice, sourceRect: produceChoice.overlaySourceRect },
      catalogItem.id,
      selectedProduceId,
    );
    entries.push(createBuildingOverlayEntry(catalogItem, building, {
      animation: createVerticalBobMotion(overlayFrame, itemLeft + 66, itemTop + 33),
      frame: overlayFrame,
      layerId: "pond-produce-color-overlay",
      pixelGeometry: createPixelGeometry(itemLeft + 66, itemTop + 33),
      textureLocalPath: productTextureLocalPath,
      tintColor: formatTintColor(produceChoice.dyeColor),
      opacity: 0.75,
      zIndex: baseZIndex + 0.031,
    }));
  }
  return entries;
}

function createGoldClockEntries(
  building: PlacementBuilding,
  catalogItem: CatalogItem,
  buildingEntries: readonly PlacementRenderEntry[],
): readonly PlacementRenderEntry[] {
  const baseZIndex = getBuildingFrontZIndex(buildingEntries, building);
  const baseEntry = getBuildingBaseEntry(building, buildingEntries);
  const basePosition = getBuildingBasePosition(building, baseEntry);
  const frameHeight = baseEntry.frame?.height;
  if (frameHeight === undefined || frameHeight <= 0) {
    throw new Error(`Gold Clock building instanceId ${String(building.instanceId)} requires a positive base frame height.`);
  }
  const overhang = frameHeight - catalogItem.tileSize.height * tilePixelSize;
  const baseX = basePosition.positionX;
  const baseY = basePosition.positionY;
  if (building.animationOptions?.clockOff === true) {
    const frame = { x: 498, y: 368, width: 13, height: 9 };
    return [createBuildingOverlayEntry(catalogItem, building, {
      frame,
      layerId: "gold-clock-off-mark",
      pixelGeometry: createPixelGeometry(baseX + 17, baseY + overhang - 14),
      textureLocalPath: cursor16TextureLocalPath,
      zIndex: baseZIndex + 0.01,
    })];
  }
  const hourFrame = { x: 369, y: 399, width: 5, height: 9 };
  const minuteFrame = { x: 363, y: 395, width: 5, height: 13 };
  return [
    createBuildingOverlayEntry(catalogItem, building, {
      animation: {
        kind: "sprite-motion",
        frames: [hourFrame],
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds);
          return { rotationRadians: getGoldClockHandRotation(currentTimeMilliseconds).hour };
        },
      },
      frame: hourFrame,
      layerId: "gold-clock-hour-hand",
      pixelGeometry: createPixelGeometry(baseX + 23, baseY + overhang - 10, 0.5, 8 / 9, 0.75),
      textureLocalPath: cursorTextureLocalPath,
      zIndex: baseZIndex + 0.01,
    }),
    createBuildingOverlayEntry(catalogItem, building, {
      animation: {
        kind: "sprite-motion",
        frames: [minuteFrame],
        sample: (currentTimeMilliseconds) => {
          assertAnimationTime(currentTimeMilliseconds);
          return { rotationRadians: getGoldClockHandRotation(currentTimeMilliseconds).minute };
        },
      },
      frame: minuteFrame,
      layerId: "gold-clock-minute-hand",
      pixelGeometry: createPixelGeometry(baseX + 23, baseY + overhang - 10, 0.5, 12 / 13, 0.75),
      textureLocalPath: cursorTextureLocalPath,
      zIndex: baseZIndex + 0.02,
    }),
    createBuildingOverlayEntry(catalogItem, building, {
      frame: { x: 375, y: 404, width: 4, height: 4 },
      layerId: "gold-clock-hand-pivot",
      pixelGeometry: createPixelGeometry(baseX + 23, baseY + overhang - 10, 0.5, 0.5),
      textureLocalPath: cursorTextureLocalPath,
      zIndex: baseZIndex + 0.03,
    }),
  ];
}

function getBuildingBaseEntry(
  building: PlacementBuilding,
  buildingEntries: readonly PlacementRenderEntry[],
): PlacementRenderEntry {
  const baseEntry = buildingEntries.find((entry) => entry.frame !== null && entry.pixelGeometry !== undefined);
  if (baseEntry === undefined) {
    throw new Error(`Building animation for ${JSON.stringify(building.buildingId)} instanceId ${String(building.instanceId)} requires a base render entry with pixel geometry.`);
  }
  return baseEntry;
}

function getBuildingBasePosition(
  building: PlacementBuilding,
  baseEntry: PlacementRenderEntry,
): PlacementPixelGeometry {
  const pixelGeometry = baseEntry.pixelGeometry;
  if (pixelGeometry === undefined) {
    throw new Error(`Building animation for ${JSON.stringify(building.buildingId)} instanceId ${String(building.instanceId)} requires base pixel geometry.`);
  }
  return pixelGeometry;
}

function getChimneyRotationStep(buildingInstanceId: number, plumeIndex: number): number {
  let seed = Math.imul(buildingInstanceId ^ ((plumeIndex + 1) * 0x45d9f3b), 0x27d4eb2d);
  seed ^= seed >>> 15;
  seed = Math.imul(seed, 0x85ebca6b);
  seed ^= seed >>> 13;
  return (seed >>> 0) % 11 - 5;
}

function getGoldClockHandRotation(currentTimeMilliseconds: number): Readonly<{ hour: number; minute: number }> {
  const gameMinutesElapsed = Math.max(0, Math.floor(currentTimeMilliseconds / goldClockDayMilliseconds));
  let gameTime = goldClockStartGameTime + 10 * gameMinutesElapsed;
  if (gameTime >= goldClockWrapStart + goldClockWrapDuration) {
    gameTime = goldClockWrapStart + (gameTime - goldClockWrapStart) % goldClockWrapDuration;
  }
  const convertedGameTime = Math.floor(gameTime / 60) * 100 + gameTime % 60;
  const dayFraction = currentTimeMilliseconds % goldClockDayMilliseconds / goldClockDayMilliseconds;
  const roundToHundredth = (value: number) => Math.round(value * 100) / 100;
  return {
    hour: roundToHundredth(Math.PI * 2 * (convertedGameTime % 1200 / 1200) + dayFraction / 23),
    minute: roundToHundredth(Math.PI * 2 * (convertedGameTime % 1000 % 100 % 60 / 60) + dayFraction * 1.02),
  };
}

function createBuildingOverlayEntry(
  catalogItem: CatalogItem,
  building: PlacementBuilding,
  options: Readonly<{
    animation?: PlacementRenderAnimation;
    frame: Exclude<PlacementRenderFrame, null>;
    layerId: string;
    opacity?: number;
    pixelGeometry: PlacementPixelGeometry;
    textureLocalPath: string;
    tintColor?: string;
    zIndex: number;
  }>,
): PlacementRenderEntry {
  return {
    animation: options.animation,
    catalogItem,
    effectiveFootprint: catalogItem.tileSize,
    frame: options.frame,
    key: `building:${String(building.instanceId)}`,
    layerId: options.layerId,
    ...(options.opacity === undefined ? {} : { opacity: options.opacity }),
    pixelGeometry: options.pixelGeometry,
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: false,
    textureLocalPath: options.textureLocalPath,
    tileX: building.x,
    tileY: building.y,
    ...(options.tintColor === undefined ? {} : { tintColor: options.tintColor }),
    zIndex: options.zIndex,
  };
}

function getBuildingFrontZIndex(
  buildingEntries: readonly PlacementRenderEntry[],
  building: PlacementBuilding,
): number {
  return buildingEntries.reduce(
    (maximum, entry) => Math.max(maximum, entry.zIndex ?? (entry.tileY + 1) * 2),
    (building.y + 1) * 2,
  );
}

function getCatalogFrame(catalogItem: CatalogItem): PlacementRenderFrame {
  if (catalogItem.sprite.kind === "source-rect") {
    return catalogItem.sprite.width <= 0 || catalogItem.sprite.height <= 0
      ? null
      : { x: catalogItem.sprite.x, y: catalogItem.sprite.y, width: catalogItem.sprite.width, height: catalogItem.sprite.height };
  }
  const spriteIndex = catalogItem.sprite.index;
  if (catalogItem.textureLocalPath.endsWith(springObjectsTextureSuffix)) {
    return { x: (spriteIndex % 24) * 16, y: Math.floor(spriteIndex / 24) * 16, width: 16, height: 16 };
  }
  throw new Error(`Building animation cannot read sprite index for ${JSON.stringify(catalogItem.id)} from ${JSON.stringify(catalogItem.textureLocalPath)}.`);
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
      return { positionX, positionY: positionY + bubbleOffset };
    },
  };
}

function requirePondFishFrame(
  fishDefinition: AnimationCatalog["pondFishById"][string],
  building: PlacementBuilding,
): Exclude<PlacementRenderFrame, null> {
  const frame = fishDefinition.sourceRect;
  if (frame === undefined) {
    throw new Error(`Fish Pond instanceId ${String(building.instanceId)} fish ${JSON.stringify(fishDefinition.id)} has no locked sprite source rectangle.`);
  }
  assertSourceRect(frame, `Fish Pond fish ${JSON.stringify(fishDefinition.id)}`);
  return { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
}

function requirePondFishTexture(
  fishDefinition: AnimationCatalog["pondFishById"][string],
  building: PlacementBuilding,
): string {
  if (fishDefinition.textureLocalPath === undefined || fishDefinition.textureLocalPath.trim() === "") {
    throw new Error(`Fish Pond instanceId ${String(building.instanceId)} fish ${JSON.stringify(fishDefinition.id)} has no locked sprite texture path.`);
  }
  return fishDefinition.textureLocalPath;
}

function requireAnimationChoiceFrame(
  animationChoice: AnimationCatalog["machineOutputsById"][string][number],
  catalogItemId: string,
  productId: string,
): Exclude<PlacementRenderFrame, null>;
function requireAnimationChoiceFrame(
  animationChoice: AnimationCatalog["pondFishById"][string]["produce"][number],
  catalogItemId: string,
  productId: string,
): Exclude<PlacementRenderFrame, null>;
function requireAnimationChoiceFrame(
  animationChoice: Readonly<{ sourceRect?: Readonly<{ x: number; y: number; width: number; height: number }> }>,
  catalogItemId: string,
  productId: string,
): Exclude<PlacementRenderFrame, null> {
  const frame = animationChoice.sourceRect;
  if (frame === undefined) {
    throw new Error(`Animation output for ${JSON.stringify(catalogItemId)} product ${JSON.stringify(productId)} has no locked product source rectangle.`);
  }
  assertSourceRect(frame, `Animation output ${JSON.stringify(catalogItemId)} product ${JSON.stringify(productId)}`);
  return { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
}

function requireAnimationChoiceTexture(
  animationChoice: AnimationCatalog["machineOutputsById"][string][number],
  catalogItemId: string,
  productId: string,
): string;
function requireAnimationChoiceTexture(
  animationChoice: AnimationCatalog["pondFishById"][string]["produce"][number],
  catalogItemId: string,
  productId: string,
): string;
function requireAnimationChoiceTexture(
  animationChoice: Readonly<{ textureLocalPath?: string }>,
  catalogItemId: string,
  productId: string,
): string {
  if (animationChoice.textureLocalPath === undefined || animationChoice.textureLocalPath.trim() === "") {
    throw new Error(`Animation output for ${JSON.stringify(catalogItemId)} product ${JSON.stringify(productId)} has no locked product texture path.`);
  }
  return animationChoice.textureLocalPath;
}

function assertSourceRect(
  frame: Readonly<{ x: number; y: number; width: number; height: number }>,
  sourceLabel: string,
): void {
  if (
    !Number.isSafeInteger(frame.x) || frame.x < 0 ||
    !Number.isSafeInteger(frame.y) || frame.y < 0 ||
    !Number.isSafeInteger(frame.width) || frame.width <= 0 ||
    !Number.isSafeInteger(frame.height) || frame.height <= 0
  ) {
    throw new RangeError(`${sourceLabel} has invalid source rectangle ${JSON.stringify(frame)}.`);
  }
}

function formatTintColor(tintColor: number): string {
  if (!Number.isSafeInteger(tintColor) || tintColor < 0 || tintColor > 0xffffff) {
    throw new RangeError(`Animation product tint must be a 24-bit integer; received ${String(tintColor)}.`);
  }
  return `#${tintColor.toString(16).padStart(6, "0")}`;
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

function assertAnimationTime(currentTimeMilliseconds: number): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    throw new RangeError(`Building animation time must be a finite non-negative number; received ${String(currentTimeMilliseconds)}.`);
  }
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function assertNeverBuildingDefinition(definition: never): never {
  throw new TypeError(`Building animation definition has unsupported kind ${JSON.stringify((definition as { kind: string }).kind)}.`);
}
