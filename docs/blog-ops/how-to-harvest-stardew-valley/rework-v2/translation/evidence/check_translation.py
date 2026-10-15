#!/usr/bin/env python3
"""Mechanical checks for the Chinese harvest translation. This does not sign prose quality."""

import hashlib
import json
import re
import subprocess
import unicodedata
from collections import Counter
from pathlib import Path


LOCKED_ENGLISH_BODY_HASH = "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
EXPECTED_IMAGE_WIDTH = 1672
EXPECTED_IMAGE_HEIGHT = 941
FORBIDDEN_READER_TERMS = ("羽衣甘蓝", "精灵", "祝尼魔", "本文", "已核验", "已核对")

REWORK_ROOT = Path(__file__).resolve().parents[2]
TRANSLATION_ROOT = REWORK_ROOT / "translation"
EVIDENCE_ROOT = TRANSLATION_ROOT / "evidence"
BLOG_ROOT = REWORK_ROOT.parents[3]


def read_nfc_lf_text(path):
    raw_bytes = path.read_bytes()
    if raw_bytes.startswith(b"\xef\xbb\xbf"):
        raise SystemExit(f"{path} starts with a UTF-8 BOM.")
    if b"\r" in raw_bytes:
        raise SystemExit(f"{path} contains CR. Expected LF only.")
    try:
        text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError as error:
        raise SystemExit(f"{path} is not UTF-8. Received: {error}") from error
    if unicodedata.normalize("NFC", text) != text:
        raise SystemExit(f"{path} is not Unicode NFC.")
    if not text.endswith("\n"):
        raise SystemExit(f"{path} does not end with a newline.")
    return text


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(path):
    return json.loads(read_nfc_lf_text(path))


def collect_link_targets(markdown_text):
    markdown_links = re.findall(r"\[[^\]]+\]\(([^)]+)\)", markdown_text)
    html_hrefs = re.findall(r'href="([^"]+)"', markdown_text)
    image_sources = re.findall(r'src="([^"]+)"', markdown_text)
    return markdown_links + html_hrefs + image_sources


def assert_same_link_targets(english_body, chinese_body):
    english_targets = Counter(collect_link_targets(english_body))
    chinese_targets = Counter(collect_link_targets(chinese_body))
    if english_targets != chinese_targets:
        raise SystemExit(
            "Link targets differ. "
            f"Only English: {english_targets - chinese_targets}. "
            f"Only Chinese: {chinese_targets - english_targets}."
        )
    return sum(english_targets.values())


def assert_reference_placement(chinese_body, reference_document, english_reference_document):
    references = reference_document["references"]
    if reference_document["referenceCount"] != 21 or len(references) != 21:
        raise SystemExit(
            "Chinese reference count must be 21. "
            f"Received referenceCount={reference_document['referenceCount']!r}, "
            f"list={len(references)}."
        )
    english_urls = [item["url"] for item in english_reference_document["references"]]
    chinese_urls = [item["url"] for item in references]
    if chinese_urls != english_urls:
        raise SystemExit(
            "Chinese reference URLs are not in the same order as the locked English list. "
            f"Received: {chinese_urls!r}"
        )
    quote_highest = {}
    failures = 0
    for record in references:
        reference_id = record["id"]
        quote = record["appliesTo"]["quote"]
        occurrence = record["appliesTo"]["occurrence"]
        url = record["url"]
        if not isinstance(occurrence, int) or occurrence < 1:
            raise SystemExit(f"{reference_id} occurrence must be a positive int. Received: {occurrence!r}")
        if url not in quote:
            raise SystemExit(f"{reference_id} url is not inside the quote. URL: {url!r}")
        if "docs/" in quote or "rework-v2" in quote:
            raise SystemExit(f"{reference_id} quote contains a private path. Quote: {quote!r}")
        actual_count = chinese_body.count(quote)
        if actual_count < occurrence:
            failures += 1
            raise SystemExit(
                f"{reference_id} quote occurrence {occurrence} is missing. "
                f"Actual count {actual_count}. Quote: {quote!r}"
            )
        previous = quote_highest.get(quote, 0)
        quote_highest[quote] = max(previous, occurrence)
    for quote, highest in quote_highest.items():
        actual_count = chinese_body.count(quote)
        if actual_count != highest:
            raise SystemExit(
                f"Quote count must equal its highest occurrence {highest}. "
                f"Received {actual_count}. Quote: {quote!r}"
            )
    if failures != 0:
        raise SystemExit(f"reference placement failures must be 0. Received {failures}.")
    return failures


def assert_body_figure_text(chinese_body, alt, caption, figure_id):
    if f'alt="{alt}"' not in chinese_body:
        raise SystemExit(f"{figure_id} alt is missing from zh-body.md. Alt: {alt!r}")
    if f"<figcaption>{caption}</figcaption>" not in chinese_body:
        raise SystemExit(f"{figure_id} caption is missing from zh-body.md. Caption: {caption!r}")


def assert_seo_fields(seo, chinese_body, chinese_body_hash):
    if seo["title"] != seo["h1"]:
        raise SystemExit(f"title and h1 differ. title={seo['title']!r} h1={seo['h1']!r}")
    if seo["titleEqualsH1"] is not True:
        raise SystemExit(f"titleEqualsH1 must be true. Received: {seo['titleEqualsH1']!r}")
    if "<" in seo["description"] or ">" in seo["description"]:
        raise SystemExit(f"description must be plain text. Received: {seo['description']!r}")
    if seo["sourceEnglishBodyHash"] != LOCKED_ENGLISH_BODY_HASH:
        raise SystemExit(
            "sourceEnglishBodyHash does not match the lock. "
            f"Received: {seo['sourceEnglishBodyHash']!r}"
        )
    if seo["bodyHash"] != chinese_body_hash:
        raise SystemExit(
            "seo bodyHash does not match zh-body.md. "
            f"Received: {seo['bodyHash']!r}"
        )
    if seo["slug"] != "how-to-harvest-stardew-valley":
        raise SystemExit(f"Unexpected slug: {seo['slug']!r}")
    if seo["locale"] != "zh-CN" or seo["country"] != "US":
        raise SystemExit(f"Unexpected locale/country: {seo['locale']!r} / {seo['country']!r}")
    if seo["publicPath"] != "/zh/how-to-harvest-stardew-valley":
        raise SystemExit(f"Unexpected publicPath: {seo['publicPath']!r}")
    if seo["canonicalUrl"] != "https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley":
        raise SystemExit(f"Unexpected canonicalUrl: {seo['canonicalUrl']!r}")
    if seo["schemaType"] != "Article" or seo["faq"] is not None:
        raise SystemExit(f"schemaType/faq must stay Article/null. Received: {seo['schemaType']!r} / {seo['faq']!r}")
    if seo["status"] != "pending_translation_review" or seo["freezePublicBlogHandoff"] is not False:
        raise SystemExit(
            "SEO must stay pending translation review. "
            f"Received status={seo['status']!r}, freeze={seo['freezePublicBlogHandoff']!r}"
        )
    if seo["readTimeMinutes"] != 6:
        raise SystemExit(f"readTimeMinutes must stay 6 from the English count. Received: {seo['readTimeMinutes']!r}")
    if seo["author"] != "星露谷规划器团队" or seo["topic"] != "星露谷物语指南":
        raise SystemExit(f"Unexpected author/topic: {seo['author']!r} / {seo['topic']!r}")
    if "羽衣甘蓝" in seo["title"] or "羽衣甘蓝" in seo["description"]:
        raise SystemExit("SEO still uses 羽衣甘蓝.")
    for figure in seo["figures"]:
        assert_body_figure_text(chinese_body, figure["alt"], figure["caption"], figure["id"])
    if "<a " in seo["cover"]["caption"]:
        raise SystemExit("Cover caption must stay plain text, matching the English cover.")
    return {"titleChars": len(seo["title"]), "descriptionChars": len(seo["description"])}


def assert_media_binding(media, seo, chinese_body, chinese_body_hash):
    if media["sourceEnglishBodyHash"] != LOCKED_ENGLISH_BODY_HASH:
        raise SystemExit(f"media sourceEnglishBodyHash mismatch. Received: {media['sourceEnglishBodyHash']!r}")
    if media["bodySha256NfcLf"] != chinese_body_hash:
        raise SystemExit(f"media body hash mismatch. Received: {media['bodySha256NfcLf']!r}")
    if len(media["images"]) != 3:
        raise SystemExit(f"media must list 3 images. Received {len(media['images'])}.")
    seo_text = {
        "media-cover": (seo["cover"]["alt"], seo["cover"]["caption"]),
        "media-mature-crops": (seo["figures"][0]["alt"], seo["figures"][0]["caption"]),
        "media-trellis-paths": (seo["figures"][1]["alt"], seo["figures"][1]["caption"]),
    }
    checked_files = []
    for image in media["images"]:
        image_id = image["id"]
        if image_id not in seo_text:
            raise SystemExit(f"Unexpected media id: {image_id!r}")
        expected_alt, expected_caption = seo_text[image_id]
        if image["alt"] != expected_alt or image["caption"] != expected_caption:
            raise SystemExit(f"{image_id} alt/caption does not match zh-seo.json.")
        if image["width"] != EXPECTED_IMAGE_WIDTH or image["height"] != EXPECTED_IMAGE_HEIGHT:
            raise SystemExit(
                f"{image_id} dimensions must be {EXPECTED_IMAGE_WIDTH}x{EXPECTED_IMAGE_HEIGHT}. "
                f"Received {image['width']}x{image['height']}."
            )
        if image.get("bodyAnchor") and image["bodyAnchor"] not in chinese_body:
            raise SystemExit(f"{image_id} bodyAnchor is not in the Chinese body: {image['bodyAnchor']!r}")
        for path_key, hash_key in (
            ("stagedWebpPath", "stagedWebpSha256"),
            ("stagedAvifPath", "stagedAvifSha256"),
        ):
            image_path = BLOG_ROOT / image[path_key]
            if not image_path.is_file():
                raise SystemExit(f"Missing staged image: {image_path}")
            actual_hash = sha256_file(image_path)
            if actual_hash != image[hash_key]:
                raise SystemExit(
                    f"{image_path.name} sha256 mismatch. Expected {image[hash_key]}, received {actual_hash}."
                )
            width, height = read_sips_pixel_size(image_path)
            if width != EXPECTED_IMAGE_WIDTH or height != EXPECTED_IMAGE_HEIGHT:
                raise SystemExit(
                    f"{image_path.name} pixel size must be {EXPECTED_IMAGE_WIDTH}x{EXPECTED_IMAGE_HEIGHT}. "
                    f"Received {width}x{height}."
                )
            checked_files.append(
                {"file": image_path.name, "bytes": image_path.stat().st_size, "sha256": actual_hash, "sips": f"{width}x{height}"}
            )
    if len(checked_files) != 6:
        raise SystemExit(f"Expected 6 staged WebP/AVIF files. Received {len(checked_files)}.")
    return checked_files


def read_sips_pixel_size(image_path):
    completed = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(image_path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise SystemExit(
            f"sips exit {completed.returncode} for {image_path}. stderr: {completed.stderr!r}"
        )
    widths = re.findall(r"pixelWidth: (\d+)", completed.stdout)
    heights = re.findall(r"pixelHeight: (\d+)", completed.stdout)
    if len(widths) != 1 or len(heights) != 1:
        raise SystemExit(f"sips output for {image_path.name} did not contain one width and height. Received: {completed.stdout!r}")
    return int(widths[0]), int(heights[0])


def assert_no_forbidden_terms(texts_by_name):
    for name, text in texts_by_name.items():
        for term in FORBIDDEN_READER_TERMS:
            if term in text:
                raise SystemExit(f"{name} contains forbidden term {term!r}.")


def assert_no_private_body_paths(chinese_body):
    for private_marker in ("docs/blog-ops", "rework-v2/", "operation-store", "facts-audit"):
        if private_marker in chinese_body:
            raise SystemExit(f"Chinese body contains private marker {private_marker!r}.")


def main():
    english_body_path = REWORK_ROOT / "en-body.locked.md"
    english_body_hash = sha256_file(english_body_path)
    if english_body_hash != LOCKED_ENGLISH_BODY_HASH:
        raise SystemExit(
            "Locked English body hash changed. "
            f"Expected {LOCKED_ENGLISH_BODY_HASH}, received {english_body_hash}."
        )
    english_body = read_nfc_lf_text(english_body_path)
    chinese_body = read_nfc_lf_text(TRANSLATION_ROOT / "zh-body.md")
    chinese_body_hash = sha256_file(TRANSLATION_ROOT / "zh-body.md")
    seo = load_json(TRANSLATION_ROOT / "zh-seo.json")
    media = load_json(TRANSLATION_ROOT / "zh-media.json")
    references = load_json(TRANSLATION_ROOT / "zh-public-references.json")
    english_references = load_json(REWORK_ROOT / "en-public-references.locked.json")
    if references["sourceEnglishBodyHash"] != LOCKED_ENGLISH_BODY_HASH:
        raise SystemExit(
            "reference sourceEnglishBodyHash mismatch. "
            f"Received: {references['sourceEnglishBodyHash']!r}"
        )
    if references["bodyHash"] != chinese_body_hash:
        raise SystemExit(f"reference bodyHash mismatch. Received: {references['bodyHash']!r}")
    link_count = assert_same_link_targets(english_body, chinese_body)
    placement_failures = assert_reference_placement(chinese_body, references, english_references)
    seo_counts = assert_seo_fields(seo, chinese_body, chinese_body_hash)
    image_files = assert_media_binding(media, seo, chinese_body, chinese_body_hash)
    assert_no_private_body_paths(chinese_body)
    assert_no_forbidden_terms(
        {
            "zh-body.md": chinese_body,
            "zh-seo.json": json.dumps(seo, ensure_ascii=False),
            "zh-media.json": json.dumps(media, ensure_ascii=False),
            "zh-public-references.json": json.dumps(references, ensure_ascii=False),
        }
    )
    if chinese_body.count("<figure") != 2:
        raise SystemExit(f"Chinese body must contain 2 figures. Received {chinese_body.count('<figure')}.")
    if chinese_body.count("ConcernedApe") != 2:
        raise SystemExit(f"Chinese body must keep 2 ConcernedApe credits. Received {chinese_body.count('ConcernedApe')}.")
    receipt = {
        "englishBodyHash": english_body_hash,
        "chineseBodyHash": chinese_body_hash,
        "zhSeoSha256": sha256_file(TRANSLATION_ROOT / "zh-seo.json"),
        "zhMediaSha256": sha256_file(TRANSLATION_ROOT / "zh-media.json"),
        "zhPublicReferencesSha256": sha256_file(TRANSLATION_ROOT / "zh-public-references.json"),
        "linkTargetCount": link_count,
        "referencePlacementFailures": placement_failures,
        "referenceCount": 21,
        "titleChars": seo_counts["titleChars"],
        "descriptionChars": seo_counts["descriptionChars"],
        "images": image_files,
        "qualityPassSigned": False,
    }
    receipt_text = json.dumps(receipt, ensure_ascii=False, indent=2) + "\n"
    (EVIDENCE_ROOT / "sha256-receipts.json").write_bytes(receipt_text.encode("utf-8"))
    print(json.dumps(receipt, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
