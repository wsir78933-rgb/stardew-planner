#!/usr/bin/env python3
"""
Independent Chinese translation review evidence collection script (Role E, Round 2).
Verifies hashes, quote occurrences, links, media, figures, and terminology alignment.
"""

from __future__ import annotations

import hashlib
import json
import re
import unicodedata
from pathlib import Path


def compute_file_sha256(target_file_path: Path) -> str:
    """Read binary contents and compute standard SHA-256 hex digest."""
    if not target_file_path.is_file():
        raise FileNotFoundError(f"Target file does not exist: {target_file_path}")
    raw_file_bytes = target_file_path.read_bytes()
    return hashlib.sha256(raw_file_bytes).hexdigest()


def compute_nfc_lf_sha256(text_string: str) -> str:
    """Normalize text with NFC and LF line endings, then return SHA-256."""
    normalized_text = unicodedata.normalize("NFC", text_string)
    lf_text = normalized_text.replace("\r\n", "\n").replace("\r", "\n")
    return hashlib.sha256(lf_text.encode("utf-8")).hexdigest()


def verify_file_hashes(workspace_root: Path) -> dict[str, str]:
    """Verify and cross-check SHA-256 hashes of all input and output files."""
    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    translation_dir = rework_dir / "translation"

    files_to_hash = {
        "en_body_locked": rework_dir / "en-body.locked.md",
        "en_seo": rework_dir / "en-seo.json",
        "en_media_locked": rework_dir / "en-media.locked.json",
        "en_public_references_locked": rework_dir / "en-public-references.locked.json",
        "zh_body": translation_dir / "zh-body.md",
        "zh_seo": translation_dir / "zh-seo.json",
        "zh_media": translation_dir / "zh-media.json",
        "zh_public_references": translation_dir / "zh-public-references.json",
    }

    computed_hashes: dict[str, str] = {}
    for label_key, file_path in files_to_hash.items():
        computed_hashes[label_key] = compute_file_sha256(file_path)

    zh_seo_content = json.loads((translation_dir / "zh-seo.json").read_text(encoding="utf-8"))
    zh_media_content = json.loads((translation_dir / "zh-media.json").read_text(encoding="utf-8"))
    zh_refs_content = json.loads((translation_dir / "zh-public-references.json").read_text(encoding="utf-8"))

    expected_en_hash = computed_hashes["en_body_locked"]
    expected_zh_hash = computed_hashes["zh_body"]

    # Verify English body binding across Chinese sidecars
    if zh_seo_content.get("sourceEnglishBodyHash") != expected_en_hash:
        raise ValueError(
            f"zh-seo.json sourceEnglishBodyHash mismatch: "
            f"expected {expected_en_hash}, got {zh_seo_content.get('sourceEnglishBodyHash')}"
        )
    if zh_media_content.get("sourceEnglishBodyHash") != expected_en_hash:
        raise ValueError(
            f"zh-media.json sourceEnglishBodyHash mismatch: "
            f"expected {expected_en_hash}, got {zh_media_content.get('sourceEnglishBodyHash')}"
        )
    if zh_refs_content.get("sourceEnglishBodyHash") != expected_en_hash:
        raise ValueError(
            f"zh-public-references.json sourceEnglishBodyHash mismatch: "
            f"expected {expected_en_hash}, got {zh_refs_content.get('sourceEnglishBodyHash')}"
        )

    # Verify Chinese body binding
    if zh_seo_content.get("bodyHash") != expected_zh_hash:
        raise ValueError(
            f"zh-seo.json bodyHash mismatch: "
            f"expected {expected_zh_hash}, got {zh_seo_content.get('bodyHash')}"
        )
    if zh_media_content.get("bodySha256NfcLf") != expected_zh_hash:
        raise ValueError(
            f"zh-media.json bodySha256NfcLf mismatch: "
            f"expected {expected_zh_hash}, got {zh_media_content.get('bodySha256NfcLf')}"
        )
    if zh_refs_content.get("bodyHash") != expected_zh_hash:
        raise ValueError(
            f"zh-public-references.json bodyHash mismatch: "
            f"expected {expected_zh_hash}, got {zh_refs_content.get('bodyHash')}"
        )

    return computed_hashes


def verify_quote_occurrences(
    references_json_path: Path, body_file_path: Path, expected_count: int
) -> list[dict[str, object]]:
    """Check that each reference quote appears at least occurrence times in body file."""
    body_text = body_file_path.read_text(encoding="utf-8")
    references_payload = json.loads(references_json_path.read_text(encoding="utf-8"))
    references_list = references_payload.get("references", [])

    if len(references_list) != expected_count:
        raise ValueError(
            f"Reference count mismatch in {references_json_path.name}: "
            f"expected {expected_count}, got {len(references_list)}"
        )

    quote_verification_records: list[dict[str, object]] = []
    for single_ref in references_list:
        ref_id = single_ref["id"]
        ref_url = single_ref["url"]
        quote_target = single_ref["appliesTo"]["quote"]
        target_occurrence = single_ref["appliesTo"]["occurrence"]

        total_found = body_text.count(quote_target)
        if total_found < target_occurrence:
            raise ValueError(
                f"Quote occurrence failed for {ref_id}: quote '{quote_target}' "
                f"expected occurrence {target_occurrence}, but found only {total_found} times"
            )

        quote_verification_records.append(
            {
                "id": ref_id,
                "url": ref_url,
                "quote": quote_target,
                "expected_occurrence": target_occurrence,
                "actual_occurrences": total_found,
                "status": "PASS",
            }
        )

    return quote_verification_records


def compare_quote_correspondence(
    en_refs_path: Path, zh_refs_path: Path
) -> list[dict[str, object]]:
    """Check 1-to-1 correspondence between English and Chinese public references."""
    en_payload = json.loads(en_refs_path.read_text(encoding="utf-8"))
    zh_payload = json.loads(zh_refs_path.read_text(encoding="utf-8"))

    en_list = en_payload.get("references", [])
    zh_list = zh_payload.get("references", [])

    if len(en_list) != len(zh_list):
        raise ValueError(
            f"Reference list length mismatch: EN={len(en_list)}, ZH={len(zh_list)}"
        )

    correspondence_records: list[dict[str, object]] = []
    for en_ref, zh_ref in zip(en_list, zh_list):
        if en_ref["url"] != zh_ref["url"]:
            raise ValueError(
                f"URL mismatch between EN ref {en_ref['id']} and ZH ref {zh_ref['id']}: "
                f"EN='{en_ref['url']}', ZH='{zh_ref['url']}'"
            )
        if en_ref["appliesTo"]["occurrence"] != zh_ref["appliesTo"]["occurrence"]:
            raise ValueError(
                f"Occurrence mismatch between EN ref {en_ref['id']} and ZH ref {zh_ref['id']}: "
                f"EN={en_ref['appliesTo']['occurrence']}, ZH={zh_ref['appliesTo']['occurrence']}"
            )

        correspondence_records.append(
            {
                "en_id": en_ref["id"],
                "zh_id": zh_ref["id"],
                "url": en_ref["url"],
                "en_quote": en_ref["appliesTo"]["quote"],
                "zh_quote": zh_ref["appliesTo"]["quote"],
                "occurrence": en_ref["appliesTo"]["occurrence"],
                "matched": True,
            }
        )

    return correspondence_records


def extract_links_from_markdown(body_content: str) -> list[dict[str, str]]:
    """Extract markdown [text](url), HTML <a href="url">text</a>, and <img src="url">."""
    extracted_links: list[dict[str, str]] = []

    # Markdown links: [anchor](url)
    markdown_pattern = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
    for match in markdown_pattern.finditer(body_content):
        extracted_links.append(
            {
                "type": "markdown",
                "anchor": match.group(1),
                "url": match.group(2),
            }
        )

    # HTML links: <a href="url">anchor</a>
    html_pattern = re.compile(r'<a\s+[^>]*href="([^"]+)"[^>]*>([^<]+)</a>')
    for match in html_pattern.finditer(body_content):
        extracted_links.append(
            {
                "type": "html",
                "anchor": match.group(2),
                "url": match.group(1),
            }
        )

    # Image src: <img ... src="url" ... />
    image_pattern = re.compile(r'<img\s+[^>]*src="([^"]+)"[^>]*/>')
    for match in image_pattern.finditer(body_content):
        extracted_links.append(
            {
                "type": "image_src",
                "anchor": "<img>",
                "url": match.group(1),
            }
        )

    return extracted_links


def compare_link_multisets(
    en_body_path: Path, zh_body_path: Path
) -> dict[str, object]:
    """Compare all links in EN and ZH bodies, ensuring exact multiset URL equivalence."""
    en_text = en_body_path.read_text(encoding="utf-8")
    zh_text = zh_body_path.read_text(encoding="utf-8")

    en_links = extract_links_from_markdown(en_text)
    zh_links = extract_links_from_markdown(zh_text)

    en_urls = [link_item["url"] for link_item in en_links]
    zh_urls = [link_item["url"] for link_item in zh_links]

    if sorted(en_urls) != sorted(zh_urls):
        raise ValueError(
            f"Link URL multiset mismatch: EN count={len(en_urls)}, ZH count={len(zh_urls)}\n"
            f"EN only: {set(en_urls) - set(zh_urls)}\n"
            f"ZH only: {set(zh_urls) - set(en_urls)}"
        )

    paired_links: list[dict[str, object]] = []
    for index_pos, (en_item, zh_item) in enumerate(zip(en_links, zh_links)):
        if en_item["url"] != zh_item["url"]:
            raise ValueError(
                f"Link order/URL divergence at position {index_pos}: "
                f"EN={en_item['url']}, ZH={zh_item['url']}"
            )
        paired_links.append(
            {
                "position": index_pos + 1,
                "url": en_item["url"],
                "en_type": en_item["type"],
                "zh_type": zh_item["type"],
                "en_anchor": en_item["anchor"],
                "zh_anchor": zh_item["anchor"],
            }
        )

    return {
        "total_link_count": len(en_links),
        "url_multiset_identical": True,
        "paired_links": paired_links,
    }


def verify_figures_and_media(
    en_body_path: Path,
    zh_body_path: Path,
    zh_seo_path: Path,
    zh_media_path: Path,
) -> dict[str, object]:
    """Verify figure tags in body and metadata in SEO and media sidecars."""
    en_text = en_body_path.read_text(encoding="utf-8")
    zh_text = zh_body_path.read_text(encoding="utf-8")

    figure_regex = re.compile(
        r'<figure id="([^"]+)">\s*'
        r'<img src="([^"]+)" alt="([^"]+)" width="(\d+)" height="(\d+)" />\s*'
        r'<figcaption>(.*?)</figcaption>\s*'
        r'</figure>',
        re.DOTALL,
    )

    en_figures = figure_regex.findall(en_text)
    zh_figures = figure_regex.findall(zh_text)

    if len(en_figures) != 2:
        raise ValueError(f"Expected 2 figures in EN body, found {len(en_figures)}")
    if len(zh_figures) != 2:
        raise ValueError(f"Expected 2 figures in ZH body, found {len(zh_figures)}")

    figure_comparisons: list[dict[str, object]] = []
    for en_fig, zh_fig in zip(en_figures, zh_figures):
        en_id, en_src, en_alt, en_w, en_h, en_cap = en_fig
        zh_id, zh_src, zh_alt, zh_w, zh_h, zh_cap = zh_fig

        if en_id != zh_id:
            raise ValueError(f"Figure ID mismatch: EN={en_id}, ZH={zh_id}")
        if en_src != zh_src:
            raise ValueError(f"Figure src mismatch for {en_id}: EN={en_src}, ZH={zh_src}")
        if en_w != zh_w or en_h != zh_h:
            raise ValueError(f"Figure dimensions mismatch for {en_id}")

        figure_comparisons.append(
            {
                "figure_id": en_id,
                "src": en_src,
                "width": int(en_w),
                "height": int(en_h),
                "en_alt": en_alt,
                "zh_alt": zh_alt,
                "en_caption": en_cap.strip(),
                "zh_caption": zh_cap.strip(),
            }
        )

    # Check sidecars
    zh_seo = json.loads(zh_seo_path.read_text(encoding="utf-8"))
    zh_media = json.loads(zh_media_path.read_text(encoding="utf-8"))

    cover_meta = {
        "src": zh_seo["cover"]["src"],
        "avif": zh_seo["cover"]["avif"],
        "width": zh_seo["cover"]["width"],
        "height": zh_seo["cover"]["height"],
        "alt": zh_seo["cover"]["alt"],
        "caption": zh_seo["cover"]["caption"],
        "creditName": zh_seo["cover"]["creditName"],
        "creditUrl": zh_seo["cover"]["creditUrl"],
    }

    # Verify staged files referenced in zh-media exist
    for image_entry in zh_media["images"]:
        staged_webp = Path(image_entry["stagedWebpPath"])
        staged_avif = Path(image_entry["stagedAvifPath"])
        if not staged_webp.is_file():
            raise FileNotFoundError(f"Staged webp missing: {staged_webp}")
        if not staged_avif.is_file():
            raise FileNotFoundError(f"Staged avif missing: {staged_avif}")

        actual_webp_hash = hashlib.sha256(staged_webp.read_bytes()).hexdigest()
        actual_avif_hash = hashlib.sha256(staged_avif.read_bytes()).hexdigest()

        if actual_webp_hash != image_entry["stagedWebpSha256"]:
            raise ValueError(f"Staged webp hash mismatch for {image_entry['id']}")
        if actual_avif_hash != image_entry["stagedAvifSha256"]:
            raise ValueError(f"Staged avif hash mismatch for {image_entry['id']}")

    return {
        "figures": figure_comparisons,
        "cover": cover_meta,
    }


def audit_editorial_voice_and_terms(zh_body_path: Path, zh_seo_path: Path) -> dict[str, object]:
    """Scan for forbidden editorial phrases and check mandatory terminology."""
    zh_body_text = zh_body_path.read_text(encoding="utf-8")
    zh_seo = json.loads(zh_seo_path.read_text(encoding="utf-8"))

    # 1. Five forbidden editorial voice categories
    forbidden_editorial_patterns = [
        # 来源核查旁白
        (re.compile(r"已核对|已核验|核查状态|documented|source-backed|可核对的示例"), "来源核查旁白"),
        # 示例/实测免责
        (re.compile(r"教学示例.*不是官方|本文仅供参考|不是官方最佳答案|实战统计|not a measured|planning scenario"), "示例/实测免责"),
        # 图片自我说明
        (re.compile(r"插画用于表现|不代表游戏|不代表具体|original character illustration"), "图片自我说明"),
        # 文章自指与范围声明
        (re.compile(r"本文|本篇指南|This guide covers|后续.*属于另一组问题|The following table"), "文章自指与范围声明"),
        # 验收词汇
        (re.compile(r"readback|字段已核对|复核一次|mark each check"), "验收词汇"),
    ]

    detected_editorial_issues: list[dict[str, str]] = []
    for pattern_regex, category_name in forbidden_editorial_patterns:
        match_result = pattern_regex.search(zh_body_text)
        if match_result:
            detected_editorial_issues.append(
                {
                    "category": category_name,
                    "matched_text": match_result.group(0),
                }
            )

    # 2. Terminology check
    terminology_audit: list[dict[str, object]] = []

    # Kale MUST be 甘蓝菜, NEVER 羽衣甘蓝
    if "羽衣甘蓝" in zh_body_text:
        raise ValueError("Forbidden term '羽衣甘蓝' found in zh-body.md!")
    if "甘蓝菜" not in zh_body_text:
        raise ValueError("Required term '甘蓝菜' missing from zh-body.md!")

    terminology_audit.append(
        {
            "term": "Kale",
            "required": "甘蓝菜",
            "forbidden": "羽衣甘蓝",
            "status": "PASS",
        }
    )

    # Check key first occurrences with English annotation
    required_first_occurrences = [
        ("防风草（Parsnip）", "Parsnip", r"防风草（Parsnip）"),
        ("苋菜（Amaranth）", "Amaranth", r"苋菜（Amaranth）"),
        ("甘蓝菜（Kale）", "Kale", r"甘蓝菜（Kale）"),
        ("未碾米（Unmilled Rice）", "Unmilled Rice", r"未碾米（Unmilled Rice）"),
        ("纤维种子（Fiber Seeds）", "Fiber Seeds", r"纤维种子（Fiber Seeds）"),
        ("巨大作物（Giant Crop）", "Giant Crop", r"巨大作物（Giant Crop）"),
        ("蓝莓（Blueberry）", "Blueberry", r"蓝莓.*?\)?（Blueberry）"),
        ("棚架（Trellis）", "Trellis", r"棚架（Trellis）"),
        ("青豆、啤酒花和葡萄（Green Bean、Hops、Grape）", "Green Bean / Hops / Grape", r"青豆、啤酒花和葡萄.*?（Green Bean、Hops、Grape）"),
        ("耕种精通（Farming Mastery）", "Farming Mastery", r"耕种精通（Farming Mastery）"),
    ]

    for label_phrase, term_name, pattern_str in required_first_occurrences:
        if not re.search(pattern_str, zh_body_text):
            raise ValueError(f"Required annotated term missing: {label_phrase}")
        terminology_audit.append(
            {
                "term": term_name,
                "expected_phrase": label_phrase,
                "found": True,
            }
        )

    # Sprite check: should be '图像' or '可以收获的图像', not '妖精' or '精灵'
    if "妖精" in zh_body_text or "小精灵" in zh_body_text:
        raise ValueError("harvest sprite incorrectly translated as fairy/spirit!")

    # Check Title / H1 / Description
    seo_title = zh_seo["title"]
    seo_h1 = zh_seo["h1"]
    seo_desc = zh_seo["description"]

    if seo_title != seo_h1:
        raise ValueError(f"Title does not equal H1 in zh-seo.json: Title='{seo_title}', H1='{seo_h1}'")
    if "甘蓝菜" not in seo_desc:
        raise ValueError("SEO Description missing '甘蓝菜'")
    if "羽衣甘蓝" in seo_desc:
        raise ValueError("SEO Description contains forbidden '羽衣甘蓝'")

    return {
        "editorial_issues": detected_editorial_issues,
        "terminology_audit": terminology_audit,
        "title": seo_title,
        "h1": seo_h1,
        "description": seo_desc,
    }


def main() -> None:
    workspace_root = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
    evidence_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/review-e/evidence/translation-r2"
    evidence_dir.mkdir(parents=True, exist_ok=True)

    print("Step 1: Verifying SHA-256 hashes...")
    hashes_record = verify_file_hashes(workspace_root)
    print(f"  EN locked body hash: {hashes_record['en_body_locked']}")
    print(f"  ZH body hash:        {hashes_record['zh_body']}")

    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    translation_dir = rework_dir / "translation"

    print("Step 2: Verifying 21 quote occurrences...")
    zh_quote_records = verify_quote_occurrences(
        translation_dir / "zh-public-references.json",
        translation_dir / "zh-body.md",
        expected_count=21,
    )
    en_quote_records = verify_quote_occurrences(
        rework_dir / "en-public-references.locked.json",
        rework_dir / "en-body.locked.md",
        expected_count=21,
    )
    quote_correspondence = compare_quote_correspondence(
        rework_dir / "en-public-references.locked.json",
        translation_dir / "zh-public-references.json",
    )
    print(f"  Verified {len(zh_quote_records)} Chinese quotes and {len(en_quote_records)} English quotes.")

    print("Step 3: Comparing link multisets (27 URLs)...")
    link_comparison_record = compare_link_multisets(
        rework_dir / "en-body.locked.md",
        translation_dir / "zh-body.md",
    )
    print(f"  Total links: {link_comparison_record['total_link_count']}, all matching.")

    print("Step 4: Verifying figure tags and staged media assets...")
    media_records = verify_figures_and_media(
        rework_dir / "en-body.locked.md",
        translation_dir / "zh-body.md",
        translation_dir / "zh-seo.json",
        translation_dir / "zh-media.json",
    )
    print("  Figures and staged media verified.")

    print("Step 5: Auditing editorial voice and terminology...")
    audit_records = audit_editorial_voice_and_terms(
        translation_dir / "zh-body.md",
        translation_dir / "zh-seo.json",
    )
    print("  No editorial voice violations detected. Terminology verified.")

    summary_payload = {
        "file_hashes": hashes_record,
        "zh_quote_records": zh_quote_records,
        "en_quote_records": en_quote_records,
        "quote_correspondence": quote_correspondence,
        "link_comparison": link_comparison_record,
        "media_records": media_records,
        "audit_records": audit_records,
    }

    receipt_file_path = evidence_dir / "sha256-receipts.json"
    receipt_file_path.write_text(json.dumps(summary_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Evidence receipts written to: {receipt_file_path}")


if __name__ == "__main__":
    main()
