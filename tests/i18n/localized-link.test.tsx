import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocalizedLink } from "../../src/i18n/localized-link";

describe("LocalizedLink", () => {
  it("renders the explicitly selected locale path with the canonical query and hash", () => {
    const markup = renderToStaticMarkup(
      <LocalizedLink
        locale="zh-CN"
        canonicalPath="/farm/standard"
        search="farmType=beach"
        hash="details"
      >
        Standard Farm
      </LocalizedLink>,
    );

    expect(markup).toContain(
      'href="/zh/farm/standard?farmType=beach#details"',
    );
    expect(markup).toContain(">Standard Farm</a>");
  });
});
