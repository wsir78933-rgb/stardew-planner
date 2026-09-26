# C-en r1 局部修订记录

## 结论

英文局部修订已完成，范围限定为 E-en、D-en 与 media-readability.md 已指出的媒体窄屏可读性问题，以及协调者要求消除的 `ceil` 对象歧义。英文正文仍无 H1，正文没有引入新的未核验事实；本记录不代替 D、E 或 M 对新同版 hash 的独立复验，也不称网站装配或用户终审完成。

## 本轮输入与范围

- 关键词：`stardew valley speed gro`
- 站点：<https://stardewvalleyplanner.art>
- 模式：`content-only`
- 允许写入：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md`、`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json`、两张 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/*.svg`，以及本文件。
- 明确未改：中文稿、研究、布局、审核文件、网站 `src/`/`public/`、`package.json`、AGENTS、WORKLOG；未安装依赖、未提交/推送/部署、未处理密钥、未做外部写入。
- 依据：完整读取 `/Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`/Users/wusir/Desktop/博客-V7修订版/01-统一工作流.md`、`/Users/wusir/Desktop/博客-V7修订版/参考规则/事实核验与公开引用.md`、本任务要求的 `E-en.md`、`D-en.md`、`media-readability.md` 与英文窄屏失败截图。

## 实际修订

### 正文

在 `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md`：

- 将算法解释写成 `ceil(baseDays × effective modifier)`；明确向上取整的是乘积所得的待移除 stage-days，不是 modifier 本身。
- Figure 1 的 alt/caption 同步使用同一准确措辞，并保留 Melon 的阶段向量、四档有效日数、Summer 13/11/10/9 日期、来源与“source-based calculations—not a playtest”边界。

### 媒体与清单

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` 改为 390×1070 的窄幅纵向卡片布局；四张卡逐一显示完整 `[1, 2, 3, 3, 3]` 阶段向量、modifier、stage-days removed、effective first growth 和 Summer 13/11/10/9 首收日期。
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` 改为 390×1250 的窄幅纵向时间线；四张卡逐一显示 Spring 13 播种、首收日期、后续 `+4-day regrowth` 日期、Spring 29 越界标记和 `[1, 1, 2, 2, 2]` 向量。
- 两张 SVG 的 CSS 字号最小值为 14px，根尺寸与 viewBox 均以 390px 宽声明，图高大于 390×844 窄屏视口，避免用整体缩小宽图解决问题。
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` 统一保留从 `drafts/` 目录解析的 `../assets/en/...` 路径，新增 `pathBase: "manifest-directory"` 与 390px 宽/实际高度；Melon caption/alt 与正文的 `ceil` 说明同步。

协调者指出旧 E-en 报告中额外的 Parsnip Agriculturist 行与 facts 的 `3/2/2` 不一致。本轮没有把该旧报告数字写入正文或媒体；该报告项留给 E-r1 独立复算与更正，不扩大 C-en 修订范围。

## 来源 URL

本轮只保留并复用原已核验来源，没有新增主题事实：

- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>

## 实际验证与退出码

以下命令均在工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行：

| 命令/动作 | 退出码 | 结果 |
|---|---:|---|
| `xmllint --noout` 两张英文 SVG | 0 | XML 合法。 |
| Node JSON 解析并校验 `pathBase` | 0 | `media_json_valid assets=2 pathBase=manifest-directory`。 |
| Node 解析 manifest 路径并检查文件存在 | 0 | 两个 `../assets/en/...` 均从 `drafts/` 正确解析。 |
| `file` 两张英文 SVG | 0 | 均识别为 SVG。 |
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' --locale en .../drafts/body-en.md` | 0 | `mechanical_units=2391`，`required_floor=2000`，机械门通过；语义资格仍需独立审核。 |
| Node NFC/LF 检查四个允许修改的目标文件 | 0 | 均为 NFC、LF，无 CR。 |
| `git diff --check` 四个正文/清单/SVG目标 | 0 | 无空白错误。 |
| Node 正文/媒体路径、数据 token、390px 根尺寸、无 `<image>` 一致性检查 | 0 | `media_body_consistency=PASS assets=2`；两张 SVG `font_min=14`。 |
| `rg -n '^# ' .../drafts/body-en.md` | 1 | 无 H1；退出码 1 表示无匹配。 |
| `ego-browser nodejs` 直接 `file://` 打开两张 SVG，390×844 预检 | 0 | 首版纵向媒体已测得 `scrollHeight=1070/1250`、`minFontSize=14`、无横向滚动；首版 Melon 长 section 标题越过右边 2.58px，随即缩短为 `CALCULATED STATES · FULL VECTORS`。按 ego-browser 规则已关闭该任务空间；修订后的标题由 XML/静态边界检查覆盖，仍需 D/E/M 对最终版本重新浏览器复验。 |

## 新版本 SHA-256

| 文件 | SHA-256 |
|---|---|
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json` | `fcd51c9a5f33228b83985dbf9129b5dffb45303a409aca7e4e9c959dc66df0e0` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |

## 剩余事项

- D-en、E-en 与 media-readability 角色必须针对上述同版文件和新 hash 重新独立复验，尤其是两张 SVG 在 390px 的实际渲染；本文件不签发 D/E/M PASS。
- E-r1 应独立复算并处理旧 E-en 报告中的 Parsnip Agriculturist 行差异；C-en 未将其写入文章。
- 本任务保持 content-only；未进行网站装配、页面验收、用户终审或生产发布。
