import { buildBlogHomeHref, type BlogHomeState } from "../../blog/blog-home-state";
import type { BlogCopy } from "../../blog/blog-copy";
import type { PublicLocale } from "../../i18n/public-locale";

type TopicArticlesPaginationProperties = Readonly<{
  copy: BlogCopy;
  homeState: BlogHomeState;
  locale: PublicLocale;
}>;

function createTopicArticlesPageNumbers(pageCount: number): readonly number[] {
  if (!Number.isSafeInteger(pageCount) || pageCount <= 1) {
    throw new Error(`Invalid topic articles page count. Received: ${pageCount}.`);
  }

  return Array.from({ length: pageCount }, (_, index) => index + 1);
}

function createTopicArticlesPageHref(
  locale: PublicLocale,
  homeState: BlogHomeState,
  page: number,
): string {
  if (!Number.isSafeInteger(page) || page <= 0) {
    throw new Error(`Invalid topic articles page. Received: ${page}.`);
  }

  return `${buildBlogHomeHref(locale, {
    q: homeState.query,
    topic: homeState.topic,
    visible: String(homeState.visible),
    page: String(page),
  })}#topic-carousel`;
}

function createTopicArticlesAdjacentPageHref(
  locale: PublicLocale,
  homeState: BlogHomeState,
  page: number,
  isEnabled: boolean,
): string | null {
  if (!isEnabled) {
    return null;
  }

  return createTopicArticlesPageHref(locale, homeState, page);
}

function readTopicArticlesPaginationLabel(homeState: BlogHomeState): string {
  const topicName = homeState.topicCarouselPosts[0]?.topic;
  if (topicName === undefined) {
    throw new Error(
      `Topic articles pagination requires a topic name. Received pageCount=${String(homeState.topicArticlesPageCount)}, posts=${String(homeState.topicCarouselPosts.length)}.`,
    );
  }

  return topicName;
}

function TopicArticlesStepControl({
  href,
  isEnabled,
  label,
}: Readonly<{
  href: string | null;
  isEnabled: boolean;
  label: string;
}>) {
  if (isEnabled) {
    if (href === null) {
      throw new Error(
        `Enabled topic articles step control is missing href. Received label=${JSON.stringify(label)}.`,
      );
    }

    return <a href={href}>{label}</a>;
  }

  return <span aria-disabled="true">{label}</span>;
}

function TopicArticlesPageLinks({
  currentPage,
  homeState,
  locale,
  pageCount,
}: Readonly<{
  currentPage: number;
  homeState: BlogHomeState;
  locale: PublicLocale;
  pageCount: number;
}>) {
  return createTopicArticlesPageNumbers(pageCount).map((page) => (
    <a
      aria-current={page === currentPage ? "page" : undefined}
      href={createTopicArticlesPageHref(locale, homeState, page)}
      key={page}
    >
      {page}
    </a>
  ));
}

export function TopicArticlesPagination({
  copy,
  homeState,
  locale,
}: TopicArticlesPaginationProperties) {
  if (homeState.topicArticlesPageCount <= 1) {
    return null;
  }

  const topicName = readTopicArticlesPaginationLabel(homeState);
  const currentPage = homeState.topicArticlesPage;
  const pageCount = homeState.topicArticlesPageCount;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;

  return (
    <nav aria-label={topicName} className="blog-topic-articles-pagination">
      <TopicArticlesStepControl
        href={createTopicArticlesAdjacentPageHref(
          locale,
          homeState,
          currentPage - 1,
          hasPreviousPage,
        )}
        isEnabled={hasPreviousPage}
        label={copy.previousCarouselLabel}
      />
      <TopicArticlesPageLinks
        currentPage={currentPage}
        homeState={homeState}
        locale={locale}
        pageCount={pageCount}
      />
      <TopicArticlesStepControl
        href={createTopicArticlesAdjacentPageHref(
          locale,
          homeState,
          currentPage + 1,
          hasNextPage,
        )}
        isEnabled={hasNextPage}
        label={copy.nextCarouselLabel}
      />
    </nav>
  );
}
