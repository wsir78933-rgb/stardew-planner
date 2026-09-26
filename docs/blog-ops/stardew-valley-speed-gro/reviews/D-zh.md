# D-zh 独立写后检查：`stardew valley speed gro`

## 0. 身份、范围与结论

- **角色**：D-zh；独立写后检查，不兼任 E-zh，不执行八层鉴文、SEOTruth 或事实终审。
- **模式**：`content-only`；只检查 `drafts/body-zh.md` 的 ResearchTrace、ReaderValue、Repetition，并核对正文实际引用的中文图解。
- **只读输入**：`research/zh.md`、`research/facts.md`、`layout/zh.md`、`drafts/body-zh.md`、`assets/zh/`。
- **允许写入**：本文件；未改正文、媒体或其他目录。
- **当前 D 结论**：**FAIL**。ResearchTrace 通过；主意图与实际搜索证据相符，但 ReaderValue 因 V2 图解没有实际呈现各 modifier 的阶段变化且正文英文 `modifier` 过密而未通过；Repetition 因草莓案例的日期、首次成长/再生长边界在相邻段落、表格、图注和解释中重复承担同一作用而未通过。应由 C-zh 局部修订后，由 D-zh 对新版本三门全量复验；本报告不修复正文或媒体。

## 1. 版本与可复核证据

### 1.1 当前哈希

| 对象 | SHA-256 |
| --- | --- |
| `drafts/body-zh.md` 原始字节 | `4069e1cb2269fa475eb15a86c94ad7ae7ed24efd175277742063d0d12b8934fa` |
| `drafts/body-zh.md` NFC/LF | `4069e1cb2269fa475eb15a86c94ad7ae7ed24efd175277742063d0d12b8934fa` |
| `assets/zh/speed-gro-application-flow.svg` | `0ace2a61a8a3b236fca0c3d70b627fbaf34de0e55d11e5d6787c65a740b7fd4a` |
| `assets/zh/speed-gro-stage-comparison.svg` | `d44d70434e9899ce4fb790abb035ec70cbc0b37321ad66b5711bb67042797f96` |
| `assets/zh/strawberry-harvest-timeline.svg` | `10510fbec31f6d6abdc8cf88dce0d772345d3a2b28f060067b0d8648d2c03ceb` |

正文与三张媒体均在本次检查前读取；后续若任一字节改变，以上结论和定位不再绑定新版本。

### 1.2 实际搜索对主意图的核对

浏览器为本地 ego-browser；同一 TaskSpace、同一 Page `p1`，2026-09-26（Asia/Shanghai），Bing 请求带 `setlang=zh-CN&cc=CN`。参数只记录请求条件，不证明物理位置，也不冒充中国大陆 Google SERP。

| 实际查询 | 实际结果信号 | 对主意图的判断 |
| --- | --- | --- |
| [`stardew valley speed gro`](https://www.bing.com/search?q=stardew%20valley%20speed%20gro&setlang=zh-CN&cc=CN) | 可见结果包括 `Speed-Gro`、`Deluxe Speed-Gro`、Speed-Gro 条目、ROI 指南和配方指南；原始词同时承载定义、档位、获取/制作和收益讨论。 | 这是混合入口，不能据此声称唯一需求是购买或收益；选一个操作/规则子意图必须明确范围。 |
| [`星露谷物语 生长激素 怎么用`](https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0%20%E6%80%8E%E4%B9%88%E7%94%A8&setlang=zh-CN&cc=CN) | 前列出现“生长激素”中文条目，摘要直接写“任何时候添加到犁过的土壤中，包括播种前、播种后、或是作物的任何生长阶段”；另有中文视频标题“手把手教你使用生长激素”。 | 直接支持“如何施用/什么时候施用”的教程型子意图。 |
| [`星露谷物语 生长激素 草莓 三熟`](https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0%20%E8%8D%89%E8%8E%93%20%E4%B8%89%E7%86%9F&setlang=zh-CN&cc=CN) | 前列出现“第一年春天用生长激素草莓能三熟吗”和中文草莓条目；摘要给出春 13 日及带条件的三次收获问题。 | 支持用一个带前提的日期案例解释首次收获与再生长，不支持无条件“三熟”承诺。 |
| [`星露谷物语 生长激素 哪里买`](https://www.bing.com/search?q=%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%20%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0%20%E5%93%AA%E9%87%8C%E4%B9%B0&setlang=zh-CN&cc=CN) | 前列出现生长激素、高级生长激素、购买位置等页面。 | 获取是另一条可见需求；当前正文没有偷偷扩写购买、配方或 ROI，范围选择是诚实的。 |

**主意图判定：PASS。** 原始关键词的实际结果是混合的，但中文 `怎么用` 与草莓日期结果都明确支持“弄清 Speed-Gro/生长激素并正确施用、判断首次收获”的操作/规则指南。正文没有把购买、收益或站点规划器功能当成读者任务；它应保留这个单一范围，而不是扩展成获取百科。

## 2. ResearchTrace：PASS

### 2.1 原文定位与判断

| 原文位置 | 精确引句 | 判断依据 |
| --- | --- | --- |
| 第 1 段（第 1 行） | “在中文资料里，`Speed-Gro` 对应的是‘生长激素’。” | 这是读者需要的术语桥接，不是内部检索日志或给作者的范围指令。 |
| 第 2 段（第 3 行） | “下文按目前可核对的 1.6.15 PC 版本线与 1.6.15.1 主机版本线整理；如果你的游戏显示其他版本，应以游戏内版本为准。” | 版本条件直接影响读者理解，且后接两个公开公告链接；属于必要的适用范围说明。 |
| 第 9 段（第 43 行） | “公开的 1.6 decompiled snapshot 可以作为实现交叉证据……不是开发者发布的官方源代码，也不是本次运行游戏实测” | 这是读者理解演算限制所需的方法与不确定性说明，未伪装成实测，也未暴露内部抓取日志或私有路径。 |
| 图 2 图注（第 68 行） | “Parsnip 与 Melon 的日期示例按公开阶段数据和固定 1.6 decompiled 实现演算；阶段分配与向上取整决定首次日期，不是游戏内实测。” | 图注把演算与实测分开，且与图中内容相关；不是“搜索后打不开所以换来源”之类的过程残留。 |
| 参考来源（第 101–114 行） | 公开 Wiki、官方版本公告与固定提交链接。 | 公开引用是正文允许的出口；没有发现内部 `research/`、`layout/`、任务卡、Agent 交接、canary、检索排名或给作者的工作指令。 |

### 2.2 结论

正文没有把 Bing 排名、`cc=CN`、搜索数量、内部路径或研究过程写成读者事实；没有发现“任务卡”“D/E/F”“审核通过”等内部话术。`decompiled snapshot`、日期演算和“非游戏内实测”均在正文中承担明确的限制说明，因此不误杀为 ResearchTrace 残留。ResearchTrace **PASS**。

## 3. ReaderValue：FAIL

### 3.1 正文主任务完成情况

以下部分实际回答了被选定的操作任务：

- 第 1 行先给出名称、可施用地块、播种前后/成长中时机、首次成长与再生长边界，并指出 10% 不是日历固定少 10%。
- 第 23 行给出“已锄地 + 不得叠加另一种肥料”的可观察前提和下一动作；第 27–29 行把播种前、播种后、成长中和晚施时已完成阶段不追回分开说明。
- 第 43–70 行给出阶段向量、向上取整、Parsnip 短阶段和 Melon 长阶段的条件化日期演算，避免把 modifier 直接换成固定少几天。
- 第 74–89 行给出草莓春 13 日案例，区分 Spring 20/21 首次收获与之后每 4 天再生长；第 93–99 行把判断收束为地块、目标时间段、阶段数据三问。

因此，文本本身大部分能让读者完成“先检查地块，再判断施用时段和首次收获”的主任务；没有因站点是规划器而新增 CTA 或收益承诺。

### 3.2 失败项 A：V2 实际图解没有兑现阶段变化的关键可视关系

**定位**：正文第 66–68 行实际嵌入 `assets/zh/speed-gro-stage-comparison.svg`；布局第 177–182 行要求每行展示“无肥料 / Speed-Gro / Deluxe / Hyper”的阶段天数变化和首次收获日。

**实际媒体核对**：文件真实存在，XML 可解析；按 SVG 的标题、描述、文字元素和几何路径核对，`<title>` 为“Parsnip 与 Melon 成长阶段和首次收获日期对照”，`<desc>` 和图内标题写了 `daysToRemove = ceil（基础成长天数 × modifier）`；但 SVG 实际只绘制了 Parsnip 的一条无肥料 `[1,1,1,1]` 基准条带和 Melon 的一条无肥料 `[1,2,3,3,3]` 基准条带。Speed-Gro、Deluxe、Hyper 的结果在右侧作为首次收获日期文字列出，没有对应的修改后阶段条带、删除日标记或阶段分配可视化。

**为什么影响 ReaderValue**：正文第 43–51 行的核心增益是“向上取整 + 阶段向量 + 阶段分配”，而实际 V2 只把这套关系部分写进公式和日期清单，读者不能从图中直接核对不同 modifier 如何改变阶段。它不是占位图，也不是空文件，但没有完成布局承诺的关键图解作用，不能按“图文通过”处理。

**局部返工要求（不在本报告执行）**：C 需让 V2 实际展示各档位的阶段变化或删日分配，或者收窄图注/正文对图的承诺，使图中确实可观察的关系与正文一致；修改后 D 必须重新核对实际媒体，不得沿用本报告结论。

### 3.3 失败项 B：中文技术术语中 `modifier` 过密

`modifier` 在正文中实际出现 11 次。除官方物品名、作物名和代码函数/公式外，以下表达可以直接中文化而不损失精度：

- 第 9 行：“标称 growth modifier”“肥料 modifier”；
- 第 17 行：“成长速度 modifier”；
- 第 29 行：“modifier 有更多阶段可以影响”；
- 第 33 行：“把这个间隔再乘一次 modifier”；
- 第 57 行表头“modifier”；
- 第 64 行“modifier 分别变成……”；
- 第 89 行“首次成长 modifier”。

读者已在第 9 行看到概念，后续可统一使用“成长速度修正值（modifier）”或“修正值”；当前中英混排反复打断中文说明。`Speed-Gro`、`Deluxe Speed-Gro`、`Hyper Speed-Gro`、`Agriculturist`、Parsnip/Melon、`ceil` 等是物品、技能、作物或公式标识，不能与这个可翻译的普通术语混为一谈。

### 3.4 图解实际存在与含义核对

| 图 | 实际文件/哈希 | 实际含义核对 | 判定 |
| --- | --- | --- | --- |
| 图 1 | `speed-gro-application-flow.svg` / `0ace2a…fd4a` | 有“已锄地”“播种前施用”“播种后施用”“成长中施用”，汇入“影响首次成长与首次收获”；另有“已成熟，等待再收获 → 再生长间隔不缩短”“一格只能一种肥料”。与第 23、27、33、39 行及图注一致。 | D-XML/正文语义 PASS（非渲染视觉通过） |
| 图 2 | `speed-gro-stage-comparison.svg` / `d44d70…7f96` | 真实 SVG，显示两组基准阶段条带、公式和四档首次日期文字；没有绘出各 modifier 的阶段变化，见 3.2。 | D-XML/正文语义 FAIL |
| 图 3 | `strawberry-harvest-timeline.svg` / `10510f…3ceb` | 有 Spring 13/20/21/24/25/28 刻度；无肥料轨道画到 Spring 21 及其 4 天再生长，Speed-Gro 轨道画到 Spring 20→24，右侧文字明确写出 `春 20 → 24 → 28`，并写明不改变 4 天间隔。与第 74、76、80–89 行一致；第二个再生长点主要由右侧文字而非轨道箭头呈现。 | D-XML/正文语义 PASS（非渲染视觉通过，含表达偏弱记录） |

三张媒体均为真实 SVG，不是建议、占位符或无关装饰；`xmllint` 逐个退出 0，未发现 `placeholder`、`TODO`、`dummy` 或 `mock` 字样。按 XML 文字/几何元素与正文语义核对，图 1、图 3 的关系表达一致；图 2 的缺口足以使 ReaderValue 保持 FAIL。渲染后的视觉通过状态等待 M 独立报告，不由本 D 代签。

**直接渲染限制**：本角色尝试用 `view_image` 打开图 2 时得到 `invalid or unsupported image data`；没有转换、覆盖或修改 SVG，也没有把该失败写成媒体通过。以上媒体判定限于文件存在性、XML 解析、SVG 文字/几何元素与正文语义；独立媒体角色 M 的 ego-browser 渲染报告不由本 D 报告代替，若 M 发现新的视觉问题，应按新证据复核受影响门。

## 4. Repetition：FAIL

### 4.1 主要重复簇：草莓案例

同一组“Spring 13 → 首次收获提前一天 → 之后仍为 4 天间隔”的数字和边界，在下列相邻材料中反复承担同一说明作用：

1. 第 76 行完整叙述无肥料 Spring 21/25 与 Speed-Gro Spring 20/24/28。
2. 第 80–81 行表格再次列出相同日期，并在最后一列再次写“只提前第一次成长，4 天再生长不变”。
3. 第 83 行再次把“提前一天”“春季三次”“不外推任意作物/日期/档位”写成段落结论。
4. 第 87 行图注再次完整写出 Spring 21 → Spring 20 与“后续仍按 4 天再生长”。
5. 第 89 行又以“春季第 20 日……以后每四天都变成三天”的反例重述同一边界。

**精确重复证据**：第 76 行的“使用普通 Speed-Gro 时首次收获提前到春季第 20 日，之后仍以 4 天为间隔”，与第 81 行的“春季第 20 日……只提前第一次成长，4 天再生长不变”以及第 87 行的“将首次收获从春季第 21 日提前到春季第 20 日；后续仍按 4 天再生长”承担相同的日期与作用边界。第 89 行虽增加错误解释的反例，但仍重复“4 天不会变短”的判断。

**判定依据**：表格可以保留为快速核对，图注应保留图的必要前提，段落则应各自承担“案例前提”“结果对照”或“误读反例”中的一个作用。当前五处都重复完整结果，读者需要多次读同一结论，造成信息密度下降。

**局部返工要求（不在本报告执行）**：C 保留一处完整日期结果、一处图解所需的最短图注和一个真正新增的误读反例；其余段落改为承接新的判断，或删除重复日期。若草莓案例有正文改动，D 需重新做三门全量检查。

### 4.2 次要重复：总原则在结尾的多次复述

- 第 1 行已经给出“不会把……再生长间隔一起缩短”；第 33、37、39 行又分别在作用边界、图注和换季边界中复述。
- 第 96 行三问已经要求区分“第一次成熟”与“下一次再生长”；第 99 行再次用“两段时间”总结同一判断。

这些复述中有少量位置性价值（开头答案、步骤边界、结尾检查），不单独作为失败依据；但在修订草莓重复簇时，应同时压缩第 96 与第 99 行，避免结尾再次换词复述。

## 5. 机械计数预检（非 F 锁稿）

实际运行：

```text
python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md --locale zh-CN --exclude-heading '参考来源'
```

退出码：`0`。

真实输出摘要：`mechanical_units=2804`、`required_floor=2000`、`meets_mechanical_floor=true`、`semantic_qualification=requires_independent_review`、`excluded_heading_sections=["参考来源"]`、`sha256_raw` 与本报告 1.1 相同。这个值只是机械预检，不能覆盖本报告的 ReaderValue/重复失败，也不构成 F 的最终锁稿或长度通过。

## 6. 实际命令与退出码

| 实际命令/动作 | 退出码 | 真实用途/结果 |
| --- | ---: | --- |
| `sed -n '1,240p' '/Users/wusir/Desktop/博客-V7修订版/执行入口.md'` | 0 | 读取 content-only 定义、A–F 角色边界和公开引用规则。 |
| `sed -n '1,280p' '/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md'` | 0 | 读取 D 独立执行三门、正文修改后重新复验的要求。 |
| `sed -n '1,360p' '/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md'` | 0 | 读取 ResearchTrace、ReaderValue、Repetition 和计数边界。 |
| `sed -n '1,360p' '/Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md'` | 0 | 读取来源正文核验、公开引用和方法说明边界。 |
| `find docs/blog-ops/stardew-valley-speed-gro -maxdepth 3 -type f -print`、`nl -ba docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md | sed -n '1,360p'` | 0 | 确认输入文件和正文行号；未读取另一语言正文或媒体。 |
| `sha256sum docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md docs/blog-ops/stardew-valley-speed-gro/assets/zh/*.svg` | 0 | 记录当前正文与三张媒体哈希。 |
| `ego-browser nodejs -e '...'`，脚本内调用 `taskSpace("D-zh independent intent review stardew valley speed gro")` 后对 4 个实际查询逐一 `page.goto()` | 0 | 实际打开原始英文关键词及三个中文意图变体，读取标题、链接和可见摘要。 |
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md --locale zh-CN --exclude-heading '参考来源'` | 0 | 机械计数预检 2804；明确不作为 F 锁稿。 |
| `for f in docs/blog-ops/stardew-valley-speed-gro/assets/zh/*.svg; do xmllint --noout "$f"; done` | 0（每个文件） | 三张 SVG 均可解析。 |
| `rg -n -i 'placeholder\|占位\|todo\|coming soon\|lorem\|dummy\|mock' docs/blog-ops/stardew-valley-speed-gro/assets/zh` | 0 | 无占位/伪媒体字样命中。 |
| `view_image(/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg)` | 工具错误（无 shell 退出码） | SVG 直接查看不受支持；未转换或修改原图，改以 XML/文字/几何元素核对，并等待独立 M 的渲染报告。 |

范围外未做：没有修改正文或媒体，没有装配网站，没有运行站点构建，没有部署、提交、推送、依赖安装、密钥处理或外部写入；没有执行 E 的八层鉴文，也没有把此 D 报告当作 E 通过。

## 7. 交接

- **D-zh：FAIL**，绑定正文 SHA-256 `4069e1cb2269fa475eb15a86c94ad7ae7ed24efd175277742063d0d12b8934fa`。
- 返工优先级：先处理 V2 实际图义与正文承诺不一致，再压缩草莓案例重复簇；同时把普通说明中的 `modifier` 统一中文化。随后由 D-zh 对新正文和新媒体重新执行 ResearchTrace、ReaderValue、Repetition；不能由 C 自签 D 通过，也不能由 E 报告代替 D。
