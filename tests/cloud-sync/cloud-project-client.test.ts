import { afterEach, describe, expect, it, vi } from "vitest";
import { CLOUD_PROJECT_DOCUMENT_MAX_BYTES } from "../../src/cloud-sync/cloud-project-contract";
import {
  deleteCloudProject,
  getCloudProject,
  getCloudProjects,
  putCloudProject,
} from "../../src/cloud-sync/cloud-project-client";
import {
  prepareCloudProjectDocument,
  type CloudProjectRecord,
} from "../../src/cloud-sync/cloud-project-contract";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("cloud project client", () => {
  it("uses the server cursor and validates a bounded project page", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        projects: [
          {
            id: "cloud-101",
            title: "Spring Farm",
            revision: 3,
            updatedAt: "2026-10-14T12:00:00.000Z",
            mapCount: 2,
          },
        ],
        nextCursor: null,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const page = await getCloudProjects("user-12", undefined, "cloud-100");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/cloud-projects?after=cloud-100",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: {
          accept: "application/json",
          "x-expected-account-id": "user-12",
        },
      }),
    );
    expect(page).toEqual({
      projects: [
        {
          id: "cloud-101",
          title: "Spring Farm",
          revision: 3,
          updatedAt: "2026-10-14T12:00:00.000Z",
          mapCount: 2,
        },
      ],
      nextCursor: null,
    });
  });

  it("preserves a typed revision conflict from the Worker", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json(
          { error: { code: "REVISION_CONFLICT", message: "Cloud copy changed." } },
          { status: 409 },
        ),
      ),
    );

    await expect(getCloudProject("user-12", "cloud-7")).rejects.toMatchObject({
      name: "CloudProjectRequestError",
      code: "REVISION_CONFLICT",
      statusCode: 409,
      message: "Cloud copy changed.",
    });
  });

  it("rejects an invalid path ID before making a request", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCloudProject("user-12", "../other-account")).rejects.toThrow(
      'Cloud project id must contain 1 to 120 letters, digits, underscores, or hyphens. Received: "../other-account".',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("cancels a cloud response after its byte limit and reports received bytes", async () => {
    const oversizedResponseBytes = new Uint8Array(
      CLOUD_PROJECT_DOCUMENT_MAX_BYTES + 16_385,
    );
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          new ReadableStream<Uint8Array>({
            start(streamController) {
              streamController.enqueue(oversizedResponseBytes);
              streamController.close();
            },
          }),
        ),
      ),
    );

    await expect(getCloudProject("user-12", "cloud-7")).rejects.toMatchObject({
      code: "RESPONSE_TOO_LARGE",
      message: expect.stringContaining(
        `received at least ${String(CLOUD_PROJECT_DOCUMENT_MAX_BYTES + 16_385)} bytes`,
      ),
    });
  });

  it("rejects a cloud response that is not valid UTF-8", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(new Uint8Array([0xc3, 0x28])),
      ),
    );

    await expect(getCloudProject("user-12", "cloud-7")).rejects.toMatchObject({
      code: "INVALID_RESPONSE_ENCODING",
      message: expect.stringContaining("invalid UTF-8 after 2 bytes"),
    });
  });

  it("sends the expected account header on detail, put, and delete requests", async () => {
    const storedProject = referenceProjectDocumentFixture.projects[0];
    if (storedProject === undefined) {
      throw new Error("Cloud client fixture is missing project-alpha.");
    }
    const projectDocument = prepareCloudProjectDocument(
      JSON.stringify({ version: 1, projects: [storedProject] }),
    );
    const cloudRecord: CloudProjectRecord = {
      id: "cloud-12",
      title: storedProject.title,
      revision: 2,
      updatedAt: "2026-10-15T00:00:00.000Z",
      mapCount: storedProject.project.maps.length,
      projectDocument,
    };
    const fetchMock = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(cloudRecord))
      .mockResolvedValueOnce(Response.json(cloudRecord))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await getCloudProject("user-12", "cloud-12");
    await putCloudProject("user-12", "cloud-12", {
      expectedRevision: 1,
      projectDocument,
    });
    await deleteCloudProject("user-12", "cloud-12", 2);

    for (const [, requestInit] of fetchMock.mock.calls) {
      expect(requestInit?.headers).toMatchObject({
        "x-expected-account-id": "user-12",
      });
    }
    expect(fetchMock.mock.calls.map(([, requestInit]) => requestInit?.method)).toEqual([
      "GET",
      "PUT",
      "DELETE",
    ]);
  });

  it("rejects a missing or header-unsafe expected account ID before fetching", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCloudProject("", "cloud-12")).rejects.toThrow(
      'Received: "".',
    );
    await expect(getCloudProject("user-12\r\nInjected: yes", "cloud-12"))
      .rejects.toThrow('Received: "user-12\\r\\nInjected: yes".');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces an account mismatch response without retrying the request", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        { error: { code: "ACCOUNT_CHANGED", message: "Active account changed." } },
        { status: 409 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCloudProject("user-12", "cloud-12")).rejects.toMatchObject({
      code: "ACCOUNT_CHANGED",
      statusCode: 409,
      message: "Active account changed.",
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
