"use client";

import { useState, type ReactNode } from "react";
import { LocalProjectPanel, type LocalProjectStorageStatus } from "./local-project-panel";
import { MapImageExportPanel } from "./map-image-export-panel";
import type { ScreenshotResolution } from "../projects/map-image-export";
import { MapImageExportError } from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import type { SaveModalCopy, ThumbnailCopy } from "../i18n/save-modal-copy";
import { useCloudProjectSync } from "@/src/cloud-sync/use-cloud-project-sync";
import { CloudProjectPanel, CloudProjectSidebar } from "./cloud-project-panel";
import styles from "./planner-library-layout.module.css";

type PlannerSaveModalContentProperties = Readonly<{
  copy: Pick<
    SaveModalCopy,
    | "cloudProjects"
    | "deleteProject"
    | "imageExport"
    | "localProjects"
    | "saveTools"
    | "thumbnail"
  >;
  isProjectsBranchActive: boolean;
  mainBranchContent: ReactNode;
  sidebarNavigation: ReactNode;
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentProjectMapInstanceCount: number | null;
  currentProjectMapInstanceName: string | null;
  mapFile: string;
  workspaceController: ReferenceProjectWorkspaceController;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => Promise<void>;
  onSaveThumbnail: () => Promise<void>;
  projects: readonly ReferenceProjectSummary[];
  season: TilesheetSeason;
  storageErrorMessage: string | null;
  storageStatus: LocalProjectStorageStatus;
}>;

export function PlannerSaveModalContent({
  copy,
  isProjectsBranchActive,
  mainBranchContent,
  sidebarNavigation,
  currentProjectId,
  currentProjectName,
  currentProjectMapInstanceCount,
  currentProjectMapInstanceName,
  mapFile,
  workspaceController,
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
  const cloudProjectSync = useCloudProjectSync({ workspaceController });
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

  async function handleSaveCurrentMapAndNotifyCloudSync(): Promise<void> {
    await saveCurrentMapAndNotifyCloudSync({
      saveCurrentMap: onSaveCurrentMap,
      workspaceController,
      onLocalProjectSaved: cloudProjectSync.onLocalProjectSaved,
    });
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
        onSaveCurrentMap={handleSaveCurrentMapAndNotifyCloudSync}
        projects={projects}
        isProjectListActive={isProjectsBranchActive}
        sidebarContent={
          <>
            {sidebarNavigation}
            <CloudProjectSidebar
              cloudProjectSync={cloudProjectSync}
              copy={copy.cloudProjects}
              localProjects={projects}
            />
            <details className={styles.imageExportDetails}>
              <summary>{copy.imageExport.exportLabel}</summary>
              {imageExportTools}
            </details>
          </>
        }
        mainContent={
          <>
            <details
              className={styles.cloudProjectsDetails}
              hidden={!isProjectsBranchActive}
            >
              <summary>{copy.cloudProjects.localProjects}</summary>
              <CloudProjectPanel
                cloudProjectSync={cloudProjectSync}
                copy={copy.cloudProjects}
                currentProjectId={currentProjectId}
                localProjects={projects}
              />
            </details>
            {mainBranchContent}
          </>
        }
        storageErrorMessage={storageErrorMessage}
        storageStatus={storageStatus}
      />
    </div>
  );
}

export function getActiveProjectIdAfterLocalSave(
  workspaceController: ReferenceProjectWorkspaceController,
): string {
  const activeProjectId = workspaceController.getState().activeProject?.id;
  if (typeof activeProjectId !== "string" || activeProjectId.trim().length === 0) {
    throw new Error(
      `Cannot notify cloud sync after local save because the active project ID is ${JSON.stringify(activeProjectId)}.`,
    );
  }

  return activeProjectId;
}

export async function saveCurrentMapAndNotifyCloudSync({
  onLocalProjectSaved,
  saveCurrentMap,
  workspaceController,
}: Readonly<{
  onLocalProjectSaved: (localProjectId: string) => Promise<void>;
  saveCurrentMap: () => Promise<void>;
  workspaceController: ReferenceProjectWorkspaceController;
}>): Promise<void> {
  await saveCurrentMap();
  await onLocalProjectSaved(
    getActiveProjectIdAfterLocalSave(workspaceController),
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
