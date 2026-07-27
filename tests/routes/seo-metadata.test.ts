import { describe, expect, it } from "vitest";
import { metadata as englishModsMetadata } from "../../app/(en)/mods/page";
import { metadata as chineseModsMetadata } from "../../app/zh/mods/page";
import { generateMetadata as generateEnglishFarmMetadata } from "../../app/(en)/farm/[type]/page";
import { generateMetadata as generateChineseFarmMetadata } from "../../app/zh/farm/[type]/page";

describe("localized route metadata", () => {
  it("uses an English bare canonical URL and Chinese alternate URL for the mods page", () => {
    expect(englishModsMetadata.alternates).toMatchObject({
      canonical: "https://stardewvalleyplanner.art/mods",
      languages: {
        en: "https://stardewvalleyplanner.art/mods",
        "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
        "x-default": "https://stardewvalleyplanner.art/mods",
      },
    });
    expect(chineseModsMetadata.alternates?.canonical).toBe(
      "https://stardewvalleyplanner.art/zh/mods",
    );
  });

  it("generates locale-specific metadata for a static farm guide", async () => {
    const [englishFarmMetadata, chineseFarmMetadata] = await Promise.all([
      generateEnglishFarmMetadata({ params: Promise.resolve({ type: "standard" }) }),
      generateChineseFarmMetadata({ params: Promise.resolve({ type: "standard" }) }),
    ]);

    expect(englishFarmMetadata.alternates?.canonical).toBe(
      "https://stardewvalleyplanner.art/farm/standard",
    );
    expect(englishFarmMetadata.title).toBe(
      "Standard Farm Guide | Stardew Planner",
    );
    expect(englishFarmMetadata.title).not.toContain("Farm Farm Guide");
    expect(chineseFarmMetadata.alternates?.canonical).toBe(
      "https://stardewvalleyplanner.art/zh/farm/standard",
    );
    expect(chineseFarmMetadata.title).toBe("标准农场 指南 | 星露谷规划器");
  });
});
