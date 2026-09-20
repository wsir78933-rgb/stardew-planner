# A-zh 事实表：how to level up farming stardew

- 角色：Agent A-zh
- 核验日：2026-09-20
- 游戏版本优先：1.6.15（仓库资源；维基页多数不写该补丁号）
- 浏览器：ego-browser TaskSpace 14
- **主意图未选定，由 B 依据 `A-zh-research.md` 与本表证据选择。**
- 四类分开。摘要不等于核验。未打开的来源不得当主题知识。
- 未做游戏内存档实测。不得写「我们测过」。

内部 canary：`V7-ZH-FARMING-XP-A-7e19c4b2`（仅 `.internal-canary.txt`；英文 A 当时尚未写该目录）。

---

## 工具事实（本站官方页）

| ID | 拟用措辞 | 来源 | 证据位置 | 核验日 | 局限 | 可公开 |
|----|----------|------|----------|--------|------|--------|
| T1 | 中文首页 H1 是「星露谷物语规划器免费在线农场布局工具」；title「星露谷农场规划器」；`lang=zh-CN` | https://stardewvalleyplanner.art/zh | 已打开 `document.title` / `h1` / `documentElement.lang` | 2026-09-20 | 只证明当日线上首页 | 是 |
| T2 | 站点说明：在浏览器里试排 8 种农场，摆建筑和作物，检查四季与覆盖 | 同上首页正文 | 「别等建筑落地后才发现布局不顺…试排 8 种农场」；功能 01–03 | 2026-09-20 | 不是游戏内规则 | 是 |
| T3 | 规划器可开标准、河流、森林、山顶、荒野、四角、海滩、草原，地图选择器里还有姜岛 | 同上 FAQ / 功能 01 | 「标准、河流、森林、山顶、荒野、四角、海滩、草原都能开。地图选择器里还有姜岛。」 | 2026-09-20 | | 是 |
| T4 | 洒水器、稻草人、蜂房、祝尼魔小屋的覆盖范围可以打开查看 | 同上 FAQ | 「春夏秋冬都能切。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以打开。」 | 2026-09-20 | 覆盖可视化 ≠ 游戏浇水/经验规则 | 是 |
| T5 | 项目保存在当前浏览器；没有账号、没有云同步；换设备或清数据会丢 | 同上 FAQ「会丢吗？」 | 原文 | 2026-09-20 | | 是 |
| T6 | 存档导入是实验功能，模组物品可能对不上；可导出普通和高清截图 | 同上 FAQ | 原文 | 2026-09-20 | | 是 |
| T7 | 中文博客索引 H1「星露谷农场规划指南」；列表含职业文、赚钱文、洒水器文、春夏秋作物文、温室文；**没有**耕种升级专页 | https://stardewvalleyplanner.art/zh/blog | 已打开列表链接 | 2026-09-20 | 索引分页可能未显示全部；对照 identities 全 slug | 是 |
| T8 | sitemap 共 42 条 loc，含全部现有中英文博文路径；**没有** `/zh/how-to-level-up-farming-stardew` 或英文对应 slug | https://stardewvalleyplanner.art/sitemap.xml | 抽取全部 `<loc>` | 2026-09-20 | registry 另有 `do-you-have-to-water-trees-stardew`，sitemap 无该 loc | 是 |
| T9 | `blogPostSlugs` 无 `how-to-level-up-farming-stardew` | `src/blog/blog-post-identities.ts` | 文件内 17 个 slug | 2026-09-20 | 本地源码，不是线上 HTML | 内部 |
| T10 | 已打开首页、博客、7 篇相关中文文，**未见**耕种经验、技能等级或收获经验计算器 | 本站官方页 | 首页功能/FAQ；各文 H1/H2 | 2026-09-20 | 未穷尽全站每个组件；否定观察只覆盖已打开页 | 是（须写「已打开页未见」，不能写成「规划器绝对不能」的未测结论） |

规划器不能用来证明作物给多少经验。工具文档没有证实的第三方规则去维基。

---

## 主题知识（已打开维基正文）

适用：星露谷规则。冲突时以**官方中文维基 + 英文维基对照**为准；灰机/门户冲突单独列入。维基页本身多数不写 1.6.15。

| ID | 类型 | 拟用措辞 | 来源 | 证据位置 | 版本/局限 | 可公开 |
|----|------|----------|------|----------|-----------|--------|
| K1 | 主题知识 | 耕种等级在暂停菜单的技能列表中查看。每升一级，锄头和喷壶熟练度 +1 | 中文维基耕种；英文 Farming | 耕种技能段 | 页未标 1.6.15 | 是 |
| K2 | 主题知识 | 耕种经验来源：收获农作物；爱抚动物；挤牛奶或羊奶；剪羊毛；在鸡舍或畜棚采集蛋、鸭毛、动物毛、兔子的脚；阅读星露谷年历或星之书 | 中文维基耕种技能段；英文 Farming「To level up farming skill requires…」；中文技能页耕种段 | 已打开正文 | 中文耕种页写了年历/星之书，该页未写出 250；点数见 K10 | 是 |
| K3 | 主题知识 | 使用锄头和喷壶不会获得耕种经验 | 中文维基技能「使用锄头和喷壶不会获得经验」；英文 Skills「Using a hoe or watering can does not grant experience by itself」 | 已打开 | 与灰机「浇水和耕种可以提升等级」冲突，灰机作废 | 是 |
| K4 | 主题知识 | 收获作物的经验随作物基础售价变；银星/金星/铱星不加额外经验 | 中文维基经验值段公式句；英文 Farming 同段 | 公式旁 | | 是 |
| K5 | 主题知识 | 一次收获多个产物（蓝莓、蔓越莓、土豆额外产量等）只给第一个产物的经验，不多倍 | 中文维基经验值段；英文 Farming「only reward experience for the first product」 | 已打开 | | 是 |
| K6 | 主题知识 | 作物 XP 公式：`XP=||16*ln(0.018*PRICE + 1)||`（中文页写法）；PRICE 为基础售价 | 中文维基经验值段；英文 `XP=||16 × ln(0.018 × PRICE + 1)||` | 已打开 | `|| ||` 按维基符号；biligame 写成四舍五入，**不用 biligame 替代** | 是 |
| K7 | 主题知识 | 抚摸、挤奶、剪羊毛、捡起鸡舍/畜棚内动物产品各 5 点耕种经验。捡松露给采集经验，没有耕种经验 | 中文维基经验值段；英文 Farming 5 XP / Truffles Foraging | 已打开 | 中文技能页写松露未在该句；松露句在耕种页 | 是 |
| K8 | 主题知识 | 从 0 到 1 级约需 13 个防风草、8 个土豆或 5 个花椰菜；0 到 2 级约 48 / 28 / 17 | 中文维基经验值段；英文 Farming「13 parsnips, or 8 potatoes, or 5 cauliflowers」 | 已打开 | 灰机正文写 12 个防风草，同页表又写 13，弃用灰机 | 是 |
| K9 | 主题知识 | 五系技能升级所需经验相同。累计：1=100，2=380，3=770，4=1300，5=2150，6=3300，7=4800，8=6900，9=10000，10=15000 | 中文维基技能表；英文 Skills 表 | 已打开表格 | 10 级共 15000，不是另算 | 是 |
| K10 | 主题知识 | 阅读一本星露谷年历获得 250 点耕种经验。英文 Almanac / Farming 同样写 250 Farming XP。历史：1.6 加入年历 | 中文维基「星露谷年历」页「阅读即可获得 250 点耕种经验」；英文 Stardew Valley Almanac「earn 250 Farming XP」；英文 Farming「250 Farming XP is gained for reading a copy of the Stardew Valley Almanac or Book Of Stars」 | 三页均已打开 | 中文耕种页未抽出 250 数字，点数以年历页+英文 Farming 为准。星之书中文条目本次**未打开**；英文 Farming 把 Book Of Stars 与 Almanac 并列 250。若正文要用星之书点数，须再打开中文「星之书」页，或只引用英文 Farming 已核验并列句 | 是（年历 250 已核验；星之书点数仅英文 Farming 并列句） |
| K11 | 主题知识 | 收获农场上由野生种子种出的作物：3 点耕种经验 + 2 点采集经验 | 中文维基耕种经验值段；英文 Farming「3 Farming … and 2 Foraging」 | 已打开 | 灰机写 0 耕种 + 7 觅食；biligame 写 3+3。以官方维基 3+2 为准。英文历史：1.6 起野生种子给 3 Farming XP | 是 |
| K12 | 主题知识 | 经验值立即增加，升级（弹窗）在睡觉后结算 | 中文维基「经验值立即增加，但升级在睡觉后结算」；英文「Experience level is increased immediately upon harvesting, but the "level up" window doesn't appear until after going to sleep」 | 已打开 | 灰机写成睡觉后才结算经验，弃用 | 是 |
| K13 | 主题知识 | 每天第一次升级某技能会提示「你有些事情想在今天结束的时候考虑一下」。新解锁配方要当天结束、自动存档后才到手 | 中文维基技能导语 | 已打开 | 与本站职业文一致，职业选择细节不在本表展开 | 是 |
| K14 | 主题知识 | 5 级职业官方名：畜牧人（畜产品 +20%）、农耕人（农作产品 +10%）。10 级：畜牧人→鸡舍大师/牧羊人；农耕人→工匠/农业学家 | 中文维基耕种技能表；本站 `/zh/rancher-or-tiller-stardew` | 已打开 | **职业怎么选是现文任务**；本表只锁官方名和门闩，供内链 | 是 |
| K15 | 主题知识 | 耕种配方门闩（摘录）：2 级洒水器；4 级罐头瓶；6 级优质洒水器；8 级小桶；9 级种子生产器与铱制洒水器 | 中文维基耕种技能表；英文 Farming 表 | 已打开等级表 | 不是洒水器覆盖规则 | 是 |
| K16 | 主题知识 | 中文维基耕种页作物 XP 摘录（基础售价口径）：防风草 8、土豆 14、花椰菜 23、草莓 18、蓝莓 10、甜瓜 27、杨桃 43、蔓越莓 14、南瓜 31、宝石甜莓 64、咖啡豆 4、啤酒花 6 | 中文维基耕种页春/夏/秋表 | 已打开 | 灰机蓝莓 14、蔓越莓 19 作废。向日葵 XP 英文注释：按葵花籽价格算；中文页向日葵 14，未再打开代码 | 是 |
| K17 | 主题知识 | 仅收防风草时各等级株数：1=13，2=48，3=97，4=163，5=269，6=413，7=600，8=863，9=1250，10=1875（对应累计 XP 见 K9） | 中文维基「要种多少防风草」表 | 已打开 | 示例口径，不是某存档实测 | 是 |
| K18 | 主题知识 | 没浇水的作物不会死，但那一夜不算生长 | 中文维基耕种导语；本站赚钱文也链过农作物页 | 已打开耕种页 | 生长规则，不是经验规则 | 是 |
| K19 | 主题知识 | 1.3.27 修复使用镰刀收割时无法获得耕种经验 | 中文维基耕种历史句；英文 Farming「1.3.27: Fixed bug that prevented farming XP being granted when harvesting with Scythe」 | 已打开 | 现行规则下镰刀收割应给经验 | 是 |
| K20 | 主题知识 | 英文维基：1.6 起可读年历/星之书获得耕种经验；野生种子收获给 3 Farming XP | 英文 Farming History 句（第一次抽取 xpRelated） | 已打开 Farming 页 | 中文耕种页全文 `1.6` 未命中；年历页历史写「1.6：加入游戏」 | 是 |

**核验失败（不得当主题知识）：**

| 失败项 | 是什么值失败 | 处理 |
|--------|--------------|------|
| 灰机「浇水/使用工具可升耕种」 | 字段：灰机耕种技能段 vs 官方技能页「锄头和喷壶不会获得经验」 | 弃用灰机该句 |
| 灰机 0→1「12 个防风草」 | 同页表为 13；官方正文为 13 | 用 13 |
| 灰机蓝莓 14 / 蔓越莓 19 / 上古 43 / 杨桃 44 | 官方中文维基 10 / 14 / 38 / 43 | 用官方表 |
| 灰机野生种子 0 耕种 + 7 觅食 | 官方 3+2 | 用官方 |
| 灰机「经验睡觉后结算」 | 官方「经验立即增加，升级睡觉后结算」 | 用官方 |
| TapTap「种植和收割都能提供经验」 | 种植/浇水 vs 官方收获才给作物经验 | 弃用种植给经验 |
| 百度经验「购买小桶挤奶」 | 小桶在官方表是 8 级酿造设备，不是挤奶工具 | 弃用该步骤 |
| biligame 野生种子 3+3 | 官方 3+2 | 用官方 |
| 中文耕种页检索 `250` | 命中的是食物/表格数字，不是年历点数 | 点数改走年历页 |
| 精确中国区 Google 前五 | 页脚「未知 - 无法确定位置」 | 不得声称 |

---

## 实际观察

| ID | 观察 | 环境 | 日期 | 不是 |
|----|------|------|------|------|
| O1 | Google 五次查询均返回中文 UI、`lang=zh-CN`、页脚无法确定位置、无 PAA、无验证码 | ego-browser space 14；`hl=zh-CN&gl=cn&pws=0&num=10` | 2026-09-20 | 不是已定位 CN Google |
| O2 | 查询「星露谷 耕种怎么升级」前五为灰机、官方维基、TapTap 八级、Reddit 8/9、百度经验 | 同上 | 2026-09-20 | 排名会变 |
| O3 | 查询「星露谷 耕种5级」前五以职业选择为主 | 同上 | 2026-09-20 | |
| O4 | 查询「星露谷物语升级经验」前五扩到全技能 | 同上 | 2026-09-20 | |
| O5 | 百度同词无验证码；AI 总结块标明 AI 生成；第 1 条跳到九游 `9game.cn/xlgwy/11197261.html` | 百度 `/s?wd=` | 2026-09-20 | AI 总结不是核验 |
| O6 | Bilibili BV1Dz42197Rp 视频页可打开，标题「春、夏、秋种什么耕种经验高？」，时长 2:05 | 视频页 | 2026-09-20 | 未把视频逐帧当 XP 表 |
| O7 | 本站 sitemap 42 条、博客索引、identities 均无耕种升级 slug | 线上 sitemap + 源码 | 2026-09-20 | |
| O8 | 未进行游戏内存档、收获计数或规划器经验功能实测 | — | 2026-09-20 | 禁止改写成「我们测过」 |

---

## 分析判断（明确前提）

| ID | 判断 | 前提 | 不得改写成事实 |
|----|------|------|----------------|
| J1 | 新文主任务更像「经验怎么来、怎么走到 5/8/9/10」，而不是再写 5 级职业 | I1/I2 有维基+升级向结果页；I3 与现文同任务 | 不是已选定主意图 |
| J2 | 5 级职业选择应内链 `/zh/rancher-or-tiller-stardew`，不覆盖 | 查询 4 与现文 Title/H1 同任务 | |
| J3 | 2/6/9 级洒水器解锁可点到 `/zh/sprinkler-stardew`，不写覆盖 | 洒水器文 H2「按耕种等级选哪一种」 | |
| J4 | 季节作物日均应留给春夏秋三篇；若写作物只服务 XP | 三篇现文 Title 都是「种什么/秋季作物」金币口径 | |
| J5 | 规划器最多作为「升到 2/6/9 之前试摆覆盖」的可选关联，可为空 | T4、T10 | 不能说规划器帮你升级 |
| J6 | 门户「快升 8 级多种草莓南瓜」忽略多产物只算一次、短周期低 XP 作物可能更适合纯升级 | K5、K16、Reddit 评论分歧 | 示例建议须标前提，不能冒充实测 |

---

## 已打开来源清单

| 来源 | URL | 打开 | 用途 |
|------|-----|------|------|
| 本站中文首页 | https://stardewvalleyplanner.art/zh | 是 | 工具事实 |
| 本站中文博客 | https://stardewvalleyplanner.art/zh/blog | 是 | 冲突/缺口 |
| sitemap | https://stardewvalleyplanner.art/sitemap.xml | 是 | 无本 slug |
| 职业文 | https://stardewvalleyplanner.art/zh/rancher-or-tiller-stardew | 是 | 冲突 |
| 赚钱文 | https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew | 是 | 冲突 |
| 洒水器文 | https://stardewvalleyplanner.art/zh/sprinkler-stardew | 是 | 冲突 |
| 春/夏/秋作物文、温室文 | `/zh/best-spring-crop-stardew` 等 | 是 | 冲突 |
| 官方中文维基 耕种 | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&variant=zh-cn | 是 | 主题知识 |
| 官方中文维基 技能 | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&variant=zh-cn | 是 | 主题知识 |
| 官方中文维基 星露谷年历 | https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&variant=zh-cn | 是 | 250 XP |
| 英文维基 Farming | https://stardewvalleywiki.com/Farming | 是 | 对照 |
| 英文维基 Skills | https://stardewvalleywiki.com/Skills | 是 | 对照 |
| 英文维基 Almanac | https://stardewvalleywiki.com/Stardew_Valley_Almanac | 是 | 250 XP |
| 灰机 耕种 | https://xinglugu.huijiwiki.com/wiki/耕种 | 是 | 竞品/冲突，不当现行规则 |
| TapTap 八级 | https://www.taptap.cn/moment/537378948787473686 | 是 | 意图 I2 |
| Reddit 8/9 | https://www.reddit.com/r/StardewValley/comments/1g956mm/getting_to_farming_level_8_and_9_faster/?tl=zh-hans | 是 | 意图 I2 |
| 百度经验 | https://jingyan.baidu.com/article/d5c4b52bd582129b570dc549.html | 是 | 意图 I1，版本 1.5.4 |
| 17173 | https://news.17173.com/z/xlgwy/content/01242025/173802664.shtml | 是 | 薄 |
| 游侠 | https://gl.ali213.net/html/2024-5/1400391.html | 是 | 薄 |
| 九游 | https://www.9game.cn/xlgwy/11197261.html | 是 | 百度第 1 |
| biligame 耕种 | https://wiki.biligame.com/stardewvalley/耕种 | 是 | 表近官方，野生种子冲突 |
| Bilibili 视频页 | https://www.bilibili.com/video/BV1Dz42197Rp/ | 是 | 类型=视频 |
| 官方中文维基 星之书 | — | **未打开** | 星之书 250 仅英文 Farming 并列句 |

本地只读：`src/blog/blog-post-registry.tsx`（zh-CN Title/Description）、`src/blog/blog-post-identities.ts`、`public/llms.txt`、`rancher-or-tiller-stardew.zh.tsx`、`do-you-have-to-water-trees-stardew.zh.tsx` 开头。未读 `A-en-research.md`。
