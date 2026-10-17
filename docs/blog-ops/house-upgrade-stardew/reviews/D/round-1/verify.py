#!/usr/bin/env python3
"""
Role D Independent Verification Script for house-upgrade-stardew (Candidate draft-v2, Round 1).
Verifies byte sha256, NFC normalization, line endings, media-text alignment, and mechanical word counts.
"""

import hashlib
import json
import os
import subprocess
import unicodedata

AUDITED_FILE_PATHS = {
    "draft_v2": "docs/blog-ops/house-upgrade-stardew/content/en/draft-v2.md",
    "media_text": "docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json",
    "writer_submission": "docs/blog-ops/house-upgrade-stardew/content/en/writer-submission.json",
    "public_references": "docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json",
    "task_card": "docs/blog-ops/house-upgrade-stardew/layout/task-card.md",
    "writer_brief": "docs/blog-ops/house-upgrade-stardew/layout/writer-brief.md",
    "media_plan": "docs/blog-ops/house-upgrade-stardew/layout/media-plan.json",
    "facts": "docs/blog-ops/house-upgrade-stardew/research/A/facts.json",
    "revision_record": "docs/blog-ops/house-upgrade-stardew/content/en/revision-round-1.md",
}

EXPECTED_DRAFT_V2_SHA256 = "09a4609e07444e502549b80d4212dda6904b84d5f4dc0386d4320986f06a483f"
EXPECTED_MEDIA_TEXT_SHA256 = "55c74ccd28178097375e84cbf2dbdb3b307209d84585b52e20a0e757c573b56c"
WORD_COUNT_SCRIPT_PATH = "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py"


def inspect_file_encoding_and_checksum(file_label: str, target_file_path: str) -> dict:
    if not os.path.isfile(target_file_path):
        raise FileNotFoundError(f"Missing required audited file for {file_label}: {target_file_path}")

    with open(target_file_path, "rb") as file_stream:
        raw_bytes = file_stream.read()

    computed_sha256 = hashlib.sha256(raw_bytes).hexdigest()
    decoded_text = raw_bytes.decode("utf-8")
    is_nfc_normalized = unicodedata.is_normalized("NFC", decoded_text)
    contains_crlf = b"\r\n" in raw_bytes
    ends_with_newline = raw_bytes.endswith(b"\n")
    line_count = len(decoded_text.splitlines())

    return {
        "label": file_label,
        "path": target_file_path,
        "byte_count": len(raw_bytes),
        "sha256": computed_sha256,
        "is_nfc": is_nfc_normalized,
        "has_crlf": contains_crlf,
        "ends_with_newline": ends_with_newline,
        "line_count": line_count,
    }


def check_git_whitespace(file_paths_to_check: list[str]) -> dict:
    whitespace_results = {}
    for target_path in file_paths_to_check:
        execution = subprocess.run(
            ["git", "diff", "--check", "--no-index", "--", "/dev/null", target_path],
            capture_output=True,
            text=True,
        )
        has_whitespace_errors = bool(execution.stdout.strip() or execution.stderr.strip())
        whitespace_results[target_path] = {
            "exit_code": execution.returncode,
            "stdout": execution.stdout.strip(),
            "stderr": execution.stderr.strip(),
            "clean": not has_whitespace_errors,
        }
    return whitespace_results


def check_media_text_alignment(draft_markdown_path: str, media_json_path: str) -> dict:
    with open(draft_markdown_path, "r", encoding="utf-8") as draft_file:
        draft_content = draft_file.read()
    with open(media_json_path, "r", encoding="utf-8") as media_file:
        media_data = json.load(media_file)

    body_sha256_in_media = media_data.get("bodySha256", "")
    figures_list = media_data.get("figures", [])
    figure_alignments = []

    for figure_entry in figures_list:
        figure_id = figure_entry.get("mediaId", "")
        figure_role = figure_entry.get("role", "")
        source_url = figure_entry.get("src", "")
        alt_description = figure_entry.get("alt", "")
        caption_text = figure_entry.get("caption", "")

        is_source_present = source_url in draft_content
        is_alt_present = alt_description in draft_content
        is_caption_present = caption_text in draft_content

        figure_alignments.append({
            "media_id": figure_id,
            "role": figure_role,
            "src": source_url,
            "src_in_draft": is_source_present,
            "alt_in_draft": is_alt_present,
            "caption_in_draft": is_caption_present,
        })

    return {
        "body_sha_bound": body_sha256_in_media,
        "total_figures": len(figures_list),
        "figures": figure_alignments,
    }


def run_mechanical_word_counter(draft_path: str) -> dict:
    if not os.path.isfile(WORD_COUNT_SCRIPT_PATH):
        raise FileNotFoundError(f"Word counter script does not exist at {WORD_COUNT_SCRIPT_PATH}")

    execution = subprocess.run(
        ["python3", WORD_COUNT_SCRIPT_PATH, "--locale", "en", draft_path],
        capture_output=True,
        text=True,
    )
    if execution.returncode != 0:
        raise RuntimeError(f"Word counter failed with exit code {execution.returncode}: {execution.stderr}")

    return json.loads(execution.stdout)


def calculate_word_count_excluding_captions(draft_path: str) -> int:
    import sys
    sys.path.append(os.path.dirname(WORD_COUNT_SCRIPT_PATH))
    import 正文计数 as counter_module

    with open(draft_path, "r", encoding="utf-8") as draft_stream:
        raw_lines = draft_stream.read().splitlines()

    non_caption_lines = [single_line for single_line in raw_lines if not single_line.startswith("Schematic.")]
    extracted_body, _ = counter_module.extract_body("\n".join(non_caption_lines))
    return counter_module.count_units(extracted_body, "en")


def run_all_checks() -> dict:
    file_inspection_reports = {}
    for label, file_path in AUDITED_FILE_PATHS.items():
        report = inspect_file_encoding_and_checksum(label, file_path)
        file_inspection_reports[label] = report

    # Verify candidate SHA256 against expected dispatched hashes
    computed_draft_sha = file_inspection_reports["draft_v2"]["sha256"]
    computed_media_sha = file_inspection_reports["media_text"]["sha256"]

    if computed_draft_sha != EXPECTED_DRAFT_V2_SHA256:
        raise ValueError(
            f"Draft v2 sha256 mismatch! Expected {EXPECTED_DRAFT_V2_SHA256}, got {computed_draft_sha}"
        )
    if computed_media_sha != EXPECTED_MEDIA_TEXT_SHA256:
        raise ValueError(
            f"Media text sha256 mismatch! Expected {EXPECTED_MEDIA_TEXT_SHA256}, got {computed_media_sha}"
        )

    # Whitespace checks
    whitespace_results = check_git_whitespace([
        AUDITED_FILE_PATHS["draft_v2"],
        AUDITED_FILE_PATHS["media_text"],
    ])

    # Media text alignment
    media_alignment = check_media_text_alignment(
        AUDITED_FILE_PATHS["draft_v2"],
        AUDITED_FILE_PATHS["media_text"],
    )

    if media_alignment["body_sha_bound"] != computed_draft_sha:
        raise ValueError(
            f"media-text.en.json bound bodySha256 ({media_alignment['body_sha_bound']}) "
            f"does not match draft-v2 SHA256 ({computed_draft_sha})!"
        )

    # Word counts
    word_count_raw = run_mechanical_word_counter(AUDITED_FILE_PATHS["draft_v2"])
    word_count_without_captions = calculate_word_count_excluding_captions(AUDITED_FILE_PATHS["draft_v2"])

    summary = {
        "file_reports": file_inspection_reports,
        "whitespace_results": whitespace_results,
        "media_alignment": media_alignment,
        "mechanical_word_count": word_count_raw,
        "mechanical_units_without_captions": word_count_without_captions,
    }
    return summary


def main():
    print("=== Role D Independent Verification Execution (Round 1: draft-v2) ===")
    summary = run_all_checks()

    print("[Files Checked]")
    for label, rep in summary["file_reports"].items():
        print(f"  {label} ({rep['path']}):")
        print(f"    SHA256: {rep['sha256']}")
        print(f"    Bytes: {rep['byte_count']} | Lines: {rep['line_count']}")
        print(f"    NFC: {rep['is_nfc']} | CRLF: {rep['has_crlf']} | EndsNewline: {rep['ends_with_newline']}")

    print("\n[Whitespace Check]")
    for path, res in summary["whitespace_results"].items():
        print(f"  {path}: clean={res['clean']} (exit={res['exit_code']})")

    print("\n[Media Alignment]")
    align = summary["media_alignment"]
    print(f"  Bound bodySha256: {align['body_sha_bound']} (Matches draft-v2)")
    print(f"  Total figures: {align['total_figures']}")
    for fig in align["figures"]:
        print(f"    Figure '{fig['media_id']}' ({fig['role']}):")
        print(f"      src_in_draft: {fig['src_in_draft']}")
        print(f"      alt_in_draft: {fig['alt_in_draft']}")
        print(f"      caption_in_draft: {fig['caption_in_draft']}")

    print("\n[Word Count Preview (Author Preview)]")
    wc = summary["mechanical_word_count"]
    print(f"  Raw mechanical_units: {wc.get('mechanical_units')}")
    print(f"  Required floor: {wc.get('required_floor')}")
    print(f"  Meets floor: {wc.get('meets_mechanical_floor')}")
    print(f"  Without captions: {summary['mechanical_units_without_captions']}")
    print("  Note: Length gate is independently evaluated by Role F in tempering stage.")

    print("\n=== All Automated Verification Assertions Passed Successfully ===")


if __name__ == "__main__":
    main()
