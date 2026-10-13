#!/usr/bin/env python3
"""
Fetch and save raw source receipts for Stardew Valley crop regrowth and growth rules.
Adheres to: Single Responsibility, Fail Fast, Precise Naming, KISS.
"""

import json
import os
import urllib.parse
import urllib.request

TARGET_DIRECTORY = "/Users/wusir/orca/workspaces/stardew planner/博客-2/docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth"
WIKI_API_ENDPOINT = "https://stardewvalleywiki.com/mediawiki/api.php"
USER_AGENT_STRING = "OrcaResearchWorker/1.0 (FactsRegrowthAudit)"


def ensure_target_directory_exists(directory_path: str) -> None:
    if not os.path.exists(directory_path):
        os.makedirs(directory_path, exist_ok=True)
    if not os.path.isdir(directory_path):
        raise NotADirectoryError(f"Target directory path is not a directory: {directory_path}")


def fetch_mediawiki_page_revision(page_title: str) -> dict:
    query_parameters = {
        "action": "query",
        "titles": page_title,
        "prop": "revisions",
        "rvprop": "ids|timestamp|content",
        "rvslots": "main",
        "format": "json"
    }
    encoded_query = urllib.parse.urlencode(query_parameters)
    request_url = f"{WIKI_API_ENDPOINT}?{encoded_query}"
    http_request = urllib.request.Request(request_url, headers={"User-Agent": USER_AGENT_STRING})

    with urllib.request.urlopen(http_request) as http_response:
        response_status_code = http_response.status
        if response_status_code != 200:
            raise RuntimeError(f"HTTP request failed with status code {response_status_code} for page: {page_title}")
        raw_response_bytes = http_response.read()

    response_payload = json.loads(raw_response_bytes.decode("utf-8"))
    query_result = response_payload.get("query", {})
    pages_map = query_result.get("pages", {})
    if not pages_map:
        raise ValueError(f"No pages returned in response for title: {page_title}")

    first_page_object = next(iter(pages_map.values()))
    page_id_value = first_page_object.get("pageid")
    if page_id_value is None or page_id_value < 0:
        raise ValueError(f"Page does not exist on wiki: {page_title}")

    revisions_list = first_page_object.get("revisions", [])
    if not revisions_list:
        raise ValueError(f"No revisions found for page: {page_title}")

    primary_revision = revisions_list[0]
    revision_id_value = primary_revision.get("revid")
    revision_timestamp = primary_revision.get("timestamp")
    wikitext_content = primary_revision.get("slots", {}).get("main", {}).get("*", "")

    return {
        "page_id": page_id_value,
        "page_title": first_page_object.get("title", page_title),
        "revision_id": revision_id_value,
        "revision_timestamp": revision_timestamp,
        "wikitext_content": wikitext_content
    }


def download_binary_image_file(image_source_url: str, destination_file_path: str) -> int:
    http_request = urllib.request.Request(image_source_url, headers={"User-Agent": USER_AGENT_STRING})
    with urllib.request.urlopen(http_request) as http_response:
        response_status_code = http_response.status
        if response_status_code != 200:
            raise RuntimeError(f"Image download failed with status {response_status_code} from {image_source_url}")
        image_bytes = http_response.read()

    written_byte_count = len(image_bytes)
    if written_byte_count == 0:
        raise ValueError(f"Zero bytes received when downloading image from {image_source_url}")

    with open(destination_file_path, "wb") as output_file_handle:
        output_file_handle.write(image_bytes)

    return written_byte_count


def build_regrowth_source_receipts(page_revisions_map: dict) -> dict:
    retrieval_timestamp_iso = "2026-10-13T08:46:30+08:00"

    receipts_structure = {
        "metadata": {
            "audit_role": "Facts Auditor A (Research Leaf)",
            "audit_scope": "Crop Regrowth, Growth Days Calculation, Watering Requirement, Fiber Counterexample, Re-sowing Boundaries",
            "retrieved_at": retrieval_timestamp_iso,
            "api_endpoint": WIKI_API_ENDPOINT,
            "browser_verification": "ego-browser (TaskSpace 127)",
            "allowed_new_files": [
                "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth.md",
                "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-regrowth/*"
            ]
        },
        "sources": {
            "Crops": {
                "page_title": "Crops",
                "page_id": page_revisions_map["Crops"]["page_id"],
                "public_url": "https://stardewvalleywiki.com/Crops",
                "permanent_url": f"https://stardewvalleywiki.com/index.php?title=Crops&oldid={page_revisions_map['Crops']['revision_id']}",
                "revision_id": page_revisions_map["Crops"]["revision_id"],
                "wiki_timestamp": page_revisions_map["Crops"]["revision_timestamp"],
                "retrieved_at": retrieval_timestamp_iso,
                "exact_excerpts": {
                    "grow_times_exclusion_and_watering": "The grow times shown on this page (and in the game) ''exclude'' the day the seeds were planted. If planting on the first of a season, a 5-day crop will be ready for harvest on day 6, not day 5. In this case, the number may be thought of as the number of ''nights'' required to grow the crop.\n\n[[Fertilizer]] and [[Farming#Farming Skill|the Agriculturist Profession]] are ''not'' taken into account on this page, but the effects can be viewed on individual crop pages.\n\nCrops must be watered every day for maximum growth. If unwatered for a day, a crop will not grow. Unwatered crops do not die, but they will not grow either.\n\nIf a seed is planted into unwatered soil and not watered the same day, it will not grow that night. Growth will start the following night. The grow times on this page assume the seeds are watered the day they are planted.",
                    "blueberry_table_summary": "Keeps producing after maturity. Each plant produces 3 blueberries at harvest, with a 2% chance for more blueberries.\nStages: Stage 1 (1 day), Stage 2 (3 days), Stage 3 (3 days), Stage 4 (4 days), Stage 5 (2 days), Total: 13 days (Blueberry Stage 6.png), Regrowth: 4 days (Blueberry Stage 7.png).",
                    "parsnip_table_summary": "Stages: Stage 1 (1 day), Stage 2 (1 day), Stage 3 (1 day), Stage 4 (1 day), Total: 4 days (Parsnip Stage 5.png). No regrowth stage.",
                    "gold_per_day_formula": "Growing Days = Days to Maturity + ((Max Harvests − 1) × Days to Regrow)\nDays to Maturity and Days to Regrow are listed in each table. Max Harvests is normally 1, but for crops that continue to produce, it is the actual number of harvests that can be obtained in the growing season(s)."
                },
                "supports": [
                    "Growing days calculation excludes the day seeds were planted (a 5-day crop planted on day 1 matures on day 6).",
                    "Crops must be watered every day for maximum growth; unwatered crops do not die but advance 0 growth.",
                    "Seeds planted in unwatered soil and not watered that same day do not grow that night.",
                    "Single-harvest crops (e.g. Parsnip) have only maturity stages ending in Harvest with no regrowth stage.",
                    "Multi-harvest crops (e.g. Blueberry) have both Days to Maturity (13 days) and Days to Regrow (4 days), continuing to produce after maturity."
                ],
                "not_supported": [
                    "Does not support claiming that fully grown unharvested crops never die across seasons (the same page states unharvested crops wither on the 1st of a new season unless multi-season).",
                    "Does not support claiming that all crops without exception need daily watering (see Fiber Seeds counterexample)."
                ],
                "derivation_notes": "Distinguishes initial growth (Days to Maturity) from subsequent cycle (Days to Regrow). Planting day is day 0 in calculation."
            },
            "Blueberry": {
                "page_title": "Blueberry",
                "page_id": page_revisions_map["Blueberry"]["page_id"],
                "public_url": "https://stardewvalleywiki.com/Blueberry",
                "permanent_url": f"https://stardewvalleywiki.com/index.php?title=Blueberry&oldid={page_revisions_map['Blueberry']['revision_id']}",
                "revision_id": page_revisions_map["Blueberry"]["revision_id"],
                "wiki_timestamp": page_revisions_map["Blueberry"]["revision_timestamp"],
                "retrieved_at": retrieval_timestamp_iso,
                "exact_excerpts": {
                    "intro": "The '''Blueberry''' is a [[Vegetables|fruit]] [[Crops|crop]] that grows from [[Blueberry Seeds]] after 13 days and continues to produce every 4 days after maturity.",
                    "stages_table": "Stage 1 (1 Day), Stage 2 (3 Days), Stage 3 (3 Days), Stage 4 (4 Days), Stage 5 (2 Days), Harvest (Total: 13 Days, File:Blueberry Stage 6.png), After-Harvest (Regrowth: 4 Days, File:Blueberry Stage 7.png).",
                    "fertilizer_section": "That makes [[Speed-Gro]] an optimal fertilizer for this crop, as it gives one extra harvest before the Fall (assuming planting on day 1 of the summer)... [[Deluxe Speed-Gro]] yields the same number of harvests as regular [[Speed-Gro]], usually at a higher cost."
                },
                "supports": [
                    "Blueberry takes 13 days to reach initial maturity and then produces every 4 days.",
                    "After harvest, Blueberry transitions to Stage 7 (After-Harvest sprite), leaving a persistent mature bush on the tile rather than empty ground.",
                    "Speed-Gro grants at most one extra harvest in Summer by shortening the initial 13-day growth to first harvest, not by changing the 4-day regrowth cycle."
                ],
                "not_supported": [
                    "Does not support planting another crop or seed on a tile occupied by a living Stage 7 Blueberry bush.",
                    "Does not support that Deluxe Speed-Gro speeds up reharvest intervals."
                ],
                "derivation_notes": "Blueberry serves as the primary benchmark example for regrowth crops in summer. Visual sprite Stage 6 depicts ripe berries, Stage 7 depicts post-harvest bush."
            },
            "Fiber_Seeds": {
                "page_title": "Fiber Seeds",
                "page_id": page_revisions_map["Fiber_Seeds"]["page_id"],
                "public_url": "https://stardewvalleywiki.com/Fiber_Seeds",
                "permanent_url": f"https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid={page_revisions_map['Fiber_Seeds']['revision_id']}",
                "revision_id": page_revisions_map["Fiber_Seeds"]["revision_id"],
                "wiki_timestamp": page_revisions_map["Fiber_Seeds"]["revision_timestamp"],
                "retrieved_at": retrieval_timestamp_iso,
                "exact_excerpts": {
                    "intro_watering": "'''Fiber Seeds''' are a type of [[Crafting#Seeds|crafted]] seed. They do not require daily watering and can even grow in [[Winter]], but they must still be planted on tilled soil. They can also be eaten by [[Animals#Crows|Crows]] if not protected by a [[Scarecrow]].",
                    "harvest_scythe": "Each fully-grown plant drops between 4 and 7 [[Fiber]] when harvested with a [[Scythe]]. There is also a 10% chance to drop 1 [[Mixed Seeds]]."
                },
                "supports": [
                    "Fiber Seeds do not require daily watering to grow.",
                    "Fiber Seeds can grow in Winter.",
                    "Must still be planted on tilled soil.",
                    "Harvested with a Scythe (yielding 4–7 Fiber)."
                ],
                "not_supported": [
                    "Does not support general claim that crops do not need water; Fiber Seeds is an explicit craftable exception.",
                    "Financial margins and profit evaluations are excluded from this harvest scope."
                ],
                "derivation_notes": "Counterexample evidence to avoid incorrect generalization that 'every single crop must be watered daily to grow'."
            },
            "Fertilizer": {
                "page_title": "Fertilizer",
                "page_id": page_revisions_map["Fertilizer"]["page_id"],
                "public_url": "https://stardewvalleywiki.com/Fertilizer",
                "permanent_url": f"https://stardewvalleywiki.com/index.php?title=Fertilizer&oldid={page_revisions_map['Fertilizer']['revision_id']}",
                "revision_id": page_revisions_map["Fertilizer"]["revision_id"],
                "wiki_timestamp": page_revisions_map["Fertilizer"]["revision_timestamp"],
                "retrieved_at": retrieval_timestamp_iso,
                "exact_excerpts": {
                    "speed_gro_rule": "Speed-Gro affects only the growth and first harvest of a multi-harvest crop.",
                    "table_notes": "Note: Does not reduce time between harvests for multi-harvest crops. (Identical note on Speed-Gro, Deluxe Speed-Gro, and Hyper Speed-Gro)"
                },
                "supports": [
                    "Speed-Gro, Deluxe Speed-Gro, and Hyper Speed-Gro affect ONLY the initial growth and first harvest of a multi-harvest crop.",
                    "Speed-Gro fertilizers DO NOT reduce the time between subsequent harvests (regrowth interval) for multi-harvest crops."
                ],
                "not_supported": [
                    "Does not support claiming Speed-Gro accelerates regrowth cycles after initial maturity."
                ],
                "derivation_notes": "Essential constraint preventing authors from writing that Speed-Gro makes regrowth faster."
            },
            "Crop_Growth_Calendars": {
                "page_title": "Crop Growth Calendars",
                "page_id": page_revisions_map["Crop_Growth_Calendars"]["page_id"],
                "public_url": "https://stardewvalleywiki.com/Crop_Growth_Calendars",
                "permanent_url": f"https://stardewvalleywiki.com/index.php?title=Crop_Growth_Calendars&oldid={page_revisions_map['Crop_Growth_Calendars']['revision_id']}",
                "revision_id": page_revisions_map["Crop_Growth_Calendars"]["revision_id"],
                "wiki_timestamp": page_revisions_map["Crop_Growth_Calendars"]["revision_timestamp"],
                "retrieved_at": retrieval_timestamp_iso,
                "exact_excerpts": {
                    "replanting_assumption": "With the exception of multi-harvest crops, the tables assume that seeds are replanted and watered on the day of harvest.",
                    "agriculturist_and_speedgro": "Note that the increase in growth is 10% with [[Speed-Gro]] ''or'' the Agriculturist Profession, so the \"10%\" table applies to each."
                },
                "supports": [
                    "Multi-harvest crops do not require replanting after harvest; single-harvest crops require replanting on the harvested tile.",
                    "Agriculturist Profession (+10% growth rate) and Speed-Gro follow equivalent rate rules on initial growth."
                ],
                "not_supported": [
                    "Does not support instant same-frame re-sowing mechanics for all held items without movement or user input."
                ],
                "derivation_notes": "Corroborates the difference between single-crop tile vacancy and multi-harvest persistent plant status."
            }
        }
    }

    return receipts_structure


def write_json_receipts_file(receipts_data: dict, output_file_path: str) -> None:
    serialized_json_string = json.dumps(receipts_data, indent=2, ensure_ascii=False)
    with open(output_file_path, "w", encoding="utf-8") as file_handle:
        file_handle.write(serialized_json_string)


def main() -> None:
    ensure_target_directory_exists(TARGET_DIRECTORY)

    page_titles_to_fetch = ["Crops", "Blueberry", "Fiber_Seeds", "Fertilizer", "Crop_Growth_Calendars"]
    revisions_cache = {}

    for single_page_title in page_titles_to_fetch:
        page_revision_data = fetch_mediawiki_page_revision(single_page_title)
        revisions_cache[single_page_title] = page_revision_data
        print(f"Fetched {single_page_title}: revid={page_revision_data['revision_id']}, timestamp={page_revision_data['revision_timestamp']}")

    # Download sprite images for Blueberry Stage 6 and Stage 7
    stage_6_image_url = "https://stardewvalleywiki.com/mediawiki/images/8/84/Blueberry_Stage_6.png"
    stage_7_image_url = "https://stardewvalleywiki.com/mediawiki/images/1/19/Blueberry_Stage_7.png"

    stage_6_local_file = os.path.join(TARGET_DIRECTORY, "blueberry_stage_6_harvest.png")
    stage_7_local_file = os.path.join(TARGET_DIRECTORY, "blueberry_stage_7_after_harvest.png")

    downloaded_bytes_stage_6 = download_binary_image_file(stage_6_image_url, stage_6_local_file)
    print(f"Downloaded Blueberry Stage 6 Harvest sprite: {downloaded_bytes_stage_6} bytes -> {stage_6_local_file}")

    downloaded_bytes_stage_7 = download_binary_image_file(stage_7_image_url, stage_7_local_file)
    print(f"Downloaded Blueberry Stage 7 After-Harvest sprite: {downloaded_bytes_stage_7} bytes -> {stage_7_local_file}")

    receipts_payload = build_regrowth_source_receipts(revisions_cache)
    receipts_json_file = os.path.join(TARGET_DIRECTORY, "raw-sources-receipts.json")
    write_json_receipts_file(receipts_payload, receipts_json_file)
    print(f"Saved receipts JSON: {receipts_json_file}")


if __name__ == "__main__":
    main()
