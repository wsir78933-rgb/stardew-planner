# C-zh 修订第 2 轮记录

## 结论先行

- 角色：C-zh；自动修订预算第 2/3 轮；日期：2026-09-26（Asia/Shanghai）。
- 本轮只处理 `reviews/E-zh.md` 指出的 `E-ZH-REF-01`、`E-ZH-REF-02`，以及同报告关于三档生长激素施用时机的引用完整性建议。
- 中文正文局部引用修订已完成；本记录不签署 D 或 E 的通过结论。修订后的同一正文必须交 D 做三门全量复验，再交 E 绑定新 hash 复核；在两者完成前不得交 F 锁稿。
- 未重新搜索已核来源，未重复浏览器媒体验收；新增链接均为 E-zh 已实际核对过的公开固定页面或已有中文来源。

## 精确差异

只修改 `drafts/body-zh.md` 的四个引用位置，没有改写事实、算法、日期、图、manifest、英文稿或旧报告。

### 1. 首段的 10% 近邻来源（`body-zh.md:1`）

```diff
-这里最容易混淆的地方是“加速 10%”并不等于日历一定少 10%：真正的首次收获日还取决于作物的成长阶段、阶段日数和施用时机。
+这里最容易混淆的地方是“加速 10%”（[生长激素中文条目](https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0)）并不等于日历一定少 10%：真正的首次收获日还取决于作物的成长阶段、阶段日数和施用时机。
```

仅在已有“生长激素”中文来源旁增加描述性链接，没有增加效果承诺。

### 2. 三档施用时机的逐一来源（`body-zh.md:27`）

```diff
-三种生长激素的资料都允许播种前、播种后或任何成长阶段施用，[Speed-Gro 的条目](https://stardewvalleywiki.com/Speed-Gro?oldid=190630) 还说明，晚一点施用时只会按尚未完成的成长阶段处理，不会把已经通过的阶段追回来。
+三种生长激素的资料都允许播种前、播种后或任何成长阶段施用：[Speed-Gro 的条目](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)、[Deluxe Speed-Gro 的条目](https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196) 与 [Hyper Speed-Gro 的条目](https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377) 都列出这些时机；Speed-Gro 条目还说明，晚一点施用时只会按尚未完成的成长阶段处理，不会把已经通过的阶段追回来。
```

保留原有“晚一点施用只按尚未完成阶段处理”的限定，并将已核三档固定页面贴近“三种时机”主张；没有新增规则或数字。

### 3. Coffee Bean 的 2 天近邻来源（`body-zh.md:96`）

```diff
-2. **我想提前的是第一次成熟，还是下一次再生长？** Speed-Gro 适合判断第一次成长和首次收获；若目标是缩短草莓成熟后的 4 天、咖啡豆成熟后的 2 天等再生长间隔，它不是这个判断的依据。
+2. **我想提前的是第一次成熟，还是下一次再生长？** Speed-Gro 适合判断第一次成长和首次收获；若目标是缩短草莓成熟后的 4 天、[咖啡豆条目中的 2 天](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)等再生长间隔，它不是这个判断的依据。
```

文末来源清单同步新增一条，不改变原有“再生长间隔不是这个判断依据”的读者结论：

```diff
- [草莓 - 星露谷物语中文维基](https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93)
+- [Coffee Bean - Stardew Valley Wiki（固定版本页面）](https://stardewvalleywiki.com/Coffee_Bean?oldid=193175)
 - [Speed-Gro - Stardew Valley Wiki（固定版本页面）](https://stardewvalleywiki.com/Speed-Gro?oldid=190630)
```

上面第一条 diff 行中的草莓 URL 仅为上下文；实际文件中的 URL 未被改动。

## 版本、哈希与文本规范化

### 正文

- 修订前 body hash（`reviews/E-zh.md` 绑定版本）：`6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`。
- 修订后直接读取实际文件得到：`a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`。
- 新正文 14,071 bytes；NFC 与 LF 规范化 hash 同为 `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；`nfc_equal=true`、`crlf=0`、`lone_cr=0`、`lf=113`、`ends_lf=true`。

### 未改动的 manifest 与三张中文 SVG

以下值由 `shasum -a 256` 直接对实际文件字节计算；与 E-zh 旧报告所绑定的对应值一致。

| 文件 | 当前 SHA-256 | NFC/LF hash | 结果 |
| --- | --- | --- | --- |
| `drafts/media-zh.json` | `4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5` | 同左 | 未改动 |
| `assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` | 同左 | 未改动 |
| `assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` | 同左 | 未改动 |
| `assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` | 同左 | 未改动 |

四个文件均为 UTF-8 NFC、LF；三张 SVG 的 `crlf=0`、`lone_cr=0`，且均以 LF 结尾。没有修改 `media-zh.json` 或任何 SVG 内容。

## 计数范围与真实输出

### 旧报告的两个数字不是同一排除范围

- E-zh 旧报告的 `2782` 来自没有 `--exclude-heading` 的 V7 调用：它包含“参考来源”清单，也包含三行图注；V7 脚本会自动移除图片 alt，不把 alt 算入汉字。
- D-zh-r1 的 `2704` 来自带 `--exclude-heading '参考来源'` 的 V7 调用：它排除了“参考来源”清单，但仍包含三行图注。
- 因此不能把 E 的 `2782` 与 D 的 `2704` 当成同一排除范围，也不能把任一机械值当作 D/E/F 语义通过。

### 修订后 V7 原始计数

实际命令（退出码 `0`）：

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md" --locale zh-CN
```

真实输出关键字段：

```json
{
  "mechanical_units": 2812,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "excluded_heading_sections": [],
  "omitted_line_counts": {"headings": 11, "code": 0, "excluded_sections": 0, "non_body": 46, "frontmatter": 0},
  "sha256_raw": "a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2",
  "sha256_nfc_lf": "a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2"
}
```

### 修订后排除来源的机械值

实际命令（退出码 `0`）：

```sh
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md" --locale zh-CN --exclude-heading "参考来源"
```

真实输出关键字段：

```json
{
  "mechanical_units": 2728,
  "required_floor": 2000,
  "meets_mechanical_floor": true,
  "excluded_heading_sections": ["参考来源"],
  "omitted_line_counts": {"headings": 11, "code": 0, "excluded_sections": 14, "non_body": 45, "frontmatter": 0},
  "sha256_raw": "a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2",
  "sha256_nfc_lf": "a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2"
}
```

### 去除图注、alt、来源后的合格预检

实际只读命令为 `python3 - <<'PY'`，加载 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py` 的 `extract_body` 与 `count_units`，传入 `extract_body(raw_text, ['参考来源'])`，再过滤抽取结果中以 `图 ` 开头的三行图注；退出码 `0`。真实输出：

```json
{
  "source_excluded_mechanical_units": 2728,
  "caption_lines_removed": 3,
  "caption_units_removed": 140,
  "alt_units_in_extracted_body": 0,
  "qualified_units_excluding_captions_alt_sources": 2588,
  "omitted_line_counts": {"headings": 11, "code": 0, "excluded_sections": 14, "non_body": 45, "frontmatter": 0}
}
```

这里的 `2588 = 2728 - 140`；alt 已在 V7 的 `inline_text()` 图片语法抽取阶段移除，来源清单由 `--exclude-heading "参考来源"` 排除。该值只是计数预检，不能替代 D/E 独立复验或 F 锁稿。

## 实际验证命令、退出码与边界

| 命令/动作 | 退出码/结果 | 真实回读 |
| --- | ---: | --- |
| `sed -n '1,260p' '/Users/wusir/.mirasim/skills/ego-browser/SKILL.md'` 与 `sed -n '261,520p' ...` | 0 | 已读取 ego-browser 的 TaskSpace、页面复用、结束时 `finish({keep: []})` 和只读观察规则；本轮未创建浏览器空间。 |
| `sed -n '1,220p' '/Users/wusir/Desktop/博客-V7修订版/执行入口.md'`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md`、`02-内容生产与质量门.md` | 0 | 已读取 content-only 边界、C/D/E 独立职责、公开引用支持性、NFC/LF 与计数排除规则。 |
| `sed -n '1,320p' 'reviews/E-zh.md'` 与 `sed -n '1,220p' 'drafts/body-zh.md'` | 0 | 实际读到 E-ZH-REF-01、E-ZH-REF-02 和三档引用完整性建议；没有用旧报告代替当前正文读回。 |
| `rg -n -F` 检查中文生长激素、Speed-Gro、Deluxe、Hyper、Coffee Bean 五个固定 URL 及关键日期 | 0 | 五个新/近邻引用均在正文或来源清单中；春季第 13/20/21/24/25/28 日等既有日期仍存在。 |
| `shasum -a 256` 读取正文、manifest 和三张中文 SVG | 0 | 正文为 `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；manifest 与三张 SVG 的 64 位十六进制 hash 见上表，均与修订前一致。 |
| Python UTF-8/NFC/LF 只读检查（实际文件字节） | 0 | 正文 `nfc_equal=true`、`crlf=0`、`lone_cr=0`、`lf=113`；五个文件的 raw 与 NFC/LF hash 各自相同。 |
| 两次 V7 计数命令与一次合格预检 | 0、0、0 | 当前原始值 `2812`，排除来源值 `2728`，排除图注/alt/来源值 `2588`；没有将 E 旧 `2782` 与 D 旧 `2704` 混报。 |

本轮没有安装依赖、没有网站装配、没有改 `src/`、`public/`、`package.json`、`AGENTS.md` 或 `WORKLOG.md`，没有处理密钥、提交、推送、部署或外部写入。

## 来源 URL

本轮没有新增事实；以下公开 URL 已由 E-zh 先前实际打开并支持本轮保留的原有主张：

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175

## 文件清单与独立复验交接

本轮允许范围内的实际写入文件：

- 修改：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md`
- 新增：`/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/editorial/C-zh-r2.md`

确认未写入：`drafts/media-zh.json`、三张中文 SVG、英文稿、研究、布局、任何旧审核报告、网站源码、依赖或项目规则文件。

下一步交接：

1. D-zh 对 `body-zh.md` 的新 hash `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2` 全量重做 ResearchTrace、ReaderValue、Repetition 三门。
2. E-zh 在 D 完成后独立复核受影响的事实、三档引用、Coffee Bean 来源、22 条鉴文规则和新 hash；不得沿用旧 E-zh FAIL/PASS 或 C 自评。
3. D/E 均完成前保持“待独立复验”，不签署 PASS，不进入 F 锁稿。
