import { expect, it } from "vitest";
import robots from "../../app/robots";

const blockedTrainingCrawlerUserAgents = [
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ClaudeBot",
  "Diffbot",
  "Google-Extended",
  "GPTBot",
  "omgili",
  "anthropic-ai",
  "Claude-Web",
  "cohere-ai",
  "MistralAI-Training",
  "meta-externalagent",
  "PetalBot",
  "AwarioSmartBot",
  "AwarioRssBot",
  "Google-CloudVertexBot",
  "QualifiedBot",
  "Cotoyogi",
  "ICC-Crawler",
  "atlassian-bot",
  "FishBot",
  "BorderxBot",
  "NavuBot",
  "SemrushBot-SWA",
  "WARDBot",
  "magpie-crawler",
  "KimiBot",
  "CitibotSiteCrawler",
];

function readRobotsRules() {
  const robotsFile = robots();
  if (!Array.isArray(robotsFile.rules)) {
    throw new Error(
      `Robots rules must be an ordered list. Received: ${JSON.stringify(robotsFile.rules)}.`,
    );
  }

  return robotsFile.rules;
}

function readUserAgentNames(rule: { userAgent?: string | string[] }): string[] {
  if (typeof rule.userAgent === "string") {
    return [rule.userAgent];
  }
  if (
    Array.isArray(rule.userAgent)
    && rule.userAgent.every((userAgentName) => typeof userAgentName === "string")
  ) {
    return rule.userAgent;
  }

  throw new Error(
    `Robots rule userAgent must be a string or a list of strings. Received rule: ${JSON.stringify(rule)}.`,
  );
}

it("allows Baiduspider and GoogleOther, blocks training crawlers, and allows every other crawler", () => {
  const rules = readRobotsRules();
  const [baiduspiderRule, googleOtherRule, blockedCrawlerRule, wildcardRule] = rules;

  expect(
    rules,
    `Robots rules must be Baiduspider, GoogleOther, blocked crawlers, then *. Received rules: ${JSON.stringify(rules)}.`,
  ).toHaveLength(4);

  expect(
    baiduspiderRule?.userAgent,
    `Baiduspider must be allowed. Received rule: ${JSON.stringify(baiduspiderRule)}.`,
  ).toBe("Baiduspider");
  expect(
    baiduspiderRule?.allow,
    `Baiduspider must allow /. Received rule: ${JSON.stringify(baiduspiderRule)}.`,
  ).toBe("/");
  expect(
    baiduspiderRule?.disallow,
    `Baiduspider must not be disallowed. Received rule: ${JSON.stringify(baiduspiderRule)}.`,
  ).toBeUndefined();

  expect(
    googleOtherRule?.userAgent,
    `GoogleOther must be allowed. Received rule: ${JSON.stringify(googleOtherRule)}.`,
  ).toBe("GoogleOther");
  expect(
    googleOtherRule?.allow,
    `GoogleOther must allow /. Received rule: ${JSON.stringify(googleOtherRule)}.`,
  ).toBe("/");
  expect(
    googleOtherRule?.disallow,
    `GoogleOther must not be disallowed. Received rule: ${JSON.stringify(googleOtherRule)}.`,
  ).toBeUndefined();

  expect(
    blockedCrawlerRule?.userAgent,
    `GPTBot and ClaudeBot must be disallowed with the other training crawlers. Received rule: ${JSON.stringify(blockedCrawlerRule)}.`,
  ).toEqual(blockedTrainingCrawlerUserAgents);
  expect(
    blockedCrawlerRule?.disallow,
    `GPTBot and ClaudeBot must disallow /. Received rule: ${JSON.stringify(blockedCrawlerRule)}.`,
  ).toBe("/");
  expect(
    blockedCrawlerRule?.allow,
    `Training crawlers must not be allowed. Received rule: ${JSON.stringify(blockedCrawlerRule)}.`,
  ).toBeUndefined();

  expect(
    wildcardRule?.userAgent,
    `* must be allowed. Received rule: ${JSON.stringify(wildcardRule)}.`,
  ).toBe("*");
  expect(
    wildcardRule?.allow,
    `* must allow /. Received rule: ${JSON.stringify(wildcardRule)}.`,
  ).toBe("/");
  expect(
    wildcardRule?.disallow,
    `* must not be disallowed. Received rule: ${JSON.stringify(wildcardRule)}.`,
  ).toBeUndefined();

  for (const rule of rules) {
    const userAgentNames = readUserAgentNames(rule);
    if (userAgentNames.includes("Baiduspider") || userAgentNames.includes("GoogleOther")) {
      expect(
        rule.disallow,
        `Baiduspider and GoogleOther must stay allowed. Received rule: ${JSON.stringify(rule)}.`,
      ).toBeUndefined();
    }
  }
});
