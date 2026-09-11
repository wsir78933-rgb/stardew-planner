import { readFileSync } from "node:fs";
import { join } from "node:path";
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

const whyChooseImageSources = [
  "/homepage/why-choose/beach-decorative-machooo.webp",
  "/homepage/why-choose/beach-geometric-jennameeps.webp",
  "/homepage/why-choose/beach-organized-justkuwl.webp",
  "/homepage/why-choose/beach-processing-shady-kegyard.webp",
  "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
  "/homepage/why-choose/fourcorners-balanced-emerald.webp",
  "/homepage/why-choose/fourcorners-coop-hallofax.webp",
] as const;

describe("planner editor page", () => {
  it("renders the React planner shell without retired runtime markup", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup).toContain("data-homepage-shell");
    expect(plannerPageMarkup).toContain("data-homepage-header");
    expect(plannerPageMarkup).toContain('data-slot="navigation-menu"');
    expect(plannerPageMarkup).toContain('data-slot="navigation-menu-list"');
    expect(plannerPageMarkup.match(/data-slot="navigation-menu-item"/g) ?? []).toHaveLength(3);
    expect(plannerPageMarkup.match(/data-slot="navigation-menu-link"/g) ?? []).toHaveLength(3);
    expect(plannerPageMarkup).toContain("data-homepage-hero");
    expect(plannerPageMarkup).toContain("data-homepage-hero-content");
    expect(plannerPageMarkup).toContain("data-homepage-hero-emphasis");
    expect(plannerPageMarkup).toContain("data-homepage-workspace");
    expect(plannerPageMarkup).toContain("data-homepage-product-stage");
    expect(plannerPageMarkup).toContain('data-homepage-features="true"');
    expect(plannerPageMarkup).toContain('data-homepage-why-choose="true"');
    expect(plannerPageMarkup).toContain('data-homepage-how-to="true"');
    expect(plannerPageMarkup).toContain('data-homepage-closing-cta="true"');
    expect(plannerPageMarkup).toContain("What the planner does");
    expect(plannerPageMarkup).toContain("Why use this planner");
    expect(plannerPageMarkup).toContain("How to use it");
    expect(plannerPageMarkup).toContain(
      "Finish the layout on this page, then build in-game.",
    );
    expect(plannerPageMarkup).toContain(
      'src="/homepage/features-pixel-farm.webp"',
    );
    expect(plannerPageMarkup).toContain("data-homepage-why-choose");
    expect(plannerPageMarkup).toContain("data-homepage-animated-testimonials");
    for (const whyChooseImageSource of whyChooseImageSources) {
      expect(plannerPageMarkup).toContain(`src="${whyChooseImageSource}"`);
    }
    expect(plannerPageMarkup).toContain(
      'src="/homepage/how-to-pixel-farm.webp"',
    );
    expect(plannerPageMarkup.match(/data-homepage-section-media="true"/g)).toHaveLength(2);
    expect(plannerPageMarkup.match(/data-homepage-section-list="true"/g)).toHaveLength(2);
    expect(plannerPageMarkup).not.toContain("data-homepage-planning-guide");
    expect(plannerPageMarkup).not.toContain("stardew-valley-planner-layout");
    const homepageSectionMarkers = [
      'data-homepage-workspace="true"',
      'id="capabilities"',
      'id="why-choose"',
      'id="how-to"',
      'data-homepage-closing-cta="true"',
      'id="faq"',
    ] as const;
    let previousHomepageSectionPosition = plannerPageMarkup.indexOf(
      homepageSectionMarkers[0],
    );
    expect(previousHomepageSectionPosition).toBeGreaterThanOrEqual(0);
    for (const homepageSectionMarker of homepageSectionMarkers.slice(1)) {
      const homepageSectionPosition = plannerPageMarkup.indexOf(
        homepageSectionMarker,
      );
      expect(homepageSectionPosition).toBeGreaterThan(
        previousHomepageSectionPosition,
      );
      previousHomepageSectionPosition = homepageSectionPosition;
    }
    expect(plannerPageMarkup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(plannerPageMarkup).toContain(
      'Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> – Free Online Farm Layout Tool',
    );
    expect(plannerPageMarkup.match(/href="#planner"/g)).toHaveLength(4);
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
    expect(plannerPageMarkup).not.toContain("game-assets");
    expect(plannerPageMarkup).not.toContain("Buildings.json");
    expect(plannerPageMarkup).not.toContain("pixi.js");
    expect(plannerPageMarkup).not.toContain(".tmx");
    expect(plannerPageMarkup).not.toContain("<iframe");
    expect(plannerPageMarkup).toContain('data-homepage-planner-preview');
    expect(plannerPageMarkup).toContain(
      'src="/public-previews/1.6.15/maps/previews/Farm.webp"',
    );
    expect(plannerPageMarkup).toContain(homepageCopyByLocale.en.plannerPreview.imageAlt);
    expect(plannerPageMarkup).not.toContain("Loading planner…");
  });

  it("keeps PlannerHomepage as a server shell without wrapping the page in client state", () => {
    const plannerHomepageSource = readFileSync(
      join(process.cwd(), "src/components/planner-homepage.tsx"),
      "utf8",
    );

    expect(plannerHomepageSource).not.toContain('"use client"');
    expect(plannerHomepageSource).not.toContain("useState");
    expect(plannerHomepageSource).not.toContain("useEffect");
    expect(plannerHomepageSource).toContain("createHomepageNavigationUrls");
    expect(plannerHomepageSource).toContain("HomepagePlannerSlot");
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

  it("renders the replacement sections and their copy in order for both locales", () => {
    for (const currentLocale of ["en", "zh-CN"] as const) {
      const homepageCopy = homepageCopyByLocale[currentLocale];
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageContent, {
          copy: homepageCopy,
          currentLocale,
          localeHrefByLocale: { en: "/", "zh-CN": "/zh" },
          plannerHref: currentLocale === "en" ? "/#planner" : "/zh#planner",
          plannerWorkspace: createElement("div", {
            "data-test-planner-workspace": true,
          }),
        }),
      );
      const homepageSectionMarkers = [
        "data-test-planner-workspace",
        'id="capabilities"',
        'id="why-choose"',
        'id="how-to"',
        'data-homepage-closing-cta="true"',
        'id="faq"',
      ] as const;
      let previousHomepageSectionPosition = homepageMarkup.indexOf(
        homepageSectionMarkers[0],
      );
      expect(previousHomepageSectionPosition).toBeGreaterThanOrEqual(0);
      for (const homepageSectionMarker of homepageSectionMarkers.slice(1)) {
        const homepageSectionPosition = homepageMarkup.indexOf(
          homepageSectionMarker,
        );
        expect(homepageSectionPosition).toBeGreaterThan(
          previousHomepageSectionPosition,
        );
        previousHomepageSectionPosition = homepageSectionPosition;
      }

      const imageAndTextSections = [
        {
          marker: 'data-homepage-features="true"',
          heading: homepageCopy.features.heading,
          imageAlt: homepageCopy.features.imageAlt,
          items: homepageCopy.features.items,
        },
        {
          marker: 'data-homepage-how-to="true"',
          heading: homepageCopy.howTo.heading,
          imageAlt: homepageCopy.howTo.imageAlt,
          items: homepageCopy.howTo.steps,
        },
      ] as const;

      for (const imageAndTextSection of imageAndTextSections) {
        expect(homepageMarkup).toContain(imageAndTextSection.marker);
        expect(homepageMarkup).toContain(imageAndTextSection.heading);
        expect(homepageMarkup).toContain(imageAndTextSection.imageAlt);
        for (const item of imageAndTextSection.items) {
          expect(homepageMarkup).toContain(item.title);
          expect(homepageMarkup).toContain(item.description);
        }
      }

      expect(homepageMarkup).toContain('data-homepage-why-choose="true"');
      expect(homepageMarkup).toContain("data-homepage-animated-testimonials");
      expect(homepageMarkup).toContain(homepageCopy.whyChoose.heading);
      expect(homepageMarkup).toContain(homepageCopy.whyChoose.previousLabel);
      expect(homepageMarkup).toContain(homepageCopy.whyChoose.nextLabel);
      const firstFarmLayoutSlide = homepageCopy.whyChoose.testimonials[0];
      expect(homepageMarkup).toContain(firstFarmLayoutSlide.quote);
      expect(homepageMarkup).toContain(firstFarmLayoutSlide.name);
      expect(homepageMarkup).toContain(firstFarmLayoutSlide.designation);
      expect(homepageMarkup).toContain(firstFarmLayoutSlide.imageAlt);
      for (const farmLayoutSlide of homepageCopy.whyChoose.testimonials) {
        expect(homepageMarkup).toContain(`src="${farmLayoutSlide.src}"`);
        expect(homepageMarkup).toContain(farmLayoutSlide.imageAlt);
      }

      expect(homepageMarkup).toContain(homepageCopy.closingCta.heading);
      expect(homepageMarkup).toContain(homepageCopy.hero.primaryActionLabel);
      expect(homepageMarkup).not.toContain(homepageCopy.closingCta.supportLine);
      expect(homepageMarkup).not.toContain("data-homepage-planning-guide");
      expect(homepageMarkup).not.toContain("stardew-valley-planner-layout");
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

  it("renders always-visible numbered FAQ items with every English answer", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));
    const faqSectionStart = plannerPageMarkup.indexOf('id="faq"');
    const faqSectionEnd = plannerPageMarkup.indexOf("</section>", faqSectionStart);
    const faqMarkup = plannerPageMarkup.slice(faqSectionStart, faqSectionEnd);

    expect(faqSectionStart).toBeGreaterThanOrEqual(0);
    expect(plannerPageMarkup).toContain('data-homepage-faq="true"');
    expect(faqMarkup).toContain('data-homepage-faq-list="true"');
    expect(faqMarkup.match(/data-homepage-section-index="true"/g)).toHaveLength(5);
    expect(faqMarkup).toContain(">01</span>");
    expect(faqMarkup).toContain(">02</span>");
    expect(faqMarkup).toContain(">03</span>");
    expect(faqMarkup).toContain(">04</span>");
    expect(faqMarkup).toContain(">05</span>");
    expect(faqMarkup.match(/<h3>/g)).toHaveLength(5);
    expect(faqMarkup).not.toContain('data-state="closed"');
    expect(faqMarkup).not.toContain('aria-expanded="false"');
    expect(faqMarkup).not.toContain('role="region"');
    expect(faqMarkup).not.toContain("<svg");
    expect(faqMarkup).not.toContain("<details");
    expect(faqMarkup).not.toContain("<summary");
    expect(faqMarkup).not.toContain("lucide");
    expect(faqMarkup).not.toContain('data-slot="accordion"');
    expect(faqMarkup).not.toContain('data-slot="accordion-item"');
    expect(faqMarkup).not.toContain('data-slot="accordion-trigger"');
    expect(faqMarkup).not.toContain('data-slot="accordion-content"');
    expect(faqMarkup).not.toContain('data-slot="accordion-trigger-icon"');

    for (const faqItem of homepageCopyByLocale.en.faq.items) {
      expect(faqMarkup).toContain(faqItem.question);
      expect(faqMarkup).toContain(faqItem.answer);
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

    expect(homepageMarkup.match(/href="#planner"/g)).toHaveLength(4);
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
