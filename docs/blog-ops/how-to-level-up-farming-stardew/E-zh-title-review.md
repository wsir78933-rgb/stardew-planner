# E-zh 题文与交接审核：how to level up farming stardew（zh-CN）

- 角色：Agent E-zh-title（锁后题文与公开交接续审。不写 Title/H1/Description，不改正文，不组页）
- 本会话未参加 A/B/C/D/F；不把 F 的筛选记录或 E 正文 PASS 当作本题文结论
- 对照输入：用户主词 `how to level up farming stardew`；中文主词「星露谷 耕种怎么升级」；`A-zh-research.md` / `A-zh-facts.md`；`B-zh-layout.md`；`F-zh-lock.md`；`handoff-zh.md`；`public-refs-zh.json`；`locked/zh-body.txt`；`参考规则/标题与描述规则.md`；`参考规则/七罪引擎.md`；`04-公开交接与页面装配.md`
- 规则：SEOTruth 由 E 签；F 不得自行放行。E 只出问题清单、建议与审核结论，不直接改题面
- 知情但不代替判断：D-zh / E-zh 正文对本 hash **PASS**；F 状态 `title_pending`，未签 SEOTruth

锁版本：`2026-09-20-zh-how-to-level-up-farming-lock-1`  
锁文件：`docs/blog-ops/how-to-level-up-farming-stardew/locked/zh-body.txt`  
读者正文指纹：「耕种经验来自收获作物、照顾动物，以及阅读星露谷年历」  
绑定 SHA-256（UTF-8 NFC LF，rstrip，本审重算）：`d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27`  
与 F 所报、E 正文、handoff `bodyHash`、`public-refs-zh.json`：一致。handoff JSON `body` 字节与锁文件一致。

本版本总评：**PASS**。必须修改条数：**0**。不退 F 改表面，不退 C，不退 A/B。不改正文。未改 `src/`。

---

## 0. 审什么、不审什么

本题审：Title / H1 / Description / slug 是否与**已锁正文**兑现同一主承诺；停留与适配是否指向正文已有判断；近 3 篇去套路是否真实读取；公开引用 URL 是否真实、quote 是否落在锁稿；公开交接 JSON 有无内部检索痕迹。

本题不审：Length（F 已计 2336）；22 条正文鉴文（E-zh 已对本 hash PASS）；成图 webp / 本地页面（content-only，第八层尚未进行）。

---

## 1. 题面（F 选定，E 不改写）

| 字段 | 文本 | 字符数（本审重计） |
|------|------|-------------------|
| Title | 星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150 | 27 |
| H1 | 星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150 | 27 |
| Description | 收获、摸动物、读年历才加。蓝莓一株只记10点，品质星不加。10级一共15000；经验立刻到账，弹窗要睡觉。 | 53 |
| slug | `how-to-level-up-farming-stardew` | 用户锁定，未改 |

Title = H1。本站 `app/zh/[slug]/page.tsx` 的 `generateMetadata.title` 与 `BlogArticleContent` 的 `<h1>` 都用 `post.title`，`src/seo/page-metadata.ts` **不加品牌后缀**。F 写成同一字符串符合现网模板。OG title/description 与 seo 主字段相同。

JSON-LD：`Article`，`doNotEmitFAQPage: true`。与 B 卡、锁稿 FAQ 可见但不发 FAQPage 一致。

---

## 2. SEOTruth：题面承诺 ↔ 锁稿

核心承诺（B 主意图，F §4 抽取，本审对照锁稿）：弄清耕种经验从哪些动作来、哪些日常农活其实不加，并据此把耕种技能推到 5 级（累计 2150）和 10 级（累计 15000）。

| 表面原句 | 所需支撑 | 锁稿对应 | 结果 |
|----------|----------|----------|------|
| 星露谷耕种怎么升级 | 中文主词；how-to 把耕种升上去 | 开头三句；H2-1→H2-4；FAQ | 同一主意图 |
| 浇水和锄地不加经验 | 浇水/锄地本身 0 耕种经验 | 「使用锄头和喷壶不会获得耕种经验」；「把格子锄出来、把水浇上、把种子点进土里，这三步本身都不加耕种经验」；H2-1「把田浇完、锄完…技能条仍可能一格不动」 | 真。动作名对应工具名，不是树文「树要不要浇水」 |
| 5级要2150 | 5 级累计门槛 2150 | 「5 级 2150 点」；累计表 5 = 2150；「5 级要 2150」（H2-4 分流第 3 条） | 真。是从 0 到 5 的累计，不是每级再要 2150。描述用「10级一共15000」补累计口径 |
| 收获、摸动物、读年历才加 | 加经验的主来源，对浇水/锄地 | 开篇第一句；H3「会加：收获、照顾动物、读年历」；图1 alt 含「摸动物」 | 真。「才加」相对标题里的浇水/锄地，不是否认星之书/野生种子例外（正文已写） |
| 蓝莓一株只记10点 | 多产物只算第一个；蓝莓 10 | 「蓝莓这一株是 10 点，不是 10 乘浆果数」 | 真。描述写「10点」、正文写「10 点」，数字同一 |
| 品质星不加 | 银/金/铱不加额外经验 | 「银星、金星、铱星不加额外经验」；「品质星不加额外经验」 | 真 |
| 10级一共15000 | 10 级累计 15000，不是 9 级后再另要一份 | 「10 级一共 15000 点」；「10 级不是在 9 级之后再另要 15000」 | 真 |
| 经验立刻到账，弹窗要睡觉 | 经验立即加；升级窗口过夜 | 「经验值立即增加，升级弹窗要睡觉后才出现」；「不是经验要睡觉才入账」 | 真 |

未在题面承诺、正文也禁止的：最快、实测、浇水能升、冲八级做小桶、畜牧人还是农耕人怎么选、规划器会算耕种经验、星之书中文专页已核验 250、灰机 12 株 / 蓝莓 14。题面均未出现。

FAQ 5 题问答均在锁稿 FAQ 节原文出现（本审逐条 `in body`）。未在 SEO 阶段补新事实。

**SEOTruth：通过。** 未命中负例 S5 / S12。

---

## 3. 七罪方法是否实际执行（审过程，不起新标题）

F-zh-lock §6 先列 10 组不标公式的方向，§7 后归类，§8 做停留与适配，选定 #1（结论前置 + 异常/捷径）。不是只写两个清楚标题（S10），也不是先按六种机制配额生成（S11）。

本审独立停留：目标读者刚浇完一圈、默认喷壶次数能推耕种条。标题先挡住浇水/锄地，并给出 5 级 2150。信息差来自 A 已打开灰机/TapTap「浇水或种植能升级」与官方技能页冲突，锁稿 H2-1 接得住。不能只用「有吸引力」通过。

本审独立适配：

- 数字 2150、15000、10 均在锁稿
- 浇水/锄地不加为真（中文技能页「使用锄头和喷壶不会获得经验」；英文 Skills「Using a hoe or watering can does not grant experience by itself」）
- 点名对象是要升耕种的玩家，不是树苗邻格
- 主任务方法：加/不加在标题，5/10、多产物、睡觉在描述；正文四节写全
- 情绪未夸张，无「最快」「必升」

#3/#5/#10 主承诺偏窄，F 未选，合理。#6 备选（「有的攻略说浇水能升」）本审**不必换签**：本 Title 的「浇水」落在耕种经验，前缀是「星露谷耕种怎么升级」，与树文任务不同。

---

## 4. 近 3 篇去套路（独立读取，不抄 F 口头）

来源：`src/blog/blog-post-registry.tsx` 中文数组末三篇（已发布）。`blogPostSlugs` 现 17 条，末条为 `do-you-have-to-water-trees-stardew`。

| slug | zh title |
|------|----------|
| summer-crops-stardew | 星露谷夏天种什么：按买得到的种子和浇得完的格子选 |
| fall-crops-stardew | 星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊 |
| do-you-have-to-water-trees-stardew | 星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3 |

F 所引三篇与 registry 一致，不是未读却填通过（S13）。

去的是结构，不是禁用主词：

- 不是「季节种什么：按买得到的种子和浇得完的格子选」
- 不是「季节作物：某摊某日卖 A/B，节日不是摊」
- 不是「要不要浇水？对象 A 查 X，对象 B 查 Y」
- 不是邻近职业文「A 还是 B：百分比加的不是一类货」

本 Title 是「主词 + 浇水/锄地不加 + 5 级 2150」。主词「星露谷耕种怎么升级」自然出现在开头。未占用 `rancher-or-tiller-stardew` 等 `doNotOccupy` slug。`how-to-level-up-farming-stardew` 不在现 `blogPostSlugs`。

作者字段「星露谷规划器团队」与全部中文 registry 条目一致，有独立站点依据，不是 Schema 编造（S7）。

---

## 5. 公开引用真实

`public-refs-zh.json` 与 handoff JSON `publicReferences` **字节级相同**。13 个来源，`appliesTo` 共 **28** 条 quote。本审对锁稿 NFC 文本计数：28/28 均为 `occurrence=1`，无 0、无重复错位。

| id | URL | 本次打开 |
|----|-----|----------|
| wiki-farming-zh | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn | 已打开。经验来源、公式、品质不加、多产物一次、防风草株数、立刻加/睡觉结算 |
| wiki-skills-zh | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn | 已打开。「使用锄头和喷壶不会获得经验。」累计 5=2150、10=15000 |
| wiki-almanac-zh | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn | 已打开。「阅读即可获得 250 点耕种经验」 |
| wiki-farming-en | https://stardewvalleywiki.com/Farming | HTTP 200。Almanac 与 Book Of Stars 同一句 250 Farming XP |
| wiki-skills-en | https://stardewvalleywiki.com/Skills | HTTP 200。锄/喷壶不加经验；同一张累计表 |
| wiki-almanac-en | https://stardewvalleywiki.com/Stardew_Valley_Almanac | HTTP 200。Upon reading… 250 Farming XP |
| site-rancher-zh | https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew | HTTP 200 |
| site-sprinkler-zh | https://stardewvalleyplanner.art/zh/sprinkler-stardew | HTTP 200 |
| site-money-zh | https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew | HTTP 200 |
| site-spring-zh | https://stardewvalleyplanner.art/zh/best-spring-crop-stardew | HTTP 200 |
| site-summer-zh | https://stardewvalleyplanner.art/zh/summer-crops-stardew | HTTP 200 |
| site-fall-zh | https://stardewvalleyplanner.art/zh/fall-crops-stardew | HTTP 200 |
| site-home-zh | https://stardewvalleyplanner.art/zh | HTTP 200 |

引用支持性：题面用到的锄/喷壶 0 经验、2150/15000、收获才加、蓝莓只算第一个、品质星不加、年历 250、立刻加/睡觉结算，均可对上已打开维基，不是死链或首页冒充专页。本站内链是已发布页，不是编造 URL。

**公开引用：通过。**

---

## 6. 交接有无内部检索痕迹

公开对象是 `handoff-zh.md` 内 `PublicBlogHandoff` JSON（status=`title_pending`，`frozen=false`）。

JSON 中未出现：SERP / PAA / `gl=cn` / 灰机 / TapTap / huiji / 查询 1 / 任务卡 / canary / `/tmp/` / `docs/blog-ops` / ResearchTrace / H2-1 / I1 / prompt。正文 `body` 无检索日志。`publicReferences` 只有来源标题、公开 URL、quote、occurrence。

文件 Markdown 头有「Agent F-zh」角色行，属于编辑侧包装，不在 JSON 公开字段，不渲染给读者。

`publicRequirements.registry.articleModulePath` = `src/blog/articles/how-to-level-up-farming-stardew.zh.tsx` 是组页槽位，不是检索日志。content-only 且尚未 freeze，不升格必须改。

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
2. Title「5级要2150」口语上也可被读成「还差 2150」。锁稿与描述的「一共 15000」、累计表可纠正；未升格。不必改成 F 备选 #4/#6。
3. `articleModulePath` 含 `src/`。freeze 前 F 可决定是否保留给 G；不是检索痕迹失败。
4. E 正文第 9 节剩余风险（规划器句、白天技能栏句、作物表行序）仍不改正文。

---

## 10. 结论

| 项 | 结果 |
|----|------|
| 绑定 hash | `d77f29ea7cdc7948408ed0e2ad4e32bbcfa39da04af8a76bd424adbb9a220e27` |
| Title / H1 / Description 同一承诺 | 通过 |
| 停留 / 适配 / 近 3 篇去套路 | 通过（registry 末三篇已独立读取） |
| slug | 用户锁定；未占用现文 |
| SEOTruth | **PASS** |
| 公开引用 | 28/28 quote n=1；维基已打开；本站 HTTP 200 |
| 交接检索痕迹 | 无 |
| 用户终审 | 尚未进行（content-only） |
| 必须修改 | **0** |
| 本题文 | **PASS** |

F 可在本题文 PASS 后把交接从 `title_pending` 推进到冻结公开交接。本组 content-only：仍不改 `src/` / `app/` / `public/`，不组页。
