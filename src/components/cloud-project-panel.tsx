"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import * as AlertDialog from "radix-ui/alert-dialog";
import type { CloudProjectSummary } from "@/cloud-sync/cloud-project-contract";
import {
  CloudAuthError,
  CloudProjectRequestError,
  type CloudProjectSyncView,
} from "@/cloud-sync/use-cloud-project-sync";
import type { ReferenceProjectSummary } from "@/reference-runtime/reference-project-repository";
import type {
  CloudProjectDeleteCopy,
  CloudProjectsCopy,
} from "@/i18n/save-modal-copy";
import styles from "./cloud-project-panel.module.css";

type CloudProjectPanelProperties = Readonly<{
  cloudProjectSync: CloudProjectSyncView;
  copy: CloudProjectsCopy;
  currentProjectId: string | null;
  localProjects: readonly ReferenceProjectSummary[];
}>;

type CloudProjectDeleteButtonFocusTarget = Readonly<{
  isConnected: boolean;
  focus(): void;
}>;

type CloudProjectDeleteAlertDialogProperties = Readonly<{
  copy: CloudProjectDeleteCopy;
  deleteButtonFocusTarget: CloudProjectDeleteButtonFocusTarget | null;
  projectTitle: string;
  onCancel: () => void;
  onConfirm: () => boolean;
}>;

export function CloudProjectPanel({
  cloudProjectSync,
  copy,
  currentProjectId,
  localProjects,
}: CloudProjectPanelProperties) {
  const cloudProjectPanelHeadingId = useId();
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const pendingCloudActionIdRef = useRef<string | null>(null);
  const [cloudProjectPendingDeletionId, setCloudProjectPendingDeletionId] =
    useState<string | null>(null);
  const cloudProjectDeleteButtonFocusTargetRef = useRef<HTMLButtonElement | null>(null);
  const isCloudActionPending = pendingActionId !== null;
  const cloudProjectPendingDeletion = cloudProjectSync.cloudProjects.find(
    (cloudProject) => cloudProject.id === cloudProjectPendingDeletionId,
  );
  const isCloudSyncReady = cloudProjectSync.status === "ready";
  const signedInAccountName = getSignedInAccountName(cloudProjectSync);

  async function runCloudProjectAction(
    actionId: string,
    cloudProjectAction: () => Promise<unknown>,
  ): Promise<void> {
    if (pendingCloudActionIdRef.current !== null) return;
    pendingCloudActionIdRef.current = actionId;
    setPendingActionId(actionId);

    try {
      await cloudProjectAction();
    } catch (caughtError) {
      if (
        caughtError instanceof CloudAuthError
        || caughtError instanceof CloudProjectRequestError
      ) {
        return;
      }

      throw caughtError;
    } finally {
      pendingCloudActionIdRef.current = null;
      setPendingActionId(null);
    }
  }

  function handleRequestCloudProjectDeletion(
    cloudProject: CloudProjectSummary,
    deleteButton: HTMLButtonElement,
  ): void {
    cloudProjectDeleteButtonFocusTargetRef.current = deleteButton;
    setCloudProjectPendingDeletionId(cloudProject.id);
  }

  function handleConfirmCloudProjectDeletion(): boolean {
    if (cloudProjectPendingDeletion === undefined) {
      throw new Error(
        `Cannot delete cloud project because pending cloud project ID ${JSON.stringify(cloudProjectPendingDeletionId)} is not available.`,
      );
    }

    setCloudProjectPendingDeletionId(null);
    void runCloudProjectAction(
      `delete-cloud-project:${cloudProjectPendingDeletion.id}`,
      () => cloudProjectSync.deleteCloudCopy(cloudProjectPendingDeletion.id),
    );

    return true;
  }

  return (
    <section
      aria-busy={cloudProjectSync.status === "loading" || isCloudActionPending}
      aria-labelledby={cloudProjectPanelHeadingId}
      className={styles.panel}
    >
      <header className={styles.header}>
        <h2 className={styles.title} id={cloudProjectPanelHeadingId}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.imagesStayLocal}</p>
      </header>
      <div className={styles.account}>
        <strong>{copy.account}</strong>
        {cloudProjectSync.authStatus === "loading" ? (
          <p role="status">{copy.accountLoading}</p>
        ) : cloudProjectSync.authStatus === "signed-in" ? (
          <>
            <p role="status">{copy.signedInAs(signedInAccountName)}</p>
            <button
              disabled={isCloudActionPending}
              onClick={() =>
                void runCloudProjectAction("sign-out", cloudProjectSync.signOut)
              }
              type="button"
            >
              {pendingActionId === "sign-out" ? copy.signOutBusy : copy.signOut}
            </button>
          </>
        ) : (
          <>
            <p>{copy.signedOut}</p>
            <button
              disabled={isCloudActionPending}
              onClick={() =>
                void runCloudProjectAction(
                  "sign-in",
                  cloudProjectSync.signInWithGoogle,
                )
              }
              type="button"
            >
              {pendingActionId === "sign-in" ? copy.signInBusy : copy.signInGoogle}
            </button>
          </>
        )}
      </div>
      {cloudProjectSync.errorMessage !== null ? (
        <p className={styles.error} role="alert">
          {copy.cloudStatusError(cloudProjectSync.errorMessage)}
        </p>
      ) : null}
      {cloudProjectSync.authStatus === "signed-in" ? (
        <>
          <section aria-label={copy.localProjects} className={styles.projectSection}>
            <h3>{copy.localProjects}</h3>
            {cloudProjectSync.status === "loading" ? (
              <p role="status">{copy.cloudProjectsLoading}</p>
            ) : cloudProjectSync.status === "error" ? null : localProjects.length > 0 ? (
              <ul className={styles.syncList}>
                {localProjects.map((localProject) => {
                  const localSyncState = cloudProjectSync.localProjectSyncById[
                    localProject.id
                  ] ?? { status: "none" as const };
                  const localSyncStatus = localSyncState.status;
                  const localProjectIsCurrent = localProject.id === currentProjectId;

                  return (
                    <li className={styles.syncListItem} key={localProject.id}>
                      <div className={styles.projectHeading}>
                        <strong>{localProject.title}</strong>
                        {localProjectIsCurrent ? (
                          <span className={styles.currentProject}>{copy.currentProject}</span>
                        ) : null}
                      </div>
                      <p
                        className={
                          localSyncStatus === "error"
                            ? styles.error
                            : styles.syncStatus
                        }
                        role={localSyncStatus === "error" ? "alert" : "status"}
                      >
                        {copy.localProjectStatus(localSyncStatus)}
                        {localSyncState.errorMessage
                          ? ` — ${localSyncState.errorMessage}`
                          : ""}
                      </p>
                      {localSyncStatus === "conflict" ? (
                        <>
                          <p className={styles.conflictDescription} role="status">
                            {copy.conflictDescription}
                          </p>
                          <div className={styles.projectActions}>
                            <button
                              aria-label={`${copy.keepLocalVersion}: ${localProject.title}`}
                              disabled={!isCloudSyncReady || isCloudActionPending}
                              onClick={() =>
                                void runCloudProjectAction(
                                  `keep-local:${localProject.id}`,
                                  () =>
                                    cloudProjectSync.keepLocalVersion(localProject.id),
                                )
                              }
                              type="button"
                            >
                              {copy.keepLocalVersion}
                            </button>
                            <button
                              aria-label={`${copy.useCloudVersion}: ${localProject.title}`}
                              disabled={!isCloudSyncReady || isCloudActionPending}
                              onClick={() =>
                                void runCloudProjectAction(
                                  `use-cloud:${localProject.id}`,
                                  () =>
                                    cloudProjectSync.useCloudVersion(localProject.id),
                                )
                              }
                              type="button"
                            >
                              {copy.useCloudVersion}
                            </button>
                          </div>
                        </>
                      ) : null}
                      {localSyncStatus === "none" ? (
                        <button
                          aria-label={`${copy.syncThisProject}: ${localProject.title}`}
                          disabled={!isCloudSyncReady || isCloudActionPending}
                          onClick={() =>
                            void runCloudProjectAction(
                              `upload-local-project:${localProject.id}`,
                              () => cloudProjectSync.uploadLocalProject(localProject.id),
                            )
                          }
                          type="button"
                        >
                          {pendingActionId === `upload-local-project:${localProject.id}`
                            ? copy.syncButtonBusy
                            : copy.syncThisProject}
                        </button>
                      ) : null}
                      {localSyncStatus === "pending" || localSyncStatus === "error" ? (
                        <button
                          aria-label={`${copy.retrySync}: ${localProject.title}`}
                          disabled={!isCloudSyncReady || isCloudActionPending}
                          onClick={() =>
                            void runCloudProjectAction(
                              `retry-local-project:${localProject.id}`,
                              () => cloudProjectSync.retrySync(localProject.id),
                            )
                          }
                          type="button"
                        >
                          {pendingActionId === `retry-local-project:${localProject.id}`
                            ? copy.syncButtonBusy
                            : copy.retrySync}
                        </button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>{copy.noLocalProjects}</p>
            )}
          </section>
          <section aria-label={copy.cloudProjects} className={styles.projectSection}>
            <div className={styles.cloudHeading}>
              <h3>{copy.cloudProjects}</h3>
              <button
                aria-label={copy.refreshCloudProjects}
                disabled={isCloudActionPending || cloudProjectSync.status === "loading"}
                onClick={() =>
                  void runCloudProjectAction(
                    "refresh-cloud-projects",
                    cloudProjectSync.refreshCloudProjects,
                  )
                }
                type="button"
              >
                {pendingActionId === "refresh-cloud-projects"
                  ? copy.refreshingCloudProjects
                  : copy.refreshCloudProjects}
              </button>
            </div>
            {cloudProjectSync.status === "loading" ? (
              <p role="status">{copy.cloudProjectsLoading}</p>
            ) : cloudProjectSync.cloudProjects.length === 0
            && cloudProjectSync.status === "ready" ? (
              <p>{copy.cloudProjectsEmpty}</p>
            ) : cloudProjectSync.cloudProjects.length === 0 ? null : (
            ) : (
              <ul className={styles.cloudList}>
                {cloudProjectSync.cloudProjects.map((cloudProject) => (
                  <li className={styles.cloudListItem} key={cloudProject.id}>
                    <div className={styles.projectHeading}>
                      <strong>{cloudProject.title}</strong>
                      <span>{copy.mapCount(cloudProject.mapCount)}</span>
                    </div>
                    <time dateTime={cloudProject.updatedAt}>
                      {formatCloudProjectUpdatedAt(
                        cloudProject.updatedAt,
                        copy.dateTimeLocale,
                      )}
                    </time>
                    <div className={styles.projectActions}>
                      <button
                        aria-label={`${copy.openCloudCopy}: ${cloudProject.title}`}
                        disabled={!isCloudSyncReady || isCloudActionPending}
                        onClick={() =>
                          void runCloudProjectAction(
                            `open-cloud-project:${cloudProject.id}`,
                            () => cloudProjectSync.openCloudProject(cloudProject.id),
                          )
                        }
                        type="button"
                      >
                        {copy.openCloudCopy}
                      </button>
                      <button
                        aria-label={`${copy.deleteCloudCopy}: ${cloudProject.title}`}
                        disabled={!isCloudSyncReady || isCloudActionPending}
                        onClick={(clickEvent) =>
                          handleRequestCloudProjectDeletion(
                            cloudProject,
                            clickEvent.currentTarget,
                          )
                        }
                        type="button"
                      >
                        {pendingActionId === `delete-cloud-project:${cloudProject.id}`
                          ? copy.deletingCloudCopy
                          : copy.deleteCloudCopy}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {(cloudProjectSync.status === "ready"
              || cloudProjectSync.status === "error")
            && cloudProjectSync.hasMoreCloudProjects ? (
              <button
                aria-busy={cloudProjectSync.isLoadingMoreCloudProjects}
                aria-label={copy.loadMoreCloudProjects}
                disabled={isCloudActionPending || cloudProjectSync.isLoadingMoreCloudProjects}
                onClick={() =>
                  void runCloudProjectAction(
                    "load-more-cloud-projects",
                    cloudProjectSync.loadMoreCloudProjects,
                  )
                }
                type="button"
              >
                {cloudProjectSync.isLoadingMoreCloudProjects
                  ? copy.loadingMoreCloudProjects
                  : copy.loadMoreCloudProjects}
              </button>
            ) : null}
          </section>
        </>
      ) : null}
      {cloudProjectPendingDeletion !== undefined ? (
        <CloudProjectDeleteAlertDialog
          copy={copy.deleteProject}
          deleteButtonFocusTarget={cloudProjectDeleteButtonFocusTargetRef.current}
          onCancel={() => setCloudProjectPendingDeletionId(null)}
          onConfirm={handleConfirmCloudProjectDeletion}
          projectTitle={cloudProjectPendingDeletion.title}
        />
      ) : null}
    </section>
  );
}

export function formatCloudProjectUpdatedAt(
  updatedAt: string,
  dateTimeLocale: string,
): string {
  const parsedUpdatedAt = new Date(updatedAt);

  if (updatedAt.trim().length === 0 || Number.isNaN(parsedUpdatedAt.getTime())) {
    throw new Error(
      `Cannot format cloud project updatedAt value ${JSON.stringify(updatedAt)} because it is not a valid timestamp.`,
    );
  }

  return new Intl.DateTimeFormat(dateTimeLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedUpdatedAt);
}

function getSignedInAccountName(
  cloudProjectSync: CloudProjectSyncView,
): string {
  if (cloudProjectSync.authStatus !== "signed-in") return "";
  if (cloudProjectSync.account === null) {
    throw new Error(
      `Cannot show signed-in cloud account because auth status ${JSON.stringify(cloudProjectSync.authStatus)} has no account.`,
    );
  }

  return cloudProjectSync.account.name.trim().length > 0
    ? cloudProjectSync.account.name
    : cloudProjectSync.account.email;
}

function CloudProjectDeleteAlertDialog({
  copy,
  deleteButtonFocusTarget,
  projectTitle,
  onCancel,
  onConfirm,
}: CloudProjectDeleteAlertDialogProperties): ReactNode {
  return (
    <AlertDialog.Root open>
      <AlertDialog.Portal>
        <CloudProjectDeleteAlertDialogContent
          copy={copy}
          deleteButtonFocusTarget={deleteButtonFocusTarget}
          onCancel={onCancel}
          onConfirm={onConfirm}
          projectTitle={projectTitle}
        />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function CloudProjectDeleteAlertDialogContent({
  copy,
  deleteButtonFocusTarget,
  projectTitle,
  onCancel,
  onConfirm,
}: CloudProjectDeleteAlertDialogProperties): ReactNode {
  const restoreDeleteButtonFocusOnCloseRef = useRef(true);

  function handleConfirm(): void {
    if (onConfirm()) {
      restoreDeleteButtonFocusOnCloseRef.current = false;
    }
  }

  return (
    <>
      <AlertDialog.Overlay className="local-project-panel__delete-alert-overlay" />
      <AlertDialog.Content
        className="local-project-panel__delete-alert-content"
        onCloseAutoFocus={(closeAutoFocusEvent) => {
          if (!restoreDeleteButtonFocusOnCloseRef.current) {
            closeAutoFocusEvent.preventDefault();
            return;
          }

          closeAutoFocusEvent.preventDefault();
          if (deleteButtonFocusTarget === null) {
            throw new Error(
              `Cannot restore cloud project deletion focus because the original Delete cloud copy button for project ${JSON.stringify(projectTitle)} is missing.`,
            );
          }
          if (!deleteButtonFocusTarget.isConnected) {
            throw new Error(
              `Cannot restore cloud project deletion focus because the original Delete cloud copy button for project ${JSON.stringify(projectTitle)} is disconnected.`,
            );
          }

          deleteButtonFocusTarget.focus();
        }}
        onEscapeKeyDown={onCancel}
      >
        <AlertDialog.Title>{copy.title}</AlertDialog.Title>
        <AlertDialog.Description>
          {copy.descriptionPrefix}
          <strong>{projectTitle}</strong>
          {copy.descriptionSuffix}
        </AlertDialog.Description>
        <div className="local-project-panel__delete-alert-actions">
          <AlertDialog.Action onClick={handleConfirm} type="button">
            {copy.confirm}
          </AlertDialog.Action>
          <AlertDialog.Cancel onClick={onCancel} type="button">
            {copy.dismiss}
          </AlertDialog.Cancel>
        </div>
      </AlertDialog.Content>
    </>
  );
}
