"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { CatalogItem } from "../catalog";
import type { ImportedGameSaveState } from "../game-save/game-save-import";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import type { ScreenshotResolution } from "../projects/map-image-export";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import type {
  GameSaveCopy,
  SaveModalCopy,
  SaveToolsCopy,
} from "../i18n/save-modal-copy";
import type { LocalProjectStorageStatus } from "./local-project-panel";
import styles from "./planner-library-layout.module.css";

export type PlannerSaveModalBranch = "farm-summary" | "game-save" | "projects";

type PlannerSaveModalBranchLoadError = Readonly<{
  branch: PlannerSaveModalBranch;
  message: string;
}>;

type PlannerSaveModalLoaderProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  copy: SaveModalCopy;
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
  onSaveCurrentMap: () => Promise<void>;
  onSaveThumbnail: () => Promise<void>;
  placementSnapshot: PlacementSnapshot;
  workspaceController: ReferenceProjectWorkspaceController;
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
  | "copy"
> & Readonly<{
  copy: Pick<
    SaveModalCopy,
    | "cloudProjects"
    | "deleteProject"
    | "imageExport"
    | "localProjects"
    | "saveTools"
    | "thumbnail"
  >;
  isProjectsBranchActive: boolean;
  mainBranchContent: ReactNode;
  sidebarNavigation: ReactNode;
}>;

type PlannerGameSaveModalContentProperties = Readonly<{
  catalogItems: readonly CatalogItem[];
  copy: GameSaveCopy;
  onOpenImportedGameSave: (importedGameSaveState: ImportedGameSaveState) => void;
}>;

type PlannerFarmSummaryModalContentProperties = Pick<
  PlannerSaveModalLoaderProperties,
  | "catalogItems"
  | "mapDisplayName"
  | "placementSnapshot"
  | "selectedPlannerMapId"
  | "season"
> & Readonly<{
  copy: Pick<SaveModalCopy, "farmSummaryDetail" | "farmSummaryPreview">;
}>;

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
        if (PlannerSaveModalContent === null) {
          const { PlannerSaveModalContent: loadedPlannerSaveModalContent } =
            await import("./planner-save-modal-content");
          if (hasDisposed) return;
          setPlannerSaveModalContent(() => loadedPlannerSaveModalContent);
        }

        if (selectedPlannerSaveModalBranch === "projects") return;

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

        if (PlannerFarmSummaryModalContent !== null) return;
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
            plannerSaveModalLoaderProperties.copy.saveTools,
          ),
        });
      }
    }

    void loadSelectedPlannerSaveModalBranch();

    return () => {
      hasDisposed = true;
    };
  }, [
    plannerSaveModalBranchLoadGeneration,
    plannerSaveModalLoaderProperties.copy.saveTools,
    selectedPlannerSaveModalBranch,
  ]);

  function retrySelectedPlannerSaveModalBranch(): void {
    setPlannerSaveModalBranchLoadError(null);
    setPlannerSaveModalBranchLoadGeneration(
      (currentPlannerSaveModalBranchLoadGeneration) =>
        createNextPlannerSaveModalBranchLoadGeneration(
          currentPlannerSaveModalBranchLoadGeneration,
        ),
    );
  }

  const currentBranchLoadError =
    plannerSaveModalBranchLoadError?.branch === selectedPlannerSaveModalBranch
      ? plannerSaveModalBranchLoadError
      : null;
  const isSelectedPlannerSaveModalBranchLoading =
    currentBranchLoadError === null
    && (
      PlannerSaveModalContent === null
      || !isPlannerSaveModalBranchLoaded(
        selectedPlannerSaveModalBranch,
        PlannerSaveModalContent,
        PlannerGameSaveModalContent,
        PlannerFarmSummaryModalContent,
        gameSaveImportCatalogItems,
      )
    );

  const sidebarNavigation = (
    <nav
      aria-label={plannerSaveModalLoaderProperties.copy.saveTools.label}
      className={`planner-save-modal-loader__branches ${styles.sidebarNavigation}`}
    >
      <button
        aria-pressed={selectedPlannerSaveModalBranch === "game-save"}
        onClick={() =>
          setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
            selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "game-save"),
          )
        }
        type="button"
      >
        {plannerSaveModalLoaderProperties.copy.saveTools.gameSave}
      </button>
      <button
        aria-pressed={selectedPlannerSaveModalBranch === "projects"}
        onClick={() =>
          setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
            selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "projects"),
          )
        }
        type="button"
      >
        {plannerSaveModalLoaderProperties.copy.saveTools.localProjects}
      </button>
      <details className={styles.sidebarToolsGroup}>
        <summary>{plannerSaveModalLoaderProperties.copy.saveTools.label}</summary>
        <button
          aria-pressed={selectedPlannerSaveModalBranch === "farm-summary"}
          onClick={() =>
            setSelectedPlannerSaveModalBranch((currentPlannerSaveModalBranch) =>
              selectPlannerSaveModalBranch(currentPlannerSaveModalBranch, "farm-summary"),
            )
          }
          type="button"
        >
          {plannerSaveModalLoaderProperties.copy.saveTools.farmSummary}
        </button>
      </details>
    </nav>
  );

  const mainBranchContent = (
    <div
      className={styles.lazyBranchRegion}
      hidden={selectedPlannerSaveModalBranch === "projects"}
    >
      <div
        className={styles.branchFeedback}
        hidden={currentBranchLoadError === null && !isSelectedPlannerSaveModalBranchLoading}
      >
        {currentBranchLoadError !== null ? (
          <div className="local-project-panel__error" role="alert">
            <p>{currentBranchLoadError.message}</p>
            <button
              onClick={retrySelectedPlannerSaveModalBranch}
              type="button"
            >
              {createPlannerSaveModalBranchRetryLabel(
                selectedPlannerSaveModalBranch,
                plannerSaveModalLoaderProperties.copy.saveTools,
              )}
            </button>
          </div>
        ) : null}
        {isSelectedPlannerSaveModalBranchLoading ? (
          <p className="local-project-panel__message" role="status">
            {createPlannerSaveModalBranchLoadingMessage(
              selectedPlannerSaveModalBranch,
              plannerSaveModalLoaderProperties.copy.saveTools,
            )}
          </p>
        ) : null}
      </div>
      <div
        className={styles.branchContent}
        hidden={selectedPlannerSaveModalBranch !== "game-save"}
      >
        {PlannerGameSaveModalContent !== null && gameSaveImportCatalogItems !== null ? (
          <PlannerGameSaveModalContent
            catalogItems={gameSaveImportCatalogItems}
            copy={plannerSaveModalLoaderProperties.copy.gameSave}
            onOpenImportedGameSave={plannerSaveModalLoaderProperties.onImportGameSave}
          />
        ) : null}
      </div>
      <div
        className={styles.branchContent}
        hidden={selectedPlannerSaveModalBranch !== "farm-summary"}
      >
        {PlannerFarmSummaryModalContent !== null ? (
          <PlannerFarmSummaryModalContent
            catalogItems={plannerSaveModalLoaderProperties.catalogItems}
            copy={{
              farmSummaryDetail: plannerSaveModalLoaderProperties.copy.farmSummaryDetail,
              farmSummaryPreview: plannerSaveModalLoaderProperties.copy.farmSummaryPreview,
            }}
            mapDisplayName={plannerSaveModalLoaderProperties.mapDisplayName}
            placementSnapshot={plannerSaveModalLoaderProperties.placementSnapshot}
            selectedPlannerMapId={plannerSaveModalLoaderProperties.selectedPlannerMapId}
            season={plannerSaveModalLoaderProperties.season}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {PlannerSaveModalContent === null && isSelectedPlannerSaveModalBranchLoading ? (
        <p className="local-project-panel__message" role="status">
          {createPlannerSaveModalBranchLoadingMessage(
            selectedPlannerSaveModalBranch,
            plannerSaveModalLoaderProperties.copy.saveTools,
          )}
        </p>
      ) : null}
      {PlannerSaveModalContent !== null ? (
        <PlannerSaveModalContent
          copy={{
            deleteProject: plannerSaveModalLoaderProperties.copy.deleteProject,
            imageExport: plannerSaveModalLoaderProperties.copy.imageExport,
            localProjects: plannerSaveModalLoaderProperties.copy.localProjects,
            saveTools: plannerSaveModalLoaderProperties.copy.saveTools,
            thumbnail: plannerSaveModalLoaderProperties.copy.thumbnail,
            cloudProjects: plannerSaveModalLoaderProperties.copy.cloudProjects,
          }}
          isProjectsBranchActive={selectedPlannerSaveModalBranch === "projects"}
          mainBranchContent={mainBranchContent}
          sidebarNavigation={sidebarNavigation}
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
          workspaceController={plannerSaveModalLoaderProperties.workspaceController}
        />
      ) : null}
      {PlannerSaveModalContent === null && currentBranchLoadError !== null ? (
        <div className="local-project-panel__error" role="alert">
          <p>{currentBranchLoadError.message}</p>
          <button
            onClick={retrySelectedPlannerSaveModalBranch}
            type="button"
          >
            {createPlannerSaveModalBranchRetryLabel(
              selectedPlannerSaveModalBranch,
              plannerSaveModalLoaderProperties.copy.saveTools,
            )}
          </button>
        </div>
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
  saveToolsCopy: SaveToolsCopy,
): string {
  return saveToolsCopy.loadingBranch(plannerSaveModalBranch);
}

export function createPlannerSaveModalBranchLoadErrorMessage(
  plannerSaveModalBranch: PlannerSaveModalBranch,
  caughtError: unknown,
  saveToolsCopy: SaveToolsCopy,
): string {
  const errorMessage = caughtError instanceof Error
    ? caughtError.message
    : String(caughtError);
  return saveToolsCopy.branchLoadFailure(plannerSaveModalBranch, errorMessage);
}

export function createPlannerSaveModalBranchRetryLabel(
  plannerSaveModalBranch: PlannerSaveModalBranch,
  saveToolsCopy: SaveToolsCopy,
): string {
  return saveToolsCopy.retryBranch(plannerSaveModalBranch);
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
