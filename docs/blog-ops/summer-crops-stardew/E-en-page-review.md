# E-en page review: summer crops stardew

Role: Agent E-en (live page). Same reviewer duty as body/title. Did not rewrite. Did not treat D/F/title PASS as this verdict.

| Item | Value |
|---|---|
| Tool | ego-browser task space `summer-crops-stardew-page-en` (id 226) |
| Article URL | http://127.0.0.1:3003/summer-crops-stardew |
| Blog URL | http://127.0.0.1:3003/blog |
| ZH counterpart | http://127.0.0.1:3003/zh/summer-crops-stardew |
| Locked Title/H1 | Summer Crops in Stardew: Rank by the Shop You Can Open This Morning |
| Viewports | Desktop CDP 1280×800; mobile CDP 390×844 (`deviceScaleFactor` 2) |

**Overall: PASS.** Must-fix for G: **0**.

User final review: **not yet — waits for the live site page** (this is local `127.0.0.1:3003`, not production user sign-off).

---

## HTTP, Title, H1

| Check | Evidence | Result |
|---|---|---|
| HTTP 200 | `fetch(location.href)` → `{ status: 200, type: "text/html; charset=utf-8" }` | Pass |
| `document.title` | `Summer Crops in Stardew: Rank by the Shop You Can Open This Morning` | Pass |
| Visible H1 | Same string; one `h1` | Pass |
| Description / OG | Match locked Description (26.92g/day, Oasis 400g, Year 1 blueberry/melon/hops, Year 2 Red Cabbage 17.78g/day) | Pass |
| `html lang` | `en` on EN route; `zh-CN` after language switch | Pass |
| Canonical | `https://stardewvalleyplanner.art/summer-crops-stardew` | Pass (project canonical, not a fake localhost URL in the tag) |

---

## Body facts (desktop + mobile innerText)

| Claim | Desktop 1280×800 | Mobile 390×844 |
|---|---|---|
| Starfruit / Oasis / 400g | Present | Present |
| Year 1 blueberry, melon, hops | Present | Present |
| Luau **sells** one starfruit per year for 3,000g | Match | Match |
| Luau **worth** 3,000g | Absent | Absent |

Not cover-only: article text length ~23k characters; six working H2s plus Sources.

---

## Images (cover + two in-article figures)

All three WebPs `GET` 200 from the page origin:

| Asset | HTTP | After scroll-into-view |
|---|---|---|
| `/blog/summer-crops-stardew-cover.webp` | 200, `image/webp`, 201342 bytes | natural 1672×941, visible |
| `/blog/illustrations/summer-crop-occupancy-calendar.webp` | 200, `image/webp`, 89004 bytes | natural 1672×941, figure 1 in viewport |
| `/blog/illustrations/summer-hops-melon-blueberry-bed.webp` | 200, `image/webp`, 73282 bytes | natural 1672×941, figure 2 in viewport |

Lazy figures start `complete: false` until scrolled; after `scrollIntoView` they decode. CDP screenshots at 1280×800 show:

- Cover: outdoor field, blueberry bushes, melon block, hops trellis, watering can (matches alt).
- Figure 1: Summer 1–28 occupancy calendar (blueberry 14/18/22/26, hops 12–28, melon last-plant 16, starfruit 15) plus the locked caption.
- Figure 2: one-bed grid (OK hops/walk/melon 3×3/blueberry; FAIL hops ring; FAIL sprinkler in 3×3) plus the locked caption and the five steps.

Mobile 390×844: cover 356×199; both figures 356×199, `complete: true`, in viewport. Not cover-only.

---

## Tables

Ranking table (16×6) is wider than the article column.

| Viewport | parent `overflow-x` | scrollWidth / clientWidth | Can scroll |
|---|---|---|---|
| 1280×800 | `auto` | 1255 / 702 | Yes (`scrollLeft` 400 worked; gold/day cells 26.92g / 20.8g / 17.78g visible after scroll) |
| 390×844 | `auto` | 1255 / 356 (table 1); 608 / 356 (table 2) | Yes |

Does not overflow the page hopelessly. Scroll region exists. Residual: first paint clips the gold/day column until the reader swipes.

---

## Links (spot-check)

| Link | How | Result |
|---|---|---|
| Wiki Starfruit | Click in-article `a[href="https://stardewvalleywiki.com/Starfruit"]` | Landed `https://stardewvalleywiki.com/Starfruit`, H1 Starfruit |
| Wiki Oasis | `openOrReuseTab` (same href as in body) | `https://stardewvalleywiki.com/Oasis`, H1 Oasis |
| Spring crop | Click `a[href="/best-spring-crop-stardew"]` | `http://127.0.0.1:3003/best-spring-crop-stardew`, locked spring Title/H1 |
| Planner | Click in-article `article a[href="/#planner"]` and header Open planner | `http://127.0.0.1:3003/#planner`, title “Stardew Valley Planner – Free Online Farm Layout Tool”, `#planner` present |

---

## Language switch and blog card

| Step | URL / H1 |
|---|---|
| EN Language → 中文 | `http://127.0.0.1:3003/zh/summer-crops-stardew` · H1 `星露谷夏天种什么：按买得到的种子和浇得完的格子选` · `lang=zh-CN` · Chinese chrome 博客 / 语言 / 打开规划器 |
| ZH 语言 → English | Back to `http://127.0.0.1:3003/summer-crops-stardew`, locked EN Title/H1, `lang=en` |
| `/blog` | HTTP page `Stardew Valley Planning Guides`. Latest-articles card: cover + title “Summer Crops in Stardew: Rank by the Shop You Can Open This Morning” · href `/summer-crops-stardew` |

---

## Residue, nav, chrome

Reader `innerText` / HTML scan: no Agent names, hashes, `public/blog` paths as visible copy, SERP ranks, `Editor appendix`, or `must-fix`.

Header on EN: Stardew Valley Farm Planner · Blog · Language · Open planner. Footer Planner / Explore / Legal. Matches other local posts (spring, money).

---

## Residuals (not FAIL)

1. Next.js “1 Issue” badge on this ego-browser session is a **hydration mismatch on `<body monica-id=… monica-version=…>`** from the Monica extension, not article markup. Overlay docs point at `app/(en)/layout.tsx` only as the `<body>` parent. Not a G must-fix.
2. Ranking table needs horizontal scroll in the 702px (desktop) / 356px (mobile) column. Region exists.
3. Figure 1–2 diagrams include Chinese labels as well as English. Locked English captions sit under the images.
4. This PASS is local `127.0.0.1:3003` only. Production and user final review are separate.

---

**This version: PASS.** Desktop 1280×800 and mobile 390×844. Must-fix for G: **0**.
