# 房屋升级中文直译记录

角色 T。首次直接翻译，不是额外译文返修。整篇修订预算已用 3/3，未来余 0。本记录不签署 D 三门、E 译文审核、F 冻结或用户终审。

## 绑定

| 项 | 值 |
| --- | --- |
| 英文锁稿 | `docs/blog-ops/house-upgrade-stardew/lock/en/body.md` |
| English body SHA-256 | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| 中文正文 | `docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v1.md` |
| translated body SHA-256 | `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` |
| 汉字数 | 1908 |
| locale / country | zh-CN / US |
| author | Stardew Valley Planner Team |
| publishedAt | null |
| Title = H1 = ogTitle | 星露谷房屋升级：第二档是65,000金和100硬木 |
| slug | house-upgrade-stardew |
| seo SHA-256 | `1a5c3bf69155c66cf6a2e5d3ce1f0a44d2b18d69a67cdb9dcbf665eacc0748ec` |
| public-references SHA-256 | `8dc7366349f48ed2258c070638cb9edce04a4d886a052e6c2b8aea12fd8566f9` |
| media-text SHA-256 | `0410d2b318c1295f2696ec4af61e29715d5aa69df033991ef5bf9922d77738d3` |
| translation-submission SHA-256 | `37d7815f9dd1eadb3a3b60bde56465bfd85a6b2f60552936e6c1df2ecf3e8b1f` |

汉字数只供核对中文篇幅。正式 Length 门仍是已锁英文 1085 词。中文正文无 H1。规范化为 NFC、LF、UTF-8。

Description：第一次农舍升级是10,000金和450木材，第二次是65,000金和100硬木，第三次是100,000金。1.6里，第二次的费用换成现在的数额，不再是50,000金和150硬木。每次升级要三天。第二次升级之后，装修是另一笔订单，而且马上完成。

## 对照

来源 URL 多重集合与英文锁稿一致，共 12 个地址、47 次。图片地址改成批准的中文路径：

- `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp`
- `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp`

封面不进正文，公开路径是 `/blog/house-upgrade-stardew-cover-zh.webp` 与同名 `.avif`。

H2 六节、H3 两节，顺序与英文相同。正文图两张，位置与英文相同：育儿室那句之后，以及「装修不是下一次升级」开头。

公开引用 12 条，id 与 URL 未改。55 个中文 quote 均在正文中精确出现 1 次。文件不含 factIds、reviewerNote 或私有路径。秘密森林那条英文 versionNote 带有内部计算编号，中文公开文件未收入。

术语对照：护林人（Forester）、煤矿森林（Cindersap Forest）、大树桩（Large Stump）、大圆木（Large Log）、迷你冰箱（Mini-Fridge）、木桶（Cask，陈酿；小桶是 Keg）。铜斧头、钢斧头、铜锭、铁锭、果酒、蜜蜂酒、淡啤酒、山羊奶酪、移除婴儿床、修建餐厅、山路24号取自中文维基页名。

关键口径：

- 现价 65,000金 / 100硬木；旧价 50,000金 / 150硬木只出现在 1.6 那一句。
- 每一档三天。正文没有写从付款日起算。
- 第 9 次是收获次数，前提是从 0 开始、入口圆木已清除、不算护林人多给的一块、也不算其他来源或消耗。
- 第一年木材 450 × 10金 = 4,500金，加 10,000金费用 = 14,500金。第二年及以后 450 × 50金 = 22,500金，加同样费用 = 32,500金。
- 已有 200，再买 250，250 × 10金 = 2,500金，加费用 = 12,500金。这笔账不用 50金单价。
- 累计 75,000金 / 175,000金不是一次支付。另买的木材和斧头另算。
- 普通一周：上午 9:00 到下午 5:00，周二不营业，周五下午 4:00 关门。房子每天上午 9:00 到晚上 8:00 能进，商店关着也能进。
- 撤销装修要先清空新区域，退款立刻到账。餐厅退款要求那片 9×10 再加 4×5 的区域是空的。

## 图像

先看了三张英文 SVG 和对应 WebP（1672×941 示意图，不是游戏截图）。中文 SVG 只替换可见文字，字体栈为 `'Arial Narrow', 'PingFang SC', 'Hiragino Sans GB', sans-serif`。系统已有苹方和冬青黑体，没有下载字体。

装修图里「装修」「升级2之后」「即时」「退还金币」在原 88/84px 下被 110px 和 85px 高的格子切到笔画。格子、颜色、坐标和数字未改。这四行分别改为 72px 和 64px 后，放大 WebP 可见整字落在格子内。其余标签保持 84px 或 88px。

成功渲染命令：

```text
python3 render-recipe.py
exit code 0
{"success": true, "figureCount": 3}
```

`render.log` 记录三次 ego-browser exit_code 0，Pillow 12.2.0 转出 WebP quality 95 与 AVIF quality 90。渲染前后英文媒体哈希与开工时一致。

| 文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| cover-payments.svg | 3857 | `13e6506201f7ecb1535e2f40077d71b7b6ac0ee35f4485810cba1db515dab735` |
| house-upgrade-stardew-cover-zh.webp | 63012 | `bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87` |
| house-upgrade-stardew-cover-zh.avif | 34529 | `7e00232440ac66f410e791a9f472f3fdb2b74242cc1a7d0a35e43e8e8d438926` |
| tier-rooms.svg | 3713 | `99337ac2b5dcacb7792968289ea17f16e87cbbd69bf07c436665922196aed5c0` |
| tier-rooms.zh.webp | 58666 | `d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c` |
| tier-rooms.zh.avif | 31242 | `aabe93337712ce9de18a94faad5b3582cfeba8d62a7cd59b3a6962218e2c0aad` |
| upgrade-or-renovation.svg | 4661 | `1fd0e8e620c28067f0fdfc2d05b6bd80ff243ec82b4d5d8226f3e6e460d5c5c9` |
| upgrade-or-renovation.zh.webp | 60854 | `6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88` |
| upgrade-or-renovation.zh.avif | 32235 | `d8cde3529f897d5d5fe2b4b734e7182eb2eb000c19d3dc07dccd1ba5159f2b84` |

六张栅格都是 1672×941。已查看三张 WebP：中文无方框、无裁切、无重叠。测量和命令全文在 `media-production/zh/render.log` 与 `provenance.json`。

## 未完成

独立 E 译文审核、F 中英文交接冻结、G 组页都还没做。用户终审 pending。未部署。
