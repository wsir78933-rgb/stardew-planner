import { describe, expect, it } from "vitest";
import {
  plannerFeedbackLimits,
  validatePlannerFeedbackFields,
  validatePlannerFeedbackRequest,
} from "../../src/contact/planner-feedback-request-validation";

const validPlannerFeedbackRequest = {
  type: "feature",
  subject: "  Add a greenhouse filter  ",
  description: "  Please add a filter.\nScreenshot: https://example.com/farm.png  ",
  turnstileToken: " turnstile-token ",
};

describe("validatePlannerFeedbackFields", () => {
  it.each(["bug", "feature", "other"] as const)(
    "accepts and normalizes the %s feedback type",
    (type) => {
      expect(
        validatePlannerFeedbackFields({
          type,
          subject: "  Planner feedback  ",
          description: "  First line.\nSecond line.  ",
        }),
      ).toEqual({
        valid: true,
        value: {
          type,
          subject: "Planner feedback",
          description: "First line.\nSecond line.",
        },
      });
    },
  );

  it("rejects an email field so the planner form cannot submit visitor email", () => {
    expect(
      validatePlannerFeedbackFields({
        type: "bug",
        subject: "Planner feedback",
        description: "The planner is not saving.",
        email: "visitor@example.com",
      }),
    ).toEqual({
      valid: false,
      issues: [
        {
          field: "form",
          code: "unexpectedField",
          actualValue: "email",
        },
      ],
    });
  });

  it.each([
    ["unsupported feedback type", { ...validPlannerFeedbackRequest, type: "billing" }, "type", "unsupportedOption"],
    ["missing subject", { ...validPlannerFeedbackRequest, subject: "  " }, "subject", "empty"],
    ["multiline subject", { ...validPlannerFeedbackRequest, subject: "One\nTwo" }, "subject", "lineBreak"],
    [
      "long subject",
      { ...validPlannerFeedbackRequest, subject: "s".repeat(plannerFeedbackLimits.subject + 1) },
      "subject",
      "tooLong",
    ],
    ["empty description", { ...validPlannerFeedbackRequest, description: " \n " }, "description", "empty"],
    [
      "long description",
      { ...validPlannerFeedbackRequest, description: "d".repeat(plannerFeedbackLimits.description + 1) },
      "description",
      "tooLong",
    ],
  ])("rejects %s and names the invalid field", (_label, requestValue, field, code) => {
    const result = validatePlannerFeedbackRequest(requestValue);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.issues).toContainEqual({
        field,
        code,
        ...(code === "tooLong"
          ? {
              actualValue:
                field === "subject"
                  ? `${plannerFeedbackLimits.subject + 1} characters`
                  : `${plannerFeedbackLimits.description + 1} characters`,
            }
          : {}),
        ...(code === "unsupportedOption" ? { actualValue: '"billing"' } : {}),
        ...(code === "empty" ? { actualValue: "blank text" } : {}),
        ...(code === "lineBreak" ? { actualValue: "line break" } : {}),
      });
    }
  });
});

describe("validatePlannerFeedbackRequest", () => {
  it("normalizes the anonymous request and preserves links in the description", () => {
    expect(validatePlannerFeedbackRequest(validPlannerFeedbackRequest)).toEqual({
      valid: true,
      value: {
        type: "feature",
        subject: "Add a greenhouse filter",
        description: "Please add a filter.\nScreenshot: https://example.com/farm.png",
        turnstileToken: "turnstile-token",
      },
    });
  });

  it.each([
    ["email", { ...validPlannerFeedbackRequest, email: "visitor@example.com" }],
    ["name", { ...validPlannerFeedbackRequest, name: "Visitor" }],
    ["separate media link", { ...validPlannerFeedbackRequest, mediaLink: "https://example.com" }],
  ])("rejects an unknown %s field", (_label, requestValue) => {
    const result = validatePlannerFeedbackRequest(requestValue);

    expect(result).toEqual({
      valid: false,
      issues: [
        {
          field: "form",
          code: "unexpectedField",
          actualValue: _label === "separate media link" ? "mediaLink" : _label,
        },
      ],
    });
  });

  it("rejects an absent verification token without exposing token contents", () => {
    const result = validatePlannerFeedbackRequest({
      type: "bug",
      subject: "No token",
      description: "The request did not include verification.",
      turnstileToken: "  ",
    });

    expect(result).toEqual({
      valid: false,
      issues: [{ field: "turnstileToken", code: "invalidToken" }],
    });
    expect(JSON.stringify(result)).not.toContain("turnstile-token");
  });

  it("reports missing fields and invalid top-level values", () => {
    expect(validatePlannerFeedbackRequest({ type: "bug" })).toEqual({
      valid: false,
      issues: [
        { field: "subject", code: "missingField" },
        { field: "description", code: "missingField" },
        { field: "turnstileToken", code: "missingField" },
      ],
    });
    expect(validatePlannerFeedbackRequest(null)).toEqual({
      valid: false,
      issues: [
        { field: "form", code: "expectedObject", actualValue: "null" },
      ],
    });
  });
});
