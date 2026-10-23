import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CatalogJsonFetcher } from "../../src/catalog/catalog-types";
import {
  getAnimationControlsForCatalogItem,
  getPetHatRenderDescriptor,
  getStableHorseHatRenderDescriptor,
  loadPlannerAnimationCatalog,
} from "../../src/animations/animation-catalog";

function createLocalAnimationJsonFetcher(): CatalogJsonFetcher {
  return async (requestedUrl) => {
    const responsePath = join(process.cwd(), "public", requestedUrl.slice(1));
    const responseJson = JSON.parse(await readFile(responsePath, "utf8")) as unknown;
    return {
      ok: true,
      status: 200,
      json: async () => responseJson,
    };
  };
}

function createLocalFetchResponse(): typeof fetch {
  return vi.fn(async (requestedUrl: RequestInfo | URL) => {
    const responsePath = join(process.cwd(), "public", String(requestedUrl).slice(1));
    const responseJson = JSON.parse(await readFile(responsePath, "utf8")) as unknown;
    return new Response(JSON.stringify(responseJson), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
}

describe("planner animation catalog", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("parses the locked datasets and exposes verified animation descriptors", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const millAnimation = animationCatalog.buildingAnimationsById["building:Mill"];

    expect(animationCatalog.waterSurface.frames).toHaveLength(10);
    expect(animationCatalog.waterSurface.frames[0]?.sourceRectsByFlip).toEqual([
      { x: 0, y: 2064, width: 64, height: 64 },
      { x: 0, y: 2192, width: 64, height: 64 },
    ]);
    expect(animationCatalog.waterSurface.textureLocalPath).toBe("/game-assets/1.6.15/sprites/Cursors.png");
    expect(animationCatalog.crabPot.textureLocalPath).toBe("/game-assets/1.6.15/tilesheets/animations.png");
    expect(animationCatalog.crabPot.frames).toHaveLength(8);
    expect(animationCatalog.crabPot.frames[0]).toMatchObject({ x: 0, y: 0, width: 64, height: 64, durationMilliseconds: 150 });
    expect(animationCatalog.smoke).toMatchObject({ lifetimeSeconds: 6.25, tintColor: "#808080" });
    expect(animationCatalog.bubbles).toMatchObject({
      lifetimeSeconds: 4.6875,
      firstPlumeCount: 13,
      tintColor: "#00ff00",
      offsetX: 10.4,
      offsetY: -5.25,
    });

    expect(millAnimation?.kind).toBe("mill");
    if (millAnimation?.kind !== "mill") {
      throw new TypeError(`Expected Mill animation kind "mill"; received ${JSON.stringify(millAnimation?.kind)}.`);
    }
    expect(millAnimation.layers).toHaveLength(2);
    expect(millAnimation.layers.find((layer) => layer.id === "Default_WindSails")).toMatchObject({
      frameCount: 10,
      frameDurationMilliseconds: 90,
    });
    expect(millAnimation.layers.find((layer) => layer.id === "Default_Shaft")).toMatchObject({
      frameCount: 7,
      frameDurationMilliseconds: 90,
      onlyDrawIfChestHasContents: "Input",
    });
    expect(millAnimation.layers.find((layer) => layer.id === "Default_WindSails")?.onlyDrawIfChestHasContents).toBeUndefined();
    expect(millAnimation.outputChoices.map((choice) => choice.id)).toEqual(["246", "245", "423"]);
    expect(millAnimation.defaultOutputProductId).toBe("246");
    expect(millAnimation.chestBubble).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      chestId: "Output",
      displayTileX: 3,
      displayTileY: 1,
      displayHeight: 1.5,
      sourceRect: { x: 141, y: 465, width: 20, height: 24 },
      opacity: 0.75,
    });
    const stableAnimation = animationCatalog.buildingAnimationsById["building:Stable"];
    expect(stableAnimation?.kind === "stable-horse" ? stableAnimation.walkingFrameIndices : []).toEqual([
      21, 22, 23, 24, 23, 24, 23, 24, 23, 22, 21,
    ]);
    expect(Object.keys(animationCatalog.buildingAnimationsById).filter((buildingId) => buildingId.startsWith("building:") && animationCatalog.buildingAnimationsById[buildingId]?.kind === "chimney-smoke")).toHaveLength(24);
    expect(animationCatalog.aquariumFishById["128"]).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/sprites/AquariumFish.png",
      spriteIndex: 0,
      type: "float",
      simType: "float",
      idleFrame: 0,
      idleAnimation: null,
      fishBehavior: "normal",
    });
    expect(animationCatalog.aquariumFishById["151"]).toMatchObject({
      type: "cephalopod",
      simType: "cephalopod",
      idleFrame: 60,
      idleAnimation: [60],
      dartStart: [60, 61],
      dartHold: [62, 62, 63, 63],
      dartEnd: [63, 64],
      fishBehavior: "normal",
    });
    expect(animationCatalog.aquariumFishById["717"]).toMatchObject({
      type: "front_crawl",
      simType: "crawl",
      fishBehavior: null,
    });
    expect(animationCatalog.aquariumFishAtlas).toMatchObject({
      textureWidth: 480,
      textureHeight: 304,
      frameWidth: 24,
      frameHeight: 24,
      columns: 20,
      rowStride: 48,
      scaleFactor: 0.75,
      segmentWidthBySimulationType: { normal: 8, eel: 4 },
    });
    expect(animationCatalog.clothingById["hat:0"]).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/hats.png",
    });
    expect(animationCatalog.clothingById["shirt:1000"]).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/farmer/shirts.png",
      dyeTextureLocalPath: "/game-assets/1.6.15/farmer/shirts.png",
      canBeDyed: false,
      defaultColor: null,
      hasSleeves: true,
    });
    expect(animationCatalog.clothingById["pants:0"]).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/farmer/pants.png",
      canBeDyed: true,
      defaultColor: 16772043,
    });
    expect(animationCatalog.farmAnimalsById["White Chicken"]).toMatchObject({
      requiredBuilding: "Coop",
      useFlippedRightForLeft: false,
      useDoubleUniqueAnimationFrames: true,
    });
    expect(animationCatalog.farmAnimalsById.Dinosaur).toMatchObject({
      requiredBuilding: null,
      useFlippedRightForLeft: true,
      useDoubleUniqueAnimationFrames: true,
    });
    expect(animationCatalog.mannequinsById).toMatchObject({
      furniture_mannequin_male: {
        textureLocalPath: "/game-assets/1.6.15/farmer/farmer_base_mannequin.png",
        isMale: true,
        cursed: false,
      },
      furniture_mannequin_female: {
        textureLocalPath: "/game-assets/1.6.15/farmer/farmer_girl_mannequin.png",
        isMale: false,
        cursed: false,
      },
      furniture_mannequin_cursed_male: {
        textureLocalPath: "/game-assets/1.6.15/farmer/farmer_base_mannequin_cursed.png",
        isMale: true,
        cursed: true,
      },
      furniture_mannequin_cursed_female: {
        textureLocalPath: "/game-assets/1.6.15/farmer/farmer_girl_mannequin_cursed.png",
        isMale: false,
        cursed: true,
      },
    });
    const wineChoice = animationCatalog.machineOutputsById["big-craftable:12"]?.find((choice) => choice.id === "348");
    expect(wineChoice).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Objects_2.png",
      sourceRect: { x: 48, y: 240, width: 16, height: 16 },
      colorOverlay: true,
      overlaySourceRect: { x: 64, y: 240, width: 16, height: 16 },
    });
    const roeChoice = Object.values(animationCatalog.pondFishById)
      .flatMap((pondFish) => pondFish.produce)
      .find((choice) => choice.id === "812");
    expect(roeChoice).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sourceRect: { x: 320, y: 528, width: 16, height: 16 },
      colorOverlay: true,
      overlaySourceRect: { x: 336, y: 528, width: 16, height: 16 },
    });
    const anvilTrinket = animationCatalog.machineOutputsById["big-craftable:Anvil"]?.find((choice) => choice.id === "FrogEgg");
    expect(anvilTrinket).toMatchObject({
      label: "Frog Egg",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Objects_2.png",
      sourceRect: { x: 96, y: 0, width: 16, height: 16 },
    });
  });

  it("supports empty fish ponds and limits population controls to the selected fish maximum", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const legendaryFishControls = getAnimationControlsForCatalogItem(
      animationCatalog,
      "building:Fish Pond",
      { fishId: "163", population: 1 },
    );
    const commonFishId = "128";

    const commonFishControls = getAnimationControlsForCatalogItem(
      animationCatalog,
      "building:Fish Pond",
      { fishId: commonFishId, population: 1 },
    );
    expect(legendaryFishControls.find((control) => control.key === "population")).toMatchObject({ maximum: 1 });
    expect(commonFishControls.find((control) => control.key === "population")).toMatchObject({ maximum: 10 });
    expect(legendaryFishControls.find((control) => control.key === "population")).toMatchObject({ minimum: 0 });
    expect(animationCatalog.pondFishById["128"]).toMatchObject({
      id: "128",
      label: "Pufferfish",
      maxPopulation: 10,
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sourceRect: { x: 128, y: 80, width: 16, height: 16 },
    });
    expect(animationCatalog.pondFishById["130"]).toMatchObject({ id: "130", label: "Tuna", maxPopulation: 10 });
    expect(animationCatalog.pondFishById["163"]).toMatchObject({ id: "163", label: "Legend", maxPopulation: 1 });
    const pondFishIds = Object.keys(animationCatalog.pondFishById).sort();
    const oneFishLegendaryIds = Object.values(animationCatalog.pondFishById)
      .filter((pondFish) => pondFish.maxPopulation === 1)
      .map((pondFish) => pondFish.id)
      .sort();
    expect(pondFishIds).toHaveLength(73);
    expect(oneFishLegendaryIds).toEqual(["159", "160", "163", "682", "775", "898", "899", "900", "901", "902"]);
    expect(animationCatalog.pondFishById.LegendaryFish).toBeUndefined();
    expect(animationCatalog.pondFishById.OceanFish).toBeUndefined();
    expect(animationCatalog.pondFishById.Default).toBeUndefined();
    const fishWithProduce = Object.values(animationCatalog.pondFishById).find(
      (pondFish) => pondFish.produce.some((produceChoice) => produceChoice.requiredPopulation > 0),
    );
    expect(fishWithProduce).toBeDefined();
    const emptyFishPondControls = getAnimationControlsForCatalogItem(
      animationCatalog,
      "building:Fish Pond",
      { fishId: fishWithProduce?.id, population: 0 },
    );
    const emptyPondProduceChoices = emptyFishPondControls.find((control) => control.key === "produce");
    if (emptyPondProduceChoices?.kind !== "select") {
      throw new TypeError(`Expected Fish Pond produce select control; received ${JSON.stringify(emptyPondProduceChoices)}.`);
    }
    expect(emptyPondProduceChoices.choices.map((choice) => choice.id)).toEqual(
      fishWithProduce?.produce
        .filter((produceChoice) => produceChoice.requiredPopulation === 0)
        .map((produceChoice) => produceChoice.id),
    );
    expect(() => getAnimationControlsForCatalogItem(animationCatalog, "building:Fish Pond", { population: -1 }))
      .toThrow(/non-negative safe integer.*-1/);
    expect(() => getAnimationControlsForCatalogItem(animationCatalog, "building:Fish Pond", { fishId: "invalid-fish" }))
      .toThrow(/unknown fishId.*invalid-fish/);
  });

  it("offers pet hats to cats and dogs but not turtles", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const catControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Pet Bowl", { petId: "Cat:0" });
    const dogControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Pet Bowl", { petId: "Dog:0" });
    const turtleControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Pet Bowl", { petId: "Turtle:0" });

    expect(catControls.find((control) => control.key === "hatId")).toBeDefined();
    expect(dogControls.find((control) => control.key === "hatId")).toBeDefined();
    expect(turtleControls.find((control) => control.key === "hatId")).toBeUndefined();
    expect(() => getAnimationControlsForCatalogItem(animationCatalog, "building:Pet Bowl", { petId: "Turtle:unknown" }))
      .toThrow(/unknown petId.*Turtle:unknown/);
  });

  it("shows Mill product choices only while output is enabled and Stable hats only with a horse", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const millDisabledControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Mill");
    const millEnabledControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Mill", { millOutput: true });
    const stableDisabledControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Stable");
    const stableEnabledControls = getAnimationControlsForCatalogItem(animationCatalog, "building:Stable", { horse: true });

    expect(millDisabledControls.map((control) => control.key)).toEqual(["millLoaded", "millOutput"]);
    expect(millEnabledControls.map((control) => control.key)).toEqual(["millLoaded", "millOutput", "millProduct"]);
    expect(millEnabledControls.find((control) => control.key === "millProduct")).toMatchObject({
      kind: "select",
      choices: [{ id: "246" }, { id: "245" }, { id: "423" }],
    });
    expect(stableDisabledControls.map((control) => control.key)).toEqual(["horse"]);
    expect(stableEnabledControls.map((control) => control.key)).toEqual(["horse", "hatId"]);
  });

  it("resolves verified breed, facing, frame, and hat atlas coordinates", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const catDownHat = getPetHatRenderDescriptor(animationCatalog, "Cat:0", "0", 0, false);
    const catSideHat = getPetHatRenderDescriptor(animationCatalog, "Cat:3", "73", 12, false);

    expect(catDownHat).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/hats_animals.png",
      sourceRect: { x: 0, y: 0, width: 20, height: 20 },
      direction: 2,
      offsetXInTiles: 6.5,
      offsetYInTiles: -10,
      scaleFactor: 1,
    });
    expect(catSideHat).toMatchObject({
      sourceRect: { x: 20, y: 520, width: 20, height: 20 },
      direction: 3,
      offsetXInTiles: 0,
      offsetYInTiles: -12,
    });
    expect(() => getPetHatRenderDescriptor(animationCatalog, "Turtle:0", "0", 0, false))
      .toThrow(/does not support turtle petId/);
    expect(() => getPetHatRenderDescriptor(animationCatalog, "Cat:0", "0", 32, false))
      .toThrow(/bodyFrameIndex must be below 32/);
  });

  it("resolves stable horse hat frame and hat-specific offsets", async () => {
    const animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
    const visibleSideHat = getStableHorseHatRenderDescriptor(animationCatalog, "0", 21);
    const hiddenFrontHat = getStableHorseHatRenderDescriptor(animationCatalog, "14", 14);
    const missingPoseHat = getStableHorseHatRenderDescriptor(animationCatalog, "0", 26);

    expect(visibleSideHat).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/hats_animals.png",
      sourceRect: { x: 0, y: 40, width: 20, height: 20 },
      direction: 3,
      offsetXInTiles: -4,
      offsetYInTiles: -17,
      scaleFactor: 1,
    });
    expect(hiddenFrontHat).toBeNull();
    expect(missingPoseHat).toBeNull();
    expect(() => getStableHorseHatRenderDescriptor(animationCatalog, "0", 28))
      .toThrow(/horseFrameIndex must be below 28/);
  });

  it("clears a failed default request and shares the successful retry", async () => {
    const failedFetch = vi.fn<typeof fetch>().mockRejectedValue(new Error("network offline"));
    vi.stubGlobal("fetch", failedFetch);
    await expect(loadPlannerAnimationCatalog()).rejects.toThrow(/network offline/);

    const successfulFetch = createLocalFetchResponse();
    vi.stubGlobal("fetch", successfulFetch);
    const [firstAnimationCatalog, secondAnimationCatalog] = await Promise.all([
      loadPlannerAnimationCatalog(),
      loadPlannerAnimationCatalog(),
    ]);

    expect(firstAnimationCatalog).toBe(secondAnimationCatalog);
    expect(successfulFetch).toHaveBeenCalledTimes(12);
    expect(firstAnimationCatalog.pondFishById["163"]?.maxPopulation).toBe(1);
  });
});
