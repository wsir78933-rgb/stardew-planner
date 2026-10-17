# E 页面审核：house-upgrade-stardew

- 角色：独立 E 页面审核。未改文章、未改装配、未 build、未 typecheck、未 test。
- 结论：**PASS**。问题数：**0**。
- 用户终审：**pending**。本报告不是用户批准。
- 部署：未部署。验收服务器是本机 `http://127.0.0.1:3010`，不是 `https://stardewvalleyplanner.art`。

## 实际页面

| 项 | 值 |
|---|---|
| 英文 | `http://127.0.0.1:3010/house-upgrade-stardew` |
| 中文 | `http://127.0.0.1:3010/zh/house-upgrade-stardew` |
| 进程 | PID 21887，cwd `/Users/wusir/orca/workspaces/stardew planner/博客-2`，`127.0.0.1:3010` LISTEN |
| 浏览器 | ego-browser nodejs，taskSpace `167`，页面 `p1`。结束时 `task.finish({ keep: [] })` |
| 英文 HTML | HTTP 200，113755 字节，SHA-256 `3ca9995c83780becbaca28e891f2d067aabcd9d3052707afc53826a7096c6430` |
| 中文 HTML | HTTP 200，111805 字节，SHA-256 `ce02bd73e681374e7d8b3a2cbd03429252009aefa084c1f695ccaa3e067df77f` |

冻结文件 SHA-256，本轮 `shasum -a 256` 复算：

- `handoff/public/en.json` `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3`
- `handoff/public/zh-CN.json` `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c`
- `assembly/AssemblyManifest.json` `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834`

`page.info()` 实际尺寸：桌面 `w:1280,h:800`；手机 `w:390,h:844`。`Emulation.setDeviceMetricsOverride` 的 `deviceScaleFactor` 为 1。

## 与冻结 PublicBlogHandoff 对照

四个视图的 DOM 抽取（`*-dom-after-images.json`）相对冻结正文、SEO、图注、来源，差异数都是 0。

对照项：正文 6 个 H2 与 2 个 H3 的顺序和原文；正文段落；两张正文图的 alt、src、逐字 figcaption；费用表每个单元格；正文链接的文字和 URL；12 条来源的 label、href、version note。来源 label 与 note 分开读取。英文 Version History 的 `titleText` 是 `Version History1.6 change...`，中间没有自动 ASCII 空格；中文版本历史同样。画面上 flex gap 把二者分开，注记完整可读。这不记为问题。

正文 H1 各 1 个。Sources / 来源是正文容器里的额外 H2，页脚还有 Planner、Explore、Legal。这些不计入 6H2/2H3。目录因此有 9 项：8 个正文标题加 Sources/来源。

封面沿用 header 的 src/alt，没有 figcaption。封面 caption 未挂载，符合现有接口，不记为问题。两张正文 caption 与冻结稿逐字相同。

中文正文和来源里的木匠内链都是 `https://stardewvalleyplanner.art/carpenter-stardew`，标签是 `罗宾的商店和室外建筑`。

## Head 与 SEO

| 字段 | 英文 | 中文 |
|---|---|---|
| `html lang` | `en` | `zh-CN` |
| `<title>` / H1 / `og:title` / `twitter:title` | 冻结英文 Title | `星露谷房屋升级：第二档是65,000金和100硬木` |
| description / `og:description` / `twitter:description` | 冻结英文 description | 冻结中文 description |
| canonical | `https://stardewvalleyplanner.art/house-upgrade-stardew` | `https://stardewvalleyplanner.art/zh/house-upgrade-stardew` |
| hreflang | `en`、`zh-CN`、`x-default` 均指向上面两个生产 URL；`x-default` 指向英文 | 相同 |
| robots | `index, follow` | `index, follow` |
| 作者行 | Stardew Valley Planner Team · 6 min read | 星露谷规划器团队 · 阅读约 6 分钟 |
| topic | Stardew Valley Guides | 星露谷物语指南 |

渲染出的 head 没有 `og:locale`。locale 以 `html lang` 和 hreflang 为准，二者正确。canonical 是生产 URL，本页仍是本地预览。

## 图片

封面和两张正文图，四种视图的 `naturalWidth/naturalHeight` 都是 1672×941。封面 `loading` 属性为空（浏览器默认 eager），`currentSrc` 为对应 AVIF。正文图 `loading="lazy"`、`decoding="async"`，滚入视口后 `currentSrc` 为对应 AVIF。

12 个 WebP/AVIF URL 用 `Accept-Encoding: identity` 直接 GET，全部 HTTP 200，字节数和 SHA-256 与冻结 `publicRequirements.figures` 一致。记录在 `bytes.json`。

`object-fit: cover` 加 16:9 框相对 1672×941 的计算裁切是每边约 0.5–0.7 CSS 像素。桌面居中封面、手机页头封面、两张正文图在两语下都能读全标签，包括三列的 `3 days` / `3天`、`9×5 outdoors` / `9×5室外`、装修图的免费和 150,000。手机上的缩小是现有模板比例，标签仍可读。

## 表格、目录、语言、CTA

桌面表格容器 `.blog-table-scroll` 为 `overflow-x: auto`。1280 宽时 `clientWidth` 与 `scrollWidth` 都是 702，四列同时可见。390 宽时英文和中文都是 `clientWidth` 356、`scrollWidth` 608；把 `scrollLeft` 设到末尾后得到 252。左端截图可见升级/金币，右端截图可见材料/天数。`documentElement.scrollWidth` 等于 `clientWidth`（桌面 1274，手机 390），页面元素扫描没有未被滚动容器裁住的横向溢出。

目录 9 个锚点在桌面和手机、中英两语都点击成功。`location.hash` 与标题 id 一致，标题进入视口（记录的 `top` 为 24，`inView` true）。中文锚点是百分号编码，解码后与标题原文一致。

语言菜单两项：English → `/house-upgrade-stardew`，中文 → `/zh/house-upgrade-stardew`。桌面和手机都从英文点到中文，再点回英文，落点 URL 与 href 一致，回来后目录重新出现。

`[data-blog-planner-cta="true"]` 每页 1 个。英文按钮 `/#planner`，中文按钮 `/zh#planner`。画面上是既有两行标题加一次按钮，后面才是来源。没有第二套文章 CTA。

## Console 与网络

本轮测量的四次文档加载里，`Runtime.consoleAPICalled`、`Runtime.exceptionThrown`、`Log.entryAdded` 都是空的。早先仍挂着 console hook 的中文手机文档里，`window.__ePageReview` 为 `{ console: [], pageerrors: [] }`。没有 status ≥ 400 的响应。

每次加载有一条被取消的第三方请求：`https://www.google-analytics.com/g/collect?...`，`errorText` 为 `net::ERR_ABORTED`，`canceled: true`，类型 Fetch。它不是文章 HTML、脚本或 12 张 WebP/AVIF。这里只记录，不把它写成已修复，也不把它算进页面问题数。

## 首次 DOM 差异口径

第一次英文桌面抽取把 `![alt](src)` 也算进正文链接，于是 expected 52、actual 50。去掉这两条图片 Markdown 后，正文链接数量与顺序对齐。来源对象多了一个辅助字段 `titleText`；`label`、`href`、`note` 的原值已经相同。比较只用这 3 个字段。`titleText` 只作记录，不构成 FAIL。这次原始 JSON 在收到「保留为 initial」之前，已被校正后的重跑覆盖。校正后四份 `*-dom-after-images.json` 的差异数都是 0。没有因此改产品或冻结正文。

## 导出外链控件

点查 `http://127.0.0.1:3010/house-upgrade-stardew` 的实时 DOM：存在 `button#auto-comment-export-outlinks-btn`，文字是「导出外链」，`data-action="analyze-backlinks"`，`title="导出当前页面外链 CSV"`。它是 `body` 的直接子节点，`position: fixed`，`z-index: 2147483647`，不在 `main`、`header` 或 `[data-blog-article]` 里。

同一 URL 的静态 HTML 不含这个 id，也不含这段文字。本仓库源码检索不到 `auto-comment-export-outlinks`。页面里的 inline script 也不含这个 id。它是文档加载后插入的外部控件，不是这篇文章的模板。截图里它会挡住左下角。产品验收不把它算成文章缺陷，也不改共享 UI。

## 不记为问题的观察

- 第一次中文手机目录点击，在表格滚到末尾后，自动化报 `element is not visible in the viewport`。随后把每个目录链接滚到视口中央再点，9 个锚点全部成功。完成记录是后面这次。
- 封面 caption 不显示。
- Sources/来源、页脚 H2 不计入正文 6H2/2H3。

未重跑正文 D，未做中文 SERP。未升级 ego-browser。运行中出现 Ego Lite update notice（当前 0.5.1.13），未执行 upgrade。

## 证据

同目录：`checks.log`、`bytes.json`、`interaction.json`、`network-prior.json`、四组 `*-dom.json` 与 `*-dom-after-images.json`，以及桌面 1280×800、手机 390×844 两语的 header、middle、table、end、sources、figure、cover、cta 截图。
