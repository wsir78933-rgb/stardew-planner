export type MapScreenshotDimensions = Readonly<{
  height: number;
  width: number;
}>;

type CreateMapScreenshotDimensionsInput = Readonly<{
  mapHeight: number;
  mapWidth: number;
  resolution: number;
  tileHeight: number;
  tileWidth: number;
}>;

export function createMapScreenshotDimensions(
  createMapScreenshotDimensionsInput: CreateMapScreenshotDimensionsInput,
): MapScreenshotDimensions {
  assertMapScreenshotDimensionsInput(createMapScreenshotDimensionsInput);

  return {
    height:
      createMapScreenshotDimensionsInput.mapHeight *
      createMapScreenshotDimensionsInput.tileHeight *
      createMapScreenshotDimensionsInput.resolution,
    width:
      createMapScreenshotDimensionsInput.mapWidth *
      createMapScreenshotDimensionsInput.tileWidth *
      createMapScreenshotDimensionsInput.resolution,
  };
}

export function getMapScreenshotFooterHeight(mapScreenshotHeight: number): number {
  assertPositiveSafeInteger(mapScreenshotHeight, "height");
  return Math.max(24, Math.round(mapScreenshotHeight * 0.03));
}

function assertMapScreenshotDimensionsInput(
  createMapScreenshotDimensionsInput: CreateMapScreenshotDimensionsInput,
): void {
  if (
    typeof createMapScreenshotDimensionsInput !== "object" ||
    createMapScreenshotDimensionsInput === null
  ) {
    throw new TypeError(
      `Map screenshot dimensions input must be a non-null object; received ${describeValue(createMapScreenshotDimensionsInput)}.`,
    );
  }

  assertPositiveSafeInteger(createMapScreenshotDimensionsInput.mapHeight, "mapHeight");
  assertPositiveSafeInteger(createMapScreenshotDimensionsInput.mapWidth, "mapWidth");
  assertPositiveSafeInteger(createMapScreenshotDimensionsInput.tileHeight, "tileHeight");
  assertPositiveSafeInteger(createMapScreenshotDimensionsInput.tileWidth, "tileWidth");

  if (
    createMapScreenshotDimensionsInput.resolution !== 1 &&
    createMapScreenshotDimensionsInput.resolution !== 2
  ) {
    throw new TypeError(
      `Map screenshot resolution must be 1 or 2; received ${describeValue(createMapScreenshotDimensionsInput.resolution)}.`,
    );
  }
}

function assertPositiveSafeInteger(value: unknown, fieldName: string): void {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    throw new TypeError(
      `Map screenshot ${fieldName} must be a positive safe integer; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  return JSON.stringify(value);
}
