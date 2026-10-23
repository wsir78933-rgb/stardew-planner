import { describe, expect, it } from "vitest";
import {
  applyPlacementSnapshotAction,
  applyWorkingPlacementSnapshotAction,
  commitWorkingPlacementSnapshot,
  createEmptyPlacementSnapshot,
  createPersistentPlacementSnapshot,
  createPlacementState,
  createWorkingPlacementSnapshot,
  replacePlacementSnapshotInteriorDecor,
  restorePlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshotAction,
} from "../../src/placement/placement-snapshot";

function createStoredSnapshot() {
  return {
    buildings: [
      {
        instanceId: 3,
        buildingId: "building:Barn",
        x: 8,
        y: 12,
      },
    ],
    crops: [
      {
        cropId: "crop:24",
        x: 2,
        y: 4,
      },
    ],
    items: [
      {
        instanceId: 7,
        itemId: "placeable:Chest",
        x: 3,
        y: 5,
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
        heldItemId: "object:388",
      },
    ],
    nextBuildingId: 4,
    nextItemId: 8,
  };
}

function createNewItem() {
  return {
    itemId: "fence:1",
    x: -3,
    y: 9,
    layer: "fence" as const,
    rotation: 2,
    footprint: { width: 1, height: 1 },
    variant: 1,
    tintColor: "#55aa55",
    locked: true,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: true,
    bedType: "single" as const,
  };
}

describe("placement snapshot", () => {
  it("creates an empty persistent snapshot with independently owned collections", () => {
    const emptySnapshot = createEmptyPlacementSnapshot();

    expect(emptySnapshot).toEqual({
      buildings: [],
      crops: [],
      items: [],
      nextBuildingId: 1,
      nextItemId: 1,
    });
    expect(emptySnapshot.buildings).not.toBe(emptySnapshot.crops);
  });

  it("restores valid JSON into a deep-copied persistent snapshot", () => {
    const storedSnapshot = createStoredSnapshot() as {
      items: Array<{ footprint: { width: number } }>;
    };
    const restoredSnapshot = restorePlacementSnapshot(storedSnapshot);

    storedSnapshot.items[0].footprint.width = 99;

    expect(restoredSnapshot.items[0].footprint).toEqual({ width: 1, height: 1 });
    expect(restoredSnapshot).toEqual(createStoredSnapshot());
    expect(restoredSnapshot.items[0]?.animationOptions).toBeUndefined();
  });

  it("round-trips building, item, and held-item animation options without sharing arrays", () => {
    const storedSnapshot = {
      buildings: [
        {
          instanceId: 1,
          buildingId: "Fish Pond",
          x: 2,
          y: 3,
          animationOptions: { fishId: "128", population: 4, millLoaded: true },
        },
      ],
      crops: [],
      items: [
        {
          instanceId: 2,
          itemId: "furniture_724",
          x: 4,
          y: 5,
          layer: "item" as const,
          rotation: 0,
          footprint: { width: 2, height: 2 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: true,
          isLongTable: false,
          flipped: false,
          bedType: null,
          animationOptions: {
            tankFish: ["128"],
            animals: [{ animalId: "Cow" }],
          },
          heldItem: {
            instanceId: 3,
            itemId: "furniture_0",
            x: 4,
            y: 5,
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
            animationOptions: { hatId: "11" },
          },
        },
      ],
      nextBuildingId: 2,
      nextItemId: 4,
    };

    const restoredSnapshot = restorePlacementSnapshot(
      JSON.parse(JSON.stringify(storedSnapshot)),
    );
    storedSnapshot.buildings[0].animationOptions.fishId = "129";
    storedSnapshot.items[0].animationOptions.tankFish.push("130");
    storedSnapshot.items[0].animationOptions.animals[0].animalId = "Sheep";

    expect(restoredSnapshot.buildings[0]?.animationOptions).toEqual({
      fishId: "128",
      population: 4,
      millLoaded: true,
    });
    expect(restoredSnapshot.items[0]?.animationOptions).toEqual({
      tankFish: ["128"],
      animals: [{ animalId: "Cow" }],
    });
    expect(restoredSnapshot.items[0]?.heldItem?.animationOptions).toEqual({
      hatId: "11",
    });
  });

  it("round-trips Mill output controls through JSON restoration", () => {
    const storedSnapshot = {
      buildings: [
        {
          instanceId: 1,
          buildingId: "Mill",
          x: 2,
          y: 3,
          animationOptions: { millOutput: true, millProduct: "246" },
        },
      ],
      crops: [],
      items: [],
      nextBuildingId: 2,
      nextItemId: 1,
    };

    const restoredSnapshot = restorePlacementSnapshot(
      JSON.parse(JSON.stringify(storedSnapshot)),
    );

    expect(restoredSnapshot.buildings[0]?.animationOptions).toEqual({
      millOutput: true,
      millProduct: "246",
    });
  });

  it("preserves animation options on new building, item, and held-item actions", () => {
    const buildingSnapshot = applyPlacementSnapshotAction(
      createEmptyPlacementSnapshot(),
      {
        type: "add-building",
        building: {
          buildingId: "Fish Pond",
          x: 1,
          y: 2,
          animationOptions: {
            fishId: "128",
            population: 3,
            produce: "812",
          },
        },
      },
    );
    const itemSnapshot = applyPlacementSnapshotAction(buildingSnapshot, {
      type: "add-item",
      item: {
        ...createNewItem(),
        itemId: "furniture_724",
        layer: "item",
        isTable: true,
        animationOptions: { clockOff: true },
      },
    });
    const heldItemSnapshot = applyPlacementSnapshotAction(itemSnapshot, {
      type: "attach-held-item",
      parentInstanceId: 1,
      item: {
        ...createNewItem(),
        itemId: "furniture_0",
        layer: "item",
        animationOptions: { hatId: "11" },
      },
    });

    expect(heldItemSnapshot.buildings[0]?.animationOptions).toEqual({
      fishId: "128",
      population: 3,
      produce: "812",
    });
    expect(heldItemSnapshot.items[0]?.animationOptions).toEqual({
      clockOff: true,
    });
    expect(heldItemSnapshot.items[0]?.heldItem?.animationOptions).toEqual({
      hatId: "11",
    });

    const workingOptions = { animals: [{ animalId: "Cow" }] };
    const workingSnapshot = createWorkingPlacementSnapshot(
      createEmptyPlacementSnapshot(),
    );
    applyWorkingPlacementSnapshotAction(workingSnapshot, {
      type: "add-building",
      building: {
        buildingId: "Barn",
        x: 0,
        y: 0,
        animationOptions: workingOptions,
      },
    });
    workingOptions.animals[0]!.animalId = "Sheep";
    expect(commitWorkingPlacementSnapshot(workingSnapshot).buildings[0]?.animationOptions)
      .toEqual({ animals: [{ animalId: "Cow" }] });
  });

  it("fails fast when a stored placement bedType is outside the typed bed domain", () => {
    const storedSnapshot = createStoredSnapshot();
    Object.assign(storedSnapshot.items[0], { bedType: "queen" });

    expect(() => restorePlacementSnapshot(storedSnapshot)).toThrow(
      'field "items[0].bedType" must be one of "single", "double", or "child", or null; received "queen"',
    );
  });

  it("preserves a FreeCactus composite variant through JSON save and load", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          ...createNewItem(),
          instanceId: 1,
          itemId: "furniture_FreeCactus",
          layer: "item" as const,
          variant: 4375,
        },
      ],
      nextItemId: 2,
    };
    const serializedSnapshot = JSON.stringify(placementSnapshot);
    const restoredSnapshot = restorePlacementSnapshot(
      JSON.parse(serializedSnapshot) as unknown,
    );

    expect(restoredSnapshot.items[0]).toMatchObject({
      itemId: "furniture_FreeCactus",
      variant: 4375,
    });
  });

  it("restores a legacy snapshot without interior decor", () => {
    const legacySnapshot = restorePlacementSnapshot(createStoredSnapshot());

    expect(Object.hasOwn(legacySnapshot, "interiorDecor")).toBe(false);
  });

  it("persists optional building paint colors while retaining legacy building records", () => {
    const restoredSnapshot = restorePlacementSnapshot({
      ...createStoredSnapshot(),
      buildings: [
        {
          instanceId: 3,
          buildingId: "Big Shed",
          x: 8,
          y: 12,
          paintColors: {
            color1: "#aa4433",
            color2: "#224466",
            color3: "#ffffff",
          },
        },
      ],
    });

    expect(restoredSnapshot.buildings[0]).toMatchObject({
      paintColors: {
        color1: "#aa4433",
        color2: "#224466",
        color3: "#ffffff",
      },
    });
    expect(() =>
      restorePlacementSnapshot({
        ...createStoredSnapshot(),
        buildings: [
          {
            instanceId: 3,
            buildingId: "Big Shed",
            x: 8,
            y: 12,
            paintColors: { color1: "red", color2: "#224466", color3: "#ffffff" },
          },
        ],
      }),
    ).toThrow('Building paint color "color1"');
    expect(() =>
      restorePlacementSnapshot({
        ...createStoredSnapshot(),
        buildings: [
          {
            instanceId: 3,
            buildingId: "Barn",
            x: 8,
            y: 12,
            paintColors: {
              color1: "#aa4433",
              color2: "#224466",
              color3: "#ffffff",
            },
          },
        ],
      }),
    ).toThrow('cannot be assigned to building "Barn"');
  });

  it("round-trips optional building variant and water color without normalizing opaque integers", () => {
    const restoredSnapshot = restorePlacementSnapshot({
      ...createStoredSnapshot(),
      buildings: [
        {
          instanceId: 3,
          buildingId: "Fish Pond",
          x: 8,
          y: 12,
          variant: -9,
          waterColor: 16_391_710,
        },
      ],
    });

    expect(restoredSnapshot.buildings[0]).toEqual({
      instanceId: 3,
      buildingId: "Fish Pond",
      x: 8,
      y: 12,
      variant: -9,
      waterColor: 16_391_710,
    });
    expect(
      restorePlacementSnapshot(createStoredSnapshot()).buildings[0],
    ).not.toHaveProperty("variant");
    expect(
      restorePlacementSnapshot(createStoredSnapshot()).buildings[0],
    ).not.toHaveProperty("waterColor");
  });

  it.each([
    ["variant", 1.5, "safe integer"],
    ["variant", Number.MAX_SAFE_INTEGER + 1, "safe integer"],
    ["waterColor", -1, "integer from 0 through 16777215"],
    ["waterColor", 16_777_216, "integer from 0 through 16777215"],
    ["waterColor", 1.5, "integer from 0 through 16777215"],
  ])(
    "fails before persistence allocation for invalid building %s",
    (fieldName, receivedValue, expectedBoundary) => {
      expect(() => restorePlacementSnapshot({
        ...createStoredSnapshot(),
        buildings: [
          {
            instanceId: 3,
            buildingId: "Fish Pond",
            x: 8,
            y: 12,
            [fieldName]: receivedValue,
          },
        ],
      })).toThrow(
        new RegExp(
          `buildings\\[0\\].${fieldName}.*Fish Pond.*${expectedBoundary}.*received`,
          "i",
        ),
      );
    },
  );

  it("preserves valid interior decor through persistent cloning and snapshot replacement", () => {
    const snapshotWithInteriorDecor = {
      ...createStoredSnapshot(),
      interiorDecor: {
        wallpapers: { Bedroom: "111" },
        floors: { Floor: "MoreFloors:8" },
      },
    };
    const restoredSnapshot = restorePlacementSnapshot(snapshotWithInteriorDecor);
    const persistentSnapshot = createPersistentPlacementSnapshot(restoredSnapshot);
    const replacementSnapshot = replacePlacementSnapshotInteriorDecor(
      restoredSnapshot,
      { wallpapers: { Bedroom: "MoreWalls:25" }, floors: { Floor: "87" } },
    );

    expect(persistentSnapshot.interiorDecor).toEqual(
      snapshotWithInteriorDecor.interiorDecor,
    );
    expect(replacementSnapshot.interiorDecor).toEqual({
      wallpapers: { Bedroom: "MoreWalls:25" },
      floors: { Floor: "87" },
    });
    expect(restoredSnapshot.interiorDecor).toEqual(
      snapshotWithInteriorDecor.interiorDecor,
    );
  });

  it("owns nested interior decor across restored and persistent snapshots", () => {
    const sourceInteriorDecor = {
      wallpapers: { Bedroom: "111" },
      floors: { Floor: "MoreFloors:8" },
    };
    const restoredSnapshot = restorePlacementSnapshot({
      ...createStoredSnapshot(),
      interiorDecor: sourceInteriorDecor,
    });
    const persistentSnapshot = createPersistentPlacementSnapshot(restoredSnapshot);
    const restoredInteriorDecor = restoredSnapshot.interiorDecor;
    const persistentInteriorDecor = persistentSnapshot.interiorDecor;

    if (restoredInteriorDecor === undefined || persistentInteriorDecor === undefined) {
      throw new Error("Expected interior decor to be present in both snapshots.");
    }

    sourceInteriorDecor.wallpapers.Bedroom = "0";
    sourceInteriorDecor.floors.Floor = "0";

    expect(restoredInteriorDecor).not.toBe(sourceInteriorDecor);
    expect(restoredInteriorDecor.wallpapers).not.toBe(sourceInteriorDecor.wallpapers);
    expect(restoredInteriorDecor.floors).not.toBe(sourceInteriorDecor.floors);
    expect(persistentInteriorDecor).not.toBe(restoredInteriorDecor);
    expect(persistentInteriorDecor.wallpapers).not.toBe(restoredInteriorDecor.wallpapers);
    expect(persistentInteriorDecor.floors).not.toBe(restoredInteriorDecor.floors);
    expect(restoredInteriorDecor).toEqual({
      wallpapers: { Bedroom: "111" },
      floors: { Floor: "MoreFloors:8" },
    });
    expect(persistentInteriorDecor).toEqual(restoredInteriorDecor);
  });

  it("preserves interior decor when an existing placement action runs", () => {
    const snapshotWithInteriorDecor = restorePlacementSnapshot({
      ...createStoredSnapshot(),
      interiorDecor: {
        wallpapers: { Bedroom: "111" },
        floors: { Floor: "MoreFloors:8" },
      },
    });

    const snapshotAfterCropPlacement = applyPlacementSnapshotAction(
      snapshotWithInteriorDecor,
      {
        type: "add-crop",
        crop: { cropId: "crop:24", x: 6, y: 9 },
      },
    );

    expect(snapshotAfterCropPlacement.interiorDecor).toEqual(
      snapshotWithInteriorDecor.interiorDecor,
    );
  });

  it("preserves canonical lowercase item tint colors", () => {
    const storedSnapshot = createStoredSnapshot();
    storedSnapshot.items[0].tintColor = "#1a2b3c";

    expect(restorePlacementSnapshot(storedSnapshot).items[0]?.tintColor).toBe(
      "#1a2b3c",
    );
    expect(
      createPersistentPlacementSnapshot(storedSnapshot).items[0]?.tintColor,
    ).toBe("#1a2b3c");
  });

  it("treats an omitted night light state as lit for older stored snapshots", () => {
    const restoredSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const restoredItem = restoredSnapshot.items[0];

    expect(restoredItem?.nightLightState).toBeUndefined();
    expect(Object.hasOwn(restoredItem ?? {}, "nightLightState")).toBe(false);
  });

  it("preserves an optional growth stage through restore, clone, and item actions", () => {
    const storedSnapshotWithGrowthStage = createStoredSnapshot();
    Object.assign(storedSnapshotWithGrowthStage.items[0], { growthStage: 3 });
    const restoredSnapshot = restorePlacementSnapshot(
      storedSnapshotWithGrowthStage,
    );
    const persistentSnapshot = createPersistentPlacementSnapshot(
      restoredSnapshot,
    );
    const placementState = createPlacementState(restoredSnapshot);
    const snapshotWithNewGrowthStage = applyPlacementSnapshotAction(
      restoredSnapshot,
      {
        type: "add-item",
        item: { ...createNewItem(), growthStage: 0 },
      },
    );
    const existingPlacementItem = restoredSnapshot.items[0];
    if (existingPlacementItem === undefined) {
      throw new Error("Expected the stored snapshot fixture to contain one item.");
    }
    const replacedSnapshot = applyPlacementSnapshotAction(restoredSnapshot, {
      type: "replace-item",
      item: { ...existingPlacementItem, growthStage: 4 },
    });

    expect(restoredSnapshot.items[0]?.growthStage).toBe(3);
    expect(persistentSnapshot.items[0]?.growthStage).toBe(3);
    expect(placementState.itemIndex.get(7)?.growthStage).toBe(3);
    expect(snapshotWithNewGrowthStage.items[1]?.growthStage).toBe(0);
    expect(replacedSnapshot.items[0]?.growthStage).toBe(4);
    expect(Object.hasOwn(restorePlacementSnapshot(createStoredSnapshot()).items[0] ?? {}, "growthStage")).toBe(false);
  });

  it("rejects invalid growth stages with the exact item field and received value", () => {
    for (const invalidGrowthStage of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      const storedSnapshotWithInvalidGrowthStage = createStoredSnapshot();
      Object.assign(storedSnapshotWithInvalidGrowthStage.items[0], {
        growthStage: invalidGrowthStage,
      });

      expect(() => restorePlacementSnapshot(
        storedSnapshotWithInvalidGrowthStage,
      )).toThrow(
        `field "items[0].growthStage" must be a non-negative safe integer; received ${String(invalidGrowthStage)}`,
      );
      expect(() => applyPlacementSnapshotAction(
        restorePlacementSnapshot(createStoredSnapshot()),
        {
          type: "add-item",
          item: { ...createNewItem(), growthStage: invalidGrowthStage },
        },
      )).toThrow(
        `field "item.growthStage" must be a non-negative safe integer; received ${String(invalidGrowthStage)}`,
      );
    }
  });

  it("preserves an explicit off night light state through snapshot replacement", () => {
    const storedSnapshotWithExtinguishedLight = createStoredSnapshot();
    Object.assign(storedSnapshotWithExtinguishedLight.items[0], {
      nightLightState: "off",
    });
    const restoredSnapshot = restorePlacementSnapshot(
      storedSnapshotWithExtinguishedLight,
    );
    const restoredItem = restoredSnapshot.items[0];

    if (restoredItem === undefined) {
      throw new Error("Expected the stored snapshot fixture to contain one item.");
    }

    const replacedSnapshot = applyPlacementSnapshotAction(restoredSnapshot, {
      type: "replace-item",
      item: { ...restoredItem, tintColor: "#123abc" },
    });

    expect(replacedSnapshot.items[0]).toEqual(
      expect.objectContaining({
        nightLightState: "off",
        tintColor: "#123abc",
      }),
    );
  });

  it("rejects every persisted night light state except the literal off value", () => {
    for (const invalidNightLightState of ["lit", true, null]) {
      const storedSnapshotWithInvalidNightLightState = createStoredSnapshot();
      Object.assign(storedSnapshotWithInvalidNightLightState.items[0], {
        nightLightState: invalidNightLightState,
      });

      expect(() =>
        restorePlacementSnapshot(storedSnapshotWithInvalidNightLightState),
      ).toThrow(
        `field "items[0].nightLightState" must equal "off"; received ${JSON.stringify(invalidNightLightState)}`,
      );
    }
  });

  it("rejects non-canonical item tint colors at every snapshot boundary", () => {
    for (const invalidTintColor of ["#AABBCC", "#abc", "#12abcz", 123]) {
      const storedSnapshot = createStoredSnapshot() as {
        items: Array<{ tintColor: unknown }>;
      };
      storedSnapshot.items[0].tintColor = invalidTintColor;

      const expectedError = `field "items[0].tintColor" must be a canonical lowercase #rrggbb color; received ${JSON.stringify(invalidTintColor)}`;

      expect(() => restorePlacementSnapshot(storedSnapshot)).toThrow(
        expectedError,
      );
      expect(() => createPersistentPlacementSnapshot(storedSnapshot as never)).toThrow(
        expectedError,
      );
    }
  });

  it("keeps the item index in runtime state and excludes it from the persistent clone", () => {
    const placementState = createPlacementState(
      restorePlacementSnapshot(createStoredSnapshot()),
    );
    const persistentSnapshot = createPersistentPlacementSnapshot(placementState);

    expect(placementState.itemIndex.get(7)).toEqual({
      instanceId: 7,
      itemId: "placeable:Chest",
      x: 3,
      y: 5,
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
      heldItemId: "object:388",
    });
    expect(persistentSnapshot).toEqual(createStoredSnapshot());
    expect("itemIndex" in persistentSnapshot).toBe(false);
    expect(persistentSnapshot.items[0]).not.toBe(placementState.items[0]);
  });

  it("rejects malformed restored JSON with the invalid field and value", () => {
    const snapshotWithUnknownItemLayer = createStoredSnapshot() as {
      items: Array<{ layer: string }>;
    };
    snapshotWithUnknownItemLayer.items[0].layer = "wall";

    expect(() =>
      restorePlacementSnapshot(snapshotWithUnknownItemLayer),
    ).toThrow('field "items[0].layer" must be one of "item", "path", "fence"; received "wall"');

    const snapshotWithZeroFootprint = createStoredSnapshot() as {
      items: Array<{ footprint: { width: number } }>;
    };
    snapshotWithZeroFootprint.items[0].footprint.width = 0;

    expect(() => restorePlacementSnapshot(snapshotWithZeroFootprint)).toThrow(
      'field "items[0].footprint.width" must be a positive safe integer; received 0',
    );

    const snapshotWithUnexpectedField = {
      ...createStoredSnapshot(),
      unexpected: true,
    };

    expect(() => restorePlacementSnapshot(snapshotWithUnexpectedField)).toThrow(
      'field "unexpected" must not be present; received true',
    );
  });

  it("rejects zero and negative persisted instance and next identifiers", () => {
    for (const invalidIdentifier of [0, -1]) {
      const snapshotWithInvalidBuildingIdentifier = createStoredSnapshot();
      snapshotWithInvalidBuildingIdentifier.buildings[0].instanceId =
        invalidIdentifier;

      expect(() =>
        restorePlacementSnapshot(snapshotWithInvalidBuildingIdentifier),
      ).toThrow(
        `field "buildings[0].instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      const snapshotWithInvalidItemIdentifier = createStoredSnapshot();
      snapshotWithInvalidItemIdentifier.items[0].instanceId = invalidIdentifier;

      expect(() =>
        restorePlacementSnapshot(snapshotWithInvalidItemIdentifier),
      ).toThrow(
        `field "items[0].instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      const snapshotWithInvalidBuildingCounter = {
        ...createEmptyPlacementSnapshot(),
        nextBuildingId: invalidIdentifier,
      };

      expect(() =>
        restorePlacementSnapshot(snapshotWithInvalidBuildingCounter),
      ).toThrow(
        `field "nextBuildingId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      const snapshotWithInvalidItemCounter = {
        ...createEmptyPlacementSnapshot(),
        nextItemId: invalidIdentifier,
      };

      expect(() =>
        restorePlacementSnapshot(snapshotWithInvalidItemCounter),
      ).toThrow(
        `field "nextItemId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );
    }
  });

  it("rejects non-positive identifiers in building and item delete and replace actions", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());

    for (const invalidIdentifier of [0, -1]) {
      expect(() =>
        applyPlacementSnapshotAction(sourceSnapshot, {
          type: "delete-building",
          instanceId: invalidIdentifier,
        }),
      ).toThrow(
        `field "instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      expect(() =>
        applyPlacementSnapshotAction(sourceSnapshot, {
          type: "replace-building",
          building: {
            instanceId: invalidIdentifier,
            buildingId: "building:Coop",
            x: -1,
            y: 4,
          },
        }),
      ).toThrow(
        `field "building.instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      expect(() =>
        applyPlacementSnapshotAction(sourceSnapshot, {
          type: "delete-item",
          instanceId: invalidIdentifier,
        }),
      ).toThrow(
        `field "instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );

      expect(() =>
        applyPlacementSnapshotAction(sourceSnapshot, {
          type: "replace-item",
          item: { instanceId: invalidIdentifier, ...createNewItem() },
        }),
      ).toThrow(
        `field "item.instanceId" must be a positive safe integer; received ${String(invalidIdentifier)}`,
      );
    }
  });

  it("rejects duplicate persisted identifiers, crop coordinates, and stale next identifiers", () => {
    const snapshotWithDuplicateBuildingIdentifier = createStoredSnapshot();
    snapshotWithDuplicateBuildingIdentifier.buildings.push({
      instanceId: 3,
      buildingId: "building:Coop",
      x: -1,
      y: 4,
    });

    expect(() =>
      restorePlacementSnapshot(snapshotWithDuplicateBuildingIdentifier),
    ).toThrow('field "buildings[1].instanceId" must be unique; received 3');

    const snapshotWithDuplicateItemIdentifier = createStoredSnapshot();
    snapshotWithDuplicateItemIdentifier.items.push({
      ...snapshotWithDuplicateItemIdentifier.items[0],
    });

    expect(() =>
      restorePlacementSnapshot(snapshotWithDuplicateItemIdentifier),
    ).toThrow('field "items[1].instanceId" must be unique; received 7');

    const snapshotWithDuplicateCropCoordinate = createStoredSnapshot();
    snapshotWithDuplicateCropCoordinate.crops.push({
      cropId: "crop:26",
      x: 2,
      y: 4,
    });

    expect(() =>
      restorePlacementSnapshot(snapshotWithDuplicateCropCoordinate),
    ).toThrow('field "crops[1]" must have a unique coordinate; received {"x":2,"y":4}');

    const snapshotWithStaleBuildingCounter = createStoredSnapshot();
    snapshotWithStaleBuildingCounter.nextBuildingId = 3;

    expect(() =>
      restorePlacementSnapshot(snapshotWithStaleBuildingCounter),
    ).toThrow(
      'field "nextBuildingId" must be greater than every buildings instanceId; received 3 with highest instanceId 3',
    );

    const snapshotWithStaleItemCounter = createStoredSnapshot();
    snapshotWithStaleItemCounter.nextItemId = 7;

    expect(() =>
      restorePlacementSnapshot(snapshotWithStaleItemCounter),
    ).toThrow(
      'field "nextItemId" must be greater than every items instanceId; received 7 with highest instanceId 7',
    );
  });

  it("rejects unknown nested fields during JSON restore", () => {
    const snapshotWithUnknownNestedField = createStoredSnapshot();
    Object.assign(snapshotWithUnknownNestedField.items[0].footprint, {
      unexpected: true,
    });

    expect(() =>
      restorePlacementSnapshot(snapshotWithUnknownNestedField),
    ).toThrow(
      'field "items[0].footprint.unexpected" must not be present; received true',
    );
  });

  it("adds a building with the snapshot counter without mutating the source snapshot", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const updatedSnapshot = applyPlacementSnapshotAction(sourceSnapshot, {
      type: "add-building",
      building: { buildingId: "building:Coop", x: -2, y: 14 },
    });

    expect(updatedSnapshot.buildings).toEqual([
      { instanceId: 3, buildingId: "building:Barn", x: 8, y: 12 },
      { instanceId: 4, buildingId: "building:Coop", x: -2, y: 14 },
    ]);
    expect(updatedSnapshot.nextBuildingId).toBe(5);
    expect(sourceSnapshot.buildings).toHaveLength(1);
    expect(sourceSnapshot.nextBuildingId).toBe(4);
  });

  it("deletes the requested building instance", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      { type: "delete-building", instanceId: 3 },
    );

    expect(updatedSnapshot.buildings).toEqual([]);
    expect(updatedSnapshot.nextBuildingId).toBe(4);
  });

  it("replaces the requested building instance without changing its counter", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      {
        type: "replace-building",
        building: { instanceId: 3, buildingId: "building:Shed", x: 9, y: 11 },
      },
    );

    expect(updatedSnapshot.buildings).toEqual([
      { instanceId: 3, buildingId: "building:Shed", x: 9, y: 11 },
    ]);
    expect(updatedSnapshot.nextBuildingId).toBe(4);
  });

  it("adds a crop at an unoccupied crop coordinate", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      { type: "add-crop", crop: { cropId: "crop:26", x: 3, y: 4 } },
    );

    expect(updatedSnapshot.crops).toEqual([
      { cropId: "crop:24", x: 2, y: 4 },
      { cropId: "crop:26", x: 3, y: 4 },
    ]);
  });

  it("deletes the crop at the requested coordinate", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      { type: "delete-crop", coordinate: { x: 2, y: 4 } },
    );

    expect(updatedSnapshot.crops).toEqual([]);
  });

  it("replaces a crop at its previous coordinate", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      {
        type: "replace-crop",
        coordinate: { x: 2, y: 4 },
        crop: { cropId: "crop:188", x: -1, y: 7 },
      },
    );

    expect(updatedSnapshot.crops).toEqual([
      { cropId: "crop:188", x: -1, y: 7 },
    ]);
  });

  it("adds an item with the snapshot counter and preserves all item properties", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const updatedSnapshot = applyPlacementSnapshotAction(sourceSnapshot, {
      type: "add-item",
      item: createNewItem(),
    });

    expect(updatedSnapshot.items).toEqual([
      expect.objectContaining({ instanceId: 7, itemId: "placeable:Chest" }),
      expect.objectContaining({ instanceId: 8, ...createNewItem() }),
    ]);
    expect(updatedSnapshot.nextItemId).toBe(9);
    expect(sourceSnapshot.items).toHaveLength(1);
  });

  it("deletes the requested item instance", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      { type: "delete-item", instanceId: 7 },
    );

    expect(updatedSnapshot.items).toEqual([]);
    expect(updatedSnapshot.nextItemId).toBe(8);
  });

  it("replaces the requested item instance without changing its counter", () => {
    const updatedSnapshot = applyPlacementSnapshotAction(
      restorePlacementSnapshot(createStoredSnapshot()),
      {
        type: "replace-item",
        item: { instanceId: 7, ...createNewItem() },
      },
    );

    expect(updatedSnapshot.items).toEqual([
      { instanceId: 7, ...createNewItem() },
    ]);
    expect(updatedSnapshot.nextItemId).toBe(8);
  });

  it("keeps later actions on the same working snapshot until one persistent commit", () => {
    const sourceSnapshot = createEmptyPlacementSnapshot();
    const workingSnapshot = createWorkingPlacementSnapshot(sourceSnapshot);
    const workingItems = workingSnapshot.items;
    const firstAction: PlacementSnapshotAction = {
      type: "add-item",
      item: createNewItem(),
    };
    const secondAction: PlacementSnapshotAction = {
      type: "add-item",
      item: { ...createNewItem(), x: 4, y: 6 },
    };

    expect(applyWorkingPlacementSnapshotAction(workingSnapshot, firstAction)).toBe(
      workingSnapshot,
    );
    expect(createPersistentPlacementSnapshot(workingSnapshot)).toBe(workingSnapshot);
    expect(workingSnapshot.items).toBe(workingItems);
    expect(workingSnapshot.items.map((item) => item.instanceId)).toEqual([1]);
    expect(workingSnapshot.nextItemId).toBe(2);

    applyWorkingPlacementSnapshotAction(workingSnapshot, secondAction);

    const committedSnapshot = commitWorkingPlacementSnapshot(workingSnapshot);
    const committedItem = committedSnapshot.items[0];
    const workingItem = workingSnapshot.items[0];

    expect(workingSnapshot.items.map((item) => item.instanceId)).toEqual([1, 2]);
    expect(workingSnapshot.nextItemId).toBe(3);
    expect(committedSnapshot).not.toBe(workingSnapshot);
    expect(committedSnapshot.items).not.toBe(workingSnapshot.items);
    expect(committedSnapshot).toEqual({
      buildings: [],
      crops: [],
      items: [
        { instanceId: 1, ...createNewItem() },
        { instanceId: 2, ...createNewItem(), x: 4, y: 6 },
      ],
      nextBuildingId: 1,
      nextItemId: 3,
    });
    expect(committedItem).not.toBe(workingItem);
    if (workingItem === undefined || committedItem === undefined) {
      throw new Error("Working snapshot commit did not retain both item copies.");
    }
    (workingItem as { x: number }).x = 50;
    (workingSnapshot.items as PlacementItem[]).push({ ...workingItem, instanceId: 9, x: 8 });
    expect(committedItem.x).toBe(-3);
    expect(committedSnapshot.items).toHaveLength(2);
    expect(sourceSnapshot.items).toEqual([]);
    expect(sourceSnapshot.nextItemId).toBe(1);
    expect(() => commitWorkingPlacementSnapshot(workingSnapshot)).toThrow(
      /must be created by createWorkingPlacementSnapshot/,
    );
  });

  it("keeps two working snapshots independent from the source snapshot and from each other", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const sourceItem = sourceSnapshot.items[0];
    const firstWorkingSnapshot = createWorkingPlacementSnapshot(sourceSnapshot);
    const secondWorkingSnapshot = createWorkingPlacementSnapshot(sourceSnapshot);
    const firstItem = firstWorkingSnapshot.items[0];
    const secondItem = secondWorkingSnapshot.items[0];

    if (sourceItem === undefined || firstItem === undefined || secondItem === undefined) {
      throw new Error("Stored snapshot did not contain the expected item.");
    }

    expect(firstWorkingSnapshot).not.toBe(sourceSnapshot);
    expect(secondWorkingSnapshot).not.toBe(sourceSnapshot);
    expect(firstWorkingSnapshot).not.toBe(secondWorkingSnapshot);
    expect(firstWorkingSnapshot.items).not.toBe(sourceSnapshot.items);
    expect(secondWorkingSnapshot.items).not.toBe(sourceSnapshot.items);
    expect(firstWorkingSnapshot.items).not.toBe(secondWorkingSnapshot.items);
    expect(firstItem).not.toBe(sourceItem);
    expect(secondItem).not.toBe(sourceItem);
    expect(firstItem).not.toBe(secondItem);

    (firstItem as { x: number }).x = 99;
    applyWorkingPlacementSnapshotAction(firstWorkingSnapshot, {
      type: "add-item",
      item: createNewItem(),
    });

    expect(sourceItem.x).toBe(3);
    expect(secondItem.x).toBe(3);
    expect(sourceSnapshot.items).toHaveLength(1);
    expect(sourceSnapshot.nextItemId).toBe(8);
    expect(secondWorkingSnapshot.items).toHaveLength(1);
    expect(secondWorkingSnapshot.nextItemId).toBe(8);
    expect(firstWorkingSnapshot.items).toHaveLength(2);
    expect(firstWorkingSnapshot.nextItemId).toBe(9);
  });

  it("still copies a normal snapshot and rejects an illegal working snapshot without blocking the next one", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const firstPersistentSnapshot = createPersistentPlacementSnapshot(sourceSnapshot);
    const secondPersistentSnapshot = createPersistentPlacementSnapshot(firstPersistentSnapshot);
    const firstPersistentItem = firstPersistentSnapshot.items[0];
    const secondPersistentItem = secondPersistentSnapshot.items[0];

    expect(secondPersistentSnapshot).not.toBe(firstPersistentSnapshot);
    expect(secondPersistentSnapshot.items).not.toBe(firstPersistentSnapshot.items);
    expect(secondPersistentItem).not.toBe(firstPersistentItem);
    expect(secondPersistentSnapshot).toEqual(firstPersistentSnapshot);

    const illegalSnapshot = {
      ...createEmptyPlacementSnapshot(),
      nextItemId: 0,
    };
    expect(() => createPersistentPlacementSnapshot(illegalSnapshot)).toThrow(
      /nextItemId/,
    );

    const corruptWorkingSnapshot = createWorkingPlacementSnapshot(
      createEmptyPlacementSnapshot(),
    );
    applyWorkingPlacementSnapshotAction(corruptWorkingSnapshot, {
      type: "add-item",
      item: createNewItem(),
    });
    (corruptWorkingSnapshot as { nextItemId: number }).nextItemId = 1;

    expect(() => commitWorkingPlacementSnapshot(corruptWorkingSnapshot)).toThrow(
      /field "nextItemId" must be greater than every items instanceId; received 1 with highest instanceId 1/,
    );
    expect(() => createPersistentPlacementSnapshot(corruptWorkingSnapshot)).toThrow(
      /field "nextItemId" must be greater than every items instanceId; received 1 with highest instanceId 1/,
    );

    const laterWorkingSnapshot = createWorkingPlacementSnapshot(
      createEmptyPlacementSnapshot(),
    );
    applyWorkingPlacementSnapshotAction(laterWorkingSnapshot, {
      type: "add-item",
      item: createNewItem(),
    });

    expect(commitWorkingPlacementSnapshot(laterWorkingSnapshot)).toEqual({
      buildings: [],
      crops: [],
      items: [{ instanceId: 1, ...createNewItem() }],
      nextBuildingId: 1,
      nextItemId: 2,
    });
  });

  it("matches one persistent action sequence for buildings, crops, items, and held items", () => {
    const sourceSnapshot = restorePlacementSnapshot(createStoredSnapshot());
    const actions: readonly PlacementSnapshotAction[] = [
      {
        type: "add-building",
        building: { buildingId: "building:Coop", x: 1, y: 2 },
      },
      {
        type: "add-crop",
        crop: { cropId: "crop:26", x: 3, y: 4 },
      },
      { type: "add-item", item: createTableItem() },
      {
        type: "attach-held-item",
        parentInstanceId: 8,
        item: createHeldItem(),
      },
    ];
    const sequentialSnapshot = actions.reduce(
      (placementSnapshot, placementAction) =>
        applyPlacementSnapshotAction(placementSnapshot, placementAction),
      sourceSnapshot,
    );
    const workingSnapshot = createWorkingPlacementSnapshot(sourceSnapshot);

    for (const placementAction of actions) {
      applyWorkingPlacementSnapshotAction(workingSnapshot, placementAction);
    }

    expect(commitWorkingPlacementSnapshot(workingSnapshot)).toEqual(sequentialSnapshot);
    expect(sourceSnapshot.items).toHaveLength(1);
    expect(sourceSnapshot.nextItemId).toBe(8);
    expect(sourceSnapshot.nextBuildingId).toBe(4);
  });

  it("rejects a non-working snapshot and an action the working snapshot cannot apply", () => {
    const sourceSnapshot = createEmptyPlacementSnapshot();
    const workingSnapshot = createWorkingPlacementSnapshot(sourceSnapshot);
    const deleteAction: PlacementSnapshotAction = {
      type: "delete-item",
      instanceId: 1,
    };

    expect(() => applyWorkingPlacementSnapshotAction(sourceSnapshot, {
      type: "add-item",
      item: createNewItem(),
    })).toThrow(/must be created by createWorkingPlacementSnapshot/);
    expect(() => applyWorkingPlacementSnapshotAction(workingSnapshot, deleteAction)).toThrow(
      /cannot apply action type "delete-item"/,
    );
    expect(() => createWorkingPlacementSnapshot(workingSnapshot)).toThrow(
      /cannot be created from an existing working snapshot/,
    );
    expect(workingSnapshot.items).toEqual([]);
    expect(sourceSnapshot.items).toEqual([]);

    applyWorkingPlacementSnapshotAction(workingSnapshot, {
      type: "add-crop",
      crop: { cropId: "crop:24", x: 2, y: 4 },
    });
    expect(() => applyWorkingPlacementSnapshotAction(workingSnapshot, {
      type: "add-crop",
      crop: { cropId: "crop:26", x: 2, y: 4 },
    })).toThrow(/must not contain more than one crop at coordinate/);
    expect(workingSnapshot.crops).toEqual([
      { cropId: "crop:24", x: 2, y: 4 },
    ]);
  });
});

function createTableItem() {
  return {
    ...createNewItem(),
    itemId: "furniture_table",
    x: 0,
    y: 0,
    layer: "item" as const,
    rotation: 0,
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isTable: true,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function createHeldItem() {
  return {
    ...createNewItem(),
    itemId: "object:93",
    x: 0,
    y: 0,
    layer: "item" as const,
    rotation: 1,
    variant: 2,
    tintColor: "#112233",
    locked: false,
    isTable: false,
    flipped: true,
    bedType: null,
  };
}
