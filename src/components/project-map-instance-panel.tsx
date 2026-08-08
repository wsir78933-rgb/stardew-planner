"use client";

import { useState } from "react";
import type { PlannerMap } from "../maps/map-catalog";
import type { ReferenceProjectMap } from "../reference-runtime/local-project-api";
import type { ReferenceProjectSummary } from "../reference-runtime/reference-project-repository";

type ProjectMapInstancePanelProperties = Readonly<{
  activeMapInstanceId: string | null;
  mapInstances: readonly ReferenceProjectMap[];
  mapChoices: readonly Pick<PlannerMap, "id" | "displayName">[];
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
    <section aria-label="Project maps" className="project-map-instance-panel">
      <h3>Project maps</h3>
      <div className="project-map-instance-panel__transfer-destination">
        <label>
          <span>Transfer destination</span>
          <select
            disabled={projectChoices.length === 0}
            onChange={(changeEvent) =>
              setDestinationProjectId(changeEvent.target.value)
            }
            value={availableDestinationProjectId}
          >
            {projectChoices.length === 0 ? (
              <option value="">Create another local project first</option>
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
                {isActiveMapInstance ? <span>Current</span> : null}
              </div>
              {isRenamingMapInstance ? (
                <div className="project-map-instance-panel__rename-form">
                  <label>
                    <span className="sr-only">New map name</span>
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
                    Save name
                  </button>
                  <button
                    onClick={() => setRenamingMapInstanceId(null)}
                    type="button"
                  >
                    Cancel rename
                  </button>
                </div>
              ) : (
                <div className="project-map-instance-panel__instance-actions">
                  <button
                    onClick={() => onOpenMapInstance(mapInstance.id)}
                    type="button"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => startRenamingMapInstance(mapInstance)}
                    type="button"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => onDuplicateMapInstance(mapInstance.id)}
                    type="button"
                  >
                    Duplicate
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
                    Copy to project
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
                    Move to project
                  </button>
                  <button
                    onClick={() => onDeleteMapInstance(mapInstance.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <section aria-label="Add map" className="project-map-instance-panel__add-map">
        <h3>Add map</h3>
        <div className="project-map-instance-panel__map-grid">
          {mapChoices.map((mapChoice) => (
            <button
              data-project-add-map-id={mapChoice.id}
              key={mapChoice.id}
              onClick={() => onAddMap(mapChoice.id)}
              type="button"
            >
              {mapChoice.displayName}
            </button>
          ))}
        </div>
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
