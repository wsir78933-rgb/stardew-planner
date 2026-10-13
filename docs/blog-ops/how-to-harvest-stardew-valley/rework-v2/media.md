# 媒体资产制作与交付报告 (Rework-v2 Media Manifest & Verification Report)

- **任务 ID (Task ID)**: `task_959d568156f3`
- **派发上下文 (Dispatch ID)**: `ctx_91fa4cd09552`
- **执行角色**: 独立媒体制作叶子任务 (Media Leaf Worker M)
- **协调员终端**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**: `term_b5179120-707f-4396-93ae-1a81b5eb315c`
- **交付日期**: 2026-10-13
- **交付产物状态**: 全部 6 个 WebP/AVIF 文件已 staged，全部解码验真，尺寸与哈希 100% 吻合。

---

## 1. 角色边界与授权范围声明 (Scope & Boundary Declaration)

1. **单树限制**: 仅在唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行，未创建工作树、无内置子代理/workflow 嵌套派发。
2. **纯叶子职责**: 仅负责图像可控裁剪、缩放与格式转换（WebP / AVIF），不参与游戏事实研究、正文写作、多语言翻译、SEO 编写或页面组装。
3. **严格写权限边界**:
   - 允许且仅写入：`docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/` 与 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media.md`。
   - **严禁且未修改**: `public/`、`src/`、`tests/`、旧 media、SVG 源码、旧报告、正文 Markdown 或 SEO JSON。
   - 本任务产物全部固定在 `docs/blog-ops/.../rework-v2/media/staged/` 中，供后续装配角色 G 复制安装，本角色不覆盖本树 `public/`。
4. **无伪造声明**:
   - 绝不使用 AI 文生图或伪造 UI 窗口。
   - 明确所有画面素材均为 ConcernedApe 官方 Press Kit 截图裁剪，绝不声称是“本机实测操作录屏”或“已证明右键采摘动画”。

---

## 2. 原始输入素材与合规溯源 (Source Attribution & Integrity)

所有制作源自已锁定的官方原尺寸 1920×1080 PNG 截图，经 SHA-256 校验 100% 匹配：

| 素材文件名 | 原始尺寸 | 原始字节 | SHA-256 校验摘要 | 官方发布 URL 溯源 |
| :--- | :---: | :---: | :--- | :--- |
| `press-farm-evening.png` | 1920×1080 | 565,489 | `7f10276f5cb0ebbbc36a5133b4fa217c24fa89f61b21c1e15d082cbbac523496` | `https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png` |
| `press-multiplayer-2.png` | 1920×1080 | 533,277 | `b34cd47bb2e8fde6cb886154ad4027a63e222f0e29d17bd4d2fbf68d8caf9ab7` | `https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png` |

- **版权与许可声明**: 来源于 ConcernedApe 官方 Press Kit (`https://www.stardewvalley.net/press/`) 中的公开截图下载（"Download all screenshots & photos as .zip"）。官方页面未提供显式 Creative Commons 协议。根据合规要求，本项目如实记录为“公开媒体报道/游戏指南素材，无明确 CC 授权”，不作无限商业使用声明，未联系外部或进行外部写入。

---

## 3. 三张图像裁剪方案与画面事实核验 (Crops & Visual Fact Verification)

中英文双语共用以下 3 张无文本纯游戏画面（3 内容 × 2 格式 = 6 个 Staged 文件）：

### 3.1 封面图 (`how-to-harvest-stardew-valley-cover`)
- **来源素材**: `press-farm-evening.png`
- **裁剪方案**: 无裁剪，全画面 1920×1080 等比同构 Lanczos 重采样缩放至 `1672×941`（16:9 标准尺寸）。
- **画面要素与真实性**:
  - 中央为成片成熟橙色南瓜田、稻草人与漫步玩家；
  - 左侧为鸡舍、小鸡、粮仓（Silo）与苹果树；
  - 右侧为整齐的木质棚架葡萄行与酿酒桶（Kegs）；
  - 下方为农场水塘与火把。
  - 夕阳余晖下丰收气息浓厚，符合站点统一的高质感田园封面风格。
- **体积限制**: WebP 479,250 B (~468 KB)，AVIF 237,604 B (~232 KB)，远低于 1.25 MB 上限。

### 3.2 正文图 1：成熟作物近景 (`how-to-harvest-stardew-valley-mature-crops`)
- **来源素材**: `press-multiplayer-2.png`
- **裁剪坐标**: `(left=740, top=320, right=1700, bottom=860)`，视窗宽 960px，高 540px（16:9 比例），经 Lanczos 缩放至 `1672×941`。
- **画面要素与真实性**:
  - 中央主视觉为 MultiplayerScreenshot2 白天南瓜近景（耕地泥土与绿叶藤蔓分明），南瓜田顶行只有两株成熟南瓜，并非完整 4×5 方阵（4 行总计 17 株成熟南瓜：顶行 2 株，下三行各 5 株）；
  - 左侧农夫（蓝色背带裤）手举绿色蔬菜（小白菜 Bok Choy），仅按可见画面记录，不能声称“刚收获”输入或动作时序；
  - 南瓜田上方另一名绿色衣服玩家站在田间泥土上；
  - 下方有稻草人与石质矮墙通道；
  - **HUD 处理**: 原图左下角带文字的 `Bok Choy 6` 道具框在坐标 x:0..250, y:830..930，已被完全裁除。成品图没有任何文字框，不包含 HUD；
  - **动作事实定性**: 玩家手举绿色蔬菜为联机状态静态呈现，不能断言为右键采摘动作或特定时序。390px 移动视口下的物理尺寸仅为粗略估算，未经原生浏览器自动化 PASS 测试。

### 3.3 正文图 2：棚架通道与走道布局 (`how-to-harvest-stardew-valley-trellis-paths`)
- **来源素材**: `press-multiplayer-2.png`
- **裁剪坐标**: `(left=990, top=40, right=1790, bottom=490)`，视窗宽 800px，高 450px（16:9 比例），经 Lanczos 缩放至 `1672×941`。
- **画面要素与真实性**:
  - 左侧两列为木桩紫葡萄棚架与红果灌木丛，中间泥地过道与通往木门的铺石小径可见；
  - 右侧为 4 列黄色高茎植株（带黄花高茎作物，并非木质葡萄棚架），红衫角色（红衣黑发）在其田块内部，而非穿行于左侧木棚架通道中；
  - 右侧为石屋墙体与铺石隔离带，顶部为整齐木栅栏与木门；
  - **教学与展示价值**: 展现葡萄棚架列与黄色高茎作物田块及过道布局。390px 移动视口下的物理尺寸仅为估算值，未经原生浏览器自动化 PASS 测试。

---

## 4. 交付清单、文件大小与 SHA-256 (Delivery Manifest)

所有 6 个交付资产均输出至 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/`：

| 资产标识 | 格式 | 宽×高 | 字节数 (Bytes) | SHA-256 哈希值 | 预计公开安装路径 |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `how-to-harvest-stardew-valley-cover.webp` | WebP | 1672×941 | 479,250 | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | `/blog/how-to-harvest-stardew-valley-cover.webp` |
| `how-to-harvest-stardew-valley-cover.avif` | AVIF | 1672×941 | 237,604 | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | `/blog/how-to-harvest-stardew-valley-cover.avif` |
| `how-to-harvest-stardew-valley-mature-crops.webp` | WebP | 1672×941 | 267,644 | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` |
| `how-to-harvest-stardew-valley-mature-crops.avif` | AVIF | 1672×941 | 143,638 | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif` |
| `how-to-harvest-stardew-valley-trellis-paths.webp` | WebP | 1672×941 | 223,784 | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` |
| `how-to-harvest-stardew-valley-trellis-paths.avif` | AVIF | 1672×941 | 113,557 | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif` |

配套的高清 Master PNG 存储于 `media/masters/`：
- `how-to-harvest-stardew-valley-cover.png`: 1672×941, 1,863,324 B, SHA-256: `bf3a23c64bb2753ea6a08a4cd114e97a7765e49d58bb46cccae7b6bfc24aba50`
- `how-to-harvest-stardew-valley-mature-crops.png`: 1672×941, 1,479,722 B, SHA-256: `b64043a29e1dd6bdee9d93765ecb867d2968aa755337867fec8be6e830bcb9bb`
- `how-to-harvest-stardew-valley-trellis-paths.png`: 1672×941, 1,345,317 B, SHA-256: `fe91594812988054a254bf95b3fc52d5f3777b931a8efff7f981eff836f32d94`

---

## 5. 解码验真与双格式尺寸一致性 (Decoding & FFprobe Verification)

每个编码文件均已通过 `dwebp` 或 `ffmpeg` 反向解码为 PNG，并由 PIL 加载验证其实际像素尺寸，同时经 `ffprobe` 提取视频流元数据：

| 文件名称 | 编码格式 | ffprobe 检测尺寸 | 反解 PNG 验证尺寸 | 头文件签名检查 | 尺寸一致性 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `how-to-harvest-stardew-valley-cover.webp` | WEBP | 1672×941 | 1672×941 | `RIFF....WEBP` (PASS) | **一致** |
| `how-to-harvest-stardew-valley-cover.avif` | AV1 (libaom) | 1672×941 | 1672×941 | `ftypavif` (PASS) | **一致** |
| `how-to-harvest-stardew-valley-mature-crops.webp` | WEBP | 1672×941 | 1672×941 | `RIFF....WEBP` (PASS) | **一致** |
| `how-to-harvest-stardew-valley-mature-crops.avif` | AV1 (libaom) | 1672×941 | 1672×941 | `ftypavif` (PASS) | **一致** |
| `how-to-harvest-stardew-valley-trellis-paths.webp` | WEBP | 1672×941 | 1672×941 | `RIFF....WEBP` (PASS) | **一致** |
| `how-to-harvest-stardew-valley-trellis-paths.avif` | AV1 (libaom) | 1672×941 | 1672×941 | `ftypavif` (PASS) | **一致** |

- **编码与反解核验**: 采用 `ffmpeg -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p` 编码 AVIF。反解出的 PNG 已经过 `view_file` 工具逐一实际查看，本批 view 未见切片黑线或网格异常（无 raw 复现证据下不作‘macOS 512 历史规避’因果断言）。需明确：WebP 与 AVIF 的 1672×941 尺寸一致仅代表像素分辨率一致，二者为不同有损压缩算法，并非字节或像素级无损一致。

---

## 6. 完整执行命令与 Exit Code 记录 (Commands & Exit Codes)

### 6.1 WebP 编码命令
```bash
cwebp -q 90 -metadata none docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-cover.png -o docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.webp
# exit code: 0

cwebp -q 90 -metadata none docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-mature-crops.png -o docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.webp
# exit code: 0

cwebp -q 90 -metadata none docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-trellis-paths.png -o docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.webp
# exit code: 0
```

### 6.2 AVIF 编码命令
```bash
ffmpeg -y -i docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-cover.png -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.avif
# exit code: 0

ffmpeg -y -i docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-mature-crops.png -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.avif
# exit code: 0

ffmpeg -y -i docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/masters/how-to-harvest-stardew-valley-trellis-paths.png -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.avif
# exit code: 0
```

### 6.3 解码验真命令
```bash
dwebp docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/<name>.webp -o docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/decoded/<name>.webp.png
# exit code: 0

ffmpeg -y -i docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/<name>.avif -update 1 -frames:v 1 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/decoded/<name>.avif.png
# exit code: 0
```

---

## 7. 供 Root 协调员实际 View 验收的绝对路径索引

为便于协调员在终端中直接审查验收，以下为本批交付的全部绝对路径：

1. **封面图 (Cover)**:
   - Staged WebP: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.webp`
   - Staged AVIF: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.avif`
   - Decoded PNG: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/decoded/how-to-harvest-stardew-valley-cover.webp.png`

2. **成熟作物近景 (Mature Crops)**:
   - Staged WebP: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.webp`
   - Staged AVIF: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.avif`
   - Decoded PNG: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/decoded/how-to-harvest-stardew-valley-mature-crops.webp.png`

3. **棚架通道 (Trellis Paths)**:
   - Staged WebP: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.webp`
   - Staged AVIF: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.avif`
   - Decoded PNG: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/decoded/how-to-harvest-stardew-valley-trellis-paths.webp.png`

4. **完整机器可读 Manifest**:
   - `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/manifest.json`

---

## 8. 总结与交接状态

- **交付数量**: 3 组真实画面 × 2 种现代格式 = 6 个 Staged 文件。
- **验证结论**: 像素分辨率 100% 均为 1672×941（注：格式间尺寸一致仅代表分辨率相同，非无损像素一致）；反解图像本批 view 未见黑线；封面体积远低于 1.25 MB；390px 移动视口仅为估算，不作 browser PASS 断言。
- **后续交接**: 本叶子角色工作完毕，后续由文章组装角色 G 负责将 staged 文件安装至 `public/blog/`，并在正文与 SEO 中配置对应图注与元数据。
