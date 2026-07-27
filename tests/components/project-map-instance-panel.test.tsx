import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectMapInstancePanel } from "../../src/components/project-map-instance-panel";

function ignoreProjectMapInstanceAction(): void {}

describe("project map instance panel", () => {
  it("localizes project-map controls while emitting source map IDs", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: "map-standard",
        locale: "zh-CN",
        mapInstances: [{ id: "map-standard", baseMapId: "standard", name: "春季布局" }],
        mapChoices: [{ id: "standard", displayName: "Standard Farm" }],
        projectChoices: [],
        onAddMap: ignoreProjectMapInstanceAction,
        onCopyMapInstance: ignoreProjectMapInstanceAction,
        onDeleteMapInstance: ignoreProjectMapInstanceAction,
        onDuplicateMapInstance: ignoreProjectMapInstanceAction,
        onMoveMapInstance: ignoreProjectMapInstanceAction,
        onOpenMapInstance: ignoreProjectMapInstanceAction,
        onRenameMapInstance: ignoreProjectMapInstanceAction,
      }),
    );

    expect(panelMarkup).toContain("项目地图");
    expect(panelMarkup).toContain("标准农场");
    expect(panelMarkup).toContain('data-project-add-map-id="standard"');
  });

  it("renders local project instances, their current indicator, instance actions, and the add-map catalog", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: "map-standard-winter",
        mapInstances: [
          {
            id: "map-standard-spring",
            baseMapId: "standard",
            name: "Spring Layout",
          },
          {
            id: "map-standard-winter",
            baseMapId: "standard",
            name: "Winter Layout",
          },
        ],
        mapChoices: [
          { id: "standard", displayName: "Standard Farm" },
          { id: "forest", displayName: "Forest Farm" },
        ],
        projectChoices: [
          { id: "project-other", name: "Other local project" },
        ],
        onAddMap: ignoreProjectMapInstanceAction,
        onCopyMapInstance: ignoreProjectMapInstanceAction,
        onDeleteMapInstance: ignoreProjectMapInstanceAction,
        onDuplicateMapInstance: ignoreProjectMapInstanceAction,
        onMoveMapInstance: ignoreProjectMapInstanceAction,
        onOpenMapInstance: ignoreProjectMapInstanceAction,
        onRenameMapInstance: ignoreProjectMapInstanceAction,
      }),
    );

    expect(panelMarkup).toContain('aria-label="Project maps"');
    expect(panelMarkup).toContain("Spring Layout");
    expect(panelMarkup).toContain("Winter Layout");
    expect(panelMarkup).toContain("Standard Farm");
    expect(panelMarkup).toContain('data-current-map-instance="true"');
    expect(panelMarkup).toContain("Current");
    expect(panelMarkup).toContain("Open");
    expect(panelMarkup).toContain("Rename");
    expect(panelMarkup).toContain("Duplicate");
    expect(panelMarkup).toContain("Copy to project");
    expect(panelMarkup).toContain("Move to project");
    expect(panelMarkup).toContain("Other local project");
    expect(panelMarkup).toContain("Delete");
    expect(panelMarkup).toContain("Add map");
    expect(panelMarkup).toContain('data-project-add-map-id="standard"');
    expect(panelMarkup).toContain('data-project-add-map-id="forest"');
    expect(panelMarkup).not.toMatch(/account|login|member|premium|sync|share|feedback/i);
  });
});
