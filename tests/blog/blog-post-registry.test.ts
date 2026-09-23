import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  blogPostSlugs,
  getAllBlogPostMeta,
  getAllBlogPosts,
  getBlogPostBySlug,
  isBlogPostSlug,
  validateBlogPostRegistry,
  type LocalizedBlogPost,
} from "../../src/blog/blog-post-registry";

const expectedSlugs = [
  "carpenter-stardew",
  "where-is-robin-stardew-valley",
  "stardew-valley-npc",
  "stardew-valley-town-map",
  "where-is-stardew-valley-located",
  "stardew-valley-expanded-bachelors-and-bachelorettes",
  "sprinkler-stardew",
  "glasshouse-stardew-valley",
  "oak-tree-stardew",
  "stardew-valley-trees",
  "maple-tree-stardew",
  "best-spring-crop-stardew",
  "how-to-earn-money-stardew",
  "rancher-or-tiller-stardew",
  "summer-crops-stardew",
  "fall-crops-stardew",
  "do-you-have-to-water-trees-stardew",
  "how-to-level-up-farming-stardew",
  "last-day-to-plant-stardew",
  "pine-tree-stardew",
] as const;

function createLocalizedPost(
  slug: (typeof expectedSlugs)[number],
  overrides: Partial<LocalizedBlogPost> = {},
): LocalizedBlogPost {
  return {
    slug,
    title: `Title for ${slug}`,
    description: `Description for ${slug}`,
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 5,
    coverImage: {
      src: "/social-images/stardew-valley-farm-planner.png",
      alt: `Illustration for ${slug}`,
    },
    featured: true,
    Content: () => null,
    ...overrides,
  };
}

function createCompleteRegistry(): Readonly<
  Record<"en" | "zh-CN", readonly LocalizedBlogPost[]>
> {
  return {
    en: expectedSlugs.map((slug) => createLocalizedPost(slug)),
    "zh-CN": expectedSlugs.map((slug) =>
      createLocalizedPost(slug, { author: "星露谷规划器团队" }),
    ),
  };
}

it("keeps the twenty canonical blog identities in publishing order", () => {
  expect(blogPostSlugs).toEqual(expectedSlugs);
  expect(isBlogPostSlug("carpenter-stardew")).toBe(true);
  expect(isBlogPostSlug("where-is-robin-stardew-valley")).toBe(true);
  expect(isBlogPostSlug("missing-post")).toBe(false);
});

it("publishes only the forty localized root-level canonical article paths", () => {
  expect(blogPostCanonicalPaths).toEqual([
    "/carpenter-stardew/",
    "/where-is-robin-stardew-valley/",
    "/stardew-valley-npc/",
    "/stardew-valley-town-map/",
    "/where-is-stardew-valley-located/",
    "/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/sprinkler-stardew/",
    "/glasshouse-stardew-valley/",
    "/oak-tree-stardew/",
    "/stardew-valley-trees/",
    "/maple-tree-stardew/",
    "/best-spring-crop-stardew/",
    "/how-to-earn-money-stardew/",
    "/rancher-or-tiller-stardew/",
    "/summer-crops-stardew/",
    "/fall-crops-stardew/",
    "/do-you-have-to-water-trees-stardew/",
    "/how-to-level-up-farming-stardew/",
    "/last-day-to-plant-stardew/",
    "/pine-tree-stardew/",
    "/zh/carpenter-stardew/",
    "/zh/where-is-robin-stardew-valley/",
    "/zh/stardew-valley-npc/",
    "/zh/stardew-valley-town-map/",
    "/zh/where-is-stardew-valley-located/",
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/zh/sprinkler-stardew/",
    "/zh/glasshouse-stardew-valley/",
    "/zh/oak-tree-stardew/",
    "/zh/stardew-valley-trees/",
    "/zh/maple-tree-stardew/",
    "/zh/best-spring-crop-stardew/",
    "/zh/how-to-earn-money-stardew/",
    "/zh/rancher-or-tiller-stardew/",
    "/zh/summer-crops-stardew/",
    "/zh/fall-crops-stardew/",
    "/zh/do-you-have-to-water-trees-stardew/",
    "/zh/how-to-level-up-farming-stardew/",
    "/zh/last-day-to-plant-stardew/",
    "/zh/pine-tree-stardew/",
  ]);
});

it("returns paired English and Chinese post metadata in canonical order", () => {
  const englishPosts = getAllBlogPosts("en");
  const chinesePosts = getAllBlogPosts("zh-CN");

  expect(englishPosts.map((post) => post.slug)).toEqual(expectedSlugs);
  expect(chinesePosts.map((post) => post.slug)).toEqual(expectedSlugs);
  expect(englishPosts.every((post) => post.author === "Stardew Valley Planner Team")).toBe(
    true,
  );
  expect(chinesePosts.every((post) => post.author === "星露谷规划器团队")).toBe(true);
  expect(englishPosts.every((post) => post.featured)).toBe(true);
  expect(chinesePosts.every((post) => post.featured)).toBe(true);
  expect(getBlogPostBySlug("en", "carpenter-stardew")?.slug).toBe(
    "carpenter-stardew",
  );
  expect(englishPosts[0]).toMatchObject({
    title: "Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades",
    description:
      "Use Robin's Carpenter's Shop for farm buildings, farmhouse upgrades, moves, demolition, and shop supplies, with a placement plan before you order.",
  });
  expect(chinesePosts[0]).toMatchObject({
    title: "星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级",
    description:
      "了解罗宾木匠商店的营业时间、农场建筑、农舍升级、移动和拆除，并在下单前先规划放置位置。",
  });
  expect(englishPosts[1]).toMatchObject({
    title: "Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions",
    description:
      "Find Robin at 24 Mountain Road, check Tuesday, Friday, rain, festival, clinic, and construction closures, and plan your Carpenter's Shop trip.",
  });
  expect(chinesePosts[1]).toMatchObject({
    title: "罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程",
    description:
      "查找罗宾的 24 Mountain Road 木匠商店，核对周二、周五、雨天、节日、诊所和农场施工例外。",
  });
  expect(englishPosts[2]).toMatchObject({
    title: "Stardew Valley NPC List: Villagers, Marriage Candidates, and Services",
    description:
      "Sort the current Stardew Valley NPC list by marriage, giftable, and non-giftable roles, then plan gifts, schedules, and farm services.",
  });
  expect(chinesePosts[2]).toMatchObject({
    title: "星露谷 NPC 名单：可结婚角色、可送礼村民与服务",
    description:
      "按可结婚、可送礼和不可送礼分类整理星露谷 NPC，并核对送礼、好感度、商店服务与农场规划关系。",
  });
  expect(englishPosts[3]).toMatchObject({
    title: "Stardew Valley Town Map: Pelican Town Landmarks & Routes",
    description:
      "Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
  });
  expect(chinesePosts[3]).toMatchObject({
    title: "星露谷物语小镇地图：鹈鹕镇地点与路线",
    description:
      "用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
  });
  expect(englishPosts[4]).toMatchObject({
    title: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
    description:
      "Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
    },
  });
  expect(chinesePosts[4]).toMatchObject({
    title: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
    description:
      "理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
    },
  });
  expect(englishPosts[5]).toMatchObject({
    title: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
    description:
      "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
    },
  });
  expect(chinesePosts[5]).toMatchObject({
    title: "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
    description:
      "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
    },
  });
  expect(englishPosts[6]).toMatchObject({
    title:
      "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
    description:
      "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
    },
  });
  expect(chinesePosts[6]).toMatchObject({
    title: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
    description:
      "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
    },
  });
  expect(englishPosts[7]).toMatchObject({
    title: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
    description:
      "Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/glasshouse-stardew-valley-cover.webp",
      alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
    },
  });
  expect(chinesePosts[7]).toMatchObject({
    title: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
    description:
      "了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/glasshouse-stardew-valley-cover.webp",
      alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
    },
  });
  expect(englishPosts[8]).toMatchObject({
    title: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
    description:
      "Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/oak-tree-stardew-cover.webp",
      alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
    },
  });
  expect(chinesePosts[8]).toMatchObject({
    title: "星露谷物语橡树：橡子种植、间距与树脂采集",
    description:
      "认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/oak-tree-stardew-cover.webp",
      alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
    },
  });
  expect(englishPosts[9]).toMatchObject({
    title: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
    description:
      "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
    },
  });
  expect(chinesePosts[9]).toMatchObject({
    title: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
    description:
      "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
    },
  });
  expect(englishPosts[10]).toMatchObject({
    title: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
    description:
      "Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/maple-tree-stardew-cover.webp",
      alt: "Spaced maple trees with a wooden bucket on one trunk and winged maple seeds on the soil",
    },
  });
  expect(chinesePosts[10]).toMatchObject({
    title: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
    description:
      "先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/maple-tree-stardew-cover.webp",
      alt: "近处枫树树干挂着木桶，地面散落带翅种子，土路分叉通向农舍与风车的水彩插画",
    },
  });
  expect(englishPosts[11]).toMatchObject({
    title: "Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1",
    description:
      "There is no single best spring crop. Pierre sells potato at 50g and cauliflower at 80g that morning. Festival strawberries are 100g on Spring 13; buy for tiles you can water, because a giant 3-by-3 still occupies nine of them at 10pm.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/best-spring-crop-stardew-cover.webp",
      alt: "Spring farm watercolor with a 3-by-3 cauliflower block, strawberry rows, and a small potato patch",
    },
  });
  expect(chinesePosts[11]).toMatchObject({
    title: "星露谷物语春天种什么：第一年草莓种子春13才卖",
    description:
      "春1只种当天浇得完的土豆、花椰菜或防风草，金币留给蛋节。草莓种子平时不卖，皮埃尔摊位100金一粒。",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/best-spring-crop-stardew-cover.webp",
      alt: "春季农场水彩：中间九格花椰菜，一侧草莓垄，一侧小片土豆",
    },
  });
  expect(englishPosts[12]).toMatchObject({
    title: "How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning",
    description:
      "Year 1 gold is not a bigger field. You start with 500g. Name the next spend, water only tiles the starter can can finish, then fish leftover energy from Spring 2. Shops pay immediately; the shipping box pays after you sleep.",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/how-to-earn-money-stardew-cover.webp",
      alt: "Sunrise farm with a small potato patch, a fishing rod on a crate with coins, a pier, and a general store",
    },
  });
  expect(chinesePosts[12]).toMatchObject({
    title: "星露谷第一年怎么赚钱：下一步是2,000金背包，还是铜喷壶",
    description:
      "12格在扔鱼和种子就买2,000金大型背包；浇水已是体力瓶颈再升铜喷壶（另要5铜锭、两夜）。鱼店春2开门，鱼当天卖给威利就能花，田只种今晚浇得完的格子。",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/how-to-earn-money-stardew-cover.webp",
      alt: "日出农场水彩：小片土豆田通向码头，钓竿靠在带金币的木箱上，远处是杂货店",
    },
  });
  expect(englishPosts[13]).toMatchObject({
    title: "Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair",
    description:
      "Tiller's 10% and Rancher's 20% multiply different goods. Name one shipped item and the Farming 10 pair that click locks, then pick Tiller or Rancher. Mayonnaise is 228g or 266g, not both.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/rancher-or-tiller-stardew-cover.webp",
      alt: "Watercolor farm path that splits: vegetable beds and a produce crate on the left, a barn, coop, milk pail, and egg basket on the right.",
    },
  });
  expect(chinesePosts[13]).toMatchObject({
    title: "星露谷农耕人还是畜牧人：20%和10%加的不是一类货",
    description:
      "过夜弹窗先看出货箱。生鲜蛋奶走畜牧人；作物、果酒、果酱走农耕人。选完 5 级，10 级只剩对应那一对。白天技能栏选不了。",
    readTimeMinutes: 9,
    coverImage: {
      src: "/blog/rancher-or-tiller-stardew-cover.webp",
      alt: "水彩农场土路在前景分叉：左侧是菜畦和蔬菜箱，右侧是畜棚、鸡舍、奶桶和蛋篮。",
    },
  });
  expect(englishPosts[14]).toMatchObject({
    title: "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
    description:
      "Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day.",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/summer-crops-stardew-cover.webp",
      alt: "Outdoor summer field with blueberry bushes on the left, a 3-by-3 melon block in the center, hops trellis on the right, and a watering can in the dirt.",
    },
  });
  expect(chinesePosts[14]).toMatchObject({
    title: "星露谷夏天种什么：按买得到的种子和浇得完的格子选",
    description:
      "夏 1 皮埃尔就卖蓝莓、甜瓜、啤酒花。杨桃要巴士进绿洲，红叶卷心菜第二年才上架。现卖走蓝莓，巨大留甜瓜 3×3，啤酒花按鲜卖看。",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/summer-crops-stardew-cover.webp",
      alt: "夏季室外田：左侧蓝莓丛，中间九格甜瓜，右侧啤酒花架子，前景一把喷壶。",
    },
  });
  expect(englishPosts[15]).toMatchObject({
    title: "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
    description:
      "Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table.",
    readTimeMinutes: 19,
    coverImage: {
      src: "/blog/fall-crops-stardew-cover.webp",
      alt: "Outdoor fall field with cranberry bushes on the left, a pumpkin block in the center, grape trellis on the right, a watering can on the dirt, and a farmhouse and windmill under an autumn sky.",
    },
  });
  expect(chinesePosts[15]).toMatchObject({
    title: "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
    description:
      "现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道。第一年没有洋蓟；甜菜要巴士。宝石甜莓 83.33 不是秋 1 默认货架。",
    readTimeMinutes: 19,
    coverImage: {
      src: "/blog/fall-crops-stardew-cover.webp",
      alt: "秋季室外田：左侧蔓越莓丛，中间南瓜畦，右侧葡萄架子，前景喷壶，远处农舍与风车。",
    },
  });
  expect(englishPosts[16]).toMatchObject({
    title:
      "Do You Have to Water Trees in Stardew Valley? Check Stage 4 and the Fruit-Tree 3×3",
    description:
      "Common trees and fruit-tree saplings do not need watering. If a common sapling is stuck at stage 4, check its eight adjacent tiles for a mature tree; for a fruit sapling, check its 3×3 for blocking objects. Crops follow a separate watering rule.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/do-you-have-to-water-trees-stardew-cover.webp",
      alt: "Farm planning illustration separating a common tree, a fruit-tree sapling, tilled crop soil, and a sprinkler.",
    },
  });
  expect(chinesePosts[16]).toMatchObject({
    title: "星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3",
    description:
      "普通树和果树苗都不用浇水；普通树苗停在第4阶段时，查八个邻格有没有成熟树；果树苗没长，则查中心3×3里的会占空间的东西。作物再按耕地供水规则判断。",
    readTimeMinutes: 17,
    coverImage: {
      src: "/blog/do-you-have-to-water-trees-stardew-cover-zh.webp",
      alt: "农场规划示意图，将普通树、果树苗、耕地作物和洒水器分成不同判断对象。",
    },
  });
  expect(englishPosts[17]).toMatchObject({
    title:
      "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
    description:
      "Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/how-to-level-up-farming-stardew-cover.webp",
      alt: "Watercolor illustration of a farmer in a straw hat pulling a leafy root crop from a small stone-edged bed, with a drawn circular Farming sprout badge rising nearby and a farmhouse in the distance.",
    },
  });
  expect(chinesePosts[17]).toMatchObject({
    title: "星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150",
    description:
      "收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/how-to-level-up-farming-stardew-cover.webp",
      alt: "水彩插画：戴草帽的农夫从石边小畦拔起带叶根菜，旁边是手绘圆形耕种嫩芽徽章，远处有农舍。",
    },
  });
  expect(englishPosts[18]).toMatchObject({
    title: "Last Day to Plant in Stardew Valley: Parsnips by Spring 24",
    description:
      "Plant parsnips by Spring 24 if you want them ready on Spring 28. Water that day. For other outdoor crops, subtract grow time from 28. Tables cover spring through winter.",
    readTimeMinutes: 15,
    coverImage: {
      src: "/blog/last-day-to-plant-stardew-cover.webp",
      alt: "Watercolor of an outdoor vegetable patch with cabbages and leafy rows, a metal watering can on the dirt, a farmhouse and windmill at sunset, and a wooden Spring board numbered 1 through 28 with day 28 marked.",
    },
  });
  expect(chinesePosts[18]).toMatchObject({
    title: "星露谷最晚播种日：春天防风草最晚在第 24 天种下",
    description:
      "春天想在第 28 天收到防风草，最晚在第 24 天种下，当天浇水。其他作物用 28 减去生长天数。文内有春夏秋冬查表。",
    readTimeMinutes: 16,
    coverImage: {
      src: "/blog/last-day-to-plant-stardew-cover.webp",
      alt: "水彩插画：室外菜畦里种着卷心菜和绿叶作物，土路上放着喷壶，远处农舍和风车映着日落，右侧木牌写着 Spring，格子从 1 到 28，第 28 格标了出来。",
    },
  });
  expect(englishPosts[19]).toMatchObject({
    title: "Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar",
    description:
      "Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.",
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 12,
    featured: true,
    coverImage: {
      src: "/blog/pine-tree-stardew-cover.webp",
      alt: "Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground.",
    },
  });
  expect(chinesePosts[19]).toMatchObject({
    title: "星露谷松树种植先看格子，不浇水也不能随便种",
    description:
      "松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。",
    topic: "星露谷物语指南",
    author: "星露谷规划器团队",
    readTimeMinutes: 13,
    featured: true,
    coverImage: {
      src: "/blog/pine-tree-stardew-cover.webp",
      alt: "松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。",
    },
  });
  expect(getBlogPostBySlug("zh-CN", "missing-post" as never)).toBeUndefined();
});

it("binds every localized post to its own original blog cover", () => {
  const expectedCoverPaths = {
    en: {
      "carpenter-stardew": "/blog/carpenter-stardew-cover.webp",
      "where-is-robin-stardew-valley": "/blog/where-is-robin-stardew-valley-cover.webp",
      "stardew-valley-npc": "/blog/stardew-valley-npc-cover.webp",
      "stardew-valley-town-map": "/blog/stardew-valley-town-map-cover.webp",
      "where-is-stardew-valley-located":
        "/blog/where-is-stardew-valley-located-cover.webp",
      "stardew-valley-expanded-bachelors-and-bachelorettes":
        "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      "sprinkler-stardew": "/blog/sprinkler-stardew-cover.webp",
      "glasshouse-stardew-valley": "/blog/glasshouse-stardew-valley-cover.webp",
      "oak-tree-stardew": "/blog/oak-tree-stardew-cover.webp",
      "stardew-valley-trees": "/blog/stardew-valley-trees-cover.webp",
      "maple-tree-stardew": "/blog/maple-tree-stardew-cover.webp",
      "best-spring-crop-stardew": "/blog/best-spring-crop-stardew-cover.webp",
      "how-to-earn-money-stardew": "/blog/how-to-earn-money-stardew-cover.webp",
      "rancher-or-tiller-stardew": "/blog/rancher-or-tiller-stardew-cover.webp",
      "summer-crops-stardew": "/blog/summer-crops-stardew-cover.webp",
      "fall-crops-stardew": "/blog/fall-crops-stardew-cover.webp",
      "do-you-have-to-water-trees-stardew":
        "/blog/do-you-have-to-water-trees-stardew-cover.webp",
      "how-to-level-up-farming-stardew":
        "/blog/how-to-level-up-farming-stardew-cover.webp",
      "last-day-to-plant-stardew": "/blog/last-day-to-plant-stardew-cover.webp",
      "pine-tree-stardew": "/blog/pine-tree-stardew-cover.webp",
    },
    "zh-CN": {
      "carpenter-stardew": "/blog/carpenter-stardew-cover.webp",
      "where-is-robin-stardew-valley": "/blog/where-is-robin-stardew-valley-cover.webp",
      "stardew-valley-npc": "/blog/stardew-valley-npc-cover.webp",
      "stardew-valley-town-map": "/blog/stardew-valley-town-map-cover.webp",
      "where-is-stardew-valley-located":
        "/blog/where-is-stardew-valley-located-cover.webp",
      "stardew-valley-expanded-bachelors-and-bachelorettes":
        "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      "sprinkler-stardew": "/blog/sprinkler-stardew-cover.webp",
      "glasshouse-stardew-valley": "/blog/glasshouse-stardew-valley-cover.webp",
      "oak-tree-stardew": "/blog/oak-tree-stardew-cover.webp",
      "stardew-valley-trees": "/blog/stardew-valley-trees-cover.webp",
      "maple-tree-stardew": "/blog/maple-tree-stardew-cover.webp",
      "best-spring-crop-stardew": "/blog/best-spring-crop-stardew-cover.webp",
      "how-to-earn-money-stardew": "/blog/how-to-earn-money-stardew-cover.webp",
      "rancher-or-tiller-stardew": "/blog/rancher-or-tiller-stardew-cover.webp",
      "summer-crops-stardew": "/blog/summer-crops-stardew-cover.webp",
      "fall-crops-stardew": "/blog/fall-crops-stardew-cover.webp",
      "do-you-have-to-water-trees-stardew":
        "/blog/do-you-have-to-water-trees-stardew-cover-zh.webp",
      "how-to-level-up-farming-stardew":
        "/blog/how-to-level-up-farming-stardew-cover.webp",
      "last-day-to-plant-stardew": "/blog/last-day-to-plant-stardew-cover.webp",
      "pine-tree-stardew": "/blog/pine-tree-stardew-cover.webp",
    },
  } as const;

  for (const locale of ["en", "zh-CN"] as const) {
    for (const post of getAllBlogPosts(locale)) {
      expect(post.coverImage.src).toBe(expectedCoverPaths[locale][post.slug]);
      expect(post.coverImage.src).not.toBe("/social-images/stardew-valley-farm-planner.png");
    }
  }
});

it("projects fresh client-safe metadata without article Content functions", () => {
  const firstProjection = getAllBlogPostMeta("en");
  const secondProjection = getAllBlogPostMeta("en");

  expect(firstProjection).not.toBe(secondProjection);
  expect(firstProjection[0]).not.toBe(secondProjection[0]);
  expect(firstProjection[0]).not.toHaveProperty("Content");
  expect(firstProjection.map((post) => post.slug)).toEqual(expectedSlugs);
});

it("accepts a registry with complete, meaningful localized posts", () => {
  expect(() => validateBlogPostRegistry(createCompleteRegistry())).not.toThrow();
});

it.each([
  ["title", { title: "" }],
  ["description", { description: "" }],
  ["topic", { topic: "" }],
  ["author", { author: "" }],
  ["cover image source", { coverImage: { src: "", alt: "A useful illustration" } }],
] as const)("rejects a blank required %s and names the post slug", (_field, overrides) => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", overrides);

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("carpenter-stardew");
});

it("rejects a non-positive read time with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    readTimeMinutes: 0,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("0");
});

it("rejects a fractional read time with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    readTimeMinutes: 2.5,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("2.5");
});

it("rejects a non-meaningful cover alt string with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    coverImage: {
      src: "/social-images/stardew-valley-farm-planner.png",
      alt: "Image",
    },
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("Image");
});

it("rejects a registry missing a localized post and names its slug", () => {
  const registry = createCompleteRegistry();

  expect(() =>
    validateBlogPostRegistry({ ...registry, "zh-CN": [registry["zh-CN"][0]] }),
  ).toThrow("where-is-robin-stardew-valley");
});

it("rejects duplicate localized slugs and names the duplicate", () => {
  const registry = createCompleteRegistry();
  const duplicatePost = createLocalizedPost("carpenter-stardew");

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [registry.en[0], duplicatePost] }),
  ).toThrow("carpenter-stardew");
});

it("rejects localized posts that reverse canonical publishing order", () => {
  const registry = createCompleteRegistry();

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [...registry.en].reverse() }),
  ).toThrow(
    "Expected: carpenter-stardew. Received: pine-tree-stardew.",
  );
});

it("rejects unsupported locale entries and names the rejected locale", () => {
  const registry = { ...createCompleteRegistry(), fr: [] };

  expect(() => validateBlogPostRegistry(registry)).toThrow("fr");
});

it("rejects an unknown localized slug and names the rejected value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    slug: "unknown-stardew-post" as never,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("unknown-stardew-post");
});
