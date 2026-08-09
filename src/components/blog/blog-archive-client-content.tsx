"use client";

import { getBlogArchivePageParameterFromLocationSearch } from "../../blog/blog-location-search";
import { getBlogArchiveState } from "../../blog/blog-archive-state";
import type { BlogCopy } from "../../blog/blog-copy";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";
import { BlogArchiveContent } from "./blog-archive-content";
import { useStaticLocationSearch } from "./use-static-location-search";

type BlogArchiveClientContentProperties = Readonly<{
  copy: BlogCopy;
  locale: PublicLocale;
  posts: readonly BlogPostMeta[];
}>;

export function BlogArchiveClientContent({
  copy,
  locale,
  posts,
}: BlogArchiveClientContentProperties) {
  const locationSearch = useStaticLocationSearch();
  const archiveState = getBlogArchiveState(
    posts,
    getBlogArchivePageParameterFromLocationSearch(locationSearch),
  );

  return (
    <div data-blog-location-state="archive">
      <BlogArchiveContent archiveState={archiveState} copy={copy} locale={locale} />
    </div>
  );
}
