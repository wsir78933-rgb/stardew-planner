#!/usr/bin/env python3
"""Recompute harvest SEO round-2 hashes, anchors, identity, and image sizes.

Writes receipts only under review-e/evidence/seo-r2/. Does not edit the lock.
"""

import hashlib
import json
import re
import subprocess
import unicodedata
from pathlib import Path


EXPECTED_BODY_SHA256 = (
    "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
)
EXPECTED_REFERENCE_COUNT = 21
EXPECTED_PIXEL_WIDTH = 1672
EXPECTED_PIXEL_HEIGHT = 941
WORDS_PER_MINUTE = 200
PUBLIC_SITE_ORIGIN = "https://stardewvalleyplanner.art"
SLUG = "how-to-harvest-stardew-valley"
COUNTER_PATH = Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")


def find_worktree(start: Path) -> Path:
    for candidate in (start, *start.parents):
        registry = candidate / "src/blog/blog-post-registry.tsx"
        if registry.is_file():
            return candidate
    raise SystemExit(f"Worktree root not found from {start}.")


def sha256_hex(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def nfc_lf_bytes(raw: bytes, path: Path) -> bytes:
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as error:
        raise SystemExit(
            f"File is not UTF-8. Path: {path}. Error: {error}."
        ) from error
    normalized = unicodedata.normalize("NFC", text.replace("\r\n", "\n").replace("\r", "\n"))
    return normalized.encode("utf-8")


def hash_record(path: Path) -> dict:
    if not path.is_file():
        raise SystemExit(f"Required file is missing. Path: {path}.")
    raw = path.read_bytes()
    normalized = nfc_lf_bytes(raw, path)
    return {
        "path": str(path),
        "byteSize": len(raw),
        "rawSha256": sha256_hex(raw),
        "nfcLfSha256": sha256_hex(normalized),
        "rawEqualsNfcLf": raw == normalized,
    }


def load_json(path: Path) -> dict:
    record = hash_record(path)
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SystemExit(
            f"JSON parse failed. Path: {path}. Error: {error}."
        ) from error
    if not isinstance(parsed, dict):
        raise SystemExit(
            f"JSON root must be an object. Path: {path}. Received type: {type(parsed).__name__}."
        )
    return {"record": record, "parsed": parsed}


def assert_equal(label: str, actual, expected) -> None:
    if actual != expected:
        raise SystemExit(
            f"{label} mismatch. Expected: {expected!r}. Received: {actual!r}."
        )


def require_key(document: dict, key: str, path: Path):
    if key not in document:
        raise SystemExit(f"Missing key {key!r}. Path: {path}.")
    return document[key]


def run_word_counter(article_path: Path, stdout_path: Path) -> dict:
    if not COUNTER_PATH.is_file():
        raise SystemExit(f"Word counter is missing. Path: {COUNTER_PATH}.")
    completed = subprocess.run(
        ["python3", str(COUNTER_PATH), str(article_path), "--locale", "en"],
        check=False,
        capture_output=True,
        text=True,
    )
    stdout_path.write_text(completed.stdout, encoding="utf-8")
    (stdout_path.with_suffix(".stderr.txt")).write_text(completed.stderr, encoding="utf-8")
    (stdout_path.with_name(stdout_path.stem + ".exit.txt")).write_text(
        f"{completed.returncode}\n",
        encoding="utf-8",
    )
    if completed.returncode != 0:
        raise SystemExit(
            f"Word counter failed. Path: {article_path}. Exit: {completed.returncode}. "
            f"Stderr: {completed.stderr.strip()}."
        )
    try:
        parsed = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise SystemExit(
            f"Word counter stdout is not JSON. Path: {article_path}. Error: {error}."
        ) from error
    if not isinstance(parsed, dict) or "mechanical_units" not in parsed:
        raise SystemExit(
            f"Word counter JSON missing mechanical_units. Path: {article_path}. "
            f"Received keys: {sorted(parsed) if isinstance(parsed, dict) else type(parsed).__name__}."
        )
    return parsed


def strip_figure_blocks(article_text: str) -> str:
    stripped, replacements = re.subn(
        r"<figure\b[^>]*>.*?</figure>\n?",
        "",
        article_text,
        flags=re.S,
    )
    if replacements != 2:
        raise SystemExit(
            f"Expected exactly 2 figure blocks to remove. Received: {replacements}."
        )
    return stripped


def line_number(article_text: str, needle: str) -> int | None:
    index = article_text.find(needle)
    if index < 0:
        return None
    return article_text.count("\n", 0, index) + 1


def verify_reference_anchors(article_text: str, references: list, path: Path) -> list:
    if len(references) != EXPECTED_REFERENCE_COUNT:
        raise SystemExit(
            f"Reference count mismatch. Path: {path}. "
            f"Expected: {EXPECTED_REFERENCE_COUNT}. Received: {len(references)}."
        )
    seen_anchors = set()
    rows = []
    for index, reference in enumerate(references, start=1):
        if not isinstance(reference, dict):
            raise SystemExit(
                f"Reference {index} is not an object. Path: {path}. "
                f"Received type: {type(reference).__name__}."
            )
        reference_id = reference.get("id")
        url = reference.get("url")
        label = reference.get("label")
        applies_to = reference.get("appliesTo")
        if not isinstance(reference_id, str) or reference_id == "":
            raise SystemExit(f"Reference {index} has an empty id. Path: {path}.")
        if not isinstance(label, str) or label.strip() == "":
            raise SystemExit(
                f"Reference {reference_id} has an empty label. Path: {path}."
            )
        if not isinstance(url, str) or not url.startswith("https://"):
            raise SystemExit(
                f"Reference {reference_id} URL is not a public https URL. "
                f"Received: {url!r}."
            )
        if any(marker in url for marker in ("docs/blog-ops", "/tmp/", "operation-store", "canary")):
            raise SystemExit(
                f"Reference {reference_id} URL contains a private marker. Received: {url!r}."
            )
        if not isinstance(applies_to, dict):
            raise SystemExit(
                f"Reference {reference_id} appliesTo is not an object. Path: {path}."
            )
        quote = applies_to.get("quote")
        occurrence = applies_to.get("occurrence")
        if not isinstance(quote, str) or quote == "":
            raise SystemExit(f"Reference {reference_id} quote is empty. Path: {path}.")
        if not isinstance(occurrence, int) or occurrence < 1:
            raise SystemExit(
                f"Reference {reference_id} occurrence must be an integer >= 1. "
                f"Received: {occurrence!r}."
            )
        if url not in quote:
            raise SystemExit(
                f"Reference {reference_id} URL is absent from its quote. URL: {url!r}."
            )
        count = article_text.count(quote)
        if count < occurrence:
            raise SystemExit(
                f"Reference {reference_id} quote count is {count}, below occurrence {occurrence}. "
                f"Quote: {quote!r}."
            )
        anchor = (quote, occurrence)
        if anchor in seen_anchors:
            raise SystemExit(
                f"Duplicate quote and occurrence for {reference_id}. Occurrence: {occurrence}."
            )
        seen_anchors.add(anchor)
        rows.append(
            {
                "id": reference_id,
                "occurrence": occurrence,
                "quoteCount": count,
                "line": line_number(article_text, quote),
                "url": url,
            }
        )
    return rows


def anchor_rows(references: list) -> list:
    rows = []
    for reference in references:
        applies_to = reference["appliesTo"]
        rows.append(
            {
                "id": reference["id"],
                "url": reference["url"],
                "quote": applies_to["quote"],
                "occurrence": applies_to["occurrence"],
            }
        )
    return rows


def sibling_avif(webp_url: str) -> str:
    suffix = ".webp"
    if not isinstance(webp_url, str) or not webp_url.endswith(suffix):
        raise SystemExit(
            f"Public WebP URL must end in .webp. Received: {webp_url!r}."
        )
    stem = webp_url[: -len(suffix)]
    if stem == "" or stem.endswith("/"):
        raise SystemExit(
            f"Public WebP URL is missing a filename. Received: {webp_url!r}."
        )
    return stem + ".avif"


def measure_pixels(image_path: Path) -> dict:
    completed = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(image_path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise SystemExit(
            f"sips failed. Path: {image_path}. Exit: {completed.returncode}. "
            f"Stderr: {completed.stderr.strip()}."
        )
    width_match = re.search(r"pixelWidth:\s*(\d+)", completed.stdout)
    height_match = re.search(r"pixelHeight:\s*(\d+)", completed.stdout)
    if width_match is None or height_match is None:
        raise SystemExit(
            f"sips did not report pixel size. Path: {image_path}. "
            f"Stdout: {completed.stdout!r}."
        )
    width = int(width_match.group(1))
    height = int(height_match.group(1))
    if width != EXPECTED_PIXEL_WIDTH or height != EXPECTED_PIXEL_HEIGHT:
        raise SystemExit(
            f"Pixel size mismatch. Path: {image_path}. "
            f"Expected: {EXPECTED_PIXEL_WIDTH}x{EXPECTED_PIXEL_HEIGHT}. "
            f"Received: {width}x{height}."
        )
    return {
        "path": str(image_path),
        "width": width,
        "height": height,
        "byteSize": image_path.stat().st_size,
        "sha256": sha256_hex(image_path.read_bytes()),
        "sipsExit": completed.returncode,
    }


def verify_media_binding(worktree: Path, rework: Path, article_text: str, seo: dict, media: dict) -> list:
    images = media.get("images")
    if not isinstance(images, list) or len(images) != 3:
        raise SystemExit(
            f"Locked media image count must be 3. Received: {len(images) if isinstance(images, list) else type(images).__name__}."
        )
    seo_figures = {figure["id"]: figure for figure in seo["figures"]}
    manifest = load_json(rework / "media/manifest.json")["parsed"]
    manifest_by_basename = {asset["basename"]: asset for asset in manifest["assets"]}
    rows = []
    for image in images:
        image_id = image["id"]
        webp_url = image["publicWebpUrl"]
        avif_url = image["publicAvifUrl"]
        assert_equal(f"{image_id} avif sibling", avif_url, sibling_avif(webp_url))
        assert_equal(f"{image_id} width", image["width"], EXPECTED_PIXEL_WIDTH)
        assert_equal(f"{image_id} height", image["height"], EXPECTED_PIXEL_HEIGHT)
        staged_webp = worktree / image["stagedWebpPath"]
        staged_avif = worktree / image["stagedAvifPath"]
        webp_pixels = measure_pixels(staged_webp)
        avif_pixels = measure_pixels(staged_avif)
        assert_equal(f"{image_id} staged webp sha256", webp_pixels["sha256"], image["stagedWebpSha256"])
        assert_equal(f"{image_id} staged avif sha256", avif_pixels["sha256"], image["stagedAvifSha256"])
        basename = Path(webp_url).name.removesuffix(".webp")
        manifest_asset = manifest_by_basename.get(basename)
        if manifest_asset is None:
            raise SystemExit(f"Manifest has no asset for {basename!r}.")
        assert_equal(f"{image_id} creditUrl", image["creditUrl"], manifest_asset["sourceUrl"])
        if image_id == "media-cover":
            cover = seo["cover"]
            for field in ("src", "avif", "width", "height", "alt", "caption", "creditName", "creditUrl"):
                assert_equal(f"cover {field}", cover[field], image[{"src": "publicWebpUrl", "avif": "publicAvifUrl"}.get(field, field)])
            if webp_url in article_text:
                raise SystemExit(
                    f"Cover URL appears in the locked body. URL: {webp_url!r}."
                )
        else:
            figure = seo_figures.get(image_id)
            if figure is None:
                raise SystemExit(f"SEO figures missing {image_id}.")
            for field in ("src", "avif", "width", "height", "alt", "caption", "creditName", "creditUrl"):
                seo_field = {"src": "src", "avif": "avif"}.get(field, field)
                media_field = {"src": "publicWebpUrl", "avif": "publicAvifUrl"}.get(field, field)
                assert_equal(f"{image_id} {field}", figure[seo_field], image[media_field])
            img_tag = (
                f'<img src="{webp_url}" alt="{image["alt"]}" '
                f'width="{EXPECTED_PIXEL_WIDTH}" height="{EXPECTED_PIXEL_HEIGHT}" />'
            )
            if img_tag not in article_text:
                raise SystemExit(
                    f"Locked body is missing the image tag for {image_id}. Tag: {img_tag!r}."
                )
            if image["caption"] not in article_text:
                raise SystemExit(
                    f"Locked body is missing the caption for {image_id}."
                )
        rows.append(
            {
                "id": image_id,
                "publicWebpUrl": webp_url,
                "publicAvifUrl": avif_url,
                "stagedWebp": webp_pixels,
                "stagedAvif": avif_pixels,
                "alt": image["alt"],
                "creditUrl": image["creditUrl"],
            }
        )
    return rows


def compare_visible_copy(writing_media: dict, locked_media: dict) -> dict:
    writing_by_id = {image["id"]: image for image in writing_media["images"]}
    locked_by_id = {image["id"]: image for image in locked_media["images"]}
    assert_equal("media ids", list(locked_by_id), list(writing_by_id))
    caption_deltas = []
    for image_id, locked_image in locked_by_id.items():
        writing_image = writing_by_id[image_id]
        for field in ("alt", "creditName", "creditUrl", "width", "height", "inBody"):
            assert_equal(f"{image_id} {field} vs writing", locked_image[field], writing_image[field])
        if locked_image["caption"] != writing_image["caption"]:
            caption_deltas.append(
                {
                    "id": image_id,
                    "writingCaption": writing_image["caption"],
                    "lockedCaption": locked_image["caption"],
                }
            )
    return {"ids": list(locked_by_id), "captionDeltas": caption_deltas}


def extract_recent_titles(registry_text: str) -> list:
    english_section, separator, _chinese = registry_text.partition('"zh-CN"')
    if separator == "":
        raise SystemExit("Registry is missing the zh-CN section.")
    matches = re.findall(
        r'slug:\s*"([^"]+)",\s*title:\s*(?:"([^"]+)"|\s*"([^"]+)")',
        english_section,
    )
    titles = []
    for slug, single_line, wrapped in matches:
        title = single_line or wrapped
        titles.append({"slug": slug, "title": title})
    harvest_indexes = [index for index, item in enumerate(titles) if item["slug"] == SLUG]
    if harvest_indexes != [len(titles) - 1]:
        raise SystemExit(
            f"Harvest slug is not the last English registry entry. "
            f"Indexes: {harvest_indexes}. Count: {len(titles)}."
        )
    if len(titles) < 4:
        raise SystemExit(f"English registry has too few titles. Received: {len(titles)}.")
    return titles[-4:-1]


def verify_public_identity(worktree: Path, seo: dict) -> dict:
    site_source = (worktree / "src/seo/public-site-url.ts").read_text(encoding="utf-8")
    if f'const configuredPublicSiteUrl = "{PUBLIC_SITE_ORIGIN}"' not in site_source:
        raise SystemExit(
            f"Public site origin constant was not found. Expected: {PUBLIC_SITE_ORIGIN!r}."
        )
    route_source = (worktree / "src/i18n/public-route-registry.ts").read_text(encoding="utf-8")
    for token in ("en: createCanonicalUrl", '"zh-CN": createCanonicalUrl', '"x-default": createCanonicalUrl'):
        if token not in route_source:
            raise SystemExit(f"Hreflang builder is missing token {token!r}.")
    identities = (worktree / "src/blog/blog-post-identities.ts").read_text(encoding="utf-8")
    if f'"{SLUG}"' not in identities:
        raise SystemExit(f"Slug is absent from blog-post-identities.ts. Slug: {SLUG!r}.")
    registry_text = (worktree / "src/blog/blog-post-registry.tsx").read_text(encoding="utf-8")
    recent_titles = extract_recent_titles(registry_text)
    title = seo["title"]
    description = seo["description"]
    assert_equal("titleEqualsH1", seo["titleEqualsH1"], True)
    assert_equal("h1", seo["h1"], title)
    assert_equal("slug", seo["slug"], SLUG)
    assert_equal("publicPath", seo["publicPath"], f"/{SLUG}")
    assert_equal("canonicalUrl", seo["canonicalUrl"], f"{PUBLIC_SITE_ORIGIN}/{SLUG}")
    assert_equal("locale", seo["locale"], "en")
    assert_equal("country", seo["country"], "US")
    assert_equal("topic", seo["topic"], "Stardew Valley Guides")
    assert_equal("author", seo["author"], "Stardew Valley Planner Team")
    assert_equal("datePublished", seo["datePublished"], None)
    assert_equal("schemaType", seo["schemaType"], "Article")
    assert_equal("faq", seo["faq"], None)
    assert_equal("featured", seo["featured"], False)
    assert_equal("bodyHash", seo["bodyHash"], EXPECTED_BODY_SHA256)
    if not isinstance(seo["readTimeMinutes"], int) or seo["readTimeMinutes"] <= 0:
        raise SystemExit(
            f"readTimeMinutes must be a positive integer. Received: {seo['readTimeMinutes']!r}."
        )
    if "<" in description or ">" in description:
        raise SystemExit(f"Description contains HTML. Received: {description!r}.")
    cover_alt = seo["cover"]["alt"]
    if len(cover_alt.strip()) < 8:
        raise SystemExit(f"Cover alt is shorter than 8 characters. Received: {cover_alt!r}.")
    if "hreflang" in seo:
        raise SystemExit(f"SEO object stores its own hreflang. Received: {seo['hreflang']!r}.")
    guarantee_patterns = (
        "no truncation",
        "truncation risk",
        "ranking",
        "page one",
        "guaranteed",
        "fastest",
        "ultimate",
        "official guide",
        "creative commons",
        "all platforms",
        "xbox",
        "playstation",
        "nintendo switch",
    )
    public_text = "\n".join((title, description, cover_alt)).casefold()
    hits = [pattern for pattern in guarantee_patterns if pattern in public_text]
    if hits:
        raise SystemExit(
            f"Public title, description, or cover alt contains a guarantee or platform claim. "
            f"Hits: {hits}."
        )
    selected_title = title.casefold()
    routine_hits = []
    for item in recent_titles:
        previous = item["title"]
        if ": choose by" in previous.casefold() and ": choose by" in selected_title:
            routine_hits.append(previous)
        if "find its source before" in previous.casefold() and "find its source before" in selected_title:
            routine_hits.append(previous)
        if " vs " in previous.casefold() and " vs " in selected_title:
            routine_hits.append(previous)
    if routine_hits:
        raise SystemExit(
            f"Selected title repeats a recent title pattern. Matches: {routine_hits}."
        )
    return {
        "recentEnglishTitles": recent_titles,
        "derivedHreflang": {
            "en": f"{PUBLIC_SITE_ORIGIN}/{SLUG}",
            "zh-CN": f"{PUBLIC_SITE_ORIGIN}/zh/{SLUG}",
            "x-default": f"{PUBLIC_SITE_ORIGIN}/{SLUG}",
        },
        "titleCharacters": len(title),
        "descriptionCharacters": len(description),
        "coverAltCharacters": len(cover_alt),
        "guaranteeHits": hits,
        "routineHits": routine_hits,
    }


def claim_lines(article_text: str) -> dict:
    needles = {
        "parsnipNoScythe": "A parsnip does not need a scythe.",
        "pumpkinSprite": "A [pumpkin]",
        "keyboardX": "by pressing X.",
        "kaleScythe": "Kale is harvested with a scythe or better",
        "wheatScythe": "such as amaranth, kale, and wheat.",
        "anyAxe": "Harvest a giant crop with any axe.",
        "threeHits": "It takes three hits",
        "threeStrikes": "strike it three times",
        "pcSection": "### Single-Crop Harvesting on PC",
        "mobileScytheOnly": "On mobile devices,",
    }
    located = {}
    for name, needle in needles.items():
        number = line_number(article_text, needle)
        if number is None:
            raise SystemExit(f"Locked body is missing the claim anchor {name}. Needle: {needle!r}.")
        located[name] = number
    for banned in ("Xbox", "PlayStation", "Nintendo Switch", "all platforms"):
        if banned.casefold() in article_text.casefold():
            raise SystemExit(f"Locked body contains a platform phrase. Received: {banned!r}.")
    return located


def ceiling_minutes(word_count: int) -> int:
    if word_count <= 0:
        raise SystemExit(f"Word count must be positive. Received: {word_count}.")
    return (word_count + WORDS_PER_MINUTE - 1) // WORDS_PER_MINUTE


def hash_public_baseline(worktree: Path) -> list:
    public_paths = (
        "public/blog/how-to-harvest-stardew-valley-cover.webp",
        "public/blog/how-to-harvest-stardew-valley-cover.avif",
        "public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.webp",
        "public/blog/illustrations/how-to-harvest-stardew-valley-en-methods.avif",
    )
    rows = []
    for relative in public_paths:
        path = worktree / relative
        if not path.is_file():
            raise SystemExit(f"Baseline public file is missing. Path: {path}.")
        rows.append(
            {
                "path": relative,
                "byteSize": path.stat().st_size,
                "sha256": sha256_hex(path.read_bytes()),
            }
        )
    return rows


def main() -> None:
    evidence_dir = Path(__file__).resolve().parent
    worktree = find_worktree(evidence_dir)
    rework = worktree / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    body_path = rework / "en-body.locked.md"
    seo_path = rework / "en-seo.json"
    media_path = rework / "en-media.locked.json"
    references_path = rework / "en-public-references.locked.json"
    body_record = hash_record(body_path)
    assert_equal("locked body sha256", body_record["rawSha256"], EXPECTED_BODY_SHA256)
    assert_equal("locked body nfc", body_record["nfcLfSha256"], EXPECTED_BODY_SHA256)
    seo_loaded = load_json(seo_path)
    media_loaded = load_json(media_path)
    references_loaded = load_json(references_path)
    seo = seo_loaded["parsed"]
    media = media_loaded["parsed"]
    references_document = references_loaded["parsed"]
    assert_equal("media body hash", media["bodySha256NfcLf"], EXPECTED_BODY_SHA256)
    assert_equal("reference body hash", references_document["bodyHash"], EXPECTED_BODY_SHA256)
    article_text = body_path.read_text(encoding="utf-8")
    reference_rows = verify_reference_anchors(
        article_text,
        references_document["references"],
        references_path,
    )
    writing_references = load_json(rework / "writing/en-public-references.json")["parsed"]
    assert_equal(
        "reference anchors vs E-passed writing file",
        anchor_rows(references_document["references"]),
        anchor_rows(writing_references["references"]),
    )
    writing_media = load_json(rework / "writing/en-media.json")["parsed"]
    visible_copy = compare_visible_copy(writing_media, media)
    for caption_delta in visible_copy["captionDeltas"]:
        if caption_delta["id"] == "media-cover":
            raise SystemExit(
                "Cover caption changed from the E-passed writing media file. "
                f"Writing: {caption_delta['writingCaption']!r}. "
                f"Locked: {caption_delta['lockedCaption']!r}."
            )
        if caption_delta["lockedCaption"] not in article_text:
            raise SystemExit(
                f"{caption_delta['id']} locked caption is not in the locked body. "
                f"Caption: {caption_delta['lockedCaption']!r}."
            )
    lock_copies = {}
    for name in (
        "en-body.locked.md",
        "en-seo.json",
        "en-media.locked.json",
    ):
        root_bytes = (rework / name).read_bytes()
        copy_bytes = (rework / "lock-f" / name).read_bytes()
        if root_bytes != copy_bytes:
            raise SystemExit(
                f"Root lock and lock-f copy differ. File: {name}. "
                f"Root sha256: {sha256_hex(root_bytes)}. Copy sha256: {sha256_hex(copy_bytes)}."
            )
        lock_copies[name] = {"sha256": sha256_hex(root_bytes), "sameBytes": True}
    root_references = json.loads(references_path.read_text(encoding="utf-8"))
    copy_references_path = rework / "lock-f/en-public-references.locked.json"
    copy_references = json.loads(copy_references_path.read_text(encoding="utf-8"))
    root_without_body_file = {key: value for key, value in root_references.items() if key != "bodyFile"}
    copy_without_body_file = {key: value for key, value in copy_references.items() if key != "bodyFile"}
    if root_without_body_file != copy_without_body_file:
        raise SystemExit(
            "Root and lock-f public references differ beyond bodyFile. "
            f"Root sha256: {sha256_hex(references_path.read_bytes())}. "
            f"Copy sha256: {sha256_hex(copy_references_path.read_bytes())}."
        )
    lock_copies["en-public-references.locked.json"] = {
        "rootSha256": sha256_hex(references_path.read_bytes()),
        "lockFSha256": sha256_hex(copy_references_path.read_bytes()),
        "sameBytes": False,
        "onlyDifference": {
            "field": "bodyFile",
            "root": root_references["bodyFile"],
            "lockF": copy_references["bodyFile"],
        },
    }
    writing_body = hash_record(rework / "writing/en-body.md")
    assert_equal("writing body sha256", writing_body["rawSha256"], EXPECTED_BODY_SHA256)
    identity = verify_public_identity(worktree, seo)
    claims = claim_lines(article_text)
    media_rows = verify_media_binding(worktree, rework, article_text, seo, media)
    excluded_path = evidence_dir / "en-body.caption-excluded.md"
    excluded_path.write_text(strip_figure_blocks(article_text), encoding="utf-8")
    full_count = run_word_counter(body_path, evidence_dir / "count-full.stdout.json")
    eligible_count = run_word_counter(excluded_path, evidence_dir / "count-eligible.stdout.json")
    full_minutes = ceiling_minutes(full_count["mechanical_units"])
    eligible_minutes = ceiling_minutes(eligible_count["mechanical_units"])
    assert_equal("eligible read time", eligible_minutes, seo["readTimeMinutes"])
    assert_equal("full-file read time", full_minutes, seo["readTimeMinutes"])
    assert_equal("seo eligible words", seo["eligibleWords"], eligible_count["mechanical_units"])
    assert_equal("seo raw words", seo["rawMechanicalWords"], full_count["mechanical_units"])
    decoded_rows = []
    for decoded_name in (
        "how-to-harvest-stardew-valley-cover.webp.png",
        "how-to-harvest-stardew-valley-mature-crops.webp.png",
        "how-to-harvest-stardew-valley-trellis-paths.webp.png",
    ):
        decoded_path = rework / "media/decoded" / decoded_name
        decoded_rows.append(
            {
                "path": str(decoded_path.relative_to(worktree)),
                "sha256": sha256_hex(decoded_path.read_bytes()),
                "byteSize": decoded_path.stat().st_size,
            }
        )
    receipt = {
        "body": body_record,
        "seo": seo_loaded["record"],
        "media": media_loaded["record"],
        "references": references_loaded["record"],
        "lockCopiesMatchRoot": lock_copies,
        "writingBody": writing_body,
        "referenceRows": reference_rows,
        "visibleCopy": visible_copy,
        "identity": identity,
        "claimLines": claims,
        "mediaRows": media_rows,
        "fullCount": full_count,
        "eligibleCount": eligible_count,
        "readTimeMinutes": {
            "wordsPerMinute": WORDS_PER_MINUTE,
            "eligibleWords": eligible_count["mechanical_units"],
            "eligibleCeiling": eligible_minutes,
            "rawWords": full_count["mechanical_units"],
            "rawCeiling": full_minutes,
            "field": seo["readTimeMinutes"],
        },
        "decodedWebpPng": decoded_rows,
        "publicBaselineStillPresent": hash_public_baseline(worktree),
    }
    receipt_path = evidence_dir / "sha256-receipts.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"receipt {receipt_path}")
    print(f"body {body_record['rawSha256']}")
    print(f"seo {seo_loaded['record']['rawSha256']}")
    print(f"media {media_loaded['record']['rawSha256']}")
    print(f"references {references_loaded['record']['rawSha256']}")
    print(
        f"words full={full_count['mechanical_units']} eligible={eligible_count['mechanical_units']} "
        f"readTime={seo['readTimeMinutes']}"
    )
    print(f"references_checked {len(reference_rows)}")
    print(f"title_chars {identity['titleCharacters']} description_chars {identity['descriptionCharacters']}")


if __name__ == "__main__":
    main()
