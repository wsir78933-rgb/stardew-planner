# Planner 全表面审查结果

**审查已完成，确认 5 项问题；这不是修复完成或整体 PASS。** 本轮由 ego-browser 完成了桌面与手机端实际操作；本文汇总浏览器记录、截图和源码。QA 入口为本地静态预览 http://localhost:3007/#planner；本轮未改产品代码，也未重跑 typecheck、测试或 build。

## 设计语言与审查范围

现有设置面板采用浅色表面、细边框和绿色选中态；头部与工具栏已使用无阴影 token。旧工具栏方案保留各工具颜色，旧 dialog 方案曾排除工具栏、地图选择器和关闭按钮；这些记录解释早期范围，不豁免本次全表面检查。设置按钮的平面规则见 [app/globals.css](../app/globals.css#L5411)，地图与 Inspector 的凸起/内嵌阴影仍在相同样式表中。以下只把按钮/控件本身列为问题，弹窗外壳阴影不计入。

## 已确认的问题

### 1. 工具选中与 hover 反馈不一致（视觉）

- **问题与复现：** 在底部工具栏分别选中 Select、Multi、Fill、Erase、Zoom，并比较按钮悬停与移开状态。Fill 选中为浅绿，悬停变白；Erase 移开时为红色，悬停变白；Select、Multi、Zoom 的记录则保持红色选中反馈。
- **证据：** [浏览器 computed-style 记录](./planner-full-audit.json) 的 toolbarState.selectedToolState；[桌面截图](./planner-full-audit-desktop-baseline.png)。CSS 的通用 hover 与各工具状态规则位于 [app/globals.css:3581–3601](../app/globals.css#L3581)。
- **最窄建议：** 统一这些工具的选中与 hover 优先级；明确 Erase 是否保留危险色，并让它在 hover 时也保持一致的状态反馈。
- **范围 / 置信度：** 仅工具颜色和交互状态，不涉及阴影或几何；实测样式与源码对应，**高**。

### 2. 地图选择器与 Selection Inspector 按钮仍有凸起/内嵌阴影（视觉）

- **问题与复现：** 打开 Map，查看 Farm、Interiors、Exteriors、Community 标签、地图卡片和关闭按钮；放置并选中物品后查看 Selection Inspector 的操作按钮。
- **证据：** [地图分支 computed-style 记录](./planner-full-audit.json) 含各标签和卡片的 boxShadow；[Map Exteriors 截图](./planner-full-audit-map-exteriors.png)；Selection Inspector 五个按钮的实测阴影和 [Torch 选中截图](./planner-full-audit-canvas-selected-torch.png)。关闭按钮在[协调员补充记录](./planner-full-audit-coordinator.json)中也测得同一凸起阴影。源码的 raised 规则覆盖 .editor-modal button、地图标签/卡片和 .selection-inspector button，[app/globals.css:3974–4026](../app/globals.css#L3974)；选中态内嵌阴影见[同文件:4112–4141](../app/globals.css#L4112)。
- **最窄建议：** 将这些按钮状态纳入平面反馈规则；保留弹窗及 Inspector 外壳本身的阴影。
- **范围 / 置信度：** 标签、卡片、关闭按钮与 Inspector 操作按钮都有运行时证据，**高**。

### 3. Multi / Erase 仍显示“Placing / Click to place”（状态文案）

- **问题与复现：** 在 Buildings 选 Junimo Hut，切换 Multi、点空白画布，再切换 Erase。两种工具下仍显示 “Placing Junimo Hut / Click to place · Esc to cancel”。
- **证据：** [完整 DOM 记录](./planner-full-audit.json) 的 findings.toolbar-tool-and-pending-placement-copy 和[复现截图](./planner-full-audit-multi-placing-pill.png)。Multi 空白点击前后 Farm Summary 都为 4 items；没有证据表明该动作放置了物品。源码按当前工具只把 Fill 传作 isFilling，[planner-workspace.tsx:1295–1304](../src/components/planner-workspace.tsx#L1295)，随后在 Placing 与 Filling 文案间二选一，[catalog-placement-controls.tsx:42–48](../src/components/catalog-placement-controls.tsx#L42)。
- **最窄建议：** 让提示文案反映当前工具，或在离开放置工具时清理不再适用的提示；本发现不要求改变 Multi / Erase 的画布行为。
- **范围 / 置信度：** 仅状态文案与当前工具不匹配；DOM、截图和源码一致，**高**。

### 4. Torch 的本地 Fill 入口与能力规则不一致；竞品呈现不同（功能反馈 / 能力边界）

- **本地问题与复现：** 在 Lighting 选 Torch（object:93），点 Fill 后页面显示 “Filling Torch / Drag to fill”；拖动后数量仍为 5，且没有错误提示。源码中该物品的 allowedTools 不含 fill；Fill controller 返回 unsupported-catalog-category，但 UI 中间层没有把该 reason 交给用户。见 [本地 Fill 记录与截图](./planner-full-audit.json)、[catalog-sidebar-reference.ts:266](../src/catalog/catalog-sidebar-reference.ts#L266)、[catalog-schema.ts:177–183](../src/catalog/catalog-schema.ts#L177)、[editor-fill-controller.ts:55–75](../src/editor/editor-fill-controller.ts#L55)、[planner-workspace-editing-controller.ts:631–654](../src/planner/planner-workspace-editing-controller.ts#L631)。
- **受控 Fill 对照：** 在同一 Standard Farm 上，Junimo Hut 单放使数量 4→5，Undo 回到 4；以 (900,600) 到 (972,648) 做 Fill 后数量 4→8，Undo 已启用。[Fill 前截图](./planner-full-audit-controlled-fill-before.png)、[Fill 后截图](./planner-full-audit-controlled-fill-after.png)和[协调员数据](./planner-full-audit-coordinator.json)。这证明 Junimo Hut 的 Fill 样本有效；没有执行 Fill 之后的 Undo，也不能推广到所有物品。此前 Tilled Dirt 单次尝试无变化，但目标格可放置性未独立确认，因此仍属未定样本。
- **竞品对照：** [stardewplan.com 的实际 UI 记录与截图](./torch-competitor-comparison.json)显示：选择 Torch 后 Fill enabled，Fill pressed，并显示 “Filling Torch / Drag to fill”。初始禁用状态对应的目录标签未记录，不能把状态变化归因于选择物品本身。[公开 bundle 静态复核](./torch-competitor-source-review.md)显示竞品 Placeables 工具模式包含 fill，普通物品矩形走通用 fillItems 路径。竞品有 3 个既存地图键；为避免触碰其画布/存档，没有做 Fill 拖动，所以竞品端到端放置结果**未验证**。
- **最窄建议：** 结合竞品能力边界重新评估本地是否应让 Torch 支持 Fill，并先做真实放置与回退验证；不能把“禁用 Torch Fill”当成既定修法。若产品仍选择拒绝该物品，应在入口或提示上明确说明原因。
- **范围 / 置信度：** 本地误导性入口和 controller 拒绝行为有源码及运行证据，**高**；产品应否支持 Torch 是待决策项，竞品仅证明 UI 与通用代码路径、没有证明成功放置，**中**。

### 5. 手机端 Map 弹窗在部分滚动场景下超出视口（布局）

- **问题与复现：** 390×844、页面 scrollY=418 的场景中，打开 Map 后弹窗顶部约 y=479、底部约 y=1025。内部列表滚轮可滚到 scrollTop=77（scrollHeight 499、clientHeight 421），但最后一排 Beach Farm、Meadowlands Farm、Ginger Island 卡片仍在 y≈862–1012，无法通过本次已测的 wheel 操作带入视口；背景滚轮操作后 scrollY 不变，同时测得 body overflow 为 hidden。页面 scrollY=811 时同一弹窗则位于 y≈86–632，完整可见。没有测试原生触摸滚动。
- **证据：** [部分滚动场景截图](./planner-full-audit-mobile-map-partial-controlled.png)、[列表滚动截图](./planner-full-audit-mobile-map-list-end.png)和[坐标/scroll 记录](./planner-full-audit-coordinator.json)。运行时记录为 390×844、backdrop position absolute、body overflow hidden。源码只给 Save、View、Settings、Help、Feedback、Keyboard Shortcuts 加 viewport-fixed backdrop，Map 不在名单内，[editor-modal.tsx:481–493](../src/components/editor-modal.tsx#L481)；通用 backdrop 使用 position:absolute，[app/globals.css:3653–3656](../app/globals.css#L3653)。这些是布局配置证据；尚未修复并复测，不能据此宣称最终根因已验证。
- **最窄建议：** 让 Map 弹窗在移动端对齐视口，或确保弹窗内部滚动可把末尾卡片完整带入视口，同时保留背景滚动锁。
- **范围 / 置信度：** 特定 scrollY 下的弹窗、滚轮和卡片坐标均有实测；结论限定该场景，**高**。

## 覆盖与限制

- **已测：** 桌面 topbar、Help、Keyboard Shortcuts、Feedback 表单、Library 的 Local projects / Import Game Save / Farm Summary、Ambience、Farm Settings、Map 各分支、View、Settings；目录 8 类、搜索/筛选/Grid/List；工具栏 Select/Multi/Fill/Erase/Zoom/Undo/Redo；画布放置、移动、Multi、Erase、Undo/Redo 与上述 Fill 样本。手机端测了 Menu、代表性面板、Library 路径、Map 四个主标签和两个 Community 子标签、Browse/Collapse、Crops 代表类别、工具选择和 Zoom。实际审查与恢复记录见[完整审计 JSON](./planner-full-audit.json)及[补充 JSON](./planner-full-audit-coordinator.json)。
- **恢复结果：** 回到 Standard Farm 的 4 个初始建筑、Select、无待放置提示、无 dialog，Undo/Redo disabled；本地项目键仍不存在，ambience 偏好原值保留。审查开始时 IndexedDB 数据库列表为空，最终未重新枚举。受控 Fill 后的浏览器状态已复位；TaskSpace 134 以 keep[] 关闭 p1、p2。
- **未执行：** 创建/保存/删除项目、选择真实存档并导入、导出/下载、剪贴板写入、登录、云同步/删除和反馈提交。竞品没有执行画布手势；移动 Map 未测试原生触摸滑动，也没有把所有桌面选项逐项重测手机。
- **环境与验证边界：** 打开 Local projects 时本地静态预览对同源 GET /api/auth/get-session 返回 HTTP 404；Feedback 显示暂不可用。这是预览后端限制，不作产品回归判断。早期定位器大小写错误、等待超时和 Node 上下文访问 document 的错误属于测试脚本问题，之后已按正确页面上下文取证，不列为产品问题。此次审查没有重跑 tests、typecheck 或 build；JSON 记录的静态 out 预览不构成 build 证明。清除设备指标后页面已关闭；关闭前的本地宽度读数仍为 390，不能据此宣称已验证宿主机原生视口。

