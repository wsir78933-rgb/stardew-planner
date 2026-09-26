# D-zh 独立写后检查：C-zh 第 1 轮修订后的全量复验

## 0. 身份、范围与版本绑定

- **角色**：D-zh；独立写后检查，不兼任 C、M 或 E，不执行八层鉴文、SEOTruth、页面装配或锁稿。
- **模式**：`content-only`。本次只复验 `ResearchTrace`、`ReaderValue`、`Repetition`，并核对正文实际引用的三张中文 SVG；不改正文、媒体或其他目录。
- **原始关键词与范围**：`stardew valley speed gro`；站点 `https://stardewvalleyplanner.art`；中文 `locale=zh-CN`、`country=CN`。主意图只能依据本轮实际搜索材料判断，不能把混合入口擅自扩大成购买、配方或收益百科。
- **输入**：`/Users/wusir/orca/workspaces/stardew planner/博客-2/research/zh.md`、`facts.md`、`layout/zh.md`、`drafts/body-zh.md`、`drafts/media-zh.json`、`assets/zh/` 三张 SVG；读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/editorial/C-zh-r1.md` 仅作改动导航。旧 `reviews/D-zh.md` 仅用于列出待复验的旧失败项，旧版 PASS 不沿用。
- **当前正文 SHA-256**：原始字节与 NFC/LF 均为 `6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`。
- **当前媒体绑定**：`drafts/media-zh.json`=`4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5`；`speed-gro-application-flow.svg`=`6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d`；`speed-gro-stage-comparison.svg`=`da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb`；`strawberry-harvest-timeline.svg`=`43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da`。
- **视觉边界**：SVG 实际存在、可解析、可渲染和文字/关系含义由本 D 核对；M 的独立视觉可读性、裁切、清晰度和手机视觉结论尚未执行，不由本报告代签。

## 1. 总结结论

| 门 | 结论 | 当前版本证据摘要 |
| --- | --- | --- |
| ResearchTrace | **PASS** | 正文只保留读者所需的版本条件、公开来源和 decompiled 实现限制；内部路径、任务卡、SERP/排名、Agent/审核回执等污染探针无命中。 |
| ReaderValue | **PASS** | `怎么用` 与 `草莓 三熟` 的实际中文搜索信号支持操作/规则指南；正文给出地块状态、施用时机、首次收获算法、条件化草莓日期和三问检查；三张实际 SVG 均兑现对应图解关系。 |
| Repetition | **PASS** | 旧版草莓日期重复簇已拆为前提、结果表、边界解释、图注和误读检查等不同作用；旧版 V2 图解与 `modifier` 过密失败项已分别复验通过。 |

**D-zh 第 1 轮全量复验：PASS。** 这只表示上述三门在当前正文/媒体 hash 上通过；M 视觉复验、E 独立鉴文、F 锁稿与网站页面状态仍未完成。

## 2. 用户关键词、实际搜索证据与主意图

`/Users/wusir/orca/workspaces/stardew planner/博客-2/research/zh.md:32-43` 记录了本轮中文 Bing 的实际打开结果：原始英文词返回混合的 Speed-Gro/Deluxe/ROI 形态（`:25-28`），`星露谷物语 生长激素 怎么用` 前列回到生长激素资料（`:40`），`星露谷物语 生长激素 草莓 三熟` 出现具体日期/收获问题（`:43`）。Google 精确结果被验证码拦截（`:28`），因此本报告不把 `cc=CN` 或中文界面写成中国大陆 Google SERP。

据这些实际信号，正文选择的单一主任务是“把 Speed-Gro 对应到中文的生长激素，并在已锄地上正确判断施用时机、首次成长/收获和再生长边界”。正文没有扩写购买地点、配方路线、ROI 或站点工具计算。原文定位如下：

| 正文位置 | 精确引句 | 与搜索主意图的关系 |
| --- | --- | --- |
| `drafts/body-zh.md:1` | “在中文资料里，生长激素（Speed-Gro）要施在已经锄好的地块上，播种前、播种后或作物成长中都可以使用；它主要改变第一次成长到收获的时间，不会把多次收获作物成熟后的再生长间隔一起缩短。” | 在前三句内给出名称映射、可施用状态、时机和作用边界，直接回答 `怎么用` 型任务。 |
| `drafts/body-zh.md:23-29` | “目标必须是已经锄好的土地。”、“在已经锄好的空地上，可以先撒生长激素，再播种。”、“作物已经进入成长阶段时，仍然可以施用。” | 把搜索信号落实为可观察状态、下一动作和已完成阶段不追溯的边界。 |
| `drafts/body-zh.md:74-83` | “草莓（Strawberry）很适合用来分辨‘首次成长’和‘再生长’这两件事。”、“春季第 13 日播种，当天浇水，肥料当天已经生效” | 用 `草莓 三熟` 的实际需求信号给出带前提的首次收获案例，不作无条件三熟承诺。 |
| `drafts/body-zh.md:93-97` | “面对自己的地块，可以按下面三问作出下一步决定” | 将规则收束为读者能执行的检查，而不是泛泛讲肥料资料。 |

主意图判定为 **PASS**；这不是沿用旧 D 的主意图 PASS，而是重新对照本轮 `research/zh.md` 的实际搜索记录和当前正文。

## 3. ResearchTrace：PASS

### 3.1 原文精确核对

| 正文位置 | 精确引句 | 判断依据 |
| --- | --- | --- |
| `drafts/body-zh.md:3` | “下文按目前可核对的 1.6.15 PC 版本线与 1.6.15.1 主机版本线整理；如果你的游戏显示其他版本，应以游戏内版本为准。” | 版本条件会影响读者采用规则，且紧邻公开版本公告链接；是必要适用范围，不是内部检索日志。 |
| `drafts/body-zh.md:7` | “中文资料页面把‘生长激素’与 `Speed-Gro` 并列” | 术语桥接是完成任务的公开事实，链接指向可公开来源，不暴露内部检索过程。 |
| `drafts/body-zh.md:43` | “公开的 1.6 反编译快照（decompiled snapshot）可以作为实现交叉证据” | 正文同时明确“不是开发者发布的官方源代码，也不是本次运行游戏实测”，是读者理解演算限制所需的方法说明。 |
| `drafts/body-zh.md:68` | “阶段分配与向上取整决定首次日期，不是游戏内实测。” | 图注与实际图解含义一致，明确演算/实测边界，不是作者工作记录。 |
| `drafts/body-zh.md:101-112` | 公开中文 Wiki、固定版本 Wiki、官方版本公告与固定提交链接 | 这是读者可用的公开来源清单，不是 `research/`、`layout/`、Agent 交接或内部证据快照。 |

### 3.2 污染探针

对完整正文运行内部过程/路径/角色/搜索回执探针，`rg` 原始退出码为 `1`（无匹配；外层命令以 0 记录探针结果）。未发现 `research/`、`layout/`、`editorial/`、任务卡、`ReaderTask`、`D/E/F`、canary、SERP、CTR、搜索排名/搜索量、`cc=CN`、内部路径、Agent、审核通过、研究日志或给作者的工作指令。

ResearchTrace **PASS**。`decompiled snapshot`、公式、日期演算和“非游戏内实测”均是正文为读者解释规则所需的公开方法限制，不是检索过程残留。

## 4. ReaderValue：PASS

### 4.1 主任务与信息增益

- `drafts/body-zh.md:5-17` 先完成 Speed-Gro/生长激素术语桥接，再用 10%/25%/33% 表区分档位；表格同时注明是“成长速度修正值”，不是直接扣日。
- `drafts/body-zh.md:19-39` 让读者按已锄地、播种前后、成长中、成熟后等待再收获四种状态选择下一步，并解释一格不能叠加和换季保留边界。
- `drafts/body-zh.md:41-70` 通过 `ceil`、阶段向量、Parsnip 短阶段和 Melon 长阶段把“10% 不等于固定少一天”变成可复核的日期方法。
- `drafts/body-zh.md:72-89` 用 Spring 13 草莓案例分开首次成长和固定 4 天再生长，明确结果依赖播种日、浇水、季节和地点条件。
- `drafts/body-zh.md:91-97` 给出地块状态、目标时间段和作物数据三问；没有加入购买、收益或规划器未核验功能。

这些内容与 `research/zh.md:40-43` 的 `怎么用`、`草莓 三熟` 搜索信号一致，也符合 `layout/zh.md:15-32` 的 ReaderTask；它们没有把混合英文入口错误地扩成多意图百科。

### 4.2 旧版 ReaderValue 失败项逐项复验

旧报告 `reviews/D-zh.md:67-75` 指出 V2 实际只有两条无肥料基准条带，未兑现各 modifier 的阶段变化；当前 `speed-gro-stage-comparison.svg` 已重新读取，实际文本/元素包含：

- `<desc>`（SVG 第 3 行）明确“每行都显示无肥料、生长激素、高级生长激素和顶级生长激素作用后的阶段日数向量与首次收获日期”；
- Parsnip 四档实际行见 SVG 第 23-37 行：无肥料 `[1,1,1,1]`→春季第 5 日，10% `[1,0,1,1]`→第 4 日，25% 同向量→第 4 日，33% `[1,0,0,1]`→第 3 日；
- Melon 四档实际行见 SVG 第 48-62 行：`[1,2,3,3,3]`→夏季第 13 日、`[1,1,2,3,3]`→第 11 日、`[1,1,2,2,3]`→第 10 日、`[1,1,2,2,2]`→第 9 日。

因此 V2 的“阶段向量如何随档位变化”已成为实际可观察关系，且与正文 `body-zh.md:49-68` 和事实演算一致，旧 V2 FAIL **本版 PASS**。

旧报告 `reviews/D-zh.md:77-89` 指出普通说明中的 `modifier` 过密。当前 `rg -o -i '\bmodifier\b'` 只在 `body-zh.md:9` 的首次定义中命中 1 次：“标称成长速度修正值（modifier）”；后文改用“修正值/成长速度修正值”，未再以英文普通术语打断中文说明，旧项 **PASS**。

### 4.3 三张实际图解的存在性与含义

| 图位/正文位置 | 当前实际文件与 manifest | 实际存在/结构证据 | 与正文含义核对 |
| --- | --- | --- | --- |
| 图 1，`body-zh.md:35-39` | `assets/zh/speed-gro-application-flow.svg`；manifest `media-zh.json:7-21` | manifest 相对 `drafts/` 的路径解析到真实文件；SVG `width=390`、`height=1040`；XML 退出 0。 | SVG 第 20-43 行给出已锄地→播种前/后/成长中→首次成长/首次收获；第 46-62 行给出成熟后等待再收获、再生长不缩短、一格一种肥料和换季例外，与正文第 23、27、33、39 行一致。 |
| 图 2，`body-zh.md:66-70` | `assets/zh/speed-gro-stage-comparison.svg`；manifest `media-zh.json:25-41` | manifest 路径真实存在；SVG `width=390`、`height=1160`；XML 退出 0。 | SVG 第 12-15 行先解释向上取整/按阶段分配；第 17-39、42-66 行逐档呈现 Parsnip/Melon 的阶段日数与首次日期，兑现布局 V2，不是占位或只列日期。 |
| 图 3，`body-zh.md:85-89` | `assets/zh/strawberry-harvest-timeline.svg`；manifest `media-zh.json:45-68` | manifest 路径真实存在；SVG `width=390`、`height=1040`；XML 退出 0。 | SVG 第 15-19 行写共同前提，第 27-50 行给出无肥料 Spring 21/25 与 Speed-Gro Spring 20/24/28 及固定 4 天，第 53-60 行解释不要把成长修正值套到再生长，和正文日期表/图注一致。 |

三张图都是真实 SVG，不是图片建议、占位符或未落入正文的素材；三条 manifest 路径和正文三条图片引用均解析到同一 `assets/zh/` 文件。ego-browser 逐一打开本地 SVG，实际回读标题分别为“生长激素施用时机与作用范围流程图”“Parsnip 与 Melon 各档位成长阶段和首次收获日期对照”“草莓春季第 13 日播种的收获时间线”，三者实际 SVG 尺寸分别为 390×1040、390×1160、390×1040。上述是 D 的文件/语义核对；不把本次 DOM 加载成功当成 M 的手机视觉可读性通过。

ReaderValue **PASS**。图注和 alt 不作为正文能力的替代：三张实际图已存在并承担布局指定的规则/阶段/日期关系，正文也在图前后解释其判断方法。

## 5. Repetition：PASS

### 5.1 旧版草莓重复簇逐项复验

旧报告 `reviews/D-zh.md:103-119` 将以下作用混在相邻材料中：完整日期叙述、同日期表格、重复结论、重复图注和重复反例。当前版本的同一段已按不同读者用途拆开：

| 当前位置 | 精确引句/内容 | 当前唯一作用 |
| --- | --- | --- |
| `body-zh.md:74` | “基础成长时间是 8 天，成熟后每 4 天收获一次……不会把成熟后的 4 天间隔改成更短。” | 定义首次成长字段与再生长字段的概念边界，未重复具体日期表。 |
| `body-zh.md:76` | “下面只看一个有明确前提的日期案例：室外普通耕地，春季第 13 日播种，当天浇水……” | 固定案例输入条件，避免把日期演算冒充通用结论。 |
| `body-zh.md:78-81` | 表格列出无肥料 Spring 21/25 与 Speed-Gro Spring 20/24/28。 | 唯一完整的日期结果表，供读者快速核对。 |
| `body-zh.md:83` | “提前首次收获所释放的时间可能让春季多出一次收获；但这个结论依赖播种日、浇水、作物成长数据和季节边界……” | 解释结果的条件和不外推边界，不再次列日期。 |
| `body-zh.md:87` | “Speed-Gro 将首次收获从春季第 21 日提前到春季第 20 日；后续仍按 4 天再生长。” | 图 3 的最短必要图注，说明该视觉内容的核心关系，不另起正文结果段。 |
| `body-zh.md:89` | “把首轮成长箭头与后续 4 天再生长箭头分开；把前者的修正值套到后者，才会得到……错误结论。” | 阅读图解时的具体误读检查；它增加判断动作，而非再次复述完整日期表。 |

图注确实与日期表共享“首次提前、后续 4 天”的事实，但其作用是对图 3 的可访问性和含义作最短说明；当前不存在旧版那种连续段落、表格、图注和结尾逐次重复同一完整日期结果的结构。旧草莓重复 FAIL **本版 PASS**。

### 5.2 其他重复检查

- “首次成长/再生长不混淆”在开头、施用分支、图 1、草莓案例和结尾检查各有位置性用途；例如 `body-zh.md:1` 是直接答案，`:33` 是成熟状态分支，`:95-97` 是最终决策问题，不是连续同作用段落。
- “修正值不能直接换成固定提前天数”在表格定义（`:9-17`）、阶段算法（`:43-45`）、具体短/长阶段示例（`:49-70`）中分别承担术语、方法和验证作用；没有发现可删去而不损失主任务的同义段落。

Repetition **PASS**。

## 6. 合格计数预检（非 F 锁稿）

运行 V7 计数脚本并排除 `参考来源` 后，真实输出为 `mechanical_units=2704`、`meets_mechanical_floor=true`、正文原始 SHA-256=`6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`。

按同一脚本的 Markdown 抽取规则再扣除三行独立图注（140 个汉字）；图片 alt 在图片语法抽取时已移除；`参考来源` 已按 heading 排除。真实结果为：`qualified_units_excluding_captions_alt_sources=2564`，高于 2000。该数值是计数预检，不是 F 的淬文、NFC 锁稿或最终长度结论。

## 7. 实际命令、退出码与工具证据

以下为本轮实际执行的关键只读命令；未修改正文/媒体、未装配网站、未安装依赖、未构建、未部署、未提交、未推送、未处理密钥或外部写入。

| 命令/动作 | 退出码/结果 | 真实回读 |
| --- | ---: | --- |
| `sha256sum /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/*.svg` | 0 | 回读当前正文、manifest 和三张 SVG 的五个 hash，见第 0 节。 |
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md' --locale zh-CN --exclude-heading '参考来源'` | 0 | `mechanical_units=2704`、脚本报告 `sha256_nfc_lf` 与 raw 相同。 |
| Python 临时只读计数：导入上述计数函数，`extract_body(..., ['参考来源'])`，再过滤 `图 1/2/3` 图注 | 0 | 图注 3 行/140 汉字被扣除；图片 alt 已由 `inline_text` 移除；合格 `2564`。 |
| `rg -n -i 'research/|layout/|editorial/|任务卡|ReaderTask|D-zh|E-zh|F-zh|A-zh|B-zh|C-zh|canary|SERP|CTR|搜索排名|搜索量|cc=CN|内部路径|代理|agent|审核通过|写作者|协调者|研究日志|检索过程|搜索摘要|工作指令|任务指令' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md'` | 原始 rg=1（外层记录 0） | 无 ResearchTrace 污染命中。 |
| `rg -n -i '\bmodifier\b' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md'` | 0 | 仅 `body-zh.md:9` 首次定义命中 1 次。 |
| Node 只读 JSON/manifest resolver，解析 `media-zh.json` 并以 `pathBase=manifest-directory` 检查三条路径与 SVG width/height | 0 | 三条 `exists=true`；实际/声明尺寸分别为 390×1040、390×1160、390×1040，全部匹配。 |
| Node 只读正文图片 resolver，解析三条 `![](...)` 引用 | 0 | `imageReferenceCount=3`，三条 `../assets/zh/...` 均 `exists=true`。 |
| `for f in '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/'*.svg; do xmllint --noout "$f"; done` | 0（每个文件 0） | 三张中文 SVG 均 XML 可解析。 |
| Python `xml.etree.ElementTree` 只读语义探针，检查三张 SVG 的状态词、阶段向量、日期与“不是游戏内实测” | 0 | 三张 `missing=[]`、`pass=True`。 |
| `rg -n -i 'placeholder|占位|todo|coming soon|lorem|dummy|mock' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh'` | 原始 rg=1（无匹配） | 未发现占位/伪媒体字样。 |
| `ego-browser nodejs` 单一 TaskSpace `spaceId=49`，Page `p1` 逐一 `goto(file://...)` 三张本地 SVG，回读 `title`、`svg width/height`，随后 `task.finish({keep:[]})` | 0 | 三张本地 SVG 均实际加载；标题与尺寸见第 4.3 节；仅关闭本轮自己创建的浏览器任务空间。 |
| `git diff --no-index --check /dev/null '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/D-zh-r1.md'` | 1（新文件与 `/dev/null` 有内容差异；输出字节数 0） | 没有 whitespace error；新报告以未跟踪文件存在。 |

## 8. 文件清单、来源 URL 与交接

### 8.1 本轮实际写入文件

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/D-zh-r1.md`（本报告，唯一写入文件）。
- 未写入 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/src/`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/public/`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/package.json`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/AGENTS.md`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/WORKLOG.md` 或其他审核文件。

### 8.2 正文与媒体实际引用/依据 URL

- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Strawberry?oldid=192732
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175（正文第 96 行举例使用咖啡豆再生长 2 天；E 仍需独立检查正文近邻引用与来源清单是否需要补登记。）
- https://stardewvalleywiki.com/Farming?oldid=191914
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629

### 8.3 最终 D 交接

- 当前正文 hash：`6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`。
- 当前 media manifest hash：`4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5`；三张 SVG hash 见第 0 节。
- D-zh 三门：**ResearchTrace PASS / ReaderValue PASS / Repetition PASS**；D-zh-r1：**PASS**。
- M 视觉独立复验稍后执行；E、F、页面装配和用户终审不属于本任务，不能由本报告代签。
