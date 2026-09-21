import { buildBlogHomeHref } from "../../blog/blog-home-state";
import type { BlogCopy } from "../../blog/blog-copy";
import type { BlogHomeState } from "../../blog/blog-home-state";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";
import { ArticleGrid } from "./article-grid";
import { BlogDiscoveryControls } from "./blog-discovery-controls";
import {
  BlogLandingHero,
  type BlogHeroJumpTarget,
} from "./blog-landing-hero";
import { LatestArticlesCarouselControls } from "./latest-articles-carousel-controls";
import { TopicArticlesPagination } from "./topic-articles-pagination";

type BlogIndexContentProperties = Readonly<{
  copy: BlogCopy;
  homeState: BlogHomeState;
  locale: PublicLocale;
  posts: readonly BlogPostMeta[];
}>;

function createHeroJumpTargets(
  copy: BlogCopy,
  hasLatestArticles: boolean,
  topicCarouselPosts: readonly BlogPostMeta[],
): readonly BlogHeroJumpTarget[] {
  const jumpTargets: BlogHeroJumpTarget[] = [];

  if (hasLatestArticles) {
    jumpTargets.push({ href: "#latest-articles", label: copy.latestArticlesLabel });
  }

  const carouselTopic = topicCarouselPosts[0]?.topic;
  if (carouselTopic !== undefined) {
    jumpTargets.push({ href: "#topic-carousel", label: carouselTopic });
  }

  return jumpTargets;
}

export function BlogIndexContent({
  copy,
  homeState,
  locale,
  posts,
}: BlogIndexContentProperties) {
  const hasPosts = posts.length > 0;
  const hasMatchingPosts = homeState.totalPostCount > 0;
  const topicCarouselPosts = homeState.topicCarouselPosts;
  const latestArticlesTrackId = "blog-latest-articles-track";
  const jumpTargets = createHeroJumpTargets(copy, hasMatchingPosts, topicCarouselPosts);

  return (
    <div data-blog-page="true">
      <BlogLandingHero
        copy={copy}
        jumpTargets={jumpTargets}
        locale={locale}
        spotlightPosts={posts.slice(0, 2)}
      />
      <BlogDiscoveryControls copy={copy} homeState={homeState} locale={locale} />
      {!hasPosts ? <p role="status">{copy.emptyBlogLabel}</p> : null}
      {hasPosts && !hasMatchingPosts ? (
        <p role="status">
          {copy.noResultsLabel} <a href={buildBlogHomeHref(locale, {})}>{copy.resetFiltersLabel}</a>
        </p>
      ) : null}
      {hasMatchingPosts ? (
        <section aria-labelledby="latest-articles-heading" id="latest-articles">
          <div className="blog-latest-articles-heading">
            <h2 id="latest-articles-heading">{copy.latestArticlesLabel}</h2>
            {homeState.posts.length > 1 ? (
              <LatestArticlesCarouselControls
                ariaLabel={copy.latestArticlesLabel}
                nextLabel={copy.nextLatestArticlesSetLabel}
                previousLabel={copy.previousLatestArticlesSetLabel}
                trackId={latestArticlesTrackId}
              />
            ) : null}
          </div>
          <div
            aria-label={copy.latestArticlesLabel}
            className="blog-latest-articles-track"
            id={latestArticlesTrackId}
            role="region"
            tabIndex={0}
          >
            <ArticleGrid copy={copy} locale={locale} posts={homeState.posts} />
          </div>
        </section>
      ) : null}
      {topicCarouselPosts.length > 0 ? (
        <section
          aria-labelledby="topic-carousel-heading"
          className="blog-topic-articles"
          id="topic-carousel"
        >
          <h2 id="topic-carousel-heading">{topicCarouselPosts[0].topic}</h2>
          <ArticleGrid copy={copy} locale={locale} posts={topicCarouselPosts} />
          <TopicArticlesPagination copy={copy} homeState={homeState} locale={locale} />
        </section>
      ) : null}
    </div>
  );
}
