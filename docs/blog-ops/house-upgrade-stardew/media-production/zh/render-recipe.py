#!/usr/bin/env python3
"""Render the Chinese house-upgrade diagrams from their SVGs.

This recipe only reads the Chinese SVGs in this directory, writes PNG previews
under /tmp, and writes WebP/AVIF, render.log, and provenance.json here.
"""

import hashlib
import json
import subprocess
import time
from pathlib import Path

from PIL import Image

BASE_DIR = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/media-production/zh")
EN_DIR = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/media-production/en")
TMP_DIR = Path("/tmp")

ENGLISH_BODY_SHA256 = "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
TRANSLATED_BODY_SHA256 = "9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843"
FONT_STACK = "'Arial Narrow', 'PingFang SC', 'Hiragino Sans GB', sans-serif"

EN_FILE_SHA256 = {
    "cover-payments.svg": "4f0103d7aaed81a3a617b945dced399cfee526eec04f59faf643fadc18713785",
    "tier-rooms.svg": "0f68fefc86cf2f959bab09411c6000069d0ed78172aa2f1263bf82ef46d07af2",
    "upgrade-or-renovation.svg": "71c935969c7952967207ed70006b65da614909d92689f0ba260f36e7e7c335ad",
    "house-upgrade-stardew-cover.webp": "c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342",
    "house-upgrade-stardew-cover.avif": "f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113",
    "tier-rooms.en.webp": "c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209",
    "tier-rooms.en.avif": "8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b",
    "upgrade-or-renovation.en.webp": "040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b",
    "upgrade-or-renovation.en.avif": "1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426",
    "provenance.json": "4849463e179846c47da8136c4356fdb8327975841f965ce90ba801a753b8a9f5",
    "render-recipe.py": "cf1bdd3c2d391e904fb3a70a51d3fef71170df2ea53fc550d8129ed06742fc4c",
}

FIGURE_SPECS = [
    {
        "id": "cover-payments",
        "svg_file": "cover-payments.svg",
        "webp_file": "house-upgrade-stardew-cover-zh.webp",
        "avif_file": "house-upgrade-stardew-cover-zh.avif",
        "role": "cover",
        "public_webp": "/blog/house-upgrade-stardew-cover-zh.webp",
        "public_avif": "/blog/house-upgrade-stardew-cover-zh.avif",
    },
    {
        "id": "tier-rooms",
        "svg_file": "tier-rooms.svg",
        "webp_file": "tier-rooms.zh.webp",
        "avif_file": "tier-rooms.zh.avif",
        "role": "body",
        "public_webp": "/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
        "public_avif": "/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif",
    },
    {
        "id": "upgrade-or-renovation",
        "svg_file": "upgrade-or-renovation.svg",
        "webp_file": "upgrade-or-renovation.zh.webp",
        "avif_file": "upgrade-or-renovation.zh.avif",
        "role": "body",
        "public_webp": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
        "public_avif": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif",
    },
]


def compute_sha256(file_path: Path) -> str:
    if not file_path.exists():
        raise FileNotFoundError(f"File not found for hash calculation: {file_path}")
    hasher = hashlib.sha256()
    with open(file_path, "rb") as handle:
        while chunk := handle.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def assert_english_assets_unchanged() -> None:
    for filename, expected in EN_FILE_SHA256.items():
        actual = compute_sha256(EN_DIR / filename)
        if actual != expected:
            raise ValueError(f"English asset hash changed for {filename}: expected {expected}, got {actual}")


def render_svg_to_png(svg_path: Path, png_path: Path, log_lines: list) -> tuple[int, list]:
    script = f"""
const task = await taskSpace("render-zh-house-upgrade");
const page = task.page("p1");
await page.cdp("Emulation.setDeviceMetricsOverride", {{
  width: 1672,
  height: 941,
  deviceScaleFactor: 1,
  mobile: false
}});
await page.goto("file://{svg_path.as_posix()}");
const measure = await page.evaluate(async () => {{
  await document.fonts.ready;
  const pingfang = document.fonts.check("700 84px 'PingFang SC'");
  const hiragino = document.fonts.check("700 84px 'Hiragino Sans GB'");
  const texts = [...document.querySelectorAll("text")];
  return {{
    pingfang,
    hiragino,
    labels: texts.map((node) => {{
      const textBox = node.getBoundingClientRect();
      let boxNode = node.previousElementSibling;
      while (boxNode && boxNode.tagName.toLowerCase() !== "rect") {{
        boxNode = boxNode.previousElementSibling;
      }}
      if (!boxNode) {{
        return {{ id: node.id, text: node.textContent, error: "missing background rect" }};
      }}
      const rectBox = boxNode.getBoundingClientRect();
      const overflow =
        textBox.left < rectBox.left - 1 ||
        textBox.right > rectBox.right + 1 ||
        textBox.top < rectBox.top - 1 ||
        textBox.bottom > rectBox.bottom + 1;
      return {{
        id: node.id,
        text: node.textContent,
        font: getComputedStyle(node).fontFamily,
        overflow,
        textWidth: textBox.width,
        textHeight: textBox.height,
        rectWidth: rectBox.width,
        rectHeight: rectBox.height
      }};
    }})
  }};
}});
console.log("MEASURE_JSON " + JSON.stringify(measure));
await page.screenshot({{ path: "{png_path.as_posix()}" }});
await task.finish({{ keep: [] }});
"""
    command = ["ego-browser", "nodejs", "-e", script]
    log_lines.append(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] RUN: {' '.join(command[:2])} screenshot {svg_path.name} -> {png_path}")
    started = time.time()
    completed = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    log_lines.append(f"  exit_code: {completed.returncode}, duration: {time.time() - started:.2f}s")
    if completed.stdout.strip():
        log_lines.append(f"  stdout: {completed.stdout.strip()}")
    if completed.stderr.strip():
        log_lines.append(f"  stderr: {completed.stderr.strip()}")
    if completed.returncode != 0:
        raise RuntimeError(f"ego-browser failed to render {svg_path} with exit code {completed.returncode}: {completed.stderr}")
    if not png_path.exists():
        raise FileNotFoundError(f"Expected rendered PNG missing at {png_path}")
    measurements = parse_measurements(completed.stdout + "\n" + completed.stderr, svg_path)
    reject_overflow(measurements, svg_path)
    return completed.returncode, measurements


def parse_measurements(stdout: str, svg_path: Path) -> list:
    payload = None
    for line in stdout.splitlines():
        if line.startswith("MEASURE_JSON "):
            payload = json.loads(line[len("MEASURE_JSON "):])
    if payload is None:
        raise ValueError(f"No MEASURE_JSON in ego-browser stdout for {svg_path}")
    if not payload.get("pingfang") and not payload.get("hiragino"):
        raise RuntimeError(f"Neither PingFang SC nor Hiragino Sans GB is available to the renderer for {svg_path}")
    labels = payload.get("labels")
    if not isinstance(labels, list) or not labels:
        raise ValueError(f"No text measurements for {svg_path}")
    return labels


def reject_overflow(measurements: list, svg_path: Path) -> None:
    overflows = []
    for item in measurements:
        if item.get("error"):
            raise RuntimeError(f"{svg_path.name} text {item.get('text')!r} failed measurement: {item['error']}")
        text_width = item.get("textWidth")
        text_height = item.get("textHeight")
        rect_width = item.get("rectWidth")
        rect_height = item.get("rectHeight")
        if None in (text_width, text_height, rect_width, rect_height):
            raise RuntimeError(f"{svg_path.name} text {item.get('text')!r} is missing box measurements: {item}")
        if text_width > rect_width - 4 or text_height > rect_height - 4:
            overflows.append(
                f"{item.get('text')!r} {text_width:.1f}x{text_height:.1f} in {rect_width:.1f}x{rect_height:.1f}"
            )
    if overflows:
        raise RuntimeError(f"{svg_path.name} text does not fit its box: {overflows}")


def convert_png_to_webp_and_avif(png_path: Path, webp_path: Path, avif_path: Path, log_lines: list) -> None:
    log_lines.append(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] CONVERT: Pillow {png_path.name} -> {webp_path.name}, {avif_path.name}")
    with Image.open(png_path) as image:
        if image.size != (1672, 941):
            raise ValueError(f"Image {png_path} dimension mismatch: expected (1672, 941), got {image.size}")
        rgb_image = image.convert("RGB")
        rgb_image.save(webp_path, "WEBP", quality=95, method=6)
        rgb_image.save(avif_path, "AVIF", quality=90)
    log_lines.append(f"  saved webp: {webp_path.stat().st_size} bytes")
    log_lines.append(f"  saved avif: {avif_path.stat().st_size} bytes")


def verify_generated_image(image_path: Path, expected_format: str) -> dict:
    if not image_path.exists():
        raise FileNotFoundError(f"Generated image does not exist: {image_path}")
    with Image.open(image_path) as image:
        actual_format = image.format.upper()
        actual_size = image.size
    if actual_format != expected_format.upper():
        raise ValueError(f"Format mismatch for {image_path}: expected {expected_format}, got {actual_format}")
    if actual_size != (1672, 941):
        raise ValueError(f"Dimensions mismatch for {image_path}: expected (1672, 941), got {actual_size}")
    return {
        "path": image_path.as_posix(),
        "format": actual_format,
        "width": actual_size[0],
        "height": actual_size[1],
        "byte_size": image_path.stat().st_size,
        "sha256": compute_sha256(image_path),
    }


def write_provenance(figures: list) -> None:
    provenance = {
        "role": "T",
        "locale": "zh-CN",
        "articleSlug": "house-upgrade-stardew",
        "englishBodySha256": ENGLISH_BODY_SHA256,
        "translatedBodySha256": TRANSLATED_BODY_SHA256,
        "fontStack": FONT_STACK,
        "canvas": {"width": 1672, "height": 941},
        "toolchain": {
            "renderingEngine": "ego-browser (Chromium) nodejs CDP Emulation (width: 1672, height: 941, deviceScaleFactor: 1)",
            "converter": f"Pillow {Image.__version__} (libwebp quality 95 method 6, libavif quality 90)",
            "cjkFontsChecked": ["PingFang SC", "Hiragino Sans GB"],
        },
        "englishAssetsUnchanged": True,
        "cjkFit": "upgrade-or-renovation.svg keeps every rect, color, and number. Four labels use a smaller font-size so the full Chinese glyphs sit inside the existing boxes: 装修 72px, 升级2之后/即时/退还金币 64px. Other labels stay at 84px or 88px.",
        "figures": figures,
    }
    path = BASE_DIR / "provenance.json"
    path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def execute_pipeline() -> dict:
    log_lines = [f"=== Chinese media render started at {time.strftime('%Y-%m-%d %H:%M:%S')} ==="]
    log_lines.append(f"Pillow {Image.__version__}")
    assert_english_assets_unchanged()
    log_lines.append("English media hashes matched the locked values before rendering.")
    render_summary = []
    try:
        for spec in FIGURE_SPECS:
            svg_path = BASE_DIR / spec["svg_file"]
            webp_path = BASE_DIR / spec["webp_file"]
            avif_path = BASE_DIR / spec["avif_file"]
            temp_png = TMP_DIR / f"house-upgrade-zh-{spec['id']}.png"
            svg_sha = compute_sha256(svg_path)
            log_lines.append(f"Processing {spec['id']} (SVG SHA256: {svg_sha})")
            render_exit, measurements = render_svg_to_png(svg_path, temp_png, log_lines)
            convert_png_to_webp_and_avif(temp_png, webp_path, avif_path, log_lines)
            webp_meta = verify_generated_image(webp_path, "WEBP")
            avif_meta = verify_generated_image(avif_path, "AVIF")
            png_meta = verify_generated_image(temp_png, "PNG")
            render_summary.append({
                "figure_id": spec["id"],
                "role": spec["role"],
                "publicWebp": spec["public_webp"],
                "publicAvif": spec["public_avif"],
                "svg": {
                    "filename": spec["svg_file"],
                    "sha256": svg_sha,
                    "byte_size": svg_path.stat().st_size,
                },
                "png": png_meta,
                "webp": webp_meta,
                "avif": avif_meta,
                "render_exit_code": render_exit,
                "textMeasurements": measurements,
            })
        assert_english_assets_unchanged()
        log_lines.append("English media hashes matched the locked values after rendering.")
        log_lines.append(f"=== Successfully completed all {len(FIGURE_SPECS)} figures at {time.strftime('%Y-%m-%d %H:%M:%S')} ===")
        write_provenance(render_summary)
        return {"success": True, "figures": render_summary}
    except Exception as exc:
        log_lines.append(f"[FATAL ERROR] {exc}")
        raise
    finally:
        log_file = BASE_DIR / "render.log"
        log_file.write_text("\n".join(log_lines) + "\n", encoding="utf-8")
        print(f"Wrote render log to {log_file}")


if __name__ == "__main__":
    result = execute_pipeline()
    print(json.dumps({"success": result["success"], "figureCount": len(result["figures"])}, indent=2))
