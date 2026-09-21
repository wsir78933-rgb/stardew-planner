import { publicLocales, type PublicLocale } from "../i18n/public-locale";
import type { BlogPostMeta } from "./blog-post-registry";

const defaultTopicArticlesPage = 1;
const defaultVisiblePostCount = 6;

export const topicArticlesPageSize = 12;

type BlogSearchParameterValue = string | readonly string[] | undefined;

export type BlogHomeSearchParameters = Readonly<{
  q?: BlogSearchParameterValue;
  topic?: BlogSearchParameterValue;
  visible?: BlogSearchParameterValue;
  page?: BlogSearchParameterValue;
}>;

export type BlogHomeState = Readonly<{
  query: string;
  topic: string;
  visible: number;
  topicArticlesPage: number;
  topicArticlesPageCount: number;
  topics: readonly string[];
  posts: readonly BlogPostMeta[];
  topicCarouselPosts: readonly BlogPostMeta[];
  totalPostCount: number;
}>;

function getSearchParameterText(value: BlogSearchParameterValue): string {
  return typeof value === "string" ? value.trim() : "";
}

function getFirstCarouselTopicPosts(
  posts: readonly BlogPostMeta[],
  topics: readonly string[],
): readonly BlogPostMeta[] {
  for (const topic of topics) {
    const matchingTopicPosts = posts.filter((post) => post.topic === topic);

    if (matchingTopicPosts.length >= 4) {
      return matchingTopicPosts;
    }
  }

  return [];
}

function normalizePositiveInteger(
  value: BlogSearchParameterValue,
  fallbackValue: number,
): number {
  const parameterText = getSearchParameterText(value);

  if (!/^[1-9]\d*$/.test(parameterText)) {
    return fallbackValue;
  }

  const parsedValue = Number(parameterText);
  return Number.isSafeInteger(parsedValue) ? parsedValue : fallbackValue;
}

function assertPublicLocale(locale: PublicLocale): void {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }
}

export function filterBlogPostsByTitle(
  posts: readonly BlogPostMeta[],
  query: string,
): readonly BlogPostMeta[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return posts.slice();
  }

  return posts.filter((post) => post.title.toLowerCase().includes(normalizedQuery));
}

export function paginateBlogPosts(
  posts: readonly BlogPostMeta[],
  page: number,
  pageSize: number,
): readonly BlogPostMeta[] {
  if (!Number.isSafeInteger(page) || page <= 0) {
    throw new Error(`Invalid blog page. Received: ${page}.`);
  }

  if (!Number.isSafeInteger(pageSize) || pageSize <= 0) {
    throw new Error(`Invalid blog page size. Received: ${pageSize}.`);
  }

  const startIndex = (page - 1) * pageSize;
  return posts.slice(startIndex, startIndex + pageSize);
}

function paginateTopicArticles(
  topicArticles: readonly BlogPostMeta[],
  requestedPage: number,
): Readonly<{
  page: number;
  pageCount: number;
  posts: readonly BlogPostMeta[];
}> {
  const pageCount = Math.ceil(topicArticles.length / topicArticlesPageSize);

  if (pageCount === 0) {
    return {
      page: defaultTopicArticlesPage,
      pageCount: 0,
      posts: [],
    };
  }

  const page = Math.min(requestedPage, pageCount);

  return {
    page,
    pageCount,
    posts: paginateBlogPosts(topicArticles, page, topicArticlesPageSize),
  };
}

export function getBlogHomeState(
  posts: readonly BlogPostMeta[],
  searchParameters: BlogHomeSearchParameters,
): BlogHomeState {
  const query = getSearchParameterText(searchParameters.q);
  const topic = getSearchParameterText(searchParameters.topic);
  const visible = normalizePositiveInteger(
    searchParameters.visible,
    defaultVisiblePostCount,
  );
  const requestedTopicArticlesPage = normalizePositiveInteger(
    searchParameters.page,
    defaultTopicArticlesPage,
  );
  const topics = Array.from(new Set(posts.map((post) => post.topic)));
  const topicMatchedPosts =
    topic.length === 0 ? posts.slice() : posts.filter((post) => post.topic === topic);
  const matchingPosts = filterBlogPostsByTitle(topicMatchedPosts, query);
  const latestMatchingPosts = matchingPosts.slice().reverse();
  const topicArticlesPageState = paginateTopicArticles(
    getFirstCarouselTopicPosts(posts, topics),
    requestedTopicArticlesPage,
  );

  return {
    query,
    topic,
    visible,
    topicArticlesPage: topicArticlesPageState.page,
    topicArticlesPageCount: topicArticlesPageState.pageCount,
    topics,
    posts: latestMatchingPosts.slice(0, visible),
    topicCarouselPosts: topicArticlesPageState.posts,
    totalPostCount: matchingPosts.length,
  };
}

export function buildBlogHomeHref(
  locale: PublicLocale,
  searchParameters: BlogHomeSearchParameters,
): string {
  assertPublicLocale(locale);

  const query = getSearchParameterText(searchParameters.q);
  const topic = getSearchParameterText(searchParameters.topic);
  const visible = normalizePositiveInteger(
    searchParameters.visible,
    defaultVisiblePostCount,
  );
  const page = normalizePositiveInteger(
    searchParameters.page,
    defaultTopicArticlesPage,
  );
  const urlSearchParameters = new URLSearchParams();

  if (query.length > 0) {
    urlSearchParameters.set("q", query);
  }

  if (topic.length > 0) {
    urlSearchParameters.set("topic", topic);
  }

  if (visible !== defaultVisiblePostCount) {
    urlSearchParameters.set("visible", String(visible));
  }

  if (page !== defaultTopicArticlesPage) {
    urlSearchParameters.set("page", String(page));
  }

  const pathname = locale === "en" ? "/blog" : "/zh/blog";
  const queryString = urlSearchParameters.toString();
  return queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
}
