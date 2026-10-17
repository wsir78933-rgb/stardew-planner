# house-upgrade 像素替换前基线

这是替换前的可恢复前态。它不审核、也不批准即将换上的无字像素图。

## 结果

- 已复制 19 个源文件，相对路径保存在本目录下。每个副本的 sha256 与源文件相同，`cmp -s` 退出码都是 0。
- registry `src/blog/blog-post-registry.tsx` 没有整文件复制。两条 `house-upgrade-stardew` 原始字段在 `registry/`。整文件 sha256 是 `e2696eb7e2473ea74a19dd9c552db732115e2da26be458bcd9af3c971317ac15`，字节数 49531。
- 比较基线在 `comparison/`。源正文没有改。
- 记录时间：2026-10-17T00:28:50Z。HEAD：`bf91a14829067ed1c9c2a206a97985e17dbebdda`。分支：`博客-2`。

## 源文件

| 相对路径 | 字节 | sha256 |
| --- | ---: | --- |
| `public/blog/house-upgrade-stardew-cover.webp` | 72418 | `c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342` |
| `public/blog/house-upgrade-stardew-cover.avif` | 39621 | `f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113` |
| `public/blog/house-upgrade-stardew-cover-zh.webp` | 63012 | `bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87` |
| `public/blog/house-upgrade-stardew-cover-zh.avif` | 34529 | `7e00232440ac66f410e791a9f472f3fdb2b74242cc1a7d0a35e43e8e8d438926` |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` | 70092 | `c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209` |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif` | 38764 | `8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b` |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp` | 58666 | `d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c` |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif` | 31242 | `aabe93337712ce9de18a94faad5b3582cfeba8d62a7cd59b3a6962218e2c0aad` |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` | 68194 | `040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b` |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif` | 36133 | `1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426` |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp` | 60854 | `6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88` |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif` | 32235 | `d8cde3529f897d5d5fe2b4b734e7182eb2eb000c19d3dc07dccd1ba5159f2b84` |
| `src/blog/articles/house-upgrade-stardew.en.tsx` | 15846 | `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5` |
| `src/blog/articles/house-upgrade-stardew.zh.tsx` | 14218 | `2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba` |
| `docs/blog-ops/house-upgrade-stardew/handoff/public/en.json` | 27784 | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` |
| `docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json` | 27432 | `0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c` |
| `docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json` | 20147 | `6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/body.md` | 10046 | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md` | 9797 | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` |

## 图片

`file` 和 `sips` 都能读这 12 个 WebP/AVIF。没有做预览转换，没有删除文件，没有使用 /tmp。

| 相对路径 | sips format | 尺寸 | sips 退出码 |
| --- | --- | --- | ---: |
| `public/blog/house-upgrade-stardew-cover.webp` | webp | 1672×941 | 0 |
| `public/blog/house-upgrade-stardew-cover.avif` | avif | 1672×941 | 0 |
| `public/blog/house-upgrade-stardew-cover-zh.webp` | webp | 1672×941 | 0 |
| `public/blog/house-upgrade-stardew-cover-zh.avif` | avif | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` | webp | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif` | avif | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp` | webp | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif` | avif | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` | webp | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif` | avif | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp` | webp | 1672×941 | 0 |
| `public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif` | avif | 1672×941 | 0 |

当前 12 个公共文件的 sha256、字节数和 1672×941 尺寸，与 AssemblyManifest.media 记录值相同。
registry 整文件 sha256 与 AssemblyManifest.ownedOutputSha256 里的记录值相同。
上面两句只说明当前字节和当时记录的字节相同，不是对新像素图的质量审核。

## 比较基线

普通正文是 lock/en/body.md 和 content/zh/draft-zh-v2.md。两份 handoff 的 `body` 字段与这两份文件相等；handoff 副本仍是全文，含 alt、caption 和标记句。

英文删掉第 43 行末句 `On the room figure, the Nursery label is this crib room.`，以及第 45–47 行和第 63–65 行的两对 alt/caption。
中文删掉第 43 行末句 `房间图上的「育儿室」标的就是这间有婴儿床的房间。`，以及第 45–47 行和第 63–65 行的两对 alt/caption。
标题里的 nursery / 育儿室 保留。精确片段、空行处理和保留段落见 `comparison/exclusions.md`。

## 环境

- node_modules -> `/Users/wusir/Desktop/开发项目集合/stardew planner/node_modules`，目标目录存在：True。
- next-env.d.ts sha256 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，字节数 296。文件没有复制。
- 3010 监听是只读记录，没有启动或停止进程。
- PID 21887
- argv: `node ./node_modules/.bin/../.pnpm/serve@14.2.6/node_modules/serve/build/main.js out -l tcp://127.0.0.1:3010 --no-port-switching --no-clipboard`
- cwd: `/Users/wusir/orca/workspaces/stardew planner/博客-2`

## 范围

写入只在本 baseline 目录。git status 的新增行必须都以 `?? docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/` 开头。证据在 checks.log。

没有运行测试、构建，没有改 public、source、handoff 或原报告，没有提交、安装依赖或新建工作树。
