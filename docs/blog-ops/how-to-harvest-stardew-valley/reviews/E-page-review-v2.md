# Review Report: Live Web Page Mobile Viewport & Navigation Supplementary Review (E-page-review-v2)

- **Role**: E2 (Independent Reviewer / 页面证据补足审查)
- **Date**: 2026-10-13
- **Target Keyword**: `how to harvest stardew valley`
- **Reviewer Terminal Handle**: `term_d0dab364-a2b6-4afe-9abb-09e92f9f38cd`
- **Coordinator Terminal Handle**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **Task ID**: `task_2cdd7131ad62`
- **Dispatch ID**: `ctx_edfcdc5fd0da`
- **Previous Task ID**: `task_d5524a3aec59` (`E-page-review.md` 已保留并归档)
- **Review Verdict**: **PASS (移动端视口插图 BoundingBox 精确测绘、初次未绘制帧归因记录、绘制完成帧 22 处标签逐项可读性核验、G 角色测试契约变更审查、双向语言切换真实点击导航完全通过，技术就绪，等待用户终审)**

---

## 1. 运行环境与服务状态证据 (Live Server Context)

1. **服务启动与进程状态 (Live Process & CWD)**:
   - **进程 ID**: PID `79399` (PPID `79343`)
   - **服务类型**: Next.js 16.3.0 (`next dev --webpack`)
   - **监听端口与协议**: IPv4 `127.0.0.1:3004`
   - **真实工作目录 (CWD)**: `/Users/wusir/orca/workspaces/stardew planner/博客-2`（经 `ps` 与 `lsof -p 79399` 实测核实）
2. **源码组件 SHA-256 校验和**:
   - `src/blog/articles/how-to-harvest-stardew-valley.en.tsx`: `dacc4d0361dbd894eec29a6f67b554ce8ee5033d78de6aba1fa87b9b48218daf`
   - `src/blog/articles/how-to-harvest-stardew-valley.zh.tsx`: `98f2835aea750c56e931b933dd4b7ef158c679095c26fb0f5ea1f965827663ae`
   - `src/blog/blog-post-registry.tsx`: `ea146ecfe3e8553ee2355abf259bba7bb7982bad326ca5203faa28f09696fa2b`

---

## 2. 移动端插图初次加载帧失败记录与绘制完成核验 (Initial Lazy-Load Failure vs. Painted Verification)

按照 Root 真实回读反馈，对首屏加载与插图渲染生命周期进行了深度核查与对比记录：

### 2.1 初始未绘制帧归因记录 (Initial Blank Border Observation)
- **现象**: 在首次打开页面且尚未将方法插图滚动至可视区域时，或者在 DOM `DOMContentLoaded` 瞬间立即截取视口时，Next.js 的原生 `loading="lazy"` 特性使得图片并未触发完整解码与 GPU 栅格化绘制。
- **评定**: **初次未经滚动与绘制等待的视口截图判定为“不充分证据 / 预期未完成帧”**。仅依赖 DOM 树中 `complete=true` 或图片元素存在，不能代表屏幕实际物理像素已呈现内容。

### 2.2 滚动居中与绘制完成核验 (After-Scroll & Paint Settled)
- **执行动作**:
  1. 调用 `fig.scrollIntoView({ behavior: "instant", block: "center" })` 将插图平滑定位至手机屏幕正中央。
  2. 显式调用 `await img.decode()` 等待图片二进制流解压就绪。
  3. 留出 1000ms 等待浏览器合成器 (Compositor) 将渲染树栅格化至物理画板。
- **全新命名视口证据保存**:
  - 中文视口截图: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/v2/zh-mobile-viewport-after-paint.png`
  - 英文视口截图: `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/v2/en-mobile-viewport-after-paint.png`
- **核验结论**: 两份全新命名的视口截图均完整显示插图内容，没有任何空白边框或局部缺失，完全达到真机视觉验收标准。

---

## 3. 移动端视口 (390×844) 精确测绘与 BoundingBox 数据 (Mobile Viewport & Layout Metrics)

基于 `ego-browser 0.5.1.13` (Chromium 152.0.7977.54, TaskSpace `108`) 在 390×844 (DPR 3) 视口下实测：

### 3.1 视口与横滚检测
- **视口配置**: 390 CSS px × 844 CSS px, DPR = 3 (对应真实物理像素 1170×2532 px)
- **文档与 Body 测绘**:
  - `docClientWidth`: 390px, `docScrollWidth`: 390px
  - `bodyClientWidth`: 390px, `bodyScrollWidth`: 390px
  - **水平溢出**: 0 像素横向滚动，`hasHorizontalOverflow: false`，手机屏幕无左右晃动。

### 3.2 真实 BoundingBox 指标 (实测数据)
| 页面 / 元素 | BBox 坐标 (x, y) | 渲染尺寸 (width × height) | 原始尺寸 (naturalWidth × naturalHeight) | 格式与当前源 |
| :--- | :--- | :--- | :--- | :--- |
| **EN Figure 容器** | (16.0px, 263.51px) | 358.0px × 316.77px | - | 左右留白各 16px，居中 |
| **EN `<img>` 元素** | (16.0px, 263.51px) | 358.0px × 201.375px | 1672px × 941px | `how-to-harvest-stardew-valley-en-methods.avif` |
| **EN `<figcaption>`** | (16.0px, 464.88px) | 358.0px × 105.0px | - | 文本完整，高度适配 |
| **ZH Figure 容器** | (16.0px, 274.15px) | 358.0px × 295.77px | - | 左右留白各 16px，居中 |
| **ZH `<img>` 元素** | (16.0px, 274.15px) | 358.0px × 201.375px | 1672px × 941px | `how-to-harvest-stardew-valley-zh-methods.avif` |
| **ZH `<figcaption>`** | (16.0px, 475.52px) | 358.0px × 84.0px | - | 文本完整，高度适配 |

---

## 4. 中文插图 22 处文字节点逐项可读性实测评估 (22 Labels Legibility Audit)

### 4.1 缩放系数与物理像素推导
- **缩放系数**: $\text{Scale Factor} = 358 / 1672 \approx 0.2141$ (约 1 : 4.67)。
- **逻辑 CSS 字号**:
  - 主标题 (SVG 52-56px) 对应 $11.1 - 12.0 \text{ CSS px}$。
  - 次级说明与标签 (SVG 48px) 对应 $10.28 \text{ CSS px}$。
- **Retina 屏物理像素**:
  - 主标题对应 $33.4 - 36.0 \text{ physical pixels}$。
  - 次级说明对应 $30.8 \text{ physical pixels}$。

### 4.2 中文插图 22 个标签逐项视觉审核表 (在 `zh-mobile-viewport-after-paint.png` 中实测)
| 序号 | 标签文本内容 | 区域分类 | 渲染字号 (CSS / 物理) | 视觉对比度与清晰度判定 | 可读性结论 |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | `农作物收获方式` | 顶部标题横幅 | ~12.0px / ~36px | 深青色背景 + 白色无衬线文字，高对比度 | **清晰可读** |
| 2 | `徒手采摘` | 左列模块主标题 | ~11.1px / ~33px | 深色背景 + 浅绿色加粗文字，轮廓鲜明 | **清晰可读** |
| 3 | `防风草` | 左列重点作物 | ~11.1px / ~33px | 白色粗体，字符结构饱满 | **清晰可读** |
| 4 | `检查 / 执行操作` | 左列操作说明 | ~10.3px / ~31px | 浅灰色文字，斜杠与汉字间距清晰 | **清晰可读** |
| 5 | `右键或 X` | 左列主键高亮胶囊 | ~11.1px / ~33px | 绿色胶囊背景 + 白色粗体，极高对比度 | **清晰可读** |
| 6 | `按住收获脚下格` | 左列滚行动作提示 | ~10.3px / ~31px | 浅色文字，笔画完整无黏连 | **清晰可读** |
| 7 | `镰刀挥击` | 右列模块主标题 | ~11.1px / ~33px | 深色背景 + 亮青蓝色加粗文字，轮廓分明 | **清晰可读** |
| 8 | `羽衣甘蓝、小麦、苋菜` | 右列作物清单行 1 | ~10.3px / ~31px | 白字，顿号及“苋菜”等复杂汉字笔画清晰可辨 | **清晰可读** |
| 9 | `未碾米、纤维` | 右列作物清单行 2 | ~10.3px / ~31px | 白字，顿号及汉字完整呈现 | **清晰可读** |
| 10 | `左键或 C` | 右列主键高亮胶囊 | ~11.1px / ~33px | 蓝色胶囊背景 + 白色粗体，极高对比度 | **清晰可读** |
| 11 | `1.6 铱镰刀：耕地收获` | 右列 1.6 版本特性提示 | ~10.3px / ~31px | 亮金黄色提示文字，冒号与字符对比强烈 | **清晰可读** |
| 12 | `巨大作物` | 底栏卡片 1 标题 | ~11.1px / ~33px | 紫色卡片背景 + 白色粗体 | **清晰可读** |
| 13 | `斧头砍 3 下` | 底栏卡片 1 操作 | ~10.3px / ~31px | 白字加粗，数字“3”与汉字清晰 | **清晰可读** |
| 14 | `掉落 15–21 个，换季不枯` | 底栏卡片 1 规则 | ~9.8px / ~29px | 范围连接号“–”与数字汉字清晰，无字符重叠 | **清晰可读** |
| 15 | `棚架` | 底栏卡片 2 标题 | ~11.1px / ~33px | 蓝色卡片背景 + 白色粗体 | **清晰可读** |
| 16 | `青豆、啤酒花` | 底栏卡片 2 作物行 1 | ~10.3px / ~31px | 白字，顿号间隔明确 | **清晰可读** |
| 17 | `葡萄` | 底栏卡片 2 作物行 2 | ~10.3px / ~31px | 白字，字符结构完整 | **清晰可读** |
| 18 | `通道被阻挡` | 底栏卡片 2 规则警告 | ~10.3px / ~31px | 白字，警示文字清晰 | **清晰可读** |
| 19 | `第 28 天` | 底栏卡片 3 标题 | ~11.1px / ~33px | 玫紫卡片背景 + 白色粗体 | **清晰可读** |
| 20 | `过季即枯萎` | 底栏卡片 3 换季规则 | ~10.3px / ~31px | 白字加粗，重点明确 | **清晰可读** |
| 21 | `温室` | 底栏卡片 3 例外标题 | ~11.1px / ~33px | 白字加粗，层级分明 | **清晰可读** |
| 22 | `全年可种` | 底栏卡片 3 例外规则 | ~10.3px / ~31px | 白字，字符紧凑但无锯齿形变 | **清晰可读** |

### 4.3 英文插图对应标签核验
英文方法插图 (`en-mobile-viewport-after-paint.png`) 中的 22 个对应英文标签（如 `CROP HARVEST METHODS`, `HAND HARVEST`, `SCYTHE SWING`, `Right-Click or X`, `Left-Click or C`, `GIANT CROP`, `TRELLIS`, `DAY 28` 等）同样在 390 视口下完整渲染，大写标题视觉层级鲜明，无任何文字截断。

### 4.4 可读性双重保障分析
1. **Retina 屏表现**: 在 DPR 3 设备像素密度下，每个汉字高度约为 31-36 物理像素，足以精准勾勒汉字笔画骨架（即使是“苋”、“碾”、“萎”等笔画繁多的字，在真机渲染上亦无糊死现象）。
2. **图注 100% 文本兜底保障**:
   - 插图下方直接附带结构化 `<figcaption>` 文本。
   - 中文图注：`"示意图：星露谷物语农作物收获方式，包括防风草使用右键或 X 键，羽衣甘蓝、小麦、苋菜、未碾米与纤维使用镰刀挥击，以及巨大作物使用斧头、阻挡通行的棚架与第 28 天换季规则。"`
   - 英文图注：`"Schematic: Stardew Valley crop harvest methods, with Right-Click or X for a parsnip, a scythe swing for kale, wheat, amaranth, unmilled rice, and fiber, plus an axe for giant crops, blocked trellises, and the day-28 season change."`
   - 形成图文双通道信息传递，完全满足现代 Web 无障碍 (Accessibility) 与移动适读规范。

---

## 5. G 角色测试契约变更只读审查 (Read-Only Review of Direct Test Contract Deltas)

依据协调员指示，对 G 角色经 Root 授权修改的两处直接测试契约文件进行了只读审查（Diff 已验证）：

### 5.1 `tests/blog/blog-components.test.tsx`
- **修改内容**:
  - 将第 2 页的分页 Next 元素断言由 `>Next</span>` 改为 `href="/blog?page=3#topic-carousel">Next</a>`。
  - 新增对第 3 页（最后一页）的渲染测试：断言包含指向第 2 页的 Previous 链接、disabled 的 `>Next</span>` 以及 `aria-current="page" href="/blog?page=3#topic-carousel">3</a>`。
- **审查评估**:
  - **合理性**: 本次新增第 25 篇博客文章后，分页总数从 2 页自然扩展为 3 页。该变更真实反映了分页业务变化。
  - **严谨性**: 采用正向渲染与显式 DOM 断言，未删除旧有第 1/2 页的逻辑，契约完备严密。

### 5.2 `tests/blog/blog-planner-cta.test.tsx`
- **修改内容**:
  - 新增专用断言函数 `expectHarvestArticleKeepsInlinePlannerLink(locale, markup)`。
  - 显式断言 `how-to-harvest-stardew-valley` 文章：
    1. 不包含自动插入的 Planner CTA (`ctaMatches.length === 0`)。
    2. 不包含任何 `blog-sources` 容器 (`markup.indexOf('class="blog-sources"') === -1`)。
    3. 全文超链接数严格等于 18 (`hrefCount === 18`)。
    4. 保留原文正文中的内联规划器链接 (`href="https://stardewvalleyplanner.art"`)。
    5. 保留 Steam 讨论区与 Wiki 温室权威链接。
    6. EN 语言保留 2 个英文站内推荐链接且不含 `/#planner`；ZH-CN 语言保留 2 个中文站内推荐链接且不含 `/zh#planner`。
  - 其余 24 篇带有 Sources 的既有文章继续沿用 `expectSourcedArticlePlannerCta`。
- **审查评估**:
  - **Fail Fast 原则**: 明确针对 harvest 文章的特殊排版契约进行正向强校验，如果出现漏链接、多 CTA 或误插 Sources 会立即失败并报错。
  - **高内聚低耦合**: 未使用宽松的 `skip` 或直接删除旧 24 篇断言，既保护了旧文章契约，又精确锁定了 harvest 的纯正度契约。

---

## 6. 语言切换器真实点击双向交互测试 (Language Switcher Live Click Navigation)

使用 `ego-browser` 在移动视口下真实触发 DOM 点击事件流测试：
1. **EN -> ZH 路由切换**:
   - 起始: `http://127.0.0.1:3004/how-to-harvest-stardew-valley`
   - 操作: 点击 `button[data-homepage-language-trigger="true"]` -> 点击 `a[data-homepage-language-option="true"][href="/zh/how-to-harvest-stardew-valley"]`
   - 结果: 成功跳转至 `/zh/how-to-harvest-stardew-valley`，无 404、无重定向死循环。
2. **ZH -> EN 路由切换**:
   - 起始: `http://127.0.0.1:3004/zh/how-to-harvest-stardew-valley`
   - 操作: 点击 `button[data-homepage-language-trigger="true"]` -> 点击 `a[data-homepage-language-option="true"][href="/how-to-harvest-stardew-valley"]`
   - 结果: 成功跳转回 `/how-to-harvest-stardew-valley`，双向切换完全通畅。

---

## 7. 产出物与证据索引 (Artifacts & Evidence Index)

| 证据类别 | 文件路径 | 状态 / 说明 |
| :--- | :--- | :--- |
| **测绘数据 JSON** | `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/v2/mobile-bbox-metrics.json` | 包含 DOM BoundingBox、自然尺寸、导航结果的原生 JSON 数据 |
| **EN 绘制后视口截图** | `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/v2/en-mobile-viewport-after-paint.png` | 390×844 视口下滚动居中且绘制完成的原生截图 (111 KB) |
| **ZH 绘制后视口截图** | `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/v2/zh-mobile-viewport-after-paint.png` | 390×844 视口下滚动居中且绘制完成的原生截图 (146 KB) |
| **历史 v1 审计报告** | `docs/blog-ops/how-to-harvest-stardew-valley/reviews/E-page-review.md` | 初始四全页与元数据独立审核报告 (完整归档未覆盖) |
| **历史 v1 截图与索引** | `docs/blog-ops/how-to-harvest-stardew-valley/reviews/screenshots/*.png` | 四视图全页截图与 audit-results.json (完整保留未覆盖) |

---

## 8. 诚实边界与免责声明 (Truthful Boundaries & Disclaimer)

1. **测试与编译证据说明**:
   - 在 v1 审核阶段已由 E 独立验证 `vitest` (3 个测试文件，40 项测试全部通过) 与 `tsc --noEmit` (0 错误)。
   - 本阶段审查严格遵守只读原则，未在共享工作树中擅自清理 `.next` 或重启服务。
   - 生产环境构建 `pnpm build` 因 macOS 本地 Turbopack 符号链接限制，统一交由实现者 Role G 在后续收官中验收。
2. **用户终审待审**:
   - 本报告代表 Role E2 独立完成的技术端与视觉端验收 (Technical Acceptance)。
   - **用户终审 (User Final Acceptance) 尚未进行**。本审核不替代用户的最终主观批准。
3. **审核裁决**:
   - **PASS (完全通过)**。
