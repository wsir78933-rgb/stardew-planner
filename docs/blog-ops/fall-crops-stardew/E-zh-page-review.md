# E-zh 页面审核：fall crops stardew（zh-CN）

- 角色：Agent E-zh 页面审核（同一审核职责。不改页面、不改正文、不改标题）
- 真实本地路由：`http://127.0.0.1:3003/zh/fall-crops-stardew`
- 不把 D/F/题文 PASS 当作本页 PASS
- 用户终审：**尚未进行。** 本机页面审核通过不等于用户已批

## 浏览器工具（必须记录）

按任务硬性先跑 ego-browser。任务空间名尝试：`fall-crops-stardew-page-zh`。

| 尝试 | 结果 |
|------|------|
| 用户指定旧 API：`useOrCreateTaskSpace` + `openOrReuseTab` + `pageInfo` / `snapshotText` | 进程挂起，日志空。当前 ego-browser 是 v2，该组全局名不存在 |
| v2：`listTaskSpaces()` | 排队 **>6 分钟**，stdout 空。同机已有 `ego-browser nodejs` 占住服务（PID 68681/68691/69106 已跑约 2 小时） |
| v2：`console.log("ego-browser ready")` | 同样排队，未打印 |

**ego-browser 阻塞。** 按 `03-博客页面生成整合.md` 第七节：不可用时改用本环境受支持浏览器，并记录实际工具；**不写虚构的 ego-browser 通过记录。** 未取得 `spaceId`。

降级工具：**Playwright Chromium**（`Google Chrome for Testing`，headless）。视口由 `browser.new_context` 设定，`window.innerWidth/innerHeight` 实测。

视口：桌面 **1280×800**；手机 **390×844**（`is_mobile=true`）。

本版本页面总评：**PASS**。给 G 的必须改项：**0**。

---

## 证据摘要

| 检查 | 桌面 1280×800 | 手机 390×844 |
|------|----------------|--------------|
| 文章 HTTP | `200` `text/html; charset=utf-8` | 同路由 `200` |
| Title | 星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊 | 同 |
| H1 | 同上，可见；`h1Overflow: false`（1088×123） | 同上；`h1Overflow: false`（358×112） |
| `html lang` | `zh-CN` | `zh-CN` |
| 开头 | `秋 1 先用镰刀清掉非当季枯株`；皮埃尔秋 1 卖蔓越莓、南瓜、葡萄；展览会不是种子摊 | 同 |
| 封面 | 可见；`/blog/fall-crops-stardew-cover.webp` **200** `image/webp` 183522B；natural 1672×941；client 1086×610 | 可见；client 356×199；蔓越莓/南瓜/葡萄架/喷壶可辨 |
| 正文图1 日历 | 可见；`fall-crop-occupancy-calendar-zh.webp` **200** 44552B；1672×941 | 滚入后 complete；秋 1–28 占用条可辨 |
| 正文图2 过道 | 可见；`fall-grape-walk-zh.webp` **200** 39724B | 滚入后可见；两行架子夹空路 vs 贴死打叉 |
| 正文图3 九格 | 可见；`fall-pumpkin-3x3-zh.webp` **200** 44598B | 滚入后可见；正确九格 / 洒水器占格失败 / Giant Pumpkin 外观≠资格 |
| 表 | 7 列；`scrollWidth` 726 vs 父 702，`overflow-x: auto` | 726 vs 父 356，`overflow-x: auto`，可横滑，未盖住正文 |
| 语言切换 | 「语言」→ English `/fall-crops-stardew` lang=en → 再点中文回到本页 | 未再点菜单；桌面已走通往返 |
| `/zh/blog` | **200**；「最新文章」第一张卡即本文 Title + 封面 | 桌面已打开索引 |

截图（审核过程，不进读者面）：`/tmp/e-zh-fall-page/desktop-*.png`、`mobile-*.png`、`blog-index.png`、`en-page.png`；JSON `/tmp/e-zh-fall-page/audit.json`。

---

## 1. 路由与题文

- `http://127.0.0.1:3003/zh/fall-crops-stardew` → **HTTP 200**
- `document.title` 与可见 H1 均为：**星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊**
- 摘要句可见：现卖走蔓越莓，巨大留南瓜 3×3，葡萄先留过道；第一年没有洋蓟；甜菜要巴士；宝石甜莓 83.33 不是秋 1 默认货架
- 作者：星露谷规划器团队（站点既有身份，非本页虚构）
- JSON-LD 无 `datePublished` / `author`，未造身份日期

---

## 2. 正文是否装全

`article.innerText` 开头为锁稿句：秋 1 镰刀清枯株；夏 28 玉米不枯；皮埃尔秋 1 卖蔓越莓、南瓜、葡萄；秋 16 星露谷展览会不是种子摊。目录含「同一套日均口径下的秋季作物比较」「巨大南瓜按 3×3 排」。未见缺段、未见 canary `V7-FALL-CROPS-CANARY-9f2c1e44`。

译名：玫瑰仙子 / 西蓝花 / 宝石甜莓 / 星露谷展览会。无妖精玫瑰、无「星露谷集会」。

---

## 3. 图文

| 图 | src | HTTP | 画面 |
|----|-----|------|------|
| 封面 | `/blog/fall-crops-stardew-cover.webp` | 200 | 秋季田：左蔓越莓丛、中南瓜畦、右葡萄架、前景喷壶、远处农舍与风车。未写日均数字 |
| 图1 | `/blog/illustrations/fall-crop-occupancy-calendar-zh.webp` | 200 | 秋 1–28 占用/最晚播种：蔓越莓收日 8/13/18/23/28；南瓜两茬与一茬最晚 15。文注明不是游戏截图 |
| 图2 | `/blog/illustrations/fall-grape-walk-zh.webp` | 200 | 正确：两行架子夹一条空路；失败：两行贴死打叉 |
| 图3 | `/blog/illustrations/fall-pumpkin-3x3-zh.webp` | 200 | 正确九格同种；失败洒水器占格；Giant Pumpkin 外观 ≠ 九格资格 |

懒加载：首屏只解码封面；滚到图位后 `naturalWidth=1672`、`complete=true`。三张正文图在讲占地/过道/九格。封面不代替正文图。

---

## 4. 表格

桌面略宽于内容栏 24px，父级 `overflow-x: auto`，列内折行。手机须横滑才能看到日均/门槛/最晚播种列。未出现表盖住侧栏或撑破整页。按「不严重溢出」通过。

---

## 5. 链接与语言

页内 href：

| 锚 | href | 本机 |
|----|------|------|
| 星露谷春天种什么 | `/zh/best-spring-crop-stardew` | 同站既有 |
| 夏天怎么选 | `/zh/summer-crops-stardew` | 同站既有 |
| 怎么赚钱 | `/zh/how-to-earn-money-stardew` | 同站既有 |
| 星露谷洒水器 | `/zh/sprinkler-stardew` | 同站既有 |
| 星露谷物语温室 | `/zh/glasshouse-stardew-valley` | 同站既有 |
| 农场规划器 | `/zh#planner` | `/zh` 200 |
| 中文维基农作物 / 展览会 / 皮埃尔 等 | `https://zh.stardewvalleywiki.com/…` | href 正确 |

语言：顶栏「语言」展开后 English=`/fall-crops-stardew`、中文=`/zh/fall-crops-stardew`。实测：

1. 中文文 → 点 English → `http://127.0.0.1:3003/fall-crops-stardew`，`lang=en`，H1「Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed」，**200**
2. 再点中文 → 回到 `http://127.0.0.1:3003/zh/fall-crops-stardew`，Title/H1 恢复中文选定句

---

## 6. 博客索引

`http://127.0.0.1:3003/zh/blog` **200**。滚动「最新文章」：第一张卡 Title 为本文、封面为本文 cover、href `/zh/fall-crops-stardew`。

---

## 7. FAQ / JSON-LD / 来源

- 可见 H2 `FAQ`，6 个手风琴按钮；点开第一题后可见「茄子 20 金」答案
- 文末 H2 `来源`
- JSON-LD 1 条：`@type: Article`。**不是 FAQPage**
- `headline` / `description` 与 Title / Description 同一承诺
- 无 canary、无 `PublicReference`、无 `FIGURE1_CONTROLLED` 进读者 HTML

---

## 8. 残留 / 导航样式

全页 HTML 抽查无：`c514fd6e`、`bodyHash`、`Agent E/F/G`、`A-zh`、`pending_title_review`、`google.com/search`、`不是个性化搜索`。

顶栏南瓜标 + 博客/语言/规划器，侧栏本页目录，底色与卡片样式与既有中文文一致。

---

## 9. 剩余风险（非必须改）

1. ego-browser 本轮未连上；页面验收证据来自 Playwright Chromium。若用户要求必须在 Ego Lite 窗口里点一遍，需等队列空后再开 `fall-crops-stardew-page-zh`。
2. 七列表格手机靠横滑。
3. 图内中文小字在 390 宽上偏挤，图注句已写清职责。
4. 用户终审尚未进行。

---

## 结论

桌面 1280×800 + 手机 390×844 均打开真实本地路由。Title/H1、锁稿开头、封面与三张正文图、FAQ 手风琴、文末来源、Article JSON-LD、索引卡、语言往返成立。

**PASS**

给 G 的必须改项：**0**。不要把本 PASS 当成用户终审。

用户可打开：`http://127.0.0.1:3003/zh/fall-crops-stardew`
