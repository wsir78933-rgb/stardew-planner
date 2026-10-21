import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
} from "../../src/farm-layouts/hilltop-farm-content";
import { HilltopFarmPage } from "../../src/farm-layouts/hilltop-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const hilltopFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];

function escapeHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

test.each(hilltopFarmLocales)("renders all seven Hilltop Farm layouts in %s", (locale) => {
  const copy = getHilltopFarmPageCopy(locale);
  const featuredCase = getFeaturedHilltopFarmCase(locale);
  const markup = renderToStaticMarkup(<HilltopFarmPage locale={locale} />);
  const renderedCaseIds = Array.from(
    markup.matchAll(/data-hilltop-farm-case="([^"]+)"/gu),
    ([, caseId]) => caseId,
  );

  expect(markup).toContain('data-hilltop-farm-page="true"');
  expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
  expect(markup.match(/data-hilltop-farm-case=/gu) ?? []).toHaveLength(7);
  expect(renderedCaseIds).toEqual(copy.cases.map(({ id }) => id));
  expect(markup).toContain(escapeHtmlText(copy.title));
  expect(markup).toContain(escapeHtmlText(copy.whatIsHeading));
  expect(markup).toContain(escapeHtmlText(copy.casesDescription));
  expect(markup).toContain(escapeHtmlText(copy.ctaHeading));
  expect(markup).toContain(escapeHtmlText(copy.ctaDescription));
  expect(markup).toContain(escapeHtmlText(copy.ctaButtonLabel));
  expect(featuredCase.id).toBe(copy.cases[0]?.id);
  expect(markup.indexOf(featuredCase.imageSrc)).toBeLessThan(
    markup.indexOf('id="hilltop-farm-layouts"'),
  );
  expect(markup).toContain('id="hilltop-farm-what-is"');
  expect(markup).toContain('id="hilltop-farm-layouts"');
  expect(markup).toContain('id="hilltop-farm-cta"');

  for (const farmCase of copy.cases) {
    expect(markup).toContain(`data-hilltop-farm-case="${farmCase.id}"`);
    expect(markup).toContain(`id="${farmCase.id}"`);
    expect(markup).toContain(`download="" href="${farmCase.projectHref}"`);
    expect(markup).toContain(escapeHtmlText(farmCase.title));
    expect(markup).toContain(escapeHtmlText(farmCase.summary));
    expect(markup).toContain(`src="${farmCase.imageSrc}"`);
    expect(markup).toContain(`src="${farmCase.imageOriginalSrc}"`);
    expect(markup).toContain(escapeHtmlText(farmCase.imageAlt));
  }

  for (const paragraph of copy.whatIsParagraphs) {
    expect(markup).toContain(escapeHtmlText(paragraph));
  }
  for (const faq of copy.faqs) {
    expect(markup).toContain(escapeHtmlText(faq.question));
    expect(markup).toContain(escapeHtmlText(faq.answer));
  }
  for (const step of copy.howToSteps) {
    expect(markup).toContain(escapeHtmlText(step.number));
    expect(markup).toContain(escapeHtmlText(step.title));
    expect(markup).toContain(escapeHtmlText(step.body));
  }
});

test.each(hilltopFarmLocales)("links the planner actions to the localized homepage in %s", (locale) => {
  const copy = getHilltopFarmPageCopy(locale);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
  const markup = renderToStaticMarkup(<HilltopFarmPage locale={locale} />);
  const ctaSectionMarkup = markup.match(
    /<section(?=[^>]*id="hilltop-farm-cta")[^>]*>([\s\S]*?)<\/section>/u,
  );

  expect(markup).toContain(`href="${plannerHref}"`);
  expect(ctaSectionMarkup?.[1]).toContain(`href="${plannerHref}"`);
  expect(ctaSectionMarkup?.[1]).toContain(escapeHtmlText(copy.ctaButtonLabel));
  expect(markup).toContain(escapeHtmlText(copy.openPlannerLabel));
  expect(markup).toContain(escapeHtmlText(copy.browseLabel));
});
