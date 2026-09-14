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

describe("blog article planner CTA placement", () => {
  it("places one planner CTA after FAQ when present and before Sources on every article", () => {
    for (const locale of publicLocales) {
      const expectedHeading =
        locale === "en"
          ? "Finish the layout in the planner, then build in-game."
          : "先在规划器里摆完，再进游戏建。";
      const expectedAction = locale === "en" ? "Open planner" : "打开规划器";
      const expectedHref = locale === "en" ? "/#planner" : "/zh#planner";

      for (const post of getAllBlogPosts(locale)) {
        const markup = renderToStaticMarkup(createElement(post.Content));
        const ctaMatches = markup.match(/data-blog-planner-cta="true"/g) ?? [];
        const faqIndex = markup.indexOf('class="blog-faq-list"');
        const ctaIndex = markup.indexOf("data-blog-planner-cta");
        const sourcesIndex = markup.indexOf('class="blog-sources"');

        expect(ctaMatches, `${locale} ${post.slug} CTA count`).toHaveLength(1);
        expect(ctaIndex, `${locale} ${post.slug} missing CTA`).toBeGreaterThan(-1);
        expect(sourcesIndex, `${locale} ${post.slug} missing Sources`).toBeGreaterThan(ctaIndex);
        expect(markup).toContain(expectedHeading);
        expect(markup).toContain(expectedAction);
        expect(markup).toContain(`href="${expectedHref}"`);

        if (faqIndex !== -1) {
          expect(ctaIndex, `${locale} ${post.slug} CTA should follow FAQ`).toBeGreaterThan(
            faqIndex,
          );
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
