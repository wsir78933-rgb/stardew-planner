# 视觉核查与重做执行方案报告 (Visual Review & Rework Action Plan)

- **任务 ID**: `task_dd9179c85f56`
- **派发上下文 (Dispatch ID)**: `ctx_ba92d064f71c`
- **审查角色**: 独立视觉审查与重做规划方 (Role V / Independent Visual Reviewer)
- **协调员终端**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **审查员终端**: `term_d295752e-9b04-49c9-b3ec-9f32a45c9987`
- **本地环境与服务**: Next.js 16.3.0 dev server (`PID 44772`, 监听 `http://127.0.0.1:3004`)
- **Ego-Browser 会话**: TaskSpace ID `118` (`harvest-visual-review`)
- **审查日期**: 2026-10-13

---

## 1. 审查背景与核心原则

### 1.1 审查起点
用户已明确拒绝当前已上线的这篇《how to harvest stardew valley》（中英文双语）配图，并授权“重新弄”中英文与图片返工。
此前历史 E2 审查报告（`E-page-review-v2.md`）给出了技术形式上的“PASS”，其依据主要为：
- Tesseract OCR 与 Swift Vision 能识别出插图中的 22 处文字；
- 在 Retina DPR 3 屏幕推算下汉字物理像素约 30px；
- `<figcaption>` 提供了 100% 文本兜底。

### 1.2 核心认识矫正
**“文字准确与图片清晰不是成品视觉质量。”**
技术上字号可辨、矢量无锯齿、代码返回 200，绝不等于读者在真实游玩情境下能获得有效的视觉指引。原图本质上是脱离游戏真实画面的“纯文字卡片”，封面则是简陋失真的“矢量剪贴画”，完全背离了星露谷物语的游戏美学，也未能解决玩家“如何判断作物成熟、如何执行采收动作”的核心诉求。

---

## 2. 真实双视口测量与截图证据 (DOM & Visual Evidence)

通过本地 `ego-browser` (TaskSpace `118`)，对运行中的本地文章（英文路由 `/how-to-harvest-stardew-valley` 与中文路由 `/zh/how-to-harvest-stardew-valley`）在 **1280×800 (桌面端)** 与 **390×844 (移动端)** 进行了实际滚动、显式 `decode()` 与合成器渲染完成（Paint Settled）的真实验收与测绘。

### 2.1 桌面端 (1280×800, DPR 1) 测绘指标
| 页面 / 元素 | 真实渲染尺寸 (CSS px) | 原始尺寸 (Natural px) | 视口坐标 (x, y) | 真实资源源文件 (`currentSrc`) | 截图证据路径 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EN 封面 (`Cover`)** | 1088 × 612 | 1672 × 941 | (93.0, 94.2) | `how-to-harvest-stardew-valley-cover.avif` | `visual-review/en-desktop-cover.png` |
| **EN 正文插图 (`Figure`)** | 704 × 396 | 1672 × 941 | (474.8, 202.1) | `how-to-harvest-stardew-valley-en-methods.avif` | `visual-review/en-desktop-figure.png` |
| **ZH 封面 (`Cover`)** | 1088 × 612 | 1672 × 941 | (93.0, 94.0) | `how-to-harvest-stardew-valley-cover.avif` | `visual-review/zh-desktop-cover.png` |
| **ZH 正文插图 (`Figure`)** | 704 × 396 | 1672 × 941 | (474.8, 202.1) | `how-to-harvest-stardew-valley-zh-methods.avif` | `visual-review/zh-desktop-figure.png` |

### 2.2 移动端 (390×844, DPR 3) 测绘指标
| 页面 / 元素 | 真实渲染尺寸 (CSS px) | 原始尺寸 (Natural px) | 缩放比率 (Scale) | 真实资源源文件 (`currentSrc`) | 截图证据路径 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EN 封面 (`Cover`)** | 358 × 201.375 | 1672 × 941 | 1 : 4.67 | `how-to-harvest-stardew-valley-cover.avif` | `visual-review/en-mobile-cover.png` |
| **EN 正文插图 (`Figure`)** | 358 × 201.375 | 1672 × 941 | 1 : 4.67 | `how-to-harvest-stardew-valley-en-methods.avif` | `visual-review/en-mobile-figure.png` |
| **ZH 封面 (`Cover`)** | 358 × 201.375 | 1672 × 941 | 1 : 4.67 | `how-to-harvest-stardew-valley-cover.avif` | `visual-review/zh-mobile-cover.png` |
| **ZH 正文插图 (`Figure`)** | 358 × 201.375 | 1672 × 941 | 1 : 4.67 | `how-to-harvest-stardew-valley-zh-methods.avif` | `visual-review/zh-mobile-figure.png` |

> 完整 DOM 测绘结构见已保存的 JSON 文件：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/visual-review/dom-metrics.json`。

---

## 3. 用户拒绝配图的五大具体视觉缺陷 (Maximum 5 Concrete Defects)

对比当前两篇页面的实际渲染、原 SVG 源码（`cover-source.svg` / `en-figure.svg`）、前期布局规划（`layout/visual-plan.md`）、V7 媒体规范及本站已有的 3 篇高质量博客封面/正文图（`summer-crops-stardew`、`fall-crops-stardew`、`best-spring-crop-stardew` / `profit-margin-stardew`），核实以下 5 处导致用户拒绝的根本性视觉缺陷：

### 缺陷 1：封面图粗糙扁平，与《星露谷物语》游戏美学及本站既有风格严重割裂
- **现场实证**：`how-to-harvest-stardew-valley-cover.webp` 来源于手绘矢量 SVG（`cover-source.svg`）。画面由悬空的三角形铲子、半圆形镰刀、3 个橙色椭圆组成的“南瓜团”、带有天蓝色窗块的黄色方块平顶农舍以及两棵棒棒糖式树木构成。
- **对比既有基准**：查看本站已有的 3 篇成熟博客封面（`summer-crops-stardew-cover.webp`、`fall-crops-stardew-cover.webp`、`best-spring-crop-stardew-cover.webp`），它们均采用具有复古羊皮纸边框的水彩手绘田园风格，拥有细致的红顶木屋、风车、起伏山峦、写实质感的作物田垄与生锈浇水壶；或如 `profit-margin-stardew-advanced-options.webp` 的正统星露谷 16-bit 像素艺术。
- **结论**：现存封面充斥着廉价幼儿简笔画剪贴感，既不是游戏真实像素画面，也不符合网站系列封面的人文美学，严重损害文章品质与读者第一印象。

### 缺陷 2：正文配图为“纯文字卡片”，缺乏真实操作价值与动作指引
- **现场实证**：`how-to-harvest-stardew-valley-en-methods.webp` 与 `zh-methods.webp` 实质上是一个暗色背景下的 5 块文字 UI 状态卡片（包含“徒手采摘 / 右键或 X”、“镰刀挥击 / 左键或 C”、“巨大作物 / 斧头砍 3 下”等 22 处文字标签）。
- **价值缺失**：整张图**没有任何人物动作、工具挥动轨迹或采收交互状态**。玩家不知道徒手采收时角色处于什么站位、作物如何弹起掉落、挥动镰刀时攻击判定扇面如何覆盖作物。读者面对的是一张排版过的文字速查表，而不是能够解答“如何采收”的动作图解。

### 缺陷 3：完全缺失可辨认的游戏实体与成熟作物形态
- **现场实证**：文章的核心主意图是“如何收获作物”与“如何判断作物成熟”。但原插图中**没有任何一株真实的 Stardew Valley 作物 Sprite**。
- **认知断层**：防风草（Parsnip）、羽衣甘蓝（Kale）、小麦（Wheat）、苋菜（Amaranth）在成熟期与生长期有什么外观差异？棚架作物（青豆、啤酒花、葡萄）挂果时是什么形态？现图只有纯文字名字胶囊，没有任何图像表现。新玩家即便看了图，进游戏依然无法靠肉眼辨认地里的作物是否已经可以收获。

### 缺陷 4：移动端 (390px 视口) 视觉层级崩塌且与下方图注产生 100% 冗余
- **现场实证**：在 390px 移动视口下，整张图被等比缩放至 358×201.375px。22 个文字标签被紧密压缩进 5 个小方块中，视觉拥挤沉闷，失去了视觉视觉焦点。
- **图文冗余**：更严重的是，插图下方的 `<figcaption>` 内容为：
  > “示意图：星露谷物语农作物收获方式，包括防风草使用右键或 X 键，羽衣甘蓝、小麦、苋菜、未碾米与纤维使用镰刀挥击，以及巨大作物使用斧头、阻挡通行的棚架与第 28 天换季规则。”
  **图注与图内文字达到了 100% 字面复读**。这意味着图片除了把图注的文字复制一遍塞进深色矩形框里，没有为读者提供任何额外的视觉信息增益。

### 缺陷 5：图文位置与读者阅读心流脱节
- **现场实证**：该插图被强行放置在第二节（镰刀对比）与第三节（如何判断成熟）之间。
- **心流错位**：读者读完铱镰刀对比，刚要了解“怎么看作物成熟（生长天数与外观）”，迎面而来的却是一张塞满巨大作物、棚架、第 28 天枯萎等杂乱规则的综合卡片。它既没有配合第一节说明徒手采收的连击走位，也没有配合第二节展示镰刀收割的真实画面，割裂了读者的阅读连贯性。

---

## 4. 新素材验收标准 (Rework Acceptance Criteria)

为指导媒体执行方（Role M）重做素材并供后续独立验收方（Role E）进行严格客观验收，制定以下 7 项硬性标准：

1. **真实游戏画面与正统游戏美学 (Authentic In-Game Footage)**:
   - 严禁再次使用手绘简笔几何矢量图形（SVG 扁平简笔画）或脱离游戏风格的粗糙 AI 生成图。
   - 必须采用 ConcernedApe 官方公开素材（如 Official Press Kit）或游戏内真实截屏画面，具备正统的星露谷 16-bit 像素美学。
2. **清晰呈现成熟作物与正确动作/工具 (Clear Mature Crops & Correct Tool/Action)**:
   - 画面中必须有**清晰可见、可辨认的成熟期作物**（如金黄小麦、成熟南瓜、挂果青豆/啤酒花架）。
   - 涉及采收操作处，画面应体现玩家角色、手持工具（如背包/手持中的镰刀、斧头）或采收场景，展示正确的田间空间布局。
3. **正文文字紧密呼应与真实信息增益 (Context Alignment & Value Add)**:
   - 素材应服务于对应章节的主任务（如展示“成熟作物与田间棚架路径”或“农具采收准备”），读者看图能直接印证正文中的判断逻辑。
   - 图注与 alt 必须遵循 V7 [读者口吻] 规范，准确描述具体画面（如“秋季农场中成熟的南瓜田、稻草人与右侧成排的木质棚架通道”），禁止自我解释“本图用于表现…”或“不代表实测…”等编辑腔。
4. **移动端实体清晰可辨 (Mobile Recognizable Entities)**:
   - 在 390px 视口（物理渲染宽约 358px）下，作物、玩家角色、建筑与工具等主要实体必须轮廓分明、色彩清晰，无需放大即可被普通读者直接辨认。
5. **公开来源合法归属 (Public Source Attribution)**:
   - 资产必须具备明确的公开合法来源（如 ConcernedApe 官方 Press Kit `stardewvalley.net/press/`，用于游戏指南与媒体报道；或官方 Wiki 公开游戏截屏），并在内部元数据中完整记录来源文件路径与 URL，禁止伪造 CC 授权。
6. **封面图美学与站点既有系列和谐一致 (Cover Theme & Series Harmony)**:
   - 封面图必须具备丰富的田园秋收/丰收氛围与高审美质感，与站点既有的田园风格（如 `summer-crops`、`fall-crops`）保持水准一致，不得突兀。
7. **明确禁止与约束项 (Explicit Constraints)**:
   - 不强制规定使用纯 AI 或纯 SVG，不要求媒体研究尚未获取到的虚构素材。
   - 严禁执行者自画伪造游戏 UI 窗口或生造假截图。
   - 不修改全站公共 UI 组件，不扩大幅度至全站重构。

---

## 5. 简短具体视觉任务卡 (Visual Task Cards for Media Execution)

### 任务卡 1：文章封面重做 (Article Cover Rework)
- **目标资产**: `/blog/how-to-harvest-stardew-valley-cover.webp` (及配套 `.avif`)
- **推荐选用源**:
  - **首选候选**: 已就绪的官方高质量实机图 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-farm-evening.png`（ConcernedApe 官方 Press Kit，秋季黄昏农场）。
  - **画面要素**: 画面中央为成熟待收的橙色南瓜田、手持工具的玩家、绿意与紫色作物田、左侧鸡舍与漫步小鸡、右侧整齐的棚架与小径，夕阳余晖下农场丰收气息浓厚，极度契合“How to Harvest Crops in Stardew Valley”的主题。
- **交付规格**:
  - 宽高比：16:9 (`1672 × 941`)。
  - 格式：WebP（质量约 85-90）与 AVIF，大小控制在 100KB–300KB 内。
  - Alt 文案建议：`"Evening farm in Stardew Valley featuring ripe pumpkin patches, autumn crops, chicken coop, and trellis rows."`

### 任务卡 2：正文关键操作图重做 (In-Body Operation Illustration Rework)
- **目标资产**: `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` 与 `...-zh-methods.webp`
- **目标任务**: 替代原先的 22 处纯文字卡片，提供展示真实农田采收状态与空间要素的图像。
- **推荐选用源**:
  - **方案 A（田间实景与工具准备）**: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media-sources/originals/press-iphone-08.png` 或裁剪版本。
    - **画面特征**: 清晰展示带有开花/成熟作物的浇灌田块、工具栏中选中的镰刀（Scythe）、斧头与十字镐、通畅的鹅卵石走道与稻草人保护范围。直观呈现采收前的准备状态。
  - **方案 B（棚架与多作物采收布局）**: `press-farm-evening.png` 局部重点裁剪，或使用包含镰刀挥舞与成熟单收作物真实画面的清晰实机截图。
- **图注与无障碍规范**:
  - 英文图注：`"In Stardew Valley, crops mature in distinct rows around farm paths, requiring direct hand picking for vegetables or a scythe for designated crops."`
  - 中文图注：`"星露谷物语中的成熟农作物沿田埂道路分布，普通蔬菜可直接徒手采摘，特定作物与杂草则需使用镰刀收割。"`
  - 彻底移除对“示意图不代表游戏内…”的自述，直接讲解读者在画面中能看懂的要素。

---

## 6. 证据文件与审计索引 (Evidence Artifacts Index)

所有通过本地 `ego-browser`（TaskSpace `118`）真实运行生成的截图与指标数据均已保存在本工作树私有目录中：

| 证据类型 | 相对路径 | 说明 |
| :--- | :--- | :--- |
| **DOM 测绘数据** | `rework-v2/visual-review/dom-metrics.json` | 包含两个语言版本在两种视口下的完整 BoundingBox、自然尺寸与渲染样式 |
| **英文桌面封面** | `rework-v2/visual-review/en-desktop-cover.png` | 1280×800 下滚动并绘制完成的当前封面截图 |
| **英文桌面插图** | `rework-v2/visual-review/en-desktop-figure.png` | 1280×800 下滚动并绘制完成的当前纯文字插图截图 |
| **英文移动封面** | `rework-v2/visual-review/en-mobile-cover.png` | 390×844 (DPR 3) 下居中并绘制完成的当前封面截图 |
| **英文移动插图** | `rework-v2/visual-review/en-mobile-figure.png` | 390×844 (DPR 3) 下居中并绘制完成的当前插图截图 |
| **中文桌面封面** | `rework-v2/visual-review/zh-desktop-cover.png` | 1280×800 下滚动并绘制完成的当前中文封面截图 |
| **中文桌面插图** | `rework-v2/visual-review/zh-desktop-figure.png` | 1280×800 下滚动并绘制完成的当前中文文字插图截图 |
| **中文移动封面** | `rework-v2/visual-review/zh-mobile-cover.png` | 390×844 (DPR 3) 下居中并绘制完成的当前中文封面截图 |
| **中文移动插图** | `rework-v2/visual-review/zh-mobile-figure.png` | 390×844 (DPR 3) 下居中并绘制完成的当前中文插图截图 |
| **自动化检查脚本**| `rework-v2/visual-review/capture-evidence.mjs`| 遵循单一职责与 Fail Fast 的可重复执行测绘脚本 |

---

## 7. 结论与后续交接

1. **核实结论**: 用户拒绝原图具备完全充分的视觉与体验事实依据。原图存在“封面简笔画失真”、“插图为 22 标签纯文字卡片零动作价值”、“缺少真实作物实体”、“移动端与图注 100% 文本复读”以及“图文错位”五大核心缺陷。
2. **重做建议**: 媒体执行方（Role M）应立即根据本报告第 5 节的 2 张视觉任务卡，采用已验证的官方高质量实机素材（如 `press-farm-evening.png` 等）进行重切重裁与格式交付，彻底淘汰原 SVG 源码。
3. **后续验证**: 独立审查方（Role E）在后续验收中，须依据第 4 节的 7 项验收标准逐项核验，不再仅凭 OCR 与字号检查作口头 PASS。
