# Harvest media candidates

Private candidates only. Public WebP/AVIF files were not written. This is not a page PASS.

## Sources

- `en-body.md` sha256 `dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101`
- `en-figure.svg` sha256 `a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661`
- Earlier in this run the figure hash was `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3` and the body hash was `f81237bcc07fea284a5cca66b5cc075bd98f103d127209793fc08228565a4421`. Role C changed both files before this raster. The only figure diff against that earlier file is the non-visible `<desc>` string (`rice, and fiber` became `Unmilled Rice, and Fiber`). Visible text, geometry, and colors were not edited by M.
- Visible SVG text nodes: 22
- Source SVG hash was checked again after rasterizing and was unchanged.
- Previous figure PNG `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/history/en-figure-74a641effdd8.png` sha256 `c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117` is kept for source `74a641effdd88f44084e6f40353ac4d567e8b356722f910ee41ccccac1f18fa3`. It is not the current candidate.

## Figure

- Output: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/en-figure-candidate.png`
- sha256 `c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117`
- 1672x941 PNG 162377 bytes
- Chrome command exit code recorded in `render-logs/en-figure-chrome.log`: 0. That log also says `stable_png_before_stop: True`. It does not record SIGTERM. This is the process return code stored by the renderer, not an echo of a later command.
- Command: `'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1672,941 --no-first-run --no-default-browser-check --disable-extensions --user-data-dir=/tmp/harvest-media-m-36434/profile-figure '--screenshot=/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/en-figure-candidate.png' http://127.0.0.1:8773/en-figure-render.html`
- Pixel samples matched the source fills at (8,8), (100,40), (80,400), (50,650), (590,660), and (1140,660).
- Bright glyph pixels: 82086. Bright components: 156. Box-like components: 0.
- Tesseract, retained log `render-logs/tesseract-en-figure.log`: `subprocess.run` stored `returncode` 0. The stderr section of that file is empty. Stdout is incomplete: it drops `Right-Click or X` and `Left-Click or C`, and it shows `18-21` where the picture shows `15-21`. That 0 is tesseract's return code for this invocation. It is not a wrapper exit, and the log was not rewritten to 1.
- Tesseract, earlier open failure: a shell run against a `/tmp` PNG printed Leptonica `failed to open` errors. A following `echo $?` printed 0 because `$?` was read after `cat`, not after tesseract. A later direct check of that same open failure printed exit 1. That failure was not copied into this media log. OCR is not part of the acceptance check.
- Image readback of the PNG itself showed all 22 labels, including the two button labels tesseract dropped.

## Cover

- Source: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/cover-source.svg` sha256 `03dec0791a44acf2da23097d114cbf84b6f4d12efb90056a64552232bba08608`
- Output: `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/cover-candidate.png` sha256 `bed8e9781d2f4034b7036d727e29fe2ab3511e6c9612239cc3827edf015f1ce3`
- 1672x941 PNG 99173 bytes. Limit 1310720.
- Chrome command exit code recorded in `render-logs/cover-chrome.log`: 0, with `stable_png_before_stop: True`. The log does not record SIGTERM.
- Command: `'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1672,941 --no-first-run --no-default-browser-check --disable-extensions --user-data-dir=/tmp/harvest-media-m-36434/profile-cover '--screenshot=/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/cover-candidate.png' http://127.0.0.1:8773/cover-render.html`
- Swift Vision OCR exit code: 0. No alphabetic word of 4 or more letters. Log: `render-logs/cover-ocr.txt`.
- Attribution: original scene drawn for this article. Not a game screenshot.

## Temp processes

Scratch Chrome profiles were under `/tmp/harvest-media-m-36434/profile-figure` and `profile-cover`. The local HTTP server was `127.0.0.1:8773` and served only `media/render-logs`. Those processes were stopped at the end of this run. No broad process kill was used. `/tmp` is not the delivery location.

## History

- `/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/media/history/en-figure-a6e017cda7dd.png` keeps this source hash's figure PNG.
