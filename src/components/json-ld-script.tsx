import { serializeJsonLd } from "../seo/page-structured-data";

type JsonLdScriptProperties = Readonly<{
  structuredData: Record<string, unknown>;
}>;

export function JsonLdScript({ structuredData }: JsonLdScriptProperties) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  );
}
