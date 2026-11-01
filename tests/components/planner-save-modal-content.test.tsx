import { createElement, type ComponentProps } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const recordedLocalProjectPanel = vi.hoisted(() => ({
  onCreateProject: undefined as (() => void | Promise<void>) | undefined,
}));

vi.mock("../../src/components/local-project-panel", async (importOriginal) => {
  const actualPanelModule = await importOriginal<
    typeof import("../../src/components/local-project-panel")
  >();

  return {
    ...actualPanelModule,
    LocalProjectPanel: (
      panelProperties: ComponentProps<typeof actualPanelModule.LocalProjectPanel>,
    ) => {
      recordedLocalProjectPanel.onCreateProject = panelProperties.onCreateProject;
      return actualPanelModule.LocalProjectPanel(panelProperties);
    },
  };
});

import {
  formatPlannerThumbnailSaveError,
  PlannerSaveModalContent,
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

function renderPlannerSaveModalContent(
  onCreateProject: () => void | Promise<void> = () => undefined,
): string {
  recordedLocalProjectPanel.onCreateProject = undefined;

  return renderToStaticMarkup(
    createElement(PlannerSaveModalContent, {
      copy: getSaveModalCopy("zh-CN"),
      currentProjectId: "project-forest",
      currentProjectMapInstanceCount: 1,
      currentProjectMapInstanceName: "Forest Layout",
      currentProjectName: "Forest Farm",
      mapFile: "Farm.tmx",
      onCaptureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
      onCreateProject,
      onDeleteProject: () => undefined,
      onDuplicateProject: () => undefined,
      onExportProject: () => "{}",
      onImportProject: () => undefined,
      onOpenProject: () => undefined,
      onRenameProject: () => undefined,
      onSaveThumbnail: async () => undefined,
      projects: projectSummaries,
      season: "spring",
      storageErrorMessage: null,
      storageStatus: "ready",
    }),
  );
}

describe("planner save modal content", () => {
  it("shows the known thumbnail failure and the concrete unknown error value", () => {
    const knownThumbnailFailure = new MapImageExportError(
      "Current map image exporter is unavailable.",
    );

    expect(
      formatPlannerThumbnailSaveError(
        knownThumbnailFailure,
        getSaveModalCopy("zh-CN").thumbnail,
      ),
    ).toBe("缩略图保存失败：Current map image exporter is unavailable.");
    expect(formatPlannerThumbnailSaveError(
      new Error("Unexpected Pixi fault."),
      getSaveModalCopy("en").thumbnail,
    )).toBe("Thumbnail save failed: Unexpected Pixi fault.");
    expect(formatPlannerThumbnailSaveError(
      "disk-full",
      getSaveModalCopy("en").thumbnail,
    )).toBe('Thumbnail save failed: received "disk-full"');
  });

  it("renders the local library without cloud actions or a separate save button", async () => {
    const onCreateProject = vi.fn();
    const markup = renderPlannerSaveModalContent(onCreateProject);
    const contentSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-save-modal-content.tsx"),
      "utf8",
    );

    const newProjectLabel = getSaveModalCopy("zh-CN").localProjects.newProject;
    expect(markup).not.toContain("保存到此设备");
    expect(markup).toContain(`>${newProjectLabel}</button>`);
    expect(markup).toContain("Forest Farm");
    expect(markup).toContain("Forest Layout");
    expect(markup).not.toContain("截图");
    expect(markup).not.toContain("保存缩略图");
    expect(markup).not.toContain("planner-save-modal-content__exports");
    expect(contentSource).toContain("MapImageExportPanel");
    expect(contentSource).toContain("copy.thumbnail.saveLabel");
    expect(contentSource).toContain("farmSummaryContent");
    expect(markup).not.toContain("使用 Google 继续");
    expect(markup).not.toContain("Continue with Google");
    expect(markup).not.toContain("云端同步");
    expect(markup).not.toContain("Cloud sync");
    expect(markup).not.toContain("仅同步布局数据。地图预览图片保留在此设备上。");
    expect(markup.startsWith('<div class="planner-save-modal-content">')).toBe(true);
    expect(markup).toContain("导入游戏存档");
    expect(markup).toContain("工具");
    expect(markup).not.toContain("planner-save-modal-loader__branches");
    const createProjectFromPanel = recordedLocalProjectPanel.onCreateProject;
    if (createProjectFromPanel === undefined) {
      throw new Error(
        "Local project panel did not receive onCreateProject. Received: undefined.",
      );
    }
    expect(createProjectFromPanel).toBe(onCreateProject);

    await createProjectFromPanel();

    expect(onCreateProject).toHaveBeenCalledOnce();
  });
});
