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

function readHomepageHeaderMarkup(pageMarkup: string): string {
  const homepageHeaderAttributePosition = pageMarkup.indexOf(
    "data-homepage-header",
  );
  if (homepageHeaderAttributePosition < 0) {
    throw new Error(
      "Cannot read homepage header: data-homepage-header is missing from markup.",
    );
  }

  const homepageHeaderEnd = pageMarkup.indexOf(
    "</header>",
    homepageHeaderAttributePosition,
  );
  if (homepageHeaderEnd < 0) {
    throw new Error(
      "Cannot read homepage header: closing </header> is missing after data-homepage-header.",
    );
  }

  return pageMarkup.slice(homepageHeaderAttributePosition, homepageHeaderEnd);
}

describe("planner editor page", () => {
  it("renders the React planner shell without retired runtime markup", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup).toContain("data-homepage-shell");
    expect(plannerPageMarkup).toContain("data-homepage-header");
    expect(plannerPageMarkup).toContain('data-slot="dock"');
    const homepageHeaderMarkup = readHomepageHeaderMarkup(plannerPageMarkup);
    expect(homepageHeaderMarkup).toContain('data-slot="dock"');
    expect(homepageHeaderMarkup).not.toContain('data-slot="navigation-menu"');
    expect(homepageHeaderMarkup).toMatch(
      /<a[^>]*data-homepage-brand[^>]*href="\/"/,
    );
    expect(homepageHeaderMarkup).toContain("data-homepage-navigation-links");
    expect(homepageHeaderMarkup).not.toContain('href="#capabilities"');
    expect(homepageHeaderMarkup).not.toContain('href="#faq"');
    expect(homepageHeaderMarkup).toContain('href="/blog"');
    expect(homepageHeaderMarkup).not.toContain("Features");
    expect(homepageHeaderMarkup).not.toContain("FAQ");
    expect(homepageHeaderMarkup).toContain("Blog");
    expect(homepageHeaderMarkup).toContain("data-homepage-header-action");
    expect(homepageHeaderMarkup).toContain("Open planner");
    expect(homepageHeaderMarkup).toContain("data-homepage-language-switcher");
    expect(homepageHeaderMarkup).toContain("data-homepage-language-trigger");
    expect(homepageHeaderMarkup).toContain("data-homepage-language-menu");
    expect(homepageHeaderMarkup).toContain("data-homepage-language-option");
    expect(plannerPageMarkup).toContain("data-homepage-hero");
    expect(plannerPageMarkup).toContain("data-homepage-hero-content");
    expect(plannerPageMarkup).toContain("data-homepage-hero-emphasis");
    expect(plannerPageMarkup).toContain("data-homepage-workspace");
    expect(plannerPageMarkup).toContain("data-homepage-product-stage");
    expect(plannerPageMarkup).not.toContain('data-homepage-features="true"');
    expect(plannerPageMarkup).not.toContain('data-homepage-why-choose="true"');
    expect(plannerPageMarkup).toContain('data-homepage-how-to="true"');
    expect(plannerPageMarkup).toContain('data-homepage-closing-cta="true"');
    expect(plannerPageMarkup).toContain("What is Stardew Valley Planner?");
    expect(plannerPageMarkup).not.toContain("Meadowlands Farm Layout Examples");
    expect(plannerPageMarkup).not.toContain("Beach &amp; Four Corners Farm Layout Examples");
    expect(plannerPageMarkup).not.toContain("Why use this planner");
    expect(plannerPageMarkup).not.toContain(
      'id="homepage-why-choose-heading"',
    );
    expect(plannerPageMarkup).toContain("Lay out the farm in three passes");
    expect(plannerPageMarkup).toContain(
      "Finish the layout on this page, then build in-game.",
    );
    expect(plannerPageMarkup).not.toContain("data-homepage-features-gallery");
    expect(plannerPageMarkup).not.toContain(
      'src="/homepage/how-to-pixel-farm.webp"',
    );
    expect(plannerPageMarkup).toContain('id="homepage-how-to-heading"');
    expect(plannerPageMarkup.match(/data-homepage-section-media="true"/g)).toBeNull();
    expect(plannerPageMarkup.match(/data-homepage-section-list="true"/g)).toBeNull();
    expect(plannerPageMarkup).not.toContain("data-homepage-planning-guide");
    expect(plannerPageMarkup).not.toContain("stardew-valley-planner-layout");
    const homepageSectionMarkers = [
      'data-homepage-workspace="true"',
      'id="what-is"',
      ...homepageCopyByLocale.en.caseStudies.map(
        (caseStudyGroup) => `id="${caseStudyGroup.id}"`,
      ),
      'id="capabilities"',
      'id="how-to"',
      'id="faq"',
      'data-homepage-closing-cta="true"',
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
    expect(plannerPageMarkup).toContain("Stardew Valley ");
    expect(plannerPageMarkup).toContain(
      '<em data-homepage-hero-emphasis="true">Planner</em>',
    );
    expect(plannerPageMarkup).toContain("Free Online Farm Layout Tool");
    expect(plannerPageMarkup).toContain("data-homepage-hero-fan");
    expect(plannerPageMarkup).toContain('src="/homepage/hero/spring-crops.webp"');
    expect(plannerPageMarkup).toContain('src="/homepage/hero/beach-farm.webp"');
    expect(plannerPageMarkup).toContain('src="/homepage/hero/forest-farm.webp"');
    expect(plannerPageMarkup.match(/href="#planner"/g)).toHaveLength(3);
    expect(plannerPageMarkup).toMatch(/<a[^>]*href="\/blog"[^>]*>Blog<\/a>/);
    expect(plannerPageMarkup).not.toMatch(/<a[^>]*href="#planner"[^>]*>Planner<\/a>/);
    expect(plannerPageMarkup).toContain("Open planner");
    expect(plannerPageMarkup).toMatch(/<a[^>]*href="#planner"[^>]*>Start planning<\/a>/);
    expect(plannerPageMarkup).not.toContain("data-homepage-farm-guide-link");
    expect(plannerPageMarkup).not.toContain("data-homepage-farm-comparison-link");
    expect(
      plannerMaps
        .filter(({ id }) => expectedPlannerFarmMapIds.includes(id as never))
        .map(({ id }) => id),
    ).toEqual(expectedPlannerFarmMapIds);
    expect(plannerPageMarkup).not.toContain(
      "Fan-made. Not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
    );
    expect(plannerPageMarkup).not.toContain('data-homepage-trust="true"');
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
        'id="what-is"',
        ...homepageCopy.caseStudies.map(
          (caseStudyGroup) => `id="${caseStudyGroup.id}"`,
        ),
        'id="capabilities"',
        'id="how-to"',
        'id="faq"',
        'data-homepage-closing-cta="true"',
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

      expect(homepageMarkup).toContain('data-homepage-what-is="true"');
      expect(homepageMarkup).toContain(homepageCopy.whatIs.heading);
      expect(homepageMarkup).toContain(homepageCopy.whatIs.description);
      for (const introductionItem of homepageCopy.whatIs.items) {
        expect(homepageMarkup).toContain(introductionItem.description);
      }
      expect(homepageCopy.caseStudies).toHaveLength(3);
      expect(
        homepageCopy.caseStudies.map(
          (caseStudyGroup) => caseStudyGroup.imagePosition,
        ),
      ).toEqual(["left", "right", "left"]);
      let renderedCaseStudyImageCount = 0;
      for (
        const [groupIndex, caseStudyGroup] of homepageCopy.caseStudies.entries()
      ) {
        const caseStudySectionStartMarker =
          `data-homepage-case-study-group="${caseStudyGroup.id}"`;
        const caseStudySectionMarkerIndex = homepageMarkup.indexOf(
          caseStudySectionStartMarker,
        );
        if (caseStudySectionMarkerIndex < 0) {
          throw new Error(
            `Missing case study section marker ${JSON.stringify(caseStudySectionStartMarker)}`,
          );
        }
        const caseStudySectionStart = homepageMarkup.lastIndexOf(
          "<section",
          caseStudySectionMarkerIndex,
        );
        if (caseStudySectionStart < 0) {
          throw new Error(
            `Missing <section> before case study marker ${JSON.stringify(caseStudySectionStartMarker)}`,
          );
        }
        const caseStudySectionClosingTag = "</section>";
        const caseStudySectionClosingTagIndex = homepageMarkup.indexOf(
          caseStudySectionClosingTag,
          caseStudySectionStart,
        );
        if (caseStudySectionClosingTagIndex < 0) {
          throw new Error(
            `Missing ${JSON.stringify(caseStudySectionClosingTag)} after case study marker ${JSON.stringify(caseStudySectionStartMarker)}`,
          );
        }
        const caseStudySectionEnd =
          caseStudySectionClosingTagIndex + caseStudySectionClosingTag.length;
        const caseStudySectionMarkup = homepageMarkup.slice(
          caseStudySectionStart,
          caseStudySectionEnd,
        );
        expect(caseStudySectionMarkup).toContain(
          "data-homepage-content-section",
        );
        expect(caseStudySectionMarkup).toContain(`id="${caseStudyGroup.id}"`);
        expect(caseStudySectionMarkup).toContain(
          `data-image-position="${caseStudyGroup.imagePosition}"`,
        );
        if (groupIndex === 0) {
          expect(caseStudySectionMarkup).toContain(
            'aria-labelledby="farm-cases-heading"',
          );
          expect(caseStudySectionMarkup).toContain(
            'aria-describedby="farm-cases-description"',
          );
          expect(caseStudySectionMarkup).toContain(
            `<h2 id="farm-cases-heading">${homepageCopy.caseStudiesHeading}</h2>`,
          );
          expect(caseStudySectionMarkup).toMatch(
            /<header\b(?=[^>]*data-homepage-case-study-header="true")[^>]*>/,
          );
          expect(caseStudySectionMarkup).toMatch(
            /<p\b(?=[^>]*id="farm-cases-description")(?=[^>]*data-homepage-case-study-description="true")[^>]*>/,
          );
          expect(caseStudySectionMarkup).toContain(
            homepageCopy.caseStudiesDescription,
          );
        } else {
          expect(caseStudySectionMarkup).toContain(
            `aria-label="${caseStudyGroup.heading}"`,
          );
          expect(caseStudySectionMarkup).not.toContain("<h2");
          expect(caseStudySectionMarkup).not.toContain(
            "data-homepage-case-study-header",
          );
          expect(caseStudySectionMarkup).not.toContain(
            "data-homepage-case-study-description",
          );
          expect(caseStudySectionMarkup).not.toContain(
            homepageCopy.caseStudiesDescription,
          );
        }
        expect(caseStudyGroup.testimonials).toHaveLength(4);
        expect(
          caseStudySectionMarkup.match(/data-circular-testimonials-image/g),
        ).toHaveLength(4);
        renderedCaseStudyImageCount += caseStudyGroup.testimonials.length;
        for (const caseStudy of caseStudyGroup.testimonials) {
          expect(caseStudySectionMarkup).toContain(`src="${caseStudy.src}"`);
          expect(caseStudySectionMarkup).toContain(`alt="${caseStudy.alt}"`);
        }
      }
      expect(
        homepageMarkup.match(/<h2 id="farm-cases-heading">/g),
      ).toHaveLength(1);
      expect(
        homepageMarkup.match(/data-homepage-case-study-header/g),
      ).toHaveLength(1);
      expect(
        homepageMarkup.match(/data-homepage-case-study-description/g),
      ).toHaveLength(1);
      expect(
        homepageMarkup.match(/aria-describedby="farm-cases-description"/g),
      ).toHaveLength(1);
      expect(renderedCaseStudyImageCount).toBe(12);
      const whatIsSectionStart = homepageMarkup.indexOf(
        'data-homepage-what-is="true"',
      );
      const firstCaseStudySectionStart = homepageMarkup.indexOf(
        `data-homepage-case-study-group="${homepageCopy.caseStudies[0].id}"`,
      );
      expect(whatIsSectionStart).toBeGreaterThanOrEqual(0);
      expect(firstCaseStudySectionStart).toBeGreaterThan(whatIsSectionStart);
      const whatIsSectionMarkup = homepageMarkup.slice(
        whatIsSectionStart,
        firstCaseStudySectionStart,
      );
      expect(whatIsSectionMarkup).toContain('src="/homepage/what-is/farm-layout-overview.png"');
      expect(whatIsSectionMarkup).toContain(`alt="${homepageCopy.whatIs.imageAlt}"`);

      const featureIntroductionSectionMarker = 'id="capabilities"';
      const featureIntroductionSectionMarkerIndex = homepageMarkup.indexOf(
        featureIntroductionSectionMarker,
      );
      if (featureIntroductionSectionMarkerIndex < 0) {
        throw new Error(
          `Missing feature introduction section marker ${JSON.stringify(featureIntroductionSectionMarker)}`,
        );
      }
      const featureIntroductionSectionStart = homepageMarkup.lastIndexOf(
        "<section",
        featureIntroductionSectionMarkerIndex,
      );
      if (featureIntroductionSectionStart < 0) {
        throw new Error(
          `Missing <section> before feature introduction marker ${JSON.stringify(featureIntroductionSectionMarker)}`,
        );
      }
      const featureIntroductionSectionClosingTag = "</section>";
      const featureIntroductionSectionClosingTagIndex = homepageMarkup.indexOf(
        featureIntroductionSectionClosingTag,
        featureIntroductionSectionStart,
      );
      if (featureIntroductionSectionClosingTagIndex < 0) {
        throw new Error(
          `Missing ${JSON.stringify(featureIntroductionSectionClosingTag)} after feature introduction marker ${JSON.stringify(featureIntroductionSectionMarker)}`,
        );
      }
      const featureIntroductionSectionEnd =
        featureIntroductionSectionClosingTagIndex +
        featureIntroductionSectionClosingTag.length;
      const homepageHowToMarker = 'data-homepage-how-to="true"';
      const homepageHowToMarkerIndex = homepageMarkup.indexOf(
        homepageHowToMarker,
        featureIntroductionSectionEnd,
      );
      if (homepageHowToMarkerIndex < 0) {
        throw new Error(
          `Missing ${JSON.stringify(homepageHowToMarker)} after feature introduction marker ${JSON.stringify(featureIntroductionSectionMarker)}`,
        );
      }
      expect(homepageHowToMarkerIndex).toBeGreaterThan(
        featureIntroductionSectionEnd,
      );
      const featureIntroductionSectionMarkup = homepageMarkup.slice(
        featureIntroductionSectionStart,
        featureIntroductionSectionEnd,
      );
      expect(featureIntroductionSectionMarkup).toContain(
        'data-homepage-feature-introduction="true"',
      );
      expect(featureIntroductionSectionMarkup).not.toContain(
        "data-circular-testimonials",
      );
      const expectedFeatureIntroductionHeading =
        homepageCopy.featureIntroduction.heading;
      expect(featureIntroductionSectionMarkup).toContain(
        `<h2 id="homepage-feature-introduction-heading">${expectedFeatureIntroductionHeading}</h2>`,
      );
      expect(featureIntroductionSectionMarkup).toContain(
        'data-homepage-feature-introduction-header="true"',
      );
      expect(featureIntroductionSectionMarkup).toContain(
        `<p data-homepage-feature-introduction-overview="true">${homepageCopy.featureIntroduction.description}</p>`,
      );
      expect(featureIntroductionSectionMarkup).toMatch(
        /<ul\b(?=[^>]*data-homepage-feature-introduction-list="true")(?=[^>]*role="list")[^>]*>/,
      );
      expect(homepageCopy.featureIntroduction.items).toHaveLength(6);
      expect(
        featureIntroductionSectionMarkup.match(
          /data-homepage-feature-introduction-item="true"/g,
        ),
      ).toHaveLength(6);
      expect(
        featureIntroductionSectionMarkup.match(
          /<article data-homepage-feature-introduction-card="true">/g,
        ),
      ).toHaveLength(6);
      const featureIntroductionIcons =
        featureIntroductionSectionMarkup.match(/<svg\b[^>]*>/g) ?? [];
      expect(featureIntroductionIcons).toHaveLength(6);
      for (const featureIntroductionIcon of featureIntroductionIcons) {
        expect(featureIntroductionIcon).toContain('aria-hidden="true"');
        expect(featureIntroductionIcon).toContain('focusable="false"');
      }
      expect(featureIntroductionSectionMarkup).not.toMatch(/<(?:a|button)\b/i);
      for (const featureIntroductionItem of homepageCopy.featureIntroduction.items) {
        expect(featureIntroductionSectionMarkup).toContain(
          `<h3 data-homepage-feature-introduction-title="true">${featureIntroductionItem.title.replaceAll("'", "&#x27;")}</h3>`,
        );
        expect(featureIntroductionSectionMarkup).toContain(
          `<p data-homepage-feature-introduction-description="true">${featureIntroductionItem.description.replaceAll("'", "&#x27;")}</p>`,
        );
      }

      expect(homepageMarkup).not.toContain('data-homepage-features="true"');
      expect(homepageMarkup).not.toContain(homepageCopy.features.heading);
      expect(homepageMarkup).not.toContain('data-homepage-why-choose="true"');
      expect(homepageMarkup).not.toContain(
        homepageCopy.whyChoose.heading.replaceAll("&", "&amp;"),
      );
      expect(homepageMarkup).toContain('data-homepage-how-to="true"');
      expect(homepageMarkup).toContain('id="how-to"');
      expect(homepageMarkup).toContain('id="homepage-how-to-heading"');
      expect(homepageMarkup).toContain(homepageCopy.howTo.heading);
      expect(homepageMarkup).toContain(
        homepageCopy.howTo.description.replaceAll("'", "&#x27;"),
      );
      expect(homepageMarkup).not.toContain("/homepage/how-to-pixel-farm.webp");
      expect(homepageCopy.howTo.steps).toHaveLength(3);
      for (const howToStep of homepageCopy.howTo.steps) {
        expect(homepageMarkup).toContain(howToStep.title.replaceAll("'", "&#x27;"));
        expect(homepageMarkup).toContain(howToStep.description);
        for (const howToBenefit of howToStep.benefits) {
          expect(homepageMarkup).toContain(
            howToBenefit.replaceAll("'", "&#x27;"),
          );
        }
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

  it("renders the FAQ accordion with every English question and answer", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));
    const faqSectionStart = plannerPageMarkup.indexOf('id="faq"');
    const faqSectionEnd = plannerPageMarkup.indexOf("</section>", faqSectionStart);
    const faqMarkup = plannerPageMarkup.slice(faqSectionStart, faqSectionEnd);
    const englishFaqCopy = homepageCopyByLocale.en.faq;

    expect(faqSectionStart).toBeGreaterThanOrEqual(0);
    expect(plannerPageMarkup).toContain('data-homepage-faq="true"');
    expect(faqMarkup).toContain("FAQ");
    expect(faqMarkup).toContain("Frequently Asked Questions");
    expect(faqMarkup).toContain(
      "Where your plan is stored, which farms you can use, and what you can export.",
    );
    expect(faqMarkup.match(/type="button"/g)).toHaveLength(5);
    expect(faqMarkup).toContain('aria-expanded="false"');
    expect(faqMarkup).toContain("<svg");
    expect(faqMarkup).not.toContain("data-homepage-section-index");
    expect(faqMarkup).not.toContain(">01</span>");
    expect(faqMarkup).not.toContain("<h3");
    expect(faqMarkup).not.toContain("<details");
    expect(faqMarkup).not.toContain("<summary");
    expect(faqMarkup).not.toContain("lucide");
    expect(faqMarkup).not.toContain('data-slot="accordion"');
    expect(faqMarkup).not.toContain('data-slot="accordion-item"');
    expect(faqMarkup).not.toContain('data-slot="accordion-trigger"');
    expect(faqMarkup).not.toContain('data-slot="accordion-content"');
    expect(faqMarkup).not.toContain('data-slot="accordion-trigger-icon"');

    for (const faqItem of englishFaqCopy.items) {
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

    expect(homepageMarkup.match(/href="#planner"/g)).toHaveLength(3);
    expect(homepageMarkup).toContain("data-homepage-language-option");
    expect(homepageMarkup).toMatch(
      /<a[^>]*data-homepage-language-option[^>]*href="\/zh"/,
    );
    expect(homepageMarkup).toContain('data-slot="dock"');
    const homepageHeaderMarkup = readHomepageHeaderMarkup(homepageMarkup);
    expect(homepageHeaderMarkup).toContain('data-slot="dock"');
    expect(homepageHeaderMarkup).not.toContain('data-slot="navigation-menu"');
    expect(homepageMarkup).toMatch(
      /<a[^>]*data-homepage-brand[^>]*href="\/zh"/,
    );
    expect(homepageHeaderMarkup).toContain("data-homepage-navigation-links");
    expect(homepageHeaderMarkup).not.toContain('href="#capabilities"');
    expect(homepageHeaderMarkup).not.toContain('href="#faq"');
    expect(homepageHeaderMarkup).toContain('href="/zh/blog"');
    expect(homepageHeaderMarkup).not.toContain("功能介绍");
    expect(homepageHeaderMarkup).not.toContain("常见问题");
    expect(homepageHeaderMarkup).toContain("博客");
    expect(homepageHeaderMarkup).toContain("data-homepage-header-action");
    expect(homepageHeaderMarkup).toContain("打开规划器");
    expect(homepageMarkup).toContain(
      '<a href="/zh/blog">博客</a>',
    );
    expect(homepageMarkup).not.toMatch(/<a[^>]*href="#planner"[^>]*>规划器<\/a>/);
    expect(homepageMarkup).toContain("打开规划器");
    expect(homepageMarkup).toMatch(
      /<a[^>]*href="#planner"[^>]*>开始规划<\/a>/,
    );
  });
});
