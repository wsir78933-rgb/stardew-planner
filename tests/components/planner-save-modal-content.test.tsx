import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
        onSaveCurrentMap: () => undefined,
        onSaveThumbnail: async () => undefined,
        projects: projectSummaries,
        season: "spring",
        storageErrorMessage: null,
        storageStatus: "ready",
      }),
    );

    expect(markup).toContain("保存到此设备");
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
});
