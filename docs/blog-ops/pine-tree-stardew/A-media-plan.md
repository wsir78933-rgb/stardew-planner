# A-MEDIA plan: `pine-tree-stardew`

**阶段：** A-MEDIA 只读研究与媒体计划
**证据日期：** 2026-09-22（Asia/Shanghai）
**目标：** 为英文 `en` 与简体中文 `zh-CN` 的 Pine Tree 文章确定最小、准确、可装配的封面与正文图解方案。
**本次不做：** 不生成图片、不写入 `public/`、不改 source/tests、不给正文图位写入文章模块。

## 结论：最小媒体集合

最小方案是 **1 张共享封面 + 2 张共享正文解释图**。封面是主题识别/社交预览，不计入 V7 要求的正文教学图；两张正文图必须实际嵌入文章对应段落，不能只保留在媒体清单里。

- 预期新增媒体对：3 个 `.webp` + 3 个同名 `.avif`，共 6 个文件。
- 不规划视频、视频 poster、planner 操作截图或装饰性第三张图。
- 推荐图内不嵌入语言文字，只使用可读的图形、箭头、格子和数字；因此 EN/ZH 可共享同一媒体，alt 与 figcaption 在文章模块中本地化。
- 如果最终插画必须嵌入英文/中文标签，则该图必须拆成 `-en` / `-zh` 两个 WebP，并各自有 AVIF 兄弟；不能把一种语言的图当作另一种语言的正文图。

## 计划表

| 角色 | 建议文件名（WebP；另需同名 AVIF） | 尺寸/格式/预算 | 图中必须让读者完成的任务 | alt 意图 | caption 意图 | 语言策略 |
|---|---|---|---|---|---|---|
| **封面**（非教学图） | `public/blog/pine-tree-stardew-cover.webp` | `1672×941`；有损 VP8 WebP（必须是 `VP8 `，不是 `VP8L`/`VP8X`）；≤ `1.25 * 1024 * 1024` bytes | 一眼识别文章主题：可辨认的 Pine Tree、Pine Cone 与成熟树上的 Tapper/松焦油线索。不能用封面替代正文规则图。 | 描述实际画面中的松树场景和可见对象；不塞关键词，不声称不存在的成长时间、收益排名或地图规则。 | 封面通常不设正文 `<figcaption>`；若页面需要文字，只写主题识别，不写教学结论。 | **共享**；封面不放语言文字。 |
| **正文图 1：种子到产物** | `public/blog/illustrations/pine-tree-seed-to-tar.webp` | `1672×941`；有损 VP8 WebP；≤ `400 * 1024` bytes | 按正确对象链完成操作：认出 Pine Cone → 种下普通树 → 等到成熟 Pine → 把 Tapper 放上去并得到 Pine Tar。图中不放有冲突的固定成长天数。 | 描述 Pine Cone、普通树成长阶段、成熟 Pine、Tapper 与 Pine Tar 的实际关系；注明是示意图而非游戏截图。 | 只表达已核验关系：Pine Cone 对应 Pine Tree；成熟 Pine 才进入 Tapper/Pine Tar 步骤。普通 Tapper 的 5 晚、Heavy Tapper 的 2 天以及冬季继续工作留给正文表格/文字核对。 | **优先共享**；若出现文字标签则拆 `pine-tree-seed-to-tar-en.webp` 与 `...-zh.webp`。 |
| **正文图 2：第 4 阶段邻格排错** | `public/blog/illustrations/pine-tree-stage-four-neighbor.webp` | `1672×941`；有损 VP8 WebP；≤ `400 * 1024` bytes | 排错：以树苗为中心检查八个相邻格；任意相邻格有成熟树时，树苗不能越过第 4 阶段。旁图可示范留一格的实用排法，但不能画成果树 3×3 硬性规则。 | 描述中心树苗、八邻格、阻挡它通过第 4 阶段的成熟邻树和修正后的间隔示意；不声称树的物理 footprint。 | 明确“普通 Pine 看八邻格；成熟邻树会卡住第 4 阶段；留一格是布局做法，不是果树 3×3 规则”。 | **优先共享**；若图例有语言标签则拆 `...-en.webp` / `...-zh.webp`。 |

### 不列入最小集合的内容

- **Tapper 计时图：** 5 晚普通 Tapper、2 天 Heavy Tapper 是精确参数，适合正文表格；单独再画一张会重复图 1，除非后续锁定 handoff 明确要求按计时步骤教学。
- **成长日历图：** 研究记录发现 Pine Tree / Pine Cone / Trees 页面存在 18 天、24 天及百分位口径冲突；在冲突解决前不能把任何一个成长天数画成倒计时。
- **收益比较图：** 本次没有同条件的树木收益排名；不画“松树最赚钱”或跨树收益柱状图。
- **planner 截图：** planner 能放置 `Pine Tree (Normal)` 并标记不可长树格，但不模拟生长、Tapper 计时或 Pine Tar 产出；若文章只做游戏规则教学，文字 CTA 足够，不新增软件操作图。

## 已核对的现有文章与媒体约定

1. `src/components/public-picture.tsx:17-47` 要求非空 `.webp`，并自动派生同 stem `.avif`；正文图沿用 `<figure className="blog-article-media">` + 读者向 `<figcaption>`。alt 必须描述实际画面。
2. `docs/blog-ops/pine-tree-stardew/project-interface-spec.md:335-355` 与 `tests/assets/blog-cover-images.test.ts` 建立了项目媒体契约：封面/正文图均为 `1672×941`；封面上限 `1.25 MiB`，正文图上限 `400 KiB`；WebP 必须是有损 `VP8 `；封面首屏不 lazy，正文图使用 `decoding="async"` 与 `loading="lazy"`。新文章 WebP 必须有非空同名 AVIF，封面放 `public/blog/`，正文图放 `public/blog/illustrations/`。
3. 现有双语文章的实际惯例是“图中无语言文字则共享”：Maple、Carpenter、Summer Crops、Year 1 Gold、Robin 等 EN/ZH 复用同一正文图；含语言标签或内容布局明显不同的规则图则拆分，例如 `do-you-have-to-water-trees-stardew-rules-en/zh`、Fall Crops、Farming XP、Last Day to Plant、Rancher/Tiller。
4. 现有树类资产没有目标 Pine 资产：已有 `oak-tree-stardew-cover.webp`、`maple-tree-stardew-cover.webp`、`stardew-valley-trees-cover.webp`，以及 `maple-vs-oak-seeds.webp`、`maple-tapper-grove.webp`。它们不能直接替代本计划：前两张正文图缺 Pine Cone/Pine Tar，且 Maple/Oak 画面会把读者带到错误物种；通用树封面只适合相关内容，不完成 Pine 识别或邻格排错。
5. 现有 cover 与 figure 均为 `RIFF/WEBP/VP8`、`1672×941` 的有损 WebP；例如 `webpinfo` 对 Maple cover 报告 `Chunk VP8`、`Format: Lossy`。这确认了目标媒体应沿用现有输出而不是 legacy PNG。

## 可用素材、转换工具与限制

### 已存在的项目素材

- `src/catalog/trees.ts:53-71` 将 `Pine Tree` 定义为 id `"3"`、纹理 stem `tree3`，并列出春/夏/秋/冬可用状态与 moss variant；对应版本锁定素材位于 `public/assets/terrain/tree3_spring.png`、`tree3_fall.png`、`tree3_winter.png` 等。
- `public/assets/sprites/springobjects.png` 与 `public/assets/data/Objects.json` 中存在 Pine Cone（object id `311`）和 Pine Tar（object id `726`）；`public/assets/data/BigCraftables.json` 中存在 Tapper（id `105`）与 Heavy Tapper（id `264`）。这些是可供后续受控裁切/示意图使用的版本素材线索，不等于已得到可公开发布的最终 crop 或署名记录。
- 目前 `public/blog/` 没有 `pine-tree-stardew` 封面或 Pine 专用正文图，也没有对应 AVIF；本任务不创建它们。

### 本次只读检查到的工具

| 工具 | 版本/状态 | 适用性 |
|---|---|---|
| `cwebp` | `1.6.0` | 可将最终画面编码为有损 VP8；不要使用 `-lossless`，否则会得到不符合博客契约的 VP8L。 |
| `webpinfo` | `1.6.0` | 必须回读 `Chunk VP8`、尺寸、`Format: Lossy` 与字节数。 |
| `dwebp` | `1.6.0` | 可做 WebP 解码回看/像素检查。 |
| `ffmpeg` | `8.0.1` | 可做只读解码/格式检查；不是本项目博客图生成器。 |
| `python3` + Pillow | Python 可用，Pillow `12.2.0` | 可做受控拼图/尺寸检查；本任务未生成文件。 |
| `avifenc` / `magick` / `heif-convert` | PATH 中不可用 | 当前没有确认的 AVIF 编码命令；后续资产落地前必须解决并验证同名 AVIF。 |

仓库现有 `scripts/generate-public-preview-webp.ts:53-71` 仅服务 public preview 的**无损** VP8L 输出（调用 `cwebp -lossless`），不能直接拿来生成博客封面/正文图。仓库没有发现专用的 Pine/blog 插画生成脚本；最终图的生成方式、素材授权/署名和 AVIF 编码链仍需后续装配者确认。

## 事实边界与阻塞项

### 可安全用于视觉的已核验关系

- Pine Tree 是普通树，由 Pine Cone 长成，成熟树可用 Tapper 产 Pine Tar。
- 普通树苗不需要浇水；成熟树位于树苗八个相邻格之一时，会阻止树苗越过第 4 阶段。
- 普通 Tapper 对成熟 Pine 为 5 晚，Heavy Tapper 为 2 天；Pine 上采集器冬季继续工作。
- Pine 不应被画成果树，也不应把 Maple/Oak 的 Green Rain 转化行为移植到 Pine。

这些关系来自 `A-en-research.md:224-249` 与 `A-zh-research.md:296-322` 的事实矩阵；最终图中文字和 caption 仍要绑定未来锁定的 `PublicBlogHandoff`，不能由媒体阶段自行改写正文。

### 必须保持未决/待补的事项

- **最终资产缺失：** 封面、两张正文图及 3 个 AVIF 兄弟均未生成，也没有真实尺寸、字节数、VP8 回读或授权回执。
- **成长时间冲突：** 不把 18/24/38/55 天中的任何一个作为唯一倒计时或图内数字。
- **来源与授权：** 版本素材可作为内部受控绘图输入，但最终公开插画/截图的使用权、署名与是否允许改编尚未确认；不能把内部路径写入公开正文。
- **真实截图缺失：** 本次未启动游戏、未做存档/过夜实验；示意图不能冒充真实截图、实测或精确游戏 UI。
- **物理占格未知：** planner 的 `1×1` catalog/rendering 事实不是 Pine 的游戏 footprint；图 2 只表达八邻格规则，不画未经核验的像素尺寸/碰撞框。
- **收益排名未取得：** 不做“最赚钱树”视觉比较；松焦油售价不是跨树收益结论。
- **页面状态未完成：** 目标生产路径在 2026-09-22 的研究记录中仍为 404；本报告不声称文章已注册、已装配、已部署或已通过浏览器验收。

## 后续落地验收清单（不在本任务执行）

- 每个目标 WebP：`1672×941`；`webpinfo` 显示 `Chunk VP8` 与 `Format: Lossy`；封面 `≤ 1,310,720` bytes，正文图各 `≤ 409,600` bytes。
- 每个 WebP 有同 stem、非空且含 `ftypavif` 的 AVIF；不能把 public preview 的无损 VP8L 规则误套到博客图。
- 两个正文图分别靠近对应正文步骤，并有与实际画面一致的 EN/ZH alt 与 caption；封面不算正文教学图。
- 资产生成后再由页面装配者按 `PublicPicture`、桌面/移动端显示和真实文章路由独立复验；本报告不代替 build、测试、浏览器、部署或用户终审。
