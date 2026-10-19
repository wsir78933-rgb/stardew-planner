import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RussianPlannerPage, { metadata as russianPlannerMetadata } from "../../app/ru/page";

const confirmedRussianHeadlineBefore = "Планировщик фермы ";
const confirmedRussianHeadlineEmphasis = "Stardew Valley";
const confirmedRussianHeadlineAfter =
  "Бесплатный онлайн-инструмент для планировки фермы";
const confirmedRussianSupportingCopy =
  "Планируйте свою ферму в Stardew Valley до того, как начнете строить в игре. Выбирайте из 8 типов ферм, расставляйте здания и посевы, переключайте сезоны, проверяйте зоны действия и импортируйте сохранения.";
const confirmedRussianHomepageTitle =
  "Планировщик фермы Stardew Valley — бесплатно онлайн";
const confirmedRussianHomepageDescription =
  "Планировщик для Stardew Valley: создавайте планировку фермы онлайн. 8 типов ферм, здания и посевы, смена сезонов, зоны действия и импорт сохранений.";
const homepageLanguageAlternates = {
  en: "https://stardewvalleyplanner.art",
  "zh-CN": "https://stardewvalleyplanner.art/zh",
  ja: "https://stardewvalleyplanner.art/ja",
  ru: "https://stardewvalleyplanner.art/ru",
  "x-default": "https://stardewvalleyplanner.art",
};

describe("Russian homepage document", () => {
  it("sets the Russian document language and keeps site analytics", () => {
    const layoutPath = join(process.cwd(), "app/ru/layout.tsx");
    expect(
      existsSync(layoutPath),
      `Russian homepage layout is missing. Received path: ${layoutPath}.`,
    ).toBe(true);

    const layoutSource = readFileSync(layoutPath, "utf8");
    expect(layoutSource).toContain('<html lang="ru">');
    expect(layoutSource).toContain("<PublicSiteAnalytics />");
    expect(layoutSource).not.toContain('lang="en"');
    expect(layoutSource).not.toContain('lang="zh-CN"');
  });

  it("renders one confirmed Russian heading and English legal links", () => {
    const pagePath = join(process.cwd(), "app/ru/page.tsx");
    expect(
      existsSync(pagePath),
      `Russian homepage page is missing. Received path: ${pagePath}.`,
    ).toBe(true);

    const markup = renderToStaticMarkup(createElement(RussianPlannerPage));

    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup).toContain(confirmedRussianHeadlineBefore);
    expect(markup).toContain(
      `<em data-homepage-hero-emphasis="true">${confirmedRussianHeadlineEmphasis}</em>`,
    );
    expect(markup).toContain(confirmedRussianHeadlineAfter);
    expect(markup).toContain(confirmedRussianSupportingCopy);
    expect(markup).toMatch(
      /<a[^>]*data-homepage-language-option[^>]*href="\/"[^>]*>English<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/zh"[^>]*>中文<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/ja"[^>]*>日本語<\/a>[\s\S]*<a[^>]*data-homepage-language-option[^>]*href="\/ru"[^>]*>Русский<\/a>/,
    );
    expect(markup.match(/data-homepage-language-option/g)).toHaveLength(4);
    expect(markup).toContain('href="/blog"');
    expect(markup).toContain('href="/privacy"');
    expect(markup).toContain('href="/terms"');
    expect(markup).toContain('href="/contact"');
    expect(markup).not.toContain('href="/ru/blog"');
    expect(markup).not.toContain('href="/ru/privacy"');
    expect(markup).not.toContain('href="/ru/terms"');
    expect(markup).not.toContain('href="/ru/contact"');
    expect(markup).toContain('"@type":"WebApplication"');
    expect(markup).toContain('"inLanguage":"ru"');
    expect(markup).toContain('"url":"https://stardewvalleyplanner.art/ru"');
    expect(markup).not.toContain('"@type":"WebSite"');
    expect(markup).not.toContain('<meta name="keywords"');
  });

  it("publishes the Russian canonical and homepage alternates for Japanese and Russian", () => {
    expect(russianPlannerMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art/ru",
      languages: homepageLanguageAlternates,
    });
  });

  it("uses the confirmed Russian title and description", () => {
    expect({
      title: russianPlannerMetadata.title,
      description: russianPlannerMetadata.description,
    }).toEqual({
      title: confirmedRussianHomepageTitle,
      description: confirmedRussianHomepageDescription,
    });
  });
});
