# E-zh 独立内容审核 v9：PASS（正文内容范围）

- **审核日期：** 2026-09-23（Asia/Shanghai）
- **审核工作树：** `/Users/wusir/orca/workspaces/stardew planner/博客`
- **审核对象：** `docs/blog-ops/profit-margin-stardew/C-zh-draft.md`
- **本次唯一写入：** `docs/blog-ops/profit-margin-stardew/E-zh-final-review-v9.md`
- **绑定 C SHA-256：** `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`
- **独立性：** D-zh v9 的 Task `task_871d768a1d19` / Dispatch `ctx_ada9f2363073` 在本审核开始前已由 Orca 回读为 `succeeded/completed/settled` 且终端已释放。D-zh v9、A-zh、B-zh、C-zh、接口规格、V7 规则和当前公开 Wiki 均重新读取；D 的结论只用于确认依赖已结算，不作为本报告的事实、自然度或规则证据。
- **禁止项遵守：** 未修改 C、A/B、D、接口规格、源码、媒体、配置、依赖或外部服务；未修复发现、未新增内链、未扩写赚钱路线、未加入旧存档/平台专属教程/Mod、未部署、未提交、未推送、未 spawn worker。

## 1. 最终结论

**PASS（绑定 SHA 的正文内容审核）。** 当前 C-zh 的主意图和 definition/explainer + 条件化选择体裁保持不变；V7 22 条鉴文、读者-facing 中文自然度、Profit Margin 事实边界、100% 与非 100% 多人存档路径、价格/公式、两个图位 alt/caption、公开来源、唯一站内内链和卫生检查均通过。

E v8 指定的唯一自然度返修已独立确认完成：C:101 的 `create multiplayer save` 已改为自然的“创建多人存档”，C:103 同样使用“创建多人存档”，并将 raw fragment `Multiplayer#Profit_margins` 改为读者可读的 `Multiplayer（Profit margins）`；受保护的 Sources URL `https://stardewvalleywiki.com/Multiplayer#Profit_margins` 仍保留。

本结论只代表当前 SHA 的**正文内容**，不代表 Title/Description 锁定、PublicBlogHandoff、实际 WebP/AVIF 媒体、页面装配、构建、typecheck、test、浏览器、live HTTP、生产/CDN、部署、收录或用户终审状态。

| 审核面 | 结果 | 独立证据 |
|---|---|---|
| C 版本绑定 | **PASS** | `shasum -a 256` 得到绑定 SHA，见第 9 节。 |
| 主意图/体裁 | **PASS** | 解释 Profit Margin 改变什么，并按单人/多人/挑战目标选择和设置新农场；未改成赚钱清单、计算器、Mod 教程或旧存档教程。 |
| ResearchTrace | **PASS** | 正文无检索日志、工作流词、私有路径、代理/调度信息或作者指令；公开 Sources 保留。 |
| ReaderValue | **PASS** | C:5–115 完成定义、四档、影响边界、条件化选择、新农场入口和安全分支；两张图位各服务一个具体读者判断。 |
| Repetition | **PASS** | 表格、主路径、找不到入口分支、创建前清单和结尾边界职责不同；未见为凑字数的同职责整段复制。 |
| V7 `zh-CN` 计数 | **PASS（机械门）** | `mechanical_units=2295`，`2000–2300` 内；脚本仍提示 `requires_independent_review`，不被误写成语义通过的唯一依据。 |
| SEOTruth（正文/H1范围） | **PASS** | C:1 与 B-zh 工作 H1 一致，正文兑现“是什么、四档、怎么选、在哪里设置”；最终页面 metadata 仍未核验。 |
| 事实/算术/边界 | **PASS** | 当前四个公开 Wiki 页面均 HTTP 200 且正文抽取检查 4/4；Wheat、Crab Pots、种子/Joja、固定类别和多人存档前提均相符。 |
| 两个图位文本 | **PASS（语义）** | `fig-01-price-boundary`、`fig-02-advanced-options-path` 各一次；alt/caption 含所需判断和平台中立限制。实际媒体资产未验证。 |
| 来源/内链/卫生 | **PASS（静态）** | 仅四个允许的 Stardew Valley Wiki URL；Sources 各一次；`/zh/how-to-earn-money-stardew` 一次；UTF-8/NFC/LF/内部泄漏扫描通过。 |

## 2. 输入版本绑定

| 输入 | SHA-256 |
|---|---|
| `C-zh-draft.md` | `0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699` |
| `A-zh-research.md` | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` |
| `B-zh-layout.md` | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` |
| `D-zh-final-check-v9.md` | `c04ce9b8963020d34924ec1ab1f2e7290419d9efafd33ac62069e986c563b31f` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |
| V7 `参考规则/22条鉴文规则.md` | `2bf97935b775b1a6f5db792590216ec2181c475ddddd48da54428976d9f573a1` |
| V7 `参考规则/事实核验与公开引用.md` | `56f2d6ea29ae9a0e9384355a9ee368f29676f1d5e45013f81a5bd250b218f2ad` |
| V7 `02-内容生产与质量门.md` | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` |
| V7 `03-博客页面生成整合.md` | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` |
| V7 `05-验收负例与测试.md` | `751b4591788345831c079930f9a6e98cd7189475e9488485a7ff4a168e407c7f` |
| V7 `脚本/正文计数.py` | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` |

> 上表中的 `05-验收负例与测试.md` hash 以本次实际 `shasum` 输出为准；若复制报告时发现路径或 hash 不一致，应停止并重新绑定输入。

## 3. 主意图、体裁与范围

- **原始关键词：** `profit margin stardew valley`。
- **主意图：** Informational；带条件化设置决策的概念解释（definition/explainer）。
- **ReaderTask：** 让简体中文读者理解 Profit Margin 改变哪些价格、哪些边界不随之变化，再按单人/多人/挑战目标选择四档，并在创建新农场时找到入口。
- **体裁判断：** C:3–115 是定义、机制边界、条件选择和高层设置路径；未变成现实会计利润率说明、作物收益计算器、泛赚钱路线、Mod 教程、旧存档教程或产品落地页。
- **信息增益：** C 同时给出受影响/不受影响矩阵、Wheat 与 Crab Pots 对照、多人存档前提、找不到入口时的待核验分支，以及创建前三项检查；这些都直接服务设置选择。
- **范围控制：** 唯一站内内链 C:72 只引导预算背景文章，不复制第一年赚钱行动路线；无第二内链、无额外 CTA。

## 4. 返修复验与中文自然度

### 4.1 C:101/C:103 唯一返修

| 位置 | 当前正文证据 | 结果 |
|---|---|---|
| C:101 alt | `100% 从 \`New Game\` 进入 \`Advanced Options\`；非 100% 先从标题画面的“合作”/\`Host New Farm\` 进入多人创建流程，在 \`Profit Margin\` 中选择档位并创建多人存档。` | **PASS**：普通动作使用自然中文；UI 名称才保留反引号。 |
| C:103 caption | `100% 为 \`New Game\` → \`Advanced Options\`；非 100% 为“合作”/\`Host New Farm\` → 多人角色创建 → \`Profit Margin\` → 创建多人存档。依据公开 Options、Multiplayer（Profit margins）与 Getting Started 页面整理，不是某个平台的实机截图，也不承诺所有平台按钮位置完全相同。` | **PASS**：无 raw fragment；来源名称自然可读；平台/实机限制保留。 |

独立静态扫描结果：`create multiplayer save` 在 C 全文 `0` 次；把 Markdown 链接替换为可见标签后，`Multiplayer#Profit_margins` 可见标签出现 `0` 次；Sources 中受保护的 `https://stardewvalleywiki.com/Multiplayer#Profit_margins` 出现 `1` 次。

### 4.2 V7 中文自然度规则

当前表达保持简体中文读者-facing语气，专业名词统一使用 `Profit Margin`、`利润率`、`New Game`、`Host New Farm`、`Advanced Options` 和 `Crab Pots`。C:54 的“对受影响出售收入变紧的接受度”、C:97/C:107 的平台中立限制略偏说明文体，但语义清楚、没有机械英语、残句或足以阻塞读者任务的翻译腔；本轮没有第二个可独立成立的自然度阻塞，不扩大“唯一返修”范围。

## 5. 事实、价格、公式和多人存档路径

### 5.1 当前公开 Wiki 回读

2026-09-23 只读回读四个当前公开页面，四个 URL 均 HTTP 200，正文语义检查 `4/4`：

- **中文 Options：** 当前正文仍列出“普通/75%/50%/25%”、利润率是物品售出价格的倍数、带小数时取整且不低于 1，并说明创建新游戏时从角色创建界面左下角扳手进入“高级游戏设置”。
- **英文 Options：** 当前正文写明 Profit Margin 是售出物品价格和种子价格的 multiplier，小数价格截断为整数且不低于 1g。
- **英文 Multiplayer 的 Profit margins：** 当前正文写明创建 `new multiplayer save` 时可选 25%、50%、75% 或默认 100%；降低利润率用于多人经济再平衡；列出作物/采集物/矿物/烹饪食物、多数出售物品、Pierre 种子及 Joja 的 `Grass Starter`、`Sugar`、`Wheat Flour`、`Rice`；Blacksmith、Fish Shop、Traveling Cart、建筑、工具升级和任务金币奖励不受影响；Wheat 在 25% 为 6g 而不是 25g，Willy 的 Crab Pots 仍为 1,500g。
- **Getting Started：** 当前正文写明角色创建菜单有扳手按钮，包含 Advanced Options，其中包括 changing the profit margin。

C 的 `Sources` 仍标注 `Checked 2026-09-22`；本次 2026-09-23 回读未发现来源内容与已写主张发生漂移，因此不需要对正文做日期或事实修订。HTTP 200 仅证明可达性；上述判断另有正文抽取语义检查，不把状态码单独当事实支持。

### 5.2 C 中的事实边界

- **四档与倍率：** C:5、C:13–C:20、C:22–C:24 给出普通/100%、75%、50%、25%，并区分价格倍率与现实会计“净利润比例”。
- **公式与截断：** C:20 使用 `0.75` 语义和“截断为整数且最低不低于 1g”；C:36 给出 Wheat `25g × 25% = 6.25g` 截断后显示 `6g` 的可读解释。
- **受影响范围：** C:28–C:38 保留“来源列举/多数/指定”限制，没有把 selected/most 外推为所有商店或所有购买价。
- **不受影响范围：** C:40–C:46 明确铁匠、鱼店、旅行货车商品、建筑、工具升级和任务金币奖励，并用 Willy 的 `Crab Pots` `1,500g` 作对照。
- **异常分支：** C:46 对未列出的价格要求先标记“待核验”，不以另一个商品猜测结论。
- **多人路径：** C:7、C:88–C:95、C:101、C:103、C:107、C:111、C:115 均保留“非 100% 先走合作/`Host New Farm` 多人创建流程、创建多人存档、房主随后单独游玩”的前提；100% 保留 `New Game` 分支。
- **平台边界：** C:97、C:103、C:107 明确这是公开 Wiki 的平台中立高层路径，不是逐平台实机截图，不猜测不同平台/版本的按钮位置或标签。

## 6. 图位、来源、内链和卫生

### 6.1 两个图位

- **Figure 1 / `fig-01-price-boundary`：** C:48–C:52 位于价格矩阵和解释后、选择章节前；alt 同时覆盖受影响出售/种子/指定 Joja 商品和不受影响商店商品/建筑/工具升级/任务奖励；caption 包含 Wheat `25g → 6g`、Crab Pots `1,500g`，并声明不是平台截图。
- **Figure 2 / `fig-02-advanced-options-path`：** C:99–C:103 位于高层路径后、创建前三项检查前；alt/caption 都覆盖 100% `New Game` 与非 100%“合作”/`Host New Farm` → 创建多人存档；caption 声明不是实机截图且不承诺平台按钮完全一致。
- **图文职责：** 两张图分别解释价格边界和设置路径，没有把表格、封面或占位符冒充正文视觉内容。实际 WebP/AVIF、尺寸、压缩、权利、绑定、渲染可读性和页面加载未验证，保持 **UNVERIFIED**。

### 6.2 公开来源

正文和 Sources 只使用以下四个允许的公开 URL，Sources 各出现一次：

1. `https://zh.stardewvalleywiki.com/选项`
2. `https://stardewvalleywiki.com/Options`
3. `https://stardewvalleywiki.com/Multiplayer#Profit_margins`
4. `https://stardewvalleywiki.com/Getting_Started`

当前 body 中的 Multiplayer 链接均以自然中文标签承载；raw fragment 只作为目标 URL 保留，未进入读者-facing来源名称。未发现论坛、Reddit、Steam、Mod、搜索结果、私有路径或未允许外部 URL。

### 6.3 站内内链

C:72 的 `/zh/how-to-earn-money-stardew` 只出现一次，锚文本为“第一年赚钱与预算指南”，上下文明确该链接补充预算行动，而本页只说明 Profit Margin 的价格前提。只读源码回读确认该 slug 同时存在于 `src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts` 的中文路径和 `src/blog/blog-post-registry.tsx` 的中文注册项；未把源码回读误写成 live HTTP 证明。

### 6.4 卫生

正文未发现 `旧存档`、`XML`、`Mod`、`Steam`、`Reddit`、`论坛`、`平台专属教程`、`赚钱路线`、`作物收益计算器`、`事实 ID`、`任务卡`、`SERP`、`PAA`、`agent`、`worker`、`dispatch`、私有绝对路径或本地服务地址。文件通过 UTF-8 strict、NFC、LF、无 BOM、无 CR、无 NUL、无尾随空白检查。

## 7. V7 22 条鉴文逐项结果

状态含义：**PASS** = 当前 C 未命中该坏写法；**N/A** = 当前体裁没有该类材料，不是降级跳过；**FAIL/REVISE** 本轮为 0 项。

| # | 规则 | 结果 | 当前 C 的独立判断与位置 |
|---:|---|---|---|
| 1 | 堵住所有反驳 | **PASS** | C:44–C:46 只保留会改变判断的价格异常分支，没有大量假想反驳。 |
| 2 | 知识全部输出 | **PASS** | C:3–115 的定义、边界、选择和路径均推进唯一 ReaderTask；没有把 A 的计算器、Mod、社区或赚钱路线素材搬入。 |
| 3 | 匀速排比 | **PASS** | 表格和编号步骤承担查询/操作职责；正文段落句式有因果、条件和例子变化，不是只换词的连续排比。 |
| 4 | 让步模板反复出现 | **PASS** | 未见连续套用“虽然……但是……”；取舍句分别说明档位、多人平衡和固定类别。 |
| 5 | 反复给概念命名 | **PASS** | `Profit Margin`/“利润率”及 UI 名称保持稳定，没有反复发明同义名称。 |
| 6 | 情绪曲线太光滑 | **N/A** | 这是事实解释和设置选择文，无亲历故事或人为情绪曲线可审。 |
| 7 | 虚构读者错误再反驳 | **PASS** | 没有无来源的“所有人都以为”；C:56、C:66、C:70、C:76 使用可核对的条件和限制。 |
| 8 | 高密度“不是 X 而是 Y” | **PASS** | C:5、C:20、C:24、C:28、C:46、C:56、C:66、C:70、C:76、C:88、C:97、C:103、C:115 的否定/边界句各自区分会计含义、价格范围、平台限制或未核验分支，没有同一模板机械重复。 |
| 9 | 没有任何犹豫 | **PASS** | 已核验价格和规则用确定语气；平台差异、未列价格和非实机路径明确保留条件和待核验边界。 |
| 10 | 虚假精确 | **PASS** | `25g`、`6g`、`1,500g`、`1g` 均有当前 Wiki 或透明截断算术支持；没有无来源的天数、收益、完成时间或性能数字。 |
| 11 | 脆弱经历只为论点服务 | **N/A** | 没有“我曾失败”“我们测试过”的个人经历或伪造案例。 |
| 12 | 复杂问题突然变万能步骤 | **PASS** | C:88–C:97 分开 100%/非 100% 分支，并保留多人存档、平台/版本限制和找不到入口时的停止动作。 |
| 13 | 每段都收束成金句 | **PASS** | C:109–C:115 落到三项检查和价格边界，没有泛泛升华或换词复述模块。 |
| 14 | 句子节奏过于均匀 | **PASS** | 机制定义、表格解释、示例、条件建议和步骤采用不同信息节奏；必要的平行表格/步骤不构成机器味。 |
| 15 | 感受替代论证 | **PASS** | 没有“凭直觉”“一看就知道”等替代证据的感受判断；档位建议都写成条件化编辑判断。 |
| 16 | 开头只剩钩子、痛点、承诺 | **PASS** | C:5 在 H2 后直接定义设置、四档作用和非全局边界；不是营销钩子。 |
| 17 | 连接词固定且密集 | **PASS** | 未见“值得注意”“事实上”等无功能连接词成群出现；转折均承载范围或条件。 |
| 18 | 刻意同义替换 | **PASS** | 机制、商品、UI 和多人路径术语稳定；C:101/C:103 已删除不必要的机械英语动作。 |
| 19 | 中文翻译腔或非母语表达 | **PASS** | 唯一指定自然度返修已在 C:101/C:103 解决；当前 alt/caption 为自然中文，未见残句或把普通动作伪装成 UI 标签。 |
| 20 | 虚构故事或案例 | **PASS** | Wheat、Crab Pots 是当前 Wiki 支持的教学例子；两张图明确是示意图，不冒充实机截图或作者测试。 |
| 21 | 通用祝福结尾 | **PASS** | C:109–C:115 以创建前检查和固定/变化边界结束，无祝福、口号或第二 CTA。 |
| 22 | 强行追求深刻 | **PASS** | 结尾仍停留在游戏经济边界和设置前提，没有升格为现实商业或宏大命题。 |

**22 条计数：** `PASS=20`、`N/A=2`、`FAIL/REVISE=0`。

### 六类形式指纹

- **破折号：PASS。** 正文无密集无功能破折号；Sources 中的 `Multiplayer — Profit margins` 是公开页面标题。
- **粗体：PASS。** 仅用于 Figure 2 路径分支和必要强调，不构成营销承诺。
- **无用装饰符号：PASS。** 表格、编号、图位 blockquote 和 UI 反引号均承担信息职责；无 emoji 或装饰性分隔。
- **助手/流程残留：PASS。** 正文无 SERP/PAA、agent/worker/dispatch、任务卡、事实 ID、私有路径、hash 或研究日志。
- **填充短语：PASS。** 未见“随着……”“值得注意的是”“在当今……”等无信息开场或凑字连接。
- **泛泛积极结尾：PASS。** 无“开启旅程”“你值得更好”等通用祝福，末尾为可执行检查与明确边界。

## 8. 未验证项与范围外问题

以下项目不影响本次正文 PASS，但不能从本报告推断为通过：

- F 锁稿、最终 Title/Description、SEO metadata、canonical、hreflang、Article JSON-LD、PublicBlogHandoff 和 bodyHash 交接。
- 目标 cover、Figure 1/2 的实际 WebP/AVIF 文件、尺寸、大小、合法使用、同名格式、移动端可读性、页面绑定和 `PublicPicture` 渲染。
- Next.js 页面装配、registry/copy/route/sitemap/llms 修改、typecheck、Vitest、build、静态输出、ego-browser 桌面/手机检查。
- live 站点 URL、生产/CDN、部署、收录、排名、搜索展示、转化和用户终审。
- C 当前工作树为 untracked 内容包；本任务不提交或改变 Git 状态。

## 9. 真实验证命令、退出码与结果

### 9.1 版本绑定与计数

```sh
shasum -a 256 \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  docs/blog-ops/profit-margin-stardew/A-zh-research.md \
  docs/blog-ops/profit-margin-stardew/B-zh-layout.md \
  docs/blog-ops/profit-margin-stardew/D-zh-final-check-v9.md \
  docs/blog-ops/profit-margin-stardew/project-interface-spec.md \
  /Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md \
  /Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md \
  /Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md \
  /Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md \
  /Users/wusir/Desktop/博客-V7修订版/05-验收负例与测试.md \
  /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py
```

- **exit 0**。
- C 实际输出：`0db262f9a08f9a2f1875581dae3a21fdc52ab55fd2141ef98670546abf59a699`。
- V7 规则、事实核验规则、内容门、页面整合门、验收负例和计数脚本 hash 已记录在第 2 节。

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py \
  docs/blog-ops/profit-margin-stardew/C-zh-draft.md \
  --locale zh-CN --exclude-heading Sources
```

- **exit 0**。
- 真实关键输出：`mechanical_units=2295`、`required_floor=2000`、`meets_mechanical_floor=true`、`semantic_qualification=requires_independent_review`。
- 计数输出的 `sha256_raw` 与 `sha256_nfc_lf` 均为绑定 C SHA。

### 9.2 当前公开来源可达性

```sh
for url in \
  'https://zh.stardewvalleywiki.com/选项' \
  'https://stardewvalleywiki.com/Options' \
  'https://stardewvalleywiki.com/Multiplayer#Profit_margins' \
  'https://stardewvalleywiki.com/Getting_Started'; do
  curl -L --fail --silent --show-error -o /dev/null \
    -w '%{http_code} %{url_effective} %{url}\n' "$url"
done
```

- **exit 0**。
- 真实输出的四行均为 `200`，effective URL 未偏离目标：中文 Options、英文 Options、Multiplayer#Profit_margins、Getting Started。

### 9.3 当前公开来源正文语义检查

使用只读 `requests` + BeautifulSoup 回读四个页面，删除 script/style/noscript/svg 后对事实短语做存在性检查：

```text
PASS  zh Options                 status=200  missing=[]
PASS  Options                    status=200  missing=[]
PASS  Multiplayer#Profit_margins status=200  missing=[]
PASS  Getting Started            status=200  missing=[]
wiki_semantic_checks=4/4
```

- **exit 0**。
- 该检查回读了四档、售出/种子价格倍数、截断/1g、多人存档前提、受影响/不受影响类别、Wheat、Crab Pots、扳手和 Advanced Options；不是只看搜索摘要。

### 9.4 静态关键词与结构审计

使用只读 inline Python 审计当前 C：SHA、H1/H2/H3、figure ID、C:101/C:103 自然度返修、可见标签 raw fragment、受保护 Sources URL、价格/公式/边界、多存档路径、alt/caption、四 URL 白名单、单一内链、禁止范围词和 UTF-8/NFC/LF 卫生。

- 第一次审计探针误把 B-zh 文件标题当成工作 H1，**exit 1**，真实异常为测试 harness 的 `IndexError`，不是 C 内容异常。
- 修正探针改读 B-zh `工作 H1` 表格字段后重跑，**exit 0**：`checks_total=53 passed=53 failed=0`。
- 重跑真实输出包含：`unique v8 phrase removed count=0`、`raw fragment removed from reader-facing labels visible_count=0`、`protected Multiplayer URL retained sources_count=1`、`single allowed internal link count=1`、`UTF-8 strict PASS`、`NFC normalized PASS`、`LF only / no BOM / no NUL / no trailing whitespace PASS`。

### 9.5 站内内链真实性回读

```sh
rg -n -C 2 'how-to-earn-money-stardew' \
  src/blog/blog-post-identities.ts \
  src/blog/blog-copy.ts \
  src/blog/blog-post-registry.tsx
```

- **exit 0**。
- 实际回读到中文 identity、中文 localized copy `/zh/how-to-earn-money-stardew` 和中文 registry 条目；这只证明当前源码静态注册存在，不代替 live HTTP 或页面验收。

## 10. 报告边界

本报告是 E-zh 对当前 C SHA 的一次独立正文审阅和复验记录。若 C 后续再次变化，必须重新绑定新 SHA，并重新跑计数、来源回读、静态审计和 22 条规则；本报告不可沿用到新版本或页面。
