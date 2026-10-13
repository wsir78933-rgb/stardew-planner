# 角色 T 中文翻译记录

本记录只做机械核对。不签署译文质量 PASS，不代表用户终审，也不代表上线。下一步是独立 E 审译文，通过后再由 F 冻结、G 装配。

## 输入

- 工作树：`/Users/wusir/orca/workspaces/stardew planner/博客-2`
- 锁定英文正文：`rework-v2/en-body.locked.md`
- 英文正文 SHA-256：`d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`（10036 字节，与 `lock-f/en-body.locked.md` 相同）
- 英文 SEO：`rework-v2/en-seo.json`，文件 SHA-256 `659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9`
- 英文媒体：`rework-v2/en-media.locked.json`
- 英文 21 条引用：`rework-v2/en-public-references.locked.json`
- E 题文审核：`rework-v2/review-e/seo-r2.md` 写明通过。`en-seo.json` 的 `status` 仍是 `pending_title_review`，因为审核者不改输入 JSON。
- 术语以 `rework-v2/facts-audit-v2.md` 的 FACT-11 和 `facts-audit/raw-zh-terms.json` 为准。没有重做中文搜索，没有查游戏解包，不声称官方游戏字符串已核验。

## 产出

| 文件 | SHA-256 |
|---|---|
| `translation/zh-body.md` | `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd` |
| `translation/zh-seo.json` | `49dffecf14f8fb5ddf549334bc6c1f14408cb0ed5f8b58e4bac5826898b8910f` |
| `translation/zh-media.json` | `c6abd143616de6f03bc868121b41f9ae8a50f317b70dfbea37c67f3e282e95a7` |
| `translation/zh-public-references.json` | `7ca77bb04069808b5635e186985b936f15a25059f6de197ba0c229569b731c63` |

三份 JSON 的 `sourceEnglishBodyHash` 都是上面的英文正文哈希。`zh-seo.json` 与引用文件的 `bodyHash`，以及 `zh-media.json` 的 `bodySha256NfcLf`，都是中文正文哈希。

Title 与 H1 相同：`星露谷物语怎么收作物：徒手、镰刀或斧头`（19 个字符）。Description：`防风草和南瓜用右键或 X 徒手收，甘蓝菜和小麦用镰刀割，巨大作物用任意斧头砍三下。`（41 个字符，纯文本）。`status` 为 `pending_translation_review`，`freezePublicBlogHandoff` 为 false。

## 机械核对

工作目录：`/Users/wusir/orca/workspaces/stardew planner/博客-2`

```text
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/evidence/build_sidecars.py
python3 docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/evidence/check_translation.py
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/zh-body.md --locale zh-CN
git diff --check -- docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation
```

四条命令退出码都是 0。

核对脚本结果：链接目标 27 个，与锁定英文的多重集合一致；21 条引用的 URL 顺序与英文相同，quote 定位失败数 0；正文两处 `<figure>`；两处 ConcernedApe 署名；UTF-8、NFC、LF、无 BOM。六张 staged WebP/AVIF 的 SHA-256 与媒体字段一致，`sips` 都是 1672×941。没有新生成图片。`public/` 里的旧图没有替换。

计数脚本标准输出：`mechanical_units` 1769，`length_class` `reference_only`，`meets_mechanical_floor` null，`sha256_nfc_lf` 与中文正文哈希相同。这只是参考值，不是中文门槛，也不构成质量通过。

收据：`translation/evidence/sha256-receipts.json`、`check-stdout.json`、`count-zh.stdout.json`。

## 译名

- Kale 用甘蓝菜（Kale）。正文没有使用羽衣甘蓝。FACT-11 写明甘蓝菜条目存在，羽衣甘蓝不存在。
- 防风草（Parsnip）、苋菜（Amaranth）、未碾米（Unmilled Rice）、纤维种子（Fiber Seeds）在首次出现时括注英文。正文没有祝尼魔，所以没有写这个词。
- 南瓜、小麦、青豆、啤酒花、葡萄、镰刀、铱镰刀、棚架来自同一份已核社区词条。青豆、啤酒花、葡萄和棚架在首次出现时另括了英文。
- 蓝莓不在那 38 条词表里。正文用蓝莓（Blueberry），依据是本站已发布耕种文的用法，本次没有再查维基。
- 耕种精通（Farming Mastery）沿用 FACT 审计里的中文说法，不是游戏文件核验。
- Check/Do Action 保持英文控制名，没有另造中文界面字符串。
- harvest sprite 写成「可以收获的图像」或「生长阶段图像」，没有写成人物精灵。

## 保持不变的内容

正文内所有链接目标与锁定英文相同，包括两张图注里的新闻素材 `<a>`，以及 `/`、`/last-day-to-plant-stardew`、`/what-to-grow-in-greenhouse-stardew`。中文页面自己的 canonical 是 `/zh/how-to-harvest-stardew-valley`，这是 SEO 字段，不是正文链接。`country` 保持 US，因为这篇沿用锁定英文的地区，没有另做中文地区研究。`readTimeMinutes` 保持 6，来自英文计数。

未改英文锁稿、旧版 `translation/`、产品源码、`public/`、测试和规则。没有 commit、部署或安装依赖。
