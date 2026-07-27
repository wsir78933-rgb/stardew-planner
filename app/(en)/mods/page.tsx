import { ModMapCardGrid } from "../../../src/components/mod-map-card-grid";
import { PublicPageLayout } from "../../../src/components/public-page-layout";
import { createPageMetadata } from "../../../src/i18n/page-metadata";
import { translate } from "../../../src/i18n/messages";

export const metadata = createPageMetadata({
  locale: "en",
  canonicalPath: "/mods",
  titleKey: "seo.mods.title",
  descriptionKey: "seo.mods.description",
});

export default function EnglishModsPage() {
  return (
    <PublicPageLayout canonicalPath="/mods" locale="en">
      <h1>{translate("en", "public.navigation.mods")}</h1>
      <ModMapCardGrid locale="en" />
    </PublicPageLayout>
  );
}
