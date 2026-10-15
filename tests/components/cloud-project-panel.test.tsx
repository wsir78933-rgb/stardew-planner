import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { CloudProjectSyncView } from "@/cloud-sync/use-cloud-project-sync";
import type { ReferenceProjectSummary } from "@/reference-runtime/reference-project-repository";
import {
  CloudProjectPanel,
  formatCloudProjectUpdatedAt,
} from "@/components/cloud-project-panel";
import { getSaveModalCopy } from "@/i18n/save-modal-copy";

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
    errorMessage: null,
    signInWithGoogle: vi.fn(async () => undefined),
    signOut: vi.fn(async () => undefined),
    refreshCloudProjects: vi.fn(async () => undefined),
    loadMoreCloudProjects: vi.fn(async () => undefined),
    uploadLocalProject: vi.fn(async () => undefined),
    onLocalProjectSaved: vi.fn(async () => undefined),
    openCloudProject: vi.fn(async () => ({ localProjectId: "cloud-local-copy" })),
    deleteCloudCopy: vi.fn(async () => undefined),
    retrySync: vi.fn(async () => undefined),
    keepLocalVersion: vi.fn(async () => undefined),
    useCloudVersion: vi.fn(async () => "cloud-local-copy"),
    ...overrides,
  };
}

describe("cloud project panel", () => {
  it("keeps local saving usable and explains optional Google sync while signed out", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(CloudProjectPanel, {
        cloudProjectSync: createCloudProjectSyncView(),
        copy: getSaveModalCopy("en").cloudProjects,
        currentProjectId: "local-unsynced",
        localProjects: localProjectSummaries,
      }),
    );

    expect(panelMarkup).toContain("Continue with Google");
    expect(panelMarkup).toContain("Sign in to sync selected projects across devices.");
    expect(panelMarkup).toContain("Only layout data syncs. Map preview images stay on this device.");
    expect(panelMarkup).not.toContain('aria-label="Sync this project: Forest Farm"');
    expect(panelMarkup).not.toContain("Forest Farm");
  });

  it("shows explicit per-project upload, conflict choices, and a separated cloud-copy list", () => {
    const cloudProjectSync = createCloudProjectSyncView({
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
      },
    });
    const panelMarkup = renderToStaticMarkup(
      createElement(CloudProjectPanel, {
        cloudProjectSync,
        copy: getSaveModalCopy("zh-CN").cloudProjects,
        currentProjectId: "local-conflict",
        localProjects: localProjectSummaries,
      }),
    );

    expect(panelMarkup).toContain("当前登录账户：Farm Planner。");
    expect(panelMarkup).toContain('aria-label="同步此项目: Forest Farm"');
    expect(panelMarkup).toContain("仅保存在此设备");
    expect(panelMarkup).toContain("需要选择版本");
    expect(panelMarkup).toContain("保留本地版本");
    expect(panelMarkup).toContain("将云端版本另存为新的本地项目");
    expect(panelMarkup).toContain("云端项目");
    expect(panelMarkup).toContain("Mountain Layout");
    expect(panelMarkup).toContain("2 张地图");
    expect(panelMarkup).toContain("打开云端副本");
    expect(panelMarkup).toContain("删除云端副本");
    expect(panelMarkup).toContain("加载更多云端项目");
    expect(panelMarkup).not.toContain("data:image");
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
