"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CloudAuthError,
  getPlannerSession,
  signInWithGoogle as requestGoogleSignIn,
  signOutPlannerAccount,
  type PlannerAccount,
} from "../auth/planner-auth-client";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import {
  isCloudProjectContractError,
  type CloudProjectRecord,
  type CloudProjectSummary,
} from "./cloud-project-contract";
import {
  CloudProjectRequestError,
  deleteCloudProject,
  getCloudProject,
  getCloudProjects,
  putCloudProject,
} from "./cloud-project-client";
import {
  CloudProjectLinkStoreError,
  readCloudProjectLinks,
  writeCloudProjectLinks,
  type CloudProjectLink,
} from "./cloud-project-link-store";
import {
  createCloudProjectId,
  createCloudProjectSnapshotFingerprint,
  importCloudProjectAndRebindMissingLocalLink,
  importCloudProjectAsLocalCopy,
  prepareLocalProjectForCloudSync,
  synchronizeLinkedCloudProject,
} from "./cloud-project-sync";

export { CloudAuthError, CloudProjectRequestError };

export type CloudProjectSyncStatus = "loading" | "ready" | "error";
export type CloudAuthStatus = "loading" | "signed-out" | "signed-in" | "error";
export type LocalProjectCloudSyncState = Readonly<{
  status: "none" | "pending" | "synced" | "conflict" | "error";
  revision?: number;
  errorMessage?: string;
}>;

export type CloudProjectSyncView = Readonly<{
  status: CloudProjectSyncStatus;
  authStatus: CloudAuthStatus;
  account: PlannerAccount | null;
  cloudProjects: readonly CloudProjectSummary[];
  hasMoreCloudProjects: boolean;
  isLoadingMoreCloudProjects: boolean;
  localProjectSyncById: Readonly<Record<string, LocalProjectCloudSyncState>>;
  errorMessage: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshCloudProjects: () => Promise<void>;
  loadMoreCloudProjects: () => Promise<void>;
  uploadLocalProject: (localProjectId: string) => Promise<void>;
  onLocalProjectSaved: (localProjectId: string) => Promise<void>;
  openCloudProject: (cloudProjectId: string) => Promise<Readonly<{ localProjectId: string }>>;
  deleteCloudCopy: (cloudProjectId: string) => Promise<void>;
  retrySync: (localProjectId: string) => Promise<void>;
  keepLocalVersion: (localProjectId: string) => Promise<void>;
  useCloudVersion: (localProjectId: string) => Promise<string>;
}>;

export type UseCloudProjectSyncInput = Readonly<{
  workspaceController: ReferenceProjectWorkspaceController;
}>;

type CloudProjectSyncViewState = Pick<
  CloudProjectSyncView,
  | "status"
  | "authStatus"
  | "account"
  | "cloudProjects"
  | "localProjectSyncById"
  | "errorMessage"
> &
  Readonly<{
    nextCloudProjectCursor: string | null;
    isLoadingMoreCloudProjects: boolean;
  }>;

type AccountRequestContext = Readonly<{
  userId: string;
  generation: number;
  abortController: AbortController;
}>;

export class CloudOperationCancelledError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudOperationCancelledError";
  }
}

const INITIAL_VIEW_STATE: CloudProjectSyncViewState = {
  status: "loading",
  authStatus: "loading",
  account: null,
  cloudProjects: [],
  nextCloudProjectCursor: null,
  isLoadingMoreCloudProjects: false,
  localProjectSyncById: {},
  errorMessage: null,
};

export function useCloudProjectSync(
  input: UseCloudProjectSyncInput,
): CloudProjectSyncView {
  assertWorkspaceController(input.workspaceController);

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const workspaceControllerRef = useRef(input.workspaceController);
  workspaceControllerRef.current = input.workspaceController;

  const mountedRef = useRef(false);
  const sessionInitializedRef = useRef(false);
  const sessionInitializationPromiseRef = useRef<Promise<void> | null>(null);
  const initialSessionAbortControllerRef = useRef<AbortController | null>(null);
  const accountRef = useRef<PlannerAccount | null>(null);
  const accountGenerationRef = useRef(0);
  const accountRequestControllersRef = useRef(new Set<AbortController>());
  const accountLinksRef = useRef<readonly CloudProjectLink[]>([]);
  const pendingUploadCloudIdByLocalIdRef = useRef(new Map<string, string>());
  const loadingMoreCloudProjectsRef = useRef(false);
  const loadingMoreUserIdRef = useRef<string | null>(null);
  const authTransitionRef = useRef(false);

  const updateViewState = useCallback(
    (update: (currentState: CloudProjectSyncViewState) => CloudProjectSyncViewState) => {
      if (!mountedRef.current) {
        return;
      }
      setViewState((currentState) => update(currentState));
    },
    [],
  );

  const setLocalProjectState = useCallback(
    (
      localProjectId: string,
      nextLocalProjectState: LocalProjectCloudSyncState,
      context?: AccountRequestContext,
    ) => {
      if (context && !isAccountContextCurrent(context, accountRef, accountGenerationRef)) {
        return;
      }
      updateViewState((currentState) => ({
        ...currentState,
        localProjectSyncById: {
          ...currentState.localProjectSyncById,
          [localProjectId]: nextLocalProjectState,
        },
      }));
    },
    [updateViewState],
  );

  const setGlobalError = useCallback(
    (errorMessage: string, context?: AccountRequestContext) => {
      if (context && !isAccountContextCurrent(context, accountRef, accountGenerationRef)) {
        return;
      }
      updateViewState((currentState) => ({
        ...currentState,
        status: currentState.status === "loading" ? "error" : currentState.status,
        errorMessage,
      }));
    },
    [updateViewState],
  );

  const cancelAccountRequests = useCallback(() => {
    accountGenerationRef.current += 1;
    accountRequestControllersRef.current.forEach((abortController) => {
      abortController.abort();
    });
    accountRequestControllersRef.current.clear();
  }, []);

  const createAccountRequestContext = useCallback((): AccountRequestContext => {
    if (authTransitionRef.current) {
      throw new CloudAuthError(
        "AUTH_TRANSITION_IN_PROGRESS",
        "Cloud sync is paused while the account is changing.",
      );
    }
    const currentAccount = accountRef.current;
    if (currentAccount === null) {
      throw new CloudAuthError(
        "AUTH_REQUIRED",
        "Sign in with Google before using cloud project sync.",
      );
    }

    const abortController = new AbortController();
    accountRequestControllersRef.current.add(abortController);
    return {
      userId: currentAccount.id,
      generation: accountGenerationRef.current,
      abortController,
    };
  }, []);

  const releaseAccountRequestContext = useCallback(
    (context: AccountRequestContext) => {
      accountRequestControllersRef.current.delete(context.abortController);
    },
    [],
  );

  const assertAccountRequestContext = useCallback(
    (context: AccountRequestContext) => {
      if (!isAccountContextCurrent(context, accountRef, accountGenerationRef)) {
        throw new CloudOperationCancelledError(
          `Cloud operation for account ${JSON.stringify(context.userId)} was cancelled after the active account changed.`,
        );
      }
    },
    [],
  );

  const persistAccountLinks = useCallback(
    (
      context: AccountRequestContext,
      nextAccountLinks: readonly CloudProjectLink[],
    ) => {
      assertAccountRequestContext(context);
      writeCloudProjectLinks(context.userId, nextAccountLinks);
      assertAccountRequestContext(context);
      accountLinksRef.current = nextAccountLinks;
    },
    [assertAccountRequestContext],
  );

  const loadAccountCloudState = useCallback(
    async (account: PlannerAccount, context: AccountRequestContext) => {
      const storedAccountLinks = readCloudProjectLinks(account.id);
      assertAccountRequestContext(context);
      accountLinksRef.current = storedAccountLinks;
      await hydrateLocalProjectStatuses(
        storedAccountLinks,
        workspaceControllerRef.current,
        (localProjectId, localState) =>
          setLocalProjectState(localProjectId, localState, context),
        assertAccountRequestContext,
        context,
      );
      assertAccountRequestContext(context);

      const cloudProjectPage = await getCloudProjects(
        context.userId,
        context.abortController.signal,
      );
      assertAccountRequestContext(context);
      updateViewState((currentState) => ({
        ...currentState,
        status: "ready",
        authStatus: "signed-in",
        account,
        cloudProjects: cloudProjectPage.projects,
        nextCloudProjectCursor: cloudProjectPage.nextCursor,
        isLoadingMoreCloudProjects: false,
        errorMessage: null,
      }));
    },
    [
      assertAccountRequestContext,
      setLocalProjectState,
      updateViewState,
    ],
  );

  const applyPlannerSession = useCallback(
    async (nextAccount: PlannerAccount | null) => {
      const previousAccount = accountRef.current;
      const accountChanged = previousAccount?.id !== nextAccount?.id;
      if (accountChanged) {
        cancelAccountRequests();
        accountLinksRef.current = [];
        accountRef.current = nextAccount;
        pendingUploadCloudIdByLocalIdRef.current.clear();
        updateViewState(() => ({
          status: nextAccount === null ? "ready" : "loading",
          authStatus: nextAccount === null ? "signed-out" : "signed-in",
          account: nextAccount,
          cloudProjects: [],
          nextCloudProjectCursor: null,
          isLoadingMoreCloudProjects: false,
          localProjectSyncById: {},
          errorMessage: null,
        }));
        loadingMoreCloudProjectsRef.current = false;
        loadingMoreUserIdRef.current = null;
      } else if (nextAccount !== null) {
        accountRef.current = nextAccount;
        updateViewState((currentState) => ({
          ...currentState,
          account: nextAccount,
          authStatus: "signed-in",
          errorMessage: null,
        }));
      } else {
        updateViewState((currentState) => ({
          ...currentState,
          status: "ready",
          authStatus: "signed-out",
          account: null,
          cloudProjects: [],
          nextCloudProjectCursor: null,
          isLoadingMoreCloudProjects: false,
          localProjectSyncById: {},
          errorMessage: null,
        }));
        loadingMoreCloudProjectsRef.current = false;
        loadingMoreUserIdRef.current = null;
      }

      if (nextAccount === null) {
        accountRef.current = null;
        accountLinksRef.current = [];
        return;
      }

      const context = createAccountRequestContext();
      try {
        await loadAccountCloudState(nextAccount, context);
      } finally {
        releaseAccountRequestContext(context);
      }
    },
    [
      cancelAccountRequests,
      createAccountRequestContext,
      loadAccountCloudState,
      releaseAccountRequestContext,
      updateViewState,
    ],
  );

  const initializePlannerSession = useCallback(async () => {
    const abortController = new AbortController();
    initialSessionAbortControllerRef.current = abortController;
    let initializedAccountId: string | null | undefined;
    try {
      const session = await getPlannerSession(abortController.signal);
      if (!mountedRef.current) {
        return;
      }
      initializedAccountId = session.user?.id ?? null;
      await applyPlannerSession(session.user);
    } catch (error) {
      if (isAbortError(error) && abortController.signal.aborted) {
        return;
      }
      if (
        isKnownCloudError(error) &&
        (error instanceof CloudOperationCancelledError ||
          (initializedAccountId !== undefined &&
            accountRef.current?.id !== initializedAccountId))
      ) {
        return;
      }
      if (!isKnownCloudError(error)) {
        throw error;
      }
      updateViewState((currentState) => ({
        ...currentState,
        status: "error",
        authStatus: error instanceof CloudAuthError ? "error" : currentState.authStatus,
        errorMessage: error.message,
      }));
    } finally {
      if (initialSessionAbortControllerRef.current === abortController) {
        initialSessionAbortControllerRef.current = null;
      }
      sessionInitializedRef.current = !abortController.signal.aborted;
    }
  }, [applyPlannerSession, updateViewState]);

  const ensurePlannerSessionLoaded = useCallback(async () => {
    if (sessionInitializedRef.current) {
      return;
    }
    if (sessionInitializationPromiseRef.current !== null) {
      return sessionInitializationPromiseRef.current;
    }
    const initializationPromise = initializePlannerSession();
    sessionInitializationPromiseRef.current = initializationPromise;
    try {
      await initializationPromise;
    } finally {
      if (sessionInitializationPromiseRef.current === initializationPromise) {
        sessionInitializationPromiseRef.current = null;
      }
    }
  }, [initializePlannerSession]);

  const withAccountRequest = useCallback(
    async <TResult,>(
      operationName: string,
      operation: (context: AccountRequestContext) => Promise<TResult>,
      localProjectId?: string,
      accountChangedFallback?: () => TResult,
    ): Promise<TResult> => {
      let context: AccountRequestContext | undefined;
      let accountIdAtActionStart: string | null | undefined;
      let sessionRequestController: AbortController | undefined;
      try {
        await ensurePlannerSessionLoaded();
        if (authTransitionRef.current) {
          throw new CloudAuthError(
            "AUTH_TRANSITION_IN_PROGRESS",
            "Cloud sync is paused while the account is changing.",
          );
        }

        sessionRequestController = new AbortController();
        accountRequestControllersRef.current.add(sessionRequestController);
        accountIdAtActionStart = accountRef.current?.id ?? null;
        const session = await getPlannerSession(sessionRequestController.signal);
        if (sessionRequestController.signal.aborted) {
          throw new CloudOperationCancelledError(
            `Cloud action ${JSON.stringify(operationName)} was cancelled while refreshing the active account.`,
          );
        }
        const freshAccountId = session.user?.id ?? null;
        if (freshAccountId !== accountIdAtActionStart) {
          await applyPlannerSession(session.user);
          if (accountIdAtActionStart === null && session.user !== null) {
            // The initial signed-out state has no previous account whose local project could leak.
          } else if (accountChangedFallback !== undefined) {
            return accountChangedFallback();
          } else {
            throw new CloudProjectRequestError(
              "ACCOUNT_CHANGED",
              409,
              `Cloud action ${JSON.stringify(operationName)} was cancelled because the active account changed from ${JSON.stringify(accountIdAtActionStart)} to ${JSON.stringify(freshAccountId)}. Review the current account and retry explicitly.`,
            );
          }
        } else if (session.user !== null) {
          accountRef.current = session.user;
          updateViewState((currentState) => ({
            ...currentState,
            status: currentState.status === "error" ? "ready" : currentState.status,
            authStatus: "signed-in",
            account: session.user,
            errorMessage: null,
          }));
        }

        context = createAccountRequestContext();
        return await operation(context);
      } catch (error) {
        const normalizedError = context === undefined
          ? sessionRequestController === undefined
            ? error
            : normalizeSessionCheckError(error, sessionRequestController, operationName)
          : normalizeAccountRequestError(error, context, operationName);
        if (isKnownCloudError(normalizedError)) {
          if (
            localProjectId !== undefined &&
            (context !== undefined ||
              accountRef.current?.id === accountIdAtActionStart)
          ) {
            setLocalProjectState(
              localProjectId,
              createLocalProjectFailureState(localProjectId, normalizedError, accountLinksRef.current),
              context,
            );
          }
          if (!(normalizedError instanceof CloudOperationCancelledError)) {
            setGlobalError(normalizedError.message, context);
          }
        }
        throw normalizedError;
      } finally {
        if (context !== undefined) {
          releaseAccountRequestContext(context);
        }
        if (sessionRequestController !== undefined) {
          accountRequestControllersRef.current.delete(sessionRequestController);
        }
      }
    },
    [
      applyPlannerSession,
      createAccountRequestContext,
      ensurePlannerSessionLoaded,
      releaseAccountRequestContext,
      setGlobalError,
      setLocalProjectState,
      updateViewState,
    ],
  );

  const refreshCloudProjects = useCallback(async () => {
    await withAccountRequest("refresh cloud project list", async (context) => {
      loadingMoreCloudProjectsRef.current = false;
      loadingMoreUserIdRef.current = null;
      updateViewState((currentState) => ({
        ...currentState,
        status: "loading",
        isLoadingMoreCloudProjects: false,
        errorMessage: null,
      }));
      const cloudProjectPage = await getCloudProjects(
        context.userId,
        context.abortController.signal,
      );
      assertAccountRequestContext(context);
      updateViewState((currentState) => ({
        ...currentState,
        status: "ready",
        cloudProjects: cloudProjectPage.projects,
        nextCloudProjectCursor: cloudProjectPage.nextCursor,
        errorMessage: null,
      }));
    }, undefined, () => undefined);
  }, [assertAccountRequestContext, updateViewState, withAccountRequest]);

  const loadMoreCloudProjects = useCallback(async () => {
    await ensurePlannerSessionLoaded();
    const activeAccount = accountRef.current;
    if (activeAccount === null) {
      throw new CloudAuthError(
        "AUTH_REQUIRED",
        "Sign in with Google before loading more cloud projects.",
      );
    }
    if (loadingMoreCloudProjectsRef.current) {
      return;
    }
    const afterCloudProjectId = viewState.nextCloudProjectCursor;
    if (afterCloudProjectId === null) {
      return;
    }

    loadingMoreCloudProjectsRef.current = true;
    loadingMoreUserIdRef.current = activeAccount.id;
    updateViewState((currentState) => ({
      ...currentState,
      isLoadingMoreCloudProjects: true,
      errorMessage: null,
    }));
    try {
      await withAccountRequest("load more cloud projects", async (context) => {
        const cloudProjectPage = await getCloudProjects(
          context.userId,
          context.abortController.signal,
          afterCloudProjectId,
        );
        assertAccountRequestContext(context);
        if (cloudProjectPage.nextCursor === afterCloudProjectId) {
          throw new CloudProjectRequestError(
            "INVALID_CURSOR_PROGRESS",
            200,
            `Cloud project page cursor did not advance beyond ${JSON.stringify(afterCloudProjectId)}.`,
          );
        }
        updateViewState((currentState) => {
          if (currentState.account?.id !== context.userId) {
            return currentState;
          }
          return {
            ...currentState,
            status: "ready",
            cloudProjects: appendCloudProjectPage(
              currentState.cloudProjects,
              cloudProjectPage.projects,
            ),
            nextCloudProjectCursor: cloudProjectPage.nextCursor,
            errorMessage: null,
          };
        });
      }, undefined, () => undefined);
    } finally {
      if (loadingMoreUserIdRef.current === activeAccount.id) {
        loadingMoreCloudProjectsRef.current = false;
        loadingMoreUserIdRef.current = null;
        updateViewState((currentState) =>
          currentState.account?.id === activeAccount.id
            ? { ...currentState, isLoadingMoreCloudProjects: false }
            : currentState,
        );
      }
    }
  }, [
    assertAccountRequestContext,
    ensurePlannerSessionLoaded,
    updateViewState,
    viewState.nextCloudProjectCursor,
    withAccountRequest,
  ]);

  const signInWithGoogle = useCallback(async () => {
    authTransitionRef.current = true;
    updateViewState((currentState) => ({
      ...currentState,
      authStatus: "loading",
      errorMessage: null,
    }));
    try {
      await requestGoogleSignIn();
      authTransitionRef.current = false;
      const session = await getPlannerSession();
      await applyPlannerSession(session.user);
    } catch (error) {
      if (!isKnownCloudError(error)) {
        throw error;
      }
      updateViewState((currentState) => ({
        ...currentState,
        status: "error",
        authStatus: "signed-out",
        errorMessage: error.message,
      }));
      throw error;
    } finally {
      authTransitionRef.current = false;
    }
  }, [applyPlannerSession, updateViewState]);

  const signOut = useCallback(async () => {
    authTransitionRef.current = true;
    cancelAccountRequests();
    updateViewState((currentState) => ({
      ...currentState,
      authStatus: "loading",
      errorMessage: null,
    }));
    try {
      await signOutPlannerAccount();
      authTransitionRef.current = false;
      await applyPlannerSession(null);
      sessionInitializedRef.current = true;
    } catch (error) {
      if (!isKnownCloudError(error)) {
        throw error;
      }
      updateViewState((currentState) => ({
        ...currentState,
        authStatus: accountRef.current === null ? "signed-out" : "signed-in",
        status: "error",
        errorMessage: error.message,
      }));
      throw error;
    } finally {
      authTransitionRef.current = false;
    }
  }, [applyPlannerSession, cancelAccountRequests, updateViewState]);

  const uploadLocalProjectWithContext = useCallback(
    async (localProjectId: string, context: AccountRequestContext) => {
      if (findLinkByLocalProjectId(accountLinksRef.current, localProjectId)) {
        throw new CloudProjectRequestError(
          "LOCAL_PROJECT_ALREADY_LINKED",
          409,
          `Local project ${JSON.stringify(localProjectId)} is already linked to a cloud project.`,
        );
      }

      setLocalProjectState(localProjectId, { status: "pending" }, context);
      const preparedProject = prepareLocalProjectForCloudSync(
        workspaceControllerRef.current,
        localProjectId,
      );
      const localSnapshotFingerprint = await createCloudProjectSnapshotFingerprint(
        preparedProject,
      );
      assertAccountRequestContext(context);

      const cloudProjectId =
        pendingUploadCloudIdByLocalIdRef.current.get(localProjectId) ??
        createCloudProjectId();
      pendingUploadCloudIdByLocalIdRef.current.set(localProjectId, cloudProjectId);

      let cloudRecord: CloudProjectRecord;
      try {
        cloudRecord = await putCloudProject(
          context.userId,
          cloudProjectId,
          { expectedRevision: 0, projectDocument: preparedProject },
          context.abortController.signal,
        );
      } catch (error) {
        if (
          !(error instanceof CloudProjectRequestError) ||
          error.code !== "REVISION_CONFLICT"
        ) {
          throw error;
        }
        const existingCloudRecord = await getCloudProject(
          context.userId,
          cloudProjectId,
          context.abortController.signal,
        );
        const existingFingerprint = await createCloudProjectSnapshotFingerprint(
          existingCloudRecord.projectDocument,
        );
        if (existingFingerprint !== localSnapshotFingerprint) {
          throw new CloudProjectRequestError(
            "REVISION_CONFLICT",
            409,
            `Cloud project ${JSON.stringify(cloudProjectId)} already exists with a different snapshot; the local project was not overwritten.`,
          );
        }
        cloudRecord = existingCloudRecord;
      }

      assertAccountRequestContext(context);
      const syncedSnapshot = await createCloudProjectSnapshotFingerprint(
        cloudRecord.projectDocument,
      );
      const nextLink: CloudProjectLink = {
        localProjectId,
        cloudProjectId: cloudRecord.id,
        revision: cloudRecord.revision,
        lastSyncedSnapshot: syncedSnapshot,
      };
      persistAccountLinks(context, [...accountLinksRef.current, nextLink]);
      pendingUploadCloudIdByLocalIdRef.current.delete(localProjectId);
      setLocalProjectState(
        localProjectId,
        { status: "synced", revision: cloudRecord.revision },
        context,
      );
      replaceCloudProjectSummary(cloudRecord, context, updateViewState);
    },
    [
      assertAccountRequestContext,
      persistAccountLinks,
      setLocalProjectState,
      updateViewState,
    ],
  );

  const uploadLocalProject = useCallback(
    async (localProjectId: string) => {
      assertLocalProjectId(localProjectId);
      await withAccountRequest(
        "upload local project",
        (context) => uploadLocalProjectWithContext(localProjectId, context),
        localProjectId,
      );
    },
    [uploadLocalProjectWithContext, withAccountRequest],
  );

  const syncLinkedLocalProject = useCallback(
    async (localProjectId: string, context: AccountRequestContext) => {
      const cloudProjectLink = findLinkByLocalProjectId(
        accountLinksRef.current,
        localProjectId,
      );
      if (cloudProjectLink === undefined) {
        setLocalProjectState(localProjectId, { status: "none" }, context);
        return;
      }

      setLocalProjectState(
        localProjectId,
        { status: "pending", revision: cloudProjectLink.revision },
        context,
      );
      const syncResult = await synchronizeLinkedCloudProject({
        workspaceController: workspaceControllerRef.current,
        cloudProjectLink,
        expectedAccountId: context.userId,
        signal: context.abortController.signal,
      });
      assertAccountRequestContext(context);
      if (!syncResult.changed) {
        setLocalProjectState(
          localProjectId,
          { status: "synced", revision: cloudProjectLink.revision },
          context,
        );
        return;
      }
      const cloudRecord = syncResult.cloudRecord;
      if (cloudRecord === null) {
        throw new Error(
          `Cloud sync for local project ${JSON.stringify(localProjectId)} reported a changed snapshot without a cloud record.`,
        );
      }
      const nextLinks = accountLinksRef.current.map((currentLink) =>
        currentLink.localProjectId === localProjectId
          ? syncResult.cloudProjectLink
          : currentLink,
      );
      persistAccountLinks(context, nextLinks);
      setLocalProjectState(
        localProjectId,
        { status: "synced", revision: cloudRecord.revision },
        context,
      );
      replaceCloudProjectSummary(cloudRecord, context, updateViewState);
    },
    [
      assertAccountRequestContext,
      persistAccountLinks,
      setLocalProjectState,
      updateViewState,
    ],
  );

  const syncCurrentSavedProject = useCallback(
    async (localProjectId: string, context: AccountRequestContext) => {
      if (findLinkByLocalProjectId(accountLinksRef.current, localProjectId) === undefined) {
        await uploadLocalProjectWithContext(localProjectId, context);
        return;
      }
      await syncLinkedLocalProject(localProjectId, context);
    },
    [syncLinkedLocalProject, uploadLocalProjectWithContext],
  );

  const retrySync = useCallback(
    async (localProjectId: string) => {
      assertLocalProjectId(localProjectId);
      await withAccountRequest(
        "retry local project sync",
        (context) => syncCurrentSavedProject(localProjectId, context),
        localProjectId,
      );
    },
    [syncCurrentSavedProject, withAccountRequest],
  );

  const prepareSavedProjectAccount = useCallback(
    async (localProjectId: string): Promise<boolean> => {
      await ensurePlannerSessionLoaded();
      if (authTransitionRef.current) {
        return false;
      }
      if (accountRef.current !== null) {
        return true;
      }

      const sessionRequestController = new AbortController();
      accountRequestControllersRef.current.add(sessionRequestController);
      try {
        const session = await getPlannerSession(sessionRequestController.signal);
        if (sessionRequestController.signal.aborted || authTransitionRef.current) {
          return false;
        }
        if (session.user === null) {
          return false;
        }
        await applyPlannerSession(session.user);
        return true;
      } catch (error) {
        const normalizedError = normalizeSessionCheckError(
          error,
          sessionRequestController,
          "sync saved local project",
        );
        if (normalizedError instanceof CloudOperationCancelledError) {
          return false;
        }
        if (!isKnownCloudError(normalizedError)) {
          throw normalizedError;
        }
        setLocalProjectState(
          localProjectId,
          createLocalProjectFailureState(
            localProjectId,
            normalizedError,
            accountLinksRef.current,
          ),
        );
        setGlobalError(normalizedError.message);
        return false;
      } finally {
        accountRequestControllersRef.current.delete(sessionRequestController);
      }
    },
    [
      applyPlannerSession,
      ensurePlannerSessionLoaded,
      setGlobalError,
      setLocalProjectState,
    ],
  );

  const onLocalProjectSaved = useCallback(
    async (localProjectId: string) => {
      assertLocalProjectId(localProjectId);
      const hasActiveAccount = await prepareSavedProjectAccount(localProjectId);
      if (!hasActiveAccount) {
        return;
      }
      try {
        await withAccountRequest(
          "sync saved local project",
          (context) => syncCurrentSavedProject(localProjectId, context),
          localProjectId,
        );
      } catch (error) {
        if (!isKnownCloudError(error)) {
          throw error;
        }
      }
    },
    [
      prepareSavedProjectAccount,
      syncCurrentSavedProject,
      withAccountRequest,
    ],
  );

  const keepLocalVersion = useCallback(
    async (localProjectId: string) => {
      assertLocalProjectId(localProjectId);
      await withAccountRequest(
        "keep local project version",
        async (context) => {
          const currentLink = findLinkByLocalProjectId(
            accountLinksRef.current,
            localProjectId,
          );
          if (currentLink === undefined) {
            throw new CloudProjectRequestError(
              "LOCAL_PROJECT_NOT_LINKED",
              404,
              `Local project ${JSON.stringify(localProjectId)} has no cloud link to detach.`,
            );
          }
          const nextLinks = accountLinksRef.current.filter(
            (link) => link.localProjectId !== localProjectId,
          );
          persistAccountLinks(context, nextLinks);
          setLocalProjectState(localProjectId, { status: "none" }, context);
        },
        localProjectId,
      );
    },
    [persistAccountLinks, setLocalProjectState, withAccountRequest],
  );

  const useCloudVersion = useCallback(
    async (localProjectId: string): Promise<string> => {
      assertLocalProjectId(localProjectId);
      return withAccountRequest(
        "use cloud project version",
        async (context) => {
          const existingLink = findLinkByLocalProjectId(
            accountLinksRef.current,
            localProjectId,
          );
          if (existingLink === undefined) {
            throw new CloudProjectRequestError(
              "LOCAL_PROJECT_NOT_LINKED",
              404,
              `Local project ${JSON.stringify(localProjectId)} has no cloud link to resolve.`,
            );
          }

          const cloudRecord = await getCloudProject(
            context.userId,
            existingLink.cloudProjectId,
            context.abortController.signal,
          );
          assertAccountRequestContext(context);
          const importedLocalProjectId = importCloudProjectAsLocalCopy(
            workspaceControllerRef.current,
            cloudRecord,
            localProjectId,
          );
          const syncedSnapshot = await createCloudProjectSnapshotFingerprint(
            cloudRecord.projectDocument,
          );
          assertAccountRequestContext(context);

          const nextLink: CloudProjectLink = {
            localProjectId: importedLocalProjectId,
            cloudProjectId: cloudRecord.id,
            revision: cloudRecord.revision,
            lastSyncedSnapshot: syncedSnapshot,
          };
          const nextLinks = [
            ...accountLinksRef.current.filter(
              (link) => link.cloudProjectId !== cloudRecord.id,
            ),
            nextLink,
          ];
          persistAccountLinks(context, nextLinks);
          setLocalProjectState(localProjectId, { status: "none" }, context);
          setLocalProjectState(
            importedLocalProjectId,
            { status: "synced", revision: cloudRecord.revision },
            context,
          );
          replaceCloudProjectSummary(cloudRecord, context, updateViewState);
          return importedLocalProjectId;
        },
        localProjectId,
      );
    },
    [
      assertAccountRequestContext,
      persistAccountLinks,
      setLocalProjectState,
      updateViewState,
      withAccountRequest,
    ],
  );

  const openCloudProject = useCallback(
    async (cloudProjectId: string) => {
      assertCloudProjectId(cloudProjectId);
      return withAccountRequest("open cloud project", async (context) => {
        const cloudRecord = await getCloudProject(
          context.userId,
          cloudProjectId,
          context.abortController.signal,
        );
        assertAccountRequestContext(context);
        const existingLink = findLinkByCloudProjectId(
          accountLinksRef.current,
          cloudProjectId,
        );

        if (existingLink !== undefined) {
          const localProjectExists = workspaceControllerRef.current
            .getState()
            .projectSummaries.some(
              (summary) => summary.id === existingLink.localProjectId,
            );
          if (localProjectExists) {
            const localProject = prepareLocalProjectForCloudSync(
              workspaceControllerRef.current,
              existingLink.localProjectId,
            );
            const localSnapshot = await createCloudProjectSnapshotFingerprint(
              localProject,
            );
            const cloudSnapshot = await createCloudProjectSnapshotFingerprint(
              cloudRecord.projectDocument,
            );
            assertAccountRequestContext(context);

            if (
              localSnapshot === existingLink.lastSyncedSnapshot &&
              cloudSnapshot === existingLink.lastSyncedSnapshot &&
              cloudRecord.revision === existingLink.revision
            ) {
              workspaceControllerRef.current.openProject(existingLink.localProjectId);
              return { localProjectId: existingLink.localProjectId };
            }

            setLocalProjectState(
              existingLink.localProjectId,
              {
                status: "conflict",
                revision: existingLink.revision,
                errorMessage: "The local project and cloud copy have changed separately.",
              },
              context,
            );
          } else {
            const reboundCloudProject =
              await importCloudProjectAndRebindMissingLocalLink({
                workspaceController: workspaceControllerRef.current,
                cloudProjectLinks: accountLinksRef.current,
                missingLocalProjectLink: existingLink,
                latestCloudRecord: cloudRecord,
              });
            assertAccountRequestContext(context);
            persistAccountLinks(context, reboundCloudProject.cloudProjectLinks);
            setLocalProjectState(
              reboundCloudProject.importedLocalProjectId,
              { status: "synced", revision: cloudRecord.revision },
              context,
            );
            replaceCloudProjectSummary(cloudRecord, context, updateViewState);
            return { localProjectId: reboundCloudProject.importedLocalProjectId };
          }
        }

        const importedLocalProjectId = importCloudProjectAsLocalCopy(
          workspaceControllerRef.current,
          cloudRecord,
        );
        if (existingLink === undefined) {
          const syncedSnapshot = await createCloudProjectSnapshotFingerprint(
            cloudRecord.projectDocument,
          );
          assertAccountRequestContext(context);
          const nextLink: CloudProjectLink = {
            localProjectId: importedLocalProjectId,
            cloudProjectId: cloudRecord.id,
            revision: cloudRecord.revision,
            lastSyncedSnapshot: syncedSnapshot,
          };
          persistAccountLinks(context, [...accountLinksRef.current, nextLink]);
          setLocalProjectState(
            importedLocalProjectId,
            { status: "synced", revision: cloudRecord.revision },
            context,
          );
        } else {
          setLocalProjectState(
            importedLocalProjectId,
            { status: "none" },
            context,
          );
        }
        replaceCloudProjectSummary(cloudRecord, context, updateViewState);
        return { localProjectId: importedLocalProjectId };
      });
    },
    [
      assertAccountRequestContext,
      persistAccountLinks,
      setLocalProjectState,
      updateViewState,
      withAccountRequest,
    ],
  );

  const deleteCloudCopy = useCallback(
    async (cloudProjectId: string) => {
      assertCloudProjectId(cloudProjectId);
      await withAccountRequest("delete cloud project copy", async (context) => {
        const linkedProject = findLinkByCloudProjectId(
          accountLinksRef.current,
          cloudProjectId,
        );
        const cloudSummary = viewState.cloudProjects.find(
          (summary) => summary.id === cloudProjectId,
        );
        if (cloudSummary === undefined && linkedProject === undefined) {
          throw new CloudProjectRequestError(
            "CLOUD_PROJECT_NOT_LOADED",
            404,
            `Cloud project ${JSON.stringify(cloudProjectId)} is not in the loaded project list or linked locally.`,
          );
        }
        const revision = cloudSummary?.revision ?? linkedProject?.revision;
        if (revision === undefined) {
          throw new CloudProjectRequestError(
            "CLOUD_PROJECT_REVISION_MISSING",
            0,
            `Cloud project ${JSON.stringify(cloudProjectId)} has no revision to guard deletion.`,
          );
        }

        await deleteCloudProject(
          context.userId,
          cloudProjectId,
          revision,
          context.abortController.signal,
        );
        assertAccountRequestContext(context);
        const nextLinks = accountLinksRef.current.filter(
          (link) => link.cloudProjectId !== cloudProjectId,
        );
        if (nextLinks.length !== accountLinksRef.current.length) {
          persistAccountLinks(context, nextLinks);
        }
        updateViewState((currentState) => {
          const nextLocalStates = { ...currentState.localProjectSyncById };
          if (linkedProject !== undefined) {
            nextLocalStates[linkedProject.localProjectId] = { status: "none" };
          }
          return {
            ...currentState,
            status: "ready",
            cloudProjects: currentState.cloudProjects.filter(
              (summary) => summary.id !== cloudProjectId,
            ),
            localProjectSyncById: nextLocalStates,
            errorMessage: null,
          };
        });
      });
    },
    [
      assertAccountRequestContext,
      persistAccountLinks,
      updateViewState,
      viewState.cloudProjects,
      withAccountRequest,
    ],
  );

  useEffect(() => {
    mountedRef.current = true;
    void ensurePlannerSessionLoaded();

    return () => {
      mountedRef.current = false;
      initialSessionAbortControllerRef.current?.abort();
      initialSessionAbortControllerRef.current = null;
      sessionInitializedRef.current = false;
      sessionInitializationPromiseRef.current = null;
      cancelAccountRequests();
    };
  }, [cancelAccountRequests, ensurePlannerSessionLoaded]);

  const { nextCloudProjectCursor, ...visibleViewState } = viewState;
  return {
    ...visibleViewState,
    hasMoreCloudProjects: nextCloudProjectCursor !== null,
    signInWithGoogle,
    signOut,
    refreshCloudProjects,
    loadMoreCloudProjects,
    uploadLocalProject,
    onLocalProjectSaved,
    openCloudProject,
    deleteCloudCopy,
    retrySync,
    keepLocalVersion,
    useCloudVersion,
  };
}

function findLinkByLocalProjectId(
  cloudProjectLinks: readonly CloudProjectLink[],
  localProjectId: string,
): CloudProjectLink | undefined {
  return cloudProjectLinks.find(
    (link) => link.localProjectId === localProjectId,
  );
}

function findLinkByCloudProjectId(
  cloudProjectLinks: readonly CloudProjectLink[],
  cloudProjectId: string,
): CloudProjectLink | undefined {
  return cloudProjectLinks.find(
    (link) => link.cloudProjectId === cloudProjectId,
  );
}

function appendCloudProjectPage(
  existingCloudProjects: readonly CloudProjectSummary[],
  nextCloudProjects: readonly CloudProjectSummary[],
): readonly CloudProjectSummary[] {
  const cloudProjectsById = new Map(
    existingCloudProjects.map((cloudProject) => [cloudProject.id, cloudProject]),
  );
  nextCloudProjects.forEach((cloudProject) => {
    cloudProjectsById.set(cloudProject.id, cloudProject);
  });
  return [...cloudProjectsById.values()];
}

function replaceCloudProjectSummary(
  cloudRecord: CloudProjectRecord,
  context: AccountRequestContext,
  updateViewState: (
    update: (currentState: CloudProjectSyncViewState) => CloudProjectSyncViewState,
  ) => void,
): void {
  if (!isContextCurrentWithoutRefs(context)) {
    return;
  }
  updateViewState((currentState) => {
    if (currentState.account?.id !== context.userId) {
      return currentState;
    }
    const nextCloudProjects = currentState.cloudProjects.filter(
      (summary) => summary.id !== cloudRecord.id,
    );
    nextCloudProjects.unshift({
      id: cloudRecord.id,
      title: cloudRecord.title,
      revision: cloudRecord.revision,
      updatedAt: cloudRecord.updatedAt,
      mapCount: cloudRecord.mapCount,
    });
    return {
      ...currentState,
      status: "ready",
      cloudProjects: nextCloudProjects,
      errorMessage: null,
    };
  });
}

function isContextCurrentWithoutRefs(context: AccountRequestContext): boolean {
  return !context.abortController.signal.aborted;
}

async function hydrateLocalProjectStatuses(
  cloudProjectLinks: readonly CloudProjectLink[],
  workspaceController: ReferenceProjectWorkspaceController,
  setStatus: (
    localProjectId: string,
    state: LocalProjectCloudSyncState,
  ) => void,
  assertContext: (context: AccountRequestContext) => void,
  context: AccountRequestContext,
): Promise<void> {
  const localProjectIds = new Set(
    workspaceController
      .getState()
      .projectSummaries.map((projectSummary) => projectSummary.id),
  );
  for (const cloudProjectLink of cloudProjectLinks) {
    assertContext(context);
    if (!localProjectIds.has(cloudProjectLink.localProjectId)) {
      continue;
    }
    const localProjectDocument = prepareLocalProjectForCloudSync(
      workspaceController,
      cloudProjectLink.localProjectId,
    );
    const currentFingerprint = await createCloudProjectSnapshotFingerprint(
      localProjectDocument,
    );
    assertContext(context);
    setStatus(cloudProjectLink.localProjectId, {
      status:
        currentFingerprint === cloudProjectLink.lastSyncedSnapshot
          ? "synced"
          : "pending",
      revision: cloudProjectLink.revision,
    });
  }
}

function createLocalProjectFailureState(
  localProjectId: string,
  error: Error,
  cloudProjectLinks: readonly CloudProjectLink[],
): LocalProjectCloudSyncState {
  const link = findLinkByLocalProjectId(cloudProjectLinks, localProjectId);
  return {
    status:
      error instanceof CloudProjectRequestError &&
      error.code === "REVISION_CONFLICT"
        ? "conflict"
        : "error",
    ...(link === undefined ? {} : { revision: link.revision }),
    errorMessage: error.message,
  };
}

function normalizeAccountRequestError(
  error: unknown,
  context: AccountRequestContext,
  operationName: string,
): unknown {
  if (
    context.abortController.signal.aborted &&
    isAbortError(error)
  ) {
    return new CloudOperationCancelledError(
      `Cloud operation ${JSON.stringify(operationName)} for account ${JSON.stringify(context.userId)} was cancelled.`,
    );
  }
  if (!isAccountContextCurrentWithGenerationOnly(context)) {
    return new CloudOperationCancelledError(
      `Cloud operation ${JSON.stringify(operationName)} for account ${JSON.stringify(context.userId)} completed after the active account changed.`,
    );
  }
  return error;
}

function normalizeSessionCheckError(
  error: unknown,
  sessionRequestController: AbortController,
  operationName: string,
): unknown {
  if (sessionRequestController.signal.aborted && isAbortError(error)) {
    return new CloudOperationCancelledError(
      `Cloud action ${JSON.stringify(operationName)} was cancelled while refreshing the active account.`,
    );
  }
  return error;
}

function isAccountContextCurrent(
  context: AccountRequestContext,
  accountRef: { current: PlannerAccount | null },
  accountGenerationRef: { current: number },
): boolean {
  return (
    accountRef.current?.id === context.userId &&
    accountGenerationRef.current === context.generation &&
    !context.abortController.signal.aborted
  );
}

function isAccountContextCurrentWithGenerationOnly(
  context: AccountRequestContext,
): boolean {
  return !context.abortController.signal.aborted;
}

function isKnownCloudError(error: unknown): error is Error {
  return (
    error instanceof CloudAuthError ||
    error instanceof CloudProjectRequestError ||
    error instanceof CloudProjectLinkStoreError ||
    error instanceof CloudOperationCancelledError ||
    isCloudProjectContractError(error)
  );
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "AbortError"
  );
}

function assertWorkspaceController(
  workspaceController: ReferenceProjectWorkspaceController,
): void {
  if (
    typeof workspaceController !== "object" ||
    workspaceController === null ||
    typeof workspaceController.getState !== "function" ||
    typeof workspaceController.exportProject !== "function" ||
    typeof workspaceController.importProject !== "function" ||
    typeof workspaceController.openProject !== "function"
  ) {
    throw new TypeError(
      `Cloud sync requires a workspace controller with getState, exportProject, importProject, and openProject methods. Received: ${describeValue(workspaceController)}.`,
    );
  }
}

function assertLocalProjectId(localProjectId: string): void {
  if (typeof localProjectId !== "string" || localProjectId.length === 0) {
    throw new CloudProjectRequestError(
      "INVALID_LOCAL_PROJECT_ID",
      0,
      `Local project ID must be a non-empty string. Received: ${describeValue(localProjectId)}.`,
    );
  }
}

function assertCloudProjectId(cloudProjectId: string): void {
  if (typeof cloudProjectId !== "string" || cloudProjectId.length === 0) {
    throw new CloudProjectRequestError(
      "INVALID_PROJECT_ID",
      0,
      `Cloud project ID must be a non-empty string. Received: ${describeValue(cloudProjectId)}.`,
    );
  }
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }
  if (rawValue === undefined) {
    return "undefined";
  }
  const serializedValue = JSON.stringify(rawValue);
  return serializedValue ?? String(rawValue);
}

