# PublicBlogHandoff (en) — frozen-for-local-assembly

- type: `PublicBlogHandoff` (V7)
- status: **FROZEN FOR LOCAL ASSEMBLY**; title/SEO review is PASS, the local media receipt is PASS, and all required registry metadata is explicit and validator-shaped. This is an assembler-ready handoff, not a page/browser/deployment or user-review claim.
- locale / country: `en` / `US`
- locked body: `19815` UTF-8 bytes, SHA-256 `3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1`; body is NFC and LF-normalized.
- Title/H1: `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar`
- FAQ: `null` (the locked English body has no FAQ heading or FAQ items).
- Media receipt: the local cover and two figure WebP/AVIF siblings are present; dimensions, bytes, SHA-256, formats, and the cover visual description are verified from the actual files. Figure alt/captions remain unchanged.
- Registry metadata: `topic=Stardew Valley Guides`, `author=Stardew Valley Planner Team`, `featured=true`, `readTimeMinutes=12`; read time is an editorial estimate anchored to `stardew-valley-trees` EN (`12`) and comparable rendered lengths, not a deterministic formula.

The JSON below is the frozen, assembler-ready handoff record. Page binding, build, browser, deployment, and user review remain separately tracked and are not claimed here.
```json
{
  "type": "PublicBlogHandoff",
  "version": "V7",
  "status": "frozen-for-local-assembly; title-review PASS; not user-final; page-browser-QA not claimed",
  "ready": true,
  "frozen": true,
  "bodyFrozen": true,
  "locale": "en",
  "country": "US",
  "body": "The Stardew Valley chain is **Pine Cone → Pine Tree → Pine Tar**: plant a Pine Cone, let it become a mature common tree, then place a Tapper on it. Use valid, untilled ground that the game accepts, and do not water the seedling. If growth stops at stage 4, check all eight adjacent tiles for a mature tree; once the Pine is mature, a normal Tapper takes five nights and a Heavy Tapper takes two days, and Pine Tapper production continues through Winter. ([Pine Tree](https://wiki.stardewvalley.net/Pine_Tree), [Pine Cone](https://wiki.stardewvalley.net/Pine_Cone), [Trees](https://wiki.stardewvalley.net/Trees), and [Tapper](https://wiki.stardewvalley.net/Tapper))\n\n## Identify the Pine Cone, Pine Tree, and Pine Tar chain\n\n### A Pine Cone grows a common Pine Tree\n\nA Pine Cone is the item you plant when you want a Pine Tree. This is a common-tree path, not a fruit-tree sapling path: the surrounding rules are different, the seedling does not need crop-style watering, and a mature-tree neighbor can block late growth. Start by matching the item in your inventory to the tree you want. A Maple Seed grows a Maple Tree and an Acorn grows an Oak Tree; neither is a substitute for a Pine Cone when the desired Tapper output is Pine Tar. The [Pine Cone reference](https://wiki.stardewvalley.net/Pine_Cone) and [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) keep that input-to-tree relationship explicit.\n\n### A mature Pine gives Pine Tar through a Tapper\n\nPine Tar is the normal Tapper output for a mature Pine. The Tapper step comes after tree growth, so do not use the production interval as a promise about how fast the seedling will mature. First solve the planting and growth conditions; then attach the Tapper when the tree is fully grown. The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) and [Tapper reference](https://wiki.stardewvalley.net/Tapper) support the output and timing below.\n\n![Explanatory illustration showing a Pine Cone, planted common-tree stages, a mature Pine with a Tapper, and Pine Tar; not a gameplay screenshot.](/blog/illustrations/pine-tree-seed-to-tar.webp)\n\n*Figure: Pine Cone leads to a Pine Tree, and only a mature Pine enters the Tapper-to-Pine-Tar step. This is an explanatory illustration, not a gameplay screenshot; it does not show a fixed growth countdown.*\n\nThe figure is useful as an object check: if the item you have is not a Pine Cone, or if the tree is not mature, you are not yet at the Pine Tar step. A layout tool can help you reserve space for the tree and Tapper, but the game rules still decide whether the seed grows and when the Tapper produces.\n\n## Get a Pine Cone and plant it under the valid map rules\n\n### Verified ways to obtain a Pine Cone\n\nThe most direct sources are existing Pine Trees and normal game-world collection. The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) lists these routes:\n\n- Shake or chop a Pine Tree after reaching Foraging level 1.\n- Dig a Pine Cone from a fully grown farm Pine Tree with an Axe or Pickaxe.\n- Check Garbage Cans.\n- Use a Woodskip Fish Pond at population 9, which can produce 1–5 Pine Cones.\n- Buy one from the Traveling Cart when it appears; the listed price range is 100g–1,000g, so this is a conditional source rather than a dependable planting schedule.\n\nThere is a small timing detail for the Foraging-level route. The [Trees page](https://wiki.stardewvalley.net/Trees) distinguishes seeds obtained by shaking from seeds obtained by chopping: after reaching Foraging level 1, the chopped-tree seed drop requires sleeping through the level-up screen, while shaking can provide seeds as soon as the level-up occurs. If you are trying to start a Pine row immediately, use the source that is actually available on your save instead of treating every route as unlocked at the same moment.\n\nThe relevant decision is simple: obtain a Pine Cone, choose a valid tile, and keep the seedling’s eight neighboring tiles in mind while it grows.\n\n### Plant on valid, untilled ground and do not water it\n\nPlant a Pine Cone on valid ground that the game accepts and that has not been tilled. Use an accepted bare tile, not crop soil prepared for planting, and keep the map limits below in mind. The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) supports the planting condition.\n\nPine is a common tree, so its seedling does not need daily watering. The [Trees page](https://wiki.stardewvalley.net/Trees) also states that the surrounding land does not have to be completely empty before you plant. That does **not** mean every occupied neighbor is harmless: a mature tree in the eight adjacent tiles can still stop the seedling at stage 4, which is why planting space and growth diagnosis belong together.\n\nDo not import crop habits into this step:\n\n1. Do not water the Pine Cone as if it were a crop.\n2. Do not put it on tilled crop soil and assume the seed will behave like a seasonal crop.\n3. Do not clear every nearby tile just because a common tree is not a fruit tree.\n4. Do inspect nearby mature trees before concluding that fertilizer or Winter caused the stall.\n\nThe 1.6 changelog adds map limits that matter when choosing a tile. The [official Stardew Valley 1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) says trees can no longer be planted in town or in the Beach Farm tunnel. General tree guidance is therefore not permission to plant on any visually open square; the map and tile must accept the action.\n\n### Farm trees and natural trees are not the same placement decision\n\nYou can also encounter Pine Trees growing naturally outside the farm. The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supports the general outside-farm interaction, while the [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) gives examples such as Cindersap Forest, the Railroad, and around the Carpenter’s Shop. The broader [Trees reference](https://wiki.stardewvalley.net/Trees) lists additional common-tree locations, but it also records interaction limits: some town trees are scenery, and trees west of the river cannot be chopped or tapped even though they can be shaken.\n\nUse the action you actually need as the test. A natural tree that can be shaken is not automatically a tree that can be chopped or tapped. A place that looks empty is not automatically valid for planting. For a wider mixed-tree layout, the site’s [general Stardew Valley tree layout guide](/stardew-valley-trees) covers the common-tree and fruit-tree planning distinction; the Pine-specific checks on this page determine whether this particular seedling can progress and produce Pine Tar.\n\n## Fix a Pine seedling that stops at stage 4\n\n### Check all eight adjacent tiles\n\nA common-tree seedling can stop at stage 4 when a mature tree occupies any of the eight tiles around it. Check the four cardinal neighbors and the four diagonal neighbors. The [Trees page](https://wiki.stardewvalley.net/Trees) describes the rule precisely: a mature tree in that eight-tile ring blocks the seedling from passing stage 4.\n\nThis is a symptom-based check, not a guess about the seed, fertilizer, or visual size of the tree. Start at the seedling and inspect the full 3-by-3 area around it, excluding the center tile. If you only check north, south, east, and west, you can miss the diagonal tree that is actually blocking the transition.\n\nThe practical fix is to remove or avoid the mature neighbor. If the neighbor must remain, replant the Pine Cone in a position with a clear eight-neighbor ring. Leaving one empty tile between a seedling and a mature tree is an easy layout habit because it avoids the adjacent ring without requiring a tile-by-tile diagnosis every morning. That one-tile gap is **layout advice**, not a Pine physical-footprint rule and not the fruit-tree 3-by-3 orchard rule.\n\n![Explanatory grid showing a Pine seedling at center, eight adjacent tiles, a mature neighboring tree blocking stage 4, and a corrected one-tile gap; not a gameplay screenshot.](/blog/illustrations/pine-tree-stage-four-neighbor.webp)\n\n*Figure: The center Pine seedling is checked against all eight adjacent tiles. A mature neighboring tree blocks progress beyond stage 4; the separated example shows a practical gap, not a fruit-tree 3-by-3 clearance requirement.*\n\n### Use the visual check before changing the growth method\n\nFertilizer is not the first diagnostic step for a stage-4 stall. First answer these questions:\n\n- Is there a mature tree in any of the eight adjacent tiles, including a diagonal?\n- Is the seedling planted on a valid, un-tilled tile?\n- Is the current season one in which ordinary unfertilized trees can grow?\n- Is the tree on a map with a documented exception?\n\nIf the eight-neighbor ring is clear, move to the seasonal growth rules. If the ring is blocked, changing fertilizer or waiting for a particular day does not address the visible cause. Use the [Trees page](https://wiki.stardewvalley.net/Trees) as the rule source for this diagnosis.\n\n## Choose normal growth or Tree Fertilizer without inventing a timer\n\n### Unfertilized growth has seasonal and map conditions\n\nFor ordinary common-tree growth, the [Trees reference](https://wiki.stardewvalley.net/Trees) describes a 20% chance of advancing each night in Spring, Summer, or Fall. Stage 4 takes twice as long as the earlier stages. Ordinary trees do not grow in Winter under the normal rule, so an unfertilized Pine seedling that reaches the end of Fall without maturing should not be treated like a Winter crop that will keep advancing.\n\nThe same rule should not be stretched across every map. The [Trees page](https://wiki.stardewvalley.net/Trees) records map-level exceptions involving the Desert and Ginger Island. If the Pine is outside the ordinary farm/natural-tree context, check the map condition before applying the normal Winter statement. A map exception changes the decision; it is not a reason to promise a universal calendar.\n\nA seedling also remains subject to the stage-4 neighbor rule. Seasonal odds do not make a mature adjacent tree disappear, and a valid season does not turn a blocked eight-neighbor ring into a clear one.\n\n### Tree Fertilizer starts after planting\n\nTree Fertilizer is for an already planted wild-tree seed or sapling. Apply it to the planted Pine; do not treat it as a pre-plant seed coating, and do not use it as a fruit-tree growth rule. The [Tree Fertilizer reference](https://wiki.stardewvalley.net/Tree_Fertilizer) says it advances most wild trees one stage each night, with the final stage taking two nights. Under that documented behavior, the [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) says a normal Pine can mature in five days, even in Winter.\n\nThat five-day result is a **fertilized growth path**, not an unfertilized Pine countdown. It also does not replace the adjacency check. If a mature neighbor is blocking stage 4, clear or avoid the blocking arrangement before relying on any growth method. If you are choosing between waiting and fertilizing, the useful distinction is:\n\n| Growth path | What you can safely rely on | What not to assume |\n|---|---|---|\n| Unfertilized Pine | 20% nightly advancement in Spring, Summer, or Fall; stage 4 takes twice as long; ordinary Winter behavior has map exceptions | One guaranteed maturity date for every Pine |\n| Tree Fertilizer | Apply after planting; most stages advance one per night, the final stage takes two nights; a normal Pine can mature in five days under this path | That fertilizer overrides a mature adjacent tree or turns the Pine into a fruit tree |\n\n### Why there is no single safe “Pine takes X days” answer\n\nThe current Pine references do not agree on one growth-time summary. The [Pine Tree page](https://wiki.stardewvalley.net/Pine_Tree) gives a 24-day median, the [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) gives a median of about 18 days, and the [Trees page](https://wiki.stardewvalley.net/Trees) gives a 24-day median with separate 90th- and 99th-percentile figures. Those pages cannot be compressed into one guaranteed unfertilized countdown without resolving the conflict.\n\nPlan from rules you can observe instead:\n\n1. For an unfertilized Pine, allow for nightly probability, stage 4 taking longer, and ordinary Winter behavior.\n2. For a fertilized Pine, apply the item after planting and use the five-day documented path as the method-specific expectation, not as a universal Pine statistic.\n3. Before attaching a Tapper, inspect the tree itself and confirm that it is mature.\n4. Do not draw a growth calendar using 18, 24, 38, or 55 as if one number were settled for every Pine and every map.\n\nThis is more useful than a false date because the date conflict is exactly where a late-season layout or Tapper plan can fail.\n\n## Tap a mature Pine and collect Pine Tar through Winter\n\n### Normal Tapper: five nights\n\nAttach a normal Tapper only after the Pine is mature. The [Tapper reference](https://wiki.stardewvalley.net/Tapper) lists Pine Tar from a Pine on a five-night interval. This is production time after the tree has reached maturity; it is not the time required for a Pine Cone to become a tree.\n\nIn the 1.6 rules, the normal Tapper recipe is tied to Foraging level 4. The official [1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) records the recipe-level change, while the [Tapper page](https://wiki.stardewvalley.net/Tapper) gives the current item and placement details. A normal Tapper is enough when you only need the standard Pine Tar interval; do not attach it to a seedling and expect the timer to begin.\n\n### Heavy Tapper: two days\n\nA Heavy Tapper is a separate item with a two-day Pine Tar interval. Keep that number separate from the normal five-night interval: it is not “five nights, but sometimes faster,” and it is not a tree-growth modifier. If a layout contains both Tapper types, label the trees or rows so you do not read one collection date as the other.\n\n| Tapper | Mature Pine output interval | What the interval means |\n|---|---:|---|\n| Normal Tapper | 5 nights | Pine Tar production after the Tapper is attached to a mature Pine |\n| Heavy Tapper | 2 days | Faster Tapper production; it does not accelerate tree growth |\n\nThe [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) and [Tapper reference](https://wiki.stardewvalley.net/Tapper) support both intervals. Use the exact five-night and two-day entries rather than an approximate interval when you plan collection days.\n\n### Pine Tapper production continues in Winter\n\nPine Tapper production continues in Winter. This matters when you decide whether to chop a mature Pine at the end of Fall: an unfertilized seedling normally stops growing in Winter, but an already mature Pine with a Tapper can continue producing Pine Tar. The [Pine Tree](https://wiki.stardewvalley.net/Pine_Tree), [Pine Tar](https://wiki.stardewvalley.net/Pine_Tar), and [Tapper](https://wiki.stardewvalley.net/Tapper) pages support that distinction.\n\nNatural-tree interaction still has map limits. A Pine that can be tapped in a natural location is a useful standing resource; a decorative town tree that cannot be tapped is not. Check the location’s interaction rule instead of assuming that every visible Pine accepts a Tapper.\n\n## Use Pine Tar after the Tapper starts\n\n### Verified uses that can change the keep-or-chop decision\n\nPine Tar is more than an item to sell. The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) verifies several uses:\n\n- One Pine Tar is used to craft a Loom.\n- One Pine Tar and five Moss are used for Speed-Gro.\n- Five Pine Tar are used for a Rain Totem.\n- Pine Tar can be an option for the Exotic Foraging Bundle.\n- Pine Tar can be used in Floppy Beanie tailoring.\n- A Woodskip Fish Pond can request Pine Tar.\n\nYou do not need every use to decide whether to keep a Pine. If a Loom, Speed-Gro, Rain Totem, bundle, clothing project, or Woodskip request is on your current plan, the Tapper output has a concrete job. If none of those uses matters and you only need open space, the layout decision can be different; the page does not need to turn that choice into a universal “best tree” ranking.\n\n### Pine Tar value is not a tree-profit ranking\n\nThe listed base sell price for Pine Tar is 100g. The Tapper Profession raises the displayed value to 125g, while the Artisan Profession does not add its Artisan bonus to Pine Tar. Those are Pine Tar item values, not a comparison of Pine against Maple, Oak, or every other tree over a shared time horizon. The [Pine Tar page](https://wiki.stardewvalley.net/Pine_Tar) supports the item values. A Pine Tar price alone cannot rank trees under a shared time horizon.\n\nThat boundary matters whenever someone asks for the “most profitable tree.” A price for one Tapper product is not enough to rank trees unless the comparison also fixes Tapper type, profession, time horizon, availability, and which products count. Keep the Pine because its output serves your plan, not because one displayed price proves a cross-tree winner.\n\nBefore you leave a Pine Cone in the ground or walk away from a mature Pine, run this short check:\n\n1. **Match the objects:** Pine Cone grows a Pine Tree; mature Pine plus Tapper produces Pine Tar.\n2. **Check the tile:** use valid, untilled ground, and remember that town and Beach Farm tunnel planting restrictions still apply.\n3. **Skip watering:** common-tree seedlings do not need crop watering.\n4. **Inspect stage 4:** check all eight adjacent tiles, including diagonals, for a mature tree.\n5. **Choose the growth path:** unfertilized growth follows seasonal/map rules; Tree Fertilizer starts after planting and has its own five-day normal-Pine path.\n6. **Avoid a false countdown:** current Pine references disagree on the unfertilized median, so do not plan from one guaranteed day.\n7. **Wait for maturity:** attach a normal or Heavy Tapper only to a mature Pine.\n8. **Use the right interval:** five nights for a normal Tapper, two days for a Heavy Tapper, with Pine production continuing through Winter.\n9. **Name one use:** keep the tree when Pine Tar has a job such as a Loom, Speed-Gro, Rain Totem, bundle, tailoring, or Woodskip request.\n\n## Sources\n\nThe following public pages support the specific Pine identity, planting, growth, Tapper, map-limit, and use claims in this draft. The current Pine references disagree on an unfertilized growth median, so this draft preserves that conflict instead of selecting one number.\n\n- [Stardew Valley Wiki: Pine Tree](https://wiki.stardewvalley.net/Pine_Tree) — Pine identity, Pine Tar output, common-tree behavior, natural Pine interaction, and the Pine-specific growth summary.\n- [Stardew Valley Wiki: Pine Cone](https://wiki.stardewvalley.net/Pine_Cone) — Pine Cone sources, planting conditions, and the conflicting growth summary.\n- [Stardew Valley Wiki: Trees](https://wiki.stardewvalley.net/Trees) — common-tree watering, eight-neighbor stage-4 rule, seasonal/map exceptions, and natural-tree limits.\n- [Stardew Valley Wiki: Pine Tar](https://wiki.stardewvalley.net/Pine_Tar) — Tapper output, Pine Tar values, uses, and Winter production context.\n- [Stardew Valley Wiki: Tapper](https://wiki.stardewvalley.net/Tapper) — normal and Heavy Tapper intervals, recipe/placement context, and Winter production.\n- [Stardew Valley Wiki: Tree Fertilizer](https://wiki.stardewvalley.net/Tree_Fertilizer) — apply-after-planting behavior, five-day fertilized Pine path, and Winter growth.\n- [Stardew Valley 1.6 Update Full Changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) — official town/Beach Farm tunnel planting restrictions and Tapper recipe-level context.\n\n",
  "bodyHash": "3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1",
  "bodyFormat": "markdown",
  "bodyEncoding": "UTF-8",
  "bodyNormalization": "NFC",
  "bodyLineEnding": "LF",
  "bodyByteLength": 19815,
  "bodyLineCount": 184,
  "seo": {
    "title": "Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar",
    "h1": "Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar",
    "description": "Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.",
    "slug": "pine-tree-stardew",
    "faq": null,
    "faqInLockedBody": false,
    "faqHeading": null,
    "sourcesInLockedBody": true,
    "sourcesHeading": "Sources",
    "schema": {
      "@type": "Article",
      "notFaqPage": true
    },
    "og": {
      "title": "Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar",
      "description": "Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.",
      "openGraphType": "article",
      "image": "/blog/pine-tree-stardew-cover.webp"
    }
  },
  "publicReferences": [
    {
      "id": "wiki-pine-tree",
      "label": "Stardew Valley Wiki: Pine Tree",
      "url": "https://wiki.stardewvalley.net/Pine_Tree",
      "appliesTo": [
        {
          "quote": "A Pine Cone is the item you plant when you want a Pine Tree.",
          "occurrence": 1
        },
        {
          "quote": "The [Pine Tree reference](https://wiki.stardewvalley.net/Pine_Tree) supports the general outside-farm interaction,",
          "occurrence": 1
        },
        {
          "quote": "says a normal Pine can mature in five days, even in Winter.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pine-cone",
      "label": "Stardew Valley Wiki: Pine Cone",
      "url": "https://wiki.stardewvalley.net/Pine_Cone",
      "appliesTo": [
        {
          "quote": "The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) lists these routes:",
          "occurrence": 1
        },
        {
          "quote": "The [Pine Cone page](https://wiki.stardewvalley.net/Pine_Cone) supports the planting condition.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-trees",
      "label": "Stardew Valley Wiki: Trees",
      "url": "https://wiki.stardewvalley.net/Trees",
      "appliesTo": [
        {
          "quote": "The [Trees page](https://wiki.stardewvalley.net/Trees) describes the rule precisely: a mature tree in that eight-tile ring blocks the seedling from passing stage 4.",
          "occurrence": 1
        },
        {
          "quote": "For ordinary common-tree growth, the [Trees reference](https://wiki.stardewvalley.net/Trees) describes a 20% chance of advancing each night in Spring, Summer, or Fall.",
          "occurrence": 1
        },
        {
          "quote": "The [Trees page](https://wiki.stardewvalley.net/Trees) records map-level exceptions involving the Desert and Ginger Island.",
          "occurrence": 1
        },
        {
          "quote": "The broader [Trees reference](https://wiki.stardewvalley.net/Trees) lists additional common-tree locations, but it also records interaction limits:",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-pine-tar",
      "label": "Stardew Valley Wiki: Pine Tar",
      "url": "https://wiki.stardewvalley.net/Pine_Tar",
      "appliesTo": [
        {
          "quote": "the [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) gives examples such as Cindersap Forest, the Railroad, and around the Carpenter’s Shop.",
          "occurrence": 1
        },
        {
          "quote": "The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) verifies several uses:",
          "occurrence": 1
        },
        {
          "quote": "The [Pine Tar page](https://wiki.stardewvalley.net/Pine_Tar) supports the item values.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-tapper",
      "label": "Stardew Valley Wiki: Tapper",
      "url": "https://wiki.stardewvalley.net/Tapper",
      "appliesTo": [
        {
          "quote": "The [Tapper reference](https://wiki.stardewvalley.net/Tapper) lists Pine Tar from a Pine on a five-night interval.",
          "occurrence": 1
        },
        {
          "quote": "The [Pine Tar reference](https://wiki.stardewvalley.net/Pine_Tar) and [Tapper reference](https://wiki.stardewvalley.net/Tapper) support both intervals.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "wiki-tree-fertilizer",
      "label": "Stardew Valley Wiki: Tree Fertilizer",
      "url": "https://wiki.stardewvalley.net/Tree_Fertilizer",
      "appliesTo": [
        {
          "quote": "Tree Fertilizer is for an already planted wild-tree seed or sapling.",
          "occurrence": 1
        },
        {
          "quote": "The [Tree Fertilizer reference](https://wiki.stardewvalley.net/Tree_Fertilizer) says it advances most wild trees one stage each night, with the final stage taking two nights.",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "official-1-6-changelog",
      "label": "Stardew Valley 1.6 Update Full Changelog",
      "url": "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
      "appliesTo": [
        {
          "quote": "The [official Stardew Valley 1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) says trees can no longer be planted in town or in the Beach Farm tunnel.",
          "occurrence": 1
        },
        {
          "quote": "The official [1.6 changelog](https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/) records the recipe-level change,",
          "occurrence": 1
        }
      ]
    },
    {
      "id": "site-stardew-valley-trees",
      "label": "Stardew Valley Planner: Stardew Valley trees guide",
      "url": "https://stardewvalleyplanner.art/stardew-valley-trees",
      "appliesTo": [
        {
          "quote": "the site’s [general Stardew Valley tree layout guide](/stardew-valley-trees) covers the common-tree and fruit-tree planning distinction;",
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
      "topic": "Stardew Valley Guides",
      "author": "Stardew Valley Planner Team",
      "featured": true,
      "readTimeMinutes": 12,
      "articleModuleMustNotRenderH1": true,
      "startWithArticleParagraph": true,
      "status": "complete"
    },
    "sources": {
      "renderFromLockedBody": true,
      "heading": "Sources",
      "component": "BlogSources",
      "checkedLabel": "The following public pages support the specific Pine identity, planting, growth, Tapper, map-limit, and use claims in this draft. The current Pine references disagree on an unfertilized growth median, so this draft preserves that conflict instead of selecting one number.",
      "itemOrder": [
        "wiki-pine-tree",
        "wiki-pine-cone",
        "wiki-trees",
        "wiki-pine-tar",
        "wiki-tapper",
        "wiki-tree-fertilizer",
        "official-1-6-changelog"
      ],
      "items": [
        {
          "label": "Stardew Valley Wiki: Pine Tree",
          "href": "https://wiki.stardewvalley.net/Pine_Tree"
        },
        {
          "label": "Stardew Valley Wiki: Pine Cone",
          "href": "https://wiki.stardewvalley.net/Pine_Cone"
        },
        {
          "label": "Stardew Valley Wiki: Trees",
          "href": "https://wiki.stardewvalley.net/Trees"
        },
        {
          "label": "Stardew Valley Wiki: Pine Tar",
          "href": "https://wiki.stardewvalley.net/Pine_Tar"
        },
        {
          "label": "Stardew Valley Wiki: Tapper",
          "href": "https://wiki.stardewvalley.net/Tapper"
        },
        {
          "label": "Stardew Valley Wiki: Tree Fertilizer",
          "href": "https://wiki.stardewvalley.net/Tree_Fertilizer"
        },
        {
          "label": "Stardew Valley 1.6 Update Full Changelog",
          "href": "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/"
        }
      ]
    },
    "faq": null,
    "cta": {
      "lockAfterSeoMustNotAddNewCtaCopy": true,
      "component": "BlogSources",
      "href": "/#planner",
      "className": "blog-planner-link",
      "heading": "Sources",
      "wikiLinksMustNotUsePlannerClass": true
    },
    "cover": {
      "src": "/blog/pine-tree-stardew-cover.webp",
      "width": 1672,
      "height": 941,
      "format": "VP8 WebP",
      "role": "Header cover; does not replace in-article figures",
      "alt": "Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground.",
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
        "placement": "After the object-mapping section and before Pine Cone acquisition.",
        "type": "explanatory illustration; not a gameplay screenshot",
        "alt": "Explanatory illustration showing a Pine Cone, planted common-tree stages, a mature Pine with a Tapper, and Pine Tar; not a gameplay screenshot.",
        "caption": "Pine Cone leads to a Pine Tree, and only a mature Pine enters the Tapper-to-Pine-Tar step. This is an explanatory illustration, not a gameplay screenshot; it does not show a fixed growth countdown.",
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
        "alt": "Explanatory grid showing a Pine seedling at center, eight adjacent tiles, a mature neighboring tree blocking stage 4, and a corrected one-tile gap; not a gameplay screenshot.",
        "caption": "The center Pine seedling is checked against all eight adjacent tiles. A mature neighboring tree blocks progress beyond stage 4; the separated example shows a practical gap, not a fruit-tree 3-by-3 clearance requirement.",
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
    "canonicalPath": "/pine-tree-stardew",
    "alternateLanguagePath": "/zh/pine-tree-stardew",
    "locale": "en",
    "country": "US",
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
        "topic": "Stardew Valley Guides",
        "author": "Stardew Valley Planner Team",
        "featured": true,
        "readTimeMinutes": 12,
        "rationale": [
          "topic uses the documented localized convention for this locale.",
          "author is the explicitly authorized team author for this locale.",
          "featured=true is an explicit editorial decision because every current production entry is explicitly true; it is not a runtime default.",
          "readTimeMinutes=12 is an editorial estimate anchored to stardew-valley-trees EN readTimeMinutes=12 and comparable rendered lengths; it is not a deterministic formula."
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
    "bodyHash": "3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1",
    "bodyByteLength": 19815,
    "bodyLineCount": 184,
    "length": {
      "locale": "en",
      "mechanical_units": 2478,
      "required_floor": 2000,
      "meets_mechanical_floor": true
    },
    "dBodyCheck": "PASS",
    "eBodyReview": "PASS",
    "eTitleReview": "PASS",
    "eTitleReceipt": {
      "bodyHash": "3b53cbcd1619682a09f7a2b1ee8736b56ee453305957b8241ce4c0951f99a8c1",
      "seoSurfaceHash": "68253435e7dd146886974bc7be7601bb82fb5313e09fd19f11ac289731c194d7"
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
          "verifiedDescription": "Illustrated Pine Tree landscape with a Tapper and amber Pine Tar on a mature Pine, plus Pine Cones in the foreground."
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
