# E-en 题文与交接审核：how to level up farming stardew（en / US）

- 角色：Agent E-en-title（锁后题文与公开交接续审。不写 Title/H1/Description，不改正文，不组页）
- 本会话未参加 A/B/C/D/F；不把 F 的筛选记录或 E 正文 PASS 当作本题文结论
- 对照输入：用户主词 `how to level up farming stardew`；`A-en-research.md` / `A-en-facts.md`；`B-en-layout.md`；`F-en-lock.md`；`handoff-en.md`；`public-refs-en.json`；`locked/en-body.txt`；`参考规则/标题与描述规则.md`；`参考规则/七罪引擎.md`；`04-公开交接与页面装配.md`
- 规则：SEOTruth 由 E 签；F 不得自行放行。E 只出问题清单、建议与审核结论，不直接改题面
- 知情但不代替判断：D-en / E-en 正文对本 hash **PASS**；F 状态 `title_pending`，未签 SEOTruth

锁版本：`2026-09-20-en-how-to-level-up-farming-lock-1`  
锁文件：`docs/blog-ops/how-to-level-up-farming-stardew/locked/en-body.txt`  
读者正文指纹：「Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest)」  
绑定 SHA-256（UTF-8 NFC LF，rstrip，本审重算）：`1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`（21842 bytes）  
与 F 所报、E 正文读者 hash、C 同切段、handoff `bodyHash`、`public-refs-en.json`：一致。handoff JSON `body` 字节与锁文件一致。C 整文件 SHA-256：`bc89ddab2e9dc4d4d7ef5baea9cf57ac20cc74ec7ae7609b1416d40c2e6c14bf`。

本版本总评：**PASS**。必须修改条数：**0**。不退 F 改表面，不退 C，不退 A/B。不改正文。未改 `src/`。

---

## 0. 审什么、不审什么

本题审：Title / H1 / Description / slug 是否与**已锁正文**兑现同一主承诺；停留与适配是否指向正文已有判断；近 3 篇去套路是否真实读取；公开引用 URL 是否真实、quote 是否落在锁稿；公开交接 JSON 有无内部检索痕迹。

本题不审：Length（F 已计 mechanical_units 2863）；22 条正文鉴文（E-en 已对本 hash PASS）；成图 webp / 本地页面（content-only，第八层尚未进行）。

---

## 1. 题面（F 选定，E 不改写）

| 字段 | 文本 | 字符数（本审重计） |
|------|------|-------------------|
| Title | How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150 | 85 |
| H1 | How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150 | 85 |
| Description | Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep. | 234 |
| slug | `how-to-level-up-farming-stardew` | 用户锁定，未改 |

Title = H1。本站 `app/(en)/[slug]/page.tsx` 的 `generateMetadata.title` 与 `BlogArticleContent` 的 `<h1>` 都用 `post.title`，`src/seo/page-metadata.ts` **不加品牌后缀**。F 写成同一字符串符合现网模板。OG title/description 与 seo 主字段相同。

JSON-LD：`Article`，`doNotEmitFAQPage: true`。与 B 卡默认无 FAQ H2、锁稿无 FAQ 节、现网 `createArticleStructuredData` 的 `@type: Article` 一致。`seo.faq` 为 `null`。未在 SEO 阶段补新事实。

作者字段将用「Stardew Valley Planner Team」，与全部英文 registry 条目一致，有独立站点依据，不是 Schema 编造（S7）。

---

## 2. SEOTruth：题面承诺 ↔ 锁稿

核心承诺（B 选定 I2，F §4 抽取，本审对照锁稿）：用游戏真正给的 Farming XP 把耕种技能升到点名等级，并停止把锄地、浇水、多出来的浆果/土豆、松露当成 Farming XP。

| 表面原句 | 所需支撑 | 锁稿对应 | 结果 |
|----------|----------|----------|------|
| How to Level Up Farming in Stardew | 用户主词；how-to 把 Farming 升上去 | 开头三句；H2-1→H2-4；Sources | 同一主意图 I2。主词自然出现在标题开头，未堆第二次 stardew |
| Watering and Hoeing Add 0 XP | 浇水/锄地本身 0 Farming XP | 「Using a hoe or a watering can does not grant Farming XP by itself」；H3「Watering and hoeing do not grant Farming XP」；「The hoe and can themselves add 0 Farming XP」；「Watering is not the XP action」 | 真。动作落在耕种 XP，不是树文「树要不要浇水」 |
| Level 5 Needs 2,150 | 5 级累计门槛 2,150 | 「2,150 for level 5」；累计表 `| 5 | 2,150 |` | 真。是从 0 到 5 的累计，不是每级再要 2,150。描述用「Level 10 is 15,000 total」补累计口径 |
| Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP | 加经验的主来源 | 开篇第一句；H3「Animals are 5 XP; the Almanac and Book of Stars are 250」；图1 alt 含 5 / 250 | 真。两本书分开写，未并成一本 |
| A blueberry pull is 10 XP, not 10 times the berry count | 多产物只算第一个；蓝莓 10 | 「A blueberry pull that yields three berries still grants 10 Farming XP once」 | 真。描述写 10 XP，正文写 10 Farming XP once，数字同一 |
| Quality stars add none | 银/金/铱不加额外经验 | 「Quality does not change the XP」；「High-quality crops grant the same amount of XP as normal-quality crops」 | 真 |
| Level 10 is 15,000 total | 10 级累计 15,000，不是 9 级后再另要一份 | 「15,000 for 10」；表 `| 10 | 15,000 |`；「increment from 9 to 10 as +5,000 XP, from a 10,000 total to 15,000」 | 真 |
| XP posts now, the popup waits for sleep | 经验立即加；升级窗口过夜 | 「Experience is added when the harvest … happens」；「The level-up window does not appear until after you sleep」 | 真 |

未在题面承诺、正文也禁止的：fastest crop；XP per day；we measured / harvest test；watering grants XP；Year 1 calendar to 8/9；Rancher vs Tiller 怎么选；keg profit；Winter Seeds XP = 3 or 0；planner computes Farming XP。题面均未出现。锁稿里的 `fastest` 两处都是否认句（「the table does not name a fastest crop」），不是标题承诺。

无 FAQ，无需逐条 `in body`。

**SEOTruth：通过。** 未命中负例 S5 / S12。

---

## 3. 七罪方法是否实际执行（审过程，不起新标题）

F-en-lock §6 先列 10 组不标公式的方向，§7 后归类，§8 做停留与适配，选定 #1（结论前置 + 异常/捷径）。不是只写两个清楚标题（S10），也不是先按六种机制配额生成（S11）。

本审独立停留：目标读者刚浇完一圈或挥完锄，默认喷壶次数能推 Farming 条。标题先挡住 watering/hoeing，并给出 level 5 = 2,150。信息差来自 A 已打开 related「Does watering increase farming stardew」与 wiki Skills「Using a hoe or watering can does not grant experience by itself」冲突，锁稿 H2-1 H3 接得住。不能只用「有吸引力」通过。

本审独立适配：

- 数字 0、2,150、10、15,000、5、250 均在锁稿
- 浇水/锄地不加为真（本审已打开 Skills：「Using a hoe or watering can does not grant experience by itself」；累计表 5 = 2150、10 = 15000）
- 点名对象是要升 Farming 的玩家，不是树苗邻格
- 主任务方法：加/不加与 5 级门槛在标题，10 级、多产物、品质、两本书、睡觉弹窗在描述；正文四节写全
- 情绪未夸张，无 fastest / we measured / 必升

#3（蓝莓 10）主承诺偏窄，F 未选，合理。#5 只覆盖弹窗分流，不是整份 I2。#10 株数是量级工具，不是来源规则。#6 备选（watering vs harvest）本审**不必换签**：本 Title 的 Watering 落在 Farming XP，前缀是 How to Level Up Farming，与树文「Do You Have to Water Trees… Check Stage 4 and the Fruit-Tree 3×3」任务不同。

---

## 4. 近 3 篇去套路（独立读取，不抄 F 口头）

来源：`src/blog/blog-post-registry.tsx` 英文数组末三篇（已发布）。`blogPostSlugs` 现 17 条，末条为 `do-you-have-to-water-trees-stardew`。

| slug | EN title |
|------|----------|
| summer-crops-stardew | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| fall-crops-stardew | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| do-you-have-to-water-trees-stardew | Do You Have to Water Trees in Stardew Valley? Check Stage 4 and the Fruit-Tree 3×3 |

F 所引三篇与 registry 一致，不是未读却填通过（S13）。

去的是结构，不是禁用主词：

- 不是「{Season} Crops in Stardew: Rank by the Shop You Can Open This Morning」
- 不是「{Season} Crops in Stardew: {g} at Pierre's, {g} Needs a Rare Seed」
- 不是「Do You Have to Water {X} in Stardew Valley? Check {A} and {B}」
- 不是邻近职业文「{A} or {B} in Stardew: Farming 5 Also Locks Your Farming 10 Pair」

本 Title 是「主词 + watering/hoeing 加 0 XP + level 5 要 2,150」。主词 How to Level Up Farming in Stardew 自然出现在开头。未占用 `rancher-or-tiller-stardew` 等 `doNotOccupy` slug。`how-to-level-up-farming-stardew` 不在现 `blogPostSlugs`。

---

## 5. 公开引用真实

`public-refs-en.json` 的 `publicReferences` 与 handoff JSON `publicReferences` **对象相等**。20 个来源，`appliesTo` 共 **33** 条 quote。本审对锁稿 NFC 文本计数：31/33 为 `occurrence=1` 且 `n=1`；2 条短链片段 `n=2`，handoff 保留 C 的 `occurrence: 1`（1-based 第一次出现，不是声称唯一）。无 n=0。

n=2 且 occurrence=1 的第一次出现均在 H2-1 洒水器句，第二次在等级表单元格，与 F §3 一致：

- `wiki-quality-sprinkler` quote `[Quality Sprinkler](https://stardewvalleywiki.com/Quality_Sprinkler)`
- `wiki-iridium-sprinkler` quote `[Iridium Sprinkler](https://stardewvalleywiki.com/Iridium_Sprinkler)`

| id | URL | 本次打开 |
|----|-----|----------|
| wiki-home | https://stardewvalleywiki.com/Stardew_Valley_Wiki | HTTP 200 |
| wiki-farming | https://stardewvalleywiki.com/Farming | 已打开。收获/畜牧/两本书来源表；多产物只算第一个；品质不加；蓝莓表细胞 10；立即加/睡觉结算 |
| wiki-farming-xp | https://stardewvalleywiki.com/Farming#Experience_Points | 同上页锚点。HTTP 200 |
| wiki-skills | https://stardewvalleywiki.com/Skills | 已打开。「Using a hoe or watering can does not grant experience by itself。」累计 5=2150、10=15000；技能页立刻显示、弹窗过夜 |
| wiki-almanac | https://stardewvalleywiki.com/Stardew_Valley_Almanac | 已打开。「Upon reading the book, players will earn 250 Farming XP」 |
| wiki-book-of-stars | https://stardewvalleywiki.com/Book_Of_Stars | 已打开。250 XP in all skills；Bookseller 15,000g，25% chance |
| wiki-keg | https://stardewvalleywiki.com/Keg | HTTP 200 |
| wiki-sprinkler | https://stardewvalleywiki.com/Sprinkler | HTTP 200 |
| wiki-quality-sprinkler | https://stardewvalleywiki.com/Quality_Sprinkler | HTTP 200 |
| wiki-iridium-sprinkler | https://stardewvalleywiki.com/Iridium_Sprinkler | HTTP 200 |
| wiki-seed-maker | https://stardewvalleywiki.com/Seed_Maker | HTTP 200 |
| wiki-winter | https://stardewvalleywiki.com/Winter | HTTP 200 |
| wiki-winter-seeds | https://stardewvalleywiki.com/Winter_Seeds | HTTP 200 |
| planner-rancher | https://stardewvalleyplanner.art/rancher-or-tiller-stardew | HTTP 200 |
| planner-sprinkler | https://stardewvalleyplanner.art/sprinkler-stardew | HTTP 200 |
| planner-money | https://stardewvalleyplanner.art/how-to-earn-money-stardew | HTTP 200 |
| planner-spring | https://stardewvalleyplanner.art/best-spring-crop-stardew | HTTP 200 |
| planner-summer | https://stardewvalleyplanner.art/summer-crops-stardew | HTTP 200 |
| planner-fall | https://stardewvalleyplanner.art/fall-crops-stardew | HTTP 200 |
| planner-greenhouse | https://stardewvalleyplanner.art/glasshouse-stardew-valley | HTTP 200 |

引用支持性：题面用到的锄/喷壶 0 经验、2150/15000、收获才加、蓝莓只算第一个且表细胞 10、品质星不加、年历 250、Book Of Stars 250、立刻加/睡觉结算，均可对上已打开维基，不是死链或首页冒充专页。本站内链是已发布页，不是编造 URL。

**公开引用：通过。**

---

## 6. 交接有无内部检索痕迹

公开对象是 `handoff-en.md` 内 `PublicBlogHandoff` JSON（status=`title_pending`，`frozen=false`）。

JSON 中未出现：SERP / PAA / `gl=us` / `pws=0` / canary / `/tmp/` / `docs/blog-ops` / ResearchTrace / I1 / I2 / prompt / Query 1 / task card。正文 `body` 无检索日志。`publicReferences` 只有来源标题、公开 URL、quote、occurrence。

JSON 中出现的 `H2-1` 两处均在 `publicRequirements.figures[].placement`（组页槽位，不是检索日志）。`publicRequirements.registry.articleModulePath` = `src/blog/articles/how-to-level-up-farming-stardew.en.tsx` 同样是组页槽位。content-only 且尚未 freeze，不升格必须改。

文件 Markdown 头有「Agent F-en」角色行，属于编辑侧包装，不在 JSON 公开字段，不渲染给读者。

**交接检索痕迹：通过。**

---

## 7. 必须修改

无。

不当标题才退 F 改表面。正文缺口才作废本锁。本题两者都未命中。

---

## 8. 第八层 / 用户终审

尚未进行（content-only）。等网站成品页。本题文 PASS 不能沿用为页面通过。组页后须再看真实 Title/H1/Description、图文与链接。

---

## 9. 剩余风险（非必须改）

1. 成图 webp 与封面仍 `pending_media`。组页后核对，不挡本题文。
2. Title「Level 5 Needs 2,150」口语上也可被读成「还差 2,150」。锁稿累计表与描述的「Level 10 is 15,000 total」可纠正；未升格。不必改成 F 备选 #4/#6。
3. `articleModulePath` 含 `src/`；figure `placement` 含编辑用 H2-1。freeze 前 F 可决定是否保留给 G；不是检索痕迹失败。
4. E 正文剩余风险（energy gloss on proficiency、Almanac infobox list、scythe 1.3.27、Book Of Stars 15,000g/25%、Winter Seeds「including 3 and including 0」方法注、规划器句）仍不改正文。
5. 两条 sprinkler 短链 quote `n=2`、`occurrence: 1` 指向第一次出现。装配时按第一次实例核即可，不必为 uniqueness 改正文。

---

## 10. 结论

| 项 | 结果 |
|----|------|
| 绑定 hash | `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35` |
| Title / H1 / Description 同一承诺 | 通过 |
| 停留 / 适配 / 近 3 篇去套路 | 通过（registry 英文末三篇已独立读取） |
| slug | 用户锁定；未占用现文 |
| SEOTruth | **PASS** |
| 公开引用 | 33 条 quote：31 n=1，2 n=2 且 occurrence=1；维基已打开；本站 HTTP 200 |
| 交接检索痕迹 | 无（JSON 公开字段） |
| 用户终审 | 尚未进行（content-only） |
| 必须修改 | **0** |
| 本题文 | **PASS** |

F 可在本题文 PASS 后把交接从 `title_pending` 推进到冻结公开交接。本组 content-only：仍不改 `src/` / `app/` / `public/`，不组页。
