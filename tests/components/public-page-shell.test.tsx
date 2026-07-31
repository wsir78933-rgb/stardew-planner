import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ChinesePlannerIntroduction } from "../../src/components/chinese-planner-introduction";
import { PublicPageShell } from "../../src/components/public-page-shell";

it("renders a shared static navigation frame around route content", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="en">
      <h1>Example route</h1>
    </PublicPageShell>,
  );

  expect(markup).toContain('data-public-page-shell="true"');
  expect(markup).toContain('aria-label="Public navigation"');
  expect(markup).toContain('href="/"');
  expect(markup).toContain("Example route");
  expect(markup).not.toContain("Privacy");
  expect(markup).not.toContain("Terms");
  expect(markup).toContain("© Stardew Valley Farm Planner");
});

it("renders Chinese navigation and a static English-planner CTA", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="zh-CN">
      <ChinesePlannerIntroduction />
    </PublicPageShell>,
  );

  expect(markup).toContain('aria-label="公共导航"');
  expect(markup).toContain('href="/"');
  expect(markup).toContain("开始规划");
  expect(markup).not.toContain("reference-runtime-root");
});
