import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DOMParser,
  type Document as XmlDocument,
  type Node as XmlNode,
} from "@xmldom/xmldom";
import { expect, it } from "vitest";
import { WhereIsStardewValleyLocatedEnglishArticle } from "../../src/blog/articles/where-is-stardew-valley-located.en";
import { WhereIsStardewValleyLocatedChineseArticle } from "../../src/blog/articles/where-is-stardew-valley-located.zh";

const englishInternalHrefs = [
  "/#planner",
  "/stardew-valley-town-map",
  "/stardew-valley-npc",
  "/where-is-robin-stardew-valley",
  "/carpenter-stardew",
] as const;
const chineseInternalHrefs = [
  "/zh#planner",
  "/zh/stardew-valley-town-map",
  "/zh/stardew-valley-npc",
  "/zh/where-is-robin-stardew-valley",
  "/zh/carpenter-stardew",
] as const;
const externalHrefs = [
  "https://www.stardewvalley.net/about/",
  "https://stardewvalleywiki.com/Setting",
  "https://stardewvalleywiki.com/Pelican_Town",
  "https://stardewvalleywiki.com/The_Desert",
  "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
] as const;

function renderArticle(Component: () => ReactNode): Readonly<{
  document: XmlDocument;
  markup: string;
  visibleText: string;
}> {
  const markup = renderToStaticMarkup(createElement(Component));
  const document = new DOMParser({
    onError(errorLevel, errorMessage) {
      throw new Error(`Could not parse rendered article: ${errorLevel}: ${errorMessage}`);
    },
  }).parseFromString(markup, "text/html");
  const documentElement = document.documentElement;

  if (documentElement === null) {
    throw new Error("Rendered article did not produce a document element.");
  }

  return {
    document,
    markup,
    visibleText: readVisibleTextWithNodeBoundaries(documentElement),
  };
}

function readVisibleTextWithNodeBoundaries(node: XmlNode): string {
  if (node.nodeType === 3) {
    return node.nodeValue ?? "";
  }

  return Array.from(node.childNodes)
    .map((childNode) => readVisibleTextWithNodeBoundaries(childNode))
    .join(" ");
}

function readElementTexts(document: XmlDocument, tagName: string): readonly string[] {
  return Array.from(document.getElementsByTagName(tagName)).map(
    (element) => element.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
}

function readUniqueHrefs(document: XmlDocument): readonly string[] {
  return [
    ...new Set(
      Array.from(document.getElementsByTagName("a"))
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href): href is string => href !== null),
    ),
  ];
}

function countVisibleEnglishWords(visibleText: string): number {
  return visibleText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

it("renders the complete English explainer with the promised depth and visible structure", () => {
  const englishArticle = renderArticle(WhereIsStardewValleyLocatedEnglishArticle);

  expect(countVisibleEnglishWords(englishArticle.visibleText)).toBeGreaterThanOrEqual(2000);
  expect(countVisibleEnglishWords(englishArticle.visibleText)).toBeLessThanOrEqual(2300);
  expect(readElementTexts(englishArticle.document, "h2")).toEqual([
    "Where is Stardew Valley located? The short answer",
    "Separate the Farm, Pelican Town, Stardew Valley, and the republic",
    "Pelican Town is one community inside the valley",
    "How the wider fictional world fits together",
    "Is Stardew Valley based in Washington, Oregon, or somewhere else?",
    "Which map or tool answers your location question?",
    "What the game confirms—and what it leaves open",
    "Frequently asked questions",
    "Sources",
  ]);
  expect(readElementTexts(englishArticle.document, "h3")).toEqual([
    "What do Harvey's coordinates mean?",
    "Where is Stardew Valley located in the game?",
    "Is Pelican Town the same place as Stardew Valley?",
    "What country is Stardew Valley in?",
    "Is Stardew Valley based in Washington or Oregon?",
    "Do Harvey's coordinates identify a real-world location?",
    "Where is the Gotoro Empire relative to Stardew Valley?",
  ]);
  expect(englishArticle.document.getElementsByTagName("table")).toHaveLength(2);
  expect(englishArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(6);
  expect(englishArticle.markup).not.toContain("<h1");
});

it("keeps the English canon answer, evidence limits, planner boundary, and ten link targets visible", () => {
  const englishArticle = renderArticle(WhereIsStardewValleyLocatedEnglishArticle);

  expect(englishArticle.visibleText).toContain(
    "Stardew Valley is a fictional coastal region in the Ferngill Republic.",
  );
  expect(englishArticle.visibleText).toContain(
    "The setting pages do not establish its exact distance and direction from Pelican Town.",
  );
  expect(englishArticle.visibleText).toContain(
    "The setting pages do not establish its wider political geography.",
  );
  expect(englishArticle.visibleText).toContain(
    "After that, the player takes the Bus from the Bus Stop; there is no local town exit that lets you walk there.",
  );
  expect(englishArticle.visibleText).toContain(
    "Treat Harvey's line as an in-world detail, not an official address.",
  );
  expect(englishArticle.visibleText).toContain(
    "real experiences influenced some details",
  );
  expect(englishArticle.visibleText).toContain(
    "The planner helps test building footprints, crop areas, paths, seasons, and coverage on your farm.",
  );
  expect(englishArticle.visibleText).not.toMatch(
    /Stardew Valley (?:is|takes place) in (?:Washington|Oregon|Russia)/i,
  );
  expect(readUniqueHrefs(englishArticle.document)).toEqual(
    expect.arrayContaining([...englishInternalHrefs, ...externalHrefs]),
  );
  expect(readUniqueHrefs(englishArticle.document)).toHaveLength(10);
});

it("renders a naturally localized Chinese article with matching structure and factual boundaries", () => {
  const englishArticle = renderArticle(WhereIsStardewValleyLocatedEnglishArticle);
  const chineseArticle = renderArticle(WhereIsStardewValleyLocatedChineseArticle);
  const chineseSecondLevelHeadings = readElementTexts(chineseArticle.document, "h2");

  expect(chineseSecondLevelHeadings).toHaveLength(
    readElementTexts(englishArticle.document, "h2").length,
  );
  expect(readElementTexts(chineseArticle.document, "h3")).toHaveLength(
    readElementTexts(englishArticle.document, "h3").length,
  );
  expect(chineseArticle.document.getElementsByTagName("table")).toHaveLength(2);
  expect(chineseArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(6);
  expect(chineseArticle.markup).not.toContain("<h1");
  for (const englishSecondLevelHeading of readElementTexts(
    englishArticle.document,
    "h2",
  )) {
    expect(chineseSecondLevelHeadings).not.toContain(englishSecondLevelHeading);
  }
  for (const requiredChineseTerm of [
    "星露谷",
    "《星露谷物语》",
    "鹈鹕镇",
    "芬吉尔共和国",
    "宝石海",
    "戈特洛帝国",
    "芬群岛",
    "姜岛",
    "祖祖城",
    "卡利科沙漠",
    "煤矿森林",
    "深山",
    "沙滩",
    "巴士站",
    "太平洋西北地区",
  ]) {
    expect(chineseArticle.visibleText).toContain(requiredChineseTerm);
  }
  expect(chineseArticle.visibleText).toContain(
    "社区中心金库组合包完成，或在 Joja 社区发展申请表中支付 40000g 修好巴士后，才能从巴士站乘车前往。",
  );
  expect(chineseArticle.visibleText).toContain(
    "玛妮的牧场、莉亚的农舍与法师塔",
  );
  for (const incorrectChineseTerm of [
    "玛莉的牧场",
    "莱娅的小屋",
    "巫师塔",
  ]) {
    expect(chineseArticle.visibleText).not.toContain(incorrectChineseTerm);
  }
  expect(chineseArticle.visibleText).toContain(
    "规划器适合测试农场上的建筑占地、作物区、道路、季节和覆盖范围",
  );
  expect(chineseArticle.visibleText).not.toMatch(
    /星露谷(?:位于|在)(?:美国|华盛顿|俄勒冈|俄罗斯)/,
  );
  expect(readUniqueHrefs(chineseArticle.document)).toEqual(
    expect.arrayContaining([...chineseInternalHrefs, ...externalHrefs]),
  );
  expect(readUniqueHrefs(chineseArticle.document)).toHaveLength(10);
});
