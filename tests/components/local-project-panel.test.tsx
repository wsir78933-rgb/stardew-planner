import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocalProjectPanel } from "../../src/components/local-project-panel";
import type { LocalProjectSummary } from "../../src/projects/local-project-store";

const localProjectSummaries: readonly LocalProjectSummary[] = [
  {
    id: "project-forest",
    name: "Forest Farm",
    createdAt: "2026-07-26T00:00:00.000Z",
    updatedAt: "2026-07-26T01:00:00.000Z",
    activeMapId: "forest",
  },
];

function ignoreLocalProjectAction(): void {}

describe("local project panel", () => {
  it("renders the complete account-free local project action set", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        currentProjectId: "project-forest",
        currentProjectName: "Forest Farm",
        currentProjectMapInstanceCount: 2,
        currentProjectMapInstanceName: "Winter Layout",
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
    expect(panelMarkup).toContain("Import JSON");
    expect(panelMarkup).toContain("Forest Farm");
    expect(panelMarkup).toContain("Winter Layout");
    expect(panelMarkup).toContain("2 maps");
    expect(panelMarkup).toContain("Stored in this browser.");
    expect(panelMarkup).not.toMatch(/\baccount\b/i);
    expect(panelMarkup).toContain('type="file"');
    expect(panelMarkup).not.toMatch(/support|login|member|premium|sync|share|feedback/i);
  });
});
