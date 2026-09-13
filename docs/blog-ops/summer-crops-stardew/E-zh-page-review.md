# E-zh 页面审核：summer crops stardew（zh-CN）

- 角色：Agent E-zh 页面审核（同一审核职责。不改页面、不改正文、不改标题）
- 浏览器：ego-browser CLI；任务空间 `summer-crops-stardew-page-zh`（id 227）
- 真实本地路由：`http://127.0.0.1:3003/zh/summer-crops-stardew`
- 不把 D/F/题文 PASS 当作本页 PASS
- 视口：桌面 `1280×800`（CDP `Emulation.setDeviceMetricsOverride`）；手机 `390×844` mobile=true

本版本页面总评：**PASS**。给 G 的必须改项：**0**。

用户终审：**尚未进行，等网站成品页。** 本机页面审核通过不等于用户已批。

---

## 证据摘要

| 检查 | 桌面 1280×800 | 手机 390×844 |
|------|----------------|--------------|
| 文章 HTTP | `200` `text/html` | 同路由，视口切换后仍 `200` |
| Title | 星露谷夏天种什么：按买得到的种子和浇得完的格子选 | 同 |
| H1 | 同上，可见 | 同上，未横向撑破（`h1Overflow: false`） |
| `html lang` | `zh-CN` | `zh-CN` |
| 正文要点 | 蓝莓/甜瓜/啤酒花、杨桃绿洲、日均口径、巨大 3×3 均在 `article` | 同 |
| 封面 | 可见；`/blog/summer-crops-stardew-cover.webp` **200** `image/webp` 201342B；natural 1672×941 | 可见，client 356×199，含喷壶 |
| 正文图1 日历 | 可见；`summer-crop-occupancy-calendar.webp` **200** 89004B；1672×941 | 滚入视口后 complete；日序 1/14/16/15/22/28 可辨 |
| 正文图2 格子 | 可见；`summer-hops-melon-blueberry-bed.webp` **200** 73282B；1672×941 | 滚入视口后可见；OK 九格与 FAIL 洒水器可辨 |
| 表 | 7 列；`scrollWidth` 726 vs 父 702，`overflow-x: auto`，单元格折行 | 726 vs 父 356，`overflow-x: auto`，可横滑，未盖住正文 |
| 语言切换 | 打开「语言」后点 English → `/summer-crops-stardew` lang=en；再点中文回到本页 | 未再点菜单；桌面已走通往返 |
| `/zh/blog` | **200**；「最新文章」第一张卡即本文 Title + 封面 | `has` Title 且 href 存在 |

截图（审核过程，不进读者面）：`/tmp/zh-summer-desktop-top.png`、`calendar.png`、`grid.png`、`table.png`；`/tmp/zh-summer-mobile-*.png`；`/tmp/zh-summer-blog-card.png`；`/tmp/zh-summer-en-page.png`。

---

## 1. 路由与题文

- `curl -sI http://127.0.0.1:3003/zh/summer-crops-stardew` → **HTTP/1.1 200 OK**
- `document.title` 与可见 H1 均为：**星露谷夏天种什么：按买得到的种子和浇得完的格子选**
- 摘要句可见：夏 1 皮埃尔就卖蓝莓、甜瓜、啤酒花；杨桃要巴士进绿洲；巨大留甜瓜 3×3
- 作者：星露谷规划器团队（站点既有身份，非本页虚构）

---

## 2. 正文是否装全

`article.innerText` 含：蓝莓、甜瓜、啤酒花、杨桃、绿洲、日均、3×3。开头句为锁稿选型方法。目录含「同一套日均口径下的夏季作物比较」「巨大甜瓜按 3×3 排」。未见缺段。

---

## 3. 图文

| 图 | src | HTTP | 画面 |
|----|-----|------|------|
| 封面 | `/blog/summer-crops-stardew-cover.webp` | 200 | 夏季田：蓝莓丛、九格瓜、啤酒花架、喷壶。主题图，未写日均数字 |
| 图1 | `/blog/illustrations/summer-crop-occupancy-calendar.webp` | 200 | 夏 1–28 占用/最晚播种示意；蓝莓 4 次、甜瓜 16、杨桃/蓝莓首次 15、萝卜 22。文注明不是游戏截图 |
| 图2 | `/blog/illustrations/summer-hops-melon-blueberry-bed.webp` | 200 | 一块夏季田：甜瓜 3×3（左上角标记）+ 过道；右上啤酒花围死失败；右下洒水器占九格失败 |

图2比交接构图说明更满（混种床 + 两个失败例），仍服务「九格同种 / 洒水器占格」。手机上图内中英小字偏密，不构成必须改（图注句已写清四点）。

懒加载：首屏只解码封面；滚到图位后 `naturalWidth=1672`、`complete=true`。

---

## 4. 表格

桌面略宽于内容栏 24px，父级 `overflow-x: auto`，列内折行（西红柿、虞美人花）。手机须横滑才能看到日均/门槛/最晚播种列。未出现表盖住侧栏或撑破整页。按「不严重溢出」通过。

---

## 5. 链接抽查

页内 href（DOM）：

| 锚 | href | 本机 HTTP |
|----|------|-----------|
| 星露谷春天种什么 | `/zh/best-spring-crop-stardew` | 200 |
| 农场规划器 / 打开规划器 | `/zh#planner` | `/zh` 200 |
| 怎么赚钱 | `/zh/how-to-earn-money-stardew` | （同站既有文） |
| 星露谷洒水器 | `/zh/sprinkler-stardew` | 200 |
| 星露谷物语温室 | `/zh/glasshouse-stardew-valley` | （同站既有文） |
| 中文维基农作物等 | `https://zh.stardewvalleywiki.com/农作物` 等 | href 正确 `zh.stardewvalleywiki.com`。本环境对维基 HEAD 得 **503**，属出口站瞬时/拦截，不判本页死链 |

语言：顶栏按钮「语言」展开后 English=`/summer-crops-stardew`、中文=`/zh/summer-crops-stardew`。实测：

1. 中文文 → 点 English → `http://127.0.0.1:3003/summer-crops-stardew`，`lang=en`，H1「Summer Crops in Stardew: Rank by the Shop You Can Open This Morning」，**200**
2. 再点中文 → 回到 `http://127.0.0.1:3003/zh/summer-crops-stardew`，Title/H1 恢复中文选定句

---

## 6. 博客索引

`http://127.0.0.1:3003/zh/blog` **200**。滚动「最新文章」：第一张卡 Title 为本文、封面为本文 cover、href `/zh/summer-crops-stardew`。

---

## 7. 残留 / 导航样式

全页 HTML 抽查无：`168cccf7`、`bodyHash`、`Agent E/F/G`、`A-zh`、`PublicReference`、`FIGURE1_CONTROLLED`、`pending_title_review`、`google.com/search`、`不是个性化搜索`。

顶栏南瓜标 + 博客/语言/规划器，侧栏本页目录，底色与卡片样式与既有中文文一致。

---

## 8. 剩余风险（非必须改）

1. 图2 文件名与混种床构图宽于「左 3×3 / 右洒水器」两栏说明；图注四点仍能从画面读出。
2. 图内中英小字在 390 宽上偏挤。
3. 七列表格手机靠横滑。
4. 维基出站本次 503，需组页后线上再点验。
5. 用户终审尚未进行。

---

## 结论

桌面 + 手机均打开真实本地路由，Title/H1、正文要点、封面与两张正文图、索引卡、语言往返成立。

**PASS**

给 G 的必须改项：**0**。不要把本 PASS 当成用户终审。
