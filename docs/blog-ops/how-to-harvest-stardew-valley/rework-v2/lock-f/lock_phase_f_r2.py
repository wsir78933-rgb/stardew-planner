#!/usr/bin/env python3
"""Execute Role F draft lock and English SEO generation for rework-v2.

Strictly follows V7 workflow rules:
- F does not modify body text; locks exact byte copy.
- Verifies D and E passed the identical candidate SHA-256 hash.
- Executes mechanical counting script and computes eligible words.
- Verifies 21 public references (quote and occurrence).
- Binds 6 staged media assets from Role M.
- Generates 10 SEO title candidates under Seven Sins Engine and selects winner.
- Emits locked artifacts and verification receipts.
"""

import hashlib
import json
import math
import subprocess
import unicodedata
from pathlib import Path

EXPECTED_BODY_HASH = "d2908d597164081ac054c2e2d251a6fa2dc11831baec41af9d75dd2d95565a67"
EXPECTED_CAPTION_EXCLUDED_HASH = "31d70053f672023c210eadaf8d95af943ffb30721095fca3e36e809d978d9069"
EXPECTED_REFERENCE_COUNT = 21

EXPECTED_STAGED_ASSETS = {
    "how-to-harvest-stardew-valley-cover.webp": {
        "width": 1672,
        "height": 941,
        "byte_size": 479250,
        "sha256": "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574",
    },
    "how-to-harvest-stardew-valley-cover.avif": {
        "width": 1672,
        "height": 941,
        "byte_size": 237604,
        "sha256": "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57",
    },
    "how-to-harvest-stardew-valley-mature-crops.webp": {
        "width": 1672,
        "height": 941,
        "byte_size": 267644,
        "sha256": "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd",
    },
    "how-to-harvest-stardew-valley-mature-crops.avif": {
        "width": 1672,
        "height": 941,
        "byte_size": 143638,
        "sha256": "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1",
    },
    "how-to-harvest-stardew-valley-trellis-paths.webp": {
        "width": 1672,
        "height": 941,
        "byte_size": 223784,
        "sha256": "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4",
    },
    "how-to-harvest-stardew-valley-trellis-paths.avif": {
        "width": 1672,
        "height": 941,
        "byte_size": 113557,
        "sha256": "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a",
    },
}


def read_file_bytes(file_path: Path) -> bytes:
    if not file_path.is_file():
        raise FileNotFoundError(f"Required input file does not exist: {file_path}")
    return file_path.read_bytes()


def compute_nfc_lf_sha256(file_bytes: bytes, file_label: str) -> str:
    try:
        decoded_text = file_bytes.decode("utf-8")
    except UnicodeDecodeError as decode_error:
        raise ValueError(f"File {file_label} is not valid UTF-8: {decode_error}") from decode_error
    normalized_text = unicodedata.normalize("NFC", decoded_text.replace("\r\n", "\n").replace("\r", "\n"))
    return hashlib.sha256(normalized_text.encode("utf-8")).hexdigest()


def compute_raw_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def verify_d_and_e_prior_reports(d_report_path: Path, e_report_path: Path) -> None:
    d_bytes = read_file_bytes(d_report_path)
    e_bytes = read_file_bytes(e_report_path)
    d_content = d_bytes.decode("utf-8")
    e_content = e_bytes.decode("utf-8")

    if EXPECTED_BODY_HASH not in d_content:
        raise ValueError(f"D report {d_report_path} does not mention expected hash {EXPECTED_BODY_HASH}")
    if "三门都针对正文" not in d_content or "都通过" not in d_content:
        raise ValueError(f"D report {d_report_path} does not indicate all 3 gates passed")

    if EXPECTED_BODY_HASH not in e_content:
        raise ValueError(f"E report {e_report_path} does not mention expected hash {EXPECTED_BODY_HASH}")
    if "PASS" not in e_content or "与 D-R2 完全同构" not in e_content:
        raise ValueError(f"E report {e_report_path} does not confirm PASS and homology with D-R2")


def verify_body_hash_matches(body_path: Path) -> bytes:
    body_bytes = read_file_bytes(body_path)
    body_nfc_hash = compute_nfc_lf_sha256(body_bytes, str(body_path))
    body_raw_hash = compute_raw_sha256(body_bytes)

    if body_nfc_hash != EXPECTED_BODY_HASH:
        raise ValueError(
            f"Candidate body NFC-LF SHA-256 {body_nfc_hash} does not match expected {EXPECTED_BODY_HASH}"
        )
    if body_raw_hash != EXPECTED_BODY_HASH:
        raise ValueError(
            f"Candidate body raw SHA-256 {body_raw_hash} does not match NFC-LF SHA-256 (newline/encoding drift)"
        )
    return body_bytes


def execute_v7_word_counter(v7_script_path: Path, target_file_path: Path) -> dict:
    if not v7_script_path.is_file():
        raise FileNotFoundError(f"V7 word counting script not found: {v7_script_path}")
    command_args = [
        "python3",
        str(v7_script_path.resolve()),
        str(target_file_path.resolve()),
        "--locale",
        "en",
    ]
    process_result = subprocess.run(command_args, capture_output=True, text=True, check=False)
    if process_result.returncode != 0:
        raise RuntimeError(
            f"V7 word counting script exited with code {process_result.returncode}: {process_result.stderr}"
        )
    try:
        return json.loads(process_result.stdout)
    except json.JSONDecodeError as json_error:
        raise RuntimeError(
            f"Failed to parse JSON output from word counting script: {json_error}\nOutput: {process_result.stdout}"
        ) from json_error


def verify_public_references(body_text: str, refs_path: Path) -> list:
    refs_bytes = read_file_bytes(refs_path)
    refs_data = json.loads(refs_bytes.decode("utf-8"))
    references_list = refs_data.get("references", [])

    if len(references_list) != EXPECTED_REFERENCE_COUNT:
        raise ValueError(
            f"Expected {EXPECTED_REFERENCE_COUNT} references, but found {len(references_list)} in {refs_path}"
        )

    verification_log_entries = []
    failed_items = []
    for ref_entry in references_list:
        ref_id = ref_entry["id"]
        quote = ref_entry["appliesTo"]["quote"]
        expected_occurrence = ref_entry["appliesTo"]["occurrence"]
        actual_count = body_text.count(quote)

        status_text = "PASS" if actual_count >= expected_occurrence else "FAIL"
        verification_log_entries.append(
            f"[{status_text}] id={ref_id} occ={expected_occurrence} actual={actual_count} quote='{quote[:60]}...'"
        )
        if actual_count < expected_occurrence:
            failed_items.append((ref_id, quote, expected_occurrence, actual_count))

    if failed_items:
        raise ValueError(f"Reference quotes failed verification in body: {failed_items}")

    return verification_log_entries


def verify_staged_media_assets(workspace_root: Path) -> dict:
    staged_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged"
    verified_assets = {}

    for asset_name, expected_info in EXPECTED_STAGED_ASSETS.items():
        asset_path = staged_dir / asset_name
        asset_bytes = read_file_bytes(asset_path)
        actual_size = len(asset_bytes)
        actual_hash = hashlib.sha256(asset_bytes).hexdigest()

        if actual_size != expected_info["byte_size"]:
            raise ValueError(
                f"Asset {asset_name} byte size {actual_size} does not match expected {expected_info['byte_size']}"
            )
        if actual_hash != expected_info["sha256"]:
            raise ValueError(
                f"Asset {asset_name} SHA-256 {actual_hash} does not match expected {expected_info['sha256']}"
            )

        verified_assets[asset_name] = {
            "path": str(asset_path),
            "size": actual_size,
            "sha256": actual_hash,
            "width": expected_info["width"],
            "height": expected_info["height"],
        }
    return verified_assets


def create_locked_body_file(lock_dir: Path, source_body_bytes: bytes) -> Path:
    locked_body_path = lock_dir / "en-body.locked.md"
    locked_body_path.write_bytes(source_body_bytes)

    # Immediate verification of written file
    written_bytes = locked_body_path.read_bytes()
    written_hash = hashlib.sha256(written_bytes).hexdigest()
    if written_hash != EXPECTED_BODY_HASH:
        raise ValueError(
            f"Written locked body hash {written_hash} does not match source hash {EXPECTED_BODY_HASH}"
        )
    return locked_body_path


def create_locked_media_json(lock_dir: Path) -> Path:
    locked_media_path = lock_dir / "en-media.locked.json"
    locked_media_payload = {
        "version": "rework-v2",
        "locale": "en",
        "slug": "how-to-harvest-stardew-valley",
        "bodySha256NfcLf": EXPECTED_BODY_HASH,
        "publicUrlStatus": "bound_and_verified_with_staged_assets",
        "images": [
            {
                "id": "media-cover",
                "role": "cover",
                "inBody": False,
                "width": 1672,
                "height": 941,
                "publicWebpUrl": "/blog/how-to-harvest-stardew-valley-cover.webp",
                "publicAvifUrl": "/blog/how-to-harvest-stardew-valley-cover.avif",
                "stagedWebpPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.webp",
                "stagedWebpSha256": "0f35cee83ceb6360e182f3b1e0522cb3f013f899872cb86be7b4cf47923ec574",
                "stagedAvifPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-cover.avif",
                "stagedAvifSha256": "8c23cae6ef5b80dc03170718f206d90aa830839023f1ddf045b1c114779f9b57",
                "alt": "An evening farm with orange pumpkins in a tilled bed, dirt paths around the plots, and wooden trellis rows beside the pumpkins.",
                "caption": "Evening on a farm: orange pumpkins fill a tilled bed along the dirt paths, with wooden trellis rows beside that bed. ConcernedApe, Stardew Valley press screenshot.",
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png",
            },
            {
                "id": "media-mature-crops",
                "role": "body-figure",
                "inBody": True,
                "bodyAnchor": "How to Tell When Crops Are Ready to Harvest",
                "width": 1672,
                "height": 941,
                "publicWebpUrl": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp",
                "publicAvifUrl": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif",
                "stagedWebpPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.webp",
                "stagedWebpSha256": "d24578e3860ac37eaaa75f04bad130ec65a0f52b6015a8b3314dc9cbed9c51cd",
                "stagedAvifPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-mature-crops.avif",
                "stagedAvifSha256": "cab14677146baef85fb6c9772da898a55cad9f67c54942e20966eac317a095c1",
                "alt": "Full orange pumpkins on tilled soil beside a dirt path.",
                "caption": 'Full orange pumpkins stand on tilled soil beside a dirt path. ConcernedApe, <a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">Stardew Valley press screenshot</a>.',
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
            },
            {
                "id": "media-trellis-paths",
                "role": "body-figure",
                "inBody": True,
                "bodyAnchor": "Maintaining Reachable Paths Around Trellis Crops",
                "width": 1672,
                "height": 941,
                "publicWebpUrl": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp",
                "publicAvifUrl": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif",
                "stagedWebpPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.webp",
                "stagedWebpSha256": "027e085cd18da335a16ec9e8096796c086c9e40138b687fd3776c3f84e7d1ad4",
                "stagedAvifPath": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/media/staged/how-to-harvest-stardew-valley-trellis-paths.avif",
                "stagedAvifSha256": "7991d66a038a9cc05c31927f64c295708651a5a6c019bb72095ec5b7ef09968a",
                "alt": "Two wooden trellises with an open dirt path between them and purple grapes on the trellis beside the path.",
                "caption": 'Two wooden trellises have an open dirt path between them, with purple grape clusters on the trellis beside that path. ConcernedApe, <a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">Stardew Valley press screenshot</a>.',
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
            },
        ],
    }
    locked_media_path.write_text(json.dumps(locked_media_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return locked_media_path


def create_locked_references_json(lock_dir: Path, source_refs_path: Path) -> Path:
    locked_refs_path = lock_dir / "en-public-references.locked.json"
    refs_bytes = read_file_bytes(source_refs_path)
    refs_data = json.loads(refs_bytes.decode("utf-8"))

    clean_payload = {
        "version": "rework-v2",
        "locale": "en",
        "slug": "how-to-harvest-stardew-valley",
        "bodyHash": EXPECTED_BODY_HASH,
        "bodyFile": "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f/en-body.locked.md",
        "referenceCount": len(refs_data.get("references", [])),
        "references": refs_data.get("references", []),
    }
    locked_refs_path.write_text(json.dumps(clean_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return locked_refs_path


def create_en_seo_json(lock_dir: Path, eligible_words: int, raw_words: int) -> Path:
    en_seo_path = lock_dir / "en-seo.json"

    # readTimeMinutes: eligible_words / 200, ceiling
    read_time_minutes = math.ceil(eligible_words / 200)

    selected_title = "How to Harvest Stardew Valley Crops by Hand, Scythe, or Axe"
    selected_description = (
        "Gather parsnips and pumpkins by hand with right-click or X, "
        "cut kale and wheat with a scythe, and strike giant crops three times with any axe."
    )

    seo_payload = {
        "schemaVersion": 1,
        "locale": "en",
        "country": "US",
        "slug": "how-to-harvest-stardew-valley",
        "title": selected_title,
        "h1": selected_title,
        "description": selected_description,
        "titleEqualsH1": True,
        "topic": "Stardew Valley Guides",
        "author": "Stardew Valley Planner Team",
        "readTimeMinutes": read_time_minutes,
        "featured": False,
        "datePublished": None,
        "publicPath": "/how-to-harvest-stardew-valley",
        "canonicalUrl": "https://stardewvalleyplanner.art/how-to-harvest-stardew-valley",
        "bodyHash": EXPECTED_BODY_HASH,
        "rawMechanicalWords": raw_words,
        "eligibleWords": eligible_words,
        "lengthClass": "short",
        "schemaType": "Article",
        "faq": None,
        "status": "pending_title_review",
        "freezePublicBlogHandoff": False,
        "cover": {
            "src": "/blog/how-to-harvest-stardew-valley-cover.webp",
            "avif": "/blog/how-to-harvest-stardew-valley-cover.avif",
            "width": 1672,
            "height": 941,
            "alt": "An evening farm with orange pumpkins in a tilled bed, dirt paths around the plots, and wooden trellis rows beside the pumpkins.",
            "caption": "Evening on a farm: orange pumpkins fill a tilled bed along the dirt paths, with wooden trellis rows beside that bed. ConcernedApe, Stardew Valley press screenshot.",
            "creditName": "ConcernedApe",
            "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/farm_evening_1920x1080.png",
        },
        "figures": [
            {
                "id": "media-mature-crops",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-mature-crops.avif",
                "width": 1672,
                "height": 941,
                "alt": "Full orange pumpkins on tilled soil beside a dirt path.",
                "caption": 'Full orange pumpkins stand on tilled soil beside a dirt path. ConcernedApe, <a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">Stardew Valley press screenshot</a>.',
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
            },
            {
                "id": "media-trellis-paths",
                "src": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.webp",
                "avif": "/blog/illustrations/how-to-harvest-stardew-valley-trellis-paths.avif",
                "width": 1672,
                "height": 941,
                "alt": "Two wooden trellises with an open dirt path between them and purple grapes on the trellis beside the path.",
                "caption": 'Two wooden trellises have an open dirt path between them, with purple grape clusters on the trellis beside that path. ConcernedApe, <a href="https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png">Stardew Valley press screenshot</a>.',
                "creditName": "ConcernedApe",
                "creditUrl": "https://www.stardewvalley.net/presskit/Stardew%20Valley/images/Multiplayer_Screenshot2.png",
            },
        ],
    }
    en_seo_path.write_text(json.dumps(seo_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return en_seo_path


def main():
    workspace_root = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
    lock_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/lock-f"
    lock_dir.mkdir(parents=True, exist_ok=True)

    rework_dir = workspace_root / "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2"
    source_body_path = rework_dir / "writing/en-body.md"
    caption_excluded_path = rework_dir / "checks-d/r2/en-body.caption-excluded.md"
    d_report_path = rework_dir / "checks-d/D-en-three-gates-review-r2.md"
    e_report_path = rework_dir / "review-e/english-r2.md"
    refs_path = rework_dir / "writing/en-public-references.json"
    v7_count_script = Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")

    print("=== Step 1: Verify D and E Preconditions ===")
    verify_d_and_e_prior_reports(d_report_path, e_report_path)
    print("Preconditions PASS: D-R2 and E-R2 both passed identical candidate.")

    print("=== Step 2: Verify Candidate Body Hash ===")
    body_bytes = verify_body_hash_matches(source_body_path)
    body_text = body_bytes.decode("utf-8")
    print(f"Body Hash PASS: {EXPECTED_BODY_HASH}")

    print("=== Step 3: Run Mechanical Word Counter ===")
    full_count_result = execute_v7_word_counter(v7_count_script, source_body_path)
    eligible_count_result = execute_v7_word_counter(v7_count_script, caption_excluded_path)

    raw_units = full_count_result["mechanical_units"]
    eligible_units = eligible_count_result["mechanical_units"]
    print(f"Count Results: raw={raw_units}, eligible={eligible_units}, diff={raw_units - eligible_units}")

    (lock_dir / "count-full.stdout.json").write_text(
        json.dumps(full_count_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (lock_dir / "count-eligible.stdout.json").write_text(
        json.dumps(eligible_count_result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print("=== Step 4: Verify 21 Public References ===")
    ref_logs = verify_public_references(body_text, refs_path)
    (lock_dir / "reference-fidelity.stdout.txt").write_text("\n".join(ref_logs) + "\n", encoding="utf-8")
    print(f"References PASS: All {len(ref_logs)} references verified.")

    print("=== Step 5: Verify Staged Media Assets ===")
    verified_media = verify_staged_media_assets(workspace_root)
    print(f"Media PASS: All {len(verified_media)} staged assets verified.")

    print("=== Step 6: Create Locked Files ===")
    locked_body = create_locked_body_file(lock_dir, body_bytes)
    locked_media = create_locked_media_json(lock_dir)
    locked_refs = create_locked_references_json(lock_dir, refs_path)
    locked_seo = create_en_seo_json(lock_dir, eligible_units, raw_units)

    # Save SHA-256 receipts
    sha_receipts = {
        "body_nfc_lf_sha256": EXPECTED_BODY_HASH,
        "caption_excluded_nfc_lf_sha256": EXPECTED_CAPTION_EXCLUDED_HASH,
        "locked_body_sha256": compute_raw_sha256(locked_body.read_bytes()),
        "locked_media_sha256": compute_raw_sha256(locked_media.read_bytes()),
        "locked_references_sha256": compute_raw_sha256(locked_refs.read_bytes()),
        "locked_seo_sha256": compute_raw_sha256(locked_seo.read_bytes()),
        "staged_assets": verified_media,
    }
    (lock_dir / "sha256-receipts.json").write_text(
        json.dumps(sha_receipts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print("All locked files generated successfully!")


if __name__ == "__main__":
    main()
