import type { CameraState } from "../rendering/camera-state";

export type PlannerCameraStateRetention = Readonly<{
  observeSelectedMapId(selectedMapId: string): void;
  read(mapId: string): CameraState | null;
  write(mapId: string, cameraState: CameraState): void;
}>;

export function createPlannerCameraStateRetention(): PlannerCameraStateRetention {
  let observedSelectedMapId: string | null = null;
  let retainedMapId: string | null = null;
  let retainedCameraState: CameraState | null = null;

  return {
    observeSelectedMapId(selectedMapId): void {
      if (
        observedSelectedMapId !== null &&
        observedSelectedMapId !== selectedMapId
      ) {
        retainedMapId = null;
        retainedCameraState = null;
      }
      observedSelectedMapId = selectedMapId;
    },
    read(mapId): CameraState | null {
      return retainedMapId === mapId ? retainedCameraState : null;
    },
    write(mapId, cameraState): void {
      retainedMapId = mapId;
      retainedCameraState = cameraState;
    },
  };
}
