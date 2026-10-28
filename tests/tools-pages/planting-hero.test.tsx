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

function readElementMarkup(markup: string, tagName: string, elementId: string): string {
  const elementMatch = markup.match(
    new RegExp(`<${tagName}\\b(?=[^>]*\\bid="${elementId}")[^>]*>[\\s\\S]*?</${tagName}>`),
  );
  if (elementMatch === null) {
    throw new Error(`Expected <${tagName} id="${elementId}"> in rendered markup.`);
  }

  return elementMatch[0];
}

function readElementClass(markup: string, tagName: string, elementId: string): string {
  const openingTag = readElementMarkup(markup, tagName, elementId).match(/^<[^>]+>/);
  if (openingTag === null) {
    throw new Error(`Expected <${tagName} id="${elementId}"> to have an opening tag.`);
  }

  const classMatch = openingTag[0].match(/\bclass="([^"]*)"/);
  if (classMatch === null) {
    throw new Error(
      `Expected <${tagName} id="${elementId}"> to include a class. Received: ${openingTag[0]}.`,
    );
  }

  return classMatch[1] ?? "";
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

it.each(plantingHeroCases)(
  "renders the inactive $tool hero as a paragraph with the same heading classes in $locale",
  ({ locale, tool, calculatorId, expectedHeading }) => {
    const heroCopy = getToolsPageCopy(locale)[tool].hero;
    const titleId = `${tool}-hero-title`;
    const activeMarkup = renderToStaticMarkup(
      <SimpleHero
        actionHref={`#${calculatorId}`}
        copy={heroCopy}
        locale={locale}
        titleId={titleId}
      />,
    );
    const inactiveMarkup = renderToStaticMarkup(
      <SimpleHero
        actionHref={`#${calculatorId}`}
        copy={heroCopy}
        documentHeading={false}
        locale={locale}
        titleId={titleId}
      />,
    );
    const inactiveHeadingMarkup = readElementMarkup(inactiveMarkup, "p", titleId);

    expect(inactiveMarkup.match(/<h1\b/g) ?? []).toHaveLength(0);
    expect(inactiveMarkup).toContain(`<section aria-labelledby="${titleId}"`);
    expect(readElementClass(inactiveMarkup, "p", titleId)).toBe(
      readElementClass(activeMarkup, "h1", titleId),
    );
    expect(inactiveHeadingMarkup.match(/<br\s*\/?\s*>/g) ?? []).toHaveLength(1);
    expect(inactiveHeadingMarkup).toContain(`<em class="`);
    expect(readRenderedText(inactiveHeadingMarkup)).toBe(expectedHeading);
    expect(inactiveMarkup).toContain(`>${heroCopy.description}</p>`);
  },
);

it.each(plantingHeroCases)(
  "keeps an h1 only when the $tool is the document heading in $locale",
  ({ locale, tool, expectedHeading }) => {
    const titleId = `crop-${tool}-hero-title`;
    const activeMarkup =
      tool === "profit"
        ? renderToStaticMarkup(<CropProfitTool locale={locale} />)
        : renderToStaticMarkup(<CropGrowthTool locale={locale} requestedCropId={null} />);
    const inactiveMarkup =
      tool === "profit"
        ? renderToStaticMarkup(<CropProfitTool documentHeading={false} locale={locale} />)
        : renderToStaticMarkup(
            <CropGrowthTool documentHeading={false} locale={locale} requestedCropId={null} />,
          );

    expect(activeMarkup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(activeMarkup).toContain(`<h1 class="`);
    expect(activeMarkup).toContain(`id="${titleId}"`);
    expect(inactiveMarkup.match(/<h1\b/g) ?? []).toHaveLength(0);
    expect(inactiveMarkup).toContain(`<section aria-labelledby="${titleId}"`);
    expect(readRenderedText(readElementMarkup(inactiveMarkup, "p", titleId))).toBe(expectedHeading);
    expect(readElementClass(inactiveMarkup, "p", titleId)).toBe(
      readElementClass(activeMarkup, "h1", titleId),
    );
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

it("fails fast with the received non-boolean document heading flag", () => {
  const heroCopy = getToolsPageCopy("en").profit.hero;
  const invalidDocumentHeading = "false";

  expect(() =>
    renderToStaticMarkup(
      <SimpleHero
        actionHref="#crop-profit-calculator"
        copy={heroCopy}
        documentHeading={invalidDocumentHeading as unknown as boolean}
        locale="en"
        titleId="crop-profit-hero-title"
      />,
    ),
  ).toThrow(`documentHeading=${JSON.stringify(invalidDocumentHeading)}`);
});
