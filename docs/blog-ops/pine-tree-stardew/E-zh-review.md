# E-zh 独立事实、引用、SEOTruth 与可读性审核：`pine-tree-stardew`

- **角色与独立性：** E-zh 独立审核；本报告不转述旧 E 的结论，不修改 C/D/A/B/supplement/spec，不生成媒体，不执行页面、浏览器、build、typecheck、Vitest、deploy、commit、push 或外部写入。
- **审核证据日期：** 输入资料的证据日期为 2026-09-22（Asia/Shanghai）；本报告所引用的源文件、URL 回读、命令输出均以本轮实际读取为准。
- **唯一写入目标：** `docs/blog-ops/pine-tree-stardew/E-zh-review.md`。
- **当前 C 绑定：** `docs/blog-ops/pine-tree-stardew/C-zh-draft.md` raw SHA-256 = **`b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2`**；NFC/LF 规范化 SHA-256 同值。C 任一字节改变后，本报告全部结论失效，D/E 必须按新 hash 重跑。
- **最新 D 绑定：** 当前 `D-zh-check.md` raw SHA-256 = **`afc3f2e0bdf8f396a32b6b3f5aaceb60a8a62bf3f249491c6cae2460ae682127`**。其最新结论为：ResearchTrace、ReaderValue、Repetition PASS；文字图位 PASS；六个实际媒体文件 UNVERIFIED；机械 2000 汉字 PASS（2491）；页面、SEO 表面、锁稿、部署、用户终审未证明。本 E 不把 D 口头或旧版本报告当作当前 E 证据，以下均对当前 C hash 独立复核。
- **旧 E 保护记录：** 覆盖前旧 `E-zh-review.md` raw SHA-256 = `16a1c27e2f2e00087341c7b1ab6c8134214da760b53f7edd1c675bd98ac8c35f`；旧报告绑定的是旧 C hash `c5bcd07617e97c2c4a3da03e410f0887e79b15711b3b5f7f322331d61c876a52`，**不能作为当前 PASS 证据**。

## 1. 输入、范围和边界

### 1.1 本轮实际读取的输入 hash

| 输入 | raw SHA-256 |
|---|---|
| `C-zh-draft.md` | `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2` |
| `A-zh-research.md` | `87e990e7e6f697d07b9831705fd3c92e187277bd0809b807115b6b75b42d3157` |
| `A-zh-supplement.md` | `b03b80722b771d07ff8cf0e75762104a7625c8ff6350305d1fe5806f6ed92429` |
| `B-zh-layout.md` | `9a843d0a850dbbdba5b63d61e7394d0109b716012fd7fab9dcf5a1b3056c4213` |
| `A-media-plan.md` | `34feee6056dc7bcf877526e90eb92c7711c44dd97903e82b3645f5be381c8202` |
| `project-interface-spec.md` | `055e7e19ec2a1b1296b50bcc4c25e81d180a6aad0373ecd95927bdf1da1c298f` |
| `D-zh-check.md` | `afc3f2e0bdf8f396a32b6b3f5aaceb60a8a62bf3f249491c6cae2460ae682127` |
| 覆盖前旧 `E-zh-review.md` | `16a1c27e2f2e00087341c7b1ab6c8134214da760b53f7edd1c675bd98ac8c35f` |

完整读取了当前 C-zh、A-zh、A-zh-supplement、B-zh、A-media、ProjectInterfaceSpec、最新 D-zh、旧 E-zh，以及 V7 `执行入口.md`、`01-统一工作流.md`、`02-内容生产与质量门.md`、`03-博客页面生成整合.md`、`04-公开交接与页面装配.md`、`参考规则/事实核验与公开引用.md`、`参考规则/22条鉴文规则.md`、`参考规则/标题与描述规则.md`、`参考规则/七罪引擎.md`、`脚本/正文计数.py`。

### 1.2 读者面切分

- `C-zh-draft.md:5–91`：候选读者正文主体。
- `C-zh-draft.md:93–105`：允许公开的 `## 来源` 模块，作为引用出口单独检查。
- `C-zh-draft.md:1–3`：C 编辑头，不计入读者正文。
- `C-zh-draft.md:109–223`：编辑附录，不进入公开页；其中 `PublicReference`、occurrence、内部定位、图位交接均只作本轮审核证据。
- 读者图位 `C-zh:22–24`、`C-zh:51–53` 既检查图文邻近性，也检查 alt/caption 的公开边界；图片文字不冒充实际资产存在性。

### 1.3 总结判定

| 门 | 当前判定 | 说明 |
|---|---|---|
| 22 条鉴文 | **PASS（22/22）** | 当前 C hash 下逐条复核；第 6、11 条为不适用但无虚构内容，仍按规则记录 PASS（不适用）。 |
| 事实与公开引用 | **PASS（正文范围）** | 关键事实、URL、主张近邻和 25 条 quote/occurrence 均重新核对；F-01/F-04 的来源冲突被保守保留，没有发布冲突阶段数字或全图硬规则。 |
| 内容 / ReaderTask | **PASS** | 唯一任务仍是松果→普通松树→第 4 阶段排错→成熟后采集松焦油；没有范围内 blocker。 |
| SEOTruth（正文语义） | **PASS** | 主关键词、唯一 ReaderTask、正文承诺相互一致；没有把英文种子词伪装成中文排名或 PAA。 |
| SEO 表面（Title/H1/Description） | **UNVERIFIED / 尚未锁定** | 当前材料没有最终 Title、H1、Description；不能把工作题或正文 H2 当作最终 SEO 表面。F 生成后仍需 E 题文复核。 |
| 机械 2000 汉字 | **PASS（仅机械）** | 按 V7 脚本与本轮排除规则为 2491；不等于 F 最终 Length/锁稿通过。 |
| 图位文字教学 | **PASS** | 两个图位均靠近对应步骤，alt/caption 明确示意图边界。 |
| 六个实际媒体文件 | **UNVERIFIED** | 封面、两张正文 WebP、三个 AVIF 兄弟全部缺失；不能因 Markdown 图位存在伪造 PASS。 |
| 页面、浏览器、build、部署、用户终审 | **UNVERIFIED / 未执行** | 本任务明确不做 UI/ego-browser；报告不声称真实文章路由、页面显示、生产或用户批准。 |

**E-zh 内容结论：PASS（绑定当前 C hash）。** 这只表示正文的内容、事实、引用、SEOTruth 语义和可读性没有范围内 blocker；媒体、最终 SEO 表面、页面、部署和用户终审仍保持各自的 UNVERIFIED 边界。

## 2. V7 22 条鉴文规则逐条复核

状态只使用 `PASS / FAIL / UNVERIFIED`；`PASS（不适用）` 表示该规则在本稿不触发且没有伪造内容。

| # | 状态 | 当前 C 原句/定位与独立判断 | 建议 |
|---:|---|---|---|
| 1 | **PASS** | `C:32–61` 保留会改变操作的农场内外、地图、季节、树肥、八邻格和自然树边界；没有塞入无关假想反驳。`C:76` 的雷击/炸弹风险直接影响设备保管。 | 无范围内修复。 |
| 2 | **PASS** | `C:5–91` 的种子来源、普通树边界、第 4 阶段排错、树肥、采集器和松焦油终点都服务一个 ReaderTask；没有扩成全树百科、收益排行或完整配方百科。 | 无。 |
| 3 | **PASS** | `C:7–24` 对象关系和表格，`C:42–47` 排错步骤，`C:69–74` 设备表承担不同作用，不是只换词的匀速排比。 | 无。 |
| 4 | **PASS** | 没有重复的“虽然……但是……”模板；`C:33、40、49` 的普通树/果树、八邻格/3×3、布局建议/游戏规则对比均改变读者判断。 | 无。 |
| 5 | **PASS** | 没有反复“我把这叫作……”或人为命名；`C:9` 的对象链是执行起点。 | 无。 |
| 6 | **PASS（不适用）** | `C:5–91` 没有虚构个人经历、情绪转折或“像真人”的失败故事；教程保持平静说明。 | 不为“人味”添加故事。 |
| 7 | **PASS** | 没有无来源的“所有人都以为”；`C:40、44` 直接写可观察的成熟邻树条件和排错动作。 | 无。 |
| 8 | **PASS** | “不是果树 3×3”“不是游戏截图/物理碰撞框”等均是必要事实边界，不构成高密度装饰模板；扫描只见少量有信息的对比句。 | 无。 |
| 9 | **PASS** | `C:57、61` 明确成长条件与自然树重生阶段来源冲突；`C:5、67、91` 将 5/2 天限定为采集器产物间隔，不冒充成熟日。 | 保留当前不发布单一成熟天数的边界。 |
| 10 | **PASS** | 20%、第 4 阶段、5 天、2 天、采集等级 4 等数字/条件均可回到对应公开页面；正文没有 18/24/38/55 天固定成熟数字。 | 无。 |
| 11 | **PASS（不适用）** | 没有“我也曾失败”等脆弱经历；没有用个人故事证明规则。 | 无。 |
| 12 | **PASS** | `C:42–47` 先看八邻格，再按种植位、地图、季节、树肥和自然树分支；`C:45` 明确“先清除或砍掉树苗，再重新种下”，没有把树苗写成可直接移动。 | 无。 |
| 13 | **PASS** | `C:84–91` 是可执行检查表，不是每段都收束成金句；`C:67` 的“分开看”承担成长/产物计时判断。 | 无。 |
| 14 | **PASS** | 段落、表格、编号步骤、图注和清单随动作变化；没有用随机断句掩饰同构节奏。 | 无。 |
| 15 | **PASS** | 没有“凭感觉”“看起来更快”等替代论证；规则、工具限制和布局建议都有来源或明确的建议边界。 | 无。 |
| 16 | **PASS** | 开头 `C:5` 直接说明松果→松树、普通树不按果树规则、采集器 5/2 天及第 4 阶段排错入口，不是空钩子或泛承诺。 | 无。 |
| 17 | **PASS** | `先/再/如果/也就是说/最后` 均连接具体动作、分支或检查；没有密集无信息的固定连接词串。 | 无。 |
| 18 | **PASS** | 术语稳定使用“松果、松树、松焦油、树液采集器、重型树液采集器、树肥”；`C:18` 将“松子/树脂/白色松树”限定为搜索变体，不偷换正式名称。 | 无。 |
| 19 | **PASS** | 中文句式自然、具体；没有把英文种子词直译成标题或混入非中文规则，专业名词与 A/B 约定一致。 | 无。 |
| 20 | **PASS** | 没有客户、玩家、我们测试、过夜实验或存档经历；`C:22、51` 明确图片是规则示意图而非游戏截图。 | 不添加“实测”叙事。 |
| 21 | **PASS** | 正文末 `C:84–91` 落到检查清单，没有“祝你……/一起开启……”等通用积极结尾。 | 无。 |
| 22 | **PASS** | 结尾回到种植位、成长排错、采集器周期和扩种决策，没有把松树上升为宏大命题。 | 无。 |

**22 条结算：PASS 22 项，FAIL 0 项，UNVERIFIED 0 项。** 这不覆盖媒体、最终 SEO 表面或页面门；这些在第 1 节单独保持 UNVERIFIED。

## 3. 六类形式指纹与可读性

| 指纹 | 状态 | 真实扫描/阅读结果 |
|---|---|---|
| 破折号过密 | **PASS** | 读者主体实际 `—/–` 数量为 0；Markdown 表格分隔线不算装饰破折号。 |
| 粗体过密 | **PASS** | 只有 `C:9` 一处对象链粗体（2 个 `**` 标记），用于流程提示。 |
| 无用装饰符号 | **PASS** | `→` 只出现在对象链和图注，表达关系；无 emoji、无无意义图标。 |
| 助手/研究残留 | **PASS** | 以 `C:5–106`（含允许的来源模块）为范围的研究日志、作者过程、内部路径/ID、PublicReference、occurrence、FAQ/CTA 扫描均 0 命中。 |
| 填充短语 | **PASS（非阻塞）** | `C:9`“先把这条关系记住”、`C:74`“也就是说”、`C:84`“最后按这张检查表收尾”后面均紧跟对象关系、结论或检查动作；删除不会暴露隐性研究过程。 |
| 泛泛积极结尾 | **PASS** | 末尾是 `C:84–91` 检查清单，没有祝福、夸大收益或泛泛承诺。 |
| 可读性总评 | **PASS** | 文章用“对象关系→种植前提→第 4 阶段排错→例外→采集器→用途→检查表”推进；句子具体，边界靠近动作，未见需要退 C 的可读性 blocker。 |

### 可选、非阻塞的人审润色建议（不改 C）

1. `C:32` 同时处理农场外、农场内和占用格，信息密度高；如 F 只做语气微调，可拆成“农场外边界”与“农场内当前页面口径”两句，但必须保留现有限定，不能改成全图统一规则。
2. `C:61` 同时说明自然松树、重生条件、来源阶段冲突和地图禁种；可在“可能重新生成小树”后断句，保持“本文不发布阶段数字”的句子独立。此项仅改善阅读节奏，不是事实 blocker。

## 4. SEOTruth 与唯一 ReaderTask

### 4.1 关键词与任务绑定

- B-zh 锁定的首选中文主表达是 **`星露谷 松树怎么种`**；自然变体为 `星露谷松树`、`星露谷松树间距`、`星露谷松树可以挨着种吗`、`星露谷松焦油怎么获得`、`星露谷松焦油有什么用`、`星露谷松果在哪`。
- 当前 C 正文不机械重复完整主表达；实际关键词字符串 `星露谷 松树怎么种` 在读者主体中为 0 次，但 `松树`、`松果`、`松焦油`、第 4 阶段、5 天、2 天等主题实体和操作均覆盖。不能把“关键词未逐字重复”写成缺词 blocker，也不能据此声称密度通过。
- 唯一 ReaderTask 是：读者有松果或普通树种植位，完成松果→松树→松焦油链；树苗卡在第 4 阶段时检查成熟邻树、种植位、季节、树肥和地图，成熟后选择普通/重型树液采集器。C `5–91` 与该任务一致。
- 读者价值是可执行的：种植前按区域检查格子；普通树不按作物浇水；第 4 阶段先看八邻格；自然树分支保留冲突；成熟后按 5/2 天采集；最后有 `C:84–91` 检查表。

### 4.2 当前 SEOTruth 状态

- **SEOTruth（正文主张/任务）:** **PASS**。正文没有承诺中国 Google 前五、PAA、排名、最快成熟、收益冠军、Planner 模拟或实机测试；主体主张均可由正文近邻链接和公开来源支持。
- **Title:** **UNVERIFIED / 尚未锁定**。当前 C 文件标题是编辑头“C-zh 候选正文（非读者标题）”，不是最终网页 Title。
- **H1:** **UNVERIFIED / 尚未锁定**。当前没有独立最终 H1；H2 不能替代 H1。
- **Description:** **UNVERIFIED / 尚未锁定**。当前没有 Description；不能从 B 的主关键词或 C 的第一段推造最终描述。
- **FAQ/FAQPage:** 候选读者正文无 FAQ 标题、无 FAQ 答案；不因缺少 FAQ 判失败。页面是否装配 FAQ/Schema 未执行，保持 UNVERIFIED。
- **CTA:** C 正文没有 `/zh#planner` CTA；`C:63` 的 `/zh/stardew-valley-trees` 是相关内容页和工具能力边界，不是规划器主 CTA。B 规定的 `BlogSources` 唯一 CTA 属页面下游槽位，本报告不把它当作当前正文证据。
- **作者、日期、canonical、OG、Article JSON-LD、真实路由:** 当前没有锁定或页面回读，均 UNVERIFIED；不得由本报告补造。
- **最近 3 篇标题去套路检查:** 标题阶段尚未执行，不能称为通过；F 生成 10 个候选并选定表面后，E 必须继续复核停留与适配。

因此，当前可以交 F 做**内容锁定前的正文淬文/机械计数准备**，但不能把未锁定 Title/H1/Description 写成 SEO 完成。

## 5. 事实、边界和具体引用审核

### 5.1 实际打开的公开 URL 与回读状态

本轮以只读 HTTPS 回读以下 9 个公开 URL；命令输出为全部 HTTP `200`，Python/BeautifulSoup 正文块提取退出码为 `0`。这些 HTTP 200 只证明本轮可读，不证明生产部署、排名或长期可用性。

1. `https://zh.stardewvalleywiki.com/松树`
2. `https://zh.stardewvalleywiki.com/松果`
3. `https://zh.stardewvalleywiki.com/树`
4. `https://zh.stardewvalleywiki.com/树液采集器`
5. `https://zh.stardewvalleywiki.com/重型树液采集器`
6. `https://zh.stardewvalleywiki.com/树肥`
7. `https://zh.stardewvalleywiki.com/松焦油`
8. `https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/`
9. `https://stardewvalleyplanner.art/zh/stardew-valley-trees`

现场回读的关键支持范围：

- `松树`页：松树由松果长成；普通/重型采集器分别 5 天/2 天产松焦油；第 4 阶段为其他阶段两倍；未施肥非冬季约 20% 推进、冬季不长；农场外自然松树清桩后页面写第 3 阶段重生。
- `松果`页：松果种在农场内外未占用可耕种格，且页面当前正文要求未使用锄头开垦；页面同时提供松果来源。该页历史说明与松树/树页共同形成农场外“不需先锄地但不要用已锄格”的边界。
- `树`页：普通树不需要浇水、不要求周围土地全部清空；成熟树占据树苗八邻格会使其停在第 4 阶段；页面泛农场外自然树段写第 2 阶段重生。
- `树液采集器`/`重型树液采集器`页：松焦油 5 天/2 天；松树上的设备冬季继续工作；雷击或炸弹可连设备和产物损坏；普通采集器配方门槛为采集等级 4。
- `树肥`页：必须施在已种下的树种、树苗或小树上；普通树施肥后冬季可继续生长；果树和茶树不适用。
- `松焦油`页：基础售价 100 金；支持正文列出的收集包、织布机、生长激素、雨水图腾、裁缝、鱼塘等用途。
- 官方 1.6 changelog：明确不能在城镇或海滩农场隧道种树；C 只把该来源用于这条地图限制，没有外推成 Pine 的绿雨转化或全图许可。
- 本站中文树木页：实际文字含 `Pine Tree`、树木不可生长区、且明确规划器不能计算生长天数、自动落种或树液产出；C:63 的工具边界没有把目录对象当游戏物理证据。

### 5.2 F-01 / F-04 重点回归

| 事实边界 | 当前状态 | C 原句与判断 |
|---|---|---|
| **F-01 农场内外种植边界** | **PASS（正文措辞）；通用 1.6.15 规则仍 UNVERIFIED** | `C:32`：“种松果时要按区域检查位置：农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子；农场内则按当前中文[松果]页的口径检查格子未被占用、属于可耕种格，而且没有被锄头开垦。”这严格区分农场外历史边界与农场内当前页面口径，没有写成所有位置同一硬规则；`C:34` 另保留官方城镇/海滩农场隧道禁种。补查仍不能证明每一行都已由 1.6.15 官方逐页锁定，但当前正文没有越过该未知边界。 |
| **F-04 自然树重生阶段冲突** | **PASS（正文保守处理）；Stage 2/3 事实仍 UNVERIFIED** | `C:61` 只写“公开来源记载该位置可能重新生成小树”，并明确“中文松树专页与泛《树》页对自然树重生阶段的口径不一致，本文不发布阶段数字，也不把这条自然树规则扩展成种植许可”。现场回读确认 Pine 页写第 3 阶段、泛《树》页写第 2 阶段；C 没有挑选其一。 |
| **不可直接移动树苗** | **PASS** | `C:45`：“若必须换位，先清除或砍掉树苗，再在合规位置重新种下；或者只把成熟邻树与新种树苗错开。”没有“直接移动/移动树苗”的误导动作。 |
| **松焦油基础售价近邻链接** | **PASS** | `C:82` 直接在“基础售价”前使用 `[松焦油](https://zh.stardewvalleywiki.com/松焦油)`；后半句把“松树最赚钱”保留为没有统一比较来源的作者分析边界，没有伪装成来源结论。 |

### 5.3 其余关键事实结算

| ID | 状态 | C 定位 | 来源与边界判断 |
|---|---|---|---|
| F-02 普通树身份/不浇水/非果树 3×3 | **PASS** | `C:5、9、33` | `松树`/`树`页支持 Pine 属普通树、普通树不需浇水且不要求周围土地全空；C 明确不把果树 3×3 套给 Pine。 |
| F-03 第 4 阶段阻挡 | **PASS** | `C:38–49` | `树`页支持成熟树占八邻格导致树苗停在第 4 阶段；“树干留一格”被明确写成管理建议，不是游戏 footprint。 |
| F-04 成长概率/季节/树肥 | **PASS（条件化）** | `C:57–59` | 20%、冬季、树肥对象和普通树例外均有对应页面；C 没有把树肥写成固定成熟日。 |
| F-05 采集器周期 | **PASS** | `C:5、69–74、91` | 普通 5 天、重型 2 天、松树上冬季继续工作；单位、对象、设备边界完整。 |
| F-06 设备损坏/取回 | **PASS** | `C:76` | 树液采集器页支持取下、雷击/炸弹风险；正文没有声称个人实测。 |
| F-07 松焦油用途 | **PASS** | `C:78–82` | 松焦油页支持代表性用途和基础售价；用途列表没有被扩写成完整配方百科或收益排序。 |
| F-08 Planner 能力 | **PASS** | `C:63` | 站内页支持 Pine Tree 外观/不可长树格和“不模拟成长、自动落种、采集器计时、松焦油产出”的边界；目录对象没有被当作游戏物理证据。 |
| F-09 禁止推断回归 | **PASS** | `C:22–24、49–53、61、63、82` | 读者主体没有固定成熟天数、收益排名、Pine footprint、Green Rain 转化或 Planner 正文 CTA；相关词只出现在否定边界或图文说明。 |
| F-10 版本/来源边界 | **PASS** | `C:34、57–61、74` | 官方 changelog 只支撑城镇/海滩农场隧道限制；C 没有声称所有中文 Wiki 行逐条锁定 1.6.15，也没有把 1.6 总更新外推成 Pine 绿雨规则。 |

**当前事实门结论：** F-01/F-04 的“公开来源冲突”仍存在，但已从正文中显式限定或删除争议数字；在“不把未解决事实写成硬规则”的意义下，当前 C 没有范围内事实 blocker。

### 5.4 PublicReference URL、claim、近邻和边界

当前 C 读者面共有 **11 个唯一 URL**，均落在允许的中文 Wiki、官方 changelog、本站中文树木页和两张计划正文图路径内；未知 URL `[]`，allowlist exit `0`。

| PublicReference | 当前支持的正文主张 | 近邻定位 | 边界 |
|---|---|---|---|
| `wiki-zh-pine-tree` | 松树属普通树、松果对应松树、自然松树可砍/挂采集器 | `C:5、9、20、61`；对应正文链接就在主张附近 | 页面与泛树页成长/自然树阶段口径冲突，不单独支持固定成熟日或无条件 Stage 3。 |
| `wiki-zh-pine-cone` | 松果来源、种植格/锄地边界、杂货店边界 | `C:20、32`；链接在同段 | 农场外历史说明与当前正文需按区域限定；不把来源页的成长平均值写成固定日。 |
| `wiki-zh-trees` | 普通树/果树边界、不浇水、八邻格、第 4 阶段、20% 和地图/自然树限制 | `C:9、33、40、57、61` | 泛规则不得覆盖 Pine 专页冲突；不把 3×3 或 Stage 2 写成 Pine 的无条件规则。 |
| `wiki-zh-tapper` | 普通采集器 5 天、采集等级 4、冬季继续工作、设备风险 | `C:5、71、74、76` | 5 天是产物间隔，不是树成熟时间。 |
| `wiki-zh-heavy-tapper` | 重型采集器 2 天、冬季继续工作 | `C:5、72、74` | 2 天不适用于普通采集器；晚期设备门槛不扩写。 |
| `wiki-zh-tree-fertilizer` | 已种树种/树苗/小树施肥、普通树冬季推进、果树/茶树例外 | `C:57–59` | 不用树肥页裁决自然树 Stage 2/3 冲突。 |
| `wiki-zh-pine-tar` | 松焦油用途和基础售价 | `C:80、82` | 售价不推出“松树最赚钱”；用途不扩成完整配方/收益百科。 |
| `official-1-6-changelog` | 城镇/海滩农场隧道禁种树 | `C:34、61` | 1.6 总更新不支撑 Pine 必然绿雨转化或自然树 Stage 2/3。 |
| `site-zh-general-trees` | Planner 的布局示意能力和能力边界 | `C:63` | 不支持游戏成长、产出或物理 footprint。 |

正文链接没有搜索页、AI 摘要、Bwiki、内部路径或私有参数；`C:93–105` 来源模块的标签和 URL 与上述公开出口一致。

### 5.5 25 条 quote/occurrence 逐条命中

按 V7 `04-公开交接与页面装配.md` 的 Markdown 规则，对 NFC/LF 规范化、编辑附录前的读者 Markdown 做原文连续片段检查；`occurrence` 从 1 开始。当前结果：**refs=25，quote_validator_failures=0，exit=0**。第 01 条出现 2 次，但 `occurrence: 1` 指向首个 `C:5`；其余 24 条各出现 1 次。

| # | PublicReference | quote（缩写/原文开头） | count | lines | expected | 状态 |
|---:|---|---|---:|---|---:|---|
| 01 | `wiki-zh-pine-tree` | `松树属于普通树` | 2 | 5, 33 | 1 | PASS |
| 02 | `wiki-zh-pine-tree` | `成熟松树掉在地上的未发芽松果` | 1 | 20 | 1 | PASS |
| 03 | `wiki-zh-pine-tree` | `可以砍伐或挂采集器` | 1 | 61 | 1 | PASS |
| 04 | `wiki-zh-pine-cone` | `农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子` | 1 | 32 | 1 | PASS |
| 05 | `wiki-zh-pine-cone` | `格子未被占用、属于可耕种格，而且没有被锄头开垦` | 1 | 32 | 1 | PASS |
| 06 | `wiki-zh-pine-cone` | `采集等级达到 1 后摇晃或砍倒松树` | 1 | 20 | 1 | PASS |
| 07 | `wiki-zh-pine-cone` | `成熟松树掉在地上的未发芽松果` | 1 | 20 | 1 | PASS |
| 08 | `wiki-zh-pine-cone` | `杂货店不卖松果` | 1 | 20 | 1 | PASS |
| 09 | `wiki-zh-trees` | `不需要像作物那样每天浇水` | 1 | 33 | 1 | PASS |
| 10 | `wiki-zh-trees` | `普通树不要求周围土地全部清空` | 1 | 33 | 1 | PASS |
| 11 | `wiki-zh-trees` | `树苗就会永远停在第 4 阶段` | 1 | 40 | 1 | PASS |
| 12 | `wiki-zh-trees` | `成熟树占据树苗八邻格时阻止继续成长` | 1 | 40 | 1 | PASS |
| 13 | `wiki-zh-trees` | `在非冬季每晚约有 20% 的机会进入下一阶段` | 1 | 57 | 1 | PASS |
| 14 | `wiki-zh-tapper` | `普通采集器 5 天` | 1 | 5 | 1 | PASS |
| 15 | `wiki-zh-tapper` | `挂在松树上的采集器冬季继续工作` | 1 | 74 | 1 | PASS |
| 16 | `wiki-zh-tapper` | `配方从采集等级 4 开始` | 1 | 71 | 1 | PASS |
| 17 | `wiki-zh-heavy-tapper` | `重型采集器 2 天` | 1 | 5 | 1 | PASS |
| 18 | `wiki-zh-tree-fertilizer` | `必须施在已经种下的树种、树苗或小树上` | 1 | 59 | 1 | PASS |
| 19 | `wiki-zh-tree-fertilizer` | `对普通树来说，树肥可以让它在冬季继续推进` | 1 | 59 | 1 | PASS |
| 20 | `wiki-zh-tree-fertilizer` | `果树和茶树不适用` | 1 | 59 | 1 | PASS |
| 21 | `wiki-zh-pine-tar` | `松焦油有明确用途` | 1 | 80 | 1 | PASS |
| 22 | `wiki-zh-pine-tar` | `工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务` | 1 | 80 | 1 | PASS |
| 23 | `wiki-zh-pine-tar` | `页面列出了这件物品的基础售价` | 1 | 82 | 1 | PASS |
| 24 | `official-1-6-changelog` | `不能在城镇或海滩农场的隧道里种树` | 1 | 34 | 1 | PASS |
| 25 | `site-zh-general-trees` | `规划器可以帮助你做布局示意` | 1 | 63 | 1 | PASS |

## 6. 禁止项、内部路径、CTA、重复和读者价值

### 6.1 禁止项回归

对读者正文 `C:5–91` 的针对性扫描：

| 扫描项 | 结果 | 说明 |
|---|---|---|
| 固定成长数字 `18/24/38/55 天/日` | **0 命中 / PASS** | 正文没有把多页冲突数字写成成熟倒计时。 |
| 种植许可推断 | **PASS** | `C:32、34、61` 的“任何地方/所有地图/种植许可”均出现在否定或限制语境；没有发布全图许可。 |
| 收益排名 | **PASS** | “松树最赚钱/收益排名”只出现在 `C:16、24、82` 的明确否定边界，不是文章结论。 |
| Pine footprint / 游戏碰撞框 | **PASS** | `C:49、51、63` 明确不把留空建议、图示或 Planner 目录对象当物理碰撞证据。 |
| Green Rain 转化 | **0 命中 / PASS** | 没有将 Maple/Oak 行为迁移给 Pine。 |
| 正文 `/zh#planner` CTA | **0 命中 / PASS** | 只有 `/zh/stardew-valley-trees` 相关内链；页面 CTA 若存在属于下游装配，尚未验证。 |
| 直接移动树苗 | **0 命中 / PASS** | `C:45` 已明确清除/砍掉后重种或只调整成熟邻树。 |

### 6.2 ResearchTrace / 内部污染扫描

以 `C:5–106` 为输入，研究日志、作者过程、内部路径/ID、FAQ/CTA 关键词扫描实际输出：

```text
research/log hits=0
author/process hits=0
internal paths/ids hits=0
faq/cta hits=0
scan_exit=0
```

`C:93–105` 的来源标题和公开 URL 是合法公开引用模块；本轮没有把“来源”关键词误判为内部研究痕迹。

### 6.3 重复与 FAQ

独立只读脚本以空行分块、去除 Markdown 链接/图片语法后复核，输出如下；本脚本的分块数与 D 使用的分块策略不同，因此只将实际重复结论作为证据：

```text
reader_body_blocks=31
exact_duplicate_blocks={}
faq_headings=[]
near_duplicate_pairs=[]
repetition_assertions_exit=0
```

没有发现两个承担同一作用的精确重复块或近重复块。`C:69–74` 设备表/说明与 `C:84–91` 检查表作用不同；图 1/图 2 的图注也分别承担对象链与八邻格边界，不是重复凑字。

### 6.4 ReaderValue 与明确下一步

- 读者可以从松果来源和种植格条件开始，不会把普通树当作需要每日浇水的作物。
- 树苗停在第 4 阶段时有先后顺序：先查八邻格成熟树，再查种植位、地图、季节、树肥和自然树分支。
- 成熟后能区分普通/重型树液采集器的 5 天/2 天间隔，并知道冬季在松树上继续工作。
- Planner 被限定为布局示意，不能替代成长、自动落种或松焦油产出判断。
- `C:84–91` 提供明确下一步检查表；没有范围内读者任务 blocker。

## 7. 图位与六媒体状态

### 7.1 文字图位：PASS

- **图 1：** `C:22–24` 紧邻对象关系表/种植入口；alt/caption 表达松果→普通松树→成熟树上的采集器→松焦油，并明确不是截图、不表示固定成长天数或收益排名。
- **图 2：** `C:51–53` 紧邻八邻格排错；alt/caption 表达中心树苗、八邻格和成熟邻树阻挡第 4 阶段，并明确留一格只是布局做法，不是果树 3×3 或物理碰撞框。

### 7.2 六个实际媒体：UNVERIFIED

本轮真实存在性检查的输出：

```text
MISSING public/blog/pine-tree-stardew-cover.webp
MISSING public/blog/pine-tree-stardew-cover.avif
MISSING public/blog/illustrations/pine-tree-seed-to-tar.webp
MISSING public/blog/illustrations/pine-tree-seed-to-tar.avif
MISSING public/blog/illustrations/pine-tree-stage-four-neighbor.webp
MISSING public/blog/illustrations/pine-tree-stage-four-neighbor.avif
media_presence_check_exit=1
```

`exit=1` 是本轮 fail-fast 脚本对缺失文件的真实返回，不是“循环成功”或媒体通过。六个文件均缺失，因此未证明：尺寸 `1672×941`、封面 `≤1.25 MiB`、正文图 `≤400 KiB`、WebP `VP8 ` 有损、AVIF `ftypavif`、授权/署名、画面内容、真实页面加载、桌面/移动端显示。不得因 C 中已有 Markdown 图位或 alt/caption 把媒体门写成 PASS。

## 8. 机械 2000 汉字与锁稿边界

使用 V7 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py` 的 `normalized`、`extract_body`、`count_units`；输入范围为 `C:5–91`，排除 `## 来源`、编辑附录、标题、图片 alt 和 `*图 1/*图 2` caption。真实输出：

```json
{
  "reader_line_range": "C-zh:5-91",
  "mechanical_units": 2491,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "omitted_line_counts": {
    "headings": 7,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 36,
    "frontmatter": 0
  },
  "sha256_raw": "b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2",
  "sha256_nfc_lf": "b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2"
}
mechanical_length_check_exit=0
```

2491 只证明机械下限满足；不证明 F 的最终淬文、语义去重、最终 Length、NFC/UTF-8 锁稿或用户接受。

## 9. 实际命令与退出码记录

以下是本轮产生结论的真实只读命令/回读边界；没有执行任何受保护写入、构建输出、外部写操作或 git 写操作。

| 命令/检查 | 结果 | 退出码 |
|---|---|---:|
| `pwd && git status --porcelain=v1 --untracked-files=all` | 工作目录正确；写前目标目录已有 13 个未跟踪 Markdown 文件，未见目录外路径 | 0 |
| `shasum -a 256 docs/blog-ops/pine-tree-stardew/{C-zh-draft.md,A-zh-research.md,A-zh-supplement.md,B-zh-layout.md,A-media-plan.md,project-interface-spec.md,D-zh-check.md,E-zh-review.md}` | 输出本报告第 1 节全部 hash | 0 |
| `curl -L -sS --max-time 30 -o /dev/null -w '%{http_code}' <9 public URLs>` | 9 个公开 URL 均返回 HTTP 200 | 0 |
| `python3` URL percent-encoding + `urllib` + `BeautifulSoup` 正文块回读 | 9 个 URL 可读；关键 Pine/Tree/Tapper/Fertilizer/Pine Tar/官方/站内边界见第 5 节 | 0 |
| `python3` PublicReference 解析 + NFC/LF quote 查找 | `refs=25`；第 01 条 count=2，其余 count=1；`quote_validator_failures=0` | 0 |
| `python3` Markdown URL allowlist | `unique_url_count=11`；`unknown_urls=[]`；`allowlist_exit=0` | 0 |
| `python3` ResearchTrace/author/internal/FAQ-CTA 扫描 | 四组 hits 均 0；`scan_exit=0` | 0 |
| `python3` 重复/FAQ/近重复扫描 | `exact_duplicate_blocks={}`、`faq_headings=[]`、`near_duplicate_pairs=[]` | 0 |
| `python3` V7 count functions + `正文计数.py` 规则 | `mechanical_units=2491`；`mechanical_length_check_exit=0` | 0 |
| 六媒体 `test -f` 存在性循环 | 六项均 `MISSING`；`media_presence_check_exit=1`，按本报告分类为 UNVERIFIED | 1（预期缺失） |
| 22 条、事实、可读性和 SEOTruth 人审 | 本报告逐项记录位置、事实边界和未锁表面；无 C blocker | 不适用 |

补充：早期辅助脚本曾在把未 percent-encode 的 Unicode URL 直接交给 `urllib` 时得到 `UnicodeEncodeError`，该结果未用于证据；改为 URL percent-encoding 后的最终回读命令退出码为 0。报告不把失败的辅助尝试伪装成来源失败。

### 9.1 写后回读与 allowlist

本报告覆盖后再次执行目标文件尾空格、Git 检查、状态和受保护 hash 回读：

| 写后命令/检查 | 真实结果 | 退出码 |
|---|---|---:|
| `test -s docs/blog-ops/pine-tree-stardew/E-zh-review.md` | 报告非空；当前回读为 370 行、35928 bytes | 0 |
| `awk '/[[:blank:]]$/{print NR ":" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/E-zh-review.md` | 无尾空格输出 | 0 |
| `git diff --check` | 无输出，无 whitespace 诊断 | 0 |
| `git diff --no-index --check /dev/null -- docs/blog-ops/pine-tree-stardew/E-zh-review.md` | 目标是未跟踪新文件；无 whitespace 诊断，`rc=1` 为预期 new-file diff | 1（预期） |
| `git diff --name-status` | 空输出；目标目录内文件均为未跟踪基线，普通 diff 不展示内容 | 0 |
| `git status --short --untracked-files=all` | 仍只有既有目标目录 13 个 Markdown 路径，无目录外路径 | 0 |
| `shasum -a 256` 保护文件回读 | C/A-zh/A-supplement/B-zh/A-media/spec/D-zh hash 与第 1 节一致，未漂移 | 0 |
| `shasum -a 256 docs/blog-ops/pine-tree-stardew/E-zh-review.md` | 目标报告非空且可回读；不把报告自身 hash 嵌入报告，避免 self-hash 文字导致 hash 自漂移 | 0 |

上述状态回读证明本轮只覆盖允许报告；没有 staging、commit、push、deploy、source/public/tests/package 或外部服务写入。

## 10. 写后边界、用户终审和 F 交接

- **当前 C 仍绑定：** `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2`；本 E 只对这一版有效。
- **D/E 同版条件：** 最新 D 记录的输入 C hash 与本 E 相同；本报告的正文 PASS 可交 F 做同版淬文/计数准备。
- **F 下一步：** 先按 V7 对当前版做最终 NFC、正文锁定和 2000 计数；再独立生成 10 组 Title/Description 方向，选定 Title/H1/Description，之后由 E 复核最终题文兑现。当前 SEO 表面仍未锁定，不能提前写 PASS。
- **媒体下游：** A-media/G 仍需补齐六个实际文件并回读尺寸、格式、字节、授权、画面和页面绑定；媒体缺失不阻塞本报告的正文内容 PASS，但阻塞完整页面/图文完成。
- **页面边界：** 没有执行本地路由、build、浏览器/ego-browser、桌面/手机页面、生产 URL、部署或搜索收录验证；本报告不声称页面或网站成品完成。
- **用户终审：** **WAITING / 尚未进行**。用户尚未在现有网站完整页面上终审；内容审核 PASS 不能代替用户批准。
- **禁止重新引入：** F/C 后续不得重新加入固定成长数字、种植许可推断、收益排名、Pine footprint、Green Rain 转化或 Planner 正文 CTA；不得把媒体缺失改写成 PASS。

**最终 E-zh 判定：当前 C hash `b92b795948cbc5bc6146bcb77b5e809c188f5a8e4e4a1157b64bc62250d05af2` 下，22 条鉴文 PASS，事实/引用与 25 条 PublicReference 定位 PASS，正文 SEOTruth PASS，内容/可读性 PASS；Title/H1/Description 尚未锁定，六媒体 UNVERIFIED，页面/部署/用户终审 UNVERIFIED/WAITING。**
