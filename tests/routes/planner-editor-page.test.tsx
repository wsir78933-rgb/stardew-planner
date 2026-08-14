import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlannerPage from "../../app/(en)/page";
import { HomepageContent } from "../../src/components/homepage-content";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";
import { createHomepageNavigationUrls } from "../../src/homepage/homepage-navigation-url";
import { plannerMaps } from "../../src/maps/map-catalog";

const expectedPlannerFarmMapIds = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

describe("planner editor page", () => {
  it("renders the React planner shell without retired runtime markup", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup).toContain("data-homepage-shell");
    expect(plannerPageMarkup).toContain("data-homepage-header");
    expect(plannerPageMarkup).toContain("data-homepage-hero");
    expect(plannerPageMarkup).toContain("data-homepage-hero-content");
    expect(plannerPageMarkup).toContain("data-homepage-hero-emphasis");
    expect(plannerPageMarkup).toContain("data-homepage-workspace");
    expect(plannerPageMarkup).toContain("data-homepage-product-stage");
    expect(plannerPageMarkup).toContain(
      "How to Plan a Stardew Valley Farm Layout",
    );
    expect(plannerPageMarkup).toContain(
      'src="/homepage/stardew-valley-planner-layout.webp"',
    );
    expect(plannerPageMarkup).toContain('height="941"');
    expect(plannerPageMarkup).toContain('width="1672"');
    expect(plannerPageMarkup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(plannerPageMarkup).toContain(
      'Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> – Free Online Farm Layout Tool',
    );
    expect(plannerPageMarkup.match(/href="#planner"/g)).toHaveLength(3);
    expect(plannerPageMarkup).toMatch(/<a[^>]*href="\/blog"[^>]*>Blog<\/a>/);
    expect(plannerPageMarkup).not.toMatch(/<a[^>]*href="#planner"[^>]*>Planner<\/a>/);
    expect(plannerPageMarkup).toMatch(/<a[^>]*href="#planner"[^>]*>Open planner<\/a>/);
    expect(plannerPageMarkup).toMatch(/<a[^>]*href="#planner"[^>]*>Start planning<\/a>/);
    expect(plannerPageMarkup).not.toContain("data-homepage-farm-guide-link");
    expect(plannerPageMarkup).not.toContain("data-homepage-farm-comparison-link");
    expect(
      plannerMaps
        .filter(({ id }) => expectedPlannerFarmMapIds.includes(id as never))
        .map(({ id }) => id),
    ).toEqual(expectedPlannerFarmMapIds);
    expect(plannerPageMarkup).toContain("About this planner");
    expect(plannerPageMarkup).not.toContain('id="reference-runtime-root"');
    expect(plannerPageMarkup).not.toContain(
      'src="/reference-runtime/bootstrap.mjs"',
    );
    expect(plannerPageMarkup).not.toContain("/_app/immutable/");
    expect(plannerPageMarkup).not.toContain("data-sveltekit-");
    expect(plannerPageMarkup).not.toContain("game-assets/1.6.15");
    expect(plannerPageMarkup).not.toContain("Buildings.json");
    expect(plannerPageMarkup).not.toContain("pixi.js");
    expect(plannerPageMarkup).not.toContain("<iframe");
    expect(plannerPageMarkup).toContain('role="status"');
    expect(plannerPageMarkup).toContain("Loading planner…");
  });

  it("omits the workspace introduction while retaining the planner workspace", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const homepageContentProps = {
        copy: homepageCopyByLocale[currentLocale],
        currentLocale,
        localeHrefByLocale: { en: "/", "zh-CN": "/zh" },
        plannerHref:
          currentLocale === "en" ? "/#planner" : "/zh#planner",
        plannerWorkspace: createElement("div", {
          "data-test-planner-workspace": true,
        }),
      };
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, homepageContentProps),
      );

      expect(homepageMarkup).toContain("data-test-planner-workspace");
      expect(homepageMarkup).not.toContain("data-homepage-workspace-introduction");
      expect(homepageMarkup).not.toContain("Your planning workspace");
      expect(homepageMarkup).not.toContain("你的规划工作区");
    }
  });

  it("keeps guide prose available through collapsed planning disclosures", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const guideCopy = homepageCopyByLocale[currentLocale].planningGuide;
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, {
          copy: homepageCopyByLocale[currentLocale],
          currentLocale,
          localeHrefByLocale: { en: "/", "zh-CN": "/zh" },
          plannerHref: currentLocale === "en" ? "/#planner" : "/zh#planner",
          plannerWorkspace: null,
        }),
      );
      const guideMarkup = homepageMarkup.match(
        /<section[^>]*data-homepage-planning-guide[^>]*>[\s\S]*?<\/section><section id="capabilities">/,
      )?.[0];

      expect(guideMarkup).toBeDefined();
      expect(homepageMarkup).toContain("data-homepage-planning-guide-summary");
      expect(homepageMarkup).toContain("data-homepage-planning-guide-details");
      expect(homepageMarkup).toContain("data-homepage-planning-guide-play-styles");
      expect(
        homepageMarkup.match(/data-homepage-planning-guide-step="true"/g),
      ).toHaveLength(4);
      expect(
        homepageMarkup.match(/data-homepage-planning-guide-play-style-option="true"/g),
      ).toHaveLength(3);
      expect(
        homepageMarkup.match(/data-homepage-planning-guide-play-style-panel="true"/g),
      ).toHaveLength(3);
      expect(guideMarkup).not.toContain("<details open");
      expect(guideMarkup).not.toContain('data-homepage-planning-guide-play-style-option="true" checked');
      expect(guideMarkup).not.toMatch(/<summary[^>]*>[\s\S]*?<h4/);

      for (const paragraph of guideCopy.intro) {
        expect(homepageMarkup).toContain(paragraph);
      }

      for (const step of guideCopy.steps) {
        expect(homepageMarkup).toContain(step.title);
        expect(homepageMarkup).toContain(step.description);
      }

      for (const playStyle of guideCopy.playStyles) {
        expect(homepageMarkup).toContain(playStyle.title);
        expect(homepageMarkup).toContain(playStyle.description);
      }

      for (const paragraph of guideCopy.evolutionParagraphs) {
        expect(homepageMarkup).toContain(paragraph);
      }
    }
  });

  it("does not render a hero eyebrow in either homepage locale", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const homepageContentProps = {
        copy: homepageCopyByLocale[currentLocale],
        currentLocale,
        localeHrefByLocale: { en: "/", "zh-CN": "/zh" },
        plannerHref:
          currentLocale === "en" ? "/#planner" : "/zh#planner",
        plannerWorkspace: null,
      };
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, homepageContentProps),
      );

      expect(homepageMarkup).not.toContain("data-homepage-eyebrow");
      expect(homepageMarkup).not.toContain("Interactive farm planning");
      expect(homepageMarkup).not.toContain("交互式农场规划");
    }
  });

  it("renders closed native FAQ disclosures with every English answer", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));
    const faqMarkup = plannerPageMarkup.match(
      /<div data-homepage-faq-list="true">([\s\S]*?)<\/div><\/section>/,
    )?.[1];

    expect(faqMarkup).toBeDefined();
    expect(faqMarkup?.match(/<details>/g)).toHaveLength(5);
    expect(faqMarkup?.match(/<summary>/g)).toHaveLength(5);
    expect(faqMarkup).not.toContain("<details open");

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
        contactHref: "/contact",
        blogHref: "/blog",
        blogLabel: "Blog",
      }],
      ["zh-CN", {
        groupTitles: ["规划器", "探索", "法律"],
        description: "在浏览器中本地规划《星露谷物语》农场布局的玩家工具。",
        privacyHref: "/zh/privacy",
        termsHref: "/zh/terms",
        contactHref: "/zh/contact",
        blogHref: "/zh/blog",
        blogLabel: "博客",
      }],
    ] as const) {
      const homepageContentProps = {
        copy: homepageCopyByLocale[currentLocale],
        currentLocale,
        localeHrefByLocale: { en: "/", "zh-CN": "/zh" },
        plannerHref:
          currentLocale === "en" ? "/#planner" : "/zh#planner",
        plannerWorkspace: null,
      };
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, homepageContentProps),
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
      expect(homepageMarkup).toContain(
        `<a href="${expectedFooter.contactHref}">`,
      );
      expect(homepageMarkup).toContain(
        `<a href="${expectedFooter.blogHref}">${expectedFooter.blogLabel}</a>`,
      );
      expect(homepageMarkup).toMatch(
        /<div data-site-footer-social-icons="true">[\s\S]*?href="https:\/\/x\.com\/wsir1139"[\s\S]*?<\/div>/,
      );
    }
  });

  it("uses the route-specific planner anchor for every homepage planner CTA", () => {
    const navigationUrls = createHomepageNavigationUrls({
      currentLocale: "zh-CN",
      hash: "#planner",
      search: "?farmType=forest",
    });
    const homepageMarkup = renderToStaticMarkup(
      createElement(
        HomepageContent,
        {
          copy: homepageCopyByLocale["zh-CN"],
          currentLocale: "zh-CN",
          ...navigationUrls,
          plannerWorkspace: null,
        },
      ),
    );

    expect(homepageMarkup.match(/href="#planner"/g)).toHaveLength(3);
    expect(homepageMarkup.match(/href="\/zh\?farmType=forest#planner"/g)).toHaveLength(1);
    expect(homepageMarkup).toMatch(
      /<a[^>]*data-homepage-brand[^>]*href="#planner"/,
    );
    expect(homepageMarkup).toMatch(/<a[^>]*href="\/zh\/blog"[^>]*>博客<\/a>/);
    expect(homepageMarkup).not.toMatch(/<a[^>]*href="#planner"[^>]*>规划器<\/a>/);
    expect(homepageMarkup).toMatch(
      /<a[^>]*href="#planner"[^>]*>打开规划器<\/a>/,
    );
    expect(homepageMarkup).toMatch(
      /<a[^>]*href="#planner"[^>]*>开始规划<\/a>/,
    );
  });
});
