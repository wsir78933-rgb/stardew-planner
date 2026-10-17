import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
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

describe("planner save modal content", () => {
  it("formats known thumbnail capture failures and rethrows unknown failures", () => {
    expect(
      formatPlannerThumbnailSaveError(
        new MapImageExportError("Current map image exporter is unavailable."),
        getSaveModalCopy("zh-CN").thumbnail,
      ),
    ).toBe("缩略图保存失败：Current map image exporter is unavailable.");
    expect(() =>
      formatPlannerThumbnailSaveError(
        new Error("Unexpected Pixi fault."),
        getSaveModalCopy("en").thumbnail,
      ),
    ).toThrow("Unexpected Pixi fault.");
  });

  it("renders local project and tool controls without account or cloud sync UI", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerSaveModalContent, {
        copy: getSaveModalCopy("zh-CN"),
        isProjectsBranchActive: true,
        mainBranchContent: createElement(
          "div",
          { hidden: true },
          "Lazy branch content",
        ),
        sidebarNavigation: createElement(
          "nav",
          { "aria-label": "保存工具" },
          createElement("button", { type: "button" }, "导入游戏存档"),
        ),
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
        onActivateProjectList: () => undefined,
        onSaveThumbnail: async () => undefined,
        projects: projectSummaries,
        season: "spring",
        storageErrorMessage: null,
        storageStatus: "ready",
      }),
    );

    expect(markup).toContain("保存到此设备");
    expect(markup).toContain("新建方案");
    expect(markup).toContain("我的方案");
    expect(markup).toContain("+ 新建文件夹");
    expect(markup).toContain("导入游戏存档");
    expect(markup).not.toMatch(/Google|云端|云同步|同步全部/);
    expect(markup).toContain('aria-label="保存工具"');
    expect(markup).toContain("Lazy branch content");
    expect(markup).toContain("截图");
    expect(markup).toContain("保存缩略图");
    expect(markup).toContain("Forest Farm");
    expect(markup).toContain("Forest Layout");
    expect(markup.startsWith('<div class="planner-save-modal-content">')).toBe(true);
    expect(
      markup.match(/class="planner-save-modal-content__exports [^"]+"/g),
    ).toHaveLength(1);
    expect(markup).toContain('aria-label="导出"');
    expect(markup).toContain('aria-label="缩略图"');
  });

  it("passes local map saving directly to the Library without a cloud callback", () => {
    const contentSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-save-modal-content.tsx"),
      "utf8",
    );

    expect(contentSource).toContain("onSaveCurrentMap={onSaveCurrentMap}");
    expect(contentSource).not.toContain("useCloudProjectSync");
    expect(contentSource).not.toContain("CloudProjectPanel");
    expect(contentSource).not.toContain("onLocalProjectSaved");
  });
});
