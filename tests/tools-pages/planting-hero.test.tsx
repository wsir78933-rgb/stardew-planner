import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import type { ToolsPageHeroCopy } from "../../src/i18n/tools-page-copy";
import { CropGrowthTool } from "../../src/tools-pages/crop-growth-tool";
import { CropProfitTool } from "../../src/tools-pages/crop-profit-tool";
import { SimpleHero } from "../../src/tools-pages/simple-hero";

const plantingHeroCases = [
  {
    locale: "en",
    tool: "profit",
    calculatorId: "crop-profit-calculator",
    expectedHeading: "Stardew Valley Crop Profit Calculator",
  },
  {
    locale: "en",
    tool: "growth",
    calculatorId: "crop-growth-calculator",
    expectedHeading: "Stardew Valley Crop Growth Calculator",
  },
  {
    locale: "zh-CN",
    tool: "profit",
    calculatorId: "crop-profit-calculator",
    expectedHeading: "星露谷物语作物收益计算器",
  },
  {
    locale: "zh-CN",
    tool: "growth",
    calculatorId: "crop-growth-calculator",
    expectedHeading: "星露谷物语作物生长计算器与收获日历",
  },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  tool: "profit" | "growth";
  calculatorId: string;
  expectedHeading: string;
}>[];

function readRenderedText(markup: string): string {
  return markup
    .replace(/<svg\b[\s\S]*?<\/svg>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readHeadingMarkup(markup: string): string {
  const headingMatch = markup.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/);
  if (headingMatch === null) {
    throw new Error("Expected SimpleHero to render one h1 element.");
  }

  return headingMatch[0];
}

it.each(plantingHeroCases)(
  "renders the localized $tool hero with an accessible calculator action in $locale",
  ({ locale, tool, calculatorId, expectedHeading }) => {
    const heroCopy = getToolsPageCopy(locale)[tool].hero;
    const titleId = `${tool}-hero-title`;
    const renderedMarkup = renderToStaticMarkup(
      <SimpleHero
        actionHref={`#${calculatorId}`}
        copy={heroCopy}
        locale={locale}
        titleId={titleId}
      />,
    );
    const headingMarkup = readHeadingMarkup(renderedMarkup);
    const expectedActionPattern = new RegExp(
      `<a\\b(?=[^>]*\\bhref="#${calculatorId}")[^>]*>${heroCopy.actionLabel}</a>`,
    );

    expect(renderedMarkup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(renderedMarkup).toContain(`<section aria-labelledby="${titleId}"`);
    expect(headingMarkup).toContain(`<h1 class="`);
    expect(headingMarkup).toContain(`id="${titleId}"`);
    expect(headingMarkup.match(/<br\s*\/?\s*>/g) ?? []).toHaveLength(1);
    expect(headingMarkup).toContain(`<em class="`);
    expect(readRenderedText(headingMarkup)).toBe(expectedHeading);
    expect(renderedMarkup).toContain(`<p class="`);
    expect(renderedMarkup).toContain(`>${heroCopy.description}</p>`);
    expect(renderedMarkup.match(/<a\b/g) ?? []).toHaveLength(1);
    expect(renderedMarkup).toMatch(expectedActionPattern);
  },
);

it.each(plantingHeroCases)(
  "connects the $tool hero action to its calculator workspace in $locale",
  ({ locale, tool, calculatorId, expectedHeading }) => {
    const heroCopy = getToolsPageCopy(locale)[tool].hero;
    const renderedMarkup =
      tool === "profit"
        ? renderToStaticMarkup(<CropProfitTool locale={locale} />)
        : renderToStaticMarkup(<CropGrowthTool locale={locale} requestedCropId={null} />);
    const actionPattern = new RegExp(
      `<a\\b(?=[^>]*\\bhref="#${calculatorId}")[^>]*>${heroCopy.actionLabel}</a>`,
    );

    expect(renderedMarkup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(readRenderedText(readHeadingMarkup(renderedMarkup))).toBe(expectedHeading);
    expect(renderedMarkup.match(new RegExp(`\\bid="${calculatorId}"`, "g")) ?? []).toHaveLength(1);
    expect(renderedMarkup).toMatch(actionPattern);
  },
);

it("fails fast with the received blank title value", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const invalidHeroCopy = { ...heroCopy, titleBefore: "   " } as ToolsPageHeroCopy;

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref="#crop-profit-calculator"
        copy={invalidHeroCopy}
        locale="en"
        titleId="crop-profit-hero-title"
      />,
    ),
  ).toThrow(`copy.titleBefore=${JSON.stringify("   ")}`);
});

it("fails fast with the received empty title suffix", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const invalidHeroCopy = { ...heroCopy, titleAfter: "" } as ToolsPageHeroCopy;

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref="#crop-profit-calculator"
        copy={invalidHeroCopy}
        locale="en"
        titleId="crop-profit-hero-title"
      />,
    ),
  ).toThrow(`copy.titleAfter=${JSON.stringify("")}`);
});

it("fails fast with the received unsupported locale", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const unsupportedLocale = "ru" as PublicLocale;

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref="#crop-profit-calculator"
        copy={heroCopy}
        locale={unsupportedLocale}
        titleId="crop-profit-hero-title"
      />,
    ),
  ).toThrow(`locale=${JSON.stringify(unsupportedLocale)} is unsupported`);
});

it("fails fast with the received empty title id", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const invalidTitleId = "";

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref="#crop-profit-calculator"
        copy={heroCopy}
        locale="en"
        titleId={invalidTitleId}
      />,
    ),
  ).toThrow(`titleId=${JSON.stringify(invalidTitleId)} must be a valid HTML id`);
});

it("fails fast with the received path action href", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const invalidActionHref = "/x";

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref={invalidActionHref}
        copy={heroCopy}
        locale="en"
        titleId="crop-profit-hero-title"
      />,
    ),
  ).toThrow(`actionHref=${JSON.stringify(invalidActionHref)}`);
});
