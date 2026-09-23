# D-en final check — REVISE

- Checked draft: `docs/blog-ops/profit-margin-stardew/C-en-draft.md`
- Raw SHA-256: `703afe97d39e8735e09af1773f18f75dfbdd79539ee1ab1ff029acf9952f8e03`
- Date: 2026-09-22
- Decision: **REVISE before E-en independent review.** One layout-handoff requirement remains unmet: the internal link. This is a draft check only, not page or asset acceptance.

## Blocking finding

**L1 — Required internal link absent.** `B-en-layout.md:298-301` says to use `/how-to-earn-money-stardew` once near the early-budget explanation. The current C has seven Markdown text links, all to the external Options/Multiplayer pages, and no relative internal link. Reproduce with `rg -n 'how-to-earn-money-stardew|\]\(/' docs/blog-ops/profit-margin-stardew/C-en-draft.md` (exit 1, no matches). B:214 calls this link optional, while B:300 says “Use ... once,” and the earlier `E-en-review.md:46` interpreted it as optional. This is a handoff conflict rather than an invented content defect; under the explicit B:300 instruction, obtain an editorial decision or add the single link in the appropriate later revision. No draft change was made here.

## Passed draft checks

- **Length:** Direct V7 count excluding Sources = **2,138** English units (exit 0; floor 2,000). Removing the two standalone italic captions with the same V7 `extract_body`/`count_units` logic gives **2,063**, inside **2,000–2,300**. Exactly two caption lines were removed; headings, image alt text/targets, table delimiters, and Sources follow V7 exclusions. The count is mechanical, not a semantic quality certificate.
- **Structure and previous R1/R2 issues:** one H1 at C:1; no second H1. The former length/qualified-body shortfall is resolved by 2,063 qualified units, and the exact checked label missing in the earlier recheck is present at C:127: `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.` The C:26 classification procedure, C:59–60 matrix application, C:70–80 choice matrix, and C:99–123 setup/checklist have different jobs; I found no significant repeated step-by-step flow. Short reminders of the fixed-versus-scaling boundary remain but do not reproduce the full procedure.
- **Public references:** Options appears at the opening, rounding discussion, setup lead, and Sources; Multiplayer appears at the Wheat example, affected/unchanged category lead, and Sources. `curl -sSIL --max-time 20` returned HTTP **200** for each exact URL, exit 0 for each. HTTP reachability alone does not independently re-audit every game-mechanics claim.
- **Figure slots:** exactly `fig-01-price-boundary` at C:62 and `fig-02-advanced-options-path` at C:111. The first distinguishes scaled versus fixed prices; the second maps new-game Advanced Options. Both have descriptive alt text and distinct standalone captions. This proves only semantic slots in Markdown.
- **Public-copy boundary:** case-insensitive `rg` for `orca|dispatch|worker|task_|term_|/Users/|workflow|调度|私有|localhost|127\.0\.0\.1|docs/blog-ops|E-en|D-en|research|draft` returned exit 1 (no matches). No local/private path, workflow, or dispatch marker was found in C.

## Evidence ledger

All commands used the repository root as cwd. Exit 1 from `rg` means no matches, not a tool failure.

| Check | Command | Exit / key output |
|---|---|---|
| Hash | `shasum -a 256 docs/blog-ops/profit-margin-stardew/C-en-draft.md` | 0; SHA above |
| V7 direct | `python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-en-draft.md --locale en --exclude-heading Sources` | 0; `mechanical_units=2138`, `meets_mechanical_floor=true`, raw SHA matches |
| Qualified count | In-memory Python imported that V7 script, removed the two lines beginning `*This diagram` and `*This platform-neutral`, then called `extract_body(..., ('Sources',))` and `count_units(..., 'en')` | 0; `caption_count=2`, `independent_units=2063`, omitted: 14 headings, 5 Sources lines, 54 non-body lines |
| H1/links/figures | In-memory Python regex enumeration of C | 0; H1 only line 1; seven Markdown text links, all external; figure IDs exactly the two above |
| Labels, figure IDs, source paths | `rg -n 'Checked|fig-0[12]|Options|Multiplayer|\]\(/|orca|dispatch|worker|task_|term_|/Users/|workflow|调度|私有' docs/blog-ops/profit-margin-stardew/C-en-draft.md` | 0; checked label C:127, IDs C:62/111, Options and Multiplayer links present; no internal-link match |
| Required internal route | `rg -n 'how-to-earn-money-stardew|\]\(/' docs/blog-ops/profit-margin-stardew/C-en-draft.md` | 1; no matches |
| Leakage search | `rg -ni 'orca|dispatch|worker|task_|term_|/Users/|workflow|调度|私有|localhost|127\.0\.0\.1|docs/blog-ops|E-en|D-en|research|draft' docs/blog-ops/profit-margin-stardew/C-en-draft.md` | 1; no matches |
| Public URLs | `curl -sSIL --max-time 20 -o /dev/null -w 'Options HTTP %{http_code} final %{url_effective}\n' https://stardewvalleywiki.com/Options` and analogous Multiplayer URL | 0 each; HTTP 200, final URLs unchanged |
| Whitespace | `git diff --check` | 0; no output; untracked files are not covered by this check |
| Working tree | `git status --short` | 0; `?? docs/blog-ops/profit-margin-stardew/` (untracked directory; no tracked edits shown) |

**Not verified:** image files, dimensions, format, licensing, page integration/rendering, responsive layout, accessibility in a browser, and browser behavior. No UI/browser test, commit, push, or deployment was performed. The prior `E-en-review.md` exists in the working tree, but this verdict does not adopt it as a current independent review of this SHA.
