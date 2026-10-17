# house-upgrade-stardew FAQ addition

本次交付源文件是工作树里的这两篇，不是 media-redesign、旧 handoff 或 manifest 历史快照：

- `src/blog/articles/house-upgrade-stardew.en.tsx`
- `src/blog/articles/house-upgrade-stardew.zh.tsx`

## 结果

两篇都在来源区前加入 1 个 H2 和 6 组 `BlogFaqList`。英文标题是 `Farmhouse Upgrade FAQ`，中文标题是 `星露谷房屋升级常见问题`。原正文、像素图、链接、路由和 Article schema 未改。相对任务开始时的字节备份，两份 diff 都是只增加、没有删除行。

| 文件 | 删除行 | 增加行 | 交付 SHA-256 | 字节 |
| --- | --- | --- | --- | --- |
| 英文 | 0 | 60 | `b63c882c487c038249659c14b30fffea7ed5bebf6145d3d4d97412fd1dcefb94` | 17725 |
| 中文 | 0 | 53 | `1d3217ac64cbcbfe1dba7a5c878accb6f36a1b42b4fa4889bded3382ad0544dd` | 15867 |

任务前 SHA-256：英文 `e215ceb1871294757241bdd44a52a7a48667b5e0bb01018d9aafe8d348844acd`（15620 字节），中文 `3d601b6e0c4b5eada92fde9cd4875db44c31ef0a5eae857cdaac6b4deff13850`（13988 字节）。备份在 `baseline/*.tsx.txt`。

正文长度按源码去掉标签后的字母词和汉字计。FAQ 插入前：英文 1363 词，中文 1792 字。插入后：英文 1559 词，中文 2045 字。都高于 1000。

剥离脚本曾报英文比备份多 1 字节（15611 对 15610），位置是 FAQ 函数插入边界多出来的一个换行。原始记录在 `logs/body-strip-check-failed.txt`。没有为这个结果改正文。上面的 unified diff 才是正文保留证据。

## 静态 HTML

`out/house-upgrade-stardew.html` 与 `out/zh/house-upgrade-stardew.html`：各 1 个 FAQ `<h2>`、1 个 `blog-faq-list`、6 个 `blog-faq-item`。六问和对应费用、天数、硬木、地窖、9×5、装修句子都在页面里。`FAQPage` 出现 0 次，`"@type":"Article"` 出现 1 次。标题纯文本出现 2 次，是因为静态 HTML 的 RSC payload 再写了一遍，标签级 `<h2>` 只有 1 个。明细在 `logs/ssr-faq-check.txt`。本任务不做浏览器验收。

## 命令

权威结果是精简 FAQ 之后的三次。精简前的 typecheck 和 vitest 也是 EXIT 0，日志保留为 `*-before-trim.log`。

| 命令 | 日志 | 退出码 | 结果 |
| --- | --- | --- | --- |
| `pnpm typecheck` | `logs/typecheck.log` | 0 | tsc --noEmit，无错误行 |
| `pnpm exec vitest run` 指定 4 个文件 | `logs/vitest.log` | 0 | Test Files 4 passed (4)；Tests 43 passed (43) |
| `NEXT_TELEMETRY_DISABLED=1 pnpm exec next build --webpack` | `logs/build.log` | 0 | Next.js 16.3.0 (webpack)；68/68 静态页 |

构建把 `next-env.d.ts` 的两行 import 从 `./.next/dev/types/` 改成 `./.next/types/`，其余行相同。已用任务前备份覆盖回去。`cmp` 通过，SHA-256 恢复为 `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`，296 字节。

## 精确 diff

### 英文

```diff
--- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/faq-addition/baseline/house-upgrade-stardew.en.tsx.txt	2026-10-17 08:41:04
+++ /Users/wusir/orca/workspaces/stardew planner/博客-2/src/blog/articles/house-upgrade-stardew.en.tsx	2026-10-17 09:52:02
@@ -1,3 +1,4 @@
+import { BlogFaqList } from "../../components/blog/blog-faq-list";
 import { BlogSources } from "../../components/blog/blog-sources";
 import { PublicPicture } from "../../components/public-picture";
 
@@ -196,6 +197,64 @@
       <p>
         Choose the third upgrade's row when you want the cellar. Choose Remove Crib or Add Dining Room when you want those changes.
       </p>
+    </>
+  );
+}
+
+function HouseUpgradeStardewEnglishFaqSection() {
+  return (
+    <>
+      <h2>Farmhouse Upgrade FAQ</h2>
+      <BlogFaqList
+        items={[
+          {
+            question: "What does each farmhouse upgrade cost?",
+            answer: (
+              <p>
+                The first upgrade is 10,000g and 450 Wood. The second is 65,000g and 100 Hardwood, the 1.6 price. The third is 100,000g.
+              </p>
+            ),
+          },
+          {
+            question: "How long does each house upgrade take?",
+            answer: (
+              <p>Each upgrade takes three days.</p>
+            ),
+          },
+          {
+            question: "How do you get the Hardwood for the second upgrade, and does Robin sell it?",
+            answer: (
+              <p>
+                Robin&apos;s ordinary stock does not sell Hardwood. Six Large Stumps in the Secret Woods regrow daily. A Steel Axe clears the log at the entrance.
+              </p>
+            ),
+          },
+          {
+            question: "Which upgrade unlocks the cellar?",
+            answer: (
+              <p>
+                The third upgrade adds a cellar under the house. Enter it from the kitchen. The cellar starts with 33 casks.
+              </p>
+            ),
+          },
+          {
+            question: "Does a house upgrade increase the outdoor footprint?",
+            answer: (
+              <p>
+                The outdoor footprint stays 9×5, so the tiles beside the house stay as they are. After the third upgrade, the outside of the house stays the same as the previous upgrade.
+              </p>
+            ),
+          },
+          {
+            question: "How is a renovation different from an upgrade?",
+            answer: (
+              <p>
+                Each upgrade takes three days. After the second upgrade, a renovation finishes immediately. Remove Crib and Add Dining Room are examples.
+              </p>
+            ),
+          },
+        ]}
+      />
     </>
   );
 }
@@ -269,6 +328,7 @@
       <HouseUpgradeStardewEnglishRoomUseSection />
       <HouseUpgradeStardewEnglishOrderSection />
       <HouseUpgradeStardewEnglishRenovationSection />
+      <HouseUpgradeStardewEnglishFaqSection />
       <HouseUpgradeStardewEnglishSources />
     </article>
   );
```

### 中文

```diff
--- /Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/faq-addition/baseline/house-upgrade-stardew.zh.tsx.txt	2026-10-17 08:41:04
+++ /Users/wusir/orca/workspaces/stardew planner/博客-2/src/blog/articles/house-upgrade-stardew.zh.tsx	2026-10-17 09:51:39
@@ -1,3 +1,4 @@
+import { BlogFaqList } from "../../components/blog/blog-faq-list";
 import { BlogSources } from "../../components/blog/blog-sources";
 import { PublicPicture } from "../../components/public-picture";
 
@@ -146,6 +147,58 @@
         想要地窖，就选第三次升级那一行。想要这些改动，就选移除婴儿床或餐厅。
       </p>
 
+      <h2>星露谷房屋升级常见问题</h2>
+      <BlogFaqList
+        items={[
+          {
+            question: "每一档农舍升级要多少金币和材料？",
+            answer: (
+              <p>
+                第一次升级是10,000金和450木材。第二次是65,000金和100硬木，这是1.6的价格。第三次是100,000金。
+              </p>
+            ),
+          },
+          {
+            question: "每次升级要多久？",
+            answer: (
+              <p>每次升级都要三天。</p>
+            ),
+          },
+          {
+            question: "第二次升级的硬木怎么获得？罗宾出售硬木吗？",
+            answer: (
+              <p>
+                罗宾的普通存货不出售硬木。秘密森林里六棵大树桩每天重新长出。入口那根圆木要用钢斧头清除。
+              </p>
+            ),
+          },
+          {
+            question: "哪一档升级解锁地窖？",
+            answer: (
+              <p>
+                第三次升级在房子下面加上地窖。从厨房进去。地窖一开始有33个木桶。
+              </p>
+            ),
+          },
+          {
+            question: "升级会增加室外占地吗？",
+            answer: (
+              <p>
+                室外占地保持9×5，所以房子旁边的地块还是原来那样。第三次升级后，房子外面和上一次升级时一样。
+              </p>
+            ),
+          },
+          {
+            question: "装修和升级有什么区别？",
+            answer: (
+              <p>
+                每次升级都要三天。第二次升级之后可以做装修，而且马上完成。例如移除婴儿床，或增加餐厅这间房间。
+              </p>
+            ),
+          },
+        ]}
+      />
+
       <BlogSources
         heading="来源"
         items={[
```
