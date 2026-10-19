"use client";

import { useState } from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import type { PlannerMap } from "../maps/map-catalog";
import type { ReferenceProjectMap } from "../reference-runtime/local-project-api";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import { PlannerMapPicker } from "./planner-map-picker";

type ProjectMapInstancePanelProperties = Readonly<{
  locale?: PlannerChromeLocale;
  activeMapInstanceId: string | null;
  mapInstances: readonly ReferenceProjectMap[];
  mapChoices: readonly PlannerMap[];
  projectChoices: readonly ReferenceProjectSummary[];
  onAddMap: (plannerMapId: string) => void;
  onCopyMapInstance: (
    mapInstanceId: string,
    destinationProjectId: string,
  ) => void;
  onDeleteMapInstance: (mapInstanceId: string) => void;
  onDuplicateMapInstance: (mapInstanceId: string) => void;
  onMoveMapInstance: (
    mapInstanceId: string,
    destinationProjectId: string,
  ) => void;
  onOpenMapInstance: (mapInstanceId: string) => void;
  onRenameMapInstance: (mapInstanceId: string, requestedName: string) => void;
}>;

export function ProjectMapInstancePanel({
  locale = "en",
  activeMapInstanceId,
  mapInstances,
  mapChoices,
  projectChoices,
  onAddMap,
  onCopyMapInstance,
  onDeleteMapInstance,
  onDuplicateMapInstance,
  onMoveMapInstance,
  onOpenMapInstance,
  onRenameMapInstance,
}: ProjectMapInstancePanelProperties) {
  const [renamingMapInstanceId, setRenamingMapInstanceId] = useState<string | null>(
    null,
  );
  const [requestedMapInstanceName, setRequestedMapInstanceName] = useState("");
  const [destinationProjectId, setDestinationProjectId] = useState<string>(
    projectChoices[0]?.id ?? "",
  );
  const availableDestinationProjectId = deriveAvailableDestinationProjectId(
    destinationProjectId,
    projectChoices,
  );
  const panelCopy = readProjectMapInstanceCopy(locale);

  function startRenamingMapInstance(mapInstance: ReferenceProjectMap): void {
    setRenamingMapInstanceId(mapInstance.id);
    setRequestedMapInstanceName(mapInstance.label);
  }

  function submitMapInstanceRename(mapInstanceId: string): void {
    onRenameMapInstance(mapInstanceId, requestedMapInstanceName);
    setRenamingMapInstanceId(null);
  }

  function getRequiredDestinationProjectId(): string {
    if (availableDestinationProjectId.length === 0) {
      throw new Error(
        "Cannot transfer a local map instance because no destination project is selected.",
      );
    }

    return availableDestinationProjectId;
  }

  return (
    <section aria-label={panelCopy.projectMaps} className="project-map-instance-panel">
      <h3>{panelCopy.projectMaps}</h3>
      <div className="project-map-instance-panel__transfer-destination">
        <label>
          <span>{panelCopy.transferDestination}</span>
          <select
            disabled={projectChoices.length === 0}
            onChange={(changeEvent) =>
              setDestinationProjectId(changeEvent.target.value)
            }
            value={availableDestinationProjectId}
          >
            {projectChoices.length === 0 ? (
              <option value="">{panelCopy.createProjectFirst}</option>
            ) : (
              projectChoices.map((projectChoice) => (
                <option key={projectChoice.id} value={projectChoice.id}>
                  {projectChoice.title}
                </option>
              ))
            )}
          </select>
        </label>
      </div>
      <ul className="project-map-instance-panel__list">
        {mapInstances.map((mapInstance) => {
          const isActiveMapInstance = mapInstance.id === activeMapInstanceId;
          const isRenamingMapInstance = mapInstance.id === renamingMapInstanceId;

          return (
            <li
              className="project-map-instance-panel__instance"
              data-current-map-instance={isActiveMapInstance}
              key={mapInstance.id}
            >
              <div className="project-map-instance-panel__instance-summary">
                <strong>{mapInstance.label}</strong>
                <span>{mapInstance.mapFile}</span>
                {isActiveMapInstance ? <span>{panelCopy.current}</span> : null}
              </div>
              {isRenamingMapInstance ? (
                <div className="project-map-instance-panel__rename-form">
                  <label>
                    <span className="sr-only">{panelCopy.newMapName}</span>
                    <input
                      onChange={(changeEvent) =>
                        setRequestedMapInstanceName(changeEvent.target.value)
                      }
                      value={requestedMapInstanceName}
                    />
                  </label>
                  <button
                    onClick={() => submitMapInstanceRename(mapInstance.id)}
                    type="button"
                  >
                    {panelCopy.saveName}
                  </button>
                  <button
                    onClick={() => setRenamingMapInstanceId(null)}
                    type="button"
                  >
                    {panelCopy.cancelRename}
                  </button>
                </div>
              ) : (
                <div className="project-map-instance-panel__instance-actions">
                  <button
                    onClick={() => onOpenMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {panelCopy.open}
                  </button>
                  <button
                    onClick={() => startRenamingMapInstance(mapInstance)}
                    type="button"
                  >
                    {panelCopy.rename}
                  </button>
                  <button
                    onClick={() => onDuplicateMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {panelCopy.duplicate}
                  </button>
                  <button
                    disabled={projectChoices.length === 0}
                    onClick={() =>
                      onCopyMapInstance(
                        mapInstance.id,
                        getRequiredDestinationProjectId(),
                      )
                    }
                    type="button"
                  >
                    {panelCopy.copyToProject}
                  </button>
                  <button
                    disabled={projectChoices.length === 0}
                    onClick={() =>
                      onMoveMapInstance(
                        mapInstance.id,
                        getRequiredDestinationProjectId(),
                      )
                    }
                    type="button"
                  >
                    {panelCopy.moveToProject}
                  </button>
                  <button
                    onClick={() => onDeleteMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {panelCopy.deleteMap}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <section aria-label={panelCopy.addMap} className="project-map-instance-panel__add-map">
        <h3>{panelCopy.addMap}</h3>
        <PlannerMapPicker
          locale={locale}
          mapIdDataAttribute="data-project-add-map-id"
          maps={mapChoices}
          onMapSelect={onAddMap}
          selectedMapId={null}
        />
      </section>
    </section>
  );
}

export function deriveAvailableDestinationProjectId(
  requestedDestinationProjectId: string,
  projectChoices: readonly ReferenceProjectSummary[],
): string {
  const selectedProjectIsAvailable = projectChoices.some(
    (projectChoice) => projectChoice.id === requestedDestinationProjectId,
  );

  if (selectedProjectIsAvailable) {
    return requestedDestinationProjectId;
  }

  return projectChoices[0]?.id ?? "";
}

type ProjectMapInstanceCopy = Readonly<{
  projectMaps: string;
  transferDestination: string;
  createProjectFirst: string;
  current: string;
  newMapName: string;
  saveName: string;
  cancelRename: string;
  open: string;
  rename: string;
  duplicate: string;
  copyToProject: string;
  moveToProject: string;
  deleteMap: string;
  addMap: string;
}>;

const englishProjectMapInstanceCopy = {
  projectMaps: "Project maps",
  transferDestination: "Transfer destination",
  createProjectFirst: "Create another local project first",
  current: "Current",
  newMapName: "New map name",
  saveName: "Save name",
  cancelRename: "Cancel rename",
  open: "Open",
  rename: "Rename",
  duplicate: "Duplicate",
  copyToProject: "Copy to project",
  moveToProject: "Move to project",
  deleteMap: "Delete",
  addMap: "Add map",
} as const satisfies ProjectMapInstanceCopy;

const japaneseProjectMapInstanceCopy = {
  projectMaps: "プロジェクトのマップ",
  transferDestination: "移動先",
  createProjectFirst: "先に別のローカルプロジェクトを作成してください",
  current: "現在",
  newMapName: "新しいマップ名",
  saveName: "名前を保存",
  cancelRename: "名前の変更をやめる",
  open: "開く",
  rename: "名前を変更",
  duplicate: "複製",
  copyToProject: "プロジェクトにコピー",
  moveToProject: "プロジェクトに移動",
  deleteMap: "削除",
  addMap: "マップを追加",
} as const satisfies ProjectMapInstanceCopy;

function readProjectMapInstanceCopy(locale: PlannerChromeLocale): ProjectMapInstanceCopy {
  if (locale === "en" || locale === "zh") {
    return englishProjectMapInstanceCopy;
  }

  if (locale === "ja") {
    return japaneseProjectMapInstanceCopy;
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read project map instance copy because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
