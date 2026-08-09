"use client";

import { getBlogHomeSearchParametersFromLocationSearch } from "../../blog/blog-location-search";
import type { BlogCopy } from "../../blog/blog-copy";
import { getBlogHomeState } from "../../blog/blog-home-state";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";
import { BlogIndexContent } from "./blog-index-content";
import { useStaticLocationSearch } from "./use-static-location-search";

type BlogIndexClientContentProperties = Readonly<{
  copy: BlogCopy;
  locale: PublicLocale;
  posts: readonly BlogPostMeta[];
}>;

export function BlogIndexClientContent({
  copy,
  locale,
  posts,
}: BlogIndexClientContentProperties) {
  const locationSearch = useStaticLocationSearch();
  const homeState = getBlogHomeState(
    posts,
    getBlogHomeSearchParametersFromLocationSearch(locationSearch),
  );

  return (
    <div data-blog-location-state="index">
      <BlogIndexContent copy={copy} homeState={homeState} locale={locale} posts={posts} />
    </div>
  );
}
