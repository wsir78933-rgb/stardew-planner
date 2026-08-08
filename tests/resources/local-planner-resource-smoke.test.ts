import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import { plannerMaps } from "../../src/maps/map-catalog";
import { loadPreparedDefaultMap } from "../../src/resources/default-map-resource";
import type { PreparedDefaultMap } from "../../src/resources/default-map-resource";
import type { TilesheetSeason } from "../../src/rendering/tilesheet-asset-resolver";

const localGameAssetUrlPrefix = "/game-assets/1.6.15/";
const smokeSeasons = ["spring", "summer", "fall", "winter"] as const;

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("local planner resource smoke matrix", () => {
  it("loads every planner map for spring, summer, fall, and winter from local resources", async () => {
    const loadedRequestTuples = await loadLocalPlannerMapResourceMatrix({
      loadPreparedMap: (mapRequest) =>
        loadPreparedDefaultMap(mapRequest, {
          fetchMapAsset: createStrictLocalAssetFetch(),
        }),
    });

    expect(loadedRequestTuples).toHaveLength(plannerMaps.length * smokeSeasons.length);
    expect(new Set(loadedRequestTuples)).toEqual(
      new Set(
        plannerMaps.flatMap((plannerMap) =>
          smokeSeasons.map((season) => `${plannerMap.id}:${season}`),
        ),
      ),
    );
  });

  it("reports the exact map and season when a local resource request fails", async () => {
    await expect(
      loadLocalPlannerMapResourceMatrix({
        loadPreparedMap: async () => {
          throw new Error("missing local asset");
        },
        plannerMapEntries: [plannerMaps[0]!],
      }),
    ).rejects.toThrow('mapId "standard" in season "spring"');
  });

  it("rejects a non-local or traversal resource URL with its exact value", () => {
    expect(() =>
      getStrictLocalAssetFilePath("https://example.com/game-assets/1.6.15/maps/Farm.tmx"),
    ).toThrow("https://example.com/game-assets/1.6.15/maps/Farm.tmx");
    expect(() =>
      getStrictLocalAssetFilePath("/game-assets/1.6.15/maps/../Farm.tmx"),
    ).toThrow("/game-assets/1.6.15/maps/../Farm.tmx");
  });
});

async function loadLocalPlannerMapResourceMatrix(input: Readonly<{
  loadPreparedMap: (mapRequest: Readonly<{
    mapId: string;
    mapRenderOptions: ReturnType<typeof createInitialMapRenderOptions>;
    season: TilesheetSeason;
  }>) => Promise<PreparedDefaultMap>;
  plannerMapEntries?: readonly (typeof plannerMaps)[number][];
}>): Promise<readonly string[]> {
  const plannerMapEntries = input.plannerMapEntries ?? plannerMaps;
  const mapRenderOptions = createInitialMapRenderOptions();
  const loadedRequestTuples: string[] = [];

  for (const plannerMap of plannerMapEntries) {
    for (const season of smokeSeasons) {
      const preparedMap = await loadPreparedMapWithContext(
        input.loadPreparedMap,
        plannerMap.id,
        mapRenderOptions,
        season,
      );
      expect(preparedMap.mapId).toBe(plannerMap.id);
      expect(preparedMap.season).toBe(season);
      expect(preparedMap.renderingContract.mapId).toBe(plannerMap.id);
      expect(preparedMap.renderingContract.requestedSeason).toBe(season);
      expect(preparedMap.renderingContract.visibleTileLayers.length).toBeGreaterThan(0);
      expect(preparedMap.renderingContract.tilesets.length).toBeGreaterThan(0);
      loadedRequestTuples.push(`${plannerMap.id}:${season}`);
    }
  }

  return loadedRequestTuples;
}

async function loadPreparedMapWithContext(
  loadPreparedMap: Parameters<typeof loadLocalPlannerMapResourceMatrix>[0]["loadPreparedMap"],
  mapId: string,
  mapRenderOptions: ReturnType<typeof createInitialMapRenderOptions>,
  season: TilesheetSeason,
): Promise<PreparedDefaultMap> {
  try {
    return await loadPreparedMap({ mapId, mapRenderOptions, season });
  } catch (caughtError) {
    const causeMessage = caughtError instanceof Error
      ? caughtError.message
      : describeValue(caughtError);
    throw new Error(
      `Local planner resource smoke failed for mapId ${JSON.stringify(mapId)} in season ${JSON.stringify(season)}: ${causeMessage}`,
      { cause: caughtError },
    );
  }
}

function createStrictLocalAssetFetch(): (assetUrl: string) => Promise<Readonly<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>> {
  return async (assetUrl) => ({
    ok: true,
    status: 200,
    text: () => readFile(getStrictLocalAssetFilePath(assetUrl), "utf8"),
  });
}

function getStrictLocalAssetFilePath(assetUrl: string): string {
  if (
    !assetUrl.startsWith(localGameAssetUrlPrefix) ||
    assetUrl.split("/").includes("..")
  ) {
    throw new Error(
      `Local planner resource smoke asset URL must start with ${JSON.stringify(localGameAssetUrlPrefix)} and not contain ".."; received ${JSON.stringify(assetUrl)}.`,
    );
  }
  return join(process.cwd(), "public", assetUrl);
}

function describeValue(value: unknown): string {
  const serializedValue = JSON.stringify(value);
  return serializedValue === undefined ? String(value) : serializedValue;
}
