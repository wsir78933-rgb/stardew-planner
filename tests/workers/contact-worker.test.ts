import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  default as contactWorker,
  handleContactRequest,
  type ContactWorkerEnvironment,
} from "../../workers/contact-worker";

const allowedOrigin = "https://stardewvalleyplanner.art";
const sendEmail = vi.fn<
  ContactWorkerEnvironment["CONTACT_EMAIL"]["send"]
>();
const fetchMock = vi.fn();
const fetchStaticAsset = vi.fn<
  ContactWorkerEnvironment["STATIC_ASSETS"]["fetch"]
>();

function createWorkerEnvironment(): ContactWorkerEnvironment {
  return {
    CONTACT_ALLOWED_ORIGIN: allowedOrigin,
    CONTACT_EXPECTED_TURNSTILE_HOSTNAME: "stardewvalleyplanner.art",
    CONTACT_FROM_EMAIL: "contact@stardewvalleyplanner.art",
    CONTACT_RECIPIENT_EMAIL: "inbox@example.com",
    CONTACT_TURNSTILE_ACTION: "turnstile-spin-v2",
    TURNSTILE_SECRET: "test-secret",
    CONTACT_EMAIL: { send: sendEmail },
    STATIC_ASSETS: { fetch: fetchStaticAsset },
  };
}

function createContactRequest(
  requestBody: Record<string, string>,
  options: Readonly<{
    contentType?: string;
    method?: string;
    origin?: string;
  }> = {},
): Request {
  const requestMethod = options.method ?? "POST";

  return new Request(`${allowedOrigin}/api/contact`, {
    method: requestMethod,
    headers: {
      "content-type": options.contentType ?? "application/json",
      "cf-connecting-ip": "198.51.100.10",
      origin: options.origin ?? allowedOrigin,
    },
    body: requestMethod === "GET" ? undefined : JSON.stringify(requestBody),
  });
}

function createChunkedContactRequest(requestText: string): Request {
  const requestStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(requestText));
      controller.close();
    },
  });

  return new Request(`${allowedOrigin}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": "198.51.100.10",
      origin: allowedOrigin,
    },
    body: requestStream,
    duplex: "half",
  } as RequestInit);
}

function createMalformedJsonRequest(): Request {
  return new Request(`${allowedOrigin}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": "198.51.100.10",
      origin: allowedOrigin,
    },
    body: "{",
  });
}

const validRequestBody = {
  name: "Jane Farmer",
  email: "jane@example.com",
  message: "Please add a feature.",
  turnstileToken: "turnstile-token",
};

describe("handleContactRequest", () => {
  beforeEach(() => {
    sendEmail.mockReset();
    sendEmail.mockResolvedValue(undefined);
    fetchMock.mockReset();
    fetchStaticAsset.mockReset();
    fetchMock.mockResolvedValue(
      Response.json({
        success: true,
        hostname: "stardewvalleyplanner.art",
        action: "turnstile-spin-v2",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("verifies Turnstile and sends a replyable email to the configured inbox", async () => {
    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(202);
    expect(fetchMock).toHaveBeenCalledOnce();
    const turnstileRequest = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect((turnstileRequest.body as FormData).get("remoteip")).toBe(
      "198.51.100.10",
    );
    expect(sendEmail).toHaveBeenCalledWith({
      from: "contact@stardewvalleyplanner.art",
      to: "inbox@example.com",
      subject: "New contact message from Jane Farmer",
      replyTo: "jane@example.com",
      text: "Name: Jane Farmer\nEmail: jane@example.com\n\nPlease add a feature.",
    });
  });

  it("rejects a chunked request body over the actual byte limit before verification", async () => {
    const oversizedChunkedRequest = createChunkedContactRequest(
      JSON.stringify({
        ...validRequestBody,
        message: "x".repeat(32_768),
      }),
    );

    expect(oversizedChunkedRequest.headers.has("content-length")).toBe(false);

    const response = await handleContactRequest(
      oversizedChunkedRequest,
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["non-POST method", createContactRequest(validRequestBody, { method: "GET" }), 405],
    ["unexpected origin", createContactRequest(validRequestBody, { origin: "https://attacker.example" }), 403],
    ["unsupported content type", createContactRequest(validRequestBody, { contentType: "text/plain" }), 415],
    ["invalid request body", createContactRequest({ ...validRequestBody, extra: "bad" }), 400],
  ])("rejects %s without checking Turnstile or sending email", async (_label, request, expectedStatus) => {
    const response = await handleContactRequest(request, createWorkerEnvironment());

    expect(response.status).toBe(expectedStatus);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON without checking Turnstile or sending email", async () => {
    const response = await handleContactRequest(
      createMalformedJsonRequest(),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rejects missing Worker configuration without checking Turnstile or sending email", async () => {
    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      { ...createWorkerEnvironment(), TURNSTILE_SECRET: "" },
    );

    expect(response.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not send email when Turnstile rejects the token", async () => {
    fetchMock.mockResolvedValue(Response.json({ success: false }));

    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(403);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it.each([
    ["the hostname", { success: true, hostname: "attacker.example", action: "turnstile-spin-v2" }],
    ["the action", { success: true, hostname: "stardewvalleyplanner.art", action: "unexpected-action" }],
  ])("does not send email when Turnstile rejects %s", async (_label, verificationResult) => {
    fetchMock.mockResolvedValue(Response.json(verificationResult));

    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(403);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not send email when Turnstile verification fails to load", async () => {
    fetchMock.mockRejectedValue(new Error("Turnstile unavailable"));

    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(403);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns a delivery failure when Email Sending rejects the message", async () => {
    sendEmail.mockRejectedValue(new Error("Email Sending unavailable"));

    const response = await handleContactRequest(
      createContactRequest(validRequestBody),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(502);
  });

  it("serves a static document when a non-contact path reaches the Worker", async () => {
    fetchStaticAsset.mockResolvedValue(
      new Response("<!doctype html><title>Robin static document</title>", {
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
    );

    const response = await contactWorker.fetch(
      new Request(`${allowedOrigin}/where-is-robin-stardew-valley`),
      createWorkerEnvironment(),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    await expect(response.text()).resolves.toContain("Robin static document");
  });

  it("reports an unavailable static asset binding for a non-contact path", async () => {
    const workerEnvironmentWithoutStaticAssets = {
      ...createWorkerEnvironment(),
      STATIC_ASSETS: undefined,
    } as unknown as ContactWorkerEnvironment;

    const response = await contactWorker.fetch(
      new Request(`${allowedOrigin}/where-is-robin-stardew-valley`),
      workerEnvironmentWithoutStaticAssets as ContactWorkerEnvironment,
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "Static asset binding is unavailable.",
    });
  });
});
