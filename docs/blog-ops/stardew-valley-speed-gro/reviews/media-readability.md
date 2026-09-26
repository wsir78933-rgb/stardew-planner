# Media readability review

## Scope and conclusion

- Role: independent media-readability review M for the content-only `stardew valley speed gro` materials.
- Review date: 2026-09-26 (Asia/Shanghai).
- Reviewed inputs: the current `body-en.md`, `body-zh.md`, `media-en.json`, `media-zh.json`, and all five SVGs under the article's `assets/en` and `assets/zh` directories.
- No body, media manifest, SVG, website source, `public`, or package file was changed.
- Result: desktop rendering and figure meaning are PASS; narrow direct-SVG rendering is FAIL for all five assets. The two English diagrams are present but scale to roughly 10px rendered text at 390px, while all three Chinese diagrams retain fixed 1200/1280px widths and are visibly clipped. The media-manifest path base is also inconsistent and remains UNVERIFIED until the assembler defines one base.

## Version binding and SHA-256

| Material | SHA-256 |
| --- | --- |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md` | `c28eb746478ba9285325e7bfa41b42e2380ac99cfe0a0c7a1be359f869d7f3f3` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md` | `4069e1cb2269fa475eb15a86c94ad7ae7ed24efd175277742063d0d12b8934fa` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | `f2e1868a70b9f632d609635742528006c7f372d716cf72529247bb4a26875b16` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | `aecd442b7f563c484e4c676f33a187061028e7481bb8fdd3d183b9a2b8ebf17d` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg` | `0ace2a61a8a3b236fca0c3d70b627fbaf34de0e55d11e5d6787c65a740b7fd4a` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg` | `d44d70434e9899ce4fb790abb035ec70cbc0b37321ad66b5711bb67042797f96` |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg` | `10510fbec31f6d6abdc8cf88dce0d772345d3a2b28f060067b0d8648d2c03ceb` |

## Body references and XML checks

`body-en.md` has two image references and `body-zh.md` has three. The body-reference checker resolved all five links to real files and exited `0`:

```text
en ../assets/en/speed-gro-melon-stage-days.svg -> exists=True
en ../assets/en/speed-gro-strawberry-regrowth-calendar.svg -> exists=True
zh ../assets/zh/speed-gro-application-flow.svg -> exists=True
zh ../assets/zh/speed-gro-stage-comparison.svg -> exists=True
zh ../assets/zh/strawberry-harvest-timeline.svg -> exists=True
BODY_IMAGE_LINK_CHECK count=5 exit=0
```

The body/manifest asset-name set check also exited `0`; each locale has the same asset set in its body and manifest. `xmllint --noout` exited `0` for all five SVGs:

```text
speed-gro-melon-stage-days.svg xmllint_exit=0
speed-gro-strawberry-regrowth-calendar.svg xmllint_exit=0
speed-gro-application-flow.svg xmllint_exit=0
speed-gro-stage-comparison.svg xmllint_exit=0
strawberry-harvest-timeline.svg xmllint_exit=0
SVG_XML_VALIDATION_EXIT=0
```

An ElementTree check found zero `<image>` elements in every SVG and only vector/text elements (67, 105, 35, 33, and 40 respectively). This supports the declared analysis-diagram boundary; these are not game screenshots. The Chinese manifest explicitly records `is_screenshot: false` for all three entries at `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json:14`, `:32`, and `:52`; the English manifest uses diagram/timeline roles and the English body captions explicitly state that the figures are source-based calculations rather than screenshots or playtests.

### Manifest path-base warning

The body links above are PASS, but the `path` fields in the two media manifests do not share a declared base:

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-en.json:7` and `:21` resolve from the manifest directory (`drafts/`) and therefore exist.
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/media-zh.json:7`, `:25`, and `:45` resolve from the article root, but do not exist when resolved from the manifest directory.

The diagnostic command showed `en: from_manifest_exists=True, from_article_root_exists=False` and `zh: from_manifest_exists=False, from_article_root_exists=True`. Because no `pathBase` contract is present in these manifests or the reviewed layout, this is `UNVERIFIED` for the future assembler; it must not be silently treated as a universal PASS. Normalize one base in the assembly step; M did not edit the manifest.

## Visual evidence

The local `ego-browser` task space opened each SVG directly with `file://`, reused one page, captured a desktop viewport and a 390px narrow viewport, and exited `0`. Desktop viewport was 1440×1000 for four assets; the first melon capture was 1512×763. Narrow viewport was 390×844 for all five. Screenshots are real browser renders, not XML snapshots.

| Asset | Desktop | Narrow 390px | Visual finding |
| --- | --- | --- | --- |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-melon-stage-days.svg` | PASS — [en-melon-desktop.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-melon-desktop.png) | FAIL — [en-melon-narrow.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-melon-narrow.png) | Desktop labels, stage cells, dates, and note are readable with no visible overlap or truncation. At 390px the whole diagram fits without clipping, but rendered text is about 10px high and is not comfortably readable. |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/en/speed-gro-strawberry-regrowth-calendar.svg` | PASS — [en-strawberry-desktop.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-strawberry-desktop.png) | FAIL — [en-strawberry-narrow.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-strawberry-narrow.png) | Desktop first-harvest markers, fixed four-day segments, day-29 warning, and legend are readable with no visible overlap or truncation. At 390px all content remains inside the viewport but the scaled text is about 10px high and the dates/legend are too small for reliable reading. |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-application-flow.svg` | PASS — [zh-flow-desktop.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-flow-desktop.png) | FAIL — [zh-flow-narrow.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-flow-narrow.png) | Desktop Chinese labels and arrows are readable with no overlap/truncation. At 390px the intrinsic SVG width is 1200px; browser `scrollWidth=1200` versus `clientWidth=390`, and the right-side nodes/text are clipped. |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/speed-gro-stage-comparison.svg` | PASS — [zh-stage-desktop.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-stage-desktop.png) | FAIL — [zh-stage-narrow.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-stage-narrow.png) | Desktop vectors, dates, and bottom disclaimer are readable with no visible overlap/truncation. At 390px the intrinsic SVG width is 1280px and document `scrollWidth=1280`; the title, result column, and right side of each stage panel are clipped. |
| `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/assets/zh/strawberry-harvest-timeline.svg` | PASS — [zh-strawberry-desktop.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-strawberry-desktop.png) | FAIL — [zh-strawberry-narrow.png](/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-strawberry-narrow.png) | Desktop dates, first-harvest labels, four-day arrows, and effect-boundary callout are readable with no visible overlap/truncation. At 390px the intrinsic SVG width is 1280px and `scrollWidth=1280`; the right-side dates/callout and part of the title are clipped. |

The browser metrics behind the narrow verdict were:

```text
en-melon       svg rect 390px wide, scrollWidth=390, first text rendered height=10px
en-strawberry  svg rect 390px wide, scrollWidth=390, first text rendered height=10px
zh-flow        svg width=1200px, scrollWidth=1200, clientWidth=390
zh-stage       svg width=1280px, scrollWidth=1280, clientWidth=390, scrollHeight=900
zh-strawberry  svg width=1280px, scrollWidth=1280, clientWidth=390
```

## Figure meaning and adjacent-body checks

| Figure | Adjacent body evidence | Independent content check | Result |
| --- | --- | --- | --- |
| EN melon stage-days | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md:56-65` and `:93-107` | SVG shows `[1, 2, 3, 3, 3]`, effective first growth 12/10/9/8 days, and Summer 13/11/10/9 first harvests for none/Speed-Gro/Deluxe/Hyper. These match the body and are explicitly source-based, not a game screenshot. | PASS |
| EN strawberry regrowth calendar | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-en.md:109-127` | SVG shows Spring 13 planting, first harvests Spring 21/20/19/18, unchanged four-day intervals, and Spring 29 outside the season. These match the body table and caption. | PASS |
| ZH application flow | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md:19-39` | Flow shows tilled soil, pre-/post-planting and growing-stage application, first-growth/first-harvest effect, and no shortened post-harvest regrowth. It is a rule diagram, not a crop-date chart. | PASS |
| ZH stage comparison | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md:41-70` | Parsnip `[1, 1, 1, 1]` gives Spring 5/4/4/3; Melon `[1, 2, 3, 3, 3]` gives Summer 13/11/10/9. The vectors and first-harvest meanings match the body; the footer states rule calculation, not in-game testing. | PASS |
| ZH strawberry harvest timeline | `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/drafts/body-zh.md:72-89` | SVG shows Spring 13 planting, no-fertilizer first harvest Spring 21, Speed-Gro first harvest Spring 20, and subsequent four-day regrowth. This matches the body assumptions and caption. | PASS |

No figure was found to claim an in-game screenshot, playtest, or universal calendar guarantee. The narrow visual failures are media presentation failures, not a reason to rewrite the locked body or change the date/vector claims; return them to the media/assembly owner for responsive handling.

## Source URLs recorded by the current media manifests

- `https://stardewvalleywiki.com/Melon?oldid=193510`
- `https://stardewvalleywiki.com/Crop_Growth_Calendars?oldid=189875`
- `https://github.com/AcidicNic/StardewValleyDecompiled1.6/blob/2878fb248092f9f5b8704ad2cc7e19d0abe1cf45/StardewValley.TerrainFeatures/HoeDirt.cs#L584-L629`
- `https://stardewvalleywiki.com/Strawberry?oldid=192732`
- `https://stardewvalleywiki.com/Fertilizer?oldid=194274`
- `https://zh.stardewvalleywiki.com/%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0`
- `https://zh.stardewvalleywiki.com/%E8%82%A5%E6%96%99`
- `https://stardewvalleywiki.com/Speed-Gro?oldid=190630`
- `https://stardewvalleywiki.com/Parsnip?oldid=191123`
- `https://stardewvalleywiki.com/Deluxe_Speed-Gro?oldid=191196`
- `https://stardewvalleywiki.com/Hyper_Speed-Gro?oldid=190377`
- `https://zh.stardewvalleywiki.com/%E8%8D%89%E8%8E%93`

These URLs are the source inventory attached to the current media manifests; this M review checked the figure/body correspondence and local rendering, not the truth of the upstream source pages.

## Actual commands and exit codes

- `shasum -a 256` over both bodies and all five SVGs: exit `0`; hashes are recorded above.
- Python body-image resolver using full article paths: exit `0` (`BODY_IMAGE_LINK_CHECK count=5 exit=0`).
- Python body/manifest asset-name set check: exit `0` (`BODY_MANIFEST_ASSET_SET_CHECK count=2 exit=0`).
- `xmllint --noout` over all five SVGs: exit `0` (`SVG_XML_VALIDATION_EXIT=0`).
- Python XML text/image-element check: exit `0`; all five have `image_elements=0`.
- `ego-browser nodejs` with one reused TaskSpace, `file://` SVG navigation, `Emulation.setDeviceMetricsOverride` at 1440×1000 and 390×844, and ten screenshot saves: process exit `0`; screenshots are listed above.
- `find .../reviews/media-evidence -maxdepth 1 -type f` and `file .../*.png`: exit `0`; all ten evidence files are PNGs with the expected 390px narrow or desktop dimensions.

## Files added by this role

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-readability.md`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-melon-desktop.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-melon-narrow.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-strawberry-desktop.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/en-strawberry-narrow.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-flow-desktop.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-flow-narrow.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-stage-desktop.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-stage-narrow.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-strawberry-desktop.png`
- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/stardew-valley-speed-gro/reviews/media-evidence/zh-strawberry-narrow.png`
