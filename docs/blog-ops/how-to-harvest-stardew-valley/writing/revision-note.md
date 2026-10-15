# Revision note: how to harvest stardew valley

- Role: C, English candidate only. Not D, E, F, T, or G.
- Candidate version: round 3 (last shared revision). This note does not sign ResearchTrace, ReaderValue, Repetition, the 22-rule review, or a lock.
- Worktree: `/Users/wusir/orca/workspaces/stardew planner/博客-2` (branch `博客-2`). Directory separation only. No OS privilege-isolation test was run.
- v1 bytes are copied under `writing/v1/`. v1 body SHA256 `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`. v1 figure SHA256 `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3`.
- Item-by-item handling is in `writing/revision-round3.md`.

## Length

Command:

```
python3 "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py" "docs/blog-ops/how-to-harvest-stardew-valley/writing/en-body.md" --locale en
```

Script stdout:

- `mechanical_units` 1363
- `required_floor` 1000
- `meets_mechanical_floor` true
- `long_form_target` 2000
- `meets_long_form_target` false
- `length_class` `short`
- `semantic_qualification` `requires_independent_review`
- `sha256_raw` and `sha256_nfc_lf` both `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
- `omitted_line_counts.headings` 15

The same counter's word pattern, applied to pieces the script does not treat as the floor:

- Figcaption is inside the 1363. Caption units: 37. After removing that caption: 1326.
- Heading text is already outside the 1363. Heading units: 101 across 15 heading lines.
- Alt sits inside the `<img>` tag, so the script drops it with the tag. Alt units: 37.
- URLs are stripped. Link anchors remain in the 1363.

主意图材料已写完. Both 1363 and 1326 sit in 1000–1999. The five sections answer the harvest actions that were already verified: the PC parsnip click, the hold with the mouse away from the character and the tile underfoot, the scythe crops, the three scythes, the day count, season change, giant crops, and trellises. No FAQ, H1, source list, disclaimer, or recap was added to reach 2000. This length note is not a quality pass.

## Output hashes (SHA256)

- `writing/en-body.md` `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
- `writing/en-figure.svg` `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661`
- `writing/en-media.json` `1d4cd52f3d7cc7b180e60183c8f18ca61bd58b1889243c02e44a1422c38451c3` (unchanged; alt, caption, and `visibleText` already matched the 22 visible strings)

## Verification

- XML parse of `en-figure.svg`: passed (`xml.etree.ElementTree.parse`). Root 1672 by 941, viewBox `0 0 1672 941`. `<text>` count 22, order matches `visibleText`. Font sizes 48, 52, 56, 60, 64. `<desc>` now says `Unmilled Rice`.
- Body alt and caption each occur once and match `en-media.json`.
- UTF-8, NFC, LF, final newline, no CR, no trailing whitespace: passed on the body, the SVG, and the media JSON.
- `git diff --check`: exit 0.
- `git diff --check --no-index -- /dev/null <file>` for the body, the SVG, and the media JSON: exit 1, no whitespace warning. Exit 1 is the difference from `/dev/null`.
- `git status --short` showed `docs/blog-ops/how-to-harvest-stardew-valley/writing/` untracked. It did not list `src` or `public`.
- Product `typecheck`, `test`, `build`, and the dev server: not run.

## Left for later roles

D and E have not reviewed this candidate. The v1 gate results do not carry over. G still rasterizes the SVG. WebP and AVIF files were not created here. No quality pass is claimed.
