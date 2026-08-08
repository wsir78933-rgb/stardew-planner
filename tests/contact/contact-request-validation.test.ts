import { describe, expect, it } from "vitest";
import { validateContactRequest } from "../../src/contact/contact-request-validation";

describe("validateContactRequest", () => {
  it("normalizes a complete contact request", () => {
    expect(
      validateContactRequest({
        name: "  Jane Farmer ",
        email: " JANE@EXAMPLE.COM ",
        message: "  Please add a feature.  ",
        turnstileToken: "turnstile-token",
      }),
    ).toEqual({
      valid: true,
      value: {
        name: "Jane Farmer",
        email: "jane@example.com",
        message: "Please add a feature.",
        turnstileToken: "turnstile-token",
      },
    });
  });

  it("allows a multi-line message while keeping email headers single-line", () => {
    expect(
      validateContactRequest({
        name: "Jane Farmer",
        email: "jane@example.com",
        message: "First detail.\nSecond detail.",
        turnstileToken: "turnstile-token",
      }),
    ).toMatchObject({ valid: true });
  });

  it.each([
    ["unknown fields", { name: "Jane", email: "jane@example.com", message: "Hello", turnstileToken: "token", extra: "not allowed" }],
    ["invalid email", { name: "Jane", email: "not-an-email", message: "Hello", turnstileToken: "token" }],
    ["empty message", { name: "Jane", email: "jane@example.com", message: "   ", turnstileToken: "token" }],
    ["header injection", { name: "Jane\r\nBcc: victim@example.com", email: "jane@example.com", message: "Hello", turnstileToken: "token" }],
  ])("rejects %s", (_label, requestValue) => {
    expect(validateContactRequest(requestValue)).toEqual({ valid: false });
  });
});
