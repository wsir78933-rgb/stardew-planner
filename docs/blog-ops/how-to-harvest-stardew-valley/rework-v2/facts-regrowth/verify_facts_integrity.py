#!/usr/bin/env python3
"""
Verify integrity and absence of unsupported claims in facts-regrowth deliverables.
Strict adherence to: Fail Fast, Precise Naming, Single Responsibility, KISS.
"""

import hashlib
import json
import os

FACTS_MD_PATH = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth.md"
RECEIPTS_JSON_PATH = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth/raw-sources-receipts.json"

POSITIVE_UNSUPPORTED_CLAIMS = [
    "瞬间即可顺势",
    "肥料与土壤湿度在当日保留",
    "严禁使用工具破坏母株",
    "维基明确反对重复播种",
    "如小麦"
]


def verify_json_file(file_path: str) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Missing JSON file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as file_handle:
        data = json.load(file_handle)
    required_sources = ["Crops", "Blueberry", "Fiber_Seeds", "Fertilizer", "Crop_Growth_Calendars"]
    for source_key in required_sources:
        if source_key not in data.get("sources", {}):
            raise KeyError(f"Missing required source in receipts: {source_key}")
    return data


def verify_absence_of_unsupported_positive_claims(file_path: str, phrases_to_check: list) -> None:
    with open(file_path, "r", encoding="utf-8") as file_handle:
        file_content = file_handle.read()
    for phrase in phrases_to_check:
        if phrase in file_content:
            raise ValueError(f"Unsupported claim phrase '{phrase}' found in {file_path}")


def compute_file_sha256(file_path: str) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as file_handle:
        hasher.update(file_handle.read())
    return hasher.hexdigest()


def main() -> None:
    json_data = verify_json_file(RECEIPTS_JSON_PATH)
    print(f"Receipts JSON valid: {len(json_data['sources'])} sources verified.")

    verify_absence_of_unsupported_positive_claims(FACTS_MD_PATH, POSITIVE_UNSUPPORTED_CLAIMS)
    print(f"Facts markdown verified: All {len(POSITIVE_UNSUPPORTED_CLAIMS)} unsupported positive phrases absent.")

    md_sha256 = compute_file_sha256(FACTS_MD_PATH)
    json_sha256 = compute_file_sha256(RECEIPTS_JSON_PATH)

    print(f"facts-regrowth.md sha256: {md_sha256}")
    print(f"raw-sources-receipts.json sha256: {json_sha256}")
    print("Verification completed successfully with exit code 0.")


if __name__ == "__main__":
    main()
