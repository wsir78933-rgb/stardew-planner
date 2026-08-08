import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  deriveAvailableDestinationProjectId,
  ProjectMapInstancePanel,
} from "../../src/components/project-map-instance-panel";
import type { PlannerMap } from "../../src/maps/map-catalog";
import type { ReferenceProjectMap } from "../../src/reference-runtime/local-project-api";
import type {
  ReferenceProjectSummary,
} from "../../src/reference-runtime/reference-project-repository";

function ignoreProjectMapInstanceAction(): void {}

const referenceProjectMaps: readonly ReferenceProjectMap[] = [
  {
    id: "map-standard-spring",
    mapFile: "Farm",
    label: "Spring Layout",
    season: "spring",
    state: {},
    decor: { wallpapers: {}, floors: {} },
    renovations: [],
    thumbnail: "",
  },
  {
    id: "map-standard-winter",
    mapFile: "Farm",
    label: "Winter Layout",
    season: "winter",
    state: {},
    decor: { wallpapers: {}, floors: {} },
    renovations: [],
    thumbnail: "",
  },
];

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

const destinationProjects: readonly ReferenceProjectSummary[] = [
  {
    id: "project-other",
    title: "Other local project",
    created_at: "2026-07-26T00:00:00.000Z",
    updated_at: "2026-07-26T01:00:00.000Z",
  },
];

describe("project map instance panel", () => {
  it("keeps the selected transfer destination only while it remains available", () => {
    expect(deriveAvailableDestinationProjectId("", destinationProjects)).toBe(
      "project-other",
    );
    expect(
      deriveAvailableDestinationProjectId("project-other", destinationProjects),
    ).toBe("project-other");
    expect(
      deriveAvailableDestinationProjectId("project-removed", destinationProjects),
    ).toBe("project-other");
    expect(deriveAvailableDestinationProjectId("project-other", [])).toBe("");
  });

  it("renders local project instances, their current indicator, instance actions, and the categorized add-map picker", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: "map-standard-winter",
        mapInstances: referenceProjectMaps,
        mapChoices: availablePlannerMaps,
        projectChoices: destinationProjects,
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
    expect(panelMarkup).toContain('aria-label="Map categories"');
    expect(panelMarkup.match(/role="tab"/g)).toHaveLength(4);
    expect(panelMarkup.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(panelMarkup.match(/data-project-add-map-id=/g)).toHaveLength(2);
    expect(panelMarkup).toContain('data-project-add-map-id="standard"');
    expect(panelMarkup).toContain('data-project-add-map-id="forest"');
    expect(panelMarkup).not.toContain('data-project-add-map-id="farmhouse-2"');
    expect(panelMarkup).not.toMatch(/account|login|member|premium|sync|share|feedback/i);
    expectTextInOrder(panelMarkup, [
      "Open",
      "Rename",
      "Duplicate",
      "Copy to project",
      "Move to project",
      "Delete",
    ]);
    expectRequiredClassNames(panelMarkup, [
      "project-map-instance-panel",
      "project-map-instance-panel__transfer-destination",
      "project-map-instance-panel__list",
      "project-map-instance-panel__instance",
      "project-map-instance-panel__instance-summary",
      "project-map-instance-panel__instance-actions",
      "project-map-instance-panel__add-map",
      "planner-map-picker",
      "editor-modal__map-grid",
    ]);
  });

  it("renders an empty project with the existing add-map catalog and no current marker", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: null,
        mapInstances: [],
        mapChoices: availablePlannerMaps,
        projectChoices: destinationProjects,
        onAddMap: ignoreProjectMapInstanceAction,
        onCopyMapInstance: ignoreProjectMapInstanceAction,
        onDeleteMapInstance: ignoreProjectMapInstanceAction,
        onDuplicateMapInstance: ignoreProjectMapInstanceAction,
        onMoveMapInstance: ignoreProjectMapInstanceAction,
        onOpenMapInstance: ignoreProjectMapInstanceAction,
        onRenameMapInstance: ignoreProjectMapInstanceAction,
      }),
    );

    expect(panelMarkup).toContain('aria-label="Add map"');
    expect(panelMarkup).toContain("Add map");
    expect(panelMarkup).toContain("Standard Farm");
    expect(panelMarkup).not.toContain("Current");
    expect(panelMarkup).not.toContain('data-current-map-instance="true"');
    expectRequiredClassNames(panelMarkup, [
      "project-map-instance-panel",
      "project-map-instance-panel__list",
      "project-map-instance-panel__add-map",
      "planner-map-picker",
    ]);
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

function expectRequiredClassNames(
  markup: string,
  requiredClassNames: readonly string[],
): void {
  for (const requiredClassName of requiredClassNames) {
    expect(markup).toContain(requiredClassName);
  }
}
