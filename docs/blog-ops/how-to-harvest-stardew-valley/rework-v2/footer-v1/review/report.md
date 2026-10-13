# footer-v1 independent acceptance

Task `task_2c42f9a0d7b3`. Dispatch `ctx_5880fb1f8d85`. Run `run_2434613566b2`.

This report is the acceptance record for the harvest FAQ, CTA, and Sources footer. It is not a historical whole-page PASS. The cover caption is still an unauthorized, unconfirmed gap. No product source, SEO source, test, frozen handoff, or media file was edited. Nothing was deployed.

## Evidence classes

- This task, source read: `collect-source-facts.mjs` wrote `source-facts.json`. 45 checks passed, 0 failed. It reads the implementation logs and current source. It does not rebuild.
- This task, browser: TaskSpace 151, page `p1`, ownership `agent`. `accept-browser.mjs` exit 0 (`browser-facts.json`, `failures: []`). `recheck-issue-and-answers.mjs` exit 0 (`recheck-facts.json`). `capture-dev-issue.mjs` first exit 1 (`DOM.getBoxModel` had no box), second exit 0 (`dev-issue-facts.json`).
- Historical implementation logs, not rerun here: typecheck exit 0, typecheck-r2 exit 0, webpack build exit 0, vitest CTA 8 passed exit 0, vitest related 100 passed / 1 failed exit 1, vitest sources r2 1 passed / 1 failed exit 1, vitest footer 15 passed / 1 failed exit 1. The single failure in each failing log is the Pine `checkedLabel` assertion.
- Live preview only: `127.0.0.1:3004`, node PID 44772, cwd this worktree. Main `3003` PID 2206, cwd `/Users/wusir/Desktop/开发项目集合/stardew planner`, was not touched. No external service was written.

Recheck a source item by rerunning `node docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/footer-v1/review/collect-source-facts.mjs` from this worktree. Recheck a browser item by resuming TaskSpace 151 and reading the named screenshot plus JSON. Do not start a new TaskSpace.

## Source whitelist

Stripping the two imports (`BlogFaqList`, `BlogSources`) and the footer makes both current articles byte-identical to `implementation/before/`. English stripped sha256 `40743d572fb3a56fb32da4789e4b3b16a61e54cd6ad6072f95763a50c6b2a0c6`. The articles do not import `BlogPlannerCta`. `BlogSources` renders one CTA, then the sources card. Source order is FAQ heading, FAQ list, `BlogSources`.

Public rows, both locales, in this order:

| Order | URL | English label | Chinese label |
| --- | --- | --- | --- |
| 1 | `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979` | Crops on the Stardew Valley Wiki | 星露谷物语维基：作物 |
| 2 | `https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481` | Controls on the Stardew Valley Wiki | 星露谷物语维基：操作 |
| 3 | `https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696` | Scythe on the Stardew Valley Wiki | 星露谷物语维基：镰刀 |
| 4 | `https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836` | Iridium Scythe on the Stardew Valley Wiki | 星露谷物语维基：铱镰刀 |

These four hrefs are a subset of the frozen rework-v2 handoff. Fiber Seeds stays a body citation and is not a fifth public row. Count 4 is inside the required 4–6. Harvest test expectations have `checkedLabel: null`. The `blog-sources.test.tsx` diff against HEAD is 48 additions and 0 deletions.

Each FAQ answer used in the live DOM is a paraphrase of a sentence the collector found in the frozen English or Chinese body. The FAQ does not add the giant-crop 15–21 drop count. English and Chinese ask the same five things: hand harvest on PC, regular scythe versus the 1.6 iridium scythe, giant crop, missed watering, trellis standing tile.

Registry hash still matches the SEO baseline snapshot `d038157140b517bd2e694909d55ec1eaa6809e1ed1db292c9ce7408aa87a8608`. `next-env.d.ts` matches the before hash. English bodyHash is 64 hex characters and matches the frozen handoff.

## Browser footer

Preview routes: `/how-to-harvest-stardew-valley` and `/zh/how-to-harvest-stardew-valley`. Both returned HTTP 200 before the browser run. Viewports were 1440×900 and 375×812. 390×844 was not added: at 375, `scrollWidth` equals `clientWidth` (375) and every measured target is at least 44px on both axes.

Live counts, both locales, both widths: one `h1`, one FAQ list, five triggers, one CTA, four source links, one article planner href. DOM order is FAQ, then CTA, then Sources, top positions increasing. Leak scan booleans for the canary, `docs/blog-ops`, `operation-store`, and `bodyHash` were all false. The canary value is not copied here.

CTA click:

- English landed on `http://127.0.0.1:3004/#planner`, hash `#planner`, `#planner` box 1434×900. Screenshot `screenshots/en-1440-planner.png` shows the farm map.
- Chinese first shot `screenshots/zh-1440-planner.png` was a dark field while the element was already visible at 1409×266. The recheck waited until an image or canvas inside `#planner` had a non-zero size, then `screenshots/zh-1440-planner-r2.png` shows the farm (greenhouse, house, pond) at `http://127.0.0.1:3004/zh#planner`. Planner internals were not reviewed.

Source click, first row, both locales: requested `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979`. The browser reached that oldid and then a Cloudflare challenge. Title was `Just a moment...`. External wiki content is not accepted. The challenge token in `browser-facts.json` was replaced with `REDACTED`.

FAQ interaction:

- Initial state was closed on all four locale/viewport views (`answerHeight` under 2px). Screenshots: `screenshots/{en,zh}-{1440,375}-faq-initial.png`, `*-faq-open.png`, `*-faq-reclosed.png`, `*-sources.png`.
- Keyboard: focus item 2, Enter opens then closes; focus item 3, Space opens then closes. `accept-browser.mjs` exit 0 recorded no keyboard failure. That script's open wait was only `height > 8`, so it is not the readability proof.
- Readability recheck waited until the same height was seen twice, height was above 24, and `scrollHeight <= clientHeight + 2`. All 20 answers met that. Every saved row has `scrollHeight === clientHeight` and `data-state` `open`. No `waitError`.
- The first browser pass measured Chinese desktop items 2 and 3 at 13px and mobile at 23–25px. Those samples were taken at the `height > 8` threshold, during the grid animation. The settled recheck is Chinese 1440 `[71, 71, 45, 71, 71]` and Chinese 375 `[98, 124, 71, 124, 98]`. English settled 1440 `[71, 98, 71, 98, 71]` and 375 `[124, 177, 98, 150, 124]`. This is not a clipped-answer defect.
- `screenshots/zh-1440-faq-item-2-open.png` shows the scythe answer fully: 苋菜、甘蓝菜、小麦、未碾米和纤维种子必须用镰刀收.

Touch and contrast come from computed CSS in `browser-facts.json`. Lowest text ratio is the FAQ answer, 6.63 (`rgb(82, 96, 78)` on `rgb(253, 255, 248)`). Decorative link icon and chevron are 4.84. CTA action is 13.54 on `rgb(201, 251, 69)`. English mobile CTA is 107×44. Chinese mobile CTA is 92×44. Mobile triggers and source rows are wider and taller than 44.

Visual compare, against the supplied carpenter footer screenshot, using the existing `BlogSources` / `BlogPlannerCta` components only. No new CSS, no design-spec file, no skill cache. Computed card is `rgb(241, 247, 231)`, radius 5px, item rows white, link icon present, right chevron present, CTA fill the same green, action fill lime. The Chinese source screenshots show that pattern under the FAQ.

## Live head

Collected once per locale from the live DOM. Both grades in `browser-facts.json` have title, description, canonical, hreflang, robots, html lang, Open Graph, Twitter, one Article, headline, url, inLanguage, no FAQPage/QAPage, cover alt, and body alts true.

| Field | English | Chinese |
| --- | --- | --- |
| title / h1 | How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe | 星露谷物语怎么收作物：徒手、镰刀或斧头 |
| html lang | `en` | `zh-CN` |
| canonical | `https://stardewvalleyplanner.art/how-to-harvest-stardew-valley` | `https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley` |
| robots | `index, follow` | `index, follow` |
| hreflang | `en`, `zh-CN`, `x-default` to the English production URL | same three |
| JSON-LD | one `Article` | one `Article` |
| inLanguage | `en` | `zh-CN` |

H1 count is 1. FAQ headings are `How to Harvest Stardew Valley FAQ` and `星露谷物语收作物常见问题`. Sources headings are `Sources` and `来源`. The static export counts the FAQ heading string twice because the page payload also contains it. The live DOM has one visible FAQ heading.

Article JSON-LD keys are `@context`, `@type`, `headline`, `description`, `url`, `inLanguage`, `isPartOf`. `image`, `author`, and `datePublished` are absent. Google's Article documentation has no required properties, so these are recommended gaps, not an invalid Article and not an indexing failure. No publish date was invented. The page calls do not pass `imagePathname`, author, or date. Visible byline text exists in the article header and is not in the JSON-LD.

Open Graph and Twitter are present (`og:type` `article`, `twitter:card` `summary`, image is the cover webp). `og:locale` is null. That absence is recorded only.

Cover alt is non-empty and the cover has no figcaption. Body images decoded at 1672×941 with non-empty alt and figcaption. The only empty alt on the page is `/favicon.png`.

`out/sitemap.xml` sha256 `33154132d65a4ce802230113e09b37ff1755e726e4f6f2c0dec44849decb5dc1` contains both production locs. That file is the implementation build output, not a new build from this task.

## Dev badge

The badge is visible. On `screenshots/zh-1440-planner-r2.png` it reads `N` and `1 Issue`. On the article shot `screenshots/en-1440-dev-issue.png` only the round `N` is in the corner, which is why `text=1 Issue` matched 0 elements and the accessibility snapshot had no issue line.

Clicking the portal button at (38, 862) opened the Next.js dev menu (`Route`, `Bundler: Webpack`, `Route Info`, `Preferences`), screenshot `screenshots/zh-1440-dev-issue-open.png`. That menu is not the issue text.

After one reload in the same space, the portal shadow text was:

`Console Error: A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.`

The diff names `<html lang="zh-CN">` plus client attribute `data-immersive-translate-page-theme="dark"`, and `<body>` plus client attributes `monica-id` and `monica-version="9.0.23"`. The stack frame is `RootLayout` at `app/zh/layout.tsx` (25:7). The badge also says `Next.js 16.3.0 (stale)`. The full 2150-character portal string is `dev-issue-facts.json` `afterReload.text`.

Supplement `task_ccaa5b98f77f` / `ctx_1b169ff42ccc` compared a fresh Node GET of `http://127.0.0.1:3004/zh` (exit 0, status 200) with the live DOM at `http://127.0.0.1:3004/zh#planner` on the same TaskSpace 151 `p1` (exit 0). Raw attributes are in `root-attribute-comparison.json`. The command record is `root-attribute-command-log.txt`. Server `html` has only `lang=zh-CN`. Server `body` has only `class=__variable_8eaea4`. The browser `html` is the same. The browser `body` also has `monica-id` and `monica-version`. Those two attributes are absent from the server HTML and present in the browser DOM: 服务端HTML未包含，浏览器DOM额外存在；报警差异点已确认. `data-immersive-translate-page-theme` is named in the original portal diff and is absent from both this server HTML and this browser DOM, so the original alarm and the current difference are not the same. This read does not identify which script added the extra attributes. It does not mean a root cause was fixed. The preview was not restarted. `p1` was returned to the English article.

## Outside this footer

Pine `checkedLabel` is a pre-existing mismatch. The test expects `The following public pages support the specific Pine identity...`. The article renders `The public pages below cover Pine identity...`. Harvest expectations have no checked label. Pine文章与其既有测试expectation未改；Sources测试文件追加了本篇期待。

## Still open

- Cover caption remains unconfirmed and was not added.
- Article `image`, `author`, and `date` remain recommended gaps. `og:locale` is absent.
- TaskSpace 151 stays open, name `harvest page r2 acceptance`, ownership `agent`, `p1` left on `http://127.0.0.1:3004/how-to-harvest-stardew-valley` at 1440×900. `task.finish()` was not called, so a later caption check can resume 151.
- No in-scope footer defect was found that needs a fix task.

## Acceptance count

Footer source checks 45 passed / 0 failed. Browser script failures 0. Settled FAQ answers 20/20 unclipped. CTA locale checks 2/2 reached `#planner` with the planner visible. Source navigation reached the requested oldid and did not pass external content. Dev-badge message captured and classified out of scope. Historical vitest still has the one Pine failure.
