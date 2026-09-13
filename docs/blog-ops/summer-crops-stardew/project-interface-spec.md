# Project interface spec: add one bilingual blog post

This document is the ProjectInterfaceSpec for Agent G. It describes how this existing website publishes one English + Simplified Chinese blog post. It does not contain article body, titles, or a chosen slug.

Slug is **not finalized**. F/G choose it. Do **not** occupy `best-spring-crop-stardew` or any other occupied slug below.

## Project

| Item | Value |
|---|---|
| Project path | `/Users/wusir/Desktop/开发项目集合/stardew planner` |
| Production site | `https://stardewvalleyplanner.art/` |
| Package manager | `pnpm` (`package.json` `packageManager`: `pnpm@10.22.0`) |
| App | Next.js `16.3.0`, App Router, `output: "export"` in `next.config.ts` |
| Locales | `en`, `zh-CN` (`src/i18n/public-locale.ts` `publicLocales`) |
| Article template | Shared `app/(en)/[slug]/page.tsx` and `app/zh/[slug]/page.tsx` |
| New article (working name) | summer crops stardew |

Do not create a second site, a demo HTML page, or a new `app/**/page.tsx` per article.

## Locales and URL pattern

English article URL: `/{slug}`  
Chinese article URL: `/zh/{slug}`  
English blog index: `/blog`  
Chinese blog index: `/zh/blog`

Canonical public pathnames have **no trailing slash** except `/`. `createCanonicalUrl` in `src/seo/public-site-url.ts` throws if a non-root pathname ends with `/`.

Examples of live posts:

- `https://stardewvalleyplanner.art/rancher-or-tiller-stardew`
- `https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew`
- `https://stardewvalleyplanner.art/best-spring-crop-stardew`
- `https://stardewvalleyplanner.art/zh/best-spring-crop-stardew`

Local (this repo’s real port):

- `http://127.0.0.1:3003/{slug}`
- `http://127.0.0.1:3003/zh/{slug}`

`src/blog/blog-post-identities.ts` also exports identity strings **with** a trailing slash (`/rancher-or-tiller-stardew/`, `/zh/rancher-or-tiller-stardew/`). Those are registry identity values, not public canonical pathnames.

### Occupied slugs (do not overwrite)

Current `blogPostSlugs` in `src/blog/blog-post-identities.ts`, publishing order oldest → newest:

1. `carpenter-stardew`
2. `where-is-robin-stardew-valley`
3. `stardew-valley-npc`
4. `stardew-valley-town-map`
5. `where-is-stardew-valley-located`
6. `stardew-valley-expanded-bachelors-and-bachelorettes`
7. `sprinkler-stardew`
8. `glasshouse-stardew-valley`
9. `oak-tree-stardew`
10. `stardew-valley-trees`
11. `maple-tree-stardew`
12. `best-spring-crop-stardew`
13. `how-to-earn-money-stardew`
14. `rancher-or-tiller-stardew`

Append the new slug at the **end**. Registry order must match this array index-for-index in both locales (`validateBlogPostRegistry` throws `Invalid blog post order`).

Home “latest articles” reverse that array, so a 15th slug becomes the newest card. Default visible count is 6 (`src/blog/blog-home-state.ts`).

## Do not add a new App Router page

Articles are **not** `app/best-spring-crop-stardew/page.tsx`. Both locales already enumerate every `blogPostSlugs` value:

```24:28:app/(en)/[slug]/page.tsx
export function generateStaticParams(): { slug: BlogPostSlug }[] {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
```

Chinese: `app/zh/[slug]/page.tsx`, same `generateStaticParams` + `dynamicParams = false`. Unknown slugs call `notFound()`.

Next.js 16 notes that already match this repo (`node_modules/next/dist/docs/`):

- `page.tsx` / `generateMetadata` `params` is a `Promise` and must be `await`ed (`01-app/03-api-reference/03-file-conventions/page.md`, `01-app/03-api-reference/04-functions/generate-metadata.md`).
- `generateStaticParams` fills `[slug]` at `next build` (`01-app/03-api-reference/04-functions/generate-static-params.md`).
- `dynamicParams = false` 404s slugs not returned by `generateStaticParams` (`01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`).
- `output: "export"` emits `out/{slug}.html` and `out/zh/{slug}.html` (`01-app/02-guides/static-exports.md`). `next.config.ts` also sets `images: { unoptimized: true }`.

G must **not** edit those two page files. Registering the slug is enough for routing.

`app/sitemap.ts` maps `getLocalizedIndexablePublicRouteEntries()` and needs no per-article edit. `src/i18n/public-route-registry.ts` already spreads `blogPostSlugs` into `/blog`, `/blog/archive`, and `/${slug}`.

## Files G must touch

Replace `{slug}` with the F/G-chosen slug. PascalCase examples from this repo: `RancherOrTillerStardewEnglishArticle`, `BestSpringCropStardewEnglishArticle`.

### Create

| File | Why |
|---|---|
| `src/blog/articles/{slug}.en.tsx` | English body module |
| `src/blog/articles/{slug}.zh.tsx` | Chinese body module |
| `public/blog/{slug}-cover.webp` | Shared cover (both locales) |
| `public/blog/illustrations/{name}.webp` | In-article figures (cover-only is not a finished illustrated post) |
| `tests/blog/{slug}-identity.test.ts` | Identity + locked-angle test |

### Edit (source)

| File | Why |
|---|---|
| `src/blog/blog-post-identities.ts` | Append `{slug}` to `blogPostSlugs` |
| `src/blog/blog-copy.ts` | Add `en` `/{slug}` and `zh-CN` `/zh/{slug}` to `localizedBlogPostPaths` |
| `src/blog/blog-post-registry.tsx` | Import both article functions; append matching `en` and `zh-CN` registry objects |
| `public/llms.txt` | Add both language bullets under Planning guides / 农场规划指南 |

`blog-copy.ts` is typed `Record<BlogPostSlug, string>`. Adding a slug without both path entries fails `pnpm typecheck`.

`getLocalizedBlogPostHref` throws if a locale/slug pair is missing:

```155:161:src/blog/blog-copy.ts
  if (localizedPath === undefined) {
    throw new Error(
      `Unsupported localized blog post route. Received locale=${JSON.stringify(locale)}, slug=${JSON.stringify(slug)}.`,
    );
  }
```

### Edit (tests that hardcode the 14-slug world)

These **fail** if the new identity is registered and the hardcoded list/count is left at 14 / 28 / 20 / 38 / 40.

| File | What breaks |
|---|---|
| `tests/blog/blog-post-registry.test.ts` | `expectedSlugs` exact match; “fourteen” / “twenty-eight” path lists; `expectedCoverPaths`; reverse-order error currently names `rancher-or-tiller-stardew` as last; `createCompleteRegistry()` must include the new slug |
| `tests/blog/blog-home-state.test.ts` | Newest-six list currently starts with `rancher-or-tiller-stardew`; `totalPostCount` is `14`; carousel lists all 14 slugs |
| `tests/i18n/public-route-registry.test.ts` | `canonicalPublicPaths` length `20`; localized entries `40`; indexable `38` |
| `tests/seo/canonical-public-routes.test.ts` | `canonicalPublicPaths` length `20`; `expectedBlogCanonicalPaths` should include `/{slug}` |
| `tests/routes/sitemap-robots.test.ts` | sitemap `<loc>` count `38`; `expectedBlogSitemapPathnames` |
| `tests/routes/removed-public-pages.test.ts` | lengths `20` / `40` / `38`; sitemap `<loc>` count `38` |
| `tests/routes/llms.test.ts` | After identities change, the loop requires `public/llms.txt` (copied to `out/llms.txt`) to contain `](https://stardewvalleyplanner.art/{slug})` and the `/zh/` pair. Add explicit `toContain` lines the same way rancher/spring crop are listed |

After one new bilingual post, the counts become:

- 15 slugs
- 30 identity paths in `blogPostCanonicalPaths` (15 × 2, trailing slash)
- 21 `canonicalPublicPaths` (`/` + privacy + terms + contact + `/blog` + `/blog/archive` + 15 articles)
- 42 localized public routes (21 × 2)
- 40 indexable / sitemap `<loc>` values (contact is noindex in both locales)

### Edit (tests that will not auto-fail, but must cover the new post)

| File | Why G still edits it |
|---|---|
| `tests/blog/blog-direct-reader-voice.test.tsx` | Fixture arrays of article components; omitted articles are not scanned |
| `tests/blog/blog-sources.test.tsx` | `articleSourceExpectations` must include both locales’ `BlogSources` href/label/note/order |
| `tests/assets/blog-cover-images.test.ts` | Cover + illustration VP8 WebP budget; “fourteen” test currently names every cover file |
| `tests/routes/blog-routes.test.tsx` | Index href `toContain` lines; optional paired-metadata test (spring crop has one at slug `best-spring-crop-stardew`) |
| `tests/routes/static-public-pages.test.ts` | Add EN + ZH article fixtures; add the new cover to `/blog` and `/zh/blog` `coverImages` |
| `tests/routes/static-routes.test.ts` | Add `{slug}.html` and `zh/{slug}.html` to `expectedStaticPageFiles` |

### Do not edit for a normal new post

These already derive from `blogPostSlugs` / registry:

- `app/(en)/[slug]/page.tsx`
- `app/zh/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `src/i18n/public-route-registry.ts`
- `src/seo/page-metadata.ts`
- `src/seo/page-structured-data.ts`
- `src/components/blog/blog-article-content.tsx`
- `src/components/blog/blog-faq-list.tsx`
- `src/components/blog/blog-sources.tsx`
- `src/components/blog/article-card.tsx`

## Registry metadata contract

`BlogPostMeta` in `src/blog/blog-post-registry.tsx`:

```45:57:src/blog/blog-post-registry.tsx
export type BlogPostMeta = Readonly<{
  slug: BlogPostSlug;
  title: string;
  description: string;
  topic: string;
  author: string;
  readTimeMinutes: number;
  coverImage: Readonly<{
    src: string;
    alt: string;
  }>;
  featured: boolean;
}>;
```

Locked values from current tests (`tests/blog/blog-post-registry.test.ts`):

- `author` English: `Stardew Valley Planner Team`
- `author` Chinese: `星露谷规划器团队`
- `featured`: `true` for **every** post (`englishPosts.every((post) => post.featured)`)
- `topic` English: `Stardew Valley Guides`
- `topic` Chinese: `星露谷物语指南`
- `readTimeMinutes`: positive integer; locales may differ (rancher is `11` en / `9` zh-CN)
- `coverImage.src`: `/blog/{slug}-cover.webp` (same file both locales)
- `coverImage.alt`: non-empty, **trimmed length ≥ 8**, describes the picture
- `title` / `description`: from F lock; they become `<title>`, meta description, Open Graph, H1, and Article JSON-LD `headline`/`description`

Do **not** invent a different author. There is **no** `datePublished` field. JSON-LD Article also has no dates (see metadata section).

Latest registry objects to copy the shape from:

English rancher (`src/blog/blog-post-registry.tsx`):

```264:278:src/blog/blog-post-registry.tsx
    {
      slug: "rancher-or-tiller-stardew",
      title: "Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair",
      description:
        "Tiller's 10% and Rancher's 20% multiply different goods. Name one shipped item and the Farming 10 pair that click locks, then pick Tiller or Rancher. Mayonnaise is 228g or 266g, not both.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 11,
      coverImage: {
        src: "/blog/rancher-or-tiller-stardew-cover.webp",
        alt: "Watercolor farm path that splits: vegetable beds and a produce crate on the left, a barn, coop, milk pail, and egg basket on the right.",
      },
      featured: true,
      Content: RancherOrTillerStardewEnglishArticle,
    },
```

`blog-copy.ts` path map example:

```113:115:src/blog/blog-copy.ts
    "best-spring-crop-stardew": "/best-spring-crop-stardew",
    "how-to-earn-money-stardew": "/how-to-earn-money-stardew",
    "rancher-or-tiller-stardew": "/rancher-or-tiller-stardew",
```

Chinese keys in the same file use `/zh/{slug}`.

## Article module public exports and TSX conventions

Each locale is its **own** module. Do not share one component with an `if (locale)` branch.

Public export names (latest pattern):

- English: `export function {Pascal}EnglishArticle()`
- Chinese: `export function {Pascal}ChineseArticle()`

Files:

- `src/blog/articles/rancher-or-tiller-stardew.en.tsx` → `RancherOrTillerStardewEnglishArticle`
- `src/blog/articles/rancher-or-tiller-stardew.zh.tsx` → `RancherOrTillerStardewChineseArticle`
- `src/blog/articles/best-spring-crop-stardew.en.tsx` → `BestSpringCropStardewEnglishArticle`

Crop-article body pattern (tables, FAQ, sources, planner CTA): `best-spring-crop-stardew.en.tsx` / `.zh.tsx`.  
Latest wiring/identity pattern: `rancher-or-tiller-stardew.en.tsx` / `.zh.tsx`.

### Root and headings

```tsx
export function BestSpringCropStardewEnglishArticle() {
  return (
    <article>
      <p>…opening paragraph, no H1…</p>
      <h2>…</h2>
      …
    </article>
  );
}
```

- Body **must not** contain `<h1>`. Page H1 is `post.title` from `BlogArticleContent`.
- Start with `<article><p>…`, not a heading. `tests/blog/blog-article-content.test.tsx` `getOpeningParagraph` requires that for the older articles; keep it.
- Do not write author/SEO narration. `tests/blog/blog-direct-reader-voice.test.tsx` bans English patterns such as `this guide covers`, `the sections below`, `use this page`, and Chinese `本文`, `下面按`, `来源页面`, etc.

### Imports

From `src/blog/articles/*.tsx`, the real import used in rancher/spring:

```1:2:src/blog/articles/rancher-or-tiller-stardew.en.tsx
import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
```

`BlogFaqList` is a client component (`"use client"`). That is the existing pattern; article modules stay Server Components and render it as a child.

`BlogYouTubeVideo` exists (`src/components/blog/blog-youtube-video.tsx`) but the crop/gold/rancher articles do **not** use it. Do not add YouTube unless the locked handoff requires it. Click-to-load iframe is the project YouTube rule; do not put a raw `youtube.com` iframe in the article (older article tests forbid `<iframe>` / `youtube.com`).

Do not use `next/image`. Articles and covers use plain `<img>`. `next.config.ts` sets `images: { unoptimized: true }`.

### Tables

```tsx
<div
  aria-label="Year 1 spring crops wiki gold per day"
  className="blog-table-scroll"
  role="region"
  tabIndex={0}
>
  <table className="blog-data-table">
    <thead>
      <tr>
        <th scope="col">Crop</th>
        <th scope="col">Seed source and price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Potato</td>
        <td>Pierre 50g</td>
      </tr>
    </tbody>
  </table>
</div>
```

CSS: `app/globals.css` `[data-blog-article] .blog-table-scroll` and `.blog-data-table`.

### In-article figures

```tsx
<figure className="blog-article-media">
  <img
    alt="Nine cauliflower plants in a 3-by-3 square with walking space around the block so a giant can form"
    decoding="async"
    height="941"
    loading="lazy"
    src="/blog/illustrations/spring-giant-cauliflower-3x3.webp"
    width="1672"
  />
  <figcaption>
    A 3-by-3 of cauliflower with the sprinkler and scarecrow kept off those
    nine tiles, which is the giant layout, not a harvest row.
  </figcaption>
</figure>
```

Inline images are **lazy**. Cover on the article page is **not** lazy (see LCP).

### Planner CTA class

Use `className="blog-planner-link"` only on **this site’s** planner/article links. CSS color is `#a3155b` (`app/globals.css`). Do not put that class on wiki URLs.

English crop example (`best-spring-crop-stardew.en.tsx`):

```tsx
<a className="blog-planner-link" href="/#planner">planner</a>
<a className="blog-planner-link" href="/?farmType=standard">Standard Farm map</a>
<a className="blog-planner-link" href="/sprinkler-stardew">sprinkler guide</a>
```

Chinese crop example (`best-spring-crop-stardew.zh.tsx`):

```tsx
<a className="blog-planner-link" href="/zh#planner">…</a>
<a className="blog-planner-link" href="/zh?farmType=standard">…</a>
<a className="blog-planner-link" href="/zh/sprinkler-stardew">…</a>
```

English rancher also uses `/#planner` and `/best-spring-crop-stardew`. Hash and query stay on the localized homepage path: `/#planner`, `/zh#planner` — not `/zh/#planner`.

Planner copy in recent articles states the tool is a placement sketch, fan-made, not affiliated with ConcernedApe / Stardew Valley, and does not water / compute gold / pick professions.

### FAQ

`BlogFaqList` props (`src/components/blog/blog-faq-list.tsx`):

```ts
export type BlogFaqItem = Readonly<{
  question: string;
  answer: ReactNode;
}>;
```

Empty list throws. Answer must not be null/undefined/false/blank. Use a `<p>` (or similar) as `answer`. Place under an `<h2>FAQ</h2>` / `<h2>常见问题</h2>`.

This is **on-page FAQ content**, not `FAQPage` JSON-LD. `tests/routes/static-public-pages.test.ts` `articleOnlySchema: true` forbids `"@type":"FAQPage"`, `"BlogPosting"`, `"QAPage"`. Article pages emit only `Article`.

### Sources

`BlogSources` props (`src/components/blog/blog-sources.tsx`):

```ts
export type BlogSourceItem = Readonly<{
  href: string;
  label: string;
  note?: string;
}>;
```

```tsx
<BlogSources
  heading="Sources"
  checkedLabel="Checked 2026-09-12 against Stardew Valley 1.6.15 wiki pages …"
  items={[
    { href: "https://stardewvalleywiki.com/Crops", label: "Stardew Valley Wiki: Crops" },
  ]}
/>
```

Chinese heading in crop/rancher: `来源` (oak uses `资料来源`; do not invent a third heading unless matching that article). `checkedLabel` comes from the locked handoff; do not fabricate a check date.

`tests/blog/blog-sources.test.tsx` asserts href, label, optional note, **order**, and heading for each listed article.

## Cover and illustration paths

| Role | Path | Notes |
|---|---|---|
| Cover | `public/blog/{slug}-cover.webp` | Served as `/blog/{slug}-cover.webp` |
| Inline | `public/blog/illustrations/{name}.webp` | Served as `/blog/illustrations/{name}.webp` |
| YouTube poster (only if used) | `public/blog/video-posters/{name}.webp` | 1280×720 in Robin’s test; crop articles do not use this |

Examples that exist now:

- `/blog/best-spring-crop-stardew-cover.webp`
- `/blog/rancher-or-tiller-stardew-cover.webp`
- `/blog/illustrations/year-1-spring-crop-calendar.webp`
- `/blog/illustrations/spring-giant-cauliflower-3x3.webp`
- `/blog/illustrations/rancher-or-tiller-profession-tree-en.webp`
- `/blog/illustrations/rancher-or-tiller-profession-tree-zh.webp`

Rancher uses **locale-specific** illustration files when the diagram contains words. Spring crop uses shared illustration files. Follow the handoff.

### Image format (enforced)

`tests/assets/blog-cover-images.test.ts` reads **VP8 lossy** WebP (`RIFF` / `WEBP` / chunk `VP8 `). VP8L (lossless) and VP8X (extended) fail with `Invalid VP8 WebP image`.

| Asset | Dimensions | Byte budget | Aspect |
|---|---|---|---|
| Cover | width `1672`, height `941` | ≤ `1.25 * 1024 * 1024` | ~16:9 (`toBeCloseTo(16 / 9, 2)`) |
| Crop/rancher inline illustrations | `1672` × `941` | ≤ `400 * 1024` | ~16:9 |

`<img>` must set `width={1672}` `height={941}` to match.

Alt: describe the actual picture. Caption (`figcaption`) is the reader-facing explanation. Do not stuff keywords into alt. Cover alt is also used on article cards.

A leftover `{slug}-cover.png` is not required. Robin’s test asserts the PNG is **absent**. New covers are WebP only.

## LCP / cover handling

`BlogArticleContent` (`src/components/blog/blog-article-content.tsx`) renders the cover in `<header>`:

```25:30:src/components/blog/blog-article-content.tsx
        <img
          alt={post.coverImage.alt}
          height={941}
          src={post.coverImage.src}
          width={1672}
        />
```

No `loading="lazy"` on the article-page cover. `tests/assets/blog-cover-images.test.ts` asserts:

- article-card images: `loading="lazy"`
- article-detail cover: **not** `loading="lazy"`

There is **no** `fetchPriority` on blog covers in this repo. Do not add `loading="lazy"` to the header cover. Do not change `BlogArticleContent` to add it.

Inline `<img>` inside the article body **must** use `loading="lazy"` (crop/rancher figures do).

Collection pages (`/blog`, `/zh/blog`) lazy-load every card cover.

## Metadata, canonical, hreflang, sitemap, llms.txt

### Per-article metadata (already wired)

`generateMetadata` in `app/(en)/[slug]/page.tsx` / `app/zh/[slug]/page.tsx` calls `createPublicPageMetadata` with:

- `title`: `post.title`
- `description`: `post.description`
- `openGraphType`: `"article"`
- `socialImagePath`: `post.coverImage.src`
- `robots`: `{ index: true, follow: true }`

`createPublicPageMetadata` (`src/seo/page-metadata.ts`) sets:

- `alternates.canonical`: `https://stardewvalleyplanner.art/{slug}` or `https://stardewvalleyplanner.art/zh/{slug}`
- `alternates.languages`: `en`, `zh-CN`, `x-default` (x-default is the English URL)
- Open Graph `type: "article"`, `url` = canonical, `images` = absolute cover URL
- Twitter `card: "summary"` with the same cover

Example from `tests/routes/public-route-metadata.test.ts` for any registered slug:

- EN canonical `https://stardewvalleyplanner.art/${slug}`
- ZH canonical `https://stardewvalleyplanner.art/zh/${slug}`
- `hrefLang="en"` / `hrefLang="zh-CN"` / `hrefLang="x-default"`

G does not write metadata objects by hand. Filling the registry is the metadata slot.

### JSON-LD

Pages call `createArticleStructuredData` with `headline`, `description`, `pathname`, `locale`. They do **not** pass `imagePathname`. Emitted type is `Article` only.

`tests/seo/page-structured-data.test.ts` forbids `author`, `datePublished`, `dateModified`, `publisher`, and other invented identity fields. Do not add FAQPage. Do not invent publish dates to “complete” Article schema.

### Sitemap

`app/sitemap.ts`:

```7:10:app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
  }));
}
```

No `lastmod`. Contact is excluded (`noindexCanonicalPublicPaths`). After adding a slug, rebuild so `out/sitemap.xml` gains two `<loc>` values.

### `public/llms.txt`

This file is the source. Static export copies it to `out/llms.txt`. Tests read **`out/llms.txt`**, so they need a build after the edit.

Append one bullet per locale, same shape as rancher:

```
- [Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair](https://stardewvalleyplanner.art/rancher-or-tiller-stardew): Tiller's 10% and Rancher's 20% multiply different goods. …
```

Chinese section uses `/zh/{slug}` and the Chinese title + description. Title and description must match the registry.

## Identity test pattern

Copy `tests/blog/rancher-or-tiller-stardew-identity.test.ts` or `tests/blog/best-spring-crop-stardew-identity.test.ts`.

Required checks:

1. `isBlogPostSlug("{slug}") === true`
2. `blogPostCanonicalPaths` contains `/{slug}/` and `/zh/{slug}/`
3. Render both article functions with `renderToStaticMarkup(createElement(...))`
4. Assert locked-angle phrases that exist in **both** bodies (from the F lock, not paraphrased)

Rancher example:

```11:29:tests/blog/rancher-or-tiller-stardew-identity.test.ts
it("registers the shared rancher or tiller article identity for both locales", () => {
  expect(isBlogPostSlug("rancher-or-tiller-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/rancher-or-tiller-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/rancher-or-tiller-stardew/");
});

it("exposes the locked rancher or tiller angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(RancherOrTillerStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(RancherOrTillerStardewChineseArticle),
  );

  expect(englishMarkup).toContain("This click locks your Farming 10 pair");
  expect(englishMarkup).toContain("It does not pick professions");
  expect(chineseMarkup).toContain("5 级这一选会锁住 10 级");
  expect(chineseMarkup).toContain("白天技能栏里选不了");
});
```

Spring crop also asserts the planner-sketch phrases (`Sketch the spring bed in the planner` / `先在规划器里画出春季那块田`).

`static-public-pages.test.ts` article fixtures should reuse those same locked phrases plus `articleOnlySchema: true`.

## Content format constraints

- One bilingual identity, two body modules, one shared `[slug]` route per locale.
- No new `app/**/page.tsx`.
- No Markdown-as-page, no parallel preview site.
- Body is TSX, not MDX.
- Links are raw `<a href="...">`, not `next/link`.
- H1 is registry `title`; description appears above the cover via `BlogArticleContent`.
- Do not put `[confirm:`, `[待确认：`, Search intent, 目标关键词, 本文将, In conclusion, Let’s dive in the body (`blog-article-content.test.tsx` contract on older articles; keep it for the new one).
- Do not link `/farm-comparison`, `/mods`, `/farm/` (removed public pages).
- Public references use real wiki/planner URLs from the locked handoff. English wiki in recent crop articles: `https://stardewvalleywiki.com/…`. Chinese: `https://zh.stardewvalleywiki.com/…`.
- V7 (`/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md` §五, `04-公开交接与页面装配.md`): G assembles locked handoff into this project; G does not rewrite body, invent authors/dates/URLs, or drop media “for later.”

## Exact verification commands

`package.json`:

```json
"dev": "sh scripts/dev.sh",
"build": "next build",
"pretest": "NEXT_TELEMETRY_DISABLED=1 pnpm build",
"test": "vitest",
"typecheck": "tsc --noEmit"
```

**Do not run `pnpm test`.** `pretest` always runs a full `next build`.

### Typecheck (no build)

```sh
pnpm typecheck
```

### Vitest without pretest (no build)

These files import source, not `out/`:

```sh
pnpm exec vitest run \
  tests/blog/{slug}-identity.test.ts \
  tests/blog/blog-post-registry.test.ts \
  tests/blog/blog-home-state.test.ts \
  tests/blog/blog-direct-reader-voice.test.tsx \
  tests/blog/blog-sources.test.tsx \
  tests/blog/blog-article-content.test.tsx \
  tests/assets/blog-cover-images.test.ts \
  tests/i18n/public-route-registry.test.ts \
  tests/seo/canonical-public-routes.test.ts \
  tests/routes/blog-routes.test.tsx \
  tests/routes/public-route-metadata.test.ts
```

`blog-cover-images.test.ts` reads `public/blog/*.webp` directly.

`blog-routes.test.tsx` and `public-route-metadata.test.ts` render the existing `[slug]/page.tsx` modules; they do not need `out/`.

### Vitest that **does** need `out/` (build first, still not `pnpm test`)

```sh
NEXT_TELEMETRY_DISABLED=1 pnpm build
pnpm exec vitest run \
  tests/routes/sitemap-robots.test.ts \
  tests/routes/llms.test.ts \
  tests/routes/static-routes.test.ts \
  tests/routes/static-public-pages.test.ts \
  tests/routes/removed-public-pages.test.ts
```

`llms.test.ts` and sitemap tests read `out/llms.txt` and `out/sitemap.xml`. Editing only `public/llms.txt` without a rebuild leaves those tests on stale `out/` files.

## Local dev server and real port

`scripts/dev.sh`:

```sh
DEV_PORT=3003
sh "$script_dir/free-listen-port.sh" "$DEV_PORT"
exec next dev --port "$DEV_PORT"
```

Start:

```sh
pnpm dev
```

Address:

- `http://127.0.0.1:3003/{slug}`
- `http://127.0.0.1:3003/zh/{slug}`
- index: `http://127.0.0.1:3003/blog` and `http://127.0.0.1:3003/zh/blog`

`next.config.ts` `allowedDevOrigins: ["127.0.0.1"]`. Use `127.0.0.1`, not a made-up host.

`free-listen-port.sh` **kills whatever is already listening on 3003**. If this repo’s `next dev` is already healthy on 3003, do **not** run `pnpm dev` again; open the article URLs on the existing server. If you do run `pnpm dev`, it will terminate the old listener, then start a new one on 3003.

This spec does not claim a server is running now. G must start or reuse one and report the real URLs.

## What G must not do

- Overwrite an occupied slug, including `best-spring-crop-stardew`.
- Choose a slug by silently replacing an old article.
- Invent `author`, publish dates, `datePublished`, or a fake byline. Use `Stardew Valley Planner Team` / `星露谷规划器团队`.
- Create `app/{slug}/page.tsx`, `app/zh/{slug}/page.tsx`, or any extra route tree.
- Create a parallel demo site, static HTML preview, or Markdown page and call it the finished article.
- Add `FAQPage` / `BlogPosting` JSON-LD.
- Use `next/image`, lazy-load the article cover, or skip in-article figures.
- Ship a non-VP8 WebP (lossless/extended) and expect cover tests to pass.
- Put trailing slashes on canonical public pathnames (`/slug/` is only an identity string).
- Run `pnpm test` (it builds the whole site first).
- Rewrite locked body text, captions, or source URLs. Assembly binds assets and project components; it does not invent content (`04-公开交接与页面装配.md`).
- Research summer crops or write the article body. That is not this interface job.

## Assembly checklist (after F lock)

1. Receive locked slug, titles, descriptions, body TSX-equivalent, figure list, alt/caption, sources, FAQ.
2. Append slug to identities; add `blog-copy` paths; register both locale objects with locked metadata.
3. Write `{slug}.en.tsx` / `{slug}.zh.tsx` using `BlogFaqList`, `BlogSources`, `blog-data-table`, `blog-article-media`, `blog-planner-link`.
4. Place VP8 WebP cover + illustrations under `public/blog/`.
5. Update `public/llms.txt`.
6. Update identity test + every hardcoded slug/count test listed above.
7. `pnpm typecheck` and `pnpm exec vitest run` on the no-build set.
8. `NEXT_TELEMETRY_DISABLED=1 pnpm build` then the `out/` vitest set.
9. Start or reuse `http://127.0.0.1:3003` and open both locale article URLs.
