# house-upgrade-stardew FAQ 独立复核验收报告 (QA Report)

- **复核执行者**: Antigravity (独立质检复核，非实现者自审)
- **验收时间**: 2026-10-17
- **验收结论**: **PASS (FAQ内容与交互验收通过)**
- **工作树唯一边界**: `/Users/wusir/orca/workspaces/stardew planner/博客-2`
- **QA 产物目录**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/`

---

## 1. 验收总览

| 检查大类 | 检查项 | 真实数据 / 退出码 | 结论 |
| --- | --- | --- | --- |
| 源码与 Diff 审计 | 英文文章改动 | 0 行删除，+60 行新增，仅新增 FAQ import 与 Section | **PASS** |
| 源码与 Diff 审计 | 中文文章改动 | 0 行删除，+53 行新增，仅新增 FAQ import 与 Section | **PASS** |
| 源码与 Diff 审计 | 正文/图片/SEO/Schema | 零改动、零删除，未改动图片、alt、caption、SEO 及 Article Schema | **PASS** |
| 源码文件校验 | 英文文件 SHA-256 | `b63c882c487c038249659c14b30fffea7ed5bebf6145d3d4d97412fd1dcefb94` (17,725 字节) | **PASS** |
| 源码文件校验 | 中文文件 SHA-256 | `1d3217ac64cbcbfe1dba7a5c878accb6f36a1b42b4fa4889bded3382ad0544dd` (15,867 字节) | **PASS** |
| 环境配置校验 | `next-env.d.ts` SHA-256 | `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc` (296 字节，完全恢复 baseline) | **PASS** |
| 事实与双语对齐 | 6 项问答双语对齐 | 英文 6 问答与中文 6 问答语义逐项对应 | **PASS** |
| 事实与双语对齐 | 事实核查证据核验 | 逐项核对 `facts/report.md` 6 项事实依据 (费用/天数/硬木/地窖/占地/装修) | **PASS** |
| 组件与样式规范 | 对齐木匠页 FAQ | 完全复用 `BlogFaqList` 组件 (`collapsible type="single"`) 与 `app/globals.css` 既有样式 | **PASS** |
| 原始构建日志 | Typecheck 日志 | `logs/typecheck.log`: exit code 0 (`tsc --noEmit` 无报错) | **PASS** |
| 原始构建日志 | Vitest 专项测试 | `logs/vitest.log`: exit code 0 (4 文件通过，43 测试通过) | **PASS** |
| 原始构建日志 | Build 原始日志 | `logs/build.log`: exit code 0 (Next.js 16.3.0 webpack，68/68 静态页生成) | **PASS** |
| 静态服务状态 | 3010 端口服务 | 进程 PID 21887，CWD 为当前 worktree，服务 `out` 目录，curl 两 URL 均 200 | **PASS** |
| 真实浏览器 QA | 桌面英文视图 (1280x800) | 1 个 H2、6 个 Trigger、6 个 Answer，6 项逐项展开/收起/单项展开/键盘触发均通过 | **PASS** |
| 真实浏览器 QA | 桌面中文视图 (1280x800) | 1 个 H2、6 个 Trigger、6 个 Answer，6 项逐项展开/收起/单项展开均通过 | **PASS** |
| 真实浏览器 QA | 手机英文视图 (390x844) | 无水平溢出 (scrollWidth=390)，首项展开收起通过 | **PASS** |
| 真实浏览器 QA | 手机中文视图 (390x844) | 无水平溢出 (scrollWidth=390)，首项展开收起通过 | **PASS** |
| 外部插件审计 | “导出外链”浮窗按钮 | 准确定位为 Chrome 扩展 `Auto Register Filler` 注入，非页面源码产物 | **区分通过** |

---

## 2. 详细证据

### 2.1 源码 Diff 与 SHA 校验
通过 `diff -u` 比对 `docs/blog-ops/house-upgrade-stardew/faq-addition/baseline/*.txt` 与当前工作树源码（明细留存见 `scope-check.log`）：
- 英文文件 (`src/blog/articles/house-upgrade-stardew.en.tsx`):
  - SHA-256: `b63c882c487c038249659c14b30fffea7ed5bebf6145d3d4d97412fd1dcefb94`
  - 增加行: 60, 删除行: 0。仅在头部导入 `BlogFaqList` 并在 `HouseUpgradeStardewEnglishSources` 前插入 `HouseUpgradeStardewEnglishFaqSection`。
- 中文文件 (`src/blog/articles/house-upgrade-stardew.zh.tsx`):
  - SHA-256: `1d3217ac64cbcbfe1dba7a5c878accb6f36a1b42b4fa4889bded3382ad0544dd`
  - 增加行: 53, 删除行: 0。仅在头部导入 `BlogFaqList` 并在 `BlogSources` 前插入 `<h2>星露谷房屋升级常见问题</h2>` 与 `<BlogFaqList items={[...]} />`。
- 类型定义 (`next-env.d.ts`):
  - SHA-256: `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，与任务前备份字节完全一致，`cmp` 对比 0 差异。

### 2.2 6 项 FAQ 事实与双语核查

| 序号 | 英文问题 / 答案 | 中文问题 / 答案 | 事实核查证据 (`facts/report.md`) |
| --- | --- | --- | --- |
| 1 | **What does each farmhouse upgrade cost?**<br>The first upgrade is 10,000g and 450 Wood. The second is 65,000g and 100 Hardwood, the 1.6 price. The third is 100,000g. | **每一档农舍升级要多少金币和材料？**<br>第一次升级是10,000金和450木材。第二次是65,000金和100硬木，这是1.6的价格。第三次是100,000金。 | **PASS**: Wiki Farmhouse & Carpenter's Shop 升级费用表一致；1.6 版本升级 2 费用为 65k+100硬木。 |
| 2 | **How long does each house upgrade take?**<br>Each upgrade takes three days. | **每次升级要多久？**<br>每次升级都要三天。 | **PASS**: Wiki 明确 Robin 每次升级需 3 天。 |
| 3 | **How do you get the Hardwood for the second upgrade, and does Robin sell it?**<br>Robin's ordinary stock does not sell Hardwood. Six Large Stumps in the Secret Woods regrow daily. A Steel Axe clears the log at the entrance. | **第二次升级的硬木怎么获得？罗宾出售硬木吗？**<br>罗宾的普通存货不出售硬木。秘密森林里六棵大树桩每天重新长出。入口那根圆木要用钢斧头清除。 | **PASS**: 罗宾普通存货不出售硬木；秘密森林入口大圆木需钢斧（一次性8硬木），内部6大树桩每天刷新（12硬木/天）。 |
| 4 | **Which upgrade unlocks the cellar?**<br>The third upgrade adds a cellar under the house. Enter it from the kitchen. The cellar starts with 33 casks. | **哪一档升级解锁地窖？**<br>第三次升级在房子下面加上地窖。从厨房进去。地窖一开始有33个木桶。 | **PASS**: 第三档升级增加地窖，由厨房进入，附带 33 木桶。 |
| 5 | **Does a house upgrade increase the outdoor footprint?**<br>The outdoor footprint stays 9×5, so the tiles beside the house stay as they are. After the third upgrade, the outside of the house stays the same as the previous upgrade. | **升级会增加室外占地吗？**<br>室外占地保持9×5，所以房子旁边的地块还是原来那样。第三次升级后，房子外面和上一次升级时一样。 | **PASS**: 农舍室外占地始终为 9×5，升级不扩大外部占地，不影响相邻地块；第三档外观与第二档完全相同。 |
| 6 | **How is a renovation different from an upgrade?**<br>Each upgrade takes three days. After the second upgrade, a renovation finishes immediately. Remove Crib and Add Dining Room are examples. | **装修和升级有什么区别？**<br>每次升级都要三天。第二次升级之后可以做装修，而且马上完成。例如移除婴儿床，或增加餐厅这间房间。 | **PASS**: 装修在第二档升级后解锁，即时完成（0工期），可随时撤销退款；升级需3天工期。 |

### 2.3 真实测试与构建日志审查
直接查验原始日志文件与退出码：
- `docs/blog-ops/house-upgrade-stardew/faq-addition/logs/typecheck.log`: `EXIT:0`
- `docs/blog-ops/house-upgrade-stardew/faq-addition/logs/vitest.log`: `EXIT:0` (`Test Files 4 passed (4)`, `Tests 43 passed (43)`)
- `docs/blog-ops/house-upgrade-stardew/faq-addition/logs/build.log`: `EXIT:0` (`Generating static pages using 11 workers (68/68)`)
- 既有 3010 静态服务: 进程 PID 21887，CWD 为 `/Users/wusir/orca/workspaces/stardew planner/博客-2`，命令为 `serve out -l tcp://127.0.0.1:3010`。
  - `curl -sSI --max-time 10 http://127.0.0.1:3010/house-upgrade-stardew` 返回 `HTTP/1.1 200 OK` (exit code: 0)
  - `curl -sSI --max-time 10 http://127.0.0.1:3010/zh/house-upgrade-stardew` 返回 `HTTP/1.1 200 OK` (exit code: 0)
  - 详细响应头与执行记录见 `http-status.log`。

---

## 3. 本地 ego-browser 独立自动化验收

### 3.1 运行历史与脚本调整
首轮自动化脚本执行时，`page.goto` 等待 `networkidle` 15000ms 超时；此时 `committed=true` 且 `readyState="complete"`。随后调整为 `waitUntil: "load"`，并显式等待 FAQ 节点可见。首轮同名日志被重跑覆盖，原错误由协调者在会话工具输出中读回。最终四个视图的 294 项断言通过，0 项失败。最终浏览器命令退出码未单独落盘，本报告不补造退出码原始文件。

### 3.2 任务空间与数据归档
- **TaskSpace ID**: 205
- **Page Label**: `p1`
- **原始数据存储**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/browser-eval.json`
- **断言总数**: 294 项通过，0 项失败。

### 3.3 四视图详细执行结果

#### 1. 桌面英文视图 (Desktop English, 1280×800)
- **URL**: `http://127.0.0.1:3010/house-upgrade-stardew`
- **标题**: `House Upgrade Stardew: 65,000g and 100 Hardwood for the Second Tier`
- **FAQ H2 计数与内容**: 1 个 `<h2>`，内容为 `Farmhouse Upgrade FAQ`
- **Trigger & Answer 数量**: 6 个 Trigger，6 个 Answer
- **初始状态**: 6 项全部为 `aria-expanded="false"`, `data-state="closed"`, `height=0`
- **逐项交互验证**:
  - Item 0 ~ 5: 逐项点击展开 -> `aria-expanded="true"`, `data-state="open"`, 高度展开 (44.8px ~ 71.2px)
  - **单项展开验证 (Single-Expand)**: 任意一项展开时，其余 5 项均自动保持 `aria-expanded="false"`, `data-state="closed"`, `height=0`
  - 再次点击收起 -> 恢复 `aria-expanded="false"`, `data-state="closed"`, `height=0`
- **键盘操作验证**:
  - 对 Item 0 按 `Enter`: 展开 -> 再次按 `Enter`: 收起
  - 对 Item 0 按 `Space`: 展开 -> 再次按 `Space`: 收起
- **截图路径**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/faq-desktop-en.png` (41,051 字节, 724×429)

#### 2. 桌面中文视图 (Desktop Chinese, 1280×800)
- **URL**: `http://127.0.0.1:3010/zh/house-upgrade-stardew`
- **标题**: `星露谷房屋升级：第二档是65,000金和100硬木`
- **FAQ H2 计数与内容**: 1 个 `<h2>`，内容为 `星露谷房屋升级常见问题`
- **Trigger & Answer 数量**: 6 个 Trigger，6 个 Answer
- **初始状态**: 6 项全部为 `aria-expanded="false"`, `data-state="closed"`, `height=0`
- **逐项交互验证**:
  - Item 0 ~ 5: 逐项点击展开 -> `aria-expanded="true"`, `data-state="open"`, 高度展开 (44.8px ~ 71.2px)
  - **单项展开验证**: 满足 single-expand 互斥逻辑
  - 再次点击收起 -> 恢复 `aria-expanded="false"`, `data-state="closed"`, `height=0`
- **截图路径**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/faq-desktop-zh.png` (41,800 字节, 724×429)

#### 3. 手机英文视图 (Mobile English, 390×844)
- **URL**: `http://127.0.0.1:3010/house-upgrade-stardew`
- **水平溢出检查**: `scrollWidth=390, clientWidth=390`, `hasHorizontalOverflow=false` (无横向溢出)
- **交互验证**: Item 0 点击展开 (`height=97.6px`)，再次点击收起 (`height=0`)
- **截图路径**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/faq-mobile-en.png` (38,569 字节, 378×486)

#### 4. 手机中文视图 (Mobile Chinese, 390×844)
- **URL**: `http://127.0.0.1:3010/zh/house-upgrade-stardew`
- **水平溢出检查**: `scrollWidth=390, clientWidth=390`, `hasHorizontalOverflow=false` (无横向溢出)
- **交互验证**: Item 0 点击展开 (`height=97.6px`)，再次点击收起 (`height=0`)
- **截图路径**: `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/faq-mobile-zh.png` (38,220 字节, 378×443)

### 3.4 外部注入与控制台日志说明
- **外部按钮**: 页面检测到 `<button>导出外链</button>`。CDP 控制台原始事件显示来源为扩展 `chrome-extension://kkeeajobecgijigkobdlokelmolheokc/content.js` (`Auto Register Filler`) 打印的 `[AutoComment] 独立导出外链浮窗按钮已注入`。此为既有外部注入插件行为，非页面本身代码，准确排除在缺陷之外。
- **页面事件**: `browser-eval.json` 保存了 Console/Runtime.consoleAPICalled 事件；未单独保存 Runtime.exceptionThrown 或完整网络失败事件，因此不对零页面异常或全部请求无错作结论。

---

## 4. 产物清单

所有产物均严格收敛在唯一写入边界 `docs/blog-ops/house-upgrade-stardew/faq-addition/qa/` 内：
1. `report.md`: 本质检验收报告。
2. `browser-eval.json`: 浏览器 DOM 抽取、点击交互、键盘触发、CDP 事件及断言统计的完整原始 JSON。
3. `run-qa.mjs`: 执行自动化验收的 Node.js/ego-browser 脚本。
4. `run-qa.stderr.log`: 自动化脚本执行日志与断言通过输出。
5. `faq-desktop-en.png`: 桌面英文 FAQ 区域截图 (724×429)。
6. `faq-desktop-zh.png`: 桌面中文 FAQ 区域截图 (724×429)。
7. `faq-mobile-en.png`: 手机英文 FAQ 区域截图 (378×486)。
8. `faq-mobile-zh.png`: 手机中文 FAQ 区域截图 (378×443)。
9. `http-status.log`: 3010 端口两路由真实 curl -sSI 头信息与退出码日志。
10. `scope-check.log`: 源文件与 next-env.d.ts 的 SHA-256、diff 删除行统计与退出码状态记录。
