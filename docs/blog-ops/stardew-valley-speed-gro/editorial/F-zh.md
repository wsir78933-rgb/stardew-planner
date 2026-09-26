# F-zh 锁稿、标题与临时公开交接

核对日期：2026-09-26（Asia/Shanghai）  
角色：F-zh；范围：关键词 stardew valley speed gro、中文 zh-CN / CN、content-only。本站点 URL 仅作为公开 canonical 与标题上下文：<https://stardewvalleyplanner.art>。

本记录只生成中文 F 产物：逐字节锁定正文副本、SEO、公开引用、临时 PublicBlogHandoff 和编辑侧本报告；不装配网站，不修改 src、public、package.json、AGENTS.md、WORKLOG.md，不安装依赖，不提交、推送、部署，不处理密钥或外部写入。

## 结论与入场门槛

- D-zh-r2：ResearchTrace PASS、ReaderValue PASS、Repetition PASS；结论绑定当前正文 SHA-256。
- E-zh-r2：中文独立内容审核 PASS；其 22 条鉴文、事实、引用、图文组织与长度预检均绑定同一当前正文 hash。
- media-zh-r1：三张中文 SVG 的既有桌面/390px 浏览器渲染、媒体语义、manifest 解析与路径检查 PASS。
- E-zh-r2 重新核对媒体 manifest 与三张 SVG 未变，并把 media-zh-r1 的既有截图证据绑定到新正文；media-zh-r1 自身表中的旧正文 hash 不作为当前正文 hash。
- 因此允许进入 F 锁定与标题阶段；F 本轮不改写 C-zh-r2 正文。标题/SEO 尚未由独立 E 复核，所以本交接状态是 provisional-pending-independent-seo-review，不是最终 PASS。

当前输入材料的实际 hash（均由程序直接对实际字节计算，64 位小写十六进制）：

| 材料 | SHA-256 |
| --- | --- |
| /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md | a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2 |
| /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json | 4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5 |
| /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg | 6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d |
| /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg | da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb |
| /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg | 43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da |

## 正文逐字节锁定与媒体路径

源稿：/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md  
锁定稿：/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md

源稿与锁定稿均为 14071 bytes。cmp -s 退出码为 0；锁定稿 SHA-256 为 a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2。随包正文计数脚本的 sha256_raw 与 sha256_nfc_lf 相同，NFC/LF 规范化未改变字节，正文末尾保留 LF。

正文原有三条相对图片链接均未修改；从 final/zh/body.md 解析到 final/assets/zh/ 的同名 SVG 副本。每个副本与源资产的 cmp 退出码均为 0，实际 SVG hash 如下：

| 锁定资源 | 尺寸 | SHA-256 |
| --- | --- | --- |
| final/assets/zh/speed-gro-application-flow.svg | 390×1040 | 6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d |
| final/assets/zh/speed-gro-stage-comparison.svg | 390×1160 | da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb |
| final/assets/zh/strawberry-harvest-timeline.svg | 390×1040 | 43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da |

没有重新渲染浏览器；本轮只核对既有 media-zh-r1 / E-zh-r2 证据及实际 SVG 文件。正文链接、manifest 的三项资源路径和三张实际 SVG 均存在，三张锁定 SVG 的 xmllint 退出码均为 0。

## 长度门与独立合格计数

随包脚本的实际输出：

- python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py final/zh/body.md --locale zh-CN：退出码 0，mechanical_units=2812，required_floor=2000，meets_mechanical_floor=true。
- 同脚本增加 --exclude-heading 参考来源：退出码 0，mechanical_units=2728，meets_mechanical_floor=true。

独立合格计数命令退出码 0，结果为 qualified_units=2588，required_floor=2000，meets_floor=true；raw_sha256 与 nfc_lf_sha256 均为当前正文 hash。

独立计数明确排除范围：

- 排除“参考来源”标题及其来源清单章节，共 14 行；
- 正文使用 Markdown 图片语法，没有 HTML figure 块，因此 figure_blocks_excluded=0；
- 排除 3 行正文图注，共 140 个汉字；
- 图片 alt 在随包抽取器中按图片语法移除，alt_units=0；
- 随包脚本还不计标题、Markdown 分隔线、URL 和空行；保留普通段落、列表、数据表格单元格及必要方法说明。

2588 是 F 阶段的独立合格计数，超过 2000；它不替代 D/E 的语义审核。没有对 C 稿做任何规范化改写或内容补字。

## 正文承诺与禁止承诺

- 读者得到：先把 Speed-Gro 对应到中文“生长激素”，再在已锄地上判断播种前、播种后或成长中施用，并按作物阶段理解首次收获日期。
- 文章最强的可核验判断：10%/25%/33% 是成长速度修正值，不是把日历直接按同百分比削减；阶段长度与向上取整会让不同档位得到相同或不同的首次日期。
- 文章的具体信息增益：流程分支、Parsnip 与 Melon 阶段演算、春季第 13 日草莓首次收获/固定 4 天再生长时间线，且明确演算不是游戏内实测。
- 不能承诺：普适最佳档位、收益/ROI、所有作物固定节省天数、游戏实测、免费/最快/保证多一轮收获、站点已有 Speed-Gro 计算能力、地区排名或用户批准。

## 标题生成

### 先自由生成的 10 个候选

以下候选均围绕同一主意图，不把购买、配方、ROI 或规划器功能另加成第二主意图；描述只承诺当前正文已有内容。

| # | Title 候选 | Description 方向 |
| ---: | --- | --- |
| 1 | Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用 | 在已锄地上判断播种前、播种后或成长中何时施用，再按作物阶段演算首次收获日；草莓成熟后的再生长间隔不会因此缩短。 |
| 2 | 生长激素（Speed-Gro）怎么用？先看地块状态与首次收获 | 从已锄地和施用时机开始，区分首次成长、首次收获与多次收获作物的再生长边界。 |
| 3 | 为什么 Speed-Gro 的 10% 不是日历少 10%？ | 用成长阶段、阶段日数和公开规则演算首次收获，不把标称修正值直接当作日历折扣。 |
| 4 | Speed-Gro 三档怎么算：从 10% 到首次收获日期 | 比较三档标称修正值如何通过阶段分配影响 Parsnip、Melon 和草莓案例的首次日期。 |
| 5 | 春季第 13 日种草莓，Speed-Gro 能否赶上第三次收获？ | 在明确播种、浇水、季节和肥料前提下，对照首次收获与之后固定的 4 天再生长。 |
| 6 | 已经成熟的草莓还能用 Speed-Gro 缩短 4 天吗？ | 解释肥料作用在首次成长还是成熟后的再生长，并用草莓和咖啡豆边界避免误判。 |
| 7 | Stardew Valley Speed-Gro：按作物阶段判断何时施肥 | 先确认地块与施用时机，再用阶段数据判断第一次收获日期，保留换季与再生长限制。 |
| 8 | 别把 Speed-Gro 用成“每轮都加速”：首次收获与再生长 | 通过流程图、阶段例子和草莓日期线说明肥料改变哪一段时间，哪一段不变。 |
| 9 | 星露谷物语 Speed-Gro 施用时机：播种前、播种后还是成长中？ | 给出已锄地、播种前后和成长中的可执行判断，并说明已完成阶段不会被追回。 |
| 10 | Speed-Gro、Deluxe 还是 Hyper：先算日期再选档位 | 按作物阶段和首次收获日期看三档差异，不把更高档位写成普遍更值得。 |

### 归类、停留与适配筛选

| # | 标题机制 | 停留要素 / 人性驱动 | 适配检查与处置 |
| ---: | --- | --- | --- |
| 1 | 结论前置 | 异常、捷径；懒惰、傲慢 | “10%不等于固定少一天”直接击中正文 H2 的反差；施用方法和阶段演算完整给出；通过并选定。 |
| 2 | 结论前置 | 捷径；懒惰 | 直接回答怎么用，但问句与“主题后接功能清单”接近最近标题结构；淘汰。 |
| 3 | 自我颠覆 | 异常、冲突；傲慢、懒惰 | 正文能解释，但标题没有完整覆盖施用地块与时机；只保留为技术分支候选，淘汰。 |
| 4 | 结论前置 | 异常；懒惰 | 三档比较有正文依据，但“怎么算”易被理解为完整公式教程，且冒号结构偏近近期标题；淘汰。 |
| 5 | 反差数字 | 异常、终结；贪婪、懒惰 | 春 13 草莓是条件化案例，不应让标题承担普遍三熟承诺；范围过窄，淘汰。 |
| 6 | 悬念场景 | 冲突；傲慢 | 只覆盖成熟后再生长这一分支，不能代表全文主任务；淘汰。 |
| 7 | 结论前置 | 捷径；懒惰 | 内容准确但停留点泛，和“主题后接说明清单”的近期形式接近；淘汰。 |
| 8 | 自我颠覆 | 冲突；傲慢、懒惰 | “每轮都加速”由正文反例接住，但未自然保留 Stardew Valley 主关键词；淘汰。 |
| 9 | 悬念场景 | 冲突、捷径；懒惰 | 施用时机问题真实，但问句与最近标题套路相近；淘汰。 |
| 10 | 结论前置 | 捷径、冲突；懒惰 | 需要读者选择档位，容易把主任务扩成选型；且多项列举接近近期标题；淘汰。 |

七类人性驱动复核：最终标题只使用懒惰（希望少走弯路）与傲慢（把标称百分比直接当作日历折扣）对应的真实决策压力；没有借贪婪、嫉妒、愤怒、暴食或欲望编造收益、敌人、恐惧或保证。最终停留要素只有异常与捷径，均由正文事实接住。

### 最近 3 篇中文标题套路检查

依据已存在的站点上下文记录，只核对当时 live DOM 的标题，不读取旧文章正文：

| 公共 URL | 实际标题 |
| --- | --- |
| https://stardewvalleyplanner.art/zh/carpenter-stardew | 星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级 |
| https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley | 罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程 |
| https://stardewvalleyplanner.art/zh/fall-crops-stardew | 星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊 |

观察到的形式是“主题后接冒号和功能清单”“问句后接功能清单”及数字/价格钩子。候选 1 虽使用冒号，但冒号后是一个由正文明确支持的反差判断和操作问题，不是功能清单、问句清单或收益数字；它保留自然主关键词，不写最佳、最快、实测或收益。

### 最终选定表面与两道检查

- Title：Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用
- H1：Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用
- Description：在已锄地上判断播种前、播种后或成长中何时施用，再按作物阶段演算首次收获日；草莓成熟后的再生长间隔不会因此缩短。

停留检查：PASS（待 E 复核）。目标读者会因“标称 10% 不等于固定少一天”的具体信息差停留，正文 H2“为什么 10% 不等于固定少一天”、阶段算法和 Parsnip/Melon 例子兑现该判断。

适配检查：PASS（待 E 复核）。10% 与“固定少一天”由正文第 1、9、41–51 行支持；“生长激素怎么用”由第 19–39、91–97 行支持；施用时机、地块前提、首次成长和再生长边界均已写出；情绪没有超过正文。

## Title / H1 / Description 承诺映射

| 表面承诺 | 正文实际兑现 | 公开引用/媒体对应 |
| --- | --- | --- |
| Stardew Valley Speed-Gro / 生长激素 | 第 1、7、17 行把 Speed-Gro 与中文术语对上，并列出三档识别；施用判断在第 19–39 行。 | 术语桥接、中文生长激素页、三档页面。 |
| 10%不等于固定少一天 | 第 1、9、41–51 行解释 modifier、阶段向量、向上取整和阶段分配；不是固定日数承诺。 | 中文生长激素页、HoeDirt decompiled snapshot、Parsnip/Melon/Farming 页面；图 2 为演算图。 |
| 生长激素怎么用 | 第 19–39、91–97 行给已锄地、播种前后、成长中、已成熟等待再生长的分支与三问检查；图 1 对应流程。 | 肥料机制、Speed-Gro/Deluxe/Hyper 固定页面；图 1。 |
| 首次收获日与再生长边界 | 第 41–89 行给 Parsnip、Melon 和春 13 草莓日期；第 96 行明确草莓 4 天与咖啡豆 2 天的再生长间隔。 | 作物页面、Farming、Crop Growth Calendars、Coffee Bean；图 2/图 3。 |

SEO JSON 只含 Title、H1、Description、slug 和 countryVerification=UNVERIFIED，不加入作者、日期、实测、排名、收益或工具能力主张。

## 公开引用与正文定位

final/zh/public-references.json 绑定 bodyHash a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2，包含 17 个唯一公开 URL 和 18 个 quote/occurrence 定位。定位验证按 NFC 正文中每个完整 quote 的 1-based 出现次数执行，quote 均包含实际规则、数字、算法、日期或边界主张；没有只截来源清单的 quote。

来源 URL 清单：

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0（10%/20%、术语与生长规则）
- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english（1.6.15 PC/Steam 版本边界）
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/（1.6.15.1 主机版本边界）
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0（Speed-Gro 与中文术语桥接）
- https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0（高级档 25%/35%）
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377（顶级档 33%/43%）
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99（一格一种肥料的限制）
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630（Speed-Gro 施用时机）
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196（Deluxe 施用时机）
- https://stardewvalleywiki.com/Fertilizer?oldid=194274（换季保留与再生长边界）
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629（阶段日数、向上取整与阶段扣减交叉证据）
- https://stardewvalleywiki.com/Parsnip?oldid=191123（Parsnip 阶段示例）
- https://stardewvalleywiki.com/Melon?oldid=193510（Melon 阶段示例）
- https://stardewvalleywiki.com/Farming?oldid=191914（农业学家修正值）
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93（草莓成长、再生长和条件案例）
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175（咖啡豆再生长边界）
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875（阶段与日期演算约定）

## 临时公开交接状态

final/zh/handoff.provisional.json 内嵌实际 UTF-8 Markdown 正文，顶层 bodyHash=a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2，seo 为实际 Title/H1/Description/slug，publicReferences 为完整数组而不是路径索引。publicRequirements 的三条资源路径均为相对 handoff 目录可解析的 ../assets/zh/*.svg，caption 逐字抽取正文图注而非 manifest 摘要。
integrity.publicFieldsHash=3d3eed81f30b544e57fd672a121a205f3cdd14cc4b5282ca14eed38e5e161e6d；算法为 SHA-256，输入是除 integrity 外全部顶层公开字段的 UTF-8 确定性 JSON（对象键递归排序、数组顺序保留、无空白）。三张媒体 hash 直接来自 final/assets/zh/ 实际文件。

- status=provisional-pending-independent-seo-review
- userApproval=pending
- assembly=not-applicable
- locale=zh-CN、country=CN，但 CN 地区隔离仍为 UNVERIFIED；OS/底层权限隔离也为 UNVERIFIED。
- 本任务没有新建 ego-browser TaskSpace，没有重复联网、浏览器页面验收或网站装配；既有媒体浏览器证据不冒充本轮新执行。

## 实际命令、退出码与范围

| 命令/动作 | 退出码 | 关键实际输出 |
| --- | ---: | --- |
| 读取 ego-browser 技能、执行入口、01、02、04、事实/标题/七罪规则及 D/E/M 报告 | 0 | 规则、角色门槛和来源边界已读取。 |
| 复制 drafts/body-zh.md 与三张 assets/zh SVG 到 final；四次 cmp -s | 0；0；0；0；0 | 正文和媒体副本逐字节相同。 |
| 正文计数.py final/zh/body.md --locale zh-CN | 0 | mechanical_units=2812；raw/NFC-LF hash=current body hash。 |
| 正文计数.py 加 --exclude-heading 参考来源 | 0 | mechanical_units=2728。 |
| 独立 Python 合格计数 | 0 | source heading excluded；figure=0；caption lines=3 / 140 汉字；alt=0；qualified_units=2588。 |
| JSON / quote / occurrence / bodyHash / asset resolver | 0 | 17 URLs、18 quote bindings、三条资源可解析、caption=body exact。 |
| python3 -m json.tool 对 SEO、public references、handoff | 0 | 三个 JSON 均可解析。 |
| xmllint --noout final/assets/zh/*.svg | 0 | 三张 SVG 均可解析。 |
| file final/assets/zh/*.svg | 0 | 三个文件均识别为 SVG Scalable Vector Graphics image。 |
| SHA-256 对最终正文、SEO、引用、handoff、三张 SVG | 0 | 所有 hash 均由程序直算，64 位小写十六进制。 |

未运行 build、typecheck、lint 或站点浏览器 QA，因为本任务是 content-only，且明确禁止网站装配；这些命令不能替代本次交付的正文/引用/媒体证据。

## 本轮文件清单

- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/seo.json
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/public-references.json
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/handoff.provisional.json
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-application-flow.svg
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-stage-comparison.svg
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/strawberry-harvest-timeline.svg
- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md

以上交付是待独立 SEO 审核的临时公开交接，不是最终 SEO PASS、网站成品、用户终审通过或生产发布。
