import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { BlogCopy } from "../../blog/blog-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import { ArticleCard } from "./article-card";

type ArticleGridProperties = Readonly<{
  copy: BlogCopy;
  locale: PublicLocale;
  posts: readonly BlogPostMeta[];
}>;

export function ArticleGrid({ copy, locale, posts }: ArticleGridProperties) {
  return (
    <div className="blog-article-grid">
      {posts.map((post, index) => (
        <ArticleCard copy={copy} key={`${post.slug}-${index}`} locale={locale} post={post} />
      ))}
    </div>
  );
}
