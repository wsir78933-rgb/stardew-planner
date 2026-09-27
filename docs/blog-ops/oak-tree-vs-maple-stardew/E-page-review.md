# E-page 审核：oak-tree-vs-maple-stardew

审核日：2026-09-27。独立看页，没有改网站源码，没有启动或重启开发服务，没有提交。

用户终审尚未进行。这份记录只是页面检查，不代表用户已通过。

## 结论

必须改：0。按本次检查项，页面通过。

## 怎么看的

- 工具：ego-browser，一个 TaskSpace（`92`），只复用页面 `p1`。结束时 `finish({ keep: [] })`。
- 桌面：`Emulation.setDeviceMetricsOverride` 宽 1280、高 900、`mobile: false`。实测 `innerWidth` 1280。
- 手机：宽 390、高 844、`mobile: true`。实测 `innerWidth` 390。
- 英文：`http://127.0.0.1:3003/oak-tree-vs-maple-stardew`，`page.fetch` 状态 200。
- 中文：`http://127.0.0.1:3003/zh/oak-tree-vs-maple-stardew`，`page.fetch` 状态 200。
- 图片是否解码：`page.evaluate` 读 `naturalWidth`、`naturalHeight`、`currentSrc`。正文图先滚进视口再读。另用 canvas `drawImage` 导出解码后的图，核对图里的字。

## 标题

两个视口、两个 URL 都只有一个 `h1`。

- 英文，与指定句逐字相同：`Stardew Valley Oak Tree vs Maple: The Seed or the Tapper Product Names the Tree`
- 中文，页面里用该句做 `===` 比较，结果为 true：`星露谷橡树还是枫树：缺橡树树脂就留橡树，缺枫糖浆就留枫树`
- `document.documentElement.lang`：英文 `en`，中文 `zh-CN`。

## 图片

站头 favicon（`/favicon.png`，`naturalWidth` 64，`naturalHeight` 64）不算封面，也不算正文图。

| 页面 | 角色 | currentSrc | loading 属性 | naturalWidth | naturalHeight | 手机显示约 | object-fit 裁掉的高度 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 英 | 封面 | `/blog/oak-tree-vs-maple-stardew-cover.avif` | 无（属性是 `auto`，不是 lazy） | 1672 | 941 | 358×201.4 | 0.1px |
| 英 | 正文 | `/blog/illustrations/oak-tree-vs-maple-stardew-en-names.avif` | `lazy` | 1672 | 941 | 358×201.4 | 0.1px |
| 英 | 正文 | `/blog/illustrations/oak-tree-vs-maple-stardew-en-check.avif` | `lazy` | 1672 | 941 | 358×201.4 | 0.1px |
| 中 | 封面 | 同上封面 `.avif` | 无（不是 lazy） | 1672 | 941 | 358×201.4 | 0.1px |
| 中 | 正文 | `/blog/illustrations/oak-tree-vs-maple-stardew-zh-products.avif` | `lazy` | 1672 | 941 | 358×201.4 | 0.1px |

张数：英文正文图 2，中文正文图 1，两边封面各 1。`naturalWidth` 都大于 0。

桌面英文封面显示约 1088×612，两张正文图约 704×396。中文桌面封面约 1088×612（裁高 0.3px），正文图约 704×396（裁高 0.2px）。容器是 `aspect-ratio: 16 / 9`，`object-fit: cover`。裁掉的不到 1 像素，图内文字还在画面里。

对应 `.avif` 用 `page.fetch`，状态都是 200，`content-type` 为 `image/avif`：

- `/blog/oak-tree-vs-maple-stardew-cover.avif`
- `/blog/illustrations/oak-tree-vs-maple-stardew-en-names.avif`
- `/blog/illustrations/oak-tree-vs-maple-stardew-en-check.avif`
- `/blog/illustrations/oak-tree-vs-maple-stardew-zh-products.avif`

图里实际能读到的字：

- 封面：两棵树和一个木桶，没有数字，没有那些禁写词。
- 英文对照图：`7 Nights` / `7 days`，`9 Nights` / `9 days`，`Heavy Tapper 3`，`Heavy Tapper 4`，`Wood 12-16`。底部小字是 chop seed count `0-2`，不是 18 或 24。按手机上的 cover 裁切把这张图画成 358×201 后，最后一行墨色大约停在 y=192，下面到 y=200 仍是底色，没有把这行裁没。
- 英文流程图书：能读到 `If it is not mature`、`Oak Resin for an oak`、`Maple Syrup for a maple`、`Acorn means oak`、`Maple Seed means maple`。没有 18 天、24 天、3–4 天。
- 中文产物图：`7天`、`9天`、`3天`、`4天` 分格，另有 `基础售价150金`、`基础售价200金`。手机视口里这些字仍能读，没有裁到缺字。

图注原文：

- 英文对照图：`Figure: The seed name or the product name separates the trees. Wood 12–16 does not. Nights on the Tapper table and days on the tree and item pages are two wordings of the same counts, not two waits.`
- 英文流程图：`Figure: Use the product when a Tapper or Heavy Tapper is already on the tree. Otherwise shake once or chop once. An empty seed result is not the other species.`
- 中文产物图：`图：左右两边都是成熟普通树上的树液采集器。橡树一侧 7 天一份橡树树脂，重型树液采集器是 3 天；枫树一侧 9 天一份枫糖浆，重型是 4 天。树脂下面是小桶和高级生长激素，糖浆下面是蜂房和枫糖棒。这张图不是树要长多少天，也不是哪边更赚钱。`

在图的 alt、图注，以及上面读到的图内文字里，没有出现 `18 天`、`24 天`、`18 days`、`24 days`、`3–4 天`、`3-4 days`、`most profitable`、`规划器`、`docs/blog-ops`、`operation-store`。中文图注里的「更赚钱」是整句「也不是哪边更赚钱」，不是 `most profitable`。`3 天` 和 `4 天` 是分开写的，不是 `3–4 天`。

## 链接

中文正文有一处站内链接，href 为 `/zh/stardew-valley-trees`，锚文本是「普通树和果树的间隔说明」。`page.fetch` 该地址状态 200。在手机视口点开后，地址是 `http://127.0.0.1:3003/zh/stardew-valley-trees`，`lang` 为 `zh-CN`，H1 为「星露谷种树：先分普通树和果树，再在农场图上留间隔」。标题和正文开头都不是 404。

抽到的维基链接：锚文本「橡子」，href 为 `https://zh.stardewvalleywiki.com/橡子`（绝对地址 `https://zh.stardewvalleywiki.com/%E6%A9%A1%E5%AD%90`）。以 `https://` 开头，不是站内路径。中文页上像维基的链接没有落到站内路径。英文页抽到的一条例外核同样是外链：`https://stardewvalleywiki.com/Oak_Tree`。

## 横向滚动

英文没有 `table`。中文有一张表，类名 `blog-data-table blog-data-table--wrap`，外面是 `blog-table-scroll`。

`scrollWidth` 没有大于 `clientWidth`：

- 英文桌面：`documentElement` 与 `body` 都是 scrollWidth 1274、clientWidth 1274。`innerWidth` 1280。没有元素 scrollWidth 比 clientWidth 大过 1px。
- 英文手机：一次测得 `documentElement` scrollWidth 390、clientWidth 390。出现竖向滚动条后再测，clientWidth 与 scrollWidth 都是 384。390 宽的截图里，x=384 到 389 是页面根背景 `rgb(20, 30, 23)`，这是滚动条槽，不是内容把页面撑宽。
- 中文桌面：scrollWidth 1274、clientWidth 1274。
- 中文手机：当时 `documentElement` scrollWidth 390、clientWidth 390。表自身 scrollWidth 356、clientWidth 356，表的右边大约在 x=373。整页没有横向溢出元素。表头在窄屏里换行，例如「基础售价」「萃取者加 25% 后页面写出的售价」，仍在视口内，没有把整页撑出横向滚动。

## 结构化数据

两页都只有一段 `application/ld+json`，`@type` 是 `Article`。整页 HTML 里没有 `FAQPage`。

## 必须改

无。
