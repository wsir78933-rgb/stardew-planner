import { notFound } from "next/navigation";
import { BlogArticleContent } from "../../../src/components/blog/blog-article-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getBlogCopy } from "../../../src/blog/blog-copy";
import {
  blogPostSlugs,
  getBlogPostBySlug,
  isBlogPostSlug,
  type BlogPostSlug,
} from "../../../src/blog/blog-post-registry";
import type { PublicCanonicalPath } from "../../../src/i18n/public-route-registry";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createArticleStructuredData } from "../../../src/seo/page-structured-data";

const locale = "en";

type BlogPostPageProperties = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams(): { slug: BlogPostSlug }[] {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

function resolveBlogPost(slug: string) {
  if (!isBlogPostSlug(slug)) {
    notFound();
  }

  const post = getBlogPostBySlug(locale, slug);

  if (post === undefined) {
    notFound();
  }

  return post;
}

export async function generateMetadata({ params }: BlogPostPageProperties) {
  const { slug } = await params;
  const post = resolveBlogPost(slug);
  const canonicalPath: PublicCanonicalPath = `/${post.slug}`;

  return createPublicPageMetadata({
    locale,
    canonicalPath,
    title: post.title,
    description: post.description,
    openGraphType: "article",
    socialImagePath: post.coverImage.src,
    robots: { index: true, follow: true },
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProperties) {
  const { slug } = await params;
  const post = resolveBlogPost(slug);
  const canonicalPath: PublicCanonicalPath = `/${post.slug}`;

  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <BlogArticleContent copy={getBlogCopy(locale)} locale={locale} post={post} />
      <JsonLdScript
        structuredData={createArticleStructuredData({
          headline: post.title,
          description: post.description,
          pathname: canonicalPath,
        })}
      />
    </PublicPageShell>
  );
}
