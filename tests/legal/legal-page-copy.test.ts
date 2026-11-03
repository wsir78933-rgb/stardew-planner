import { describe, expect, it } from "vitest";
import { getLegalPageCopy } from "../../src/legal/legal-page-copy";

describe("getLegalPageCopy", () => {
  it("returns the approved English privacy and terms headings", () => {
    expect(getLegalPageCopy("en", "privacy")).toMatchObject({
      title: "Privacy Policy",
      sections: [
        { heading: "What we collect" },
        { heading: "Farm data" },
        { heading: "Analytics" },
        { heading: "Advertising" },
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

  it("asserts local-only storage with no Google sign-in, D1, or sync, and discloses GA4/Clarity in both locales", () => {
    const englishPrivacyCopy = getLegalPageCopy("en", "privacy");
    const englishPrivacyText = [
      englishPrivacyCopy.description,
      ...englishPrivacyCopy.sections.flatMap((section) => section.paragraphs),
    ]
      .join(" ");
    const chinesePrivacyCopy = getLegalPageCopy("zh-CN", "privacy");
    const chinesePrivacyText = [
      chinesePrivacyCopy.description,
      ...chinesePrivacyCopy.sections.flatMap((section) => section.paragraphs),
    ]
      .join(" ");
    const englishTermsCopy = getLegalPageCopy("en", "terms");
    const englishTermsText = [
      englishTermsCopy.description,
      ...englishTermsCopy.sections.flatMap((section) => section.paragraphs),
    ]
      .join(" ");
    const chineseTermsCopy = getLegalPageCopy("zh-CN", "terms");
    const chineseTermsText = [
      chineseTermsCopy.description,
      ...chineseTermsCopy.sections.flatMap((section) => section.paragraphs),
    ]
      .join(" ");

    // Local-only: projects stay in the browser, never uploaded or synced
    expect(englishPrivacyText).toContain("does not offer upload or cloud sync");
    expect(chinesePrivacyText).toContain("不提供上传或云端同步");
    expect(englishTermsText).toContain("does not offer project upload or cloud synchronization");
    expect(chineseTermsText).toContain("不提供项目上传或云端同步");

    // Absence: no first-party sign-in, account, cloud sync, or D1 claims
    expect(englishPrivacyText).not.toContain("Google sign-in");
    expect(englishPrivacyText).not.toContain("Cloudflare D1");
    expect(englishPrivacyText).not.toContain("syncs its layout");
    expect(englishPrivacyText).not.toContain("projects you choose to sync");
    expect(chinesePrivacyText).not.toContain("Google 登录");
    expect(chinesePrivacyText).not.toContain("Cloudflare D1");
    expect(chinesePrivacyText).not.toContain("同步到本站");
    expect(englishTermsText).not.toContain("Google sign-in");
    expect(chineseTermsText).not.toContain("Google 登录");

    // Analytics disclosure: GA4 and Clarity are active; no false denial
    expect(englishPrivacyText).toContain("G-SEKQT6DTT1");
    expect(englishPrivacyText).toContain("xwledpd5pa");
    expect(englishPrivacyText).toContain("page_view");
    expect(englishPrivacyText).toContain("clicks, scrolling, and pointer movement");
    expect(englishPrivacyText).toContain("session recordings and generate heatmaps");
    expect(englishPrivacyText).toContain("depends on Clarity's masking settings");
    expect(englishPrivacyText).toContain("may set measurement cookies");
    expect(englishPrivacyText).not.toContain("No sign-in session or advertising cookies are used");
    expect(englishPrivacyText).toContain("Google AdSense");
    expect(englishPrivacyText).toContain("This site uses Google AdSense to show ads.");
    expect(englishPrivacyText).not.toContain("not currently enabled");
    expect(englishPrivacyText).toContain(
      "ad technology providers selected for this site",
    );
    expect(englishPrivacyText).toContain("personalized advertising");
    expect(englishPrivacyText).toContain("advertising cookies");
    expect(englishPrivacyText).toContain(
      "Google AdSense and selected ad technology providers may also use",
    );
    expect(englishPrivacyText).toContain("Manage Google personalized advertising at");
    expect(chinesePrivacyText).toContain("G-SEKQT6DTT1");
    expect(chinesePrivacyText).toContain("xwledpd5pa");
    expect(chinesePrivacyText).toContain("page_view");
    expect(chinesePrivacyText).toContain("点击、滚动和指针移动");
    expect(chinesePrivacyText).toContain("重建会话回放、生成热图");
    expect(chinesePrivacyText).toContain("受 Clarity 项目的屏蔽设置影响");
    expect(chinesePrivacyText).toContain("脚本运行时可能会设置测量 Cookie");
    expect(englishPrivacyText).toContain(
      "does not send saved project JSON as custom analytics events",
    );
    expect(englishPrivacyText).toContain(
      "project names or content visible on a page may be captured",
    );
    expect(englishPrivacyText).toContain(
      "masking configuration for this site has not been verified",
    );
    expect(englishPrivacyText).not.toContain(
      "does not send project data to these analytics providers",
    );
    expect(chinesePrivacyText).toContain(
      "不会将已保存的项目 JSON 作为自定义分析事件发送",
    );
    expect(chinesePrivacyText).toContain(
      "页面上可见的项目名称或内容可能会根据 Clarity 项目的屏蔽设置被捕获",
    );
    expect(chinesePrivacyText).toContain("本站当前的屏蔽配置尚未核实");
    expect(chinesePrivacyText).not.toContain(
      "当前规划器界面不会向这两家分析服务商发送项目数据",
    );
    expect(chinesePrivacyText).not.toContain("本站不使用登录会话 Cookie");
    expect(chinesePrivacyText).toContain("Google AdSense");
    expect(chinesePrivacyText).toContain("本站使用 Google AdSense 投放广告。");
    expect(chinesePrivacyText).not.toContain("尚未启用");
    expect(chinesePrivacyText).toContain("为本站选定的广告技术提供商");
    expect(chinesePrivacyText).toContain("个性化广告");
    expect(chinesePrivacyText).toContain("广告 Cookie");
    expect(chinesePrivacyText).toContain("Google AdSense 和选定的广告技术提供商也可能使用");
    expect(chinesePrivacyText).toContain("管理 Google 个性化广告");
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
