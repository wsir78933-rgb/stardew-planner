import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { getLocalizedIndexablePublicRouteEntries } from "../../src/i18n/public-route-registry";
import { createCanonicalUrl } from "../../src/seo/public-site-url";

it("exports a bilingual LLM site guide with every indexable public route", () => {
  const llmsText = readFileSync(join(process.cwd(), "out", "llms.txt"), "utf8");

  expect(llmsText).toMatch(/^# Stardew Valley Planner\n/m);
  expect(llmsText).toContain("## English");
  expect(llmsText).toContain("## 简体中文");
  expect(llmsText).toContain("browser-local projects");
  expect(llmsText).toContain("浏览器本地项目");
  expect(llmsText).toContain(
    "[Carpenter Stardew: Which Robin Service Do You Need Today?](https://stardewvalleyplanner.art/carpenter-stardew)",
  );
  expect(llmsText).toContain(
    "[Robin's Shop Is Empty? Find Her in Stardew Valley Today](https://stardewvalleyplanner.art/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[罗宾的商店没人？今天去哪里找她](https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[Stardew Valley NPC Guide: Gifts, Marriage, and Services](https://stardewvalleyplanner.art/stardew-valley-npc): Compare current friendship groups, gift rules, marriage candidates, and the NPC services that shape your building, animal, and tool plans.",
  );
  expect(llmsText).toContain(
    "[星露谷 NPC 指南：礼物、婚姻与服务](https://stardewvalleyplanner.art/zh/stardew-valley-npc): 比较当前好感度分类、送礼规则、可结婚候选，以及会影响建筑、动物和工具规划的 NPC 服务。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley Town Map: Pelican Town Landmarks & Routes](https://stardewvalleyplanner.art/stardew-valley-town-map): Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
  );
  expect(llmsText).toContain(
    "[星露谷物语小镇地图：鹈鹕镇地点与路线](https://stardewvalleyplanner.art/zh/stardew-valley-town-map): 用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
