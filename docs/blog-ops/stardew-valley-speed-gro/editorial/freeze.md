# F-Freeze 技术冻结记录

日期：2026-09-26（Asia/Shanghai）  
关键词：stardew valley speed gro；站点：https://stardewvalleyplanner.art；范围：中英文 content-only。  

## 结论

英文与中文均已完成技术冻结：当前正文、SEO、公开引用、媒体、PublicBlogHandoff 的字节和引用定位已由本轮直接回读并复算。D/E 正文门、E-SEO 两语言门和媒体独立复验均为 PASS；页面装配、网站浏览器验收和用户终审不在本任务范围内，不能称网站成品或用户已批准。

| 状态项 | 当前状态 | 证据 |
| --- | --- | --- |
| 英文 D/E 正文 | PASS | [D-en-r1](../reviews/D-en-r1.md)、[E-en-r1](../reviews/E-en-r1.md)；bodyHash=9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46 |
| 中文 D/E 正文 | PASS | [D-zh-r2](../reviews/D-zh-r2.md)、[E-zh-r2](../reviews/E-zh-r2.md)；bodyHash=a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2 |
| 英文 E-SEO | PASS | [E-SEO-en-r1](../reviews/E-SEO-en-r1.md)；修复后的 17 bindings 全部 occurrence=1 |
| 中文 E-SEO | PASS | [E-SEO-zh](../reviews/E-SEO-zh.md)；18 bindings 全部 occurrence=1 |
| 英文媒体 | PASS | [media-en-r1](../reviews/media-en-r1.md)、[binding](../reviews/media-en-r1-binding.md)；两张 SVG 与 PNG 绑定一致 |
| 中文媒体 | PASS | [media-zh-r1](../reviews/media-zh-r1.md)；三张 SVG 路径、尺寸、XML 与既有渲染证据一致 |

E-SEO-en.md 的旧 quote occurrence / provisional 合同 FAIL 已由 E-SEO-en-r1 与 F-en-handoff-r1 修复复验覆盖；本冻结依据新报告，不把旧失败当作当前内容失败。旧任务中标记 failed 的退役记录属于 superseded 元数据；P retained 是转移到 P-fix 后的幽灵记录，实际 terminal 资源已通过 P-fix release，以当前实际文件和资源状态为准。

## 正文锁定与计数

正文没有改写。每份 final body 与对应 drafts body 的 cmp -s 均退出 0；正文实际字节直接计算 SHA-256，均为 64 位小写十六进制。随包计数和独立合格计数如下：

| 语言 | 随包机械计数 | 独立合格计数 | 排除口径 |
| --- | ---: | ---: | --- |
| English | 2391 | 2283 | 去除 2 个完整 HTML figure（含 alt/caption） |
| 中文 | 2812；去来源后 2728 | 2588 | 去除“参考来源”、3 行图注（140 汉字）；alt=0 |

两个独立合格值均达到 required_floor=2000；合格计数不替代 D/E 的语义审核。

### 实际命令与退出码

| 命令 | 退出码 | 关键真实输出 |
| --- | ---: | --- |
| sed 读取 ego-browser 技能 | 0 | 已读取 `/Users/wusir/.mirasim/skills/ego-browser/SKILL.md`；本轮未创建新的浏览器 TaskSpace |
| cmp -s '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md'，以及同样方式核对 zh body 和 5 个 source/final SVG 配对 | 0（7 次） | 全部 CMP_EXIT=0 |
| shasum -a 256 读取绝对路径的 drafts、final body/SEO/refs/handoff、5 张 final SVG | 0 | 下方 hash 表为本轮直接输出 |
| python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md' --locale en | 0 | mechanical_units=2391；raw/NFC-LF hash 相同 |
| python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md' --locale zh-CN | 0 | mechanical_units=2812；raw/NFC-LF hash 相同 |
| 同一绝对路径命令增加 --exclude-heading '参考来源' | 0 | mechanical_units=2728 |
| python3 - 独立读取绝对路径 final body，移除 figure/source/caption/alt 后计数 | 0 | EN qualified_units=2283；ZH qualified_units=2588 |
| python3 - 独立读取绝对路径两个 final body 做 UTF-8/NFC/LF 检查 | 0 | utf8=PASS；nfc_equal=True；crlf=0；lone_cr=0；ends_lf=True |
| python3 -m json.tool 读取绝对路径的 6 个 JSON | 0（每个） | SEO、refs、handoff 均可解析 |
| xmllint --noout 读取绝对路径的 5 个 final SVG | 0（每个） | 五张 SVG 均可解析 |
| node --input-type=module 读取绝对路径 body/SEO/refs/handoff/assets 做合同探针 | 0 | EN quoteBindings=17/assets=2；ZH quoteBindings=18/assets=3；digest、body bytes、资源路径均 PASS |
| node --input-type=module 读取绝对路径两份 handoff 做公开边界探针 | 0 | 两份 handoff forbidden=0；无 AssemblyManifest |

cmp 逐项实际目标（均为完整绝对路径）：/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md ↔ /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md；/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md ↔ /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md；英文两张及中文三张 assets ↔ final/assets SVG 副本。7 个 cmp -s 退出码均为 0。

独立合格计数探针去除英文 figure 块两块；中文先排除参考来源，再移除 3 行图注，图片 alt 按抽取规则为 0。正文、图注、引用口径没有被手工改写。

## PublicBlogHandoff 冻结

新增 [英文 handoff](../final/en/handoff.json) 与 [中文 handoff](../final/zh/handoff.json)。两份 handoff 均按 V7 04 的公开字段冻结：body 是实际 UTF-8 Markdown 文本，顶层 bodyHash 与 body/refs 一致，seo 含 Title/H1/Description/slug，publicReferences 是实际数组，publicRequirements 资源路径相对各 handoff 目录可解析到 ../assets/en|zh/...，integrity 对除 integrity 外的全部顶层公开字段做确定性摘要。

| 语言 | bodyHash | quote bindings | 资源 | integrity 摘要 | 状态边界 |
| --- | --- | ---: | ---: | --- | --- |
| English | 9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46 | 17/17 | 2/2 | 4945e0b078399584011a8442568e325de125a742d87237c4f8e3ccaa699c63b5 | content-frozen；userApproval=pending；assembly=not-applicable-content-only |
| 中文 | a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2 | 18/18 | 3/3 | 639a248585f22b1a6e6a880a5af1ebdd70613f67f8fac34147e6b22d68a18ee0 | content-frozen；userApproval=pending；assembly=not-applicable-content-only |

相对路径、caption 和引用绑定均由程序按实际 body 读取。英文两条 caption 逐字来自 HTML figcaption，并保留其中的来源链接。中文三条 caption 逐字保持当前 body 的 Markdown 图注原文；中文 body 图注本身没有 URL，来源支持位于相邻正文与 publicReferences，未凭空扩充 caption。

### 冻结文件 SHA-256

| 文件 | SHA-256 |
| --- | --- |
| final/en/body.md | 9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46 |
| final/en/seo.json | 6955679ad6cc459203ff1528f9da2659cd7d500840e754487ebffa069036d155 |
| final/en/public-references.json | a27ce6e6a006fb2f56cab062a60774e5396aa74d72206343331a6aee3c776de5 |
| final/en/handoff.json | b9616a33ced3fb582dee1a7ca55375c6e394cdcd6d442b0ab806a39b39aa0a5d |
| final/assets/en/speed-gro-melon-stage-days.svg | 66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264 |
| final/assets/en/speed-gro-strawberry-regrowth-calendar.svg | c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5 |
| final/zh/body.md | a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2 |
| final/zh/seo.json | ac9cd98e6ab6fd1a7c51fa41f77c438cd21b3ef5ae2bec22123b3da7a21b13a2 |
| final/zh/public-references.json | f66c3471e57515c4ee804a111ab722dec4d27b2b45530278f4261ca2d713c2da |
| final/zh/handoff.json | 7f0a2a75d6b9c13fe676057c81088883669a127ac6bf950d78573586e48eff61 |
| final/assets/zh/speed-gro-application-flow.svg | 6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d |
| final/assets/zh/speed-gro-stage-comparison.svg | da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb |
| final/assets/zh/strawberry-harvest-timeline.svg | 43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da |

输入版本绑定（只读）：

| 文件 | SHA-256 |
| --- | --- |
| drafts/body-en.md | 9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46 |
| drafts/body-zh.md | a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2 |
| drafts/media-en.json | fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0 |
| drafts/media-zh.json | 4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5 |

provisional 历史索引未覆盖：final/en/handoff.provisional.json 当前 SHA-256 为 5a0260ef90bf871090909800a7935c5190771abb3f09ba95fcf01ad099198649；final/zh/handoff.provisional.json 当前 SHA-256 为 ca325cbc490f89bab345ac6044e314fa44baa8a601d365ef2229ab6bf3b715b1。

## 公开来源 URL

以下清单从当前 handoff.publicReferences 实际读取；它们是公开来源，不是内部证据快照。

### English

- [Stardew Valley 1.6.15 Patch on Steam](https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english)
- [Stardew Valley 1.6.15.1 Console Patch](https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/)
- [Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)
- [Deluxe Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196)
- [Hyper Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)
- [Stardew Valley 1.6 Update Full Changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)
- [Fertilizer - Stardew Valley Wiki](https://stardewvalleywiki.com/Fertilizer?oldid=194274)
- [Public decompiled HoeDirt implementation cross-check](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629)
- [Public decompiled Crop implementation context](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411)
- [Parsnip - Stardew Valley Wiki](https://stardewvalleywiki.com/Parsnip?oldid=191123)
- [Crop Growth Calendars - Stardew Valley Wiki](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875)
- [Melon - Stardew Valley Wiki](https://stardewvalleywiki.com/Melon?oldid=193510)
- [Strawberry - Stardew Valley Wiki](https://stardewvalleywiki.com/Strawberry?oldid=192732)

### 中文

- [生长激素 - 星露谷物语中文维基](https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0)
- [Stardew Valley 1.6.15 Patch on Steam](https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english)
- [Stardew Valley 1.6.15.1 Console Patch](https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/)
- [生长激素 - Stardew Valley 中文维基](https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0)
- [高级生长激素 - 星露谷物语中文维基](https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0)
- [Hyper Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377)
- [肥料 - Stardew Valley Wiki](https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99)
- [Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)
- [Deluxe Speed-Gro - Stardew Valley Wiki](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196)
- [Fertilizer - Stardew Valley Wiki](https://stardewvalleywiki.com/Fertilizer?oldid=194274)
- [Public 1.6 decompiled HoeDirt implementation cross-check](https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629)
- [Parsnip - Stardew Valley Wiki](https://stardewvalleywiki.com/Parsnip?oldid=191123)
- [Melon - Stardew Valley Wiki](https://stardewvalleywiki.com/Melon?oldid=193510)
- [Farming - Stardew Valley Wiki](https://stardewvalleywiki.com/Farming?oldid=191914)
- [草莓 - 星露谷物语中文维基](https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93)
- [Coffee Bean - Stardew Valley Wiki](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)
- [Crop Growth Calendars - Stardew Valley Wiki](https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875)

## 范围边界与编辑记录

| 项目 | 状态 | 说明 |
| --- | --- | --- |
| 内容技术冻结 | PASS | 中英文 handoff.json 已生成；provisional 文件保留为历史索引且未覆盖 |
| 公开引用 | PASS | EN 13 个 URL/17 bindings；ZH 17 个 URL/18 bindings；quote occurrence 与 bodyHash 一并冻结 |
| 实际媒体 | PASS | EN 2 张、ZH 3 张 final/assets 文件均存在；源资产与 final 副本 cmp=0；hash 已列出 |
| 页面装配 | 未执行（content-only） | 不写网站、不生成 AssemblyManifest、不做页面浏览器 QA |
| 用户终审 | 待审 | content-only 没有完整网站页面，不能记为通过 |
| 提交/推送/部署 | 未执行 | 本任务未做 commit、push、deploy 或外部写入 |
| 地区与隔离 | UNVERIFIED | US/CN 仅是记录值；真实地区 SERP、operations/OS 底层隔离未冒充全流程 PASS |
| research/reproducibility | 样本补足可重跑性 | 不代表恢复历史 SERP 或伪造地区搜索结果 |

没有新建浏览器任务空间，因此没有需要关闭的本轮浏览器资源；既有 media-en-r1/media-zh-r1 的 ego-browser 证据按其报告范围使用，不冒充本轮页面验收。未改 C 稿、SEO、资产、provisional、网站源码或规则文件。
