import http.server
import importlib.util
import json
import os
import shlex
import shutil
import socketserver
import threading
import xml.etree.ElementTree as XmlTree
from pathlib import Path

from PIL import Image

ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
MEDIA = ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/media"
LOG_DIR = MEDIA / "render-logs"
FINAL_DIR = LOG_DIR / "final-rasters"
SOURCE_SVG = ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-figure.svg"
DERIVED_SVG = MEDIA / "derived" / "zh-figure-render.svg"
SOURCE_SHA = "50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13"
LABEL = "掉落 15–21 个，换季不枯"
CARD_LEFT = 20
CARD_RIGHT = 550
INK_LEFT_LIMIT = 34
INK_RIGHT_LIMIT = 536
SVG_NS = {"svg": "http://www.w3.org/2000/svg"}
TEXT_LENGTHS = (500, 480, 460, 440, 420)


def load_encoder():
    spec = importlib.util.spec_from_file_location("encode_final", LOG_DIR / "encode-final.py")
    if spec is None or spec.loader is None:
        raise SystemExit(f"cannot load encoder from {LOG_DIR / 'encode-final.py'}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def assert_source_hash(encoder) -> None:
    actual = encoder.sha256_file(SOURCE_SVG)
    if actual != SOURCE_SHA:
        raise SystemExit(f"{SOURCE_SVG} sha256 is {actual}, expected {SOURCE_SHA}")


def derived_markup(source_text: str, text_length: int) -> str:
    if source_text.count(LABEL) != 1:
        raise SystemExit(f"label count in source is {source_text.count(LABEL)}, expected 1")
    label_at = source_text.index(LABEL)
    tag_start = source_text.rfind("<text ", 0, label_at)
    tag_end = source_text.index("</text>", label_at) + len("</text>")
    if tag_start < 0:
        raise SystemExit("label is not inside a text tag")
    original = source_text[tag_start:tag_end]
    needle = ' text-anchor="middle">'
    if original.count(needle) != 1 or "textLength" in original or 'font-size="48"' not in original:
        raise SystemExit(f"unexpected source tag: {original}")
    adapted = original.replace(
        needle,
        f' text-anchor="middle" textLength="{text_length}" lengthAdjust="spacingAndGlyphs">',
        1,
    )
    if LABEL not in adapted or adapted.count(LABEL) != 1:
        raise SystemExit("adapted tag lost the original label")
    return source_text[:tag_start] + adapted + source_text[tag_end:]


def assert_derived_shape(encoder, derived_path: Path, text_length: int) -> None:
    if encoder.rect_signature(SOURCE_SVG) != encoder.rect_signature(derived_path):
        raise SystemExit("derived rect geometry differs from the source SVG")
    if encoder.visible_labels(SOURCE_SVG) != encoder.visible_labels(derived_path):
        raise SystemExit("derived visible labels differ from the source SVG")
    root = XmlTree.fromstring(derived_path.read_bytes())
    matched = 0
    for node in root.findall(".//svg:text", SVG_NS):
        text_length_attr = node.get("textLength")
        if "".join(node.itertext()) != LABEL:
            if text_length_attr is not None or node.get("lengthAdjust") is not None:
                raise SystemExit(f"unexpected textLength on {''.join(node.itertext())}")
            continue
        matched += 1
        if text_length_attr != str(text_length) or node.get("lengthAdjust") != "spacingAndGlyphs":
            raise SystemExit(
                f"adapted attrs are textLength={text_length_attr} lengthAdjust={node.get('lengthAdjust')}"
            )
        if node.get("font-size") != "48":
            raise SystemExit(f"adapted font-size is {node.get('font-size')}, expected 48")
    if matched != 1:
        raise SystemExit(f"adapted label count is {matched}, expected 1")


def measure_line(path: Path) -> tuple[int, int, int, int, int]:
    image = Image.open(path).convert("RGB")
    image.load()
    pixels = image.load()
    width, height = image.size
    if (width, height) != (1672, 941):
        raise SystemExit(f"{path} size is {image.size}, expected 1672x941")
    xs = []
    ys = []
    for y in range(790, 910):
        for x in range(680):
            red, green, blue = pixels[x, y]
            if red >= 160 and green >= 160 and blue >= 180 and (blue - red) < 50:
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit(f"no line ink found in {path}")
    return min(xs), min(ys), max(xs), max(ys), len(xs)


def line_fits(bounds: tuple[int, int, int, int, int]) -> bool:
    left, top, right, bottom, count = bounds
    return (
        count > 1000
        and left >= INK_LEFT_LIMIT
        and right <= INK_RIGHT_LIMIT
        and 800 <= top
        and bottom <= 900
        and left > CARD_LEFT
        and right < CARD_RIGHT
    )


def assert_other_pixels_unchanged(before_path: Path, after_path: Path) -> int:
    before = Image.open(before_path).convert("RGB")
    after = Image.open(after_path).convert("RGB")
    before.load()
    after.load()
    if before.size != after.size:
        raise SystemExit(f"adapted size {after.size} != source raster {before.size}")
    before_pixels = before.load()
    after_pixels = after.load()
    changed = 0
    stray = []
    width, height = before.size
    for y in range(height):
        for x in range(width):
            if before_pixels[x, y] == after_pixels[x, y]:
                continue
            changed += 1
            if y < 790 or y > 910 or x > 580:
                if len(stray) < 6:
                    stray.append((x, y, before_pixels[x, y], after_pixels[x, y]))
    if stray:
        raise SystemExit(f"pixels changed outside the target line: {stray}")
    if changed == 0:
        raise SystemExit("adapted raster is identical to the overflowing raster")
    return changed


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        return


def render_derived(encoder, html_path: Path, png_path: Path, log_path: Path) -> int:
    profile = LOG_DIR / "chrome-profile-adapt"
    server = socketserver.TCPServer(
        ("127.0.0.1", 0),
        lambda *args, **kwargs: QuietHandler(*args, directory=str(html_path.parent), **kwargs),
    )
    port = server.server_address[1]
    if not isinstance(port, int) or port <= 0:
        server.server_close()
        raise SystemExit(f"render server picked an unusable port: {port}")
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        exit_code, _command = encoder.render_html(
            f"http://127.0.0.1:{port}/{html_path.name}",
            png_path,
            log_path,
            profile,
        )
    finally:
        server.shutdown()
        server.server_close()
        if profile.exists():
            shutil.rmtree(profile)
    return exit_code


def publish_pair(encoder, png_path: Path, log_lines: list[str]) -> list[dict]:
    staging = FINAL_DIR / "zh-adapt-staging"
    staging.mkdir(parents=True, exist_ok=True)
    published = []
    targets = [
        (
            "zh-webp",
            ROOT / "public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp",
            "/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp",
        ),
        (
            "zh-avif",
            ROOT / "public/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif",
            "/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif",
        ),
    ]
    staged_paths = []
    try:
        for asset_id, public_path, _url in targets:
            staged = staging / public_path.name
            if staged.exists():
                staged.unlink()
            command = encoder.encode_command(png_path, staged)
            exit_code = encoder.run_command(command, log_lines)
            encoder.clear_quarantine(staged)
            decoded = staging / f"{public_path.name}.png"
            encoder.run_command(encoder.decode_command(staged, decoded), log_lines)
            encoder.assert_png(decoded)
            bounds = measure_line(decoded)
            if not line_fits(bounds):
                raise SystemExit(f"decoded {asset_id} ink bounds {bounds} fall outside {INK_LEFT_LIMIT}..{INK_RIGHT_LIMIT}")
            staged_paths.append((asset_id, staged, public_path, exit_code, command, bounds))
        for asset_id, staged, public_path, exit_code, command, bounds in staged_paths:
            os.replace(staged, public_path)
            encoder.clear_quarantine(public_path)
            published.append(
                {
                    "id": asset_id,
                    "filePath": str(public_path),
                    "sha256": encoder.sha256_file(public_path),
                    "byteSize": public_path.stat().st_size,
                    "command": shlex.join(command),
                    "exitCode": exit_code,
                    "decodedInk": list(bounds),
                }
            )
    except BaseException:
        for path in staged_paths:
            staged = path[1]
            if staged.exists():
                staged.unlink()
        raise
    return published


def update_manifest(encoder, text_length: int, png_path: Path, published: list[dict], changed_pixels: int) -> None:
    manifest_path = MEDIA / "final-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in published}
    for asset in manifest["assets"]:
        if asset["id"] not in by_id:
            continue
        fresh = by_id[asset["id"]]
        asset["byteSize"] = fresh["byteSize"]
        asset["sha256"] = fresh["sha256"]
        asset["rasterPath"] = str(png_path)
        asset["rasterSha256"] = encoder.sha256_file(png_path)
        asset["sourceSha256"] = encoder.sha256_file(SOURCE_SVG)
        asset["command"] = fresh["command"]
        asset["exitCode"] = fresh["exitCode"]
        asset["derivedPath"] = str(DERIVED_SVG)
        asset["derivedSha256"] = encoder.sha256_file(DERIVED_SVG)
        if asset["sourceSha256"] != SOURCE_SHA:
            raise SystemExit(f"manifest source sha became {asset['sourceSha256']}")
    manifest["renderAdaptation"] = {
        "sourcePath": str(SOURCE_SVG),
        "sourceSha256": SOURCE_SHA,
        "derivedPath": str(DERIVED_SVG),
        "derivedSha256": encoder.sha256_file(DERIVED_SVG),
        "changedPixelCount": changed_pixels,
        "nodes": [
            {
                "text": LABEL,
                "changes": [
                    {"attribute": "font-size", "before": "48", "after": "48"},
                    {"attribute": "textLength", "before": None, "after": str(text_length)},
                    {"attribute": "lengthAdjust", "before": None, "after": "spacingAndGlyphs"},
                ],
            }
        ],
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    encoder = load_encoder()
    assert_source_hash(encoder)
    source_text = SOURCE_SVG.read_text(encoding="utf-8")
    DERIVED_SVG.parent.mkdir(parents=True, exist_ok=True)
    attempts = []
    chosen = None
    for text_length in TEXT_LENGTHS:
        markup = derived_markup(source_text, text_length)
        DERIVED_SVG.write_text(markup, encoding="utf-8")
        assert_derived_shape(encoder, DERIVED_SVG, text_length)
        html_path = FINAL_DIR / "zh-adapt-render.html"
        png_path = FINAL_DIR / f"zh-adapt-{text_length}.png"
        html_path.write_bytes(encoder.html_for_svg(DERIVED_SVG))
        exit_code = render_derived(encoder, html_path, png_path, LOG_DIR / f"zh-adapt-{text_length}-chrome.log")
        bounds = measure_line(png_path)
        attempts.append({"textLength": text_length, "exitCode": exit_code, "ink": list(bounds), "fits": line_fits(bounds)})
        if line_fits(bounds):
            chosen = (text_length, png_path, bounds, exit_code)
            break
    assert_source_hash(encoder)
    if chosen is None:
        raise SystemExit(f"no textLength fit the card: {attempts}")
    text_length, png_path, bounds, exit_code = chosen
    if exit_code != 0:
        raise SystemExit(f"chosen chrome exit is {exit_code}")
    changed = assert_other_pixels_unchanged(FINAL_DIR / "zh.png", png_path)
    log_lines = ["# zh line adaptation encode", ""]
    published = publish_pair(encoder, png_path, log_lines)
    (LOG_DIR / "zh-adapt-encode.log").write_text("\n".join(log_lines), encoding="utf-8")
    update_manifest(encoder, text_length, png_path, published, changed)
    assert_source_hash(encoder)
    print(
        json.dumps(
            {
                "attempts": attempts,
                "chosenTextLength": text_length,
                "pngInk": list(bounds),
                "changedPixels": changed,
                "derivedSha256": encoder.sha256_file(DERIVED_SVG),
                "sourceSha256": encoder.sha256_file(SOURCE_SVG),
                "published": published,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
