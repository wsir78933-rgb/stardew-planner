# E 译文复核 translation-v2

判定：**PASS**。问题 **0**。这是第 4 轮局部译文复核，不是页面验收、用户终审或部署通过。英文题文与事实结论不重新认证。

角色 E。任务 `task_62c9fec52426`。Dispatch `ctx_9718e89d955d`。协调者输入 `msg_c9040b5bdd86`。预算状态：已用 4 轮（保留原 3 轮 + 用户显式批准 1 轮例外），未来余 0。本轮不重置预算。

用户对「是否允许追加一轮，仅修5处中文问题再继续完成页面验收」的回复为「继续」。协调者于 2026-10-16 14:19:46 UTC 读取时钟并确认该授权；这是协调者记录时钟，不声称用户消息精确发送时刻。

## 绑定与哈希

| 文件 | SHA-256 | 对照与状态 |
|---|---|---|
| `lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` | 与已审英文锁稿一致 |
| `seo/en/seo-candidate.json` | `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58` | 与已选英文 SEO 一致 |
| `content/zh/draft-zh-v2.md` | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` | 新提交中文正文，NFC 与原文件哈希一致 |
| `content/zh/seo.zh.json` | `f744f783cf4b04d1cf0d66a2029cafaedaaf5eb04754e7b1e13612e48c29be16` | 仅更新正文 SHA-256 绑定，其他字段字节未变 |
| `content/zh/public-references.zh.json` | `b2e0781d81b60a10ba6586ca8c0ea7032ce9e2f24df05fb80587dba8733f9127` | 仅 5 处历史问题修正与正文版本绑定 |
| `content/zh/media-text.zh.json` | `43c6138438d5a29bb13ab0daf0ccd9b5c6498284191a79680c53e84ade7298aa` | 仅更新正文 SHA-256 绑定，图文元数据字节未变 |
| `content/zh/translation-submission.json` | `4d8b4fa7f9c0835f7c8e33f151830767ea9491d164af7f20e7e90a9e62fa4671` | 包含完整 v2 元数据、1905 汉字数与 4 轮预算记录 |
| 封面 WebP / AVIF | `bf601afc…265e87` / `7e002324…438926` | 与 v1 完全一致，1672×941 |
| 房间 WebP / AVIF | `d9b97863…f0be9c` / `aabe9333…0c0aad` | 与 v1 完全一致，1672×941 |
| 装修 WebP / AVIF | `6bf51517…79fe88` / `d8cde352…9f2b84` | 与 v1 完全一致，1672×941 |
| 3 张中文 SVG | `13e65062…dab735` / `99337ac2…aed5c0` / `1fd0e8e6…d5c5c9` | 与 v1 完全一致 |

原 v1 五项文件（`draft-zh-v1.md` `9e28797b…`、`public-references.zh.json` `8dc73663…`、`seo.zh.json` `1a5c3bf6…`、`media-text.zh.json` `0410d2b3…`、`translation-submission.json` `37d7815f…`）已完整归档于 `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/`，原字节未被篡改。

## 5处历史问题逐项复验

1. **官方餐厅名称与价格指代（原问题 1）**：
   - 核验结果：**通过**。
   - 复验依据：检查已保存的中文维基农舍页 `/tmp/zh-house.html`（75,441 字节）。装修表中 150,000 金项目为「餐厅」，10,000 金项目为「打通餐厅」，全文无「修建餐厅」。正文原第 69、71 行修改为「餐厅要150,000金…」及「…选移除婴儿床或餐厅」，删除了「修建」前缀，明确为 150,000 金的官方项目「餐厅」，未混淆为 10,000 金的「打通餐厅」。正文与图片 `upgrade-or-renovation.zh.webp` 内标注的「餐厅 150,000金」保持一致。`public-references.zh.json` 第 167 行对应 quote 同步更新为「餐厅要150,000金，增加一间占地9×10再加4×5的房间，而且马上完成」，在正文中严格出现 1 次。

2. **斧头等级与铁匠铺指代（原问题 2）**：
   - 核验结果：**通过**。
   - 复验依据：`draft-zh-v2.md` 第 15 行将原翻译腔「之后的等级到铁匠铺升级」重写为「后续斧头等级在铁匠铺升级」，明确指代后续的斧头等级，彻底消除了将「等级」误读为农舍档位的歧义。对应 quote 同步更新为「你一开始有一把能砍倒完全长成的树的斧头，后续斧头等级在铁匠铺升级」，在正文中严格出现 1 次。

3. **版本说明自指句清理（原问题 3）**：
   - 核验结果：**通过**。
   - 复验依据：`public-references.zh.json` 中 `wiki-version-history.versionNote` 删除了后半句编辑自指「旧的这一对只出现在那一句里」，仅保留「1.6把第二次升级从50,000金和150硬木改为65,000金和100硬木。」，与干净英文投影的说明范围严格对齐。

4. **非版本说明的编辑范围注释清理（原问题 4）**：
   - 核验结果：**通过**。
   - 复验依据：`public-references.zh.json` 中已彻底移除 `site-carpenter.versionNote` 字段。对应主张仍由 `appliesTo` 中的对应 quote 正确承担，没有残留内部编辑范围注释。

5. **公开引用元数据内部路径清理（原问题 5）**：
   - 核验结果：**通过**。
   - 复验依据：`public-references.zh.json` 顶层已彻底移除 `bodyPath` 字段，避免了本地草稿路径泄露至公开交接引用中。

## 实际 diff 与防漂移核对

- `diff -u content/zh/draft-zh-v1.md content/zh/draft-zh-v2.md` 退出码 1：仅包含斧头等级重写（第 15 行）和两处餐厅称谓修正（第 69、71 行），共 3 行改动，无任何额外正文变更。
- `diff -u content/zh/versions/translation-v1/public-references.zh.json content/zh/public-references.zh.json` 退出码 1：除 `bodyVersion`（改为 `draft-zh-v2`）和 `translatedBodySha256` 技术更新外，仅包含上述 5 处问题的针对性修改。
- `diff -u content/zh/versions/translation-v1/seo.zh.json content/zh/seo.zh.json` 退出码 1：仅更新 `translatedBodySha256` 一行。Title、H1、Description、Slug 等所有 SEO 字段字节未变。
- `diff -u content/zh/versions/translation-v1/media-text.zh.json content/zh/media-text.zh.json` 退出码 1：仅更新 `translatedBodySha256` 一行。图注、alt 文本、inImageText 字节未变。
- `diff -u content/zh/versions/translation-v1/translation-submission.json content/zh/translation-submission.json` 退出码 1：更新了对应路径、哈希、汉字数（1905）以及预算记录（used 4, preserved 3, exception 1, remaining 0）。

无未授权文件改动，无多余重构与风格漂移。

## 结构、链接、数字与引用校验

- **标题结构**：正文共 8 个标题（6 个 H2，2 个 H3），与英文锁稿 1:1 严格对齐，无增删小节或段落。
- **正文外链**：Markdown https URL 出现 50 次，覆盖 12 个唯一 URL，多重集合与英文锁稿完全一致。
- **数字多重集合**：正文包含 158 个数字串，多重集合与 v1 完全相同（150,000、65,000、100 等数字保持无损）。
- **引用 quote**：`public-references.zh.json` 包含 55 条 quote，每条在 `draft-zh-v2.md` 中实际出现频次均为 1，`occurrence` 均为 1，无 0 频或多重匹配。
- **安全与公开合规**：`public-references.zh.json` 中无 `bodyPath`、`factIds`、`reviewerNote`、`CALC-`、`/Users/` 或提示词字符串。

## 篇幅与汉字数

- 官方计数器执行：`PYTHONDONTWRITEBYTECODE=1 python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale zh-CN docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md`，退出码 0。
- 机械汉字统计：1737（比 v1 少 3 字符，因「修建餐厅」变为「餐厅」两处共少 4 汉字，「之后的等级到铁匠铺升级」变为「后续斧头等级在铁匠铺升级」增 1 汉字，净减 3 汉字）。
- 全文件汉字数：1905。
- 篇幅判定：`length_class` 为 `reference_only`，机械汉字 1737 与全文件 1905 均满足 >= 1000 汉字基线。
- 门槛说明：汉字计数仅供参考，不计入英文 Length 门槛。正式英文长度保持锁定时的 1085，本审不重跑英文 D 或英文计数。

## 图像与视觉资产承接

- 6 张中文栅格图片（WebP 与 AVIF）及 3 张 SVG 文件的 SHA-256 哈希与 v1 提交完全一致。
- 依据规约，承接原 E 阶段已完成的实际图像视觉检查与像素环判定证据：
  - 解码视图（`view-cover.webp-decoded.png`、`view-tier-rooms.webp-decoded.png`、`view-upgrade-or-renovation.webp-decoded.png`、`view-renovation-small-labels.png`、`view-renovation-small-labels.avif-decoded.png`）文字清晰，无重叠、无裁切、无方框。
  - 三处 `overflow:true` 矩形外 6 像素环亮像素计数为 0。
  - 明确自动检测局限性：`render-recipe.py` 中 `reject_overflow` 仅比较宽高数值，不校验位置布尔值；本轮未重新执行渲染，保留该技术限制记录。

## 检索范围与审计记录

- 历史事实保留：原 E 审查阶段中两次全局搜索涉及 `control/` 路径的历史事实完整保留在原记录中，不予抹掉。
- 本轮范围限制：本轮复核严格遵守只读限制，仅直接读取指定的目标文件、归档版本及 `/tmp` 下已缓存维基文件，未执行针对 `control/`、`canary` 或 ops 根目录的全局宽范围扫描。

## 结论与后续交接

本轮 5 处针对性修改全部验证通过，实际 diff 无任何漂移，结构、数字、引用及视觉资产一致性完备。

- 本轮复核结论：**PASS**（问题 0）。
- 状态说明：当前结论为局部译文复核通过，仅代表阶段 E 译文闭环；不代表 F 阶段完成、页面装配完成、用户终审完成或上线部署完成。
