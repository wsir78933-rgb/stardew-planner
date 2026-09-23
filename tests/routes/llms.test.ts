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
  expect(llmsText).toContain(
    "[Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup](https://stardewvalleyplanner.art/maple-tree-stardew): Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
  );
  expect(llmsText).toContain(
    "[星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆](https://stardewvalleyplanner.art/zh/maple-tree-stardew): 先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
  );
  expect(llmsText).toContain(
    "[Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1](https://stardewvalleyplanner.art/best-spring-crop-stardew): There is no single best spring crop. Pierre sells potato at 50g and cauliflower at 80g that morning. Festival strawberries are 100g on Spring 13; buy for tiles you can water, because a giant 3-by-3 still occupies nine of them at 10pm.",
  );
  expect(llmsText).toContain(
    "[星露谷物语春天种什么：第一年草莓种子春13才卖](https://stardewvalleyplanner.art/zh/best-spring-crop-stardew): 春1只种当天浇得完的土豆、花椰菜或防风草，金币留给蛋节。草莓种子平时不卖，皮埃尔摊位100金一粒。",
  );
  expect(llmsText).toContain(
    "[How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning](https://stardewvalleyplanner.art/how-to-earn-money-stardew): Year 1 gold is not a bigger field. You start with 500g. Name the next spend, water only tiles the starter can can finish, then fish leftover energy from Spring 2. Shops pay immediately; the shipping box pays after you sleep.",
  );
  expect(llmsText).toContain(
    "[星露谷第一年怎么赚钱：下一步是2,000金背包，还是铜喷壶](https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew): 12格在扔鱼和种子就买2,000金大型背包；浇水已是体力瓶颈再升铜喷壶（另要5铜锭、两夜）。鱼店春2开门，鱼当天卖给威利就能花，田只种今晚浇得完的格子。",
  );
  expect(llmsText).toContain(
    "[Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair](https://stardewvalleyplanner.art/rancher-or-tiller-stardew): Tiller's 10% and Rancher's 20% multiply different goods. Name one shipped item and the Farming 10 pair that click locks, then pick Tiller or Rancher. Mayonnaise is 228g or 266g, not both.",
  );
  expect(llmsText).toContain(
    "[星露谷农耕人还是畜牧人：20%和10%加的不是一类货](https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew): 过夜弹窗先看出货箱。生鲜蛋奶走畜牧人；作物、果酒、果酱走农耕人。选完 5 级，10 级只剩对应那一对。白天技能栏选不了。",
  );
  expect(llmsText).toContain(
    "[Summer Crops in Stardew: Rank by the Shop You Can Open This Morning](https://stardewvalleyplanner.art/summer-crops-stardew): Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day.",
  );
  expect(llmsText).toContain(
    "[星露谷夏天种什么：按买得到的种子和浇得完的格子选](https://stardewvalleyplanner.art/zh/summer-crops-stardew): 夏 1 皮埃尔就卖蓝莓、甜瓜、啤酒花。杨桃要巴士进绿洲，红叶卷心菜第二年才上架。现卖走蓝莓，巨大留甜瓜 3×3，啤酒花按鲜卖看。",
  );
  expect(llmsText).toContain(
    "[Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed](https://stardewvalleyplanner.art/fall-crops-stardew): Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table.",
  );
  expect(llmsText).toContain(
    "[星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊](https://stardewvalleyplanner.art/zh/fall-crops-stardew): 现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道。第一年没有洋蓟；甜菜要巴士。宝石甜莓 83.33 不是秋 1 默认货架。",
  );
  expect(llmsText).toContain(
    "[How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150](https://stardewvalleyplanner.art/how-to-level-up-farming-stardew): Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.",
  );
  expect(llmsText).toContain(
    "[星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150](https://stardewvalleyplanner.art/zh/how-to-level-up-farming-stardew): 收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。",
  );
  expect(llmsText).toContain(
    "[Last Day to Plant in Stardew Valley: Parsnips by Spring 24](https://stardewvalleyplanner.art/last-day-to-plant-stardew): Plant parsnips by Spring 24 if you want them ready on Spring 28. Water that day. For other outdoor crops, subtract grow time from 28. Tables cover spring through winter.",
  );
  expect(llmsText).toContain(
    "[星露谷最晚播种日：春天防风草最晚在第 24 天种下](https://stardewvalleyplanner.art/zh/last-day-to-plant-stardew): 春天想在第 28 天收到防风草，最晚在第 24 天种下，当天浇水。其他作物用 28 减去生长天数。文内有春夏秋冬查表。",
  );
  expect(llmsText).toContain(
    "[Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar](https://stardewvalleyplanner.art/pine-tree-stardew): Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.",
  );
  expect(llmsText).toContain(
    "[星露谷松树种植先看格子，不浇水也不能随便种](https://stardewvalleyplanner.art/zh/pine-tree-stardew): 松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。",
  );

  for (const { pathname } of getLocalizedIndexablePublicRouteEntries()) {
    const publicUrl = createCanonicalUrl(pathname);

    expect(llmsText).toContain(`](${publicUrl})`);
  }
});
