#!/usr/bin/env python3
"""Verify homepage hero dimensions and exact unmodified farm pixels."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops


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
        raise AssertionError(
            f"Source is too small to crop to {TARGET_ASPECT_WIDTH}:{TARGET_ASPECT_HEIGHT}: "
            f"{source_path} ({source_width}x{source_height})"
        )

    left = (source_width - crop_width) // 2
    top = (source_height - crop_height) // 2
    return image.crop((left, top, left + crop_width, top + crop_height))


def expected_farm(source_path: Path, crop_bottom: int | None) -> Image.Image:
    source = load_rgb(source_path)
    if crop_bottom is not None:
        if crop_bottom <= 0 or crop_bottom >= source.height:
            raise ValueError(
                f"Invalid watermark crop for {source_path}: "
                f"crop_bottom={crop_bottom}, source_height={source.height}"
            )
        source = source.crop((0, 0, source.width, crop_bottom))
    cropped = crop_to_target_aspect(source, source_path)
    return cropped.resize(
        (TARGET_WIDTH, TARGET_HEIGHT), resample=Image.Resampling.NEAREST
    )


def exact_pixels(left: Image.Image, right: Image.Image) -> bool:
    return ImageChops.difference(left, right).getbbox() is None


def verify_one(
    label: str,
    source_path: Path,
    output_path: Path,
    crop_bottom: int | None,
) -> None:
    farm = expected_farm(source_path, crop_bottom)
    with Image.open(output_path) as output_image:
        output = output_image.convert("RGB")
    if output.size != (TARGET_WIDTH, TARGET_HEIGHT):
        raise AssertionError(
            f"{label}: output size is {output.size}, expected "
            f"{TARGET_WIDTH}x{TARGET_HEIGHT}"
        )
    matches = exact_pixels(farm, output)
    print(
        f"{label}: array_equal={matches} output={output.size[0]}x{output.size[1]} "
        f"cropped_farm={farm.size[0]}x{farm.size[1]}"
    )
    if not matches:
        raise AssertionError(f"{label}: cropped farm pixels changed")


def main() -> None:
    args = parse_args()
    output_dir = args.output_dir
    verify_one(
        "left/spring-crops",
        args.left_source,
        output_dir / "spring-crops.webp",
        crop_bottom=None,
    )
    verify_one(
        "center/beach-farm",
        args.center_source,
        output_dir / "beach-farm.webp",
        crop_bottom=WATERMARK_TOP,
    )
    verify_one(
        "right/forest-farm",
        args.right_source,
        output_dir / "forest-farm.webp",
        crop_bottom=None,
    )
    print("All 3 homepage hero image checks passed.")


if __name__ == "__main__":
    main()
