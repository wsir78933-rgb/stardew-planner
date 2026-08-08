import {
  MapImageExportError,
  type MapImageExporter,
} from "../projects/map-image-export";
import type { PngToWebpEncodingPort } from "../projects/browser-png-to-webp";
import { encodePngAsWebp } from "../projects/browser-png-to-webp";
import type { ReferenceOpenMapSession } from "../reference-runtime/reference-project-editor-adapter";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";

export type ThumbnailSaveWorkspaceSnapshot = Readonly<{
  activeSession: ReferenceOpenMapSession | null;
  plannerMapId: string;
  mapImageExporter: MapImageExporter | null;
}>;

export type ThumbnailSaveOrchestratorInput = Readonly<{
  getCurrentWorkspaceSnapshot: () => ThumbnailSaveWorkspaceSnapshot;
  workspaceController: Pick<ReferenceProjectWorkspaceController, "saveThumbnail">;
  getPlannerMapIdForMapFile: (mapFile: string) => string;
  pngToWebpEncodingPort?: PngToWebpEncodingPort;
}>;

export async function saveCurrentCanonicalMapThumbnail(
  thumbnailSaveOrchestratorInput: ThumbnailSaveOrchestratorInput,
): Promise<void> {
  const capturedWorkspaceSnapshot = thumbnailSaveOrchestratorInput.getCurrentWorkspaceSnapshot();
  const capturedThumbnailTarget = createThumbnailTarget(
    capturedWorkspaceSnapshot,
    thumbnailSaveOrchestratorInput.getPlannerMapIdForMapFile,
  );
  const pngBlob = await capturedThumbnailTarget.mapImageExporter.captureScreenshot(1);
  const webpBytes = await encodePngAsWebp(
    pngBlob,
    thumbnailSaveOrchestratorInput.pngToWebpEncodingPort,
  );
  assertThumbnailTargetIsCurrent(
    capturedThumbnailTarget,
    thumbnailSaveOrchestratorInput.getCurrentWorkspaceSnapshot(),
    thumbnailSaveOrchestratorInput.getPlannerMapIdForMapFile,
  );
  thumbnailSaveOrchestratorInput.workspaceController.saveThumbnail({
    projectId: capturedThumbnailTarget.projectId,
    mapId: capturedThumbnailTarget.mapId,
    webpBytes,
  });
}

type CapturedThumbnailTarget = Readonly<{
  projectId: string;
  mapId: string;
  plannerMapId: string;
  mapImageExporter: MapImageExporter;
}>;

function createThumbnailTarget(
  thumbnailSaveWorkspaceSnapshot: ThumbnailSaveWorkspaceSnapshot,
  getPlannerMapIdForMapFile: (mapFile: string) => string,
): CapturedThumbnailTarget {
  const activeSession = thumbnailSaveWorkspaceSnapshot.activeSession;
  if (activeSession === null || thumbnailSaveWorkspaceSnapshot.mapImageExporter === null) {
    throw new MapImageExportError(
      "Canonical thumbnail target is unavailable; received project ID "
        + `${JSON.stringify(activeSession?.projectId ?? null)}, map ID `
        + `${JSON.stringify(activeSession?.mapId ?? null)}, planner map ID `
        + `${JSON.stringify(thumbnailSaveWorkspaceSnapshot.plannerMapId)}, and exporter `
        + `${JSON.stringify(thumbnailSaveWorkspaceSnapshot.mapImageExporter === null ? null : "present")}.`,
    );
  }
  assertNonEmptyIdentifier(activeSession.projectId, "project ID");
  assertNonEmptyIdentifier(activeSession.mapId, "map ID");
  assertNonEmptyIdentifier(thumbnailSaveWorkspaceSnapshot.plannerMapId, "planner map ID");
  assertSessionPlannerMapMatches(
    activeSession,
    thumbnailSaveWorkspaceSnapshot.plannerMapId,
    getPlannerMapIdForMapFile,
  );
  return {
    projectId: activeSession.projectId,
    mapId: activeSession.mapId,
    plannerMapId: thumbnailSaveWorkspaceSnapshot.plannerMapId,
    mapImageExporter: thumbnailSaveWorkspaceSnapshot.mapImageExporter,
  };
}

function assertThumbnailTargetIsCurrent(
  capturedThumbnailTarget: CapturedThumbnailTarget,
  currentWorkspaceSnapshot: ThumbnailSaveWorkspaceSnapshot,
  getPlannerMapIdForMapFile: (mapFile: string) => string,
): void {
  const currentSession = currentWorkspaceSnapshot.activeSession;
  if (currentSession !== null) {
    assertSessionPlannerMapMatches(
      currentSession,
      currentWorkspaceSnapshot.plannerMapId,
      getPlannerMapIdForMapFile,
    );
  }
  const hasSameTarget = currentSession !== null
    && currentSession.projectId === capturedThumbnailTarget.projectId
    && currentSession.mapId === capturedThumbnailTarget.mapId
    && currentWorkspaceSnapshot.plannerMapId === capturedThumbnailTarget.plannerMapId
    && currentWorkspaceSnapshot.mapImageExporter === capturedThumbnailTarget.mapImageExporter;
  if (!hasSameTarget) {
    const currentExporterDescription = currentWorkspaceSnapshot.mapImageExporter
      === capturedThumbnailTarget.mapImageExporter
      ? "captured"
      : currentWorkspaceSnapshot.mapImageExporter === null
        ? null
        : "different";
    throw new MapImageExportError(
      "Canonical thumbnail target changed before save; received current project ID "
        + `${JSON.stringify(currentSession?.projectId ?? null)}, map ID `
        + `${JSON.stringify(currentSession?.mapId ?? null)}, planner map ID `
        + `${JSON.stringify(currentWorkspaceSnapshot.plannerMapId)}, and exporter `
        + `${JSON.stringify(currentExporterDescription)}; `
        + `captured project ID ${JSON.stringify(capturedThumbnailTarget.projectId)}, map ID `
        + `${JSON.stringify(capturedThumbnailTarget.mapId)}, and planner map ID `
        + `${JSON.stringify(capturedThumbnailTarget.plannerMapId)}.`,
    );
  }
}

function assertSessionPlannerMapMatches(
  activeSession: ReferenceOpenMapSession,
  currentPlannerMapId: string,
  getPlannerMapIdForMapFile: (mapFile: string) => string,
): void {
  const resolvedPlannerMapId = getPlannerMapIdForMapFile(activeSession.sourceMap.mapFile);
  if (resolvedPlannerMapId !== currentPlannerMapId) {
    throw new MapImageExportError(
      "Canonical thumbnail planner map does not match the active source map; received map file "
        + `${JSON.stringify(activeSession.sourceMap.mapFile)}, resolved planner map ID `
        + `${JSON.stringify(resolvedPlannerMapId)}, and current planner map ID `
        + `${JSON.stringify(currentPlannerMapId)}.`,
    );
  }
}

function assertNonEmptyIdentifier(identifier: string, identifierDescription: string): void {
  if (typeof identifier !== "string" || identifier.length === 0) {
    throw new TypeError(
      `Canonical thumbnail ${identifierDescription} must be a non-empty string; received `
        + `${JSON.stringify(identifier)}.`,
    );
  }
}
