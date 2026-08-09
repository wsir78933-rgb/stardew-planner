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
import { TopicCarouselControls } from "./topic-carousel-controls";

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

function createLoadMoreHref(locale: PublicLocale, homeState: BlogHomeState): string {
  return buildBlogHomeHref(locale, {
    q: homeState.query,
    topic: homeState.topic,
    visible: String(homeState.visible + 6),
  });
}

export function BlogIndexContent({
  copy,
  homeState,
  locale,
  posts,
}: BlogIndexContentProperties) {
  const hasPosts = posts.length > 0;
  const hasMatchingPosts = homeState.totalPostCount > 0;
  const hasMorePosts = homeState.totalPostCount > homeState.posts.length;
  const topicCarouselPosts = homeState.topicCarouselPosts;
  const topicTrackId = "blog-topic-carousel";
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
          <h2 id="latest-articles-heading">{copy.latestArticlesLabel}</h2>
          <ArticleGrid copy={copy} locale={locale} posts={homeState.posts} />
        </section>
      ) : null}
      {topicCarouselPosts.length > 0 ? (
        <section aria-labelledby="topic-carousel-heading" id="topic-carousel">
          <h2 id="topic-carousel-heading">{topicCarouselPosts[0].topic}</h2>
          <div id={topicTrackId}>
            <ArticleGrid copy={copy} locale={locale} posts={topicCarouselPosts} />
          </div>
          <TopicCarouselControls
            ariaLabel={copy.topicLabel}
            hasItems={true}
            nextLabel={copy.nextCarouselLabel}
            previousLabel={copy.previousCarouselLabel}
            trackId={topicTrackId}
          />
        </section>
      ) : null}
      {hasMorePosts ? <a href={createLoadMoreHref(locale, homeState)}>{copy.loadMoreLabel}</a> : null}
    </div>
  );
}
