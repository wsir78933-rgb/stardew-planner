import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getBlogArchiveState } from "../../src/blog/blog-archive-state";
import {
  getBlogCopy,
  getLocalizedBlogArchiveHref,
  type BlogCopy,
} from "../../src/blog/blog-copy";
import { getBlogHomeState } from "../../src/blog/blog-home-state";
import {
  type BlogPostMeta,
  getAllBlogPostMeta,
  getAllBlogPosts,
} from "../../src/blog/blog-post-registry";
import { BlogArchiveContent } from "../../src/components/blog/blog-archive-content";
import { BlogArticleContent } from "../../src/components/blog/blog-article-content";
import { BlogArchiveClientContent } from "../../src/components/blog/blog-archive-client-content";
import { BlogDiscoveryControls } from "../../src/components/blog/blog-discovery-controls";
import { BlogIndexClientContent } from "../../src/components/blog/blog-index-client-content";
import { BlogIndexContent } from "../../src/components/blog/blog-index-content";
import { BlogLandingHero } from "../../src/components/blog/blog-landing-hero";
import { TopicCarouselControls } from "../../src/components/blog/topic-carousel-controls";

function repeatPostMeta(
  posts: readonly BlogPostMeta[],
  count: number,
): readonly BlogPostMeta[] {
  return Array.from({ length: count }, (_, index) => posts[index % posts.length]);
}

function createCustomizedEnglishCopy(): BlogCopy {
  return {
    ...getBlogCopy("en"),
    archiveTitle: "Custom archive",
    authorLabel: "Custom author",
    blogTitle: "Custom guides",
    latestArticlesLabel: "Custom latest articles",
    nextPageLabel: "Custom next",
    previousPageLabel: "Custom previous",
    searchLabel: "Custom search",
    topicLabel: "Custom topic",
  };
}

it("renders a localized discovery form and latest articles with semantic detail links", () => {
  const posts = getAllBlogPosts("en");
  const homeState = getBlogHomeState(posts, { q: "Robin" });
  const markup = renderToStaticMarkup(
    createElement(BlogIndexContent, {
      copy: getBlogCopy("en"),
      locale: "en",
      homeState,
      posts,
    }),
  );

  expect(markup).toContain("<h1>Stardew Valley Planning Guides</h1>");
  expect(markup).toContain('<form action="/blog" method="get">');
  expect(markup).toContain('name="q"');
  expect(markup).toContain('value="Robin"');
  expect(markup).toContain('href="/where-is-robin-stardew-valley"');
  expect(markup).toContain("Latest articles");
  expect(markup).toContain('aria-label="Jump to"');
  expect(markup).toContain('href="#latest-articles"');
  expect(markup).not.toContain('href="#topic-carousel"');
});

it("renders only jump targets whose latest and topic sections are present", () => {
  const repeatedPosts = repeatPostMeta(getAllBlogPostMeta("en"), 4);
  const carouselOnlyState = getBlogHomeState(repeatedPosts, { q: "no match" });
  const carouselOnlyMarkup = renderToStaticMarkup(
    <BlogIndexContent
      copy={getBlogCopy("en")}
      homeState={carouselOnlyState}
      locale="en"
      posts={repeatedPosts}
    />,
  );

  expect(carouselOnlyMarkup).not.toContain('id="latest-articles"');
  expect(carouselOnlyMarkup).not.toContain('href="#latest-articles"');
  expect(carouselOnlyMarkup).toContain('id="topic-carousel"');
  expect(carouselOnlyMarkup).toContain('href="#topic-carousel"');
});

it("localizes the default Chinese jump-to-latest link", () => {
  const posts = getAllBlogPostMeta("zh-CN");
  const markup = renderToStaticMarkup(
    <BlogIndexContent
      copy={getBlogCopy("zh-CN")}
      homeState={getBlogHomeState(posts, {})}
      locale="zh-CN"
      posts={posts}
    />,
  );

  expect(markup).toContain('aria-label="跳转至"');
  expect(markup).toContain('href="#latest-articles">最新文章</a>');
});

it("renders the index client boundary with a static-export-safe metadata projection", () => {
  const markup = renderToStaticMarkup(
    <BlogIndexClientContent
      copy={getBlogCopy("en")}
      locale="en"
      posts={getAllBlogPostMeta("en")}
    />,
  );

  expect(markup).toContain("Stardew Valley Planning Guides");
  expect(markup).toContain('href="/carpenter-stardew"');
});

it("renders the archive client boundary with a static-export-safe metadata projection", () => {
  const markup = renderToStaticMarkup(
    <BlogArchiveClientContent
      copy={getBlogCopy("zh-CN")}
      locale="zh-CN"
      posts={getAllBlogPostMeta("zh-CN")}
    />,
  );

  expect(markup).toContain("全部文章");
  expect(markup).toContain('href="/zh/where-is-robin-stardew-valley"');
});

it("keeps the page-level heading singular across hero, discovery, archive, and article content", () => {
  const posts = getAllBlogPosts("en");
  const homeState = getBlogHomeState(posts, {});
  const archiveState = getBlogArchiveState(posts, "1");
  const indexMarkup = renderToStaticMarkup(
    <>
      <BlogLandingHero
        copy={getBlogCopy("en")}
        jumpTargets={[]}
        locale="en"
        spotlightPosts={posts}
      />
      <BlogDiscoveryControls copy={getBlogCopy("en")} locale="en" homeState={homeState} />
    </>,
  );
  const archiveMarkup = renderToStaticMarkup(
    <BlogArchiveContent copy={getBlogCopy("en")} locale="en" archiveState={archiveState} />,
  );
  const articleMarkup = renderToStaticMarkup(
    <BlogArticleContent copy={getBlogCopy("en")} locale="en" post={posts[0]} />,
  );

  expect((indexMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((archiveMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((articleMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect(articleMarkup).toContain(
    'alt="Illustration of Robin&#x27;s mountain workshop with a farm-building plan"',
  );
  expect(articleMarkup).toContain(
    '<p class="blog-article-description">Match your task—buy, build, upgrade, or move—to the menu and verify the shop can serve you.</p>',
  );
});

it("renders the selected bilingual NPC title and description in the article header", () => {
  for (const [locale, expectedTitle, expectedDescription] of [
    [
      "en",
      "Meet Every Stardew Valley NPC in One Practical Guide",
      "Meet the current Stardew Valley cast without opening dozens of profiles. Compare friendship groups, key services, and the NPCs new farmers need first.",
    ],
    [
      "zh-CN",
      "一篇实用指南认识星露谷每位 NPC",
      "无需打开几十个角色页面，就能了解当前星露谷角色、好感分类、关键服务，以及新农民最该优先认识的人。",
    ],
  ] as const) {
    const post = getAllBlogPosts(locale).find(
      ({ slug }) => slug === "stardew-valley-npc",
    );

    if (post === undefined) {
      throw new Error(`Missing NPC post for locale ${locale}.`);
    }

    const markup = renderToStaticMarkup(
      <BlogArticleContent copy={getBlogCopy(locale)} locale={locale} post={post} />,
    );

    expect(markup).toContain(`<h1>${expectedTitle}</h1>`);
    expect(markup).toContain(
      `<p class="blog-article-description">${expectedDescription}</p>`,
    );
  }
});

it("marks the current archive page and preserves localized archive links", () => {
  const chinesePosts = getAllBlogPosts("zh-CN");
  const archiveState = getBlogArchiveState(
    Array.from({ length: 10 }, (_, index) => chinesePosts[index % chinesePosts.length]),
    "1",
  );
  const markup = renderToStaticMarkup(
    <BlogArchiveContent copy={getBlogCopy("zh-CN")} locale="zh-CN" archiveState={archiveState} />,
  );

  expect(markup).toContain('aria-current="page"');
  expect(markup).toContain('href="/zh/carpenter-stardew"');
  expect(markup).toContain("全部文章");
});

it("does not render controls for an empty topic carousel", () => {
  const markup = renderToStaticMarkup(
    <TopicCarouselControls
      ariaLabel="Topic controls"
      nextLabel="Next"
      previousLabel="Previous"
      trackId="topic-track"
    />,
  );

  expect(markup).toBe("");
});

it("uses the localized archive route interface instead of building archive URLs in the component", () => {
  expect(getLocalizedBlogArchiveHref("en", 1)).toBe("/blog/archive");
  expect(getLocalizedBlogArchiveHref("zh-CN", 2)).toBe("/zh/blog/archive?page=2");
});

it("renders caller-provided localized copy through all blog presentation layers", () => {
  const posts = getAllBlogPosts("en");
  const homeState = getBlogHomeState(posts, {});
  const archiveState = getBlogArchiveState(
    Array.from({ length: 19 }, (_, index) => posts[index % posts.length]),
    "2",
  );
  const customizedCopy = createCustomizedEnglishCopy();
  const indexMarkup = renderToStaticMarkup(
    <BlogIndexContent copy={customizedCopy} homeState={homeState} locale="en" posts={posts} />,
  );
  const archiveMarkup = renderToStaticMarkup(
    <BlogArchiveContent archiveState={archiveState} copy={customizedCopy} locale="en" />,
  );
  const articleMarkup = renderToStaticMarkup(
    <BlogArticleContent copy={customizedCopy} locale="en" post={posts[0]} />,
  );

  expect(indexMarkup).toContain("Custom guides");
  expect(indexMarkup).toContain("Custom latest articles");
  expect(indexMarkup).toContain("Custom search");
  expect(archiveMarkup).toContain("Custom archive");
  expect(archiveMarkup).toContain("Custom previous");
  expect(archiveMarkup).toContain("Custom next");
  expect(articleMarkup).toContain("Custom author");
});

it("renders caller-provided Chinese carousel controls", () => {
  const markup = renderToStaticMarkup(
    <TopicCarouselControls
      ariaLabel="专题轮播"
      hasItems={true}
      nextLabel="下一篇"
      previousLabel="上一篇"
      trackId="topic-track"
    />,
  );

  expect(markup).toContain(">上一篇</button>");
  expect(markup).toContain(">下一篇</button>");
  expect(markup).not.toContain(">Previous</button>");
  expect(markup).not.toContain(">Next</button>");
});
