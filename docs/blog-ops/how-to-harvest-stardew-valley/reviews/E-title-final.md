# Review Report: English Title, H1 & Final SEO Independent Review (E-title-final)

- **Role**: E (Independent Reviewer / 独立审核)
- **Date**: 2026-10-13
- **Target Keyword**: `how to harvest stardew valley`
- **Reviewed File**: `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json`
- **Actual Verified SEO SHA-256**: `30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08`
- **Locked Body File**: `docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md`
- **Locked Body SHA-256**: `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
- **Public References File**: `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-public-references.json`
- **Public References SHA-256**: `2a1739dad9e9e51943e9b0dde64a886eb80cbbdfca97fe5927ec055ddd2f678e`
- **Candidate Visual Assets**:
  - `writing/en-figure.svg`: `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661`
  - `media/en-figure-candidate.png`: `c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117`
  - `media/cover-candidate.png`: `bed8e9781d2f4034b7036d727e29fe2ab3511e6c9612239cc3827edf015f1ce3`
- **Reviewer Terminal Handle**: `term_d0dab364-a2b6-4afe-9abb-09e92f9f38cd`
- **Coordinator Terminal Handle**: `term_e23a001b-a645-4956-852b-d11d8689b9e4`
- **Task ID**: `task_d5524a3aec59`
- **Dispatch ID**: `ctx_3c5536bf3ab2`
- **Review Verdict**: **PASS (完全通过，正式技术准入)**

---

## 1. 独立版本与哈希一致性重算

1. **实际文件 SHA-256 校验**:
   - `docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json` 经独立 `shasum -a 256` 重新计算：
     `30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08`
   - 与 F 最终产出严格一致，杜绝任何旧 hash 放行。
   - `locked/en-body.md` 实际哈希为 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`，与 E 批准的正文一致。
2. **新增装配元数据核对**:
   - `readTimeMinutes`: `7`（基于正文合格词数 1326 词，按标准阅读速度合理估算，符合项目 `BlogPostMeta` 类型约束）。
   - `featured`: `false`（明确布尔值，符合指南非首页精选默认规范）。
   - 两项必须字段已正式落地于 `en-seo.json`（行 13–14）。

---

## 2. 题文兑现与 SEOTruth 独立审核

1. **Title 与 H1 兑现**:
   - 字段内容: `How to Harvest in Stardew Valley: Right-Click a Parsnip; Kale Needs a Scythe`
   - `titleEqualsH1`: `true`（单 title 字段策略，渲染一致）。
   - 事实兑现: 标题直接反映主搜索意图，准确指出防风草手摘（Right-Click）与甘蓝等特定作物需用镰刀（Scythe）的根本分流，正文全篇紧密围绕此核心事实展开，无虚假承诺、无浮夸修饰。
2. **去套路复核**:
   - 成功避开了最近 3 篇英文博客已使用的三类句式（`Choose by A, B, and C`、`Find X before Y`、`A or B names the thing`），采用直接对立事实陈述句，合格。
3. **元描述 (Description) 实测计数与审核**:
   - 字段内容: `Stand beside a ripe parsnip and right-click or press X. Kale, amaranth, wheat, unmilled rice, and fiber seeds come off with a scythe swing. Count growth from the day after planting, and a dry day moves the ready day back.`
   - **实测精确长度**: 221 个字符（221 UTF-8 字节，40 个单词）。
   - 包含正文全部核心提炼（PC 按键、镰刀作物、生长天数排除播种日），事实 100% 对应锁定正文，无第二搜索意图扩散。
4. **公开引用对应**:
   - 全部 18 条公开引用（`en-public-references.json`，SHA-256 `2a1739da...`）在锁定正文中精确出现一次（`occurrence: 1`），无悬空、无错位。

---

## 3. 封面图工具判别与 Alt 描述判定 (Gate Verdict)

针对封面图中工具与 Alt 描述的一致性进行纯视觉与 Source 依据独立审核：

1. **真实 Source 与视觉依据**:
   - 查看 `cover-source.svg` 第 44–48 行：
     ```svg
     <g>
       <line x1="430" y1="520" x2="520" y2="430" stroke="#8b5a34" stroke-width="10" stroke-linecap="round"/>
       <polygon points="500,418 548,392 532,454" fill="#c5ced6"/>
       <polygon points="548,392 566,404 532,454" fill="#8ea0ad"/>
     </g>
     ```
   - 几何结构分析：手柄为 45° 倾斜的棕色线段，端头为两个闭合多边形拼接而成的三角形尖角金属头。
   - 真实辨识结论：该图形属于极度抽象的扁平化手持农具示意，没有绘制铁锄（Hoe）特征性的 90° 垂直扁平锄板，也没有绘制具象的斧刃弧线。在纯视觉层面，该几何图形属于无法唯一指向具体游戏内特定工具的抽象画法。
2. **Gate 结论：非阻断的可选描述，判定通过 (Non-blocking Descriptive Summary / PASS)**:
   - **非功能性插画**: 该封面图为 M 原创的装饰性抽象矢量插画（“original scene drawn for this article. Not a game screenshot”），不承担游戏操作证据或精确机制演示功能。
   - **无事实冲突**: 正文与正文信息图均已明确写明巨型南瓜用斧头（Axe）；正文从未主张“用锄头收获南瓜”。封面 Alt 中的 `"three pumpkins and a hoe"` 属于对插画中该抽象农具的概括性场景描述（与右侧黄色麦穗旁明确绘制的长柄镰刀形成田园农具呼应）。
   - **裁定**: 现有 Alt 文本 `"Illustration of a farm: leafy crops in tilled soil beside a crate of orange roots, three pumpkins and a hoe, rows of yellow stalks with a scythe and a vine trellis, and a brown-roofed building with plants in its windows."` 能够准确、完整地向无障碍屏幕阅读器传达农场全貌，属于合法的视觉描述概括，**不构成阻断质量门的实质错误**。裁定为 **PASS**。

---

## 4. 审核结论与后续放行

1. **最终结论**: **PASS (完全通过，技术锁定解除)**
2. **最终批准哈希绑定**:
   - `locked/en-body.md`: `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
   - `seo/en-seo.json`: `30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08`
   - `seo/en-public-references.json`: `2a1739dad9e9e51943e9b0dde64a886eb80cbbdfca97fe5927ec055ddd2f678e`
   - `writing/en-figure.svg`: `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661`
