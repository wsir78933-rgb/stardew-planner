import { afterEach, describe, expect, it, vi } from "vitest";
import { getPlannerSession } from "../../src/auth/planner-auth-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("planner auth client", () => {
  it("reads only the safe user fields from the same-origin session endpoint", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        user: {
          id: "user-7",
          name: "Marnie",
          email: "marnie@example.com",
          image: "https://example.com/marnie.png",
          sessionToken: "must-not-be-returned",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const session = await getPlannerSession();

    expect(session).toEqual({
      user: {
        id: "user-7",
        name: "Marnie",
        email: "marnie@example.com",
        image: "https://example.com/marnie.png",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/get-session",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: { accept: "application/json" },
      }),
    );
  });

  it("surfaces the configured server message when auth is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        Response.json({ message: "Google auth is not configured." }, { status: 503 }),
      ),
    );

    await expect(getPlannerSession()).rejects.toMatchObject({
      name: "CloudAuthError",
      code: "AUTH_REQUEST_FAILED",
      message: "Google auth is not configured.",
    });
  });

  it("rejects a session response that exceeds its bounded body size", async () => {
    const responseBytes = new Uint8Array(16_385);
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          new ReadableStream<Uint8Array>({
            start(streamController) {
              streamController.enqueue(responseBytes);
              streamController.close();
            },
          }),
        ),
      ),
    );

    await expect(getPlannerSession()).rejects.toMatchObject({
      code: "AUTH_RESPONSE_TOO_LARGE",
      message: expect.stringContaining("received at least 16385 bytes"),
    });
  });

  it("rejects a session response that is not valid UTF-8", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(new Uint8Array([0xc3, 0x28])),
      ),
    );

    await expect(getPlannerSession()).rejects.toMatchObject({
      code: "AUTH_INVALID_ENCODING",
      message: expect.stringContaining("invalid UTF-8 after 2 bytes"),
    });
  });
});
