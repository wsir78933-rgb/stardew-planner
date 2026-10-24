import type { Metadata } from "next";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  bedroomDesignCanonicalPath,
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
} from "../../../src/farm-layouts/bedroom-design-content";
import { BedroomDesignPage } from "../../../src/farm-layouts/bedroom-design-page";
import { createBedroomDesignPageStructuredData } from "../../../src/farm-layouts/bedroom-design-structured-data";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";

const locale = "zh-CN";
const canonicalPath = bedroomDesignCanonicalPath;
const pageCopy = getBedroomDesignPageCopy(locale);
const featuredCase = getFeaturedBedroomDesignCase(locale);

export const dynamic = "force-static";

export const metadata: Metadata = createPublicPageMetadata({
  locale,
  canonicalPath,
  title: pageCopy.metaTitle,
  description: pageCopy.description,
  socialImagePath: featuredCase.imageSrc,
});

export default function ChineseBedroomDesignPage() {
  return (
    <PublicPageShell canonicalPath={canonicalPath} locale={locale}>
      <BedroomDesignPage locale={locale} />
      <JsonLdScript
        structuredData={createBedroomDesignPageStructuredData(locale)}
      />
    </PublicPageShell>
  );
}
