"use client";

import { useState } from "react";
import { LocalProjectPanel, type LocalProjectStorageStatus } from "./local-project-panel";
import { MapImageExportPanel } from "./map-image-export-panel";
import type { ScreenshotResolution } from "../projects/map-image-export";
import { MapImageExportError } from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";

type PlannerSaveModalContentProperties = Readonly<{
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentProjectMapInstanceCount: number | null;
  currentProjectMapInstanceName: string | null;
  mapFile: string;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => void;
  onSaveThumbnail: () => Promise<void>;
  projects: readonly ReferenceProjectSummary[];
  season: TilesheetSeason;
  storageErrorMessage: string | null;
  storageStatus: LocalProjectStorageStatus;
}>;

export function PlannerSaveModalContent({
  currentProjectId,
  currentProjectName,
  currentProjectMapInstanceCount,
  currentProjectMapInstanceName,
  mapFile,
  onCaptureScreenshot,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onExportProject,
  onImportProject,
  onOpenProject,
  onRenameProject,
  onSaveCurrentMap,
  onSaveThumbnail,
  projects,
  season,
  storageErrorMessage,
  storageStatus,
}: PlannerSaveModalContentProperties) {
  const [thumbnailActionState, setThumbnailActionState] = useState<
    Readonly<{ kind: "error" | "success"; message: string }> | null
  >(null);

  async function handleSaveThumbnail(): Promise<void> {
    try {
      await onSaveThumbnail();
      setThumbnailActionState({
        kind: "success",
        message: "Thumbnail saved to this browser.",
      });
    } catch (caughtError) {
      setThumbnailActionState({
        kind: "error",
        message: formatPlannerThumbnailSaveError(caughtError),
      });
    }
  }

  return (
    <div className="planner-save-modal-content">
      <LocalProjectPanel
        currentProjectId={currentProjectId}
        currentProjectMapInstanceCount={currentProjectMapInstanceCount}
        currentProjectMapInstanceName={currentProjectMapInstanceName}
        currentProjectName={currentProjectName}
        onCreateProject={onCreateProject}
        onDeleteProject={onDeleteProject}
        onDuplicateProject={onDuplicateProject}
        onExportProject={onExportProject}
        onImportProject={onImportProject}
        onOpenProject={onOpenProject}
        onRenameProject={onRenameProject}
        onSaveCurrentMap={onSaveCurrentMap}
        projects={projects}
        storageErrorMessage={storageErrorMessage}
        storageStatus={storageStatus}
      />
      <div className="planner-save-modal-content__exports">
        <MapImageExportPanel
          mapFile={mapFile}
          onCaptureScreenshot={onCaptureScreenshot}
          season={season}
        />
        <section aria-label="Thumbnail" className="map-image-export-panel">
          <h3>Thumbnail</h3>
          <div className="map-image-export-panel__actions">
            <button onClick={() => void handleSaveThumbnail()} type="button">
              Save thumbnail
            </button>
          </div>
          {thumbnailActionState !== null ? (
            <p
              className={
                thumbnailActionState.kind === "error"
                  ? "local-project-panel__error"
                  : "local-project-panel__message"
              }
              role={thumbnailActionState.kind === "error" ? "alert" : "status"}
            >
              {thumbnailActionState.message}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export function formatPlannerThumbnailSaveError(caughtError: unknown): string {
  if (caughtError instanceof MapImageExportError) {
    return `Thumbnail save failed: ${caughtError.message}`;
  }

  throw caughtError;
}
