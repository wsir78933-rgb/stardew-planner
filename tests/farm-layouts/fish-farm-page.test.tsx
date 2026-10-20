import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getFeaturedFishFarmCase, getFishFarmPageCopy } from "../../src/farm-layouts/fish-farm-content";
import { FishFarmPage } from "../../src/farm-layouts/fish-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const fishFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];

function escapeHtmlText(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

test.each(fishFarmLocales)("renders all six Fish Farm layouts in %s", (locale) => {
  const copy = getFishFarmPageCopy(locale);
  const featuredCase = getFeaturedFishFarmCase(locale);
  const markup = renderToStaticMarkup(<FishFarmPage locale={locale} />);

  expect(markup).toContain('data-fish-farm-page="true"');
  expect(markup.match(/data-fish-farm-case=/g)).toHaveLength(6);
  expect(markup).toContain('id="fish-farm-what-is"');
  expect(markup).toContain('aria-labelledby="fish-farm-what-is-heading"');
  expect(markup).toContain(copy.whatIsHeading);
  expect(markup).toContain(copy.casesDescription);
  expect(markup).toContain('id="fish-farm-cta"');
  expect(markup).toContain('aria-labelledby="fish-farm-cta-heading"');
  expect(markup).toContain(copy.ctaHeading);
  expect(markup).toContain(copy.ctaDescription);
  expect(markup).toContain(copy.ctaButtonLabel);
  expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(markup).toContain('id="fish-farm-how-to-heading"');
  expect(markup).toContain(copy.howToEyebrow);
  expect(markup).toContain(copy.faqEyebrow);
  expect(markup).toContain(copy.faqDescription);
  expect(markup).not.toContain("<details");
  expect(markup.match(/aria-expanded="false"/g)).toHaveLength(copy.faqs.length);
  expect(markup).not.toContain("data-public-page-shell");
  expect(markup).not.toContain("<main");
  expect(markup.indexOf(featuredCase.imageSrc)).toBeLessThan(
    markup.indexOf(copy.cases[0]?.imageSrc ?? ""),
  );

  for (const layoutCase of copy.cases) {
    expect(markup).toContain(`data-fish-farm-case="${layoutCase.id}"`);
    expect(markup).toContain(`id="${layoutCase.id}"`);
    expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
    expect(markup).toContain(layoutCase.summary);
    expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
    expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
    expect(markup).toContain(layoutCase.title);
    expect(markup).toContain(layoutCase.imageAlt);
  }

  for (const paragraph of copy.whatIsParagraphs) {
    expect(markup).toContain(paragraph);
  }

  for (const faq of copy.faqs) {
    expect(markup).toContain(faq.question);
    expect(markup).toContain(faq.answer);
  }

  for (const step of copy.howToSteps) {
    expect(markup).toContain(step.number);
    expect(markup).toContain(step.title);
    expect(markup).toContain(escapeHtmlText(step.body));
  }
});

test.each(fishFarmLocales)("links both planner calls to the localized homepage in %s", (locale) => {
  const copy = getFishFarmPageCopy(locale);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
  const markup = renderToStaticMarkup(<FishFarmPage locale={locale} />);

  expect(markup).toContain(`href="${plannerHref}"`);
  const ctaSectionMarkup = markup.match(
    /<section(?=[^>]*id="fish-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
  );
  expect(ctaSectionMarkup?.[1]).toContain(`href="${plannerHref}"`);
  expect(ctaSectionMarkup?.[1]).toContain(copy.ctaButtonLabel);
  expect(markup).toContain(copy.openPlannerLabel);
  expect(markup).toContain(copy.browseLabel);
});
