# F bilingual PublicBlogHandoff technical freeze

Technical freeze for local assembly. This is not user approval, not a page review, and not a production deploy.

## Outputs

| File | Role |
|---|---|
| `docs/blog-ops/house-upgrade-stardew/handoff/public/en.json` | English PublicBlogHandoff |
| `docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json` | Chinese PublicBlogHandoff |
| `docs/blog-ops/house-upgrade-stardew/handoff/freeze-report.md` | This editorial record |
| `docs/blog-ops/house-upgrade-stardew/handoff/freeze-checks.log` | Captured command stdout and exit codes |

English `bodyHash`: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`

English `publicFieldsSha256`: `c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042`

Chinese `bodyHash`: `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6`

Chinese `publicFieldsSha256`: `d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94`

Chinese `integrity.englishBodyHash`: `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`

The file SHA-256 of the two JSON files and this report is the last `shasum` block in `freeze-checks.log`. This report does not include its own hash.

## What was frozen

English body is the locked UTF-8 text of `lock/en/body.md`. It matches `content/en/draft-v4.md` and the pending handoff body. Normalization checked on the bytes: NFC, LF, no CR.

Chinese body is the UTF-8 text of `content/zh/draft-zh-v2.md`. Same normalization check. `country` is `US` on both handoffs. `zh-CN` is the translation of that United States article. No China search was added.

Selected English SEO is copied from `seo/en/seo-candidate.json`: Title, H1, and OG title are the same 67-character string. Description is the same 296-character string and is also `ogDescription`, because the existing metadata helper copies one description to the meta description, Open Graph, and Twitter. Slug is `house-upgrade-stardew`. Title remains the single `post.title` value.

Selected Chinese SEO is copied from `content/zh/seo.zh.json`. Title, H1, and OG title are the same string. Description is copied to `ogDescription` the same way. `seo.zh.json` still has author `Stardew Valley Planner Team`. The public Chinese author is the existing registry value `星露谷规划器团队`, and the topic is `星露谷物语指南`. English author and topic are `Stardew Valley Planner Team` and `Stardew Valley Guides`. Both `featured` values are false. `readTimeMinutes` is 6, the instructed approximate read time for the existing integer field. `publishedAt` is null. No FAQ and no article-specific CTA were added.

English internal link label: `Robin's shop and outdoor buildings`

Chinese internal link label: `罗宾的商店和室外建筑`

Both use `https://stardewvalleyplanner.art/carpenter-stardew`.

Target routes, not yet present in the slug registry: `/house-upgrade-stardew` and `/zh/house-upgrade-stardew`. The 12 public WebP/AVIF paths are not in `public/` yet. G copies the production bytes; this freeze does not.

## Length

Official counter on the locked English body: mechanical 1138, class short, exit 0.

Official counter on `lock/en/count-input.md`: mechanical 1085, class short, exit 0. That file is the locked body with the two body caption lines removed and no other text added. `diff -u` of the two files exited 1. Qualified length 1085 is inside 1000–1999. The length report's short-article reason is present: 主意图材料已写完. Chinese counts are not added to this number.

Official counter on `draft-zh-v2.md`: mechanical Han 1737, class `reference_only`, exit 0. Full-file Han, including headings and image alt text, is 1905. The two body captions are 42 and 48 Han, together 90. Pure body Han is 1737 − 90 = 1647. These Chinese numbers are reference only.

## Gates that this freeze consumes

| Gate | Result | Hash binding |
|---|---|---|
| D enriched v4 | PASS, 0 issues | report `ae5c87028bcfbd6f5c751aa2024f7d2a5f6514fa11a1c7cb64f447f756f9058d` on body `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| E enriched v4 | PASS, 0 issues | report `9db00d9995472ebe2d316b712e04cf97571e814a98cef793c8b43b11669b7b85` on the same body |
| F length and lock | 1085 short, body locked | lock record `b5bb88478dd133b02d8e68733e24fefb2a179b3ed200042d1e7e94cb2bf5edb3` |
| E title v4 | PASS, 0 issues on the selected Title, H1, description, slug, and OG | report `75596b5d6bbf527aafe3e8abee75f9e715f55d9cde4e75cc2c6e2f909a866028` |
| E translation v2 | PASS, 0 issues | report `ab443f03e8bbcc923a274d6897cb5bee060973d2108537301b48ae52956caed0` |
| E translation v1 | FAIL, 5 issues, retained | report `779800ee6c3289d0af1d6c51664147e0f185cbf87bd7e009699112ea2b9ce2b4` on archived body `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` |
| E title-process addendum | FAIL, 3 issues, plus 1 historical process deviation | report `99a3d711e02bd0f42ce9930614ed630ef3b51c035fb2360de0132da2eaa27e64` |

The title-process FAIL is not a selected-surface failure. It covers unused, never-public candidate descriptions 7, 9, and 10, plus the historical fact that all 10 descriptions were not generated at the time. Selected title, description, and body bytes are unchanged. The original SEOTruth PASS with 0 issues stays on that selected surface only. This freeze does not call the title-creation process a full pass.

`seo/en/seo-candidate.json` still has `frozen: false` and `status: pending-E`. This role did not edit it. The frozen copy is the new public JSON.

`content/zh/translation-submission.json` still says `pending-independent-E`. That is T's status at submission. The later E translation-v2 report is the independent PASS. T's file was not edited.

## References

English public references are the 12-item projection already stored on the pending handoff, not the editorial `content/en/public-references.en.json` container. That container still has `factIds`, `reviewerNote`, and a body path, and it was not copied.

Chinese public references keep `id`, `label`, `url`, `appliesTo`, and the one version note from `content/zh/public-references.zh.json`. `bodyPath`, `bodyVersion`, hash fields, and the occurrence rule note stayed out.

Both languages: 12 references, 55 quotes. Every quote's actual count equals its `occurrence` field. 53 quotes sit in a paragraph that contains that reference URL. The other 2 quotes in each language are the upgrade-2 and upgrade-3 cumulative sums. Their URL is in the immediately previous paragraph, the Farmhouse sentence that introduces those sums. English previous-paragraph quotes:

- wiki-farmhouse: 10,000g + 65,000g = 75,000g, with 450 Wood and 100 Hardwood
- wiki-farmhouse: 10,000g + 65,000g + 100,000g = 175,000g, with 450 Wood and 100 Hardwood

Chinese previous-paragraph quotes:

- wiki-farmhouse: 10,000金 + 65,000金 = 75,000金，另有450木材和100硬木
- wiki-farmhouse: 10,000金 + 65,000金 + 100,000金 = 175,000金，另有450木材和100硬木

HTTPS URLs: 50 occurrences, 12 unique, same multiset in both bodies. Heading marks match: six H2 and two H3, no H1.

The archived v1 body still contains `修建餐厅` and `之后的等级到铁匠铺升级`. The v2 body has `后续斧头等级在铁匠铺升级` and `就选移除婴儿床或餐厅`, and it does not contain `修建餐厅`. The version note is only `1.6把第二次升级从50,000金和150硬木改为65,000金和100硬木。` `site-carpenter` has no version note.

## Media

All 12 WebP/AVIF files exist under `media-production`, are 1672×941, and match the hashes below. Six SVG files have the same canvas size, and their `<text>` nodes equal the reviewed `inImageText` in order. No public copy exists yet.

| Target URL | Production file | SHA-256 | Bytes | Size |
|---|---|---|---|---|
| `/blog/house-upgrade-stardew-cover.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.webp` | `c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342` | 72418 | 1672×941 |
| `/blog/house-upgrade-stardew-cover.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.avif` | `f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113` | 39621 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.webp` | `c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209` | 70092 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.avif` | `8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b` | 38764 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.webp` | `040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b` | 68194 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.avif` | `1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426` | 36133 | 1672×941 |
| `/blog/house-upgrade-stardew-cover-zh.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp` | `bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87` | 63012 | 1672×941 |
| `/blog/house-upgrade-stardew-cover-zh.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.avif` | `7e00232440ac66f410e791a9f472f3fdb2b74242cc1a7d0a35e43e8e8d438926` | 34529 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp` | `d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c` | 58666 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.avif` | `aabe93337712ce9de18a94faad5b3582cfeba8d62a7cd59b3a6962218e2c0aad` | 31242 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp` | `6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88` | 60854 | 1672×941 |
| `/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif` | `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.avif` | `d8cde3529f897d5d5fe2b4b734e7182eb2eb000c19d3dc07dccd1ba5159f2b84` | 32235 | 1672×941 |

English provenance still names body `cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628` and does not name the locked body. `lock/en/media-rebind.json` already rebinds those unchanged raster hashes to `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f`. Provenance was not edited.

Chinese provenance still names body `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` and does not name `draft-zh-v2.md`. The six Chinese raster hashes still match that provenance. This report rebinds those unchanged bytes to `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6`. The images were not regenerated, and the provenance file was not edited.

E translation-v2 records a carried visual check: decoded views were readable, and the 6-pixel ring outside three `overflow: true` rectangles had 0 bright pixels. This freeze did not re-render or reopen those views. `reject_overflow` compares width and height only, not position. A strict bounding-box pass is not claimed.

No separate image credit was in the reviewed alt, caption, or `inImageText`. None was added. Fact sources stay in `publicReferences`.

## Integrity

`publicFieldsSha256` hashes the UTF-8 of `json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(',', ':'))`. `payload` is every top-level field except `integrity`. Keys are sorted at every depth. Arrays keep their order. The digest is not circular. It is not `bodyHash`.

Chinese `englishBodyHash` is both a top-level hashed field and a copy inside `integrity`. Both equal the locked English body hash. The integrity copy is the required cross-language record. The file SHA-256 in the log covers the integrity object, which the public-fields digest excludes.

## Evidence that stays imperfect

`reviews/E/translation-v2/checks.log` records the removed `bodyVersion` line as `draft-zh-v2`. The archived file `content/zh/versions/translation-v1/public-references.zh.json` has `bodyVersion` `draft-zh-v1`. The real `diff -u` stdout is in `freeze-checks.log` and exited 1. The E log was not edited. The other four diffs also exited 1 and are in that log.

E translation-v1 says one search return did not contain `canary-identity.json` or secret plaintext, and that this does not prove the searcher never indexed the file. A filename listing of this article directory included `control/` names: `v4-proof-checkpoint.md`, `v4-proof-checks.log`, `resume-2026-10-16.md`, `enriched-v3-checkpoint.md`, `operation-store.json`, and `enriched-v3-checks.log`. Those files were not opened. The listing does not prove filesystem isolation, and it does not prove a canary was unread or unindexed.

## Budget

`lock/en/lock-record.json` still says used 3, remaining 0. It was not rewritten. The user reply 继续 authorized one extra round. The coordinator recorded that confirmation at 2026-10-16 14:19:46 UTC; that is the coordinator clock, not a claimed user-send timestamp. Used is 4: the original 3 plus this one exception. Future rounds remaining: 0. The original three rounds stay. The budget was not reset.

## Not done

User final review is pending. Commit, push, and deploy were not authorized and were not done. The page is not assembled. No browser check, build, typecheck, or dev server was run. G may later mount this handoff in the existing template and may not rewrite the body, title, captions, alt text, in-image text, or links.

## Commands

Full stdout is in `freeze-checks.log`. Exit codes:

| Command | Exit |
|---|---|
| `shasum -a 256 docs/blog-ops/house-upgrade-stardew/lock/en/body.md docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md docs/blog-ops/house-upgrade-stardew/lock/en/length-report.md docs/blog-ops/house-upgrade-stardew/lock/en/lock-record.json docs/blog-ops/house-upgrade-stardew/handoff/pending-en/public-blog-handoff.en.json docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json docs/blog-ops/house-upgrade-stardew/seo/en/seo-candidate.json docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v4/report.md docs/blog-ops/house-upgrade-stardew/reviews/E/enriched-v4/report.md docs/blog-ops/house-upgrade-stardew/reviews/E/title-v4/report.md docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v1.md docs/blog-ops/house-upgrade-stardew/content/zh/public-references.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/seo.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/media-text.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/translation-submission.json docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/draft-zh-v1.md docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/public-references.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/seo.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/media-text.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/translation-submission.json docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v2/report.md docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v2/checks.log docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.webp docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.avif docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.webp docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.avif docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.webp docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.avif docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.avif docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.avif docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.avif docs/blog-ops/house-upgrade-stardew/media-production/zh/cover-payments.svg docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.svg docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.svg docs/blog-ops/house-upgrade-stardew/media-production/en/cover-payments.svg docs/blog-ops/house-upgrade-stardew/lock/en/media-rebind.json docs/blog-ops/house-upgrade-stardew/seo/en/title-candidates.md docs/blog-ops/house-upgrade-stardew/seo/en/creation-completion.md docs/blog-ops/house-upgrade-stardew/reviews/E/title-process-addendum.md docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v1/report.md docs/blog-ops/house-upgrade-stardew/content/zh/translation-round4.md docs/blog-ops/house-upgrade-stardew/media-production/en/provenance.json docs/blog-ops/house-upgrade-stardew/media-production/zh/provenance.json docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.svg docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.svg` | 0 |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/lock/en/body.md` | 0 |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale en docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md` | 0 |
| `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py --locale zh-CN docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md` | 0 |
| `diff -u docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v1.md docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md` | 1 |
| `diff -u docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/public-references.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/public-references.zh.json` | 1 |
| `diff -u docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/seo.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/seo.zh.json` | 1 |
| `diff -u docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/media-text.zh.json docs/blog-ops/house-upgrade-stardew/content/zh/media-text.zh.json` | 1 |
| `diff -u docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/translation-submission.json docs/blog-ops/house-upgrade-stardew/content/zh/translation-submission.json` | 1 |
| `diff -u docs/blog-ops/house-upgrade-stardew/lock/en/body.md docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md` | 1 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.avif` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.avif` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.avif` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.avif` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.avif` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp` | 0 |
| `sips -g pixelWidth -g pixelHeight docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.avif` | 0 |

## Input hashes

| File | SHA-256 |
|---|---|
| `docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json` | `75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400` |
| `docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json` | `1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v1.md` | `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md` | `0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/media-text.zh.json` | `43c6138438d5a29bb13ab0daf0ccd9b5c6498284191a79680c53e84ade7298aa` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/public-references.zh.json` | `b2e0781d81b60a10ba6586ca8c0ea7032ce9e2f24df05fb80587dba8733f9127` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/seo.zh.json` | `f744f783cf4b04d1cf0d66a2029cafaedaaf5eb04754e7b1e13612e48c29be16` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/translation-round4.md` | `8c65d7e0127f229503fddd382cac4623ad1e6c149f4f6acefc6c15ab18b886d6` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/translation-submission.json` | `4d8b4fa7f9c0835f7c8e33f151830767ea9491d164af7f20e7e90a9e62fa4671` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/draft-zh-v1.md` | `9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/media-text.zh.json` | `0410d2b318c1295f2696ec4af61e29715d5aa69df033991ef5bf9922d77738d3` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/public-references.zh.json` | `8dc7366349f48ed2258c070638cb9edce04a4d886a052e6c2b8aea12fd8566f9` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/seo.zh.json` | `1a5c3bf69155c66cf6a2e5d3ce1f0a44d2b18d69a67cdb9dcbf665eacc0748ec` |
| `docs/blog-ops/house-upgrade-stardew/content/zh/versions/translation-v1/translation-submission.json` | `37d7815f9dd1eadb3a3b60bde56465bfd85a6b2f60552936e6c1df2ecf3e8b1f` |
| `docs/blog-ops/house-upgrade-stardew/handoff/pending-en/public-blog-handoff.en.json` | `ae2b45c95090433c3538f8f6eec617dc1b03739ea3782c643ce3c3ab05afaf36` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/body.md` | `f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md` | `a52082ab04695f70191969d71c7dd264c83d424acd3bf371149b14292b58b1b6` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/length-report.md` | `e2b0a69287bddd541fcf6370a4ea0757015a815d5fc67f6e96a38ea1ede18793` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/lock-record.json` | `b5bb88478dd133b02d8e68733e24fefb2a179b3ed200042d1e7e94cb2bf5edb3` |
| `docs/blog-ops/house-upgrade-stardew/lock/en/media-rebind.json` | `0e55eef155b24438037302bba3442a80ff8d2e73cb78984c7ed1d35bf1f6af2e` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/cover-payments.svg` | `4f0103d7aaed81a3a617b945dced399cfee526eec04f59faf643fadc18713785` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.avif` | `f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.webp` | `c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/provenance.json` | `4849463e179846c47da8136c4356fdb8327975841f965ce90ba801a753b8a9f5` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.avif` | `8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.webp` | `c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.svg` | `0f68fefc86cf2f959bab09411c6000069d0ed78172aa2f1263bf82ef46d07af2` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.avif` | `1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.webp` | `040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b` |
| `docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.svg` | `71c935969c7952967207ed70006b65da614909d92689f0ba260f36e7e7c335ad` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/cover-payments.svg` | `13e6506201f7ecb1535e2f40077d71b7b6ac0ee35f4485810cba1db515dab735` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.avif` | `7e00232440ac66f410e791a9f472f3fdb2b74242cc1a7d0a35e43e8e8d438926` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp` | `bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/provenance.json` | `c1f199441528a0adb046ad289258db45f36990dbce450fec8e220d539ed95710` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.svg` | `99337ac2b5dcacb7792968289ea17f16e87cbbd69bf07c436665922196aed5c0` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.avif` | `aabe93337712ce9de18a94faad5b3582cfeba8d62a7cd59b3a6962218e2c0aad` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp` | `d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.svg` | `1fd0e8e620c28067f0fdfc2d05b6bd80ff243ec82b4d5d8226f3e6e460d5c5c9` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.avif` | `d8cde3529f897d5d5fe2b4b734e7182eb2eb000c19d3dc07dccd1ba5159f2b84` |
| `docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp` | `6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88` |
| `docs/blog-ops/house-upgrade-stardew/reviews/D/enriched-v4/report.md` | `ae5c87028bcfbd6f5c751aa2024f7d2a5f6514fa11a1c7cb64f447f756f9058d` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/enriched-v4/report.md` | `9db00d9995472ebe2d316b712e04cf97571e814a98cef793c8b43b11669b7b85` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/title-process-addendum.md` | `99a3d711e02bd0f42ce9930614ed630ef3b51c035fb2360de0132da2eaa27e64` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/title-v4/report.md` | `75596b5d6bbf527aafe3e8abee75f9e715f55d9cde4e75cc2c6e2f909a866028` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v1/report.md` | `779800ee6c3289d0af1d6c51664147e0f185cbf87bd7e009699112ea2b9ce2b4` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v2/checks.log` | `e8758484ef4f7ce2429a6a51188b4232fea3ff64212c71ad6650742691eee254` |
| `docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v2/report.md` | `ab443f03e8bbcc923a274d6897cb5bee060973d2108537301b48ae52956caed0` |
| `docs/blog-ops/house-upgrade-stardew/seo/en/creation-completion.md` | `a7ac2e6b71c91c95e3efaa3150d2394ba6e43cbd01515281b10d055260174c66` |
| `docs/blog-ops/house-upgrade-stardew/seo/en/seo-candidate.json` | `b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58` |
| `docs/blog-ops/house-upgrade-stardew/seo/en/title-candidates.md` | `f2ab571ed4fd873e4d166158e5f11eaa2641a1f2ae0e1eb2d760f9bf998fde94` |
