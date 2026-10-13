import hashlib
import http.server
import json
import shlex
import shutil
import socketserver
import subprocess
import threading
import time
import xml.etree.ElementTree as XmlTree
from pathlib import Path

from PIL import Image

ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
MEDIA = ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/media"
LOG_DIR = MEDIA / "render-logs"
FINAL_DIR = LOG_DIR / "final-rasters"
PUBLIC_BLOG = ROOT / "public/blog"
PUBLIC_ILLUSTRATIONS = PUBLIC_BLOG / "illustrations"
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
PORT = 8775
COVER_BYTE_LIMIT = int(1.25 * 1024 * 1024)
SVG_NS = {"svg": "http://www.w3.org/2000/svg"}
EXPECTED = {
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/writing/en-figure.svg": "a6e017cda7dd1f5d5e3cbc4f07e29cac5d2c11855a5be120a077cc4a1e662661",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/writing/locked/en-body.md": "dd686bfd49f4e53dc377b702af558820a39ed5a27444a3af9afe22b0432d9101",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/seo/en-seo.json": "30ec27dd831c395b441964e3ef4b55e84c29329d24bfbbbff85f4e7066f15e08",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-figure.svg": "50cd8f2c06a05e258f1adb083012a471e76ab92554d997d36244d53fa41c4f13",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-body.md": "ec8b60fc7e99ac1c18b566bdd3594edc29f524d5cc6d3470625ef506f772c024",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-seo.json": "44fda49e69a3e9e6d6984b50075bfaa1eed0cd72ccdf87d4425ba2d55e97aab5",
    ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-media.json": "7aae7773171719b1db6df94599a2e861d915bbd0c99d073b408f2e0f80ebc7f2",
    MEDIA / "cover-source.svg": "03dec0791a44acf2da23097d114cbf84b6f4d12efb90056a64552232bba08608",
}


def sha256_file(path: Path) -> str:
    if not path.is_file():
        raise SystemExit(f"missing file: {path}")
    return hashlib.sha256(path.read_bytes()).hexdigest()


def assert_expected_hashes() -> None:
    for path, expected in EXPECTED.items():
        actual = sha256_file(path)
        if actual != expected:
            raise SystemExit(f"{path} sha256 is {actual}, expected {expected}")


def visible_labels(path: Path) -> list[str]:
    root = XmlTree.fromstring(path.read_bytes())
    labels = []
    for node in root.findall(".//svg:text", SVG_NS):
        label = "".join(node.itertext())
        if label == "":
            raise SystemExit(f"empty text node in {path}")
        labels.append(label)
    if len(labels) != 22:
        raise SystemExit(f"{path} text count is {len(labels)}, expected 22: {labels}")
    return labels


def rect_signature(path: Path) -> list[str]:
    root = XmlTree.fromstring(path.read_bytes())
    signature = []
    for node in root.findall(".//svg:rect", SVG_NS):
        signature.append(
            "|".join(
                f"{key}={node.get(key)}"
                for key in ("x", "y", "width", "height", "rx", "fill", "stroke", "stroke-width")
            )
        )
    return signature


def html_for_svg(svg_path: Path) -> bytes:
    svg_bytes = svg_path.read_bytes()
    if svg_bytes.startswith(b"<?xml"):
        marker = b"?>"
        declaration_end = svg_bytes.find(marker)
        if declaration_end < 0:
            raise SystemExit(f"{svg_path} xml declaration is not closed, prefix={svg_bytes[:40]!r}")
        markup = svg_bytes[declaration_end + len(marker) :].lstrip(b"\n")
    else:
        markup = svg_bytes.lstrip()
    if not markup.startswith(b"<svg"):
        raise SystemExit(f"{svg_path} markup does not start with svg: {markup[:40]!r}")
    return (
        b"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>"
        b"html,body{margin:0;padding:0;width:1672px;height:941px;overflow:hidden}"
        b"svg{display:block;width:1672px;height:941px}</style></head><body>"
        + markup
        + b"</body></html>"
    )


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        return


def drain_pipe(pipe, chunks: list[bytes]) -> None:
    while True:
        line = pipe.readline()
        if line == b"":
            return
        chunks.append(line)


def render_html(url: str, png_path: Path, log_path: Path, profile_dir: Path) -> tuple[int, str]:
    if profile_dir.exists():
        shutil.rmtree(profile_dir)
    profile_dir.mkdir(parents=True)
    if png_path.exists():
        png_path.unlink()
    command = [
        str(CHROME),
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1672,941",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={png_path}",
        url,
    ]
    proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout_chunks: list[bytes] = []
    stderr_chunks: list[bytes] = []
    threading.Thread(target=drain_pipe, args=(proc.stdout, stdout_chunks), daemon=True).start()
    threading.Thread(target=drain_pipe, args=(proc.stderr, stderr_chunks), daemon=True).start()
    deadline = time.time() + 25
    stable = False
    while time.time() < deadline:
        if proc.poll() is not None:
            break
        if png_path.is_file() and png_path.stat().st_size > 10000:
            time.sleep(0.5)
            size_before = png_path.stat().st_size
            time.sleep(0.5)
            if png_path.is_file() and png_path.stat().st_size == size_before:
                stable = True
                break
        time.sleep(0.2)
    if proc.poll() is None:
        if not stable:
            proc.kill()
            proc.wait(timeout=5)
            raise SystemExit(f"chrome pid {proc.pid} wrote no stable png for {png_path}")
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait(timeout=5)
    time.sleep(0.2)
    if proc.returncode is None:
        raise SystemExit(f"chrome pid {proc.pid} has no return code")
    log_path.write_text(
        "command:\n"
        + shlex.join(command)
        + f"\nexit_code: {proc.returncode}\nstable_png_before_stop: {stable}\n\n"
        + (b"".join(stdout_chunks) + b"\n--- stderr ---\n" + b"".join(stderr_chunks)).decode("utf-8", "replace"),
        encoding="utf-8",
    )
    if not png_path.is_file() or png_path.stat().st_size < 10000:
        raise SystemExit(f"chrome exit {proc.returncode} but png missing or small: {png_path}")
    return proc.returncode, shlex.join(command)


def assert_png(path: Path) -> Image.Image:
    image = Image.open(path)
    image.load()
    if image.size != (1672, 941) or image.format != "PNG":
        raise SystemExit(f"{path} is {image.format} {image.size}, expected PNG 1672x941")
    return image


def source_attribution(asset_id: str) -> str:
    if asset_id.startswith("cover"):
        return (
            "Original illustrative harvest scene drawn for this article. "
            "No external image, no game screenshot, and no text."
        )
    if asset_id.startswith("en"):
        return (
            "Lossy derivative of the Chrome raster of writing/en-figure.svg. "
            "Visible text, geometry, and facts were not rewritten. "
            "Not a game screenshot and not an external image."
        )
    if asset_id.startswith("zh"):
        return (
            "Lossy derivative of the Chrome raster of translation/zh-figure.svg. "
            "Visible text, geometry, and facts were not rewritten. "
            "Not a game screenshot and not an external image."
        )
    raise SystemExit(f"no source attribution for asset id {asset_id}")


def encode_command(source_png: Path, destination: Path) -> list[str]:
    if destination.suffix == ".webp":
        return ["cwebp", "-q", "90", "-metadata", "none", str(source_png), "-o", str(destination)]
    if destination.suffix == ".avif":
        return [
            "ffmpeg",
            "-y",
            "-i",
            str(source_png),
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
            str(destination),
        ]
    raise SystemExit(f"unexpected destination suffix {destination.suffix} for {destination}")


def decode_command(destination: Path, decoded: Path) -> list[str]:
    if destination.suffix == ".webp":
        return ["dwebp", str(destination), "-o", str(decoded)]
    if destination.suffix == ".avif":
        return ["ffmpeg", "-y", "-i", str(destination), "-update", "1", "-frames:v", "1", str(decoded)]
    raise SystemExit(f"unexpected destination suffix {destination.suffix} for {destination}")


def run_command(command: list[str], log_lines: list[str]) -> int:
    completed = subprocess.run(command, check=False, capture_output=True)
    log_lines.append("command: " + shlex.join(command))
    log_lines.append(f"exit_code: {completed.returncode}")
    log_lines.append(completed.stdout.decode("utf-8", "replace"))
    log_lines.append("--- stderr ---")
    log_lines.append(completed.stderr.decode("utf-8", "replace"))
    log_lines.append("")
    if completed.returncode != 0:
        raise SystemExit(
            f"command exit {completed.returncode}: {shlex.join(command)}\n"
            + completed.stderr.decode("utf-8", "replace")[-800:]
        )
    return completed.returncode


def assert_pixel(path: Path, image: Image.Image, xy: tuple[int, int], expected_hex: str) -> None:
    actual = image.convert("RGB").getpixel(xy)
    expected = tuple(int(expected_hex[index : index + 2], 16) for index in (1, 3, 5))
    if any(abs(channel - expected[index]) > 8 for index, channel in enumerate(actual)):
        raise SystemExit(f"{path} pixel {xy} is {actual}, expected near {expected_hex} {expected}")


def clear_quarantine(path: Path) -> None:
    before = sha256_file(path)
    completed = subprocess.run(["xattr", "-c", str(path)], check=False, capture_output=True, text=True)
    if completed.returncode != 0:
        raise SystemExit(f"xattr -c {path} exit {completed.returncode}: {completed.stderr}")
    after = sha256_file(path)
    if after != before:
        raise SystemExit(f"xattr changed bytes for {path}: {before} -> {after}")


def main() -> None:
    if not CHROME.is_file():
        raise SystemExit(f"chrome missing: {CHROME}")
    assert_expected_hashes()
    en_svg = ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/writing/en-figure.svg"
    zh_svg = ROOT / "docs/blog-ops/how-to-harvest-stardew-valley/translation/zh-figure.svg"
    cover_svg = MEDIA / "cover-source.svg"
    en_labels = visible_labels(en_svg)
    zh_labels = visible_labels(zh_svg)
    if rect_signature(en_svg) != rect_signature(zh_svg):
        raise SystemExit("en/zh rect geometry differs")
    FINAL_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_ILLUSTRATIONS.mkdir(parents=True, exist_ok=True)
    wrappers = {
        "en": (en_svg, FINAL_DIR / "en-render.html", FINAL_DIR / "en.png", LOG_DIR / "final-en-chrome.log"),
        "zh": (zh_svg, FINAL_DIR / "zh-render.html", FINAL_DIR / "zh.png", LOG_DIR / "final-zh-chrome.log"),
        "cover": (cover_svg, FINAL_DIR / "cover-render.html", FINAL_DIR / "cover.png", LOG_DIR / "final-cover-chrome.log"),
    }
    for _name, (svg_path, html_path, _png, _log) in wrappers.items():
        html_path.write_bytes(html_for_svg(svg_path))
    server = socketserver.TCPServer(
        ("127.0.0.1", PORT),
        lambda *args, **kwargs: QuietHandler(*args, directory=str(FINAL_DIR), **kwargs),
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    render_results = {}
    profile_root = LOG_DIR / "chrome-profile-final"
    try:
        for name, (_svg, html_path, png_path, log_path) in wrappers.items():
            exit_code, command = render_html(
                f"http://127.0.0.1:{PORT}/{html_path.name}",
                png_path,
                log_path,
                profile_root / name,
            )
            render_results[name] = {
                "exitCode": exit_code,
                "command": command,
                "png": str(png_path),
                "sha256": sha256_file(png_path),
            }
    finally:
        server.shutdown()
        server.server_close()
        if profile_root.exists():
            shutil.rmtree(profile_root)
    assert_expected_hashes()
    en_image = assert_png(FINAL_DIR / "en.png")
    zh_image = assert_png(FINAL_DIR / "zh.png")
    assert_png(FINAL_DIR / "cover.png")
    for image_path, image in ((FINAL_DIR / "en.png", en_image), (FINAL_DIR / "zh.png", zh_image)):
        assert_pixel(image_path, image, (8, 8), "#0b1220")
        assert_pixel(image_path, image, (100, 40), "#042f2e")
        assert_pixel(image_path, image, (80, 400), "#064e3b")
        assert_pixel(image_path, image, (50, 650), "#1e1b4b")
        assert_pixel(image_path, image, (590, 660), "#312e81")
        assert_pixel(image_path, image, (1140, 660), "#3b0764")
    if sha256_file(FINAL_DIR / "en.png") == sha256_file(FINAL_DIR / "zh.png"):
        raise SystemExit("zh png sha256 equals en png; Chinese text did not change the raster")
    outputs = [
        ("cover-webp", FINAL_DIR / "cover.png", PUBLIC_BLOG / "how-to-harvest-stardew-valley-cover.webp", "/blog/how-to-harvest-stardew-valley-cover.webp", cover_svg, True),
        ("cover-avif", FINAL_DIR / "cover.png", PUBLIC_BLOG / "how-to-harvest-stardew-valley-cover.avif", "/blog/how-to-harvest-stardew-valley-cover.avif", cover_svg, True),
        ("en-webp", FINAL_DIR / "en.png", PUBLIC_ILLUSTRATIONS / "how-to-harvest-stardew-valley-en-methods.webp", "/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp", en_svg, False),
        ("en-avif", FINAL_DIR / "en.png", PUBLIC_ILLUSTRATIONS / "how-to-harvest-stardew-valley-en-methods.avif", "/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif", en_svg, False),
        ("zh-webp", FINAL_DIR / "zh.png", PUBLIC_ILLUSTRATIONS / "how-to-harvest-stardew-valley-zh-methods.webp", "/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp", zh_svg, False),
        ("zh-avif", FINAL_DIR / "zh.png", PUBLIC_ILLUSTRATIONS / "how-to-harvest-stardew-valley-zh-methods.avif", "/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.avif", zh_svg, False),
    ]
    log_lines = ["# encode log", ""]
    written: list[Path] = []
    encode_records: dict[Path, tuple[str, int]] = {}
    try:
        for _asset_id, source_png, destination, _url, _svg, is_cover in outputs:
            if destination.exists():
                raise SystemExit(f"refusing to overwrite existing public file: {destination}")
            command = encode_command(source_png, destination)
            try:
                encode_exit = run_command(command, log_lines)
            except BaseException:
                if destination.exists():
                    destination.unlink()
                raise
            written.append(destination)
            encode_records[destination] = (shlex.join(command), encode_exit)
            clear_quarantine(destination)
            if is_cover and destination.stat().st_size > COVER_BYTE_LIMIT:
                raise SystemExit(f"{destination} bytes {destination.stat().st_size} exceed {COVER_BYTE_LIMIT}")
        decode_dir = FINAL_DIR / "decoded"
        decode_dir.mkdir(parents=True, exist_ok=True)
        for destination in written:
            decoded = decode_dir / (destination.name + ".png")
            if destination.suffix == ".avif":
                header = destination.read_bytes()[:64]
                if b"ftypavif" not in header:
                    raise SystemExit(f"{destination} header has no ftypavif: {header[:32]!r}")
            run_command(decode_command(destination, decoded), log_lines)
            if destination.suffix == ".webp":
                run_command(["webpinfo", str(destination)], log_lines)
            decoded_image = assert_png(decoded)
            run_command(
                [
                    "ffprobe",
                    "-v",
                    "error",
                    "-select_streams",
                    "v:0",
                    "-show_entries",
                    "stream=codec_name,width,height",
                    "-of",
                    "default=nw=1",
                    str(destination),
                ],
                log_lines,
            )
            if decoded_image.size != (1672, 941):
                raise SystemExit(f"decoded {destination} size {decoded_image.size}")
        assert_expected_hashes()
    except BaseException:
        for path in written:
            if path.exists():
                path.unlink()
        raise
    (LOG_DIR / "final-encode.log").write_text("\n".join(log_lines), encoding="utf-8")
    assets = []
    for asset_id, source_png, destination, public_url, svg_path, _is_cover in outputs:
        assets.append(
            {
                "id": asset_id,
                "publicUrl": public_url,
                "filePath": str(destination),
                "format": destination.suffix[1:].upper(),
                "width": 1672,
                "height": 941,
                "byteSize": destination.stat().st_size,
                "sha256": sha256_file(destination),
                "sourcePath": str(svg_path),
                "sourceSha256": sha256_file(svg_path),
                "rasterPath": str(source_png),
                "rasterSha256": sha256_file(source_png),
                "command": encode_records[destination][0],
                "exitCode": encode_records[destination][1],
                "sourceAttribution": source_attribution(asset_id),
            }
        )
    manifest = {
        "role": "M",
        "phase": "final",
        "slug": "how-to-harvest-stardew-valley",
        "renderExitCodes": {name: item["exitCode"] for name, item in render_results.items()},
        "assets": assets,
    }
    (MEDIA / "final-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "renders": render_results,
                "enLabels": en_labels,
                "zhLabels": zh_labels,
                "assets": [{"id": item["id"], "bytes": item["byteSize"], "sha256": item["sha256"]} for item in assets],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
