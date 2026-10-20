import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getBeachFarmPageCopy } from "../../src/farm-layouts/beach-farm-content";
import { BeachFarmPage } from "../../src/farm-layouts/beach-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const beachFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];

test.each(beachFarmLocales)("renders all nine Beach Farm cases in %s", (locale) => {
  const copy = getBeachFarmPageCopy(locale);
  const markup = renderToStaticMarkup(<BeachFarmPage locale={locale} />);

  expect(markup).toContain('data-beach-farm-page="true"');
  expect(markup.match(/data-beach-farm-case=/g)).toHaveLength(9);
  expect(markup).not.toContain("data-beach-farm-quick-link");
  expect(markup).not.toContain("beach-farm-case-navigation");
  expect(markup).toContain('id="beach-farm-what-is"');
  expect(markup).toContain('aria-labelledby="beach-farm-what-is-heading"');
  expect(markup).toContain(copy.whatIsHeading);
  expect(copy.whatIsParagraphs).toHaveLength(2);
  expect(markup).toContain(copy.casesDescription);
  expect(markup).toContain('id="beach-farm-cta"');
  expect(markup).toContain('aria-labelledby="beach-farm-cta-heading"');
  expect(markup).toContain(copy.ctaHeading);
  expect(markup).toContain(copy.ctaDescription);
  expect(markup).toContain(copy.ctaButtonLabel);
  expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(markup).toContain('id="beach-farm-how-to-heading"');
  expect(markup).toContain(copy.howToEyebrow);
  expect(markup).toContain(copy.faqEyebrow);
  expect(markup).toContain(copy.faqDescription);
  expect(markup).not.toContain("<details");
  expect(markup.match(/aria-expanded="false"/g)).toHaveLength(copy.faqs.length);
  expect(markup).not.toContain("data-public-page-shell");
  expect(markup).not.toContain("<main");

  for (const layoutCase of copy.cases) {
    expect(markup).toContain(`data-beach-farm-case="${layoutCase.id}"`);
    expect(markup).toContain(`id="${layoutCase.id}"`);
    expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
    expect(markup).toContain(layoutCase.summary);
    expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
    expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
    expect(markup).not.toContain(
      `<link rel="preload" as="image" href="${layoutCase.imageOriginalSrc}"`,
    );
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

test.each(beachFarmLocales)("links the planner CTA to the localized homepage in %s", (locale) => {
  const copy = getBeachFarmPageCopy(locale);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
  const markup = renderToStaticMarkup(<BeachFarmPage locale={locale} />);

  expect(markup).toContain(`href="${plannerHref}"`);
  const localizedCtaSection = markup.match(
    /<section(?=[^>]*id="beach-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
  );
  expect(localizedCtaSection?.[1]).toContain(`href="${plannerHref}"`);
  expect(localizedCtaSection?.[1]).toContain(copy.ctaButtonLabel);
  expect(markup).toContain(copy.openPlannerLabel);
  expect(markup).toContain(copy.browseLabel);
});
