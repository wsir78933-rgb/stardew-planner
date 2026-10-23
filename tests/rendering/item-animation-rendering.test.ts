import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { CatalogJsonFetcher } from "../../src/catalog/catalog-types";
import {
  loadPlannerAnimationCatalog,
  type AnimationCatalog,
} from "../../src/animations/animation-catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementItemAnimationResult,
  type PlacementItemAnimationResult,
} from "../../src/rendering/item-animation-rendering";
import type { PlacementRenderEntry } from "../../src/rendering/placement-rendering";

let animationCatalog: AnimationCatalog;

function createLocalAnimationJsonFetcher(): CatalogJsonFetcher {
  return async (requestedUrl) => {
    const responsePath = join(process.cwd(), "public", requestedUrl.slice(1));
    const responseJson = JSON.parse(await readFile(responsePath, "utf8")) as unknown;
    return { ok: true, status: 200, json: async () => responseJson };
  };
}

function createMachineCatalogItem(rawMachineId: string, spriteIndex: number): CatalogItem {
  return {
    id: `big-craftable:${rawMachineId}`,
    name: `Machine ${rawMachineId}`,
    category: "placeable",
    tileSize: { width: 1, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
    sprite: { kind: "sprite-index", index: spriteIndex },
    allowedTools: ["cursor"],
  };
}

function createCatalogItem(
  id: string,
  sprite: CatalogItem["sprite"],
  textureLocalPath: string,
  renderingMetadata?: CatalogItem["renderingMetadata"],
): CatalogItem {
  return {
    id,
    name: id,
    category: "placeable",
    tileSize: { width: 1, height: 2 },
    textureLocalPath,
    sprite,
    allowedTools: ["cursor"],
    ...(renderingMetadata === undefined ? {} : { renderingMetadata }),
  };
}

function createPlacementItem(
  catalogItem: CatalogItem,
  instanceId: number,
  animationOptions: PlacementItem["animationOptions"],
  variant = 0,
): PlacementItem {
  return {
    instanceId,
    itemId: catalogItem.id,
    x: 2,
    y: 3,
    layer: "item",
    rotation: 0,
    footprint: catalogItem.tileSize,
    variant,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
    ...(animationOptions === undefined ? {} : { animationOptions }),
  };
}

function createBaseRenderEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): PlacementRenderEntry {
  const frame = catalogItem.sprite.kind === "source-rect"
    ? {
        x: catalogItem.sprite.x,
        y: catalogItem.sprite.y,
        width: catalogItem.sprite.width,
        height: catalogItem.sprite.height,
      }
    : {
        x: (catalogItem.sprite.index % 8) * 16,
        y: Math.floor(catalogItem.sprite.index / 8) * 32,
        width: 16,
        height: 32,
      };
  return {
    catalogItem,
    effectiveFootprint: placementItem.footprint,
    frame,
    key: `item:${String(placementItem.instanceId)}`,
    tileX: placementItem.x,
    tileY: placementItem.y,
    rotationQuarterTurns: 0,
    pixelGeometry: {
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: placementItem.x * 16,
      positionY: placementItem.y * 16,
    },
  };
}

function renderItemAnimation(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  mapPlacementGrid?: MapPlacementGrid,
): PlacementItemAnimationResult {
  return createPlacementItemAnimationResult(
    catalogItem,
    placementItem,
    createBaseRenderEntry(catalogItem, placementItem),
    animationCatalog,
    mapPlacementGrid,
  );
}

beforeAll(async () => {
  animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
});

describe("placement item animation rendering", () => {
  it("uses 16x32 eight-column machine state frames and samples each working-puff visibility", () => {
    const catalogItem = createMachineCatalogItem("13", 13);
    const placementItem = createPlacementItem(catalogItem, 6, {
      spriteState: "working",
      readyProduct: "334",
    });
    const result = renderItemAnimation(catalogItem, placementItem);
    const particle = result.overlays.find((entry) => entry.layerId === "machine-puff-0");

    expect(result.baseFrame).toEqual({ x: 96, y: 32, width: 16, height: 32 });
    expect(result.overlays.some((entry) => entry.layerId === "ready-product-bubble")).toBe(false);
    if (particle?.animation?.kind !== "sprite-motion") {
      throw new Error("Working Furnace must expose its machine puff animation.");
    }
    expect(particle.animation.frames).toHaveLength(4);
    expect(particle.animation.frames[0]).toEqual(particle.frame);
    expect(particle.frame).toMatchObject({ x: 0, y: 1920, width: 64, height: 64 });
    expect(particle.animation.sample(0)).toHaveProperty("visible", false);
    expect(particle.animation.sample(150)).toHaveProperty("visible", false);
  });

  it("rolls working puffs once per seven-second bucket at the configured probability", () => {
    const catalogItem = createMachineCatalogItem("13", 13);
    const instanceCount = 512;
    let visibleRollCount = 0;

    for (let index = 0; index < instanceCount; index += 1) {
      const placementItem = createPlacementItem(catalogItem, 1000 + index, {
        spriteState: "working",
      });
      const particle = renderItemAnimation(catalogItem, placementItem).overlays
        .find((entry) => entry.layerId === "machine-puff-0");
      if (particle?.animation?.kind !== "sprite-motion") {
        throw new Error("Working Furnace must expose its machine puff animation.");
      }

      const beforeFirstRoll = particle.animation.sample(6_999);
      const firstBucketSample = particle.animation.sample(7_000);
      expect(beforeFirstRoll).toHaveProperty("visible", false);
      expect(particle.animation.sample(7_000)).toEqual(firstBucketSample);
      if (firstBucketSample.visible === true) {
        visibleRollCount += 1;
      }
    }

    expect(visibleRollCount).toBeGreaterThan(50);
    expect(visibleRollCount).toBeLessThan(120);
  });

  it("samples machine and Cauldron particles directly at large finite times", () => {
    const machineCatalogItem = createMachineCatalogItem("13", 13);
    const machinePlacementItem = createPlacementItem(machineCatalogItem, 71, {
      spriteState: "working",
    });
    const machineParticle = renderItemAnimation(machineCatalogItem, machinePlacementItem).overlays
      .find((entry) => entry.layerId === "machine-puff-0");
    const cauldronCatalogItem = createCatalogItem(
      "furniture_Cauldron",
      { kind: "source-rect", x: 0, y: 0, width: 64, height: 64 },
      "/game-assets/1.6.15/tilesheets/furniture.png",
    );
    const cauldronPlacementItem = createPlacementItem(cauldronCatalogItem, 72, undefined);
    const cauldronOverlays = renderItemAnimation(cauldronCatalogItem, cauldronPlacementItem).overlays;

    if (machineParticle?.animation?.kind !== "sprite-motion") {
      throw new Error("Working Furnace must expose its machine puff animation.");
    }
    const cauldronParticle = cauldronOverlays.find((entry) => entry.layerId === "cauldron-bubble-repeat-0");
    if (cauldronParticle?.animation?.kind !== "sprite-motion") {
      throw new Error("Cauldron must expose repeating bubble animations.");
    }

    for (const sample of [
      machineParticle.animation.sample(1e300),
      cauldronParticle.animation.sample(1e300),
    ]) {
      for (const [field, value] of Object.entries(sample)) {
        if (typeof value === "number") {
          expect(Number.isFinite(value), `${field} must remain finite`).toBe(true);
        }
      }
    }
    expect(machineParticle.animation.sample(1e300)).toEqual(machineParticle.animation.sample(1e300));
    expect(cauldronParticle.animation.sample(1e300)).toEqual(cauldronParticle.animation.sample(1e300));
  });

  it("uses locked product textures and color overlays for a ready machine output", () => {
    const catalogItem = createMachineCatalogItem("12", 12);
    const placementItem = createPlacementItem(catalogItem, 7, {
      spriteState: "idle",
      readyProduct: "348",
    });
    const result = renderItemAnimation(catalogItem, placementItem);
    const productChoice = animationCatalog.machineOutputsById[catalogItem.id]?.find((choice) => choice.id === "348");
    const productEntry = result.overlays.find((entry) => entry.layerId === "ready-product-icon");
    const colorOverlayEntry = result.overlays.find((entry) => entry.layerId === "ready-product-color-overlay");

    if (productChoice?.sourceRect === undefined || productChoice.textureLocalPath === undefined) {
      throw new Error("Locked Cheese Press output 348 is missing sprite metadata.");
    }
    expect(productEntry).toMatchObject({
      frame: productChoice.sourceRect,
      textureLocalPath: productChoice.textureLocalPath,
      opacity: 0.75,
    });
    expect(colorOverlayEntry?.frame).toEqual(productChoice.overlaySourceRect);
    expect(colorOverlayEntry?.tintColor).toMatch(/^#[0-9a-f]{6}$/);
    expect(colorOverlayEntry?.animation?.kind).toBe("sprite-motion");
  });

  it("creates the configured Cauldron bubble plume and uses source visibility timing", () => {
    const catalogItem = createCatalogItem(
      "furniture_Cauldron",
      { kind: "source-rect", x: 0, y: 0, width: 64, height: 64 },
      "/game-assets/1.6.15/tilesheets/furniture.png",
    );
    const placementItem = createPlacementItem(catalogItem, 21, undefined);
    const result = renderItemAnimation(catalogItem, placementItem);
    const initialBubble = result.overlays.find((entry) => entry.layerId === "cauldron-bubble-initial-0");
    const firstRepeatingBubble = result.overlays.find((entry) => entry.layerId === "cauldron-bubble-repeat-0");

    expect(result.overlays).toHaveLength(23);
    expect(initialBubble).toMatchObject({
      frame: { x: 372, y: 1956, width: 10, height: 10 },
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      tintColor: "#00ff00",
    });
    if (initialBubble?.animation?.kind !== "sprite-motion" || firstRepeatingBubble?.animation?.kind !== "sprite-motion") {
      throw new Error("Cauldron initial and repeating bubbles must use sprite-motion.");
    }
    expect(initialBubble.animation.sample(0)).toHaveProperty("visible", true);
    expect(firstRepeatingBubble.animation.sample(0)).toHaveProperty("visible", false);
    expect(firstRepeatingBubble.animation.sample(500)).toHaveProperty("visible", true);
    expect(initialBubble.animation.sample(4_688)).toHaveProperty("visible", false);
  });
});
