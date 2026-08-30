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
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("All articles");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("Carpenter Stardew: Which Robin Service Do You Need Today?");
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
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("全部文章");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("罗宾的商店没人？今天去哪里找她");
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
    "7 Stardew Valley Expanded Bachelors and Bachelorettes",
  );
  expect(chineseMarkup).toContain(
    "当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "7 Stardew Valley Expanded Bachelors and Bachelorettes",
    description:
      "See all 7 current SVE bachelors and bachelorettes, who is event-gated, starter loved gifts, and how to plan the farm after you choose.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title:
      "当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多",
    description:
      "先对照当前7位星露谷SVE可结婚角色名单，分清4位女性和3位男性，再核对克莱尔、斯嘉丽、兰斯的出现闸门和入门最爱礼物。选定对象后打开星露谷农场规划器，给农舍、配偶房和出货箱道路留空；规划器只做布局，不追踪红心或NPC行程。来源核对于2026年8月25日SVE Wiki村民页。",
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
    "Where Is Stardew Valley Located in the Game’s World?",
  );
  expect(chineseMarkup).toContain("星露谷在游戏世界中位于哪里？");
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Where Is Stardew Valley Located in the Game’s World?",
    description:
      "Understand the game’s fictional geography, the role of the Gem Sea and Gotoro Empire, and the clear limits of real-world comparisons.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷在游戏世界中位于哪里？",
    description:
      "了解游戏中的虚构地理、宝石海与戈特洛帝国的关系，以及将游戏地点与现实世界进行类比时的明确边界。",
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
    "Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant",
  );
  expect(chineseMarkup).toContain(
    "星露谷洒水器布局先分清4/8/24格",
  );
  expect((englishMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
  expect((chineseMarkup.match(/<h1/g) ?? [])).toHaveLength(1);

  await expect(generateEnglishBlogPostMetadata(englishParameters)).resolves.toMatchObject({
    title: "Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant",
    description:
      "Match each sprinkler to 4, 8, or 24 tiles, then check radius overlay on your farm map. Pressure nozzles and enrichers cannot share one sprinkler.",
  });
  await expect(generateChineseBlogPostMetadata(chineseParameters)).resolves.toMatchObject({
    title: "星露谷洒水器布局先分清4/8/24格",
    description:
      "覆盖落到池塘、通道或边界时，名义覆盖不会都变成作物格。规划器可叠加洒水器与稻草人范围，导出截图后再照着进游戏摆放。",
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
