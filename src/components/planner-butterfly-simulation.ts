import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export type PlannerButterflySpriteFrame = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export type PlannerButterflyState = Readonly<{
  id: number;
  x: number;
  y: number;
  baseFrame: number;
  summerSet: boolean;
  horizontalVelocity: number;
  verticalVelocity: number;
  motionMultiplier: number;
  flapTimerMilliseconds: number;
  flapDurationMilliseconds: number;
  animationFrames: readonly number[];
  animationIndex: number;
  animationTimerMilliseconds: number;
  frame: number;
  dead: boolean;
}>;

export type PlannerButterflySimulation = Readonly<{
  butterflies: readonly PlannerButterflyState[];
  mapFile: string;
  mapWidthTiles: number;
  mapHeightTiles: number;
  season: TilesheetSeason;
  targetPopulation: number;
  randomState: number;
  nextButterflyId: number;
  spawnTimerMilliseconds: number;
}>;

export type PlannerButterflyMapType = "default" | "desert" | "island" | "none";

export type PlannerDebrisMapType = "default" | "island-east" | "woods" | "none";

export type PlannerMapAtmosphereRules = Readonly<{
  butterflies: PlannerButterflyMapType;
  debris: PlannerDebrisMapType;
}>;

type PlannerButterflyRandomCursor = {
  state: number;
};

const butterflyFrameSize = 16;
const butterflyFrameColumns = 20;
const butterflySpriteSheetRows = 40;
const butterflySimulationUnitsPerTile = 64;
const butterflySpawnCheckIntervalMilliseconds = 7_000;
const butterflyFlapCooldownMilliseconds = 200;
const butterfliesPerAreaMultiplier = 0.7;
const maxInitialPopulationAttempts = 20;
const maxSpawnClusterAttempts = 16;
const maxClusterMemberAttempts = 8;
const maxSimulationStepsPerFrame = 6;
const simulationStepMilliseconds = 1_000 / 60;
const defaultMapAtmosphereRules: PlannerMapAtmosphereRules = {
  butterflies: "default",
  debris: "default",
};
const mapAtmosphereRulesByFilename: Readonly<Record<string, PlannerMapAtmosphereRules>> = {
  "Beach.tmx": { butterflies: "none", debris: "default" },
  "Desert.tmx": { butterflies: "desert", debris: "none" },
  "Island_W.tmx": { butterflies: "island", debris: "none" },
  "Island_N.tmx": { butterflies: "island", debris: "none" },
  "Island_S.tmx": { butterflies: "island", debris: "none" },
  "Island_SE.tmx": { butterflies: "island", debris: "none" },
  "Island_E.tmx": { butterflies: "none", debris: "island-east" },
  "Woods.tmx": { butterflies: "default", debris: "woods" },
};

export function getPlannerMapAtmosphereRules(mapFile: string): PlannerMapAtmosphereRules {
  validateMapFile(mapFile);
  const mapFilename = mapFile.split(/[\\/]/).pop() ?? "";

  return Object.prototype.hasOwnProperty.call(mapAtmosphereRulesByFilename, mapFilename)
    ? mapAtmosphereRulesByFilename[mapFilename]
    : defaultMapAtmosphereRules;
}

export function createPlannerButterflySimulation(
  mapWidthTiles: number,
  mapHeightTiles: number,
  season: TilesheetSeason,
  mapFile: string,
): PlannerButterflySimulation {
  validateMapTileCount("mapWidthTiles", mapWidthTiles);
  validateMapTileCount("mapHeightTiles", mapHeightTiles);
  validateMapFile(mapFile);

  const mapAtmosphereRules = getPlannerMapAtmosphereRules(mapFile);
  const randomCursor = {
    state: createInitialRandomState(mapFile, season),
  };
  const targetPopulation = getTargetPopulation(
    mapWidthTiles,
    mapHeightTiles,
    season,
    mapAtmosphereRules.butterflies,
  );
  const butterflies: PlannerButterflyState[] = [];
  let nextButterflyId = 0;

  if (doesSeasonSupportButterflies(season, mapAtmosphereRules.butterflies)) {
    for (
      let attempt = 0;
      attempt < maxInitialPopulationAttempts && butterflies.length <= targetPopulation;
      attempt += 1
    ) {
      const spawnedButterflies = createButterflySpawnBatch({
        mapWidthTiles,
        mapHeightTiles,
        season,
        butterflyMapType: mapAtmosphereRules.butterflies,
        currentPopulation: butterflies.length,
        targetPopulation,
        firstButterflyId: nextButterflyId,
        randomCursor,
      });
      butterflies.push(...spawnedButterflies);
      nextButterflyId += spawnedButterflies.length;
    }
  }

  return {
    butterflies,
    mapFile,
    mapWidthTiles,
    mapHeightTiles,
    season,
    targetPopulation,
    randomState: randomCursor.state,
    nextButterflyId,
    spawnTimerMilliseconds: butterflySpawnCheckIntervalMilliseconds,
  };
}

export function advancePlannerButterflySimulation(
  simulation: PlannerButterflySimulation,
  elapsedMilliseconds: number,
): PlannerButterflySimulation {
  validateElapsedMilliseconds(elapsedMilliseconds);

  const randomCursor = { state: simulation.randomState };
  let butterflies = [...simulation.butterflies];
  let nextButterflyId = simulation.nextButterflyId;
  let spawnTimerMilliseconds = simulation.spawnTimerMilliseconds + elapsedMilliseconds;
  const mapAtmosphereRules = getPlannerMapAtmosphereRules(simulation.mapFile);

  if (spawnTimerMilliseconds >= butterflySpawnCheckIntervalMilliseconds) {
    spawnTimerMilliseconds %= butterflySpawnCheckIntervalMilliseconds;

    const spawnedButterflies = createButterflySpawnBatch({
      mapWidthTiles: simulation.mapWidthTiles,
      mapHeightTiles: simulation.mapHeightTiles,
      season: simulation.season,
      butterflyMapType: mapAtmosphereRules.butterflies,
      currentPopulation: butterflies.length,
      targetPopulation: simulation.targetPopulation,
      firstButterflyId: nextButterflyId,
      randomCursor,
    });
    butterflies.push(...spawnedButterflies);
    nextButterflyId += spawnedButterflies.length;
  }

  const mapWidthSimulationUnits =
    simulation.mapWidthTiles * butterflySimulationUnitsPerTile;
  const mapHeightSimulationUnits =
    simulation.mapHeightTiles * butterflySimulationUnitsPerTile;
  butterflies = butterflies
    .map((butterfly) => advanceButterfly(butterfly, elapsedMilliseconds, {
      mapWidthSimulationUnits,
      mapHeightSimulationUnits,
      randomCursor,
    }))
    .filter((butterfly) => !butterfly.dead);

  return {
    ...simulation,
    butterflies,
    randomState: randomCursor.state,
    nextButterflyId,
    spawnTimerMilliseconds,
  };
}

export function getPlannerButterflySpriteFrame(frameIndex: number): PlannerButterflySpriteFrame {
  if (!Number.isInteger(frameIndex) || frameIndex < 0) {
    throw new RangeError(
      `frameIndex must be a non-negative integer; received ${String(frameIndex)}.`,
    );
  }

  const maximumFrameIndex = butterflyFrameColumns * butterflySpriteSheetRows - 1;
  if (frameIndex > maximumFrameIndex) {
    throw new RangeError(
      `frameIndex must be at most ${maximumFrameIndex}; received ${String(frameIndex)}.`,
    );
  }

  return {
    left: (frameIndex % butterflyFrameColumns) * butterflyFrameSize,
    top: Math.floor(frameIndex / butterflyFrameColumns) * butterflyFrameSize,
    width: butterflyFrameSize,
    height: butterflyFrameSize,
  };
}

export function getPlannerButterflySimulationStepMilliseconds(): number {
  return simulationStepMilliseconds;
}

export function getPlannerButterflyMaximumSimulationStepsPerFrame(): number {
  return maxSimulationStepsPerFrame;
}

function createButterflySpawnBatch(input: Readonly<{
  mapWidthTiles: number;
  mapHeightTiles: number;
  season: TilesheetSeason;
  butterflyMapType: PlannerButterflyMapType;
  currentPopulation: number;
  targetPopulation: number;
  firstButterflyId: number;
  randomCursor: PlannerButterflyRandomCursor;
}>): readonly PlannerButterflyState[] {
  if (
    !doesSeasonSupportButterflies(input.season, input.butterflyMapType) ||
    input.currentPopulation > input.targetPopulation
  ) {
    return [];
  }

  const mapAreaTiles = input.mapWidthTiles * input.mapHeightTiles;
  const spawnProbability = input.butterflyMapType === "island"
    ? clamp(mapAreaTiles / 15_000, 0.1, 0.25)
    : clamp(mapAreaTiles / 15_000, 0.15, 0.5);
  const clusterProbability = Math.min(0.8, spawnProbability * 1.5);
  const butterflySeason = input.butterflyMapType === "default" ? input.season : "summer";
  const spawnedButterflies: PlannerButterflyState[] = [];
  let clusterAttempt = 0;
  let nextButterflyId = input.firstButterflyId;

  while (
    nextRandom(input.randomCursor) < clusterProbability &&
    clusterAttempt < maxSpawnClusterAttempts
  ) {
    clusterAttempt += 1;
    const tileX = Math.floor(nextRandom(input.randomCursor) * input.mapWidthTiles);
    const tileY = Math.floor(nextRandom(input.randomCursor) * input.mapHeightTiles);
    const firstButterfly = createButterflyIfSelected(
      nextButterflyId,
      tileX,
      tileY,
      butterflySeason,
      input.butterflyMapType === "island",
      input.randomCursor,
    );

    if (firstButterfly !== null) {
      spawnedButterflies.push(firstButterfly);
      nextButterflyId += 1;
    }

    let clusterMemberAttempt = 0;
    while (
      nextRandom(input.randomCursor) < 0.4 &&
      clusterMemberAttempt < maxClusterMemberAttempts
    ) {
      clusterMemberAttempt += 1;
      const clusterTileX = tileX + Math.floor(nextRandom(input.randomCursor) * 5) - 2;
      const clusterTileY = tileY + Math.floor(nextRandom(input.randomCursor) * 5) - 2;
      const clusterButterfly = createButterflyIfSelected(
        nextButterflyId,
        clusterTileX,
        clusterTileY,
        butterflySeason,
        input.butterflyMapType === "island",
        input.randomCursor,
      );

      if (clusterButterfly !== null) {
        spawnedButterflies.push(clusterButterfly);
        nextButterflyId += 1;
      }
    }
  }

  return spawnedButterflies;
}

function createButterflyIfSelected(
  butterflyId: number,
  tileX: number,
  tileY: number,
  season: TilesheetSeason,
  usesIslandButterflyFrames: boolean,
  randomCursor: PlannerButterflyRandomCursor,
): PlannerButterflyState | null {
  if (nextRandom(randomCursor) >= butterfliesPerAreaMultiplier) {
    return null;
  }

  return createButterfly(
    butterflyId,
    tileX,
    tileY,
    season,
    usesIslandButterflyFrames,
    randomCursor,
  );
}

function createButterfly(
  butterflyId: number,
  tileX: number,
  tileY: number,
  season: TilesheetSeason,
  usesIslandButterflyFrames: boolean,
  randomCursor: PlannerButterflyRandomCursor,
): PlannerButterflyState {
  const baseFrame = getButterflyBaseFrame(season, usesIslandButterflyFrames, randomCursor);
  const horizontalMagnitude = nextRandom(randomCursor) + 0.25;
  const horizontalDirection = nextRandom(randomCursor) < 0.5 ? -1 : 1;
  const verticalMagnitude = nextRandom(randomCursor) + 0.5;
  const verticalDirection = nextRandom(randomCursor) < 0.5 ? -1 : 1;

  return {
    id: butterflyId,
    x: tileX * butterflySimulationUnitsPerTile,
    y: tileY * butterflySimulationUnitsPerTile,
    baseFrame,
    summerSet: usesIslandButterflyFrames || season === "summer",
    horizontalVelocity: horizontalMagnitude * 3 * horizontalDirection / 2,
    verticalVelocity: verticalMagnitude * 3 * verticalDirection / 2,
    motionMultiplier: 1,
    flapTimerMilliseconds: 0,
    flapDurationMilliseconds: 45 + Math.floor(nextRandom(randomCursor) * 35),
    animationFrames: [],
    animationIndex: 0,
    animationTimerMilliseconds: 0,
    frame: baseFrame,
    dead: false,
  };
}

function getButterflyBaseFrame(
  season: TilesheetSeason,
  usesIslandButterflyFrames: boolean,
  randomCursor: PlannerButterflyRandomCursor,
): number {
  if (usesIslandButterflyFrames) {
    return Math.floor(nextRandom(randomCursor) * 4) * 4 + 364;
  }

  if (season === "spring") {
    return nextRandom(randomCursor) < 0.5
      ? Math.floor(nextRandom(randomCursor) * 3) * 3 + 160
      : Math.floor(nextRandom(randomCursor) * 3) * 3 + 180;
  }

  let baseFrame = nextRandom(randomCursor) < 0.5
    ? Math.floor(nextRandom(randomCursor) * 3) * 4 + 128
    : Math.floor(nextRandom(randomCursor) * 3) * 4 + 148;

  if (nextRandom(randomCursor) < 0.05) {
    baseFrame = Math.floor(nextRandom(randomCursor) * 2) * 4 + 169;
  }
  if (nextRandom(randomCursor) < 0.01) {
    baseFrame = Math.floor(nextRandom(randomCursor) * 2) * 4 + 480;
  }

  return baseFrame;
}

function advanceButterfly(
  butterfly: PlannerButterflyState,
  elapsedMilliseconds: number,
  mapBounds: Readonly<{
    mapWidthSimulationUnits: number;
    mapHeightSimulationUnits: number;
    randomCursor: PlannerButterflyRandomCursor;
  }>,
): PlannerButterflyState {
  if (butterfly.dead) {
    return butterfly;
  }

  let nextButterfly = {
    ...butterfly,
    flapTimerMilliseconds: butterfly.flapTimerMilliseconds - elapsedMilliseconds,
  };

  if (
    nextButterfly.flapTimerMilliseconds <= 0 &&
    nextButterfly.animationFrames.length === 0
  ) {
    nextButterfly = startButterflyFlap(nextButterfly, mapBounds.randomCursor);
  }

  if (nextButterfly.animationFrames.length > 0) {
    nextButterfly = advanceButterflyFlap(
      nextButterfly,
      elapsedMilliseconds,
      mapBounds.randomCursor,
    );
  }

  const x = nextButterfly.x + nextButterfly.horizontalVelocity * nextButterfly.motionMultiplier;
  const y = nextButterfly.y + nextButterfly.verticalVelocity * nextButterfly.motionMultiplier;
  const verticalVelocity = nextButterfly.verticalVelocity + 0.005 * elapsedMilliseconds;
  const motionMultiplier = Math.max(
    0,
    nextButterfly.motionMultiplier - 0.0005 * elapsedMilliseconds,
  );
  const isOutsideMap =
    x < -128 ||
    y < -128 ||
    x > mapBounds.mapWidthSimulationUnits ||
    y > mapBounds.mapHeightSimulationUnits;

  return {
    ...nextButterfly,
    x,
    y,
    verticalVelocity,
    motionMultiplier,
    dead: isOutsideMap,
  };
}

function startButterflyFlap(
  butterfly: PlannerButterflyState,
  randomCursor: PlannerButterflyRandomCursor,
): PlannerButterflyState {
  const horizontalVelocity = clamp(
    butterfly.horizontalVelocity + (Math.floor(nextRandom(randomCursor) * 161) - 80) / 100,
    -1.5,
    1.5,
  );
  const verticalVelocity = clamp(
    (nextRandom(randomCursor) + 0.25) * -3 / 2,
    -3,
    3,
  );
  const animationFrames = butterfly.summerSet
    ? [
        butterfly.baseFrame + 1,
        butterfly.baseFrame + 2,
        butterfly.baseFrame + 3,
        butterfly.baseFrame + 2,
        butterfly.baseFrame + 1,
        butterfly.baseFrame,
      ]
    : [
        butterfly.baseFrame + 1,
        butterfly.baseFrame + 2,
        butterfly.baseFrame + 1,
        butterfly.baseFrame,
      ];

  return {
    ...butterfly,
    horizontalVelocity,
    verticalVelocity,
    motionMultiplier: 1,
    animationFrames,
    animationIndex: 0,
    animationTimerMilliseconds: butterfly.flapDurationMilliseconds,
    frame: animationFrames[0],
  };
}

function advanceButterflyFlap(
  butterfly: PlannerButterflyState,
  elapsedMilliseconds: number,
  randomCursor: PlannerButterflyRandomCursor,
): PlannerButterflyState {
  const animationTimerMilliseconds =
    butterfly.animationTimerMilliseconds - elapsedMilliseconds;
  if (animationTimerMilliseconds > 0) {
    return { ...butterfly, animationTimerMilliseconds };
  }

  const animationIndex = butterfly.animationIndex + 1;
  if (animationIndex >= butterfly.animationFrames.length) {
    return {
      ...butterfly,
      flapTimerMilliseconds:
        butterflyFlapCooldownMilliseconds + Math.floor(nextRandom(randomCursor) * 11) - 5,
      animationFrames: [],
      animationIndex: 0,
      animationTimerMilliseconds: 0,
      frame: butterfly.baseFrame,
    };
  }

  return {
    ...butterfly,
    animationIndex,
    animationTimerMilliseconds: butterfly.flapDurationMilliseconds,
    frame: butterfly.animationFrames[animationIndex],
  };
}

function getTargetPopulation(
  mapWidthTiles: number,
  mapHeightTiles: number,
  season: TilesheetSeason,
  butterflyMapType: PlannerButterflyMapType,
): number {
  if (
    !doesSeasonSupportButterflies(season, butterflyMapType)
  ) {
    return 0;
  }

  if (
    season === "summer" ||
    butterflyMapType === "island" ||
    butterflyMapType === "desert"
  ) {
    return Math.min(
      Math.round(180 * butterfliesPerAreaMultiplier),
      Math.max(
        Math.round(12 * butterfliesPerAreaMultiplier),
        Math.round(mapWidthTiles * mapHeightTiles / 5_200 * 60 * butterfliesPerAreaMultiplier),
      ),
    );
  }

  if (season === "spring") {
    return Math.min(
      Math.round(90 * butterfliesPerAreaMultiplier),
      Math.max(
        Math.round(6 * butterfliesPerAreaMultiplier),
        Math.round(mapWidthTiles * mapHeightTiles / 5_200 * 30 * butterfliesPerAreaMultiplier),
      ),
    );
  }

  return 0;
}

function doesSeasonSupportButterflies(
  season: TilesheetSeason,
  butterflyMapType: PlannerButterflyMapType,
): boolean {
  if (butterflyMapType === "none") {
    return false;
  }
  if (butterflyMapType === "island" || butterflyMapType === "desert") {
    return true;
  }

  return season === "spring" || season === "summer";
}

function createInitialRandomState(
  mapFile: string,
  season: TilesheetSeason,
): number {
  const mapSeed = `critters:${mapFile}:${season}`;
  let randomSeed = 2_166_136_261;

  for (let characterIndex = 0; characterIndex < mapSeed.length; characterIndex += 1) {
    randomSeed ^= mapSeed.charCodeAt(characterIndex);
    randomSeed = Math.imul(randomSeed, 16_777_619);
  }

  return randomSeed >>> 0;
}

function nextRandom(randomCursor: PlannerButterflyRandomCursor): number {
  const nextState = (randomCursor.state + 1_831_565_813) | 0;
  let mixedValue = Math.imul(nextState ^ (nextState >>> 15), 1 | nextState);
  mixedValue = (mixedValue + Math.imul(mixedValue ^ (mixedValue >>> 7), 61 | mixedValue)) ^ mixedValue;
  randomCursor.state = nextState >>> 0;

  return ((mixedValue ^ (mixedValue >>> 14)) >>> 0) / 4_294_967_296;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function validateMapTileCount(boundName: "mapWidthTiles" | "mapHeightTiles", value: number): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(
      `${boundName} must be a positive integer; received ${String(value)}.`,
    );
  }
}

function validateMapFile(mapFile: string): void {
  if (typeof mapFile !== "string" || mapFile.length === 0) {
    throw new TypeError(
      `mapFile must be a non-empty string; received ${String(mapFile)}.`,
    );
  }
}

function validateElapsedMilliseconds(elapsedMilliseconds: number): void {
  if (!Number.isFinite(elapsedMilliseconds) || elapsedMilliseconds < 0) {
    throw new RangeError(
      `elapsedMilliseconds must be a finite non-negative number; received ${String(elapsedMilliseconds)}.`,
    );
  }
}
