export const contactRequestLimits = {
  name: 100,
  email: 254,
  message: 2_000,
  turnstileToken: 2_048,
} as const;

export type ContactRequest = Readonly<{
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
}>;

export type ContactRequestValidationResult =
  | Readonly<{ valid: true; value: ContactRequest }>
  | Readonly<{ valid: false }>;

const contactRequestFields = [
  "name",
  "email",
  "message",
  "turnstileToken",
] as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeText(value: string, maximumLength: number): boolean {
  return (
    value.length > 0 &&
    value.length <= maximumLength &&
    !/[\r\n]/.test(value)
  );
}

function isValidMessage(value: string): boolean {
  return value.length > 0 && value.length <= contactRequestLimits.message;
}

function isValidEmailAddress(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactRequest(
  requestValue: unknown,
): ContactRequestValidationResult {
  if (!isRecord(requestValue)) {
    return { valid: false };
  }

  const receivedFields = Object.keys(requestValue);
  if (
    receivedFields.length !== contactRequestFields.length ||
    receivedFields.some(
      (receivedField) =>
        !contactRequestFields.includes(
          receivedField as (typeof contactRequestFields)[number],
        ),
    )
  ) {
    return { valid: false };
  }

  const { name, email, message, turnstileToken } = requestValue;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof turnstileToken !== "string"
  ) {
    return { valid: false };
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMessage = message.trim();
  const normalizedTurnstileToken = turnstileToken.trim();

  if (
    !isSafeText(normalizedName, contactRequestLimits.name) ||
    !isSafeText(normalizedEmail, contactRequestLimits.email) ||
    !isValidMessage(normalizedMessage) ||
    !isSafeText(normalizedTurnstileToken, contactRequestLimits.turnstileToken) ||
    !isValidEmailAddress(normalizedEmail)
  ) {
    return { valid: false };
  }

  return {
    valid: true,
    value: {
      name: normalizedName,
      email: normalizedEmail,
      message: normalizedMessage,
      turnstileToken: normalizedTurnstileToken,
    },
  };
}
