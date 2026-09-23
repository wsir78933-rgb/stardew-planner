import type { BlogPostSlug } from "./blog-post-identities";
import type { PublicLocale } from "../i18n/public-locale";

export type BlogCopy = Readonly<{
  archiveDescription: string;
  archiveIntro: string;
  archiveTitle: string;
  authorLabel: string;
  allTopicsLabel: string;
  blogDescription: string;
  blogTitle: string;
  emptyArchiveLabel: string;
  emptyBlogLabel: string;
  latestArticlesLabel: string;
  jumpToLabel: string;
  nextLatestArticlesSetLabel: string;
  nextPageLabel: string;
  noResultsLabel: string;
  nextCarouselLabel: string;
  previousLatestArticlesSetLabel: string;
  previousPageLabel: string;
  previousCarouselLabel: string;
  readTimeTemplate: string;
  resetFiltersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmitLabel: string;
  topicLabel: string;
  tableOfContentsLabel: string;
  plannerCtaHeading: string;
}>;

const blogCopyByLocale: Readonly<Record<PublicLocale, BlogCopy>> = {
  en: {
    archiveDescription:
      "Browse every Stardew Valley planning guide in one archive, from Robin and Pelican Town to farm layout basics.",
    archiveIntro:
      "This archive lists every published Stardew Valley planning guide. Use it to find Robin, Pelican Town, and farm layout articles in one place.",
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
    nextLatestArticlesSetLabel: "Next set of articles",
    nextPageLabel: "Next page",
    noResultsLabel: "No articles match these filters.",
    nextCarouselLabel: "Next",
    previousLatestArticlesSetLabel: "Previous set of articles",
    previousPageLabel: "Previous page",
    previousCarouselLabel: "Previous",
    readTimeTemplate: "{minutes} min read",
    resetFiltersLabel: "Reset filters",
    searchLabel: "Search article titles",
    searchPlaceholder: "Search guides",
    searchSubmitLabel: "Search",
    topicLabel: "Topic",
    tableOfContentsLabel: "On this page",
    plannerCtaHeading: "Finish the layout in the planner, then build in-game.",
  },
  "zh-CN": {
    archiveDescription:
      "按列表查看全部星露谷农场规划指南，覆盖罗宾、鹈鹕镇和农场布局基础。",
    archiveIntro:
      "这里列出目前已发布的全部星露谷农场规划指南。你可以在同一页查找罗宾、鹈鹕镇和农场布局相关文章。",
    archiveTitle: "全部文章",
    authorLabel: "作者：",
    allTopicsLabel: "全部",
    blogDescription: "帮助你更清晰、更灵活地规划星露谷农场的实用指南。",
    blogTitle: "星露谷农场规划指南",
    emptyArchiveLabel: "这个归档中暂时还没有文章。",
    emptyBlogLabel: "暂时还没有可用的规划指南。",
    latestArticlesLabel: "最新文章",
    jumpToLabel: "跳转至",
    nextLatestArticlesSetLabel: "下一组文章",
    nextPageLabel: "下一页",
    noResultsLabel: "没有文章符合这些筛选条件。",
    nextCarouselLabel: "下一篇",
    previousLatestArticlesSetLabel: "上一组文章",
    previousPageLabel: "上一页",
    previousCarouselLabel: "上一篇",
    readTimeTemplate: "阅读约 {minutes} 分钟",
    resetFiltersLabel: "重置筛选",
    searchLabel: "搜索文章标题",
    searchPlaceholder: "搜索指南",
    searchSubmitLabel: "搜索",
    topicLabel: "专题",
    tableOfContentsLabel: "本页目录",
    plannerCtaHeading: "先在规划器里摆完，再进游戏建。",
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
    "where-is-stardew-valley-located": "/where-is-stardew-valley-located",
    "stardew-valley-expanded-bachelors-and-bachelorettes":
      "/stardew-valley-expanded-bachelors-and-bachelorettes",
    "sprinkler-stardew": "/sprinkler-stardew",
    "glasshouse-stardew-valley": "/glasshouse-stardew-valley",
    "oak-tree-stardew": "/oak-tree-stardew",
    "stardew-valley-trees": "/stardew-valley-trees",
    "maple-tree-stardew": "/maple-tree-stardew",
    "best-spring-crop-stardew": "/best-spring-crop-stardew",
    "how-to-earn-money-stardew": "/how-to-earn-money-stardew",
    "rancher-or-tiller-stardew": "/rancher-or-tiller-stardew",
    "summer-crops-stardew": "/summer-crops-stardew",
    "fall-crops-stardew": "/fall-crops-stardew",
    "do-you-have-to-water-trees-stardew": "/do-you-have-to-water-trees-stardew",
    "how-to-level-up-farming-stardew": "/how-to-level-up-farming-stardew",
    "last-day-to-plant-stardew": "/last-day-to-plant-stardew",
    "profit-margin-stardew": "/profit-margin-stardew",
  },
  "zh-CN": {
    "carpenter-stardew": "/zh/carpenter-stardew",
    "where-is-robin-stardew-valley": "/zh/where-is-robin-stardew-valley",
    "stardew-valley-npc": "/zh/stardew-valley-npc",
    "stardew-valley-town-map": "/zh/stardew-valley-town-map",
    "where-is-stardew-valley-located": "/zh/where-is-stardew-valley-located",
    "stardew-valley-expanded-bachelors-and-bachelorettes":
      "/zh/stardew-valley-expanded-bachelors-and-bachelorettes",
    "sprinkler-stardew": "/zh/sprinkler-stardew",
    "glasshouse-stardew-valley": "/zh/glasshouse-stardew-valley",
    "oak-tree-stardew": "/zh/oak-tree-stardew",
    "stardew-valley-trees": "/zh/stardew-valley-trees",
    "maple-tree-stardew": "/zh/maple-tree-stardew",
    "best-spring-crop-stardew": "/zh/best-spring-crop-stardew",
    "how-to-earn-money-stardew": "/zh/how-to-earn-money-stardew",
    "rancher-or-tiller-stardew": "/zh/rancher-or-tiller-stardew",
    "summer-crops-stardew": "/zh/summer-crops-stardew",
    "fall-crops-stardew": "/zh/fall-crops-stardew",
    "do-you-have-to-water-trees-stardew": "/zh/do-you-have-to-water-trees-stardew",
    "how-to-level-up-farming-stardew": "/zh/how-to-level-up-farming-stardew",
    "last-day-to-plant-stardew": "/zh/last-day-to-plant-stardew",
    "profit-margin-stardew": "/zh/profit-margin-stardew",
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
