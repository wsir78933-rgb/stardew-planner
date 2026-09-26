# Stardew Fruit — English editorial lock and assembly handoff

F-English, 2026-09-26. Body lock verified; one title/description selected. **E title/SEO review is pending.** This is the reviewable F delivery, not an assertion that the public handoff has passed the remaining E gate, that the route is assembled, or that publication is authorized. After E approves these exact fields, G may consume the public contract below within its own authorized task. No user page review or deployment has occurred.

## 1. Input gate and ownership — editorial record, never render

- Current Task: task_695e7f2f2a48; Dispatch: ctx_6928447469d4; Run: run_89b4db2242cd.
- Only file F may create/update: docs/blog-handoffs/stardew-fruit.en.md. Article, Chinese article, media, registries, tests, configuration and dependencies are outside this writing scope.
- Body: src/blog/articles/stardew-fruit.en.tsx, named export StardewFruitEnglishArticle, no props. The checked-in project format is a TSX component; G must import this exact module, not re-create its prose from this document.
- **Article SHA-256 / bodyHash: d677058821c92fd535cebaf2ac1428cad14934367740cabc196b725f4a85f22d.** Hash the complete UTF-8 TSX module bytes. They already use NFC and LF; normalization produces the same hash. Preserve the final newline. This hash is not the hash of rendered HTML or a word-count extract.
- D PASS: task_3543dc915474 / ctx_dc6e50e75309; full report msg_9331584a40aa and worker_done msg_5fe97f0e6dd2. ResearchTrace, ReaderValue and Repetition passed on the same article hash.
- E content PASS: task_d297cac80ea0 / ctx_c4397fab4d3d; full report msg_12a71a8a7e5f and worker_done msg_e5097ec9b93d. No must-fix, same article hash. F actually read these durable messages and archived E command output; the E result is limited to content/facts/structure.
- Q facts: task_d9c06bcdf546 / ctx_a835f2910466; msg_44696f0fdd88 and msg_eee4576880ec. B intent/layout: task_9abd896afa1d / ctx_5e6763575545; msg_4cebb0abe2ca plus its mandatory correction msg_db57edbb04ca. All old 28-item wording is superseded by the verified 27-item set; Tiller / Bear's Knowledge is a table heading, not another fruit.
- Media provenance read: msg_a3aa629423c6 and msg_56ee9b163c60. The two original generated illustrations do not use game sprites or third-party source artwork. Keep internal prompts and production receipts out of the public page.
- Rules read: V7 unified workflow, content/length gates, title/description rules, Seven Sins Engine, public handoff/assembly rules and original word-count script; project package.json, AGENTS.md, and installed Next 16.3 metadata/OG guide.

If G or E finds a different article hash, stop. Do not update the expected hash to make a changed article pass. Content changes return to C and require D/E review of the new version, then F relocking. F has made no content edits.

## 2. Body promise and scope

Keyword: **stardew fruit**. Locale: **en**. Country: **US as the inherited research record**, not proof of precise US rankings; B recorded Google location/personalization limitations. No new ranking, PAA or search-volume claim is introduced here.

One reader task: given a fruit name, identify its source, season and access conditions, then choose a documented acquisition route or a processing route for fruit already owned. The article is a vanilla reference with 1.6 mechanics. Its strongest verified fact is that the 27 fruit items have mixed, sometimes overlapping sources; only eight belong to the sapling-grown fruit-tree subset. Its practical contribution is the source-to-action crosswalk, with gates and equal-input processing examples in the same reference. This is a description of this article's contribution, not a claim that no other publication explains these facts.

Do not promise profit rankings, gold/day, a fastest method, guaranteed forage/deadlines, every random drop/shop route, greenhouse layouts, 3×3 troubleshooting, gift/recipe completion, mod coverage, or a planner solution to fruit lookup. The listed base sale values are not net profit. A source illustration is not a complete inventory diagram or a game screenshot.

F tempering result: the introduction answers the task, the three source tables and access exceptions support it, the action steps turn lookup into decisions, and the three current FAQs add deadline, winter-access and loading-diagnosis decisions. D/E found no remaining semantic deductions; F found no new gap and changed no prose. V7 mechanical count is **2,634 English units**, above 2,000. This count alone is not a quality verdict.

## 3. Recent-title check

On 2026-09-26 F used local ego-browser TaskSpace 152 to read the live English [blog's Latest articles region](https://stardewvalleyplanner.art/blog). Its first three linked headings were:

1. [Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed](https://stardewvalleyplanner.art/fall-crops-stardew) — contrasting price numbers and an access gate.
2. [Summer Crops in Stardew: Rank by the Shop You Can Open This Morning](https://stardewvalleyplanner.art/summer-crops-stardew) — a ranking promise constrained by shop access.
3. [Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair](https://stardewvalleyplanner.art/rancher-or-tiller-stardew) — level numbers and a consequential choice.

These are the live site's displayed latest three, not a reconstructed publication-date order. The current local registry has additional entries and no publication-date field; F did not substitute its last three entries for live published titles. The selected title avoids a numeric contrast, ranking, morning-urgency device and career-choice lock. Its concrete source lookup instruction shares relevant subject vocabulary without repeating those promises. The task space was finished after reading titles; no local page QA was performed.

## 4. Ten freely generated directions, before mechanism classification

All directions serve the same fruit-reference intent. The angle in each row is an entry into that task, not authorization to expand the article. These are internal candidates, never page content or a menu for the user.

| # | Candidate title | Candidate description | Search intent and reader benefit | Promise risk / disposition |
|---|---|---|---|---|
| 1 | Stardew Fruit: Find Its Source Before Buying Seeds | Find Stardew Valley fruit by crop, tree, or forage source. Check seasons, seed and sapling access, and the inputs needed for Jelly, Wine, or drying. | Fruit lookup before spending: identify the appropriate source and its access conditions. | Does not promise that every fruit has seeds or requires a purchase; description makes the alternatives explicit. Selected. |
| 2 | Stardew Fruit: 27 Items, Eight Fruit-Tree Types | Look up the named fruits by source and season, distinguish saplings from crops and forage, and check the conditions on each route. | Fruit lookup through the item-versus-tree distinction; avoids treating the list as an orchard list. | Both numbers are supported, but the numeric contrast repeats recent-title tactics and puts counting before action. Rejected. |
| 3 | Stardew Fruit: The Name Is Not a Planting Instruction | Match a fruit name to a crop, sapling, or foraging route, then check its season and access requirements before choosing a next step. | Fruit lookup through misleading names; find a source instead of assuming plantability. | Accurate but abstract; a negative statement gives a less direct starting action than #1. Rejected. |
| 4 | Stardew Fruit: Where to Look When You Have No Seeds | Check crop, tree, and forage sources with their seasons and access gates; separate finding a fruit from starting a plant. | Same lookup task for a reader without seeds; reveals collection and tree alternatives. | Could imply a seed-free route exists for every item. The body does not establish that. Rejected. |
| 5 | Stardew Fruit: Crops, Trees, and Wild Sources | Use the fruit reference to compare sources, outdoor seasons, access conditions, and processing inputs for items you already have. | Straight reference lookup; tells the reader which categories the article connects. | Supported but generic; no concrete reason to pause beyond the topic label. Rejected at stop check. |
| 6 | Stardew Fruit: Follow the Source, Then Check the Season | Find a fruit's documented route, check seed or sapling access and seasonal limits, and keep processing inputs on the same basis. | Reference lookup as a sequence; prevents reading a season without its source. | Supported, but the second clause can imply season is the only gate; #1 is more compact and lets description supply conditions. Rejected. |
| 7 | Stardew Fruit: Which Source Can Meet Your Deadline? | Compare the fruit's available routes with access conditions and first-harvest waits; treat random forage and cave drops as uncertain. | Same lookup with a deadline; use the source table to eliminate unavailable routes. | Question can imply a guaranteed solution for every deadline; the FAQ explicitly says the reference may establish none. Rejected. |
| 8 | Stardew Fruit: An Apple Does Not Need Your Own Tree | See how crop, tree, and forage sources overlap, including cave conditions, then use the named-fruit tables to check your next route. | Reference lookup through a concrete cave/tree alternative; separates owning a fruit from growing its source. | Supported conditional example, but spotlights one fruit and may understate the required fruit-bat cave choice. Rejected. |
| 9 | Stardew Fruit: Check the Item Before Loading a Machine | Look up the fruit's source and conditions, then check individual inputs, matching drying batches, and the Grape exception. | Source lookup followed by handling an owned item; avoids incompatible machine input. | Body supports the step, but the headline makes processing diagnosis look like the primary task. Rejected. |
| 10 | Stardew Fruit: A Winter Season Still Needs a Source | Check named fruits against source and access requirements, including winter forage, seed windows, and quest-limited crops. | Fruit lookup through the season-versus-access distinction; prevents assuming availability. | True but winter-specific framing narrows a reference covering several seasons; overlaps the season/access device in recent crop titles. Rejected. |

## 5. Classification and checks

Classification happened after the directions above. No mechanism received a mandatory quota.

| Mechanism | Candidates and supporting content | Check / risk decision |
|---|---|---|
| Contrast numbers / 反差数字 | #2; 27 named items versus eight tree fruits. | True, but recent titles already rely on numeric contrasts. Final title uses no number. |
| Reversal / 自我颠覆 | #3, #8, #10; fruit names do not establish a plantable source, cave fruit has conditions, season differs from seed access. | No invented first-person failure or alleged universal reader belief. Final does not use this mechanism. |
| Suspense scene / 悬念场景 | #7's deadline question is the closest attempted scenario. | The FAQ has a real conditional decision, but the headline could withhold the no-solution branch. Rejected. |
| Enter through loss / 损失进入 | #1's buying decision; introduction and source explanation say check source before spending. | No claim of measured savings, wasted purchases or imminent loss. Secondary element only. |
| Conclusion first / 结论前置 | #1 and #6; determine source before taking the next acquisition action. | #1 selected: concrete, supported by the source crosswalk and action steps. #5 only names categories and lacks a stopping point. |
| Name a reader state / 群体点名 | #4 (no seeds), #7 (deadline), #9 (loading a machine). | Real states occur in the body; narrower implications are why these are not the final headline. |

Candidate stopping elements: #1 shortcut/money; #2 anomaly; #3 anomaly; #4 shortcut; #5 none sufficiently concrete; #6 shortcut; #7 shortcut/choice; #8 anomaly; #9 shortcut; #10 anomaly. Tags describe the text and do not rescue rejected promises.

Seven stopping elements checked against the **selected** title:

| Element | Result | Concrete support or reason not used |
|---|---|---|
| Money / 金钱 | Secondary | Buying seeds is a real decision in the introduction and source explanation; no saving amount is promised. |
| Anomaly / 异常 | Not relied on | Mixed sources and misleading names exist, but the final title does not manufacture a surprise. |
| Shortcut / 捷径 | Primary | Readers can start with the correct source row instead of assuming a seed purchase; three source tables and five action steps provide the route. This is fewer mistaken steps, not instant success. |
| Peeking behind the scenes / 窥探 | Not used | No secret process or privileged information claim. |
| Conflict / 冲突 | Not used | No invented enemy or audience mistake. |
| Ending / 终结 | Not used | Quest expiry is in the body but is not used to create headline urgency. |
| Group emotion / 群体情绪 | Not used | No broad identity appeal. |

Human drives: wanting less unnecessary effort (懒惰) supports the lookup shortcut; preserving spending choices (贪婪 in the engine's neutral sense) is secondary. 傲慢、嫉妒、愤怒、暴食、欲望 are not invoked. No “solve everything” promise.

Seven explicit stop/adaptation checks for the final title **and** description:

1. **Stop:** a reader about to look for seeds gets a concrete earlier decision: determine whether the item is a crop, tree fruit or forage. The crosswalk explains Strawberry, Apple and Blackberry, then supplies the lookup rows. PASS.
2. **Numbers:** neither final title nor description contains a number; no unsupported item total, date, ranking or quantified result is projected. The editorial fact lock remains 27/8. PASS.
3. **Results:** “find” means consult a source reference, not obtain fruit immediately or save a proven amount of gold. Conditional tables and no-guarantee cave/forage wording support this. PASS.
4. **Reader:** a reader identifying fruit and its next acquisition route is B's reader; neither greenhouse planning nor profit optimization is implied. PASS.
5. **Method:** source lookup, season/access gates and next-action checks exist; description's Jelly/Wine/drying inputs are supplied by the processing table and caveats. They are necessary handling steps, not a separate ranking promise. PASS.
6. **Tone:** no superlative, urgency, fake experience, secret, universal completeness or guaranteed deadline. The imperative is proportionate to the reference. PASS.
7. **Description/template/repetition:** 148-character description supplements the 50-character title; exact wording maps to body content. Current shell/metadata use one title with no brand suffix, so H1/Title/OG/Twitter/Article headline remain identical. Live recent-title patterns were checked above. PASS as F screening; independent E SEOTruth remains pending.

## 6. Public assembly contract — consume only after E title approval

This section defines values for existing project slots; it does not request new schema fields or a new content system. The body is the exact already-reviewed TSX module identified above, imported through its named public export. The JSON is an editorial transfer format, not text to render as an article.

~~~json
{
  "locale": "en",
  "country": "US",
  "slug": "stardew-fruit",
  "title": "Stardew Fruit: Find Its Source Before Buying Seeds",
  "h1": "Stardew Fruit: Find Its Source Before Buying Seeds",
  "description": "Find Stardew Valley fruit by crop, tree, or forage source. Check seasons, seed and sapling access, and the inputs needed for Jelly, Wine, or drying.",
  "ogTitle": "Stardew Fruit: Find Its Source Before Buying Seeds",
  "twitterTitle": "Stardew Fruit: Find Its Source Before Buying Seeds",
  "articleHeadline": "Stardew Fruit: Find Its Source Before Buying Seeds",
  "canonicalPath": "/stardew-fruit",
  "canonicalUrl": "https://stardewvalleyplanner.art/stardew-fruit",
  "bodyModule": "src/blog/articles/stardew-fruit.en.tsx",
  "bodyExport": "StardewFruitEnglishArticle",
  "bodyHash": "d677058821c92fd535cebaf2ac1428cad14934367740cabc196b725f4a85f22d",
  "topic": "Stardew Valley Guides",
  "author": "Stardew Valley Planner Team",
  "readTimeMinutes": 14,
  "featured": false,
  "coverImage": {
    "src": "/blog/stardew-fruit-cover.webp",
    "alt": "Original illustration of strawberries, apples, and blackberries in a basket beside strawberry plants, an apple tree, and a wild bramble."
  }
}
~~~

Selection reason: #1 gives the reader a supported action before a concrete spending decision. Description identifies mixed sources and access gates, then explains the already-covered processing-input scope. No new fact or number is needed for the hook. Use exactly this one selection; do not mix words from rejected candidates.

Author/topic reuse the existing registry identity. Reading time is an editorial estimate, ceil(2634 / 200) = 14 minutes, not observed reading performance. Featured=false does not reorder or redesign existing featured content. There is no publication-date field in BlogPostMeta; do not invent a publication date or an additional byline.

Current bindings: BlogArticleContent renders post.title as the only H1 and post.description as the visible introduction summary. The English slug page passes the same values through createPublicPageMetadata and createArticleStructuredData. The root layout has a plain default title and no suffix template. Metadata description, OG description and Twitter description must all equal the selected description. Keep existing Article JSON-LD; do not add unsupported FAQ rich-result claims. The article itself must retain zero H1s.

### Fruit inventory lock

- Crop-table rows (11): Ancient Fruit; Blueberry; Cranberries; Hot Pepper; Melon; Pineapple; Powdermelon; Qi Fruit; Rhubarb; Starfruit; Strawberry.
- Fruit-tree subset (8): Apple; Apricot; Banana; Cherry; Mango; Orange; Peach; Pomegranate.
- Forage / multiple-source rows (8): Blackberry; Cactus Fruit; Coconut; Crystal Fruit; Grape; Salmonberry; Spice Berry; Wild Plum.
- Total **27 distinct named items**, each once across the three inventory tables. These display groups are not disjoint real-world acquisition routes: Grape and Cactus Fruit have cultivated routes, and cave/Wild Seed routes overlap.
- Preserve valley/Greenhouse/Ginger Island distinctions, Powdermelon seed-access windows, active Qi's Crop restrictions/expiry/giant exception, normal versus high-quality sapling growth, fruit-bat cave conditions, and Sweet Gem Berry's exclusion.
- Processing table is separate: Jelly and Wine consume one fruit; Dehydrator consumes five of one type and quality, with Grape yielding Raisins. Preserve base-price, batch, profession and aging caveats. Do not convert sale values into profit or rank the fruits.

### Public references and preserved anchors

Keep all **31 inline external links**, their descriptive anchors and Crops#Grape fragment, plus the **15 existing Sources entries** with their labels/notes. They point to 16 distinct inline URLs including the fragment, across 15 source pages. Do not insert Q's old working links, prompts, message IDs, or unused research pages into the article.

The following appliesTo quotes are exact substrings of the normalized rendered article text (NFC, collapse whitespace to one space, trim); occurrence is 1 in every row and must resolve uniquely. They locate supported claims rather than creating extra article citations. The bodyHash binds all of them. Labels below match existing Sources labels; column notes indicate coverage.

| ID | Label / public URL | appliesTo.quote (occurrence=1) | Coverage |
|---|---|---|---|
| R01 | [Stardew Valley Wiki: Fruits](https://stardewvalleywiki.com/Fruits) | The vanilla fruit list contains 27 named items | Inventory, categories, base/processed prices and profession conditions. |
| R02 | [Crops](https://stardewvalleywiki.com/Crops) | The timing comes from the crop reference and uses ordinary growth without speed bonuses. | Crop timing, seasons, seed routes; keep inline Crops#Grape. |
| R03 | [Fruit Trees](https://stardewvalleywiki.com/Fruit_Trees) | A normal-quality sapling takes 28 days to mature when its growth conditions are met. | Eight-tree subset, saplings, growth and location-dependent production. |
| R04 | [Foraging](https://stardewvalleywiki.com/Foraging) | Foraging routes depend on a place and, often, a season or short berry window. | Locations, seasons and berry windows. |
| R05 | [The Farm Cave](https://stardewvalleywiki.com/The_Cave) | Farm Cave fruit requires the fruit-bat choice when Demetrius offers it after 25,000g in total earnings. | Cave access, random supply, Banana/Mango exclusion. |
| R06 | [Ancient Seeds](https://stardewvalleywiki.com/Ancient_Seeds) | The plantable packet is Ancient Seeds | Artifact versus plantable seeds, Museum/Seed Maker routes. |
| R07 | [Powdermelon Seeds](https://stardewvalleywiki.com/Powdermelon_Seeds) | most acquisition methods to Fall 21 through Winter 20 | Seed-access window and exceptions. |
| R08 | [Qi Fruit](https://stardewvalleywiki.com/Qi_Fruit) | Giant Qi Fruit is the documented exception | Active quest, growth, expiry and giant-crop boundary. |
| R09 | [Cactus Fruit](https://stardewvalleywiki.com/Cactus_Fruit) | Their normal first harvest takes 12 days, followed by a three-day repeat interval. | Desert/store/crop alternatives and harvest rhythm. |
| R10 | [Cactus Seeds](https://stardewvalleywiki.com/Cactus_Seeds) | Cactus Seeds can grow in the Greenhouse, inside a building in a Garden Pot, or on Ginger Island. | Permitted cultivation locations. |
| R11 | [Coconut](https://stardewvalleywiki.com/Coconut) | explicitly says you cannot plant a Coconut to create a palm tree. | Palm/forage/purchase alternatives, non-plantable coconut. |
| R12 | [Preserves Jar](https://stardewvalleywiki.com/Preserves_Jar) | Jelly ignores ingredient quality | Jelly input, formula, quality and duration. |
| R13 | [Wine](https://stardewvalleywiki.com/Wine) | Wine quality increase comes from a Cask | Base Keg output, duration and separate aging. |
| R14 | [Dehydrator](https://stardewvalleywiki.com/Dehydrator) | Five of one fruit type and quality, excluding Grape | Matching five-item input, dried batch formula, Raisins exception. |
| R15 | [Sweet Gem Berry](https://stardewvalleywiki.com/Sweet_Gem_Berry) | It cannot be processed in a Keg, Preserves Jar, or Dehydrator. | Non-fruit/non-vegetable category and machine exclusion. |

Preserve the existing public checkedLabel exactly: “Wiki pages checked September 26, 2026. Covers vanilla mechanics including 1.6; earlier versions and mods may differ.” E independently opened all 15 sources on that date; F verified the article bindings and read E's source evidence, without claiming a new full source audit.

### Media and component contract

| Placement | WebP URL | AVIF URL | Width × height | Binding |
|---|---|---|---|---|
| Header cover | /blog/stardew-fruit-cover.webp | /blog/stardew-fruit-cover.avif | 1672 × 941 | coverImage above; existing BlogArticleContent/PublicPicture. |
| Body, after source distinction and before crop table | /blog/illustrations/stardew-fruit-crosswalk.webp | /blog/illustrations/stardew-fruit-crosswalk.avif | 1672 × 941 | Existing PublicPicture, loading=lazy, decoding=async. |

Body alt, frozen in source: **Three illustrated source pairs: strawberry and a cultivated bed, apple and a fruit tree, blackberry and a wild bramble.**

Body caption, rendered text frozen in source: **Strawberry points to a cultivated crop, Apple to a fruit tree, and Blackberry to wild forage. This illustration shows example sources, not an in-game screenshot or planting layout; Blackberry also has the additional routes listed below.**

F viewed both WebPs and verified all four formats/dimensions with file/sips. The three arrows denote source examples only; do not add text, prices, a total-count claim, map spacing, or game UI. PublicPicture supplies the same-stem AVIF source and WebP fallback. No additional public credit was requested by the original-illustration provenance; do not invent third-party attribution.

Asset SHA-256:

~~~text
/blog/stardew-fruit-cover.webp fca66201085847ae229c1397f4bcbbd960bf02f2a23a784662b5d697bc587758
/blog/stardew-fruit-cover.avif 300dd727b5de1ad440d92f2b01b76f3220fd2a874d1625be6886b2f9f0f62836
/blog/illustrations/stardew-fruit-crosswalk.webp 81a1acfbb62ff0230f4bf73e9e3a7cdec8977df25c3dd65ca153b4c8e3d762c0
/blog/illustrations/stardew-fruit-crosswalk.avif 76834633bbc24fb8baae882961e7bdd303ae3be53fc61b2e8843e40c87e9533f
~~~

Preserve four horizontally scrollable tables with scoped headers and labeled focusable regions; three BlogFaqList items; the Sources block; and its single existing automatic BlogPlannerCta linking to /#planner. No new body CTA or internal links are requested. Preserve the existing FAQ answers and their deadline/winter/Dehydrator diagnostic roles. Do not reinsert the three rejected old FAQ duties (tree-list repetition, Wine/Cask repetition, cave Banana/Mango repetition).

### Assembly boundaries and subsequent browser routes

F observed zero stardew-fruit matches in the current identities/registry at the initial inspection; the article is not yet a registered route. G must use the existing identity/registry and dynamic slug-page interfaces under its own file authorization. The English route is **/stardew-fruit**, not /blog/stardew-fruit or /en/stardew-fruit. Existing canonical metadata omits the trailing slash. Identity export strings include trailing slashes; use the project's existing routing conventions rather than introducing a second URL policy.

After E approves title/SEO and G assembles the page, the browser worker must check these English paths at the actual authorized local origin:

- /stardew-fruit — rendered article, one H1, exact title/description, full inventory, FAQ behavior, image natural dimensions/currentSrc, references, single CTA, desktop/mobile table scrolling and page overflow.
- /blog and /blog/archive — article entry/title/cover and link destination through the existing navigation.
- /#planner — existing shared CTA destination; do not imply fruit lookup functionality.
- /stardew-fruit ↔ /zh/stardew-fruit — language-switch reciprocity after the separately approved Chinese handoff is assembled; this English handoff cannot approve Chinese prose or metadata.
- /sitemap.xml plus article head/JSON-LD — new route, canonical, en/zh-CN alternates, Article headline/description and OG/Twitter fields. Read actual output; source imports alone do not prove these surfaces.

scripts/dev.sh currently chooses port 3003, so http://localhost:3003/stardew-fruit is a proposed future local URL **only if the assigned server actually binds there**. F did not run that script, start a server, or claim the URL currently works. Do not include the editorial sections, hashes, task IDs, candidate table, evidence or test logs in public page content.

## 7. Independent F validation and reproducibility — editorial record

All commands ran in the task worktree unless stated otherwise. No verification script or intermediate file was created. Relevant commands and actual results:

| Command / operation | Exit | Key actual result |
|---|---|---|
| orca skills get orchestration; orca status --json; orchestration check using injected terminal | 0 | Runtime ready; current Run/Dispatch recognized; no pending redirect at write gate. |
| orca orchestration inbox --limit 200 --full --json, filtered by the eight D/E/Q/B message IDs above | 0 | All eight found; D/E exact article SHA and succeeded outcomes read. |
| orca orchestration worker-read --dispatch ctx_c4397fab4d3d --source transcript --limit 100 --json | 0 | Archived E succeeded; actual SSR exit 0 output with exact 27 names, groups 11/8/8, tables 4 and body H1 0. Payload clipping was explicit; complete E report came from inbox, not a claim of complete transcript text. |
| shasum -a 256 src/blog/articles/stardew-fruit.en.tsx | 0 | d677058821c92fd535cebaf2ac1428cad14934367740cabc196b725f4a85f22d. |
| Read package.json and node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md; read route, identity, registry, shell and metadata functions | 0 for the completed reads | Next 16.3.0; no lint script; pnpm test has a pretest build, so focused Vitest was invoked directly. |
| TSX_DISABLE_CACHE=1 node --require tsx/cjs, in-memory SSR/DOM assertion script | 0 | 18 passed, 0 failed: raw/NFC hash; exact 27 names; 11/8/8; tree set; 4 tables/regions; H1=0; FAQ=3; CTA=1; sources=15; body picture; four asset hashes; original V7 count exit and floor. |
| python3 -B /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py /dev/stdin --locale en, invoked by that SSR script | 0 | mechanical_units=2634, required_floor=2000, meets_mechanical_floor=true; no excluded-heading arguments needed because only eligible nodes were passed. |
| ./node_modules/.bin/tsc --noEmit --incremental false | 0 | No diagnostics; whole-project TypeScript check. |
| ./node_modules/.bin/vitest run tests/blog/blog-faq-list.test.tsx tests/components/public-picture.test.tsx --no-cache --configLoader runner | 0 | Test Files 2 passed; Tests 11 passed (FAQ 6, PublicPicture 5); duration 525ms. |
| file public/blog/stardew-fruit-cover.* public/blog/illustrations/stardew-fruit-crosswalk.* | 0 | Real WebP and AVIF file signatures for all four. |
| sips -g pixelWidth -g pixelHeight public/blog/stardew-fruit-cover.webp public/blog/stardew-fruit-cover.avif public/blog/illustrations/stardew-fruit-crosswalk.webp public/blog/illustrations/stardew-fruit-crosswalk.avif | 0 | Four files, each 1672 × 941. |
| view_image on the two existing WebPs | success | Cover basket/source scene and three source-pair rows match their alt/caption. No image edits. |
| ego-browser nodejs, TaskSpace 152, live /blog snapshot then Latest articles heading extraction | 0 | Three live titles and actual linked URLs recorded in §3; task.finish({keep:[]}) completed. Source reading only. |
| Read-only Python write-gate hash/existence/length check | 0 | Expected SHA matched; target handoff did not exist; selected title=50 and description=148 characters. |

Mechanical extraction contract: render the public component with React renderToStaticMarkup; parse with @xmldom/xmldom; traverse in document order; include p/li/td and tbody th row names, excluding nested duplicate countable descendants. Exclude thead, H1–H6, figure/figcaption, FAQ, Sources, automatic CTA, metadata, alt and URLs. Collapse whitespace in each included node; join nodes with LF, without a trailing LF; then call the unmodified V7 Python script via stdin. F's extracted count-text SHA is **f0c81b449d77984424eaf4d88cb7a1e760b21f653a81fce0bb1eeee11d0b5fb3**. Its normalization hash is identical. D/E's differently serialized extract had a different text hash but the same 2,634 count and the identical full TSX article hash; neither extract hash replaces bodyHash.

Exploratory errors retained for accuracy: an attempted unsupported orchestration task-show exited 1 (Unknown command); CLI help and supported inbox/worker-read then supplied the needed evidence. Early rg calls named nonexistent src/app and app/layout.tsx paths (exit 2 in the latter batch); actual app/(en)/[slug]/page.tsx and app/(en)/layout.tsx were subsequently read. An initial file search found no stardew-fruit report files; the coordinator correctly identified durable Run messages. A draft reference-quote probe found one nonexistent cave phrase and a nonunique short Cactus Seeds phrase; both were replaced with actual source sentences before the final handoff locator assertions. None was an article defect or a hidden failed acceptance test.

Not run: full Vitest suite, build, dev, local page/browser QA, deployment or external writes. The media archive mentions a historical asset-test fixture expected79/received81 failure; F did not rerun it and does not label it current, fixed or waived. G's existing assigned validation/fixture task and later browser worker must report their own actual results.

The final handoff validation receipt and deterministic assembly-contract digest are recorded below after reading back this file. Independent E title approval, G assembly and subsequent page/user review remain outstanding regardless of F's local checks.

### Final readback receipt

Final in-memory command: TSX_DISABLE_CACHE=1 node --require tsx/cjs with fs readback of this Markdown, JSON parsing, actual article SSR and DOM text extraction; exit **0**, **29 passed / 0 failed**. It checked the approved article hash, one title across five surfaces, 50/148 character lengths, slug/canonical, ten candidates, no numeric/ranking headline promise, fifteen unique appliesTo matches, exact Sources URLs/labels, all four media hashes, 11/8/8 and 27 unique rows, and explicit pending E title/page status. The complete executable command and raw PASS lines are in this F Dispatch transcript. Each reference locator resolved exactly once.

Deterministic public-field digest: **46583c055fc45e5dca52482baae96bb78d1b7041a035bb20efadbaafe507b634**. Input is the object with keys assembly (the JSON block above), publicReferences (reference rows as id/label/url/appliesTo with quote/occurrence), and assetHashes (URL-to-SHA object above); serialization is Python json.dumps(ensure_ascii=False, sort_keys=True, separators=(',', ':')), UTF-8, without a final newline. SHA-256 over that serialization excludes all editorial records and this receipt. E must approve the selected fields before this digest becomes a released public handoff; it currently identifies the exact F candidate.

Only docs/blog-handoffs/stardew-fruit.en.md was written by F. The article SHA remained unchanged. F delivery is complete; independent E title/SEO review, G assembly, browser verification and user page review remain pending.
