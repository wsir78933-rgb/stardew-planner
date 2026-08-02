import { describe, expect, it } from "vitest";
import { getLegalPageCopy } from "../../src/legal/legal-page-copy";

describe("getLegalPageCopy", () => {
  it("returns the approved English privacy and terms headings", () => {
    expect(getLegalPageCopy("en", "privacy")).toMatchObject({
      title: "Privacy Policy",
      sections: [
        { heading: "What we collect" },
        { heading: "Farm data" },
        { heading: "Online features" },
        { heading: "Analytics" },
        { heading: "Cookies" },
        { heading: "Third parties" },
        { heading: "Data deletion" },
        { heading: "Local use" },
      ],
    });
    expect(getLegalPageCopy("en", "terms")).toMatchObject({
      title: "Terms of Service",
      sections: [
        { heading: "What this is" },
        { heading: "Accounts" },
        { heading: "Online features" },
        { heading: "Your data" },
        { heading: "Availability" },
        { heading: "Game assets" },
        { heading: "Local use" },
      ],
    });
  });

  it("returns the approved Chinese privacy title", () => {
    expect(getLegalPageCopy("zh-CN", "privacy").title).toBe("隐私政策");
  });

  it("rejects an unsupported locale with the rejected value", () => {
    expect(() => getLegalPageCopy("fr" as never, "privacy")).toThrow('"fr"');
  });

  it("rejects an unsupported page kind with the rejected value", () => {
    expect(() => getLegalPageCopy("en", "invalid-kind")).toThrow(
      '"invalid-kind"',
    );
  });
});
