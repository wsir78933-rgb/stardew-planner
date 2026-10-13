# English Body Revision Note, Rework-V2 Round 2

Round 2 of the shared rework budget for `how-to-harvest-stardew-valley`. The earlier three rounds under `writing/` stay in place and were not reset. This note answers the seven ReaderValue items in `checks-d/D-en-three-gates-review-r1.md` (D-RV-04 through D-RV-10). ResearchTrace and Repetition were left as already reviewed. This file does not sign a quality pass. Role D still has to re-check the new candidate. `src/`, `public/`, tests, SEO, Chinese, and image pixels were not edited, so the local site is still the previous page.

## Version and counts

Script: `python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" <file> --locale en`

Previous candidate body NFC-LF SHA-256 `a91783b9525f64c63d75a98561be978a9f92cb6cde734d3687575403aea544dc`, eligible 1317.

| Check | File | Exit | Mechanical units | NFC-LF SHA-256 |
|---|---|---:|---:|---|
| Raw body | `writing/en-body.md` | 0 | 1148 | `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67` |
| Caption excluded | `writing/r2/en-body.caption-excluded.md` | 0 | 1107 | `31d70053f672023c210eadaf8d95af943ffb30721095fca3e36e809d978d9069` |

Caption exclusion removes the two `<figure>` blocks, so figcaption text is not counted. There is no separate CTA section. The farm-planner sentence stays inside the trellis paragraph and is included in 1107. Eligible length class is `short`. Floor `>= 1000` is true. Long-form `>= 2000` is false. The seven cuts leave the harvest task in the draft, so the count was not padded.

`en-media.json` `bodySha256NfcLf` and `en-public-references.json` `bodyHash` are the new body hash above. Media file NFC-LF SHA-256 `1f004b1788988aac4b95c8bf4659254881712ebc0704f4266bea7e54dbe30757`. References file NFC-LF SHA-256 `2d01287cbcd0cfaa15d4f457d9b1d8187d9bcf631433cd53a3a4e2855138e0ef`.

Reference check against the new body: 21 items, FAILS 0. Receipt: `writing/r2/reference-fidelity.stdout.txt`. Quote text and occurrence values were not renumbered. Both files are NFC UTF-8 with LF.

## Seven sentence changes

Private source notes stay in `facts-audit-v2.md` and `facts-regrowth.md`. They are not copied into the reader body.

### D-RV-04
Line 7 now says a crop is ready when that plant shows its final harvest sprite. The pumpkin on line 9 remains the visible example: 13 watered days, large rounded orange fruit on tilled dirt. The sentence that treated every crop as produce replacing a seedling is gone.

### D-RV-05
The single-plant step on line 32 is: stand next to the ripe crop and right-click it. The same Steam link is on that step and on the opening sentence (reference `en-steam-parsnip-right-click`, line 1, occurrence 1). Line 9 no longer says to walk onto the planted bed. Line 18 only describes the pumpkins on tilled soil beside the dirt path. The hold-right walk, with the cursor away from the character, stays on line 40 and is the place that harvests the tile you are standing on.

### D-RV-06
The controller button list and the mobile “tap the plant” sentence are deleted from the PC single-crop section. The mobile source that remains is line 50: select the scythe before you use it (`en-wiki-mobile-scythe`).

### D-RV-07
Line 34 now says a hand harvest does not need a tool swing. The axe and pickaxe soil-damage warning is deleted. Left-click and C stay mapped to tools or placing items (`en-wiki-controls-tool`, line 34).

### D-RV-08
Line 42 says that holding right-click while walking over ripe single-harvest crops, with seeds selected, harvests the plant on the tile you are standing on, and you can sow the new seed on that open soil. “Immediately” is gone. The same line says a blueberry bush stays and keeps producing, so that plant does not need another seed. It does not say the game blocks sowing or that the bush must not be destroyed. The 13-day maturity, 4-day regrowth, and daily watering wording on lines 11 and 26 is unchanged.

### D-RV-09
Line 54 keeps one scope: the iridium scythe is the 1.6 Farming Mastery scythe, and within its swing it harvests crops grown on tilled soil, including regular crops (`en-wiki-iridium-scythe`). The sentence about garden pots, spring onions, and wild-seed forageables is deleted.

### D-RV-10
Line 60 keeps the harvest action already tied to `en-wiki-giant-crops`: any axe, three hits, 15 to 21 normal-quality items, and the giant crop does not die when the season changes. The variety list and the 3x3 growing-condition sentence are deleted. The existing source URL is unchanged.

## Citation locations

Each `appliesTo.quote` was found in `en-body.md`. Occurrence is the value stored in `en-public-references.json`.

| id | lines | count | occurrence |
|---|---|---:|---:|
| en-steam-parsnip-right-click | 1 | 1 | 1 |
| en-wiki-parsnip-stages | 9 | 1 | 1 |
| en-wiki-pumpkin-stages | 9 | 1 | 1 |
| en-wiki-blueberry-regrowth | 11 | 1 | 1 |
| en-wiki-crops-watering | 24 | 1 | 1 |
| en-wiki-controls-action | 32 | 1 | 1 |
| en-wiki-controls-tool | 34 | 1 | 1 |
| en-wiki-calendar-replant | 36 | 1 | 1 |
| en-forum-hold-right-click | 40 | 1 | 1 |
| en-forum-x-mapped | 40 | 1 | 1 |
| en-wiki-scythe-examples | 48 | 1 | 1 |
| en-wiki-kale | 48 | 1 | 1 |
| en-wiki-fiber-seeds | 48 | 1 | 1 |
| en-wiki-unmilled-rice | 48 | 1 | 1 |
| en-wiki-mobile-scythe | 50 | 1 | 1 |
| en-wiki-iridium-scythe | 54 | 1 | 1 |
| en-wiki-giant-crops | 60 | 1 | 1 |
| en-wiki-trellis | 64 | 1 | 1 |
| en-wiki-season-wither | 82 | 1 | 1 |
| en-press-multiplayer-2-mature | 15, 70 | 2 | 1 |
| en-press-multiplayer-2-trellis | 15, 70 | 2 | 2 |

The two body figures, their alt text, captions, and press-screenshot links are unchanged. The links to `/`, `/last-day-to-plant-stardew`, and `/what-to-grow-in-greenhouse-stardew` are unchanged.
