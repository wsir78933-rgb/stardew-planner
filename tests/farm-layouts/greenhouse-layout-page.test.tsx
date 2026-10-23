import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishGreenhouseLayoutPage, {
  dynamic as englishGreenhouseLayoutDynamic,
  metadata as englishGreenhouseLayoutMetadata,
} from "../../app/(en)/stardew-greenhouse-layout/page";
import ChineseGreenhouseLayoutPage, {
  dynamic as chineseGreenhouseLayoutDynamic,
  metadata as chineseGreenhouseLayoutMetadata,
} from "../../app/zh/stardew-greenhouse-layout/page";
import sitemap from "../../app/sitemap";
import {
  getFeaturedGreenhouseLayoutCase,
  getGreenhouseLayoutPageCopy,
  greenhouseLayoutCanonicalPath,
} from "../../src/farm-layouts/greenhouse-layout-content";
import {
  GreenhouseLayoutPage,
} from "../../src/farm-layouts/greenhouse-layout-page";
import {
  createGreenhouseLayoutPageStructuredData,
} from "../../src/farm-layouts/greenhouse-layout-structured-data";
import {
  canonicalPublicPaths,
  getLocalizedIndexablePublicRouteEntries,
} from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

const expectedGreenhouseLayoutCaseIds = [
  "01-stardew-greenhouse-layout",
  "02-best-greenhouse-layout-stardew",
  "03-greenhouse-setup-stardew",
  "04-optimal-stardew-valley-greenhouse-layout",
  "05-best-greenhouse-setup-stardew",
  "06-ideal-greenhouse-layout-stardew",
  "07-stardew-greenhouse-layout-packed",
] as const;

type GreenhouseLayoutStructuredData = Readonly<{
  "@type": string;
  name: string;
  description: string;
  inLanguage: string;
  url: string;
  primaryImageOfPage: Readonly<{
    contentUrl: string;
    caption: string;
    width: number;
    height: number;
  }>;
  mainEntity: Readonly<{
    "@type": string;
    numberOfItems: number;
    itemListElement: readonly Readonly<{
      position: number;
      name: string;
      description: string;
      url: string;
    }>[];
  }>;
}>;

function escapeHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function readGreenhouseLayoutStructuredData(
  markup: string,
): GreenhouseLayoutStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error("Greenhouse Layout route markup is missing its JSON-LD script.");
  }

  return JSON.parse(serializedStructuredData) as GreenhouseLayoutStructuredData;
}

it.each(["en", "zh-CN"] as const)(
  "renders the selected Greenhouse Layout cover and seven filename-keyed cases in %s",
  (locale: PublicLocale) => {
    const pageCopy = getGreenhouseLayoutPageCopy(locale);
    const featuredCase = getFeaturedGreenhouseLayoutCase(locale);
    const markup = renderToStaticMarkup(<GreenhouseLayoutPage locale={locale} />);
    const renderedCaseIds = Array.from(
      markup.matchAll(/data-greenhouse-layout-case="([^"]+)"/gu),
      ([, caseId]) => caseId,
    );

    expect(markup).toContain('data-greenhouse-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup).toContain(`>${escapeHtmlText(pageCopy.heading)}</h1>`);
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup.match(/data-greenhouse-layout-case=/gu) ?? []).toHaveLength(7);
    expect(markup.match(/download=""/gu) ?? []).toHaveLength(7);
    expect(markup.match(/type="image\/avif"/gu) ?? []).toHaveLength(8);
    expect(renderedCaseIds).toEqual(expectedGreenhouseLayoutCaseIds);
    expect(featuredCase.id).toBe(expectedGreenhouseLayoutCaseIds[0]);
    expect(pageCopy.cases.map(({ id }) => id)).toEqual(expectedGreenhouseLayoutCaseIds);
    expect(markup.indexOf(`src="${featuredCase.imageSrc}"`)).toBeLessThan(
      markup.indexOf('id="greenhouse-layout-cases"'),
    );
    expect(markup).toContain(`src="${featuredCase.imageOriginalSrc}"`);

    for (const [caseIndex, layoutCase] of pageCopy.cases.entries()) {
      const expectedCaseId = expectedGreenhouseLayoutCaseIds[caseIndex];
      if (expectedCaseId === undefined) {
        throw new Error(
          `Unexpected Greenhouse Layout case at index ${caseIndex}; received ${JSON.stringify(layoutCase.id)}.`,
        );
      }

      expect(layoutCase.id).toBe(expectedCaseId);
      expect(layoutCase.imageWidth).toBe(640);
      expect(layoutCase.imageHeight).toBe(768);
      expect(markup).toContain(`id="${layoutCase.id}"`);
      expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(markup).toContain(escapeHtmlText(layoutCase.title));
      expect(markup).toContain(escapeHtmlText(layoutCase.summary));
      expect(markup).toContain(escapeHtmlText(layoutCase.imageAlt));
    }

    expect(markup).toContain(escapeHtmlText(pageCopy.whatIsHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.casesHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.howToHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.faqHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.ctaHeading));
    expect(markup).toContain(
      locale === "zh-CN" ? 'href="/zh#planner"' : 'href="/#planner"',
    );

    for (const paragraph of pageCopy.whatIsParagraphs) {
      expect(markup).toContain(escapeHtmlText(paragraph));
    }
    for (const faq of pageCopy.faqs) {
      expect(markup).toContain(escapeHtmlText(faq.question));
      expect(markup).toContain(escapeHtmlText(faq.answer));
    }
    for (const howToStep of pageCopy.howToSteps) {
      expect(markup).toContain(escapeHtmlText(howToStep.number));
      expect(markup).toContain(escapeHtmlText(howToStep.title));
      expect(markup).toContain(escapeHtmlText(howToStep.body));
    }
  },
);

it("registers both Greenhouse Layout routes with localized canonical metadata", () => {
  const englishCopy = getGreenhouseLayoutPageCopy("en");
  const chineseCopy = getGreenhouseLayoutPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedGreenhouseLayoutCase("en");
  const chineseFeaturedCase = getFeaturedGreenhouseLayoutCase("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(greenhouseLayoutCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(`/zh${greenhouseLayoutCanonicalPath}`);
  const localizedGreenhouseEntries = getLocalizedIndexablePublicRouteEntries().filter(
    ({ canonicalPath }) => canonicalPath === greenhouseLayoutCanonicalPath,
  );

  expect(greenhouseLayoutCanonicalPath).toBe("/stardew-greenhouse-layout");
  expect(canonicalPublicPaths).toContain(greenhouseLayoutCanonicalPath);
  expect(localizedGreenhouseEntries).toEqual([
    {
      locale: "en",
      canonicalPath: greenhouseLayoutCanonicalPath,
      pathname: greenhouseLayoutCanonicalPath,
    },
    {
      locale: "zh-CN",
      canonicalPath: greenhouseLayoutCanonicalPath,
      pathname: `/zh${greenhouseLayoutCanonicalPath}`,
    },
  ]);
  expect(sitemap().map(({ url }) => new URL(url).pathname)).toContain(
    greenhouseLayoutCanonicalPath,
  );
  expect(sitemap().map(({ url }) => new URL(url).pathname)).toContain(
    `/zh${greenhouseLayoutCanonicalPath}`,
  );
  expect(englishGreenhouseLayoutDynamic).toBe("force-static");
  expect(chineseGreenhouseLayoutDynamic).toBe("force-static");

  expect(englishGreenhouseLayoutMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: englishCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
  });
  expect(chineseGreenhouseLayoutMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: chineseCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
  });
  expect(englishGreenhouseLayoutMetadata.robots).toBeUndefined();
  expect(chineseGreenhouseLayoutMetadata.robots).toBeUndefined();
});

it("publishes seven ordered Greenhouse Layout cases in CollectionPage JSON-LD", () => {
  const localizedRoutes = [
    {
      locale: "en",
      page: EnglishGreenhouseLayoutPage,
      copy: getGreenhouseLayoutPageCopy("en"),
      featuredCase: getFeaturedGreenhouseLayoutCase("en"),
    },
    {
      locale: "zh-CN",
      page: ChineseGreenhouseLayoutPage,
      copy: getGreenhouseLayoutPageCopy("zh-CN"),
      featuredCase: getFeaturedGreenhouseLayoutCase("zh-CN"),
    },
  ] as const;

  for (const route of localizedRoutes) {
    const markup = renderToStaticMarkup(createElement(route.page));
    const structuredData = readGreenhouseLayoutStructuredData(markup);
    const pagePath = route.locale === "en"
      ? greenhouseLayoutCanonicalPath
      : `/zh${greenhouseLayoutCanonicalPath}`;
    const pageUrl = createCanonicalUrl(pagePath);

    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-greenhouse-layout-page="true"');
    expect(markup.match(/data-greenhouse-layout-case=/gu) ?? []).toHaveLength(7);
    expect(structuredData).toMatchObject({
      "@type": "CollectionPage",
      name: route.copy.title,
      description: route.copy.description,
      inLanguage: route.locale,
      url: pageUrl,
      primaryImageOfPage: {
        contentUrl: createCanonicalUrl(route.featuredCase.imageSrc),
        caption: route.featuredCase.imageAlt,
        width: 640,
        height: 768,
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 7,
      },
    });
    expect(structuredData.mainEntity.itemListElement).toHaveLength(7);
    expect(structuredData.mainEntity.itemListElement.map(({ position }) => position))
      .toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(structuredData.mainEntity.itemListElement.map(({ name }) => name))
      .toEqual(route.copy.cases.map(({ title }) => title));
    expect(structuredData.mainEntity.itemListElement.map(({ description }) => description))
      .toEqual(route.copy.cases.map(({ summary }) => summary));
    expect(structuredData.mainEntity.itemListElement.map(({ url }) => url))
      .toEqual(route.copy.cases.map(({ id }) => `${pageUrl}#${id}`));
  }
});
