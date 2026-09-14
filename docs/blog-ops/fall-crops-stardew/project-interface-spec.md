# Project interface spec: add one bilingual blog post (`fall-crops-stardew`)

This is the ProjectInterfaceSpec for Agent G. It describes how this existing website publishes **one** English + Simplified Chinese blog post. It does not contain article body, titles, or crop facts.

Slug is **user-locked**: `fall-crops-stardew`. Do not invent another slug. Do not occupy any other slug.

Mode: project-write later by Agent G. This file is the interface contract, not the article.

The summer spec at `docs/blog-ops/summer-crops-stardew/project-interface-spec.md` is **stale** (it still talks about 14 slugs / rancher as last). Counts below were recounted from current `main` source and tests, not copied from that file.

## Project

| Item | Value |
|---|---|
| Project path | `/Users/wusir/Desktop/开发项目集合/stardew planner` |
| Production site | `https://stardewvalleyplanner.art/` |
| Package manager | `pnpm` (`package.json` `packageManager`: `pnpm@10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c`) |
| Node | `>=20.9.0` |
| App | Next.js `16.3.0`, App Router, `output: "export"` in `next.config.ts` |
| Images | `images: { unoptimized: true }` — articles use plain `<img>`, not `next/image` |
| Dev origins | `allowedDevOrigins: ["127.0.0.1"]` |
| Locales | `en`, `zh-CN` (`src/i18n/public-locale.ts` `publicLocales`) |
| Article template | Shared `app/(en)/[slug]/page.tsx` and `app/zh/[slug]/page.tsx` |
| Locked slug | `fall-crops-stardew` |

Do not create a second site, a demo HTML page, or a new `app/**/page.tsx` per article.

## Locales and URL pattern

Public canonical pathnames have **no trailing slash** except `/`. `createCanonicalUrl` in `src/seo/public-site-url.ts` throws if a non-root pathname ends with `/`.

| Locale | Public article URL | Public blog index |
|---|---|---|
| `en` | `/fall-crops-stardew` | `/blog` |
| `zh-CN` | `/zh/fall-crops-stardew` | `/zh/blog` |

Chinese public prefix is `/zh`, not `/zh-CN`.

Production examples of the same template:

- `https://stardewvalleyplanner.art/rancher-or-tiller-stardew`
- `https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew`
- `https://stardewvalleyplanner.art/best-spring-crop-stardew`
- `https://stardewvalleyplanner.art/summer-crops-stardew`

`src/blog/blog-post-identities.ts` also exports identity strings **with** a trailing slash (`/summer-crops-stardew/`, `/zh/summer-crops-stardew/`). Those are registry identity values, not public canonical pathnames. After this post they become `/fall-crops-stardew/` and `/zh/fall-crops-stardew/`.

## Occupied slugs (do not overwrite)

Current `blogPostSlugs` in `src/blog/blog-post-identities.ts`, publishing order oldest → newest. **15 slugs. Last is `summer-crops-stardew`.**

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
15. `summer-crops-stardew`

Append `fall-crops-stardew` at the **end** (16th). Registry order must match this array index-for-index in both locales (`validateBlogPostRegistry` throws `Invalid blog post order for ${locale}. Expected: ${expectedSlug}. Received: ${slug}.`).

Home “latest articles” reverse that array (`getBlogHomeState` in `src/blog/blog-home-state.ts`). Default visible count is 6. After append, the newest-six cards become:

1. `fall-crops-stardew`
2. `summer-crops-stardew`
3. `rancher-or-tiller-stardew`
4. `how-to-earn-money-stardew`
5. `best-spring-crop-stardew`
6. `maple-tree-stardew`

`stardew-valley-trees` drops off the default six. Topic carousel stays canonical (oldest → newest) and will list all 16.

Do **not** occupy `best-fall-crops-stardew`. That string appears only as a planned path in `docs/seo/cluster-plan.json`. It is not a live slug. The locked public slug is `fall-crops-stardew`.

## Do not add a new App Router page

Articles are **not** `app/fall-crops-stardew/page.tsx`. Both locales already enumerate every `blogPostSlugs` value:

```24:28:app/(en)/[slug]/page.tsx
export function generateStaticParams(): { slug: BlogPostSlug }[] {
  return blogPostSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;
```

Chinese: `app/zh/[slug]/page.tsx`, same `generateStaticParams` + `dynamicParams = false`. Unknown slugs call `notFound()`.

Next.js 16 notes that already match this repo (`node_modules/next/dist/docs/`):

- `page.tsx` / `generateMetadata` `params` is a `Promise` and must be `await`ed (`01-app/03-api-reference/03-file-conventions/page.md`, `01-app/03-api-reference/04-functions/generate-metadata.md`). Both page files already `await params`.
- `generateStaticParams` fills `[slug]` at `next build` (`01-app/03-api-reference/04-functions/generate-static-params.md`).
- `dynamicParams = false` 404s slugs not returned by `generateStaticParams` (`01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md`).
- `output: "export"` emits `out/{slug}.html` and `out/zh/{slug}.html` (`01-app/02-guides/static-exports.md`). This repo does **not** set `trailingSlash: true`, so the files are `out/fall-crops-stardew.html` and `out/zh/fall-crops-stardew.html`, not `.../index.html`.

G must **not** edit those two page files. Registering the slug is enough for routing.

`app/sitemap.ts` maps `getLocalizedIndexablePublicRouteEntries()` and needs no per-article edit. `src/i18n/public-route-registry.ts` already spreads `blogPostSlugs` into `/blog`, `/blog/archive`, and `/${slug}`.

## Files G must create vs edit vs must not edit

PascalCase from this repo: `SummerCropsStardewEnglishArticle`, `RancherOrTillerStardewEnglishArticle`, `BestSpringCropStardewEnglishArticle`. For this slug:

- `FallCropsStardewEnglishArticle`
- `FallCropsStardewChineseArticle`

### Create

| File | Why |
|---|---|
| `src/blog/articles/fall-crops-stardew.en.tsx` | English body module |
| `src/blog/articles/fall-crops-stardew.zh.tsx` | Chinese body module |
| `public/blog/fall-crops-stardew-cover.webp` | Shared cover (both locales). Public src: `/blog/fall-crops-stardew-cover.webp` |
| `public/blog/illustrations/{name}.webp` | In-article figures from the F lock. Cover-only is not a finished illustrated post |
| `tests/blog/fall-crops-stardew-identity.test.ts` | Identity + locked-angle test |

Do not invent illustration filenames here. Use the F-lock figure list. Recent crop posts ship **two** 1672×941 VP8 WebP figures under `public/blog/illustrations/`.

### Edit (source)

| File | Why |
|---|---|
| `src/blog/blog-post-identities.ts` | Append `"fall-crops-stardew"` to `blogPostSlugs` |
| `src/blog/blog-copy.ts` | Add `en` `/fall-crops-stardew` and `zh-CN` `/zh/fall-crops-stardew` to `localizedBlogPostPaths` |
| `src/blog/blog-post-registry.tsx` | Import both article functions; append matching `en` and `zh-CN` registry objects **after** `summer-crops-stardew` |
| `public/llms.txt` | Add both language bullets under Planning guides / 农场规划指南 |

`blog-copy.ts` is typed `Record<BlogPostSlug, string>`. Adding a slug without both path entries fails `pnpm typecheck`.

`getLocalizedBlogPostHref` throws if a locale/slug pair is missing:

```155:165:src/blog/blog-copy.ts
  const localizedPath = localizedBlogPostPaths[locale]?.[slug];

  if (localizedPath === undefined) {
    throw new Error(
      `Unsupported localized blog post route. Received locale=${JSON.stringify(locale)}, slug=${JSON.stringify(slug)}.`,
    );
  }
```

### Edit (tests that hardcode the current 15-slug world)

These **fail** if the new identity is registered and the hardcoded list/count is left at 15 / 30 / 21 / 42 / 40.

| File | What breaks |
|---|---|
| `tests/blog/blog-post-registry.test.ts` | `expectedSlugs` exact match; test titles “fifteen” / “thirty”; identity-path arrays; `expectedCoverPaths`; reverse-order error currently names `summer-crops-stardew` as last; `createCompleteRegistry()` must include the new slug; add `englishPosts[15]` / `chinesePosts[15]` metadata objects |
| `tests/blog/blog-home-state.test.ts` | Newest-six currently starts with `summer-crops-stardew`; `totalPostCount` is `15`; carousel lists all 15 slugs |
| `tests/i18n/public-route-registry.test.ts` | `canonicalPublicPaths` length `21`; localized entries `42`; indexable `40`; add `/fall-crops-stardew` and `/zh/fall-crops-stardew` path asserts |
| `tests/seo/canonical-public-routes.test.ts` | `canonicalPublicPaths` length `21`; `expectedBlogCanonicalPaths` must include `/fall-crops-stardew` |
| `tests/routes/sitemap-robots.test.ts` | sitemap `<loc>` count `40`; `expectedBlogSitemapPathnames` |
| `tests/routes/removed-public-pages.test.ts` | lengths `21` / `42` / `40`; sitemap `<loc>` count `40` |
| `tests/routes/llms.test.ts` | After identities change, the loop requires `public/llms.txt` (copied to `out/llms.txt`) to contain `](https://stardewvalleyplanner.art/fall-crops-stardew)` and the `/zh/` pair. Add explicit `toContain` lines the same way summer/rancher are listed |
| `tests/assets/blog-cover-images.test.ts` | Cover + illustration VP8 WebP budget; test currently named “fifteen blog identities” and names every cover file through `summer-crops-stardew-cover.webp`; add a fall media-expectation block like `summerCropsArticleMediaExpectations` |

### Edit (tests that will not auto-fail on count, but must cover the new post)

| File | Why G still edits it |
|---|---|
| `tests/blog/blog-direct-reader-voice.test.tsx` | Fixture arrays of article components; omitted articles are not scanned |
| `tests/blog/blog-sources.test.tsx` | `articleSourceExpectations` must include both locales’ `BlogSources` href/label/note/order/heading/`checkedLabel` |
| `tests/routes/blog-routes.test.tsx` | Index href `toContain('href="/fall-crops-stardew"')` and `/zh/…`; add a paired-metadata test like the summer block at slug `summer-crops-stardew` |
| `tests/routes/static-public-pages.test.ts` | Add EN + ZH article fixtures with `articleOnlySchema: true`; add the new cover to `/blog` and `/zh/blog` `coverImages` |
| `tests/routes/static-routes.test.ts` | Add `fall-crops-stardew.html` and `zh/fall-crops-stardew.html` to `expectedStaticPageFiles` |

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

Also do not edit occupied article modules, `docs/seo/cluster-plan.json`, or this spec as a substitute for assembly.

`tests/routes/public-route-metadata.test.ts` already loops `blogPostSlugs`. Run it; do not hardcode a 16th slug there unless a new assertion is needed.

`tests/blog/blog-article-content.test.tsx` only imports older articles. Run it as regression. Do not force a new fixture into it unless the F lock requires a contract that file already encodes.

## Registry metadata contract

`BlogPostMeta` in `src/blog/blog-post-registry.tsx`:

```46:59:src/blog/blog-post-registry.tsx
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

- `slug`: `"fall-crops-stardew"`
- `author` English: `Stardew Valley Planner Team`
- `author` Chinese: `星露谷规划器团队`
- `featured`: `true` for **every** post (`englishPosts.every((post) => post.featured)`)
- `topic` English: `Stardew Valley Guides`
- `topic` Chinese: `星露谷物语指南`
- `readTimeMinutes`: positive integer; locales may differ (rancher is `11` en / `9` zh-CN)
- `coverImage.src`: `/blog/fall-crops-stardew-cover.webp` (same file both locales)
- `coverImage.alt`: non-empty, **trimmed length ≥ 8**, describes the picture
- `title` / `description`: from F lock; they become `<title>`, meta description, Open Graph, H1, and Article JSON-LD `headline`/`description`

Do **not** invent a different author. There is **no** `datePublished` field. JSON-LD Article also has no dates.

Copy the **shape** of the last registry objects (`summer-crops-stardew` in `src/blog/blog-post-registry.tsx`). Put F-lock strings in `title` / `description` / `readTimeMinutes` / `coverImage.alt`. This spec does not supply those strings.

`blog-copy.ts` path map example (append after the summer keys):

```ts
"fall-crops-stardew": "/fall-crops-stardew",
```

Chinese key in the same file:

```ts
"fall-crops-stardew": "/zh/fall-crops-stardew",
```

Registry validators Fail Fast and name the offending value (`Invalid readTimeMinutes for blog post ${slug}. Received: …`). Do not wrap them. Do not add a plugin/registry abstraction for a 17th post. Append one object per locale.

## Article module public exports and TSX conventions

Each locale is its **own** module. Do not share one component with an `if (locale)` branch.

Public export names:

- English: `export function FallCropsStardewEnglishArticle()`
- Chinese: `export function FallCropsStardewChineseArticle()`

Files:

- `src/blog/articles/fall-crops-stardew.en.tsx`
- `src/blog/articles/fall-crops-stardew.zh.tsx`

Interface examples (do not copy their bodies into this post):

- FAQ + sources wiring: `rancher-or-tiller-stardew.{en,zh}.tsx`, `best-spring-crop-stardew.{en,zh}.tsx`
- Sources without FAQ: `summer-crops-stardew.{en,zh}.tsx` — **not** the finished-article pattern for this post
- Latest identity-test wiring: `tests/blog/summer-crops-stardew-identity.test.ts`

### Root and headings

```tsx
export function FallCropsStardewEnglishArticle() {
  return (
    <article>
      <p>…opening paragraph from the F lock, no H1…</p>
      <h2>…</h2>
      …
    </article>
  );
}
```

- Body **must not** contain `<h1>`. Page H1 is `post.title` from `BlogArticleContent`.
- Start with `<article><p>…`, not a heading.
- Do not write author/SEO narration. `tests/blog/blog-direct-reader-voice.test.tsx` bans English patterns such as `this guide covers`, `the sections below`, `use this page`, and Chinese `本文`, `下面按`, `来源页面`, etc.

### Imports (real names)

From `src/blog/articles/*.tsx`:

```1:2:src/blog/articles/rancher-or-tiller-stardew.en.tsx
import { BlogFaqList } from "../../components/blog/blog-faq-list";
import { BlogSources } from "../../components/blog/blog-sources";
```

Same two imports in `best-spring-crop-stardew.en.tsx` / `.zh.tsx`. Summer imports **only** `BlogSources`. This post must import **both**.

`BlogFaqList` is a client component (`"use client"`). That is the existing pattern; article modules stay Server Components and render it as a child.

`BlogYouTubeVideo` exists (`src/components/blog/blog-youtube-video.tsx`) but rancher / spring / summer do **not** use it. Do not add YouTube unless the locked handoff requires it. Do not put a raw `youtube.com` iframe in the article.

Do not use `next/image`.

### Tables

Existing crop articles wrap tables like this:

```tsx
<div
  aria-label="…"
  className="blog-table-scroll"
  role="region"
  tabIndex={0}
>
  <table className="blog-data-table">
    <thead>
      <tr>
        <th scope="col">…</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>…</td>
      </tr>
    </tbody>
  </table>
</div>
```

CSS: `app/globals.css` `[data-blog-article] .blog-table-scroll` and `.blog-data-table`. Table contents come from the F lock, not this spec.

### In-article figures

Real crop-article pattern (`best-spring-crop-stardew.en.tsx` / `summer-crops-stardew.en.tsx`):

```tsx
<figure className="blog-article-media">
  <img
    alt="…"
    decoding="async"
    height="941"
    loading="lazy"
    src="/blog/illustrations/{name}.webp"
    width="1672"
  />
  <figcaption>…</figcaption>
</figure>
```

Inline images are **lazy**. Cover on the article page is **not** lazy (see LCP). Cover-only is not enough.

### Planner CTA class

Use `className="blog-planner-link"` only on **this site’s** planner/article links. CSS color is `#a3155b` (`app/globals.css`). Do not put that class on wiki URLs.

English examples from crop/rancher articles:

- `href="/#planner"`
- `href="/?farmType=standard"`
- `href="/sprinkler-stardew"`

Chinese:

- `href="/zh#planner"`
- `href="/zh?farmType=standard"`
- `href="/zh/sprinkler-stardew"`

Hash and query stay on the localized homepage path: `/#planner`, `/zh#planner` — not `/zh/#planner`.

Planner copy in recent articles states the tool is a placement sketch, fan-made, not affiliated with ConcernedApe / Stardew Valley, and does not water / compute gold / pick professions. Use the F-lock planner paragraph; do not invent a new disclaimer.

## FAQ and Sources (required on the finished article)

User-locked: the finished article **must** include on-page FAQ and 文末来源 via `BlogFaqList` + `BlogSources`.

Do **not** copy `summer-crops-stardew`’s sources-only ending. Summer is a valid sources example and a valid **non**-FAQ counterexample.

Live check (production template, 2026-09-14, ego-browser task space `fall-crops-stardew-interface` + HTML fetch of `https://stardewvalleyplanner.art/rancher-or-tiller-stardew`):

- `.blog-faq-list` present, 6 `.blog-faq-item` nodes
- `.blog-sources` present, heading `Sources`
- JSON-LD `@type` is `Article` only
- `"@type":"FAQPage"` is absent
- canonical is `https://stardewvalleyplanner.art/rancher-or-tiller-stardew` (no trailing slash)

### `BlogFaqList`

Real types and props (`src/components/blog/blog-faq-list.tsx`):

```ts
export type BlogFaqItem = Readonly<{
  question: string;
  answer: ReactNode;
}>;

type BlogFaqListProperties = Readonly<{
  items: readonly BlogFaqItem[];
}>;

export function BlogFaqList({ items }: BlogFaqListProperties)
```

There is **no** heading prop. Place a sibling heading, then the list.

English articles use `<h2>FAQ</h2>`. Chinese rancher uses `<h2>常见问题</h2>`. Chinese spring crop uses `<h2>FAQ</h2>`. Do not invent a third heading. Follow the F lock; if the lock is silent, match the crop-article pair (`best-spring-crop-stardew`).

Empty `items` throws:

`Blog FAQ list requires at least one item. Received: length 0.`

Missing question throws `Blog FAQ item ${faqIndex} is missing a question. Received: …`. Missing answer throws and names the question. Answer must not be `null` / `undefined` / `false` / blank. Use a `<p>` (or similar) as `answer`.

Usage shape (rancher English):

```tsx
<h2>FAQ</h2>
<BlogFaqList
  items={[
    {
      question: "…",
      answer: <p>…</p>,
    },
  ]}
/>
```

This is **on-page FAQ content**, not `FAQPage` JSON-LD.

### `BlogSources`

Real types and props (`src/components/blog/blog-sources.tsx`):

```ts
export type BlogSourceItem = Readonly<{
  href: string;
  label: string;
  note?: string;
}>;

type BlogSourcesProperties = Readonly<{
  checkedLabel?: string;
  heading: string;
  items: readonly BlogSourceItem[];
}>;

export function BlogSources({
  checkedLabel,
  heading,
  items,
}: BlogSourcesProperties)
```

Usage shape (rancher / spring / summer English):

```tsx
<BlogSources
  heading="Sources"
  checkedLabel="…"
  items={[
    { href: "https://stardewvalleywiki.com/…", label: "Stardew Valley Wiki: …" },
  ]}
/>
```

Chinese heading in crop/rancher/summer: `来源` (oak uses `资料来源`; do not invent a third heading unless matching that article). `checkedLabel` comes from the F lock; do not fabricate a check date.

`tests/blog/blog-sources.test.tsx` asserts href, label, optional note, **order**, heading, and `checkedLabel` for each listed article. Add English + Chinese entries for this slug.

Place FAQ, then Sources, at the end of the article body (rancher / spring order).

## Cover and illustration paths

| Role | Path | Notes |
|---|---|---|
| Cover | `public/blog/fall-crops-stardew-cover.webp` | Served as `/blog/fall-crops-stardew-cover.webp` |
| Inline | `public/blog/illustrations/{name}.webp` | Served as `/blog/illustrations/{name}.webp` |
| YouTube poster | `public/blog/video-posters/{name}.webp` | Only if F lock uses video; crop/rancher/summer do not |

Existing illustration examples (do not reuse as fall figures):

- `/blog/illustrations/year-1-spring-crop-calendar.webp`
- `/blog/illustrations/spring-giant-cauliflower-3x3.webp`
- `/blog/illustrations/rancher-or-tiller-profession-tree-en.webp`
- `/blog/illustrations/rancher-or-tiller-profession-tree-zh.webp`
- `/blog/illustrations/summer-crop-occupancy-calendar.webp`
- `/blog/illustrations/summer-hops-melon-blueberry-bed.webp`

Rancher uses **locale-specific** illustration files when the diagram contains words. Spring and summer use shared illustration files. Follow the F lock.

### Image format (enforced)

`tests/assets/blog-cover-images.test.ts` reads **VP8 lossy** WebP (`RIFF` / `WEBP` / chunk `VP8 `). VP8L (lossless) and VP8X (extended) fail with `Invalid VP8 WebP image at ${imagePath}.`.

| Asset | Dimensions | Byte budget | Aspect |
|---|---|---|---|
| Cover | width `1672`, height `941` | ≤ `1.25 * 1024 * 1024` | ~16:9 (`toBeCloseTo(16 / 9, 2)`) |
| Crop/rancher/summer inline illustrations | `1672` × `941` | ≤ `400 * 1024` | ~16:9 |

`<img>` must set `width={1672}` `height={941}` to match.

Alt: describe the actual picture. Caption (`figcaption`) is the reader-facing explanation. Do not stuff keywords into alt. Cover alt is also used on article cards.

A leftover `{slug}-cover.png` is not required. New covers are WebP only.

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

There is **no** `fetchPriority` on blog covers in this repo. Do not add `loading="lazy"` to the header cover. Do not change `BlogArticleContent`.

Inline `<img>` inside the article body **must** use `loading="lazy"`.

Collection pages (`/blog`, `/zh/blog`) lazy-load every card cover. The index also renders the topic carousel of **all** posts, so `/blog` static HTML currently contains every cover. After append, add the new cover + alt to both locale index fixtures.

## Metadata, canonical, hreflang, sitemap, llms.txt

### Per-article metadata (already wired)

`generateMetadata` in `app/(en)/[slug]/page.tsx` / `app/zh/[slug]/page.tsx` calls `createPublicPageMetadata` with:

- `title`: `post.title`
- `description`: `post.description`
- `openGraphType`: `"article"`
- `socialImagePath`: `post.coverImage.src`
- `robots`: `{ index: true, follow: true }`

`createPublicPageMetadata` (`src/seo/page-metadata.ts`) sets:

- `alternates.canonical`: `https://stardewvalleyplanner.art/fall-crops-stardew` or `https://stardewvalleyplanner.art/zh/fall-crops-stardew`
- `alternates.languages`: `en`, `zh-CN`, `x-default` (x-default is the English URL)
- Open Graph `type: "article"`, `url` = canonical, `images` = absolute cover URL
- Twitter `card: "summary"` with the same cover

G does not write metadata objects by hand. Filling the registry is the metadata slot.

### JSON-LD — Article, not FAQPage

Pages call `createArticleStructuredData` with `headline`, `description`, `pathname`, `locale`. They do **not** pass `imagePathname`. Emitted type is `Article` only (`src/seo/page-structured-data.ts`).

`tests/routes/static-public-pages.test.ts` `articleOnlySchema: true` forbids `"@type":"FAQPage"`, `"BlogPosting"`, `"QAPage"` and requires the page’s JSON-LD `@type` array to equal `["Article"]`.

`tests/seo/page-structured-data.test.ts` forbids `author`, `datePublished`, `dateModified`, `publisher`, and other invented identity fields.

This project does **not** currently emit `FAQPage`. Do not add it. On-page FAQ via `BlogFaqList` is enough.

### Sitemap

```7:10:app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return getLocalizedIndexablePublicRouteEntries().map(({ pathname }) => ({
    url: createCanonicalUrl(pathname),
  }));
}
```

No `lastmod`. Contact is excluded (`noindexCanonicalPublicPaths`). After adding the slug, rebuild so `out/sitemap.xml` gains two `<loc>` values:

- `https://stardewvalleyplanner.art/fall-crops-stardew`
- `https://stardewvalleyplanner.art/zh/fall-crops-stardew`

### `public/llms.txt`

This file is the source. Static export copies it to `out/llms.txt`. Tests read **`out/llms.txt`**, so they need a build after the edit.

Append one bullet per locale, same shape as the summer bullets already in that file. Title and description must match the registry. English URL uses `/fall-crops-stardew`. Chinese uses `/zh/fall-crops-stardew`.

## Identity test pattern

Copy `tests/blog/summer-crops-stardew-identity.test.ts` (latest) or `tests/blog/rancher-or-tiller-stardew-identity.test.ts`.

Required checks:

1. `isBlogPostSlug("fall-crops-stardew") === true`
2. `blogPostCanonicalPaths` contains `/fall-crops-stardew/` and `/zh/fall-crops-stardew/`
3. Render both article functions with `renderToStaticMarkup(createElement(...))`
4. Assert locked-angle phrases that exist in **both** bodies (from the F lock, not paraphrased)

`static-public-pages.test.ts` article fixtures should reuse those same locked phrases plus `articleOnlySchema: true`.

## Content format constraints

- One bilingual identity, two body modules, one shared `[slug]` route per locale.
- No new `app/**/page.tsx`.
- No Markdown-as-page, no parallel preview site.
- Body is TSX, not MDX.
- Links are raw `<a href="...">`, not `next/link`.
- H1 is registry `title`; description appears above the cover via `BlogArticleContent`.
- Do not put `[confirm:`, `[待确认：`, Search intent, 目标关键词, 本文将, In conclusion, Let’s dive in the body.
- Do not link `/farm-comparison`, `/mods`, `/farm/` (removed public pages).
- Public references use real wiki/planner URLs from the locked handoff. English wiki in recent crop articles: `https://stardewvalleywiki.com/…`. Chinese: `https://zh.stardewvalleywiki.com/…`.
- V7: G assembles locked handoff into this project; G does not rewrite body, invent authors/dates/URLs, or drop media “for later.”
- No Strategy pattern. No extra abstraction for a future 17th post. Append one slug, two modules, two registry objects.
- Fail Fast: keep existing validators; errors must name the offending value. No silent fallback slug.

## Updated numeric expectations after this 16th post

Computed from current tests, not from the stale summer spec.

| Quantity | Current (15th post world) | After append |
|---|---|---|
| `blogPostSlugs` | 15 | **16** |
| `blogPostCanonicalPaths` (trailing slash, ×2 locales) | 30 | **32** |
| `canonicalPublicPaths` (`/` + privacy + terms + contact + `/blog` + `/blog/archive` + articles) | 21 | **22** |
| `getLocalizedPublicRouteEntries()` (×2 locales) | 42 | **44** |
| Indexable / sitemap `<loc>` (contact noindex in both locales) | 40 | **42** |
| `expectedStaticPageFiles` HTML pages | 42 | **44** |
| Newest-six first slug | `summer-crops-stardew` | `fall-crops-stardew` |
| Reverse-order error `Received:` | `summer-crops-stardew` | `fall-crops-stardew` |

Current `canonicalPublicPaths` arithmetic: 4 fixed (`/`, `/privacy`, `/terms`, `/contact`) + 2 blog (`/blog`, `/blog/archive`) + 15 articles = 21. After: +1 article = 22. Localized 22 × 2 = 44. Indexable (22 − 1 contact) × 2 = 42.

`tests/blog/blog-post-registry.test.ts` reverse-order throw is currently:

`Expected: carpenter-stardew. Received: summer-crops-stardew.`

After append it must name `fall-crops-stardew`.

## Isolation

Public pages must **not** contain:

`V7-FALL-CROPS-CANARY-9f2c1e44`

Do not write that token into article modules, registry metadata, `public/llms.txt`, tests that render into `out/**/*.html`, or comments that could ship. This spec may mention it. After build, grep `out` and fail if it appears:

```sh
rg -F "V7-FALL-CROPS-CANARY-9f2c1e44" out
```

That command must print no matches.

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
  tests/blog/fall-crops-stardew-identity.test.ts \
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

Then:

```sh
rg -F "V7-FALL-CROPS-CANARY-9f2c1e44" out
```

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

- `http://127.0.0.1:3003/fall-crops-stardew`
- `http://127.0.0.1:3003/zh/fall-crops-stardew`
- index: `http://127.0.0.1:3003/blog` and `http://127.0.0.1:3003/zh/blog`

`next.config.ts` `allowedDevOrigins: ["127.0.0.1"]`. Use `127.0.0.1`, not a made-up host.

`free-listen-port.sh` **kills whatever is already listening on 3003**. If this repo’s `next dev` is already healthy on 3003, do **not** run `pnpm dev` again; open the article URLs on the existing server. If you do run `pnpm dev`, it will terminate the old listener, then start a new one on 3003.

This spec does not claim a server is running now. G must start or reuse one and report the real URLs.

## What G must not do

- Use any slug other than `fall-crops-stardew`, including `best-fall-crops-stardew`.
- Overwrite an occupied slug, including `summer-crops-stardew`, `rancher-or-tiller-stardew`, `best-spring-crop-stardew`.
- Invent `author`, publish dates, `datePublished`, or a fake byline. Use `Stardew Valley Planner Team` / `星露谷规划器团队`.
- Create `app/fall-crops-stardew/page.tsx`, `app/zh/fall-crops-stardew/page.tsx`, or any extra route tree.
- Create a parallel demo site, static HTML preview, or Markdown page and call it the finished article.
- Ship the article without `BlogFaqList` + `BlogSources`.
- Add `FAQPage` / `BlogPosting` JSON-LD.
- Use `next/image`, lazy-load the article cover, or skip in-article figures.
- Ship a non-VP8 WebP (lossless/extended) and expect cover tests to pass.
- Put trailing slashes on canonical public pathnames (`/fall-crops-stardew/` is only an identity string).
- Run `pnpm test` (it builds the whole site first).
- Rewrite locked body text, captions, or source URLs.
- Copy the stale summer spec’s 14-slug / 15-post arithmetic.
- Research fall crop numbers or write the article in this interface job.
- Leave `V7-FALL-CROPS-CANARY-9f2c1e44` in any public page.

## Assembly checklist (after F lock)

1. Receive locked slug `fall-crops-stardew`, titles, descriptions, body TSX-equivalent, figure list, alt/caption, sources, FAQ.
2. Append slug to identities; add `blog-copy` paths; register both locale objects with locked metadata; cover src `/blog/fall-crops-stardew-cover.webp`.
3. Write `fall-crops-stardew.en.tsx` / `fall-crops-stardew.zh.tsx` using `BlogFaqList`, `BlogSources`, `blog-data-table`, `blog-article-media`, `blog-planner-link`.
4. Place VP8 WebP cover + illustrations under `public/blog/`.
5. Update `public/llms.txt`.
6. Update identity test + every hardcoded slug/count test listed above.
7. `pnpm typecheck` and `pnpm exec vitest run` on the no-build set.
8. `NEXT_TELEMETRY_DISABLED=1 pnpm build` then the `out/` vitest set, then the canary grep.
9. Start or reuse `http://127.0.0.1:3003` and open both locale article URLs.
