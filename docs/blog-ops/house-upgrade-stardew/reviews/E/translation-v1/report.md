# E 译文检查 translation-v1

判定：**FAIL**。问题 **5**。这是译文检查，不是页面验收、用户终审或部署通过。英文题文通过不沿用为本结论。

角色 E。任务 `task_a618eac49e95`。Dispatch `ctx_71fb79319a68`。协调者输入 `msg_c80d48ecf842`、`msg_0ec6f131aac6`、`msg_3770db75eecb`。预算仍是已用 3/3、未来余 0。本审不重置预算，不改译文。

## 绑定

| 文件 | SHA-256 | 对照 |
|---|---|---|
| `lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | 与协调者实读一致 |
| `seo/en/seo-candidate.json` | `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58` | 与协调者实读一致；只使用其中 Title/H1/Description |
| `content/zh/draft-zh-v1.md` | `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` | 一致；NFC 与原文哈希相同 |
| `content/zh/seo.zh.json` | `1a5c3bf69155c66cf6a2e5d3ce1f0a44d2b18d69a67cdb9dcbf665eacc0748ec` | 一致 |
| `content/zh/public-references.zh.json` | `8dc7366349f48ed2258c070638cb9edce04a4d886a052e6c2b8aea12fd8566f9` | 一致 |
| `content/zh/media-text.zh.json` | `0410d2b318c1295f2696ec4af61e29715d5aa69df033991ef5bf9922d77738d3` | 一致 |
| `content/zh/translation-submission.json` | `37d7815f9dd1eadb3a3b60bde56465bfd85a6b2f60552936e6c1df2ecf3e8b1f` | 一致 |
| 封面 WebP / AVIF | `bf601afc…265e87` / `7e002324…438926` | 一致，1672×941 |
| 房间 WebP / AVIF | `d9b97863…f0be9c` / `aabe9333…0c0aad` | 一致，1672×941 |
| 装修 WebP / AVIF | `6bf51517…79fe88` / `d8cde352…9f2b84` | 一致，1672×941 |

三张中文 SVG：`13e65062…dab735`、`99337ac2…aed5c0`、`1fd0e8e6…d5c5c9`。

## 正文对照

8 个标题一一对应，没有新增 H2/H3、FAQ 或段落。两张正文图的位置与英文相同，地址只从 `.en.webp` 换成 `.zh.webp`。封面只在媒体字段，地址换成 `house-upgrade-stardew-cover-zh`。https URL 50 次、12 个地址，多重集合与英文锁稿相同。

55 条中文 quote 都在正文出现 1 次，没有把英文 quote 原样放进中文 `appliesTo`。12 个来源的 id、URL、quote 条数与干净英文投影对齐。`factIds`、`reviewerNote`、`CALC-`、绝对路径、提示词均未出现。

下列保护在译文里仍在，没有另加主张：

- 每档 3 天，没有写下付款起点。
- 第 9 次是收获次数。条件仍是只靠这些树桩、从 0 起、入口圆木已清除、不算护林人额外一块、不算其他来源或消耗。
- 4,500 与 22,500 只写木材价钱；14,500 与 32,500 含 10,000 工费；12,500 是手头已有 200 木材的第一年账，不用 50 金单价。
- 75,000 与 175,000 写明是累加，不是一次到店支付。
- 周二、周五放在「普通的一周」后面，房子仍是每天 9:00 到 20:00，店关也能进。
- 退金币前要先清空新区域；餐厅那笔 150,000 金要拿回，对应区域必须是空的。
- 没有补婚礼、利润或实测口吻。

已锁英文没有被译文暴露出需要退回英文链的事实错误。本审没有重跑英文 D，也没有重跑英文计数。

## 术语

只读了两份已保存的中文维基 HTML，没有开中文 SERP。

- `/tmp/zh-page.html`：587,822 字节，569,289 个字符。标题是「采集 - Stardew Valley Wiki」，不是「觅食」。页内有护林人（旁边是 Forester 图）、煤矿森林、秘密森林、大树桩、大圆木。
- `/tmp/zh-house.html`：75,441 字节。标题是「农舍 - 星露谷物语官方中文维基」。地窖容器写的是木桶，初始 33 个。装修表里「移除婴儿床」免费；「餐厅」150,000；「打通餐厅」10,000。全文没有「修建餐厅」。

木桶页和小桶页的再次 GET 都是 HTTP 403，没有重试。两份已保存 HTML 里没有「小桶」。正文里的「不是小桶 Keg」因此没有第二次页面核验；农舍页已经把地窖容器写成木桶。

## 题文

Title、H1、ogTitle 都是「星露谷房屋升级：第二档是65,000金和100硬木」。Description 保留三档费用、1.6 替换 50,000 金和 150 硬木、每档三天，以及第二次升级后装修另单且马上完成。`author` 仍是既有英文常量 `Stardew Valley Planner Team`。接口里的中文显示常量是「星露谷规划器团队」。本审没有新造作者。`locale` `zh-CN`，`country` `US`。

## 图

三张 SVG 只改可见文字和中文字体栈。装修图四行字号从 88/84 收到 72/64，矩形、坐标、颜色和数字未改。六张栅格都是 1672×941。WebP 与 AVIF 的最大通道差是 17、20、19，属于压缩差。

实际看了由 WebP 解码的三张图，以及装修图三条小标签的 WebP/AVIF 裁切。文字可读，无方框、裁切或重叠。升级 3 只有 100,000 金和 3 天。三条被标成 `overflow:true` 的字（升级2之后、即时、退还金币）亮像素没有伸出矩形外 6 像素。

`render.log` 只有 09:38:09–09:38:11 这一次。更早的 exit 1 不在这份日志里。`reject_overflow` 只比较宽高，不看位置布尔值。不能把 `success:true` 写成全部边界检查通过。浏览器页面验收仍是 pending。

解码图：`view-cover.webp-decoded.png`、`view-tier-rooms.webp-decoded.png`、`view-upgrade-or-renovation.webp-decoded.png`、`view-renovation-small-labels.png`、`view-renovation-small-labels.avif-decoded.png`。

## 汉字

官方计数器 `--locale zh-CN` 退出码 0：1,740。脚本把非英文标成 `reference_only`，门槛是 null。这 1,740 已去掉 8 行标题和两行图片 alt，仍含两行「示意图」图注。图注汉字 90，去掉后 1,650。全文件汉字 1,908，与提交单一致。1,650 和 1,740 都不少于 1,000。没有另起段落凑字。这个汉字数不加进英文 Length。英文合格计数仍是已锁正文对应的 1,085。

## 问题

1. 位置：`draft-zh-v1.md` 第 69、71 行；`public-references.zh.json` 第 167 行 quote。类型：界面名称与简体维基不符。修改要求：150,000 金那一项改用农舍页装修表里的「餐厅」。不要写「修建餐厅」，也不要改成 10,000 金的「打通餐厅」。图内已经是「餐厅」，正文和 quote 要与图一致。不提供替换句。
2. 位置：`draft-zh-v1.md` 第 15 行；同句 quote 在 `public-references.zh.json` 第 194 行。类型：翻译腔，斧头等级指代不清。修改要求：按中文语序重写「之后的等级到铁匠铺升级」，明确是后续斧头等级在铁匠铺升级，不要让「等级」读成农舍档位。quote 随改后的原句更新。不提供替换句。
3. 位置：`public-references.zh.json` 第 186 行 `versionNote`。类型：版本说明超出干净英文投影，后半句是文章自指。修改要求：删去「旧的这一对只出现在那一句里」，只保留与干净英文 versionNote 相同范围的 1.6 价格变更。
4. 位置：同文件第 318 行 `site-carpenter.versionNote`。类型：非版本历史的编辑范围说明。修改要求：删去这条 versionNote。主张仍由那条 appliesTo quote 承担。
5. 位置：同文件第 4 行 `bodyPath`。类型：内部草稿路径进入公开引用 metadata。修改要求：删去该字段。冻结交接时不要带上仓库路径。

## 检索范围

有两次检索没有排除 `control/`。一次返回了 control 下流程记录的摘录；一次检索 overflow/font-size，实际返回只有 `media-production/zh/render.log`。返回内容里没有 `canary-identity.json`，也没有密钥明文。没有再打开 canary。不能据此说搜索器没有索引过该文件。

## 命令

`shasum` 退出码 0。正文计数器退出码 0。结构、quote、图像像素脚本退出码 0。维基页补拉的 HTTP 状态是 403，进程退出码 0 是因为异常被接住，没有重试。明细在 `checks.log`。
