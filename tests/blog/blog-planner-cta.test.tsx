import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getBlogCopy } from "../../src/blog/blog-copy";
import { getAllBlogPosts } from "../../src/blog/blog-post-registry";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";
import { publicLocales, type PublicLocale } from "../../src/i18n/public-locale";
import { BlogPlannerCta, getBlogPlannerCtaLocaleFromSourcesHeading } from "../../src/components/blog/blog-planner-cta";
import { BlogSources } from "../../src/components/blog/blog-sources";

const plannerHrefByLocale = {
  en: "/#planner",
  "zh-CN": "/zh#planner",
} as const;

function readBlogPlannerCtaSection(markup: string, locale: PublicLocale): string {
  const section = markup.match(
    /<section\b(?=[^>]*class="blog-planner-cta")(?=[^>]*data-blog-planner-cta="true")[^>]*>[\s\S]*?<\/section>/,
  )?.[0];

  if (section === undefined) {
    throw new Error(`Missing blog planner CTA section for locale ${JSON.stringify(locale)}.`);
  }

  return section;
}

function readBlogPlannerCtaHeadingLines(copyMarkup: string, locale: PublicLocale): string[] {
  const heading = copyMarkup.match(
    /<p\b(?=[^>]*class="blog-planner-cta__heading")[^>]*>([\s\S]*?)<\/p>/,
  )?.[1];

  if (heading === undefined) {
    throw new Error(`Missing blog planner CTA heading for locale ${JSON.stringify(locale)}.`);
  }

  return Array.from(
    heading.matchAll(
      /<span\b(?=[^>]*class="blog-planner-cta__heading-line")[^>]*>([\s\S]*?)<\/span>/g,
    ),
    (match) => match[1] ?? "",
  );
}

function stripBlogPlannerCtaHeadingLineMarkup(markup: string): string {
  return markup.replace(/<[^>]*>/g, "");
}

describe("BlogPlannerCta", () => {
  it.each(publicLocales)(
    "matches the %s homepage hero and localized CTA copy",
    (locale) => {
      const markup = renderToStaticMarkup(createElement(BlogPlannerCta, { locale }));
      const section = readBlogPlannerCtaSection(markup, locale);
      const heroCopy = homepageCopyByLocale[locale].hero;
      const blogCopy = getBlogCopy(locale);
      const copyMarkup = section.match(
        /<div class="blog-planner-cta__copy">([\s\S]*?)<\/div><picture\b/,
      )?.[1];
      const headingLines = copyMarkup
        ? readBlogPlannerCtaHeadingLines(copyMarkup, locale)
        : [];
      const sectionStart = section.match(/^<section\b[^>]*>/)?.[0];
      const headingStart = copyMarkup?.match(
        /<p\b(?=[^>]*class="blog-planner-cta__heading")[^>]*>/,
      )?.[0];
      const imageTag = section.match(/<img\b[^>]*>/)?.[0];
      const actionAnchor = copyMarkup?.match(
        /<a\b(?=[^>]*data-blog-planner-cta-action="true")[^>]*>[\s\S]*?<\/a>/,
      )?.[0];

      if (
        copyMarkup === undefined ||
        sectionStart === undefined ||
        headingStart === undefined ||
        imageTag === undefined
      ) {
        throw new Error(`Incomplete blog planner CTA markup for locale ${JSON.stringify(locale)}.`);
      }
      if (actionAnchor === undefined) {
        throw new Error(`Missing blog planner CTA action for locale ${JSON.stringify(locale)}.`);
      }

      expect(markup.match(/data-blog-planner-cta="true"/g) ?? []).toHaveLength(1);
      expect(section).toMatch(
        /<div class="blog-planner-cta__content"><div class="blog-planner-cta__copy">/,
      );
      expect(section).toContain('<picture class="public-picture" data-public-picture="true">');
      expect(sectionStart).toContain('aria-labelledby="blog-planner-cta-heading"');
      expect(headingStart).toContain('id="blog-planner-cta-heading"');
      expect(section).not.toMatch(/<h[23]\b/);
      expect(headingLines).toHaveLength(2);
      expect(stripBlogPlannerCtaHeadingLineMarkup(headingLines[0] ?? "")).toBe(
        `${heroCopy.headlineBefore}${heroCopy.headlineEmphasis}`,
      );
      expect(headingLines[0]).toContain(`<em>${heroCopy.headlineEmphasis}</em>`);
      expect(stripBlogPlannerCtaHeadingLineMarkup(headingLines[1] ?? "")).toBe(
        heroCopy.headlineAfter,
      );
      expect(copyMarkup).toContain('class="blog-planner-cta__description"');
      expect(copyMarkup).toContain(heroCopy.supportingCopy);
      expect(actionAnchor).toContain(`href="${plannerHrefByLocale[locale]}"`);
      expect(actionAnchor).toContain(blogCopy.plannerCtaActionLabel);
      expect(actionAnchor).toContain('data-blog-planner-cta-action="true"');
      expect(actionAnchor).not.toContain("<button");
      expect(copyMarkup).toContain('class="blog-planner-cta__note"');
      expect(copyMarkup).toContain(blogCopy.plannerCtaNote);
      expect(imageTag).toContain('class="blog-planner-cta__image"');
      expect(imageTag).toContain('data-blog-planner-cta-image="true"');
      expect(imageTag).toContain('src="/homepage/cases/farm-case-01.webp"');
      expect(imageTag).toContain(`alt="${blogCopy.plannerCtaImageAlt}"`);
      expect(imageTag).toContain('width="1280"');
      expect(imageTag).toContain('height="1040"');
      expect(imageTag).toContain('loading="lazy"');
      expect(imageTag).toContain('decoding="async"');
      expect(section).toContain(
        '<source srcSet="/homepage/cases/farm-case-01.avif" type="image/avif"/>',
      );

      const imageWidth = Number(imageTag.match(/\bwidth="(\d+)"/)?.[1]);
      const imageHeight = Number(imageTag.match(/\bheight="(\d+)"/)?.[1]);
      expect(imageWidth / imageHeight).toBeCloseTo(1280 / 1040);
    },
  );

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
  locale: PublicLocale,
  slug: string,
  markup: string,
): void {
  const heroCopy = homepageCopyByLocale[locale].hero;
  const blogCopy = getBlogCopy(locale);
  const ctaSection = readBlogPlannerCtaSection(markup, locale);
  const ctaMatches = markup.match(/data-blog-planner-cta="true"/g) ?? [];
  const faqIndex = markup.indexOf('class="blog-faq-list"');
  const ctaIndex = markup.indexOf("data-blog-planner-cta");
  const sourcesIndex = markup.indexOf('class="blog-sources"');

  expect(ctaMatches, `${locale} ${slug} CTA count`).toHaveLength(1);
  expect(ctaIndex, `${locale} ${slug} missing CTA`).toBeGreaterThan(-1);
  expect(sourcesIndex, `${locale} ${slug} missing Sources`).toBeGreaterThan(ctaIndex);
  expect(ctaSection).toContain(heroCopy.headlineBefore.trimEnd());
  expect(ctaSection).toContain(`<em>${heroCopy.headlineEmphasis}</em>`);
  expect(ctaSection).toContain(heroCopy.headlineAfter);
  expect(ctaSection).toContain(heroCopy.supportingCopy);
  expect(ctaSection).toContain(blogCopy.plannerCtaActionLabel);
  expect(ctaSection).toContain(`href="${plannerHrefByLocale[locale]}"`);
  expect(ctaSection).not.toMatch(/<h[23]\b/);

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
