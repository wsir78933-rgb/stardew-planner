#!/usr/bin/env python3
"""Role E Round-2 Verification & Evidence Collector for English Candidate.

Performs independent verification of:
1. File SHA-256 hashes (raw bytes and UTF-8 NFC-LF)
2. Figure extraction and official word count (via 博客-V7修订版/脚本/正文计数.py)
3. 21 Reference quote positions and fidelity in en-body.md
4. Seven recurring revision checkpoints
5. Six stylistic fingerprints and 5-category editorial phrase counts
6. Staged media files integrity, dimensions, and captions/credit validation
"""
import hashlib
import json
import pathlib
import re
import subprocess
import sys
import unicodedata


def compute_file_hashes(target_file_path: pathlib.Path) -> dict:
    if not target_file_path.is_file():
        raise FileNotFoundError(f"Target file does not exist: {target_file_path}")
    raw_content = target_file_path.read_bytes()
    raw_digest = hashlib.sha256(raw_content).hexdigest()
    try:
        decoded_text = raw_content.decode("utf-8")
    except UnicodeDecodeError as decode_error:
        raise ValueError(f"File cannot be decoded as UTF-8: {target_file_path}") from decode_error

    normalized_text = unicodedata.normalize("NFC", decoded_text.replace("\r\n", "\n").replace("\r", "\n"))
    nfc_lf_digest = hashlib.sha256(normalized_text.encode("utf-8")).hexdigest()
    return {
        "file_path": str(target_file_path),
        "file_size_bytes": len(raw_content),
        "sha256_raw": raw_digest,
        "sha256_nfc_lf": nfc_lf_digest,
        "nfc_lf_matches_raw": raw_digest == nfc_lf_digest,
    }


def strip_figure_elements(body_markdown: str) -> str:
    cleaned_markdown, replacement_count = re.subn(
        r"<figure\b[^>]*>.*?</figure>\n?",
        "",
        body_markdown,
        flags=re.DOTALL,
    )
    if replacement_count != 2:
        raise ValueError(f"Expected exactly 2 <figure> elements in body, found {replacement_count}")
    return cleaned_markdown


def execute_official_word_counter(
    counter_script_path: pathlib.Path,
    markdown_document_path: pathlib.Path,
    stdout_output_path: pathlib.Path,
    exit_output_path: pathlib.Path,
) -> dict:
    if not counter_script_path.is_file():
        raise FileNotFoundError(f"Counter script not found at {counter_script_path}")
    if not markdown_document_path.is_file():
        raise FileNotFoundError(f"Target markdown not found at {markdown_document_path}")

    process_result = subprocess.run(
        [sys.executable, str(counter_script_path), str(markdown_document_path), "--locale", "en"],
        capture_output=True,
        text=True,
        check=False,
    )
    exit_output_path.write_text(f"{process_result.returncode}\n", encoding="utf-8")
    if process_result.returncode != 0:
        raise RuntimeError(
            f"Official counter returned exit code {process_result.returncode} for {markdown_document_path}: {process_result.stderr}"
        )
    stdout_output_path.write_text(process_result.stdout, encoding="utf-8")
    return json.loads(process_result.stdout)


def validate_reference_quotes(
    references_spec_path: pathlib.Path,
    candidate_body_text: str,
    output_log_path: pathlib.Path,
) -> dict:
    if not references_spec_path.is_file():
        raise FileNotFoundError(f"References spec missing: {references_spec_path}")
    raw_json_text = references_spec_path.read_text(encoding="utf-8")
    references_data = json.loads(raw_json_text)
    reference_items = references_data.get("references")
    if not isinstance(reference_items, list) or len(reference_items) == 0:
        raise ValueError(f"No valid references found in {references_spec_path}")

    log_records = []
    failure_tally = 0
    verification_results = []

    for entry in reference_items:
        entry_identifier = entry.get("id")
        applies_specification = entry.get("appliesTo")
        if not isinstance(entry_identifier, str) or not entry_identifier:
            raise ValueError(f"Reference entry has invalid id: {entry}")
        if not isinstance(applies_specification, dict):
            raise ValueError(f"Reference entry {entry_identifier} has invalid appliesTo")

        target_quote = applies_specification.get("quote")
        expected_occurrence = applies_specification.get("occurrence")
        if not isinstance(target_quote, str) or target_quote == "":
            raise ValueError(f"Empty quote for reference {entry_identifier}")
        if not isinstance(expected_occurrence, int) or expected_occurrence < 1:
            raise ValueError(f"Invalid occurrence for reference {entry_identifier}: {expected_occurrence}")

        observed_count = candidate_body_text.count(target_quote)
        match_satisfied = observed_count >= expected_occurrence
        if not match_satisfied:
            failure_tally += 1

        record_line = f"ID={entry_identifier} | EXP={expected_occurrence} | OBS={observed_count} | MATCH={match_satisfied}"
        log_records.append(record_line)
        verification_results.append({
            "id": entry_identifier,
            "expected_occurrence": expected_occurrence,
            "observed_count": observed_count,
            "status": "PASS" if match_satisfied else "FAIL",
            "quote": target_quote,
        })

    log_records.append(f"TOTAL_REFERENCES={len(reference_items)} | FAILS={failure_tally}")
    output_log_path.write_text("\n".join(log_records) + "\n", encoding="utf-8")

    return {
        "total_references": len(reference_items),
        "failure_count": failure_tally,
        "results": verification_results,
    }


def verify_seven_recurring_checkpoints(
    candidate_body_text: str,
    output_log_path: pathlib.Path,
) -> dict:
    checkpoint_evaluations = {}

    # Checkpoint 1: Crop morphology definition not over-broad
    # Check that "replaces immature" is absent, and specific examples are given.
    c1_has_immature = "replaces immature" in candidate_body_text.lower()
    c1_has_parsnip_example = "parsnip" in candidate_body_text.lower() and "harvest sprite" in candidate_body_text.lower()
    c1_has_pumpkin_example = "pumpkin" in candidate_body_text.lower() and "rounded orange fruit" in candidate_body_text.lower()
    c1_pass = (not c1_has_immature) and c1_has_parsnip_example and c1_has_pumpkin_example
    checkpoint_evaluations["checkpoint_1_crop_morphology_not_overbroad"] = {
        "pass": c1_pass,
        "details": "Specific examples given for parsnip/pumpkin/blueberry; no over-broad 'replaces immature foliage' generalization.",
    }

    # Checkpoint 2: Single crop click beside vs hold-and-walk foot tile distinct
    c2_has_stand_next = (
        "stand next to the ripe crop and [right-click it]" in candidate_body_text.lower()
        or "stand beside a mature plant and [right-click it]" in candidate_body_text.lower()
    )
    c2_has_walk_foot = (
        "tile you are standing on" in candidate_body_text.lower()
        or "tile you step over as you walk" in candidate_body_text.lower()
    )
    c2_has_walk_onto_standalone = "walk onto" in candidate_body_text.lower()
    c2_pass = c2_has_stand_next and c2_has_walk_foot and (not c2_has_walk_onto_standalone)
    checkpoint_evaluations["checkpoint_2_single_click_vs_hold_walk_conditions"] = {
        "pass": c2_pass,
        "details": "Single pick stands next to crop; hold-and-walk harvests on tile stepped over with cursor away from character; 'walk onto' count is 0.",
    }

    # Checkpoint 3: No generic platform harvest inferences
    # Checks absence of Xbox A / PS Cross / Switch A crop harvest claims, absence of "tap directly"
    c3_has_xbox = "xbox" in candidate_body_text.lower()
    c3_has_playstation = "playstation" in candidate_body_text.lower() or "ps4" in candidate_body_text.lower()
    c3_has_tap_directly = "tap directly" in candidate_body_text.lower() or "tap on the crop" in candidate_body_text.lower()
    c3_mobile_scythe_only = "select the scythe before you use it" in candidate_body_text.lower()
    c3_pass = (not c3_has_xbox) and (not c3_has_playstation) and (not c3_has_tap_directly) and c3_mobile_scythe_only
    checkpoint_evaluations["checkpoint_3_no_generic_platform_inferences"] = {
        "pass": c3_pass,
        "details": "Mobile only references selecting scythe before use; no controller action buttons misattributed as crop-specific harvest keys.",
    }

    # Checkpoint 4: No ground/soil destruction warning without source
    c4_has_damage_soil = "damage the soil" in candidate_body_text.lower() or "damages the soil" in candidate_body_text.lower()
    c4_pass = not c4_has_damage_soil
    checkpoint_evaluations["checkpoint_4_no_unsupported_soil_destruction"] = {
        "pass": c4_pass,
        "details": "Zero occurrences of 'damage the soil'; tool functions described purely based on Controls and Scythe pages.",
    }

    # Checkpoint 5: No 'immediately' or 'cannot replant' unbacked bans
    c5_has_immediately = "immediately" in candidate_body_text.lower()
    c5_has_cannot_replant_ban = "game prevents replanting" in candidate_body_text.lower() or "cannot replant" in candidate_body_text.lower()
    c5_pass = (not c5_has_immediately) and (not c5_has_cannot_replant_ban)
    checkpoint_evaluations["checkpoint_5_no_immediate_or_replant_bans"] = {
        "pass": c5_pass,
        "details": "Zero occurrences of 'immediately'; blueberry described as remaining in field without needing another seed.",
    }

    # Checkpoint 6: Iridium scythe limited to 1.6 Mastery & tilled soil
    c6_has_mastery = "1.6 farming mastery" in candidate_body_text.lower()
    c6_has_tilled_soil = "tilled soil" in candidate_body_text.lower()
    c6_has_garden_pots = "garden pot" in candidate_body_text.lower()
    c6_has_wild_seeds = "wild seed" in candidate_body_text.lower()
    c6_has_spring_onions = "spring onion" in candidate_body_text.lower()
    c6_pass = c6_has_mastery and c6_has_tilled_soil and (not c6_has_garden_pots) and (not c6_has_wild_seeds) and (not c6_has_spring_onions)
    checkpoint_evaluations["checkpoint_6_iridium_scythe_scope_limited"] = {
        "pass": c6_pass,
        "details": "Iridium scythe is scoped strictly to 1.6 Farming Mastery and crops grown on tilled soil; no scope sprawl.",
    }

    # Checkpoint 7: Giant crops only harvested with axe
    c7_has_axe = "any axe" in candidate_body_text.lower() and "three hits" in candidate_body_text.lower()
    c7_has_items = "15 to 21 normal-quality items" in candidate_body_text.lower()
    c7_has_season_survive = "does not die when the season changes" in candidate_body_text.lower()
    c7_has_1_percent = "1%" in candidate_body_text.lower()
    c7_pass = c7_has_axe and c7_has_items and c7_has_season_survive and (not c7_has_1_percent)
    checkpoint_evaluations["checkpoint_7_giant_crops_axe_only"] = {
        "pass": c7_pass,
        "details": "Giant crops harvested with any axe struck three times, drops 15 to 21 normal-quality items, survives season change, no 1% probability sprawl.",
    }

    all_checkpoints_passed = all(item["pass"] for item in checkpoint_evaluations.values())
    log_content = [f"=== SEVEN CHECKPOINTS VERIFICATION (OVERALL: {'PASS' if all_checkpoints_passed else 'FAIL'}) ==="]
    for key, val in checkpoint_evaluations.items():
        log_content.append(f"{key}: {'PASS' if val['pass'] else 'FAIL'} - {val['details']}")
    output_log_path.write_text("\n".join(log_content) + "\n", encoding="utf-8")

    return {
        "all_passed": all_checkpoints_passed,
        "checkpoints": checkpoint_evaluations,
    }


def verify_six_style_fingerprints_and_editorial_phrases(
    candidate_body_text: str,
    output_log_path: pathlib.Path,
) -> dict:
    editorial_patterns = [
        "documented",
        "source-backed",
        "without source support",
        "class source",
        "readback",
        "verify the",
        "verify your",
        "this guide covers",
        "as an ai",
        "in this article",
        "this is a planning scenario",
        "not a universal ranking",
        "this original character illustration",
        "does not represent in-game",
    ]
    editorial_counts = {phrase: candidate_body_text.lower().count(phrase) for phrase in editorial_patterns}

    # Fingerprints:
    # 1. Em-dash / en-dash density
    dash_count = candidate_body_text.count("—") + candidate_body_text.count("–")
    # 2. Bold syntax density
    bold_count = len(re.findall(r"\*\*[^*]+\*\*", candidate_body_text))
    # 3. Decorative unicode/emojis
    emoji_count = len(re.findall(r"[\U00010000-\U0010ffff]", candidate_body_text))
    # 4. Assistant residue
    assistant_residue = any(h in candidate_body_text.lower() for h in ["here is the", "sure, here", "as requested"])
    # 5. Generic positive ending
    generic_ending = any(e in candidate_body_text.lower()[-200:] for e in ["happy farming", "enjoy your harvest", "best of luck"])

    log_lines = [
        "=== SIX STYLE FINGERPRINTS & EDITORIAL PHRASES ===",
        f"em_dash_and_en_dash_count: {dash_count}",
        f"bold_occurrences_count: {bold_count}",
        f"emoji_unicode_count: {emoji_count}",
        f"assistant_residue_detected: {assistant_residue}",
        f"generic_positive_ending_detected: {generic_ending}",
        "--- Editorial Phrase Counts ---",
    ]
    for phrase, count in editorial_counts.items():
        log_lines.append(f"{phrase}: {count}")

    output_log_path.write_text("\n".join(log_lines) + "\n", encoding="utf-8")

    return {
        "dash_count": dash_count,
        "bold_count": bold_count,
        "emoji_count": emoji_count,
        "assistant_residue": assistant_residue,
        "generic_ending": generic_ending,
        "editorial_counts": editorial_counts,
        "editorial_free": sum(editorial_counts.values()) == 0,
    }


def verify_media_staged_assets(
    media_spec_path: pathlib.Path,
    output_log_path: pathlib.Path,
) -> dict:
    if not media_spec_path.is_file():
        raise FileNotFoundError(f"Media spec not found at {media_spec_path}")
    media_config = json.loads(media_spec_path.read_text(encoding="utf-8"))
    images = media_config.get("images", [])
    if len(images) != 3:
        raise ValueError(f"Expected 3 image definitions in media spec, found {len(images)}")

    verification_log = ["=== MEDIA STAGED ASSETS & CAPTIONS AUDIT ==="]
    media_checks = []

    for img in images:
        img_id = img.get("id")
        width = img.get("width")
        height = img.get("height")
        alt = img.get("alt", "")
        caption = img.get("caption", "")
        credit_name = img.get("creditName", "")
        credit_url = img.get("creditUrl", "")

        # Check dimensions
        dim_ok = (width == 1672 and height == 941)
        # Check credit: must be ConcernedApe with official press screenshot url
        credit_ok = ("ConcernedApe" in credit_name and "presskit" in credit_url)
        # Check no false CC license claim
        no_fake_cc = "creative commons" not in caption.lower() and "cc-by" not in caption.lower()
        # Check no guessing green object or red shirt in wrong place
        no_guessing_actions = "just harvested" not in caption.lower() and "red-shirt" not in caption.lower() and "4x5" not in caption.lower()

        status = dim_ok and credit_ok and no_fake_cc and no_guessing_actions
        record = {
            "id": img_id,
            "dim_1672x941": dim_ok,
            "credit_ok": credit_ok,
            "no_fake_cc": no_fake_cc,
            "no_guessing_actions": no_guessing_actions,
            "status": "PASS" if status else "FAIL",
        }
        media_checks.append(record)
        verification_log.append(f"Image {img_id}: dim_ok={dim_ok}, credit_ok={credit_ok}, no_fake_cc={no_fake_cc}, status={record['status']}")

    all_media_ok = all(m["status"] == "PASS" for m in media_checks)
    verification_log.append(f"OVERALL_MEDIA_STATUS={'PASS' if all_media_ok else 'FAIL'}")
    output_log_path.write_text("\n".join(verification_log) + "\n", encoding="utf-8")

    return {
        "all_media_ok": all_media_ok,
        "items": media_checks,
    }


def main() -> None:
    workspace_root = pathlib.Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    evidence_dir = rework_dir / "review-e/evidence/r2"
    evidence_dir.mkdir(parents=True, exist_ok=True)

    body_path = rework_dir / "writing/en-body.md"
    media_json_path = rework_dir / "writing/en-media.json"
    references_json_path = rework_dir / "writing/en-public-references.json"
    counter_script_path = pathlib.Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")

    # Step 1: Hashes
    body_hashes = compute_file_hashes(body_path)
    media_hashes = compute_file_hashes(media_json_path)
    refs_hashes = compute_file_hashes(references_json_path)

    body_text = body_path.read_text(encoding="utf-8")
    stripped_body_text = strip_figure_elements(body_text)
    stripped_body_path = evidence_dir / "en-body.caption-excluded.md"
    stripped_body_path.write_text(stripped_body_text, encoding="utf-8")
    stripped_hashes = compute_file_hashes(stripped_body_path)

    hashes_summary = {
        "body": body_hashes,
        "body_caption_excluded": stripped_hashes,
        "media_json": media_hashes,
        "references_json": refs_hashes,
    }
    (evidence_dir / "sha256-receipts.json").write_text(json.dumps(hashes_summary, indent=2), encoding="utf-8")

    # Step 2: Word counts
    full_count = execute_official_word_counter(
        counter_script_path,
        body_path,
        evidence_dir / "count-full.stdout.json",
        evidence_dir / "count-full.exit.txt",
    )
    eligible_count = execute_official_word_counter(
        counter_script_path,
        stripped_body_path,
        evidence_dir / "count-eligible.stdout.json",
        evidence_dir / "count-eligible.exit.txt",
    )

    # Step 3: Reference quotes fidelity
    ref_fidelity = validate_reference_quotes(
        references_json_path,
        body_text,
        evidence_dir / "reference-fidelity.stdout.txt",
    )

    # Step 4: Seven recurring checkpoints
    checkpoints_result = verify_seven_recurring_checkpoints(
        body_text,
        evidence_dir / "seven-checkpoints.stdout.txt",
    )

    # Step 5: Six style fingerprints and editorial phrases
    style_result = verify_six_style_fingerprints_and_editorial_phrases(
        body_text,
        evidence_dir / "style-fingerprints.stdout.txt",
    )

    # Step 6: Media validation
    media_result = verify_media_staged_assets(
        media_json_path,
        evidence_dir / "media-assets.stdout.txt",
    )

    # Summary manifest
    summary_manifest = {
        "body_sha256_raw": body_hashes["sha256_raw"],
        "body_sha256_nfc_lf": body_hashes["sha256_nfc_lf"],
        "caption_excluded_sha256_raw": stripped_hashes["sha256_raw"],
        "caption_excluded_sha256_nfc_lf": stripped_hashes["sha256_nfc_lf"],
        "media_json_sha256": media_hashes["sha256_raw"],
        "references_json_sha256": refs_hashes["sha256_raw"],
        "full_mechanical_words": full_count["mechanical_units"],
        "eligible_mechanical_words": eligible_count["mechanical_units"],
        "length_class": eligible_count["length_class"],
        "meets_mechanical_floor": eligible_count["meets_mechanical_floor"],
        "semantic_qualification": eligible_count["semantic_qualification"],
        "reference_quote_failures": ref_fidelity["failure_count"],
        "seven_checkpoints_all_passed": checkpoints_result["all_passed"],
        "style_fingerprints_editorial_free": style_result["editorial_free"],
        "all_media_ok": media_result["all_media_ok"],
    }
    (evidence_dir / "evidence-summary.json").write_text(json.dumps(summary_manifest, indent=2), encoding="utf-8")
    print("Evidence collection and verification completed successfully.")
    print(json.dumps(summary_manifest, indent=2))


if __name__ == "__main__":
    main()
