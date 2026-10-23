import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
} from "../../src/catalog";
import type { CatalogJsonFetcher } from "../../src/catalog/catalog-types";
import { loadPlannerAnimationCatalog } from "../../src/animations/animation-catalog";
import type { AnimationCatalog } from "../../src/animations/animation-catalog";
import type { PlacementBuilding } from "../../src/placement/placement-snapshot";
import {
  animateFishPondWaterEntries,
  createPlacementBuildingAnimationEntries,
} from "../../src/rendering/building-animation-rendering";
import { createBuildingMultilayerPlacementRenderEntries } from "../../src/rendering/building-multilayer-placement-rendering";
import type { PlacementRenderEntry } from "../../src/rendering/placement-rendering";

let animationCatalog: AnimationCatalog;
let fishPondCatalogItem: CatalogItem;

function createLocalAnimationJsonFetcher(): CatalogJsonFetcher {
  return async (requestedUrl) => {
    const responsePath = join(process.cwd(), "public", requestedUrl.slice(1));
    const responseJson = JSON.parse(await readFile(responsePath, "utf8")) as unknown;
    return { ok: true, status: 200, json: async () => responseJson };
  };
}

function createFishPond(buildingOptions?: PlacementBuilding["animationOptions"]): PlacementBuilding {
  return {
    instanceId: 19,
    buildingId: "Fish Pond",
    x: 2,
    y: 3,
    ...(buildingOptions === undefined ? {} : { animationOptions: buildingOptions }),
  };
}

function createFishPondBaseEntries(building: PlacementBuilding): readonly PlacementRenderEntry[] {
  return createBuildingMultilayerPlacementRenderEntries(
    fishPondCatalogItem,
    building,
    "spring",
  );
}

function getFrameAt(entry: PlacementRenderEntry, currentTimeMilliseconds: number) {
  if (entry.animation?.kind !== "sprite-motion") {
    throw new Error(`Expected sprite-motion on layer ${String(entry.layerId)}.`);
  }
  const sample = entry.animation.sample(currentTimeMilliseconds);
  const frame = entry.animation.frames[sample.frameIndex ?? 0];
  if (frame === undefined) {
    throw new Error(`Sprite-motion layer ${String(entry.layerId)} has no frame for index ${String(sample.frameIndex)}.`);
  }
  return { frame, sample };
}

beforeAll(async () => {
  animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
  const rawBuildings = JSON.parse(await readFile(
    join(process.cwd(), "public/game-assets/1.6.15/data/Buildings.json"),
    "utf8",
  )) as unknown;
  const buildingCatalog = createBuildingCatalogFromDataset(rawBuildings, catalogDatasetUrls.buildings);
  const catalogItem = buildingCatalog.items.find((item) => item.id === "building:Fish Pond");
  if (catalogItem === undefined) {
    throw new Error("Locked Buildings.json is missing building:Fish Pond.");
  }
  fishPondCatalogItem = catalogItem;
});

describe("fish pond building animations", () => {
  it("shares water timing while preserving checkerboard parity and source clipping", () => {
    const building = createFishPond();
    const animatedEntries = animateFishPondWaterEntries(
      building,
      createFishPondBaseEntries(building),
      animationCatalog,
    );
    const topEven = animatedEntries.find((entry) => entry.layerId === "FishPondWaterTile_0_0");
    const topOdd = animatedEntries.find((entry) => entry.layerId === "FishPondWaterTile_0_1");
    const middle = animatedEntries.find((entry) => entry.layerId === "FishPondWaterTile_2_0");
    const bottom = animatedEntries.find((entry) => entry.layerId === "FishPondWaterTile_4_0");
    if (topEven === undefined || topOdd === undefined || middle === undefined || bottom === undefined) {
      throw new Error("Fish Pond base composition is missing one of the 5x4 water tiles.");
    }

    const topEvenState = getFrameAt(topEven, 4_000);
    const topOddState = getFrameAt(topOdd, 4_000);
    const middleState = getFrameAt(middle, 4_000);
    const bottomState = getFrameAt(bottom, 4_000);

    expect(topEvenState.sample.frameIndex).toBe(topOddState.sample.frameIndex);
    expect(topEvenState.frame).toMatchObject({ x: 0, y: 2_088, width: 64, height: 40 });
    expect(topOddState.frame).toMatchObject({ x: 0, y: 2_216, width: 64, height: 40 });
    expect(middleState.frame).toMatchObject({ x: 0, y: 2_064, width: 64, height: 64 });
    expect(middleState.sample.positionY).toBe(82);
    expect(bottomState.frame).toMatchObject({ x: 0, y: 2_064, width: 64, height: 51 });
    expect(bottomState.sample.positionY).toBe(114);
    if (topEven.animation?.kind !== "sprite-motion") {
      throw new Error("Fish Pond water tile must use sprite-motion.");
    }
    expect(topEven.animation.frames).toHaveLength(320);
  });

  it("keeps an empty pond fishless and still renders a zero-threshold selected product", () => {
    const building = createFishPond({ fishId: "128", population: 0, produce: "812" });
    const entries = createPlacementBuildingAnimationEntries(
      building,
      fishPondCatalogItem,
      createFishPondBaseEntries(building),
      animationCatalog,
    );

    expect(entries.filter((entry) => entry.layerId?.startsWith("pond-fish-"))).toHaveLength(0);
    expect(entries.map((entry) => entry.layerId)).toEqual([
      "pond-produce-bubble",
      "pond-produce-icon",
      "pond-produce-color-overlay",
    ]);
    expect(entries[2]).toMatchObject({
      frame: { x: 336, y: 528, width: 16, height: 16 },
      tintColor: "#ff8000",
      opacity: 0.75,
    });
  });
});
