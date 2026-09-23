# E-zh-page-final 本地 EGo 浏览器终审：`pine-tree-stardew`

- **审核日期：** 2026-09-23（Asia/Shanghai）
- **审核范围：** 只读检查本地 `127.0.0.1:3003` 的 `/zh/pine-tree-stardew`，并检查中文博客索引、语言切换、目录/相关/来源/站内导航与外部链接结构。
- **唯一写入目标：** `docs/blog-ops/pine-tree-stardew/E-zh-page-final-review.md`。
- **明确未做：** 未修改 source、public assets、tests、handoff、registry、依赖或配置；未修复任何发现；未 commit、push、deploy；用户最终审阅与部署仍 pending。
- **结论：** 目标中文文章在本地真实运行时的 EGo 桌面/移动浏览器复核为 **PASS**。没有发现目标页范围内的 FAIL；页面外的全仓库测试、部署和用户批准不由本报告代称。

## 1. 工具、运行时和证据边界

### 1.1 从一开始使用本地 EGo Browser

本轮第一条浏览器操作即为本地 `ego-browser nodejs`，创建并保留唯一 TaskSpace `36`（`E-PAGE-ZH-FINAL local review`）和页面 `p1`，目标 URL 为 `http://127.0.0.1:3003/zh/pine-tree-stardew`。第一次导航在监听器尚未可用时返回 `net::ERR_CONNECTION_REFUSED`；没有改用 Codex 内置浏览器、Chrome、CDP 外部浏览器或新 TaskSpace，随后在同一个 EGo TaskSpace `36/p1` 中重试并成功。

本轮实际使用：

- EGo DOM snapshot / `page.evaluate()`：正文、元数据、JSON-LD、图片、表格、链接和 residue 扫描。
- EGo `Emulation.setDeviceMetricsOverride`：桌面 `1440×900`、移动 `390×844`，均 `deviceScaleFactor=1`。
- EGo screenshot：顶部和图文中段截图均通过本地 EGo 取得；截图保存在 `/tmp`，没有写入仓库。
- EGo mouse wheel：逐段滚动触发原生 lazy 图片加载，再读取 `currentSrc`、`complete`、自然尺寸。
- EGo `page.fetch()`：对页面读出的唯一站内路径做状态回读。
- Node `fetch()`：只读回读当前本地 HTML 的 HTTP/status/title/H1/description/canonical/hreflang/JSON-LD。

### 1.2 G-runtime 进程、cwd、端口身份

`G-runtime-evidence.md` 记录的启动链是 `pnpm dev` PID `96016` → Next PID `96054` → listener PID `96068`，三者 cwd 均为本工作树，端口为 `3003`。在本次 EGo QA 前重新做了独立身份回读；当前监听器已由运行时重启为以下同一工作树链，不把旧 PID 当作当前证据：

```text
$ lsof -nP -iTCP:3003 -sTCP:LISTEN
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    12347 wusir   17u  IPv6 ...          0t0  TCP *:3003 (LISTEN)

$ ps -axo pid,ppid,user,stat,command | grep -E 'next dev --port 3003|next-server|pnpm dev' | grep -v grep
12293  7394  wusir  Ss+  node /opt/homebrew/opt/node@24/bin/pnpm dev
12333 12293  wusir  S+   node /Users/wusir/orca/workspaces/stardew planner/博客二/node_modules/.bin/../.pnpm/next@16.3.0_@babel+core@7.29.7_@types+node@22.17.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/bin/next dev --port 3003
12347 12333  wusir  S+   next-server (v16.3.0)

$ lsof -a -p 12293 -d cwd -Fn
p12293
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
$ lsof -a -p 12333 -d cwd -Fn
p12333
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
$ lsof -a -p 12347 -d cwd -Fn
p12347
fcwd
n/Users/wusir/orca/workspaces/stardew planner/博客二
```

因此本报告的 `127.0.0.1:3003` 不是占用端口或其他 worktree 的推测：当前 listener、Next 进程和 `pnpm dev` launcher 都由目标 worktree 持有。没有停止任何进程。

## 2. HTTP、路由和 SEO 表面

以下为本轮在当前 listener 上的直接 Node `fetch()` 解析输出；页面没有重定向：

```json
{
  "route": "/zh/pine-tree-stardew",
  "status": 200,
  "finalUrl": "http://127.0.0.1:3003/zh/pine-tree-stardew",
  "bytes": 119446,
  "contentType": "text/html; charset=utf-8",
  "title": "星露谷松树种植先看格子，不浇水也不能随便种",
  "h1": "星露谷松树种植先看格子，不浇水也不能随便种",
  "description": "松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。",
  "canonical": "https://stardewvalleyplanner.art/zh/pine-tree-stardew",
  "hreflang": [
    "en=https://stardewvalleyplanner.art/pine-tree-stardew",
    "zh-CN=https://stardewvalleyplanner.art/zh/pine-tree-stardew",
    "x-default=https://stardewvalleyplanner.art/pine-tree-stardew"
  ],
  "jsonLdTypes": ["Article"]
}
```

目标页的 EGo DOM 回读与上面一致：`document.documentElement.lang = "zh-CN"`；只有一个 `h1`；description、canonical 和三条 hreflang 均存在；`script[type="application/ld+json"]` 只有 1 个且 `@type` 只有 `Article`，没有 `FAQPage`、`BlogPosting`、`BreadcrumbList` 或其他第二个 JSON-LD 类型。该页的 `og:title`、`og:description`、`og:url`、`og:image` 与中文页面表面一致，Twitter title/description/image 也存在。

### 2.1 中文博客索引

```json
{
  "route": "/zh/blog",
  "status": 200,
  "finalUrl": "http://127.0.0.1:3003/zh/blog",
  "bytes": 67734,
  "contentType": "text/html; charset=utf-8",
  "title": "星露谷农场规划指南",
  "h1": "星露谷农场规划指南",
  "description": "帮助你更清晰、更灵活地规划星露谷农场的实用指南。",
  "canonical": "https://stardewvalleyplanner.art/zh/blog",
  "hreflang": [
    "en=https://stardewvalleyplanner.art/blog",
    "zh-CN=https://stardewvalleyplanner.art/zh/blog",
    "x-default=https://stardewvalleyplanner.art/blog"
  ],
  "jsonLdTypes": ["CollectionPage"]
}
```

EGo DOM 回读的中文索引正文为中文，包含目标卡片标题 `星露谷松树种植先看格子，不浇水也不能随便种`；目标 `http://127.0.0.1:3003/zh/pine-tree-stardew` 链接出现两次（卡片图片链接和标题链接），均可见且 href 正确。索引桌面 `documentWidth=1434`、`bodyWidth=1434`、`innerWidth=1440`，没有横向溢出。

## 3. 桌面 EGo 复核：`1440×900`

### 3.1 视口、页面表面和视觉证据

- EGo `p1`：`viewport.innerWidth=1440`、`innerHeight=900`、`dpr=1`。
- `page.url()`：`http://127.0.0.1:3003/zh/pine-tree-stardew`。
- 标题与 H1 均为：`星露谷松树种植先看格子，不浇水也不能随便种`。
- `documentWidth=1434`、`bodyWidth=1434`、`innerWidth=1440`；纵向文档高度 `7023`，无桌面横向溢出。
- 顶部截图：`/tmp/e-page-zh-final-desktop.png`。
- 触发图文区 lazy 图片后中段截图：`/tmp/e-page-zh-final-desktop-figures.png`。

截图可见顶部品牌、博客/语言/规划器导航、中文标题/description/byline/封面；中段截图可见中文目录、中文正文、中文图注和第一张关系示意图，没有英文正文替代中文内容。

### 3.2 中文正文、metadata、来源和 figures

主文章 `article` DOM 的回读结果：

- 正文文本长度约 `3938`；H1、目录、H2/H3、检查表、CTA 和 `来源` 均在同一中文文章结构中。
- byline 为 `作者：星露谷规划器团队 · 阅读约 13 分钟`。
- `sourceHeading` 命中 1 个独立的 `来源` 标题。
- 3 张文章图片均有中文 alt：
  1. 封面：`松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。`
  2. 图 1：`图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。`
  3. 图 2：`示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。`
- 正文和来源链接按中文上下文使用 `zh.stardewvalleywiki.com`；官方 1.6 更新链接为 `www.stardewvalley.net`；相关本站链接为 `/zh/stardew-valley-trees`。
- 文章 source 区明确说明中文 Stardew Valley Wiki 支撑游戏规则、官方 1.6 更新说明支撑地图限制、本站中文树木页与规划器支撑工具边界，未将内部 handoff/research 内容公开。

### 3.3 Cover/inline 图片实际加载

初始顶部回读中，封面和第一张进入 lazy 视区的图片已完成加载；第二张在其尚未接近视区时 `complete=false`、`currentSrc=""`，这是原生 lazy 的初始状态，不作为缺图结论。随后用 EGo mouse wheel 逐段滚动，而不是直接改 DOM，回读到以下最终状态：

| 图片 | `currentSrc` | `complete` | 自然尺寸 | 桌面显示尺寸 | 状态 |
|---|---|---:|---:|---:|---|
| Cover | `/blog/pine-tree-stardew-cover.avif` | `true` | `1672×941` | `1088×612` | **PASS** |
| Figure 1 | `/blog/illustrations/pine-tree-seed-to-tar.avif` | `true` | `1672×941` | `704×396` | **PASS** |
| Figure 2 | `/blog/illustrations/pine-tree-stage-four-neighbor.avif` | `true` | `1672×941` | `704×396` | **PASS** |

所有图片的 DOM `src` 仍保留 WebP fallback 路径，EGo 浏览器实际选择 AVIF；三张图都显示非零尺寸，alt 与图文邻近内容匹配。桌面中段截图已确认第一张示意图不是空白占位。

### 3.4 表格宽度与正文溢出

桌面有 2 个表格，均在 `.blog-table-scroll` wrapper 内：

```text
table 1: width=702, scrollWidth=702, clientWidth=702
wrapper: scrollWidth=702, clientWidth=702, overflowX=visible

table 2: width=702, scrollWidth=702, clientWidth=702
wrapper: scrollWidth=702, clientWidth=702, overflowX=visible
```

虽然 wrapper 的 computed `overflowX` 是 `visible`，实际 table 宽度与 wrapper/client 宽度相等，且整个 document/body 宽度均不超过视口；因此没有观察到桌面横向溢出。

## 4. 移动 EGo 复核：`390×844`

### 4.1 视口、页面表面和视觉证据

- EGo `p1`：`viewport.innerWidth=390`、`innerHeight=844`、`dpr=1`。
- `page.url()` 仍为 `http://127.0.0.1:3003/zh/pine-tree-stardew`。
- `documentWidth=390`、`bodyWidth=390`、`innerWidth=390`；纵向文档高度 `9243`，无移动横向溢出。
- 顶部截图：`/tmp/e-page-zh-final-mobile.png`。
- 触发图文区 lazy 图片后中段截图：`/tmp/e-page-zh-final-mobile-figures.png`。

顶部截图可见移动折叠品牌、博客/语言/打开规划器导航、中文 H1/description/byline/封面和中文目录；中段截图可见图 1 下方中文图注、中文 H2/H3 和编号排错步骤。没有通过截图把桌面宽度或英文正文误当成移动证据。

### 4.2 移动图片和表格

通过 EGo mouse wheel 从 `scrollY=0` 逐段滚动至底部后，3 张文章图片均回读 `complete=true`、`naturalWidth=1672`、实际 `currentSrc` 为本地 AVIF；封面与两张正文图的显示尺寸均为约 `358×201.375`。移动 2 个 table 的最终回读为：

```text
table 1: width=356, scrollWidth=356, clientWidth=356
 table wrapper: scrollWidth=356, clientWidth=356, overflowX=visible

table 2: width=356, scrollWidth=356, clientWidth=356
 table wrapper: scrollWidth=356, clientWidth=356, overflowX=visible
```

因此移动没有 table 或正文横向溢出；第二张正文图最初尚未进入 lazy 视区，滚动到约 `scrollY=2700` 后加载成功，这是预期加载路径而非目标失败。

## 5. 导航、语言切换和相关链接

### 5.1 Header/语言切换/实际导航

初始中文文章 DOM snapshot 读到：

- `a[aria-label="博客"]` → `http://127.0.0.1:3003/zh/blog`。
- `button[aria-label="语言"]` 存在。
- `a[aria-label="打开规划器"]` → `http://127.0.0.1:3003/zh#planner`。

在桌面和移动视口都点击了语言按钮。移动菜单 DOM 回读为：

```text
English -> http://127.0.0.1:3003/pine-tree-stardew (visible, x=70.07, y=69.99, 126×40)
中文    -> http://127.0.0.1:3003/zh/pine-tree-stardew (visible, x=70.07, y=109.99, 126×40)
```

随后实际点击 English，并用 EGo `waitForURL()` 回读：

```text
url=http://127.0.0.1:3003/pine-tree-stardew
lang=en
title=\"Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar\"
h1=\"Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar\"
```

再回到 `http://127.0.0.1:3003/zh/pine-tree-stardew`，回读 `lang=zh-CN` 和中文 title。语言切换不是只读 href 推断，而是完成了真实 EGo 点击与返回。

### 5.2 站内链接状态回读

从目标页 DOM 读出的 8 个唯一站内 path，均用同一 EGo `page.fetch()` 做了状态回读：

```text
/zh                       200 text/html
/zh/blog                  200 text/html
/pine-tree-stardew        200 text/html
/zh/pine-tree-stardew     200 text/html
/zh/stardew-valley-trees  200 text/html
/zh/privacy               200 text/html
/zh/terms                 200 text/html
/zh/contact               200 text/html
```

这覆盖了品牌/规划器、博客、语言切换、正文相关中文树木页、CTA 目标和 footer 法律/联系导航。目录锚点、`来源` 锚点、正文内相关链接的 href 均指向当前中文文章或上述相关页面。

### 5.3 外部链接结构

目标页共读到 57 个 `<a href>`：23 个当前本地 origin 链接，34 个外部链接。外部 host 计数为：

```text
zh.stardewvalleywiki.com  30
www.stardewvalley.net       2
x.com                       1
discord.gg                  1
```

来源/正文规则链接集中到中文 Stardew Valley Wiki 和官方 1.6 更新说明，footer 社交链接为 X/Discord；没有发现外部 href 指向内部编辑文件、handoff、research 或本地私有路径。外部站点本轮只做 href/host 结构回读，未把第三方实时可达性冒充本地页面状态（外部 HTTP 可达性单列 **UNVERIFIED**）。

## 6. Residue、JSON-LD 和范围外边界

### 6.1 目标文章 residue 扫描

对目标主 `article`（不把全站 footer 当正文）扫描以下模式：

```text
ResearchTrace, ReaderValue, PublicReference, FAQ, 常见问题, 研究,
draft, Draft, handoff, JSON-LD, research, assistant, 编辑, 内部, occurrence
```

结果 `hits=[]`，目标文章正文/source/CTA 没有 FAQ、研究过程、handoff、内部字段或 JSON-LD 说明残留。全站 footer 仍有正常的 `常见问题` 导航链接；该链接属于站点 shell，不属于目标文章 residue，不应误报为文章 FAQ 残留。

### 6.2 状态矩阵

状态只使用 **PASS / FAIL / UNVERIFIED**；PASS 只覆盖对应证据范围，不扩大为部署或用户批准。

| 检查项 | 状态 | 证据/边界 |
|---|---|---|
| G-runtime 端口、PID、cwd 身份 | **PASS** | 当前 `3003` listener `12347`、Next `12333`、launcher `12293` 均回读到目标 worktree；G-runtime 旧链也记录同一 worktree。 |
| 目标 `/zh/pine-tree-stardew` HTTP/status/final URL | **PASS** | 当前本地 Node fetch：HTTP 200、无重定向、`text/html`、119446 bytes；EGo `page.url()` 同值。 |
| Title / H1 / description | **PASS** | Node HTML 与 EGo DOM 均回读中文 title、单 H1、中文 description。 |
| canonical / hreflang | **PASS** | EGo DOM 和 HTML 解析均回读 production canonical，`en`/`zh-CN`/`x-default` 三条正确本地化 URL。 |
| Article-only JSON-LD | **PASS** | 目标页 JSON-LD script 只有 1 个，`@type=Article`；没有 FAQ/BlogPosting/BreadcrumbList 等第二类型。 |
| 中文正文、metadata、source、figures | **PASS** | `lang=zh-CN`，中文 byline/reading time/source heading，3 张图片中文 alt，正文/source 结构完整。 |
| Cover / 两张 inline 图片 | **PASS** | EGo scroll 后三张图 `complete=true`，本地 AVIF `currentSrc`、1672×941 自然尺寸、非零显示尺寸均回读。 |
| 桌面 `1440×900` | **PASS** | DOM、截图、导航和横向宽度回读完成；`documentWidth=1434 < innerWidth=1440`。 |
| 移动 `390×844` | **PASS** | DOM、截图、滚动加载、导航和横向宽度回读完成；`documentWidth=390 = innerWidth`。 |
| 表格 overflow | **PASS** | 桌面 2 表 `702=702`，移动 2 表 `356=356`；table/wrapper/client 宽度相等，无页面横溢出。 |
| 中文博客索引 | **PASS** | `/zh/blog` HTTP 200，中文 title/H1/description，目标卡片及正确目标 href 存在，无横溢出。 |
| 语言切换实际点击 | **PASS** | EGo 打开菜单、点击 English 到 EN route、再回到 ZH；桌面/移动菜单链接可见且 href 正确。 |
| 站内相关/法律/CTA href status | **PASS** | 从目标 DOM 得到的 8 个唯一站内 path，均 EGo `page.fetch()` 200。 |
| 外部 href/host 结构 | **PASS** | 34 个外部 href 只落在中文 Wiki、官方更新页、X、Discord 预期 host。 |
| 外部 HTTP 实时可达性 | **UNVERIFIED** | 本轮不把第三方实时网络回读混入本地页面验收。 |
| 目标文章 FAQ/research residue | **PASS** | 主 article 模式扫描 `hits=[]`；footer `常见问题` 是正常 shell 导航，单独排除。 |
| 全仓库 tests/typecheck/build | **UNVERIFIED** | 本轮是只读本地 EGo 页面验收，未重新运行全仓库代码门；不对已有 baseline 状态作新结论。 |
| 部署、生产外部状态、用户最终审阅 | **UNVERIFIED** | 本任务没有 deploy 或外部写入；用户 final review 和 deployment 仍 pending。 |

## 7. 目标失败与无关现有状态分离

### 目标页失败

- **未发现。** 本轮没有目标页范围内的 FAIL。
- 第一次 EGo 导航的 `net::ERR_CONNECTION_REFUSED` 发生在当前 listener 可回读前；同一 TaskSpace 重用后，当前目标 worktree 的 `3003` listener 已确认并返回 HTTP 200，不能把启动时序问题误报为目标页面失败。
- 文章第二张正文图在尚未接近视区时初始 `complete=false`，经真实 EGo wheel 滚动进入视区后 `complete=true` 且 AVIF/1672×941 正常；这是 lazy loading 行为，不是图资源 FAIL。

### 无关现有状态

- 开始审核前工作树已有多处 tracked/untracked source、asset、test、blog-ops 和生成文件状态；本轮没有修改或清理这些路径，也没有把它们归因到目标中文页面。
- 本轮没有运行宽范围 tests/typecheck/build，因此不报告任何全仓库代码门 PASS/FAIL；若其他页面或旧测试存在基线问题，应由对应静态/测试报告单独处理。
- 没有删除、重启、提交、推送或部署；当前本地服务保留给后续授权的本地验收使用。

**E-zh-page-final 本地 EGo 浏览器结论：PASS（目标中文文章、桌面/移动、中文索引、语言切换、站内链接、图片、表格、Article-only JSON-LD 和无文章 residue 均有本轮证据）。用户最终审阅与部署：UNVERIFIED / pending。**
