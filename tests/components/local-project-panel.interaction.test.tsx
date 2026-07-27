/** @vitest-environment jsdom */

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalProjectPanel } from "../../src/components/local-project-panel";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mountedContainers: HTMLDivElement[] = [];

afterEach(() => {
  for (const mountedContainer of mountedContainers.splice(0)) {
    mountedContainer.remove();
  }
});

describe("local project panel interactions", () => {
  it("opens the original stored project ID after localizing its active map name", async () => {
    const onOpenProject = vi.fn();
    const container = document.createElement("div");
    mountedContainers.push(container);
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <LocalProjectPanel
          currentProjectId={null}
          currentProjectName={null}
          locale="zh-CN"
          onCreateProject={() => undefined}
          onDeleteProject={() => undefined}
          onDuplicateProject={() => undefined}
          onExportProject={() => "{}"}
          onImportProject={() => undefined}
          onOpenProject={onOpenProject}
          onRenameProject={() => undefined}
          onSaveCurrentMap={() => undefined}
          projects={[{
            activeMapId: "forest",
            createdAt: "2026-07-27T00:00:00.000Z",
            id: "project-forest",
            name: "Forest plan",
            updatedAt: "2026-07-27T00:00:00.000Z",
          }]}
          storageErrorMessage={null}
          storageStatus="ready"
        />,
      );
    });

    const openButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "打开",
    );

    if (openButton === undefined) {
      throw new Error("Expected the localized Open button.");
    }

    await act(async () => {
      openButton.click();
    });

    expect(onOpenProject).toHaveBeenCalledWith("project-forest");
    await act(async () => {
      root.unmount();
    });
  });
});
