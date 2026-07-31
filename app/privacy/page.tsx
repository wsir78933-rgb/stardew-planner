import { LegalPageContent } from "../../src/components/legal-page-content";
import { PublicPageShell } from "../../src/components/public-page-shell";
import { privacyDocument } from "../../src/reference/legal-pages";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";

export const privacyMetadata = createPublicPageMetadata({
  pathname: "/privacy",
  title: privacyDocument.title,
  description:
    "Learn how this browser-local planner handles projects, preferences, and local data.",
});

export const metadata = privacyMetadata;

export default function PrivacyPage() {
  return (
    <PublicPageShell locale="en">
      <LegalPageContent document={privacyDocument} />
    </PublicPageShell>
  );
}
