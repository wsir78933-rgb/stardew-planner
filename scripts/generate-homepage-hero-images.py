#!/usr/bin/env python3
"""Compose the homepage hero farms without redrawing any source pixels."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


TARGET_WIDTH = 864
TARGET_HEIGHT = 1152
WATERMARK_TOP = 1323
TARGET_ASPECT_WIDTH = 3
TARGET_ASPECT_HEIGHT = 4


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--left-source", type=Path, required=True)
    parser.add_argument("--center-source", type=Path, required=True)
    parser.add_argument("--right-source", type=Path, required=True)
    parser.add_argument(
        "--output-dir", type=Path, default=Path("public/homepage/hero")
    )
    return parser.parse_args()


def load_rgb(path: Path) -> Image.Image:
    with Image.open(path) as image:
        if image.mode != "RGB":
            raise ValueError(f"Expected RGB source image: {path} (got {image.mode})")
        return image.copy()


def crop_to_target_aspect(image: Image.Image, source_path: Path) -> Image.Image:
    source_width, source_height = image.size
    target_ratio = TARGET_ASPECT_WIDTH / TARGET_ASPECT_HEIGHT
    source_ratio = source_width / source_height

    if source_ratio > target_ratio:
        crop_height = (source_height // TARGET_ASPECT_HEIGHT) * TARGET_ASPECT_HEIGHT
        crop_width = (crop_height // TARGET_ASPECT_HEIGHT) * TARGET_ASPECT_WIDTH
    else:
        crop_width = (source_width // TARGET_ASPECT_WIDTH) * TARGET_ASPECT_WIDTH
        crop_height = (crop_width // TARGET_ASPECT_WIDTH) * TARGET_ASPECT_HEIGHT

    if crop_width <= 0 or crop_height <= 0:
        raise ValueError(
            f"Source is too small to crop to {TARGET_ASPECT_WIDTH}:{TARGET_ASPECT_HEIGHT}: "
            f"{source_path} ({source_width}x{source_height})"
        )

    left = (source_width - crop_width) // 2
    top = (source_height - crop_height) // 2
    return image.crop((left, top, left + crop_width, top + crop_height))


def compose_farm(source_path: Path, output_path: Path, crop_bottom: int | None) -> None:
    source = load_rgb(source_path)
    if crop_bottom is not None:
        if crop_bottom <= 0 or crop_bottom >= source.height:
            raise ValueError(
                f"Invalid watermark crop for {source_path}: "
                f"crop_bottom={crop_bottom}, source_height={source.height}"
            )
        source = source.crop((0, 0, source.width, crop_bottom))

    cropped = crop_to_target_aspect(source, source_path)
    farm = cropped.resize(
        (TARGET_WIDTH, TARGET_HEIGHT), resample=Image.Resampling.NEAREST
    )
    farm.save(output_path, format="WEBP", lossless=True, method=6)
    print(
        f"{output_path}: source={source.width}x{source.height}, "
        f"crop={cropped.width}x{cropped.height}, output={farm.width}x{farm.height}"
    )


def main() -> None:
    args = parse_args()
    output_dir = args.output_dir
    compose_farm(
        args.left_source,
        output_dir / "spring-crops.webp",
        crop_bottom=None,
    )
    compose_farm(
        args.center_source,
        output_dir / "beach-farm.webp",
        crop_bottom=WATERMARK_TOP,
    )
    compose_farm(
        args.right_source,
        output_dir / "forest-farm.webp",
        crop_bottom=None,
    )


if __name__ == "__main__":
    main()
