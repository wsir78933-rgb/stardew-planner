import { describe, expect, it } from "vitest";
import sitemap from "../../app/sitemap";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";

const russianHomepageUrl = "https://stardewvalleyplanner.art/ru";
const forbiddenRussianUrls = [
  "https://stardewvalleyplanner.art/ru/blog",
  "https://stardewvalleyplanner.art/ru/privacy",
  "https://stardewvalleyplanner.art/ru/terms",
  "https://stardewvalleyplanner.art/ru/contact",
];

describe("Russian homepage sitemap", () => {
  it("appends exactly one Russian homepage URL after the bilingual registry", () => {
    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map((sitemapEntry) => sitemapEntry.url);
    const registryCount = getLocalizedIndexablePublicRouteEntries().length;
    const russianSitemapUrls = sitemapUrls.filter(
      (sitemapUrl) =>
        sitemapUrl === russianHomepageUrl
        || sitemapUrl.startsWith(`${russianHomepageUrl}/`),
    );

    expect(
      sitemapUrls,
      `Sitemap must be the registry plus one Russian homepage. Received count: ${sitemapUrls.length}. Russian URLs: ${JSON.stringify(russianSitemapUrls)}.`,
    ).toHaveLength(registryCount + 1);
    expect(russianSitemapUrls).toEqual([russianHomepageUrl]);
    expect(sitemapUrls.at(-1)).toBe(russianHomepageUrl);
    for (const forbiddenRussianUrl of forbiddenRussianUrls) {
      expect(sitemapUrls).not.toContain(forbiddenRussianUrl);
    }
    expect(sitemapUrls.some((sitemapUrl) => sitemapUrl.includes("?"))).toBe(false);
    expect(sitemapUrls.some((sitemapUrl) => sitemapUrl.includes("farmType="))).toBe(false);
    expect(sitemapEntries.some((sitemapEntry) => "lastmod" in sitemapEntry)).toBe(false);
    expect(sitemapUrls).not.toContain("https://stardewvalleyplanner.art/contact");
    expect(sitemapUrls).not.toContain("https://stardewvalleyplanner.art/zh/contact");
  });
});
