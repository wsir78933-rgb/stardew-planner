# F 公开交接冻结：how to harvest stardew valley

- 角色：F。没有兼任 C、E、T、M、G。
- 任务 `task_c23688973c81`，Dispatch `ctx_0284b52eb529`。
- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`。没有新建工作树。隔离只是目录约定。
- 这一步只写入 `handoffs/` 和本报告。没有改锁定英文正文、英文 SVG、T 的译文、产品源码或六份公开图片。

## 已核对的批准

| 材料 | SHA-256 | 批准 |
|---|---|---|
| `writing/locked/en-body.md` | `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101` | D 三门 0 必须改；E 正文 PASS；E 题文报告再次绑定 |
| `seo/en-seo.json` | `30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08` | `reviews/E-title-final.md` PASS |
| `writing/en-figure.svg` | `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661` | 同版锁定，没有副本 |
| `translation/zh-body.md` | `ec8b60fc7e99ac1c18b566bdd3594edc29f524d5cc6d3470625ef506f772c024` | `reviews/E-translation-review.md` PASS，对应上面的英文 bodyHash |
| `translation/zh-seo.json` | `44fda49e69a3e9e6d6984b50075bfaa1eed0cd72ccdf87d4425ba2d55e97aab5` | 同一份译文批准 |
| `translation/zh-figure.svg` | `50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13` | 同一份译文批准 |

冻结前又重算了这些哈希，与报告一致。英文合格计数仍是脚本原始 1363，减去 figcaption 37，最终 1326。短文理由在 `reviews/F-en-lock.md`。

## 媒体

`ffprobe` 对六份公开文件的每个流都是 1672×941，退出码 0。WebP 文件头是 `RIFF`/`WEBP`，AVIF 文件头含 `ftypavif`。SHA-256 和字节数与 `media/final-manifest.json` 一致：

| 公开路径 | 格式 | 字节 | SHA-256 |
|---|---|---:|---|
| `/blog/how-to-harvest-stardew-valley-cover.webp` | WebP | 38974 | `8558f5b08e0c3e890ceddfcffb7104ed0a0fb0380dedec4108beed46220b81d8` |
| `/blog/how-to-harvest-stardew-valley-cover.avif` | AVIF | 17525 | `ccd28749dfd7047666d8bcbf8410aa929a060e660cc882d3814ef74d6dec19cd` |
| `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` | WebP | 99024 | `c5d987fdd4c2d1799358baf987ee31a5b7a9d90b5933c7e3fc1eb43c4a1883a5` |
| `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif` | AVIF | 39279 | `92476d4c389afbf12d2b40e1a0773139a33c6fd0e24df71be97918a05ba4d861` |
| `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp` | WebP | 105214 | `e1689bd5bedbd85c25270cb5c92242c59dd2fa260bf5fcf4fca2d6bff242d52b` |
| `/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif` | AVIF | 40440 | `aefe51f9b7fc977c734937c03b016ae6d6ddefbdec78ec3dd46c722214266192` |

封面 alt 保持 E 已放行的英文原句和 T 的中文原句，没有按工具外观再改。

## 交接

两份文件只含 locale、country、body、bodyHash、seo、publicReferences、publicRequirements、integrity。

- `handoffs/public-blog-handoff-en.json`，文件 SHA-256 `8ed90bfab4dbdd4158ae2b0fe38e5f380f3922d2d1922b3ae5142017c51ee2c9`，integrity digest `8002421bcc6d0aa93ccc44c9f3f8c88545b3a87d42854aaabad8997c91efd9ed`
- `handoffs/public-blog-handoff-zh.json`，文件 SHA-256 `fc8343c008ca4ec39632ea29c43c7d05c0bc26df872071b26848d3576cb97d7d`，integrity digest `9a39e281a3d7c7dc37545906dbd5a733cac4c3137ef055ff1b275b6f302ad592`

中文 integrity 里的 `sourceEnglishBodyHash` 是 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`。两边各 18 条引用，quote 在对应正文里都只出现 1 次。中文两处站内链接是 `/zh/last-day-to-plant-stardew` 和 `/zh/what-to-grow-in-greenhouse-stardew`，与 `src/blog/blog-copy.ts` 的现有中文路径一致。外部链接与英文相同。

integrity digest 的算法是：取出除 integrity 以外的七个公开字段，用 UTF-8、`sort_keys`、分隔符 `(',', ':')` 做 JSON，再算 SHA-256。写盘后重新解析，digest 与正文 hash 都复算通过。公开 JSON 里没有本机绝对路径、operation store、研究日志或 `pending_media`。

## 还没做

用户终审没有开始。页面还没有装进网站，G 仍待装配。这不是页面通过，也不是网站已经完成。没有跑 build 或浏览器验收。
