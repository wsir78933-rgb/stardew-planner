# 页面验收：house-upgrade-stardew pixel-v2

ego task space `181`，page `p1`。3010 是 pid 21887，cwd 为本工作树，`serve out`，进程 10-16 23:12 启动，未重启。`out/house-upgrade-stardew.html` mtime `2026-10-17T09:14:25`。范围拆分前已拍完 4 视口；拆分后不再新增 ZH 截图。ZH 字节复读留给 `reviews/pages-zh`。

## 命令退出码

1. 四视口捕获 exit 1：12 张截图已写入后，`a[href="/zh/house-upgrade-stardew"]` 等待可见超时。
2. 直接点该链接 exit 1：匹配 1 个，rect 为 0×0，hidden/inert。
3. 未先回到 EN 就点 `button[aria-label="Language"]` exit 1：当时 URL 已是 `/zh/...`，按钮 `aria-label` 为 `语言`，匹配 0。
4. 打开 Language 菜单做 EN→ZH→EN、点页头 Blog、EN 六文件 `cache:"reload"` exit 0。

## 四视口（原始记录在 checks.partial.json）

| 视口 | URL | status | 内尺寸 |
| --- | --- | --- | --- |
| en-1280x800 | /house-upgrade-stardew | 200 | 1280×800 |
| en-390x844 | /house-upgrade-stardew | 200 | 390×844 |
| zh-1280x800 | /zh/house-upgrade-stardew | 200 | 1280×800 |
| zh-390x844 | /zh/house-upgrade-stardew | 200 | 390×844 |

12/12 图 `complete`、`decode.ok`、`naturalWidth` 1672、`naturalHeight` 941、可见比例 1。`currentSrc` 全是对应 AVIF，页面网络响应 HTTP 200，`fromCache` false。`object-fit: cover`，等比缩放。桌面 cropY 0.0020–0.0027，手机 cropY 0.0068，未见关键裁切或拉伸。截图均为无字像素场景：农舍、厨房/双人床/婴儿床+两张单人床、木架举锤。Title、H1、description 4/4 与 handoff 一致。alt 12/12 一致。正文两张图注 8/8 一致。封面四视口 `figcaption` 为空，正文也不含 handoff 封面图注句。

文档 `scrollWidth === clientWidth`（4/4）。手机价格表在 `.blog-table-scroll` 内，`scrollLeft` 0→252，`overflow-x: auto`。表体超出视口是该滚动容器，不是页面新增横向滚动。

## EN 六文件回读（exit 0）

全部 status 200，字节与 sha256 对齐 AssemblyManifest `07fa31cc…`：

- cover webp `d58aaaf3…` 2550052
- cover avif `8c0da21d…` 653604
- tier-rooms webp `9f806c5c…` 1984240
- tier-rooms avif `e2578074…` 446411
- construction webp `526a5afa…` 2453712
- construction avif `c5c957be…` 617005

浏览器页面请求只拉了 AVIF。WebP 是这次 `cache:"reload"` 回读，不是页面自动请求。

## 交互与控制台

Language 菜单：EN 200 → `/zh/house-upgrade-stardew` 200（中文 Title/H1）→ EN 200。页头 `a[aria-label="Blog"]` → `/blog` 200，H1 `Stardew Valley Planning Guides`。

页面网络失败 0。EN 首屏有 1 条 `chrome-untrusted://new-tab-page/one-google-bar` `ERR_ABORTED`，不是页面资源，也不是 GA。控制台是 `[AutoComment] 独立导出外链浮窗按钮已注入` 与一条 Chrome Built-In AI info，无 `pageerror`。`导出外链` 按钮不在 article 内，是外部注入；手机截图里它盖住目录/正文，未改产品 CSS。

## 未覆盖

ZH 12 个路径没有做拆分后的 reload 内容哈希。en-1280 有 1 次 `requestServedFromCache`，URL 未留在原始摘要里；三张 AVIF 记录为非缓存。未跑 typecheck/build/全站，未宣称部署或审美通过。Ego Lite 0.5.1.13 提示可升级，未执行升级。

## 截图

`docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/reviews/pages/screenshots/` 下 `en-1280x800-cover.png`、`en-1280x800-interior.png`、`en-1280x800-construction.png`、`en-390x844-cover.png`、`en-390x844-interior.png`、`en-390x844-construction.png`，以及同名 `zh-1280x800-*`、`zh-390x844-*` 各 3 张。时间 2026-10-17 09:22。
