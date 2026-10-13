#!/usr/bin/env python3
"""
Freeze PublicBlogHandoff for rework-v2:
Produces rework-v2/handoffs/public-blog-handoff-en.json
and rework-v2/handoffs/public-blog-handoff-zh.json
with mechanical validation of hashes, quotes, media, and zero forbidden tokens.
"""

import hashlib
import json
import os
import subprocess
import sys


def compute_sha256_of_bytes(target_bytes: bytes) -> str:
    """Compute standard SHA-256 hexadecimal string of given bytes."""
    hasher = hashlib.sha256()
    hasher.update(target_bytes)
    return hasher.hexdigest()


def compute_sha256_of_file(file_path: str) -> str:
    """Compute SHA-256 hexadecimal string of file contents."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Target file does not exist: {file_path}")
    with open(file_path, "rb") as file_stream:
        contents_bytes = file_stream.read()
    return compute_sha256_of_bytes(contents_bytes)


def load_file_content_as_utf8(file_path: str) -> str:
    """Load text file ensuring UTF-8 decoding without silent replacement."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Target file does not exist: {file_path}")
    with open(file_path, "r", encoding="utf-8") as file_stream:
        return file_stream.read()


def load_json_document(file_path: str) -> dict:
    """Load JSON file strictly into a dictionary."""
    content_text = load_file_content_as_utf8(file_path)
    parsed_json = json.loads(content_text)
    if not isinstance(parsed_json, dict):
        raise TypeError(f"Expected dict from JSON {file_path}, got {type(parsed_json).__name__}")
    return parsed_json


def verify_file_sha256(file_path: str, expected_sha256: str) -> None:
    """Verify that file hash matches expected value exactly, fail fast otherwise."""
    computed_sha256 = compute_sha256_of_file(file_path)
    if computed_sha256 != expected_sha256:
        raise ValueError(
            f"File SHA-256 mismatch for {file_path}: "
            f"expected '{expected_sha256}', computed '{computed_sha256}'"
        )


def verify_reference_occurrences_in_body(body_text: str, reference_records: list) -> None:
    """Verify every public reference quote appears at least occurrence times in body."""
    for index, reference in enumerate(reference_records, start=1):
        reference_identifier = reference.get("id", f"index-{index}")
        applies_specification = reference.get("appliesTo")
        if not isinstance(applies_specification, dict):
            raise ValueError(
                f"Reference {reference_identifier} missing appliesTo dict: {applies_specification}"
            )
        exact_quote = applies_specification.get("quote")
        occurrence_index = applies_specification.get("occurrence", 1)
        if not exact_quote:
            raise ValueError(f"Reference {reference_identifier} has empty quote")
        actual_count = body_text.count(exact_quote)
        if actual_count < occurrence_index:
            raise ValueError(
                f"Reference {reference_identifier} quote occurrence check failed: "
                f"quote='{exact_quote}', expected at least {occurrence_index}, found {actual_count}"
            )


def verify_staged_media_assets(workspace_root: str, staged_asset_expectations: list) -> None:
    """Verify staged media files exist, match expected dimensions (1672x941) and SHA-256."""
    for asset_expectation in staged_asset_expectations:
        relative_path = asset_expectation["relative_path"]
        expected_sha256 = asset_expectation["expected_sha256"]
        absolute_file_path = os.path.join(workspace_root, relative_path)
        if not os.path.exists(absolute_file_path):
            raise FileNotFoundError(f"Staged media file missing: {absolute_file_path}")

        computed_sha256 = compute_sha256_of_file(absolute_file_path)
        if computed_sha256 != expected_sha256:
            raise ValueError(
                f"Staged asset {relative_path} hash mismatch: "
                f"expected {expected_sha256}, got {computed_sha256}"
            )

        # Dimension verification via sips
        dimension_process = subprocess.run(
            ["sips", "-g", "pixelWidth", "-g", "pixelHeight", absolute_file_path],
            capture_output=True,
            text=True,
            check=True,
        )
        stdout_text = dimension_process.stdout
        if "pixelWidth: 1672" not in stdout_text or "pixelHeight: 941" not in stdout_text:
            raise ValueError(
                f"Staged asset {relative_path} dimension incorrect. Output: {stdout_text}"
            )


def verify_no_forbidden_tokens(handoff_document: dict, document_label: str) -> None:
    """Verify document does not contain raw research, private paths, or internal operational strings."""
    forbidden_tokens = [
        "/Users/",
        "docs/blog-ops",
        "task_",
        "ctx_",
        "term_",
        "operation-store",
        "SERP",
        "PAA",
        "canary",
        "pending_media",
        "pending_title_review",
        "pending_translation_review",
    ]
    serialized_document = json.dumps(handoff_document, ensure_ascii=False)
    for forbidden_token in forbidden_tokens:
        if forbidden_token in serialized_document:
            raise ValueError(
                f"Document {document_label} contains forbidden token: '{forbidden_token}'"
            )


def compute_canonical_integrity_digest(handoff_document: dict) -> str:
    """Compute SHA-256 over canonical JSON of the 7 public fields with sort_keys and separators (',', ':')."""
    target_field_names = [
        "locale",
        "country",
        "body",
        "bodyHash",
        "seo",
        "publicReferences",
        "publicRequirements",
    ]
    canonical_subset = {field_name: handoff_document[field_name] for field_name in target_field_names}
    canonical_json_bytes = json.dumps(
        canonical_subset,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return compute_sha256_of_bytes(canonical_json_bytes)


def build_english_handoff(
    english_body_text: str,
    english_body_hash: str,
    raw_seo_record: dict,
    raw_references_record: dict,
) -> dict:
    """Construct complete English PublicBlogHandoff document."""
    # Build clean public SEO
    public_seo = {
        "title": raw_seo_record["title"],
        "h1": raw_seo_record["h1"],
        "description": raw_seo_record["description"],
        "slug": raw_seo_record["slug"],
        "faq": raw_seo_record["faq"],
        "schemaType": raw_seo_record["schemaType"],
        "author": raw_seo_record["author"],
        "topic": raw_seo_record["topic"],
        "readTimeMinutes": raw_seo_record["readTimeMinutes"],
        "featured": raw_seo_record["featured"],
        "datePublished": raw_seo_record["datePublished"],
        "publicPath": raw_seo_record["publicPath"],
        "canonicalUrl": raw_seo_record["canonicalUrl"],
        "cover": {
            "src": raw_seo_record["cover"]["src"],
            "avif": raw_seo_record["cover"]["avif"],
            "width": raw_seo_record["cover"]["width"],
            "height": raw_seo_record["cover"]["height"],
            "alt": raw_seo_record["cover"]["alt"],
            "caption": raw_seo_record["cover"]["caption"],
            "creditName": raw_seo_record["cover"]["creditName"],
            "creditUrl": raw_seo_record["cover"]["creditUrl"],
        },
        "figures": [
            {
                "id": figure_item["id"],
                "src": figure_item["src"],
                "avif": figure_item["avif"],
                "width": figure_item["width"],
                "height": figure_item["height"],
                "alt": figure_item["alt"],
                "caption": figure_item["caption"],
                "creditName": figure_item["creditName"],
                "creditUrl": figure_item["creditUrl"],
            }
            for figure_item in raw_seo_record["figures"]
        ],
    }

    # Public References
    cleaned_references = []
    for ref_item in raw_references_record["references"]:
        cleaned_ref = {
            "id": ref_item["id"],
            "label": ref_item["label"],
            "url": ref_item["url"],
            "appliesTo": {
                "quote": ref_item["appliesTo"]["quote"],
                "occurrence": ref_item["appliesTo"]["occurrence"],
            },
        }
        if "versionNote" in ref_item:
            cleaned_ref["versionNote"] = ref_item["versionNote"]
        cleaned_references.append(cleaned_ref)

    # Public Requirements
    public_requirements = {
        "route": {
            "locale": "en",
            "publicPath": "/how-to-harvest-stardew-valley",
            "canonicalUrl": "https://stardewvalleyplanner.art/how-to-harvest-stardew-valley",
        },
        "registry": {
            "author": raw_seo_record["author"],
            "topic": raw_seo_record["topic"],
            "readTimeMinutes": raw_seo_record["readTimeMinutes"],
            "featured": raw_seo_record["featured"],
            "datePublished": raw_seo_record["datePublished"],
        },
        "schema": {
            "type": "Article",
            "faqPage": False,
        },
        "faq": None,
        "cta": {
            "existingBodyLinks": [
                {
                    "href": "/last-day-to-plant-stardew",
                    "label": "last day to plant",
                },
                {
                    "href": "/what-to-grow-in-greenhouse-stardew",
                    "label": "what to grow in the greenhouse",
                },
                {
                    "href": "/",
                    "label": "farm planner",
                },
            ],
        },
        "cover": {
            "src": raw_seo_record["cover"]["src"],
            "avif": raw_seo_record["cover"]["avif"],
            "alt": raw_seo_record["cover"]["alt"],
            "caption": raw_seo_record["cover"]["caption"],
            "creditName": raw_seo_record["cover"]["creditName"],
            "creditUrl": raw_seo_record["cover"]["creditUrl"],
            "width": 1672,
            "height": 941,
            "format": "webp",
            "sha256": "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574",
            "avifSha256": "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57",
        },
        "figures": [
            {
                "id": "media-mature-crops",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif",
                "alt": "Full orange pumpkins on tilled soil beside a dirt path.",
                "caption": "Full orange pumpkins stand on tilled soil beside a dirt path. ConcernedApe, <a href=\"https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png\">Stardew Valley press screenshot</a>.",
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
                "width": 1672,
                "height": 941,
                "loading": "lazy",
                "format": "webp",
                "sha256": "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd",
                "avifSha256": "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1",
            },
            {
                "id": "media-trellis-paths",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif",
                "alt": "Two wooden trellises with an open dirt path between them and purple grapes on the trellis beside the path.",
                "caption": "Two wooden trellises have an open dirt path between them, with purple grape clusters on the trellis beside that path. ConcernedApe, <a href=\"https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png\">Stardew Valley press screenshot</a>.",
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
                "width": 1672,
                "height": 941,
                "loading": "lazy",
                "format": "webp",
                "sha256": "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4",
                "avifSha256": "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a",
            },
        ],
    }

    english_document = {
        "locale": "en",
        "country": "US",
        "body": english_body_text,
        "bodyHash": english_body_hash,
        "seo": public_seo,
        "publicReferences": cleaned_references,
        "publicRequirements": public_requirements,
    }

    # Compute digest over the 7 public fields
    integrity_digest = compute_canonical_integrity_digest(english_document)

    english_document["integrity"] = {
        "algorithm": "sha256",
        "canonicalization": "UTF-8 JSON of locale, country, body, bodyHash, seo, publicReferences, publicRequirements with sort_keys and separators (',', ':')",
        "digest": integrity_digest,
        "status": "title_passed",
        "frozen": True,
        "freezePublicBlogHandoff": True,
        "eBodyReview": "PASS",
        "eTitleReview": "PASS",
        "eTitleSeoSha256": "659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9",
        "mediaVerified": True,
        "userReview": "not_started",
        "pageAssembly": "not_started",
    }

    return english_document


def build_chinese_handoff(
    chinese_body_text: str,
    chinese_body_hash: str,
    source_english_body_hash: str,
    raw_seo_record: dict,
    raw_references_record: dict,
) -> dict:
    """Construct complete Chinese PublicBlogHandoff document."""
    # Build clean public SEO
    public_seo = {
        "title": raw_seo_record["title"],
        "h1": raw_seo_record["h1"],
        "description": raw_seo_record["description"],
        "slug": raw_seo_record["slug"],
        "faq": raw_seo_record["faq"],
        "schemaType": raw_seo_record["schemaType"],
        "author": raw_seo_record["author"],
        "topic": raw_seo_record["topic"],
        "readTimeMinutes": raw_seo_record["readTimeMinutes"],
        "featured": raw_seo_record["featured"],
        "datePublished": raw_seo_record["datePublished"],
        "publicPath": raw_seo_record["publicPath"],
        "canonicalUrl": raw_seo_record["canonicalUrl"],
        "cover": {
            "src": raw_seo_record["cover"]["src"],
            "avif": raw_seo_record["cover"]["avif"],
            "width": raw_seo_record["cover"]["width"],
            "height": raw_seo_record["cover"]["height"],
            "alt": raw_seo_record["cover"]["alt"],
            "caption": raw_seo_record["cover"]["caption"],
            "creditName": raw_seo_record["cover"]["creditName"],
            "creditUrl": raw_seo_record["cover"]["creditUrl"],
        },
        "figures": [
            {
                "id": figure_item["id"],
                "src": figure_item["src"],
                "avif": figure_item["avif"],
                "width": figure_item["width"],
                "height": figure_item["height"],
                "alt": figure_item["alt"],
                "caption": figure_item["caption"],
                "creditName": figure_item["creditName"],
                "creditUrl": figure_item["creditUrl"],
            }
            for figure_item in raw_seo_record["figures"]
        ],
    }

    # Public References
    cleaned_references = []
    for ref_item in raw_references_record["references"]:
        cleaned_ref = {
            "id": ref_item["id"],
            "label": ref_item["label"],
            "url": ref_item["url"],
            "appliesTo": {
                "quote": ref_item["appliesTo"]["quote"],
                "occurrence": ref_item["appliesTo"]["occurrence"],
            },
        }
        if "versionNote" in ref_item:
            cleaned_ref["versionNote"] = ref_item["versionNote"]
        cleaned_references.append(cleaned_ref)

    # Public Requirements
    public_requirements = {
        "route": {
            "locale": "zh-CN",
            "publicPath": "/zh/how-to-harvest-stardew-valley",
            "canonicalUrl": "https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley",
        },
        "registry": {
            "author": raw_seo_record["author"],
            "topic": raw_seo_record["topic"],
            "readTimeMinutes": raw_seo_record["readTimeMinutes"],
            "featured": raw_seo_record["featured"],
            "datePublished": raw_seo_record["datePublished"],
        },
        "schema": {
            "type": "Article",
            "faqPage": False,
        },
        "faq": None,
        "cta": {
            "existingBodyLinks": [
                {
                    "href": "/last-day-to-plant-stardew",
                    "label": "最晚播种日",
                },
                {
                    "href": "/what-to-grow-in-greenhouse-stardew",
                    "label": "温室里种什么",
                },
                {
                    "href": "/",
                    "label": "农场规划器",
                },
            ],
        },
        "cover": {
            "src": raw_seo_record["cover"]["src"],
            "avif": raw_seo_record["cover"]["avif"],
            "alt": raw_seo_record["cover"]["alt"],
            "caption": raw_seo_record["cover"]["caption"],
            "creditName": raw_seo_record["cover"]["creditName"],
            "creditUrl": raw_seo_record["cover"]["creditUrl"],
            "width": 1672,
            "height": 941,
            "format": "webp",
            "sha256": "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574",
            "avifSha256": "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57",
        },
        "figures": [
            {
                "id": "media-mature-crops",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif",
                "alt": "土路旁的耕地上长着饱满的橙色南瓜。",
                "caption": "饱满的橙色南瓜立在土路旁边的耕地上。ConcernedApe，<a href=\"https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png\">星露谷物语新闻素材截图</a>。",
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
                "width": 1672,
                "height": 941,
                "loading": "lazy",
                "format": "webp",
                "sha256": "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd",
                "avifSha256": "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1",
            },
            {
                "id": "media-trellis-paths",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif",
                "alt": "两排木棚架中间有一条空土路，路旁的棚架上有紫色葡萄。",
                "caption": "两排木棚架中间隔着一条空土路，路旁的棚架上是一串串紫色葡萄。ConcernedApe，<a href=\"https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png\">星露谷物语新闻素材截图</a>。",
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
                "width": 1672,
                "height": 941,
                "loading": "lazy",
                "format": "webp",
                "sha256": "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4",
                "avifSha256": "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a",
            },
        ],
    }

    chinese_document = {
        "locale": "zh-CN",
        "country": "US",
        "body": chinese_body_text,
        "bodyHash": chinese_body_hash,
        "seo": public_seo,
        "publicReferences": cleaned_references,
        "publicRequirements": public_requirements,
    }

    # Compute digest over the 7 public fields
    integrity_digest = compute_canonical_integrity_digest(chinese_document)

    chinese_document["integrity"] = {
        "algorithm": "sha256",
        "canonicalization": "UTF-8 JSON of locale, country, body, bodyHash, seo, publicReferences, publicRequirements with sort_keys and separators (',', ':')",
        "digest": integrity_digest,
        "sourceEnglishBodyHash": source_english_body_hash,
        "status": "title_passed",
        "frozen": True,
        "freezePublicBlogHandoff": True,
        "eBodyReview": "PASS",
        "eTitleReview": "PASS",
        "eTranslationReview": "PASS",
        "eTranslationSeoSha256": "49dffecf14f8fb5ddf549334bc6c1f14408cb0ed5f8b58e4bac5826898b8910f",
        "mediaVerified": True,
        "userReview": "not_started",
        "pageAssembly": "not_started",
    }

    return chinese_document


def write_json_document(target_file_path: str, document_dict: dict) -> None:
    """Serialize document as indented UTF-8 JSON."""
    serialized_text = json.dumps(document_dict, indent=2, ensure_ascii=False) + "\n"
    with open(target_file_path, "w", encoding="utf-8") as file_stream:
        file_stream.write(serialized_text)


def execute_freeze_pipeline(workspace_root: str) -> dict:
    """Execute complete freeze pipeline with strict boundary validation."""
    rework_directory = os.path.join(
        workspace_root,
        "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2",
    )
    handoffs_directory = os.path.join(rework_directory, "handoffs")
    os.makedirs(handoffs_directory, exist_ok=True)

    # Input file paths
    en_body_path = os.path.join(rework_directory, "en-body.locked.md")
    en_seo_path = os.path.join(rework_directory, "en-seo.json")
    en_media_path = os.path.join(rework_directory, "en-media.locked.json")
    en_references_path = os.path.join(rework_directory, "en-public-references.locked.json")

    zh_body_path = os.path.join(rework_directory, "translation/zh-body.md")
    zh_seo_path = os.path.join(rework_directory, "translation/zh-seo.json")
    zh_media_path = os.path.join(rework_directory, "translation/zh-media.json")
    zh_references_path = os.path.join(rework_directory, "translation/zh-public-references.json")

    # 1. Verify input file SHA-256 against approved benchmarks
    expected_en_body_hash = "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
    expected_en_seo_hash = "659da8405744937f9f77c6d95afaf92ea7d7e800768ae81fe37403ceb6aed1c9"
    expected_en_media_hash = "87e739923f404ca86a5464655ba239a5a14995cabceea0a686a49eaed15cf885"
    expected_en_references_hash = "52a355abdce750e153057d103a342ff4c68c9e829c8d1f32129f1c7b92da606e"

    expected_zh_body_hash = "30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd"
    expected_zh_seo_hash = "49dffecf14f8fb5ddf549334bc6c1f14408cb0ed5f8b58e4bac5826898b8910f"
    expected_zh_media_hash = "c6abd143616de6f03bc868121b41f9ae8a50f317b70dfbea37c67f3e282e95a7"
    expected_zh_references_hash = "7ca77bb04069808b5635e186985b936f15a25059f6de197ba0c229569b731c63"

    verify_file_sha256(en_body_path, expected_en_body_hash)
    verify_file_sha256(en_seo_path, expected_en_seo_hash)
    verify_file_sha256(en_media_path, expected_en_media_hash)
    verify_file_sha256(en_references_path, expected_en_references_hash)

    verify_file_sha256(zh_body_path, expected_zh_body_hash)
    verify_file_sha256(zh_seo_path, expected_zh_seo_hash)
    verify_file_sha256(zh_media_path, expected_zh_media_hash)
    verify_file_sha256(zh_references_path, expected_zh_references_hash)

    # 2. Verify staged media files
    staged_assets_info = [
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.webp",
            "expected_sha256": "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574",
        },
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.avif",
            "expected_sha256": "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57",
        },
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.webp",
            "expected_sha256": "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd",
        },
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.avif",
            "expected_sha256": "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1",
        },
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.webp",
            "expected_sha256": "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4",
        },
        {
            "relative_path": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.avif",
            "expected_sha256": "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a",
        },
    ]
    verify_staged_media_assets(workspace_root, staged_assets_info)

    # 3. Load text and JSON structures
    en_body_text = load_file_content_as_utf8(en_body_path)
    en_seo_record = load_json_document(en_seo_path)
    en_references_record = load_json_document(en_references_path)

    zh_body_text = load_file_content_as_utf8(zh_body_path)
    zh_seo_record = load_json_document(zh_seo_path)
    zh_references_record = load_json_document(zh_references_path)

    # 4. Verify 21 reference quotes against body text
    if len(en_references_record["references"]) != 21:
        raise ValueError(
            f"Expected 21 EN references, got {len(en_references_record['references'])}"
        )
    if len(zh_references_record["references"]) != 21:
        raise ValueError(
            f"Expected 21 ZH references, got {len(zh_references_record['references'])}"
        )
    verify_reference_occurrences_in_body(en_body_text, en_references_record["references"])
    verify_reference_occurrences_in_body(zh_body_text, zh_references_record["references"])

    # 5. Build handoff structures
    en_handoff = build_english_handoff(
        english_body_text=en_body_text,
        english_body_hash=expected_en_body_hash,
        raw_seo_record=en_seo_record,
        raw_references_record=en_references_record,
    )

    zh_handoff = build_chinese_handoff(
        chinese_body_text=zh_body_text,
        chinese_body_hash=expected_zh_body_hash,
        source_english_body_hash=expected_en_body_hash,
        raw_seo_record=zh_seo_record,
        raw_references_record=zh_references_record,
    )

    # 6. Verify zero forbidden tokens
    verify_no_forbidden_tokens(en_handoff, "public-blog-handoff-en.json")
    verify_no_forbidden_tokens(zh_handoff, "public-blog-handoff-zh.json")

    # 7. Write to target destination
    en_handoff_path = os.path.join(handoffs_directory, "public-blog-handoff-en.json")
    zh_handoff_path = os.path.join(handoffs_directory, "public-blog-handoff-zh.json")

    write_json_document(en_handoff_path, en_handoff)
    write_json_document(zh_handoff_path, zh_handoff)

    # 8. Re-read and verify written files
    re_read_en_handoff = load_json_document(en_handoff_path)
    re_read_zh_handoff = load_json_document(zh_handoff_path)

    re_computed_en_digest = compute_canonical_integrity_digest(re_read_en_handoff)
    re_computed_zh_digest = compute_canonical_integrity_digest(re_read_zh_handoff)

    if re_computed_en_digest != re_read_en_handoff["integrity"]["digest"]:
        raise ValueError("Re-computed EN digest does not match recorded digest!")
    if re_computed_zh_digest != re_read_zh_handoff["integrity"]["digest"]:
        raise ValueError("Re-computed ZH digest does not match recorded digest!")

    en_file_sha256 = compute_sha256_of_file(en_handoff_path)
    zh_file_sha256 = compute_sha256_of_file(zh_handoff_path)

    execution_summary = {
        "en_handoff_path": en_handoff_path,
        "en_file_sha256": en_file_sha256,
        "en_integrity_digest": re_computed_en_digest,
        "en_body_hash": expected_en_body_hash,
        "zh_handoff_path": zh_handoff_path,
        "zh_file_sha256": zh_file_sha256,
        "zh_integrity_digest": re_computed_zh_digest,
        "zh_body_hash": expected_zh_body_hash,
        "references_count_en": len(en_handoff["publicReferences"]),
        "references_count_zh": len(zh_handoff["publicReferences"]),
    }
    return execution_summary


def main() -> None:
    workspace_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../../../..")
    )
    execution_summary = execute_freeze_pipeline(workspace_root)
    print(json.dumps(execution_summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
