import type { Metadata } from "next";
import { ContactPageContent } from "../../../src/contact/contact-page-content";
import { getContactPageCopy } from "../../../src/contact/contact-page-copy";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const contactPageCopy = getContactPageCopy("en");

export const metadata: Metadata = {
  ...createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/contact",
    title: "Contact us | Stardew Valley Farm Planner",
    description: contactPageCopy.description,
  }),
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return (
    <PublicPageShell canonicalPath="/contact" locale="en">
      <ContactPageContent contactCopy={contactPageCopy} />
    </PublicPageShell>
  );
}
