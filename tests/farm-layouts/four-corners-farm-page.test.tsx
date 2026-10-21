import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getFourCornersFarmPageCopy } from "../../src/farm-layouts/four-corners-farm-content";
import { FourCornersFarmPage } from "../../src/farm-layouts/four-corners-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const fourCornersFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const fourCornersFarmCaseCount = 7;
const fourCornersMapWidth = 1600;
const fourCornersMapHeight = 1600;
const expectedFourCornersFarmCaseIds = [
  "01-formal-garden",
  "02-mushroom-village",
  "03-themed-quadrants",
  "04-twelve-fish-ponds",
  "05-bees-and-animals",
  "06-junimo-columns",
  "07-clock-garden",
] as const;

test.each(fourCornersFarmLocales)(
  "renders all seven Four Corners Farm maps in %s",
  (locale) => {
    const copy = getFourCornersFarmPageCopy(locale);
    const markup = renderToStaticMarkup(<FourCornersFarmPage locale={locale} />);

    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedFourCornersFarmCaseIds,
    );
    expect(markup).toContain('data-four-corners-farm-page="true"');
    expect(markup.match(/data-four-corners-farm-case=/g)).toHaveLength(
      fourCornersFarmCaseCount,
    );
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.intro);
    expect(markup).toContain(copy.categoryLabel);
    expect(markup).toContain('id="four-corners-farm-what-is"');
    expect(markup).toContain(
      'aria-labelledby="four-corners-farm-what-is-heading"',
    );
    expect(markup).toContain(copy.whatIsHeading);
    expect(copy.whatIsParagraphs).toHaveLength(2);
    expect(markup).toContain(copy.casesDescription);
    expect(markup).toContain('id="four-corners-farm-cta"');
    expect(markup).toContain(
      'aria-labelledby="four-corners-farm-cta-heading"',
    );
    expect(markup).toContain(copy.ctaHeading);
    expect(markup).toContain(copy.ctaDescription);
    expect(markup).toContain(copy.ctaButtonLabel);
    expect(markup).toContain('id="four-corners-farm-how-to-heading"');
    expect(markup).toContain(copy.howToHeading);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup).toContain(copy.howToEyebrow);
    expect(markup).toContain(copy.faqEyebrow);
    expect(markup).toContain(copy.faqDescription);
    expect(markup).not.toContain("<details");
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(
      copy.faqs.length,
    );
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(
      fourCornersFarmCaseCount + 1,
    );
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(
      fourCornersFarmCaseCount + 1,
    );
    expect(markup.match(/download=""/g)).toHaveLength(
      fourCornersFarmCaseCount,
    );
    expect(markup).toContain(copy.downloadProjectLabel);
    expect(markup).not.toContain("four-corners-farm-case-navigation");
    expect(markup).not.toContain("data-four-corners-farm-quick-link");
    expect(markup).not.toContain('id="four-corners-farm-sources"');
    expect(markup).not.toContain("data-public-page-shell");
    expect(markup).not.toContain("<main");

    for (const layoutCase of copy.cases) {
      expect(layoutCase.imageWidth).toBe(fourCornersMapWidth);
      expect(layoutCase.imageHeight).toBe(fourCornersMapHeight);
      expect(markup).toContain(`data-four-corners-farm-case="${layoutCase.id}"`);
      expect(markup).toContain(`id="${layoutCase.id}"`);
      expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
      expect(markup).toContain(layoutCase.summary);
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(layoutCase.imageOriginalSrc).not.toBe(layoutCase.imageSrc);
      expect(layoutCase.imageOriginalSrc).toMatch(/\.webp$/);
      expect(markup).toContain(layoutCase.title);
      expect(markup).toContain(layoutCase.imageAlt);
    }

    for (const whatIsParagraph of copy.whatIsParagraphs) {
      expect(markup).toContain(whatIsParagraph);
    }

    for (const faq of copy.faqs) {
      expect(markup).toContain(faq.question);
      expect(markup).toContain(faq.answer);
    }

    for (const step of copy.howToSteps) {
      expect(markup).toContain(step.number);
      expect(markup).toContain(step.title);
      expect(markup).toContain(step.body);
    }
  },
);

test.each(fourCornersFarmLocales)(
  "links the Four Corners Farm planner CTA to the localized homepage in %s",
  (locale) => {
    const copy = getFourCornersFarmPageCopy(locale);
    const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
    const markup = renderToStaticMarkup(<FourCornersFarmPage locale={locale} />);

    expect(markup).toContain(`href="${plannerHref}"`);
    expect(markup).toContain('href="#four-corners-farm-layouts"');
    const localizedCtaSection = markup.match(
      /<section(?=[^>]*id="four-corners-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
    );
    expect(localizedCtaSection?.[1]).toContain(`href="${plannerHref}"`);
    expect(localizedCtaSection?.[1]).toContain(copy.ctaButtonLabel);
    expect(markup).toContain(copy.openPlannerLabel);
    expect(markup).toContain(copy.browseLabel);
  },
);
