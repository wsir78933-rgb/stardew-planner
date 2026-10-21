import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getFrontierFarmPageCopy } from "../../src/farm-layouts/frontier-farm-content";
import { FrontierFarmPage } from "../../src/farm-layouts/frontier-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const frontierFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const frontierFarmCaseCount = 6;
const frontierMapWidth = 1920;
const frontierMapHeight = 800;
const expectedFrontierFarmCaseIds = [
  "02-cottagecore-terraces",
  "03-west-animals-east-crops",
  "04-tapper-honey-barn",
  "05-junimo-village",
  "06-ranch-ancient-fruit",
  "07-nine-fish-ponds",
] as const;

test.each(frontierFarmLocales)(
  "renders the independent cover and six Frontier Farm layouts in %s",
  (locale) => {
    const copy = getFrontierFarmPageCopy(locale);
    const markup = renderToStaticMarkup(<FrontierFarmPage locale={locale} />);

    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedFrontierFarmCaseIds,
    );
    expect(markup).toContain('data-frontier-farm-page="true"');
    expect(markup).toContain('data-frontier-farm-cover="true"');
    expect(markup.match(/data-frontier-farm-case=/g)).toHaveLength(
      frontierFarmCaseCount,
    );
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.intro.replaceAll("'", "&#x27;"));
    expect(markup).toContain(copy.categoryLabel);
    expect(markup).toContain(copy.cover.caption);
    expect(markup).toContain(`src="${copy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${copy.cover.imageOriginalSrc}"`);
    expect(markup).toContain(copy.cover.imageAlt);
    expect(copy.cover.imageWidth).toBe(frontierMapWidth);
    expect(copy.cover.imageHeight).toBe(frontierMapHeight);
    expect(copy.cover.imageOriginalSrc).not.toBe(copy.cover.imageSrc);
    expect(copy.cover.imageOriginalSrc).toMatch(/\.webp$/);
    expect(
      new Set([
        copy.cover.imageSrc,
        ...copy.cases.map((layoutCase) => layoutCase.imageSrc),
      ]).size,
    ).toBe(frontierFarmCaseCount + 1);
    expect(
      new Set([
        copy.cover.imageOriginalSrc,
        ...copy.cases.map((layoutCase) => layoutCase.imageOriginalSrc),
      ]).size,
    ).toBe(frontierFarmCaseCount + 1);
    expect(copy.cover.imageSrc).not.toBe(copy.cases[0]?.imageSrc);
    expect(copy.cover.imageOriginalSrc).not.toBe(
      copy.cases[0]?.imageOriginalSrc,
    );
    expect(markup).toContain('id="frontier-farm-what-is"');
    expect(markup).toContain(
      'aria-labelledby="frontier-farm-what-is-heading"',
    );
    expect(markup).toContain(copy.whatIsHeading);
    expect(copy.whatIsParagraphs).toHaveLength(2);
    expect(markup).toContain(copy.casesDescription);
    expect(markup).toContain('id="frontier-farm-cta"');
    expect(markup).toContain('aria-labelledby="frontier-farm-cta-heading"');
    expect(markup).toContain(copy.ctaHeading);
    expect(markup).toContain(copy.ctaDescription);
    expect(markup).toContain(copy.ctaButtonLabel);
    expect(markup).toContain('id="frontier-farm-how-to-heading"');
    expect(markup).toContain(copy.howToHeading);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup).toContain(copy.howToEyebrow);
    expect(markup).toContain(copy.faqEyebrow);
    expect(markup).toContain(copy.faqDescription);
    expect(markup).toContain('id="frontier-farm-faq"');
    expect(markup).not.toContain("<details");
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(
      copy.faqs.length,
    );
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(
      frontierFarmCaseCount + 1,
    );
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(
      frontierFarmCaseCount + 1,
    );
    expect(markup.match(/download=""/g)).toHaveLength(frontierFarmCaseCount);
    expect(markup).toContain(copy.downloadProjectLabel);
    expect(markup).not.toContain("frontier-farm-case-navigation");
    expect(markup).not.toContain("data-frontier-farm-quick-link");
    expect(markup).not.toContain('id="frontier-farm-sources"');
    expect(markup).not.toContain("data-public-page-shell");
    expect(markup).not.toContain("<main");

    for (const whatIsParagraph of copy.whatIsParagraphs) {
      expect(markup).toContain(whatIsParagraph);
    }

    for (const layoutCase of copy.cases) {
      expect(layoutCase.imageWidth).toBe(frontierMapWidth);
      expect(layoutCase.imageHeight).toBe(frontierMapHeight);
      expect(markup).toContain(`data-frontier-farm-case="${layoutCase.id}"`);
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

test.each(frontierFarmLocales)(
  "links the Frontier Farm planner CTA to the localized homepage in %s",
  (locale) => {
    const copy = getFrontierFarmPageCopy(locale);
    const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
    const markup = renderToStaticMarkup(<FrontierFarmPage locale={locale} />);

    expect(markup).toContain(`href="${plannerHref}"`);
    expect(markup).toContain('href="#frontier-farm-layouts"');
    const localizedCtaSection = markup.match(
      /<section(?=[^>]*id="frontier-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
    );
    expect(localizedCtaSection?.[1]).toContain(`href="${plannerHref}"`);
    expect(localizedCtaSection?.[1]).toContain(copy.ctaButtonLabel);
    expect(markup).toContain(copy.openPlannerLabel);
    expect(markup).toContain(copy.browseLabel);
  },
);
