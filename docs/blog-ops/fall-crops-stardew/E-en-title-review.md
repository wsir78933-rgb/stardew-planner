# E-en title review: fall-crops-stardew

Role: Agent E-en (title / SEOTruth only). Same reviewer duty as the body pass. Not a writer. Did not change Title, H1, Description, slug, body, `F-en-lock.md`, or `handoff-en.md`. F’s 10-candidate screen is not this verdict.

| Item | Value |
|---|---|
| Locked body | `docs/blog-ops/fall-crops-stardew/locked/en-body.txt` |
| Body SHA-256 (recomputed on this pass) | `887127ebb67d260bf4f0fc3a953130fe97c46bb956fa9d8dad8d823a8373818a` |
| Matches F lock / handoff `bodyHash` | Yes. 30698 bytes, NFC, LF. Handoff JSON `body` == lock file. Same digest as E body review. |
| F surface | `F-en-lock.md` §9 |
| Handoff | `handoff-en.md` status `title_pending` (E does not freeze) |
| Keyword / locale | `stardew fall crops` / `en` / `US` |
| Main intent | I2: outdoor Fall rank on wiki gold/day, with Year 1 Pierre / Oasis beet / Year 2 artichoke / Traveling Cart Rare Seed as conditions, then occupancy |

**Surface under review**

| Field | Text |
|---|---|
| Title | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| H1 | Fall Crops in Stardew: 18.89g at Pierre's, 83.33g Needs a Rare Seed |
| Description | Year 1 at Pierre's is a tile choice among cranberries at about 18.89g/day, pumpkins at about 16.92g for one 13-day cycle, and grapes at 16.8g. Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table. |
| slug | `fall-crops-stardew` |

**Overall: PASS.** Must-fix for F: **0**.

---

## SEOTruth — Title / H1 / Description ↔ locked body

| Surface claim | Locked-body support | Result |
|---|---|---|
| Fall Crops in Stardew | Head term; outdoor Fall ranking from the opening through H2-6 | Pass |
| 18.89g at Pierre's | Worked example: `(5 × 150 − 240) / 27 = 18.89g`. “The highest wiki gold/day on the Year 1 Pierre fall counter is cranberry at about 18.89g.” Title omits “about” and the crop name; the number and Pierre gate are in the lock. Description names cranberries at about 18.89g/day. | Pass |
| 83.33g Needs a Rare Seed | “Without a Rare Seed in hand, do not treat about 83.33g/day as this morning’s shopping list.” Table: Sweet Gem about 83.33g, Traveling Cart 1,000g, not a Pierre default. H3: “Sweet Gem Berry needs a Rare Seed, not a Pierre packet.” “Without a Rare Seed, do not treat 83.33g as the Year 1 default first place.” | Pass |
| Year 1 at Pierre's is a tile choice among cranberries…pumpkins…grapes | Opening sentence 2, plus H2-3 occupancy fork | Pass |
| cranberries at about 18.89g/day | Same Pierre cranberry cell; “18.89g/day cell” already in H2-1 | Pass |
| pumpkins at about 16.92g for one 13-day cycle | “Pumpkin’s published cell of about 16.92g is one 13-day cycle: (320g − 100g) / 13.” | Pass |
| grapes at 16.8g | Table and grape H3: 16.8g | Pass |
| Year 2 artichoke, Oasis beet, and a Traveling Cart Rare Seed sit on that same wiki gold/day table | Opening; H2-4 | Pass |

Title and H1 are the same string, matching this site’s `post.title` = visible H1. Title foregrounds the I2 access split (Pierre cell vs Rare Seed cell). Description supplies the Year 1 occupancy fork and the Year 2 / Oasis / cart rows. Together they match the locked opening, not a second intent (bundle, keg, greenhouse, Year 1 gold loop).

Not promised (and must not be): a single unsourced “best” / “most profitable” crop; keg/jar ranking; Oasis hours / bus gold; Cart timetable; planner gold math; greenhouse or Community Center as the H1 job.

---

## 18.89g and 83.33g conditions

Both numbers are in the lock. Conditions match the title pairing:

| Number | Title condition | Lock condition |
|---|---|---|
| 18.89g | at Pierre's | Cranberry wiki gold/day on Year 1 Pierre Fall Stock (240g seed; no fertilizer, no Tiller). Not a seed price. |
| 83.33g | Needs a Rare Seed | Sweet Gem wiki gold/day at Traveling Cart 1,000g (about 83.33g\*). Not a Pierre packet. |

Description keeps “about” on 18.89g/day and 16.92g. Title drops “about” on both cells; the cranberry worked example is written as `= 18.89g`, and the Sweet Gem cell is the published ≈83.33g figure. Not a new measurement. Not mixing season-total with gold/day.

---

## Stop reason and main intent

Target reader is planting outdoor Fall and searching `stardew fall crops` / best / most profitable / year 1 / year 2. Opened SERP is wiki Fall + ranking threads. The Title splits the two published cells they would otherwise copy as one “most profitable” name. That gap is already in the lock (opening + table Access + H2-3 / H2-4), not a F-invented hook.

Head term appears as “Fall Crops in Stardew” at the front. Not stuffed. Occupancy is in the Description (“tile choice”), not required in the Title once the access split is the stay.

---

## No unsourced superlative

Title and Description contain no “best,” “most profitable,” “fastest,” or “tested.” The locked opening’s “no single best outdoor fall crop” is the body fence; the Title does not reverse it. 18.89g and 83.33g are wiki gold/day cells with Pierre vs Rare Seed attached, not a yield-percentage boast.

---

## Last 3 EN titles (anti-template)

Read from `src/blog/blog-post-registry.tsx` English `title`, newest three:

| slug | EN title |
|---|---|
| summer-crops-stardew | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| rancher-or-tiller-stardew | Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair |
| how-to-earn-money-stardew | How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning |

This Title is not “Fall Crops in Stardew: Rank by the Shop You Can Open This Morning,” not an A-or-B profession lock, and not a Year 1 gold-spend how-to.

Shared prefix “{Season} Crops in Stardew:” with summer is the head-term slot, not the summer colon clause. The stay here is two gated gold/day cells. Not a clone FAIL.

---

## Slug

| Check | Result |
|---|---|
| User-locked | `fall-crops-stardew` unchanged |
| New vs live `blogPostSlugs` | Yes. Occupied list ends at `summer-crops-stardew` (15). `src/` has no `fall-crops-stardew`. |
| Not `best-spring-crop-stardew` / `summer-crops-stardew` | Does not occupy those URLs. |
| Readable / on-theme | Yes. Append at end of `blogPostSlugs` (G). |

---

## Author / date

Title, H1, Description, and `seo` fields do not invent a person or a publish date. Handoff `page.author` is “Stardew Valley Planner Team,” which is the existing EN registry author on the last three posts, not a new identity. `readTimeMinutes: 19` is a G slot, not a Title claim. OG image remains `pending_media` until G binds the cover.

---

## Public references still map

Every handoff `publicReferences[].appliesTo[].quote` was counted in the NFC lock. All **n = 1**. Labels and URLs still match A’s opened Fall / Crops / Pierre / site pages. Title/Description introduce no number that lacks a lock sentence.

FAQ copy in `## FAQ` matches `publicRequirements.faq.items` (five questions). `seo.faq` is **null**. `schema.@type` is **Article**, `notFaqPage: true`. Visible FAQ in the body is required and OK. JSON-LD must stay Article, not FAQPage, at assembly.

---

## Residual (not FAIL)

- Title omits “about” and the crop names (cranberry / Sweet Gem). Description and body carry both. Do not rewrite unless F later changes the surface.
- Description is 241 characters; SERP may truncate. Fulfillment is intact.
- Title uses ASCII `Pierre's` (U+0027); lock body mostly uses U+2019 in “Pierre’s”. Same word; G should not “fix” the lock.
- Italic Fig 1–2 captions remain; G still binds `.webp`. Page SEOTruth waits for the live route.
- E does not edit `handoff-en.md`. F may set `title_passed` / freeze after this PASS.

---

**This version: PASS.** Must-fix for F: **0**.
