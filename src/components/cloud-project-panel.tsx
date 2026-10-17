"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import * as AlertDialog from "radix-ui/alert-dialog";
import type { CloudProjectSummary } from "@/src/cloud-sync/cloud-project-contract";
import {
  getConfiguredLocalSaveRetirementAt,
  getLocalSaveRetirementState,
} from "@/src/cloud-sync/local-save-retirement";
import {
  CloudAuthError,
  CloudOperationCancelledError,
  CloudProjectRequestError,
  type CloudProjectBatchSyncProgress,
  type CloudProjectSyncView,
} from "@/src/cloud-sync/use-cloud-project-sync";
import type { ReferenceProjectSummary } from "@/src/reference-runtime/reference-project-repository";
import type {
  CloudProjectDeleteCopy,
  CloudProjectsCopy,
} from "@/src/i18n/save-modal-copy";
import styles from "./cloud-project-panel.module.css";

type CloudProjectPanelProperties = Readonly<{
  cloudProjectSync: CloudProjectSyncView;
  copy: CloudProjectsCopy;
  currentProjectId: string | null;
  localProjects: readonly ReferenceProjectSummary[];
}>;

type CloudProjectSidebarProperties = Readonly<{
  cloudProjectSync: CloudProjectSyncView;
  copy: CloudProjectsCopy;
  extrasEntry?: ReactNode;
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

export function CloudProjectSidebar({
  cloudProjectSync,
  copy,
  extrasEntry = null,
  localProjects,
}: CloudProjectSidebarProperties) {
  const extrasHeadingId = useId();
  const [currentEpochMilliseconds, setCurrentEpochMilliseconds] =
    useState<number | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const pendingSidebarActionIdRef = useRef<string | null>(null);
  const [isSignOutPending, setIsSignOutPending] = useState(false);
  const signOutPendingRef = useRef(false);
  const localSaveRetirementAt = getConfiguredLocalSaveRetirementAt();
  const localSaveRetirementState = localSaveRetirementAt === null
    ? { kind: "not-configured" as const }
    : currentEpochMilliseconds === null
      ? null
      : getLocalSaveRetirementState(
          localSaveRetirementAt,
          currentEpochMilliseconds,
        );
  const batchSyncProgress = cloudProjectSync.batchSyncProgress;
  const isBatchSyncRunning = batchSyncProgress?.status === "running";
  const isSidebarActionPending = pendingActionId !== null;
  const isSyncAllDisabled =
    isSidebarActionPending
    || isSignOutPending
    || isBatchSyncRunning
    || cloudProjectSync.authStatus === "loading"
    || cloudProjectSync.authStatus === "error"
    || (
      cloudProjectSync.authStatus === "signed-in"
      && (cloudProjectSync.status !== "ready" || localProjects.length === 0)
    );

  useEffect(() => {
    if (localSaveRetirementAt === null) return;

    function refreshCurrentEpochMilliseconds(): void {
      setCurrentEpochMilliseconds(Date.now());
    }

    refreshCurrentEpochMilliseconds();
    const retirementCountdownIntervalId = window.setInterval(
      refreshCurrentEpochMilliseconds,
      1_000,
    );

    return () => window.clearInterval(retirementCountdownIntervalId);
  }, [localSaveRetirementAt]);

  async function runSidebarAction(
    actionId: string,
    cloudAction: () => Promise<unknown>,
  ): Promise<void> {
    if (pendingSidebarActionIdRef.current !== null || signOutPendingRef.current) return;
    pendingSidebarActionIdRef.current = actionId;
    setPendingActionId(actionId);

    try {
      await runCloudActionWithKnownErrorHandling(cloudAction);
    } finally {
      pendingSidebarActionIdRef.current = null;
      setPendingActionId(null);
    }
  }

  async function handleSignOut(): Promise<void> {
    if (signOutPendingRef.current) return;
    signOutPendingRef.current = true;
    setIsSignOutPending(true);

    try {
      await runCloudActionWithKnownErrorHandling(cloudProjectSync.signOut);
    } finally {
      signOutPendingRef.current = false;
      setIsSignOutPending(false);
    }
  }

  async function handleSyncAllLocalProjects(): Promise<void> {
    if (cloudProjectSync.authStatus === "signed-out") {
      await runSidebarAction("sync-all-sign-in", cloudProjectSync.signInWithGoogle);
      return;
    }
    if (cloudProjectSync.authStatus !== "signed-in") return;

    const localProjectIds = localProjects.map((localProject) => localProject.id);
    await runSidebarAction(
      "sync-all-local-projects",
      () => cloudProjectSync.syncAllLocalProjects(localProjectIds),
    );
  }

  if (cloudProjectSync.status === "error" && cloudProjectSync.errorMessage === null) {
    throw new Error(
      `Cannot show cloud status error because status ${JSON.stringify(cloudProjectSync.status)} has no error message.`,
    );
  }
  if (cloudProjectSync.authStatus === "error" && cloudProjectSync.errorMessage === null) {
    throw new Error(
      `Cannot show authentication error because status ${JSON.stringify(cloudProjectSync.authStatus)} has no error message.`,
    );
  }
  if (batchSyncProgress !== null) {
    assertCloudProjectBatchSyncProgress(batchSyncProgress);
  }
  if (
    batchSyncProgress?.status === "failed"
    && cloudProjectSync.errorMessage === null
  ) {
    throw new Error(
      `Cannot show failed batch for project IDs ${JSON.stringify(batchSyncProgress.failedProjectIds)} because no batch error message is available.`,
    );
  }
  if (
    batchSyncProgress?.status === "completed"
    && batchSyncProgress.failedProjectIds.length > 0
  ) {
    throw new Error(
      `Cannot show completed batch with failed project IDs ${JSON.stringify(batchSyncProgress.failedProjectIds)}; failed batches must use status "failed".`,
    );
  }
  const currentBatchProjectName = batchSyncProgress?.currentProjectId === null
    || batchSyncProgress?.currentProjectId === undefined
    ? null
    : getLocalProjectLabel(localProjects, batchSyncProgress.currentProjectId);
  const cloudSyncFailureMessage = hasCloudSyncFailure(cloudProjectSync)
    ? requireCloudErrorMessage(cloudProjectSync)
    : null;
  const failedProjectNames = batchSyncProgress === null
    ? []
    : batchSyncProgress.failedProjectIds.map((localProjectId) =>
        getLocalProjectLabel(localProjects, localProjectId),
      );

  return (
    <section
      aria-busy={
        cloudProjectSync.status === "loading"
        || isSidebarActionPending
        || isSignOutPending
        || isBatchSyncRunning
      }
      aria-labelledby={extrasHeadingId}
      className={styles.sidebar}
    >
      <h2 className={styles.sidebarTitle} id={extrasHeadingId}>{copy.extras}</h2>
      {extrasEntry}
      <div className={styles.compactSync}>
      <section aria-label={copy.account} className={styles.sidebarSection}>
        {cloudProjectSync.authStatus === "loading" ? (
          <p role="status">{copy.accountLoading}</p>
        ) : null}
        {cloudProjectSync.authStatus === "signed-in" ? (
          <>
            <p role="status">{copy.signedInAs(getSignedInAccountName(cloudProjectSync))}</p>
            <button
              className={styles.sidebarButton}
              disabled={isSignOutPending}
              onClick={handleSignOut}
              type="button"
            >
              {isSignOutPending ? copy.signOutBusy : copy.signOut}
            </button>
          </>
        ) : null}
        {shouldOfferGoogleSignIn(cloudProjectSync.authStatus) ? (
          <>
            {cloudProjectSync.authStatus === "signed-out" ? (
              <p>{copy.signedOut}</p>
            ) : null}
            <button
              className={styles.sidebarButton}
              disabled={isSidebarActionPending || isSignOutPending}
              onClick={() =>
                void runSidebarAction("sign-in", cloudProjectSync.signInWithGoogle)
              }
              type="button"
            >
              {pendingActionId === "sign-in" ? copy.signInBusy : copy.signInGoogle}
            </button>
          </>
        ) : null}
      </section>
      {cloudProjectSync.status === "loading" ? (
        <p aria-live="polite" className={styles.status} role="status">
          {copy.cloudStatusLoading}
        </p>
      ) : null}
      {cloudProjectSync.status === "ready" ? (
        <p aria-live="polite" className={styles.status} role="status">
          {copy.cloudStatusReady}
        </p>
      ) : null}
      {cloudSyncFailureMessage !== null
        ? createCloudSyncErrorNotice(copy, cloudSyncFailureMessage)
        : null}
      {cloudProjectSync.status === "ready"
        && cloudProjectSync.errorMessage !== null
        && cloudSyncFailureMessage === null
        && batchSyncProgress?.status !== "failed" ? (
        <p className={styles.error} role="alert">{cloudProjectSync.errorMessage}</p>
      ) : null}
      <section aria-label={copy.syncAllLocalProjects} className={styles.sidebarSection}>
        {cloudProjectSync.authStatus === "signed-out" ? (
          <p className={styles.description}>{copy.syncAllSignInDescription}</p>
        ) : localProjects.length === 0 ? (
          <p className={styles.description}>{copy.noLocalProjects}</p>
        ) : null}
        <button
          aria-busy={isBatchSyncRunning || pendingActionId === "sync-all-local-projects"}
          className={styles.sidebarButton}
          disabled={isSyncAllDisabled}
          onClick={handleSyncAllLocalProjects}
          type="button"
        >
          {pendingActionId === "sync-all-sign-in"
            ? copy.signInBusy
            : pendingActionId === "sync-all-local-projects" || isBatchSyncRunning
              ? copy.syncButtonBusy
              : cloudProjectSync.authStatus === "signed-in"
                ? copy.syncAllLocalProjects
                : copy.syncAllSignedOut}
        </button>
        {batchSyncProgress?.status === "running" ? (
          <div className={styles.batchProgress}>
            <progress
              aria-label={copy.syncAllProgressLabel}
              max={batchSyncProgress.total}
              value={batchSyncProgress.completed}
            />
            <p role="status">
              {copy.syncAllProgress(
                batchSyncProgress.completed,
                batchSyncProgress.total,
                currentBatchProjectName,
              )}
            </p>
            {failedProjectNames.length > 0 ? (
              <p className={styles.error} role="alert">
                {failedProjectNames.join(", ")}
                {cloudProjectSync.errorMessage === null
                  ? ""
                  : ` — ${cloudProjectSync.errorMessage}`}
              </p>
            ) : null}
          </div>
        ) : null}
        {batchSyncProgress?.status === "completed" ? (
          <p role="status">{copy.syncAllCompleted(batchSyncProgress.total)}</p>
        ) : null}
        {batchSyncProgress?.status === "failed" ? (
          <p className={styles.error} role="alert">
            {copy.syncAllFailed(
              batchSyncProgress.completed,
              batchSyncProgress.total,
              failedProjectNames,
              requireCloudErrorMessage(cloudProjectSync),
            )}
          </p>
        ) : null}
      </section>
      <p aria-live="polite" className={styles.retirementNotice} role="status">
        {localSaveRetirementState === null
          ? copy.localSaveRetirementLoading
          : localSaveRetirementState.kind === "not-configured"
            ? copy.localSaveRetirementNotConfigured
            : localSaveRetirementState.kind === "ended"
              ? copy.localSaveRetirementEnded
              : copy.localSaveRetirementCountdown(
                  localSaveRetirementState.daysRemaining,
                  localSaveRetirementState.hoursRemaining,
                  localSaveRetirementState.minutesRemaining,
                )}
      </p>
      </div>
    </section>
  );
}

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
  const isBatchSyncRunning = cloudProjectSync.batchSyncProgress?.status === "running";
  const cloudProjectPendingDeletion = cloudProjectSync.cloudProjects.find(
    (cloudProject) => cloudProject.id === cloudProjectPendingDeletionId,
  );
  const isCloudSyncReady = cloudProjectSync.status === "ready";
  const isCloudActionDisabled =
    !isCloudSyncReady || isCloudActionPending || isBatchSyncRunning;

  async function runCloudProjectAction(
    actionId: string,
    cloudProjectAction: () => Promise<unknown>,
  ): Promise<void> {
    if (pendingCloudActionIdRef.current !== null) return;
    pendingCloudActionIdRef.current = actionId;
    setPendingActionId(actionId);

    try {
      await runCloudActionWithKnownErrorHandling(cloudProjectAction);
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
      aria-busy={cloudProjectSync.status === "loading" || isCloudActionPending || isBatchSyncRunning}
      aria-labelledby={cloudProjectPanelHeadingId}
      className={styles.panel}
    >
      <header className={styles.header}>
        <h2 className={styles.title} id={cloudProjectPanelHeadingId}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.imagesStayLocal}</p>
      </header>
      {cloudProjectSync.authStatus === "signed-in" ? (
        <>
          <section aria-label={copy.localProjects} className={styles.projectSection}>
            <h3>{copy.localProjects}</h3>
            {localProjects.length > 0 ? (
              <ul className={styles.syncList}>
                {localProjects.map((localProject) => {
                  const localSyncState = cloudProjectSync.localProjectSyncById[
                    localProject.id
                  ] ?? { status: "none" as const };
                  const localSyncStatus = localSyncState.status;
                  const localProjectIsCurrent = localProject.id === currentProjectId;
                  const localProjectCanManuallySync =
                    localSyncStatus === "none" || localSyncStatus === "synced";
                  const localProjectManualSyncActionId =
                    `manual-sync-local-project:${localProject.id}`;
                  const localProjectRetrySyncActionId =
                    `retry-local-project:${localProject.id}`;
                  const manuallySyncLocalProject =
                    localSyncStatus === "none"
                      ? () => cloudProjectSync.uploadLocalProject(localProject.id)
                      : () => cloudProjectSync.retrySync(localProject.id);

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
                              disabled={isCloudActionDisabled}
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
                              disabled={isCloudActionDisabled}
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
                      {localProjectCanManuallySync ? (
                        <div className={styles.syncProjectAction}>
                          <button
                            aria-busy={pendingActionId === localProjectManualSyncActionId}
                            aria-label={`${copy.syncThisProject}: ${localProject.title}`}
                            disabled={isCloudActionDisabled}
                            onClick={() =>
                              void runCloudProjectAction(
                                localProjectManualSyncActionId,
                                manuallySyncLocalProject,
                              )
                            }
                            type="button"
                          >
                            {pendingActionId === localProjectManualSyncActionId
                              ? copy.syncButtonBusy
                              : copy.syncThisProject}
                          </button>
                        </div>
                      ) : null}
                      {localSyncStatus === "pending" || localSyncStatus === "error" ? (
                        <button
                          aria-label={`${copy.retrySync}: ${localProject.title}`}
                          aria-busy={
                            pendingActionId === localProjectManualSyncActionId
                            || pendingActionId === localProjectRetrySyncActionId
                          }
                          disabled={isCloudActionDisabled}
                          onClick={() =>
                            void runCloudProjectAction(
                              localProjectRetrySyncActionId,
                              () => cloudProjectSync.retrySync(localProject.id),
                            )
                          }
                          type="button"
                        >
                          {pendingActionId === localProjectManualSyncActionId
                            || pendingActionId === localProjectRetrySyncActionId
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
            <details className={styles.cloudDetails}>
              <summary className={styles.cloudDetailsSummary}>
                <h3>{copy.cloudProjects}</h3>
              </summary>
              <div className={styles.cloudDetailsContent}>
                <div className={styles.cloudHeading}>
                  <button
                    aria-label={copy.refreshCloudProjects}
                    disabled={isCloudActionPending || cloudProjectSync.status === "loading" || isBatchSyncRunning}
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
                ) : cloudProjectSync.cloudProjects.length > 0 ? (
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
                            disabled={isCloudActionDisabled}
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
                            disabled={isCloudActionDisabled}
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
                ) : null}
                {(cloudProjectSync.status === "ready"
                  || cloudProjectSync.status === "error")
                && cloudProjectSync.hasMoreCloudProjects ? (
                  <button
                    aria-busy={cloudProjectSync.isLoadingMoreCloudProjects}
                    aria-label={copy.loadMoreCloudProjects}
                    disabled={isCloudActionPending || cloudProjectSync.isLoadingMoreCloudProjects || isBatchSyncRunning}
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
              </div>
            </details>
          </section>
        </>
      ) : cloudProjectSync.authStatus === "loading" ? (
        <p role="status">{copy.cloudProjectsLoading}</p>
      ) : (
        <p role="status">{copy.cloudProjectsSignInRequired}</p>
      )}
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

async function runCloudActionWithKnownErrorHandling(
  cloudAction: () => Promise<unknown>,
): Promise<void> {
  try {
    await cloudAction();
  } catch (caughtError) {
    if (
      caughtError instanceof CloudAuthError
      || caughtError instanceof CloudProjectRequestError
      || caughtError instanceof CloudOperationCancelledError
    ) {
      return;
    }

    throw caughtError;
  }
}

function assertCloudProjectBatchSyncProgress(
  batchSyncProgress: CloudProjectBatchSyncProgress,
): void {
  if (
    !Number.isInteger(batchSyncProgress.total)
    || batchSyncProgress.total < 1
  ) {
    throw new Error(
      `Cannot render cloud batch total ${JSON.stringify(batchSyncProgress.total)}; expected a positive integer.`,
    );
  }
  if (
    !Number.isInteger(batchSyncProgress.completed)
    || batchSyncProgress.completed < 0
    || batchSyncProgress.completed > batchSyncProgress.total
  ) {
    throw new Error(
      `Cannot render cloud batch completed count ${JSON.stringify(batchSyncProgress.completed)} for total ${JSON.stringify(batchSyncProgress.total)}.`,
    );
  }
  if (
    batchSyncProgress.status !== "running"
    && batchSyncProgress.status !== "completed"
    && batchSyncProgress.status !== "failed"
  ) {
    throw new Error(
      `Cannot render cloud batch status ${JSON.stringify(batchSyncProgress.status)}.`,
    );
  }
  if (!Array.isArray(batchSyncProgress.failedProjectIds)) {
    throw new Error(
      `Cannot render cloud batch failed project IDs ${JSON.stringify(batchSyncProgress.failedProjectIds)}; expected an array.`,
    );
  }

  const seenFailedProjectIds = new Set<string>();
  for (const failedProjectId of batchSyncProgress.failedProjectIds) {
    if (typeof failedProjectId !== "string" || failedProjectId.trim().length === 0) {
      throw new Error(
        `Cannot render cloud batch failed project ID ${JSON.stringify(failedProjectId)}; expected a non-empty string.`,
      );
    }
    if (seenFailedProjectIds.has(failedProjectId)) {
      throw new Error(
        `Cannot render duplicate cloud batch failed project ID ${JSON.stringify(failedProjectId)}.`,
      );
    }
    seenFailedProjectIds.add(failedProjectId);
  }
}

function getLocalProjectLabel(
  localProjects: readonly ReferenceProjectSummary[],
  localProjectId: string,
): string {
  if (localProjectId.trim().length === 0) {
    throw new Error(
      `Cannot display cloud batch project ID ${JSON.stringify(localProjectId)} because it is empty.`,
    );
  }

  const localProject = localProjects.find(
    (candidateProject) => candidateProject.id === localProjectId,
  );
  if (localProject === undefined || localProject.title.trim().length === 0) {
    return localProjectId;
  }

  return localProject.title;
}

function requireCloudErrorMessage(
  cloudProjectSync: CloudProjectSyncView,
): string {
  if (cloudProjectSync.errorMessage === null) {
    throw new Error(
      `Cannot show cloud error for status ${JSON.stringify(cloudProjectSync.status)} and auth status ${JSON.stringify(cloudProjectSync.authStatus)} because the error message is null.`,
    );
  }

  return cloudProjectSync.errorMessage;
}

function shouldOfferGoogleSignIn(
  authStatus: CloudProjectSyncView["authStatus"],
): boolean {
  return authStatus === "signed-out" || authStatus === "error";
}

function hasCloudSyncFailure(cloudProjectSync: CloudProjectSyncView): boolean {
  return cloudProjectSync.authStatus === "error" || cloudProjectSync.status === "error";
}

function createCloudSyncErrorNotice(
  copy: CloudProjectsCopy,
  rawError: string,
) {
  return (
    <div className={styles.error} role="alert">
      <details className={styles.errorDetails}>
        <summary>{copy.cloudStatusErrorSummary}</summary>
        <p>{copy.cloudStatusError(rawError)}</p>
      </details>
    </div>
  );
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
