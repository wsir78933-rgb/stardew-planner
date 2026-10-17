#!/usr/bin/env python3
"""
Minimal dedicated rendering recipe for house-upgrade-stardew media production.
Renders editable SVGs via local ego-browser Chromium at 1672x941 and converts to WebP and AVIF.
Strictly follows project contracts: no external downloads, exact dimensions, lossless/high quality.
"""

import hashlib
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from PIL import Image

BASE_DIR = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/house-upgrade-stardew/media-production/en")
WORKSPACE_ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")

FIGURE_SPECS = [
    {
        "id": "cover-payments",
        "svg_file": "cover-payments.svg",
        "webp_file": "house-upgrade-stardew-cover.webp",
        "avif_file": "house-upgrade-stardew-cover.avif",
        "role": "cover",
        "expected_width": 1672,
        "expected_height": 941,
    },
    {
        "id": "tier-rooms",
        "svg_file": "tier-rooms.svg",
        "webp_file": "tier-rooms.en.webp",
        "avif_file": "tier-rooms.en.avif",
        "role": "body",
        "expected_width": 1672,
        "expected_height": 941,
    },
    {
        "id": "upgrade-or-renovation",
        "svg_file": "upgrade-or-renovation.svg",
        "webp_file": "upgrade-or-renovation.en.webp",
        "avif_file": "upgrade-or-renovation.en.avif",
        "role": "body",
        "expected_width": 1672,
        "expected_height": 941,
    },
]


def compute_sha256(file_path: Path) -> str:
    if not file_path.exists():
        raise FileNotFoundError(f"File not found for hash calculation: {file_path}")
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def render_svg_to_png_via_ego_browser(svg_path: Path, png_path: Path, log_lines: list) -> int:
    encoded_url = f"file://{svg_path.as_posix()}"
    script = f"""
const task = await taskSpace("render-figure");
const page = task.page("p1");
await page.cdp("Emulation.setDeviceMetricsOverride", {{
  width: 1672,
  height: 941,
  deviceScaleFactor: 1,
  mobile: false
}});
await page.goto("{encoded_url}");
await page.screenshot({{ path: "{png_path.as_posix()}" }});
await task.finish({{ keep: [] }});
"""
    cmd = ["ego-browser", "nodejs", "-e", script]
    start_time = time.time()
    log_lines.append(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] RUN: ego-browser screenshot {svg_path.name} -> {png_path.name}")
    
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    duration = time.time() - start_time
    log_lines.append(f"  exit_code: {proc.returncode}, duration: {duration:.2f}s")
    if proc.stdout.strip():
        log_lines.append(f"  stdout: {proc.stdout.strip()}")
    if proc.stderr.strip():
        log_lines.append(f"  stderr: {proc.stderr.strip()}")

    if proc.returncode != 0:
        raise RuntimeError(f"ego-browser failed to render {svg_path} with exit code {proc.returncode}: {proc.stderr}")
    if not png_path.exists():
        raise FileNotFoundError(f"Expected rendered PNG missing at {png_path}")
    return proc.returncode


def convert_png_to_webp_and_avif(png_path: Path, webp_path: Path, avif_path: Path, log_lines: list) -> None:
    log_lines.append(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] CONVERT: Pillow {png_path.name} -> {webp_path.name}, {avif_path.name}")
    with Image.open(png_path) as img:
        if img.size != (1672, 941):
            raise ValueError(f"Image {png_path} dimension mismatch: expected (1672, 941), got {img.size}")
        rgb_img = img.convert("RGB")
        # Save WebP (high quality 95)
        rgb_img.save(webp_path, "WEBP", quality=95, method=6)
        # Save AVIF (high quality 90)
        rgb_img.save(avif_path, "AVIF", quality=90)
    
    log_lines.append(f"  saved webp: {webp_path.stat().st_size} bytes")
    log_lines.append(f"  saved avif: {avif_path.stat().st_size} bytes")


def verify_generated_image(image_path: Path, expected_format: str, expected_width: int, expected_height: int) -> dict:
    if not image_path.exists():
        raise FileNotFoundError(f"Generated image does not exist: {image_path}")
    with Image.open(image_path) as img:
        actual_format = img.format.upper()
        actual_size = img.size
    
    if actual_format != expected_format.upper():
        raise ValueError(f"Format mismatch for {image_path}: expected {expected_format}, got {actual_format}")
    if actual_size != (expected_width, expected_height):
        raise ValueError(f"Dimensions mismatch for {image_path}: expected ({expected_width}, {expected_height}), got {actual_size}")
    
    file_stat = image_path.stat()
    return {
        "path": image_path.as_posix(),
        "format": actual_format,
        "width": actual_size[0],
        "height": actual_size[1],
        "byte_size": file_stat.st_size,
        "sha256": compute_sha256(image_path),
    }


def execute_pipeline() -> dict:
    log_lines = [f"=== Media Production Render Execution Started at {time.strftime('%Y-%m-%d %H:%M:%S')} ==="]
    intermediate_pngs = []
    render_summary = []

    try:
        for spec in FIGURE_SPECS:
            svg_path = BASE_DIR / spec["svg_file"]
            webp_path = BASE_DIR / spec["webp_file"]
            avif_path = BASE_DIR / spec["avif_file"]
            temp_png = BASE_DIR / f"_temp_{spec['id']}.png"
            intermediate_pngs.append(temp_png)

            svg_sha = compute_sha256(svg_path)
            log_lines.append(f"Processing {spec['id']} (SVG SHA256: {svg_sha})")

            # 1. Render SVG to PNG via ego-browser
            render_exit = render_svg_to_png_via_ego_browser(svg_path, temp_png, log_lines)

            # 2. Convert PNG to WebP and AVIF
            convert_png_to_webp_and_avif(temp_png, webp_path, avif_path, log_lines)

            # 3. Verify outputs
            webp_meta = verify_generated_image(webp_path, "WEBP", spec["expected_width"], spec["expected_height"])
            avif_meta = verify_generated_image(avif_path, "AVIF", spec["expected_width"], spec["expected_height"])

            render_summary.append({
                "figure_id": spec["id"],
                "role": spec["role"],
                "svg": {
                    "filename": spec["svg_file"],
                    "sha256": svg_sha,
                    "byte_size": svg_path.stat().st_size,
                },
                "webp": webp_meta,
                "avif": avif_meta,
                "render_exit_code": render_exit,
            })

        log_lines.append(f"=== Successfully completed all {len(FIGURE_SPECS)} figures at {time.strftime('%Y-%m-%d %H:%M:%S')} ===")
        success = True
    except Exception as exc:
        log_lines.append(f"[FATAL ERROR] {exc}")
        success = False
        raise
    finally:
        # Clean up temporary PNG files
        for p in intermediate_pngs:
            if p.exists():
                try:
                    p.unlink()
                except OSError:
                    pass
        # Write render.log
        log_file = BASE_DIR / "render.log"
        with open(log_file, "w", encoding="utf-8") as f:
            f.write("\n".join(log_lines) + "\n")
        print(f"Wrote render log to {log_file}")

    return {
        "success": success,
        "figures": render_summary,
    }


if __name__ == "__main__":
    result = execute_pipeline()
    print(json.dumps(result, indent=2))
