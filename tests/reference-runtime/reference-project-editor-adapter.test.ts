import { describe, expect, it } from "vitest";

import {
  commitPlacementHistory,
  createPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import { applyPlacementSnapshotAction } from "../../src/placement/placement-snapshot";
import {
  validateReferenceProjectDocument,
  type ReferenceJsonValue,
  type ReferenceProjectMap,
} from "../../src/reference-runtime/local-project-api";
import {
  applyReferenceOpenMapEdits,
  createReferenceOpenMapSession,
} from "../../src/reference-runtime/reference-project-editor-adapter";

function createSupportedReferenceMap(): ReferenceProjectMap {
  return {
    id: "map-standard",
    mapFile: "Farm.tmx",
    label: "Standard Farm",
    season: "fall",
    state: {
      buildings: [
        {
          instanceId: "b2",
          buildingId: "Big Shed",
          x: 3,
          y: 4,
          paintColor: {
            color1: { hue: 0, saturation: 100, lightness: 50 },
            color2: { hue: 120, saturation: 100, lightness: 50 },
            color3: { hue: 240, saturation: 100, lightness: 50 },
          },
          waterColor: "#33aaff",
          variant: 2,
          locked: true,
          buildingExtension: { doorsOpen: false },
        },
        {
          instanceId: "custom-building",
          buildingId: "Barn",
          x: 8,
          y: 9,
          variant: "deluxe",
        },
      ],
      crops: [
        {
          cropId: "crop_472",
          x: 5,
          y: 6,
          cropExtension: "preserved",
        },
      ],
      items: [
        {
          instanceId: "i1",
          itemId: "object_16",
          x: 7,
          y: 8,
          layer: "item",
          rotation: 2,
          footprint: { w: 1, h: 2, anchor: "center" },
          variant: 3,
          tintColor: "#abcdef",
          locked: true,
          isRug: false,
          isGrass: true,
          isTable: false,
          isLongTable: true,
          flipped: true,
          bedType: "double",
          growthStage: 3,
          heldItemId: "object_388",
          nightLightState: "off",
          tint: "extension-not-known-field",
          table: "extension-not-known-field",
        },
        {
          instanceId: "custom-item",
          itemId: "furniture_1290",
          x: 10,
          y: 11,
          layer: "path",
          rotation: 0,
          footprint: { w: 2, h: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: true,
          isGrass: false,
          isTable: true,
          isLongTable: false,
          flipped: false,
          bedType: null,
          rug: "extension-not-known-field",
          bed: "extension-not-known-field",
        },
        {
          instanceId: "i3",
          itemId: "fence_1",
          x: 12,
          y: 13,
          layer: "fence",
          rotation: 1,
          footprint: { w: 1, h: 1 },
          variant: 1,
          tintColor: "#123abc",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextBuildingId: 3,
      nextItemId: 4,
      stateExtension: ["preserved", { nested: true }],
    },
    decor: {
      wallpapers: { Bedroom: "17" },
      floors: { MainFloor: "MoreFloors:8" },
    },
    renovations: ["bedroom_open"],
    thumbnail: "/api/projects/project-alpha/maps/map-standard/thumbnail",
  };
}

function validateMapWithFrozenValidator(
  referenceProjectMap: ReferenceProjectMap,
): ReferenceProjectMap {
  return validateReferenceProjectDocument({
    version: 1,
    projects: [
      {
        id: "project-alpha",
        title: "Alpha Farm",
        created_at: "2026-08-02T00:00:00.000Z",
        updated_at: "2026-08-02T01:00:00.000Z",
        project: {
          version: 4,
          gameVersion: "1.6.15",
          projectName: "Alpha Farm",
          season: referenceProjectMap.season,
          activeMapId: referenceProjectMap.id,
          maps: [referenceProjectMap],
        },
        thumbnailsByMapId: {},
      },
    ],
  }).projects[0]!.project.maps[0]!;
}

it("round-trips an arbitrary chest tint and preserves a non-chest opaque tint during an unrelated edit", () => {
  const sourceMap = createSupportedReferenceMap();
  const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
  sourceItems.push({
    instanceId: "paintable-chest",
    itemId: "big-craftable:130",
    x: 20,
    y: 21,
    layer: "item",
    rotation: 0,
    footprint: { w: 1, h: 1 },
    variant: 0,
    tintColor: "#123abc",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  });
  const session = createReferenceOpenMapSession("project-alpha", sourceMap);
  const editedSnapshot = {
    ...session.placementSnapshot,
    items: session.placementSnapshot.items.map((item) => item.itemId === "big-craftable:130"
      ? { ...item, tintColor: "#abcdef" }
      : item.itemId === "object_16"
        ? { ...item, x: 70 }
        : item),
  };

  const savedMap = applyReferenceOpenMapEdits(session, { placementSnapshot: editedSnapshot });
  const savedItems = savedMap.state.items as Array<Record<string, unknown>>;

  expect(savedItems.find((item) => item.instanceId === "paintable-chest")?.tintColor).toBe("#abcdef");
  expect(savedItems.find((item) => item.instanceId === "i1")).toMatchObject({ x: 70, tintColor: "#abcdef" });
});

function createCircularRenovationArray(): unknown[] {
  const circularRenovation: unknown[] = [];
  circularRenovation.push(circularRenovation);
  return circularRenovation;
}

function createCircularRenovationObject(): Record<string, unknown> {
  const circularRenovation: Record<string, unknown> = {};
  circularRenovation.self = circularRenovation;
  return circularRenovation;
}

function createReferenceItemEnvelope(
  instanceId: string,
  itemId: string,
  overrides: Readonly<Record<string, ReferenceJsonValue>> = {},
): Record<string, ReferenceJsonValue> {
  return {
    instanceId,
    itemId,
    x: 10,
    y: 12,
    layer: "item",
    rotation: 0,
    footprint: { w: 1, h: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
    ...overrides,
  };
}

function createResolvedHeldItemReferenceMap(): ReferenceProjectMap {
  const sourceMap = createSupportedReferenceMap();
  sourceMap.state.items = [
    createReferenceItemEnvelope("i7", "object_16", {
      x: 2,
      unrelatedEnvelope: { keep: "before" },
    }),
    createReferenceItemEnvelope("custom-held-child", "furniture_45", {
      x: 5,
      y: 6,
      footprint: { w: 1, h: 1, childAnchor: "center" },
      childEnvelope: { keep: "child" },
    }),
    createReferenceItemEnvelope("i5", "furniture_1300", {
      x: 4,
      y: 6,
      footprint: { w: 2, h: 2, parentAnchor: "bottom" },
      isTable: true,
      heldItemId: "custom-held-child",
      parentEnvelope: { keep: "parent" },
    }),
    createReferenceItemEnvelope("i9", "furniture_1301", {
      x: 8,
      isTable: true,
      tailEnvelope: { keep: "after" },
    }),
  ];
  sourceMap.state.nextItemId = 10;
  return sourceMap;
}

describe("reference project editor adapter", () => {
  it("rejects a frozen fireplace whose legacy light state conflicts with its variant", () => {
    const sourceMap = createSupportedReferenceMap();
    sourceMap.state.items = [{
      instanceId: "fireplace",
      itemId: "furniture_1792",
      x: 1,
      y: 2,
      layer: "item",
      rotation: 0,
      footprint: { w: 2, h: 1 },
      variant: 0,
      tintColor: "#ffffff",
      locked: false,
      isRug: false,
      isGrass: false,
      isTable: false,
      isLongTable: false,
      flipped: false,
      bedType: null,
      nightLightState: "off",
    }];

    expect(() => createReferenceOpenMapSession("project-alpha", sourceMap)).toThrow(
      'Furniture fire item "furniture_1792" has conflicting variant 0 and nightLightState "off"',
    );
  });

  it("rejects a frozen fireplace whose variant is not a safe integer", () => {
    const sourceMap = createSupportedReferenceMap();
    sourceMap.state.items = [{
      instanceId: "fireplace",
      itemId: "furniture_1792",
      x: 1,
      y: 2,
      layer: "item",
      rotation: 0,
      footprint: { w: 2, h: 1 },
      variant: "unlit",
      tintColor: "#ffffff",
      locked: false,
      isRug: false,
      isGrass: false,
      isTable: false,
      isLongTable: false,
      flipped: false,
      bedType: null,
    }];

    expect(() => createReferenceOpenMapSession("project-alpha", sourceMap)).toThrow(
      'Furniture fire item "furniture_1792" variant must be a safe integer; received "unlit"',
    );
  });
  it.each([[], null])(
    "rejects a non-object edits container with project, map, field, and received value",
    (invalidEdits) => {
      const session = createReferenceOpenMapSession(
        "project-alpha",
        createSupportedReferenceMap(),
      );

      expect(() =>
        applyReferenceOpenMapEdits(
          session,
          invalidEdits as unknown as Parameters<typeof applyReferenceOpenMapEdits>[1],
        ),
      ).toThrow(/project-alpha.*map-standard.*edits.*(\[\]|null)/s);
    },
  );
  it("projects every supported frozen field with collision-free transient IDs", () => {
    const sourceMap = createSupportedReferenceMap();

    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(session).toMatchObject({
      projectId: "project-alpha",
      mapId: "map-standard",
      season: "fall",
      originalNextBuildingId: 3,
      originalNextItemId: 4,
      interiorDecor: {
        wallpapers: { Bedroom: "17" },
        floors: { MainFloor: "MoreFloors:8" },
      },
    });
    expect(session.buildingCanonicalToTransientIds).toEqual(
      new Map([
        ["b2", 2],
        ["custom-building", 1],
      ]),
    );
    expect(session.itemCanonicalToTransientIds).toEqual(
      new Map([
        ["i1", 1],
        ["custom-item", 2],
        ["i3", 3],
      ]),
    );
    expect(session.placementSnapshot).toEqual({
      buildings: [
        {
          instanceId: 2,
          buildingId: "Big Shed",
          x: 3,
          y: 4,
          variant: 2,
          paintColors: {
            color1: "#ff0000",
            color2: "#00ff00",
            color3: "#0000ff",
          },
        },
        {
          instanceId: 1,
          buildingId: "Barn",
          x: 8,
          y: 9,
        },
      ],
      crops: [{ cropId: "crop_472", x: 5, y: 6 }],
      items: [
        {
          instanceId: 1,
          itemId: "object_16",
          x: 7,
          y: 8,
          layer: "item",
          rotation: 2,
          footprint: { width: 1, height: 2 },
          variant: 3,
          tintColor: "#abcdef",
          locked: true,
          isRug: false,
          isGrass: true,
          isTable: false,
          isLongTable: true,
          flipped: true,
          bedType: "double",
          growthStage: 3,
          heldItemId: "object_388",
          nightLightState: "off",
        },
        {
          instanceId: 2,
          itemId: "furniture_1290",
          x: 10,
          y: 11,
          layer: "path",
          rotation: 0,
          footprint: { width: 2, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: true,
          isGrass: false,
          isTable: true,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
        {
          instanceId: 3,
          itemId: "fence_1",
          x: 12,
          y: 13,
          layer: "fence",
          rotation: 1,
          footprint: { width: 1, height: 1 },
          variant: 1,
          tintColor: "#123abc",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextBuildingId: 3,
      nextItemId: 4,
      interiorDecor: {
        wallpapers: { Bedroom: "17" },
        floors: { MainFloor: "MoreFloors:8" },
      },
    });
    expect(session.sourceMap).toEqual(sourceMap);
    expect(session.sourceMap).not.toBe(sourceMap);
  });

  it.each([
    { isTable: true, isLongTable: false },
    { isTable: false, isLongTable: true },
  ])(
    "projects a resolved held-item pointer into one nested child for loaded table metadata $isTable/$isLongTable",
    ({ isTable, isLongTable }) => {
      const sourceMap = createResolvedHeldItemReferenceMap();
      Object.assign(
        (sourceMap.state.items as Array<Record<string, unknown>>)[2]!,
        { isTable, isLongTable },
      );

      const session = createReferenceOpenMapSession("project-alpha", sourceMap);

      expect(session.itemCanonicalToTransientIds).toEqual(new Map([
        ["i7", 7],
        ["custom-held-child", 1],
        ["i5", 5],
        ["i9", 9],
      ]));
      expect(session.placementSnapshot.items.map((item) => item.instanceId)).toEqual([
        7,
        5,
        9,
      ]);
      expect(session.placementSnapshot.items[1]).toMatchObject({
        instanceId: 5,
        isTable,
        isLongTable,
        heldItem: {
          instanceId: 1,
          itemId: "furniture_45",
          x: 5,
          y: 6,
          layer: "item",
          footprint: { width: 1, height: 1 },
        },
      });
      expect(session.placementSnapshot.items[1]).not.toHaveProperty("heldItemId");
      expect(session.placementSnapshot.nextItemId).toBe(10);
    },
  );

  it.each([
    {
      name: "self relation",
      configure(items: Array<Record<string, unknown>>) {
        items[2]!.heldItemId = "i5";
      },
      expected: /parent.*i5.*child.*i5.*self.*received "i5"/is,
    },
    {
      name: "cycle",
      configure(items: Array<Record<string, unknown>>) {
        items[1]!.isTable = true;
        items[1]!.heldItemId = "i5";
      },
      expected: /cycle.*received.*custom-held-child.*i5/is,
    },
    {
      name: "multiple parents",
      configure(items: Array<Record<string, unknown>>) {
        items[3]!.heldItemId = "custom-held-child";
      },
      expected: /child.*custom-held-child.*multiple parents.*i5.*i9.*received/is,
    },
    {
      name: "non-table parent",
      configure(items: Array<Record<string, unknown>>) {
        items[2]!.isTable = false;
      },
      expected: /parent.*i5.*child.*custom-held-child.*table.*isTable false.*isLongTable false/is,
    },
    {
      name: "non-furniture child",
      configure(items: Array<Record<string, unknown>>) {
        items[1]!.itemId = "object_390";
      },
      expected: /parent.*i5.*child.*custom-held-child.*itemId.*furniture_.*received "object_390"/is,
    },
    {
      name: "non-item child layer",
      configure(items: Array<Record<string, unknown>>) {
        items[1]!.layer = "path";
      },
      expected: /parent.*i5.*child.*custom-held-child.*layer.*item.*received "path"/is,
    },
    {
      name: "non-1x1 child",
      configure(items: Array<Record<string, unknown>>) {
        items[1]!.footprint = { w: 2, h: 1 };
      },
      expected: /parent.*i5.*child.*custom-held-child.*footprint.*1x1.*received.*w.*2.*h.*1/is,
    },
    {
      name: "resolved child with a secondary relation",
      configure(items: Array<Record<string, unknown>>) {
        items[1]!.heldItemId = "legacy-dangling-child";
      },
      expected: /parent.*i5.*child.*custom-held-child.*secondary.*heldItemId.*received "legacy-dangling-child"/is,
    },
  ])("fails open before projection for $name", ({ configure, expected }) => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    configure(sourceMap.state.items as Array<Record<string, unknown>>);

    expect(() => createReferenceOpenMapSession("project-alpha", sourceMap)).toThrow(
      expected,
    );
  });

  it("expands an edited resolved relation at stable source positions with both opaque envelopes", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    const originalSourceItems = structuredClone(
      sourceMap.state.items,
    ) as Array<Record<string, unknown>>;
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const table = session.placementSnapshot.items[1];
    if (table?.heldItem === undefined) {
      throw new Error("Expected a projected table with a held child.");
    }
    const editedSnapshot = {
      ...session.placementSnapshot,
      items: session.placementSnapshot.items.map((item) =>
        item.instanceId === table.instanceId
          ? {
              ...item,
              y: 20,
              heldItem: { ...table.heldItem!, variant: 4, tintColor: "#123456" },
            }
          : item,
      ),
    };

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: editedSnapshot,
    });
    const savedItems = savedMap.state.items as Array<Record<string, unknown>>;

    expect(savedItems.map((item) => item.instanceId)).toEqual([
      "i7",
      "custom-held-child",
      "i5",
      "i9",
    ]);
    expect(savedItems[0]).toEqual(originalSourceItems[0]);
    expect(savedItems[1]).toEqual({
      ...(originalSourceItems[1] as Record<string, unknown>),
      variant: 4,
      tintColor: "#123456",
    });
    expect(savedItems[2]).toEqual({
      ...(originalSourceItems[2] as Record<string, unknown>),
      y: 20,
      heldItemId: "custom-held-child",
    });
    expect(savedItems[3]).toEqual(originalSourceItems[3]);
  });

  it("moves an existing child relation between tables without moving either source envelope", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createResolvedHeldItemReferenceMap(),
    );
    const firstTable = session.placementSnapshot.items[1];
    const secondTable = session.placementSnapshot.items[2];
    if (firstTable?.heldItem === undefined || secondTable === undefined) {
      throw new Error("Expected two projected tables and one held child.");
    }
    const movedChild = firstTable.heldItem;
    const editedSnapshot = {
      ...session.placementSnapshot,
      items: session.placementSnapshot.items.map((item) => {
        if (item.instanceId === firstTable.instanceId) {
          const withoutHeldItem = { ...item } as Record<string, unknown>;
          delete withoutHeldItem.heldItem;
          return withoutHeldItem as unknown as typeof item;
        }
        return item.instanceId === secondTable.instanceId
          ? { ...item, heldItem: movedChild }
          : item;
      }),
    };

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: editedSnapshot,
    });
    const savedItems = savedMap.state.items as Array<Record<string, unknown>>;

    expect(savedItems.map((item) => item.instanceId)).toEqual([
      "i7",
      "custom-held-child",
      "i5",
      "i9",
    ]);
    expect(savedItems[1]?.childEnvelope).toEqual({ keep: "child" });
    expect(savedItems[2]).not.toHaveProperty("heldItemId");
    expect(savedItems[3]?.heldItemId).toBe("custom-held-child");
  });

  it("deletes an original nested child and clears its parent pointer", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createResolvedHeldItemReferenceMap(),
    );
    const parent = session.placementSnapshot.items[1];
    if (parent === undefined) {
      throw new Error("Expected a projected parent table.");
    }
    const withoutHeldItem = { ...parent } as Record<string, unknown>;
    delete withoutHeldItem.heldItem;

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        items: session.placementSnapshot.items.map((item) =>
          item.instanceId === parent.instanceId
            ? withoutHeldItem as unknown as typeof item
            : item,
        ),
      },
    });

    expect(
      (savedMap.state.items as Array<Record<string, unknown>>).map(
        (item) => item.instanceId,
      ),
    ).toEqual(["i7", "i5", "i9"]);
    expect((savedMap.state.items as Array<Record<string, unknown>>)[1])
      .not.toHaveProperty("heldItemId");
  });

  it("allocates one collision-free canonical ID for a newly nested child", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    delete sourceItems[2]!.heldItemId;
    sourceItems.splice(1, 1);
    sourceMap.state.nextItemId = 5;
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const parent = session.placementSnapshot.items[1];
    if (parent === undefined) {
      throw new Error("Expected a projected parent table.");
    }
    const newHeldItem = {
      instanceId: session.placementSnapshot.nextItemId,
      itemId: "furniture_46",
      x: parent.x,
      y: parent.y,
      layer: "item" as const,
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
    };

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        items: session.placementSnapshot.items.map((item) =>
          item.instanceId === parent.instanceId
            ? { ...item, heldItem: newHeldItem }
            : item,
        ),
        nextItemId: newHeldItem.instanceId + 1,
      },
    });
    const savedItems = savedMap.state.items as Array<Record<string, unknown>>;

    expect(savedItems.map((item) => item.instanceId)).toEqual(["i7", "i5", "i9", "i6"]);
    expect(savedItems[1]?.heldItemId).toBe("i6");
    expect(savedItems[3]).toMatchObject({
      instanceId: "i6",
      itemId: "furniture_46",
    });
    expect(savedMap.state.nextItemId).toBe(7);
  });

  it("keeps an unresolved heldItemId as opaque legacy data", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    sourceItems[2]!.heldItemId = "missing-canonical-child";
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(session.placementSnapshot.items).toHaveLength(4);
    expect(session.placementSnapshot.items[2]).toMatchObject({
      instanceId: 5,
      heldItemId: "missing-canonical-child",
    });
    expect(applyReferenceOpenMapEdits(session, {
      placementSnapshot: session.placementSnapshot,
    })).toEqual(sourceMap);
  });

  it("round-trips a resolved held-item map without changing any source field", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(applyReferenceOpenMapEdits(session, {
      placementSnapshot: session.placementSnapshot,
      season: session.season,
      interiorDecor: session.interiorDecor,
      renovations: session.sourceMap.renovations,
    })).toEqual(sourceMap);
  });

  it("round-trips an unchanged loaded long-table relation exactly", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    Object.assign(
      (sourceMap.state.items as Array<Record<string, unknown>>)[2]!,
      { isTable: false, isLongTable: true },
    );
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(applyReferenceOpenMapEdits(session, {
      placementSnapshot: session.placementSnapshot,
    })).toEqual(sourceMap);
  });

  it("rejects moving an existing child relation onto a different long table", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    Object.assign(
      (sourceMap.state.items as Array<Record<string, unknown>>)[3]!,
      { isTable: false, isLongTable: true },
    );
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const originalParent = session.placementSnapshot.items[1];
    const longTable = session.placementSnapshot.items[2];
    if (originalParent?.heldItem === undefined || longTable === undefined) {
      throw new Error("Expected an ordinary parent, held child, and long table.");
    }
    const movedChild = originalParent.heldItem;
    const originalParentWithoutChild = { ...originalParent } as Record<
      string,
      unknown
    >;
    delete originalParentWithoutChild.heldItem;

    expect(() => applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        items: session.placementSnapshot.items.map((item) => {
          if (item.instanceId === originalParent.instanceId) {
            return originalParentWithoutChild as unknown as typeof item;
          }
          return item.instanceId === longTable.instanceId
            ? { ...item, heldItem: movedChild }
            : item;
        }),
      },
    })).toThrow(
      /parent transient instanceId 9.*canonical "i9".*child transient instanceId 1.*canonical "custom-held-child".*isTable false.*isLongTable true/is,
    );
  });

  it("rejects a new child relation on a long table before canonical allocation", () => {
    const sourceMap = createResolvedHeldItemReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    delete sourceItems[2]!.heldItemId;
    sourceItems.splice(1, 1);
    Object.assign(sourceItems[1]!, { isTable: false, isLongTable: true });
    sourceMap.state.nextItemId = Number.MAX_SAFE_INTEGER;
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const longTable = session.placementSnapshot.items[1];
    if (longTable === undefined) {
      throw new Error("Expected a projected long table.");
    }
    const newHeldItem = {
      instanceId: session.placementSnapshot.nextItemId,
      itemId: "furniture_46",
      x: longTable.x,
      y: longTable.y,
      layer: "item" as const,
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
    };

    expect(() => applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        items: session.placementSnapshot.items.map((item) =>
          item.instanceId === longTable.instanceId
            ? { ...item, heldItem: newHeldItem }
            : item,
        ),
        nextItemId: newHeldItem.instanceId + 1,
      },
    })).toThrow(
      /parent transient instanceId 5.*canonical "i5".*child transient instanceId 10.*canonical unknown.*isTable false.*isLongTable true/is,
    );
  });

  it("round-trips explicit numeric building variant and waterColor while preserving opaque source values", () => {
    const sourceMap = createSupportedReferenceMap();
    const sourceBuildings = sourceMap.state.buildings as Array<Record<string, unknown>>;
    sourceBuildings[0]!.variant = 0;
    sourceBuildings[0]!.waterColor = 3_964_566;
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(session.placementSnapshot.buildings[0]).toMatchObject({
      variant: 0,
      waterColor: 3_964_566,
    });
    expect(session.placementSnapshot.buildings[1]).not.toHaveProperty("variant");

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        buildings: session.placementSnapshot.buildings.map((building) =>
          building.instanceId === 2 ? { ...building, x: 40 } : building
        ),
      },
    });

    expect(savedMap.state.buildings).toEqual([
      expect.objectContaining({
        instanceId: "b2",
        variant: 0,
        waterColor: 3_964_566,
        x: 40,
      }),
      expect.objectContaining({
        instanceId: "custom-building",
        variant: "deluxe",
      }),
    ]);
  });

  it("reserves generated suffixes before allocating arbitrary transient IDs", () => {
    const sourceMap = createSupportedReferenceMap();
    const buildings = sourceMap.state.buildings as Array<
      Record<string, unknown>
    >;
    const items = sourceMap.state.items as Array<Record<string, unknown>>;
    buildings.reverse();
    buildings[1]!.instanceId = "b1";
    sourceMap.state.nextBuildingId = 2;
    items.splice(0, 2, items[1]!, items[0]!);

    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    expect(session.buildingCanonicalToTransientIds).toEqual(
      new Map([
        ["custom-building", 2],
        ["b1", 1],
      ]),
    );
    expect(session.itemCanonicalToTransientIds).toEqual(
      new Map([
        ["custom-item", 2],
        ["i1", 1],
        ["i3", 3],
      ]),
    );
    expect(session.placementSnapshot.nextBuildingId).toBe(3);
    expect(session.placementSnapshot.nextItemId).toBe(4);
  });

  it("returns the canonical source map unchanged for an open-save no-op", () => {
    const sourceMap = createSupportedReferenceMap();
    const originalSourceMap = structuredClone(sourceMap);
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: session.placementSnapshot,
      season: session.season,
      interiorDecor: session.interiorDecor,
      renovations: session.sourceMap.renovations,
    });

    expect(savedMap).toEqual(originalSourceMap);
    expect(validateMapWithFrozenValidator(savedMap)).toEqual(originalSourceMap);
    expect(savedMap).not.toBe(session.sourceMap);
    expect(sourceMap).toEqual(originalSourceMap);
    expect(session.sourceMap).toEqual(originalSourceMap);
  });

  it("round-trips an exact bed type and footprint while editing only its position", () => {
    const sourceMap = createSupportedReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    sourceItems[0] = {
      ...sourceItems[0],
      itemId: "furniture_2048",
      rotation: 0,
      footprint: { w: 2, h: 3, anchor: "center" },
      variant: 0,
      isGrass: false,
      isLongTable: false,
      bedType: "single",
    };
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const placementHistory = createPlacementHistory(session.placementSnapshot);
    const bedItem = placementHistory.currentState.items[0];
    if (bedItem === undefined) {
      throw new Error("Expected the reference fixture to contain a bed item.");
    }
    const editedPlacementSnapshot = applyPlacementSnapshotAction(
      placementHistory.currentState,
      {
        type: "replace-item",
        item: { ...bedItem, x: 20 },
      },
    );
    const editedHistory = commitPlacementHistory(
      placementHistory,
      editedPlacementSnapshot,
    );

    expect(editedHistory.currentState.items[0]).toMatchObject({
      bedType: "single",
      footprint: { width: 2, height: 3 },
      rotation: 0,
      x: 20,
    });
    expect(undoPlacementHistory(editedHistory).currentState).toEqual(
      placementHistory.currentState,
    );

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: editedHistory.currentState,
    });
    expect((savedMap.state.items as Array<Record<string, unknown>>)[0])
      .toMatchObject({
        bedType: "single",
        footprint: { w: 2, h: 3, anchor: "center" },
        itemId: "furniture_2048",
        rotation: 0,
        x: 20,
      });
    expect(
      createReferenceOpenMapSession("project-alpha", savedMap)
        .placementSnapshot.items[0],
    ).toMatchObject({
      bedType: "single",
      footprint: { width: 2, height: 3 },
      itemId: "furniture_2048",
      rotation: 0,
      x: 20,
    });
  });

  it("fails fast when a reference item contains an unsupported bed type", () => {
    const sourceMap = createSupportedReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    sourceItems[0]!.bedType = "queen";

    expect(() => createReferenceOpenMapSession("project-alpha", sourceMap))
      .toThrow(/state\.items\[0\]\.bedType.*queen/s);
  });

  it("merges edited placement, decor, renovations, and season onto preserved envelopes", () => {
    const sourceMap = createSupportedReferenceMap();
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const paintedBuilding = session.placementSnapshot.buildings[0];
    const editedItem = session.placementSnapshot.items[0];
    if (paintedBuilding === undefined || editedItem === undefined) {
      throw new Error("Expected the supported source map to contain placements.");
    }
    const withEditedBuilding = applyPlacementSnapshotAction(
      session.placementSnapshot,
      {
        type: "replace-building",
        building: {
          ...paintedBuilding,
          x: 30,
          paintColors: {
            color1: "#00ffff",
            color2: "#ff00ff",
            color3: "#ffff00",
          },
        },
      },
    );
    const editedPlacementSnapshot = applyPlacementSnapshotAction(
      withEditedBuilding,
      {
        type: "replace-item",
        item: {
          ...editedItem,
          y: 80,
          rotation: 3,
          footprint: { width: 2, height: 3 },
          variant: 7,
          tintColor: "#112233",
          locked: false,
          isRug: true,
          isGrass: false,
          isTable: true,
          isLongTable: false,
          flipped: false,
          bedType: null,
          growthStage: 4,
          heldItemId: "object_390",
        },
      },
    );

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: editedPlacementSnapshot,
      season: "winter",
      interiorDecor: {
        wallpapers: { Bedroom: "111" },
        floors: { MainFloor: "87" },
      },
      renovations: ["cellar", { enabled: true }],
    });

    expect(savedMap).toMatchObject({
      id: "map-standard",
      mapFile: "Farm.tmx",
      label: "Standard Farm",
      season: "winter",
      decor: {
        wallpapers: { Bedroom: "111" },
        floors: { MainFloor: "87" },
      },
      renovations: ["cellar", { enabled: true }],
      thumbnail: "/api/projects/project-alpha/maps/map-standard/thumbnail",
    });
    expect(savedMap.state.buildings).toEqual([
      {
        instanceId: "b2",
        buildingId: "Big Shed",
        x: 30,
        y: 4,
        paintColor: {
          color1: { hue: 180, saturation: 100, lightness: 50 },
          color2: { hue: 300, saturation: 100, lightness: 50 },
          color3: { hue: 60, saturation: 100, lightness: 50 },
        },
        waterColor: "#33aaff",
        variant: 2,
        locked: true,
        buildingExtension: { doorsOpen: false },
      },
      {
        instanceId: "custom-building",
        buildingId: "Barn",
        x: 8,
        y: 9,
        variant: "deluxe",
      },
    ]);
    expect((savedMap.state.items as unknown[])[0]).toEqual({
      instanceId: "i1",
      itemId: "object_16",
      x: 7,
      y: 80,
      layer: "item",
      rotation: 3,
      footprint: { w: 2, h: 3, anchor: "center" },
      variant: 7,
      tintColor: "#112233",
      locked: false,
      isRug: true,
      isGrass: false,
      isTable: true,
      isLongTable: false,
      flipped: false,
      bedType: null,
      growthStage: 4,
      heldItemId: "object_390",
      nightLightState: "off",
      tint: "extension-not-known-field",
      table: "extension-not-known-field",
    });
    expect(savedMap.state.crops).toEqual(sourceMap.state.crops);
    expect(savedMap.state.stateExtension).toEqual(sourceMap.state.stateExtension);
    expect(validateMapWithFrozenValidator(savedMap)).toEqual(savedMap);
    expect(sourceMap).toEqual(createSupportedReferenceMap());
  });

  it("updates only the edited paint channel while preserving paint envelopes", () => {
    const sourceMap = createSupportedReferenceMap();
    const sourceBuildings = sourceMap.state.buildings as Array<
      Record<string, unknown>
    >;
    const paintedSourceBuilding = sourceBuildings[0];
    if (paintedSourceBuilding === undefined) {
      throw new Error("Expected a painted source building.");
    }
    const sourceColor2 = {
      hue: 17.25,
      saturation: 66.6,
      lightness: 38.4,
      channelExtension: { source: "color2" },
    };
    const sourceColor3 = {
      hue: 210.5,
      saturation: 41.25,
      lightness: 62.75,
      channelExtension: { source: "color3" },
    };
    paintedSourceBuilding.paintColor = {
      color1: {
        hue: 0,
        saturation: 100,
        lightness: 50,
        channelExtension: { source: "color1" },
      },
      color2: sourceColor2,
      color3: sourceColor3,
      paintExtension: { paletteName: "imported" },
    };
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const projectedBuilding = session.placementSnapshot.buildings[0];
    if (projectedBuilding?.paintColors === undefined) {
      throw new Error("Expected projected paint colors.");
    }
    const editedSnapshot = applyPlacementSnapshotAction(
      session.placementSnapshot,
      {
        type: "replace-building",
        building: {
          ...projectedBuilding,
          paintColors: {
            ...projectedBuilding.paintColors,
            color1: "#00ffff",
          },
        },
      },
    );

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: editedSnapshot,
    });
    const savedBuilding = (
      savedMap.state.buildings as Array<Record<string, unknown>>
    )[0];
    const savedPaintColor = savedBuilding?.paintColor as Record<
      string,
      unknown
    >;

    expect(savedPaintColor.paintExtension).toEqual({
      paletteName: "imported",
    });
    expect(savedPaintColor.color1).toEqual({
      hue: 180,
      saturation: 100,
      lightness: 50,
      channelExtension: { source: "color1" },
    });
    expect(savedPaintColor.color2).toEqual(sourceColor2);
    expect(savedPaintColor.color3).toEqual(sourceColor3);
  });

  it.each([
    {
      name: "non-string decor",
      change(sourceMap: ReferenceProjectMap) {
        sourceMap.decor.wallpapers.Bedroom = { pattern: "17" };
      },
      expectedPath: "decor.wallpapers.Bedroom",
      expectedValue: '{"pattern":"17"}',
    },
    {
      name: "unsupported item layer",
      change(sourceMap: ReferenceProjectMap) {
        const firstItem = (sourceMap.state.items as Array<Record<string, unknown>>)[0];
        if (firstItem === undefined) {
          throw new Error("Expected the supported source map to contain an item.");
        }
        firstItem.layer = "furniture";
      },
      expectedPath: "state.items[0].layer",
      expectedValue: '"furniture"',
    },
  ])(
    "fails fast with project, map, path, and value for $name",
    ({ change, expectedPath, expectedValue }) => {
      const sourceMap = createSupportedReferenceMap();
      change(sourceMap);

      expect(() =>
        createReferenceOpenMapSession("project-alpha", sourceMap),
      ).toThrow(
        new RegExp(
          `project-alpha.*map-standard.*${expectedPath.replaceAll("[", "\\[").replaceAll("]", "\\]")}.*${expectedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
          "s",
        ),
      );
    },
  );

  it("fails save-side decor with project, map, canonical path, and value", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createSupportedReferenceMap(),
    );
    const editsWithInvalidDecor = {
      interiorDecor: {
        wallpapers: { Bedroom: 17 },
        floors: {},
      },
    } as unknown as Parameters<typeof applyReferenceOpenMapEdits>[1];

    expect(() =>
      applyReferenceOpenMapEdits(session, editsWithInvalidDecor),
    ).toThrow(
      /project-alpha.*map-standard.*decor\.wallpapers\.Bedroom.*17/s,
    );
  });

  it("fails save-side placement with project, map, canonical path, and value", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createSupportedReferenceMap(),
    );
    const placementSnapshotWithInvalidLayer = structuredClone(
      session.placementSnapshot,
    ) as unknown as {
      items: Array<Record<string, unknown>>;
    };
    const firstItem = placementSnapshotWithInvalidLayer.items[0];
    if (firstItem === undefined) {
      throw new Error("Expected a projected item.");
    }
    firstItem.layer = "furniture";

    expect(() =>
      applyReferenceOpenMapEdits(session, {
        placementSnapshot:
          placementSnapshotWithInvalidLayer as unknown as Parameters<
            typeof applyReferenceOpenMapEdits
          >[1]["placementSnapshot"],
      }),
    ).toThrow(
      /project-alpha.*map-standard.*state\.items\[0\]\.layer.*"furniture"/s,
    );
  });

  it.each([
    {
      name: "null season",
      edits: { season: null },
      expectedContext: /season.*null/s,
    },
    {
      name: "non-array renovations",
      edits: { renovations: { unexpected: true } },
      expectedContext: /renovations.*unexpected.*true/s,
    },
  ])(
    "fails save-side $name with project, map, path, and value",
    ({ edits, expectedContext }) => {
      const session = createReferenceOpenMapSession(
        "project-alpha",
        createSupportedReferenceMap(),
      );

      expect(() =>
        applyReferenceOpenMapEdits(
          session,
          edits as unknown as Parameters<typeof applyReferenceOpenMapEdits>[1],
        ),
      ).toThrow(
        new RegExp(
          `project-alpha.*map-standard.*${expectedContext.source}`,
          "s",
        ),
      );
    },
  );

  it.each([
    {
      name: "undefined element",
      createInvalidRenovation: () => undefined,
      expectedPath: "renovations[0]",
      expectedReceivedValue: /undefined/,
    },
    {
      name: "non-finite number",
      createInvalidRenovation: () => Number.POSITIVE_INFINITY,
      expectedPath: "renovations[0]",
      expectedReceivedValue: /Infinity/,
    },
    {
      name: "circular array",
      createInvalidRenovation: createCircularRenovationArray,
      expectedPath: "renovations[0][0]",
      expectedReceivedValue: /unserializable value/i,
    },
    {
      name: "circular object",
      createInvalidRenovation: createCircularRenovationObject,
      expectedPath: "renovations[0].self",
      expectedReceivedValue: /unserializable value/i,
    },
    {
      name: "non-plain object",
      createInvalidRenovation: () =>
        new Date("2026-08-03T00:00:00.000Z"),
      expectedPath: "renovations[0]",
      expectedReceivedValue: /2026-08-03T00:00:00\.000Z/,
    },
    {
      name: "own __proto__ property",
      createInvalidRenovation: () => JSON.parse('{"__proto__":"unsafe-proto"}'),
      expectedPath: "renovations[0]",
      expectedReceivedValue: /unsafe-proto/,
    },
    {
      name: "own constructor property",
      createInvalidRenovation: () => ({ constructor: "unsafe-constructor" }),
      expectedPath: "renovations[0]",
      expectedReceivedValue: /unsafe-constructor/,
    },
    {
      name: "own prototype property",
      createInvalidRenovation: () => ({ prototype: "unsafe-prototype" }),
      expectedPath: "renovations[0]",
      expectedReceivedValue: /unsafe-prototype/,
    },
    {
      name: "BigInt value",
      createInvalidRenovation: () => 1n,
      expectedPath: "renovations[0]",
      expectedReceivedValue: /unserializable value:.*BigInt/i,
    },
  ])(
    "rejects JSON-unsafe renovations: $name",
    ({ createInvalidRenovation, expectedPath, expectedReceivedValue }) => {
      const session = createReferenceOpenMapSession(
        "project-alpha",
        createSupportedReferenceMap(),
      );
      const renovations = [createInvalidRenovation()];
      let caughtError: unknown;

      try {
        applyReferenceOpenMapEdits(
          session,
          { renovations } as unknown as Parameters<
            typeof applyReferenceOpenMapEdits
          >[1],
        );
      } catch (receivedError) {
        caughtError = receivedError;
      }

      expect(caughtError).toBeInstanceOf(TypeError);
      expect(() => {
        throw caughtError;
      }).toThrow(
        new RegExp(
          `project-alpha.*map-standard.*${expectedPath
            .replaceAll("[", "\\[")
            .replaceAll("]", "\\]")}.*${expectedReceivedValue.source}`,
          "s",
        ),
      );
      expect(
        (caughtError as Error & { cause?: unknown }).cause,
      ).toBeInstanceOf(Error);
    },
  );

  it("normalizes sparse renovation array holes to owned null elements", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createSupportedReferenceMap(),
    );
    const sparseRenovationArray = new Array<unknown>(1);

    const savedMap = applyReferenceOpenMapEdits(
      session,
      { renovations: [sparseRenovationArray] } as unknown as Parameters<
        typeof applyReferenceOpenMapEdits
      >[1],
    );
    const savedRenovationArray = savedMap.renovations[0];
    if (!Array.isArray(savedRenovationArray)) {
      throw new Error("Expected a saved renovation array.");
    }

    expect(savedRenovationArray).toEqual([null]);
    expect(0 in savedRenovationArray).toBe(true);
    expect(validateMapWithFrozenValidator(savedMap)).toEqual(savedMap);
  });

  it("normalizes negative zero renovations to positive zero", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createSupportedReferenceMap(),
    );

    const savedMap = applyReferenceOpenMapEdits(session, {
      renovations: [-0],
    });
    const savedRenovation = savedMap.renovations[0];

    expect(savedRenovation).toBe(0);
    expect(Object.is(savedRenovation, -0)).toBe(false);
    expect(validateMapWithFrozenValidator(savedMap)).toEqual(savedMap);
  });

  it("keeps arbitrary IDs through delete, undo, save, and reopen while allocating new canonical IDs", () => {
    const sourceMap = createSupportedReferenceMap();
    const session = createReferenceOpenMapSession("project-alpha", sourceMap);
    const customBuildingTransientId =
      session.buildingCanonicalToTransientIds.get("custom-building");
    const customItemTransientId =
      session.itemCanonicalToTransientIds.get("custom-item");
    if (
      customBuildingTransientId === undefined ||
      customItemTransientId === undefined
    ) {
      throw new Error("Expected arbitrary source IDs to have transient IDs.");
    }
    const withoutCustomBuilding = applyPlacementSnapshotAction(
      session.placementSnapshot,
      {
        type: "delete-building",
        instanceId: customBuildingTransientId,
      },
    );
    const withoutCustomPlacements = applyPlacementSnapshotAction(
      withoutCustomBuilding,
      { type: "delete-item", instanceId: customItemTransientId },
    );
    const deletionHistory = commitPlacementHistory(
      createPlacementHistory(session.placementSnapshot),
      withoutCustomPlacements,
    );
    const savedDeletion = applyReferenceOpenMapEdits(session, {
      placementSnapshot: deletionHistory.currentState,
    });

    expect(
      (savedDeletion.state.buildings as Array<{ instanceId: string }>).map(
        (building) => building.instanceId,
      ),
    ).toEqual(["b2"]);
    expect(
      (savedDeletion.state.items as Array<{ instanceId: string }>).map(
        (item) => item.instanceId,
      ),
    ).toEqual(["i1", "i3"]);

    const restoredSnapshot = undoPlacementHistory(deletionHistory).currentState;
    const snapshotWithNewBuilding = applyPlacementSnapshotAction(
      restoredSnapshot,
      {
        type: "add-building",
        building: { buildingId: "Barn", x: 20, y: 21 },
      },
    );
    const snapshotWithNewPlacements = applyPlacementSnapshotAction(
      snapshotWithNewBuilding,
      {
        type: "add-item",
        item: {
          itemId: "object_390",
          x: 22,
          y: 23,
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
        },
      },
    );
    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: snapshotWithNewPlacements,
    });

    expect(
      (savedMap.state.buildings as Array<{ instanceId: string }>).map(
        (building) => building.instanceId,
      ),
    ).toEqual(["b2", "custom-building", "b3"]);
    expect(
      (savedMap.state.items as Array<{ instanceId: string }>).map(
        (item) => item.instanceId,
      ),
    ).toEqual(["i1", "custom-item", "i3", "i4"]);
    expect(savedMap.state.nextBuildingId).toBe(4);
    expect(savedMap.state.nextItemId).toBe(5);
    expect(Object.hasOwn(
      (savedMap.state.items as Array<Record<string, unknown>>)[3] ?? {},
      "growthStage",
    )).toBe(false);
    expect(validateMapWithFrozenValidator(savedMap)).toEqual(savedMap);

    const reopenedSession = createReferenceOpenMapSession(
      "project-alpha",
      savedMap,
    );
    expect(reopenedSession.buildingCanonicalToTransientIds).toEqual(
      new Map([
        ["b2", 2],
        ["custom-building", 1],
        ["b3", 3],
      ]),
    );
    expect(reopenedSession.itemCanonicalToTransientIds).toEqual(
      new Map([
        ["i1", 1],
        ["custom-item", 2],
        ["i3", 3],
        ["i4", 4],
      ]),
    );
    expect(applyReferenceOpenMapEdits(reopenedSession, {})).toEqual(savedMap);
  });

  it("reports an invalid source growth stage at the exact state item path", () => {
    const sourceMap = createSupportedReferenceMap();
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    sourceItems[0]!.growthStage = -1;

    expect(() => createReferenceOpenMapSession(
      "project-alpha",
      sourceMap,
    )).toThrow(
      'field "state.items[0].growthStage" must be a non-negative safe integer; received -1',
    );
  });

  it("does not transfer crop extensions to a replacement crop without canonical identity", () => {
    const session = createReferenceOpenMapSession(
      "project-alpha",
      createSupportedReferenceMap(),
    );
    const replacementSnapshot = applyPlacementSnapshotAction(
      session.placementSnapshot,
      {
        type: "replace-crop",
        coordinate: { x: 5, y: 6 },
        crop: { cropId: "crop_999", x: 5, y: 6 },
      },
    );

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: replacementSnapshot,
    });

    expect(savedMap.state.crops).toEqual([
      { cropId: "crop_999", x: 5, y: 6 },
    ]);
  });
});
