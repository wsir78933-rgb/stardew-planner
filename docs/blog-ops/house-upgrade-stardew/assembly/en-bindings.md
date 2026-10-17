# English article binding: house-upgrade-stardew

This file records the English public-export assembly only. It is not a page PASS, a typecheck, a build, or a browser review. Technical freeze is not user final review.

## Inputs

Coordinator handoff `msg_3f4eda361fd1` named these digests. Recomputed from `docs/blog-ops/house-upgrade-stardew/handoff/public/en.json` on this pass:

| Digest | SHA-256 |
|---|---|
| en.json file | `cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3` |
| body UTF-8 (`bodyHash`) | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| public fields (`integrity.publicFieldsSha256`) | `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042` |

`shasum -a 256` on en.json exited 0 and matched the file digest. The body digest matches the JSON `bodyHash`. The public-fields digest was recomputed as SHA-256 of UTF-8 `json.dumps` of every top-level field except `integrity`, with `ensure_ascii=False`, `sort_keys=True`, and `separators=(",", ":")`. It matches `integrity.publicFieldsSha256`.

Freeze files, hashed and not edited: `handoff/freeze-report.md` `dd9daf7299b339c7527f6870a3a74162344e409e37dac8710ca65bd524b1ee32`; `handoff/freeze-checks.log` `2e3fadbb8b8d32310b075a81afe086da5ebccfa6b87e4e28a68c5ebc69f37a4e`.

## Output

| File | SHA-256 | Bytes |
|---|---|---:|
| `src/blog/articles/house-upgrade-stardew.en.tsx` | `cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5` | 15846 |

`shasum -a 256` on that file exited 0. The only public export is `HouseUpgradeStardewEnglishArticle`. The component does not read ops JSON and does not contain an ops path.

`git status --short` shows the module as untracked. `git diff --stat` on that path printed nothing because the file is not tracked. No commit.

`docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json` already exists and was not edited. Its `articles.en.outputSha256` is null and its note assigns that hash to this binding report. The hash is the row above.

## Rendered body order

The module follows the frozen body. Image markdown becomes `figure.blog-article-media` plus the following caption paragraph as `figcaption`. There is no `h1`. Body headings are 6 `h2` and 2 `h3`. `BlogSources` adds its own Sources heading and one planner CTA; those are not body headings and this module does not add a second CTA or a FAQ.

1. Opening paragraph, ending at “Place the order with Robin at the Carpenter's Shop.”
2. H2 “What each upgrade costs”.
3. One table, headers Upgrade / Gold / Materials / Days, three rows. Row 3 materials cell is empty. Row 1 days cite Farmhouse. Rows 2 and 3 days cite Carpenter's Shop.
4. Paragraph on the 1.6 move from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood.
5. H2 “Prepare the Wood and the Hardwood”, then four paragraphs.
6. H2 “Price the wood you still need, then add through a tier”.
7. H3 “200 Wood already on hand”, then three paragraphs. The bill paragraph keeps U+2212 in “450 − 200 = 250” and U+00D7 in the multiplication signs.
8. H3 “From the starter house through a named tier”, then two paragraphs.
9. H2 “What the kitchen, nursery, and cellar are for”, then the kitchen paragraph, then the nursery paragraph ending “On the room figure, the Nursery label is this crib room.”
10. Body figure `tier-rooms`, then the cellar paragraph, then the 9×5 paragraph.
11. H2 “Order the upgrade at 24 Mountain Road”, then three paragraphs.
12. H2 “A renovation is not the next upgrade”.
13. Body figure `upgrade-or-renovation` at the start of that section, then the renovation paragraph, the Remove Crib / Add Dining Room paragraph, and the closing choice paragraph.

An independent read of the written module expanded the section functions and compared 47 text nodes (paragraphs, headings, table cells, captions) with the body after markdown links were reduced to their visible labels. Exit 0. The same check compared 50 ordered citation pairs. Exit 0.

## Citations

Every body markdown link, excluding the two image marks, is an `<a>` with the same visible label and the same href. The one on-site href stays `https://stardewvalleyplanner.art/carpenter-stardew` and uses the existing `blog-planner-link` class. That class does not change the rendered words or the href. Wiki hrefs keep `%27` in Carpenter's Shop.

Body anchor counts, 50 total, all 12 public reference URLs:

| Count | Label | Href |
|---:|---|---|
| 14 | Farmhouse | `https://stardewvalleywiki.com/Farmhouse` |
| 16 | Carpenter's Shop | `https://stardewvalleywiki.com/Carpenter%27s_Shop` |
| 2 | Version History | `https://stardewvalleywiki.com/Version_History` |
| 3 | Axes | `https://stardewvalleywiki.com/Axes` |
| 2 | Wood | `https://stardewvalleywiki.com/Wood` |
| 1 | Hardwood | `https://stardewvalleywiki.com/Hardwood` |
| 3 | Large Stump | `https://stardewvalleywiki.com/Large_Stump` |
| 3 | Large Log | `https://stardewvalleywiki.com/Large_Log` |
| 3 | Secret Woods | `https://stardewvalleywiki.com/Secret_Woods` |
| 1 | Cooking | `https://stardewvalleywiki.com/Cooking` |
| 1 | Cask | `https://stardewvalleywiki.com/Cask` |
| 1 | Robin's shop and outdoor buildings | `https://stardewvalleyplanner.art/carpenter-stardew` |

`BlogSources` `heading` is `Sources`. Items are the 12 `publicReferences` in handoff order, using `url` as `href` and `label` as `label`. `appliesTo` is not rendered. Version History `versionNote` is passed through the existing `note` field, unchanged: “1.6 change of the second upgrade from 50,000g and 150 Hardwood to 65,000g and 100 Hardwood.”

## Figures

Both body pictures use `PublicPicture` with `width={1672}`, `height={941}`, `loading="lazy"`, and `decoding="async"`. Captions are the frozen schematic sentences. No “已验证” or “本文不” text was added. In-image lines stay in the locked rasters; this module does not redraw them.

| Role | Public WebP | Alt and caption | WebP SHA-256 | AVIF SHA-256 |
|---|---|---|---|---|
| cover, not rendered here | `/blog/house-upgrade-stardew-cover.webp` | Alt: “Three payment stages: Upgrade 1 with 10,000g, 450 Wood, and 3 days; Upgrade 2 with 65,000g, 100 Hardwood, and 3 days; Upgrade 3 with 100,000g and 3 days.” Caption is not mounted; the header shell has no caption prop. | `c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342` | `f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113` |
| body, after the nursery sentence | `/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` | Alt: “Three labeled stages: Upgrade 1 with Kitchen and Bedroom, Upgrade 2 with Empty room and Nursery, Upgrade 3 with Cellar and Same exterior, and a shared line reading 9×5 outdoors.” Caption: “Schematic. Upgrade 1 is labeled Kitchen and Bedroom. Upgrade 2 is labeled Empty room and Nursery. Upgrade 3 is labeled Cellar and Same exterior. A shared line reads 9×5 outdoors.” | `c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209` | `8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b` |
| body, start of the renovation H2 | `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` | Alt: “Two paths and two examples: Upgrade with 3 days; Renovation with After upgrade 2, Instant, and Refunds gold; Remove crib with Free; Dining room with 150,000g.” Caption: “Schematic. The upgrade path reads Upgrade and 3 days. The renovation path reads Renovation, After upgrade 2, Instant, and Refunds gold. Remove crib reads Free. Dining room reads 150,000g.” | `040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b` | `1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426` |

Source rasters under `media-production/en/` were hashed and matched the public handoff byte sizes and SHA-256 values. `sips -g pixelWidth -g pixelHeight` on the three English WebP files exited 0. Each is 1672×941. This task did not copy files into `public/`.

The existing registry record for `house-upgrade-stardew` already uses the frozen English title, description, author, topic, `featured: false`, `readTimeMinutes: 6`, cover src, and cover alt, and its `Content` is `HouseUpgradeStardewEnglishArticle`. This task did not edit the registry.

## Commands

| Command | Exit |
|---|---:|
| `shasum -a 256` on en.json, freeze-report.md, freeze-checks.log | 0 |
| Public-field and body digest recompute, then JSX write and ordered text/link compare | 0 |
| Media SHA-256 compare against public figure hashes, plus U+2212 / U+00D7 presence check | 0 |
| `sips` pixel size on the three English WebP files | 0 |
| `pnpm typecheck`, `pnpm build`, tests, and a dev or preview server | not run |

Next.js in this worktree is 16.3.0. The public-folder and static-export guides were read from `node_modules/next/dist/docs`. The article is a server function, uses `PublicPicture` rather than `next/image`, and does not call `generateStaticParams`.
