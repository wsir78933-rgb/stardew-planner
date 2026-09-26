# C-zh 修订第 1 轮记录

## 范围与结论

- 角色：C-zh；自动修订预算第 1/3 轮。
- 日期：2026-09-26（Asia/Shanghai）。模式为 `content-only`，只修中文正文、中文媒体清单和三张既有中文 SVG；未读取或修改英文稿、布局、研究、审核报告、网站代码或其他项目文件。
- 输入审核材料：`reviews/D-zh.md`、`reviews/media-readability.md`，以及三张失败窄屏截图 `reviews/media-evidence/zh-flow-narrow.png`、`zh-stage-narrow.png`、`zh-strawberry-narrow.png`。截图显示原图在 390px 下分别发生宽度裁切；D-zh 另指出 V2 只有无肥料基准条带，草莓日期承担重复作用。
- 结论：本轮已完成允许范围内的局部修订和机械/渲染预检；D、M、E 均未由本角色代签，仍需独立复验新版本。

## 本轮实际改动

### 中文正文

`drafts/body-zh.md` 仍从导语开始，没有新增 H1，字节为 NFC/LF；读者术语改为中文优先：首次写作“生长激素（Speed-Gro）”和“成长速度修正值（modifier）”，后文普通说明统一使用“修正值”，档位写为“高级生长激素（Deluxe Speed-Gro）”与“顶级生长激素（Hyper Speed-Gro）”。

V2 图位现在可在图中逐档核对完整阶段向量，且没有改动原日期规则：

| 作物 | 无肥料 | 生长激素 10% | 高级 25% | 顶级 33% |
| --- | --- | --- | --- | --- |
| Parsnip | `[1,1,1,1]` → 春季第 5 日 | `[1,0,1,1]` → 春季第 4 日 | `[1,0,1,1]` → 春季第 4 日 | `[1,0,0,1]` → 春季第 3 日 |
| Melon | `[1,2,3,3,3]` → 夏季第 13 日 | `[1,1,2,3,3]` → 夏季第 11 日 | `[1,1,2,2,3]` → 夏季第 10 日 | `[1,1,2,2,2]` → 夏季第 9 日 |

草莓段保留一处完整日期表：无肥料为春季第 21 日、春季第 25 日；Speed-Gro 为春季第 20 日、春季第 24 日、春季第 28 日。删除相邻段落的同义日期重述和结尾重复总结，保留必要的图注及“不要把首次成长修正值套到再生长字段”的误读边界；未加入购买、收益或其他搜索意图。

### 三张中文 SVG

- `speed-gro-application-flow.svg`：改为 390×1040 的窄幅纵向流程卡，保留已锄地、播种前/后/成长中、首次成长/首次收获、成熟后再生长和互斥/换季限制。
- `speed-gro-stage-comparison.svg`：改为 390×1160 的纵向双卡，Parsnip 与 Melon 各列无肥料、10%、25%、33% 四行及其实际阶段数字和日期，不再用仅一条无肥料条带代表所有档位。
- `strawberry-harvest-timeline.svg`：改为 390×1040 的纵向时间线卡，保留春季第 13 日起点、无肥料春季第 21/25 日、生长激素春季第 20/24/28 日及固定 4 天再生长边界。

三张图的正文文字最小字号均为 14px；窄屏直接打开时以垂直高度滚动，不依赖把旧 1200/1280px 图整体缩小。`media-zh.json` 新增 `pathBase: "manifest-directory"`，三条 `path` 均改为相对 `drafts/` manifest 目录的 `../assets/zh/...`；正文的三个图片链接仍以相同基准解析到真实文件。

## 实际验证命令与退出码

| 命令/动作 | 退出码或结果 | 关键真实输出 |
| --- | ---: | --- |
| `sed -n ... /Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md` | 0 | 读取 content-only、C/D/M 独立边界、公开引用和事实/演算/实测区分。 |
| `sed -n ... reviews/D-zh.md reviews/media-readability.md` | 0 | 读取 D-zh 的 V2/术语/草莓重复问题及 M 的 390px 裁切、manifest 基准问题。 |
| `view_image` 三张 `zh-*-narrow.png` | 工具成功；无 shell 退出码 | 实际看到旧 flow、stage、strawberry 图分别只显示左侧内容；未修改截图。 |
| `xmllint --noout docs/blog-ops/stardew-valley-speed-gro/assets/zh/*.svg` | 每个 0 | 三张 SVG 均可解析。 |
| `node -e 'JSON.parse(...)'`（`drafts/media-zh.json`） | 0 | `media-zh.json JSON_PARSE_EXIT=0`。 |
| Python manifest/body path resolver | 0 | `pathBase=manifest-directory`；三条 manifest path 和正文三条 `../assets/zh/...` 链接均 `exists=True`。 |
| `ego-browser nodejs`：390×844 viewport，逐一打开三张本地 SVG并回读 DOM 度量 | 0 | flow `scrollWidth=390/clientWidth=390`、stage `390/390`、strawberry `390/390`；三者 `minTextFont=14`、横向文字越界数 `0`、纵向文字越界数 `0`，高度分别 1040/1160/1040，可垂直滚动。 |
| `ego-browser nodejs ... task.finish({keep:[]})` | 0 | 仅关闭本轮由本角色创建的 ego-browser 任务空间；未保留页面。 |
| V7 原计数：`python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md --locale zh-CN --exclude-heading '参考来源'` | 0 | `mechanical_units=2704`、`required_floor=2000`、`meets_mechanical_floor=true`；`sha256_raw=6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4`，NFC/LF 同值。 |
| V7 读回 `extract_body` 后移除三行独立图注，再 `count_units(..., 'zh-CN')` | 0 | 图注排除 `140` 汉字；`qualified_units_excluding_captions=2564`；仍高于 2000。该值是计数预检，不替代 D/E/F 的语义/锁稿结论。 |
| Python XML 结构核对 V2 | 0 | 四个档位行标签各出现 2 次；Parsnip 行各 4 个阶段格、Melon 行各 5 个阶段格；七个首次日期结果字符串均存在。 |
| `shasum -a 256` 五个修订对象 | 0 | 见下方哈希表。 |

## 当前哈希与文件清单

本轮允许范围内实际写入文件如下；未写入 `src/`、`public/`、`package.json`、`AGENTS.md`、`WORKLOG.md`、英文稿、研究、布局或审核报告。

| 文件 | SHA-256 |
| --- | --- |
| `docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md` | `6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4` |
| `docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json` | `4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5` |
| `docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| `docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| `docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |
| `docs/blog-ops/stardew-valley-speed-gro/editorial/C-zh-r1.md` | 本报告；待写入后以最终 `shasum -a 256` 回读为准 |

## 公开来源 URL

本轮没有新增事实；以下是正文/媒体继续使用并与数字、规则或术语对应的公开 URL：

- <https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0>
- <https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0>
- <https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99>
- <https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93>
- <https://stardewvalleywiki.com/Speed-Gro?oldid=190630>
- <https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196>
- <https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377>
- <https://stardewvalleywiki.com/Fertilizer?oldid=194274>
- <https://stardewvalleywiki.com/Farming?oldid=191914>
- <https://stardewvalleywiki.com/Parsnip?oldid=191123>
- <https://stardewvalleywiki.com/Melon?oldid=193510>
- <https://stardewvalleywiki.com/Strawberry?oldid=192732>
- <https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875>
- <https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629>
- <https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english>
- <https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/>

## 未完成与边界

- 本记录是 C-zh 修订和预检，不是 D-zh、M 或 E-zh 的独立通过结论；其旧报告哈希不再绑定当前版本，需由对应角色按新哈希复验。
- 未装配网站、未构建、未部署、未提交、未推送、未安装依赖、未处理密钥、未进行外部写入；也未改日期规则、研究事实或英文稿。
