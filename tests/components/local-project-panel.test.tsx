import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  intersectPopoverBounds,
  LIBRARY_POPOVER_GAP_PX,
  placeLibraryPopover,
  type PopoverBounds,
} from "../../src/components/local-project-popover-position";
import {
  convertWebpDataUrlToBlob,
  countLocalProjectsInFolder,
  createProjectImageFilename,
  filterLocalProjectSummaries,
  formatLocalProjectUpdatedAt,
  LocalProjectPanel,
  readLibraryChromeCopy,
} from "../../src/components/local-project-panel";
import { readLibraryPopoverDomId } from "../../src/components/use-local-project-popover";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import type {
  ReferenceProjectSummary,
} from "../../src/reference-runtime/reference-project-repository";

const localProjectSummaries: readonly ReferenceProjectSummary[] = [
  {
    id: "project-forest",
    title: "Forest Farm",
    created_at: "2026-07-26T00:00:00.000Z",
    updated_at: "2026-07-26T01:00:00.000Z",
    mapCount: 2,
    activeMapThumbnailDataUrl: "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==",
  },
  {
    id: "project-beach",
    title: "Beach Cabin",
    created_at: "2026-07-25T00:00:00.000Z",
    updated_at: "2026-07-25T01:00:00.000Z",
    mapCount: 1,
    activeMapThumbnailDataUrl: null,
  },
];

async function ignoreLocalProjectAction(): Promise<void> {}

describe("local project panel", () => {
  it("renders the complete account-free local project action set", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("en").localProjects,
        currentProjectId: "project-forest",
        currentProjectName: "Forest Farm",
        currentProjectMapInstanceCount: 2,
        currentProjectMapInstanceName: "Winter Layout",
        deleteCopy: getSaveModalCopy("en").deleteProject,
        projects: localProjectSummaries,
        storageStatus: "ready",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onExportProject: () => '{"formatVersion":1}',
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
      }),
    );

    const localProjectCopy = getSaveModalCopy("en").localProjects;
    const newProjectLabel = localProjectCopy.newProject;
    const searchProjectsLabel = localProjectCopy.searchProjects;
    expect(panelMarkup).not.toContain("Save to this device");
    expect(panelMarkup).toContain(`>${newProjectLabel}</button>`);
    expect(panelMarkup).toContain("Import Game Save");
    expect(panelMarkup).toContain("Tools");
    expect(panelMarkup).not.toContain("My Plans");
    expect(panelMarkup).toContain('aria-label="Project groups"');
    expect(panelMarkup).toContain("Project groups");
    expect(panelMarkup).not.toContain("New folder");
    expect(panelMarkup).toContain("Open");
    expect(panelMarkup).not.toContain('aria-label="Rename"');
    expect(panelMarkup).toContain('aria-label="Move"');
    expect(panelMarkup).toContain('aria-label="More actions"');
    expect(panelMarkup).toContain("Import JSON");
    expect(panelMarkup).toContain("Forest Farm");
    expect(panelMarkup).toContain("Beach Cabin");
    expect(panelMarkup).toContain("Winter Layout");
    expect(panelMarkup).toContain("2 maps");
    expect(panelMarkup).toContain("Stored in this browser.");
    expect(panelMarkup).toContain(`aria-label="${searchProjectsLabel}"`);
    expect(panelMarkup).toContain('data-project-id="project-forest"');
    expect(panelMarkup).toContain('data-project-id="project-beach"');
    expect(panelMarkup).toContain('data-current-project="true"');
    expect(panelMarkup).not.toContain('data-folder-id="my-plans"');
    expect(panelMarkup).not.toContain("data-folder-count=");
    expect(panelMarkup).toContain('src="data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA=="');
    expect(panelMarkup).toContain("No saved map preview");
    expect(panelMarkup).not.toContain("planner-save-modal-loader__branches");
    expectTextInOrder(panelMarkup, [
      'data-local-project-layout="columns"',
      'data-local-project-region="sidebar"',
      newProjectLabel,
      "Import Game Save",
      "Import JSON",
      "Project groups",
      "Tools",
      'data-local-project-region="main"',
      `aria-label="${searchProjectsLabel}"`,
      'data-project-id="project-forest"',
    ]);
    const forestProjectCard = getProjectCardMarkup(panelMarkup, "project-forest");
    expect(forestProjectCard.indexOf('src="data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA=="'))
      .toBeLessThan(forestProjectCard.indexOf('data-current-placement="title"'));
    expect(forestProjectCard).toContain(">Current<");
    expect(forestProjectCard).toContain('data-project-action="open"');
    expect(forestProjectCard).toContain('data-project-action="move"');
    expect(forestProjectCard).toContain('data-project-action="more"');
    expect(forestProjectCard).toContain('data-project-action="download-image"');
    expectTextInOrder(forestProjectCard, [
      'data-project-action="open"',
      'data-project-action="move"',
      'data-project-action="more"',
      'data-project-action="download-image"',
    ]);
    const forestDownloadButton = readOpeningTag(
      forestProjectCard,
      'data-project-action="download-image"',
    );
    expect(forestDownloadButton).not.toContain('disabled=""');
    expect(forestDownloadButton).toContain('aria-label="Download image: Forest Farm"');
    expect(forestDownloadButton).toContain('title="Download image: Forest Farm"');

    const beachProjectCard = getProjectCardMarkup(panelMarkup, "project-beach");
    expect(beachProjectCard).toContain('data-project-action="download-image"');
    const beachDownloadButton = readOpeningTag(
      beachProjectCard,
      'data-project-action="download-image"',
    );
    expect(beachDownloadButton).toContain('disabled=""');
    expect(beachDownloadButton).toContain(
      'aria-label="No downloadable preview for this project"',
    );
    expect(beachDownloadButton).toContain(
      'title="No downloadable preview for this project"',
    );
    expect(forestProjectCard).toContain('aria-expanded="false"');
    expect(forestProjectCard).not.toContain("aria-controls");
    expect(forestProjectCard).not.toContain("local-project-more-menu-");
    expect(forestProjectCard).not.toContain("local-project-move-menu-");
    expect(forestProjectCard).not.toContain('aria-label="Rename"');
    expect(panelMarkup).toContain(
      formatLocalProjectUpdatedAt("2026-07-26T01:00:00.000Z", "en"),
    );
    expect(panelMarkup).not.toContain("2026-07-26T01:00:00.000Z");
    expect(panelMarkup).not.toMatch(/cloud|account|shared|mods|upload|login|member|premium|sync|share|feedback/i);
    expect(panelMarkup).toContain('type="file"');
    expect(panelMarkup).toContain('accept="application/json,.json"');
    expect(panelMarkup).not.toMatch(/cloud|support|login|member|premium|sync|share|feedback/i);
    expectTextInOrder(panelMarkup, [
      newProjectLabel,
      "Import Game Save",
      "Open",
      'aria-label="Move"',
      'aria-label="More actions"',
      'aria-label="Download image: Forest Farm"',
    ]);
    expectRequiredClassNames(panelMarkup, [
      "local-project-panel",
      "local-project-panel__status",
      "local-project-panel__primary-actions",
      "local-project-panel__import",
    ]);
  });

  it("filters local projects by title without matching case and reports no matches", () => {
    expect(filterLocalProjectSummaries(localProjectSummaries, " fOrEsT ")).toEqual([
      localProjectSummaries[0],
    ]);
    expect(filterLocalProjectSummaries(localProjectSummaries, "unknown")).toEqual([]);
    expect(filterLocalProjectSummaries(localProjectSummaries, "  ")).toEqual(
      localProjectSummaries,
    );
    const folderScopedProjectSummaries = [
      localProjectSummaries[0],
      { ...localProjectSummaries[1], folderId: "folder-cabin" },
    ];
    expect(filterLocalProjectSummaries(folderScopedProjectSummaries, "", null)).toEqual([
      folderScopedProjectSummaries[0],
    ]);
    expect(filterLocalProjectSummaries(folderScopedProjectSummaries, "beach", null)).toEqual([]);
    expect(filterLocalProjectSummaries(folderScopedProjectSummaries, "", "folder-cabin")).toEqual([
      folderScopedProjectSummaries[1],
    ]);
    expect(filterLocalProjectSummaries(folderScopedProjectSummaries, "forest", "folder-cabin")).toEqual([]);
    expect(countLocalProjectsInFolder(folderScopedProjectSummaries, null)).toBe(1);
    expect(countLocalProjectsInFolder(folderScopedProjectSummaries, "folder-cabin")).toBe(1);
    expect(() => filterLocalProjectSummaries(localProjectSummaries, "", "  ")).toThrow(
      /selected folder id is "  "/,
    );
  });

  it("keeps the disabled import input and disabled label class while storage opens", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("en").localProjects,
        currentProjectId: null,
        currentProjectName: null,
        deleteCopy: getSaveModalCopy("en").deleteProject,
        projects: [],
        storageStatus: "loading",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain(
      'class="local-project-panel__import local-project-panel__import--disabled"',
    );
    expect(panelMarkup).toContain(
      'accept="application/json,.json" disabled="" type="file"',
    );
  });

  it("explains that saving creates an Untitled Project when no projects exist", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("zh-CN").localProjects,
        currentProjectId: null,
        currentProjectName: null,
        deleteCopy: getSaveModalCopy("zh-CN").deleteProject,
        projects: [],
        storageStatus: "ready",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain("还没有本地项目。保存时会创建“未命名项目”，并保存当前地图。");
    expect(panelMarkup).toContain('data-empty-state="library"');
    expect(panelMarkup).toContain("导入游戏存档");
    expect(panelMarkup).toContain("工具");
    expect(panelMarkup).not.toContain("我的计划");
    expect(panelMarkup).toContain('aria-label="项目分组"');
    expect(panelMarkup).toContain("项目分组");
    expect(panelMarkup).not.toContain("新建文件夹");
    expect(panelMarkup).not.toContain('data-empty-state="folder"');
  });

  it("shows My Plans projects and keeps a folder project out of that list", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("en").localProjects,
        currentProjectId: null,
        currentProjectName: null,
        deleteCopy: getSaveModalCopy("en").deleteProject,
        folders: [{ id: "folder-cabin", name: "Cabins" }],
        projects: [
          localProjectSummaries[0],
          { ...localProjectSummaries[1], folderId: "folder-cabin" },
        ],
        storageStatus: "ready",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain('data-project-id="project-forest"');
    expect(panelMarkup).not.toContain('data-project-id="project-beach"');
    expect(panelMarkup).toContain("Project groups");
    expect(panelMarkup).not.toContain("Cabins");
    expect(panelMarkup).not.toContain('data-folder-id="folder-cabin"');
    expect(panelMarkup).not.toContain('data-folder-id="my-plans"');
    expect(panelMarkup).not.toContain("data-folder-count=");
    expect(panelMarkup).toContain('data-selected-folder-id="my-plans"');
  });

  it("keeps My Plans and custom folder controls out of collapsed project groups", () => {
    for (const locale of ["en", "zh-CN"] as const) {
      const libraryChromeCopy = readLibraryChromeCopy(locale);
      const panelMarkup = renderToStaticMarkup(
        createElement(LocalProjectPanel, {
          copy: getSaveModalCopy(locale).localProjects,
          currentProjectId: null,
          currentProjectName: null,
          deleteCopy: getSaveModalCopy(locale).deleteProject,
          projects: [],
          storageStatus: "ready",
          storageErrorMessage: null,
          onCreateProject: ignoreLocalProjectAction,
          onDeleteProject: ignoreLocalProjectAction,
          onDuplicateProject: ignoreLocalProjectAction,
          onExportProject: () => "{}",
          onImportProject: ignoreLocalProjectAction,
          onOpenProject: ignoreLocalProjectAction,
          onRenameProject: ignoreLocalProjectAction,
        }),
      );

      expect(panelMarkup).not.toContain(libraryChromeCopy.myPlans);
      expect(panelMarkup).not.toContain('data-folder-id="my-plans"');
      expect(panelMarkup).toContain(libraryChromeCopy.projectGroups);
      expect(panelMarkup).not.toContain(`placeholder="${libraryChromeCopy.folderNameLabel}"`);
      expect(panelMarkup).not.toContain(libraryChromeCopy.newFolder);
      expect(panelMarkup).not.toContain("<details open");
    }
  });

  it("places one library popover inside the library and viewport intersection", () => {
    expect(LIBRARY_POPOVER_GAP_PX).toBe(4);
    expect(readLibraryPopoverDomId("more", "project-forest")).toBe(
      "local-project-more-menu-project-forest",
    );
    expect(readLibraryPopoverDomId("move", "project-beach")).toBe(
      "local-project-move-menu-project-beach",
    );
    expect(() => readLibraryPopoverDomId("more", "")).toThrow(/projectId is ""/);
    expect(() => readLibraryPopoverDomId("drop" as "more", "project-forest")).toThrow(/"drop"/);

    const libraryBounds: PopoverBounds = { top: 8, right: 500, bottom: 420, left: 30 };
    const viewportBounds: PopoverBounds = { top: 0, right: 360, bottom: 240, left: 12 };
    const visibleBounds = intersectPopoverBounds(libraryBounds, viewportBounds);
    expect(visibleBounds).toEqual({ top: 8, right: 360, bottom: 240, left: 30 });

    const placedBelow = placeLibraryPopover({
      boundaryBounds: { top: 0, right: 400, bottom: 300, left: 0 },
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 50,
      popoverWidth: 90,
      triggerBounds: { top: 40, right: 120, bottom: 70, left: 40 },
    });
    expect(placedBelow).toEqual({
      top: 74,
      left: 40,
      maxHeight: 50,
      maxWidth: 90,
      placedAbove: false,
    });

    const placedAbove = placeLibraryPopover({
      boundaryBounds: { top: 0, right: 400, bottom: 300, left: 0 },
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 80,
      popoverWidth: 100,
      triggerBounds: { top: 250, right: 100, bottom: 280, left: 20 },
    });
    expect(placedAbove).toEqual({
      top: 166,
      left: 20,
      maxHeight: 80,
      maxWidth: 100,
      placedAbove: true,
    });

    const shiftedLeft = placeLibraryPopover({
      boundaryBounds: { top: 0, right: 400, bottom: 300, left: 0 },
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 30,
      popoverWidth: 120,
      triggerBounds: { top: 20, right: 390, bottom: 50, left: 340 },
    });
    expect(shiftedLeft).toEqual({
      top: 54,
      left: 280,
      maxHeight: 30,
      maxWidth: 120,
      placedAbove: false,
    });

    const placedInVisibleBounds = placeLibraryPopover({
      boundaryBounds: visibleBounds,
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 70,
      popoverWidth: 80,
      triggerBounds: { top: 180, right: 350, bottom: 210, left: 300 },
    });
    expect(placedInVisibleBounds.placedAbove).toBe(true);
    expect(placedInVisibleBounds.top).toBeGreaterThanOrEqual(visibleBounds.top);
    expect(placedInVisibleBounds.left).toBeGreaterThanOrEqual(visibleBounds.left);
    expect(placedInVisibleBounds.top + placedInVisibleBounds.maxHeight)
      .toBeLessThanOrEqual(visibleBounds.bottom);
    expect(placedInVisibleBounds.left + placedInVisibleBounds.maxWidth)
      .toBeLessThanOrEqual(visibleBounds.right);
    expect(placedInVisibleBounds).toEqual({
      top: 106,
      left: 280,
      maxHeight: 70,
      maxWidth: 80,
      placedAbove: true,
    });

    expect(() => placeLibraryPopover({
      boundaryBounds: visibleBounds,
      gapPx: -1,
      popoverHeight: 70,
      popoverWidth: 80,
      triggerBounds: { top: 180, right: 350, bottom: 210, left: 300 },
    })).toThrow(/gapPx is -1/);
    expect(() => placeLibraryPopover({
      boundaryBounds: visibleBounds,
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 70,
      popoverWidth: 0,
      triggerBounds: { top: 180, right: 350, bottom: 210, left: 300 },
    })).toThrow(/popoverWidth is 0/);
    expect(() => placeLibraryPopover({
      boundaryBounds: { ...visibleBounds, top: Number.POSITIVE_INFINITY },
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 70,
      popoverWidth: 80,
      triggerBounds: { top: 180, right: 350, bottom: 210, left: 300 },
    })).toThrow(/boundary bounds because top is null/);
    expect(() => placeLibraryPopover({
      boundaryBounds: { top: 10, right: 10, bottom: 40, left: 10 },
      gapPx: LIBRARY_POPOVER_GAP_PX,
      popoverHeight: 20,
      popoverWidth: 20,
      triggerBounds: { top: 12, right: 20, bottom: 22, left: 12 },
    })).toThrow(/"top":10/);
  });

  it("rejects a preview that is not a local WebP data URL", () => {
    expect(() => renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("en").localProjects,
        currentProjectId: "project-forest",
        currentProjectName: "Forest Farm",
        deleteCopy: getSaveModalCopy("en").deleteProject,
        projects: [{
          ...localProjectSummaries[0],
          activeMapThumbnailDataUrl: "/api/projects/project-forest/maps/map-1/thumbnail",
        }],
        storageStatus: "ready",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
      }),
    )).toThrow("/api/projects/project-forest/maps/map-1/thumbnail");
  });

  it("keeps compact card actions and the cream library colors in the stylesheet", () => {
    const panelStylesheet = readFileSync(
      resolve(process.cwd(), "src/components/local-project-panel.module.css"),
      "utf8",
    );

    expect(panelStylesheet).toContain("width: 117px");
    expect(panelStylesheet).toContain("height: 44px");
    expect(panelStylesheet).toContain("width: 72px");
    expect(panelStylesheet).toContain("height: 36px");
    expect(panelStylesheet).toContain("width: 36px");
    expect(panelStylesheet).not.toContain("height: 60px");
    expect(panelStylesheet).not.toContain("width: 60px");
    expect(panelStylesheet).toContain("gap: 12px");
    expect(panelStylesheet).toContain("gap: 8px");
    expect(panelStylesheet).toContain("flex-wrap: wrap");
    expect(panelStylesheet).toContain("repeat(4, minmax(0, 1fr))");
    expect(panelStylesheet).not.toContain("repeat(auto-fit, minmax(360px, 1fr))");
    expect(panelStylesheet).not.toContain("minmax(360px, 1fr)");
    expect(panelStylesheet).not.toContain("max-width: min(100%, 480px)");
    expect(panelStylesheet).not.toContain("620px");
    expect(panelStylesheet).not.toContain("minmax(360px, 620px)");
    expect(panelStylesheet).toContain("repeat(2, minmax(0, 1fr))");
    const desktopOpenButtonBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".openProjectButton",
    );
    expect(desktopOpenButtonBlock).toContain("width: 72px;");
    expect(desktopOpenButtonBlock).toContain("height: 36px;");
    expect(desktopOpenButtonBlock).toContain("min-height: 36px;");
    const desktopIconButtonBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".iconActionButton,\n.moreActionsSummary",
    );
    expect(desktopIconButtonBlock).toContain("width: 36px;");
    expect(desktopIconButtonBlock).toContain("height: 36px;");
    expect(desktopIconButtonBlock).toContain("border-radius: 0.35rem;");
    expect(panelStylesheet).toContain(`.moreActions {
  display: block;
  flex: 0 0 36px;
  position: relative;
  width: 36px;
}`);
    expect(panelStylesheet).toContain(`.openProjectButton {
    flex-basis: 117px;
    height: 44px;
    min-height: 44px;
    width: 117px;
  }`);
    expect(panelStylesheet).toContain(`.iconActionButton,
  .moreActions,
  .moreActionsSummary {
    flex-basis: 44px;
    height: 44px;
    min-height: 44px;
    min-width: 44px;
    width: 44px;
  }`);
    expect(panelStylesheet).toContain(`@media (max-width: 1100px) {
  .projectGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}`);
    expect(panelStylesheet).toContain(`@media (max-width: 720px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .projectGrid {
    grid-template-columns: minmax(0, 320px);
  }`);
    const desktopActionIconBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".actionIcon",
    );
    expect(desktopActionIconBlock).toContain("width: 16px;");
    expect(desktopActionIconBlock).toContain("height: 16px;");
    const desktopCardActionsBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".projectCardActions",
    );
    expect(desktopCardActionsBlock).toContain("gap: 8px;");
    expect(desktopCardActionsBlock).toContain("flex-wrap: wrap;");
    const desktopProjectGridBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".projectGrid",
    );
    expect(desktopProjectGridBlock).toContain(
      "grid-template-columns: repeat(4, minmax(0, 1fr));",
    );
    const desktopProjectCardBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".projectCard",
    );
    expect(desktopProjectCardBlock).toContain("max-width: 100%;");
    expect(desktopProjectCardBlock).toContain("width: 100%;");
    expect(desktopProjectCardBlock).not.toContain("480px");
    const desktopRenameFormBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".renameForm",
    );
    expect(desktopRenameFormBlock).toContain("display: flex;");
    expect(desktopRenameFormBlock).toContain("flex-wrap: wrap;");
    expect(desktopRenameFormBlock).toContain("gap: 6px;");
    expect(desktopRenameFormBlock).not.toContain("grid-template-columns");
    const desktopRenameLabelBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".renameForm label",
    );
    expect(desktopRenameLabelBlock).toContain("width: 100%;");
    expect(desktopRenameLabelBlock).toContain("min-width: 0;");
    expect(desktopRenameLabelBlock).not.toContain("grid-column");
    const desktopRenameInputBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      ".renameForm input",
    );
    expect(desktopRenameInputBlock).toContain("box-sizing: border-box;");
    expect(desktopRenameInputBlock).toContain("width: 100%;");
    expect(desktopRenameInputBlock).toContain("min-width: 0;");
    expect(desktopRenameInputBlock).toContain("max-width: 100%;");
    expect(panelStylesheet).toContain(`.renameForm button {
  font-size: 13px;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: normal;
  padding: 0 10px;
  white-space: nowrap;
  width: max-content;
}`);
    const renameInputSelector =
      '.renameForm input[type="text"]:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"])';
    const renameInputDeclarationBlock = readCssDeclarationBlockForSelector(
      panelStylesheet,
      renameInputSelector,
    );
    expect(renameInputDeclarationBlock).toContain(
      "background: var(--card);",
    );
    expect(renameInputDeclarationBlock).toContain(
      "border: 1px solid var(--ring);",
    );
    expect(renameInputDeclarationBlock).toContain("box-shadow: none;");
    expect(panelStylesheet).toContain(`.layout .main .renameForm :is(input, button),
  .moveDestinations button,
  .moreActionsMenu button {
    min-height: 44px;
  }`);
    expect(panelStylesheet).toContain("minmax(0, 320px)");
    expect(panelStylesheet).toContain("var(--background)");
    expect(panelStylesheet).toContain("var(--card)");
    expect(panelStylesheet).toContain("var(--secondary)");
    expect(panelStylesheet).toContain("var(--foreground)");
    expect(panelStylesheet).toContain("var(--muted-foreground)");
    expect(panelStylesheet).toContain("var(--ring)");
    expect(panelStylesheet).toContain("var(--destructive)");
    expect(panelStylesheet).not.toContain("#c9fb45");
    expect(panelStylesheet).toContain("justify-content: flex-start");
  });

  it("formats stored timestamps for people instead of exposing the raw ISO value", () => {
    const rawUpdatedAt = "2026-08-10T12:00:00.000Z";
    const formattedUpdatedAt = formatLocalProjectUpdatedAt(rawUpdatedAt, "zh-CN");

    expect(formattedUpdatedAt).toBe(
      new Intl.DateTimeFormat("zh-CN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(rawUpdatedAt)),
    );
    expect(formattedUpdatedAt).not.toBe(rawUpdatedAt);
    expect(formattedUpdatedAt).not.toContain("T12:00:00.000Z");
  });

  it("rejects an invalid stored timestamp with the offending value", () => {
    expect(() => formatLocalProjectUpdatedAt("not-a-date", "en")).toThrow(
      /not-a-date/,
    );
  });

  it("resets the exact selected import input in a finally block", () => {
    const panelSource = readFileSync(
      resolve(process.cwd(), "src/components/local-project-panel.tsx"),
      "utf8",
    );
    const importOperationSource = getFunctionSource(
      panelSource,
      "async function importSelectedProjectFile",
      "  return (",
    );

    expect(importOperationSource).toContain("finally {");
    expect(importOperationSource).toContain(
      "selectedProjectFileInput.value = \"\";",
    );
  });

  it("renders localized download image labels and states for preview presence in zh-CN", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("zh-CN").localProjects,
        currentProjectId: "project-forest",
        currentProjectName: "Forest Farm",
        deleteCopy: getSaveModalCopy("zh-CN").deleteProject,
        projects: localProjectSummaries,
        storageStatus: "ready",
        storageErrorMessage: null,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
      }),
    );

    const forestCard = getProjectCardMarkup(panelMarkup, "project-forest");
    const forestDownload = readOpeningTag(forestCard, 'data-project-action="download-image"');
    expect(forestDownload).not.toContain('disabled=""');
    expect(forestDownload).toContain('aria-label="下载图片：Forest Farm"');
    expect(forestDownload).toContain('title="下载图片：Forest Farm"');

    const beachCard = getProjectCardMarkup(panelMarkup, "project-beach");
    const beachDownload = readOpeningTag(beachCard, 'data-project-action="download-image"');
    expect(beachDownload).toContain('disabled=""');
    expect(beachDownload).toContain('aria-label="该项目暂无可下载预览"');
    expect(beachDownload).toContain('title="该项目暂无可下载预览"');
  });

  it("creates sanitized WebP filenames containing the project title and rejecting invalid titles", () => {
    expect(createProjectImageFilename("Forest Farm")).toBe("Forest Farm.webp");
    expect(
      createProjectImageFilename("Farm / Summer : 01 * Layout ? <Test> | Final \\ Output"),
    ).toBe("Farm - Summer - 01 - Layout - -Test- - Final - Output.webp");
    expect(() => createProjectImageFilename("")).toThrow(/project title is ""/);
    expect(() => createProjectImageFilename("   ")).toThrow(/project title is "   "/);
  });

  it("converts a valid base64 WebP data URL to an image/webp Blob and rejects non-webp or invalid data URLs", () => {
    const validDataUrl = "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==";
    const blob = convertWebpDataUrlToBlob(validDataUrl);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/webp");
    expect(blob.size).toBeGreaterThan(0);

    expect(() => convertWebpDataUrlToBlob("data:image/png;base64,abc")).toThrow(
      /is not a WebP data URL/,
    );
    expect(() => convertWebpDataUrlToBlob("https://example.com/preview.webp")).toThrow(
      /is not a WebP data URL/,
    );
  });

  it("names the received data URL when a WebP prefix has invalid base64", () => {
    const invalidWebpDataUrl = "data:image/webp;base64,%%%%";

    expect(() => convertWebpDataUrlToBlob(invalidWebpDataUrl)).toThrow(
      'Cannot convert data URL to Blob because the base64 payload is invalid. Received: "data:image/webp;base64,%%%%".',
    );
  });

  it("rethrows an unknown WebP decode error without replacing it", () => {
    const originalAtob = globalThis.atob;
    const unknownDecodeError = new Error("decoder exploded");
    globalThis.atob = () => {
      throw unknownDecodeError;
    };

    try {
      let thrownError: unknown;
      try {
        convertWebpDataUrlToBlob("data:image/webp;base64,AAAA");
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).toBe(unknownDecodeError);
    } finally {
      globalThis.atob = originalAtob;
    }
  });

  it("rejects zh and zh-TW library locales with the offending value", () => {
    expect(readLibraryChromeCopy("zh-CN").moreActions).toBe("更多操作");
    expect(readLibraryChromeCopy("en").moreActions).toBe("More actions");
    expect(readLibraryChromeCopy("zh-CN").projectGroups).toBe("项目分组");
    expect(readLibraryChromeCopy("en").projectGroups).toBe("Project groups");
    expect(readLibraryChromeCopy("zh-CN").renameFolder).toBe("重命名文件夹");
    expect(readLibraryChromeCopy("en").renameFolder).toBe("Rename folder");
    expect(readLibraryChromeCopy("zh-CN").blankFolderName("  ")).toBe(
      '文件夹名称不能为空。收到的名称是 "  "。',
    );
    expect(readLibraryChromeCopy("en").blankFolderName("")).toBe(
      'Folder name cannot be blank. Received name: "".',
    );
    expect(() => readLibraryChromeCopy("zh" as HomepageLocale)).toThrow(
      'Cannot read library labels because dateTimeLocale is "zh".',
    );
    expect(() => readLibraryChromeCopy("zh-TW" as HomepageLocale)).toThrow(
      'Cannot read library labels because dateTimeLocale is "zh-TW".',
    );
  });
});

function readOpeningTag(markup: string, attributeMarker: string): string {
  const attributeIndex = markup.indexOf(attributeMarker);
  if (attributeIndex < 0) {
    throw new Error(`Rendered markup has no ${attributeMarker}.`);
  }
  const tagStart = markup.lastIndexOf("<", attributeIndex);
  const tagEnd = markup.indexOf(">", attributeIndex);
  if (tagStart < 0 || tagEnd < 0) {
    throw new Error(`Cannot read the opening tag for ${attributeMarker}.`);
  }
  return markup.slice(tagStart, tagEnd + 1);
}

function expectTextInOrder(markup: string, expectedTexts: readonly string[]): void {
  let previousTextIndex = -1;

  for (const expectedText of expectedTexts) {
    const currentTextIndex = markup.indexOf(expectedText, previousTextIndex + 1);

    expect(currentTextIndex).toBeGreaterThan(previousTextIndex);
    previousTextIndex = currentTextIndex;
  }
}

function getFunctionSource(
  source: string,
  functionStartMarker: string,
  functionEndMarker: string,
): string {
  const functionStartIndex = source.indexOf(functionStartMarker);
  const functionEndIndex = source.indexOf(functionEndMarker, functionStartIndex);

  if (functionStartIndex < 0 || functionEndIndex < 0) {
    throw new Error(
      `Cannot read function source from ${JSON.stringify(functionStartMarker)} to ${JSON.stringify(functionEndMarker)}.`,
    );
  }

  return source.slice(functionStartIndex, functionEndIndex);
}

function getProjectCardMarkup(markup: string, projectId: string): string {
  const projectIdIndex = markup.indexOf(`data-project-id="${projectId}"`);
  const cardStartIndex = markup.lastIndexOf("<li ", projectIdIndex);
  const cardEndIndex = markup.indexOf("</li>", projectIdIndex);

  if (projectIdIndex < 0 || cardStartIndex < 0 || cardEndIndex < 0) {
    throw new Error(
      `Cannot find rendered local project card ${JSON.stringify(projectId)}.`,
    );
  }

  return markup.slice(cardStartIndex, cardEndIndex + "</li>".length);
}

function expectRequiredClassNames(
  markup: string,
  requiredClassNames: readonly string[],
): void {
  for (const requiredClassName of requiredClassNames) {
    expect(markup).toContain(requiredClassName);
  }
}

function readCssDeclarationBlockForSelector(
  stylesheet: string,
  targetSelector: string,
): string {
  if (!stylesheet.includes(targetSelector)) {
    throw new Error(
      `Cannot find selector ${JSON.stringify(targetSelector)} in stylesheet.`,
    );
  }
  const escapedSelector = targetSelector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rulePattern = new RegExp(`${escapedSelector}[^{}]*\\{([^}]+)\\}`);
  const matchResult = stylesheet.match(rulePattern);
  if (!matchResult || !matchResult[1]) {
    throw new Error(
      `Cannot find declaration block for selector ${JSON.stringify(targetSelector)}.`,
    );
  }
  return matchResult[1];
}

