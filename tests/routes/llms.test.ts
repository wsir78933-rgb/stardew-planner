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
    "[Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades](https://stardewvalleyplanner.art/carpenter-stardew)",
  );
  expect(llmsText).toContain(
    "[Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions](https://stardewvalleyplanner.art/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程](https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley)",
  );
  expect(llmsText).toContain(
    "[Stardew Valley NPC List: Villagers, Marriage Candidates, and Services](https://stardewvalleyplanner.art/stardew-valley-npc): Sort the current Stardew Valley NPC list by marriage, giftable, and non-giftable roles, then plan gifts, schedules, and farm services.",
  );
  expect(llmsText).toContain(
    "[星露谷 NPC 名单：可结婚角色、可送礼村民与服务](https://stardewvalleyplanner.art/zh/stardew-valley-npc): 按可结婚、可送礼和不可送礼分类整理星露谷 NPC，并核对送礼、好感度、商店服务与农场规划关系。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley Town Map: Pelican Town Landmarks & Routes](https://stardewvalleyplanner.art/stardew-valley-town-map): Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
  );
  expect(llmsText).toContain(
    "[星露谷物语小镇地图：鹈鹕镇地点与路线](https://stardewvalleyplanner.art/zh/stardew-valley-town-map): 用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
  );
  expect(llmsText).toContain(
    "[Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory](https://stardewvalleyplanner.art/where-is-stardew-valley-located): Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
  );
  expect(llmsText).toContain(
    "[星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点](https://stardewvalleyplanner.art/zh/where-is-stardew-valley-located): 理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes](https://stardewvalleyplanner.art/stardew-valley-expanded-bachelors-and-bachelorettes): Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
  );
  expect(llmsText).toContain(
    "[星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物](https://stardewvalleyplanner.art/zh/stardew-valley-expanded-bachelors-and-bachelorettes): 整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails](https://stardewvalleyplanner.art/sprinkler-stardew): Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
  );
  expect(llmsText).toContain(
    "[星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地](https://stardewvalleyplanner.art/zh/sprinkler-stardew): 说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
  );
  expect(llmsText).toContain(
    "[Mark keep, orchard, and clear tiles before you chop Stardew Valley trees](https://stardewvalleyplanner.art/stardew-valley-trees): Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
  );
  expect(llmsText).toContain(
    "[星露谷种树：先分普通树和果树，再在农场图上留间隔](https://stardewvalleyplanner.art/zh/stardew-valley-trees): 温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers](https://stardewvalleyplanner.art/glasshouse-stardew-valley): Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
  );
  expect(llmsText).toContain(
    "[星露谷物语温室布局：120格耕地与洒水器摆放指南](https://stardewvalleyplanner.art/zh/glasshouse-stardew-valley): 了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
  );
  expect(llmsText).toContain(
    "[Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin](https://stardewvalleyplanner.art/oak-tree-stardew): Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
  );
  expect(llmsText).toContain(
    "[星露谷物语橡树：橡子种植、间距与树脂采集](https://stardewvalleyplanner.art/zh/oak-tree-stardew): 认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
