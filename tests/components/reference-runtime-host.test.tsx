import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ReferenceRuntimeHost } from "../../src/components/reference-runtime-host";

function countBootstrapExecutionScripts(referenceRuntimeHostMarkup: string): number {
  return [
    ...referenceRuntimeHostMarkup.matchAll(/<script\b[^>]*>/gi),
  ].filter(
    (scriptTagMatch) =>
      /\btype="module"/i.test(scriptTagMatch[0]) &&
      /\bsrc="\/reference-runtime\/bootstrap\.mjs"/i.test(
        scriptTagMatch[0],
      ),
  ).length;
}

describe("reference runtime host", () => {
  it("renders one frozen-runtime mount and one native module bootstrap in static HTML", () => {
    const referenceRuntimeHostMarkup = renderToStaticMarkup(
      createElement(ReferenceRuntimeHost),
    );

    expect(
      referenceRuntimeHostMarkup.match(/id="reference-runtime-root"/g),
    ).toHaveLength(1);
    expect(countBootstrapExecutionScripts(referenceRuntimeHostMarkup)).toBe(1);
    expect(referenceRuntimeHostMarkup).not.toContain("<iframe");
  });
});
