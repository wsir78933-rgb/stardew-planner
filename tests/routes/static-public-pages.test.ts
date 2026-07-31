import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  officialFarmGuides,
  officialFarmTypes,
} from "../../src/reference/official-farm-guides";

const staticPublicPageExpectations = [
  [
    "index.html",
    "Stardew Valley Farm Planner",
    "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    "Plan a farm",
    "WebApplication",
  ],
  [
    "farm-comparison.html",
    "Stardew Valley Farm Types Compared",
    "Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.",
    "Stardew Valley Farm Types Compared",
    "Quick comparison",
  ],
  [
    "mods.html",
    "Modded Stardew Valley Farms",
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    "Modded Stardew Valley Farms",
    "Available community farms",
  ],
  [
    "privacy.html",
    "Privacy Policy",
    "Learn how this browser-local planner handles projects, preferences, and local data.",
    "Privacy Policy",
    "There is no account or sign-in.",
  ],
  [
    "terms.html",
    "Terms of Service",
    "Read the terms for this browser-local Stardew Valley farm planning tool.",
    "Terms of Service",
    "There is no account or sign-in.",
  ],
  ...officialFarmTypes.map((farmType) => [
    `farm/${farmType}.html`,
    `${officialFarmGuides[farmType].title} | Stardew Valley Farm Planner`,
    `${officialFarmGuides[farmType].title} farm guide. ${officialFarmGuides[farmType].bestFor}`,
    officialFarmGuides[farmType].title,
    "What makes it different",
  ]),
] as const;

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected prebuilt static page file: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

function expectedCanonicalUrl(staticPageFile: string): string {
  if (staticPageFile === "index.html") {
    return "https://stardewvalleyplanner.art";
  }

  return `https://stardewvalleyplanner.art/${staticPageFile.replace(/\.html$/, "")}`;
}

function escapeHtmlAttributeValue(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

describe("static public pages", () => {
  it("exports crawler-discovery files alongside the public pages", () => {
    expect(existsSync(join(process.cwd(), "out", "robots.txt"))).toBe(true);
    expect(existsSync(join(process.cwd(), "out", "sitemap.xml"))).toBe(true);
  });

  it("exports prebuilt public pages with static metadata and no planner runtime", () => {
    for (const [
      staticPageFile,
      expectedTitle,
      expectedDescription,
      expectedHeading,
      expectedContent,
    ] of staticPublicPageExpectations) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);

      expect(staticPageHtml).toContain("<h1");
      expect(staticPageHtml).toContain(expectedHeading);
      expect(staticPageHtml).toContain(expectedContent);
      expect(staticPageHtml).toContain(`<title>${expectedTitle}</title>`);
      expect(staticPageHtml).toContain(
        `<meta name="description" content="${escapeHtmlAttributeValue(expectedDescription)}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${expectedCanonicalUrl(staticPageFile)}"`,
      );

      if (staticPageFile === "index.html") {
        expect(staticPageHtml).toContain("WebApplication");
        continue;
      }

      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(staticPageHtml).toContain('aria-label="Public navigation"');
      expect(staticPageHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
      expect(staticPageHtml).not.toContain("reference-runtime-root");
      expect(staticPageHtml).not.toContain(
        "/reference-runtime/bootstrap.mjs",
      );
    }
  });
});
