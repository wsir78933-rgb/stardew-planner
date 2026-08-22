import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { plannerMaps } from "../../src/maps/map-catalog";

const expectedOfficialFarmTypes = [
  "standard",
  "riverland",
  "forest",
  "hilltop",
  "wilderness",
  "four-corners",
  "beach",
  "meadowlands",
] as const;

const expectedStaticPageFiles = [
  "index.html",
  "privacy.html",
  "terms.html",
  "contact.html",
  "zh.html",
  "zh/privacy.html",
  "zh/terms.html",
  "zh/contact.html",
  "blog.html",
  "blog/archive.html",
  "carpenter-stardew.html",
  "where-is-robin-stardew-valley.html",
  "stardew-valley-npc.html",
  "stardew-valley-town-map.html",
  "zh/blog.html",
  "zh/blog/archive.html",
  "zh/carpenter-stardew.html",
  "zh/where-is-robin-stardew-valley.html",
  "zh/stardew-valley-npc.html",
  "zh/stardew-valley-town-map.html",
] as const;

const expectedStaticHomepageFiles = [
  {
    staticPageFile: "index.html",
    plannerHref: "#planner",
    localizedHeadline: "Stardew Valley",
  },
  {
    staticPageFile: "zh.html",
    plannerHref: "#planner",
    localizedHeadline: "星露谷物语",
  },
] as const;

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected static page file does not exist: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

describe("static React planner routes", () => {
  it("exports static files without image optimization", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.images?.unoptimized).toBe(true);
  });

  it("keeps every official farm available to the planner", () => {
    expect(
      plannerMaps
        .filter(({ id }) => expectedOfficialFarmTypes.includes(id as never))
        .map(({ id }) => id),
    ).toEqual(expectedOfficialFarmTypes);
  });

  it("does not export removed public guide pages", () => {
    for (const removedStaticPageFile of [
      "farm-comparison.html",
      "mods.html",
      ...expectedOfficialFarmTypes.map((farmType) => `farm/${farmType}.html`),
      "zh/farm-comparison.html",
      "zh/mods.html",
      ...expectedOfficialFarmTypes.map((farmType) => `zh/farm/${farmType}.html`),
    ]) {
      expect(existsSync(join(process.cwd(), "out", removedStaticPageFile))).toBe(
        false,
      );
    }
  });

  it(
    "exports every static route without retired runtime markup",
    () => {
      for (const staticPageFile of expectedStaticPageFiles) {
        const staticPageHtml = readStaticPageHtml(staticPageFile);

        expect(staticPageHtml).not.toContain('id="reference-runtime-root"');
        expect(staticPageHtml).not.toContain(
          'src="/reference-runtime/bootstrap.mjs"',
        );
        expect(staticPageHtml).not.toContain("/_app/immutable/");
        expect(staticPageHtml).not.toContain("data-sveltekit-");
      }
    },
  );

  it("exports English and Chinese homepage shells with their own planner anchors", () => {
    for (const expectedHomepage of expectedStaticHomepageFiles) {
      const staticPageHtml = readStaticPageHtml(expectedHomepage.staticPageFile);

      expect(staticPageHtml).toContain('data-homepage-shell="true"');
      expect(staticPageHtml).toContain('data-homepage-workspace="true"');
      expect(staticPageHtml).toContain(expectedHomepage.localizedHeadline);
      const plannerAnchorMatches = staticPageHtml.match(
        new RegExp(`href="${expectedHomepage.plannerHref}"`, "g"),
      );

      expect(plannerAnchorMatches).toHaveLength(3);
    }
  });
});
