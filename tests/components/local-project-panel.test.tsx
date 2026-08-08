import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { LocalProjectPanel } from "../../src/components/local-project-panel";
import type {
  ReferenceProjectSummary,
} from "../../src/reference-runtime/reference-project-repository";

const localProjectSummaries: readonly ReferenceProjectSummary[] = [
  {
    id: "project-forest",
    title: "Forest Farm",
    created_at: "2026-07-26T00:00:00.000Z",
    updated_at: "2026-07-26T01:00:00.000Z",
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
    expect(panelMarkup).toContain("2026-07-26T01:00:00.000Z");
    expect(panelMarkup).not.toMatch(/\baccount\b/i);
    expect(panelMarkup).toContain('type="file"');
    expect(panelMarkup).toContain('accept="application/json,.json"');
    expect(panelMarkup).not.toMatch(/support|login|member|premium|sync|share|feedback/i);
    expectTextInOrder(panelMarkup, [
      "Save to this device",
      "New project",
      "Open",
      "Rename",
      "Duplicate",
      "Export JSON",
      "Delete",
    ]);
    expectRequiredClassNames(panelMarkup, [
      "local-project-panel",
      "local-project-panel__status",
      "local-project-panel__primary-actions",
      "local-project-panel__import",
      "local-project-panel__list",
      "local-project-panel__project",
      "local-project-panel__project-summary",
      "local-project-panel__project-actions",
    ]);
  });

  it("keeps the disabled import input and disabled label class while storage opens", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        currentProjectId: null,
        currentProjectName: null,
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

  it("does not claim that saving creates a project when no projects exist", () => {
    const panelMarkup = renderToStaticMarkup(
      createElement(LocalProjectPanel, {
        currentProjectId: null,
        currentProjectName: null,
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

    expect(panelMarkup).toContain("Create a project to save this map here.");
    expect(panelMarkup).not.toContain("Saving creates an Untitled Project.");
  });

  it("keeps the delete dialog source and confirmation button order", () => {
    const panelSource = readFileSync(
      resolve(process.cwd(), "src/components/local-project-panel.tsx"),
      "utf8",
    );

    expect(panelSource).toContain('className="local-project-panel__delete-dialog"');
    expectTextInOrder(panelSource, [
      '<h3 id="delete-local-project-heading">Delete local project?</h3>',
      "Delete project",
      "Keep project",
    ]);
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

function expectRequiredClassNames(
  markup: string,
  requiredClassNames: readonly string[],
): void {
  for (const requiredClassName of requiredClassNames) {
    expect(markup).toContain(requiredClassName);
  }
}
