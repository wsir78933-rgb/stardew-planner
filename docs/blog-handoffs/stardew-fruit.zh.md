# Stardew Fruit 中文：F 锁稿、标题与发布交接

本文件是编辑交接记录；仅下方「装配字段」中的正文组件、SEO、公开引用与媒体文字可以进入页面。候选、流程、hash、验证脚本和内部消息编号不渲染给读者。F 已锁定正文并选定唯一标题；E 标题/SEO 续审仍待执行，G 应在续审通过后装配，不能把本文件当作页面、用户终审或部署通过凭据。

## 输入门禁与版本

- 核查日期：2026-09-26；原始关键词 `stardew fruit`，中文主词「星露谷物语水果」；`locale=zh-CN`、`country=CN`，来自 B 中文任务卡，不表示 F 重新取得中国地区 SERP。
- F：`task_0631c2b1bef9` / `ctx_0144da649674`；独立于正文写手及 D、E。
- 正文：`src/blog/articles/stardew-fruit.zh.tsx`，公开导出 `StardewFruitChineseArticle`，无 props。
- 字节契约：整个 TSX 文件的 UTF-8 字节，包含正文 JSX、表格、FAQ、引用、图位及 import/export；NFC 规范化、LF 换行。当前原始字节已经符合该规范，无须写回。
- `bodyHash` / `articleSha256`：`00e4105272e9a78a3eb58301dd84585fa5cac91f37dba164b1a4a8502018cb54`；`articleBytes=26311`。这是源模块 hash，不是 HTML hash，也不是用于字数统计的正文投影 hash。
- D 同版 PASS：`task_d55ab6db8fa0` / `ctx_58955b98945d`，实际结算 `msg_3cb447445d8c`，ResearchTrace、ReaderValue、Repetition 三门通过，SHA 与上述一致。
- E 同版 PASS：`task_3b5f6817120a` / `ctx_7593713b8499`；完整结论 `msg_04a458ee4238`、原始命令与输出 `msg_d08897bdda61`、成功结算 `msg_13970ce0314e`。F 实际回读了这些消息，不只依赖协调者转述。E 的 PASS 仅覆盖正文。
- Q：`task_d9c06bcdf546` / `ctx_a835f2910466`；事实纠正 `msg_44696f0fdd88`、逐项表 `msg_eee4576880ec`。旧「28 项」是误计表头，已废弃；不能把合法的「普通树苗 28 天成熟」一起改掉。
- B：`task_32c921220695` / `ctx_e22e0c320df3`；修正后任务卡 `msg_d0b3ae17dcae`、结算 `msg_5c0f2f8c3769`。B 早期未填价格和初拟图注不覆盖 D/E 已审定的当前正文、实际媒体与图注。
- 归档位于 Orca Run `run_89b4db2242cd`，不在仓库 docs。`worker-read` 的归档存在裁切，`sourceExact=true`、`contentComplete=false`；上述完整消息通过公开 `orchestration inbox --full` 回读。没有声称恢复全部历史研究材料。
- Fail Fast：消费者重算 SHA 不等于上述值，或 D/E 同版 PASS 失效时，停止装配并返回协调者；不得静默更新 hash、改文或套用旧审核。

## 正文承诺与事实锁

唯一主意图：玩家从一个水果名称查明它属于什么物品、从哪里取得、何时及在什么条件下可得，再查普通品质基础单价及可用加工路线。三张水果表是同一查询任务的三组入口；加工表解释价格和投料口径。

读者实际所得是带中英文名称的 27 项交叉清单、分类边界、来源/季节/地点条件、基础价和加工规则。最强事实是「水果」不等于「果树果实」：辣椒、大黄属于水果，宝石甜莓被排除；葡萄和仙人掌果子各有多种取得入口。本文的具体价值是把名称、来源、限制与加工放在同一路径中，避免将采集季节误读成播种季节。

禁止承诺：最佳水果、利润排名、gold/day、最高收益、全平台实测、所有模组、全部取得路线百科、温室布局、果树 3×3 排错、完整收集包/礼物清单、规划器自动判断水果或加工收益。标题不能把基础单价比较写成利润结论。

| 锁定组 | 数量 | 逐项名称，顺序与源文件一致 |
|---|---:|---|
| 主要作物来源 | 11 | 上古水果、蓝莓、蔓越莓、辣椒、甜瓜、菠萝、霜瓜、齐瓜、大黄、杨桃、草莓 |
| 果树水果子集 | 8 | 杏子、樱桃、香蕉、芒果、橙子、桃子、苹果、石榴 |
| 采集及多来源 | 8 | 黑莓、仙人掌果子、椰子、水晶果、葡萄、美洲大树莓、香味浆果、野梅 |
| 水果合计 | 27 | 11 + 8 + 8；27 个唯一物品，无重复，不是 27 种作物或果树 |

适用原版 1.6 系列；不覆盖模组。价格是单个普通品质水果基础价，不含职业或熊的知识等修正。果酱为 `2×P+50`，普通未陈酿果酒为 `3×P`；果干为五个同类型同品质水果一批、`7.5×P+25`、成品售价取整数；五个同品质葡萄产葡萄干，基础价 600 金。不得混用单果与五果投料数量。齐瓜有任务入口及清除规则，葡萄夏采秋种、仙人掌种植地点限制等条件保持原文。

当前真实 SSR：表体行数 `[11,8,8,4]`，正文 H1 为 0（模板提供），FAQ 为 1，来源项 17，中文 CTA 为 1，正文图为 1。FAQ 唯一问题是「背包里已有五个水果，为什么烘干机还是不收？」；不恢复葡萄、椰子、齐瓜三组旧重复 FAQ。

F 淬文为只读复核：开篇、表格、说明、五步及投料诊断均服务主查询，未发现需要撤锁改文的问题。按 V7 计数脚本从真实 SSR 取段落、列表项、表格单元格，排除标题、FAQ、Sources、CTA、figure、alt、caption、URL；含表头 3749 汉字，进一步排除 108 个表头汉字后为 **3641 汉字**。严格投影包含 173 个节点，双换行连接，SHA-256 为 `c2cab4a4a1944be5cde624bb1c2a285653a5a65ff69705067b5345b282501995`，超过 2000 下限；该机械计数不代替 E 的语义审核。

## 十组独立生成的标题与描述方向

以下先从正文承诺生成，不给六种机制分配名额；下一节才做机制归类。每组搜索意图都是上述同一水果交叉查找任务，仅入口不同。

| 编号 | 候选标题 | 对应 description 方向 | 搜索意图切口与读者收益 | 承诺风险与筛选 |
|---|---|---|---|---|
| 1 | 星露谷物语水果清单：辣椒也在列，按来源查找 | 按原版 1.6 系列的 27 项水果清单，查作物、果树与采集来源、季节和取得条件；对照普通品质基础售价及果酱、果酒、果干路线，并辨清葡萄干、齐瓜任务与烘干投料限制。 | 从「哪些算水果、怎么获得」进入；用辣椒的真实分类引出三组表 | 辣椒身份、三组表和全部描述均有正文支持；选定 |
| 2 | 星露谷物语的 27 项水果，只有 8 项来自果树吗？ | 用水果清单区分作物、果树和采集来源，逐项核对季节、取得条件与加工路线。 | 对照水果总数和果树子集；减少把水果都当果树产物的误读 | 数字真实，但「来自果树」容易被读成唯一来源；淘汰，不牺牲多来源条件制造反差 |
| 3 | 星露谷水果哪里找？从名称查来源，再看季节 | 把水果中文名与英文名对照，确认作物、果树或采集入口，再核对地点和取得条件。 | 从缺少一种水果进入；按名称定位当前可用入口 | 承诺可兑现，但和最近温室标题的「按条件选择」动作套路相近；不选 |
| 4 | 星露谷水果清单：有种子，也要查季节与地点 | 对照原版水果的来源与可用季节，区分葡萄、仙人掌果子等物品的种植和采集条件。 | 从已有种子却无法获得目标水果进入；避免混读时间、地点 | 作物场景较窄，容易让采集和果树读者误判文章范围；不选 |
| 5 | 星露谷水果清单：先留原果，再决定怎么加工 | 查清水果来源、基础价和可用加工路线；任务或收集包需要原水果时，先保留对应物品。 | 从处理背包水果进入交叉表；减少把原果要求误当加工品要求 | 正文仅有保留原物的边界提醒，不能承诺完整任务/收集包指南；淘汰 |
| 6 | 星露谷水果价格怎么查？先对齐来源与基础单价 | 用同一普通品质口径读水果清单，并按投入数量理解果酱、果酒、果干的基础价格。 | 从价格查询返回物品及来源；避免混用星级和投料数量 | 会把主任务压成价格计算，弱化获取清单；不选，不能写成收益排名 |
| 7 | 缺一种星露谷水果？先在清单里找它的取得条件 | 按水果名称核对种子、成熟果树、采集地点或任务入口，再看季节与处理路线。 | 点名「缺指定水果」的状态；知道下一步该查哪种来源 | 没有保证当天获得，但「缺一种」不能扩大成全部任务物品攻略；可用但不选 |
| 8 | 星露谷水果清单：夏天的葡萄，未必来自葡萄种子 | 从葡萄的两种季节入口读懂水果清单，继续查作物、果树与采集水果的来源和条件。 | 从季节误读进入同一清单；区别采集与播种 | 容易被识别为单项葡萄攻略，与当前主词范围不如候选 1 一致；不选 |
| 9 | 星露谷水果清单：宝石甜莓为什么不在里面？ | 按游戏物品分类查水果，核对作物、果树和采集入口，以及能否走对应加工路线。 | 从名称与游戏分类的差别进入；避免按「莓」字判断 | 正文说明排除但不展开宝石甜莓单项资料，悬念焦点过窄；不选 |
| 10 | 星露谷水果不只在树上：来源、季节与加工对照 | 逐项查原版水果的来源、季节、基础单价与加工路线，保留地图和任务限制。 | 从来源概念进入交叉查找；认清作物/树/采集 | 全部兑现，但「不只在树上」不如辣椒这一具体事实有识别度；不选 |

## 后归类与六机制检查

| 机制 | 命中候选 | 本文适用性及风险结论 |
|---|---|---|
| 反差数字 | 2 | 27 与 8 均已核验，但数字关系必须是物品全集与果树水果子集，不能消除多来源；最终不用该数字句 |
| 自我颠覆 | 4、10；1 为分类预期的轻度纠正 | 只纠正具体分类/条件，不编造作者「以前不懂」的经历；最终使用辣椒这一事实 |
| 悬念场景 | 8、9 | 葡萄种子、宝石甜莓均有真实解释，但单项悬念会抢走主意图；不选 |
| 损失进入 | 5 | 加工后不能替代要求的原果有正文依据；不虚构损失金额或焦虑，当前标题容易扩大任务承诺，淘汰 |
| 结论前置 | 1、3、6、10 | 1 直接点出辣椒属于水果，并给出按来源查找的落点，信息具体、可回读；优先选择 |
| 群体点名 | 7 | 点名缺指定水果的具体状态，符合读者；没有使用泛泛人口标签，但不如 1 覆盖水果分类疑问 |

逐组停留要素：1=异常＋捷径；2=异常；3=捷径；4=异常＋捷径；5=捷径（不量化损失）；6=金钱＋捷径（只谈价格）；7=捷径；8=异常；9=异常；10=异常＋捷径。对应的收益均是上表写明的真实查询内容，不把机制标签本身当作验证。

七类驱动核对：懒惰对应减少跨页查来源；傲慢仅用于识别按现实分类理解游戏的惯性，不贬低玩家；贪婪只对应核对基础价格，不承诺赚更多；暴食只限完成本篇水果查找任务，不承诺解决全部游戏问题。嫉妒、愤怒、欲望没有正文依据，不启用。

## 七个停留要素检查

| 要素 | 最终标题是否启用 | 正文依据或不启用原因 |
|---|---|---|
| 金钱 | 否 | description 如实提基础单价；标题不靠收益吸引，也不声称最赚钱 |
| 异常 | 是 | 「辣椒也在列」对应分类段「在游戏分类里，辣椒、大黄都算水果」及作物表辣椒行 |
| 捷径 | 是 | 「按来源查找」由 11/8/8 三组清单及名称→来源→条件→处理的五步兑现，不承诺一眼解决全部问题 |
| 窥探 | 否 | 没有隐藏后台、内幕或未公开经验 |
| 冲突 | 否 | 没有虚构对立方或声称所有玩家都错了 |
| 终结 | 否 | 不用任务到期规则制造「最后机会」焦虑 |
| 群体情绪 | 否 | 不制造群体身份或集体优越感 |

停留检查结论：正在搜索「星露谷物语水果」的玩家能看到一个具体分类信息差——辣椒属于清单——并知道点击后可按来源查找；正文开篇、分类段和三张表直接接住它。

## 最近标题去套路与七项适配检查

通过公开 `getAllBlogPostMeta('zh-CN')` 读取本地当前已注册内容，按 `blog-home-state.ts` 的 reverse 顺序取前三条：

| 本地最新顺序 | 实际 title | 实际来源 |
|---:|---|---|
| 1 | 星露谷温室种什么？按手头种源、等待时间与收获节奏选择 | `src/blog/blog-post-registry.tsx`，`what-to-grow-in-greenhouse-stardew` |
| 2 | Profit Margin Stardew Valley：星露谷物语利润率是什么？四档怎么选 | 同文件，`profit-margin-stardew` |
| 3 | 星露谷松树种植先看格子，不浇水也不能随便种 | 同文件，`pine-tree-stardew` |

最近 3 篇线上已发布标题及其发布时间顺序未取得，未完成该线上口径的去套路检查。本任务未做页面 QA；不把本地注册、Git 提交或历史在线状态冒充当前发布事实。已完成本地可取得三篇的比较：最终不沿用两篇问答式「怎么选」，也不再用「先看／不能随便」警告开头；候选 1 以具体物品分类信息差进入清单，保留自然主关键词。E 续审须保留该读取边界。

| 适配项 | 逐字核对结果 |
|---|---|
| 1. 数字与版本 | 最终 title/H1 无数字；description 的原版 1.6 系列、27 项均在正文出现并已核验，不使用旧 28 项 |
| 2. 结果真实性 | 「辣椒也在列」可在作物表及分类段双重定位，不虚构结果、排名或实测 |
| 3. 读者一致 | 标题面向查水果类别与来源的中文玩家；没有另点名高级玩家、收益玩家或温室布局需求 |
| 4. 方法完整 | 「按来源查找」由三组表的来源/条件/季节列和五步判断完整提供，不只给口号 |
| 5. 情绪强度 | 无「震惊、被骗、最全、终极、轻松致富」；分类差异的力度没有超过正文 |
| 6. description 同承诺 | 来源、季节、条件、普通基础价、三种加工路线及葡萄干/齐瓜/投料限制均有对应段落，不增加收益或布局承诺 |
| 7. 模板与主意图 | 现有模板从同一个 `post.title` 生成 H1、metadata title、OG/Twitter title 和 JSON-LD headline；没有品牌后缀模板，最终保持完全相同文本；description 同时供页面导语、metadata、OG/Twitter 和 JSON-LD 使用 |

最终只选候选 1：它保留主词和清单用途，用已核验的辣椒分类提供具体停留理由，同时用「按来源查找」明确读者所得；不靠数字反差模糊来源重叠，也不把文章变成价格或单果攻略。

## 装配字段

此 JSON 是当前项目的装配输入清单，不是要新增的运行时类型或注册表。`body` 绑定已审原有 TSX 内容模块，消费者只能导入其公开导出；不得重新生成、摘要、翻译或抽取源码拼成另一个正文。下面的模块路径、hash、引用定位和校验状态只供装配，不展示。

```json
{
  "locale": "zh-CN",
  "country": "CN",
  "body": {
    "module": "src/blog/articles/stardew-fruit.zh.tsx",
    "export": "StardewFruitChineseArticle",
    "encoding": "UTF-8",
    "normalization": "NFC/LF",
    "bytes": 26311
  },
  "bodyHash": "00e4105272e9a78a3eb58301dd84585fa5cac91f37dba164b1a4a8502018cb54",
  "seo": {
    "slug": "stardew-fruit",
    "title": "星露谷物语水果清单：辣椒也在列，按来源查找",
    "h1": "星露谷物语水果清单：辣椒也在列，按来源查找",
    "description": "按原版 1.6 系列的 27 项水果清单，查作物、果树与采集来源、季节和取得条件；对照普通品质基础售价及果酱、果酒、果干路线，并辨清葡萄干、齐瓜任务与烘干投料限制。",
    "openGraphTitle": "星露谷物语水果清单：辣椒也在列，按来源查找",
    "twitterTitle": "星露谷物语水果清单：辣椒也在列，按来源查找",
    "canonicalPath": "/zh/stardew-fruit",
    "canonicalUrl": "https://stardewvalleyplanner.art/zh/stardew-fruit",
    "pairedEnglishPath": "/stardew-fruit"
  },
  "projectFields": {
    "topic": "星露谷物语指南",
    "author": "星露谷规划器团队",
    "readTimeMinutes": 13,
    "featured": true
  },
  "publicRequirements": {
    "cover": {
      "src": "/blog/stardew-fruit-cover.webp",
      "avif": "/blog/stardew-fruit-cover.avif",
      "width": 1672,
      "height": 941,
      "alt": "水果来源插画：篮中装着草莓、苹果和黑莓，后方分别是草莓田、苹果树和黑莓灌木。"
    },
    "inlineMedia": {
      "src": "/blog/illustrations/stardew-fruit-crosswalk.webp",
      "avif": "/blog/illustrations/stardew-fruit-crosswalk.avif",
      "width": 1672,
      "height": 941,
      "alt": "水果来源原创示意图：草莓对应耕地作物，苹果对应果树，黑莓对应野外灌木采集。",
      "caption": "草莓、苹果和黑莓分别示意作物、果树与野外采集三条来源。这是原创关系示意图，不是游戏截图；画出的果实数量不代表单次产量，黑莓也还有其他取得方式。",
      "placement": "分类说明之后、主要作物来源清单之前；保留原 JSX 图位",
      "loading": "lazy",
      "decoding": "async"
    },
    "faqQuestion": "背包里已有五个水果，为什么烘干机还是不收？",
    "sourceHeading": "来源",
    "sourceCount": 17,
    "bodyInternalLink": "/zh/stardew-valley-trees",
    "ctaHref": "/zh#planner",
    "ctaCount": 1
  },
  "integrity": {
    "bodyReview": "D/E PASS on bodyHash",
    "titleReview": "pending independent E",
    "assembly": "pending G after E title PASS",
    "pageReview": "not run",
    "userReview": "pending",
    "deployment": "not performed"
  }
}
```

Title、H1、OG 和 Twitter 不加品牌后缀，不另写第二套标题；不得让注册表的 description 被页面重新摘要。现有 `BlogArticleContent` 提供单个 H1 和封面，正文已有 `<article>` 不新增 H1。`projectFields` 复用现有中文文章的 topic、真实站点团队署名及 featured 惯例；13 分钟是编辑估算 `ceil(3641/300)`，不是游戏事实或实测承诺。没有凭空添加发布日期、作者个人身份或新 schema 字段。

当前 `blog-post-identities.ts`、`blog-copy.ts` 与 `blog-post-registry.tsx` 尚未注册该 slug；中文 route 的 `dynamicParams=false`。预期 route 是 `/zh/stardew-fruit`，不是 `/zh/blog/stardew-fruit`，也不是当前可访问状态的证明。下游 G 须在自己的明确写入范围内使用既有双语身份、路径和注册接口，不能由本 F 修改它们。英文 title 和 description 由独立英文 handoff 提供，不复制本中文方案。

## 来源契约与定位

下表是 `publicReferences` 核对清单，与上述 `bodyHash` 共同冻结。`appliesTo` 使用 `{quote, occurrence}`：quote 在该模块真实 SSR 的 `documentElement.textContent` 中逐字匹配，occurrence 从 1 开始；这些短片段没有跨节点空白，全部 occurrence=1。这里只定位主张，不要求额外渲染来源表；正文已含链接和 `BlogSources`，不得重复添加。模块 hash 是锁定依据，SSR 文本仅用于定位，不能用定位投影 hash 替换模块 hash。

| id | label | url | appliesTo.quote | occurrence | 支持范围 |
|---|---|---|---|---:|---|
| fruit | Stardew Valley Wiki 中文：水果 | https://zh.stardewvalleywiki.com/水果 | 27 个水果项目 | 1 | 名录、基础售价及职业口径；三组水果表对应 27 行 |
| crops | 农作物 | https://zh.stardewvalleywiki.com/农作物 | 在游戏分类里，辣椒、大黄都算水果 | 1 | 作物分类、种源、季节与野生种子 |
| trees | 果树 | https://zh.stardewvalleywiki.com/果树 | 果树这一组包含杏子、樱桃、香蕉、芒果、橙子、桃子、苹果与石榴 | 1 | 八种果树子集及结果条件 |
| cave | 农场山洞 | https://zh.stardewvalleywiki.com/山洞 | 苹果、杏子、樱桃、橙子、桃子、石榴列有这个入口，香蕉和芒果并不在该山洞的水果名单中 | 1 | 果蝠选择、随机产物与季节边界 |
| blackberry | 黑莓 | https://zh.stardewvalleywiki.com/黑莓 | 野外秋季；灌木收获季为秋 8—11 日 | 1 | 采集窗口及其他入口 |
| salmonberry | 美洲大树莓 | https://zh.stardewvalleywiki.com/美洲大树莓 | 野外春 15—18 日；山洞不受该日期限制 | 1 | 春季灌木窗口 |
| crystal-fruit | 水晶果 | https://zh.stardewvalleywiki.com/水晶果 | 采集、冬季种子；也可由矿井灰尘精灵掉落 | 1 | 冬季及怪物来源 |
| spice-berry | 香味浆果 | https://zh.stardewvalleywiki.com/香味浆果 | 野外采集、夏季种子或果蝠山洞 | 1 | 多来源与条件 |
| wild-plum | 野梅 | https://zh.stardewvalleywiki.com/野梅 | 野梅 Wild Plum | 1 | 对应单元格所在行的来源、季节与基础价 |
| cactus-fruit | 仙人掌果子 | https://zh.stardewvalleywiki.com/仙人掌果子 | 全年；种植限温室、室内花盆或姜岛农场 | 1 | 采集与受地点限制的种植入口 |
| coconut | 椰子 | https://zh.stardewvalleywiki.com/椰子 | 沙漠地面采集；采集 1 级后可摇沙漠或姜岛棕榈树取得 | 1 | 采集条件；不可用果实种树及不可食用边界见相邻段落 |
| powdermelon-seeds | 霜瓜种子 | https://zh.stardewvalleywiki.com/霜瓜种子 | 除浣熊商店交换和种子生产器外，该页面列出的其他取得方式有秋季 21 日至冬季 20 日的时间窗口 | 1 | 种源与时间窗口 |
| qi-fruit | 齐瓜 | https://zh.stardewvalleywiki.com/齐瓜 | 任务完成或到期的当晚，普通齐瓜、齐豆及生长中的作物等会被清除 | 1 | 任务生命周期及巨大齐瓜例外 |
| preserves-jar | 罐头瓶 | https://zh.stardewvalleywiki.com/罐头瓶 | 2 × P + 50 | 1 | 一果制酱、基础价与品质条件 |
| wine | 果酒 | https://zh.stardewvalleywiki.com/果酒 | 3 × P | 1 | 一果制酒、普通未陈酿价格 |
| dehydrator | 烘干机 | https://zh.stardewvalleywiki.com/烘干机 | 5 个同类型、同品质水果 | 1 | 投料条件、果干公式、葡萄干例外、宝石甜莓排除 |
| apple | 苹果 | https://zh.stardewvalleywiki.com/苹果 | 苹果 Apple | 1 | 苹果行的 100 金基础价及正文 250/300/775 加工例子 |

E 于同日实际回读 17 页均 HTTP 200、20 个中文 fragment 存在，逐名逐价比对 27/27 通过，详见原始回执；F 本轮核对源文和 SSR 定位，不冒称再次发起网络验证。来源支持性由同 hash 的 E 实际核验承担，HTTP 可打开本身不代替支持性。

保留所有正文行内链接的描述性锚文本、完整 href 和中文 fragment；不从 Q 的英文稳定版本链接替换当前已审中文 href。保留 `BlogSources.checkedLabel` 的 2026 年 9 月 26 日、原版 1.6 系列与不覆盖模组等说明。图注、FAQ、价格条件和来源 notes 均不得在装配时改写。

## 媒体契约

F 已实际查看封面和正文 WebP。封面是草莓田、苹果树、黑莓灌木及果篮；正文图只表达草莓→耕地、苹果→果树、黑莓→灌木三条关系。图中果实数量不表示产量，不能宣称图上画出全部水果或完整取得路线。继续使用 `PublicPicture` 的同 stem AVIF 优先、WebP fallback；媒体不得仅登记而漏渲染。

| 仓库资产 | SHA-256 | 尺寸 |
|---|---|---|
| `public/blog/stardew-fruit-cover.webp` | `fca66201085847ae229c1397f4bcbbd960bf02f2a23a784662b5d697bc587758` | 1672×941 |
| `public/blog/stardew-fruit-cover.avif` | `300dd727b5de1ad440d92f2b01b76f3220fd2a874d1625be6886b2f9f0f62836` | 1672×941 |
| `public/blog/illustrations/stardew-fruit-crosswalk.webp` | `81a1acfbb62ff0230f4bf73e9e3a7cdec8977df25c3dd65ca153b4c8e3d762c0` | 1672×941 |
| `public/blog/illustrations/stardew-fruit-crosswalk.avif` | `76834633bbc24fb8baae882961e7bdd303ae3be53fc61b2e8843e40c87e9533f` | 1672×941 |

正文 alt 与图注以原 JSX 为准；JSON caption 只是合并 JSX 排版换行后的可读回读，不授权改写源码空白或文字。公开媒体说明是原创示意图、非游戏截图；没有新增素材署名文字，也不新增「官方素材」「游戏原图」或额外授权声明。

## G 装配及后续浏览器验收

F 只新增本文件，不改正文、媒体、注册、测试、配置或依赖；不 commit、不启动 dev、不部署。G 应保持源模块字节及媒体 hash，只有自己的 Task 明确允许的注册和装配写入可以执行。发现文字、事实、图注、链接或图中事实错误须退回对应环节，撤销旧锁后重新 D/E/F，不允许 G 顺手修文。

E 标题续审须核对本文件唯一 SEO 字符串、正文 hash、封面 alt 和候选/适配记录；续审通过仍不表示页面通过。随后 G 用现有真实博客路由装配，浏览器 worker 用本地 ego-browser 在已确认属于本项目的实际端口完成：

1. `/zh/stardew-fruit`：桌面和手机可访问、唯一 H1 等于最终 title，description 一致，27 行及 8 项果树子集、四表横向滚动/换行可读、FAQ 可展开且答案存在。
2. 同页封面及正文图真实加载、AVIF/WebP fallback、alt 与图注正确，不把图片预览当页面验收。
3. 正文 `/zh/stardew-valley-trees`、17 来源链接及中文 fragment、唯一 `/zh#planner` CTA；中文→英文 `/stardew-fruit`→中文语言切换保持文章身份。
4. `/zh/blog`、`/zh/blog/archive`：文章入口、卡片标题、摘要、封面、筛选/搜索/分页遵循现有行为，不额外改首页或分类 UI。
5. metadata title、description、OG/Twitter、canonical `https://stardewvalleyplanner.art/zh/stardew-fruit`、hreflang 与文章 JSON-LD headline/description 相互一致；sitemap 使用项目现有规范。不要因 identity 中枚举路径带斜杠而给 `createCanonicalUrl` 传尾斜杠。
6. 用实际运行端口的完整中文文章 URL 交用户终审；不得假定历史端口 3003 是此项目。当前没有启动服务、验证路由 HTTP 或批准部署。

## 验证命令与真实输出

均在当前工作树运行。只读定位时无匹配的 `rg` 返回 1，不是内容检查失败；初次误读 `src/seo/site-url.ts` 返回不存在后，已读取真实 `src/seo/public-site-url.ts`。首次大体积 inbox JSON 被工具输出截断，解析失败；改为在 CLI 管道内按消息 ID 选择后成功。对 coordinator terminal 过滤得到 0 条，因为这些消息发给 Run；未据此判定归档缺失。没有未解决的产品检查失败。

| 命令/工具 | 退出码 | 关键输出或用途 |
|---|---:|---|
| `orca skills get orchestration`；`orca status --json` | 0 / 0 | 已读版本匹配指南，Runtime ready/reachable |
| `cat package.json` | 0 | Next 16.3.0；typecheck=`tsc --noEmit`；pretest 会 build；无 lint script |
| `sed -n '1,185p' node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md` | 0 | 读取本地 Next metadata/OG 指南 |
| `cat` V7 的标题与描述规则、七罪引擎、04 公开交接、02 质量门及正文计数脚本 | 0 | 锁后起题、十候选、两道检查、独立 E 续审、计数规则 |
| `orca orchestration worker-read --dispatch ctx_7593713b8499 --source transcript --limit 100 --json` | 0 | E succeeded；sourceExact=true；contentComplete=false，已保留裁切限制 |
| `orca orchestration worker-read --dispatch ctx_e22e0c320df3 --source transcript --limit 100 --json` | 0 | B succeeded，真实任务卡归档存在 |
| `orca orchestration inbox --limit 150 --full --json`，管道内用 Python 按上述消息 ID 选择 | 0 | 完整回读 E/D/Q/B 消息及同 SHA 结算，不写任何归档文件 |
| `shasum -a 256 src/blog/articles/stardew-fruit.zh.tsx` | 0 | `00e4105272e9a78a3eb58301dd84585fa5cac91f37dba164b1a4a8502018cb54` |
| 下方 SSR/计数命令 | 0 | 20 passed / 0 failed；源 26311 bytes；markupLength=46954；rows=[11,8,8,4]；3749/3641 汉字 |
| `./node_modules/.bin/tsc --noEmit --incremental false` | 0 | 无诊断，未写 tsbuildinfo |
| `./node_modules/.bin/vitest run tests/blog/blog-faq-list.test.tsx tests/components/public-picture.test.tsx --no-cache --configLoader runner` | 0 | 2 files / 11 tests passed；FAQ 6、PublicPicture 5；Duration 523ms |
| `sips -g pixelWidth -g pixelHeight public/blog/stardew-fruit-cover.avif public/blog/stardew-fruit-cover.webp public/blog/illustrations/stardew-fruit-crosswalk.avif public/blog/illustrations/stardew-fruit-crosswalk.webp` | 0 | 四图均 1672×941 |
| 对上述四个资产运行 `shasum -a 256` | 0 | 与媒体契约四个 hash 一致 |
| `view_image` 分别读取封面和正文 WebP | 成功 | 实际查看两图，未编辑 |
| `TSX_DISABLE_CACHE=1 node --require tsx/cjs` 调用 `getAllBlogPostMeta('zh-CN').slice().reverse().slice(0,3)` | 0 | 最近本地三篇为温室、利润率、松树，标题已逐字记录 |

未运行：完整 `pnpm test`（pretest 会构建）、build、dev server、页面浏览器 QA、外部写入和部署。D 历史回执的宽范围测试曾有 `tests/blog/blog-sources.test.tsx:2298` 英文 Pine checkedLabel 基线失败（21 pass/1 fail）；它不覆盖本水果模块，本 F 未重跑或修复，不能把历史状态报成本轮复验结论。当前本 F 实际执行的类型检查、11 项组件测试和 20 项 SSR 断言均通过。

可复现的 SSR 与严格计数命令（stdin 执行，不新建脚本、缓存或正文副本）：

```sh
TSX_DISABLE_CACHE=1 node --require tsx/cjs <<'JS'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const {createElement} = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {DOMParser} = require('@xmldom/xmldom');
const {spawnSync} = require('node:child_process');
const {StardewFruitChineseArticle} = require('./src/blog/articles/stardew-fruit.zh.tsx');
let passed = 0;
function verify(label, actual, expected) {
  assert.deepEqual(actual, expected, label + ': actual=' + JSON.stringify(actual));
  passed++;
}
const source = fs.readFileSync('src/blog/articles/stardew-fruit.zh.tsx');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceHash = sha256(source);
verify('reviewed source hash', sourceHash, '00e4105272e9a78a3eb58301dd84585fa5cac91f37dba164b1a4a8502018cb54');
verify('NFC LF bytes', source.toString().normalize('NFC').replace(/\r\n?/g, '\n'), source.toString());
const markup = renderToStaticMarkup(createElement(StardewFruitChineseArticle));
const doc = new DOMParser().parseFromString(markup, 'text/html');
const all = tag => Array.from(doc.getElementsByTagName(tag));
const hasClass = (node, cls) => (node.getAttribute?.('class') || '').split(/\s+/).includes(cls);
const rows = all('table').map(table => Array.from(table.getElementsByTagName('tbody')[0].getElementsByTagName('tr')).map(row => Array.from(row.getElementsByTagName('td')).map(cell => cell.textContent.trim())));
const names = rows.slice(0,3).flat().map(row => row[0].split(' ')[0]);
verify('table row counts', rows.map(group=>group.length), [11,8,8,4]);
verify('unique fruit count', new Set(names).size, 27);
verify('exact fruits', names.slice().sort(), ['上古水果','蓝莓','蔓越莓','辣椒','甜瓜','菠萝','霜瓜','齐瓜','大黄','杨桃','草莓','杏子','樱桃','香蕉','芒果','橙子','桃子','苹果','石榴','黑莓','仙人掌果子','椰子','水晶果','葡萄','美洲大树莓','香味浆果','野梅'].sort());
verify('tree subset', rows[1].map(row=>row[0].split(' ')[0]).sort(), ['杏子','樱桃','香蕉','芒果','橙子','桃子','苹果','石榴'].sort());
verify('body H1', all('h1').length, 0);
verify('FAQ', all('button').filter(node=>hasClass(node,'blog-faq-trigger')).map(node=>node.textContent.trim()), ['背包里已有五个水果，为什么烘干机还是不收？']);
verify('sources', all('div').filter(node=>hasClass(node,'blog-sources__item-wrapper')).length,17);
verify('CTA', all('a').filter(node=>node.getAttribute('data-blog-planner-cta-action')==='true').map(node=>node.getAttribute('href')), ['/zh#planner']);
verify('inline picture', all('img').map(node=>[node.getAttribute('src'),node.getAttribute('width'),node.getAttribute('height'),node.getAttribute('loading')]), [['/blog/illustrations/stardew-fruit-crosswalk.webp','1672','941','lazy']]);
verify('AVIF', all('source').map(node=>Array.from(node.attributes).find(attribute=>attribute.name.toLowerCase()==='srcset')?.value), ['/blog/illustrations/stardew-fruit-crosswalk.avif']);
verify('tables accessible', all('table').map(node=>[node.parentNode.getAttribute('role'),node.parentNode.getAttribute('tabindex'),Boolean(node.parentNode.getAttribute('aria-label'))]), Array.from({length:4},()=>['region','0',true]));
verify('headers', all('th').every(node=>node.getAttribute('scope')==='col'), true);
verify('internal trace', /SERP|PAA|worker_done|ReaderTask|PublicBlogHandoff|\/Users\/|任务卡|鉴文/.test(doc.documentElement.textContent),false);
function excluded(node) {
  for (let ancestor=node;ancestor?.nodeType===1;ancestor=ancestor.parentNode) {
    if(['figure','figcaption'].includes(ancestor.tagName)||['blog-faq-list','blog-sources','blog-planner-cta'].some(cls=>hasClass(ancestor,cls))) return true;
  }
  return false;
}
const counts = [];
for (const includeHeaders of [true,false]) {
  const tags = includeHeaders ? ['p','li','td','th'] : ['p','li','td'];
  const nodes = all('*').filter(node=>tags.includes(node.tagName)&&!excluded(node)&&!tags.includes(node.parentNode?.tagName));
  const body = nodes.map(node=>node.textContent.trim()).join('\n\n');
  const count = spawnSync('python3',['-B','/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py','/dev/stdin','--locale','zh-CN'],{input:body,encoding:'utf8'});
  verify('counter exit '+includeHeaders,count.status,0);
  const result = JSON.parse(count.stdout);
  verify('qualified count '+includeHeaders,result.mechanical_units,includeHeaders?3749:3641);
  counts.push({includeHeaders,nodes:nodes.length,...result});
}
verify('source unchanged',sha256(fs.readFileSync('src/blog/articles/stardew-fruit.zh.tsx')),sourceHash);
console.log(JSON.stringify({passed,failed:0,sourceHash,sourceBytes:source.length,markupLength:markup.length,rows:rows.map(group=>group.length),fruits:names,treeSubset:rows[1].map(row=>row[0]),counts},null,2));
JS
```

## 交付校验记录

文件内装配 JSON、公开引用表与四项媒体契约需要作为一个版本交给 E。公开字段校验摘要由本文件的 JSON 代码块、来源表中的六列字符串，以及媒体表中路径/hash/尺寸构成：依次组成对象 `{assembly, publicReferences, media}`，其中 assembly 为解析后的 JSON，另两项为按表中原顺序读出的二维字符串数组；使用 `JSON.stringify` 的 UTF-8 字节计算 SHA-256，忽略 Markdown 外观及其余编辑记录。引用 occurrence 保持表中字符串，媒体路径去掉 Markdown 反引号；这种格式化约定只用于确定性校验，不新增运行时接口。

公开字段 SHA-256：`77c9f51a78ae32a8d708373c039105e36623948868bf0440fb3d9eb01f5c9f4c`。

写后实际回读命令为 `TSX_DISABLE_CACHE=1 node --require tsx/cjs` 的 stdin 断言脚本，退出码 0，结果 `status=PASS`：JSON 可解析，candidateCount=10，sourceBytes=26311，articleSha256 与 D/E 同版一致，17/17 引用片段存在且目标 href 保留，4/4 媒体 SHA 相符，最终 title/H1/OG/Twitter 同文，正文 alt/caption 与源码 SSR 一致；title 为 21 个 Unicode 码点、description 为 82 个。脚本实际输出上述 publicFieldsHash；完整命令与输出保留于本 Dispatch transcript。该验证只证明当前交接一致，不把待执行的 E 标题续审、G 装配、页面 QA、用户终审或部署改成通过。
