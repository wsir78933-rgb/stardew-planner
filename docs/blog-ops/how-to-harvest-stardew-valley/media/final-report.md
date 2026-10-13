# Final media report (role M)

Page QA is not signed here. E checks the live page. This report only covers the six local public files and the rasters they came from.

## Result

Six public files exist. Each is 1672×941. Cover WebP is 38974 bytes and cover AVIF is 17525 bytes. Both are under the 1310720-byte cover limit. English and Chinese decoded images show all 22 labels in real glyphs. The cover has no text. Source hashes were unchanged before raster, before the public write, and again in the independent check below.

The first public attempt used `sips -s format avif`. That script exited 1 because ffmpeg decoded the AVIF to 512×512. The script deleted the public files from that attempt. A later probe of sips alone exited 0 and `sips -g` reported 1672×941, but ffprobe listed eight 512×512 AV1 streams. Those sips bytes were not published. The published AVIF files were encoded with the already installed ffmpeg libaom-av1 encoder.

## Sources (re-read after encode, all matched)

| File | SHA-256 |
|---|---|
| writing/en-figure.svg | a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661 |
| writing/locked/en-body.md | dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101 |
| seo/en-seo.json | 30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08 |
| translation/zh-figure.svg | 50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13 |
| translation/zh-body.md | ec8b60fc7e99ac1c18b566bdd3594edc29f524d5cc6d3470625ef506f772c024 |
| translation/zh-seo.json | 44fda49e69a3e9e6d6984b50075bfaa1eed0cd72ccdf87d4425ba2d55e97aab5 |
| translation/zh-media.json | 7aae7773171719b1db6df94599a2e861d915bbd0c99d073b408f2e0f80ebc7f2 |
| media/cover-source.svg | 03dec0791a44acf2da23097d114cbf84b6f4d12efb90056a64552232bba08608 |

EN and ZH SVG files each have 22 visible text nodes and the same rect geometry. The wrapper HTML strips an XML declaration only in memory. The source files were not edited. Cover source has no text.

Chrome rasters, all exit 0 with `stable_png_before_stop: True`:

| Raster | SHA-256 | Bytes |
|---|---|---|
| en.png | c9618ffac6cda4a0d3e3bc6ed2e68e3ed186a593d79398caebf1c2b1d1b25117 | 162377 |
| zh.png | 2d46ef385094b395995c76d837c0019b58ca2867f7972e4090c1e812a754b82f | 168109 |
| cover.png | bed8e9781d2f4034b7036d727e29fe2ab3511e6c9612239cc3827edf015f1ce3 | 99173 |

The EN and cover PNG hashes match the earlier candidates. The only EN SVG change since the first candidate was a non-visible description string, so the pixels stayed the same.

## Public files

| URL | Format | Bytes | SHA-256 |
|---|---|---:|---|
| /blog/how-to-harvest-stardew-valley-cover.webp | WebP | 38974 | 8558f5b08e0c3e890ceddfcffb7104ed0a0fb0380dedec4108beed46220b81d8 |
| /blog/how-to-harvest-stardew-valley-cover.avif | AVIF | 17525 | ccd28749dfd7047666d8bcbf8410aa929a060e660cc882d3814ef74d6dec19cd |
| /blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp | WebP | 99024 | c5d987fdd4c2d1799358baf987ee31a5b7a9d90b5933c7e3fc1eb43c4a1883a5 |
| /blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif | AVIF | 39279 | 92476d4c389afbf12d2b40e1a0773139a33c6fd0e24df71be97918a05ba4d861 |
| /blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp | WebP | 105016 | 450f78bb5aefcc6dda6826cb9fcda8a2af45f9778e077b49012596dbb38394f2 |
| /blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif | AVIF | 40187 | d918433c39793cf8f455281b4ba4606749eff17d68d7c6d682183f07f5e33d6a |

Cover attribution: original illustrative harvest scene drawn for this article. No external image, no game screenshot, and no text. The tool beside the pumpkins is an unnamed brown handle with a gray pointed head. It is not labeled axe, hoe, or spade.

EN attribution: lossy derivative of the Chrome raster of writing/en-figure.svg. Visible text, geometry, and facts were not rewritten.

ZH attribution: lossy derivative of a render-only copy of translation/zh-figure.svg. The source file hash is still `50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13`. The derived file hash is `e658a04213b8ed3a16b32ca92e836edc98fc5dbce115f8882e452012b94d0812`. The only markup change is on the line `掉落 15–21 个，换季不枯`: `textLength="500"` and `lengthAdjust="spacingAndGlyphs"` were added. Font size stays 48. The words, numbers, and punctuation are unchanged.

The table hashes match `media/final-manifest.json` after that replacement. An independent re-hash of the six public files matched the manifest. EN and cover hashes did not change.

## Image readback

Decoded public WebP and AVIF were opened as PNG, not judged from SVG source or JSON.

English, both formats, 22 labels readable: CROP HARVEST METHODS; HAND HARVEST; Parsnip; Check / Do Action; Right-Click or X; Hold on your tile; SCYTHE SWING; Kale, Wheat, Amaranth; Unmilled Rice, Fiber; Left-Click or C; Iridium 1.6: tilled soil; GIANT CROP; Axe, 3 hits; 15-21, no wilt; TRELLIS; Green Bean, Hops; Grape; Path is blocked; DAY 28; Off-season wilts; Greenhouse; all year.

Chinese, both formats, 22 labels readable as Chinese glyphs, not empty boxes: 农作物收获方式; 徒手采摘; 防风草; 检查 / 执行操作; 右键或 X; 按住收获脚下格; 镰刀挥击; 羽衣甘蓝、小麦、苋菜; 未碾米、纤维; 左键或 C; 1.6 铱镰刀：耕地收获; 巨大作物; 斧头砍 3 下; 掉落 15–21 个，换季不枯; 棚架; 青豆、啤酒花; 葡萄; 通道被阻挡; 第 28 天; 过季即枯萎; 温室; 全年可种.

The published Chinese WebP and AVIF were decoded again and opened. The line `掉落 15–21 个，换季不枯` is fully readable. 掉 has its left stroke inside the card, with a gap before the border. 枯 stops before the right border. Measured label ink on the PNG, the decoded WebP, and the decoded AVIF is x=36 through x=532, y=816 through y=864. The card is x=20 through x=550. The next card starts at x=570.

Cover, both formats: sun, trees, three pumpkins, unnamed pointed tool, curved blade in the grain, leafy bed, tapered orange roots, wheat, trellis, path, greenhouse. No letters.

## Render adaptation

The first Chinese raster painted that one line from x=17 through x=551, so 掉 was cut at the left card edge and 枯 crossed the right edge. `translation/zh-figure.svg` was not edited. A derived copy at `media/derived/zh-figure-render.svg` adds only `textLength="500"` and `lengthAdjust="spacingAndGlyphs"` to that text node. Pixel diff against the first Chinese raster found 10692 changed pixels, all inside that line's band. EN was not re-rendered.

## Commands and exits

Successful publish command:

`python3 docs/blog-ops/how-to-harvest-stardew-valley/media/render-logs/encode-final.py`

Exit 0.

Inside that run:

- Chrome headless screenshot for en, zh, and cover: exit 0, stable PNG before stop, logs `media/render-logs/final-en-chrome.log`, `final-zh-chrome.log`, `final-cover-chrome.log`.
- `cwebp -q 90 -metadata none` for three WebP files: exit 0.
- `ffmpeg -y -i <png> -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 -pix_fmt yuv444p <avif>` for three AVIF files: exit 0. Header contains `ftypavif`. ffprobe reports `codec_name=av1`, `width=1672`, `height=941`.
- `dwebp` and `webpinfo` for three WebP files: exit 0. dwebp printed `Dimensions: 1672 x 941`.
- `ffmpeg -y -i <avif> -update 1 -frames:v 1 <png>` for three AVIF files: exit 0. Pillow loaded each decoded PNG at 1672×941.
- `ffprobe` on all six public files: exit 0, each 1672×941.

`media/render-logs/final-encode.log` contains 21 `exit_code: 0` lines and no other exit code. Its Chinese ffprobe lines describe the pre-adaptation files. Those two Chinese files were replaced and decoded again in the fit step below.

Chinese line fit, after the coordinator confirmed the first raster was clipped:

`python3 docs/blog-ops/how-to-harvest-stardew-valley/media/render-logs/adapt-zh-line.py`

Exit 0. Chrome for `textLength=500` exited 0 with `stable_png_before_stop: True`. `media/render-logs/zh-adapt-encode.log` has 4 `exit_code: 0` lines: cwebp, dwebp, ffmpeg AVIF encode, and ffmpeg AVIF decode. No other exit code is in that log.

Independent check after the replacement: source hash still `50cd8f2c…`, derived hash `e658a042…`, only source line 28 differs, six public hashes match the manifest, both Chinese decodes exit 0 at 1672×941, AVIF headers contain `ftypavif`, EN and cover hashes are unchanged. Exit 0. `FAIL_COUNT 0`.

Rejected attempt: the earlier `encode-final.py` path that called `sips -s format avif` exited 1 with `decoded ...cover.avif.png is PNG (512, 512)`. No public file from that attempt remains.

Not run: page tests, browser page QA, typecheck, lint, build, commit, push, deploy. Those are outside this media task.
