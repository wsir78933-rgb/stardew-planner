# M2 媒体证据纠正报告

- 角色：M2。日期：2026-10-15。工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 允许改动的文件：`provenance.md`、`media-inventory.md`、本报告、`verification-commands.log`
- 未改 PNG，未改 `licenses/`，未改其他角色文件，未联网补来源，未写正文图注

## 1. 纠正前原文里的具体问题

### 1.1 `provenance.md` 原第 27 行把 Wiki 站内用语写成了本站许可

原文：

> **法律结论**：本批农舍图像均属于 ConcernedApe 官方游戏原始素材与截屏，其版权归 ConcernedApe 所有，不属于自由 CC 许可。用于本站博客指南属于事实说明性引用（Fair Use / Editorial Game Documentation）。对外发布必须保留 ConcernedApe 署名及来源出处，不得宣称拥有商业转授权。

`game-asset-terms.txt` 第 8–9 行只写了 copyright © ConcernedApe 2016、不落入 Wiki Terms of Service、freely usable on this wiki。`wiki-copyrights.txt` 的 fair dealing / fair use 句是 CC 文本中的权利保留，不是对本站使用的授权。原第 27 行超出这两份原文。

同目录 `licenses/game-asset-terms.txt` 第 12–15 行也写了 fair dealing / editorial / fair use。那不是引文。本角色不能改该文件，故只报告，未改。

### 1.2 `provenance.md` 原第 63–64 行在未读游戏文件时给出吻合与零 AI 保证

原文：

> 入库素材均为 ConcernedApe 原版 16-bit 风格的像素阵列，色块边界锐利对齐网格，各图元与游戏 `Content/Maps`、`Content/Buildings`、`Content/Characters` 贴图 100% 吻合。
> 确认**零 AI 生成图**，无任何把 AI 假图伪装成游戏截屏的情况。

本轮没有读取这些游戏目录。像素外观不能充当该保证。原第 59–61 行「确认无任何水印」同样写成了检测结论；打开后只保留肉眼未见网站名或角标文字。

### 1.3 `carpenters-shop-interior.png` 在 provenance 表中没有 SHA-256

原表该行在字节数 `178,598` 之后直接是「木匠工坊全景……」，SHA-256 列为空，描述串列。`media-inventory.md` 原第 87 行已有一枚 SHA-256；本轮仍按本地文件重算，不沿用旧自报作为验证。

### 1.4 连带超出原文或与打开后的画面不符的句子

- `media-inventory.md` 原开头写「可公开引用」。
- 原第 25 行建议用具体金币和材料数字做表。本轮未核对这些数字，已从建议句删除，不在这里重抄。
- 原第 115 行写 Steam 图「存在商业引用合规瑕疵」。已读许可文件没有覆盖该图的本站使用。
- 原第 120 行写 8 张均为 Wiki「原始无损游戏资产抽取」。
- 原第 128–130 行给出 Fair Use / 资料引用的中英文发布图注。
- 三张外观图在两份原文件里都没有来源页和原图 URL。
- 原 provenance 对 `house-tier-2-exterior.png` 写「上层新增阁楼采光窗」。本轮打开该 144×144 文件后，看见的是红门和门左侧一扇窗，没有二层窗户。
- 原记录写 Upgrade 3 外观与 `house-tier-3-exterior.png` 完全相同。目录里没有第二张外观文件。
- 原记录把木匠铺房间写成特定 NPC、把罗宾图写成 3 天工期、把地下室楼梯写成通向厨房。这些文字不在打开后的画面里。

## 2. 本轮已做的改动

- `provenance.md`：删掉 Fair Use / Editorial 法律结论；本站使用依据改为未知；写明不建议直接发布这 8 张原图；A/B 只可按已打开画面另绘。
- 用本地解码结果重写 8 张图的格式、像素、字节、SHA-256。补上 `carpenters-shop-interior.png` 的 SHA-256：`1e1ca78149950b1da78d529919130d10e2fda26434a5c209e81c0874d3f40d45`。
- 5 张图的来源页和原图 URL 标明为纠正前清单已列，并注明未重新下载。3 张外观图标明来源页缺失、原图 URL 缺失。
- 画面描述改为本轮打开后看见的内容。去掉 100% 吻合和零 AI。
- `media-inventory.md`：同一套测量数字；去掉可粘贴发布图注和未核费用数字；Steam 图改为使用依据未知。
- 新增 `verification-commands.log` 与本报告。

## 3. 命令、退出码、通过数

日志路径：`docs/blog-ops/house-upgrade-stardew/media-research/verification-commands.log`

记录时间：`recorded_at_utc 2026-10-15T14:09:51Z`。`sips` 重跑时间见日志 `sips_rerun_utc`。

| 检查 | 结果 | 退出码 |
|---|---|---|
| Python 解 PNG 签名、IHDR、IDAT inflate，8 张 `DECODE_SIZE_MATCH True` | `DECODE_MATCH_COUNT 8/8` | `python_exit 0` |
| `file --brief` | `FILE_EXIT0_COUNT 8/8` | 每张 `file_exit 0` |
| `wc -c` | `WC_EXIT0_COUNT 8/8` | 每张 `wc_exit 0` |
| `shasum -a 256` | `SHASUM_EXIT0_COUNT 8/8` | 每张 `shasum_exit 0` |
| `sips -g ... -- 文件名` | `SIPS_EXIT0_COUNT 0/8` | 每张 `sips_exit 1`。原因是本机 `sips` 不接受 `--`，stdout 为 `unknown function "--"` |
| `sips -g format -g formatOptions -g pixelWidth -g pixelHeight -g hasAlpha 文件名` | `SIPS_RERUN_EXIT0_COUNT 8/8` | 每张 `sips_exit 0` |
| 纠正前 `stat` 8 个 PNG | 8 条 mtime/size | `stat_exit 0` |

未运行产品 typecheck、lint、test、build。本任务不改产品代码。

除上述第一次 `sips --` 为命令写错外，8 张图的解码、`file`、`wc`、`shasum` 和第二次 `sips` 均为通过。失败数：第一次 `sips` 8 次退出码 1；该失败不表示 PNG 损坏。

## 4. 未验证项

- 未读取游戏 `Content/Maps`、`Content/Buildings`、`Content/Characters`，没有全库贴图比对。
- 未重新下载 Wiki。已列 URL 与本地字节是否相同：未知。
- 未重开 Press 页和 Steam 指南页。发布年份、1.6 菜单差异、新闻包目录：未在本轮复核。
- 中央木桶「每排 11」是打开图片后的目视计数，不是逐像素标注。
- `licenses/game-asset-terms.txt` 第 12–15 行仍在，未改。
- 未对 `inspected/steam-robin-menu.png` 重算哈希；它不在 8 张任务范围内。打开后只记录了黑边、光标和四行菜单文字。

## 5. 范围外，只报告不处理

- 主工作区与「博客」工作树未写入。当前仓库顶层是博客 2：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。
- 未 commit、merge、push、deploy，未安装依赖，未改 Hermes 或用户规则。
