import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getAllBlogPosts } from "../../src/blog/blog-post-registry";
import { publicLocales } from "../../src/i18n/public-locale";
import { BlogPlannerCta, getBlogPlannerCtaLocaleFromSourcesHeading } from "../../src/components/blog/blog-planner-cta";
import { BlogSources } from "../../src/components/blog/blog-sources";

describe("BlogPlannerCta", () => {
  it("renders the English heading, button, and planner hash without an h2", () => {
    const markup = renderToStaticMarkup(createElement(BlogPlannerCta, { locale: "en" }));

    expect(markup).toContain('data-blog-planner-cta="true"');
    expect(markup).toContain("Finish the layout in the planner, then build in-game.");
    expect(markup).toContain("Open planner");
    expect(markup).toContain('href="/#planner"');
    expect(markup).toContain("<p");
    expect(markup).not.toContain("<h2");
  });

  it("renders the Chinese heading, button, and planner hash without an h2", () => {
    const markup = renderToStaticMarkup(createElement(BlogPlannerCta, { locale: "zh-CN" }));

    expect(markup).toContain("先在规划器里摆完，再进游戏建。");
    expect(markup).toContain("打开规划器");
    expect(markup).toContain('href="/zh#planner"');
    expect(markup).not.toContain("<h2");
  });

  it("rejects an unsupported locale", () => {
    expect(() =>
      renderToStaticMarkup(createElement(BlogPlannerCta, { locale: "fr" as never })),
    ).toThrow('Unsupported blog planner CTA locale. Received: "fr".');
  });
});

describe("getBlogPlannerCtaLocaleFromSourcesHeading", () => {
  it("maps known source headings to locales", () => {
    expect(getBlogPlannerCtaLocaleFromSourcesHeading("Sources")).toBe("en");
    expect(getBlogPlannerCtaLocaleFromSourcesHeading("来源")).toBe("zh-CN");
    expect(getBlogPlannerCtaLocaleFromSourcesHeading("资料来源")).toBe("zh-CN");
  });

  it("rejects an unknown sources heading", () => {
    expect(() => getBlogPlannerCtaLocaleFromSourcesHeading("References")).toThrow(
      'Blog sources heading does not map to a public locale. Received: "References".',
    );
  });

  it("rejects a blank sources heading", () => {
    expect(() => getBlogPlannerCtaLocaleFromSourcesHeading("   ")).toThrow(
      'Blog planner CTA sources heading must be a non-empty string. Received: "   ".',
    );
  });
});

function expectSourcedArticlePlannerCta(
  locale: (typeof publicLocales)[number],
  slug: string,
  markup: string,
): void {
  const expectedHeading =
    locale === "en"
      ? "Finish the layout in the planner, then build in-game."
      : "先在规划器里摆完，再进游戏建。";
  const expectedAction = locale === "en" ? "Open planner" : "打开规划器";
  const expectedHref = locale === "en" ? "/#planner" : "/zh#planner";
  const ctaMatches = markup.match(/data-blog-planner-cta="true"/g) ?? [];
  const faqIndex = markup.indexOf('class="blog-faq-list"');
  const ctaIndex = markup.indexOf("data-blog-planner-cta");
  const sourcesIndex = markup.indexOf('class="blog-sources"');

  expect(ctaMatches, `${locale} ${slug} CTA count`).toHaveLength(1);
  expect(ctaIndex, `${locale} ${slug} missing CTA`).toBeGreaterThan(-1);
  expect(sourcesIndex, `${locale} ${slug} missing Sources`).toBeGreaterThan(ctaIndex);
  expect(markup).toContain(expectedHeading);
  expect(markup).toContain(expectedAction);
  expect(markup).toContain(`href="${expectedHref}"`);

  if (faqIndex !== -1) {
    expect(ctaIndex, `${locale} ${slug} CTA should follow FAQ`).toBeGreaterThan(faqIndex);
  }
}

function expectHarvestArticleHasOneFooterCta(
  locale: (typeof publicLocales)[number],
  markup: string,
): void {
  expectSourcedArticlePlannerCta(locale, "how-to-harvest-stardew-valley", markup);

  const faqLists = markup.match(/class="blog-faq-list"/g) ?? [];
  const faqTriggers = markup.match(/class="blog-faq-trigger"/g) ?? [];
  const hrefCount = markup.match(/href="/g)?.length ?? 0;
  const questions =
    locale === "en"
      ? [
          "How do you harvest a regular mature crop by hand on PC?",
          "Which crops need a regular scythe, and how is the 1.6 iridium scythe different?",
          "How do you harvest a giant crop?",
          "Does a missed watering day delay the harvest?",
          "Why do trellis crops need a neighboring standing tile?",
        ]
      : locale === "zh-CN"
        ? [
            "在 PC 上，普通成熟作物怎么徒手收？",
            "哪些作物要用普通镰刀，1.6 的铱镰刀有什么不同？",
            "巨大作物怎么收？",
            "漏浇水会推迟成熟吗？",
            "棚架作物为什么必须留邻近站位？",
          ]
        : null;

  if (questions === null) {
    throw new Error(
      `Harvest planner CTA locale is not en or zh-CN. Received: ${JSON.stringify(locale)}.`,
    );
  }

  expect(faqLists, `${locale} how-to-harvest-stardew-valley FAQ list count`).toHaveLength(1);
  expect(faqTriggers, `${locale} how-to-harvest-stardew-valley FAQ count`).toHaveLength(5);
  expect(hrefCount, `${locale} how-to-harvest-stardew-valley href count`).toBe(30);
  expect(markup).not.toContain("FAQPage");
  expect(markup).not.toContain("QAPage");
  expect(markup).toContain(
    "https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411",
  );
  expect(markup).toContain(
    "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
  );
  expect(markup).toContain("ConcernedApe");
  expect(markup).toContain('src="/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp"');
  expect(markup).toContain('src="/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp"');
  expect(markup).toContain('loading="lazy"');
  expect(markup).not.toContain("https://stardewvalleyplanner.art");
  expect(markup).not.toContain("how-to-harvest-stardew-valley-en-methods.webp");
  expect(markup).not.toContain("how-to-harvest-stardew-valley-zh-methods.webp");

  for (const question of questions) {
    expect(markup, `${locale} harvest FAQ question`).toContain(question);
  }

  if (locale === "en") {
    expect(markup).toContain("<h2>How to Harvest Stardew Valley FAQ</h2>");
    expect(markup).toContain('class="blog-planner-link" href="/"');
    expect(markup).toContain('href="/last-day-to-plant-stardew"');
    expect(markup).toContain('href="/what-to-grow-in-greenhouse-stardew"');
    return;
  }

  expect(markup).toContain("<h2>星露谷物语收作物常见问题</h2>");
  expect(markup).toContain('class="blog-planner-link" href="/zh"');
  expect(markup).toContain('href="/zh/last-day-to-plant-stardew"');
  expect(markup).toContain('href="/zh/what-to-grow-in-greenhouse-stardew"');
}

describe("blog article planner CTA placement", () => {
  it("places one planner CTA after FAQ and before Sources, including the harvest article", () => {
    for (const locale of publicLocales) {
      for (const post of getAllBlogPosts(locale)) {
        const markup = renderToStaticMarkup(createElement(post.Content));

        if (post.slug === "how-to-harvest-stardew-valley") {
          expectHarvestArticleHasOneFooterCta(locale, markup);
        } else {
          expectSourcedArticlePlannerCta(locale, post.slug, markup);
        }
      }
    }
  });

  it("keeps the planner CTA outside the Sources section", () => {
    const markup = renderToStaticMarkup(
      createElement(BlogSources, {
        heading: "Sources",
        items: [{ href: "https://example.com/wiki", label: "Wiki" }],
      }),
    );
    const sourcesStart = markup.indexOf('<section class="blog-sources">');
    const ctaStart = markup.indexOf("data-blog-planner-cta");

    expect(ctaStart).toBeGreaterThan(-1);
    expect(sourcesStart).toBeGreaterThan(ctaStart);
    expect(markup.slice(sourcesStart)).not.toContain("data-blog-planner-cta");
    expect(markup.slice(sourcesStart).match(/<a href=/g) ?? []).toHaveLength(1);
  });
});
