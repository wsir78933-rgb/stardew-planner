#!/usr/bin/env python3
"""Render the front-facing male farmer walk strip for the planner loading screen."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parents[1]
FARMER_ASSET_DIR = REPO_ROOT / "public/game-assets/1.6.15/farmer"
BODY_ATLAS_PATH = FARMER_ASSET_DIR / "farmer_base_mannequin.png"
SHIRTS_ATLAS_PATH = FARMER_ASSET_DIR / "shirts.png"
PANTS_ATLAS_PATH = FARMER_ASSET_DIR / "pants.png"
STRIP_OUTPUT_PATH = REPO_ROOT / "public/homepage/loading/male-farmer-strip.png"

BODY_ATLAS_SIZE = (288, 672)
SHIRTS_ATLAS_SIZE = (256, 608)
PANTS_ATLAS_SIZE = (1920, 1376)
FARMER_CANVAS_SIZE = (16, 32)
SCALED_FRAME_SIZE = (48, 96)
FRONT_ROW_COLUMN_INDEXES = (0, 1, 0, 2)
FRONT_ROW_Y = 0
ARMS_X_SHIFT = 96
STRIP_SIZE = (SCALED_FRAME_SIZE[0] * len(FRONT_ROW_COLUMN_INDEXES), SCALED_FRAME_SIZE[1])

PANTS_SPRITE_INDEX = 0
PANTS_SPRITES_PER_ROW = 10
PANTS_SPRITE_STRIDE = 192
PANTS_SPRITE_ROW_STRIDE = 688
MALE_PANTS_X_SHIFT = 0
PANTS_TINT_RGB = (255, 235, 203)

SHIRT_SPRITE_INDEX = 0
SHIRT_UNDYED_ATLAS_WIDTH = 128
SHIRT_FRAME_SIZE = (8, 8)
FRONT_SHIRT_ROW_OFFSET = 0
SHIRT_PASTE_OFFSET = (4, 15)


def load_rgba_source(path: Path, expected_size: tuple[int, int]) -> Image.Image:
    if not path.is_file():
        raise FileNotFoundError(
            f"Source file is missing: {path} expected_size={expected_size[0]}x{expected_size[1]}."
        )
    with Image.open(path) as opened:
        actual_width, actual_height = opened.size
        if opened.size != expected_size:
            raise ValueError(
                f"Source size mismatch for {path}: expected {expected_size[0]}x{expected_size[1]}, "
                f"received {actual_width}x{actual_height}."
            )
        if opened.mode != "RGBA":
            raise ValueError(
                f"Source mode mismatch for {path}: expected RGBA, received {opened.mode} "
                f"size {actual_width}x{actual_height}."
            )
        return opened.copy()


def count_opaque_pixels(image: Image.Image) -> int:
    alpha_bytes = image.getchannel("A").tobytes()
    return sum(1 for alpha in alpha_bytes if alpha > 0)


def crop_opaque_frame(image: Image.Image, box: tuple[int, int, int, int], source_path: Path) -> Image.Image:
    left, top, right, bottom = box
    source_width, source_height = image.size
    if left < 0 or top < 0 or right > source_width or bottom > source_height or right <= left or bottom <= top:
        raise ValueError(
            f"Crop box {box} is outside {source_path} size {source_width}x{source_height}."
        )
    frame = image.crop(box)
    opaque_pixel_count = count_opaque_pixels(frame)
    frame_width, frame_height = frame.size
    if opaque_pixel_count == 0:
        raise ValueError(
            f"Crop is fully transparent: {source_path} box={box} "
            f"opaque_pixel_count={opaque_pixel_count} size={frame_width}x{frame_height}."
        )
    return frame


def scale_color_channel(channel: int, tint_channel: int) -> int:
    return round(channel * tint_channel / 255)


def tint_pants_frame(pants_frame: Image.Image, tint_rgb: tuple[int, int, int]) -> Image.Image:
    tinted = pants_frame.copy()
    pixels = tinted.load()
    if pixels is None:
        frame_width, frame_height = tinted.size
        raise RuntimeError(
            f"Pants frame pixel access failed: size={frame_width}x{frame_height} mode={tinted.mode}."
        )
    frame_width, frame_height = tinted.size
    tint_red, tint_green, tint_blue = tint_rgb
    for y in range(frame_height):
        for x in range(frame_width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            pixels[x, y] = (
                scale_color_channel(red, tint_red),
                scale_color_channel(green, tint_green),
                scale_color_channel(blue, tint_blue),
                alpha,
            )
    return tinted


def place_shirt_layer(
    shirt_frame: Image.Image,
    canvas_size: tuple[int, int],
    paste_offset: tuple[int, int],
) -> Image.Image:
    offset_x, offset_y = paste_offset
    frame_width, frame_height = shirt_frame.size
    canvas_width, canvas_height = canvas_size
    if (
        offset_x < 0
        or offset_y < 0
        or offset_x + frame_width > canvas_width
        or offset_y + frame_height > canvas_height
    ):
        raise ValueError(
            f"Shirt frame {frame_width}x{frame_height} at {paste_offset} "
            f"does not fit canvas {canvas_width}x{canvas_height}."
        )
    layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    layer.paste(shirt_frame, paste_offset)
    return layer


def composite_layers(layers: list[Image.Image], canvas_size: tuple[int, int]) -> Image.Image:
    layer_count = len(layers)
    if layer_count == 0:
        raise ValueError(
            f"Cannot composite farmer layers: layer_count={layer_count} "
            f"canvas={canvas_size[0]}x{canvas_size[1]}."
        )
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    for layer_index, layer in enumerate(layers):
        layer_width, layer_height = layer.size
        if layer.size != canvas_size:
            raise ValueError(
                f"Farmer layer {layer_index} size is {layer_width}x{layer_height}; "
                f"expected {canvas_size[0]}x{canvas_size[1]}."
            )
        if layer.mode != "RGBA":
            raise ValueError(
                f"Farmer layer {layer_index} mode is {layer.mode}; "
                f"expected RGBA size {layer_width}x{layer_height}."
            )
        canvas = Image.alpha_composite(canvas, layer)
    return canvas


def require_front_row_column_index(column_index: int) -> int:
    if isinstance(column_index, bool) or not isinstance(column_index, int) or column_index < 0:
        raise ValueError(
            f"Front-row column index must be a non-negative integer; received {column_index!r}."
        )
    return column_index


def front_row_body_box(column_index: int) -> tuple[int, int, int, int]:
    checked_column_index = require_front_row_column_index(column_index)
    frame_width, frame_height = FARMER_CANVAS_SIZE
    left = checked_column_index * frame_width
    top = FRONT_ROW_Y
    return (left, top, left + frame_width, top + frame_height)


def arms_box_for_body_box(body_box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    left, top, right, bottom = body_box
    return (left + ARMS_X_SHIFT, top, right + ARMS_X_SHIFT, bottom)


def pants_frame_box(column_index: int) -> tuple[int, int, int, int]:
    body_left, body_top, _body_right, _body_bottom = front_row_body_box(column_index)
    frame_width, frame_height = FARMER_CANVAS_SIZE
    left = (
        body_left
        + (PANTS_SPRITE_INDEX % PANTS_SPRITES_PER_ROW) * PANTS_SPRITE_STRIDE
        + MALE_PANTS_X_SHIFT
    )
    top = body_top + (PANTS_SPRITE_INDEX // PANTS_SPRITES_PER_ROW) * PANTS_SPRITE_ROW_STRIDE
    return (left, top, left + frame_width, top + frame_height)


def shirt_frame_box() -> tuple[int, int, int, int]:
    shirt_width, shirt_height = SHIRT_FRAME_SIZE
    left = SHIRT_SPRITE_INDEX * shirt_width % SHIRT_UNDYED_ATLAS_WIDTH
    top = (
        (SHIRT_SPRITE_INDEX * shirt_width // SHIRT_UNDYED_ATLAS_WIDTH) * FARMER_CANVAS_SIZE[1]
        + FRONT_SHIRT_ROW_OFFSET
    )
    return (left, top, left + shirt_width, top + shirt_height)


def composite_front_row_frame(
    body_atlas: Image.Image,
    pants_atlas: Image.Image,
    shirts_atlas: Image.Image,
    column_index: int,
) -> Image.Image:
    checked_column_index = require_front_row_column_index(column_index)
    body_box = front_row_body_box(checked_column_index)
    body_frame = crop_opaque_frame(body_atlas, body_box, BODY_ATLAS_PATH)
    tinted_pants = tint_pants_frame(
        crop_opaque_frame(pants_atlas, pants_frame_box(checked_column_index), PANTS_ATLAS_PATH),
        PANTS_TINT_RGB,
    )
    shirt_layer = place_shirt_layer(
        crop_opaque_frame(shirts_atlas, shirt_frame_box(), SHIRTS_ATLAS_PATH),
        FARMER_CANVAS_SIZE,
        SHIRT_PASTE_OFFSET,
    )
    arms_frame = crop_opaque_frame(body_atlas, arms_box_for_body_box(body_box), BODY_ATLAS_PATH)
    return composite_layers(
        [body_frame, tinted_pants, shirt_layer, arms_frame],
        FARMER_CANVAS_SIZE,
    )


def composite_front_row_frames(
    body_atlas: Image.Image,
    pants_atlas: Image.Image,
    shirts_atlas: Image.Image,
) -> list[Image.Image]:
    return [
        composite_front_row_frame(body_atlas, pants_atlas, shirts_atlas, column_index)
        for column_index in FRONT_ROW_COLUMN_INDEXES
    ]


def front_frame_opaque_counts(frames: list[Image.Image]) -> list[int]:
    frame_count = len(frames)
    column_count = len(FRONT_ROW_COLUMN_INDEXES)
    if frame_count != column_count:
        raise ValueError(
            f"Front-row frame count must be {column_count}; received {frame_count}."
        )
    opaque_counts: list[int] = []
    for frame, column_index in zip(frames, FRONT_ROW_COLUMN_INDEXES):
        opaque_count = count_opaque_pixels(frame)
        if opaque_count == 0:
            raise ValueError(
                f"Front-row farmer frame has zero opaque pixels: "
                f"column_index={column_index} opaque_count={opaque_count}."
            )
        opaque_counts.append(opaque_count)
    return opaque_counts


def scale_frame_nearest(frame: Image.Image) -> Image.Image:
    frame_width, frame_height = frame.size
    if frame.size != FARMER_CANVAS_SIZE:
        raise ValueError(
            f"Cannot scale farmer frame: expected {FARMER_CANVAS_SIZE[0]}x{FARMER_CANVAS_SIZE[1]}, "
            f"received {frame_width}x{frame_height}."
        )
    if frame.mode != "RGBA":
        raise ValueError(
            f"Cannot scale farmer frame: expected RGBA, received {frame.mode} "
            f"size {frame_width}x{frame_height}."
        )
    return frame.resize(SCALED_FRAME_SIZE, Image.Resampling.NEAREST)


def scale_front_frames(frames: list[Image.Image]) -> list[Image.Image]:
    frame_count = len(frames)
    expected_count = len(FRONT_ROW_COLUMN_INDEXES)
    if frame_count != expected_count:
        raise ValueError(
            f"Cannot scale front-row frames: expected {expected_count} frames, received {frame_count}."
        )
    return [scale_frame_nearest(frame) for frame in frames]


def pack_frames_left_to_right(frames: list[Image.Image]) -> Image.Image:
    frame_count = len(frames)
    expected_count = len(FRONT_ROW_COLUMN_INDEXES)
    if frame_count != expected_count:
        raise ValueError(
            f"Farmer strip frame count must be {expected_count}; received {frame_count}."
        )
    strip_width, strip_height = STRIP_SIZE
    expected_width = SCALED_FRAME_SIZE[0] * frame_count
    expected_height = SCALED_FRAME_SIZE[1]
    if strip_width != expected_width or strip_height != expected_height:
        raise ValueError(
            f"Farmer strip size must be {expected_width}x{expected_height}; "
            f"received {strip_width}x{strip_height}."
        )
    strip = Image.new("RGBA", STRIP_SIZE, (0, 0, 0, 0))
    for frame_index, frame in enumerate(frames):
        frame_width, frame_height = frame.size
        if frame.size != SCALED_FRAME_SIZE:
            raise ValueError(
                f"Scaled farmer frame {frame_index} size is {frame_width}x{frame_height}; "
                f"expected {SCALED_FRAME_SIZE[0]}x{SCALED_FRAME_SIZE[1]}."
            )
        if frame.mode != "RGBA":
            raise ValueError(
                f"Scaled farmer frame {frame_index} mode is {frame.mode}; "
                f"expected RGBA size {frame_width}x{frame_height}."
            )
        placed = Image.new("RGBA", STRIP_SIZE, (0, 0, 0, 0))
        placed.paste(frame, (frame_index * SCALED_FRAME_SIZE[0], 0))
        strip = Image.alpha_composite(strip, placed)
    return strip


def save_rgba_png(image: Image.Image, output_path: Path, expected_size: tuple[int, int]) -> None:
    image_width, image_height = image.size
    expected_width, expected_height = expected_size
    if image.size != expected_size:
        raise ValueError(
            f"Output size mismatch for {output_path}: expected {expected_width}x{expected_height}, "
            f"received {image_width}x{image_height}."
        )
    if image.mode != "RGBA":
        raise ValueError(
            f"Output mode mismatch for {output_path}: expected RGBA, received {image.mode} "
            f"size {image_width}x{image_height}."
        )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, format="PNG")


def print_farmer_strip_result(opaque_counts: list[int]) -> None:
    column_count = len(FRONT_ROW_COLUMN_INDEXES)
    opaque_count_length = len(opaque_counts)
    if opaque_count_length != column_count:
        raise ValueError(
            f"Opaque count length must be {column_count}; received {opaque_count_length}."
        )
    for column_index, opaque_count in zip(FRONT_ROW_COLUMN_INDEXES, opaque_counts):
        if opaque_count <= 0:
            raise ValueError(
                f"Front-row farmer frame has zero opaque pixels: "
                f"column_index={column_index} opaque_count={opaque_count}."
            )
        print(f"column_index={column_index} opaque_count={opaque_count}")
    print(STRIP_OUTPUT_PATH)


def main() -> None:
    body_atlas = load_rgba_source(BODY_ATLAS_PATH, BODY_ATLAS_SIZE)
    shirts_atlas = load_rgba_source(SHIRTS_ATLAS_PATH, SHIRTS_ATLAS_SIZE)
    pants_atlas = load_rgba_source(PANTS_ATLAS_PATH, PANTS_ATLAS_SIZE)
    front_frames = composite_front_row_frames(body_atlas, pants_atlas, shirts_atlas)
    opaque_counts = front_frame_opaque_counts(front_frames)
    scaled_frames = scale_front_frames(front_frames)
    strip = pack_frames_left_to_right(scaled_frames)
    save_rgba_png(strip, STRIP_OUTPUT_PATH, STRIP_SIZE)
    print_farmer_strip_result(opaque_counts)


if __name__ == "__main__":
    main()
