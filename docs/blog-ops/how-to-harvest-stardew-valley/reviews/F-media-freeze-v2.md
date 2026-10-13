# F 媒体版本再绑定：how to harvest stardew valley

- 角色：F。没有兼任 C、E、T、M、G。
- 任务 `task_a97a878a31bf`，Dispatch `ctx_29427e657e2a`。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树。隔离只是目录约定。
- 这一步只改 `handoffs/public-blog-handoff-zh.json` 的两处中文插图哈希和 `integrity.digest`，并新建本报告。没有改英文交接、锁定正文、SEO 文字、引用、原始 SVG、公开图片或 `reviews/F-public-freeze.md`。

## 范围

M 已结算：任务 `task_36434fd81bde`，Dispatch `ctx_e40d02aea69d`，`worker_done` `msg_55ded40675ac`，outcome succeeded。主脑消息 `msg_f4fa51ff1daa` 确认已读 `media/final-report.md` 和六份文件哈希。本报告不把文件存在当成结算依据。

这是公开资源版本绑定。正文、图意和 3/3 预算都不重开。用户终审没有开始。页面没有装配，G 任务 `task_3508384dd30b` 还没派发。

## 前后哈希

| 文件 | 更新前 SHA-256 | 更新后 SHA-256 |
|---|---|---|
| `handoffs/public-blog-handoff-zh.json` | `fc8343c008ca4ec39632ea29c43c7d05c0bc26df872071b26848d3576cb97d7d` | `3debdcefc4bb9e7217bd43e1fdb3484d1b7ef5e3418b073d6ec308e4ef7034de` |
| 该文件 integrity digest | `9a39e281a3d7c7dc37545906dbd5a733cac4c3137ef055ff1b275b6f302ad592` | `cf037ddc15bd0c601c9b5209226fd530c9745cc319ea8d2655874aca9393ad76` |

中文插图 WebP 从 `e1689bd5bedbd85c25270cb5c92242c59dd2fa260bf5fcf4fca2d6bff242d52b` 改为 `450f78bb5aefcc6dda6826cb9fcda8a2af45f9778e077b49012596dbb38394f2`。AVIF 从 `aefe51f9b7fc977c734937c03b016ae6d6ddefbdec78ec3dd46c722214266192` 改为 `d918433c39793cf8f455281b4ba4606749eff17d68d7c6d682183f07f5e33d6a`。公开路径仍是 `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` 和同名 `.avif`。宽高仍是 1672×941。

解析后的 JSON 只变了三个字段：`publicRequirements.figures[0].sha256`、`publicRequirements.figures[0].avifSha256`、`integrity.digest`。`bodyHash` 仍是 `ec8b60fc7e99ac1c18b566bdd3594edc29f524d5cc6d3470625ef506f772c024`。`sourceEnglishBodyHash` 仍是 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`。18 条 quote 各出现 1 次。

英文交接文件 SHA-256 仍是 `8ed90bfab4dbdd4158ae2b0fe38e5f380f3922d2d1922b3ae5142017c51ee2c9`，其封面和英文插图哈希已与当前六文件一致，所以没有改。`reviews/F-public-freeze.md` 仍是 `e88848969654cfa12cbee3aecbdc48fcf02e87c5615a69eb36d208598e96446e`。

## 六份当前资源

对照 `media/final-manifest.json` `46052a8fb71df1670982203c612238e16333bde5eecdf5a6ecc12443019bbace` 与 `media/final-report.md` `42291eed26e9f7237683b67107076bf14b74d8673ff5a92d3bd9248fc754c19c`。六份公开文件都独立重算通过，每个 `ffprobe` 视频流都是 1 条、1672×941：

| 公开路径 | 格式 | 字节 | SHA-256 |
|---|---|---:|---|
| `/blog/how-to-harvest-stardew-valley-cover.webp` | WebP | 38974 | `8558f5b08e0c3e890ceddfcffb7104ed0a0fb0380dedec4108beed46220b81d8` |
| `/blog/how-to-harvest-stardew-valley-cover.avif` | AVIF | 17525 | `ccd28749dfd7047666d8bcbf8410aa929a060e660cc882d3814ef74d6dec19cd` |
| `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` | WebP | 99024 | `c5d987fdd4c2d1799358baf987ee31a5b7a9d90b5933c7e3fc1eb43c4a1883a5` |
| `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif` | AVIF | 39279 | `92476d4c389afbf12d2b40e1a0773139a33c6fd0e24df71be97918a05ba4d861` |
| `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` | WebP | 105016 | `450f78bb5aefcc6dda6826cb9fcda8a2af45f9778e077b49012596dbb38394f2` |
| `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif` | AVIF | 40187 | `d918433c39793cf8f455281b4ba4606749eff17d68d7c6d682183f07f5e33d6a` |

WebP 文件头是 `RIFF`/`WEBP`，AVIF 文件头含 `ftypavif`。编码分别是 `webp` 和 `av1`。

## M 的纯排版记录

原始 `translation/zh-figure.svg` 仍是 `50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13`。派生 `media/derived/zh-figure-render.svg` 是 `e658a04213b8ed3a16b32ca92e836edc98fc5dbce115f8882e452012b94d0812`。M 的 manifest 记录只给「掉落 15–21 个，换季不枯」增加 `textLength` 500 和 `lengthAdjust` `spacingAndGlyphs`，字号前后都是 48。F 没有改这两份 SVG，也没有改公开图片。

## 验证

工作目录是上面的工作树。没有跑 build、测试或浏览器。

1. Python 3 标准库比对六份公开文件的 SHA-256、字节数和文件头，并调用 `ffprobe`。六条 `MEDIA_OK`，`ffprobe` 退出码都是 0。旧 digest 用同一套 UTF-8、`sort_keys`、分隔符 `(',', ':')` 复算出 `9a39e281…`，改两个哈希后再算出 `cf037ddc…`。写盘后重读，变更路径正好 3 条。脚本退出码 0。
2. 源文件复算仍匹配：英文正文 `dd686bfd…`，中文正文 `ec8b60fc…`，英文 SEO `30ec27dd…`，中文 SEO `44fda49e…`，E 译文报告 `fa67a686…`。这一步退出码 0。
3. 公开 JSON 没有 `/Users/`、`docs/blog-ops`、`operation-store`、`creationBasis` 或 `pending_media`。没有 CR，没有行尾空白。

## 还没做

用户终审没有开始。页面还没有装进网站。这不是页面通过，也不是网站已经完成。
