# 固定版本路由与视觉验收矩阵

快照日期：2026-07-26。此矩阵是 `src/reference/route-state-manifest.ts` 的中文可读版本，用于后续页面实现和视觉验收。

| 路由 ID | 路径 | 视口 | 验收目的 |
| --- | --- | --- | --- |
| `planner` | `/` | `desktop`、`mobile` | 验收桌面和移动端的完整浏览器本地农场规划工作区。 |
| `privacy` | `/privacy` | `desktop`、`mobile` | 验收浏览器本地隐私说明的法律页面布局。 |
| `terms` | `/terms` | `desktop`、`mobile` | 验收浏览器本地条款的法律页面布局。 |

## 规划器（`/`）

| 状态 ID | 视口 | 工具模式 | 选中实体 | 模态状态 | 操作 | 应可见结果 |
| --- | --- | --- | --- | --- | --- | --- |
| `desktop-idle` | `desktop` | `cursor` | `null` | `null` | 打开规划器。 | 显示农场地图、顶部工具栏、分类目录和检查器的桌面工作区。 |
| `mobile-idle` | `mobile` | `cursor` | `null` | `null` | 打开规划器。 | 显示农场地图、触控工具和移动端目录面板的移动工作区。 |
| `desktop-map-picker` | `desktop` | `cursor` | `null` | `map-picker` | 打开地图选择器。 | 桌面地图选择器显示官方农场、姜岛、室内地图和支持的 Mod 地图。 |
| `mobile-map-picker` | `mobile` | `cursor` | `null` | `map-picker` | 打开地图选择器。 | 移动端地图选择器显示官方农场、姜岛、室内地图和支持的 Mod 地图。 |
| `desktop-catalog` | `desktop` | `cursor` | `null` | `catalog` | 打开目录中的一个物品分类。 | 桌面目录显示所选分类的可放置物品网格与搜索控件。 |
| `mobile-catalog` | `mobile` | `cursor` | `null` | `catalog` | 打开目录中的一个物品分类。 | 移动端目录面板显示所选分类的可放置物品网格与搜索控件。 |
| `desktop-local-projects` | `desktop` | `cursor` | `null` | `projects` | 打开浏览器本地 Projects 面板，并保存到当前浏览器本机项目。 | 桌面面板显示当前浏览器本地项目、保存到当前浏览器本机项目的状态，以及创建、打开、重命名、复制、删除控件。 |
| `mobile-local-projects` | `mobile` | `cursor` | `null` | `projects` | 打开浏览器本地 Projects 面板，并保存到当前浏览器本机项目。 | 移动端面板显示当前浏览器本地项目、保存到当前浏览器本机项目的状态，以及创建、打开、重命名、复制、删除控件。 |
| `desktop-json-import` | `desktop` | `cursor` | `null` | `json-import` | 选择 farm-plan JSON 导入。 | 桌面文件选择器可将 farm-plan JSON 文件导入当前浏览器。 |
| `mobile-json-import` | `mobile` | `cursor` | `null` | `json-import` | 选择 farm-plan JSON 导入。 | 移动端文件选择器可将 farm-plan JSON 文件导入当前浏览器。 |
| `desktop-json-export` | `desktop` | `cursor` | `null` | `export-menu` | 选择 farm-plan JSON 导出。 | 桌面导出控件下载当前规划为 farm-plan JSON 文件。 |
| `mobile-json-export` | `mobile` | `cursor` | `null` | `export-menu` | 选择 farm-plan JSON 导出。 | 移动端导出控件下载当前规划为 farm-plan JSON 文件。 |
| `desktop-game-save-import` | `desktop` | `cursor` | `null` | `game-save-import` | 选择本地游戏存档导入。 | 桌面文件选择器可读取本地 Stardew Valley 游戏存档文件。 |
| `mobile-game-save-import` | `mobile` | `cursor` | `null` | `game-save-import` | 选择本地游戏存档导入。 | 移动端文件选择器可读取本地 Stardew Valley 游戏存档文件。 |
| `desktop-png-export` | `desktop` | `cursor` | `null` | `export-menu` | 导出 1x PNG 图片。 | 桌面导出控件生成当前地图的 1x PNG 图片。 |
| `mobile-png-export` | `mobile` | `cursor` | `null` | `export-menu` | 导出 1x PNG 图片。 | 移动端导出控件生成当前地图的 1x PNG 图片。 |
| `desktop-hq-png-export` | `desktop` | `cursor` | `null` | `export-menu` | 导出 HQ PNG 图片。 | 桌面导出控件生成当前地图的 HQ PNG 图片。 |
| `mobile-hq-png-export` | `mobile` | `cursor` | `null` | `export-menu` | 导出 HQ PNG 图片。 | 移动端导出控件生成当前地图的 HQ PNG 图片。 |
| `desktop-farm-summary` | `desktop` | `cursor` | `null` | `farm-summary` | 打开农场汇总。 | 桌面农场汇总显示当前规划的数量和地图信息。 |
| `mobile-farm-summary` | `mobile` | `cursor` | `null` | `farm-summary` | 打开农场汇总。 | 移动端农场汇总显示当前规划的数量和地图信息。 |
| `desktop-csv-export` | `desktop` | `cursor` | `null` | `farm-summary` | 导出农场汇总 CSV。 | 桌面汇总控件下载当前农场汇总为 CSV 文件。 |
| `mobile-csv-export` | `mobile` | `cursor` | `null` | `farm-summary` | 导出农场汇总 CSV。 | 移动端汇总控件下载当前农场汇总为 CSV 文件。 |
| `desktop-placement-validation` | `desktop` | `cursor` | `wooden-fence` | `null` | 尝试在阻挡地块放置物品。 | 桌面地图保持阻挡地块不变，并显示放置校验反馈。 |
| `mobile-placement-validation` | `mobile` | `cursor` | `wooden-fence` | `null` | 尝试在阻挡地块放置物品。 | 移动端地图保持阻挡地块不变，并显示放置校验反馈。 |
| `desktop-cursor-placement` | `desktop` | `cursor` | `wooden-fence` | `null` | 使用 Cursor 工具放置所选物品。 | 在桌面地图的有效地块放置木栅栏。 |
| `mobile-cursor-placement` | `mobile` | `cursor` | `wooden-fence` | `null` | 使用 Cursor 工具放置所选物品。 | 在移动端地图的有效地块放置木栅栏。 |
| `desktop-fill` | `desktop` | `fill` | `stone-flooring` | `null` | 使用 Fill 工具填充同类地块区域。 | 桌面匹配地块区域填充所选石质地板。 |
| `mobile-fill` | `mobile` | `fill` | `stone-flooring` | `null` | 使用 Fill 工具填充同类地块区域。 | 移动端匹配地块区域填充所选石质地板。 |
| `desktop-eraser` | `desktop` | `eraser` | `null` | `null` | 使用 Eraser 工具清除已放置物品。 | 选中的已放置物品从桌面地图移除。 |
| `mobile-eraser` | `mobile` | `eraser` | `null` | `null` | 使用 Eraser 工具清除已放置物品。 | 选中的已放置物品从移动端地图移除。 |
| `desktop-marquee-selection` | `desktop` | `multi-select` | `placed-object-region` | `null` | 拖拽框选已放置物品。 | 桌面框选高亮所包围的已放置物品区域。 |
| `mobile-marquee-selection` | `mobile` | `multi-select` | `placed-object-region` | `null` | 拖拽框选已放置物品。 | 移动端框选高亮所包围的已放置物品区域。 |
| `desktop-selection-edit` | `desktop` | `multi-select` | `placed-object-region` | `selection-inspector` | 编辑选中的已放置物品区域。 | 桌面选择检查器显示该区域的可编辑属性。 |
| `mobile-selection-edit` | `mobile` | `multi-select` | `placed-object-region` | `selection-inspector` | 编辑选中的已放置物品区域。 | 移动端选择检查器显示该区域的可编辑属性。 |
| `desktop-selection-move` | `desktop` | `multi-select` | `placed-object-region` | `selection-inspector` | 移动选中的已放置物品区域。 | 选中的区域移动到桌面地图的有效位置。 |
| `mobile-selection-move` | `mobile` | `multi-select` | `placed-object-region` | `selection-inspector` | 移动选中的已放置物品区域。 | 选中的区域移动到移动端地图的有效位置。 |
| `desktop-selection-duplicate` | `desktop` | `multi-select` | `placed-object-region` | `selection-inspector` | 复制选中的已放置物品区域。 | 选中区域的副本出现在桌面地图的有效位置。 |
| `mobile-selection-duplicate` | `mobile` | `multi-select` | `placed-object-region` | `selection-inspector` | 复制选中的已放置物品区域。 | 选中区域的副本出现在移动端地图的有效位置。 |
| `desktop-undo` | `desktop` | `cursor` | `null` | `null` | 在规划变更后选择 Undo。 | 最近一次桌面规划变更被撤销。 |
| `mobile-undo` | `mobile` | `cursor` | `null` | `null` | 在规划变更后选择 Undo。 | 最近一次移动端规划变更被撤销。 |
| `desktop-redo` | `desktop` | `cursor` | `null` | `null` | 在撤销后选择 Redo。 | 已撤销的桌面规划变更再次应用。 |
| `mobile-redo` | `mobile` | `cursor` | `null` | `null` | 在撤销后选择 Redo。 | 已撤销的移动端规划变更再次应用。 |
| `desktop-map-switching` | `desktop` | `cursor` | `null` | `map-picker` | 切换到另一张农场地图。 | 桌面规划器显示所选农场地图和对应地图控件。 |
| `mobile-map-switching` | `mobile` | `cursor` | `null` | `map-picker` | 切换到另一张农场地图。 | 移动端规划器显示所选农场地图和对应地图控件。 |
| `desktop-season-switching` | `desktop` | `cursor` | `null` | `season-picker` | 切换可见季节。 | 桌面地图显示所选季节的视觉效果。 |
| `mobile-season-switching` | `mobile` | `cursor` | `null` | `season-picker` | 切换可见季节。 | 移动端地图显示所选季节的视觉效果。 |
| `desktop-overlay-grid` | `desktop` | `cursor` | `null` | `overlays` | 启用 Grid 叠加层。 | 网格单元覆盖显示在桌面地图上。 |
| `mobile-overlay-grid` | `mobile` | `cursor` | `null` | `overlays` | 启用 Grid 叠加层。 | 网格单元覆盖显示在移动端地图上。 |
| `desktop-overlay-buildable` | `desktop` | `cursor` | `null` | `overlays` | 启用 Buildable 叠加层。 | 可建造地块标记显示在桌面地图上。 |
| `mobile-overlay-buildable` | `mobile` | `cursor` | `null` | `overlays` | 启用 Buildable 叠加层。 | 可建造地块标记显示在移动端地图上。 |
| `desktop-overlay-crop` | `desktop` | `cursor` | `null` | `overlays` | 启用 Crop 叠加层。 | 作物地块标记显示在桌面地图上。 |
| `mobile-overlay-crop` | `mobile` | `cursor` | `null` | `overlays` | 启用 Crop 叠加层。 | 作物地块标记显示在移动端地图上。 |
| `desktop-overlay-tree` | `desktop` | `cursor` | `null` | `overlays` | 启用 Tree 叠加层。 | 树木地块标记显示在桌面地图上。 |
| `mobile-overlay-tree` | `mobile` | `cursor` | `null` | `overlays` | 启用 Tree 叠加层。 | 树木地块标记显示在移动端地图上。 |
| `desktop-overlay-npc-path` | `desktop` | `cursor` | `null` | `overlays` | 启用 NPC Path 叠加层。 | NPC 路径地块标记显示在桌面地图上。 |
| `mobile-overlay-npc-path` | `mobile` | `cursor` | `null` | `overlays` | 启用 NPC Path 叠加层。 | NPC 路径地块标记显示在移动端地图上。 |
| `desktop-overlay-night` | `desktop` | `cursor` | `null` | `overlays` | 启用 Night 模式。 | 桌面地图显示夜晚视觉效果。 |
| `mobile-overlay-night` | `mobile` | `cursor` | `null` | `overlays` | 启用 Night 模式。 | 移动端地图显示夜晚视觉效果。 |
| `desktop-overlay-sprinkler` | `desktop` | `cursor` | `null` | `overlays` | 启用 Sprinkler 叠加层。 | 洒水器覆盖范围标记显示在桌面地图上。 |
| `mobile-overlay-sprinkler` | `mobile` | `cursor` | `null` | `overlays` | 启用 Sprinkler 叠加层。 | 洒水器覆盖范围标记显示在移动端地图上。 |
| `desktop-overlay-scarecrow` | `desktop` | `cursor` | `null` | `overlays` | 启用 Scarecrow 叠加层。 | 稻草人覆盖范围标记显示在桌面地图上。 |
| `mobile-overlay-scarecrow` | `mobile` | `cursor` | `null` | `overlays` | 启用 Scarecrow 叠加层。 | 稻草人覆盖范围标记显示在移动端地图上。 |
| `desktop-overlay-bee-house` | `desktop` | `cursor` | `null` | `overlays` | 启用 Bee House 叠加层。 | 蜂房花朵覆盖范围标记显示在桌面地图上。 |
| `mobile-overlay-bee-house` | `mobile` | `cursor` | `null` | `overlays` | 启用 Bee House 叠加层。 | 蜂房花朵覆盖范围标记显示在移动端地图上。 |
| `desktop-overlay-junimo-hut` | `desktop` | `cursor` | `null` | `overlays` | 启用 Junimo Hut 叠加层。 | Junimo Hut 覆盖范围标记显示在桌面地图上。 |
| `mobile-overlay-junimo-hut` | `mobile` | `cursor` | `null` | `overlays` | 启用 Junimo Hut 叠加层。 | Junimo Hut 覆盖范围标记显示在移动端地图上。 |
| `desktop-overlay-resource-clump` | `desktop` | `cursor` | `null` | `overlays` | 启用 Resource Clumps 叠加层。 | 资源丛位置标记显示在桌面地图上。 |
| `mobile-overlay-resource-clump` | `mobile` | `cursor` | `null` | `overlays` | 启用 Resource Clumps 叠加层。 | 资源丛位置标记显示在移动端地图上。 |
| `desktop-weather-unavailable` | `desktop` | `cursor` | `null` | `overlays` | 打开 Weather 控件。 | Weather 控件在桌面规划器中保持可见但不可用。 |
| `mobile-weather-unavailable` | `mobile` | `cursor` | `null` | `overlays` | 打开 Weather 控件。 | Weather 控件在移动端规划器中保持可见但不可用。 |

## 隐私（`/privacy`）

| 状态 ID | 视口 | 工具模式 | 选中实体 | 模态状态 | 操作 | 应可见结果 |
| --- | --- | --- | --- | --- | --- | --- |
| `desktop-privacy-idle` | `desktop` | `null` | `null` | `null` | 打开隐私页面。 | 浏览器本地隐私说明在桌面端可见。 |
| `mobile-privacy-idle` | `mobile` | `null` | `null` | `null` | 打开隐私页面。 | 浏览器本地隐私说明在移动端可见。 |

## 条款（`/terms`）

| 状态 ID | 视口 | 工具模式 | 选中实体 | 模态状态 | 操作 | 应可见结果 |
| --- | --- | --- | --- | --- | --- | --- |
| `desktop-terms-idle` | `desktop` | `null` | `null` | `null` | 打开条款页面。 | 浏览器本地条款在桌面端可见。 |
| `mobile-terms-idle` | `mobile` | `null` | `null` | `null` | 打开条款页面。 | 浏览器本地条款在移动端可见。 |
