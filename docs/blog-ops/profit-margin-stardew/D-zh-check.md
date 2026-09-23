# D-zh 独立写后检查：profit-margin-stardew（zh-CN）

检查日期：**2026-09-22，Asia/Shanghai**；命令时钟回执：`2026-09-22 23:00:28 CST +0800`。

本报告是独立 D 写后检查，只读审阅 `C-zh-draft.md`，没有修改中文正文。唯一新增文件是本报告；本报告不签发 E 独立审核、F 锁稿、G 页面装配或页面通过。

**总评：REVISE。** ResearchTrace、文本 ReaderValue 和静态卫生通过；Repetition 仍有同职责复述，公开 Sources 缺少 B-zh 要求的 checked/date 标签，长度的机械门通过但语义资格必须在正文修订后重算。两个语义图位职责清楚，但实际图片、绑定、尺寸/格式、浏览器渲染和页面均为 UNVERIFIED。

## 版本绑定

以下 SHA-256 来自本次实际 `shasum -a 256`，不是 C 内部旧记录。`C`、`A`、`B` 与 V7 规则在本次检查期间保持可读；正文任一改动都会使本报告失效，须绑定新 hash 后由 D 重做三门。

| 输入 | SHA-256 | 路径 |
|---|---|---|
| 当前 C-zh | `40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9` | `docs/blog-ops/profit-margin-stardew/C-zh-draft.md` |
| A-zh | `4cf84cea949a9f7f3bd07b25f9ef7962a52e8252dbc2f046d8d956f7d80963ee` | `docs/blog-ops/profit-margin-stardew/A-zh-research.md` |
| B-zh | `77be7c7008d48428aebdecc2ad8fb6b5be6da746b86fc7a7e2bd92a1b9623775` | `docs/blog-ops/profit-margin-stardew/B-zh-layout.md` |
| V7 执行入口 | `7c4ffb4fcf388f5dcc4da46a5bf593182976ed34b78fde02823b333d45041814` | `/Users/wusir/Desktop/博客-V7修订版/执行入口.md` |
| V7 01 | `4617c08d2f5b25e4cbac747415703e5494d8b489657079bad2e72eb3fe7e8eec` | `/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md` |
| V7 02 | `7b209ad339cf536b6547d8c8ade879d391cafdf65fe70b0029037722ced0a25f` | `/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md` |
| V7 03 | `ea50e7fab89d4b1606ed673a0399cd1012533cb35ca164586b4add4191393400` | `/Users/wusir/Desktop/博客-V7修订版/03-博客页面生成整合.md` |
| V7 05 | `751b4591788345831c079930f9a6e98cd7189475e9488485a7ff4a168e407c7f` | `/Users/wusir/Desktop/博客-V7修订版/05-验收负例与测试.md` |
| 公开引用规则 | `56f2d6ea29ae9a0e9384355a9ee368f29676f1d5e45013f81a5bd250b218f2ad` | `/Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md` |
| V7 正文计数脚本 | `c0c096800fd9b4f9feb126454a536d776ced12f6eb4b17175503ff6e62e324e8` | `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py` |
| Project interface spec | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` | `docs/blog-ops/profit-margin-stardew/project-interface-spec.md` |

读者正文边界为 C:1–114；公开 `Sources` 为 C:115–120。C 没有英文稿式的内部角色头、编辑附录或旧计数日志；C:46–50 和 C:97–101 的 figure ID 与 B-zh 定义的两个语义图位一致，不是内部事实 ID。

## 质量门结论

| 门 | 结论 | 当前证据 |
|---|---|---|
| ResearchTrace | PASS | C:1–120 无 SERP/PAA/排名、调度、私有路径、凭据或作者流程残留；公开来源与读者所需限制保留。 |
| ReaderValue（文本） | PASS | C:5–113 覆盖定义、四档/取整、受影响与不受影响边界、Wheat/Crab Pots、单人/多人/挑战选择、新农场路径与安全失败分支，仍是一个设置选择任务。 |
| Repetition | REVISE | C:26/C:44 的价格归类流程和 C:56–82 的矩阵/75%/25%回答存在局部同职责复述；见下文。 |
| Length：机械门 | PASS | V7 zh-CN 直接计数为 2,080，`required_floor=2000`、`meets_mechanical_floor=true`，计数命令退出码 0。 |
| Length：语义资格 | UNVERIFIED | 计数 JSON 明确输出 `semantic_qualification=requires_independent_review`；Repetition 修订后必须重算，不能把机械值当语义通过。 |
| Citation placement / public Sources | REVISE | 相关链接位置和 Sources 顺序正确，但 C:115–120 缺少 B:326 指定的 `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.` 标签。 |
| Media binding / rendering | UNVERIFIED | 只有语义图位，没有实际 public 资产、WebP/AVIF 对、尺寸/字节/权利或页面可见性证据。 |
| Static hygiene | PASS | `git diff --check` 退出 0；直接检查 untracked C 无尾随空白、无内部残留和凭据命中。 |

整体不是 E/F/G/页面通过。当前可交 C 修订、A/B 补核和后续 E/F/G 的问题清单。

## 1. ResearchTrace

### 已通过的正文边界

- C:1 是正常公开 H1；C:3–113 是正常文章结构；C:115–120 只有读者可见的 `Sources` 与公开链接。
- 没有把 A-zh 的 Google 查询、PAA、CN 地区限制、竞品样本、研究元数据、任务卡、调度/代理回执、私有路径、事实 ID、V7 计数或编辑日志写进正文。
- C:95 的“不是逐平台截图实测”与 C:105 的“缺少平台或版本证据时停在文档化路径”是读者需要的适用范围和安全分支，不是研究日志。
- C:70 的第一年赚钱内链只说明预算背景；正文没有复制第一年现金路线、作物计算器、Mod 或旧存档编辑步骤，符合 B:98–107 的排除边界。

### 实际扫描

下面两个 `rg` 均覆盖完整 C:1–120；退出码 1 是“无匹配”的真实结果，不是把未执行写成通过：

```sh
rg -n -i 'SERP|PAA|排名|竞品|搜索量|CTR|Google Search|pws=|gl=|hl=|相关问题|用户还搜索|研究日志|研究说|研究元数据|Agent[ -]?[A-G]|\b(role|worker|coordinator|dispatch|handoff|assembly|bodyHash|mechanical_units|PublicReference|editor appendix|task card|internal)\b|A-zh|B-zh|C-zh|D-zh|project-interface|任务卡|调度|代理回执|私有路径' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 1；无输出

rg -n -i '/Users/|/home/|[A-Z]:\\|file://|localhost|127\.0\.0\.1|\.codex|\.hermes|docs/blog-ops|node_modules|[?&](token|key|secret|signature)=|api[_-]?key|access[_-]?token|Bearer[[:space:]]|BEGIN[[:space:]].*PRIVATE KEY|sk-[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{20,}' docs/blog-ops/profit-margin-stardew/C-zh-draft.md
# exit 1；无输出
```

这些精确扫描只证明指定标记没有命中；语义结论仍以逐段阅读为准。未把合法的公开来源、版本/平台限制或“待核验”安全分支误删。

## 2. ReaderValue

**文本结论：PASS。** B:44–82 将 ReaderTask 定义为：理解新农场 Profit Margin 改变哪些价格、区分固定边界、按单人/多人/挑战条件选择四档，并在创建新农场时找到入口。C 的证据如下：

| 读者结果 | C 中的精确位置 | 独立观察 |
|---|---|---|
| 先理解游戏设置，而不是现实会计利润率 | C:5–7、C:18、C:22 | 直接说明是价格倍率，不把 75% 写成净利润比例。 |
| 读懂普通/100%、75%、50%、25% 和取整/1g 下限 | C:11–22 | 表格承担查表职责，C:18 提供公开规则，C:20–22 只回答 75% 的实际疑问。 |
| 处理受影响与不受影响价格 | C:24–44 | C:28–30 矩阵、C:34 的 Wheat 取整例子、C:40 的 Crab Pots 固定例子、C:44 的价格异常安全分支形成可操作边界。 |
| 条件化选择，而非给所有人一个最佳值 | C:52–82 | C:56–60 矩阵按单人/多人/挑战给候选；C:64、C:68、C:74、C:78、C:82 说明理由、限制和“不保证进度”。其中的重复需要按下一节收紧。 |
| 在新农场找到设置并安全处理不一致 | C:84–113 | C:86、C:90–93 给高层路径和四步动作，C:95/105 保留平台/版本限制与找不到选项时的停止分支，C:109–113 是创建前复核。 |
| 仍只有一个 ReaderTask | C:5–113 | 没有泛赚钱路线、作物/ROI 计算、Mod、旧存档教程、规划器教程或第二个独立 FAQ。 |

### 两张图的语义职责

- Figure 1：C:46–50，放在价格矩阵、Wheat/Crab Pots 解释之后；只负责把“会按档位缩放的选定价格”与“来源明确列出的固定类别”视觉分开，并标出两个边界例子。它不等同于 C:28–44 的文字查表/异常处理。
- Figure 2：C:97–101，放在新农场有序路径之后、创建前清单之前；只负责展示“新建游戏 → 扳手/高级设置 → Profit Margin → 四档 → 创建”的路径关系，并重复平台中立限制以解释图示。它不等同于 C:90–95 的文字动作步骤。

因此 ReaderValue 的文本/语义图位通过；实际图片是否准确、可读、合法和已嵌入页面不在本门的通过范围内，另列 UNVERIFIED。

## 3. Repetition

**结论：REVISE。** 表格、正文例子、图位和图注并非只因共享事实就判重复；本次标出的是真正接近同一读者操作的段落。

### R-1：价格归类与未归类处理的局部重复

| 位置 | 当前职责/重复内容 | 最小修订建议 |
|---|---|---|
| C:26 | 先按列归类，再看档位；跟随 Multiplayer 范围，不把它扩写成所有商店。 | 保留，作为矩阵前的阅读规则和公开来源绑定。 |
| C:44 | 再次要求先把价格标成出售物品/种子/指定 Joja/固定类别，再对照边界；无法归类时待核验。 | 保留“无法归类时待核验”的失败动作，删掉重复的完整分类清单，可收成“若对照后仍无法归类，标记为待核验，不用相邻商品替它下结论”。 |

C:34、C:36、C:40 各自提供 Wheat、种子/Joja、Crab Pots 的具体证据，职责不同，不建议删除来解决 R-1。

### R-2：矩阵与 75%/25% 条件回答的相邻复述

- C:56–60 是唯一应保留的三行查表矩阵。
- C:59 与 C:68 都给多人 75%/50% 候选；C:68 还承担 Multiplayer 的再平衡来源、人数/节奏条件和不保证进度，故保留 C:68 的机制与条件，但应删去已由 C:59 完整表达的“普通与 75%/50%候选”重复措辞。
- C:68 与 C:78 都解释“保留普通框架、接受更紧出售/种子价格、是否适合取决于人数/节奏”。C:78 是 B 要求的 `Is 75 a good profit margin?` 直接回答，可以保留，但最小修订应只保留条件式结论，不再重述价格机制，例如收成“75% 只能作为中间候选；是否适合取决于人数、生产安排和预算压力，不是所有多人存档的固定答案”。
- C:60、C:74 与 C:82 都把 25% 归为挑战/更紧经济，并提到固定类别不下降。C:74 还承担“不保证慢几倍、金币或完成年份”的安全限制；C:82 是 B 要求的 `Is 25% margin good?` 直接回答。建议 C:74 保留挑战限制和固定类别例子，C:82 删除再次解释固定类别，只保留“明确追求挑战且愿意承担更紧预算时才有理由选择”的条件结论。

这些不是把矩阵和 H3 一律视为重复：矩阵承担查表，75%/25% H3 承担实际疑问回答；问题是当前 H3 同时复述了矩阵和价格边界。按上面最小收紧，不要用新 PAA 或泛赚钱内容补回字数。

### 已确认职责不同、不判重复

- C:28–30 是两列参数查表，C:34/C:40 是两个边界例子，C:44 是价格异常分支；这三层可以共存。
- C:86 是带来源的高层路径，C:90–93 是可执行步骤，C:95 是平台/版本限制，C:105 是找不到选项的安全动作；不是同一个失败分支的三次复制。
- C:46–50 与 C:97–101 分别服务价格边界和设置路径；它们与正文邻近解释是图文职责分工，不是第二个 FAQ。

## 4. Length：V7 zh-CN 计数和边界

V7 02:107–114 规定 zh-CN 只计汉字，计数节点为正文段落、列表和数据表格单元格；H1/H2/H3、Sources、CTA、URL、alt、caption、代码块不计。脚本本身只给机械值，不能判断重复、空话或研究痕迹。

### 实际直接计数

命令（退出码 **0**）：

```sh
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-zh-draft.md --locale zh-CN --exclude-heading Sources
```

真实关键输出：

```json
{
  "mechanical_units": 2080,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "semantic_qualification": "requires_independent_review",
  "omitted_line_counts": {"headings": 19, "code": 0, "excluded_sections": 5, "non_body": 58, "frontmatter": 0},
  "sha256_raw": "40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9",
  "sha256_nfc_lf": "40d83cf81c7b4bdae8d3d188f3eee6963413f5dc5a94499bbf69f9e454d895d9"
}
```

### 边界复核

同一计数模块的只读边界复核命令退出码 **0**，得到：

| 边界 | 单位 | 处理 |
|---|---:|---|
| C:1–114（Sources 前） | 2,080 | 机械正文值；标题、空行、表分隔线、引用 URL 和 blockquote 按脚本规则省略。 |
| C:115–120 Sources 若错误纳入 | 69 | 正式命令以 `--exclude-heading Sources` 排除；不应计入正文。 |
| C:48、50、99、101 alt/caption | 0 | 四行均以 `> ` 开头；V7 `extract_body` 将 blockquote 作为 non-body 排除。 |
| C:90–93、C:109–111 列表/表格单元格 | 计入 | 属于 V7 允许的正文动作和数据节点。 |

`inline_text` 的 URL 清理也已用计数脚本版本复核：链接的中文可见标签可计，地址本身不计；本稿英文游戏术语和数字不计为 zh-CN 汉字。机械 2,080 高于 2,000 的事实只能判定机械门 PASS；由于 R-1/R-2 还需要正文修订，当前版本不能声称语义资格或 F 锁稿通过。C 修订后必须重新执行同一命令并绑定新 hash。

## 5. Citation / media

### 公开引用位置

当前正文中的公开链接位置和职责如下：

| 来源 | 正文位置 | 支撑范围 |
|---|---|---|
| 中文 Options | C:5、C:86；Sources C:117 | 中文术语、四档/新农场高级设置入口。 |
| 英文 Options | C:18；Sources C:118 | 价格/种子倍数、整数截断与 1g 下限。 |
| 英文 Multiplayer | C:26、C:68；Sources C:119 | 受影响/不受影响类别、Wheat/Crab Pots 例子和多人再平衡。 |
| Getting Started | C:86；Sources C:120 | 新游戏角色创建界面的高级选项路径补充。 |

`rg` 的来源/图位定位命令退出码 **0**，实际命中包含 C:5、18、26、46、68、86、97、101、115、117–120。Sources 顺序与 B:326 的中文 Options、英文 Options、Multiplayer、实际使用的 Getting Started 要求一致。四个公开 URL 的 reachability 命令均退出 **0**：

```text
zh-options HTTP 200; final=https://zh.stardewvalleywiki.com/选项; redirects=0
options HTTP 200; final=https://stardewvalleywiki.com/Options; redirects=0
multiplayer HTTP 200; final=https://stardewvalleywiki.com/Multiplayer#Profit_margins; redirects=0
getting-started HTTP 200; final=https://stardewvalleywiki.com/Getting_Started; redirects=0
```

HTTP 200 只证明当前 URL 可达，不代替 E 的逐主张事实支持审查。B:326 给出的公开检查标签当前缺失：C:115–120 没有 `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.`。最小正文修订是把该标签作为公开 Sources 说明补入，不恢复任何 A-zh 研究日志、私有路径或事实 ID。

### 语义图位与实际媒体

- `fig-01-price-boundary`：C:46–50；价格边界图，职责是视觉分开选定缩放类别与明确固定类别，并标注 Wheat/Crab Pots。
- `fig-02-advanced-options-path`：C:97–101；新农场设置路径图，职责是视觉串联新游戏、扳手/高级选项、Profit Margin 四档和创建农场。
- 两个语义 ID 不承担相同任务，图注也没有伪装为实机截图。`rg --files public | rg 'fig-01-price-boundary|fig-02-advanced-options-path'` 退出 **1**，`rg -n 'fig-01-price-boundary|fig-02-advanced-options-path' public src app` 退出 **1**；当前没有与语义 ID 对应的 public/src/app 绑定证据。
- Project interface spec 的媒体契约（265–301）要求实际 `.webp`、同名 `.avif`、有意义 alt、1672×941、图 WebP ≤400 KiB、`PublicPicture`、`decoding="async"`、`loading="lazy"`。本 D 没有生成或修改图片，没有尺寸/格式/字节/权利记录，没有页面渲染或移动端可读性检查，因此该项 **UNVERIFIED**。

## 6. 静态卫生与命令账本

所有命令均在 `/Users/wusir/orca/workspaces/stardew planner/博客` 执行。`rg` 的退出码 1 仅在下表注明为预期无匹配；它不代表命令未执行。

| 检查 | 退出码 | 真实结果 |
|---|---:|---|
| `shasum -a 256`：C/A/B、V7 执行入口/01/02/03/05、公开引用规则、计数脚本、project spec | 0 | 版本绑定表已记录 11 个完整 hash。 |
| V7 zh-CN 直接计数 | 0 | `mechanical_units=2080`，机械门 true；semantic qualification 仍 requires independent review。 |
| V7 模块边界复核（无临时文件） | 0 | C:1–114=2080；Sources 若计入=69；alt/caption blockquote 不计。 |
| `git diff --check` | 0 | 无输出。 |
| `git diff --no-index --check /dev/null docs/blog-ops/profit-margin-stardew/C-zh-draft.md` | 1（预期） | 无输出；untracked 新文件 diff 的 no-index 状态，不是尾随空白诊断。 |
| `rg -n '[[:blank:]]+$' docs/blog-ops/profit-margin-stardew/C-zh-draft.md` | 1（预期） | 无尾随空白命中。 |
| 内部残留 `rg` | 1（预期） | 无 SERP/PAA/流程/路径/ID 等命中。 |
| 私有路径/凭据 `rg` | 1（预期） | 无命中。 |
| Sources/来源/图位定位 `rg` | 0 | C:5、18、26、46、68、86、97、101、115、117–120 等位置真实命中。 |
| 四个公开 URL `curl -fsS -L --max-time 20` | 0（各 URL） | 四个 HTTP 200、最终 URL 与上节一致、redirects=0。 |
| 语义图 ID 的 `rg --files public` / `rg public src app` | 1（各命令，预期） | 未发现当前绑定文件或代码引用。 |
| 初始 `git status --short --untracked-files=all` | 0 | 现有未跟踪输入/英文报告存在；D-zh 报告尚未存在。 |

untracked 输入属于共享工作区既有状态，D 没有删除、覆盖或归属它们。没有运行本地服务、build、TypeScript、页面浏览器或部署命令。

## 最小返修清单

1. **交回 C：** 合并 C:26/C:44 的价格归类前置语句，只保留一次完整阅读规则和一次无法归类的待核验动作。
2. **交回 C：** 保留 C:56–60 矩阵；压缩 C:68/C:78 的 75%重复，并让 C:74/C:82 的 25%段落各自只承担“挑战安全限制”和“直接条件回答”之一，不恢复同一固定边界。
3. **交回 C/公开引用：** 在 Sources 下补 B:326 的 checked/date 公开标签；不得带入 A-zh 的检索记录、路径、事实 ID 或旧计数。
4. **重送 D：** C 任一改动后重新计算 zh-CN，重新做 ResearchTrace、ReaderValue、Repetition，并用新 C SHA-256 绑定报告；当前 2,080 不得沿用为新版本证据。
5. **交后续媒体/G/E：** 绑定真实两张图并核验合法依据、WebP/AVIF、1672×941、≤400 KiB、alt、加载和桌面/移动渲染；当前 D 不把语义图位当成成品媒体。

## 明确未声明的下游状态

本报告没有执行或通过 E 独立 22 条鉴文/事实复核、F 淬文/锁稿/Title/Description、G 页面装配、Next build、真实路由、ego-browser/其他浏览器桌面手机验收、部署、收录、排名或用户终审。V7 明确区分计数、内容独立审核和页面审核；本报告不把任何一项机器检查写成 E/F/G/页面通过。

## 本次写入范围复核

D 没有修改 `C-zh-draft.md`、`A-zh-research.md`、`B-zh-layout.md`、任何英文文件、`src`、`app`、`public`、`package.json` 或其他既有文件；只新增本 `D-zh-check.md`。写入后须再次执行 `shasum -a 256`、V7 zh-CN 计数、`git diff --check`、正文扫描和 `git status --short --untracked-files=all`，并以实际回读结果结算。
