import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import { expect, it } from "vitest";
import { ChinesePlannerIntroduction } from "../../src/components/chinese-planner-introduction";
import { PublicNavigation } from "../../src/components/public-navigation";
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
  expect(markup).toContain("The editing interface opens in English.");
  expect(markup).toContain(">规划器</a>");
  expect(markup).not.toContain("开始规划");
  expect(markup).not.toContain("reference-runtime-root");
});

it("does not infer a root counterpart for a retiring legal page", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell locale="en">
      <h1>Privacy Policy</h1>
    </PublicPageShell>,
  );

  expect(markup).not.toContain("public-page-shell-language-switcher");
  expect(markup).toContain('aria-label="Public navigation"');
});

it("rejects an omitted locale instead of rendering English navigation", () => {
  expect(() =>
    renderToStaticMarkup(
      <PublicNavigation
        {...({
          canonicalPath: "/",
          locale: undefined,
        } as unknown as ComponentProps<typeof PublicNavigation>)}
      />,
    ),
  ).toThrow("Unsupported public locale. Received: undefined.");
});

it("requires locale props at the type boundary", () => {
  // @ts-expect-error PublicPageShell must not infer an English locale.
  void <PublicPageShell canonicalPath="/" />;
  // @ts-expect-error PublicNavigation must not infer an English locale.
  void <PublicNavigation canonicalPath="/" />;
});
