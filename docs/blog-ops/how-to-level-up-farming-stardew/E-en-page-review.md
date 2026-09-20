# E-en page review: how-to-level-up-farming-stardew

Role: Agent E-en (live page / Layer 8 recheck after 3003 restore). Same reviewer duty as body/title. Did not assemble the page. Did not rewrite. Did not edit `src/`, `public/`, or tests. Did not start `scripts/dev.sh`.

| Item | Value |
|---|---|
| ego-browser | One TaskSpace `e-en-page-recheck how-to-level-up-farming-stardew`, `spaceId` **78**, Page `p1`. Closed with `task.finish({ keep: [] })`. |
| Article URL | `http://127.0.0.1:3003/how-to-level-up-farming-stardew` |
| Blog URL | `http://127.0.0.1:3003/blog` |
| In-article rancher URL | `http://127.0.0.1:3003/rancher-or-tiller-stardew` (clicked from `a[href="/rancher-or-tiller-stardew"]`) |
| Bound lock hash | `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35` (recomputed this pass from `handoff-en.md` JSON `body` and `locked/en-body.txt`; 21842 bytes NFC UTF-8 LF; match) |
| Lock version | `2026-09-20-en-how-to-level-up-farming-lock-1` |
| Viewports | Desktop **1280×800** (`Emulation.setDeviceMetricsOverride`, `page.info` `w=1280 h=800`). Mobile **390×844** (`w=390 h=844`, `deviceScaleFactor=2`, `mobile=true`). |
| Other origin | Not used. Required origin is 3003 only. |

**Overall: PASS.** Must-fix: **0**.

User final review: **尚未进行** — this Layer 8 pass is not production sign-off and does not stand in for the user.

Previous FAIL (`E-en-page-review.md` 3003 down) does not carry forward.

---

## Binding

| Check | Result |
|---|---|
| Live 3003 | Listening (`node` on `*:3003`). Article/blog/rancher HTTP **200**. |
| Hash vs task bind | Match `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35` |
| Handoff status | `title_passed`, `frozen: true`. Hash match is not by itself a page PASS; the live DOM was checked. |
| User review | `not_started` |

---

## HTTP, Title, H1, Description (live)

| Check | Evidence | Result |
|---|---|---|
| HTTP 200 on EN article | curl **200**; ego-browser `page.goto` loaded `http://127.0.0.1:3003/how-to-level-up-farming-stardew` | **Pass** |
| `document.title` vs lock Title | Live title = `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150` | **Pass** |
| Visible H1 | Same string as Title (desktop + mobile screenshots) | **Pass** |
| Description / OG | `meta[name=description]`, `og:title`, `og:description` match the lock. `og:type=article`. `og:image` = production cover webp | **Pass** |
| Canonical / hreflang | Canonical `https://stardewvalleyplanner.art/how-to-level-up-farming-stardew`. Alternates: `en`, `zh-CN`, `x-default` | **Pass** |
| JSON-LD Article / no FAQPage | One JSON-LD `@type: Article`. Live HTML has no `FAQPage`. `robots=index, follow` | **Pass** |
| `html lang=en` | `en` | **Pass** |

Locked SEO this review is bound to (and observed live):

- Title = H1 = `How to Level Up Farming in Stardew: Watering and Hoeing Add 0 XP; Level 5 Needs 2,150`
- Description = `Harvests, 5-XP animal actions, and a 250-XP Almanac or Book Of Stars grant Farming XP. A blueberry pull is 10 XP, not 10 times the berry count. Quality stars add none. Level 10 is 15,000 total; XP posts now, the popup waits for sleep.`
- slug = `how-to-level-up-farming-stardew`

---

## Body vs lock (live spot-check)

Opening (first reader paragraph, after kicker / dek / byline):

> Farming skill in Stardew Valley rises when you harvest a crop (only the first product of that harvest), when you pet, milk, or shear animals or pick up a coop product, and when you read the Stardew Valley Almanac or Book Of Stars. Using a hoe or a watering can does not grant Farming XP by itself…

Article `h2` (not site footer):

1. Farming XP comes from harvests, animals, and two books
2. How much XP each Farming level takes
3. Harvest for Farming XP, not for gold per day
4. Winter: outdoor harvest XP almost stops
5. Sources

No FAQ H2. Footer chrome also exposes Planner / Explore / Legal; those are site chrome, not article sections.

H3s live: Watering and hoeing do not grant Farming XP; Extra potatoes, blueberries, and cranberries do not add XP; Animals are 5 XP; the Almanac and Book of Stars are 250; The skills tab updates now; recipes wait until morning.

XP numbers observed in the live article text and/or tables:

| Claim | Live |
|---|---|
| Hoe / watering can themselves 0 Farming XP | Present (`Using a hoe or a watering can does not grant Farming XP by itself`; H3 on watering/hoeing) |
| Level 5 = 2,150 | Opening + level table row 5 |
| Level 8 = 6,900 | Opening + table |
| Level 9 = 10,000 | Opening + table |
| Level 10 = 15,000 | Opening + table |
| Animals 5 XP | H3 + figure caption |
| Almanac / Book Of Stars 250 | H3 + figure 1 |
| Blueberry 10 / cranberry 14 / potato 14 | Figure 2 caption + crop table |
| Cauliflower 23 | Body sentence on quality |

In-article rancher: one `a[href="/rancher-or-tiller-stardew"]` with text `Rancher or Tiller`. Click (desktop) navigated to `http://127.0.0.1:3003/rancher-or-tiller-stardew`, live H1 `Rancher or Tiller in Stardew: Farming 5 Also Locks Your Farming 10 Pair`.

Language switch: header `button[aria-label=Language]` → English (current) and `中文` → `http://127.0.0.1:3003/zh/how-to-level-up-farming-stardew` (ZH Title/H1 `星露谷耕种怎么升级：浇水和锄地不加经验，5级要2150`).

Residue search on live `documentElement.innerHTML` (`未取得`, `Editor appendix`, `docs/blog-ops`, Agent E/F/G, `internal-canary`, `ResearchTrace`, `mechanical_units`, `C-en-draft`, `PublicBlogHandoff`, `Layer 8`, `FAQPage`): **no hits**.

---

## Images (not cover-only)

Cover + two body figures all HTTP **200** from 3003 (webp and avif). Live `<picture>` prefers avif.

| Role | Live `currentSrc` after load | In article | In `<figure>` | Displayed (1280 / 390) |
|---|---|---|---|---|
| Cover (hero, not a body figure) | `/blog/how-to-level-up-farming-stardew-cover.avif` | yes (hero) | no | 1088×612 / 358×201 |
| Fig 1 source map | `/blog/illustrations/farming-xp-source-map.avif` | yes | yes | 704×396 / 358×201 |
| Fig 2 first product | `/blog/illustrations/farming-xp-first-product-only.avif` (lazy; naturalWidth 1672 after scroll) | yes | yes | 704×396 / 358×201 |

Fig 1 sits after the first-product harvest paragraph and before H3 “Watering and hoeing…”. Caption restates sources vs non-sources (harvest / 5 XP animals / 250 books; hoe, can, sprinkler water, extras, truffles out).

Fig 2 sits in the extra-potatoes/blueberries/cranberries block. Caption: blueberry 10 once, cranberry 14 once, potato 14 once.

This is not a cover-only page.

---

## Overflow, tables, `/blog`

| Check | Desktop ~1280 | Mobile ~390 |
|---|---|---|
| `scrollWidth` vs `innerWidth` | 1274 vs 1280, overflowing **false**; 0 layout offenders | 390 vs 390, overflowing **false**; 0 layout offenders |
| Level table (4 col, 11 rows) | width 702, in `.blog-table-scroll`, does not exceed viewport | width 356, still in `.blog-table-scroll`, does not exceed viewport. Header cells wrap (`parsnips`, `Overnight unlock`) |
| Crop XP table (3 col, 21 rows) | width 702, no page overflow | width 356, no page overflow |
| `/blog` Latest card | Locked title on the Latest card; cover matches this article; click `nth=1` of `/how-to-level-up-farming-stardew` returned to the EN article | Same locked title in Latest; `scrollWidth=390` |
| Rancher click | Live rancher article 200 | Link present in article (`Rancher or Tiller`) |

`.blog-table-scroll` computed `overflow-x: visible` on both viewports. The tables shrink to the column instead of forcing page-width overflow. That meets the overflow gate. Header wrapping at 390 is residual, not a must-fix.

---

## Screenshots (this pass)

All under `docs/blog-ops/how-to-level-up-farming-stardew/e-en-page-review-assets/`:

- `en-article-desktop-1280-top.png`
- `en-article-desktop-1280-fig1-source-map.png`
- `en-article-desktop-1280-fig2-first-product.png`
- `en-article-desktop-1280-level-table.png`
- `en-rancher-from-in-article-link.png`
- `en-blog-desktop-1280.png` / `en-blog-desktop-1280-latest.png`
- `en-language-menu-open.png` / `en-lang-switch-to-zh.png`
- `en-article-mobile-390-top.png`
- `en-article-mobile-390-fig1.png` / `en-article-mobile-390-fig2.png`
- `en-article-mobile-390-level-table.png` / `en-article-mobile-390-crop-table.png`
- `en-blog-mobile-390.png`

Older `en-article-3003-desktop-connection-refused.png` is the previous FAIL, not this pass.

---

## Must-fix

None.

---

## Residuals (not must-fix)

1. Next.js “N” overlay (`Open Next.js Dev Tools`) sits on the live 3003 page and covers a few letters in mobile screenshots. Dev chrome, not article copy.
2. At 390, fig 1 inner labels are small (diagram displayed ~358×201). The figure caption restates the same map in body type.
3. At 390, the 4-column level table wraps header words inside the column. Page does not scroll sideways.
4. At 390, the header brand mark compresses to a ~26×46 control; Blog / Language / Open planner remain usable.
5. User final review remains **尚未进行**. Local 3003 is the user-reachable URL for that review; this PASS does not publish production.
6. Did not treat source TSX as Layer 8. Did not use port 3002.

---

**This version: PASS.** Bound to live `http://127.0.0.1:3003/how-to-level-up-farming-stardew` and lock hash `1cd057b5c31abb3ce30ea724f2fcafb44f5f7978d564a25d5c7efd2b4ffb0c35`. Must-fix: **0**. User final review: **尚未进行**.
