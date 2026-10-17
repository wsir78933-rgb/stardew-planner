# Farmhouse Upgrade 素材来源记录（M2 纠正后）

- **原记录**：角色 M，`task_3a79aaae4149` / `ctx_2d2fa1bb6b61`
- **纠正**：角色 M2，2026-10-15，工作树「博客 2」
- **测量日志**：`docs/blog-ops/house-upgrade-stardew/media-research/verification-commands.log`
- **纠正说明**：`docs/blog-ops/house-upgrade-stardew/media-research/correction-report.md`
- **未改**：`originals/` 内 PNG、`licenses/`、产品代码

## 1. 许可原文支持的范围

读过的本地文件：

- `licenses/wiki-copyrights.txt`
- `licenses/game-asset-terms.txt`

`wiki-copyrights.txt` 写的是：该站点内容受 CC BY-NC-SA 3.0 约束，并列出 Share、Remix、署名、非商业、相同方式共享。其中 “Your fair dealing or fair use rights, or other applicable copyright exceptions and limitations” 是许可文本里的权利保留句。本文件不据此判断本站使用是否成立。

`game-asset-terms.txt` 第 8–9 行引文是：

> This file (or parts of it) is copyright © ConcernedApe 2016
> This screenshot, texture, audio, song, or other Stardew Valley asset, or derivative of Stardew Valley assets, does not fall under the Stardew Valley Wiki's Terms of Service but is freely usable on this wiki.

这几句写出的范围是：

1. 文件（或其部分）标明版权人为 ConcernedApe，年份为 2016。
2. 该素材不落入 Stardew Valley Wiki 的 Terms of Service。
3. 可在 **this wiki**（该 Wiki）上自由使用。

本站使用依据：**未知**。

`freely usable on this wiki` 只写到该 Wiki。许可原文没有把这批图写成可以在本站按 Fair Use 或 Editorial 发布。同文件第 12–15 行另写了 fair dealing / editorial / fair use，那不是第 8–9 行引文；本角色不能改 `licenses/`，那几行不作为本站使用依据。

不建议直接发布这 8 张许可未确定的原图。角色 A、B 可以按第 3 节已打开后的画面事实另绘示意图。本文件不提供发布图注。

`game-asset-terms.txt` 第 4 行只给了一个示例页：`https://stardewvalleywiki.com/File:House_indoors_(tier_2).png`。这一行不能代替其余 7 张图的来源页。

## 2. 本地 8 张图的解码结果

目录：`docs/blog-ops/house-upgrade-stardew/media-research/originals/`

数字来自 `verification-commands.log`：Python 解压 IDAT 后 `DECODE_MATCH_COUNT 8/8`，`python_exit 0`；`file`、`wc -c`、`shasum -a 256` 各 8/8 且退出码 0。`sips` 第一次因命令写成 `sips ... -- 文件名` 得到 `sips_exit 1`（8/8）；去掉 `--` 后重跑 `SIPS_RERUN_EXIT0_COUNT 8/8`。PNG 文件本身未改。

| 文件 | 像素 | 解码格式 | 字节 | SHA-256 |
|---|---|---|---|---|
| `house-indoors-tier-2.png` | 1398 × 576 | PNG 8-bit indexed-color（IHDR color type 3，含 tRNS）。`file`：8-bit colormap。`sips hasAlpha=yes` | 27846 | `75e3edaeb82ae5d79f8b787a0a28adf212aa1aabc73c2ba04b92af59ce91ca59` |
| `house-indoors-tier-3.png` | 1639 × 1088 | PNG 8-bit indexed-color（IHDR color type 3，含 tRNS）。`file`：8-bit colormap。`sips hasAlpha=yes` | 95334 | `d37b3e02ff974cedb7127917450704a4d1761640ad04952341c58b49e0448789` |
| `cellar-inside.png` | 918 × 750 | PNG 8-bit truecolor-alpha（IHDR color type 6）。`file`：8-bit/color RGBA。`sips hasAlpha=yes` | 640720 | `42cc21bfed4b91690ef13985f9a287a626b7d040c8cc71f472ae2e9728f474e3` |
| `carpenters-shop-interior.png` | 498 × 394 | PNG 8-bit truecolor-alpha（IHDR color type 6）。`file`：8-bit/color RGBA。`sips hasAlpha=yes` | 178598 | `1e1ca78149950b1da78d529919130d10e2fda26434a5c209e81c0874d3f40d45` |
| `house-tier-1-starter.png` | 432 × 432 | PNG 8-bit indexed-color（IHDR color type 3，含 tRNS）。`file`：8-bit colormap。`sips hasAlpha=yes` | 6615 | `8bff180943bd50f528fa8083b8705520131f1e2e0d4de9fa6f650478d5d425ee` |
| `house-tier-2-exterior.png` | 144 × 144 | PNG 8-bit indexed-color（IHDR color type 3，含 tRNS）。`file`：8-bit colormap。`sips hasAlpha=yes` | 4028 | `76055598ad71cc8bddd7b23c22cff67ac7da1b7b3c54b597b1a71b5535d7fea1` |
| `house-tier-3-exterior.png` | 145 × 144 | PNG 8-bit indexed-color（IHDR color type 3，含 tRNS）。`file`：8-bit colormap。`sips hasAlpha=yes` | 3848 | `dd9ae705cea51f0c11a9aa80418af0ca9cca97b62dd38de884ef3919834dcc8c` |
| `robin-building.png` | 90 × 131 | PNG 8-bit truecolor-alpha（IHDR color type 6）。`file`：8-bit/color RGBA。`sips hasAlpha=yes` | 1750 | `e141ef57ab7c8a7904da58904264c4df247794d13c6bb49fba0d9be9810f3e7e` |

`carpenters-shop-interior.png` 的 SHA-256 是本轮补上的。纠正前该表行把画面描述放进了 SHA-256 列。

## 3. 来源页与打开后的画面

来源页、原图 URL 只统计纠正前已经写在 `media-inventory.md` 里的记录。本轮没有重新下载，因此没有把 URL 响应字节和本地文件比对。`media-research/` 里没有另外的来源记录。

| 文件 | 来源页与原图 URL |
|---|---|
| `house-indoors-tier-2.png` | 已列。来源页 `https://stardewvalleywiki.com/File:House_indoors_(tier_2).png`。原图 URL `https://stardewvalleywiki.com/mediawiki/images/c/cd/House_indoors_%28tier_2%29.png` |
| `house-indoors-tier-3.png` | 已列。来源页 `https://stardewvalleywiki.com/File:House_indoors_(tier_3).png`。原图 URL `https://stardewvalleywiki.com/mediawiki/images/0/0c/House_indoors_%28tier_3%29.png` |
| `cellar-inside.png` | 已列。来源页 `https://stardewvalleywiki.com/File:Cellar_Inside.png`。原图 URL `https://stardewvalleywiki.com/mediawiki/images/8/8a/Cellar_Inside.png` |
| `carpenters-shop-interior.png` | 已列。来源页 `https://stardewvalleywiki.com/File:Carpenter%27s_Shop_Interior.png`。原图 URL `https://stardewvalleywiki.com/mediawiki/images/a/ac/Carpenter%27s_Shop_Interior.png` |
| `robin-building.png` | 已列。来源页 `https://stardewvalleywiki.com/File:Robin_building.png`。原图 URL `https://stardewvalleywiki.com/mediawiki/images/2/22/Robin_building.png` |
| `house-tier-1-starter.png` | **缺失**。来源页未列，原图 URL 未列 |
| `house-tier-2-exterior.png` | **缺失**。来源页未列，原图 URL 未列 |
| `house-tier-3-exterior.png` | **缺失**。来源页未列，原图 URL 未列 |

下列只写本轮打开文件后看见的画面。像素风格不证明文件与游戏安装包一致，也不证明零 AI。本轮没有读取 `Content/Maps`、`Content/Buildings`、`Content/Characters`。

- `house-indoors-tier-2.png`：左侧蓝白格子地面，可见柜子、炉灶、水槽、冰箱；中部木地板、壁炉、桌椅、杯子和一块地毯；右侧隔间有一张双枕床。画面上没有楼梯。
- `house-indoors-tier-3.png`：下方有格子地面的厨房区、壁炉和右侧双枕床；中部有向上的木楼梯。上方左侧是深色木地板的空房间；上方右侧墙面有成排小恐龙图案，室内有一张婴儿床和两张小床。
- `cellar-inside.png`：左上有木楼梯，石砖地面，墙上两盏灯。中央三排棕色木桶，目视每排 11 个。右墙边另有木桶，左下有木桶状物体，右下有一小块深色地面。画面没有标出楼梯通向哪里。
- `carpenters-shop-interior.png`：多房间室内。左下有木柜台、圆木和收银机样物体；右下是浅色地砖房间，有桌和蓝色椅子；上方有一间深色卧室、一间红床房间，以及右侧灶台。画面没有对话框，也没有地址或人物姓名文字。
- `house-tier-1-starter.png`：木屋，左侧圆木堆，石烟囱，山墙圆窗，门左侧一扇带窗板的窗，门前红色脚垫和木平台。
- `house-tier-2-exterior.png`：红瓦、石烟囱、红门、门左侧一扇窗、左侧圆木、木平台。打开后没有看到二层窗户。
- `house-tier-3-exterior.png`：两层，上层两扇窗，门廊有立柱，左侧有石块，烟囱在屋顶右侧。目录里没有第二张外观图，不能用这一张证明另一级外观相同。
- `robin-building.png`：橙发人物，黄上衣，绿色下装，手持锤状物，站在棕色木框里。画面没有工期数字。

打开这 8 张时，肉眼没有看到网站名或角标文字。这只是打开后的观察，不是水印检测程序的结果。

## 4. 本轮未重开的旧记录

- 角色 M 写过 `https://www.stardewvalley.net/press/` 的新闻包里没有农舍升级室内图。本轮未重开该页。
- 角色 M 写过 Steam 指南页 `https://steamcommunity.com/sharedfiles/filedetails/?id=3118664526`。本轮未重开该页，不复核年份或版本。
- 本地 `inspected/steam-robin-menu.png` 已打开：可见上下黑边、鼠标光标，以及 Shop、Upgrade House、Construct Farm Buildings、Leave。该文件不在 8 张重算里。本站使用依据未知，不建议发布。
- 角色 M 写过 Wiki 上的 `Farmhouse_with_Attic.png`、`Dining_room.png`。本轮未打开这些文件，目录里也没有它们。

## 5. 交接

8 个 PNG 仍在 `originals/`。许可未确定，不作为直接发布的配图。A、B 可按第 3 节画面另绘示意图。
