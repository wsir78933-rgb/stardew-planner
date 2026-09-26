# E-SEO-en：英文标题、SEOTruth 与公开交接独立核对

核对日期：2026-09-26（Asia/Shanghai）。角色为英文 E-SEO-en；输入为原关键词 `stardew valley speed gro`、站点 `https://stardewvalleyplanner.art`、content-only 英文材料。未改正文、SEO、引用、媒体或 handoff；未联网/浏览器复验 F/M 已完成的内容和渲染结论。

## 总结

| 项目 | 结论 | 证据绑定 |
|---|---|---|
| Title / H1 / Description / slug 的 SEOTruth | **PASS** | 当前 `final/en/body.md` SHA-256 `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`；SEO 表面与该字节版本核对通过 |
| PublicReference 的 quote occurrence | **FAIL，退 F 修正** | 17 个绑定中 4 个的 `occurrence` 不是精确 quote 在纯 Markdown 正文中的 1-based 出现序号 |
| `handoff.provisional.json` 是否满足最终 PublicBlogHandoff | **FAIL / 不可交 G** | 当前是路径索引，不是 V7 要求的实际 body/引用清单；图片路径也没有明确相对基准 |
| 页面、用户终审、部署 | **未执行 / UNVERIFIED** | 当前范围是 content-only；不冒充网站成品或用户批准 |

SEO 表面本身可以保留；在 PublicReference 和公开交接修正、F 重新冻结之前，不应把本轮材料报告为“公开交接通过”。

## 1. 版本与 hash 绑定

本轮直接读取文件字节并计算 SHA-256，全部为 64 位小写十六进制：

| 文件 | 当前 SHA-256 |
|---|---|
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

`cmp -s` 对 `drafts/body-en.md` 与 `final/en/body.md` 退出码 `0`；两张 source SVG 与 `final/assets/en` 副本的 `cmp -s` 也均退出码 `0`。`public-references.json.bodyHash` 与实际 final body hash 相等；当前版本因此绑定到上述正文和两张 final SVG，而不是依赖 F 报告抄写的 hash。

## 2. Title / H1 / Description / slug

`final/en/seo.json` 的实际值：

| 字段 | 值 | 独立核对 |
|---|---|---|
| `title` | `Compare Stardew Valley Speed-Gro Harvest Dates, Not Percentages` | 63 字符；主关键词自然出现；无数字、价格、收益、`best`、`fastest` 或 `tested` 承诺 |
| `h1` | `Compare Stardew Valley Speed-Gro Harvest Dates, Not Percentages` | 与 Title 完全一致；63 字符 |
| `description` | `Compare Speed-Gro, Deluxe, and Hyper by stage days, first harvest dates, and fixed regrowth intervals. Learn when a tier changes your crop calendar.` | 148 字符；所有名词和决定动作均有正文支撑 |
| `slug` | `stardew-valley-speed-gro` | 24 字符；小写、连字符、无 query/hash/内部路径污染 |
| `locale / country` | `en / US` | `countryVerification=UNVERIFIED` 被保留；没有把请求地区写成已验证美国 SERP |

正文对应关系：

- “Not Percentages”由正文第 1、9、31、54、81、154 行支持：modifier 不是直接日历天数折扣，需经过 whole stage-day 计算并比较日期。
- “Speed-Gro, Deluxe, and Hyper”由第 13–19、79、95–120 行支持；三档、Agriculturist、可获得性和受限例子均在正文中。
- “stage days / first harvest dates”由第 31–58、95–120、147–152 行支持；Melon、Parsnip、Strawberry 均标为 source-based calculation，未写成实测。
- “fixed regrowth intervals”由第 23、89、120、127、139、148、154 行支持；正文明确肥料不缩短后续 4 天 regrowth。
- “when a tier changes your crop calendar”由第 71–89、107、120、152–154 行支持；结论是条件性日历选择，不是普适最佳档位或 ROI。

语言核对命令读取实际 body：Han 字符 `0`，英文词元 `2826`；Title/H1/Description 均为自然英文，没有把中文表面直译进英文页。SEO 字段与正文、handoff 字段均未检出 `TaskSpace|ego-browser|research/|layout/|A-facts|B-en|C-en|D-en|E-en|F-en|SERP|search result|canary|prompt|internal path|agent|private path|secret` 等内部污染词；没有把报告路径、角色、浏览器或权限写进读者 SEO。

## 3. 十个标题、七罪分类和最近标题套路

`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-en.md:68-96` 确实保留了“先自由生成 10 个，再按六种机制分类”的记录，并逐项给出停留要素/人性驱动及淘汰理由；`F-en.md:98-108` 记录了最近 3 个英文 live 标题。以下是我独立按七罪规则对最终筛选的核对，不采用 F 的 PASS 自评替代判断：

| 候选 | 独立分类核对 | 结论 |
|---:|---|---|
| 1 | 结论前置；冲突（百分比与日期）+ 捷径；懒惰驱动 | **保留**。正文第 1、31、54、81、152–154 行完整承接 |
| 2 | 结论前置；冲突；金钱/懒惰驱动 | 淘汰：与 #1 同一承诺，且冒号清单形态贴近近期套路 |
| 3 | 反差数字；异常 + 终结；贪婪/懒惰驱动 | 淘汰：只由 Spring 13 Strawberry 例子成立，且无主关键词，易被读成普遍增收保证 |
| 4 | 结论前置；异常；窥探驱动 | 淘汰：事实可接住，但停留点比 #1 宽且弱 |
| 5 | 损失进入；冲突 + 捷径；懒惰/机会成本驱动 | 淘汰：点名 Hyper 会缩窄主意图 |
| 6 | 自我颠覆；冲突；好奇/懒惰驱动 | 淘汰：正文支持，但比 #1 间接，未保留完整主关键词 |
| 7 | 自我颠覆；异常 + 冲突；愤怒/好奇驱动 | 淘汰：`Trap` 比正文证据边界更强，会制造无依据焦虑 |
| 8 | 结论前置；捷径；懒惰驱动 | 淘汰：`Decides` 绝对化，正文还要求作物、档位、期限和地点 |
| 9 | 自我颠覆；冲突；懒惰/机会成本驱动 | 淘汰：`better` 没有统一价值函数；正文只给条件性计划判断 |
| 10 | 结论前置；捷径 + 冲突；懒惰驱动 | 淘汰：缺 `Stardew Valley`，问句/多项列举也更接近近期套路 |

最近 3 个实际标题（来自 `research/site-context.md:22-31`）为：

1. `Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades`
2. `Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions`
3. `Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed`

最终 #1 不重复三者的冒号清单、问句或价格数字模式，也没有把正文没有的 `best`、最快、测试或收益写进标题；停留理由是具体的“百分比标签不等于同样日历天数”的信息差，正文能够兑现。

## 4. PublicReference、quote occurrence、bodyHash 与媒体

独立 Node 校验按 NFC/LF 规范化正文、纯 Markdown 原文 `quote` 字符串和从 1 开始的 exact occurrence 计算。真实结果：`bodyHash=9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`，声明 hash 相同；`referenceCount=13`、`quoteBindingCount=17`；13 个引用 URL 与正文 13 个规范化 URL 集合相同，`missing=[]`、`extra=[]`；两张 `<img>` 均存在且实际 hash 与上表一致。

但下列 4 个定位失败；每个 quote 在纯 Markdown 正文中实际只出现 1 次：

| `public-references.json` | 正文位置 | id | 声明 occurrence | 实际 quote occurrence | 判定 |
|---:|---:|---|---:|---:|---|
| 90 | `final/en/body.md:75` | `fertilizer-mechanics`（`The [Fertilizer page]...`） | 2 | 1 | **FAIL** |
| 94 | `final/en/body.md:139` | `fertilizer-mechanics`（`The [Fertilizer rules]...`） | 4 | 1 | **FAIL** |
| 146 | `final/en/body.md:95` | `crop-growth-calendars`（`With a watered Summer 1 planting...`） | 3 | 1 | **FAIL** |
| 162 | `final/en/body.md:95` | `melon-crop-data`（`The [Melon page] supplies...`） | 3 | 1 | **FAIL** |

这些声明数字分别对应同一 URL 在正文中的第 2/4/3/3 次出现，而不是各自完整 quote 的出现序号；V7 要求的是 quote occurrence。退 F/C 的具体动作是把这 4 个定位改为精确 quote occurrence（当前正文不变时均为 `1`），再对同一正文 hash 重跑校验；不要把 URL occurrence 当作 quote occurrence，也不要改写正文来迎合旧定位。

## 5. 当前 provisional handoff 的合同问题

当前 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.provisional.json` 明确标为 `provisional-pending-independent-seo-review`，所以以下是交接未完成的具体原因，不是用户终审结论：

1. `:10-14` 的 `body` 是 `{path, encoding, sha256}` 对象，不是 V7 要求的实际 UTF-8 body 文本或项目认可 AST；顶层没有 `bodyHash`。
2. `:21-24` 的 `publicReferences` 只有 `{path, bodyHash}`，不是实际 `id/label/url/appliesTo` 清单；当前清单仍须独立修正上节 4 个 occurrence。
3. `:31`、`:41` 的资源路径是 `assets/en/...`，但 handoff 文件位于 `final/en/`；按该文件目录解析两条路径均不存在，实际文件在 `final/assets/en/...`。当前 JSON 没有 `assetBase` 或等价的明确路径基准。修复应明确使用 `../assets/en/...`（相对 `final/en/handoff...`）或显式声明并由消费者执行同一基准，不能只依赖 F 脚本的自定 base。
4. `:52-60` 的 `integrity` 只有 `bodyHash`、两张 `mediaHashes`、`assembly` 和 `userApproval`，没有覆盖 `seo`、完整 `publicReferences`、`publicRequirements` 的确定性公开字段摘要；不能把 body/media hash 单独写成整份公开字段的完整 integrity。
5. `:37`、`:47` 的 handoff `caption` 不是正文 Figure caption 的原文：两项实际 `captionInBody=false`。如果该字段用于页面装配，应由 F 明确正文 caption 为权威并保留其中的来源链接，或让公开交接的 caption 与正文图注逐字一致，避免装配器静默改写图注。

因此当前 provisional handoff **不能交 G，也不能记作 PublicBlogHandoff PASS**。请 F 新建/冻结合约完整的交接文件后，重新绑定修正后的引用和同一 bodyHash；本报告不自修 handoff。

## 6. 实际命令与退出码

以下命令均在 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行；命令中的路径为完整绝对路径。

| 实际命令/动作 | 退出码 | 关键真实输出 |
|---|---:|---|
| `sed -n '1,320p' '/Users/wusir/.mirasim/skills/ego-browser/SKILL.md'` 与 `sed/nl` 读取 `/Users/wusir/Desktop/博客-V7修订版/{执行入口,01-统一工作流,02-内容生产与质量门,04-公开交接与页面装配,参考规则/事实核验与公开引用,参考规则/标题与描述规则,参考规则/七罪引擎}.md` | 0 | 已读取浏览器任务规范、V7 工作流、SEO、七罪及公开交接规则 |
| `nl -ba` 读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/{final/en/body.md,final/en/seo.json,final/en/public-references.json,final/en/handoff.provisional.json,editorial/F-en.md,research/site-context.md,reviews/{D-en-r1.md,E-en-r1.md,media-en-r1.md,media-en-r1-binding.md}}` | 0 | 读取当前正文、SEO、引用、临时交接、F 标题记录、D/E/M 绑定记录 |
| `shasum -a 256` 对 final/draft body、media manifest、两张 source/final SVG | 0 | body `9c4c...be46`；media manifest `fcd5...df0e0`；Melon `66e1...5264`；Strawberry `c862...07e5` |
| `cmp -s` draft body↔final body、source SVG↔final SVG | 0 | 三项 `*_CMP_EXIT=0` |
| `node --input-type=module -e '...'`（读取实际 body/ref/handoff/media 字节，逐 quote `split` 计数、SHA-256、图片存在性与 metadata 形状） | 0 | body hash 相等；4 个 quote mismatch；两图存在且 hash 正确；handoff body/publicReferences 类型为 path 对象 |
| `node --input-type=module -e '...'`（规范化正文 URL 集合与引用 URL 集合比较） | 0 | `bodyUniquePublicUrls=13`、`referenceUrls=13`、`bodyOnly=[]`、`refOnly=[]` |
| `jq -e` SEO、public-references JSON 结构检查 | 0 | `SEO_SCHEMA_EXIT=0`、`PUBLIC_REFERENCES_SCHEMA_EXIT=0` |
| `node --input-type=module -e '...'` 标题长度/语言/近期标题差异检查 | 0 | title/H1 `63`、description `148`、slug `24`；Han `0`；与最近 3 标题不重复且无冒号/问句/价格数字钩子 |
| `rg -n` 正文内部残留扫描 | 1 | 无输出；`exit=1` 是预期 no-match，不是失败 |

## 7. 本轮文件清单

本轮只新增以下允许文件，未修改其他文件：

- 新增：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/E-SEO-en.md`
- 只读输入：`final/en/body.md`、`final/en/seo.json`、`final/en/public-references.json`、`final/en/handoff.provisional.json`、`editorial/F-en.md`、`research/site-context.md`、`research/en.md`、`reviews/D-en-r1.md`、`reviews/E-en-r1.md`、`reviews/media-en-r1.md`、`reviews/media-en-r1-binding.md`、两张 `final/assets/en/*.svg`。
- 未做：网站装配、页面浏览器验收、部署、外部写入、依赖安装、密钥处理、提交或推送。

## 8. 来源 URL

公开引用清单中的 13 个 URL 均已逐项确认在正文与 `public-references.json` 集合中对应；本轮只核对本地公开引用绑定，不重新联网核验上游内容：

- <https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english>
- <https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/>
- <https://stardewvalleywiki.com/Speed-Gro?oldid=190630>
- <https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196>
- <https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377>
- <https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411>
- <https://stardewvalleywiki.com/Parsnip?oldid=191123>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>

用于最近标题套路核对的公开页面为：<https://stardewvalleyplanner.art/carpenter-stardew>、<https://stardewvalleyplanner.art/where-is-robin-stardew-valley>、<https://stardewvalleyplanner.art/fall-crops-stardew>。
