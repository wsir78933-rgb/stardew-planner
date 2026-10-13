import hashlib
import json
import os
import shlex
import subprocess
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
REWORK_V2_DIR = PROJECT_ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
SOURCES_DIR = REWORK_V2_DIR / "media-sources/originals"
MEDIA_DIR = REWORK_V2_DIR / "media"
MASTERS_DIR = MEDIA_DIR / "masters"
STAGED_DIR = MEDIA_DIR / "staged"
DECODED_DIR = MEDIA_DIR / "decoded"

EXPECTED_SOURCE_HASHES = {
    "press-farm-evening.png": "7f10276f5cb0ebbbc36a5133b4fa217c24fa89f61b21c1e15d082cbbac523496",
    "press-multiplayer-2.png": "b34cd47bb2e8fde6cb886154ad4027a63e222f0e29d17bd4d2fbf68d8caf9ab7",
}

COVER_BYTE_CEILING = 1250 * 1024  # 1.25 MB


def calculate_sha256(target_file_path: Path) -> str:
    if not target_file_path.is_file():
        raise FileNotFoundError(f"Target file does not exist: {target_file_path}")
    file_bytes = target_file_path.read_bytes()
    return hashlib.sha256(file_bytes).hexdigest()


def verify_source_integrity() -> None:
    for source_filename, expected_sha256 in EXPECTED_SOURCE_HASHES.items():
        source_path = SOURCES_DIR / source_filename
        if not source_path.is_file():
            raise FileNotFoundError(f"Required original image missing: {source_path}")
        actual_sha256 = calculate_sha256(source_path)
        if actual_sha256 != expected_sha256:
            raise ValueError(
                f"Source hash mismatch for {source_filename}: expected {expected_sha256}, got {actual_sha256}"
            )


def crop_and_resize_master(
    source_image_path: Path,
    crop_box: tuple[int, int, int, int] | None,
    output_dimensions: tuple[int, int],
    destination_master_path: Path,
) -> None:
    with Image.open(source_image_path) as source_image:
        if source_image.size != (1920, 1080):
            raise ValueError(
                f"Unexpected source dimensions for {source_image_path}: {source_image.size}, expected 1920x1080"
            )
        if crop_box is not None:
            left, top, right, bottom = crop_box
            if left < 0 or top < 0 or right > 1920 or bottom > 1080 or left >= right or top >= bottom:
                raise ValueError(f"Invalid crop box {crop_box} for 1920x1080 image")
            region_image = source_image.crop(crop_box)
        else:
            region_image = source_image

        resized_image = region_image.resize(output_dimensions, Image.Resampling.LANCZOS)
        destination_master_path.parent.mkdir(parents=True, exist_ok=True)
        resized_image.save(destination_master_path, format="PNG")

    saved_master = Image.open(destination_master_path)
    if saved_master.size != output_dimensions:
        raise ValueError(
            f"Master {destination_master_path} has size {saved_master.size}, expected {output_dimensions}"
        )


def execute_shell_command(command_arguments: list[str]) -> tuple[int, str, str]:
    process = subprocess.run(command_arguments, capture_output=True, text=True, check=False)
    if process.returncode != 0:
        raise RuntimeError(
            f"Command failed with exit code {process.returncode}:\n"
            f"Command: {shlex.join(command_arguments)}\n"
            f"Stderr: {process.stderr}\n"
            f"Stdout: {process.stdout}"
        )
    return process.returncode, process.stdout, process.stderr


def encode_webp(master_png_path: Path, destination_webp_path: Path) -> dict:
    command = [
        "cwebp",
        "-q",
        "90",
        "-metadata",
        "none",
        str(master_png_path),
        "-o",
        str(destination_webp_path),
    ]
    exit_code, stdout_text, stderr_text = execute_shell_command(command)
    header = destination_webp_path.read_bytes()[:12]
    if not (header.startswith(b"RIFF") and header[8:12] == b"WEBP"):
        raise ValueError(f"{destination_webp_path} header does not match WebP signature: {header!r}")
    return {
        "command": shlex.join(command),
        "exitCode": exit_code,
        "stdout": stdout_text,
        "stderr": stderr_text,
    }


def encode_avif(master_png_path: Path, destination_avif_path: Path) -> dict:
    command = [
        "ffmpeg",
        "-y",
        "-i",
        str(master_png_path),
        "-c:v",
        "libaom-av1",
        "-still-picture",
        "1",
        "-cpu-used",
        "6",
        "-crf",
        "28",
        "-pix_fmt",
        "yuv444p",
        str(destination_avif_path),
    ]
    exit_code, stdout_text, stderr_text = execute_shell_command(command)
    header = destination_avif_path.read_bytes()[:64]
    if b"ftypavif" not in header:
        raise ValueError(f"{destination_avif_path} header does not contain ftypavif: {header[:32]!r}")
    return {
        "command": shlex.join(command),
        "exitCode": exit_code,
        "stdout": stdout_text,
        "stderr": stderr_text,
    }


def decode_webp(staged_webp_path: Path, destination_decoded_png_path: Path) -> dict:
    command = [
        "dwebp",
        str(staged_webp_path),
        "-o",
        str(destination_decoded_png_path),
    ]
    exit_code, stdout_text, stderr_text = execute_shell_command(command)
    return {
        "command": shlex.join(command),
        "exitCode": exit_code,
        "stdout": stdout_text,
        "stderr": stderr_text,
    }


def decode_avif(staged_avif_path: Path, destination_decoded_png_path: Path) -> dict:
    command = [
        "ffmpeg",
        "-y",
        "-i",
        str(staged_avif_path),
        "-update",
        "1",
        "-frames:v",
        "1",
        str(destination_decoded_png_path),
    ]
    exit_code, stdout_text, stderr_text = execute_shell_command(command)
    return {
        "command": shlex.join(command),
        "exitCode": exit_code,
        "stdout": stdout_text,
        "stderr": stderr_text,
    }


def probe_media_stream(media_file_path: Path) -> dict:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=codec_name,width,height",
        "-of",
        "json",
        str(media_file_path),
    ]
    exit_code, stdout_text, _stderr = execute_shell_command(command)
    parsed_json = json.loads(stdout_text)
    stream_info = parsed_json["streams"][0]
    return {
        "codec": stream_info["codec_name"],
        "width": int(stream_info["width"]),
        "height": int(stream_info["height"]),
    }


def main() -> None:
    verify_source_integrity()

    MASTERS_DIR.mkdir(parents=True, exist_ok=True)
    STAGED_DIR.mkdir(parents=True, exist_ok=True)
    DECODED_DIR.mkdir(parents=True, exist_ok=True)

    image_specs = [
        {
            "basename": "how-to-harvest-stardew-valley-cover",
            "sourceFile": "press-farm-evening.png",
            "cropBox": None,
            "cropDescription": "No crop; isomorphic Lanczos resize of full 1920x1080 frame to 1672x941 (16:9)",
            "outputDimensions": (1672, 941),
            "expectedPublicLocation": "/blog/how-to-harvest-stardew-valley-cover",
            "description": "Autumn evening farm with pumpkin patch, chicken coop, silo, trellis rows, kegs, and pond",
        },
        {
            "basename": "how-to-harvest-stardew-valley-mature-crops",
            "sourceFile": "press-multiplayer-2.png",
            "cropBox": (740, 320, 1700, 860),
            "cropDescription": "Crop box (740, 320, 1700, 860) [w=960, h=540], Lanczos resized to 1672x941 (16:9)",
            "outputDimensions": (1672, 941),
            "expectedPublicLocation": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops",
            "description": "MultiplayerScreenshot2 daytime pumpkin patch close-up on tilled soil (top row has only two ripe pumpkins, not a full 4x5 grid), player in blue overalls raising green vegetable, player in green shirt, and scarecrow",
        },
        {
            "basename": "how-to-harvest-stardew-valley-trellis-paths",
            "sourceFile": "press-multiplayer-2.png",
            "cropBox": (990, 40, 1790, 490),
            "cropDescription": "Crop box (990, 40, 1790, 490) [w=800, h=450], Lanczos resized to 1672x941 (16:9)",
            "outputDimensions": (1672, 941),
            "expectedPublicLocation": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths",
            "description": "Garden scene with two columns of wooden post purple grape trellises on the left and visible dirt path; right side shows yellow tall-stalk crops (not wooden grape trellises) with player in red shirt standing inside the yellow crop patch",
        },
    ]

    manifest_records = []

    for spec in image_specs:
        basename = spec["basename"]
        source_path = SOURCES_DIR / spec["sourceFile"]
        master_path = MASTERS_DIR / f"{basename}.png"

        print(f"Generating master for {basename}...")
        crop_and_resize_master(
            source_image_path=source_path,
            crop_box=spec["cropBox"],
            output_dimensions=spec["outputDimensions"],
            destination_master_path=master_path,
        )

        webp_staged_path = STAGED_DIR / f"{basename}.webp"
        avif_staged_path = STAGED_DIR / f"{basename}.avif"

        print(f"Encoding {basename}.webp...")
        webp_log = encode_webp(master_path, webp_staged_path)

        print(f"Encoding {basename}.avif...")
        avif_log = encode_avif(master_path, avif_staged_path)

        if "cover" in basename:
            webp_size = webp_staged_path.stat().st_size
            avif_size = avif_staged_path.stat().st_size
            if webp_size > COVER_BYTE_CEILING:
                raise ValueError(f"Cover WebP size {webp_size} exceeds ceiling {COVER_BYTE_CEILING}")
            if avif_size > COVER_BYTE_CEILING:
                raise ValueError(f"Cover AVIF size {avif_size} exceeds ceiling {COVER_BYTE_CEILING}")

        webp_decoded_path = DECODED_DIR / f"{basename}.webp.png"
        avif_decoded_path = DECODED_DIR / f"{basename}.avif.png"

        print(f"Decoding {basename}.webp -> png...")
        webp_decode_log = decode_webp(webp_staged_path, webp_decoded_path)

        print(f"Decoding {basename}.avif -> png...")
        avif_decode_log = decode_avif(avif_staged_path, avif_decoded_path)

        webp_probe = probe_media_stream(webp_staged_path)
        avif_probe = probe_media_stream(avif_staged_path)

        if (webp_probe["width"], webp_probe["height"]) != spec["outputDimensions"]:
            raise ValueError(
                f"WebP probe dimensions {webp_probe} do not match expected {spec['outputDimensions']}"
            )
        if (avif_probe["width"], avif_probe["height"]) != spec["outputDimensions"]:
            raise ValueError(
                f"AVIF probe dimensions {avif_probe} do not match expected {spec['outputDimensions']}"
            )
        if (webp_probe["width"], webp_probe["height"]) != (avif_probe["width"], avif_probe["height"]):
            raise ValueError(
                f"Dimensions mismatch between WebP {webp_probe} and AVIF {avif_probe} for {basename}"
            )

        with Image.open(webp_decoded_path) as decoded_webp_image:
            if decoded_webp_image.size != spec["outputDimensions"]:
                raise ValueError(f"Decoded WebP size {decoded_webp_image.size} != {spec['outputDimensions']}")

        with Image.open(avif_decoded_path) as decoded_avif_image:
            if decoded_avif_image.size != spec["outputDimensions"]:
                raise ValueError(f"Decoded AVIF size {decoded_avif_image.size} != {spec['outputDimensions']}")

        record = {
            "basename": basename,
            "sourceFile": spec["sourceFile"],
            "sourceSha256": calculate_sha256(source_path),
            "sourceUrl": (
                "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png"
                if spec["sourceFile"] == "press-farm-evening.png"
                else "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png"
            ),
            "sourceAttribution": "ConcernedApe Stardew Valley Press Kit (https://www.stardewvalley.net/press/). Unverified commercial license; public press screenshot context.",
            "cropBox": spec["cropBox"],
            "cropDescription": spec["cropDescription"],
            "expectedPublicLocation": spec["expectedPublicLocation"],
            "description": spec["description"],
            "master": {
                "filePath": str(master_path),
                "width": spec["outputDimensions"][0],
                "height": spec["outputDimensions"][1],
                "byteSize": master_path.stat().st_size,
                "sha256": calculate_sha256(master_path),
            },
            "webp": {
                "filePath": str(webp_staged_path),
                "format": "WEBP",
                "width": webp_probe["width"],
                "height": webp_probe["height"],
                "byteSize": webp_staged_path.stat().st_size,
                "sha256": calculate_sha256(webp_staged_path),
                "encodeCommand": webp_log["command"],
                "encodeExitCode": webp_log["exitCode"],
                "decodedPngPath": str(webp_decoded_path),
                "decodeCommand": webp_decode_log["command"],
                "decodeExitCode": webp_decode_log["exitCode"],
            },
            "avif": {
                "filePath": str(avif_staged_path),
                "format": "AVIF",
                "width": avif_probe["width"],
                "height": avif_probe["height"],
                "byteSize": avif_staged_path.stat().st_size,
                "sha256": calculate_sha256(avif_staged_path),
                "encodeCommand": avif_log["command"],
                "encodeExitCode": avif_log["exitCode"],
                "decodedPngPath": str(avif_decoded_path),
                "decodeCommand": avif_decode_log["command"],
                "decodeExitCode": avif_decode_log["exitCode"],
            },
        }
        manifest_records.append(record)

    manifest_output_path = MEDIA_DIR / "manifest.json"
    manifest_data = {
        "role": "M",
        "phase": "rework-v2",
        "slug": "how-to-harvest-stardew-valley",
        "stagedCount": len(manifest_records) * 2,
        "assets": manifest_records,
    }
    manifest_output_path.write_text(json.dumps(manifest_data, indent=2) + "\n", encoding="utf-8")
    print(f"Manifest written successfully to {manifest_output_path}")


if __name__ == "__main__":
    main()
