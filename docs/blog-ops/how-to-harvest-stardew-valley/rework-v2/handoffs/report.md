# 角色 F 中英文公开交接冻结报告 · 第 2 轮 (Rework-v2 Handoffs)

- **角色与阶段**：角色 F（Role F / Independent Public Handoff Freeze，阶段二：中英文两份 `PublicBlogHandoff` 最终技术冻结）。不兼任 A（研究）、B（布局）、C（写作）、D（写后检查）、E（独立审核）、T（翻译）、G（页面装配）或主协调者。
- **当前任务标识**：`task_f4eafd491353`；**派发上下文**：`ctx_e5d4454b52f3`
- **执行终端 Handle**：`term_d9545cc3-1425-47c0-a3a0-bbd12ffe8e10`；**协调员终端 Handle**：`term_4a842e78-67be-4669-9731-4a90bf8dc4f0`（代际 Consumer Generation 3）
- **当前编排 Run**：`run_2434613566b2`
- **工作树路径**：唯一工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **规则依据**：桌面博客-V7修订版规则 `04-公开交接与页面装配.md`
- **产出路径**：
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/public-blog-handoff-en.json`
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/public-blog-handoff-zh.json`
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/report.md`
  - `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/`

---

## 一、各阶段角色与前置批准溯源 (Role Ledger & Approval Receipts)

本任务严格依照 7 大角色独立隔离要求（互不混用终端 Handle 与会话上下文，逻辑隔离，未声明操作系统级物理容器隔离），记录各阶段前置任务的真实 Task ID、Dispatch ID 与审批结论：

| 角色代码 | 任务角色与阶段 | 真实 Task ID | 真实 Dispatch ID | 执行终端 Handle | 代理身份 | 批准状态与哈希 |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | 事实核验与未支持结论纠正 | `task_bf9fe083803b` | `ctx_4341939a7772` | `term_a2d9a024-afd2-4b08-bab4-7159ab483a3c` | `antigravity` | **succeeded**，产出 `facts-audit-v2.md` / `facts-regrowth.md` |
| **B** | 布局证据边界补正 | `task_4032dbddd510` | `ctx_50e96a6d8a78` | `term_69fef97d-d313-497c-8411-5535d023b651` | `antigravity` | **succeeded**，产出 `layout.md`，锁定单意图任务卡与图位 |
| **C** | 正文集中修订第 2 轮 | `task_6cfc067b851c` | `ctx_dd0a8168d0b4` | `term_43664bbb-bf1a-4331-8bd8-23cdbfb354a0` | `grok` | **succeeded**，修正 7 处 ReaderValue，定稿正文哈希 `d2908d59...` |
| **D** | 写后三门复验第 2 轮 | `task_9a49307208a9` | `ctx_a7afcadd5874` | `term_ffd1a23b-e0c9-422e-8478-79dd18cb0f4d` | `grok` | **succeeded**，三门全过（ResearchTrace, ReaderValue, Repetition） |
| **E (body)** | 英文候选独立八层鉴文第 2 轮 | `task_f52988ed2be5` | `ctx_0eafdf7031cb` | `term_9b02da66-7148-4bb9-be39-197336b2ab6a` | `antigravity` | **succeeded**，八层鉴文 PASS，同构确认绑定 `d2908d59...` |
| **F (lock)** | 英文正文锁稿与 SEO 候选第 2 轮 | `task_9f6e1015f10b` | `ctx_faa086858d96` | `term_aca9cc2c-4e32-400d-ac3b-3df9f72a82c4` | `antigravity` | **succeeded**，锁定正文并生成 SEO 候选 |
| **E (SEO)** | 英文标题与 SEO 独立审核 | `task_c1f88c107e6e` | `ctx_07bea4b4bacd` | `term_e100ce17-c249-4dac-91ed-22c70c2bd59a` | `grok` | **succeeded**，`review-e/seo-r2.md` 审核通过 (PASS) |
| **T** | 从锁定英文翻译中文 | `task_8fc0b28f778d` | `ctx_9c7df461abff` | `term_c5fff4ae-4f21-4b9d-8a40-6debe39325c0` | `grok` | **succeeded**，产出 `zh-body.md` 等全套中文文件 |
| **E (zh)** | 中文译文独立审校 | `task_f80b0d61070b` | `ctx_d4802edae112` | `term_42d6a22a-3b35-4653-9c29-5690bd1d64b9` | `antigravity` | **succeeded**，`review-e/translation-r2.md` 审校通过 (PASS) |
| **F (freeze)**| 冻结中英文公开交接 | `task_f4eafd491353` | `ctx_e5d4454b52f3` | `term_d9545cc3-1425-47c0-a3a0-bbd12ffe8e10` | `antigravity` | **本任务 (Current)**，冻结中英文两份 `PublicBlogHandoff` |

---

## 二、输入文件确定性核验 (Input Verification)

本角色在冻结前重新核算了 8 份核心输入文件的原始字节 SHA-256，与 E 批准报告完全一致：

| 输入文件路径 | 原始字节 SHA-256 | 字节大小 | 批准来源 | 状态 |
| :--- | :--- | ---:| :--- | :---: |
| `rework-v2/en-body.locked.md` | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` | 10036 | E 鉴文 / E 题文 | PASS |
| `rework-v2/en-seo.json` | `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9` | 3201 | E 题文 `seo-r2.md` | PASS |
| `rework-v2/en-media.locked.json` | `87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885` | 4229 | E 题文 `seo-r2.md` | PASS |
| `rework-v2/en-public-references.locked.json` | `52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e` | 10294 | E 题文 `seo-r2.md` | PASS |
| `rework-v2/translation/zh-body.md` | `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd` | 9174 | E 译文 `translation-r2.md` | PASS |
| `rework-v2/translation/zh-seo.json` | `49dffecf14f8fb5ddf549334bc6c1f14408cb0ed5f8b58e4bac5826898b8910f` | 3099 | E 译文 `translation-r2.md` | PASS |
| `rework-v2/translation/zh-media.json` | `c6abd143616de6f03bc868121b41f9ae8a50f317b70dfbea37c67f3e282e95a7` | 4203 | E 译文 `translation-r2.md` | PASS |
| `rework-v2/translation/zh-public-references.json` | `7ca77bb04069808b5635e186985b936f15a25059f6de197ba0c229569b731c63` | 10267 | E 译文 `translation-r2.md` | PASS |

---

## 三、六张 Staged 图片公开媒体核验 (Media Assets Fidelity)

依据桌面 V7 规则与任务指令，必须使用本次 staged 准备的 6 张新闻素材图片，严格禁止使用旧版 methods 方法图。使用 `sips` 现场验证分辨率均为 1672×941：

| 逻辑资产 | 格式 | 公开挂载路径 | 字节数 | 原始 SHA-256 | 分辨率 | 状态 |
| :--- | :--- | :--- | ---:| :--- | :---: | :---: |
| 封面图 (Cover) | WebP | `/blog/how-to-harvest-stardew-valley-cover.webp` | 479250 | `0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574` | 1672×941 | PASS |
| 封面图 (Cover) | AVIF | `/blog/how-to-harvest-stardew-valley-cover.avif` | 237604 | `8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57` | 1672×941 | PASS |
| 成熟南瓜图 (`media-mature-crops`) | WebP | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp` | 267644 | `d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd` | 1672×941 | PASS |
| 成熟南瓜图 (`media-mature-crops`) | AVIF | `/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif` | 143638 | `cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1` | 1672×941 | PASS |
| 棚架走道图 (`media-trellis-paths`) | WebP | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp` | 223784 | `027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4` | 1672×941 | PASS |
| 棚架走道图 (`media-trellis-paths`) | AVIF | `/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif` | 113557 | `7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a` | 1672×941 | PASS |

- **公开署名与出处**：封面与正文两图均保留 ConcernedApe 署名及新闻素材原图公开链接（`Multiplayer_Screenshot2.png` / `farm_evening_1920x1080.png`）。
- **中英文共用**：封面图与两张正文图在 EN 与 ZH 中完全共用相同的公开 URL、尺寸和哈希，仅 alt 与 caption 适配相应语言。

---

## 四、中英文 PublicBlogHandoff 产出与完整性摘要 (Handoff Deliverables)

两份交接文件严格依照桌面 V7《04-公开交接与页面装配.md》定义的 8 个顶层字段组织，无额外私有字段：
1. `locale`
2. `country`
3. `body`
4. `bodyHash`
5. `seo`
6. `publicReferences`
7. `publicRequirements`
8. `integrity`

### 4.1 交付清单与哈希

| 交付文件 | 字节数 | 文件 SHA-256 | 内部 Integrity Digest | 绑定正文哈希 |
| :--- | ---:| :--- | :--- | :--- |
| `rework-v2/handoffs/public-blog-handoff-en.json` | 27689 | `8ca4288debffa704154f48db2a58b68a2fadbd68fa2628040b49d37a7f56485f` | `1f6ce71800a74662a4176e3a271091b5721c897cf3e8741f6b7d4d9982c679fb` | `d2908d59...` |
| `rework-v2/handoffs/public-blog-handoff-zh.json` | 26608 | `896976369ee8abc18fbcc5983f2f5472fa5b0dcd216244f2046eeca6a390d7eb` | `bfb2ab219272bce7d2dd40bac003a0d4e3137e8fb861513d7d8247bba161a836` | `30dae640...` (ZH)<br>`d2908d59...` (EN) |

### 4.2 核心合规指标验证

1. **确定性规范化与哈希**：
   - 正文字节严格保持 UTF-8 NFC-LF 原文，未改写、未摘要；
   - `integrity.digest` 算法：取前 7 个公开字段（locale, country, body, bodyHash, seo, publicReferences, publicRequirements），用 UTF-8、`sort_keys=True`、分隔符 `(',', ':')` 做 JSON 序列化后计算 SHA-256。写盘后重读复算 100% 吻合。
2. **ZH integrity 跨语言绑定**：
   - `public-blog-handoff-zh.json` 的 `integrity` 显式记录 `sourceEnglishBodyHash: "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"`，严格绑定本轮英文锁定正文。
3. **21 条公开引用双语精确匹配**：
   - 英文与中文各包含 21 条核验合格的公开引用；
   - 每条引用的 `quote` 片段在对应语言的 `body` 中出现次数均 $\ge \text{occurrence}$；
   - 保留全部引用 URL 及维基 `oldid` 版本信息，定位编号不进入正文渲染。
4. **身份与元数据沿用现有接口**：
   - 英文作者 `Stardew Valley Planner Team`，中文作者 `星露谷规划器团队`；
   - 阅读时间 `readTimeMinutes: 6`（基于 1,107 净词数及 200 词/分钟估算）；
   - `canonicalUrl` 严格无尾斜杠；`schemaType: "Article"`；`faq: null`；`datePublished: null`；不发明虚构作者或发布日期。
5. **严禁私有与研发残留 (Zero Forbidden Tokens)**：
   - 全文机器检索检查，绝对无 `/Users/` 本地路径、无 `docs/blog-ops` 私有路径、无 `task_` / `ctx_` / `term_` 调度标记、无 `SERP` / `PAA` 研究痕迹、无 `operation-store`、无 `canary`、无 `pending_media` / `pending_*` 临时状态。

---

## 五、机械验证与执行收据 (Mechanical Verification Receipts)

所有验证命令均在工作树根目录实际执行并记录退出码与输出：

```bash
# 1. 执行交接冻结与端到端校验脚本
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/freeze_public_handoffs.py

# 2. 执行独立 7 项机械核验脚本
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/verify_handoffs.py
```

**验证结果**：
- 退出码：`0`（两脚本均以 Exit Code 0 退出）；
- 7 项测试全部通过：
  - `CHECK 1 PASS`: 顶层 schema 严格匹配 8 个字段；
  - `CHECK 2 PASS`: 正文哈希与已批准版本完全一致；
  - `CHECK 3 PASS`: 21 条公开引用在双语正文中定位成功率 100%（失败数 0）；
  - `CHECK 4 PASS`: 6 张 staged 媒体哈希与 1672×941 尺寸验证通过；
  - `CHECK 5 PASS`: Canonical integrity digest 与 ZH 绑定英文哈希验证通过；
  - `CHECK 6 PASS`: 零私有路径与研发痕迹残留（Forbidden tokens: 0）；
  - `CHECK 7 PASS`: ConcernedApe 署名与出处链接完整保留。

收据与日志持久化于：
- `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/sha256-receipts.json`
- `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/command-log.txt`
- `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/evidence/verify.stdout.txt`

---

## 六、工作树边界与待办交接声明 (Boundaries & Next Steps)

- **文件边界遵守**：
  本任务严格遵守授权边界，仅在 `docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs/` 新增 2 份公开交接 JSON、1 份报告 `report.md` 以及 `evidence/` 目录；绝对未修改 `src/` 产品代码、未修改 `public/` 资产、未修改历史 `handoffs/` 文件、未修改测试或规则文件。
- **免责与状态声明**：
  本阶段为角色 F 的技术交接冻结，**不代表用户终审，亦不代表生产站已发布或上线**。
  本阶段未执行页面源码装配、未启动本地开发服务器、未启动浏览器验证、未运行 build 构建。
- **下一步交接 (Role G)**：
  两份完整合规的 `public-blog-handoff-en.json` 与 `public-blog-handoff-zh.json` 已正式就绪，可供下游角色 G 独立装配进现有 Next.js 网站路由（`app/(en)/[slug]/page.tsx` 与 `app/zh/[slug]/page.tsx`）。
