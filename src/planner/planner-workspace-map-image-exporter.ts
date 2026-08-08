import type { MapImageExporter } from "../projects/map-image-export";
import type { ScreenshotResolution } from "../projects/map-image-export";
import { MapImageExportError } from "../projects/map-image-export";

export type CurrentMapImageExporterSlot = {
  current: Readonly<{
    plannerMapId: string;
    mapImageExporter: MapImageExporter;
  }> | null;
};

export function createCurrentMapImageExporterSlot(): CurrentMapImageExporterSlot {
  return { current: null };
}

export function updateCurrentMapImageExporter(
  currentMapImageExporterSlot: CurrentMapImageExporterSlot,
  currentPlannerMapId: string,
  receivedPlannerMapId: string,
  receivedMapImageExporter: MapImageExporter | null,
): void {
  assertPlannerMapId(currentPlannerMapId, "current planner map ID");
  assertPlannerMapId(receivedPlannerMapId, "received planner map ID");
  if (currentPlannerMapId !== receivedPlannerMapId) return;
  if (receivedMapImageExporter === null) {
    if (
      currentMapImageExporterSlot.current?.plannerMapId
      === receivedPlannerMapId
    ) {
      currentMapImageExporterSlot.current = null;
    }
    return;
  }
  assertMapImageExporter(receivedMapImageExporter);
  currentMapImageExporterSlot.current = {
    plannerMapId: receivedPlannerMapId,
    mapImageExporter: receivedMapImageExporter,
  };
}

export function getCurrentMapImageExporter(
  currentMapImageExporterSlot: CurrentMapImageExporterSlot,
  currentPlannerMapId: string,
): MapImageExporter {
  assertPlannerMapId(currentPlannerMapId, "current planner map ID");
  const registeredMapImageExporter = currentMapImageExporterSlot.current;
  if (
    registeredMapImageExporter === null
    || registeredMapImageExporter.plannerMapId !== currentPlannerMapId
  ) {
    throw new MapImageExportError(
      "Current map image exporter is unavailable; received current planner map ID "
        + `${JSON.stringify(currentPlannerMapId)} and registered planner map ID `
        + `${JSON.stringify(registeredMapImageExporter?.plannerMapId ?? null)}.`,
    );
  }
  return registeredMapImageExporter.mapImageExporter;
}

export function captureCurrentMapScreenshot(
  currentMapImageExporterSlot: CurrentMapImageExporterSlot,
  currentPlannerMapId: string,
  screenshotResolution: ScreenshotResolution,
): Promise<Blob> {
  return getCurrentMapImageExporter(
    currentMapImageExporterSlot,
    currentPlannerMapId,
  ).captureScreenshot(screenshotResolution);
}

function assertPlannerMapId(plannerMapId: string, fieldName: string): void {
  if (typeof plannerMapId !== "string" || plannerMapId.length === 0) {
    throw new TypeError(
      `Current map image exporter ${fieldName} must be a non-empty string; received ${JSON.stringify(plannerMapId)}.`,
    );
  }
}

function assertMapImageExporter(mapImageExporter: MapImageExporter): void {
  if (
    typeof mapImageExporter !== "object"
    || mapImageExporter === null
    || typeof mapImageExporter.captureScreenshot !== "function"
  ) {
    throw new TypeError(
      `Current map image exporter must expose captureScreenshot; received ${JSON.stringify(mapImageExporter)}.`,
    );
  }
}
