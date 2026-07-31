import { expect, it } from "vitest";
import {
  formatPublicPageCopy,
  getLocalizedModFarmCards,
  getLocalizedOfficialFarmGuide,
  getPublicPageCopy,
} from "../../src/i18n/public-page-content";

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
  });
  expect(immersiveFarm?.description).toContain("多人游戏");
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
