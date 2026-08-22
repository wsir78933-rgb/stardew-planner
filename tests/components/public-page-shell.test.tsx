import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import { expect, it } from "vitest";
import { PublicNavigation } from "../../src/components/public-navigation";
import { PublicPageShell } from "../../src/components/public-page-shell";

it("renders a shared static navigation frame around route content", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="en">
      <h1>Example route</h1>
    </PublicPageShell>,
  );

  expect(markup).toContain('data-public-page-shell="true"');
  expect(markup).toContain("data-public-page-header");
  expect(markup).toContain('aria-label="Stardew Valley Farm Planner"');
  expect(markup).toContain("data-public-page-brand");
  expect(markup).not.toContain("data-homepage-header");
  expect(markup).not.toContain("data-homepage-brand");
  expect(markup).toContain('href="/"');
  expect(markup).toContain("Stardew Valley Farm Planner");
  expect(markup).toContain('href="/#capabilities">How it works</a>');
  expect(markup).toContain('href="/#faq">FAQ</a>');
  expect(markup).toContain('href="/blog">Blog</a>');
  expect(markup).toContain("data-homepage-language-switcher");
  expect(markup).toContain('href="/zh"');
  expect(markup).toContain('href="/#planner"');
  expect(markup).toContain("Open planner");
  expect(markup).not.toContain('class="public-page-shell-brand"');
  expect(markup).not.toContain('class="public-page-shell-language-switcher"');
  expect(markup).toContain("Example route");
  expect(markup).toContain('data-site-footer="true"');
  expect(markup).toContain(
    "A browser-local fan-made tool for planning Stardew Valley farm layouts.",
  );
  expect(markup).toContain("<h2>Planner</h2>");
  expect(markup).toContain("<h2>Explore</h2>");
  expect(markup).toContain("<h2>Legal</h2>");
  expect(markup).toContain('<a href="/privacy">Privacy Policy</a>');
  expect(markup).toContain('<a href="/terms">Terms of Service</a>');
  expect(markup).toContain('<a href="/contact">Contact us</a>');
  expect(markup).toMatch(
    /<div data-site-footer-social-icons="true">[\s\S]*?href="https:\/\/x\.com\/wsir1139"[\s\S]*?<\/div>/,
  );
  expect(markup).toContain("© Stardew Valley Farm Planner");
});

it("keeps every Chinese public homepage link on /zh", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="zh-CN">
      <h1>中文公共页</h1>
    </PublicPageShell>,
  );

  expect(markup).toContain('aria-label="星露谷物语农场规划器"');
  expect(markup).toContain("data-public-page-brand");
  expect(markup).not.toContain("data-homepage-brand");
  expect(markup).toContain('href="/zh"');
  expect(markup).toContain("星露谷物语农场规划器");
  expect(markup).toContain('href="/zh#capabilities">使用方式</a>');
  expect(markup).toContain('href="/zh#faq">常见问题</a>');
  expect(markup).toContain('href="/zh/blog">博客</a>');
  expect(markup).toContain("data-homepage-language-switcher");
  expect(markup).toContain('href="/"');
  expect(markup).toContain('href="/zh#planner"');
  expect(markup).toContain("打开规划器");
  expect(markup).not.toContain('href="/zh/farm-comparison"');
  expect(markup).not.toContain('href="/zh/mods"');
  expect(markup).toContain('data-site-footer="true"');
  expect(markup).toContain("在浏览器中本地规划《星露谷物语》农场布局的玩家工具。");
  expect(markup).toContain("<h2>规划器</h2>");
  expect(markup).toContain("<h2>探索</h2>");
  expect(markup).toContain("<h2>法律</h2>");
  expect(markup).toContain('<a href="/zh/privacy">隐私政策</a>');
  expect(markup).toContain('<a href="/zh/terms">服务条款</a>');
  expect(markup).toContain('<a href="/zh/contact">联系我们</a>');
  expect(markup).toContain('<a href="/zh">规划器</a>');
  expect(markup).toContain('<a href="/zh#capabilities">使用方式</a>');
  expect(markup).toContain('<a href="/zh#faq">常见问题</a>');
  expect(markup).toMatch(
    /<div data-site-footer-social-icons="true">[\s\S]*?href="https:\/\/x\.com\/wsir1139"[\s\S]*?<\/div>/,
  );
});

it("keeps the planner destination localized on a Chinese information page", () => {
  const markup = renderToStaticMarkup(
    <PublicNavigation canonicalPath="/privacy" locale="zh-CN" />,
  );

  expect(markup).toContain('href="/zh#planner"');
  expect(markup).toContain("打开规划器");
  expect(markup).toContain('href="/privacy"');
  expect(markup).toContain('href="/zh/privacy"');
  expect(markup).not.toContain('href="/zh/farm-comparison"');
  expect(markup).not.toContain('href="/zh/mods"');
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
  // @ts-expect-error PublicPageShell must require a canonical identity.
  void <PublicPageShell locale="en" />;
  // @ts-expect-error PublicNavigation must require a canonical identity.
  void <PublicNavigation locale="en" />;
});
