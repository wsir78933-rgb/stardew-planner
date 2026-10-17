# StardewPlan Torch Fill 公开 bundle 复核

复核日期：2026-10-16。范围仅为指定公开 bundle 的 GET 与静态文本检查；未执行下载的 JavaScript、未使用浏览器、未修改产品代码，也未追取其他 bundle。

## 获取证据

执行命令：

```sh
curl --fail --silent --show-error --location --max-time 30 --dump-header /tmp/stardewplan-CWiKN5o2.headers --output /tmp/stardewplan-CWiKN5o2.js --write-out 'http_code=%{http_code}\nsize_download=%{size_download}\nurl_effective=%{url_effective}\n' https://stardewplan.com/_app/immutable/chunks/CWiKN5o2.js
```

原始输出：`http_code=200`、`size_download=1210143`、最终 URL 与请求 URL 相同。响应为 HTTP/2 200，`content-type: application/javascript`，`cache-control: public, max-age=31536000, immutable`。`shasum -a 256 /tmp/stardewplan-CWiKN5o2.js` 输出：`79306cc596d3b86e880a1ac0a2b5b2554533e3400c7ac58347254e79011fd9e1`。文件类型为 ASCII JavaScript 长行文本。

## 静态发现

此 chunk 本身含目录工具模式、状态 pill 与地图矩形处理代码，因此没有 GET 其余导入文件。

- 字节偏移 `974907`：`Placeables:["cursor","select","fill","erase"]`。字节偏移 `1197422` 的父组件把当前目录标签对应的列表作为 `toolModes` 传给工具栏；字节偏移 `727667` 的工具按钮再以 `toolModes.includes(mode)` 设置 `disabled` 与 `aria-disabled`。因此源码显示按钮启用取决于目录标签模式列表，而非单件物品的能力标志。QA 记录显示选 Torch 后 Fill enabled，点击 Fill 后 `ariaPressed: true`、状态为 `Filling Torch`（[QA JSON](torch-competitor-comparison.json:33)）；未选择时按钮 disabled 也有记录（同文件 `:22–29`），但 JSON 未注明当时目录标签，不能把前后变化归因于选择物品本身。记录明确没有执行地图 Fill 手势（同文件 `:49–56`）。
- 字节偏移 `587432`：Fill 矩形收尾分支在 `state.mode === "item"` 时调用 `fillFencePerimeter(...)`（围栏）或 `fillItems(...)`（其他 item）；若结果为零则撤销此前的 history push；若大于零才触发成功后的更新回调。该分支没有检查物品级的 Fill 能力标志。
- 字节偏移 `429059`、`430135`、`430655`：`ht(...)` 用当前 `itemId` 与 `itemSize` 规划矩形内通过放置校验的位置；`Cn(...)` 对每个规划位置调用 `addItem(i.itemId, ...)`；`Xn(...)` 将两者串联为 `fillItems(...)`。这是 item Fill 的实际公开代码路径，表示只要规划得到合法位置，就会按当前 item ID 添加物品。
- 字节偏移 `587432` 还包含成功后的 `state.itemId === "object_93"` 特殊分支。该 chunk 没有提供 `object_93` 到显示名的映射，所以不单凭这一片段认定该 ID 就是 Torch。
- 字节偏移 `997891`：pill 在 `toolMode === "fill"` 且有 crop 或 footprint 时显示 `Filling ${name}`；这个显示条件本身也没有物品级能力判断。

## 对本地能力判断的意义

公开源码证据表明，竞品 Placeables 工具栏开放 Fill，且 item 矩形路径走通用 `fillItems` 计划与添加逻辑；和 QA 中 Torch 可选中、Fill 可用、状态显示为 Filling 相互吻合。它支持“竞品设计上允许 Torch 走 item Fill 路径”的判断，但**不证明实际拖拽成功**：QA 因保留的三个已存地图而没有操作画布；bundle 的动态放置校验也决定具体矩形可能返回零个位置。

本地当前 `object:93` 走 `placementTools`（`src/catalog/catalog-schema.ts:177–183, 1473–1492`），其中不含 `fill`；`applyEditorFill` 会以 `unsupported-catalog-category` 提前拒绝（`src/editor/editor-fill-controller.ts:69–75`）。因此竞品源码是重新评估本地 Torch Fill 能力的依据，但需把结论限定在能力/实现路径层面；目前仍无竞品实际矩形 Fill、数量增加和 Undo 的行为证据，不能标记为端到端 PASS。
