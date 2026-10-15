import { afterEach, describe, expect, it, vi } from "vitest";
import type { CloudProjectRecord } from "../../src/cloud-sync/cloud-project-contract";
import type { ReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

afterEach(() => {
  vi.doUnmock("react");
  vi.doUnmock("../../src/auth/planner-auth-client");
  vi.resetModules();
  vi.unstubAllGlobals();
});

describe("useCloudProjectSync", () => {
  it("uploads after a local save, retries a failed first upload, then CAS-syncs later saves", async () => {
    const hookRuntime = createCloudSyncHookRuntime();
    const storedProject = referenceProjectDocumentFixture.projects[0];
    if (storedProject === undefined) {
      throw new Error("Cloud sync hook fixture is missing project-alpha.");
    }
    const localStoredProject = {
      ...storedProject,
      id: "local-7",
      project: {
        ...storedProject.project,
        maps: storedProject.project.maps.map((projectMap) => ({
          ...projectMap,
          thumbnail: `/api/projects/local-7/maps/${projectMap.id}/thumbnail`,
        })),
      },
    };
    let exportedProjectDocument = JSON.stringify({
      version: 1,
      projects: [localStoredProject],
    });
    let putAttemptCount = 0;
    let serverStoredCloudRecord: CloudProjectRecord | null = null;
    const detailRequestHeaders: string[] = [];
    const putRequests: Array<Readonly<{
      requestUrl: string;
      expectedAccountId: string | undefined;
      expectedRevision: number;
    }>> = [];
    const fetchMock = vi.fn<typeof fetch>(async (requestUrl, requestInit) => {
      if (requestUrl === "/api/cloud-projects") {
        return Response.json({ projects: [], nextCursor: null });
      }
      if (requestInit?.method === "GET") {
        const requestHeaders = requestInit.headers as Record<string, string>;
        detailRequestHeaders.push(requestHeaders["x-expected-account-id"] ?? "");
        if (serverStoredCloudRecord === null) {
          throw new Error(`Cloud project ${String(requestUrl)} was not stored by the test server.`);
        }
        return Response.json(serverStoredCloudRecord);
      }
      if (requestInit?.method !== "PUT") {
        throw new Error(`Unexpected cloud request ${String(requestInit?.method)} ${String(requestUrl)}.`);
      }

      const requestBody = JSON.parse(String(requestInit.body)) as {
        expectedRevision: number;
        projectDocument: CloudProjectRecord["projectDocument"];
      };
      const requestHeaders = requestInit.headers as Record<string, string>;
      putRequests.push({
        requestUrl: String(requestUrl),
        expectedAccountId: requestHeaders["x-expected-account-id"],
        expectedRevision: requestBody.expectedRevision,
      });
      putAttemptCount += 1;

      const cloudProjectId = String(requestUrl).split("/").at(-1);
      if (cloudProjectId === undefined) {
        throw new Error("Cloud PUT request URL did not include a project ID.");
      }
      const cloudRecord: CloudProjectRecord = {
        id: cloudProjectId,
        title: requestBody.projectDocument.projects[0]?.title ?? "Alpha Farm",
        revision: requestBody.expectedRevision + 1,
        updatedAt: "2026-10-15T00:00:00.000Z",
        mapCount: requestBody.projectDocument.projects[0]?.project.maps.length ?? 0,
        projectDocument: requestBody.projectDocument,
      };
      serverStoredCloudRecord = cloudRecord;
      if (putAttemptCount === 1) {
        throw new TypeError("connection lost after request dispatch");
      }
      if (putAttemptCount === 2) {
        return Response.json(
          { error: { code: "REVISION_CONFLICT", message: "Cloud copy already exists." } },
          { status: 409 },
        );
      }
      return Response.json(cloudRecord);
    });

    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      location: { href: "http://localhost/planner" },
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    let plannerSessionReadCount = 0;
    vi.doMock("../../src/auth/planner-auth-client", () => ({
      CloudAuthError: class CloudAuthError extends Error {
        readonly code: string;
        constructor(code: string, message: string) {
          super(message);
          this.code = code;
        }
      },
      getPlannerSession: vi.fn(async () => {
        plannerSessionReadCount += 1;
        return {
          user: plannerSessionReadCount === 1 ? null : {
          id: "user-9",
          name: "Willy",
          email: "willy@example.com",
          image: null,
          },
        };
      }),
      signInWithGoogle: vi.fn(async () => undefined),
      signOutPlannerAccount: vi.fn(async () => undefined),
    }));
    const { useCloudProjectSync } = await import(
      "../../src/cloud-sync/use-cloud-project-sync"
    );
    const workspaceController = {
      getState: () => ({
        projectSummaries: [{ id: "local-7" }],
        activeProject: { id: "local-7" },
        activeSession: null,
      }),
      exportProject: () => exportedProjectDocument,
      importProject: () => undefined,
      openProject: () => undefined,
    } as unknown as ReferenceProjectWorkspaceController;
    const mountedHook = hookRuntime.mount(() =>
      useCloudProjectSync({ workspaceController }),
    );

    let syncView = mountedHook.render();

    await expect(syncView.onLocalProjectSaved("local-7")).resolves.toBeUndefined();
    syncView = mountedHook.render();
    expect(syncView.status).toBe("ready");
    expect(syncView.authStatus).toBe("signed-in");
    expect(syncView.localProjectSyncById["local-7"]).toMatchObject({
      status: "error",
      errorMessage: expect.stringContaining("connection lost after request dispatch"),
    });
    expect(syncView.errorMessage).toContain("connection lost after request dispatch");
    expect(putRequests).toHaveLength(1);
    expect(putRequests[0]).toMatchObject({
      expectedAccountId: "user-9",
      expectedRevision: 0,
    });

    await expect(syncView.retrySync("local-7")).resolves.toBeUndefined();
    syncView = mountedHook.render();
    expect(syncView.status).toBe("ready");
    expect(syncView.localProjectSyncById["local-7"]).toMatchObject({
      status: "synced",
      revision: 1,
    });
    expect(putRequests[1]?.requestUrl).toBe(putRequests[0]?.requestUrl);
    expect(putRequests[1]).toMatchObject({
      expectedAccountId: "user-9",
      expectedRevision: 0,
    });
    expect(detailRequestHeaders).toEqual(["user-9"]);

    const changedProjectDocument = JSON.parse(exportedProjectDocument) as {
      projects: Array<{
        project: { maps: Array<{ state: { buildings: Array<{ x: number }> } }> };
      }>;
    };
    const firstBuilding = changedProjectDocument.projects[0]?.project.maps[0]?.state.buildings[0];
    if (firstBuilding === undefined) {
      throw new Error("Cloud sync hook fixture has no building to update.");
    }
    firstBuilding.x += 1;
    exportedProjectDocument = JSON.stringify(changedProjectDocument);

    await expect(syncView.onLocalProjectSaved("local-7")).resolves.toBeUndefined();
    syncView = mountedHook.render();
    expect(syncView.localProjectSyncById["local-7"]).toMatchObject({
      status: "synced",
      revision: 2,
    });
    expect(putRequests.map((putRequest) => putRequest.expectedRevision)).toEqual([
      0,
      0,
      1,
    ]);
    expect(putRequests.every((putRequest) => putRequest.expectedAccountId === "user-9"))
      .toBe(true);
    mountedHook.unmount();
  });

  it("keeps a guest local save clean without cloud requests or sync errors", async () => {
    const hookRuntime = createCloudSyncHookRuntime();
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      location: { href: "http://localhost/planner" },
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    vi.doMock("../../src/auth/planner-auth-client", () => ({
      CloudAuthError: class CloudAuthError extends Error {
        readonly code: string;
        constructor(code: string, message: string) {
          super(message);
          this.code = code;
        }
      },
      getPlannerSession: vi.fn(async () => ({ user: null })),
      signInWithGoogle: vi.fn(async () => undefined),
      signOutPlannerAccount: vi.fn(async () => undefined),
    }));
    const { useCloudProjectSync } = await import(
      "../../src/cloud-sync/use-cloud-project-sync"
    );
    const workspaceController = {
      getState: () => ({
        projectSummaries: [{ id: "local-guest" }],
        activeProject: { id: "local-guest" },
        activeSession: null,
      }),
      exportProject: () => "{}",
      importProject: () => undefined,
      openProject: () => undefined,
    } as unknown as ReferenceProjectWorkspaceController;
    const mountedHook = hookRuntime.mount(() =>
      useCloudProjectSync({ workspaceController }),
    );

    let syncView = mountedHook.render();
    await expect(syncView.onLocalProjectSaved("local-guest")).resolves.toBeUndefined();
    syncView = mountedHook.render();

    expect(syncView).toMatchObject({
      status: "ready",
      authStatus: "signed-out",
      errorMessage: null,
      localProjectSyncById: {},
    });
    expect(fetchMock).not.toHaveBeenCalled();
    mountedHook.unmount();
  });

  it("cancels an upload when another tab changes account and only retries for the new account explicitly", async () => {
    const hookRuntime = createCloudSyncHookRuntime();
    const accountA = {
      id: "account-A",
      name: "Account A",
      email: "a@example.com",
      image: null,
    };
    const accountB = {
      id: "account-B",
      name: "Account B",
      email: "b@example.com",
      image: null,
    };
    let latestPlannerAccount = accountA;
    const storedProject = referenceProjectDocumentFixture.projects[0];
    if (storedProject === undefined) {
      throw new Error("Cloud sync hook fixture is missing project-alpha.");
    }
    const localStoredProject = {
      ...storedProject,
      id: "local-7",
      project: {
        ...storedProject.project,
        maps: storedProject.project.maps.map((projectMap) => ({
          ...projectMap,
          thumbnail: `/api/projects/local-7/maps/${projectMap.id}/thumbnail`,
        })),
      },
    };
    const expectedAccountHeaders: string[] = [];
    const putRequestHeaders: string[] = [];
    const putExpectedRevisions: number[] = [];
    let resolveInitialList: (() => void) | undefined;
    const initialListRequested = new Promise<void>((resolve) => {
      resolveInitialList = resolve;
    });
    const fetchMock = vi.fn<typeof fetch>(async (requestUrl, requestInit) => {
      const requestHeaders = requestInit?.headers as Record<string, string>;
      const expectedAccountHeader = requestHeaders["x-expected-account-id"];
      if (typeof expectedAccountHeader !== "string") {
        throw new Error("Cloud request is missing X-Expected-Account-Id.");
      }
      expectedAccountHeaders.push(expectedAccountHeader);
      if (requestInit?.method === "GET" && requestUrl === "/api/cloud-projects") {
        resolveInitialList?.();
        return Response.json({ projects: [], nextCursor: null });
      }
      if (requestInit?.method !== "PUT") {
        throw new Error(`Unexpected cloud request ${String(requestInit?.method)} ${String(requestUrl)}.`);
      }

      putRequestHeaders.push(expectedAccountHeader);
      const requestBody = JSON.parse(String(requestInit.body)) as {
        expectedRevision: number;
        projectDocument: CloudProjectRecord["projectDocument"];
      };
      putExpectedRevisions.push(requestBody.expectedRevision);
      const cloudProjectId = String(requestUrl).split("/").at(-1);
      if (cloudProjectId === undefined) {
        throw new Error("Cloud PUT request URL did not include a project ID.");
      }
      const storedCloudProject = requestBody.projectDocument.projects[0];
      if (storedCloudProject === undefined) {
        throw new Error("Cloud PUT request did not include a stored project.");
      }
      const cloudRecord: CloudProjectRecord = {
        id: cloudProjectId,
        title: storedCloudProject.title,
        revision: requestBody.expectedRevision + 1,
        updatedAt: "2026-10-15T00:00:00.000Z",
        mapCount: storedCloudProject.project.maps.length,
        projectDocument: requestBody.projectDocument,
      };
      return Response.json(cloudRecord);
    });

    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      location: { href: "http://localhost/planner" },
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    vi.doMock("../../src/auth/planner-auth-client", () => ({
      CloudAuthError: class CloudAuthError extends Error {
        readonly code: string;
        constructor(code: string, message: string) {
          super(message);
          this.code = code;
        }
      },
      getPlannerSession: vi.fn(async () => ({ user: latestPlannerAccount })),
      signInWithGoogle: vi.fn(async () => undefined),
      signOutPlannerAccount: vi.fn(async () => undefined),
    }));
    const { useCloudProjectSync, CloudProjectRequestError } = await import(
      "../../src/cloud-sync/use-cloud-project-sync"
    );
    const workspaceController = {
      getState: () => ({
        projectSummaries: [{ id: "local-7" }],
        activeProject: { id: "local-7" },
        activeSession: null,
      }),
      exportProject: () => JSON.stringify({
        version: 1,
        projects: [localStoredProject],
      }),
      importProject: () => undefined,
      openProject: () => undefined,
    } as unknown as ReferenceProjectWorkspaceController;
    const mountedHook = hookRuntime.mount(() =>
      useCloudProjectSync({ workspaceController }),
    );

    let syncView = mountedHook.render();
    await initialListRequested;
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    latestPlannerAccount = accountB;
    syncView = mountedHook.render();
    await expect(syncView.uploadLocalProject("local-7")).rejects.toBeInstanceOf(
      CloudProjectRequestError,
    );
    expect(mountedHook.render()).toMatchObject({
      status: "ready",
      account: accountB,
      errorMessage: expect.stringContaining("account changed from \"account-A\" to \"account-B\""),
    });
    expect(putRequestHeaders).toEqual([]);
    expect(expectedAccountHeaders).toEqual(["account-A", "account-B"]);

    syncView = mountedHook.render();
    await expect(syncView.retrySync("local-7")).resolves.toBeUndefined();
    expect(putRequestHeaders).toEqual(["account-B"]);
    expect(putExpectedRevisions).toEqual([0]);
    expect(expectedAccountHeaders).toEqual([
      "account-A",
      "account-B",
      "account-B",
    ]);
    mountedHook.unmount();
  });

  it("cancels open after another tab signs out and leaves the local project untouched", async () => {
    const hookRuntime = createCloudSyncHookRuntime();
    const accountA = {
      id: "account-A",
      name: "Account A",
      email: "a@example.com",
      image: null,
    };
    let latestPlannerAccount: typeof accountA | null = accountA;
    const cloudRequests: string[] = [];
    let importProjectCallCount = 0;
    let resolveInitialList: (() => void) | undefined;
    const initialListRequested = new Promise<void>((resolve) => {
      resolveInitialList = resolve;
    });
    const fetchMock = vi.fn<typeof fetch>((requestUrl, requestInit) => {
      cloudRequests.push(`${String(requestInit?.method)} ${String(requestUrl)}`);
      if (requestUrl === "/api/cloud-projects") {
        resolveInitialList?.();
        return Promise.resolve(Response.json({ projects: [], nextCursor: null }));
      }
      throw new Error(`Unexpected cloud request ${String(requestUrl)}.`);
    });
    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      location: { href: "http://localhost/planner" },
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    vi.doMock("../../src/auth/planner-auth-client", () => ({
      CloudAuthError: class CloudAuthError extends Error {
        readonly code: string;
        constructor(code: string, message: string) {
          super(message);
          this.code = code;
        }
      },
      getPlannerSession: vi.fn(async () => ({ user: latestPlannerAccount })),
      signInWithGoogle: vi.fn(async () => undefined),
      signOutPlannerAccount: vi.fn(async () => undefined),
    }));
    const { useCloudProjectSync, CloudProjectRequestError } = await import(
      "../../src/cloud-sync/use-cloud-project-sync"
    );
    const workspaceController = {
      getState: () => ({
        projectSummaries: [{ id: "local-7" }],
        activeProject: { id: "local-7" },
        activeSession: null,
      }),
      exportProject: () => "{}",
      importProject: () => {
        importProjectCallCount += 1;
      },
      openProject: () => undefined,
    } as unknown as ReferenceProjectWorkspaceController;
    const mountedHook = hookRuntime.mount(() =>
      useCloudProjectSync({ workspaceController }),
    );

    let syncView = mountedHook.render();
    await initialListRequested;
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    latestPlannerAccount = null;
    syncView = mountedHook.render();
    await expect(syncView.openCloudProject("cloud-99")).rejects.toBeInstanceOf(
      CloudProjectRequestError,
    );
    expect(mountedHook.render()).toMatchObject({
      status: "ready",
      authStatus: "signed-out",
      account: null,
      errorMessage: expect.stringContaining("account changed from \"account-A\" to null"),
    });
    await expect(mountedHook.render().onLocalProjectSaved("local-7"))
      .resolves.toBeUndefined();
    expect(cloudRequests).toEqual(["GET /api/cloud-projects"]);
    expect(importProjectCallCount).toBe(0);
    mountedHook.unmount();
  });

  it("resolves after a successful sign-out and clears the active account", async () => {
    let resolveSessionRequested: (() => void) | undefined;
    const sessionRequested = new Promise<void>((resolve) => {
      resolveSessionRequested = resolve;
    });
    let resolveCloudListRequested: (() => void) | undefined;
    const cloudListRequested = new Promise<void>((resolve) => {
      resolveCloudListRequested = resolve;
    });
    let resolveCloudListResponse: ((response: Response) => void) | undefined;
    const hookRuntime = createCloudSyncHookRuntime();
    const signOutAccount = vi.fn(async () => undefined);
    vi.stubGlobal("window", {
      localStorage: createMemoryStorage(),
      location: { href: "http://localhost/planner" },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>((requestUrl) => {
        if (requestUrl !== "/api/cloud-projects") {
          throw new Error(`Unexpected test fetch URL ${String(requestUrl)}.`);
        }
        resolveCloudListRequested?.();
        return new Promise<Response>((resolve) => {
          resolveCloudListResponse = resolve;
        });
      }),
    );
    vi.resetModules();
    vi.doMock("react", () => hookRuntime.reactModule);
    vi.doMock("../../src/auth/planner-auth-client", () => ({
      CloudAuthError: class CloudAuthError extends Error {
        readonly code = "MOCK_AUTH_ERROR";
      },
      getPlannerSession: vi.fn(async () => {
        resolveSessionRequested?.();
        return {
          user: {
            id: "user-9",
            name: "Willy",
            email: "willy@example.com",
            image: null,
          },
        };
      }),
      signInWithGoogle: vi.fn(async () => undefined),
      signOutPlannerAccount: signOutAccount,
    }));
    const { useCloudProjectSync } = await import(
      "../../src/cloud-sync/use-cloud-project-sync"
    );
    const workspaceController = {
      getState: () => ({
        projectSummaries: [],
        activeProject: null,
        activeSession: null,
      }),
      exportProject: () => "{}",
      importProject: () => undefined,
      openProject: () => undefined,
    } as unknown as ReferenceProjectWorkspaceController;
    const mountedHook = hookRuntime.mount(() =>
      useCloudProjectSync({ workspaceController }),
    );

    let syncView = mountedHook.render();
    await sessionRequested;
    await cloudListRequested;
    syncView = mountedHook.render();
    expect(syncView.authStatus).toBe("signed-in");

    await expect(syncView.signOut()).resolves.toBeUndefined();
    expect(signOutAccount).toHaveBeenCalledOnce();
    expect(mountedHook.render().authStatus).toBe("signed-out");
    resolveCloudListResponse?.(
      Response.json({ projects: [], nextCursor: null }),
    );
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    expect(mountedHook.render()).toMatchObject({
      status: "ready",
      authStatus: "signed-out",
      errorMessage: null,
    });
    mountedHook.unmount();
  });
});

function createCloudSyncHookRuntime() {
  const hookStateSlots: unknown[] = [];
  const callbackSlots = new Map<number, HookCallbackSlot>();
  const effectSlots = new Map<number, HookEffectSlot>();
  let currentHookIndex = 0;
  let scheduledEffects: readonly ScheduledHookEffect[] = [];

  return {
    mount<Output>(renderHook: () => Output) {
      function render(): Output {
        currentHookIndex = 0;
        scheduledEffects = [];
        const output = renderHook();
        const pendingEffects = scheduledEffects;
        for (const pendingEffect of pendingEffects) {
          const previousEffect = effectSlots.get(pendingEffect.hookIndex);
          previousEffect?.cleanup?.();
          const cleanup = pendingEffect.effect();
          effectSlots.set(pendingEffect.hookIndex, {
            cleanup: typeof cleanup === "function" ? cleanup : undefined,
            dependencies: pendingEffect.dependencies,
          });
        }
        return output;
      }

      return {
        render,
        unmount(): void {
          for (const effectSlot of effectSlots.values()) {
            effectSlot.cleanup?.();
          }
          effectSlots.clear();
        },
      };
    },
    reactModule: {
      useCallback(callback: Function, dependencies: readonly unknown[]): Function {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        const previousCallback = callbackSlots.get(hookIndex);
        if (
          previousCallback !== undefined &&
          haveEqualDependencies(previousCallback.dependencies, dependencies)
        ) {
          return previousCallback.callback;
        }
        callbackSlots.set(hookIndex, { callback, dependencies });
        return callback;
      },
      useEffect(
        effect: () => void | (() => void),
        dependencies: readonly unknown[],
      ): void {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        const previousEffect = effectSlots.get(hookIndex);
        if (
          previousEffect === undefined ||
          !haveEqualDependencies(previousEffect.dependencies, dependencies)
        ) {
          (scheduledEffects as ScheduledHookEffect[]).push({
            dependencies,
            effect,
            hookIndex,
          });
        }
      },
      useRef<Value>(initialValue: Value): { current: Value } {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        if (!(hookIndex in hookStateSlots)) {
          hookStateSlots[hookIndex] = { current: initialValue };
        }
        return hookStateSlots[hookIndex] as { current: Value };
      },
      useState<Value>(initialValue: Value): readonly [Value, (nextValue: unknown) => void] {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        if (!(hookIndex in hookStateSlots)) {
          hookStateSlots[hookIndex] = initialValue;
        }
        return [
          hookStateSlots[hookIndex] as Value,
          (nextValue: unknown): void => {
            const previousValue = hookStateSlots[hookIndex] as Value;
            hookStateSlots[hookIndex] =
              typeof nextValue === "function"
                ? (nextValue as (previousValue: Value) => Value)(previousValue)
                : nextValue;
          },
        ];
      },
    },
  };
}

type HookCallbackSlot = Readonly<{
  callback: Function;
  dependencies: readonly unknown[];
}>;

type HookEffectSlot = Readonly<{
  cleanup?: () => void;
  dependencies: readonly unknown[];
}>;

type ScheduledHookEffect = Readonly<{
  dependencies: readonly unknown[];
  effect: () => void | (() => void);
  hookIndex: number;
}>;

function haveEqualDependencies(
  previousDependencies: readonly unknown[],
  nextDependencies: readonly unknown[],
): boolean {
  return previousDependencies.length === nextDependencies.length &&
    previousDependencies.every((dependency, index) =>
      Object.is(dependency, nextDependencies[index])
    );
}

function createMemoryStorage(): Storage {
  const storageEntries = new Map<string, string>();
  return {
    get length() {
      return storageEntries.size;
    },
    clear(): void {
      storageEntries.clear();
    },
    getItem(storageKey: string): string | null {
      return storageEntries.get(storageKey) ?? null;
    },
    key(storageIndex: number): string | null {
      return Array.from(storageEntries.keys())[storageIndex] ?? null;
    },
    removeItem(storageKey: string): void {
      storageEntries.delete(storageKey);
    },
    setItem(storageKey: string, serializedValue: string): void {
      storageEntries.set(storageKey, serializedValue);
    },
  };
}
