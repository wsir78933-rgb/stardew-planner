import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { HomepageHeroSection } from "../../src/components/homepage-hero-section";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

const heroFanImagePaths = [
  "public/homepage/hero/spring-crops.webp",
  "public/homepage/hero/beach-farm.webp",
  "public/homepage/hero/forest-farm.webp",
] as const;

test("renders the locked hero title, supporting copy, actions, and three fan images", () => {
  const copy = homepageCopyByLocale.en;
  const markup = renderToStaticMarkup(
    createElement(HomepageHeroSection, {
      copy: copy.hero,
      capabilitiesHref: "#capabilities",
      capabilitiesLabel: copy.navigation.capabilitiesLabel,
      plannerHref: "/#planner",
    }),
  );

  expect(markup).toContain("data-homepage-hero");
  expect(markup).toContain("data-homepage-hero-content");
  expect(markup).toContain("Stardew Valley ");
  expect(markup).toContain(
    '<em data-homepage-hero-emphasis="true">Planner</em>',
  );
  expect(markup).toContain(" – Free Online Farm Layout Tool");
  expect(markup).toContain(copy.hero.supportingCopy);
  expect(markup).toMatch(
    /<a[^>]*href="\/#planner"[^>]*>Start planning<\/a>/,
  );
  expect(markup).toMatch(
    /<a[^>]*href="#capabilities"[^>]*>Features<\/a>/,
  );
  expect(markup).toContain("Free fan-made planner. Projects stay in this browser.");
  expect(markup).toContain("data-homepage-hero-fan");
  expect(markup.match(/data-homepage-hero-fan-frame/g)).toHaveLength(3);

  for (const fanImage of copy.hero.fanImages) {
    expect(markup).toContain(`src="${fanImage.src}"`);
    expect(markup).toContain(fanImage.alt);
  }
});

test("keeps the Chinese hero title and description strings unchanged", () => {
  const copy = homepageCopyByLocale["zh-CN"];
  const markup = renderToStaticMarkup(
    createElement(HomepageHeroSection, {
      copy: copy.hero,
      capabilitiesHref: "#capabilities",
      capabilitiesLabel: copy.navigation.capabilitiesLabel,
      plannerHref: "/zh#planner",
    }),
  );

  expect(markup).toContain("星露谷物语");
  expect(markup).toContain(
    '<em data-homepage-hero-emphasis="true">规划器</em>',
  );
  expect(markup).toContain("——免费在线农场布局工具");
  expect(markup).toContain(copy.hero.supportingCopy);
  expect(markup).toContain("开始规划");
  expect(markup).toContain("功能介绍");
  expect(markup).toContain("免费玩家规划器。项目保存在当前浏览器。");
});

test("ships the three hero fan images as public WebP files", () => {
  for (const heroFanImagePath of heroFanImagePaths) {
    const absoluteImagePath = resolve(process.cwd(), heroFanImagePath);
    expect(existsSync(absoluteImagePath), `Expected ${heroFanImagePath}`).toBe(
      true,
    );
    expect(statSync(absoluteImagePath).size).toBeGreaterThan(0);
  }
});

test("rejects empty hero title copy at the render boundary", () => {
  const copy = homepageCopyByLocale.en;

  expect(() =>
    renderToStaticMarkup(
      createElement(HomepageHeroSection, {
        copy: {
          ...copy.hero,
          headlineBefore: "   ",
        },
        capabilitiesHref: "#capabilities",
        capabilitiesLabel: copy.navigation.capabilitiesLabel,
        plannerHref: "/#planner",
      }),
    ),
  ).toThrow(
    'Cannot render HomepageHeroSection: headlineBefore="   " is empty',
  );
});

test("rejects a fan image list that is not exactly three records", () => {
  const copy = homepageCopyByLocale.en;

  expect(() =>
    renderToStaticMarkup(
      createElement(HomepageHeroSection, {
        copy: {
          ...copy.hero,
          fanImages: [copy.hero.fanImages[0]] as unknown as typeof copy.hero.fanImages,
        },
        capabilitiesHref: "#capabilities",
        capabilitiesLabel: copy.navigation.capabilitiesLabel,
        plannerHref: "/#planner",
      }),
    ),
  ).toThrow(
    `Cannot render HomepageHeroSection: fanImages.length=1 expected 3`,
  );
});
