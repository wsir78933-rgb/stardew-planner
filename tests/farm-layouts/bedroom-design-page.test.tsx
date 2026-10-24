import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishBedroomDesignPage, {
  dynamic as englishBedroomDesignDynamic,
  metadata as englishBedroomDesignMetadata,
} from "../../app/(en)/stardew-valley-bedroom-design/page";
import ChineseBedroomDesignPage, {
  dynamic as chineseBedroomDesignDynamic,
  metadata as chineseBedroomDesignMetadata,
} from "../../app/zh/stardew-valley-bedroom-design/page";
import {
  bedroomDesignCanonicalPath,
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
} from "../../src/farm-layouts/bedroom-design-content";
import { BedroomDesignPage } from "../../src/farm-layouts/bedroom-design-page";
import { createBedroomDesignPageStructuredData } from "../../src/farm-layouts/bedroom-design-structured-data";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

const expectedBedroomDesignCaseNumbers = ["02", "03", "04", "05", "06", "07"] as const;

type BedroomDesignStructuredData = Readonly<{
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

function escapeBedroomDesignHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function readBedroomDesignStructuredData(
  markup: string,
): BedroomDesignStructuredData {
  const serializedStructuredData = markup.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u,
  )?.[1];
  if (serializedStructuredData === undefined) {
    throw new Error(
      `Bedroom Design route markup is missing JSON-LD. Received markup length: ${markup.length}.`,
    );
  }

  return JSON.parse(serializedStructuredData) as BedroomDesignStructuredData;
}

it.each(["en", "zh-CN"] as const)(
  "renders a separate Bedroom Design cover and six ordered cases in %s",
  (locale: PublicLocale) => {
    const pageCopy = getBedroomDesignPageCopy(locale);
    const featuredCase = getFeaturedBedroomDesignCase(locale);
    const markup = renderToStaticMarkup(
      <BedroomDesignPage locale={locale} />,
    );
    const renderedCaseIds = Array.from(
      markup.matchAll(/data-bedroom-design-case="([^"]+)"/gu),
      ([, caseId]) => caseId,
    );
    const bedroomDesignCaseNumbers = pageCopy.cases.map((bedroomCase) =>
      bedroomCase.id.slice(0, 2),
    );

    expect(bedroomDesignCanonicalPath).toBe(
      "/stardew-valley-bedroom-design",
    );
    expect(pageCopy.heading).toBe(
      locale === "en"
        ? "Stardew Valley Bedroom Design"
        : "星露谷物语卧室设计",
    );
    expect(markup).toContain('data-bedroom-design-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup).toContain(
      `>${escapeBedroomDesignHtmlText(pageCopy.heading)}</h1>`,
    );
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup.match(/data-bedroom-design-case=/gu) ?? []).toHaveLength(6);
    expect(markup.match(/data-bedroom-design-featured-case=/gu) ?? []).toHaveLength(1);
    expect(markup.match(/download=""/gu) ?? []).toHaveLength(6);
    expect(markup.match(/data-layout-image-trigger="true"/gu) ?? []).toHaveLength(7);
    expect(renderedCaseIds).toEqual(pageCopy.cases.map(({ id }) => id));
    expect(featuredCase.id.slice(0, 2)).toBe("01");
    expect(bedroomDesignCaseNumbers).toEqual(expectedBedroomDesignCaseNumbers);
    expect(pageCopy.cases.map(({ id }) => id)).not.toContain(featuredCase.id);
    expect(markup).toContain(
      `data-bedroom-design-featured-case="${featuredCase.id}"`,
    );
    expect(markup).not.toContain(featuredCase.projectHref);
    expect(markup).toContain(
      escapeBedroomDesignHtmlText(featuredCase.title),
    );
    expect(markup).toContain(featuredCase.imageSrc);
    expect(markup).toContain(featuredCase.imageOriginalSrc);
    expect(markup.indexOf(featuredCase.imageSrc)).toBeLessThan(
      markup.indexOf(`data-bedroom-design-case="${pageCopy.cases[0]?.id}"`),
    );
    for (const bedroomCase of [featuredCase, ...pageCopy.cases]) {
      expect(bedroomCase.imageWidth).toBe(2240);
      expect(bedroomCase.imageHeight).toBe(1472);
      expect(markup).toContain(bedroomCase.imageSrc);
      expect(markup).toContain(bedroomCase.imageOriginalSrc);
      expect(markup).toContain(escapeBedroomDesignHtmlText(bedroomCase.imageAlt));
    }
    for (const bedroomCase of pageCopy.cases) {
      expect(markup).toContain(escapeBedroomDesignHtmlText(bedroomCase.title));
      expect(markup).toContain(escapeBedroomDesignHtmlText(bedroomCase.summary));
      expect(markup).toContain(bedroomCase.projectHref);
    }

    for (const faq of pageCopy.faqs) {
      expect(markup).toContain(escapeBedroomDesignHtmlText(faq.question));
      expect(markup).toContain(escapeBedroomDesignHtmlText(faq.answer));
    }
    for (const howToStep of pageCopy.howToSteps) {
      expect(markup).toContain(escapeBedroomDesignHtmlText(howToStep.number));
      expect(markup).toContain(escapeBedroomDesignHtmlText(howToStep.title));
      expect(markup).toContain(escapeBedroomDesignHtmlText(howToStep.body));
    }
  },
);

it("publishes bilingual Bedroom Design metadata with the independent cover image", () => {
  const englishCopy = getBedroomDesignPageCopy("en");
  const chineseCopy = getBedroomDesignPageCopy("zh-CN");
  const englishFeaturedCase = getFeaturedBedroomDesignCase("en");
  const chineseFeaturedCase = getFeaturedBedroomDesignCase("zh-CN");
  const englishCanonicalUrl = createCanonicalUrl(bedroomDesignCanonicalPath);
  const chineseCanonicalUrl = createCanonicalUrl(
    `/zh${bedroomDesignCanonicalPath}`,
  );

  expect(englishBedroomDesignDynamic).toBe("force-static");
  expect(chineseBedroomDesignDynamic).toBe("force-static");
  expect(englishBedroomDesignMetadata).toMatchObject({
    title: englishCopy.metaTitle,
    description: englishCopy.description,
    alternates: {
      canonical: englishCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
        "x-default": englishCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(englishFeaturedCase.imageSrc)] },
  });
  expect(chineseBedroomDesignMetadata).toMatchObject({
    title: chineseCopy.metaTitle,
    description: chineseCopy.description,
    alternates: {
      canonical: chineseCanonicalUrl,
      languages: {
        en: englishCanonicalUrl,
        "zh-CN": chineseCanonicalUrl,
        "x-default": englishCanonicalUrl,
      },
    },
    openGraph: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
    twitter: { images: [createCanonicalUrl(chineseFeaturedCase.imageSrc)] },
  });
  expect(englishBedroomDesignMetadata.robots).toBeUndefined();
  expect(chineseBedroomDesignMetadata.robots).toBeUndefined();
});

it.each([
  {
    locale: "en",
    page: EnglishBedroomDesignPage,
    pageCopy: getBedroomDesignPageCopy("en"),
    featuredCase: getFeaturedBedroomDesignCase("en"),
  },
  {
    locale: "zh-CN",
    page: ChineseBedroomDesignPage,
    pageCopy: getBedroomDesignPageCopy("zh-CN"),
    featuredCase: getFeaturedBedroomDesignCase("zh-CN"),
  },
] as const)(
  "publishes six ordered Bedroom Design cases in JSON-LD for $locale",
  (route) => {
    const markup = renderToStaticMarkup(createElement(route.page));
    const structuredData = readBedroomDesignStructuredData(markup);
    const pagePath =
      route.locale === "en"
        ? bedroomDesignCanonicalPath
        : `/zh${bedroomDesignCanonicalPath}`;
    const pageUrl = createCanonicalUrl(pagePath);

    expect(markup).toContain('data-public-page-shell="true"');
    expect(markup).toContain('data-bedroom-design-page="true"');
    expect(markup.match(/data-bedroom-design-case=/gu) ?? []).toHaveLength(6);
    expect(structuredData).toMatchObject({
      "@type": "CollectionPage",
      name: route.pageCopy.title,
      description: route.pageCopy.description,
      inLanguage: route.locale,
      url: pageUrl,
      primaryImageOfPage: {
        contentUrl: createCanonicalUrl(route.featuredCase.imageSrc),
        caption: route.featuredCase.imageAlt,
        width: 2240,
        height: 1472,
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 6,
      },
    });
    expect(structuredData.mainEntity.itemListElement).toEqual(
      route.pageCopy.cases.map((bedroomCase, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: bedroomCase.title,
        description: bedroomCase.summary,
        url: `${pageUrl}#${bedroomCase.id}`,
      })),
    );
  },
);
