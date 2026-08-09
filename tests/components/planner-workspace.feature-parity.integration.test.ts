import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const workspaceSourcePath = join(
  process.cwd(),
  "src/components/planner-workspace.tsx",
);
const plannerWorkspaceStateSourcePath = join(
  process.cwd(),
  "src/planner/planner-workspace-state.ts",
);
const plannerWorkspacePersistenceSourcePath = join(
  process.cwd(),
  "src/planner/planner-workspace-persistence-runtime.ts",
);
const itemCatalogPanelSourcePath = join(
  process.cwd(),
  "src/components/item-catalog-panel.tsx",
);
const editorPlacementControllerSourcePath = join(
  process.cwd(),
  "src/editor/editor-placement-controller.ts",
);

describe("planner workspace Task5A feature-parity composition", () => {
  it("wires decor, transient X-ray, ordinary-action cancellation, and recoverable rejection feedback", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");

    expect(workspaceSource).toContain("<PlannerCanvas");
    expect(workspaceSource).toContain("activeInteriorDecorPattern={activeInteriorDecorPattern}");
    expect(workspaceSource).toContain("onInteriorDecorApply={handleInteriorDecorApply}");
    expect(workspaceSource).toContain("onInteriorDecorRejected={handleInteriorDecorRejected}");
    expect(workspaceSource).toContain("isXRayActive={isXRayActive}");
    expect(workspaceSource).toContain("handleOrdinaryCatalogItemSelect");
    expect(workspaceSource).toContain("handleOrdinaryToolChange");
    expect(workspaceSource).toContain("handlePlannerMapChange");
    expect(workspaceSource).toContain("handleOpenMapInstance");
    expect(workspaceSource).toContain("onOpenMapInstance={handleOpenMapInstance}");
    expect(workspaceSource).toContain("projectMapActions.onOpenMapInstance(mapInstanceId)");
    expect(workspaceSource).toContain("cancelInteriorDecorBeforeOrdinaryWorkspaceAction");
    expect(workspaceSource).toContain("getUnavailableInteriorDecorMessage");
    expect(workspaceSource).toContain(
      "plannerWorkspaceState.behaviorOptions.showToasts",
    );
    expect(workspaceSource).toContain('className="planner-workspace__toast"');
    expect(workspaceSource).toContain("window.setTimeout");
    expect(workspaceSource).toContain('aria-live="polite" role="status"');
  });

  it("keeps Task5A transient interaction fields out of reducer and persistence state", () => {
    const plannerWorkspaceStateSource = readFileSync(
      plannerWorkspaceStateSourcePath,
      "utf8",
    );
    const plannerWorkspacePersistenceSource = readFileSync(
      plannerWorkspacePersistenceSourcePath,
      "utf8",
    );

    for (const transientFieldName of [
      "activeInteriorDecorPattern",
      "interiorDecorRejectionMessage",
      "isXRayActive",
    ]) {
      expect(plannerWorkspaceStateSource).not.toContain(transientFieldName);
      expect(plannerWorkspacePersistenceSource).not.toContain(transientFieldName);
    }
  });

  it("wires controlled catalog choices through workspace, editing, and placement ports", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");
    const itemCatalogPanelSource = readFileSync(itemCatalogPanelSourcePath, "utf8");
    const editorPlacementControllerSource = readFileSync(
      editorPlacementControllerSourcePath,
      "utf8",
    );

    expect(itemCatalogPanelSource).toContain("catalogPresentationChoicesByItemId");
    expect(itemCatalogPanelSource).toContain("onCatalogItemPresentationChoiceChange");
    expect(workspaceSource).toContain(
      "catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}",
    );
    expect(workspaceSource).toContain(
      "onCatalogItemPresentationChoiceChange={handleCatalogItemPresentationChoiceChange}",
    );
    expect(workspaceSource).toContain("catalogPresentationChoice:");
    expect(editorPlacementControllerSource).toContain(
      "validateCatalogItemPresentationChoice",
    );
    expect(editorPlacementControllerSource).toContain(
      "rotationCapability.footprints",
    );
    expect(editorPlacementControllerSource).not.toContain(
      "createPersistentPlacementSnapshot({",
    );
    expect(workspaceSource).not.toContain("createPersistentPlacementSnapshot");
  });

  it("cancels a pending duplicate before applying any toolbar tool change", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");
    const toolChangeStart = workspaceSource.indexOf(
      "const handleOrdinaryToolChange",
    );
    const nextHandlerStart = workspaceSource.indexOf(
      "const handlePlannerMapChange",
      toolChangeStart,
    );
    if (toolChangeStart < 0 || nextHandlerStart < 0) {
      throw new Error("Expected ordinary tool and map change handlers in workspace source.");
    }
    const toolChangeSource = workspaceSource.slice(
      toolChangeStart,
      nextHandlerStart,
    );
    const cancelDuplicateIndex = toolChangeSource.indexOf(
      "workspaceEditingControls.cancelPendingDuplicateSelection()",
    );
    const applyToolIndex = toolChangeSource.indexOf("handleToolChange(tool)");

    expect(cancelDuplicateIndex).toBeGreaterThanOrEqual(0);
    expect(applyToolIndex).toBeGreaterThan(cancelDuplicateIndex);
    expect(workspaceSource).toContain(
      "pendingDuplicateSelectionKey === null\n          ? applyPlannerWorkspaceMapTileClick",
    );
  });

  it("retains the grid reported by the current canvas map for subsequent tile clicks", () => {
    const workspaceSource = readFileSync(workspaceSourcePath, "utf8");

    expect(workspaceSource).not.toContain(
      "mapPlacementGridReference.current = null;",
    );
  });
});
