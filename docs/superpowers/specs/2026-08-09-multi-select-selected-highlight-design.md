# Multi-select Selected Highlight Design

## 目标

让编辑器工具栏中的 **Multi-select tool** 在 `aria-pressed="true"` 时，拥有与当前已选中的擦除工具相同、清晰可辨的破坏性红色选中视觉：浅红色背景 `rgb(177 58 40 / 15%)` 与红色图标 `#b13a28`。

这个视觉反馈只回答一个问题：用户是否已经成功切换到 Multi-select 工具。它不改变 Multi-select 的实际行为。

## 使用场景

用户在编辑器顶部工具栏点击带虚线选择框图标的 **Multi-select tool** 后，需要立即从按钮外观确认该工具处于当前激活状态，再在地图中框选对象区域。

## 精确范围

- 仅处理 `src/components/editor-toolbar.tsx` 渲染的 **Multi-select tool** 按钮。
- 仅当该按钮已经由现有状态渲染为 `aria-pressed="true"` 时应用视觉规则。
- 复用擦除按钮已存在的选中视觉值：背景 `rgb(177 58 40 / 15%)`、图标/前景色 `#b13a28`。
- 实现时只允许修改必要的工具栏选中态 CSS，并在现有 `tests/components/editor-controls.test.tsx` 或 `tests/components/editor-shell.test.tsx` 增加与该状态直接对应的回归断言。

## 不做事项

- 不改变 Cursor、Erase、Fill、Wheel Zoom、Undo 或 Redo 的视觉、状态或行为。
- 不改变按钮尺寸、圆角、间距、分组、图标、文案、工具栏布局或响应式规则。
- 不改变 `aria-pressed` 的计算方式、`active` 类的切换、`onToolChange` 调用、工具可用性、快捷键、地图选择或放置逻辑。
- 不改变 Toast、素材面板、首页、其他页面、主题变量或任何非工具栏组件。
- 不抽取通用“危险选中态”组件、变量或未来扩展能力；本次只满足 Multi-select 的已确认需求。

## 证据

- `src/components/editor-toolbar.tsx` 将 Multi-select 定义为标签为 `Multi-select tool` 的 `multi-select` 工具。
- 同一组件使用 `tool === editorToolControl.tool` 计算选中状态，并将该值输出为 `aria-pressed`；选中时追加 `active` 类。
- 同一组件只为已选中的擦除工具追加 `erase` 类。
- `app/globals.css` 中 `.planner-editor-shell .tool-btn.erase` 已定义用户确认要复用的视觉值：`background: rgb(177 58 40 / 15%)` 和 `color: #b13a28`。
- `tests/components/editor-controls.test.tsx` 与 `tests/components/editor-shell.test.tsx` 已覆盖工具栏渲染，是本次回归测试的既有边界。

## 视觉规则

- 触发条件：**仅** Multi-select 按钮带有 `aria-pressed="true"`。
- 背景：`rgb(177 58 40 / 15%)`。
- 图标与前景色：`#b13a28`。
- 非选中 Multi-select 继续使用当前默认、悬停、焦点和禁用规则。
- 用户裁定：已选中的 Multi-select 在鼠标悬停时仍保持 `rgb(177 58 40 / 15%)` 背景和 `#b13a28` 图标/前景色；只有非选中的 Multi-select 继续使用现有通用悬停颜色。
- 切换到任意其他工具后，Multi-select 不再匹配选中条件，红色选中背景与图标色立即移除。
- 颜色变化是已有 `aria-pressed` 状态的可视化，不是新的交互状态来源。

## 交互与可访问性

- 保持 Multi-select 的现有 `aria-label="Multi-select tool"`。
- 保持 `aria-pressed` 作为唯一的语义选中状态；不得用纯样式状态替代它。
- 保持现有键盘焦点、disabled 与点击行为；保留现有通用悬停规则，但已选中的 Multi-select 悬停时保持用户裁定的红色选中视觉。
- 选中反馈同时由明确的按钮状态语义和明显的颜色变化表达；本次不新增焦点移动、提示文本或键盘操作。

## 实现边界

- 视觉实现放在 `app/globals.css` 的编辑器工具栏规则中，并以 Multi-select 按钮现有的选中状态作为选择器边界。
- 不修改 `EditorToolbar` 的状态、事件或工具列表，除非为了给既有 Multi-select 按钮附加一个只用于该 CSS 选择器的精确标识且测试证明原有 ARIA 与行为不变；优先使用现有稳定标识，避免不必要的 JSX 改动。
- 不接触编辑器状态模块、放置控制器、快捷键模块、Toast 模块或素材目录模块。

## 风险与控制

- 风险：宽泛的 `.active` 或 `[aria-pressed="true"]` 选择器会意外影响 Cursor、Erase、Fill 或 Wheel Zoom。
  - 控制：选择器必须精确限定为 Multi-select，测试同时断言目标按钮选中和非目标按钮维持现有状态。
- 风险：覆盖现有悬停、焦点或 disabled 规则会降低可用性。
  - 控制：不改现有 `:hover`、`:focus-visible` 或 `:disabled` 规则本身；选中规则只在 `aria-pressed="true"` 时覆盖背景与前景色，因此已选中的 Multi-select 悬停时保持红色，非选中状态继续使用通用悬停规则。
- 风险：红色外观被误解为改变了工具语义。
  - 控制：不改变工具名称、图标、行为或 ARIA；规格明确该颜色仅表示已确认的选中视觉。

## 验收标准

- 当 Multi-select 的现有 `aria-pressed` 为 `true` 时，按钮背景为 `rgb(177 58 40 / 15%)`，图标为 `#b13a28`。
- 当 Multi-select 的现有 `aria-pressed` 为 `false` 时，按钮不显示该红色选中态。
- 切换工具后，只有当前 `aria-pressed="true"` 的工具保持其原有选中状态；Multi-select 的红色选中态随其状态正确出现或移除。
- Cursor、Erase、Fill、Wheel Zoom、Undo 和 Redo 的 JSX、状态逻辑与视觉规则不因本次修改而改变。
- Multi-select 的 `aria-label`、`aria-pressed`、点击处理、快捷键关联、disabled 行为和键盘焦点行为保持不变；已选中状态的悬停视觉按用户裁定保持红色，非选中状态的悬停视觉保持不变。
- 改动中不包含产品逻辑、布局、尺寸、圆角、图标、Toast、素材面板或其他页面的变更。

## 验证命令

```bash
pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/editor-shell.test.tsx
pnpm typecheck
pnpm build
```

浏览器验收：在 `http://127.0.0.1:3002/` 打开编辑器，点击 Multi-select tool，确认它显示浅红背景和红色图标；再切换到 Cursor，确认 Multi-select 红色选中态消失，其他工具外观与交互保持原状。

## 规格自检

- 文档只覆盖 Multi-select tool 的已确认选中视觉。
- 文档没有占位标记、开放式实现选择或未来能力设计。
- 每一条视觉值、排除项、验收条件和验证命令均可直接执行或核验。
