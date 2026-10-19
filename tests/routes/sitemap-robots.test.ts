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
  "/where-is-stardew-valley-located",
  "/stardew-valley-expanded-bachelors-and-bachelorettes",
  "/sprinkler-stardew",
  "/glasshouse-stardew-valley",
  "/oak-tree-stardew",
  "/stardew-valley-trees",
  "/maple-tree-stardew",
  "/best-spring-crop-stardew",
  "/how-to-earn-money-stardew",
  "/rancher-or-tiller-stardew",
  "/summer-crops-stardew",
  "/fall-crops-stardew",
  "/do-you-have-to-water-trees-stardew",
  "/how-to-level-up-farming-stardew",
  "/last-day-to-plant-stardew",
  "/pine-tree-stardew",
  "/profit-margin-stardew",
  "/what-to-grow-in-greenhouse-stardew",
  "/oak-tree-vs-maple-stardew",
  "/zh/blog",
  "/zh/blog/archive",
  "/zh/carpenter-stardew",
  "/zh/where-is-robin-stardew-valley",
  "/zh/stardew-valley-npc",
  "/zh/stardew-valley-town-map",
  "/zh/where-is-stardew-valley-located",
  "/zh/stardew-valley-expanded-bachelors-and-bachelorettes",
  "/zh/sprinkler-stardew",
  "/zh/glasshouse-stardew-valley",
  "/zh/oak-tree-stardew",
  "/zh/stardew-valley-trees",
  "/zh/maple-tree-stardew",
  "/zh/best-spring-crop-stardew",
  "/zh/how-to-earn-money-stardew",
  "/zh/rancher-or-tiller-stardew",
  "/zh/summer-crops-stardew",
  "/zh/fall-crops-stardew",
  "/zh/do-you-have-to-water-trees-stardew",
  "/zh/how-to-level-up-farming-stardew",
  "/zh/last-day-to-plant-stardew",
  "/zh/pine-tree-stardew",
  "/zh/profit-margin-stardew",
  "/zh/what-to-grow-in-greenhouse-stardew",
  "/zh/oak-tree-vs-maple-stardew",
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
  const russianHomepageUrl = "https://stardewvalleyplanner.art/ru";
  const expectedIndexablePublicRouteCount = localizedPublicRouteEntries.length + 1;
  const russianSitemapUrls = sitemapLocationValues.filter(
    (sitemapLocationValue) =>
      sitemapLocationValue === russianHomepageUrl
      || sitemapLocationValue.startsWith(`${russianHomepageUrl}/`),
  );

  expect(
    sitemapUrlCount,
    `Sitemap URL count mismatch. Received: ${sitemapUrlCount}. Expected registry length plus the Russian homepage: ${expectedIndexablePublicRouteCount}. Russian URLs: ${JSON.stringify(russianSitemapUrls)}.`,
  ).toBe(expectedIndexablePublicRouteCount);
  expect(russianSitemapUrls).toEqual([russianHomepageUrl]);
  expect(sitemapLocationValues).not.toContain(
    "https://stardewvalleyplanner.art/ru/blog",
  );
  expect(sitemapLocationValues).not.toContain(
    "https://stardewvalleyplanner.art/ru/privacy",
  );
  expect(sitemapLocationValues).not.toContain(
    "https://stardewvalleyplanner.art/ru/terms",
  );
  expect(sitemapLocationValues).not.toContain(
    "https://stardewvalleyplanner.art/ru/contact",
  );
  const indexableRegistryPathnames = localizedPublicRouteEntries.map(
    (routeEntry) => routeEntry.pathname,
  );
  expect(indexableRegistryPathnames).not.toContain("/ru");
  for (const routeEntry of localizedPublicRouteEntries) {
    expect(
      routeEntry.locale,
      `Indexable public route locale must be en or zh-CN. Received: ${JSON.stringify(routeEntry.locale)} for ${JSON.stringify(routeEntry.pathname)}.`,
    ).toMatch(/^(en|zh-CN)$/);
    expect(
      routeEntry.pathname === "/ru" || routeEntry.pathname.startsWith("/ru/"),
      `Indexable public registry must not include a Russian path. Received: ${JSON.stringify(routeEntry.pathname)}.`,
    ).toBe(false);
  }
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
