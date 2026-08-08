import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  type CatalogItem,
} from "../../src/catalog";
import { plannerMaps } from "../../src/maps/map-catalog";
import { createInitialMapPlacementSnapshot } from "../../src/maps/map-initial-composition";
import {
  createPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../../src/rendering/placement-rendering";
import {
  resolvePlacementTextureEntries,
  type ResolvedPlacementTextureEntry,
} from "../../src/rendering/resolved-placement-texture";

const lockedCursorTexturePath = "/game-assets/1.6.15/sprites/Cursors.png";
const startupCursorAtlasPath = "/planner-textures/initial/Cursors-startup.webp";
const expectedCursorDescriptorCountByMapId = new Map<string, number>([
  ["standard", 12],
  ["riverland", 12],
  ["forest", 12],
  ["hilltop", 12],
  ["wilderness", 12],
  ["four-corners", 12],
  ["beach", 12],
  ["meadowlands", 12],
  ["if2r", 12],
  ["frontier", 12],
  ["grandpas", 12],
  ["capitalist-dream", 12],
  ["capitalist-dream-2", 12],
  ["overgrown-garden", 12],
  ["yet-another", 12],
  ["solo-four-corners", 12],
  ["strawberry-fields", 12],
  ["blackberry-fields", 12],
  ["zenith", 12],
  ["everfarm", 12],
  ["sea-breeze-island", 12],
  ["aimon-s-small-hilltop", 12],
  ["aimon-s-small-forest", 12],
  ["more-lively-meadowlands", 12],
  ["modest-maps-standard", 12],
  ["waterfall-forest", 12],
]);

async function loadLockedBuildingCatalog(): Promise<readonly CatalogItem[]> {
  const rawBuildings = JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data/Buildings.json"),
    "utf8",
  )) as unknown;

  return createBuildingCatalogFromDataset(
    rawBuildings,
    catalogDatasetUrls.buildings,
  ).items;
}

function getPlacementTexturePath(placementRenderEntry: PlacementRenderEntry): string {
  return placementRenderEntry.textureLocalPath
    ?? placementRenderEntry.catalogItem.textureLocalPath;
}

function getCursorDescriptors(
  resolvedPlacementTextureEntries: readonly ResolvedPlacementTextureEntry[],
): readonly ResolvedPlacementTextureEntry[] {
  return resolvedPlacementTextureEntries.filter((resolvedPlacementTextureEntry) =>
    getPlacementTexturePath(resolvedPlacementTextureEntry.placementRenderEntry)
      === lockedCursorTexturePath
  );
}

describe("startup Cursor atlas default-map coverage", () => {
  it("maps every approved default Cursors source frame to its exact startup-atlas frame", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const resolvedCursorDescriptors = getCursorDescriptors(
      resolvePlacementTextureEntries(createPlacementRenderEntries(
        createInitialMapPlacementSnapshot("standard"),
        catalogItems,
        "spring",
        "standard",
      )),
    );

    expect(new Set(resolvedCursorDescriptors.map((resolvedDescriptor) =>
      JSON.stringify({
        source: resolvedDescriptor.placementRenderEntry.frame,
        atlas: resolvedDescriptor.resolvedFrame,
      })
    ))).toEqual(new Set([
      JSON.stringify({
        source: { x: 134, y: 226, width: 30, height: 25 },
        atlas: { x: 0, y: 0, width: 30, height: 25 },
      }),
      JSON.stringify({
        source: { x: 656, y: 394, width: 16, height: 16 },
        atlas: { x: 30, y: 0, width: 16, height: 16 },
      }),
      JSON.stringify({
        source: { x: 672, y: 394, width: 16, height: 16 },
        atlas: { x: 46, y: 0, width: 16, height: 16 },
      }),
      JSON.stringify({
        source: { x: 688, y: 394, width: 16, height: 16 },
        atlas: { x: 62, y: 0, width: 16, height: 16 },
      }),
    ]));
    expect(
      resolvedCursorDescriptors.every((resolvedDescriptor) =>
        resolvedDescriptor.resolvedAssetPath === startupCursorAtlasPath
      ),
    ).toBe(true);
  });

  it("maps every initial map cursor-backed default building layer to the startup atlas", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const mapIdsWithCursorDescriptors: string[] = [];

    for (const plannerMap of plannerMaps) {
      const resolvedCursorDescriptors = getCursorDescriptors(
        resolvePlacementTextureEntries(createPlacementRenderEntries(
          createInitialMapPlacementSnapshot(plannerMap.id),
          catalogItems,
          "spring",
          plannerMap.id,
        )),
      );
      const expectedCursorDescriptorCount =
        expectedCursorDescriptorCountByMapId.get(plannerMap.id) ?? 0;

      expect(
        resolvedCursorDescriptors.length,
        `Map ${JSON.stringify(plannerMap.id)} expected ${String(expectedCursorDescriptorCount)} initial Cursor descriptors; received ${String(resolvedCursorDescriptors.length)}.`,
      ).toBe(expectedCursorDescriptorCount);

      if (resolvedCursorDescriptors.length > 0) {
        mapIdsWithCursorDescriptors.push(plannerMap.id);
      }

      expect(
        resolvedCursorDescriptors.every((resolvedDescriptor) =>
          resolvedDescriptor.resolvedAssetPath === startupCursorAtlasPath
        ),
        `Map ${JSON.stringify(plannerMap.id)} expected ${String(expectedCursorDescriptorCount)} startup-atlas Cursor descriptors; received ${String(resolvedCursorDescriptors.length)} total descriptors.`,
      ).toBe(true);
    }

    expect(mapIdsWithCursorDescriptors).toEqual([
      ...expectedCursorDescriptorCountByMapId.keys(),
    ]);
  });

  it("keeps ginger-island Island_W explicitly free of cursor descriptors", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const resolvedIslandCursorDescriptors = getCursorDescriptors(
      resolvePlacementTextureEntries(createPlacementRenderEntries(
        createInitialMapPlacementSnapshot("ginger-island"),
        catalogItems,
        "spring",
        "ginger-island",
      )),
    );

    expect(resolvedIslandCursorDescriptors).toEqual([]);
  });

  it("preserves the original locked path and source frame on every placement render entry", async () => {
    const catalogItems = await loadLockedBuildingCatalog();
    const placementRenderEntries = createPlacementRenderEntries(
      createInitialMapPlacementSnapshot("standard"),
      catalogItems,
      "spring",
      "standard",
    );
    const originalCursorPlacementRenderEntry = placementRenderEntries.find(
      (placementRenderEntry) =>
        getPlacementTexturePath(placementRenderEntry) === lockedCursorTexturePath,
    );
    expect(originalCursorPlacementRenderEntry).toBeDefined();
    if (originalCursorPlacementRenderEntry === undefined) {
      return;
    }
    const originalCursorTexturePath = getPlacementTexturePath(
      originalCursorPlacementRenderEntry,
    );
    const originalCursorFrame = originalCursorPlacementRenderEntry.frame === null
      ? null
      : { ...originalCursorPlacementRenderEntry.frame };
    const resolvedCursorDescriptor = getCursorDescriptors(
      resolvePlacementTextureEntries(placementRenderEntries),
    )[0];

    expect(resolvedCursorDescriptor).toBeDefined();
    if (resolvedCursorDescriptor === undefined) {
      return;
    }

    expect(resolvedCursorDescriptor.placementRenderEntry).toBe(
      originalCursorPlacementRenderEntry,
    );
    expect(getPlacementTexturePath(originalCursorPlacementRenderEntry)).toBe(
      originalCursorTexturePath,
    );
    expect(originalCursorPlacementRenderEntry.frame).toEqual(originalCursorFrame);
  });
});
