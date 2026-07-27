import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ReferenceRuntimeHost } from "../../src/components/reference-runtime-host";

describe("reference runtime host", () => {
  it("keeps the client-only runtime boundary out of static HTML", () => {
    const referenceRuntimeHostMarkup = renderToStaticMarkup(
      createElement(ReferenceRuntimeHost),
    );

    expect(referenceRuntimeHostMarkup).not.toContain(
      'id="reference-runtime-root"',
    );
    expect(referenceRuntimeHostMarkup).not.toContain(
      'src="/reference-runtime/bootstrap.mjs"',
    );
    expect(referenceRuntimeHostMarkup).not.toContain("<iframe");
  });
});
