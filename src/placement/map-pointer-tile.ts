export type MapPointerTileInput = Readonly<{
  pointerX: number;
  pointerY: number;
  cameraPositionX: number;
  cameraPositionY: number;
  zoom: number;
  mapTileWidth: number;
  mapTileHeight: number;
  mapWidth: number;
  mapHeight: number;
}>;

export type MapPointerTile = Readonly<{
  x: number;
  y: number;
}>;

export function getMapTileAtPointer(
  mapPointerTileInput: MapPointerTileInput,
): MapPointerTile | null {
  assertMapPointerTileInput(mapPointerTileInput);

  const mapPixelWidth = mapPointerTileInput.mapWidth * mapPointerTileInput.mapTileWidth;
  const mapPixelHeight = mapPointerTileInput.mapHeight * mapPointerTileInput.mapTileHeight;
  const mapPixelX =
    (mapPointerTileInput.pointerX - mapPointerTileInput.cameraPositionX) /
      mapPointerTileInput.zoom +
    mapPixelWidth / 2;
  const mapPixelY =
    (mapPointerTileInput.pointerY - mapPointerTileInput.cameraPositionY) /
      mapPointerTileInput.zoom +
    mapPixelHeight / 2;
  const tileX = Math.floor(mapPixelX / mapPointerTileInput.mapTileWidth);
  const tileY = Math.floor(mapPixelY / mapPointerTileInput.mapTileHeight);

  if (
    tileX < 0 ||
    tileY < 0 ||
    tileX >= mapPointerTileInput.mapWidth ||
    tileY >= mapPointerTileInput.mapHeight
  ) {
    return null;
  }

  return { x: tileX, y: tileY };
}

function assertMapPointerTileInput(
  mapPointerTileInput: MapPointerTileInput,
): void {
  if (
    typeof mapPointerTileInput !== "object" ||
    mapPointerTileInput === null
  ) {
    throw new TypeError(
      `Map pointer tile input must be a non-null object; received ${describeValue(mapPointerTileInput)}.`,
    );
  }

  assertFiniteNumber(mapPointerTileInput.pointerX, "pointerX");
  assertFiniteNumber(mapPointerTileInput.pointerY, "pointerY");
  assertFiniteNumber(mapPointerTileInput.cameraPositionX, "cameraPositionX");
  assertFiniteNumber(mapPointerTileInput.cameraPositionY, "cameraPositionY");
  assertPositiveFiniteNumber(mapPointerTileInput.zoom, "zoom");
  assertPositiveSafeInteger(mapPointerTileInput.mapTileWidth, "mapTileWidth");
  assertPositiveSafeInteger(mapPointerTileInput.mapTileHeight, "mapTileHeight");
  assertPositiveSafeInteger(mapPointerTileInput.mapWidth, "mapWidth");
  assertPositiveSafeInteger(mapPointerTileInput.mapHeight, "mapHeight");
}

function assertFiniteNumber(value: unknown, fieldName: string): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(
      `Map pointer tile input field ${JSON.stringify(fieldName)} must be a finite number; received ${describeValue(value)}.`,
    );
  }
}

function assertPositiveFiniteNumber(value: unknown, fieldName: string): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new TypeError(
      `Map pointer tile input field ${JSON.stringify(fieldName)} must be a positive finite number; received ${describeValue(value)}.`,
    );
  }
}

function assertPositiveSafeInteger(value: unknown, fieldName: string): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(
      `Map pointer tile input field ${JSON.stringify(fieldName)} must be a positive safe integer; received ${describeValue(value)}.`,
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
