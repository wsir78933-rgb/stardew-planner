#!/usr/bin/env python3
"""Check the two baseline article archives now live at .tsx.txt.

The main function only dispatches. It does not run apply_pixel_v2.py main(),
and it does not rewrite baseline/manifest.json or baseline/checksums.sha256.
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True

REPO_ROOT = Path("/Users/wusir/orca/workspaces/stardew planner/博客-2")
PIXEL_ROOT = REPO_ROOT / "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2"
MANIFEST_PATH = PIXEL_ROOT / "baseline/manifest.json"
CHECKSUMS_PATH = PIXEL_ROOT / "baseline/checksums.sha256"
LOCATION_MAP_PATH = PIXEL_ROOT / "archive-fix/archive-location-map.json"
APPLY_SCRIPT_PATH = PIXEL_ROOT / "integration/apply_pixel_v2.py"
EVIDENCE_LOG_PATH = PIXEL_ROOT / "reviews/integration/checks.log"
TSCONFIG_PATH = REPO_ROOT / "tsconfig.json"
REPORT_PATH = PIXEL_ROOT / "archive-fix/report.md"
CHECKS_LOG_PATH = PIXEL_ROOT / "archive-fix/checks.log"
CHECKS_JSON_PATH = PIXEL_ROOT / "archive-fix/checks.json"
HISTORY_ROOT = PIXEL_ROOT / "archive-fix/history"
MANIFEST_SHA256 = "b00c8d80843cfdc766cb08e490f50d0edb121e88c5725673bfa6dacb4290f1af"
CHECKSUMS_SHA256 = "47bdbca2844a7be476f470d748303f31ff4be1c3eca5f0cc51d10351bf8d28d0"
ARTICLE_SPECS = (
    {
        "sourceRelativePath": "src/blog/articles/house-upgrade-stardew.en.tsx",
        "oldArchivePath": "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx",
        "newArchivePath": "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.en.tsx.txt",
        "sha256": "cefa2bb7b1be00cd8a6d61a5b26765aae4f025e4798a949bb88d66f7c89768f5",
        "byteSize": 15846,
    },
    {
        "sourceRelativePath": "src/blog/articles/house-upgrade-stardew.zh.tsx",
        "oldArchivePath": "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx",
        "newArchivePath": "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/src/blog/articles/house-upgrade-stardew.zh.tsx.txt",
        "sha256": "2339f972ae0e3825b19ce0b05822c05e3c69e5a9e39de803dd1998d7861947ba",
        "byteSize": 14218,
    },
)
ACCEPTANCE_FILES = (
    ("product", "public/blog/house-upgrade-stardew-cover.webp", "d58aaaf3bbe7b02e04fb0a366b3e0b8c61b257abc993eea6ff02a358782f57c8"),
    ("product", "public/blog/house-upgrade-stardew-cover-zh.webp", "d58aaaf3bbe7b02e04fb0a366b3e0b8c61b257abc993eea6ff02a358782f57c8"),
    ("product", "public/blog/house-upgrade-stardew-cover.avif", "8c0da21da4d59de4d3f4d1bbadc6e38cefe3880ba47d67aaacf8f5ff892662d0"),
    ("product", "public/blog/house-upgrade-stardew-cover-zh.avif", "8c0da21da4d59de4d3f4d1bbadc6e38cefe3880ba47d67aaacf8f5ff892662d0"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.webp", "9f806c5cb39ac3bd298415ff3ac80fb056446dcff9fb1a839d9c4afb29946671"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.webp", "9f806c5cb39ac3bd298415ff3ac80fb056446dcff9fb1a839d9c4afb29946671"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/tier-rooms.en.avif", "e2578074f100a6e185d73d5034f6fe2d79861df3787aac3777137a5854571221"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/tier-rooms.zh.avif", "e2578074f100a6e185d73d5034f6fe2d79861df3787aac3777137a5854571221"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.webp", "526a5afa8836bba315ffa3b15b64d0483726ee3c07d3284222e47ed935c93bfb"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.webp", "526a5afa8836bba315ffa3b15b64d0483726ee3c07d3284222e47ed935c93bfb"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.en.avif", "c5c957be221fa5b140cef500771c1eeb51ae2b143fa645662a5644c43d05cf27"),
    ("product", "public/blog/illustrations/house-upgrade-stardew/upgrade-or-renovation.zh.avif", "c5c957be221fa5b140cef500771c1eeb51ae2b143fa645662a5644c43d05cf27"),
    ("product", "src/blog/articles/house-upgrade-stardew.en.tsx", "e215ceb1871294757241bdd44a52a7a48667b5e0bb01018d9aafe8d348844acd"),
    ("product", "src/blog/articles/house-upgrade-stardew.zh.tsx", "3d601b6e0c4b5eada92fde9cd4875db44c31ef0a5eae857cdaac6b4deff13850"),
    ("product", "src/blog/blog-post-registry.tsx", "5e7687939e0878dcd6e6c74dad4c1cad9beee76bac0078427713932274ab0aa5"),
    ("handoff", "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/en.json", "e4fa6f1fa65adfbeead8df17eb1902c2d08ff7daa76abb1279dfe1d697c36fd4"),
    ("handoff", "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/handoff/zh-CN.json", "376c9cffa556f8451b0a999495874950c7efb94c6a42fac3674e2bfa732869e0"),
    ("new-manifest", "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/AssemblyManifest.json", "07fa31ccca98a8ea421075797861724315583138490d4f99870cc5be95ad22fd"),
    ("body", "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/body/en.md", "151c81afa41a5411345c0f33866f08c6819da2c30afdcde610d6135e56774fa8"),
    ("body", "docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/integration/v1/body/zh-CN.md", "00a612b48022fa7256f89b7fc5eb0386b34d17b6f272f079da9f62eb40998bc4"),
)


def fail(message: str) -> None:
    raise SystemExit(message)


def sha256_file(path: Path) -> str:
    if not path.is_file():
        fail(f"missing path={path}")
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require_sha256(path: Path, expected: str, label: str) -> None:
    actual = sha256_file(path)
    if actual != expected:
        fail(f"sha256 mismatch {label} actual={actual} expected={expected} path={path}")


def active_typescript_files() -> list[str]:
    found = []
    for path in PIXEL_ROOT.rglob("*"):
        if path.is_file() and path.suffix in {".ts", ".tsx"}:
            found.append(path.relative_to(PIXEL_ROOT).as_posix())
    return sorted(found)


def exit_code_after(log_text: str, marker: str) -> int:
    index = log_text.find(marker)
    if index < 0:
        fail(f"missing log marker={marker!r} path={EVIDENCE_LOG_PATH}")
    window = log_text[index:index + 600]
    line = next((item for item in window.splitlines() if item.startswith("exit_code: ")), "")
    if line == "":
        fail(f"missing exit_code after marker={marker!r}")
    value = line.removeprefix("exit_code: ").strip()
    if not value.isdigit():
        fail(f"exit_code={value!r} marker={marker!r}")
    return int(value)


def require_recorded_failure(log_text: str) -> dict:
    typecheck_exit = exit_code_after(log_text, "[CMD-1] pnpm typecheck")
    build_exit = exit_code_after(log_text, "[CMD-3] next build --webpack")
    ts2307_count = log_text.count("error TS2307")
    if typecheck_exit != 2 or build_exit != 1 or ts2307_count != 8 or "Found 4 errors in 2 files." not in log_text:
        fail(
            f"recorded failure typecheckExit={typecheck_exit} buildExit={build_exit} "
            f"ts2307Count={ts2307_count}"
        )
    return {"typecheckExit": typecheck_exit, "webpackBuildExit": build_exit, "ts2307Mentions": ts2307_count}


def require_tsconfig_unchanged() -> None:
    config = json.loads(TSCONFIG_PATH.read_text(encoding="utf-8"))
    include = config.get("include")
    exclude = config.get("exclude")
    expected_include = ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"]
    expected_exclude = ["node_modules", "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/baseline/files"]
    if include != expected_include or exclude != expected_exclude:
        fail(f"tsconfig include={include!r} exclude={exclude!r}")


def require_acceptance_files() -> dict:
    counts = {"product": 0, "handoff": 0, "new-manifest": 0, "body": 0}
    for role, relative_path, expected in ACCEPTANCE_FILES:
        require_sha256(REPO_ROOT / relative_path, expected, f"acceptance {role} {relative_path}")
        counts[role] += 1
    if counts != {"product": 15, "handoff": 2, "new-manifest": 1, "body": 2}:
        fail(f"acceptance counts={counts}")
    counts["failed"] = 0
    return counts


def require_apply_script_contract(script_text: str) -> None:
    write_en = 'write_text(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx"'
    write_zh = 'write_text(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx"'
    read_en = '(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.en.tsx").read_text'
    read_zh = '(REPO_ROOT / "src/blog/articles/house-upgrade-stardew.zh.tsx").read_text'
    if script_text.count(write_en) != 1 or script_text.count(write_zh) != 1:
        fail(f"product write count en={script_text.count(write_en)} zh={script_text.count(write_zh)}")
    if script_text.count(read_en) != 2 or script_text.count(read_zh) != 2:
        fail(f"product read count en={script_text.count(read_en)} zh={script_text.count(read_zh)}")
    if "require_article_archives(baseline)" not in script_text or "oldArchivePath" not in script_text:
        fail("apply script missing archive locator read")
    if "archive-fix/archive-location-map.json" not in script_text:
        fail("apply script missing location map path")
    hardcoded = "baseline/src/blog/articles/house-upgrade-stardew.en.tsx\""
    if hardcoded in script_text:
        fail(f"apply script hardcodes archive path={hardcoded}")


def call_require_article_archives(manifest: dict) -> None:
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("apply_pixel_v2_archive_locator", APPLY_SCRIPT_PATH)
    if spec is None or spec.loader is None:
        fail(f"cannot load apply script path={APPLY_SCRIPT_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.require_article_archives(manifest)


def require_historical_checksum_status() -> dict:
    completed = subprocess.run(
        ["shasum", "-a", "256", "-c", str(CHECKSUMS_PATH)],
        cwd=REPO_ROOT,
        check=False,
        text=True,
        capture_output=True,
    )
    output = completed.stdout + completed.stderr
    ok_count = sum(1 for line in completed.stdout.splitlines() if line.endswith(": OK"))
    failed_lines = [line for line in completed.stdout.splitlines() if "FAILED" in line]
    expected_failed = {spec["oldArchivePath"] for spec in ARTICLE_SPECS}
    failed_paths = {line.split(":", 1)[0] for line in failed_lines}
    if completed.returncode != 1 or ok_count != 33 or failed_paths != expected_failed:
        fail(
            f"historical shasum exit={completed.returncode} ok={ok_count} "
            f"failed={sorted(failed_paths)} output={output}"
        )
    manifest_ok = f"{MANIFEST_PATH.relative_to(REPO_ROOT).as_posix()}: OK"
    if manifest_ok not in completed.stdout:
        fail(f"historical manifest checksum line missing line={manifest_ok!r}")
    return {"exitCode": completed.returncode, "okCount": ok_count, "failedCount": len(failed_lines)}


def verify_article_archive_locator() -> dict:
    if HISTORY_ROOT.exists():
        fail(f"history copy still exists path={HISTORY_ROOT}")
    typescript = active_typescript_files()
    if typescript:
        fail(f"active typescript={typescript}")
    require_sha256(MANIFEST_PATH, MANIFEST_SHA256, "baseline manifest")
    require_sha256(CHECKSUMS_PATH, CHECKSUMS_SHA256, "baseline checksums")
    if len(MANIFEST_PATH.read_bytes()) != 15194 or len(CHECKSUMS_PATH.read_bytes()) != 6302:
        fail(
            f"index bytes manifest={len(MANIFEST_PATH.read_bytes())} "
            f"checksums={len(CHECKSUMS_PATH.read_bytes())}"
        )
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    evidence = require_recorded_failure(EVIDENCE_LOG_PATH.read_text(encoding="utf-8"))
    require_tsconfig_unchanged()
    acceptance = require_acceptance_files()
    for spec in ARTICLE_SPECS:
        old_path = REPO_ROOT / spec["oldArchivePath"]
        new_path = REPO_ROOT / spec["newArchivePath"]
        if old_path.exists():
            fail(f"old archive still exists path={old_path}")
        payload = new_path.read_bytes()
        actual = hashlib.sha256(payload).hexdigest()
        if actual != spec["sha256"] or len(payload) != spec["byteSize"]:
            fail(f"archive bytes path={new_path} sha256={actual} bytes={len(payload)}")
    require_apply_script_contract(APPLY_SCRIPT_PATH.read_text(encoding="utf-8"))
    call_require_article_archives(manifest)
    shasum = require_historical_checksum_status()
    evidence.update(
        {
            "typescriptAfter": typescript,
            "manifestSha256": MANIFEST_SHA256,
            "checksumsSha256": CHECKSUMS_SHA256,
            "acceptance": acceptance,
            "shasum": shasum,
            "applyScriptMainExecuted": False,
        }
    )
    return evidence


def write_fix_report(evidence: dict) -> None:
    report = f"""# 文章归档后缀修复

baseline 任务把替换前的英文和中文文章副本保存为 `.tsx`。`tsconfig.json` 的 include 含 `**/*.tsx`，exclude 没有 `pixel-v2/baseline`。TypeScript 会编译这两份副本。

原始失败留在 `reviews/integration/checks.log`，没有改写。`pnpm typecheck` 退出码 {evidence['typecheckExit']}。`pnpm exec next build --webpack` 退出码 {evidence['webpackBuildExit']}。日志里 `error TS2307` 出现 {evidence['ts2307Mentions']} 次，是同 4 个错误在 typecheck 和 webpack 各打印一次。摘要是 `Found 4 errors in 2 files.`

两份副本已从 `.tsx` 移动为同目录 `.tsx.txt`。字节数和 sha256 与移动前相同，也与 baseline manifest 里的 source sha256、copy sha256 相同。曾按最初授权改过 `copiedTo` 和 checksums 路径，并把原字节放在 `archive-fix/history/`。收敛后这两份索引已恢复为修复前字节，history 副本已删除。最终 `baseline/manifest.json` sha256 是 `{evidence['manifestSha256']}`，`baseline/checksums.sha256` sha256 是 `{evidence['checksumsSha256']}`。当前定位是 `archive-fix/archive-location-map.json`：`oldArchivePath` 指向原来的 `.tsx` 记录，`newArchivePath` 指向 `.tsx.txt`。

`integration/apply_pixel_v2.py` 只通过这份映射读取这两份归档。产品读取和写入仍是 `src/blog/articles/house-upgrade-stardew.en.tsx` 与 `.zh.tsx`。没有执行该脚本的 `main()`，没有改 `integration/v1/AssemblyManifest.json`，没有重跑 typecheck 或 webpack build。pixel-v2 内没有活跃 `.ts` 或 `.tsx`。

历史 checksums 仍记录旧 `.tsx` 路径，所以 `shasum -a 256 -c baseline/checksums.sha256` 退出码 {evidence['shasum']['exitCode']}：OK {evidence['shasum']['okCount']}，FAILED {evidence['shasum']['failedCount']}。失败的两行就是已经移走的旧路径。`.tsx.txt` 的字节与这两行记录的 sha256 相同。15 个产品文件、2 个新版 handoff 和 1 个新版 AssemblyManifest 的 sha256 未改。
"""
    checks = f"""# article archive suffix fix
evidence: reviews/integration/checks.log
recorded pnpm typecheck exit: {evidence['typecheckExit']}
recorded next build --webpack exit: {evidence['webpackBuildExit']}
recorded TS2307 mentions: {evidence['ts2307Mentions']}
cause: baseline article copies used .tsx inside tsconfig include **/*.tsx
fix: moved those two copies to .tsx.txt; baseline manifest and checksums bytes unchanged
manifest sha256: {evidence['manifestSha256']}
checksums sha256: {evidence['checksumsSha256']}
locator: archive-fix/archive-location-map.json oldArchivePath -> newArchivePath
active typescript: {evidence['typescriptAfter']}
acceptance product={evidence['acceptance']['product']} handoff={evidence['acceptance']['handoff']} newManifest={evidence['acceptance']['new-manifest']} body={evidence['acceptance']['body']} failed={evidence['acceptance']['failed']}
apply script main() executed: no
command: shasum -a 256 -c docs/blog-ops/house-upgrade-stardew/media-redesign/pixel-v2/baseline/checksums.sha256
exit_code: {evidence['shasum']['exitCode']}
ok: {evidence['shasum']['okCount']}
failed: {evidence['shasum']['failedCount']}
failed paths are the historical .tsx names; current bytes are the .tsx.txt files
index restore: manifest and checksums match the pre-fix bytes; archive-fix/history is absent
pycache removed: archive-fix/__pycache__/article_archive_suffix.cpython-314.pyc, integration/__pycache__/apply_pixel_v2.cpython-314.pyc
"""
    summary = {
        "passed": True,
        "typecheckExitRecorded": evidence["typecheckExit"],
        "webpackBuildExitRecorded": evidence["webpackBuildExit"],
        "ts2307Mentions": evidence["ts2307Mentions"],
        "manifestSha256": evidence["manifestSha256"],
        "checksumsSha256": evidence["checksumsSha256"],
        "manifestRewritten": False,
        "checksumsRewritten": False,
        "typescriptAfter": evidence["typescriptAfter"],
        "acceptance": evidence["acceptance"],
        "shasum": evidence["shasum"],
        "applyScriptMainExecuted": False,
        "buildReRun": False,
    }
    REPORT_PATH.write_text(report, encoding="utf-8")
    CHECKS_LOG_PATH.write_text(checks, encoding="utf-8")
    CHECKS_JSON_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2:
        fail(f"argc={len(sys.argv)} argv={sys.argv!r}")
    action = sys.argv[1]
    if action == "verify":
        evidence = verify_article_archive_locator()
        write_fix_report(evidence)
        print(json.dumps({"ok": True, "shasum": evidence["shasum"], "acceptance": evidence["acceptance"]}, ensure_ascii=False))
        return
    fail(f"action={action!r}")


if __name__ == "__main__":
    main()
