export const plannerFeedbackTypes = ["bug", "feature", "other"] as const;

export const plannerFeedbackLimits = {
  subject: 120,
  description: 2_000,
  turnstileToken: 2_048,
} as const;

export type PlannerFeedbackType = (typeof plannerFeedbackTypes)[number];

export type PlannerFeedbackFields = Readonly<{
  type: PlannerFeedbackType;
  subject: string;
  description: string;
}>;

export type PlannerFeedbackRequest = PlannerFeedbackFields &
  Readonly<{ turnstileToken: string }>;

export type PlannerFeedbackValidationField =
  | "form"
  | "type"
  | "subject"
  | "description"
  | "turnstileToken";

export type PlannerFeedbackValidationIssue = Readonly<{
  field: PlannerFeedbackValidationField;
  code:
    | "expectedObject"
    | "unexpectedField"
    | "missingField"
    | "invalidType"
    | "unsupportedOption"
    | "empty"
    | "tooLong"
    | "lineBreak"
    | "invalidToken";
  actualValue?: string;
}>;

export type PlannerFeedbackFieldsValidationResult =
  | Readonly<{ valid: true; value: PlannerFeedbackFields }>
  | Readonly<{
      valid: false;
      issues: readonly PlannerFeedbackValidationIssue[];
    }>;

export type PlannerFeedbackRequestValidationResult =
  | Readonly<{ valid: true; value: PlannerFeedbackRequest }>
  | Readonly<{
      valid: false;
      issues: readonly PlannerFeedbackValidationIssue[];
    }>;

const plannerFeedbackFieldNames = ["type", "subject", "description"] as const;
const plannerFeedbackRequestFieldNames = [
  ...plannerFeedbackFieldNames,
  "turnstileToken",
] as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describeReceivedValue(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  if (typeof value === "string") {
    return JSON.stringify(value.slice(0, 40));
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return typeof value;
}

function findUnexpectedField(
  receivedFields: readonly string[],
  allowedFields: readonly string[],
): string | undefined {
  return receivedFields.find((receivedField) => !allowedFields.includes(receivedField));
}

function createMissingFieldIssues(
  requestValue: Readonly<Record<string, unknown>>,
  requiredFields: readonly PlannerFeedbackValidationField[],
): PlannerFeedbackValidationIssue[] {
  return requiredFields
    .filter((requiredField) => !(requiredField in requestValue))
    .map((requiredField) => ({ field: requiredField, code: "missingField" }));
}

function isPlannerFeedbackType(value: unknown): value is PlannerFeedbackType {
  return plannerFeedbackTypes.includes(value as PlannerFeedbackType);
}

export function validatePlannerFeedbackFields(
  requestValue: unknown,
): PlannerFeedbackFieldsValidationResult {
  if (!isRecord(requestValue)) {
    return {
      valid: false,
      issues: [
        {
          field: "form",
          code: "expectedObject",
          actualValue: describeReceivedValue(requestValue),
        },
      ],
    };
  }

  const receivedFields = Object.keys(requestValue);
  const unexpectedField = findUnexpectedField(
    receivedFields,
    plannerFeedbackFieldNames,
  );
  if (unexpectedField) {
    return {
      valid: false,
      issues: [{ field: "form", code: "unexpectedField", actualValue: unexpectedField }],
    };
  }

  const missingFieldIssues = createMissingFieldIssues(
    requestValue,
    plannerFeedbackFieldNames,
  );
  if (missingFieldIssues.length > 0) {
    return { valid: false, issues: missingFieldIssues };
  }

  const issues: PlannerFeedbackValidationIssue[] = [];
  const receivedType = requestValue.type;
  if (typeof receivedType !== "string") {
    issues.push({
      field: "type",
      code: "invalidType",
      actualValue: describeReceivedValue(receivedType),
    });
  } else if (!isPlannerFeedbackType(receivedType)) {
    issues.push({
      field: "type",
      code: "unsupportedOption",
      actualValue: describeReceivedValue(receivedType),
    });
  }

  const receivedSubject = requestValue.subject;
  if (typeof receivedSubject !== "string") {
    issues.push({
      field: "subject",
      code: "invalidType",
      actualValue: describeReceivedValue(receivedSubject),
    });
  } else {
    const normalizedSubject = receivedSubject.trim();
    if (normalizedSubject.length === 0) {
      issues.push({ field: "subject", code: "empty", actualValue: "blank text" });
    } else if (/[\r\n]/.test(normalizedSubject)) {
      issues.push({ field: "subject", code: "lineBreak", actualValue: "line break" });
    } else if (normalizedSubject.length > plannerFeedbackLimits.subject) {
      issues.push({
        field: "subject",
        code: "tooLong",
        actualValue: `${normalizedSubject.length} characters`,
      });
    }
  }

  const receivedDescription = requestValue.description;
  if (typeof receivedDescription !== "string") {
    issues.push({
      field: "description",
      code: "invalidType",
      actualValue: describeReceivedValue(receivedDescription),
    });
  } else {
    const normalizedDescription = receivedDescription.trim();
    if (normalizedDescription.length === 0) {
      issues.push({
        field: "description",
        code: "empty",
        actualValue: "blank text",
      });
    } else if (normalizedDescription.length > plannerFeedbackLimits.description) {
      issues.push({
        field: "description",
        code: "tooLong",
        actualValue: `${normalizedDescription.length} characters`,
      });
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return {
    valid: true,
    value: {
      type: receivedType as PlannerFeedbackType,
      subject: (receivedSubject as string).trim(),
      description: (receivedDescription as string).trim(),
    },
  };
}

export function validatePlannerFeedbackRequest(
  requestValue: unknown,
): PlannerFeedbackRequestValidationResult {
  if (!isRecord(requestValue)) {
    return {
      valid: false,
      issues: [
        {
          field: "form",
          code: "expectedObject",
          actualValue: describeReceivedValue(requestValue),
        },
      ],
    };
  }

  const unexpectedField = findUnexpectedField(
    Object.keys(requestValue),
    plannerFeedbackRequestFieldNames,
  );
  if (unexpectedField) {
    return {
      valid: false,
      issues: [{ field: "form", code: "unexpectedField", actualValue: unexpectedField }],
    };
  }

  const missingFieldIssues = createMissingFieldIssues(
    requestValue,
    plannerFeedbackRequestFieldNames,
  );
  if (missingFieldIssues.length > 0) {
    return { valid: false, issues: missingFieldIssues };
  }

  const fieldsValidation = validatePlannerFeedbackFields({
    type: requestValue.type,
    subject: requestValue.subject,
    description: requestValue.description,
  });
  if (!fieldsValidation.valid) {
    return fieldsValidation;
  }

  const receivedToken = requestValue.turnstileToken;
  if (typeof receivedToken !== "string") {
    return {
      valid: false,
      issues: [
        {
          field: "turnstileToken",
          code: "invalidType",
          actualValue: describeReceivedValue(receivedToken),
        },
      ],
    };
  }

  const normalizedToken = receivedToken.trim();
  if (normalizedToken.length === 0) {
    return {
      valid: false,
      issues: [{ field: "turnstileToken", code: "invalidToken" }],
    };
  }

  if (normalizedToken.length > plannerFeedbackLimits.turnstileToken) {
    return {
      valid: false,
      issues: [
        {
          field: "turnstileToken",
          code: "tooLong",
          actualValue: `${normalizedToken.length} characters`,
        },
      ],
    };
  }

  return {
    valid: true,
    value: { ...fieldsValidation.value, turnstileToken: normalizedToken },
  };
}
