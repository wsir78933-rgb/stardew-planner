import { getLocalizedBlogArchiveHref, type BlogCopy } from "../../blog/blog-copy";
import type { BlogArchiveState } from "../../blog/blog-archive-state";
import type { PublicLocale } from "../../i18n/public-locale";
import { ArticleGrid } from "./article-grid";

type BlogArchiveContentProperties = Readonly<{
  archiveState: BlogArchiveState;
  copy: BlogCopy;
  locale: PublicLocale;
}>;

function ArchivePagination({
  archiveState,
  copy,
  locale,
}: BlogArchiveContentProperties) {
  if (archiveState.pageCount <= 1) {
    return null;
  }

  const pageNumbers = Array.from(
    { length: archiveState.pageCount },
    (_, index) => index + 1,
  );

  return (
    <nav aria-label={copy.archiveTitle}>
      {archiveState.page > 1 ? (
        <a href={getLocalizedBlogArchiveHref(locale, archiveState.page - 1)}>
          {copy.previousPageLabel}
        </a>
      ) : null}
      {pageNumbers.map((page) => (
        <a
          aria-current={page === archiveState.page ? "page" : undefined}
          href={getLocalizedBlogArchiveHref(locale, page)}
          key={page}
        >
          {page}
        </a>
      ))}
      {archiveState.page < archiveState.pageCount ? (
        <a href={getLocalizedBlogArchiveHref(locale, archiveState.page + 1)}>
          {copy.nextPageLabel}
        </a>
      ) : null}
    </nav>
  );
}

export function BlogArchiveContent({
  archiveState,
  copy,
  locale,
}: BlogArchiveContentProperties) {
  return (
    <div data-blog-page="true">
      <header>
        <h1>{copy.archiveTitle}</h1>
      </header>
      {archiveState.posts.length > 0 ? (
        <>
          <ArticleGrid copy={copy} locale={locale} posts={archiveState.posts} />
          <ArchivePagination archiveState={archiveState} copy={copy} locale={locale} />
        </>
      ) : (
        <p role="status">{copy.emptyArchiveLabel}</p>
      )}
    </div>
  );
}
