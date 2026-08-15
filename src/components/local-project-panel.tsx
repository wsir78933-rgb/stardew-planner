"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { downloadBrowserFile } from "../projects/browser-file-download";
import { createReferenceProjectExportFile } from "../projects/reference-project-export-file";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type {
  LocalProjectDeleteCopy,
  LocalProjectsCopy,
} from "../i18n/save-modal-copy";
import { LocalProjectDeleteAlertDialog } from "./local-project-delete-alert-dialog";

export type LocalProjectStorageStatus = "loading" | "ready" | "error";

type LocalProjectPanelProperties = Readonly<{
  copy: LocalProjectsCopy;
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentProjectMapInstanceCount?: number | null;
  currentProjectMapInstanceName?: string | null;
  deleteCopy: LocalProjectDeleteCopy;
  projects: readonly ReferenceProjectSummary[];
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
  copy,
  currentProjectId,
  currentProjectName,
  currentProjectMapInstanceCount = null,
  currentProjectMapInstanceName = null,
  deleteCopy,
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
  const deleteButtonPendingDeletionRef = useRef<HTMLButtonElement | null>(null);
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
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    }
  }

  function handleSaveCurrentMap(): void {
    runProjectAction(onSaveCurrentMap, copy.savedToBrowser);
  }

  function handleCreateProject(): void {
    runProjectAction(onCreateProject, copy.createdProject);
  }

  function handleOpenProject(projectId: string, projectName: string): void {
    runProjectAction(() => onOpenProject(projectId), copy.openedProject(projectName));
  }

  function handleStartRename(projectSummary: ReferenceProjectSummary): void {
    setRenamedProjectId(projectSummary.id);
    setRequestedProjectName(projectSummary.title);
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
  }

  function handleRenameProject(projectId: string): void {
    runProjectAction(() => {
      onRenameProject(projectId, requestedProjectName);
      setRenamedProjectId(null);
    }, copy.renamedProject);
  }

  function handleDuplicateProject(projectId: string): void {
    runProjectAction(
      () => onDuplicateProject(projectId),
      copy.duplicatedProject,
    );
  }

  function handleRequestProjectDeletion(
    projectId: string,
    deleteButton: HTMLButtonElement,
  ): void {
    deleteButtonPendingDeletionRef.current = deleteButton;
    setProjectIdPendingDeletion(projectId);
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
  }

  function handleDeleteProject(): boolean {
    if (projectPendingDeletion === undefined) {
      throw new Error(
        `Cannot delete local project because the pending project ID ${JSON.stringify(projectIdPendingDeletion)} is not available.`,
      );
    }

    let projectWasDeleted = false;
    runProjectAction(() => {
      onDeleteProject(projectPendingDeletion.id);
      setProjectIdPendingDeletion(null);
      projectWasDeleted = true;
    }, copy.deletedProject);

    return projectWasDeleted;
  }

  function handleExportProject(projectSummary: ReferenceProjectSummary): void {
    try {
      const serializedProject = onExportProject(projectSummary.id);
      const projectExportFile = createReferenceProjectExportFile(
        projectSummary.title,
        serializedProject,
      );

      downloadBrowserFile({
        blob: new Blob([projectExportFile.serializedProject], {
          type: projectExportFile.mimeType,
        }),
        filename: projectExportFile.filename,
      });
      setProjectActionErrorMessage(null);
      setProjectActionNotice(copy.exportedProject(projectSummary.title));
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    }
  }

  function handleImportFileChange(
    changeEvent: ChangeEvent<HTMLInputElement>,
  ): void {
    const selectedProjectFileInput = changeEvent.currentTarget;
    const selectedProjectFile = selectedProjectFileInput.files?.[0];

    if (selectedProjectFile === undefined) {
      return;
    }

    void importSelectedProjectFile(selectedProjectFile, selectedProjectFileInput);
  }

  async function importSelectedProjectFile(
    selectedProjectFile: File,
    selectedProjectFileInput: HTMLInputElement,
  ): Promise<void> {
    try {
      const serializedProject = await selectedProjectFile.text();
      onImportProject(serializedProject);
      setProjectActionErrorMessage(null);
      setProjectActionNotice(copy.importedProject(selectedProjectFile.name));
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    } finally {
      selectedProjectFileInput.value = "";
    }
  }

  return (
    <section aria-label={copy.localProjects} className="local-project-panel">
      <div className="local-project-panel__status">
        <p>
          {copy.currentProject}: <strong>{currentProjectName ?? copy.none}</strong>
        </p>
        {currentProjectMapInstanceName !== null ? (
          <p>
            {copy.currentMap}: <strong>{currentProjectMapInstanceName}</strong>
            {currentProjectMapInstanceCount !== null
              ? ` (${copy.currentMapCount(currentProjectMapInstanceCount)})`
              : null}
          </p>
        ) : null}
        <p>{copy.storedInBrowser}</p>
      </div>
      {storageStatus === "loading" ? (
        <p className="local-project-panel__message" role="status">
          {copy.openingBrowserStorage}
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
          {copy.saveToDevice}
        </button>
        <button
          disabled={!isStorageReady}
          onClick={handleCreateProject}
          type="button"
        >
          {copy.newProject}
        </button>
        <label
          className={`local-project-panel__import${
            isStorageReady ? "" : " local-project-panel__import--disabled"
          }`}
        >
          <span>{copy.importJson}</span>
          <input
            accept="application/json,.json"
            disabled={!isStorageReady}
            onChange={handleImportFileChange}
            type="file"
          />
        </label>
      </div>
      <ul aria-label={copy.savedLocalProjects} className="local-project-panel__list">
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
                <strong>{projectSummary.title}</strong>
                <span>
                  {formatLocalProjectUpdatedAt(projectSummary.updated_at, copy.dateTimeLocale)}
                </span>
                {isCurrentProject ? <span>{copy.current}</span> : null}
              </div>
              {isRenamingProject ? (
                <div className="local-project-panel__rename-form">
                  <label>
                    <span className="sr-only">{copy.newProjectName}</span>
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
                    {copy.applyName}
                  </button>
                  <button
                    onClick={() => setRenamedProjectId(null)}
                    type="button"
                  >
                    {copy.cancelRename}
                  </button>
                </div>
              ) : (
                <div className="local-project-panel__project-actions">
                  <button
                    disabled={!isStorageReady}
                    onClick={() =>
                      handleOpenProject(projectSummary.id, projectSummary.title)
                    }
                    type="button"
                  >
                    {copy.open}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleStartRename(projectSummary)}
                    type="button"
                  >
                    {copy.rename}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleDuplicateProject(projectSummary.id)}
                    type="button"
                  >
                    {copy.duplicate}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleExportProject(projectSummary)}
                    type="button"
                  >
                    {copy.exportJson}
                  </button>
                  <button
                    disabled={!isStorageReady}
                    onClick={(clickEvent) =>
                      handleRequestProjectDeletion(
                        projectSummary.id,
                        clickEvent.currentTarget,
                      )
                    }
                    type="button"
                  >
                    {copy.delete}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {projects.length === 0 ? (
        <p className="local-project-panel__message">
          {copy.emptyState}
        </p>
      ) : null}
      {projectPendingDeletion !== undefined ? (
        <LocalProjectDeleteAlertDialog
          deleteButtonFocusTarget={deleteButtonPendingDeletionRef.current}
          copy={deleteCopy}
          onCancel={() => setProjectIdPendingDeletion(null)}
          onConfirm={handleDeleteProject}
          projectTitle={projectPendingDeletion.title}
        />
      ) : null}
    </section>
  );
}

export function formatLocalProjectUpdatedAt(
  updatedAt: string,
  dateTimeLocale: string,
): string {
  const parsedUpdatedAt = new Date(updatedAt);

  if (updatedAt.trim().length === 0 || Number.isNaN(parsedUpdatedAt.getTime())) {
    throw new Error(
      `Cannot format local project updated_at value ${JSON.stringify(updatedAt)} because it is not a valid timestamp.`,
    );
  }

  return new Intl.DateTimeFormat(dateTimeLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedUpdatedAt);
}

function formatProjectActionError(
  caughtError: unknown,
  localProjectsCopy: LocalProjectsCopy,
): string {
  if (caughtError instanceof Error) {
    return localProjectsCopy.actionFailure(caughtError.message);
  }

  return localProjectsCopy.actionFailure(String(caughtError));
}
