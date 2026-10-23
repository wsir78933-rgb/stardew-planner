import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { HowToHarvestStardewValleyChineseArticle } from "../../../../../src/blog/articles/how-to-harvest-stardew-valley.zh";
import { HowToHarvestStardewValleyEnglishArticle } from "../../../../../src/blog/articles/how-to-harvest-stardew-valley.en";

const handoffDirectory = new URL("../../rework-v2/handoffs/", import.meta.url);

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
      avif: string;
      caption: string;
      height: number;
      src: string;
      width: number;
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
  if (!Array.isArray(figures) || figures.length !== 2) {
    throw new Error(`Handoff ${fileName} figure count is not 2. Received: ${JSON.stringify(figures)}.`);
  }
  return handoff as {
    body: string;
    publicReferences: readonly { url: string }[];
    publicRequirements: {
      figures: readonly {
        alt: string;
        avif: string;
        caption: string;
        height: number;
        src: string;
        width: number;
      }[];
    };
  };
}

function approvedReaderText(body: string): string {
  const withCaption = body.replace(
    /<figure\b[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g,
    " $1 ",
  );
  const withLabels = withCaption
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?a\b[^>]*>/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
  const withoutMarkup = withLabels
    .replace(/^#{2,3} /gm, "")
    .replace(/^- /gm, "")
    .replace(/<[^>]+>/g, " ");
  return withoutMarkup.replace(/\s+/g, " ").trim();
}

function renderedReaderText(markup: string): string {
  const withoutInlineTags = markup
    .replace(/<\/?a\b[^>]*>/g, "")
    .replace(/<\/?strong\b[^>]*>/g, "");
  return withoutInlineTags.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderedHrefs(markup: string): string[] {
  return [...markup.matchAll(/href="([^"]*)"/g)].map((match) =>
    (match[1] ?? "").replaceAll("&amp;", "&"),
  );
}

function localizeApprovedHref(href: string, locale: "en" | "zh"): string {
  if (locale === "en") {
    return href;
  }

  switch (href) {
    case "/":
      return "/zh";
    case "/last-day-to-plant-stardew":
      return "/zh/last-day-to-plant-stardew";
    case "/what-to-grow-in-greenhouse-stardew":
      return "/zh/what-to-grow-in-greenhouse-stardew";
    default:
      return href;
  }
}

function approvedReaderHrefs(body: string, locale: "en" | "zh"): string[] {
  return [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)|<a\b[^>]*href=["']([^"']+)["']/g)].map(
    (match) => {
      const href = match[1] ?? match[2];
      if (href === undefined) {
        throw new Error(`Handoff body contains a malformed link at ${match.index ?? "unknown"}.`);
      }
      return localizeApprovedHref(href.replaceAll("&amp;", "&"), locale);
    },
  );
}

function expectFaithfulArticle(
  fileName: string,
  Article: () => ReturnType<typeof HowToHarvestStardewValleyEnglishArticle>,
  locale: "en" | "zh",
  faqHeading: string,
  sourcesHeading: string,
  plannerHref: string,
): void {
  const handoff = readHandoff(fileName);
  const markup = renderToStaticMarkup(createElement(Article));
  const faqHeadingMarkup = `<h2>${faqHeading}</h2>`;
  const faqHeadingPosition = markup.indexOf(faqHeadingMarkup);
  if (faqHeadingPosition < 0) {
    throw new Error(`Article ${fileName} is missing its FAQ body boundary: ${faqHeading}.`);
  }
  if (markup.indexOf(faqHeadingMarkup, faqHeadingPosition + faqHeadingMarkup.length) >= 0) {
    throw new Error(`Article ${fileName} contains the FAQ body boundary more than once.`);
  }
  const approvedBodyMarkup = markup.slice(0, faqHeadingPosition);
  const approvedBodyHrefs = renderedHrefs(approvedBodyMarkup);

  expect(renderedReaderText(approvedBodyMarkup)).toBe(approvedReaderText(handoff.body));
  expect(approvedBodyHrefs).toEqual(approvedReaderHrefs(handoff.body, locale));
  for (const reference of handoff.publicReferences) {
    expect(approvedBodyHrefs, `Public reference "${reference.url}" is missing in ${fileName}.`).toContain(
      reference.url,
    );
  }

  const figures = handoff.publicRequirements.figures;
  const renderedFigures = [...approvedBodyMarkup.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)].map(
    (match) => match[0],
  );
  expect(renderedFigures).toHaveLength(figures.length);

  for (const [index, figure] of figures.entries()) {
    const renderedFigure = renderedFigures[index];
    if (renderedFigure === undefined) {
      throw new Error(`Article ${fileName} is missing frozen figure ${index}: ${figure.src}.`);
    }

    const imageTags = [...renderedFigure.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
    if (imageTags.length !== 1) {
      throw new Error(
        `Article ${fileName} figure ${index} must contain exactly one image; received ${imageTags.length}.`,
      );
    }
    const imageTag = imageTags[0];
    if (imageTag === undefined) {
      throw new Error(`Article ${fileName} figure ${index} is missing its image tag.`);
    }

    const sourceTags = [...renderedFigure.matchAll(/<source\b[^>]*>/g)].map((match) => match[0]);
    if (sourceTags.length !== 1) {
      throw new Error(
        `Article ${fileName} figure ${index} must contain exactly one AVIF source; received ${sourceTags.length}.`,
      );
    }
    const sourceTag = sourceTags[0];
    if (sourceTag === undefined) {
      throw new Error(`Article ${fileName} figure ${index} is missing its AVIF source tag.`);
    }

    const captions = [...renderedFigure.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map(
      (match) => match[1],
    );
    if (captions.length !== 1) {
      throw new Error(
        `Article ${fileName} figure ${index} must contain exactly one caption; received ${captions.length}.`,
      );
    }
    const caption = captions[0];
    if (caption === undefined) {
      throw new Error(`Article ${fileName} figure ${index} is missing its caption text.`);
    }

    expect(imageTag).toContain(`src="${figure.src}"`);
    expect(imageTag).toContain(`alt="${figure.alt}"`);
    expect(imageTag).toContain(`width="${figure.width}"`);
    expect(imageTag).toContain(`height="${figure.height}"`);
    expect(imageTag).toContain('loading="lazy"');
    expect(imageTag).toContain('decoding="async"');
    expect(sourceTag).toContain(`srcSet="${figure.avif}"`);
    expect(caption).toContain(figure.caption);
  }

  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(5);
  expect(markup).toContain(`<h2>${sourcesHeading}</h2>`);
  expect(renderedHrefs(markup.slice(faqHeadingPosition))).toEqual([
    plannerHref,
    "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979",
    "https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481",
    "https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696",
    "https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836",
  ]);

  for (const fragment of forbiddenReaderFragments) {
    expect(approvedBodyMarkup, fragment).not.toContain(fragment);
  }
}

it("renders the English harvest article in frozen reader order with its confirmed FAQ and sources", () => {
  expectFaithfulArticle(
    "public-blog-handoff-en.json",
    HowToHarvestStardewValleyEnglishArticle,
    "en",
    "How to Harvest Stardew Valley FAQ",
    "Sources",
    "/#planner",
  );
});

it("renders the Chinese harvest article in frozen reader order with its confirmed FAQ and sources", () => {
  expectFaithfulArticle(
    "public-blog-handoff-zh.json",
    HowToHarvestStardewValleyChineseArticle,
    "zh",
    "星露谷物语收作物常见问题",
    "来源",
    "/zh#planner",
  );
});
