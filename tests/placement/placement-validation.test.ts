import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
} from "../../src/catalog/building-placement-metadata";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createEmptyPlacementSnapshot,
  type NewPlacementItem,
  type PlacementBuilding,
  type PlacementCrop,
  type PlacementItem,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import { validatePlacement } from "../../src/placement/placement-validation";

function createPlacementGrid(
  capabilities: readonly Readonly<{
    buildable: boolean;
    diggable: boolean;
    passable: boolean;
  }>[],
  width = capabilities.length,
): MapPlacementGrid {
  return {
    width,
    height: capabilities.length / width,
    capabilitiesByTile: capabilities.map((tileCapabilities) => ({
      ...tileCapabilities,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
      crabPot: false,
    })),
  };
}

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {
    shed: {
      size: { width: 2, height: 1 },
      collisionMap: [[{ requiresBuildable: true }, { requiresBuildable: false }]],
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
    Farmhouse: {
      size: { width: 9, height: 5 },
      collisionMap: [
        Array.from({ length: 9 }, () => ({ requiresBuildable: true })),
        Array.from({ length: 9 }, () => ({ requiresBuildable: true })),
        Array.from({ length: 9 }, () => ({ requiresBuildable: true })),
        [
          { requiresBuildable: true },
          ...Array.from({ length: 7 }, () => ({ requiresBuildable: false })),
          { requiresBuildable: true },
        ],
        [
          ...Array.from({ length: 4 }, () => ({ requiresBuildable: true })),
          ...Array.from({ length: 3 }, () => ({ requiresBuildable: false })),
          ...Array.from({ length: 3 }, () => ({ requiresBuildable: true })),
        ],
      ],
      additionalPlacementTiles: [
        { x: 9, y: 4, width: 1, height: 1, onlyNeedsToBePassable: false },
        { x: 5, y: 5, width: 1, height: 1, onlyNeedsToBePassable: true },
      ],
      humanDoor: { x: 5, y: 2 },
      tilePropertyGrid: [],
    },
  };
}

function createPlacementSnapshot({
  buildings = [],
  crops = [],
  items = [],
}: Readonly<{
  buildings?: readonly PlacementBuilding[];
  crops?: readonly PlacementCrop[];
  items?: readonly PlacementItem[];
}> = {}): PlacementSnapshot {
  const emptySnapshot = createEmptyPlacementSnapshot();

  return {
    buildings,
    crops,
    items,
    nextBuildingId: Math.max(
      emptySnapshot.nextBuildingId,
      ...buildings.map((building) => building.instanceId + 1),
    ),
    nextItemId: Math.max(
      emptySnapshot.nextItemId,
      ...items.map((item) => item.instanceId + 1),
    ),
  };
}

function createPlacementItem(
  placementItem: Partial<PlacementItem> = {},
): PlacementItem {
  return {
    instanceId: 1,
    itemId: "placeable:chest",
    x: 0,
    y: 0,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
    ...placementItem,
  };
}

function createNewPlacementItem(
  placementItem: Partial<NewPlacementItem> = {},
): NewPlacementItem {
  const { instanceId: _instanceId, ...newPlacementItem } = createPlacementItem(
    placementItem,
  );

  return newPlacementItem;
}

function createBedCandidate(
  bedType: "single" | "double" | "child",
  placementItem: Partial<NewPlacementItem> = {},
) {
  const footprint = bedType === "double"
    ? { width: 3, height: 3 }
    : { width: 2, height: 3 };

  return {
    kind: "item" as const,
    item: createNewPlacementItem({
      itemId: `furniture:test-${bedType}-bed`,
      bedType,
      footprint,
      ...placementItem,
    }),
  };
}

describe("placement validation", () => {
  it("allows a building O collision cell without requiring it to be buildable", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: false, passable: true },
        { buildable: false, diggable: false, passable: false },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({ valid: true });
  });

  it("rejects a building X collision cell that is not buildable", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: false, diggable: false, passable: true },
        { buildable: true, diggable: false, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({
      valid: false,
      reason: "not-buildable",
      tile: { x: 0, y: 0 },
    });
  });

  it("reserves a building O collision cell against an existing crop", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: true, passable: true },
        { buildable: false, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot({
        crops: [{ cropId: "crop:parsnip", x: 1, y: 0 }],
      }),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({
      valid: false,
      reason: "occupied-by-crop",
      tile: { x: 1, y: 0 },
    });
  });

  it("applies Farmhouse extra collision, additional tiles, and HumanDoor requirements", () => {
    const gridCapabilities = Array.from({ length: 60 }, () => ({
      buildable: true,
      diggable: true,
      passable: true,
    }));
    const humanDoorTile = 2 * 10 + 5;

    gridCapabilities[humanDoorTile] = {
      buildable: false,
      diggable: true,
      passable: true,
    };

    const humanDoorValidation = validatePlacement({
      mapPlacementGrid: createPlacementGrid(gridCapabilities, 10),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "Farmhouse", x: 0, y: 0 },
      },
    });

    expect(humanDoorValidation).toEqual({
      valid: false,
      reason: "not-buildable",
      tile: { x: 5, y: 2 },
    });

    const additionalPassabilityCapabilities = Array.from({ length: 60 }, () => ({
      buildable: true,
      diggable: true,
      passable: true,
    }));
    additionalPassabilityCapabilities[5 * 10 + 5] = {
      buildable: true,
      diggable: true,
      passable: false,
    };

    const additionalPlacementValidation = validatePlacement({
      mapPlacementGrid: createPlacementGrid(additionalPassabilityCapabilities, 10),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "Farmhouse", x: 0, y: 0 },
      },
    });

    expect(additionalPlacementValidation).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 5, y: 5 },
    });
  });

  it("rejects building overlap with existing building additions, items, and fences but not paths", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 112 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      14,
    );
    const buildingMetadataById = createBuildingMetadataById();

    const buildingOverlap = validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        buildings: [{ instanceId: 1, buildingId: "Farmhouse", x: 0, y: 0 }],
      }),
      buildingMetadataById,
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 5, y: 5 },
      },
    });

    expect(buildingOverlap).toEqual({
      valid: false,
      reason: "occupied-by-building",
      tile: { x: 5, y: 5 },
    });

    for (const existingItem of [
      createPlacementItem({ layer: "item" }),
      createPlacementItem({ layer: "fence" }),
    ]) {
      const validation = validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: true },
          { buildable: true, diggable: true, passable: true },
        ]),
        placementSnapshot: createPlacementSnapshot({ items: [existingItem] }),
        buildingMetadataById,
        candidate: {
          kind: "building",
          building: { buildingId: "shed", x: 0, y: 0 },
        },
      });

      expect(validation).toEqual({
        valid: false,
        reason: existingItem.layer === "fence" ? "occupied-by-fence" : "occupied-by-item",
        tile: { x: 0, y: 0 },
      });
    }

    const pathValidation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: true, passable: true },
        { buildable: true, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot({
        items: [createPlacementItem({ layer: "path" })],
      }),
      buildingMetadataById,
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 0, y: 0 },
      },
    });

    expect(pathValidation).toEqual({ valid: true });
  });

  it("allows every building placement rule to be bypassed with freePlacement", () => {
    const validation = validatePlacement({
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid([
        { buildable: false, diggable: false, passable: false },
        { buildable: false, diggable: false, passable: false },
      ]),
      placementSnapshot: createPlacementSnapshot({
        crops: [{ cropId: "crop:parsnip", x: 1, y: 0 }],
        items: [createPlacementItem({ layer: "fence", x: 0, y: 0 })],
      }),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "building",
        building: { buildingId: "shed", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({ valid: true });
  });

  it("rejects a crop tile that is not diggable", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: false, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "crop",
        crop: { cropId: "crop:parsnip", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({
      valid: false,
      reason: "not-diggable",
      tile: { x: 0, y: 0 },
    });
  });

  it("rejects crops that overlap crops, buildings, ordinary items, or fences", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: true, diggable: true, passable: true },
    ]);
    const buildingMetadataById = createBuildingMetadataById();
    const overlappingSnapshots: readonly Readonly<{
      snapshot: PlacementSnapshot;
      reason:
        | "occupied-by-crop"
        | "occupied-by-building"
        | "occupied-by-item"
        | "occupied-by-fence";
    }>[] = [
      {
        snapshot: createPlacementSnapshot({
          crops: [{ cropId: "crop:parsnip", x: 0, y: 0 }],
        }),
        reason: "occupied-by-crop",
      },
      {
        snapshot: createPlacementSnapshot({
          buildings: [{ instanceId: 1, buildingId: "shed", x: 0, y: 0 }],
        }),
        reason: "occupied-by-building",
      },
      {
        snapshot: createPlacementSnapshot({ items: [createPlacementItem()] }),
        reason: "occupied-by-item",
      },
      {
        snapshot: createPlacementSnapshot({
          items: [createPlacementItem({ layer: "fence" })],
        }),
        reason: "occupied-by-fence",
      },
    ];

    for (const overlappingSnapshot of overlappingSnapshots) {
      const validation = validatePlacement({
        mapPlacementGrid,
        placementSnapshot: overlappingSnapshot.snapshot,
        buildingMetadataById,
        candidate: {
          kind: "crop",
          crop: { cropId: "crop:parsnip", x: 0, y: 0 },
        },
      });

      expect(validation).toEqual({
        valid: false,
        reason: overlappingSnapshot.reason,
        tile: { x: 0, y: 0 },
      });
    }
  });

  it("allows a crop above a path and bypasses crop rules with freePlacement", () => {
    const pathSnapshot = createPlacementSnapshot({
      items: [createPlacementItem({ layer: "path" })],
    });

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: false, diggable: true, passable: false },
        ]),
        placementSnapshot: pathSnapshot,
        buildingMetadataById: createBuildingMetadataById(),
        candidate: {
          kind: "crop",
          crop: { cropId: "crop:parsnip", x: 0, y: 0 },
        },
      }),
    ).toEqual({ valid: true });

    expect(
      validatePlacement({
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid([
          { buildable: false, diggable: false, passable: false },
        ]),
        placementSnapshot: createPlacementSnapshot({
          crops: [{ cropId: "crop:parsnip", x: 0, y: 0 }],
        }),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: {
          kind: "crop",
          crop: { cropId: "crop:parsnip", x: 0, y: 0 },
        },
      }),
    ).toEqual({ valid: true });
  });

  it("places ordinary catalog items only on passable unoccupied tiles while allowing paths underneath", () => {
    const itemCandidate = {
      kind: "item" as const,
      item: createNewPlacementItem({ layer: "item" }),
    };
    const buildingMetadataById = createBuildingMetadataById();

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: false },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById,
        candidate: itemCandidate,
      }),
    ).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 0, y: 0 },
    });

    for (const [snapshot, reason] of [
      [
        createPlacementSnapshot({
          buildings: [{ instanceId: 1, buildingId: "shed", x: 0, y: 0 }],
        }),
        "occupied-by-building",
      ],
      [
        createPlacementSnapshot({
          crops: [{ cropId: "crop:parsnip", x: 0, y: 0 }],
        }),
        "occupied-by-crop",
      ],
      [createPlacementSnapshot({ items: [createPlacementItem()] }), "occupied-by-item"],
      [
        createPlacementSnapshot({
          items: [createPlacementItem({ layer: "fence" })],
        }),
        "occupied-by-fence",
      ],
    ] as const) {
      expect(
        validatePlacement({
          mapPlacementGrid: createPlacementGrid([
            { buildable: true, diggable: true, passable: true },
          ]),
          placementSnapshot: snapshot,
          buildingMetadataById,
          candidate: itemCandidate,
        }),
      ).toEqual({ valid: false, reason, tile: { x: 0, y: 0 } });
    }

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: true },
        ]),
        placementSnapshot: createPlacementSnapshot({
          items: [createPlacementItem({ layer: "path" })],
        }),
        buildingMetadataById,
        candidate: itemCandidate,
      }),
    ).toEqual({ valid: true });
  });

  it("allows rugs and ordinary items to overlap in either placement order", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 25 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      5,
    );
    const buildingMetadataById = createBuildingMetadataById();
    const ordinaryItem = createPlacementItem({
      instanceId: 1,
      x: 2,
      y: 2,
    });
    const rugItem = createPlacementItem({
      instanceId: 2,
      itemId: "furniture_1451",
      footprint: { width: 3, height: 2 },
      isRug: true,
      x: 1,
      y: 1,
    });

    expect(
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({ items: [ordinaryItem] }),
        buildingMetadataById,
        candidate: {
          kind: "item",
          item: createNewPlacementItem(rugItem),
        },
      }),
    ).toEqual({ valid: true });

    expect(
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({ items: [rugItem] }),
        buildingMetadataById,
        candidate: {
          kind: "item",
          item: createNewPlacementItem(ordinaryItem),
        },
      }),
    ).toEqual({ valid: true });
  });

  it("rejects any rug-rug footprint intersection while keeping ordinary-item overlap blocked", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 25 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      5,
    );
    const buildingMetadataById = createBuildingMetadataById();

    expect(
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({
          items: [
            createPlacementItem({
              instanceId: 1,
              itemId: "furniture_1451",
              footprint: { width: 3, height: 2 },
              isRug: true,
              x: 1,
              y: 3,
            }),
          ],
        }),
        buildingMetadataById,
        candidate: {
          kind: "item",
          item: createNewPlacementItem({
            itemId: "furniture_1451",
            footprint: { width: 2, height: 3 },
            isRug: true,
            rotation: 1,
            x: 0,
            y: 1,
          }),
        },
      }),
    ).toEqual({
      valid: false,
      reason: "occupied-by-item",
      tile: { x: 1, y: 3 },
    });

    expect(
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({
          items: [createPlacementItem({ instanceId: 1, x: 1, y: 1 })],
        }),
        buildingMetadataById,
        candidate: {
          kind: "item",
          item: createNewPlacementItem({ x: 1, y: 1 }),
        },
      }),
    ).toEqual({
      valid: false,
      reason: "occupied-by-item",
      tile: { x: 1, y: 1 },
    });
  });

  it("keeps rug terrain, crop, building, path, and fence rules exact", () => {
    const rugCandidate = {
      kind: "item" as const,
      item: createNewPlacementItem({
        itemId: "furniture_1451",
        isRug: true,
      }),
    };
    const buildingMetadataById = createBuildingMetadataById();

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: false },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById,
        candidate: rugCandidate,
      }),
    ).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 0, y: 0 },
    });

    for (const [snapshot, expectedValidation] of [
      [
        createPlacementSnapshot({
          crops: [{ cropId: "crop:parsnip", x: 0, y: 0 }],
        }),
        {
          valid: false,
          reason: "occupied-by-crop",
          tile: { x: 0, y: 0 },
        },
      ],
      [
        createPlacementSnapshot({
          buildings: [{ instanceId: 1, buildingId: "shed", x: 0, y: 0 }],
        }),
        {
          valid: false,
          reason: "occupied-by-building",
          tile: { x: 0, y: 0 },
        },
      ],
      [
        createPlacementSnapshot({
          items: [createPlacementItem({ layer: "path" })],
        }),
        { valid: true },
      ],
      [
        createPlacementSnapshot({
          items: [createPlacementItem({ layer: "fence" })],
        }),
        { valid: true },
      ],
    ] as const) {
      expect(
        validatePlacement({
          mapPlacementGrid: createPlacementGrid([
            { buildable: true, diggable: true, passable: true },
          ]),
          placementSnapshot: snapshot,
          buildingMetadataById,
          candidate: rugCandidate,
        }),
      ).toEqual(expectedValidation);
    }
  });

  it("rejects floor placement on impassable tiles, paths, crops, trees, and grass", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: true, diggable: true, passable: true },
    ]);
    const floorCandidate = {
      kind: "floor" as const,
      item: createNewPlacementItem({ layer: "path" }),
    };

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: false },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: floorCandidate,
      }),
    ).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 0, y: 0 },
    });

    for (const [item, reason] of [
      [createPlacementItem({ layer: "path" }), "occupied-by-path"],
      [createPlacementItem({ itemId: "tree:oak" }), "occupied-by-tree-or-grass"],
      [createPlacementItem({ itemId: "grass:starter" }), "occupied-by-tree-or-grass"],
    ] as const) {
      const validation = validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({ items: [item] }),
        buildingMetadataById: createBuildingMetadataById(),
        itemPredicates: {
          isTree: (existingItem) => existingItem.itemId === "tree:oak",
          isGrass: (existingItem) => existingItem.itemId === "grass:starter",
        },
        candidate: floorCandidate,
      });

      expect(validation).toEqual({
        valid: false,
        reason,
        tile: { x: 0, y: 0 },
      });
    }
  });

  it("allows floor placement above ordinary items, fences, and ordinary buildings", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot({
        buildings: [{ instanceId: 1, buildingId: "shed", x: 0, y: 0 }],
        items: [
          createPlacementItem({ instanceId: 1 }),
          createPlacementItem({ instanceId: 2, layer: "fence" }),
        ],
      }),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: {
        kind: "floor",
        item: createNewPlacementItem({ layer: "path" }),
      },
    });

    expect(validation).toEqual({ valid: true });
  });

  it("rejects fences on impassable tiles, fences, and ordinary items", () => {
    const fenceCandidate = {
      kind: "fence" as const,
      item: createNewPlacementItem({ layer: "fence" }),
    };

    expect(
      validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: false },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: fenceCandidate,
      }),
    ).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 0, y: 0 },
    });

    for (const [item, reason] of [
      [createPlacementItem({ layer: "fence" }), "occupied-by-fence"],
      [createPlacementItem(), "occupied-by-item"],
    ] as const) {
      const validation = validatePlacement({
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: true },
        ]),
        placementSnapshot: createPlacementSnapshot({ items: [item] }),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: fenceCandidate,
      });

      expect(validation).toEqual({
        valid: false,
        reason,
        tile: { x: 0, y: 0 },
      });
    }
  });

  it("allows fences above paths, rugs, grass, crops, and buildings", () => {
    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot({
        buildings: [{ instanceId: 1, buildingId: "shed", x: 0, y: 0 }],
        crops: [{ cropId: "crop:parsnip", x: 0, y: 0 }],
        items: [
          createPlacementItem({ instanceId: 1, layer: "path" }),
          createPlacementItem({ instanceId: 2, isRug: true }),
          createPlacementItem({ instanceId: 3, itemId: "grass:starter" }),
        ],
      }),
      buildingMetadataById: createBuildingMetadataById(),
      itemPredicates: {
        isTree: () => false,
        isGrass: (existingItem) => existingItem.itemId === "grass:starter",
      },
      candidate: {
        kind: "fence",
        item: createNewPlacementItem({ layer: "fence" }),
      },
    });

    expect(validation).toEqual({ valid: true });
  });

  it("allows every floor and fence rule to be bypassed with freePlacement", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: false, diggable: false, passable: false },
    ]);
    const placementSnapshot = createPlacementSnapshot({
      items: [createPlacementItem({ layer: "fence" })],
    });

    for (const candidate of [
      {
        kind: "floor" as const,
        item: createNewPlacementItem({ layer: "path" }),
      },
      {
        kind: "fence" as const,
        item: createNewPlacementItem({ layer: "fence" }),
      },
    ]) {
      expect(
        validatePlacement({
          freePlacement: true,
          mapPlacementGrid,
          placementSnapshot,
          buildingMetadataById: createBuildingMetadataById(),
          candidate,
        }),
      ).toEqual({ valid: true });
    }
  });

  it("returns valid before map-range checks for every freePlacement candidate kind", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: false, diggable: false, passable: false },
    ]);
    const buildingMetadataById = createBuildingMetadataById();

    for (const candidate of [
      {
        kind: "building" as const,
        building: { buildingId: "shed", x: 1, y: 0 },
      },
      {
        kind: "crop" as const,
        crop: { cropId: "crop:parsnip", x: 1, y: 0 },
      },
      {
        kind: "floor" as const,
        item: createNewPlacementItem({ layer: "path", x: 1, y: 0 }),
      },
      {
        kind: "fence" as const,
        item: createNewPlacementItem({ layer: "fence", x: 1, y: 0 }),
      },
    ]) {
      expect(
        validatePlacement({
          freePlacement: true,
          mapPlacementGrid,
          placementSnapshot: createPlacementSnapshot(),
          buildingMetadataById,
          candidate,
        }),
      ).toEqual({ valid: true });
    }
  });

  it("returns valid for a field-valid freePlacement candidate before reading map dependencies", () => {
    const validCropCandidate = {
      kind: "crop" as const,
      crop: { cropId: "crop:parsnip", x: 0, y: 0 },
    };

    for (const dependencyName of [
      "mapPlacementGrid",
      "placementSnapshot",
      "buildingMetadataById",
    ] as const) {
      const freePlacementInput = {
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: true },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: validCropCandidate,
        [dependencyName]: null,
      };

      expect(
        validatePlacement(freePlacementInput as unknown as Parameters<typeof validatePlacement>[0]),
      ).toEqual({ valid: true });
    }
  });

  it("rejects malformed floor item fields before freePlacement can bypass map validation", () => {
    expect(() =>
      validatePlacement({
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid([
          { buildable: true, diggable: true, passable: true },
        ]),
        placementSnapshot: createPlacementSnapshot(),
        buildingMetadataById: createBuildingMetadataById(),
        candidate: {
          kind: "floor",
          item: createNewPlacementItem({ itemId: "", layer: "path" }),
        },
      }),
    ).toThrow('floor item.itemId must be a non-empty string; received ""');
  });

  it("rejects rug flags on floor and fence candidates before freePlacement", () => {
    for (const candidate of [
      {
        kind: "floor" as const,
        item: createNewPlacementItem({ isRug: true, layer: "path" }),
      },
      {
        kind: "fence" as const,
        item: createNewPlacementItem({ isRug: true, layer: "fence" }),
      },
    ]) {
      expect(() =>
        validatePlacement({
          freePlacement: true,
          mapPlacementGrid: createPlacementGrid([
            { buildable: true, diggable: true, passable: true },
          ]),
          placementSnapshot: createPlacementSnapshot(),
          buildingMetadataById: createBuildingMetadataById(),
          candidate,
        })
      ).toThrow(
        `item isRug true requires layer "item"; received ${JSON.stringify(candidate.item.layer)}`,
      );
    }
  });

  it("applies the frozen bed terrain mask while retaining full bounds and building collision", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 20 }, (_, tileIndex) => ({
        buildable: true,
        diggable: true,
        passable: tileIndex >= 5,
      })),
      5,
    );
    const buildingMetadataById = createBuildingMetadataById();
    const doubleBedCandidate = createBedCandidate("double", { x: 1, y: 0 });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        crops: [{ cropId: "crop:parsnip", x: 1, y: 0 }],
      }),
      buildingMetadataById,
      candidate: doubleBedCandidate,
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        crops: [{ cropId: "crop:parsnip", x: 1, y: 1 }],
      }),
      buildingMetadataById,
      candidate: doubleBedCandidate,
    })).toEqual({
      valid: false,
      reason: "occupied-by-crop",
      tile: { x: 1, y: 1 },
    });

    expect(validatePlacement({
      mapPlacementGrid: createPlacementGrid(
        Array.from({ length: 20 }, (_, tileIndex) => ({
          buildable: true,
          diggable: true,
          passable: tileIndex !== 6,
        })),
        5,
      ),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById,
      candidate: doubleBedCandidate,
    })).toEqual({
      valid: false,
      reason: "not-passable",
      tile: { x: 1, y: 1 },
    });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        buildings: [{ instanceId: 1, buildingId: "shed", x: 1, y: 0 }],
      }),
      buildingMetadataById,
      candidate: doubleBedCandidate,
    })).toEqual({
      valid: false,
      reason: "occupied-by-building",
      tile: { x: 1, y: 0 },
    });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById,
      candidate: createBedCandidate("double", { x: 3, y: 0 }),
    })).toEqual({
      valid: false,
      reason: "outside-map",
      tile: { x: 5, y: 0 },
    });
  });

  it("keeps bed full-footprint item collision while allowing paths, rugs, and grass", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 30 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      6,
    );
    const buildingMetadataById = createBuildingMetadataById();
    const singleBedCandidate = createBedCandidate("single", { x: 2, y: 1 });

    for (const existingItem of [
      createPlacementItem({ instanceId: 1, layer: "path", x: 2, y: 1 }),
      createPlacementItem({ instanceId: 1, isRug: true, x: 2, y: 1 }),
      createPlacementItem({ instanceId: 1, isGrass: true, x: 2, y: 1 }),
    ]) {
      expect(validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({ items: [existingItem] }),
        buildingMetadataById,
        candidate: singleBedCandidate,
      })).toEqual({ valid: true });
    }

    for (const [existingItem, reason] of [
      [createPlacementItem({ instanceId: 1, x: 2, y: 1 }), "occupied-by-item"],
      [
        createPlacementItem({ instanceId: 1, layer: "fence", x: 2, y: 1 }),
        "occupied-by-fence",
      ],
    ] as const) {
      expect(validatePlacement({
        mapPlacementGrid,
        placementSnapshot: createPlacementSnapshot({ items: [existingItem] }),
        buildingMetadataById,
        candidate: singleBedCandidate,
      })).toEqual({
        valid: false,
        reason,
        tile: { x: 2, y: 1 },
      });
    }
  });

  it("enforces exact double, single, and child bed exit clearance with rug exemptions", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 35 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      7,
    );
    const buildingMetadataById = createBuildingMetadataById();
    const leftBlocker = createPlacementItem({ instanceId: 1, x: 1, y: 2 });
    const rightBlocker = createPlacementItem({ instanceId: 2, x: 4, y: 2 });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({ items: [leftBlocker] }),
      buildingMetadataById,
      candidate: createBedCandidate("double", { x: 2, y: 1 }),
    })).toEqual({
      valid: false,
      reason: "occupied-by-item",
      tile: { x: 1, y: 2 },
    });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        items: [{ ...leftBlocker, isRug: true }],
      }),
      buildingMetadataById,
      candidate: createBedCandidate("double", { x: 2, y: 1 }),
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        items: [leftBlocker, rightBlocker],
      }),
      buildingMetadataById,
      candidate: createBedCandidate("single", { x: 2, y: 1 }),
    })).toEqual({
      valid: false,
      reason: "occupied-by-item",
      tile: { x: 1, y: 2 },
    });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({ items: [leftBlocker] }),
      buildingMetadataById,
      candidate: createBedCandidate("single", { x: 2, y: 1 }),
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        items: [leftBlocker, rightBlocker],
      }),
      buildingMetadataById,
      candidate: createBedCandidate("child", { x: 2, y: 1 }),
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById,
      candidate: createBedCandidate("double", { x: 0, y: 1 }),
    })).toEqual({ valid: true });
  });

  it("blocks later item-layer candidates only at an existing double-bed left exit", () => {
    const mapPlacementGrid = createPlacementGrid(
      Array.from({ length: 35 }, () => ({
        buildable: true,
        diggable: true,
        passable: true,
      })),
      7,
    );
    const buildingMetadataById = createBuildingMetadataById();
    const doubleBed = createPlacementItem({
      instanceId: 1,
      itemId: "furniture:test-double-bed",
      bedType: "double",
      footprint: { width: 3, height: 3 },
      x: 2,
      y: 1,
    });
    const doubleBedSnapshot = createPlacementSnapshot({ items: [doubleBed] });

    for (const candidateItem of [
      createNewPlacementItem({ x: 1, y: 2 }),
      createNewPlacementItem({ isGrass: true, x: 1, y: 2 }),
      createNewPlacementItem({
        bedType: "child",
        footprint: { width: 2, height: 3 },
        x: 0,
        y: 1,
      }),
    ]) {
      expect(validatePlacement({
        mapPlacementGrid,
        placementSnapshot: doubleBedSnapshot,
        buildingMetadataById,
        candidate: { kind: "item", item: candidateItem },
      })).toEqual({
        valid: false,
        reason: "occupied-by-item",
        tile: { x: 1, y: 2 },
      });
    }

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: doubleBedSnapshot,
      buildingMetadataById,
      candidate: {
        kind: "item",
        item: createNewPlacementItem({
          bedType: "child",
          footprint: { width: 2, height: 3 },
          x: 0,
          y: 2,
        }),
      },
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid: createPlacementGrid(
        Array.from({ length: 35 }, (_, tileIndex) => ({
          buildable: true,
          diggable: true,
          passable: tileIndex !== 17,
        })),
        7,
      ),
      placementSnapshot: createPlacementSnapshot({
        items: [
          createPlacementItem({
            instanceId: 1,
            itemId: "furniture:test-double-bed",
            bedType: "double",
            footprint: { width: 3, height: 3 },
            x: 3,
            y: 1,
          }),
        ],
      }),
      buildingMetadataById,
      candidate: createBedCandidate("single", { x: 2, y: 1 }),
    })).toEqual({
      valid: false,
      reason: "occupied-by-item",
      tile: { x: 2, y: 2 },
    });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: doubleBedSnapshot,
      buildingMetadataById,
      candidate: {
        kind: "item",
        item: createNewPlacementItem({ isRug: true, x: 1, y: 2 }),
      },
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: doubleBedSnapshot,
      buildingMetadataById,
      candidate: {
        kind: "fence",
        item: createNewPlacementItem({ layer: "fence", x: 1, y: 2 }),
      },
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid,
      placementSnapshot: createPlacementSnapshot({
        items: [{ ...doubleBed, bedType: "single" }],
      }),
      buildingMetadataById,
      candidate: { kind: "item", item: createNewPlacementItem({ x: 1, y: 2 }) },
    })).toEqual({ valid: true });
  });

  it("fails fast on invalid bed type, rug classification, rotation, and footprint before freePlacement", () => {
    const validationInput = {
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid([
        { buildable: true, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
    };

    expect(() => validatePlacement({
      ...validationInput,
      candidate: createBedCandidate("single", { bedType: "queen" as never }),
    })).toThrow('bedType must be one of "single", "double", or "child", or null; received "queen"');

    expect(() => validatePlacement({
      ...validationInput,
      candidate: createBedCandidate("single", { isRug: true }),
    })).toThrow('bedType "single" cannot be combined with isRug true');

    expect(() => validatePlacement({
      ...validationInput,
      candidate: createBedCandidate("single", { rotation: 1 }),
    })).toThrow("bed rotation must be 0; received 1");

    expect(() => validatePlacement({
      ...validationInput,
      candidate: createBedCandidate("double", {
        footprint: { width: 2, height: 3 },
      }),
    })).toThrow(
      "double bed footprint must be 3 by 3; received width 2, height 3",
    );
  });

  it("returns an outside-map rejection for normal candidates beyond the map boundary", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: true, diggable: true, passable: true },
    ]);
    const placementSnapshot = createPlacementSnapshot();
    const buildingMetadataById = createBuildingMetadataById();

    for (const candidate of [
      {
        kind: "building" as const,
        building: { buildingId: "shed", x: 1, y: 0 },
      },
      {
        kind: "crop" as const,
        crop: { cropId: "crop:parsnip", x: 1, y: 0 },
      },
      {
        kind: "floor" as const,
        item: createNewPlacementItem({ layer: "path", x: 1, y: 0 }),
      },
      {
        kind: "fence" as const,
        item: createNewPlacementItem({ layer: "fence", x: 1, y: 0 }),
      },
    ]) {
      expect(
        validatePlacement({
          mapPlacementGrid,
          placementSnapshot,
          buildingMetadataById,
          candidate,
        }),
      ).toEqual({
        valid: false,
        reason: "outside-map",
        tile: { x: 1, y: 0 },
      });
    }
  });

  it("requires a HumanDoor tile to be buildable even when its collision cell is O", () => {
    const buildingMetadataById: BuildingPlacementMetadataById = {
      doorShed: {
        size: { width: 1, height: 1 },
        collisionMap: [[{ requiresBuildable: false }]],
        additionalPlacementTiles: [],
        humanDoor: { x: 0, y: 0 },
        tilePropertyGrid: [],
      },
    };

    const validation = validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: false, diggable: true, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById,
      candidate: {
        kind: "building",
        building: { buildingId: "doorShed", x: 0, y: 0 },
      },
    });

    expect(validation).toEqual({
      valid: false,
      reason: "not-buildable",
      tile: { x: 0, y: 0 },
    });
  });

  it("fails fast with received values for unknown buildings and malformed candidates", () => {
    const mapPlacementGrid = createPlacementGrid([
      { buildable: true, diggable: true, passable: true },
    ]);
    const placementSnapshot = createPlacementSnapshot();
    const buildingMetadataById = createBuildingMetadataById();

    expect(() =>
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById,
        candidate: {
          kind: "building",
          building: { buildingId: "missing-building", x: 0, y: 0 },
        },
      }),
    ).toThrow('unknown building ID "missing-building"');

    expect(() =>
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById,
        candidate: {
          kind: "crop",
          crop: { cropId: "crop:parsnip", x: -1, y: 0 },
        },
      }),
    ).toThrow("received x -1, y 0");

    expect(() =>
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById,
        freePlacement: "yes" as never,
        candidate: {
          kind: "fence",
          item: createNewPlacementItem({ layer: "fence" }),
        },
      }),
    ).toThrow('received "yes"');

    expect(() =>
      validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById,
        candidate: undefined as never,
      }),
    ).toThrow("received undefined");
  });

  it("uses the dedicated crab-pot grid capability instead of ordinary passability", () => {
    const validCrabPotGrid: MapPlacementGrid = {
      width: 1,
      height: 1,
      capabilitiesByTile: [{
        buildable: false,
        crabPot: true,
        diggable: false,
        passable: false,
        treePlantable: false,
        treePlantableOnDirt: false,
        wall: false,
        water: true,
      }],
    };
    const crabPotCandidate = {
      kind: "item" as const,
      item: createNewPlacementItem({ itemId: "object:710" }),
    };

    expect(validatePlacement({
      mapPlacementGrid: validCrabPotGrid,
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: crabPotCandidate,
    })).toEqual({ valid: true });

    expect(validatePlacement({
      mapPlacementGrid: createPlacementGrid([
        { buildable: false, diggable: false, passable: true },
      ]),
      placementSnapshot: createPlacementSnapshot(),
      buildingMetadataById: createBuildingMetadataById(),
      candidate: crabPotCandidate,
    })).toEqual({
      valid: false,
      reason: "not-crab-pot-tile",
      tile: { x: 0, y: 0 },
    });
  });
});
