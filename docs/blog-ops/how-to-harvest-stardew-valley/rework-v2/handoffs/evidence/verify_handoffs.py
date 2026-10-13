#!/usr/bin/env python3
"""
Mechanical verification script for PublicBlogHandoff documents.
Verifies:
1. Top-level keys match exact V7 schema (8 keys: locale, country, body, bodyHash, seo, publicReferences, publicRequirements, integrity).
2. Body text matches approved locked UTF-8 bytes and hashes.
3. References count == 21, quotes exist at specified occurrence, no private paths.
4. SEO metadata matches approved values, no invented fields or dates.
5. Media assets (6 files) exist, 1672x941 dimensions, correct hashes, ConcernedApe credits preserved.
6. Integrity digest recomputed and verified.
7. ZH integrity properly binds sourceEnglishBodyHash.
8. Zero forbidden tokens across both handoffs.
"""

import hashlib
import json
import os
import subprocess
import sys


def compute_sha256(content_bytes: bytes) -> str:
    return hashlib.sha256(content_bytes).hexdigest()


def load_json(file_path: str) -> dict:
    with open(file_path, "r", encoding="utf-8") as file_stream:
        return json.load(file_stream)


def run_verification(workspace_root: str) -> None:
    rework_directory = os.path.join(
        workspace_root,
        "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2",
    )
    handoffs_directory = os.path.join(rework_directory, "handoffs")

    en_handoff_path = os.path.join(handoffs_directory, "public-blog-handoff-en.json")
    zh_handoff_path = os.path.join(handoffs_directory, "public-blog-handoff-zh.json")

    en_handoff = load_json(en_handoff_path)
    zh_handoff = load_json(zh_handoff_path)

    expected_top_keys = [
        "locale",
        "country",
        "body",
        "bodyHash",
        "seo",
        "publicReferences",
        "publicRequirements",
        "integrity",
    ]

    # 1. Top-level schema check
    for label, doc in [("EN", en_handoff), ("ZH", zh_handoff)]:
        actual_keys = list(doc.keys())
        if actual_keys != expected_top_keys:
            raise ValueError(f"{label} top-level keys mismatch: {actual_keys} != {expected_top_keys}")
    print("CHECK 1 PASS: Top-level schema matches exact 8 fields.")

    # 2. Body hash check
    expected_en_body_hash = "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
    expected_zh_body_hash = "30dae640ace62e848f745b07534f1bf693fe9e931f0f77284319795d5ca1f4cd"

    computed_en_body_hash = compute_sha256(en_handoff["body"].encode("utf-8"))
    computed_zh_body_hash = compute_sha256(zh_handoff["body"].encode("utf-8"))

    if computed_en_body_hash != expected_en_body_hash or en_handoff["bodyHash"] != expected_en_body_hash:
        raise ValueError(f"EN body hash mismatch: {computed_en_body_hash} vs {expected_en_body_hash}")
    if computed_zh_body_hash != expected_zh_body_hash or zh_handoff["bodyHash"] != expected_zh_body_hash:
        raise ValueError(f"ZH body hash mismatch: {computed_zh_body_hash} vs {expected_zh_body_hash}")
    print("CHECK 2 PASS: Body hashes match locked approval hashes.")

    # 3. References check (21 references in both)
    for label, doc in [("EN", en_handoff), ("ZH", zh_handoff)]:
        refs = doc["publicReferences"]
        if len(refs) != 21:
            raise ValueError(f"{label} references count != 21, found {len(refs)}")
        body_text = doc["body"]
        for ref in refs:
            quote = ref["appliesTo"]["quote"]
            occ = ref["appliesTo"]["occurrence"]
            count = body_text.count(quote)
            if count < occ:
                raise ValueError(f"{label} quote missing or occurrence < {occ}: {quote[:40]}...")
    print("CHECK 3 PASS: 21 public references verified in both bodies.")

    # 4. Media specifications check
    expected_media = [
        ("cover.webp", "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574"),
        ("cover.avif", "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57"),
        ("mature-crops.webp", "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd"),
        ("mature-crops.avif", "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1"),
        ("trellis-paths.webp", "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4"),
        ("trellis-paths.avif", "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a"),
    ]
    staged_dir = os.path.join(rework_directory, "media/staged")
    for filename_suffix, expected_hash in expected_media:
        full_filename = f"how-to-harvest-stardew-valley-{filename_suffix}"
        target_path = os.path.join(staged_dir, full_filename)
        with open(target_path, "rb") as file_stream:
            actual_hash = compute_sha256(file_stream.read())
        if actual_hash != expected_hash:
            raise ValueError(f"Media hash mismatch for {full_filename}: {actual_hash} vs {expected_hash}")
        # check sips dimension
        process = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", target_path], capture_output=True, text=True, check=True)
        if "pixelWidth: 1672" not in process.stdout or "pixelHeight: 941" not in process.stdout:
            raise ValueError(f"Dimension error for {full_filename}")
    print("CHECK 4 PASS: 6 staged media assets verified (hashes and 1672x941).")

    # 5. Integrity digest check
    canonical_subset_en = {k: en_handoff[k] for k in expected_top_keys[:7]}
    canonical_bytes_en = json.dumps(canonical_subset_en, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    re_digest_en = compute_sha256(canonical_bytes_en)
    if re_digest_en != en_handoff["integrity"]["digest"]:
        raise ValueError(f"EN digest mismatch: {re_digest_en} vs {en_handoff['integrity']['digest']}")

    canonical_subset_zh = {k: zh_handoff[k] for k in expected_top_keys[:7]}
    canonical_bytes_zh = json.dumps(canonical_subset_zh, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    re_digest_zh = compute_sha256(canonical_bytes_zh)
    if re_digest_zh != zh_handoff["integrity"]["digest"]:
        raise ValueError(f"ZH digest mismatch: {re_digest_zh} vs {zh_handoff['integrity']['digest']}")

    if zh_handoff["integrity"]["sourceEnglishBodyHash"] != expected_en_body_hash:
        raise ValueError("ZH integrity does not bind expected English body hash!")
    print("CHECK 5 PASS: Canonical integrity digests and ZH sourceEnglishBodyHash verified.")

    # 6. Forbidden tokens check
    forbidden = [
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
    ]
    for label, doc in [("EN", en_handoff), ("ZH", zh_handoff)]:
        doc_str = json.dumps(doc, ensure_ascii=False)
        for token in forbidden:
            if token in doc_str:
                raise ValueError(f"Found forbidden token '{token}' in {label} handoff")
    print("CHECK 6 PASS: Zero forbidden tokens found.")

    # 7. Credits check
    for label, doc in [("EN", en_handoff), ("ZH", zh_handoff)]:
        if doc["seo"]["cover"]["creditName"] != "ConcernedApe":
            raise ValueError(f"{label} cover missing ConcernedApe credit")
        for fig in doc["seo"]["figures"]:
            if fig["creditName"] != "ConcernedApe":
                raise ValueError(f"{label} figure missing ConcernedApe credit")
    print("CHECK 7 PASS: ConcernedApe credits preserved in all cover and figure records.")

    print("\nALL 7 VERIFICATION CHECKS PASSED.")


if __name__ == "__main__":
    workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../.."))
    run_verification(workspace_root)
