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

  it("explains optional cloud sync, Google sign-in, local previews, and independent deletion in both locales", () => {
    const englishPrivacyText = getLegalPageCopy("en", "privacy").sections
      .flatMap((section) => section.paragraphs)
      .join(" ");
    const chinesePrivacyText = getLegalPageCopy("zh-CN", "privacy").sections
      .flatMap((section) => section.paragraphs)
      .join(" ");
    const englishTermsText = getLegalPageCopy("en", "terms").sections
      .flatMap((section) => section.paragraphs)
      .join(" ");
    const chineseTermsText = getLegalPageCopy("zh-CN", "terms").sections
      .flatMap((section) => section.paragraphs)
      .join(" ");

    expect(englishPrivacyText).toContain("Google sign-in");
    expect(englishPrivacyText).toContain("Cloudflare D1");
    expect(englishPrivacyText).toContain("saving the current project syncs its layout");
    expect(englishPrivacyText).toContain("Existing local projects stay in this browser");
    expect(englishPrivacyText).toContain("Cloud copies remain until you delete them");
    expect(englishPrivacyText).toContain("map preview images stay on this device");
    expect(englishPrivacyText).toContain("deleting one copy does not delete the other");
    expect(chinesePrivacyText).toContain("Google 登录");
    expect(chinesePrivacyText).toContain("Cloudflare D1");
    expect(chinesePrivacyText).toContain("登录后点击保存会自动将当前项目布局同步");
    expect(chinesePrivacyText).toContain("已有本地项目仍保存在本地");
    expect(chinesePrivacyText).toContain("云端副本会一直保留到你主动删除");
    expect(chinesePrivacyText).toContain("地图预览图片仍保留在此设备上");
    expect(chinesePrivacyText).toContain("删除一份副本不会删除另一份");
    expect(englishTermsText).toContain("Google sign-in is optional");
    expect(chineseTermsText).toContain("Google 登录为可选功能");
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
