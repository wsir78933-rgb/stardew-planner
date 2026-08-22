import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

const expectedBlogSitemapPathnames = [
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
  "/stardew-valley-npc",
  "/stardew-valley-town-map",
  "/zh/blog",
  "/zh/blog/archive",
  "/zh/carpenter-stardew",
  "/zh/where-is-robin-stardew-valley",
  "/zh/stardew-valley-npc",
  "/zh/stardew-valley-town-map",
] as const;

it("writes robots.txt with the absolute sitemap URL", () => {
  const robotsText = readFileSync(join(process.cwd(), "out", "robots.txt"), "utf8");

  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain(
    "Sitemap: https://stardewvalleyplanner.art/sitemap.xml",
  );
});

it("lists every indexable blog URL while excluding Contact from the localized public sitemap", () => {
  const sitemapText = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
  const sitemapLocationValues = Array.from(
    sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, sitemapLocationValue]) => sitemapLocationValue,
  );
  const sitemapUrlCount = sitemapLocationValues.length;
  const localizedPublicRouteEntries = getLocalizedIndexablePublicRouteEntries();

  expect(sitemapUrlCount).toBe(18);
  expect(localizedPublicRouteEntries).toHaveLength(18);
  for (const { pathname } of localizedPublicRouteEntries) {
    expect(sitemapText).toContain(
      `<loc>${createCanonicalUrl(pathname)}</loc>`,
    );
  }
  expect(sitemapText).not.toContain("farmType=");
  expect(sitemapLocationValues).not.toContainEqual(expect.stringContaining("?"));
  expect(sitemapText).not.toContain("<lastmod>");
  expect(sitemapText).toContain("/privacy");
  expect(sitemapText).toContain("/terms");
  expect(sitemapText).not.toContain("/contact");

  for (const pathname of expectedBlogSitemapPathnames) {
    expect(sitemapText).toContain(
      `<loc>${createCanonicalUrl(pathname)}</loc>`,
    );
  }
});
