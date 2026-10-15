import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const cloudProjectSyncHookMock = vi.hoisted(() => ({
  useCloudProjectSync: vi.fn(() => ({
    status: "ready" as const,
    hasMoreCloudProjects: false,
    isLoadingMoreCloudProjects: false,
    authStatus: "signed-out" as const,
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
    openCloudProject: vi.fn(async () => ({ localProjectId: "local-copy" })),
    deleteCloudCopy: vi.fn(async () => undefined),
    retrySync: vi.fn(async () => undefined),
    keepLocalVersion: vi.fn(async () => undefined),
    useCloudVersion: vi.fn(async () => "local-copy"),
  })),
}));

vi.mock("@/cloud-sync/use-cloud-project-sync", () => ({
  CloudAuthError: class CloudAuthError extends Error {},
  CloudProjectRequestError: class CloudProjectRequestError extends Error {},
  useCloudProjectSync: cloudProjectSyncHookMock.useCloudProjectSync,
}));

import {
  formatPlannerThumbnailSaveError,
  getActiveProjectIdAfterLocalSave,
  PlannerSaveModalContent,
  saveCurrentMapAndNotifyCloudSync,
} from "../../src/components/planner-save-modal-content";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import { MapImageExportError } from "../../src/projects/map-image-export";
import type { ReferenceProjectSummary } from "../../src/reference-runtime/reference-project-repository";

const projectSummaries: readonly ReferenceProjectSummary[] = [
  {
    id: "project-forest",
    title: "Forest Farm",
    created_at: "2026-08-03T00:00:00.000Z",
    updated_at: "2026-08-03T00:00:00.000Z",
  },
];

describe("planner save modal content", () => {
  it("formats known thumbnail capture failures and rethrows unknown failures", () => {
    expect(
      formatPlannerThumbnailSaveError(
        new MapImageExportError("Current map image exporter is unavailable."),
        getSaveModalCopy("zh-CN").thumbnail,
      ),
    ).toBe("缩略图保存失败：Current map image exporter is unavailable.");
    expect(() => formatPlannerThumbnailSaveError(new Error("Unexpected Pixi fault."), getSaveModalCopy("en").thumbnail)).toThrow(
      "Unexpected Pixi fault.",
    );
  });

  it("renders local persistence, screenshot, and thumbnail controls together", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerSaveModalContent, {
        copy: getSaveModalCopy("zh-CN"),
        currentProjectId: "project-forest",
        currentProjectMapInstanceCount: 1,
        currentProjectMapInstanceName: "Forest Layout",
        currentProjectName: "Forest Farm",
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
        onCreateProject: () => undefined,
        onDeleteProject: () => undefined,
        onDuplicateProject: () => undefined,
        onExportProject: () => "{}",
        onImportProject: () => undefined,
        onOpenProject: () => undefined,
        onRenameProject: () => undefined,
        onSaveCurrentMap: async () => undefined,
        onSaveThumbnail: async () => undefined,
        projects: projectSummaries,
        season: "spring",
        storageErrorMessage: null,
        storageStatus: "ready",
        workspaceController: { getState: () => ({ activeProject: null }) } as never,
      }),
    );

    expect(markup).toContain("保存到此设备");
    expect(markup).toContain("使用 Google 继续");
    expect(markup).toContain("仅同步布局数据。地图预览图片保留在此设备上。");
    expect(markup).toContain("截图");
    expect(markup).toContain("保存缩略图");
    expect(markup).toContain("Forest Farm");
    expect(markup).toContain("Forest Layout");
    expect(markup.startsWith('<div class="planner-save-modal-content">')).toBe(
      true,
    );
    expect(
      markup.match(/class="planner-save-modal-content__exports"/g),
    ).toHaveLength(1);

    const exportsMarkup = markup.match(
      /<div class="planner-save-modal-content__exports">([\s\S]+)<\/div><\/div>$/,
    )?.[1];

    expect(exportsMarkup).toContain('aria-label="导出"');
    expect(exportsMarkup).toContain('aria-label="缩略图"');
  });

  it("notifies cloud sync only after a local save and reads the resulting active project ID", async () => {
    const eventOrder: string[] = [];
    let activeProjectId: string | null = null;
    const workspaceController = {
      getState: () => ({ activeProject: activeProjectId === null ? null : { id: activeProjectId } }),
    } as never;

    await saveCurrentMapAndNotifyCloudSync({
      saveCurrentMap: async () => {
        eventOrder.push("local-save");
        activeProjectId = "project-created-after-save";
      },
      onLocalProjectSaved: async (localProjectId) => {
        eventOrder.push(`cloud-sync:${localProjectId}`);
      },
      workspaceController,
    });

    expect(eventOrder).toEqual([
      "local-save",
      "cloud-sync:project-created-after-save",
    ]);
    expect(getActiveProjectIdAfterLocalSave(workspaceController)).toBe(
      "project-created-after-save",
    );
  });

  it("does not notify cloud sync when local save fails and rejects a missing active project ID", async () => {
    const notifyCloudProjectSaved = vi.fn(async () => undefined);
    const workspaceController = {
      getState: () => ({ activeProject: null }),
    } as never;

    await expect(saveCurrentMapAndNotifyCloudSync({
      saveCurrentMap: async () => {
        throw new Error("local storage is unavailable");
      },
      onLocalProjectSaved: notifyCloudProjectSaved,
      workspaceController,
    })).rejects.toThrow("local storage is unavailable");
    expect(notifyCloudProjectSaved).not.toHaveBeenCalled();
    expect(() => getActiveProjectIdAfterLocalSave(workspaceController)).toThrow(
      "active project ID is undefined",
    );
  });
});
