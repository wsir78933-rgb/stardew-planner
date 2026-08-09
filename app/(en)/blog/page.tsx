import { BlogIndexClientContent } from "../../../src/components/blog/blog-index-client-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getBlogCopy } from "../../../src/blog/blog-copy";
import { getAllBlogPostMeta } from "../../../src/blog/blog-post-registry";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createCollectionPageStructuredData } from "../../../src/seo/page-structured-data";

const locale = "en";
const canonicalPath = "/blog";
const copy = getBlogCopy(locale);

export const dynamic = "force-static";

export const metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: copy.blogTitle,
  description: copy.blogDescription,
  robots: { index: false, follow: true },
});

export default function BlogPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <BlogIndexClientContent copy={copy} locale={locale} posts={getAllBlogPostMeta(locale)} />
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          name: copy.blogTitle,
          description: copy.blogDescription,
          pathname: canonicalPath,
        })}
      />
    </PublicPageShell>
  );
}
