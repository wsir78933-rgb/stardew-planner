# E-SEO-zh 独立标题、SEO 与公开引用核对

核对日期：2026-09-26（Asia/Shanghai）  
角色：E-SEO-zh；范围：`stardew valley speed gro`、`zh-CN / CN`、content-only。  
结论绑定：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md` SHA-256 `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`。

## 结论

| 项目 | 结论 | 独立证据 |
| --- | --- | --- |
| Title / H1 | PASS | 两者逐字相同：`Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用`；正文第 1、41、43–70、91–97 行分别兑现反差判断与施用判断。 |
| Description | PASS | `已锄地`对应正文第 1、23、27、95 行的“已经锄好的土地/空地”；播种前、后、成长中、首次收获日和再生长边界见第 27、41–89、95–97 行。 |
| 10 个候选与七罪筛选 | PASS | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md:71-101` 先列 10 个自由候选，再逐项归类、停留要素、适配处置；未把候选生成当成用户选择。 |
| 最近 3 篇中文标题套路 | PASS | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md:105-115` 的 3 个 URL/标题与 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/site-context.md:22-33` 的 live DOM 记录一致；记录为 DOM 顺序，不冒充发布时间。 |
| 中文适配 | PASS | 正文以中文说明为主，保留 `Speed-Gro`、`Deluxe Speed-Gro`、`Hyper Speed-Gro`、`Agriculturist`、版本号、代码术语和来源 URL；未把中文名—英文名桥接扩成配方或收益承诺。 |
| slug / SEO 字符 | PASS | slug=`stardew-valley-speed-gro`，小写连字符格式；Title 44 code points / 78 UTF-8 bytes，Description 55 code points / 165 UTF-8 bytes；JSON 无换行、控制字符或空值。 |
| 地区声明 | UNVERIFIED（诚实保留） | `seo.json` 与交接均为 `locale=zh-CN`、`country=CN`、`countryVerification=UNVERIFIED`；没有把 CN 当作已核验地区 SERP。 |
| 正文内部污染 | PASS | 独立扫描正文命中 `TaskSpace`、`ego-browser`、角色回执、SERP/PAA、内部交接词、`UNVERIFIED` 等 0；控制字符 0。 |
| PublicReference | PASS | 17 个唯一公开 URL、18 个 quote/occurrence；所有 quote 在 NFC/LF 正文中精确出现 1 次，声明 occurrence 全为 1；正文 17 个外链全部有 registry 对应。 |
| bodyHash / handoff | PASS | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/handoff.provisional.json` 内嵌 body 与 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md` 逐字节相同；独立复算 `integrity.publicFieldsHash=3d3eed81f30b544e57fd672a121a205f3cdd14cc4b5282ca14eed38e5e161e6d`。 |
| 中文媒体路径与 hash | PASS | 3 条正文图片路径解析到 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/`；文件存在、SVG 可解析、尺寸和 handoff 要求一致；见下方 hash 表。 |
| 页面与用户终审 | UNVERIFIED / N/A | 用户明确要求 content-only；本轮未装配网站、未做新浏览器页面验收，不能称网站成品或用户通过。 |

## Title / H1 / Description 的题文兑现

实际 SEO JSON：

```json
{
  "locale": "zh-CN",
  "country": "CN",
  "countryVerification": "UNVERIFIED",
  "slug": "stardew-valley-speed-gro",
  "title": "Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用",
  "h1": "Stardew Valley Speed-Gro：10%不等于固定少一天，生长激素怎么用",
  "description": "在已锄地上判断播种前、播种后或成长中何时施用，再按作物阶段演算首次收获日；草莓成熟后的再生长间隔不会因此缩短。"
}
```

- `10%不等于固定少一天`不是泛化收益承诺：正文先说明 10% 是标称成长速度修正值（第 1、9、13–17 行），再以 Parsnip 的 4 天阶段和 Melon 的 12 天阶段演算（第 41–70 行），并明确不要把百分比直接换成日历答案。
- `生长激素怎么用`由正文实际动作兑现：已锄地且不能叠加另一种肥料（第 19–23 行），播种前、播种后或成长中施用（第 25–29 行），已成熟后的再生长不作为肥料加速对象（第 31–39 行），最后用三问作判断（第 91–97 行）。
- Description 的“已锄地”是 SEO 表面的压缩表达，正文对应“已经锄好的地块/土地/空地”；这不是缺失主张。Description 的“草莓成熟后的再生长间隔不会因此缩短”在第 33、74、81、87–89、96 行有明确边界与条件。
- 所有 SEO 表面中的数字/时间承诺均能在正文找到：10%、4/8/12 天、春季第 13 日、首次收获日和草莓 4 天再生长；标题没有加入收益、价格、免费、最快、实测、排名或规划器能力。

## 10 候选、分类与最近标题

`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md:75-86` 是自由生成阶段，行首编号完整为 1–10；`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md:90-101` 才进入六种标题机制、停留要素、人性驱动和淘汰/通过处置。最终候选 1 选择“结论前置”，停留点是正文支持的异常（10%不等于固定少一天）与捷径（按阶段判断），没有借七罪引擎编造收益、敌人、恐惧或个人经历。

最近 3 篇中文 live DOM 标题及实际 URL：

1. `https://stardewvalleyplanner.art/zh/carpenter-stardew` — 星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级
2. `https://stardewvalleyplanner.art/zh/where-is-robin-stardew-valley` — 罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程
3. `https://stardewvalleyplanner.art/zh/fall-crops-stardew` — 星露谷秋季作物：皮埃尔秋1就卖蔓越莓和南瓜，展览会不是种子摊

候选 1 虽使用冒号，但冒号后是正文有证据的反差判断和操作问题，不是上述“主题 + 功能清单”或问句 + 清单，也没有把正文的条件案例改写成普遍收益。该去套路判断与既有 live DOM 记录绑定，不读取旧文章正文。

## 公开引用与定位核对

`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/public-references.json` 与 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/handoff.provisional.json` 的 `publicReferences` 数组逐项相同。独立校验得到：

- bodyHash：`a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；实际 body 为 14,071 bytes，NFC/LF 规范化后 hash 未变。
- 17 个唯一公开 URL，18 个 quote/occurrence；每个完整 quote 在规范化正文出现次数均为 1，声明 occurrence 均为 1。
- 正文 17 个外链 URL 全部出现在 registry，registry URL 也全部在正文出现；没有把来源清单单独截取成唯一 quote。
- quote 支撑范围与当前来源材料相符：版本锚点（Steam/主机公告）、术语桥接、10/20/25/35/33/43% 档位、施用时机与单格肥料限制、阶段向上取整交叉证据、Parsnip/Melon/Strawberry 阶段和日期、Agriculturist 加算、草莓 4 天与咖啡豆 2 天再生长边界。
- 反编译来源在正文明确标为公开 `decompiled snapshot`、非开发者官方源代码、非本次游戏实测（正文第 43、68 行）；日期表格在正文明确是规则演算，不冒充运行游戏观察。
- `xinglugu.huijiwiki.com` 仅用于“生长激素”与 `Speed-Gro` 的名称桥接；正文未采用该页的旧配方或未经当前证据支持的评论。

完整公开来源 URL（17 个）：

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Farming?oldid=191914
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875

## 媒体绑定与 hash

| 文件 | 解析路径 | 实际尺寸 | SHA-256 |
| --- | --- | --- | --- |
| `speed-gro-application-flow.svg` | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-application-flow.svg` | 390×1040 | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| `speed-gro-stage-comparison.svg` | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-stage-comparison.svg` | 390×1160 | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| `strawberry-harvest-timeline.svg` | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/strawberry-harvest-timeline.svg` | 390×1040 | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |

三条正文图片链接均是 `../assets/zh/*.svg`，从 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/` 解析到上述实际文件；alt、caption 均在正文和 handoff 要求中存在。媒体只做本地路径、字节、尺寸和 XML 可解析性核对；没有新建 ego-browser TaskSpace，也没有把既有 media-zh-r1 截图证据冒充本轮新浏览器执行。

## 实际命令、退出码与关键输出

以下路径均为绝对路径；命令在工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行。

| 命令 | 退出码 | 关键真实输出 |
| --- | ---: | --- |
| `node --input-type=module - "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro" <<'NODE'` 独立读取 body/SEO/refs/handoff/F/site-context，复算 quote occurrence、bodyHash、publicFieldsHash、媒体路径/hash、污染和候选/最近标题结构 | 0 | `BODY sha256=a19d3a55... bytes=14071 nfc_lf_same=true`；`REFS unique_urls=17 quote_bindings=18 body_external_urls=17 quote_occurrences=PASS`；`HANDOFF publicFieldsHash=3d3eed81... body_equal=true media_hashes=PASS`；`POLLUTION hits=0 body_control_chars=0 candidate_rows=10 classification_rows=10 recent_zh_titles=3` |
| `node --input-type=module - "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro" <<'NODE'` 将 17 个 URL 与当前 `research/facts.md`、`research/facts-evidence/source-extracts.md`、`research/zh-evidence/source-pages-2026-09-26.md` 交叉回读 | 0 | `current_evidence_files=3 public_urls=17 refs_found=17 missing=0 non_https=0 signed_or_secret=0` |
| `shasum -a 256 -- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/seo.json /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/public-references.json /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/handoff.provisional.json /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/*.svg` | 0 | body=`a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；seo=`ac9cd98e6ab6fd1a7c51fa41f77c438cd21b3ef5ae2bec22123b3da7a21b13a2`；refs=`f66c3471e57515c4ee804a111ab722dec4d27b2b45530278f4261ca2d713c2da`；handoff=`ca325cbc490f89bab345ac6044e314fa44baa8a601d365ef2229ab6bf3b715b1`；三媒体 hash 见上表。 |
| `python3 -m json.tool` 分别读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/seo.json`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/public-references.json`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/handoff.provisional.json` | 0 / 0 / 0 | 三个 JSON 均可解析。 |
| `xmllint --noout` 分别读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-application-flow.svg`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/speed-gro-stage-comparison.svg`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/zh/strawberry-harvest-timeline.svg` | 0 / 0 / 0 | 三张 SVG 均可解析。 |
| `nl -ba` 分别读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-zh.md`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/site-context.md` | 0 | 直接读取当前正文、候选/分类记录及 live DOM 标题记录；未用旧文章正文替代。 |

曾有一次修订前独立探针退出码 1：它错误期待 handoff 内存在嵌套 `publicReferences.bodyHash`；随后先读取真实 handoff 结构（`publicReferences` 为 17 项数组、bodyHash 为顶层字段），修正探针后完整校验退出码 0。该探针错误未写入或改变任何输入文件。

## 交接边界与文件清单

本轮只新增以下文件，未修改正文、SEO、公开引用、handoff、媒体、源码、规则或 WORKLOG：

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/E-SEO-zh.md`

结论是当前正文字节版本上的独立 SEO/公开引用 PASS；`countryVerification=UNVERIFIED`、页面装配、页面审核、用户终审和部署均保持未完成/未执行，不冒充最终网站成品。
