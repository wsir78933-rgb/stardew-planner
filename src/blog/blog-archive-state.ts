import type { BlogPostMeta } from "./blog-post-registry";
import { paginateBlogPosts } from "./blog-home-state";

const archivePageSize = 9;

export type BlogArchiveState = Readonly<{
  posts: readonly BlogPostMeta[];
  page: number;
  pageCount: number;
}>;

function normalizeArchivePage(pageParameter: string | undefined): number {
  const pageText = pageParameter?.trim() ?? "";

  if (!/^[1-9]\d*$/.test(pageText)) {
    return 1;
  }

  const parsedPage = Number(pageText);
  return Number.isSafeInteger(parsedPage) ? parsedPage : 1;
}

export function getBlogArchiveState(
  posts: readonly BlogPostMeta[],
  pageParameter: string | undefined,
): BlogArchiveState {
  const pageCount = Math.ceil(posts.length / archivePageSize);
  const requestedPage = normalizeArchivePage(pageParameter);
  const page = pageCount === 0 ? 1 : Math.min(requestedPage, pageCount);

  return {
    posts: paginateBlogPosts(posts, page, archivePageSize),
    page,
    pageCount,
  };
}
