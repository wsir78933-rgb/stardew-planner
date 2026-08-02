import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlannerPage from "../../app/(en)/page";
import { HomepageContent } from "../../src/components/homepage-content";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";
import { officialFarmTypes } from "../../src/reference/official-farm-guides";

describe("planner editor page", () => {
  it("keeps the frozen reference client out of the static homepage markup", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup).toContain("data-homepage-shell");
    expect(plannerPageMarkup).toContain("data-homepage-header");
    expect(plannerPageMarkup).toContain("data-homepage-hero");
    expect(plannerPageMarkup).toContain("data-homepage-hero-emphasis");
    expect(plannerPageMarkup).toContain("data-homepage-workspace");
    expect(plannerPageMarkup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(plannerPageMarkup).toContain(
      'Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> for Every Farm Layout',
    );
    expect(plannerPageMarkup.match(/href="#planner"/g)).toHaveLength(4);
    expect(plannerPageMarkup.match(/data-homepage-farm-guide-link=/g)).toHaveLength(
      officialFarmTypes.length,
    );
    expect(plannerPageMarkup).toContain("About this planner");
    expect(plannerPageMarkup).not.toContain('id="reference-runtime-root"');
    expect(plannerPageMarkup).not.toContain(
      'src="/reference-runtime/bootstrap.mjs"',
    );
    expect(plannerPageMarkup).not.toContain("<iframe");
  });

  it("omits the workspace introduction while retaining the planner workspace", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, {
          copy: homepageCopyByLocale[currentLocale],
          currentLocale,
          onLocaleChange: () => undefined,
          plannerWorkspace: createElement("div", {
            "data-test-planner-workspace": true,
          }),
        }),
      );

      expect(homepageMarkup).toContain("data-test-planner-workspace");
      expect(homepageMarkup).not.toContain("data-homepage-workspace-introduction");
      expect(homepageMarkup).not.toContain("Your planning workspace");
      expect(homepageMarkup).not.toContain("你的规划工作区");
    }
  });

  it("does not render a hero eyebrow in either homepage locale", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, {
          copy: homepageCopyByLocale[currentLocale],
          currentLocale,
          onLocaleChange: () => undefined,
          plannerWorkspace: null,
        }),
      );

      expect(homepageMarkup).not.toContain("data-homepage-eyebrow");
      expect(homepageMarkup).not.toContain("Interactive farm planning");
      expect(homepageMarkup).not.toContain("交互式农场规划");
    }
  });

  it("renders closed native FAQ disclosures with every English answer", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup.match(/<details>/g)).toHaveLength(5);
    expect(plannerPageMarkup.match(/<summary>/g)).toHaveLength(5);
    expect(plannerPageMarkup).not.toContain("<details open");

    for (const faqItem of homepageCopyByLocale.en.faq.items) {
      expect(plannerPageMarkup).toContain(faqItem.question);
      expect(plannerPageMarkup).toContain(faqItem.answer);
    }
  });

  it("renders the localized shared footer through the homepage content boundary", () => {
    for (const [currentLocale, expectedFooter] of [
      ["en", {
        groupTitles: ["Planner", "Explore", "Legal"],
        description:
          "A browser-local fan-made tool for planning Stardew Valley farm layouts.",
        privacyHref: "/privacy",
        termsHref: "/terms",
      }],
      ["zh-CN", {
        groupTitles: ["规划器", "探索", "法律"],
        description: "在浏览器中本地规划《星露谷物语》农场布局的玩家工具。",
        privacyHref: "/zh/privacy",
        termsHref: "/zh/terms",
      }],
    ] as const) {
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, {
          copy: homepageCopyByLocale[currentLocale],
          currentLocale,
          onLocaleChange: () => undefined,
          plannerWorkspace: null,
        }),
      );

      expect(homepageMarkup).toContain('data-site-footer="true"');
      expect(homepageMarkup).toContain(expectedFooter.description);

      for (const groupTitle of expectedFooter.groupTitles) {
        expect(homepageMarkup).toContain(`<h2>${groupTitle}</h2>`);
      }

      expect(homepageMarkup).toContain(
        `<a href="${expectedFooter.privacyHref}">`,
      );
      expect(homepageMarkup).toContain(
        `<a href="${expectedFooter.termsHref}">`,
      );
      expect(homepageMarkup).toMatch(
        /<div data-site-footer-social-icons="true">(?:(?!<a).)*<\/div>/,
      );
    }
  });
});
