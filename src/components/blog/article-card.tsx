import {
  formatBlogReadTime,
  getLocalizedBlogPostHref,
  type BlogCopy,
} from "../../blog/blog-copy";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";

type ArticleCardProperties = Readonly<{
  copy: BlogCopy;
  locale: PublicLocale;
  post: BlogPostMeta;
}>;

export function ArticleCard({ copy, locale, post }: ArticleCardProperties) {
  const articleHref = getLocalizedBlogPostHref(locale, post.slug);

  return (
    <article className="blog-article-card">
      <a className="blog-article-card__image-link" href={articleHref}>
        <img
          alt={post.coverImage.alt}
          height={941}
          loading="lazy"
          src={post.coverImage.src}
          width={1672}
        />
      </a>
      <div className="blog-article-card__body">
        <p className="blog-article-card__topic">{post.topic}</p>
        <h3>
          <a href={articleHref}>{post.title}</a>
        </h3>
        <p className="blog-article-card__metadata">
          {copy.authorLabel} {post.author} · {formatBlogReadTime(copy, post.readTimeMinutes)}
        </p>
      </div>
    </article>
  );
}
