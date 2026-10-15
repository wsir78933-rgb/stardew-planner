import { describe, expect, it } from "vitest";
import {
  CLOUD_PROJECT_DOCUMENT_MAX_BYTES,
  parseCloudProjectDocument,
  parseCloudProjectList,
  parseCloudProjectRecord,
  parseCloudProjectSummary,
  prepareCloudProjectDocument,
  validateCloudProjectDocument,
} from "../../src/cloud-sync/cloud-project-contract";
import type { ReferenceLocalProjectDocument } from "../../src/reference-runtime/local-project-api";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

function cloneProjectDocument(): ReferenceLocalProjectDocument {
  return JSON.parse(
    JSON.stringify(referenceProjectDocumentFixture),
  ) as ReferenceLocalProjectDocument;
}

function exportFirstProject(): string {
  const projectDocument = cloneProjectDocument();
  return JSON.stringify({
    version: projectDocument.version,
    projects: [projectDocument.projects[0]],
  });
}

function createCloudProjectRecord() {
  const projectDocument = prepareCloudProjectDocument(exportFirstProject());
  return {
    id: "cloud-share-id",
    title: "Alpha Farm",
    revision: 2,
    updatedAt: "2026-08-02T04:00:00.000Z",
    mapCount: 2,
    projectDocument,
  };
}

describe("cloud project document contract", () => {
  it("removes image data while preserving every map and its layout content", () => {
    const sourceDocument = cloneProjectDocument();
    const sourceProject = sourceDocument.projects[0];
    if (!sourceProject) {
      throw new Error("Fixture project at index 0 is missing.");
    }

    sourceProject.thumbnailsByMapId = {
      "map-standard": `data:image/webp;base64,${"A".repeat(300_000)}`,
      "map-island": `data:image/webp;base64,${"B".repeat(300_000)}`,
    };

    const projectDocument = prepareCloudProjectDocument(
      JSON.stringify({ version: 1, projects: [sourceProject] }),
    );
    const storedProject = projectDocument.projects[0];

    expect(storedProject).toBeDefined();
    expect(storedProject && "thumbnailsByMapId" in storedProject).toBe(false);
    expect(storedProject?.id).toBe("project-alpha");
    expect(storedProject?.project.maps).toEqual(sourceProject.project.maps);
    expect(storedProject?.project.maps).toHaveLength(2);
    expect(storedProject?.project.maps[0]?.state.preservedStateExtension).toEqual([
      "kept",
      { nested: true },
    ]);
    expect(storedProject?.project.maps[0]?.decor.wallpapers).toEqual({
      "wall-1": { pattern: "wallpaper_12", x: 1, y: 2 },
    });
    expect(storedProject?.project.maps[0]?.renovations).toEqual([
      "kitchen",
      { id: "cellar", complete: true },
    ]);
  });

  it("requires exactly one reference project for a cloud document", () => {
    expect(() =>
      prepareCloudProjectDocument(JSON.stringify(cloneProjectDocument())),
    ).toThrow("exactly one project. Received: 2 projects");

    expect(() =>
      prepareCloudProjectDocument(JSON.stringify({ version: 1, projects: [] })),
    ).toThrow("exactly one project. Received: 0 projects");
  });

  it("enforces the normalized D1 document byte cap after removing thumbnails", () => {
    const projectDocument = cloneProjectDocument();
    const firstProject = projectDocument.projects[0];
    if (!firstProject) {
      throw new Error("Fixture project at index 0 is missing.");
    }
    firstProject.project.maps[0]?.renovations.push("R".repeat(CLOUD_PROJECT_DOCUMENT_MAX_BYTES));

    expect(() =>
      validateCloudProjectDocument({ version: 1, projects: [firstProject] }),
    ).toThrow("after removing thumbnails; maximum is 1048576 bytes");
  });

  it("bounds deeply nested raw documents before recursive reference validation", () => {
    const projectDocument = cloneProjectDocument();
    const firstProject = projectDocument.projects[0];
    if (!firstProject) {
      throw new Error("Fixture project at index 0 is missing.");
    }

    let nestedRenovation: unknown = "end";
    for (let nestingIndex = 0; nestingIndex < 70; nestingIndex += 1) {
      nestedRenovation = [nestedRenovation];
    }
    firstProject.project.maps[0]?.renovations.push(nestedRenovation as never);

    expect(() =>
      validateCloudProjectDocument({ version: 1, projects: [firstProject] }),
    ).toThrow("Cloud project document nesting exceeds 64 levels");
  });

  it("reads only bounded, image-free canonical JSON from D1", () => {
    const sourceDocument = JSON.parse(exportFirstProject()) as Record<string, unknown>;
    const sourceProjects = sourceDocument.projects as Array<Record<string, unknown>>;
    const sourceProject = sourceProjects[0];
    if (!sourceProject) {
      throw new Error("Fixture project at index 0 is missing.");
    }
    sourceProject.thumbnailsByMapId = { "map-standard": "data:image/webp;base64,AA==" };

    expect(() => parseCloudProjectDocument(JSON.stringify(sourceDocument))).toThrow(
      "must not include stored thumbnail data",
    );
    expect(() => parseCloudProjectDocument("{" )).toThrow(
      "Cloud project database JSON is malformed",
    );
  });
});

describe("cloud project record and summary parsers", () => {
  it("allows a cloud record id to differ from the local project id", () => {
    const cloudRecord = parseCloudProjectRecord(createCloudProjectRecord());

    expect(cloudRecord.id).toBe("cloud-share-id");
    expect(cloudRecord.projectDocument.projects[0]?.id).toBe("project-alpha");
    expect(cloudRecord.mapCount).toBe(2);
  });

  it("validates title and map count against the embedded reference project", () => {
    expect(() =>
      parseCloudProjectRecord({ ...createCloudProjectRecord(), title: "Different title" }),
    ).toThrow("summary title must match project document title");
    expect(() =>
      parseCloudProjectRecord({ ...createCloudProjectRecord(), mapCount: 1 }),
    ).toThrow("summary mapCount must match project document maps");
  });

  it("parses summaries and rejects duplicate ids in the list envelope", () => {
    const summary = {
      id: "cloud-share-id",
      title: "Alpha Farm",
      revision: 2,
      updatedAt: "2026-08-02T04:00:00.000Z",
      mapCount: 2,
    };

    expect(parseCloudProjectSummary(summary)).toEqual(summary);
    expect(parseCloudProjectList({ projects: [summary] })).toEqual({
      projects: [summary],
    });
    expect(() => parseCloudProjectList({ projects: [summary, summary] })).toThrow(
      "duplicate cloud project ID",
    );
    expect(() => parseCloudProjectSummary({ ...summary, revision: 0 })).toThrow(
      "revision must be a positive safe integer. Received: 0",
    );
  });
});
