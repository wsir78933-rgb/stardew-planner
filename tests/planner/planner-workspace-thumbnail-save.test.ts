import { describe, expect, it, vi } from "vitest";
import { saveCurrentCanonicalMapThumbnail } from "../../src/planner/planner-workspace-thumbnail-save";
import type { ThumbnailSaveWorkspaceSnapshot } from "../../src/planner/planner-workspace-thumbnail-save";
import { MapImageExportError } from "../../src/projects/map-image-export";
import type { ReferenceOpenMapSession } from "../../src/reference-runtime/reference-project-editor-adapter";

function createSnapshot(
  exporter: { captureScreenshot: (resolution: 1 | 2) => Promise<Blob> },
): ThumbnailSaveWorkspaceSnapshot {
  return {
    activeSession: {
      projectId: "project",
      mapId: "map",
      sourceMap: { mapFile: "Farm.tmx" },
    } as ReferenceOpenMapSession,
    plannerMapId: "farm",
    mapImageExporter: exporter,
  };
}

function createStructurallyValidWebpBlob(): Blob {
  return new Blob([
    new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 14, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
      0x56, 0x50, 0x38, 0x20, 1, 0, 0, 0, 0, 0,
    ]),
  ], { type: "image/webp" });
}

const webpEncoder = {
  encodePngBlobAsWebp: async () => createStructurallyValidWebpBlob(),
};

describe("planner workspace thumbnail save", () => {
  it("saves once after target identities remain stable", async () => {
    const mapImageExporter = { captureScreenshot: vi.fn(async () => new Blob(["png"], { type: "image/png" })) };
    const workspaceSnapshot = createSnapshot(mapImageExporter);
    const saveThumbnail = vi.fn();
    await saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => workspaceSnapshot,
      workspaceController: { saveThumbnail },
      getPlannerMapIdForMapFile: () => "farm",
      pngToWebpEncodingPort: webpEncoder,
    });
    expect(saveThumbnail).toHaveBeenCalledTimes(1);
    expect(saveThumbnail).toHaveBeenCalledWith(expect.objectContaining({ projectId: "project", mapId: "map" }));
  });

  it("never saves when the canonical target changes during encoding", async () => {
    const mapImageExporter = { captureScreenshot: vi.fn(async () => new Blob(["png"], { type: "image/png" })) };
    let workspaceSnapshot = createSnapshot(mapImageExporter);
    const saveThumbnail = vi.fn();
    const thumbnailSavePromise = saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => workspaceSnapshot,
      workspaceController: { saveThumbnail },
      getPlannerMapIdForMapFile: () => "farm",
      pngToWebpEncodingPort: {
        encodePngBlobAsWebp: async () => {
          workspaceSnapshot = { ...workspaceSnapshot, plannerMapId: "island" };
          return createStructurallyValidWebpBlob();
        },
      },
    });
    await expect(thumbnailSavePromise).rejects.toThrow(
      "Canonical thumbnail planner map does not match the active source map",
    );
    await expect(thumbnailSavePromise).rejects.toBeInstanceOf(MapImageExportError);
    expect(saveThumbnail).not.toHaveBeenCalled();
  });

  it("never saves when capture or encoding fails", async () => {
    const saveThumbnail = vi.fn();
    await expect(saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => createSnapshot({
        captureScreenshot: async () => { throw new Error("capture failed"); },
      }),
      workspaceController: { saveThumbnail },
      getPlannerMapIdForMapFile: () => "farm",
      pngToWebpEncodingPort: webpEncoder,
    })).rejects.toThrow("capture failed");
    await expect(saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => createSnapshot({
        captureScreenshot: async () => new Blob(["png"], { type: "image/png" }),
      }),
      workspaceController: { saveThumbnail },
      getPlannerMapIdForMapFile: () => "farm",
      pngToWebpEncodingPort: { encodePngBlobAsWebp: async () => { throw new Error("encoding failed"); } },
    })).rejects.toThrow("encoding failed");
    expect(saveThumbnail).not.toHaveBeenCalled();
  });

  it("does not capture when the canonical source map resolves to another planner map", async () => {
    const captureScreenshot = vi.fn(async () => new Blob(["png"], { type: "image/png" }));
    const saveThumbnail = vi.fn();
    const thumbnailSavePromise = saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => createSnapshot({ captureScreenshot }),
      workspaceController: { saveThumbnail },
      getPlannerMapIdForMapFile: () => "forest",
      pngToWebpEncodingPort: webpEncoder,
    });
    await expect(thumbnailSavePromise).rejects.toThrow(
      'resolved planner map ID "forest", and current planner map ID "farm"',
    );
    await expect(thumbnailSavePromise).rejects.toBeInstanceOf(MapImageExportError);
    expect(captureScreenshot).not.toHaveBeenCalled();
    expect(saveThumbnail).not.toHaveBeenCalled();
  });
});
