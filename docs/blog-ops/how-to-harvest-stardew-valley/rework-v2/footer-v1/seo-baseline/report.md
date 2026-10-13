# how-to-harvest-stardew-valley SEO 基线

只读静态检查。没有跑 build、测试或浏览器，也没有改产品源码。历史 HTML、`out/` 导出和 page-r2 事实都标为 historic，不能当成当前浏览器 PASS。实现 Worker 在本审查期间追加了双语 FAQ / Sources；下面的标题结构取最后一次稳定源码快照。metadata 模块在此期间没有变。

最后一次正文快照：

- `src/blog/articles/how-to-harvest-stardew-valley.en.tsx` sha256 `cd190d416ffdbfdd3f430f9f03fd011a298237629cd3bdadb99641723fc2e5d7`，186 行
- `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx` sha256 `5b311ed05f8356219c634287cdc3f480625717278ab488a70665e865f1f088b9`，186 行
- `src/blog/blog-post-registry.tsx` sha256 `d038157140b517bd2e694909d55ec1eaa6809e1ed1db292c9ce7408aa87a8608`（审查期间未变）

检查了 22 项。4 项 missing：Article JSON-LD 的 image、author、date，以及封面 caption。封面 alt 是 present，不能和 caption 混称。其余为 present。当前页面 DOM 为 unverified。

## 结论表

| 项 | EN | ZH | 状态 |
| --- | --- | --- | --- |
| title | registry 第 457 行 | registry 第 833 行 | present |
| description | registry 第 458–459 行 | registry 第 834–835 行 | present |
| canonical | `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley` | `https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley` | present |
| hreflang `en` / `zh-CN` | 两条都指向上述一对 URL | 同左 | present |
| `x-default` | 英文 URL | 同左 | present |
| robots 可索引 | 页面 `index, follow`；`robots.txt` `Allow: /` | 同左 | present |
| Open Graph | title、description、url、type=`article`、image=封面 webp | 同结构，中文文案与中文 url | present |
| Twitter | `summary`，title、description、image=同一封面 | 同左 | present |
| JSON-LD `@type` | `Article` | `Article` | present |
| JSON-LD headline | 等于 title | 等于 title | present |
| JSON-LD url | 等于 canonical | 等于 canonical | present |
| JSON-LD image | 调用处未传 `imagePathname` | 同左 | missing |
| JSON-LD author | 函数无此字段 | 同左 | missing |
| JSON-LD `inLanguage` | `en` | `zh-CN` | present |
| JSON-LD date | 注册表无日期字段 | 同左 | missing |
| FAQPage / QAPage | 正文与 FAQ 组件都没有 | 同左 | absent，符合「不要 FAQPage」 |
| 封面 alt | registry 第 465 行，非空 | registry 第 841 行，非空 | present |
| 两张正文图 alt | 第 9、27 行，非空 | 第 9、27 行，非空 | present |
| 封面 caption | `BlogArticleContent` 没有 `figcaption` | 同左 | missing，与 alt 分开 |
| sitemap 此 slug | 生成函数和已有 `out/sitemap.xml` 都有两条 URL | 同左 | present（`out/` 为 historic 导出） |
| llms 此 slug | `public/llms.txt` 第 42、81 行 | 同左 | present |
| H1 / 标题层级 | 一个 H1，等于 title；其下 h2 / h3 | 同左 | present |

没有把全部 SEO 写成已完成。

## title 与 description

来源是 `src/blog/blog-post-registry.tsx`，由 `app/(en)/[slug]/page.tsx` 第 49–57 行和 `app/zh/[slug]/page.tsx` 第 54–62 行传给 `createPublicPageMetadata`。页面 `<h1>` 用同一个 `post.title`（`src/components/blog/blog-article-content.tsx` 第 21 行）。可见描述用同一个 `post.description`（第 22 行）。

英文：

- title：`How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe`
- description：`Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.`

中文：

- title：`星露谷物语怎么收作物：徒手、镰刀或斧头`
- description：`防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。`

这两句也写在 `rework-v2/en-seo.json`、`rework-v2/translation/zh-seo.json` 和 `public/llms.txt`。根 layout 的 title 是站点名字符串，没有 `title.template`。historic `verification-g/http-en-r2.html` 与 `http-zh-r2.html`（2026-10-13 21:08 +08）的 `<title>` 和 `meta description` 与上列字符串一致。那是旧 HTML，不是这次重新打开页面。

## canonical、hreflang、x-default

`createPublicLanguageAlternates`（`src/i18n/public-route-registry.ts` 第 95–102 行）对 canonical path `/how-to-harvest-stardew-valley` 产出：

- `en`：`https://stardewvalleyplanner.art/how-to-harvest-stardew-valley`
- `zh-CN`：`https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley`
- `x-default`：英文 URL

英文页 canonical 用 locale `en`。中文页 canonical 用 locale `zh-CN`，所以是 `/zh/...`。`createCanonicalUrl` 去掉末尾斜杠。slug 在 `blogPostSlugs` 第 26 行，不在 `noindexCanonicalPublicPaths`。

historic 两份 r2 HTML 的 `<link rel="canonical">` 和三条 `<link rel="alternate" hrefLang="...">` 与上面一致。

## robots

两处来源都允许索引：

- 文章页 `robots: { index: true, follow: true }`（英文 page 第 56 行，中文 page 第 61 行）
- `app/robots.ts` 第 8–11 行：`userAgent: "*"`，`allow: "/"`，sitemap 为 `https://stardewvalleyplanner.art/sitemap.xml`

`public/robots.txt` 不存在，这是动态路由，符合预期。已有导出 `out/robots.txt`（2026-10-13 21:09 +08，historic，本任务未重建）全文是：

```
User-Agent: *
Allow: /

Sitemap: https://stardewvalleyplanner.art/sitemap.xml
```

historic HTML 有 `<meta name="robots" content="index, follow"/>`。

## Open Graph 与 Twitter

`src/seo/page-metadata.ts` 第 42–54 行按入参组对象。本页传入 `openGraphType: "article"` 和 `socialImagePath: post.coverImage.src`。封面路径两边都是 `/blog/how-to-harvest-stardew-valley-cover.webp`。

英文对象：

- `openGraph.title` / `twitter.title`：英文 title
- `openGraph.description` / `twitter.description`：英文 description
- `openGraph.type`：`article`
- `openGraph.url`：英文 canonical
- `openGraph.images` / `twitter.images`：`https://stardewvalleyplanner.art/blog/how-to-harvest-stardew-valley-cover.webp`
- `twitter.card`：`summary`

中文只换 title、description 和 `openGraph.url`（中文 canonical）。图片 URL 相同。代码没有设置 `openGraph.locale` 或 `twitter.site`。

historic r2 HTML 的实际标签与该对象一致，例如英文：

- `og:title`、`og:description`、`og:url`、`og:type=article`
- `og:image` = `https://stardewvalleyplanner.art/blog/how-to-harvest-stardew-valley-cover.webp`
- `twitter:card` = `summary`，以及相同的 title、description、image

没有 `og:locale`。这是旧 HTML。

## Article JSON-LD

`createArticleStructuredData`（`src/seo/page-structured-data.ts` 第 77–90 行）只输出 `@context`、`@type`、`headline`、`description`、`url`、`inLanguage`、`isPartOf`。只有传入 `imagePathname` 才加 `image`。两个文章页都没有传 `imagePathname`、author 或日期（英文第 68–74 行，中文第 75–81 行）。注册表类型 `BlogPostMeta` 没有日期字段。页面上的作者是可见署名，没有进 JSON-LD。

因此当前源码会得到的英文对象是：

```json
{"@context":"https://schema.org","@type":"Article","headline":"How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe","description":"Gather parsnips and pumpkins by hand with right-click or X, cut kale and wheat with a scythe, and strike giant crops three times with any axe.","url":"https://stardewvalleyplanner.art/how-to-harvest-stardew-valley","inLanguage":"en","isPartOf":{"@id":"https://stardewvalleyplanner.art/#website"}}
```

中文把 headline、description、url 换成中文，`inLanguage` 为 `zh-CN`。没有虚构的 author、date 或 image。缺的是字段本身：image、author、date 均为 missing。

`BlogFaqList` 不输出 script。两篇正文没有 `FAQPage` 或 `QAPage`。JSON-LD 类型仍是 `Article`。historic r2 HTML 各有 1 个 JSON-LD，内容与上面相同，`FAQPage` 计数为 0。那份 HTML 生成于 FAQ 追加之前，不能证明追加之后的 DOM。

## 图片 alt 与封面 caption

三张图两边共用文件。本任务打开了三张 webp，像素都是 1672×941，与组件上的 `width` / `height` 一致。avif 旁路文件在磁盘上，本任务没有解码 avif。

| 图 | 文件 | EN alt | ZH alt | 与画面 |
| --- | --- | --- | --- | --- |
| 封面 | `/blog/how-to-harvest-stardew-valley-cover.webp` | 傍晚农场、耕地里的橙色南瓜、田块周围土路、南瓜旁木棚架 | 同义中文 | 画面里看得到灯、南瓜地、土路和旁边的木棚架 |
| 成熟作物 | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` | 土路旁耕地上的饱满橙色南瓜 | 同义中文 | 画面主体是土路旁的橙色南瓜 |
| 棚架 | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` | 两排木棚架、中间空土路、路旁紫色葡萄 | 同义中文 | 看得到木棚架、空路和紫色葡萄；画面里还有更多棚架行，alt 没有逐行列全 |

三组 alt 都非空，且中英各自对应同一张图。棚架 alt 是摘要，不是逐棵清点。

封面 caption 是另一件事。`BlogArticleContent` 第 26–31 行只渲染带 alt 的 `PublicPicture`，没有 `figure` / `figcaption`。两张正文图各自有 `figcaption`（英文第 16、34 行，中文第 16、34 行）。historic `comparison.json` 的 `coverCaptionRendered` 为 false；historic r2 HTML 只有 2 个 `figcaption`，都是正文图。封面 caption：missing。封面 alt：present。

historic HTML 还有一张 `alt=""` 的 `/favicon.png`，来自站点导航 `src/components/site-navigation-dock.tsx` 第 127 行，不是这篇文章的封面。

## sitemap 与 llms

sitemap 由 `app/sitemap.ts` 调用 `getLocalizedIndexablePublicRouteEntries()` 生成，没有单独的 `public/sitemap.xml`。该 slug 在可索引 slug 列表里，所以源码包含：

- `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley`
- `https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley`

已有 `out/sitemap.xml`（2026-10-13 21:09 +08，4946 字节，sha256 `33154132d65a4ce802230113e09b37ff1755e726e4f6f2c0dec44849decb5dc1`）含这两条 `<loc>`。文件里没有 `<lastmod>`，也没有 xhtml hreflang。这是既有导出，本任务没有重建。

`public/llms.txt` 第 42 行和第 81 行的标题、URL、描述与 registry 一致。`out/llms.txt` 与 `public/llms.txt` 字节相同（sha256 `3adfce0c1fecc043a9e31f7948eb43a6cd2df1d851838c96dc01998aa4d83abb`）。`out/` 那份是既有导出。

## H1 与标题层级

页面壳和导航没有第二个 h1。唯一 h1 在 `blog-article-content.tsx` 第 21 行，文本等于 title。正文组件再包一层 `<article>`，h1 在外层。

当前源码层级是 h1，然后 h2，其下 h3。英文 h2：何时可收、徒手收、镰刀、巨大作物和棚架、排错、FAQ、Sources。中文对应：怎么看出可以收、用手收、镰刀、巨大作物和棚架、对不上时先看症状、常见问题、来源。FAQ 的五个问题不是手写 h3；`BlogFaqList` 使用 Radix `AccordionHeader`，该组件在 `@radix-ui/react-accordion/dist/index.mjs` 里渲染 `Primitive.h3`。`BlogSources` 第 48 行把传入的 `Sources` / `来源` 渲染成 h2。`BlogPlannerCta` 没有 h1–h6。

historic r2 HTML 各有 1 个 `<h1>`，且没有 FAQ / Sources 这两个 h2。追加发生在那份 HTML 之后。当前 DOM 里的新标题未重新渲染，标为 unverified。

## 复验

不改文件时可以再读：

- registry 第 456–468 行与第 832–844 行
- 两个 `[slug]/page.tsx` 的 `generateMetadata` 和 `createArticleStructuredData` 调用
- `page-metadata.ts` 第 38–56 行，`page-structured-data.ts` 第 77–90 行
- `blog-article-content.tsx` 第 19–31 行
- 两篇正文的 alt、h2，以及 `blog-faq-list.tsx` 是否出现 `FAQPage`
- `public/llms.txt` 第 42、81 行
- `rg how-to-harvest-stardew-valley out/sitemap.xml`（只对已有导出）

当前页面要等实现稳定后的 live 复核。本报告不声称那次复核已经完成。

## 本任务命令

只读命令退出码都是 0：源码清单、historic head 提取、webp `sips`、figcaption 提取、Radix header 读取、最后一次正文哈希。没有 build、测试或浏览器。原始输出在同目录 `raw/`。
