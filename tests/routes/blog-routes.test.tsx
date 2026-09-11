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

it("rejects an unregistered article slug in both localized root routes", async () => {
  const unknownParameters = { params: Promise.resolve({ slug: "missing-guide" }) };

  await expect(generateEnglishBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
  await expect(generateChineseBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
});
