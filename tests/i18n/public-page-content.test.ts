import { expect, it } from "vitest";
import {
  formatPublicPageCopy,
  getLocalizedModFarmCards,
  getLocalizedOfficialFarmComparisonCards,
  getLocalizedOfficialFarmGuide,
  getPublicPageCopy,
} from "../../src/i18n/public-page-content";
import { officialFarmTypes } from "../../src/reference/official-farm-guides";

it("returns complete bilingual comparison content for every official farm", () => {
  const englishCards = getLocalizedOfficialFarmComparisonCards("en");
  const chineseCards = getLocalizedOfficialFarmComparisonCards("zh-CN");

  expect(englishCards.map((card) => card.id)).toEqual(officialFarmTypes);
  expect(chineseCards.map((card) => card.id)).toEqual(officialFarmTypes);

  for (const [index, englishCard] of englishCards.entries()) {
    const chineseCard = chineseCards[index];

    expect(chineseCard).toMatchObject({
      id: englishCard.id,
      previewSource: englishCard.previewSource,
      tillableTiles: englishCard.tillableTiles,
      totalBuildableTiles: englishCard.totalBuildableTiles,
      addedIn: englishCard.addedIn,
    });

    for (const value of [
      englishCard.summary,
      englishCard.bestFor,
      englishCard.tradeoff,
      englishCard.planningNote,
      englishCard.knownFor,
      chineseCard?.summary,
      chineseCard?.bestFor,
      chineseCard?.tradeoff,
      chineseCard?.planningNote,
      chineseCard?.knownFor,
    ]) {
      expect(value?.trim().length).toBeGreaterThan(0);
    }
  }
});

it("returns verified Chinese farm text while preserving the official map id", () => {
  const guide = getLocalizedOfficialFarmGuide("zh-CN", "standard");

  expect(guide.id).toBe("standard");
  expect(guide.title).toBe("标准农场");
  expect(guide.features[0]).toContain("63 × 31");
});

it("returns verified Chinese community-farm text while preserving planner ids", () => {
  const immersiveFarm = getLocalizedModFarmCards("zh-CN").find(
    (farmCard) => farmCard.id === "if2r",
  );

  expect(immersiveFarm).toMatchObject({
    id: "if2r",
    displayName: "沉浸式农场 2",
    mapKind: "farm",
  });
  expect(immersiveFarm?.description).toContain("多人游戏");
  expect(immersiveFarm?.bestFor).toContain("多人");
  expect(immersiveFarm?.planningNote).toContain("配置");
});

it("returns complete structured content for every localized community map", () => {
  const englishCards = getLocalizedModFarmCards("en");
  const chineseCards = getLocalizedModFarmCards("zh-CN");

  expect(englishCards).toHaveLength(21);
  expect(chineseCards).toHaveLength(21);
  expect(englishCards.filter((card) => card.mapKind === "farm")).toHaveLength(18);
  expect(englishCards.filter((card) => card.mapKind === "interior")).toHaveLength(3);

  for (const [index, englishCard] of englishCards.entries()) {
    const chineseCard = chineseCards[index];

    expect(chineseCard?.id).toBe(englishCard.id);
    expect(englishCard.description.trim().length).toBeGreaterThan(80);
    expect(englishCard.bestFor.trim().length).toBeGreaterThan(25);
    expect(englishCard.planningNote.trim().length).toBeGreaterThan(40);
    expect(new URL(englishCard.sourceHref).protocol).toBe("https:");
    expect(chineseCard?.description.trim().length).toBeGreaterThan(35);
    expect(chineseCard?.bestFor.trim().length).toBeGreaterThan(12);
    expect(chineseCard?.planningNote.trim().length).toBeGreaterThan(20);
    expect(chineseCard?.sourceHref).toBe(englishCard.sourceHref);
  }
});

it("adapts verified Chinese UI strings without legal navigation entries", () => {
  const copy = getPublicPageCopy("zh-CN");

  expect(copy.navigationLabel).toBe("公共导航");
  expect(copy.brandLabel).toBe("星露谷规划器");
  expect(copy.plannerTitle).toBe("星露谷农场规划器");
  expect(copy.plannerDescription).toBe(
    "使用本地地图、物品和项目规划你的星露谷农场布局。",
  );
  expect(copy.planFarmLabel).toBe("规划器");
  expect(copy.farmComparisonMetaTitle).toBe(
    "星露谷物语农场类型对比：8 种地图怎么选",
  );
  expect(copy.farmComparisonRecommendations).toHaveLength(6);
  expect(copy.knownForLabel).toBe("特色");
  expect(
    formatPublicPageCopy(copy.planFarmTemplate, { farmName: "标准农场" }),
  ).toBe("规划 标准农场 →");
  expect(
    formatPublicPageCopy(copy.byTemplate, { authorName: "FlashShifter" }),
  ).toBe("作者：FlashShifter");
  expect(copy.navigation).not.toContainEqual(
    expect.objectContaining({ path: "/privacy" }),
  );
  expect(copy.navigation).not.toContainEqual(
    expect.objectContaining({ path: "/terms" }),
  );
});

it("formats approved Chinese farm metadata templates with the localized farm name", () => {
  const copy = getPublicPageCopy("zh-CN");

  expect(copy.farmGuideTitleTemplate).toBe("{farmName} 指南 | 星露谷规划器");
  expect(copy.farmGuideDescriptionTemplate).toBe(
    "了解{farmName}地图，并开始规划你的星露谷农场布局。",
  );
  expect(
    formatPublicPageCopy(copy.farmGuideTitleTemplate, {
      farmName: "标准农场",
    }),
  ).toBe("标准农场 指南 | 星露谷规划器");
  expect(
    formatPublicPageCopy(copy.farmGuideDescriptionTemplate, {
      farmName: "标准农场",
    }),
  ).toBe("了解标准农场地图，并开始规划你的星露谷农场布局。");
});
