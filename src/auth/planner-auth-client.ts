"use client";

import { createAuthClient } from "better-auth/react";

export type PlannerAccount = Readonly<{
  id: string;
  name: string;
  email: string;
  image: string | null;
}>;

export type PlannerSession = Readonly<{
  user: PlannerAccount | null;
}>;

export class CloudAuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CloudAuthError";
    this.code = code;
  }
}

const plannerAuthClient = createAuthClient({ baseURL: "/api/auth" });

export async function getPlannerSession(
  signal?: AbortSignal,
): Promise<PlannerSession> {
  let response: Response;
  try {
    response = await fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "same-origin",
      headers: { accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new CloudAuthError(
        "AUTH_NETWORK_ERROR",
        `Could not load the planner session: ${error.message}`,
      );
    }
    throw error;
  }

  const responseText = await response.text();
  const responseBody = parseSessionResponseBody(responseText, response.status);

  if (!response.ok) {
    const serverMessage = readServerMessage(responseBody);
    throw new CloudAuthError(
      "AUTH_REQUEST_FAILED",
      serverMessage ??
        `Could not load the planner session: HTTP ${String(response.status)} ${response.statusText}.`,
    );
  }

  return parsePlannerSession(responseBody);
}

export async function signInWithGoogle(): Promise<void> {
  if (typeof window === "undefined") {
    throw new CloudAuthError(
      "AUTH_BROWSER_REQUIRED",
      "Google sign-in requires a browser window.",
    );
  }

  try {
    const result = await plannerAuthClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href,
    });
    if (result.error) {
      throw new CloudAuthError(
        "GOOGLE_SIGN_IN_FAILED",
        result.error.message ?? "Google sign-in failed without a server message.",
      );
    }
  } catch (error) {
    if (error instanceof CloudAuthError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new CloudAuthError("GOOGLE_SIGN_IN_FAILED", error.message);
    }
    throw error;
  }
}

export async function signOutPlannerAccount(): Promise<void> {
  try {
    const result = await plannerAuthClient.signOut();
    if (result.error) {
      throw new CloudAuthError(
        "SIGN_OUT_FAILED",
        result.error.message ?? "Sign-out failed without a server message.",
      );
    }
  } catch (error) {
    if (error instanceof CloudAuthError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new CloudAuthError("SIGN_OUT_FAILED", error.message);
    }
    throw error;
  }
}

function parseSessionResponseBody(responseText: string, status: number): unknown {
  try {
    return JSON.parse(responseText) as unknown;
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    throw new CloudAuthError(
      "AUTH_INVALID_RESPONSE",
      `Planner session response for HTTP ${String(status)} is not valid JSON: ${error.message}.`,
    );
  }
}

function parsePlannerSession(rawSession: unknown): PlannerSession {
  const sessionRecord = requirePlainRecord(rawSession, "planner session");
  if (!("user" in sessionRecord)) {
    throw new CloudAuthError(
      "AUTH_INVALID_RESPONSE",
      `Planner session response must include user. Received keys: ${Object.keys(sessionRecord).join(", ")}.`,
    );
  }
  if (sessionRecord.user === null) {
    return { user: null };
  }

  const userRecord = requirePlainRecord(sessionRecord.user, "planner session user");
  const id = requireString(userRecord.id, "planner session user id");
  const name = requireString(userRecord.name, "planner session user name");
  const email = requireString(userRecord.email, "planner session user email");
  const image = userRecord.image;
  if (image !== null && typeof image !== "string") {
    throw new CloudAuthError(
      "AUTH_INVALID_RESPONSE",
      `Planner session user image must be a string or null. Received: ${describeValue(image)}.`,
    );
  }

  return { user: { id, name, email, image } };
}

function readServerMessage(rawResponse: unknown): string | null {
  if (
    typeof rawResponse !== "object" ||
    rawResponse === null ||
    Array.isArray(rawResponse)
  ) {
    return null;
  }
  const message = (rawResponse as Record<string, unknown>).message;
  return typeof message === "string" && message.length > 0 ? message : null;
}

function requirePlainRecord(
  rawValue: unknown,
  valueName: string,
): Record<string, unknown> {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue)
  ) {
    throw new CloudAuthError(
      "AUTH_INVALID_RESPONSE",
      `${valueName} must be an object. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue as Record<string, unknown>;
}

function requireString(rawValue: unknown, valueName: string): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new CloudAuthError(
      "AUTH_INVALID_RESPONSE",
      `${valueName} must be a non-empty string. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
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
