import { describe, expect, it } from "vitest";
import { createPlannerCameraStateRetention } from "../../src/planner/planner-camera-state-retention";
import type { CameraState } from "../../src/rendering/camera-state";

describe("PlannerCameraStateRetention", () => {
  it("returns a retained camera state only for the same map", () => {
    const cameraStateRetention = createPlannerCameraStateRetention();
    const standardCameraState: CameraState = {
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 120,
      positionY: -40,
      zoom: 1.25,
    };

    cameraStateRetention.write("standard", standardCameraState);

    expect(cameraStateRetention.read("standard")).toEqual(standardCameraState);
    expect(cameraStateRetention.read("beach")).toBeNull();
  });

  it("replaces the retained camera state when another map is written", () => {
    const cameraStateRetention = createPlannerCameraStateRetention();
    const standardCameraState: CameraState = {
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 120,
      positionY: -40,
      zoom: 1.25,
    };
    const beachCameraState: CameraState = {
      initialFitZoom: 0.75,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 60,
      positionY: 20,
      zoom: 1.5,
    };

    cameraStateRetention.write("standard", standardCameraState);
    cameraStateRetention.write("beach", beachCameraState);

    expect(cameraStateRetention.read("standard")).toBeNull();
    expect(cameraStateRetention.read("beach")).toEqual(beachCameraState);
  });
});
