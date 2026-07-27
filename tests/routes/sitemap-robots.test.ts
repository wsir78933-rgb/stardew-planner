import { describe, expect, it } from "vitest";
import robots from "../../app/robots";
import sitemap from "../../app/sitemap";

describe("SEO static route manifests", () => {
  it("lists each English and Chinese canonical page with reciprocal language alternates", () => {
    const sitemapEntries = sitemap();
    const englishStandardFarm = sitemapEntries.find(
      (entry) => entry.url === "https://stardewvalleyplanner.art/farm/standard",
    );
    const chineseStandardFarm = sitemapEntries.find(
      (entry) => entry.url === "https://stardewvalleyplanner.art/zh/farm/standard",
    );

    expect(sitemapEntries).toHaveLength(26);
    expect(englishStandardFarm?.alternates?.languages).toEqual({
      en: "https://stardewvalleyplanner.art/farm/standard",
      "zh-CN": "https://stardewvalleyplanner.art/zh/farm/standard",
      "x-default": "https://stardewvalleyplanner.art/farm/standard",
    });
    expect(chineseStandardFarm?.alternates?.languages).toEqual(
      englishStandardFarm?.alternates?.languages,
    );
  });

  it("publishes robots and sitemap at the canonical site origin", () => {
    const robotsMetadata = robots();

    expect(robotsMetadata.host).toBe("https://stardewvalleyplanner.art");
    expect(robotsMetadata.sitemap).toBe(
      "https://stardewvalleyplanner.art/sitemap.xml",
    );
  });
});
