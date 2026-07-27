"use client";

import { useState } from "react";

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

type ProjectMapInstancePanelProperties = Readonly<{
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
            value={destinationProjectId}
          >
            {projectChoices.length === 0 ? (
              <option value="">Create another local project first</option>
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
                <span>{mapInstance.baseMapId}</span>
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
