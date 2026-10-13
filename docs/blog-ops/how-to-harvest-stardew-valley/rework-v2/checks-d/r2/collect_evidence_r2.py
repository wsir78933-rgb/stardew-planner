#!/usr/bin/env python3
"""Role D round-2 receipts: hashes, official word count, quote locations, image size.

Reads the current English candidate only. Does not edit the article, media bytes,
or earlier review files. Fails if a required file, quote, or image header is missing.
"""
import hashlib
import json
import pathlib
import re
import struct
import subprocess
import sys
import unicodedata


def read_utf8(path: pathlib.Path) -> str:
    if not path.is_file():
        raise FileNotFoundError(f"Missing file: {path}")
    raw_bytes = path.read_bytes()
    try:
        return raw_bytes.decode("utf-8")
    except UnicodeDecodeError as decode_error:
        raise ValueError(f"File is not UTF-8: {path}") from decode_error


def nfc_lf_sha256(path: pathlib.Path) -> dict:
    if not path.is_file():
        raise FileNotFoundError(f"Missing file for hash: {path}")
    raw_bytes = path.read_bytes()
    raw_sha = hashlib.sha256(raw_bytes).hexdigest()
    try:
        text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        return {
            "path": str(path),
            "size_bytes": len(raw_bytes),
            "encoding": "binary",
            "sha256_raw": raw_sha,
            "sha256_nfc_lf": raw_sha,
        }
    normalized = unicodedata.normalize("NFC", text.replace("\r\n", "\n").replace("\r", "\n"))
    return {
        "path": str(path),
        "size_bytes": len(raw_bytes),
        "encoding": "utf-8",
        "sha256_raw": raw_sha,
        "sha256_nfc_lf": hashlib.sha256(normalized.encode("utf-8")).hexdigest(),
        "nfc_lf_matches_raw": hashlib.sha256(normalized.encode("utf-8")).hexdigest() == raw_sha,
    }


def strip_figure_blocks(markdown_text: str) -> str:
    stripped, replacements = re.subn(
        r"<figure\b[^>]*>.*?</figure>\n?",
        "",
        markdown_text,
        flags=re.S,
    )
    if replacements != 2:
        raise ValueError(f"Expected 2 figure blocks, removed {replacements}")
    return stripped


def run_official_counter(counter_path: pathlib.Path, markdown_path: pathlib.Path, stdout_path: pathlib.Path, exit_path: pathlib.Path) -> dict:
    if not counter_path.is_file():
        raise FileNotFoundError(f"Official counter missing: {counter_path}")
    completed = subprocess.run(
        [sys.executable, str(counter_path), str(markdown_path), "--locale", "en"],
        capture_output=True,
        text=True,
        check=False,
    )
    exit_path.write_text(f"{completed.returncode}\n", encoding="utf-8")
    if completed.returncode != 0:
        raise RuntimeError(
            f"Counter exit {completed.returncode} for {markdown_path}: {completed.stderr}"
        )
    stdout_path.write_text(completed.stdout, encoding="utf-8")
    return json.loads(completed.stdout)


def locate_quotes(references_path: pathlib.Path, body_text: str, log_path: pathlib.Path) -> dict:
    payload = json.loads(read_utf8(references_path))
    references = payload.get("references")
    if not isinstance(references, list) or not references:
        raise ValueError(f"references list missing or empty in {references_path}")
    lines = []
    failure_count = 0
    for item in references:
        ref_id = item.get("id")
        applies_to = item.get("appliesTo")
        if not isinstance(ref_id, str) or not ref_id:
            raise ValueError(f"Reference id missing in {references_path}")
        if not isinstance(applies_to, dict):
            raise ValueError(f"appliesTo missing for {ref_id}")
        quote_text = applies_to.get("quote")
        occurrence = applies_to.get("occurrence")
        if not isinstance(quote_text, str) or quote_text == "":
            raise ValueError(f"Empty quote for {ref_id}")
        if not isinstance(occurrence, int) or occurrence < 1:
            raise ValueError(f"Invalid occurrence for {ref_id}: {occurrence!r}")
        actual_count = body_text.count(quote_text)
        status = "ok" if actual_count >= occurrence else "FAIL"
        if status == "FAIL":
            failure_count += 1
        lines.append(f"{status}\t{ref_id}\tcount={actual_count}\toccurrence={occurrence}")
    lines.append(f"FAILS {failure_count}")
    log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return {"total_references": len(references), "failures": failure_count}


def png_pixel_size(path: pathlib.Path) -> dict:
    if not path.is_file():
        raise FileNotFoundError(f"Missing PNG: {path}")
    header = path.read_bytes()[:24]
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Not a PNG: {path}")
    length, chunk_type = struct.unpack(">I4s", header[8:16])
    if chunk_type != b"IHDR" or length < 8:
        raise ValueError(f"PNG IHDR missing: {path}")
    width, height = struct.unpack(">II", header[16:24])
    if width <= 0 or height <= 0:
        raise ValueError(f"PNG size invalid for {path}: {width}x{height}")
    return {"path": str(path), "width": width, "height": height}


def sips_pixel_size(path: pathlib.Path) -> dict:
    if not path.is_file():
        raise FileNotFoundError(f"Missing image: {path}")
    completed = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError(f"sips exit {completed.returncode} for {path}: {completed.stderr}")
    width_match = re.search(r"pixelWidth:\s*(\d+)", completed.stdout)
    height_match = re.search(r"pixelHeight:\s*(\d+)", completed.stdout)
    if width_match is None or height_match is None:
        raise ValueError(f"sips did not report size for {path}: {completed.stdout!r}")
    return {
        "path": str(path),
        "width": int(width_match.group(1)),
        "height": int(height_match.group(1)),
        "sips_exit": completed.returncode,
    }


def count_phrases(body_text: str) -> dict:
    phrases = [
        "immediately",
        "cannot reseed",
        "cannot replant",
        "does not need another seed",
        "damage the soil",
        "tap directly",
        "Xbox",
        "walk onto",
        "Garden Pot",
        "spring onion",
        "wild seed",
        "replaces immature",
        "Cauliflower",
        "Powdermelon",
        "Qi fruit",
        "documented",
        "source-backed",
        "This guide",
        "readback",
        "final harvest sprite",
        "stand next to the ripe crop",
        "hold right-click",
        "mouse not near your character",
        "15 to 21",
        "Farming Mastery",
        "do not require daily watering",
    ]
    return {phrase: body_text.count(phrase) for phrase in phrases}


def main() -> int:
    workspace_root = pathlib.Path.cwd()
    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    writing_dir = rework_dir / "writing"
    evidence_dir = rework_dir / "checks-d/r2"
    evidence_dir.mkdir(parents=True, exist_ok=True)
    counter_path = pathlib.Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")

    body_path = writing_dir / "en-body.md"
    references_path = writing_dir / "en-public-references.json"
    media_json_path = writing_dir / "en-media.json"
    manifest_path = rework_dir / "media/manifest.json"
    writer_caption_path = writing_dir / "r2/en-body.caption-excluded.md"
    body_text = read_utf8(body_path)

    stripped_text = strip_figure_blocks(body_text)
    stripped_path = evidence_dir / "en-body.caption-excluded.md"
    stripped_path.write_text(stripped_text, encoding="utf-8")

    full_count = run_official_counter(
        counter_path,
        body_path,
        evidence_dir / "count-full.stdout.json",
        evidence_dir / "count-full.exit.txt",
    )
    eligible_count = run_official_counter(
        counter_path,
        stripped_path,
        evidence_dir / "count-eligible.stdout.json",
        evidence_dir / "count-eligible.exit.txt",
    )
    quote_result = locate_quotes(references_path, body_text, evidence_dir / "reference-fidelity.stdout.txt")

    hash_targets = [
        body_path,
        stripped_path,
        writer_caption_path,
        references_path,
        media_json_path,
        manifest_path,
        rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.avif",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.avif",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.webp",
        rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.avif",
        rework_dir / "media/decoded/how-to-harvest-stardew-valley-cover.webp.png",
        rework_dir / "media/decoded/how-to-harvest-stardew-valley-mature-crops.webp.png",
        rework_dir / "media/decoded/how-to-harvest-stardew-valley-trellis-paths.webp.png",
    ]
    hash_receipts = {str(path): nfc_lf_sha256(path) for path in hash_targets}

    decoded_sizes = [
        png_pixel_size(rework_dir / "media/decoded/how-to-harvest-stardew-valley-cover.webp.png"),
        png_pixel_size(rework_dir / "media/decoded/how-to-harvest-stardew-valley-mature-crops.webp.png"),
        png_pixel_size(rework_dir / "media/decoded/how-to-harvest-stardew-valley-trellis-paths.webp.png"),
    ]
    staged_sizes = [
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.webp"),
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-cover.avif"),
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.webp"),
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-mature-crops.avif"),
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.webp"),
        sips_pixel_size(rework_dir / "media/staged/how-to-harvest-stardew-valley-trellis-paths.avif"),
    ]

    media_payload = json.loads(read_utf8(media_json_path))
    references_payload = json.loads(read_utf8(references_path))
    body_nfc = hash_receipts[str(body_path)]["sha256_nfc_lf"]
    binding = {
        "body_sha256_nfc_lf": body_nfc,
        "en_media_bodySha256NfcLf": media_payload.get("bodySha256NfcLf"),
        "en_references_bodyHash": references_payload.get("bodyHash"),
        "media_binding_matches_body": media_payload.get("bodySha256NfcLf") == body_nfc,
        "references_binding_matches_body": references_payload.get("bodyHash") == body_nfc,
        "writer_caption_file_matches_independent_strip": (
            hash_receipts[str(writer_caption_path)]["sha256_nfc_lf"]
            == hash_receipts[str(stripped_path)]["sha256_nfc_lf"]
        ),
    }
    if not binding["media_binding_matches_body"] or not binding["references_binding_matches_body"]:
        raise ValueError(f"Body hash binding mismatch: {binding}")

    receipt = {
        "full_count": full_count,
        "eligible_count": eligible_count,
        "quotes": quote_result,
        "binding": binding,
        "phrase_counts": count_phrases(body_text),
        "decoded_png_sizes": decoded_sizes,
        "staged_sips_sizes": staged_sizes,
        "hashes": hash_receipts,
    }
    receipt_path = evidence_dir / "sha256-receipts.json"
    receipt_path.write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "full_units": full_count["mechanical_units"],
        "full_exit_recorded": True,
        "eligible_units": eligible_count["mechanical_units"],
        "eligible_class": eligible_count["length_class"],
        "quote_failures": quote_result["failures"],
        "quote_total": quote_result["total_references"],
        "body_sha256_nfc_lf": body_nfc,
        "binding": binding,
        "decoded_png_sizes": decoded_sizes,
        "staged_sips_sizes": staged_sizes,
    }, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
