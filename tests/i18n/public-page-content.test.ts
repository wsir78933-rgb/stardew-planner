import { expect, it } from "vitest";
import { getPublicPageCopy } from "../../src/i18n/public-page-content";

it("keeps only the bilingual copy required by the remaining public shell", () => {
  const englishCopy = getPublicPageCopy("en");
  const chineseCopy = getPublicPageCopy("zh-CN");

  expect(englishCopy).toMatchObject({
    navigationLabel: "Public navigation",
    brandLabel: "Stardew Valley Farm Planner",
    counterpartLabel: "简体中文",
    plannerTitle: "Stardew Valley Farm Planner",
  });
  expect(chineseCopy).toMatchObject({
    navigationLabel: "公共导航",
    brandLabel: "星露谷规划器",
    counterpartLabel: "English",
    plannerTitle: "星露谷农场规划器",
  });

  for (const publicPageCopy of [englishCopy, chineseCopy]) {
    expect(publicPageCopy.navigation).toHaveLength(1);
    expect(publicPageCopy.navigation[0]).toMatchObject({ path: "/" });
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
