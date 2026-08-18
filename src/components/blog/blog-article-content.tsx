import { formatBlogReadTime, type BlogCopy } from "../../blog/blog-copy";
import type { LocalizedBlogPost } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";
import { TableOfContents } from "./table-of-contents";

type BlogArticleContentProperties = Readonly<{
  copy: BlogCopy;
  locale: PublicLocale;
  post: LocalizedBlogPost;
}>;

export function BlogArticleContent({ copy, locale, post }: BlogArticleContentProperties) {
  const articleId = `blog-article-${post.slug}`;
  const ArticleBody = post.Content;

  return (
    <article data-blog-article="true">
      <header>
        <p>{post.topic}</p>
        <h1>{post.title}</h1>
        <p className="blog-article-description">{post.description}</p>
        <p>
          {copy.authorLabel} {post.author} · {formatBlogReadTime(copy, post.readTimeMinutes)}
        </p>
        <img
          alt={post.coverImage.alt}
          height={941}
          src={post.coverImage.src}
          width={1672}
        />
      </header>
      <div className="blog-article-layout">
        <TableOfContents articleId={articleId} label={copy.tableOfContentsLabel} />
        <div id={articleId}>
          <ArticleBody />
        </div>
      </div>
    </article>
  );
}
