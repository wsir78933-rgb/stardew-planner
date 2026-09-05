import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DOMParser, type Element as XmlElement, type Node as XmlNode } from "@xmldom/xmldom";
import { expect, it } from "vitest";
import { CarpenterStardewEnglishArticle } from "../../src/blog/articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "../../src/blog/articles/carpenter-stardew.zh";
import { StardewValleyNpcEnglishArticle } from "../../src/blog/articles/stardew-valley-npc.en";
import { StardewValleyNpcChineseArticle } from "../../src/blog/articles/stardew-valley-npc.zh";
import { WhereIsRobinEnglishArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.zh";

type ArticleLocale = "en-US" | "zh-CN";

type ArticleLengthCase = Readonly<{
  name: string;
  component: ComponentType;
  locale: ArticleLocale;
}>;

function extractCountableText(markup: string): string {
  const articleDocument = new DOMParser().parseFromString(markup, "text/html");
  const countableNodeText: string[] = [];

  for (const nodeName of ["p", "li", "td"]) {
    const countableElements = articleDocument.getElementsByTagName(nodeName);

    for (let elementIndex = 0; elementIndex < countableElements.length; elementIndex += 1) {
      const countableElement = countableElements.item(elementIndex);
      if (
        countableElement === null ||
        hasExcludedAncestor(countableElement as unknown as XmlNode)
      ) {
        continue;
      }

      countableNodeText.push(
        (countableElement as unknown as XmlElement).textContent ?? "",
      );
    }
  }

  return countableNodeText.join(" ");
}

function hasExcludedAncestor(element: XmlNode): boolean {
  let ancestorNode = element.parentNode;

  while (ancestorNode !== null) {
    if (ancestorNode.nodeType === 1) {
      const classAttribute =
        (ancestorNode as XmlElement).getAttribute("class") ?? "";
      if (classAttribute.split(/\s+/).some((className) =>
        className === "blog-faq-list" || className === "blog-sources",
      )) {
        return true;
      }
    }

    ancestorNode = ancestorNode.parentNode;
  }

  return false;
}

function countArticleLocaleUnits(markup: string, locale: ArticleLocale): number {
  const countableText = extractCountableText(markup);

  if (locale === "en-US") {
    return countableText.trim().split(/\s+/).filter(Boolean).length;
  }

  return [...countableText].filter((character) =>
    /[\p{L}\p{N}]/u.test(character),
  ).length;
}

it("keeps every requested bilingual rewrite between 2500 and 2800 locale units", () => {
  const articleLengthCases: readonly ArticleLengthCase[] = [
    {
      name: "stardew-valley-npc English",
      component: StardewValleyNpcEnglishArticle,
      locale: "en-US",
    },
    {
      name: "stardew-valley-npc Chinese",
      component: StardewValleyNpcChineseArticle,
      locale: "zh-CN",
    },
    {
      name: "where-is-robin-stardew-valley English",
      component: WhereIsRobinEnglishArticle,
      locale: "en-US",
    },
    {
      name: "where-is-robin-stardew-valley Chinese",
      component: WhereIsRobinChineseArticle,
      locale: "zh-CN",
    },
    {
      name: "carpenter-stardew English",
      component: CarpenterStardewEnglishArticle,
      locale: "en-US",
    },
    {
      name: "carpenter-stardew Chinese",
      component: CarpenterStardewChineseArticle,
      locale: "zh-CN",
    },
  ];

  for (const articleLengthCase of articleLengthCases) {
    const articleMarkup = renderToStaticMarkup(
      createElement(articleLengthCase.component),
    );
    const localeUnitCount = countArticleLocaleUnits(
      articleMarkup,
      articleLengthCase.locale,
    );

    expect(
      localeUnitCount,
      `${articleLengthCase.name} count must be between 2500 and 2800; received ${localeUnitCount}`,
    ).toBeGreaterThanOrEqual(2500);
    expect(
      localeUnitCount,
      `${articleLengthCase.name} count must be between 2500 and 2800; received ${localeUnitCount}`,
    ).toBeLessThanOrEqual(2800);
  }
});
