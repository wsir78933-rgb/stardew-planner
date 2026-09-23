# E-en final local page review: `pine-tree-stardew`

- **Review date:** 2026-09-23 (Asia/Shanghai)
- **Role:** E-PAGE-EN-FINAL; local live-page review only. No source, asset, test, handoff, registry, dependency, commit, push, deploy, or repair changes were made.
- **Only write target:** `docs/blog-ops/pine-tree-stardew/E-en-page-final-review.md`.
- **Browser:** local EGo Browser (`ego-browser nodejs`), one agent TaskSpace `37`, page `p1`; no Codex browser or guessed browser was used.
- **Target:** `http://127.0.0.1:3003/pine-tree-stardew`.
- **Related routes reviewed:** `http://127.0.0.1:3003/blog`, `http://127.0.0.1:3003/zh/pine-tree-stardew`, and `http://127.0.0.1:3003/zh/blog`.
- **Viewports:** desktop `1440×900` and mobile `390×844`, both with EGo/CDP viewport evidence.

## Executive verdict

**Target EN article checks: PASS.** The real local EN article returned HTTP 200, rendered the expected body, metadata, source list, cover, two in-body figures, table treatment, navigation, language switch, internal links, and external source links. The target-specific blocker count is **0**.

**Separate shared-shell finding: FAIL (not target-specific).** At `390×844`, the public header brand link is visibly an empty rounded pill on both `/pine-tree-stardew` and `/blog`: the accessible brand text exists in DOM, but the brand link is only 26px wide and its `/favicon.png` child has a computed width of 0px. This is a pre-existing/shared public-shell problem reproduced on the unrelated EN blog index; it is reported only and was not repaired.

**User final review: PENDING. Deployment: PENDING.** This report proves only the local `127.0.0.1:3003` runtime and local EGo/browser state.

## 1. Runtime identity and G evidence

`docs/blog-ops/pine-tree-stardew/G-runtime-evidence.md` was read before browser work. Its recorded chain (`listener_pid=96068`, parent `96054`, `pnpm_pid=96016`) was not live when this review began: `lsof -nP -iTCP:3003 -sTCP:LISTEN` returned no rows, and the first EGo navigation returned `net::ERR_CONNECTION_REFUSED`.

Because the requested port was free and the task requires an actual local route, `pnpm dev` was started from this exact checkout. The current listener was independently verified rather than inferred from the G report:

```text
$ lsof -nP -iTCP:3003 -sTCP:LISTEN
COMMAND   PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    12347 wusir   17u  IPv6 ...          0t0  TCP *:3003 (LISTEN)

12347 12333 wusir S+ next-server (v16.3.0)
12333 12293 wusir S+ node .../博客二/node_modules/.../next/dist/bin/next dev --port 3003
12293  7394 wusir Ss+ node /opt/homebrew/opt/node@24/bin/pnpm dev

p12347 fcwd n/Users/wusir/orca/workspaces/stardew planner/博客二
p12333 fcwd n/Users/wusir/orca/workspaces/stardew planner/博客二
p12293 fcwd n/Users/wusir/orca/workspaces/stardew planner/博客二
```

The verified chain is therefore `pnpm dev` PID `12293` → Next PID `12333` → listener PID `12347`, all with cwd `/Users/wusir/orca/workspaces/stardew planner/博客二`. No other port or process was touched; the server was left running for the local review.

## 2. HTTP route proof

Independent Node `fetch()` route probes against the actual `127.0.0.1:3003` listener:

```text
/pine-tree-stardew       status=200 final=http://127.0.0.1:3003/pine-tree-stardew type=text/html; charset=utf-8 bytes=133882
/blog                    status=200 final=http://127.0.0.1:3003/blog type=text/html; charset=utf-8 bytes=69910
/zh/pine-tree-stardew    status=200 final=http://127.0.0.1:3003/zh/pine-tree-stardew type=text/html; charset=utf-8 bytes=119446
/zh/blog                 status=200 final=http://127.0.0.1:3003/zh/blog type=text/html; charset=utf-8 bytes=67734
```

The same probes read these title/H1 pairs:

| Route | Title | H1 | Result |
|---|---|---|---|
| `/pine-tree-stardew` | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | Same | **PASS** |
| `/blog` | `Stardew Valley Planning Guides` | Same | **PASS** |
| `/zh/pine-tree-stardew` | `星露谷松树种植先看格子，不浇水也不能随便种` | Same | **PASS** |
| `/zh/blog` | `星露谷农场规划指南` | Same | **PASS** |

## 3. EN article metadata and structured data

The following was read from the rendered EGo DOM at both `1440×900` and `390×844`; raw HTML was also independently parsed from the actual route response.

| Check | Evidence | Result |
|---|---|---|
| URL / `lang` | `http://127.0.0.1:3003/pine-tree-stardew`; `<html lang="en">` | **PASS** |
| `document.title` | `Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar` | **PASS** |
| Page-level H1 | Exactly one H1, same as title | **PASS** |
| Description | `Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.` | **PASS** |
| Canonical | `https://stardewvalleyplanner.art/pine-tree-stardew` | **PASS** |
| Hreflang | `en` → production EN; `zh-CN` → production ZH; `x-default` → production EN | **PASS** |
| JSON-LD count/type | Exactly one `application/ld+json`, `@type: Article` | **PASS** |
| JSON-LD exclusions | No `FAQPage`, no `BlogPosting` | **PASS** |
| Topic / author / read time | Visible `Stardew Valley Guides`; `By Stardew Valley Planner Team · 12 min read` | **PASS** |

Raw response JSON-LD was:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Pine Tree Stardew Valley: Fix Stage 4 and Tap Pine Tar",
  "description": "Plant a Pine Cone on valid, untilled ground, skip watering, inspect all eight neighbors at stage 4, and use a normal or Heavy Tapper only after the Pine matures.",
  "url": "https://stardewvalleyplanner.art/pine-tree-stardew",
  "inLanguage": "en",
  "isPartOf": {"@id": "https://stardewvalleyplanner.art/#website"}
}
```

## 4. Current body, sources, and residue

- Rendered `article.innerText` length was **18,439 characters**. The opening rendered body begins with the Pine Cone → Pine Tree → Pine Tar chain and the valid-untilled-ground / no-watering / eight-neighbor / mature-Tapper summary; it is not cover-only.
- The article contains the identity, planting, stage-4 diagnosis, growth-method, Tapper, Pine Tar use, and `Sources` sections. The source panel contains the Pine Tree, Pine Cone, Trees, Pine Tar, Tapper, Tree Fertilizer, and official 1.6 changelog references.
- The article had **42 source/link elements**, representing **24 unique internal article links** (same-page anchors plus the tree-layout guide and planner CTA) and **7 unique external source links**.
- Article-only residue scan returned `[]` for `FAQ`, `Frequently Asked`, `ResearchTrace`, `docs/blog-ops`, `Editor appendix`, `V7-`, `handoff`, `PublicBlogHandoff`, `prompt`, and related private-process markers. `articleFaq=[]` was also returned by the DOM scan.
- The global footer has an expected `FAQ` navigation link to `/#faq`; that shell link is not an article FAQ section and is not counted as article residue.
- EGo `page.events()` after the target route flow returned `[]`; no buffered browser runtime/console event was observed in this pass.

**Body/residue result: PASS.**

## 5. Cover and in-body figures

The rendered article has one cover and two in-body `<picture>` figures. All three media assets are `1672×941`; the cover is eager/non-lazy, while both in-body figures are `loading="lazy"`. EGo used the AVIF `<source>` when the image was in/near the viewport; the WebP `img` fallback remains present in raw HTML.

| Figure | EGo rendered state | Result |
|---|---|---|
| Cover | `currentSrc=/blog/pine-tree-stardew-cover.avif`, `complete=true`, `naturalWidth=1672`, `naturalHeight=941`, `loading=auto` at desktop and mobile first render | **PASS** |
| Pine Cone → Pine Tar figure | AVIF current source, lazy, complete with `1672×941` when inspected in article flow | **PASS** |
| Stage-4 neighbor figure | Initially not loaded while below the viewport; after `scrollIntoView({block:"center"})`, `currentSrc=/blog/illustrations/pine-tree-stage-four-neighbor.avif`, `complete=true`, `1672×941` at both desktop and mobile | **PASS**; expected lazy behavior |

The four image paths were independently fetched from the local origin with these results:

```text
/blog/pine-tree-stardew-cover.avif                         200 image/avif 19430 bytes
/blog/illustrations/pine-tree-seed-to-tar.avif             200 image/avif 17100 bytes
/blog/illustrations/pine-tree-stage-four-neighbor.avif    200 image/avif 15994 bytes
/blog/illustrations/pine-tree-stage-four-neighbor.webp     200 image/webp 20746 bytes
```

The cover and both figures rendered with the locked descriptive alt text. The EGo screenshots show the cover at desktop/mobile first render and both figures after their lazy-load positions were reached.

## 6. Tables and responsive layout

Desktop EGo DOM at `1440×900`:

- Two `.blog-table-scroll` wrappers; article table width `702px`, wrapper width `704px`, `overflow-x:auto`.
- Document/body `scrollWidth=1434`, `clientWidth=1434`; no page-level horizontal overflow.

Mobile EGo DOM at `390×844` after scrolling to the first table:

```text
table[0] width=608, wrapper width=358, clientWidth=356, scrollWidth=608, overflow-x=auto
table[1] width=608, wrapper width=358, clientWidth=356, scrollWidth=608, overflow-x=auto
document scrollWidth=390, clientWidth=390
```

The mobile table intentionally requires horizontal scrolling inside its wrapper, but does not widen the page. The captured mobile table screenshot shows the scroll region and readable body text.

**Table treatment and page overflow: PASS.**

## 7. EGo desktop/mobile visual evidence

Temporary screenshots were captured by the local EGo Browser; they are not added to the repository:

| Surface | Viewport | Screenshot |
|---|---:|---|
| EN article top/cover | 1440×900 | `/tmp/ego-pine-en-desktop-1440x900.png` |
| EN article stage-4 figure | 1440×900 | `/tmp/ego-pine-en-figure2-1440x900.png` |
| EN article Sources/footer | 1440×900 | `/tmp/ego-pine-en-bottom-1440x900.png` |
| EN article top/cover | 390×844 | `/tmp/ego-pine-en-mobile-390x844.png` |
| EN article responsive table | 390×844 | `/tmp/ego-pine-en-mobile-table-390x844.png` |
| EN article stage-4 figure | 390×844 | `/tmp/ego-pine-en-mobile-figure-390x844.png` |

Visual observations:

- Desktop shows the full EN title, description, byline, cover, header navigation, two-column article/TOC layout, figure, source cards, and footer.
- Mobile shows the wrapped title/description, cover, TOC, readable prose, responsive figure, and contained table scroll region.
- No target article content is clipped by the page viewport beyond the intentional horizontal scrolling inside the table/carousel wrappers.

## 8. Blog index and article card

The EN blog index was inspected with EGo at both requested viewports.

| Check | Desktop 1440×900 | Mobile 390×844 | Result |
|---|---|---|---|
| Route/title/H1 | `/blog`, title/H1 `Stardew Valley Planning Guides` | Same | **PASS** |
| Target latest card | First card in `Latest articles` after scroll; Pine title, 12 min read, cover AVIF complete `1672×941` | Same target card after scroll; card width `356px`, cover complete `1672×941` | **PASS** |
| Card click | EGo click on target card returned `/pine-tree-stardew` with EN title/H1 | Same click path was used from mobile | **PASS** |
| Page overflow | `scrollWidth=1434`, `clientWidth=1434` | `scrollWidth=390`, `clientWidth=390` | **PASS** |

Screenshots:

- `/tmp/ego-pine-blog-desktop-1440x900.png` — EN blog top shell.
- `/tmp/ego-pine-blog-mobile-390x844.png` — EN blog top shell.
- `/tmp/ego-pine-blog-latest-desktop-1440x900.png` — latest carousel with Pine card first.
- `/tmp/ego-pine-blog-latest-mobile-390x844.png` — mobile latest carousel with Pine card first.

## 9. Navigation and links

### Language switch (real EGo clicks)

1. On EN article, EGo clicked the `Language` button; the menu became visible with `English` → `/pine-tree-stardew` and `中文` → `/zh/pine-tree-stardew`.
2. EGo clicked `中文`; the resulting route was HTTP 200, `lang=zh-CN`, title/H1 `星露谷松树种植先看格子，不浇水也不能随便种`, and the localized description was present.
3. EGo opened the Chinese language menu, clicked `English`, and returned to HTTP 200 EN with `lang=en` and the locked EN title/H1.

**Language switch: PASS.**

### Header, footer, and relevant internal links

- EGo clicked header `Blog` from the article and reached `/blog`.
- EGo clicked the target blog card and returned to `/pine-tree-stardew`.
- EGo clicked the in-article general tree layout guide; it reached `/stardew-valley-trees` HTTP 200 with title `Mark keep, orchard, and clear tiles before you chop Stardew Valley trees` and one matching H1.
- EGo clicked the in-article `Open planner`; it reached `http://127.0.0.1:3003/#planner`, title `Stardew Valley Planner – Free Online Farm Layout Tool`, and the `#planner` element was present.
- Local status checks for `/`, `/blog`, `/stardew-valley-trees`, `/#planner`, `/privacy`, `/terms`, and `/contact` all returned HTTP 200.
- Header/footer DOM links include Planner, Blog, English, 中文, Open planner, How it works, FAQ, Privacy Policy, Terms of Service, and Contact us.

**Relevant internal navigation: PASS.**

### External source links

The seven unique external article source URLs were fetched from Node and all returned HTTP 200 in this review:

```text
200 https://wiki.stardewvalley.net/Pine_Tree
200 https://wiki.stardewvalley.net/Pine_Cone
200 https://wiki.stardewvalley.net/Trees
200 https://wiki.stardewvalley.net/Pine_Tar
200 https://wiki.stardewvalley.net/Tapper
200 https://wiki.stardewvalley.net/Tree_Fertilizer
200 https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/
```

**External source links: PASS.**

## 10. Separate shared-shell failure (do not attribute to Pine article assembly)

**FAIL — mobile public brand rendering at 390×844, shared by `/pine-tree-stardew` and `/blog`.**

Rendered EGo DOM on both routes:

```text
brand link accessible text: Stardew Valley Farm Planner
brand link rect: left=20, top=17.59375, width=26, height=46
child /favicon.png: complete=true, naturalWidth=64, naturalHeight=64
child image rect: left=33, top=26.59375, width=0, height=28
```

The mobile screenshots show a blank rounded brand pill at the top-left instead of the desktop pumpkin icon/text. Because the same result is reproduced on the unrelated EN `/blog` index, classify this as **shared public-shell / existing-page failure**, not a Pine-specific article failure. No source repair was performed under this review task.

## 11. Boundaries and pending work

- This is local browser proof only; it is not production proof, deployment proof, indexing proof, or user approval.
- No source, asset, test, handoff, registry, package, or unrelated documentation file was edited.
- No commit, push, deploy, database write, external service write, or cleanup was performed.
- The public-shell mobile brand finding remains pending owner review; the target article itself has no target-specific must-fix found in this pass.
- User final review and deployment remain pending.
