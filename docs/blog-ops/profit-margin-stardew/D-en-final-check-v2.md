# D-en final check v2 — PASS

- **Checked draft:** `docs/blog-ops/profit-margin-stardew/C-en-draft.md`
- **C SHA-256:** `ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa`
- **Checked date:** 2026-09-22 (Asia/Shanghai)
- **Decision:** **PASS** for the D-stage English text gate. The C draft was not modified. Image files, page integration, and browser/UI behavior are **UNVERIFIED** and remain for G/E-page.

## Acceptance results

| Check | Result | Evidence |
|---|---|---|
| C version binding | PASS | `shasum -a 256 docs/blog-ops/profit-margin-stardew/C-en-draft.md` exited 0 and returned the SHA above. |
| Single H1 | PASS | `rg -n '^# ' .../C-en-draft.md` exited 0 with one match: line 1. |
| Current repetition tightened | PASS | The current prose has one full price-classification/calculation procedure at C:26. The 75% answer at C:30–34 explains the requested setting and Wheat example; the C:48–60 matrix section applies the boundary to a budget; C:99–123 is the new-farm setup/checklist. These have distinct reader jobs; no second full step-by-step procedure or duplicated paragraph remains. |
| Required internal link | PASS | `/how-to-earn-money-stardew` occurs exactly once at C:60; `rg -o` count was `1`, exit 0. |
| Options / Multiplayer references | PASS | Options links/mentions appear at C:5, C:24, C:97, and C:129; Multiplayer links/mentions appear at C:34, C:38, C:75, and C:130. The source list keeps Options first and Multiplayer second. |
| Exact checked label | PASS | Exact line present at C:127: `Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.` `rg` exited 0. |
| Two semantic figure slots | PASS | `fig-01-price-boundary` occurs at C:62 with a price-boundary alt/caption at C:64; `fig-02-advanced-options-path` occurs at C:111 with a platform-neutral setup-path alt/caption at C:113. Each slot has a distinct explanatory role. |
| Public-copy hygiene | PASS | Case-insensitive `rg` leakage scan for Orca/dispatch/worker/task/terminal markers, private paths, workflow terms, localhost, internal docs/report names, credentials, tokens, passwords, and secrets exited 1 with no matches. |
| Qualified English length | PASS | Direct V7 count excluding `Sources`: `mechanical_units=2091`, `meets_mechanical_floor=true`. The same V7 `extract_body`/`count_units` logic after removing exactly two standalone italic captions (C:64 and C:113) returned `independent_units=2016`, inside the required 2,000–2,300 range. |
| Public source HEAD checks | PASS | `curl -sSIL` returned HTTP/2 200, exit 0, for both `https://stardewvalleywiki.com/Options` and `https://stardewvalleywiki.com/Multiplayer`. This verifies reachability only, not every mechanics claim. |
| Whitespace / working tree | PASS | `git diff --check` exited 0 with no output. `git status --short` exited 0 and showed the pre-existing untracked directory `?? docs/blog-ops/profit-margin-stardew/`; no commit, push, deployment, build, page, or browser check was run. |

## Command receipts

All commands below ran from the repository root. An `rg` exit 1 for the leakage scan means no forbidden match was found.

```text
shasum -a 256 docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=0
ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa  docs/blog-ops/profit-margin-stardew/C-en-draft.md
```

```text
python3 /Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py docs/blog-ops/profit-margin-stardew/C-en-draft.md --locale en --exclude-heading Sources
exit=0
mechanical_units=2091
required_floor=2000
meets_mechanical_floor=true
omitted_line_counts: headings=14, excluded_sections=5, non_body=54
sha256_raw=ab5d9eae170db99c354b1a1d7ecd35961dfabc431c7a2726ee3bf339bf7068aa
```

```text
python3 - <<'PY' (imports `/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py`, removes exactly standalone italic lines matching `^\*[^*]+\*$`, then calls `extract_body(..., ('Sources',))` and `count_units(..., 'en')`)
exit=0
caption_count=2
caption_line_numbers=[64, 113]
independent_units=2016
required_range=2000-2300
meets_range=true
```

```text
rg -n '^# ' docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=0
1:# What Is Profit Margin in Stardew Valley? 100%, 75%, 50%, and 25% Explained

rg -n -o '/how-to-earn-money-stardew' docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=0
60:/how-to-earn-money-stardew
count=1

rg -n 'fig-01-price-boundary|fig-02-advanced-options-path' docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=0
62:![Diagram showing Stardew Valley Profit Margin prices that scale and shop costs and rewards that stay unchanged](fig-01-price-boundary)
111:![Schematic of the Stardew Valley new-game path to Advanced Options and the Profit Margin selector](fig-02-advanced-options-path)

rg -n '^Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer\.$' docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=0
127:Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.

rg -ni 'orca|dispatch|worker|task_|term_|/Users/|workflow|调度|私有|localhost|127\.0\.0\.1|docs/blog-ops|E-en|D-en|research|draft|credential|token|password|secret' docs/blog-ops/profit-margin-stardew/C-en-draft.md
exit=1
(no matches)
```

```text
curl -sSIL --max-time 20 https://stardewvalleywiki.com/Options
exit=0
HTTP/2 200

curl -sSIL --max-time 20 https://stardewvalleywiki.com/Multiplayer
exit=0
HTTP/2 200

git diff --check
exit=0
(no output)

git status --short
exit=0
?? docs/blog-ops/profit-margin-stardew/
```

## Explicitly unverified

- Actual image files, dimensions, formats, byte budgets, AVIF/WebP bindings, rights, and visual legibility: **UNVERIFIED**.
- Page assembly, route/build output, rendering, responsive behavior, accessibility, and browser/UI behavior: **UNVERIFIED**.
- No source, page, image, configuration, dependency, commit, push, or deployment write was made by this check; the only new file is this report.
