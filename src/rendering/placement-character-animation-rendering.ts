import type {
  AnimationCatalog,
  AnimationControlDefinition,
  AnimationFarmAnimalDefinition,
  AnimationPetDefinition,
  AnimationSourceRect,
} from "../animations/animation-catalog";
import {
  getAnimationControlsForCatalogItem,
  getPetHatRenderDescriptor,
  getStableHorseHatRenderDescriptor,
} from "../animations/animation-catalog";
import { isGiantCropCatalogItemId } from "../catalog";
import type { CatalogItem, CatalogSeason } from "../catalog";
import type {
  PlacementBuilding,
  PlacementCrop,
  PlacementItem,
} from "../placement/placement-snapshot";
import { getMapPlacementCapabilities } from "../placement/map-placement-grids";
import type { MapPlacementGrid, MapTileCoordinates } from "../placement/map-placement-grids";
import type {
  PlacementPixelGeometry,
  PlacementRenderAnimation,
  PlacementRenderEntry,
  PlacementRenderFrame,
  PlacementSpriteMotionSample,
} from "./placement-rendering";

const plannerTilePixelSize = 16;
const maximumAnimalRouteNodes = 200;
const maximumJunimoRouteNodes = 100;
const maximumFarmAnimalTargets = 3;
const maximumJunimoTargets = 3;
const maximumJunimoRadiusInTiles = 8;
const routeDirections: readonly MapTileCoordinates[] = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];
const junimoBrightColors = [
  16_711_680,
  14_329_120,
  16_776_960,
  65_280,
  65_460,
  25_855,
  9_662_683,
  16_416_882,
] as const;
const junimoRegularColors = [
  3_329_330,
  16_753_920,
  9_498_256,
  13_808_780,
  11_403_055,
  8_190_976,
  10_025_880,
  4_251_856,
] as const;
const prismaticColors = [
  [255, 0, 0],
  [255, 120, 0],
  [255, 217, 0],
  [0, 255, 0],
  [0, 255, 255],
  [238, 130, 238],
] as const;
const prismaticColorStepMilliseconds = 1_500;

export type PlacementBuildingCharacterRenderInput = Readonly<{
  animationCatalog: AnimationCatalog;
  building: PlacementBuilding;
  buildingCatalogItem: CatalogItem;
  buildingEntries: readonly PlacementRenderEntry[];
  placementBuildings: readonly PlacementBuilding[];
  placementItems: readonly PlacementItem[];
  catalogItemsById: ReadonlyMap<string, CatalogItem>;
  mapPlacementGrid: MapPlacementGrid;
  season: CatalogSeason;
  isNightMode: boolean;
  placementCrops: readonly PlacementCrop[];
}>;

type TileKey = string;

type WalkabilityContext = Readonly<{
  blockedTileKeys: ReadonlySet<TileKey>;
  hostTileKeys: ReadonlySet<TileKey>;
  hostBuilding: PlacementBuilding;
  hostFootprint: Readonly<{ width: number; height: number }>;
  mapPlacementGrid: MapPlacementGrid;
}>;

type ReachableTile = Readonly<{
  tile: MapTileCoordinates;
  parentKey: TileKey | null;
  distance: number;
}>;

type RouteMotionSample = Readonly<{
  positionX: number;
  positionY: number;
  direction: "up" | "right" | "down" | "left";
  walkStep: number;
}>;

type FrameLookup = Readonly<{
  frames: readonly Exclude<PlacementRenderFrame, null>[];
  animationIndexByRawFrame: ReadonlyMap<number, number>;
}>;

type CharacterEntryInput = Readonly<{
  catalogItem: CatalogItem;
  building: PlacementBuilding;
  layerId: string;
  frameLookup: FrameLookup;
  textureLocalPath: string;
  pixelGeometry: PlacementPixelGeometry;
  sample: (currentTimeMilliseconds: number) => PlacementSpriteMotionSample;
  tintColor?: string;
  zIndex: number;
}>;

export function createPlacementBuildingCharacterRenderEntries(
  input: PlacementBuildingCharacterRenderInput,
): readonly PlacementRenderEntry[] {
  assertCharacterRenderInput(input);
  const animationDefinition = input.animationCatalog.buildingAnimationsById[
    input.buildingCatalogItem.id
  ];

  if (animationDefinition?.kind === "stable-horse") {
    return createStableHorseEntries(input);
  }
  if (animationDefinition?.kind === "junimo-hut") {
    return createJunimoEntries(input, animationDefinition);
  }
  if (animationDefinition?.kind === "pet-bowl") {
    return createPetEntries(input);
  }
  return createFarmAnimalEntries(input);
}

function assertCharacterRenderInput(
  input: PlacementBuildingCharacterRenderInput,
): void {
  if (input.buildingCatalogItem.id !== `building:${input.building.buildingId}`) {
    throw new TypeError(
      `Character renderer buildingCatalogItem.id must match building:${input.building.buildingId}; received ${JSON.stringify(input.buildingCatalogItem.id)}.`,
    );
  }
  assertTileCoordinate(input.building, `building instanceId ${String(input.building.instanceId)}`);
  if (typeof input.isNightMode !== "boolean") {
    throw new TypeError(
      `Character renderer isNightMode must be boolean; received ${describeValue(input.isNightMode)}.`,
    );
  }
  if (input.season !== "spring" && input.season !== "summer" && input.season !== "fall" && input.season !== "winter") {
    throw new TypeError(
      `Character renderer season must be a supported season; received ${describeValue(input.season)}.`,
    );
  }
  assertMapGrid(input.mapPlacementGrid);
  assertFootprint(input.buildingCatalogItem.tileSize, input.buildingCatalogItem.id);
}

function createFarmAnimalEntries(
  input: PlacementBuildingCharacterRenderInput,
): readonly PlacementRenderEntry[] {
  const animalListControl = getAnimationControlsForCatalogItem(
    input.animationCatalog,
    input.buildingCatalogItem.id,
  ).find((controlDefinition) =>
    controlDefinition.kind === "animalList" && controlDefinition.key === "animals"
  );
  if (animalListControl?.kind !== "animalList") {
    return [];
  }
  const selectedAnimals = input.building.animationOptions?.animals ?? [];
  assertFarmAnimalSelections(input, animalListControl, selectedAnimals);
  if (input.isNightMode || selectedAnimals.length === 0) {
    return [];
  }

  const walkabilityContext = createWalkabilityContext(input);
  const spawnTile = findHostPerimeterSpawnTile(walkabilityContext);
  if (spawnTile === null) {
    throw new RangeError(
      `Farm animal building ${JSON.stringify(input.building.buildingId)} instanceId ${String(input.building.instanceId)} has no passable perimeter tile in ${String(input.mapPlacementGrid.width)}x${String(input.mapPlacementGrid.height)} map grid.`,
    );
  }
  return selectedAnimals.map((animalSelection, animalIndex) => {
    const animalDefinition = input.animationCatalog.farmAnimalsById[animalSelection.animalId];
    if (animalDefinition === undefined) {
      throw new RangeError(
        `Farm animal building ${JSON.stringify(input.building.buildingId)} instanceId ${String(input.building.instanceId)} has unknown animalId ${JSON.stringify(animalSelection.animalId)}.`,
      );
    }
    const swimOffsetY = getFarmAnimalSwimOffsetY(animalDefinition);
    const reachableTiles = findReachableTiles(
      walkabilityContext,
      spawnTile,
      maximumAnimalRouteNodes,
      false,
      swimOffsetY !== null,
    );
    const grassRoutes = findFarmAnimalGrassRoutes(input, walkabilityContext, reachableTiles, spawnTile);
    const fallbackRoute = findBoundedRoamRoute(reachableTiles, spawnTile);
    const route = grassRoutes.length === 0
      ? fallbackRoute
      : grassRoutes[animalIndex % grassRoutes.length] ?? fallbackRoute;
    return createFarmAnimalEntry(input, animalDefinition, swimOffsetY, route, animalIndex);
  });
}

function assertFarmAnimalSelections(
  input: PlacementBuildingCharacterRenderInput,
  animalListControl: Extract<AnimationControlDefinition, { kind: "animalList" }>,
  selectedAnimals: readonly Readonly<{ animalId: string }>[],
): void {
  if (selectedAnimals.length > animalListControl.maxCount) {
    throw new RangeError(
      `Farm animal building ${JSON.stringify(input.building.buildingId)} allows at most ${String(animalListControl.maxCount)} animals; received ${String(selectedAnimals.length)}.`,
    );
  }
  const availableAnimalIds = new Set(animalListControl.choices.map((choice) => choice.id));
  const buildingTier = getAnimalBuildingTier(input.building.buildingId);
  for (const animalSelection of selectedAnimals) {
    const animalDefinition = input.animationCatalog.farmAnimalsById[animalSelection.animalId];
    if (animalDefinition === undefined || !availableAnimalIds.has(animalSelection.animalId)) {
      throw new RangeError(
        `Farm animal building ${JSON.stringify(input.building.buildingId)} does not support animalId ${JSON.stringify(animalSelection.animalId)}.`,
      );
    }
    if (animalDefinition.requiredBuilding !== null) {
      const requiredTier = getAnimalBuildingTier(animalDefinition.requiredBuilding);
      if (buildingTier < requiredTier) {
        throw new RangeError(
          `Farm animalId ${JSON.stringify(animalSelection.animalId)} requires ${JSON.stringify(animalDefinition.requiredBuilding)}; placed building is ${JSON.stringify(input.building.buildingId)}.`,
        );
      }
    }
  }
}

function getAnimalBuildingTier(buildingId: string): number {
  const buildingTiers: Readonly<Record<string, number>> = {
    Coop: 1,
    "Big Coop": 2,
    "Deluxe Coop": 3,
    Barn: 1,
    "Big Barn": 2,
    "Deluxe Barn": 3,
  };
  const buildingTier = buildingTiers[buildingId];
  if (buildingTier === undefined) {
    throw new RangeError(
      `Farm animal building tier is undefined for buildingId ${JSON.stringify(buildingId)}.`,
    );
  }
  return buildingTier;
}

function findFarmAnimalGrassRoutes(
  input: PlacementBuildingCharacterRenderInput,
  walkabilityContext: WalkabilityContext,
  reachableTiles: ReadonlyMap<TileKey, ReachableTile>,
  spawnTile: MapTileCoordinates,
): readonly (readonly MapTileCoordinates[])[] {
  const grassTiles = uniqueTiles(input.placementItems
    .filter((placementItem) => placementItem.isGrass)
    .map((placementItem) => ({ x: placementItem.x, y: placementItem.y })));
  const reachableGrassTiles = grassTiles
    .filter((grassTile) => reachableTiles.has(createTileKey(grassTile)))
    .sort(compareTilesByDistanceFrom(reachableTiles, spawnTile))
    .slice(0, maximumFarmAnimalTargets);
  const grassRoutes = reachableGrassTiles.map((grassTile) =>
    createLoopingRoute(reconstructPath(reachableTiles, grassTile))
  );
  if (grassRoutes.length > 0) {
    return grassRoutes;
  }
  if (walkabilityContext.hostTileKeys.has(createTileKey(spawnTile))) {
    throw new Error(
      `Farm animal spawn tile ${formatTile(spawnTile)} unexpectedly overlaps its host building perimeter.`,
    );
  }
  return [];
}

function findBoundedRoamRoute(
  reachableTiles: ReadonlyMap<TileKey, ReachableTile>,
  spawnTile: MapTileCoordinates,
): readonly MapTileCoordinates[] {
  const roamTarget = [...reachableTiles.values()]
    .filter((reachableTile) => reachableTile.distance > 0)
    .sort((leftTile, rightTile) =>
      rightTile.distance - leftTile.distance || compareTiles(leftTile.tile, rightTile.tile)
    )[0];
  if (roamTarget === undefined) {
    return [spawnTile];
  }
  return createLoopingRoute(reconstructPath(reachableTiles, roamTarget.tile));
}

function createFarmAnimalEntry(
  input: PlacementBuildingCharacterRenderInput,
  animalDefinition: AnimationFarmAnimalDefinition,
  swimOffsetY: number | null,
  route: readonly MapPlacementCoordinates[],
  animalIndex: number,
): PlacementRenderEntry {
  const frameLookup = createFarmAnimalFrameLookup(animalDefinition);
  const timeOffsetMilliseconds = getStableOffsetMilliseconds(
    `${animalDefinition.id}:${String(input.building.instanceId)}:${String(animalIndex)}`,
    1_400,
  );
  const sample = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
    const routeMotion = sampleRoute(route, currentTimeMilliseconds + timeOffsetMilliseconds, 533.3333333333, 175);
    const rawFrame = getFarmAnimalWalkFrame(animalDefinition, routeMotion.direction, routeMotion.walkStep);
    const animationFrame = isWaterPosition(
      input.mapPlacementGrid,
      routeMotion.positionX,
      routeMotion.positionY,
    )
      ? requireFrameIndex(frameLookup, rawFrame + 16, `swimming farm animal ${animalDefinition.id}`)
      : requireFrameIndex(frameLookup, rawFrame, `farm animal ${animalDefinition.id}`);
    return {
      frameIndex: animationFrame,
      positionX: routeMotion.positionX,
      positionY: routeMotion.positionY,
      scaleX: routeMotion.direction === "left" && animalDefinition.useFlippedRightForLeft ? -1 : 1,
      zIndex: getCharacterZIndex(routeMotion.positionY, animalDefinition.spriteHeight),
    };
  };
  const initialSample = sample(0);
  return createCharacterEntry({
    catalogItem: input.buildingCatalogItem,
    building: input.building,
    layerId: `farm-animal-${String(animalIndex)}-${animalDefinition.id}`,
    frameLookup,
    textureLocalPath: animalDefinition.textureLocalPath,
    pixelGeometry: createPixelGeometry(
      initialSample.positionX ?? 0,
      initialSample.positionY ?? 0,
      0.5,
      0.875,
      undefined,
      initialSample.scaleX === -1 ? -1 : 1,
    ),
    sample,
    zIndex: initialSample.zIndex ?? getCharacterZIndex((route[0]?.y ?? 0) * plannerTilePixelSize, animalDefinition.spriteHeight),
  });
}

function getFarmAnimalWalkFrame(
  animalDefinition: AnimationFarmAnimalDefinition,
  direction: RouteMotionSample["direction"],
  walkStep: number,
): number {
  const animalWalkStep = walkStep % 4;
  if (direction === "up") {
    return 8 + animalWalkStep;
  }
  if (direction === "right") {
    return 4 + animalWalkStep;
  }
  if (direction === "down") {
    return animalWalkStep;
  }
  return animalDefinition.useFlippedRightForLeft ? 4 + animalWalkStep : 12 + animalWalkStep;
}

function createFarmAnimalFrameLookup(
  animalDefinition: AnimationFarmAnimalDefinition,
): FrameLookup {
  const animalFrameNumbers = Array.from({ length: 16 }, (_, frameIndex) => frameIndex);
  const landFrames = animalFrameNumbers.map((rawFrame) => createSpriteSheetFrame(
    rawFrame,
    4,
    animalDefinition.spriteWidth,
    animalDefinition.spriteHeight,
  ));
  const swimOffsetY = getFarmAnimalSwimOffsetY(animalDefinition);
  const swimFrames = swimOffsetY === null
    ? []
    : animalFrameNumbers.map((rawFrame) => {
      const landFrame = createSpriteSheetFrame(
        rawFrame,
        4,
        animalDefinition.spriteWidth,
        animalDefinition.spriteHeight,
      );
      return { ...landFrame, y: landFrame.y + swimOffsetY };
    });
  const frames = [...landFrames, ...swimFrames];
  return {
    frames,
    animationIndexByRawFrame: new Map([
      ...animalFrameNumbers.map((rawFrame) => [rawFrame, rawFrame] as const),
      ...animalFrameNumbers.map((rawFrame) => [rawFrame + 16, rawFrame + 16] as const),
    ]),
  };
}

function getFarmAnimalSwimOffsetY(
  animalDefinition: AnimationFarmAnimalDefinition,
): number | null {
  if (!animalDefinition.canSwim) {
    return null;
  }
  if (animalDefinition.id !== "Duck") {
    throw new RangeError(
      `Farm animal ${JSON.stringify(animalDefinition.id)} canSwim without a verified swim-sheet offset.`,
    );
  }
  return 112;
}

function isWaterPosition(
  mapPlacementGrid: MapPlacementGrid,
  positionX: number,
  positionY: number,
): boolean {
  const tile = {
    x: Math.floor(positionX / plannerTilePixelSize),
    y: Math.floor(positionY / plannerTilePixelSize),
  };
  return getMapPlacementCapabilities(mapPlacementGrid, tile).water === true;
}

function createPetEntries(
  input: PlacementBuildingCharacterRenderInput,
): readonly PlacementRenderEntry[] {
  const petId = input.building.animationOptions?.petId;
  if (petId === undefined) {
    return [];
  }
  const controls = getAnimationControlsForCatalogItem(input.animationCatalog, input.buildingCatalogItem.id, { petId });
  const petControl = controls.find((controlDefinition) =>
    controlDefinition.kind === "select" && controlDefinition.key === "petId"
  );
  if (petControl?.kind !== "select" || !petControl.choices.some((choice) => choice.id === petId)) {
    throw new RangeError(
      `Pet bowl building ${JSON.stringify(input.building.buildingId)} does not support petId ${JSON.stringify(petId)}.`,
    );
  }
  const petDefinition = input.animationCatalog.petsById[petId];
  if (petDefinition === undefined) {
    throw new RangeError(`Pet bowl received unknown petId ${JSON.stringify(petId)}.`);
  }
  const hatId = input.building.animationOptions?.hatId;
  const hatControl = controls.find((controlDefinition) =>
    controlDefinition.kind === "select" && controlDefinition.key === "hatId"
  );
  if (hatId !== undefined && hatControl?.kind !== "select") {
    throw new RangeError(
      `Pet bowl petId ${JSON.stringify(petId)} cannot use configured hatId ${JSON.stringify(hatId)}.`,
    );
  }
  if (hatId !== undefined && hatControl?.kind === "select" && !hatControl.choices.some((choice) => choice.id === hatId)) {
    throw new RangeError(
      `Pet bowl has unknown hatId ${JSON.stringify(hatId)} for petId ${JSON.stringify(petId)}.`,
    );
  }
  const walkabilityContext = createWalkabilityContext(input);
  const petSpawnTile = { x: input.building.x, y: input.building.y + 1 };
  assertWalkableStart(walkabilityContext, petSpawnTile, true, `Pet bowl instanceId ${String(input.building.instanceId)}`);
  const reachableTiles = findReachableTiles(walkabilityContext, petSpawnTile, maximumAnimalRouteNodes, true);
  const route = findPetRoamRoute(reachableTiles, petSpawnTile, petId, walkabilityContext.hostTileKeys);
  const petFrames = createPetFrameLookup(petDefinition);
  const samplePetRoute = createExitThenOutdoorLoopRouteSampler(
    route,
    walkabilityContext.hostTileKeys,
    getMillisecondsPerTile(petDefinition.walk.moveSpeed < 0 ? petDefinition.moveSpeed : petDefinition.walk.moveSpeed),
    getPetWalkFrameDuration(petDefinition),
  );
  const samplePet = (currentTimeMilliseconds: number): Readonly<{
    frameIndex: number;
    flipped: boolean;
    positionX: number;
    positionY: number;
    zIndex: number;
  }> => {
    assertAnimationTime(currentTimeMilliseconds);
    if (input.isNightMode) {
      const sleepFrame = 28 + Math.floor(currentTimeMilliseconds / 1_000) % 2;
      return {
        frameIndex: sleepFrame,
        flipped: (getStableOffsetMilliseconds(petId, 2) & 1) === 1,
        positionX: input.building.x * plannerTilePixelSize,
        positionY: (input.building.y + 1) * plannerTilePixelSize - 20,
        zIndex: getCharacterZIndex((input.building.y + 1) * plannerTilePixelSize, petDefinition.spriteFrameHeight),
      };
    }
    const routeMotion = samplePetRoute(currentTimeMilliseconds);
    const rawFrame = getPetWalkFrame(petDefinition, routeMotion.direction, routeMotion.walkStep);
    return {
      frameIndex: rawFrame,
      flipped: false,
      positionX: routeMotion.positionX,
      positionY: routeMotion.positionY - 20,
      zIndex: getCharacterZIndex(routeMotion.positionY, petDefinition.spriteFrameHeight),
    };
  };
  const bodySample = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
    const petMotion = samplePet(currentTimeMilliseconds);
    return {
      frameIndex: petMotion.frameIndex,
      positionX: petMotion.positionX,
      positionY: petMotion.positionY,
      scaleX: petMotion.flipped ? -1 : 1,
      zIndex: petMotion.zIndex,
    };
  };
  const bodyInitialSample = samplePet(0);
  const petBodyEntry = createCharacterEntry({
    catalogItem: input.buildingCatalogItem,
    building: input.building,
    layerId: `pet-body-${petId}`,
    frameLookup: petFrames,
    textureLocalPath: petDefinition.textureLocalPath,
    pixelGeometry: createPixelGeometry(
      bodyInitialSample.positionX,
      bodyInitialSample.positionY,
      0,
      0,
      undefined,
      bodyInitialSample.flipped ? -1 : 1,
    ),
    sample: bodySample,
    zIndex: bodyInitialSample.zIndex,
  });
  if (hatId === undefined) {
    return [petBodyEntry];
  }
  const hatEntry = createPetHatEntry(input, petDefinition, hatId, samplePet);
  return [petBodyEntry, hatEntry];
}

function findPetRoamRoute(
  reachableTiles: ReadonlyMap<TileKey, ReachableTile>,
  spawnTile: MapTileCoordinates,
  petId: string,
  hostTileKeys: ReadonlySet<TileKey>,
): readonly MapPlacementCoordinates[] {
  const roamTiles = [...reachableTiles.values()]
    .filter((reachableTile) =>
      reachableTile.distance > 0 && !hostTileKeys.has(createTileKey(reachableTile.tile))
    )
    .sort((leftTile, rightTile) =>
      leftTile.distance - rightTile.distance || compareTiles(leftTile.tile, rightTile.tile)
    );
  if (roamTiles.length === 0) {
    return [spawnTile];
  }
  const targetIndex = getStableOffsetMilliseconds(petId, roamTiles.length) % roamTiles.length;
  const selectedTarget = roamTiles[targetIndex];
  if (selectedTarget === undefined) {
    throw new Error(`Pet route could not select reachable target index ${String(targetIndex)} from ${String(roamTiles.length)} tiles.`);
  }
  return reconstructPath(reachableTiles, selectedTarget.tile);
}

function createPetHatEntry(
  input: PlacementBuildingCharacterRenderInput,
  petDefinition: AnimationPetDefinition,
  hatId: string,
  samplePet: (currentTimeMilliseconds: number) => Readonly<{
    frameIndex: number;
    flipped: boolean;
    positionX: number;
    positionY: number;
    zIndex: number;
  }>,
): PlacementRenderEntry {
  const rawBodyFrames = [...new Set([
    ...Object.values(petDefinition.walk.frameIndicesByDirection).flat(),
    28,
    29,
  ])];
  const hatDescriptorByPetPose = new Map<string, ReturnType<typeof getPetHatRenderDescriptor>>();
  const hatFrameIndexByPetPose = new Map<string, number>();
  const uniqueHatFrames = new Map<string, Exclude<PlacementRenderFrame, null>>();
  for (const bodyFrameIndex of rawBodyFrames) {
    for (const flipped of [false, true]) {
      const petPoseKey = createPetPoseKey(bodyFrameIndex, flipped);
      const hatDescriptor = getPetHatRenderDescriptor(
        input.animationCatalog,
        petDefinition.id,
        hatId,
        bodyFrameIndex,
        flipped,
      );
      const hatFrameKey = createRectKey(hatDescriptor.sourceRect);
      hatDescriptorByPetPose.set(petPoseKey, hatDescriptor);
      uniqueHatFrames.set(hatFrameKey, hatDescriptor.sourceRect);
      hatFrameIndexByPetPose.set(
        petPoseKey,
        hatFrameLookupIndex(uniqueHatFrames, hatDescriptor.sourceRect),
      );
    }
  }
  const hatFrames = [...uniqueHatFrames.values()];
  const hatFrameLookup: FrameLookup = {
    frames: hatFrames,
    animationIndexByRawFrame: new Map(hatFrames.map((_, frameIndex) => [frameIndex, frameIndex])),
  };
  const initialPetMotion = samplePet(0);
  const sampleHat = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
    const petMotion = samplePet(currentTimeMilliseconds);
    const petPoseKey = createPetPoseKey(petMotion.frameIndex, petMotion.flipped);
    const hatDescriptor = hatDescriptorByPetPose.get(petPoseKey);
    if (hatDescriptor === undefined) {
      throw new Error(`Pet hat ${JSON.stringify(hatId)} has no descriptor for pose ${petPoseKey}.`);
    }
    const hatFrameIndex = hatFrameIndexByPetPose.get(petPoseKey);
    if (hatFrameIndex === undefined) {
      throw new Error(`Pet hat ${JSON.stringify(hatId)} has no atlas frame for pose ${petPoseKey}.`);
    }
    return {
      frameIndex: hatFrameIndex,
      positionX: petMotion.positionX + hatDescriptor.offsetXInTiles,
      positionY: petMotion.positionY + 20 + hatDescriptor.offsetYInTiles,
      scaleX: petMotion.flipped ? -hatDescriptor.scaleFactor : hatDescriptor.scaleFactor,
      scaleY: hatDescriptor.scaleFactor,
      tintColor: getPrismaticTint(input.animationCatalog, `hat:${hatId}`, currentTimeMilliseconds),
      zIndex: petMotion.zIndex + 0.01,
    };
  };
  const initialSample = sampleHat(0);
  const initialPetPoseKey = createPetPoseKey(initialPetMotion.frameIndex, initialPetMotion.flipped);
  const firstHatDescriptor = hatDescriptorByPetPose.get(initialPetPoseKey);
  if (firstHatDescriptor === undefined) {
    throw new Error(`Pet hat ${JSON.stringify(hatId)} has no initial descriptor for pose ${initialPetPoseKey}.`);
  }
  return createCharacterEntry({
    catalogItem: input.buildingCatalogItem,
    building: input.building,
    layerId: `pet-hat-${petDefinition.id}-${hatId}`,
    frameLookup: hatFrameLookup,
    textureLocalPath: firstHatDescriptor.textureLocalPath,
    pixelGeometry: createPixelGeometry(
      initialSample.positionX ?? 0,
      initialSample.positionY ?? 0,
      0,
      0,
      initialSample.scaleY ?? 1,
      initialSample.scaleX !== undefined && initialSample.scaleX < 0 ? -1 : 1,
    ),
    sample: sampleHat,
    zIndex: initialSample.zIndex ?? initialPetMotion.zIndex + 0.01,
  });
}

function createPetPoseKey(bodyFrameIndex: number, flipped: boolean): string {
  return `${String(bodyFrameIndex)}:${flipped ? "flipped" : "unflipped"}`;
}

function hatFrameLookupIndex(
  uniqueHatFrames: ReadonlyMap<string, Exclude<PlacementRenderFrame, null>>,
  hatFrame: AnimationSourceRect,
): number {
  const frameKey = createRectKey(hatFrame);
  let frameIndex = 0;
  for (const savedFrameKey of uniqueHatFrames.keys()) {
    if (savedFrameKey === frameKey) {
      return frameIndex;
    }
    frameIndex += 1;
  }
  throw new Error(`Pet hat atlas frame ${frameKey} is not in the selected frame lookup.`);
}

function createPetFrameLookup(petDefinition: AnimationPetDefinition): FrameLookup {
  const frameNumbers = Array.from({ length: petDefinition.spriteFrameCount }, (_, frameIndex) => frameIndex);
  return {
    frames: frameNumbers.map((rawFrame) => createSpriteSheetFrame(
      rawFrame,
      petDefinition.spriteFrameColumns,
      petDefinition.spriteFrameWidth,
      petDefinition.spriteFrameHeight,
    )),
    animationIndexByRawFrame: new Map(frameNumbers.map((rawFrame) => [rawFrame, rawFrame])),
  };
}

function getPetWalkFrame(
  petDefinition: AnimationPetDefinition,
  direction: RouteMotionSample["direction"],
  walkStep: number,
): number {
  const directionFrames = petDefinition.walk.frameIndicesByDirection[direction];
  if (directionFrames.length === 0) {
    throw new Error(`Pet ${JSON.stringify(petDefinition.id)} has no walk frames for direction ${JSON.stringify(direction)}.`);
  }
  const frameIndex = directionFrames[walkStep % directionFrames.length];
  if (frameIndex === undefined) {
    throw new Error(`Pet ${JSON.stringify(petDefinition.id)} walk frame is missing at step ${String(walkStep)}.`);
  }
  return frameIndex;
}

function getPetWalkFrameDuration(petDefinition: AnimationPetDefinition): number {
  const frameDurationMilliseconds = petDefinition.walk.frameDurationMilliseconds + (petDefinition.moveSpeed - 2) * -25;
  if (!Number.isFinite(frameDurationMilliseconds) || frameDurationMilliseconds <= 0) {
    throw new RangeError(
      `Pet ${JSON.stringify(petDefinition.id)} has invalid derived walk frame duration ${String(frameDurationMilliseconds)}ms.`,
    );
  }
  return frameDurationMilliseconds;
}

function createStableHorseEntries(
  input: PlacementBuildingCharacterRenderInput,
): readonly PlacementRenderEntry[] {
  if (input.building.buildingId !== "Stable" || input.building.animationOptions?.horse !== true) {
    return [];
  }
  const stableDefinition = input.animationCatalog.buildingAnimationsById[input.buildingCatalogItem.id];
  if (stableDefinition?.kind !== "stable-horse") {
    throw new Error(`Stable animation catalog entry ${JSON.stringify(input.buildingCatalogItem.id)} is not a stable-horse definition.`);
  }
  const horseFrameLookup = createHorseFrameLookup(stableDefinition.frameCount, stableDefinition.columns, stableDefinition.frameWidth, stableDefinition.frameHeight);
  const horsePosition = {
    x: input.building.x * plannerTilePixelSize + plannerTilePixelSize,
    y: input.building.y * plannerTilePixelSize + input.buildingCatalogItem.tileSize.height * plannerTilePixelSize - 4,
  };
  const horseBaseZIndex = getBuildingFrontZIndex(input.buildingEntries, input.building);
  const frameSample = (currentTimeMilliseconds: number): Readonly<{ frameIndex: number; rawFrameIndex: number }> => {
    assertAnimationTime(currentTimeMilliseconds);
    const idleDurationMilliseconds = 8_300;
    const walkDurationMilliseconds = stableDefinition.walkingFrameDurationsMilliseconds.reduce((sum, duration) => sum + duration, 0);
    const phaseMilliseconds = modulo(
      currentTimeMilliseconds + getStableOffsetMilliseconds(`${input.building.x}:${input.building.y}`, 1_000),
      idleDurationMilliseconds + walkDurationMilliseconds,
    );
    if (phaseMilliseconds < idleDurationMilliseconds) {
      return {
        rawFrameIndex: stableDefinition.idleFrameIndex,
        frameIndex: requireFrameIndex(horseFrameLookup, stableDefinition.idleFrameIndex, "stable horse"),
      };
    }
    const walkFrame = selectTimedFrame(
      phaseMilliseconds - idleDurationMilliseconds,
      stableDefinition.walkingFrameIndices,
      stableDefinition.walkingFrameDurationsMilliseconds,
    );
    return {
      rawFrameIndex: walkFrame,
      frameIndex: requireFrameIndex(horseFrameLookup, walkFrame, "stable horse"),
    };
  };
  const horseSample = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
    const horseFrame = frameSample(currentTimeMilliseconds);
    return {
      frameIndex: horseFrame.frameIndex,
      positionX: horsePosition.x,
      positionY: horsePosition.y,
      scaleX: -1,
      zIndex: Math.max(getCharacterZIndex(horsePosition.y, stableDefinition.frameHeight), horseBaseZIndex + 0.01),
    };
  };
  const initialHorseSample = horseSample(0);
  const horseEntry = createCharacterEntry({
    catalogItem: input.buildingCatalogItem,
    building: input.building,
    layerId: "stable-horse",
    frameLookup: horseFrameLookup,
    textureLocalPath: stableDefinition.textureLocalPath,
    pixelGeometry: createPixelGeometry(horsePosition.x, horsePosition.y, 1, 1, 1, -1),
    sample: horseSample,
    zIndex: initialHorseSample.zIndex ?? Math.max(getCharacterZIndex(horsePosition.y, stableDefinition.frameHeight), horseBaseZIndex + 0.01),
  });
  const hatId = input.building.animationOptions?.hatId;
  if (hatId === undefined) {
    return [horseEntry];
  }
  const hatControl = getAnimationControlsForCatalogItem(input.animationCatalog, input.buildingCatalogItem.id, { horse: true })
    .find((controlDefinition) => controlDefinition.kind === "select" && controlDefinition.key === "hatId");
  if (hatControl?.kind !== "select" || !hatControl.choices.some((choice) => choice.id === hatId)) {
    throw new RangeError(`Stable has unknown horse hatId ${JSON.stringify(hatId)}.`);
  }
  const horseHatEntry = createStableHorseHatEntry(input, stableDefinition.walkingFrameIndices, hatId, frameSample, horsePosition);
  return horseHatEntry === null ? [horseEntry] : [horseEntry, horseHatEntry];
}

function createStableHorseHatEntry(
  input: PlacementBuildingCharacterRenderInput,
  walkingFrameIndices: readonly number[],
  hatId: string,
  frameSample: (currentTimeMilliseconds: number) => Readonly<{ frameIndex: number; rawFrameIndex: number }> ,
  horsePosition: Readonly<{ x: number; y: number }>,
): PlacementRenderEntry | null {
  const rawFrames = [...new Set([7, ...walkingFrameIndices])];
  const descriptorByHorseFrame = new Map<number, ReturnType<typeof getStableHorseHatRenderDescriptor>>();
  const hatFrameByKey = new Map<string, Exclude<PlacementRenderFrame, null>>();
  for (const horseFrameIndex of rawFrames) {
    const descriptor = getStableHorseHatRenderDescriptor(input.animationCatalog, hatId, horseFrameIndex);
    descriptorByHorseFrame.set(horseFrameIndex, descriptor);
    if (descriptor !== null) {
      hatFrameByKey.set(createRectKey(descriptor.sourceRect), descriptor.sourceRect);
    }
  }
  if (hatFrameByKey.size === 0) {
    return null;
  }
  const hatFrameLookup: FrameLookup = {
    frames: [...hatFrameByKey.values()],
    animationIndexByRawFrame: new Map(rawFrames.map((horseFrameIndex) => {
      const descriptor = descriptorByHorseFrame.get(horseFrameIndex);
      if (descriptor === undefined || descriptor === null) {
        return [horseFrameIndex, 0];
      }
      return [horseFrameIndex, hatFrameLookupIndex(hatFrameByKey, descriptor.sourceRect)];
    })),
  };
  const stableDefinition = input.animationCatalog.buildingAnimationsById[input.buildingCatalogItem.id];
  const hatTexturePath = [...descriptorByHorseFrame.values()].find((descriptor) => descriptor !== null)?.textureLocalPath;
  if (hatTexturePath === undefined) {
    throw new Error(`Stable horse hat ${JSON.stringify(hatId)} has no atlas texture path.`);
  }
  const sampleHat = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
    const horseFrame = frameSample(currentTimeMilliseconds);
    const descriptor = descriptorByHorseFrame.get(horseFrame.rawFrameIndex);
    if (descriptor === undefined) {
      throw new Error(`Stable horse hat ${JSON.stringify(hatId)} has no descriptor for frame ${String(horseFrame.rawFrameIndex)}.`);
    }
    if (descriptor === null) {
      return { frameIndex: 0, visible: false };
    }
    return {
      frameIndex: requireFrameIndex(hatFrameLookup, horseFrame.rawFrameIndex, `stable horse hat ${hatId}`),
      positionX: horsePosition.x + descriptor.offsetXInTiles,
      positionY: horsePosition.y + 20 + descriptor.offsetYInTiles,
      scaleX: descriptor.scaleFactor,
      scaleY: descriptor.scaleFactor,
      tintColor: getPrismaticTint(input.animationCatalog, `hat:${hatId}`, currentTimeMilliseconds),
      zIndex: getCharacterZIndex(horsePosition.y, stableDefinition?.kind === "stable-horse" ? stableDefinition.frameHeight : 32) + 0.01,
      visible: true,
    };
  };
  const initialSample = sampleHat(0);
  const firstDescriptor = descriptorByHorseFrame.get(frameSample(0).rawFrameIndex);
  if (firstDescriptor === undefined) {
    throw new Error(`Stable horse hat ${JSON.stringify(hatId)} has no descriptor for its initial frame.`);
  }
  const fallbackDescriptor = [...descriptorByHorseFrame.values()].find((descriptor) => descriptor !== null);
  if (fallbackDescriptor === undefined || fallbackDescriptor === null) {
    throw new Error(`Stable horse hat ${JSON.stringify(hatId)} has no drawable frame descriptors.`);
  }
  return createCharacterEntry({
    catalogItem: input.buildingCatalogItem,
    building: input.building,
    layerId: `stable-horse-hat-${hatId}`,
    frameLookup: hatFrameLookup,
    textureLocalPath: hatTexturePath,
    pixelGeometry: createPixelGeometry(
      initialSample.positionX ?? horsePosition.x,
      initialSample.positionY ?? horsePosition.y,
      0,
      0,
      initialSample.scaleY ?? 1,
      initialSample.scaleX !== undefined && initialSample.scaleX < 0 ? -1 : 1,
    ),
    sample: sampleHat,
    zIndex: initialSample.zIndex ?? getCharacterZIndex(horsePosition.y, 32) + 0.01,
  });
}

function createJunimoEntries(
  input: PlacementBuildingCharacterRenderInput,
  junimoDefinition: Extract<AnimationCatalog["buildingAnimationsById"][string], { kind: "junimo-hut" }>,
): readonly PlacementRenderEntry[] {
  if (
    input.building.buildingId !== "Junimo Hut" ||
    input.building.animationOptions?.junimos !== true ||
    input.season === "winter" ||
    input.isNightMode
  ) {
    return [];
  }
  const junimoStartTile = { x: input.building.x + 1, y: input.building.y + 1 };
  const walkabilityContext = createWalkabilityContext(input);
  const cropTargets = input.placementCrops
    .filter((placementCrop) => !isGiantCropCatalogItemId(placementCrop.cropId))
    .filter((placementCrop) => !walkabilityContext.hostTileKeys.has(createTileKey(placementCrop)))
    .filter((placementCrop) =>
      Math.abs(placementCrop.x - junimoStartTile.x) <= maximumJunimoRadiusInTiles &&
      Math.abs(placementCrop.y - junimoStartTile.y) <= maximumJunimoRadiusInTiles
    )
    .sort(compareCropsByDistance(junimoStartTile));
  if (cropTargets.length === 0) {
    return [];
  }
  assertWalkableStart(walkabilityContext, junimoStartTile, true, `Junimo Hut instanceId ${String(input.building.instanceId)}`);
  const reachableTiles = findReachableTiles(walkabilityContext, junimoStartTile, maximumJunimoRouteNodes, true);
  const reachableCropTargets = cropTargets
    .filter((placementCrop) => reachableTiles.has(createTileKey(placementCrop)))
    .slice(0, maximumJunimoTargets);
  if (reachableCropTargets.length === 0) {
    return [];
  }
  const junimoFrameLookup = createJunimoFrameLookup(junimoDefinition);
  return reachableCropTargets.flatMap((placementCrop, junimoIndex) => {
    const cropPath = reconstructPath(reachableTiles, placementCrop);
    const sampleJunimoRoute = createExitThenOutdoorLoopRouteSampler(
      cropPath,
      walkabilityContext.hostTileKeys,
      getMillisecondsPerTile(3),
      66.6666666667,
    );
    const tintColor = getJunimoColor(input.building.x, input.building.y, junimoIndex);
    const sampleJunimo = (currentTimeMilliseconds: number): PlacementSpriteMotionSample => {
      const routeMotion = sampleJunimoRoute(currentTimeMilliseconds);
      const rawFrame = getJunimoWalkFrame(routeMotion.direction, routeMotion.walkStep);
      const initialY = routeMotion.positionY + 8;
      return {
        frameIndex: requireFrameIndex(junimoFrameLookup, rawFrame, "Junimo"),
        positionX: routeMotion.positionX + 2,
        positionY: initialY + 1,
        scaleX: 0.75,
        scaleY: 0.75,
        tintColor,
        zIndex: getCharacterZIndex(initialY + junimoDefinition.frameHeight, junimoDefinition.frameHeight) + 0.01,
      };
    };
    const initialSample = sampleJunimo(0);
    const junimoBody = createCharacterEntry({
      catalogItem: input.buildingCatalogItem,
      building: input.building,
      layerId: `junimo-${String(junimoIndex)}`,
      frameLookup: junimoFrameLookup,
      textureLocalPath: junimoDefinition.textureLocalPath,
      pixelGeometry: createPixelGeometry(initialSample.positionX ?? 0, initialSample.positionY ?? 0, 0, 0, 0.75),
      sample: sampleJunimo,
      tintColor,
      zIndex: initialSample.zIndex ?? getCharacterZIndex(initialSample.positionY ?? 0, junimoDefinition.frameHeight),
    });
    const junimoShadow = createJunimoShadowEntry(input, junimoDefinition, junimoIndex, sampleJunimo, initialSample);
    return [junimoShadow, junimoBody];
  });
}

function createJunimoShadowEntry(
  input: PlacementBuildingCharacterRenderInput,
  junimoDefinition: Extract<AnimationCatalog["buildingAnimationsById"][string], { kind: "junimo-hut" }>,
  junimoIndex: number,
  sampleJunimo: (currentTimeMilliseconds: number) => PlacementSpriteMotionSample,
  initialSample: PlacementSpriteMotionSample,
): PlacementRenderEntry {
  const shadowFrame = { x: 0, y: 0, width: 64, height: 64 };
  const shadowMotion: PlacementRenderAnimation = {
    kind: "sprite-motion",
    frames: [shadowFrame],
    sample: (currentTimeMilliseconds) => {
      const junimoSample = sampleJunimo(currentTimeMilliseconds);
      return {
        positionX: (junimoSample.positionX ?? 0) + 6,
        positionY: (junimoSample.positionY ?? 0) + 2,
        scaleX: 0.1875,
        scaleY: 0.1875,
        zIndex: (junimoSample.zIndex ?? 0) - 0.01,
      };
    },
  };
  const initialX = (initialSample.positionX ?? 0) + 6;
  const initialY = (initialSample.positionY ?? 0) + 2;
  return {
    animation: shadowMotion,
    catalogItem: input.buildingCatalogItem,
    effectiveFootprint: input.buildingCatalogItem.tileSize,
    frame: shadowFrame,
    key: `building:${String(input.building.instanceId)}`,
    layerId: `junimo-shadow-${String(junimoIndex)}`,
    pixelGeometry: createPixelGeometry(initialX, initialY, 0, 0, 0.1875),
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: false,
    textureLocalPath: junimoDefinition.shadowTextureLocalPath,
    tileX: input.building.x,
    tileY: input.building.y,
    zIndex: (initialSample.zIndex ?? 0) - 0.01,
  };
}

function createJunimoFrameLookup(
  junimoDefinition: Extract<AnimationCatalog["buildingAnimationsById"][string], { kind: "junimo-hut" }>,
): FrameLookup {
  const frameNumbers = Array.from({ length: junimoDefinition.frameCount }, (_, frameIndex) => frameIndex);
  return {
    frames: frameNumbers.map((rawFrame) => createSpriteSheetFrame(
      rawFrame,
      junimoDefinition.columns,
      junimoDefinition.frameWidth,
      junimoDefinition.frameHeight,
    )),
    animationIndexByRawFrame: new Map(frameNumbers.map((rawFrame) => [rawFrame, rawFrame])),
  };
}

function getJunimoWalkFrame(
  direction: RouteMotionSample["direction"],
  walkStep: number,
): number {
  const frameByDirection: Readonly<Record<RouteMotionSample["direction"], number>> = {
    down: 32,
    right: 16,
    up: 0,
    left: 16,
  };
  return frameByDirection[direction] + walkStep;
}

function getJunimoColor(hutX: number, hutY: number, junimoIndex: number): string {
  const randomSource = createJunimoRandomSource(`junimocolor:${String(hutX)}:${String(hutY)}:${String(junimoIndex)}`);
  const paletteChoice = randomSource();
  let selectedColor: number;
  if (paletteChoice < 0.25) {
    if (randomSource() < 0.01) {
      selectedColor = 16_777_215;
    } else {
      selectedColor = selectColor(junimoBrightColors, randomSource());
    }
  } else {
    selectedColor = selectColor(junimoRegularColors, randomSource());
  }
  return formatTintColor(selectedColor);
}

function createJunimoRandomSource(seedText: string): () => number {
  let seed = fnv1aHash(seedText);
  return () => {
    seed = (seed + 1_831_565_813) | 0;
    let randomValue = Math.imul(seed ^ seed >>> 15, 1 | seed);
    randomValue = randomValue + Math.imul(randomValue ^ randomValue >>> 7, 61 | randomValue) ^ randomValue;
    return ((randomValue ^ randomValue >>> 14) >>> 0) / 4_294_967_296;
  };
}

function fnv1aHash(seedText: string): number {
  let hash = 2_166_136_261;
  for (let characterIndex = 0; characterIndex < seedText.length; characterIndex += 1) {
    hash ^= seedText.charCodeAt(characterIndex);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function selectColor(colors: readonly number[], randomFraction: number): number {
  const colorIndex = Math.floor(randomFraction * colors.length);
  const selectedColor = colors[colorIndex];
  if (selectedColor === undefined) {
    throw new Error(`Junimo palette has no color at index ${String(colorIndex)} for random fraction ${String(randomFraction)}.`);
  }
  return selectedColor;
}

function createWalkabilityContext(
  input: PlacementBuildingCharacterRenderInput,
): WalkabilityContext {
  const blockedTileKeys = new Set<TileKey>();
  const hostTileKeys = createFootprintTileKeys(input.building, input.buildingCatalogItem.tileSize);
  for (const placementBuilding of input.placementBuildings) {
    if (placementBuilding.instanceId === input.building.instanceId) {
      continue;
    }
    assertTileCoordinate(placementBuilding, `building instanceId ${String(placementBuilding.instanceId)}`);
    const placementBuildingCatalogItem = input.catalogItemsById.get(`building:${placementBuilding.buildingId}`);
    if (placementBuildingCatalogItem === undefined) {
      throw new RangeError(
        `Character route cannot resolve placed building instanceId ${String(placementBuilding.instanceId)} catalog item ${JSON.stringify(`building:${placementBuilding.buildingId}`)}.`,
      );
    }
    assertFootprint(placementBuildingCatalogItem.tileSize, placementBuildingCatalogItem.id);
    for (const tileKey of createFootprintTileKeys(placementBuilding, placementBuildingCatalogItem.tileSize)) {
      blockedTileKeys.add(tileKey);
    }
  }
  for (const placementItem of input.placementItems) {
    if (placementItem.layer === "path" || placementItem.isRug || placementItem.isGrass) {
      continue;
    }
    assertFootprint(placementItem.footprint, `item instanceId ${String(placementItem.instanceId)}`);
    for (const tileKey of createFootprintTileKeys(placementItem, placementItem.footprint)) {
      blockedTileKeys.add(tileKey);
    }
  }
  return {
    blockedTileKeys,
    hostTileKeys,
    hostBuilding: input.building,
    hostFootprint: input.buildingCatalogItem.tileSize,
    mapPlacementGrid: input.mapPlacementGrid,
  };
}

function findHostPerimeterSpawnTile(
  walkabilityContext: WalkabilityContext,
): MapTileCoordinates | null {
  const { hostBuilding, hostFootprint } = walkabilityContext;
  const perimeterTiles = createHostPerimeterTiles(hostBuilding, hostFootprint)
    .sort((leftTile, rightTile) => {
      const desiredDoorX = hostBuilding.x + Math.floor(hostFootprint.width / 2);
      const bottomDoorY = hostBuilding.y + hostFootprint.height;
      const leftScore = Math.abs(leftTile.x - desiredDoorX) + Math.abs(leftTile.y - bottomDoorY);
      const rightScore = Math.abs(rightTile.x - desiredDoorX) + Math.abs(rightTile.y - bottomDoorY);
      return leftScore - rightScore || compareTiles(leftTile, rightTile);
    });
  return perimeterTiles.find((perimeterTile) => isWalkableTile(walkabilityContext, perimeterTile, false)) ?? null;
}

function createHostPerimeterTiles(
  hostBuilding: PlacementBuilding,
  hostFootprint: Readonly<{ width: number; height: number }>,
): MapTileCoordinates[] {
  const perimeterTiles: MapTileCoordinates[] = [];
  for (let tileX = hostBuilding.x; tileX < hostBuilding.x + hostFootprint.width; tileX += 1) {
    perimeterTiles.push({ x: tileX, y: hostBuilding.y - 1 });
    perimeterTiles.push({ x: tileX, y: hostBuilding.y + hostFootprint.height });
  }
  for (let tileY = hostBuilding.y; tileY < hostBuilding.y + hostFootprint.height; tileY += 1) {
    perimeterTiles.push({ x: hostBuilding.x - 1, y: tileY });
    perimeterTiles.push({ x: hostBuilding.x + hostFootprint.width, y: tileY });
  }
  return uniqueTiles(perimeterTiles);
}

function assertWalkableStart(
  walkabilityContext: WalkabilityContext,
  startTile: MapTileCoordinates,
  allowHostInterior: boolean,
  actorLabel: string,
): void {
  if (!isWalkableTile(walkabilityContext, startTile, allowHostInterior)) {
    throw new RangeError(
      `${actorLabel} start tile ${formatTile(startTile)} is blocked, outside the map, or on water/wall.`,
    );
  }
}

function findReachableTiles(
  walkabilityContext: WalkabilityContext,
  startTile: MapTileCoordinates,
  maximumVisitedTiles: number,
  allowHostInterior: boolean,
  canSwim = false,
): ReadonlyMap<TileKey, ReachableTile> {
  assertWalkableStart(walkabilityContext, startTile, allowHostInterior, "Character route");
  const reachableByKey = new Map<TileKey, ReachableTile>();
  const startKey = createTileKey(startTile);
  reachableByKey.set(startKey, { tile: startTile, parentKey: null, distance: 0 });
  const pendingTileKeys: TileKey[] = [startKey];
  let nextTileIndex = 0;
  while (nextTileIndex < pendingTileKeys.length && reachableByKey.size < maximumVisitedTiles) {
    const activeTileKey = pendingTileKeys[nextTileIndex];
    if (activeTileKey === undefined) {
      throw new Error(`Character route queue has no tile key at index ${String(nextTileIndex)}.`);
    }
    const activeReachableTile = reachableByKey.get(activeTileKey);
    if (activeReachableTile === undefined) {
      throw new Error(`Character route queue references missing tile ${JSON.stringify(activeTileKey)}.`);
    }
    nextTileIndex += 1;
    for (const direction of routeDirections) {
      const neighborTile = {
        x: activeReachableTile.tile.x + direction.x,
        y: activeReachableTile.tile.y + direction.y,
      };
      const neighborTileKey = createTileKey(neighborTile);
      const currentTileIsInsideHost = walkabilityContext.hostTileKeys.has(createTileKey(activeReachableTile.tile));
      const canEnterHostInterior = allowHostInterior && currentTileIsInsideHost;
      if (
        reachableByKey.has(neighborTileKey) ||
        !isWalkableTile(walkabilityContext, neighborTile, canEnterHostInterior, canSwim)
      ) {
        continue;
      }
      if (reachableByKey.size >= maximumVisitedTiles) {
        break;
      }
      reachableByKey.set(neighborTileKey, {
        tile: neighborTile,
        parentKey: activeTileKey,
        distance: activeReachableTile.distance + 1,
      });
      pendingTileKeys.push(neighborTileKey);
    }
  }
  return reachableByKey;
}

function isWalkableTile(
  walkabilityContext: WalkabilityContext,
  tile: MapTileCoordinates,
  allowHostInterior: boolean,
  canSwim = false,
): boolean {
  if (
    tile.x < 0 || tile.y < 0 ||
    tile.x >= walkabilityContext.mapPlacementGrid.width ||
    tile.y >= walkabilityContext.mapPlacementGrid.height
  ) {
    return false;
  }
  const tileKey = createTileKey(tile);
  if (walkabilityContext.blockedTileKeys.has(tileKey)) {
    return false;
  }
  if (walkabilityContext.hostTileKeys.has(tileKey)) {
    return allowHostInterior;
  }
  const capabilities = getMapPlacementCapabilities(walkabilityContext.mapPlacementGrid, tile);
  if (capabilities.wall === true) {
    return false;
  }
  if (capabilities.water === true) {
    return canSwim;
  }
  return capabilities.passable;
}

function reconstructPath(
  reachableTiles: ReadonlyMap<TileKey, ReachableTile>,
  targetTile: MapTileCoordinates,
): readonly MapTileCoordinates[] {
  const targetKey = createTileKey(targetTile);
  if (!reachableTiles.has(targetKey)) {
    throw new RangeError(`Character route target ${formatTile(targetTile)} is not reachable.`);
  }
  const reversedPath: MapTileCoordinates[] = [];
  let activeTileKey: TileKey | null = targetKey;
  while (activeTileKey !== null) {
    const activeReachableTile = reachableTiles.get(activeTileKey);
    if (activeReachableTile === undefined) {
      throw new Error(`Character route predecessor ${JSON.stringify(activeTileKey)} is missing while reconstructing target ${formatTile(targetTile)}.`);
    }
    reversedPath.push(activeReachableTile.tile);
    activeTileKey = activeReachableTile.parentKey;
  }
  return reversedPath.reverse();
}

function createLoopingRoute(
  path: readonly MapTileCoordinates[],
): readonly MapTileCoordinates[] {
  if (path.length <= 1) {
    return path;
  }
  return [...path, ...path.slice(1, -1).reverse()];
}

function createExitThenOutdoorLoopRouteSampler(
  routeToTarget: readonly MapTileCoordinates[],
  hostTileKeys: ReadonlySet<TileKey>,
  millisecondsPerTile: number,
  frameDurationMilliseconds: number,
): (currentTimeMilliseconds: number) => RouteMotionSample {
  if (routeToTarget.length === 0) {
    throw new RangeError("Character exit route must contain at least one tile.");
  }
  const firstOutdoorTileIndex = routeToTarget.findIndex((routeTile) =>
    !hostTileKeys.has(createTileKey(routeTile))
  );
  if (firstOutdoorTileIndex === -1) {
    const initialHostTile = routeToTarget[0];
    if (initialHostTile === undefined) {
      throw new Error("Character exit route lost its initial host tile.");
    }
    return (currentTimeMilliseconds) => sampleRoute(
      [initialHostTile],
      currentTimeMilliseconds,
      millisecondsPerTile,
      frameDurationMilliseconds,
    );
  }

  const initialExitPath = routeToTarget.slice(0, firstOutdoorTileIndex + 1);
  const outdoorPath = routeToTarget.slice(firstOutdoorTileIndex);
  for (const routeTile of outdoorPath) {
    if (hostTileKeys.has(createTileKey(routeTile))) {
      throw new RangeError(
        `Character route re-enters host footprint at tile ${formatTile(routeTile)} after exiting.`,
      );
    }
  }
  const outdoorLoopPath = createLoopingRoute(outdoorPath);
  const exitDurationMilliseconds = (initialExitPath.length - 1) * millisecondsPerTile;
  return (currentTimeMilliseconds) => {
    assertAnimationTime(currentTimeMilliseconds);
    if (currentTimeMilliseconds < exitDurationMilliseconds) {
      return sampleRoute(
        initialExitPath,
        currentTimeMilliseconds,
        millisecondsPerTile,
        frameDurationMilliseconds,
      );
    }
    return sampleRoute(
      outdoorLoopPath,
      currentTimeMilliseconds - exitDurationMilliseconds,
      millisecondsPerTile,
      frameDurationMilliseconds,
    );
  };
}

function sampleRoute(
  route: readonly MapTileCoordinates[],
  currentTimeMilliseconds: number,
  millisecondsPerTile: number,
  frameDurationMilliseconds: number,
): RouteMotionSample {
  assertAnimationTime(currentTimeMilliseconds);
  if (route.length === 0) {
    throw new Error("Character animation route must contain at least one tile.");
  }
  if (!Number.isFinite(millisecondsPerTile) || millisecondsPerTile <= 0) {
    throw new RangeError(`Character route millisecondsPerTile must be positive; received ${String(millisecondsPerTile)}.`);
  }
  if (!Number.isFinite(frameDurationMilliseconds) || frameDurationMilliseconds <= 0) {
    throw new RangeError(`Character route frameDurationMilliseconds must be positive; received ${String(frameDurationMilliseconds)}.`);
  }
  const routeLength = route.length > 1 ? route.length - 1 : 1;
  const movementPeriodMilliseconds = millisecondsPerTile * routeLength;
  const movementTimeMilliseconds = modulo(currentTimeMilliseconds, movementPeriodMilliseconds);
  const segmentIndex = route.length > 1 ? Math.floor(movementTimeMilliseconds / millisecondsPerTile) : 0;
  const fromTile = route[segmentIndex];
  if (fromTile === undefined) {
    throw new Error(`Character animation route has no tile at segment ${String(segmentIndex)}.`);
  }
  const toTile = route.length > 1
    ? route[segmentIndex + 1]
    : fromTile;
  if (toTile === undefined) {
    throw new Error(`Character animation route has no destination tile after segment ${String(segmentIndex)}.`);
  }
  const segmentTimeMilliseconds = route.length > 1
    ? movementTimeMilliseconds % millisecondsPerTile
    : 0;
  const segmentFraction = route.length > 1
    ? segmentTimeMilliseconds / millisecondsPerTile
    : 0;
  const deltaX = toTile.x - fromTile.x;
  const deltaY = toTile.y - fromTile.y;
  return {
    positionX: (fromTile.x + deltaX * segmentFraction) * plannerTilePixelSize,
    positionY: (fromTile.y + deltaY * segmentFraction) * plannerTilePixelSize,
    direction: getDirectionForDelta(deltaX, deltaY),
    walkStep: Math.floor(currentTimeMilliseconds / frameDurationMilliseconds) % 8,
  };
}

function getDirectionForDelta(
  deltaX: number,
  deltaY: number,
): RouteMotionSample["direction"] {
  if (deltaX < 0) {
    return "left";
  }
  if (deltaX > 0) {
    return "right";
  }
  if (deltaY < 0) {
    return "up";
  }
  return "down";
}

function getMillisecondsPerTile(moveSpeed: number): number {
  if (!Number.isFinite(moveSpeed) || moveSpeed <= 0) {
    throw new RangeError(`Character moveSpeed must be positive; received ${String(moveSpeed)}.`);
  }
  return plannerTilePixelSize * 4 * 1_000 / (moveSpeed * 60);
}

function createHorseFrameLookup(
  frameCount: number,
  columns: number,
  frameWidth: number,
  frameHeight: number,
): FrameLookup {
  const rawFrames = Array.from({ length: frameCount }, (_, frameIndex) => frameIndex);
  return {
    frames: rawFrames.map((rawFrame) => createSpriteSheetFrame(rawFrame, columns, frameWidth, frameHeight)),
    animationIndexByRawFrame: new Map(rawFrames.map((rawFrame) => [rawFrame, rawFrame])),
  };
}

function createSpriteSheetFrame(
  rawFrame: number,
  columns: number,
  frameWidth: number,
  frameHeight: number,
): Exclude<PlacementRenderFrame, null> {
  if (!Number.isSafeInteger(rawFrame) || rawFrame < 0) {
    throw new RangeError(`Sprite sheet frame index must be a non-negative safe integer; received ${String(rawFrame)}.`);
  }
  if (!Number.isSafeInteger(columns) || columns <= 0) {
    throw new RangeError(`Sprite sheet columns must be a positive safe integer; received ${String(columns)}.`);
  }
  if (!Number.isSafeInteger(frameWidth) || frameWidth <= 0 || !Number.isSafeInteger(frameHeight) || frameHeight <= 0) {
    throw new RangeError(`Sprite sheet frame dimensions must be positive integers; received ${String(frameWidth)}x${String(frameHeight)}.`);
  }
  return {
    x: rawFrame % columns * frameWidth,
    y: Math.floor(rawFrame / columns) * frameHeight,
    width: frameWidth,
    height: frameHeight,
  };
}

function createCharacterEntry(input: CharacterEntryInput): PlacementRenderEntry {
  const initialSample = input.sample(0);
  const initialFrameIndex = initialSample.frameIndex ?? 0;
  const sampledInitialFrame = input.frameLookup.frames[initialFrameIndex];
  if (sampledInitialFrame === undefined) {
    throw new RangeError(
      `Character layer ${JSON.stringify(input.layerId)} selected frame index ${String(initialFrameIndex)} outside ${String(input.frameLookup.frames.length)} locked frames.`,
    );
  }
  const firstMotionFrame = input.frameLookup.frames[0];
  if (firstMotionFrame === undefined) {
    throw new RangeError(`Character layer ${JSON.stringify(input.layerId)} has no motion frames.`);
  }
  return {
    animation: {
      kind: "sprite-motion",
      frames: input.frameLookup.frames,
      sample: input.sample,
    },
    catalogItem: input.catalogItem,
    effectiveFootprint: input.catalogItem.tileSize,
    frame: firstMotionFrame,
    key: `building:${String(input.building.instanceId)}`,
    layerId: input.layerId,
    pixelGeometry: input.pixelGeometry,
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: false,
    textureLocalPath: input.textureLocalPath,
    tileX: input.building.x,
    tileY: input.building.y,
    ...(input.tintColor === undefined ? {} : { tintColor: input.tintColor }),
    zIndex: initialSample.zIndex ?? input.zIndex,
  };
}

function createPixelGeometry(
  positionX: number,
  positionY: number,
  anchorX = 0,
  anchorY = 0,
  uniformScale?: number,
  horizontalScale: 1 | -1 = 1,
): PlacementPixelGeometry {
  return {
    anchorX,
    anchorY,
    horizontalScale,
    positionX,
    positionY,
    ...(uniformScale === undefined ? {} : { uniformScale }),
  };
}

function getCharacterZIndex(positionY: number, spriteHeight: number): number {
  return (positionY + spriteHeight) / plannerTilePixelSize * 2;
}

function getBuildingFrontZIndex(
  buildingEntries: readonly PlacementRenderEntry[],
  building: PlacementBuilding,
): number {
  return buildingEntries.reduce(
    (maximumZIndex, buildingEntry) => Math.max(
      maximumZIndex,
      buildingEntry.zIndex ?? (buildingEntry.tileY + 1) * 2,
    ),
    (building.y + 1) * 2,
  );
}

function createFootprintTileKeys(
  placement: Readonly<{ x: number; y: number }>,
  footprint: Readonly<{ width: number; height: number }>,
): Set<TileKey> {
  assertTileCoordinate(placement, "placement");
  assertFootprint(footprint, "placement footprint");
  const tileKeys = new Set<TileKey>();
  for (let offsetY = 0; offsetY < footprint.height; offsetY += 1) {
    for (let offsetX = 0; offsetX < footprint.width; offsetX += 1) {
      tileKeys.add(createTileKey({ x: placement.x + offsetX, y: placement.y + offsetY }));
    }
  }
  return tileKeys;
}

function assertMapGrid(mapPlacementGrid: MapPlacementGrid): void {
  if (
    !Number.isSafeInteger(mapPlacementGrid.width) || mapPlacementGrid.width <= 0 ||
    !Number.isSafeInteger(mapPlacementGrid.height) || mapPlacementGrid.height <= 0 ||
    mapPlacementGrid.capabilitiesByTile.length !== mapPlacementGrid.width * mapPlacementGrid.height
  ) {
    throw new TypeError(
      `Character renderer map grid must contain width*height capabilities; received ${String(mapPlacementGrid.width)}x${String(mapPlacementGrid.height)} with ${String(mapPlacementGrid.capabilitiesByTile.length)} tiles.`,
    );
  }
}

function assertFootprint(
  footprint: Readonly<{ width: number; height: number }>,
  sourceLabel: string,
): void {
  if (!Number.isSafeInteger(footprint.width) || footprint.width <= 0 || !Number.isSafeInteger(footprint.height) || footprint.height <= 0) {
    throw new RangeError(`Character renderer ${JSON.stringify(sourceLabel)} footprint must be positive integer tiles; received ${JSON.stringify(footprint)}.`);
  }
}

function assertTileCoordinate(
  tile: Readonly<{ x: number; y: number }>,
  sourceLabel: string,
): void {
  if (!Number.isSafeInteger(tile.x) || !Number.isSafeInteger(tile.y)) {
    throw new TypeError(`Character renderer ${JSON.stringify(sourceLabel)} tile coordinate must contain safe integers; received ${JSON.stringify(tile)}.`);
  }
}

function assertAnimationTime(currentTimeMilliseconds: number): void {
  if (!Number.isFinite(currentTimeMilliseconds) || currentTimeMilliseconds < 0) {
    throw new RangeError(`Character animation time must be a finite non-negative number; received ${String(currentTimeMilliseconds)}.`);
  }
}

function requireFrameIndex(
  frameLookup: FrameLookup,
  rawFrame: number,
  sourceLabel: string,
): number {
  const animationFrameIndex = frameLookup.animationIndexByRawFrame.get(rawFrame);
  if (animationFrameIndex === undefined) {
    throw new RangeError(`${sourceLabel} selected raw frame ${String(rawFrame)} absent from its locked frame lookup.`);
  }
  return animationFrameIndex;
}

function selectTimedFrame(
  elapsedMilliseconds: number,
  frameIndices: readonly number[],
  frameDurationsMilliseconds: readonly number[],
): number {
  if (frameIndices.length === 0 || frameIndices.length !== frameDurationsMilliseconds.length) {
    throw new Error(`Stable horse timed frame sequence must have matching non-empty frame/duration arrays; received ${String(frameIndices.length)} frames and ${String(frameDurationsMilliseconds.length)} durations.`);
  }
  let remainingMilliseconds = elapsedMilliseconds;
  for (let frameIndex = 0; frameIndex < frameIndices.length; frameIndex += 1) {
    const durationMilliseconds = frameDurationsMilliseconds[frameIndex];
    const rawFrameIndex = frameIndices[frameIndex];
    if (durationMilliseconds === undefined || rawFrameIndex === undefined || durationMilliseconds <= 0) {
      throw new RangeError(`Stable horse timed frame ${String(frameIndex)} has invalid frame ${String(rawFrameIndex)} or duration ${String(durationMilliseconds)}.`);
    }
    if (remainingMilliseconds < durationMilliseconds) {
      return rawFrameIndex;
    }
    remainingMilliseconds -= durationMilliseconds;
  }
  const lastFrameIndex = frameIndices.at(-1);
  if (lastFrameIndex === undefined) {
    throw new Error("Stable horse timed frame sequence has no last frame.");
  }
  return lastFrameIndex;
}

function getPrismaticTint(
  animationCatalog: AnimationCatalog,
  clothingKey: string,
  currentTimeMilliseconds: number,
): string | undefined {
  const clothingDefinition = animationCatalog.clothingById[clothingKey];
  if (clothingDefinition === undefined) {
    throw new RangeError(`Character clothing key ${JSON.stringify(clothingKey)} is missing from animation catalog.`);
  }
  if (!clothingDefinition.isPrismatic) {
    return undefined;
  }
  assertAnimationTime(currentTimeMilliseconds);
  const prismaticPhase = currentTimeMilliseconds / prismaticColorStepMilliseconds;
  const paletteIndex = Math.floor(prismaticPhase) % prismaticColors.length;
  const colorFraction = prismaticPhase % 1;
  const fromColor = prismaticColors[paletteIndex];
  const toColor = prismaticColors[(paletteIndex + 1) % prismaticColors.length];
  if (fromColor === undefined || toColor === undefined) {
    throw new Error(`Prismatic palette has no adjacent colors for index ${String(paletteIndex)}.`);
  }
  return formatRgbColor(fromColor.map((channel, channelIndex) => {
    const nextChannel = toColor[channelIndex];
    if (nextChannel === undefined) {
      throw new Error(`Prismatic palette next color is missing channel ${String(channelIndex)}.`);
    }
    return Math.floor(channel + (nextChannel - channel) * colorFraction);
  }));
}

function formatRgbColor(colorChannels: readonly number[]): string {
  if (colorChannels.length !== 3 || colorChannels.some((colorChannel) => !Number.isSafeInteger(colorChannel) || colorChannel < 0 || colorChannel > 255)) {
    throw new RangeError(`Character RGB tint must contain three byte channels; received ${JSON.stringify(colorChannels)}.`);
  }
  return `#${colorChannels.map((colorChannel) => colorChannel.toString(16).padStart(2, "0")).join("")}`;
}

function formatTintColor(tintColor: number): string {
  if (!Number.isSafeInteger(tintColor) || tintColor < 0 || tintColor > 0xffffff) {
    throw new RangeError(`Character tint must be a 24-bit integer; received ${String(tintColor)}.`);
  }
  return `#${tintColor.toString(16).padStart(6, "0")}`;
}

function getStableOffsetMilliseconds(seedText: string, maximumOffsetExclusive: number): number {
  if (!Number.isSafeInteger(maximumOffsetExclusive) || maximumOffsetExclusive <= 0) {
    throw new RangeError(`Character deterministic offset maximum must be a positive integer; received ${String(maximumOffsetExclusive)}.`);
  }
  return fnv1aHash(seedText) % maximumOffsetExclusive;
}

function uniqueTiles(tiles: readonly MapTileCoordinates[]): MapTileCoordinates[] {
  const uniqueTilesByKey = new Map<TileKey, MapTileCoordinates>();
  for (const tile of tiles) {
    assertTileCoordinate(tile, "route target");
    uniqueTilesByKey.set(createTileKey(tile), tile);
  }
  return [...uniqueTilesByKey.values()];
}

function compareTiles(leftTile: MapTileCoordinates, rightTile: MapTileCoordinates): number {
  return leftTile.y - rightTile.y || leftTile.x - rightTile.x;
}

function compareTilesByDistanceFrom(
  reachableTiles: ReadonlyMap<TileKey, ReachableTile>,
  startTile: MapTileCoordinates,
): (leftTile: MapTileCoordinates, rightTile: MapTileCoordinates) => number {
  return (leftTile, rightTile) => {
    const leftReachableTile = reachableTiles.get(createTileKey(leftTile));
    const rightReachableTile = reachableTiles.get(createTileKey(rightTile));
    if (leftReachableTile === undefined || rightReachableTile === undefined) {
      throw new Error(`Character route distance comparison received an unreachable tile ${formatTile(leftReachableTile === undefined ? leftTile : rightTile)}.`);
    }
    return leftReachableTile.distance - rightReachableTile.distance || compareTiles(leftTile, rightTile);
  };
}

function compareCropsByDistance(
  startTile: MapTileCoordinates,
): (leftCrop: PlacementCrop, rightCrop: PlacementCrop) => number {
  return (leftCrop, rightCrop) => {
    const leftDistance = Math.abs(leftCrop.x - startTile.x) + Math.abs(leftCrop.y - startTile.y);
    const rightDistance = Math.abs(rightCrop.x - startTile.x) + Math.abs(rightCrop.y - startTile.y);
    return leftDistance - rightDistance || compareTiles(leftCrop, rightCrop);
  };
}

function createTileKey(tile: MapTileCoordinates): TileKey {
  return `${String(tile.x)},${String(tile.y)}`;
}

function formatTile(tile: MapTileCoordinates): string {
  return `(${String(tile.x)}, ${String(tile.y)})`;
}

function createRectKey(frame: AnimationSourceRect): string {
  return `${String(frame.x)},${String(frame.y)},${String(frame.width)},${String(frame.height)}`;
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (value === undefined) {
    return "undefined";
  }
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}

type MapPlacementCoordinates = MapTileCoordinates;
