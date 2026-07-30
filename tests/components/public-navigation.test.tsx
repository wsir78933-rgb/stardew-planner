import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PublicNavigation } from "../../src/components/public-navigation";
import { PublicPageLayout } from "../../src/components/public-page-layout";

describe("public navigation", () => {
  it("renders translated navigation and preserves the supplied planner query in the language switcher", () => {
    const markup = renderToStaticMarkup(
      <PublicPageLayout
        canonicalPath="/"
        locale="zh-CN"
        search="farmType=beach"
      >
        <p>页面内容</p>
      </PublicPageLayout>,
    );

    expect(markup).toContain('aria-label="公共导航"');
    expect(markup).toContain('href="/zh/farm-comparison"');
    expect(markup).toContain(">农场对比<");
    expect(markup).toContain('aria-label="语言"');
    expect(markup).toContain('href="/?farmType=beach"');
    expect(markup).toContain('href="/zh?farmType=beach"');
    expect(markup).toContain("页面内容");
    expect(markup).not.toContain('href="/zh/privacy"');
    expect(markup).not.toContain('href="/zh/terms"');
  });

  it("uses English paths and labels when the explicit locale is English", () => {
    const markup = renderToStaticMarkup(<PublicNavigation locale="en" />);

    expect(markup).toContain('aria-label="Public navigation"');
    expect(markup).toContain('href="/mods"');
    expect(markup).toContain(">Farm Comparison<");
    expect(markup).not.toContain('href="/zh/mods"');
    expect(markup).not.toContain('href="/privacy"');
    expect(markup).not.toContain('href="/terms"');
  });
});
