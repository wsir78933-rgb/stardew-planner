# E-SEO-en-r1：英文 SEO 与公开交接修复独立复验

核对日期：2026-09-26（Asia/Shanghai）  
角色：E-SEO-en 交接修复独立复验  
输入：关键词 stardew valley speed gro；站点 https://stardewvalleyplanner.art；英文 content-only。  
范围：只读原 reviews/E-SEO-en.md、editorial/F-en-handoff-r1.md、当前 final/en body/SEO/refs/provisional handoff 与两张英文 SVG；本轮只新增本报告，不改公开文件。

## 结论

技术复验 **PASS**。修复后的 17 个 quote binding 全部在 NFC/LF 规范化的实际 Markdown 正文中以各自完整 quote 的 1-based occurrence 定位；原报告指出的 4 个错误定位现在均为 occurrence 1，且不是按 URL 次数计数。

V7 04 PublicBlogHandoff 合同检查通过：handoff.body 是实际正文文本，顶层 bodyHash 与正文和 refs 一致，seo 含并绑定 slug，publicReferences 是 13 项实际数组并覆盖 17 个 binding，两个媒体路径以 handoff 文件目录为基准可解析，caption 与正文 figcaption 逐字一致并保留来源链接，公开字段 integrity 可确定性重算。最终探针真实结果为 checks=13、passed=13、failed=0；quoteBindings=17、quotePass=17；assets=2、assetPass=2。

SEOTruth 维持原 PASS：直接读取当前字节后，body、seo、两张 SVG 的 SHA-256 均与修复前记录的基线相同，因此没有触发标题/SEO 重新生成或正文重审。用户终审仍为 pending，handoff 仍是 pending-independent-review，assembly 为 not-applicable-content-only；本轮未执行网页装配、浏览器验收、部署或外部写入。

## 原四个 occurrence 修复的独立结果

Node 探针对 NFC/LF 正文执行完整 quote 字符串的非重叠 exact occurrence 计数；每一项当前 quote 实际只出现 1 次：

| binding | 正文行 | 声明 occurrence | 实际 quote occurrences | 结果 |
|---|---:|---:|---:|---|
| fertilizer-mechanics：Fertilizer page quote | 75 | 1 | 1 | PASS |
| fertilizer-mechanics：Fertilizer rules quote | 139 | 1 | 1 | PASS |
| crop-growth-calendars：watered Summer 1 quote | 95 | 1 | 1 | PASS |
| melon-crop-data：Melon page quote | 95 | 1 | 1 | PASS |

其余 13 个 binding 同样通过；总计 17/17。正文 URL 集合与引用 URL 集合均为 13，bodyOnly=[]、refOnly=[]。

## V7 04 检查明细

| 检查项 | 真实结果 |
|---|---|
| PublicBlogHandoff body | handoff.body 与 final/en/body.md UTF-8 字节完全相同；19454 bytes，UTF-8，LF |
| 顶层 bodyHash | 9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46；实际计算、refs.bodyHash、handoff.bodyHash 一致 |
| SEO slug | handoff.seo 与 final/en/seo.json 相等；seo.slug 与顶层 slug 均为 stardew-valley-speed-gro |
| 引用数组 | handoff.publicReferences 与 public-references.json.references 为同一实际数组；13 references / 17 bindings |
| 资源相对基准 | assetPathBase=handoff-file-directory；../assets/en/... 两条路径均从 final/en/handoff.provisional.json 目录解析到实际文件 |
| 图文绑定 | 两个 img 的 src、alt、尺寸、媒体 hash 与交接匹配；两个 caption 均逐字来自正文 figcaption，并含正文中的来源链接 |
| 公开字段 integrity | 按 canonical-json-v1（递归 key 排序、数组保序、紧凑 UTF-8 JSON，排除 integrity）重算为 dc56b4ae25741b24aec9face7c30dea99d92adebb5d4258c1919116a51f46b9d，与声明一致 |
| 状态边界 | status=pending-independent-review；userApproval=pending；assembly=not-applicable-content-only |

## 当前文件 SHA-256

以下值全部由程序直接对实际文件字节计算，均为 64 位小写十六进制：

| 文件 | 当前 SHA-256 | 与修复前正文/SEO/媒体基线 |
|---|---|---|
| final/en/body.md | 9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46 | unchanged |
| final/en/seo.json | 6955679ad6cc459203ff1528f9da2659cd7d500840e754487ebffa069036d155 | unchanged |
| final/en/public-references.json | a27ce6e6a006fb2f56cab062a60774e5396aa74d72206343331a6aee3c776de5 | current binding |
| final/en/handoff.provisional.json | 5a0260ef90bf871090909800a7935c5190771abb3f09ba95fcf01ad099198649 | current handoff |
| final/assets/en/speed-gro-melon-stage-days.svg | 66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264 | unchanged |
| final/assets/en/speed-gro-strawberry-regrowth-calendar.svg | c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5 | unchanged |

## 实际命令与退出码

以下命令均在 /Users/wusir/orca/workspaces/stardew planner/博客-2 执行：

1. 命令：node --input-type=module <<'EOF'。读取实际 body、SEO、refs、handoff、两 SVG；按 NFC/LF 计数全部 quote occurrence；检查 body/hash、数组、slug、URL 集合、相对资源、caption、SVG 尺寸和 hash、canonical integrity、content-only 状态；退出码 0。输出：checks=13、passed=13、failed=0；quoteBindings=17、quotePass=17；assets=2、assetPass=2。
2. 命令：shasum -a 256 '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/seo.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/public-references.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.provisional.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-melon-stage-days.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-strawberry-regrowth-calendar.svg'。退出码 0；输出与本报告 hash 表一致。
3. 命令：cmp -s '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md'。退出码 0。
4. 命令：cmp -s '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-melon-stage-days.svg'。退出码 0。
5. 命令：cmp -s '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/assets/en/speed-gro-strawberry-regrowth-calendar.svg'。退出码 0。
6. 命令：test ! -e '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/handoff.json'。退出码 0；未生成最终 handoff.json。

## 文件边界与未执行项

- 本轮新增：/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/E-SEO-en-r1.md。
- 未修改：body、seo、public-references、handoff、两张 SVG、中文材料、src、public、package、AGENTS、WORKLOG。
- 未重跑研究、正文计数、浏览器/页面、十标题生成；未装配网站、部署、安装依赖、处理密钥、提交、推送或外部写入。

## 当前公开来源 URL

以下 URL 由当前 public-references.json 实际读取；本修复复验不重新研究或联网重核上游内容：

- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Strawberry?oldid=192732
