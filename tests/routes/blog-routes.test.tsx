import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishBlogArchivePage from "../../app/(en)/blog/archive/page";
import EnglishBlogPage from "../../app/(en)/blog/page";
import EnglishBlogPostPage, {
  dynamicParams as englishDynamicParams,
  generateMetadata as generateEnglishBlogPostMetadata,
  generateStaticParams as generateEnglishStaticParams,
} from "../../app/(en)/[slug]/page";
import ChineseBlogArchivePage from "../../app/zh/blog/archive/page";
import ChineseBlogPage from "../../app/zh/blog/page";
import ChineseBlogPostPage, {
  dynamicParams as chineseDynamicParams,
  generateMetadata as generateChineseBlogPostMetadata,
  generateStaticParams as generateChineseStaticParams,
} from "../../app/zh/[slug]/page";
import { blogPostSlugs } from "../../src/blog/blog-post-registry";

it("enumerates only the registered root article slugs for both localized routes", () => {
  const expectedStaticParameters = blogPostSlugs.map((slug) => ({ slug }));

  expect(generateEnglishStaticParams()).toEqual(expectedStaticParameters);
  expect(generateChineseStaticParams()).toEqual(expectedStaticParameters);
  expect(englishDynamicParams).toBe(false);
  expect(chineseDynamicParams).toBe(false);
});

it("renders English blog pages with direct root article URLs and one page-level heading", async () => {
  const indexMarkup = renderToStaticMarkup(
    await EnglishBlogPage(),
  );
  const archiveMarkup = renderToStaticMarkup(
    await EnglishBlogArchivePage(),
  );
  const articleMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage({
      params: Promise.resolve({ slug: "carpenter-stardew" }),
    }),
  );

  expect(indexMarkup).toContain('href="/carpenter-stardew"');
  expect(indexMarkup).toContain('href="/stardew-valley-npc"');
  expect(indexMarkup).toContain('href="/where-is-stardew-valley-located"');
  expect(indexMarkup).toContain(
    'href="/stardew-valley-expanded-bachelors-and-bachelorettes"',
  );
  expect(indexMarkup).toContain('href="/sprinkler-stardew"');
  expect(indexMarkup).toContain('href="/glasshouse-stardew-valley"');
  expect(indexMarkup).toContain('href="/oak-tree-stardew"');
  expect(indexMarkup).toContain('href="/stardew-valley-trees"');
  expect(indexMarkup).toContain('href="/maple-tree-stardew"');
  expect(indexMarkup).toContain('href="/best-spring-crop-stardew"');
  expect(indexMarkup).toContain('href="/how-to-earn-money-stardew"');
  expect(indexMarkup).toContain('href="/rancher-or-tiller-stardew"');
  expect(indexMarkup).toContain('href="/summer-crops-stardew"');
  expect(indexMarkup).toContain('href="/fall-crops-stardew"');
  expect(indexMarkup).toContain('href="/how-to-level-up-farming-stardew"');
  expect(indexMarkup).toContain('href="/last-day-to-plant-stardew"');
  expect(indexMarkup).toContain('href="/profit-margin-stardew"');
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("All articles");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades");
  expect((articleMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect(articleMarkup).not.toContain('href="/en/carpenter-stardew"');
});

it("renders Chinese blog pages with localized paths and one page-level heading", async () => {
  const indexMarkup = renderToStaticMarkup(
    await ChineseBlogPage(),
  );
  const archiveMarkup = renderToStaticMarkup(
    await ChineseBlogArchivePage(),
  );
  const articleMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage({
      params: Promise.resolve({ slug: "where-is-robin-stardew-valley" }),
    }),
  );

  expect(indexMarkup).toContain('href="/zh/where-is-robin-stardew-valley"');
  expect(indexMarkup).toContain('href="/zh/stardew-valley-npc"');
  expect(indexMarkup).toContain('href="/zh/where-is-stardew-valley-located"');
  expect(indexMarkup).toContain(
    'href="/zh/stardew-valley-expanded-bachelors-and-bachelorettes"',
  );
  expect(indexMarkup).toContain('href="/zh/sprinkler-stardew"');
  expect(indexMarkup).toContain('href="/zh/glasshouse-stardew-valley"');
  expect(indexMarkup).toContain('href="/zh/oak-tree-stardew"');
  expect(indexMarkup).toContain('href="/zh/stardew-valley-trees"');
  expect(indexMarkup).toContain('href="/zh/maple-tree-stardew"');
  expect(indexMarkup).toContain('href="/zh/best-spring-crop-stardew"');
  expect(indexMarkup).toContain('href="/zh/how-to-earn-money-stardew"');
  expect(indexMarkup).toContain('href="/zh/rancher-or-tiller-stardew"');
  expect(indexMarkup).toContain('href="/zh/summer-crops-stardew"');
  expect(indexMarkup).toContain('href="/zh/fall-crops-stardew"');
  expect(indexMarkup).toContain('href="/zh/how-to-level-up-farming-stardew"');
  expect(indexMarkup).toContain('href="/zh/last-day-to-plant-stardew"');
  expect(indexMarkup).toContain('href="/zh/profit-margin-stardew"');
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("全部文章");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程");
  expect((articleMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
});

it("renders the new paired article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({
      slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
    }),
  };
  const chineseParameters = {
    params: Promise.resolve({
      slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
    }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
  );
  expect(chineseMarkup).toContain(
    "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
    description:
      "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
    description:
      "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
  });
});

it("still publishes the location article with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "where-is-stardew-valley-located" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "where-is-stardew-valley-located" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
  );
  expect(chineseMarkup).toContain("星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点");
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
    description:
      "Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
    description:
      "理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
  });
});

it("renders the paired sprinkler article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "sprinkler-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "sprinkler-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
  );
  expect(chineseMarkup).toContain(
    "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title:
      "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
    description:
      "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
    description:
      "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
  });
});

it("renders the paired glasshouse article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "glasshouse-stardew-valley" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "glasshouse-stardew-valley" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
  );
  expect(chineseMarkup).toContain(
    "星露谷物语温室布局：120格耕地与洒水器摆放指南",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
    description:
      "Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
    description:
      "了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
  });
});

it("renders the paired oak tree article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "oak-tree-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "oak-tree-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
  );
  expect(chineseMarkup).toContain(
    "星露谷物语橡树：橡子种植、间距与树脂采集",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
    description:
      "Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷物语橡树：橡子种植、间距与树脂采集",
    description:
      "认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
  });
});

it("renders the paired trees article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "stardew-valley-trees" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "stardew-valley-trees" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
  );
  expect(chineseMarkup).toContain(
    "星露谷种树：先分普通树和果树，再在农场图上留间隔",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
    description:
      "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
    description:
      "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
  });
});

it("renders the paired maple tree article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "maple-tree-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "maple-tree-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
  );
  expect(chineseMarkup).toContain(
    "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
    description:
      "Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
    description:
      "先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
  });
});

it("renders the paired spring crop article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "best-spring-crop-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "best-spring-crop-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1",
  );
  expect(chineseMarkup).toContain(
    "星露谷物语春天种什么：第一年草莓种子春13才卖",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1",
    description:
      "There is no single best spring crop. Pierre sells potato at 50g and cauliflower at 80g that morning. Festival strawberries are 100g on Spring 13; buy for tiles you can water, because a giant 3-by-3 still occupies nine of them at 10pm.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷物语春天种什么：第一年草莓种子春13才卖",
    description:
      "春1只种当天浇得完的土豆、花椰菜或防风草，金币留给蛋节。草莓种子平时不卖，皮埃尔摊位100金一粒。",
  });
});

it("renders the paired summer crops article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "summer-crops-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "summer-crops-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
  );
  expect(chineseMarkup).toContain(
    "星露谷夏天种什么：按买得到的种子和浇得完的格子选",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Summer Crops in Stardew: Rank by the Shop You Can Open This Morning",
    description:
      "Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷夏天种什么：按买得到的种子和浇得完的格子选",
    description:
      "夏 1 皮埃尔就卖蓝莓、甜瓜、啤酒花。杨桃要巴士进绿洲，红叶卷心菜第二年才上架。现卖走蓝莓，巨大留甜瓜 3×3，啤酒花按鲜卖看。",
  });
});

it("renders the paired fall crops article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "fall-crops-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "fall-crops-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
  );
  expect(chineseMarkup).toContain(
    "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed",
    description:
      "Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊",
    description:
      "现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道。第一年没有洋蓟；甜菜要巴士。宝石甜莓 83.33 不是秋 1 默认货架。",
  });
});

it("renders the paired farming XP article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "how-to-level-up-farming-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "how-to-level-up-farming-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
  );
  expect(chineseMarkup).toContain("星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150");
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title:
      "How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150",
    description:
      "Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150",
    description:
      "收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。",
  });
});

it("renders the paired last-plant article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "last-day-to-plant-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "last-day-to-plant-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Last Day to Plant in Stardew Valley: Parsnips by Spring 24",
  );
  expect(chineseMarkup).toContain("星露谷最晚播种日：春天防风草最晚在第 24 天种下");
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Last Day to Plant in Stardew Valley: Parsnips by Spring 24",
    description:
      "Plant parsnips by Spring 24 if you want them ready on Spring 28. Water that day. For other outdoor crops, subtract grow time from 28. Tables cover spring through winter.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷最晚播种日：春天防风草最晚在第 24 天种下",
    description:
      "春天想在第 28 天收到防风草，最晚在第 24 天种下，当天浇水。其他作物用 28 减去生长天数。文内有春夏秋冬查表。",
  });
});

it("renders the paired profit-margin article routes with locked metadata and one page-level heading", async () => {
  const englishParameters = {
    params: Promise.resolve({ slug: "profit-margin-stardew" }),
  };
  const chineseParameters = {
    params: Promise.resolve({ slug: "profit-margin-stardew" }),
  };
  const englishMarkup = renderToStaticMarkup(
    await EnglishBlogPostPage(englishParameters),
  );
  const chineseMarkup = renderToStaticMarkup(
    await ChineseBlogPostPage(chineseParameters),
  );

  expect(englishMarkup).toContain(
    "Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change",
  );
  expect(chineseMarkup).toContain(
    "Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选",
  );
  expect(englishMarkup).toContain("/blog/illustrations/profit-margin-stardew-price-boundary.webp");
  expect(chineseMarkup).toContain("/blog/illustrations/profit-margin-stardew-advanced-options.webp");
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect(englishMarkup).not.toContain("FAQPage");
  expect(chineseMarkup).not.toContain("FAQPage");

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change",
    description:
      "Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选",
    description:
      "Profit Margin Stardew Valley 讲的是星露谷物语新农场的价格倍率设置。本文解释 100%、75%、50%、25% 的差别、价格边界和小数取整规则，并按单人、多人或挑战目标说明如何选择。",
  });
});

it("rejects an unregistered article slug in both localized root routes", async () => {
  const unknownParameters = { params: Promise.resolve({ slug: "missing-guide" }) };

  await expect(generateEnglishBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
  await expect(generateChineseBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
});
