#!/usr/bin/env python3
"""
Role D Independent Verification Script for house-upgrade-stardew (Candidate draft-v1).
Checks byte sha256, NFC normalization, line endings, media-text alignment, and mechanical word counts.
"""

import hashlib
import json
import os
import subprocess
import sys
import unicodedata

AUDITED_FILES = {
    "draft": "docs/blog-ops/house-upgrade-stardew/content/en/draft-v1.md",
    "media_text": "docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json",
    "writer_submission": "docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json",
    "public_references": "docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json",
    "task_card": "docs/blog-ops/house-upgrade-stardew/layout/task-card.md",
    "facts": "docs/blog-ops/house-upgrade-stardew/research/A/facts.json",
}

EXPECTED_DRAFT_SHA256 = "cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628"
EXPECTED_MEDIA_SHA256 = "95f5de88d26bd3a4bb3d666a37c5d8535055ed12aaea39047926840126dd6415"


def verify_file_encoding_and_hash(file_label: str, file_path: str) -> dict:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"Missing required audited file: {file_path}")

    raw_bytes = open(file_path, "rb").read()
    computed_sha = hashlib.sha256(raw_bytes).hexdigest()
    text = raw_bytes.decode("utf-8")
    is_nfc = unicodedata.is_normalized("NFC", text)
    has_crlf = b"\r\n" in raw_bytes
    ends_with_newline = raw_bytes.endswith(b"\n")
    line_count = len(text.splitlines())

    return {
        "file": file_path,
        "byte_count": len(raw_bytes),
        "sha256": computed_sha,
        "is_nfc": is_nfc,
        "has_crlf": has_crlf,
        "ends_with_newline": ends_with_newline,
        "line_count": line_count,
    }


def verify_git_whitespace(file_paths: list[str]) -> dict:
    results = {}
    for f in file_paths:
        cmd = ["git", "diff", "--check", "--no-index", "--", "/dev/null", f]
        res = subprocess.run(cmd, capture_output=True, text=True)
        # git diff --check --no-index against /dev/null returns exit code 1 if there is a diff,
        # but outputs whitespace errors to stderr or stdout if whitespace errors exist.
        results[f] = {
            "exit_code": res.returncode,
            "stdout": res.stdout.strip(),
            "stderr": res.stderr.strip(),
            "whitespace_clean": (res.stderr.strip() == "" and res.stdout.strip() == "")
        }
    return results


def verify_media_text_alignment(draft_path: str, media_path: str) -> dict:
    draft_text = open(draft_path, "r", encoding="utf-8").read()
    media_json = json.load(open(media_path, "r", encoding="utf-8"))

    figures_in_media = media_json.get("figures", [])
    alignment_records = []

    for fig in figures_in_media:
        src = fig.get("src", "")
        alt = fig.get("alt", "")
        caption = fig.get("caption", "")
        role = fig.get("role", "")
        media_id = fig.get("mediaId", "")

        src_in_draft = src in draft_text
        alt_in_draft = alt in draft_text
        caption_in_draft = caption in draft_text

        alignment_records.append({
            "media_id": media_id,
            "role": role,
            "src": src,
            "src_in_draft": src_in_draft,
            "alt_in_draft": alt_in_draft,
            "caption_in_draft": caption_in_draft,
        })

    return {
        "total_media_count": len(figures_in_media),
        "figures": alignment_records
    }


def verify_mechanical_word_count(draft_path: str) -> dict:
    script_path = "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py"
    if not os.path.isfile(script_path):
        return {"error": f"Script not found: {script_path}"}

    cmd = ["python3", script_path, "--locale", "en", draft_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        return {"error": res.stderr, "exit_code": res.returncode}

    return json.loads(res.stdout)


def main():
    print("=== Role D Independent Verification Execution ===")
    file_reports = {}
    for label, path in AUDITED_FILES.items():
        report = verify_file_encoding_and_hash(label, path)
        file_reports[label] = report
        print(f"[{label}] {path}")
        print(f"  SHA256: {report['sha256']}")
        print(f"  Bytes: {report['byte_count']} | Lines: {report['line_count']}")
        print(f"  NFC: {report['is_nfc']} | CRLF: {report['has_crlf']} | EndsNewline: {report['ends_with_newline']}")

    # Assert candidate sha256 matches coordinator dispatch
    if file_reports["draft"]["sha256"] != EXPECTED_DRAFT_SHA256:
        raise ValueError(
            f"Draft sha256 mismatch! Expected {EXPECTED_DRAFT_SHA256}, got {file_reports['draft']['sha256']}"
        )
    if file_reports["media_text"]["sha256"] != EXPECTED_MEDIA_SHA256:
        raise ValueError(
            f"Media text sha256 mismatch! Expected {EXPECTED_MEDIA_SHA256}, got {file_reports['media_text']['sha256']}"
        )
    print("✓ Candidate SHA256 matches coordinator assignment exactly.")

    # Whitespace check
    ws_results = verify_git_whitespace([AUDITED_FILES["draft"], AUDITED_FILES["media_text"]])
    for path, res in ws_results.items():
        clean_status = "PASS" if res["whitespace_clean"] else "FAIL"
        print(f"[Whitespace Check] {path}: {clean_status}")

    # Media alignment
    media_align = verify_media_text_alignment(AUDITED_FILES["draft"], AUDITED_FILES["media_text"])
    print(f"[Media Alignment] Total figures: {media_align['total_media_count']}")
    for fig in media_align["figures"]:
        print(f"  Figure {fig['media_id']} ({fig['role']}): src_in_draft={fig['src_in_draft']}, alt_in_draft={fig['alt_in_draft']}, caption_in_draft={fig['caption_in_draft']}")

    # Mechanical word count
    count_result = verify_mechanical_word_count(AUDITED_FILES["draft"])
    print(f"[Mechanical Word Count] Units: {count_result.get('mechanical_units')}, MeetsFloor: {count_result.get('meets_mechanical_floor')}")

    print("=== Verification Execution Finished ===")


if __name__ == "__main__":
    main()
