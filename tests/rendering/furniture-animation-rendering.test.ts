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
import {
  createPlacementFurnitureAnimationEntries,
} from "../../src/rendering/furniture-animation-rendering";
import type { PlacementRenderEntry } from "../../src/rendering/placement-rendering";

let animationCatalog: AnimationCatalog;

function createLocalAnimationJsonFetcher(): CatalogJsonFetcher {
  return async (requestedUrl) => {
    const responsePath = join(process.cwd(), "public", requestedUrl.slice(1));
    const responseJson = JSON.parse(await readFile(responsePath, "utf8")) as unknown;
    return { ok: true, status: 200, json: async () => responseJson };
  };
}

function createMannequinCatalogItem(
  id = "furniture_mannequin_male",
): CatalogItem {
  const mannequin = animationCatalog.mannequinsById[id];
  if (mannequin === undefined) {
    throw new Error(`Animation catalog is missing mannequin ${JSON.stringify(id)}.`);
  }
  return {
    id,
    name: id,
    category: "placeable",
    tileSize: { width: 1, height: 2 },
    textureLocalPath: mannequin.textureLocalPath,
    sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
    allowedTools: ["cursor"],
  };
}

function createMannequinPlacementItem(
  catalogItem: CatalogItem = createMannequinCatalogItem(),
  animationOptions: PlacementItem["animationOptions"] = { spriteState: "front", shirtId: "1223" },
  instanceId = 10,
): PlacementItem {
  return {
    instanceId,
    itemId: catalogItem.id,
    x: 2,
    y: 4,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 2 },
    variant: 0,
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

function createMannequinBaseEntry(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
): PlacementRenderEntry {
  return {
    catalogItem,
    effectiveFootprint: placementItem.footprint,
    frame: { x: 0, y: 0, width: 16, height: 32 },
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

beforeAll(async () => {
  animationCatalog = await loadPlannerAnimationCatalog(createLocalAnimationJsonFetcher());
});

describe("furniture animation rendering", () => {
  it("uses the dye atlas frame as the first frame of a prismatic mannequin shirt", () => {
    const catalogItem = createMannequinCatalogItem();
    const placementItem = createMannequinPlacementItem();
    const result = createPlacementFurnitureAnimationEntries(
      catalogItem,
      placementItem,
      createMannequinBaseEntry(catalogItem, placementItem),
      animationCatalog,
    );
    const shirtDyeEntry = result.overlays.find((entry) => entry.layerId === "mannequin-shirt-dye");

    if (shirtDyeEntry?.animation?.kind !== "sprite-motion") {
      throw new Error("Prismatic mannequin shirt dye must use sprite-motion.");
    }
    expect(shirtDyeEntry.animation.frames[0]).toEqual(shirtDyeEntry.frame);
    expect(shirtDyeEntry.animation.sample(0).tintColor).toBe("#ff0000");
    expect(shirtDyeEntry.animation.sample(750).tintColor).toBe("#ff3c00");
  });

  it("uses source pants rows and keeps pants IDs 10–15 inside the atlas for every mannequin pose", async () => {
    const pantsAtlas = await readFile(join(process.cwd(), "public/game-assets/1.6.15/farmer/pants.png"));
    const pantsAtlasWidth = pantsAtlas.readUInt32BE(16);
    const pantsAtlasHeight = pantsAtlas.readUInt32BE(20);
    const pantsColumnById: Readonly<Record<string, number>> = {
      "10": 0,
      "11": 192,
      "12": 384,
      "13": 576,
      "14": 768,
      "15": 960,
    };
    const pantsRowByDirection = {
      front: 688,
      right: 720,
      back: 752,
      left: 720,
    } as const;
    let instanceId = 20;

    for (const [mannequinId, mannequin] of Object.entries(animationCatalog.mannequinsById)) {
      for (const [pantsId, sourceColumn] of Object.entries(pantsColumnById)) {
        for (const [spriteState, sourceY] of Object.entries(pantsRowByDirection) as [keyof typeof pantsRowByDirection, number][]) {
          const catalogItem = createMannequinCatalogItem(mannequinId);
          const placementItem = createMannequinPlacementItem(
            catalogItem,
            { spriteState, pantsId },
            instanceId,
          );
          instanceId += 1;
          const renderResult = createPlacementFurnitureAnimationEntries(
            catalogItem,
            placementItem,
            createMannequinBaseEntry(catalogItem, placementItem),
            animationCatalog,
          );
          const pantsEntry = renderResult.overlays.find((entry) => entry.layerId === "mannequin-pants");

          if (pantsEntry?.frame === null || pantsEntry?.frame === undefined) {
            throw new Error(`${mannequinId} pants ${pantsId} ${spriteState} pose must have a source frame.`);
          }
          const sourceX = sourceColumn + (mannequin.isMale ? 0 : 96);
          expect(pantsEntry.frame, `${mannequinId} pants ${pantsId} ${spriteState} source frame`).toEqual({
            x: sourceX,
            y: sourceY,
            width: 16,
            height: 32,
          });
          expect(pantsEntry.frame.x + pantsEntry.frame.width).toBeLessThanOrEqual(pantsAtlasWidth);
          expect(pantsEntry.frame.y + pantsEntry.frame.height).toBeLessThanOrEqual(pantsAtlasHeight);
        }
      }
    }
  });
});
