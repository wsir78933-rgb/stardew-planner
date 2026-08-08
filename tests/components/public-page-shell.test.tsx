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
  expect(markup).toContain(
    'class="public-page-shell-brand" href="/">Stardew Valley Farm Planner</a>',
  );
  expect(markup).toContain('aria-current="page" href="/">Planner</a>');
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
  expect(markup).toContain(
    'class="public-page-shell-language-switcher" href="/zh"',
  );
});

it("renders Chinese navigation and a static English-planner CTA", () => {
  const markup = renderToStaticMarkup(
    <PublicPageShell canonicalPath="/" locale="zh-CN">
      <ChinesePlannerIntroduction />
    </PublicPageShell>,
  );

  expect(markup).toContain('aria-label="公共导航"');
  expect(markup).toContain('href="/"');
  expect(markup).toContain(
    'class="public-page-shell-brand" href="/">星露谷规划器</a>',
  );
  expect(markup).toContain('href="/">规划器</a>');
  expect(markup).not.toContain(
    'aria-current="page" href="/">规划器</a>',
  );
  expect(markup).toContain('href="/zh/farm-comparison">农场对比</a>');
  expect(markup).toContain('href="/zh/mods">模组</a>');
  const chinesePlannerDescription =
    "使用本地地图、物品和项目规划你的星露谷农场布局。";
  const englishPlannerLanguageNotice =
    "The editing interface opens in English.";

  expect(markup).toContain(chinesePlannerDescription);
  expect(markup).toContain(englishPlannerLanguageNotice);
  expect(markup.indexOf(chinesePlannerDescription)).toBeLessThan(
    markup.indexOf(englishPlannerLanguageNotice),
  );
  expect(markup).toContain(">规划器</a>");
  expect(markup).not.toContain("开始规划");
  expect(markup).not.toContain("reference-runtime-root");
  expect(markup).toContain(
    'class="public-page-shell-language-switcher" href="/"',
  );
  expect(markup).toContain('data-site-footer="true"');
  expect(markup).toContain("在浏览器中本地规划《星露谷物语》农场布局的玩家工具。");
  expect(markup).toContain("<h2>规划器</h2>");
  expect(markup).toContain("<h2>探索</h2>");
  expect(markup).toContain("<h2>法律</h2>");
  expect(markup).toContain('<a href="/zh/privacy">隐私政策</a>');
  expect(markup).toContain('<a href="/zh/terms">服务条款</a>');
  expect(markup).toContain('<a href="/zh/contact">联系我们</a>');
  expect(markup).toMatch(
    /<div data-site-footer-social-icons="true">[\s\S]*?href="https:\/\/x\.com\/wsir1139"[\s\S]*?<\/div>/,
  );
});

it("marks the matching Chinese public destination current without marking the English Planner entry", () => {
  const markup = renderToStaticMarkup(
    <PublicNavigation canonicalPath="/farm-comparison" locale="zh-CN" />,
  );

  expect(markup).toContain('href="/">规划器</a>');
  expect(markup).toContain(
    'aria-current="page" href="/zh/farm-comparison">农场对比</a>',
  );
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
