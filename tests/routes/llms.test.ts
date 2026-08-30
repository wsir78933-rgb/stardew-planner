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
  expect(llmsText).toContain(
    "[Where Is Stardew Valley Located in the Game’s World?](https://stardewvalleyplanner.art/where-is-stardew-valley-located): Understand the game’s fictional geography, the role of the Gem Sea and Gotoro Empire, and the clear limits of real-world comparisons.",
  );
  expect(llmsText).toContain(
    "[星露谷在游戏世界中位于哪里？](https://stardewvalleyplanner.art/zh/where-is-stardew-valley-located): 了解游戏中的虚构地理、宝石海与戈特洛帝国的关系，以及将游戏地点与现实世界进行类比时的明确边界。",
  );
  expect(llmsText).toContain(
    "[7 Stardew Valley Expanded Bachelors and Bachelorettes](https://stardewvalleyplanner.art/stardew-valley-expanded-bachelors-and-bachelorettes): See all 7 current SVE bachelors and bachelorettes, who is event-gated, starter loved gifts, and how to plan the farm after you choose.",
  );
  expect(llmsText).toContain(
    "[当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多](https://stardewvalleyplanner.art/zh/stardew-valley-expanded-bachelors-and-bachelorettes): 先对照当前7位星露谷SVE可结婚角色名单，分清4位女性和3位男性，再核对克莱尔、斯嘉丽、兰斯的出现闸门和入门最爱礼物。选定对象后打开星露谷农场规划器，给农舍、配偶房和出货箱道路留空；规划器只做布局，不追踪红心或NPC行程。来源核对于2026年8月25日SVE Wiki村民页。",
  );
  expect(llmsText).toContain(
    "[Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant](https://stardewvalleyplanner.art/sprinkler-stardew): Match each sprinkler to 4, 8, or 24 tiles, then check radius overlay on your farm map. Pressure nozzles and enrichers cannot share one sprinkler.",
  );
  expect(llmsText).toContain(
    "[星露谷洒水器布局别急着照抄模板：先算清4/8/24格覆盖，再排池塘、通道与农场边角，少漏浇也不浪费格](https://stardewvalleyplanner.art/zh/sprinkler-stardew): 星露谷洒水器布局怎么排，先看4格十字、8格3×3、24格5×5三种覆盖，再按农田边角、池塘和通道修正。本文给出数量公式、优质与铱制洒水器摆法、2×2模块示例、沙地与漏浇排查，还教你用在线规划器叠加洒水器和稻草人范围，先在地图上检查并导出截图，再照着布局进游戏摆放。",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
