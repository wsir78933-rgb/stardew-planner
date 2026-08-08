import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createPlannerSaveModalBranchLoadErrorMessage,
  createPlannerSaveModalBranchLoadingMessage,
  createPlannerSaveModalBranchRetryLabel,
  createNextPlannerSaveModalBranchLoadGeneration,
  createInitialPlannerSaveModalBranch,
  isPlannerSaveModalBranchLoaded,
  selectPlannerSaveModalBranch,
} from "../../src/components/planner-save-modal-loader";

describe("planner save-modal loader", () => {
  it("opens local projects first and switches only to an explicit save-tool branch", () => {
    expect(createInitialPlannerSaveModalBranch()).toBe("projects");
    expect(selectPlannerSaveModalBranch("projects", "game-save")).toBe("game-save");
    expect(selectPlannerSaveModalBranch("game-save", "farm-summary")).toBe(
      "farm-summary",
    );
  });

  it("uses branch-specific visible loading and delivery-error messages", () => {
    expect(createPlannerSaveModalBranchLoadingMessage("game-save")).toBe(
      "Loading Import Game Save…",
    );
    expect(
      createPlannerSaveModalBranchLoadErrorMessage(
        "farm-summary",
        new Error("network unavailable"),
      ),
    ).toContain('Cannot load save tool branch "farm-summary"');
    expect(createPlannerSaveModalBranchRetryLabel("projects")).toBe(
      "Retry Local projects",
    );
    expect(createNextPlannerSaveModalBranchLoadGeneration(0)).toBe(1);
    expect(() =>
      createNextPlannerSaveModalBranchLoadGeneration(Number.MAX_SAFE_INTEGER),
    ).toThrow(`received ${String(Number.MAX_SAFE_INTEGER)}`);
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
