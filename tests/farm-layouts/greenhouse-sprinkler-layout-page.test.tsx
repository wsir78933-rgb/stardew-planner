import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import type { PublicLocale } from "../../src/i18n/public-locale";
import { getGreenhouseSprinklerLayoutPageCopy } from "../../src/farm-layouts/greenhouse-sprinkler-layout-content";
import { GreenhouseSprinklerLayoutPage } from "../../src/farm-layouts/greenhouse-sprinkler-layout-page";

const greenhouseSprinklerLayoutLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const greenhouseSprinklerLayoutCaseStems = [
  "02-greenhouse-iridium-sprinkler-layout",
  "03-stardew-valley-greenhouse-layout-quality-sprinklers",
  "04-best-sprinkler-layout-stardew-valley-greenhouse",
  "05-optimal-sprinkler-layout-stardew-greenhouse",
  "06-greenhouse-sprinkler-layout-stardew-mixed",
  "07-greenhouse-sprinkler-layout-stardew-symmetry",
] as const;
const greenhouseSprinklerLayoutSectionIds = [
  'id="greenhouse-sprinkler-layout-page-title"',
  'id="greenhouse-sprinkler-layout-what-is"',
  'id="greenhouse-sprinkler-layout-layouts"',
  'id="greenhouse-sprinkler-layout-how-to-heading"',
  'id="greenhouse-sprinkler-layout-faq"',
  'id="greenhouse-sprinkler-layout-cta"',
] as const;

function decodeGreenhouseSprinklerLayoutMarkup(markup: string): string {
  return markup
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

test.each(greenhouseSprinklerLayoutLocales)(
  "renders the greenhouse sprinkler cover, six cases, and shared sections in %s",
  (locale) => {
    const copy = getGreenhouseSprinklerLayoutPageCopy(locale);
    const markup = renderToStaticMarkup(
      <GreenhouseSprinklerLayoutPage locale={locale} />,
    );
    const visibleMarkup = decodeGreenhouseSprinklerLayoutMarkup(markup);

    expect(markup).toContain('data-greenhouse-sprinkler-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(
      markup.match(/data-greenhouse-sprinkler-layout-cover="true"/g),
    ).toHaveLength(1);
    expect(markup.match(/data-greenhouse-sprinkler-layout-case=/g)).toHaveLength(6);
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(7);
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(7);
    expect(markup.match(/download=""/g)).toHaveLength(6);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(
      copy.faqs.length,
    );
    expect(markup).not.toContain("data-layout-image-zoom");
    expect(markup).not.toContain("<hr");

    expect(visibleMarkup).toContain(copy.title);
    expect(visibleMarkup).toContain(copy.intro);
    expect(visibleMarkup).toContain(copy.categoryLabel);
    expect(visibleMarkup).toContain(copy.cover.caption);
    expect(visibleMarkup).toContain(copy.cover.imageAlt);
    expect(copy.cover.imageWidth).toBe(640);
    expect(copy.cover.imageHeight).toBe(768);
    expect(copy.cover.imageSrc).toBe(copy.cover.imageOriginalSrc);
    expect(copy.cover.imageSrc).toMatch(/\.webp$/);
    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      greenhouseSprinklerLayoutCaseStems,
    );
    for (const paragraph of copy.whatIsParagraphs) {
      expect(visibleMarkup).toContain(paragraph);
    }

    for (const layoutCase of copy.cases) {
      expect(markup).toContain(
        `data-greenhouse-sprinkler-layout-case="${layoutCase.id}"`,
      );
      expect(markup).toContain(
        `id="greenhouse-sprinkler-layout-${layoutCase.id}"`,
      );
      expect(markup).toContain(
        `download="" href="${layoutCase.projectHref}"`,
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(visibleMarkup).toContain(layoutCase.imageAlt);
      expect(visibleMarkup).toContain(layoutCase.title);
      expect(visibleMarkup).toContain(layoutCase.summary);
      expect(layoutCase.imageWidth).toBe(640);
      expect(layoutCase.imageHeight).toBe(768);
      expect(layoutCase.imageSrc).toBe(layoutCase.imageOriginalSrc);
      expect(layoutCase.imageSrc).toMatch(/\.webp$/);
    }

    const plannerHref = locale === "zh-CN" ? "/zh#planner" : "/#planner";
    expect(markup.split(`href="${plannerHref}"`)).toHaveLength(4);

    let previousSectionIndex = -1;
    for (const sectionId of greenhouseSprinklerLayoutSectionIds) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }
  },
);
