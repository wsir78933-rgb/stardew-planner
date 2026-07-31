import { expect, it } from "vitest";
import {
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

it("provides Chinese public labels without legal navigation entries", () => {
  const copy = getPublicPageCopy("zh-CN");

  expect(copy.navigationLabel).toBe("公共导航");
  expect(copy.planFarmLabel).toBe("开始规划");
  expect(copy.navigation).not.toContainEqual(
    expect.objectContaining({ path: "/privacy" }),
  );
  expect(copy.navigation).not.toContainEqual(
    expect.objectContaining({ path: "/terms" }),
  );
});
