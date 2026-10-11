import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createInitialMapRenderOptions,
  setFarmCaveChoice,
  setFarmSpouseId,
} from "../../src/maps/map-render-options";
import { loadPreparedDefaultMap } from "../../src/resources/default-map-resource";

const localGameAssetUrlPrefix = "/game-assets/1.6.15/";

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("default farm map resources", () => {
  it("loads and composes the selected spouse patio from the local TMX asset", async () => {
    const initialMapRenderOptions = createInitialMapRenderOptions();
    const mapWithoutSpouse = await loadPreparedDefaultMap({
      mapId: "standard",
      season: "spring",
      mapRenderOptions: initialMapRenderOptions,
    }, { fetchMapAsset: fetchLocalGameAsset });
    const mapWithSpouse = await loadPreparedDefaultMap({
      mapId: "standard",
      season: "spring",
      mapRenderOptions: setFarmSpouseId(initialMapRenderOptions, "Abigail"),
    }, { fetchMapAsset: fetchLocalGameAsset });

    expect(mapWithSpouse.farmMapDecorationPlan?.spouse).toMatchObject({
      spouseId: "Abigail",
      spriteAssetPath: "sprites/Abigail.png",
      x: 71,
      y: 8,
    });
    expect(mapWithSpouse.parsedMap.tileLayers.some((tileLayer, layerIndex) =>
      tileLayer.rawGids.some((gid, tileIndex) =>
        gid !== mapWithoutSpouse.parsedMap.tileLayers[layerIndex]?.rawGids[tileIndex],
      ),
    )).toBe(true);
  });

  it("prepares the real mushroom cave objects on the local Farm Cave map", async () => {
    const mapRenderOptions = setFarmCaveChoice(
      createInitialMapRenderOptions(),
      "mushrooms",
    );
    const preparedMap = await loadPreparedDefaultMap({
      mapId: "farm-cave",
      season: "spring",
      mapRenderOptions,
    }, { fetchMapAsset: fetchLocalGameAsset });

    expect(preparedMap.farmMapDecorationPlan?.spouse).toBeNull();
    expect(preparedMap.farmMapDecorationPlan?.caveObjects).toHaveLength(7);
    expect(preparedMap.farmMapDecorationPlan?.caveObjects.at(-1)).toEqual({
      catalogItemId: "big-craftable:Dehydrator",
      spriteIndex: 286,
      x: 10,
      y: 5,
    });
  });
});

async function fetchLocalGameAsset(assetUrl: string) {
  if (!assetUrl.startsWith(localGameAssetUrlPrefix) || assetUrl.split("/").includes("..")) {
    throw new Error(
      `Default map resource test accepts only local game assets; received ${JSON.stringify(assetUrl)}.`,
    );
  }

  return {
    ok: true,
    status: 200,
    text: () => readFile(join(process.cwd(), "public", assetUrl), "utf8"),
  };
}
