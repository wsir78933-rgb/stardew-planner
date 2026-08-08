import type { PlannerWorkspaceAction } from "./planner-workspace-state";
import type { ReferenceOpenMapSession } from "../reference-runtime/reference-project-editor-adapter";

export type CanonicalMapIdentity = Readonly<{
  projectId: string;
  mapId: string;
}>;

export type CanonicalMapIdentityReference = {
  current: CanonicalMapIdentity | null;
};

export type CanonicalSessionMapLookup = Readonly<{
  getPlannerMapIdForMapFile: (mapFile: string) => string;
}>;

export type PlannerWorkspaceCanonicalIdentity = Readonly<{
  activeProjectId: string | null;
  activeMapId: string | null;
  selectedPlannerMapId: string;
}>;

export function createCanonicalMapIdentityReference(): CanonicalMapIdentityReference {
  return { current: null };
}

export function createCanonicalSessionTransition(
  activeSession: ReferenceOpenMapSession | null,
  canonicalSessionMapLookup: CanonicalSessionMapLookup,
  canonicalMapIdentityReference: CanonicalMapIdentityReference,
): Extract<PlannerWorkspaceAction, { type: "open-canonical-map" }> | null {
  assertCanonicalMapIdentityReference(canonicalMapIdentityReference);
  if (activeSession === null) {
    canonicalMapIdentityReference.current = null;
    return null;
  }

  const nextCanonicalMapIdentity = {
    projectId: activeSession.projectId,
    mapId: activeSession.mapId,
  };
  if (isSameCanonicalMapIdentity(
    canonicalMapIdentityReference.current,
    nextCanonicalMapIdentity,
  )) {
    return null;
  }

  const plannerMapId = canonicalSessionMapLookup.getPlannerMapIdForMapFile(
    activeSession.sourceMap.mapFile,
  );
  canonicalMapIdentityReference.current = nextCanonicalMapIdentity;
  return {
    type: "open-canonical-map",
    activeProjectId: activeSession.projectId,
    activeMapId: activeSession.mapId,
    plannerMapId,
    season: activeSession.season,
    placementSnapshot: activeSession.placementSnapshot,
  };
}

export function getCurrentCanonicalSession(
  activeSession: ReferenceOpenMapSession | null,
  plannerWorkspaceCanonicalIdentity: PlannerWorkspaceCanonicalIdentity,
  canonicalSessionMapLookup: CanonicalSessionMapLookup,
): ReferenceOpenMapSession | null {
  if (activeSession === null) return null;
  if (
    activeSession.projectId !== plannerWorkspaceCanonicalIdentity.activeProjectId
    || activeSession.mapId !== plannerWorkspaceCanonicalIdentity.activeMapId
  ) {
    return null;
  }
  const plannerMapId = canonicalSessionMapLookup.getPlannerMapIdForMapFile(
    activeSession.sourceMap.mapFile,
  );
  return plannerMapId === plannerWorkspaceCanonicalIdentity.selectedPlannerMapId
    ? activeSession
    : null;
}

function isSameCanonicalMapIdentity(
  previousCanonicalMapIdentity: CanonicalMapIdentity | null,
  nextCanonicalMapIdentity: CanonicalMapIdentity,
): boolean {
  return previousCanonicalMapIdentity !== null
    && previousCanonicalMapIdentity.projectId === nextCanonicalMapIdentity.projectId
    && previousCanonicalMapIdentity.mapId === nextCanonicalMapIdentity.mapId;
}

function assertCanonicalMapIdentityReference(
  canonicalMapIdentityReference: CanonicalMapIdentityReference,
): void {
  if (
    typeof canonicalMapIdentityReference !== "object"
    || canonicalMapIdentityReference === null
    || !("current" in canonicalMapIdentityReference)
  ) {
    throw new TypeError(
      "Canonical map identity reference must contain current; received "
        + `${JSON.stringify(canonicalMapIdentityReference)}.`,
    );
  }
}
