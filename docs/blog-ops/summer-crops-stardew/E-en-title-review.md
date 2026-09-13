# E-en title review: summer crops stardew

Role: Agent E-en (title / SEOTruth only). Same reviewer duty as the body pass. Not a writer. Did not change Title, H1, Description, slug, body, or `handoff-en.md`. F’s 10-candidate screen is not this verdict.

| Item | Value |
|---|---|
| Locked body | `docs/blog-ops/summer-crops-stardew/locked/en-body.txt` |
| Body SHA-256 (recomputed) | `91d2e0f0a0e1823ca1d90b6b9632b4a694e48c5b9a2338d4198c482088da1d80` |
| Matches F lock / handoff | Yes. 23303 bytes, NFC, LF |
| F surface | `F-en-lock.md` §9 |
| Handoff | `handoff-en.md` status `pending_title_review` (E does not freeze) |
| Keyword / locale | `summer crops stardew` / `en` / `US` |
| Main intent | I2: outdoor Summer rank on wiki gold/day, gated by shop access, then occupancy |

**Surface under review**

| Field | Text |
|---|---|
| Title | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| H1 | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| Description | Starfruit sits at about 26.92g/day only after you can reach Oasis and pay 400g a seed. Year 1 at Pierre's is blueberry, melon, or hops by tile, not one crop on every hoe mark. Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day. |
| slug | `summer-crops-stardew` |

**Overall: PASS.** Must-fix for F: **0**.

---

## SEOTruth — Title / H1 / Description ↔ locked body

| Surface claim | Locked-body support | Result |
|---|---|---|
| Summer Crops in Stardew | Head term; outdoor Summer ranking from the opening through H2-6 | Pass |
| Rank by the Shop You Can Open This Morning | Opening: “Rank by the shop you can open this morning, then by the Crops gold/day figure…” | Pass |
| Starfruit sits at about 26.92g/day | “Starfruit’s wiki gold/day of about 26.92g is one 13-day cycle”; table “about 26.92g” | Pass |
| only after you can reach Oasis and pay 400g a seed | Opening + “Starfruit Seeds cost **400g** there” | Pass |
| Year 1 at Pierre's is blueberry, melon, or hops by tile | Opening tile choice; H2-3 fork | Pass |
| not one crop on every hoe mark | “not a single first-place crop copied onto every hoe mark” | Pass |
| Year 2 puts Red Cabbage on that same wiki gold/day table at about 17.78g/day | Opening “about 17.78g/day”; table / H2-4 | Pass |

Title and H1 are the same string, matching this site’s `post.title` = visible H1. Title foregrounds the first I2 gate (shop). Description supplies Starfruit/Oasis, Year 1 occupancy, and Year 2 cabbage. Together they match the locked opening, not a second intent.

Not promised (and must not be): a single unsourced “best” crop; Pale Ale on this table; Shockbyte season-total as wiki gold/day; planner gold math; greenhouse or Community Center as the H1 job. FAQ is `null`.

---

## Stop reason and main intent

Target reader is planting outdoor Summer and searching `summer crops stardew` / best / profit / year 1 / year 2. SERP treats Starfruit as first. The Title makes the shop the rank key before a crop name. That gap is already in the lock, not a F-invented hook.

Head term appears as “Summer Crops in Stardew” at the front. Not stuffed. No “best / most profitable / fastest / tested.”

---

## No unsourced superlative

Title and Description contain no “best,” “most profitable,” or yield-percentage boast. 26.92g/day and 17.78g/day are the locked wiki gold/day cells with the Oasis / Year 2 gates attached.

---

## Last 3 EN titles (anti-template)

Read from `src/blog/blog-post-registry.tsx` English `title`, newest three:

| slug | EN title |
|---|---|
| best-spring-crop-stardew | Best Spring Crop in Stardew: Year 1 Can’t Buy Strawberries on Spring 1 |
| how-to-earn-money-stardew | How to Earn Money in Stardew Valley: Year 1 Gold You Can Spend This Morning |
| rancher-or-tiller-stardew | Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair |

This Title is not “Best Summer Crop in Stardew: Year 1 Can’t Buy Starfruit on Summer 1,” not an A-or-B lock, and not a Year 1 gold-spend how-to.

Shared closing words “This Morning” with `/how-to-earn-money-stardew` are a **voice echo**, not the same job. The money title is spend-the-starter-gold. This Title is shop-access as the first rank key, which the locked opening already says. Not a clone FAIL.

---

## Slug

| Check | Result |
|---|---|
| New vs live `blogPostSlugs` | Yes. The 14 occupied slugs end at `rancher-or-tiller-stardew`. `src/` has no `summer-crops-stardew`. |
| Not `best-spring-crop-stardew` | Does not occupy that URL. |
| Matches ZH | `handoff-zh.md` slug is `summer-crops-stardew`. EN matches. |
| Readable / on-theme | Yes. Append at end of `blogPostSlugs` (G). |

---

## Author / date

Title, H1, Description, and `seo` fields do not invent a person or a publish date. Handoff `registry.author` is “Stardew Valley Planner Team,” which is the existing EN registry author on the last three posts, not a new identity. `readTimeMinutes: 16` is a G slot, not a Title claim.

---

## Public references still map

Every handoff `publicReferences[].appliesTo[0].quote` was counted in the NFC lock. All **n = 1**, including Luau: “The Luau sells one starfruit per year for 3,000g.” Labels and URLs still match A’s opened wiki/site pages. No new fact in the Title/Description that lacks a lock sentence.

---

## Residual (not FAIL)

- “This Morning” also ends the money-article Title. Jobs differ; do not rewrite unless F later changes the surface.
- Description is 253 characters; SERP may truncate. Fulfillment is intact.
- Italic Fig 1–2 captions remain; G still binds `.webp`. Page SEOTruth waits for the live route.
- E does not edit `handoff-en.md`. F may set `title_passed` / freeze after this PASS.

---

**This version: PASS.** Must-fix for F: **0**.
