# Length report: house-upgrade-stardew English lock

Role F. Technical length gate only. This is not an E SEO pass, a translation, a page review, or a user approval.

- Locked body: `docs/blog-ops/house-upgrade-stardew/lock/en/body.md`
- Body SHA-256: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`
- Bytes: 10046
- Normalization: NFC, LF, UTF-8. Raw SHA-256 equals the NFC/LF SHA-256.
- Same bytes as `content/en/draft-v4.md`, which D and E passed.
- Verified at: 2026-10-16T09:08:17+08:00

## Counts

Official counter: `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`

Mechanical run on the locked body, exit code 0:

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/lock/en/body.md",
  "locale": "en",
  "mechanical_units": 1138,
  "required_floor": 1000,
  "meets_mechanical_floor": true,
  "long_form_target": 2000,
  "meets_long_form_target": false,
  "length_class": "short",
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [],
  "omitted_line_counts": {
    "headings": 8,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 34,
    "frontmatter": 0
  },
  "sha256_raw": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f",
  "sha256_nfc_lf": "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
}
```

The same command on `content/en/draft-v4.md` also exited 0 with mechanical_units 1138.

Qualified run on `lock/en/count-input.md`, exit code 0:

```json
{
  "file": "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md",
  "locale": "en",
  "mechanical_units": 1085,
  "required_floor": 1000,
  "meets_mechanical_floor": true,
  "long_form_target": 2000,
  "meets_long_form_target": false,
  "length_class": "short",
  "semantic_qualification": "requires_independent_review",
  "excluded_heading_sections": [],
  "omitted_line_counts": {
    "headings": 8,
    "code": 0,
    "excluded_sections": 0,
    "non_body": 34,
    "frontmatter": 0
  },
  "sha256_raw": "a52082ab04695f70191969d71c7dd264c83d424acd3bf371149b14292b58b1b6",
  "sha256_nfc_lf": "a52082ab04695f70191969d71c7dd264c83d424acd3bf371149b14292b58b1b6"
}
```

`count-input.md` is the locked body with these two caption lines removed and no other text added:

1. Line 47: Schematic. Upgrade 1 is labeled Kitchen and Bedroom. Upgrade 2 is labeled Empty room and Nursery. Upgrade 3 is labeled Cellar and Same exterior. A shared line reads 9×5 outdoors.
2. Line 65: Schematic. The upgrade path reads Upgrade and 3 days. The renovation path reads Renovation, After upgrade 2, Instant, and Refunds gold. Remove crib reads Free. Dining room reads 150,000g.

Its SHA-256 is `a52082ab04695f70191969d71c7dd264c83d424acd3bf371149b14292b58b1b6`. That hash is the count-input hash, not the body hash.

## What was removed from the qualified count

- Original mechanical value on the full body: 1138.
- Headings: 8 lines omitted by the counter. No H1 is in the body. Title is not in this file.
- TOC, FAQ, sources list, CTA, metadata, and code blocks: none are present. Excluded-section count is 0. Code count is 0. Frontmatter count is 0.
- Image alt: the two image markdown lines are stripped by the counter before the words are counted.
- URLs: stripped. Visible link labels stay in the count.
- Captions: the two `Schematic.` lines above. The counter would otherwise count them as paragraphs, so they were removed from the qualified input. Their units are 1138 − 1085 = 53.
- Qualified count: 1085.

## Length class

1085 is in 1000–1999, so this is a short article. It meets the floor and it is not padded toward 2000.

主意图材料已写完. The reader can already do the one approved task from this body: prepare Wood and Hardwood, price the path from the starter house through a named tier, buy each vanilla farmhouse upgrade from Robin, tell the kitchen, crib room, and cellar apart, and treat a renovation as a different order.

- Each tier has its own gold, materials, and three days in the opening sentence and the cost table. The three tiers are not one three-day job.
- Wood, Hardwood, the Large Stump, and the Secret Woods route are in the preparation section. The Steel Axe is limited to that Secret Woods entrance.
- The year-1 bill with 200 Wood already on hand is 12,500g. Buying all 450 Wood is 4,500g in year 1 and 22,500g in year 2 or later. Adding the 10,000g fee makes 14,500g and 32,500g. Those two totals are the fee plus the wood, not a wood unit price.
- 75,000g and 175,000g are sums of the upgrade rows from the starter house. The body says not to pay either sum in one visit.
- The kitchen, crib room, and cellar uses are in the room section. The order section gives 24 Mountain Road and ordinary hours, including that the house can be entered every day from 9:00am to 8:00pm even when the shop is closed. It does not restore a payment-day start, a payment-day room state, or an exception-free Tuesday ban.
- The last section separates the instant renovation from the third upgrade.

Cabin, a ranking, wedding steps, and the rest of the renovation price list were left out of this task. They are not missing pieces of this main intent. No sentence was added to chase 2000.

## Gate binding

D `reviews/D/enriched-v4/report.md` SHA-256 `ae5c87028bcfbd6f5c751aa2024f7d2a5f6514fa11a1c7cb64f447f756f9058d`: ResearchTrace, ReaderValue, and Repetition PASS, 0 issues, on body `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`.

E `reviews/E/enriched-v4/report.md` SHA-256 `9db00d9995472ebe2d316b712e04cf97571e814a98cef793c8b43b11669b7b85`: body PASS, 0 issues, on the same four input hashes. E v3 `reviews/E/enriched-v3/report.md` is FAIL with 6 issues and is not locked.

Shared revision budget remains used 3 of 3, with 0 left, including later translation rework. This first set of 10 titles is not another revision round.

SEO status: pending E. Translation, page assembly, user review, and deploy are not done.
