"""Re-read the live harvest routes and the six installed media files."""

import hashlib
import json
import urllib.request
from pathlib import Path

ORIGIN = "http://127.0.0.1:3004"
EVIDENCE_DIRECTORY = Path(__file__).resolve().parent
READBACK_PATH = EVIDENCE_DIRECTORY / "http-readback-r2.json"
ENGLISH_HTML_PATH = EVIDENCE_DIRECTORY / "http-en-r2.html"
CHINESE_HTML_PATH = EVIDENCE_DIRECTORY / "http-zh-r2.html"

NEW_ENGLISH_TITLE = "How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe"
OLD_ENGLISH_TITLE = "Right-Click a Parsnip"
NEW_CHINESE_TITLE = "星露谷物语怎么收作物：徒手、镰刀或斧头"
OLD_CHINESE_TITLE = "羽衣甘蓝需要镰刀"
MATURE_CROPS_WEBP = "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp"
TRELLIS_PATHS_WEBP = "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp"
ENGLISH_METHODS_WEBP = "/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp"
CHINESE_METHODS_WEBP = "/blog/illustrations/how-to-harvest-stardew-valley-zh-methods.webp"
COVER_WEBP = "/blog/how-to-harvest-stardew-valley-cover.webp"

EXPECTED_MEDIA = (
    (COVER_WEBP, "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574", 479250),
    ("/blog/how-to-harvest-stardew-valley-cover.avif", "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57", 237604),
    (MATURE_CROPS_WEBP, "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd", 267644),
    ("/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif", "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1", 143638),
    (TRELLIS_PATHS_WEBP, "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4", 223784),
    ("/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif", "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a", 113557),
)


def fetch_live_bytes(path):
    if not path.startswith("/"):
        raise ValueError(f"live path must start with /, received {path!r}")
    request = urllib.request.Request(
        f"{ORIGIN}{path}",
        headers={"Accept": "*/*"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        status = response.status
        content_type = response.headers.get("Content-Type", "")
        body = response.read()
    if status != 200:
        raise RuntimeError(f"HTTP status {status} for {path}, content-type {content_type!r}")
    if not isinstance(body, bytes) or len(body) == 0:
        raise RuntimeError(f"empty body for {path}")
    return status, content_type, body


def require_presence(html_text, path, marker, expected_present):
    present = marker in html_text
    if present != expected_present:
        raise RuntimeError(
            f"{path} marker {marker!r} present={present}, expected {expected_present}"
        )
    return present


def count_marker(html_text, path, marker, expected_count):
    actual_count = html_text.count(marker)
    if actual_count != expected_count:
        raise RuntimeError(
            f"{path} count of {marker!r} is {actual_count}, expected {expected_count}"
        )
    return actual_count


def read_article_page(path, html_path, expected_markers):
    status, content_type, body = fetch_live_bytes(path)
    html_path.write_bytes(body)
    html_text = body.decode("utf-8")
    marker_result = {}
    for marker, expected_present in expected_markers:
        marker_result[marker] = require_presence(html_text, path, marker, expected_present)
    lazy_count = count_marker(html_text, path, 'loading="lazy"', 2)
    return {
        "path": path,
        "status": status,
        "contentType": content_type,
        "byteSize": len(body),
        "sha256": hashlib.sha256(body).hexdigest(),
        "savedHtml": html_path.name,
        "lazyCount": lazy_count,
        "markers": marker_result,
    }


def read_media_file(path, expected_sha256, expected_byte_size):
    status, content_type, body = fetch_live_bytes(path)
    actual_sha256 = hashlib.sha256(body).hexdigest()
    if actual_sha256 != expected_sha256:
        raise RuntimeError(
            f"{path} sha256 {actual_sha256} != expected {expected_sha256}"
        )
    if len(body) != expected_byte_size:
        raise RuntimeError(
            f"{path} byte size {len(body)} != expected {expected_byte_size}"
        )
    return {
        "path": path,
        "status": status,
        "contentType": content_type,
        "byteSize": len(body),
        "sha256": actual_sha256,
    }


def main():
    records = [
        read_article_page(
            "/how-to-harvest-stardew-valley",
            ENGLISH_HTML_PATH,
            (
                (NEW_ENGLISH_TITLE, True),
                (OLD_ENGLISH_TITLE, False),
                (NEW_CHINESE_TITLE, False),
                (OLD_CHINESE_TITLE, False),
                (MATURE_CROPS_WEBP, True),
                (TRELLIS_PATHS_WEBP, True),
                (ENGLISH_METHODS_WEBP, False),
                (CHINESE_METHODS_WEBP, False),
                ("ConcernedApe", True),
                (COVER_WEBP, True),
                ('href="/last-day-to-plant-stardew"', True),
                ('href="/zh/last-day-to-plant-stardew"', False),
                ('href="/what-to-grow-in-greenhouse-stardew"', True),
                ('href="/zh/what-to-grow-in-greenhouse-stardew"', False),
                ("farm_evening_1920x1080.png", False),
            ),
        ),
        read_article_page(
            "/zh/how-to-harvest-stardew-valley",
            CHINESE_HTML_PATH,
            (
                (NEW_ENGLISH_TITLE, False),
                (OLD_ENGLISH_TITLE, False),
                (NEW_CHINESE_TITLE, True),
                (OLD_CHINESE_TITLE, False),
                (MATURE_CROPS_WEBP, True),
                (TRELLIS_PATHS_WEBP, True),
                (ENGLISH_METHODS_WEBP, False),
                (CHINESE_METHODS_WEBP, False),
                ("ConcernedApe", True),
                (COVER_WEBP, True),
                ('href="/zh/last-day-to-plant-stardew"', True),
                ('href="/last-day-to-plant-stardew"', False),
                ('href="/zh/what-to-grow-in-greenhouse-stardew"', True),
                ('href="/what-to-grow-in-greenhouse-stardew"', False),
                ('href="/zh"', True),
                ("farm_evening_1920x1080.png", False),
            ),
        ),
    ]
    for path, expected_sha256, expected_byte_size in EXPECTED_MEDIA:
        records.append(read_media_file(path, expected_sha256, expected_byte_size))
    READBACK_PATH.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {READBACK_PATH} records={len(records)}")


if __name__ == "__main__":
    main()
