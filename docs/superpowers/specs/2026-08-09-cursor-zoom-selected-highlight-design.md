# Cursor and Zoom Selected Highlight Design

## 目标

让编辑器工具栏中的 Cursor 与 Zoom 都能用与当前 Multi-select、Erase 相同的浅红选中视觉表达状态：

- Cursor 在 `aria-pressed="true"` 时显示浅红背景 `rgb(177 58 40 / 15%)` 与红色前景 `#b13a28`。
- Zoom 在 `aria-pressed="true"` 时显示同样的浅红背景 `rgb(177 58 40 / 15%)` 与红色文字 `#b13a28`。
- Cursor 选中状态与 Zoom 开启状态完全独立，因此二者可以同时保持红色高亮。

这次只把已有的语义状态可视化，不新增状态来源，也不改变工具行为。

## 现状证据

以下证据均来自本工作树当前提交 `ab84a7707c809b90d9f055d7c4567804deb17d0e`：

- `src/components/editor-toolbar.tsx:27-40` 定义了四个编辑工具，其中 Cursor 的稳定工具值是 `"cursor"`，Multi-select、Fill、Erase 分别是 `"multi-select"`、`"fill"`、`"erase"`。
- `src/components/editor-toolbar.tsx:52-69` 用 `tool === editorToolControl.tool` 计算 `isSelected`，并将它输出为 `aria-pressed`；当前只给 Multi-select 添加 `multi-select` marker，只给 Erase 添加 `erase-hover` 与选中时的 `erase` marker，Cursor 目前没有专属 class marker。
- `src/components/editor-toolbar.tsx:102-117` 的 Zoom 按钮已经有稳定 class `reference-runtime-wheel-zoom-button`、稳定 data marker `data-reference-runtime-wheel-zoom-button="true"`，并将独立的 `wheelZoomEnabled` 输出为 `aria-pressed`。
- `src/components/planner-workspace.tsx:545` 保存独立的 `isWheelZoomEnabled` 状态；`src/components/planner-workspace.tsx:759-761` 单独切换并传入 Zoom 状态，证明 Zoom 不应复用编辑工具 `tool` 状态。
- `app/globals.css:1913-1926` 定义工具按钮的基础、通用 hover 与通用 active 规则；通用 hover 会将按钮设为 `var(--bg-surface)` 与 `var(--text)`。
- `app/globals.css:1927-1931` 已有 Multi-select 和 Erase 的红色选中值：Multi-select 使用 `.tool-btn.multi-select[aria-pressed="true"]`，Erase 使用 `.tool-btn.erase`；两者均使用背景 `rgb(177 58 40 / 15%)` 与前景 `#b13a28`。
- `tests/components/editor-controls.test.tsx:102-147` 已锁定 Multi-select 的专属 class 与 `aria-pressed` 语义；`tests/components/editor-controls.test.tsx:149-182` 已锁定选中规则位于通用 hover 规则之后、包含红色值且不包含 `aria-pressed="false"` 选择器。

## 精确行为

### Cursor

- Cursor 的现有 `aria-pressed` 计算方式保持不变。
- 当 Cursor 的 `aria-pressed="true"` 时，按钮背景为 `rgb(177 58 40 / 15%)`，图标及按钮前景为 `#b13a28`。
- 当 Cursor 的 `aria-pressed="false"` 时，不匹配本次红色选中规则，恢复现有非选中样式；鼠标 hover 继续使用当前通用 hover 样式。
- 当 Cursor 已选中并鼠标 hover 时，仍保持浅红背景与 `#b13a28` 前景，不被通用 hover 规则改回中性颜色。

### Zoom

- Zoom 的现有 `aria-pressed={wheelZoomEnabled}` 计算方式保持不变。
- 当 Zoom 的 `aria-pressed="true"` 时，按钮背景为 `rgb(177 58 40 / 15%)`，文字为 `#b13a28`。
- 当 Zoom 的 `aria-pressed="false"` 时，不匹配本次红色开启规则，恢复现有关闭样式；鼠标 hover 继续使用当前 Zoom 的非选中 hover 样式。
- 当 Zoom 已开启并鼠标 hover 时，仍保持浅红背景与 `#b13a28` 文字，不被通用 hover 规则改回中性颜色。

### 独立状态

- Cursor 是否选中只由现有编辑工具 `tool` 决定。
- Zoom 是否开启只由现有 `wheelZoomEnabled` 决定。
- Cursor 选中而 Zoom 关闭、Cursor 未选中而 Zoom 开启、二者同时开启、二者都关闭，四种组合都必须可独立呈现。
- 切换 Cursor、Multi-select、Fill 或 Erase 不得改变 Zoom 的状态；开启或关闭 Zoom 不得改变当前编辑工具。

## 视觉值与 CSS 边界

本次新增的两个状态规则必须使用完全相同的值：

```css
background: rgb(177 58 40 / 15%);
color: #b13a28;
```

推荐的最小选择器边界是：

```css
.planner-editor-shell .tool-btn.cursor[aria-pressed="true"] { ... }
.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"] { ... }
```

这两个选择器分别绑定 Cursor 的专属 marker 与 Zoom 已存在的稳定 class。它们只匹配各自按钮且只匹配 `aria-pressed="true"`，不能影响任何 `false` 状态。

规则应放在现有编辑器工具按钮的通用 hover 规则之后，并保持与当前 Multi-select 规则相同的覆盖策略：选中规则本身也匹配 hover 状态，因此已选中/已开启按钮在 hover 时继续命中红色规则；不需要新增全局 hover 覆盖或改变 hover 交互。

本次不改变尺寸、宽高、padding、间距、分组、布局、圆角、边框、字体大小、图标、文字、transition、focus-visible 或 disabled 样式。

## 范围

- 规格对应的实现只涉及 `src/components/editor-toolbar.tsx` 为 Cursor 添加一个专属稳定 class marker，以及 `app/globals.css` 添加两个工具专属的 `aria-pressed="true"` 规则。
- Cursor marker 推荐使用精确名称 `cursor`，并仅由现有 `editorToolControl.tool === "cursor"` 条件产生。
- Zoom 不新增 class 或 data marker，直接复用现有 `reference-runtime-wheel-zoom-button`。
- 保持现有 `aria-label`、`aria-pressed`、点击回调、状态计算和组件接口。
- 如需回归断言，只允许补充与上述渲染 marker 和 CSS selector 直接对应的最小测试；测试不是本规格提交的一部分。

## 非范围

- 不改变 Multi-select、Erase、Fill、Undo、Redo 的现有样式、状态、行为或快捷键。
- 不改变 Cursor 或 Zoom 的实际交互、地图操作、滚轮/触控缩放、键盘缩放或持久化行为。
- 不改变按钮尺寸、布局、分组、圆角、图标、标签、间距、响应式行为、focus-visible、disabled 或 transition。
- 不新增通用工具状态系统、通用“危险选中态”变量、组件、抽象层或未来扩展接口。
- 不使用宽泛的 `.tool-btn[aria-pressed="true"]`、`.editor-toolbar__button[aria-pressed="true"]` 或 `.active` 规则来承载本次需求。
- 不修改 Toast、目录、地图、渲染、状态管理、快捷键、配置、依赖、其他页面或公共样式契约。
- 本次只提交规格文档，不在本工作树中实现产品代码、测试或样式改动。

## 推荐实现

1. 在 `EditorToolbar` 现有 `className` 拼接边界中，为 `editorToolControl.tool === "cursor"` 追加稳定 class token `cursor`。保留已有 Multi-select、Erase、Fill 与 `active` class 的条件和顺序，不重构工具按钮渲染。
2. 在 `app/globals.css` 的 `.planner-editor-shell` 工具栏规则附近，添加两个相互独立的规则：

   ```css
   .planner-editor-shell .tool-btn.cursor[aria-pressed="true"] {
     background: rgb(177 58 40 / 15%);
     color: #b13a28;
   }

   .planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"] {
     background: rgb(177 58 40 / 15%);
     color: #b13a28;
   }
   ```

3. 将两个选中规则放在会改变按钮 hover 颜色的通用规则之后，确保 selected hover 仍由工具专属选中规则胜出；不要为 `false` 增加反向规则。
4. 只验证该 marker、两个精确 selector、四种独立状态组合以及 selected hover；不要借机调整现有工具视觉或提取公共状态抽象。

## 拒绝方案及原因

### 使用 `.tool-btn[aria-pressed="true"]`

拒绝。该选择器会同时命中 Cursor、Multi-select、Erase、Fill 与 Zoom，无法表达本次只对 Cursor 与 Zoom 新增高亮的范围，也容易覆盖不应改变的工具视觉。

### 使用 `.editor-toolbar__button[aria-pressed="true"]` 或 `.active`

拒绝。两者都不是本次需求的工具专属边界；`.active` 还是现有通用选中 class，复用它会把视觉规则与所有按钮的状态耦合，违反最小 selector 与防漂移要求。

### 为 Zoom 新增重复的 class 或新的状态 marker

拒绝。Zoom 已有稳定的 `reference-runtime-wheel-zoom-button` class 与 `data-reference-runtime-wheel-zoom-button="true"` marker；新增重复标识会扩大 DOM 契约，且没有必要。

### 让 Cursor 复用 `erase` 或 `multi-select` marker

拒绝。Cursor、Multi-select 与 Erase 是不同工具；共享 marker 会让未来的局部样式误命中非目标工具，也会破坏工具专属边界。

### 引入统一工具状态系统或抽象颜色变量

拒绝。本次只需两个静态 CSS 规则和一个 Cursor marker；提前抽象无法解决当前问题，增加耦合并违反 KISS、YAGNI。

### 通过 React 新增第二套选中/开启状态

拒绝。`aria-pressed` 已是现有语义状态，Cursor 与 Zoom 的状态来源也已经存在；新增状态会造成状态漂移和无障碍语义不一致。

## 测试与浏览器验收

### 静态与组件回归

实现阶段应补充最小、直接的回归断言：

- Cursor 在选中与未选中时都包含稳定 `cursor` marker，并分别输出 `aria-pressed="true"`/`"false"`；只有 `true` 状态匹配红色规则，其余工具 class 与 `aria-pressed` 语义保持不变。
- Zoom 关闭/开启时分别输出 `aria-pressed="false"`/`"true"`，始终保留 `reference-runtime-wheel-zoom-button`。
- CSS 包含两个工具专属 `aria-pressed="true"` selector 和相同的背景/前景值，不包含宽泛的 `.tool-btn[aria-pressed="true"]` 或对应的 `false` 选中规则。
- 两个选中规则位于通用 hover 规则之后，确保 selected hover 保持红色。

建议运行：

```bash
pnpm exec vitest run tests/components/editor-controls.test.tsx tests/components/editor-shell.test.tsx
pnpm typecheck
pnpm build
git diff --check
```

### 浏览器验收

在本地编辑器页面打开工具栏，逐项确认：

1. 将 Cursor 切换为未选中并关闭 Zoom 时，两者均不显示本次浅红选中态。
2. 点击 Cursor：Cursor 的背景为 `rgb(177 58 40 / 15%)`，图标/前景为 `#b13a28`；Zoom 保持关闭样式。
3. 鼠标悬停已选中的 Cursor：红色背景和前景保持不变。
4. 点击 Zoom 开启：Zoom 的背景为 `rgb(177 58 40 / 15%)`，文字为 `#b13a28`；Cursor 的高亮不被改变。
5. 在 Cursor 仍选中的情况下保持 Zoom 开启，确认两个按钮可以同时红色高亮。
6. 关闭 Zoom：Zoom 恢复原有关闭/非选中样式，Cursor 仍保持选中红色。
7. 切换到 Multi-select、Erase、Fill，并执行一次 Undo/Redo 可用性检查：既有工具的样式、布局、行为、快捷键和状态不发生变化；Cursor 未选中后红色选中态消失。
8. 鼠标悬停关闭的 Zoom 与未选中的 Cursor，确认各自仍使用原有非选中 hover 样式。

浏览器验收只验证工具栏实际渲染结果和已确认行为；不以截图或颜色近似替代 DOM `aria-pressed` 状态与实际 CSS 计算值核查。

## 风险与防漂移边界

- **风险：** 通用 active 或 hover 规则覆盖选中红色。
  - **控制：** 选中规则限定到 Cursor/Zoom 专属 selector，并放在现有通用 hover 规则之后；selected hover 必须保持红色。
- **风险：** `aria-pressed="true"` 规则误伤 false 状态或其他按钮。
  - **控制：** 两条规则都必须同时包含目标 marker 与精确的 `aria-pressed="true"`；禁止新增 false 规则和宽泛工具 selector。
- **风险：** Cursor marker 与 Zoom marker 被混用，造成两个状态耦合。
  - **控制：** Cursor 只使用 `cursor`，Zoom 只复用 `reference-runtime-wheel-zoom-button`；两者不共享状态 class。
- **风险：** 为了实现颜色而改变现有行为或 DOM 契约。
  - **控制：** 不改状态计算、事件、快捷键、接口、按钮尺寸、布局、图标、标签和交互；实现只允许增加 Cursor marker 与两条 CSS 规则。
- **风险：** 后续维护者把本次规则扩大为通用工具系统。
  - **控制：** 将 selector、值、非范围和拒绝方案作为本规格的硬边界；任何扩展到其他工具必须另行确认，不得在本任务中顺手抽象。

## 规格自审

- 已覆盖 Cursor 与 Zoom 的 `aria-pressed="true"` 视觉值、`false` 恢复、selected hover 与独立状态组合。
- 已明确推荐 Cursor 专属 `cursor` class marker，以及 Zoom 复用 `reference-runtime-wheel-zoom-button`。
- 已明确拒绝宽泛 `.tool-btn[aria-pressed="true"]` 和通用未来工具状态系统。
- 已列出目标文件、非范围、现状代码证据、测试命令、浏览器验收和防漂移控制。
- 本提交不包含产品代码、测试、样式或配置修改。
