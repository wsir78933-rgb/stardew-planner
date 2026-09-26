# V 最终独立交付与合同验收

日期：2026-09-26（Asia/Shanghai）  
关键词：`stardew valley speed gro`；站点：`https://stardewvalleyplanner.art`；范围：中英文 `content-only`。  
角色：V；只读验收，唯一新增验证脚本为 `reviews/final-verification-evidence/verify-v.mjs`。

## 结论

限定在已冻结的 content-only 交付范围内，V **PASS**。独立验证脚本读取并检查了当前 `final/en|zh` 的 body、SEO、公开引用、最终 handoff、provisional 历史索引、源/最终 SVG、最新 D/E/E-SEO/媒体报告和 `Ffreeze`；35 项检查全部通过，脚本退出码为 `0`。

这不是网站成品、用户终审、部署或全部 V7 环境门的通过声明。页面装配未执行，用户终审待审，未提交/推送/部署；真实地区 SERP 与底层 OS/权限隔离仍为 `UNVERIFIED`。

## 独立计数与关键断言

计数脚本是 `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`。实际重跑结果如下；合格计数由同一 V 脚本按指定口径独立重算。

| 语言 | V7 原始计数 | 额外排除 | V 合格计数 | 2000 门 |
|---|---:|---|---:|---|
| English | 2391 | 去除 2 个完整 HTML `<figure>`（alt/caption 一并去除） | **2283** | PASS |
| 中文 | 2812 | 去除 `参考来源` 后 2728；再去除 3 行图注；Markdown alt 不计 | **2588** | PASS |

实际独立合同结果：

- 英文正文 `bodyHash=9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46`，中文正文 `bodyHash=a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2`；均为程序对实际文件字节计算的 64 位小写 SHA-256。
- `drafts/body-*` 与对应 `final/*/body.md` 的 2 个 `cmp` 均为 `0`；5 张源 SVG 与 `final/assets` 副本的 5 个 `cmp` 均为 `0`。
- UTF-8、NFC、LF、末尾 LF 和 `bodyByteLength` 均通过；handoff 的 `body` 是实际 Markdown 字符串，不是路径/hash 对象。
- 英文 13 个公开来源、17 个 quote binding 全部存在且 occurrence 合法；中文 17 个公开来源、18 个 quote binding 全部存在且 occurrence 合法。两份 refs 的 `bodyHash`、handoff 的 `bodyHash` 与实际正文一致，handoff 的 `publicReferences` 与 refs 数组逐项相等。
- 正文图片相对路径均从 `final/en|zh` 解析到 `../assets/en|zh/...` 的真实文件；英文 2 张、中文 3 张媒体的 manifest、body、handoff、源 SVG、最终副本、尺寸和 SHA-256 全部对齐。
- 英文两条 `caption` 与正文 `<figcaption>` 内容逐字相等并保留原来源链接。中文三行图注与正文图注文字相等；中文正文图注原文没有 URL，来源位于相邻正文与 `publicReferences`，按已确认边界不强行改 body，也不误报缺陷。
- 英文 integrity 以 `SHA-256`/`canonical-json-v1` 重算，声明摘要 `4945e0b078399584011a8442568e325de125a742d87237c4f8e3ccaa699c63b5` 与重算相等；中文声明摘要 `639a248585f22b1a6e6a880a5af1ebdd70613f67f8fac34147e6b22d68a18ee0` 与重算相等。两者均覆盖除 `integrity` 外的完整顶层公开字段，并单独绑定媒体 hash。
- 两份公开 handoff 的敏感扫描均为数量 `0`：绝对私有路径、内部文件路径、编排/污染残留、凭据标记；`AssemblyManifest` 命中为 `0`。敏感扫描只记录数量，不打印任何命中值。

## 最新交接与独立角色回读

V 实际读取的最新交接材料及结果：

| 文件 | V 回读结果 |
|---|---|
| `reviews/D-en-r1.md` | PASS，绑定当前英文 body hash；未以旧 D 代替 |
| `reviews/E-en-r1.md` | PASS，绑定当前英文 body hash；旧 Parsnip `3/3/2` 已按当前 E-en-r1 的实际复算更正为 `3/2/2`，不是正文错误 |
| `reviews/E-SEO-en-r1.md` | PASS，17 个英文引用定位 |
| `reviews/D-zh-r2.md` | PASS，绑定当前中文 body hash |
| `reviews/E-zh-r2.md` | PASS，绑定当前中文 body hash |
| `reviews/E-SEO-zh.md` | PASS，18 个中文引用定位 |
| `reviews/media-en-r1.md` | PASS 的英文媒体渲染/意义报告，V 只核对报告与当前字节绑定 |
| `reviews/media-en-r1-binding.md` | 版本绑定补充：7 项匹配、1 项旧报告 63 位抄录错误、0 项实质 mismatch；当前 manifest hash 使用实际 64 位值 |
| `reviews/media-zh-r1.md` | PASS 的中文媒体渲染/意义报告，V 只核对报告与当前字节绑定 |
| `editorial/freeze.md` | 中英文 content-only 技术冻结记录；页面、用户终审、部署均明确未执行 |

旧 `E-en.md`、旧 `E-SEO-en.md`、旧失败/退役任务均未作为当前通过依据。旧失败任务是 superseded 元数据，不是当前内容失败；`provisional` 文件保留为历史索引，当前 final body/SEO/引用未被其替代。

### R 记录边界

`research/reproducibility/replay.mjs` 仅做语法和命令/字段完整性检查，V 没有无故重新联网搜索；`node --check` 和字段探针均退出 `0`。脚本保留 `setlang`/`cc` 只是请求参数的地区边界说明，不能证明物理 US/CN 位置或个性化 SERP。

R/研究记录中把 `git config --get user.email` 作为“协调者邮箱”读取的记录属于**非内容记录错误**：Git 邮箱配置不是 Orca orchestration 消息队列，也不构成来源、交接或独立性证据。V 曾在历史记录检索中误展开该字段，随后停止；本报告及公开扫描不重复该值，这属于过程偏差，不作公开交付污染结论。V 使用真实的 `orca orchestration check`、Run/Task/worker 回执核对消息；RI-01 另指出旧研究命令表含说明性占位符，因此不能据此声称所有旧日志均可逐字重跑。

## Run、Task、worker 与来源独立性

实际只读命令均返回 `0`：

```sh
orca orchestration run-show --id run_fd109729e262 --json
orca orchestration task-list --run run_fd109729e262 --json
orca orchestration worker-list --run run_fd109729e262 --include-remote --limit 100 --json
orca orchestration dispatch-show --task task_fb7ee529944d --json
```

真实回读结果：Run 目标为双语 `content-only`，当前 V task 为 `task_fb7ee529944d`，当前 dispatch 仍是本 V；task 列表共 45 条，当前 V 为 `dispatched`，前序最新 D/E/E-SEO/M/F 任务均有真实 `completedBy` terminal handle 与 `succeeded` 回执。不同角色使用不同实际终端标识；V 未读取私有会话文件，也未把角色标签当作独立性证明。worker 列表共 37 条资源观察：`active=1`（当前 V）、`retained=3`（历史元数据）、`released=33`；retained 记录不被解释为活跃终端。已退役旧 V 为 exited 元数据，当前 V 的实际资源状态以本次 worker 列表为准。

`orca orchestration check --terminal term_8eaa26d6-4b0b-4a72-9766-3a0bbb34c9b7 --json` 首次读到 1 条 Delivery，随后使用同一 deliveryId `--ack` 确认；再次检查得到 `messages=[]`、`count=0`。没有把 Git 邮箱读取当作消息，也没有读取协调者终端或拼接终端 ID。

## 实际命令、退出码与关键输出

以下命令在工作树 `/Users/wusir/orca/workspaces/stardew planner/博客-2` 执行；V 脚本的相对短路径均相对于 `docs/blog-ops/stardew-valley-speed-gro/`。

| 实际命令/动作 | 退出码 | 真实关键结果 |
|---|---:|---|
| `sed` 读取 `执行入口.md`、`01-统一工作流.md`、`参考规则/事实核验与公开引用.md`、`ego-browser/SKILL.md` | 0 | 工作流、引用边界和本地浏览器规则已读取；本轮未创建浏览器 TaskSpace |
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/en/body.md' --locale en` | 0 | `mechanical_units=2391`；raw/NFC-LF hash 相同 |
| `python3 '/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py' '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/final/zh/body.md' --locale zh-CN` | 0 | `mechanical_units=2812`；raw/NFC-LF hash 相同 |
| 同一中文绝对路径增加 `--exclude-heading '参考来源'` | 0 | `mechanical_units=2728` |
| `node --check '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/research/reproducibility/replay.mjs'` | 0 | replay 语法通过；没有联网重跑 |
| replay 字段探针（`SOURCE_URLS`、页面读取、错误状态、`taskSpace.finish`、地区边界、退出字段） | 0 | 10 个必需字段全存在；`network=not-run` |
| `node --check '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/final-verification-evidence/verify-v.mjs'` | 0 | V 验证脚本语法通过 |
| `node '/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/final-verification-evidence/verify-v.mjs'` | **0** | `checks.total=35`、`passed=35`、`failed=0`；EN 2283、ZH 2588；quote 17/18；assets 2/3 |
| 7 个 `cmp -s`：2 个 body、5 个 source/final SVG | 0（7 次） | 全部字节相等 |
| `xmllint --noout` 读取 5 张 `final/assets` SVG | 0 | 5 张 SVG XML 合法 |
| `file` 读取 5 张 `final/assets` SVG | 0 | 5 张均为 `SVG Scalable Vector Graphics image` |
| `git diff --check b98edcffe2009d7331d406380a97e54f8e620e7a -- 'docs/blog-ops/stardew-valley-speed-gro'` | 0 | tracked diff 无 whitespace 错误；此命令不覆盖 untracked 文件，V 脚本已实际读取新增文件 |
| `git rev-parse HEAD` 与 `git cat-file -t b98edcffe2009d7331d406380a97e54f8e620e7a` | 0 | HEAD 为 base `b98edcffe2009d7331d406380a97e54f8e620e7a`，base 类型为 `commit` |
| `git status --short`、`git ls-files --others --exclude-standard` | 0 | 仅有本任务 package 目录未跟踪；该目录共 88 个新增文件，V 自己新增文件见下表 |
| `shasum -a 256` 读取当前 final body/SEO/refs/handoff 与 V 脚本 | 0 | 哈希见下表，均由实际字节直接计算 |

## 当前实际 SHA-256

| 文件（相对本任务目录） | SHA-256 |
|---|---|
| `final/en/body.md` | `9c4c78a1f27e217a3eaa51ce3164e57021fe90d88187f0e298746d4678bbea46` |
| `final/en/seo.json` | `6955679ad6cc459203ff1528f9da2659cd7d500840e754487ebffa069036d155` |
| `final/en/public-references.json` | `a27ce6e6a006fb2f56cab062a60774e5396aa74d72206343331a6aee3c776de5` |
| `final/en/handoff.json` | `b9616a33ced3fb582dee1a7ca55375c6e394cdcd6d442b0ab806a39b39aa0a5d` |
| `final/zh/body.md` | `a19d3a55d114238f8b05811b35f7267ff3d66dbc79c1900f35361c03b628c6a2` |
| `final/zh/seo.json` | `ac9cd98e6ab6fd1a7c51fa41f77c438cd21b3ef5ae2bec22123b3da7a21b13a2` |
| `final/zh/public-references.json` | `f66c3471e57515c4ee804a111ab722dec4d27b2b45530278f4261ca2d713c2da` |
| `final/zh/handoff.json` | `7f0a2a75d6b9c13fe676057c81088883669a127ac6bf950d78573586e48eff61` |
| `reviews/final-verification-evidence/verify-v.mjs` | `092a8703d149100939f9a7359caece146f12eee6b8ed251febfb769b15ae8b00` |

媒体实际 hash（由 V 脚本和 `shasum` 直接计算）：

| 语言 | 资产 | SHA-256 |
|---|---|---|
| en | `final/assets/en/speed-gro-melon-stage-days.svg` | `66e1cf675545b74420fd54f95539c3ec54ce24cfeb131d31dc8e1545970f5264` |
| en | `final/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `c862a3f2369738358be8ab1bc454ac3dfccb948bbbceb8fd5828b14184d907e5` |
| zh | `final/assets/zh/speed-gro-application-flow.svg` | `6d5fa22d759d3c41d2826d9d8913723652814dc451c14e56874cef615560f26d` |
| zh | `final/assets/zh/speed-gro-stage-comparison.svg` | `da62e47615c20bec6142ea874d7a0f080d10d91b2b6d265e68ff88afcda737cb` |
| zh | `final/assets/zh/strawberry-harvest-timeline.svg` | `43c922bff97f2d5b6a84e105395d81366ef89a9eed94d9117fba869cea6605da` |

## 实际公开来源 URL

以下 URL 均由当前 `final/*/handoff.json` 的 `publicReferences` 实际读取；不是旧研究日志的路径对象。

### English（13）

- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley/Crop.cs#L403-L411
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Strawberry?oldid=192732

### 中文（17）

- https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://store.steampowered.com/news/app/413150/view/517448731263500640?l=english
- https://www.stardewvalley.net/1-6-15-1-patch-for-xbox-playstation/
- https://xinglugu.huijiwiki.com/wiki/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0
- https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377
- https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99
- https://stardewvalleywiki.com/Speed-Gro?oldid=190630
- https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196
- https://stardewvalleywiki.com/Fertilizer?oldid=194274
- https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629
- https://stardewvalleywiki.com/Parsnip?oldid=191123
- https://stardewvalleywiki.com/Melon?oldid=193510
- https://stardewvalleywiki.com/Farming?oldid=191914
- https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93
- https://stardewvalleywiki.com/Coffee_Bean?oldid=193175
- https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875

## 范围外与状态边界

- 内容语义审查：V 未代替 D/E；当前依据为最新 `D-en-r1`、`E-en-r1`、`D-zh-r2`、`E-zh-r2` 的独立 PASS 回执和当前 hash 合同。
- SEO/题文审查：V 未代替 E-SEO；当前依据为 `E-SEO-en-r1`、`E-SEO-zh` 的独立 PASS 回执和当前 handoff SEO 对齐。
- 实际图形审查：V 未重新截图或目视审查；当前依据为 `media-en-r1`、`media-en-r1-binding`、`media-zh-r1` 的既有真实渲染报告，并独立复核最终 SVG 字节、XML、路径、尺寸、caption/alt 与 hash。
- 页面装配和页面浏览器 QA：**未执行**，因为范围是 `content-only`；没有运行网站 build/test，也没有执行页面路由验证。
- 用户终审：**待审**；不能写成用户通过。
- 提交、推送、部署、外部写入、依赖安装、密钥处理：**未执行**。
- 精确物理地区 SERP、底层 OS 权限隔离：**UNVERIFIED**；不把 `setlang`/`cc`、提示词或历史记录升级为物理地区/底层隔离证明。
- 不声称所有旧日志可复现；RI-01 的说明性占位命令仍是可复现性缺口。`research/reproducibility/replay.mjs` 只完成本轮语法和字段完整性检查。

## V 自己新增文件

- `reviews/final-verification.md`
- `reviews/final-verification-evidence/verify-v.mjs`

未修改正文、SEO、引用、handoff、provisional、media manifest、SVG、网站 `src/public/package`、AGENTS、WORKLOG、研究和旧报告；未新增演示网站、无关测试或外部状态。
