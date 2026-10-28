import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishCropGrowthPage from "../../app/(en)/tools/crop-growth/page";
import EnglishCropProfitPage from "../../app/(en)/tools/crop-profit/page";
import ChineseCropGrowthPage from "../../app/zh/tools/crop-growth/page";
import ChineseCropProfitPage from "../../app/zh/tools/crop-profit/page";
import type { PublicLocale } from "../../src/i18n/public-locale";
import {
  getLocalizedPublicPath,
  type PublicCanonicalPath,
} from "../../src/i18n/public-route-registry";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import { createWebApplicationStructuredData } from "../../src/seo/page-structured-data";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

type PlantingToolId = "profit" | "growth";

type PlantingToolCanonicalPath = Extract<
  PublicCanonicalPath,
  "/tools/crop-profit" | "/tools/crop-growth"
>;

type PlantingToolPageCase = Readonly<{
  locale: PublicLocale;
  tool: PlantingToolId;
  canonicalPath: PlantingToolCanonicalPath;
  renderPage: () => string;
}>;

const plantingToolPageCases = [
  {
    locale: "en",
    tool: "profit",
    canonicalPath: "/tools/crop-profit",
    renderPage: () => renderToStaticMarkup(<EnglishCropProfitPage />),
  },
  {
    locale: "en",
    tool: "growth",
    canonicalPath: "/tools/crop-growth",
    renderPage: () => renderToStaticMarkup(<EnglishCropGrowthPage />),
  },
  {
    locale: "zh-CN",
    tool: "profit",
    canonicalPath: "/tools/crop-profit",
    renderPage: () => renderToStaticMarkup(<ChineseCropProfitPage />),
  },
  {
    locale: "zh-CN",
    tool: "growth",
    canonicalPath: "/tools/crop-growth",
    renderPage: () => renderToStaticMarkup(<ChineseCropGrowthPage />),
  },
] as const satisfies readonly PlantingToolPageCase[];

function readJsonLdScriptBodies(markup: string): readonly string[] {
  return [
    ...markup.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => match[1] ?? "");
}

function parseJsonLdObject(
  serializedStructuredData: string,
  pageLabel: string,
): Record<string, unknown> {
  let structuredData: unknown;

  try {
    structuredData = JSON.parse(serializedStructuredData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Expected ${pageLabel} JSON-LD to be valid JSON. Received: ${JSON.stringify(serializedStructuredData)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if (
    typeof structuredData !== "object" ||
    structuredData === null ||
    Array.isArray(structuredData)
  ) {
    throw new Error(
      `Expected ${pageLabel} JSON-LD to be an object. Received: ${JSON.stringify(structuredData)}.`,
    );
  }

  return structuredData as Record<string, unknown>;
}

function assertMarkupIsOnlyJsonLdScript(markup: string, pageLabel: string): void {
  const closingTag = "</script>";
  const closingIndex = markup.indexOf(closingTag);
  if (
    !markup.startsWith('<script type="application/ld+json">') ||
    closingIndex === -1 ||
    closingIndex + closingTag.length !== markup.length
  ) {
    throw new Error(
      `Expected ${pageLabel} to render only the JSON-LD script. Received: ${JSON.stringify(markup)}.`,
    );
  }
}

function readOnlyJsonLdObject(
  markup: string,
  pageLabel: string,
): Record<string, unknown> {
  const scriptBodies = readJsonLdScriptBodies(markup);
  if (scriptBodies.length !== 1) {
    throw new Error(
      `Expected ${pageLabel} to render exactly one application/ld+json script. Received count: ${scriptBodies.length}. Markup: ${JSON.stringify(markup)}.`,
    );
  }

  assertMarkupIsOnlyJsonLdScript(markup, pageLabel);

  const scriptBody = scriptBodies[0];
  if (scriptBody === undefined || scriptBody.length === 0) {
    throw new Error(
      `Expected ${pageLabel} JSON-LD script body to be present. Received markup: ${JSON.stringify(markup)}.`,
    );
  }

  return parseJsonLdObject(scriptBody, pageLabel);
}

it.each(plantingToolPageCases)(
  "emits one WebApplication JSON-LD script for the $locale $tool page",
  ({ locale, tool, canonicalPath, renderPage }) => {
    const pageCopy = getToolsPageCopy(locale)[tool];
    const pathname = getLocalizedPublicPath(locale, canonicalPath);
    const pageLabel = `${locale} ${canonicalPath}`;
    const structuredData = readOnlyJsonLdObject(renderPage(), pageLabel);

    expect(structuredData).toEqual(
      createWebApplicationStructuredData({
        locale,
        name: pageCopy.metaTitle,
        description: pageCopy.metaDescription,
        pathname,
      }),
    );
    expect(structuredData["@type"]).toBe("WebApplication");
    expect(structuredData.name).toBe(pageCopy.metaTitle);
    expect(structuredData.description).toBe(pageCopy.metaDescription);
    expect(structuredData.url).toBe(createCanonicalUrl(pathname));
  },
);
