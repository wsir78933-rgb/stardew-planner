"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { downloadBrowserFile } from "../projects/browser-file-download";
import { createReferenceProjectExportFile } from "../projects/reference-project-export-file";
import {
  createLocalProjectFolderStore,
  getLocalProjectFolderId,
  myPlansFolderId,
  type LocalProjectFolderState,
} from "../projects/local-project-folder-store";
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
  toolsViewContent?: ReactNode;
  isProjectListActive?: boolean;
  isToolsViewActive?: boolean;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => Promise<void>;
  onActivateProjectList: () => void;
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
  toolsViewContent = null,
  isProjectListActive = true,
  isToolsViewActive = false,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onExportProject,
  onImportProject,
  onOpenProject,
  onRenameProject,
  onSaveCurrentMap,
  onActivateProjectList,
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
  const [folderState, setFolderState] = useState<LocalProjectFolderState>({
    folders: [],
    folderIdByProjectId: {},
  });
  const [folderStorageErrorMessage, setFolderStorageErrorMessage] = useState<
    string | null
  >(null);
  const [isFolderStorageReady, setIsFolderStorageReady] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(myPlansFolderId);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [requestedFolderName, setRequestedFolderName] = useState("");
  const [isSavingCurrentMap, setIsSavingCurrentMap] = useState(false);
  const isSavingCurrentMapReference = useRef(false);
  const deleteButtonPendingDeletionRef = useRef<HTMLButtonElement | null>(null);
  const isStorageReady = storageStatus === "ready";
  const localProjectFolders = [
    { id: myPlansFolderId, name: copy.myPlansFolder },
    ...folderState.folders,
  ];
  const projectCountByFolderId = new Map<string, number>(
    localProjectFolders.map((folder) => [folder.id, 0]),
  );
  for (const projectSummary of projects) {
    const folderId = getLocalProjectFolderId(folderState, projectSummary.id);
    projectCountByFolderId.set(
      folderId,
      (projectCountByFolderId.get(folderId) ?? 0) + 1,
    );
  }
  const projectsInSelectedFolder = projects.filter(
    (projectSummary) =>
      getLocalProjectFolderId(folderState, projectSummary.id) === selectedFolderId,
  );
  const projectPendingDeletion = projects.find(
    (projectSummary) => projectSummary.id === projectIdPendingDeletion,
  );
  const filteredProjectSummaries = filterLocalProjectSummaries(
    projectsInSelectedFolder,
    searchQuery,
  );
  const canManageFolders =
    isStorageReady
    && isFolderStorageReady
    && folderStorageErrorMessage === null;
  const moreActionsLabel =
    copy.dateTimeLocale === "zh-CN" ? "更多操作" : "More actions";

  useEffect(() => {
    try {
      const localProjectFolderStore = createLocalProjectFolderStore();
      setFolderState(localProjectFolderStore.load());
      setFolderStorageErrorMessage(null);
    } catch (caughtError) {
      setFolderStorageErrorMessage(formatProjectActionError(caughtError, copy));
    } finally {
      setIsFolderStorageReady(true);
    }
  }, []);

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
    runProjectAction(() => {
      onCreateProject();
      onActivateProjectList();
    }, copy.createdProject);
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

  function handleCreateFolder(): void {
    runProjectAction(() => {
      const nextFolderState = createLocalProjectFolderStore().createFolder(
        requestedFolderName,
      );
      const createdFolder = nextFolderState.folders.at(-1);
      if (createdFolder === undefined) {
        throw new Error(
          "Cannot select the newly created local project folder because the folder list is empty.",
        );
      }

      setFolderState(nextFolderState);
      setSelectedFolderId(createdFolder.id);
      setRequestedFolderName("");
      setIsCreatingFolder(false);
      onActivateProjectList();
    }, copy.folderCreated);
  }

  function handleMoveProjectToFolder(
    projectId: string,
    folderId: string,
    folderName: string,
    clickEvent: MouseEvent<HTMLButtonElement>,
  ): void {
    runProjectAction(() => {
      setFolderState(
        createLocalProjectFolderStore().moveProject(projectId, folderId),
      );
    }, copy.folderMoved(folderName));
    clickEvent.currentTarget.closest("details")?.removeAttribute("open");
  }

  function handleSelectFolder(folderId: string): void {
    setSelectedFolderId(folderId);
    setSearchQuery("");
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
    onActivateProjectList();
  }

  function handleCreateFolderFormSubmit(
    submitEvent: FormEvent<HTMLFormElement>,
  ): void {
    submitEvent.preventDefault();
    handleCreateFolder();
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
          {sidebarContent !== null ? (
            <div className={styles.sidebarNavigationSlot}>{sidebarContent}</div>
          ) : null}
          <section aria-label={copy.folderGroupLabel} className={styles.folderSection}>
            <p className={styles.folderGroupLabel}>{copy.folderGroupLabel}</p>
            <nav aria-label={copy.folderGroupLabel}>
              <ul className={styles.folderList}>
                {localProjectFolders.map((folder) => (
                  <li key={folder.id}>
                    <button
                      aria-pressed={selectedFolderId === folder.id}
                      className={styles.folderButton}
                      data-local-project-folder-id={folder.id}
                      disabled={!canManageFolders}
                      onClick={() => handleSelectFolder(folder.id)}
                      type="button"
                    >
                      <span>{folder.name}</span>
                      <span className={styles.folderCount}>
                        {projectCountByFolderId.get(folder.id) ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            {isCreatingFolder ? (
              <form
                className={styles.createFolderForm}
                onSubmit={handleCreateFolderFormSubmit}
              >
                <label htmlFor="local-project-new-folder">
                  {copy.newFolderName}
                </label>
                <input
                  autoComplete="off"
                  autoFocus
                  id="local-project-new-folder"
                  maxLength={40}
                  onChange={(changeEvent) =>
                    setRequestedFolderName(changeEvent.currentTarget.value)
                  }
                  required
                  type="text"
                  value={requestedFolderName}
                />
                <div className={styles.createFolderActions}>
                  <button disabled={!canManageFolders} type="submit">
                    {copy.createFolder}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingFolder(false);
                      setRequestedFolderName("");
                    }}
                    type="button"
                  >
                    {copy.cancelCreateFolder}
                  </button>
                </div>
              </form>
            ) : (
              <button
                className={styles.newFolderButton}
                disabled={!canManageFolders}
                onClick={() => {
                  setProjectActionErrorMessage(null);
                  setProjectActionNotice(null);
                  setIsCreatingFolder(true);
                }}
                type="button"
              >
                {copy.newFolder}
              </button>
            )}
          </section>
          {folderStorageErrorMessage !== null ? (
            <p className="local-project-panel__error" role="alert">
              {folderStorageErrorMessage}
            </p>
          ) : null}
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
          {sidebarFooterContent !== null ? (
            <div className={styles.sidebarFooterSlot}>{sidebarFooterContent}</div>
          ) : null}
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
                        <div className={styles.projectCardTitleGroup}>
                          <strong>{projectSummary.title}</strong>
                          {isCurrentProject ? (
                            <span className={styles.currentBadge}>{copy.current}</span>
                          ) : null}
                        </div>
                        {projectSummary.mapCount !== undefined ? (
                          <p className={styles.projectMapCount}>
                            {copy.projectMapCount(projectSummary.mapCount)}
                          </p>
                        ) : null}
                        <p className={styles.projectUpdatedAt}>
                          {formatLocalProjectUpdatedAt(
                            projectSummary.updated_at,
                            copy.dateTimeLocale,
                          )}
                        </p>
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
                              disabled={!isStorageReady || isCurrentProject}
                              onClick={() =>
                                handleOpenProject(projectSummary.id, projectSummary.title)
                              }
                              type="button"
                            >
                              {copy.open}
                            </button>
                            <button
                              aria-label={`${copy.rename}: ${projectSummary.title}`}
                              className={styles.iconAction}
                              data-project-action="rename"
                              disabled={!isStorageReady}
                              onClick={() => handleStartRename(projectSummary)}
                              type="button"
                            >
                              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                                <path d="M4 20h4L19 9l-4-4L4 16v4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
                                <path d="m13 7 4 4" stroke="currentColor" strokeWidth="1.8" />
                              </svg>
                            </button>
                            <details className={styles.moreActions}>
                              <summary
                                aria-label={`${moreActionsLabel}: ${projectSummary.title}`}
                                className={styles.iconAction}
                              >
                                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="6" cy="12" r="1.7" />
                                  <circle cx="12" cy="12" r="1.7" />
                                  <circle cx="18" cy="12" r="1.7" />
                                </svg>
                              </summary>
                              <div className={styles.moreActionsPanel}>
                                <div
                                  aria-label={copy.moveToFolder}
                                  className={styles.folderActionsGroup}
                                  role="group"
                                >
                                  <p className={styles.folderActionsLabel}>
                                    {copy.moveToFolder}
                                  </p>
                                  <div className={styles.folderActionsPanel}>
                                    {localProjectFolders.map((folder) => (
                                      <button
                                        aria-current={
                                          getLocalProjectFolderId(
                                            folderState,
                                            projectSummary.id,
                                          ) === folder.id
                                            ? "true"
                                            : undefined
                                        }
                                        data-project-action="move-folder"
                                        data-target-folder-id={folder.id}
                                        disabled={
                                          !canManageFolders
                                          || getLocalProjectFolderId(
                                            folderState,
                                            projectSummary.id,
                                          ) === folder.id
                                        }
                                        key={folder.id}
                                        onClick={(clickEvent) =>
                                          handleMoveProjectToFolder(
                                            projectSummary.id,
                                            folder.id,
                                            folder.name,
                                            clickEvent,
                                          )
                                        }
                                        type="button"
                                      >
                                        {folder.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
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
            ) : searchQuery.trim().length > 0 ? (
              <p className="local-project-panel__message" role="status">
                {copy.noSearchResults}
              </p>
            ) : projects.length === 0 ? (
              <p className="local-project-panel__message">
                {copy.emptyState}
              </p>
            ) : null}
            {projects.length > 0
            && projectsInSelectedFolder.length === 0
            && searchQuery.trim().length === 0 ? (
              <p className="local-project-panel__message">
                {copy.emptyFolder}
              </p>
            ) : null}
          </div>
          <div
            className={styles.toolsView}
            data-library-view="tools"
            hidden={!isToolsViewActive}
          >
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
            {toolsViewContent}
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
