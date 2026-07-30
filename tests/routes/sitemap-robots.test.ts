import { describe, expect, it, vi } from "vitest";
import robots from "../../app/robots";
import sitemap from "../../app/sitemap";
import { canonicalPublicPaths } from "../../src/i18n/canonical-public-routes";
import {
  getAbsoluteLocalizedUrl,
  getAlternateLanguageUrls,
  publicSiteOrigin,
} from "../../src/i18n/public-site-url";

vi.mock("../../src/i18n/public-site-url", () => ({
  publicSiteOrigin: "https://shared-origin.test",
  getAbsoluteLocalizedUrl: (locale: string, canonicalPath: string) =>
    `https://localized-url.test/${locale}${canonicalPath}`,
  getAlternateLanguageUrls: (canonicalPath: string) => ({
    en: `https://alternate-url.test/en${canonicalPath}`,
    "zh-CN": `https://alternate-url.test/zh-CN${canonicalPath}`,
    "x-default": `https://alternate-url.test/en${canonicalPath}`,
  }),
}));

describe("SEO static route manifests", () => {
  it("uses the shared URL interface for every localized sitemap entry", () => {
    const sitemapEntries = sitemap();

    expect(sitemapEntries).toHaveLength(26);

    for (const canonicalPath of canonicalPublicPaths) {
      const alternateUrls = getAlternateLanguageUrls(canonicalPath);

      expect(sitemapEntries).toContainEqual({
        url: getAbsoluteLocalizedUrl("en", canonicalPath),
        alternates: { languages: alternateUrls },
      });
      expect(sitemapEntries).toContainEqual({
        url: getAbsoluteLocalizedUrl("zh-CN", canonicalPath),
        alternates: { languages: alternateUrls },
      });
    }
  });

  it("uses the shared site origin for robots and its sitemap URL", () => {
    const robotsMetadata = robots();

    expect(robotsMetadata.host).toBe(publicSiteOrigin);
    expect(robotsMetadata.sitemap).toBe(`${publicSiteOrigin}/sitemap.xml`);
  });
});
