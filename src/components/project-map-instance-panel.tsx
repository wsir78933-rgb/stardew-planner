"use client";

import { useState } from "react";
import { getPlannerMapDisplayName } from "../i18n/catalog-display";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

export type ProjectMapInstanceSummary = Readonly<{
  id: string;
  baseMapId: string;
  name: string;
}>;

export type ProjectMapChoice = Readonly<{
  id: string;
  displayName: string;
}>;

export type ProjectMapTransferDestination = Readonly<{
  id: string;
  name: string;
}>;

export type ProjectMapInstancePanelProperties = Readonly<{
  locale?: SiteLocale;
  activeMapInstanceId: string;
  mapInstances: readonly ProjectMapInstanceSummary[];
  mapChoices: readonly ProjectMapChoice[];
  projectChoices: readonly ProjectMapTransferDestination[];
  onAddMap: (baseMapId: string) => void;
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

  function startRenamingMapInstance(mapInstance: ProjectMapInstanceSummary): void {
    setRenamingMapInstanceId(mapInstance.id);
    setRequestedMapInstanceName(mapInstance.name);
  }

  function submitMapInstanceRename(mapInstanceId: string): void {
    onRenameMapInstance(mapInstanceId, requestedMapInstanceName);
    setRenamingMapInstanceId(null);
  }

  function getRequiredDestinationProjectId(): string {
    if (destinationProjectId.length === 0) {
      throw new Error(
        "Cannot transfer a local map instance because no destination project is selected.",
      );
    }

    return destinationProjectId;
  }

  return (
    <section aria-label={translate(locale, "planner.projectMaps.label")} className="project-map-instance-panel">
      <h3>{translate(locale, "planner.projectMaps.label")}</h3>
      <div className="project-map-instance-panel__transfer-destination">
        <label>
          <span>{translate(locale, "planner.projectMaps.transferDestination")}</span>
          <select
            disabled={projectChoices.length === 0}
            onChange={(changeEvent) =>
              setDestinationProjectId(changeEvent.target.value)
            }
            value={destinationProjectId}
          >
            {projectChoices.length === 0 ? (
              <option value="">{translate(locale, "planner.projectMaps.noDestination")}</option>
            ) : (
              projectChoices.map((projectChoice) => (
                <option key={projectChoice.id} value={projectChoice.id}>
                  {projectChoice.name}
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
                <strong>{mapInstance.name}</strong>
                <span>{getMapInstanceDisplayName(locale, mapInstance.baseMapId, mapChoices)}</span>
                {isActiveMapInstance ? <span>{translate(locale, "planner.projectMaps.current")}</span> : null}
              </div>
              {isRenamingMapInstance ? (
                <div className="project-map-instance-panel__rename-form">
                  <label>
                    <span className="sr-only">{translate(locale, "planner.projectMaps.newMapName")}</span>
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
                    {translate(locale, "planner.projectMaps.saveName")}
                  </button>
                  <button
                    onClick={() => setRenamingMapInstanceId(null)}
                    type="button"
                  >
                    {translate(locale, "planner.projectMaps.cancelRename")}
                  </button>
                </div>
              ) : (
                <div className="project-map-instance-panel__instance-actions">
                  <button
                    onClick={() => onOpenMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {translate(locale, "planner.projectMaps.open")}
                  </button>
                  <button
                    onClick={() => startRenamingMapInstance(mapInstance)}
                    type="button"
                  >
                    {translate(locale, "planner.projectMaps.rename")}
                  </button>
                  <button
                    onClick={() => onDuplicateMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {translate(locale, "planner.projectMaps.duplicate")}
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
                    {translate(locale, "planner.projectMaps.copy")}
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
                    {translate(locale, "planner.projectMaps.move")}
                  </button>
                  <button
                    onClick={() => onDeleteMapInstance(mapInstance.id)}
                    type="button"
                  >
                    {translate(locale, "planner.projectMaps.delete")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <section aria-label={translate(locale, "planner.projectMaps.add")} className="project-map-instance-panel__add-map">
        <h3>{translate(locale, "planner.projectMaps.add")}</h3>
        <div className="project-map-instance-panel__map-grid">
          {mapChoices.map((mapChoice) => (
            <button
              data-project-add-map-id={mapChoice.id}
              key={mapChoice.id}
              onClick={() => onAddMap(mapChoice.id)}
              type="button"
            >
              {getPlannerMapDisplayName(locale, mapChoice.id, mapChoice.displayName)}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function getMapInstanceDisplayName(
  locale: SiteLocale,
  baseMapId: string,
  mapChoices: readonly ProjectMapChoice[],
): string {
  const mapChoice = mapChoices.find((candidateMapChoice) => candidateMapChoice.id === baseMapId);
  return getPlannerMapDisplayName(locale, baseMapId, mapChoice?.displayName ?? baseMapId);
}
