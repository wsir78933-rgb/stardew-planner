import { validateContactRequest } from "../src/contact/contact-request-validation";

type ContactEmailMessage = Readonly<{
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  text: string;
}>;

type TurnstileVerificationResult = Readonly<{
  success?: unknown;
  hostname?: unknown;
  action?: unknown;
}>;

type StaticAssetsBinding = Readonly<{
  fetch: (request: Request) => Promise<Response>;
}>;

export type ContactWorkerEnvironment = Readonly<{
  CONTACT_ALLOWED_ORIGIN: string;
  CONTACT_EXPECTED_TURNSTILE_HOSTNAME: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_RECIPIENT_EMAIL: string;
  CONTACT_TURNSTILE_ACTION: string;
  TURNSTILE_SECRET: string;
  CONTACT_EMAIL: Readonly<{
    send: (message: ContactEmailMessage) => Promise<void>;
  }>;
  STATIC_ASSETS: StaticAssetsBinding;
}>;

const maximumRequestBytes = 16_384;

type RequestTextReadResult =
  | Readonly<{ kind: "success"; text: string }>
  | Readonly<{ kind: "invalid" | "too-large" }>;

function createJsonResponse(status: number, message: string): Response {
  return Response.json(
    { message },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}

function hasRequiredConfiguration(environment: ContactWorkerEnvironment): boolean {
  const requiredValues = [
    environment.CONTACT_ALLOWED_ORIGIN,
    environment.CONTACT_EXPECTED_TURNSTILE_HOSTNAME,
    environment.CONTACT_FROM_EMAIL,
    environment.CONTACT_RECIPIENT_EMAIL,
    environment.CONTACT_TURNSTILE_ACTION,
    environment.TURNSTILE_SECRET,
  ];

  return (
    requiredValues.every(
      (requiredValue) =>
        typeof requiredValue === "string" && requiredValue.trim().length > 0,
    ) && typeof environment.CONTACT_EMAIL?.send === "function"
  );
}

function hasSupportedContentType(request: Request): boolean {
  return request.headers
    .get("content-type")
    ?.toLowerCase()
    .startsWith("application/json") ?? false;
}

function exceedsDeclaredRequestLimit(request: Request): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) {
    return false;
  }

  const requestedBytes = Number(contentLength);
  return !Number.isSafeInteger(requestedBytes) || requestedBytes > maximumRequestBytes;
}

async function readRequestText(request: Request): Promise<RequestTextReadResult> {
  if (!request.body) {
    return { kind: "invalid" };
  }

  const requestBodyReader = request.body.getReader();
  const requestBodyChunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await requestBodyReader.read();
      if (done) {
        break;
      }

      receivedBytes += value.byteLength;
      if (receivedBytes > maximumRequestBytes) {
        return { kind: "too-large" };
      }

      requestBodyChunks.push(value);
    }
  } catch {
    return { kind: "invalid" };
  } finally {
    requestBodyReader.releaseLock();
  }

  const requestBody = new Uint8Array(receivedBytes);
  let writeOffset = 0;
  for (const requestBodyChunk of requestBodyChunks) {
    requestBody.set(requestBodyChunk, writeOffset);
    writeOffset += requestBodyChunk.byteLength;
  }

  return { kind: "success", text: new TextDecoder().decode(requestBody) };
}

function isValidTurnstileVerification(
  verificationResult: TurnstileVerificationResult,
  environment: ContactWorkerEnvironment,
): boolean {
  return (
    verificationResult.success === true &&
    verificationResult.hostname === environment.CONTACT_EXPECTED_TURNSTILE_HOSTNAME &&
    verificationResult.action === environment.CONTACT_TURNSTILE_ACTION
  );
}

async function verifyTurnstile(
  turnstileToken: string,
  clientIp: string | undefined,
  environment: ContactWorkerEnvironment,
): Promise<boolean> {
  const verificationBody = new FormData();
  verificationBody.set("secret", environment.TURNSTILE_SECRET);
  verificationBody.set("response", turnstileToken);
  if (clientIp) {
    verificationBody.set("remoteip", clientIp);
  }

  try {
    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: verificationBody,
      },
    );

    if (!verificationResponse.ok) {
      return false;
    }

    const verificationResult =
      (await verificationResponse.json()) as TurnstileVerificationResult;
    return isValidTurnstileVerification(verificationResult, environment);
  } catch {
    return false;
  }
}

function getClientIp(request: Request): string | undefined {
  const cloudflareClientIp = request.headers.get("cf-connecting-ip")?.trim();
  return cloudflareClientIp || undefined;
}

function createContactEmailMessage(
  contactRequest: Readonly<{
    name: string;
    email: string;
    message: string;
  }>,
  environment: ContactWorkerEnvironment,
): ContactEmailMessage {
  return {
    from: environment.CONTACT_FROM_EMAIL,
    to: environment.CONTACT_RECIPIENT_EMAIL,
    subject: `New contact message from ${contactRequest.name}`,
    replyTo: contactRequest.email,
    text: `Name: ${contactRequest.name}\nEmail: ${contactRequest.email}\n\n${contactRequest.message}`,
  };
}

function parseRequestJson(requestText: string): unknown {
  try {
    return JSON.parse(requestText);
  } catch {
    return undefined;
  }
}

export async function handleContactRequest(
  request: Request,
  environment: ContactWorkerEnvironment,
): Promise<Response> {
  if (request.method !== "POST") {
    return createJsonResponse(405, "Method not allowed.");
  }

  if (request.headers.get("origin") !== environment.CONTACT_ALLOWED_ORIGIN) {
    return createJsonResponse(403, "Request origin is not allowed.");
  }

  if (!hasSupportedContentType(request)) {
    return createJsonResponse(415, "Expected an application/json request.");
  }

  if (exceedsDeclaredRequestLimit(request)) {
    return createJsonResponse(413, "Request body is too large.");
  }

  if (!hasRequiredConfiguration(environment)) {
    return createJsonResponse(500, "Contact delivery is not configured.");
  }

  const requestTextReadResult = await readRequestText(request);
  if (requestTextReadResult.kind === "too-large") {
    return createJsonResponse(413, "Request body is too large.");
  }

  const validationResult = validateContactRequest(
    requestTextReadResult.kind === "success"
      ? parseRequestJson(requestTextReadResult.text)
      : undefined,
  );
  if (!validationResult.valid) {
    return createJsonResponse(400, "Contact request is invalid.");
  }

  const isTurnstileValid = await verifyTurnstile(
    validationResult.value.turnstileToken,
    getClientIp(request),
    environment,
  );
  if (!isTurnstileValid) {
    return createJsonResponse(403, "Spam verification failed.");
  }

  try {
    await environment.CONTACT_EMAIL.send(
      createContactEmailMessage(validationResult.value, environment),
    );
  } catch {
    return createJsonResponse(502, "Contact delivery failed.");
  }

  return createJsonResponse(202, "Contact message accepted.");
}

function isContactApiRequest(request: Request): boolean {
  return new URL(request.url).pathname === "/api/contact";
}

function serveStaticAsset(
  request: Request,
  environment: ContactWorkerEnvironment,
): Promise<Response> {
  if (typeof environment.STATIC_ASSETS?.fetch !== "function") {
    return Promise.resolve(
      createJsonResponse(500, "Static asset binding is unavailable."),
    );
  }

  return environment.STATIC_ASSETS.fetch(request);
}

function handleWorkerRequest(
  request: Request,
  environment: ContactWorkerEnvironment,
): Promise<Response> {
  if (isContactApiRequest(request)) {
    return handleContactRequest(request, environment);
  }

  return serveStaticAsset(request, environment);
}

const stardewPlannerWorker = {
  fetch: handleWorkerRequest,
};

export default stardewPlannerWorker;
