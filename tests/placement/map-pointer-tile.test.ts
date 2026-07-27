import { describe, expect, it } from "vitest";
import { getMapTileAtPointer } from "../../src/placement/map-pointer-tile";

describe("getMapTileAtPointer", () => {
  it("converts a pointer at the centered camera pivot into a map tile", () => {
    expect(
      getMapTileAtPointer({
        pointerX: 100,
        pointerY: 80,
        cameraPositionX: 100,
        cameraPositionY: 80,
        zoom: 1,
        mapTileWidth: 16,
        mapTileHeight: 16,
        mapWidth: 10,
        mapHeight: 8,
      }),
    ).toEqual({ x: 5, y: 4 });
  });

  it("accounts for camera zoom and returns the tile at the pointer", () => {
    expect(
      getMapTileAtPointer({
        pointerX: 116,
        pointerY: 64,
        cameraPositionX: 100,
        cameraPositionY: 80,
        zoom: 2,
        mapTileWidth: 16,
        mapTileHeight: 16,
        mapWidth: 10,
        mapHeight: 8,
      }),
    ).toEqual({ x: 5, y: 3 });
  });

  it("returns null when the pointer is outside the map bounds", () => {
    expect(
      getMapTileAtPointer({
        pointerX: 19,
        pointerY: 80,
        cameraPositionX: 100,
        cameraPositionY: 80,
        zoom: 1,
        mapTileWidth: 16,
        mapTileHeight: 16,
        mapWidth: 10,
        mapHeight: 8,
      }),
    ).toBeNull();
  });
});
