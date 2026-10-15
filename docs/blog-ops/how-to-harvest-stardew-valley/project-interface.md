# ProjectInterfaceSpec：how to harvest stardew valley

本文件只记录已经读到的项目接口。它不带待发布正文，也不带内部污染标记。后续装配另有 Dispatch。本轮没有打开页面。

## 边界

- 关键词 `how to harvest stardew valley`。网站 `https://stardewvalleyplanner.art`。`locale=en`，`country=US`。中文以后从锁定英文直接翻译，不另做关键词研究。
- 模式是 project-write。本轮只做接口预检，不写文章、不改产品源码、不启动服务。
- Orca 显示名是「博客」。本轮只创建过这一个工作树。实际目录和分支都是 `博客-2`：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。
- 本树 HEAD 与 main 相同：`64a3b21b19444892654f98bc8042db4a95cbd1a8`（`64a3b21 Merge 对齐竞品: batch building fill and eraser previews`）。
- main 工作树在 `/Users/wusir/Desktop/开发项目集合/stardew planner`，短状态是 `## main...origin/main [ahead 5]`，没有未提交文件。另外两个工作树 `对齐竞品`、`文案` 本轮只读，没有改动。
- 公共 git 目录是 `/Users/wusir/Desktop/开发项目集合/stardew planner/.git`，本树 git 目录是 `.../.git/worktrees/博客-2`。
- V7 目录 `/Users/wusir/Desktop/博客-V7修订版` 里没有这份关键词的旧官方内容包。有的是工作流、参考规则、脚本、历史参考和一份无关验收样稿。记为无。

## 站点里文章怎么挂上

现有文章不是 Markdown 页面，而是两份 TSX，再登记进同一张表。以已经在线上的耕种经验文为例。

`src/blog/blog-post-identities.ts` 的 `blogPostSlugs` 现在有 24 个 slug，最后一个是 `oak-tree-vs-maple-stardew`。其中没有 `how-to-harvest-stardew-valley`。

`getBlogPostBySlug("en", "how-to-level-up-farming-stardew")` 读到的登记对象在 `src/blog/blog-post-registry.tsx`，字段是：

- `slug`: `how-to-level-up-farming-stardew`
- `title`: `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150`
- `description`: `Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.`
- `topic`: `Stardew Valley Guides`
- `author`: `Stardew Valley Planner Team`
- `readTimeMinutes`: `16`
- `coverImage.src`: `/blog/how-to-level-up-farming-stardew-cover.webp`
- `coverImage.alt`: 登记里的那句水彩封面描述
- `featured`: `true`
- `Content`: `HowToLevelUpFarmingStardewEnglishArticle`

中文同一 slug 的 `topic` 全表都是 `星露谷物语指南`，`author` 全表都是 `星露谷规划器团队`。这篇中文标题是 `星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150`。

公开函数：

- `isBlogPostSlug`：`src/blog/blog-post-identities.ts`
- `getBlogPostBySlug(locale, slug)`、`getAllBlogPosts(locale)`、`validateBlogPostRegistry`：`src/blog/blog-post-registry.tsx`
- `getLocalizedBlogPostHref(locale, slug)`：`src/blog/blog-copy.ts`。路径表是手写的 `Record<BlogPostSlug, string>`，少一个 slug，类型检查过不了。
- `getLocalizedPublicPath(locale, canonicalPath)`：`src/i18n/public-route-registry.ts`。`en` 得到 `/how-to-level-up-farming-stardew`，`zh-CN` 得到 `/zh/how-to-level-up-farming-stardew`。
- `createPublicPageMetadata`：`src/seo/page-metadata.ts`。canonical、hreflang（`en`、`zh-CN`、`x-default`）和 Open Graph 都从这里出。
- `createArticleStructuredData`：`src/seo/page-structured-data.ts`。类型是 `Article`。文章页现在没有传入 `imagePathname`，所以 JSON-LD 里没有 `image`。
- `createCanonicalUrl`：`src/seo/public-site-url.ts`。路径必须以 `/` 开头，除了根路径不能以 `/` 结尾。公开地址形如 `https://stardewvalleyplanner.art/how-to-level-up-farming-stardew`。

`blogPostCanonicalPaths` 里的身份字符串带尾斜杠，例如 `/how-to-level-up-farming-stardew/`。那是身份比较用的，不是公开 URL。

语言只有 `en` 和 `zh-CN`（`src/i18n/public-locale.ts`）。中文网址前缀是 `/zh`，不是 `/zh-CN`。

## 实际生成路由

不需要新的路由文件。两个动态段已经按 `blogPostSlugs` 生成：

- 英文：`app/(en)/[slug]/page.tsx`。`generateStaticParams()` 把每个 slug 收成 `{ slug }`。`dynamicParams = false`。页面用 `getBlogPostBySlug("en", slug)`，找不到就 `notFound()`。外壳是 `PublicPageShell`，正文是 `BlogArticleContent`，JSON-LD 是 `createArticleStructuredData`。
- 中文：`app/zh/[slug]/page.tsx`。同一套，locale 常量是 `zh-CN`，对外路径用 `getLocalizedPublicPath`。

因此新 slug 一旦按同样顺序写进 `blogPostSlugs` 和两份登记，构建会多出：

- `/how-to-harvest-stardew-valley`
- `/zh/how-to-harvest-stardew-valley`

`app/sitemap.ts` 调用 `getLocalizedIndexablePublicRouteEntries()`。`/contact` 是 noindex，不进 sitemap。博客索引是 `/blog` 和 `/zh/blog`。

`next.config.ts` 已是 `output: "export"`、`images.unoptimized: true`。静态导出说明在 Next 16.3.0 文档 `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`：`trailingSlash` 仍是注释掉的可选项。本项目公开 URL 不带尾斜杠。

## 双语模板和媒体组件

英文模板文件：`src/blog/articles/how-to-level-up-farming-stardew.en.tsx`，导出 `HowToLevelUpFarmingStardewEnglishArticle`。中文对应 `how-to-level-up-farming-stardew.zh.tsx`，导出 `HowToLevelUpFarmingStardewChineseArticle`。

正文组件自己返回 `<article>`。页面外壳 `BlogArticleContent`（`src/components/blog/blog-article-content.tsx`）再包一层 `<article data-blog-article="true">`，并渲染 H1、描述、作者和封面。封面调用：

```tsx
<PublicPicture alt={post.coverImage.alt} height={941} src={post.coverImage.src} width={1672} />
```

这张封面没有 `loading="lazy"`，按现在的组件它是首屏图。

`PublicPicture`（`src/components/public-picture.tsx`）只接受以 `.webp` 结尾的 `src`。`createPublicAvifSource` 把同一路径的后缀换成 `.avif`。传别的后缀会抛出带收到值的 `TypeError`。

正文图沿用这篇经验文的写法：`<figure className="blog-article-media">` 里放 `PublicPicture`，带 `decoding="async"`、`loading="lazy"`、`width="1672"`、`height="941"`，下面是 `<figcaption>`。来源列表用 `BlogSources`（`src/components/blog/blog-sources.tsx`）。

视频组件是 `BlogYouTubeVideo`（`src/components/blog/blog-youtube-video.tsx`）。它先显示海报，点击后才把 iframe 指到 `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&rel=0`。视频 ID 必须匹配 11 位，否则抛出带收到值的错误。温室布局文在用它。收获文没有交接前的视频，就不要加这个组件。

封面测试 `tests/assets/blog-cover-images.test.ts` 把已列入的封面定为 1672×941、不超过 1.25 MiB。测试标题仍写 twenty-two，名单里没有 `stardew-fruit` 和 `oak-tree-vs-maple-stardew` 的封面。新封面不会被这个测试自动检查。

## 新文件名

产品文件用 slug `how-to-harvest-stardew-valley`：

- `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`，导出 `HowToHarvestStardewValleyEnglishArticle`
- `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`，导出 `HowToHarvestStardewValleyChineseArticle`
- `public/blog/how-to-harvest-stardew-valley-cover.webp`
- `public/blog/how-to-harvest-stardew-valley-cover.avif`
- 正文图如果画面里有文字，沿用橡树对比文的语言后缀，例如 `public/blog/illustrations/oak-tree-vs-maple-stardew-en-names.webp` 和对应 `.avif`。具体图名等媒体交接，本轮不造图名。

登记时把新 slug 追加在 `oak-tree-vs-maple-stardew` 后面。`validateBlogPostRegistry` 要求 `blogPostSlugs` 的下标和英、中两份数组的下标一致，错了会抛出 `Expected` 和 `Received`。

## 最小装配允许改的文件

后续装配才能改这些。本轮没有改。

必须改，否则新路由不存在或类型检查失败：

- `src/blog/blog-post-identities.ts`：`blogPostSlugs` 追加 slug。
- `src/blog/blog-post-registry.tsx`：两头 import，英文数组和中文数组各追加一条，顺序与 slug 表相同。
- `src/blog/blog-copy.ts`：`localizedBlogPostPaths.en` 写 `/how-to-harvest-stardew-valley`，`zh-CN` 写 `/zh/how-to-harvest-stardew-valley`。
- `public/llms.txt`：英文段（`## English`，第 5 行）和中文段（`## 简体中文`，第 43 行）各加一行公开 URL。

上面四个加上两份文章 TSX 和封面 webp/avif，就是页面能打开所需的最小集合。路由文件、sitemap、robots 不用改，它们已经读 slug 表。

登记后现有测试会失败，后续装配要改这些测试：

- `tests/blog/blog-post-registry.test.ts` 第 72–73 行要求 `blogPostSlugs` 精确等于 24 个 slug 的 `expectedSlugs`。
- `tests/i18n/public-route-registry.test.ts` 第 11 行要求 `canonicalPublicPaths` 长度为 30，第 163 行要求本地化路径 60 条，第 164 行要求可索引路径 58 条。来源是 4 条固定页（`/`、`/privacy`、`/terms`、`/contact`）加 `/blog`、`/blog/archive` 加 24 篇文章。两种语言是 60 条；去掉两条 contact 是 58 条。多一篇后应是 31、62、60。
- `tests/seo/canonical-public-routes.test.ts` 第 32 行同样要求长度 30。`canonicalPublicPaths` 是从 `src/seo/canonical-public-routes.ts` 再导出的。
- `tests/blog/blog-home-state.test.ts` 第 60 行要求 `totalPostCount` 为 24，第 62 和 83 行要求专题页数为 2，第 52–59 行要求最新 6 篇以 `oak-tree-vs-maple-stardew` 开头。`topicArticlesPageSize` 是 12，`defaultVisiblePostCount` 是 6，最新条是登记顺序的反转。25 篇会变成 3 个专题页。新 slug 若追加在末尾，最新 6 篇不再包含 `last-day-to-plant-stardew`。第 100–103 行把 `page=99` 夹到第 2 页，之后应夹到第 3 页。
- `tests/routes/blog-routes.test.tsx` 第 54 行和第 92 行要求博客首页 HTML 含有 `/last-day-to-plant-stardew` 和 `/zh/last-day-to-plant-stardew`。首页同时渲染最新 6 篇（`homeState.posts`）和专题第 1 页 12 篇（`topicCarouselPosts`，`src/components/blog/blog-index-content.tsx`）。`last-day-to-plant-stardew` 不在前 12 个 slug 里，它只靠最新 6 篇出现在首页。追加新 slug 后这条断言会失败。

`public/llms.txt` 为什么必须改：`tests/routes/llms.test.ts` 第 145–149 行对每条可索引路径检查 `out/llms.txt` 里有 `](绝对URL)`。静态导出会把 `public/` 拷到 `out/`。测试读的是 `out/llms.txt`，不是 `public/llms.txt`。本轮禁止构建，所以没有生成 `out`。`llms.test.ts` 本身不必为了这条循环再写一条 expect。

这些固定名单不必为了新 slug 去改，证据如下：

- `tests/routes/sitemap-robots.test.ts` 的 `expectedBlogSitemapPathnames` 只用 `toContain`。条数比对的是现场的 `getLocalizedIndexablePublicRouteEntries()` 和构建后的 `out/sitemap.xml`。
- `tests/routes/static-routes.test.ts` 的 `expectedStaticPageFiles` 是「这些文件必须存在」，不是目录全等。名单里已经没有 `stardew-fruit.html`。
- `tests/scripts/production-seo-smoke.test.mjs` 第 395–409 行的 32 条 HTML 和 30 条 sitemap 是夹具自己比自己，不读取 `blogPostSlugs`。

不要改产品源码以外的旧 `docs/blog-ops` 记录，不要改 `AGENTS.md`。

## 主题重叠

没有同 slug，也不要覆盖这些页。它们用到 harvest，但读者任务不同：

- `how-to-level-up-farming-stardew`：收获是耕种经验的来源，不是教人怎么收。
- `last-day-to-plant-stardew`：算最晚哪天下种，才能在第 28 天收到。
- `what-to-grow-in-greenhouse-stardew`：按首收等待和再生节奏选温室作物。标题是 `What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting`。
- `glasshouse-stardew-valley`：温室修复、10×12 和洒水器。标题是 `Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers`。
- `best-spring-crop-stardew`、`summer-crops-stardew`、`fall-crops-stardew`：当季种什么和金/天。
- `how-to-earn-money-stardew`：第一年手头能花的金。
- `stardew-fruit`：先找到水果来源再买种子。
- `rancher-or-tiller-stardew`：5 级职业分支。

## 本地服务

本轮没有启动，也没有执行 `scripts/dev.sh`。

`package.json` 的 `dev` 是 `sh scripts/dev.sh`。该脚本把端口写死为 3003，先跑 `scripts/free-listen-port.sh`。那个脚本对占用进程发 CONT、TERM，等不到就 KILL。所以 `pnpm dev` 和 `pnpm dev -- --port 其他端口` 都会去释放 3003。后续不要用这两条。

直接启动要沿用脚本里的 `--webpack`，并显式绑本机。依据是本树 `node_modules/next/dist/docs` 里的：

- `01-app/03-api-reference/06-cli/next.md`：`next dev` 默认 Turbopack；`--webpack` 改回 Webpack；`-p` / `--port` 默认 3000；`-H` / `--hostname` 默认 `0.0.0.0`。
- `01-app/02-guides/local-development.md`：开发默认已经是 Turbopack。
- `01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md`：额外允许的开发来源。本项目 `next.config.ts` 写了 `allowedDevOrigins: ["127.0.0.1"]`。
- `01-app/03-api-reference/04-functions/generate-static-params.md`：`dynamicParams = false` 时，不在生成名单里的 slug 会 404。
- `01-app/02-guides/static-exports.md`：`output: 'export'`。

探测时（只读 `lsof`，没有杀进程）：

- `*:3003`：PID 81615，`next-server (v16.3.0)`，工作目录是 main 工作树。不要动。
- `[::1]:3002`：PID 86353，AI image editor 的 Vite。不要当这个网站，也不要杀。
- `127.0.0.1:3013`：PID 97774，`serve out --listen tcp://127.0.0.1:3013`，工作目录是 `文案` 工作树。不要动。
- 3004–3012 和 3014–3025 当时没有监听。3004 只是当时空闲，开服前要再查一次。

后续在本树执行，且先确认端口仍空闲：

```sh
pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3004
```

页面地址用 `http://127.0.0.1:3004/how-to-harvest-stardew-valley` 和 `http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`。不要用 `localhost` 代替已经写进配置的 `127.0.0.1`。浏览器验收要用 ego-browser，桌面和手机各看英文和中文。那不是本轮的事。

## 依赖

本树原来没有 `node_modules`。main 工作树已有 pnpm 安装，`next` 版本是 16.3.0，和本树 `package.json` 的 `"next": "16.3.0"` 一致。本轮建了符号链接：

`node_modules` → `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`

没有执行安装。`.gitignore` 的规则是 `node_modules/`，只忽略目录。`git check-ignore -v node_modules` 退出码 1，`git status` 把这条符号链接显示为 `?? node_modules`。不要 `git add` 它。

## 本轮不做

不写文章，不生成媒体，不跑 `pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm dev`。`pnpm test` 的 `pretest` 会先 `pnpm build`。页面验收留给后续 Dispatch。
