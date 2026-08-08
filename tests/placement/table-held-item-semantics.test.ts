import { describe, expect, it } from "vitest";
import {
  assertPlacementHeldItemAttachment,
  deletePlacementItemOrHeldItem,
  findPlacementItemOrHeldItem,
  replacePlacementItemOrHeldItem,
} from "../../src/placement/table-held-item-semantics";
import {
  applyPlacementSnapshotAction,
  createEmptyPlacementSnapshot,
  createPersistentPlacementSnapshot,
  createPlacementState,
  restorePlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";

function createTableWithHeldItem(): PlacementItem {
  return {
    instanceId: 1,
    itemId: "furniture_724",
    x: 3,
    y: 4,
    layer: "item",
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
    heldItem: {
      instanceId: 2,
      itemId: "furniture_0",
      x: 3,
      y: 4,
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
  };
}

function createSnapshotWithHeldItem() {
  return {
    ...createEmptyPlacementSnapshot(),
    items: [createTableWithHeldItem()],
    nextItemId: 3,
  };
}

function createEmptyOrdinaryTable(): PlacementItem {
  const tableWithHeldItem = createTableWithHeldItem();
  const emptyTable = { ...tableWithHeldItem } as PlacementItem & {
    heldItem?: PlacementItem["heldItem"];
  };
  delete emptyTable.heldItem;
  return emptyTable;
}

describe("table held-item semantics", () => {
  it("attaches a child with the next item ID while preserving clicked coordinates", () => {
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyOrdinaryTable()],
      nextItemId: 7,
    };
    const nextSnapshot = applyPlacementSnapshotAction(sourceSnapshot, {
      type: "attach-held-item",
      parentInstanceId: 1,
      item: {
        bedType: null,
        flipped: false,
        footprint: { width: 1, height: 1 },
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: false,
        itemId: "furniture_0",
        layer: "item",
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 4,
        y: 5,
      },
    });

    expect(nextSnapshot.items[0]?.heldItem).toMatchObject({
      instanceId: 7,
      itemId: "furniture_0",
      x: 4,
      y: 5,
    });
    expect(nextSnapshot.nextItemId).toBe(8);
    expect(sourceSnapshot.nextItemId).toBe(7);
  });

  it.each([
    ["missing parent", [], /parent.*instanceId 1.*received/i],
    [
      "non-table parent",
      [{ ...createEmptyOrdinaryTable(), isTable: false }],
      /parent.*instanceId 1.*ordinary table.*isTable false/i,
    ],
    [
      "long table parent",
      [{ ...createEmptyOrdinaryTable(), isTable: false, isLongTable: true }],
      /parent.*instanceId 1.*ordinary table.*isLongTable true/i,
    ],
    ["occupied parent", [createTableWithHeldItem()], /parent.*instanceId 1.*empty.*heldItem/i],
    [
      "legacy occupied parent",
      [{ ...createEmptyOrdinaryTable(), heldItemId: "furniture_0" }],
      /parent.*instanceId 1.*empty.*heldItemId.*furniture_0/i,
    ],
  ])("rejects %s before consuming the next item ID", (_caseName, items, errorPattern) => {
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items,
      nextItemId: items.some((item) => item.heldItem !== undefined) ? 3 : 7,
    };

    expect(() => applyPlacementSnapshotAction(sourceSnapshot, {
      type: "attach-held-item",
      parentInstanceId: 1,
      item: {
        bedType: null,
        flipped: false,
        footprint: { width: 1, height: 1 },
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: false,
        itemId: "furniture_0",
        layer: "item",
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 4,
        y: 5,
      },
    })).toThrow(errorPattern);
    expect(sourceSnapshot.nextItemId).toBe(
      items.some((item) => item.heldItem !== undefined) ? 3 : 7,
    );
  });

  it.each([
    ["wrong layer", { layer: "path" }, /child.*layer.*item.*path/i],
    ["wrong footprint", { footprint: { width: 2, height: 1 } }, /child.*footprint.*1x1/i],
    ["nested held item", { heldItem: createTableWithHeldItem().heldItem }, /child.*heldItem.*must not/i],
    ["legacy held item ID", { heldItemId: "furniture_1" }, /child.*heldItemId.*must not/i],
  ])("rejects an attachment child with %s before ID allocation", (_caseName, mutation, errorPattern) => {
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyOrdinaryTable()],
      nextItemId: 7,
    };
    const item = {
      bedType: null,
      flipped: false,
      footprint: { width: 1, height: 1 },
      isGrass: false,
      isLongTable: false,
      isRug: false,
      isTable: false,
      itemId: "furniture_0",
      layer: "item",
      locked: false,
      rotation: 0,
      tintColor: "#ffffff",
      variant: 0,
      x: 4,
      y: 5,
      ...mutation,
    };

    expect(() => applyPlacementSnapshotAction(sourceSnapshot, {
      type: "attach-held-item",
      parentInstanceId: 1,
      item,
    } as Parameters<typeof applyPlacementSnapshotAction>[1])).toThrow(errorPattern);
    expect(sourceSnapshot.nextItemId).toBe(7);
  });

  it("restores and deep-clones a non-recursive held item without indexing it", () => {
    const rawSnapshot = createSnapshotWithHeldItem();
    const restoredSnapshot = restorePlacementSnapshot(rawSnapshot);
    (rawSnapshot.items[0].heldItem!.footprint as { width: number }).width = 9;
    const placementState = createPlacementState(restoredSnapshot);

    expect(restoredSnapshot.items[0].heldItem).toMatchObject({
      instanceId: 2,
      x: 3,
      y: 4,
      footprint: { width: 1, height: 1 },
    });
    expect(restoredSnapshot.items[0].heldItem).not.toBe(rawSnapshot.items[0].heldItem);
    expect(placementState.itemIndex.has(1)).toBe(true);
    expect(placementState.itemIndex.has(2)).toBe(false);
  });

  it.each([
    ["legacy conflict", { heldItemId: "furniture_0" }, /items\[0\].*heldItem.*heldItemId.*received/i],
    ["nested child", { heldItem: { heldItem: {} } }, /heldItem\.heldItem.*must not be present.*received/i],
    ["wrong layer", { heldItem: { layer: "path" } }, /heldItem\.layer.*"item".*received "path"/i],
    ["wrong footprint", { heldItem: { footprint: { width: 2, height: 1 } } }, /heldItem\.footprint.*1x1.*received/i],
  ])("fails fast for %s", (_caseName, mutation, errorPattern) => {
    const invalidSnapshot = createSnapshotWithHeldItem() as unknown as {
      items: Array<Record<string, unknown>>;
    };
    const heldItem = invalidSnapshot.items[0].heldItem as Record<string, unknown>;
    Object.assign(heldItem, (mutation as { heldItem?: Record<string, unknown> }).heldItem ?? {});
    if ("heldItemId" in mutation) invalidSnapshot.items[0].heldItemId = mutation.heldItemId;

    expect(() => restorePlacementSnapshot(invalidSnapshot)).toThrow(errorPattern);
  });

  it("rejects parent-child ID collisions and next IDs that do not exceed held children", () => {
    const duplicateIdentifierSnapshot = createSnapshotWithHeldItem();
    (duplicateIdentifierSnapshot.items[0].heldItem as { instanceId: number }).instanceId = 1;
    expect(() => restorePlacementSnapshot(duplicateIdentifierSnapshot)).toThrow(
      /items\[0\].heldItem\.instanceId.*unique.*received 1/i,
    );

    const staleNextIdentifierSnapshot = createSnapshotWithHeldItem();
    staleNextIdentifierSnapshot.nextItemId = 2;
    expect(() => restorePlacementSnapshot(staleNextIdentifierSnapshot)).toThrow(
      /nextItemId.*greater.*received 2.*highest.*2.*held/i,
    );
  });

  it("keeps a loaded long-table relation structurally valid without making it a new attach target", () => {
    const longTableSnapshot = createSnapshotWithHeldItem();
    Object.assign(longTableSnapshot.items[0] as {
      isLongTable: boolean;
      isTable: boolean;
    }, { isLongTable: true, isTable: false });

    expect(restorePlacementSnapshot(longTableSnapshot).items[0].heldItem).toMatchObject({
      instanceId: 2,
    });
    expect(() => assertPlacementHeldItemAttachment(
      { instanceId: 1, isLongTable: true, isTable: false },
      longTableSnapshot.items[0].heldItem!,
      "items[0]",
    )).toThrow(/instanceId 1.*non-long table.*isLongTable true/i);
    expect(() => assertPlacementHeldItemAttachment(
      { instanceId: 1, isLongTable: false, isTable: true },
      longTableSnapshot.items[0].heldItem!,
      "items[0]",
    )).not.toThrow();
  });

  it("finds, replaces, and deletes a child without deleting its parent", () => {
    const sourceSnapshot = createPersistentPlacementSnapshot(createSnapshotWithHeldItem());
    expect(findPlacementItemOrHeldItem(sourceSnapshot, 2)).toMatchObject({
      kind: "held-item",
      parentInstanceId: 1,
      item: { instanceId: 2 },
    });

    const replacedSnapshot = replacePlacementItemOrHeldItem(sourceSnapshot, {
      ...sourceSnapshot.items[0].heldItem!,
      variant: 3,
    });
    expect(replacedSnapshot.items[0].heldItem?.variant).toBe(3);

    const deletedChildSnapshot = deletePlacementItemOrHeldItem(replacedSnapshot, 2);
    expect(deletedChildSnapshot.items).toHaveLength(1);
    expect(deletedChildSnapshot.items[0].heldItem).toBeUndefined();
  });

  it("deletes a parent with its nested child as one cascade", () => {
    const deletedParentSnapshot = deletePlacementItemOrHeldItem(
      createPersistentPlacementSnapshot(createSnapshotWithHeldItem()),
      1,
    );

    expect(deletedParentSnapshot.items).toEqual([]);
    expect(findPlacementItemOrHeldItem(deletedParentSnapshot, 2)).toBeNull();
  });

  it("rejects an invalid add action before consuming the next item identifier", () => {
    const sourceSnapshot = createPersistentPlacementSnapshot(createSnapshotWithHeldItem());
    const invalidNewTable = {
      ...sourceSnapshot.items[0],
      instanceId: undefined,
      isTable: false,
      isLongTable: false,
    };
    delete (invalidNewTable as { instanceId?: number }).instanceId;

    expect(() => applyPlacementSnapshotAction(sourceSnapshot, {
      type: "add-item",
      item: invalidNewTable,
    })).toThrow(/heldItem.*parent table metadata.*received/i);
    expect(sourceSnapshot.nextItemId).toBe(3);
  });

  it("rejects generic add-held-item actions and invalid replace results before return", () => {
    const sourceSnapshot = createPersistentPlacementSnapshot(createSnapshotWithHeldItem());
    const newTableWithHeldItem = {
      ...sourceSnapshot.items[0],
      instanceId: undefined,
    };
    delete (newTableWithHeldItem as { instanceId?: number }).instanceId;

    expect(() => applyPlacementSnapshotAction(sourceSnapshot, {
      type: "add-item",
      item: newTableWithHeldItem,
    })).toThrow(/add-item.*not-yet-allocated.*heldItem.*instanceId 2.*received/i);
    expect(() => applyPlacementSnapshotAction(sourceSnapshot, {
      type: "replace-item",
      item: {
        ...sourceSnapshot.items[0],
        heldItem: { ...sourceSnapshot.items[0].heldItem!, instanceId: 3 },
      },
    })).toThrow(/nextItemId.*received 3.*highest.*3.*held/i);
    expect(sourceSnapshot.nextItemId).toBe(3);
  });
});
