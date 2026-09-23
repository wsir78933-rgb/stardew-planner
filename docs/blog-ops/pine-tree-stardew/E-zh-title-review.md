# E-zh 题文独立续审：`pine-tree-stardew`（zh-CN）

- **复核角色：** E-zh 题文续审；独立复核 F-zh 锁定的 Title/H1/Description/slug，不代替 F 创作，不修改 F/C/正文/source/public/tests。
- **复核日期：** 2026-09-22（Asia/Shanghai）。
- **唯一写入目标：** `docs/blog-ops/pine-tree-stardew/E-zh-title-review.md`。
- **本轮结论：** **题文层 PASS；页面与外部状态 UNVERIFIED。** 旧 FAIL 只针对旧 `星露谷 + X 怎么 Y： + 否定/反差` 结构；当前新 Title/H1 已去除该骨架，也未复用最近第一篇的问句+第 4 阶段/3×3 或第三篇的最晚日期结构。
- **独立性声明：** F-zh 的候选生成、停留自检和适配自检只作为待核输入；以下 hash、字段、正文映射、PublicReference、最近三篇去套路和元数据契约均由本续审重新读取/执行，不把 F 自检当 E 证据。

## 1. 绑定输入与证据边界

本报告只对本轮实际读取的字节有效。题文续审绑定当前锁正文、当前 F 锁稿、上游正文审核材料和 V7 规则；正文、source、public、tests、页面和外部服务均未写入或改动。

| 输入 | 本轮 raw SHA-256 | 用途 |
|---|---|---|
| `docs/blog-ops/pine-tree-stardew/F-zh-lock.md` | `a1f86648ad3d3cdba0e1ff4f0afe6742fab6d964bd3296717b9fa8239d6e6783` | 当前 F 锁稿与新题文输入 |
| `docs/blog-ops/pine-tree-stardew/locked/zh-body.txt` | `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690` | 当前锁正文；题文事实兑现与引用定位 |
| 覆盖前 `E-zh-title-review.md` | `7895f2dcec54aff9dc5fa40e3a6c57ed96e0a7caed924dd6a3e3a4ebc20580b9` | 旧 FAIL 报告的实际字节 |
| `C-zh-draft.md` | `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2` | PublicReference 原始 quote/occurrence 来源 |
| `D-zh-check.md` | `afc3f2e0bdf8f396a32b6b3f5aaceb60a8a62bf3f249491c6cae2460ae682127` | D 同版输入绑定；不代替本 E 题文结论 |
| `E-zh-review.md` | `1975e831e004849f20f386ad1dfe737024cc7c74787b6382ea06ae33d0a07968` | E 正文审核同版绑定；不把正文 PASS 自动延伸为题文 PASS |
| `A-zh-research.md` | `87e990e7e6f697d07b9831705fd3c92e187277bd0809b807115b6b75b42d3157` | 中文主意图、术语、事实和未决边界 |
| `A-zh-supplement.md` | `b03b80722b771d07ff8cf0e75762104a7625c8ff6350305d1fe5806f6ed92429` | F-01/F-04 适用范围和冲突边界 |
| `B-zh-layout.md` | `9a843d0a850dbbdba5b63d61e7394d0109b716012fd7fab9dcf5a1b3056c4213` | 唯一 ReaderTask 与必要子问题 |
| `project-interface-spec.md` | `055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f` | slug、locale、公开路径和页面边界 |

### 1.1 V7 规则绑定

| 规则文件 | 本轮 raw SHA-256 | 采用边界 |
|---|---|---|
| `参考规则/标题与描述规则.md` | `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710` | 10 组方向、后归类、停留/适配、最近三篇去套路、E 独立续审 |
| `参考规则/七罪引擎.md` | `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3` | 六种机制、七个停留要素、七类人性驱动、逐字适配 |
| `04-公开交接与页面装配.md` | `31c73c23f0825b0291d6ed4224a57cbeb8b01b5e4502d2091724d999ba225d9c` | bodyHash、seo 字段、`{quote, occurrence}`、不得把内部证据渲染到公开页 |
| `03-博客页面生成整合.md` | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` | Title/H1/Description/slug 与实际页面模板适配边界 |
| `02-内容生产与质量门.md` | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` | SEOTruth、E/F 独立职责、锁后题文门 |
| `01-统一工作流.md` | `4617c08d2f5b25e4cbac747415703e5494d8b489657079bad2e72eb3fe7e8eec` | D/E/F 分工、题文续审和状态分离 |

## 2. 当前锁定题文与精确字段 hash

当前 F 锁定的四字段为：

| 字段 | 当前值 | 字符数 / UTF-8 bytes | 字段 SHA-256 | E 判定 |
|---|---|---:|---|---|
| Title | `星露谷松树种植先看格子，不浇水也不能随便种` | 21 / 63 | `dcd0b2afdeef2ca270045881a7a9d92b7c784d9ed73ac8daac0293247a4d388c` | **PASS** |
| H1 | `星露谷松树种植先看格子，不浇水也不能随便种` | 21 / 63 | `dcd0b2afdeef2ca270045881a7a9d92b7c784d9ed73ac8daac0293247a4d388c` | **PASS（字段层）** |
| Description | `松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。` | 79 / 221 | `57af450f972e30cfcbde9911dc6a7cb07684fad65ab47ae6a56eedeb36bd2093` | **PASS** |
| slug | `pine-tree-stardew` | 17 / 17 | `ce9f691a06db95c95255f2a2d4a9ae2d025a6287dc44cd5279eea617fc3c6cf7` | **PASS（候选层）** |
| 四字段 tuple | `Title + "\\n" + H1 + "\\n" + Description + "\\n" + slug + "\\n"` | 368 bytes（含末尾 LF） | `2e2e2bdb32b9ad6c5ed8b06e50003c748b3f7b41b429cff44dcfec06649933c8` | **PASS** |

Title/H1 逐字一致，Description 沿用 F 锁稿的原值；本轮没有重新发明 Description，也没有扩入正文之外的事实、数字或第二个主意图。

## 3. 正文承诺与事实兑现

### 3.1 唯一主意图

B-zh 锁定的主意图是 `星露谷 松树怎么种`：从松果入口开始，确认种植格和地图条件，排查第 4 阶段阻挡，成熟后用普通/重型树液采集器取得松焦油。当前 Title 把“怎么种”改写为“种植先看格子”，仍指向同一动作链，没有转成松焦油收益、树木百科或规划器教程。

### 3.2 Title/H1 逐项适配

| 题文片段 | 锁正文证据 | 独立判断 |
|---|---|---|
| `星露谷松树种植` | `locked/zh-body.txt:1,5,22,26–30`：松果/松树对象链、松果种植 H2、种植格与地图条件 | **PASS**；对应 B 的中文种植主意图；没有把 Pine 写成果树或泛树百科。 |
| `先看格子` | `:26–32,40–43`：下种前先检查条件，第一排错动作逐格看八邻格 | **PASS**；“先”是正文明确的操作顺序，不是装饰词。 |
| `不浇水` | `:1,10,29,32,84`：普通树不需要像作物一样每天浇水 | **PASS**；正文明确这是水分规则。 |
| `不能随便种` | `:28–30,32,83–84`：格子占用/可耕种/区域口径和城镇、海滩农场隧道限制；正文明确不把“不浇水”解释成“任何地方都能种” | **PASS**；是已解释的真实反差，不是虚假恐吓。 |

Title 没有写固定成熟日、收益、最高级、实测、规划器模拟、Pine footprint、全地图许可或正文之外的新规则。

### 3.3 Description 逐项适配

| Description 片段 | 锁正文证据 | 独立判断 |
|---|---|---|
| `松果种下前先核对种植格和地图限制` | `:26–32,83–84` | **PASS**；区域、格子和地图检查均有步骤与限制。 |
| `树苗卡在第 4 阶段时查八邻格成熟树` | `:34–43,85` | **PASS**；正文把八邻格成熟树作为第一排错动作。 |
| `再分季节、树肥和自然树条件` | `:43,51–59,86` | **PASS（保守）**；正文把季节、树肥、自然松树和地图作为后续分支，并保留自然树阶段冲突。 |
| `成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油` | `:1,61–70,87` | **PASS**；5/2 天是成熟松树上的采集器产物间隔，不被 Description 写成成长时间。 |

Description 没有把 18/24/38/55 天冲突数字选成固定成熟日，也没有把松焦油售价/用途写成收益排名。

## 4. 七罪引擎：机制、停留和适配

### 4.1 机制归类

- **机制：自我颠覆**。读者容易把“普通树不浇水”误读为“种植位置不受限制”；Title 用“先看格子”与“不浇水也不能随便种”把这个预期推翻。
- **停留要素：异常 + 冲突 + 捷径。** 异常是“不浇水仍不能随便种”；冲突是水分规则与位置/地图规则不是同一件事；捷径是把“先检查格子”放在种植动作之前，减少错误尝试。
- **人性驱动：傲慢 / 懒惰（解释项，不是配额）。** 读者可能以为“不浇水”已经等于“随便放”，或希望少走格子排错的弯路；正文给出实际检查，不靠虚构经历或焦虑。
- **停留结论：PASS。** 信息差具体、可验证，并在 `locked/zh-body.txt:26–32,34–43` 兑现；不是只写“有吸引力”或贴空标签。
- **适配结论：PASS。** Title/H1 无数字、日期或最高级；Description 的对象、方法、结果、5/2 天和条件均有正文对应；情绪强度没有超过正文。

## 5. 最近三篇站内结构去套路

本轮直接读取当前 `src/blog/blog-post-registry.tsx:609–651`，而不是沿用旧报告的口述。实际中文标题如下：

| registry 行 | slug | 当前中文 Title |
|---:|---|---|
| 610 | `do-you-have-to-water-trees-stardew` | `星露谷物语的树要浇水吗？普通树第4阶段查邻格，果树苗查3×3` |
| 625 | `how-to-level-up-farming-stardew` | `星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150` |
| 640 | `last-day-to-plant-stardew` | `星露谷最晚播种日：春天防风草最晚在第 24 天种下` |

### 5.1 去套路逐项结论

| 复用风险 | 旧/邻近结构 | 当前 Title 检查 | 判定 |
|---|---|---|---|
| 旧 FAIL 骨架 | `星露谷` 品牌前缀 + `X 怎么 Y` 问句 + 全角冒号 + 冒号后否定/反差 | 当前 Title 没有 `怎么`、没有 `：`/`:`，改为“种植先看格子，…”，保留事实反差但不保留旧模板 | **PASS** |
| 最近第一篇 | 问句 `？` + `第4阶段查邻格` + `3×3` | 当前 Title 无 `？`/`?`、无 `第 4 阶段`/`第4阶段`、无 `3×3`/`3x3` | **PASS** |
| 最近第二篇 | `星露谷耕种怎么升级：…不加经验，5级要2150` 的问句+冒号+否定/反差 | 当前 Title 无 `怎么`、无全角冒号，且动作由“种植先看格子”承载 | **PASS** |
| 最近第三篇 | `星露谷最晚播种日：…第 24 天` 的最晚日期结构 | 当前 Title 无 `最晚`、无 `日期`、无“第 N 天”或固定日历 | **PASS** |

**独立结构结论：PASS。** 当前题文仍使用自然品牌前缀和事实反差，但已改变句法入口，不复用最近三篇的问句、阶段/3×3 或最晚日期模板。这里通过的是结构去套路，不是声称站内线上排序或生产首页已验证。

## 6. 长度、字段边界和承诺禁项

| 检查项 | 结果 | 依据 |
|---|---|---|
| Title 字符数 | **PASS** | 21 字符 / 63 UTF-8 bytes；V7 规则要求长度适配，不要求固定机械上限；无塞入多个搜索任务。 |
| H1 字符数 | **PASS** | 与 Title 同为 21 / 63。 |
| Description 字符数 | **PASS** | 79 字符 / 221 UTF-8 bytes；只补充正文已给的条件、方法和结果。 |
| Title=H1 | **PASS（字段层）** | 精确字符串和字段 hash 相同。 |
| 空白/尾随字符 | **PASS** | 本轮字段由精确 UTF-8 字符串计算；没有隐藏换行或尾随空格。 |
| 夸大承诺 | **PASS** | Title/Description 未出现固定成熟日、最快/最佳/最赚钱/保证/实测/排名/收益冠军/规划器模拟/物理 footprint。 |
| 主意图 | **PASS** | 仍是松果→松树种植与排错→成熟采集松焦油，未拼入收益排行、完整配方、泛树百科或 PAA。 |

## 7. 25 条 PublicReference quote/occurrence 独立回读

按 V7 `04-公开交接与页面装配.md`，从当前 `C-zh-draft.md` 编辑附录重新解析 25 条 `{quote, occurrence}`，在当前 `locked/zh-body.txt` 的 NFC/LF 字节中连续查找；`occurrence` 从 1 开始。结果为 **25/25 命中，quote_validator_failures=0，退出码 0**。第 1 条 quote `松树属于普通树` 出现 2 次且 `occurrence=1` 指向正文第 1 行；其余 24 条各出现 1 次。

| # | PublicReference | quote | count | occurrence | 锁正文行 | 判定 |
|---:|---|---|---:|---:|---:|---|
| 01 | `wiki-zh-pine-tree` | `松树属于普通树` | 2 | 1 | 1 | PASS |
| 02 | `wiki-zh-pine-tree` | `成熟松树掉在地上的未发芽松果` | 1 | 1 | 16 | PASS |
| 03 | `wiki-zh-pine-tree` | `可以砍伐或挂采集器` | 1 | 1 | 57 | PASS |
| 04 | `wiki-zh-pine-cone` | `农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子` | 1 | 1 | 28 | PASS |
| 05 | `wiki-zh-pine-cone` | `格子未被占用、属于可耕种格，而且没有被锄头开垦` | 1 | 1 | 28 | PASS |
| 06 | `wiki-zh-pine-cone` | `采集等级达到 1 后摇晃或砍倒松树` | 1 | 1 | 16 | PASS |
| 07 | `wiki-zh-pine-cone` | `成熟松树掉在地上的未发芽松果` | 1 | 1 | 16 | PASS |
| 08 | `wiki-zh-pine-cone` | `杂货店不卖松果` | 1 | 1 | 16 | PASS |
| 09 | `wiki-zh-trees` | `不需要像作物那样每天浇水` | 1 | 1 | 29 | PASS |
| 10 | `wiki-zh-trees` | `普通树不要求周围土地全部清空` | 1 | 1 | 29 | PASS |
| 11 | `wiki-zh-trees` | `树苗就会永远停在第 4 阶段` | 1 | 1 | 36 | PASS |
| 12 | `wiki-zh-trees` | `成熟树占据树苗八邻格时阻止继续成长` | 1 | 1 | 36 | PASS |
| 13 | `wiki-zh-trees` | `在非冬季每晚约有 20% 的机会进入下一阶段` | 1 | 1 | 53 | PASS |
| 14 | `wiki-zh-tapper` | `普通采集器 5 天` | 1 | 1 | 1 | PASS |
| 15 | `wiki-zh-tapper` | `挂在松树上的采集器冬季继续工作` | 1 | 1 | 70 | PASS |
| 16 | `wiki-zh-tapper` | `配方从采集等级 4 开始` | 1 | 1 | 67 | PASS |
| 17 | `wiki-zh-heavy-tapper` | `重型采集器 2 天` | 1 | 1 | 1 | PASS |
| 18 | `wiki-zh-tree-fertilizer` | `必须施在已经种下的树种、树苗或小树上` | 1 | 1 | 55 | PASS |
| 19 | `wiki-zh-tree-fertilizer` | `对普通树来说，树肥可以让它在冬季继续推进` | 1 | 1 | 55 | PASS |
| 20 | `wiki-zh-tree-fertilizer` | `果树和茶树不适用` | 1 | 1 | 55 | PASS |
| 21 | `wiki-zh-pine-tar` | `松焦油有明确用途` | 1 | 1 | 76 | PASS |
| 22 | `wiki-zh-pine-tar` | `工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务` | 1 | 1 | 76 | PASS |
| 23 | `wiki-zh-pine-tar` | `页面列出了这件物品的基础售价` | 1 | 1 | 78 | PASS |
| 24 | `official-1-6-changelog` | `不能在城镇或海滩农场的隧道里种树` | 1 | 1 | 30 | PASS |
| 25 | `site-zh-general-trees` | `规划器可以帮助你做布局示意` | 1 | 1 | 59 | PASS |

## 8. 身份、slug、页面元数据和边界状态

### 8.1 候选字段与项目身份

| 项目 | 判定 | 独立证据 |
|---|---|---|
| locale | **PASS（输入层）** | F、C、B、ProjectInterfaceSpec 均绑定 `zh-CN`。 |
| country | **PASS（研究输入层）** | A 记录 `CN`；不把它写成已取得中国 Google 排名。 |
| slug 语义 | **PASS（候选层）** | `pine-tree-stardew` 与松树主题、ProjectInterfaceSpec 锁定身份一致。 |
| 中文公开路径预期 | **PASS（契约层）** | ProjectInterfaceSpec 锁定 `/zh/pine-tree-stardew`，canonical 不带尾斜杠；不使用 `/zh-CN/pine-tree-stardew`。 |
| source registry 目标条目 | **UNVERIFIED** | 本轮 `rg -n 'pine-tree-stardew' src/blog/blog-post-registry.tsx src/blog/blog-post-identities.ts src/blog/blog-copy.ts` 返回退出码 1，当前没有目标注册证据；这不是题文字段失败。 |
| 实际 Title/H1/Description 页面回读 | **UNVERIFIED** | 目标尚未注册；本轮不运行 dev/build/browser，也不把 source contract 当页面实例证据。 |

### 8.2 页面元数据契约（只证明 source contract，不证明目标页面）

本轮实际回读：

- `src/components/blog/blog-article-content.tsx:21–22`：页面 H1 使用 `post.title`，可见描述使用 `post.description`。
- `src/seo/page-metadata.ts:39–53`：title/description 与 OpenGraph/Twitter 字段直接使用输入 title/description，无品牌后缀或隐式 SEO 改写。
- `app/zh/[slug]/page.tsx:52–61`：canonical path 从 `post.slug` 生成，metadata 使用 `post.title`/`post.description`，robots 为 `index/follow`。
- `app/zh/[slug]/page.tsx:73–81`：页面使用 `zh-CN` locale 并生成 Article JSON-LD；实际 target route 尚未注册。

因此：Title=H1、Description 的 source projection **PASS（契约层）**；真实页面 metadata、canonical、hreflang、robots、Article JSON-LD **UNVERIFIED**。不要把 source contract、项目 spec 或 F 自检写成浏览器/build/deploy 证据。

### 8.3 明确保持 UNVERIFIED 的范围外状态

| 状态项 | 判定 | 本轮边界 |
|---|---|---|
| 中国 Google SERP | **UNVERIFIED** | 未运行或补造 SERP；A 的旧记录也明确没有可读精确 Google 结果。 |
| Google PAA | **UNVERIFIED** | 未取得可验证 PAA；360 相关搜索不替代 PAA。 |
| 真实页面 Title/H1/Description | **UNVERIFIED** | 目标 registry/route 尚未装配。 |
| canonical / hreflang / robots / Article JSON-LD | **UNVERIFIED** | 只有 source contract 和 ProjectInterfaceSpec，未做真实 route 回读。 |
| browser / build / typecheck / tests | **UNVERIFIED** | 本任务只做题文续审；未运行这些工程或浏览器验证。 |
| deploy / production / indexing | **UNVERIFIED** | 未部署、未写外部服务，不能由仓库材料证明。 |
| user approval | **UNVERIFIED / WAITING** | 用户尚未在完整页面上终审；题文 PASS 不等于用户批准。 |
| 媒体实际文件/页面显示 | **UNVERIFIED** | A-media/spec 只提供计划/契约，未进入本题文结论。 |

## 9. 独立验证命令与真实退出码

以下命令均为本轮真实执行；没有写入 source/public/tests/package、没有启动 dev/build、没有浏览器、部署、提交、推送或外部服务写入。

| 命令/检查 | 真实结果 | 退出码 |
|---|---|---:|
| `shasum -a 256 docs/blog-ops/pine-tree-stardew/{F-zh-lock.md,locked/zh-body.txt,E-zh-title-review.md,E-zh-review.md,C-zh-draft.md,D-zh-check.md,A-zh-research.md,B-zh-layout.md,project-interface-spec.md}` | 输出 §1 的当前绑定 hash；覆盖前目标报告为旧 FAIL 字节 | 0 |
| `python3` UTF-8 字段回读 + Title/H1/Description/slug hash + tuple 复算 | Title/H1 21/63；Description 79/221；slug 17/17；tuple `2e2e2bdb...9933c8`；`audit_exit=0` | 0 |
| `python3` 当前正文承诺、禁承诺词和最近结构去套路回读 | `title_h1_sync=PASS`、正文 anchors 全命中、三组结构去套路 PASS、`audit_exit=0` | 0 |
| `python3` 解析当前 C `### PublicReference` + NFC/LF 锁正文连续 quote 查找 | `refs=25`；第 1 条 count=2/occurrence=1；其余 24 条 count=1；`quote_failures=0` | 0 |
| `nl -ba locked/zh-body.txt` | 101 行；题文映射位置见 §3、§7 | 0 |
| `nl -ba src/blog/blog-post-registry.tsx | sed -n '609,651p'` | 真实读取最近三篇中文 Title | 0 |
| `rg -n 'pine-tree-stardew' src/blog/blog-post-registry.tsx src/blog/blog-post-identities.ts src/blog/blog-copy.ts` | 当前目标尚未注册；这是页面证据缺口，不是题文字段失败 | 1（预期未命中） |
| `nl -ba src/components/blog/blog-article-content.tsx`、`src/seo/page-metadata.ts`、`app/zh/[slug]/page.tsx` | 回读 H1、metadata、canonical/route source contract | 0 |
| `orca orchestration check --terminal term_1a01a93d-695e-42e6-b077-53f42e971295 --json` | 无 coordinator follow-up；写报告前已执行 | 0 |

## 10. 写入结算、最终结论和后续边界

### 10.1 最终 E-zh 题文结论

**E-zh 题文审核：PASS（题文层）。**

- 当前 F hash `a1f86648ad3d3cdba0e1ff4f0afe6742fab6d964bd3296717b9fa8239d6e6783` 与 body hash `d5483df42622f5131bb449fbd50e95c274214ac78a5e6379c8991372ac1ca690` 绑定成立。
- 新 Title/H1 `星露谷松树种植先看格子，不浇水也不能随便种` 已通过事实兑现、单一主意图、七罪停留、适配、长度、Title=H1 和最近三篇结构去套路。
- Description 保留原值，已通过格子/地图、第 4 阶段八邻格、季节/树肥/自然树分支、成熟后普通/重型 5/2 天采集器结果的正文兑现检查。
- PublicReference 25 条 `{quote, occurrence}` 与锁正文全部命中；引用/正文绑定未漂移。
- 该 PASS 不能外推为真实页面、metadata/canonical、browser/build/test/deploy、生产、SERP/PAA 或用户批准通过。

### 10.2 后续必须保持的状态

- **允许进入下一环节：** 题文层可交公开交接准备；但仍需在有合格 `PublicBlogHandoff`、实际媒体和明确写页授权后再装配页面。
- **不得静默放行：** 未注册的 target slug、真实页面 metadata/canonical/hreflang、browser/build、生产部署、Google SERP/PAA、媒体存在性和用户终审均保持 `UNVERIFIED`。
- **范围外问题：** 若后续发现正文事实变化，作废本题文报告并重新绑定新的 body/F tuple；若仅题文变化，重新计算字段 hash/tuple 并再次交 E 续审；本轮不改正文或 F。

## 11. 写入范围与写后回读

- 本轮唯一 repository 写入文件：`docs/blog-ops/pine-tree-stardew/E-zh-title-review.md`。
- 未写入：`F-zh-lock.md`、`locked/zh-body.txt`、C/D/A/B/supplement/spec、`src`、`public`、`tests`、`package`、媒体、handoff、git、commit、push、deploy、外部服务和秘密。
- 本报告不嵌入自身最终 hash，以避免 self-hash 递归。

| 写后命令/检查 | 真实结果 | 退出码 |
|---|---|---:|
| `test -s docs/blog-ops/pine-tree-stardew/E-zh-title-review.md` + `wc -l -c` | 非空；240 行、22250 bytes | 0 |
| `awk '/[[:blank:]]$/{...}' docs/blog-ops/pine-tree-stardew/E-zh-title-review.md` | 无尾空格输出 | 0 |
| `git diff --check` | 无 whitespace 诊断 | 0 |
| `git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/E-zh-title-review.md` | 无诊断；`rc=1` 仅为未跟踪新文件差异的预期状态 | 1（预期） |
| `shasum -a 256` 回读 F/body/C/D/E/A/B/spec | §1 的 F/body/C/D/E/A/B/spec hash 均保持不变 | 0 |
| `git status --short --untracked-files=all` | 仍只有目标目录的既有未跟踪清单，无目录外路径 | 0 |

写后回读证明题文报告非空且只覆盖允许报告；受保护正文、F 锁稿和上游输入未漂移。
