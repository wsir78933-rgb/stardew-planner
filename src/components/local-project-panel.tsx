"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type ToggleEvent,
} from "react";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { downloadBrowserFile } from "../projects/browser-file-download";
import { createReferenceProjectExportFile } from "../projects/reference-project-export-file";
import type { ReferenceProjectFolder } from "../reference-runtime/local-project-api";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type {
  LocalProjectDeleteCopy,
  LocalProjectsCopy,
} from "../i18n/save-modal-copy";
import { LocalProjectDeleteAlertDialog } from "./local-project-delete-alert-dialog";
import {
  readLibraryPopoverDomId,
  useLocalProjectPopover,
} from "./use-local-project-popover";
import styles from "./local-project-panel.module.css";

export type LocalProjectStorageStatus = "loading" | "ready" | "error";

export type LocalProjectFolderController = Readonly<{
  createFolder: (folderName: string) => ReferenceProjectFolder;
  getState: () => Readonly<{
    projectSummaries: readonly ReferenceProjectSummary[];
  }>;
  moveProjectToFolder: (projectId: string, folderId: string | null) => void;
  renameFolder: (folderId: string, folderName: string) => ReferenceProjectFolder;
}>;

type LibraryChromeCopy = Readonly<{
  blankFolderName: (folderName: string) => string;
  createdFolder: string;
  emptyFolder: string;
  folderNameLabel: string;
  importGameSave: string;
  moreActions: string;
  move: string;
  movedProject: string;
  myPlans: string;
  newFolder: string;
  projectGroups: string;
  renameFolder: string;
  tools: string;
}>;

type LocalProjectPanelProperties = Readonly<{
  copy: LocalProjectsCopy;
  currentProjectId: string | null;
  currentProjectName: string | null;
  currentProjectMapInstanceCount?: number | null;
  currentProjectMapInstanceName?: string | null;
  deleteCopy: LocalProjectDeleteCopy;
  folders?: readonly ReferenceProjectFolder[];
  gameSaveContent?: ReactNode;
  isImportGameSaveOpen?: boolean;
  isToolsOpen?: boolean;
  onCreateProject: () => void | Promise<void>;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void | Promise<void>;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void | Promise<void>;
  onOpenImportGameSave?: () => void;
  onOpenProject: (projectId: string) => void | Promise<void>;
  onOpenTools?: () => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  projects: readonly ReferenceProjectSummary[];
  storageErrorMessage: string | null;
  storageStatus: LocalProjectStorageStatus;
  toolsContent?: ReactNode;
  workspaceController?: LocalProjectFolderController;
}>;

export function LocalProjectPanel({
  copy,
  currentProjectId,
  currentProjectName,
  currentProjectMapInstanceCount = null,
  currentProjectMapInstanceName = null,
  deleteCopy,
  folders = [],
  gameSaveContent = null,
  isImportGameSaveOpen = false,
  isToolsOpen = false,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onExportProject,
  onImportProject,
  onOpenImportGameSave,
  onOpenProject,
  onOpenTools,
  onRenameProject,
  projects,
  storageErrorMessage,
  storageStatus,
  toolsContent = null,
  workspaceController,
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
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const isCreatingProjectReference = useRef(false);
  const deleteButtonPendingDeletionRef = useRef<HTMLButtonElement | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [requestedFolderName, setRequestedFolderName] = useState("");
  const [projectGroupsOpen, setProjectGroupsOpen] = useState(false);
  const [renamedFolderId, setRenamedFolderId] = useState<string | null>(null);
  const [requestedFolderRename, setRequestedFolderRename] = useState("");
  const ignoreFolderRenameBlurRef = useRef(false);
  const folderRenameInputRef = useRef<HTMLInputElement | null>(null);
  useLayoutEffect(() => {
    if (renamedFolderId === null) return;
    const folderRenameInput = folderRenameInputRef.current;
    if (folderRenameInput === null) {
      throw new Error(
        `Cannot focus the folder rename field because the input for ${JSON.stringify(renamedFolderId)} is missing.`,
      );
    }
    folderRenameInput.focus();
    if (typeof folderRenameInput.select !== "function") {
      throw new Error(
        `Cannot select folder ${JSON.stringify(renamedFolderId)} because select is ${JSON.stringify(folderRenameInput.select)}.`,
      );
    }
    folderRenameInput.select();
  }, [renamedFolderId]);
  const libraryPopover = useLocalProjectPopover();
  const libraryChromeCopy = readLibraryChromeCopy(copy.dateTimeLocale);
  const isStorageReady = storageStatus === "ready";
  const projectPendingDeletion = projects.find(
    (projectSummary) => projectSummary.id === projectIdPendingDeletion,
  );
  const selectedFolderIsMissing = selectedFolderId !== null
    && !folders.some((projectFolder) => projectFolder.id === selectedFolderId);
  const projectsInSelectedFolder = filterLocalProjectSummaries(
    projects,
    "",
    selectedFolderId,
  );
  const filteredProjectSummaries = filterLocalProjectSummaries(
    projects,
    searchQuery,
    selectedFolderId,
  );
  const myPlansCount = countLocalProjectsInFolder(projects, null);

  function runProjectAction(
    action: () => void | Promise<void>,
    successMessage: string,
  ): void {
    let actionResult: void | Promise<void>;
    try {
      actionResult = action();
    } catch (caughtError) {
      recordProjectActionFailure(caughtError);
      return;
    }
    if (isPendingLocalProjectAction(actionResult)) {
      void finishPendingProjectAction(actionResult, successMessage);
      return;
    }
    recordProjectActionSuccess(successMessage);
  }

  function recordProjectActionSuccess(successMessage: string): void {
    setProjectActionErrorMessage(null);
    setProjectActionNotice(successMessage);
  }

  function recordProjectActionFailure(caughtError: unknown): void {
    setProjectActionNotice(null);
    setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
  }

  async function finishPendingProjectAction(
    pendingProjectAction: Promise<void>,
    successMessage: string,
  ): Promise<void> {
    try {
      await pendingProjectAction;
      recordProjectActionSuccess(successMessage);
    } catch (caughtError) {
      recordProjectActionFailure(caughtError);
    }
  }

  async function handleCreateProject(): Promise<void> {
    if (isCreatingProjectReference.current) return;
    isCreatingProjectReference.current = true;
    setIsCreatingProject(true);
    try {
      const folderController = selectedFolderId === null
        ? workspaceController
        : requireLocalProjectFolderController(
          workspaceController,
          `move the new project into folder ${JSON.stringify(selectedFolderId)}`,
        );
      const projectIdsBeforeCreate = readProjectIds(
        folderController === undefined
          ? projects
          : folderController.getState().projectSummaries,
      );
      await onCreateProject();
      if (selectedFolderId !== null) {
        if (folderController === undefined) {
          throw new Error(
            `Cannot move the new project into folder ${JSON.stringify(selectedFolderId)} because workspaceController is missing.`,
          );
        }
        const createdProjectId = readCreatedProjectId(
          projectIdsBeforeCreate,
          folderController.getState().projectSummaries,
          selectedFolderId,
        );
        folderController.moveProjectToFolder(createdProjectId, selectedFolderId);
      }
      setProjectActionErrorMessage(null);
      setProjectActionNotice(copy.createdProject);
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    } finally {
      isCreatingProjectReference.current = false;
      setIsCreatingProject(false);
    }
  }

  function handleOpenProject(projectId: string, projectName: string): void {
    runProjectAction(() => onOpenProject(projectId), copy.openedProject(projectName));
  }

  function handleStartRename(projectSummary: ReferenceProjectSummary): void {
    libraryPopover.close();
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

  function handleDownloadProjectImage(
    projectSummary: ReferenceProjectSummary,
  ): void {
    runProjectAction(() => {
      const previewSource = readLocalProjectPreviewSource(projectSummary);
      if (previewSource === null) {
        throw new Error(
          `Cannot download preview image for project ${JSON.stringify(projectSummary.id)} because it has no saved preview.`,
        );
      }
      const blob = convertWebpDataUrlToBlob(previewSource);
      const filename = createProjectImageFilename(projectSummary.title);
      downloadBrowserFile({ blob, filename });
    }, copy.downloadedImage(projectSummary.title));
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
      await onImportProject(serializedProject);
      setProjectActionErrorMessage(null);
      setProjectActionNotice(copy.importedProject(selectedProjectFile.name));
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    } finally {
      selectedProjectFileInput.value = "";
    }
  }

  function handleSelectFolder(folderId: string | null): void {
    if (
      folderId !== null
      && !folders.some((projectFolder) => projectFolder.id === folderId)
    ) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(copy.actionFailure(
        readLibraryOperationFailure(copy.dateTimeLocale, {
          en: `Cannot select folder ${JSON.stringify(folderId)} because it is not in the folder list. Received folder IDs: ${JSON.stringify(folders.map((projectFolder) => projectFolder.id))}.`,
          ru: `Нельзя выбрать папку ${JSON.stringify(folderId)}: её нет в списке папок. Полученные идентификаторы: ${JSON.stringify(folders.map((projectFolder) => projectFolder.id))}.`,
        }),
      ));
      return;
    }

    setSelectedFolderId(folderId);
    libraryPopover.close();
    setProjectActionErrorMessage(null);
  }

  function handleCreateFolder(): void {
    const folderName = requestedFolderName.trim();
    if (folderName.length === 0) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(copy.actionFailure(
        readLibraryOperationFailure(copy.dateTimeLocale, {
          en: `Folder name must not be empty. Received: ${JSON.stringify(requestedFolderName)}.`,
          ru: `Название папки не должно быть пустым. Получено: ${JSON.stringify(requestedFolderName)}.`,
        }),
      ));
      return;
    }

    runProjectAction(() => {
      const folderController = requireLocalProjectFolderController(
        workspaceController,
        `create folder ${JSON.stringify(folderName)}`,
      );
      const createdFolder = folderController.createFolder(folderName);
      if (typeof createdFolder.id !== "string" || createdFolder.id.trim().length === 0) {
        throw new Error(
          `Cannot select created folder ${JSON.stringify(folderName)} because its id is ${JSON.stringify(createdFolder.id)}.`,
        );
      }
      setSelectedFolderId(createdFolder.id);
      setRequestedFolderName("");
    }, libraryChromeCopy.createdFolder);
  }

  function handleProjectGroupsToggle(
    toggleEvent: ToggleEvent<HTMLDetailsElement>,
  ): void {
    const nextOpen = toggleEvent.currentTarget.open;
    if (typeof nextOpen !== "boolean") {
      throw new Error(
        `Cannot update project groups because details.open is ${JSON.stringify(nextOpen)}.`,
      );
    }
    setProjectGroupsOpen((currentOpen) => (
      currentOpen === nextOpen ? currentOpen : nextOpen
    ));
  }

  function handleStartFolderRename(projectFolder: ReferenceProjectFolder): void {
    if (!isStorageReady) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(copy.actionFailure(
        readLibraryOperationFailure(copy.dateTimeLocale, {
          en: `Cannot rename folder ${JSON.stringify(projectFolder.id)} because storage status is ${JSON.stringify(storageStatus)}.`,
          ru: `Нельзя переименовать папку ${JSON.stringify(projectFolder.id)}: состояние хранилища ${JSON.stringify(storageStatus)}.`,
        }),
      ));
      return;
    }

    ignoreFolderRenameBlurRef.current = false;
    setRenamedFolderId(projectFolder.id);
    setRequestedFolderRename(projectFolder.name);
    setProjectActionErrorMessage(null);
    setProjectActionNotice(null);
    libraryPopover.close();
  }

  function handleFolderRenameKeyDown(
    keyboardEvent: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== "Escape") return;
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
    if (keyboardEvent.repeat) return;

    const folderRenameInput = keyboardEvent.currentTarget;
    if (typeof folderRenameInput.value !== "string") {
      throw new Error(
        `Cannot rename the folder because the input value is ${JSON.stringify(folderRenameInput.value)}.`,
      );
    }
    if (typeof folderRenameInput.blur !== "function") {
      throw new Error(
        `Cannot leave the folder rename field because blur is ${JSON.stringify(folderRenameInput.blur)}.`,
      );
    }
    if (renamedFolderId === null) {
      throw new Error(
        `Cannot handle ${JSON.stringify(keyboardEvent.key)} because no folder rename is active.`,
      );
    }

    ignoreFolderRenameBlurRef.current = true;
    if (keyboardEvent.key === "Escape") {
      setRenamedFolderId(null);
      setProjectActionErrorMessage(null);
    } else {
      commitRequestedFolderRename(renamedFolderId, folderRenameInput.value);
    }
    folderRenameInput.blur();
  }

  function handleFolderRenameBlur(
    focusEvent: FocusEvent<HTMLInputElement>,
  ): void {
    if (ignoreFolderRenameBlurRef.current) {
      ignoreFolderRenameBlurRef.current = false;
      return;
    }
    if (typeof focusEvent.currentTarget.value !== "string") {
      throw new Error(
        `Cannot rename the folder because the input value is ${JSON.stringify(focusEvent.currentTarget.value)}.`,
      );
    }
    if (renamedFolderId === null) {
      throw new Error(
        "Cannot save the folder rename because no folder rename is active.",
      );
    }
    commitRequestedFolderRename(renamedFolderId, focusEvent.currentTarget.value);
  }

  function commitRequestedFolderRename(folderId: string, requestedName: string): void {
    const projectFolder = readCustomProjectFolder(folders, folderId);
    const folderName = requestedName.trim();
    if (folderName.length === 0) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(libraryChromeCopy.blankFolderName(requestedName));
      return;
    }
    if (folderName === projectFolder.name) {
      setRenamedFolderId(null);
      setProjectActionErrorMessage(null);
      return;
    }

    try {
      const folderController = requireLocalProjectFolderController(
        workspaceController,
        `rename folder ${JSON.stringify(folderId)} to ${JSON.stringify(folderName)}`,
      );
      const renamedFolder = renameCustomProjectFolder(
        folderController,
        folderId,
        folderName,
      );
      if (renamedFolder.id !== folderId || renamedFolder.name !== folderName) {
        throw new Error(
          `Cannot rename folder ${JSON.stringify(folderId)} to ${JSON.stringify(folderName)} because renameFolder returned ${JSON.stringify(renamedFolder)}.`,
        );
      }
      setRenamedFolderId(null);
      setProjectActionErrorMessage(null);
      setProjectActionNotice(null);
    } catch (caughtError) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(formatProjectActionError(caughtError, copy));
    }
  }

  function handleMoveProject(projectId: string, folderId: string | null): void {
    runProjectAction(() => {
      const folderController = requireLocalProjectFolderController(
        workspaceController,
        `move project ${JSON.stringify(projectId)} into folder ${JSON.stringify(folderId)}`,
      );
      if (
        folderId !== null
        && !folders.some((projectFolder) => projectFolder.id === folderId)
      ) {
        throw new Error(
          `Cannot move project ${JSON.stringify(projectId)} into folder ${JSON.stringify(folderId)} because it is not in the folder list. Received folder IDs: ${JSON.stringify(folders.map((projectFolder) => projectFolder.id))}.`,
        );
      }
      folderController.moveProjectToFolder(projectId, folderId);
      libraryPopover.close();
    }, libraryChromeCopy.movedProject);
  }

  function handleOpenImportGameSave(): void {
    if (onOpenImportGameSave === undefined) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(copy.actionFailure(
        readLibraryOperationFailure(copy.dateTimeLocale, {
          en: "Cannot open Import Game Save because onOpenImportGameSave is missing.",
          ru: "Нельзя открыть импорт сохранения: не передан onOpenImportGameSave.",
        }),
      ));
      return;
    }

    onOpenImportGameSave();
  }

  function handleOpenTools(): void {
    if (onOpenTools === undefined) {
      setProjectActionNotice(null);
      setProjectActionErrorMessage(copy.actionFailure(
        readLibraryOperationFailure(copy.dateTimeLocale, {
          en: "Cannot open Tools because onOpenTools is missing.",
          ru: "Нельзя открыть инструменты: не передан onOpenTools.",
        }),
      ));
      return;
    }

    onOpenTools();
  }

  const visibleProjectList = filteredProjectSummaries.length > 0 ? (
    <ul aria-label={copy.savedLocalProjects} className={styles.projectGrid}>
      {filteredProjectSummaries.map((projectSummary) => {
        const isCurrentProject = projectSummary.id === currentProjectId;
        const isRenamingProject = projectSummary.id === renamedProjectId;
        const isMoreOpen = libraryPopover.isOpen("more", projectSummary.id);
        const isChoosingMoveDestination = libraryPopover.isOpen("move", projectSummary.id);
        const moreMenuId = readLibraryPopoverDomId("more", projectSummary.id);
        const moveMenuId = readLibraryPopoverDomId("move", projectSummary.id);
        const previewSource = readLocalProjectPreviewSource(projectSummary);
        const downloadLabel = previewSource !== null
          ? copy.downloadImage(projectSummary.title)
          : copy.noDownloadablePreview;

        return (
          <li
            className={styles.projectCard}
            data-current-project={isCurrentProject}
            data-project-id={projectSummary.id}
            key={projectSummary.id}
          >
            <div className={styles.projectPreview}>
              {previewSource !== null ? (
                <img
                  alt={copy.mapPreviewAlt(projectSummary.title)}
                  className={styles.projectPreviewImage}
                  src={previewSource}
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
                <strong>{projectSummary.title}</strong>
                {isCurrentProject ? (
                  <span className={styles.currentBadge} data-current-placement="title">
                    {copy.current}
                  </span>
                ) : null}
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
                    aria-controls={isChoosingMoveDestination ? moveMenuId : undefined}
                    aria-expanded={isChoosingMoveDestination}
                    aria-label={libraryChromeCopy.move}
                    className={styles.iconActionButton}
                    data-project-action="move"
                    disabled={!isStorageReady}
                    onClick={(clickEvent) => {
                      libraryPopover.toggle(
                        "move",
                        projectSummary.id,
                        readPopoverTriggerButton(clickEvent),
                      );
                    }}
                    type="button"
                  >
                    <MoveIcon />
                  </button>
                  <div className={styles.moreActions}>
                    <button
                      aria-controls={isMoreOpen ? moreMenuId : undefined}
                      aria-expanded={isMoreOpen}
                      aria-label={libraryChromeCopy.moreActions}
                      className={styles.moreActionsSummary}
                      data-project-action="more"
                      onClick={(clickEvent) => {
                        libraryPopover.toggle(
                          "more",
                          projectSummary.id,
                          readPopoverTriggerButton(clickEvent),
                        );
                      }}
                      type="button"
                    >
                      <MoreIcon />
                    </button>
                    {isMoreOpen ? (
                      <div
                        className={styles.moreActionsMenu}
                        id={moreMenuId}
                        ref={libraryPopover.assignMorePopoverElement}
                      >
                        <button
                          data-project-action="rename"
                          disabled={!isStorageReady}
                          onClick={() => handleStartRename(projectSummary)}
                          type="button"
                        >
                          {copy.rename}
                        </button>
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
                          className={styles.dangerAction}
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
                    ) : null}
                  </div>
                  <button
                    aria-label={downloadLabel}
                    className={styles.iconActionButton}
                    data-project-action="download-image"
                    disabled={!isStorageReady || previewSource === null}
                    onClick={() => handleDownloadProjectImage(projectSummary)}
                    title={downloadLabel}
                    type="button"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              )}
              {isChoosingMoveDestination ? (
                <div
                  aria-label={libraryChromeCopy.move}
                  className={styles.moveDestinations}
                  id={moveMenuId}
                  ref={libraryPopover.assignMovePopoverElement}
                  role="group"
                >
                  <button
                    disabled={!isStorageReady}
                    onClick={() => handleMoveProject(projectSummary.id, null)}
                    type="button"
                  >
                    {libraryChromeCopy.myPlans}
                  </button>
                  {folders.map((projectFolder) => (
                    <button
                      disabled={!isStorageReady}
                      key={projectFolder.id}
                      onClick={() => handleMoveProject(projectSummary.id, projectFolder.id)}
                      type="button"
                    >
                      {projectFolder.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  ) : null;

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
          {selectedFolderIsMissing ? (
            <p className="local-project-panel__error" role="alert">
              {copy.actionFailure(
                readLibraryOperationFailure(copy.dateTimeLocale, {
                  en: `Cannot show folder ${JSON.stringify(selectedFolderId)} because it is not in the folder list. Received folder IDs: ${JSON.stringify(folders.map((projectFolder) => projectFolder.id))}.`,
                  ru: `Нельзя показать папку ${JSON.stringify(selectedFolderId)}: её нет в списке папок. Полученные идентификаторы: ${JSON.stringify(folders.map((projectFolder) => projectFolder.id))}.`,
                }),
              )}
            </p>
          ) : null}
          {projectActionNotice !== null ? (
            <p className="local-project-panel__message" role="status">
              {projectActionNotice}
            </p>
          ) : null}
          <div className={`local-project-panel__primary-actions ${styles.sidebarActions}`}>
            <button
              aria-busy={isCreatingProject}
              disabled={!isStorageReady || isCreatingProject}
              onClick={() => void handleCreateProject()}
              type="button"
            >
              {copy.newProject}
            </button>
            <button
              aria-pressed={isImportGameSaveOpen}
              disabled={!isStorageReady}
              onClick={handleOpenImportGameSave}
              type="button"
            >
              {libraryChromeCopy.importGameSave}
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
          <nav aria-label={libraryChromeCopy.projectGroups} className={styles.folderList}>
            <details
              className={styles.projectGroups}
              onToggle={handleProjectGroupsToggle}
              open={projectGroupsOpen}
            >
              <summary className={styles.projectGroupsSummary}>
                {libraryChromeCopy.projectGroups}
              </summary>
              {projectGroupsOpen ? (
                <div className={styles.projectGroupsBody}>
                  <button
                    aria-pressed={selectedFolderId === null}
                    className={styles.folderButton}
                    data-folder-count={myPlansCount}
                    data-folder-id="my-plans"
                    onClick={() => handleSelectFolder(null)}
                    type="button"
                  >
                    <span>{libraryChromeCopy.myPlans}</span>
                    <span className={styles.folderCount}>{myPlansCount}</span>
                  </button>
                  {folders.map((projectFolder) => {
                    const folderProjectCount = countLocalProjectsInFolder(
                      projects,
                      projectFolder.id,
                    );
                    if (renamedFolderId === projectFolder.id) {
                      return (
                        <div
                          className={styles.folderRenameField}
                          data-folder-count={folderProjectCount}
                          data-folder-id={projectFolder.id}
                          key={projectFolder.id}
                        >
                          <input
                            aria-label={libraryChromeCopy.renameFolder}
                            autoComplete="off"
                            data-folder-rename={projectFolder.id}
                            disabled={!isStorageReady}
                            onBlur={handleFolderRenameBlur}
                            onChange={(changeEvent) => {
                              setRequestedFolderRename(changeEvent.currentTarget.value);
                            }}
                            onKeyDown={handleFolderRenameKeyDown}
                            ref={folderRenameInputRef}
                            type="text"
                            value={requestedFolderRename}
                          />
                          <span className={styles.folderCount}>{folderProjectCount}</span>
                        </div>
                      );
                    }
                    return (
                      <button
                        aria-pressed={selectedFolderId === projectFolder.id}
                        className={styles.folderButton}
                        data-folder-count={folderProjectCount}
                        data-folder-id={projectFolder.id}
                        key={projectFolder.id}
                        onClick={() => handleSelectFolder(projectFolder.id)}
                        onDoubleClick={() => handleStartFolderRename(projectFolder)}
                        type="button"
                      >
                        <span>{projectFolder.name}</span>
                        <span className={styles.folderCount}>{folderProjectCount}</span>
                      </button>
                    );
                  })}
                  <label className={styles.folderNameLabel}>
                    <span className="sr-only">{libraryChromeCopy.folderNameLabel}</span>
                    <input
                      aria-label={libraryChromeCopy.folderNameLabel}
                      disabled={!isStorageReady}
                      placeholder={libraryChromeCopy.folderNameLabel}
                      onChange={(changeEvent) =>
                        setRequestedFolderName(changeEvent.currentTarget.value)
                      }
                      type="text"
                      value={requestedFolderName}
                    />
                  </label>
                  <button
                    disabled={!isStorageReady}
                    onClick={handleCreateFolder}
                    type="button"
                  >
                    {libraryChromeCopy.newFolder}
                  </button>
                </div>
              ) : null}
            </details>
          </nav>
          <button
            aria-pressed={isToolsOpen}
            className={styles.toolsButton}
            disabled={!isStorageReady}
            onClick={handleOpenTools}
            type="button"
          >
            {libraryChromeCopy.tools}
          </button>
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
        </aside>
        <div
          className={styles.main}
          data-local-project-region="main"
          data-selected-folder-id={selectedFolderId ?? "my-plans"}
        >
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
          {gameSaveContent}
          {toolsContent}
          {visibleProjectList}
          {projects.length > 0
          && projectsInSelectedFolder.length === 0
          && searchQuery.trim().length === 0 ? (
            <p className="local-project-panel__message" data-empty-state="folder" role="status">
              {libraryChromeCopy.emptyFolder}
            </p>
          ) : null}
          {projects.length > 0
          && projectsInSelectedFolder.length > 0
          && filteredProjectSummaries.length === 0 ? (
            <p className="local-project-panel__message" role="status">
              {copy.noSearchResults}
            </p>
          ) : null}
          {projects.length === 0 ? (
            <p className="local-project-panel__message" data-empty-state="library">
              {copy.emptyState}
            </p>
          ) : null}
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

export function readLibraryChromeCopy(dateTimeLocale: HomepageLocale): LibraryChromeCopy {
  if (dateTimeLocale === "zh-CN") {
    return {
      blankFolderName: (folderName) => `文件夹名称不能为空。收到的名称是 ${JSON.stringify(folderName)}。`,
      createdFolder: "已创建文件夹。",
      emptyFolder: "这个文件夹里还没有计划。",
      folderNameLabel: "文件夹名称",
      importGameSave: "导入游戏存档",
      moreActions: "更多操作",
      move: "移动",
      movedProject: "已移动项目。",
      myPlans: "我的计划",
      newFolder: "新建文件夹",
      projectGroups: "项目分组",
      renameFolder: "重命名文件夹",
      tools: "工具",
    };
  }

  if (dateTimeLocale === "en") {
    return {
      blankFolderName: (folderName) => `Folder name cannot be blank. Received name: ${JSON.stringify(folderName)}.`,
      createdFolder: "Created the folder.",
      emptyFolder: "This folder has no plans.",
      folderNameLabel: "Folder name",
      importGameSave: "Import Game Save",
      moreActions: "More actions",
      move: "Move",
      movedProject: "Moved the project.",
      myPlans: "My Plans",
      newFolder: "New folder",
      projectGroups: "Project groups",
      renameFolder: "Rename folder",
      tools: "Tools",
    };
  }

  if (dateTimeLocale === "ru") {
    return {
      blankFolderName: (folderName) => `Название папки не может быть пустым. Получено название: ${JSON.stringify(folderName)}.`,
      createdFolder: "Папка создана.",
      emptyFolder: "В этой папке нет планов.",
      folderNameLabel: "Название папки",
      importGameSave: "Импортировать сохранение игры",
      moreActions: "Другие действия",
      move: "Переместить",
      movedProject: "Проект перемещён.",
      myPlans: "Мои планы",
      newFolder: "Новая папка",
      projectGroups: "Группы проектов",
      renameFolder: "Переименовать папку",
      tools: "Инструменты",
    };
  }

  throw new Error(
    `Cannot read library labels because dateTimeLocale is ${JSON.stringify(dateTimeLocale)}.`,
  );
}

function readLibraryOperationFailure(
  dateTimeLocale: HomepageLocale,
  messageByLocale: Readonly<{ en: string; ru: string }>,
): string {
  if (dateTimeLocale === "en" || dateTimeLocale === "zh-CN") {
    return messageByLocale.en;
  }
  if (dateTimeLocale === "ru") {
    return messageByLocale.ru;
  }
  throw new Error(
    `Cannot read library labels because dateTimeLocale is ${JSON.stringify(dateTimeLocale)}.`,
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
  selectedFolderId?: string | null,
): readonly ReferenceProjectSummary[] {
  if (
    selectedFolderId !== undefined
    && selectedFolderId !== null
    && selectedFolderId.trim().length === 0
  ) {
    throw new Error(
      `Cannot filter local projects because the selected folder id is ${JSON.stringify(selectedFolderId)}.`,
    );
  }

  const folderScopedProjectSummaries = selectedFolderId === undefined
    ? projectSummaries
    : projectSummaries.filter((projectSummary) =>
      projectSummaryMatchesFolder(projectSummary, selectedFolderId),
    );
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  if (normalizedSearchQuery.length === 0) return folderScopedProjectSummaries;

  return folderScopedProjectSummaries.filter((projectSummary) =>
    projectSummary.title.toLowerCase().includes(normalizedSearchQuery),
  );
}

export function countLocalProjectsInFolder(
  projectSummaries: readonly ReferenceProjectSummary[],
  folderId: string | null,
): number {
  return filterLocalProjectSummaries(projectSummaries, "", folderId).length;
}

function projectSummaryMatchesFolder(
  projectSummary: ReferenceProjectSummary,
  selectedFolderId: string | null,
): boolean {
  if (projectSummary.folderId !== undefined && projectSummary.folderId.trim().length === 0) {
    throw new Error(
      `Cannot place project ${JSON.stringify(projectSummary.id)} because its folder id is ${JSON.stringify(projectSummary.folderId)}.`,
    );
  }

  if (selectedFolderId === null) {
    return projectSummary.folderId === undefined;
  }

  return projectSummary.folderId === selectedFolderId;
}

function readLocalProjectPreviewSource(
  projectSummary: ReferenceProjectSummary,
): string | null {
  const thumbnailDataUrl = projectSummary.activeMapThumbnailDataUrl;
  if (thumbnailDataUrl === undefined || thumbnailDataUrl === null || thumbnailDataUrl.length === 0) {
    return null;
  }

  if (!thumbnailDataUrl.startsWith("data:image/webp;base64,")) {
    throw new Error(
      `Cannot show the preview for project ${JSON.stringify(projectSummary.id)} because the thumbnail is ${JSON.stringify(thumbnailDataUrl)}.`,
    );
  }

  return thumbnailDataUrl;
}

function readProjectIds(
  projectSummaries: readonly ReferenceProjectSummary[],
): ReadonlySet<string> {
  return new Set(projectSummaries.map((projectSummary) => projectSummary.id));
}

function readCreatedProjectId(
  projectIdsBeforeCreate: ReadonlySet<string>,
  projectSummaries: readonly ReferenceProjectSummary[],
  selectedFolderId: string,
): string {
  const createdProjectIds = projectSummaries
    .map((projectSummary) => projectSummary.id)
    .filter((projectId) => !projectIdsBeforeCreate.has(projectId));
  if (createdProjectIds.length !== 1) {
    throw new Error(
      `Cannot move the new project into folder ${JSON.stringify(selectedFolderId)} because the created project count was ${String(createdProjectIds.length)}. Received project IDs: ${JSON.stringify(createdProjectIds)}.`,
    );
  }

  const createdProjectId = createdProjectIds[0];
  if (createdProjectId === undefined || createdProjectId.length === 0) {
    throw new Error(
      `Cannot move the new project into folder ${JSON.stringify(selectedFolderId)} because the created project ID is ${JSON.stringify(createdProjectId)}.`,
    );
  }

  return createdProjectId;
}

function readCustomProjectFolder(
  projectFolders: readonly ReferenceProjectFolder[],
  folderId: string,
): ReferenceProjectFolder {
  if (folderId.trim().length === 0) {
    throw new Error(
      `Cannot rename a folder because its id is ${JSON.stringify(folderId)}.`,
    );
  }

  const projectFolder = projectFolders.find((candidateFolder) => candidateFolder.id === folderId);
  if (projectFolder === undefined) {
    throw new Error(
      `Cannot rename folder ${JSON.stringify(folderId)} because it is not in the folder list. Received folder IDs: ${JSON.stringify(projectFolders.map((candidateFolder) => candidateFolder.id))}.`,
    );
  }

  return projectFolder;
}

function renameCustomProjectFolder(
  folderController: LocalProjectFolderController,
  folderId: string,
  folderName: string,
): ReferenceProjectFolder {
  if (typeof folderController.renameFolder !== "function") {
    throw new Error(
      `Cannot rename folder ${JSON.stringify(folderId)} to ${JSON.stringify(folderName)} because renameFolder is ${JSON.stringify(folderController.renameFolder)}.`,
    );
  }

  return folderController.renameFolder(folderId, folderName);
}

function requireLocalProjectFolderController(
  workspaceController: LocalProjectFolderController | undefined,
  actionDescription: string,
): LocalProjectFolderController {
  if (workspaceController === undefined) {
    throw new Error(
      `Cannot ${actionDescription} because workspaceController is ${JSON.stringify(workspaceController)}.`,
    );
  }

  return workspaceController;
}

function readPopoverTriggerButton(clickEvent: unknown): HTMLButtonElement | null {
  if (typeof clickEvent !== "object" || clickEvent === null || !("currentTarget" in clickEvent)) {
    return null;
  }

  const currentTarget = clickEvent.currentTarget;
  if (currentTarget === null || currentTarget === undefined) return null;
  if (typeof HTMLButtonElement !== "undefined" && currentTarget instanceof HTMLButtonElement) {
    return currentTarget;
  }

  throw new Error(
    `Cannot toggle a library popover because the trigger is ${describePopoverTrigger(currentTarget)}.`,
  );
}

function describePopoverTrigger(eventTarget: unknown): string {
  if (typeof Element !== "undefined" && eventTarget instanceof Element) {
    return `${eventTarget.tagName.toLowerCase()}[aria-label=${JSON.stringify(eventTarget.getAttribute("aria-label"))}, data-project-action=${JSON.stringify(eventTarget.getAttribute("data-project-action"))}]`;
  }

  return JSON.stringify(eventTarget);
}

function isPendingLocalProjectAction(
  actionResult: void | Promise<void>,
): actionResult is Promise<void> {
  return typeof actionResult === "object"
    && actionResult !== null
    && typeof actionResult.then === "function";
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

function MoveIcon() {
  return (
    <svg aria-hidden="true" className={styles.actionIcon} fill="none" viewBox="0 0 24 24">
      <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M12 12h6M15 9l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg aria-hidden="true" className={styles.actionIcon} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" className={styles.actionIcon} fill="none" viewBox="0 0 24 24">
      <path d="M12 3v11M8 10l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function createProjectImageFilename(projectTitle: string): string {
  if (typeof projectTitle !== "string" || projectTitle.trim().length === 0) {
    throw new Error(
      `Cannot create preview image filename because project title is ${JSON.stringify(projectTitle)}.`,
    );
  }

  const sanitizedStem = projectTitle
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/[\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (sanitizedStem.length === 0) {
    throw new Error(
      `Cannot create preview image filename because project title ${JSON.stringify(projectTitle)} has no valid characters after sanitizing.`,
    );
  }

  return `${sanitizedStem}.webp`;
}

export function convertWebpDataUrlToBlob(dataUrl: string): Blob {
  if (!dataUrl.startsWith("data:image/webp;base64,")) {
    throw new Error(
      `Cannot convert data URL to Blob because it is not a WebP data URL. Received: ${JSON.stringify(dataUrl)}.`,
    );
  }

  const base64Content = dataUrl.slice("data:image/webp;base64,".length);
  let binaryString: string;
  try {
    binaryString = atob(base64Content);
  } catch (error) {
    if (error instanceof Error && error.name === "InvalidCharacterError") {
      throw new Error(
        `Cannot convert data URL to Blob because the base64 payload is invalid. Received: ${JSON.stringify(dataUrl)}.`,
        { cause: error },
      );
    }
    throw error;
  }
  const byteCount = binaryString.length;
  const byteArray = new Uint8Array(byteCount);

  for (let byteIndex = 0; byteIndex < byteCount; byteIndex += 1) {
    byteArray[byteIndex] = binaryString.charCodeAt(byteIndex);
  }

  return new Blob([byteArray], { type: "image/webp" });
}
