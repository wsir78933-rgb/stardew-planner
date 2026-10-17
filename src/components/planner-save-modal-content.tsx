"use client";

import { useState, type ReactNode } from "react";
import { LocalProjectPanel, type LocalProjectStorageStatus } from "./local-project-panel";
import { MapImageExportPanel } from "./map-image-export-panel";
import type { ScreenshotResolution } from "../projects/map-image-export";
import { MapImageExportError } from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type { SaveModalCopy, ThumbnailCopy } from "../i18n/save-modal-copy";
import styles from "./planner-library-layout.module.css";

type PlannerSaveModalContentProperties = Readonly<{
  copy: Pick<
    SaveModalCopy,
    | "deleteProject"
    | "imageExport"
    | "localProjects"
    | "saveTools"
    | "thumbnail"
  >;
  isProjectsBranchActive: boolean;
  isToolsViewActive?: boolean;
  libraryToolsEntry?: ReactNode;
  mainBranchContent: ReactNode;
  onOpenFarmSummary?: () => void;
  sidebarNavigation: ReactNode;
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
  onSaveCurrentMap: () => Promise<void>;
  onActivateProjectList: () => void;
  onSaveThumbnail: () => Promise<void>;
  projects: readonly ReferenceProjectSummary[];
  season: TilesheetSeason;
  storageErrorMessage: string | null;
  storageStatus: LocalProjectStorageStatus;
}>;

export function PlannerSaveModalContent({
  copy,
  isProjectsBranchActive,
  isToolsViewActive = false,
  libraryToolsEntry = null,
  mainBranchContent,
  onOpenFarmSummary,
  sidebarNavigation,
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
  onActivateProjectList,
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
        message: copy.thumbnail.saved,
      });
    } catch (caughtError) {
      setThumbnailActionState({
        kind: "error",
        message: formatPlannerThumbnailSaveError(caughtError, copy.thumbnail),
      });
    }
  }

  const imageExportTools = (
    <div className={`planner-save-modal-content__exports ${styles.imageExportTools}`}>
      <MapImageExportPanel
        copy={copy.imageExport}
        mapFile={mapFile}
        onCaptureScreenshot={onCaptureScreenshot}
        season={season}
      />
      <section aria-label={copy.thumbnail.title} className="map-image-export-panel">
        <h3>{copy.thumbnail.title}</h3>
        <div className="map-image-export-panel__actions">
          <button onClick={() => void handleSaveThumbnail()} type="button">
            {copy.thumbnail.saveLabel}
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
  );

  return (
    <div className="planner-save-modal-content">
      <LocalProjectPanel
        copy={copy.localProjects}
        currentProjectId={currentProjectId}
        currentProjectMapInstanceCount={currentProjectMapInstanceCount}
        currentProjectMapInstanceName={currentProjectMapInstanceName}
        currentProjectName={currentProjectName}
        deleteCopy={copy.deleteProject}
        onCreateProject={onCreateProject}
        onDeleteProject={onDeleteProject}
        onDuplicateProject={onDuplicateProject}
        onExportProject={onExportProject}
        onImportProject={onImportProject}
        onOpenProject={onOpenProject}
        onRenameProject={onRenameProject}
        onSaveCurrentMap={onSaveCurrentMap}
        onActivateProjectList={onActivateProjectList}
        projects={projects}
        isProjectListActive={isProjectsBranchActive}
        isToolsViewActive={isToolsViewActive}
        sidebarContent={sidebarNavigation}
        sidebarFooterContent={libraryToolsEntry}
        toolsViewContent={
          <>
            {imageExportTools}
            {onOpenFarmSummary !== undefined ? (
              <button
                className={styles.toolsSectionButton}
                onClick={onOpenFarmSummary}
                type="button"
              >
                {copy.saveTools.farmSummary}
              </button>
            ) : null}
          </>
        }
        mainContent={mainBranchContent}
        storageErrorMessage={storageErrorMessage}
        storageStatus={storageStatus}
      />
    </div>
  );
}

export function formatPlannerThumbnailSaveError(
  caughtError: unknown,
  thumbnailCopy: ThumbnailCopy,
): string {
  if (caughtError instanceof MapImageExportError) {
    return thumbnailCopy.saveFailure(caughtError.message);
  }

  throw caughtError;
}
