import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getForestFarmPageCopy } from "../../src/farm-layouts/forest-farm-content";
import { ForestFarmPage } from "../../src/farm-layouts/forest-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const forestFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const forestFarmCaseCount = 6;
const forestMapWidth = 1600;
const forestMapHeight = 1300;

test.each(forestFarmLocales)("renders all six Forest Farm maps in %s", (locale) => {
  const copy = getForestFarmPageCopy(locale);
  const markup = renderToStaticMarkup(<ForestFarmPage locale={locale} />);

  expect(markup).toContain('data-forest-farm-page="true"');
  expect(markup.match(/data-forest-farm-case=/g)).toHaveLength(
    forestFarmCaseCount,
  );
  expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(markup).toContain(copy.title);
  expect(markup).toContain(copy.intro);
  expect(markup).toContain(copy.categoryLabel);
  expect(markup).toContain('id="forest-farm-what-is"');
  expect(markup).toContain('aria-labelledby="forest-farm-what-is-heading"');
  expect(markup).toContain(copy.whatIsHeading);
  expect(copy.whatIsParagraphs).toHaveLength(2);
  expect(markup).toContain(copy.casesDescription);
  expect(markup).toContain('id="forest-farm-cta"');
  expect(markup).toContain('aria-labelledby="forest-farm-cta-heading"');
  expect(markup).toContain(copy.ctaHeading);
  expect(markup).toContain(copy.ctaDescription);
  expect(markup).toContain(copy.ctaButtonLabel);
  expect(markup).toContain('id="forest-farm-how-to-heading"');
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
    forestFarmCaseCount + 1,
  );
  expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(
    forestFarmCaseCount + 1,
  );
  expect(markup.match(/download=""/g)).toHaveLength(forestFarmCaseCount);
  expect(markup).toContain(copy.downloadProjectLabel);
  expect(markup).not.toContain("forest-farm-case-navigation");
  expect(markup).not.toContain("data-forest-farm-quick-link");
  expect(markup).not.toContain('id="forest-farm-sources"');
  expect(markup).not.toContain("data-public-page-shell");
  expect(markup).not.toContain("<main");

  for (const layoutCase of copy.cases) {
    expect(layoutCase.imageWidth).toBe(forestMapWidth);
    expect(layoutCase.imageHeight).toBe(forestMapHeight);
    expect(markup).toContain(`data-forest-farm-case="${layoutCase.id}"`);
    expect(markup).toContain(`id="${layoutCase.id}"`);
    expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
    expect(markup).toContain(layoutCase.summary);
    expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
    expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
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
});

test.each(forestFarmLocales)(
  "links the Forest Farm planner CTA to the localized homepage in %s",
  (locale) => {
    const copy = getForestFarmPageCopy(locale);
    const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
    const markup = renderToStaticMarkup(<ForestFarmPage locale={locale} />);

    expect(markup).toContain(`href="${plannerHref}"`);
    expect(markup).toContain('href="#forest-farm-layouts"');
    const localizedCtaSection = markup.match(
      /<section(?=[^>]*id="forest-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
    );
    expect(localizedCtaSection?.[1]).toContain(`href="${plannerHref}"`);
    expect(localizedCtaSection?.[1]).toContain(copy.ctaButtonLabel);
    expect(markup).toContain(copy.openPlannerLabel);
    expect(markup).toContain(copy.browseLabel);
  },
);
