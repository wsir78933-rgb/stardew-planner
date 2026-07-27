import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createBuildingPlacementMetadata } from "../../src/catalog";

async function readLockedBuildingRecords(): Promise<unknown> {
  const buildingDataPath = path.join(
    process.cwd(),
    "public/game-assets/1.6.15/data/Buildings.json",
  );

  return JSON.parse(await readFile(buildingDataPath, "utf8")) as unknown;
}

describe("building placement metadata", () => {
  it("projects Farmhouse requirements, external placement tiles, and tile properties from locked data", async () => {
    const buildingMetadataById = createBuildingPlacementMetadata(
      await readLockedBuildingRecords(),
    );

    expect(buildingMetadataById.Farmhouse).toMatchObject({
      size: { width: 9, height: 5 },
      humanDoor: { x: 5, y: 2 },
      collisionMap: [
        [
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
        ],
        [
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
        ],
        [
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
        ],
        [
          { requiresBuildable: true },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: true },
        ],
        [
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: true },
          { requiresBuildable: true },
          { requiresBuildable: true },
        ],
      ],
      additionalPlacementTiles: [
        {
          x: 9,
          y: 4,
          width: 1,
          height: 1,
          onlyNeedsToBePassable: false,
        },
        {
          x: 5,
          y: 5,
          width: 1,
          height: 1,
          onlyNeedsToBePassable: true,
        },
      ],
    });
    expect(buildingMetadataById.Farmhouse.tilePropertyGrid).toContainEqual({
      x: 5,
      y: 5,
      properties: [
        { layer: "Back", name: "NoFurniture", value: "t" },
        { layer: "Back", name: "Spawnable", value: "F" },
      ],
    });
  });

  it("uses the full building footprint when the locked Greenhouse has no collision map or tile properties", async () => {
    const buildingMetadataById = createBuildingPlacementMetadata(
      await readLockedBuildingRecords(),
    );

    expect(buildingMetadataById.Greenhouse).toEqual({
      size: { width: 7, height: 6 },
      collisionMap: Array.from({ length: 6 }, () =>
        Array.from({ length: 7 }, () => ({ requiresBuildable: true })),
      ),
      additionalPlacementTiles: [
        {
          x: 2,
          y: 6,
          width: 3,
          height: 2,
          onlyNeedsToBePassable: true,
        },
      ],
      humanDoor: { x: 3, y: 5 },
      tilePropertyGrid: [],
    });
  });

  it("retains Cabin and Pet Bowl collision requirements and raw properties without inventing placement rules", async () => {
    const buildingMetadataById = createBuildingPlacementMetadata(
      await readLockedBuildingRecords(),
    );

    expect(buildingMetadataById.Cabin).toMatchObject({
      size: { width: 5, height: 3 },
      collisionMap: [
        Array.from({ length: 5 }, () => ({ requiresBuildable: true })),
        Array.from({ length: 5 }, () => ({ requiresBuildable: true })),
        [
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: false },
          { requiresBuildable: true },
        ],
      ],
      additionalPlacementTiles: [],
      humanDoor: { x: 2, y: 1 },
    });
    expect(buildingMetadataById.Cabin.tilePropertyGrid).toContainEqual({
      x: 1,
      y: 2,
      properties: [
        { layer: "Back", name: "NoSpawn", value: "All" },
        { layer: "Back", name: "Buildable", value: "f" },
        { layer: "Back", name: "Diggable", value: null },
        { layer: "Back", name: "Type", value: "Wood" },
        { layer: "Back", name: "NoFurniture", value: "f" },
      ],
    });
    expect(buildingMetadataById["Pet Bowl"]).toMatchObject({
      size: { width: 2, height: 2 },
      collisionMap: [
        [{ requiresBuildable: false }, { requiresBuildable: true }],
        [{ requiresBuildable: false }, { requiresBuildable: false }],
      ],
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
    });
    expect(buildingMetadataById["Pet Bowl"].tilePropertyGrid).toContainEqual({
      x: 1,
      y: 0,
      properties: [
        { layer: "Back", name: "NoFurniture", value: "T" },
        { layer: "Back", name: "Placeable", value: "F" },
        { layer: "Buildings", name: "PetBowl", value: "T" },
      ],
    });
  });

  it("rejects malformed placement fields with the building ID, field path, and received value", async () => {
    const invalidAdditionalTileRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    invalidAdditionalTileRecords.Farmhouse.AdditionalPlacementTiles = [
      {
        TileArea: { X: 9, Y: 4, Width: 1, Height: 1 },
        OnlyNeedsToBePassable: "yes",
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(invalidAdditionalTileRecords),
    ).toThrow(
      'building "Farmhouse" field "AdditionalPlacementTiles[0].OnlyNeedsToBePassable" must be a boolean; received "yes"',
    );

    const invalidCollisionMapRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    invalidCollisionMapRecords.Cabin.CollisionMap = "XXXXX\nXXXXX\nZZZZZ";

    expect(() =>
      createBuildingPlacementMetadata(invalidCollisionMapRecords),
    ).toThrow(
      'building "Cabin" field "CollisionMap" row 2 must contain only "X" or "O" cells; received "ZZZZZ"',
    );

    const invalidTilePropertyRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    invalidTilePropertyRecords["Pet Bowl"].TileProperties = [
      {
        Id: "Default_NotPlaceable",
        Name: "Placeable",
        Value: "F",
        Layer: 7,
        TileArea: { X: 0, Y: 0, Width: 2, Height: 2 },
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(invalidTilePropertyRecords),
    ).toThrow(
      'building "Pet Bowl" field "TileProperties[0].Layer" must be a non-empty string; received 7',
    );
  });

  it("rejects unsafe integer values at Size, HumanDoor, and TileArea boundaries", async () => {
    const unsafeSizeRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    unsafeSizeRecords.Farmhouse.Size = {
      X: Number.MAX_SAFE_INTEGER + 1,
      Y: 5,
    };

    expect(() => createBuildingPlacementMetadata(unsafeSizeRecords)).toThrow(
      'building "Farmhouse" field "Size.X" must be a positive safe integer; received 9007199254740992',
    );

    const unsafeHumanDoorRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    unsafeHumanDoorRecords.Farmhouse.HumanDoor = {
      X: Number.MAX_SAFE_INTEGER + 1,
      Y: 2,
    };

    expect(() =>
      createBuildingPlacementMetadata(unsafeHumanDoorRecords),
    ).toThrow(
      'building "Farmhouse" field "HumanDoor.X" must be a safe integer from -1 to 8; received 9007199254740992',
    );

    const unsafeAdditionalTileRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    unsafeAdditionalTileRecords.Farmhouse.AdditionalPlacementTiles = [
      {
        TileArea: {
          X: Number.MAX_SAFE_INTEGER + 1,
          Y: 4,
          Width: 1,
          Height: 1,
        },
        OnlyNeedsToBePassable: false,
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(unsafeAdditionalTileRecords),
    ).toThrow(
      'building "Farmhouse" field "AdditionalPlacementTiles[0].TileArea.X" must be a non-negative safe integer; received 9007199254740992',
    );

    const unsafeTilePropertyRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    unsafeTilePropertyRecords["Pet Bowl"].TileProperties = [
      {
        Id: "Default_NotPlaceable",
        Name: "Placeable",
        Value: "F",
        Layer: "Back",
        TileArea: {
          X: Number.MAX_SAFE_INTEGER + 1,
          Y: 0,
          Width: 1,
          Height: 1,
        },
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(unsafeTilePropertyRecords),
    ).toThrow(
      'building "Pet Bowl" field "TileProperties[0].TileArea.X" must be a non-negative safe integer; received 9007199254740992',
    );
  });

  it("rejects safe but oversized placement expansions before allocation or tile iteration", async () => {
    const oversizedSizeRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    oversizedSizeRecords.Farmhouse.Size = { X: 1025, Y: 1 };

    expect(() =>
      createBuildingPlacementMetadata(oversizedSizeRecords),
    ).toThrow(
      'building "Farmhouse" field "Size" must not exceed 1024 placement cells; received width 1025 and height 1',
    );

    const oversizedCollisionMapRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    oversizedCollisionMapRecords.Cabin.CollisionMap = [
      "X".repeat(1025),
      "XXXXX",
      "OOOOX",
    ].join("\n");

    expect(() =>
      createBuildingPlacementMetadata(oversizedCollisionMapRecords),
    ).toThrow(
      'building "Cabin" field "CollisionMap" row 0 must not exceed 1024 placement cells; received 1025 cells',
    );

    const oversizedAdditionalTileRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    oversizedAdditionalTileRecords.Farmhouse.AdditionalPlacementTiles = [
      {
        TileArea: { X: 9, Y: 4, Width: 600, Height: 1 },
        OnlyNeedsToBePassable: false,
      },
      {
        TileArea: { X: 5, Y: 5, Width: 600, Height: 1 },
        OnlyNeedsToBePassable: true,
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(oversizedAdditionalTileRecords),
    ).toThrow(
      'building "Farmhouse" field "AdditionalPlacementTiles" must not exceed 1024 placement cells; received 1200 cells',
    );

    const oversizedTilePropertyRecords = structuredClone(
      await readLockedBuildingRecords(),
    ) as Record<string, Record<string, unknown>>;
    oversizedTilePropertyRecords["Pet Bowl"].TileProperties = [
      {
        Id: "Default_First",
        Name: "First",
        Value: "T",
        Layer: "Back",
        TileArea: { X: 0, Y: 0, Width: 600, Height: 1 },
      },
      {
        Id: "Default_Second",
        Name: "Second",
        Value: "T",
        Layer: "Back",
        TileArea: { X: 0, Y: 0, Width: 600, Height: 1 },
      },
    ];

    expect(() =>
      createBuildingPlacementMetadata(oversizedTilePropertyRecords),
    ).toThrow(
      'building "Pet Bowl" field "TileProperties" must not exceed 1024 placement cells; received 1200 cells',
    );
  });
});
