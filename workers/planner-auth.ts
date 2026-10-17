import { betterAuth } from "better-auth";

export type PlannerAuthEnvironment = Readonly<{
  AUTH_ALLOWED_ORIGINS?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  DB?: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}>;

export type PlannerSessionUser = Readonly<{
  email: string;
  id: string;
  image: string | null;
  name: string;
}>;

export type PlannerSessionLookup =
  | Readonly<{
      kind: "available";
      user: PlannerSessionUser | null;
      userId: string | null;
    }>
  | Readonly<{
      kind: "unavailable";
      response: Response;
    }>;

type PlannerAuthSettings = Readonly<{
  allowedOrigins: readonly string[];
  baseURL: string;
  database: D1Database;
  googleClientId: string;
  googleClientSecret: string;
  secret: string;
  secureCookies: boolean;
}>;

type PlannerAuthSettingsResult =
  | Readonly<{ kind: "ready"; settings: PlannerAuthSettings }>
  | Readonly<{ kind: "invalid"; message: string }>;

const authBasePath = "/api/auth";
const minimumSecretLength = 32;

function createJsonResponse(status: number, message: string): Response {
  return Response.json(
    { message },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isD1Binding(value: unknown): value is D1Database {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const databaseMethods = value as Readonly<Record<string, unknown>>;
  return (
    typeof databaseMethods.batch === "function" &&
    typeof databaseMethods.exec === "function" &&
    typeof databaseMethods.prepare === "function"
  );
}

function parseExactOrigin(
  originValue: string,
  configurationName: string,
): Readonly<{ kind: "valid"; origin: string }> | Readonly<{ kind: "invalid"; message: string }> {
  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(originValue);
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
    return {
      kind: "invalid",
      message: `${configurationName} value ${JSON.stringify(originValue)} must be an absolute HTTP(S) origin.`,
    };
  }

  if (
    (parsedOrigin.protocol !== "http:" && parsedOrigin.protocol !== "https:") ||
    parsedOrigin.username.length > 0 ||
    parsedOrigin.password.length > 0 ||
    parsedOrigin.pathname !== "/" ||
    parsedOrigin.search.length > 0 ||
    parsedOrigin.hash.length > 0
  ) {
    return {
      kind: "invalid",
      message: `${configurationName} value ${JSON.stringify(originValue)} must be an HTTP(S) origin without a path, query, or fragment.`,
    };
  }

  return { kind: "valid", origin: parsedOrigin.origin };
}

function parseAllowedOrigins(
  configuredOrigins: string,
): Readonly<{ kind: "valid"; origins: readonly string[] }> | Readonly<{ kind: "invalid"; message: string }> {
  const originValues = configuredOrigins
    .split(",")
    .map((originValue) => originValue.trim());
  if (originValues.length === 0 || originValues.some((originValue) => originValue.length === 0)) {
    return {
      kind: "invalid",
      message: `AUTH_ALLOWED_ORIGINS value ${JSON.stringify(configuredOrigins)} must contain comma-separated absolute HTTP(S) origins.`,
    };
  }

  const parsedOrigins: string[] = [];
  for (const originValue of originValues) {
    const parsedOrigin = parseExactOrigin(originValue, "AUTH_ALLOWED_ORIGINS");
    if (parsedOrigin.kind === "invalid") {
      return parsedOrigin;
    }
    parsedOrigins.push(parsedOrigin.origin);
  }

  return { kind: "valid", origins: [...new Set(parsedOrigins)] };
}

function validatePlannerAuthSettings(
  environment: PlannerAuthEnvironment,
): PlannerAuthSettingsResult {
  const configuredValues = {
    database: environment.DB,
    secret: environment.BETTER_AUTH_SECRET,
    googleClientId: environment.GOOGLE_CLIENT_ID,
    googleClientSecret: environment.GOOGLE_CLIENT_SECRET,
    baseURL: environment.BETTER_AUTH_URL,
    allowedOrigins: environment.AUTH_ALLOWED_ORIGINS,
  };
  const missingSettings: string[] = [];
  if (!isD1Binding(configuredValues.database)) missingSettings.push("DB");
  if (!isNonEmptyString(configuredValues.secret)) {
    missingSettings.push("BETTER_AUTH_SECRET");
  }
  if (!isNonEmptyString(configuredValues.googleClientId)) {
    missingSettings.push("GOOGLE_CLIENT_ID");
  }
  if (!isNonEmptyString(configuredValues.googleClientSecret)) {
    missingSettings.push("GOOGLE_CLIENT_SECRET");
  }
  if (!isNonEmptyString(configuredValues.baseURL)) {
    missingSettings.push("BETTER_AUTH_URL");
  }
  if (!isNonEmptyString(configuredValues.allowedOrigins)) {
    missingSettings.push("AUTH_ALLOWED_ORIGINS");
  }

  if (
    missingSettings.length > 0 ||
    !isD1Binding(configuredValues.database) ||
    !isNonEmptyString(configuredValues.secret) ||
    !isNonEmptyString(configuredValues.googleClientId) ||
    !isNonEmptyString(configuredValues.googleClientSecret) ||
    !isNonEmptyString(configuredValues.baseURL) ||
    !isNonEmptyString(configuredValues.allowedOrigins)
  ) {
    return {
      kind: "invalid",
      message: `Cloud authentication is not configured. Missing or invalid settings: ${missingSettings.join(", ")}.`,
    };
  }

  if (configuredValues.secret.length < minimumSecretLength) {
    return {
      kind: "invalid",
      message: `BETTER_AUTH_SECRET has length ${configuredValues.secret.length}; provide at least ${minimumSecretLength} characters.`,
    };
  }

  const parsedBaseURL = parseExactOrigin(
    configuredValues.baseURL,
    "BETTER_AUTH_URL",
  );
  if (parsedBaseURL.kind === "invalid") {
    return parsedBaseURL;
  }

  const parsedOrigins = parseAllowedOrigins(configuredValues.allowedOrigins);
  if (parsedOrigins.kind === "invalid") {
    return parsedOrigins;
  }
  if (!parsedOrigins.origins.includes(parsedBaseURL.origin)) {
    return {
      kind: "invalid",
      message: `BETTER_AUTH_URL origin ${JSON.stringify(parsedBaseURL.origin)} is not listed in AUTH_ALLOWED_ORIGINS value ${JSON.stringify(configuredValues.allowedOrigins)}.`,
    };
  }

  return {
    kind: "ready",
    settings: {
      allowedOrigins: parsedOrigins.origins,
      baseURL: parsedBaseURL.origin,
      database: configuredValues.database,
      googleClientId: configuredValues.googleClientId,
      googleClientSecret: configuredValues.googleClientSecret,
      secret: configuredValues.secret,
      secureCookies: parsedBaseURL.origin.startsWith("https://"),
    },
  };
}

function createPlannerAuth(settings: PlannerAuthSettings) {
  return betterAuth({
    baseURL: settings.baseURL,
    basePath: authBasePath,
    secret: settings.secret,
    database: settings.database,
    trustedOrigins: [...settings.allowedOrigins],
    socialProviders: {
      google: {
        clientId: settings.googleClientId,
        clientSecret: settings.googleClientSecret,
      },
    },
    advanced: {
      useSecureCookies: settings.secureCookies,
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: settings.secureCookies,
      },
    },
  });
}

type PlannerAuthContext = ReturnType<typeof createPlannerAuth>;

function getPlannerAuthContext(
  environment: PlannerAuthEnvironment,
):
  | Readonly<{ kind: "ready"; auth: PlannerAuthContext }>
  | Readonly<{ kind: "unavailable"; response: Response }> {
  const settingsResult = validatePlannerAuthSettings(environment);
  if (settingsResult.kind === "invalid") {
    return {
      kind: "unavailable",
      response: createJsonResponse(503, settingsResult.message),
    };
  }

  return {
    kind: "ready",
    auth: createPlannerAuth(settingsResult.settings),
  };
}

function readSessionUser(value: unknown): PlannerSessionUser {
  if (value === null || typeof value !== "object") {
    throw new TypeError(`Better Auth session user value ${JSON.stringify(value)} is not an object.`);
  }

  const sessionUser = value as Readonly<Record<string, unknown>>;
  for (const fieldName of ["id", "name", "email"] as const) {
    const fieldValue = sessionUser[fieldName];
    if (!isNonEmptyString(fieldValue)) {
      throw new TypeError(
        `Better Auth session user.${fieldName} value ${JSON.stringify(fieldValue)} must be a non-empty string.`,
      );
    }
  }

  const imageValue = sessionUser.image;
  if (imageValue !== undefined && imageValue !== null && typeof imageValue !== "string") {
    throw new TypeError(
      `Better Auth session user.image value ${JSON.stringify(imageValue)} must be a string or null.`,
    );
  }

  return {
    id: sessionUser.id as string,
    name: sessionUser.name as string,
    email: sessionUser.email as string,
    image: typeof imageValue === "string" ? imageValue : null,
  };
}

async function lookupPlannerSessionUser(
  auth: PlannerAuthContext,
  request: Request,
): Promise<PlannerSessionLookup> {
  const sessionResult = await auth.api.getSession({ headers: request.headers });
  if (sessionResult === null) {
    return { kind: "available", user: null, userId: null };
  }

  const user = readSessionUser(sessionResult.user);
  return { kind: "available", user, userId: user.id };
}

function createNoStoreResponse(response: Response): Response {
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

function isAllowedAuthRequest(request: Request): boolean {
  const requestPath = new URL(request.url).pathname;
  const requestMethod = request.method.toUpperCase();
  return (
    (requestPath === `${authBasePath}/get-session` && requestMethod === "GET") ||
    (requestPath === `${authBasePath}/sign-in/social` && requestMethod === "POST") ||
    (requestPath === `${authBasePath}/callback/google` && requestMethod === "GET") ||
    (requestPath === `${authBasePath}/sign-out` && requestMethod === "POST")
  );
}

export async function getPlannerSession(
  request: Request,
  environment: PlannerAuthEnvironment,
): Promise<PlannerSessionLookup> {
  const authContext = getPlannerAuthContext(environment);
  if (authContext.kind === "unavailable") {
    return { kind: "unavailable", response: authContext.response };
  }

  return lookupPlannerSessionUser(authContext.auth, request);
}

export function validatePlannerMutationOrigin(
  request: Request,
  environment: PlannerAuthEnvironment,
): Response | null {
  if (!isNonEmptyString(environment.AUTH_ALLOWED_ORIGINS)) {
    return createJsonResponse(
      503,
      "Cloud authentication is not configured. Missing or invalid settings: AUTH_ALLOWED_ORIGINS.",
    );
  }

  const allowedOrigins = parseAllowedOrigins(environment.AUTH_ALLOWED_ORIGINS);
  if (allowedOrigins.kind === "invalid") {
    return createJsonResponse(503, allowedOrigins.message);
  }

  const requestOrigin = request.headers.get("origin");
  if (requestOrigin === null) {
    return createJsonResponse(403, "Request Origin value null is not allowed for cloud mutations.");
  }

  const parsedRequestOrigin = parseExactOrigin(requestOrigin, "Request Origin");
  if (
    parsedRequestOrigin.kind === "invalid" ||
    parsedRequestOrigin.origin !== requestOrigin ||
    !allowedOrigins.origins.includes(requestOrigin)
  ) {
    return createJsonResponse(
      403,
      parsedRequestOrigin.kind === "invalid"
        ? parsedRequestOrigin.message
        : `Request Origin value ${JSON.stringify(requestOrigin)} is not allowed for cloud mutations.`,
    );
  }

  return null;
}

export async function handlePlannerAuthRequest(
  request: Request,
  environment: PlannerAuthEnvironment,
): Promise<Response> {
  if (!isAllowedAuthRequest(request)) {
    return createJsonResponse(404, "Authentication endpoint is unavailable.");
  }

  const authContext = getPlannerAuthContext(environment);
  if (authContext.kind === "unavailable") {
    return authContext.response;
  }

  if (new URL(request.url).pathname === `${authBasePath}/get-session`) {
    const sessionLookup = await lookupPlannerSessionUser(authContext.auth, request);
    if (sessionLookup.kind === "unavailable") {
      return sessionLookup.response;
    }
    return Response.json(
      { user: sessionLookup.user },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return createNoStoreResponse(await authContext.auth.handler(request));
}
