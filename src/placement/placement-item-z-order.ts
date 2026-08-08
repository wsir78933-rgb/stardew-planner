import type { PlacementItem } from "./placement-snapshot";

type PlacementItemZOrderInput = Pick<
  PlacementItem,
  "footprint" | "isRug" | "layer" | "y"
>;

export function getPlacementItemZIndex(
  placementItem: PlacementItemZOrderInput,
): number {
  assertPlacementItemZOrderInput(placementItem);

  if (placementItem.layer === "path") {
    return 0.1;
  }

  if (placementItem.isRug) {
    return 0.2;
  }

  return (placementItem.y + placementItem.footprint.height) * 2 - 1;
}

function assertPlacementItemZOrderInput(
  placementItem: PlacementItemZOrderInput,
): void {
  if (typeof placementItem !== "object" || placementItem === null) {
    throw new TypeError(
      `Placement item z-order input must be a non-null object; received ${describeValue(placementItem)}.`,
    );
  }

  if (
    placementItem.layer !== "item"
    && placementItem.layer !== "path"
    && placementItem.layer !== "fence"
  ) {
    throw new TypeError(
      `Placement item z-order layer must be one of "item", "path", or "fence"; received ${describeValue(placementItem.layer)}.`,
    );
  }

  if (typeof placementItem.isRug !== "boolean") {
    throw new TypeError(
      `Placement item z-order isRug must be a boolean; received ${describeValue(placementItem.isRug)}.`,
    );
  }

  if (placementItem.isRug && placementItem.layer !== "item") {
    throw new TypeError(
      `Placement item z-order rug must use layer "item"; received ${describeValue(placementItem.layer)}.`,
    );
  }

  if (!Number.isSafeInteger(placementItem.y)) {
    throw new TypeError(
      `Placement item z-order y must be a safe integer; received ${describeValue(placementItem.y)}.`,
    );
  }

  const footprint = placementItem.footprint;
  if (typeof footprint !== "object" || footprint === null) {
    throw new TypeError(
      `Placement item z-order footprint must be a non-null object; received ${describeValue(footprint)}.`,
    );
  }

  assertPositiveSafeInteger(footprint.width, "footprint.width");
  assertPositiveSafeInteger(footprint.height, "footprint.height");
}

function assertPositiveSafeInteger(value: unknown, fieldName: string): void {
  if (!Number.isSafeInteger(value) || Number(value) <= 0) {
    throw new TypeError(
      `Placement item z-order ${fieldName} must be a positive safe integer; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
