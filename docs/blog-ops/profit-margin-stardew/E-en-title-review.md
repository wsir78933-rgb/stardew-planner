# E-en title / SEO 独立复核：`profit-margin-stardew`

**审核日期：** 2026-09-23（Asia/Shanghai）
**角色：** E-en Title / H1 / Description / SEOTruth 独立主审。只读审核；未修改 C、F、A/B/D/E、源码、媒体、配置、依赖、页面、外部服务或 Git 状态。
**最终结论：** **PASS**（仅限当前 C SHA 绑定下的 F-en Title/Description 源文案、主意图、正文兑现、V7 规则和项目契约层；页面装配、运行时 metadata、SERP 展示和 live HTTP 仍为 **UNVERIFIED**）。
**Must-fix for F：** 0。F 不需要因本次复核返修；下游必须把锁定值作为同一 `BlogPostMeta.title` / `description` 输入，不能把 C 的工作 H1 另渲染成第二个页面 H1。

## 1. 绑定输入与锁定值

| 输入 | 独立读回值 | 结果 |
|---|---|---|
| C body | `docs/blog-ops/profit-margin-stardew/C-en-draft.md` | 读取成功 |
| C raw SHA-256 | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | **PASS**；`shasum -a 256` 重算一致 |
| F lock | `docs/blog-ops/profit-margin-stardew/F-en-lock.md` | 读取成功；文件 SHA `07165f9c6f47d97dd7390b0898899c8a163fd10ce7c7ec62dbd30e6d83eb2509` |
| F 声明的 C SHA | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` | **PASS**；与当前 C raw SHA 相等 |
| 主关键词 | `profit margin stardew valley` | **PASS**；Title 含自然英文短语 `Stardew Valley Profit Margin`，Description 含 `Profit Margin` |
| Locale / country | `en` / `US` | **PASS**；与 A/B 一致；`US` 是研究参数，不是访客物理位置声明 |
| 主意图 | informational explanation + conditional setting decision | **PASS**；与 A/B ReaderTask、C 正文一致 |

### F 锁定的最终表面

| 字段 | 当前锁定值 | Unicode 字符数 | 结果 |
|---|---|---:|---|
| Title | `Stardew Valley Profit Margin: What 100%, 75%, 50%, and 25% Change` | 65 | **PASS** |
| Description | `Compare Normal, 75%, 50%, and 25% Profit Margin settings, including selected sale and seed prices, fixed costs, and how to choose one for a new farm.` | 149 | **PASS** |

F 的 10 组 paired Title/Description directions、筛选记录和最终 direction 2 均在 F 文件中；本轮独立脚本回读到编号 `1`–`10` 共 10 组，没有把“十组”当成十个搜索意图。

## 2. 逐字段 SEOTruth 复核

### 2.1 Title：PASS

- **关键词覆盖：** `Stardew Valley` 与 `Profit Margin` 均出现，语序符合自然 US English；四个正文支持的值 `100%`、`75%`、`50%`、`25%` 全部出现。
- **主意图代表性：** `What ... Change` 直接对应读者要理解“这个设置改变什么”的定义/解释任务；四值并列让读者立即知道页面覆盖完整设置范围，没有把 crop-profit calculator、generic money route 或 product CTA 变成第二主意图。
- **停留理由：** 该标题使用真实的 **反差数字 + 结论前置**：读者看到四个百分比并会问它们究竟改变哪些价格；C:5、C:15–26、C:36–60 给出选定 sale/seed price 与固定成本/奖励的边界。主要停留要素是 **金钱**（sale/seed prices）和 **异常**（同一设置不是全店折扣，部分价格动、部分成本不动）。
- **自然度：** `Stardew Valley Profit Margin: What ... Change` 是自然的主题 + 具体问题结构；没有关键词堆叠、同义词循环或品牌后缀。
- **长度：** 65 字符；当前同站最近三个 English registry Title 独立读回为 82、85、58 字符，65 在已存在的 58–85 区间内。V7 标题规则未规定一个硬性 Title 字符上限；当前 metadata helper 也未在本地实现中发现 Title 截断/后缀改写。
- **夸大/绝对词：** Title 未命中 `always`、`never`、`guaranteed`、`fastest`、`free`、`best`；不承诺收益、速度、难度倍数或普遍最优解。

### 2.2 Description：PASS

Description 补足 Title 没有展开的实际所得，并仍服务同一主任务：

- `Compare Normal, 75%, 50%, and 25% Profit Margin settings` 对应 C:17–22 的四值表和 C:28–34 的 75% 解释；`Normal` 在正文中明确等同 `100%`。
- `selected sale and seed prices` 对应 C:5、C:15–26、C:40–42；“selected”保留正文的范围限制，没有扩大成所有商品/商店。
- `fixed costs` 对应 C:44–60、C:68–70 的 fixed categories / fixed-cost boundary；正文明确列出 Blacksmith、Fish Shop、Traveling Cart、buildings、tool upgrades、quest gold rewards 及 Crab Pots 例外边界。
- `how to choose one for a new farm` 对应 C:66–93 的条件式选择矩阵和 C:95–123 的 new-game Advanced Options 路径；没有把“best”写成 universal recommendation。
- **长度：** 149 字符；足够保留主题、边界和行动结果。现有 registry 的 Description 长度并非统一硬上限，当前项目 source metadata 以输入值原样传递；Google snippet 的截断/改写未在本轮取得，保持 **UNVERIFIED**。
- **夸大/绝对词：** 与 Title 合并扫描无禁词命中；没有 `all shops`、calculator、exact pace、years to Perfection、existing-save editing 或 planner capability 承诺。

### 2.3 H1 / 正文兑现：PASS（语义与源契约层；运行时未验证）

C 当前 Markdown 工作 H1 是：

`What Is Profit Margin in Stardew Valley? 100%, 75%, 50%, and 25% Explained`

它与 F Title **不是字节相同**，但二者都承诺同一个单一任务：解释 Profit Margin 的四个值及其影响。这个差异不是 F 返修项，原因是：

1. `C-en-draft.md` 是正文草稿/审查输入，B 明确把最终 Title/Description 交给 F；C 的 H1 不是已经装配的 `BlogPostMeta`。
2. 当前 `src/components/blog/blog-article-content.tsx` 由 `post.title` 渲染页面级 `<h1>`；当前 English route 的 `generateMetadata`、Open Graph、Twitter 和 Article headline 也都从 `post.title` / `post.description` 读取。
3. 因而未来装配时，F 的 Title 应作为单一 `BlogPostMeta.title`，自然投影为页面 H1、metadata title、OG title、Twitter title 和 Article headline；正文 module 不应保留第二个页面级 H1。该源契约已核对，但目标 slug 尚未注册，运行时投影仍 **UNVERIFIED**。

C 正文逐项接住 F 表面：

| Title / Description 承诺 | 正文证据 | 结果 |
|---|---|---|
| `Stardew Valley Profit Margin` | C:1、C:3–11、C:13–26 | **PASS** |
| `100% / 75% / 50% / 25%` | C:5、C:17–22、C:28–34 | **PASS** |
| selected sale prices | C:5、C:26、C:40–42、C:50–55 | **PASS** |
| seed prices | C:5、C:26、C:30、C:42、C:50–54 | **PASS** |
| fixed costs / unchanged categories | C:44–60、C:68–70、C:72–79 | **PASS** |
| choose one for a new farm | C:66–93、C:95–123 | **PASS** |

## 3. V7 标题规则与七罪引擎

本轮读取并校验：

- `参考规则/标题与描述规则.md` SHA-256：`59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710`。
- `参考规则/七罪引擎.md` SHA-256：`1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3`。

| V7 gate | 独立结论 | 证据 |
|---|---|---|
| 正文承诺先于标题 | **PASS** | C 已绑定并由 D/E 以同一 SHA 通过；F 记录了 reader get、最强事实、distinctive angle 和 forbidden promises。 |
| 至少 10 个方向 | **PASS** | F 表格存在 `1`–`10` 共 10 个 paired directions。 |
| 一个主搜索意图 | **PASS** | Title 解释四值变化，Description 补充边界和新农场选择；setup 是同一选择任务的必要后续，不是独立 menu tutorial。 |
| 机制与停留要素 | **PASS** | 反差数字/结论前置；金钱/异常均有 C 中真实价格边界承接。 |
| 停留检查 | **PASS** | 停留原因不是“有吸引力”空话，而是四个真实百分比与“哪些价格变化、哪些固定”的信息差。 |
| 逐字适配检查 | **PASS** | Title 数字均在 C；Description 的 setting、affected/fixed boundary、new-farm choice 均在 C；没有临场增加方法或结果。 |
| 绝对词、夸张收益、虚构事实 | **PASS** | Final Title/Description forbidden scan：`{'title': [], 'description': []}`。 |
| 最近三篇去套路 | **PASS** | 从现有 English registry 读回目标之前最近三篇：`Do You Have to Water Trees...`（82）、`How to Level Up Farming...`（85）、`Last Day to Plant...`（58）。新 Title 使用同站已有“主题 + 具体边界/数字/决策”倾向，但不复制问题句 + Stage 4 + 3×3、XP 数值结构或截止日期结构。 |

## 4. Locale、slug、canonical 与现有页面契约

| Contract | 当前契约值 | 结论 |
|---|---|---|
| English locale | `en` | **PASS（契约层）** |
| Research country | `US` | **PASS（A/B 研究参数）** |
| Target slug | `profit-margin-stardew` | **PASS（用户任务、project spec）** |
| English article pathname | `/profit-margin-stardew` | **PASS（契约层）** |
| English canonical | `/profit-margin-stardew`（无 trailing slash） | **PASS（契约层）** |
| Registry identity string | `/profit-margin-stardew/`（有 trailing slash） | **PASS（这是项目明确区分的 identity contract）** |
| Paired Chinese pathname | `/zh/profit-margin-stardew` | **仅记录契约；Chinese lock 不在本任务验收范围** |
| Metadata input | `locale=en`, `canonicalPath=/profit-margin-stardew`, exact Title/Description | **PASS（project spec）** |
| Current source registration | `src/` 当前无 `profit-margin-stardew` | **UNVERIFIED / NOT DONE**，不是本 Title/Description 文案失败 |

ProjectInterfaceSpec 明确要求 metadata 使用 exact localized Title/Description；当前 route helper 会把 `post.title`、`post.description` 原样传给 page metadata、OG/Twitter，并以 canonicalPath 生成 canonical/hreflang。由于本任务禁止接入 registry、handoff、route、metadata 或页面，无法把契约层 PASS 升级为运行时 PASS。

## 5. 下游边界与未验证项

以下项目本轮没有执行，必须保持 **UNVERIFIED**，不能从本报告推断为通过：

1. `src/blog/blog-post-registry.tsx`、`src/blog/blog-copy.ts`、`src/blog/blog-post-identities.ts` 的 metadata/slug 注册。
2. `PublicBlogHandoff` 序列化、source/FAQ/CTA/媒体字段和 bodyHash 完整交接。
3. 真实页面 `<title>`、H1、meta description、OG/Twitter、Article JSON-LD、canonical、hreflang、sitemap、`llms.txt`。
4. Google 当前 Title link 是否截断、重写或选择 body text 作为 snippet。
5. local ego-browser、live HTTP、build、typecheck、Vitest、部署、用户终审。
6. 外部 Stardew Valley Wiki 在本轮没有重新发起 live HTTP；事实判断依据是当前 C 正文逐项映射以及 A/D/E 已记录的来源核验，不把可访问性或旧报告替代为本轮 live source proof。

若 C 任意字节变化，必须重新计算 C SHA 并回到受影响的 D/E/F gates；若 F 任一 Title/Description 字节变化，必须重新执行本 Title/SEOTruth 复核。若下游保留 C 工作 H1 而不以 F Title 填充 `BlogPostMeta.title`，则应停止装配并重新确认 H1/Title 单一投影契约；这不是本轮要求修改 F 的理由。

## 6. 真实验证命令与结果

所有命令均在 `/Users/wusir/orca/workspaces/stardew planner/博客` 执行；没有运行页面、浏览器、live HTTP、build、typecheck、test 或 deployment 命令。

| Check | Command / actual output | Exit | Result |
|---|---|---:|---|
| C/F hash binding | `shasum -a 256 .../C-en-draft.md .../F-en-lock.md` → C `ab5d9eae...7068aa`; F `07165f9c...eb2509` | 0 | **PASS** |
| F lock field readback | `rg -n '^\\| C SHA-256|^### Locked Title|^`Stardew Valley Profit Margin|^### Locked meta Description|^`Compare Normal' F-en-lock.md` → lines 21, 68, 70, 78, 80 | 0 | **PASS** |
| C binding readback | `rg -n '^# |^Profit Margin in |^The four choices|^The affected side|^The unchanged side|^There is no source-backed universal best|^## Where to choose Profit Margin|^Checked 2026-09-22' C-en-draft.md` → expected H1, mechanics, boundary, conditional choice, setup and source lines | 0 | **PASS** |
| V7 rule / engine readback | `rg` over F and both rule files → rule files, ten-direction method, mechanism/stay-element and three registry titles found | 0 | **PASS** |
| Python binding/content scan | Exact parser checked C SHA, F fields, Title/Description strings, 4 values, body facts, 10 directions, project contract, H1 topic overlap and forbidden terms → `SUMMARY pass=41 fail=0 total=41` | 0 | **PASS 41 / FAIL 0** |
| Existing English registry pattern | Python readback → recent slugs/titles/lengths `(do-you-have-to-water-trees-stardew, 82)`, `(how-to-level-up-farming-stardew, 85)`, `(last-day-to-plant-stardew, 58)` | 0 | **PASS** |
| Input SHA ledger | `shasum -a 256` over A/B/C/D/E/F/spec/rules/engine/registry/page shell/metadata helper completed with the values recorded in this report | 0 | **PASS** |
| Forbidden absolute/hype scan | Python regex over final Title/Description → `hits={'title': [], 'description': []}` | 0 | **PASS** |
| Pre-write target boundary | `target_exists=0`; initial status already contained the untracked target directory; no existing E-en title review was overwritten | 0 | **PASS** |
| Report whitespace | `rg -n '[[:blank:]]+$' E-en-title-review.md` → no output; expected no-match exit 1 | 1 expected | **PASS** |
| Report UTF-8 hygiene | Python readback → `utf8_decode=ok`, `bom=False`, `crlf=0`, `nul=0` | 0 | **PASS** |
| Report diff hygiene | `git diff --no-index --check /dev/null E-en-title-review.md` → no diagnostic; exit 1 because target is untracked | 1 expected | **PASS** |
| Post-write target status | `git status --short --untracked-files=all -- E-en-title-review.md` → `?? docs/blog-ops/profit-margin-stardew/E-en-title-review.md` | 0 | **PASS** |
| Tracked diff | `git diff --name-only` → no output | 0 | **PASS**; no tracked file changed |

### Independent input hashes

| Input | SHA-256 |
|---|---|
| `A-en-research.md` | `0318934f8185284b2ce938cdd933546bd5e2df10ca31324d11ab59615e3c8790` |
| `B-en-layout.md` | `d6b4fa5f7511391a4d8f466e95ab6a02aefd2d281a09e68c71eb210c9fb1887e` |
| `C-en-draft.md` | `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa` |
| `D-en-final-check-v2.md` | `0f4e37d9e1f4819aa83f0e24b21ebd39f066645718dd75b8bd46e8eac7d8bfa6` |
| `E-en-final-review-v2.md` | `acce76e45f7c640dde576f50f85069f92bbd14494651023294a9f4e30d864999` |
| `F-en-lock.md` | `07165f9c6f47d97dd7390b0898899c8a163fd10ce7c7ec62dbd30e6d83eb2509` |
| `project-interface-spec.md` | `95b6c47bd90bc60468420ff619b1d055a6c24647ff901ecbc6bea2f0efe5e26d` |
| `参考规则/标题与描述规则.md` | `59791c06e4b7c094f031e9b5cc59099f6593fd7f1cc6686bae931e148d1af710` |
| `参考规则/七罪引擎.md` | `1960b77ff5232be3fd8fc40c5eabfccfd0dccc1e950001509eeceb30a3f8c3f3` |
| `src/blog/blog-post-registry.tsx` | `f3b350c07705164562e5c7919ffae1968b1d268a7f28a99456a26df336724ffd` |
| `src/components/blog/blog-article-content.tsx` | `f8ede42d678068ea46eb8648040a3418ce595e5c796fad6e8284919af08ae2cb` |
| `src/seo/page-metadata.ts` | `ed717ed7941551768b74d761d3f2e390d38b330cae9f8523742003835e1796af` |
| `app/(en)/[slug]/page.tsx` | `908f306a46273af550d7cea9bcb64e5fe77515be3ae82830aabbcd695ba479be` |

## Final E-en state

**PASS for C SHA-256 `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa`.**

- Title: **PASS** — 65 chars; keyword, four values, retention reason and body fit verified.
- Description: **PASS** — 149 chars; affected/fixed boundary and new-farm choice verified.
- H1 / body promise: **PASS** semantically; current C H1 is a draft artifact, while source page shell projects `BlogPostMeta.title` as H1.
- V7 title/description + Seven Sins gates: **PASS**.
- Main intent / naturalness / facts / non-overclaim: **PASS**.
- Locale / slug / canonical contract: **PASS** at source-contract layer; target runtime registration **UNVERIFIED**.
- Page/browser/live HTTP/build/typecheck/test/deploy: **UNVERIFIED / NOT RUN**.

No F/C modification is requested by this review.
