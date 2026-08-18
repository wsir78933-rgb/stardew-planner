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
  expect(indexMarkup).toContain('data-blog-location-state="index"');
  expect(archiveMarkup).toContain("全部文章");
  expect(archiveMarkup).toContain('data-blog-location-state="archive"');
  expect(articleMarkup).toContain("罗宾的商店没人？今天去哪里找她");
  expect((articleMarkup.match(/<h1/g) ?? [])).toHaveLength(1);
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
