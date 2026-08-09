import type { CameraState } from "../rendering/camera-state";

export type PlannerCameraStateRetention = Readonly<{
  read(mapId: string): CameraState | null;
  write(mapId: string, cameraState: CameraState): void;
}>;

export function createPlannerCameraStateRetention(): PlannerCameraStateRetention {
  let retainedMapId: string | null = null;
  let retainedCameraState: CameraState | null = null;

  return {
    read(mapId): CameraState | null {
      return retainedMapId === mapId ? retainedCameraState : null;
    },
    write(mapId, cameraState): void {
      retainedMapId = mapId;
      retainedCameraState = cameraState;
    },
  };
}
