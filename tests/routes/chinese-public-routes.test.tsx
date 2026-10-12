import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import ChinesePlannerPage, {
  metadata as chinesePlannerMetadata,
} from "../../app/zh/page";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";

it("renders /zh as the Chinese homepage with the shared planner workspace", () => {
  const markup = renderToStaticMarkup(<ChinesePlannerPage />);
  const chineseHomepageCopy = homepageCopyByLocale["zh-CN"];

  expect(markup).toContain("星露谷物语");
  expect(markup).toContain(
    '<em data-homepage-hero-emphasis="true">规划器</em>',
  );
  expect(markup).toContain("免费在线农场布局工具");
  expect(markup).toContain(
    "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
  );
  expect(markup).toContain('data-homepage-shell="true"');
  expect(markup).toContain("data-homepage-workspace");
  expect(markup).toContain("data-homepage-planner-preview");
  expect(markup).toContain(
    'src="/public-previews/1.6.15/maps/previews/Farm.webp"',
  );
  expect(markup).toContain(homepageCopyByLocale["zh-CN"].plannerPreview.imageAlt);
  expect(markup).not.toContain("Loading planner…");
  expect(markup).not.toContain('data-homepage-features="true"');
  expect(markup).not.toContain('data-homepage-why-choose="true"');
  expect(markup).not.toContain(chineseHomepageCopy.features.heading);
  expect(markup).not.toContain(chineseHomepageCopy.whyChoose.heading);
  expect(markup.match(/data-homepage-case-study-group=/g)).toHaveLength(3);
  expect(chineseHomepageCopy.caseStudies).toHaveLength(3);
  expect(
    chineseHomepageCopy.caseStudies.map(
      (caseStudyGroup) => caseStudyGroup.imagePosition,
    ),
  ).toEqual(["left", "right", "left"]);
  const homepageSectionMarkers = [
    'id="what-is"',
    ...chineseHomepageCopy.caseStudies.map(
      (caseStudyGroup) => `id="${caseStudyGroup.id}"`,
    ),
    'id="capabilities"',
    'id="how-to"',
  ] as const;
  let previousHomepageSectionPosition = markup.indexOf(
    homepageSectionMarkers[0],
  );
  expect(previousHomepageSectionPosition).toBeGreaterThanOrEqual(0);
  for (const homepageSectionMarker of homepageSectionMarkers.slice(1)) {
    const homepageSectionPosition = markup.indexOf(homepageSectionMarker);
    expect(homepageSectionPosition).toBeGreaterThan(
      previousHomepageSectionPosition,
    );
    previousHomepageSectionPosition = homepageSectionPosition;
  }
  for (const caseStudyGroup of chineseHomepageCopy.caseStudies) {
    expect(markup).toContain(
      `data-homepage-case-study-group="${caseStudyGroup.id}"`,
    );
    expect(markup).toContain(
      `data-image-position="${caseStudyGroup.imagePosition}"`,
    );
    if (caseStudyGroup.id === "farm-cases") {
      expect(markup).toContain(
        `<h2 id="farm-cases-heading">${chineseHomepageCopy.caseStudiesHeading}</h2>`,
      );
    } else {
      expect(markup).not.toContain(
        `<h2 id="${caseStudyGroup.id}-heading">${caseStudyGroup.heading}</h2>`,
      );
    }
    expect(caseStudyGroup.testimonials).toHaveLength(4);
    for (const caseStudy of caseStudyGroup.testimonials) {
      expect(markup).toContain(`src="${caseStudy.src}"`);
      expect(markup).toContain(`alt="${caseStudy.alt}"`);
    }
  }
  expect(markup.match(/href="#planner"/g)).toHaveLength(3);
  expect(markup).toContain('href="/zh"');
  expect(markup).toContain('href="/"');
  expect(markup).not.toContain('data-public-page-shell="true"');
  expect(markup).not.toContain("The editing interface opens in English.");
  expect(markup).not.toContain("reference-runtime-root");
  expect(markup).not.toContain("/reference-runtime/bootstrap.mjs");
  expect(markup).not.toContain("/_app/immutable/");
  expect(markup).not.toContain("data-sveltekit-");
});

it("assigns Chinese root canonical and paired language alternates", () => {
  expect(chinesePlannerMetadata.alternates).toMatchObject({
    canonical: "https://stardewvalleyplanner.art/zh",
    languages: {
      en: "https://stardewvalleyplanner.art",
      "zh-CN": "https://stardewvalleyplanner.art/zh",
      "x-default": "https://stardewvalleyplanner.art",
    },
  });
});
