# M-en 媒体第 1 轮独立复验（英文）

## 范围与结论

- 角色：M-en，独立复验英文修订后的正文、`media-en.json` 与 `assets/en` 中两张真实 SVG；不兼任 C/D/E/F。
- 复验日期：2026-09-26（Asia/Shanghai）。
- 输入：`drafts/body-en.md`、`drafts/media-en.json`、`assets/en/speed-gro-melon-stage-days.svg`、`assets/en/speed-gro-strawberry-regrowth-calendar.svg`；旧 `reviews/media-readability.md` 与 `editorial/C-en-r1.md` 只用于定位旧问题，未采信 C 的自评作为证据。
- 结果：英文两张 SVG 在直接 `file://` 打开的桌面视口与 390px 窄视口均 PASS。旧报告中英文图在窄屏约 10px 的可读性问题已关闭；当前实际渲染最小计算字号为 14px，无横向裁切、文字重叠或越界，日期与图例可读。
- 本轮未改正文、manifest、原图 SVG、网站源码、`public`、`package.json`、AGENTS 或 WORKLOG；未装依赖、未提交/推送/部署、未处理密钥、未做外部写入。

本报告不代表中文媒体、网站装配、部署或用户终审通过。旧媒体报告中中文三图的窄屏问题不在 M-en 的互斥范围内，因此本轮不复验、不修复。

## 当前版本绑定

| 材料 | SHA-256 |
| --- | --- |
| `drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e` |
| `assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

证据截图也已固定 hash：`melon-desktop.png`=`b3098a8d28045176d012d4375866b37c8b8c98206ebe8f11d4012b242389df80`、`melon-narrow.png`=`994bd9990e5859ff15fd56d785c4ffffd1454280ca7e0ea40841ae4c63ad2b4f`、`strawberry-desktop.png`=`833586c3e23335198c0e8d13c9d60a28fcffb18a90d649db7af9038f3667cef4`、`strawberry-narrow.png`=`6ab26d7c300ab25afb91482cecaab2651f5719902ddc77718d57737abd97ef59`。

## 旧问题逐项关闭

| 旧定位 | 当前独立证据 | 状态 |
| --- | --- | --- |
| `reviews/media-readability.md:64-65`：英文窄屏整体缩放后约 10px，日期/图例不够可靠 | 当前两图在 390×844 直接渲染中，64/49 个可见 `<text>` 节点的最小计算字号均为 14px；日期、向量、四档结果和图例在 390px 全图截图中可辨 | PASS，已关闭 |
| `reviews/media-readability.md:64-65`：英文窄屏需重新检查实际渲染 | 390px 视口下两图 SVG 根宽均为 390px，`clientWidth=390`、`scrollWidth=390`；所有文字 bbox 均在 viewBox 内，`overlapPairs=[]`、`outOfBounds=[]` | PASS，已关闭 |
| 旧英文桌面渲染 | 1440px 桌面直接渲染截图包含整张图；卡片、阶段向量、日期、注释/图例无裁切和重叠 | PASS，保持 |
| `reviews/media-readability.md:51-56`：manifest 没有统一 path base | 当前 `media-en.json:4` 明确 `pathBase: "manifest-directory"`；两条 `../assets/en/...` 从 `drafts/` 解析均存在 | PASS（仅英文清单） |
| `editorial/C-en-r1.md:22,30`：`ceil` 的对象需独立核对 | 正文 `body-en.md:31-41`、Melon SVG 文字/desc、manifest 的 caption/alt 均表达 `ceil(baseDays × effective modifier)`，即对乘积所得待移除 stage-days 向上取整，而非向上取整 modifier | PASS |

## Ego-browser 实际渲染证据

使用一个本地 ego-browser TaskSpace（`spaceId=50`）和一个页面，逐张直接导航到 `file://` SVG；未创建 HTML 或演示站。桌面使用 1440×900，窄屏使用 390×844；每次使用 `fullPage: true` 截取完整 SVG，并通过正常 wheel 滚动到最大 `scrollY` 后再保存证据。浏览器任务已执行 `finish({ keep: [] })`，仅关闭本轮创建的浏览器空间。

| SVG | 视口 | 实际根尺寸 / 页面滚动 | 字号、裁切与重叠 | 截图 |
| --- | --- | --- | --- | --- |
| Melon | 1440×900 | SVG `390×1070`；`scrollWidth=1440`、`scrollHeight=1070`；从 `scrollY=0` 滚到 `170` | `textCount=64`，`minFontSize=14px`；`overlapPairs=[]`、`outOfBounds=[]` | [melon-desktop.png](</Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-desktop.png>)（1440×1070） |
| Melon | 390×844 | SVG `390×1070`；`scrollWidth=390`、`scrollHeight=1070`；从 `scrollY=0` 滚到 `226` | `textCount=64`，`minFontSize=14px`；无横向滚动、`overlapPairs=[]`、`outOfBounds=[]` | [melon-narrow.png](</Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-narrow.png>)（390×1070） |
| Strawberry | 1440×900 | SVG `390×1250`；`scrollWidth=1440`、`scrollHeight=1250`；从 `scrollY=0` 滚到 `350` | `textCount=49`，`minFontSize=14px`；`overlapPairs=[]`、`outOfBounds=[]` | [strawberry-desktop.png](</Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-desktop.png>)（1440×1250） |
| Strawberry | 390×844 | SVG `390×1250`；`scrollWidth=390`、`scrollHeight=1250`；从 `scrollY=0` 滚到 `406` | `textCount=49`，`minFontSize=14px`；无横向滚动、`overlapPairs=[]`、`outOfBounds=[]` | [strawberry-narrow.png](</Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-narrow.png>)（390×1250） |

### 视觉逐图结论

- Melon：四张卡均显示完整 `[1, 2, 3, 3, 3]` 或修订后阶段向量、modifier、stage-days removed、effective first growth 和 Summer 13/11/10/9；桌面与 390px 全图均无卡片、日期或底部注释裁切。
- Strawberry：四张卡均显示 Spring 13 播种、首收、后续 `+4-day regrowth`、Spring 29 越界标记，以及底部固定四日 regrowth 图例；桌面与 390px 全图均无横向裁切和重叠。
- 两张图最小实际字号均为 14px；XML 合法不能替代上述直接浏览器渲染，本结论以截图和 DOM/CSS 实测共同判定。

## Body、manifest、SVG 与数字语义

| 项目 | 独立核对 | 结论 |
| --- | --- | --- |
| Body 图片链接 | `body-en.md:61` 与 `:123` 的两条 `../assets/en/...` 均从 `drafts/` 目录解析到真实文件 | PASS |
| Manifest 路径 | `media-en.json:4,8,24` 的 `pathBase=manifest-directory` 与两条相对路径一致；manifest 目录解析结果均存在 | PASS |
| Melon 数字 | `body-en.md:58,95-107` 的 `[1,2,3,3,3]`、12 天、Summer 13/11/10/9 与 SVG `:22-24,30-97`、manifest `:14-15` 对齐 | PASS |
| Strawberry 数字 | `body-en.md:111-120`、`:123-124` 的 `[1,1,2,2,2]`、Spring 13、21/25/29*、20/24/28、19/23/27、18/22/26 与 SVG `:18-90`、manifest `:30-31` 对齐 | PASS |
| `ceil` 语义 | 正文、Melon SVG、manifest caption/alt 都把向上取整绑定到 `12 × effective modifier` 的乘积，且不把 modifier 本身向上取整 | PASS |
| 图像类型边界 | 两张 SVG 均无 `<image>` 元素，实际显示为向量/文字分析图；正文图注明确为 source-based calculations，不声称截图或 playtest | PASS |

## 实际命令与退出码

以下命令均在工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行：

| 命令/动作 | 退出码 | 关键真实输出 |
| --- | ---: | --- |
| `jq -C . docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | 0 | `pathBase=manifest-directory`，`assets=2` |
| `node --input-type=module -e '<body/manifest/path/数字语义校验器>'` | 0 | `BODY_IMAGE_LINK_CHECK count=2`；`MANIFEST_PATH_CHECK pathBase=manifest-directory assets=2`；`BODY_MANIFEST_ASSET_SET_CHECK`；`SVG_SEMANTIC_CHECK checks=9`；`SOURCE_URL_CHECK urls=5` |
| `xmllint --noout .../assets/en/speed-gro-melon-stage-days.svg .../assets/en/speed-gro-strawberry-regrowth-calendar.svg` | 0 | 两张 XML 均通过解析 |
| `ego-browser nodejs -e '<一个 TaskSpace、p1、两张 file:// SVG、1440×900 与 390×844、fullPage 截图、wheel 滚动、finish>'` | 0 | `spaceId=50`；四张 PNG 实际生成；四组字号/边界/滚动指标如上 |
| `file reviews/media-evidence-en-r1/*.png` | 0 | 四张均为 PNG；尺寸分别为 1440×1070、390×1070、1440×1250、390×1250 |
| `shasum -a 256 drafts/body-en.md drafts/media-en.json assets/en/*.svg reviews/media-evidence-en-r1/*.png` | 0 | 版本绑定 hash 如上 |

## 本轮新增文件

- `reviews/media-en-r1.md`
- `reviews/media-evidence-en-r1/melon-desktop.png`
- `reviews/media-evidence-en-r1/melon-narrow.png`
- `reviews/media-evidence-en-r1/strawberry-desktop.png`
- `reviews/media-evidence-en-r1/strawberry-narrow.png`

## 来源 URL

以下 URL 是当前英文 manifest 中实际记录、并与对应图文主张关联的公开来源；本轮复验核对的是本地正文/清单/SVG 的一致性与实际渲染，不把本地渲染当作对上游页面内容的重新核验：

- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
