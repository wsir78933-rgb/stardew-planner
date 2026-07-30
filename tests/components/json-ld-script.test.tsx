import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JsonLdScript } from "../../src/components/json-ld-script";

describe("JsonLdScript", () => {
  it("serializes JSON-LD into an application script without allowing script termination", () => {
    const markup = renderToStaticMarkup(
      <JsonLdScript
        structuredData={{ name: "</script><script>unsafe()</script>" }}
      />,
    );

    expect(markup).toContain('type="application/ld+json"');
    expect(markup).toContain("\\u003c/script>");
    expect(markup).not.toContain("</script><script>unsafe()");
  });
});
