# Stardew Planner 全站中英双语设计

## 状态

用户已确认。实施必须遵循对应的实施计划、TDD 和分任务审查流程。

## 目标与范围

在保持纯静态 Next.js App Router 导出的前提下，将产品改为真实双语：

- 英文是默认语言，使用无前缀 URL。
- 简体中文使用 `/zh` 前缀。
- 页面、规划器、模态框、目录、可访问性标签、通知、公开内容、元数据和站点地图均提供中英文内容。
- 已有浏览器本地项目按严格、非破坏性规则迁移到原生 React 项目存储。

正式 SEO 域名是 `https://stardewvalleyplanner.art`。不生成 `/en`，不做基于 Cookie、IP 或 `Accept-Language` 的自动跳转。

## URL 合约

| 页面 | 英文 URL | 简体中文 URL |
| --- | --- | --- |
| Planner | `/` | `/zh` |
| Farm Comparison | `/farm-comparison` | `/zh/farm-comparison` |
| Farm Guide | `/farm/[type]` | `/zh/farm/[type]` |
| Mods | `/mods` | `/zh/mods` |
| Privacy | `/privacy` | `/zh/privacy` |
| Terms | `/terms` | `/zh/terms` |

英文既有 URL 保持可访问且使用英文 self-canonical。中文 URL 使用中文 self-canonical。每页互相声明 `en`、`zh-CN` 与指向英文 URL 的 `x-default` alternate。`farmType` 等规划器查询参数只表达 UI 状态，不进入 canonical URL。

## 静态路由和 next-intl 边界

项目继续使用 `output: "export"`。因此不使用 `proxy.ts`、middleware、`defineRouting`、`createMiddleware`、`localePrefix`、`pathnames` 或请求期 locale 检测。

路由通过两个物理静态树生成：

```text
app/
  (en)/
    layout.tsx
    page.tsx
    farm-comparison/page.tsx
    farm/[type]/page.tsx
    mods/page.tsx
    privacy/page.tsx
    terms/page.tsx
  zh/
    layout.tsx
    page.tsx
    farm-comparison/page.tsx
    farm/[type]/page.tsx
    mods/page.tsx
    privacy/page.tsx
    terms/page.tsx
  robots.ts
  sitemap.ts
```

`(en)` 是不进入 URL 的 route group，`zh` 是真实路径段。两个 root layout 分别输出 `lang="en"` 和 `lang="zh-CN"`，并以显式 locale 和 messages 包裹 `NextIntlClientProvider`。

next-intl 只承担消息加载、`NextIntlClientProvider`、`useTranslations` 和显式 locale 的 `createTranslator`。Server Component 与 metadata 不从 headers、cookies 或 request config 推导语言。

`src/i18n/` 只提供四类清晰接口：

- locale 定义：URL 前缀、`htmlLang` 和 `hrefLang`。
- messages 加载与 key 一致性校验。
- 接收 canonical path、locale、search 和 hash 的 `getLocalizedPath`。
- `LanguageSwitcher` 与 locale-aware link 组件。

未知 path 或未知 locale 立即抛出带实际值的错误。语言切换保留当前页面、farm slug、query 和 hash；跨 root layout 的完整页面加载是可接受且预期的行为。

## 原生 React 页面与规划器

当前生产页面仅启动冻结 Svelte runtime。该 runtime 不能识别 `/zh`，也不能由 next-intl 翻译，因此所有生产路由改为原生 React 页面。

现有 Pixi/TMX 画布、放置/填充/擦除/选择/历史控制器、项目存储、导入导出、内装、目录、汇总和面板组件保持为可复用的领域模块。新增一个客户端 `PlannerWorkspace`，只负责编排：

- 当前地图、季节、编辑工具、modal、选区、历史和显示设置的 React 状态。
- canvas grid/exporter 生命周期和现有纯 controller 的回调调度。
- 本地项目、多地图实例、保存、导入、导出和迁移结果的调用。
- 为现有展示组件提供已本地化的展示值和回调。

领域控制器、存储 schema、地图 ID、TMX 文件名、资产路径和用户输入不接收 locale。各展示组件不得自行读 localStorage；各展示组件也不得自行推导路由。

公开页面复用现有 comparison、farm-guide 和 mods 组件，但通过共享 public-page layout、本地化内容和 locale-aware links 渲染。Privacy 与 Terms 改为原生本地化内容源，继续表达本产品的浏览器本地、无登录、无云同步与无支付边界。

冻结 Svelte runtime 与锁定资源不删除、不修改，也不再从页面启动。锁定的游戏地图和精灵资源继续供原生 Pixi renderer 使用；冻结 runtime 仅保留为资产与回归夹具。

## 文案与展示数据

`messages/en.json` 与 `messages/zh-CN.json` 包含 UI、aria label、title、通知、帮助、公开页和 SEO 文案。两个文件必须有完全相同的 key 集合。

地图、农场、Mod 和 catalog 的稳定 ID 保持英文不变。新增展示层覆盖表，按稳定 ID 映射本地化标题、说明和 catalog 显示名；绝不修改 sprite、asset path、mapFile 或存档字段。用户输入的项目名和地图实例名保持原样。

不直接把内部 `Error.message` 作为用户文案。每个 UI 边界把已知错误转换为本地化、包含必要实际值的错误信息；未知异常继续抛出并显示本地化的操作失败摘要。

## 本地项目迁移

冻结 runtime 的项目 key 为 `stardewplan-reference-local-projects-v1`；原生项目目标 key 为 `stardew-planner.local-projects.v2`。两者 schema 不同，不能共用或就地改写。

新增独立纯转换器，并在 native planner 启动时按以下顺序调用：

1. 如果 V2 key 已存在，只读取并使用 V2；绝不读取或修改旧 key。
2. 如果 V2 key 不存在，读取并严格解析旧 key。
3. 转换器先在内存中转换全部项目、地图实例、placement state、decor 和可映射的 farmhouse renovations。
4. 完整验证每个目标 V2 项目和最终集合后，单次写入 V2 key。
5. 永不删除、覆盖或重写旧 key。

转换不能保真的任一字段都会使整个迁移失败：例如目标不支持的 source building `waterColor`、`variant`、`locked`，未映射 held item、未知 mapFile、非法 tint、超出目标标题限制、空项目、无效 renovation 或目标 schema 不支持的状态。失败时 V2 key 保持不存在，旧 key 保持原样，并向用户显示本地化且包含具体不兼容值的迁移错误。绝不部分迁移、截断名称、丢弃字段或猜测转换。

catalog ID 的转换必须使用仓库内版本锁定、人工可审查的 source-to-target mapping manifest；不能根据字符串前缀临时推断。转换器只接受 manifest 中声明且可由目标 catalog 验证的映射。所有 V2 必填 item 状态必须已经在 source entry 中完整存在；不得补默认值。该策略是严格的兼容子集迁移：旧集合内任一项目不符合兼容门槛，整个集合都不迁移。

mapping manifest 覆盖所有能由锁定 frozen runtime 行为和锁定目标 catalog 明确交叉验证的地图与条目；不以少量示例作为产品支持范围。无法建立这类双重证据的 source ID 继续 fail-closed。

可映射的 3 通道建筑油漆先通过纯 HSL-to-hex 转换器转为目标 `paintColors`。允许映射的 `FarmHouse2` renovations 必须在明确映射表中、无重复且满足目标依赖关系。

## SEO

所有页面 metadata 由 locale 与 canonical path 的纯函数生成，包含 self canonical、alternate languages、Open Graph URL 和本地化 title/description。`app/sitemap.ts` 输出 13 个逻辑页面乘以两种语言的 26 个 URL，并为每项输出相同的语言 alternates。`app/robots.ts` 允许抓取并声明 sitemap 与正式 apex host。

根域、`www` 或历史域名到正式域名的 HTTP 301 不属于静态 Next.js 导出；由部署平台配置。应用内不为现有英文路径生成 `/en` 重定向。

## 不做的事

- 不新增后端、数据库、认证、支付、云同步、分享或第三方运行时 API。
- 不删除 frozen runtime 或锁定资源。
- 不迁移无法完整保真的旧项目。
- 不翻译用户输入、稳定 IDs、mapFile、TMX、JSON schema 或资产路径。
- 不提交、推送或部署。

## 验证

1. i18n 单元测试：路径映射、query/hash 保留、未知输入 fail-fast、双语 messages key 对齐。
2. metadata 和 sitemap/robots 测试：self canonical、`en`/`zh-CN`/`x-default` alternates、26 个 URL。
3. 路由和静态导出测试：所有英文旧路径与中文新路径存在，绝不生成 `/en`，`lang`、正文和 metadata 真实匹配语言。
4. planner 测试：地图/季节、catalog、放置、填充、擦除、选择、撤销重做、导入导出、PNG、汇总和本地项目不回归。
5. 迁移测试：全量成功、V2 已存在、解析失败、单字段不兼容、目标写入失败、旧 key 永远不变、没有部分写入。
6. 执行 `pnpm typecheck`、`pnpm test --run`、`pnpm build`；对 `/`、`/zh`、英文/中文 farm guide、语言切换和项目生命周期进行本地浏览器验证。
