# E-zh 页面审核：how to level up farming stardew（zh-CN）

- 角色：Agent E-zh 页面审核（独立成品页续审。不改页面、不改正文、不改标题、不改 `src/` / `public/` / `tests/`）
- 本会话未参加 A/B/C/D/F/G；不把 D/F/题文 PASS、G-assembly 自报 200、或源码模块存在，当作本页 PASS
- 对照输入：冻结 `handoff-zh.md`；`G-assembly.md`；`locked/zh-body.txt`；`src/blog/articles/how-to-level-up-farming-stardew.zh.tsx`（只读，确认组页对象，不代替浏览器）
- 规则：`03-博客页面生成整合.md` 第七节；`05-验收负例与测试.md` P5 / P7
- 浏览器：ego-browser v2。任务空间 `e-zh-page-recheck how-to-level-up-farming-stardew`（id **79**，已 `finish({ keep: [] })`）
- 要求真实本地路由：`http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew` 以及 `/zh/blog` 卡片
- 视口：桌面 **1280×800**（`window.innerWidth/innerHeight` 实测 1280×800）；手机 **390×844**（`Emulation.setDeviceMetricsOverride`，实测 390×844）
- 用户终审：**尚未进行。** 本机页面审核通过不等于用户已批，也不代替用户终审

锁版本：`2026-09-20-zh-how-to-level-up-farming-lock-1`  
绑定 SHA-256（handoff JSON `body` / `locked/zh-body.txt`，UTF-8 NFC，本审重算）：`d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27`  
与任务给定 hash、handoff `bodyHash`、`integrity.bodyHash`：一致。

本版本页面总评：**PASS**。给 G 的必须改项：**0**。

---

## 绑定

| 项 | 值 |
|----|----|
| 结论 | **PASS** |
| live URL | `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew` |
| 索引 URL | `http://127.0.0.1:3003/zh/blog` |
| 锁稿 hash | `d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27` |
| 审核时刻（UTC） | 2026-09-20T15:05:53Z |
| 本机 3003 | **在听**。`node` PID 11010 `TCP *:3003 (LISTEN)`。文章与 `/zh/blog` 均为 HTTP **200** |

通过只比对正文 hash 不能判定成品页通过。本审 hash 一致，且在 3003 上用 ego-browser 做了桌面/手机阅读检查。

上一审 FAIL 只因为当时 3003 连接拒绝。本审不再沿用那份 FAIL。

---

## 证据摘要

| 检查 | 桌面 1280×800 | 手机 390×844 |
|------|----------------|--------------|
| 文章 HTTP | **200** `text/html`；`document.documentElement.scrollWidth` 1274，无整页横溢 | 同路由 **200**；`innerWidth` 390，`scrollWidth` 390，无整页横溢 |
| Title | 星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150 | 同 |
| H1 | 同上，可见；`h1Overflow: false`（1088×123） | 同上，折 4 行；`h1Overflow: false`（358×112） |
| Description | 页内摘要与 `meta description` / `og:description` 均为锁稿 53 字句 | 同；首屏可见 |
| `html lang` | `zh-CN` | `zh-CN` |
| 锁稿开头 | 内层 `article` 首段：耕种经验来自收获作物、照顾动物，以及阅读星露谷年历；锄头和喷壶不加；5 级 2150、10 级 15000 | 同 |
| 封面 | 可见；`/blog/how-to-level-up-farming-stardew-cover.webp` **200**；natural 1672×941；client 1086×610。水彩农夫拔根菜 + 圆形嫩芽徽章 + 农舍 | 可见；client 356×199 |
| 正文图1 加/不加 | 滚入后 complete；在 H2「哪些动作加耕种经验…」/ H3「不加：…」段内 | 滚入后可见；格内小字偏挤，图注句可读 |
| 正文图2 只算第一个 | 滚入后可见：蓝莓 10 / 蔓越莓 14 / 土豆额外不再另给 14。在「一次收多个…」段内 | 滚入后可见；结构可辨 |
| 正文图3 等级梯子 | 滚入后可见：5=2150、8=6900、9=10000、10=15000。在累计表段内 | 累计数字可辨；底栏解锁名偏小，图注句可读 |
| 表 | 三张均 `scrollWidth=clientWidth`，无横溢 | 三张均 356=356，单元格折行，未撑破正文 |
| 农耕人内链 | 文内点第一处「农耕人还是畜牧人」→ `http://127.0.0.1:3003/zh/rancher-or-tiller-stardew` **200**，H1「星露谷农耕人还是畜牧人：20%和10%加的不是一类货」 | 同页 4 条 `href=/zh/rancher-or-tiller-stardew` |
| 语言切换 | 「语言」→ English `/how-to-level-up-farming-stardew` `lang=en` → 再点中文回到本页 | 未再点菜单；桌面已走通往返 |
| `/zh/blog` | **200**；「最新文章」第一张卡 Title + 封面；点卡片回到本文 | 390 宽第一张卡可见同一 Title + 封面；`scrollWidth=390` |

截图（审核过程，不进读者面）：`/tmp/e-zh-how-to-level-up-farming-stardew-page-recheck/`（`desktop-fold.png`、`desktop-fig1-add-or-not.png`、`desktop-fig2-first-product-retry.png`、`desktop-fig3-level-ladder.png`、`desktop-table1.png`、`desktop-table2.png`、`desktop-table3.png`、`desktop-faq1.png`、`desktop-rancher.png`、`zh-blog-card.png`、`mobile-fold.png`、`mobile-fig1-add-or-not.png`、`mobile-fig2-first-product.png`、`mobile-fig3-level-ladder.png`、`mobile-table1.png`、`mobile-table3.png`、`mobile-zh-blog-card.png`）；JSON `desktop-audit.json` / `mobile-audit.json`。

---

## 1. 路由与题文

- `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew` → **HTTP 200**
- `document.title` 与可见 H1 均为：**星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150**
- 摘要句可见：收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。
- 作者：星露谷规划器团队（站点既有身份，非本页虚构）；阅读约 14 分钟
- `robots`：`index, follow`。无 `noindex`
- canonical：`https://stardewvalleyplanner.art/zh/how-to-level-up-farming-stardew`
- hreflang：`en` / `zh-CN` / `x-default` 互指生产 URL
- OG image：`https://stardewvalleyplanner.art/blog/how-to-level-up-farming-stardew-cover.webp`（不是 `pending_media`）

**本项通过。**

---

## 2. 正文 / H2 / 经验数字

内层文章开头为锁稿句：耕种经验来自收获作物、照顾动物，以及阅读星露谷年历；技能写明使用锄头和喷壶不会获得耕种经验；5 级 2150 点，10 级一共 15000 点；经验值立即增加，升级弹窗要睡觉后才出现。

可见 H2（与锁稿一致）：

1. 哪些动作加耕种经验，哪些日常农活其实不加
2. 一株收一次给多少：公式、品质、一次多收
3. 到 5 级和 10 级要多少经验，中间会碰到哪些配方
4. 经验已经加上了，为什么还没升级弹窗
5. FAQ
6. 来源

本审在 live `article.innerText` 核对的数字均在页上：

| 数字 | 页上 |
|------|------|
| 浇水经验是 0 | 有 |
| 动物每次 5 点 | 有 |
| 年历 250 | 有 |
| 蓝莓一株 10 | 有 |
| 蔓越莓一株 14 | 有 |
| 土豆额外不再另给 14 | 有 |
| 5 级 2150 | 有 |
| 10 级 15000 | 有 |
| 2 级后缺口 1770 | 有 |
| 防风草每株 8；269 / 1875 株 | 有 |
| 野生种子 3 耕种 + 2 采集 | 有 |

作物单次表、1–10 累计表（5=2150 / 10=15000 / 防风草 269 与 1875）、解锁表（5 级畜牧人或农耕人）均在对应节。未见缺段。未见 canary `V7-ZH-FARMING-XP-A-7e19c4b2`。

---

## 3. 图文

封面不代替正文图。三张正文图均在对应段内的 `<figure>`，有 figcaption。

| 图 | src | HTTP | 画面与位置 |
|----|-----|------|------------|
| 封面 | `/blog/how-to-level-up-farming-stardew-cover.webp` | 200 | 水彩农夫、石边小畦、圆形耕种嫩芽徽章、远处农舍。无 XP 数字、无假技能栏 |
| 图1 | `/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp` | 200 | 左栏加（收获/爱抚/挤奶/剪毛/捡蛋/年历 250），右栏不加（锄地/浇水/下种/砍树/捡松露）。落在 H2-1 对照段之后 |
| 图2 | `/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp` | 200 | 「一次收多个，只记第一个」：蓝莓 10、蔓越莓 14、土豆额外不再另给 14。落在「一次收多个为什么经验不翻倍」之后 |
| 图3 | `/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp` | 200 | 1–10 累计梯子，5=2150、8=6900、9=10000、10=15000。落在累计表与 1770 缺口段之后 |

懒加载：首屏解码封面；图2/图3 在视口外时 `complete=false`，滚入后 `naturalWidth=1672`、画面画出。Chrome 实际 `currentSrc` 为对应 `.avif`。图2 第一次未滚入截到空框，滚入后重截可见，不记为缺图。

---

## 4. 表格 / 溢出

| 表 | 桌面 | 手机 |
|----|------|------|
| 作物单次耕种经验（12 行 × 3 列） | 702=702，无横溢 | 356=356，注意列折行 |
| 耕种 1 到 10 级累计经验（10 行 × 3 列） | 702=702 | 356=356 |
| 耕种等级解锁（7 行 × 2 列） | 702=702 | 356=356，第 10 级说明折行 |

整页 `documentElement.scrollWidth` 桌面 1274、手机 390，未出现表盖住侧栏或撑破正文。按「不严重溢出」通过。

---

## 5. 链接 / 语言 / 索引

页内站内 href（curl 均为 **200**）：

| 锚 | href |
|----|------|
| 农耕人还是畜牧人（文内 3 处 + 来源 1 处） | `/zh/rancher-or-tiller-stardew` |
| 星露谷洒水器 | `/zh/sprinkler-stardew` |
| 第一年怎么赚钱 | `/zh/how-to-earn-money-stardew` |
| 春天种什么 | `/zh/best-spring-crop-stardew` |
| 夏天种什么 | `/zh/summer-crops-stardew` |
| 秋季作物 | `/zh/fall-crops-stardew` |
| 农场规划器 | `/zh` 与 `/zh#planner` |

实测：从正文点「农耕人还是畜牧人」进入畜牧人/农耕人专页，中文 H1 正确。

语言：顶栏「语言」展开后 English=`/how-to-level-up-farming-stardew`、中文=`/zh/how-to-level-up-farming-stardew`。实测：

1. 中文文 → 点 English → `http://127.0.0.1:3003/how-to-level-up-farming-stardew`，`lang=en`，H1「How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150」，**200**
2. 再点中文 → 回到 `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew`，Title/H1 恢复中文选定句

`http://127.0.0.1:3003/zh/blog` **200**。滚动「最新文章」：第一张卡 Title 为本文、封面为本文 cover、href `/zh/how-to-level-up-farming-stardew`。从卡片点回本文，Title/H1 正确。手机 390 同一张卡可见。

---

## 6. 残留 / JSON-LD / FAQ

- 可见 H2 `FAQ`，5 个手风琴按钮；点开第一题后可见「不能。锄头和喷壶本身不加耕种经验」
- 文末 H2 `来源`
- JSON-LD 1 条：`@type: Article`。**不是 FAQPage**
- `headline` / `description` 与 Title / Description 同一承诺
- live HTML 抽查无：`V7-ZH-FARMING-XP-A-7e19c4b2`、`bodyHash`、`lockVersion`、`PublicReference`、`PublicBlogHandoff`、`pending_media`、`Agent E` / `Agent F` / `Agent G`、`A-zh`、`C-zh-draft`、`google.com/search`、`不是个性化搜索`、绑定 hash 字符串

顶栏南瓜标 + 博客/语言/规划器，侧栏本页目录，底色与卡片样式与既有中文文一致。`BlogSources` 仍注入站点既有规划器 CTA，不是锁稿新加的促销句。

---

## 7. 给 G 的必须改项

无。

不要把 hash 一致或 G-assembly 旧 200 单独写成页面已通过；本 PASS 依据的是 3003 上 ego-browser 桌面/手机阅读检查。

---

## 8. 剩余风险 / 未做

1. 用户终审尚未进行。本 PASS 不是用户批准。
2. 生产站未发布。canonical / hreflang / JSON-LD URL 指向 `stardewvalleyplanner.art`，本机只证明 3003 成品。
3. 封面中英共用一张水彩；中文 alt 描述该画面。不挡本页阅读。
4. 手机 390 上图1 格内标签、图3 底栏解锁名偏小，须靠图注和正文读全。桌面可读。不升为必须改。
5. 未代 G 改开发服务，未改网站。

---

## 结论

桌面 1280×800 + 手机 390×844 均打开真实本地路由 `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew`。Title/H1/Description、锁稿开头与 H2、经验数字、封面与三张段内正文图、三张表无整页溢出、文内农耕人内链、FAQ 手风琴、文末来源、Article JSON-LD、`/zh/blog` 卡片、语言往返成立。残留标记未进读者 HTML。

**PASS**

给 G 的必须改项：**0**。不要把本 PASS 当成用户终审。

用户可打开：`http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew`
