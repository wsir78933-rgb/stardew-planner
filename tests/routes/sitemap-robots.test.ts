import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { canonicalPublicPaths } from "../../src/seo/canonical-public-routes";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("writes robots.txt with the absolute sitemap URL", () => {
  const robotsText = readFileSync(join(process.cwd(), "out", "robots.txt"), "utf8");

  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain(
    "Sitemap: https://stardewvalleyplanner.art/sitemap.xml",
  );
});

it("writes exactly the canonical public URLs into sitemap.xml", () => {
  const sitemapText = readFileSync(join(process.cwd(), "out", "sitemap.xml"), "utf8");
  const sitemapUrlCount = (sitemapText.match(/<loc>/g) ?? []).length;

  expect(sitemapUrlCount).toBe(canonicalPublicPaths.length);
  for (const canonicalPublicPath of canonicalPublicPaths) {
    expect(sitemapText).toContain(
      `<loc>${createCanonicalUrl(canonicalPublicPath)}</loc>`,
    );
  }
  expect(sitemapText).not.toContain("farmType=");
  expect(sitemapText).not.toContain("<lastmod>");
});
