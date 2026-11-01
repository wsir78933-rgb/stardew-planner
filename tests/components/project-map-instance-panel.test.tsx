import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectMapInstancePanel } from "../../src/components/project-map-instance-panel";
import type { PlannerMap } from "../../src/maps/map-catalog";

const availablePlannerMaps: readonly PlannerMap[] = [
  {
    id: "standard",
    displayName: "Standard Farm",
    category: "farm",
    mapFile: "Farm.tmx",
    previewOutputPath: "maps/previews/Farm.png",
  },
  {
    id: "forest",
    displayName: "Forest Farm",
    category: "farm",
    mapFile: "Farm_Foraging.tmx",
    previewOutputPath: "maps/previews/Farm_Foraging.png",
  },
  {
    id: "farmhouse-2",
    displayName: "Farmhouse (Upgrade 2)",
    category: "interior",
    mapFile: "FarmHouse2.tmx",
    previewOutputPath: "maps/previews/FarmHouse2.png",
  },
];

describe("project map instance panel", () => {
  it("renders only the categorized map picker for the English locale", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        mapChoices: availablePlannerMaps,
        onAddMap: () => undefined,
      }),
    );

    expect(panelMarkup).toContain('aria-label="Add map"');
    expect(panelMarkup).not.toContain("<h3");
    expect(panelMarkup).toContain('aria-label="Map categories"');
    expect(panelMarkup.match(/role="tab"/g)).toHaveLength(4);
    expect(panelMarkup.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(panelMarkup.match(/data-project-add-map-id=/g)).toHaveLength(2);
    expect(panelMarkup).toContain('data-project-add-map-id="standard"');
    expect(panelMarkup).toContain('data-project-add-map-id="forest"');
    expect(panelMarkup).not.toContain('data-project-add-map-id="farmhouse-2"');
    expect(panelMarkup).toContain('class="project-map-instance-panel"');
    expect(panelMarkup).toContain('class="planner-map-picker"');
    expect(panelMarkup).toContain('class="editor-modal__map-grid"');
    expect(panelMarkup).not.toContain("Project maps");
    expect(panelMarkup).not.toContain("Transfer destination");
    expect(panelMarkup).not.toContain("Open");
    expect(panelMarkup).not.toContain("Rename");
    expect(panelMarkup).not.toContain("Duplicate");
    expect(panelMarkup).not.toContain("Copy to project");
    expect(panelMarkup).not.toContain("Move to project");
    expect(panelMarkup).not.toContain("Delete");
    expect(panelMarkup).not.toContain("Current");
    expect(panelMarkup).not.toContain("Other local project");
    expect(panelMarkup).not.toContain("project-map-instance-panel__list");
    expect(panelMarkup).not.toContain("data-current-map-instance");
  });

  it("renders Japanese map picker labels and map names", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        locale: "ja",
        mapChoices: availablePlannerMaps,
        onAddMap: () => undefined,
      }),
    );

    expect(panelMarkup).toContain('aria-label="マップを追加"');
    expect(panelMarkup).toContain('aria-label="マップの分類"');
    expect(panelMarkup).toContain("スタンダード");
    expect(panelMarkup).not.toContain("Standard Farm");
  });

  it("renders the Russian add-map label", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        locale: "ru",
        mapChoices: availablePlannerMaps,
        onAddMap: () => undefined,
      }),
    );

    expect(panelMarkup).toContain('aria-label="Добавить карту"');
  });
});
