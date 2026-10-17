# G 网站装配绑定报告：house-upgrade-stardew (zh-CN)

## 任务与边界声明

- **任务 ID**: `task_5d9709714ebe`
- **Dispatch ID**: `ctx_c1194f6e0e46`
- **角色**: G 网站装配 Worker（中文）
- **操作根目录**: `docs/blog-ops/house-upgrade-stardew/`
- **互斥写入范围**:
  - 允许且仅允许新增：
    1. `src/blog/articles/house-upgrade-stardew.zh.tsx`
    2. `docs/blog-ops/house-upgrade-stardew/assembly/zh-bindings.md`
  - 禁止写入范围：注册表（`src/blog/blog-post-registry.tsx`、`src/blog/blog-post-identities.ts`、`src/blog/blog-copy.ts`）、英文文章、`public/` 资产目录、测试文件、共享模板或全局样式。
  - 并发保护：本阶段不启动服务、不执行 `pnpm build` / `tsc` / 全量测试，避免并发产物竞态；全量验证由独立 Task 统一调度。
  - 终审与验收：产品 UI 由独立角色 E 后续使用本地 ego-browser 统一进行桌面及移动端验收，本 Task 不自称页面 PASS。

---

## 输入文件与冻结 Hash 绑定

依据协调者消息 `msg_0e91fb8af990` 与 F 双语冻结报告：

| 文件 | 角色 | 真实 SHA-256 | 说明 |
|---|---|---|---|
| `docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json` | 中文 PublicBlogHandoff | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` | `bodyHash`: `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6`<br>`publicFieldsSha256`: `d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94`<br>`integrity.englishBodyHash`: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `docs/blog-ops/house-upgrade-stardew/handoff/public/en.json` | 英文 PublicBlogHandoff | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` | `bodyHash`: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`<br>`publicFieldsSha256`: `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042` |
| `docs/blog-ops/house-upgrade-stardew/handoff/freeze-report.md` | 技术冻结报告 | `dd9daf7299b339c7527f6870a3a74162344e409e37dac8710ca65bd524b1ee32` | F 角色双语技术冻结报告 |
| `docs/blog-ops/house-upgrade-stardew/handoff/freeze-checks.log` | 冻结检查日志 | `2e3fadbb8b8d32310b075a81afe086da5ebccfa6b87e4e28a68c5ebc69f37a4e` | 冻结检查执行日志 |

---

## 产出文件与 Hash

| 产出文件 | 导出函数 | 大小 (Bytes) | SHA-256 |
|---|---|---:|---|
| `src/blog/articles/house-upgrade-stardew.zh.tsx` | `HouseUpgradeStardewChineseArticle()` | 9658 | `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba` |
| `docs/blog-ops/house-upgrade-stardew/assembly/zh-bindings.md` | 本报告 | 见文件 | 本文件创建后计算 |

---

## 逐段结构与文本绑定对照

### 标题结构（严格对应 6 H2 + 2 H3，无 H1）

1. **H1**: 组件内 **无 H1**（由外层页面壳根据注册表 `post.title` 统一渲染 `<h1>{post.title}</h1>`）。
2. **H2 列表（6 个，与 EN 完全同序）**:
   - `## 每一档升级要花多少`
   - `## 准备木材和硬木`
   - `## 先给还缺的木材计价，再累加到某一档`
   - `## 厨房、育儿室和地窖是做什么的`
   - `## 在山路24号下升级订单`
   - `## 装修不是下一次升级`
3. **H3 列表（2 个，与 EN 完全同序）**:
   - `### 手头已经有200木材`
   - `### 从初始农舍累加到你点名的那一档`

### 表格绑定（1 处）

- **所属章节**: `## 每一档升级要花多少`
- **容器属性**: `<div aria-label="每一档升级要花多少" className="blog-table-scroll" role="region" tabIndex={0}>`
- **表格类名**: `<table className="blog-data-table">`
- **内容**:
  - 表头：`升级`、`金币`、`材料`、`天数`
  - 第 1 档：`10,000金（农舍）` / `450木材（木匠的商店）` / `3（农舍）`
  - 第 2 档：`65,000金（农舍）` / `100硬木（木匠的商店）` / `3（木匠的商店）`
  - 第 3 档：`100,000金（农舍）` / 空白 / `3（木匠的商店）`
  - 全部原始链接（`https://stardewvalleywiki.com/Farmhouse`、`https://stardewvalleywiki.com/Carpenter%27s_Shop`）字面保持。

### 正文行内链接（50 处）

- 50 处 Markdown 行内链接 `[文案](URL)` 均机械转为 JSX `<a href="URL">文案</a>`。
- 链接目标 URL 集合与冻结 handoff 的 12 项 `publicReferences` 完全吻合，无私自新增或丢失。

---

## 媒体资产与图位绑定

### 1. 封面图（页头 Cover）
- **角色**: `cover`
- **装配位置**: `article-header`（由外层页面壳渲染，不在正文组件内重复添加）
- **引用路径**: `/blog/house-upgrade-stardew-cover-zh.webp`（自动匹配 `.avif`）
- **尺寸**: 1672×941
- **源文件**: `docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp`
- **源文件 SHA-256**: `bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87`

### 2. 正文图 1：`tier-rooms`
- **角色**: `body`
- **装配位置**: 在 H2「厨房、育儿室和地窖是做什么的」内，紧接说明育儿室就是有婴儿床的那间房的句子之后。
- **引用路径**: `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp`
- **图片组件**: `<PublicPicture src="/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp" alt="三档标注：升级1是厨房和卧室，升级2是空房间和育儿室，升级3是地窖和外观相同，共用一行写着9×5室外。" width={1672} height={941} loading="lazy" decoding="async" />`
- **随文图注**: `<figcaption>示意图：升级1标着厨房和卧室。升级2标着空房间和育儿室。升级3标着地窖和外观相同。共用一行写着9×5室外。</figcaption>`
- **外层容器**: `<figure className="blog-article-media">`
- **源文件**: `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp`
- **源文件 SHA-256**: `d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c`

### 3. 正文图 2：`upgrade-or-renovation`
- **角色**: `body`
- **装配位置**: H2「装修不是下一次升级」的开头。
- **引用路径**: `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp`
- **图片组件**: `<PublicPicture src="/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp" alt="两条路径和两个例子：升级写着3天；装修写着升级2之后、即时和退还金币；移除婴儿床写着免费；餐厅写着150,000金。" width={1672} height={941} loading="lazy" decoding="async" />`
- **随文图注**: `<figcaption>示意图：升级那一路写着升级和3天。装修那一路写着装修、升级2之后、即时和退还金币。移除婴儿床写着免费。餐厅写着150,000金。</figcaption>`
- **外层容器**: `<figure className="blog-article-media">`
- **源文件**: `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp`
- **源文件 SHA-256**: `6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88`

---

## 来源与 CTA 绑定

- **组件**: `<BlogSources heading="来源" items={[...]} />`
- **引用清单**: 严格绑定 `zh-CN.json` 中的 12 项公开引用：
  1. `https://stardewvalleywiki.com/Farmhouse` — 农舍
  2. `https://stardewvalleywiki.com/Carpenter%27s_Shop` — 木匠的商店
  3. `https://stardewvalleywiki.com/Version_History` — 版本历史（附 `note: "1.6把第二次升级从50,000金和150硬木改为65,000金和100硬木。"`）
  4. `https://stardewvalleywiki.com/Axes` — 斧头
  5. `https://stardewvalleywiki.com/Wood` — 木材
  6. `https://stardewvalleywiki.com/Hardwood` — 硬木
  7. `https://stardewvalleywiki.com/Large_Stump` — 大树桩
  8. `https://stardewvalleywiki.com/Large_Log` — 大圆木
  9. `https://stardewvalleywiki.com/Secret_Woods` — 秘密森林
  10. `https://stardewvalleywiki.com/Cooking` — 烹饪
  11. `https://stardewvalleywiki.com/Cask` — 木桶
  12. `https://stardewvalleyplanner.art/carpenter-stardew` — 罗宾的商店和室外建筑
- **CTA**: 由 `BlogSources` 组件内部根据 `heading="来源"` 自动挂载 `BlogPlannerCta locale="zh-CN"`，正文中未添加多余或手写的 CTA。
- **FAQ**: 无 FAQ（已审交接无 FAQ 要求，禁止额外添加）。
- **解耦**: 组件代码纯公开导出，未直接 `import` 私有 ops JSON 或内部状态。

---

## 执行命令与退出码表

| 执行命令 | 退出码 | 关键真实输出 / 验证目的 |
|---|---:|---|
| `orca orchestration check --terminal term_c66bc59c-c31f-4096-b28e-ad37729d6652 --json` | 0 | 接收协调者 handoff 消息 `msg_0e91fb8af990`，确认冻结 SHA 及装配边界 |
| `orca orchestration send --from term_c66bc59c-c31f-4096-b28e-ad37729d6652 --type heartbeat ...` | 0 | 发送 `implementing` 心跳 `msg_64c3fbc1ab00` |
| `shasum -a 256 docs/blog-ops/house-upgrade-stardew/handoff/public/en.json docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json docs/blog-ops/house-upgrade-stardew/handoff/freeze-report.md` | 0 | 确认输入文件真实哈希与冻结报告完全一致 |
| `python3 -c "import hashlib, json; ..."` | 0 | 验证 `zh-CN.json` 的 `body` SHA-256 为 `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` |
| `python3 -c "<验证 H2/H3/链接/图位/引用的自动化核对脚本>"` | 0 | 验证 6 H2, 2 H3, 50 处行内链接, 2 处正文图位, 12 处 Sources 均在 tsx 中准确存在 |
| `python3 -c "<逐段全文无差别文字比对脚本>"` | 0 | 验证 34 个正文段落块在 JSX 中文字逐字完全一致 |
| `shasum -a 256 src/blog/articles/house-upgrade-stardew.zh.tsx` | 0 | 测得产物 SHA-256 为 `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba` |

---

## 真实 Git 状态 Diff

```
?? src/blog/articles/house-upgrade-stardew.zh.tsx
?? docs/blog-ops/house-upgrade-stardew/assembly/zh-bindings.md
```
（注：`AssemblyManifest.json` 为装配主线/协调者创建，本 Worker 仅新增自己的两个互斥目标文件，未修改其他任何既有文件或注册表）。
