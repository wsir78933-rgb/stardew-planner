import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReferenceLocalProjectDocument } from "../../src/reference-runtime/local-project-api";
import type { ReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";
import {
  prepareCloudProjectDocument,
  type CloudProjectRecord,
} from "../../src/cloud-sync/cloud-project-contract";
import {
  importCloudProjectAndRebindMissingLocalLink,
  synchronizeLinkedCloudProject,
} from "../../src/cloud-sync/cloud-project-sync";
import type { CloudProjectLink } from "../../src/cloud-sync/cloud-project-link-store";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cloud project sync", () => {
  it("rebinds a deleted local project's cloud link to the imported copy", async () => {
    const fixtureProject = referenceProjectDocumentFixture.projects[0];
    if (fixtureProject === undefined) {
      throw new Error("Reference project fixture is missing project-alpha.");
    }
    const cloudProjectDocument = prepareCloudProjectDocument(
      JSON.stringify({ version: 1, projects: [fixtureProject] }),
    );
    const cloudProjectRecord: CloudProjectRecord = {
      id: "cloud-123",
      title: fixtureProject.title,
      revision: 6,
      updatedAt: "2026-10-14T12:00:00.000Z",
      mapCount: fixtureProject.project.maps.length,
      projectDocument: cloudProjectDocument,
    };
    const missingLocalProjectLink: CloudProjectLink = {
      localProjectId: "local-L1",
      cloudProjectId: cloudProjectRecord.id,
      revision: 1,
      lastSyncedSnapshot: `sha256:${"0".repeat(64)}`,
    };

    let importedProjectDocument: ReferenceLocalProjectDocument | null = null;
    const workspaceController = {
      getState: () => ({
        projectSummaries: [
          { id: "unrelated-local-project" },
          ...(importedProjectDocument?.projects.map((project) => ({ id: project.id })) ?? []),
        ],
        activeProject: importedProjectDocument?.projects[0] ?? null,
        activeSession: null,
      }),
      importProject(serializedProjectDocument: string): void {
        const parsedProjectDocument = JSON.parse(
          serializedProjectDocument,
        ) as ReferenceLocalProjectDocument;
        const importedProject = parsedProjectDocument.projects[0];
        if (importedProject === undefined) {
          throw new Error("Cloud project import did not contain a project.");
        }
        const importedMapIdBySourceId = new Map(
          importedProject.project.maps.map((projectMap, mapIndex) => [
            projectMap.id,
            `local-L2-map-${String(mapIndex)}`,
          ]),
        );
        let importedActiveMapId: string | null = null;
        if (importedProject.project.activeMapId !== null) {
          const remappedActiveMapId = importedMapIdBySourceId.get(
            importedProject.project.activeMapId,
          );
          if (remappedActiveMapId === undefined) {
            throw new Error("Cloud project fixture active map could not be remapped.");
          }
          importedActiveMapId = remappedActiveMapId;
        }
        importedProjectDocument = {
          ...parsedProjectDocument,
          projects: [
            {
              ...importedProject,
              id: "local-L2",
              created_at: "2026-10-15T00:00:00.000Z",
              updated_at: "2026-10-15T00:00:00.000Z",
              project: {
                ...importedProject.project,
                activeMapId: importedActiveMapId,
                maps: importedProject.project.maps.map((projectMap) => {
                  const importedMapId = importedMapIdBySourceId.get(
                    projectMap.id,
                  );
                  if (importedMapId === undefined) {
                    throw new Error(
                      `Cloud project fixture map ${JSON.stringify(projectMap.id)} could not be remapped.`,
                    );
                  }
                  return {
                    ...projectMap,
                    id: importedMapId,
                    thumbnail: `/api/projects/local-L2/maps/${importedMapId}/thumbnail`,
                  };
                }),
              },
            },
          ],
        };
      },
      exportProject(localProjectId: string): string {
        const importedProject = importedProjectDocument?.projects[0];
        if (importedProject === undefined || importedProject.id !== localProjectId) {
          throw new Error(`Unexpected local project export ID ${JSON.stringify(localProjectId)}.`);
        }
        return JSON.stringify(importedProjectDocument);
      },
    } as unknown as ReferenceProjectWorkspaceController;

    const rebindResult = await importCloudProjectAndRebindMissingLocalLink({
      workspaceController,
      cloudProjectLinks: [missingLocalProjectLink],
      missingLocalProjectLink,
      latestCloudRecord: cloudProjectRecord,
    });

    expect(rebindResult.importedLocalProjectId).toBe("local-L2");
    expect(workspaceController.getState().projectSummaries).toContainEqual({
      id: "unrelated-local-project",
    });
    expect(rebindResult.cloudProjectLinks).toHaveLength(1);
    expect(rebindResult.cloudProjectLinks[0]).toMatchObject({
      localProjectId: "local-L2",
      cloudProjectId: "cloud-123",
      revision: 6,
    });

    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);
    const retryResult = await synchronizeLinkedCloudProject({
      workspaceController,
      cloudProjectLink: rebindResult.cloudProjectLinks[0]!,
      expectedAccountId: "user-9",
    });

    expect(retryResult).toMatchObject({ changed: false, cloudRecord: null });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
