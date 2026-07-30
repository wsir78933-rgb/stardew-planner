import { FarmComparisonContent } from "../../../src/components/farm-comparison-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";
import { createCollectionPageStructuredData } from "../../../src/i18n/page-structured-data";
import { translate } from "../../../src/i18n/messages";

export const metadata = createPageMetadata({
  locale: "zh-CN",
  canonicalPath: "/farm-comparison",
  titleKey: "seo.farmComparison.title",
  descriptionKey: "seo.farmComparison.description",
});

export default function ChineseFarmComparisonPage() {
  return (
    <PublicPageLayout canonicalPath="/farm-comparison" locale="zh-CN">
      <JsonLdScript
        structuredData={createCollectionPageStructuredData({
          locale: "zh-CN",
          canonicalPath: "/farm-comparison",
          titleKey: "seo.farmComparison.title",
          descriptionKey: "seo.farmComparison.description",
        })}
      />
      <h1>{translate("zh-CN", "public.navigation.farmComparison")}</h1>
      <FarmComparisonContent locale="zh-CN" />
    </PublicPageLayout>
  );
}
