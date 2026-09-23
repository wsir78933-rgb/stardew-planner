# E-zh 独立内容、事实与引用审核：`profit-margin-stardew`

**审查日期：** 2026-09-22（Asia/Shanghai）
**角色：** 独立 E-zh 审核。本次重新读取 A-zh 的公开证据、B-zh 的任务边界、当前 C-zh；没有把 D 报告、其他 worker 自报、SERP、论坛或 Mod 当作原版机制证据，也没有做英文稿翻译对照。只新建本报告，不修改正文、A/B/D、英文文件、代码、媒体或页面。

## 执行结论

**总体：REVISE（正文主任务和大部分事实通过；引用邻近性需最小修订）。** C-zh 当前 120 行，原始 SHA-256 为 `40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9`；V7 机械计数为 2,080 个 zh-CN 合格单位，位于 B-zh 的 2,000–2,300 目标内，但这只是只读计数，不是 F 的最终 Length 放行。关键媒体资产、渲染、锁后 Title/Description、PublicBlogHandoff、D 同版复核、G 组页、页面和用户终审均保持 **UNVERIFIED**，不把它们写成已通过。

| 审核面 | 结果 | 精确结论 |
|---|---|---|
| 唯一主意图与读者任务 | **PASS** | C:1–113 只服务“理解 Profit Margin、按条件选择四档并在新农场设置”的任务；没有把赚钱路线、计算器、Mod 或旧档教程并入正文。 |
| 机制事实与算术 | **REVISE** | 四档、倍率、截断/1g、Wheat、Crab Pots、多人再平衡和高层设置路径有公开来源；C:54 的“固定费用”宜收窄为“来源明确列出的固定类别”，避免超出 Multiplayer 的列举范围。 |
| 公开引用与 Sources | **REVISE** | Wiki 页面均可读，来源内容支持主张；但 C:5、C:7 的非全局边界紧邻的是中文 Options 链接，建议把现有 Multiplayer 链接移到该边界句或紧邻 C:7。C:117–120 没有写 checked 日期，因此没有制造虚假日期；锁后若添加 checked label，必须绑定本次真实回读。 |
| 内容质量与 22 条鉴文 | **PASS** | 直接答案、条件化选择、边界例子和安全分支齐全；22 条规则逐项结果见下表，只有体裁不适用项标 N/A。 |
| SEOTruth（正文壳） | **PASS** | 工作 H1、首段 direct answer、主关键词自然出现、H1→H2→H3 层级、相关内链均与正文任务一致。 |
| SEOTruth（锁后表面） | **UNVERIFIED** | 当前 C 没有最终 Title/Description、作者、slug、schema 或 handoff 表面；本报告不锁题文，不签 Title/Description/页面 SEOTruth。 |
| 两个图位的视觉语义 | **PASS / UNVERIFIED** | C:46–50 的图 1 解决价格边界，C:97–101 的图 2 解决设置路径，职责不重叠；真实 WebP/AVIF、尺寸、权利、渲染和移动端可读性未执行，资产状态为 UNVERIFIED。 |
| V7 计数 | **PASS（机械观察）** | `mechanical_units=2080`、floor `2000`、exit 0；脚本自身仍标记 `requires_independent_review`，不能代替 D/E/F 的语义和锁稿结论。 |

## 版本绑定与独立证据

本报告中的 `C:x` 均绑定当前 `C-zh-draft.md` 及上述 SHA-256；C 改动后这些行号和结论失效。

| 输入 | SHA-256 |
|---|---|
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| 当前 `C-zh-draft.md` | `40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |
| V7 `02-内容生产与质量门.md` | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` |
| V7 `03-博客页面生成整合.md` | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` |
| `22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| `事实核验与公开引用.md` | `56f2d6ea29ae9a0e9384355a9ee368f29676f1d5e45013f81a5bd250b218f2ad` |

### 原始来源回读

2026-09-22 使用本地 ego-browser 逐页打开并读取正文，不启动本地服务；再用 `curl -LfsS` 做只读状态和正文片段回读。四个 Wiki URL 均返回 HTTP 200，页面标题和公开正文可读：

| 来源 | 回读到的支持内容 | 页面 footer 观察 |
|---|---|---|
| [中文选项](https://zh.stardewvalleywiki.com/选项) | `利润率：普通/75%/50%/25%`、物品售出价格倍数、降低可提高难度、扳手进入高级游戏设置、价格不低于 1 | `最后编辑于2026年5月12日` |
| [Options](https://stardewvalleywiki.com/Options) | 新游戏角色创建界面左下角扳手进入 Advanced Options；Profit Margin 的 Normal/75%/50%/25%、售出物品/种子倍率、整数截断和 1g 下限 | `16 March 2026` |
| [Multiplayer — Profit margins](https://stardewvalleywiki.com/Multiplayer#Profit_margins) | 多人生产力再平衡、most sold items、Pierre 种子、指定 Joja 商品、Wheat 25g→6g、固定类别和 Willy 的 Crab Pots 1,500g | `15 August 2026` |
| [Getting Started](https://stardewvalleywiki.com/Getting_Started) | 角色创建菜单的扳手包含 Advanced Options，其中包括 changing the profit margin | `16 August 2026` |

C 的 Sources 没有声称“checked on”某个日期，所以当前没有日期误导；本报告的审查日期和上表的 footer 观察不能直接替代未来 handoff 的 checked label。

## Claim-by-claim 事实与版本审计

| 主张 | C 行号 | 结果 | 独立核验与最小处理 |
|---|---:|---|---|
| 四档与倍率：Normal/100%、75%、50%、25%，作用于来源明确的售出物品和种子价格 | 5, 9–18 | **PASS** | Options 和中文选项正文均列出四档及两类倍率；100% 是 Normal/default 的直接读法，Multiplayer 也把 default 写为 100%。 |
| 种子/出售边界不是全局商店乘数 | 5–7, 18, 26–36 | **REVISE** | Multiplayer 支持“most”和指定商品边界；C 的实质正确，但 C:5/C:7 的边界句没有紧邻 Multiplayer 链接。移动 C:26 的现有链接到该句，或把同一链接放到 C:7，且将 C:54 的“固定费用”改为“来源明确列出的固定类别”。 |
| 小数截断、最低 1g | 18, 34 | **PASS** | Options 原文明确“fractional prices are truncated”且 never below 1g；Wheat 的 25% 计算为 25×0.25=6.25，截断为 6g，是透明算术，不是实测冒充。 |
| Wheat 25g/25% 时 6g | 34, 50 | **PASS** | Multiplayer 原文直接给出 25% 时 Wheat 为 6g 而非 25g；C 没有把此例外外推成所有物品。 |
| Crab Pots 1,500g 不随低档位一起缩放 | 40, 50, 74 | **PASS** | Multiplayer 直接说明 Willy 仍以 1,500g 出售 Crab Pots；C 同时保留固定类别限制。 |
| 受影响类别：多数出售物品、Pierre 种子、指定 Joja 商品 | 26, 30, 32–36 | **PASS** | Multiplayer 列出 crops/forage/minerals/cooked foods、Pierre seeds 和 Grass Starter/Sugar/Wheat Flour/Rice；C 用“多数/指定”而非“全部”。 |
| 不受影响类别：铁匠、鱼店、旅行货车、建筑、工具升级、任务金币 | 5, 28–30, 38–44 | **PASS** | Multiplayer 逐项支持；C 的待核验分支也没有把未列项目猜成已知规则。 |
| 多人再平衡理由 | 54, 59, 68 | **PASS** | Multiplayer 说明降低 margin 是为抵消活跃玩家增多带来的生产力；75%/50% 的场景建议是 C 的条件化编辑判断，不伪装成 Wiki 表格。 |
| 单人/多人/挑战档位建议 | 54–82 | **PASS** | C 明确没有普遍最佳值；普通、75%/50%、25% 都以人数、节奏和约束目标为条件，没有固定收益或完成时间承诺。 |
| 新农场设置路径 | 86–94 | **PASS** | Options 和 Getting Started 均支持“角色创建界面→扳手→高级选项→利润率”；路径是文档化高层路径，不是游戏 UI 实测。 |
| PC/主机/移动端具体按钮、标签、版本行为 | 95, 101, 105 | **UNVERIFIED（措辞合格）** | C 明确声明未逐平台截图实测并要求按当前平台/版本核对；不能再补写平台通用细节。 |
| 现实会计、固定进度/金币、旧档/Mod/计算器越界 | 5, 22, 64, 68, 74, 103–105 | **PASS** | C 明确把游戏倍率与净利润分开，并排除固定进度、金币预测、旧档修改和 Mod；没有引用论坛或 Mod 作为机制依据。 |

## 公开引用与 Sources

| 引用位置 | 结果 | 证据与最小修复 |
|---|---|---|
| C:5 的中文选项链接 | **REVISE** | 链接可读且支持四档/倍率，但同句后半的“商店费用、建筑、工具升级和任务金币”由 Multiplayer 支持，不由中文 Options 单独支持；把 C:26 现有 Multiplayer 链接移到该边界句或 C:7。 |
| C:18 的英文 Options 链接 | **PASS** | 链接正文可读，邻近支持售出/种子倍率、截断和 1g 下限。 |
| C:26、C:68 的英文 Multiplayer 链接 | **PASS（局部位置需调整）** | 链接正文支持受影响/固定类别、Wheat、Crab Pots 和多人再平衡；C:26 作为完整边界链接有效，但前面的 C:5/C:7 仍需更近的绑定。 |
| C:86 的中文 Options 与 Getting Started 链接 | **PASS** | 两页均可读且支持高层新游戏路径；C:95/101 没有把它们写成逐平台实测。 |
| C:117–120 Sources | **PASS** | 四个标签和 URL 都指向具体 Wiki 页面；没有 SERP、论坛、Mod 或通用首页冒充原版机制来源。当前不含 checked 日期，不构成虚假日期声明。 |
| C:70 站内内链 | **PASS** | `/zh/how-to-earn-money-stardew` 只作为前期预算背景补充，实际 curl 返回 200；没有复制赚钱路线或把规划器写成计算器。 |
| 来源清单与内部证据 | **PASS** | C 没有把事实 ID、访问日志、A/B/D 路径、SERP 参数、内部 hash 或 reviewer 指令写入读者正文。 |

## 内容质量、范围与信息增益

| 检查项 | 结果 | 精确行号与判断 |
|---|---|---|
| 读者能完成唯一设置选择 | **PASS** | C:5–18 解释四档和倍率，C:28–44 划分边界，C:54–82 条件化选择，C:86–113 给路径和创建前检查。 |
| 没有现实会计混淆 | **PASS** | C:5、22、113 将游戏价格倍率与现实净利润区分，未展开现实会计公式。 |
| 没有普遍最佳值 | **PASS** | C:54、64、68、78、82 明确按人数、节奏和约束判断，没有“所有人最佳”。 |
| 没有固定进度/金币承诺 | **PASS** | C:64、68、74 明确不推出固定完成时间、金币损失或“慢几倍”。 |
| 没有泛赚钱/计算器/Mod/旧档越界 | **PASS** | C:70 的一次预算内链保持边界；C 全文未出现计算器、Mod、旧档 XML 或操作步骤。 |
| 中文自然、无 AI 套话、无无意义重复 | **PASS** | C 的表格/步骤是读者比较和设置所需结构；“固定边界”在不同位置分别承担误解纠正、例子、选择和最终检查，不是重复凑字。残留扫描无内部流程词；`fig-01`/`fig-02` 是语义图位，不是助手残留。 |
| 信息增益 | **PASS** | 相比只解释四档，C 额外提供现实会计误读的阻断、受影响/固定边界、Wheat/Crab Pots 对照、条件决策和平台不确定分支。 |

## SEOTruth 相关结论（当前正文阶段）

| SEOTruth 面 | 结果 | 绑定证据 |
|---|---|---|
| 工作 H1 ↔ 正文承诺 | **PASS** | C:1 的工作 H1 同时承诺“是什么”和“四档怎么选”；C:5–82 实际解释并给出条件化选择。它不是最终 Title。 |
| 首段 direct answer | **PASS** | C:5 紧跟 H1/H2 后给出定义、四档、售出/种子范围和非全局边界；该段 96 个汉字，落在 B:122 的 70–100 目标内。非全局句的链接邻近性仍按上文 REVISE。 |
| 主关键词自然覆盖 | **PASS** | `profit margin stardew valley` 的实体词在 C:1、3、5、9、20、52、84 等处自然出现，没有密度承诺、排名承诺或中文搜索量伪证。 |
| 标题层级 | **PASS** | 只有 C:1 一个 H1；C:3、9、24、52、84、115 为 H2，必要分支为 H3；正文没有第二个 H1。 |
| FAQ/PAA | **PASS（正文）/UNVERIFIED（页面表面）** | C:20、76、80 已把相关问题嵌入主任务，没有为凑模块新增 FAQ；是否保留任何页面 FAQ/FAQPage 由锁后表面决定，本报告不添加 schema。 |
| Title / Description / author / slug / schema | **UNVERIFIED** | 当前文件只提供工作 H1 和正文；F 尚未生成锁后表面，本 E-zh 不锁最终 Title/Description，也不声称 Article/FAQPage 页面已通过。 |
| 内链与 Sources | **PASS（正文）/UNVERIFIED（handoff）** | C:70 的一次内链服务预算背景，C:117–120 的公开来源标签准确；PublicBlogHandoff、checked label、最终 bodyHash 和页面读取仍未执行。 |
| SEOTruth 总结 | **UNVERIFIED（锁后）** | 当前可签的是“工作 H1/正文承诺相符”；最终 SEOTruth 必须在 F 锁定 Title/Description 等表面后由 E 绑定同一最终 hash 复核。 |

## 视觉语义与媒体状态

| 图位 | 正文语义 | 结果 |
|---|---|---|
| `fig-01-price-boundary`，C:46–50 | 跟在受影响/不受影响矩阵后，用 Wheat 25g→6g 与 Crab Pots 1,500g 对照价格边界；alt/caption 没有新增未核验类别。 | **PASS（语义）/UNVERIFIED（资产与渲染）** |
| `fig-02-advanced-options-path`，C:97–101 | 跟在有序设置路径后，展示“新建游戏→扳手/高级设置→Profit Margin→四档→创建农场”；明确是平台中立示意而非实机截图。 | **PASS（语义）/UNVERIFIED（资产与渲染）** |

当前 checkout 未执行图片生成、未绑定 WebP/AVIF、未核验 1672×941、≤400 KiB、权利记录、真实 alt/caption、lazy loading、桌面/移动渲染或图内文字可读性。因此不能从两个 Markdown 图位声称 F/G/页面媒体通过。

## 22 条鉴文规则

以下只评价当前 C hash；`PASS` 不是 AI 检测分数，也不抵消引用、媒体、锁后 SEOTruth 和页面的未完成状态。

| # | 规则 | 结果 | 当前 C 的独立判断（含行号） |
|---:|---|---|---|
| 1 | 堵住所有反驳 | **PASS** | C:26、42–44、95、103–105 只保留会改变分类、设置动作或平台判断的例外，没有写成假想反驳清单。 |
| 2 | 知识全部输出 | **PASS** | C:70 的预算内链是唯一邻接内容；没有把 A 的计算器、泛赚钱、论坛/Mod 或无关 PAA 全部搬入。 |
| 3 | 匀速排比 | **PASS** | C:11–16 表格和 C:90–93 步骤使用平行结构是比较/操作所必需；C:20–44、62–82 的解释节奏有变化。 |
| 4 | 让步模板反复出现 | **PASS** | C:68、74、78、82 的转折各自说明人数、挑战或条件取舍，没有连续套用“虽然……但是……”模板。 |
| 5 | 反复给概念命名 | **PASS** | C:5、18、24–44 始终使用 `Profit Margin`、受影响/不受影响、固定类别等稳定术语，没有反复造新名称。 |
| 6 | 情绪曲线太光滑 | **N/A** | 这是机制解释和设置选择指南，C 没有冒充亲历的情绪故事；该规则不适用于本体裁。 |
| 7 | 虚构读者错误再反驳 | **PASS** | C:5、22、64、68、74 纠正具体的会计/普遍最佳/固定进度误读，没有声称“所有读者都以为”。 |
| 8 | 高密度“不是 X 而是 Y” | **PASS** | C:5、22、64、68、74、113 的否定句分别处理会计定义、普遍最佳、多人表格、进度承诺和创建前边界；是操作性限制，不是装饰性对偶。 |
| 9 | 没有任何犹豫 | **PASS** | C:54、64、68、74、95、105 对无普遍最佳、未归类价格和平台/版本差异保留真实不确定；已核实数字则明确陈述。 |
| 10 | 虚假精确 | **PASS** | C:13–18、34、40、48–50 的四档、1g、Wheat 和 Crab Pots 均有来源或透明算术；没有时间、收益或性能的无源精确数字。 |
| 11 | 脆弱经历只为论点服务 | **N/A** | C 没有“我也曾失败”或个人成长故事。 |
| 12 | 复杂问题突然变万能步骤 | **PASS** | C:84–105 的路径明确限定新农场，并提供找不到选项时的停止分支；没有把旧档编辑冒充通用修复。 |
| 13 | 每段都收束成金句 | **PASS** | C:44、64、68、105、109–113 的收束分别完成分类、选择或检查；末尾是可执行检查，不是泛泛升华。 |
| 14 | 句子节奏过于均匀 | **PASS** | C 同时使用定义段、表格、例子、有序步骤和检查清单，平行结构均承担明确信息作用。 |
| 15 | 感受替代论证 | **PASS** | C:54、68、78、82 的“适合/候选”是明确条件下的编辑判断；机制、数字和类别回到 Wiki 来源。 |
| 16 | 开头只剩钩子、痛点、承诺 | **PASS** | C:1–7 在开头直接说明倍率、四档、边界和会计误读，不先写 CTA、历史或空泛承诺。 |
| 17 | 连接词固定且密集 | **PASS** | C:5–113 未出现无信息的“值得注意/事实上”堆叠；连接词都在组织条件或分支。 |
| 18 | 刻意同义替换 | **PASS** | C:5、18、26、30、34、40、86、92 对按钮名、商品名和机制名保持一致，没有用多个中文名造成对象漂移。 |
| 19 | 中文翻译腔或非母语表达 | **PASS** | C 使用简体中文解释，并保留必要的游戏原名；句子具体、无逐句英文模板和 AI 套话。 |
| 20 | 虚构故事或案例 | **PASS** | C:34、40、50 使用的是公开来源中的 Wheat/Crab Pots 机制例子；图位也明确是示意图，不冒充用户实测或平台截图。 |
| 21 | 通用祝福结尾 | **PASS** | C:107–113 以人数、目标、受影响/固定类别检查结束，没有“开启旅程”等无任务价值祝福。 |
| 22 | 强行追求深刻 | **PASS** | C:113 仍回到创建农场前的价格边界，不升到现实商业或宏大人生结论。 |

## V7 只读计数与剩余状态

V7 脚本命令：

```text
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

实际结果：`mechanical_units=2080`、`required_floor=2000`、`meets_mechanical_floor=true`、`semantic_qualification=requires_independent_review`、`sha256_raw=40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9`、exit 0。计数排除标题、Sources、URL、alt/caption 等 V7 规定项；它是当前候选的机械观察，不是替 D 做长度门，也不是 F 锁稿或最终语义质量证明。

## 最小修复建议与未完成事项

1. **C → 引用局部性：** 将 C:26 的 Multiplayer 链接移动到 C:5/C:7 的“非全局边界”主张附近，或在 C:7 增加同一公开链接；不能只依靠 C:117–120 Sources 清单。
2. **C → 事实措辞：** 将 C:54 的“固定费用和任务奖励不缩放”收窄为“来源明确列出的固定类别和任务奖励不缩放”，避免把 Multiplayer 的列举扩写成所有固定费用。
3. **D：** 本次不读取或采纳 D 的结论；C 若改动，必须由独立 D 针对新 hash 重新检查，再由 E 复验同一版本。
4. **F：** 后续锁稿阶段再生成最终 Title/Description 等表面，并把 checked label、引用绑定和 bodyHash 作为新输入交 E；本报告不锁题文。
5. **G/页面：** 绑定两张合法实际资产，核验尺寸/字节/AVIF/WebP/alt/caption/移动端可读性，再在真实文章路由做浏览器复核；当前不声称 F/G/页面通过。

## 实际验证命令与输出

以下命令均为只读；本报告是本任务唯一新建文件。

| 检查 | 实际输出摘要 | 退出码 |
|---|---|---:|
| `shasum -a 256`（A/B/C/project 与 V7 规则） | 输出了版本绑定表中的真实 hash；当前 C 为 `40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9` | 0 |
| ego-browser 读取四个 Wiki 页面 | 页面标题分别为 `选项 - Stardew Valley Wiki`、`Options - Stardew Valley Wiki`、`Multiplayer - Stardew Valley Wiki`、`Getting Started - Stardew Valley Wiki`；正文匹配利润率、扳手、边界、Wheat、Crab Pots | 0 |
| `curl -LfsS` 状态回读 | zh Options 200；Options 200；Multiplayer 200；Getting Started 200；站内 Year 1 内链 200 | 0 |
| `rg -n` 关键主张/残留/链接 | 关键四档、倍率、1g、Wheat、Crab Pots、多人、扳手和四个来源链接均命中；残留扫描无内部流程词，只有两个预期 `fig-*` 语义图位 | 0 |
| V7 `正文计数.py ... --locale zh-CN --exclude-heading Sources` | `mechanical_units=2080`、floor true、`semantic_qualification=requires_independent_review`、exit 0 | 0 |
| `wc -l -c C-zh-draft.md` | `120 10686` | 0 |
| `git diff --check` | 无输出 | 0 |
| `git status --short` | 目录在任务开始前已是 `?? docs/blog-ops/profit-margin-stardew/`；本任务不改动目录内既有正文或其他文件 | 0 |

**本次 E-zh 结论：** C-zh 的读者任务、主要事实、中文表达和 22 条鉴文可接受；在锁前应修复一处引用邻近性和一处边界措辞。媒体、锁后 SEOTruth、D/F/G、页面渲染和用户终审仍为 **UNVERIFIED**，不能把本报告解释为正文之外的交付通过。
