# Technical SEO Two-Phase Design

## Goal

分两阶段改善 Stardew Valley Planner 的技术 SEO：第一阶段固定用户选择的博客索引合约并加入生产检查工具；第二阶段先测量，再优化已验证的性能和移动端触控问题。

## Confirmed indexing contract

- `/blog`、`/blog/archive`、两篇英文文章及其四个中文对应页面，共 8 个博客 URL，全部输出 `noindex, follow`。
- 上述 8 个博客 URL 不进入 `sitemap.xml`；双语 Contact 页同样不进入 sitemap。当前 sitemap 只包含 6 个可索引的双语公开 URL。
- 博客页面保持可访问、可抓取，并保留 self canonical、`en` / `zh-CN` / `x-default` hreflang、Open Graph、Twitter metadata 和现有 JSON-LD。
- `robots.txt` 继续允许抓取，不对博客路径添加 `Disallow`。

实现和生产检查必须保持 sitemap 与页面 robots metadata 一致，不得把 noindex URL 放入 sitemap。

## Phase 1 architecture

### Blog metadata contract

两个动态文章路由的 robots metadata 与博客首页和归档保持一致；路由注册表统一负责标记 noindex 路由，sitemap 只消费可索引路由。

### Production SEO smoke tool

新增一个不依赖第三方包的 Node.js ESM 工具。CLI 只负责读取 `--origin`、调用检查器、打印结果并在失败时退出非零；契约文件只负责声明路径和预期；检查函数只负责网络请求与断言。测试通过注入 `fetch` 替身运行，不访问生产网络，普通 `pnpm test` 不会触发真实生产检查。

生产检查覆盖：HTTP 到 HTTPS 单跳、HTML 状态与 Content-Type、canonical、robots、hreflang、6 条可索引 sitemap URL、8 个博客 `noindex, follow`、HTML 404、主要安全头，以及基础缓存响应。检查只报告事实，不修改 Cloudflare。

### Cloudflare runbook

仓库内新增人工操作清单，明确当前 contact Worker 只负责 `/api/contact*`，不得扩展成全站 Worker。清单覆盖 Always Use HTTPS、响应头、CSP Report-Only、静态 HTML 404、尾斜杠和缓存，并提供部署后验证命令。本任务不登录、不修改、不部署 Cloudflare。

## Phase 2 architecture

第二阶段先使用现有生产构建、CDP 性能测量脚本和桌面/390x844 移动视口建立基线。只有证据确认图片、初始 JavaScript、长任务或触控目标存在问题时才修改对应边界。

- 图片优化保持尺寸和视觉质量，优先复用现有 WebP 工具链，不引入依赖。
- JavaScript 优化只处理测量确认的具体非必要请求或执行瓶颈，不根据 `next/dynamic` 等结构做推断。
- 移动端仅扩大实际点击区域，保持图标视觉尺寸、布局和现有交互语义。
- UI 修改必须通过本地 production build、浏览器桌面和 390x844 移动验收。

## Scope exclusions

- 不修改博客正文、作者、日期、Article Schema 或内容 SEO。
- 不修改 GA、Clarity、隐私政策或同意机制。
- 不修改冻结的 `public/_app/**`、`public/reference-runtime/**` 或 `src/reference-runtime/**`。
- 不安装依赖，不提交 commit，不推送，不部署。
- 不操作 Cloudflare 控制台或 API。

## Engineering constraints

- 高内聚、低耦合；每个模块和函数只有一个明确职责。
- 模块通过导出的接口通信，不读取彼此内部状态。
- KISS、Fail Fast、YAGNI；错误必须包含 URL、检查项和实际值，不静默吞错。
- 变量名精确表达内容，禁止 `data`、`temp`、`helper`、`util`、`manager` 等泛化名称。
- 所有行为修改先写失败测试并验证 RED，再写最小实现验证 GREEN。

## Verification boundary

本地测试和构建只能证明仓库合约。生产 smoke 在 Cloudflare 尚未人工配置时允许失败；失败输出是外部待办证据，不能被描述为生产修复完成。
