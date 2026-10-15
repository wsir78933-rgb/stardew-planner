#!/usr/bin/env python3
"""Evidence collection script for Role D Round 1 (R1) review in rework-v2.

Executes mechanical counts, reference fidelity checks, and computes normalized
SHA-256 digests for all candidates and media assets.
"""
import hashlib
import json
import pathlib
import subprocess
import sys
import unicodedata


def compute_normalized_sha256(file_path: pathlib.Path) -> dict:
    if not file_path.is_file():
        raise FileNotFoundError(f"File not found for hash calculation: {file_path}")
    raw_bytes = file_path.read_bytes()
    raw_sha = hashlib.sha256(raw_bytes).hexdigest()
    try:
        text = raw_bytes.decode("utf-8")
        normalized_text = unicodedata.normalize("NFC", text.replace("\r\n", "\n").replace("\r", "\n"))
        normalized_sha = hashlib.sha256(normalized_text.encode("utf-8")).hexdigest()
        is_binary = False
    except UnicodeDecodeError:
        normalized_sha = raw_sha
        is_binary = True
    return {
        "file": str(file_path),
        "size_bytes": len(raw_bytes),
        "is_binary": is_binary,
        "sha256_raw": raw_sha,
        "sha256_nfc_lf": normalized_sha,
    }


def execute_mechanical_count(count_script: pathlib.Path, markdown_file: pathlib.Path, output_json: pathlib.Path, exit_file: pathlib.Path) -> dict:
    if not count_script.is_file():
        raise FileNotFoundError(f"Word count script missing: {count_script}")
    if not markdown_file.is_file():
        raise FileNotFoundError(f"Target markdown file missing: {markdown_file}")

    process = subprocess.run(
        [sys.executable, str(count_script), str(markdown_file), "--locale", "en"],
        capture_output=True,
        text=True,
        check=False,
    )
    exit_file.write_text(f"{process.returncode}\n", encoding="utf-8")
    if process.returncode != 0:
        raise RuntimeError(f"Word count script failed with exit code {process.returncode}: {process.stderr}")

    parsed_result = json.loads(process.stdout)
    output_json.write_text(process.stdout, encoding="utf-8")
    return parsed_result


def execute_reference_fidelity_check(references_json: pathlib.Path, body_markdown: pathlib.Path, output_log: pathlib.Path) -> dict:
    if not references_json.is_file():
        raise FileNotFoundError(f"References JSON missing: {references_json}")
    if not body_markdown.is_file():
        raise FileNotFoundError(f"Body markdown missing: {body_markdown}")

    references_payload = json.loads(references_json.read_text(encoding="utf-8"))
    body_content = body_markdown.read_text(encoding="utf-8")

    verification_lines = []
    failure_count = 0

    for item in references_payload.get("references", []):
        ref_id = item["id"]
        applies_to = item.get("appliesTo", {})
        quote_text = applies_to.get("quote", "")
        expected_occurrence = applies_to.get("occurrence", 1)

        actual_occurrences = body_content.count(quote_text)
        if actual_occurrences >= expected_occurrence and expected_occurrence > 0:
            status = "ok"
        else:
            status = "FAIL"
            failure_count += 1

        verification_lines.append(
            f"{status}\t{ref_id}\tcount={actual_occurrences}\toccurrence={expected_occurrence}"
        )

    verification_lines.append(f"FAILS {failure_count}\n")
    log_content = "\n".join(verification_lines)
    output_log.write_text(log_content, encoding="utf-8")

    return {
        "total_references": len(references_payload.get("references", [])),
        "failures": failure_count,
        "log_path": str(output_log),
    }


def record_all_hash_receipts(target_files: list[pathlib.Path], output_json: pathlib.Path) -> dict:
    receipts = {}
    for target_path in target_files:
        relative_key = str(target_path)
        receipts[relative_key] = compute_normalized_sha256(target_path)

    output_json.write_text(json.dumps(receipts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return receipts


def main() -> int:
    workspace_root = pathlib.Path.cwd()
    count_script = pathlib.Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")
    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    writing_dir = rework_dir / "writing"
    r1_dir = rework_dir / "checks-d/r1"

    r1_dir.mkdir(parents=True, exist_ok=True)

    full_body = writing_dir / "en-body.md"
    caption_excluded_body = writing_dir / "en-body.caption-excluded.md"
    references_json = writing_dir / "en-public-references.json"
    media_json = writing_dir / "en-media.json"
    media_manifest = rework_dir / "media/manifest.json"

    # Step 1: Count full body
    full_count_output = r1_dir / "count-full.stdout.json"
    full_count_exit = r1_dir / "count-full.exit.txt"
    execute_mechanical_count(count_script, full_body, full_count_output, full_count_exit)

    # Step 2: Count eligible (caption excluded) body
    eligible_count_output = r1_dir / "count-eligible.stdout.json"
    eligible_count_exit = r1_dir / "count-eligible.exit.txt"
    execute_mechanical_count(count_script, caption_excluded_body, eligible_count_output, eligible_count_exit)

    # Step 3: Reference fidelity
    fidelity_log_output = r1_dir / "reference-fidelity.stdout.txt"
    execute_reference_fidelity_check(references_json, full_body, fidelity_log_output)

    # Step 4: Hash receipts
    target_files_to_hash = [
        full_body,
        caption_excluded_body,
        references_json,
        media_json,
        media_manifest,
        rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.avif",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.avif",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.avif",
    ]
    hashes_output = r1_dir / "sha256-receipts.json"
    record_all_hash_receipts(target_files_to_hash, hashes_output)

    print("Role D R1 evidence collection completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
