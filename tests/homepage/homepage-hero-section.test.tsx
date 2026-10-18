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
  expect(markup).toContain("Free Online Farm Layout Tool");
  expect(markup).toContain(copy.hero.supportingCopy);
  expect(markup).toMatch(
    /<a[^>]*href="\/#planner"[^>]*>Start planning<\/a>/,
  );
  expect(markup).toMatch(
    /<a[^>]*href="#capabilities"[^>]*>Farm examples<\/a>/,
  );
  expect(markup).toContain("Free fan-made planner. Save locally or sync selected projects.");
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
  expect(markup).toContain("免费在线农场布局工具");
  expect(markup).toContain(copy.hero.supportingCopy);
  expect(markup).toContain("开始规划");
  expect(markup).toContain("案例展示");
  expect(markup).toContain("免费玩家规划器。可本地保存，也可同步所选项目。");
});

const heroFanImageSources = [
  "/homepage/hero/spring-crops.webp",
  "/homepage/hero/beach-farm.webp",
  "/homepage/hero/forest-farm.webp",
] as const;

const heroSideImageSizes = "(max-width: 700px) calc(0.34 * min(22rem, 100vw - 2 * clamp(1.25rem, 3vw, 3rem)) - 2px), calc(0.38 * min(48rem, min(100vw, 1280px) - 2 * clamp(1.25rem, 3vw, 3rem)) - 2px)";
const heroCenterImageSizes = "(max-width: 700px) calc(0.42 * min(22rem, 100vw - 2 * clamp(1.25rem, 3vw, 3rem)) - 2px), calc(0.42 * min(48rem, min(100vw, 1280px) - 2 * clamp(1.25rem, 3vw, 3rem)) - 2px)";

function heroFanDisplayedWidth(viewportPx: number, frameRatio: number): number {
  const paddingPx = Math.min(48, Math.max(20, viewportPx * 0.03));
  const sectionPx = Math.min(viewportPx, 1280);
  const fanCapPx = viewportPx <= 700 ? 22 * 16 : 48 * 16;
  const fanPx = Math.min(fanCapPx, sectionPx - paddingPx * 2);
  return frameRatio * fanPx - 2;
}

function heroFanChosenResourceWidth(viewportPx: number, devicePixelRatio: number, frameRatio: number): 480 | 864 {
  const neededPx = heroFanDisplayedWidth(viewportPx, frameRatio) * devicePixelRatio;
  return neededPx <= 480 ? 480 : 864;
}

test("offers 480 and 864 candidates sized to the hero fan frames", () => {
  const copy = homepageCopyByLocale.en;
  const markup = renderToStaticMarkup(
    createElement(HomepageHeroSection, {
      copy: copy.hero,
      capabilitiesHref: "#capabilities",
      capabilitiesLabel: copy.navigation.capabilitiesLabel,
      plannerHref: "/#planner",
    }),
  );

  expect(markup).not.toContain('loading="lazy"');
  expect(markup.match(/width="864"/g)).toHaveLength(3);
  expect(markup.match(/height="1152"/g)).toHaveLength(3);
  expect(markup.match(/decoding="async"/g)).toHaveLength(3);
  expect(markup.split(`sizes="${heroSideImageSizes}"`).length - 1).toBe(4);
  expect(markup.split(`sizes="${heroCenterImageSizes}"`).length - 1).toBe(2);

  for (const heroFanImageSource of heroFanImageSources) {
    const imageStem = heroFanImageSource.slice(0, -".webp".length);
    expect(markup).toContain(`src="${heroFanImageSource}"`);
    expect(markup).toContain(
      `srcSet="${imageStem}-480.webp 480w, ${heroFanImageSource} 864w"`,
    );
    expect(markup).toContain(
      `srcSet="${imageStem}-480.avif 480w, ${imageStem}.avif 864w"`,
    );
  }

  expect(heroFanChosenResourceWidth(390, 3, 0.34)).toBe(480);
  expect(heroFanChosenResourceWidth(390, 3, 0.42)).toBe(480);
  expect(heroFanChosenResourceWidth(1440, 2, 0.38)).toBe(864);
  expect(heroFanChosenResourceWidth(1440, 2, 0.42)).toBe(864);
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
