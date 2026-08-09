import { publicLocales, type PublicLocale } from "../i18n/public-locale";
import type { BlogPostMeta } from "./blog-post-registry";

const defaultVisiblePostCount = 6;

type BlogSearchParameterValue = string | readonly string[] | undefined;

export type BlogHomeSearchParameters = Readonly<{
  q?: BlogSearchParameterValue;
  topic?: BlogSearchParameterValue;
  visible?: BlogSearchParameterValue;
}>;

export type BlogHomeState = Readonly<{
  query: string;
  topic: string;
  visible: number;
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
  const topics = Array.from(new Set(posts.map((post) => post.topic)));
  const topicMatchedPosts =
    topic.length === 0 ? posts.slice() : posts.filter((post) => post.topic === topic);
  const matchingPosts = filterBlogPostsByTitle(topicMatchedPosts, query);
  const topicCarouselPosts = getFirstCarouselTopicPosts(posts, topics);

  return {
    query,
    topic,
    visible,
    topics,
    posts: matchingPosts.slice(0, visible),
    topicCarouselPosts,
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

  const pathname = locale === "en" ? "/blog" : "/zh/blog";
  const queryString = urlSearchParameters.toString();
  return queryString.length > 0 ? `${pathname}?${queryString}` : pathname;
}
