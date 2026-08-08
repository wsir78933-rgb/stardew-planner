import {
  createPersistentPlacementSnapshot,
  type PlacementHeldItem,
  type PlacementItem,
  type PlacementSnapshot,
} from "./placement-snapshot";
export type { PlacementHeldItem } from "./placement-snapshot";

export type PlacementItemOrHeldItem =
  | Readonly<{ kind: "item"; item: PlacementItem }>
  | Readonly<{
      kind: "held-item";
      item: PlacementHeldItem;
      parentInstanceId: number;
    }>;

export function assertPlacementHeldItemAttachment(
  placementItem: Pick<PlacementItem, "isLongTable" | "isTable"> &
    Readonly<{ instanceId?: number }>,
  heldItem: PlacementHeldItem,
  parentFieldPath: string,
): void {
  if (!placementItem.isTable || placementItem.isLongTable) {
    throw new TypeError(
      `Placement snapshot field "${parentFieldPath}.heldItem" requires parent item instanceId ${placementItem.instanceId === undefined ? "not-yet-allocated" : String(placementItem.instanceId)} to be a non-long table; received isTable ${String(placementItem.isTable)} and isLongTable ${String(placementItem.isLongTable)}.`,
    );
  }
  if (heldItem.layer !== "item") {
    throw new TypeError(
      `Placement snapshot held item instanceId ${String(heldItem.instanceId)} must use layer "item"; received ${JSON.stringify(heldItem.layer)}.`,
    );
  }
  if (heldItem.footprint.width !== 1 || heldItem.footprint.height !== 1) {
    throw new TypeError(
      `Placement snapshot held item instanceId ${String(heldItem.instanceId)} must use footprint 1x1; received ${JSON.stringify(heldItem.footprint)}.`,
    );
  }
}

export function findPlacementItemOrHeldItem(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementItemOrHeldItem | null {
  const persistentSnapshot = createPersistentPlacementSnapshot(placementSnapshot);
  for (const placementItem of persistentSnapshot.items) {
    if (placementItem.instanceId === instanceId) {
      return { kind: "item", item: placementItem };
    }
    if (placementItem.heldItem?.instanceId === instanceId) {
      return {
        kind: "held-item",
        item: placementItem.heldItem,
        parentInstanceId: placementItem.instanceId,
      };
    }
  }
  return null;
}

export function replacePlacementItemOrHeldItem(
  placementSnapshot: PlacementSnapshot,
  replacementItem: PlacementItem | PlacementHeldItem,
): PlacementSnapshot {
  const persistentSnapshot = createPersistentPlacementSnapshot(placementSnapshot);
  const target = findPlacementItemOrHeldItem(
    persistentSnapshot,
    replacementItem.instanceId,
  );
  if (target === null) {
    throw new Error(
      `Placement snapshot cannot replace item or held item instanceId ${String(replacementItem.instanceId)}; received ${JSON.stringify(persistentSnapshot.items.map((item) => ({ instanceId: item.instanceId, heldItemInstanceId: item.heldItem?.instanceId })))}.`,
    );
  }
  if (target.kind === "item") {
    return createPersistentPlacementSnapshot({
      ...persistentSnapshot,
      items: persistentSnapshot.items.map((item) =>
        item.instanceId === replacementItem.instanceId
          ? replacementItem as PlacementItem
          : item,
      ),
    });
  }

  return createPersistentPlacementSnapshot({
    ...persistentSnapshot,
    items: persistentSnapshot.items.map((item) =>
      item.instanceId === target.parentInstanceId
        ? { ...item, heldItem: replacementItem as PlacementHeldItem }
        : item,
    ),
  });
}

export function deletePlacementItemOrHeldItem(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementSnapshot {
  const persistentSnapshot = createPersistentPlacementSnapshot(placementSnapshot);
  const target = findPlacementItemOrHeldItem(persistentSnapshot, instanceId);
  if (target === null) {
    throw new Error(
      `Placement snapshot cannot delete item or held item instanceId ${String(instanceId)}; received ${JSON.stringify(persistentSnapshot.items.map((item) => ({ instanceId: item.instanceId, heldItemInstanceId: item.heldItem?.instanceId })))}.`,
    );
  }
  if (target.kind === "item") {
    return createPersistentPlacementSnapshot({
      ...persistentSnapshot,
      items: persistentSnapshot.items.filter((item) => item.instanceId !== instanceId),
    });
  }

  return createPersistentPlacementSnapshot({
    ...persistentSnapshot,
    items: persistentSnapshot.items.map((item) => {
      if (item.instanceId !== target.parentInstanceId) return item;
      const nextItem = { ...item } as PlacementItem & { heldItem?: PlacementHeldItem };
      delete nextItem.heldItem;
      return nextItem;
    }),
  });
}
