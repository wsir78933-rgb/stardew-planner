import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readHomepageStaticHtml(): string {
  const homepageStaticHtmlPath = join(process.cwd(), "out", "index.html");

  if (!existsSync(homepageStaticHtmlPath)) {
    throw new Error(
      `Expected planner static homepage does not exist: ${homepageStaticHtmlPath}`,
    );
  }

  return readFileSync(homepageStaticHtmlPath, "utf8");
}

describe("planner static delivery", () => {
  it("keeps the SEO homepage shell and accessible startup status while excluding editor-heavy resources", () => {
    const homepageStaticHtml = readHomepageStaticHtml();

    expect(homepageStaticHtml).toContain("data-homepage-shell");
    expect(homepageStaticHtml).toContain("data-homepage-hero-emphasis");
    expect(homepageStaticHtml).toContain("Free Online Farm Layout Tool");
    expect(homepageStaticHtml).toContain("About this planner");
    expect(homepageStaticHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
    expect(homepageStaticHtml).toContain('role="status">Loading planner…');
    expect(homepageStaticHtml).not.toContain("reference-runtime-root");
    expect(homepageStaticHtml).not.toContain("/reference-runtime/bootstrap.mjs");
    expect(homepageStaticHtml).not.toContain("/_app/immutable/");
    expect(homepageStaticHtml).not.toContain("/game-assets/1.6.15/");
    expect(homepageStaticHtml).not.toContain("Buildings.json");
    expect(homepageStaticHtml).not.toContain("pixi.js");
    expect(homepageStaticHtml).not.toContain(".tmx");
  });
});
