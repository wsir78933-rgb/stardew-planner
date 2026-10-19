"use client";

import { useState } from "react";
import { readVisibleProjectMapLabel } from "../i18n/planner-project-map-label";
import type { PlannerMap } from "../maps/map-catalog";
import type { ReferenceProjectMap } from "../reference-runtime/local-project-api";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";
import { PlannerMapPicker } from "./planner-map-picker";

type ProjectMapInstanceLocale = "en" | "zh" | "ru";

type ProjectMapInstancePanelCopy = Readonly<{
  addMap: string;
  cancelRename: string;
  copyToProject: string;
  current: string;
  deleteMap: string;
  duplicate: string;
  emptyDestination: string;
  moveToProject: string;
  newMapName: string;
  open: string;
  projectMaps: string;
  rename: string;
  saveName: string;
  transferDestination: string;
}>;

type ProjectMapInstancePanelProperties = Readonly<{
  locale?: ProjectMapInstanceLocale;
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
  locale,
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
  const panelLocale = readProjectMapInstanceLocale(locale);
  const panelCopy = readProjectMapInstancePanelCopy(panelLocale);
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
      throw new Error(readMissingDestinationProjectMessage(panelLocale));
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
              <option value="">{panelCopy.emptyDestination}</option>
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
                <strong>{readVisibleProjectMapLabel(mapInstance, panelLocale)}</strong>
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
          locale={panelLocale}
          mapIdDataAttribute="data-project-add-map-id"
          maps={mapChoices}
          onMapSelect={onAddMap}
          selectedMapId={null}
        />
      </section>
    </section>
  );
}

function readProjectMapInstanceLocale(
  locale: ProjectMapInstanceLocale | undefined,
): ProjectMapInstanceLocale {
  const resolvedLocale = locale ?? "en";
  if (resolvedLocale === "en" || resolvedLocale === "zh" || resolvedLocale === "ru") {
    return resolvedLocale;
  }
  throw new TypeError(
    `Project map instance locale must be "en", "zh", or "ru"; received ${JSON.stringify(resolvedLocale)}.`,
  );
}

function readProjectMapInstancePanelCopy(
  locale: ProjectMapInstanceLocale,
): ProjectMapInstancePanelCopy {
  if (locale === "en" || locale === "zh") {
    return {
      addMap: "Add map",
      cancelRename: "Cancel rename",
      copyToProject: "Copy to project",
      current: "Current",
      deleteMap: "Delete",
      duplicate: "Duplicate",
      emptyDestination: "Create another local project first",
      moveToProject: "Move to project",
      newMapName: "New map name",
      open: "Open",
      projectMaps: "Project maps",
      rename: "Rename",
      saveName: "Save name",
      transferDestination: "Transfer destination",
    };
  }
  if (locale === "ru") {
    return {
      addMap: "Добавить карту",
      cancelRename: "Отменить переименование",
      copyToProject: "Копировать в проект",
      current: "Текущая",
      deleteMap: "Удалить",
      duplicate: "Дублировать",
      emptyDestination: "Сначала создайте ещё один локальный проект",
      moveToProject: "Переместить в проект",
      newMapName: "Новое название карты",
      open: "Открыть",
      projectMaps: "Карты проекта",
      rename: "Переименовать",
      saveName: "Сохранить название",
      transferDestination: "Куда перенести",
    };
  }
  throw new TypeError(
    `Project map instance locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}

function readMissingDestinationProjectMessage(locale: ProjectMapInstanceLocale): string {
  if (locale === "en" || locale === "zh") {
    return "Cannot transfer a local map instance because no destination project is selected.";
  }
  if (locale === "ru") {
    return "Нельзя перенести локальную карту: проект назначения не выбран.";
  }
  throw new TypeError(
    `Project map instance locale must be "en", "zh", or "ru"; received ${JSON.stringify(locale)}.`,
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
