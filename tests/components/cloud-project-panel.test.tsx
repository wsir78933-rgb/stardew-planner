import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const reactHookHarness = vi.hoisted(() => ({
  stateSlots: [] as unknown[],
  referenceSlots: [] as Array<{ current: unknown }>,
  stateCursor: 0,
  referenceCursor: 0,
  idCursor: 0,
  beginRender() {
    this.stateCursor = 0;
    this.referenceCursor = 0;
    this.idCursor = 0;
  },
  reset() {
    this.stateSlots = [];
    this.referenceSlots = [];
    this.beginRender();
  },
}));

vi.mock("react", async (importOriginal) => {
  const reactExports = await importOriginal<typeof import("react")>();

  return {
    ...reactExports,
    useEffect: () => undefined,
    useId: () => `cloud-project-test-${reactHookHarness.idCursor++}`,
    useRef: <ReferenceValue,>(initialValue: ReferenceValue) => {
      const referenceIndex = reactHookHarness.referenceCursor++;
      if (!reactHookHarness.referenceSlots[referenceIndex]) {
        reactHookHarness.referenceSlots[referenceIndex] = { current: initialValue };
      }
      return reactHookHarness.referenceSlots[referenceIndex] as {
        current: ReferenceValue;
      };
    },
    useState: <StateValue,>(initialValue: StateValue | (() => StateValue)) => {
      const stateIndex = reactHookHarness.stateCursor++;
      if (reactHookHarness.stateSlots[stateIndex] === undefined) {
        reactHookHarness.stateSlots[stateIndex] =
          typeof initialValue === "function"
            ? (initialValue as () => StateValue)()
            : initialValue;
      }

      const setState = (
        nextValue: StateValue | ((currentValue: StateValue) => StateValue),
      ) => {
        const currentValue = reactHookHarness.stateSlots[stateIndex] as StateValue;
        reactHookHarness.stateSlots[stateIndex] =
          typeof nextValue === "function"
            ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
            : nextValue;
      };

      return [reactHookHarness.stateSlots[stateIndex] as StateValue, setState] as const;
    },
  };
});

vi.mock("@/src/cloud-sync/use-cloud-project-sync", () => ({
  CloudAuthError: class CloudAuthError extends Error {},
  CloudOperationCancelledError: class CloudOperationCancelledError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CloudOperationCancelledError";
    }
  },
  CloudProjectRequestError: class CloudProjectRequestError extends Error {},
}));

import * as React from "react";
import {
  CloudOperationCancelledError,
  type CloudProjectSyncView,
} from "@/src/cloud-sync/use-cloud-project-sync";
import type { ReferenceProjectSummary } from "@/src/reference-runtime/reference-project-repository";
import {
  CloudProjectPanel,
  CloudProjectSidebar,
  formatCloudProjectUpdatedAt,
} from "@/src/components/cloud-project-panel";
import { getSaveModalCopy } from "@/src/i18n/save-modal-copy";

type RenderedElement = React.ReactElement<Record<string, unknown>>;
type CloudProjectPanelTree = ReturnType<typeof CloudProjectPanel>;
type CloudProjectSidebarTree = ReturnType<typeof CloudProjectSidebar>;

const localProjectSummaries: readonly ReferenceProjectSummary[] = [
  {
    id: "local-unsynced",
    title: "Forest Farm",
    created_at: "2026-08-10T00:00:00.000Z",
    updated_at: "2026-08-10T01:00:00.000Z",
  },
  {
    id: "local-conflict",
    title: "Beach Farm",
    created_at: "2026-08-09T00:00:00.000Z",
    updated_at: "2026-08-09T01:00:00.000Z",
  },
  {
    id: "local-synced",
    title: "Hilltop Farm",
    created_at: "2026-08-08T00:00:00.000Z",
    updated_at: "2026-08-08T01:00:00.000Z",
  },
];

function createCloudProjectSyncView(
  overrides: Partial<CloudProjectSyncView> = {},
): CloudProjectSyncView {
  return {
    status: "ready",
    hasMoreCloudProjects: false,
    isLoadingMoreCloudProjects: false,
    authStatus: "signed-out",
    account: null,
    cloudProjects: [],
    localProjectSyncById: {},
    batchSyncProgress: null,
    errorMessage: null,
    signInWithGoogle: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
    refreshCloudProjects: vi.fn(async () => undefined),
    loadMoreCloudProjects: vi.fn(async () => undefined),
    uploadLocalProject: vi.fn(async () => undefined),
    syncAllLocalProjects: vi.fn(async () => undefined),
    onLocalProjectSaved: vi.fn(async () => undefined),
    openCloudProject: vi.fn(async () => ({ localProjectId: "cloud-local-copy" })),
    deleteCloudCopy: vi.fn(async () => undefined),
    retrySync: vi.fn(async () => undefined),
    keepLocalVersion: vi.fn(async () => undefined),
    useCloudVersion: vi.fn(async () => "cloud-local-copy"),
    ...overrides,
  };
}

function renderCloudProjectPanel(
  cloudProjectSync: CloudProjectSyncView,
  locale: "en" | "zh-CN",
): CloudProjectPanelTree {
  reactHookHarness.reset();
  return CloudProjectPanel({
    cloudProjectSync,
    copy: getSaveModalCopy(locale).cloudProjects,
    currentProjectId: "local-conflict",
    localProjects: localProjectSummaries,
  });
}

function renderCloudProjectSidebar(
  cloudProjectSync: CloudProjectSyncView,
  locale: "en" | "zh-CN",
  localProjects: readonly ReferenceProjectSummary[] = localProjectSummaries,
): CloudProjectSidebarTree {
  reactHookHarness.reset();
  return CloudProjectSidebar({
    cloudProjectSync,
    copy: getSaveModalCopy(locale).cloudProjects,
    localProjects,
  });
}

function findElement(
  node: ReactNode,
  elementType: string,
  matches: (properties: Record<string, unknown>) => boolean = () => true,
): RenderedElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const foundElement = findElement(child, elementType, matches);
      if (foundElement) return foundElement;
    }
    return undefined;
  }

  if (!React.isValidElement(node)) return undefined;

  const renderedElement = node as RenderedElement;
  if (
    renderedElement.type === elementType
    && matches(renderedElement.props)
  ) {
    return renderedElement;
  }

  return findElement(renderedElement.props.children as ReactNode, elementType, matches);
}

function requireElement(
  tree: ReactNode,
  elementType: string,
  matches?: (properties: Record<string, unknown>) => boolean,
): RenderedElement {
  const foundElement = findElement(tree, elementType, matches);
  if (!foundElement) {
    throw new Error(`Expected to find a ${elementType} element in the cloud-project UI tree.`);
  }
  return foundElement;
}

function textContent(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (React.isValidElement(node)) {
    return textContent((node as RenderedElement).props.children as ReactNode);
  }
  return "";
}

function requireClickHandler(element: RenderedElement): () => void {
  const clickHandler = element.props.onClick;
  if (typeof clickHandler !== "function") {
    throw new Error(`Expected ${String(element.type)} to expose an onClick function.`);
  }
  return clickHandler as () => void;
}

async function flushPendingPromiseCallbacks(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("cloud project panel", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    reactHookHarness.reset();
  });

  it("keeps the cloud section focused on project actions while signed out", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const panelTree = renderCloudProjectPanel(
      createCloudProjectSyncView(),
      "en",
    );
    const panelText = textContent(panelTree);

    expect(panelText).toContain(
      "Only layout data syncs. Map preview images stay on this device. Cloud copies stay until you delete them.",
    );
    expect(panelText).toContain(
      "Sign in with Google in the sidebar to view cloud copies and project sync actions.",
    );
    expect(panelText).not.toContain("Continue with Google");
    expect(panelText).not.toContain("Forest Farm");
    expect(panelText).not.toContain("7-day local-save transition");
  });

  it("keeps Google sign-in available with no local projects and shows one raw cloud error", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const rawCloudError = "Planner session response for HTTP 404 is not valid JSON: Unexpected token '<'";
    const sidebarTree = renderCloudProjectSidebar(
      createCloudProjectSyncView({
        authStatus: "error",
        status: "error",
        errorMessage: rawCloudError,
      }),
      "en",
      [],
    );
    const copy = getSaveModalCopy("en").cloudProjects;
    const sidebarText = textContent(sidebarTree);
    const googleSignInButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.signInGoogle,
    );

    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.syncAllSignedOut,
    );

    expect(googleSignInButton.props.disabled).toBe(false);
    expect(syncAllButton.props.disabled).toBe(true);
    expect(sidebarText).toContain(copy.cloudStatusErrorSummary);
    expect(sidebarText.split(rawCloudError).length - 1).toBe(1);
    expect(sidebarText).toContain(copy.cloudStatusError(rawCloudError));
    expect(sidebarText).toContain(copy.localSaveRetirementNotConfigured);

    const signedOutTree = renderCloudProjectSidebar(
      createCloudProjectSyncView(),
      "en",
      [],
    );
    const signedOutGoogleButton = requireElement(
      signedOutTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.signInGoogle,
    );

    expect(signedOutGoogleButton.props.disabled).toBe(false);
  });

  it("guides signed-out users to Google without starting a batch upload", async () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const cloudProjectSync = createCloudProjectSyncView();
    const sidebarTree = renderCloudProjectSidebar(cloudProjectSync, "en");
    const copy = getSaveModalCopy("en").cloudProjects;
    const signInOnlyDescription = findElement(
      sidebarTree,
      "p",
      (properties) => textContent(properties.children as ReactNode) === copy.syncAllSignInDescription,
    );
    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.syncAllSignedOut,
    );

    expect(textContent(sidebarTree)).toContain(copy.cloudStatusReady);
    expect(textContent(signInOnlyDescription?.props.children as ReactNode)).toBe(
      copy.syncAllSignInDescription,
    );
    requireClickHandler(syncAllButton)();
    await flushPendingPromiseCallbacks();

    expect(cloudProjectSync.signInWithGoogle).toHaveBeenCalledOnce();
    expect(cloudProjectSync.syncAllLocalProjects).not.toHaveBeenCalled();
  });

  it("sends all current local project IDs to the batch sync callback", async () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const cloudProjectSync = createCloudProjectSyncView({
      authStatus: "signed-in",
      account: {
        id: "account-1",
        name: "Farm Planner",
        email: "planner@example.com",
        image: null,
      },
    });
    const sidebarTree = renderCloudProjectSidebar(cloudProjectSync, "zh-CN");
    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === "同步全部本地项目",
    );

    requireClickHandler(syncAllButton)();
    await flushPendingPromiseCallbacks();

    expect(cloudProjectSync.syncAllLocalProjects).toHaveBeenCalledWith([
      "local-unsynced",
      "local-conflict",
      "local-synced",
    ]);
    expect(textContent(sidebarTree)).toContain("更多功能");
  });

  it("keeps sign out available during a hanging batch and treats cancellation as expected", async () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    let rejectBatchSync: (caughtError: Error) => void = () => {
      throw new Error("The hanging batch sync did not expose its reject function.");
    };
    const signedInAccount = {
      id: "account-1",
      name: "Farm Planner",
      email: "planner@example.com",
      image: null,
    };
    const cloudProjectSync = createCloudProjectSyncView({
      authStatus: "signed-in",
      account: signedInAccount,
      syncAllLocalProjects: vi.fn(
        () => new Promise<void>((_resolveBatchSync, reject) => {
          rejectBatchSync = reject;
        }),
      ),
    });
    const copy = getSaveModalCopy("en").cloudProjects;

    function renderSidebar(): CloudProjectSidebarTree {
      reactHookHarness.beginRender();
      return CloudProjectSidebar({
        cloudProjectSync,
        copy,
        localProjects: localProjectSummaries,
      });
    }

    reactHookHarness.reset();
    let sidebarTree = renderSidebar();
    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.syncAllLocalProjects,
    );
    const batchSync = requireClickHandler(syncAllButton)() as unknown as Promise<void>;

    sidebarTree = renderSidebar();
    const signOutButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.signOut,
    );
    expect(signOutButton.props.disabled).not.toBe(true);

    const signOutClick = requireClickHandler(signOutButton);
    const firstSignOut = signOutClick() as unknown as Promise<void>;
    signOutClick();
    expect(cloudProjectSync.signOut).toHaveBeenCalledOnce();

    sidebarTree = renderSidebar();
    const busySignOutButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.signOutBusy,
    );
    expect(busySignOutButton.props.disabled).toBe(true);
    requireClickHandler(busySignOutButton)();
    expect(cloudProjectSync.signOut).toHaveBeenCalledOnce();

    const cancellationError = new CloudOperationCancelledError(
      'Cloud batch sync for account "account-1" was cancelled.',
    );
    rejectBatchSync(cancellationError);
    await expect(batchSync).resolves.toBeUndefined();
    await firstSignOut;

    sidebarTree = renderSidebar();
    const settledText = textContent(sidebarTree);
    expect(settledText).not.toContain(copy.syncAllCompleted(localProjectSummaries.length));
    expect(settledText).not.toContain(cancellationError.message);
    expect(cloudProjectSync.syncAllLocalProjects).toHaveBeenCalledOnce();
  });

  it("rejects an unknown batch failure instead of treating it as success", async () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const unknownBatchError = new Error(
      'Cloud batch sync failed for local project ID "local-unsynced": disk full.',
    );
    const cloudProjectSync = createCloudProjectSyncView({
      authStatus: "signed-in",
      account: {
        id: "account-1",
        name: "Farm Planner",
        email: "planner@example.com",
        image: null,
      },
      syncAllLocalProjects: vi.fn(async () => {
        throw unknownBatchError;
      }),
    });
    const copy = getSaveModalCopy("en").cloudProjects;
    const sidebarTree = renderCloudProjectSidebar(cloudProjectSync, "en");
    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.syncAllLocalProjects,
    );

    await expect(
      requireClickHandler(syncAllButton)() as unknown as Promise<void>,
    ).rejects.toBe(unknownBatchError);
    expect(textContent(sidebarTree)).not.toContain(
      copy.syncAllCompleted(localProjectSummaries.length),
    );
  });

  it("shows bounded progress and disables repeated batch sync clicks", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const sidebarTree = renderCloudProjectSidebar(
      createCloudProjectSyncView({
        authStatus: "signed-in",
        account: {
          id: "account-1",
          name: "Farm Planner",
          email: "planner@example.com",
          image: null,
        },
        batchSyncProgress: {
          status: "running",
          completed: 1,
          total: 3,
          currentProjectId: "local-conflict",
          failedProjectIds: [],
        },
      }),
      "en",
    );
    const copy = getSaveModalCopy("en").cloudProjects;
    const syncAllButton = requireElement(
      sidebarTree,
      "button",
      (properties) => textContent(properties.children as ReactNode) === copy.syncButtonBusy,
    );
    const progress = requireElement(sidebarTree, "progress");

    expect(syncAllButton.props.disabled).toBe(true);
    expect(progress.props.max).toBe(3);
    expect(progress.props.value).toBe(1);
    expect(textContent(sidebarTree)).toContain(
      "Processed 1 of 3 local projects. Syncing Beach Farm…",
    );
  });

  it("shows failed project details instead of a false all-synced message", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const failureMessage =
      'Cloud project sync failed for local project ID "local-conflict": revision conflict.';
    const cloudProjectSync = createCloudProjectSyncView({
        authStatus: "signed-in",
        account: {
          id: "account-1",
          name: "Farm Planner",
          email: "planner@example.com",
          image: null,
        },
        batchSyncProgress: {
          status: "failed",
          completed: 3,
          total: 3,
          currentProjectId: null,
          failedProjectIds: ["local-conflict"],
        },
        localProjectSyncById: {
          "local-conflict": {
            status: "conflict",
            revision: 4,
            errorMessage: "revision conflict",
          },
        },
        errorMessage: failureMessage,
      });
    const sidebarTree = renderCloudProjectSidebar(cloudProjectSync, "en");
    const sidebarText = textContent(sidebarTree);
    const panelTree = renderCloudProjectPanel(cloudProjectSync, "en");
    const keepLocalButton = requireElement(
      panelTree,
      "button",
      (properties) => properties["aria-label"] === "Keep local version: Beach Farm",
    );

    expect(sidebarText).toContain("Beach Farm");
    expect(sidebarText).toContain(failureMessage);
    expect(sidebarText).not.toContain("All 3 local projects synced.");
    expect(keepLocalButton.props.disabled).toBe(false);
  });

  it("keeps per-project conflict choices and collapses the cloud-copy list by default", () => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_SAVE_RETIREMENT_AT", "");
    const panelTree = renderCloudProjectPanel(
      createCloudProjectSyncView({
        authStatus: "signed-in",
        account: {
          id: "account-1",
          name: "Farm Planner",
          email: "planner@example.com",
          image: null,
        },
        cloudProjects: [
          {
            id: "cloud-1",
            title: "Mountain Layout",
            revision: 3,
            updatedAt: "2026-08-11T12:00:00.000Z",
            mapCount: 2,
          },
        ],
        hasMoreCloudProjects: true,
        localProjectSyncById: {
          "local-conflict": { status: "conflict", revision: 4 },
          "local-synced": { status: "synced", revision: 5 },
        },
      }),
      "zh-CN",
    );
    const panelText = textContent(panelTree);
    const cloudProjectDetails = requireElement(panelTree, "details");

    expect(panelText).not.toContain("当前登录账户：Farm Planner。");
    expect(
      findElement(panelTree, "button", (properties) =>
        properties["aria-label"] === "同步到云端: Forest Farm",
      ),
    ).toBeDefined();
    expect(
      findElement(panelTree, "button", (properties) =>
        properties["aria-label"] === "同步到云端: Hilltop Farm",
      ),
    ).toBeDefined();
    expect(panelText).toContain("云端副本会一直保留，直到你主动删除。");
    expect(panelText).toContain("仅保存在此设备");
    expect(panelText).toContain("已同步");
    expect(panelText).toContain("需要选择版本");
    expect(panelText).toContain("保留本地版本");
    expect(panelText).toContain("将云端版本另存为新的本地项目");
    expect(panelText).toContain("Mountain Layout");
    expect(panelText).toContain("2 张地图");
    expect(panelText).toContain("打开云端副本");
    expect(panelText).toContain("删除云端副本");
    expect(panelText).toContain("加载更多云端项目");
    expect(panelText).not.toContain("data:image");
    expect(cloudProjectDetails.props.open).toBeUndefined();
  });

  it("formats cloud timestamps and reports the exact invalid value", () => {
    expect(formatCloudProjectUpdatedAt("2026-08-11T12:00:00.000Z", "en")).toBe(
      new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date("2026-08-11T12:00:00.000Z")),
    );
    expect(() => formatCloudProjectUpdatedAt("bad-cloud-time", "en")).toThrow(
      /bad-cloud-time/,
    );
  });
});
