import { FarmComparisonContent } from "../../../src/components/farm-comparison-content";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";
import { translate } from "../../../src/i18n/messages";

export const metadata = createPageMetadata({
  locale: "en",
  canonicalPath: "/farm-comparison",
  titleKey: "seo.farmComparison.title",
  descriptionKey: "seo.farmComparison.description",
});

export default function EnglishFarmComparisonPage() {
  return (
    <PublicPageLayout canonicalPath="/farm-comparison" locale="en">
      <h1>{translate("en", "public.navigation.farmComparison")}</h1>
      <FarmComparisonContent locale="en" />
    </PublicPageLayout>
  );
}
