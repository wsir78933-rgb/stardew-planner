import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { CatalogItem, CatalogSeason } from "../../src/catalog";
import type { CatalogJsonFetcher } from "../../src/catalog/catalog-types";
import {
  getAnimationControlsForCatalogItem,
  getPetHatRenderDescriptor,
  loadPlannerAnimationCatalog,
} from "../../src/animations/animation-catalog";
import type { AnimationCatalog } from "../../src/animations/animation-catalog";
import type { PlacementBuilding, PlacementCrop, PlacementItem } from "../../src/placement/placement-snapshot";
import type { MapPlacementCapabilities, MapPlacementGrid } from "../../src/placement/map-placement-grids";
import type { PlacementRenderEntry, PlacementSpriteMotionSample } from "../../src/rendering/placement-rendering";
import {
  createPlacementBuildingCharacterRenderEntries,
} from "../../src/rendering/placement-character-animation-rendering";

let animationCatalog: AnimationCatalog;

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

function createMapGrid(
  width: number,
  height: number,
  waterTiles: readonly string[] = [],
  wallTiles: readonly string[] = [],
): MapPlacementGrid {
  const waterTileKeys = new Set(waterTiles);
  const wallTileKeys = new Set(wallTiles);
  const capabilitiesByTile: MapPlacementCapabilities[] = [];
  for (let tileY = 0; tileY < height; tileY += 1) {
    for (let tileX = 0; tileX < width; tileX += 1) {
      const tileKey = `${String(tileX)},${String(tileY)}`;
      const isWater = waterTileKeys.has(tileKey);
      const isWall = wallTileKeys.has(tileKey);
      capabilitiesByTile.push({
        buildable: !isWater && !isWall,
        diggable: false,
        passable: !isWater && !isWall,
        treePlantable: false,
        treePlantableOnDirt: false,
        wall: isWall,
        water: isWater,
        crabPot: false,
      });
    }
  }
  return { width, height, capabilitiesByTile };
}

function createBuildingCatalogItem(
  buildingId: string,
  tileSize: Readonly<{ width: number; height: number }>,
): CatalogItem {
  return {
    id: `building:${buildingId}`,
    name: buildingId,
    category: "building",
    tileSize,
    textureLocalPath: `/game-assets/1.6.15/buildings/${buildingId}.png`,
    sprite: { kind: "source-rect", x: 0, y: 0, width: 0, height: 0 },
    allowedTools: [],
  };
}

function createBuilding(
  buildingId: string,
  x: number,
  y: number,
  animationOptions: PlacementBuilding["animationOptions"],
  instanceId = 1,
): PlacementBuilding {
  return { buildingId, x, y, instanceId, animationOptions };
}

function createGrassItem(x: number, y: number, instanceId: number): PlacementItem {
  return {
    instanceId,
    itemId: "grass_1",
    x,
    y,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: true,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function createInput(options: Readonly<{
  building: PlacementBuilding;
  footprint: Readonly<{ width: number; height: number }>;
  mapPlacementGrid?: MapPlacementGrid;
  placementBuildings?: readonly PlacementBuilding[];
  placementItems?: readonly PlacementItem[];
  placementCrops?: readonly PlacementCrop[];
  season?: CatalogSeason;
  isNightMode?: boolean;
}>): Parameters<typeof createPlacementBuildingCharacterRenderEntries>[0] {
  const buildingCatalogItem = createBuildingCatalogItem(options.building.buildingId, options.footprint);
  const placementBuildings = options.placementBuildings ?? [options.building];
  return {
    animationCatalog,
    building: options.building,
    buildingCatalogItem,
    buildingEntries: [],
    placementBuildings,
    placementItems: options.placementItems ?? [],
    catalogItemsById: new Map(placementBuildings.map((placementBuilding) => [
      `building:${placementBuilding.buildingId}`,
      placementBuilding.instanceId === options.building.instanceId
        ? buildingCatalogItem
        : createBuildingCatalogItem(placementBuilding.buildingId, { width: 4, height: 3 }),
    ])),
    mapPlacementGrid: options.mapPlacementGrid ?? createMapGrid(24, 20),
    season: options.season ?? "spring",
    isNightMode: options.isNightMode ?? false,
    placementCrops: options.placementCrops ?? [],
  };
}

function getMotionSample(
  renderEntry: PlacementRenderEntry,
  currentTimeMilliseconds: number,
): PlacementSpriteMotionSample {
  if (renderEntry.animation?.kind !== "sprite-motion") {
    throw new TypeError(`Test expected sprite-motion animation for ${JSON.stringify(renderEntry.layerId)}.`);
  }
  return renderEntry.animation.sample(currentTimeMilliseconds);
}

async function assertLocalTextureExists(textureLocalPath: string): Promise<void> {
  await readLocalPngDimensions(textureLocalPath);
}

async function readLocalPngDimensions(textureLocalPath: string): Promise<Readonly<{ width: number; height: number }>> {
  const localTexturePath = join(process.cwd(), "public", textureLocalPath.slice(1));
  const pngBytes = await readFile(localTexturePath);
  if (pngBytes.length < 24 || !pngBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new TypeError(`Animation texture ${JSON.stringify(textureLocalPath)} is not a complete PNG file.`);
  }
  if (pngBytes.toString("ascii", 12, 16) !== "IHDR") {
    throw new TypeError(`Animation texture ${JSON.stringify(textureLocalPath)} has no PNG IHDR chunk.`);
  }
  const width = pngBytes.readUInt32BE(16);
  const height = pngBytes.readUInt32BE(20);
  if (width === 0 || height === 0) {
    throw new RangeError(`Animation texture ${JSON.stringify(textureLocalPath)} has invalid PNG dimensions ${String(width)}x${String(height)}.`);
  }
  return { width, height };
}

function assertSourceRectWithinTexture(
  sourceRect: Readonly<{ x: number; y: number; width: number; height: number }>,
  textureDimensions: Readonly<{ width: number; height: number }>,
  sourceLabel: string,
): void {
  expect(sourceRect.x, `${sourceLabel} source x`).toBeGreaterThanOrEqual(0);
  expect(sourceRect.y, `${sourceLabel} source y`).toBeGreaterThanOrEqual(0);
  expect(sourceRect.width, `${sourceLabel} source width`).toBeGreaterThan(0);
  expect(sourceRect.height, `${sourceLabel} source height`).toBeGreaterThan(0);
  expect(sourceRect.x + sourceRect.width, `${sourceLabel} right edge`).toBeLessThanOrEqual(textureDimensions.width);
  expect(sourceRect.y + sourceRect.height, `${sourceLabel} bottom edge`).toBeLessThanOrEqual(textureDimensions.height);
}

function assertAnimationFramesWithinTexture(
  renderEntry: PlacementRenderEntry,
  textureDimensions: Readonly<{ width: number; height: number }>,
  sampleTimesMilliseconds: readonly number[],
): void {
  const spriteMotionAnimation = renderEntry.animation;
  if (spriteMotionAnimation?.kind !== "sprite-motion") {
    throw new TypeError(`Expected sprite-motion animation for ${JSON.stringify(renderEntry.layerId)}.`);
  }
  const firstMotionFrame = spriteMotionAnimation.frames[0];
  if (firstMotionFrame === undefined) {
    throw new RangeError(`Animation layer ${JSON.stringify(renderEntry.layerId)} has no source frames.`);
  }
  expect(renderEntry.frame, `${String(renderEntry.layerId)} descriptor frame must match first motion frame`).toBe(firstMotionFrame);
  for (const [frameIndex, sourceRect] of spriteMotionAnimation.frames.entries()) {
    assertSourceRectWithinTexture(sourceRect, textureDimensions, `${String(renderEntry.layerId)} frame ${String(frameIndex)}`);
  }
  for (const sampleTimeMilliseconds of sampleTimesMilliseconds) {
    const sampleFrameIndex = spriteMotionAnimation.sample(sampleTimeMilliseconds).frameIndex;
    if (sampleFrameIndex === undefined || !Number.isSafeInteger(sampleFrameIndex) || sampleFrameIndex < 0) {
      throw new RangeError(
        `Animation layer ${JSON.stringify(renderEntry.layerId)} selected invalid frameIndex ${String(sampleFrameIndex)} at ${String(sampleTimeMilliseconds)}ms.`,
      );
    }
    const sampledSourceRect = spriteMotionAnimation.frames[sampleFrameIndex];
    if (sampledSourceRect === undefined) {
      throw new RangeError(
        `Animation layer ${JSON.stringify(renderEntry.layerId)} selected frameIndex ${String(sampleFrameIndex)} outside ${String(spriteMotionAnimation.frames.length)} frames at ${String(sampleTimeMilliseconds)}ms.`,
      );
    }
    assertSourceRectWithinTexture(
      sampledSourceRect,
      textureDimensions,
      `${String(renderEntry.layerId)} sampled frame ${String(sampleFrameIndex)} at ${String(sampleTimeMilliseconds)}ms`,
    );
  }
}

function assertInitialGeometryMatchesMotionSample(renderEntry: PlacementRenderEntry): void {
  const spriteMotionAnimation = renderEntry.animation;
  const pixelGeometry = renderEntry.pixelGeometry;
  if (spriteMotionAnimation?.kind !== "sprite-motion" || pixelGeometry === undefined) {
    throw new TypeError(`Expected sprite-motion geometry for ${JSON.stringify(renderEntry.layerId)}.`);
  }
  const initialMotionSample = spriteMotionAnimation.sample(0);
  if (initialMotionSample.positionX !== undefined) {
    expect(pixelGeometry.positionX, `${String(renderEntry.layerId)} initial x`).toBe(initialMotionSample.positionX);
  }
  if (initialMotionSample.positionY !== undefined) {
    expect(pixelGeometry.positionY, `${String(renderEntry.layerId)} initial y`).toBe(initialMotionSample.positionY);
  }
  const initialGeometryScale = pixelGeometry.uniformScale ?? 1;
  if (initialMotionSample.scaleX !== undefined) {
    expect(initialGeometryScale * pixelGeometry.horizontalScale, `${String(renderEntry.layerId)} initial x scale`)
      .toBeCloseTo(initialMotionSample.scaleX);
  }
  if (initialMotionSample.scaleY !== undefined) {
    expect(initialGeometryScale, `${String(renderEntry.layerId)} initial y scale`).toBeCloseTo(initialMotionSample.scaleY);
  }
}

function getDeluxeAnimalHouseId(animalHouseType: string): string {
  if (animalHouseType === "Coop") {
    return "Deluxe Coop";
  }
  if (animalHouseType === "Barn") {
    return "Deluxe Barn";
  }
  throw new RangeError(`Farm animal house type has no Deluxe test building: ${JSON.stringify(animalHouseType)}.`);
}

beforeAll(async () => {
  animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
});

describe("placement building character animation rendering", () => {
  it("animates configured farm animals on bounded passable routes and uses source sheet frames", async () => {
    const coop = createBuilding("Coop", 4, 4, {
      animals: [{ animalId: "White Chicken" }, { animalId: "White Chicken" }],
    });
    const renderedCharacters = createPlacementBuildingCharacterRenderEntries(createInput({
      building: coop,
      footprint: { width: 6, height: 3 },
      placementItems: [createGrassItem(11, 7, 2)],
    }));

    expect(renderedCharacters).toHaveLength(2);
    expect(renderedCharacters[0]).toMatchObject({
      layerId: "farm-animal-0-White Chicken",
      textureLocalPath: animationCatalog.farmAnimalsById["White Chicken"]?.textureLocalPath,
      frame: { width: 16, height: 16 },
    });
    const chickenMotion = renderedCharacters[0];
    if (chickenMotion === undefined) {
      throw new Error("Expected first chicken render entry.");
    }
    const changingPositions = new Set(
      Array.from({ length: 12 }, (_, sampleIndex) => {
        const sample = getMotionSample(chickenMotion, sampleIndex * 100);
        return `${String(sample.positionX)},${String(sample.positionY)}`;
      }),
    );
    expect(changingPositions.size).toBeGreaterThan(1);
    expect(getMotionSample(chickenMotion, 320)).toMatchObject({ frameIndex: expect.any(Number) });
    assertInitialGeometryMatchesMotionSample(chickenMotion);
    await assertLocalTextureExists(chickenMotion.textureLocalPath ?? "");
  });

  it("keeps farm animal routes on the passable side of water barriers", () => {
    const coop = createBuilding("Coop", 4, 4, { animals: [{ animalId: "White Chicken" }] });
    const waterTiles = Array.from({ length: 20 }, (_, tileY) => `8,${String(tileY)}`);
    const renderedCharacters = createPlacementBuildingCharacterRenderEntries(createInput({
      building: coop,
      footprint: { width: 6, height: 3 },
      mapPlacementGrid: createMapGrid(20, 20, waterTiles),
      placementItems: [createGrassItem(10, 7, 2)],
    }));
    const chickenMotion = renderedCharacters[0];
    if (chickenMotion === undefined) {
      throw new Error("Expected chicken render entry beside water barrier.");
    }
    for (let sampleIndex = 0; sampleIndex < 50; sampleIndex += 1) {
      const sample = getMotionSample(chickenMotion, sampleIndex * 150);
      expect(Math.floor((sample.positionX ?? 0) / 16)).toBeLessThan(8);
    }
  });

  it("keeps a Coop's selected grass route outside the full host footprint", () => {
    const coop = createBuilding("Coop", 4, 4, { animals: [{ animalId: "White Chicken" }] });
    const chickenEntry = createPlacementBuildingCharacterRenderEntries(createInput({
      building: coop,
      footprint: { width: 6, height: 3 },
      placementItems: [createGrassItem(7, 3, 2)],
    }))[0];
    if (chickenEntry === undefined) {
      throw new Error("Expected White Chicken render entry for the Coop host-footprint route test.");
    }

    let hostFootprintSampleCount = 0;
    for (let sampleIndex = 0; sampleIndex < 100; sampleIndex += 1) {
      const currentTimeMilliseconds = sampleIndex * 10;
      const sample = getMotionSample(chickenEntry, currentTimeMilliseconds);
      const tileX = Math.floor((sample.positionX ?? 0) / 16);
      const tileY = Math.floor((sample.positionY ?? 0) / 16);
      const isInsideCoop = tileX >= 4 && tileX < 10 && tileY >= 4 && tileY < 7;
      if (isInsideCoop) {
        hostFootprintSampleCount += 1;
      }
    }
    expect(hostFootprintSampleCount, "100 samples from the Coop(4,4), 6x3, grass(7,3) fixture must stay outside its host footprint.").toBe(0);
  });

  it("lets Ducks swim across water with the source swim frames and avoids both host and other buildings", async () => {
    const farmAnimalSource = JSON.parse(await readFile(
      join(process.cwd(), "public", "game-assets/1.6.15/data/FarmAnimals.json"),
      "utf8",
    )) as Readonly<Record<string, Readonly<{ CanSwim: boolean; SwimOffset: Readonly<{ Y: number }> }>>>;
    expect(farmAnimalSource.Duck?.CanSwim).toBe(true);
    expect(farmAnimalSource.Duck?.SwimOffset.Y).toBe(112);
    expect(animationCatalog.farmAnimalsById.Duck?.canSwim).toBe(true);

    const bigCoop = createBuilding("Big Coop", 4, 4, { animals: [{ animalId: "Duck" }] }, 20);
    const otherBuilding = createBuilding("Shed", 8, 7, undefined, 21);
    const waterTiles = Array.from({ length: 20 }, (_, tileY) => `12,${String(tileY)}`);
    const duckEntry = createPlacementBuildingCharacterRenderEntries(createInput({
      building: bigCoop,
      footprint: { width: 7, height: 3 },
      placementBuildings: [bigCoop, otherBuilding],
      mapPlacementGrid: createMapGrid(24, 20, waterTiles),
      placementItems: [createGrassItem(13, 10, 22)],
    }))[0];
    if (duckEntry === undefined) {
      throw new Error("Expected Duck animation entry to cross the water lane to reachable grass.");
    }
    const duckTextureDimensions = await readLocalPngDimensions(duckEntry.textureLocalPath ?? "");
    const sampledTimes = Array.from({ length: 601 }, (_, sampleIndex) => sampleIndex * 100);
    assertAnimationFramesWithinTexture(duckEntry, duckTextureDimensions, sampledTimes);

    let landSampleCount = 0;
    let swimSampleCount = 0;
    let maximumSampledTileX = 0;
    for (const currentTimeMilliseconds of sampledTimes) {
      const sample = getMotionSample(duckEntry, currentTimeMilliseconds);
      const tileX = Math.floor((sample.positionX ?? 0) / 16);
      const tileY = Math.floor((sample.positionY ?? 0) / 16);
      maximumSampledTileX = Math.max(maximumSampledTileX, tileX);
      const isInWater = tileX === 12;
      const isInsideBigCoop = tileX >= 4 && tileX < 11 && tileY >= 4 && tileY < 7;
      const isInsideShed = tileX >= 8 && tileX < 12 && tileY >= 7 && tileY < 10;
      expect(isInsideBigCoop, `Duck crossed Big Coop footprint at ${String(currentTimeMilliseconds)}ms.`).toBe(false);
      expect(isInsideShed, `Duck crossed Shed footprint at ${String(currentTimeMilliseconds)}ms.`).toBe(false);

      const frameIndex = sample.frameIndex;
      if (frameIndex === undefined) {
        throw new Error(`Duck sample has no frameIndex at ${String(currentTimeMilliseconds)}ms.`);
      }
      const sampledFrame = duckEntry.animation?.kind === "sprite-motion"
        ? duckEntry.animation.frames[frameIndex]
        : undefined;
      if (sampledFrame === undefined) {
        throw new RangeError(`Duck sample selected missing frame ${String(frameIndex)} at ${String(currentTimeMilliseconds)}ms.`);
      }
      expect(sampledFrame.y >= 112, `Duck swim frame must use y offset 112 at ${String(currentTimeMilliseconds)}ms.`).toBe(isInWater);
      if (isInWater) {
        swimSampleCount += 1;
      } else {
        landSampleCount += 1;
      }
    }
    expect(landSampleCount).toBeGreaterThan(0);
    expect(swimSampleCount, `Duck maximum sampled tile x was ${String(maximumSampledTileX)}.`).toBeGreaterThan(0);
  });

  it("fails with the invalid animal id and hides farm animals at night", () => {
    const invalidCoop = createBuilding("Coop", 4, 4, { animals: [{ animalId: "Uncatalogued Animal" }] });
    expect(() => createPlacementBuildingCharacterRenderEntries(createInput({
      building: invalidCoop,
      footprint: { width: 6, height: 3 },
    }))).toThrow(/animalId "Uncatalogued Animal"/);

    const validCoop = createBuilding("Coop", 4, 4, { animals: [{ animalId: "White Chicken" }] });
    expect(createPlacementBuildingCharacterRenderEntries(createInput({
      building: validCoop,
      footprint: { width: 6, height: 3 },
      isNightMode: true,
    }))).toEqual([]);
  });

  it("renders pets with configured hats and keeps nighttime sleep frames visible", async () => {
    const petBowl = createBuilding("Pet Bowl", 4, 4, { petId: "Cat:0", hatId: "0" });
    const petEntries = createPlacementBuildingCharacterRenderEntries(createInput({
      building: petBowl,
      footprint: { width: 2, height: 2 },
    }));
    expect(petEntries).toHaveLength(2);
    const petBody = petEntries[0];
    const petHat = petEntries[1];
    if (petBody === undefined || petHat === undefined) {
      throw new Error("Expected pet body and hat render entries.");
    }
    expect(petBody.layerId).toBe("pet-body-Cat:0");
    expect(petBody.textureLocalPath).toBe(animationCatalog.petsById["Cat:0"]?.textureLocalPath);
    const petMotionAtStart = getMotionSample(petBody, 0);
    const petMotionLater = getMotionSample(petBody, 700);
    expect(`${String(petMotionAtStart.positionX)},${String(petMotionAtStart.positionY)}`).not.toBe(
      `${String(petMotionLater.positionX)},${String(petMotionLater.positionY)}`,
    );
    const hatMotion = getMotionSample(petHat, 0);
    const expectedHatDescriptor = getPetHatRenderDescriptor(animationCatalog, "Cat:0", "0", petMotionAtStart.frameIndex ?? 0, false);
    expect(petHat.textureLocalPath).toBe(expectedHatDescriptor.textureLocalPath);
    expect(hatMotion.positionX).toBeCloseTo((petMotionAtStart.positionX ?? 0) + expectedHatDescriptor.offsetXInTiles);
    expect(hatMotion.positionY).toBeCloseTo((petMotionAtStart.positionY ?? 0) + 20 + expectedHatDescriptor.offsetYInTiles);
    await assertLocalTextureExists(petBody.textureLocalPath ?? "");
    await assertLocalTextureExists(petHat.textureLocalPath ?? "");

    const nighttimeEntries = createPlacementBuildingCharacterRenderEntries(createInput({
      building: petBowl,
      footprint: { width: 2, height: 2 },
      isNightMode: true,
    }));
    const nighttimePet = nighttimeEntries[0];
    if (nighttimePet === undefined) {
      throw new Error("Expected nighttime pet render entry.");
    }
    expect(getMotionSample(nighttimePet, 0).frameIndex).toBe(28);
    expect(getMotionSample(nighttimePet, 1_000).frameIndex).toBe(29);
  });

  it("keeps pet and Junimo loops outside their host after the initial exit", () => {
    const mapPlacementGrid = createMapGrid(24, 20);
    const petBowl = createBuilding("Pet Bowl", 4, 4, { petId: "Cat:0" }, 501);
    const petBody = createPlacementBuildingCharacterRenderEntries(createInput({
      building: petBowl,
      footprint: { width: 2, height: 2 },
      mapPlacementGrid,
    })).find((renderEntry) => renderEntry.layerId === "pet-body-Cat:0");
    if (petBody === undefined) {
      throw new Error("Expected Cat:0 body entry for the host re-entry regression.");
    }

    let petStartsInsideHost = false;
    let petHasExitedHost = false;
    let petReenteredHost = false;
    for (let sampleIndex = 0; sampleIndex <= 4_800; sampleIndex += 1) {
      const currentTimeMilliseconds = sampleIndex * 25;
      const sample = getMotionSample(petBody, currentTimeMilliseconds);
      const tileX = Math.floor((sample.positionX ?? 0) / 16);
      const tileY = Math.floor(((sample.positionY ?? 0) + 20) / 16);
      const isInsidePetBowl = tileX >= 4 && tileX < 6 && tileY >= 4 && tileY < 6;
      if (sampleIndex === 0) {
        petStartsInsideHost = isInsidePetBowl;
      }
      if (!isInsidePetBowl) {
        petHasExitedHost = true;
      } else if (petHasExitedHost) {
        petReenteredHost = true;
      }
    }
    expect(petStartsInsideHost).toBe(true);
    expect(petHasExitedHost).toBe(true);
    expect(petReenteredHost, "Cat:0 must not re-enter its Pet Bowl during later route cycles.").toBe(false);

    const junimoHut = createBuilding("Junimo Hut", 4, 4, { junimos: true }, 502);
    const junimoBody = createPlacementBuildingCharacterRenderEntries(createInput({
      building: junimoHut,
      footprint: { width: 3, height: 2 },
      mapPlacementGrid,
      placementCrops: [{ cropId: "crop:Parsnip", x: 9, y: 7 }],
    })).find((renderEntry) => renderEntry.layerId === "junimo-0");
    if (junimoBody === undefined) {
      throw new Error("Expected Junimo body entry for the host re-entry regression.");
    }

    let junimoStartsInsideHost = false;
    let junimoHasExitedHost = false;
    let junimoReenteredHost = false;
    for (let sampleIndex = 0; sampleIndex <= 4_800; sampleIndex += 1) {
      const currentTimeMilliseconds = sampleIndex * 25;
      const sample = getMotionSample(junimoBody, currentTimeMilliseconds);
      const tileX = Math.floor(((sample.positionX ?? 0) - 2) / 16);
      const tileY = Math.floor(((sample.positionY ?? 0) - 9) / 16);
      const isInsideJunimoHut = tileX >= 4 && tileX < 7 && tileY >= 4 && tileY < 6;
      if (sampleIndex === 0) {
        junimoStartsInsideHost = isInsideJunimoHut;
      }
      if (!isInsideJunimoHut) {
        junimoHasExitedHost = true;
      } else if (junimoHasExitedHost) {
        junimoReenteredHost = true;
      }
    }
    expect(junimoStartsInsideHost).toBe(true);
    expect(junimoHasExitedHost).toBe(true);
    expect(junimoReenteredHost, "Junimo must not re-enter its Hut during later route cycles.").toBe(false);
  });

  it("keeps every farm-animal and pet catalog frame inside its decoded source PNG", async () => {
    const farmAnimalDefinitions = Object.values(animationCatalog.farmAnimalsById);
    const petDefinitions = Object.values(animationCatalog.petsById);
    expect(farmAnimalDefinitions).toHaveLength(14);
    expect(petDefinitions).toHaveLength(12);

    for (const [animalIndex, animalDefinition] of farmAnimalDefinitions.entries()) {
      const buildingId = getDeluxeAnimalHouseId(animalDefinition.house);
      const animalControls = getAnimationControlsForCatalogItem(animationCatalog, `building:${buildingId}`);
      const animalListControl = animalControls.find((controlDefinition) =>
        controlDefinition.kind === "animalList" && controlDefinition.key === "animals"
      );
      if (animalListControl?.kind !== "animalList" || !animalListControl.choices.some((choice) => choice.id === animalDefinition.id)) {
        throw new RangeError(
          `Deluxe animal house ${JSON.stringify(buildingId)} does not allow catalog animalId ${JSON.stringify(animalDefinition.id)}.`,
        );
      }
      const animalBuilding = createBuilding(buildingId, 4, 4, { animals: [{ animalId: animalDefinition.id }] }, animalIndex + 100);
      const animalEntry = createPlacementBuildingCharacterRenderEntries(createInput({
        building: animalBuilding,
        footprint: { width: 6, height: 3 },
      }))[0];
      if (animalEntry === undefined) {
        throw new Error(`Expected render entry for farm animal ${JSON.stringify(animalDefinition.id)}.`);
      }
      const animalTextureDimensions = await readLocalPngDimensions(animalDefinition.textureLocalPath);
      assertAnimationFramesWithinTexture(animalEntry, animalTextureDimensions, [0, 175, 350, 525, 700, 875, 1_050, 1_400]);
      assertInitialGeometryMatchesMotionSample(animalEntry);
    }

    let foundFlippedPetHatPose = false;
    for (const petDefinition of petDefinitions) {
      const petCanWearHat = petDefinition.species !== "Turtle";
      const petAnimationOptions = petCanWearHat
        ? { petId: petDefinition.id, hatId: "0" }
        : { petId: petDefinition.id };
      const daytimeEntries = createPlacementBuildingCharacterRenderEntries(createInput({
        building: createBuilding("Pet Bowl", 4, 4, petAnimationOptions, petDefinition.breedId.length + 300),
        footprint: { width: 2, height: 2 },
      }));
      const nighttimeEntries = createPlacementBuildingCharacterRenderEntries(createInput({
        building: createBuilding("Pet Bowl", 4, 4, petAnimationOptions, petDefinition.breedId.length + 400),
        footprint: { width: 2, height: 2 },
        isNightMode: true,
      }));
      const daytimeBodyEntry = daytimeEntries.find((renderEntry) => renderEntry.layerId === `pet-body-${petDefinition.id}`);
      const nighttimeBodyEntry = nighttimeEntries.find((renderEntry) => renderEntry.layerId === `pet-body-${petDefinition.id}`);
      if (daytimeBodyEntry === undefined || nighttimeBodyEntry === undefined) {
        throw new Error(`Expected daytime and nighttime pet entries for ${JSON.stringify(petDefinition.id)}.`);
      }
      const petTextureDimensions = await readLocalPngDimensions(petDefinition.textureLocalPath);
      assertAnimationFramesWithinTexture(daytimeBodyEntry, petTextureDimensions, [0, 175, 350, 525, 700, 875, 1_050, 1_400]);
      assertAnimationFramesWithinTexture(nighttimeBodyEntry, petTextureDimensions, [0, 1_000]);
      assertInitialGeometryMatchesMotionSample(daytimeBodyEntry);
      assertInitialGeometryMatchesMotionSample(nighttimeBodyEntry);

      if (!petCanWearHat) {
        expect(daytimeEntries).toHaveLength(1);
        expect(nighttimeEntries).toHaveLength(1);
        continue;
      }

      const petHatTextureDimensions = await readLocalPngDimensions(animationCatalog.petHatTextureLocalPath);
      const daytimeHatEntry = daytimeEntries.find((renderEntry) => renderEntry.layerId === `pet-hat-${petDefinition.id}-0`);
      const nighttimeHatEntry = nighttimeEntries.find((renderEntry) => renderEntry.layerId === `pet-hat-${petDefinition.id}-0`);
      if (daytimeHatEntry === undefined || nighttimeHatEntry === undefined) {
        throw new Error(`Expected daytime and nighttime pet hat entries for ${JSON.stringify(petDefinition.id)}.`);
      }
      assertAnimationFramesWithinTexture(daytimeHatEntry, petHatTextureDimensions, [0, 175, 350, 525, 700, 875, 1_050, 1_400]);
      assertAnimationFramesWithinTexture(nighttimeHatEntry, petHatTextureDimensions, [0, 1_000]);
      assertInitialGeometryMatchesMotionSample(daytimeHatEntry);
      assertInitialGeometryMatchesMotionSample(nighttimeHatEntry);

      for (let bodyFrameIndex = 0; bodyFrameIndex < petDefinition.spriteFrameCount; bodyFrameIndex += 1) {
        for (const flipped of [false, true]) {
          const hatDescriptor = getPetHatRenderDescriptor(
            animationCatalog,
            petDefinition.id,
            "0",
            bodyFrameIndex,
            flipped,
          );
          assertSourceRectWithinTexture(
            hatDescriptor.sourceRect,
            petHatTextureDimensions,
            `${petDefinition.id} frame ${String(bodyFrameIndex)} flipped ${String(flipped)}`,
          );
        }
      }

      const nighttimeBodySample = getMotionSample(nighttimeBodyEntry, 0);
      const nighttimeHatSample = getMotionSample(nighttimeHatEntry, 0);
      const bodyFrameIndex = nighttimeBodySample.frameIndex;
      if (bodyFrameIndex === undefined) {
        throw new Error(`Nighttime pet ${JSON.stringify(petDefinition.id)} has no selected body frame.`);
      }
      const flipped = nighttimeBodySample.scaleX === -1;
      if (flipped) {
        foundFlippedPetHatPose = true;
      }
      const expectedNighttimeHatDescriptor = getPetHatRenderDescriptor(
        animationCatalog,
        petDefinition.id,
        "0",
        bodyFrameIndex,
        flipped,
      );
      expect(nighttimeHatEntry.animation?.kind).toBe("sprite-motion");
      if (nighttimeHatEntry.animation?.kind !== "sprite-motion") {
        throw new TypeError(`Expected sprite-motion animation for pet hat ${JSON.stringify(petDefinition.id)}.`);
      }
      const hatFrameIndex = nighttimeHatSample.frameIndex;
      if (hatFrameIndex === undefined) {
        throw new Error(`Nighttime pet hat ${JSON.stringify(petDefinition.id)} has no selected source frame.`);
      }
      expect(nighttimeHatEntry.animation.frames[hatFrameIndex]).toEqual(expectedNighttimeHatDescriptor.sourceRect);
      expect(nighttimeHatSample.positionX).toBeCloseTo(
        (nighttimeBodySample.positionX ?? 0) + expectedNighttimeHatDescriptor.offsetXInTiles,
      );
      expect(nighttimeHatSample.positionY).toBeCloseTo(
        (nighttimeBodySample.positionY ?? 0) + 20 + expectedNighttimeHatDescriptor.offsetYInTiles,
      );
    }
    expect(foundFlippedPetHatPose).toBe(true);
  });

  it("renders Stable horse and hat on the catalog's exact walking frames with prismatic tint", async () => {
    const stable = createBuilding("Stable", 8, 6, { horse: true, hatId: "73" });
    const horseEntries = createPlacementBuildingCharacterRenderEntries(createInput({
      building: stable,
      footprint: { width: 4, height: 2 },
    }));
    const horseBody = horseEntries.find((renderEntry) => renderEntry.layerId === "stable-horse");
    const horseHat = horseEntries.find((renderEntry) => renderEntry.layerId === "stable-horse-hat-73");
    if (horseBody === undefined || horseHat === undefined) {
      throw new Error(`Expected Stable horse body and hat entries; got ${horseEntries.map((entry) => entry.layerId).join(", ")}.`);
    }
    expect(horseBody.frame).toMatchObject({ width: 32, height: 32 });
    expect(horseBody.textureLocalPath).toBe("/game-assets/1.6.15/animals/horse.png");
    assertInitialGeometryMatchesMotionSample(horseBody);
    assertInitialGeometryMatchesMotionSample(horseHat);
    const timedHorseFrames = Array.from({ length: 50 }, (_, sampleIndex) =>
      getMotionSample(horseBody, sampleIndex * 500).frameIndex
    );
    expect(new Set(timedHorseFrames).size).toBeGreaterThan(2);
    expect(getMotionSample(horseHat, 0).tintColor).toBe("#ff0000");
    expect(getMotionSample(horseHat, 750).tintColor).toBe("#ff3c00");
    expect(getMotionSample(horseHat, 2_250).tintColor).toBe("#ffa800");
    await assertLocalTextureExists(horseBody.textureLocalPath ?? "");
    await assertLocalTextureExists(horseHat.textureLocalPath ?? "");
  });

  it("renders up to three crop-bound Junimos only in daytime outside winter", async () => {
    const hut = createBuilding("Junimo Hut", 7, 6, { junimos: true });
    const placementCrops: readonly PlacementCrop[] = [
      { cropId: "crop:Blue Jazz", x: 10, y: 7 },
      { cropId: "crop:Cauliflower", x: 10, y: 9 },
      { cropId: "crop:Pumpkin", x: 9, y: 9 },
      { cropId: "crop:giant_Pumpkin", x: 6, y: 7 },
      { cropId: "crop:Blue Jazz", x: 20, y: 18 },
    ];
    const hutInput = createInput({
      building: hut,
      footprint: { width: 3, height: 2 },
      placementCrops,
    });
    const junimoEntries = createPlacementBuildingCharacterRenderEntries(hutInput);
    expect(junimoEntries).toHaveLength(6);
    const junimoBody = junimoEntries.find((renderEntry) => renderEntry.layerId === "junimo-0");
    const junimoShadow = junimoEntries.find((renderEntry) => renderEntry.layerId === "junimo-shadow-0");
    if (junimoBody === undefined || junimoShadow === undefined) {
      throw new Error("Expected Junimo body and shadow layers.");
    }
    const junimoStart = getMotionSample(junimoBody, 0);
    const junimoLater = getMotionSample(junimoBody, 500);
    expect(`${String(junimoStart.positionX)},${String(junimoStart.positionY)}`).not.toBe(
      `${String(junimoLater.positionX)},${String(junimoLater.positionY)}`,
    );
    expect(junimoBody.frame).toMatchObject({ width: 16, height: 16 });
    expect(junimoBody.textureLocalPath).toBe("/game-assets/1.6.15/sprites/Junimo.png");
    expect(getMotionSample(junimoBody, 0).tintColor).toBe(getMotionSample(junimoBody, 500).tintColor);
    expect(junimoShadow.textureLocalPath).toBe("/game-assets/1.6.15/sprites/shadow.png");
    assertInitialGeometryMatchesMotionSample(junimoBody);
    assertInitialGeometryMatchesMotionSample(junimoShadow);
    await assertLocalTextureExists(junimoBody.textureLocalPath ?? "");
    await assertLocalTextureExists(junimoShadow.textureLocalPath ?? "");

    expect(createPlacementBuildingCharacterRenderEntries({ ...hutInput, season: "winter" })).toEqual([]);
    expect(createPlacementBuildingCharacterRenderEntries({ ...hutInput, isNightMode: true })).toEqual([]);
    expect(createPlacementBuildingCharacterRenderEntries(createInput({
      building: hut,
      footprint: { width: 3, height: 2 },
      placementCrops: [{ cropId: "crop:giant_Pumpkin", x: 6, y: 7 }],
    }))).toEqual([]);
  });
});
