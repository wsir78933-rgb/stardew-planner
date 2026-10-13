# footer-v1 implementation report

Task `task_29a844561a77`. Dispatch `ctx_cc2cd51525a9`. Run `run_2434613566b2`.

This is the private record for the user-confirmed FAQ and Sources append. It is not an independent page PASS. The frozen handoff was not edited, and the recorded body hashes stay as they were.

## What was appended

After the Troubleshooting list in both article files, the only additions are two imports plus a local H2, one `BlogFaqList` with five questions, and one `BlogSources`. `BlogSources` already renders `BlogPlannerCta`, so no second CTA was added.

English heading: `How to Harvest Stardew Valley FAQ`. Sources heading `Sources` maps to `/#planner`.

Chinese heading: `星露谷物语收作物常见问题`. Sources heading `来源` maps to `/zh#planner`.

Coordinator message `msg_471ddb3e58de` narrowed the public source list to four locked oldid URLs. Fiber Seeds is cited by the frozen body and is recorded below, but it is not a public source row.

| Order | URL | English label | Chinese label |
| --- | --- | --- | --- |
| 1 | `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979` | Crops on the Stardew Valley Wiki | 星露谷物语维基：作物 |
| 2 | `https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481` | Controls on the Stardew Valley Wiki | 星露谷物语维基：操作 |
| 3 | `https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696` | Scythe on the Stardew Valley Wiki | 星露谷物语维基：镰刀 |
| 4 | `https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836` | Iridium Scythe on the Stardew Valley Wiki | 星露谷物语维基：铱镰刀 |

JSON-LD stays Article. The page template still calls `createArticleStructuredData` only. No FAQPage or QAPage was added. Cover caption was not touched.

## Locked body proof

Before snapshots are in `before/`. `compare-locked-body.mjs` removes the two new imports and the footer, then compares the remainder with those snapshots. It writes `locked-body-comparison.json` in this directory and does not write `assembly-g/visible-body-comparison.json`.

Both locales matched byte for byte on source and on SSR. Stripped pages still have 25 hrefs and 2 lazy images. Current pages have 30 hrefs: the original 25, one planner CTA, and four source links. Historical assembly comparison SHA-256 stayed `4e1edeae7b28ad2798c03c47ad9fee6084851877fde9afb41490f8ed23f0e665`.

Handoff file hashes at the end match the start snapshot:

- English handoff `8ca4288debffa704154f48db2a58b68a2fadbd68fa2628040b49d37a7f56485f`
- Chinese handoff `896976369ee8abc18fbcc5983f2f5472fa5b0dcd216244f2046eeca6a390d7eb`
- English bodyHash `d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67`
- Chinese bodyHash `30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd`

## FAQ sentences and citation URLs

Public FAQ copy does not include these review notes.

### 1. PC hand harvest

English question: How do you harvest a regular mature crop by hand on PC?

English answer uses these frozen sentences:

- `stand beside a mature plant and right-click it` — `https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411`
- `Stand next to the ripe crop and right-click it. Keyboard X is mapped to the same Check/Do Action as right-click, allowing you to harvest individual plants by pressing X.` — same Steam URL, plus `https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481`
- `A hand harvest does not need a tool swing.` — same Controls URL is on the preceding tool sentence; this sentence has no link of its own.

Chinese question: 在 PC 上，普通成熟作物怎么徒手收？

- `站在成熟植株旁边右键点它` — same Steam URL
- `站在成熟作物旁边，右键点它。键盘上 X 和右键映射成同一个 Check/Do Action，按 X 就能一株一株地收。` — Steam URL and Controls oldid `192481`
- `用手收，不需要挥工具。` — Controls oldid `192481` is on the preceding tool sentence.

### 2. Regular scythe and 1.6 iridium scythe

English question: Which crops need a regular scythe, and how is the 1.6 iridium scythe different?

- `A standard scythe is required for certain other crops, such as amaranth, kale, and wheat. Right-clicking or pressing X does not harvest them.` — `https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696`
- `Kale is harvested with a scythe or better` — `https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520`
- `unmilled rice is harvested with a scythe` — `https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130`
- `fiber seeds are harvested with the scythe` — `https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587`
- `The iridium scythe is the 1.6 Farming Mastery scythe. Within its swing it harvests crops grown on tilled soil, including regular crops.` — `https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836`

Chinese question: 哪些作物要用普通镰刀，1.6 的铱镰刀有什么不同？

- `另外一些作物必须用普通镰刀来收，例如苋菜、甘蓝菜和小麦。右键点它，或者按 X，都收不下来。` — Scythe oldid `171696`
- `甘蓝菜要用镰刀或更好的镰刀来收` — Kale oldid `192520`
- `未碾米要用镰刀来收` — Unmilled Rice oldid `194130`
- `纤维种子要用镰刀来收` — Fiber Seeds oldid `193587`
- `铱镰刀是 1.6 耕种精通（Farming Mastery）给的那把镰刀。挥过的范围内，能收耕地上长出来的作物，普通作物也包括在内。` — Iridium Scythe oldid `186836`

Kale, Unmilled Rice, and Fiber Seeds stay in the body links. They are not extra public source rows.

### 3. Giant crop

English question: How do you harvest a giant crop?

- `Harvest a giant crop with any axe. It takes three hits and drops 15 to 21 normal-quality items.` — `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Giant_Crops`
- `Face the giant crop and strike it three times using your tool button (left-click or C on PC).` — no separate URL.

The public answer keeps any axe and three hits. It leaves out the 15 to 21 drop count.

Chinese question: 巨大作物怎么收？

- `巨大作物用任意斧头来收。要砍三下` — same Giant Crops URL, which is on the drop clause of that sentence.
- `面向巨大作物，用使用工具的键砍三下（PC 上是左键或 C）。` — no separate URL.

### 4. Missed watering

English question: Does a missed watering day delay the harvest?

- `crops must be watered every day for maximum growth` — `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979`
- `If unwatered for a day, a crop will not grow, though unwatered crops do not die.` — same Crops URL is the citation for that paragraph.
- `Unwatered days pause growth without killing the plant, delaying maturity by one morning per dry day.` — troubleshooting sentence; the Crops URL above is the reviewed watering source.
- `Fiber seeds are a distinct exception: they do not require daily watering to grow, yet still require a scythe when fully grown.` — Fiber Seeds oldid `193587` is the link on `fiber seeds are harvested with the scythe` in the same paragraph.

Chinese question: 漏浇水会推迟成熟吗？

- `作物必须每天浇水，才能按最快速度生长` — Crops oldid `193979`
- `有一天没浇，这一天就不长，但没浇水的作物不会死。`
- `没浇水的日子会暂停生长，但不会把植株弄死；每干一天，成熟就晚一个早晨。`
- `纤维种子是单独的例外：生长不需要每天浇水，但完全长成以后仍然要用镰刀收。` — Fiber Seeds oldid `193587`

### 5. Trellis standing tile

English question: Why do trellis crops need a neighboring standing tile?

- `Green bean, hops, and grape grow on a trellis. You cannot walk through a living trellis, so each plant needs a layout that lets you stand on a neighboring tile.` — `https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Trellis_Crops`
- `Planting trellises in solid blocks leaves interior plants unreachable for watering and harvesting.` — same Crops page; this sentence has no link of its own.

Chinese question: 棚架作物为什么必须留邻近站位？

- `青豆、啤酒花和葡萄长在棚架上。活着的棚架走不穿，所以每株都要有一格能站在旁边。` — same Trellis Crops URL
- `棚架如果种成实心一块，里面的植株就浇不到，也收不到。`

## Verification

Preview `127.0.0.1:3004` stayed PID `44772`, cwd this worktree. It was not restarted. `pnpm dev` and `pnpm test` were not run.

| Command | Exit | Result |
| --- | ---: | --- |
| `git diff --check` on tracked diffs | 0 | no whitespace diagnostics |
| `pnpm typecheck` before the sources-list reorder | 0 | `typecheck.exit.txt` |
| `pnpm typecheck` after the sources-list reorder | 0 | `typecheck-r2.exit.txt` |
| `pnpm exec next build --webpack` | 0 | Next.js 16.3.0 (webpack), compiled, TypeScript finished, 66 static pages. `build-webpack.exit.txt` |
| Isolated Vitest, 10 files, after the build and before the sources reorder | 1 | 9 files passed, 1 failed. 100 passed, 1 failed. `vitest-related.exit.txt` |
| Isolated Vitest, `blog-sources.test.tsx` only, after harvest expectations were moved first | 1 | 1 passed, 1 failed. Failure is still the Pine checked label. `vitest-sources-r2.exit.txt` |
| `blog-planner-cta.test.tsx` alone | 0 | 8 passed |
| `compare-locked-body.mjs` | 0 | source and SSR match the before snapshots |
| `verify-harvest-footer.mjs` | 0 | each locale has 5 FAQ buttons, 1 CTA, 4 source anchors, no FAQPage |

The build changed `next-env.d.ts` to 288 bytes, SHA-256 `1862ac4bbbc5192d4bf562161df66ea547ed3e67173100656ab606ae9797db2b`. It was restored from `before/next-env.d.ts.txt`. Restored hash is `0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc`, 296 bytes.

Static export after the build:

- `out/how-to-harvest-stardew-valley.html` 87127 bytes: 1 FAQ list, 5 triggers, 1 CTA, 1 Sources, 1 Article, 0 FAQPage.
- `out/zh/how-to-harvest-stardew-valley.html` 83902 bytes: the same counts, with the Chinese title.

Live read before the build, saved as `http-en.html` and `http-zh.html`, was HTTP 200 for both routes. Each page had one `data-blog-planner-cta` and five FAQ triggers. A second `/#planner` or `/zh#planner` href is the existing header dock, not a second article CTA.

Vitest used `docs/blog-ops/how-to-harvest-stardew-valley/verification/cache-isolation/vitest.config.mjs` and `--configLoader runner`.

## Out of scope

`tests/blog/blog-sources.test.tsx` fails on the English Pine article. HEAD already has checked label `The public pages below cover Pine identity...` in `pine-tree-stardew.en.tsx`, while the test expects `The following public pages support the specific Pine identity...`. This task did not change that article or that expectation. Harvest expectations sit first in the loop, and the thrown assertion is still the Pine label, so the harvest source rows were checked before that failure.

`blog-post-registry.test.ts` and `blog-components.test.tsx` did not need assertion edits. Their runs passed.

Cover caption is still absent. That was not authorized.
