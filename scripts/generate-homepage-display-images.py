#!/usr/bin/env python3
"""Derive phone hero images and the what-is overview without touching sources."""

from __future__ import annotations

import hashlib
import os
from pathlib import Path

from PIL import Image


REPOSITORY_ROOT = Path(__file__).resolve().parent.parent
HERO_DIRECTORY = REPOSITORY_ROOT / "public" / "homepage" / "hero"
OVERVIEW_DIRECTORY = REPOSITORY_ROOT / "public" / "homepage" / "what-is"

HERO_SOURCE_WIDTH = 864
HERO_SOURCE_HEIGHT = 1152
HERO_DISPLAY_WIDTH = 480
HERO_DISPLAY_HEIGHT = 640
OVERVIEW_WIDTH = 1076
OVERVIEW_HEIGHT = 788
HERO_FILE_STEMS = ("spring-crops", "beach-farm", "forest-farm")

WEBP_QUALITY = 80
WEBP_METHOD = 6
AVIF_QUALITY = 50
AVIF_SPEED = 6
AVIF_SUBSAMPLING = "4:4:4"
AVIF_CODEC = "aom"
AVIF_MAX_THREADS = 1
# Max channel error stays about 170-200 from AVIF q40 4:2:0 through WebP q95 on
# these pixel-art screenshots, so it cannot reject a softer encode. Mean absolute
# channel error can. beach-farm-480 at the settings above measured 13.344 (WebP q80)
# and 14.614 (AVIF q50 4:4:4). The next softer AVIF candidates measured 16.051
# (q45 4:4:4) and 16.645 (q50 4:2:0). 15.5 sits in that gap. The other three
# outputs measured lower: spring-crops AVIF 13.981, forest-farm AVIF 10.392,
# overview AVIF 4.562. WebP q80 is the size knee on beach-farm-480: 152634 bytes
# versus 201654 at q90, while mean only moved from 13.344 to 12.718.
MEAN_CHANNEL_ERROR_CEILING = 15.5


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_rgb_image(
    path: Path,
    expected_format: str,
    expected_size: tuple[int, int],
) -> tuple[Image.Image, bytes | None]:
    if not path.is_file():
        raise FileNotFoundError(f"Source image is missing: {path}")

    with Image.open(path) as image:
        if image.format != expected_format:
            raise ValueError(
                f"Expected {expected_format} source image: {path} (got {image.format})"
            )
        if image.mode != "RGB":
            raise ValueError(f"Expected RGB source image: {path} (got {image.mode})")
        if image.size != expected_size:
            raise ValueError(
                f"Expected {expected_size[0]}x{expected_size[1]} source image: {path} "
                f"(got {image.size[0]}x{image.size[1]})"
            )
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


def resize_hero_nearest(hero_image: Image.Image, source_path: Path) -> Image.Image:
    if hero_image.size != (HERO_SOURCE_WIDTH, HERO_SOURCE_HEIGHT):
        raise ValueError(
            f"Hero resize source must be {HERO_SOURCE_WIDTH}x{HERO_SOURCE_HEIGHT}: "
            f"{source_path} (got {hero_image.size[0]}x{hero_image.size[1]})"
        )
    if HERO_DISPLAY_WIDTH * 4 != HERO_DISPLAY_HEIGHT * 3:
        raise ValueError(
            f"Hero display size must stay 3:4: "
            f"{HERO_DISPLAY_WIDTH}x{HERO_DISPLAY_HEIGHT}"
        )
    return hero_image.resize(
        (HERO_DISPLAY_WIDTH, HERO_DISPLAY_HEIGHT),
        resample=Image.Resampling.NEAREST,
    )


def channel_error_stats(
    left: Image.Image, right: Image.Image, label: str
) -> tuple[int, float]:
    if left.mode != "RGB" or right.mode != "RGB" or left.size != right.size:
        raise ValueError(
            f"{label}: cannot compare {left.mode} {left.size[0]}x{left.size[1]} "
            f"with {right.mode} {right.size[0]}x{right.size[1]}"
        )

    left_bytes = left.tobytes()
    right_bytes = right.tobytes()
    if len(left_bytes) == 0 or len(left_bytes) % 3 != 0:
        raise ValueError(f"{label}: RGB byte length must be a positive multiple of 3: {len(left_bytes)}")
    if len(left_bytes) != len(right_bytes):
        raise ValueError(
            f"{label}: RGB byte length {len(left_bytes)} != {len(right_bytes)}"
        )

    max_abs = 0
    total_abs = 0
    for index in range(len(left_bytes)):
        channel_abs = abs(left_bytes[index] - right_bytes[index])
        total_abs += channel_abs
        if channel_abs > max_abs:
            max_abs = channel_abs
    return max_abs, total_abs / len(left_bytes)


def replace_encoded_image(
    image: Image.Image,
    destination: Path,
    save_arguments: dict[str, object],
) -> None:
    if destination.suffix not in {".webp", ".avif"}:
        raise ValueError(f"Refusing to write unexpected suffix: {destination}")
    if not destination.parent.is_dir():
        raise FileNotFoundError(f"Output directory is missing: {destination.parent}")

    partial_path = destination.with_name(destination.name + ".partial")
    if partial_path.resolve() == destination.resolve():
        raise ValueError(f"Partial path matches the destination: {partial_path}")
    if partial_path.exists():
        partial_path.unlink()

    try:
        image.save(partial_path, **save_arguments)
        os.replace(partial_path, destination)
    finally:
        if partial_path.exists():
            partial_path.unlink()


def encode_webp(
    image: Image.Image,
    destination: Path,
    icc_profile: bytes | None,
) -> None:
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
    replace_encoded_image(image, destination, save_arguments)


def encode_avif(
    image: Image.Image,
    destination: Path,
    icc_profile: bytes | None,
) -> None:
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
    replace_encoded_image(image, destination, save_arguments)


def require_same_icc(path: Path, icc_profile: bytes | None) -> None:
    with Image.open(path) as image:
        decoded_icc = image.info.get("icc_profile")
    if icc_profile is None:
        if decoded_icc not in (None, b""):
            raise ValueError(f"{path}: unexpected ICC profile on an untagged image")
        return
    if decoded_icc != icc_profile:
        raise ValueError(
            f"{path}: ICC profile was not preserved "
            f"(source {len(icc_profile)} bytes, decoded {0 if decoded_icc is None else len(decoded_icc)} bytes)"
        )


def require_encoded_image(
    path: Path,
    expected_format: str,
    reference: Image.Image,
    expected_size: tuple[int, int],
    icc_profile: bytes | None,
) -> tuple[int, float]:
    if not isinstance(MEAN_CHANNEL_ERROR_CEILING, (int, float)) or MEAN_CHANNEL_ERROR_CEILING < 0:
        raise ValueError(
            f"Mean channel error ceiling must be a non-negative number: {MEAN_CHANNEL_ERROR_CEILING!r}"
        )
    with Image.open(path) as decoded:
        if decoded.format != expected_format:
            raise ValueError(f"Expected {expected_format} output: {path} (got {decoded.format})")
        decoded_rgb = decoded.convert("RGB")
    if decoded_rgb.size != expected_size:
        raise ValueError(
            f"{path}: {expected_format} size is {decoded_rgb.size[0]}x{decoded_rgb.size[1]}, "
            f"expected {expected_size[0]}x{expected_size[1]}"
        )
    max_abs, mean_abs = channel_error_stats(reference, decoded_rgb, str(path))
    if mean_abs > MEAN_CHANNEL_ERROR_CEILING:
        raise ValueError(
            f"{path}: mean channel error is {mean_abs:.4f}, "
            f"ceiling is {MEAN_CHANNEL_ERROR_CEILING}"
        )
    require_same_icc(path, icc_profile)
    return max_abs, mean_abs


def require_smaller_file(derived_path: Path, compared_path: Path) -> None:
    derived_bytes = derived_path.stat().st_size
    compared_bytes = compared_path.stat().st_size
    if derived_bytes <= 0:
        raise ValueError(f"{derived_path}: encoded file is empty ({derived_bytes} bytes)")
    if derived_bytes >= compared_bytes:
        raise ValueError(
            f"{derived_path}: encoded file is {derived_bytes} bytes, "
            f"not smaller than {compared_path} at {compared_bytes} bytes"
        )


def require_source_unchanged(path: Path, source_sha256: str) -> None:
    current_sha256 = sha256_file(path)
    if current_sha256 != source_sha256:
        raise ValueError(
            f"{path}: source SHA-256 changed from {source_sha256} to {current_sha256}"
        )


def derive_hero_display(stem: str) -> None:
    if stem not in HERO_FILE_STEMS:
        raise ValueError(f"Unknown hero stem: {stem!r}")

    source_path = HERO_DIRECTORY / f"{stem}.webp"
    webp_path = HERO_DIRECTORY / f"{stem}-480.webp"
    avif_path = HERO_DIRECTORY / f"{stem}-480.avif"
    if webp_path.resolve() == source_path.resolve() or avif_path.resolve() == source_path.resolve():
        raise ValueError(f"Hero output path collides with the source: {source_path}")

    source_sha256 = sha256_file(source_path)
    hero_image, icc_profile = load_rgb_image(
        source_path,
        "WEBP",
        (HERO_SOURCE_WIDTH, HERO_SOURCE_HEIGHT),
    )
    display_hero = resize_hero_nearest(hero_image, source_path)
    encode_webp(display_hero, webp_path, icc_profile)
    encode_avif(display_hero, avif_path, icc_profile)
    webp_max_abs, webp_mean_abs = require_encoded_image(
        webp_path,
        "WEBP",
        display_hero,
        (HERO_DISPLAY_WIDTH, HERO_DISPLAY_HEIGHT),
        icc_profile,
    )
    avif_max_abs, avif_mean_abs = require_encoded_image(
        avif_path,
        "AVIF",
        display_hero,
        (HERO_DISPLAY_WIDTH, HERO_DISPLAY_HEIGHT),
        icc_profile,
    )
    require_smaller_file(webp_path, source_path)
    require_smaller_file(avif_path, webp_path)
    require_source_unchanged(source_path, source_sha256)
    print(
        f"{stem}: source_sha256={source_sha256} "
        f"webp_bytes={webp_path.stat().st_size} "
        f"avif_bytes={avif_path.stat().st_size} "
        f"webp_mean_channel_error={webp_mean_abs:.4f} "
        f"webp_max_channel_error={webp_max_abs} "
        f"avif_mean_channel_error={avif_mean_abs:.4f} "
        f"avif_max_channel_error={avif_max_abs} "
        f"size={HERO_DISPLAY_WIDTH}x{HERO_DISPLAY_HEIGHT}"
    )


def derive_overview_display() -> None:
    source_path = OVERVIEW_DIRECTORY / "farm-layout-overview.png"
    webp_path = OVERVIEW_DIRECTORY / "farm-layout-overview.webp"
    avif_path = OVERVIEW_DIRECTORY / "farm-layout-overview.avif"
    if webp_path.resolve() == source_path.resolve() or avif_path.resolve() == source_path.resolve():
        raise ValueError(f"Overview output path collides with the source: {source_path}")

    source_sha256 = sha256_file(source_path)
    overview_image, icc_profile = load_rgb_image(
        source_path,
        "PNG",
        (OVERVIEW_WIDTH, OVERVIEW_HEIGHT),
    )
    if icc_profile is None:
        raise ValueError(f"Overview PNG is missing its ICC profile: {source_path}")

    encode_webp(overview_image, webp_path, icc_profile)
    encode_avif(overview_image, avif_path, icc_profile)
    webp_max_abs, webp_mean_abs = require_encoded_image(
        webp_path,
        "WEBP",
        overview_image,
        (OVERVIEW_WIDTH, OVERVIEW_HEIGHT),
        icc_profile,
    )
    avif_max_abs, avif_mean_abs = require_encoded_image(
        avif_path,
        "AVIF",
        overview_image,
        (OVERVIEW_WIDTH, OVERVIEW_HEIGHT),
        icc_profile,
    )
    require_smaller_file(webp_path, source_path)
    require_smaller_file(avif_path, webp_path)
    require_source_unchanged(source_path, source_sha256)
    print(
        f"farm-layout-overview: source_sha256={source_sha256} "
        f"webp_bytes={webp_path.stat().st_size} "
        f"avif_bytes={avif_path.stat().st_size} "
        f"webp_mean_channel_error={webp_mean_abs:.4f} "
        f"webp_max_channel_error={webp_max_abs} "
        f"avif_mean_channel_error={avif_mean_abs:.4f} "
        f"avif_max_channel_error={avif_max_abs} "
        f"size={OVERVIEW_WIDTH}x{OVERVIEW_HEIGHT}"
    )


def main() -> None:
    if not HERO_DIRECTORY.is_dir():
        raise FileNotFoundError(f"Hero directory is missing: {HERO_DIRECTORY}")
    if not OVERVIEW_DIRECTORY.is_dir():
        raise FileNotFoundError(f"Overview directory is missing: {OVERVIEW_DIRECTORY}")

    print(
        "encoding "
        f"hero={HERO_DISPLAY_WIDTH}x{HERO_DISPLAY_HEIGHT} resample=nearest "
        f"webp=lossy quality:{WEBP_QUALITY} method:{WEBP_METHOD} "
        f"avif=quality:{AVIF_QUALITY} speed:{AVIF_SPEED} "
        f"subsampling:{AVIF_SUBSAMPLING} codec:{AVIF_CODEC} "
        f"max_threads:{AVIF_MAX_THREADS} "
        f"mean_channel_error_ceiling:{MEAN_CHANNEL_ERROR_CEILING}"
    )
    for stem in HERO_FILE_STEMS:
        derive_hero_display(stem)
    derive_overview_display()


if __name__ == "__main__":
    main()
