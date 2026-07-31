import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedPublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("writes robots.txt with the absolute sitemap URL", () => {
  const robotsText = readFileSync(join(process.cwd(), "out", "robots.txt"), "utf8");

  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain(
    "Sitemap: https://stardewvalleyplanner.art/sitemap.xml",
  );
});

it("writes exactly the localized public URLs into sitemap.xml without legal paths", () => {
  const sitemapText = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
  const sitemapUrlCount = (sitemapText.match(/<loc>/g) ?? []).length;
  const localizedPublicRouteEntries = getLocalizedPublicRouteEntries();

  expect(sitemapUrlCount).toBe(22);
  expect(localizedPublicRouteEntries).toHaveLength(22);
  for (const { pathname } of localizedPublicRouteEntries) {
    expect(sitemapText).toContain(
      `<loc>${createCanonicalUrl(pathname)}</loc>`,
    );
  }
  expect(sitemapText).not.toContain("farmType=");
  expect(sitemapText).not.toContain("<lastmod>");
  expect(sitemapText).not.toContain("/privacy");
  expect(sitemapText).not.toContain("/terms");
});
