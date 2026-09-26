# P 站点上下文（非主题研究）

核对时间：2026-09-26（Asia/Shanghai）。本文件只记录现有网站/工作树接口、公开 URL、页面可见标题、候选内链及旧包边界；不提供 `stardew valley speed gro` 的主题事实、搜索意图、布局或正文。

## 站点与路由接口

| 项目 | 证据 | 结果 |
| --- | --- | --- |
| 公开站点 | `src/seo/public-site-url.ts` 的 `configuredPublicSiteUrl`；README | `https://stardewvalleyplanner.art` |
| 英文博客索引 | ego-browser 实际打开 | <https://stardewvalleyplanner.art/blog>，HTTP HEAD `200`，页面标题 `Stardew Valley Planning Guides` |
| 中文博客索引 | ego-browser 实际打开 | <https://stardewvalleyplanner.art/zh/blog>，HTTP HEAD `200`，页面标题 `星露谷农场规划指南` |
| 英文归档接口 | `src/blog/blog-copy.ts` | `/blog/archive`（当前本次未单独打开） |
| 中文归档接口 | `src/blog/blog-copy.ts` | `/zh/blog/archive`（当前本次未单独打开） |
| 本地化文章路由 | `src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts` | 现有 23 个 slug，各有英文和 `/zh/` 中文路径；本任务未新增路由 |

项目源码的 canonical URL 规则要求路径以 `/` 开头、不得带 query/hash，非根路径不以斜杠结尾；公开站点基址必须为 HTTPS 根域。以上是项目已有规则，不是对新文章 slug 的决定。

## 最近标题：区分 live 页面与当前工作树

### live 页面实际观察

ego-browser 在 live `/blog` 和 `/zh/blog` 的 DOM 中观察到的前三个去重文章标题（按页面 DOM 出现顺序，不推断发布时间）如下：

| 语言 | 公共 URL | 页面实际标题 |
| --- | --- | --- |
| en | <https://stardewvalleyplanner.art/carpenter-stardew> | Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades |
| en | <https://stardewvalleyplanner.art/where-is-robin-stardew-valley> | Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions |
| en | <https://stardewvalleyplanner.art/fall-crops-stardew> | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| zh-CN | <https://stardewvalleyplanner.art/zh/carpenter-stardew> | 星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级 |
| zh-CN | <https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley> | 罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程 |
| zh-CN | <https://stardewvalleyplanner.art/zh/fall-crops-stardew> | 星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊 |

页面的首个 `Latest articles` 区块本身只展示前两张卡（Carpenter、Where Is Robin）；第三个标题来自同一 live DOM 的 `Stardew Valley Guides` 列表。为了不把页面顺序误写成发布时间，这里只称“DOM 顺序观察”。

### 当前工作树注册表尾部

当前工作树 `src/blog/blog-post-registry.tsx` 的英文和中文数组尾部都为：

| slug | en 标题 | zh-CN 标题 |
| --- | --- | --- |
| `pine-tree-stardew` | Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar | 星露谷松树种植先看格子，不浇水也不能随便种 |
| `profit-margin-stardew` | Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change | Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选 |
| `what-to-grow-in-greenhouse-stardew` | What to Grow in Greenhouse Stardew: Choose by Access, Harvest Rhythm, and Replanting | 星露谷温室种什么？按手头种源、等待时间与收获节奏选择 |

证据位置：英文 metadata `src/blog/blog-post-registry.tsx:374-416`，中文 metadata `:705-747`；slug 顺序 `src/blog/blog-post-identities.ts:1-24`。当前源码的 `getBlogHomeState` 会对匹配数组做反转，但 live 页面实际内容与当前工作树不一致，故不能用源码尾部替代 live“最近”结论。上述文章只作为站点上下文标题核对，没有读取其正文作为素材。

## 相关内链候选（仅核对存在性）

以下路径是现有文章源码中出现过的博客/规划器内部 href，并在本次 ego-browser 页面上下文中做了同源 HEAD 核对。它们只是后续编辑可核查的链接候选，不是主题研究结论，也没有指定本题正文必须采用哪些链接。

| locale | 路径 | 公开 URL | live HEAD |
| --- | --- | --- | --- |
| en | `/best-spring-crop-stardew` | <https://stardewvalleyplanner.art/best-spring-crop-stardew> | `200` |
| zh-CN | `/zh/best-spring-crop-stardew` | <https://stardewvalleyplanner.art/zh/best-spring-crop-stardew> | `200` |
| en | `/summer-crops-stardew` | <https://stardewvalleyplanner.art/summer-crops-stardew> | `200` |
| zh-CN | `/zh/summer-crops-stardew` | <https://stardewvalleyplanner.art/zh/summer-crops-stardew> | `200` |
| en | `/fall-crops-stardew` | <https://stardewvalleyplanner.art/fall-crops-stardew> | `200` |
| zh-CN | `/zh/fall-crops-stardew` | <https://stardewvalleyplanner.art/zh/fall-crops-stardew> | `200` |
| en | `/glasshouse-stardew-valley` | <https://stardewvalleyplanner.art/glasshouse-stardew-valley> | `200` |
| zh-CN | `/zh/glasshouse-stardew-valley` | <https://stardewvalleyplanner.art/zh/glasshouse-stardew-valley> | `200` |
| en | `/sprinkler-stardew` | <https://stardewvalleyplanner.art/sprinkler-stardew> | `200` |
| zh-CN | `/zh/sprinkler-stardew` | <https://stardewvalleyplanner.art/zh/sprinkler-stardew> | `200` |
| en | `/how-to-earn-money-stardew` | <https://stardewvalleyplanner.art/how-to-earn-money-stardew> | `200` |
| zh-CN | `/zh/how-to-earn-money-stardew` | <https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew> | `200` |
| en | `/last-day-to-plant-stardew` | <https://stardewvalleyplanner.art/last-day-to-plant-stardew> | `404` |
| zh-CN | `/zh/last-day-to-plant-stardew` | <https://stardewvalleyplanner.art/zh/last-day-to-plant-stardew> | `404` |

源代码 href 位置的只读核对包括：`src/blog/articles/summer-crops-stardew.en.tsx:33,535,694`、`src/blog/articles/summer-crops-stardew.zh.tsx:56,73,77,371,400`、`src/blog/articles/fall-crops-stardew.en.tsx:28,32,56,359,385,390`、`src/blog/articles/fall-crops-stardew.zh.tsx:39,43,47,347`、`src/blog/articles/glasshouse-stardew-valley.en.tsx:40,220,246`、`src/blog/articles/glasshouse-stardew-valley.zh.tsx:84,97`、`src/blog/articles/sprinkler-stardew.en.tsx:207`、`src/blog/articles/best-spring-crop-stardew.en.tsx:25,414,604,608,617,622`、`src/blog/articles/how-to-earn-money-stardew.en.tsx:38,178,428,447,452,659`。只抽取 href，不把这些旧文章正文当作本题素材。`last-day-to-plant-stardew` 虽在当前源码路由表中，live en/zh 均为 404，暂不应当作已公开可用内链。

## 本题旧官方内容包核对

结论：在下列明确核查范围内，**未发现名为或路径包含 `speed gro` / `speed-gro` / `speedgro` 的本题旧官方内容包**；没有打开旧博客正文或旧报告作为素材。

实际只读命令与范围：

```text
$ find /Users/wusir/Desktop /Users/wusir/orca/workspaces -type f \( -iname '*speed*gro*' -o -iname '*speedgro*' \) -print
# 无输出，exit=0

$ git ls-files | rg -i 'speed.?gro|speed.?gro|gro.?speed'
# 无输出，exit=0

$ find docs/blog-ops -maxdepth 1 -mindepth 1 -type d -print | sort
docs/blog-ops/fall-crops-stardew
docs/blog-ops/pine-tree-stardew
docs/blog-ops/profit-margin-stardew
docs/blog-ops/summer-crops-stardew
# exit=0；无 speed-gro 目录

$ find /Users/wusir/Desktop/工作 -maxdepth 1 -mindepth 1 -print | rg -i 'stardew|gro|speed|crop|summer|fall|plant|farming|fertil|growth'
# 仅命中其他主题包/编排目录；无 speed-gro 包，exit=0
```

因此“旧包不存在”只对上述路径名/跟踪文件范围成立；未扫描的外部目录不能据此推断。当前 `docs/blog-ops` 的既有范围是 `fall-crops-stardew`、`pine-tree-stardew`、`profit-margin-stardew`、`summer-crops-stardew` 四个包，均不是本题旧包；其正文未被读取。

## 研究边界与浏览器验证记录

- 未做搜索引擎查询、SERP 地区伪造、主题事实核验、版本判断、实测或内容/布局审核。
- ego-browser 只读打开英文/中文博客索引，并用 `page.fetch(path,{method:"HEAD"})` 核对上述同源 URL；没有点击外部链接、登录、提交表单或产生外部写入。
- HEAD 核对命令实际退出码：`0`；返回状态见上表。HTTP 200 只证明当前 live URL 响应，不证明正文质量、主题事实或未来发布状态。
- 本上下文的来源 URL 仅为网站公开页面；编辑流程、项目源码路径和内部证据不进入公开正文。
