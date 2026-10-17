# House Upgrade Stardew - 内部授权、工作树与隔离治理记录

- **Run ID**: `run_8253831e93d6`
- **主题 Slug**: `house-upgrade-stardew`
- **原始搜索关键词**: `house upgrade stardew`
- **记录角色**: `S3`（内部调度/候选保全记录；不是 A–F/T/G；不写正文、不审稿）
- **本页更新时间**: 2026-10-15T23:28:30+08:00
- **前序记录**: S1 初始快照仍在 `verification-report.json`（禁止改动）；S2 快照仍在 `phase-2-records.json` 与 `raw-orca-state.json`；本轮 S3 记录新增 `phase-3-records.json`、`raw-phase-3-orca-state.json` 与 `candidate-checks.log`。

## 1. 用户授权、工作树范围与长度决策状态

### 1.1 授权指令与范围
- **授权含义**: 用户“A开始执行”指选项 A / `project-write`。它不是仅授权研究角色 A。
- **唯一制作工作树**: `博客 2`（分支 `博客-2`，路径 `/Users/wusir/orca/workspaces/stardew planner/博客-2`）。
- **禁止写入区域**: 主工作区（`/Users/wusir/Desktop/开发项目集合/stardew planner`）与已有“博客”工作树（`/Users/wusir/Desktop/开发项目集合/stardew planner-worktrees/博客`）。
- **工具约束**: 仅 Cursor 与 Antigravity。禁止再派子 worker 或内置子代理。
- **不可逆操作**: 仍禁止 commit、merge、push、deploy、安装依赖、数据库或外部服务写入、修改 Hermes 源码或用户规则。

### 1.2 异步单选长度决策状态
- **用户单选提问**: A（允许本篇按实际篇幅继续）/ B（保留 V7 长度门停止）。
- **当前答复状态**: 尚未收到答复。不能将预选 A 或时间经过视为授权。
- **调度链状态**: **等待用户选择长度约束，后续链未启动**。

### 1.3 已观测的目录事实与隔离边界
- 工作树 inode `145851019`，主项目 inode `65977012`，已有博客工作树 inode `144267400`。
- 观测时 UID `501`、GID `20`。设备号均为 `16777232`。
- `node_modules` 保持为 G 授权建立的指向主项目的软链接，不安装依赖。
- **隔离结论**: 仅证明已观测到的身份与目录节点事实，结论保持“**逻辑隔离，未验证底层权限**”。本次没有配置底层权限或容器。
- **主工作区保护结论**: 仅报告能被真实证据支持的事实（工作树独立路径、无写入），不凭现在 status 推断历史未变。

## 2. 回读到的任务、Dispatch 与释放状态

来源是本 Run (`run_8253831e93d6`) 限定的 `task-list --brief`、`worker-list --include-remote` 和逐个 `worker-show`。不补造 ID。

| 角色 | Orca 任务标题 | Task ID | 结算所用 Dispatch | 终端 Handle | Agent | 任务状态 / 终端状态 | 依赖 |
|---|---|---|---|---|---|---|---|
| A | A｜农舍升级研究与搜索证据 | `task_9ee9836cf39f` | `ctx_01802221fb7b` | `term_82d58d3a-f95e-4c19-a590-118df3d97216` | `cursor` | completed / released | 无 |
| G | G｜网站接口、隔离与验证基线 | `task_aab2039ba9ff` | `ctx_a79d4234407a` | `term_20959df8-6e87-46d5-8535-2f47ebe6972c` | `cursor` | completed / released | 无 |
| M | M｜农舍视觉素材与授权核验 | `task_3a79aaae4149` | `ctx_2d2fa1bb6b61` | `term_eeedce69-a29d-4918-8800-c3c22e538417` | `antigravity` | completed / released | 无 |
| S | S｜V7 调度与污染隔离记录 | `task_d0e8389f037f` | `ctx_72a70c9fac6f` | `term_540f4ad4-6a25-4782-9104-57e3f3778374` | `antigravity` | completed / released | 无 |
| B | B｜唯一主意图与图文布局 | `task_6104f4016cd1` | `ctx_a941085c84e5` | `term_656ec1a7-67a3-487b-8845-3c9b8f3c55ed` | `cursor` | completed / released | task_9ee9836cf39f, task_3a79aaae4149, task_aab2039ba9ff |
| C | C｜英文图文正文写作 | `task_fc17d883efc8` | `ctx_fe298bb5ff1a` | `term_8991e7da-dd73-4e7e-b41c-b03340ece350` | `cursor` | completed / released | task_6104f4016cd1 |
| M2 | M2｜纠正媒体证据断言 | `task_c14add3a3526` | `ctx_e8d08a993bdb` | `term_e4f87345-3742-4410-9591-b44b00898559` | `cursor` | completed / released | task_3a79aaae4149 |
| D | D｜英文写后三门独立检查 | `task_e07302bdea43` | `ctx_1fa278b7ca02` | `term_e0751eb6-fe65-40a6-af6d-4b14acefa5cd` | `antigravity` | completed / released | task_fc17d883efc8 |
| E | E｜英文鉴文与事实引用独立审核 | `task_1287ac59ca63` | 无 | 无 | 无 | blocked / not_dispatched | task_e07302bdea43 (阻塞于 gate_ac67dcb7fc37) |
| M3 | M3｜英文封面与正文自绘图解 | `task_6ad859edf119` | `ctx_58ccd56dab47` | `term_5a5eb331-703b-46a6-b4c4-c89b8ad70ecd` | `antigravity` | completed / released | task_fc17d883efc8 |
| F | F｜英文计数锁稿与七罪标题候选 | `task_7f60bf2cf348` | 无 | 无 | 无 | pending / not_dispatched | task_1287ac59ca63 |
| S2 | S2｜候选版本与调度证据同步 | `task_791711df127d` | `ctx_226e8208bfeb` | `term_acae2fb6-8876-40c9-9455-aa7f455b22dd` | `cursor` | completed / released | task_d0e8389f037f, task_fc17d883efc8 |
| C2 | C｜第1轮英文返修 | `task_836071267139` | `ctx_2532ccdb6e55` | `term_09895b76-9443-4bca-a1c4-5c78c6304670` | `cursor` | completed / released | task_fc17d883efc8, task_e07302bdea43 |
| D2 | D｜第1轮稿全量三门复验 | `task_dca8de3c3153` | `ctx_550db8b749c7` | `term_11c655b7-18ca-4879-8731-533de96db588` | `antigravity` | completed / released | task_836071267139 |
| B2 | B｜篇幅不足的任务覆盖核对 | `task_15c45f4f2bee` | `ctx_55c175d624a3` | `term_15aa6dd6-7b61-4cd1-96f7-6b1207a4d861` | `cursor` | completed / released | task_836071267139 |
| S3 | S3｜长度阻塞与候选保全记录 | `task_b305a2bcdd85` | `ctx_8ac36da5b10c` | `term_0a4f0896-fe8e-4f9e-9428-3c63cab0c979` | `antigravity` | dispatched / active | task_dca8de3c3153, task_15c45f4f2bee |
| D3 | D｜重复判断冲突的独立复核 | `task_ab0f949dd682` | `ctx_efb0d7481e76` | `term_1ba3e93d-9d07-4782-b086-579219ed4366` | `cursor` | dispatched / active | task_dca8de3c3153, task_15c45f4f2bee |
| T | 无本 Run 任务 | 无 | 无 | 无 | 无 | 未创建 | 无 |

### 2.1 任务生命周期与语义结果分离记录
- **C2 任务** (`task_836071267139` / `ctx_2532ccdb6e55`): 已结算并释放，产出 `draft-v2`。
- **B2 任务** (`task_15c45f4f2bee` / `ctx_55c175d624a3`): 已结算并释放，诊断结论：“没有可据实补入的必要内容；材料不足，停止正式交付”。
- **D2 任务** (`task_dca8de3c3153` / `ctx_550db8b749c7`): 生命周期为 succeeded，终端已释放。但其实际语义结果与生命周期分开：其报告虽声称 PASS，但协调者回读发现证据冲突（v2 第 19 行等三句新旧价格并列在 B2 诊断中属于重复，D2 未解释同段三句独立作用即签通过），因此已派发 D3 (`task_ab0f949dd682` / `ctx_efb0d7481e76`) 进行重复冲突复核。**D2 task lifecycle succeeded != 内容通过**。
- **E 门状态**: `gate_ac67dcb7fc37` 仍为 `pending`。
- **下游阶段**: F/T/G 装配、网页接入、E 页面审核、用户终审与生产发布均未启动/未完成，**不能签发整体 PASS**。

## 3. 候选版本、门禁与修订预算

### 3.1 候选提交数据回读
- **正文版本**: `draft-v2`。SHA-256: `09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f`。
- **媒体文字版本**: `media-text.en.json`。SHA-256: `55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c`。
- **归档 v1 媒体文字**: `content/en/versions/draft-v1/media-text.en.json`。SHA-256: `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415`。
- **图解文字逐字对比**: 对比 `figures` 数组，语义与字面逐字**完全一致** (`True`)。区别仅在于 `bodySha256` 绑定了新的 draft-v2 SHA。
- **M3 候选资产绑定区别**: M3 英文 3 图（`provenance.json`）在制作时输入绑定的正文为 `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628` (draft-v1)，媒体 JSON 为 `95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415`。新 body SHA (`09a4609e...`) 与新 media SHA (`55c74ccd...`) 与旧制作输入 SHA 存在差异；未经过最终图文与页面认可，**不能写最终发布资产 PASS**。
- **机械篇幅与长度门**:
  - 作者机械预览字数: 970
  - 排除两段图注段落（行 15 与行 49）: 917
  - V7 正文门槛底线: 1000
  - 判定类别: `below_floor`
  - 正式长度门: 未通过（无正式 F 长度结算）
  - B 覆盖诊断结论: 既定任务已覆盖、没有可据实补入的必要内容；材料不足，停止正式交付。

### 3.2 修订预算
- 总预算保持 3，初始 0。
- 正式文稿返修已用 1（C 对 draft-v1 的修订），剩余 2。
- 预算未重置、未改变。不能因更换任务或分发新 Dispatch 重置预算。

## 4. 初始化快照与历史保全

- `verification-report.json`（SHA-256: `a828f431fa7f4cacf77079c490fba7c494f30551c7af94722db791abdc3ba990`）为 S1 初始快照，原文件保持完整未改。
- `phase-2-records.json` 与 `raw-orca-state.json` 为 S2 历史快照，禁止改动。
- 本轮 S3 记录写入 `phase-3-records.json`、`raw-phase-3-orca-state.json` 与 `candidate-checks.log`。

## 5. Canary 治理与扫描检测

- **Canary 标识**: `canary_house_upgrade_c93c91c4f505`。
- **Canary 文件 SHA-256**: `401cad403b3b56138aee2a8cde4c2099a87c2c780f178ff05cc664816d6efac1`。
- **精确扫描范围与结果**:
  - `content/en/draft-v2.md`: 命中数 0
  - `content/en/media-text.en.json`: 命中数 0
  - `content/en/public-references.en.json`: 命中数 0
  - `media-production/en/cover-payments.svg`: 命中数 0
  - `media-production/en/tier-rooms.svg`: 命中数 0
  - `media-production/en/upgrade-or-renovation.svg`: 命中数 0
- **明文规则**: Canary 密钥明文禁止打印或输出，仅在控制上下文内存读取。
- **推论边界**: 精确未命中不等于语义检查通过或 OS 隔离 PASS；同 UID/inode 仍只代表“逻辑隔离，未验证底层权限”。
- **未执行模块标记**: SEO / 中文翻译 / 页面装配未生成，明确标记为 `not-run`，不得标记为扫描通过。

## 6. 基线保留

- `typecheck`: 0
- 默认 Turbopack build: 1（因工作树外部 symlink 被 Turbopack 拒绝）
- `webpack build`: 0
- 测试套件: 237 通过 / 8 失败
- 说明: 此为内容前预检基线，保留早先数据，未重跑产品测试或构建。
