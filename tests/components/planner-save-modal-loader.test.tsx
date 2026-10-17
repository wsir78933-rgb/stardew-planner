import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createPlannerSaveModalBranchLoadErrorMessage,
  createPlannerSaveModalBranchLoadingMessage,
  createPlannerSaveModalBranchRetryLabel,
  createNextPlannerSaveModalBranchLoadGeneration,
  createInitialPlannerSaveModalBranch,
  isPlannerSaveModalBranchLoaded,
  selectPlannerSaveModalBranch,
  PlannerSaveModalLoader,
} from "../../src/components/planner-save-modal-loader";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

describe("planner save-modal loader", () => {
  it("opens local projects first and switches only to an explicit save-tool branch", () => {
    expect(createInitialPlannerSaveModalBranch()).toBe("projects");
    expect(selectPlannerSaveModalBranch("projects", "game-save")).toBe("game-save");
    expect(selectPlannerSaveModalBranch("game-save", "farm-summary")).toBe(
      "farm-summary",
    );
  });

  it("uses localized branch loading, delivery-error, and retry messages without changing raw errors", () => {
    const chineseSaveToolsCopy = getSaveModalCopy("zh-CN").saveTools;

    expect(createPlannerSaveModalBranchLoadingMessage("game-save", chineseSaveToolsCopy)).toBe(
      "正在加载导入游戏存档…",
    );
    expect(
      createPlannerSaveModalBranchLoadErrorMessage(
        "farm-summary",
        new Error("network unavailable"),
        chineseSaveToolsCopy,
      ),
    ).toBe('无法加载保存工具分支 "farm-summary"：network unavailable');
    expect(createPlannerSaveModalBranchRetryLabel("projects", chineseSaveToolsCopy)).toBe(
      "重试加载本地项目",
    );
    expect(createPlannerSaveModalBranchLoadingMessage("game-save", getSaveModalCopy("en").saveTools)).toBe(
      "Loading Import Game Save…",
    );
    expect(createNextPlannerSaveModalBranchLoadGeneration(0)).toBe(1);
    expect(() =>
      createNextPlannerSaveModalBranchLoadGeneration(Number.MAX_SAFE_INTEGER),
    ).toThrow(`received ${String(Number.MAX_SAFE_INTEGER)}`);
  });

  it("shows a localized loading state before the persistent library shell loads", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerSaveModalLoader, {
        catalogItems: [],
        copy: getSaveModalCopy("zh-CN"),
        currentProjectId: null,
        currentProjectMapInstanceCount: null,
        currentProjectMapInstanceName: null,
        currentProjectName: null,
        mapDisplayName: "Standard Farm",
        mapFile: "Farm.tmx",
        onCaptureScreenshot: async () => new Blob([], { type: "image/png" }),
        onCreateProject: () => undefined,
        onDeleteProject: () => undefined,
        onDuplicateProject: () => undefined,
        onExportProject: () => "{}",
        onImportGameSave: () => undefined,
        onImportProject: () => undefined,
        onOpenProject: () => undefined,
        onRenameProject: () => undefined,
        onSaveCurrentMap: async () => undefined,
        onSaveThumbnail: async () => undefined,
        placementSnapshot: {} as never,
        projects: [],
        season: "spring",
        selectedPlannerMapId: "standard",
        storageErrorMessage: null,
        storageStatus: "ready",
        workspaceController: { getState: () => ({ activeProject: null }) } as never,
      }),
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain("正在加载本地项目…");
  });

  it("orders Import Game Save before My Plans and keeps tools off the sidebar disclosure", () => {
    const loaderSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-save-modal-loader.tsx"),
      "utf8",
    );
    const navigationSource = loaderSource.slice(
      loaderSource.indexOf("const sidebarNavigation"),
      loaderSource.indexOf("const libraryToolsEntry"),
    );
    const gameSaveLabelIndex = navigationSource.indexOf("copy.saveTools.gameSave");
    const myPlansLabelIndex = navigationSource.indexOf("copy.saveTools.myPlans");

    expect(gameSaveLabelIndex).toBeGreaterThan(-1);
    expect(myPlansLabelIndex).toBeGreaterThan(gameSaveLabelIndex);
    expect(navigationSource).toContain("copy.saveTools.planGroupLabel");
    expect(navigationSource).not.toContain("<details");
    expect(navigationSource).not.toContain("copy.saveTools.farmSummary");
    expect(loaderSource).toContain("copy.saveTools.tools");
    expect(loaderSource).toContain('selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "tools")');
    expect(loaderSource).toContain('selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "farm-summary")');
  });

  it("keeps one common shell mounted and hides inactive lazy branches", () => {
    const loaderSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-save-modal-loader.tsx"),
      "utf8",
    );
    const persistentShellRenderIndex = loaderSource.indexOf(
      "{PlannerSaveModalContent !== null ? (",
    );

    expect(persistentShellRenderIndex).toBeGreaterThan(-1);
    expect(loaderSource.slice(persistentShellRenderIndex - 160, persistentShellRenderIndex))
      .not.toContain("selectedPlannerSaveModalBranch ===");
    expect(loaderSource).toContain("sidebarNavigation={sidebarNavigation}");
    expect(loaderSource).toContain("libraryToolsEntry={libraryToolsEntry}");
    expect(loaderSource).toContain("mainBranchContent={mainBranchContent}");
    expect(loaderSource).toContain(
      "hidden={!isPlannerSaveModalLazyBranch(selectedPlannerSaveModalBranch)}",
    );
    expect(loaderSource).toContain("className={styles.branchFeedback}");
    expect(loaderSource).toContain(
      'hidden={selectedPlannerSaveModalBranch !== "game-save"}',
    );
    expect(loaderSource).toContain(
      'hidden={selectedPlannerSaveModalBranch !== "farm-summary"}',
    );
  });

  it("uses branch-local imports without static modal-content imports or top-level dynamic", () => {
    const loaderSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-save-modal-loader.tsx"),
      "utf8",
    );

    expect(loaderSource).toContain('import("./planner-save-modal-content")');
    expect(loaderSource).toContain('import("./planner-game-save-modal-content")');
    expect(loaderSource).toContain('import("./planner-farm-summary-modal-content")');
    expect(loaderSource).not.toMatch(
      /from ["']\.\/planner-(save|game-save|farm-summary)-modal-content["']/,
    );
    expect(loaderSource).not.toContain('from "next/dynamic"');
    expect(loaderSource).toContain("let hasDisposed = false;");
    expect(loaderSource).toContain("if (hasDisposed)");
    expect(loaderSource).toContain("Retry");
    expect(loaderSource).toContain("plannerSaveModalBranchLoadGeneration");
    expect(loaderSource).toContain("loadCompleteGameSaveImportCatalog");
    expect(loaderSource).toContain("setGameSaveImportCatalogItems");

    const workspaceSource = readFileSync(
      resolve(process.cwd(), "src/components/planner-workspace.tsx"),
      "utf8",
    );
    expect(workspaceSource).toContain('from "./planner-save-modal-loader"');
    expect(workspaceSource).not.toMatch(
      /from ["']\.\/planner-(save|game-save|farm-summary)-modal-content["']/,
    );
  });

  it("requires both the game-save component and complete import catalog", () => {
    const EmptyContent = () => null;

    expect(isPlannerSaveModalBranchLoaded(
      "game-save",
      null,
      EmptyContent,
      null,
      null,
    )).toBe(false);
    expect(isPlannerSaveModalBranchLoaded(
      "game-save",
      null,
      null,
      null,
      [],
    )).toBe(false);
    expect(isPlannerSaveModalBranchLoaded(
      "game-save",
      null,
      EmptyContent,
      null,
      [],
    )).toBe(true);
  });
});
