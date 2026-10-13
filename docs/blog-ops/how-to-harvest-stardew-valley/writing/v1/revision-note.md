# Revision note: how to harvest stardew valley

- Role: C, English candidate only
- Candidate version: v1
- Quality gate: not signed. This note is not a ResearchTrace, ReaderValue, Repetition, E, or F pass.
- Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客-2` (branch `博客-2`). Directory separation only. No OS privilege-isolation test was run.
- Shared revision budget, as stated by the coordinator: 2 rounds already used, 1 round left. This file is the first C candidate, not a new layout pass.

## Inputs

- `layout/writer-brief.md` Round 2, SHA256 `57c65db0c8e89e407bba950658e5b37027051a3d83a93ee2c62a18eee60523da` (matches the coordinator reply).
- `layout/visual-plan.md` SHA256 `42e58d39ff97c7382b2bc4c0331c6463591e14ab93ec8c1f0152911301e89d93`.
- Facts used from `research/research.md` and `research/facts.json`. Operation-store, search logs, and old articles were not used as draft material.

## Length

Command:

```
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" "docs/blog-ops/how-to-harvest-stardew-valley/writing/en-body.md" --locale en
```

Result: `mechanical_units` 1648, `length_class` `short`, `meets_mechanical_floor` true, `meets_long_form_target` false, `semantic_qualification` `requires_independent_review`. Script SHA256 of the body matched the file hash below.

主意图材料已写完. The count is inside 1000–1999. The figcaption is inside that mechanical count. No FAQ, H1, source list, or recap was added to reach 2000.

## What the candidate contains

- PC parsnip pick: stand beside it and right-click, from the March 26, 2019 Steam reply. X and the hold come from the September 17, 2021 forum post: mouse away from the character, harvest and plant the tile you are standing on.
- Check/Do Action and Use tool names, including controller, Switch 2, and mobile command names, without calling those buttons a parsnip harvest.
- Scythe crops named on the opened pages: Kale, Amaranth, Wheat, Unmilled Rice, Fiber Seeds. Starter, Golden, and Iridium differences use the positive tool facts. Iridium harvests crops on tilled soil within the swing and was introduced in 1.6.
- Growth-day count, watering pause, Green Bean / Strawberry / Coffee regrowth, season change, Wheat on Summer 28, repaired Greenhouse, giant crops with any axe, and trellises.
- One original SVG after section 2. Delivery paths for G: `/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp` and the sibling `.avif`, 1672×941. Those raster files were not created.

## Fact limits kept out of the reader text

- No hand-harvest energy cost. The visual plan's "0 energy" hand-harvest line is not in A and is not on the figure.
- No walk-through-rows harvest. A records the hold on the tile you stand on. The H3 does not say "Hold-and-Walk".
- The hand card names Parsnip only. Cauliflower, Melon, and Pumpkin are not labeled as right-click crops.
- Iridium is "tilled soil", not "any crop" outside that swing. Golden is described by radius, grass, 75% hay from grass, and damage. There is no sentence that its benefits "do not say" something.
- No claim that a scythe destroys a living parsnip, that left-click cannot harvest, that empty hands are required, or that a full backpack blocks a harvest.
- No empty-soil result for a single harvest, no giant-crop season labels, no green-plus cursor, no Junimo hut section, no mastery point-cost table, and no silo guide.
- Figure structure stays two action cards plus a bottom exception band. Type was enlarged so every visible string is 48–64px. At a 390px image width that is about 11.2–14.9px. Core Text bold system-font widths for all 22 strings fit their boxes. This is not a phone-browser pass.

## Output hashes (SHA256)

- `writing/en-body.md` `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`
- `writing/en-figure.svg` `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3`
- `writing/en-media.json` `1d4cd52f3d7cc7b180e60183c8f18ca61bd58b1889243c02e44a1422c38451c3`

## Verification

- XML parse of `en-figure.svg`: passed (`xml.etree.ElementTree.parse`).
- Visible SVG text nodes: 22, matched `en-media.json` `visibleText`. Alt and caption in the body match `en-media.json`.
- UTF-8, NFC, LF, final newline: passed on the three content files. No CR.
- `git diff --check` on the worktree path: exit 0. The new files are untracked, so that command did not scan their bytes.
- `git diff --check --no-index -- /dev/null <file>` for each of the three content files: exit 1, no whitespace warning printed. Exit 2 would mean a whitespace error. Exit 1 here is the expected difference from `/dev/null`.
- Product `typecheck`, `test`, `build`, and dev server: not run.

## Left for later roles

D and E have not reviewed this candidate. G still has to rasterize the SVG. WebP and AVIF files are absent. No quality pass is claimed.
