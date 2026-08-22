import { expect, it } from "vitest";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";

it("keeps only the bilingual copy required by the remaining public shell", () => {
  const englishCopy = getPublicPageCopy("en");
  const chineseCopy = getPublicPageCopy("zh-CN");

  expect(englishCopy).toMatchObject({
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "How it works",
      faqLabel: "FAQ",
      blogLabel: "Blog",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    plannerTitle: "Stardew Valley Farm Planner",
  });
  expect(chineseCopy).toMatchObject({
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "使用方式",
      faqLabel: "常见问题",
      blogLabel: "博客",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    plannerTitle: "星露谷农场规划器",
  });

  for (const publicPageCopy of [englishCopy, chineseCopy]) {
    expect(publicPageCopy).not.toHaveProperty("navigationLabel");
    expect(publicPageCopy).not.toHaveProperty("brandLabel");
    expect(publicPageCopy).not.toHaveProperty("counterpartLabel");
    expect(publicPageCopy).not.toHaveProperty("farmComparisonTitle");
    expect(publicPageCopy).not.toHaveProperty("farmGuideTitleTemplate");
    expect(publicPageCopy).not.toHaveProperty("modsTitle");
  }
});

it("rejects unsupported locales at the public-page copy boundary", () => {
  expect(() => getPublicPageCopy("fr" as never)).toThrow(
    'Unsupported public locale. Received: "fr".',
  );
});
