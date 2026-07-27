import { describe, expect, it } from "vitest";
import {
  getLocalizedModFarmCards,
  getLocalizedOfficialFarmGuide,
  getLocalizedPlannerMapName,
} from "../../src/i18n/public-content";
import { getPlannerMapById } from "../../src/maps/map-catalog";
import { officialFarmGuides } from "../../src/reference/official-farm-guides";

describe("localized public content", () => {
  it("maps the stable Standard Farm id to Chinese display content without changing its map data", () => {
    const localizedFarmGuide = getLocalizedOfficialFarmGuide(
      "zh-CN",
      "standard",
    );

    expect(localizedFarmGuide).toMatchObject({
      id: "standard",
      title: "标准农场",
      tillableTiles: "3,427",
      totalBuildableTiles: "3,662",
      addedIn: "1.0",
    });
    expect(localizedFarmGuide.previewSource).toBe(
      officialFarmGuides.standard.previewSource,
    );
    expect(getLocalizedPlannerMapName("zh-CN", "standard")).toBe(
      "标准农场",
    );
    expect(getPlannerMapById("standard").mapFile).toBe("Farm.tmx");
  });

  it("returns translated community-card content while preserving each stable map id and preview", () => {
    const localizedCards = getLocalizedModFarmCards("zh-CN");
    const immersiveFarmCard = localizedCards.find((card) => card.id === "if2r");

    expect(immersiveFarmCard).toMatchObject({
      id: "if2r",
      displayName: "沉浸式农场 2",
      authorName: "FlashShifter",
      description: expect.stringContaining("多人游戏"),
      previewSource:
        "/game-assets/1.6.15/mods/flashshifter.immersivefarm2remastered/preview.png",
    });
  });

  it("fails fast with the received unknown fixed id", () => {
    expect(() => getLocalizedOfficialFarmGuide("en", "missing-farm")).toThrow(
      'Unknown official farm id: "missing-farm"',
    );
    expect(() => getLocalizedPlannerMapName("en", "missing-map")).toThrow(
      "Unknown planner map id: missing-map",
    );
  });

  it("rejects an unsupported runtime locale before returning translated display data", () => {
    expect(() =>
      getLocalizedOfficialFarmGuide("fr" as never, "standard"),
    ).toThrow('site locale "fr" is not supported');
  });
});
