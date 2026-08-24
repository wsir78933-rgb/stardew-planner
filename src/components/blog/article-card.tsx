import {
  formatBlogReadTime,
  getLocalizedBlogPostHref,
  type BlogCopy,
} from "../../blog/blog-copy";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";

type ArticleCardHeadingLevel = "h2" | "h3";

type ArticleCardProperties = Readonly<{
  copy: BlogCopy;
  headingLevel?: ArticleCardHeadingLevel;
  locale: PublicLocale;
  post: BlogPostMeta;
}>;

function assertArticleCardHeadingLevel(
  headingLevel: unknown,
): asserts headingLevel is ArticleCardHeadingLevel {
  if (headingLevel !== "h2" && headingLevel !== "h3") {
    throw new Error(
      `Article card headingLevel must be "h2" or "h3"; received ${JSON.stringify(headingLevel)}.`,
    );
  }
}

export function ArticleCard({
  copy,
  headingLevel = "h3",
  locale,
  post,
}: ArticleCardProperties) {
  assertArticleCardHeadingLevel(headingLevel);
  const articleHref = getLocalizedBlogPostHref(locale, post.slug);
  const HeadingTag = headingLevel;

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
        <HeadingTag>
          <a href={articleHref}>{post.title}</a>
        </HeadingTag>
        <p className="blog-article-card__metadata">
          {copy.authorLabel} {post.author} · {formatBlogReadTime(copy, post.readTimeMinutes)}
        </p>
      </div>
    </article>
  );
}
