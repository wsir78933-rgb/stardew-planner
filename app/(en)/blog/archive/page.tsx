import { BlogArchiveClientContent } from "../../../../src/components/blog/blog-archive-client-content";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import { getBlogCopy } from "../../../../src/blog/blog-copy";
import { getAllBlogPostMeta } from "../../../../src/blog/blog-post-registry";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import { createCollectionPageStructuredData } from "../../../../src/seo/page-structured-data";

const locale = "en";
const canonicalPath = "/blog/archive";
const copy = getBlogCopy(locale);

export const dynamic = "force-static";

export const metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: copy.archiveTitle,
  description: copy.blogDescription,
  robots: { index: true, follow: true },
});

export default function BlogArchivePage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <BlogArchiveClientContent copy={copy} locale={locale} posts={getAllBlogPostMeta(locale)} />
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          locale: "en",
          name: copy.archiveTitle,
          description: copy.blogDescription,
          pathname: canonicalPath,
        })}
      />
    </PublicPageShell>
  );
}
