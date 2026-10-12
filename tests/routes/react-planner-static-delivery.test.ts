import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";

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
  it("keeps the SEO homepage shell and case-study sections SSR while excluding editor-heavy resources", () => {
    const homepageStaticHtml = readHomepageStaticHtml();
    const homepageCaseStudyGroups = homepageCopyByLocale.en.caseStudies;

    expect(homepageStaticHtml).toContain("data-homepage-shell");
    expect(homepageStaticHtml).toContain("data-homepage-hero-emphasis");
    expect(homepageStaticHtml).toContain("Free Online Farm Layout Tool");
    expect(homepageStaticHtml).not.toContain('data-homepage-features="true"');
    expect(homepageStaticHtml).not.toContain('data-homepage-why-choose="true"');
    expect(homepageStaticHtml).not.toContain('id="homepage-features-heading"');
    expect(homepageStaticHtml).not.toContain('id="homepage-why-choose-heading"');
    expect(homepageStaticHtml).not.toContain(
      ">Meadowlands Farm Layout Examples</h2>",
    );
    expect(homepageStaticHtml).not.toContain(
      ">Beach &amp; Four Corners Farm Layout Examples</h2>",
    );
    expect(homepageStaticHtml.match(/data-homepage-case-study-group=/g)).toHaveLength(3);
    for (const caseStudyGroup of homepageCaseStudyGroups) {
      expect(homepageStaticHtml).toContain(
        `data-homepage-case-study-group="${caseStudyGroup.id}"`,
      );
      expect(homepageStaticHtml).toContain(
        `data-image-position="${caseStudyGroup.imagePosition}"`,
      );
      if (caseStudyGroup.id === "farm-cases") {
        expect(homepageStaticHtml).toContain(
          `<h2 id="farm-cases-heading">${homepageCopyByLocale.en.caseStudiesHeading}</h2>`,
        );
      } else {
        expect(homepageStaticHtml).not.toContain(
          `<h2 id="${caseStudyGroup.id}-heading">${caseStudyGroup.heading}</h2>`,
        );
      }
    }
    expect(homepageStaticHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
    expect(homepageStaticHtml).toContain("data-homepage-planner-preview");
    expect(homepageStaticHtml).toContain(
      'src="/public-previews/1.6.15/maps/previews/Farm.webp"',
    );
    expect(homepageStaticHtml).not.toContain("Loading planner…");
    expect(homepageStaticHtml).not.toContain("reference-runtime-root");
    expect(homepageStaticHtml).not.toContain("/reference-runtime/bootstrap.mjs");
    expect(homepageStaticHtml).not.toContain("/_app/immutable/");
    expect(homepageStaticHtml).not.toContain("data-sveltekit-");
    expect(homepageStaticHtml).not.toContain("/game-assets/1.6.15/");
    expect(homepageStaticHtml).not.toContain("Buildings.json");
    expect(homepageStaticHtml).not.toContain("pixi.js");
    expect(homepageStaticHtml).not.toContain(".tmx");
  });
});
