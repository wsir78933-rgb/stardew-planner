# Research integrity review

核对日期：2026-09-26（Asia/Shanghai）。角色：Q-research；只复核交接证据，不写正文、不改研究材料、不替代事实核验。

## 结论

整体证据链可用，未发现会使英文或中文研究失效的事实映射、地区表述或语言独立性错误。发现 1 项中严重度可复现性缺口：英文命令表把说明性占位符宣称为“real commands”，中文命令表也只保留高层命令名；这不推翻已列出的来源与事实，但阻止第三方按记录逐字重跑 SERP/来源提取。其余边界均被诚实标为 UNVERIFIED 或限制条件，不能把本次材料表述为精确 US/CN Google SERP、游戏实测或已验证计算器算法。

## 可复现问题

### RI-01 — 命令日志不是可逐字重跑的命令（中）

- **证据：** `docs/blog-ops/stardew-valley-speed-gro/research/en.md:85-99` 先称下表为实际使用的命令，但表中 `ego-browser nodejs -e '<Google search ...>'`、`'<Bing variant extraction ...>'`、`'<explicit-error source-page read ...>'` 是说明性占位符，不是可执行的 JavaScript。`docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/command-evidence-2026-09-26.md:5-20` 同样只给出 `ego-browser nodejs` 等高层摘要，没有保存可重跑的查询脚本、选择器和来源批次。
- **影响：** 评审者可以按 `en-evidence/source-facts.md`、`zh-evidence/source-pages-2026-09-26.md` 看到事实—URL 映射，但不能仅凭命令表复现结果提取、地区元数据和 `navError/loadError/evalError` 检查。严重度为中：影响审计可复现性，不足以单独判定事实为假。
- **事实边界：** 当前只能把这些退出码当作 A-zh/A-en 的交接记录；不能把它们升级为 Q 已独立重跑的原始命令证据。若后续需要可复现审计，应补充去除私密信息后的实际脚本/参数；本 Q 不修改研究材料。

## 已确认的完整性边界

| 检查项 | 结论与证据 | 可公开结论边界 |
|---|---|---|
| 地区限制 | **PASS（诚实记录）**。英文明确写 `setlang=en-US&cc=US` 不是个性化 US SERP，且 Google/DuckDuckGo 被拦截（`en.md:13-17,91-99`）；中文明确写 `cc=CN` 不是物理位置或中国大陆 Google SERP，Google 未取得自然结果（`zh.md:25-32`、`zh-evidence/serp-bing-2026-09-26.md:3-8,122-126`）。 | 只能说 Bing 的参数化语言/市场请求观察；不能写 US/CN 精确 Google 排名、搜索量或 CTR。 |
| 英文事实与来源 | **PASS（映射完整）**。`en.md:52-56` 的 F1–F5 均在 `en-evidence/source-facts.md:5-57` 逐项给出来源、打开支持和限制；官方 1.6 变更与社区 Wiki 数据未混称。 | F1 可归因第一方更新日志；F2–F6 是社区维护资料，必须保留来源类别和版本/条件限制。 |
| 中文事实与来源 | **PASS（映射完整）**。`zh.md:62-73` 的 ZH-F01–F05/ZH-T01 对应 `zh-evidence/source-pages-2026-09-26.md:9-53` 的直接页面记录；灰机旧配方冲突已在 `zh.md:75-78` 和 source-pages 中明确排除。 | 当前配方可引用“松焦油 1 + 苔藓 5”并保留 1.6 边界；灰机旧“蛤”配方、额外施肥惩罚和术语评论不可作为当前事实。 |
| 中英文独立性 | **PASS**。中文原词的英文主导 Bing 结果仅作结果形态记录；`zh.md:27,64` 明确未把英文摘要/英文研究翻译成中文事实，中文事实来自已读中文页面。 | 不可用英文研究代替中文 SERP 或中文来源；共享事实需再次检查适用版本和语言表述。 |
| 原始来源读取 | **PASS（按交接记录）**。英文 source-facts 声明搜索摘要未作为事实证明（`en-evidence/source-facts.md:3`）；中文 source-pages 说明所有列出的中文来源已在 Ego-browser 读取 DOM（`zh-evidence/source-pages-2026-09-26.md:3-7`）。Q 另用本地 Ego-browser 直接打开了官方 1.6 更新日志与中文“生长激素”页，标题/关键正文回读成功，命令退出码 0。 | 可继续使用列出的直接 URL；竞品、贴吧、Steam、计算器只可作需求/结构观察，不能升级成权威游戏机制证明。 |
| 实测与计算器 | **PASS（未冒充）**。`en.md:82`、`en-evidence/source-facts.md:84-94` 明确没有游戏存档、种植收获或计算器交叉验证；中文材料也禁止补造取整算法（`zh-evidence/source-pages-2026-09-26.md:33-35`）。 | 任何收益、额外收获、取整或“值得”结论都必须带作物、日期、版本和计算假设，不能称为实测。 |

## Q 复核实际命令与退出码

- `sed` 读取 `/Users/wusir/Desktop/博客-V7修订版/执行入口.md`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md`：退出码 0。
- `sed` 读取 `/Users/wusir/.mirasim/skills/ego-browser/SKILL.md`：退出码 0。
- `orca orchestration check --terminal term_8ae56d98-2565-4a11-b093-8a7562809bbb --json`：退出码 0，未收到 follow-up；该终端标识仅作运行记录，不作为公开材料。
- `ego-browser nodejs` 在一个 Q TaskSpace 中直接打开以下两个来源并回读标题/关键正文：退出码 0；随后 `task.finish({keep: []})` 退出码 0、空间关闭。
  - <https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/>
  - <https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0>
- 对上述 10 个交接文件执行 `sha256sum`：退出码 0；哈希如下。未读取 `operations/canary.json` 原值。

## 读取文件哈希（SHA-256）

| 文件 | SHA-256 |
|---|---|
| `docs/blog-ops/stardew-valley-speed-gro/research/en.md` | `740df21d4db0a9c1e7caf0e79fed939919f107ffa409e2c9723e3a887688457f` |
| `docs/blog-ops/stardew-valley-speed-gro/research/en-evidence/front-page-coverage.md` | `9ffb5c6b840f2012fc10c37eb7172e34f9ca26fcd0c6637ffefe83921ae53802` |
| `docs/blog-ops/stardew-valley-speed-gro/research/en-evidence/serp-bing-2026-09-26.md` | `678639b166dc1acea4821460497170a560373fe7cb2d39a3e53e3686a8e66922` |
| `docs/blog-ops/stardew-valley-speed-gro/research/en-evidence/source-facts.md` | `b686e37cf834047fff16adadb8d61ca9b0c8b63ae7e02285ba97509d7a840de5` |
| `docs/blog-ops/stardew-valley-speed-gro/research/zh.md` | `a13c54c21fbd087c1d8972dd73c9cc189c9c41b72da7ff84c4d14525a58865c7` |
| `docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/command-evidence-2026-09-26.md` | `4c6a6151666e8eaa66536fd2d6877d94428517a9d0a906419521ff1ee6df6ae9` |
| `docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/serp-bing-2026-09-26.md` | `93bcb5ec860088f443f5ad7227b5062a2ddd841d87e15ed6bf282e289239dc98` |
| `docs/blog-ops/stardew-valley-speed-gro/research/zh-evidence/source-pages-2026-09-26.md` | `152ff538ffaede4abded3b28e2056c59149df1f8d19fa862b3601b621460d5e6` |
| `docs/blog-ops/stardew-valley-speed-gro/research/site-context.md` | `a177045d5a7e294eb2cf4ffeceec143a15bb9b250dfc9934fa7bcba26a7336f9` |
| `docs/blog-ops/stardew-valley-speed-gro/operations/environment.md` | `b1ba15d682a253f547c7c2a1e3f2d948354dfed87b8ef6121a4e5679da0b08a6` |

## 交付范围

本 Q 只新增 `docs/blog-ops/stardew-valley-speed-gro/reviews/research-integrity.md`。没有读取 canary 原值，没有修改研究、站点、源码、依赖、密钥或外部服务。
