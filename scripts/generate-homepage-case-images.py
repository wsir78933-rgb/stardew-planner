#!/usr/bin/env python3
"""Resize homepage farm-case screenshots and replace them with lossy WebP and AVIF."""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parent.parent
CASE_DIRECTORY = REPOSITORY_ROOT / "public" / "homepage" / "cases"
CASE_COUNT = 12
# Homepage case image at a 1280px viewport is 376.96 CSS px. 376.96 * 2 = 753.92, ceil to even.
TARGET_WIDTH = 754
WEBP_QUALITY = 80
WEBP_METHOD = 6
AVIF_QUALITY = 50
AVIF_SPEED = 6
AVIF_SUBSAMPLING = "4:4:4"
AVIF_CODEC = "aom"
AVIF_MAX_THREADS = 1


def case_stem(index: int) -> str:
    if not isinstance(index, int) or not 1 <= index <= CASE_COUNT:
        raise ValueError(f"Case index must be an int from 1 to {CASE_COUNT}: {index!r}")
    return f"farm-case-{index:02d}"


def case_webp_path(stem: str) -> Path:
    return CASE_DIRECTORY / f"{stem}.webp"


def case_avif_path(stem: str) -> Path:
    return CASE_DIRECTORY / f"{stem}.avif"


def read_webp_is_lossless(path: Path) -> bool:
    data = path.read_bytes()
    if len(data) < 12 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError(f"Expected a WEBP file: {path} (got {data[:12]!r})")

    offset = 12
    saw_lossy_frame = False
    saw_lossless_frame = False
    while offset + 8 <= len(data):
        tag = data[offset : offset + 4]
        size = int.from_bytes(data[offset + 4 : offset + 8], "little")
        if tag == b"VP8L":
            saw_lossless_frame = True
        elif tag == b"VP8 ":
            saw_lossy_frame = True
        offset += 8 + size + (size & 1)

    if saw_lossless_frame == saw_lossy_frame:
        raise ValueError(
            f"{path}: expected exactly one WebP frame type, "
            f"lossless={saw_lossless_frame} lossy={saw_lossy_frame}"
        )
    return saw_lossless_frame


def load_rgb_webp(path: Path) -> tuple[Image.Image, bytes | None]:
    if not path.is_file():
        raise FileNotFoundError(f"Source image is missing: {path}")

    with Image.open(path) as image:
        if image.format != "WEBP":
            raise ValueError(f"Expected WEBP source image: {path} (got {image.format})")
        if image.mode != "RGB":
            raise ValueError(f"Expected RGB source image: {path} (got {image.mode})")
        frame_count = getattr(image, "n_frames", 1)
        if frame_count != 1:
            raise ValueError(f"Expected a single-frame WebP: {path} (got {frame_count} frames)")
        icc_profile = image.info.get("icc_profile")
        if icc_profile is not None and not isinstance(icc_profile, (bytes, bytearray)):
            raise ValueError(
                f"ICC profile must be bytes when present: {path} "
                f"(got {type(icc_profile).__name__})"
            )
        if isinstance(icc_profile, bytearray):
            icc_profile = bytes(icc_profile)
        if isinstance(icc_profile, bytes) and len(icc_profile) == 0:
            raise ValueError(f"ICC profile is empty: {path}")
        rgb_image = image.copy()

    return rgb_image, icc_profile


def display_size(source_width: int, source_height: int, source_path: Path) -> tuple[int, int]:
    if source_width < 1 or source_height < 1:
        raise ValueError(
            f"{source_path}: source size must be positive, got {source_width}x{source_height}"
        )
    if TARGET_WIDTH < 2 or TARGET_WIDTH % 2 != 0:
        raise ValueError(f"Target width must be a positive even int: {TARGET_WIDTH}")
    if TARGET_WIDTH > source_width:
        raise ValueError(
            f"{source_path}: target width {TARGET_WIDTH} exceeds source width {source_width}"
        )
    if TARGET_WIDTH == source_width:
        return source_width, source_height

    exact_height = source_height * TARGET_WIDTH / source_width
    height = round(exact_height)
    if height % 2 == 1:
        lower_even = height - 1
        upper_even = height + 1
        if abs(lower_even - exact_height) < abs(upper_even - exact_height):
            height = lower_even
        else:
            height = upper_even
    if height < 2 or height > source_height:
        raise ValueError(
            f"{source_path}: display height {height} is outside 2..{source_height} "
            f"for {source_width}x{source_height} -> width {TARGET_WIDTH}"
        )
    return TARGET_WIDTH, height


def resize_nearest(image: Image.Image, size: tuple[int, int], source_path: Path) -> Image.Image:
    if image.mode != "RGB":
        raise ValueError(f"{source_path}: resize source must be RGB, got {image.mode}")
    if image.size == size:
        return image.copy()
    if size[0] > image.size[0] or size[1] > image.size[1]:
        raise ValueError(
            f"{source_path}: refusing to upscale {image.size[0]}x{image.size[1]} to {size[0]}x{size[1]}"
        )
    return image.resize(size, resample=Image.Resampling.NEAREST)


def channel_max_abs(left: Image.Image, right: Image.Image, label: str) -> int:
    if left.mode != "RGB" or right.mode != "RGB" or left.size != right.size:
        raise ValueError(
            f"{label}: cannot compare {left.mode} {left.size[0]}x{left.size[1]} "
            f"with {right.mode} {right.size[0]}x{right.size[1]}"
        )

    left_bytes = left.tobytes()
    right_bytes = right.tobytes()
    max_abs = 0
    for index in range(0, len(left_bytes), 3):
        channel_abs = max(
            abs(left_bytes[index] - right_bytes[index]),
            abs(left_bytes[index + 1] - right_bytes[index + 1]),
            abs(left_bytes[index + 2] - right_bytes[index + 2]),
        )
        if channel_abs > max_abs:
            max_abs = channel_abs
    return max_abs


def encode_lossy_webp(image: Image.Image, destination: Path, icc_profile: bytes | None) -> None:
    if not isinstance(WEBP_QUALITY, int) or not 0 <= WEBP_QUALITY <= 100:
        raise ValueError(f"WebP quality must be an int from 0 to 100: {WEBP_QUALITY!r}")
    if not isinstance(WEBP_METHOD, int) or not 0 <= WEBP_METHOD <= 6:
        raise ValueError(f"WebP method must be an int from 0 to 6: {WEBP_METHOD!r}")

    save_arguments: dict[str, object] = {
        "format": "WEBP",
        "lossless": False,
        "quality": WEBP_QUALITY,
        "method": WEBP_METHOD,
    }
    if icc_profile is not None:
        save_arguments["icc_profile"] = icc_profile
    image.save(destination, **save_arguments)


def encode_avif(image: Image.Image, destination: Path, icc_profile: bytes | None) -> None:
    if not isinstance(AVIF_QUALITY, int) or not 0 <= AVIF_QUALITY <= 100:
        raise ValueError(f"AVIF quality must be an int from 0 to 100: {AVIF_QUALITY!r}")
    if AVIF_SUBSAMPLING != "4:4:4":
        raise ValueError(f"AVIF subsampling must be '4:4:4': {AVIF_SUBSAMPLING!r}")
    if not isinstance(AVIF_SPEED, int) or not 0 <= AVIF_SPEED <= 10:
        raise ValueError(f"AVIF speed must be an int from 0 to 10: {AVIF_SPEED!r}")

    save_arguments: dict[str, object] = {
        "format": "AVIF",
        "quality": AVIF_QUALITY,
        "speed": AVIF_SPEED,
        "subsampling": AVIF_SUBSAMPLING,
        "codec": AVIF_CODEC,
        "max_threads": AVIF_MAX_THREADS,
    }
    if icc_profile is not None:
        save_arguments["icc_profile"] = icc_profile
    image.save(destination, **save_arguments)


def require_decoded_size(path: Path, expected_format: str, expected_size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as decoded:
        if decoded.format != expected_format:
            raise ValueError(f"Expected {expected_format} output: {path} (got {decoded.format})")
        decoded_rgb = decoded.convert("RGB")
    if decoded_rgb.size != expected_size:
        raise ValueError(
            f"{path}: decoded size is {decoded_rgb.size[0]}x{decoded_rgb.size[1]}, "
            f"expected {expected_size[0]}x{expected_size[1]}"
        )
    return decoded_rgb


def require_positive_bytes(path: Path) -> int:
    file_bytes = path.stat().st_size
    if file_bytes <= 0:
        raise ValueError(f"{path}: encoded file is empty ({file_bytes} bytes)")
    return file_bytes


def require_smaller_than(path: Path, file_bytes: int, previous_bytes: int, previous_label: str) -> None:
    if file_bytes >= previous_bytes:
        raise ValueError(
            f"{path}: encoded file is {file_bytes} bytes, "
            f"not smaller than {previous_label} at {previous_bytes} bytes"
        )


def publish_encoded_case(
    image: Image.Image,
    webp_destination: Path,
    avif_destination: Path,
    icc_profile: bytes | None,
    previous_webp_bytes: int,
    previous_avif_bytes: int,
) -> tuple[int, int, int]:
    if image.mode != "RGB":
        raise ValueError(
            f"Encoded case image must be RGB: {webp_destination} (got {image.mode})"
        )
    if webp_destination.suffix != ".webp" or avif_destination.suffix != ".avif":
        raise ValueError(
            f"Refusing to write unexpected suffixes: {webp_destination} and {avif_destination}"
        )
    if not webp_destination.parent.is_dir() or not avif_destination.parent.is_dir():
        raise FileNotFoundError(
            f"Output directory is missing: {webp_destination.parent} or {avif_destination.parent}"
        )
    if previous_webp_bytes <= 0 or previous_avif_bytes <= 0:
        raise ValueError(
            f"Previous byte counts must be positive: webp={previous_webp_bytes} avif={previous_avif_bytes}"
        )

    webp_partial = webp_destination.with_name(webp_destination.name + ".partial")
    avif_partial = avif_destination.with_name(avif_destination.name + ".partial")
    for partial_path, destination in (
        (webp_partial, webp_destination),
        (avif_partial, avif_destination),
    ):
        if partial_path.resolve() == destination.resolve():
            raise ValueError(f"Partial path matches the destination: {partial_path}")
        if partial_path.exists():
            partial_path.unlink()

    try:
        encode_lossy_webp(image, webp_partial, icc_profile)
        encode_avif(image, avif_partial, icc_profile)
        webp_bytes = require_positive_bytes(webp_partial)
        avif_bytes = require_positive_bytes(avif_partial)
        decoded_webp = require_decoded_size(webp_partial, "WEBP", image.size)
        decoded_avif = require_decoded_size(avif_partial, "AVIF", image.size)
        require_smaller_than(webp_partial, webp_bytes, previous_webp_bytes, "the previous WebP")
        require_smaller_than(avif_partial, avif_bytes, previous_avif_bytes, "the previous AVIF")
        require_smaller_than(avif_partial, avif_bytes, webp_bytes, f"the new WebP {webp_partial}")
        avif_max_channel_error = channel_max_abs(image, decoded_avif, str(avif_partial))
        decoded_webp.close()
        decoded_avif.close()
        os.replace(webp_partial, webp_destination)
        os.replace(avif_partial, avif_destination)
    finally:
        if webp_partial.exists():
            webp_partial.unlink()
        if avif_partial.exists():
            avif_partial.unlink()

    published_webp_bytes = require_positive_bytes(webp_destination)
    published_avif_bytes = require_positive_bytes(avif_destination)
    if published_webp_bytes != webp_bytes or published_avif_bytes != avif_bytes:
        raise ValueError(
            f"{webp_destination}: published sizes {published_webp_bytes}/{published_avif_bytes} "
            f"do not match encoded sizes {webp_bytes}/{avif_bytes}"
        )
    return published_webp_bytes, published_avif_bytes, avif_max_channel_error


def require_existing_pair(webp_path: Path, avif_path: Path, expected_size: tuple[int, int]) -> None:
    if not avif_path.is_file():
        raise FileNotFoundError(f"AVIF pair is missing: {avif_path}")
    require_decoded_size(webp_path, "WEBP", expected_size)
    require_decoded_size(avif_path, "AVIF", expected_size)
    webp_bytes = require_positive_bytes(webp_path)
    avif_bytes = require_positive_bytes(avif_path)
    require_smaller_than(avif_path, avif_bytes, webp_bytes, f"WebP {webp_path}")


def regenerate_case(stem: str) -> None:
    if stem not in {case_stem(index) for index in range(1, CASE_COUNT + 1)}:
        raise ValueError(f"Unknown case stem: {stem!r}")

    webp_path = case_webp_path(stem)
    avif_path = case_avif_path(stem)
    source_image, icc_profile = load_rgb_webp(webp_path)
    expected_size = display_size(source_image.size[0], source_image.size[1], webp_path)
    source_is_lossless = read_webp_is_lossless(webp_path)

    if source_image.size == expected_size and not source_is_lossless:
        require_existing_pair(webp_path, avif_path, expected_size)
        print(
            f"{stem}: unchanged "
            f"size={expected_size[0]}x{expected_size[1]} "
            f"webp_bytes={webp_path.stat().st_size} "
            f"avif_bytes={avif_path.stat().st_size}"
        )
        return

    if not source_is_lossless:
        raise ValueError(
            f"{webp_path}: lossy WebP is {source_image.size[0]}x{source_image.size[1]}, "
            f"expected a lossless source or an existing {expected_size[0]}x{expected_size[1]} pair"
        )
    if not avif_path.is_file():
        raise FileNotFoundError(f"AVIF pair is missing: {avif_path}")

    previous_webp_bytes = require_positive_bytes(webp_path)
    previous_avif_bytes = require_positive_bytes(avif_path)
    resized = resize_nearest(source_image, expected_size, webp_path)
    webp_bytes, avif_bytes, avif_max_channel_error = publish_encoded_case(
        resized,
        webp_path,
        avif_path,
        icc_profile,
        previous_webp_bytes,
        previous_avif_bytes,
    )
    print(
        f"{stem}: previous_webp_bytes={previous_webp_bytes} "
        f"previous_avif_bytes={previous_avif_bytes} "
        f"webp_bytes={webp_bytes} avif_bytes={avif_bytes} "
        f"avif_max_channel_error={avif_max_channel_error} "
        f"size={expected_size[0]}x{expected_size[1]}"
    )


def main() -> None:
    if not CASE_DIRECTORY.is_dir():
        raise FileNotFoundError(f"Case directory is missing: {CASE_DIRECTORY}")

    print(
        "encoding "
        f"width={TARGET_WIDTH} resample=nearest "
        f"webp=lossy quality:{WEBP_QUALITY} method:{WEBP_METHOD} "
        f"avif=quality:{AVIF_QUALITY} speed:{AVIF_SPEED} "
        f"subsampling:{AVIF_SUBSAMPLING} codec:{AVIF_CODEC} "
        f"max_threads:{AVIF_MAX_THREADS}"
    )
    for index in range(1, CASE_COUNT + 1):
        regenerate_case(case_stem(index))


if __name__ == "__main__":
    main()
