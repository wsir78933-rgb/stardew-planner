export type CameraGeometry = Readonly<{
  mapPixelHeight: number;
  mapPixelWidth: number;
  viewportHeight: number;
  viewportWidth: number;
}>;

export type CameraState = Readonly<{
  initialFitZoom: number;
  maximumZoom: number;
  minimumZoom: number;
  positionX: number;
  positionY: number;
  zoom: number;
}>;

type CameraPan = Readonly<{
  deltaX: number;
  deltaY: number;
}>;

type CameraZoomAtPoint = Readonly<{
  anchorX: number;
  anchorY: number;
  requestedZoom: number;
}>;

type CameraPositionBounds = Readonly<{
  maximumPositionX: number;
  maximumPositionY: number;
  minimumPositionX: number;
  minimumPositionY: number;
}>;

const minimumCameraZoom = 0.25;
const maximumBlankViewportRatio = 0.3;
const cameraKeyboardPanDistance = 4;
const standardWheelZoomMultiplier = 0.001;
const controlWheelZoomMultiplier = 0.01;

export function createInitialCameraState(
  cameraGeometry: CameraGeometry,
): CameraState {
  assertCameraGeometry(cameraGeometry);

  const initialFitZoom = Math.min(
    cameraGeometry.viewportWidth / cameraGeometry.mapPixelWidth,
    cameraGeometry.viewportHeight / cameraGeometry.mapPixelHeight,
  );

  return {
    initialFitZoom,
    maximumZoom: Math.max(4, initialFitZoom),
    minimumZoom: minimumCameraZoom,
    positionX: cameraGeometry.viewportWidth / 2,
    positionY: cameraGeometry.viewportHeight / 2,
    zoom: initialFitZoom,
  };
}

export function panCameraBy(
  cameraState: CameraState,
  cameraGeometry: CameraGeometry,
  cameraPan: CameraPan,
): CameraState {
  assertCameraState(cameraState);
  assertCameraGeometry(cameraGeometry);
  assertFiniteNumber(cameraPan.deltaX, "cameraPan.deltaX");
  assertFiniteNumber(cameraPan.deltaY, "cameraPan.deltaY");

  return clampCameraPosition(
    {
      ...cameraState,
      positionX: cameraState.positionX + cameraPan.deltaX,
      positionY: cameraState.positionY + cameraPan.deltaY,
    },
    cameraGeometry,
  );
}

export function getWheelRequestedZoom(
  currentZoom: number,
  deltaY: number,
  controlKeyIsPressed: boolean,
): number {
  assertPositiveFiniteNumber(currentZoom, "currentZoom");
  assertFiniteNumber(deltaY, "deltaY");

  const wheelZoomMultiplier = controlKeyIsPressed
    ? controlWheelZoomMultiplier
    : standardWheelZoomMultiplier;

  return currentZoom - deltaY * wheelZoomMultiplier;
}

export function getCameraKeyboardPan(key: string): CameraPan | null {
  switch (key.toLowerCase()) {
    case "w":
    case "arrowup":
      return { deltaX: 0, deltaY: cameraKeyboardPanDistance };
    case "a":
    case "arrowleft":
      return { deltaX: cameraKeyboardPanDistance, deltaY: 0 };
    case "s":
    case "arrowdown":
      return { deltaX: 0, deltaY: -cameraKeyboardPanDistance };
    case "d":
    case "arrowright":
      return { deltaX: -cameraKeyboardPanDistance, deltaY: 0 };
    default:
      return null;
  }
}

export function zoomCameraAtPoint(
  cameraState: CameraState,
  cameraGeometry: CameraGeometry,
  cameraZoomAtPoint: CameraZoomAtPoint,
): CameraState {
  assertCameraState(cameraState);
  assertCameraGeometry(cameraGeometry);
  assertFiniteNumber(cameraZoomAtPoint.anchorX, "cameraZoomAtPoint.anchorX");
  assertFiniteNumber(cameraZoomAtPoint.anchorY, "cameraZoomAtPoint.anchorY");
  assertFiniteNumber(
    cameraZoomAtPoint.requestedZoom,
    "cameraZoomAtPoint.requestedZoom",
  );

  const zoom = clampNumber(
    cameraZoomAtPoint.requestedZoom,
    cameraState.minimumZoom,
    cameraState.maximumZoom,
  );
  const zoomRatio = zoom / cameraState.zoom;

  return clampCameraPosition(
    {
      ...cameraState,
      positionX:
        cameraZoomAtPoint.anchorX -
        (cameraZoomAtPoint.anchorX - cameraState.positionX) * zoomRatio,
      positionY:
        cameraZoomAtPoint.anchorY -
        (cameraZoomAtPoint.anchorY - cameraState.positionY) * zoomRatio,
      zoom,
    },
    cameraGeometry,
  );
}

export function clampCameraPosition(
  cameraState: CameraState,
  cameraGeometry: CameraGeometry,
): CameraState {
  assertCameraState(cameraState);
  assertCameraGeometry(cameraGeometry);

  const cameraPositionBounds = getCameraPositionBounds(
    cameraGeometry,
    cameraState.zoom,
  );

  return {
    ...cameraState,
    positionX: clampNumber(
      cameraState.positionX,
      cameraPositionBounds.minimumPositionX,
      cameraPositionBounds.maximumPositionX,
    ),
    positionY: clampNumber(
      cameraState.positionY,
      cameraPositionBounds.minimumPositionY,
      cameraPositionBounds.maximumPositionY,
    ),
  };
}

function getCameraPositionBounds(
  cameraGeometry: CameraGeometry,
  zoom: number,
): CameraPositionBounds {
  return {
    maximumPositionX: getAxisMaximumPosition(
      cameraGeometry.mapPixelWidth,
      cameraGeometry.viewportWidth,
      zoom,
    ),
    maximumPositionY: getAxisMaximumPosition(
      cameraGeometry.mapPixelHeight,
      cameraGeometry.viewportHeight,
      zoom,
    ),
    minimumPositionX: getAxisMinimumPosition(
      cameraGeometry.mapPixelWidth,
      cameraGeometry.viewportWidth,
      zoom,
    ),
    minimumPositionY: getAxisMinimumPosition(
      cameraGeometry.mapPixelHeight,
      cameraGeometry.viewportHeight,
      zoom,
    ),
  };
}

function getAxisMinimumPosition(
  mapPixelSize: number,
  viewportSize: number,
  zoom: number,
): number {
  const scaledMapPixelSize = mapPixelSize * zoom;

  if (scaledMapPixelSize < viewportSize * (1 - maximumBlankViewportRatio * 2)) {
    return viewportSize / 2;
  }

  return viewportSize * (1 - maximumBlankViewportRatio) - scaledMapPixelSize / 2;
}

function getAxisMaximumPosition(
  mapPixelSize: number,
  viewportSize: number,
  zoom: number,
): number {
  const scaledMapPixelSize = mapPixelSize * zoom;

  if (scaledMapPixelSize < viewportSize * (1 - maximumBlankViewportRatio * 2)) {
    return viewportSize / 2;
  }

  return viewportSize * maximumBlankViewportRatio + scaledMapPixelSize / 2;
}

function clampNumber(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function assertCameraGeometry(cameraGeometry: CameraGeometry): void {
  assertPositiveFiniteNumber(cameraGeometry.mapPixelHeight, "mapPixelHeight");
  assertPositiveFiniteNumber(cameraGeometry.mapPixelWidth, "mapPixelWidth");
  assertPositiveFiniteNumber(cameraGeometry.viewportHeight, "viewportHeight");
  assertPositiveFiniteNumber(cameraGeometry.viewportWidth, "viewportWidth");
}

function assertCameraState(cameraState: CameraState): void {
  assertPositiveFiniteNumber(cameraState.initialFitZoom, "initialFitZoom");
  assertPositiveFiniteNumber(cameraState.minimumZoom, "minimumZoom");
  assertPositiveFiniteNumber(cameraState.maximumZoom, "maximumZoom");
  assertFiniteNumber(cameraState.positionX, "positionX");
  assertFiniteNumber(cameraState.positionY, "positionY");
  assertPositiveFiniteNumber(cameraState.zoom, "zoom");

  if (cameraState.minimumZoom > cameraState.maximumZoom) {
    throw new Error(
      `Camera state minimumZoom must not exceed maximumZoom. Received minimumZoom ${String(cameraState.minimumZoom)} and maximumZoom ${String(cameraState.maximumZoom)}.`,
    );
  }
}

function assertPositiveFiniteNumber(value: number, propertyName: string): void {
  assertFiniteNumber(value, propertyName);

  if (value <= 0) {
    throw new Error(
      `Camera ${propertyName} must be greater than zero. Received: ${String(value)}.`,
    );
  }
}

function assertFiniteNumber(value: number, propertyName: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(
      `Camera ${propertyName} must be a finite number. Received: ${String(value)}.`,
    );
  }
}
