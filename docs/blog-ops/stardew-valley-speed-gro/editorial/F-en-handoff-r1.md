# F-en 技术交接修复 r1

核对日期：2026-09-26（Asia/Shanghai）  
角色：F-en 技术交接修复；关键词：`stardew valley speed gro`；站点：`https://stardewvalleyplanner.art`；模式：英文 `content-only`。

本轮只修复公开交接技术合同，正文不变，不属于正文改写轮。只修改了 `final/en/public-references.json`、`final/en/handoff.provisional.json`，新增本报告；没有生成 `final/en/handoff.json`，没有装配网站、浏览器验收、外部写入、依赖安装、密钥处理、提交或推送。

## 处理结果

完整读取 `reviews/E-SEO-en.md:81-100` 的 4 个 occurrence 问题和 5 个 provisional 合同问题，一次修复：

- 17 个精确完整 quote 均在 NFC/LF 规范化原 Markdown 正文中按 quote 自身计数，程序复核结果为 `occurrence=1`、每个 quote 唯一出现 1 次。4 个原错误值 `2/4/3/3` 已分别改为 `1/1/1/1`；quote 文本、来源 URL 和正文含义均未改动。
- `public-references.json` 保留 13 个实际 `PublicReference`，`handoff.provisional.json.publicReferences` 改为该实际数组，不再是 `{path, bodyHash}` 索引。
- `handoff.provisional.json` 保留文件名作为历史索引，`type` 仍为 `PublicBlogHandoff`，`status` 明确为 `pending-independent-review`；`body` 为锁定 Markdown 的实际 UTF-8 文本，顶层 `bodyHash` 为实际字节 SHA-256。
- `seo` 原值完整带入并含 `title`、`h1`、`description`、`slug`；正文和 SEO 文件均未修改。
- 两个资源路径均为相对当前 handoff 文件目录可解析的 `../assets/en/...svg`。`captionFormat=raw-markdown-inline-html`，每个 `caption` 逐字取 `body.md` 对应 `<figcaption>` 原文并保留来源链接，没有从 manifest 改写。
- `integrity.publicFieldsDigest` 覆盖完整 top-level handoff（`integrity` 成员除外），包括 `locale`、`country`、`body`、`bodyHash`、`seo`、`publicReferences`、`publicRequirements` 等字段；算法为 SHA-256，对递归按 key 字典序排列、数组保序、无多余空白的紧凑 JSON UTF-8 字节摘要。排除规则明确写为 `excludedFromDigest=["integrity"]`。

## 修复前后字节证据

以下修复前值先由程序直接读取实际文件字节捕获；修复后再次用 `shasum -a 256` 复核。正文、SEO 和两张锁定 SVG 未变：

| 文件 | 修复前 SHA-256 | 修复后 SHA-256 | 结果 |
|---|---|---|---|
| `final/en/body.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` | unchanged |
| `final/en/seo.json` | `6955679ad6cc459203ff1528f9da2659cd7d500840e754487ebffa069036d155` | `6955679ad6cc459203ff1528f9da2659cd7d500840e754487ebffa069036d155` | unchanged |
| `final/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` | unchanged |
| `final/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` | unchanged |

修复后摘要：`bodyHash=9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`，正文 `19454` bytes，`referenceCount=13`，`quoteBindingCount=17`，两张图均存在；`publicFieldsDigest=dc56b4ae25741b24aec9face7c30dea99d92adebb5d4258c1919116a51f46b9d`。

## 实际命令与退出码

以下命令均在 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行；内联 Node 探针只读实际文件，不写入脚本或缓存：

| 实际命令/动作 | 退出码 | 真实结果 |
|---|---:|---|
| `node --input-type=module <<'EOF'`（读取 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/{body.md,seo.json,public-references.json,handoff.provisional.json}` 与两张 `final/assets/en/*.svg`，先捕获 body/SEO/asset 字节 SHA-256，并按 NFC/LF 原 Markdown 逐 quote 计算 occurrence） | 0 | 修复前 body `9c4c...be46`；4 个错误 occurrence 为 `2/4/3/3`；其余 13 个已为 `1`。 |
| `node --input-type=module <<'EOF' \| apply_patch`（只更新 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/public-references.json` 与 `final/en/handoff.provisional.json`） | 0 | `Success. Updated the following files`；无其他目标文件。 |
| `node --input-type=module <<'EOF'`（JSON parse/schema、body byte equality、17 quote exact occurrence、13 URL 集合、caption 原文、相对路径存在性、digest 重算、body/SEO/asset hash 不变、`handoff.json` 不存在） | 0 | `JSON_SYNTAX_AND_SCHEMA=PASS`; `QUOTE_OCCURRENCES=1x17`; `BODY_URLS=13;REF_URLS=13;URL_SET_DIFF=none`; `FIGURE_COUNT=2;CAPTION_CHECK=PASS;PATH_CHECK=PASS`; digest 与声明相等。 |
| `jq -e '...' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.provisional.json'` 与 `jq -e '...' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/public-references.json'` | 0 | 两个 JSON 合同断言均输出 `true`；body 为 string、status/type 正确、SEO 四字段齐全、publicReferences 为数组、资产路径以 `../assets/en/` 开头。 |
| `shasum -a 256 '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/seo.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-melon-stage-days.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-strawberry-regrowth-calendar.svg' && test ! -e '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.json'` | 0 | 四个 SHA-256 与修复前捕获值完全一致；最终 `handoff.json` 不存在。 |

## 允许文件清单

- 修改：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/public-references.json`
- 修改：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.provisional.json`
- 新增：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/F-en-handoff-r1.md`

未修改：`final/en/body.md`、`final/en/seo.json`、`final/assets/en/*.svg`、中文材料、网站 `src/public/package`、AGENTS、WORKLOG；未生成最终 `handoff.json`。当前仍是待 E 独立复核的 content-only 交接，不声称页面、用户终审或部署通过。

## 来源 URL

本地 publicReferences 保留的 13 个公开来源 URL：

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

交接 canonical URL：<https://stardewvalleyplanner.art/stardew-valley-speed-gro>。
