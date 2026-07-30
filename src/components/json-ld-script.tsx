import type { JSX } from "react";

type JsonLdScriptProperties = Readonly<{
  structuredData: Record<string, unknown>;
}>;

export function JsonLdScript({
  structuredData,
}: JsonLdScriptProperties): JSX.Element {
  const serializedStructuredData = JSON.stringify(structuredData);

  if (typeof serializedStructuredData !== "string") {
    throw new Error(
      `structured data could not be serialized: ${String(serializedStructuredData)}`,
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializedStructuredData.replace(/</g, "\\u003c"),
      }}
    />
  );
}
