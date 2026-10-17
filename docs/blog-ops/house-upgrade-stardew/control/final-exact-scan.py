#!/usr/bin/env python3
"""Fail-closed exact scan for the frozen house-upgrade public targets.

Reads the private canary file in memory. Prints hashes, field counts, and
redacted hit types only. A missing target, hash mismatch, exact hit, or
nonzero hit counter raises and exits non-zero.
"""

import hashlib
import json
import os
import re
import socket
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ElementTree

os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.dont_write_bytecode = True

ARTICLE_ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
OPS_ROOT = ARTICLE_ROOT / "docs/blog-ops/house-upgrade-stardew"
IDENTITY_PATH = OPS_ROOT / "control/canary-identity.json"
V7_SCRIPT_DIR = Path("/Users/wusir/Desktop/博客-V7修订版/脚本")
V7_CACHE_DIR = V7_SCRIPT_DIR / "__pycache__"
PREVIEW_ORIGIN = "http://127.0.0.1:3010"
EXPECTED_PREVIEW_PID = "21887"
EXPECTED_IDENTITY_FILE_SHA256 = (
    "d8022e54453b9c56da89bfbcfd350f0aa3a8c675a1d8976f5b85a1a9e702ed23"
)
EXPECTED_MARKER_SHA256 = (
    "401cad403b3b56138aee2a8cde4c2099a87c2c780f178ff05cc664816d6efac1"
)
LOCKED_ENGLISH_BODY_SHA256 = (
    "f343aee1192b7b4f8d605b183569c39dc187859c041d6de658019f0ab5734d8f"
)
LOCKED_CHINESE_BODY_SHA256 = (
    "0190b09fc27df1b32919f65a1e688b484c29f3bbc049021188b5f472e9867bc6"
)
ENGLISH_PUBLIC_FIELDS_SHA256 = (
    "c3c2c5f3b06206e13403e6fefb9573713502f32b5c172402e21fcc1dc1437042"
)
CHINESE_PUBLIC_FIELDS_SHA256 = (
    "d535eaacd441c15006e1e3189e6aac6d7c25162f02bbd68984befe9d35329d94"
)
PRIOR_ENGLISH_PROVENANCE_BODY_SHA256 = (
    "cb5b0115f330b6d86a5be82b015ef14dcd33b35ac0ac10d33a98be684a548628"
)
PRIOR_CHINESE_PROVENANCE_BODY_SHA256 = (
    "9e28797bb3b639dcdf39cc20200257346bfd25dc0c2974ff120f3fb4f140a843"
)

EXPECTED_FILE_SHA256 = {
    "docs/blog-ops/house-upgrade-stardew/handoff/public/en.json": (
        "cec56b5e5420996636aada50776866bd7f4da8d1f3018b88c8a0c119b06dd7d3"
    ),
    "docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json": (
        "0e6456c0a554e32f5157b791b50249449ce887acf5187b27f524aecf5c9add1c"
    ),
    "docs/blog-ops/house-upgrade-stardew/handoff/freeze-report.md": (
        "dd9daf7299b339c7527f6870a3a74162344e409e37dac8710ca65bd524b1ee32"
    ),
    "docs/blog-ops/house-upgrade-stardew/handoff/freeze-checks.log": (
        "2e3fadbb8b8d32310b075a81afe086da5ebccfa6b87e4e28a68c5ebc69f37a4e"
    ),
    "docs/blog-ops/house-upgrade-stardew/lock/en/body.md": LOCKED_ENGLISH_BODY_SHA256,
    "docs/blog-ops/house-upgrade-stardew/content/en/draft-v4.md": LOCKED_ENGLISH_BODY_SHA256,
    "docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md": (
        LOCKED_CHINESE_BODY_SHA256
    ),
    "docs/blog-ops/house-upgrade-stardew/seo/en/seo-candidate.json": (
        "b6e2b7e20f4942945af2258c3eb28455680e952feaf2d04a9c7d424a75f55b58"
    ),
    "docs/blog-ops/house-upgrade-stardew/content/zh/seo.zh.json": (
        "f744f783cf4b04d1cf0d66a2029cafaedaaf5eb04754e7b1e13612e48c29be16"
    ),
    "docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json": (
        "1e2591eb59d7a9df99c43c1d97fc44ce2c856c67d96e840770dd37166878ef27"
    ),
    "docs/blog-ops/house-upgrade-stardew/content/zh/public-references.zh.json": (
        "b2e0781d81b60a10ba6586ca8c0ea7032ce9e2f24df05fb80587dba8733f9127"
    ),
    "docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json": (
        "75bc0c2085e6f86d8fb1a9dbc8393f4fe53e75bc84f4dea9096f7c4b1f4cf400"
    ),
    "docs/blog-ops/house-upgrade-stardew/content/zh/media-text.zh.json": (
        "43c6138438d5a29bb13ab0daf0ccd9b5c6498284191a79680c53e84ade7298aa"
    ),
    "src/blog/articles/house-upgrade-stardew.en.tsx": (
        "cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5"
    ),
    "src/blog/articles/house-upgrade-stardew.zh.tsx": (
        "2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba"
    ),
    "docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json": (
        "6ce4e84ffbcc1252f2cebd443e4ccceac5a60d29c2ceb41dd74eaabd68fc6834"
    ),
    "docs/blog-ops/house-upgrade-stardew/assembly/validation/report.md": (
        "76503d1cc1008b3fd073e6a976c5f124be56739da22dceb083c373f72d0582d6"
    ),
    "docs/blog-ops/house-upgrade-stardew/assembly/validation/commands.log": (
        "bfd1b169b5e4156e3272502c3cb4df08b3eba7ef37752775c7f4a3aaa63ab26d"
    ),
    "docs/blog-ops/house-upgrade-stardew/assembly/validation/baseline-comparison.md": (
        "5f1d279ecd0a93d2aad5c4177ea09dec8c5246efbf0bbcfb25f744d11ec86b38"
    ),
    "docs/blog-ops/house-upgrade-stardew/assembly/validation/preview.json": (
        "fc0e91e377bdfed1ec183d38144caaa12698cf364046cf5cfa58f3f57da77e3b"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/R/report.md": (
        "e80e3ac7a5fab33065348620c379847dfb75cb0246c560ee4d01c347a1fd29b7"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/R/checks.log": (
        "d8e3c645aed3868b44fe802d15bf8df446ebac27d6367d2681fc226f60f796f6"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/R/addendum.md": (
        "95022b8990bae86e637a4369d23a3d33160bff2fb5e63c71693d6304d39ee59e"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/R/addendum-checks.log": (
        "ec6cd107d17a8eb7c47666908a88174f25120be9f3945cf3a4b9bfeede131e3d"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/E/pages/report.md": (
        "359c0b7ed4cbec2dca1abf97f997a910296974f2bb6e6683a425935d463ab617"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/E/pages/checks.log": (
        "48374708beb0a3c39608728ac0df468baf520dd7b5bc938f3a646784c02f2c6b"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/E/pages/interaction.json": (
        "9dac1f4e042c3459974a0d9cb7d04a6e3499486bd2cab6b212d11cde14890eb1"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/E/pages/bytes.json": (
        "734fde63321e134183a322aef8c88f5e167061841e8b97e032c445b1008a9d5b"
    ),
    "docs/blog-ops/house-upgrade-stardew/reviews/E/translation-v2/report.md": (
        "ab443f03e8bbcc923a274d6897cb5bee060973d2108537301b48ae52956caed0"
    ),
    "out/house-upgrade-stardew.html": (
        "3ca9995c83780becbaca28e891f2d067aabcd9d3052707afc53826a7096c6430"
    ),
    "out/zh/house-upgrade-stardew.html": (
        "ce02bd73e681374e7d8b3a2cbd03429252009aefa084c1f695ccaa3e067df77f"
    ),
    "next-env.d.ts": (
        "0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc"
    ),
}

RASTER_ASSETS = (
    {
        "filename": "house-upgrade-stardew-cover.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.webp",
        "public": "public/blog/house-upgrade-stardew-cover.webp",
        "exported": "out/blog/house-upgrade-stardew-cover.webp",
        "url_path": "/blog/house-upgrade-stardew-cover.webp",
        "sha256": "c9309a69f763f1368d6315e854a3457fab26de8658bcc6a4783389c27f58a342",
        "byte_size": 72418,
    },
    {
        "filename": "house-upgrade-stardew-cover.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/house-upgrade-stardew-cover.avif",
        "public": "public/blog/house-upgrade-stardew-cover.avif",
        "exported": "out/blog/house-upgrade-stardew-cover.avif",
        "url_path": "/blog/house-upgrade-stardew-cover.avif",
        "sha256": "f9c086bf54e4de407c2993d19d7f52e2923b76a77a217b3d2a47267922fde113",
        "byte_size": 39621,
    },
    {
        "filename": "tier-rooms.en.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.webp",
        "public": "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp",
        "exported": "out/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp",
        "url_path": "/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp",
        "sha256": "c73b0578f6b08d7b71ea1ad39f3636686c5d230d2db40b663364a2445c58b209",
        "byte_size": 70092,
    },
    {
        "filename": "tier-rooms.en.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/tier-rooms.en.avif",
        "public": "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif",
        "exported": "out/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif",
        "url_path": "/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif",
        "sha256": "8654ef287c8f45809ef51abcda5e305d306d4e08b58bbbb57074944e13812d9b",
        "byte_size": 38764,
    },
    {
        "filename": "upgrade-or-renovation.en.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.webp",
        "public": "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp",
        "exported": "out/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp",
        "url_path": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp",
        "sha256": "040b07f5701e1a142d803f07ebeb890881a261488a2b060e6d3f80a153d2d19b",
        "byte_size": 68194,
    },
    {
        "filename": "upgrade-or-renovation.en.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/en/upgrade-or-renovation.en.avif",
        "public": "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif",
        "exported": "out/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif",
        "url_path": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif",
        "sha256": "1cff7e951ffc73cac5ec9dba522159dcd36202ef2a7196047708b2c818116426",
        "byte_size": 36133,
    },
    {
        "filename": "house-upgrade-stardew-cover-zh.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.webp",
        "public": "public/blog/house-upgrade-stardew-cover-zh.webp",
        "exported": "out/blog/house-upgrade-stardew-cover-zh.webp",
        "url_path": "/blog/house-upgrade-stardew-cover-zh.webp",
        "sha256": "bf601afcc70fe72e5ecf31c9d250a43781db0aa9d02281fd7fc7476b02265e87",
        "byte_size": 63012,
    },
    {
        "filename": "house-upgrade-stardew-cover-zh.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/house-upgrade-stardew-cover-zh.avif",
        "public": "public/blog/house-upgrade-stardew-cover-zh.avif",
        "exported": "out/blog/house-upgrade-stardew-cover-zh.avif",
        "url_path": "/blog/house-upgrade-stardew-cover-zh.avif",
        "sha256": "7e00232440ac66f410e791a9f472f3fdb2b74242cc1a7d0a35e43e8e8d438926",
        "byte_size": 34529,
    },
    {
        "filename": "tier-rooms.zh.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.webp",
        "public": "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
        "exported": "out/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
        "url_path": "/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp",
        "sha256": "d9b978635943f7be87f4fb329fba424ceaa86d1991923ba54ac02e9f1af0be9c",
        "byte_size": 58666,
    },
    {
        "filename": "tier-rooms.zh.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/tier-rooms.zh.avif",
        "public": "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif",
        "exported": "out/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif",
        "url_path": "/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif",
        "sha256": "aabe93337712ce9de18a94faad5b3582cfeba8d62a7cd59b3a6962218e2c0aad",
        "byte_size": 31242,
    },
    {
        "filename": "upgrade-or-renovation.zh.webp",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.webp",
        "public": "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
        "exported": "out/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
        "url_path": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp",
        "sha256": "6bf515177a555a0edf63ad1ce6b121e78f2db7c66fd3e8f6cf733b4ac479fe88",
        "byte_size": 60854,
    },
    {
        "filename": "upgrade-or-renovation.zh.avif",
        "production": "docs/blog-ops/house-upgrade-stardew/media-production/zh/upgrade-or-renovation.zh.avif",
        "public": "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif",
        "exported": "out/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif",
        "url_path": "/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif",
        "sha256": "d8cde3529f897d5d5fe2b4b734e7182eb2eb000c19d3dc07dccd1ba5159f2b84",
        "byte_size": 32235,
    },
)


def emit(record):
    print(json.dumps(record, ensure_ascii=False, sort_keys=True), flush=True)


def absolute_path(relative_path):
    path = ARTICLE_ROOT / relative_path
    if not path.is_file():
        raise RuntimeError(f"required target missing path={path}")
    return path


def sha256_bytes(raw_bytes):
    return hashlib.sha256(raw_bytes).hexdigest()


def sha256_file(path):
    return sha256_bytes(path.read_bytes())


def require_sha256(relative_path, expected_sha256):
    path = absolute_path(relative_path)
    actual_sha256 = sha256_file(path)
    if actual_sha256 != expected_sha256:
        raise RuntimeError(
            f"sha256 mismatch path={path} expected={expected_sha256} actual={actual_sha256}"
        )
    return path


def cache_snapshot():
    if not V7_CACHE_DIR.is_dir():
        return ()
    snapshot = []
    for cache_path in sorted(V7_CACHE_DIR.iterdir()):
        cache_stat = cache_path.stat()
        snapshot.append((cache_path.name, cache_stat.st_mtime_ns, cache_stat.st_size))
    return tuple(snapshot)


def load_secret_needles():
    if not IDENTITY_PATH.is_file():
        raise RuntimeError(f"required identity file missing path={IDENTITY_PATH}")
    raw_bytes = IDENTITY_PATH.read_bytes()
    actual_sha256 = sha256_bytes(raw_bytes)
    if actual_sha256 != EXPECTED_IDENTITY_FILE_SHA256:
        raise RuntimeError(
            "identity file sha256 mismatch "
            f"path={IDENTITY_PATH} expected={EXPECTED_IDENTITY_FILE_SHA256} actual={actual_sha256}"
        )
    mode = IDENTITY_PATH.stat().st_mode & 0o777
    if mode != 0o600:
        raise RuntimeError(f"identity mode={oct(mode)} path={IDENTITY_PATH}")
    identity_record = json.loads(raw_bytes.decode("utf-8"))
    secret_token = identity_record.get("canarySecretToken")
    marker_id = identity_record.get("canaryId")
    if not isinstance(secret_token, str) or not isinstance(marker_id, str):
        raise RuntimeError(
            "identity canarySecretToken or canaryId is not a string "
            f"tokenType={type(secret_token).__name__} markerType={type(marker_id).__name__}"
        )
    marker_sha256 = sha256_bytes(secret_token.encode("utf-8"))
    if marker_sha256 != EXPECTED_MARKER_SHA256:
        raise RuntimeError(
            f"marker sha256 mismatch expected={EXPECTED_MARKER_SHA256} actual={marker_sha256}"
        )
    if len(secret_token) < 16 or len(marker_id) < 16:
        raise RuntimeError(
            f"needle too short tokenLen={len(secret_token)} markerLen={len(marker_id)}"
        )
    if secret_token in marker_id or marker_id in secret_token:
        raise RuntimeError("token and marker id overlap; exact counts would be ambiguous")
    return secret_token.encode("utf-8"), marker_id.encode("utf-8"), len(marker_id)


def count_needles(raw_bytes, secret_token, marker_id):
    return raw_bytes.count(secret_token), raw_bytes.count(marker_id)


def reject_exact_hits(path, layer, token_hits, marker_hits):
    if token_hits or marker_hits:
        raise RuntimeError(
            "exact hit "
            f"path={path} layer={layer} tokenHits={token_hits} markerIdHits={marker_hits}"
        )


def scan_bytes(relative_or_label, layer, field_count, raw_bytes, secret_token, marker_id, file_sha256):
    token_hits, marker_hits = count_needles(raw_bytes, secret_token, marker_id)
    emit(
        {
            "path": relative_or_label,
            "layer": layer,
            "fieldCount": field_count,
            "tokenHits": token_hits,
            "markerIdHits": marker_hits,
            "sha256": file_sha256,
            "byteSize": len(raw_bytes),
        }
    )
    reject_exact_hits(relative_or_label, layer, token_hits, marker_hits)


def collect_string_values(node, found):
    if isinstance(node, str):
        found.append(node)
        return
    if isinstance(node, dict):
        for key, value in node.items():
            if not isinstance(key, str):
                raise RuntimeError(f"json key is not a string type={type(key).__name__}")
            found.append(key)
            collect_string_values(value, found)
        return
    if isinstance(node, list):
        for item in node:
            collect_string_values(item, found)


def scan_json_file(relative_path, secret_token, marker_id):
    path = absolute_path(relative_path)
    raw_bytes = path.read_bytes()
    parsed = json.loads(raw_bytes.decode("utf-8"))
    string_values = []
    collect_string_values(parsed, string_values)
    encoded_fields = b"\n".join(value.encode("utf-8") for value in string_values)
    field_token_hits, field_marker_hits = count_needles(encoded_fields, secret_token, marker_id)
    raw_token_hits, raw_marker_hits = count_needles(raw_bytes, secret_token, marker_id)
    file_sha256 = sha256_bytes(raw_bytes)
    emit(
        {
            "path": relative_path,
            "layer": "json-string-fields",
            "fieldCount": len(string_values),
            "tokenHits": field_token_hits,
            "markerIdHits": field_marker_hits,
            "sha256": file_sha256,
        }
    )
    emit(
        {
            "path": relative_path,
            "layer": "json-raw",
            "fieldCount": 1,
            "tokenHits": raw_token_hits,
            "markerIdHits": raw_marker_hits,
            "sha256": file_sha256,
        }
    )
    reject_exact_hits(relative_path, "json-string-fields", field_token_hits, field_marker_hits)
    reject_exact_hits(relative_path, "json-raw", raw_token_hits, raw_marker_hits)
    return parsed, file_sha256


def scan_text_file(relative_path, secret_token, marker_id):
    path = absolute_path(relative_path)
    raw_bytes = path.read_bytes()
    text = raw_bytes.decode("utf-8")
    scan_bytes(relative_path, "text-raw", 1, raw_bytes, secret_token, marker_id, sha256_bytes(raw_bytes))
    return text


def public_fields_sha256(document):
    payload_without_integrity = {
        key: value for key, value in document.items() if key != "integrity"
    }
    canonical_json = json.dumps(
        payload_without_integrity,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    return sha256_bytes(canonical_json.encode("utf-8"))


def require_handoff_integrity(document, relative_path, expected_body_sha256, expected_public_sha256):
    body = document.get("body")
    if not isinstance(body, str):
        raise RuntimeError(f"handoff body is not a string path={relative_path}")
    actual_body_sha256 = sha256_bytes(body.encode("utf-8"))
    recorded_body_sha256 = document.get("bodyHash")
    if actual_body_sha256 != expected_body_sha256 or recorded_body_sha256 != expected_body_sha256:
        raise RuntimeError(
            "bodyHash mismatch "
            f"path={relative_path} expected={expected_body_sha256} "
            f"recorded={recorded_body_sha256} recomputed={actual_body_sha256}"
        )
    recomputed_public_sha256 = public_fields_sha256(document)
    recorded_public_sha256 = document.get("integrity", {}).get("publicFieldsSha256")
    if (
        recomputed_public_sha256 != expected_public_sha256
        or recorded_public_sha256 != expected_public_sha256
    ):
        raise RuntimeError(
            "publicFieldsSha256 mismatch "
            f"path={relative_path} expected={expected_public_sha256} "
            f"recorded={recorded_public_sha256} recomputed={recomputed_public_sha256}"
        )
    emit(
        {
            "path": relative_path,
            "layer": "handoff-integrity",
            "bodyHash": actual_body_sha256,
            "publicFieldsSha256": recomputed_public_sha256,
            "englishBodyHash": document.get("englishBodyHash"),
            "integrityEnglishBodyHash": document.get("integrity", {}).get("englishBodyHash"),
        }
    )


def import_length_counter():
    before_snapshot = cache_snapshot()
    sys.path.insert(0, str(V7_SCRIPT_DIR))
    import 正文计数 as length_counter

    after_snapshot = cache_snapshot()
    if before_snapshot != after_snapshot:
        raise RuntimeError(
            "V7 pycache changed "
            f"before={before_snapshot} after={after_snapshot}"
        )
    emit(
        {
            "layer": "v7-counter-import",
            "module": "正文计数",
            "pycacheUnchanged": True,
            "pycacheEntries": len(after_snapshot),
            "PYTHONDONTWRITEBYTECODE": os.environ.get("PYTHONDONTWRITEBYTECODE"),
        }
    )
    return length_counter


def require_length(length_counter):
    english_body = (OPS_ROOT / "lock/en/body.md").read_text(encoding="utf-8")
    english_count_input = (OPS_ROOT / "lock/en/count-input.md").read_text(encoding="utf-8")
    chinese_body = (OPS_ROOT / "content/zh/draft-zh-v2.md").read_text(encoding="utf-8")
    english_units = length_counter.count_units(
        length_counter.extract_body(english_body)[0], "en"
    )
    qualified_units = length_counter.count_units(
        length_counter.extract_body(english_count_input)[0], "en"
    )
    chinese_extracted = length_counter.extract_body(chinese_body)[0]
    chinese_mechanical = length_counter.count_units(chinese_extracted, "zh-CN")
    chinese_whole = sum(length_counter.is_han(char) for char in chinese_body)
    media_text = json.loads(
        (OPS_ROOT / "content/zh/media-text.zh.json").read_text(encoding="utf-8")
    )
    caption_han_values = []
    for figure in media_text["figures"]:
        caption = figure.get("caption")
        if not isinstance(caption, str):
            raise RuntimeError(
                f"chinese caption is not a string mediaId={figure.get('mediaId')}"
            )
        if caption and caption in chinese_extracted:
            caption_han_values.append(sum(length_counter.is_han(char) for char in caption))
    caption_han = sum(caption_han_values)
    pure_han = chinese_mechanical - caption_han
    if english_units != 1138 or qualified_units != 1085:
        raise RuntimeError(
            "english length mismatch "
            f"lockedMechanical={english_units} qualifiedCountInput={qualified_units}"
        )
    if (
        chinese_mechanical != 1737
        or chinese_whole != 1905
        or caption_han != 90
        or pure_han != 1647
        or caption_han_values != [42, 48]
    ):
        raise RuntimeError(
            "chinese length mismatch "
            f"mechanical={chinese_mechanical} whole={chinese_whole} "
            f"captionHan={caption_han_values} pure={pure_han}"
        )
    removed_lines = [
        line for line in english_body.splitlines() if line not in english_count_input.splitlines()
    ]
    if len(removed_lines) != 2:
        raise RuntimeError(
            f"english count-input removed line count={len(removed_lines)} expected=2"
        )
    emit(
        {
            "layer": "length",
            "englishLockedMechanical": english_units,
            "englishQualified": qualified_units,
            "chineseMechanical": chinese_mechanical,
            "chineseWholeHan": chinese_whole,
            "chineseCaptionHan": caption_han_values,
            "chinesePureHan": pure_han,
            "englishRemovedCaptionLines": len(removed_lines),
        }
    )


def visible_svg_texts(path):
    root = ElementTree.parse(path).getroot()
    visible_texts = []
    for element in root.iter():
        if str(element.tag).endswith("text"):
            visible_texts.append("".join(element.itertext()).strip())
    return visible_texts


def require_svg_matches_media(locale):
    media_path = OPS_ROOT / "content" / locale / (
        "media-text.en.json" if locale == "en" else "media-text.zh.json"
    )
    provenance_path = OPS_ROOT / "media-production" / locale / "provenance.json"
    media_text = json.loads(media_path.read_text(encoding="utf-8"))
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if len(media_text["figures"]) != 3 or len(provenance["figures"]) != 3:
        raise RuntimeError(
            f"svg figure count locale={locale} media={len(media_text['figures'])} "
            f"provenance={len(provenance['figures'])}"
        )
    compared = []
    for media_figure, provenance_figure in zip(media_text["figures"], provenance["figures"]):
        source = provenance_figure.get("sourceSvg", provenance_figure.get("svg"))
        if isinstance(source, dict):
            relative_source = source.get("relativePath") or source.get("path")
            expected_svg_sha256 = source.get("sha256")
            if not relative_source:
                filename = source.get("filename")
                if not isinstance(filename, str) or filename == "":
                    raise RuntimeError(
                        f"svg filename missing locale={locale} keys={sorted(source)}"
                    )
                relative_source = (
                    "docs/blog-ops/house-upgrade-stardew/media-production/"
                    f"{locale}/{filename}"
                )
        elif isinstance(source, str):
            relative_source = source
            expected_svg_sha256 = None
        else:
            raise RuntimeError(
                f"svg source missing locale={locale} mediaId={media_figure.get('mediaId')}"
            )
        if relative_source.startswith("/"):
            svg_path = Path(relative_source)
            relative_label = str(svg_path)
        else:
            svg_path = ARTICLE_ROOT / relative_source
            relative_label = relative_source
        if not svg_path.is_file():
            raise RuntimeError(f"required svg missing path={svg_path}")
        actual_svg_sha256 = sha256_file(svg_path)
        if expected_svg_sha256 is not None and actual_svg_sha256 != expected_svg_sha256:
            raise RuntimeError(
                "svg sha256 mismatch "
                f"path={svg_path} expected={expected_svg_sha256} actual={actual_svg_sha256}"
            )
        visible_texts = visible_svg_texts(svg_path)
        in_image_text = media_figure.get("inImageText")
        if visible_texts != in_image_text:
            raise RuntimeError(
                "svg visible text mismatch "
                f"path={svg_path} visibleCount={len(visible_texts)} "
                f"inImageCount={len(in_image_text) if isinstance(in_image_text, list) else 'not-list'}"
            )
        compared.append(
            {
                "path": relative_label,
                "visibleCount": len(visible_texts),
                "sha256": actual_svg_sha256,
            }
        )
    return compared


def scan_svg_files(secret_token, marker_id):
    for locale in ("en", "zh"):
        compared = require_svg_matches_media(locale)
        for item in compared:
            path = Path(item["path"])
            if not path.is_absolute():
                path = ARTICLE_ROOT / item["path"]
            raw_bytes = path.read_bytes()
            visible_texts = visible_svg_texts(path)
            visible_blob = "\n".join(visible_texts).encode("utf-8")
            visible_token_hits, visible_marker_hits = count_needles(
                visible_blob, secret_token, marker_id
            )
            raw_token_hits, raw_marker_hits = count_needles(raw_bytes, secret_token, marker_id)
            emit(
                {
                    "path": item["path"],
                    "layer": "svg-visible-text",
                    "fieldCount": len(visible_texts),
                    "tokenHits": visible_token_hits,
                    "markerIdHits": visible_marker_hits,
                    "sha256": item["sha256"],
                }
            )
            emit(
                {
                    "path": item["path"],
                    "layer": "svg-raw",
                    "fieldCount": 1,
                    "tokenHits": raw_token_hits,
                    "markerIdHits": raw_marker_hits,
                    "sha256": item["sha256"],
                }
            )
            reject_exact_hits(item["path"], "svg-visible-text", visible_token_hits, visible_marker_hits)
            reject_exact_hits(item["path"], "svg-raw", raw_token_hits, raw_marker_hits)


def walk_raster_records(node, found):
    if isinstance(node, dict):
        sha256 = node.get("sha256")
        width = node.get("width")
        height = node.get("height")
        name = node.get("filename") or node.get("path") or ""
        if isinstance(sha256, str) and isinstance(width, int) and isinstance(height, int):
            found.append(node)
        for value in node.values():
            walk_raster_records(value, found)
        return
    if isinstance(node, list):
        for item in node:
            walk_raster_records(item, found)


def provenance_raster_by_filename():
    found = []
    for locale in ("en", "zh"):
        provenance = json.loads(
            (OPS_ROOT / "media-production" / locale / "provenance.json").read_text(encoding="utf-8")
        )
        walk_raster_records(provenance, found)
    return found


def webp_chunk_ids(raw_bytes, path):
    if len(raw_bytes) < 12 or raw_bytes[:4] != b"RIFF" or raw_bytes[8:12] != b"WEBP":
        raise RuntimeError(f"webp container mismatch path={path}")
    declared_size = int.from_bytes(raw_bytes[4:8], "little")
    if declared_size + 8 != len(raw_bytes):
        raise RuntimeError(
            f"webp riff size mismatch path={path} declared={declared_size} file={len(raw_bytes)}"
        )
    chunk_ids = []
    offset = 12
    while offset + 8 <= len(raw_bytes):
        chunk_id = raw_bytes[offset : offset + 4]
        chunk_size = int.from_bytes(raw_bytes[offset + 4 : offset + 8], "little")
        chunk_ids.append(chunk_id)
        offset += 8 + chunk_size + (chunk_size % 2)
    if offset != len(raw_bytes):
        raise RuntimeError(
            f"webp chunk walk stopped path={path} offset={offset} file={len(raw_bytes)} chunkIds={chunk_ids!r}"
        )
    return chunk_ids


def sips_dimensions(path):
    completed = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", "-g", "format", str(path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"sips exit={completed.returncode} path={path} stderr={completed.stderr.strip()}"
        )
    parsed = {}
    for line in completed.stdout.splitlines():
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        parsed[key.strip()] = value.strip()
    if "pixelWidth" not in parsed or "pixelHeight" not in parsed:
        raise RuntimeError(f"sips missing dimensions path={path} stdout={completed.stdout!r}")
    return int(parsed["pixelWidth"]), int(parsed["pixelHeight"]), parsed.get("format", "")


def pillow_metadata(path):
    from PIL import Image

    with Image.open(path) as image:
        if not image.format or image.size[0] <= 0 or image.size[1] <= 0:
            raise RuntimeError(
                f"pillow metadata incomplete path={path} format={image.format!r} size={image.size!r}"
            )
        info_strings = [
            f"format={image.format}",
            f"mode={image.mode}",
            f"width={image.size[0]}",
            f"height={image.size[1]}",
        ]
        info_blobs = []
        for key, value in image.info.items():
            if isinstance(value, bytes):
                info_blobs.append(value)
            else:
                info_strings.append(f"{key}={value!r}")
        return {
            "format": image.format,
            "mode": image.mode,
            "width": image.size[0],
            "height": image.size[1],
            "infoStrings": info_strings,
            "infoBlobs": info_blobs,
            "infoKeyCount": len(image.info),
        }


def scan_one_raster(asset, provenance_records, secret_token, marker_id):
    production_path = require_sha256(asset["production"], asset["sha256"])
    public_path = require_sha256(asset["public"], asset["sha256"])
    exported_path = require_sha256(asset["exported"], asset["sha256"])
    raw_bytes = production_path.read_bytes()
    if len(raw_bytes) != asset["byte_size"]:
        raise RuntimeError(
            f"byte size mismatch path={production_path} expected={asset['byte_size']} actual={len(raw_bytes)}"
        )
    if public_path.read_bytes() != raw_bytes or exported_path.read_bytes() != raw_bytes:
        raise RuntimeError(f"production/public/out bytes differ filename={asset['filename']}")
    sips_width, sips_height, sips_format = sips_dimensions(production_path)
    if (sips_width, sips_height) != (1672, 941):
        raise RuntimeError(
            f"sips size mismatch path={production_path} width={sips_width} height={sips_height}"
        )
    pillow_record = pillow_metadata(production_path)
    if (pillow_record["width"], pillow_record["height"]) != (1672, 941):
        raise RuntimeError(
            "pillow size mismatch "
            f"path={production_path} width={pillow_record['width']} height={pillow_record['height']}"
        )
    metadata_blob = "\n".join(pillow_record["infoStrings"]).encode("utf-8")
    for info_blob in pillow_record["infoBlobs"]:
        metadata_blob += b"\n" + info_blob
    metadata_token_hits, metadata_marker_hits = count_needles(
        metadata_blob, secret_token, marker_id
    )
    if asset["filename"].endswith(".webp"):
        chunk_ids = webp_chunk_ids(raw_bytes, production_path)
        if chunk_ids.count(b"VP8 ") < 1 or b"VP8L" in chunk_ids:
            raise RuntimeError(
                "webp codec mismatch "
                f"path={production_path} chunkIds={chunk_ids!r}"
            )
    matched_provenance = [
        record
        for record in provenance_records
        if str(record.get("filename") or record.get("path") or "").endswith(asset["filename"])
        and record.get("sha256") == asset["sha256"]
        and record.get("width") == 1672
        and record.get("height") == 941
    ]
    if len(matched_provenance) != 1:
        raise RuntimeError(
            "provenance raster match count "
            f"filename={asset['filename']} count={len(matched_provenance)}"
        )
    scan_bytes(
        asset["production"],
        "raster-bytes",
        1,
        raw_bytes,
        secret_token,
        marker_id,
        asset["sha256"],
    )
    emit(
        {
            "path": asset["production"],
            "layer": "raster-metadata",
            "fieldCount": len(pillow_record["infoStrings"]) + len(pillow_record["infoBlobs"]),
            "tokenHits": metadata_token_hits,
            "markerIdHits": metadata_marker_hits,
            "sha256": asset["sha256"],
            "sips": f"{sips_width}x{sips_height}:{sips_format}",
            "pillowFormat": pillow_record["format"],
            "pillowMode": pillow_record["mode"],
            "infoKeyCount": pillow_record["infoKeyCount"],
            "publicCopy": asset["public"],
            "exportedCopy": asset["exported"],
        }
    )
    reject_exact_hits(asset["production"], "raster-metadata", metadata_token_hits, metadata_marker_hits)


def require_provenance_body_rebind():
    english_provenance = (
        OPS_ROOT / "media-production/en/provenance.json"
    ).read_text(encoding="utf-8")
    chinese_provenance = json.loads(
        (OPS_ROOT / "media-production/zh/provenance.json").read_text(encoding="utf-8")
    )
    if PRIOR_ENGLISH_PROVENANCE_BODY_SHA256 not in english_provenance:
        raise RuntimeError("english provenance is missing the prior body sha256")
    if LOCKED_ENGLISH_BODY_SHA256 in english_provenance:
        raise RuntimeError("english provenance names the locked body; freeze said it does not")
    translated_body_sha256 = chinese_provenance.get("translatedBodySha256")
    if translated_body_sha256 != PRIOR_CHINESE_PROVENANCE_BODY_SHA256:
        raise RuntimeError(
            "chinese provenance translatedBodySha256 "
            f"expected={PRIOR_CHINESE_PROVENANCE_BODY_SHA256} actual={translated_body_sha256}"
        )
    if chinese_provenance.get("englishBodySha256") != LOCKED_ENGLISH_BODY_SHA256:
        raise RuntimeError(
            "chinese provenance englishBodySha256 "
            f"actual={chinese_provenance.get('englishBodySha256')}"
        )
    emit(
        {
            "layer": "provenance-body-rebind",
            "englishProvenanceStillNamesPriorBody": True,
            "englishProvenanceNamesLockedBody": False,
            "chineseProvenanceTranslatedBody": "prior-v1",
            "chineseProvenanceEnglishBody": "locked-v4",
        }
    )


def quoted_strings(source_text):
    return re.findall(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'|`(?:\\.|[^`\\])*`', source_text)


def registry_slug_objects(source_text):
    slices = []
    cursor = 0
    marker = 'slug: "house-upgrade-stardew"'
    while True:
        index = source_text.find(marker, cursor)
        if index < 0:
            break
        brace_index = source_text.rfind("{", 0, index)
        if brace_index < 0:
            raise RuntimeError(f"registry object brace missing index={index}")
        depth = 0
        end_index = None
        for position in range(brace_index, len(source_text)):
            character = source_text[position]
            if character == "{":
                depth += 1
            elif character == "}":
                depth -= 1
                if depth == 0:
                    end_index = position + 1
                    break
        if end_index is None:
            raise RuntimeError(f"registry object did not close index={brace_index}")
        slices.append(source_text[brace_index:end_index])
        cursor = end_index
    if len(slices) != 2:
        raise RuntimeError(f"registry house-upgrade object count={len(slices)}")
    return slices


def scan_registration(secret_token, marker_id):
    registry_text = (ARTICLE_ROOT / "src/blog/blog-post-registry.tsx").read_text(encoding="utf-8")
    slices = registry_slug_objects(registry_text)
    for index, slice_text in enumerate(slices):
        scan_bytes(
            f"src/blog/blog-post-registry.tsx#house-upgrade-object-{index}",
            "registry-object",
            len(quoted_strings(slice_text)),
            slice_text.encode("utf-8"),
            secret_token,
            marker_id,
            sha256_bytes(slice_text.encode("utf-8")),
        )
    registration_files = (
        "src/blog/blog-post-registry.tsx",
        "src/blog/blog-post-identities.ts",
        "src/blog/blog-copy.ts",
        "public/llms.txt",
    )
    for relative_path in registration_files:
        path = absolute_path(relative_path)
        raw_bytes = path.read_bytes()
        source_text = raw_bytes.decode("utf-8")
        scan_bytes(
            relative_path,
            "registration-file-raw",
            len(quoted_strings(source_text)) if relative_path.endswith((".ts", ".tsx")) else 1,
            raw_bytes,
            secret_token,
            marker_id,
            sha256_bytes(raw_bytes),
        )
    identity_line_count = registry_text.count('"house-upgrade-stardew"')
    copy_text = (ARTICLE_ROOT / "src/blog/blog-copy.ts").read_text(encoding="utf-8")
    if identity_line_count < 2 or copy_text.count('"house-upgrade-stardew"') != 2:
        raise RuntimeError(
            "registration slug occurrence mismatch "
            f"registry={identity_line_count} copy={copy_text.count(chr(34) + 'house-upgrade-stardew' + chr(34))}"
        )


def scan_article_modules(secret_token, marker_id):
    for relative_path, expected_bytes in (
        ("src/blog/articles/house-upgrade-stardew.en.tsx", None),
        ("src/blog/articles/house-upgrade-stardew.zh.tsx", 14218),
    ):
        path = require_sha256(relative_path, EXPECTED_FILE_SHA256[relative_path])
        raw_bytes = path.read_bytes()
        if expected_bytes is not None and len(raw_bytes) != expected_bytes:
            raise RuntimeError(
                f"module byte size mismatch path={path} expected={expected_bytes} actual={len(raw_bytes)}"
            )
        source_text = raw_bytes.decode("utf-8")
        scan_bytes(
            relative_path,
            "tsx-raw",
            len(quoted_strings(source_text)),
            raw_bytes,
            secret_token,
            marker_id,
            EXPECTED_FILE_SHA256[relative_path],
        )


def rsc_relative_paths():
    discovered = []
    for relative_dir in (
        "out/house-upgrade-stardew",
        "out/zh/house-upgrade-stardew",
    ):
        directory = ARTICLE_ROOT / relative_dir
        if not directory.is_dir():
            raise RuntimeError(f"required rsc directory missing path={directory}")
        files = sorted(path for path in directory.iterdir() if path.is_file())
        if not files:
            raise RuntimeError(f"rsc directory has no files path={directory}")
        discovered.extend(str(path.relative_to(ARTICLE_ROOT)) for path in files)
    for relative_path in (
        "out/house-upgrade-stardew.txt",
        "out/zh/house-upgrade-stardew.txt",
    ):
        if not (ARTICLE_ROOT / relative_path).is_file():
            raise RuntimeError(f"required rsc payload missing path={ARTICLE_ROOT / relative_path}")
        discovered.append(relative_path)
    return discovered


def scan_html_and_rsc(secret_token, marker_id):
    for relative_path in (
        "out/house-upgrade-stardew.html",
        "out/zh/house-upgrade-stardew.html",
    ):
        path = require_sha256(relative_path, EXPECTED_FILE_SHA256[relative_path])
        raw_bytes = path.read_bytes()
        scan_bytes(
            relative_path,
            "html-raw",
            1,
            raw_bytes,
            secret_token,
            marker_id,
            EXPECTED_FILE_SHA256[relative_path],
        )
    for relative_path in rsc_relative_paths():
        path = absolute_path(relative_path)
        raw_bytes = path.read_bytes()
        scan_bytes(
            relative_path,
            "rsc-raw",
            1,
            raw_bytes,
            secret_token,
            marker_id,
            sha256_bytes(raw_bytes),
        )


class LocalPreviewRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, response, code, message, headers, new_url):
        hostname = urlparse(new_url).hostname
        if hostname != "127.0.0.1":
            raise RuntimeError(f"refusing preview redirect host={hostname} url={new_url}")
        return super().redirect_request(request, response, code, message, headers, new_url)


def require_preview_listener():
    completed = subprocess.run(
        ["lsof", "-nP", "-iTCP:3010", "-sTCP:LISTEN"],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"lsof 3010 exit={completed.returncode} stderr={completed.stderr.strip()}"
        )
    listen_lines = [line for line in completed.stdout.splitlines() if "LISTEN" in line]
    matched = [
        line
        for line in listen_lines
        if EXPECTED_PREVIEW_PID in line and "127.0.0.1:3010" in line
    ]
    if len(matched) != 1:
        raise RuntimeError(f"preview listener mismatch lines={listen_lines}")
    emit({"layer": "preview-listener", "pid": EXPECTED_PREVIEW_PID, "listen": "127.0.0.1:3010"})


def fetch_local(url_path):
    url = PREVIEW_ORIGIN + url_path
    opener = urllib.request.build_opener(LocalPreviewRedirect)
    request = urllib.request.Request(url, headers={"Accept-Encoding": "identity"})
    try:
        with opener.open(request, timeout=30) as response:
            final_url = response.geturl()
            status = response.status
            header_blob = "\n".join(
                f"{key}: {value}" for key, value in response.headers.items()
            ).encode("utf-8")
            response_body = response.read()
    except urllib.error.HTTPError as error:
        raise RuntimeError(f"local http status={error.code} url={url}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"local http url error url={url} reason={error.reason}") from error
    except (TimeoutError, socket.timeout) as error:
        raise RuntimeError(f"local http timeout url={url} error={error}") from error
    hostname = urlparse(final_url).hostname
    if hostname != "127.0.0.1":
        raise RuntimeError(f"local http final host={hostname} url={final_url}")
    if status != 200:
        raise RuntimeError(f"local http status={status} url={final_url}")
    return final_url, status, header_blob, response_body


def scan_http(secret_token, marker_id):
    require_preview_listener()
    page_targets = (
        ("/house-upgrade-stardew", "out/house-upgrade-stardew.html"),
        ("/zh/house-upgrade-stardew", "out/zh/house-upgrade-stardew.html"),
    )
    for url_path, relative_html in page_targets:
        final_url, status, header_blob, response_body = fetch_local(url_path)
        expected_body = absolute_path(relative_html).read_bytes()
        if response_body != expected_body:
            raise RuntimeError(
                "http page bytes differ "
                f"url={final_url} status={status} "
                f"responseSha256={sha256_bytes(response_body)} file={relative_html}"
            )
        scan_bytes(
            final_url,
            "http-body",
            1,
            response_body,
            secret_token,
            marker_id,
            sha256_bytes(response_body),
        )
        header_token_hits, header_marker_hits = count_needles(header_blob, secret_token, marker_id)
        emit(
            {
                "path": final_url,
                "layer": "http-headers",
                "fieldCount": header_blob.count(b"\n") + 1,
                "tokenHits": header_token_hits,
                "markerIdHits": header_marker_hits,
                "status": status,
            }
        )
        reject_exact_hits(final_url, "http-headers", header_token_hits, header_marker_hits)
    for asset in RASTER_ASSETS:
        final_url, status, header_blob, response_body = fetch_local(asset["url_path"])
        if sha256_bytes(response_body) != asset["sha256"] or len(response_body) != asset["byte_size"]:
            raise RuntimeError(
                "http asset mismatch "
                f"url={final_url} status={status} sha256={sha256_bytes(response_body)} "
                f"byteSize={len(response_body)} expected={asset['sha256']}"
            )
        scan_bytes(
            final_url,
            "http-asset",
            1,
            response_body,
            secret_token,
            marker_id,
            asset["sha256"],
        )
        header_token_hits, header_marker_hits = count_needles(header_blob, secret_token, marker_id)
        reject_exact_hits(final_url, "http-asset-headers", header_token_hits, header_marker_hits)


def require_known_files():
    for relative_path, expected_sha256 in EXPECTED_FILE_SHA256.items():
        require_sha256(relative_path, expected_sha256)
    emit({"layer": "expected-file-sha256", "fileCount": len(EXPECTED_FILE_SHA256), "mismatches": 0})


def require_manifest_article_hashes_null():
    manifest = json.loads(
        absolute_path(
            "docs/blog-ops/house-upgrade-stardew/assembly/AssemblyManifest.json"
        ).read_text(encoding="utf-8")
    )
    articles = manifest.get("articles")
    if not isinstance(articles, dict):
        raise RuntimeError(f"manifest articles type={type(articles).__name__}")
    for locale in ("en", "zh-CN"):
        output_sha256 = articles.get(locale, {}).get("outputSha256")
        if output_sha256 is not None:
            raise RuntimeError(
                f"manifest outputSha256 locale={locale} actual={output_sha256}"
            )
    emit({"layer": "manifest-output-sha256", "en": None, "zh-CN": None})


def require_bilingual_body_binding(english_handoff, chinese_handoff):
    recorded_english_cross_hash = chinese_handoff.get("englishBodyHash")
    integrity_cross_hash = chinese_handoff.get("integrity", {}).get("englishBodyHash")
    if (
        recorded_english_cross_hash != LOCKED_ENGLISH_BODY_SHA256
        or integrity_cross_hash != LOCKED_ENGLISH_BODY_SHA256
    ):
        raise RuntimeError(
            "chinese englishBodyHash mismatch "
            f"top={recorded_english_cross_hash} integrity={integrity_cross_hash}"
        )
    english_body_bytes = english_handoff["body"].encode("utf-8")
    locked_body_bytes = absolute_path(
        "docs/blog-ops/house-upgrade-stardew/lock/en/body.md"
    ).read_bytes()
    if english_body_bytes != locked_body_bytes:
        raise RuntimeError("english handoff body bytes differ from lock/en/body.md")
    chinese_body_bytes = chinese_handoff["body"].encode("utf-8")
    translated_body_bytes = absolute_path(
        "docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md"
    ).read_bytes()
    if chinese_body_bytes != translated_body_bytes:
        raise RuntimeError("chinese handoff body bytes differ from draft-zh-v2.md")
    emit(
        {
            "layer": "bilingual-body-binding",
            "englishBodyHash": recorded_english_cross_hash,
            "englishHandoffMatchesLock": True,
            "chineseHandoffMatchesDraft": True,
        }
    )


def main():
    if os.geteuid() != 501:
        raise RuntimeError(f"uid={os.geteuid()} expected=501")
    secret_token, marker_id, marker_length = load_secret_needles()
    emit(
        {
            "layer": "identity",
            "fileSha256": EXPECTED_IDENTITY_FILE_SHA256,
            "markerSha256": EXPECTED_MARKER_SHA256,
            "markerLen": marker_length,
            "tokenPrinted": False,
            "markerIdPrinted": False,
            "mode": "0600",
            "uid": 501,
            "isolation": "logical-only",
        }
    )
    length_counter = import_length_counter()
    require_known_files()
    require_length(length_counter)
    english_handoff, _english_sha = scan_json_file(
        "docs/blog-ops/house-upgrade-stardew/handoff/public/en.json",
        secret_token,
        marker_id,
    )
    chinese_handoff, _chinese_sha = scan_json_file(
        "docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json",
        secret_token,
        marker_id,
    )
    require_handoff_integrity(
        english_handoff,
        "docs/blog-ops/house-upgrade-stardew/handoff/public/en.json",
        LOCKED_ENGLISH_BODY_SHA256,
        ENGLISH_PUBLIC_FIELDS_SHA256,
    )
    require_handoff_integrity(
        chinese_handoff,
        "docs/blog-ops/house-upgrade-stardew/handoff/public/zh-CN.json",
        LOCKED_CHINESE_BODY_SHA256,
        CHINESE_PUBLIC_FIELDS_SHA256,
    )
    require_bilingual_body_binding(english_handoff, chinese_handoff)
    for relative_path in (
        "docs/blog-ops/house-upgrade-stardew/lock/en/body.md",
        "docs/blog-ops/house-upgrade-stardew/content/zh/draft-zh-v2.md",
        "docs/blog-ops/house-upgrade-stardew/seo/en/seo-candidate.json",
        "docs/blog-ops/house-upgrade-stardew/content/zh/seo.zh.json",
        "docs/blog-ops/house-upgrade-stardew/content/en/public-references.en.json",
        "docs/blog-ops/house-upgrade-stardew/content/zh/public-references.zh.json",
        "docs/blog-ops/house-upgrade-stardew/content/en/media-text.en.json",
        "docs/blog-ops/house-upgrade-stardew/content/zh/media-text.zh.json",
    ):
        if relative_path.endswith(".json"):
            scan_json_file(relative_path, secret_token, marker_id)
        else:
            scan_text_file(relative_path, secret_token, marker_id)
    scan_svg_files(secret_token, marker_id)
    provenance_records = provenance_raster_by_filename()
    require_provenance_body_rebind()
    if len(RASTER_ASSETS) != 12:
        raise RuntimeError(f"raster asset count={len(RASTER_ASSETS)}")
    for asset in RASTER_ASSETS:
        scan_one_raster(asset, provenance_records, secret_token, marker_id)
    scan_article_modules(secret_token, marker_id)
    scan_registration(secret_token, marker_id)
    require_manifest_article_hashes_null()
    scan_html_and_rsc(secret_token, marker_id)
    scan_http(secret_token, marker_id)
    emit(
        {
            "layer": "summary",
            "exactHitCounter": 0,
            "limit": "exact byte absence only; not semantic review, not pixel OCR, not OS isolation",
        }
    )


if __name__ == "__main__":
    main()
