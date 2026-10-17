#!/usr/bin/env python3
"""Bind the three pixel-v2 scenes into the house-upgrade article.

The main function only dispatches. Each step fails with the concrete bad value.
"""

from __future__ import annotations

import filecmp
import hashlib
import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
PIXEL_ROOT = REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2"
INTEGRATION_ROOT = PIXEL_ROOT / "integration"
VERSION_ROOT = INTEGRATION_ROOT / "v1"
V7_COUNTER_PATH = Path("/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py")
V7_CACHE_DIR = V7_COUNTER_PATH.parent / "__pycache__"
SOURCE_ATTRIBUTE = "original-pixel-illustration"

ROLE_BY_MEDIA_ID = {
    "cover-payments": "cover",
    "tier-rooms": "interior",
    "upgrade-or-renovation": "construction",
}

MEDIA_TEXT = {
    "en": {
        "cover-payments": {
            "alt": "Original pixel scene of one farmhouse. Not an official screenshot or an exact game layout.",
            "caption": "Illustration of one farmhouse in an original pixel scene. Not an official screenshot or the exact game layout.",
        },
        "tier-rooms": {
            "alt": "Original pixel scene of one farmhouse interior: a kitchen, a double bed, and a nursery with a crib and two single beds.",
            "caption": "Illustration. One interior with a kitchen, a bedroom, and a nursery with a crib and two single beds. Not an official screenshot or the exact game floor plan.",
            "placement": "Inside H2 What the kitchen, nursery, and cellar are for, after the sentence that calls the crib room the nursery.",
        },
        "upgrade-or-renovation": {
            "alt": "Original pixel scene of a carpenter raising a hammer on an open timber frame beside a farmhouse.",
            "caption": "Illustration. A carpenter raises a hammer on an unfinished timber frame. Not an official screenshot.",
        },
    },
    "zh-CN": {
        "cover-payments": {
            "alt": "原创像素场景：一栋农舍。不是官方截图，也不是精确的游戏布局。",
            "caption": "插画。一栋农舍的原创像素场景，不是官方截图，也不是精确的游戏布局。",
        },
        "tier-rooms": {
            "alt": "原创像素场景：一套农舍室内，有厨房、一张双人床，以及有婴儿床和两张单人床的育儿室。",
            "caption": "插画。一套室内，有厨房、卧室，以及有婴儿床和两张单人床的育儿室。不是官方截图，也不是精确的游戏户型。",
        },
        "upgrade-or-renovation": {
            "alt": "原创像素场景：木匠在农舍旁的木架上举锤。",
            "caption": "插画。木匠在未封的木架上举锤。不是官方截图。",
        },
    },
}

NURSERY_SENTENCE = {
    "en": (
        "On the room figure, the Nursery label is this crib room.",
        "In the interior illustration, the nursery is this crib room.",
    ),
    "zh-CN": (
        "房间图上的「育儿室」标的就是这间有婴儿床的房间。",
        "室内插画里，育儿室就是这间有婴儿床的房间。",
    ),
}

FORBIDDEN_IN_NEW_MEDIA_TEXT = (
    "Robin",
    "罗宾",
    "bunk",
    "双层",
    "Upgrade 1",
    "升级1",
    "16:9",
    "10,000",
    "Refund",
    "退还",
    "四季",
    "/Users/",
    "image_gen",
)


def fail(message: str) -> None:
    raise SystemExit(message)


def sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def require_sha256(path: Path, expected: str, label: str) -> bytes:
    if not path.is_file():
        fail(f"missing {label} path={path}")
    payload = path.read_bytes()
    actual = sha256_bytes(payload)
    if actual != expected:
        fail(f"sha256 mismatch {label} actual={actual} expected={expected} path={path}")
    return payload


def require_unique_replace(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        fail(f"replace count={count} label={label} old={old!r}")
    if old == new:
        fail(f"replace made no change label={label}")
    return text.replace(old, new, 1)


def require_public_copy_map() -> dict:
    copies = {
        "cover": {
            "webp": [
                "public/blog/house-upgrade-stardew-cover.webp",
                "public/blog/house-upgrade-stardew-cover-zh.webp",
            ],
            "avif": [
                "public/blog/house-upgrade-stardew-cover.avif",
                "public/blog/house-upgrade-stardew-cover-zh.avif",
            ],
        },
        "interior": {
            "webp": [
                "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp",
                "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
            ],
            "avif": [
                "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif",
                "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif",
            ],
        },
        "construction": {
            "webp": [
                "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp",
                "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
            ],
            "avif": [
                "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif",
                "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif",
            ],
        },
    }
    flat = [path for role in copies.values() for paths in role.values() for path in paths]
    if len(flat) != 12 or len(set(flat)) != 12:
        fail(f"public copy map count={len(flat)} unique={len(set(flat))}")
    return copies


def load_length_counter():
    os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
    before = cache_snapshot()
    spec = importlib.util.spec_from_file_location("v7_body_count", V7_COUNTER_PATH)
    if spec is None or spec.loader is None:
        fail(f"cannot load V7 counter path={V7_COUNTER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    after = cache_snapshot()
    if before != after:
        fail(f"V7 pycache changed before={before} after={after}")
    return module


def cache_snapshot() -> tuple:
    if not V7_CACHE_DIR.is_dir():
        return tuple()
    return tuple(
        (path.name, path.stat().st_mtime_ns, path.stat().st_size)
        for path in sorted(V7_CACHE_DIR.iterdir())
    )


def measured_png_size(path: Path) -> tuple[int, int]:
    from PIL import Image

    with Image.open(path) as image:
        width, height = image.size
        if image.mode != "RGB":
            fail(f"png mode={image.mode} path={path}")
    if width <= 0 or height <= 0:
        fail(f"png size={width}x{height} path={path}")
    return width, height


def decoded_size(path: Path) -> tuple[int, int]:
    from PIL import Image

    with Image.open(path) as image:
        return image.size


def remove_caption_lines(text: str, captions: list[str], label: str) -> str:
    lines = text.splitlines(keepends=True)
    found = {caption: 0 for caption in captions}
    kept = []
    for line in lines:
        content = line[:-1] if line.endswith("\n") else line
        if content in found:
            found[content] += 1
            continue
        kept.append(line)
    for caption, count in found.items():
        if count != 1:
            fail(f"caption line count={count} label={label} caption={caption!r}")
    return "".join(kept)


def qualifying_counts(counter, body: str, locale: str, captions: list[str], label: str) -> dict:
    mechanical = counter.count_units(counter.extract_body(body)[0], locale)
    if locale == "en":
        qualified_input = remove_caption_lines(body, captions, label)
        qualified = counter.count_units(counter.extract_body(qualified_input)[0], "en")
        return {"mechanical": mechanical, "qualified": qualified}
    extracted = counter.extract_body(body)[0]
    caption_han = []
    for caption in captions:
        if caption not in extracted:
            fail(f"chinese caption missing from extracted body label={label} caption={caption!r}")
        caption_han.append(sum(counter.is_han(char) for char in caption))
    pure_han = mechanical - sum(caption_han)
    return {
        "mechanical": mechanical,
        "captionHan": caption_han,
        "pureHan": pure_han,
    }


def strip_authorized_media(text: str, nursery: str, image_blocks: list[str], label: str) -> str:
    updated = require_unique_replace(text, nursery, "", f"{label} nursery strip")
    for index, block in enumerate(image_blocks):
        updated = require_unique_replace(updated, block, "", f"{label} image block {index}")
    return updated


def image_block(alt: str, src: str, caption: str) -> str:
    return f"![{alt}]({src})\n\n{caption}\n\n"


def canonical_public_fields(document: dict) -> str:
    payload = {key: value for key, value in document.items() if key != "integrity"}
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256_bytes(encoded)


def cmp_paths(left: Path, right: Path) -> int:
    completed = subprocess.run(["cmp", "-s", str(left), str(right)], check=False)
    if completed.returncode != 0:
        fail(f"cmp exit={completed.returncode} left={left} right={right}")
    return completed.returncode


def forbid_media_wording(text: str, label: str) -> None:
    for token in FORBIDDEN_IN_NEW_MEDIA_TEXT:
        if token in text:
            fail(f"forbidden token={token!r} label={label} text={text!r}")


ARTICLE_ARCHIVE_LOCATOR = PIXEL_ROOT / "archive-fix/archive-location-map.json"
ARTICLE_ARCHIVE_SOURCE_PATHS = (
    "src/blog/articles/house-upgrade-stardew.en.tsx",
    "src/blog/articles/house-upgrade-stardew.zh.tsx",
)
ARTICLE_ARCHIVE_LOCATOR_KEYS = ("kind", "entries")
ARTICLE_ARCHIVE_ENTRY_KEYS = (
    "sourceRelativePath",
    "oldArchivePath",
    "newArchivePath",
    "sha256",
    "byteSize",
)


def article_archive_entries() -> dict[str, dict]:
    if not ARTICLE_ARCHIVE_LOCATOR.is_file():
        fail(f"missing archive locator path={ARTICLE_ARCHIVE_LOCATOR}")
    locator = read_json(ARTICLE_ARCHIVE_LOCATOR)
    if not isinstance(locator, dict):
        fail(f"archive locator={locator!r} path={ARTICLE_ARCHIVE_LOCATOR}")
    extra = [key for key in locator if key not in ARTICLE_ARCHIVE_LOCATOR_KEYS]
    missing = [key for key in ARTICLE_ARCHIVE_LOCATOR_KEYS if key not in locator]
    if extra or missing or locator.get("kind") != "pixel-v2-article-archive-suffix-map":
        fail(
            f"archive locator keys={sorted(locator)} extra={extra} missing={missing} "
            f"kind={locator.get('kind')!r} path={ARTICLE_ARCHIVE_LOCATOR}"
        )
    entries = locator["entries"]
    if not isinstance(entries, list) or len(entries) != 2:
        fail(f"archive entries={entries!r} locator={ARTICLE_ARCHIVE_LOCATOR}")
    by_source: dict[str, dict] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            fail(f"archive entry={entry!r} locator={ARTICLE_ARCHIVE_LOCATOR}")
        unexpected = [key for key in entry if key not in ARTICLE_ARCHIVE_ENTRY_KEYS]
        missing_entry = [key for key in ARTICLE_ARCHIVE_ENTRY_KEYS if key not in entry]
        if unexpected or missing_entry:
            fail(f"archive entry keys unexpected={unexpected} missing={missing_entry} entry={entry!r}")
        source_relative_path = entry["sourceRelativePath"]
        if source_relative_path not in ARTICLE_ARCHIVE_SOURCE_PATHS or source_relative_path in by_source:
            fail(f"archive source={source_relative_path!r} locator={ARTICLE_ARCHIVE_LOCATOR}")
        by_source[source_relative_path] = entry
    if set(by_source) != set(ARTICLE_ARCHIVE_SOURCE_PATHS):
        fail(f"archive sources={sorted(by_source)} locator={ARTICLE_ARCHIVE_LOCATOR}")
    return by_source


def require_article_archives(baseline: dict) -> None:
    by_source = article_archive_entries()
    baseline_by_source: dict[str, dict] = {}
    for source in baseline["sources"]:
        relative_path = source["relativePath"]
        if relative_path not in ARTICLE_ARCHIVE_SOURCE_PATHS:
            continue
        if relative_path in baseline_by_source:
            fail(f"duplicate baseline source={relative_path}")
        baseline_by_source[relative_path] = source
    if set(baseline_by_source) != set(ARTICLE_ARCHIVE_SOURCE_PATHS):
        fail(f"baseline article sources={sorted(baseline_by_source)}")
    for source_relative_path in ARTICLE_ARCHIVE_SOURCE_PATHS:
        entry = by_source[source_relative_path]
        source = baseline_by_source[source_relative_path]
        old_path = entry["oldArchivePath"]
        new_path = entry["newArchivePath"]
        if (
            not isinstance(old_path, str)
            or not isinstance(new_path, str)
            or source["copiedTo"] != old_path
            or not new_path.endswith(".tsx.txt")
            or old_path + ".txt" != new_path
        ):
            fail(
                f"copiedTo={source['copiedTo']!r} old={old_path!r} new={new_path!r} "
                f"source={source_relative_path}"
            )
        if (REPO_ROOT / old_path).exists():
            fail(f"old archive still exists path={old_path}")
        if entry["sha256"] != source["sha256"] or entry["byteSize"] != source["byteSize"] or entry["byteSize"] != source["copyByteSize"]:
            fail(
                f"locator record source={source_relative_path} sha256={entry['sha256']} "
                f"byteSize={entry['byteSize']} baselineHash={source['sha256']} "
                f"baselineBytes={source['byteSize']} copyBytes={source['copyByteSize']}"
            )
        payload = require_sha256(REPO_ROOT / new_path, source["sha256"], f"article archive {source_relative_path}")
        actual_hash = sha256_bytes(payload)
        if actual_hash != source["copySha256"] or len(payload) != source["byteSize"] or len(payload) != source["copyByteSize"]:
            fail(
                f"archive bytes source={source_relative_path} actualBytes={len(payload)} "
                f"fileSha256={actual_hash} copySha256={source['copySha256']} "
                f"baselineBytes={source['byteSize']} copyBytes={source['copyByteSize']}"
            )


def load_inputs() -> dict:
    provenance = read_json(PIXEL_ROOT / "assets/provenance.json")
    baseline = read_json(PIXEL_ROOT / "baseline/manifest.json")
    exclusions = read_json(PIXEL_ROOT / "baseline/comparison/exclusions.json")
    art_report = (PIXEL_ROOT / "reviews/art/report.md").read_text(encoding="utf-8")
    if "未见 blocker" not in art_report:
        fail("art report has no no-blocker sentence")
    if "major 画面缺陷" not in art_report:
        fail("art report missing major-defect sentence")
    figures = {figure["role"]: figure for figure in provenance["figures"]}
    if set(figures) != {"cover", "interior", "construction"}:
        fail(f"provenance roles={sorted(figures)}")
    sizes = {}
    for role, figure in figures.items():
        png_path = REPO_ROOT / figure["originalInputPath"]
        require_sha256(png_path, figure["originalSha256"], f"png {role}")
        width, height = measured_png_size(png_path)
        if [width, height] != [figure["dimensions"]["width"], figure["dimensions"]["height"]]:
            fail(
                f"png size role={role} measured={width}x{height} "
                f"provenance={figure['dimensions']['width']}x{figure['dimensions']['height']}"
            )
        for image_format in ("webp", "avif"):
            export = figure["exports"][image_format]
            export_path = REPO_ROOT / export["path"]
            require_sha256(export_path, export["sha256"], f"{image_format} {role}")
            decoded_width, decoded_height = decoded_size(export_path)
            if (decoded_width, decoded_height) != (width, height):
                fail(
                    f"export size role={role} format={image_format} "
                    f"decoded={decoded_width}x{decoded_height} png={width}x{height}"
                )
        sizes[role] = {"width": width, "height": height}
    if len({(item["width"], item["height"]) for item in sizes.values()}) != 1:
        fail(f"png sizes differ sizes={sizes}")
    for source in baseline["sources"]:
        require_sha256(REPO_ROOT / source["relativePath"], source["sha256"], f"baseline {source['relativePath']}")
    require_article_archives(baseline)
    registry_path = REPO_ROOT / "src/blog/blog-post-registry.tsx"
    require_sha256(registry_path, baseline["registryNotCopied"]["sha256"], "baseline registry")
    return {
        "provenance": provenance,
        "baseline": baseline,
        "exclusions": exclusions,
        "figures": figures,
        "sizes": sizes,
        "en_handoff": read_json(REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/handoff/public/en.json"),
        "zh_handoff": read_json(REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json"),
    }


def build_bodies(inputs: dict, counter) -> dict:
    exclusions = inputs["exclusions"]
    old_en = inputs["en_handoff"]["body"]
    old_zh = inputs["zh_handoff"]["body"]
    if old_en.encode("utf-8") != (REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/lock/en/body.md").read_bytes():
        fail("english handoff body is not the lock file")
    if old_zh.encode("utf-8") != (REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md").read_bytes():
        fail("chinese handoff body is not draft-zh-v2.md")

    en_blocks = [item["removed"] for item in exclusions["english"]["media"]]
    zh_blocks = [item["removed"] for item in exclusions["chinese"]["media"]]
    en_nursery_old = exclusions["english"]["nursery"]["removed"]
    zh_nursery_old = exclusions["chinese"]["nurseryMarker"]["removed"]
    if en_nursery_old != " " + NURSERY_SENTENCE["en"][0]:
        fail(f"english nursery exclusion={en_nursery_old!r}")
    if zh_nursery_old != NURSERY_SENTENCE["zh-CN"][0]:
        fail(f"chinese nursery exclusion={zh_nursery_old!r}")

    en_sources = [
        "/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp",
        "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp",
    ]
    zh_sources = [
        "/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
        "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
    ]
    en_new_blocks = [
        image_block(MEDIA_TEXT["en"]["tier-rooms"]["alt"], en_sources[0], MEDIA_TEXT["en"]["tier-rooms"]["caption"]),
        image_block(
            MEDIA_TEXT["en"]["upgrade-or-renovation"]["alt"],
            en_sources[1],
            MEDIA_TEXT["en"]["upgrade-or-renovation"]["caption"],
        ),
    ]
    zh_new_blocks = [
        image_block(MEDIA_TEXT["zh-CN"]["tier-rooms"]["alt"], zh_sources[0], MEDIA_TEXT["zh-CN"]["tier-rooms"]["caption"]),
        image_block(
            MEDIA_TEXT["zh-CN"]["upgrade-or-renovation"]["alt"],
            zh_sources[1],
            MEDIA_TEXT["zh-CN"]["upgrade-or-renovation"]["caption"],
        ),
    ]
    for block in (*en_new_blocks, *zh_new_blocks):
        forbid_media_wording(block, "new image block")
    forbid_media_wording(NURSERY_SENTENCE["en"][1], "en nursery")
    forbid_media_wording(NURSERY_SENTENCE["zh-CN"][1], "zh nursery")

    new_en = old_en
    new_en = require_unique_replace(new_en, NURSERY_SENTENCE["en"][0], NURSERY_SENTENCE["en"][1], "en nursery")
    for old_block, new_block in zip(en_blocks, en_new_blocks, strict=True):
        new_en = require_unique_replace(new_en, old_block, new_block, "en image block")
    new_zh = old_zh
    new_zh = require_unique_replace(new_zh, NURSERY_SENTENCE["zh-CN"][0], NURSERY_SENTENCE["zh-CN"][1], "zh nursery")
    for old_block, new_block in zip(zh_blocks, zh_new_blocks, strict=True):
        new_zh = require_unique_replace(new_zh, old_block, new_block, "zh image block")

    old_en_stripped = strip_authorized_media(old_en, en_nursery_old, en_blocks, "old en")
    new_en_stripped = strip_authorized_media(
        new_en, " " + NURSERY_SENTENCE["en"][1], en_new_blocks, "new en"
    )
    old_zh_stripped = strip_authorized_media(old_zh, zh_nursery_old, zh_blocks, "old zh")
    new_zh_stripped = strip_authorized_media(new_zh, NURSERY_SENTENCE["zh-CN"][1], zh_new_blocks, "new zh")
    comparison_en = (PIXEL_ROOT / "baseline/comparison/en-body.comparison.md").read_text(encoding="utf-8")
    comparison_zh = (PIXEL_ROOT / "baseline/comparison/zh-draft-v2.comparison.md").read_text(encoding="utf-8")
    if old_en_stripped != comparison_en or new_en_stripped != old_en_stripped:
        fail(
            "english stripped mismatch "
            f"oldEqualsComparison={old_en_stripped == comparison_en} "
            f"newEqualsOld={new_en_stripped == old_en_stripped} "
            f"oldLen={len(old_en_stripped)} newLen={len(new_en_stripped)} comparisonLen={len(comparison_en)}"
        )
    if old_zh_stripped != comparison_zh or new_zh_stripped != old_zh_stripped:
        fail(
            "chinese stripped mismatch "
            f"oldEqualsComparison={old_zh_stripped == comparison_zh} "
            f"newEqualsOld={new_zh_stripped == old_zh_stripped} "
            f"oldLen={len(old_zh_stripped)} newLen={len(new_zh_stripped)} comparisonLen={len(comparison_zh)}"
        )

    old_en_captions = [
        inputs["en_handoff"]["publicRequirements"]["figures"][1]["caption"],
        inputs["en_handoff"]["publicRequirements"]["figures"][2]["caption"],
    ]
    new_en_captions = [
        MEDIA_TEXT["en"]["tier-rooms"]["caption"],
        MEDIA_TEXT["en"]["upgrade-or-renovation"]["caption"],
    ]
    old_zh_captions = [
        inputs["zh_handoff"]["publicRequirements"]["figures"][1]["caption"],
        inputs["zh_handoff"]["publicRequirements"]["figures"][2]["caption"],
    ]
    new_zh_captions = [
        MEDIA_TEXT["zh-CN"]["tier-rooms"]["caption"],
        MEDIA_TEXT["zh-CN"]["upgrade-or-renovation"]["caption"],
    ]
    count_input = (REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/lock/en/count-input.md").read_text(encoding="utf-8")
    if remove_caption_lines(old_en, old_en_captions, "old en captions") != count_input:
        fail("english caption removal does not match lock/en/count-input.md")
    old_en_counts = qualifying_counts(counter, old_en, "en", old_en_captions, "old en")
    new_en_counts = qualifying_counts(counter, new_en, "en", new_en_captions, "new en")
    old_zh_counts = qualifying_counts(counter, old_zh, "zh-CN", old_zh_captions, "old zh")
    new_zh_counts = qualifying_counts(counter, new_zh, "zh-CN", new_zh_captions, "new zh")
    if old_en_counts["qualified"] != 1085 or old_zh_counts["pureHan"] != 1647:
        fail(f"old length mismatch en={old_en_counts} zh={old_zh_counts}")
    if new_en_counts["qualified"] < 1000 or new_zh_counts["pureHan"] < 1000:
        fail(f"new length below floor en={new_en_counts} zh={new_zh_counts}")
    return {
        "en": new_en,
        "zh-CN": new_zh,
        "counts": {"oldEn": old_en_counts, "newEn": new_en_counts, "oldZh": old_zh_counts, "newZh": new_zh_counts},
        "strippedEqual": True,
    }


def patch_text_files(inputs: dict, bodies: dict) -> dict:
    en_article = (REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx").read_text(encoding="utf-8")
    zh_article = (REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx").read_text(encoding="utf-8")
    registry = (REPO_ROOT / "src/blog/blog-post-registry.tsx").read_text(encoding="utf-8")
    originals = {
        "src/blog/articles/house-upgrade-stardew.en.tsx": en_article,
        "src/blog/articles/house-upgrade-stardew.zh.tsx": zh_article,
        "src/blog/blog-post-registry.tsx": registry,
    }
    en_article = require_unique_replace(
        en_article, NURSERY_SENTENCE["en"][0], NURSERY_SENTENCE["en"][1], "tsx en nursery"
    )
    zh_article = require_unique_replace(
        zh_article, NURSERY_SENTENCE["zh-CN"][0], NURSERY_SENTENCE["zh-CN"][1], "tsx zh nursery"
    )
    for locale, article_name in (("en", "en article"), ("zh-CN", "zh article")):
        article = en_article if locale == "en" else zh_article
        for media_id in ("tier-rooms", "upgrade-or-renovation"):
            old_figure = next(
                figure
                for figure in (inputs["en_handoff"] if locale == "en" else inputs["zh_handoff"])[
                    "publicRequirements"
                ]["figures"]
                if figure["mediaId"] == media_id
            )
            article = require_unique_replace(article, old_figure["alt"], MEDIA_TEXT[locale][media_id]["alt"], f"{article_name} {media_id} alt")
            article = require_unique_replace(
                article, old_figure["caption"], MEDIA_TEXT[locale][media_id]["caption"], f"{article_name} {media_id} caption"
            )
        if locale == "en":
            en_article = article
        else:
            zh_article = article
    for locale, cover_label in (("en", "registry en cover"), ("zh-CN", "registry zh cover")):
        old_cover = next(
            figure["alt"]
            for figure in (inputs["en_handoff"] if locale == "en" else inputs["zh_handoff"])["publicRequirements"]["figures"]
            if figure["mediaId"] == "cover-payments"
        )
        registry = require_unique_replace(registry, old_cover, MEDIA_TEXT[locale]["cover-payments"]["alt"], cover_label)
    size = next(iter(inputs["sizes"].values()))
    for label, article in (("en", en_article), ("zh", zh_article)):
        width_token = f"width={{{size['width']}}}" if label == "en" else f'width={{{size["width"]}}}'
        # Both articles already use width={1672}. Assert the measured token is present twice.
        token = "width={" + str(size["width"]) + "}"
        height_token = "height={" + str(size["height"]) + "}"
        if article.count(token) != 2 or article.count(height_token) != 2:
            fail(
                f"picture size tokens label={label} widthCount={article.count(token)} "
                f"heightCount={article.count(height_token)} measured={size['width']}x{size['height']}"
            )
    return {
        "articles": {
            "src/blog/articles/house-upgrade-stardew.en.tsx": en_article,
            "src/blog/articles/house-upgrade-stardew.zh.tsx": zh_article,
        },
        "registry": registry,
        "originals": originals,
    }


def build_handoff(old: dict, locale: str, body: str, english_body_hash: str, file_hashes: dict, size: dict) -> dict:
    document = json.loads(json.dumps(old))
    document["body"] = body
    document["bodyHash"] = sha256_bytes(body.encode("utf-8"))
    if locale == "zh-CN":
        document["englishBodyHash"] = english_body_hash
    for figure in document["publicRequirements"]["figures"]:
        media_id = figure["mediaId"]
        spec = MEDIA_TEXT[locale][media_id]
        role = ROLE_BY_MEDIA_ID[media_id]
        webp_key = "public" + figure["src"]
        avif_key = "public" + figure["siblingAvif"]
        if webp_key not in file_hashes or avif_key not in file_hashes:
            fail(f"missing copied file webp={webp_key} avif={avif_key} known={sorted(file_hashes)}")
        public_webp = file_hashes[webp_key]
        public_avif = file_hashes[avif_key]
        figure["width"] = size["width"]
        figure["height"] = size["height"]
        figure["alt"] = spec["alt"]
        figure["caption"] = spec["caption"]
        figure["inImageText"] = []
        figure["webpSha256"] = public_webp["sha256"]
        figure["webpByteSize"] = public_webp["bytes"]
        figure["avifSha256"] = public_avif["sha256"]
        figure["avifByteSize"] = public_avif["bytes"]
        figure["sourceAttribute"] = SOURCE_ATTRIBUTE
        if "placement" in spec:
            figure["placement"] = spec["placement"]
        forbid_media_wording(figure["alt"], f"{locale} {media_id} alt")
        forbid_media_wording(figure["caption"], f"{locale} {media_id} caption")
    media_by_id = {item["mediaId"]: item for item in document["seo"]["mediaText"]}
    if set(media_by_id) != set(ROLE_BY_MEDIA_ID):
        fail(f"mediaText ids={sorted(media_by_id)} locale={locale}")
    for media_id, item in media_by_id.items():
        figure = next(figure for figure in document["publicRequirements"]["figures"] if figure["mediaId"] == media_id)
        item["alt"] = figure["alt"]
        item["caption"] = figure["caption"]
        item["inImageText"] = []
        item["sourceAttribute"] = SOURCE_ATTRIBUTE
    if locale == "zh-CN":
        document["integrity"]["englishBodyHash"] = english_body_hash
    document["integrity"]["status"] = (
        "Pixel-v2 media integration. Historical freeze files were not modified, and their hashes do not cover this version. "
        "User aesthetic acceptance is not claimed. Browser review is not claimed. Production is not deployed."
    )
    document["integrity"]["publicFieldsSha256"] = canonical_public_fields(document)
    if canonical_public_fields(document) != document["integrity"]["publicFieldsSha256"]:
        fail(f"publicFieldsSha256 unstable locale={locale}")
    return document


def restore(original_bytes: dict[Path, bytes]) -> None:
    for path, payload in original_bytes.items():
        path.write_bytes(payload)


def write_outputs(inputs: dict, bodies: dict, patched: dict) -> dict:
    copies = require_public_copy_map()
    mutable_paths = [
        REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx",
        REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx",
        REPO_ROOT / "src/blog/blog-post-registry.tsx",
    ]
    for role in copies.values():
        for paths in role.values():
            mutable_paths.extend(REPO_ROOT / relative for relative in paths)
    original_bytes = {path: path.read_bytes() for path in mutable_paths}
    try:
        file_hashes = copy_public_assets(inputs, copies)
        write_text(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx", patched["articles"]["src/blog/articles/house-upgrade-stardew.en.tsx"])
        write_text(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx", patched["articles"]["src/blog/articles/house-upgrade-stardew.zh.tsx"])
        write_text(REPO_ROOT / "src/blog/blog-post-registry.tsx", patched["registry"])
        write_text(VERSION_ROOT / "body/en.md", bodies["en"])
        write_text(VERSION_ROOT / "body/zh-CN.md", bodies["zh-CN"])
        size = next(iter(inputs["sizes"].values()))
        en_document = build_handoff(inputs["en_handoff"], "en", bodies["en"], "", file_hashes, size)
        english_body_hash = en_document["bodyHash"]
        zh_document = build_handoff(inputs["zh_handoff"], "zh-CN", bodies["zh-CN"], english_body_hash, file_hashes, size)
        en_path = VERSION_ROOT / "handoff/en.json"
        zh_path = VERSION_ROOT / "handoff/zh-CN.json"
        write_json(en_path, en_document)
        write_json(zh_path, zh_document)
        manifest = build_manifest(inputs, en_document, zh_document, en_path, zh_path, file_hashes, size)
        write_json(VERSION_ROOT / "AssemblyManifest.json", manifest)
        verify_written(inputs, bodies, patched, en_document, zh_document, file_hashes)
        return {"fileHashes": file_hashes, "en": en_document, "zh": zh_document, "manifest": manifest}
    except Exception:
        restore(original_bytes)
        raise


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, document: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def copy_public_assets(inputs: dict, copies: dict) -> dict:
    file_hashes = {}
    for role, formats in copies.items():
        figure = inputs["figures"][role]
        for image_format, destinations in formats.items():
            source = REPO_ROOT / figure["exports"][image_format]["path"]
            for destination in destinations:
                target = REPO_ROOT / destination
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
                cmp_paths(source, target)
                payload = target.read_bytes()
                digest = sha256_bytes(payload)
                if digest != figure["exports"][image_format]["sha256"]:
                    fail(f"copied sha256={digest} expected={figure['exports'][image_format]['sha256']} path={destination}")
                width, height = decoded_size(target)
                expected = inputs["sizes"][role]
                if (width, height) != (expected["width"], expected["height"]):
                    fail(f"copied size={width}x{height} expected={expected} path={destination}")
                file_hashes[destination] = {"sha256": digest, "bytes": len(payload), "width": width, "height": height}
    if len(file_hashes) != 12:
        fail(f"copied file count={len(file_hashes)}")
    return file_hashes


def build_manifest(inputs, en_document, zh_document, en_path: Path, zh_path: Path, file_hashes: dict, size: dict) -> dict:
    historical = REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json"
    historical_sha = sha256_bytes(historical.read_bytes())
    if historical_sha != "6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834":
        fail(f"historical AssemblyManifest sha256={historical_sha}")
    media = []
    for locale, document in (("en", en_document), ("zh-CN", zh_document)):
        for figure in document["publicRequirements"]["figures"]:
            for image_format, public_field, role_name in (
                ("webp", figure["src"], figure["role"]),
                ("avif", figure["siblingAvif"], f"{figure['role']}-sibling"),
            ):
                relative = "public" + public_field
                if relative not in file_hashes:
                    fail(f"manifest missing public file key={relative}")
                source_role = ROLE_BY_MEDIA_ID[figure["mediaId"]]
                source_relative = inputs["figures"][source_role]["exports"][image_format]["path"]
                media.append(
                    {
                        "locale": locale,
                        "mediaId": figure["mediaId"],
                        "role": role_name,
                        "publicPath": public_field,
                        "productPath": relative,
                        "sourcePath": source_relative,
                        "format": image_format,
                        "sha256": file_hashes[relative]["sha256"],
                        "bytes": file_hashes[relative]["bytes"],
                        "width": size["width"],
                        "height": size["height"],
                        "cmpExitCode": 0,
                        "sourceAttribute": SOURCE_ATTRIBUTE,
                    }
                )
    return {
        "kind": "AssemblyManifest",
        "slug": "house-upgrade-stardew",
        "version": "pixel-v2",
        "historicalManifestPath": "docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json",
        "historicalManifestSha256": historical_sha,
        "historicalManifestUnmodified": True,
        "userFinalReview": "not-claimed",
        "productionDeployed": False,
        "pageBrowserPassClaimed": False,
        "textRewritten": False,
        "buildTypecheckAndTestsRunByThisOwner": False,
        "handoffs": {
            "en": {
                "path": str(en_path.relative_to(REPO_ROOT)),
                "fileSha256": sha256_bytes(en_path.read_bytes()),
                "bodyHash": en_document["bodyHash"],
                "publicFieldsSha256": en_document["integrity"]["publicFieldsSha256"],
            },
            "zh-CN": {
                "path": str(zh_path.relative_to(REPO_ROOT)),
                "fileSha256": sha256_bytes(zh_path.read_bytes()),
                "bodyHash": zh_document["bodyHash"],
                "englishBodyHash": zh_document["englishBodyHash"],
                "publicFieldsSha256": zh_document["integrity"]["publicFieldsSha256"],
            },
        },
        "articles": {
            "en": {
                "module": "src/blog/articles/house-upgrade-stardew.en.tsx",
                "sha256": sha256_bytes((REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx").read_bytes()),
                "bodyHash": en_document["bodyHash"],
            },
            "zh-CN": {
                "module": "src/blog/articles/house-upgrade-stardew.zh.tsx",
                "sha256": sha256_bytes((REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx").read_bytes()),
                "bodyHash": zh_document["bodyHash"],
            },
        },
        "registry": {
            "module": "src/blog/blog-post-registry.tsx",
            "sha256": sha256_bytes((REPO_ROOT / "src/blog/blog-post-registry.tsx").read_bytes()),
            "coverAlt": {
                "en": MEDIA_TEXT["en"]["cover-payments"]["alt"],
                "zh-CN": MEDIA_TEXT["zh-CN"]["cover-payments"]["alt"],
            },
        },
        "media": media,
        "dimensions": {
            "width": size["width"],
            "height": size["height"],
            "ratio": size["width"] / size["height"],
            "sixteenByNine": 16 / 9,
            "calledExactSixteenByNine": False,
        },
    }


def verify_written(inputs, bodies, patched, en_document, zh_document, file_hashes) -> None:
    en_body_path = VERSION_ROOT / "body/en.md"
    zh_body_path = VERSION_ROOT / "body/zh-CN.md"
    if en_body_path.read_text(encoding="utf-8") != bodies["en"]:
        fail("written english body differs from handoff body")
    if zh_body_path.read_text(encoding="utf-8") != bodies["zh-CN"]:
        fail("written chinese body differs from handoff body")
    if sha256_bytes(bodies["en"].encode("utf-8")) != en_document["bodyHash"]:
        fail("english bodyHash mismatch")
    if sha256_bytes(bodies["zh-CN"].encode("utf-8")) != zh_document["bodyHash"]:
        fail("chinese bodyHash mismatch")
    if zh_document["englishBodyHash"] != en_document["bodyHash"]:
        fail(
            f"englishBodyHash={zh_document['englishBodyHash']} enBodyHash={en_document['bodyHash']}"
        )
    if zh_document["integrity"]["englishBodyHash"] != en_document["bodyHash"]:
        fail("integrity.englishBodyHash mismatch")
    reloaded_en = read_json(VERSION_ROOT / "handoff/en.json")
    reloaded_zh = read_json(VERSION_ROOT / "handoff/zh-CN.json")
    if canonical_public_fields(reloaded_en) != reloaded_en["integrity"]["publicFieldsSha256"]:
        fail("reloaded english publicFieldsSha256 mismatch")
    if canonical_public_fields(reloaded_zh) != reloaded_zh["integrity"]["publicFieldsSha256"]:
        fail("reloaded chinese publicFieldsSha256 mismatch")
    if reloaded_en["publicReferences"] != inputs["en_handoff"]["publicReferences"]:
        fail("english publicReferences changed")
    if reloaded_zh["publicReferences"] != inputs["zh_handoff"]["publicReferences"]:
        fail("chinese publicReferences changed")
    if len(reloaded_en["publicReferences"]) != 12 or len(reloaded_zh["publicReferences"]) != 12:
        fail("publicReferences count is not 12")
    for key in ("title", "h1", "description", "slug", "ogTitle", "ogDescription", "faq", "articleSpecificCta", "internalLinks"):
        if reloaded_en["seo"][key] != inputs["en_handoff"]["seo"][key]:
            fail(f"english seo field changed key={key}")
        if reloaded_zh["seo"][key] != inputs["zh_handoff"]["seo"][key]:
            fail(f"chinese seo field changed key={key}")
    for requirements_key in ("author", "topic", "featured", "readTimeMinutes", "publishedAt", "canonicalPath"):
        if reloaded_en["publicRequirements"][requirements_key] != inputs["en_handoff"]["publicRequirements"][requirements_key]:
            fail(f"english requirement changed key={requirements_key}")
        if reloaded_zh["publicRequirements"][requirements_key] != inputs["zh_handoff"]["publicRequirements"][requirements_key]:
            fail(f"chinese requirement changed key={requirements_key}")
    article_en = (REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx").read_text(encoding="utf-8")
    article_zh = (REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx").read_text(encoding="utf-8")
    registry = (REPO_ROOT / "src/blog/blog-post-registry.tsx").read_text(encoding="utf-8")
    if article_en != patched["articles"]["src/blog/articles/house-upgrade-stardew.en.tsx"]:
        fail("english article bytes differ from planned text")
    if article_zh != patched["articles"]["src/blog/articles/house-upgrade-stardew.zh.tsx"]:
        fail("chinese article bytes differ from planned text")
    if registry != patched["registry"]:
        fail("registry bytes differ from planned text")
    reversed_en = article_en
    reversed_zh = article_zh
    reversed_registry = registry
    reversed_en = require_unique_replace(reversed_en, NURSERY_SENTENCE["en"][1], NURSERY_SENTENCE["en"][0], "reverse en nursery")
    reversed_zh = require_unique_replace(reversed_zh, NURSERY_SENTENCE["zh-CN"][1], NURSERY_SENTENCE["zh-CN"][0], "reverse zh nursery")
    for media_id in ("tier-rooms", "upgrade-or-renovation"):
        reversed_en = require_unique_replace(
            reversed_en,
            MEDIA_TEXT["en"][media_id]["alt"],
            next(figure["alt"] for figure in inputs["en_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == media_id),
            f"reverse en {media_id} alt",
        )
        reversed_en = require_unique_replace(
            reversed_en,
            MEDIA_TEXT["en"][media_id]["caption"],
            next(figure["caption"] for figure in inputs["en_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == media_id),
            f"reverse en {media_id} caption",
        )
        reversed_zh = require_unique_replace(
            reversed_zh,
            MEDIA_TEXT["zh-CN"][media_id]["alt"],
            next(figure["alt"] for figure in inputs["zh_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == media_id),
            f"reverse zh {media_id} alt",
        )
        reversed_zh = require_unique_replace(
            reversed_zh,
            MEDIA_TEXT["zh-CN"][media_id]["caption"],
            next(figure["caption"] for figure in inputs["zh_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == media_id),
            f"reverse zh {media_id} caption",
        )
    reversed_registry = require_unique_replace(
        reversed_registry,
        MEDIA_TEXT["en"]["cover-payments"]["alt"],
        next(figure["alt"] for figure in inputs["en_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == "cover-payments"),
        "reverse registry en",
    )
    reversed_registry = require_unique_replace(
        reversed_registry,
        MEDIA_TEXT["zh-CN"]["cover-payments"]["alt"],
        next(figure["alt"] for figure in inputs["zh_handoff"]["publicRequirements"]["figures"] if figure["mediaId"] == "cover-payments"),
        "reverse registry zh",
    )
    if reversed_en != patched["originals"]["src/blog/articles/house-upgrade-stardew.en.tsx"]:
        fail("reversed english article is not the original")
    if reversed_zh != patched["originals"]["src/blog/articles/house-upgrade-stardew.zh.tsx"]:
        fail("reversed chinese article is not the original")
    if sha256_bytes(reversed_registry.encode("utf-8")) != inputs["baseline"]["registryNotCopied"]["sha256"]:
        fail("reversed registry hash is not the baseline registry")
    untouched = [
        "docs/blog-ops/house-upgrade-stardew/handoff/public/en.json",
        "docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json",
        "docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json",
        "docs/blog-ops/house-upgrade-stardew/lock/en/body.md",
        "docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md",
    ]
    expected = {source["relativePath"]: source["sha256"] for source in inputs["baseline"]["sources"]}
    for relative in untouched:
        require_sha256(REPO_ROOT / relative, expected[relative], f"untouched {relative}")
    if len(file_hashes) != 12:
        fail(f"verified public file count={len(file_hashes)}")


def write_generation_record() -> None:
    record = {
        "recordKind": "internal-generation-provenance",
        "publishToPublicPage": False,
        "tool": "image_gen.imagegen",
        "mode": "built-in",
        "requestedCalls": 3,
        "actualCalls": 3,
        "successes": 3,
        "retries": 0,
        "remainingAuthorizedCalls": 0,
        "transparentBackground": False,
        "selectedMethod": "system imagegen with native image_gen tool",
        "assets": [
            {
                "key": "cover",
                "path": "/Users/wusir/.codex/generated_images/01a13fcd-cfb6-7451-8c4d-c7734a680f71/exec-b4be9f3a-c753-46d2-b5c8-4e40a2f9d408.png",
                "prompt": (
                    "Use case: stylized-concept. Create ONE finished full-bleed landscape illustration for a bilingual Stardew Valley farmhouse-upgrade blog. "
                    "Canvas: widescreen 16:9, target 2048x1152. Visual language: authentic cozy 16-bit farming RPG pixel art, like a lovingly crafted in-game environment; "
                    "crisp square pixel clusters on a consistent pixel grid, deliberately stepped outlines, restrained dithering and a limited harmonious palette. "
                    "Flat 2D top-down three-quarter game view, readable tile geometry, warm honey timber, terracotta roof, cream walls, lush sage and forest greens, "
                    "warm late-afternoon light and soft purple pixel shadows. Rich handcrafted environmental details with a clear focal point and uncluttered composition. "
                    "Keep all important subjects away from extreme edges. Render a complete scene, not a poster, diagram, triptych or collage. "
                    "Absolutely no visible text, letters, digits, labels, UI, HUD, menus, price cards, arrows, panels, logos, signatures, watermarks or pseudo-writing. "
                    "Avoid blurry antialiased edges, gradients, painterly brushwork, photorealism, glossy 3D and modern vector illustration. Opaque background.\n"
                    "Scene: a beautifully expanded wooden farmhouse centered in a small lush farm clearing, welcoming front porch, flower pots, chimney, shutters and warm windows. "
                    "A winding earth path leads to the front door. Small neat crop beds and a low wooden fence frame the foreground; leafy trees frame the background. "
                    "A tidy stack of pale construction planks and a few darker hardwood logs rest beside the house, suggesting an upgrade just completed. "
                    "The farmhouse is the large unmistakable hero, filling most of the composition. Quiet, inviting, warm and lived-in. No character is needed. "
                    "This is an atmospheric original editorial illustration, not an exact screenshot or a canonical floor plan."
                ),
            },
            {
                "key": "interior",
                "path": "/Users/wusir/.codex/generated_images/01a13fcd-cfb6-7451-8c4d-c7734a680f71/exec-9eb5a2c6-1c3f-41b3-b7e2-0d04f70111ae.png",
                "prompt": (
                    "Use case: stylized-concept. Create ONE finished full-bleed landscape illustration for a bilingual Stardew Valley farmhouse-upgrade blog. "
                    "Canvas: widescreen 16:9, target 2048x1152. Visual language: authentic cozy 16-bit farming RPG pixel art, like a lovingly crafted in-game environment; "
                    "crisp square pixel clusters on a consistent pixel grid, deliberately stepped outlines, restrained dithering and a limited harmonious palette. "
                    "Flat 2D top-down three-quarter game view, readable tile geometry, warm honey timber, terracotta roof, cream walls, lush sage and forest greens, "
                    "warm late-afternoon light and soft purple pixel shadows. Rich handcrafted environmental details with a clear focal point and uncluttered composition. "
                    "Keep all important subjects away from extreme edges. Render a complete scene, not a poster, diagram, triptych or collage. "
                    "Absolutely no visible text, letters, digits, labels, UI, HUD, menus, price cards, arrows, panels, logos, signatures, watermarks or pseudo-writing. "
                    "Avoid blurry antialiased edges, gradients, painterly brushwork, photorealism, glossy 3D and modern vector illustration. Opaque background.\n"
                    "Scene: one cohesive cozy farmhouse interior viewed from above with the front walls cut away, as an immersive playable room scene. "
                    "A furnished kitchen with wooden counters, stove, fridge and a little dining table connects through a visible doorway to a warm bedroom and nursery nook. "
                    "Include a clearly recognizable wooden baby crib, two small children's beds and a rug in the nursery area; a double bed and a lamp in the bedroom. "
                    "Timber floor tiles, cream plaster walls, potted plants, windows and a few homely furnishings. Clear doorways and walking space, consistent object scale. "
                    "Emphasize the pleasant sense of extra living space after a farmhouse upgrade. ONE continuous house interior, no multiple stages, comparison panels or exploded architectural diagram. "
                    "Original illustrative room arrangement, not a claim to an exact game map."
                ),
            },
            {
                "key": "construction",
                "path": "/Users/wusir/.codex/generated_images/01a13fcd-cfb6-7451-8c4d-c7734a680f71/exec-5a96f6ed-6fd9-4eae-a516-131c31788fb0.png",
                "prompt": (
                    "Use case: stylized-concept. Create ONE finished full-bleed landscape illustration for a bilingual Stardew Valley farmhouse-upgrade blog. "
                    "Canvas: widescreen 16:9, target 2048x1152. Visual language: authentic cozy 16-bit farming RPG pixel art, like a lovingly crafted in-game environment; "
                    "crisp square pixel clusters on a consistent pixel grid, deliberately stepped outlines, restrained dithering and a limited harmonious palette. "
                    "Flat 2D top-down three-quarter game view, readable tile geometry, warm honey timber, terracotta roof, cream walls, lush sage and forest greens, "
                    "warm late-afternoon light and soft purple pixel shadows. Rich handcrafted environmental details with a clear focal point and uncluttered composition. "
                    "Keep all important subjects away from extreme edges. Render a complete scene, not a poster, diagram, triptych or collage. "
                    "Absolutely no visible text, letters, digits, labels, UI, HUD, menus, price cards, arrows, panels, logos, signatures, watermarks or pseudo-writing. "
                    "Avoid blurry antialiased edges, gradients, painterly brushwork, photorealism, glossy 3D and modern vector illustration. Opaque background.\n"
                    "Scene: one wooden farmhouse being expanded on a green farm, with a small carpenter working beside a porch extension. "
                    "The carpenter is a tiny clearly drawn farming-game sprite with auburn hair, work shirt and tool belt, raising a small hammer toward a solid timber beam. "
                    "A second small farmer sprite stands nearby watching. Simple timber scaffolding along one side of the farmhouse, a neat stack of planks and logs, a toolbox, fence and dirt path make the task legible. "
                    "The finished main part of the house remains cozy and welcoming, with windows and flowers, while the side extension is visibly under construction. "
                    "Coherent wooden joinery and clean readable silhouettes. ONE continuous outdoor game scene, no before/after split and no coins or payment graphics. "
                    "Original editorial illustration, not an official game screenshot."
                ),
            },
        ],
        "correctionsApplied": [
            "Used measured PNG dimensions instead of calling the canvas exact 16:9.",
            "Captions describe one farmhouse, two single beds, and a generic carpenter.",
            "Did not copy review-plan alt text that named Robin, seasons, stages, or bunk beds.",
            "Did not reuse the historical handoff hashes.",
        ],
    }
    if len(record["assets"]) != 3:
        fail(f"generation asset count={len(record['assets'])}")
    for asset in record["assets"]:
        if not asset["prompt"].startswith("Use case: stylized-concept."):
            fail(f"prompt missing prefix key={asset['key']}")
        if "/Users/" in asset["prompt"]:
            fail(f"prompt contains a local path key={asset['key']}")
    write_json(INTEGRATION_ROOT / "generation-record.json", record)


def write_report(inputs: dict, bodies: dict, written: dict) -> None:
    size = next(iter(inputs["sizes"].values()))
    ratio_gap = abs((size["width"] / size["height"]) - (16 / 9))
    en_hash = written["en"]["bodyHash"]
    zh_hash = written["zh"]["bodyHash"]
    en_public = written["en"]["integrity"]["publicFieldsSha256"]
    zh_public = written["zh"]["integrity"]["publicFieldsSha256"]
    counts = bodies["counts"]
    report = f"""# pixel-v2 接入

视觉审查报告写明没有 blocker。三张原图和 6 个导出的 sha256 与 provenance 一致后才替换。

实测尺寸是 {size['width']}×{size['height']}。宽高比与 16/9 相差 {ratio_gap:.6f}，没有改像素，也没有写成精确 16:9。

英文合格词数 {counts['oldEn']['qualified']} → {counts['newEn']['qualified']}。中文去图注汉字 {counts['oldZh']['pureHan']} → {counts['newZh']['pureHan']}。去掉图注和图片引用句后，新旧正文相等。

英文 bodyHash `{en_hash}`。中文 bodyHash `{zh_hash}`。英文 publicFieldsSha256 `{en_public}`。中文 publicFieldsSha256 `{zh_public}`。

12 个公共文件都和对应导出 cmp 退出码 0。旧 handoff、旧 AssemblyManifest、lock 和中文草稿的哈希没有改。没有声称用户审美或部署通过。后续构建若要跑，用 `pnpm exec next build --webpack`。浏览器是中英各桌面和手机共 4 个视图。
"""
    write_text(INTEGRATION_ROOT / "report.md", report)
    summary = {
        "passed": True,
        "width": size["width"],
        "height": size["height"],
        "ratioGapFrom16by9": ratio_gap,
        "counts": counts,
        "bodyHash": {"en": en_hash, "zh-CN": zh_hash},
        "publicFieldsSha256": {"en": en_public, "zh-CN": zh_public},
        "publicFiles": written["fileHashes"],
        "userAestheticAcceptance": False,
        "productionDeployed": False,
    }
    write_json(INTEGRATION_ROOT / "checks.json", summary)


def main() -> None:
    counter = load_length_counter()
    inputs = load_inputs()
    bodies = build_bodies(inputs, counter)
    patched = patch_text_files(inputs, bodies)
    written = write_outputs(inputs, bodies, patched)
    write_generation_record()
    write_report(inputs, bodies, written)
    print(json.dumps({"ok": True, "qualifiedEn": bodies["counts"]["newEn"]["qualified"], "pureHan": bodies["counts"]["newZh"]["pureHan"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
