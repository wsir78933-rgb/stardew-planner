import { describe, expect, it } from "vitest";
import {
  advancePlannerButterflySimulation,
  createPlannerButterflySimulation,
  getPlannerMapAtmosphereRules,
  getPlannerButterflySimulationStepMilliseconds,
  getPlannerButterflySpriteFrame,
} from "../../src/components/planner-butterfly-simulation";

const standardMapWidthTiles = 80;
const standardMapHeightTiles = 56;
const standardMapFile = "Farm.tmx";
const simulationStepMilliseconds = getPlannerButterflySimulationStepMilliseconds();

describe("planner butterfly simulation", () => {
  it.each([
    { mapFile: "Farm.tmx", butterflies: "default", debris: "default" },
    { mapFile: "Beach.tmx", butterflies: "none", debris: "default" },
    { mapFile: "Desert.tmx", butterflies: "desert", debris: "none" },
    { mapFile: "Island_W.tmx", butterflies: "island", debris: "none" },
    { mapFile: "Island_N.tmx", butterflies: "island", debris: "none" },
    { mapFile: "Island_S.tmx", butterflies: "island", debris: "none" },
    { mapFile: "Island_SE.tmx", butterflies: "island", debris: "none" },
    { mapFile: "Island_E.tmx", butterflies: "none", debris: "island-east" },
    { mapFile: "Woods.tmx", butterflies: "default", debris: "woods" },
  ] as const)("uses competitor map ambience rules for $mapFile", (expectedRules) => {
    expect(getPlannerMapAtmosphereRules(expectedRules.mapFile)).toEqual({
      butterflies: expectedRules.butterflies,
      debris: expectedRules.debris,
    });
  });

  it("matches competitor basename handling and defaults unknown map files safely", () => {
    expect(getPlannerMapAtmosphereRules("mods/island/Island_W.tmx")).toEqual({
      butterflies: "island",
      debris: "none",
    });
    expect(getPlannerMapAtmosphereRules("mods\\island\\Island_W.tmx")).toEqual({
      butterflies: "island",
      debris: "none",
    });
    expect(getPlannerMapAtmosphereRules("__proto__")).toEqual({
      butterflies: "default",
      debris: "default",
    });
  });

  it.each([
    { season: "spring", targetPopulation: 18 },
    { season: "summer", targetPopulation: 36 },
  ] as const)("matches the competitor's $season target population formula", ({ season, targetPopulation }) => {
    const simulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      season,
      standardMapFile,
    );

    expect(simulation.targetPopulation).toBe(targetPopulation);
    expect(simulation.butterflies.length).toBeGreaterThan(0);
    expect(simulation.butterflies.every((butterfly) => butterfly.summerSet === (season === "summer")))
      .toBe(true);
  });

  it.each(["fall", "winter"] as const)("does not create butterflies during %s", (season) => {
    const simulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      season,
      standardMapFile,
    );

    expect(simulation.targetPopulation).toBe(0);
    expect(simulation.butterflies).toEqual([]);
  });

  it.each(["spring", "summer", "fall", "winter"] as const)(
    "uses year-round Island_W butterflies during %s",
    (season) => {
      const islandSimulation = createPlannerButterflySimulation(
        standardMapWidthTiles,
        standardMapHeightTiles,
        season,
        "Island_W.tmx",
      );

      expect(islandSimulation.targetPopulation).toBe(36);
      expect(islandSimulation.butterflies.length).toBeGreaterThan(0);
      expect(islandSimulation.butterflies.every((butterfly) => butterfly.summerSet)).toBe(true);
      expect(islandSimulation.butterflies.every((butterfly) =>
        butterfly.baseFrame >= 364 &&
        butterfly.baseFrame <= 376 &&
        (butterfly.baseFrame - 364) % 4 === 0,
      )).toBe(true);
    },
  );

  it("uses the island's summer flap sequence in winter", () => {
    const islandSimulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      "winter",
      "Island_W.tmx",
    );
    const initialButterfly = islandSimulation.butterflies[0];
    const firstStepSimulation = advancePlannerButterflySimulation(
      islandSimulation,
      simulationStepMilliseconds,
    );

    expect(firstStepSimulation.butterflies[0].frame).toBe(initialButterfly.baseFrame + 1);
    expect(firstStepSimulation.butterflies[0].animationFrames).toEqual([
      initialButterfly.baseFrame + 1,
      initialButterfly.baseFrame + 2,
      initialButterfly.baseFrame + 3,
      initialButterfly.baseFrame + 2,
      initialButterfly.baseFrame + 1,
      initialButterfly.baseFrame,
    ]);
  });

  it.each([
    { mapFile: "Beach.tmx", season: "spring", targetPopulation: 0 },
    { mapFile: "Island_E.tmx", season: "summer", targetPopulation: 0 },
    { mapFile: "Desert.tmx", season: "winter", targetPopulation: 36 },
  ] as const)("respects butterfly map rules for $mapFile in $season", ({ mapFile, season, targetPopulation }) => {
    const simulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      season,
      mapFile,
    );

    expect(simulation.targetPopulation).toBe(targetPopulation);
    expect(simulation.butterflies.length > 0).toBe(targetPopulation > 0);
  });

  it.each([
    "spring",
    "summer",
  ] as const)("uses the competitor's $season flap frame sequence and flight step", (season) => {
    const simulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      season,
      standardMapFile,
    );
    const initialButterfly = simulation.butterflies[0];
    const firstStepSimulation = advancePlannerButterflySimulation(
      simulation,
      simulationStepMilliseconds,
    );
    let nextFrameSimulation = firstStepSimulation;
    const stepsPerFlapFrame = Math.floor(
      initialButterfly.flapDurationMilliseconds / simulationStepMilliseconds,
    );

    for (
      let step = 0;
      step < stepsPerFlapFrame;
      step += 1
    ) {
      nextFrameSimulation = advancePlannerButterflySimulation(
        nextFrameSimulation,
        simulationStepMilliseconds,
      );
    }

    expect(firstStepSimulation.butterflies[0].frame).toBe(initialButterfly.baseFrame + 1);
    expect(nextFrameSimulation.butterflies[0].frame).toBe(initialButterfly.baseFrame + 2);

    if (season === "summer") {
      for (let step = 0; step < stepsPerFlapFrame + 1; step += 1) {
        nextFrameSimulation = advancePlannerButterflySimulation(
          nextFrameSimulation,
          simulationStepMilliseconds,
        );
      }
      expect(nextFrameSimulation.butterflies[0].frame).toBe(initialButterfly.baseFrame + 3);
    }

    expect(firstStepSimulation.butterflies[0].x).not.toBe(initialButterfly.x);
    expect(firstStepSimulation.butterflies[0].y).not.toBe(initialButterfly.y);
  });

  it("maps frame indexes to the 20-column, 16-pixel game sprite atlas", () => {
    expect(getPlannerButterflySpriteFrame(36)).toEqual({
      left: 256,
      top: 16,
      width: 16,
      height: 16,
    });
    expect(getPlannerButterflySpriteFrame(480)).toEqual({
      left: 0,
      top: 384,
      width: 16,
      height: 16,
    });
    expect(getPlannerButterflySpriteFrame(799)).toEqual({
      left: 304,
      top: 624,
      width: 16,
      height: 16,
    });
  });

  it("seeds butterflies from the competitor's exact mapFile and season key", () => {
    const farmSimulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      "fall",
      standardMapFile,
    );
    const forestSimulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      "fall",
      "Forest.tmx",
    );

    expect(farmSimulation.randomState).toBe(1_366_329_305);
    expect(forestSimulation.randomState).toBe(1_993_863_322);
  });

  it("rejects invalid map sizes, frame indexes, and elapsed time with their values", () => {
    expect(() => createPlannerButterflySimulation(0, 56, "spring", standardMapFile))
      .toThrow("mapWidthTiles must be a positive integer; received 0.");
    expect(() => getPlannerButterflySpriteFrame(800))
      .toThrow("frameIndex must be at most 799; received 800.");

    const simulation = createPlannerButterflySimulation(
      standardMapWidthTiles,
      standardMapHeightTiles,
      "spring",
      standardMapFile,
    );
    expect(() => advancePlannerButterflySimulation(simulation, -1))
      .toThrow("elapsedMilliseconds must be a finite non-negative number; received -1.");
    expect(() => createPlannerButterflySimulation(80, 56, "spring", ""))
      .toThrow("mapFile must be a non-empty string; received .");
  });
});
