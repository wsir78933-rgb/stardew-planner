# E-zh 独立复验（中文第 2 轮）

## 结论与版本边界

**E-zh 内容审核：PASS。** 本结论绑定当前正文的实际 SHA-256
`a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；前置
D-zh-r2 的 ResearchTrace、ReaderValue、Repetition 三门均以同一 hash 报告
PASS。当前正文没有新的事实、算法、日期或媒体含义变更；第 1 轮指出的
E-ZH-REF-01、E-ZH-REF-02 以及三档施用时机的近邻引用缺口均已在当前文件中
直接回读并由既有来源证据支持。

本报告只覆盖 content-only 的独立内容审核，不代表 F 锁稿、SEOTruth、网站
装配、页面审核、部署或用户终审。SEO、用户终审、页面状态、地区 SERP 精确
隔离和 OS 权限隔离均保持 UNVERIFIED；content-only 下页面装配为 N/A。没有
新建 ego-browser TaskSpace，本轮没有把旧 M-zh-r1 截图冒充新的浏览器执行。

## 独立输入与复验范围

我完整读取了旧 `reviews/E-zh.md` 的 22 条/八层记录、`editorial/C-zh-r2.md`
的局部差异、`reviews/D-zh-r2.md`，随后直接读取当前
`drafts/body-zh.md`、`drafts/media-zh.json`、三张中文 SVG、
`research/facts.md`、`research/facts-evidence/source-extracts.md` 和
`research/zh-evidence/source-pages-2026-09-26.md`。旧 E 的浏览器访问记录只作
来源可读性与原始访问事实的输入；本轮没有因材料充足而重复联网，也没有用旧
报告代替当前正文、当前 hash 或当前引用的回读。

## 当前引用修订的独立核对

| 受影响位置 | 当前正文实际证据 | 来源事实与结论 |
| --- | --- | --- |
| `body-zh.md:1`，E-ZH-REF-02 | “加速 10%”后紧邻 [生长激素中文条目](https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0)。 | `source-pages-2026-09-26.md` 的 ZH-F01 直接记录该页“加快作物生长速度 10%”；该近邻引用已修复，主张与来源匹配。 |
| `body-zh.md:27`，三档施用时机 | 同一句直接列出 [Speed-Gro 固定页](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)、[Deluxe Speed-Gro 固定页](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196) 和 [Hyper Speed-Gro 固定页](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)。 | `source-extracts.md` 逐项记录三页均支持播种前、播种后或成长中施用；“三种”不再由单一档位链接代称。 |
| `body-zh.md:96`，E-ZH-REF-01 | “咖啡豆成熟后的 2 天”紧邻 [Coffee Bean 固定页](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)，且 `body-zh.md:104` 的参考来源清单登记了同一 URL。 | `source-extracts.md` 的 Coffee Bean 记录为成长 10 天、再生长 2 天；旧 E 的实际访问记录也读到该固定页的 `Regrowth: 2 Days`。 |

上述是本轮唯一受影响的正文主张集合：C-zh-r2 标出的 `:1`、`:27`、`:96`
和来源清单 `:104` 均在当前文件中逐行复核；增加的是已有事实的公开近邻链接，
没有增加数字、算法、日期、产品能力或实测承诺。当前 body 中的 17 个公开 URL
均可在 `facts.md`、`facts-evidence/source-extracts.md`、中文来源核验记录或旧 E
实际访问记录中找到；没有把 Google/Bing 摘要、地区参数或搜索排名当作事实来源。

## D 版本、媒体绑定与当前 hash

独立只读回读确认 D 报告声明的正文 hash 与当前实际文件相同：

```text
current_body_sha=a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2
D_report_body_sha=a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2
D_same_current_hash=True
D_three_gates=True
```

当前材料与旧 M-zh-r1 记录的 manifest、三张 SVG hash 完全相同，因此旧 M 的真实
几何和六张实际截图可以绑定到本正文的新 hash；这是**复用既有 M 浏览器证据**，
不是本轮新浏览器执行。当前正文的三条图注仍在 `body-zh.md:37,68,87`，三条
图片链接、manifest 的 `pathBase`、三张 SVG 的尺寸和 `is_screenshot=false`
均直接回读通过。

| 实际文件 | 当前 SHA-256 |
| --- | --- |
| `drafts/body-zh.md` | `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2` |
| `drafts/media-zh.json` | `4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5` |
| `assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| `assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| `assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |
| `reviews/media-evidence-zh-r1/zh-flow-desktop.png` | `2260fe5fa23ab95809dac04e8c269ed3c6a9547d80653aed66f6c1a89b23e619` |
| `reviews/media-evidence-zh-r1/zh-flow-narrow.png` | `91d1b1a264e4339038fafb1d1ca64c86044fa9bd1e382be674a2b8907deaa39a` |
| `reviews/media-evidence-zh-r1/zh-stage-desktop.png` | `bccb8ce3739edecf3a27e9cbd7e59510b352fd0ff6f794833797404d7425fdb4` |
| `reviews/media-evidence-zh-r1/zh-stage-narrow.png` | `0b37814c50b4aaa3b8899c257c5ea0597701a55df4ca48a6b0011ae957622778` |
| `reviews/media-evidence-zh-r1/zh-strawberry-desktop.png` | `7e4fa3c1590a5f4ed0e216daba111ab8b067b1ab134753a4a08968621cb582c1` |
| `reviews/media-evidence-zh-r1/zh-strawberry-narrow.png` | `d8f8af3b4f2709d5ba67465f5f0d7ab713add04103b877fa65d115fb8459711a` |

M-zh-r1 的实际几何证据为：flow `390×1040`、stage `390×1160`、strawberry
`390×1040`；桌面截图为 `1440×1040/1160/1040`，窄屏截图为
`390×1040/1160/1040`。M 报告已记录窄屏 `scrollWidth=clientWidth=390`、无
可见重叠/裁切及最小计算字号 14px；本轮只重新计算现有 PNG 的 SHA-256，不将
这些 hash 说成新截图。

## 22 条鉴文规则（全部绑定当前正文 hash）

本轮逐项重读当前正文；C-r2 的链接补充没有改变任何修辞、结构或真实性判断，
因此 22 项均维持“未命中”。“未命中”是该条所描述问题不存在，不是跳过审核。

| # | 当前判断 | 绑定当前正文的独立理由 |
| ---: | --- | --- |
| 1 | 未命中（维持） | 保留的反例只处理地块、施用时机、再生长和换季等会改变操作的条件。 |
| 2 | 未命中（维持） | 内容仍聚焦 Speed-Gro 识别、施用、首次收获和必要演算；未加入购买、ROI 或规划器功能。 |
| 3 | 未命中（维持） | 档位表和阶段表是必要比较；周围解释、分支、案例和三问句式不同。 |
| 4 | 未命中（维持） | 没有重复套用“虽然……但是……”模板。 |
| 5 | 未命中（维持） | `生长激素`、`Speed-Gro`、Deluxe、Hyper、首次成长和再生长用词稳定。 |
| 6 | 未命中（维持） | 没有个人经历或编排情绪曲线。 |
| 7 | 未命中（维持） | “容易混淆”后紧跟可核对规则，没有虚构“大家都以为”。 |
| 8 | 未命中（维持） | “不是/而不是”分散承担术语、算法、实测边界和再生长区分，不是同一模板密集堆叠。 |
| 9 | 未命中（维持） | 已核事实直接陈述，条件化日期明确写为演算；没有人为制造不确定。 |
| 10 | 未命中（维持） | 10/25/33%、日期和 4/2 天均有来源或可复算前提；没有性能或成功率伪精确。 |
| 11 | 未命中（维持） | 没有“我也曾失败”等只服务论点的脆弱故事。 |
| 12 | 未命中（维持） | 步骤前置条件、已完成阶段不追溯和首次/再生长分支均保留。 |
| 13 | 未命中（维持） | 段落以动作、边界或计算结论结束，没有连续金句升华。 |
| 14 | 未命中（维持） | 表格、说明、案例和检查列表节奏不同；没有随机拆句伪造真人感。 |
| 15 | 未命中（维持） | 判断依赖来源、阶段数据、代码交叉证据和条件化演算，不靠感受。 |
| 16 | 未命中（维持） | 开头直接给名称、地块、时机和首次/再生长边界。 |
| 17 | 未命中（维持） | 连接词没有形成无功能的密集填充。 |
| 18 | 未命中（维持） | 同一物品与作用边界没有刻意改换多个名称。 |
| 19 | 未命中（维持） | 中文说明自然；英文物品名和 decompiled 是检索/证据所需术语。 |
| 20 | 未命中（维持） | Parsnip、Melon、Strawberry 都明确是有前提的公开数据演算，不冒充实战。 |
| 21 | 未命中（维持） | 结尾是三问检查，不是祝福或泛泛积极口号。 |
| 22 | 未命中（维持） | 全文没有从施用和日期判断突然上升到宏大命题。 |

### 六类形式指纹

当前正文直接扫描结果：破折号 `0`；粗体 span `4`（表头定义和三问，均有
功能）；ASCII 装饰线 `0`；助手残留 `0`；填充短语 `0`；泛泛积极结尾 `0`。
因此六类形式指纹均 PASS。

## 八层结论与剩余状态

| 层 | 当前结论 | 依据/边界 |
| --- | --- | --- |
| 1. 22 条规则与六类指纹 | PASS | 上述 22 项均未命中，当前 hash 绑定；形式扫描无问题。 |
| 2. 事实、版本、因果、引用 | PASS | 受影响 10%/三档时机/Coffee Bean 2 天已逐项近邻核对；未发现新事实错误。 |
| 3. 有效限制、反例、不确定 | PASS | 已过阶段不追溯、再生长不缩短、季节/地点/浇水前提和 decompiled 非官方边界均保留。 |
| 4. ReaderValue 与信息增益 | PASS | 当前正文仍能完成已锄地施用、首次日期判断和再生长区分，未扩成多意图百科。 |
| 5. 图文组织与图解准确性 | PASS | manifest、三 SVG、正文三图引用与 M-zh-r1 的实际几何/截图证据绑定；无新媒体变化。 |
| 6. ResearchTrace/真实性 | PASS | 当前正文无研究路径、任务卡、角色回执、SERP 或未做实测的声明。 |
| 7. 结构、重复、长度预检 | PASS | 精确重复行 `0`；当前合格预检 `2588`，高于 2000；F 仍未锁稿。 |
| 8. 用户终审 | UNVERIFIED | content-only、未装配网站，用户尚未审阅完整页面。 |

附加状态：SEOTruth/Title/H1/Description 未审；页面装配和页面 N/A（本任务明确
content-only）；地区精确 SERP 与 geo 隔离 UNVERIFIED；OS/底层读权限隔离
UNVERIFIED，仅有任务边界约束；F 锁稿未执行。

## NFC/LF 与计数口径

V7 计数脚本的真实输出为：

```text
无排除：mechanical_units=2812，required_floor=2000，meets_mechanical_floor=true
排除 heading “参考来源”：mechanical_units=2728，required_floor=2000，meets_mechanical_floor=true
```

随后用同一脚本的 `extract_body(raw_text, ['参考来源'])` 和 `count_units` 做只读
预检：`source_excluded_mechanical_units=2728`、去掉 3 行图注共 `140` 个汉字、
图片 alt `0`、`qualified_units_excluding_captions_alt_sources=2588`、
`qualified_meets_floor=True`。

当前参数与旧数字的关系必须分开：旧 E-zh 的机械 `2782` 是前一正文 hash
`6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4` 的 V7
无 `--exclude-heading` 结果，包含参考来源清单和三行图注；D-zh-r1 的 `2704`
是同一前一版本使用 `--exclude-heading '参考来源'`、仍包含三行图注的结果。它们
不是同一排除范围，也不是当前版本。当前 2588 的参数是：排除 `参考来源`，再
排除三行独立图注，alt 由 `inline_text()` 在正文抽取阶段移除；不排除正文段落、
列表或数据表格。

直接字节规范化检查（UTF-8 解码、NFC、CRLF/LF 统计）输出如下；raw 与
NFC/LF hash 均相同，且没有 CRLF 或 lone CR：

| 文件 | bytes | LF | CRLF | lone CR | ends LF | raw/NFC-LF 相同 |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `body-zh.md` | 14071 | 113 | 0 | 0 | true | true |
| `media-zh.json` | 3501 | 71 | 0 | 0 | true | true |
| `speed-gro-application-flow.svg` | 5396 | 64 | 0 | 0 | true | true |
| `speed-gro-stage-comparison.svg` | 9660 | 68 | 0 | 0 | true | true |
| `strawberry-harvest-timeline.svg` | 5557 | 61 | 0 | 0 | true | true |

D-zh-r2 报告写有 `ends_lf=true`，本轮用最后一个字节整数值（五个文件均为
`10`）及 `raw.endswith(bytes([10]))` 直接复核，结果同样为 `ends_lf=true`；此前
一条自检表达式把字面量反斜杠-n 当成了目标，已在本报告更正。五个文件使用
LF 分隔且无 CRLF/lone CR，raw 与 NFC/LF hash 相同。

## 实际命令、退出码与关键输出

以下命令均在本轮实际执行；规则文件、技能文件、旧 E/C/D/M 报告和当前来源材料
的 `sed -n` 读取均退出 `0`。

| 命令/动作 | 退出码 | 关键真实输出 |
| --- | ---: | --- |
| `shasum -a 256` 对正文、manifest、3 SVG、6 张 M-zh-r1 PNG | 0 | 输出本报告 hash 表中的 11 个 64 位十六进制 SHA-256。 |
| Python UTF-8/NFC/LF 字节检查 + 最后字节 `od -An -t u1` 复核 | 0 | 5 个文本文件 `nfc_equal=true`、`crlf=0`、`lone_cr=0`、`ends_lf=true`；最后字节均为 `10`。 |
| Python body/manifest/SVG resolver + `xmllint --noout` 三文件 | 0 | `body_image_reference_count=3`、`manifest_asset_count=3`、`caption_count=3`；三条路径存在，尺寸 390×1040/390×1160/390×1040，全部 XML 可解析。 |
| Python 受影响引用定位检查 | 0 | `E-ZH-REF-01_body_near=PASS`、`E-ZH-REF-01_registry=PASS`、`E-ZH-REF-02_body_near=PASS`、`three_tier_speed=PASS`、`three_tier_evidence=PASS`。 |
| `python3 .../正文计数.py ... --locale zh-CN` | 0 | `mechanical_units=2812`，raw/NFC-LF hash 为当前正文 hash。 |
| 同脚本加 `--exclude-heading '参考来源'` | 0 | `mechanical_units=2728`、`excluded_heading_sections=["参考来源"]`。 |
| Python `extract_body`/`count_units` 合格预检 | 0 | 图注 3 行/140 汉字、alt 0、合格 `2588`。 |
| ResearchTrace `rg` 探针 | 原始 1 | 无命中；`1` 表示没有污染匹配。 |
| 精确重复行 Python 检查 | 0 | `exact_duplicate_line_count=0`。 |
| D hash/三门只读比对 | 0 | `D_same_current_hash=True`、`D_three_gates=True`。 |
| 当前 manifest/3 SVG hash 与 M-zh-r1 记录比对 | 0 | `M_media_manifest_svg_hash_binding=PASS`；四个 hash 均 unchanged。 |
| `file` 检查 6 张 PNG | 0 | 六张均为 PNG；桌面/窄屏尺寸与 M-zh-r1 记录一致。 |

没有运行新浏览器、没有网站装配、没有构建/部署、没有安装依赖、没有外部写入、
没有处理密钥，也没有修改正文、manifest、SVG、截图、源码、规则或 WORKLOG。

## 来源 URL

本轮受影响或直接支撑复验的公开 URL：

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://stardewvalleywiki.com/Strawberry?oldid=192732
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Farming?oldid=191914
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/

## 文件清单与结算边界

本轮唯一新增文件：

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/E-zh-r2.md`

本轮未修改任何输入材料。结论仅绑定当前正文 hash、当前事实/引用回读和既有
M 媒体证据；不得沿用到后续正文、图注、媒体或 SEO 改动后的版本。
