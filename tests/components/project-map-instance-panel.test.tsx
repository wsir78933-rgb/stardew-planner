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

const plannerMaps: readonly Pick<PlannerMap, "id" | "displayName">[] = [
  { id: "standard", displayName: "Standard Farm" },
  { id: "forest", displayName: "Forest Farm" },
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

  it("renders local project instances, their current indicator, instance actions, and the add-map catalog", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: "map-standard-winter",
        mapInstances: referenceProjectMaps,
        mapChoices: plannerMaps,
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
    expect(panelMarkup).toContain('data-project-add-map-id="standard"');
    expect(panelMarkup).toContain('data-project-add-map-id="forest"');
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
      "project-map-instance-panel__map-grid",
    ]);
  });

  it("renders an empty project with the existing add-map catalog and no current marker", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(ProjectMapInstancePanel, {
        activeMapInstanceId: null,
        mapInstances: [],
        mapChoices: plannerMaps,
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
      "project-map-instance-panel__map-grid",
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
