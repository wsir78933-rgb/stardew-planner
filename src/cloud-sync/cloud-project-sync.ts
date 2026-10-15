import type { ReferenceLocalProjectDocument } from "../reference-runtime/local-project-api";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import {
  prepareCloudProjectDocument,
  type CloudProjectRecord,
} from "./cloud-project-contract";
import {
  CloudProjectRequestError,
  putCloudProject,
} from "./cloud-project-client";
import type { CloudProjectLink } from "./cloud-project-link-store";

export type LinkedCloudProjectSyncResult = Readonly<{
  changed: boolean;
  cloudRecord: CloudProjectRecord | null;
  cloudProjectLink: CloudProjectLink;
}>;

export function rebindMissingLocalCloudProjectLink(input: Readonly<{
  cloudProjectLinks: readonly CloudProjectLink[];
  missingLocalProjectLink: CloudProjectLink;
  importedLocalProjectId: string;
  latestCloudRecord: CloudProjectRecord;
  latestCloudSnapshot: string;
}>): readonly CloudProjectLink[] {
  const {
    cloudProjectLinks,
    missingLocalProjectLink,
    importedLocalProjectId,
    latestCloudRecord,
    latestCloudSnapshot,
  } = input;
  requireLocalProjectId(importedLocalProjectId);
  if (latestCloudRecord.id !== missingLocalProjectLink.cloudProjectId) {
    throw new CloudProjectRequestError(
      "CLOUD_LINK_ID_MISMATCH",
      0,
      `Missing local link points to cloud project ${JSON.stringify(missingLocalProjectLink.cloudProjectId)}, but the fetched record is ${JSON.stringify(latestCloudRecord.id)}.`,
    );
  }

  const existingCloudLinkIndex = cloudProjectLinks.findIndex(
    (cloudProjectLink) =>
      cloudProjectLink.cloudProjectId === missingLocalProjectLink.cloudProjectId &&
      cloudProjectLink.localProjectId === missingLocalProjectLink.localProjectId,
  );
  if (existingCloudLinkIndex === -1) {
    throw new CloudProjectRequestError(
      "CLOUD_LINK_NOT_FOUND",
      0,
      `Stored cloud link for missing local project ${JSON.stringify(missingLocalProjectLink.localProjectId)} and cloud project ${JSON.stringify(missingLocalProjectLink.cloudProjectId)} was not found.`,
    );
  }

  const duplicateLocalLink = cloudProjectLinks.find(
    (cloudProjectLink) =>
      cloudProjectLink.localProjectId === importedLocalProjectId &&
      cloudProjectLink.cloudProjectId !== missingLocalProjectLink.cloudProjectId,
  );
  if (duplicateLocalLink !== undefined) {
    throw new CloudProjectRequestError(
      "LOCAL_PROJECT_ALREADY_LINKED",
      409,
      `Imported local project ${JSON.stringify(importedLocalProjectId)} is already linked to cloud project ${JSON.stringify(duplicateLocalLink.cloudProjectId)}.`,
    );
  }

  return cloudProjectLinks.map((cloudProjectLink, linkIndex) =>
    linkIndex === existingCloudLinkIndex
      ? {
          localProjectId: importedLocalProjectId,
          cloudProjectId: latestCloudRecord.id,
          revision: latestCloudRecord.revision,
          lastSyncedSnapshot: latestCloudSnapshot,
        }
      : cloudProjectLink,
  );
}

export async function importCloudProjectAndRebindMissingLocalLink(input: Readonly<{
  workspaceController: ReferenceProjectWorkspaceController;
  cloudProjectLinks: readonly CloudProjectLink[];
  missingLocalProjectLink: CloudProjectLink;
  latestCloudRecord: CloudProjectRecord;
}>): Promise<Readonly<{
  importedLocalProjectId: string;
  cloudProjectLinks: readonly CloudProjectLink[];
}>> {
  const importedLocalProjectId = importCloudProjectAsLocalCopy(
    input.workspaceController,
    input.latestCloudRecord,
  );
  const latestCloudSnapshot = await createCloudProjectSnapshotFingerprint(
    input.latestCloudRecord.projectDocument,
  );
  const cloudProjectLinks = rebindMissingLocalCloudProjectLink({
    cloudProjectLinks: input.cloudProjectLinks,
    missingLocalProjectLink: input.missingLocalProjectLink,
    importedLocalProjectId,
    latestCloudRecord: input.latestCloudRecord,
    latestCloudSnapshot,
  });

  return { importedLocalProjectId, cloudProjectLinks };
}

export function prepareLocalProjectForCloudSync(
  workspaceController: ReferenceProjectWorkspaceController,
  localProjectId: string,
): ReferenceLocalProjectDocument {
  requireLocalProjectId(localProjectId);
  const serializedLocalProject = workspaceController.exportProject(localProjectId);
  return prepareCloudProjectDocument(serializedLocalProject);
}

export async function synchronizeLinkedCloudProject(input: Readonly<{
  workspaceController: ReferenceProjectWorkspaceController;
  cloudProjectLink: CloudProjectLink;
  expectedAccountId: string;
  signal?: AbortSignal;
}>): Promise<LinkedCloudProjectSyncResult> {
  const {
    workspaceController,
    cloudProjectLink,
    expectedAccountId,
    signal,
  } = input;
  const currentLocalProjectDocument = prepareLocalProjectForCloudSync(
    workspaceController,
    cloudProjectLink.localProjectId,
  );
  const currentSnapshotFingerprint = await createCloudProjectSnapshotFingerprint(
    currentLocalProjectDocument,
  );
  if (currentSnapshotFingerprint === cloudProjectLink.lastSyncedSnapshot) {
    return {
      changed: false,
      cloudRecord: null,
      cloudProjectLink,
    };
  }

  const cloudRecord = await putCloudProject(
    expectedAccountId,
    cloudProjectLink.cloudProjectId,
    {
      expectedRevision: cloudProjectLink.revision,
      projectDocument: currentLocalProjectDocument,
    },
    signal,
  );
  const syncedSnapshotFingerprint = await createCloudProjectSnapshotFingerprint(
    cloudRecord.projectDocument,
  );

  return {
    changed: true,
    cloudRecord,
    cloudProjectLink: {
      ...cloudProjectLink,
      revision: cloudRecord.revision,
      lastSyncedSnapshot: syncedSnapshotFingerprint,
    },
  };
}

export function importCloudProjectAsLocalCopy(
  workspaceController: ReferenceProjectWorkspaceController,
  cloudRecord: CloudProjectRecord,
  protectedLocalProjectId?: string,
): string {
  workspaceController.importProject(JSON.stringify(cloudRecord.projectDocument));
  const importedLocalProjectId =
    workspaceController.getState().activeProject?.id;
  if (typeof importedLocalProjectId !== "string" || importedLocalProjectId.length === 0) {
    throw new Error(
      `Cloud project ${JSON.stringify(cloudRecord.id)} import completed without an active local project ID.`,
    );
  }
  if (protectedLocalProjectId === importedLocalProjectId) {
    throw new Error(
      `Cloud project ${JSON.stringify(cloudRecord.id)} import reused protected local project ID ${JSON.stringify(protectedLocalProjectId)} instead of creating a copy.`,
    );
  }
  return importedLocalProjectId;
}

export async function createCloudProjectSnapshotFingerprint(
  projectDocument: ReferenceLocalProjectDocument,
): Promise<string> {
  // Imports can regenerate local project/map IDs and timestamps without changing layout content.
  const fingerprintDocument = {
    version: projectDocument.version,
    projects: projectDocument.projects.map((storedProject) => {
      const normalizedMapIdByLocalId = new Map(
        storedProject.project.maps.map((projectMap, mapIndex) => [
          projectMap.id,
          `cloud-project-map-${String(mapIndex)}`,
        ]),
      );
      const normalizedActiveMapId =
        storedProject.project.activeMapId === null
          ? null
          : normalizedMapIdByLocalId.get(storedProject.project.activeMapId);
      if (
        storedProject.project.activeMapId !== null &&
        normalizedActiveMapId === undefined
      ) {
        throw new CloudProjectRequestError(
          "INVALID_SNAPSHOT",
          0,
          `Cloud project snapshot active map ID ${JSON.stringify(storedProject.project.activeMapId)} does not identify a map in project ${JSON.stringify(storedProject.id)}.`,
        );
      }

      return {
        ...storedProject,
        id: "cloud-project-local-id",
        created_at: "cloud-project-created-at",
        updated_at: "cloud-project-updated-at",
        project: {
          ...storedProject.project,
          activeMapId: normalizedActiveMapId,
          maps: storedProject.project.maps.map((projectMap) => {
            const normalizedMapId = normalizedMapIdByLocalId.get(projectMap.id);
            if (normalizedMapId === undefined) {
              throw new CloudProjectRequestError(
                "INVALID_SNAPSHOT",
                0,
                `Cloud project snapshot map ID ${JSON.stringify(projectMap.id)} in project ${JSON.stringify(storedProject.id)} could not be normalized.`,
              );
            }
            return {
              ...projectMap,
              id: normalizedMapId,
              thumbnail: `/api/projects/cloud-project-local-id/maps/${normalizedMapId}/thumbnail`,
            };
          }),
        },
      };
    }),
  };
  const serializedProjectDocument = JSON.stringify(fingerprintDocument);
  if (typeof serializedProjectDocument !== "string") {
    throw new CloudProjectRequestError(
      "INVALID_SNAPSHOT",
      0,
      `Cloud project snapshot could not be serialized. Received: ${describeValue(fingerprintDocument)}.`,
    );
  }
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new CloudProjectRequestError(
      "CRYPTO_UNAVAILABLE",
      0,
      "Web Crypto SHA-256 is unavailable; cloud project sync requires a secure browser context.",
    );
  }

  const snapshotBytes = new TextEncoder().encode(serializedProjectDocument);
  const snapshotDigest = await crypto.subtle.digest("SHA-256", snapshotBytes);
  const fingerprintHex = Array.from(new Uint8Array(snapshotDigest))
    .map((digestByte) => digestByte.toString(16).padStart(2, "0"))
    .join("");
  return `sha256:${fingerprintHex}`;
}

export function createCloudProjectId(): string {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new CloudProjectRequestError(
      "UUID_UNAVAILABLE",
      0,
      "Browser crypto.randomUUID is unavailable; cloud project IDs cannot be generated.",
    );
  }
  return crypto.randomUUID();
}

function requireLocalProjectId(localProjectId: string): void {
  if (typeof localProjectId !== "string" || localProjectId.length === 0) {
    throw new CloudProjectRequestError(
      "INVALID_LOCAL_PROJECT_ID",
      0,
      `Local project ID must be a non-empty string. Received: ${describeValue(localProjectId)}.`,
    );
  }
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }
  if (rawValue === undefined) {
    return "undefined";
  }
  const serializedValue = JSON.stringify(rawValue);
  return serializedValue ?? String(rawValue);
}
