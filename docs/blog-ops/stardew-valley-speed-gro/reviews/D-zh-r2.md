# D-zh 独立全量三门复验（第 2 轮）

## 结论与版本边界

- 日期：2026-09-26（Asia/Shanghai）；角色：D-zh；模式：`content-only`。
- 本轮独立重读当前中文 `body-zh.md`、`media-zh.json`、`layout/zh.md`、`research/zh.md` 及中文证据文件，并读取 `editorial/C-zh-r2.md` 的差异记录与 `reviews/media-zh-r1.md` 的 SVG→PNG 绑定记录；未读取英文稿，未重跑浏览器或研究。
- 三门结论：**ResearchTrace PASS / ReaderValue PASS / Repetition PASS**。
- 结论绑定当前正文 SHA-256 `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`，并绑定未改动的 manifest 与三张中文 SVG hash（见第 5 节）。这是内容层 D-zh 复验，不是网站装配、用户终审或 F 锁稿通过。

## C-zh-r2 差异核对

`editorial/C-zh-r2.md` 声明的改动与当前正文实际一致：`body-zh.md:1` 为“加速 10%”补近邻中文来源，`:27` 为三档施用时机各补固定页面，`:96` 为 Coffee Bean 的 2 天补近邻来源，来源清单再登记该 Coffee Bean URL。当前正文的事实、日期、图位和媒体文件未因这些链接修订而变化；新链接均能在当前正文/来源清单中回读。

## 三门独立复验

### ResearchTrace：PASS

- `body-zh.md:1-3` 只给读者直接答案、版本条件和公开版本链接；`:5-17` 给术语、档位和公开来源；`:41-70` 将固定提交明确为 decompiled 交叉证据，并明确“不是开发者发布的官方源代码，也不是本次运行游戏实测”；`:99-113` 是读者可访问的来源清单。
- 全文未发现研究路径、任务卡、Agent/审核回执、SERP/排名、`cc=CN`、内部工作指令或检索日志。内部过程探针 `rg -n -i 'research/|layout/|editorial/|ReaderTask|D-zh|E-zh|F-zh|A-zh|B-zh|C-zh|canary|SERP|CTR|搜索排名|搜索量|cc=CN|内部路径|代理|agent|审核通过|写作者|协调者|研究日志|检索过程|搜索摘要|工作指令|任务指令|占位|placeholder|todo|lorem|dummy|mock' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md'` 原始退出码为 `1`，无匹配。
- “公开 decompiled snapshot”“日期演算”“非游戏内实测”是帮助读者理解证据边界的必要方法说明，不是内部研究痕迹；新增引用只补近邻支持，没有把检索过程写入正文。

### ReaderValue：PASS

- `research/zh.md:40-43` 的已读中文搜索材料支持“Speed-Gro/生长激素术语桥接、怎么用、草莓日期案例”信号；其 Google/地区参数限制没有被升级成正文结论。`layout/zh.md:17-32` 的唯一 ReaderTask 是在已锄地上正确施用并判断首次收获/再生长边界。
- 当前正文逐项兑现任务：开头 `body-zh.md:1-3` 给名称、地块、时机和作用边界；`:5-17` 区分 10%/25%/33% 标称修正值；`:19-39` 给已锄地、播种前后、成长中、成熟后再生长分支；`:41-70` 用阶段向量、向上取整、Parsnip/Melon 示例判断首次日期；`:72-89` 用有完整前提的春季第 13 日草莓时间线；`:91-97` 收束为三问检查。正文未扩展购买、配方路线、ROI 或规划器未核验功能。
- 当前 Node 只读解析输出 `manifest_parse=PASS`、`body_image_reference_count=3`、三条 body 相对路径均 `exists=true`、三条 manifest 路径均 `exists=true`、声明/实际尺寸均匹配（390×1040、390×1160、390×1040）、`asset_sets_match=true`。因此三张实际图仍落在正文对应图位，不是占位符。
- M-zh-r1 的绑定关系被保留且当前 PNG 文件存在：`speed-gro-application-flow.svg`→`zh-flow-desktop.png`/`zh-flow-narrow.png`；`speed-gro-stage-comparison.svg`→`zh-stage-desktop.png`/`zh-stage-narrow.png`；`strawberry-harvest-timeline.svg`→`zh-strawberry-desktop.png`/`zh-strawberry-narrow.png`。本轮只核对该既有绑定和 `file` 输出，不重新渲染浏览器。

### Repetition：PASS

- 当前正文各段承担不同读者动作：`:1-3` 直接答案与版本边界，`:5-17` 术语/档位识别，`:19-39` 状态分支，`:41-70` 阶段计算方法与两个长度例子，`:72-89` 草莓条件案例和误读检查，`:91-97` 最终三问；没有把一个作用拆成重复的平行段落。
- 只读精确重复行检查退出码 `0`，输出 `exact_duplicate_line_count=0`（排除标题、图注、来源清单、空行和 Markdown 图片语法）。日期表、图 3 图注和末尾误读检查共享事实但作用分别是快速核对、图片可访问说明和判断动作，不是同一段重复。
- C-zh-r2 增加的是上述近邻 URL，不增加第二份事实解释或新的主任务；因此引用修订未引入重复簇。

## 计数与文本规范化（分层报告）

| 口径 | 结果 | 实际依据 |
|---|---:|---|
| V7 机械值（含来源清单、三行图注；图片 alt 按脚本规则移除） | `2812` | `正文计数.py --locale zh-CN`，退出码 `0` |
| 排除 `参考来源` 后机械值 | `2728` | 同脚本加 `--exclude-heading '参考来源'`，退出码 `0` |
| 去除来源、三行图注、alt 后合格预检 | `2588` | `2728 - 140`；图注 `3` 行/`140` 汉字，抽取正文中的 alt `0`，临时只读计数退出码 `0` |

三种数字分开记录；`2588` 只是 D 阶段合格预检，不代替 F 的淬文/锁稿长度门。V7 两次输出的 raw 与 NFC/LF hash 均为当前正文 hash。

当前五个绑定文件均为 UTF-8 NFC、LF：`body-zh.md` 113 个 LF；`media-zh.json` 71 个 LF；三张 SVG 分别 64、68、61 个 LF；均 `crlf=0`、`lone_cr=0`、`ends_lf=true`，raw hash 与 NFC/LF hash 相同。

## 当前 hash 与媒体绑定

| 文件 | 当前 SHA-256 |
|---|---|
| `drafts/body-zh.md` | `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2` |
| `drafts/media-zh.json` | `4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5` |
| `assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| `assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| `assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |

## 实际命令、退出码与边界

- `nl -ba '/Users/wusir/Desktop/博客-V7修订版/执行入口.md'`、`nl -ba '/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md'`、`nl -ba '/Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md'`、`nl -ba '/Users/wusir/Desktop/博客-V7修订版/02-内容生产与质量门.md'`、`nl -ba '/Users/wusir/.mirasim/skills/ego-browser/SKILL.md'`：均退出码 `0`；本轮未创建浏览器 TaskSpace。
- `shasum -a 256 '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg'`：退出码 `0`，hash 见上表；Python UTF-8/NFC/LF 实际字节检查：退出码 `0`。
- `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md' --locale zh-CN`：退出码 `0`，`mechanical_units=2812`；同命令加 `--exclude-heading '参考来源'`：退出码 `0`，`mechanical_units=2728`。
- 只读 Python 导入 `extract_body`/`count_units`，传入 `['参考来源']` 后过滤 `图 1/2/3` 图注：退出码 `0`，`caption_lines_removed=3`、`caption_units_removed=140`、`alt_units_in_extracted_body=0`、合格 `2588`。
- Node 只读 JSON/manifest/body 图片 resolver：退出码 `0`，三条图片引用、三条 manifest asset、路径存在、三组尺寸和 asset set 均 PASS。
- `for f in '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg'; do xmllint --noout "$f"; done`：三个文件均退出码 `0`；`file '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-flow-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-flow-narrow.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-stage-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-stage-narrow.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-strawberry-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-zh-r1/zh-strawberry-narrow.png'`：退出码 `0`，六个文件均为 PNG，尺寸与 M-zh-r1 绑定记录一致。
- ResearchTrace `rg` 探针原始退出码 `1`（无匹配）；精确重复行 Python 检查退出码 `0`，`exact_duplicate_line_count=0`。
- 未运行浏览器、未重复研究、未装配网站、未修改正文/manifest/SVG/英文稿/源码/依赖/规则文件，未处理密钥、提交、推送、部署或外部写入。

## 来源 URL

本轮沿用当前正文/研究文件已经定位的公开来源，没有新增研究事实：

- <https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0>
- <https://stardewvalleywiki.com/Speed-Gro?oldid=190630>
- <https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196>
- <https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377>
- <https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99>
- <https://stardewvalleywiki.com/Parsnip?oldid=191123>
- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://stardewvalleywiki.com/Coffee_Bean?oldid=193175>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english>
- <https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/>

## 文件清单与最终边界

- 本轮唯一新增文件：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/D-zh-r2.md`。
- 当前 body、manifest、三张 SVG、布局、研究、媒体证据和旧报告均只读；三门 PASS 仅绑定本报告列出的当前正文与媒体 hash，不代签 E、F、网站页面或用户终审。
