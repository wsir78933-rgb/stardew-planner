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
        { heading: "Contact messages" },
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
        { heading: "Contact messages" },
      ],
    });
  });

  it("returns the approved Chinese privacy title", () => {
    expect(getLegalPageCopy("zh-CN", "privacy").title).toBe("隐私政策");
  });

  it("discloses Cloudflare contact-message handling and the maximum retention period", () => {
    const englishContactSection = getLegalPageCopy("en", "privacy").sections.find(
      (section) => section.heading === "Contact messages",
    );
    const chineseContactSection = getLegalPageCopy(
      "zh-CN",
      "privacy",
    ).sections.find((section) => section.heading === "联系消息");

    expect(englishContactSection?.paragraphs).toEqual([
      expect.stringContaining("Cloudflare"),
    ]);
    expect(englishContactSection?.paragraphs.join(" ")).toContain(
      "no later than 90 days",
    );
    expect(chineseContactSection?.paragraphs.join(" ")).toContain("Cloudflare");
    expect(chineseContactSection?.paragraphs.join(" ")).toContain("最长保留 90 天");
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
