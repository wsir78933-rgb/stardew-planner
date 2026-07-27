import { readFile } from "node:fs/promises";
import path from "node:path";
import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createNpcPathOverlayTiles,
  isNpcPathSupportedMapFile,
} from "../../src/rendering/npc-paths";
import { parseTmxMap } from "../../src/tmx/parse-tmx-map";

beforeEach(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function parseLockedBusStopMap() {
  const busStopXml = await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/maps/BusStop.tmx"),
    "utf8",
  );

  return parseTmxMap(busStopXml);
}

describe("NPC path overlays", () => {
  it("limits the source route catalog to Bus Stop", () => {
    expect(isNpcPathSupportedMapFile("BusStop.tmx")).toBe(true);
    expect(isNpcPathSupportedMapFile("Farm.tmx")).toBe(false);
  });

  it("marks the source Bus Stop routes and includes their fixed endpoints", async () => {
    const busStopMap = await parseLockedBusStopMap();
    const overlayTiles = createNpcPathOverlayTiles("BusStop.tmx", busStopMap);
    const overlayTileKeys = new Set(
      overlayTiles.map((overlayTile) => `${String(overlayTile.x)},${String(overlayTile.y)}`),
    );

    expect(overlayTiles.length).toBeGreaterThan(20);
    expect(overlayTileKeys).toContain("42,23");
    expect(overlayTileKeys).toContain("21,10");
    expect(overlayTileKeys).toContain("22,5");
    expect(overlayTileKeys).toContain("10,23");
  });

  it("returns no overlay tiles for non-Bus Stop maps", async () => {
    expect(
      createNpcPathOverlayTiles("Farm.tmx", await parseLockedBusStopMap()),
    ).toEqual([]);
  });
});
