"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { createProjectExportFile } from "../projects/local-project-editor-actions";
import type {
  LocalProjectSummary,
  LocalProjectV2Summary,
} from "../projects/local-project-store";
import type { SiteLocale } from "../i18n/locales";
import { formatTranslation, translate } from "../i18n/messages";
import { getPlannerMapDisplayName } from "../i18n/catalog-display";

export type LocalProjectStorageStatus = "loading" | "ready" | "error";

type LocalProjectPanelSummary = LocalProjectSummary | LocalProjectV2Summary;

export type LocalProjectPanelProperties = Readonly<{
  locale?: SiteLocale;
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentProjectMapInstanceCount?: number | null;
  currentProjectMapInstanceName?: string | null;
  projects: readonly LocalProjectPanelSummary[];
  storageStatus: LocalProjectStorageStatus;
  storageErrorMessage: string | null;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => void;
}>;

export function LocalProjectPanel({
  locale = "en",
  currentProjectId,
  currentProjectName,
  currentProjectMapInstanceCount = null,
  currentProjectMapInstanceName = null,
  projects,
  storageStatus,
  storageErrorMessage,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onExportProject,
  onImportProject,
  onOpenProject,
  onRenameProject,
  onSaveCurrentMap,
}: LocalProjectPanelProperties) {
  const importFileInputReference = useRef<HTMLInputElement>(null);
  const [projectActionErrorMessage, setProjectActionErrorMessage] = useState<
    string | null
  >(null);
  const [projectActionNotice, setProjectActionNotice] = useState<string | null>(
    null,
  );
  const [renamedProjectId, setRenamedProjectId] = useState<string | null>(null);
  const [requestedProjectName, setRequestedProjectName] = useState("");
  const [projectIdPendingDeletion, setProjectIdPendingDeletion] = useState<
    string | null
  >(null);
  const isStorageReady = storageStatus === "ready";
  const projectPendingDeletion = projects.find(
    (projectSummary) => projectSummary.id === projectIdPendingDeletion,
  );

  function runProjectAction(action: () => void, successMessage: string): void {
    try {
      action();
      setProjectActionErrorMessage(null);
      setProjectActionNotice(successMessage);
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(locale, caughtError));
    }
  }

  function handleSaveCurrentMap(): void {
    runProjectAction(onSaveCurrentMap, translate(locale, "planner.localProjects.savedNotice"));
  }

  function handleCreateProject(): void {
    runProjectAction(onCreateProject, translate(locale, "planner.localProjects.createdNotice"));
  }

  function handleOpenProject(projectId: string, projectName: string): void {
    runProjectAction(() => onOpenProject(projectId), formatTranslation(locale, "planner.localProjects.openedNotice", { name: projectName }));
  }

  function handleStartRename(projectSummary: LocalProjectPanelSummary): void {
    setRenamedProjectId(projectSummary.id);
    setRequestedProjectName(projectSummary.name);
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
  }

  function handleRenameProject(projectId: string): void {
    runProjectAction(() => {
      onRenameProject(projectId, requestedProjectName);
      setRenamedProjectId(null);
    }, translate(locale, "planner.localProjects.renamedNotice"));
  }

  function handleDuplicateProject(projectId: string): void {
    runProjectAction(
      () => onDuplicateProject(projectId),
      translate(locale, "planner.localProjects.duplicatedNotice"),
    );
  }

  function handleRequestProjectDeletion(projectId: string): void {
    setProjectIdPendingDeletion(projectId);
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
  }

  function handleDeleteProject(): void {
    if (projectPendingDeletion === undefined) {
      throw new Error(
        `Cannot delete local project because the pending project ID ${JSON.stringify(projectIdPendingDeletion)} is not available.`,
      );
    }

    runProjectAction(() => {
      onDeleteProject(projectPendingDeletion.id);
      setProjectIdPendingDeletion(null);
    }, translate(locale, "planner.localProjects.deletedNotice"));
  }

  function handleExportProject(projectSummary: LocalProjectPanelSummary): void {
    try {
      const serializedProject = onExportProject(projectSummary.id);
      const projectExportFile = createProjectExportFile(
        projectSummary.name,
        serializedProject,
      );

      downloadProjectExportFile(projectExportFile);
      setProjectActionErrorMessage(null);
      setProjectActionNotice(formatTranslation(locale, "planner.localProjects.exportedNotice", { name: projectSummary.name }));
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(locale, caughtError));
    }
  }

  function handleImportFileChange(
    changeEvent: ChangeEvent<HTMLInputElement>,
  ): void {
    const selectedProjectFile = changeEvent.currentTarget.files?.[0];

    if (selectedProjectFile === undefined) {
      return;
    }

    void importSelectedProjectFile(selectedProjectFile);
  }

  async function importSelectedProjectFile(selectedProjectFile: File): Promise<void> {
    try {
      const serializedProject = await selectedProjectFile.text();
      onImportProject(serializedProject);

      if (importFileInputReference.current !== null) {
        importFileInputReference.current.value = "";
      }

      setProjectActionErrorMessage(null);
      setProjectActionNotice(formatTranslation(locale, "planner.localProjects.importedNotice", { name: selectedProjectFile.name }));
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(locale, caughtError));
    }
  }

  return (
    <section aria-label={translate(locale, "planner.localProjects.label")} className="local-project-panel">
      <div className="local-project-panel__status">
        <p>
          {translate(locale, "planner.localProjects.currentProject")} <strong>{currentProjectName ?? translate(locale, "planner.localProjects.none")}</strong>
        </p>
        {currentProjectMapInstanceName !== null ? (
          <p>
            {translate(locale, "planner.localProjects.currentMap")} <strong>{currentProjectMapInstanceName}</strong>
            {currentProjectMapInstanceCount !== null
              ? ` (${formatTranslation(locale, "planner.localProjects.maps", { count: currentProjectMapInstanceCount })})`
              : null}
          </p>
        ) : null}
        <p>{translate(locale, "planner.localProjects.stored")}</p>
      </div>
      {storageStatus === "loading" ? (
        <p className="local-project-panel__message" role="status">
          {translate(locale, "planner.localProjects.opening")}
        </p>
      ) : null}
      {storageErrorMessage !== null ? (
        <p className="local-project-panel__error" role="alert">
          {storageErrorMessage}
        </p>
      ) : null}
      {projectActionErrorMessage !== null ? (
        <p className="local-project-panel__error" role="alert">
          {projectActionErrorMessage}
        </p>
      ) : null}
      {projectActionNotice !== null ? (
        <p className="local-project-panel__message" role="status">
          {projectActionNotice}
        </p>
      ) : null}
      <div className="local-project-panel__primary-actions">
        <button
          disabled={!isStorageReady}
          onClick={handleSaveCurrentMap}
          type="button"
        >
          {translate(locale, "planner.localProjects.save")}
        </button>
        <button
          disabled={!isStorageReady}
          onClick={handleCreateProject}
          type="button"
        >
          {translate(locale, "planner.localProjects.new")}
        </button>
        <label
          className={`local-project-panel__import${
            isStorageReady ? "" : " local-project-panel__import--disabled"
          }`}
        >
          <span>{translate(locale, "planner.localProjects.import")}</span>
          <input
            accept="application/json,.json"
            disabled={!isStorageReady}
            onChange={handleImportFileChange}
            ref={importFileInputReference}
            type="file"
          />
        </label>
      </div>
      <ul aria-label={translate(locale, "planner.localProjects.saved")} className="local-project-panel__list">
        {projects.map((projectSummary) => {
          const isCurrentProject = projectSummary.id === currentProjectId;
          const isRenamingProject = projectSummary.id === renamedProjectId;

          return (
            <li
              className="local-project-panel__project"
              data-current-project={isCurrentProject}
              key={projectSummary.id}
            >
              <div className="local-project-panel__project-summary">
                <strong>{projectSummary.name}</strong>
                <span>{getProjectSummaryActiveMapDisplayName(locale, projectSummary)}</span>
                {isCurrentProject ? <span>{translate(locale, "planner.localProjects.current")}</span> : null}
              </div>
              {isRenamingProject ? (
                <div className="local-project-panel__rename-form">
                  <label>
                    <span className="sr-only">{translate(locale, "planner.localProjects.newName")}</span>
                    <input
                      onChange={(changeEvent) =>
                        setRequestedProjectName(changeEvent.currentTarget.value)
                      }
                      type="text"
                      value={requestedProjectName}
                    />
                  </label>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleRenameProject(projectSummary.id)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.applyName")}
                  </button>
                  <button
                    onClick={() => setRenamedProjectId(null)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.cancelRename")}
                  </button>
                </div>
              ) : (
                <div className="local-project-panel__project-actions">
                  <button
                    disabled={!isStorageReady}
                    onClick={() =>
                      handleOpenProject(projectSummary.id, projectSummary.name)
                    }
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.open")}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleStartRename(projectSummary)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.rename")}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleDuplicateProject(projectSummary.id)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.duplicate")}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleExportProject(projectSummary)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.export")}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleRequestProjectDeletion(projectSummary.id)}
                    type="button"
                  >
                    {translate(locale, "planner.localProjects.delete")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {projects.length === 0 ? (
        <p className="local-project-panel__message">
          {translate(locale, "planner.localProjects.empty")}
        </p>
      ) : null}
      {projectPendingDeletion !== undefined ? (
        <dialog
          aria-labelledby="delete-local-project-heading"
          className="local-project-panel__delete-dialog"
          open
        >
          <h3 id="delete-local-project-heading">{translate(locale, "planner.localProjects.deleteTitle")}</h3>
          <p>
            {formatTranslation(locale, "planner.localProjects.deleteConfirm", { name: projectPendingDeletion.name })}
          </p>
          <div>
            <button onClick={handleDeleteProject} type="button">
              {translate(locale, "planner.localProjects.deleteProject")}
            </button>
            <button
              onClick={() => setProjectIdPendingDeletion(null)}
              type="button"
            >
              {translate(locale, "planner.localProjects.keepProject")}
            </button>
          </div>
        </dialog>
      ) : null}
    </section>
  );
}

function getProjectSummaryActiveMapId(
  projectSummary: LocalProjectPanelSummary,
): string {
  return "activeBaseMapId" in projectSummary
    ? projectSummary.activeBaseMapId
    : projectSummary.activeMapId;
}

function getProjectSummaryActiveMapDisplayName(
  locale: SiteLocale,
  projectSummary: LocalProjectPanelSummary,
): string {
  const activeMapId = getProjectSummaryActiveMapId(projectSummary);
  return getPlannerMapDisplayName(locale, activeMapId, activeMapId);
}

function downloadProjectExportFile(
  projectExportFile: ReturnType<typeof createProjectExportFile>,
): void {
  if (typeof document === "undefined") {
    throw new Error(
      `Cannot download local project export ${JSON.stringify(projectExportFile.filename)} without a browser document.`,
    );
  }

  if (typeof URL.createObjectURL !== "function") {
    throw new Error(
      `Cannot download local project export ${JSON.stringify(projectExportFile.filename)} because URL.createObjectURL is unavailable.`,
    );
  }

  const projectExportBlob = new Blob([projectExportFile.serializedProject], {
    type: projectExportFile.mimeType,
  });
  const projectExportUrl = URL.createObjectURL(projectExportBlob);
  const projectExportLink = document.createElement("a");

  projectExportLink.download = projectExportFile.filename;
  projectExportLink.href = projectExportUrl;
  projectExportLink.style.display = "none";
  document.body.append(projectExportLink);
  projectExportLink.click();
  projectExportLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(projectExportUrl), 0);
}

function formatProjectActionError(locale: SiteLocale, caughtError: unknown): string {
  if (caughtError instanceof Error) {
    return formatTranslation(locale, "planner.localProjects.error", { message: caughtError.message });
  }

  return formatTranslation(locale, "planner.localProjects.error", { message: String(caughtError) });
}
