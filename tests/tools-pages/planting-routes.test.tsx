import { expect, it } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import { createCanonicalUrl } from "../../src/seo/public-site-url";
import {
  createCropGrowthHref,
  createCropGrowthToolHref,
} from "../../src/tools-pages/planting-tool-href";
import { createCropGrowthRedirectHref } from "../../src/tools-pages/crop-growth-redirect";
import { metadata as englishProfitMetadata } from "../../app/(en)/tools/crop-profit/page";
import { metadata as englishGrowthMetadata } from "../../app/(en)/tools/crop-growth/page";
import { metadata as chineseProfitMetadata } from "../../app/zh/tools/crop-profit/page";
import { metadata as chineseGrowthMetadata } from "../../app/zh/tools/crop-growth/page";

const localizedGrowthRoutes = [
  { locale: "en", pathname: "/tools/crop-growth" },
  { locale: "zh-CN", pathname: "/zh/tools/crop-growth" },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  pathname: string;
}>[];

const plantingPageMetadataCases = [
  {
    locale: "en",
    tool: "profit",
    pathname: "/tools/crop-profit",
    title: "Stardew Valley Crop Profit Calculator",
    metadata: englishProfitMetadata,
  },
  {
    locale: "en",
    tool: "growth",
    pathname: "/tools/crop-growth",
    title: "Stardew Valley Crop Growth Calculator",
    metadata: englishGrowthMetadata,
  },
  {
    locale: "zh-CN",
    tool: "profit",
    pathname: "/tools/crop-profit",
    title: "星露谷物语作物收益计算器",
    metadata: chineseProfitMetadata,
  },
  {
    locale: "zh-CN",
    tool: "growth",
    pathname: "/tools/crop-growth",
    title: "星露谷物语作物生长计算器与收获日历",
    metadata: chineseGrowthMetadata,
  },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  tool: "profit" | "growth";
  pathname: string;
  title: string;
  metadata: typeof englishProfitMetadata;
}>[];

it.each(localizedGrowthRoutes)(
  "builds the dedicated growth route for $locale",
  ({ locale, pathname }) => {
    expect(createCropGrowthToolHref(locale)).toBe(pathname);
  },
);

it.each(localizedGrowthRoutes)(
  "adds a selected crop to the dedicated growth route for $locale",
  ({ locale, pathname }) => {
    expect(createCropGrowthHref(locale, "cranberries")).toBe(
      `${pathname}?crop=cranberries`,
    );
  },
);

it.each(localizedGrowthRoutes)(
  "redirects the legacy growth route and preserves its selected crop for $locale",
  ({ locale, pathname }) => {
    expect(createCropGrowthRedirectHref(locale, "cranberries")).toBe(
      `${pathname}?crop=cranberries`,
    );
    expect(createCropGrowthRedirectHref(locale, null)).toBe(pathname);
  },
);

it("fails fast with the received empty crop id", () => {
  const invalidCropId = "   ";

  expect(() => createCropGrowthHref("en", invalidCropId)).toThrow(
    `Received: ${JSON.stringify(invalidCropId)}`,
  );
});

it.each(plantingPageMetadataCases)(
  "keeps localized $tool page metadata on $locale",
  ({ locale, tool, pathname, title, metadata }) => {
    const canonicalUrl = createCanonicalUrl(
      locale === "en" ? pathname : `/zh${pathname}`,
    );
    const englishUrl = createCanonicalUrl(pathname);
    const chineseUrl = createCanonicalUrl(`/zh${pathname}`);
    const pageCopy = getToolsPageCopy(locale)[tool];

    expect(metadata.title).toBe(title);
    expect(metadata.description).toBe(pageCopy.metaDescription);
    expect(metadata.alternates?.canonical).toBe(canonicalUrl);
    expect(metadata.alternates?.languages).toMatchObject({
      en: englishUrl,
      "zh-CN": chineseUrl,
      "x-default": englishUrl,
    });
  },
);
