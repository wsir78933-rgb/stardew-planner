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
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("全部文章");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("罗宾的商店没人？今天去哪里找她");
  expect((articleMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
});

it("renders the new paired article routes with locked metadata and one page-level heading", async () => {
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
  expect(chineseMarkup).toContain(
    "星露谷在游戏世界中位于哪里？",
  );
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

it("rejects an unregistered article slug in both localized root routes", async () => {
  const unknownParameters = { params: Promise.resolve({ slug: "missing-guide" }) };

  await expect(generateEnglishBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
  await expect(generateChineseBlogPostMetadata(unknownParameters)).rejects.toMatchObject({
    digest: "NEXT_HTTP_ERROR_FALLBACK;404",
  });
});
