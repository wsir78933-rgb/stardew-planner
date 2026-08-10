import { FarmComparisonContent } from "../../../src/components/farm-comparison-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { getPublicPageCopy } from "../../../src/i18n/public-page-content";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import { createArticleStructuredData } from "../../../src/seo/page-structured-data";

const pageCopy = getPublicPageCopy("en");

export const farmComparisonMetadata = createPublicPageMetadata({
  locale: "en",
  canonicalPath: "/farm-comparison",
  title: pageCopy.farmComparisonMetaTitle,
  description: pageCopy.farmComparisonDescription,
  openGraphType: "article",
});

export const metadata = farmComparisonMetadata;

export default function FarmComparisonPage() {
  return (
    <PublicPageShell canonicalPath="/farm-comparison" locale="en">
      <article className="public-page-content">
        <header className="public-page-header">
          <h1>{pageCopy.farmComparisonTitle}</h1>
          <p>{pageCopy.farmComparisonIntroduction}</p>
        </header>
        <FarmComparisonContent locale="en" />
      </article>
      <JsonLdScript
        structuredData={createArticleStructuredData({
          locale: "en",
          headline: pageCopy.farmComparisonTitle,
          description: pageCopy.farmComparisonDescription,
          pathname: "/farm-comparison",
        })}
      />
    </PublicPageShell>
  );
}
