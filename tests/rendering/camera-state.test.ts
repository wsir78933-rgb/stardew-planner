import { describe, expect, it } from "vitest";
import {
  createInitialCameraState,
  getCameraKeyboardPan,
  getWheelRequestedZoom,
  panCameraBy,
  zoomCameraAtPoint,
} from "../../src/rendering/camera-state";

const cameraGeometry = {
  mapPixelHeight: 600,
  mapPixelWidth: 1_000,
  viewportHeight: 300,
  viewportWidth: 500,
} as const;

describe("createInitialCameraState", () => {
  it("fits the full map and centers it in the viewport", () => {
    expect(createInitialCameraState(cameraGeometry)).toEqual({
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 250,
      positionY: 150,
      zoom: 0.5,
    });
  });
});

describe("zoomCameraAtPoint", () => {
  it("keeps the map coordinate below the pointer fixed while zooming", () => {
    const initialCameraState = createInitialCameraState(cameraGeometry);

    expect(
      zoomCameraAtPoint(initialCameraState, cameraGeometry, {
        anchorX: 400,
        anchorY: 225,
        requestedZoom: 1,
      }),
    ).toEqual({
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 100,
      positionY: 75,
      zoom: 1,
    });
  });

  it("clamps a zoom request to the camera range", () => {
    const initialCameraState = createInitialCameraState(cameraGeometry);

    expect(
      zoomCameraAtPoint(initialCameraState, cameraGeometry, {
        anchorX: 250,
        anchorY: 150,
        requestedZoom: 9,
      }).zoom,
    ).toBe(4);
    expect(
      zoomCameraAtPoint(initialCameraState, cameraGeometry, {
        anchorX: 250,
        anchorY: 150,
        requestedZoom: 0.1,
      }).zoom,
    ).toBe(0.25);
  });
});

describe("panCameraBy", () => {
  it("limits a drag so blank space on each side cannot exceed thirty percent", () => {
    const zoomedCameraState = zoomCameraAtPoint(
      createInitialCameraState(cameraGeometry),
      cameraGeometry,
      {
        anchorX: 250,
        anchorY: 150,
        requestedZoom: 1,
      },
    );

    expect(
      panCameraBy(zoomedCameraState, cameraGeometry, {
        deltaX: 10_000,
        deltaY: -10_000,
      }),
    ).toMatchObject({
      positionX: 650,
      positionY: -90,
      zoom: 1,
    });
  });

  it("centers maps that are too small to satisfy the blank-space limit", () => {
    const compactMapGeometry = {
      mapPixelHeight: 100,
      mapPixelWidth: 100,
      viewportHeight: 500,
      viewportWidth: 500,
    } as const;
    const minimumZoomCameraState = zoomCameraAtPoint(
      createInitialCameraState(compactMapGeometry),
      compactMapGeometry,
      {
        anchorX: 250,
        anchorY: 250,
        requestedZoom: 0.25,
      },
    );

    expect(
      panCameraBy(minimumZoomCameraState, compactMapGeometry, {
        deltaX: 400,
        deltaY: -400,
      }),
    ).toMatchObject({
      positionX: 250,
      positionY: 250,
    });
  });
});

describe("getWheelRequestedZoom", () => {
  it("uses the precision wheel multiplier when control is held", () => {
    expect(getWheelRequestedZoom(1, 100, false)).toBeCloseTo(0.9);
    expect(getWheelRequestedZoom(1, 100, true)).toBeCloseTo(0);
  });
});

describe("getCameraKeyboardPan", () => {
  it("moves the camera four viewport pixels for each supported direction key", () => {
    expect(getCameraKeyboardPan("w")).toEqual({ deltaX: 0, deltaY: 4 });
    expect(getCameraKeyboardPan("ArrowLeft")).toEqual({ deltaX: 4, deltaY: 0 });
    expect(getCameraKeyboardPan("z")).toBeNull();
  });
});
