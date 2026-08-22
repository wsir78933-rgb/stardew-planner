import type { BlogPostSlug } from "./blog-post-identities";
import type { PublicLocale } from "../i18n/public-locale";

export type BlogCopy = Readonly<{
  archiveTitle: string;
  authorLabel: string;
  allTopicsLabel: string;
  blogDescription: string;
  blogTitle: string;
  emptyArchiveLabel: string;
  emptyBlogLabel: string;
  latestArticlesLabel: string;
  jumpToLabel: string;
  loadMoreLabel: string;
  nextPageLabel: string;
  noResultsLabel: string;
  nextCarouselLabel: string;
  previousPageLabel: string;
  previousCarouselLabel: string;
  readTimeTemplate: string;
  resetFiltersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmitLabel: string;
  topicLabel: string;
  tableOfContentsLabel: string;
}>;

const blogCopyByLocale: Readonly<Record<PublicLocale, BlogCopy>> = {
  en: {
    archiveTitle: "All articles",
    authorLabel: "By",
    allTopicsLabel: "All",
    blogDescription:
      "Practical Stardew Valley guides for planning a clearer, more flexible farm.",
    blogTitle: "Stardew Valley Planning Guides",
    emptyArchiveLabel: "There are no articles in this archive yet.",
    emptyBlogLabel: "There are no planning guides available yet.",
    latestArticlesLabel: "Latest articles",
    jumpToLabel: "Jump to",
    loadMoreLabel: "Load more articles",
    nextPageLabel: "Next page",
    noResultsLabel: "No articles match these filters.",
    nextCarouselLabel: "Next",
    previousPageLabel: "Previous page",
    previousCarouselLabel: "Previous",
    readTimeTemplate: "{minutes} min read",
    resetFiltersLabel: "Reset filters",
    searchLabel: "Search article titles",
    searchPlaceholder: "Search guides",
    searchSubmitLabel: "Search",
    topicLabel: "Topic",
    tableOfContentsLabel: "On this page",
  },
  "zh-CN": {
    archiveTitle: "全部文章",
    authorLabel: "作者：",
    allTopicsLabel: "全部",
    blogDescription: "帮助你更清晰、更灵活地规划星露谷农场的实用指南。",
    blogTitle: "星露谷农场规划指南",
    emptyArchiveLabel: "这个归档中暂时还没有文章。",
    emptyBlogLabel: "暂时还没有可用的规划指南。",
    latestArticlesLabel: "最新文章",
    jumpToLabel: "跳转至",
    loadMoreLabel: "加载更多文章",
    nextPageLabel: "下一页",
    noResultsLabel: "没有文章符合这些筛选条件。",
    nextCarouselLabel: "下一篇",
    previousPageLabel: "上一页",
    previousCarouselLabel: "上一篇",
    readTimeTemplate: "阅读约 {minutes} 分钟",
    resetFiltersLabel: "重置筛选",
    searchLabel: "搜索文章标题",
    searchPlaceholder: "搜索指南",
    searchSubmitLabel: "搜索",
    topicLabel: "专题",
    tableOfContentsLabel: "本页目录",
  },
};

const localizedBlogPostPaths: Readonly<
  Record<PublicLocale, Readonly<Record<BlogPostSlug, string>>>
> = {
  en: {
    "carpenter-stardew": "/carpenter-stardew",
    "where-is-robin-stardew-valley": "/where-is-robin-stardew-valley",
    "stardew-valley-npc": "/stardew-valley-npc",
    "stardew-valley-town-map": "/stardew-valley-town-map",
  },
  "zh-CN": {
    "carpenter-stardew": "/zh/carpenter-stardew",
    "where-is-robin-stardew-valley": "/zh/where-is-robin-stardew-valley",
    "stardew-valley-npc": "/zh/stardew-valley-npc",
    "stardew-valley-town-map": "/zh/stardew-valley-town-map",
  },
};

const localizedBlogArchivePaths: Readonly<Record<PublicLocale, string>> = {
  en: "/blog/archive",
  "zh-CN": "/zh/blog/archive",
};

export function getBlogCopy(locale: PublicLocale): BlogCopy {
  const localizedCopy = blogCopyByLocale[locale];

  if (localizedCopy === undefined) {
    throw new Error(`Unsupported blog locale. Received: ${JSON.stringify(locale)}.`);
  }

  return localizedCopy;
}

export function getLocalizedBlogPostHref(
  locale: PublicLocale,
  slug: BlogPostSlug,
): string {
  const localizedPath = localizedBlogPostPaths[locale]?.[slug];

  if (localizedPath === undefined) {
    throw new Error(
      `Unsupported localized blog post route. Received locale=${JSON.stringify(locale)}, slug=${JSON.stringify(slug)}.`,
    );
  }

  return localizedPath;
}

export function getLocalizedBlogArchiveHref(
  locale: PublicLocale,
  page: number,
): string {
  if (!Number.isSafeInteger(page) || page <= 0) {
    throw new Error(`Invalid blog archive page. Received: ${page}.`);
  }

  const archivePath = localizedBlogArchivePaths[locale];

  if (archivePath === undefined) {
    throw new Error(`Unsupported blog archive locale. Received: ${JSON.stringify(locale)}.`);
  }

  return page === 1 ? archivePath : `${archivePath}?page=${page}`;
}

export function formatBlogReadTime(copy: BlogCopy, minutes: number): string {
  if (!Number.isSafeInteger(minutes) || minutes <= 0) {
    throw new Error(`Invalid blog read time. Received: ${minutes}.`);
  }

  return copy.readTimeTemplate.replace("{minutes}", String(minutes));
}
