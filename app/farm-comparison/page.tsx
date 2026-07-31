import { FarmComparisonContent } from "../../src/components/farm-comparison-content";
import { JsonLdScript } from "../../src/components/json-ld-script";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";
import { createArticleStructuredData } from "../../src/seo/page-structured-data";

const farmComparisonDescription =
  "Compare all eight Stardew Valley farm maps, their tillable tiles, buildable space, and unique features.";

export const farmComparisonMetadata = createPublicPageMetadata({
  pathname: "/farm-comparison",
  title: "Stardew Valley Farm Types Compared",
  description: farmComparisonDescription,
  openGraphType: "article",
});

export const metadata = farmComparisonMetadata;

export default function FarmComparisonPage() {
  return (
    <PublicPageShell>
      <article className="public-page-content">
        <header className="public-page-header">
          <h1>Stardew Valley Farm Types Compared</h1>
          <p>{farmComparisonDescription}</p>
        </header>
        <FarmComparisonContent />
      </article>
      <JsonLdScript
        structuredData={createArticleStructuredData({
          headline: "Stardew Valley Farm Types Compared",
          description: farmComparisonDescription,
          pathname: "/farm-comparison",
        })}
      />
    </PublicPageShell>
  );
}
