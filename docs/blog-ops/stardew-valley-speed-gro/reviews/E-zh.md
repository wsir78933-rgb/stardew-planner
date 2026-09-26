# E-zh 独立审核（中文第 1 轮修订后）

## 结论先行

**结论：FAIL（需要局部引用修订后重新走 D 全量三门，再由 E 复核）。**

被审版本绑定如下：

- 正文：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md`
- `body-zh.md` SHA-256：`6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`
- 媒体清单：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json`
- `media-zh.json` SHA-256：`4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5`
- SVG SHA-256：`speed-gro-application-flow.svg` = `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d`；`speed-gro-stage-comparison.svg` = `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb`；`strawberry-harvest-timeline.svg` = `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da`

事实、算法、日期演算、主搜索意图、信息增益、中文图义和图文数字对应均未发现实质性错误。当前阻断整体通过的是正文公开引用支持性：`body-zh.md:96` 写有“咖啡豆成熟后的 2 天”，但正文近邻没有 Coffee Bean 来源，文末来源清单也没有该来源；`body-zh.md:1` 的“加速 10%”同样没有近邻来源。两处都可由已有原始证据支持，不应补写新事实：保留内容时添加近邻链接（并把 Coffee Bean 加入来源清单），或删除对应示例；正文未修改。

本报告只审内容材料，不审正式 SEO 表面，不代表网站装配、页面验收、部署或用户批准。用户终审尚未进行；地区限制按实际研究记录保留，不能把 `cc=CN` 的 Bing 请求参数写成中国大陆 Google SERP。

## 审核身份、输入和独立边界

- 角色：E-zh，独立内容鉴文与事实/引用审核；本次 Orca task：`task_ec546daebd5a`。
- 模式：`content-only`；原始关键词：`stardew valley speed gro`；站点：`https://stardewvalleyplanner.art`；中文范围：`locale=zh-CN`、`country=CN`。
- 本次直接读取：
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/zh.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts-evidence/source-extracts.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/source-pages-2026-09-26.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/layout/zh.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg`
  - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg`
- 规则：已完整读取 `/Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`、`/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md`、`/Users/wusir/Desktop/博客-V7修订版/参考规则/22条鉴文规则.md`、`/Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md`。
- 前置 `D-zh-r1` 报告和作者 `C-zh-r1` 自评不作为本结论依据；本报告不读取英文正文，不以旧 `D-zh.md` 的 FAIL 或当前 D/C 的自报替代独立判断。
- 实际媒体渲染证据另有 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/` 六张 PNG 和 `reviews/media-zh-r1.md`；我读取并目视核对了三张窄屏证据，同时使用同一 ego-browser TaskSpace 直接打开三张上游 SVG 独立核对图义、算法和数字。媒体报告的桌面/窄屏几何结论只作为其自身范围的证据，不代替本报告的来源事实复核。

## 主意图、信息增益和正文聚焦

### 主意图复核

布局选定的唯一 ReaderTask 是“把 `Speed-Gro` 对应到中文的生长激素，在已锄地上判断播种前/后/成长中如何施用，并判断它影响首次成长/首次收获的哪一段”。正文从第一句直接回答这一任务，随后按“术语与档位识别 → 地块和施用时机 → 阶段算法 → 草莓首次收获案例 → 三问检查”推进。

没有把 `哪里买/怎么制作`、完整档位成本比较、ROI/赚钱判断或站点工具 CTA 偷渡进正文；高级/顶级只用于识别 modifier 和解释阶段差异，仍服务于主任务。站点没有被写成具有 Speed-Gro 计算或收益功能，符合研究和布局的范围限制。

### 可操作信息增益

- `body-zh.md:21-39` 把“已锄地/已有肥料/播种前后/成长中/已成熟等待再收获”变成可观察状态、下一动作和作用边界。
- `body-zh.md:41-70` 不把 10%/25%/33% 当成日历直接减同百分比，而是给出阶段向量、`ceil(baseDays × modifier)`、向前分配阶段日的可复核方法，并用 Parsnip 与 Melon 对照。
- `body-zh.md:72-89` 用有完整前提的 Spring 13 草莓案例，把首次收获和后续固定 4 天再生长拆开，避免把肥料错误套到再生长字段。
- `body-zh.md:91-97` 的三问是检查动作，不是把前文换词复述；读者可据地块状态、目标阶段和作物数据选择下一步。

信息增益门：**PASS**。当前 FAIL 不是信息增益或主意图偏移，而是公开引用近邻性。

## 事实、数字、算法和引用支持性

### 已独立核对并通过的事实

| 主张 | 正文位置 | 独立核对结果 |
| --- | --- | --- |
| 1.6.15 PC/Steam 与 1.6.15.1 主机版本锚点 | `body-zh.md:3` | ego-browser 读取官方 Steam 页面标题 `Stardew Valley 1.6.15 Patch now available` 与官方站 `1.6.15.1 Patch for Xbox, PlayStation, and Switch`；正文没有把 1.6.16 写成已发布。 |
| 生长激素（Speed-Gro）10%，Agriculturist 合计 20%；高级 25%/35%；顶级 33%/43% | `body-zh.md:7-17` | 中文生长激素页、英文 Speed-Gro/Deluxe/Hyper 固定页面和 Farming 页面均支持这些数字及其适用边界；正文称其为标称 modifier，没有写成固定少同样天数。 |
| 目标是已锄地，一格不能叠加肥料；播种前、播种后和成长中可施；多收获作物首次成长/首次收获与再生长分开 | `body-zh.md:21-39`、`74-97` | 中文生长激素页、中文肥料页、英文三个 Speed-Gro 固定页面和 Fertilizer 固定页面均支持；晚施不追溯已完成阶段的边界也与 Speed-Gro 页面一致。 |
| 阶段算法和 `ceil` | `body-zh.md:41-45`、`55-70` | 固定提交的 `HoeDirt.cs` 实际读回 `ResetPhaseDays`、阶段总和、Agriculturist 加算 `0.1`、`Math.Ceiling`、最多 3 轮以及第一阶段保护条件；正文明确称其为 decompiled snapshot，不是官方源代码或游戏实测。 |
| Parsnip/Melon 阶段向量与首次日期 | `body-zh.md:47-70` | 固定 Parsnip/Melon 页面支持阶段与基础天数；独立 Node 复算与正文表格相同。 |
| Strawberry 8 天成长、4 天再生长以及 Spring 13 条件案例 | `body-zh.md:72-89` | 中文草莓页与英文固定草莓页支持 8/4、阶段 `[1,1,2,2,2]`、Spring 13 使用 Speed-Gro 可有三次收获；独立复算得到正文日期。 |
| 图解中的施用分支、阶段向量和草莓日期 | 三张 SVG 与正文图注 | 直接浏览器渲染文本和图形与正文、事实和复算一致，详见“媒体与图解”。 |

### 必须修订的引用缺口

#### E-ZH-REF-01（必须修订）：正文使用 Coffee Bean 的精确数字却没有来源

- 位置：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md:96`。
- 原句：`若目标是缩短草莓成熟后的 4 天、咖啡豆成熟后的 2 天等再生长间隔，它不是这个判断的依据。`
- 证据：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts.md` 的 `F-REGROW-01`/`REF-COFFEE` 和原始来源 `https://stardewvalleywiki.com/Coffee_Bean?oldid=193175` 支持 Coffee Bean 成熟后 2 天再生长；我在 ego-browser 实际打开该固定页面，读到 `Growth Time 10 days`、`Regrowth: 2 Days` 和春夏生长条件。
- 缺口：正文近邻没有 Coffee Bean 链接，`body-zh.md:99-112` 的参考来源清单也没有 Coffee Bean；正文中仅在 `body-zh.md:33` 泛称咖啡豆，没有登记其来源。
- 局部修订：保留该例时，在 `body-zh.md:96` 的“咖啡豆成熟后的 2 天”附近加入描述性 Coffee Bean 固定版本链接，并在参考来源清单追加同一 URL；或者删除该具体数字。不得改动为没有证据的新数字。

#### E-ZH-REF-02（必须修订）：开头直接给出 10% 但没有近邻来源

- 位置：`body-zh.md:1`。
- 原句片段：`这里最容易混淆的地方是“加速 10%”并不等于日历一定少 10%`。
- 证据：正文后面的 `body-zh.md:17` 和中文生长激素来源支持 10%，但 `body-zh.md:1` 本句没有链接；规则要求统计数字和关键专业断言在相邻句有清楚可定位的出处。
- 局部修订：在开头该事实句后加入已有的中文生长激素链接，或删去重复的 `10%` 并将数字留在已带来源的档位表中。不要新增未核验的效果承诺。

#### 引用完整性建议（非新增事实）

`body-zh.md:27` 用一个 Speed-Gro 固定页面链接支持“三种生长激素的资料都允许播种前、播种后或任何成长阶段施用”。三个英文固定页面实际都支持该规则，但为了让“全部三种”与来源一一对应，C 可在该句补上 Deluxe/Hyper 链接，或把句子收窄为当前链接明确支持的 Speed-Gro。该项与上述两项应在同一轮局部处理，不引入新范围。

### 未发现的事实问题

- 未发现把灰机页面旧配方“蛤 1”误写进当前正文；灰机页只被正文用于术语桥接。
- 未发现把灰机页面的“尽量当天施肥，否则无效”未经核验地写入正文；正文使用的是已核对的“晚施仍按尚未完成阶段处理、已过阶段不追溯”。
- 未发现把固定 decompiled snapshot 冒充官方源代码、把分析日期冒充游戏内实测、把条件化草莓案例外推为“永远三熟”或把再生长间隔写成会缩短。
- 未发现把站点规划器的公开功能扩写成 Speed-Gro 计算、收益比较或肥料状态功能。

## 独立日期复算

我使用独立 Node stdin 程序实现固定提交所显示的核心分配逻辑：复制阶段数组；`daysToRemove = ceil(sum(stages) × modifier)`；最多 3 轮、从前到后扣减、第一阶段仅在原值大于 1 时可扣；再计算 effectiveDays 和日期。该程序没有写入任何脚本文件。

- Parsnip `[1,1,1,1]`、Spring 1：无肥料 Spring 5；Speed-Gro Spring 4；Deluxe Spring 4；Hyper Spring 3；叠加 Agriculturist 后分别 Spring 4、Spring 3、Spring 3。
- Melon `[1,2,3,3,3]`、Summer 1：无肥料 Summer 13；Speed-Gro Summer 11；Deluxe Summer 10；Hyper Summer 9；叠加 Agriculturist 后分别 Summer 10、Summer 8、Summer 7。
- Strawberry `[1,1,2,2,2]`、Spring 13、regrowth 4：无肥料 Spring 21/25/29；Speed-Gro Spring 20/24/28；Deluxe Spring 19/23/27；Hyper Spring 18/22/26。正文表只列春季内相关收获，图解与正文的 Speed-Gro 主案例完全一致。

第一次独立复算命令退出码为 `1`，原因是测试 harness 把正文表格的省略写法 `Spring 21/25` 当成了完整日期串，而算法实际正确产生越过季节的 `Spring 29`；我修正 harness 的预期为完整日期串后重跑，退出码为 `0`，所有 Parsnip/Melon/Strawberry 与 Agriculturist 期望值均通过。这个失败是审计命令的预期字符串错误，不是正文数字错误；两次命令均保留在本报告的实际命令记录中。

## 图解、算法和媒体对应

### 图 1：`speed-gro-application-flow.svg`

- 实际浏览器读回：`已锄地 → 播种前施用 / 播种后施用 / 成长中施用 → 影响首次成长与首次收获`；另一分支是 `已成熟，等待再收获 → 再生长间隔不缩短`。
- 图底同时写明“一格只能一种肥料”、换季通常消失、多季作物/温室保留例外，并明确“保留不等于再生长加速”。这些关系与正文 `body-zh.md:21-39` 对应，没有把保留误画成加速。
- 结论：图义准确；没有日期或算法数字需要另行核对。

### 图 2：`speed-gro-stage-comparison.svg`

- Parsnip 行实际显示 `[1,1,1,1] → 春 5`、`[1,0,1,1] → 春 4`（Speed-Gro/Deluxe）、`[1,0,0,1] → 春 3`（Hyper）。
- Melon 行实际显示 `[1,2,3,3,3] → 夏 13`、`[1,1,2,3,3] → 夏 11`、`[1,1,2,2,3] → 夏 10`、`[1,1,2,2,2] → 夏 9`。
- 图内注明向上取整和逐阶段分配，底注注明固定 1.6 decompiled 实现的规则演算、不是游戏实测；与正文 `body-zh.md:43-70` 和独立复算一致。
- 结论：图义和算法表达准确；图只展示无 Agriculturist 的四档，正文把 Agriculturist 的另三组日期写在文字中，未造成图文冲突。

### 图 3：`strawberry-harvest-timeline.svg`

- 图内条件完整：室外普通耕地、春 13 日播种、当天浇水、肥料当天生效、不跨季且无其他地点/机制加成。
- 无肥料轨道为首次春 21、后续春 25；Speed-Gro 轨道为首次春 20、后续春 24 → 春 28；图中明确每次再生长仍为 4 天。
- 图底注明日期是公开阶段数据与规则的条件化演算，不是游戏内实测；与正文 `body-zh.md:72-89`、manifest 的 assumptions 和独立复算一致。
- 结论：图义、数字和前提准确；没有把“春季三次”画成无条件保证。

### 媒体路径和 manifest

独立 Node 检查确认 `media-zh.json` 的 `pathBase` 是 `manifest-directory`，三条 `../assets/zh/*.svg` 从 `drafts/` 解析都存在；body 三条图片链接各出现一次；manifest 声明尺寸和 SVG 根尺寸分别为 `390×1040`、`390×1160`、`390×1040`，完全匹配。三张上游 SVG 均在本地 ego-browser 直接 `file://` 打开并读取 DOM 语义，且读取了 `reviews/media-evidence-zh-r1/` 的三张窄屏实际截图；媒体渲染本身没有为本轮 FAIL 提供原因。

## 22 条鉴文规则逐项记录

“未命中”表示本条没有发现规则所描述的问题；不表示正文已经通过全部事实/引用门。

| # | 结果 | 独立判断与定位 |
| ---: | --- | --- |
| 1 | 未命中 | 反驳和限制集中在真实会改变施用或日期判断的分支：已锄地、肥料互斥、已过阶段、再生长、换季和地点；没有大量无关假想反驳。 |
| 2 | 未命中 | 正文只展开术语识别、施用规则、阶段算法和首次收获案例；购买/制作、ROI 和工具能力被排除，没有把搜索结果所有主题拼成百科。 |
| 3 | 未命中 | 表格中的平行档位和阶段行承载比较所需数据；说明、步骤、案例和三问的句法有变化，不是只换词的匀速排比。 |
| 4 | 未命中 | 未发现反复套用“虽然……但是……”让步模板；转折均承担施用时机、再生长或版本边界。 |
| 5 | 未命中 | `生长激素`、`Speed-Gro`、`Deluxe Speed-Gro`、`Hyper Speed-Gro` 和 modifier 用词稳定，没有反复虚构命名。 |
| 6 | 未命中 | 没有个人经历或编排情绪曲线；全文采用平静的规则解释和条件化演算。 |
| 7 | 未命中 | 没有无来源的“大家都以为/所有人都……”再反驳；“最容易混淆”后面给出的是可核对规则。 |
| 8 | 未命中 | `而不是` 对照分散在术语、算法、Agriculturist、固定口诀和草莓收益边界，每处都消除不同误判；没有在约 800 字内密集堆叠同一模板。 |
| 9 | 未命中 | 文章对已核实规则直接陈述，对日期用“假设/演算/可能”标注条件，没有为真实确定事实强行加入犹豫。 |
| 10 | 未命中 | Spring/Summer 日期、10%/25%/33% 和 4/8/12 天均来自来源或独立演算；图注和正文明确不是游戏实测，没有虚构性能或成功率。 |
| 11 | 未命中 | 没有“我也曾失败”等只服务论点的脆弱经历。 |
| 12 | 未命中 | 复杂规则没有突然压成万能步骤；正文先区分地块状态、施用时机、首次成长与再生长，再用三问收束，关键例外放在对应位置。 |
| 13 | 未命中 | 没有每段都以金句升华；结论句承担日期、作用边界或判断功能。 |
| 14 | 未命中 | 说明段、表格、列表、算法解释和日期案例节奏不同；没有靠随机拆句制造“真人感”。 |
| 15 | 未命中 | 判断依据是来源、固定提交算法、阶段向量和明确前提，没有用直觉或感受替代论证。 |
| 16 | 未命中 | 开头第一句即给出名称、可施用阶段和首次/再生长边界，第二段交代版本；不是只剩钩子、痛点或承诺。 |
| 17 | 未命中 | `因此/这意味着/换句话说` 等连接词用于真实因果和边界，未形成密集填充；删除它们会损失逻辑。 |
| 18 | 未命中 | 术语没有刻意同义替换；中文名、英文名、档位名和“首次成长/再生长”保持一致。 |
| 19 | 未命中 | 中文表达自然、面向读者动作；英文物品名、modifier、decompiled 等保留是术语或证据需要，不构成翻译腔。 |
| 20 | 未命中 | Parsnip、Melon、Strawberry 都明确是公开数据规则演算，带播种日、浇水、地点和季节前提；没有包装成作者实战或游戏测试。 |
| 21 | 未命中 | 结尾是三问检查地块、目标阶段和数据，不是祝福、口号或泛泛积极结尾。 |
| 22 | 未命中 | 阶段算法和“不要把 modifier 套到再生长”直接服务主任务，没有突然上升到宏大命题。 |

## 六类形式指纹

| 指纹 | 结果 | 证据 |
| --- | --- | --- |
| 破折号过密 | PASS | `rg -n -o '—|——'` 对正文无命中；普通连字符只出现在必要的英文物品名/版本 URL。 |
| 粗体过密 | PASS | 只有 modifier 表头和结尾三问共 4 处粗体；均承担识别或行动作用，未形成视觉噪声。 |
| 无用装饰符号 | PASS | 无 ASCII 装饰线、无无意义 emoji；表格、编号、链接和图片均服务说明。 |
| 助手残留 | PASS | 对 `as an ai|language model|assistant|prompt|system message|自评|写手|agent|token` 无命中。 |
| 填充短语 | PASS | 未发现反复使用“值得注意/事实上”等可删除填充；“这里最容易混淆”“读图重点”等均有后续规则内容。 |
| 泛泛积极结尾 | PASS | 正文以可执行三问和条件化日期判断结束，没有“开启旅程/你值得”等无任务价值结尾。 |

## 八层独立鉴文与质量门

| 层/门 | 结果 | 依据 |
| --- | --- | --- |
| 1. 22 条规则 | PASS（逐项见上） | 未发现 22 条鉴文规则或六类形式指纹问题。 |
| 2. 事实、版本、因果与引用 | **FAIL** | 数字和算法本身通过独立来源/复算；`body-zh.md:96` Coffee Bean 2 天缺正文近邻引用，`body-zh.md:1` 10% 缺近邻来源。 |
| 3. 保护有效限制、反例和不确定 | PASS | 版本线、去重、晚施、阶段分配、再生长、季节和地点前提均保留；没有把计算写成实测。 |
| 4. 信息增益与 ReaderValue | PASS | 状态→动作→边界流程、阶段算法、草莓时间线和三问可操作，并聚焦唯一主意图。 |
| 5. 图文一同组织与图解准确性 | PASS | 三图实际 DOM/渲染文本、算法、日期和 body/manifest 对应正确；见媒体章节。 |
| 6. ResearchTrace/真实性 | PASS | 未发现 SERP 排名、内部路径、agent 残留或未做实测的“我们测试”；公开方法说明被保留。 |
| 7. 结构、重复与长度 | PASS | 用 V7 正文计数脚本独立得到 2782 个 `zh-CN` 汉字，超过 2000；段落用途不同，未发现承担同一作用的重复段。 |
| 8. 用户终审 | UNVERIFIED / 待进行 | 当前是 content-only 材料，未装配网站，用户尚未审阅完整页面；不能把技术审核写成用户批准。 |

附加质量门：`SEOTruth` 未审（正式 SEO 稍后另审）；未审标题、H1、Description、canonical 或页面元数据。`Length` 的机械值通过不抵消引用 FAIL；D 的三门通过不替代本 E 结论。

## 实际命令、退出码和关键回读

以下是本轮实际执行的只读命令或实际浏览器动作；没有安装依赖、外部写入、网站装配、部署、提交、推送或密钥处理。

| 实际命令/动作 | 退出码 | 关键真实回读 |
| --- | ---: | --- |
| `sed -n` 读取执行入口、统一工作流、内容生产与质量门、22 条规则、事实核验与公开引用 | 0 | 读到 content-only 边界、E 八层、引用支持、独立角色和用户终审规则。 |
| `find /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro -maxdepth 4 -type f -print` | 0 | 目标材料、三张中文 SVG、媒体证据和既有审核文件均可定位；本轮只写 E-zh。 |
| `shasum -a 256` 读取 `body-zh.md`、`media-zh.json` 和三张 SVG，并用 `wc -c` 读尺寸 | 0 | 哈希见本文开头；正文 13568 bytes，manifest 3501 bytes，SVG 为 5396/9660/5557 bytes。 |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py ... --locale zh-CN` | 0 | `mechanical_units=2782`、`required_floor=2000`、`meets_mechanical_floor=true`；raw SHA 与正文绑定 hash 一致。 |
| `curl -L --fail --silent --show-error 'https://raw.githubusercontent.com/AcidicNic/StardewValleyDecompiled1.6/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs' | nl -ba | sed -n '500,575p;584,635p;1035,1051p'` | 0 | 实际读到 `applySpeedIncreases`、`Math.Ceiling`、3-pass 阶段扣减、第一阶段保护、0.10/0.25/0.33 映射和播种前/后调用点。 |
| 独立 `node` stdin 日期复算（第一次 harness 与修正后 harness） | 1；随后 0 | 第一次仅因预期字符串把跨季 Spring 29 漏写而失败；修正后 Parsnip/Melon/Strawberry 全部输出与正文一致。 |
| 独立 `node` manifest/body/SVG 路径和尺寸校验 | 0 | `pathBase=manifest-directory`；三资产存在、body 各链接一次、manifest 与 SVG 尺寸完全匹配。 |
| `rg -n` 检查正文数字、Coffee Bean、引用、形式指纹和助手残留 | 0 | 精确定位 `body-zh.md:96` Coffee Bean 2 天没有 URL；`body-zh.md:1` 的 10% 没有近邻 URL；无助手残留、无破折号命中。 |
| `ego-browser nodejs`，TaskSpace 52 / Page p1，依次打开中文来源、英文固定来源、官方版本页及三张本地 SVG，读取标题/正文/DOM snapshot/screenshot | 0 | 中文来源支持名称、10%/20%、施用时机、互斥、换季和草莓 8/4；英文固定页支持 10/25/33、晚施/首次收获和作物阶段；图解文本与视觉关系可读。 |
| `view_image` 读取 `reviews/media-evidence-zh-r1/zh-flow-narrow.png`、`zh-stage-narrow.png`、`zh-strawberry-narrow.png` | 成功 | 三张实际窄屏截图的文字、日期、阶段向量和边界均可读；没有横向裁切或图义冲突。 |
| `ego-browser nodejs` 执行 `task.finish({keep: []})` | 0 | `closedSpace=true`、`closedManagedLabels=["p1"]`；只关闭本 E-zh 创建的浏览器任务空间。 |

## 来源 URL

本轮实际打开或依原始证据核对的公开来源如下；搜索结果只作意图形态，不作为事实证明。

- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Strawberry?oldid=192732
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175
- https://stardewvalleywiki.com/Farming?oldid=191914
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L502-L629

## 文件清单和后续处理

### 本轮唯一新增/修改文件

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/E-zh.md`

### 被审输入文件

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/zh.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/facts-evidence/source-extracts.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/source-pages-2026-09-26.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/layout/zh.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg`

### 状态转移

1. C 只处理 `E-ZH-REF-01` 与 `E-ZH-REF-02` 的局部引用支持；不改事实、算法、媒体或范围。
2. 由 D 对修订后的同一正文做三门全量复验；旧 D 结论不自动覆盖新 hash。
3. E 绑定新正文 hash 复核受影响的事实、引用、22 条规则和图文关系；在未复核前不得交 F 锁稿。
4. 正式 SEO、网站装配、页面审核和用户终审保持未进行状态。
