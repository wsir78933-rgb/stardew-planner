"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";
import type { CatalogItem } from "../catalog";
import type { ImportedGameSaveState } from "../game-save/game-save-import";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import type { ScreenshotResolution } from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type { LocalProjectStorageStatus } from "./local-project-panel";

export type PlannerSaveModalBranch = "farm-summary" | "game-save" | "projects";

type PlannerSaveModalBranchLoadError = Readonly<{
  branch: PlannerSaveModalBranch;
  message: string;
}>;

type PlannerSaveModalLoaderProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  currentProjectId: string | null;
  currentProjectMapInstanceCount: number | null;
  currentProjectMapInstanceName: string | null;
  currentProjectName: string | null;
  mapDisplayName: string;
  mapFile: string;
  onCaptureScreenshot: (resolution: ScreenshotResolution) => Promise<Blob>;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportGameSave: (importedGameSaveState: ImportedGameSaveState) => void;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
  onSaveCurrentMap: () => void;
  onSaveThumbnail: () => Promise<void>;
  placementSnapshot: PlacementSnapshot;
  projects: readonly ReferenceProjectSummary[];
  season: TilesheetSeason;
  selectedPlannerMapId: string;
  storageErrorMessage: string | null;
  storageStatus: LocalProjectStorageStatus;
}>;

type PlannerSaveModalContentProperties = Omit<
  PlannerSaveModalLoaderProperties,
  | "catalogItems"
  | "mapDisplayName"
  | "onImportGameSave"
  | "placementSnapshot"
  | "selectedPlannerMapId"
>;

type PlannerGameSaveModalContentProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  onOpenImportedGameSave: (importedGameSaveState: ImportedGameSaveState) => void;
}>;

type PlannerFarmSummaryModalContentProperties = Pick<
  PlannerSaveModalLoaderProperties,
  | "catalogItems"
  | "mapDisplayName"
  | "placementSnapshot"
  | "selectedPlannerMapId"
  | "season"
>;

export function PlannerSaveModalLoader(
  plannerSaveModalLoaderProperties: PlannerSaveModalLoaderProperties,
) {
  const [selectedPlannerSaveModalBranch, setSelectedPlannerSaveModalBranch] =
    useState<PlannerSaveModalBranch>(createInitialPlannerSaveModalBranch);
  const [PlannerSaveModalContent, setPlannerSaveModalContent] = useState<
    ComponentType<PlannerSaveModalContentProperties> | null
  >(null);
  const [PlannerGameSaveModalContent, setPlannerGameSaveModalContent] = useState<
    ComponentType<PlannerGameSaveModalContentProperties> | null
  >(null);
  const [PlannerFarmSummaryModalContent, setPlannerFarmSummaryModalContent] = useState<
    ComponentType<PlannerFarmSummaryModalContentProperties> | null
  >(null);
  const [gameSaveImportCatalogItems, setGameSaveImportCatalogItems] = useState<
    readonly CatalogItem[] | null
  >(null);
  const [plannerSaveModalBranchLoadError, setPlannerSaveModalBranchLoadError] =
    useState<PlannerSaveModalBranchLoadError | null>(null);
  const [plannerSaveModalBranchLoadGeneration, setPlannerSaveModalBranchLoadGeneration] =
    useState(0);

  useEffect(() => {
    let hasDisposed = false;
    setPlannerSaveModalBranchLoadError(null);

    async function loadSelectedPlannerSaveModalBranch(): Promise<void> {
      try {
        if (selectedPlannerSaveModalBranch === "projects") {
          const { PlannerSaveModalContent: loadedPlannerSaveModalContent } =
            await import("./planner-save-modal-content");
          if (hasDisposed) return;
          setPlannerSaveModalContent(() => loadedPlannerSaveModalContent);
          return;
        }

        if (selectedPlannerSaveModalBranch === "game-save") {
          if (
            PlannerGameSaveModalContent !== null
            && gameSaveImportCatalogItems !== null
          ) {
            return;
          }
          const {
            loadCompleteGameSaveImportCatalog,
            PlannerGameSaveModalContent: loadedPlannerGameSaveModalContent,
          } = await import("./planner-game-save-modal-content");
          const loadedGameSaveImportCatalogItems =
            await loadCompleteGameSaveImportCatalog();
          if (hasDisposed) return;
          setPlannerGameSaveModalContent(() => loadedPlannerGameSaveModalContent);
          setGameSaveImportCatalogItems(loadedGameSaveImportCatalogItems);
          return;
        }

        const { PlannerFarmSummaryModalContent: loadedPlannerFarmSummaryModalContent } =
          await import("./planner-farm-summary-modal-content");
        if (hasDisposed) return;
        setPlannerFarmSummaryModalContent(() => loadedPlannerFarmSummaryModalContent);
      } catch (caughtError) {
        if (hasDisposed) return;
        setPlannerSaveModalBranchLoadError({
          branch: selectedPlannerSaveModalBranch,
          message: createPlannerSaveModalBranchLoadErrorMessage(
            selectedPlannerSaveModalBranch,
            caughtError,
          ),
        });
      }
    }

    void loadSelectedPlannerSaveModalBranch();

    return () => {
      hasDisposed = true;
    };
  }, [plannerSaveModalBranchLoadGeneration, selectedPlannerSaveModalBranch]);

  const currentBranchLoadError =
    plannerSaveModalBranchLoadError?.branch === selectedPlannerSaveModalBranch
      ? plannerSaveModalBranchLoadError
      : null;
  const isSelectedPlannerSaveModalBranchLoading =
    currentBranchLoadError === null
    && !isPlannerSaveModalBranchLoaded(
      selectedPlannerSaveModalBranch,
      PlannerSaveModalContent,
      PlannerGameSaveModalContent,
      PlannerFarmSummaryModalContent,
      gameSaveImportCatalogItems,
    );

  return (
    <>
      <nav aria-label="Save tools" className="planner-save-modal-loader__branches">
        <button
          aria-pressed={selectedPlannerSaveModalBranch === "projects"}
          onClick={() =>
            setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
              selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "projects"),
            )
          }
          type="button"
        >
          Local projects
        </button>
        <button
          aria-pressed={selectedPlannerSaveModalBranch === "game-save"}
          onClick={() =>
            setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
              selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "game-save"),
            )
          }
          type="button"
        >
          Import Game Save
        </button>
        <button
          aria-pressed={selectedPlannerSaveModalBranch === "farm-summary"}
          onClick={() =>
            setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
              selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "farm-summary"),
            )
          }
          type="button"
        >
          Farm Summary
        </button>
      </nav>
      {currentBranchLoadError !== null ? (
        <div className="local-project-panel__error" role="alert">
          <p>{currentBranchLoadError.message}</p>
          <button
            onClick={() => {
              setPlannerSaveModalBranchLoadError(null);
              setPlannerSaveModalBranchLoadGeneration(
                (currentPlannerSaveModalBranchLoadGeneration) =>
                  createNextPlannerSaveModalBranchLoadGeneration(
                    currentPlannerSaveModalBranchLoadGeneration,
                  ),
              );
            }}
            type="button"
          >
            {createPlannerSaveModalBranchRetryLabel(
              selectedPlannerSaveModalBranch,
            )}
          </button>
        </div>
      ) : null}
      {isSelectedPlannerSaveModalBranchLoading ? (
        <p className="local-project-panel__message" role="status">
          {createPlannerSaveModalBranchLoadingMessage(selectedPlannerSaveModalBranch)}
        </p>
      ) : null}
      {selectedPlannerSaveModalBranch === "projects" && PlannerSaveModalContent !== null ? (
        <PlannerSaveModalContent
          currentProjectId={plannerSaveModalLoaderProperties.currentProjectId}
          currentProjectMapInstanceCount={
            plannerSaveModalLoaderProperties.currentProjectMapInstanceCount
          }
          currentProjectMapInstanceName={
            plannerSaveModalLoaderProperties.currentProjectMapInstanceName
          }
          currentProjectName={plannerSaveModalLoaderProperties.currentProjectName}
          mapFile={plannerSaveModalLoaderProperties.mapFile}
          onCaptureScreenshot={plannerSaveModalLoaderProperties.onCaptureScreenshot}
          onCreateProject={plannerSaveModalLoaderProperties.onCreateProject}
          onDeleteProject={plannerSaveModalLoaderProperties.onDeleteProject}
          onDuplicateProject={plannerSaveModalLoaderProperties.onDuplicateProject}
          onExportProject={plannerSaveModalLoaderProperties.onExportProject}
          onImportProject={plannerSaveModalLoaderProperties.onImportProject}
          onOpenProject={plannerSaveModalLoaderProperties.onOpenProject}
          onRenameProject={plannerSaveModalLoaderProperties.onRenameProject}
          onSaveCurrentMap={plannerSaveModalLoaderProperties.onSaveCurrentMap}
          onSaveThumbnail={plannerSaveModalLoaderProperties.onSaveThumbnail}
          projects={plannerSaveModalLoaderProperties.projects}
          season={plannerSaveModalLoaderProperties.season}
          storageErrorMessage={plannerSaveModalLoaderProperties.storageErrorMessage}
          storageStatus={plannerSaveModalLoaderProperties.storageStatus}
        />
      ) : null}
      {selectedPlannerSaveModalBranch === "game-save"
      && PlannerGameSaveModalContent !== null
      && gameSaveImportCatalogItems !== null ? (
        <PlannerGameSaveModalContent
          catalogItems={gameSaveImportCatalogItems}
          onOpenImportedGameSave={plannerSaveModalLoaderProperties.onImportGameSave}
        />
      ) : null}
      {selectedPlannerSaveModalBranch === "farm-summary"
      && PlannerFarmSummaryModalContent !== null ? (
        <PlannerFarmSummaryModalContent
          catalogItems={plannerSaveModalLoaderProperties.catalogItems}
          mapDisplayName={plannerSaveModalLoaderProperties.mapDisplayName}
          placementSnapshot={plannerSaveModalLoaderProperties.placementSnapshot}
          selectedPlannerMapId={plannerSaveModalLoaderProperties.selectedPlannerMapId}
          season={plannerSaveModalLoaderProperties.season}
        />
      ) : null}
    </>
  );
}

export function createInitialPlannerSaveModalBranch(): PlannerSaveModalBranch {
  return "projects";
}

export function selectPlannerSaveModalBranch(
  currentPlannerSaveModalBranch: PlannerSaveModalBranch,
  requestedPlannerSaveModalBranch: PlannerSaveModalBranch,
): PlannerSaveModalBranch {
  if (currentPlannerSaveModalBranch === requestedPlannerSaveModalBranch) {
    return currentPlannerSaveModalBranch;
  }

  return requestedPlannerSaveModalBranch;
}

export function createPlannerSaveModalBranchLoadingMessage(
  plannerSaveModalBranch: PlannerSaveModalBranch,
): string {
  return `Loading ${getPlannerSaveModalBranchLabel(plannerSaveModalBranch)}…`;
}

export function createPlannerSaveModalBranchLoadErrorMessage(
  plannerSaveModalBranch: PlannerSaveModalBranch,
  caughtError: unknown,
): string {
  const errorMessage = caughtError instanceof Error
    ? caughtError.message
    : String(caughtError);
  return `Cannot load save tool branch ${JSON.stringify(plannerSaveModalBranch)}: ${errorMessage}`;
}

export function createPlannerSaveModalBranchRetryLabel(
  plannerSaveModalBranch: PlannerSaveModalBranch,
): string {
  return `Retry ${getPlannerSaveModalBranchLabel(plannerSaveModalBranch)}`;
}

export function createNextPlannerSaveModalBranchLoadGeneration(
  currentPlannerSaveModalBranchLoadGeneration: number,
): number {
  if (
    !Number.isSafeInteger(currentPlannerSaveModalBranchLoadGeneration)
    || currentPlannerSaveModalBranchLoadGeneration < 0
    || currentPlannerSaveModalBranchLoadGeneration === Number.MAX_SAFE_INTEGER
  ) {
    throw new TypeError(
      "Planner save-modal branch load generation must be a non-negative safe integer smaller than "
        + `${String(Number.MAX_SAFE_INTEGER)}; received `
        + `${JSON.stringify(currentPlannerSaveModalBranchLoadGeneration)}.`,
    );
  }

  return currentPlannerSaveModalBranchLoadGeneration + 1;
}

export function isPlannerSaveModalBranchLoaded(
  plannerSaveModalBranch: PlannerSaveModalBranch,
  plannerSaveModalContent: ComponentType<PlannerSaveModalContentProperties> | null,
  plannerGameSaveModalContent: ComponentType<PlannerGameSaveModalContentProperties> | null,
  plannerFarmSummaryModalContent: ComponentType<PlannerFarmSummaryModalContentProperties> | null,
  gameSaveImportCatalogItems: readonly CatalogItem[] | null,
): boolean {
  if (plannerSaveModalBranch === "projects") {
    return plannerSaveModalContent !== null;
  }
  if (plannerSaveModalBranch === "game-save") {
    return (
      plannerGameSaveModalContent !== null
      && gameSaveImportCatalogItems !== null
    );
  }
  return plannerFarmSummaryModalContent !== null;
}

function getPlannerSaveModalBranchLabel(
  plannerSaveModalBranch: PlannerSaveModalBranch,
): string {
  if (plannerSaveModalBranch === "projects") return "Local projects";
  if (plannerSaveModalBranch === "game-save") return "Import Game Save";
  return "Farm Summary";
}
