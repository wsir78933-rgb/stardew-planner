# PublicBlogHandoff (zh-CN) — frozen-for-local-assembly

- type: `PublicBlogHandoff` (V7)
- status: **FROZEN FOR LOCAL ASSEMBLY**；题文/SEO 复核 PASS，本地媒体回执 PASS，所有必填 registry metadata 均已明确且符合 validator 形状。本记录可供装配者消费，但不声称页面、浏览器、部署或用户终审已完成。
- locale / country: `zh-CN` / `CN`
- locked body: `12171` UTF-8 bytes, SHA-256 `48b642e15cb7678638e8891a4c137b8260be1aa8324465b8801f9bafccf3a92e`; body is NFC and LF-normalized.
- Title/H1: `星露谷松树种植先看格子，不浇水也不能随便种`
- FAQ: `null`（锁定的简体中文正文没有 FAQ 标题或 FAQ 条目）。
- Media receipt: 本地封面和两张正文图的 WebP/AVIF 兄弟文件均已存在；尺寸、字节数、SHA-256、格式和封面画面描述均已从实际文件核验。正文图 alt/caption 保持不变。
- Registry metadata：`topic=星露谷物语指南`、`author=星露谷规划器团队`、`featured=true`、`readTimeMinutes=13`；阅读时间是以 `stardew-valley-trees` 中文条目（`13`）和可比渲染长度为锚点的编辑估计，不是确定性公式。

下面的 JSON 是已冻结、可供装配者消费的交接记录。页面绑定、构建、浏览器、部署和用户终审仍单独记录，本记录不作这些声明。
```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "frozen-for-local-assembly; title-review PASS; not user-final; page-browser-QA not claimed",
  "ready": true,
  "frozen": true,
  "bodyFrozen": true,
  "lockVersion": "2026-09-22-zh-pine-tree-lock-2",
  "locale": "zh-CN",
  "country": "CN",
  "body": "松果是松树的种子入口，松树属于普通树，不按果树的 3×3 规则种植。[普通树](https://zh.stardewvalleywiki.com/树)苗不需要浇水，但种下前仍要确认格子和地图条件；成熟后挂上[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)，普通采集器 5 天、重型采集器 2 天可以得到松焦油。树苗卡在第 4 阶段时，先围着它检查八个相邻格有没有成熟普通树，再检查季节、树肥和地图限制，不要拿一个固定成熟天数硬套所有情况。\n\n## 认出松果、松树和松焦油的对应关系\n\n先把这条关系记住：**松果 → 种出普通松树 → 等树成熟 → 在成熟松树上挂采集器 → 得到松焦油。** 松树不是果树，所以不需要果树那种周围 3×3 全空的规则；但普通树苗仍会受相邻成熟树阻挡，后文会单独排查这一点。[松树](https://zh.stardewvalleywiki.com/松树)页面和[树](https://zh.stardewvalleywiki.com/树)页面都把 Pine Tree 归在普通树范围内。\n\n| 手上的对象 | 下一步 | 不要混淆的地方 |\n| --- | --- | --- |\n| 松果 | 放到合规格子里种下 | 松果是种子，不是已经长好的树苗 |\n| 松树苗和小树 | 等它通过成长阶段 | 不需要按作物浇水，也不要用果树 3×3 规则判断 |\n| 成熟松树 | 挂树液采集器或重型树液采集器 | 采集器的 5 天/2 天是产物间隔，不是松树成熟时间 |\n| 松焦油 | 按需要用于收集包、制作、裁缝或任务 | 松焦油售价和用途不能推出“松树最赚钱”的结论 |\n\n为避免混淆，下面把 Pine Cone、Pine Tree 和 Pine Tar 分别称为[松果](https://zh.stardewvalleywiki.com/松果)、[松树](https://zh.stardewvalleywiki.com/松树)和[松焦油](https://zh.stardewvalleywiki.com/松焦油)。你也可能看到“松子”“树脂”或“白色松树”这些叫法；它们指的仍是这三个游戏对象。\n\n如果手上还没有松果，最直接的入口是采集等级达到 1 后摇晃或砍倒松树，也可以挖起成熟松树掉在地上的未发芽松果。[松果](https://zh.stardewvalleywiki.com/松果)页面还列出垃圾桶和木跃鱼鱼塘达到 9 条鱼后的产出。杂货店不卖松果；旅行货车可能随机出售，价格范围应以当次货物为准，不能把它当成稳定的早期种子来源。\n\n![图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。](/blog/illustrations/pine-tree-seed-to-tar.webp)\n\n*图 1：松果 → 普通松树 → 成熟松树上的树液采集器 → 松焦油。图中表达对象关系，不表示固定成长天数或收益排名。*\n\n## 松果怎么种，以及松树苗为什么卡在第 4 阶段\n\n### 先检查种植格、浇水规则和地图限制\n\n把松果交给地面之前，先检查三个条件：\n\n1. 种松果时要按区域检查位置：农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子；农场内则检查[松果](https://zh.stardewvalleywiki.com/松果)页列出的条件：格子未被占用、属于可耕种格，而且没有被锄头开垦。若格子被物件占着，或它本来就不是可耕种位置，先换格子，不要把“不需要浇水”理解为“任何地方都能种”。\n2. 松树属于普通树，种下后不需要像作物那样每天浇水。[树](https://zh.stardewvalleywiki.com/树)页面同时说明，普通树不要求周围土地全部清空；这和“八邻格不能有成熟树”的成长阻挡是两件事。不要为了排除第 4 阶段问题，反过来给松树套上果树 3×3 硬规则。\n3. 地图规则要单独看。官方[Stardew Valley 1.6 更新完整改动](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)明确写出：不能在城镇或海滩农场的隧道里种树。它不是“普通树可以在所有地图随便种”的例外证明。\n\n普通树的“不浇水”只回答水分问题，不替你检查格子、地图和邻格。下种时把这几个条件一起核对，比先浇水再等几天更容易定位问题。\n\n### 用八邻格检查第 4 阶段阻挡\n\n如果松树苗一直停在第 4 阶段，第一步不是补水，而是以这棵树苗为中心看八个相邻格：上、下、左、右，以及四个对角格。只要其中任意一格有成熟普通树，树苗就会永远停在第 4 阶段。[树](https://zh.stardewvalleywiki.com/树)页面给出的规则是“成熟树占据树苗八邻格时阻止继续成长”，它不是果树的 3×3 占地规则。\n\n按下面的顺序排错：\n\n1. 先逐格看八邻格，确认阻挡它的是否是成熟树，而不是把一棵还在成长的小树误判成同样的阻挡条件。\n2. 找到成熟邻树后，先清掉它；若必须换位，先清除或砍掉树苗，再在合规位置重新种下；或者只把成熟邻树与新种树苗错开。之后重新观察成长阶段。\n3. 八邻格没有成熟树，再次检查种植格是否合规，以及当前地图是否允许种树。\n4. 仍未推进时，回到前两步逐项重核：当前季节、树肥状态、地图限制，以及你看到的是玩家种植的树还是农场外自然树。\n\n为了少做逐株检查，可以让树干之间留出一格空位；这只是便于管理的布局做法，不是 Pine Tree 必须遵守的游戏 3×3 规则。图 2 把八邻格和一个实用的错开方案放在同一张示意图里，留空格不要解读成游戏碰撞框或树的物理 footprint。\n\n![示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。](/blog/illustrations/pine-tree-stage-four-neighbor.webp)\n\n*图 2：先检查树苗周围八个相邻格；成熟邻树会卡住第 4 阶段。树干之间留一格是便于布局和排错的做法，不是果树 3×3 规则。*\n\n### 冬季、树肥和农场外自然树的分支\n\n未施树肥时，[普通树](https://zh.stardewvalleywiki.com/树)在非冬季每晚约有 20% 的机会进入下一阶段，冬季通常不生长；[松树](https://zh.stardewvalleywiki.com/松树)第 4 阶段的阶段时长是其他阶段的两倍。不同页面会给出平均值、中位数和百分位等不同口径，因此不要把一个数字当成所有松树的固定成熟日；按季节、阶段、邻格和树肥条件观察。\n\n[树肥](https://zh.stardewvalleywiki.com/树肥)必须施在已经种下的树种、树苗或小树上，不能把它当作种下松果前的地块肥料。对普通树来说，树肥可以让它在冬季继续推进；果树和茶树不适用这条规则。即使使用树肥，也不要把“可以继续生长”写成“保证某一天成熟”，最后阶段和相邻树条件仍需满足。\n\n农场外的自然松树是另一条使用路径。中文[松树](https://zh.stardewvalleywiki.com/松树)页面列出煤矿森林、铁路、木匠商店周围等自然区域的松树可以砍伐或挂采集器；清除树和树桩后，如果原格没有被占用，空出的自然树位置可能重新生成小树。由于相关页面对自然树重生阶段的记录并不一致，不要把某个阶段数字当成保证，也不要把自然树规则当成种植许可。城镇或海滩农场的隧道不能种树，仍要遵守 1.6 地图限制。\n\n如果你只是想先排一块种树位置，可以先看[星露谷种树：普通树和果树的区别](/zh/stardew-valley-trees)；需要在地图上摆放 `Pine Tree` 外观、检查不可长树格时，规划器可以帮助你做布局示意，但不模拟松树成长天数、自动落种、采集器计时、松焦油产出，也不能用目录里的对象大小推断游戏碰撞框。\n\n## 成熟松树如何用采集器取得松焦油\n\n松树进入成熟状态后，才是挂采集器的阶段。采集器产物计时和树木成长计时要分开看：前者可以明确写 5 天或 2 天，后者不要反推成一个固定成熟日。\n\n| 设备 | 适用对象 | 松焦油间隔 | 冬季行为 | 门槛提示 |\n| --- | --- | --- | --- | --- |\n| [树液采集器](https://zh.stardewvalleywiki.com/树液采集器) | 成熟松树 | 5 天 | 在松树上继续工作 | 普通设备；配方从采集等级 4 开始 |\n| [重型树液采集器](https://zh.stardewvalleywiki.com/重型树液采集器) | 成熟松树 | 2 天 | 在松树上继续工作 | 晚期设备；不要把 2 天当成普通采集器速度 |\n\n普通采集器和重型采集器都可以挂在成熟松树上，区别在产出间隔和取得门槛。[松树](https://zh.stardewvalleywiki.com/松树)和[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面都支持 5 天与 2 天的对应关系；[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)页面还说明，挂在松树上的采集器冬季继续工作。也就是说，树已经成熟时，冬天不必为了松焦油把采集器拆下来。\n\n如果你要取回设备，先按[树液采集器](https://zh.stardewvalleywiki.com/树液采集器)页面的操作处理，不要为了清理树位直接砍挂着采集器的树。雷击或炸弹还可能连设备和当前产物一起损坏，所以采集区要和日常爆炸物、雷暴风险一起管理。\n\n### 松焦油拿到后如何确认用途\n\n松焦油有明确用途，不只是挂在树上的副产物。[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面列出的代表性去向包括：工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务。先用这些常见去向判断松焦油是否要留存；具体材料和数量仍按对应物品页面逐项确认。\n\n[松焦油](https://zh.stardewvalleywiki.com/松焦油)页面列出了这件物品的基础售价；但单价不能推出“松树最赚钱”的树木收益排名。如果你的目标是稳定拿到松焦油，先把种植位、成长排错和采集器周期做好，再按当前存档的制作门槛决定是否继续扩种；不要只看售价决定整片树区。\n\n最后按这张检查表收尾：\n\n- 手里的是松果，不是把 Pine Tree 目录名当成种子。\n- 农场外不需要先锄地，也不要把树种放在已锄过的农场外格子；农场内按当前中文松果页检查格子未占用、可耕种且未用锄头，当前地图还要允许种树。\n- 普通树不需要浇水，但不代表可以忽略种植格和地图条件。\n- 第 4 阶段卡住时，八个相邻格没有成熟普通树。\n- 冬季、树肥和农场外自然树分别看：未施树肥的普通树冬季通常不生长；树肥可让普通树在冬季继续推进；农场外自然树按所在区域的自然树规则判断。\n- 树成熟后，普通采集器按 5 天、重型采集器按 2 天规划；不要拿这两个数字倒推成熟时间。\n\n## 来源\n\n下列公开页面可用来查阅松树、松果、普通树、采集器、树肥和松焦油的游戏规则与布局工具边界：中文 Stardew Valley Wiki 介绍这些游戏对象和规则，官方 1.6 更新说明列出城镇与海滩农场隧道的种树限制，本站中文树木页和规划器说明布局工具可以做什么、不能做什么。\n\n- [Stardew Valley Wiki 中文：松树](https://zh.stardewvalleywiki.com/松树)\n- [Stardew Valley Wiki 中文：松果](https://zh.stardewvalleywiki.com/松果)\n- [Stardew Valley Wiki 中文：树](https://zh.stardewvalleywiki.com/树)\n- [Stardew Valley Wiki 中文：树液采集器](https://zh.stardewvalleywiki.com/树液采集器)\n- [Stardew Valley Wiki 中文：重型树液采集器](https://zh.stardewvalleywiki.com/重型树液采集器)\n- [Stardew Valley Wiki 中文：树肥](https://zh.stardewvalleywiki.com/树肥)\n- [Stardew Valley Wiki 中文：松焦油](https://zh.stardewvalleywiki.com/松焦油)\n- [Stardew Valley 1.6 更新完整改动](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/)\n- [本站：星露谷种树：普通树和果树的区别](/zh/stardew-valley-trees)\n",
  "bodyHash": "48b642e15cb7678638e8891a4c137b8260be1aa8324465b8801f9bafccf3a92e",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 12171,
  "bodyLineCount": 101,
  "seo": {
    "title": "星露谷松树种植先看格子，不浇水也不能随便种",
    "h1": "星露谷松树种植先看格子，不浇水也不能随便种",
    "description": "松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。",
    "slug": "pine-tree-stardew",
    "faq": null,
    "faqInLockedBody": false,
    "faqHeading": null,
    "sourcesInLockedBody": true,
    "sourcesHeading": "来源",
    "schema": {
      "@type": "Article",
      "notFaqPage": true
    },
    "og": {
      "title": "星露谷松树种植先看格子，不浇水也不能随便种",
      "description": "松果种下前先核对种植格和地图限制；树苗卡在第 4 阶段时查八邻格成熟树，再分季节、树肥和自然树条件。成熟后普通与重型树液采集器分别 5 天、2 天得到松焦油。",
      "openGraphType": "article",
      "image": "/blog/pine-tree-stardew-cover.webp"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-zh-pine-tree",
      "label": "Stardew Valley Wiki 中文：松树",
      "url": "https://zh.stardewvalleywiki.com/松树",
      "appliesTo": [
        {
          "quote": "松树属于普通树",
          "occurrence": 1
        },
        {
          "quote": "成熟松树掉在地上的未发芽松果",
          "occurrence": 1
        },
        {
          "quote": "可以砍伐或挂采集器",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-pine-cone",
      "label": "Stardew Valley Wiki 中文：松果",
      "url": "https://zh.stardewvalleywiki.com/松果",
      "appliesTo": [
        {
          "quote": "农场外不需要先锄地，也不要把树种放在已经锄过的农场外格子",
          "occurrence": 1
        },
        {
          "quote": "格子未被占用、属于可耕种格，而且没有被锄头开垦",
          "occurrence": 1
        },
        {
          "quote": "采集等级达到 1 后摇晃或砍倒松树",
          "occurrence": 1
        },
        {
          "quote": "成熟松树掉在地上的未发芽松果",
          "occurrence": 1
        },
        {
          "quote": "杂货店不卖松果",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-trees",
      "label": "Stardew Valley Wiki 中文：树",
      "url": "https://zh.stardewvalleywiki.com/树",
      "appliesTo": [
        {
          "quote": "不需要像作物那样每天浇水",
          "occurrence": 1
        },
        {
          "quote": "普通树不要求周围土地全部清空",
          "occurrence": 1
        },
        {
          "quote": "树苗就会永远停在第 4 阶段",
          "occurrence": 1
        },
        {
          "quote": "成熟树占据树苗八邻格时阻止继续成长",
          "occurrence": 1
        },
        {
          "quote": "在非冬季每晚约有 20% 的机会进入下一阶段",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-tapper",
      "label": "Stardew Valley Wiki 中文：树液采集器",
      "url": "https://zh.stardewvalleywiki.com/树液采集器",
      "appliesTo": [
        {
          "quote": "普通采集器 5 天",
          "occurrence": 1
        },
        {
          "quote": "挂在松树上的采集器冬季继续工作",
          "occurrence": 1
        },
        {
          "quote": "配方从采集等级 4 开始",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-heavy-tapper",
      "label": "Stardew Valley Wiki 中文：重型树液采集器",
      "url": "https://zh.stardewvalleywiki.com/重型树液采集器",
      "appliesTo": [
        {
          "quote": "重型采集器 2 天",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-tree-fertilizer",
      "label": "Stardew Valley Wiki 中文：树肥",
      "url": "https://zh.stardewvalleywiki.com/树肥",
      "appliesTo": [
        {
          "quote": "必须施在已经种下的树种、树苗或小树上",
          "occurrence": 1
        },
        {
          "quote": "对普通树来说，树肥可以让它在冬季继续推进",
          "occurrence": 1
        },
        {
          "quote": "果树和茶树不适用",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-zh-pine-tar",
      "label": "Stardew Valley Wiki 中文：松焦油",
      "url": "https://zh.stardewvalleywiki.com/松焦油",
      "appliesTo": [
        {
          "quote": "松焦油有明确用途",
          "occurrence": 1
        },
        {
          "quote": "工艺室的异国情调采集收集包可选项、织布机、生长激素（Speed-Gro）、雨水图腾、裁缝，以及木跃鱼鱼塘任务",
          "occurrence": 1
        },
        {
          "quote": "页面列出了这件物品的基础售价",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "official-1-6-changelog",
      "label": "Stardew Valley 1.6 更新完整改动",
      "url": "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
      "appliesTo": [
        {
          "quote": "不能在城镇或海滩农场的隧道里种树",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "site-zh-general-trees",
      "label": "本站：星露谷种树：普通树和果树的区别",
      "url": "https://stardewvalleyplanner.art/zh/stardew-valley-trees",
      "appliesTo": [
        {
          "quote": "规划器可以帮助你做布局示意",
          "occurrence": 1
        }
      ]
    }
  ],
  "publicRequirements": {
    "route": {
      "slug": "pine-tree-stardew",
      "enPath": "/pine-tree-stardew",
      "zhPath": "/zh/pine-tree-stardew",
      "appendSlugAtEndOfBlogPostSlugs": true,
      "matchesZhSlug": true
    },
    "registry": {
      "titleEqualsH1": true,
      "topic": "星露谷物语指南",
      "author": "星露谷规划器团队",
      "featured": true,
      "readTimeMinutes": 13,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "status": "complete"
    },
    "sources": {
      "renderFromLockedBody": true,
      "heading": "来源",
      "component": "BlogSources",
      "checkedLabel": "下列公开页面可用来查阅松树、松果、普通树、采集器、树肥和松焦油的游戏规则与布局工具边界：中文 Stardew Valley Wiki 介绍这些游戏对象和规则，官方 1.6 更新说明列出城镇与海滩农场隧道的种树限制，本站中文树木页和规划器说明布局工具可以做什么、不能做什么。",
      "itemOrder": [
        "wiki-zh-pine-tree",
        "wiki-zh-pine-cone",
        "wiki-zh-trees",
        "wiki-zh-tapper",
        "wiki-zh-heavy-tapper",
        "wiki-zh-tree-fertilizer",
        "wiki-zh-pine-tar",
        "official-1-6-changelog",
        "site-zh-general-trees"
      ],
      "items": [
        {
          "label": "Stardew Valley Wiki 中文：松树",
          "href": "https://zh.stardewvalleywiki.com/松树"
        },
        {
          "label": "Stardew Valley Wiki 中文：松果",
          "href": "https://zh.stardewvalleywiki.com/松果"
        },
        {
          "label": "Stardew Valley Wiki 中文：树",
          "href": "https://zh.stardewvalleywiki.com/树"
        },
        {
          "label": "Stardew Valley Wiki 中文：树液采集器",
          "href": "https://zh.stardewvalleywiki.com/树液采集器"
        },
        {
          "label": "Stardew Valley Wiki 中文：重型树液采集器",
          "href": "https://zh.stardewvalleywiki.com/重型树液采集器"
        },
        {
          "label": "Stardew Valley Wiki 中文：树肥",
          "href": "https://zh.stardewvalleywiki.com/树肥"
        },
        {
          "label": "Stardew Valley Wiki 中文：松焦油",
          "href": "https://zh.stardewvalleywiki.com/松焦油"
        },
        {
          "label": "Stardew Valley 1.6 更新完整改动",
          "href": "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/"
        },
        {
          "label": "本站：星露谷种树：普通树和果树的区别",
          "href": "/zh/stardew-valley-trees"
        }
      ]
    },
    "faq": null,
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "component": "BlogSources",
      "href": "/zh#planner",
      "className": "blog-planner-link",
      "heading": "来源",
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/pine-tree-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures",
      "alt": "松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。",
      "altStatus": "verified_from_actual_file",
      "assetStatus": "received_local_validated",
      "filePath": "public/blog/pine-tree-stardew-cover.webp",
      "avifSrc": "/blog/pine-tree-stardew-cover.avif",
      "avifFilePath": "public/blog/pine-tree-stardew-cover.avif",
      "webpBytes": 32094,
      "webpSha256": "4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517",
      "avifBytes": 19430,
      "avifSha256": "6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1",
      "formatDetail": "Lossy VP8 WebP (Chunk VP8) plus AVIF sibling",
      "webpBudgetBytes": 1310720,
      "assetReceipt": "docs/blog-ops/pine-tree-stardew/G-assets-receipt.md"
    },
    "figures": [
      {
        "id": "figure-1",
        "src": "/blog/illustrations/pine-tree-seed-to-tar.webp",
        "placement": "After the object-mapping table and before the planting section.",
        "type": "explanatory illustration; not a gameplay screenshot",
        "alt": "图示：松果对应松树；普通树长成成熟松树后，树液采集器产出松焦油。这是规则关系示意图，不是游戏截图。",
        "caption": "松果 → 普通松树 → 成熟松树上的树液采集器 → 松焦油。图中表达对象关系，不表示固定成长天数或收益排名。",
        "width": 1672,
        "height": 941,
        "loading": "lazy",
        "assetStatus": "received_local_validated",
        "filePath": "public/blog/illustrations/pine-tree-seed-to-tar.webp",
        "avifSrc": "/blog/illustrations/pine-tree-seed-to-tar.avif",
        "avifFilePath": "public/blog/illustrations/pine-tree-seed-to-tar.avif",
        "webpBytes": 23214,
        "webpSha256": "42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d",
        "avifBytes": 17100,
        "avifSha256": "bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544",
        "formatDetail": "Lossy VP8 WebP (Chunk VP8) plus AVIF sibling",
        "webpBudgetBytes": 409600,
        "assetReceipt": "docs/blog-ops/pine-tree-stardew/G-assets-receipt.md"
      },
      {
        "id": "figure-2",
        "src": "/blog/illustrations/pine-tree-stage-four-neighbor.webp",
        "placement": "After the eight-neighbor stage-4 diagnosis.",
        "type": "explanatory illustration; not a gameplay screenshot",
        "alt": "示意图：以未长大的松树苗为中心检查八个相邻格；成熟邻树会阻止它越过第 4 阶段，修正方案把树干错开一格。这不是游戏截图或物理碰撞框。",
        "caption": "先检查树苗周围八个相邻格；成熟邻树会卡住第 4 阶段。树干之间留一格是便于布局和排错的做法，不是果树 3×3 规则。",
        "width": 1672,
        "height": 941,
        "loading": "lazy",
        "assetStatus": "received_local_validated",
        "filePath": "public/blog/illustrations/pine-tree-stage-four-neighbor.webp",
        "avifSrc": "/blog/illustrations/pine-tree-stage-four-neighbor.avif",
        "avifFilePath": "public/blog/illustrations/pine-tree-stage-four-neighbor.avif",
        "webpBytes": 20746,
        "webpSha256": "1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5",
        "avifBytes": 15994,
        "avifSha256": "60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0",
        "formatDetail": "Lossy VP8 WebP (Chunk VP8) plus AVIF sibling",
        "webpBudgetBytes": 409600,
        "assetReceipt": "docs/blog-ops/pine-tree-stardew/G-assets-receipt.md"
      }
    ],
    "metadataStatus": "complete"
  },
  "metadata": {
    "canonicalPath": "/zh/pine-tree-stardew",
    "alternateLanguagePath": "/pine-tree-stardew",
    "locale": "zh-CN",
    "country": "CN",
    "robots": {
      "index": true,
      "follow": true
    },
    "openGraphType": "article",
    "schemaType": "Article",
    "faqPage": false,
    "pageBinding": "UNVERIFIED",
    "decisionNotes": {
      "assemblyReadiness": "ready_for_local_assembly",
      "registryMetadata": {
        "topic": "星露谷物语指南",
        "author": "星露谷规划器团队",
        "featured": true,
        "readTimeMinutes": 13,
        "rationale": [
          "topic uses the documented localized convention for this locale.",
          "author is the explicitly authorized team author for this locale.",
          "featured=true is an explicit editorial decision because every current production entry is explicitly true; it is not a runtime default.",
          "readTimeMinutes=13 is an editorial estimate anchored to stardew-valley-trees ZH readTimeMinutes=13 and comparable rendered lengths; it is not a deterministic formula."
        ],
        "readTimeClassification": "editorial_estimate_not_deterministic_formula"
      },
      "verificationBoundary": [
        "metadata.pageBinding remains UNVERIFIED; source registry, localized identity/path binding, article-module binding, and route generation are separate assembly checks.",
        "integrity.build remains NOT_RUN, integrity.deployment remains NOT_RUN, and integrity.userReview remains not_started; this handoff does not claim page, production, deployment, or user approval."
      ]
    }
  },
  "integrity": {
    "bodyHash": "48b642e15cb7678638e8891a4c137b8260be1aa8324465b8801f9bafccf3a92e",
    "bodyByteLength": 12171,
    "bodyLineCount": 101,
    "length": {
      "locale": "zh-CN",
      "mechanical_units": 2499,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "eTitleReceipt": {
      "bodyHash": "48b642e15cb7678638e8891a4c137b8260be1aa8324465b8801f9bafccf3a92e",
      "seoTupleHash": "2e2e2bdb32b9ad6c5ed8b06e50003c748b3f7b41b429cff44dcfec06649933c8"
    },
    "userReview": "not_started",
    "media": "PASS_LOCAL_RECEIPT",
    "page": "UNVERIFIED",
    "build": "NOT_RUN",
    "deployment": "NOT_RUN",
    "bodyFrozen": true,
    "frozen": true,
    "status": "frozen-for-local-assembly; title-review PASS; not user-final; page-browser-QA not claimed",
    "freezePublicBlogHandoff": true,
    "blockedReasons": [],
    "mediaReceipt": {
      "status": "PASS_LOCAL_RECEIPT",
      "receiptFile": "docs/blog-ops/pine-tree-stardew/G-assets-receipt.md",
      "receiptDate": "2026-09-22",
      "scope": "Local asset presence, dimensions, bytes, SHA-256, WebP/AVIF decode, and visual description binding; source registry, page binding, deployment, and external authorization remain separate states.",
      "assets": [
        {
          "role": "cover",
          "webp": {
            "filePath": "public/blog/pine-tree-stardew-cover.webp",
            "publicPath": "/blog/pine-tree-stardew-cover.webp",
            "bytes": 32094,
            "sha256": "4d559005a41e1b64713fb7bf6609a8427bdfcab16c0e48edc851a30545fc6517",
            "width": 1672,
            "height": 941,
            "format": "VP8 WebP (lossy)"
          },
          "avif": {
            "filePath": "public/blog/pine-tree-stardew-cover.avif",
            "publicPath": "/blog/pine-tree-stardew-cover.avif",
            "bytes": 19430,
            "sha256": "6c5127c0859770020f24afb0b803e8a22fac923a65ca575b8eec73d614a2b0a1",
            "width": 1672,
            "height": 941,
            "format": "AVIF"
          }
        },
        {
          "role": "figure-1",
          "webp": {
            "filePath": "public/blog/illustrations/pine-tree-seed-to-tar.webp",
            "publicPath": "/blog/illustrations/pine-tree-seed-to-tar.webp",
            "bytes": 23214,
            "sha256": "42a85ee5c0f45fb4d25a255f0923953ee5df4dfe4bfc2de4cb5b3aee9200488d",
            "width": 1672,
            "height": 941,
            "format": "VP8 WebP (lossy)"
          },
          "avif": {
            "filePath": "public/blog/illustrations/pine-tree-seed-to-tar.avif",
            "publicPath": "/blog/illustrations/pine-tree-seed-to-tar.avif",
            "bytes": 17100,
            "sha256": "bd14f983d87b9eac3ae3e1fe4a8950a15bfd0b86317edd9eafa7310165826544",
            "width": 1672,
            "height": 941,
            "format": "AVIF"
          }
        },
        {
          "role": "figure-2",
          "webp": {
            "filePath": "public/blog/illustrations/pine-tree-stage-four-neighbor.webp",
            "publicPath": "/blog/illustrations/pine-tree-stage-four-neighbor.webp",
            "bytes": 20746,
            "sha256": "1fa68fda236109cdd3221cecede4714a99f900c62a24b4771f046e910d44f2b5",
            "width": 1672,
            "height": 941,
            "format": "VP8 WebP (lossy)"
          },
          "avif": {
            "filePath": "public/blog/illustrations/pine-tree-stage-four-neighbor.avif",
            "publicPath": "/blog/illustrations/pine-tree-stage-four-neighbor.avif",
            "bytes": 15994,
            "sha256": "60c95369e3965b51137401600c0b7f33ea086586db8ebb3ebe9d2d02c8b4b3f0",
            "width": 1672,
            "height": 941,
            "format": "AVIF"
          }
        }
      ],
      "visualReview": {
        "method": "Local visual inspection of the actual WebP cover and both WebP figures with functions.view_image; AVIF siblings independently decoded with Pillow.",
        "cover": {
          "status": "PASS",
          "verifiedDescription": "松树山林插画：成熟松树上可见树液采集器和琥珀色松焦油，前景有松果。"
        },
        "figure-1": {
          "status": "PASS",
          "verifiedDescription": "Four-panel explanatory sequence visibly shows a Pine Cone, planted stages, a mature Pine, and a Tapper with amber output; locked figure alt/caption retained.",
          "altCaptionChanged": false
        },
        "figure-2": {
          "status": "PASS",
          "verifiedDescription": "Two-panel grid visibly contrasts a mature neighboring tree blocking the center check with a separated arrangement and eight-neighbor guide; locked figure alt/caption retained.",
          "altCaptionChanged": false
        }
      },
      "commands": [
        {
          "command": "test -s docs/blog-ops/pine-tree-stardew/G-assets-receipt.md",
          "exitCode": 0
        },
        {
          "command": "shasum -a 256 public/blog/pine-tree-stardew-cover.webp public/blog/pine-tree-stardew-cover.avif public/blog/illustrations/pine-tree-seed-to-tar.webp public/blog/illustrations/pine-tree-seed-to-tar.avif public/blog/illustrations/pine-tree-stage-four-neighbor.webp public/blog/illustrations/pine-tree-stage-four-neighbor.avif",
          "exitCode": 0
        },
        {
          "command": "webpinfo public/blog/pine-tree-stardew-cover.webp; webpinfo public/blog/illustrations/pine-tree-seed-to-tar.webp; webpinfo public/blog/illustrations/pine-tree-stage-four-neighbor.webp",
          "exitCode": 0
        },
        {
          "command": "python3 - <<'PY'  # Pillow decode and 1672x941 check for all six assets\nPY",
          "exitCode": 0
        }
      ],
      "provenance": "G-assets-receipt.md records original locally drawn artwork and no copied project sprite; no external licensing, page, deployment, or production claim is made here.",
      "pageBinding": "UNVERIFIED"
    },
    "scopeReceipt": {
      "status": "PASS_TARGET_ONLY_FOR_THIS_DISPATCH",
      "targetPaths": [
        "docs/blog-ops/pine-tree-stardew/handoff-en.md",
        "docs/blog-ops/pine-tree-stardew/handoff-zh.md"
      ],
      "targetPreWriteSha256": {
        "docs/blog-ops/pine-tree-stardew/handoff-en.md": "0dde799b1bdf43bd8297f7fa139281f4f07be67c889afe8ace28c2a142c6d313",
        "docs/blog-ops/pine-tree-stardew/handoff-zh.md": "31bbbf7c8f749657c8d356923f1a068030ddcf4f0b4007ab7e200bdeffabbb60"
      },
      "writeOperation": "This G-META-FINALIZE dispatch opened only the two target handoff paths for writing; no source, article, registry, public asset, report, test, git, or external path was written.",
      "writeOperationExitCode": 0,
      "postWriteCommands": [
        {
          "command": "python3 inline fenced-JSON parse and metadata/protected-field reconciliation",
          "exitCode": 0
        },
        {
          "command": "shasum -a 256 docs/blog-ops/pine-tree-stardew/handoff-en.md docs/blog-ops/pine-tree-stardew/handoff-zh.md",
          "exitCode": 0
        },
        {
          "command": "git diff --check",
          "exitCode": 0
        },
        {
          "command": "awk '/[[:blank:]]$/{print NR \":\" $0; bad=1} END{exit bad}' docs/blog-ops/pine-tree-stardew/handoff-en.md docs/blog-ops/pine-tree-stardew/handoff-zh.md",
          "exitCode": 0
        }
      ],
      "sharedCheckoutNote": "Only the two target handoffs were edited by this dispatch; unrelated shared-checkout paths are reported, not folded into this handoff change.",
      "observedOutOfScopePathsAfterBaseline": [
        "M next-env.d.ts",
        "?? node_modules/",
        "?? src/blog/articles/pine-tree-stardew.en.tsx",
        "?? src/blog/articles/pine-tree-stardew.zh.tsx",
        "?? tsconfig.tsbuildinfo"
      ]
    },
    "validation": {
      "date": "2026-09-22",
      "parseBodySeoMediaStateCommand": "python3 inline validation: parse both fenced JSON records; compare each body to locked body/hash; verify SEO receipt hashes, media paths/bytes/SHA-256/dimensions, explicit validator-shaped registry metadata, and frozen-for-local-assembly status",
      "parseBodySeoMediaStateExitCode": 0,
      "protectedFieldsCommand": "python3 inline reconciliation assertions: body, SEO surface, publicReferences, author, media bytes/hashes, figure records, and source paths unchanged before and after write",
      "protectedFieldsExitCode": 0,
      "assetDecodeCommand": "python3 inline Pillow decode/1672x941 check for all six actual WebP/AVIF files",
      "assetDecodeExitCode": 0,
      "whitespaceCommand": "git diff --check plus awk trailing-whitespace checks on both target handoffs",
      "whitespaceExitCode": 0,
      "publicReferenceCommand": "python3 inline quote/occurrence scan: validate every PublicReference quote against the current locked body",
      "publicReferenceExitCode": 0,
      "metadataDecisionCommand": "python3 inline metadata decision assertions: EN topic/author/featured/readTimeMinutes=Stardew Valley Guides/Stardew Valley Planner Team/true/12; ZH topic/author/featured/readTimeMinutes=星露谷物语指南/星露谷规划器团队/true/13; read times labeled editorial estimates, not a deterministic formula",
      "metadataDecisionExitCode": 0,
      "rawHandoffHashCommand": "shasum -a 256 docs/blog-ops/pine-tree-stardew/handoff-en.md docs/blog-ops/pine-tree-stardew/handoff-zh.md",
      "rawHandoffHashExitCode": 0
    }
  },
  "blockedReasons": []
}
```
