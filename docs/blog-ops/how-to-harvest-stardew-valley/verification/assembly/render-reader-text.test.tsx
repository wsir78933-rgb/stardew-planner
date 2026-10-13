import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HowToHarvestStardewValleyChineseArticle } from "../../../../../src/blog/articles/how-to-harvest-stardew-valley.zh";
import { HowToHarvestStardewValleyEnglishArticle } from "../../../../../src/blog/articles/how-to-harvest-stardew-valley.en";

const handoffDirectory = new URL("../../handoffs/", import.meta.url);

const forbiddenReaderFragments = [
  "blog-sources",
  "data-blog-planner-cta",
  "BlogSources",
  "Wiki revision is the oldid",
  "This citation supports planting",
  "docs/blog-ops",
  "operation-store",
  "/Users/",
] as const;

function readHandoff(fileName: string): {
  body: string;
  publicReferences: readonly { url: string }[];
  publicRequirements: {
    figures: readonly {
      alt: string;
      caption: string;
      src: string;
    }[];
  };
} {
  const handoff = JSON.parse(readFileSync(new URL(fileName, handoffDirectory), "utf8")) as {
    body?: unknown;
    publicReferences?: unknown;
    publicRequirements?: {
      figures?: unknown;
    };
  };
  if (typeof handoff.body !== "string" || !Array.isArray(handoff.publicReferences)) {
    throw new Error(`Handoff ${fileName} is missing body or publicReferences.`);
  }
  const figures = handoff.publicRequirements?.figures;
  if (!Array.isArray(figures) || figures.length !== 1) {
    throw new Error(`Handoff ${fileName} figure count is not 1. Received: ${JSON.stringify(figures)}.`);
  }
  return handoff as {
    body: string;
    publicReferences: readonly { url: string }[];
    publicRequirements: {
      figures: readonly { alt: string; caption: string; src: string }[];
    };
  };
}

function approvedReaderText(body: string): string {
  const withCaption = body.replace(
    /<figure\b[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g,
    " $1 ",
  );
  const withLabels = withCaption.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const withoutMarkup = withLabels.replace(/^#{2,3} /gm, "").replace(/^- /gm, "").replace(/<[^>]+>/g, " ");
  return withoutMarkup.replace(/\s+/g, " ").trim();
}

function renderedReaderText(markup: string): string {
  const withoutAnchors = markup.replace(/<\/?a\b[^>]*>/g, "");
  return withoutAnchors.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderedHrefs(markup: string): string[] {
  return [...markup.matchAll(/href="([^"]*)"/g)].map((match) =>
    (match[1] ?? "").replaceAll("&amp;", "&"),
  );
}

function expectFaithfulArticle(
  fileName: string,
  Article: () => ReturnType<typeof HowToHarvestStardewValleyEnglishArticle>,
): void {
  const handoff = readHandoff(fileName);
  const markup = renderToStaticMarkup(createElement(Article));
  const figure = handoff.publicRequirements.figures[0];
  if (figure === undefined) {
    throw new Error(`Handoff ${fileName} figure 0 is missing.`);
  }

  expect(renderedReaderText(markup)).toBe(approvedReaderText(handoff.body));
  expect(renderedHrefs(markup)).toEqual(handoff.publicReferences.map((reference) => reference.url));
  expect(markup).toContain(`alt="${figure.alt}"`);
  expect(markup).toContain(`src="${figure.src}"`);
  expect(markup).toContain('width="1672"');
  expect(markup).toContain('height="941"');
  expect(markup).toContain('loading="lazy"');
  expect(markup).toContain('decoding="async"');
  expect(markup).toContain(`srcSet="${figure.src.replace(/\.webp$/, ".avif")}"`);
  expect(markup).toContain(figure.caption);

  for (const fragment of forbiddenReaderFragments) {
    expect(markup, fragment).not.toContain(fragment);
  }
}

it("renders the English harvest article as the frozen reader text", () => {
  expectFaithfulArticle("public-blog-handoff-en.json", HowToHarvestStardewValleyEnglishArticle);
});

it("renders the Chinese harvest article as the frozen reader text", () => {
  expectFaithfulArticle("public-blog-handoff-zh.json", HowToHarvestStardewValleyChineseArticle);
});
