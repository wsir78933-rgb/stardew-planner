import type { Metadata } from "next";
import { ContactPageContent } from "../../../src/contact/contact-page-content";
import { getContactPageCopy } from "../../../src/contact/contact-page-copy";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const contactPageCopy = getContactPageCopy("zh-CN");

export const metadata: Metadata = {
  ...createPublicPageMetadata({
    locale: "zh-CN",
    canonicalPath: "/contact",
    title: "联系我们 | 星露谷农场规划器",
    description: contactPageCopy.description,
  }),
  robots: { index: false, follow: true },
};

export default function ChineseContactPage() {
  return (
    <PublicPageShell canonicalPath="/contact" locale="zh-CN">
      <ContactPageContent contactCopy={contactPageCopy} />
    </PublicPageShell>
  );
}
