export const LIBRARY_POPOVER_GAP_PX = 4;

export type PopoverBounds = Readonly<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}>;

export type LibraryPopoverPlacement = Readonly<{
  top: number;
  left: number;
  maxHeight: number;
  maxWidth: number;
  placedAbove: boolean;
}>;

export type LibraryPopoverPlacementInput = Readonly<{
  boundaryBounds: PopoverBounds;
  gapPx: number;
  popoverHeight: number;
  popoverWidth: number;
  triggerBounds: PopoverBounds;
}>;

export function intersectPopoverBounds(
  firstBounds: PopoverBounds,
  secondBounds: PopoverBounds,
): PopoverBounds {
  assertPopoverBounds(firstBounds, "first bounds");
  assertPopoverBounds(secondBounds, "second bounds");

  return {
    top: Math.max(firstBounds.top, secondBounds.top),
    right: Math.min(firstBounds.right, secondBounds.right),
    bottom: Math.min(firstBounds.bottom, secondBounds.bottom),
    left: Math.max(firstBounds.left, secondBounds.left),
  };
}

export function placeLibraryPopover(
  placementInput: LibraryPopoverPlacementInput,
): LibraryPopoverPlacement {
  assertPopoverBounds(placementInput.boundaryBounds, "boundary bounds");
  assertPopoverBounds(placementInput.triggerBounds, "trigger bounds");
  assertFiniteNonNegative(placementInput.gapPx, "gapPx");
  assertPositiveSize(placementInput.popoverWidth, "popoverWidth");
  assertPositiveSize(placementInput.popoverHeight, "popoverHeight");

  const boundaryWidth = placementInput.boundaryBounds.right - placementInput.boundaryBounds.left;
  const boundaryHeight = placementInput.boundaryBounds.bottom - placementInput.boundaryBounds.top;
  if (boundaryWidth <= 0 || boundaryHeight <= 0) {
    throw new Error(
      `Cannot place the library popover because the boundary is ${JSON.stringify(placementInput.boundaryBounds)}.`,
    );
  }

  const usableAbove = Math.max(
    0,
    placementInput.triggerBounds.top - placementInput.boundaryBounds.top - placementInput.gapPx,
  );
  const usableBelow = Math.max(
    0,
    placementInput.boundaryBounds.bottom - placementInput.triggerBounds.bottom - placementInput.gapPx,
  );
  const fitsAbove = placementInput.popoverHeight <= usableAbove;
  const fitsBelow = placementInput.popoverHeight <= usableBelow;
  const placedAbove = !fitsBelow && (fitsAbove || usableAbove > usableBelow);
  const availableHeight = placedAbove ? usableAbove : usableBelow;
  const maxHeight = availableHeight > 0
    ? Math.min(placementInput.popoverHeight, availableHeight)
    : Math.min(placementInput.popoverHeight, boundaryHeight);
  let top = placedAbove
    ? placementInput.triggerBounds.top - placementInput.gapPx - maxHeight
    : placementInput.triggerBounds.bottom + placementInput.gapPx;

  if (availableHeight <= 0) {
    top = placementInput.boundaryBounds.top;
  }
  if (top < placementInput.boundaryBounds.top) {
    top = placementInput.boundaryBounds.top;
  }
  if (top + maxHeight > placementInput.boundaryBounds.bottom) {
    top = placementInput.boundaryBounds.bottom - maxHeight;
  }

  const maxWidth = Math.min(placementInput.popoverWidth, boundaryWidth);
  let left = placementInput.triggerBounds.left;
  if (left + maxWidth > placementInput.boundaryBounds.right) {
    left = placementInput.boundaryBounds.right - maxWidth;
  }
  if (left < placementInput.boundaryBounds.left) {
    left = placementInput.boundaryBounds.left;
  }

  return {
    top,
    left,
    maxHeight,
    maxWidth,
    placedAbove,
  };
}

function assertPopoverBounds(bounds: PopoverBounds, boundsLabel: string): void {
  const edges = [
    ["top", bounds.top],
    ["right", bounds.right],
    ["bottom", bounds.bottom],
    ["left", bounds.left],
  ] as const;

  for (const [edgeName, edgeValue] of edges) {
    if (!Number.isFinite(edgeValue)) {
      throw new Error(
        `Cannot use library popover ${boundsLabel} because ${edgeName} is ${JSON.stringify(edgeValue)}.`,
      );
    }
  }
}

function assertFiniteNonNegative(value: number, valueLabel: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `Cannot place the library popover because ${valueLabel} is ${JSON.stringify(value)}.`,
    );
  }
}

function assertPositiveSize(value: number, valueLabel: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(
      `Cannot place the library popover because ${valueLabel} is ${JSON.stringify(value)}.`,
    );
  }
}
