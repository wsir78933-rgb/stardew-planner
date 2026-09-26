# M-zh 媒体独立复验（第 1 轮）

## 结论与边界

- 角色：M-zh；日期：2026-09-26（Asia/Shanghai）；模式：`content-only`。
- 本轮只复验修订后的 `body-zh.md`、`media-zh.json` 和 `assets/zh/*.svg`。旧的 `reviews/media-readability.md` 与 `editorial/C-zh-r1.md` 仅用于定位旧问题；C-zh 的自评不作为通过证据。
- 三张中文 SVG 均通过本地 ego-browser 的直接 `file://` 渲染复验：桌面 1440×1000 与窄屏 390×844 均无横向裁切，截图中无可见文字重叠；必要文字的浏览器计算字号最小为 14px，日期和阶段结果可读。
- 结论：中文媒体渲染、正文图片链接、manifest 基准解析和图文数字语义均为 **PASS**。英文媒体的 `ceil` 语义、网站组装和上游来源页面真伪不在 M-zh 范围内，分别保持 **UNVERIFIED**，不代替 M-en、页面审核或事实审核。

## 逐项旧问题复验

| 旧问题 | 当前独立证据 | 结论 |
| --- | --- | --- |
| 旧 `media-readability.md`：三张中文图在 390px 下仍是 1200/1280px，右侧被裁切 | 当前三张根 SVG 均为宽 390px；窄屏三项均 `scrollWidth=390`、`clientWidth=390`，全文高度分别为 1040、1160、1040，可正常垂直滚动到底 | **CLOSED / PASS** |
| 旧 `media-readability.md`：manifest 的中文 `path` 没有声明统一基准 | `media-zh.json` 声明 `pathBase: "manifest-directory"`；三条 `../assets/zh/*.svg` 从 `drafts/` 解析均 `exists=True` | **CLOSED / PASS（仅材料层；装配器未测）** |
| 旧 `D-zh`：图 2 只有无肥料基准，未展示各 modifier 的阶段变化 | 当前图 2 逐作物展示 4 档行；Parsnip 为 `[1,1,1,1]`、`[1,0,1,1]`、`[1,0,1,1]`、`[1,0,0,1]`，Melon 为 `[1,2,3,3,3]`、`[1,1,2,3,3]`、`[1,1,2,2,3]`、`[1,1,2,2,2]`，并显示首次日期 | **CLOSED / PASS** |
| 旧 `D-zh`：草莓时间线第二个再生长点主要靠右侧文字，表达偏弱 | 当前图 3 直接显示 `春季第 24 日 → 第 28 日`、`每次再生长仍为 4 天`，且截图中日期和边界文字可读 | **CLOSED / PASS（媒体表达）** |
| 旧 `D-zh` 的正文重复、ResearchTrace、ReaderValue 三门 | 这些是 D/C/E 的正文审核职责；本轮只核对图文对应，不代签正文独立门 | **UNVERIFIED / 留给 D-zh、E-zh** |

## 浏览器实际渲染证据

本轮只使用一个由本角色创建的 ego-browser TaskSpace（`spaceId=48`），复用同一页直接打开三张本地 SVG；没有新增 HTML、演示站或本地服务。桌面截图使用 1440×1000 viewport，窄屏截图使用 390×844 viewport；`fullPage` 截图覆盖 SVG 全高，另用正常鼠标滚轮从 `sy=0` 滚到每张图的底部（flow/strawberry `sy=196`，stage `sy=316`）。

| SVG | 桌面截图 | 390px 窄屏截图 | 渲染读回 |
| --- | --- | --- | --- |
| `speed-gro-application-flow.svg` | `reviews/media-evidence-zh-r1/zh-flow-desktop.png` | `reviews/media-evidence-zh-r1/zh-flow-narrow.png` | 根图 390×1040；窄屏 `390/390`；17 个 `<text>`，最小计算字号 14px；已锄地、三种施用时机、首次成长/收获和再生长边界清晰 |
| `speed-gro-stage-comparison.svg` | `reviews/media-evidence-zh-r1/zh-stage-desktop.png` | `reviews/media-evidence-zh-r1/zh-stage-narrow.png` | 根图 390×1160；窄屏 `390/390`；64 个 `<text>`，最小计算字号 14px；8 组阶段向量和春/夏首次日期清晰 |
| `strawberry-harvest-timeline.svg` | `reviews/media-evidence-zh-r1/zh-strawberry-desktop.png` | `reviews/media-evidence-zh-r1/zh-strawberry-narrow.png` | 根图 390×1040；窄屏 `390/390`；22 个 `<text>`，最小计算字号 14px；春 13/20/21/24/25/28 及 4 天再生长边界清晰 |

DOM 渲染度量在桌面和窄屏均报告 `textOutside=[]`；截图目视复核无横向裁切、无可见文字重叠。图 1 没有日期或独立图例；图 2 的阶段数字、删日后的 `0`/变更值和日期直接标注，不依赖另建图例；图 3 的日期与再生长文字均在 14px 以上。XML 可解析只是机械门，以上结论以真实浏览器渲染截图为准。

## 正文、清单与图的对应

- 正文三条图片链接均为 `../assets/zh/...`，从 `drafts/body-zh.md` 所在目录解析到真实文件；与 manifest 的三项 asset set 一致。
- manifest 三项声明尺寸与 SVG 根属性一致：flow `390×1040`、stage `390×1160`、strawberry `390×1040`。
- 图 1 的 `已锄地 → 播种前/后/成长中施用 → 首次成长与首次收获` 以及成熟后再生长边界，与正文对应说明一致。
- 图 2 的各档阶段向量与正文日期一致：Parsnip 无肥料/Speed-Gro/Deluxe/Hyper 为 `[1,1,1,1] → 春 5`、`[1,0,1,1] → 春 4`、`[1,0,1,1] → 春 4`、`[1,0,0,1] → 春 3`；Melon 为 `[1,2,3,3,3] → 夏 13`、`[1,1,2,3,3] → 夏 11`、`[1,1,2,2,3] → 夏 10`、`[1,1,2,2,2] → 夏 9`。图内说明了向上取整和逐阶段分配，中文阶段图确实展示施肥后的向量/删日结果。
- 图 3 的条件化案例与正文一致：春 13 播种；无肥料首收春 21、后续春 25；Speed-Gro 首收春 20、后续春 24 与春 28；后续再生长固定为 4 天。
- 英文图的 `ceil(成长天数 × 修正值)` 不在本角色范围内，未据此给英文媒体签发结论。

## 文件解析、哈希与命令证据

### 当前内容哈希

| 文件 | SHA-256 |
| --- | --- |
| `drafts/body-zh.md` | `6c959535270263744fe80b788bcec5a9c08470324f12082acedec15db941e4e4` |
| `drafts/media-zh.json` | `4a7cefd203203037387794e45df7e19adc4c79d89a9e4745fc45e9d3b17436e5` |
| `assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| `assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| `assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |

### 实际命令与退出码

- 读取 `/Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md`、`参考规则/标题与描述规则.md`：shell 命令退出 `0`。
- `xmllint --noout docs/blog-ops/stardew-valley-speed-gro/assets/zh/*.svg`：三张 SVG 分别退出 `0`。
- `node -e 'JSON.parse(...)'` 读取 `drafts/media-zh.json`：退出 `0`，`media-zh.json JSON_PARSE_EXIT=0`。
- body/manifest 路径解析脚本：退出 `0`，`BODY_IMAGE_LINK_CHECK count=3 exit=0`、`BODY_MANIFEST_ASSET_SET_CHECK count=3 exit=0`；三条 manifest path 和三条 body link 均 `exists=True`。
- body/manifest/SVG XML 语义核对脚本：退出 `0`，`FLOW_BODY_SVG_SEMANTICS=PASS`、`STAGE_BODY_SVG_SEMANTICS=PASS rows=8 modified_vectors=6 dates=7`、`TIMELINE_BODY_SVG_SEMANTICS=PASS dates=6 regrowth_boundary=PASS`、`SVG_MANIFEST_DIMENSIONS=PASS assets=3`。
- `ego-browser nodejs` 直接打开每张 SVG、桌面/390px 窄屏截图和 DOM 度量：进程退出 `0`；六张 PNG 均为真实浏览器输出。正常滚轮滚动到全高的 ego-browser 命令也退出 `0`。
- `ego-browser nodejs` 执行 `task.finish({keep: []})`：进程退出 `0`，`closedSpace=true`、`closedManagedLabels=["p1"]`；仅关闭本角色创建的浏览器空间。
- `file reviews/media-evidence-zh-r1/*.png`：退出 `0`；文件为 PNG，尺寸为 `1440×1040`、`390×1040`、`1440×1160`、`390×1160`、`1440×1040`、`390×1040`。
- `shasum -a 256` 读取正文、manifest 和三张 SVG：退出 `0`，哈希见上表。
- `view_image` 逐张查看六张截图：工具成功；未修改任何输入材料。

## 当前状态

- **PASS**：三张中文 SVG 的真实桌面/窄屏渲染、14px 最小文字、无横向裁切、无可见重叠、日期/阶段结果可读；body 相对链接；manifest `pathBase` 从 `drafts/` 解析；body/manifest/SVG 数字语义；XML/JSON 解析；当前 hash 绑定。
- **UNVERIFIED**：英文媒体的 `ceil` 复验、网站装配器消费 `pathBase` 的实际行为、上游来源页面本轮新鲜度/事实重审、D/E 正文审核门和用户终审。此报告不把这些未测项写成通过。
- 未修改正文、manifest、原始 SVG、网站代码、`public`、`package.json`、`AGENTS.md` 或 `WORKLOG.md`；未安装依赖、构建、部署、提交、推送或外部写入。

## 本轮新增文件清单

- `reviews/media-zh-r1.md`
- `reviews/media-evidence-zh-r1/zh-flow-desktop.png`
- `reviews/media-evidence-zh-r1/zh-flow-narrow.png`
- `reviews/media-evidence-zh-r1/zh-stage-desktop.png`
- `reviews/media-evidence-zh-r1/zh-stage-narrow.png`
- `reviews/media-evidence-zh-r1/zh-strawberry-desktop.png`
- `reviews/media-evidence-zh-r1/zh-strawberry-narrow.png`

## 当前 manifest 的公开来源 URL

以下 URL 是当前 `drafts/media-zh.json` 逐项列出的公开来源；本轮作为媒体对应关系的来源清单记录，未把本轮媒体渲染复验冒充为上游页面事实重审：

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://stardewvalleywiki.com/Strawberry?oldid=192732
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
