# 媒体私有记录与素材勘误报告 (Rework-v2 Media & Receipts Record Errata)

- **执行角色**: 机械修正角色 Q (Media Record Errata Leaf Worker Q)
- **任务标识 (Task ID)**: `task_4948b1fa0540`
- **派发上下文 (Dispatch ID)**: `ctx_8c0849411cb7`
- **协调员终端**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **执行终端**: `term_6d1a9b3a-114a-4cac-82d5-d20485a0dac6`
- **日期**: 2026-10-13
- **前置交付状态**: 前序媒体制作角色 M 已交付 6 个 WebP/AVIF 文件并 settled released。本任务对私有记录执行机械勘误，零改动图片字节。

---

## 1. 任务背景与 Root 审阅输入 (Root Audit Inputs & Scope)

协调员 Root 已实际通过 `view_file` 查验现 Stage 的 3 张 WebP 图像及原始素材源图（`press-farm-evening.png`、`press-multiplayer-2.png`）。审查发现前序角色 M 的私有记录文件（`media.md` 与 `manifest.json`）中包含多处与真实画面不符的过度推断及未经验证语义。

Root 明确拒绝以下语义断言，并指派角色 Q 机械修正私有记录：
1. **拒绝成熟作物图“4x5 完整南瓜阵列”误述**；
2. **拒绝蓝衣玩家“刚收获”输入/动作时序断言**；
3. **拒绝棚架作物图“红衫角色穿行于葡萄棚架通道中”及“右侧为木葡萄棚架”误述**；
4. **拒绝移动端“390px 手机实测 browser PASS”口头断言**；
5. **拒绝无 raw 复现证据的“macOS 512 历史规避”因果关系断言**；
6. **拒绝“WebP 与 AVIF 像素完全一致/无损等同”推断**。

本任务严格限制在唯一工作树内，仅对 `rework-v2/media.md`、`media/manifest.json`、`media/build_media.py` 中的描述字符串进行机械替换，新增本勘误报告及必要执行 stdout。严禁重新编码图像、严禁修改任何图片字节/尺寸/哈希/URL/退出码，严禁触碰任何正文、代码、测试或部署配置。

---

## 2. 真实画面事实核定与旧 M 描述驳回 (Visual Facts vs. Rejected Misdescriptions)

### 2.1 成熟作物近景 (`how-to-harvest-stardew-valley-mature-crops`)
- **来源原图**: `press-multiplayer-2.png` (MultiplayerScreenshot2 白天农场截图)
- **旧 M 误述 (Rejected)**:
  - 误称：“4 行 × 5 株成熟金橙色南瓜田”；
  - 误称：“左侧农夫举着刚收获的绿色蔬菜”；
  - 误称：“在 390px 移动视口下...手机实测”。
- **Root 实际 View 核定之真实画面事实 (Verified Facts)**:
  - **南瓜阵列事实**: 南瓜田耕地泥土与绿叶藤蔓分明，但**顶行仅有 2 株成熟南瓜**（右侧泥地上站立绿色衣服玩家，无南瓜），下方三行各 5 株，总计 17 株成熟金橙色南瓜，**并非完整的 4×5 方阵**。
  - **玩家动作事实**: 左侧玩家身穿蓝色背带裤，双手举起绿色蔬菜（小白菜 Bok Choy）。此为官方联机截图中的静态展示画面，**无法推断其属于刚按键收获的动作时序或输入瞬间**，不得虚构游戏动作时序。
  - **移动端视口事实**: 390px 移动视口下的物理尺寸（约 30px）仅为几何推算与视觉估计，**未经原生浏览器自动化 PASS 测试**，不可声称 browser PASS。

### 2.2 棚架过道图 (`how-to-harvest-stardew-valley-trellis-paths`)
- **来源原图**: `press-multiplayer-2.png` (MultiplayerScreenshot2 顶部农场截图)
- **旧 M 误述 (Rejected)**:
  - 误称：“右侧为 4 列垂直生长的棚架作物”；
  - 误称：“一名红衣黑发玩家正清晰站立并穿行于两列棚架之间的泥土通道内”；
  - 误称：“手机实测极为清晰”。
- **Root 实际 View 核定之真实画面事实 (Verified Facts)**:
  - **棚架与作物分布事实**:
    - 画面**左侧两列**为带木桩支撑的紫葡萄棚架行与红果灌木丛，中间泥地过道及通往上方木门的铺石小径清晰可见；
    - 画面**右侧 4 列**为黄色高茎植株（带黄花高茎作物），**并非木质葡萄棚架**；
  - **角色站位事实**: 红衣黑发角色正站立在**右侧黄色高茎作物田块内部**，**绝非穿行于左侧木质葡萄棚架通道中**。
  - **移动端视口事实**: 390px 移动视口下的显示仅为几何估算值，未经原生浏览器自动化 PASS。

### 2.3 编码格式与尺寸一致性说明
- **WebP 与 AVIF 一致性辨析**:
  - manifest 与报告记录的宽 1672、高 941 一致，**仅代表像素分辨率完全同构**；
  - WebP（libwebp）与 AVIF（libaom-av1）属于不同压缩算法，编码后存在有损量化差异，**绝非字节级或逐像素无损一致**。
- **macOS 512-tile 历史描述清理**:
  - 旧报告声称使用 ffmpeg 规避了 macOS sips 的 512px tile 分割黑线瑕疵。
  - 由于当前环境下未留存 sips 分割瑕疵的 raw 对比复现证据，Root 要求删除无证据的避坑因果断言；
  - 客观如实记录：**本批实际查看的反解 PNG 图像连续平滑，未见切片黑线或网格异常**。保留真实的 ffmpeg 与 dwebp 编解码命令行与 exit code 0 证据。

---

## 3. facts-audit-v2 私人记录勘误说明 (facts-audit-v2 Errata)

在审查前序私有研究记录 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit-v2/` 时发现：
- 其私有取证记录脚本 `save_v2_receipts.mjs` 及输出 `raw-sources-receipts.json` 中，部分记录的 `retrievedAt` 戳记为未来的 UTC 时间（例如 `2026-10-13T07:55:00Z`，在执行时刻 UTC 尚处于较早时点）。
- **Root 定性与处理准则**:
  1. 该部分带有未来时间戳的 `retrievedAt` 私人记录，**不作为已验证的取证时间依据**。
  2. 严格遵守用户规则与边界要求：**“不改源/杜撰修正 timestamp”**。严禁私自修改原 JSON/MJS 文件，严禁杜撰或伪造过去/当前时间戳。
  3. 将该事实完整收录于本私有勘误报告中备查，供审计与后续流程追溯。

---

## 4. 交付资产 SHA-256 零漂移验证 (Zero-Byte-Drift Integrity Verification)

本任务运行机械修正脚本 `record-errata/apply_errata.py`，修正前后对全部 6 个 staged 资产进行 SHA-256 哈希比对。结果证实图像字节 100% 保持未变，完全杜绝重新编码或字节污染：

| 资产文件名 | 格式 | 宽×高 | 修改前 SHA-256 | 修改后 SHA-256 | 验证状态 |
| :--- | :---: | :---: | :--- | :--- | :---: |
| `how-to-harvest-stardew-valley-cover.avif` | AVIF | 1672×941 | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | **100% 一致** |
| `how-to-harvest-stardew-valley-cover.webp` | WebP | 1672×941 | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | **100% 一致** |
| `how-to-harvest-stardew-valley-mature-crops.avif` | AVIF | 1672×941 | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | **100% 一致** |
| `how-to-harvest-stardew-valley-mature-crops.webp` | WebP | 1672×941 | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | **100% 一致** |
| `how-to-harvest-stardew-valley-trellis-paths.avif` | AVIF | 1672×941 | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | **100% 一致** |
| `how-to-harvest-stardew-valley-trellis-paths.webp` | WebP | 1672×941 | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | **100% 一致** |

---

## 5. 项目状态与合规声明 (Current Status & Governance)

1. **用户终审待审**: 当前所有 rework-v2 材料处于私有就绪状态，等待用户最终审定。
2. **部署未执行**: 严禁且未执行任何部署（Deploy）、提交（Commit）、推送（Push）、依赖变更或外部写入。
3. **无产品级代码改动**: 本任务仅机械修正私有工件中描述字符串，未改动任何 Next.js 页面源码、UI 组件或正式测试套件，故无需触发全站 typecheck / build / nativebrowser 测试。
4. **JSON 解码验收**: `media/manifest.json` 经 Python 标准 `json.load()` 解析验证，语法完整、结构严谨、属性匹配。

---

## 6. 归档索引与产物清单 (Artifacts & File Locations)

- 机械修正脚本: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/record-errata/apply_errata.py`
- 执行标准输出记录: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/record-errata/stdout.log`
- 修正后媒体清单: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/manifest.json`
- 修正后媒体构建脚本: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/build_media.py`
- 修正后媒体报告: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media.md`
- 本勘误报告: `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/record-errata.md`
