"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { downloadBrowserFile } from "../projects/browser-file-download";
import { createReferenceProjectExportFile } from "../projects/reference-project-export-file";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type {
  LocalProjectDeleteCopy,
  LocalProjectsCopy,
} from "../i18n/save-modal-copy";
import { LocalProjectDeleteAlertDialog } from "./local-project-delete-alert-dialog";
import styles from "./local-project-panel.module.css";

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
  sidebarContent?: ReactNode;
  sidebarFooterContent?: ReactNode;
  mainContent?: ReactNode;
  isProjectListActive?: boolean;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => Promise<void>;
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
  sidebarContent = null,
  sidebarFooterContent = null,
  mainContent = null,
  isProjectListActive = true,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [renamedProjectId, setRenamedProjectId] = useState<string | null>(null);
  const [requestedProjectName, setRequestedProjectName] = useState("");
  const [projectIdPendingDeletion, setProjectIdPendingDeletion] = useState<
    string | null
  >(null);
  const [isSavingCurrentMap, setIsSavingCurrentMap] = useState(false);
  const isSavingCurrentMapReference = useRef(false);
  const deleteButtonPendingDeletionRef = useRef<HTMLButtonElement | null>(null);
  const isStorageReady = storageStatus === "ready";
  const projectPendingDeletion = projects.find(
    (projectSummary) => projectSummary.id === projectIdPendingDeletion,
  );
  const filteredProjectSummaries = filterLocalProjectSummaries(
    projects,
    searchQuery,
  );
  const moreActionsLabel =
    copy.dateTimeLocale === "zh-CN" ? "更多操作" : "More actions";

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

  async function handleSaveCurrentMap(): Promise<void> {
    if (isSavingCurrentMapReference.current) return;
    isSavingCurrentMapReference.current = true;
    setIsSavingCurrentMap(true);
    try {
      await onSaveCurrentMap();
      setProjectActionErrorMessage(null);
      setProjectActionNotice(copy.savedToBrowser);
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    } finally {
      isSavingCurrentMapReference.current = false;
      setIsSavingCurrentMap(false);
    }
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
    <section
      aria-label={copy.localProjects}
      className={`local-project-panel ${styles.panel}`}
    >
      <div className={styles.layout} data-local-project-layout="columns">
        <aside
          className={styles.sidebar}
          data-local-project-region="sidebar"
        >
          <div className={`local-project-panel__primary-actions ${styles.sidebarActions}`}>
            <button
              disabled={!isStorageReady}
              onClick={handleCreateProject}
              type="button"
            >
              {copy.newProject}
            </button>
          </div>
          {sidebarContent}
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
          <details className={styles.deviceTools}>
            <summary>{copy.deviceTools}</summary>
            <div className={styles.deviceToolsBody}>
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
              <div className={`local-project-panel__primary-actions ${styles.sidebarActions}`}>
                <button
                  aria-busy={isSavingCurrentMap}
                  disabled={!isStorageReady || isSavingCurrentMap}
                  onClick={() => void handleSaveCurrentMap()}
                  type="button"
                >
                  {copy.saveToDevice}
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
            </div>
          </details>
          {sidebarFooterContent}
        </aside>
        <div className={styles.main} data-local-project-region="main">
          <div hidden={!isProjectListActive}>
            <label className={styles.searchControl}>
              <svg
                aria-hidden="true"
                className={styles.searchIcon}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" strokeWidth="1.8" />
                <path d="m15.7 15.7 4.1 4.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
              </svg>
              <input
                aria-label={copy.searchProjects}
                autoComplete="off"
                onChange={(changeEvent) => setSearchQuery(changeEvent.currentTarget.value)}
                placeholder={copy.searchProjects}
                type="search"
                value={searchQuery}
              />
            </label>
            {filteredProjectSummaries.length > 0 ? (
              <ul aria-label={copy.savedLocalProjects} className={styles.projectGrid}>
                {filteredProjectSummaries.map((projectSummary) => {
                  const isCurrentProject = projectSummary.id === currentProjectId;
                  const isRenamingProject = projectSummary.id === renamedProjectId;

                  return (
                    <li
                      className={styles.projectCard}
                      data-current-project={isCurrentProject}
                      data-project-id={projectSummary.id}
                      key={projectSummary.id}
                    >
                      <div className={styles.projectPreview}>
                        {projectSummary.activeMapThumbnailDataUrl ? (
                          <img
                            alt={copy.mapPreviewAlt(projectSummary.title)}
                            className={styles.projectPreviewImage}
                            src={projectSummary.activeMapThumbnailDataUrl}
                          />
                        ) : (
                          <div className={styles.projectPreviewEmpty}>
                            <span aria-hidden="true" className={styles.previewMapIcon}>
                              <svg fill="none" viewBox="0 0 40 40">
                                <path d="m5 11 10-5 10 5 10-5v23l-10 5-10-5-10 5V11Z" />
                                <path d="M15 6v23M25 11v23" />
                                <path d="m8 15 4-2M8 21l4-2M28 14l4-2M28 20l4-2" />
                              </svg>
                            </span>
                            <span>{copy.noMapPreview}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.projectCardBody}>
                        <div className={styles.projectCardHeading}>
                          <div className={styles.projectCardTitleGroup}>
                            <strong>{projectSummary.title}</strong>
                            {isCurrentProject ? (
                              <span className={styles.currentBadge}>{copy.current}</span>
                            ) : null}
                          </div>
                          {projectSummary.mapCount !== undefined ? (
                            <span className={styles.projectMapCount}>
                              {copy.projectMapCount(projectSummary.mapCount)}
                            </span>
                          ) : null}
                        </div>
                        <span className={styles.projectUpdatedAt}>
                          {formatLocalProjectUpdatedAt(
                            projectSummary.updated_at,
                            copy.dateTimeLocale,
                          )}
                        </span>
                        {isRenamingProject ? (
                          <div className={`local-project-panel__rename-form ${styles.renameForm}`}>
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
                          <div className={styles.projectCardActions}>
                            <button
                              className={styles.openProjectButton}
                              data-project-action="open"
                              disabled={!isStorageReady}
                              onClick={() =>
                                handleOpenProject(projectSummary.id, projectSummary.title)
                              }
                              type="button"
                            >
                              {copy.open}
                            </button>
                            <button
                              data-project-action="rename"
                              disabled={!isStorageReady}
                              onClick={() => handleStartRename(projectSummary)}
                              type="button"
                            >
                              {copy.rename}
                            </button>
                            <details className={styles.moreActions}>
                              <summary
                                aria-label={`${moreActionsLabel}: ${projectSummary.title}`}
                              >
                                {moreActionsLabel}
                              </summary>
                              <div className={styles.moreActionsPanel}>
                                <button
                                  data-project-action="duplicate"
                                  disabled={!isStorageReady}
                                  onClick={() => handleDuplicateProject(projectSummary.id)}
                                  type="button"
                                >
                                  {copy.duplicate}
                                </button>
                                <button
                                  data-project-action="export"
                                  disabled={!isStorageReady}
                                  onClick={() => handleExportProject(projectSummary)}
                                  type="button"
                                >
                                  {copy.exportJson}
                                </button>
                                <button
                                  data-project-action="delete"
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
                            </details>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : projects.length > 0 && searchQuery.trim().length > 0 ? (
              <p className="local-project-panel__message" role="status">
                {copy.noSearchResults}
              </p>
            ) : null}
            {projects.length === 0 ? (
              <p className="local-project-panel__message">
                {copy.emptyState}
              </p>
            ) : null}
          </div>
          {mainContent}
        </div>
      </div>
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

export function filterLocalProjectSummaries(
  projectSummaries: readonly ReferenceProjectSummary[],
  searchQuery: string,
): readonly ReferenceProjectSummary[] {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  if (normalizedSearchQuery.length === 0) return projectSummaries;

  return projectSummaries.filter((projectSummary) =>
    projectSummary.title.toLowerCase().includes(normalizedSearchQuery),
  );
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
