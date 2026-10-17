# S 最终精确扫描与结算记录

- 角色：S。只做控制记录、精确泄漏扫描和结算证据。不是作者、译者、D/E/R、G。
- Task `task_5d9c57fb7f0b`，Dispatch `ctx_61845f3977af`，终端 `term_7ec8f476-bd03-4ddc-a26d-faa70219608a`。
- Run `run_8253831e93d6`。本终端未执行 `run-use` / `run-create`。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。HEAD `bf91a14829067ed1c9c2a206a97985e17dbebdda`。
- 主工作区 `/Users/wusir/Desktop/开发项目集合/stardew planner` 的 HEAD 现为 `bbc7ebcfe0d81af7c234366ce43fb21239141651`。这是后来独立变化，不把主区说成全程未动，也不在本树 rebase 或合并。
- `git worktree list` 有 3 条：主区 `bbc7ebc`、旧博客工作树 `bb513c4`、本树 `bf91a14`。本会话新建的是这一条博客-2。列表总数不是新建数。
- 公开 CLI 读取时刻：`2026-10-16T23:44:55+0800`。严格扫描在其后完成，原始 stdout 在 `final-checks.log`。
- 本记录不签署用户终审，不做 commit、push、deploy。技术冻结和本地页面不是生产发布。

## 1. 精确扫描门

严格扫描是修正 Pillow 失败路径之后的那一次。

| 次序 | 结果 | 能不能当严格门 |
|---|---|---|
| 中文 SVG 路径 | 退出码 1。`provenance` 的 svg 只有 `filename`，脚本当时读 `relativePath`，得到 `None`，在 `startswith` 处抛出 `AttributeError`。英文 3 张 SVG 已记下 0 命中。该次 stderr 文件被后续重定向覆盖，traceback 只留在本段。 | 否。脚本缺陷，不是内容命中。 |
| Pillow 宽捕获版 | 退出码 0。stdout 保留在检查日志的 “before pillow fix” 段。`except Exception` 会在读取失败时把命中写成 0 再继续。该次 Pillow 实际打开了 12 张图，但 AVIF 的 info 字符串被记成 0 字段。 | 否。协调者 `msg_c85eea4a1912` 指出这条路径不能当通过。 |
| Pillow 严格版 | 退出码 0，stderr 空。异常不再被写成 0。日志段为 run C。 | 否。随后又把正文绑定从 `main` 抽成独立函数，所以这不是最后一次。 |
| 正文绑定函数之后 | 退出码 0，stderr 空，99 行，`exactHitCounter=0`。`main` 只调用 `require_bilingual_body_binding`。 | 是。0 命中只以 run D 为准。 |

身份文件 SHA-256 `d8022e54453b9c56da89bfbcfd350f0aa3a8c675a1d8976f5b85a1a9e702ed23`。标记字符串 SHA-256 `401cad403b3b56138aee2a8cde4c2099a87c2c780f178ff05cc664816d6efac1`。标记长度 33。明文和标记 ID 没有写入脚本、stdout、stderr 或本报告。模式 `0600`，UID 501，本进程能读该文件。这只是逻辑隔离，不是操作系统或多用户隔离。

精确字节未出现只说明指定字符串不在所列层。它不证明语义清白、像素 OCR 清白，也不证明研究痕迹不存在。旧 control 和 research 没有纳入扫描；私有标记预期留在身份文件里。

JSON 的 `fieldCount` 含每个字符串值和每个对象键。原始字节另计一层。两层命中都是 0。

| 目标 | 层 | 字段数 | 命中 |
|---|---|---:|---:|
| `handoff/public/en.json` | 字符串+键 / 原始 | 453 / 1 | 0 |
| `handoff/public/zh-CN.json` | 字符串+键 / 原始 | 457 / 1 | 0 |
| `lock/en/body.md` | 原始 | 1 | 0 |
| `content/zh/draft-zh-v2.md` | 原始 | 1 | 0 |
| `seo/en/seo-candidate.json` | 字符串+键 / 原始 | 46 / 1 | 0 |
| `content/zh/seo.zh.json` | 字符串+键 / 原始 | 28 / 1 | 0 |
| `content/en/public-references.en.json` | 字符串+键 / 原始 | 332 / 1 | 0 |
| `content/zh/public-references.zh.json` | 字符串+键 / 原始 | 272 / 1 | 0 |
| `content/en/media-text.en.json` | 字符串+键 / 原始 | 139 / 1 | 0 |
| `content/zh/media-text.zh.json` | 字符串+键 / 原始 | 91 / 1 | 0 |
| 6 个 SVG | 可见 `<text>` 11/10/10 与 11/10/10；另各有原始层 | 与 `inImageText` 逐项相同 | 0 |
| 12 个生产 WebP/AVIF | 整文件字节；元数据见下节 | WebP 6，AVIF 4 | 0 |
| 两篇 TSX | 原始；引号计数字段 77 与 96 | 文件 SHA 与装配记录一致 | 0 |
| 注册对象两段 | 各 7 个引号字段 | 0 | 0 |
| `blog-post-registry.tsx` / `blog-post-identities.ts` / `blog-copy.ts` / `public/llms.txt` | 原始 | 448 / 31 / 174 / 1 | 0 |
| 两份 `out` HTML | 原始 | 1 | 0 |
| 8 个 RSC/flight 文本 | 原始 | 各 1 | 0 |
| 本地两页加 12 个资源，以及两页响应头 | HTTP 200 正文与磁盘字节相同 | 见日志 | 0 |

32 个预先点名的文件 SHA-256 全部相符，其中包括两份交接、冻结报告、两篇模块、manifest、G 验证三份、R 原报告与补遗、E 页面四份、译文 v2 报告、两份 HTML、`next-env.d.ts`。`next-env.d.ts` 为 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，与补遗所记 HEAD 字节一致，当前 `git status` 没有它。

## 2. 长度、交接和 12 张图

官方 `正文计数.py` 在 `PYTHONDONTWRITEBYTECODE=1` 下导入。导入前后 V7 `__pycache__` 快照不变。`正文计数.cpython-314.pyc` 的 mtime 仍是 `2026-10-13T00:22:08+0800`。

| 计数 | 实际 |
|---|---:|
| 英文锁稿机械词数 | 1138 |
| `count-input.md` 去掉两行正文图注后的合格词数 | 1085 |
| 中文 v2 官方机械汉字 | 1737 |
| 进入该机械正文的两行图注 | 42 与 48，合计 90 |
| 中文纯正文汉字 | 1647 |
| 中文全文件汉字 | 1905 |

中文 v1 的历史口径保持为全文件 1908、官方参考 1740、去掉标题/alt/图注后 1650。v2 不沿用这三组数字。英文合格数仍是 1085，中文不计入英文 Length。

两份 `publicFieldsSha256` 按冻结规则重算后等于记录值：英文 `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042`，中文 `d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94`。正文哈希分别等于锁稿与 `draft-zh-v2.md`。中文顶层和 `integrity.englishBodyHash` 都是英文锁稿哈希。交接正文与对应源文件字节相同。

冻结进 `integrity.status` 的句子仍是冻结当时的文字。英文件里的那句仍写页面尚未装配、生产未部署。本记录不改这句，也不把这句当成后来的装配状态。

12 个生产文件、`public/` 副本和 `out/` 副本字节相同，均为 1672×941。Pillow 12.2.0 实际打开全部 12 个：WebP 为 `WEBP`/`RGB`，info 有 `loop` 与 `background`，字段数 6；AVIF 为 `AVIF`/`RGB`，info 字典为空，字段数 4，来自 format、mode、width、height。`sips` 同为 1672×941。本机没有 `sharp` 包，也没有 sharp/exiftool 命令；AVIF 已由已安装的 Pillow 打开，所以没有改用别的解析器。6 个 WebP 的 RIFF 块里有有损 `VP8 `，没有 `VP8L` 块。这不是无损 VP8L，也不是像素 OCR。

provenance 里的光栅哈希与这 12 个文件一致。英文 provenance 仍写旧正文 `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628`，不含锁稿哈希。中文 `translatedBodySha256` 仍是 v1 `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843`；其中的 `englishBodySha256` 是锁稿哈希。冻结报告已把未改字节重绑到当前正文。provenance 文件没有改。

`AssemblyManifest.json` 的 `articles.en.outputSha256` 与 `articles.zh-CN.outputSha256` 都是 null。本记录不补写。模块哈希在绑定报告和验证报告里：英文 `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5`，中文 `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba`。中文模块实际 14218 字节。`zh-bindings.md` 写的 9658 是旧笔误，文件不改。补遗写明 manifest 由 G integration 创建，不是协调者编辑。

## 3. 分项证据

S 这次新跑的只有精确扫描和本地 HTTP。typecheck、build、Vitest、浏览器不是这次重跑。

| 类 | 证据 | 边界 |
|---|---|---|
| 源与冻结哈希 | 严格扫描退出码 0；32 个点名文件哈希相符 | 扫描之后没有改这些目标 |
| 测试 | G 日志：interface 退出码 1，8 失败 / 237 通过 / 245；full 退出码 1，12 失败 / 2478 通过 / 2490。6 个本次更新的测试文件在 interface 日志里是通过 | 历史 8 项保持失败。full 多出的 4 项没有变更前全量基线，未归因，未修 |
| 构建 | `commands.log`：`pnpm typecheck` 退出码 0；`next build --webpack` 退出码 0。记录为 68 个静态页、66 个 HTML、sitemap 62 条 loc | S 没有重跑构建 |
| 浏览器 | E 页面报告 `359c0b7e…`，结论 PASS，问题 0。桌面 1280×800，手机 390×844，四视图最终 DOM 差异 0 | 只计这同一版本。S 没有开浏览器 |
| 本地活页 | PID 21887，`127.0.0.1:3010`，cwd 为本树，`serve out`。两页 HTTP 200，正文 SHA 等于两份 `out` HTML。12 个资源 HTTP 200 且哈希相符 | 3000–3007 的原监听未动。预览终端记录为 `term_b00ff36c-e442-4fa4-91bd-8dd22a174071`，见 `preview.json`，本角色未停它 |

E 页面的首次 DOM 比较把 2 张图算进链接，得到 52 对 50，并比较了来源辅助字段 `titleText`。校正前的原始 JSON 在收到保留指令前已被覆盖。最终 4 份 `*-dom-after-images.json` 差异为 0。这不是正文修订，也不能写成第一次就通过。每页渲染 1 个 H1；正文组件不是 H1。每次文档加载有一条被取消的 Google Analytics 请求，`net::ERR_ABORTED`，不写成网络全空。`button#auto-comment-export-outlinks-btn` 是加载后插入 `body` 的外部控件，静态 HTML 和仓库源码没有这个 id。E 已点查，没有改共享 UI。

G 的初始环境比较曾要求当前 main 的包清单等于本树。随后 `head-package-proof.txt` 证明本树 `package.json` 与 `pnpm-lock.yaml` 原字节等于 HEAD。初始渲染检查 `ERROR_COUNT=4`，原因是把来源 label 和 note 当成必须有空格。分字段重查 `CORRECTED_ERROR_COUNT=0`。初始日志保留。

R 的 `worker_done` 主题写了技术审查 PASS，并把全量 12 项写成保留的历史基线。补遗 `95022b89…` 覆盖那些过强句子，原 `report.md` 不改。装配路径上“未发现已证缺陷”只停在那次审查范围。接口 8 项有逐项旧基线；full 的另外 4 项没有变更前全量基线。全量仍是 12 失败 / 2478 通过。这项证据校正不增加正文返修轮次。`task_53b0c16281f2` 已 succeeded，主题是补遗已写、`next-env.d.ts` 已恢复。

## 4. 必须留下的历史结论

这些没有改成通过。

- D enriched v4：PASS，0 问题。报告 `ae5c87028bcfbd6f5c751aa2024f7d2a5f6514fa11a1c7cb64f447f756f9058d`。
- E enriched v4：PASS，0 问题。报告 `9db00d9995472ebe2d316b712e04cf97571e814a98cef793c8b43b11669b7b85`。
- F 长度：短文 1085。锁记录仍写 used 3 / remaining 0，文件未改写。
- E 选定标题/SEO：PASS，0 问题。报告 `75596b5d6bbf527aafe3e8abee75f9e715f55d9cde4e75cc2c6e2f909a866028`。这只覆盖选定表面。
- E 标题过程补审：FAIL，3 个问题，另有 1 条无法补救的过程偏差。报告 `99a3d711e02bd0f42ce9930614ed630ef3b51c035fb2360de0132da2eaa27e64`。选定表面的 PASS 不能外推成 10 条描述当时已经写齐。
- T 首译提交单里的 `pending-independent-E` 是提交当时的状态，不改历史。
- E translation-v1：FAIL，5 个问题。报告 `779800ee6c3289d0af1d6c51664147e0f185cbf87bd7e009699112ea2b9ce2b4`。checks `0028ce2617850d6c04a963ccf6e56198b960688462fe0e18a4b08eea87efc7c5`。
- 该 checks 写明两次检索没有排除 `control/`。一次返回 6 个 control 文件摘录：`resume-2026-10-16.md`、`operation-store.json`、`v4-proof-checkpoint.md`、`enriched-v3-checkpoint.md`、`phase-3-records.json`、`authorization-isolation.md`。另一次字体/overflow 检索只返回 `media-production/zh/render.log`。返回内容没有身份文件名，也没有密钥明文。不能据此写成搜索器没读过该文件，也不能写成已验证隔离。
- E translation-v2：PASS，0 问题。报告 `ab443f03e8bbcc923a274d6897cb5bee060973d2108537301b48ae52956caed0`。这是第 4 轮局部复核，不重签英文事实或页面。
- 用户对“是否允许追加一轮，仅修 5 处中文问题再继续完成页面验收”的回复是“继续”。协调者于 2026-10-16 14:19:46 UTC 读钟确认。这是协调者时钟，不是用户消息的精确发送时刻。预算为原 3 轮加这一次例外，used 4，future 0。不重置，也不能再开无限修改。
- 中文装修图 4 行从 88/84 收到 72/64。当前 `render.log` 只有 `2026-10-16 09:38:09` 到 `09:38:11`，三次 `exit_code: 0`。更早的 exit 1 只出现在当时的 Orca 终端观察，不在这份日志里。三条标签的 `overflow` 仍是 true。`reject_overflow` 只比宽高。E 看过解码图，矩形外 6 像素亮像素环为 0。尺寸检查不能写成位置通过。

## 5. 任务与终端结算

公开 `task-list` 59 条。`failed` 的 result 原文如下，不改成通过：

| Task | result 原文 |
|---|---|
| `task_1287ac59ca63` | `cancelled` |
| `task_7f60bf2cf348` | `cancelled` |
| `task_09b5d2ee2f40` | `superseded_by_user_authorized_enrichment_before_full_review` |
| `task_bcf55e52ef19` | `superseded_before_dispatch_by_E_FAIL_and_round3_draft_v4` |
| `task_5af7afbdb937` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_fad78aeea636` |
| `task_b2b2f52a97c2` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_04fcbcdc9e44` |
| `task_cc75fdd4d3cb` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_5d9709714ebe` |
| `task_9e8cce85cf0f` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_c8b8721e8ee8` |
| `task_baeab4a9cbb5` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_55964e138648` |
| `task_b26031893220` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_dddb3a8ba83a` |
| `task_585dd08a7faf` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_76678cebd162` |
| `task_9cbb57290916` | `superseded_before_dispatch_by_user_authorized_round4_and_new_actual_dependencies:task_5117f2cdd8fe` |
| `task_5117f2cdd8fe` | `superseded_before_dispatch_by_required_R_evidence_correction_and_generated_file_cleanup_dependencies:task_5d9c57fb7f0b` |

其余 completed 任务的 CLI outcome 是 `succeeded`。其中内容结论仍是 FAIL 的，包括首轮 D 三门 FAIL、重复复核 FAIL、E v3 的 6 个问题、E 译文 v1 的 5 个问题、标题过程补审 FAIL 3。任务完成不等于这些门通过。

`worker-list` 在 `2026-10-16T23:44:55+0800`：counts `active=1`、`retained=1`、`released=45`，47 行。`--terminal-state reclaimable` 的 workers 为 0。当前 `ctx_61845f3977af` 是 active、resource `ownershipState=owned`、`releaseState=not_requested`，不属于可结算。

`ctx_1b67a6215356` 的 `terminalState` 仍是 `retained`，`workerState=succeeded`，`resource` 为 null。后继 `ctx_487c9c051d1a` 的 resource 是 `originDispatchId=ctx_1b67a6215356`、`ownerDispatchId=ctx_487c9c051d1a`、`ownershipState=released`、`releaseState=released`，终端 `term_c1c69ab5-3716-48a2-9f7c-c637d5e47972`。retained 行没有活动资源。协调者将在本 Dispatch done 之后 release，并再读 reclaimable。本记录不代替那次读取。

## 6. S4 / S5 / S6 勘误

旧控制文件不改。以下按 S6 的 `v4-proof-checkpoint.md`、`v4-proof-checks.log` 和本次只读 stat。

1. 执行者：S4 的 `resume-2026-10-16.md` 把 `task_c013cf04e3af` 写成 cursor。`enriched-v3-checkpoint.md` 第 2.1 节记下的是 Antigravity，Dispatch `ctx_6120796fb86d`，终端 `term_55c9a0fd-dd26-4aa2-9482-d1bbdc30e8bb`。当前 worker-list 里该 Dispatch 已 released，终端句柄相同。本次没有重读当时的 `agy` 进程。
2. 哈希：`401cad…` 是标记字符串的 SHA-256，不是身份文件 SHA-256。文件哈希是 `d8022e…`。本次只读复验相符。S5 控制正文里出现过标记 ID；本报告不抄写它，也不把旧 control 算进公开扫描。
3. 时间：S4 页记录时间是 `2026-10-16T07:25:00+08:00`。本次 `stat` 与 S6 日志一致：目录 `content/en/versions/draft-v3-intermediate` 的 birth、mtime、ctime 都是 `2026-10-16T07:24:28+0800`；其中 `draft-v3.md` 的 birth 与 mtime 是 `2026-10-16T07:20:25+0800`，ctime 是 `2026-10-16T07:24:28+0800`。目录 birth 早于 S4 页时钟。相对 S4“后来才归档”没有依据。birth 与 ctime 是两种文件系统读数，不用它们编写创作时间。
4. 职责：SEO 由 F 创作、E 复核。中文由独立 T 翻译、E 复核。不写成 G、协调者或 C-zh。
5. VP8：S5 写的“无损 VP8 块检测”不成立。本次 6 个 WebP 只有有损 `VP8 ` 块。字节块不是可见像素 OCR。
6. SQLite：`v4-proof-checks.log` 第 2 行写明，在 `msg_5f7e33be453d` 之前发生过一次只读 `SELECT`，读到 `msg_a968dbfe2966` 的 `created_at` `2026-10-16 00:23:00`，之后未再查内部库。不能写成从未查询。该笔记没有数据库写入证据；本记录只说没有看到写入实施，不推断其他范围。本次 S 没有打开内部 SQLite。
7. S5 页眉 `2026-10-16T08:18:00+08:00` 与文件 mtime `2026-10-16T08:23:34+0800` 不是同一次时钟。S6 把 state asOf 与 finishedAt 分开为 `2026-10-16T08:58:17+08:00`，不回填。

## 7. 未完成

用户终审仍是待审。没有 commit、push、deploy。历史 8 项接口失败和全量 12 项失败仍在。标题过程 FAIL 3+1 仍在。译文 v1 FAIL 5 仍在。精确扫描 0 命中不把这些写成全流程通过。
