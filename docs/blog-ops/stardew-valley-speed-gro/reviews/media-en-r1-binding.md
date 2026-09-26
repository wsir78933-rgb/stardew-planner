# M-en r1 版本绑定补充（英文媒体）

## 范围与结论

- 角色：M-en 版本绑定补充；只核对当前英文正文、manifest、两张 SVG、四张既有 PNG 与旧 `media-en-r1.md` 的 hash 绑定。
- 复核日期：2026-09-26（Asia/Shanghai）。
- 归档依据：公开 Orca `worker-read` 读取 `ctx_29daf7b5dc77`，退出码 0；归档标记 `sourceExact=true`、`archived=true`，历史 worker 为 `succeeded`，terminal 为 `exited`。归档内容有平台标记的裁剪，因此本补充不把 worker 自报当作当前文件证据；当前 hash 以本轮实际 `shasum` 为准。
- 结论：8 项当前文件均得到真实 SHA-256；7 项与旧 M 报告完整匹配，1 项仅为旧 M 报告的抄录错误。`drafts/media-en.json` 当前实际 hash 为 64 位 `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0`，旧 M 表格漏写末尾 `0`，只留下 63 位前缀 `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e`；没有完整 64 位 hash 的实质不匹配。
- 因四张 PNG、两张 SVG 与正文 hash 均匹配，旧 M 报告的截图证据仍可绑定到当前版本，无需重新打开浏览器或修改图片。此文件只澄清版本绑定，不重签 M 的视觉结论，也不代签 E、网站装配、部署或用户终审。
- 未改正文、manifest、SVG、PNG、旧报告、网站源码、`public`、`package.json`、AGENTS 或 WORKLOG；未安装依赖、未提交/推送/部署、未处理密钥、未做外部写入。

## 当前文件与旧 M 报告逐项对照

文件根目录：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/`

| 文件 | 本轮 `shasum -a 256` | 旧 `reviews/media-en-r1.md` 值 | 长度（本轮/旧） | 判定 |
| --- | --- | --- | ---: | --- |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e` | 64 / 63 | ERRATA：旧报告漏写末尾 `0`，不是文件变化 |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-desktop.png` | `b3098a8d28045176d012d4375866b37c8b8c98206ebe8f11d4012b242389df80` | `b3098a8d28045176d012d4375866b37c8b8c98206ebe8f11d4012b242389df80` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-narrow.png` | `994bd9990e5859ff15fd56d785c4ffffd1454280ca7e0ea40841ae4c63ad2b4f` | `994bd9990e5859ff15fd56d785c4ffffd1454280ca7e0ea40841ae4c63ad2b4f` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-desktop.png` | `833586c3e23335198c0e8d13c9d60a28fcffb18a90d649db7af9038f3667cef4` | `833586c3e23335198c0e8d13c9d60a28fcffb18a90d649db7af9038f3667cef4` | 64 / 64 | MATCH |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-narrow.png` | `6ab26d7c300ab25afb91482cecaab2651f5719902ddc77718d57737abd97ef59` | `6ab26d7c300ab25afb91482cecaab2651f5719902ddc77718d57737abd97ef59` | 64 / 64 | MATCH |

绑定汇总：`matched=7`、`errata=1`、`mismatch=0`。因此不存在“除可证抄写错误外的实质文件变更”；旧 M 的四张截图与两张 SVG 可以按原报告绑定继续使用。旧 M 报告本身不在本任务允许的修改范围内，故未回写该 errata。

## 公开 Orca 归档绑定

本轮只读取公开 `worker-read` 归档 `ctx_29daf7b5dc77`，不读取私有会话。归档投影确认：`taskId=task_f653eee2c676`、`runId=run_fd109729e262`、`sourceExact=true`、`archived=true`、`outcome=succeeded`、`liveness=exited`；归档的历史媒体证据路径与本表四张 PNG 路径一致。归档中旧 worker 的浏览器与视觉判断仅作为历史上下文；本补充不重新签署那些判断。

## 实际命令与退出码

以下命令均在工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行；文件路径使用本任务目录的完整绝对路径。

| 命令 | 退出码 | 关键真实输出或用途 |
| --- | ---: | --- |
| `sed -n '1,260p' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md'` | 0 | 读取当前英文正文；未写入 |
| `sed -n '1,120p' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json'` | 0 | 读取 `schemaVersion=1`、`locale=en`、`pathBase=manifest-directory`、2 个 asset 及 5 个来源 URL |
| `sed -n '1,280p' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-en-r1.md'` | 0 | 读取旧 M 报告的 4 个材料 hash、4 个截图 hash、历史命令和来源 URL |
| `shasum -a 256 '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-narrow.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-narrow.png'` | 0 | 8 个实际 hash；唯一发现是 `media-en.json` 的旧报告值少 1 个末尾 `0` |
| `file '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/melon-narrow.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-desktop.png' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence-en-r1/strawberry-narrow.png'` | 0 | PNG 尺寸为 1440×1070、390×1070、1440×1250、390×1250 |
| `node --input-type=module -e '<旧报告 hash 与当前文件逐项比较器>'` | 0 | `HASH_BINDING_SUMMARY matched=7 errata=1 mismatch=0` |
| `orca orchestration worker-read --dispatch ctx_29daf7b5dc77 --source transcript --limit 200 --json` | 0 | `sourceExact=true`、`archived=true`、历史 worker `succeeded`、terminal `exited` |
| `orca orchestration check --terminal term_afa94f3a-323a-4db2-9eab-f2d536c1d107 --json` | 0 | 本轮检查时 `messages=[]`、`count=0` |

注：上表的 `shasum` 与 `file` 命令均使用本轮实际绝对路径；报告中的命令文本不改变任何文件。`node` 比较器的实际输出逐项列于本报告的 hash 表。

## 绑定文件清单

- 新增：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-en-r1-binding.md`
- 只读输入：`body-en.md`、`media-en.json`、`assets/en` 两张 SVG、`reviews/media-evidence-en-r1` 四张 PNG、旧 `reviews/media-en-r1.md`、公开 Orca 归档 `ctx_29daf7b5dc77`。
- 未生成或修改浏览器截图；未创建 ego-browser TaskSpace，因此无须关闭浏览器任务空间。

## 来源 URL

以下 5 个 URL 是当前英文 `media-en.json` 中实际记录并与两张媒体主张关联的公开来源；本补充仅核对本地版本绑定，不重新核验上游页面内容：

- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
