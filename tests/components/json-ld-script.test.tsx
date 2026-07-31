import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { JsonLdScript } from "../../src/components/json-ld-script";

it("renders one application JSON-LD script", () => {
  const markup = renderToStaticMarkup(
    <JsonLdScript
      structuredData={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
      }}
    />,
  );

  expect(markup).toContain('type="application/ld+json"');
  expect(markup).toContain("WebApplication");
  expect(markup).toHaveLength(markup.indexOf("</script>") + "</script>".length);
});
