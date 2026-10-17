import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  filterLocalProjectSummaries,
  formatLocalProjectUpdatedAt,
  LocalProjectPanel,
} from "../../src/components/local-project-panel";
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
        onSaveCurrentMap: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain("Save to this device");
    expect(panelMarkup).toContain("New project");
    expect(panelMarkup).toContain("Open");
    expect(panelMarkup).toContain("Rename");
    expect(panelMarkup).toContain("Duplicate");
    expect(panelMarkup).toContain("Delete");
    expect(panelMarkup).toContain("Export JSON");
    expect(panelMarkup).toContain("More actions");
    expect(panelMarkup).toContain('aria-label="More actions: Forest Farm"');
    expect(panelMarkup).toContain("Import JSON");
    expect(panelMarkup).toContain("Forest Farm");
    expect(panelMarkup).toContain("Beach Cabin");
    expect(panelMarkup).toContain("Winter Layout");
    expect(panelMarkup).toContain("2 maps");
    expect(panelMarkup).toContain("Stored in this browser.");
    expect(panelMarkup).toContain('aria-label="Search local projects"');
    expect(panelMarkup).toContain('data-project-id="project-forest"');
    expect(panelMarkup).toContain('data-project-id="project-beach"');
    expect(panelMarkup).toContain('data-current-project="true"');
    expect(panelMarkup).toContain('src="data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA=="');
    expect(panelMarkup).toContain("No saved map preview");
    expectTextInOrder(panelMarkup, [
      'data-local-project-layout="columns"',
      'data-local-project-region="sidebar"',
      "Local projects",
      "Save to this device",
      "New project",
      "Import JSON",
      'data-local-project-region="main"',
      'aria-label="Search local projects"',
      'data-project-id="project-forest"',
    ]);
    const forestProjectCard = getProjectCardMarkup(panelMarkup, "project-forest");
    expect(forestProjectCard).toContain('data-project-action="open"');
    expect(forestProjectCard).toContain('data-project-action="rename"');
    expect(forestProjectCard).toContain('data-project-action="duplicate"');
    expect(forestProjectCard).toContain('data-project-action="export"');
    expect(forestProjectCard).toContain('data-project-action="delete"');
    expect(panelMarkup).toContain(
      formatLocalProjectUpdatedAt("2026-07-26T01:00:00.000Z", "en"),
    );
    expect(panelMarkup).not.toContain("2026-07-26T01:00:00.000Z");
    expect(panelMarkup).not.toMatch(/cloud|account|folder|shared|mods|upload|login|member|premium|sync|share|feedback/i);
    expect(panelMarkup).toContain('type="file"');
    expect(panelMarkup).toContain('accept="application/json,.json"');
    expect(panelMarkup).not.toMatch(/cloud|support|login|member|premium|sync|share|feedback/i);
    expectTextInOrder(panelMarkup, [
      "Save to this device",
      "New project",
      "Open",
      "Rename",
      "More actions",
      "Duplicate",
      "Export JSON",
      "Delete",
    ]);
    expectRequiredClassNames(panelMarkup, [
      "local-project-panel",
      "local-project-panel__status",
      "local-project-panel__primary-actions",
      "local-project-panel__import",
    ]);
  });

  it("keeps the local project list mounted while rendering the shared Library slots", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        copy: getSaveModalCopy("zh-CN").localProjects,
        currentProjectId: "project-forest",
        currentProjectName: "Forest Farm",
        deleteCopy: getSaveModalCopy("zh-CN").deleteProject,
        projects: localProjectSummaries,
        storageStatus: "ready",
        storageErrorMessage: null,
        sidebarContent: createElement(
          "nav",
          { "data-shared-sidebar-slot": "navigation" },
          "Import Game Save",
        ),
        mainContent: createElement(
          "section",
          { "data-shared-main-slot": "branch" },
          "Farm Summary",
        ),
        isProjectListActive: false,
        onCreateProject: ignoreLocalProjectAction,
        onDeleteProject: ignoreLocalProjectAction,
        onDuplicateProject: ignoreLocalProjectAction,
        onExportProject: () => "{}",
        onImportProject: ignoreLocalProjectAction,
        onOpenProject: ignoreLocalProjectAction,
        onRenameProject: ignoreLocalProjectAction,
        onSaveCurrentMap: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain('data-shared-sidebar-slot="navigation"');
    expect(panelMarkup).toContain('data-shared-main-slot="branch"');
    expect(panelMarkup).toContain('hidden=""');
    expect(panelMarkup).toContain('data-project-id="project-forest"');
    expect(panelMarkup).toContain('aria-label="搜索本地项目"');
    expect(panelMarkup).toContain("更多操作");
    expectTextInOrder(panelMarkup, [
      'data-local-project-region="sidebar"',
      'data-shared-sidebar-slot="navigation"',
      'data-local-project-region="main"',
      'aria-label="搜索本地项目"',
      'data-project-id="project-forest"',
      'data-shared-main-slot="branch"',
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
        onSaveCurrentMap: ignoreLocalProjectAction,
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
        onSaveCurrentMap: ignoreLocalProjectAction,
      }),
    );

    expect(panelMarkup).toContain("还没有本地项目。保存时会创建“未命名项目”，并保存当前地图。");
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
});

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
